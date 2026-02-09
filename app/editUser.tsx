import Avatar from "@/components/profile/avatar";
import CustomTextInput from "@/components/shared/CustomTextInput";
import { useAuthStore } from "@/store/auth.store";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const editUser = () => {
  const { user } = useAuthStore();
  const router = useRouter();

  if (!user) router.back();
  const [newUsername, setNewUsername] = useState(user?.username ?? "");
  return (
    <SafeAreaView className="themed-view gap-8">
      <Text className="text-white text-xl text-center mb-4">Edit User</Text>

      <View className="justify-center items-center gap-4">
        <Avatar size={100} userAvatar={user?.avatar} />
        <TouchableOpacity
          className="px-4 py-2 rounded bg-gray-700"
          onPress={() => {}}
        >
          <Text className="text-white">Upload Photo</Text>
        </TouchableOpacity>
      </View>

      <CustomTextInput
        textInputStyle="border border-white"
        value={newUsername}
        placeholder="Enter new username"
        onChangeText={(e) => setNewUsername(e)}
      />

      <View className="gap-4 flex-row justify-center">
        <TouchableOpacity
          className="p-4 rounded bg-red-500"
          onPress={() => router.back()}
        >
          <Text>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity className="p-4 rounded bg-green-500">
          <Text>Save</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default editUser;
