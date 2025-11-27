import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Image,
} from "react-native";
import { useState } from "react";
import PetCard from "../components/PetCard";
import ActionGrid from "../components/ActionGrid";
import InfoCard from "../components/InfoCard";
import BottomNav from "../components/BottomNav";

interface Pet {
  id: string;
  name: string;
  birthDate: string;
  gender: "수컷" | "암컷";
  profileImage?: string;
  isNosePrintVerified: boolean;
  status: "등록 완료" | "실종 중";
}

export default function HomeScreen() {
  const [activeTab, setActiveTab] = useState<"home" | "my">("home");

  // 샘플 반려견 데이터
  const [pets] = useState<Pet[]>([
    {
      id: "PUDDY-2024-001",
      name: "Coco",
      birthDate: "2021.05.15",
      gender: "암컷",
      isNosePrintVerified: true,
      status: "등록 완료",
    },
    {
      id: "PUDDY-2024-002",
      name: "Max",
      birthDate: "2020.03.20",
      gender: "수컷",
      isNosePrintVerified: true,
      status: "등록 완료",
    },
  ]);

  const handlePetCardPress = (pet: Pet) => {
    Alert.alert("반려견 상세", `${pet.name}의 상세 정보를 확인합니다.`);
  };

  const actions = [
    {
      id: "vaccination",
      icon: "💉",
      label: "예방접종",
      onPress: () => Alert.alert("예방접종", "예방접종 일정을 확인합니다."),
    },
    {
      id: "medical",
      icon: "🏥",
      label: "진료기록",
      onPress: () => Alert.alert("진료기록", "병원 이력을 조회합니다."),
    },
    {
      id: "insurance",
      icon: "📄",
      label: "보험청구",
      onPress: () =>
        Alert.alert("보험청구", "보험 청구 및 신원검증을 진행합니다."),
    },
    {
      id: "missing",
      icon: "🚨",
      label: "실종신고",
      onPress: () => Alert.alert("실종신고", "실종 신고를 진행합니다."),
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
      </View>

      {/* 메인 콘텐츠 */}
      <View style={styles.content}>
        {/* 반려견 신분증 카드 */}
        <View style={styles.cardContainer}>
          <PetCard pets={pets} onCardPress={handlePetCardPress} />
        </View>

        {/* 메인 기능 버튼 영역 */}
        <ActionGrid actions={actions} />

        {/* 유기견 발견 카드 */}
        <InfoCard
          title="유기견을 발견하셨나요?"
          subtitle="지금 바로 주인을 찾아주세요."
          onPress={() => Alert.alert("유기견 발견", "주인 찾기를 시작합니다.")}
          backgroundColor="#FFFEF5"
        />

        {/* 신원 인증 카드 */}
        <InfoCard
          title="강아지 신원 인증하기."
          subtitle="동물병원 / 보험사 전용"
          onPress={() => Alert.alert("신원 인증", "신원 인증을 시작합니다.")}
          backgroundColor="#FFFFFF"
        />
      </View>

      {/* 하단 네비게이션 바 */}
      <BottomNav activeTab={activeTab} onTabPress={setActiveTab} />
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
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 100,
    height: 32,
  },
  content: {
    flex: 1,
    paddingBottom: 70,
  },
  cardContainer: {
    paddingTop: 12,
  },
});
