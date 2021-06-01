import React, {useState, useEffect} from 'react'
import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity, ScrollView, Alert, Image } from 'react-native'

import {getCachedUser, logOutUser} from './../../database/users.db'
import {resetEquation, DEV_getEQ} from './../../database/equation.db'

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

    // ====================================================================
    // Handle reset EQ
    // ====================================================================
    const resetEQ = () => {
        Alert.alert(
            "You're about to reset your preferences!",
            "Your posts feed preferences will be reset. There is no going back.",
            [
                {text:"Never mind", style:"cancel"},
                {text:"Do it!", style:"destructive", onPress:()=>{
                    resetEquation()
                    .then(()=>{
                        Alert.alert("Your feed preferences have been reset.", "", [{ text:"OK" }])
                    })
                }}
            ]
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>

                <View style={styles.option}>
                    <TouchableOpacity style={styles.option_btn} onPress={()=> { handleLogOut() }}>
                        <Image style={styles.option_img} source={require('./../../assets/images/icons/logout.png')}></Image>
                        <Text style={styles.option_text}>Log out</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.option}>
                    <TouchableOpacity style={styles.option_btn} onPress={()=> { handleLogOutDEV() }}>
                        <Image style={styles.option_img} source={require('./../../assets/images/icons/logout.png')}></Image>
                        <Text style={styles.option_text}>Log out DEV</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.option}>
                    <TouchableOpacity style={styles.option_btn} onPress={()=> { resetEQ() }}>
                        <Image style={styles.option_img} source={require('./../../assets/images/icons/reset_eq.png')}></Image>
                        <Text style={styles.option_text}>Reset preferences</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.option}>
                    <TouchableOpacity style={styles.option_btn} onPress={()=> { resetEquation() }}>
                        <Image style={styles.option_img} source={require('./../../assets/images/icons/reset_eq.png')}></Image>
                        <Text style={styles.option_text}>Reset preferences DEV</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.option}>
                    <TouchableOpacity style={styles.option_btn} onPress={()=> { DEV_getEQ() }}>
                        <Image style={styles.option_img} source={require('./../../assets/images/icons/reset_eq.png')}></Image>
                        <Text style={styles.option_text}>DEV Get preferences</Text>
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
        paddingHorizontal:16,
        paddingVertical:16,
    },
    option_btn:{
        flexDirection:'row',
        alignItems:'center'
    },
    option_img:{
        height:24,
        width:24,
        resizeMode:'contain',
        tintColor:DefaultTheme.colors.primary,
        marginRight:8
    },
    option_text:{
        color:DefaultTheme.colors.whites.full,
        fontFamily:DefaultTheme.fonts.bold,
        fontSize:DefaultTheme.fontSizes.medium
    }

})
