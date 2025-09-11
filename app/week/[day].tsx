import { View, FlatList, Pressable } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import TaskCard, { TaskCardProps } from "@/components/TaskCard";
import { useState } from "react";
import ModalTask from "@/components/ModalTask";
import { ToolsIcons } from "@/components/WeatherIcon";

export default function DayScreen() {
  const router = useRouter();
  const { day } = useLocalSearchParams(); // "Monday", "Tuesday", etc.
  const [modalVisible, setModalVisible] = useState(false);
  const [modalData, setModalData] = useState<TaskCardProps | null>(null);

  function populateModal(taskData: TaskCardProps) {
    setModalVisible(true);
    setModalData(taskData);
  }

  return (
    <View className="flex-1 bg-gray">
  <FlatList
    data={require("@/data/tasks.json")}
    renderItem={({ item }) => (
      <Pressable
        onPress={() => populateModal(item)}
        android_ripple={{ color: 'gray' }}
      >
        <TaskCard {...item} />
      </Pressable>
    )}
  />

  {/* Botão flutuante */}
  <Pressable
    onPress={() => router.push('./create')}
    className="absolute bottom-20 right-10 bg-slate-50 rounded-full border border-gray-200 p-3"
  >
    <ToolsIcons tool="create" />
  </Pressable>

  {modalData && (
    <ModalTask
      task={modalData}
      modalVisible={modalVisible}
      setModalVisible={setModalVisible}
    />
  )}
</View>

  );
}