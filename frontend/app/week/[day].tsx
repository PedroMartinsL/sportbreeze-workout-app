import { View, Pressable, Text } from 'react-native';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import TaskCard, { TaskCardProps } from '@/components/TaskCard';
import { useEffect, useState } from 'react';
import { ToolsIcons } from '@/components/WeatherIcon';
import ModalTask from '@/components/ModalTask';
import { SwipeListView } from 'react-native-swipe-list-view';
import { DeleteModal, useDeleteModal } from '@/components/DeleteModal';
import { apiFetch } from '@/services/api';
import { useAuthStore } from '@/store/auth';
import Toast from 'react-native-toast-message';

export default function DayScreen() {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      title: 'Daily tasks',
      headerStyle: { backgroundColor: '#f0f0f0' },
      headerTintColor: '#333',
      headerTitleAlign: 'center',
    });
  }, [navigation]);

  const router = useRouter();
  const params = useLocalSearchParams<{ taskList: string }>();
  let taskList: TaskCardProps[] = [];
  const { accessToken } = useAuthStore();

  if (params.taskList) {
    try {
      taskList = JSON.parse(params.taskList);
    } catch (e) {
      console.error('Falha ao parsear tasks:', e);
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
    try {
      await apiFetch({ path: `/workouts/${taskId}`, method: 'DELETE', token: accessToken });
    } catch (e: any) {
      Toast.show({
        type: 'error',
        text1: 'Workout not found',
        text2: e.message || 'Try again later',
      });
    }
    closeDeleteModal();
  }

  return (
    <View className="flex-1 bg-gray-100 p-2">
      <Toast />

      {tasks.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-lg font-medium text-gray-500">No tasks available</Text>
        </View>
      ) : (
        <SwipeListView
          data={tasks}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => populateModal(item)}
              style={({ pressed }) => [pressed && { opacity: 0.8, transform: [{ scale: 0.98 }] }]}>
              <TaskCard {...item} />
            </Pressable>
          )}
          renderHiddenItem={({ item }) => (
            <View className="m-2 mr-6 flex-1 flex-row items-center justify-end rounded-2xl bg-red-500">
              <Pressable onPress={() => openDeleteModal(item)} className="rounded-lg px-4 py-2">
                <Text className="font-semibold text-white">Delete</Text>
              </Pressable>
            </View>
          )}
          rightOpenValue={-90}
          disableRightSwipe
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Botão flutuante */}
      <Pressable
        onPress={() => router.push('./create')}
        className="absolute bottom-20 right-10 rounded-full border border-gray-200 bg-slate-50 p-3 shadow-lg">
        <ToolsIcons tool="create" />
      </Pressable>

      {/* Modal de detalhes */}
      <ModalTask task={modalData} modalVisible={modalVisible} setModalVisible={setModalVisible} />

      {/* Modal de deletar */}
      <DeleteModal
        modalVisible={deleteVisible}
        setModalVisible={closeDeleteModal}
        modalData={deleteData}
        handleDelete={handleDelete}
        confirmMessage={`Daily Task`}
      />
    </View>
  );
}
