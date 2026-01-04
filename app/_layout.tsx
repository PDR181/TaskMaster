import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider as NavigationThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { TaskProvider } from "../contexts/TaskContext";
import { ThemeProvider, useTheme } from "../contexts/ThemeContext";
import { ThemeToggleButton } from "../components/theme-toggle-button";
import { SessionProvider } from "../contexts/session";

import { Colors } from "@/constants/theme";

export const unstable_settings = {
  initialRouteName: "index",
};

function RootLayoutContent() {
  const { colorScheme } = useTheme();

  return (
    <NavigationThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />

        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

        <Stack.Screen
          name="modal"
          options={{
            presentation: "modal",
            title: "Modal",
            headerRight: () => <ThemeToggleButton />,
            headerStyle: { backgroundColor: Colors[colorScheme ?? "light"].background },
            headerTintColor: Colors[colorScheme ?? "light"].text,
          }}
        />

        <Stack.Screen
          name="nova-tarefa"
          options={{
            title: "Nova Tarefa",
            headerRight: () => <ThemeToggleButton />,
            headerStyle: { backgroundColor: Colors[colorScheme ?? "light"].background },
            headerTintColor: Colors[colorScheme ?? "light"].text,
          }}
        />

        <Stack.Screen
          name="editar-tarefa"
          options={{
            title: "Editar Tarefa",
            headerRight: () => <ThemeToggleButton />,
            headerStyle: { backgroundColor: Colors[colorScheme ?? "light"].background },
            headerTintColor: Colors[colorScheme ?? "light"].text,
          }}
        />
      </Stack>

      <StatusBar style="auto" />
    </NavigationThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <SessionProvider>
      <ThemeProvider>
        <TaskProvider>
          <RootLayoutContent />
        </TaskProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
