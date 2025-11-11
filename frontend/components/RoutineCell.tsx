import { Routine } from "@/app/(tabs)/routine";
import { Link } from "expo-router";
import { ChevronRight } from "lucide-react-native";
import { TouchableOpacity, Text, View } from "react-native";

export default function RoutineCell({ item, index }: { item: Routine; index: number }) {
  return (
    <View>
      <Link
        href={{
          pathname: "/week",
          params: { routine_id: item.id },
        }}
        asChild
      >
        <TouchableOpacity className="py-4 px-4 flex-row items-center justify-between bg-white rounded-xl">
          <Text className="text-[#0a0a0a] font-medium">{item.name}</Text>
          <ChevronRight size={18} color="#0a0a0a" />
        </TouchableOpacity>
      </Link>
    </View>
  );
}
