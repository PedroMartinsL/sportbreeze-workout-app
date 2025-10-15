import { View, Pressable, Text } from "react-native";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import TaskCard, { TaskCardProps } from "@/components/TaskCard";
import { useEffect, useState } from "react";
import { ToolsIcons } from "@/components/WeatherIcon";
import ModalTask from "@/components/ModalTask";
import { SwipeListView } from "react-native-swipe-list-view";
import { DeleteModal, useDeleteModal } from "@/components/DeleteModal";
import { apiFetch } from "@/api";

export default function DayScreen() {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      title: "Daily tasks",
      headerStyle: { backgroundColor: "#f0f0f0" },
      headerTintColor: "#333",
      headerTitleAlign: "center",
    });
  }, [navigation]);

  const router = useRouter();
  const params = useLocalSearchParams<{ taskList: string }>();
  let taskList: TaskCardProps[] = [];

  if (params.taskList) {
    try {
      taskList = JSON.parse(params.taskList);
    } catch (e) {
      console.error("Falha ao parsear tasks:", e);
      taskList = [];
    }
  }

  const [modalVisible, setModalVisible] = useState(false);
  const [modalData, setModalData] = useState<TaskCardProps>();

  const [tasks, setTasks] = useState<TaskCardProps[]>(taskList);

  const {
    visible: deleteVisible,
    data: deleteData,
    openModal: openDeleteModal,
    closeModal: closeDeleteModal,
  } = useDeleteModal<TaskCardProps>();

  function populateModal(taskData: TaskCardProps) {
    setModalVisible(true);
    setModalData(taskData);
  }

  async function handleDelete(taskId: number) {
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
    await apiFetch(`/workouts/${taskId}`, "DELETE")
    closeDeleteModal();
  }

  return (
    <View className="flex-1 bg-gray-100">
      <SwipeListView
        data={tasks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => populateModal(item)}
            style={({ pressed }) => [
              pressed && { opacity: 0.8, transform: [{ scale: 0.98 }] },
            ]}
          >
            <TaskCard {...item} />
          </Pressable>
        )}
        renderHiddenItem={({ item }) => (
          <View className="flex-1 flex-row justify-end items-center pr-4 bg-red-100">
            <Pressable
              onPress={() => openDeleteModal(item)}
              className="bg-red-500 px-4 py-2 rounded-lg"
            >
              <Text className="text-white font-semibold">Deletar</Text>
            </Pressable>
          </View>
        )}
        rightOpenValue={-90} // quanto abre pro lado direito
        disableRightSwipe // só permite arrastar pra esquerda
        showsVerticalScrollIndicator={false}
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
        setModalVisible={closeDeleteModal}
        modalData={deleteData}
        handleDelete={handleDelete}
        confirmMessage={`${modalData?.hour} - ${modalData?.title}?`}
      />
    </View>
  );
}

