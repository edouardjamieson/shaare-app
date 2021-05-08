import React, {useState, useEffect} from 'react'
import { View, Text, Image, SafeAreaView, TextInput, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native'

import {globalStyles} from './../assets/styles/global.style'
import {DefaultTheme} from './../theme/default'

import Header from './../components/_header/Header'

import {getCachedUser, logOutUser} from './../database/users.db'
import {getPosts} from './../database/posts.db.js'

export default function Profile() {

    const [isLoading, setIsLoading] = useState(true)
    const [user, setUser] = useState(null)
    const [posts, setPosts] = useState(null)

    useEffect(() => {
        getCachedUser().then(val => {
            console.log(val);
            
            setUser(val)
        })
        getPosts({category:"singleUser", calledID:user.id})
        .then((docs)=>{
            setPosts(docs)
        })
        
        setIsLoading(false)

    }, [])

    if(isLoading) return null

    return (
        <SafeAreaView style={globalStyles.safeArea}>
            <View style={{flex:1}}>

                <Header isShaareButtonVisible={false} areProfileButtonsVisible={true}/>
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
                </ScrollView>
                
                
            </View>
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
