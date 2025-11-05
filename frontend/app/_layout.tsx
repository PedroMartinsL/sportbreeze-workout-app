import { Stack } from "expo-router";
import "../global.css";
import { SafeAreaProvider  } from "react-native-safe-area-context";
import * as Notifications from 'expo-notifications';

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
    <SafeAreaProvider >
      <Stack />
    </SafeAreaProvider >
);
}
    
