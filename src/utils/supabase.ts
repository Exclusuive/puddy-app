import { createClient } from "@supabase/supabase-js";
import Constants from "expo-constants";

// Supabase 환경 변수 설정
// app.json의 extra 필드 또는 환경 변수에서 가져옵니다
const getEnvVar = (key: string, fallback: string = ""): string => {
  // Expo Constants에서 가져오기
  const fromConstants = Constants.expoConfig?.extra?.[key];
  if (fromConstants) return fromConstants as string;

  // 환경 변수에서 가져오기
  const fromEnv = process.env[`EXPO_PUBLIC_${key}`];
  if (fromEnv) return fromEnv;

  return fallback;
};

const SUPABASE_URL = getEnvVar("SUPABASE_URL");
const SUPABASE_ANON_KEY = getEnvVar("SUPABASE_ANON_KEY");

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn(
    "⚠️ Supabase URL 또는 Anon Key가 설정되지 않았습니다.\n" +
      "app.json의 extra 필드 또는 환경 변수를 확인해주세요.\n" +
      "예: EXPO_PUBLIC_SUPABASE_URL, EXPO_PUBLIC_SUPABASE_ANON_KEY"
  );
}

export const supabase = createClient(
  SUPABASE_URL || "https://placeholder.supabase.co",
  SUPABASE_ANON_KEY || "placeholder-key",
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
);
