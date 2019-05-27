import * as functions from 'firebase-functions';
import * as cors from 'cors';
import * as admin from 'firebase-admin';

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//

const firebaseConfig = {
  apiKey: "AIzaSyB1RemRFRMIeu5_dd4Eodeh27zlTR7h3C4",
  authDomain: "teamplayers-f3b25.firebaseapp.com",
  databaseURL: "https://teamplayers-f3b25.firebaseio.com",
  projectId: "teamplayers-f3b25",
  storageBucket: "teamplayers-f3b25.appspot.com",
  messagingSenderId: "92289914084",
  appId: "1:92289914084:web:8cf17a1ce1008e63"
};
admin.initializeApp({credential: admin.credential.cert(firebaseConfig)});

const database = admin.database().ref('/BIDERS');



const getItemsFromDatabase = (res:any) => {
    let items:any = [];
  
    return database.on('value', (snapshot:any) => {
      snapshot.forEach((item:any) => {
        items.push({
          id: item.key,
          item: item.val().item
        });
      });   
      res.status(200).json(items);
    }, (error:any) => {
      res.status(500).json({
        message: `Something went wrong. ${error}`
      })
    })
  };

export const helloWorld = functions.https.onRequest((request, response) => {
 response.send("Hello from Firebase!");
});


exports.addItem = functions.https.onRequest((req:any, res:any) => {
    return cors(req, res, () => {
      if(req.method !== 'POST') {
        return res.status(500).json({
          message: 'Not allowed'
        })
      };
      const item = req.body.item;
      database.push({ item });
      getItemsFromDatabase(res)
    });
  });
  
  exports.getItems = functions.https.onRequest((req, res) => {
    return cors(req, res, () => {
      if(req.method !== 'GET') {
        return res.status(500).json({
          message: 'Not allowed'
        });
      };
      getItemsFromDatabase(res)
    });
  });


  // below is firebase function that takes care of bid creation from ghostPool

const db = admin.firestore();



exports.bidCreator = functions.firestore
  .document("ghostPool")
  .onUpdate(change => {
    const data = change.after.data();

    console.log("check for bidCreator", data);

    // const maxLen = 100;
    // const msgLen = data.messages.length;
    // const charLen = JSON.stringify(data).length;

    // const batch = db.batch();

    // if (charLen >= 10000 || msgLen >= maxLen) {

    //   // Always delete at least 1 message
    //   const deleteCount = msgLen - maxLen <= 0 ? 1 : msgLen - maxLen
    //   data.messages.splice(0, deleteCount);
 
    //   const ref = db.collection("chats").doc(change.after.id);

    //   batch.set(ref, data, { merge: true });

    //   return batch.commit();
    // } else {
    //   return null;
    // }
  });