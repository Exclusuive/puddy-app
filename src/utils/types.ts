// 데이터베이스 타입 정의

export type Gender = "수컷" | "암컷";
export type PetStatus = "등록 완료" | "실종 중";
export type MissingReportStatus = "실종 중" | "발견됨" | "종료";
export type RecordType = "건강" | "사진" | "기타";

export interface User {
  id: string;
  email: string;
  name: string;
  google_id: string;
  photo_url?: string;
  created_at: string;
  updated_at: string;
  last_login_at?: string;
}

export interface Pet {
  id: string;
  user_id: string;
  pet_id: string; // 000-000-0000000 형식
  government_registration_number?: string; // 정부 발급 동물등록번호
  name: string;
  birth_date: string;
  gender: Gender;
  breed?: string;
  profile_image_url?: string;
  status: PetStatus;
  is_nose_print_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface NosePrint {
  id: string;
  pet_id: string;
  image_url: string;
  image_hash: string;
  registered_at: string;
  created_at: string;
}

export interface Vaccination {
  id: string;
  pet_id: string;
  vaccine_type: string;
  vaccination_date: string;
  next_due_date?: string;
  veterinarian_name?: string;
  clinic_name?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface VaccinationReminder {
  id: string;
  vaccination_id: string;
  user_id: string;
  reminder_date: string;
  is_sent: boolean;
  created_at: string;
  sent_at?: string;
}

export interface MedicalRecord {
  id: string;
  pet_id: string;
  clinic_name: string;
  veterinarian_name?: string;
  visit_date: string;
  diagnosis?: string;
  treatment?: string;
  prescription?: string;
  cost?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface HealthRecord {
  id: string;
  pet_id: string;
  record_type: RecordType;
  title?: string;
  content?: string;
  record_date: string;
  weight?: number;
  temperature?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Photo {
  id: string;
  pet_id: string;
  health_record_id?: string;
  image_url: string;
  caption?: string;
  photo_date: string;
  created_at: string;
}

export interface EmergencyContact {
  id: string;
  user_id: string;
  contact_name: string;
  phone_number: string;
  relationship?: string;
  is_primary: boolean;
  created_at: string;
  updated_at: string;
}

export interface MissingReport {
  id: string;
  pet_id: string;
  user_id: string;
  missing_date: string;
  missing_location: string;
  description?: string;
  contact_phone: string;
  status: MissingReportStatus;
  created_at: string;
  updated_at: string;
  found_at?: string;
}

// Insert 타입 (id, created_at, updated_at 제외)
export type PetInsert = Omit<Pet, "id" | "created_at" | "updated_at">;
export type NosePrintInsert = Omit<NosePrint, "id" | "created_at">;
export type VaccinationInsert = Omit<
  Vaccination,
  "id" | "created_at" | "updated_at"
>;
export type VaccinationReminderInsert = Omit<
  VaccinationReminder,
  "id" | "created_at"
>;
export type MedicalRecordInsert = Omit<
  MedicalRecord,
  "id" | "created_at" | "updated_at"
>;
export type HealthRecordInsert = Omit<
  HealthRecord,
  "id" | "created_at" | "updated_at"
>;
export type PhotoInsert = Omit<Photo, "id" | "created_at">;
export type EmergencyContactInsert = Omit<
  EmergencyContact,
  "id" | "created_at" | "updated_at"
>;
export type MissingReportInsert = Omit<
  MissingReport,
  "id" | "created_at" | "updated_at"
>;

// Update 타입 (모든 필드 선택적)
export type PetUpdate = Partial<Omit<Pet, "id" | "created_at" | "updated_at">>;
export type VaccinationUpdate = Partial<
  Omit<Vaccination, "id" | "created_at" | "updated_at">
>;
export type MedicalRecordUpdate = Partial<
  Omit<MedicalRecord, "id" | "created_at" | "updated_at">
>;
export type HealthRecordUpdate = Partial<
  Omit<HealthRecord, "id" | "created_at" | "updated_at">
>;
export type EmergencyContactUpdate = Partial<
  Omit<EmergencyContact, "id" | "created_at" | "updated_at">
>;
export type MissingReportUpdate = Partial<
  Omit<MissingReport, "id" | "created_at" | "updated_at">
>;
