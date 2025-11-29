import { supabase } from '../supabase';
import type {
  MedicalRecord,
  MedicalRecordInsert,
  MedicalRecordUpdate,
} from '../types';

/**
 * 반려견의 모든 진료 기록 조회
 */
export async function getMedicalRecordsByPetId(petId: string): Promise<MedicalRecord[]> {
  const { data, error } = await supabase
    .from('MedicalRecords')
    .select('*')
    .eq('pet_id', petId)
    .order('visit_date', { ascending: false });

  if (error) {
    console.error('진료 기록 조회 실패:', error);
    throw error;
  }

  return data || [];
}

/**
 * 진료 기록 ID로 조회
 */
export async function getMedicalRecordById(
  recordId: string
): Promise<MedicalRecord | null> {
  const { data, error } = await supabase
    .from('MedicalRecords')
    .select('*')
    .eq('id', recordId)
    .single();

  if (error) {
    console.error('진료 기록 조회 실패:', error);
    throw error;
  }

  return data;
}

/**
 * 진료 기록 추가
 */
export async function createMedicalRecord(
  recordData: MedicalRecordInsert
): Promise<MedicalRecord> {
  const { data, error } = await supabase
    .from('MedicalRecords')
    .insert(recordData)
    .select()
    .single();

  if (error) {
    console.error('진료 기록 추가 실패:', error);
    throw error;
  }

  return data;
}

/**
 * 진료 기록 수정
 */
export async function updateMedicalRecord(
  recordId: string,
  updates: MedicalRecordUpdate
): Promise<MedicalRecord> {
  const { data, error } = await supabase
    .from('MedicalRecords')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', recordId)
    .select()
    .single();

  if (error) {
    console.error('진료 기록 수정 실패:', error);
    throw error;
  }

  return data;
}

/**
 * 진료 기록 삭제
 */
export async function deleteMedicalRecord(recordId: string): Promise<void> {
  const { error } = await supabase
    .from('MedicalRecords')
    .delete()
    .eq('id', recordId);

  if (error) {
    console.error('진료 기록 삭제 실패:', error);
    throw error;
  }
}

