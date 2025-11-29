import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
  ActivityIndicator,
  Alert,
  Modal,
} from "react-native";
import { useState } from "react";
import { useAuthStore } from "../store/authStore";

export default function LoginScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const login = useAuthStore((state) => state.login);

  const handleGoogleLogin = () => {
    Alert.alert("알림", "현재 준비중입니다.");
  };

  const handleKakaoLogin = () => {
    Alert.alert("알림", "현재 준비중입니다.");
  };

  const handleTempLogin = async () => {
    console.log("임시 로그인 처리");
    setIsLoading(true);

    try {
      // 더미 사용자 정보로 로그인 처리
      await login({
        id: "temp-user-001",
        email: "temp@example.com",
        name: "테스트 사용자",
        photo: undefined,
      });

      console.log("로그인 완료");
    } catch (error) {
      console.error("로그인 처리 실패:", error);
      Alert.alert("오류", "로그인 처리 중 오류가 발생했습니다.");
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
          <Text style={styles.subtitle}>간편하게 만드는 강아지 신분증</Text>
        </View>

        {/* 로그인 버튼 영역 */}
        <View style={styles.buttonContainer}>
          {/* 구글 로그인 */}
          <TouchableOpacity
            style={[styles.loginButton, styles.googleButton]}
            onPress={handleGoogleLogin}
            activeOpacity={0.8}
          >
            <View style={styles.buttonIconContainer}>
              <Image
                source={{
                  uri: "https://www.gstatic.com/marketing-cms/assets/images/d5/dc/cfe9ce8b4425b410b49b7f2dd3f3/g.webp=s48-fcrop64=1,00000000ffffffff-rw",
                }}
                style={styles.buttonIcon}
                onError={() => {}}
              />
            </View>
            <Text style={[styles.loginButtonText, styles.googleButtonText]}>
              Google로 계속하기
            </Text>
          </TouchableOpacity>

          {/* 카카오 로그인 */}
          <TouchableOpacity
            style={[styles.loginButton, styles.kakaoButton]}
            onPress={handleKakaoLogin}
            activeOpacity={0.8}
          >
            <View style={styles.buttonIconContainer}>
              <Text style={styles.kakaoIcon}>K</Text>
            </View>
            <Text style={[styles.loginButtonText, styles.kakaoButtonText]}>
              카카오로 계속하기
            </Text>
          </TouchableOpacity>

          {/* 임시 로그인 */}
          <TouchableOpacity
            style={[
              styles.loginButton,
              styles.tempButton,
              isLoading && styles.buttonDisabled,
            ]}
            onPress={handleTempLogin}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            {isLoading ? (
              <ActivityIndicator color="#111111" />
            ) : (
              <Text style={[styles.loginButtonText, styles.tempButtonText]}>
                임시 로그인
              </Text>
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
    paddingTop: 120,
    paddingBottom: 60,
  },
  logoContainer: {
    alignItems: "center",
  },
  logo: {
    width: 200,
    height: 60,
    marginBottom: 24,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "500",
    color: "#111111",
    textAlign: "center",
    lineHeight: 32,
  },
  buttonContainer: {
    width: "100%",
    gap: 12,
  },
  loginButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  googleButton: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  kakaoButton: {
    backgroundColor: "#FEE500",
  },
  tempButton: {
    backgroundColor: "#F3F4F6",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonIconContainer: {
    width: 20,
    height: 20,
    marginRight: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonIcon: {
    width: 20,
    height: 20,
  },
  kakaoIcon: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000000",
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  kakaoButtonText: {
    color: "#000000",
  },
  googleButtonText: {
    color: "#111111",
  },
  tempButtonText: {
    color: "#111111",
  },
  termsText: {
    fontSize: 12,
    color: "#9CA3AF",
    textAlign: "center",
    lineHeight: 18,
    marginTop: 8,
  },
});
