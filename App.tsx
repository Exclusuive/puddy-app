import { StatusBar } from "expo-status-bar";
import { useState, useEffect } from "react";
import { View, StyleSheet, ActivityIndicator, Modal } from "react-native";
import HomeScreen from "./src/screens/HomeScreen";
import ScanScreen from "./src/screens/ScanScreen";
import MyPageScreen from "./src/screens/MyPageScreen";
import LoginScreen from "./src/screens/LoginScreen";
import PetDetailScreen from "./src/screens/PetDetailScreen";
import BottomNav from "./src/components/BottomNav";
import { useAuthStore } from "./src/store/authStore";

interface Pet {
  id: string;
  name: string;
  birthDate: string;
  gender: "수컷" | "암컷";
  profileImage?: string;
  isNosePrintVerified: boolean;
  status: "등록 완료" | "실종 중";
}

export default function App() {
  const [activeTab, setActiveTab] = useState<"home" | "scan" | "my">("home");
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const { isAuthenticated, isLoading, checkAuth } = useAuthStore();

  useEffect(() => {
    // 앱 시작 시 자동 로그인 확인
    checkAuth();
  }, [checkAuth]);

  const renderScreen = () => {
    switch (activeTab) {
      case "home":
        return <HomeScreen onPetPress={setSelectedPet} />;
      case "scan":
        return <ScanScreen />;
      case "my":
        return <MyPageScreen />;
      default:
        return <HomeScreen onPetPress={setSelectedPet} />;
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
