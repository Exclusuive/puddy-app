import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import {
  Syringe,
  Hospital,
  FileText,
  AlertCircle,
  Phone,
  ChevronRight,
} from "lucide-react-native";

const CONTAINER_PADDING = 16;

interface ActionItem {
  id: string;
  iconName: "vaccination" | "medical" | "insurance" | "missing" | "emergency";
  label: string;
  subtitle?: string;
  mainValue?: string;
  mainValueColor?: string;
  badge?: {
    text: string;
    color: string;
  };
  details?: Array<{
    label: string;
    value: string;
  }>;
  onPress: () => void;
}

interface ActionGridProps {
  actions: ActionItem[];
}

const iconMap = {
  vaccination: Syringe,
  medical: Hospital,
  insurance: FileText,
  missing: AlertCircle,
  emergency: Phone,
};

export default function ActionGrid({ actions }: ActionGridProps) {
  // 2x2 그리드를 위해 행으로 나누기
  const row1 = actions.slice(0, 2);
  const row2 = actions.slice(2, 4);

  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {/* 첫 번째 행 */}
        <View style={styles.row}>
          {row1.map((action) => {
            const IconComponent = iconMap[action.iconName];
            return (
              <TouchableOpacity
                key={action.id}
                onPress={action.onPress}
                activeOpacity={0.7}
                style={styles.actionButton}
              >
                {/* 헤더: 제목과 화살표 */}
                <View style={styles.header}>
                  <Text style={styles.label}>{action.label}</Text>
                  <ChevronRight size={16} color="#9CA3AF" />
                </View>

                {/* 서브타이틀 (details가 있을 때만 위에 표시) */}
                {action.subtitle && action.details && (
                  <Text style={styles.subtitle}>{action.subtitle}</Text>
                )}

                {/* 메인 값 */}
                {action.mainValue && (
                  <View style={styles.mainValueContainer}>
                    <View style={styles.mainValueWrapper}>
                      <Text
                        style={[
                          styles.mainValue,
                          { color: action.mainValueColor || "#FF9D4D" },
                        ]}
                      >
                        {action.mainValue}
                      </Text>
                      {action.subtitle && !action.details && (
                        <Text style={styles.mainValueSubtitle}>
                          {action.subtitle}
                        </Text>
                      )}
                    </View>
                    {action.badge && (
                      <View
                        style={[
                          styles.badge,
                          { backgroundColor: action.badge.color },
                        ]}
                      >
                        <Text style={styles.badgeText}>
                          {action.badge.text}
                        </Text>
                      </View>
                    )}
                  </View>
                )}

                {/* 상세 정보 */}
                {action.details && action.details.length > 0 && (
                  <View style={styles.detailsContainer}>
                    {action.details.map((detail, index) => (
                      <View key={index} style={styles.detailRow}>
                        <Text style={styles.detailLabel}>{detail.label}</Text>
                        <Text style={styles.detailValue}>{detail.value}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
        {/* 두 번째 행 */}
        <View style={styles.row}>
          {row2.map((action) => {
            const IconComponent = iconMap[action.iconName];
            return (
              <TouchableOpacity
                key={action.id}
                onPress={action.onPress}
                activeOpacity={0.7}
                style={styles.actionButton}
              >
                {/* 헤더: 제목과 화살표 */}
                <View style={styles.header}>
                  <Text style={styles.label}>{action.label}</Text>
                  <ChevronRight size={16} color="#9CA3AF" />
                </View>

                {/* 메인 값 */}
                {action.mainValue && (
                  <View style={styles.mainValueContainer}>
                    <View style={styles.mainValueWrapper}>
                      <Text
                        style={[
                          styles.mainValue,
                          { color: action.mainValueColor || "#FF9D4D" },
                        ]}
                      >
                        {action.mainValue}
                      </Text>
                      {action.subtitle && !action.details && (
                        <Text style={styles.mainValueSubtitle}>
                          {action.subtitle}
                        </Text>
                      )}
                    </View>
                    {action.badge && (
                      <View
                        style={[
                          styles.badge,
                          { backgroundColor: action.badge.color },
                        ]}
                      >
                        <Text style={styles.badgeText}>
                          {action.badge.text}
                        </Text>
                      </View>
                    )}
                  </View>
                )}

                {/* 서브타이틀 (details가 있을 때만 위에 표시) */}
                {action.subtitle && action.details && (
                  <Text style={styles.subtitle}>{action.subtitle}</Text>
                )}

                {/* 상세 정보 */}
                {action.details && action.details.length > 0 && (
                  <View style={styles.detailsContainer}>
                    {action.details.map((detail, index) => (
                      <View key={index} style={styles.detailRow}>
                        <Text style={styles.detailLabel}>{detail.label}</Text>
                        <Text style={styles.detailValue}>{detail.value}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: CONTAINER_PADDING,
    flex: 1,
  },
  grid: {
    gap: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    alignItems: "stretch",
  },
  actionButton: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
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
    position: "relative",
    flexDirection: "column",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  label: {
    color: "#111827",
    fontSize: 16,
    fontWeight: "700",
  },
  subtitle: {
    color: "#6B7280",
    fontSize: 12,
    marginTop: 8,
    marginBottom: 8,
  },
  mainValueContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 8,
    flexWrap: "wrap",
  },
  mainValueWrapper: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 4,
  },
  mainValue: {
    fontSize: 28,
    fontWeight: "700",
    color: "#FF9D4D",
  },
  mainValueSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "400",
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: "#FF9D4D",
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "600",
  },
  detailsContainer: {
    gap: 6,
    marginTop: "auto",
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  detailLabel: {
    color: "#6B7280",
    fontSize: 12,
    fontWeight: "400",
  },
  detailValue: {
    color: "#111827",
    fontSize: 12,
    fontWeight: "600",
  },
});
