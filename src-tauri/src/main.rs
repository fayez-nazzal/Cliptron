#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use arboard::Clipboard;
use arboard::ImageData;
use auto_launch::*;
use clipboard_master::{CallbackResult, ClipboardHandler, Master};
use enigo::Enigo;
use image::DynamicImage;
use image::ImageOutputFormat;
use once_cell::unsync::Lazy;
use std::env::current_exe;
use std::fs::File;
use std::io;
use std::io::Cursor;
use std::io::Write;
use std::thread;
use tauri::AppHandle;
use tauri::Manager;
use tauri::{CustomMenuItem, SystemTray, SystemTrayEvent, SystemTrayMenu};

struct ClipboardContent {
    text: String,
    image: Option<ImageData<'static>>,
}

static mut CLIPBOARD_HISTORY: Vec<ClipboardContent> = Vec::new();

static mut CLIPBOARD: once_cell::unsync::Lazy<arboard::Clipboard> = Lazy::new(|| {
    let clipboard = Clipboard::new().unwrap();
    clipboard
});

static mut MAX_ITEMS: usize = 10;

struct GlobalAppHandle {
    handle: Option<AppHandle>,
}

static mut GLOBAL_APP_HANDLE: once_cell::unsync::Lazy<GlobalAppHandle> =
    Lazy::new(|| GlobalAppHandle { handle: None });

static mut auto_start: Option<AutoLaunch> = None;

#[derive(Clone, serde::Serialize)]
struct HistoryEventPayload {}

fn emit_history_event() {
    unsafe {
        GLOBAL_APP_HANDLE
            .handle
            .as_ref()
            .unwrap()
            .emit_all("history", HistoryEventPayload {})
            .unwrap();
    }
}

fn ensure_max_items() {
    unsafe {
        if CLIPBOARD_HISTORY.len() > MAX_ITEMS {
            CLIPBOARD_HISTORY.remove(CLIPBOARD_HISTORY.len() - 1);
        }
    }
}

fn add_to_history(text: &String, image: Option<ImageData<'static>>) {
    let clipboard_content = ClipboardContent {
        text: text.clone(),
        image: image.clone(),
    };

    unsafe {
        CLIPBOARD_HISTORY.insert(0, clipboard_content);

        ensure_max_items();
        emit_history_event()
    }
}

