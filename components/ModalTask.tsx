import { View, Text, Modal, Pressable, ScrollView } from "react-native";
import { DetachedData, TaskCardProps } from "./TaskCard";
import { WeatherIcon } from "./WeatherIcon";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

interface TaskProps {
  task: TaskCardProps;
  modalVisible: boolean;
  setModalVisible: Function;
}

export default function ModalTask({
  task,
  modalVisible,
  setModalVisible,
}: TaskProps) {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      {/* Fundo semitransparente */}
      <ScrollView>
        <View className="flex-1 bg-opacity-50">
          <View className="bg-white w-full h-full rounded-t-xl p-6 shadow-lg">
            {/* Botão de fechar no canto */}
            <View className="flex-row justify-end">
              <Pressable onPress={() => setModalVisible(false)}>
                <MaterialIcons name="cancel" size={28} color="black" />
              </Pressable>
            </View>

            {/* Conteúdo centralizado */}
            <View className="mt-10 gap-10">
              <View className="flex-row justify-around w-full items-end">
                <Text className="text-6xl font-bold text-gray-800">
                  {task.sport}
                </Text>

                <Text className="text-lg text-gray-800">{task.hour}</Text>
              </View>

              <View className="justify-center items-center">
                <View className="border-b p-1 border-t border-gray-500">
                  <Text className="text-lg font-light">{task.routine}</Text>
                </View>
              </View>

              <View className="flex-row justify-around">
                <View>
                  <Text className="text-lg font-medium">Planner:</Text>
                  <Text className="text-lg font-light w-40">
                    {task.planner}
                  </Text>
                </View>

                <WeatherIcon weather={task.weather} size={100} />
              </View>

              <View className="flex-row justify-between w-full px-2">
                <View className="w-full">
                  <DetachedData>Duration:</DetachedData>

                  <Text className="text-lg font-light ml-5 mt-5">
                    {task.duration} min
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
                    <DetachedData>Temperature:</DetachedData>
                    <Text className="text-lg font-light ml-5 mt-5">
                      {task.temp}°C
                    </Text>
                  </View>
                </View>

                <View className="border-b border-gray-200" />

                <View className="flex-row justify-between w-full px-4 mt-4">
                  {/* Atualizar */}
                  <Pressable className="items-center">
                    <MaterialIcons name="edit" size={28} color="black" />
                  </Pressable>

                  {/* Deletar */}
                  <Pressable className="items-center">
                    <MaterialIcons name="delete" size={28} color="black" />
                  </Pressable>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </Modal>
  );
}
