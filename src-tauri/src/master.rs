use std::io;
use arboard::{ImageData, Clipboard};
use clipboard_master::{ClipboardHandler, CallbackResult};
use once_cell::unsync::Lazy;
use crate::{emit_event, Event, img::{imagedata_to_image, image_to_base64}};


pub static mut CLIPBOARD: once_cell::unsync::Lazy<arboard::Clipboard> = Lazy::new(|| {
    let clipboard = Clipboard::new().unwrap();
    clipboard
});
pub struct ClipboardContent {
    pub text: String,
    pub image: Option<ImageData<'static>>,
}
pub static mut CLIPBOARD_HISTORY: Vec<ClipboardContent> = Vec::new();
pub static mut MAX_ITEMS: usize = 10;
pub struct Handler;

impl ClipboardHandler for Handler {
    fn on_clipboard_change(&mut self) -> CallbackResult {
        unsafe {
            let copied_text_result = CLIPBOARD.get_text();
            let copied_image_result = CLIPBOARD.get_image();

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
        }

        CallbackResult::Next
    }

    fn on_clipboard_error(&mut self, error: io::Error) -> CallbackResult {
        eprintln!("Error: {}", error);
        CallbackResult::Next
    }
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
