import { View, Text, TouchableOpacity } from 'react-native';
import { useStore } from '../store/useStore';

export default function Counter() {
  const { count, increment, decrement, reset } = useStore();

  return (
    <View className="items-center gap-4">
      <Text className="text-4xl font-bold text-blue-600">{count}</Text>
      <View className="flex-row gap-3">
        <TouchableOpacity
          onPress={decrement}
          className="bg-red-500 px-6 py-3 rounded-lg"
        >
          <Text className="text-white font-semibold">-</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={reset}
          className="bg-gray-500 px-6 py-3 rounded-lg"
        >
          <Text className="text-white font-semibold">Reset</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={increment}
          className="bg-green-500 px-6 py-3 rounded-lg"
        >
          <Text className="text-white font-semibold">+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

