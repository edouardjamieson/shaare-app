import React, { useState, useRef } from 'react'
import {Image, View, StyleSheet, TouchableOpacity, Text} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient';
import {globalStyles} from './../../assets/styles/global.style'
import {DefaultTheme} from './../../theme/default'
import Shaare from '../../screens/Shaare';

export default function Header({isShaareButtonVisible, onPressShaare, areProfileButtonsVisible, onProfileAction}) {

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

            {areProfileButtonsVisible === true ?
            <View style={styles.profile_btns}>
                <TouchableOpacity onPress={()=>{ onProfileAction('bookmarked') }} style={styles.profile_button}>
                    <Image source={require('./../../assets/images/icons/bookmark.png')} style={styles.profile_btn_icon} />
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>{ onProfileAction('editmode') }} style={styles.profile_button}>
                    <Image source={require('./../../assets/images/icons/edit.png')} style={styles.profile_btn_icon} />
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>{ onProfileAction('settings') }} style={styles.profile_button}>
                    <Image source={require('./../../assets/images/icons/settings.png')} style={styles.profile_btn_icon} />
                </TouchableOpacity>
            </View>
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
    },

    profile_btns:{
        flexDirection:'row',
        alignItems:'center',
        marginLeft:'auto',
    },
    profile_button:{
        marginLeft:16
    },
    profile_btn_icon:{
        width:24,
        height:24,
        resizeMode:'contain',
        tintColor:DefaultTheme.colors.whites.mid
    }
})

