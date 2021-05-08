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

import {checkIfUserIsLoggedIn} from './database/users.db'

import Tabs from './components/_navigation/Tabs'
import Login from './screens/Login'
import Shaare from './screens/Shaare'
import ProfileOther from './screens/ProfileOther'

const Stack = createStackNavigator()
export default function App() {

  const [fontsLoaded] = useFonts({
    'Quicksand-regular': require('./assets/fonts/Quicksand-Regular.ttf'),
    'Quicksand-medium': require('./assets/fonts/Quicksand-Medium.ttf'),
    'Quicksand-bold': require('./assets/fonts/Quicksand-Bold.ttf')
  })

  const [user, setUser] = useState(null)
  checkIfUserIsLoggedIn().then((val) => setUser(val))


  if(!fontsLoaded){
    return(
      <Text style={{color:"red", fontSize:32}}>Yo</Text>
    )
  }else{

    if(user === 0){
      return (
        <Login onLogin={ (data) => { setUser(data) } } />
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
  
            <Stack.Navigator screenOptions={{ headerShown:false }} initialRouteName="Home" mode="modal">
              <Stack.Screen screenOptions={{gestureEnabled: false}} name="Home" component={Tabs} />
              <Stack.Screen name="Shaare" component={Shaare}/>
              <Stack.Screen name="ProfileOther" component={ProfileOther} />
            </Stack.Navigator>
  
          </NavigationContainer>
      )
    }



    
  }
}
