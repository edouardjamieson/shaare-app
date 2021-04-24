import {db} from './../firebase'

// ====================================================================
// GET PROVIDER BY CATEGORY & HOST
// ====================================================================
async function getProvider(category, host) {

    //get category table
    const provider = await db.collection('providers')
    .where('hosts', 'array-contains', host)
    .get()

    if(!provider.empty){
        const p = provider.docs[0]
        return { id:p.id, data:p.data() }
    }else{
        return 0
    }

}

export {getProvider}