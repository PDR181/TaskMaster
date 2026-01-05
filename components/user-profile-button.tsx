import { useRouter } from "expo-router";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { useSession } from "@/contexts/session";

export function UserProfileButton() {
  const router = useRouter();
  const { session } = useSession();

  const handlePress = () => {
    router.push("/perfil");
  };

  if (!session) return null;

  return (
    <TouchableOpacity onPress={handlePress} style={styles.button}>
      <Text style={styles.emoji}>👤</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  emoji: {
    fontSize: 24,
  },
});

