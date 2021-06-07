import { LinearGradient } from 'expo-linear-gradient'
import React, { useState, useEffect } from 'react'
import { View, Text, Image, SafeAreaView, TextInput, StyleSheet, FlatList, Dimensions } from 'react-native'

import {globalStyles} from '../assets/styles/global.style'
import { DefaultTheme } from '../theme/default'
import Header from './../components/_header/Header'
import ViewLoader from './../components/_loaders/ViewLoader'

import { getPopularKeywords } from './../database/keywords.db'

export default function Search() {

    const [keywords, setKeywords] = useState(null)

    useEffect(() => {
        
        getPopularKeywords()
        .then((keyword)=>{
            setKeywords(keyword)
        })

    }, [])

    // ====================================================================
    // Render keywords
    // ====================================================================
    const renderKeywords = ({item, index}) => {
        return (
        <LinearGradient colors={DefaultTheme.colors.mainGradientArray} style={styles.keyword}>
            <Text style={styles.keyword_count}>{item[1]}</Text>
            <Text style={styles.keyword_title}>{item[0]}</Text>
        </LinearGradient>
        )
    }

    return (
        <SafeAreaView style={globalStyles.safeArea}>
            <View style={globalStyles.page, {flex:1}}>
                <Header isShaareButtonVisible={true}/>
                <View style={styles.content}>

                    <Text style={styles.title}>Trending keywords</Text>
                    <FlatList
                        data={keywords}
                        renderItem={renderKeywords}
                        keyExtractor={item => item[0]}
                        showsVerticalScrollIndicator={false}
                        horizontal={false}
                        numColumns={2}
                        style={{flex:1}}
                    />


                </View>
                
                        
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
        fontSize:DefaultTheme.fontSizes.big
    },

    keyword: {
        width:((Dimensions.get('screen').width-48)/2),
        marginRight:16,
        marginTop:16,
        borderRadius:15,
        padding:16
    },
    keyword_count: {
        fontFamily:DefaultTheme.fonts.bold,
        color:DefaultTheme.colors.whites.mid,
        fontSize:DefaultTheme.fontSizes.tiny
    },
    keyword_title: {
        fontFamily:DefaultTheme.fonts.bold,
        color:DefaultTheme.colors.whites.full,
        fontSize:DefaultTheme.fontSizes.medium
    }
})

