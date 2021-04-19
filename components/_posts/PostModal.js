import React,{ useState, useEffect, useRef } from 'react'
import { StyleSheet, Text, View, Image, TouchableOpacity, Animated, SafeAreaView, Linking } from 'react-native'
import { DefaultTheme } from '../../theme/default'
import { Dimensions } from 'react-native';
import { Easing } from 'react-native-reanimated';

export default function PostModal({post, isOpen, onClose}) {

    if(!isOpen){
        return null
    }

    const viewAnim = useRef(new Animated.Value(0)).current
    const boxAnim = useRef(new Animated.Value(Dimensions.get('window').height)).current
    const openAnimation = () => {
        Animated.timing(viewAnim, {
            toValue:1,
            duration:100,
            useNativeDriver: false
        }).start()
        Animated.timing(boxAnim, {
            easing:Easing.bezier(0.83, 0, 0.17, 1),
            toValue:Dimensions.get('window').height-350,
            duration:300,
            useNativeDriver: false
        }).start()
    }

    const closeAnimation = () => {

        Animated.timing(boxAnim, {
            toValue:Dimensions.get('window').height,
            duration:200,
            useNativeDriver: false,
            easing:Easing.bezier(0.83, 0, 0.17, 1),
        }).start(({finished})=>{
            if(finished){
                Animated.timing(viewAnim, {
                    toValue:0,
                    duration:100,
                    useNativeDriver: false
                }).start(({finished})=>{ if(finished) onClose() })
            }            
        })
    }


    openAnimation()
    return(
        <Animated.View style={[styles.modal_box, { display: isOpen ? "flex":"none", opacity:viewAnim }]}>
            <SafeAreaView style={styles.container}>

                <TouchableOpacity style={styles.closer} onPress={()=>{ closeAnimation() }}></TouchableOpacity>
                <Animated.View style={[styles.box, { top:boxAnim }]}>
                    <View style={styles.modal_head}>
                        <Image
                            source={{uri:'https://thumbs-prod.si-cdn.com/0Hlhw9KPW6kA8-zuSeBrgg0ztfQ=/fit-in/1600x0/filters:focal(582x120:583x121)/https://public-media.si-cdn.com/filer/d6/7d/d67d186f-f5f3-4867-82c5-2c772120304f/thanos-snap-featured-120518-2.jpg'}}
                            style={styles.modal_user_pic}
                        />
                        <TouchableOpacity style={styles.modal_usernames}>
                            <Text style={styles.modal_displayname}>edouardj😇</Text>
                            <Text style={styles.modal_username}>@edouardjamieson</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.modal_close_btn} onPress={()=>{ closeAnimation() }}>
                            <Image
                                source={require('./../../assets/images/icons/exit.png')}
                                style={styles.modal_close_icon}
                            />
                        </TouchableOpacity>

                    </View>
                    <View style={styles.modal_body}>
                        <Text style={styles.body_title}>Travis Scott - yo xd mamadou</Text>
                        <TouchableOpacity onPress={()=>Linking.openURL(post.data.url)}>
                            <Text style={styles.body_link}>{post.data.url}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.modal_buttons}>

                        <TouchableOpacity style={styles.modal_btn}>
                            <View style={styles.btn_container}>
                                <Image
                                    source={require('../../assets/images/icons/follow_user.png')}
                                    style={styles.btn_img}
                                />
                            </View>
                            <Text style={styles.btn_label}>Follow user</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.modal_btn}>
                            <View style={styles.btn_container}>
                                <Image
                                    source={require('../../assets/images/icons/bookmark.png')}
                                    style={styles.btn_img}
                                />
                            </View>
                            <Text style={styles.btn_label}>Bookmark</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.modal_btn}>
                            <View style={styles.btn_container}>
                                <Image
                                    source={require('../../assets/images/icons/action_back.png')}
                                    style={styles.btn_img}
                                />
                            </View>
                            <Text style={styles.btn_label}>Shaare back</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.modal_btn}>
                            <View style={styles.btn_container}>
                                <Image
                                    source={require('../../assets/images/icons/alert.png')}
                                    style={styles.btn_img}
                                />
                            </View>
                            <Text style={styles.btn_label}>Report post</Text>
                        </TouchableOpacity>
                        
                    </View>
                </Animated.View>

            </SafeAreaView>
        </Animated.View>
    )

}

const styles = StyleSheet.create({

    modal_box:{
        width:"100%",
        height:Dimensions.get('window').height,
        flex:1,
        position:'absolute',
        backgroundColor:DefaultTheme.colors.darks.mid,
        borderWidth:0,
    },

    container:{
        position:'relative',
        flex:1,
        height:"100%"
    },

    closer:{
        position:'relative',
        flex:1,
    },

    box: {
        borderColor:DefaultTheme.colors.primary,
        borderWidth:3,
        borderRadius:35,
        backgroundColor:DefaultTheme.colors.dark,
        position:'absolute',
        width:Dimensions.get('window').width - 32,
        margin:16,
        padding:16
    },


    modal_head:{
        flexDirection:'row',
        alignItems:'center'
    },

    modal_user_pic:{
        width:48,
        height:48,
        resizeMode:'cover',
        borderRadius:360,
        marginRight:16
    },

    modal_usernames:{
        justifyContent:'center'
    },
    modal_displayname:{
        fontFamily:'Quicksand-bold',
        fontSize:DefaultTheme.fontSizes.medium,
        color:DefaultTheme.colors.whites.full,
    },
    modal_username:{
        fontFamily:'Quicksand-medium',
        fontSize:DefaultTheme.fontSizes.small,
        color:DefaultTheme.colors.whites.tier,
    },
    modal_close_btn:{
        width:32,
        height:32,
        borderRadius:100,
        backgroundColor:DefaultTheme.colors.whites.tier,
        alignItems:'center',
        justifyContent:'center',
        marginLeft:'auto'
    },
    modal_close_icon:{
        tintColor:DefaultTheme.colors.primary,
        width:24,
        height:24,
        resizeMode:'contain'
    },

    modal_body:{
        marginTop:8,
        borderBottomColor:DefaultTheme.colors.whites.tier,
        borderBottomWidth:1
    },
    body_title:{
        fontFamily:'Quicksand-bold',
        fontSize:DefaultTheme.fontSizes.normal,
        color:DefaultTheme.colors.whites.full,
        marginBottom:8
    },
    body_link:{
        color:DefaultTheme.colors.primary,
        fontFamily:'Quicksand-regular',
        fontSize:DefaultTheme.fontSizes.small,
        marginBottom:16
    },

    modal_buttons:{
        flexDirection:'row',
        width:"100%",
        justifyContent:'space-between',
        marginVertical:8
    },
    modal_btn:{
        alignItems:'center'
    },
    btn_container:{
        width:48,
        height:48,
        backgroundColor:DefaultTheme.colors.whites.tier,
        borderRadius:360,
        alignItems:'center',
        justifyContent:'center',
        marginBottom:8
    },
    btn_img:{
        width:24,
        height:24,
        tintColor:"#fff",
        resizeMode:'contain'
    },
    btn_label:{
        fontSize:DefaultTheme.fontSizes.tiny,
        fontFamily:'Quicksand-bold',
        color:DefaultTheme.colors.whites.mid
    }







})