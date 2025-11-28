import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Image,
  ScrollView,
} from "react-native";
import { useState } from "react";
import PetCard from "../components/PetCard";
import ActionGrid from "../components/ActionGrid";
import InfoCard from "../components/InfoCard";

interface Pet {
  id: string;
  name: string;
  birthDate: string;
  gender: "수컷" | "암컷";
  profileImage?: string;
  isNosePrintVerified: boolean;
  status: "등록 완료" | "실종 중";
}

interface HomeScreenProps {
  onPetPress?: (pet: Pet) => void;
}

export default function HomeScreen({ onPetPress }: HomeScreenProps) {
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
    onPetPress?.(pet);
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
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* 반려견 신분증 카드 */}
        <View style={styles.cardContainer}>
          <PetCard pets={pets} onCardPress={handlePetCardPress} />
        </View>

        {/* 메인 기능 버튼 영역 */}
        <ActionGrid actions={actions} />

        {/* InfoCard 2열 레이아웃 */}
        <View style={styles.infoCardContainer}>
          <View style={styles.infoCardWrapper}>
            <InfoCard
              title="유기견을 발견하셨나요?"
              subtitle="지금 바로 주인을 찾아주세요."
              onPress={() =>
                Alert.alert("유기견 발견", "주인 찾기를 시작합니다.")
              }
              backgroundColor="#FFFEF5"
            />
          </View>
          <View style={styles.infoCardWrapper}>
            <InfoCard
              title="강아지 신원 인증하기."
              subtitle="동물병원 / 보험사 전용"
              onPress={() =>
                Alert.alert("신원 인증", "신원 인증을 시작합니다.")
              }
              backgroundColor="#FFFFFF"
            />
          </View>
        </View>

        {/* 건강 관리 섹션 */}
        <View style={styles.healthSection}>
          <Text style={styles.healthSectionTitle}>
            🤍 CoCo의 건강, 우리가 함께 지켜요.
          </Text>

          {/* 예방접종 알림 카드 */}
          <TouchableOpacity
            style={styles.healthCard}
            onPress={() =>
              Alert.alert("알림 등록", "예방접종 알림을 등록합니다.")
            }
            activeOpacity={0.7}
          >
            <View style={styles.healthCardContent}>
              <Text style={styles.healthCardText}>
                다음 예방접종까지 D-37일입니다.
              </Text>
              <View style={styles.healthCardButton}>
                <Text style={styles.healthCardButtonIcon}>📌</Text>
                <Text style={styles.healthCardButtonText}>알림 등록하기</Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* 건강 기록 카드 */}
          <TouchableOpacity
            style={styles.healthCard}
            onPress={() =>
              Alert.alert("기록 추가", "건강/사진 기록을 추가합니다.")
            }
            activeOpacity={0.7}
          >
            <View style={styles.healthCardContent}>
              <Text style={styles.healthCardText}>
                오늘도 CoCo의 하루를 기록해볼까요?
              </Text>
              <View style={styles.healthCardButton}>
                <Text style={styles.healthCardButtonIcon}>📷</Text>
                <Text style={styles.healthCardButtonText}>
                  건강/사진 기록 추가
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* 긴급 연락처 카드 */}
          <TouchableOpacity
            style={styles.healthCard}
            onPress={() =>
              Alert.alert("연락처 등록", "긴급 연락처를 등록합니다.")
            }
            activeOpacity={0.7}
          >
            <View style={styles.healthCardContent}>
              <Text style={styles.healthCardText}>
                긴급 상황 대비를 위한 연락처를 추가하면{"\n"}
                유기·실종 예방 확률이 3배 높아집니다.
              </Text>
              <View style={styles.healthCardButton}>
                <Text style={styles.healthCardButtonIcon}>🛟</Text>
                <Text style={styles.healthCardButtonText}>
                  긴급 연락처 등록
                </Text>
              </View>
            </View>
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
    fontSize: 16,
    marginRight: 6,
  },
  healthCardButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FF9D4D",
  },
});
