import { View, Text, Modal, Pressable, ScrollView } from "react-native";
import { DetachedData, TaskCardProps } from "./TaskCard";
import { WeatherIcon } from "./WeatherIcon";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

interface TaskProps {
  task?: TaskCardProps;
  modalVisible: boolean;
  setModalVisible: Function;
}

export default function ModalTask({
  task,
  modalVisible,
  setModalVisible,
}: TaskProps) {
  if (!task) return null;
  return (
    <Modal
      animationType="slide"
      visible={modalVisible}
      transparent
      onRequestClose={() => setModalVisible(false)}
    >
      {/* Conteúdo do modal */}
      <View className="flex-1 justify-end bg-black/50">
        <View className="w-full h-4/5 rounded-t-xl p-6 shadow-lg bg-white">
            {/* Botão de fechar no canto */}
            <View className="flex-row justify-between">

              {/* Atualizar */}
                  <Pressable className="items-center">
                    <MaterialIcons name="edit" size={28} color="black" />
                  </Pressable>

              <Pressable onPress={() => setModalVisible(false)}>
                <MaterialIcons name="cancel" size={28} color="black" />
              </Pressable>
            </View>
            <ScrollView>
            {/* Conteúdo centralizado */}
            <View className="mt-10 gap-10">
              
              <View className="flex-row justify-around w-full items-end">
                <Text className="text-6xl font-bold text-gray-800">
                  {task.sport}
                </Text>
              </View>

              <View className="justify-center items-center">
                <View className="border-b p-1 border-t border-gray-500">
                  <Text className="text-lg font-light">{task.title}</Text>
                </View>
                <Text className="mt-4 border-b rounded-xl border-blue-600 text-lg text-gray-800">{task.hour}</Text>
              </View>

              <View className="flex-row justify-around">
                <View className="w-20 h-20 bg-white rounded-full shadow-lg items-center justify-center">
                  <Text className="text-xl font-semibold text-gray-800">
                    {task.temp}°C
                  </Text>
                </View>

                <WeatherIcon weather={task.weather} size={100} />
              </View>

              <View className="flex-row justify-between w-full px-2">
                <View className="w-full">
                  <View className="bg-blue-500 rounded-full px-2 py-1">
                    <Text className="text-white font-bold">
                      Planner:
                    </Text>
                  </View>

                  <Text className="text-lg font-light ml-5 mt-5">
                    {task.planner}
                  </Text>
                </View>
                <View></View>
              </View>

              <View className="border-b border-gray-200 mb-4" />

              <View className="w-full px-2 h-full">
                <View className="flex-row justify-between items-center mb-10">
                  {/* Coluna 1 */}
                  <View className="flex-1 mr-2">
                    <DetachedData>Thoughtput:</DetachedData>
                    <Text className="text-lg font-light ml-5 mt-5">
                      {task.kcal} kcal
                    </Text>
                  </View>

                  {/* Coluna 2 */}
                  <View className="flex-1 ml-2">
                    <DetachedData>Duration:</DetachedData>
                    <Text className="text-lg font-light ml-5 mt-5">
                      {task.duration}
                    </Text>
                  </View>
                </View>

                <View className="border-b border-gray-200" />
              </View>
            </View>
      </ScrollView>
          </View>
        </View>
    </Modal>
  );
}
