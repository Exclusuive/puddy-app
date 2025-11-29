import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface InfoCardProps {
  title: string;
  subtitle?: string;
  description?: string;
  onPress?: () => void;
  backgroundColor?: string;
}

export default function InfoCard({
  title,
  subtitle,
  description,
  onPress,
  backgroundColor = "#FFFFFF",
}: InfoCardProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[styles.card, { backgroundColor }]}
    >
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
          {title}
        </Text>
        {subtitle && (
          <Text style={styles.subtitle} numberOfLines={2} ellipsizeMode="tail">
            {subtitle}
          </Text>
        )}
        {description && (
          <Text
            style={styles.description}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {description}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 0,
    marginHorizontal: 0,
    minHeight: 100,
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
  content: {
    gap: 6,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 0,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6B7280",
    marginTop: 0,
    lineHeight: 16,
  },
  description: {
    fontSize: 12,
    color: "#9CA3AF",
    lineHeight: 16,
  },
});
