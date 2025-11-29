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
import {
  X,
  Calendar,
  MapPin,
  FileText,
  Phone,
  Camera,
} from "lucide-react-native";
import PetCard from "../components/PetCard";

interface Pet {
  id: string;
  name: string;
  birthDate: string;
  gender: "수컷" | "암컷";
  breed?: string;
  profileImage?: string;
  isNosePrintVerified: boolean;
  status: "등록 완료" | "실종 중";
}

interface MissingReportScreenProps {
  pets: Pet[];
  onClose: () => void;
  onSuccess?: () => void;
}

export default function MissingReportScreen({
  pets,
  onClose,
  onSuccess,
}: MissingReportScreenProps) {
  const [selectedPetId, setSelectedPetId] = useState<string | null>(
    pets.length === 1 ? pets[0].id : null
  );
  const [missingDate, setMissingDate] = useState("");
  const [missingTime, setMissingTime] = useState("");
  const [missingLocation, setMissingLocation] = useState("");
  const [description, setDescription] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedPet = pets.find((pet) => pet.id === selectedPetId);

  const handleSubmit = async () => {
    // 유효성 검사
    if (!selectedPetId) {
      Alert.alert("알림", "반려견을 선택해주세요.");
      return;
    }

    if (!missingDate || !missingTime) {
      Alert.alert("알림", "실종 일시를 입력해주세요.");
      return;
    }

    if (!missingLocation.trim()) {
      Alert.alert("알림", "실종 장소를 입력해주세요.");
      return;
    }

    if (!contactPhone.trim()) {
      Alert.alert("알림", "연락처를 입력해주세요.");
      return;
    }

    setIsSubmitting(true);
    try {
      // TODO: 실제 API 호출로 실종 신고 제출
      await new Promise((resolve) => setTimeout(resolve, 1500));

      Alert.alert(
        "신고 완료",
        "실종 신고가 접수되었습니다.\n관리자가 확인 후 처리하겠습니다.",
        [
          {
            text: "확인",
            onPress: () => {
              onSuccess?.();
              onClose();
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert("오류", "신고 접수에 실패했습니다. 다시 시도해주세요.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <X size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>실종 신고</Text>
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
            실종 신고를 접수하면 등록된 코 사진 정보가{"\n"}
            실종 반려견 찾기에 활용됩니다.
          </Text>
        </View>

        {/* 반려견 선택 */}
        {pets.length > 1 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>실종 반려견 선택</Text>
            <View style={styles.petSelector}>
              {pets.map((pet) => (
                <TouchableOpacity
                  key={pet.id}
                  style={[
                    styles.petOption,
                    selectedPetId === pet.id && styles.petOptionSelected,
                  ]}
                  onPress={() => setSelectedPetId(pet.id)}
                >
                  <Text
                    style={[
                      styles.petOptionText,
                      selectedPetId === pet.id && styles.petOptionTextSelected,
                    ]}
                  >
                    {pet.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* 선택된 반려견 정보 - PetCard로 표시 */}
        {selectedPet && (
          <View style={styles.petCardContainer}>
            <PetCard pets={[selectedPet]} showRegisterCard={false} />
          </View>
        )}

        {/* 실종 일시 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            실종 일시 <Text style={styles.required}>*</Text>
          </Text>
          <View style={styles.dateTimeRow}>
            <View style={styles.dateTimeInput}>
              <Calendar size={20} color="#6B7280" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="YYYY.MM.DD"
                value={missingDate}
                onChangeText={setMissingDate}
                placeholderTextColor="#9CA3AF"
              />
            </View>
            <View style={styles.dateTimeInput}>
              <Text style={styles.timeLabel}>시</Text>
              <TextInput
                style={styles.input}
                placeholder="HH:MM"
                value={missingTime}
                onChangeText={setMissingTime}
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>
        </View>

        {/* 실종 장소 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            실종 장소 <Text style={styles.required}>*</Text>
          </Text>
          <View style={styles.inputContainer}>
            <MapPin size={20} color="#6B7280" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="실종된 장소를 입력해주세요"
              value={missingLocation}
              onChangeText={setMissingLocation}
              placeholderTextColor="#9CA3AF"
            />
          </View>
        </View>

        {/* 실종 당시 특징/메모 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>실종 당시 특징 및 메모</Text>
          <View style={styles.textAreaContainer}>
            <FileText size={20} color="#6B7280" style={styles.textAreaIcon} />
            <TextInput
              style={styles.textArea}
              placeholder="실종 당시 착용한 옷, 특징, 기타 정보를 입력해주세요"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              placeholderTextColor="#9CA3AF"
            />
          </View>
        </View>

        {/* 연락처 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            연락처 <Text style={styles.required}>*</Text>
          </Text>
          <View style={styles.inputContainer}>
            <Phone size={20} color="#6B7280" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="010-0000-0000"
              value={contactPhone}
              onChangeText={setContactPhone}
              keyboardType="phone-pad"
              placeholderTextColor="#9CA3AF"
            />
          </View>
        </View>

        {/* 사진 업로드 (선택) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>참고 사진 (선택)</Text>
          <TouchableOpacity
            style={styles.photoButton}
            onPress={() =>
              Alert.alert("사진 업로드", "사진 업로드 기능은 준비 중입니다.")
            }
          >
            <Camera size={24} color="#FF9D4D" />
            <Text style={styles.photoButtonText}>사진 추가하기</Text>
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
              <Text style={styles.submitButtonText}>실종 신고 접수</Text>
            )}
          </TouchableOpacity>
          <Text style={styles.submitNote}>
            신고 접수 후 관리자 확인을 거쳐 실종 반려견 찾기에 등록됩니다.
          </Text>
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
  petCardContainer: {
    marginTop: 16,
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
  petSelector: {
    flexDirection: "row",
    gap: 12,
    flexWrap: "wrap",
  },
  petOption: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  petOptionSelected: {
    backgroundColor: "#FF9D4D",
    borderColor: "#FF9D4D",
  },
  petOptionText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
  },
  petOptionTextSelected: {
    color: "#FFFFFF",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: "#F3F4F6",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
  infoValue: {
    fontSize: 16,
    color: "#1F2937",
    fontWeight: "600",
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
  },
  dateTimeRow: {
    flexDirection: "row",
    gap: 12,
  },
  dateTimeInput: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  timeLabel: {
    fontSize: 14,
    color: "#6B7280",
    marginRight: 8,
    fontWeight: "500",
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
  textAreaContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    minHeight: 120,
  },
  textAreaIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  textArea: {
    flex: 1,
    fontSize: 16,
    color: "#1F2937",
    minHeight: 100,
  },
  photoButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingVertical: 16,
    borderWidth: 2,
    borderColor: "#FF9D4D",
    borderStyle: "dashed",
    gap: 8,
  },
  photoButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FF9D4D",
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
  submitNote: {
    fontSize: 12,
    color: "#6B7280",
    textAlign: "center",
    marginTop: 12,
    lineHeight: 18,
  },
});
