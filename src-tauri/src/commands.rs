use crate::{
    emit_event, img::imagedata_to_image, master::ensure_max_items, state::AppState, Event,
};
use mouse_position::mouse_position::Mouse;
use std::{fs::File, io::Write, process::Command, thread};
use tauri::{GlobalShortcutManager, Manager, PhysicalPosition};

fn on_shortcut(handle: tauri::AppHandle) {
    let state = handle.state::<AppState>();
    let mut app_state = state.0.lock().unwrap();

    #[cfg(target_os = "macos")]
    {
        let frontAppScript = r#"
        tell application "System Events"
            set frontApp to name of first application process whose frontmost is true
        end tell

        frontApp
    "#;

        let output = Command::new("osascript")
            .arg("-e")
            .arg(frontAppScript)
            .output()
            .expect("failed to execute process");

        let output = String::from_utf8(output.stdout).unwrap();

        let output = output.trim();

        app_state.last_active_window = Some(output.to_string());
    }

    let mouse_position = get_mouse_position();
    let app_window = handle.get_window("main").unwrap();
    let window_size = app_window.inner_size().unwrap();

    let result = app_window.set_position(tauri::Position::Physical(PhysicalPosition::new(
        mouse_position.0 as i32 - (window_size.width / 2) as i32,
        mouse_position.1 as i32,
    )));

    if result.is_err() {
        eprintln!("Error: {}", result.err().unwrap());
        return;
    }

    let result = app_window.unminimize();

    if result.is_err() {
        eprintln!("Error: {}", result.err().unwrap());
        return;
    }
    
    app_window.show().unwrap();
    app_window.set_focus().unwrap();

    emit_event(Event::Shortcut, &handle);
}

#[tauri::command(async)]
pub fn recopy_at_index(index: usize, handle: tauri::AppHandle) {
    let state = handle.state::<AppState>();
    let mut app_state = state.0.lock().unwrap();
    let clipboard_history = (&app_state).clipboard_history.clone();

    let copied_content = &clipboard_history[index];

    if copied_content.image.is_some() {
        app_state
            .clipboard
            .set_image(copied_content.image.clone().unwrap())
            .expect("Failed to set image");
    } else {
        app_state
            .clipboard
            .set_text(copied_content.text.clone())
            .expect("Failed to set text");
    }

    let timeout = std::time::Duration::from_millis(100);
    thread::sleep(timeout);

    #[cfg(target_os = "windows")]
    {
        use winapi::um::winuser::{keybd_event, KEYEVENTF_EXTENDEDKEY, VK_CONTROL};
        keybd_event(VK_CONTROL as u8, 0, 0, 0);
        keybd_event(86, 0, KEYEVENTF_EXTENDEDKEY, 0);
        keybd_event(
            86,
            0,
            KEYEVENTF_EXTENDEDKEY | winapi::um::winuser::KEYEVENTF_KEYUP,
            0,
        );
        keybd_event(VK_CONTROL as u8, 0, winapi::um::winuser::KEYEVENTF_KEYUP, 0);
    }

    #[cfg(target_os = "macos")]
    {
        let last_active_window = app_state.last_active_window.clone();

        let refocusScript = format!(
            r#"tell application "{}"
            activate
            delay 0.02
            tell application "System Events" to keystroke "v" using command down
        end tell"#,
            last_active_window.unwrap()
        );

        let output = Command::new("osascript")
            .arg("-e")
            .arg(refocusScript)
            .output()
            .expect("failed to execute process");

        let output = String::from_utf8(output.stdout).unwrap();

        let output = output.trim();

        println!("Output: {}", output);
    }
}

#[tauri::command]
pub fn get_mouse_position() -> (i32, i32) {
    let position = Mouse::get_mouse_position();
    let position = match position {
        Mouse::Position { x, y } => (x, y),
        Mouse::Error => (0, 0),
    };

    position
}

#[tauri::command]
pub fn save_to_file(index: usize, path: String, handle: tauri::AppHandle) {
    let state = handle.state::<AppState>();
    let app_state = state.0.lock().unwrap();
    let clipboard_history = (&app_state).clipboard_history.clone();

    let copied_content = &clipboard_history[index];

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

#[tauri::command(async)]
pub fn set_auto_start(value: bool, handle: tauri::AppHandle) {
    let state = handle.state::<AppState>();
    let app_state = state.0.lock().unwrap();
    let auto_start = &app_state.auto_start;

    if auto_start.is_some() {
        if value {
            auto_start.as_ref().unwrap().enable().unwrap();
        } else {
            auto_start.as_ref().unwrap().disable().unwrap();
        }
    }
}

#[tauri::command(async)]
pub fn set_max_items(value: usize, handle: tauri::AppHandle) {
    let state = handle.state::<AppState>();
    let mut app_state = state.0.lock().unwrap();

    app_state.max_items = value;
    ensure_max_items(value, &mut (app_state.clipboard_history));
}

#[tauri::command(async)]
pub fn get_history(handle: tauri::AppHandle) -> Vec<String> {
    let state = handle.state::<AppState>();
    let app_state = state.0.lock().unwrap();
    let clipboard_history = &app_state.clipboard_history;

    return clipboard_history.iter().map(|x| x.text.clone()).collect();
}

#[tauri::command]
pub fn delete_from_history(index: usize, handle: tauri::AppHandle) {
    let state = handle.state::<AppState>();
    let mut app_state = state.0.lock().unwrap();
    let clipboard_history = &mut (app_state.clipboard_history);

    clipboard_history.remove(index);

    emit_event(Event::History, &handle);
}

#[tauri::command]
pub fn clear_history(handle: tauri::AppHandle) {
    let state = handle.state::<AppState>();
    let mut app_state = state.0.lock().unwrap();
    let clipboard_history = &mut (app_state.clipboard_history);

    clipboard_history.clear();

    emit_event(Event::History, &handle);
}

#[tauri::command(async)]
pub fn register_shortcut(
    shortcut: &str,
    previous_shortcut: Option<&str>,
    handle: tauri::AppHandle,
) {
    let mut global_shortcut_manager = handle.global_shortcut_manager();

    // unregister previous shortcut
    if previous_shortcut.is_some() {
        global_shortcut_manager
            .unregister(previous_shortcut.unwrap())
            .unwrap();
    }

    global_shortcut_manager
        .register(shortcut, move || {
            on_shortcut(handle.clone());
        })
        .unwrap();
}

#[tauri::command(async)]
pub fn unregister_shortcut(shortcut: &str, handle: tauri::AppHandle) {
    handle
        .global_shortcut_manager()
        .unregister(shortcut)
        .unwrap();
}

#[tauri::command(async)]
pub fn hide_window(handle: tauri::AppHandle) {
    println!("hiding");
    let app_window = handle.get_window("main").unwrap();
    let result = app_window.set_always_on_top(false);

    if result.is_err() {
        eprintln!("Error setting always on top");
    }

    app_window.hide().expect("Failed to hide window");
}