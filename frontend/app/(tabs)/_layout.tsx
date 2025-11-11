import { Tabs } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { useAuthStore } from "@/store/auth";

export default function TabLayout() {
  const { role } = useAuthStore();
  const isAdmin = role === "admin";

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "black",
        tabBarInactiveTintColor: "#94a3b8",
        tabBarStyle: {
          position: "absolute",
          borderRadius: 30,
          backgroundColor: "#fff",
          height: 60,
          paddingBottom: 20,
          borderTopWidth: 0.5,
          borderTopColor: "#ccc",
          marginBottom: 40,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => <FontAwesome name="home" color={color} size={size} />,
        }}
      />

      <Tabs.Screen
        name="registration"
        options={{
          title: "Registration",
          tabBarIcon: ({ color, size }) => <FontAwesome name="user-plus" color={color} size={size} />,
        }}
      />

      <Tabs.Screen
        name="routine"
        options={{
          title: "Routine",
          tabBarIcon: ({ color, size }) => <FontAwesome name="list" color={color} size={size} />,
        }}
      />

      <Tabs.Screen
        name="about"
        options={{
          title: "About",
          tabBarIcon: ({ color, size }) => <FontAwesome name="info-circle" color={color} size={size} />,
        }}
      />

      <Tabs.Screen
        name="gps"
        options={{
          title: "GPS",
          tabBarIcon: ({ color, size }) => <FontAwesome name="location-arrow" color={color} size={size} />,

        }}
      />

      {/* Tab Statistics - Apenas para Admin */}
      <Tabs.Screen
        name="statistics"
        options={{
          title: "Statistics",
          tabBarIcon: ({ color, size }) => <FontAwesome name="bar-chart" color={color} size={size} />,
          href: isAdmin ? "/statistics" : null, // Esconde a tab se não for admin
        }}
      />
    </Tabs>
  );
}
