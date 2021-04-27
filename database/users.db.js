import {db} from './../firebase'
import AsyncStorage from '@react-native-async-storage/async-storage';
import SHA256 from 'crypto-js/sha256';

// ====================================================================
// LOG IN USER
// ====================================================================
async function logInUser(data) {

    const username = data.username
    const password = data.password

    //check if username exists
    const user = await db.collection('users').where('username', '==', username).get()
    if(user.empty) return 0

    //check if pass is ok
    if(SHA256(password).toString() !== user.docs[0].data().password) return 0

    //check country & region

    const u = user.docs[0]
    try {
        await AsyncStorage.setItem('user', JSON.stringify({id:u.id, data:u.data()}))
        return 1
    } catch (error) {
        return 0
    }

}

// ====================================================================
// CHECK IF USER IS LOGGED IN
// ====================================================================
async function checkIfUserIsLoggedIn() {
    try {
        const user = await AsyncStorage.getItem('user')
        if(!user) return 0
        return 1
    } catch (error) {
        return 0
    }
}

// ====================================================================
// GET LOGGED USER CACHED INFOS
// ====================================================================

async function getCachedUser() {
    try {
        const user = await AsyncStorage.getItem('user')
        if(!user) return 0
        return JSON.parse(user)
    }catch(err) {
        return 0
    }
}

// ====================================================================
// UPDATE USER CACHED INFOS
// ====================================================================

async function updateCachedUser(userID) {

    const user = await db.collection('users').doc(userID).get()
    if(user.empty) return 0

    const u = user.docs[0]
    try {
        await AsyncStorage.setItem('user', JSON.stringify({id:u.id, data:u.data()}))
        return 1
    } catch (error) {
        return 0
    }
}

// ====================================================================
// UPDATE USER INFOS
// ====================================================================

// ====================================================================
// LOG OUT USER
// ====================================================================

async function logOutUser() {
    try {
        await AsyncStorage.removeItem('user')
        return 1
    } catch (error) {
        return 0
    }
}

// ====================================================================
// ADD USER
// ====================================================================
async function insertUser(data) {

    //check if username is taken
    const userExists = await db.collection('users').where('username', '==', data.username).get()
    if(!userExists.empty) return 0

    //if not taken add to db
    const password = SHA256(data.password).toString()
    console.log(password);
    const date = Date.now()

    let country
    let region
    country = await fetch("https://ipapi.co/json/")
    country = await country.json()
    region = country.region_code
    country = country.country_code

    const user = {
        username:data.username,
        handle:data.username,
        password:password,
        created_at:date,
        is_ban:false,
        strikes:0,
        posts:[],
        reactions:["😎","👽","🎂","🤯","⚡️"],
        country:country,
        region:region,
        role:"user",
        equation:"",
        profilePicture:""
    }

    const query = await db.collection('users').add(user)

}

export {
    logInUser,
    checkIfUserIsLoggedIn,
    getCachedUser,
    updateCachedUser,
    logOutUser,
    insertUser,
}
