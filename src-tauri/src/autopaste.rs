use std::process::Command;

pub fn paste_from_clipboard(last_active_window: String, _last_active_element: Option<String>) {
    #[cfg(target_os = "windows")]
    {
        use winapi::um::winuser::{keybd_event, KEYEVENTF_EXTENDEDKEY, VK_CONTROL};
        unsafe {
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

    #[cfg(target_os = "linux")]
    {
        Command::new("xdotool")
            .args(&["key", "ctrl+v"])
            .output()
            .expect("Failed to simulate Ctrl+V key press");
    }

    #[cfg(target_os = "macos")]
    {
        let last_active_window = last_active_window.clone();

        println!("{:?}", (&last_active_window));

        let refocus_script = format!(
            r#"tell application id "{}"
            activate
            delay .02
            tell application "System Events" to keystroke "v" using command down
        end tell"#,
            last_active_window
        );

        println!("{}", refocus_script);

        let output = Command::new("osascript")
            .arg("-e")
            .arg(refocus_script)
            .output()
            .expect("failed to execute process");

        let output = String::from_utf8(output.stdout).unwrap();

        let output = output.trim();

        println!("Output: {}", output);                 
    }
}

// returns the active window (mac,linux) and the active UI element (linux)
pub fn get_active_elements() -> (Option<String>, Option<String>) {
    #[cfg(target_os = "macos")]
    {
        let front_app_script = r#"
        tell application "System Events"
            set frontApp to bundle identifier of first application process whose frontmost is true
        end tell

        frontApp
    "#;

        let output = Command::new("osascript")
            .arg("-e")
            .arg(front_app_script)
            .output()
            .expect("failed to execute process");

        let output = String::from_utf8(output.stdout).unwrap();

        let output = output.trim();

        return (Some(output.to_string()), None);
    }

    #[cfg(target_os = "linux")]
    {
        let active_win_id_output = Command::new("xdotool")
            .args(&["getactivewindow"])
            .output()
            .expect("Failed to get active window ID");
        let active_win_id = String::from_utf8_lossy(&active_win_id_output.stdout)
            .trim()
            .to_string();

        let active_element_name_output = Command::new("xprop")
            .args(&["-id", &active_win_id, "_NET_WM_NAME"])
            .output()
            .expect("Failed to get active element name");
        let active_element_name =
            String::from_utf8_lossy(&active_element_name_output.stdout).to_string();

        println!("Active window id: {}", active_win_id.to_string());
        println!("Active element name: {}", active_element_name.to_string());

        return (Some(active_win_id), Some(active_element_name));
    }


}