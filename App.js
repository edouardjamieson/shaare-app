import { StatusBar } from 'expo-status-bar';
import React, {useState} from 'react';
import * as Font from 'expo-font'
import {useFonts} from 'expo-font'
import AppLoading from 'expo-app-loading'
import { StyleSheet, Text, View, SafeAreaView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import {globalStyles} from './assets/styles/global.style'
import {DefaultTheme} from './theme/default'

import {getLoggedUser} from './database/users.db'

import Tabs from './components/_navigation/Tabs'
import Home from './screens/Home'
import Login from './screens/Login'

const Stack = createStackNavigator()
export default function App() {

  const [fontsLoaded] = useFonts({
    'Quicksand-regular': require('./assets/fonts/Quicksand-Regular.ttf'),
    'Quicksand-medium': require('./assets/fonts/Quicksand-Medium.ttf'),
    'Quicksand-bold': require('./assets/fonts/Quicksand-Bold.ttf')
  })

  const [user, setUser] = useState(null)
  getLoggedUser().then((result) => {
    setUser(result)
  })


  if(!fontsLoaded){
    return(
      <Text style={{color:"red", fontSize:32}}>Yo</Text>

    )
  }else{

    if(user === 0){
      return (
        <Login />
      )
    }else{
      return (
          <NavigationContainer theme={{
            dark:true,
            colors:{
              background:DefaultTheme.colors.dark
            },
          }}>
            <StatusBar
              animated={true}
              backgroundColor={DefaultTheme.colors.dark}
              barStyle={DefaultTheme.statusbar}
            />
  
            <Stack.Navigator screenOptions={{ headerShown:false }} initialRouteName="Home">
              <Stack.Screen screenOptions={{gestureEnabled: false}} name="Home" component={Tabs} />
              <Stack.Screen name="Search" component={Home} />
              <Stack.Screen name="Trending" component={Home} />
              <Stack.Screen name="Shaare" component={Home} />
              <Stack.Screen name="Profile" component={Home} />
  
            </Stack.Navigator>
  
          </NavigationContainer>
      )
    }



    
  }
}
