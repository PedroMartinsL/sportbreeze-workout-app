// src/utils/getPushToken.ts
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import * as Device from "expo-device";

export async function getPushToken(): Promise<string | null> {
  if (!Device.isDevice) return null;

  try {
    const projectId =
      Constants?.expoConfig?.extra?.eas?.projectId ||
      Constants?.expoConfig?.extra?.projectId ||
      (Constants as any)?.easConfig?.projectId; // fallback opcional

    if (!projectId) {
      console.warn("⚠️ Project ID do Expo não encontrado.");
      return null;
    }

    const { data: pushToken } = await Notifications.getExpoPushTokenAsync({
      projectId,
    });

    return pushToken;
  } catch (error) {
    console.error("Erro ao obter Expo Push Token:", error);
    return null;
  }
}
