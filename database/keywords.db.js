import {db} from './../firebase'

// ====================================================================
// GET MOST POPULAR KEYWORDS
// ====================================================================
async function getPopularKeywords() {

    let posts
    let keywords

    //get all posts
    const col = db.collection('posts')
    const doc = await col.get()
    if(!doc.empty) {
        posts = doc.docs.map((doc)=>({id:doc.id, data:doc.data()}))

        keywords = doc.docs.map((doc)=>({keywords: doc.data().keywords}))
    }

    if(keywords) console.log(keywords);



}



export { getPopularKeywords }