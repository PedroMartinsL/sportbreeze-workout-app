import { View, FlatList, Pressable } from "react-native";
import { useLocalSearchParams } from "expo-router";
import TaskCard, { TaskCardProps } from "@/components/TaskCard";
import { useState } from "react";
import ModalTask from "@/components/ModalTask";

export default function DayScreen() {
  const { day } = useLocalSearchParams(); // "Monday", "Tuesday", etc.
  const [modalVisible, setModalVisible] = useState(false);
  const [modalData, setModalData] = useState<TaskCardProps | null>(null);

  function populateModal(taskData: TaskCardProps) {
    setModalVisible(true);
    setModalData(taskData);
  }

  return (
    <View className="flex-1 items-center justify-center bg-gray ">
      <FlatList data={require("@/data/tasks.json")} renderItem={({ item }) => 
      
      <Pressable
        onPress={() => populateModal(item)}
        android_ripple={{ color: 'gray' }}
      >
        <TaskCard
        id={item.id}
        day={item.day}
        weather={item.weather}
        kcal={item.kcal}
        routine={item.routine}
        temp={item.temp}
        duration={item.duration}
        planner={item.planner}
        hour={item.hour}
        date={item.date}
        sport={item.sport}
      />
      </Pressable>
      }>
      </FlatList>
      {modalData && (
        <ModalTask task={modalData} modalVisible={modalVisible} setModalVisible={setModalVisible} />
      )}
    </View>
  );
}