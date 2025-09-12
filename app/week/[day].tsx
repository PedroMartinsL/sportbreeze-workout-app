import { View, FlatList, Pressable, Text, Modal } from "react-native";
import { useRouter } from "expo-router";
import TaskCard, { TaskCardProps } from "@/components/TaskCard";
import { useState } from "react";
import { ToolsIcons } from "@/components/WeatherIcon";
import ModalTask from "@/components/ModalTask";

export default function DayScreen() {
  const router = useRouter();

  const [modalVisible, setModalVisible] = useState(false);
  const [modalData, setModalData] = useState<TaskCardProps>();

  const [deleteVisible, setDeleteVisible] = useState(false);
  const [deleteData, setDeleteData] = useState<TaskCardProps>();

  const [tasks, setTasks] = useState<TaskCardProps[]>(
    require("@/data/tasks.json")
  );

  function populateModal(taskData: TaskCardProps) {
    setModalVisible(true);
    setModalData(taskData);
  }

  function openDeleteModal(taskData: TaskCardProps) {
    setDeleteVisible(true);
    setDeleteData(taskData);
  }

  function handleDelete(taskId: number) {
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
    setDeleteVisible(false);
  }

  return (
    <View className="flex-1 bg-gray-100 justify-center items-center">
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => populateModal(item)}
            onLongPress={() => openDeleteModal(item)}
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

      {/* Modal de detalhes */}
      <ModalTask
        task={modalData}
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
      />

      {/* Modal de deletar */}
      <DeleteModal
        modalVisible={deleteVisible}
        setModalVisible={setDeleteVisible}
        modalData={deleteData}
        handleDelete={handleDelete}
      />
    </View>
  );
}

type DeleteModalProps = {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  modalData?: TaskCardProps;
  handleDelete: (taskId: number) => void;
};

function DeleteModal({
  modalVisible,
  setModalVisible,
  modalData,
  handleDelete,
}: DeleteModalProps) {
  if (!modalData) return null;

  return (
    <Modal
      animationType="fade"
      transparent
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="bg-white rounded-2xl p-6 w-4/5 shadow-lg">
          <Text className="text-lg font-bold mb-2">Confirmar exclusão</Text>
          <Text className="text-gray-500 mb-4">
            {modalData.sport} - {modalData.hour}
          </Text>

          <View className="flex-row justify-between">
            <Pressable
              onPress={() => setModalVisible(false)}
              className="bg-gray-200 px-4 py-2 rounded-lg"
              style={({ pressed }) => pressed && { opacity: 0.7 }}
            >
              <Text>Cancelar</Text>
            </Pressable>

            <Pressable
              onPress={() => handleDelete(modalData.id)}
              className="bg-red-500 px-4 py-2 rounded-lg"
              style={({ pressed }) => pressed && { opacity: 0.7 }}
            >
              <Text className="text-white">Deletar</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
