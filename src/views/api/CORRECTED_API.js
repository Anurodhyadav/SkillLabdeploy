// var docRef = db.collection("cities").doc("SF");

// docRef.get().then(function(doc) {
//     if (doc.exists) {
//         console.log("Document data:", doc.data());
//     } else {
//         // doc.data() will be undefined in this case
//         console.log("No such document!");
//     }
// }).catch(function(error) {
//     console.log("Error getting document:", error);
// });

import { db } from '../../firebase/db';

export const hasGivenTest = async (email) => {
    const transcriptRef = await db.collection('transData').where('email', '==', email).get();
    return !!transcriptRef.exists;
};
