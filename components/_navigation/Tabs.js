import React from 'react'
import { View, Image, TouchableOpacity, Button, Text, StyleSheet } from 'react-native'

import {createBottomTabNavigator, BottomTabBar} from '@react-navigation/bottom-tabs'

import {DefaultTheme} from './../../theme/default'
import {globalStyles} from './../../assets/styles/global.style'
import Home from '../../screens/Home'
import Search from '../../screens/Search'
import Trending from '../../screens/Trending'

const Tab = createBottomTabNavigator()
export default function Tabs() {
    return(
        <Tab.Navigator
            tabBarOptions={{
                showLabel:false,
                style:{
                    backgroundColor: DefaultTheme.colors.dark,
                    borderTopWidth:0,
                    elevation:0,
                    alignItems:"space-between"
                },
            }}
        >
            <Tab.Screen 
                name="Home"
                component={Home}
                options={{
                    tabBarIcon: ({focused})=>{
                        return <Image
                            source={require('../../assets/images/icons/home.png')}
                            style={[ styles.icon, {
                                tintColor: focused ? DefaultTheme.colors.primary : "#fff"
                            }]}
                        />
                    }
                }}
            />
            <Tab.Screen 
                name="Search"
                component={Search}
                options={{
                    tabBarIcon: ({focused})=>{
                        return <Image
                            source={require('../../assets/images/icons/search.png')}
                            style={[ styles.icon, {
                                tintColor: focused ? DefaultTheme.colors.primary : "#fff"
                            }]}
                        />
                    }
                }}
            />
            <Tab.Screen 
                name="Trending"
                component={Trending}
                options={{
                    tabBarIcon: ({focused})=>{
                        return <Image
                            source={require('../../assets/images/icons/trending.png')}
                            style={[ styles.icon, {
                                tintColor: focused ? DefaultTheme.colors.primary : "#fff"
                            }]}
                        />
                    }
                }}
            />
            <Tab.Screen 
                name="Profile"
                component={Home}
                options={{
                    tabBarIcon: ({focused})=>{
                        return <Image
                            source={{uri:'https://thumbs-prod.si-cdn.com/0Hlhw9KPW6kA8-zuSeBrgg0ztfQ=/fit-in/1600x0/filters:focal(582x120:583x121)/https://public-media.si-cdn.com/filer/d6/7d/d67d186f-f5f3-4867-82c5-2c772120304f/thanos-snap-featured-120518-2.jpg'}}
                            style={{
                                width:30,
                                height:30,
                                resizeMode:"cover",
                                borderColor:DefaultTheme.colors.primary,
                                borderWidth: focused ? 2 : 0,
                                borderRadius:100
                            }}
                        />
                    }
                }}
            />
        </Tab.Navigator>
    )
}

const styles = StyleSheet.create({

    icon:{
        width:24,
        height:24,
        resizeMode:'contain'
    }

})