fn image_to_base64(img: &DynamicImage) -> String {
    let mut img = img.clone();
    let max_width = 180;
    let max_height = 160;
    let img_width = img.width();
    let img_height = img.height();

    if img_width > max_width || img_height > max_height {
        let ratio = img_width as f32 / img_height as f32;
        let mut new_width = max_width as f32;
        let mut new_height = new_width / ratio;

        if new_height > max_height as f32 {
            new_height = max_height as f32;
            new_width = new_height * ratio;
        }

        img = img.resize(
            new_width as u32,
            new_height as u32,
            image::imageops::FilterType::Nearest,
        );
    }

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
        image::RgbaImage::from_raw(image_width, image_height, image_buffer).expect("Failed to create image"),
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

#[tauri::command(async)]
fn get_history() -> Vec<String> {
    unsafe {
        return CLIPBOARD_HISTORY.iter().map(|x| x.text.clone()).collect();
    }
}

#[tauri::command]
fn delete_from_history(index: usize) {
    unsafe {
        CLIPBOARD_HISTORY.remove(index);

        emit_history_event()
    }
}

#[tauri::command]
fn clear_history() {
    unsafe {
        CLIPBOARD_HISTORY.clear();

        emit_history_event()
    }
}

#[tauri::command(async)]
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

#[cfg(target_os = "linux")]
fn get_mouse_position_linux() -> (i32, i32) {
    use std::{process::{Command, Stdio}, io::{Read, BufReader}};

    let output = match Command::new("xdotool")
            .arg("getmouselocation")
            .arg("--shell")
            .stdout(Stdio::piped())
            .spawn() {
        Ok(it) => it,
        Err(_) => return (0, 0),
    }
        .stdout
        .ok_or(io::Error::new(io::ErrorKind::Other, "Failed to capture xdotool output")).unwrap();

    let mut reader = BufReader::new(output);
    let mut buffer = String::new();
    reader.read_to_string(&mut buffer).unwrap();

    let mut x = 0;
    let mut y = 0;

    for line in buffer.lines() {
        let mut parts = line.split('=');
        let key = parts.next().unwrap();
        let value = parts.next().unwrap();

        if key == "X" {
            x = value.parse().unwrap();
        } else if key == "Y" {
            y = value.parse().unwrap();
        }
    }

    (x, y)
}

#[cfg(any(target_os = "windows", target_os = "macos"))]
fn get_mouse_position_mac_windows() -> (i32, i32) {
    Enigo::mouse_location()
}

#[tauri::command]
fn get_mouse_position() -> (i32, i32) {
    #[cfg(target_os = "linux")]
    return get_mouse_position_linux();

    #[cfg(any(target_os = "windows", target_os = "macos"))]
    return get_mouse_position_mac_windows();
}

#[tauri::command]
fn save_to_file(index: usize, path: String) {
    unsafe {
        let copied_content = &CLIPBOARD_HISTORY[index];

        if copied_content.image.is_some() {
            let image = imagedata_to_image(&copied_content.image.clone().unwrap());
            let mut path_with_extension = path.clone();
            
            // if path doesn't have an extension, add .png
            if path_with_extension.split('.').count() == 1 {
                path_with_extension.push_str(".png");
            }

            image.save(path_with_extension).unwrap();
        } else {
            let mut file = File::create(path).unwrap();
            file.write_all(copied_content.text.as_bytes()).unwrap();
        }
    }
}

#[tauri::command(async)]
fn set_auto_start(value: bool) {
    unsafe {
        if auto_start != None {
            if value {
                auto_start.as_ref().unwrap().enable().unwrap();
            } else {
                auto_start.as_ref().unwrap().disable().unwrap();
            }
        }
    }
}

#[tauri::command(async)]
fn set_max_items(value: usize) {
    unsafe {
        MAX_ITEMS = value;
        ensure_max_items();
    }
}

fn main() {
    thread::spawn(|| {
        let result = Master::new(Handler).run();

        if result.is_err() {
            eprintln!("Error: {}", result.err().unwrap());
        }
    });

    let show = CustomMenuItem::new("show".to_string(), "Show");
    let quit = CustomMenuItem::new("quit".to_string(), "Quit");

    let tray_menu = SystemTrayMenu::new().add_item(show).add_item(quit);

    let tray = SystemTray::new().with_menu(tray_menu);

    tauri::Builder::default()
        .setup(|app| {
            let handle = app.handle();
            unsafe {
                GLOBAL_APP_HANDLE.handle = Some(handle);
            }

            let app_name = &app.package_info().name;
            let current_exe = current_exe().unwrap();

            unsafe {
                auto_start = Some(
                    AutoLaunchBuilder::new()
                        .set_app_name(&app_name)
                        .set_app_path(&current_exe.to_str().unwrap())
                        .set_use_launch_agent(true)
                        .build()
                        .unwrap(),
                );
            }

            Ok(())
        })
        .system_tray(tray)
        .on_system_tray_event(|app, event| match event {
            SystemTrayEvent::LeftClick {
                position: _,
                size: _,
                ..
            } => {
                let main_window = app.get_window("main").unwrap();
                main_window.show().unwrap();
            }
            SystemTrayEvent::MenuItemClick { id, .. } => match id.as_str() {
                "show" => {
                    let main_window = app.get_window("main").unwrap();
                    main_window.show().unwrap();
                }
                "quit" => {
                    app.exit(0);
                }
                _ => {}
            },
            _ => {}
        })
        .invoke_handler(tauri::generate_handler![
            get_mouse_position,
            get_history,
            delete_from_history,
            clear_history,
            recopy_at_index,
            save_to_file,
            set_auto_start,
            set_max_items
        ])
        .build(tauri::generate_context!())
        .expect("error while building tauri application")
        .run(|_app_handle, event| match event {
            tauri::RunEvent::ExitRequested { api, .. } => {
                api.prevent_exit();
            }
            _ => {}
        });
}
