use crate::{
    emit_event,
    img::{image_to_base64, imagedata_to_image},
    state::AppState,
    Event,
};
use arboard::ImageData;
use clipboard_master::{CallbackResult, ClipboardHandler};
use std::io;
use tauri::{AppHandle, Manager};

#[derive(Clone)]
pub struct ClipboardContent {
    pub text: String,
    pub image: Option<ImageData<'static>>,
}

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

pub fn init_clipboard_handler(handle: &AppHandle) -> Handler {
    let on_clipboard_change = move || {
        let state = handle.state::<AppState>();
        let mut app_state = state.0.lock().unwrap();
        let max_items = (&app_state).max_items;
        let clipboard = &mut app_state.clipboard;

        let copied_text_result = clipboard.get_text();
        let copied_image_result = clipboard.get_image();

        let copied_text;

        if copied_image_result.is_ok() {
            let copied_image = copied_image_result.unwrap();
            let image = imagedata_to_image(&copied_image);
            let image_base64 = image_to_base64(&image);

            add_to_history(
                &image_base64,
                Some(copied_image),
                &mut app_state.clipboard_history,
                max_items,
                handle,
            );
        } else if copied_text_result.is_ok() {
            copied_text = copied_text_result.unwrap();
            add_to_history(
                &copied_text,
                None,
                &mut app_state.clipboard_history,
                max_items,
                handle,
            );
        }
    };

    let handler = Handler {
        on_change: Box::new(on_clipboard_change),
    };

    handler
}

pub fn ensure_max_items(max_items: usize, clipboard_history: &mut Vec<ClipboardContent>) {
    let length = (&clipboard_history).len();
    if length > max_items {
        clipboard_history.remove(length - 1);
    }
}

pub fn add_to_history(
    text: &String,
    image: Option<ImageData<'static>>,
    clipboard_history: &mut Vec<ClipboardContent>,
    max_items: usize,
    handle: &AppHandle,
) {
    let clipboard_content = ClipboardContent {
        text: text.clone(),
        image: image.clone(),
    };

    clipboard_history.insert(0, clipboard_content);
    ensure_max_items(max_items, clipboard_history);
    emit_event(Event::History, &handle);
}
