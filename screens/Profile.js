import React, {useState, useEffect} from 'react'
import { View, Text, Image, SafeAreaView, TextInput, StyleSheet, TouchableOpacity, ScrollView, Dimensions, FlatList } from 'react-native'

import {globalStyles} from './../assets/styles/global.style'
import {DefaultTheme} from './../theme/default'

import Header from './../components/_header/Header'
import SinglePost from './../components/_posts/SinglePost'

import {getCachedUser, logOutUser} from './../database/users.db'
import {getPosts} from './../database/posts.db.js'
import PostModal from './../components/_posts/PostModal';
import ProfileActions from './ProfileActions'

export default function Profile() {

    const [isLoading, setIsLoading] = useState(true)
    const [user, setUser] = useState(null)
    const [posts, setPosts] = useState(null)

    const [modalVisible, setModalVisible] = useState(false)
    const [modalPost, setModalPost] = useState(null)

    const [profileActionsVisible, setProfileActionsVisible] = useState(true)
    const [profileActionContent, setProfileActionContent] = useState(null)

    useEffect(() => {
        getCachedUser().then(val => {            
            setUser(val)
            getPosts({category:"singleUser", callerID:val.id})
            .then((docs)=>{
                setPosts(docs)
                setIsLoading(false)
            })
        })
        

    }, [])

    if(isLoading) return null

    // ====================================================================
    // Render posts
    // ====================================================================
    const renderPosts = ({item, index}) => {
        return <SinglePost
            post={item}
            onTap={()=>{ setModalPost(item); setModalVisible(true); }}
            onTapProfile={(id)=> {navigation.navigate('ProfileOther', {id:id})}}
        />
    }

    return (
        <SafeAreaView style={globalStyles.safeArea}>
            <View style={{flex:1}}>

                <Header
                    isShaareButtonVisible={false}
                    areProfileButtonsVisible={true}
                    onProfileAction={(action)=>{ setProfileActionContent(action); setProfileActionsVisible(true) }}
                />
                <ScrollView>

                    <View style={styles.profile_header}>
                        <Image source={{uri: user.data.profilePicture}} style={styles.profilepicture} />
                        <Text style={styles.handle}>{user.data.handle}</Text>
                        <Text style={styles.username}>@{user.data.username}</Text>
                        <View style={styles.reactions}>
                            <Text style={styles.reaction}>{user.data.reactions[0]}</Text>
                            <Text style={styles.reaction}>{user.data.reactions[1]}</Text>
                            <Text style={styles.reaction}>{user.data.reactions[2]}</Text>
                            <Text style={styles.reaction}>{user.data.reactions[3]}</Text>
                            <Text style={styles.reaction}>{user.data.reactions[4]}</Text>
                        </View>
                    </View>

                    <FlatList 
                        data={posts}
                        renderItem={renderPosts}
                        keyExtractor={item => item.post.id}
                        showsVerticalScrollIndicator={false}
                        horizontal={false}
                        numColumns={2}
                    />
                </ScrollView>
                
                
            </View>
            <PostModal
                isOpen={modalVisible}
                post={modalPost}
                onClose={()=>{ setModalVisible(false); setModalPost(null); }}
                onTapProfile={()=>{ setModalVisible(false); setModalPost(null); }}
            />
            <ProfileActions
                isOpen={profileActionsVisible}
                onClose={()=>{setProfileActionsVisible(false); setProfileActionContent(null)}}
                contentType={profileActionContent}
            />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({

    profile_header:{
        alignItems:'center',
        marginTop:32
    },
    profilepicture: {
        width:144,
        height:144,
        resizeMode:'contain',
        borderRadius:360,
        borderWidth:3,
        borderColor:DefaultTheme.colors.primary
    },
    handle:{
        fontFamily:DefaultTheme.fonts.bold,
        fontSize:DefaultTheme.fontSizes.big,
        color:DefaultTheme.colors.whites.full,
        marginTop:8
    },
    username:{
        fontFamily:DefaultTheme.fonts.medium,
        fontSize:DefaultTheme.fontSizes.normal,
        color:DefaultTheme.colors.whites.mid,
    },
    reactions:{
        flexDirection:'row',
        justifyContent:'space-evenly',
        alignItems:'center',
        width:"100%",
        paddingHorizontal:32,
        marginVertical:16
    },
    reaction:{
        fontSize:DefaultTheme.fontSizes.super
    },

})
