use image::{RgbaImage, DynamicImage, imageops::FilterType, ImageEncoder};
use std::fs::File;
use std::io::{Write, BufWriter};
use std::path::{Path, PathBuf};

const ICON_SIZES: [u32; 6] = [256, 128, 64, 48, 32, 16];

#[derive(Default)]
pub struct IconConverter;

impl IconConverter {
    pub fn convert_to_ico(&self, input_path: &Path) -> Result<(PathBuf, Vec<(u32, DynamicImage)>), String> {
        // 이미지 로드
        let img = image::open(input_path)
            .map_err(|e| format!("이미지 로드 실패: {}", e))?;

        // 출력 경로 생성
        let output_path = self.generate_output_path(input_path);
        
        // ICO 파일 생성 및 미리보기 이미지 반환
        let preview_images = self.create_ico_file(&img, &output_path)?;

        Ok((output_path, preview_images))
    }

    fn generate_output_path(&self, input_path: &Path) -> PathBuf {
        let mut output_path = input_path.with_extension("ico");
        let mut counter = 1;
        
        // 파일이 이미 존재하면 번호를 붙임
        while output_path.exists() {
            let stem = input_path.file_stem().unwrap().to_string_lossy();
            output_path = input_path.with_file_name(format!("{}_({}).ico", stem, counter));
            counter += 1;
        }
        
        output_path
    }

    fn create_ico_file(&self, img: &DynamicImage, output_path: &Path) -> Result<Vec<(u32, DynamicImage)>, String> {
        let file = File::create(output_path)
            .map_err(|e| format!("파일 생성 실패: {}", e))?;
        let mut writer = BufWriter::new(file);

        // ICO 헤더 작성
        self.write_ico_header(&mut writer, ICON_SIZES.len())?;

        // 각 크기별 이미지 데이터 오프셋 계산 및 디렉토리 엔트리 작성
        let header_size = 6 + (16 * ICON_SIZES.len());
        let mut offset = header_size;
        let mut image_data_list = Vec::new();
        let mut preview_images = Vec::new();

        // 먼저 모든 이미지 데이터 생성
        for &size in &ICON_SIZES {
            let resized = img.resize_exact(size, size, FilterType::Lanczos3);
            let rgba = resized.to_rgba8();
            let png_data = self.encode_to_png(&rgba)?;
            image_data_list.push(png_data);
            preview_images.push((size, resized.clone()));
        }

        // 디렉토리 엔트리 작성
        for (i, &size) in ICON_SIZES.iter().enumerate() {
            let data_size = image_data_list[i].len();
            self.write_directory_entry(&mut writer, size, offset, data_size)?;
            offset += data_size;
        }

        // 이미지 데이터 작성
        for data in image_data_list {
            writer.write_all(&data)
                .map_err(|e| format!("이미지 데이터 쓰기 실패: {}", e))?;
        }

        Ok(preview_images)
    }

    fn write_ico_header(&self, writer: &mut BufWriter<File>, num_images: usize) -> Result<(), String> {
        // Reserved (2 bytes): must be 0
        writer.write_all(&[0, 0])
            .map_err(|e| format!("헤더 쓰기 실패: {}", e))?;
        
        // Type (2 bytes): 1 for .ico
        writer.write_all(&[1, 0])
            .map_err(|e| format!("헤더 쓰기 실패: {}", e))?;
        
        // Number of images (2 bytes)
        let num = (num_images as u16).to_le_bytes();
        writer.write_all(&num)
            .map_err(|e| format!("헤더 쓰기 실패: {}", e))?;
        
        Ok(())
    }

    fn write_directory_entry(
        &self,
        writer: &mut BufWriter<File>,
        size: u32,
        offset: usize,
        data_size: usize,
    ) -> Result<(), String> {
        // Width (1 byte): 0 means 256
        let width = if size == 256 { 0 } else { size as u8 };
        writer.write_all(&[width])
            .map_err(|e| format!("디렉토리 엔트리 쓰기 실패: {}", e))?;
        
        // Height (1 byte): 0 means 256
        let height = if size == 256 { 0 } else { size as u8 };
        writer.write_all(&[height])
            .map_err(|e| format!("디렉토리 엔트리 쓰기 실패: {}", e))?;
        
        // Color palette (1 byte): 0 (no palette)
        writer.write_all(&[0])
            .map_err(|e| format!("디렉토리 엔트리 쓰기 실패: {}", e))?;
        
        // Reserved (1 byte): 0
        writer.write_all(&[0])
            .map_err(|e| format!("디렉토리 엔트리 쓰기 실패: {}", e))?;
        
        // Color planes (2 bytes): 1
        writer.write_all(&[1, 0])
            .map_err(|e| format!("디렉토리 엔트리 쓰기 실패: {}", e))?;
        
        // Bits per pixel (2 bytes): 32
        writer.write_all(&[32, 0])
            .map_err(|e| format!("디렉토리 엔트리 쓰기 실패: {}", e))?;
        
        // Size of image data (4 bytes)
        let size_bytes = (data_size as u32).to_le_bytes();
        writer.write_all(&size_bytes)
            .map_err(|e| format!("디렉토리 엔트리 쓰기 실패: {}", e))?;
        
        // Offset of image data (4 bytes)
        let offset_bytes = (offset as u32).to_le_bytes();
        writer.write_all(&offset_bytes)
            .map_err(|e| format!("디렉토리 엔트리 쓰기 실패: {}", e))?;
        
        Ok(())
    }

    fn encode_to_png(&self, img: &RgbaImage) -> Result<Vec<u8>, String> {
        let mut buffer = Vec::new();
        
        image::codecs::png::PngEncoder::new(&mut buffer)
            .write_image(
                img.as_raw(),
                img.width(),
                img.height(),
                image::ExtendedColorType::Rgba8,
            )
            .map_err(|e| format!("PNG 인코딩 실패: {}", e))?;
        
        Ok(buffer)
    }
}
