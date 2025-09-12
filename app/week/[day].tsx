import { View, FlatList, Pressable, Text, Modal, Animated } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import TaskCard, { TaskCardProps } from "@/components/TaskCard";
import { useState } from "react";
import { ToolsIcons } from "@/components/WeatherIcon";

export default function DayScreen() {
  const router = useRouter();
  const { day } = useLocalSearchParams(); // "Monday", "Tuesday", etc.
  const [modalVisible, setModalVisible] = useState(false);
  const [modalData, setModalData] = useState<TaskCardProps | null>(null);
  const [tasks, setTasks] = useState<TaskCardProps[]>(
    require("@/data/tasks.json")
  );

  function populateModal(taskData: TaskCardProps) {
    setModalVisible(true);
    setModalData(taskData);
  }

  function handleDelete() {
    if (!modalData) return;

    // Filtra a tarefa selecionada
    setTasks(prev => prev.filter(task => task.id !== modalData.id));

    setModalVisible(false);
    setModalData(null);
  }


  return (
    <View className="flex-1 bg-gray-100">
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => populateModal(item)}
            onLongPress={() => populateModal(item)}
            delayLongPress={300}
            style={({ pressed }) => [
              pressed && { opacity: 0.8, transform: [{ scale: 0.98 }] },
            ]}
          >
            <TaskCard {...item} />
          </Pressable>
        )}
      />

      {/* Botão flutuante */}
      <Pressable
        onPress={() => router.push("./create")}
        className="absolute bottom-20 right-10 bg-slate-50 rounded-full border border-gray-200 p-3 shadow-lg"
      >
        <ToolsIcons tool="create" />
      </Pressable>

      {/* Modal bonito */}
      {modalData && (
        <Modal
          animationType="fade"
          transparent
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View className="flex-1 justify-center items-center bg-black/50">
            <View className="bg-white rounded-2xl p-6 w-4/5 shadow-lg">
              <Text className="text-lg font-bold mb-2">Confirm task deletion</Text>
              <Text className="text-gray-500 mb-4">{modalData.sport} - {modalData.hour}</Text>

              <View className="flex-row justify-between">
                <Pressable
                  onPress={() => setModalVisible(false)}
                  className="bg-gray-200 px-4 py-2 rounded-lg"
                  style={({ pressed }) => pressed && { opacity: 0.7 }}
                >
                  <Text>Cancelar</Text>
                </Pressable>

                <Pressable
                  onPress={() => handleDelete}
                  className="bg-red-500 px-4 py-2 rounded-lg"
                  style={({ pressed }) => pressed && { opacity: 0.7 }}
                >
                  <Text className="text-white">Deletar</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}
