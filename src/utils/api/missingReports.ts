import { supabase } from '../supabase';
import type {
  MissingReport,
  MissingReportInsert,
  MissingReportUpdate,
} from '../types';

/**
 * 사용자의 모든 실종 신고 조회
 */
export async function getMissingReportsByUserId(userId: string): Promise<MissingReport[]> {
  const { data, error } = await supabase
    .from('MissingReports')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('실종 신고 조회 실패:', error);
    throw error;
  }

  return data || [];
}

/**
 * 반려견의 실종 신고 조회
 */
export async function getMissingReportsByPetId(petId: string): Promise<MissingReport[]> {
  const { data, error } = await supabase
    .from('MissingReports')
    .select('*')
    .eq('pet_id', petId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('실종 신고 조회 실패:', error);
    throw error;
  }

  return data || [];
}

/**
 * 실종 중인 신고만 조회
 */
export async function getActiveMissingReports(): Promise<MissingReport[]> {
  const { data, error } = await supabase
    .from('MissingReports')
    .select('*')
    .eq('status', '실종 중')
    .order('missing_date', { ascending: false });

  if (error) {
    console.error('실종 신고 조회 실패:', error);
    throw error;
  }

  return data || [];
}

/**
 * 실종 신고 ID로 조회
 */
export async function getMissingReportById(
  reportId: string
): Promise<MissingReport | null> {
  const { data, error } = await supabase
    .from('MissingReports')
    .select('*')
    .eq('id', reportId)
    .single();

  if (error) {
    console.error('실종 신고 조회 실패:', error);
    throw error;
  }

  return data;
}

/**
 * 실종 신고 추가
 */
export async function createMissingReport(
  reportData: MissingReportInsert
): Promise<MissingReport> {
  const { data, error } = await supabase
    .from('MissingReports')
    .insert(reportData)
    .select()
    .single();

  if (error) {
    console.error('실종 신고 추가 실패:', error);
    throw error;
  }

  return data;
}

/**
 * 실종 신고 수정
 */
export async function updateMissingReport(
  reportId: string,
  updates: MissingReportUpdate
): Promise<MissingReport> {
  const updateData: any = { ...updates, updated_at: new Date().toISOString() };
  
  // 발견됨 상태로 변경 시 found_at 설정
  if (updates.status === '발견됨' && !updates.found_at) {
    updateData.found_at = new Date().toISOString();
  }

  const { data, error } = await supabase
    .from('MissingReports')
    .update(updateData)
    .eq('id', reportId)
    .select()
    .single();

  if (error) {
    console.error('실종 신고 수정 실패:', error);
    throw error;
  }

  return data;
}

/**
 * 실종 신고 삭제
 */
export async function deleteMissingReport(reportId: string): Promise<void> {
  const { error } = await supabase
    .from('MissingReports')
    .delete()
    .eq('id', reportId);

  if (error) {
    console.error('실종 신고 삭제 실패:', error);
    throw error;
  }
}

