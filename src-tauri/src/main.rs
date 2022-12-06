#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use arboard::Clipboard;
use arboard::ImageData;
use clipboard_master::{CallbackResult, ClipboardHandler, Master};
use once_cell::unsync::Lazy;
use core::time;
use enigo::Enigo;
use enigo::MouseControllable;
use image::DynamicImage;
use image::ImageOutputFormat;
use std::io;
use std::io::Cursor;
use std::thread;

struct ClipboardContent {
    text: String,
    image: Option<ImageData<'static>>,
}

static mut CLIPBOARD_HISTORY: Vec<ClipboardContent> = Vec::new();
const KEY_BETWEEN_DELAY: time::Duration = time::Duration::from_millis(10);
const KEY_RELEASE_DELAY: time::Duration = time::Duration::from_millis(20);
static mut IGNORE_INDEX: i32 = -1;

static mut CLIPBOARD: once_cell::unsync::Lazy<arboard::Clipboard> = Lazy::new(|| {
    let clipboard = Clipboard::new().unwrap();
    clipboard
});

fn add_to_history(text: &String, image: Option<ImageData<'static>>) {
    let clipboard_content = ClipboardContent {
        text: text.clone(),
        image: image.clone(),
    };

    unsafe {
        CLIPBOARD_HISTORY.insert(0, clipboard_content);
    }
}

fn image_to_base64(img: &DynamicImage) -> String {
    let mut image_data: Vec<u8> = Vec::new();
    img.write_to(&mut Cursor::new(&mut image_data), ImageOutputFormat::Png)
        .unwrap();
    let res_base64 = base64::encode(image_data);
    format!("data:image/png;base64,{}", res_base64)
}

fn imagedata_to_image(imagedata: &ImageData) -> DynamicImage {
    let image_bytes = &imagedata.bytes;
    let image_width = imagedata.width as u32;
    let image_height = imagedata.height as u32;

    let image_buffer: Vec<u8> = image_bytes.into_iter().map(|x| *x).collect();

    let image = DynamicImage::ImageRgba8(
        image::RgbaImage::from_raw(image_width, image_height, image_buffer).unwrap(),
    );

    image
}

struct Handler;

impl ClipboardHandler for Handler {
    fn on_clipboard_change(&mut self) -> CallbackResult {
        unsafe {
            let copied_text_result = CLIPBOARD.get_text();
            let copied_image_result = CLIPBOARD.get_image();

            let mut copied_text = String::new();

            if copied_image_result.is_ok() {
                let copied_image = copied_image_result.unwrap();
                let image = imagedata_to_image(&copied_image);
                let image_base64 = image_to_base64(&image);

                add_to_history(&image_base64, Some(copied_image));
            } else if copied_text_result.is_ok() {
                copied_text = copied_text_result.unwrap();
                add_to_history(&copied_text, None);
            }
        }

        CallbackResult::Next
    }

    fn on_clipboard_error(&mut self, error: io::Error) -> CallbackResult {
        eprintln!("Error: {}", error);
        CallbackResult::Next
    }
}

#[tauri::command]
fn get_history() -> Vec<String> {
    unsafe {
        return CLIPBOARD_HISTORY.iter().map(|x| x.text.clone()).collect();
    }
}

#[tauri::command]
fn delete_from_history(index: usize) {
    unsafe {
        CLIPBOARD_HISTORY.remove(index);
    }
}

#[tauri::command]
fn clear_history() {
    unsafe {
        CLIPBOARD_HISTORY.clear();
    }
}

#[tauri::command]
fn recopy_at_index(index: usize) {
    unsafe {
        let copied_content = &CLIPBOARD_HISTORY[index];

        if copied_content.image.is_some() {
            CLIPBOARD.set_image(copied_content.image.clone().unwrap());
        } else {
            CLIPBOARD.set_text(copied_content.text.clone());
        }
    }
}

#[tauri::command]
fn get_mouse_position() -> (i32, i32) {
    let cursor_location: (i32, i32) = Enigo::mouse_location();

    cursor_location
}

fn main() {
    thread::spawn(|| {
        let result = Master::new(Handler).run();

        if result.is_err() {
            eprintln!("Error: {}", result.err().unwrap());
        }
    });

    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            get_mouse_position,
            get_history,
            delete_from_history,
            clear_history,
            recopy_at_index,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
