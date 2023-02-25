use std::io::Cursor;

use arboard::ImageData;
use image::DynamicImage;
use image::ImageOutputFormat;

pub fn image_to_base64(img: &DynamicImage) -> String {
    let mut img = img.clone();
    let max_width = 180;
    let max_height = 160;
    let img_width = img.width();
    let img_height = img.height();

    if img_width > max_width || img_height > max_height {
        let ratio = img_width as f32 / img_height as f32;
        let mut new_width = max_width as f32;
        let mut new_height = new_width / ratio;

        if new_height > max_height as f32 {
            new_height = max_height as f32;
            new_width = new_height * ratio;
        }

        img = img.resize(
            new_width as u32,
            new_height as u32,
            image::imageops::FilterType::Nearest,
        );
    }

    let mut image_data: Vec<u8> = Vec::new();
    img.write_to(&mut Cursor::new(&mut image_data), ImageOutputFormat::Png)
        .unwrap();

    let res_base64 = base64::encode(image_data);
    format!("data:image/png;base64,{}", res_base64)
}

pub fn imagedata_to_image(imagedata: &ImageData) -> DynamicImage {
    let image_bytes = &imagedata.bytes;
    let image_width = imagedata.width as u32;
    let image_height = imagedata.height as u32;

    let image_buffer: Vec<u8> = image_bytes.into_iter().map(|x| *x).collect();

    let image = DynamicImage::ImageRgba8(
        image::RgbaImage::from_raw(image_width, image_height, image_buffer)
            .expect("Failed to create image"),
    );

    image
}