import React, {useEffect, useState} from 'react'
import {Text, View, SafeAreaView, FlatList, Alert} from 'react-native'
import Header from './../components/_header/Header'
import {globalStyles} from '../assets/styles/global.style'

import {db} from './../firebase'
import {getPosts, getSinglePost} from './../database/posts.db'

import PostModal from './../components/_posts/PostModal';
import PostsCategoryList from './../components/_posts/PostsCategoryList'
import SinglePost from './../components/_posts/SinglePost'
import { DefaultTheme } from '../theme/default'

export default function Home() {

    const [modalVisible, setModalVisible] = useState(false)
    const [modalPost, setModalPost] = useState(null)
    const [posts, setPosts] = useState(null)
    
    // ====================================================================
    // Builds posts list after render
    // ====================================================================
    useEffect(() => {
        if(!posts){
            getPosts({category:"none"})
            .then((docs)=>{
                setPosts(
                    docs.map((doc)=>({ id:doc.id, data:doc.data }))
                )
            }) 
        }
    }, [])

    // ====================================================================
    // Rebuilds posts list on demande
    // ====================================================================
    const buildList = ({ category, equation }) => {

        setPosts(null)
        
        if(category === "none"){
            //for me
            getPosts({category:"none"})
            .then((docs)=>{
                setPosts(
                    docs.map((doc)=>({ id:doc.id, data:doc.data }))
                )
            })


        }else{
            //category
            getPosts({category:category})
            .then((docs)=>{
                if(docs === 0) return setPosts("empty")
                setPosts(
                    docs.map((doc)=>({ id:doc.id, data:doc.data }))
                )
            })

        }


    }
    

    // ====================================================================
    // Renders single post
    // ====================================================================
    const renderPosts = ({item, index}) => {
        return(
            <SinglePost
                post={item}
                longPress={()=>{ setModalPost(item); setModalVisible(true); }}
            />
        )
    }

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

    return(
        <SafeAreaView style={globalStyles.safeArea}>
            <View style={{flex:1}}>
                <Header/>
                <PostsCategoryList onChange={ (cat)=>{ buildList({category:cat.set_to}) } }/>

                {!posts ? <Text style={{fontSize:50, color:"red"}}>XD</Text> : null}
    
                {posts === "empty" ?
                    <NoResults/> :
                    <FlatList 
                        data={posts}
                        renderItem={renderPosts}
                        keyExtractor={post => post.id}
                        key={post => post.id}
                        showsVerticalScrollIndicator={false}
                    />
                }
                        
            </View>
            <PostModal
                isOpen={modalVisible}
                post={modalPost}
                onClose={()=>{ setModalVisible(false); setModalPost(null); }}
            />
        </SafeAreaView>
    )
    

}
