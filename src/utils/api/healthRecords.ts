import { supabase } from '../supabase';
import type {
  HealthRecord,
  HealthRecordInsert,
  HealthRecordUpdate,
} from '../types';

/**
 * 반려견의 모든 건강 기록 조회
 */
export async function getHealthRecordsByPetId(petId: string): Promise<HealthRecord[]> {
  const { data, error } = await supabase
    .from('HealthRecords')
    .select('*')
    .eq('pet_id', petId)
    .order('record_date', { ascending: false });

  if (error) {
    console.error('건강 기록 조회 실패:', error);
    throw error;
  }

  return data || [];
}

/**
 * 건강 기록 타입별 조회
 */
export async function getHealthRecordsByType(
  petId: string,
  recordType: string
): Promise<HealthRecord[]> {
  const { data, error } = await supabase
    .from('HealthRecords')
    .select('*')
    .eq('pet_id', petId)
    .eq('record_type', recordType)
    .order('record_date', { ascending: false });

  if (error) {
    console.error('건강 기록 조회 실패:', error);
    throw error;
  }

  return data || [];
}

/**
 * 건강 기록 ID로 조회
 */
export async function getHealthRecordById(recordId: string): Promise<HealthRecord | null> {
  const { data, error } = await supabase
    .from('HealthRecords')
    .select('*')
    .eq('id', recordId)
    .single();

  if (error) {
    console.error('건강 기록 조회 실패:', error);
    throw error;
  }

  return data;
}

/**
 * 건강 기록 추가
 */
export async function createHealthRecord(
  recordData: HealthRecordInsert
): Promise<HealthRecord> {
  const { data, error } = await supabase
    .from('HealthRecords')
    .insert(recordData)
    .select()
    .single();

  if (error) {
    console.error('건강 기록 추가 실패:', error);
    throw error;
  }

  return data;
}

/**
 * 건강 기록 수정
 */
export async function updateHealthRecord(
  recordId: string,
  updates: HealthRecordUpdate
): Promise<HealthRecord> {
  const { data, error } = await supabase
    .from('HealthRecords')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', recordId)
    .select()
    .single();

  if (error) {
    console.error('건강 기록 수정 실패:', error);
    throw error;
  }

  return data;
}

/**
 * 건강 기록 삭제
 */
export async function deleteHealthRecord(recordId: string): Promise<void> {
  const { error } = await supabase
    .from('HealthRecords')
    .delete()
    .eq('id', recordId);

  if (error) {
    console.error('건강 기록 삭제 실패:', error);
    throw error;
  }
}

