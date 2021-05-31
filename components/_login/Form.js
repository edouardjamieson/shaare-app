import React, {useState, useRef, useEffect} from 'react'
import {View, Image, Text, TouchableOpacity, StyleSheet, Modal, SafeAreaView, KeyboardAvoidingView, Alert, ScrollView} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { DefaultTheme } from '../../theme/default'

import Input from './Input'
import ViewLoader from './../_loaders/ViewLoader'

import {validateCode} from './../../database/codes.db'

export default function Form({ isVisible, view, isLoading, onLogIn, onSignUp, onExit}) {

    const [content, setContent] = useState(view)

    // ====================================================================
    // Log in
    // ====================================================================
    const [login_username, setLogin_username] = useState("")
    const [login_password, setLogin_password] = useState("")
    // ====================================================================
    // Code
    // ====================================================================
    const [accessCode, setAccessCode] = useState("")
    const handleCode = () => {
        const code = accessCode.trim()
        if(code.length < 1) return Alert.alert("Oups!🤕", "Please enter a valid code.", [{text: "OK"}])
        validateCode(code)
        .then((result) => {
            if(result === 0) return Alert.alert("Yikes!😥", "This code is invalid or has already been used today.", [{text: "OK"}])
            setContent('register')
        })
    }
    // ====================================================================
    // Register
    // ====================================================================
    const [register_username, setRegister_username] = useState("")
    const [register_password, setRegister_password] = useState("")
    const [register_passagain, setRegister_passagain] = useState("")

    // ====================================================================
    // Render
    // ====================================================================
    const RenderContent = () => {
        
        if(content === 'login'){
            return(
                <View>
                    <View style={styles.header}>
                        <Text style={styles.header_title}>Welcome back to Shaare!</Text>
                        <Text style={styles.header_desc}>Please enter your informations below to sign into your account.</Text>
                    </View>
                    <View style={styles.body}>
                        <Input label='Username' icon={require('./../../assets/images/icons/user_handle.png')} placeholder='MustachMaster123' value={login_username} onChange={v => setLogin_username(v)}/>
                        <Input label='Password' icon={require('./../../assets/images/icons/password.png')} password={true} placeholder='' value={login_password} onChange={v => setLogin_password(v)}/>
                        <TouchableOpacity style={styles.button} onPress={()=>{ onLogIn(login_username, login_password) }}>
                            <LinearGradient colors={DefaultTheme.colors.mainGradientArray} style={styles.gradient}>
                                <Text style={styles.button_text}>Log in</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                        <View style={styles.footer}>
                            <Text style={styles.footer_text}>Don't have an account?</Text>
                            <TouchableOpacity><Text style={styles.footer_link} onPress={()=>{setContent('code')}}>Tap here to create one!</Text></TouchableOpacity>
                        </View>
                    </View>
                </View>
            )

        }else if(content === 'code'){
            return(
                <View>
                    <View style={styles.header}>
                        <Text style={styles.header_title}>Welcome to Shaare!</Text>
                        <Text style={styles.header_desc}>Since Shaare is still in beta, you must have a code given by someone with an account to create yours.</Text>
                    </View>
                    <View style={styles.body}>
                        <Input label='Access code' icon={require('./../../assets/images/icons/lock.png')} placeholder='' value={accessCode} onChange={v => setAccessCode(v)}/>
                        <TouchableOpacity style={styles.button} onPress={()=>{ handleCode() }}>
                            <LinearGradient colors={DefaultTheme.colors.mainGradientArray} style={styles.gradient}>
                                <Text style={styles.button_text}>Verify</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                        <View style={styles.footer}>
                            <Text style={styles.footer_text}>Already have an account?</Text>
                            <TouchableOpacity><Text style={styles.footer_link} onPress={()=>{setContent('login')}}>Tap here to log in!</Text></TouchableOpacity>
                        </View>
                    </View>
                </View>
            )
        }else if(content === 'register'){
            return(
                <View>
                    <View style={styles.header}>
                        <Text style={styles.header_title}>Create my account 😎</Text>
                        <Text style={styles.header_desc}>Shaare is a sharing platform where you can discover what others are into.</Text>
                    </View>
                    <View style={styles.body}>
                        <Input label='Username' icon={require('./../../assets/images/icons/user_handle.png')} placeholder='MustachMaster123' value={register_username} onChange={v => setRegister_username(v)}/>
                        <Input label='Password' icon={require('./../../assets/images/icons/password.png')} password={true} placeholder='' value={register_password} onChange={v => setRegister_password(v)}/>
                        <Input label='Confirm your password' icon={require('./../../assets/images/icons/password.png')} password={true} placeholder='' value={register_passagain} onChange={v => setRegister_passagain(v)}/>
                        <TouchableOpacity style={styles.button} onPress={()=>{ onSignUp(register_username, register_password, register_passagain) }}>
                            <LinearGradient colors={DefaultTheme.colors.mainGradientArray} style={styles.gradient}>
                                <Text style={styles.button_text}>Let's shaare!</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                        <View style={styles.footer}>
                            <Text style={styles.footer_text}>Already have an account?</Text>
                            <TouchableOpacity><Text style={styles.footer_link} onPress={()=>{setContent('login')}}>Tap here to log in!</Text></TouchableOpacity>
                        </View>
                    </View>
                </View>
            )
        }else{
            return <ViewLoader backgroundcolor={DefaultTheme.colors.darks.mid}/>
        }

    }


    return (
        <Modal
            transparent={true}
            visible={isVisible}
            style={styles.modal}
            animationType="slide"
        >
            <TouchableOpacity style={styles.scrim} onPress={()=>{ onExit() }}></TouchableOpacity>
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding":"height"} enabled={true}>
                <SafeAreaView style={styles.content}>
                    {isLoading ? <ViewLoader backgroundcolor={DefaultTheme.colors.darks.mid}/>:null}
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
        marginBottom:32
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
    },
    body:{
        paddingHorizontal:16,
        alignItems:'center'
    },
    button:{
        borderRadius:100,
        overflow:'hidden',
        marginTop:8
    },
    gradient:{
        width:"100%",
        paddingVertical:10,
        paddingHorizontal:32,
    },
    button_text:{
        fontFamily:DefaultTheme.fonts.bold,
        color:DefaultTheme.colors.whites.full,
        fontSize:DefaultTheme.fontSizes.medium
    },
    footer:{
        marginTop:16,
        alignItems:'center'
    },
    footer_text:{
        fontSize:DefaultTheme.fontSizes.small,
        color:DefaultTheme.colors.whites.mid,
        fontFamily:DefaultTheme.fonts.medium,
    },
    footer_link:{
        fontSize:DefaultTheme.fontSizes.small,
        color:DefaultTheme.colors.primary,
        fontFamily:DefaultTheme.fonts.bold,
    },
    error:{
        position:'absolute',
        width:'100%',
        top:20,
        padding:16,
        borderRadius:15
    },
    error_text:{
        fontSize:DefaultTheme.fontSizes.normal,
        color:DefaultTheme.colors.whites.full,
        fontFamily:DefaultTheme.fonts.medium,
    }
})
