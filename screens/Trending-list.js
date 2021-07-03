import { LinearGradient } from 'expo-linear-gradient'
import React, { useState, useEffect } from 'react'
import { View, Text, Image, SafeAreaView, TextInput, StyleSheet, FlatList, Dimensions, TouchableOpacity, RefreshControl } from 'react-native'

import {globalStyles} from '../assets/styles/global.style'
import { DefaultTheme } from '../theme/default'
import Header from './../components/_header/Header'
import ViewLoader from './../components/_loaders/ViewLoader'
import SinglePost from './../components/_posts/SinglePost'

import { getCachedUser } from './../database/users.db'
import { getPosts } from './../database/posts.db'

export default function TrendingList({route, navigation}) {

    const keyword = route.params.keyword
    const [posts, setPosts] = useState(null)

    useEffect(() => {
        
        if(!posts){
            getCachedUser().then(val => {
                getPosts({category:'all', callerID:val.id})
                .then((docs)=>{
                    docs.length > 0 ? setPosts(docs) : setPosts("empty")
                }) 
            })
        }

    }, [])

    // ====================================================================
    // Handle refresh
    // ====================================================================
    const onRefresh = () => {
        // setKeywords(null)
        // getPopularKeywords()
        // .then((keyword)=>{
        //     setKeywords(keyword)
        // })
    }

    // ====================================================================
    // Renders single post
    // ====================================================================
    const renderPosts = ({item, index}) => {
        return <SinglePost
            post={item}
            onTap={()=>{ navigation.navigate('PostDetails', { post:item }) }}
            onTapProfile={(id)=> {navigation.navigate('ProfileOther', {id:id})}}
        />
    }


    return (
        <SafeAreaView style={globalStyles.safeArea}>
            <View style={globalStyles.page, {flex:1}}>
                <Text style={styles.title}>{keyword}</Text>
                {posts ?
                <FlatList 
                    data={posts}
                    renderItem={renderPosts}
                    keyExtractor={item => item.post.id}
                    showsVerticalScrollIndicator={false}
                    horizontal={false}
                    numColumns={2}
                    refreshControl={
                        <RefreshControl
                        onRefresh={onRefresh}
                        tintColor={"#fff"}
                        colors={["#fff"]}
                        />
                    }
                />:<ViewLoader/>}
                    


                
                        
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    
    content: {
        marginHorizontal:16,
        flex:1
    },
    title: {
        fontFamily:DefaultTheme.fonts.bold,
        color:DefaultTheme.colors.whites.full,
        fontSize:DefaultTheme.fontSizes.big,
        marginBottom:8,
        marginLeft:16
    },

    keyword: {
        width:((Dimensions.get('screen').width-48)/2),
        marginRight:16,
        marginBottom:18,
        borderRadius:15,
        paddingHorizontal:16,
        paddingVertical:12
    },
    keyword_count: {
        fontFamily:DefaultTheme.fonts.bold,
        color:DefaultTheme.colors.whites.mid,
        fontSize:DefaultTheme.fontSizes.normal
    },
    keyword_title: {
        fontFamily:DefaultTheme.fonts.bold,
        color:DefaultTheme.colors.whites.full,
        fontSize:DefaultTheme.fontSizes.medium
    }
})

