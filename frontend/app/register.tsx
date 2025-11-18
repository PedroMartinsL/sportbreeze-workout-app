import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { useState } from "react";
import { apiFetch } from "@/services/api";
import { useAuthStore } from "@/store/auth";
import { useRouter } from "expo-router";
import { getPushToken } from "@/utils/getPushToken";

export default function RegisterScreen() {
  const { login } = useAuthStore();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);

  const onSubmit = async () => {
    if (!username || !email || !password) {
      return Alert.alert("Attention", "Fill in your username, email and password.");
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return Alert.alert("Attention", "Invalid email.");
    }
    if (password.length < 6) {
      return Alert.alert("Attention", "Password must be at least 6 characters long.");
    }

    try {
      setLoading(true);

      const payload = {
        username,
        email,
        password,
        active: true,
        admin: false,
      };

      const resp = await apiFetch({ path: "/auth/sing_up", method: "POST", body: payload as any});
      console.log("REGISTER OK →", resp);

      // Auto login
      await login(email, password);

      const token = useAuthStore.getState().accessToken;
      
      const expoPushToken = await getPushToken();

      if (expoPushToken && token) {
        await apiFetch({
          path: "/device",
          method: "POST",
          body: { device_token: expoPushToken },
          token: token, // ✅ aqui usamos o token atualizado
        });
      }

      // Redirect to registration
      router.replace("/(tabs)/registration");
      
      // Show success message after redirect
      setTimeout(() => {
        Alert.alert("Success!", "Account created! Now let's build your profile.");
      }, 500);

    } catch (e: any) {
      console.error(e);
      Alert.alert("Registration error", e.message ?? "Request failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, padding: 20, justifyContent: "center" }}>
      <Text style={{ fontSize: 24, fontWeight: "800", marginBottom: 8 }}>Create account</Text>
      <Text style={{ color: "#6b7280", marginBottom: 18 }}>Start your journey with Sportbreeze.</Text>

      <Text style={{ marginBottom: 6, fontWeight: "600" }}>Username</Text>
      <TextInput
        placeholder="your_username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
        style={{ backgroundColor: "white", borderWidth: 1, borderColor: "#d1d5db", borderRadius: 12, padding: 12, marginBottom: 12 }}
      />

      <Text style={{ marginBottom: 6, fontWeight: "600" }}>Email</Text>
      <TextInput
        placeholder="you@example.com"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        style={{ backgroundColor: "white", borderWidth: 1, borderColor: "#d1d5db", borderRadius: 12, padding: 12, marginBottom: 12 }}
      />

      <Text style={{ marginBottom: 6, fontWeight: "600" }}>Password</Text>
      <TextInput
        placeholder="••••••••"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={{ backgroundColor: "white", borderWidth: 1, borderColor: "#d1d5db", borderRadius: 12, padding: 12, marginBottom: 16 }}
      />

      <TouchableOpacity onPress={onSubmit} disabled={loading} style={{ backgroundColor: "#111827", padding: 14, borderRadius: 12 }}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={{ color: "white", fontWeight: "700", textAlign: "center" }}>Register</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}
