import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import {
  Syringe,
  Hospital,
  FileText,
  AlertCircle,
  Phone,
} from "lucide-react-native";

interface ActionItem {
  id: string;
  iconName: "vaccination" | "medical" | "insurance" | "missing" | "emergency";
  label: string;
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
  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {actions.map((action) => {
          const IconComponent = iconMap[action.iconName];
          return (
            <TouchableOpacity
              key={action.id}
              onPress={action.onPress}
              activeOpacity={0.7}
              style={styles.actionButton}
            >
              {IconComponent && (
                <IconComponent size={28} color="#FF9D4D" style={styles.icon} />
              )}
              <Text style={styles.label}>{action.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  actionButton: {
    width: "23%",
    marginBottom: 8,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#F3F4F6",
    minHeight: 70,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  icon: {
    marginBottom: 6,
  },
  label: {
    color: "#111827",
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
  },
});
