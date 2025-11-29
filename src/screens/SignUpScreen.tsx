import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Alert,
  TextInput,
} from "react-native";
import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { Edit } from "lucide-react-native";
import { useAuthStore } from "../store/authStore";
import { supabase } from "../utils/supabase";

interface SignUpScreenProps {
  userInfo: {
    email: string;
    name: string;
    photo?: string;
    googleId: string;
  };
  onBack: () => void;
  onSuccess: (userId: string) => void;
}

export default function SignUpScreen({
  userInfo,
  onBack,
  onSuccess,
}: SignUpScreenProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState(userInfo.name || "");
  const [profileImage, setProfileImage] = useState<string | null>(
    userInfo.photo || null
  );
  const login = useAuthStore((state) => state.login);

  // 프로필 사진 선택
  const pickImage = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("권한 필요", "갤러리 접근 권한이 필요합니다.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setProfileImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error("이미지 선택 오류:", error);
      Alert.alert("오류", "이미지를 선택할 수 없습니다.");
    }
  };

  const handleSignUp = async () => {
    // 이름 검증
    if (!name.trim()) {
      Alert.alert("입력 오류", "이름을 입력해주세요.");
      return;
    }

    setIsLoading(true);
    try {
      // 프로필 이미지 업로드 (선택사항)
      let photoUrl = profileImage || userInfo.photo || null;

      // 로컬 이미지인 경우 Supabase Storage에 업로드 (나중에 구현 가능)
      // 현재는 로컬 URI를 그대로 사용하거나, Google 프로필 이미지 사용

      // Supabase Users 테이블에 새 사용자 생성
      const { data: insertData, error: insertError } = await supabase
        .from("Users")
        .insert({
          email: userInfo.email,
          name: name.trim(),
          google_id: userInfo.googleId,
          photo_url: photoUrl,
          last_login_at: new Date().toISOString(),
        })
        .select("id")
        .single();

      if (insertError) {
        console.error("회원가입 실패:", insertError);
        Alert.alert("회원가입 실패", insertError.message);
        setIsLoading(false);
        return;
      }

      if (insertData) {
        const userId = insertData.id;

        // 사용자 정보를 authStore에 저장
        await login({
          id: userId,
          email: userInfo.email,
          name: name.trim(),
          photo: photoUrl || undefined,
        });

        Alert.alert("회원가입 완료", "PUDDY에 오신 것을 환영합니다!");
        onSuccess(userId);
      }
    } catch (error) {
      console.error("회원가입 처리 실패:", error);
      Alert.alert("오류", "회원가입 처리 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* 헤더 */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Image
            source={require("../../assets/logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
          <View style={styles.headerSpacer} />
        </View>

        {/* 제목 */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>회원가입</Text>
          <Text style={styles.subtitle}>프로필 사진과 이름을 설정해주세요</Text>
        </View>

        {/* 프로필 사진 선택 */}
        <View style={styles.profileSection}>
          <TouchableOpacity
            onPress={pickImage}
            style={styles.profileImageContainer}
            disabled={isLoading}
          >
            {profileImage ? (
              <Image
                source={{ uri: profileImage }}
                style={styles.profileImage}
              />
            ) : (
              <View style={styles.profileImagePlaceholder}>
                <Text style={styles.profileImagePlaceholderText}>사진</Text>
              </View>
            )}
            <View style={styles.profileImageEditBadge}>
              <Edit size={20} color="#1F2937" />
            </View>
          </TouchableOpacity>
        </View>

        {/* 이름 입력 */}
        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>이름</Text>
          <TextInput
            style={styles.input}
            placeholder="이름을 입력해주세요"
            value={name}
            onChangeText={setName}
            editable={!isLoading}
            maxLength={20}
          />
        </View>

        {/* 이메일 표시 (수정 불가) */}
        <View style={styles.emailSection}>
          <Text style={styles.emailLabel}>이메일</Text>
          <Text style={styles.emailValue}>{userInfo.email}</Text>
        </View>

        {/* 회원가입 버튼 */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.signUpButton,
              (isLoading || !name.trim()) && styles.buttonDisabled,
            ]}
            onPress={handleSignUp}
            disabled={isLoading || !name.trim()}
            activeOpacity={0.8}
          >
            <Text style={styles.signUpButtonText}>
              {isLoading ? "가입 중..." : "회원가입하기"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={onBack}
            disabled={isLoading}
          >
            <Text style={styles.cancelButtonText}>취소</Text>
          </TouchableOpacity>
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
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 24,
    justifyContent: "space-between",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  backButtonText: {
    fontSize: 24,
    color: "#1F2937",
  },
  logo: {
    width: 100,
    height: 32,
  },
  headerSpacer: {
    width: 40,
  },
  titleContainer: {
    alignItems: "flex-start",
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 20,
  },
  profileSection: {
    alignItems: "center",
    marginBottom: 16,
  },
  profileImageContainer: {
    position: "relative",
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#E5E7EB",
  },
  profileImagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#E5E7EB",
    justifyContent: "center",
    alignItems: "center",
  },
  profileImagePlaceholderText: {
    fontSize: 20,
    color: "#9CA3AF",
  },
  profileImageEditBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  inputSection: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: "#1F2937",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  emailSection: {
    marginBottom: 20,
    padding: 14,
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
  },
  emailLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6B7280",
    marginBottom: 4,
  },
  emailValue: {
    fontSize: 14,
    color: "#1F2937",
  },
  buttonContainer: {
    width: "100%",
  },
  signUpButton: {
    backgroundColor: "#FF9D4D",
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#FF9D4D",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  signUpButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  cancelButton: {
    paddingVertical: 10,
  },
  cancelButtonText: {
    color: "#6B7280",
    fontSize: 14,
    textAlign: "center",
  },
});
