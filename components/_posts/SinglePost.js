import React,{ useState, useEffect } from 'react'
import { StyleSheet, Text, View, Image, TouchableOpacity, TouchableWithoutFeedback } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient';
import { DefaultTheme } from '../../theme/default'

import PostModal from './PostModal'

export default function SinglePost({post, longPress}) {

    const [LongPressStyle, setLongPressStyle] = useState(false)

    const handleLongPress = () => {
        longPress()
    }

    // ====================================================================
    // Get author
    // ====================================================================
    // const author
    

    return (
        <View style={styles.container}>
{/* { transform: LongPressStyle ? [{scale:0.8}] : "none" } */}
            <LinearGradient style={styles.post} colors={DefaultTheme.colors.mainGradientArray}>
                <View style={styles.ratio}></View>
                <TouchableWithoutFeedback onPress={()=>{alert("goto link")}} onLongPress={()=>{ handleLongPress() }}>
                    <View style={styles.content}>
                        
                        {/* header */}
                        <TouchableOpacity style={styles.content_headerBtn} onPress={()=>{alert("goto profile")}}>
                            <View style={styles.content_header}>
                                <Image
                                    source={{uri:'https://thumbs-prod.si-cdn.com/0Hlhw9KPW6kA8-zuSeBrgg0ztfQ=/fit-in/1600x0/filters:focal(582x120:583x121)/https://public-media.si-cdn.com/filer/d6/7d/d67d186f-f5f3-4867-82c5-2c772120304f/thanos-snap-featured-120518-2.jpg'}}
                                    style={styles.content_profileImg}
                                />
                                <Text style={styles.content_profileName}>{post.data.author}</Text>
                            </View>
                        </TouchableOpacity>
                        {/* footer */}
                        <View style={styles.content_footer}>
                            <Text style={styles.content_name}>
                                SuicideBoys -xd -xd-xd
                            </Text>
                            <Image
                            source={{uri:"https://www.freepnglogos.com/uploads/spotify-logo-png/spotify-logo-transparent-spotify-logo-images-25.png"}}
                            style={styles.content_img}
                            />
                        </View>

                    </View>
                </TouchableWithoutFeedback>
            </LinearGradient>

            <View style={styles.reactions}>
                {
                    p
                }
                <TouchableOpacity style={styles.reaction}>
                    <Text style={styles.reaction_icon}>🦑</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.reaction}>
                    <Text style={styles.reaction_icon}>🦑</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.reaction}>
                    <Text style={styles.reaction_icon}>🦑</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.reaction}>
                    <Text style={styles.reaction_icon}>🦑</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.reaction}>
                    <Text style={styles.reaction_icon}>🦑</Text>
                </TouchableOpacity>
            </View>

        </View>
    )
}

const styles = StyleSheet.create({

    container:{
        flex:1,
        marginHorizontal:16,
        marginTop:16,
        alignItems:'center',
    },
    ratio: {
        paddingTop:"100%"
    },
    post: {
        aspectRatio:1,
        flex:1,
        borderRadius:35,
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
    content_headerBtn:{

    },
    content_header:{
        flexDirection:'row',
        alignItems:'center'
    },
    content_profileImg:{
        width:32,
        height:32,
        resizeMode:'cover',
        borderRadius:100
    },
    content_profileName:{
        fontFamily:DefaultTheme.fonts.bold,
        color:DefaultTheme.colors.whites.full,
        fontSize:DefaultTheme.fontSizes.normal,
        marginLeft:8
    },

    content_footer:{
        flexDirection:'row',
        marginTop:"auto",
        alignItems:'flex-end',
        justifyContent:'space-between',
        position:'relative'
    }, 
    content_name:{
        width:"80%",
        color:DefaultTheme.colors.whites.full,
        fontFamily:DefaultTheme.fonts.bold,
        fontSize:DefaultTheme.fontSizes.normal
    },
    content_img:{
        width:"20%",
        paddingTop:"20%",
        resizeMode:"contain",
    },

    reactions:{
        flexDirection:'row',
        width:"100%",
        justifyContent:'space-evenly',
        paddingVertical:8
    },
    reaction_icon:{
        fontSize:DefaultTheme.fontSizes.big
    }


})
