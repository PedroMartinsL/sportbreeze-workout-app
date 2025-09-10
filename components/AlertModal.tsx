import { View, Text, Pressable, Modal } from 'react-native';

type AlertModalProps = {
  visible: boolean;
  onClose: () => void;
  title: string;
  message: string;
};

export default function AlertModal({ visible, onClose, title, message }: AlertModalProps) {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View
          className="flex-1 justify-center items-center"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }} // fundo semi-transparente
        >
        <View className="bg-white p-6 rounded-lg w-80">
          <Text className="text-lg font-bold mb-4">{title}</Text>
          <Text className="mb-6">{message}</Text>
          <Pressable
            onPress={onClose}
            className="bg-blue-500 px-4 py-2 rounded"
          >
            <Text className="text-white font-bold text-center">Fechar</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
