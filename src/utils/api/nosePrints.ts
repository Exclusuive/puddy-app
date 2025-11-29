import { supabase } from '../supabase';
import type { NosePrint, NosePrintInsert } from '../types';

/**
 * 반려견의 모든 코 사진 조회
 */
export async function getNosePrintsByPetId(petId: string): Promise<NosePrint[]> {
  const { data, error } = await supabase
    .from('NosePrints')
    .select('*')
    .eq('pet_id', petId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('코 사진 조회 실패:', error);
    throw error;
  }

  return data || [];
}

/**
 * 코 사진 ID로 조회
 */
export async function getNosePrintById(nosePrintId: string): Promise<NosePrint | null> {
  const { data, error } = await supabase
    .from('NosePrints')
    .select('*')
    .eq('id', nosePrintId)
    .single();

  if (error) {
    console.error('코 사진 조회 실패:', error);
    throw error;
  }

  return data;
}

/**
 * 이미지 해시로 중복 검사
 */
export async function checkNosePrintByHash(imageHash: string): Promise<NosePrint | null> {
  const { data, error } = await supabase
    .from('NosePrints')
    .select('*')
    .eq('image_hash', imageHash)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    console.error('코 사진 중복 검사 실패:', error);
    throw error;
  }

  return data;
}

/**
 * 코 사진 등록
 */
export async function createNosePrint(nosePrintData: NosePrintInsert): Promise<NosePrint> {
  const { data, error } = await supabase
    .from('NosePrints')
    .insert(nosePrintData)
    .select()
    .single();

  if (error) {
    console.error('코 사진 등록 실패:', error);
    throw error;
  }

  return data;
}

/**
 * 코 사진 삭제
 */
export async function deleteNosePrint(nosePrintId: string): Promise<void> {
  const { error } = await supabase.from('NosePrints').delete().eq('id', nosePrintId);

  if (error) {
    console.error('코 사진 삭제 실패:', error);
    throw error;
  }
}

