import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from "react-native";
import { X } from "lucide-react-native";
import CameraScanner from "../components/CameraScanner";

interface ScanScreenProps {
  title?: string;
  onClose?: () => void;
}

export default function ScanScreen({
  title = "코 사진 촬영",
  onClose,
}: ScanScreenProps) {
  const handlePhotoTaken = async (uri: string) => {
    try {
      // TODO: 실제 API 호출로 이미지 업로드 및 등록 처리
      // 여기서는 시뮬레이션
      await new Promise((resolve) => setTimeout(resolve, 3000));

      Alert.alert("등록 완료", "코 사진이 성공적으로 등록되었습니다.", [
        {
          text: "확인",
          onPress: () => {
            onClose?.();
          },
        },
      ]);
    } catch (error) {
      Alert.alert("오류", "등록에 실패했습니다. 다시 시도해주세요.");
      console.error(error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 헤더 */}
      {onClose && (
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color="#1F2937" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{title}</Text>
          <View style={styles.placeholder} />
        </View>
      )}

      <CameraScanner
        onPhotoTaken={handlePhotoTaken}
        guideText="강아지의 코를 원 안에 맞춰주세요"
      />
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
});
