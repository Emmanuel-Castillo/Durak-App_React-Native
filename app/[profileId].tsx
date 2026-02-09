import UserCard from "@/components/profile/UserCard";
import { User } from "@/type";
import { getProfile } from "@/utils/supabase";
import { AntDesign } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const UserPage = () => {
  const local = useLocalSearchParams();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const goBack = () => router.back();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileId: string | string[] = local.profileId as string;
        setUser(await getProfile(profileId));
      } catch (e: any) {
        Alert.alert("Failed to fetch profile", e.toString(), [
          { onPress: goBack },
        ]);
      }
    };
    fetchProfile();
  }, []);

  return (
    user && (
      <SafeAreaView className={"themed-view"}>
        <UserCard user={user} isFetchedUser={true} />
        <TouchableOpacity
          className={"absolute left-1/2 bottom-16 z-10"}
          onPress={goBack}
        >
          <AntDesign name="close" size={24} color="white" />
        </TouchableOpacity>
      </SafeAreaView>
    )
  );
};

export default UserPage;
