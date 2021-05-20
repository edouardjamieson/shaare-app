import React, {useState, useEffect} from 'react'
import { View, Text, Image, SafeAreaView, TextInput, StyleSheet, TouchableOpacity, ScrollView, KeyboardAvoidingView, Dimensions, Platform, FlatList } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'

import {updateUserInfos} from './../../database/users.db'
import {checkIfContainsBadwords} from './../../badwords'

import {globalStyles} from '../../assets/styles/global.style'
import {DefaultTheme} from '../../theme/default'


export default function EditProfile({route, navigation}) {

    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)
    const triggerError = (title, text) => {
        setError({title:title, text:text})
        setIsLoading(false)
        setTimeout(() => {
            setError(null)
        }, 3000);
    }

    const [user, setUser] = useState(route.params.user)

    // ====================================================================
    // Reactions
    // ====================================================================
    const possibleReactions = ["😄","😁","😆","😅","🤣","😂","😇","😉","😍","🥰","❤","🧡","🤪","🤑","🤐","😐","😏","🙄","😪","🤤","🤢","🥵","🥶","🤯","🥳","🥸","😎","🥺","😰","😭","😡","☠","👽","💥","🖖","👌","🤌","🤏","🤟","🙌","💅","🦾","🧠","🧞","🤺","🏇","🏂","🛌","🦍","🐕","🐈","🦄","🐓","🐸","🐊","🦂","🦞","🍔","🚗"]
    const [reactionListVisible, setReactionListVisible] = useState("none")
    const [editingReaction, setEditingReaction] = useState(null)
    const renderReactions = ({item, index}) => {
        return(
            <TouchableOpacity style={styles.reaction_btn} onPress={()=>{ handleSwapReaction(item) }}>
                <Text style={styles.reaction_btn_text}>{item}</Text>
            </TouchableOpacity>
        )
    }

    const swapReaction = (r) => {
        setEditingReaction(r)
        setReactionListVisible("flex")
    }

    const handleSwapReaction = (r) => {
        let new_reactions = user.data.reactions
        new_reactions[editingReaction] = r
        setUser({...user, data:{...user.data, reactions:new_reactions}})
        setReactionListVisible("none")
        setEditingReaction(null)
    }

    // ====================================================================
    // Text inputs
    // ====================================================================
    const [userHandle, setUserHandle] = useState(user.data.handle)
    const [userBio, setUserBio] = useState(user.data.bio || "")

    // ====================================================================
    // Handle save content
    // ====================================================================
    const saveContent = () => {

        setIsLoading(true)
        const handle = userHandle.trim()
        const bio = userBio.trim()
        //check if handle is empty
        if(handle < 1) return triggerError("Oups!", "You cannot have an empty user handle!")
        //check if handle has bad chars
        if(checkIfContainsBadwords(handle.toLowerCase())) return triggerError("Oups!", "We believe this user handle contains unsuitable words. Please try another.")
        if(checkIfContainsBadwords(bio.toLowerCase())) return triggerError("Oups!", "We believe your bio contains unsuitable words. Please try another.")
        
        const data = {handle:handle, bio:bio, reactions:user.data.reactions}
        updateUserInfos(user.id, data)
        .then((result)=> {
            navigation.navigate('Profile', {refresh:true})
        })
        .catch((err) => {
            return triggerError("Oups!", "There was an error. Please try again.")
        })


    }

    return (
        <View style={styles.editprofile}>
                {isLoading ?
                <View style={{ flex:1, width:'100%', height:'100%', position:'absolute', alignItems:'center', justifyContent:'center', backgroundColor:DefaultTheme.colors.darks.mid, zIndex:5 }}>
                    <Text style={{ fontFamily:DefaultTheme.fonts.bold, color:DefaultTheme.colors.whites.full, fontSize:DefaultTheme.fontSizes.medium }}>loading...</Text>
                </View>    
                : null }
                <ScrollView>
                    <SafeAreaView style={styles.container}>

                        <Text style={styles.edit_label}>My reactions</Text>
                        <View style={styles.swap_reactions}>
                            <TouchableOpacity onPress={()=>{ swapReaction(0) }}>
                                <Text style={styles.swap_reactions_text}>{user.data.reactions[0]}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={()=>{ swapReaction(1) }}>
                                <Text style={styles.swap_reactions_text}>{user.data.reactions[1]}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={()=>{ swapReaction(2) }}>
                                <Text style={styles.swap_reactions_text}>{user.data.reactions[2]}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={()=>{ swapReaction(3) }}>
                                <Text style={styles.swap_reactions_text}>{user.data.reactions[3]}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={()=>{ swapReaction(4) }}>
                                <Text style={styles.swap_reactions_text}>{user.data.reactions[4]}</Text>
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.edit_label}>User handle</Text>
                        <View style={styles.input_box}>
                            <Image source={require('./../../assets/images/icons/user_handle.png')} style={styles.input_icon} />
                            <TextInput
                                style={styles.input}
                                value={userHandle}
                                onChangeText={(e)=>{setUserHandle(e)}}
                                placeholder="mustachMaster"
                                autoCompleteType="off"
                                placeholderTextColor={DefaultTheme.colors.whites.mid}
                                keyboardAppearance="dark"
                                underlineColorAndroid="transparent"
                                autoCorrect={false}
                                selectTextOnFocus={true}
                            />
                        </View>

                        <Text style={styles.edit_label}>Bio</Text>
                        <View style={styles.input_box}>
                            <TextInput
                                style={styles.input}
                                value={userBio}
                                onChangeText={(e)=>{setUserBio(e)}}
                                placeholder="My super cool bio!"
                                autoCompleteType="off"
                                placeholderTextColor={DefaultTheme.colors.whites.mid}
                                keyboardAppearance="dark"
                                underlineColorAndroid="transparent"
                                autoCorrect={false}
                                selectTextOnFocus={true}
                                multiline
                                numberOfLines={4}
                                maxLength={100}
                            />
                        </View>
  
                    </SafeAreaView>
                </ScrollView>

                {/* Emoji list */}
                <View style={[styles.reactions, { display:reactionListVisible }]}>
                    <View style={styles.reactions_box}>
                        <Text style={styles.edit_label}>Change for...</Text>
                        <FlatList
                            data={possibleReactions}
                            horizontal
                            showsHorizontalScrollIndicator={true}
                            contentContainerStyle={{alignContent:'center'}}
                            style={styles.reactions_list}
                            key={(item)=>item}
                            renderItem={renderReactions}
                        />
                    </View>
                </View>
                {/* Save button */}
                <View style={styles.footer}>
                    {error ?
                    <LinearGradient colors={DefaultTheme.colors.errorGradientArray} style={styles.error}>
                        <Text style={styles.error_head}>{error.title}</Text>
                        <Text style={styles.error_text}>{error.text}</Text>
                    </LinearGradient>
                    :
                    <TouchableOpacity onPress={()=>{ saveContent() }} style={styles.shaare_btn}>
                        <LinearGradient
                            colors={DefaultTheme.colors.mainGradientArray}
                            style={styles.shaare_btn_gradient}
                        >
                            <Text style={styles.shaare_btn_text}>Save</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                    }
                </View>
        </View>
    )
}

