// app/registration.tsx
import { router } from "expo-router";
import {
  Activity,
  Bike,
  Dumbbell,
  Footprints,
  Mountain,
  Timer,
  Waves,
} from "lucide-react-native";
import React, { useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;
type Day = typeof DAYS[number];
type Sport = "running" | "cycling" | "trail" | "gym" | "walking" | "swimming";

const SPORT_LABEL: Record<Sport, string> = {
  running: "Running",
  cycling: "Cycling",
  trail: "Trail",
  gym: "Gym",
  walking: "Walking",
  swimming: "Swimming",
};

const SPORT_LIST = [
  { value: "running", label: "Running", Icon: Activity },
  { value: "cycling", label: "Cycling", Icon: Bike },
  { value: "trail", label: "Trail", Icon: Mountain },
  { value: "gym", label: "Gym", Icon: Dumbbell },
  { value: "walking", label: "Walking", Icon: Footprints },
  { value: "swimming", label: "Swimming", Icon: Waves },
] as const;

export default function Registration() {
  const [form, setForm] = useState({
    name: "",
    age: "",
    weight: "",
    height: "",
    substances: false,
    alcohol: false,
    sports: ["running"] as Sport[],
    days: DAYS.reduce(
      (a, d) => ({ ...a, [d]: false }),
      {} as Record<Day, boolean>
    ),
  });
  const [weeklyHours, setWeeklyHours] = useState("5");

  const toggleDay = (d: Day) =>
    setForm((f) => ({ ...f, days: { ...f.days, [d]: !f.days[d] } }));
  const toggleSport = (s: Sport) =>
    setForm((f) => ({
      ...f,
      sports: f.sports.includes(s)
        ? f.sports.filter((x) => x !== s)
        : [...f.sports, s],
    }));

  const save = () => {
    if (!form.name.trim())
      return Alert.alert("Attention", "Please enter your name.");

    const hrs = Math.min(
      Math.max(Number(weeklyHours.replace(",", ".")) || 0, 1),
      80
    );
    const daysStr = DAYS.filter((d) => form.days[d]).join(", ") || "none";
    const sportsStr =
      form.sports.map((s) => SPORT_LABEL[s]).join(", ") || "none";
    const primarySport = form.sports[0] ?? "running";

    Alert.alert(
      "Saved ✅",
      `Name: ${form.name}\nSports: ${sportsStr}\nDays: ${daysStr}\nHours/week: ${hrs}`,
      [
        { text: "Edit", style: "cancel" },
        {
          text: "Continue",
          onPress: () =>
            router.replace({
              pathname: "/routine",
              params: {
                name: form.name,
                sport: primarySport, // compat
                sports: form.sports.join(","), // CSV
                days: daysStr,
                hoursPerWeek: String(hrs),
              },
            }),
        },
      ]
    );
  };

  return (
    <ScrollView className="flex-1 bg-[#d9f99d] px-5">
      <View className="h-4" />
      <Text className="text-2xl font-extrabold text-[#0a0a0a]">
        Registration Portal
      </Text>
      <Text className="text-[#475569] mt-1">
        Fill in your profile to personalize your training.
      </Text>

      {[
        {
          k: "name",
          label: "Name",
          placeholder: "Your name",
          props: { autoCapitalize: "words" as const },
        },
        {
          k: "age",
          label: "Age",
          placeholder: "e.g., 22",
          props: { keyboardType: "numeric" as const, inputMode: "numeric" as const },
        },
        {
          k: "weight",
          label: "Weight (kg)",
          placeholder: "e.g., 70",
          props: { keyboardType: "numeric" as const, inputMode: "numeric" as const },
        },
        {
          k: "height",
          label: "Height (cm)",
          placeholder: "e.g., 175",
          props: { keyboardType: "numeric" as const, inputMode: "numeric" as const },
        },
      ].map((f) => (
        <Field key={f.k} label={f.label}>
          <TextInput
            value={(form as any)[f.k]}
            onChangeText={(v) => setForm({ ...form, [f.k]: v })}
            placeholder={f.placeholder}
            {...f.props}
            className="bg-white border border-[#c5e1a5] rounded-xl px-3 py-2"
          />
        </Field>
      ))}

      <Toggle
        label="Consume alcoholic beverages? (optional)"
        value={form.alcohol}
        onValueChange={(v) => setForm({ ...form, alcohol: v })}
      />
      <Toggle
        label="Use substances? (optional)"
        value={form.substances}
        onValueChange={(v) => setForm({ ...form, substances: v })}
      />

      <Text className="text-[#0a0a0a] font-semibold mt-3">Sports</Text>
      <View className="flex-row flex-wrap gap-2 mt-2">
        {SPORT_LIST.map(({ value, label, Icon }) => {
          const sel = form.sports.includes(value as Sport);
          return (
            <Pressable
              key={String(value)}
              onPress={() => toggleSport(value as Sport)}
              className={`flex-row items-center gap-2 px-3 py-2 rounded-xl border border-[#c5e1a5] ${
                sel ? "bg-black" : "bg-white"
              }`}
            >
              <Icon size={16} color={sel ? "#fff" : "#0a0a0a"} />
              <Text
                className={`font-semibold ${
                  sel ? "text-white" : "text-[#0a0a0a]"
                }`}
              >
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Text className="text-[#0a0a0a] font-semibold mt-3">Available days</Text>
      <View className="flex-row flex-wrap gap-2 mt-2">
        {DAYS.map((d) => {
          const sel = form.days[d];
          return (
            <Pressable
              key={d}
              onPress={() => toggleDay(d)}
              className={`px-3 py-2 rounded-xl border border-[#c5e1a5] ${
                sel ? "bg-black" : "bg-white"
              }`}
            >
              <Text
                className={`font-semibold ${
                  sel ? "text-white" : "text-[#0a0a0a]"
                }`}
              >
                {d}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Field label="Hours available per week">
        <View className="flex-row items-center gap-2">
          <Timer size={16} color="#0a0a0a" />
          <TextInput
            value={weeklyHours}
            onChangeText={setWeeklyHours}
            keyboardType="numeric"
            inputMode="numeric"
            placeholder="e.g., 5"
            className="flex-1 bg-white border border-[#c5e1a5] rounded-xl px-3 py-2"
          />
          <Text className="text-[#475569]">h</Text>
        </View>
        <Text className="text-xs text-[#64748b] mt-1">
          We’ll distribute these hours across your selected sports.
        </Text>
      </Field>

      <TouchableOpacity
        onPress={save}
        className="mt-5 bg-black py-3 rounded-xl items-center"
      >
        <Text className="text-white font-semibold">Save</Text>
      </TouchableOpacity>

      <View className="h-6" />
    </ScrollView>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <View className="mt-3">
      <Text className="text-[#0a0a0a] font-semibold mb-1">{label}</Text>
      {children}
    </View>
  );
}

function Toggle({
  label,
  value,
  onValueChange,
}: {
  label: string;
  value: boolean;
  onValueChange: (v: boolean) => void;
}) {
  return (
    <View className="mt-3 flex-row items-center justify-between">
      <Text className="text-[#0a0a0a] font-semibold">{label}</Text>
      <Switch value={value} onValueChange={onValueChange} />
    </View>
  );
}

