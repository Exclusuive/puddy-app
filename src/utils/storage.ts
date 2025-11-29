import { supabase } from './supabase';
import * as FileSystem from 'expo-file-system';

/**
 * 파일명 해시 생성
 */
const generateFileHash = (): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  return `${timestamp}-${random}`;
};

/**
 * React Native에서 이미지를 Supabase Storage에 업로드
 * @param imageUri - 로컬 이미지 URI (file:// 또는 content://)
 * @param bucketName - Storage 버킷 이름 (기본값: 'images')
 * @param fileName - 파일명 (선택사항, 없으면 해시 기반으로 생성)
 * @returns 업로드된 이미지의 URL과 경로
 */
export async function uploadImageToSupabase(
  imageUri: string,
  bucketName: string = 'images',
  fileName?: string
): Promise<{ url: string; path: string } | null> {
  try {
    // 파일명 생성 (landing과 동일한 형식)
    const hash = generateFileHash();
    const fileExtension = imageUri.split('.').pop() || 'jpg';
    const finalFileName = fileName || `${hash}.${fileExtension}`;
    
    // Storage 경로 (버킷 이름: 'images', 루트에 직접 저장)
    const filePath = finalFileName;

    // 파일을 base64로 읽기
    const base64 = await FileSystem.readAsStringAsync(imageUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // base64를 Uint8Array로 변환
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);

    // Supabase Storage에 업로드 (Uint8Array 직접 사용)
    const { error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, byteArray, {
        contentType: 'image/jpeg',
        upsert: false,
      });

    if (error) {
      console.error('Supabase 업로드 에러:', error);
      console.error('에러 상세:', {
        message: error.message,
        name: error.name,
      });
      
      // 버킷이 존재하지 않는 경우
      if (error.message?.includes('Bucket') || error.message?.includes('not found')) {
        console.error(
          `Storage 버킷 '${bucketName}'이 존재하지 않습니다. Supabase 대시보드에서 버킷을 생성해주세요.`
        );
      }
      
      // 권한 오류
      if (error.message?.includes('permission') || error.message?.includes('policy')) {
        console.error(
          `Storage 버킷에 대한 업로드 권한이 없습니다. Supabase 대시보드에서 RLS 정책을 확인해주세요.`
        );
      }
      
      return null;
    }

    // 공개 URL 가져오기
    const {
      data: { publicUrl },
    } = supabase.storage.from(bucketName).getPublicUrl(filePath);

    return {
      url: publicUrl,
      path: filePath,
    };
  } catch (error) {
    console.error('이미지 업로드 중 오류:', error);
    return null;
  }
}

/**
 * 이미지 해시 생성 (중복 검사용)
 */
export async function generateImageHash(imageUri: string): Promise<string> {
  try {
    const base64 = await FileSystem.readAsStringAsync(imageUri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    
    // 간단한 해시 생성 (실제로는 더 강력한 해시 알고리즘 사용 권장)
    const hash = btoa(base64.substring(0, 1000));
    return hash.substring(0, 64); // 64자로 제한
  } catch (error) {
    console.error('이미지 해시 생성 실패:', error);
    return generateFileHash(); // 실패 시 랜덤 해시 반환
  }
}

