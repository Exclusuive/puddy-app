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
import { Plus } from "lucide-react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CONTAINER_PADDING = 16;
const CARD_WIDTH = SCREEN_WIDTH - CONTAINER_PADDING * 2;

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

interface PetCardProps {
  pets: Pet[];
  onCardPress?: (pet: Pet) => void;
  onRegisterPress?: () => void;
}

export default function PetCard({
  pets,
  onCardPress,
  onRegisterPress,
}: PetCardProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleScroll = (event: any) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / CARD_WIDTH);
    setCurrentIndex(index);
  };

  const totalCards = pets.length + 1; // 등록하기 카드 포함

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
              {/* 비문 ID - 카드 전체 맨 위 */}
              <View style={styles.registrationNumberHeader}>
                <Text style={styles.registrationNumber}>{pet.id}</Text>
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
                  {/* 상태 배지 - 사진 밑 */}
                  <View style={styles.statusContainer}>
                    {pet.status === "실종 중" ? (
                      <View style={styles.statusBadgeDanger}>
                        <Text style={styles.statusBadgeTextDanger}>
                          실종 중
                        </Text>
                      </View>
                    ) : (
                      <View style={styles.statusBadge}>
                        <Text style={styles.statusBadgeText}>등록 완료</Text>
                      </View>
                    )}
                  </View>
                </View>

                {/* 오른쪽: 반려견 정보 */}
                <View style={styles.infoContainer}>
                  {/* 동물등록번호 */}
                  <View style={[styles.infoRow, styles.firstInfoRow]}>
                    <Text style={styles.infoLabel}>동물등록번호</Text>
                    <Text style={styles.infoValue}>159229529</Text>
                  </View>

                  <View style={styles.divider} />

                  {/* 이름 / 성별 */}
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>이름</Text>
                    <Text style={styles.nameValue}>{pet.name}</Text>
                    <Text style={styles.separator}> / </Text>
                    <Text style={styles.infoValue}>{pet.gender}</Text>
                  </View>

                  <View style={styles.divider} />

                  {/* 생년월일 (나이 포함) */}
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>생년월일</Text>
                    <Text style={styles.infoValue}>
                      {pet.birthDate} ({calculateAge(pet.birthDate)})
                    </Text>
                  </View>

                  <View style={styles.divider} />

                  {/* 품종 */}
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>품종</Text>
                    <Text style={styles.infoValue}>{pet.breed || "-"}</Text>
                  </View>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}

        {/* 등록하기 카드 */}
        <TouchableOpacity
          onPress={() => onRegisterPress?.()}
          activeOpacity={0.9}
          style={[styles.cardWrapper, { width: CARD_WIDTH }]}
        >
          <View style={styles.card}>
            <View style={styles.registerCardBody}>
              <View style={styles.registerContent}>
                <View style={styles.registerIconWrapper}>
                  <Plus size={48} color="#FF9D4D" />
                </View>
                <Text style={styles.registerText}>강아지 등록하기</Text>
                <Text style={styles.registerSubtext}>
                  새로운 반려견을 등록해주세요
                </Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </ScrollView>

      {/* 캐러셀 인디케이터 */}
      {totalCards > 1 && (
        <View style={styles.indicatorContainer}>
          {Array.from({ length: totalCards }).map((_, index) => (
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
    backgroundColor: "#F9FDFE",
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#D0E8F0",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  headerText: {
    color: "#111111",
    fontSize: 14,
    fontWeight: "700",

    textAlign: "center",
    letterSpacing: 0.5,
  },
  registrationNumberHeader: {
    backgroundColor: "#F9FDFE",
    paddingTop: 12,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  registrationNumber: {
    color: "#111111",
    fontSize: 18,
    fontWeight: "900",
    textAlign: "center",
    letterSpacing: 0.5,
  },
  cardBody: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: "flex-start",
    backgroundColor: "#F9FDFE",
    minHeight: 160,
    height: 180,
  },
  profileContainer: {
    marginRight: 20,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  statusContainer: {
    marginTop: 8,
    alignItems: "center",
  },
  profileImageWrapper: {
    width: 100,
    height: 120,
    borderRadius: 4,
    backgroundColor: "#E3F2FD",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#BBDEFB",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
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
    justifyContent: "flex-start",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    flexWrap: "wrap",
  },
  firstInfoRow: {
    paddingTop: 8,
  },
  infoLabel: {
    color: "#505050",
    fontSize: 12,
    fontWeight: "600",
    minWidth: 65,
    marginRight: 8,
  },
  infoValue: {
    color: "#111111",
    fontSize: 13,
    fontWeight: "600",
    flex: 1,
  },
  nameValue: {
    color: "#111111",
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  separator: {
    color: "#64B5F6",
    fontSize: 13,
    marginHorizontal: 4,
    fontWeight: "400",
  },
  divider: {
    height: 1,
    backgroundColor: "#BBDEFB",
    marginVertical: 4,
  },
  statusBadge: {
    backgroundColor: "#E8F5E9",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#4CAF50",
  },
  statusBadgeDanger: {
    backgroundColor: "#FFEBEE",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#F44336",
  },
  statusBadgeText: {
    color: "#2E7D32",
    fontSize: 11,
    fontWeight: "600",
  },
  statusBadgeTextDanger: {
    color: "#C62828",
    fontSize: 11,
    fontWeight: "600",
  },
  registerCardBody: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F9FDFE",
    minHeight: 160,
    height: 215,
  },
  registerContent: {
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  registerIconWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#FFF6EC",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#FF9D4D",
    borderStyle: "dashed",
  },
  registerText: {
    color: "#111111",
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  registerSubtext: {
    color: "#505050",
    fontSize: 12,
    fontWeight: "500",
    textAlign: "center",
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
