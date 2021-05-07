import React from 'react'
import { View, Text, Image, SafeAreaView, TextInput, StyleSheet, TouchableOpacity } from 'react-native'

import {globalStyles} from './../assets/styles/global.style'
import {DefaultTheme} from './../theme/default'

import Header from './../components/_header/Header'

import {logOutUser} from './../database/users.db'

export default function Profile() {
    return (
        <SafeAreaView style={globalStyles.safeArea}>
            <View style={{flex:1}}>

                <Header isShaareButtonVisible={false} areProfileButtonsVisible={true}/>
                
                
            </View>
        </SafeAreaView>
    )
}
