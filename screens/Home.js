import React, {useEffect, useState} from 'react'
import {Text, View, SafeAreaView, FlatList, Alert} from 'react-native'
import Header from './../components/_header/Header'
import {globalStyles} from '../assets/styles/global.style'

import {db} from './../firebase'
import {getPosts, getSinglePost} from './../database/posts.db'

import PostModal from './../components/_posts/PostModal';
import PostsCategoryList from './../components/_posts/PostsCategoryList'
import SinglePost from './../components/_posts/SinglePost'

export default function Home() {

    const [modalVisible, setModalVisible] = useState(false)
    const [modalPost, setModalPost] = useState(null)
    const [posts, setPosts] = useState(null)
    
    useEffect(() => {
        if(!posts){
            getPosts({equation:0, category:0})
            .then((docs)=>{
                setPosts(
                    docs.map((doc)=>({ id:doc.id, data:doc.data }))
                )
            }) 
        }
    }, [])
    

    const renderPosts = ({item, index}) => {
        return(
            <SinglePost
                post={item}
                longPress={()=>{ setModalPost(item); setModalVisible(true); }}
            />
        )
    }

    if(!posts){
        return (
            <SafeAreaView style={globalStyles.safeArea}>
                <View style={globalStyles.page}>
                    <Header/>
                    <Text style={{fontSize:50, color:"#fff"}}>Loading...</Text>
                        
                </View>
            </SafeAreaView>
        )
    }else{
        return(
            <SafeAreaView style={globalStyles.safeArea}>
                <View style={{flex:1}}>
                    <Header/>
    
                    <PostsCategoryList/>
    
                    <FlatList 
                        data={posts}
                        renderItem={renderPosts}
                        keyExtractor={post => post.id}
                        key={post => post.id}
                        showsVerticalScrollIndicator={false}
                    />
                        
                </View>
                {/* <PostModal
                    isOpen={modalVisible}
                    post={modalPost}
                    onClose={()=>{ setModalVisible(false); setModalPost(null); }}
                /> */}
            </SafeAreaView>
        )
    }

}
