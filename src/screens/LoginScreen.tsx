import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
  ActivityIndicator,
  Platform,
  Alert,
} from "react-native";
import { useState, useEffect } from "react";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { useAuthStore } from "../store/authStore";
import { supabase } from "../utils/supabase";

// WebBrowser 인증 완료 후 리다이렉트 처리
WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const login = useAuthStore((state) => state.login);

  // 구글 OAuth 설정
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  });

  // 구글 로그인 응답 처리
  useEffect(() => {
    if (response?.type === "success") {
      handleGoogleSignIn(response.authentication);
    } else if (response?.type === "error") {
      console.error("구글 로그인 오류:", response.error);
      Alert.alert(
        "로그인 실패",
        "구글 로그인에 실패했습니다. 다시 시도해주세요."
      );
      setIsLoading(false);
    }
  }, [response]);

  const handleGoogleSignIn = async (authentication: any) => {
    if (!authentication?.accessToken) {
      Alert.alert("오류", "인증 토큰을 받지 못했습니다.");
      setIsLoading(false);
      return;
    }

    try {
      // Supabase에 구글 인증 토큰으로 로그인
      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: "google",
        token: authentication.accessToken,
      });

      if (error) {
        console.error("Supabase 로그인 오류:", error);
        Alert.alert("로그인 실패", error.message);
        setIsLoading(false);
        return;
      }

      if (data?.user) {
        const user = data.user;
        const userMetadata = user.user_metadata || {};

        // 사용자 정보를 authStore에 저장
        await login({
          id: user.id,
          email: user.email || "",
          name: userMetadata.full_name || userMetadata.name || "사용자",
          photo: userMetadata.avatar_url || userMetadata.picture,
        });

        // Supabase Users 테이블에 사용자 정보 저장/업데이트
        try {
          const { error: upsertError } = await supabase.from("Users").upsert(
            {
              id: user.id,
              email: user.email,
              name: userMetadata.full_name || userMetadata.name || "사용자",
              google_id: userMetadata.sub || user.id,
              photo_url: userMetadata.avatar_url || userMetadata.picture,
              last_login_at: new Date().toISOString(),
            },
            {
              onConflict: "id",
            }
          );

          if (upsertError) {
            console.error("사용자 정보 저장 실패:", upsertError);
          }
        } catch (error) {
          console.error("사용자 정보 저장 중 오류:", error);
        }
      }
    } catch (error) {
      console.error("로그인 처리 실패:", error);
      Alert.alert("오류", "로그인 처리 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (!request) {
      Alert.alert("오류", "구글 로그인 설정이 완료되지 않았습니다.");
      return;
    }

    setIsLoading(true);
    try {
      await promptAsync();
    } catch (error) {
      console.error("구글 로그인 시작 실패:", error);
      Alert.alert("오류", "구글 로그인을 시작할 수 없습니다.");
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* 로고 영역 */}
        <View style={styles.logoContainer}>
          <Image
            source={require("../../assets/logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>PUDDY</Text>
          <Text style={styles.subtitle}>
            강아지 코 사진으로{"\n"}신원을 확인하세요
          </Text>
        </View>

        {/* 로그인 버튼 영역 */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.googleButton, isLoading && styles.buttonDisabled]}
            onPress={handleGoogleLogin}
            disabled={isLoading || !request}
            activeOpacity={0.8}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <View style={styles.googleIconContainer}>
                  <Image
                    source={{
                      uri: "https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg",
                    }}
                    style={styles.googleIconImage}
                    onError={() => {
                      // 이미지 로드 실패 시 무시 (텍스트만 표시)
                    }}
                  />
                </View>
                <Text style={styles.googleButtonText}>Google로 계속하기</Text>
              </>
            )}
          </TouchableOpacity>

          <Text style={styles.termsText}>
            로그인 시 서비스 이용약관 및{"\n"}
            개인정보 처리방침에 동의하게 됩니다.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF6EC",
  },
  content: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: 80,
    paddingBottom: 60,
  },
  logoContainer: {
    alignItems: "center",
  },
  logo: {
    width: 120,
    height: 40,
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 24,
  },
  buttonContainer: {
    width: "100%",
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#4285F4",
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 24,
    shadowColor: "#4285F4",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  googleIconContainer: {
    width: 20,
    height: 20,
    marginRight: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  googleIconImage: {
    width: 20,
    height: 20,
  },
  googleButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  termsText: {
    fontSize: 12,
    color: "#9CA3AF",
    textAlign: "center",
    lineHeight: 18,
  },
});
