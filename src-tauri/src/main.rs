#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use arboard::Clipboard;
use arboard::ImageData;
use auto_launch::*;
use clipboard_master::{CallbackResult, ClipboardHandler, Master};
use image::DynamicImage;
use image::ImageOutputFormat;
use once_cell::unsync::Lazy;
use tauri::PhysicalPosition;
use std::env::current_exe;
use std::io;
use std::io::Cursor;
use std::thread;
use tauri::AppHandle;
use tauri::GlobalShortcutManager;
use tauri::Manager;
use tauri::{CustomMenuItem, SystemTray, SystemTrayEvent, SystemTrayMenu};

use crate::commands::clear_history;
use crate::commands::delete_from_history;
use crate::commands::get_history;
use crate::commands::get_mouse_position;
use crate::commands::recopy_at_index;
use crate::commands::save_to_file;
use crate::commands::set_auto_start;
use crate::commands::set_max_items;
mod commands;

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

static mut AUTO_START: Option<AutoLaunch> = None;

#[derive(Clone, serde::Serialize)]
struct HistoryEventPayload {}

enum  Event {
    History,
    Shortcut
}

impl Event {
    fn to_string(&self) -> String {
        match self {
            Event::History => "history".to_string(),
            Event::Shortcut => "shortcut".to_string(),
        }
    }
}

fn emit_event(event: Event) {
    unsafe {
        GLOBAL_APP_HANDLE
            .handle
            .as_ref()
            .unwrap()
            .emit_all(event.to_string().as_str(), HistoryEventPayload {})
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
        emit_event(Event::History)
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
        image::RgbaImage::from_raw(image_width, image_height, image_buffer)
            .expect("Failed to create image"),
    );

    image
}

struct Handler;

impl ClipboardHandler for Handler {
    fn on_clipboard_change(&mut self) -> CallbackResult {
        unsafe {
            let copied_text_result = CLIPBOARD.get_text();
            let copied_image_result = CLIPBOARD.get_image();

            let copied_text;

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


fn on_shortcut() {
    unsafe {
        let app = GLOBAL_APP_HANDLE.handle.as_ref().unwrap();

        let mouse_position = get_mouse_position();

        let app_window = app.get_window("main").unwrap();

        let window_size = app_window.inner_size().unwrap();

        let result = app_window.set_position(tauri::Position::Physical(PhysicalPosition::new(
            mouse_position.0 as i32 - (window_size.width / 2) as i32,
            mouse_position.1 as i32,
        )));

        if result.is_err() {
            eprintln!("Error: {}", result.err().unwrap());
            return;
        }

        let result = app_window.show();

        if result.is_err() {
            eprintln!("Error: {}", result.err().unwrap());
            return;
        }

        emit_event(Event::Shortcut);
    }
}

#[tauri::command(async)]
fn register_shortcut(shortcut: &str, previous_shortcut: Option<&str>) {
    println!("register called with {}", shortcut);
    
    // get global app handle
    unsafe {
        let app = GLOBAL_APP_HANDLE.handle.as_ref().unwrap();

        // unregister previous shortcut
        if previous_shortcut.is_some() {
            app.global_shortcut_manager()
                .unregister(previous_shortcut.unwrap())
                .unwrap();
        }

        app.global_shortcut_manager()
            .register(shortcut, move || on_shortcut())
            .unwrap();
    }
}

#[tauri::command(async)]
fn unregister_shortcut(shortcut: &str) {
    // get global app handle
    unsafe {
        let app = GLOBAL_APP_HANDLE.handle.as_ref().unwrap();

        app.global_shortcut_manager()
            .unregister(shortcut)
            .unwrap();
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
                AUTO_START = Some(
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
            set_max_items,
            register_shortcut,
            unregister_shortcut
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
