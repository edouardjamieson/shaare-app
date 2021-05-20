import React, {useEffect, useState, useCallback} from 'react'
import {Text, View, SafeAreaView, FlatList, Alert, Modal, RefreshControl} from 'react-native'
import Header from './../components/_header/Header'
import {globalStyles} from '../assets/styles/global.style'

import {getPosts} from './../database/posts.db'
import {getCachedUser} from './../database/users.db'

import PostsCategoryList from './../components/_posts/PostsCategoryList'
import SinglePost from './../components/_posts/SinglePost'
import { DefaultTheme } from '../theme/default'

export default function Home({navigation}) {

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
    // On refresh
    // ====================================================================
    const onRefresh = () => {
        getPosts({category:category})
        .then((docs)=>{
            docs ? setPosts(docs) : setPosts("empty")
            
        }) 
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

                {!posts ? <LoadingView/> : null}
    
                {posts === "empty" ?
                    <NoResults/> :
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
                    />
                }
                        
            </View>
        </SafeAreaView>
    )
    

}
