import { useState } from "react";
import { Modal, View, Text, Pressable } from "react-native";

export function useDeleteModal<T = any>() {
  const [visible, setVisible] = useState(false);
  const [data, setData] = useState<T | null>(null);

  function openModal(item: T) {
    setData(item);
    setVisible(true);
  }

  function closeModal() {
    setVisible(false);
    setData(null);
  }

  return {
    visible,
    data,
    openModal,
    closeModal,
    setVisible,
  };
}

type DeleteModalProps = {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  modalData?: any;
  handleDelete: (taskId: number) => void;
  confirmMessage?: string;
};

export function DeleteModal({
  modalVisible,
  setModalVisible,
  modalData,
  handleDelete,
  confirmMessage,
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
            {confirmMessage ?? null}
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
