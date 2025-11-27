# React Native App

Expo + TypeScript + Tailwind CSS (NativeWind) + Zustand로 구성된 React Native 앱입니다.

## 설치된 패키지

- **Expo**: React Native 개발 프레임워크
- **NativeWind**: Tailwind CSS for React Native
- **Zustand**: 경량 상태 관리 라이브러리
- **TypeScript**: 타입 안정성

## 프로젝트 구조

```
app/
├── src/
│   ├── components/     # 재사용 가능한 컴포넌트
│   ├── screens/        # 화면 컴포넌트
│   └── store/          # Zustand 스토어
├── App.tsx             # 메인 앱 컴포넌트
├── tailwind.config.js  # Tailwind 설정
├── babel.config.js     # Babel 설정 (NativeWind 포함)
└── metro.config.js     # Metro 번들러 설정
```

## 실행 방법

```bash
# 개발 서버 시작
npm start

# iOS 시뮬레이터에서 실행
npm run ios

# Android 에뮬레이터에서 실행
npm run android

# 웹 브라우저에서 실행
npm run web
```

## 사용 방법

### Tailwind CSS (NativeWind)

컴포넌트에서 `className` prop을 사용하여 Tailwind 클래스를 적용할 수 있습니다:

```tsx
import { View, Text } from 'react-native';

export default function MyComponent() {
  return (
    <View className="flex-1 bg-white items-center justify-center">
      <Text className="text-2xl font-bold text-gray-900">
        Hello World
      </Text>
    </View>
  );
}
```

### Zustand 스토어

`src/store/useStore.ts` 파일에서 스토어를 정의하고 사용할 수 있습니다:

```tsx
import { useStore } from './src/store/useStore';

export default function MyComponent() {
  const { count, increment } = useStore();
  
  return (
    // ...
  );
}
```

## 예제

`src/components/Counter.tsx` 파일에서 Tailwind CSS와 Zustand를 함께 사용하는 예제를 확인할 수 있습니다.

# puddy-app
