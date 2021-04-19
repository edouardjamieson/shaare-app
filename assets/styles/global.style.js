import {StyleSheet} from 'react-native'
import {DefaultTheme} from './../../theme/default'
export const globalStyles = StyleSheet.create({

    mainView:{
        flex:1,
        backgroundColor: DefaultTheme.colors.dark,
        color:DefaultTheme.colors.whites.full
    },

    safeArea:{
        flex:1
    },

    page:{
    },

    mainButton:{
        fontFamily:'Quicksand-bold',
        color:"#fff",
        paddingVertical:6,
        paddingHorizontal:15,
        borderRadius:100,
    },
    mainButtonText: {
        fontSize:DefaultTheme.fontSizes.normal,
        fontFamily:'Quicksand-bold',
        color:"#fff",
    }

    
})