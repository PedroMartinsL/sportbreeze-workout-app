import { Routine } from "@/app/(tabs)/routine";
import { useRouter } from "expo-router";
import { ChevronRight } from "lucide-react-native";
import { TouchableOpacity, Text, View } from "react-native";

type RoutineCellProps = {
  item: Routine;
  setRoutine: (routineId: number) => void;
};

export default function RoutineCell({ item, setRoutine }: RoutineCellProps) {
  const router = useRouter();

  const handlePress = () => {
    setRoutine(item.id);
    router.push({
      pathname: "/week",
      params: { routine_id: item.id },
    });
  };

  return (
    <View>
      <TouchableOpacity
        onPress={handlePress}
        className="py-4 px-4 flex-row items-center justify-between bg-white rounded-xl"
      >
        <Text className="text-[#0a0a0a] font-medium">{item.name}</Text>
        <ChevronRight size={18} color="#0a0a0a" />
      </TouchableOpacity>
    </View>
  );
}
