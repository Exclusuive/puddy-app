import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface ActionItem {
  id: string;
  icon: string;
  label: string;
  onPress: () => void;
}

interface ActionGridProps {
  actions: ActionItem[];
}

export default function ActionGrid({ actions }: ActionGridProps) {
  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {actions.map((action) => (
          <TouchableOpacity
            key={action.id}
            onPress={action.onPress}
            activeOpacity={0.7}
            style={styles.actionButton}
          >
            <Text style={styles.icon}>{action.icon}</Text>
            <Text style={styles.label}>{action.label}</Text>
          </TouchableOpacity>
        ))}
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
    fontSize: 28,
    marginBottom: 6,
  },
  label: {
    color: "#111827",
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
  },
});
