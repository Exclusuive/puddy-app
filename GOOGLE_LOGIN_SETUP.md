# 구글 로그인 설정 가이드

이 문서는 PUDDY 앱에 구글 로그인을 설정하는 방법을 설명합니다.

## 📋 목차

1. [필수 패키지 설치](#1-필수-패키지-설치)
2. [Google Cloud Console 설정](#2-google-cloud-console-설정)
3. [Supabase 설정](#3-supabase-설정)
4. [환경 변수 설정](#4-환경-변수-설정)
5. [앱 설정](#5-앱-설정)
6. [테스트](#6-테스트)

---

## 1. 필수 패키지 설치

다음 패키지들이 이미 `package.json`에 추가되어 있습니다:

```bash
npm install expo-auth-session expo-web-browser
```

설치 후:

```bash
npx expo install --fix
```

---

## 2. Google Cloud Console 설정

### 2.1 Google Cloud 프로젝트 생성

1. [Google Cloud Console](https://console.cloud.google.com/)에 접속
2. 새 프로젝트 생성 또는 기존 프로젝트 선택
3. 프로젝트 이름: `PUDDY` (또는 원하는 이름)

### 2.2 OAuth 2.0 클라이언트 ID 생성

1. **API 및 서비스** > **사용자 인증 정보**로 이동
2. **+ 사용자 인증 정보 만들기** > **OAuth 클라이언트 ID** 선택
3. **애플리케이션 유형** 선택:

#### iOS 앱용 클라이언트 ID

- **애플리케이션 유형**: iOS
- **이름**: PUDDY iOS
- **번들 ID**: `com.exclusuive.puddy` (app.json의 bundleIdentifier와 동일)

#### Android 앱용 클라이언트 ID

- **애플리케이션 유형**: Android
- **이름**: PUDDY Android
- **패키지 이름**: `com.exclusuive.puddy` (app.json의 package와 동일)
- **SHA-1 인증서 지문**: 필요 (아래 참고)

#### Web 클라이언트 ID (Expo 개발용)

- **애플리케이션 유형**: 웹 애플리케이션
- **이름**: PUDDY Web
- **승인된 리디렉션 URI**:
  - `https://auth.expo.io/@your-expo-username/app`
  - `exp://localhost:8081` (로컬 개발용)

### 2.3 OAuth 동의 화면 설정

1. **OAuth 동의 화면** 탭으로 이동
2. **사용자 유형**: 외부 선택
3. 필수 정보 입력:

   - **앱 이름**: PUDDY
   - **사용자 지원 이메일**: 본인 이메일
   - **앱 로고**: (선택사항)
   - **개발자 연락처 정보**: 본인 이메일

4. **앱 도메인 및 링크** 설정 (필수):

   OAuth 동의 화면의 **앱 도메인** 섹션에서 다음 링크들을 입력해야 합니다:

   **애플리케이션 홈페이지:**

   - GitHub Pages: `https://your-username.github.io/puddy-app`
   - Netlify/Vercel: `https://your-app.netlify.app`
   - 또는 간단한 랜딩 페이지 URL
   - **참고**: 개발 단계에서는 임시로 GitHub 저장소 링크나 회사 웹사이트를 사용해도 됩니다.

   **애플리케이션 개인정보처리방침 링크:**

   - 예: `https://your-username.github.io/puddy-app/privacy-policy`
   - 또는 별도 호스팅된 개인정보처리방침 페이지
   - **참고**: 간단한 개인정보처리방침 페이지를 만들어 호스팅해야 합니다.

   **애플리케이션 서비스 약관 링크:**

   - 예: `https://your-username.github.io/puddy-app/terms-of-service`
   - 또는 별도 호스팅된 서비스 약관 페이지
   - **참고**: 간단한 서비스 약관 페이지를 만들어 호스팅해야 합니다.

   **간단한 해결 방법 (개발 단계):**

   개발 단계에서는 다음 방법을 사용할 수 있습니다:

   1. GitHub Pages에 간단한 정적 페이지 생성
   2. Netlify Drop으로 드래그 앤 드롭으로 호스팅
   3. Supabase Storage를 사용한 정적 호스팅
   4. 임시로 공개된 문서 링크 사용 (예: Google Docs 공개 링크)

5. **승인된 도메인** 설정 (선택사항):

   **중요**: 네이티브 앱(iOS/Android)만 사용하는 경우 승인된 도메인 설정은 **필수가 아닙니다**.
   하지만 Supabase를 사용하거나 웹 버전도 지원하는 경우 추가하는 것을 권장합니다.

   **Supabase를 사용하는 경우 (권장):**

   OAuth 동의 화면의 **승인된 도메인** 섹션에 다음 도메인을 추가:

   - `supabase.co` 또는 `supabase.in` (사용 중인 Supabase 리전에 따라)

   **웹 버전도 지원하는 경우:**

   - 웹 앱의 실제 도메인 추가
   - 개발 환경: `expo.io`, `expo.dev`, `exp.host` (Expo Go 사용 시)

   **참고:**

   - 도메인은 프로토콜(`https://`) 없이 입력
   - 예: `supabase.co` (O), `https://supabase.co` (X)
   - 네이티브 앱만 사용: 도메인 설정 생략 가능
   - Supabase 사용: Supabase 도메인 추가 권장 (리디렉션 URL 안정성)

6. **범위 추가**:

   - `openid`
   - `profile`
   - `email`

7. **테스트 사용자 추가** (테스트 단계에서만 필요)

### 2.4 클라이언트 ID 확인

생성된 클라이언트 ID를 복사하여 저장:

- iOS Client ID
- Android Client ID
- Web Client ID

---

## 3. Supabase 설정

### 3.1 Supabase 프로젝트에서 Google Provider 활성화

1. [Supabase Dashboard](https://app.supabase.com/)에 로그인
2. 프로젝트 선택
3. **Authentication** > **Providers**로 이동
4. **Google** 제공업체 찾기
5. **Enable Google** 토글 활성화
6. Google Cloud Console에서 받은 **Client ID**와 **Client Secret** 입력:
   - **Client ID (for OAuth)**: Web Client ID 사용
   - **Client Secret (for OAuth)**: Web Client의 Secret 사용
7. **Redirect URL** 확인:
   - Supabase가 제공하는 Redirect URL을 복사
   - Google Cloud Console의 Web Client ID 설정에 이 URL을 추가

### 3.2 Supabase Redirect URL을 Google에 추가

1. Google Cloud Console > **사용자 인증 정보**로 이동
2. Web Client ID 클릭하여 편집
3. **승인된 리디렉션 URI**에 Supabase Redirect URL 추가:
   ```
   https://[your-project-ref].supabase.co/auth/v1/callback
   ```

---

## 4. 환경 변수 설정

### 4.1 `.env` 파일 생성 (선택사항)

프로젝트 루트에 `.env` 파일 생성:

```env
EXPO_PUBLIC_GOOGLE_CLIENT_ID=your-web-client-id.apps.googleusercontent.com
EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID=your-ios-client-id.apps.googleusercontent.com
EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID=your-android-client-id.apps.googleusercontent.com
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=your-web-client-id.apps.googleusercontent.com
```

### 4.2 `app.json`에 환경 변수 추가 (권장)

`app.json`의 `extra` 필드에 추가:

```json
{
  "expo": {
    "extra": {
      "EXPO_PUBLIC_GOOGLE_CLIENT_ID": "your-web-client-id.apps.googleusercontent.com",
      "EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID": "your-ios-client-id.apps.googleusercontent.com",
      "EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID": "your-android-client-id.apps.googleusercontent.com",
      "EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID": "your-web-client-id.apps.googleusercontent.com",
      "SUPABASE_URL": "your-supabase-url",
      "SUPABASE_ANON_KEY": "your-supabase-anon-key"
    }
  }
}
```

---

## 5. 앱 설정

### 5.1 Android SHA-1 인증서 지문 확인

#### 개발용 (Expo Go)

```bash
# macOS/Linux
keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android

# Windows
keytool -list -v -keystore %USERPROFILE%\.android\debug.keystore -alias androiddebugkey -storepass android -keypass android
```

#### 프로덕션용 (EAS Build)

```bash
eas credentials
```

### 5.2 iOS URL Scheme 설정

`app.json`에 이미 설정되어 있지만 확인:

```json
{
  "expo": {
    "ios": {
      "bundleIdentifier": "com.exclusuive.puddy"
    },
    "android": {
      "package": "com.exclusuive.puddy"
    }
  }
}
```

---

## 6. 테스트

### 6.1 개발 환경에서 테스트

1. 환경 변수 설정 확인
2. 앱 재시작:
   ```bash
   npx expo start --clear
   ```
3. 로그인 화면에서 "Google로 계속하기" 버튼 클릭
4. 구글 로그인 화면이 표시되는지 확인
5. 로그인 성공 후 사용자 정보가 저장되는지 확인

### 6.2 문제 해결

#### 문제: "구글 로그인 설정이 완료되지 않았습니다"

- 환경 변수가 제대로 설정되었는지 확인
- `app.json`의 `extra` 필드 확인
- 앱 재시작

#### 문제: "리디렉션 URI 불일치"

- Google Cloud Console의 리디렉션 URI 확인
- Supabase Redirect URL이 Google에 추가되었는지 확인

#### 문제: iOS에서 로그인 실패

- Bundle ID가 Google Cloud Console의 iOS Client ID와 일치하는지 확인
- `app.json`의 `ios.bundleIdentifier` 확인

#### 문제: Android에서 로그인 실패

- Package Name이 Google Cloud Console의 Android Client ID와 일치하는지 확인
- SHA-1 인증서 지문이 Google에 등록되었는지 확인

#### 문제: "승인된 도메인" 오류

- 네이티브 앱만 사용하는 경우: 도메인 설정이 필수가 아니므로 다른 원인 확인
- Supabase를 사용하는 경우: `supabase.co` 또는 `supabase.in` 도메인 추가 확인
- 웹 버전 사용 시: 웹 앱의 실제 도메인 추가 확인

---

## 7. 프로덕션 배포 시 주의사항

### 7.1 OAuth 동의 화면 검토

- 프로덕션 배포 전 Google OAuth 동의 화면 검토 요청 필요
- 검토 완료까지 테스트 사용자만 로그인 가능

### 7.2 프로덕션 인증서

- EAS Build로 빌드 시 프로덕션 인증서의 SHA-1을 Google에 추가해야 함
- `eas credentials` 명령어로 확인 가능

### 7.3 환경 변수 관리

- 프로덕션 환경에서는 EAS Secrets 사용 권장:
  ```bash
  eas secret:create --name EXPO_PUBLIC_GOOGLE_CLIENT_ID --value your-client-id
  ```

---

## 8. 추가 리소스

- [Expo AuthSession 문서](https://docs.expo.dev/guides/authentication/#google)
- [Google OAuth 2.0 문서](https://developers.google.com/identity/protocols/oauth2)
- [Supabase Auth 문서](https://supabase.com/docs/guides/auth)

### 템플릿 파일

프로젝트 루트에 다음 템플릿 파일들이 있습니다:

- `PRIVACY_POLICY_TEMPLATE.md` - 개인정보처리방침 템플릿
- `TERMS_OF_SERVICE_TEMPLATE.md` - 서비스 약관 템플릿

이 템플릿들을 참고하여 실제 페이지를 만들고 호스팅하세요.

---

## 체크리스트

설정 완료 확인:

- [ ] Google Cloud Console 프로젝트 생성
- [ ] iOS, Android, Web OAuth 클라이언트 ID 생성
- [ ] OAuth 동의 화면 설정 완료
- [ ] **앱 도메인 링크 설정** (필수):
  - [ ] 애플리케이션 홈페이지 URL
  - [ ] 개인정보처리방침 링크
  - [ ] 서비스 약관 링크
- [ ] **승인된 도메인 설정** (선택사항: Supabase 사용 시 supabase.co 추가 권장)
- [ ] Supabase에서 Google Provider 활성화
- [ ] Supabase Redirect URL을 Google에 추가
- [ ] 환경 변수 설정 (app.json 또는 .env)
- [ ] Android SHA-1 인증서 지문 등록
- [ ] 앱에서 로그인 테스트 성공

---

## 참고사항

- 개발 중에는 Web Client ID를 사용하여 Expo Go에서 테스트 가능
- 프로덕션 빌드는 각 플랫폼별 Client ID 필요
- Google OAuth 동의 화면 검토는 최대 1주일 소요될 수 있음
