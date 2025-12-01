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
      name: "콩순이",
      birthDate: "2021.05.15",
      gender: "암컷",
      breed: "골든 리트리버",
      isNosePrintVerified: true,
      status: "등록 완료",
    },
    {
      id: "000-000-0000002",
      name: "콩순이",
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
      subtitle: "다음 접종까지",
      mainValue: "D-37",
      mainValueColor: "#FF9D4D",
      badge: {
        text: "양호",
        color: "#FF9D4D",
      },
      details: [
        {
          label: "최근 접종",
          value: "1달 전",
        },
      ],
      onPress: () => setShowVaccination(true),
    },
    {
      id: "medical",
      iconName: "medical" as const,
      label: "진료기록",
      subtitle: "검사지연",
      mainValue: "심장사상충",
      mainValueColor: "#FF9D4D",
      details: [
        {
          label: "최근 진료일",
          value: "2025.11.20",
        },
        {
          label: "총 진료 내역",
          value: "N건",
        },
      ],
      onPress: () => setShowMedicalRecord(true),
    },
    {
      id: "insurance",
      iconName: "insurance" as const,
      label: "보험정보",
      mainValue: "25",
      mainValueColor: "#FF9D4D",
      subtitle: "만원/월",
      onPress: () => setShowInsurance(true),
    },
    {
      id: "missing",
      iconName: "missing" as const,
      label: "실종신고",
      mainValue: "찾는중",
      mainValueColor: "#FF9D4D",
      badge: {
        text: "등록완료",
        color: "#FF9D4D",
      },
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
        {/* 인사 문구 */}
        <View style={styles.greetingContainer}>
          <Text style={styles.greetingText}>안녕하세요,</Text>
          <Text style={styles.greetingName}>상준님!</Text>
        </View>

        {/* 반려견 신분증 카드 */}
        <View style={styles.cardContainer}>
          <PetCard
            pets={pets}
            onCardPress={handlePetCardPress}
            onRegisterPress={handleRegisterPress}
          />
        </View>

        {/* 건강관리 섹션 헤더 */}
        <View style={styles.healthSectionHeader}>
          <Text style={styles.healthSectionTitle}>건강관리</Text>
          <Text style={styles.healthSectionDate}>2025년 12월 1일 월요일</Text>
        </View>

        {/* 메인 기능 버튼 영역 */}
        <ActionGrid actions={actions} />
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
    flexGrow: 1,
  },
  greetingContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  greetingText: {
    fontSize: 24,
    color: "#111111",
    fontWeight: "700",
  },
  greetingName: {
    fontSize: 24,
    color: "#FF6842",
    fontWeight: "700",
    marginTop: 4,
  },
  cardContainer: {},
  healthSectionHeader: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 12,
  },
  healthSectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111111",
    marginBottom: 8,
  },
  healthSectionDate: {
    fontSize: 16,
    color: "#505050",
    fontWeight: "300",
  },
});
