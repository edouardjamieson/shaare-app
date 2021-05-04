import {db, vf} from './../firebase'

// ====================================================================
// GET POST LIST
// ====================================================================
async function getPosts({category, equation, userID}) {

    const posts = db.collection('posts')
    const users = await db.collection('users').get()

    let posts_doc

    if(category && category != "none"){
        posts_doc = await posts.where("category","==",category).get()
    }else{
        posts_doc = await posts.get()
    }

    if(!posts_doc.empty){

        return posts_doc.docs.map((doc)=>({
            post:{
                id:doc.id,
                data:doc.data()
            },
            user:{
                id:doc.data().author,
                data:users.docs.filter(u => u.id === doc.data().author)[0].data()
            }
        }))


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
// REACT TO POST
// ====================================================================
async function reactToPost(postID, userID, reaction_index, set) {

    if(set === true){
        const query = await db.collection('posts').doc(postID).update({
            reactions:vf.arrayUnion({uid:userID, reaction_index:reaction_index})
        })
    }else{
        const query = await db.collection('posts').doc(postID).update({
            reactions:vf.arrayRemove({uid:userID, reaction_index:reaction_index})
        })
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





export {getPosts, getSinglePost, reactToPost, insertPost}