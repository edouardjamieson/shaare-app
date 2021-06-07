import {db, vf} from './../firebase'
import {getEquation} from './equation.db'

// ====================================================================
// GET POST LIST
// ====================================================================
async function getPosts(data) {

    const category = data.category || ""
    const callerID = data.callerID || ""

    let eq
    getEquation().then(val => {eq = val})

    const posts = db.collection('posts')
    const users = await db.collection('users').get()

    let posts_doc
    switch (category) {
        case "":
            break;
        case "all":
            posts_doc = await posts.get()
            break;
        case "forme":
            posts_doc = await posts.where('author', '!=', callerID).get()
            break;
        case "random":
            posts_doc = await posts.where('author', '!=', callerID).get()
            break;
        case "singleUser":
            posts_doc = await posts.where("author", "==", callerID).get()
            break;
        case category:
            posts_doc = await posts.where("category","==",category).get()
            break;
        default:
            return 0
            break;
    }

    if(!posts_doc.empty){
        if(category !== "singleUser" && category !== "random" && category !== "all"){

            const posts = posts_doc.docs.map((doc)=>({
                post:{
                    id:doc.id,
                    data:doc.data()
                },
                user:{
                    id:doc.data().author,
                    data:users.docs.filter(u => u.id === doc.data().author)[0].data()
                }
            }))
            
            //get all posts where keyword is in EQ
            const filtered = posts.filter(p => {
                return eq.some(e => e.key === p.post.data.keyword.trim().toLowerCase().split(" ").join(""))
            })
            //order posts depending on keyword points
            const ordered = Object.entries(filtered).sort((a,b) => {
                const p1 = eq.find(e => e.key === a[1].post.data.keyword.trim().toLowerCase().split(" ").join(""))
                const p2 = eq.find(e => e.key === b[1].post.data.keyword.trim().toLowerCase().split(" ").join(""))
                if(p1.points > p2.points) return -1
                if(p1.points < p2.points) return 1
                if(p1.points == p2.points) return 0
            })
            //return in the right format
            const returned = [] 
            for (let i = 0; i < ordered.length; i++) {
                const container = ordered[i];
                const post = container[1]
                returned.push(post)                
            }
            return returned

        }else{
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

}

// ====================================================================
// GET SINGLE POST
// ====================================================================
async function getSinglePost(data) {

    let id = data.id

    const col = db.collection('posts').doc(id)
    const doc = await col.get()
    if(!doc.empty){
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
    meta = await fetch(`https://iframe.ly/api/oembed?url=${data.url}&api_key=622dd247d07c0f4ed20da2`)
    meta = await meta.json()
    const metainf = {
        link_url:data.url,
        preview:meta.hasOwnProperty('html') ? meta.html : null,
        thumbnail:meta.hasOwnProperty('thumbnail_url') ? meta.thumbnail_url : "https://firebasestorage.googleapis.com/v0/b/shaare-6f9db.appspot.com/o/system%2Fno_preview.png?alt=media&token=bf17ce33-c24b-45f4-bf4f-68b4eb9c8129",
        content_title:meta.hasOwnProperty('title') ? meta.title : "",
        provider:meta.hasOwnProperty('provider_name') ? meta.provider_name : "",
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

// ====================================================================
// DELETE POST
// ====================================================================
async function deletePost(postID) {
    const query = await db.collection('posts').doc(postID).delete()
}





export {getPosts, getSinglePost, reactToPost, insertPost, deletePost}