import React, { useState, useEffect } from 'react'
import { View, Text, Image, SafeAreaView, TextInput, StyleSheet } from 'react-native'

import {globalStyles} from '../assets/styles/global.style'
import { DefaultTheme } from '../theme/default'
import Header from './../components/_header/Header'

import { getPopularKeywords } from './../database/keywords.db'

export default function Search() {

    useEffect(() => {
        
        // getPopularKeywords()

    }, [])

    return (
        <SafeAreaView style={globalStyles.safeArea}>
            <View style={globalStyles.page, {flex:1}}>
                <Header/>
                
                        
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    



})

