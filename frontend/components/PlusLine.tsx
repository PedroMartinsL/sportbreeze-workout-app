import { View, Text, TouchableOpacity } from "react-native";

export default function PlusLine() {
  return (
    <View className="my-16 px-2">
      {/* Linha */}
      <View className="border-b border-blue-700 relative">
        {/* Círculo central */}
        <TouchableOpacity
          className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-700 rounded-full w-10 h-10 justify-center items-center"
          onPress={() => console.log("Adicionar")}
        >
          <Text className="text-white text-2xl font-bold">+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
