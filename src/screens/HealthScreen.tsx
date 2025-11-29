import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Pin, Camera, LifeBuoy } from "lucide-react-native";

export default function HealthScreen() {
  return (
    <SafeAreaView style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>건강 관리</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* 건강 관리 섹션 */}
        <View style={styles.healthSection}>
          <Text style={styles.healthSectionTitle}>
            CoCo의 건강, 우리가 함께 지켜요.
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
                <Pin
                  size={16}
                  color="#FF9D4D"
                  style={styles.healthCardButtonIcon}
                />
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
                <Camera
                  size={16}
                  color="#FF9D4D"
                  style={styles.healthCardButtonIcon}
                />
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
                <LifeBuoy
                  size={16}
                  color="#FF9D4D"
                  style={styles.healthCardButtonIcon}
                />
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1F2937",
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingBottom: 90,
  },
  healthSection: {
    paddingHorizontal: 16,
    marginTop: 20,
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

