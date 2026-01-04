import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useSession } from '../contexts/session';

export default function Login() {
  const { signIn } = useSession();
  const [username, setUsername] = useState('');

  async function handleLogin() {
    const name = username.trim();
    if (!name) return;

    await signIn(name);
    router.replace('/(tabs)');
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>TaskMaster</Text>
      <Text style={styles.subtitle}>Entre para continuar</Text>

      <Text style={styles.label}>Usuário</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite seu nome"
        placeholderTextColor="#6b7280"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />

      <TouchableOpacity
        style={[styles.button, !username.trim() && styles.buttonDisabled]}
        onPress={handleLogin}
        disabled={!username.trim()}
      >
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020617',
    padding: 24,
    justifyContent: 'center',
  },
  title: { fontSize: 32, fontWeight: 'bold', color: '#e5e7eb', marginBottom: 6 },
  subtitle: { fontSize: 16, color: '#9ca3af', marginBottom: 24 },
  label: { color: '#e5e7eb', marginBottom: 8, fontSize: 14, fontWeight: '600' },
  input: {
    backgroundColor: '#0f172a',
    color: '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#10b981',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonDisabled: { backgroundColor: '#4b5563' },
  buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
});
