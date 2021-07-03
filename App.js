import React, {useState} from 'react';
import * as Font from 'expo-font'
import {useFonts} from 'expo-font'
import AppLoading from 'expo-app-loading'
import { StyleSheet, Text, View, SafeAreaView, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import {globalStyles} from './assets/styles/global.style'
import {DefaultTheme} from './theme/default'

import {checkIfUserIsLoggedIn} from './database/users.db'

import Tabs from './components/_navigation/Tabs'
import Login from './screens/Login'
import Logout from './screens/Logout'
import PostDetails from './screens/PostDetails'
import Shaare from './screens/Shaare'
import TrendingList from './screens/Trending-list'
import ProfileOther from './screens/Profile/Profile.other'
import Bookmarked from './screens/Profile/Profile.bookmarked'
import EditProfile from './screens/Profile/Profile.edit'
import Settings from './screens/Profile/Profile.settings'
import Report from './screens/Report'

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
      const profilePageOptions = {
        headerShown:true,
        headerTintColor:'#fff',
        headerTitleStyle:{ fontFamily:DefaultTheme.fonts.bold },
        headerBackTitleVisible:false
      }
      const subPageOptions = {
        headerShown:true,
        headerTitle:"",
        headerBackTitle:'Back',
        headerBackTitleStyle:{
          color:DefaultTheme.colors.whites.full,
          fontFamily:DefaultTheme.fonts.bold,
          marginLeft:8
        },
        headerTintColor:DefaultTheme.colors.primary
      }
      return (
          <NavigationContainer theme={{
            dark:true,
            colors:{
              background:DefaultTheme.colors.dark,
            },
          }}>
            <StatusBar
              animated={true}
              backgroundColor={DefaultTheme.colors.dark}
              barStyle={DefaultTheme.statusbar}
            />
  
            <Stack.Navigator screenOptions={{ headerShown:false }} initialRouteName="Home" mode="cards">
              <Stack.Screen screenOptions={{gestureEnabled: false}} name="Home" component={Tabs} />
              <Stack.Screen name="PostDetails" component={PostDetails} options={subPageOptions}/>
              <Stack.Screen name="TrendingList" component={TrendingList} options={subPageOptions}/>
              <Stack.Screen name="Shaare" component={Shaare}/>
              {/* Profile Screens */}
              <Stack.Screen name="ProfileOther" component={ProfileOther} options={subPageOptions}/>
              <Stack.Screen name="Bookmarked" component={Bookmarked} options={{
                headerTitle:'Bookmarked 📒',
                ...profilePageOptions
              }}/>
              <Stack.Screen name="EditProfile" component={EditProfile} options={{
                headerTitle:'Edit profile ✍️',
                ...profilePageOptions
              }}/>
              <Stack.Screen name="Settings" component={Settings} options={{
                headerTitle:'Settings 🩺',
                ...profilePageOptions
              }}/>
              <Stack.Screen name="Logout" component={Logout}/>
              <Stack.Screen name="Report" component={Report} options={{
                headerTitle:'Report something❗️',
                ...profilePageOptions
              }}/>

            </Stack.Navigator>
  
          </NavigationContainer>
      )
    }



    
  }
}
