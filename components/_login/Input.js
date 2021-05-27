import React from 'react'
import {Text, View, TextInput, Image, StyleSheet} from 'react-native'
import { DefaultTheme } from '../../theme/default'

export default function Input({label, icon, value, onChange, placeholder, password}) {
    return (
        <View style={styles.container}>
        <Text style={styles.label}>{label}</Text>
            <View style={styles.inputbox}>
                <Image source={icon} style={styles.inputimg} />
                <TextInput
                    style={styles.input}
                    // value={log_username}
                    // onChangeText={setLog_username}
                    autoCompleteType="off"
                    autoFocus={false}
                    placeholderTextColor={DefaultTheme.colors.whites.mid}
                    keyboardAppearance="dark"
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoCompleteType="off"
                    placeholder={placeholder}
                    secureTextEntry={password ? password:false}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({

    container: {
        width:'100%',
        marginBottom:16
    },
    
    label: {
        fontSize:DefaultTheme.fontSizes.normal,
        color:DefaultTheme.colors.whites.mid,
        fontFamily:DefaultTheme.fonts.medium,
        marginBottom:8
    },
    
    inputbox: {
        width:"100%",
        flexDirection:'row',
        paddingVertical:12,
        paddingHorizontal:16,
        backgroundColor:DefaultTheme.colors.whites.quin,
        borderRadius:100
    },
    inputimg: {
        tintColor:DefaultTheme.colors.primary,
        width:24,
        height:24,
        marginRight:16
    },
    input: {
        width:'100%',
        fontSize:DefaultTheme.fontSizes.normal,
        color:DefaultTheme.colors.whites.full,
    }


})
