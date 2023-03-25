#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use crate::commands::clear_history;
use crate::commands::delete_from_history;
use crate::commands::get_history;
use crate::commands::get_mouse_position;
use crate::commands::hide_window;
use crate::commands::select_clipboard_item;
use crate::commands::register_shortcut;
use crate::commands::save_to_file;
use crate::commands::set_auto_start;
use crate::commands::set_item_select_behavior;
use crate::commands::set_max_items;
use crate::commands::unregister_shortcut;
use auto_launch::*;
use clipboard_master::Master;
use master::init_clipboard_handler;
use serde::ser::StdError;
use state::init_state;
use state::AppState;
use std::env::current_exe;
use std::thread;
use tauri::App;
use tauri::AppHandle;
use tauri::Manager;
use tray::init_system_tray;
use tray::on_system_tray_event;
#[cfg(target_os = "macos")]
use tauri::ActivationPolicy;

mod commands;
mod img;
mod master;
mod state;
mod tray;
mod autopaste;

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

fn emit_event(event: Event, handle: &AppHandle) {
    handle
        .emit_all(event.to_string().as_str(), HistoryEventPayload {})
        .unwrap();
}

fn setup(app: &mut App) -> std::result::Result<(), Box<(dyn StdError + 'static)>> {
    #[cfg(target_os = "macos")]
    app.set_activation_policy(ActivationPolicy::Accessory);
    
    let handle = app.handle();
    let handle_clone = handle.clone();

    thread::spawn(move || {
        let handler = init_clipboard_handler(&handle_clone);
        let result = Master::new(handler).run();
        if result.is_err() {
            eprintln!("Error: {}", result.err().unwrap());
        }
    });

    let app_name = &app.package_info().name;
    let current_exe = current_exe().unwrap();

    let state = (&handle).state::<AppState>();
    let mut app_state = state.0.lock().unwrap();

    app_state.auto_start = Some(
        AutoLaunchBuilder::new()
            .set_app_name(&app_name)
            .set_app_path(&current_exe.to_str().unwrap())
            .set_use_launch_agent(true)
            .build()
            .unwrap(),
    );

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
        .manage(init_state())
        .setup(setup)
        .system_tray(init_system_tray())
        .on_system_tray_event(on_system_tray_event)
        .invoke_handler(tauri::generate_handler![
            get_mouse_position,
            get_history,
            delete_from_history,
            clear_history,
            select_clipboard_item,
            save_to_file,
            set_auto_start,
            set_max_items,
            register_shortcut,
            unregister_shortcut,
            hide_window,
            set_item_select_behavior,
        ])
        .build(tauri::generate_context!())
        .expect("error while building tauri application")
        .run(run_app);
}
