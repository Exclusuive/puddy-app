import { supabase } from '../supabase';
import type { VaccinationReminder, VaccinationReminderInsert } from '../types';

/**
 * 사용자의 모든 예방접종 알림 조회
 */
export async function getVaccinationRemindersByUserId(
  userId: string
): Promise<VaccinationReminder[]> {
  const { data, error } = await supabase
    .from('VaccinationReminders')
    .select('*')
    .eq('user_id', userId)
    .order('reminder_date', { ascending: true });

  if (error) {
    console.error('예방접종 알림 조회 실패:', error);
    throw error;
  }

  return data || [];
}

/**
 * 미발송 알림 조회
 */
export async function getUnsentReminders(
  userId: string
): Promise<VaccinationReminder[]> {
  const { data, error } = await supabase
    .from('VaccinationReminders')
    .select('*')
    .eq('user_id', userId)
    .eq('is_sent', false)
    .order('reminder_date', { ascending: true });

  if (error) {
    console.error('미발송 알림 조회 실패:', error);
    throw error;
  }

  return data || [];
}

/**
 * 예방접종 알림 추가
 */
export async function createVaccinationReminder(
  reminderData: VaccinationReminderInsert
): Promise<VaccinationReminder> {
  const { data, error } = await supabase
    .from('VaccinationReminders')
    .insert(reminderData)
    .select()
    .single();

  if (error) {
    console.error('예방접종 알림 추가 실패:', error);
    throw error;
  }

  return data;
}

/**
 * 알림 발송 완료 처리
 */
export async function markReminderAsSent(reminderId: string): Promise<void> {
  const { error } = await supabase
    .from('VaccinationReminders')
    .update({
      is_sent: true,
      sent_at: new Date().toISOString(),
    })
    .eq('id', reminderId);

  if (error) {
    console.error('알림 발송 처리 실패:', error);
    throw error;
  }
}

/**
 * 예방접종 알림 삭제
 */
export async function deleteVaccinationReminder(reminderId: string): Promise<void> {
  const { error } = await supabase
    .from('VaccinationReminders')
    .delete()
    .eq('id', reminderId);

  if (error) {
    console.error('예방접종 알림 삭제 실패:', error);
    throw error;
  }
}

