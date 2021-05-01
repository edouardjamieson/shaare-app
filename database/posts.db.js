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

// ====================================================================
// INSERT POST
// ====================================================================
async function insertPost(data) {

    let meta
    meta = await fetch(`https://iframe.ly/api/iframely?url=${data.url}&api_key=622dd247d07c0f4ed20da2`)
    meta = await meta.json()
    const previewUrl = meta.hasOwnProperty("player") ? meta.links.player[0].href : data.url
    const metainf = {
        link_url:data.url,
        preview_url:previewUrl,
        thumbnail:meta.links.thumbnail[0].href,
        content_title:meta.meta.title,
        provider:meta.meta.site,
        provider_img:meta.links.icon[0].href
    }
    const post = {
        author:data.author,
        category:data.category,
        created_at:data.created_at,
        keyword:data.keyword,
        reactions:[],
        warnings:data.warnings,
        meta:metainf
    }

    const query = await db.collection('posts').add(post)

}




export {getPosts, getSinglePost, insertPost}