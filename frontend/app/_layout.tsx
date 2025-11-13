import { Stack } from "expo-router";
import "../global.css";
import { SafeAreaProvider } from "react-native-safe-area-context";
import * as Notifications from "expo-notifications";
import { StatusBar } from "expo-status-bar";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export default function Layout() {
  return (
    <SafeAreaProvider>
      {/* Status bar preta com ícones claros */}
      <StatusBar 
        style="dark"
        backgroundColor="#000" // fundo preto
        translucent={false}  // garante que a cor preencha a barra
      />

      <Stack screenOptions={{ headerShown: false }} />
    </SafeAreaProvider>
  );
}
