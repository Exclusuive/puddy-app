# CORS 오류 해결 가이드

## 문제

웹 환경에서 Google OAuth 사용 시 CORS 오류가 발생합니다.

## CORS에 대한 이해

**중요**: CORS는 클라이언트 측에서 직접 설정할 수 없습니다. CORS는 서버 측에서 설정해야 합니다.

- Google OAuth 서버: Google이 관리 (우리가 설정 불가)
- Supabase 서버: Supabase가 관리 (이미 CORS 설정됨)
- Expo 개발 서버: Expo가 관리

## 해결 방법

### 1. 웹 환경에서 올바른 리디렉션 URI 사용

웹 환경에서는 `localhost:8081`을 사용해야 합니다.

**현재 코드:**

- 웹: `localhost:8081` (자동 생성)
- iOS/Android: `https://auth.expo.io/@poqopo/puddy`

### 2. Google Cloud Console 설정 확인

**Web Client ID의 승인된 리디렉션 URI에 다음이 모두 있는지 확인:**

```
http://localhost:8081
https://localhost:8081
https://auth.expo.io/@poqopo/puddy
```

### 3. JavaScript 원본 확인

**승인된 JavaScript 원본에 다음이 있는지 확인:**

```
http://localhost:8081
https://localhost:8081
https://auth.expo.io
https://*.expo.io
```

### 4. 웹 환경에서의 추가 설정

웹 환경에서는 `expo-web-browser`가 제대로 작동하지 않을 수 있습니다.

**대안:**

- 웹 환경에서는 직접 Google OAuth 페이지로 리디렉션
- 또는 웹 환경에서는 다른 방식으로 처리

## 체크리스트

- [ ] Google Cloud Console의 Web Client ID 확인
- [ ] 승인된 리디렉션 URI에 `http://localhost:8081` 추가
- [ ] 승인된 리디렉션 URI에 `https://localhost:8081` 추가
- [ ] JavaScript 원본에 `http://localhost:8081` 추가
- [ ] JavaScript 원본에 `https://localhost:8081` 추가
- [ ] 앱 재시작: `npx expo start --clear`

## 참고

- CORS 오류는 서버 측 설정 문제입니다
- Google OAuth의 경우 Google 서버에서 CORS를 설정해야 합니다
- 하지만 리디렉션 URI가 올바르게 설정되어 있으면 대부분 해결됩니다

## 웹 환경에서 테스트

웹에서 실행할 때:

```bash
npx expo start --web
```

콘솔에서 실제 사용되는 리디렉션 URI를 확인하고, 그 URI가 Google Cloud Console에 등록되어 있는지 확인하세요.
