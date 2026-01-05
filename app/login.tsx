import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, useWindowDimensions } from 'react-native';
import { router } from 'expo-router';
import { useSession } from '../contexts/session';
import { useTheme } from '../contexts/ThemeContext';
import { Colors } from '../constants/theme';

export default function Login() {
  const { signIn } = useSession();
  const [username, setUsername] = useState('');
  const { colorScheme } = useTheme();
  const { width } = useWindowDimensions();
  const maxWidth = Math.min(width * 0.95, 600);

  async function handleLogin() {
    const name = username.trim();
    if (!name) return;

    await signIn(name);
    router.replace('/(tabs)');
  }

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: Colors[colorScheme ?? "light"].background,
        },
      ]}
    >
      <View style={[styles.contentBox, { maxWidth }]}>
        <Text
          style={[
            styles.title,
            {
              color: Colors[colorScheme ?? "light"].text,
            },
          ]}
        >
          TaskMaster
        </Text>
        <Text
          style={[
            styles.subtitle,
            {
              color: Colors[colorScheme ?? "light"].icon,
            },
          ]}
        >
          Entre para continuar
        </Text>

        <Text
          style={[
            styles.label,
            {
              color: Colors[colorScheme ?? "light"].text,
            },
          ]}
        >
          Usuário
        </Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: Colors[colorScheme ?? "light"].background,
              color: Colors[colorScheme ?? "light"].text,
              borderColor: Colors[colorScheme ?? "light"].icon,
            },
          ]}
          placeholder="Digite seu nome"
          placeholderTextColor={Colors[colorScheme ?? "light"].icon}
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />

        <TouchableOpacity
          style={[
            styles.button,
            !username.trim() && styles.buttonDisabled,
          ]}
          onPress={handleLogin}
          disabled={!username.trim()}
        >
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  contentBox: {
    width: "100%",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 24,
  },
  label: {
    marginBottom: 8,
    fontSize: 14,
    fontWeight: "600",
  },
  input: {
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
    marginBottom: 16,
  },
  button: {
    backgroundColor: "#10b981",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonDisabled: {
    backgroundColor: "#4b5563",
  },
  buttonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
});
