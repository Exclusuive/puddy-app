import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useState } from "react";
import { X, Phone } from "lucide-react-native";
import CameraScanner from "../components/CameraScanner";
import PetCard from "../components/PetCard";

interface PetInfo {
  id: string;
  name: string;
  birthDate: string;
  gender: "수컷" | "암컷";
  breed?: string;
  profileImage?: string;
  isNosePrintVerified: boolean;
  status: "등록 완료" | "실종 중";
}

interface OwnerInfo {
  name: string;
  phone: string;
  email?: string;
}

interface MissingInfo {
  missingDate: string;
  missingLocation: string;
  description?: string;
  contactPhone: string;
}

interface IdentityVerificationScreenProps {
  onClose?: () => void;
  mode?: "identity" | "found"; // 신원 인증 또는 유기견 발견
}

type ScreenState = "camera" | "analyzing" | "result";

export default function IdentityVerificationScreen({
  onClose,
  mode = "identity",
}: IdentityVerificationScreenProps) {
  const [screenState, setScreenState] = useState<ScreenState>("camera");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [petInfo, setPetInfo] = useState<PetInfo | null>(null);
  const [ownerInfo, setOwnerInfo] = useState<OwnerInfo | null>(null);
  const [missingInfo, setMissingInfo] = useState<MissingInfo | null>(null);

  const handlePhotoTaken = async (uri: string) => {
    setScreenState("analyzing");
    setIsAnalyzing(true);

    try {
      // TODO: 실제 API 호출로 이미지 분석 처리
      // 여기서는 시뮬레이션 (3초 대기)
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // 분석 완료 후 결과 데이터 설정 (임시 데이터)
      setPetInfo({
        id: "000-000-0000001",
        name: "Coco",
        birthDate: "2021.05.15",
        gender: "암컷",
        breed: "골든 리트리버",
        isNosePrintVerified: true,
        status: mode === "found" ? "실종 중" : "등록 완료",
      });

      if (mode === "identity") {
        setOwnerInfo({
          name: "홍길동",
          phone: "010-1234-5678",
          email: "owner@example.com",
        });
      } else {
        setMissingInfo({
          missingDate: "2024.01.15",
          missingLocation: "서울시 강남구 테헤란로",
          description: "검은색 목줄을 착용하고 있었습니다.",
          contactPhone: "010-1234-5678",
        });
      }

      setScreenState("result");
    } catch (error) {
      console.error("분석 실패:", error);
      // 에러 처리
      setScreenState("camera");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleBackToCamera = () => {
    setScreenState("camera");
    setPetInfo(null);
    setOwnerInfo(null);
    setMissingInfo(null);
  };

  const handleContactOwner = () => {
    if (mode === "found" && missingInfo) {
      // 전화 걸기 기능
      Alert.alert(
        "보호자 연락",
        `${missingInfo.contactPhone}로 전화를 걸까요?`,
        [
          { text: "취소", style: "cancel" },
          {
            text: "전화걸기",
            onPress: () => {
              // TODO: 실제 전화 걸기 기능 구현
              console.log("전화 걸기:", missingInfo.contactPhone);
            },
          },
        ]
      );
    }
  };

  const renderAnalyzing = () => {
    return (
      <View style={styles.analyzingContainer}>
        <ActivityIndicator size="large" color="#FF9D4D" />
        <Text style={styles.analyzingText}>분석중입니다</Text>
        <Text style={styles.analyzingSubtext}>
          {mode === "found"
            ? "유기견 정보를 확인하고 있습니다..."
            : "강아지 신원을 확인하고 있습니다..."}
        </Text>
      </View>
    );
  };

  const renderResult = () => {
    if (!petInfo) return null;
    if (mode === "identity" && !ownerInfo) return null;
    if (mode === "found" && !missingInfo) return null;

    return (
      <ScrollView
        style={styles.resultContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.resultContent}>
          {/* 강아지 신분증 카드 */}
          <View style={styles.petCardSection}>
            <PetCard pets={[petInfo]} showRegisterCard={false} />
          </View>

          {/* 보호자 정보 또는 실종 정보 */}
          {mode === "identity" && ownerInfo && (
            <View style={styles.ownerCard}>
              <Text style={styles.sectionTitle}>보호자 정보</Text>
              <View style={styles.ownerInfo}>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>이름</Text>
                  <Text style={styles.infoValue}>{ownerInfo.name}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>전화번호</Text>
                  <Text style={styles.infoValue}>{ownerInfo.phone}</Text>
                </View>
                {ownerInfo.email && (
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>이메일</Text>
                    <Text style={styles.infoValue}>{ownerInfo.email}</Text>
                  </View>
                )}
              </View>
            </View>
          )}

          {mode === "found" && missingInfo && (
            <View style={styles.ownerCard}>
              <Text style={styles.sectionTitle}>실종 정보</Text>
              <View style={styles.ownerInfo}>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>실종 일시</Text>
                  <Text style={styles.infoValue}>
                    {missingInfo.missingDate}
                  </Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>실종 장소</Text>
                  <Text style={styles.infoValue}>
                    {missingInfo.missingLocation}
                  </Text>
                </View>
                {missingInfo.description && (
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>특이사항</Text>
                    <Text style={styles.infoValue}>
                      {missingInfo.description}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          )}

          {/* 버튼 */}
          <View style={styles.buttonContainer}>
            {mode === "found" ? (
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={handleContactOwner}
              >
                <View style={styles.buttonContent}>
                  <Phone size={20} color="#FFFFFF" />
                  <Text style={styles.primaryButtonText}>
                    보호자와 연락하기
                  </Text>
                </View>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={handleBackToCamera}
              >
                <Text style={styles.primaryButtonText}>다시 인증하기</Text>
              </TouchableOpacity>
            )}
            {onClose && (
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={onClose}
              >
                <Text style={styles.secondaryButtonText}>닫기</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 헤더 */}
      {onClose && (
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color="#1F2937" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {mode === "found" ? "유기견 발견" : "신원 인증"}
          </Text>
          <View style={styles.placeholder} />
        </View>
      )}

      {/* 콘텐츠 */}
      {screenState === "camera" && (
        <CameraScanner
          onPhotoTaken={handlePhotoTaken}
          guideText="강아지의 코를 원 안에 맞춰주세요"
        />
      )}

      {screenState === "analyzing" && renderAnalyzing()}

      {screenState === "result" && renderResult()}
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
  analyzingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  analyzingText: {
    fontSize: 24,
    fontWeight: "600",
    color: "#1F2937",
    marginTop: 24,
    marginBottom: 8,
  },
  analyzingSubtext: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
  },
  resultContainer: {
    flex: 1,
  },
  resultContent: {
    paddingBottom: 40,
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  petCardSection: {
    marginBottom: 20,
  },
  ownerCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    marginHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  ownerInfo: {
    gap: 16,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#6B7280",
  },
  infoValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
  },
  buttonContainer: {
    gap: 12,
    marginTop: 20,
    marginHorizontal: 20,
  },
  primaryButton: {
    backgroundColor: "#FF9D4D",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButton: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryButtonText: {
    color: "#6B7280",
    fontSize: 16,
    fontWeight: "600",
  },
});
