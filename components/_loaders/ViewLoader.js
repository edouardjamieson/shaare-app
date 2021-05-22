import React from 'react'
import {View, StyleSheet, Image} from 'react-native'

export default function ViewLoader() {
    return (
        <View style={styles.container}>
            <Image source={require('./../../assets/images/loading.gif')} style={styles.loader} />
        </View>
    )
}

const styles = StyleSheet.create({

    container: {
        alignItems:'center',
        justifyContent:'center',
        position:'absolute',
        height:'100%',
        width:'100%'
    },

    loader: {
        width:52,
        height:52,
        resizeMode:'contain',
        borderRadius:100
    }

})
