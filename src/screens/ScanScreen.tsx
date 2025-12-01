import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useState } from "react";
import { X, Phone } from "lucide-react-native";
import CameraScanner from "../components/CameraScanner";
import PetCard from "../components/PetCard";

type ScanMode = "found" | "identity";
type ScreenState = "camera" | "analyzing" | "result";

interface ScanScreenProps {
  onClose?: () => void;
}

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
  description: string;
  contactPhone: string;
}

export default function ScanScreen({ onClose }: ScanScreenProps) {
  const [scanMode, setScanMode] = useState<ScanMode>("found");
  const [screenState, setScreenState] = useState<ScreenState>("camera");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [petInfo, setPetInfo] = useState<PetInfo | null>(null);
  const [ownerInfo, setOwnerInfo] = useState<OwnerInfo | null>(null);
  const [missingInfo, setMissingInfo] = useState<MissingInfo | null>(null);

  const tabs = [
    { id: "found" as ScanMode, label: "유기견 발견" },
    { id: "identity" as ScanMode, label: "신원 인증" },
  ];

  const handlePhotoTaken = async (uri: string) => {
    setScreenState("analyzing");
    setIsAnalyzing(true);

    try {
      // TODO: 실제 API 호출로 이미지 분석 처리
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // 분석 완료 후 결과 데이터 설정 (임시 데이터)
      setPetInfo({
        id: "000-000-0000001",
        name: "Coco",
        birthDate: "2021.05.15",
        gender: "암컷",
        breed: "골든 리트리버",
        isNosePrintVerified: true,
        status: scanMode === "found" ? "실종 중" : "등록 완료",
      });

      if (scanMode === "identity") {
        setOwnerInfo({
          name: "홍길동",
          phone: "010-1234-5678",
          email: "owner@example.com",
        });
      } else if (scanMode === "found") {
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
      Alert.alert("오류", "분석에 실패했습니다. 다시 시도해주세요.");
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
    if (scanMode === "found" && missingInfo) {
      Alert.alert("연락하기", `보호자 연락처: ${missingInfo.contactPhone}`);
    }
  };

  const getGuideText = () => {
    switch (scanMode) {
      case "found":
        return "발견한 강아지의 코를 원 안에 맞춰주세요";
      case "identity":
        return "인증할 강아지의 코를 원 안에 맞춰주세요";
      default:
        return "강아지의 코를 원 안에 맞춰주세요";
    }
  };

  const renderAnalyzing = () => {
    return (
      <View style={styles.analyzingContainer}>
        <ActivityIndicator size="large" color="#FF9D4D" />
        <Text style={styles.analyzingText}>코 사진을 분석 중입니다...</Text>
      </View>
    );
  };

  const renderResult = () => {
    if (!petInfo) return null;

    return (
      <ScrollView style={styles.resultContainer}>
        <View style={styles.resultContent}>
          {/* 반려견 정보 카드 */}
          <PetCard pets={[petInfo]} showRegisterCard={false} />

          {/* 보호자 정보 (신원 인증일 때) */}
          {scanMode === "identity" && ownerInfo && (
            <View style={styles.infoCard}>
              <Text style={styles.infoCardTitle}>보호자 정보</Text>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>이름</Text>
                <Text style={styles.infoValue}>{ownerInfo.name}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>연락처</Text>
                <Text style={styles.infoValue}>{ownerInfo.phone}</Text>
              </View>
            </View>
          )}

          {/* 실종 정보 (유기견 발견일 때) */}
          {scanMode === "found" && missingInfo && (
            <View style={styles.infoCard}>
              <Text style={styles.infoCardTitle}>실종 정보</Text>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>실종일</Text>
                <Text style={styles.infoValue}>{missingInfo.missingDate}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>실종 장소</Text>
                <Text style={styles.infoValue}>
                  {missingInfo.missingLocation}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>특이사항</Text>
                <Text style={styles.infoValue}>{missingInfo.description}</Text>
              </View>
            </View>
          )}

          {/* 버튼 */}
          <View style={styles.buttonContainer}>
            {scanMode === "found" ? (
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
                <Text style={styles.primaryButtonText}>다시 촬영하기</Text>
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
      <View style={styles.header}>
        {onClose && (
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color="#1F2937" />
          </TouchableOpacity>
        )}
        <Text style={styles.headerTitle}>코 사진 촬영</Text>
        {onClose && <View style={styles.placeholder} />}
      </View>

      {/* 콘텐츠 */}
      {screenState === "camera" && (
        <CameraScanner
          onPhotoTaken={handlePhotoTaken}
          guideText={getGuideText()}
          topOverlay={
            <View style={styles.tabContainer}>
              {tabs.map((tab, index) => (
                <View key={tab.id} style={styles.tabWrapper}>
                  <TouchableOpacity
                    style={[
                      styles.tab,
                      scanMode === tab.id && styles.tabActive,
                    ]}
                    onPress={() => {
                      setScanMode(tab.id);
                      setScreenState("camera");
                      setPetInfo(null);
                      setOwnerInfo(null);
                      setMissingInfo(null);
                    }}
                  >
                    <Text
                      style={[
                        styles.tabText,
                        scanMode === tab.id && styles.tabTextActive,
                      ]}
                    >
                      {tab.label}
                    </Text>
                  </TouchableOpacity>
                  {index < tabs.length - 1 && (
                    <View style={styles.tabSeparator} />
                  )}
                </View>
              ))}
            </View>
          }
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
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    paddingHorizontal: 16,
  },
  tabWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  tabSeparator: {
    width: 1,
    height: 20,
    backgroundColor: "#E5E7EB",
  },
  tabActive: {
    borderBottomColor: "#FF9D4D",
  },
  tabText: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
  tabTextActive: {
    color: "#FF9D4D",
    fontWeight: "600",
  },
  analyzingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF6EC",
  },
  analyzingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#6B7280",
    fontWeight: "500",
  },
  resultContainer: {
    flex: 1,
    backgroundColor: "#FFF6EC",
  },
  resultContent: {},
  infoCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginHorizontal: 16,
    padding: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  infoCardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  infoLabel: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
  infoValue: {
    fontSize: 14,
    color: "#111827",
    fontWeight: "600",
  },
  buttonContainer: {
    marginTop: 24,
    marginHorizontal: 16,
    gap: 12,
  },
  primaryButton: {
    backgroundColor: "#FF9D4D",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButton: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  secondaryButtonText: {
    color: "#6B7280",
    fontSize: 16,
    fontWeight: "600",
  },
});
