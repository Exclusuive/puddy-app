import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Dimensions,
} from "react-native";
import { Camera } from "lucide-react-native";

const { width } = Dimensions.get("window");

interface CameraFloatingButtonProps {
  onPress: () => void;
}

export default function CameraFloatingButton({
  onPress,
}: CameraFloatingButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[
        styles.button,
        {
          left: width / 2 - 40,
        },
      ]}
    >
      <Camera size={32} color="#FFFFFF" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    position: "absolute",
    bottom: 35, // BottomNav 높이의 반정도 (약 70px 높이 기준)
    width: 80,
    height: 80,
    backgroundColor: "#FF9D4D",
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 4,
    borderColor: "#FFFFFF",
    shadowColor: "#FF9D4D",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10, // BottomNav보다 위에 표시되도록 높은 elevation
    zIndex: 1000, // BottomNav 위에 표시되도록 zIndex 설정
  },
});
