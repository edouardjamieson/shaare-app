import React,{ useState, useEffect, useRef } from 'react'
import { StyleSheet, Text, View, Image, TouchableOpacity, Animated, SafeAreaView, Linking, Modal } from 'react-native'
import { WebView } from 'react-native-webview';
import { DefaultTheme } from '../../theme/default'
import { Dimensions } from 'react-native';
import { Easing } from 'react-native-reanimated';
import GestureRecognizer from 'react-native-swipe-gestures';

import {getCachedUser, getUserById} from './../../database/users.db'
import {reactToPost} from './../../database/posts.db'

export default function PostModal({post, isOpen, onClose, onTapProfile, onReact}) {

    
    if(!post) return null
    const [isLoading, setIsLoading] = useState(true)

    // ====================================================================
    // Reactions
    // ====================================================================
    const [hasReacted, setHasReacted] = useState(null)
    const [reactBtnDisabled, setReactBtnDisabled] = useState(false)
    const [loggedUserID, setLoggedUserID] = useState(null)
    useEffect(() => {
        getCachedUser().then(val => {
            setLoggedUserID(val.id)
            const user_reaction = post.post.data.reactions.filter(r => r.uid === val.id)
            if(user_reaction.length > 0){
                setHasReacted(user_reaction[0])
                setIsLoading(false)
            }else{
                setHasReacted(0)
                setIsLoading(false)
            }
        })
    }, [])

    const GetReactions = () => {
        if(hasReacted !== 0){
            return(
                <View style={styles.reactions}>
                    <TouchableOpacity style={styles.reaction} onPress={()=> { handleReactionTap(hasReacted.reaction_index, false) }} disabled={reactBtnDisabled}>
                        <Text style={styles.reacted_icon}>{post.user.data.reactions[hasReacted.reaction_index]}</Text>
                    </TouchableOpacity>
                </View>
            )
        }else{
            return(
                <View style={styles.reactions}>
                    <TouchableOpacity style={styles.reaction} onPress={()=> { handleReactionTap(0, true) }} disabled={reactBtnDisabled}>
                        <Text style={styles.reaction_icon}>{post.user.data.reactions[0]}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.reaction} onPress={()=> { handleReactionTap(1, true) }} disabled={reactBtnDisabled}>
                        <Text style={styles.reaction_icon}>{post.user.data.reactions[1]}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.reaction} onPress={()=> { handleReactionTap(2, true) }} disabled={reactBtnDisabled}>
                        <Text style={styles.reaction_icon}>{post.user.data.reactions[2]}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.reaction} onPress={()=> { handleReactionTap(3, true) }} disabled={reactBtnDisabled}>
                        <Text style={styles.reaction_icon}>{post.user.data.reactions[3]}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.reaction} onPress={()=> { handleReactionTap(4, true) }} disabled={reactBtnDisabled}>
                        <Text style={styles.reaction_icon}>{post.user.data.reactions[4]}</Text>
                    </TouchableOpacity>
                </View>
                
            )
        }


    }

    // ====================================================================
    // Handle reactions change
    // ====================================================================
    const handleReactionTap = (i, set) => {
        setReactBtnDisabled(true)
        reactToPost(post.post.id, loggedUserID, i, set).then((result)=>{
            set === true ? setHasReacted({uid:loggedUserID, reaction_index:i}):setHasReacted(0)
            setReactBtnDisabled(false)
        })
        onReact(post.post.id, loggedUserID, i, set)
    }



    if(isLoading) return (<Text>loading...</Text>)

    

    return(
        <Modal
            visible={isOpen}
            animationType="slide"
            style={{flex:5,borderWidth:0, width:"100%"}}
            transparent={true}
        >
            <SafeAreaView style={styles.container}>
                <TouchableOpacity style={styles.exit} onPress={()=>{ onClose() }}>
                    <Image source={require('./../../assets/images/icons/exit.png')} style={styles.exit_icon} />
                </TouchableOpacity>
                {/* header */}

                <View style={styles.header}>
                    <Image style={styles.user_pic} source={{uri:post.user.data.profilePicture}}/>
                    <TouchableOpacity style={styles.user_names} onPress={()=>{ onTapProfile(post.user.id) }}>
                        <Text style={styles.user_handle}>{post.user.data.handle}</Text>
                        <Text style={styles.user_username}>@{post.user.data.username}</Text>
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
                <Text style={styles.title}>{post.post.data.meta.content_title}</Text>

                {/* post */}
                <View style={styles.post}>
                    <View style={styles.ratio}></View>
                    <View style={styles.webview}>
                        <WebView
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
                                        <iframe src="${post.post.data.meta.preview_url}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
                                    </body>
                                </html>
                            `}}
                            style={styles.post_content}
                        />
                    </View>
                    
                </View>

                {/* reactions */}
                <GetReactions />
            </SafeAreaView>


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
    },
    reacted_icon:{
        fontSize:48,
        // transform:[{translateY:"-70%"}]
    }

})