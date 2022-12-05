#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use enigo::Enigo;
use enigo::MouseControllable;

#[tauri::command]
fn get_mouse_position() -> (i32, i32) {
    let cursor_location: (i32, i32) = Enigo::new().mouse_location();

    cursor_location
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![get_mouse_position])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
