import React, {useEffect, useState, useCallback} from 'react'
import {Text, View, SafeAreaView, FlatList, Alert, Modal} from 'react-native'
import Header from './../components/_header/Header'
import {globalStyles} from '../assets/styles/global.style'

import {db} from './../firebase'
import {getPosts, getSinglePost} from './../database/posts.db'
import {getCachedUser} from './../database/users.db'

import PostModal from './../components/_posts/PostModal';
import PostsCategoryList from './../components/_posts/PostsCategoryList'
import SinglePost from './../components/_posts/SinglePost'
import { DefaultTheme } from '../theme/default'

export default function Home({navigation}) {

    const [modalVisible, setModalVisible] = useState(false)
    const [modalPost, setModalPost] = useState(null)
    const [posts, setPosts] = useState(null)
    const [category, setCategory] = useState("none")
    
    // ====================================================================
    // Builds posts list after render
    // ====================================================================
    useEffect(() => {
        if(!posts){
            getPosts({category:category})
            .then((docs)=>{
                setPosts(docs)
            }) 
        }

        getCachedUser().then(val => {console.log(`Currently logged has ${val.data.handle} (@${val.data.username})`)})
    }, [])

    // ====================================================================
    // Builds posts list on category change
    // ====================================================================
    const changeCategory = (cat) => {
        setCategory(cat)
        getPosts({category:cat})
        .then((docs)=>{
            docs ? setPosts(docs) : setPosts("empty")
            
        }) 
    }

    // ====================================================================
    // Handle reaction changes
    // ====================================================================
    const reactionHanlder = (postID, userID, i, set) => {
        let reacted_post = posts.filter(p => p.post.id === postID)[0]
        let reactions = reacted_post.post.data.reactions
        set === true ? reactions = [{uid:userID, reaction_index:i}, ...reactions] : reactions = reactions.filter(r => r.uid !== userID)
        setPosts(posts.filter((p)=>{
            if(p.post.id === postID){
                p.post.data.reactions = reactions
            }
            return p
        }))
    }
    

    // ====================================================================
    // Renders single post
    // ====================================================================
    const renderPosts = useCallback(
        ({item, index}) => 
            <SinglePost
                post={item}
                onTap={()=>{ setModalPost(item); setModalVisible(true); }}
                onTapProfile={(id)=> {navigation.navigate('ProfileOther', {id:id})}}
            />
        ,[] 
    )

    // ====================================================================
    // No results view
    // ====================================================================
    const NoResults = () => {
        return(
            <View style={{ flex:1, alignItems:'center', justifyContent:'center' }}>
                <Text style={{ fontFamily:DefaultTheme.fonts.bold, color:DefaultTheme.colors.whites.full, fontSize:DefaultTheme.fontSizes.medium }}>Yikes! 😳</Text>
                <Text style={{ fontFamily:DefaultTheme.fonts.medium, color:DefaultTheme.colors.whites.mid, fontSize:DefaultTheme.fontSizes.medium, paddingHorizontal:"20%", textAlign:'center' }}>Looks like there are no results for this.</Text>
            </View>
        )
    }

    // ====================================================================
    // Loading view
    // ====================================================================
    const LoadingView = () => {
        return(
            <View style={{ flex:1, alignItems:'center', justifyContent:'center' }}>
                <Text style={{ fontFamily:DefaultTheme.fonts.bold, color:DefaultTheme.colors.whites.full, fontSize:DefaultTheme.fontSizes.medium }}>Yikes! 😳</Text>
            </View>
        )
    }

    // ====================================================================
    // Render
    // ====================================================================
    return(
        <SafeAreaView style={globalStyles.safeArea}>
            <View style={{flex:1}}>
                <Header isShaareButtonVisible={true} onPressShaare={()=>{ navigation.navigate('Shaare') }}/>
                <PostsCategoryList onChange={ (cat)=>{ changeCategory(cat.set_to) } }/>

                {!posts ? <Text style={{fontSize:50, color:"red"}}>XD</Text> : null}
    
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
                        
            </View>
            <PostModal
                isOpen={modalVisible}
                post={modalPost}
                onClose={()=>{ setModalVisible(false); setModalPost(null); }}
                onTapProfile={(id)=>{setModalVisible(false);navigation.navigate('ProfileOther', {id:id})}}
                onReact={(postID, userID, i, set)=>{ reactionHanlder(postID, userID, i, set) }}
            />
        </SafeAreaView>
    )
    

}
