import { StatusBar } from "expo-status-bar";
import { useState, useEffect } from "react";
import { View, StyleSheet, ActivityIndicator, Modal } from "react-native";
import HomeScreen from "./src/screens/HomeScreen";
import HealthScreen from "./src/screens/HealthScreen";
import MyPageScreen from "./src/screens/MyPageScreen";
import LoginScreen from "./src/screens/LoginScreen";
import PetDetailScreen from "./src/screens/PetDetailScreen";
import MissingReportScreen from "./src/screens/MissingReportScreen";
import ScanScreen from "./src/screens/ScanScreen";
import BottomNav from "./src/components/BottomNav";
import { useAuthStore } from "./src/store/authStore";

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

export default function App() {
  const [activeTab, setActiveTab] = useState<"home" | "scan" | "health" | "my">(
    "home"
  );
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [showMissingReport, setShowMissingReport] = useState(false);
  const { isAuthenticated, isLoading, checkAuth } = useAuthStore();

  // 샘플 반려견 데이터 (실제로는 HomeScreen에서 가져와야 함)
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

  useEffect(() => {
    // 앱 시작 시 자동 로그인 확인
    checkAuth();
  }, [checkAuth]);

  const renderScreen = () => {
    switch (activeTab) {
      case "home":
        return (
          <HomeScreen
            onPetPress={setSelectedPet}
            onMissingReportPress={() => setShowMissingReport(true)}
          />
        );
      case "scan":
        return <ScanScreen onClose={() => setActiveTab("home")} />;
      case "health":
        return <HealthScreen />;
      case "my":
        return <MyPageScreen />;
      default:
        return (
          <HomeScreen
            onPetPress={setSelectedPet}
            onMissingReportPress={() => setShowMissingReport(true)}
          />
        );
    }
  };

  // 로딩 중일 때
  if (isLoading) {
    return (
      <>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF9D4D" />
        </View>
        <StatusBar style="dark" />
      </>
    );
  }

  // 로그인되지 않았을 때
  if (!isAuthenticated) {
    return (
      <>
        <LoginScreen />
        <StatusBar style="dark" />
      </>
    );
  }

  // 로그인된 상태일 때 메인 화면
  return (
    <>
      <View style={styles.container}>
        {renderScreen()}
        <BottomNav activeTab={activeTab} onTabPress={setActiveTab} />
      </View>
      <Modal
        visible={selectedPet !== null}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setSelectedPet(null)}
      >
        {selectedPet && (
          <PetDetailScreen
            pet={selectedPet}
            onClose={() => setSelectedPet(null)}
          />
        )}
      </Modal>
      <Modal
        visible={showMissingReport}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowMissingReport(false)}
      >
        <MissingReportScreen
          pets={pets}
          onClose={() => setShowMissingReport(false)}
          onSuccess={() => {
            // 실종 신고 성공 시 처리 (예: 상태 업데이트 등)
          }}
        />
      </Modal>
      <StatusBar style="dark" />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF6EC",
  },
});
