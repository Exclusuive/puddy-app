import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useState } from "react";
import { X, Phone, User, Heart } from "lucide-react-native";
import { useAuthStore } from "../store/authStore";
import { createEmergencyContact } from "../utils/api";
import type { EmergencyContactInsert } from "../utils/types";

interface EmergencyContactScreenProps {
  onBack: () => void;
  onSuccess?: () => void;
}

export default function EmergencyContactScreen({
  onBack,
  onSuccess,
}: EmergencyContactScreenProps) {
  const { user } = useAuthStore();
  const [contactName, setContactName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [relationship, setRelationship] = useState("");
  const [isPrimary, setIsPrimary] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!user) {
      Alert.alert("오류", "로그인이 필요합니다.");
      return;
    }

    // 유효성 검사
    if (!contactName.trim()) {
      Alert.alert("알림", "연락처 이름을 입력해주세요.");
      return;
    }

    if (!phoneNumber.trim()) {
      Alert.alert("알림", "전화번호를 입력해주세요.");
      return;
    }

    // 전화번호 형식 검사 (간단한 검사)
    const phoneRegex = /^[0-9-]+$/;
    if (!phoneRegex.test(phoneNumber.replace(/\s/g, ""))) {
      Alert.alert("알림", "올바른 전화번호 형식을 입력해주세요.");
      return;
    }

    setIsSubmitting(true);
    try {
      const contactData: EmergencyContactInsert = {
        user_id: user.id,
        contact_name: contactName.trim(),
        phone_number: phoneNumber.trim(),
        relationship: relationship.trim() || undefined,
        is_primary: isPrimary,
      };

      await createEmergencyContact(contactData);

      Alert.alert("등록 완료", "긴급 연락처가 등록되었습니다.", [
        {
          text: "확인",
          onPress: () => {
            onSuccess?.();
            onBack();
          },
        },
      ]);
    } catch (error) {
      console.error("긴급 연락처 등록 실패:", error);
      Alert.alert("오류", "연락처 등록에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.closeButton}>
          <X size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>긴급 연락처 등록</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* 안내 메시지 */}
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            실종 상황 발생 시 연락할 수 있는{"\n"}
            긴급 연락처를 등록해주세요.
          </Text>
        </View>

        {/* 연락처 이름 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            연락처 이름 <Text style={styles.required}>*</Text>
          </Text>
          <View style={styles.inputContainer}>
            <User size={20} color="#6B7280" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="이름을 입력해주세요"
              value={contactName}
              onChangeText={setContactName}
              placeholderTextColor="#9CA3AF"
            />
          </View>
        </View>

        {/* 전화번호 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            전화번호 <Text style={styles.required}>*</Text>
          </Text>
          <View style={styles.inputContainer}>
            <Phone size={20} color="#6B7280" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="010-0000-0000"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
              placeholderTextColor="#9CA3AF"
            />
          </View>
        </View>

        {/* 관계 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>관계</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="가족, 친구 등 (선택사항)"
              value={relationship}
              onChangeText={setRelationship}
              placeholderTextColor="#9CA3AF"
            />
          </View>
        </View>

        {/* 주 연락처 설정 */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => setIsPrimary(!isPrimary)}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.checkbox,
                isPrimary && styles.checkboxChecked,
              ]}
            >
              {isPrimary && (
                <Text style={styles.checkboxCheckmark}>✓</Text>
              )}
            </View>
            <View style={styles.checkboxContent}>
              <Text style={styles.checkboxLabel}>주 연락처로 설정</Text>
              <Text style={styles.checkboxDescription}>
                주 연락처는 실종 신고 시 우선적으로 사용됩니다.
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* 제출 버튼 */}
        <View style={styles.submitSection}>
          <TouchableOpacity
            style={[
              styles.submitButton,
              isSubmitting && styles.submitButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.submitButtonText}>등록하기</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF6EC",
  },
  header: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  closeButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingBottom: 90,
  },
  infoBox: {
    backgroundColor: "#FEF3C7",
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#FDE68A",
  },
  infoText: {
    fontSize: 14,
    color: "#92400E",
    lineHeight: 20,
    textAlign: "center",
  },
  section: {
    paddingHorizontal: 16,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 12,
  },
  required: {
    color: "#EF4444",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#1F2937",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#D1D5DB",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: "#FF9D4D",
    borderColor: "#FF9D4D",
  },
  checkboxCheckmark: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "bold",
  },
  checkboxContent: {
    flex: 1,
  },
  checkboxLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 4,
  },
  checkboxDescription: {
    fontSize: 12,
    color: "#6B7280",
    lineHeight: 18,
  },
  submitSection: {
    paddingHorizontal: 16,
    marginTop: 32,
    marginBottom: 24,
  },
  submitButton: {
    backgroundColor: "#FF9D4D",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});

