import { LinearGradient } from 'expo-linear-gradient'
import React, {useState, useRef, useEffect} from 'react'
import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList, Animated, TextInput, Dimensions, KeyboardAvoidingView, ScrollView, Platform } from 'react-native'
import { DefaultTheme } from '../theme/default'
import { Easing } from 'react-native-reanimated';
import Clipboard from '@react-native-clipboard/clipboard';
import {checkIfContainsBadwords} from './../badwords'

import {insertPost} from './../database/posts.db'
import {getProvider} from './../database/providers.db'

export default function Shaare({isVisible, onPressX}) {

    if(!isVisible){
        return null
    }

    // ====================================================================
    // Validate
    // ====================================================================
    const [isValidating, setIsValidating] = useState(false)
    const [error, setError] = useState(null)

    const triggerError = (title, text) => {
        setError({title:title, text:text})
        setTimeout(() => {
            setError(null)
        }, 2500);
    }

    const validate = () => {
        setIsValidating(true)
        const warnings = []

        const url_string = urlString.trim()
        const key_string = keyString.trim()

        //check if strings are empty
        if(url_string < 1 || key_string < 1){
            triggerError("Oups!", "One of the fields look empty.")
            setIsValidating(false)
            return
        }

        //check if url is valid
        const pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
        '(\\#[-a-z\\d_]*)?$','i'); // fragment locator

        if(!pattern.test(url_string)){
            triggerError("Oups!", "That doesn't look like a URL.")
            setIsValidating(false)
            return
        }

        //url is good so get infos
        const URI = new URL(url_string)
        let host = URI.hostname
        host = host.replace(/^[^.]+\./g, "");
        const protocol = URI.protocol
        if(protocol === "http:") warnings.push("INSECURE_PROTOCOL")

        //check if url contains badwords
        if(checkIfContainsBadwords(url_string)){
            triggerError("Oups!", "We believe the URL contains unsuitable words.")
            setIsValidating(false)
            return
        }

        //check if keyword contains badwords
        if(checkIfContainsBadwords(key_string)){
            triggerError("Oups!", "We believe the keyword(s) contains unsuitable words.")
            setIsValidating(false)
            return
        }

        //get provider
        let provider = ""
        getProvider(category[currentCategory].set_to, host).then(doc => {
            if(doc != 0){
                provider = doc.id
            }

            const date = Date.now()
            const data = {
                author:"1",
                url:url_string,
                category:category[currentCategory].set_to,
                created_at:date,
                keyword:key_string,
                provider:provider,
                reactions:[],
                warnings:warnings
            }
            
            insertPost(data)
            .then(res => {
                setIsValidating(false)
                closeAnim()
            })
            .catch(err => {
                triggerError("Oups!", "There was an error. Please try again.")
                setIsValidating(false)
            })

        })

    }

    // ====================================================================
    // Inputs string
    // ====================================================================
    const [urlString, setUrlString] = useState("")
    const [keyString, setKeyString] = useState("")

    // ====================================================================
    // Animations
    // ====================================================================
    const toggleAnim = useRef(new Animated.Value(Dimensions.get("window").height)).current
    const openAnim = () => {
        Animated.timing(toggleAnim, {
            toValue:0,
            duration:500,
            useNativeDriver: false,
            easing:Easing.bezier(0.83, 0, 0.17, 1),
        }).start()
    }
    const closeAnim = () => {
        Animated.timing(toggleAnim, {
            toValue:Dimensions.get("window").height,
            duration:300,
            useNativeDriver: false,
            easing:Easing.bezier(0.83, 0, 0.17, 1),
        }).start(({finished})=>{
            if(finished) onPressX()
        })
    }

    // ====================================================================
    // Clipboard
    // ====================================================================
    const setUrlByClipboard = async () => {
        const text = await Clipboard.getString()
        setUrlString(text)
    }
    
    // ====================================================================
    // Get random greetings text
    // ====================================================================

    const words = ["funny 😂", "cool 😎", "romantic ❤️", "weird 🦑", "sporty 🏈", "cute 🥰", "you like 👌"]
    const [currentWord, setCurrentWord] = useState(Math.floor(Math.random() * words.length))

    // ====================================================================
    // Category list
    // ====================================================================

    const [currentCategory, setCurrentCategory] = useState(0)
    const category = [
        {
            name:"Music",
            set_to:"music",
            icon:require('./../assets/images/icons/music.png')
        },
        {
            name:"Video",
            set_to:"video",
            icon:require('./../assets/images/icons/video.png')
        },
        {
            name:"Photo",
            set_to:"photo",
            icon:require('./../assets/images/icons/camera.png')
        },
        {
            name:"Product",
            set_to:"product",
            icon:require('./../assets/images/icons/cart.png')
        },
        {
            name:"Social post",
            set_to:"social",
            icon:require('./../assets/images/icons/social.png')
        },
        {
            name:"Website",
            set_to:"website",
            icon:require('./../assets/images/icons/website.png')
        },
    ]

    const RenderCategoryItem = ({item, index}) => {
        return(
        <View style={styles.category}>
            <TouchableOpacity style={index === currentCategory ? styles.category_btn_active : styles.category_btn} onPress={()=>{setCurrentCategory(index)}}>
                <Image source={item.icon} style={[styles.category_icon, { tintColor: index === currentCategory ? DefaultTheme.colors.whites.full:DefaultTheme.colors.primary }]} />
            </TouchableOpacity>
            <Text style={[styles.category_label, {display:index === currentCategory ? "flex":"none"}]}>{item.name}</Text>
        </View>
        )

    }
    
    openAnim()
    return (
        <Animated.View style={[styles.shaare, { transform:[{translateY:toggleAnim}]}]}>
            <View style={[styles.loading, { display: isValidating ? "flex":"none" }]}>
                <Image source={require('./../assets/images/loading.gif')} style={styles.loader}/>
            </View>
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding":"height"} style={{flex:1}} enabled={true} keyboardVerticalOffset={0}>
                <ScrollView>
                    <View style={styles.header}>
                        <Text style={styles.header_text}>Shaare somethin' {words[currentWord]}</Text>
                        <TouchableOpacity style={styles.shaare_close} onPress={()=>{ closeAnim() }}>
                            <Image source={require('./../assets/images/icons/exit.png')} style={styles.shaare_close_icon} />
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.label}>Category</Text>
                    <FlatList
                        data={category}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        renderItem={RenderCategoryItem}
                        style={styles.list}
                        contentContainerStyle={{
                            alignItems:'flex-start'
                        }}
                    />

                    <Text style={styles.label}>Link/url</Text>
                    <View style={styles.input_box}>
                        <Image source={require('./../assets/images/icons/link.png')} style={styles.input_icon} />
                        <TextInput
                            style={styles.input}
                            value={urlString}
                            onChangeText={(e)=>{setUrlString(e)}}
                            placeholder="https://youtu.be/dQw4w9WgXcQ"
                            autoCompleteType="off"
                            autoFocus={true}
                            placeholderTextColor={DefaultTheme.colors.whites.mid}
                            keyboardAppearance="dark"
                            underlineColorAndroid="transparent"
                            autoCorrect={false}
                            selectTextOnFocus={true}
                        />
                    </View>

                    <Text style={styles.label}>Keyword(s)</Text>
                    <View style={styles.input_box}>
                        <Image source={require('./../assets/images/icons/key.png')} style={styles.input_icon} />
                        <TextInput
                            style={styles.input}
                            value={keyString}
                            onChangeText={(e)=>{setKeyString(e)}}
                            placeholder="Rick Astley"
                            autoCompleteType="off"
                            autoFocus={false}
                            placeholderTextColor={DefaultTheme.colors.whites.mid}
                            keyboardAppearance="dark"
                            underlineColorAndroid="transparent"
                            autoCorrect={false}
                        />
                    </View>

            
                </ScrollView>
                
                <View style={styles.footer}>
                    {error ?
                    <LinearGradient colors={DefaultTheme.colors.errorGradientArray} style={styles.error}>
                        <Text style={styles.error_head}>{error.title}</Text>
                        <Text style={styles.error_text}>{error.text}</Text>
                    </LinearGradient>
                    :
                    <TouchableOpacity onPress={()=>{ validate() }} style={[styles.shaare_btn, { opacity: urlString.length > 1 && keyString.length > 1 ? 1:0.5 }]} disabled={urlString.length > 1 && keyString.length > 1 ? false:true}>
                        <LinearGradient
                            colors={DefaultTheme.colors.mainGradientArray}
                            style={styles.shaare_btn_gradient}
                        >
                            <Text style={styles.shaare_btn_text}>Shaare</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                    }
                </View>
            </KeyboardAvoidingView>
            

        </Animated.View>
    )
}

