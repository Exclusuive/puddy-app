import { supabase } from '../supabase';
import type {
  Vaccination,
  VaccinationInsert,
  VaccinationUpdate,
} from '../types';

/**
 * 반려견의 모든 예방접종 기록 조회
 */
export async function getVaccinationsByPetId(petId: string): Promise<Vaccination[]> {
  const { data, error } = await supabase
    .from('Vaccinations')
    .select('*')
    .eq('pet_id', petId)
    .order('vaccination_date', { ascending: false });

  if (error) {
    console.error('예방접종 기록 조회 실패:', error);
    throw error;
  }

  return data || [];
}

/**
 * 예방접종 ID로 조회
 */
export async function getVaccinationById(vaccinationId: string): Promise<Vaccination | null> {
  const { data, error } = await supabase
    .from('Vaccinations')
    .select('*')
    .eq('id', vaccinationId)
    .single();

  if (error) {
    console.error('예방접종 기록 조회 실패:', error);
    throw error;
  }

  return data;
}

/**
 * 다음 접종 예정일이 가까운 예방접종 조회
 */
export async function getUpcomingVaccinations(
  petId: string,
  days: number = 30
): Promise<Vaccination[]> {
  const today = new Date();
  const futureDate = new Date();
  futureDate.setDate(today.getDate() + days);

  const { data, error } = await supabase
    .from('Vaccinations')
    .select('*')
    .eq('pet_id', petId)
    .gte('next_due_date', today.toISOString().split('T')[0])
    .lte('next_due_date', futureDate.toISOString().split('T')[0])
    .order('next_due_date', { ascending: true });

  if (error) {
    console.error('다가오는 예방접종 조회 실패:', error);
    throw error;
  }

  return data || [];
}

/**
 * 예방접종 기록 추가
 */
export async function createVaccination(
  vaccinationData: VaccinationInsert
): Promise<Vaccination> {
  const { data, error } = await supabase
    .from('Vaccinations')
    .insert(vaccinationData)
    .select()
    .single();

  if (error) {
    console.error('예방접종 기록 추가 실패:', error);
    throw error;
  }

  return data;
}

/**
 * 예방접종 기록 수정
 */
export async function updateVaccination(
  vaccinationId: string,
  updates: VaccinationUpdate
): Promise<Vaccination> {
  const { data, error } = await supabase
    .from('Vaccinations')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', vaccinationId)
    .select()
    .single();

  if (error) {
    console.error('예방접종 기록 수정 실패:', error);
    throw error;
  }

  return data;
}

/**
 * 예방접종 기록 삭제
 */
export async function deleteVaccination(vaccinationId: string): Promise<void> {
  const { error } = await supabase
    .from('Vaccinations')
    .delete()
    .eq('id', vaccinationId);

  if (error) {
    console.error('예방접종 기록 삭제 실패:', error);
    throw error;
  }
}

