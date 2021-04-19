import React from 'react'
import {Image, View, StyleSheet, TouchableOpacity, Text} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient';
import {globalStyles} from './../../assets/styles/global.style'
import {DefaultTheme} from './../../theme/default'

export default function Header() {
    return (
        <View style={styles.header}>
            <Image source={require('./../../assets/images/logo.png')} style={styles.logo} />
            <TouchableOpacity>
                <LinearGradient
                    style={globalStyles.mainButton}
                    colors={DefaultTheme.colors.mainGradientArray}
                >
                <Text style={globalStyles.mainButtonText}>Shaare</Text>
                </LinearGradient>
            </TouchableOpacity>
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
    }
})

