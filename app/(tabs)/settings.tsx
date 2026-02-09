import { useAuthStore } from "@/store/auth.store";
import { logOut } from "@/utils/supabase";
import { useRouter } from "expo-router";
import React from "react";
import { Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Settings = () => {
  const { resetAuthenticatedUser, isAnonymous } = useAuthStore();
  const router = useRouter();
  const onPressLogOut = async () => {
    await logOut();
    resetAuthenticatedUser();
  };
  return (
    <SafeAreaView className={"themed-view gap-4"}>
      {!isAnonymous && (
        <TouchableOpacity
          className={"bg-blue-500 border border-red-200 p-4 rounded-xl"}
          onPress={() => router.navigate("../editUser")}
        >
          <Text className={"text-white"}>Edit Profile</Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity
        className={"bg-red-500 border border-red-200 p-4 rounded-xl"}
        onPress={onPressLogOut}
      >
        <Text className={"text-white"}>Log out</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};
export default Settings;
