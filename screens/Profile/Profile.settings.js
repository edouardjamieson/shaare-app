import React, {useState, useEffect} from 'react'
import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native'

import {getCachedUser, logOutUser} from './../../database/users.db'

import {DefaultTheme} from '../../theme/default'


export default function Settings({navigation}) {

    const [isLoading, setIsLoading] = useState(true)
    const [posts, setPosts] = useState(null)


    // ====================================================================
    // Loading view
    // ====================================================================
    const LoadingView = () => {
        return(
            <View style={{ flex:1, alignItems:'center', justifyContent:'center' }}>
                <Text style={{ fontFamily:DefaultTheme.fonts.bold, color:DefaultTheme.colors.whites.full, fontSize:DefaultTheme.fontSizes.medium }}>loading...</Text>
            </View>
        )
    }

    // ====================================================================
    // Handle log out
    // ====================================================================
    const handleLogOut = () => {
        Alert.alert(
            "You're about to log out!",
            "Are you sure you want to log out?",
            [
                {text:"Never mind", style:"cancel"},
                {text:"Dew it!", style:"destructive", onPress:()=>{
                    logOutUser()
                    .then(()=> navigation.navigate('Logout'))
                }}
            ]
        )
    }
    const handleLogOutDEV = () => {
        logOutUser()
        .then(()=> navigation.navigate('Logout'))
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>

                <View style={styles.option}>
                    <TouchableOpacity onPress={()=> { handleLogOut() }}>
                        <Text style={styles.option_text}>Log out</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=> { handleLogOutDEV() }}>
                        <Text style={styles.option_text}>Log out DEV</Text>
                    </TouchableOpacity>
                </View>


            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({

    container:{
        flex:1,
        backgroundColor:DefaultTheme.colors.dark,
        position:'relative',
    },

    option:{
        borderBottomColor:DefaultTheme.colors.whites.tier,
        borderBottomWidth:1,
        paddingHorizontal:16,
        paddingVertical:8
    },
    option_text:{
        color:DefaultTheme.colors.whites.full,
        fontFamily:DefaultTheme.fonts.bold,
        fontSize:DefaultTheme.fontSizes.medium
    }

})
