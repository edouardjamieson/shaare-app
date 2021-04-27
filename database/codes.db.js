import {db} from './../firebase'
import {getCachedUser} from './users.db'

// ====================================================================
// GENERATE ACCESS CODE
// ====================================================================
async function generateCode() {

    let id
    getCachedUser().then(user => {
        id = user.id
    })

    const possibilities = "abcdefghijklmnopqrstuvwxyz1234567890"
    let code = ""
    for(let i = 0; i < 6; i++){
        code += possibilities.charAt(Math.floor(Math.random() * possible.length))
    }

    const data = {
        author_id:id,
        code:code,
        used:false
    }

    const validateCode = await db.collection('codes').where('code', '==', code).get()
    if(!validateCode.empty) return 0

    const addCode = await db.collection('codes').add(data)
}

// ====================================================================
// VALIDATE ACCESS CODE
// ====================================================================
async function validateCode(code) {

    const codeExists = await db.collection('codes').where('code', '==', code).where('used', '==', false).get()
    if(codeExists.empty) return 0
    return 1

}

export { generateCode, validateCode }