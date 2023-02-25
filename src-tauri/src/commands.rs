use std::{thread, fs::File, io::Write};

use mouse_position::mouse_position::Mouse;

use crate::{CLIPBOARD, CLIPBOARD_HISTORY, imagedata_to_image, AUTO_START, MAX_ITEMS, ensure_max_items, emit_event, Event};

#[tauri::command(async)]
pub fn recopy_at_index(index: usize) {
    unsafe {
        let copied_content = &CLIPBOARD_HISTORY[index];

        if copied_content.image.is_some() {
            CLIPBOARD.set_image(copied_content.image.clone().unwrap()).expect("Failed to set image");
        } else {
            CLIPBOARD.set_text(copied_content.text.clone()).expect("Failed to set text");
        }

        let timeout = std::time::Duration::from_millis(100);
        thread::sleep(timeout);
        
        #[cfg(target_os = "windows")]
        {
            use winapi::um::winuser::{keybd_event, VK_CONTROL, KEYEVENTF_EXTENDEDKEY};
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
pub fn save_to_file(index: usize, path: String) {
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
pub fn set_auto_start(value: bool) {
    unsafe {
        if AUTO_START != None {
            if value {
                AUTO_START.as_ref().unwrap().enable().unwrap();
            } else {
                AUTO_START.as_ref().unwrap().disable().unwrap();
            }
        }
    }
}

#[tauri::command(async)]
pub fn set_max_items(value: usize) {
    unsafe {
        MAX_ITEMS = value;
        ensure_max_items();
    }
}

#[tauri::command(async)]
pub fn get_history() -> Vec<String> {
    unsafe {
        return CLIPBOARD_HISTORY.iter().map(|x| x.text.clone()).collect();
    }
}

#[tauri::command]
pub fn delete_from_history(index: usize) {
    unsafe {
        CLIPBOARD_HISTORY.remove(index);

        emit_event(Event::History)
    }
}

#[tauri::command]
pub fn clear_history() {
    unsafe {
        CLIPBOARD_HISTORY.clear();

        emit_event(Event::History)
    }
}