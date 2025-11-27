import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  StyleSheet,
} from "react-native";
import { useState } from "react";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CONTAINER_PADDING = 16;
const CARD_WIDTH = SCREEN_WIDTH - CONTAINER_PADDING * 2;

interface Pet {
  id: string;
  name: string;
  birthDate: string;
  gender: "수컷" | "암컷";
  profileImage?: string;
  isNosePrintVerified: boolean;
  status: "등록 완료" | "실종 중";
}

interface PetCardProps {
  pets: Pet[];
  onCardPress?: (pet: Pet) => void;
}

export default function PetCard({ pets, onCardPress }: PetCardProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleScroll = (event: any) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / CARD_WIDTH);
    setCurrentIndex(index);
  };

  // 생년월일에서 나이 계산 함수
  const calculateAge = (birthDate: string): string => {
    try {
      const [year, month, day] = birthDate.split(".").map(Number);
      const birth = new Date(year, month - 1, day);
      const today = new Date();

      let age = today.getFullYear() - birth.getFullYear();
      const monthDiff = today.getMonth() - birth.getMonth();

      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birth.getDate())
      ) {
        age--;
      }

      return `${age}살`;
    } catch {
      return "";
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {pets.map((pet) => (
          <TouchableOpacity
            key={pet.id}
            onPress={() => onCardPress?.(pet)}
            activeOpacity={0.9}
            style={[styles.cardWrapper, { width: CARD_WIDTH }]}
          >
            <View style={styles.card}>
              {/* 신분증 헤더 */}
              <View style={styles.cardHeader}>
                <Text style={styles.headerText}>
                  Puddy PASS - 반려견 신분증
                </Text>
              </View>

              <View style={styles.cardBody}>
                {/* 왼쪽: 프로필 이미지 */}
                <View style={styles.profileContainer}>
                  <View style={styles.profileImageWrapper}>
                    <Image
                      source={require("../../assets/example.png")}
                      style={styles.profileImage}
                      resizeMode="cover"
                    />
                  </View>
                  {/* 상태 배지 - 이미지 아래 */}
                  <View style={styles.statusContainer}>
                    {pet.status === "실종 중" ? (
                      <View style={styles.statusBadgeDanger}>
                        <Text style={styles.statusBadgeTextDanger}>
                          🔴 실종 중
                        </Text>
                      </View>
                    ) : (
                      <View style={styles.statusBadge}>
                        <Text style={styles.statusBadgeText}>✓ 등록 완료</Text>
                      </View>
                    )}
                  </View>
                </View>

                {/* 오른쪽: 반려견 정보 */}
                <View style={styles.infoContainer}>
                  <View style={styles.infoSection}>
                    <Text style={styles.infoLabel}>ID</Text>
                    <Text style={styles.infoValue}>{pet.id}</Text>
                  </View>

                  <View style={styles.divider} />

                  {/* 이름과 성별을 같은 라인에 */}
                  <View style={styles.infoSection}>
                    <Text style={styles.infoLabel}>이름 / 성별</Text>
                    <View style={styles.nameGenderRow}>
                      <Text style={styles.infoValue}>{pet.name}</Text>
                      <Text style={styles.genderSeparator}> | </Text>
                      <Text style={styles.infoValueSmall}>{pet.gender}</Text>
                    </View>
                  </View>

                  <View style={styles.divider} />

                  <View style={styles.infoSection}>
                    <Text style={styles.infoLabel}>생년월일</Text>
                    <View style={styles.birthDateRow}>
                      <Text style={styles.infoValueSmall}>{pet.birthDate}</Text>
                      <Text style={styles.ageText}>
                        {" "}
                        ({calculateAge(pet.birthDate)})
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* 캐러셀 인디케이터 */}
      {pets.length > 1 && (
        <View style={styles.indicatorContainer}>
          {pets.map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicator,
                index === currentIndex && styles.indicatorActive,
                index > 0 && styles.indicatorMargin,
              ]}
            />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: CONTAINER_PADDING,
    marginBottom: 12,
  },
  scrollView: {
    marginBottom: 12,
  },
  scrollContent: {
    paddingRight: CONTAINER_PADDING,
  },
  cardWrapper: {
    width: CARD_WIDTH,
  },
  card: {
    backgroundColor: "#FFFEF5",
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#F5E6D3",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  cardHeader: {
    backgroundColor: "#FFFEF5",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F5E6D3",
  },
  headerText: {
    color: "#8B6914",
    fontSize: 12,
    textAlign: "center",
    fontWeight: "600",
    letterSpacing: 0.8,
  },
  cardBody: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 14,
    alignItems: "flex-start",
    backgroundColor: "#FFFEF5",
  },
  profileContainer: {
    marginRight: 16,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  profileImageWrapper: {
    width: 90,
    height: 110,
    borderRadius: 8,
    backgroundColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#D1D5DB",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileImage: {
    width: "100%",
    height: "100%",
  },
  missingBadge: {
    marginTop: 8,
    backgroundColor: "#EF4444",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  missingText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "bold",
  },
  infoContainer: {
    flex: 1,
  },
  infoSection: {
    marginBottom: 10,
  },
  infoLabel: {
    color: "#6B7280",
    fontSize: 12,
    fontWeight: "500",
    marginBottom: 4,
    letterSpacing: 0.3,
  },
  infoValue: {
    color: "#111827",
    fontSize: 17,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  infoValueSmall: {
    color: "#111827",
    fontSize: 15,
    fontWeight: "600",
  },
  nameGenderRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  genderSeparator: {
    color: "#9CA3AF",
    fontSize: 16,
    fontWeight: "300",
  },
  birthDateRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  ageText: {
    color: "#6B7280",
    fontSize: 15,
    fontWeight: "500",
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginBottom: 10,
  },
  statusContainer: {
    marginTop: 12,
    alignItems: "center",
  },
  statusBadge: {
    backgroundColor: "#D1FAE5",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: "center",
  },
  statusBadgeDanger: {
    backgroundColor: "#FEE2E2",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: "center",
  },
  statusBadgeText: {
    color: "#065F46",
    fontSize: 13,
    fontWeight: "600",
  },
  statusBadgeTextDanger: {
    color: "#991B1B",
    fontSize: 13,
    fontWeight: "600",
  },
  indicatorContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  indicator: {
    height: 8,
    width: 8,
    borderRadius: 4,
    backgroundColor: "#D1D5DB",
  },
  indicatorActive: {
    backgroundColor: "#FF9D4D",
    width: 24,
  },
  indicatorMargin: {
    marginLeft: 8,
  },
});
