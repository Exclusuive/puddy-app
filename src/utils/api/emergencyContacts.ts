import { supabase } from '../supabase';
import type {
  EmergencyContact,
  EmergencyContactInsert,
  EmergencyContactUpdate,
} from '../types';

/**
 * 사용자의 모든 긴급 연락처 조회
 */
export async function getEmergencyContactsByUserId(
  userId: string
): Promise<EmergencyContact[]> {
  const { data, error } = await supabase
    .from('EmergencyContacts')
    .select('*')
    .eq('user_id', userId)
    .order('is_primary', { ascending: false })
    .order('created_at', { ascending: false });

  if (error) {
    console.error('긴급 연락처 조회 실패:', error);
    throw error;
  }

  return data || [];
}

/**
 * 주 연락처 조회
 */
export async function getPrimaryEmergencyContact(
  userId: string
): Promise<EmergencyContact | null> {
  const { data, error } = await supabase
    .from('EmergencyContacts')
    .select('*')
    .eq('user_id', userId)
    .eq('is_primary', true)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    console.error('주 연락처 조회 실패:', error);
    throw error;
  }

  return data;
}

/**
 * 긴급 연락처 ID로 조회
 */
export async function getEmergencyContactById(
  contactId: string
): Promise<EmergencyContact | null> {
  const { data, error } = await supabase
    .from('EmergencyContacts')
    .select('*')
    .eq('id', contactId)
    .single();

  if (error) {
    console.error('긴급 연락처 조회 실패:', error);
    throw error;
  }

  return data;
}

/**
 * 긴급 연락처 추가
 */
export async function createEmergencyContact(
  contactData: EmergencyContactInsert
): Promise<EmergencyContact> {
  // 주 연락처로 설정하는 경우, 기존 주 연락처 해제
  if (contactData.is_primary) {
    await supabase
      .from('EmergencyContacts')
      .update({ is_primary: false })
      .eq('user_id', contactData.user_id)
      .eq('is_primary', true);
  }

  const { data, error } = await supabase
    .from('EmergencyContacts')
    .insert(contactData)
    .select()
    .single();

  if (error) {
    console.error('긴급 연락처 추가 실패:', error);
    throw error;
  }

  return data;
}

/**
 * 긴급 연락처 수정
 */
export async function updateEmergencyContact(
  contactId: string,
  updates: EmergencyContactUpdate
): Promise<EmergencyContact> {
  // 주 연락처로 변경하는 경우, 기존 주 연락처 해제
  if (updates.is_primary) {
    const contact = await getEmergencyContactById(contactId);
    if (contact) {
      await supabase
        .from('EmergencyContacts')
        .update({ is_primary: false })
        .eq('user_id', contact.user_id)
        .eq('is_primary', true)
        .neq('id', contactId);
    }
  }

  const { data, error } = await supabase
    .from('EmergencyContacts')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', contactId)
    .select()
    .single();

  if (error) {
    console.error('긴급 연락처 수정 실패:', error);
    throw error;
  }

  return data;
}

/**
 * 긴급 연락처 삭제
 */
export async function deleteEmergencyContact(contactId: string): Promise<void> {
  const { error } = await supabase
    .from('EmergencyContacts')
    .delete()
    .eq('id', contactId);

  if (error) {
    console.error('긴급 연락처 삭제 실패:', error);
    throw error;
  }
}

