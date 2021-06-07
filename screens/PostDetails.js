import React,{ useState, useEffect, useRef } from 'react'
import { Alert, StyleSheet, Text, View, Image, TouchableOpacity, Animated, SafeAreaView, Linking, Modal } from 'react-native'
import { WebView } from 'react-native-webview';
import { DefaultTheme } from './../theme/default'
import { Easing } from 'react-native-reanimated';
import CachedImage from 'react-native-expo-cached-image';

import ActionSheet from './../components/_actions/ActionSheet'
import {getCachedUser, savePost, followUser} from './../database/users.db'
import {getSinglePost, reactToPost, deletePost} from './../database/posts.db'
import {updateEquation} from './../database/equation.db'

export default function PostDetails({route, navigation}) {

    const post = route.params.post
    
    if(!post) return null
    const [isLoading, setIsLoading] = useState(true)
    const [loggedUserID, setLoggedUserID] = useState(null)

    // ====================================================================
    // Get reactions & actions
    // ====================================================================
    const [hasReacted, setHasReacted] = useState(null)
    const [reactBtnDisabled, setReactBtnDisabled] = useState(false)
    const [hasSavedPost, setHasSavedPost] = useState(null)
    const [followsUser, setFollowsUser] = useState(null)
    useEffect(() => {
        getCachedUser().then(val => {
            setLoggedUserID(val.id)

            getSinglePost({id: post.post.id})
            .then((doc)=>{
                const user_reaction = doc.data.reactions.filter(r => r.uid === val.id)
                user_reaction.length > 0 ? setHasReacted(user_reaction[0]) : setHasReacted(0)
            })

            const user_saved = val.data.saved.filter(s => s === post.post.id)
            user_saved.length > 0 ? setHasSavedPost(true) : setHasSavedPost(false)
            
            const user_follow = val.data.follows.filter(f => f === post.user.id)
            user_follow.length > 0 ? setFollowsUser(true) : setFollowsUser(false)

            setIsLoading(false)
        })
    }, [])

    // ====================================================================
    // Handle reactions change
    // ====================================================================
    const handleReactionTap = (i, set) => {
        setReactBtnDisabled(true)
        ReactAnimate()
        reactToPost(post.post.id, loggedUserID, i, set).then((result)=>{
            set === true ? setHasReacted({uid:loggedUserID, reaction_index:i}):setHasReacted(0)
            setReactBtnDisabled(false)
        })
        updateEquation(post.post.data.keyword, set == true ? 2 : -1)
    }

    // ====================================================================
    // MODAL
    // ====================================================================
    const [actionSheetVisible, setActionSheetVisible] = useState(false)
    const actionsHandler = (action) => {
        
        switch (action) {
            case 'bookmark':
                handleSavePost()
                break;
            case 'delete':
                handleDelete()
                break;
            case 'shaare':
                setActionSheetVisible(false)
                navigation.navigate('Shaare', {post:post})
                break;
            case 'report':
                setActionSheetVisible(false)
                navigation.navigate('Report', {type:'post', content:post})
                break;
            case 'exit':
                setActionSheetVisible(false)
                break;
            default:
                setActionSheetVisible(false)
                break;
        }
    }


    // ====================================================================
    // Handle post saving
    // ====================================================================
    const handleSavePost = () => {
        let set = hasSavedPost === true ? false : true
        savePost(loggedUserID, post.post.id, set).then(()=>{
            setHasSavedPost(set)
            setActionSheetVisible(false)
        })

        //EQ
        if(loggedUserID !== post.user.id){
            updateEquation(post.post.data.keyword, set == true ? 2 : -2)
        }
    }

    // ====================================================================
    // Handle user follow
    // ====================================================================
    const handleUserFollow = () => {
        let set = followsUser === true ? false : true
        followUser(loggedUserID, post.user.id, set).then(()=>{
            setFollowsUser(set)
        })
    }

    // ====================================================================
    // Handle delete
    // ====================================================================
    const handleDelete = () => {
        Alert.alert(
            "You're about to delete something!",
            "Are you sure you want to delete this?",
            [
                {text:"Never mind", style:"cancel"},
                {text:"Do it!", style:"destructive", onPress:()=>{
                    deletePost(post.post.id)
                    .then((r)=> {
                        setActionSheetVisible(false)
                        navigation.goBack()
                    })
                }}
            ]
        )

    }

    // ====================================================================
    // Animations
    // ====================================================================
    const react_anim = useRef(new Animated.Value(1)).current;
    const ReactAnimate = () => {
        Animated.timing(react_anim, {
            toValue:0,
            duration:500,
            easing:Easing.elastic(1),
            useNativeDriver:false
        }).start(({finished}) => {
            if(finished){
                Animated.timing(react_anim, {
                    toValue:1,
                    duration:500,
                    easing:Easing.elastic(1),
                    useNativeDriver:false
                }).start()
            }
        })
    }


    if(isLoading) return (<Text>loading...</Text>)

    const GetReactions = () => {
        if(loggedUserID === post.user.id) return null
        if(hasReacted !== 0){
            return(
                <Animated.View style={[styles.reactions, { opacity:react_anim, transform:[{scale:react_anim}] }]}>
                    <TouchableOpacity style={styles.reaction} onPress={()=> { handleReactionTap(hasReacted.reaction_index, false) }} disabled={reactBtnDisabled}>
                        <Text style={styles.reacted_icon}>{post.user.data.reactions[hasReacted.reaction_index]}</Text>
                    </TouchableOpacity>
                </Animated.View>
            )
        }else{
            return(
                <Animated.View style={[styles.reactions, { opacity:react_anim, transform:[{scale:react_anim}] }]}>
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
                </Animated.View>
                
            )
        }


    }

    return(
            <SafeAreaView style={styles.container}>
                {/* header */}

                <View style={styles.header}>
                    <Image style={styles.user_pic} source={{uri:post.user.data.profilePicture, cache:'force-cache'}}/>
                    <TouchableOpacity style={styles.user_names} onPress={()=>{ navigation.navigate('ProfileOther', {id:post.user.id}) }}>
                        <Text style={styles.user_handle}>{post.user.data.handle}</Text>
                        <Text style={styles.user_username}>@{post.user.data.username}</Text>
                    </TouchableOpacity>

                    <View style={styles.header_btns}>
                        {
                            loggedUserID !== post.user.id ?
                            <TouchableOpacity onPress={()=>{handleUserFollow()}} style={[styles.header_btn, { backgroundColor:followsUser ? DefaultTheme.colors.primary : DefaultTheme.colors.whites.tier, }]}>
                                <Image source={require('./../assets/images/icons/follow_user.png')} style={styles.header_btn_icon} />
                            </TouchableOpacity>
                            :null
                        }
                        <TouchableOpacity onPress={()=>{setActionSheetVisible(true)}} style={[styles.header_btn, { backgroundColor: DefaultTheme.colors.whites.tier, }]}>
                            <Image source={require('./../assets/images/icons/dots.png')} style={styles.header_btn_icon} />
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
                                        * {margin:0; padding:0; user-select:none}
                                        html{height:100%;width:100%;overflow:hidden}
                                        body{height:100%;width:100%;overflow:hidden}
                                        body > div { padding-bottom:100%!important; }
                                        img.full { width:100%; height:100%; object-fit:cover }
                                        </style>
                                    </head>
                                    <body>
                                        ${post.post.data.meta.preview ? post.post.data.meta.preview : `<img class='full' src='${post.post.data.meta.thumbnail}'>`}
                                    </body>
                                </html>
                            `}}
                            style={styles.post_content}
                        />
                    </View>
                    
                </View>

                {/* reactions */}
                {hasReacted===null ? null : <GetReactions />}

                {/* Action sheet */}
                <ActionSheet isVisible={actionSheetVisible} dispatchAction={(action)=>{actionsHandler(action)}}
                content={
                    loggedUserID === post.user.id ? [
                        {
                            icon:require('./../assets/images/icons/bookmark.png'),
                            title:hasSavedPost ? 'Remove from bookmarked posts' : 'Add to bookmarked posts',
                            action:'bookmark'
                        },
                        {
                            icon:require('./../assets/images/icons/delete.png'),
                            title:'Delete this post',
                            action:'delete'
                        },
                    ]:[
                        {
                            icon:require('./../assets/images/icons/action_back.png'),
                            title:'Shaare back',
                            action:'shaare'
                        },
                        {
                            icon:require('./../assets/images/icons/bookmark.png'),
                            title:hasSavedPost ? 'Remove from bookmarked posts' : 'Add to bookmarked posts',
                            action:'bookmark'
                        },
                        {
                            icon:require('./../assets/images/icons/alert.png'),
                            title:'Report this post',
                            action:'report'
                        },
                    ]}
                uniqueContent={
                    loggedUserID === post.user.id ? {type:'reactions', content:post.user.data.reactions.map((r, x) => {
                        return {
                            reaction:r,
                            occurence:post.post.data.reactions.filter(f => f.reaction_index === x).length
                        }
                    })}:null
                }
                

                
                />
                
            </SafeAreaView>
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
    }

})