import React, { useEffect, useRef, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Linking } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Location from "expo-location";

type Coords = { lat: number; lon: number; acc?: number; speed?: number; ts?: number };

export default function GPSScreen() {
  const [coords, setCoords] = useState<Coords | null>(null);
  const [address, setAddress] = useState<string>("");
  const [statusMsg, setStatusMsg] = useState<string>("Parado");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [isWatching, setIsWatching] = useState(false);
  const watchRef = useRef<Location.LocationSubscription | null>(null);

  // ----- helpers
  function fmt(n?: number, digits = 6) {
    if (n === undefined || n === null || isNaN(n)) return "—";
    return n.toFixed(digits);
  }
  function fmtTime(ts?: number) {
    if (!ts) return "—";
    const d = new Date(ts);
    return `${d.toLocaleTimeString()}`;
  }

  async function ensurePerms() {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setErrorMsg("Permissão de localização negada.");
      return false;
    }
    setErrorMsg("");
    return true;
  }

  async function reverse(lat: number, lon: number) {
    try {
      const res = await Location.reverseGeocodeAsync({ latitude: lat, longitude: lon });
      if (res?.[0]) {
        const p = res[0];
        setAddress(
          [p.name, p.street, p.subregion, p.city ?? p.region, p.country]
            .filter(Boolean)
            .join(", ")
        );
      }
    } catch (e) {
      // silencioso
    }
  }

  // ----- ações
  async function getOnce() {
    if (!(await ensurePerms())) return;
    setStatusMsg("Capturando...");
    const pos = await Location.getCurrentPositionAsync({
      accuracy: Location.LocationAccuracy.Balanced,
    });
    const { latitude, longitude, accuracy, speed } = pos.coords;
    const payload: Coords = { lat: latitude, lon: longitude, acc: accuracy ?? undefined, speed: speed ?? undefined, ts: Date.now() };
    setCoords(payload);
    console.log("GPS (once) →", latitude, longitude, "acc:", accuracy, "speed:", speed);
    setStatusMsg("Parado");
    reverse(latitude, longitude);
  }

  async function startWatch() {
    if (isWatching) return;
    if (!(await ensurePerms())) return;
    setIsWatching(true);
    setStatusMsg("Acompanhando…");

    watchRef.current = await Location.watchPositionAsync(
      {
        accuracy: Location.LocationAccuracy.Balanced,
        timeInterval: 3000,
        distanceInterval: 5,
      },
      (loc) => {
        const { latitude, longitude, accuracy, speed } = loc.coords;
        const payload: Coords = { lat: latitude, lon: longitude, acc: accuracy ?? undefined, speed: speed ?? undefined, ts: Date.now() };
        setCoords(payload);
        console.log("GPS (watch) →", latitude, longitude);
        reverse(latitude, longitude);
      }
    );
  }

  function stopWatch() {
    watchRef.current?.remove();
    watchRef.current = null;
    setIsWatching(false);
    setStatusMsg("Parado");
    console.log("GPS Watch parado.");
  }

  function openInMaps() {
    if (!coords) return;
    const url = `https://www.google.com/maps?q=${coords.lat},${coords.lon}`;
    Linking.openURL(url);
  }

  useEffect(() => {
    return () => stopWatch(); // cleanup
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
        {/* Header card */}
        <View
          style={{
            backgroundColor: "#ecfdf5",
            borderColor: "#86efac",
            borderWidth: 1,
            borderRadius: 20,
            padding: 20,
            shadowColor: "#000",
            shadowOpacity: 0.05,
            shadowOffset: { width: 0, height: 4 },
            shadowRadius: 8,
          }}
        >
          <Text style={{ fontSize: 22, fontWeight: "800", color: "#064e3b", textAlign: "center", marginBottom: 8 }}>
            GPS Tracking
          </Text>

          <Text style={{ textAlign: "center", color: "#475569", marginBottom: 16 }}>
            Capture sua localização atual ou acompanhe em tempo real.
          </Text>

          {/* Status */}
          <View style={{ alignSelf: "center", backgroundColor: isWatching ? "#dcfce7" : "#f1f5f9", borderRadius: 999, paddingHorizontal: 12, paddingVertical: 6, marginBottom: 16 }}>
            <Text style={{ color: "#0f172a", fontWeight: "700" }}>
              Status: {statusMsg}{coords?.ts ? ` · ${fmtTime(coords.ts)}` : ""}
            </Text>
          </View>

          {/* Dados */}
          <View style={{ backgroundColor: "white", borderRadius: 16, padding: 16, borderWidth: 1, borderColor: "#e5e7eb", marginBottom: 12 }}>
            <Row label="Latitude" value={fmt(coords?.lat)} />
            <Row label="Longitude" value={fmt(coords?.lon)} />
            <Row label="Acurácia (m)" value={fmt(coords?.acc, 1)} />
            <Row label="Velocidade (m/s)" value={fmt(coords?.speed, 2)} />
            {address ? <Row label="Endereço" value={address} multiline /> : null}
          </View>

          {/* Ações */}
          <View style={{ flexDirection: "row", justifyContent: "center", gap: 10, marginTop: 6, flexWrap: "wrap" }}>
            <Btn title="Pegar uma vez" onPress={getOnce} primary />
            {!isWatching ? (
              <Btn title="Iniciar Watch" onPress={startWatch} primary />
            ) : (
              <Btn title="Parar Watch" onPress={stopWatch} />
            )}
            <Btn title="Abrir no Maps" onPress={openInMaps} />
          </View>

          {errorMsg ? (
            <Text style={{ color: "#ef4444", textAlign: "center", marginTop: 12 }}>{errorMsg}</Text>
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/** UI helpers */
function Row({ label, value, multiline }: { label: string; value: string; multiline?: boolean }) {
  return (
    <View style={{ marginBottom: 8 }}>
      <Text style={{ color: "#334155", fontWeight: "600", marginBottom: 2 }}>{label}</Text>
      <Text style={{ color: "#0f172a" }} numberOfLines={multiline ? 3 : 1}>
        {value}
      </Text>
    </View>
  );
}
function Btn({ title, onPress, primary }: { title: string; onPress: () => void; primary?: boolean }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: primary ? "#111827" : "white",
        borderColor: primary ? "#111827" : "#d1d5db",
        borderWidth: 1,
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderRadius: 12,
        minWidth: 130,
      }}
    >
      <Text style={{ color: primary ? "white" : "#111827", fontWeight: "800", textAlign: "center" }}>{title}</Text>
    </TouchableOpacity>
  );
}
