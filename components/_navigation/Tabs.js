import React from 'react'
import { View, Image, TouchableOpacity, Button, Text, StyleSheet } from 'react-native'

import {createBottomTabNavigator, BottomTabBar} from '@react-navigation/bottom-tabs'

import {DefaultTheme} from './../../theme/default'
import {globalStyles} from './../../assets/styles/global.style'

import Home from '../../screens/Home'
import Search from '../../screens/Search'
import Trending from '../../screens/Trending'
import Profile from '../../screens/Profile/Profile'
 
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
                component={Profile}
                options={{
                    tabBarIcon: ({focused})=>{
                        return <Image
                            source={require('../../assets/images/icons/profile.png')}
                            style={[ styles.icon, {
                                tintColor: focused ? DefaultTheme.colors.primary : "#fff"
                            }]}
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