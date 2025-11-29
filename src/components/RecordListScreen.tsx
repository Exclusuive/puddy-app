import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { ChevronRight, Plus } from "lucide-react-native";

export interface RecordItem {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  [key: string]: any; // 추가 필드들을 위한 인덱스 시그니처
}

interface RecordListScreenProps {
  title: string;
  records: RecordItem[];
  onRecordPress: (record: RecordItem) => void;
  onBack: () => void;
  onAddPress?: () => void;
  renderItem?: (record: RecordItem) => React.ReactNode;
}

export default function RecordListScreen({
  title,
  records,
  onRecordPress,
  onBack,
  onAddPress,
  renderItem,
}: RecordListScreenProps) {
  const defaultRenderItem = (record: RecordItem) => (
    <TouchableOpacity
      key={record.id}
      style={styles.recordCard}
      onPress={() => onRecordPress(record)}
      activeOpacity={0.7}
    >
      <View style={styles.recordContent}>
        <Text style={styles.recordTitle}>{record.title}</Text>
        <Text style={styles.recordSubtitle}>{record.subtitle}</Text>
        <Text style={styles.recordDate}>{record.date}</Text>
      </View>
      <ChevronRight size={20} color="#9CA3AF" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{title}</Text>
        <View style={styles.placeholder} />
      </View>

      {/* 리스트 */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {records.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>기록이 없습니다</Text>
          </View>
        ) : (
          records.map((record) =>
            renderItem ? renderItem(record) : defaultRenderItem(record)
          )
        )}

        {/* 추가하기 버튼 카드 */}
        {onAddPress && (
          <TouchableOpacity
            style={styles.addCard}
            onPress={onAddPress}
            activeOpacity={0.7}
          >
            <View style={styles.addCardContent}>
              <Plus size={24} color="#FF9D4D" />
              <Text style={styles.addCardText}>기록 추가하기</Text>
            </View>
          </TouchableOpacity>
        )}
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
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  backButtonText: {
    fontSize: 24,
    color: "#1F2937",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 90,
  },
  recordCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
  recordContent: {
    flex: 1,
  },
  recordTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 4,
  },
  recordSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 4,
  },
  recordDate: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: "#9CA3AF",
  },
  addCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    borderWidth: 2,
    borderColor: "#FF9D4D",
    borderStyle: "dashed",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  addCardContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  addCardText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FF9D4D",
  },
});
