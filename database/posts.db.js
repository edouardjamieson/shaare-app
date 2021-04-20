import {db} from './../firebase'

// ====================================================================
// GET POST LIST
// ====================================================================
async function getPosts({category, equation, userID}) {

    const col = db.collection('posts')
    let doc
    if(category && category != "none"){
        doc = await col
        .where("category", "==", category)
        .get()

    }else if(category === "none" || !category){
        doc = await col.get()
    }


    if(!doc.empty) {
        return doc.docs.map((doc)=>({id:doc.id, data:doc.data()}))
    }else{
        return 0
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