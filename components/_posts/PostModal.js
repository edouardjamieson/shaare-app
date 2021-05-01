import React,{ useState, useEffect, useRef } from 'react'
import { StyleSheet, Text, View, Image, TouchableOpacity, Animated, SafeAreaView, Linking, Modal } from 'react-native'
import { WebView } from 'react-native-webview';
import { DefaultTheme } from '../../theme/default'
import { Dimensions } from 'react-native';
import { Easing } from 'react-native-reanimated';
import GestureRecognizer from 'react-native-swipe-gestures';

import {getUserById} from './../../database/users.db'

export default function PostModal({post, isOpen, onClose, onTapProfile}) {

    
    if(!post) return null
    // ====================================================================
    // Get author details
    // ====================================================================
    const [author, setAuthor] = useState(null)
    getUserById(post.data.author).then((result)=> {
        setAuthor(result)
    })



    // if(!author) return null

    return(
        <Modal
            visible={isOpen}
            animationType="slide"
            style={{flex:5,borderWidth:0, width:"100%"}}
            transparent={true}
        >
            {author !== null ?
            <SafeAreaView style={styles.container}>
                <TouchableOpacity style={styles.exit} onPress={()=>{ onClose() }}>
                    <Image source={require('./../../assets/images/icons/exit.png')} style={styles.exit_icon} />
                </TouchableOpacity>
                {/* header */}

                <View style={styles.header}>
                    <Image style={styles.user_pic} source={{uri:'https://thumbs-prod.si-cdn.com/0Hlhw9KPW6kA8-zuSeBrgg0ztfQ=/fit-in/1600x0/filters:focal(582x120:583x121)/https://public-media.si-cdn.com/filer/d6/7d/d67d186f-f5f3-4867-82c5-2c772120304f/thanos-snap-featured-120518-2.jpg'}}/>
                    <TouchableOpacity style={styles.user_names} onPress={()=>{ onTapProfile(post.id) }}>
                        <Text style={styles.user_handle}>{author.handle}</Text>
                        <Text style={styles.user_username}>@{author.username}</Text>
                    </TouchableOpacity>

                    <View style={styles.header_btns}>
                        <TouchableOpacity style={styles.header_btn}>
                            <Image source={require('./../../assets/images/icons/bookmark.png')} style={styles.header_btn_icon} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.header_btn}>
                            <Image source={require('./../../assets/images/icons/follow_user.png')} style={styles.header_btn_icon} />
                        </TouchableOpacity>
                    </View>
                </View>
                <Text style={styles.title}>{post.data.meta.content_title}</Text>

                {/* post */}
                <View style={styles.post}>
                    <View style={styles.ratio}></View>
                    <View style={styles.webview}>
                        {/* <WebView
                            allowFileAccess={false}
                            originWhitelist={['*']}
                            source={{html: `
                                <!DOCTYPE html>
                                <html>
                                    <head>
                                        <meta charset='utf-8'/>
                                        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
                                        <style>
                                        * {margin:0; padding:0}
                                        html{height:100%;width:100%;overflow:hidden}
                                        body{height:100%;width:100%;overflow:hidden}
                                        iframe {height:101%;width:100%;overflow:hidden}
                                        </style>
                                    </head>
                                    <body>
                                        <iframe src="${post.data.meta.preview_url}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
                                    </body>
                                </html>
                            `}}
                            style={styles.post_content}
                        /> */}
                    </View>
                    
                </View>

                {/* reactions */}
                <View style={styles.reactions}>
                    <TouchableOpacity style={styles.reaction}>
                        <Text style={styles.reaction_icon}>{author.reactions[0]}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.reaction}>
                        <Text style={styles.reaction_icon}>{author.reactions[1]}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.reaction}>
                        <Text style={styles.reaction_icon}>{author.reactions[2]}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.reaction}>
                        <Text style={styles.reaction_icon}>{author.reactions[3]}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.reaction}>
                        <Text style={styles.reaction_icon}>{author.reactions[4]}</Text>
                    </TouchableOpacity>
                </View>

            </SafeAreaView>:<Text>yo</Text> }


        </Modal>
    )

}

const styles = StyleSheet.create({

    container:{
        flex:1,
        backgroundColor:DefaultTheme.colors.darks.quad,
        justifyContent:'center',
        position:'relative'
    },
    exit:{
        width:32,
        height:32,
        borderRadius:100,
        alignItems:'center',
        justifyContent:'center',
        position:'absolute',
        bottom:"100%",
        right:16
    },
    exit_icon:{
        tintColor:DefaultTheme.colors.whites.full,
        width:32,
        height:32,
        resizeMode:'contain'
    },

    header:{
        width:"100%",
        flexDirection:'row',
        alignItems:'center',
        paddingHorizontal:16
    },
    user_pic:{
        width:48,
        height:48,
        borderRadius:100,
        resizeMode:'cover',
        marginRight:16
    },
    user_names:{
        justifyContent:'center'
    },
    user_handle:{
        fontFamily:DefaultTheme.fonts.bold,
        fontSize:DefaultTheme.fontSizes.medium,
        color:DefaultTheme.colors.whites.full,
    },
    user_username:{
        fontFamily:DefaultTheme.fonts.medium,
        fontSize:DefaultTheme.fontSizes.small,
        color:DefaultTheme.colors.whites.tier,
    },
    
    header_btns:{
        flexDirection:'row',
        alignItems:'center',
        marginLeft:'auto',
    },
    header_btn:{
        marginLeft:8,
        backgroundColor:DefaultTheme.colors.whites.tier,
        alignItems:'center',
        justifyContent:'center',
        height:40,
        width:40,
        borderRadius:100
    },
    header_btn_icon:{
        width:24,
        height:24,
        tintColor:DefaultTheme.colors.whites.full,
        resizeMode:'contain'
    },

    title:{
        fontFamily:DefaultTheme.fonts.medium,
        fontSize:DefaultTheme.fontSizes.medium,
        color:DefaultTheme.colors.whites.full,
        paddingHorizontal:16,
        marginTop:8
    },


    post:{
        position:'relative',
        backgroundColor:'red',
        margin:16,
        borderRadius:35,
        overflow:'hidden'
    },
    ratio:{
        paddingTop:'100%',
        zIndex:1
    },
    webview:{
        position:'absolute',
        width:'100%',
        height:'100%',
        flex:1,
        zIndex:2
    },


    reactions:{
        width:"100%",
        flexDirection:'row',
        alignItems:'center',
        paddingHorizontal:16,
        justifyContent:'space-evenly'
    },
    reaction_icon:{
        fontSize:DefaultTheme.fontSizes.super
    }

})