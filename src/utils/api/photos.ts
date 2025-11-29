import { supabase } from '../supabase';
import type { Photo, PhotoInsert } from '../types';

/**
 * 반려견의 모든 사진 조회
 */
export async function getPhotosByPetId(petId: string): Promise<Photo[]> {
  const { data, error } = await supabase
    .from('Photos')
    .select('*')
    .eq('pet_id', petId)
    .order('photo_date', { ascending: false });

  if (error) {
    console.error('사진 조회 실패:', error);
    throw error;
  }

  return data || [];
}

/**
 * 건강 기록과 연결된 사진 조회
 */
export async function getPhotosByHealthRecordId(
  healthRecordId: string
): Promise<Photo[]> {
  const { data, error } = await supabase
    .from('Photos')
    .select('*')
    .eq('health_record_id', healthRecordId)
    .order('photo_date', { ascending: false });

  if (error) {
    console.error('사진 조회 실패:', error);
    throw error;
  }

  return data || [];
}

/**
 * 사진 ID로 조회
 */
export async function getPhotoById(photoId: string): Promise<Photo | null> {
  const { data, error } = await supabase
    .from('Photos')
    .select('*')
    .eq('id', photoId)
    .single();

  if (error) {
    console.error('사진 조회 실패:', error);
    throw error;
  }

  return data;
}

/**
 * 사진 추가
 */
export async function createPhoto(photoData: PhotoInsert): Promise<Photo> {
  const { data, error } = await supabase
    .from('Photos')
    .insert(photoData)
    .select()
    .single();

  if (error) {
    console.error('사진 추가 실패:', error);
    throw error;
  }

  return data;
}

/**
 * 사진 삭제
 */
export async function deletePhoto(photoId: string): Promise<void> {
  const { error } = await supabase.from('Photos').delete().eq('id', photoId);

  if (error) {
    console.error('사진 삭제 실패:', error);
    throw error;
  }
}

