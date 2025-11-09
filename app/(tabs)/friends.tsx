import {View, Text, TextInput} from 'react-native'
import React from 'react'
import {SafeAreaView} from "react-native-safe-area-context";
import CustomTextInput from "@/components/shared/CustomTextInput";

const Friends = () => {
    const [searchedUserId, setSearchedUserId] = React.useState<string>("");
    const friends = []
    return (
        <SafeAreaView className={"themed-view"}>
            <View>
                <Text className={"text text-2xl"}>Add Friend</Text>
                <CustomTextInput onChangeText={e => setSearchedUserId(e)} placeholder={"Enter User Id"}
                                 value={searchedUserId}/>
            </View>

            <View>
                <Text className={"text text-2xl"}>Current Friends</Text>
            </View>

        </SafeAreaView>
    )
}
export default Friends
