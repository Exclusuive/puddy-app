import { supabase } from '../supabase';
import type { Pet, PetInsert, PetUpdate } from '../types';

/**
 * 사용자의 모든 반려견 조회
 */
export async function getPetsByUserId(userId: string): Promise<Pet[]> {
  const { data, error } = await supabase
    .from('Pets')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('반려견 조회 실패:', error);
    throw error;
  }

  return data || [];
}

/**
 * 반려견 ID로 조회
 */
export async function getPetById(petId: string): Promise<Pet | null> {
  const { data, error } = await supabase
    .from('Pets')
    .select('*')
    .eq('id', petId)
    .single();

  if (error) {
    console.error('반려견 조회 실패:', error);
    throw error;
  }

  return data;
}

/**
 * 앱 내부 고유 ID로 반려견 조회
 */
export async function getPetByPetId(petId: string): Promise<Pet | null> {
  const { data, error } = await supabase
    .from('Pets')
    .select('*')
    .eq('pet_id', petId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // 데이터가 없을 때
      return null;
    }
    console.error('반려견 조회 실패:', error);
    throw error;
  }

  return data;
}

/**
 * 정부 동물등록번호로 반려견 조회
 */
export async function getPetByGovernmentRegistrationNumber(
  registrationNumber: string
): Promise<Pet | null> {
  const { data, error } = await supabase
    .from('Pets')
    .select('*')
    .eq('government_registration_number', registrationNumber)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    console.error('반려견 조회 실패:', error);
    throw error;
  }

  return data;
}

/**
 * 반려견 등록
 */
export async function createPet(petData: PetInsert): Promise<Pet> {
  const { data, error } = await supabase
    .from('Pets')
    .insert(petData)
    .select()
    .single();

  if (error) {
    console.error('반려견 등록 실패:', error);
    throw error;
  }

  return data;
}

/**
 * 반려견 정보 수정
 */
export async function updatePet(petId: string, updates: PetUpdate): Promise<Pet> {
  const { data, error } = await supabase
    .from('Pets')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', petId)
    .select()
    .single();

  if (error) {
    console.error('반려견 수정 실패:', error);
    throw error;
  }

  return data;
}

/**
 * 반려견 삭제
 */
export async function deletePet(petId: string): Promise<void> {
  const { error } = await supabase.from('Pets').delete().eq('id', petId);

  if (error) {
    console.error('반려견 삭제 실패:', error);
    throw error;
  }
}

/**
 * 다음 pet_id 생성 (000-000-0000000 형식)
 */
export async function generateNextPetId(): Promise<string> {
  const { data, error } = await supabase
    .from('Pets')
    .select('pet_id')
    .order('created_at', { ascending: false })
    .limit(1);

  if (error) {
    console.error('pet_id 조회 실패:', error);
    throw error;
  }

  if (!data || data.length === 0) {
    return '000-000-0000001';
  }

  const lastPetId = data[0].pet_id;
  const parts = lastPetId.split('-');
  const lastNumber = parseInt(parts[2], 10);
  const nextNumber = lastNumber + 1;

  return `${parts[0]}-${parts[1]}-${nextNumber.toString().padStart(7, '0')}`;
}

