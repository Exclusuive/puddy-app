# PUDDY 앱 ERD (Entity Relationship Diagram)

## 데이터베이스 스키마 설계

```mermaiderDiagram
    Users ||--o{ Pets : "소유"
    Users ||--o{ EmergencyContacts : "등록"
    Pets ||--o{ NosePrints : "등록"
    Pets ||--o{ Vaccinations : "접종"
    Pets ||--o{ MedicalRecords : "진료"
    Pets ||--o{ HealthRecords : "기록"
    Pets ||--o{ Photos : "사진"
    Pets ||--o{ MissingReports : "실종신고"
    Vaccinations ||--o{ VaccinationReminders : "알림"

    Users {
        uuid id PK
        string email UK
        string name
        string google_id UK
        string photo_url
        timestamp created_at
        timestamp updated_at
        timestamp last_login_at
    }

    Pets {
        uuid id PK
        uuid user_id FK
        string pet_id UK "000-000-0000000 형식 (앱 내부 고유 ID)"
        string government_registration_number "정부 발급 동물등록번호 (15자리, 선택적)"
        string name
        date birth_date
        enum gender "수컷, 암컷"
        string breed "품종"
        string profile_image_url
        enum status "등록 완료, 실종 중"
        boolean is_nose_print_verified
        timestamp created_at
        timestamp updated_at
    }

    NosePrints {
        uuid id PK
        uuid pet_id FK
        string image_url UK
        string image_hash "이미지 해시값 (중복 검사용)"
        timestamp registered_at
        timestamp created_at
    }

    Vaccinations {
        uuid id PK
        uuid pet_id FK
        string vaccine_type "백신 종류"
        date vaccination_date
        date next_due_date "다음 접종 예정일"
        string veterinarian_name "수의사 이름"
        string clinic_name "동물병원 이름"
        text notes "메모"
        timestamp created_at
        timestamp updated_at
    }

    VaccinationReminders {
        uuid id PK
        uuid vaccination_id FK
        uuid user_id FK
        date reminder_date "알림 날짜"
        boolean is_sent "알림 발송 여부"
        timestamp created_at
        timestamp sent_at
    }

    MedicalRecords {
        uuid id PK
        uuid pet_id FK
        string clinic_name "동물병원 이름"
        string veterinarian_name "수의사 이름"
        date visit_date "방문일"
        string diagnosis "진단명"
        text treatment "치료 내용"
        text prescription "처방전"
        decimal cost "비용"
        text notes "메모"
        timestamp created_at
        timestamp updated_at
    }

    HealthRecords {
        uuid id PK
        uuid pet_id FK
        string record_type "건강, 사진, 기타"
        text title "제목"
        text content "내용"
        date record_date "기록 날짜"
        decimal weight "체중 (kg)"
        decimal temperature "체온"
        text notes "메모"
        timestamp created_at
        timestamp updated_at
    }

    EmergencyContacts {
        uuid id PK
        uuid user_id FK
        string contact_name "연락처 이름"
        string phone_number "전화번호"
        string relationship "관계 (가족, 친구 등)"
        boolean is_primary "주 연락처 여부"
        timestamp created_at
        timestamp updated_at
    }

    MissingReports {
        uuid id PK
        uuid pet_id FK
        uuid user_id FK
        date missing_date "실종일"
        string missing_location "실종 장소"
        text description "설명"
        string contact_phone "연락처"
        enum status "실종 중, 발견됨, 종료"
        timestamp created_at
        timestamp updated_at
        timestamp found_at "발견일"
    }
```

## 주요 테이블 설명

### Users (사용자)

- 구글 로그인 정보 저장
- 사용자 기본 정보 관리

### Pets (반려견)

- 사용자가 등록한 반려견 정보
- 고유 ID는 000-000-0000000 형식 (앱 내부 고유 ID)
- 정부 발급 동물등록번호 (15자리, 선택적 입력)
- 코 사진 인증 여부 및 상태 관리

### NosePrints (코 사진)

- 반려견의 코 사진 저장
- 이미지 해시값으로 중복 검사

### Vaccinations (예방접종)

- 예방접종 기록 관리
- 다음 접종 예정일 추적

### VaccinationReminders (예방접종 알림)

- 예방접종 알림 설정 및 발송 기록

### MedicalRecords (진료 기록)

- 동물병원 방문 기록
- 진단, 치료, 처방전 정보

### HealthRecords (건강 기록)

- 일상 건강 기록
- 체중, 체온 등 측정값 저장

### Photos (사진)

- 반려견 사진 저장
- 건강 기록과 연결 가능

### EmergencyContacts (긴급 연락처)

- 실종 시 연락할 연락처 정보

### MissingReports (실종 신고)

- 반려견 실종 신고 관리

## 인덱스 권장사항

```sql
-- Users 테이블
CREATE INDEX idx_users_google_id ON Users(google_id);
CREATE INDEX idx_users_email ON Users(email);

-- Pets 테이블
CREATE INDEX idx_pets_user_id ON Pets(user_id);
CREATE INDEX idx_pets_pet_id ON Pets(pet_id);
CREATE INDEX idx_pets_government_registration_number ON Pets(government_registration_number);
CREATE INDEX idx_pets_status ON Pets(status);

-- NosePrints 테이블
CREATE INDEX idx_nose_prints_pet_id ON NosePrints(pet_id);
CREATE INDEX idx_nose_prints_image_hash ON NosePrints(image_hash);

-- Vaccinations 테이블
CREATE INDEX idx_vaccinations_pet_id ON Vaccinations(pet_id);
CREATE INDEX idx_vaccinations_next_due_date ON Vaccinations(next_due_date);

-- VaccinationReminders 테이블
CREATE INDEX idx_vaccination_reminders_user_id ON VaccinationReminders(user_id);
CREATE INDEX idx_vaccination_reminders_date ON VaccinationReminders(reminder_date, is_sent);

-- MedicalRecords 테이블
CREATE INDEX idx_medical_records_pet_id ON MedicalRecords(pet_id);
CREATE INDEX idx_medical_records_visit_date ON MedicalRecords(visit_date);

-- HealthRecords 테이블
CREATE INDEX idx_health_records_pet_id ON HealthRecords(pet_id);
CREATE INDEX idx_health_records_record_date ON HealthRecords(record_date);

-- Photos 테이블
CREATE INDEX idx_photos_pet_id ON Photos(pet_id);
CREATE INDEX idx_photos_health_record_id ON Photos(health_record_id);

-- EmergencyContacts 테이블
CREATE INDEX idx_emergency_contacts_user_id ON EmergencyContacts(user_id);

-- MissingReports 테이블
CREATE INDEX idx_missing_reports_pet_id ON MissingReports(pet_id);
CREATE INDEX idx_missing_reports_status ON MissingReports(status);
```

## 추가 고려사항

1. **이미지 저장**: S3 또는 클라우드 스토리지 사용 권장
2. **코 사진 매칭**: AI/ML 서비스 연동 필요
3. **알림 시스템**: 푸시 알림을 위한 별도 테이블 고려
4. **보안**: 민감 정보 암호화 필요
5. **백업**: 정기적인 데이터 백업 전략 수립
