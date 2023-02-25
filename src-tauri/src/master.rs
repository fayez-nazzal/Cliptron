use crate::{
    emit_event,
    img::{image_to_base64, imagedata_to_image},
    Event,
};
use arboard::{Clipboard, ImageData};
use clipboard_master::{CallbackResult, ClipboardHandler};
use std::{
    io,
    sync::{Arc, Mutex},
};
use tauri::{AppHandle, Manager};

pub struct AppClipboard(pub Arc<Mutex<Clipboard>>);

pub struct ClipboardContent {
    pub text: String,
    pub image: Option<ImageData<'static>>,
}
pub static mut CLIPBOARD_HISTORY: Vec<ClipboardContent> = Vec::new();
pub static mut MAX_ITEMS: usize = 10;
pub struct Handler<'a> {
    // on_change should be a closure that captures the AppHandle
    on_change: Box<dyn FnMut() + 'a>,
}

impl ClipboardHandler for Handler<'_> {
    fn on_clipboard_change(&mut self) -> CallbackResult {
        (self.on_change)();

        CallbackResult::Next
    }

    fn on_clipboard_error(&mut self, err: io::Error) -> CallbackResult {
        println!("Clipboard Error: {}", err);

        CallbackResult::Next
    }
}

pub fn init_clipboard() -> AppClipboard {
    let clipboard = Clipboard::new().unwrap();
    let clipboard = Arc::new(Mutex::new(clipboard));

    AppClipboard(clipboard)
}

pub fn init_clipboard_handler(handle: &AppHandle) -> Handler {
    let on_clipboard_change = move || {
        let state = handle.state::<AppClipboard>();

        let mut clipboard = state.0.lock().unwrap();

        let copied_text_result = clipboard.get_text();
        let copied_image_result = clipboard.get_image();

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
    };

    let handler = Handler {
        on_change: Box::new(on_clipboard_change),
    };

    handler
}

pub fn ensure_max_items() {
    unsafe {
        if CLIPBOARD_HISTORY.len() > MAX_ITEMS {
            CLIPBOARD_HISTORY.remove(CLIPBOARD_HISTORY.len() - 1);
        }
    }
}

pub fn add_to_history(text: &String, image: Option<ImageData<'static>>) {
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
