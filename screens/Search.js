import React, { useState } from 'react'
import { View, Text, Image, SafeAreaView, TextInput, StyleSheet } from 'react-native'

import {globalStyles} from '../assets/styles/global.style'
import { DefaultTheme } from '../theme/default'
import Header from './../components/_header/Header'
import {db} from './../firebase'

export default function Search() {

    const [searchString, setSearchString] = useState("")

    let searchTimer
    const handleTyping = (e) => {
        //clears timeout
        clearTimeout(searchTimer)
        //setTimers
        searchTimer = setTimeout(()=>{ handleSearch(e) }, 500);


        setSearchString(e)
        
    }
    
    const handleSearch = (e) => {
        console.log(e);
        console.log(searchTimer);
    }

    const EmptyString = () => {
        return(
            <View style={styles.empty}>
                <Text style={styles.empty_first}>It's up to you!</Text>
                <Text style={styles.empty_second}>Start typing to see results</Text>
            </View>
        )
    }

    const Results = () => {
        return(

            <Text>
                yo
            </Text>
        )
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

                { searchString.length > 0 ? <Results/> : <EmptyString/> }
                        
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

