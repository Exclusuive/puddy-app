import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  Modal,
} from "react-native";
import { useState } from "react";
import { Syringe, Hospital, Camera } from "lucide-react-native";
import VaccinationScreen from "./VaccinationScreen";
import MedicalRecordScreen from "./MedicalRecordScreen";

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

interface PetDetailScreenProps {
  pet: Pet;
  onClose: () => void;
}

export default function PetDetailScreen({
  pet,
  onClose,
}: PetDetailScreenProps) {
  const [showVaccination, setShowVaccination] = useState(false);
  const [showMedicalRecord, setShowMedicalRecord] = useState(false);

  // 생년월일에서 나이 계산 함수
  const calculateAge = (birthDate: string): string => {
    try {
      const [year, month, day] = birthDate.split(".").map(Number);
      const birth = new Date(year, month - 1, day);
      const today = new Date();

      let age = today.getFullYear() - birth.getFullYear();
      const monthDiff = today.getMonth() - birth.getMonth();

      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birth.getDate())
      ) {
        age--;
      }

      return `${age}살`;
    } catch {
      return "";
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>반려견 상세 정보</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* 프로필 이미지 섹션 */}
        <View style={styles.profileSection}>
          <View style={styles.profileImageContainer}>
            <Image
              source={require("../../assets/example.png")}
              style={styles.profileImage}
              resizeMode="cover"
            />
          </View>
          <View style={styles.statusBadgeContainer}>
            {pet.status === "실종 중" ? (
              <View style={styles.statusBadgeDanger}>
                <Text style={styles.statusBadgeTextDanger}>🔴 실종 중</Text>
              </View>
            ) : (
              <View style={styles.statusBadge}>
                <Text style={styles.statusBadgeText}>✓ 등록 완료</Text>
              </View>
            )}
          </View>
        </View>

        {/* 기본 정보 카드 */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>기본 정보</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>이름</Text>
            <Text style={styles.infoValue}>{pet.name}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>ID</Text>
            <Text style={styles.infoValue}>{pet.id}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>성별</Text>
            <Text style={styles.infoValue}>{pet.gender}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>생년월일</Text>
            <Text style={styles.infoValue}>
              {pet.birthDate} ({calculateAge(pet.birthDate)})
            </Text>
          </View>
        </View>

        {/* 코 사진 인증 카드 */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>신원 인증</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>코 사진 인증</Text>
            <View style={styles.verifiedContainer}>
              {pet.isNosePrintVerified ? (
                <>
                  <Text style={styles.verifiedIcon}>✓</Text>
                  <Text style={styles.verifiedText}>인증 완료</Text>
                </>
              ) : (
                <>
                  <Text style={styles.unverifiedIcon}>✗</Text>
                  <Text style={styles.unverifiedText}>미인증</Text>
                </>
              )}
            </View>
          </View>
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
  backButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  backButtonText: {
    fontSize: 24,
    color: "#1F2937",
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
  profileSection: {
    alignItems: "center",
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  profileImageContainer: {
    width: 150,
    height: 150,
    borderRadius: 16,
    backgroundColor: "#E5E7EB",
    overflow: "hidden",
    borderWidth: 3,
    borderColor: "#FF9D4D",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  profileImage: {
    width: "100%",
    height: "100%",
  },
  statusBadgeContainer: {
    marginTop: 16,
  },
  statusBadge: {
    backgroundColor: "#D1FAE5",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  statusBadgeDanger: {
    backgroundColor: "#FEE2E2",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  statusBadgeText: {
    color: "#065F46",
    fontSize: 14,
    fontWeight: "600",
  },
  statusBadgeTextDanger: {
    color: "#991B1B",
    fontSize: 14,
    fontWeight: "600",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 16,
    marginBottom: 16,
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
  verifiedContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  verifiedIcon: {
    fontSize: 18,
    color: "#10B981",
  },
  verifiedText: {
    fontSize: 14,
    color: "#10B981",
    fontWeight: "600",
  },
  unverifiedIcon: {
    fontSize: 18,
    color: "#EF4444",
  },
  unverifiedText: {
    fontSize: 14,
    color: "#EF4444",
    fontWeight: "600",
  },
  actionSection: {
    paddingHorizontal: 16,
    marginTop: 8,
    gap: 12,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
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
  actionButtonIcon: {
    marginRight: 12,
  },
  actionButtonText: {
    fontSize: 16,
    color: "#1F2937",
    fontWeight: "600",
  },
});
