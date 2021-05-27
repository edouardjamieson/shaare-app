import React from 'react'
import {View, Image, Text, TouchableOpacity, StyleSheet} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { DefaultTheme } from '../../theme/default'

export default function Onboarding({ image, title, desc, primaryBtn, secondaryBtn }) {
    return (
        <>
            <View style={styles.content}>
                <Image source={image} style={styles.image} />
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.text}>{desc}</Text>
            </View>
            <View style={styles.footer}>
                <TouchableOpacity style={styles.button} onPress={primaryBtn.action}>
                    <LinearGradient colors={DefaultTheme.colors.mainGradientArray} style={styles.gradient}>
                        <Text style={styles.button_text}>{primaryBtn.title}</Text>
                    </LinearGradient>
                </TouchableOpacity>
                {secondaryBtn ?
                <TouchableOpacity style={styles.button_second} onPress={secondaryBtn.action}>
                    <View style={styles.fill}>
                        <Text style={styles.button_second_text}>{secondaryBtn.title}</Text>
                    </View>
                </TouchableOpacity>
                :null}
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    content: {
        marginVertical:"auto",
        justifyContent:'center',
        flex:1
    },
    image:{
        width:"100%",
        height:300,
        resizeMode:'contain',
        marginBottom:32
    },
    title:{
        fontSize:DefaultTheme.fontSizes.super,
        color:DefaultTheme.colors.whites.full,
        fontFamily:DefaultTheme.fonts.bold,
        width:"80%",
        marginBottom:16,
    },
    text:{
        fontSize:DefaultTheme.fontSizes.normal,
        color:DefaultTheme.colors.whites.mid,
        fontFamily:DefaultTheme.fonts.medium,
        width:"90%"
    },
    footer:{
        marginBottom:24,
        flexDirection:'row-reverse',
        justifyContent:'space-between',
        alignItems:'center',
    },
    button:{
        borderRadius:100,
        overflow:'hidden',
    },
    gradient:{
        width:"100%",
        paddingVertical:8,
        paddingHorizontal:24,
    },
    button_text:{
        fontFamily:DefaultTheme.fonts.bold,
        color:DefaultTheme.colors.whites.full,
        fontSize:DefaultTheme.fontSizes.medium
    },

    button_second:{
        borderRadius:100,
        overflow:'hidden',
    },
    fill:{
        backgroundColor:DefaultTheme.colors.whites.quin,
        width:"100%",
        paddingVertical:8,
        paddingHorizontal:20,
    },
    button_second_text:{
        fontFamily:DefaultTheme.fonts.bold,
        color:DefaultTheme.colors.primary,
        fontSize:DefaultTheme.fontSizes.medium
    }
})
