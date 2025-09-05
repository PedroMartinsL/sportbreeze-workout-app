import { View, Text, Modal, Pressable } from "react-native";
import { TaskCardProps } from "./TaskCard";
import { WeatherIcon } from "./WeatherIcon";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';


interface TaskProps {
    task: TaskCardProps;
    modalVisible: boolean,
    setModalVisible: Function,
}

export default function ModalTask({ task, modalVisible, setModalVisible }: TaskProps) {

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
        >
            {/* Fundo semitransparente */}
            <View className="flex-1 bg-opacity-50 justify-end"
            >

                <View className="bg-white w-full h-full rounded-t-xl p-6 shadow-lg">

                    {/* Botão de fechar no canto */}
                    <View className="flex-row justify-end">
                        <Pressable onPress={() => setModalVisible(false)}>
                            <MaterialIcons name="cancel" size={28} color="black" />
                        </Pressable>
                    </View>

                    {/* Conteúdo centralizado */}
                    <View className="items-center space-y-3 mt-2">
                        <WeatherIcon weather={task.weather} size={40} />

                        <View className="flex-row justify-between w-full px-2">
                            <Text className="text-lg font-bold">{task.kcal} kcal</Text>
                            <Text className="text-lg font-bold">{task.temp}°C</Text>
                        </View>

                        <View className="flex-row justify-between w-full px-2">
                            <Text className="text-lg font-bold">Duration: {task.duration} min</Text>
                            <Text className="text-lg font-bold">{task.hour}</Text>
                        </View>

                        <Text className="text-lg font-bold">{task.routine}</Text>
                        <Text className="text-lg font-bold">{task.planner}</Text>
                        <Text className="text-lg font-bold">{task.date}</Text>
                        <Text className="text-lg font-bold">{task.sport}</Text>
                    </View>

                </View>
            </View>
        </Modal>
    );
}