import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { useState } from "react";
import { apiFetch } from "@/api"; // mantém como está

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    if (!email || !password) {
      return Alert.alert("Atenção", "Preencha e-mail e senha.");
    }

    try {
      setLoading(true);

      // ✅ Forçamos o tipo com “as any” para não alterar o api.js
      const resp = await apiFetch("/auth/login", "POST", { email, password } as any);

      const token = resp?.access_token || resp?.token;
      if (!token) throw new Error("Token não retornado pelo servidor.");

      console.log("LOGIN OK → token:", token);
      Alert.alert("Sucesso", "Login realizado!");
    } catch (e: any) {
      console.error(e);
      Alert.alert("Erro no login", e.message ?? "Falha na requisição");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, padding: 20, justifyContent: "center" }}>
      <Text style={{ fontSize: 24, fontWeight: "800", marginBottom: 8 }}>Entrar</Text>
      <Text style={{ color: "#6b7280", marginBottom: 18 }}>Acesse sua conta para continuar.</Text>

      <Text style={{ marginBottom: 6, fontWeight: "600" }}>E-mail</Text>
      <TextInput
        placeholder="voce@exemplo.com"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        style={{ backgroundColor: "white", borderWidth: 1, borderColor: "#d1d5db", borderRadius: 12, padding: 12, marginBottom: 12 }}
      />

      <Text style={{ marginBottom: 6, fontWeight: "600" }}>Senha</Text>
      <TextInput
        placeholder="••••••••"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={{ backgroundColor: "white", borderWidth: 1, borderColor: "#d1d5db", borderRadius: 12, padding: 12, marginBottom: 16 }}
      />

      <TouchableOpacity onPress={onSubmit} disabled={loading} style={{ backgroundColor: "#111827", padding: 14, borderRadius: 12 }}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={{ color: "white", fontWeight: "700", textAlign: "center" }}>Entrar</Text>}
      </TouchableOpacity>
    </View>
  );
}
