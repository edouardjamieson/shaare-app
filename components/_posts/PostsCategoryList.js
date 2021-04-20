import { DefaultTheme } from '../../theme/default'
import React from 'react'
import { useState } from 'react'
import {View, Text, FlatList, TouchableOpacity, StyleSheet} from 'react-native'

export default function PostsCategoryList({ onChange }) {
    const category = [
        {
            name:"For me",
            set_to:"none"
        },
        {
            name:"Music",
            set_to:"music"
        },
        {
            name:"Video",
            set_to:"video"
        },
        {
            name:"Photo",
            set_to:"photo"
        },
        {
            name:"Product",
            set_to:"product"
        },
        {
            name:"Social post",
            set_to:"social"
        },
        {
            name:"Website",
            set_to:"website"
        },
    ]
    const [currentCategory, setCurrentCategory] = useState(0)

    const returnCat = (item, index) => {
        
        onChange(item)
        setCurrentCategory(index)
    }

    const RenderCategoryItem = ({item, index}) => {
        return (
            <TouchableOpacity style={index === currentCategory ? styles.activeItem : styles.item} onPress={()=>{ returnCat(item, index) }}>
                <Text style={index === currentCategory ? styles.activeItemText : styles.itemText}>{item.name}</Text>
            </TouchableOpacity>
        )
    }

    return (
        <FlatList
            data={category}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={RenderCategoryItem}
            style={styles.list}
            contentContainerStyle={{
                alignItems:'center'
            }}
        />
    )
}

const styles = StyleSheet.create({
    list:{
        height:48,
        paddingLeft:16,
        flexGrow:0,
        flexShrink:0
    },

    activeItem: {
        backgroundColor:DefaultTheme.colors.whites.quin,
        borderRadius:100,
        paddingHorizontal:15,
        paddingVertical:8
    },
    activeItemText: {
        fontFamily:DefaultTheme.fonts.bold,
        color:DefaultTheme.colors.whites.full,
        fontSize:DefaultTheme.fontSizes.normal
    },

    item: {
        paddingHorizontal:15,
        paddingVertical:5
    },
    itemText: {
        fontFamily:DefaultTheme.fonts.bold,
        color:DefaultTheme.colors.whites.mid,
        fontSize:DefaultTheme.fontSizes.normal
    }
})