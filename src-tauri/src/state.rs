use std::sync::{Arc, Mutex};

use arboard::Clipboard;
use auto_launch::AutoLaunch;

use crate::master::ClipboardContent;

#[derive(Clone, Copy, PartialEq)]
pub enum ItemSelectBehavior {
    Copy,
    AutoPaste,
}

pub struct AppInnerState {
    pub clipboard: Clipboard,
    pub clipboard_history: Vec<ClipboardContent>,
    pub max_items: usize,
    pub auto_start: Option<AutoLaunch>,
    pub last_active_window: Option<String>,
    pub last_active_element: Option<String>,
    pub item_select_behavior: ItemSelectBehavior,
}

pub struct AppState(pub Arc<Mutex<AppInnerState>>);

pub fn init_state() -> AppState {
    let clipboard = Clipboard::new().unwrap();
    let clipboard_history = Vec::new();
    let max_items = 10;

    AppState(Arc::new(Mutex::new(AppInnerState {
        clipboard,
        clipboard_history,
        max_items,
        auto_start: None,
        last_active_window: None,
        last_active_element: None,
        item_select_behavior: ItemSelectBehavior::Copy,
    })))
}
