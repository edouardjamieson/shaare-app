import React, {useState, useEffect} from 'react'
import { View, Text, Image, SafeAreaView, TextInput, StyleSheet, TouchableOpacity, ScrollView, Dimensions, FlatList, Modal } from 'react-native'

import {globalStyles} from './../assets/styles/global.style'
import {DefaultTheme} from './../theme/default'

import Header from './../components/_header/Header'
import SinglePost from './../components/_posts/SinglePost'

import {getCachedUser, logOutUser} from './../database/users.db'
import {getPosts} from './../database/posts.db.js'
import PostModal from './../components/_posts/PostModal';

export default function ProfileActions({isOpen, contentType, onClose}) {

    const [isLoading, setIsLoading] = useState(true)
    const [contentTitle, setContentTitle] = useState(null)

    useEffect(() => {
        // getCachedUser().then(val => {            
        //     setUser(val)
        //     getPosts({category:"singleUser", callerID:val.id})
        //     .then((docs)=>{
        //         setPosts(docs)
        //         setIsLoading(false)
        //     })
        // })
        

    }, [])

    
    // if(isLoading) return null
    const Content = () => {
        //possible contents -> saved posts | edit profile | options | report user
        if(contentType === "bookmarked"){
            setContentTitle("Bookmarked 📒")
            setIsLoading(false)

            return(<Text>yo</Text>)
        }else{
            return null
        }


    }

    return (
        <Modal
            visible={isOpen}
            animationType="slide"
            style={{flex:5,borderWidth:0, width:"100%"}}
            transparent={false}
        >
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>{contentTitle}</Text>
                    <TouchableOpacity style={styles.close} onPress={()=>{ onClose() }}>
                        <Image source={require('./../assets/images/icons/exit.png')} style={styles.close_icon} />
                    </TouchableOpacity>
                </View>

                <Content/>

            </SafeAreaView>


        </Modal>
    )
}

const styles = StyleSheet.create({

    container:{
        flex:1,
        backgroundColor:DefaultTheme.colors.dark,
        position:'relative',
    },
    header: {
        width:"100%",
        paddingHorizontal:16,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
        marginVertical:16
    },
    title:{
        fontFamily:DefaultTheme.fonts.bold,
        color:DefaultTheme.colors.whites.full,
        fontSize:DefaultTheme.fontSizes.super,
    },
    close:{
        width:32,
        height:32,
        borderRadius:100,
        backgroundColor:DefaultTheme.colors.whites.tier,
        alignItems:'center',
        justifyContent:'center',
        marginLeft:'auto'
    },
    close_icon:{
        tintColor:DefaultTheme.colors.primary,
        width:24,
        height:24,
        resizeMode:'contain'
    },

})
