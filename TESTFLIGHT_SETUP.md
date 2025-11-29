# TestFlight 베타 테스트 설정 가이드

이 문서는 Expo 앱을 TestFlight를 통해 베타 테스트하는 방법을 안내합니다.

## 사전 준비사항

1. **Apple Developer 계정** (연간 $99)
2. **App Store Connect 액세스 권한**
3. **EAS CLI 설치**

## 1단계: EAS CLI 설치 및 로그인

```bash
# EAS CLI 전역 설치
npm install -g eas-cli

# Expo 계정으로 로그인
eas login

# 프로젝트에 EAS 연결
eas build:configure
```

## 2단계: app.json 설정 확인

`app.json` 파일에서 다음 정보를 확인하고 필요시 수정하세요:

- `ios.bundleIdentifier`: 앱의 고유 번들 ID (예: `com.exclusuive.puddy`)
- `version`: 앱 버전 (예: `1.0.0`)
- `ios.buildNumber`: 빌드 번호 (각 빌드마다 증가)

## 3단계: Apple Developer 계정 설정

### 3.1 App Store Connect에서 앱 생성

1. [App Store Connect](https://appstoreconnect.apple.com)에 로그인
2. "내 앱" → "+" 버튼 클릭
3. 앱 정보 입력:
   - **이름**: 앱 이름
   - **기본 언어**: 한국어
   - **번들 ID**: `app.json`의 `bundleIdentifier`와 동일하게 설정
   - **SKU**: 고유 식별자 (예: `puddy-app-001`)

### 3.2 번들 ID 등록 확인

Apple Developer Portal에서 번들 ID가 등록되어 있는지 확인하세요.

## 4단계: EAS 빌드 설정

### 4.1 eas.json 확인

`eas.json` 파일이 올바르게 설정되어 있는지 확인하세요. TestFlight용으로는 `preview` 또는 `production` 프로필을 사용합니다.

### 4.2 iOS 빌드 생성

```bash
# TestFlight용 빌드 (preview 프로필)
npm run build:ios:preview

# 또는 프로덕션 빌드
npm run build:ios:production
```

빌드 과정에서 다음을 선택할 수 있습니다:
- **빌드 타입**: App Store용 빌드 선택
- **자격 증명**: EAS가 자동으로 관리하거나 수동으로 제공

### 4.3 빌드 완료 대기

빌드는 보통 10-20분 정도 소요됩니다. 완료되면 이메일로 알림을 받습니다.

## 5단계: App Store Connect에 빌드 업로드

### 5.1 자동 업로드 (권장)

빌드가 완료되면 EAS가 자동으로 App Store Connect에 업로드합니다.

### 5.2 수동 업로드

필요한 경우 수동으로 업로드할 수 있습니다:

```bash
# 빌드 ID를 사용하여 제출
eas submit --platform ios --latest

# 또는 특정 빌드 제출
eas submit --platform ios --id <build-id>
```

## 6단계: TestFlight 설정

### 6.1 App Store Connect에서 빌드 확인

1. App Store Connect → "내 앱" → 앱 선택
2. "TestFlight" 탭으로 이동
3. 업로드된 빌드가 "처리 중" 상태인지 확인
4. 처리 완료까지 보통 10-30분 소요

### 6.2 내부 테스터 추가

**내부 테스터**는 최대 100명까지 가능하며, 즉시 테스트 가능합니다.

1. TestFlight → "내부 테스팅" 섹션
2. "+" 버튼 클릭
3. 테스터의 Apple ID 이메일 추가
4. 테스터에게 초대 이메일이 자동으로 발송됨

### 6.3 외부 테스터 추가

**외부 테스터**는 최대 10,000명까지 가능하지만, Apple의 심사가 필요합니다.

1. TestFlight → "외부 테스팅" 섹션
2. "+" 버튼 클릭
3. 테스트 그룹 생성 또는 기존 그룹 선택
4. 빌드 선택
5. 테스터 정보 입력:
   - **이름**: 테스터 이름
   - **이메일**: Apple ID 이메일
   - **첫 번째 이름**: 테스터의 이름
   - **마지막 이름**: 테스터의 성
6. "저장" 클릭
7. Apple 심사 제출 (보통 24-48시간 소요)

## 7단계: 테스터 초대

### 7.1 초대 이메일

테스터는 다음 이메일을 받게 됩니다:
- **제목**: "[앱 이름] TestFlight 초대"
- **내용**: TestFlight 앱 다운로드 링크 및 테스트 방법 안내

### 7.2 테스터 액션

테스터는 다음 단계를 따라야 합니다:

1. **TestFlight 앱 설치** (App Store에서 무료 다운로드)
2. 초대 이메일의 링크 클릭 또는 TestFlight 앱에서 초대 코드 입력
3. 앱 다운로드 및 테스트 시작

## 8단계: 빌드 업데이트

새로운 버전을 배포할 때:

### 8.1 버전 업데이트

`app.json`에서 버전을 업데이트:

```json
{
  "expo": {
    "version": "1.0.1",  // 버전 증가
    "ios": {
      "buildNumber": "2"  // 빌드 번호 증가
    }
  }
}
```

### 8.2 새 빌드 생성 및 배포

```bash
# 새 빌드 생성
npm run build:ios:preview

# 빌드 완료 후 자동 업로드 또는 수동 제출
eas submit --platform ios --latest
```

### 8.3 TestFlight에서 새 빌드 활성화

1. App Store Connect → TestFlight
2. 새 빌드가 처리 완료되면
3. 테스트 그룹에 새 빌드 할당
4. 테스터들에게 자동으로 업데이트 알림 발송

## 9단계: 테스트 피드백 수집

### 9.1 TestFlight 내장 피드백

테스터는 TestFlight 앱에서 직접 피드백을 보낼 수 있습니다:
- 앱 내에서 흔들기 → "피드백 보내기"
- TestFlight 앱에서 피드백 작성

### 9.2 피드백 확인

App Store Connect → TestFlight → "피드백" 섹션에서 확인 가능

## 문제 해결

### 빌드 실패

```bash
# 빌드 로그 확인
eas build:list
eas build:view <build-id>
```

### 업로드 실패

- Apple Developer 계정 권한 확인
- 번들 ID가 올바르게 등록되었는지 확인
- 인증서 및 프로비저닝 프로파일 확인

### TestFlight에서 빌드가 보이지 않음

- 빌드 처리가 완료되었는지 확인 (보통 10-30분 소요)
- App Store Connect에서 "TestFlight" 탭 확인
- 빌드가 "처리 중" 상태인지 확인

### 테스터가 앱을 받지 못함

- 테스터의 Apple ID가 올바른지 확인
- 초대 이메일이 스팸 폴더에 있는지 확인
- TestFlight 앱이 설치되어 있는지 확인

## 유용한 명령어

```bash
# 빌드 목록 확인
eas build:list

# 특정 빌드 상세 정보
eas build:view <build-id>

# 빌드 취소
eas build:cancel <build-id>

# 제출 상태 확인
eas submit:list

# 계정 정보 확인
eas whoami
```

## 참고 자료

- [EAS Build 문서](https://docs.expo.dev/build/introduction/)
- [EAS Submit 문서](https://docs.expo.dev/submit/introduction/)
- [TestFlight 가이드](https://developer.apple.com/testflight/)
- [App Store Connect 도움말](https://help.apple.com/app-store-connect/)

## 주의사항

1. **번들 ID 변경**: 한 번 설정된 번들 ID는 변경하기 어렵습니다. 신중하게 선택하세요.
2. **빌드 번호**: 각 빌드는 고유한 빌드 번호가 필요합니다. 자동으로 증가하도록 설정하는 것을 권장합니다.
3. **테스트 기간**: 외부 테스트는 Apple 심사가 필요하며, 보통 24-48시간이 소요됩니다.
4. **빌드 만료**: TestFlight 빌드는 90일 후 만료됩니다. 정기적으로 새 빌드를 업로드하세요.

