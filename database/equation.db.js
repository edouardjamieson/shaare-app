import AsyncStorage from '@react-native-async-storage/async-storage';

//POINTS REF
//LONG TAP TO OPEN POST -> 1 pt
//REACT TO POST -> 2 pts
//SAVE POST -> 2 pts

async function getEquation() {
    try {
        const stored_eq = await AsyncStorage.getItem('equation')
        const eq = stored_eq ? JSON.parse(stored_eq) : []

        return eq
    }catch(err) {
        console.log(err);
    }
}

async function updateEquation(keyword, points) {

    try {
        const stored_eq = await AsyncStorage.getItem('equation')
        const eq = stored_eq ? JSON.parse(stored_eq) : []
       
        const kw = keyword.trim().toLowerCase().split(" ").join("")
        //check if keyword exists in EQ
        if(eq.filter(e => e.key === kw).length > 0){
            //has KW
            const current = eq.find(c => c.key === kw)
            current.points = current.points+=points
            current.points < 0 ? eq.splice(eq.indexOf(current)):null
        }else{
            //dont have KW
            eq.push({key: kw, points:points})
        }
        await AsyncStorage.setItem('equation', JSON.stringify(eq))

    }catch(err) {
        console.log(err);
    }



}

async function resetEquation() {
    try {
        await AsyncStorage.removeItem('equation')
        return 1
    } catch (error) {
        return 0
    }
}

async function DEV_getEQ() {
    try {
        const stored_eq = await AsyncStorage.getItem('equation')
        const eq = stored_eq ? JSON.parse(stored_eq) : {}
        console.log(eq);
    } catch (error) {
        console.log(error);
    }
}

export { getEquation, updateEquation, resetEquation, DEV_getEQ }