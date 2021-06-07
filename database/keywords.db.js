import {db} from './../firebase'

// ====================================================================
// GET MOST POPULAR KEYWORDS
// ====================================================================
async function getPopularKeywords() {

    const query = await db.collection('posts').get()
    const keywords = query.docs.map((doc)=>(
        doc.data().keyword.trim().toLowerCase().split(" ").join("")
    ))

    const counts = {}
    keywords.forEach((k)=> { counts[k] = (counts[k] || 0)+1 })
    
    const sorted = Object.entries(counts).sort((a,b)=> {
        const k1 = a[1]
        const k2 = b[1]
        if(k1 > k2) return -1
        if(k1 < k2) return 1
        if(k1 == k2) return 0
    })
    
    return sorted
}



export { getPopularKeywords }