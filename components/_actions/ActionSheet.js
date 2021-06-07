import React from 'react'
import {View, Text, Image, SafeAreaView, Modal, StyleSheet, TouchableOpacity} from 'react-native'
import { DefaultTheme } from '../../theme/default'

export default function ActionSheet({isVisible, uniqueContent, content, dispatchAction}) {


    const Actions = () => {
        const actions = []
        content.map((c)=>{
            actions.push(
            <TouchableOpacity style={styles.action} key={c.title} onPress={()=>{dispatchAction(c.action)}}>
                <Image source={c.icon} style={styles.action_icon} />
                <Text style={styles.action_title}>{c.title}</Text>
            </TouchableOpacity>)
        })
        return actions
    }

    const SpecialContent = () => {

        if(!uniqueContent) return null
        const content = []

        if(uniqueContent.type === "reactions"){
            uniqueContent.content.map((c, x)=>{
                content.push(
                    <View style={styles.reaction} key={x}>
                        <Text style={styles.r_icon}>{c.reaction}</Text>
                        <Text style={styles.r_count}>{c.occurence}</Text>
                    </View>
                )
            })
        }
        
        return (
            <View style={styles.specialContent}>
                {content}
            </View>
        )

    }

    return (
        <Modal
            animationType="slide"
            transparent="true"
            visible={isVisible}
            style={styles.modal}
        >
            <TouchableOpacity style={styles.container} onPress={()=>{dispatchAction('')}}></TouchableOpacity>
            <SafeAreaView style={styles.box}>
                    
                <View style={styles.header}>
                    <Text style={styles.title}>More</Text>
                </View>
                <SpecialContent/>
                <Actions/>
                <TouchableOpacity style={[styles.action, {marginTop:16}]} onPress={()=>{dispatchAction('exit')}}>
                    <Image source={require('./../../assets/images/icons/exit.png')} style={styles.action_icon} />
                    <Text style={styles.action_title}>Close</Text>
                </TouchableOpacity>

            </SafeAreaView>
            

        </Modal>
    )
}

const styles = StyleSheet.create({

    container: {
        width:"100%",
        flex:1,
        backgroundColor:DefaultTheme.colors.darks.mid,
        justifyContent:'flex-end'
    },

    box: {
        width:"100%",
        backgroundColor:DefaultTheme.colors.dark,
        paddingVertical:10,
        borderTopColor:DefaultTheme.colors.primary,
        borderTopWidth:3,
    },

    header: {
        width:'100%',
        alignItems:'center',
        paddingVertical:16
    },
    title: {
        color:DefaultTheme.colors.whites.full,
        fontFamily:DefaultTheme.fonts.bold,
        fontSize:DefaultTheme.fontSizes.normal
    },

    action: {
        width:"100%",
        flexDirection:'row',
        alignItems:'center',
        paddingHorizontal:16,
        marginBottom:16
    },
    action_icon: {
        width:24,
        height:24,
        tintColor:DefaultTheme.colors.primary
    },
    action_title: {
        color:DefaultTheme.colors.whites.full,
        fontFamily:DefaultTheme.fonts.medium,
        fontSize:DefaultTheme.fontSizes.normal,
        marginLeft:16
    },

    specialContent: {
        width:"100%",
        flexDirection:'row',
        alignItems:'center',
        paddingHorizontal:16,
        marginBottom:16,
        justifyContent:'space-between',
        marginBottom:32
    },
    reaction: {
        alignItems:'center'
    },
    r_icon: {
        fontSize:48
    },
    r_count: {
        color:DefaultTheme.colors.whites.full,
        fontFamily:DefaultTheme.fonts.bold,
        fontSize:DefaultTheme.fontSizes.normal,
    }



})