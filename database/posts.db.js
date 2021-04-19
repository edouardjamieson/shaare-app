import {db} from './../firebase'

// ====================================================================
// GET POST LIST
// ====================================================================
async function getPosts(data) {

    let equation = data.equation >= 1 ? data.equation : null
    let category = data.category >= 1 ? data.category : null
    //add user id so user doesnt see his posts

    const col = db.collection('posts')
    const doc = await col.get()
    if(!doc.empty) {
        return doc.docs.map((doc)=>({id:doc.id, data:doc.data()}))
    }

}

// ====================================================================
// GET SINGLE POST
// ====================================================================
async function getSinglePost(data) {

    let id = data.id

    const col = db.collection('posts').doc(id)
    const doc = await col.get()
    if(!doc.exists){
        return {id:doc.id, data:doc.data()}
    }else{
        
    }

}




export {getPosts, getSinglePost}