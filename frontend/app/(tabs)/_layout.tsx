import { Tabs } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { useAuthStore } from "@/store/auth";

export default function TabLayout() {
  const { role } = useAuthStore();
  const isAdmin = role === "admin";
  console.log("role", isAdmin);
  console.log("role é", role);

  return (
    <Tabs
      screenOptions={{
        headerShown: true, // mostrar header
        headerTitleAlign: "center", // centraliza o título
        headerTitleStyle: {
          fontSize: 20,
          fontWeight: "700",
          color: "#111827",
        },
        tabBarActiveTintColor: "black",
        tabBarInactiveTintColor: "#94a3b8",
        tabBarStyle: {
          position: "absolute",
          borderRadius: 30,
          backgroundColor: "#fff",
          height: 60,
          paddingBottom: 10,
          borderTopWidth: 0.5,
          borderTopColor: "#ccc",
          marginBottom: 40,
          shadowColor: "#000",
          shadowOpacity: 0.05,
          shadowRadius: 5,
          shadowOffset: { width: 0, height: 2 },
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
          textAlign: "center",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          headerShown: false, // esconde o header só aqui
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
      
      {isAdmin && (
        <Tabs.Screen
          name="statistics"
          options={{
            title: "Statistics",
            tabBarIcon: ({ color, size }) => <FontAwesome name="bar-chart" color={color} size={size} />,
          }}
        />
      )}
    </Tabs>
  );
}
