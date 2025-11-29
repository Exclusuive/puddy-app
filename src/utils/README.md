# API Utils

Supabase를 사용한 데이터베이스 API 함수들입니다.

## 설치

```bash
npm install @supabase/supabase-js expo-constants
```

## 환경 변수 설정

`app.json` 또는 `.env` 파일에 Supabase 설정을 추가하세요:

```json
{
  "expo": {
    "extra": {
      "supabaseUrl": "YOUR_SUPABASE_URL",
      "supabaseAnonKey": "YOUR_SUPABASE_ANON_KEY"
    }
  }
}
```

또는 환경 변수로:

```
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 사용 방법

### 기본 사용

```typescript
import { getPetsByUserId, createPet } from '@/utils/api';

// 반려견 목록 조회
const pets = await getPetsByUserId(userId);

// 반려견 등록
const newPet = await createPet({
  user_id: userId,
  pet_id: '000-000-0000001',
  name: 'Coco',
  birth_date: '2021-05-15',
  gender: '암컷',
  status: '등록 완료',
  is_nose_print_verified: false,
});
```

## API 함수 목록

### Pets (반려견)
- `getPetsByUserId(userId)` - 사용자의 모든 반려견 조회
- `getPetById(petId)` - 반려견 ID로 조회
- `getPetByPetId(petId)` - 앱 내부 고유 ID로 조회
- `getPetByGovernmentRegistrationNumber(number)` - 정부 동물등록번호로 조회
- `createPet(petData)` - 반려견 등록
- `updatePet(petId, updates)` - 반려견 정보 수정
- `deletePet(petId)` - 반려견 삭제
- `generateNextPetId()` - 다음 pet_id 생성

### NosePrints (코 사진)
- `getNosePrintsByPetId(petId)` - 반려견의 모든 코 사진 조회
- `getNosePrintById(nosePrintId)` - 코 사진 ID로 조회
- `checkNosePrintByHash(imageHash)` - 이미지 해시로 중복 검사
- `createNosePrint(nosePrintData)` - 코 사진 등록
- `deleteNosePrint(nosePrintId)` - 코 사진 삭제

### Vaccinations (예방접종)
- `getVaccinationsByPetId(petId)` - 반려견의 모든 예방접종 기록 조회
- `getVaccinationById(vaccinationId)` - 예방접종 ID로 조회
- `getUpcomingVaccinations(petId, days)` - 다음 접종 예정일이 가까운 예방접종 조회
- `createVaccination(vaccinationData)` - 예방접종 기록 추가
- `updateVaccination(vaccinationId, updates)` - 예방접종 기록 수정
- `deleteVaccination(vaccinationId)` - 예방접종 기록 삭제

### MedicalRecords (진료 기록)
- `getMedicalRecordsByPetId(petId)` - 반려견의 모든 진료 기록 조회
- `getMedicalRecordById(recordId)` - 진료 기록 ID로 조회
- `createMedicalRecord(recordData)` - 진료 기록 추가
- `updateMedicalRecord(recordId, updates)` - 진료 기록 수정
- `deleteMedicalRecord(recordId)` - 진료 기록 삭제

### HealthRecords (건강 기록)
- `getHealthRecordsByPetId(petId)` - 반려견의 모든 건강 기록 조회
- `getHealthRecordsByType(petId, recordType)` - 건강 기록 타입별 조회
- `getHealthRecordById(recordId)` - 건강 기록 ID로 조회
- `createHealthRecord(recordData)` - 건강 기록 추가
- `updateHealthRecord(recordId, updates)` - 건강 기록 수정
- `deleteHealthRecord(recordId)` - 건강 기록 삭제

### Photos (사진)
- `getPhotosByPetId(petId)` - 반려견의 모든 사진 조회
- `getPhotosByHealthRecordId(healthRecordId)` - 건강 기록과 연결된 사진 조회
- `getPhotoById(photoId)` - 사진 ID로 조회
- `createPhoto(photoData)` - 사진 추가
- `deletePhoto(photoId)` - 사진 삭제

### EmergencyContacts (긴급 연락처)
- `getEmergencyContactsByUserId(userId)` - 사용자의 모든 긴급 연락처 조회
- `getPrimaryEmergencyContact(userId)` - 주 연락처 조회
- `getEmergencyContactById(contactId)` - 긴급 연락처 ID로 조회
- `createEmergencyContact(contactData)` - 긴급 연락처 추가
- `updateEmergencyContact(contactId, updates)` - 긴급 연락처 수정
- `deleteEmergencyContact(contactId)` - 긴급 연락처 삭제

### MissingReports (실종 신고)
- `getMissingReportsByUserId(userId)` - 사용자의 모든 실종 신고 조회
- `getMissingReportsByPetId(petId)` - 반려견의 실종 신고 조회
- `getActiveMissingReports()` - 실종 중인 신고만 조회
- `getMissingReportById(reportId)` - 실종 신고 ID로 조회
- `createMissingReport(reportData)` - 실종 신고 추가
- `updateMissingReport(reportId, updates)` - 실종 신고 수정
- `deleteMissingReport(reportId)` - 실종 신고 삭제

### VaccinationReminders (예방접종 알림)
- `getVaccinationRemindersByUserId(userId)` - 사용자의 모든 예방접종 알림 조회
- `getUnsentReminders(userId)` - 미발송 알림 조회
- `createVaccinationReminder(reminderData)` - 예방접종 알림 추가
- `markReminderAsSent(reminderId)` - 알림 발송 완료 처리
- `deleteVaccinationReminder(reminderId)` - 예방접종 알림 삭제

## 타입 정의

모든 타입은 `src/utils/types.ts`에 정의되어 있습니다.

```typescript
import type { Pet, PetInsert, PetUpdate } from '@/utils/types';
```

## 에러 처리

모든 API 함수는 에러 발생 시 `throw`합니다. try-catch로 처리하세요:

```typescript
try {
  const pets = await getPetsByUserId(userId);
} catch (error) {
  console.error('반려견 조회 실패:', error);
  // 에러 처리 로직
}
```

