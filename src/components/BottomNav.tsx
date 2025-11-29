import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Home, Heart, User } from "lucide-react-native";

interface BottomNavProps {
  activeTab: "health" | "home" | "my";
  onTabPress: (tab: "health" | "home" | "my") => void;
}

export default function BottomNav({ activeTab, onTabPress }: BottomNavProps) {
  return (
    <View style={styles.container}>
      <View style={styles.navContent}>
        {/* 건강관리 */}
        <TouchableOpacity
          onPress={() => onTabPress("health")}
          activeOpacity={0.7}
          style={styles.navItem}
        >
          <Heart
            size={24}
            color={activeTab === "health" ? "#FF9D4D" : "#6B7280"}
          />
          <Text
            style={[
              styles.navLabel,
              activeTab === "health" && styles.navLabelActive,
            ]}
          >
            건강관리
          </Text>
        </TouchableOpacity>

        {/* 홈 */}
        <TouchableOpacity
          onPress={() => onTabPress("home")}
          activeOpacity={0.7}
          style={styles.navItem}
        >
          <Home
            size={24}
            color={activeTab === "home" ? "#FF9D4D" : "#6B7280"}
          />
          <Text
            style={[
              styles.navLabel,
              activeTab === "home" && styles.navLabelActive,
            ]}
          >
            홈
          </Text>
        </TouchableOpacity>

        {/* 마이페이지 */}
        <TouchableOpacity
          onPress={() => onTabPress("my")}
          activeOpacity={0.7}
          style={styles.navItem}
        >
          <User
            size={24}
            color={activeTab === "my" ? "#FF9D4D" : "#6B7280"}
          />
          <Text
            style={[
              styles.navLabel,
              activeTab === "my" && styles.navLabelActive,
            ]}
          >
            MY
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    paddingHorizontal: 16,
    paddingVertical: 12,
    zIndex: 100, // 기본 zIndex 설정
  },
  navContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    gap: 40,
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
  },
  navLabel: {
    fontSize: 12,
    color: "#6B7280",
  },
  navLabelActive: {
    color: "#FF9D4D",
    fontWeight: "600",
  },
  cameraButtonWrapper: {
    alignItems: "center",
  },
  cameraButton: {
    width: 64,
    height: 64,
    backgroundColor: "#FF9D4D",
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  cameraIcon: {
    fontSize: 28,
  },
});
