import React, { useState, useRef } from 'react'
import {Image, View, StyleSheet, TouchableOpacity, Text} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient';
import {globalStyles} from './../../assets/styles/global.style'
import {DefaultTheme} from './../../theme/default'
import Shaare from '../../screens/Shaare';

export default function Header({isShaareButtonVisible, onPressShaare}) {

    const [isShaareVisible, setShaareVisible] = useState(false)

    return (
        <View style={styles.header}>
            <Image source={require('./../../assets/images/logo.png')} style={styles.logo} />
            {isShaareButtonVisible === true ?
            <TouchableOpacity onPress={()=>{ onPressShaare() }} style={styles.button}>
                <LinearGradient
                    style={styles.gradient}
                    colors={DefaultTheme.colors.mainGradientArray}
                >
                <Text style={styles.button_text}>Shaare</Text>
                </LinearGradient>
            </TouchableOpacity>
            : null}
        </View>
    )
}
const styles = StyleSheet.create({
    header:{
        height:64,
        paddingLeft:16,
        paddingRight:16,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between'
    },
    logo:{
        width:48,
        height:64,
        resizeMode:'contain'
    },

    button:{
        borderRadius:20,
        overflow:'hidden'
    },
    gradient:{
        width:"100%",
        paddingVertical:6,
        paddingHorizontal:15,
    },
    button_text: {
        fontSize:DefaultTheme.fontSizes.medium,
        fontFamily:DefaultTheme.fonts.bold,
        color:DefaultTheme.colors.whites.full,
    }
})

