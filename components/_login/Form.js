import React, {useState} from 'react'
import {View, Image, Text, TouchableOpacity, StyleSheet, Modal, SafeAreaView, KeyboardAvoidingView} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { DefaultTheme } from '../../theme/default'

import Input from './Input'
import { ScrollView } from 'react-native-gesture-handler'

export default function Form({ isVisible, view }) {

    const [content, setContent] = useState(view)

    const RenderContent = () => {
        
        if(content === 'login'){
            return(
                <View>
                    <View style={styles.header}>
                        <Text style={styles.header_title}>Welcome back to Shaare!</Text>
                        <Text style={styles.header_desc}>Please enter your informations below to sign into your account.</Text>
                        <Input label='Username' icon={require('./../../assets/images/icons/user_handle.png')} placeholder='MustachMaster123'/>
                        <Input label='Password' icon={require('./../../assets/images/icons/password.png')} placeholder=''/>
                        {/* <TouchableOpacity onPress={()=>{ setContent('register') }}>
                            <Text>Yo</Text>
                        </TouchableOpacity> */}
                    </View>
                </View>
            )

        }else if(content === 'code'){
            return(
                <View>
                    <Text>register</Text>
                </View>
            )
        }else if(content === 'register'){
            return(
                <View>
                    <Text>register</Text>
                </View>
            )
        }

    }

    return (
        <Modal
            transparent={true}
            visible={true}
            style={styles.modal}
            animationType="slide"
        >

            <TouchableOpacity style={styles.scrim}></TouchableOpacity>
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding":"height"}>
                <SafeAreaView style={styles.content}>
                    <ScrollView>
                        <RenderContent/>
                    </ScrollView>
                </SafeAreaView>
            </KeyboardAvoidingView>


        </Modal>
    )
}

const styles = StyleSheet.create({
    modal:{

    },
    scrim:{
        width:'100%',
        flex:1,
        backgroundColor:DefaultTheme.colors.darks.quad,
    },
    content:{
        width:'100%',
        backgroundColor:DefaultTheme.colors.dark,
        borderTopColor:DefaultTheme.colors.primary,
        borderTopWidth:3,
    },

    header:{
        width:'100%',
        paddingHorizontal:16,
        marginVertical:16,
    },
    header_title: {
        fontSize:DefaultTheme.fontSizes.big,
        color:DefaultTheme.colors.whites.full,
        fontFamily:DefaultTheme.fonts.bold,
        marginBottom:8
    },
    header_desc: {
        fontSize:DefaultTheme.fontSizes.normal,
        color:DefaultTheme.colors.whites.mid,
        fontFamily:DefaultTheme.fonts.medium,
        marginBottom:32
    }
})
