import {FlatList, Text, TouchableOpacity, View} from "react-native";
import {useGameStore} from "@/store/game.store";
import {AntDesign} from "@expo/vector-icons";
import React from "react";

const CommentsList = ({comments}: {comments: string[] }) => {
    return <View className={"absolute inset-0 bg-zinc-900/50 p-8 items-center justify-center gap-2"}
                 style={{zIndex: 200}}>
        <FlatList
            contentContainerClassName={"flex-1 bg-zinc-800 p-4 rounded gap-4"} data={comments} renderItem={({item}) =>
            <View className={"bg-zinc-900 p-2 rounded"}>
                <Text className={"text"}>{item}</Text>
            </View>
        }
            ListHeaderComponent={<TouchableOpacity onPress={() => useGameStore.setState({showAllComments: false})}>
                <AntDesign name="close" size={24} color="white"/>
            </TouchableOpacity>}
        />
    </View>
}

export default CommentsList;