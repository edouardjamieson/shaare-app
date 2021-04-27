import { LinearGradient } from 'expo-linear-gradient'
import React, {useState, useRef} from 'react'
import {View, Text, Image, SafeAreaView, StyleSheet, Animated, TextInput, ScrollView, KeyboardAvoidingView, Platform, Dimensions} from 'react-native'
import { Easing } from 'react-native-reanimated';
import { TouchableOpacity } from 'react-native-gesture-handler'

import {DefaultTheme} from './../theme/default'
import {checkIfContainsBadwords} from './../badwords'
import {insertUser, logInUser} from './../database/users.db'
import {validateCode} from './../database/codes.db'

export default function Login({ onLogin }) {

    const [screen, setScreen] = useState(0)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)

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

    const viewError = useRef(new Animated.Value(0)).current
    const throwError = (string) => {
        setError(string)
        setIsLoading(false)
        Animated.timing(viewError, {
            toValue:1,
            duration:200,
            useNativeDriver: true,
        }).start()
        
        setTimeout(() => {
            Animated.timing(viewError, {
                toValue:0,
                duration:500,
                useNativeDriver: true,
            }).start((finished) => { setError(null) })
        }, 3000);
    }

    // ====================================================================
    // Validate invite code
    // ====================================================================
    const [inviteCode, setInviteCode] = useState("")
    const validateInviteCode = () => {
        const code = inviteCode.trim()
        if(code.length < 1) return throwError("Please enter a valid invite code.")

        setIsLoading(true)
        validateCode(inviteCode).then((result) => {
            
            setIsLoading(false)
            if(result === 0) return throwError("The code you entered is invalid or has already been used today.")

            nextStep(4)

        })

    }

    // ====================================================================
    // Register
    // ====================================================================
    const [reg_username, setReg_username] = useState("")
    const [reg_password, setReg_password] = useState("")
    const [reg_password2, setReg_password2] = useState("")
    const validateRegister = () => {
        setIsLoading(true)

        const username = reg_username.trim().replace(/\s/g, '')
        const pass = reg_password.trim()
        const pass2 = reg_password2.trim()

        //check if empty fields
        if(username < 1 || pass < 1 || pass2 < 1) return throwError("At least one field is empty.")
        //check for bad username
        if(checkIfContainsBadwords(username)) return throwError("That username looks unsuitable. Try another.")
        const userVal = new RegExp("^(?=.*[!@#$%^&*])")
        if(userVal.test(username)) return throwError("Username must not contain any special characters.")
        //check password strenght
        const passVal = new RegExp("^(?=.*[a-z])(?=.*[0-9])(?=.{6,})")
        if(!passVal.test(pass)) return throwError("Password must be 6 characters long and contain at leat one number & one letter.")
        //check if pass are indentic
        if(pass !== pass2) return throwError("Passwords don't match.")

        insertUser({username:username, password:pass})
        .then(doc => {
            if(doc === 0) return throwError("An account with this username already exists. Choose another.")

            console.log(doc);
            setIsLoading(false)
        })
        .catch(err => {
            console.log(err);
            setIsLoading(false)
        })

        

    }

    // ====================================================================
    // Log in
    // ====================================================================

    const [log_username, setLog_username] = useState("")
    const [log_password, setLog_password] = useState("")
    const validateLogin = () => {
        setIsLoading(true)

        const username = log_username.trim()
        const password = log_password.trim()

        //check if empty fields
        if(username < 1 || password < 1) return throwError("At least one field is empty.")        

        logInUser({username:username, password:password})
        .then(doc => {
            setIsLoading(false)
            if(doc === 0) return throwError("Username or password is incorrect.")   

            onLogin(doc)

        })
        .catch(err => { setIsLoading(false); console.log(err); return throwError("There was an error. Please try again.") })

    }



    return (

        <View style={styles.body}>
            <SafeAreaView style={styles.safe}>

                {/* LOADING */}
                <View style={[styles.loader, {display: isLoading?"flex":"none"}]}>
                    <Image source={require('./../assets/images/loading.gif')} style={{width:48,height:48,resizeMode:'contain',borderRadius:100}} />
                </View>

                {/* ERROR */}
                <Animated.View style={{opacity:viewError, display: error?"flex":"none", zIndex:10}}>
                    <LinearGradient style={form.error} colors={DefaultTheme.colors.errorGradientArray}>
                        <Text style={form.error_text}>{error}</Text>
                    </LinearGradient>
                </Animated.View>

                {/* ONBOARDING 1 */}
                <Animated.View style={[styles.page, {display:screen === 0 ? "flex":"none"} ]}>
                    <View style={styles.header}>
                        <Image source={require('./../assets/images/logo.png')} style={styles.logo} />
                    </View>
                    <View style={styles.content}>
                        <Image source={require('./../assets/images/onboarding1.png')} style={onboarding.image} />
                        <Text style={onboarding.title}>Share what you really like.</Text>
                        <Text style={onboarding.text}>Videos, photos, music, products, anything. Just Shaare.</Text>
                    </View>
                    <View style={styles.footer}>
                        <TouchableOpacity style={styles.button} onPress={()=>{ nextStep() }}>
                            <LinearGradient colors={DefaultTheme.colors.mainGradientArray} style={styles.gradient}>
                                <Text style={styles.button_text}>Next</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </Animated.View>

                {/* ONBOARDING 2 */}
                <Animated.View style={[styles.page, {display:screen === 1 ? "flex":"none", left:viewLeft } ]}>
                    <View style={styles.header}>
                        <Image source={require('./../assets/images/logo.png')} style={styles.logo} />
                    </View>
                    <View style={styles.content}>
                        <Image source={require('./../assets/images/onboarding2.png')} style={onboarding.image} />
                        <Text style={onboarding.title}>Discover what others are into.</Text>
                        <Text style={onboarding.text}>See what people watch, listen to, laught to and interact with them.</Text>
                    </View>
                    <View style={styles.footer}>
                        <TouchableOpacity style={styles.button} onPress={()=>{ nextStep() }}>
                            <LinearGradient colors={DefaultTheme.colors.mainGradientArray} style={styles.gradient}>
                                <Text style={styles.button_text}>Next</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </Animated.View>

                {/* INVITE CODE */}
                <Animated.View style={[styles.page, {display:screen === 2 ? "flex":"none", left:viewLeft } ]}>
                    <View style={styles.header}>
                        <Image source={require('./../assets/images/logo.png')} style={styles.logo} />
                    </View>
                    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding":"height"} style={{flex:1}} enabled={true} keyboardVerticalOffset={0}>
                        <ScrollView style={form.content} contentContainerStyle={{justifyContent:'center', flex:1}}>
                            <Text style={onboarding.title}>Enter invite code</Text>
                            <Text style={onboarding.text}>Shaare is still in beta, to enter you must get an invite code from someone with an account.</Text>
                            <View style={[form.inputbox, { marginTop:32 }]}>
                                <Image source={require('./../assets/images/icons/lock.png')} style={form.inputimg} />
                                <TextInput
                                    style={form.input}
                                    value={inviteCode}
                                    onChangeText={setInviteCode}
                                    autoCompleteType="off"
                                    autoFocus={false}
                                    placeholderTextColor={DefaultTheme.colors.whites.mid}
                                    keyboardAppearance="dark"
                                    underlineColorAndroid="transparent"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    autoCompleteType="off"
                                />
                            </View>
                        </ScrollView>
                    </KeyboardAvoidingView>
                    <View style={styles.footer}>
                        <TouchableOpacity style={styles.button} onPress={()=>{ validateInviteCode() }}>
                            <LinearGradient colors={DefaultTheme.colors.mainGradientArray} style={styles.gradient}>
                                <Text style={styles.button_text}>Next</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button_second} onPress={()=>{ nextStep() }}>
                            <View style={styles.fill}>
                                <Text style={styles.button_second_text}>Log in</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </Animated.View>

                {/* LOGIN */}
                <Animated.View style={[styles.page, {display:screen === 3 ? "flex":"none", left:viewLeft } ]}>
                    <View style={styles.header}>
                        <Image source={require('./../assets/images/logo.png')} style={styles.logo} />
                    </View>
                    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding":"height"} style={{flex:1}} enabled={true} keyboardVerticalOffset={0}>
                        <ScrollView style={form.content} contentContainerStyle={{justifyContent:'center', flex:1}}>
                            <Text style={onboarding.title}>Welcome back!</Text>
                            <Text style={form.label}>Username</Text>
                            <View style={form.inputbox}>
                                <Image source={require('./../assets/images/icons/at.png')} style={form.inputimg} />
                                <TextInput
                                    style={form.input}
                                    value={log_username}
                                    onChangeText={setLog_username}
                                    autoCompleteType="off"
                                    autoFocus={false}
                                    placeholderTextColor={DefaultTheme.colors.whites.mid}
                                    keyboardAppearance="dark"
                                    underlineColorAndroid="transparent"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    autoCompleteType="off"
                                    placeholder="mustachMaster"
                                />
                            </View>
                            <Text style={form.label}>Password</Text>
                            <View style={form.inputbox}>
                                <Image source={require('./../assets/images/icons/password.png')} style={form.inputimg} />
                                <TextInput
                                    style={form.input}
                                    value={log_password}
                                    onChangeText={setLog_password}
                                    autoCompleteType="off"
                                    autoFocus={false}
                                    placeholderTextColor={DefaultTheme.colors.whites.mid}
                                    keyboardAppearance="dark"
                                    underlineColorAndroid="transparent"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    autoCompleteType="off"
                                    secureTextEntry={true}
                                />
                            </View>
                        </ScrollView>
                    </KeyboardAvoidingView>
                    <View style={styles.footer}>
                        <TouchableOpacity style={styles.button} onPress={()=>{ validateLogin() }}>
                            <LinearGradient colors={DefaultTheme.colors.mainGradientArray} style={styles.gradient}>
                                <Text style={styles.button_text}>Log in</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button_second} onPress={()=>{ nextStep(2) }}>
                            <View style={styles.fill}>
                                <Text style={styles.button_second_text}>Register</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </Animated.View>

                {/* REGISTER */}
                <Animated.View style={[styles.page, {display:screen === 4 ? "flex":"none", left:viewLeft } ]}>
                    <View style={styles.header}>
                        <Image source={require('./../assets/images/logo.png')} style={styles.logo} />
                    </View>
                    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding":"height"} style={{flex:1}} enabled={true} keyboardVerticalOffset={0}>
                        <ScrollView style={form.content} contentContainerStyle={{justifyContent:'center', flex:1}}>
                            <Text style={onboarding.title}>Create an account</Text>
                            <Text style={form.label}>Username</Text>
                            <View style={form.inputbox}>
                                <Image source={require('./../assets/images/icons/at.png')} style={form.inputimg} />
                                <TextInput
                                    style={form.input}
                                    value={reg_username}
                                    onChangeText={setReg_username}
                                    autoCompleteType="off"
                                    autoFocus={false}
                                    placeholderTextColor={DefaultTheme.colors.whites.mid}
                                    keyboardAppearance="dark"
                                    underlineColorAndroid="transparent"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    autoCompleteType="off"
                                    placeholder="mustachMaster"
                                />
                            </View>
                            <Text style={form.label}>Password</Text>
                            <View style={form.inputbox}>
                                <Image source={require('./../assets/images/icons/password.png')} style={form.inputimg} />
                                <TextInput
                                    style={form.input}
                                    value={reg_password}
                                    onChangeText={setReg_password}
                                    autoCompleteType="off"
                                    autoFocus={false}
                                    placeholderTextColor={DefaultTheme.colors.whites.mid}
                                    keyboardAppearance="dark"
                                    underlineColorAndroid="transparent"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    autoCompleteType="off"
                                    secureTextEntry={true}
                                />
                            </View>
                            <Text style={form.label}>Password (again)</Text>
                            <View style={form.inputbox}>
                                <Image source={require('./../assets/images/icons/password.png')} style={form.inputimg} />
                                <TextInput
                                    style={form.input}
                                    value={reg_password2}
                                    onChangeText={setReg_password2}
                                    autoCompleteType="off"
                                    autoFocus={false}
                                    placeholderTextColor={DefaultTheme.colors.whites.mid}
                                    keyboardAppearance="dark"
                                    underlineColorAndroid="transparent"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    autoCompleteType="off"
                                    secureTextEntry={true}
                                />
                            </View>
                        </ScrollView>
                    </KeyboardAvoidingView>
                    <View style={styles.footer}>
                        <TouchableOpacity style={styles.button} onPress={()=>{ validateRegister() }}>
                            <LinearGradient colors={DefaultTheme.colors.mainGradientArray} style={styles.gradient}>
                                <Text style={styles.button_text}>Done</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button_second} onPress={()=>{ nextStep(3) }}>
                            <View style={styles.fill}>
                                <Text style={styles.button_second_text}>Log in</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </Animated.View>


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
    loader:{
        position:'absolute',
        flex:1,
        width:"100%",
        height:"100%",
        zIndex:10,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:DefaultTheme.colors.darks.mid
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
        paddingVertical:6,
        paddingHorizontal:20,
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
        paddingVertical:6,
        paddingHorizontal:20,
    },
    button_second_text:{
        fontFamily:DefaultTheme.fonts.bold,
        color:DefaultTheme.colors.primary,
        fontSize:DefaultTheme.fontSizes.medium
    }

})

const onboarding = StyleSheet.create({
    image:{
        width:"100%",
        height:200,
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
    }
})

const form = StyleSheet.create({
    
    content:{
        flex:1
    },

    inputbox:{
        width:"100%",
        flexDirection:'row',
        paddingVertical:12,
        paddingHorizontal:16,
        backgroundColor:DefaultTheme.colors.whites.tier,
        borderRadius:100
    },
    inputimg: {
        width:24,
        height:24,
        tintColor:DefaultTheme.colors.primary,
        resizeMode:'contain',
        marginRight:16
    },
    input:{
        width:"100%",
        fontSize:DefaultTheme.fontSizes.normal,
        fontFamily:DefaultTheme.fonts.medium,
        color:DefaultTheme.colors.whites.full
    },
    label:{
        fontSize:DefaultTheme.fontSizes.normal,
        color:DefaultTheme.colors.whites.mid,
        fontFamily:DefaultTheme.fonts.bold,
        marginTop:16,
        marginBottom:8
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
