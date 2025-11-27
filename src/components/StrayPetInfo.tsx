import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";

interface StrayPet {
  id: string;
  name: string;
  breed: string;
  location: string;
  foundDate: string;
  image?: string;
}

interface StrayPetInfoProps {
  onPetPress?: (pet: StrayPet) => void;
}

export default function StrayPetInfo({ onPetPress }: StrayPetInfoProps) {
  // 샘플 유기견 데이터
  const strayPets: StrayPet[] = [
    {
      id: "STRAY-001",
      name: "뽀삐",
      breed: "믹스견",
      location: "서울시 강남구",
      foundDate: "2024.01.15",
    },
    {
      id: "STRAY-002",
      name: "초코",
      breed: "골든 리트리버",
      location: "서울시 마포구",
      foundDate: "2024.01.20",
    },
    {
      id: "STRAY-003",
      name: "루이",
      breed: "비글",
      location: "서울시 송파구",
      foundDate: "2024.01.25",
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>유기견 정보</Text>
        <TouchableOpacity>
          <Text style={styles.moreText}>더보기</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {strayPets.map((pet) => (
          <TouchableOpacity
            key={pet.id}
            onPress={() => onPetPress?.(pet)}
            activeOpacity={0.8}
            style={styles.petCard}
          >
            <View style={styles.imageContainer}>
              {pet.image ? (
                <Image source={{ uri: pet.image }} style={styles.petImage} />
              ) : (
                <View style={styles.placeholderImage}>
                  <Text style={styles.placeholderEmoji}>🐕</Text>
                </View>
              )}
            </View>
            <View style={styles.petInfo}>
              <Text style={styles.petName}>{pet.name}</Text>
              <Text style={styles.petBreed}>{pet.breed}</Text>
              <View style={styles.locationRow}>
                <Text style={styles.locationIcon}>📍</Text>
                <Text style={styles.locationText}>{pet.location}</Text>
              </View>
              <Text style={styles.foundDate}>발견일: {pet.foundDate}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
  },
  moreText: {
    fontSize: 14,
    color: "#FF9D4D",
    fontWeight: "600",
  },
  scrollContent: {
    paddingRight: 16,
  },
  petCard: {
    width: 160,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginRight: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#F3F4F6",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imageContainer: {
    width: "100%",
    height: 120,
    backgroundColor: "#F9FAFB",
  },
  petImage: {
    width: "100%",
    height: "100%",
  },
  placeholderImage: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F3F4F6",
  },
  placeholderEmoji: {
    fontSize: 48,
  },
  petInfo: {
    padding: 12,
  },
  petName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 4,
  },
  petBreed: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  locationIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  locationText: {
    fontSize: 12,
    color: "#6B7280",
    flex: 1,
  },
  foundDate: {
    fontSize: 11,
    color: "#9CA3AF",
    marginTop: 4,
  },
});

