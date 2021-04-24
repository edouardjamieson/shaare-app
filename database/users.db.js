import {db} from './../firebase'
import AsyncStorage from '@react-native-async-storage/async-storage';

// ====================================================================
// CHECK IF USER IS LOGGED IN
// ====================================================================
async function getLoggedUser() {
    try {
        const user = await AsyncStorage.getItem('user')
        if(!user) {
            return 0
        }else{
            const userJson = JSON.parse(user)
            const userId = userJson.userId

            const doc = await db.collection('users').doc(userId).get()
            if(!doc.empty){
                return doc.docs[0]
            }else{
                return 0
            }
        }
    } catch (error) {
        
    }

}

export {getLoggedUser}