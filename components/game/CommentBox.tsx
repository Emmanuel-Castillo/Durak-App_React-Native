import {Animated, FlatList, TouchableOpacity, View, Text} from "react-native";
import {AntDesign} from "@expo/vector-icons";
import React, {useEffect, useRef, useState} from "react";
import {useGameStore} from "@/store/game.store";

const CommentBox = () => {
    const {comments} = useGameStore()
    let commentYValue = useRef(new Animated.Value(50)).current;
    const popUpComment = () => {
        commentYValue.setValue(50)
        Animated.timing(commentYValue, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start()
    }
    useEffect(() => {
        popUpComment()
    }, [comments]);

    return <View className={"flex-1 flex-row items-center bg-amber-900 overflow-hidden"}>
            <TouchableOpacity className={"bg-amber-500 h-full p-2 justify-center"}
                              onPress={() => useGameStore.setState({showAllComments: true})}>
                <AntDesign name="history" size={20} color="white"/>
            </TouchableOpacity>
            <Animated.Text numberOfLines={2} className={"max-w-[90%] text text-lg text-wrap px-2"}
                           style={{translateY: commentYValue}}>{
                comments.at(-1)
            }</Animated.Text>


        </View>
}

export default CommentBox