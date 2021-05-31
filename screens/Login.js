import { LinearGradient } from 'expo-linear-gradient'
import React, {useState, useRef} from 'react'
import {View, Text, Image, SafeAreaView, StyleSheet, StatusBar, Animated, TextInput, ScrollView, KeyboardAvoidingView, Platform, Dimensions, TouchableOpacity, Alert} from 'react-native'
import { Easing } from 'react-native-reanimated';

import {DefaultTheme} from './../theme/default'
import ViewLoader from './../components/_loaders/ViewLoader'
import Onboarding from './../components/_login/Onboarding'
import Form from './../components/_login/Form'

import {checkIfContainsBadwords} from './../badwords'
import {insertUser, logInUser} from './../database/users.db'
import {validateCode} from './../database/codes.db'

export default function Login({ onLogin }) {

    const [screen, setScreen] = useState(0)
    const [isLoading, setIsLoading] = useState(false)
    const [formVisible, setFormVisible] = useState(false)
    const [formContent, setFormContent] = useState('login')

    // ====================================================================
    // Errors
    // ====================================================================
    const throwError = ({title, body}) => {
        Alert.alert(title, body, [
            {text: "OK"}
        ])
    }

    // ====================================================================
    // Animations
    // ====================================================================
    const viewLeft = useRef(new Animated.Value(Dimensions.get("window").width)).current
    const nextStep = (step) => {
        viewLeft.setValue(Dimensions.get("window").width)
        Animated.timing(viewLeft, {
            toValue:0,
            duration:500,
            useNativeDriver: false,
            easing:Easing.bezier(0.83, 0, 0.17, 1),
        }).start()
        step ? setScreen(step) : setScreen(screen+1)
    }

    // ====================================================================
    // Register
    // ====================================================================
    const validateRegister = (data) => {
        setIsLoading(true)
        console.log(data);

        const username = data.username.trim()
        const pass = data.password.trim()
        const pass2 = data.passagain.trim()

        //check if empty fields
        if(username < 1 || pass < 1 || pass2 < 1) { throwError({title: "Oups!🤕", body:"At least one field is empty."}); return setIsLoading(false) }

        //check for bad username
        if(checkIfContainsBadwords(username)) { throwError({title: "Oups!🤕", body:"That username looks unsuitable. Try another."}); return setIsLoading(false) }
        
        const test_special_chars = new RegExp("^(?=.*[!@#$%^&*])")
        if(test_special_chars.test(username)) { throwError({title: "Oups!🤕", body:"Username must not contain any special characters."}); return setIsLoading(false) }
        if(/\s/.test(username)){ throwError({title: "Oups!🤕", body:"Username must not contain any special characters."}); return setIsLoading(false) }

        //check password strenght
        const test_password_strenght = new RegExp("^(?=.*[a-z])(?=.*[0-9])(?=.{6,})")
        if(!test_password_strenght.test(pass)) { throwError({title: "Oups!🤕", body:"Password must at least, be 6 characters long, contain one number & one letter."}); return setIsLoading(false) }
        //check if pass are indentic
        if(pass !== pass2) { throwError({title: "Oups!🤕", body:"Passwords don't match!"}); return setIsLoading(false) }

        insertUser({username:username, password:pass})
        .then(doc => {
            if(doc === 0) return throwError("An account with this username already exists. Choose another.")
            setIsLoading(false)
            onLogin(doc)
        })
        .catch(err => {
            throwError({title: "Oups!🤕", body:"There was an error. Please try again."}); return setIsLoading(false)
        })

        

    }

    // ====================================================================
    // Log in
    // ====================================================================
    const validateLogin = (data) => {
        setIsLoading(true)
        const username = data.username.trim()
        const password = data.password.trim()
        //check if empty fields
        if(username < 1 || password < 1) {
            throwError({title: "Oups!🤕", body:"At least one field is empty."})
            setIsLoading(false)
            return
        }
        logInUser({username:username, password:password})
        .then(doc => {
            setIsLoading(false)
            if(doc === 0) {
                throwError({title: "Oups!🤕", body:"Username or password is incorrect."})
                setIsLoading(false)
                return
            }
            onLogin(doc)
        })
        .catch(err => { setIsLoading(false); console.log(err); return throwError({title: "Oups!🤕", body:"There was an error. Please try again."}) })

    }


    return (

        <View style={styles.body}>
            <StatusBar
              animated={true}
              backgroundColor={DefaultTheme.colors.dark}
              barStyle={DefaultTheme.statusbar}
            />
            <SafeAreaView style={styles.safe}>
                

                {/* ONBOARDING 1 */}
                <Animated.View style={[styles.page, {display:screen === 0 ? "flex":"none"} ]}>
                    <Onboarding
                        image={require('./../assets/images/onboarding1.png')}
                        title="Share what you really like."
                        desc="Videos, photos, music, products, anything. Just Shaare."
                        primaryBtn={{ title: "Next", action:()=>{nextStep()} }}
                        secondaryBtn={{ title: "Login", action:()=>{ setFormContent('login'); setFormVisible(true) } }}
                    />
                </Animated.View>

                {/* ONBOARDING 2 */}
                <Animated.View style={[styles.page, {display:screen === 1 ? "flex":"none", left:viewLeft } ]}>
                    <Onboarding
                        image={require('./../assets/images/onboarding2.png')}
                        title="Discover what others are into."
                        desc="See what people watch, listen to, laught to and interact with them."
                        primaryBtn={{ title: "Create my account", action:()=>{ setFormContent('code'); setFormVisible(true) } }}
                        secondaryBtn={{ title: "Login", action:()=>{ setFormContent('login'); setFormVisible(true) } }}
                    />
                </Animated.View>

                <Form
                    isVisible={formVisible}
                    view={formContent}
                    isLoading={isLoading}
                    onLogIn={(username, password) => validateLogin({username: username, password:password})}
                    onSignUp={(username, password, passagain) => validateRegister({username: username, password: password, passagain: passagain})}
                    onExit={()=>{ setFormVisible(false); setFormContent(null) }}
                />

            </SafeAreaView>
        </View>

    )
    
}

const styles = StyleSheet.create({

    body:{
        flex:1,
        backgroundColor:DefaultTheme.colors.dark,
        paddingHorizontal:24,
    },
    safe:{
        flex:1,
    },
    page:{
        flex:1
    },
    header:{

    },
    logo:{
        width:48,
        height:64,
        resizeMode:'contain'
    },
    content:{
        marginVertical:"auto",
        justifyContent:'center',
        flex:1
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
