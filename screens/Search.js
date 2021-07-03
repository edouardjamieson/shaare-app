import React, { useState } from 'react'
import { View, Text, Image, SafeAreaView, TextInput, StyleSheet, FlatList } from 'react-native'

import {globalStyles} from '../assets/styles/global.style'
import { DefaultTheme } from '../theme/default'
import Header from './../components/_header/Header'
import SinglePost from '../components/_posts/SinglePost'

import {searchPosts} from './../database/posts.db'

export default function Search({navigation}) {

    const [searchString, setSearchString] = useState("")
    const [results, setResults] = useState([])

    const handleTyping = (e) => {
        if(e.length === 0){
            setResults([])
        }else{
            searchPosts(e)
            .then(data => setResults(data))
        }

        setSearchString(e)
        
    }

    const EmptyString = () => {
        return(
            <View style={styles.empty}>
                <Text style={styles.empty_first}>It's up to you!</Text>
                <Text style={styles.empty_second}>Start typing to see results</Text>
            </View>
        )
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
                <Header/>
                <View style={styles.search}>
                    <Image source={require('./../assets/images/icons/search.png')} style={styles.search_icon} />
                    <TextInput
                        style={styles.input}
                        value={searchString}
                        onChangeText={handleTyping}
                        placeholder="Type keywords here (Ex: Planet)"
                        autoCompleteType="off"
                        autoFocus={true}
                        placeholderTextColor={DefaultTheme.colors.whites.mid}
                        keyboardAppearance="dark"
                        underlineColorAndroid="transparent"
                    />
                </View>

                { results.length > 0 ?
                <FlatList 
                    data={results}
                    renderItem={renderPosts}
                    keyExtractor={item => item.post.id}
                    showsVerticalScrollIndicator={false}
                    horizontal={false}
                    numColumns={2}
                />: <EmptyString/> }
                        
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    search: {
        marginHorizontal:16,
        backgroundColor:DefaultTheme.colors.whites.tier,
        borderRadius:100,
        flexDirection:'row',
        alignItems:'center',
        paddingHorizontal:16
    },
    search_icon:{
        width:18,
        height:18,
        tintColor:DefaultTheme.colors.whites.full,
        marginRight:16
    },

    input:{
        width:"100%",
        fontSize:DefaultTheme.fontSizes.normal,
        borderWidth:0,
        fontFamily:DefaultTheme.fonts.medium,
        color:DefaultTheme.colors.whites.full,
        paddingVertical:10,
        // outlineWidth:0
    },

    empty: {
        flex:2,
        alignItems:'center',
        justifyContent:'center',
    },
    empty_first:{
        fontFamily:DefaultTheme.fonts.bold,
        fontSize:DefaultTheme.fontSizes.medium,
        color:DefaultTheme.colors.whites.full,
        marginBottom:8
    },
    empty_second:{
        fontFamily:DefaultTheme.fonts.medium,
        fontSize:DefaultTheme.fontSizes.medium,
        color:DefaultTheme.colors.whites.mid
    }



})

