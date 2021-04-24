import { LinearGradient } from 'expo-linear-gradient'
import React, {useState, useRef} from 'react'
import {View, Text, Image, SafeAreaView, StyleSheet, Animated, TextInput, ScrollView, KeyboardAvoidingView, Platform, Dimensions} from 'react-native'
import { Easing } from 'react-native-reanimated';
import { TouchableOpacity } from 'react-native-gesture-handler'

import {DefaultTheme} from './../theme/default'

export default function Login({ onExit }) {

    const [screen, setScreen] = useState(0)

    // ====================================================================
    // Animations
    // ====================================================================
    const viewLeft = useRef(new Animated.Value(Dimensions.get("window").width)).current
    const nextStep = () => {
        viewLeft.setValue(Dimensions.get("window").width)
        Animated.timing(viewLeft, {
            toValue:0,
            duration:500,
            useNativeDriver: false,
            easing:Easing.bezier(0.83, 0, 0.17, 1),
        }).start()
        setScreen(screen+1)
    }

    return (

        <View style={styles.body}>
            <SafeAreaView style={styles.safe}>

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
                                    // value={searchString}
                                    // onChangeText={handleTyping}
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
                        <TouchableOpacity style={styles.button}>
                            <LinearGradient colors={DefaultTheme.colors.mainGradientArray} style={styles.gradient}>
                                <Text style={styles.button_text}>Next</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button_second}>
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
    },
    title:{
        fontSize:DefaultTheme.fontSizes.super,
        color:DefaultTheme.colors.whites.full,
        fontFamily:DefaultTheme.fonts.bold,
        width:"80%",
        marginBottom:16,
        marginTop:32
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
    }

})
