import React, {useState, useEffect} from 'react'
import { View, Text, Image, SafeAreaView, TextInput, StyleSheet, TouchableOpacity, ScrollView, Dimensions, FlatList, Modal } from 'react-native'

import {getCachedUser} from './../../database/users.db'
import {getPosts} from './../../database/posts.db'

import SinglePost from './../../components/_posts/SinglePost'
import ViewLoader from './../../components/_loaders/ViewLoader'

import {globalStyles} from '../../assets/styles/global.style'
import {DefaultTheme} from '../../theme/default'


export default function Bookmarked({navigation}) {

    const [isLoading, setIsLoading] = useState(true)
    const [posts, setPosts] = useState(null)

    useEffect(() => {
        getCachedUser().then(val => {      
            const saved = val.data.saved
            getPosts({category:"all"})
            .then(docs => {
                const savedposts = docs.filter(d => saved.includes(d.post.id))
                savedposts.length > 0 ? setPosts(savedposts) : setPosts("empty")
            })
        })
        

    }, [])

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

    // ====================================================================
    // No results view
    // ====================================================================
    const NoResults = () => {
        return(
            <View style={{ flex:1, alignItems:'center', justifyContent:'center' }}>
                <Text style={{ fontFamily:DefaultTheme.fonts.bold, color:DefaultTheme.colors.whites.full, fontSize:DefaultTheme.fontSizes.medium }}>Yikes! 😳</Text>
                <Text style={{ fontFamily:DefaultTheme.fonts.medium, color:DefaultTheme.colors.whites.mid, fontSize:DefaultTheme.fontSizes.medium, paddingHorizontal:"20%", textAlign:'center' }}>Looks like you haven't saved anything yet.</Text>
            </View>
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            {!posts ? <ViewLoader/> : null}
            {posts === "empty" ?
                <NoResults/> :
                <FlatList 
                    data={posts}
                    renderItem={renderPosts}
                    keyExtractor={item => item.post.id}
                    showsVerticalScrollIndicator={false}
                    horizontal={false}
                    numColumns={2}
                />
            }

        </SafeAreaView>
    )
}

const styles = StyleSheet.create({

    container:{
        flex:1,
        backgroundColor:DefaultTheme.colors.dark,
        position:'relative',
    },

})
