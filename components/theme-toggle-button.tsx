import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "@/contexts/ThemeContext";
import { Colors } from "@/constants/theme";

export function ThemeToggleButton() {
  const { colorScheme, toggleTheme } = useTheme();
  const colors = Colors[colorScheme];

  return (
    <TouchableOpacity
      onPress={toggleTheme}
      style={[styles.button, { backgroundColor: colors.tint }]}
      activeOpacity={0.7}
    >
      <MaterialCommunityIcons
        name={
          colorScheme === "light"
            ? "moon-waning-crescent"
            : "white-balance-sunny"
        }
        size={24}
        color={colors.background}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 45,
    height: 45,
    borderRadius: 23,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
});
