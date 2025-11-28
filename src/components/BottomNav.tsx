import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface BottomNavProps {
  activeTab: "home" | "scan" | "my";
  onTabPress: (tab: "home" | "scan" | "my") => void;
}

export default function BottomNav({ activeTab, onTabPress }: BottomNavProps) {
  return (
    <View style={styles.container}>
      <View style={styles.navContent}>
        {/* 홈 */}
        <TouchableOpacity
          onPress={() => onTabPress("home")}
          activeOpacity={0.7}
          style={styles.navItem}
        >
          <Text style={styles.navIcon}>🏠</Text>
          <Text
            style={[
              styles.navLabel,
              activeTab === "home" && styles.navLabelActive,
            ]}
          >
            홈
          </Text>
        </TouchableOpacity>

        {/* 등록하기 */}
        <TouchableOpacity
          onPress={() => onTabPress("scan")}
          activeOpacity={0.7}
          style={styles.navItem}
        >
          <Text style={styles.navIcon}>📸</Text>
          <Text
            style={[
              styles.navLabel,
              activeTab === "scan" && styles.navLabelActive,
            ]}
          >
            등록하기
          </Text>
        </TouchableOpacity>

        {/* 마이페이지 */}
        <TouchableOpacity
          onPress={() => onTabPress("my")}
          activeOpacity={0.7}
          style={styles.navItem}
        >
          <Text style={styles.navIcon}>👤</Text>
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
  navIcon: {
    fontSize: 24,
    marginBottom: 4,
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
