import { useAuthStore } from "@/store/auth.store";
import { User } from "@/types";
import React, { useEffect } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";

const FriendStatusView = ({ searchedUser }: { searchedUser: User }) => {
  const {
    friends,
    sentFriendRequests,
    receivedFriendRequests,
    sendFriendRequest,
    removeFriendship,
    approveFriendRequest,
  } = useAuthStore();
  const [isAFriend, setIsAFriend] = React.useState(false);
  const [friendRequestStatus, setFriendRequestStatus] = React.useState<
    "Sent" | "Approve" | "Idle"
  >("Idle");

  useEffect(() => {
    if (friends.find((f) => f.id === searchedUser.id)) {
      setIsAFriend(true);
      return;
    }

    const sentRequest = sentFriendRequests.find(
      (r) => r.receiver_id === searchedUser.id,
    );
    if (sentRequest) {
      setFriendRequestStatus("Sent");
      return;
    }

    const receivedRequest = receivedFriendRequests.find(
      (r) => r.sender_id === searchedUser.id,
    );
    if (receivedRequest) setFriendRequestStatus("Approve");
  }, []);

  const onPressSendFriendRequest = () => {
    try {
      Alert.alert(
        "Send friend request",
        `Are you sure you want to send ${searchedUser.username} a friend request?`,
        [
          {
            text: "Yes",
            onPress: () => {
              sendFriendRequest(searchedUser);
            },
          },
          {
            text: "No",
            onPress: () => {},
          },
        ],
      );
    } catch (e: any) {
      Alert.alert(e.toString());
    }
  };
  const onPressRemoveFriend = () => {
    try {
      Alert.alert(
        "Remove friend",
        `Are you sure you want to remove ${searchedUser.username} as a friend?`,
        [
          {
            text: "Yes",
            onPress: () => {
              removeFriendship(searchedUser);
            },
          },
          {
            text: "No",
            onPress: () => {},
          },
        ],
      );
    } catch (e: any) {
      Alert.alert(e.toString());
    }
  };
  const onPressApproveFriendRequest = () => {
    try {
      Alert.alert(
        "Approve request",
        `Are you sure you want to make ${searchedUser.username} your friend?`,
        [
          {
            text: "Yes",
            onPress: () => {
              const request = receivedFriendRequests.find(
                (r) => r.sender_id === searchedUser.id,
              );
              if (!request)
                throw new Error("Request not found for searched user");
              approveFriendRequest(request);
            },
          },
          {
            text: "No",
            onPress: () => {},
          },
        ],
      );
    } catch (e: any) {
      Alert.alert(e.toString());
    }
  };

  return (
    <View className={"flex-row justify-center gap-4 py-2"}>
      {isAFriend ? (
        <>
          <Text className={"bg-green-300 px-4 py-2 rounded-full"}>
            Friend ✓
          </Text>
          <TouchableOpacity
            onPress={onPressRemoveFriend}
            className={"bg-red-300 px-4 py-2 rounded-full"}
          >
            <Text>Remove friend</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          {friendRequestStatus === "Idle" && (
            <TouchableOpacity
              onPress={onPressSendFriendRequest}
              className={"bg-green-300 px-4 py-2 rounded-full"}
            >
              <Text>Send friend request</Text>
            </TouchableOpacity>
          )}
          {friendRequestStatus === "Sent" && (
            <Text
              className={
                "text-sm text-center bg-green-700 px-4 py-2 rounded-full"
              }
            >
              Request sent.
            </Text>
          )}
          {friendRequestStatus === "Approve" && (
            <TouchableOpacity
              onPress={onPressApproveFriendRequest}
              className={"bg-green-700 px-4 py-2 rounded-full"}
            >
              <Text>Approve request.</Text>
            </TouchableOpacity>
          )}
        </>
      )}
    </View>
  );
};

export default FriendStatusView;
