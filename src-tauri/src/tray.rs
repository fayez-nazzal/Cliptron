use tauri::{SystemTrayMenu, CustomMenuItem, SystemTray, AppHandle, SystemTrayEvent, Manager};

pub fn init_system_tray() -> SystemTray {
    let show = CustomMenuItem::new("show".to_string(), "Show");
    let quit = CustomMenuItem::new("quit".to_string(), "Quit");

    let tray_menu = SystemTrayMenu::new().add_item(show).add_item(quit);

    let tray = SystemTray::new().with_menu(tray_menu);

    tray
}

pub fn on_system_tray_event (app: &AppHandle, event: SystemTrayEvent) {
    match event {
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
    }
}