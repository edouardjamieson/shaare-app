import React, {useState, useEffect} from 'react'
import { View, Text, Image, SafeAreaView, TextInput, StyleSheet, TouchableOpacity, ScrollView, Dimensions, FlatList, RefreshControl } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient';

import {globalStyles} from '../../assets/styles/global.style'
import {DefaultTheme} from '../../theme/default'

import Header from '../../components/_header/Header'
import ViewLoader from './../../components/_loaders/ViewLoader'
import SinglePost from '../../components/_posts/SinglePost'
import ActionSheet from './../../components/_actions/ActionSheet'

import {getCachedUser, getUserById, followUser} from '../../database/users.db'
import {getPosts} from '../../database/posts.db.js'

export default function ProfileOther({route, navigation}) {

    const [isLoading, setIsLoading] = useState(true)
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [user, setUser] = useState(null)
    const [posts, setPosts] = useState(null)
    const [loggedUser, setLoggedUser] = useState(null)
    const [followsUser, setFollowsUser] = useState(null)

    useEffect(() => {
        getUserById(route.params.id).then(val => {       
            setUser(val)
            getPosts({category:"singleUser", callerID:val.id})
            .then((docs)=>{
                setPosts(docs)
            })
            getCachedUser().then(cu => {
                if(cu.id === val.id) navigation.navigate('Profile')
                cu.data.follows.includes(val.id) ? setFollowsUser(true):setFollowsUser(false)
                setLoggedUser(cu)
                setIsLoading(false)
            })
        })
        

    }, [])

    // ====================================================================
    // MODAL
    // ====================================================================
    const [actionSheetVisible, setActionSheetVisible] = useState(false)
    const actionsHandler = (action) => {
        
        switch (action) {
            case 'report':
                setActionSheetVisible(false)
                navigation.navigate('Report', {type:'user', content:user})
                break;
            case 'block':
                handleDelete()
                break;
            default:
                setActionSheetVisible(false)
                break;
        }
    }

    // ====================================================================
    // Handle user follow
    // ====================================================================
    const handleUserFollow = () => {
        let set = followsUser === true ? false : true
        followUser(loggedUser.id, user.id, set).then(()=>{
            setFollowsUser(set)
        })
    }

    
    // ====================================================================
    // Render posts
    // ====================================================================
    const renderPosts = ({item, index}) => {
        return <SinglePost
        post={item}
        onTap={()=>{ navigation.navigate('PostDetails', { post:item }) }}
        onTapProfile={(id)=> {navigation.navigate('ProfileOther', {id:id})}}
        profileBtnVisible={false}
        />
    }
    if(isLoading) return <ViewLoader />

    return (
        <SafeAreaView style={globalStyles.safeArea}>
            <View style={{flex:1}}>
                <ScrollView>

                    <View style={styles.profile_header}>
                        <Image source={{uri: user.data.profilePicture}} style={styles.profilepicture} />
                        <Text style={styles.username}>@{user.data.username}</Text>
                        <View style={{flexDirection:'row', alignItems:'center'}}>
                            <Text style={styles.handle}>{user.data.handle}</Text>
                            {user.data.role !== 'user' ?
                                <Image source={user.data.role === 'validated' ? require(`./../../assets/images/icons/validated-icon.png`):require(`./../../assets/images/icons/admin-icon.png`)} style={[styles.special_icon, {tintColor: user.data.role === "validated" ? "#5352ed" : DefaultTheme.colors.primary}]} />
                            : null}   
                        </View>
                        <View style={{flexDirection:'row', alignItems:'center', marginVertical:8}}>
                            {
                                followsUser ?
                                <TouchableOpacity style={styles.unfollowButton} onPress={()=>{ handleUserFollow() }}>
                                    <Text style={styles.unfollow_text}>Unfollow @{user.data.username}</Text>
                                </TouchableOpacity>:
                                <TouchableOpacity style={styles.followButton} onPress={()=>{ handleUserFollow() }}>
                                    <LinearGradient
                                        style={styles.follow_gradient}
                                        colors={DefaultTheme.colors.mainGradientArray}
                                    >
                                        <Text style={styles.follow_text}>Follow @{user.data.username}</Text>
                                    </LinearGradient>
                                </TouchableOpacity>
                            }
                            <TouchableOpacity style={styles.moreButton} onPress={()=> setActionSheetVisible(true)}>
                                <Image source={require('./../../assets/images/icons/dots_circle.png')} style={styles.moreButton_icon} />
                            </TouchableOpacity>
                        </View>
                        
                        {user.data.bio.length > 0 ? <View style={styles.bioContainer}><Text style={styles.bio}>{user.data.bio}</Text></View> : null}
                        
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

            {/* Action sheet */}
            <ActionSheet isVisible={actionSheetVisible} dispatchAction={(action)=>{actionsHandler(action)}}
                content={[
                        {
                            icon:require('./../../assets/images/icons/alert.png'),
                            title:'Report user',
                            action:'report'
                        },
                        {
                            icon:require('./../../assets/images/icons/block.png'),
                            title:'Block user',
                            action:'block'
                        },
                    ]}
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
        width:172,
        height:172,
        resizeMode:'cover',
        borderRadius:360,
        borderWidth:3,
        borderColor:DefaultTheme.colors.primary,
        marginBottom:8
    },
    special_icon:{
        width:24,
        height:24,
        resizeMode:'contain',
        display:'flex',
        marginLeft:8
    },
    handle:{
        fontFamily:DefaultTheme.fonts.bold,
        fontSize:DefaultTheme.fontSizes.big,
        color:DefaultTheme.colors.whites.full,
    },
    username:{
        marginBottom:8,
        fontFamily:DefaultTheme.fonts.medium,
        fontSize:DefaultTheme.fontSizes.normal,
        color:DefaultTheme.colors.whites.mid,
    },
    bioContainer: {
        width:Dimensions.get('window').width - 64,
        backgroundColor:DefaultTheme.colors.whites.quin,
        borderRadius:15,
        marginHorizontal:32,
        padding:8,
        marginTop:8
    },
    bio:{
        fontFamily:DefaultTheme.fonts.medium,
        fontSize:DefaultTheme.fontSizes.normal,
        color:DefaultTheme.colors.whites.full,
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
    followButton:{
        borderRadius:20,
        overflow:'hidden',
    },
    follow_gradient:{
        width:"100%",
        paddingVertical:6,
        paddingHorizontal:15,
    },
    follow_text: {
        fontSize:DefaultTheme.fontSizes.normal,
        fontFamily:DefaultTheme.fonts.bold,
        color:DefaultTheme.colors.whites.full,
    },
    unfollowButton:{
        borderRadius:20,
        overflow:'hidden',
        borderColor:DefaultTheme.colors.primary,
        borderWidth:2,
        paddingVertical:6,
        paddingHorizontal:15,
    },
    unfollow_text: {
        fontSize:DefaultTheme.fontSizes.normal,
        fontFamily:DefaultTheme.fonts.bold,
        color:DefaultTheme.colors.primary,
    },
    moreButton: {
        marginLeft:8
    },
    moreButton_icon:{
        tintColor:DefaultTheme.colors.whites.mid,
        height:32,
        width:32,
        resizeMode:'contain'
    }

})
