import { View, Text, TouchableOpacity, StyleSheet, ScrollView, useWindowDimensions } from "react-native";
import { router } from "expo-router";
import { useSession } from "@/contexts/session";
import { useTheme } from "@/contexts/ThemeContext";
import { Colors, CardColors } from "@/constants/theme";

export default function Perfil() {
  const { session, signOut } = useSession();
  const { colorScheme } = useTheme();
  const { width } = useWindowDimensions();
  const maxWidth = Math.min(width * 0.95, 600);

  const handleLogout = async () => {
    await signOut();
    router.replace("/login");
  };

  return (
    <ScrollView
      style={[
        styles.container,
        {
          backgroundColor: Colors[colorScheme ?? "light"].background,
        },
      ]}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={[styles.contentBox, { maxWidth }]}>
        {/* Profile Card */}
        <View
          style={[
            styles.profileCard,
            {
              backgroundColor: CardColors[colorScheme ?? "light"],
            },
          ]}
        >
          <View
            style={[
              styles.avatar,
              {
                backgroundColor: Colors[colorScheme ?? "light"].tint,
              },
            ]}
          >
            <Text style={styles.avatarEmoji}>👤</Text>
          </View>

          <Text
            style={[
              styles.userName,
              {
                color: Colors[colorScheme ?? "light"].text,
              },
            ]}
          >
            {session}
          </Text>

          <Text
            style={[
              styles.userStatus,
              {
                color: Colors[colorScheme ?? "light"].icon,
              },
            ]}
          >
            ✅ Conectado
          </Text>
        </View>

        {/* Information Section */}
        <View style={styles.section}>
          <Text
            style={[
              styles.sectionTitle,
              {
                color: Colors[colorScheme ?? "light"].text,
              },
            ]}
          >
            Informações da Conta
          </Text>

          <View
            style={[
              styles.infoItem,
              {
                backgroundColor: CardColors[colorScheme ?? "light"],
              },
            ]}
          >
            <Text
              style={[
                styles.infoLabel,
                {
                  color: Colors[colorScheme ?? "light"].icon,
                },
              ]}
            >
              Nome de Usuário
            </Text>
            <Text
              style={[
                styles.infoValue,
                {
                  color: Colors[colorScheme ?? "light"].text,
                },
              ]}
            >
              {session}
            </Text>
          </View>

          <View
            style={[
              styles.infoItem,
              {
                backgroundColor: CardColors[colorScheme ?? "light"],
              },
            ]}
          >
            <Text
              style={[
                styles.infoLabel,
                {
                  color: Colors[colorScheme ?? "light"].icon,
                },
              ]}
            >
              Status
            </Text>
            <Text
              style={[
                styles.infoValue,
                {
                  color: "#10b981",
                },
              ]}
            >
              Ativo
            </Text>
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={[
            styles.logoutButton,
            {
              backgroundColor: "#ef4444",
            },
          ]}
          onPress={handleLogout}
        >
          <Text style={styles.logoutButtonText}>Sair</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    minHeight: "100%",
  },
  contentBox: {
    width: "100%",
  },
  profileCard: {
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  avatarEmoji: {
    fontSize: 40,
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  userStatus: {
    fontSize: 13,
    textAlign: "center",
  },
  section: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 8,
  },
  infoItem: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: "500",
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "600",
  },
  logoutButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  logoutButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
});
