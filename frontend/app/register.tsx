import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { useState } from "react";
import { apiFetch } from "@/api"; // mantém como está

export default function RegisterScreen() {
  const [username, setUsername] = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);

  const onSubmit = async () => {
    if (!username || !email || !password) {
      return Alert.alert("Atenção", "Preencha username, e-mail e senha.");
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return Alert.alert("Atenção", "E-mail inválido.");
    }
    if (password.length < 6) {
      return Alert.alert("Atenção", "Senha deve ter pelo menos 6 caracteres.");
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

      const resp = await apiFetch("/auth/sing_up", "POST", payload as any);
      console.log("CADASTRO OK →", resp);

      Alert.alert("Sucesso", "Conta criada! Agora faça login.");

    } catch (e: any) {
      console.error(e);
      Alert.alert("Erro no cadastro", e.message ?? "Falha na requisição");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, padding: 20, justifyContent: "center" }}>
      <Text style={{ fontSize: 24, fontWeight: "800", marginBottom: 8 }}>Criar conta</Text>
      <Text style={{ color: "#6b7280", marginBottom: 18 }}>Comece sua jornada com o Sportsbreeze.</Text>

      <Text style={{ marginBottom: 6, fontWeight: "600" }}>Username</Text>
      <TextInput
        placeholder="seu_usuario"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
        style={{ backgroundColor: "white", borderWidth: 1, borderColor: "#d1d5db", borderRadius: 12, padding: 12, marginBottom: 12 }}
      />

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
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={{ color: "white", fontWeight: "700", textAlign: "center" }}>Cadastrar</Text>}
      </TouchableOpacity>
    </View>
  );
}
