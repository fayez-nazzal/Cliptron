#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use crate::commands::clear_history;
use crate::commands::delete_from_history;
use crate::commands::get_history;
use crate::commands::get_mouse_position;
use crate::commands::recopy_at_index;
use crate::commands::register_shortcut;
use crate::commands::save_to_file;
use crate::commands::set_auto_start;
use crate::commands::set_max_items;
use crate::commands::unregister_shortcut;
use auto_launch::*;
use clipboard_master::Master;
use master::init_clipboard;
use master::init_clipboard_handler;
use master::CLIPBOARD_HISTORY;
use once_cell::unsync::Lazy;
use serde::ser::StdError;
use std::env::current_exe;
use std::thread;
use tauri::App;
use tauri::AppHandle;
use tauri::Manager;
use tauri::PhysicalPosition;
use tray::init_system_tray;
use tray::on_system_tray_event;

mod commands;
mod img;
mod master;
mod tray;

struct GlobalAppHandle {
    handle: Option<AppHandle>,
}

static mut GLOBAL_APP_HANDLE: once_cell::unsync::Lazy<GlobalAppHandle> =
    Lazy::new(|| GlobalAppHandle { handle: None });

static mut AUTO_START: Option<AutoLaunch> = None;

#[derive(Clone, serde::Serialize)]
struct HistoryEventPayload {}

enum Event {
    History,
    Shortcut,
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

fn setup(app: &mut App) -> std::result::Result<(), Box<(dyn StdError + 'static)>> {
    let handle = app.handle();
    let handle_clone = handle.clone();

    thread::spawn(move || {
        let handler = init_clipboard_handler(&handle_clone);
        let result = Master::new(handler).run();
        if result.is_err() {
            eprintln!("Error: {}", result.err().unwrap());
        }
    });

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
}

fn run_app(_app_handle: &AppHandle, event: tauri::RunEvent) {
    match event {
        tauri::RunEvent::ExitRequested { api, .. } => {
            api.prevent_exit();
        }
        _ => {}
    }
}

fn main() {
    tauri::Builder::default()
        .manage(init_clipboard())
        .setup(setup)
        .system_tray(init_system_tray())
        .on_system_tray_event(on_system_tray_event)
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
        .run(run_app);
}