const styles = StyleSheet.create({

    loading:{
        width:"100%",
        height:Dimensions.get('window').height,
        flex:1,
        position:'absolute',
        zIndex:10,
        alignItems:'center',
        justifyContent:'center',
        left:0,
    },
    loader:{
        width:48,
        height:48,
        resizeMode:'contain',
        borderRadius:100
    },

    shaare:{
        width:"100%",
        height:"100%",
        flex:1,
        backgroundColor:DefaultTheme.colors.dark,
        position:'absolute',
        zIndex:5,
        padding:16,
        paddingBottom:0,
    },

    header:{
        flexDirection:'row',
        alignItems:'center',
        marginBottom:24
    },
    header_text:{
        color:DefaultTheme.colors.whites.full,
        fontFamily:DefaultTheme.fonts.bold,
        fontSize:DefaultTheme.fontSizes.big,
        width:"60%"
    },
    shaare_close:{
        width:32,
        height:32,
        borderRadius:100,
        backgroundColor:DefaultTheme.colors.whites.tier,
        alignItems:'center',
        justifyContent:'center',
        marginLeft:'auto'
    },
    shaare_close_icon:{
        tintColor:DefaultTheme.colors.primary,
        width:24,
        height:24,
        resizeMode:'contain'
    },

    label:{
        fontFamily:DefaultTheme.fonts.bold,
        color:DefaultTheme.colors.whites.mid,
        fontSize:DefaultTheme.fontSizes.normal,
        marginBottom:8
    },

    list:{
        flexGrow:0,
        marginBottom:24
    },
    category:{
        alignItems:'center',
        marginRight:16
    },
    category_btn:{
        width:64,
        height:64,
        borderRadius:100,
        alignItems:'center',
        justifyContent:'center',
        borderColor:DefaultTheme.colors.primary,
        borderWidth:3
    },
    category_btn_active:{
        width:64,
        height:64,
        borderRadius:100,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:DefaultTheme.colors.primary,
    },
    category_icon:{
        resizeMode:'contain',
        width:32,
        height:32
    },
    category_label:{
        fontFamily:DefaultTheme.fonts.bold,
        fontSize:DefaultTheme.fontSizes.small,
        color:DefaultTheme.colors.whites.full,
        marginTop:8
    },

    input_box:{
        width:"100%",
        flexDirection:'row',
        alignItems:'center',
        backgroundColor:DefaultTheme.colors.whites.quin,
        borderRadius:100,
        padding:16,
        marginBottom:16
    },
    input:{
        width:"100%",
        fontSize:DefaultTheme.fontSizes.normal,
        color:DefaultTheme.colors.whites.full
    },
    input_icon:{
        width:18,
        height:18,
        tintColor:DefaultTheme.colors.primary,
        marginRight:16
    },


    footer:{
        marginTop:'auto',
        width:Dimensions.get('window').width,
        marginLeft:-16,
    },
    shaare_btn:{
        width:"100%",
        height:52,
        alignItems:'center',
    },
    shaare_btn_gradient:{
        alignItems:'center',
        width:"100%",
        flex:1
    },
    shaare_btn_text:{
        fontSize:DefaultTheme.fontSizes.medium,
        fontFamily:DefaultTheme.fonts.bold,
        color:DefaultTheme.colors.whites.full,
        paddingVertical:16,
    },

    error: {
        padding:16,
        width:"100%"
    },
    error_head:{
        fontFamily:DefaultTheme.fonts.bold,
        color:DefaultTheme.colors.whites.full,
        fontSize:DefaultTheme.fontSizes.medium
    },
    error_text:{
        fontFamily:DefaultTheme.fonts.regular,
        color:DefaultTheme.colors.whites.full,
        fontSize:DefaultTheme.fontSizes.normal
    }
})