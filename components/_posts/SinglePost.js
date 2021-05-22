import React,{ useState, useEffect } from 'react'
import { StyleSheet, Text, View, Image, TouchableOpacity, TouchableWithoutFeedback, Dimensions, ImageBackground, Linking } from 'react-native'
import { DefaultTheme } from '../../theme/default'

export default function SinglePost({post, onTap, onTapProfile}) {
    
    return (
        <View style={styles.container}>
            <ImageBackground source={{uri:post.post.data.meta.thumbnail}} blurRadius={2.5} style={styles.post}>
                <View style={styles.ratio}></View>
                <TouchableWithoutFeedback onPress={()=>{ onTap() }} onLongPress={()=> { Linking.openURL(post.post.data.meta.link_url) }}>
                    <View style={styles.content}>
                        <View style={styles.content_footer}>
                            <TouchableOpacity style={styles.content_headerBtn} onPress={()=>{ onTapProfile(post.user.id) }}>
                                <Image
                                    source={{uri:post.user.data.profilePicture}}
                                    style={styles.content_profileImg}
                                />
                            </TouchableOpacity>
                            {/* <Image source={{uri:post.data.meta.provider_img}} style={styles.content_img} /> */}
                        </View>
                    </View>
                </TouchableWithoutFeedback>

            </ImageBackground>

        </View>
    )
}

const styles = StyleSheet.create({

    container:{
        marginTop:16,
        alignItems:'center',
        width:((Dimensions.get('screen').width-48)/2),
        marginLeft:16,
        borderRadius:35,
        overflow:'hidden'
    },
    ratio: {
        paddingTop:"100%"
    },
    post: {
        aspectRatio:1,
        flex:1,
        // borderRadius:35,
        position:'relative',
        width:"100%",
    },
    content:{
        padding:16,
        position:'absolute',
        width:"100%",
        height:"100%",
        top:0,
        left:0,
    },
    
    content_footer:{
        flexDirection:'row',
        marginTop:"auto",
        alignItems:'flex-end',
        justifyContent:'space-between',
        position:'relative'
    }, 
    content_profileImg:{
        width:32,
        height:32,
        resizeMode:'cover',
        borderRadius:100,
        borderWidth:2,
        borderColor:DefaultTheme.colors.primary
    },
    content_img:{
        width:32,
        paddingTop:32,
        resizeMode:"contain",
        borderRadius:100
    },


})
