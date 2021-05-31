import {db, vf, storage} from './../firebase'
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

    try {
        await AsyncStorage.setItem('user', JSON.stringify({id:user.id, data:user.data()}))
        return 1
    } catch (error) {
        return 0
    }
}

// ====================================================================
// GET USER BY ID
// ====================================================================
async function getUserById(id) {
    const user = await db.collection('users').doc(id).get()
    if(user.empty) return 0
    return {id:user.id, data:user.data()}
}

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

    let location
    location = await fetch("https://ipapi.co/json/")
    location = await location.json()
    location = {
        country: location.country_code,
        region: location.region_code,
        ip: location.ip
    }

    const user = {
        username:data.username,
        handle:data.username,
        bio:"",
        password:password,
        created_at:date,
        is_ban:false,
        strikes:0,
        reactions:["😎","👽","🎂","🤯","⚡️"],
        location:location,
        role:"user",
        equation:"",
        profilePicture:"https://firebasestorage.googleapis.com/v0/b/shaare-6f9db.appspot.com/o/profile_pictures%2Fdefault.png?alt=media&token=f5cc1035-48e9-4b53-af21-f1dbfe83b5a0",
        saved:[],
        follows:[],
        blocked:[]
    }

    const query = await db.collection('users').add(user)

}

// ====================================================================
// SAVE POST
// ====================================================================
async function savePost(userID, postID, set) {

    const query = await db.collection('users').doc(userID).update({
        saved:set === true ? vf.arrayUnion(postID) : vf.arrayRemove(postID)
    }).then(()=>{
        updateCachedUser(userID)
    })

}

// ====================================================================
// FOLLOW USER
// ====================================================================
async function followUser(followerID, followedID, set) {

    const query = await db.collection('users').doc(followerID).update({
        follows:set === true ? vf.arrayUnion(followedID) : vf.arrayRemove(followedID)
    }).then(()=>{
        updateCachedUser(followerID)
    })

}

// ====================================================================
// UPDATE USER INFOS
// ====================================================================
async function updateUserInfos(userID, data) {
    let UserPPurl

    if(data.profilePicture !== ""){
        // console.log(data.profilePicture);
        let type = data.profilePicture.split('.')
        type = type[type.length-1]

        fetch(data.profilePicture)
        .then(res => {
            return res.blob()
        })
        .then(blob => {
            const ref = storage.ref()
            const task = ref.child('profile_pictures/'+userID).put(blob, { contentType: `image/${type}` })
            task.on('state_changed', ()=>{
                task.snapshot.ref.getDownloadURL()
                .then(url => {
                    const query = db.collection('users').doc(userID).update({
                        handle:data.handle,
                        bio:data.bio,
                        reactions:data.reactions,
                        profilePicture:url
                    }).then(()=>{
                        updateCachedUser(userID)
                    })
                })
            })
        })

    }else{
        const query = await db.collection('users').doc(userID).update({
            handle:data.handle,
            bio:data.bio,
            reactions:data.reactions,
        }).then(()=>{
            updateCachedUser(userID)
        })
    }


}


export {
    logInUser,
    checkIfUserIsLoggedIn,
    getCachedUser,
    updateCachedUser,
    getUserById,
    logOutUser,
    insertUser,
    savePost,
    followUser,
    updateUserInfos
}
