import { Picker } from "@react-native-picker/picker";
import React, { useState } from "react";
import { Alert, Pressable, ScrollView, Switch, Text, TextInput, View } from "react-native";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;
type Day = typeof DAYS[number];

const SPORT_LABEL: Record<string, string> = {
  running: "Running",
  cycling: "Cycling",
  trail: "Trail",
  gym: "Gym",
  walking: "Walking",
  swimming: "Swimming",
};

export default function Registration() {
  const [form, setForm] = useState({
    name: "", age: "", weight: "", height: "",
    substances: false, alcohol: false, sport: "running",
    days: DAYS.reduce((acc, d) => ({ ...acc, [d]: false }), {} as Record<Day, boolean>)
  });

  const toggleDay = (d: Day) =>
    setForm((f) => ({ ...f, days: { ...f.days, [d]: !f.days[d] } }));

  const save = () => {
    if (!form.name.trim()) {
      Alert.alert("Attention", "Please enter your name.");
      return;
    }
    const selectedDays = DAYS.filter(d => form.days[d]).join(", ") || "none";
    Alert.alert(
      "Saved ✅",
      `Name: ${form.name}\nSport: ${SPORT_LABEL[form.sport]}\nDays: ${selectedDays}`
    );
  };

  return (
    <ScrollView className="flex-1 bg-[#d9f99d] px-5">
      <View className="h-4" />
      <Text className="text-2xl font-extrabold text-[#0a0a0a]">Registration Portal</Text>
      <Text className="text-[#475569] mt-1">Fill in your profile to personalize your training.</Text>

      <Field label="Name">
        <TextInput
          value={form.name}
          onChangeText={(v) => setForm({ ...form, name: v })}
          placeholder="Your name"
          autoCapitalize="words"
          className="bg-white border border-[#c5e1a5] rounded-xl px-3 py-2"
        />
      </Field>

      <Field label="Age">
        <TextInput
          value={form.age}
          onChangeText={(v) => setForm({ ...form, age: v })}
          keyboardType="numeric"
          inputMode="numeric"
          placeholder="e.g., 22"
          className="bg-white border border-[#c5e1a5] rounded-xl px-3 py-2"
        />
      </Field>

      <Field label="Weight (kg)">
        <TextInput
          value={form.weight}
          onChangeText={(v) => setForm({ ...form, weight: v })}
          keyboardType="numeric"
          inputMode="numeric"
          placeholder="e.g., 70"
          className="bg-white border border-[#c5e1a5] rounded-xl px-3 py-2"
        />
      </Field>

      <Field label="Height (cm)">
        <TextInput
          value={form.height}
          onChangeText={(v) => setForm({ ...form, height: v })}
          keyboardType="numeric"
          inputMode="numeric"
          placeholder="e.g., 175"
          className="bg-white border border-[#c5e1a5] rounded-xl px-3 py-2"
        />
      </Field>

      <Toggle
        label="Consume alcoholic beverages? (optional)"
        value={form.alcohol}
        onValueChange={(v) => setForm((f) => ({ ...f, alcohol: v }))}
      />

      <Toggle
        label="Use substances? (optional)"
        value={form.substances}
        onValueChange={(v) => setForm((f) => ({ ...f, substances: v }))}
      />

      <Field label="Sport">
        <View className="bg-white border border-[#c5e1a5] rounded-xl overflow-hidden">
          <Picker
            selectedValue={form.sport}
            onValueChange={(v) => setForm({ ...form, sport: String(v) })}
          >
            <Picker.Item label="Running" value="running" />
            <Picker.Item label="Cycling" value="cycling" />
            <Picker.Item label="Trail" value="trail" />
            <Picker.Item label="Gym" value="gym" />
            <Picker.Item label="Walking" value="walking" />
            <Picker.Item label="Swimming" value="swimming" />
          </Picker>
        </View>
      </Field>

      <Text className="text-[#0a0a0a] font-semibold mt-3">Available days</Text>
      <View className="flex-row flex-wrap gap-2 mt-2">
        {DAYS.map((d) => {
          const sel = form.days[d];
          return (
            <Pressable
              key={d}
              onPress={() => toggleDay(d)}
              className={`px-3 py-2 rounded-xl border border-[#c5e1a5] ${sel ? "bg-black" : "bg-white"}`}
            >
              <Text className={`font-semibold ${sel ? "text-white" : "text-[#0a0a0a]"}`}>{d}</Text>
            </Pressable>
          );
        })}
      </View>

      <Pressable onPress={save} className="mt-5 bg-black py-3 rounded-xl items-center">
        <Text className="text-white font-semibold">Save</Text>
      </Pressable>

      <View className="h-6" />
    </ScrollView>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View className="mt-3">
      <Text className="text-[#0a0a0a] font-semibold mb-1">{label}</Text>
      {children}
    </View>
  );
}

function Toggle({ label, value, onValueChange }: { label: string; value: boolean; onValueChange: (v: boolean) => void }) {
  return (
    <View className="mt-3 flex-row items-center justify-between">
      <Text className="text-[#0a0a0a] font-semibold">{label}</Text>
      <Switch value={value} onValueChange={onValueChange} />
    </View>
  );
}
