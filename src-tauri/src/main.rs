// Windows에서 콘솔 창을 숨김
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod icon_converter;

use icon_converter::IconConverter;
use serde::{Deserialize, Serialize};
use std::path::PathBuf;

#[derive(Debug, Serialize, Deserialize)]
struct ConvertResponse {
    success: bool,
    message: String,
    output_path: Option<String>,
}

#[tauri::command]
fn convert_image(input_path: String) -> ConvertResponse {
    let path = PathBuf::from(&input_path);
    let converter = IconConverter::default();
    
    match converter.convert_to_ico(&path) {
        Ok((output_path, _)) => ConvertResponse {
            success: true,
            message: "변환 완료".to_string(),
            output_path: Some(output_path.to_string_lossy().to_string()),
        },
        Err(e) => ConvertResponse {
            success: false,
            message: format!("변환 실패: {}", e),
            output_path: None,
        },
    }
}

#[tauri::command]
fn get_version() -> String {
    option_env!("GIT_VERSION")
        .unwrap_or(env!("CARGO_PKG_VERSION"))
        .to_string()
}

#[tauri::command]
fn copy_file(source: String, destination: String) -> ConvertResponse {
    use std::fs;
    
    let src = PathBuf::from(&source);
    let dst = PathBuf::from(&destination);
    
    match fs::copy(&src, &dst) {
        Ok(_) => ConvertResponse {
            success: true,
            message: format!("파일이 저장되었습니다: {}", destination),
            output_path: Some(destination),
        },
        Err(e) => ConvertResponse {
            success: false,
            message: format!("파일 복사 실패: {}", e),
            output_path: None,
        },
    }
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![convert_image, get_version, copy_file])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
