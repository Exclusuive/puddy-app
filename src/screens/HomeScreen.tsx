import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Image,
  ScrollView,
  Modal,
} from "react-native";
import { useState } from "react";
import { Bell, Phone } from "lucide-react-native";
import PetCard from "../components/PetCard";
import ActionGrid from "../components/ActionGrid";
import InfoCard from "../components/InfoCard";
import VaccinationScreen from "./VaccinationScreen";
import MedicalRecordScreen from "./MedicalRecordScreen";
import InsuranceScreen from "./InsuranceScreen";
import EmergencyContactScreen from "./EmergencyContactScreen";

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

interface HomeScreenProps {
  onPetPress?: (pet: Pet) => void;
  onMissingReportPress?: () => void;
  onScanPress?: (title: string) => void;
}

export default function HomeScreen({
  onPetPress,
  onMissingReportPress,
  onScanPress,
}: HomeScreenProps) {
  // 샘플 반려견 데이터
  const [pets] = useState<Pet[]>([
    {
      id: "000-000-0000001",
      name: "Coco",
      birthDate: "2021.05.15",
      gender: "암컷",
      breed: "골든 리트리버",
      isNosePrintVerified: true,
      status: "등록 완료",
    },
    {
      id: "000-000-0000002",
      name: "Max",
      birthDate: "2020.03.20",
      gender: "수컷",
      breed: "래브라도 리트리버",
      isNosePrintVerified: true,
      status: "등록 완료",
    },
  ]);

  const [showVaccination, setShowVaccination] = useState(false);
  const [showMedicalRecord, setShowMedicalRecord] = useState(false);
  const [showInsurance, setShowInsurance] = useState(false);
  const [showEmergencyContact, setShowEmergencyContact] = useState(false);

  const handlePetCardPress = (pet: Pet) => {
    onPetPress?.(pet);
  };

  const handleRegisterPress = () => {
    onScanPress?.("강아지 등록");
  };

  const actions = [
    {
      id: "vaccination",
      iconName: "vaccination" as const,
      label: "예방접종",
      onPress: () => setShowVaccination(true),
    },
    {
      id: "medical",
      iconName: "medical" as const,
      label: "진료기록",
      onPress: () => setShowMedicalRecord(true),
    },
    {
      id: "insurance",
      iconName: "insurance" as const,
      label: "보험정보",
      onPress: () => setShowInsurance(true),
    },
    {
      id: "missing",
      iconName: "missing" as const,
      label: "실종신고",
      onPress: () => onMissingReportPress?.(),
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <Image
          source={require("../../assets/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <TouchableOpacity
          style={styles.notificationButton}
          onPress={() => Alert.alert("알림", "알림을 확인합니다.")}
          activeOpacity={0.7}
        >
          <Bell size={24} color="#1A1A1A" />
        </TouchableOpacity>
      </View>

      {/* 메인 콘텐츠 */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* 반려견 신분증 카드 */}
        <View style={styles.cardContainer}>
          <PetCard
            pets={pets}
            onCardPress={handlePetCardPress}
            onRegisterPress={handleRegisterPress}
          />
        </View>

        {/* 메인 기능 버튼 영역 */}
        <ActionGrid actions={actions} />

        {/* InfoCard 2열 레이아웃 */}
        <View style={styles.infoCardContainer}>
          <View style={styles.infoCardWrapper}>
            <InfoCard
              title="유기견 발견"
              subtitle="유기견을 발견하셨나요? 지금 바로 주인을 찾아주세요."
              onPress={() => onScanPress?.("유기견 발견")}
              backgroundColor="#FFFEF5"
            />
          </View>
          <View style={styles.infoCardWrapper}>
            <InfoCard
              title="신원 인증하기"
              subtitle="반려견 신원 인증이 필요할 때 사용하세요."
              onPress={() => onScanPress?.("신원 인증")}
              backgroundColor="#FFFFFF"
            />
          </View>
        </View>

        {/* 긴급 연락처 등록 버튼 */}
        <View style={styles.emergencyContactContainer}>
          <TouchableOpacity
            style={styles.emergencyContactButton}
            onPress={() => setShowEmergencyContact(true)}
            activeOpacity={0.7}
          >
            <Phone size={24} color="#FFFFFF" style={styles.emergencyContactIcon} />
            <Text style={styles.emergencyContactText}>긴급 연락처 등록하기</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* 예방접종 모달 */}
      <Modal
        visible={showVaccination}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowVaccination(false)}
      >
        <VaccinationScreen onBack={() => setShowVaccination(false)} />
      </Modal>

      {/* 진료기록 모달 */}
      <Modal
        visible={showMedicalRecord}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowMedicalRecord(false)}
      >
        <MedicalRecordScreen onBack={() => setShowMedicalRecord(false)} />
      </Modal>

      {/* 보험정보 모달 */}
      <Modal
        visible={showInsurance}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowInsurance(false)}
      >
        <InsuranceScreen onBack={() => setShowInsurance(false)} />
      </Modal>

      {/* 긴급 연락처 모달 */}
      <Modal
        visible={showEmergencyContact}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowEmergencyContact(false)}
      >
        <EmergencyContactScreen
          onBack={() => setShowEmergencyContact(false)}
          onSuccess={() => {
            // 등록 성공 시 처리
          }}
        />
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF6EC",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  logo: {
    width: 100,
    height: 32,
  },
  notificationButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingBottom: 90,
  },
  cardContainer: {
    paddingTop: 12,
  },
  infoCardContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 10,
    alignItems: "stretch",
  },
  infoCardWrapper: {
    flex: 1,
    alignSelf: "stretch",
  },
  emergencyContactContainer: {
    paddingHorizontal: 16,
    marginTop: 12,
    marginBottom: 10,
  },
  emergencyContactButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FF9D4D",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  emergencyContactIcon: {
    marginRight: 8,
  },
  emergencyContactText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  healthSection: {
    paddingHorizontal: 16,
    marginTop: 8,
  },
  healthSectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  healthCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
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
  healthCardContent: {
    gap: 12,
  },
  healthCardText: {
    fontSize: 14,
    color: "#374151",
    lineHeight: 20,
  },
  healthCardButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF6EC",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  healthCardButtonIcon: {
    marginRight: 6,
  },
  healthCardButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FF9D4D",
  },
});
