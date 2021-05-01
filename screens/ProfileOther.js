import React from 'react'
import { View, Text, Image, SafeAreaView, TextInput, StyleSheet, TouchableOpacity } from 'react-native'

import {logOutUser} from './../database/users.db'

export default function ProfileOther({route, navigation}) {
    console.log(route.params);
    return (
        <SafeAreaView>

            <View>
                <TouchableOpacity onPress={()=>{ logOutUser() }}>
                    <Text style={{color:"#fff", fontSize:32}}>Logout</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}