const styles = StyleSheet.create({
    editprofile:{
        flex:1
    },
    container:{
        flex:1,
        backgroundColor:DefaultTheme.colors.dark,
        position:'relative',
        marginHorizontal:16,
    },
    edit_label:{
        fontFamily:DefaultTheme.fonts.bold,
        color:DefaultTheme.colors.whites.mid,
        fontSize:DefaultTheme.fontSizes.normal,
        marginBottom:8
    },
    input_box:{
        width:"100%",
        flexDirection:'row',
        alignItems:'center',
        backgroundColor:DefaultTheme.colors.whites.quin,
        borderRadius:100,
        padding:16,
        marginBottom:16
    },
    input:{
        width:"100%",
        fontSize:DefaultTheme.fontSizes.normal,
        color:DefaultTheme.colors.whites.full
    },
    input_icon:{
        width:18,
        height:18,
        tintColor:DefaultTheme.colors.primary,
        marginRight:16
    },

    swap_reactions:{
        flexDirection:'row',
        justifyContent:'space-evenly',
        marginBottom:16
    },
    swap_reactions_text:{
        fontSize:DefaultTheme.fontSizes.super
    },
    reactions:{
        position:'absolute',
        width:"100%",
        height:"100%",
        backgroundColor:DefaultTheme.colors.darks.quad,
        zIndex:5,
    },
    reactions_box:{
        marginTop:'auto',
        paddingLeft:16,
        backgroundColor:DefaultTheme.colors.dark,
        paddingBottom:32
    },
    reactions_list:{
        zIndex:5,
    },
    reaction_btn:{
        marginRight:16,
    },
    reaction_btn_text:{
        fontSize:52
    },


    footer:{
        marginTop:'auto',
        width:Dimensions.get('window').width,
        zIndex:4
    },
    shaare_btn:{
        width:Dimensions.get('screen').width,
        height:52,
        alignItems:'center',
    },
    shaare_btn_gradient:{
        alignItems:'center',
        width:"100%",
        flex:1
    },
    shaare_btn_text:{
        fontSize:DefaultTheme.fontSizes.medium,
        fontFamily:DefaultTheme.fonts.bold,
        color:DefaultTheme.colors.whites.full,
        paddingVertical:16,
    },

    error: {
        padding:16,
        width:"100%"
    },
    error_head:{
        fontFamily:DefaultTheme.fonts.bold,
        color:DefaultTheme.colors.whites.full,
        fontSize:DefaultTheme.fontSizes.medium
    },
    error_text:{
        fontFamily:DefaultTheme.fonts.regular,
        color:DefaultTheme.colors.whites.full,
        fontSize:DefaultTheme.fontSizes.normal
    }

})
