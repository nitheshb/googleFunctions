const functions = require("firebase-functions");
const cors = require('cors')({ origin: true });
const admin = require('firebase-admin');

const firebaseConfig = {
  apiKey: "AIzaSyB1RemRFRMIeu5_dd4Eodeh27zlTR7h3C4",
  authDomain: "teamplayers-f3b25.firebaseapp.com",
  databaseURL: "https://teamplayers-f3b25.firebaseio.com",
  projectId: "teamplayers-f3b25",
  storageBucket: "teamplayers-f3b25.appspot.com",
  messagingSenderId: "92289914084",
  appId: "1:92289914084:web:8cf17a1ce1008e63"
};

var serviceAccount = require("./keys/teamplayers-fire.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://teamplayers-f3b25.firebaseio.com"
});
// admin.initializeApp({credential: admin.credential.cert(firebaseConfig)});
 //admin.initializeApp();

const database = admin.database().ref('/playersDirectory');



exports.helloWorld1 = functions.https.onRequest((request, response) => {
  response.send("Hello from a Severless Database!");
});


exports.timerTest = functions.https.onRequest((request, response) => {
  function countDown(i) {
    return promise = new Promise( (resolve, reject) => {
  
      console.log(i--);
  
      if (i > 0) {
        setTimeout( () => {
          countDown(i).then(resolve).catch(e=> {
            console.log('counter val',e);
            return reject (e);
          })
        }, 2000);
      } else {
        resolve('counter finished:');
      }
  
    });
  
  }
  // functions.firestore.document("smartPool/Ind_SrlPool/activeBidders").onWrite((snap, context)=> {
  //   // const deletedValue =snap.data()
  //   console.log("checkin for deleted value in this");

  // checck=   functions.firestore
  //    .document('todos/{userId}')
  //    .onWrite((snap, context) => {
  //      // Get an object representing the document
  //      // e.g. {'name': 'Marie', 'age': 66}
  //      const newValue = snap.data();
  //     console.log("new called from inside ", newValue);
  //      // access a particular field as you would any JS property
  //      const name = newValue.name;
      
  //      return name;
  //      // perform desired operations ...
  //    });

  //   // if the activeBidders value is empty then mark the player as sold and allocate him to bidder

  //   // update the players icon
    
  // });

  // Attach an asynchronous callback to read the data at our posts reference
  var ref = admin.database().ref("todos");
ref.on("value", function(snapshot) {
  console.log("value change log");
  console.log(snapshot.val());
  return snapshot;
}, function (errorObject) {
  console.log("The read failed: " + errorObject.code

// ref.transaction(val=> {
//   console.log("value transaction");
//   reuturn (val);
// })
  var starCountRef = admin.database().ref("todos");
starCountRef.on('child_changed', function(snapshot) {
  console.log("valus is changed bro");
  return snapshot;
  // updateStarCount(postElement, snapshot.val());
});

  let counter = countDown(10);
  counter.then( (msg) => {
    console.log(msg);
    if(msg === 'counter finished:'){
    return response.send(msg);}
    else{
      return "continue";
    }
  }).catch(e => {
          
    console.log(e);
    return reject(e);
  });

  // return response.send(counter);
});

exports.changeDetect = functions.firestore
    .document("smartPool/{chartId}/activeBidders")
    .onWrite((snap, context) => {
      console.log("change Detecotr");
     });

     exports.changeUser = functions.firestore
     .document('todos/{userId}')
     .onWrite((snap, context) => {
       // Get an object representing the document
       // e.g. {'name': 'Marie', 'age': 66}
       const newValue = snap.data();
      console.log("new value is ", newValue);
       // access a particular field as you would any JS property
       const name = newValue.name;
      
       return name;
       // perform desired operations ...
     });    


const getItemsFromDatabase = (res) => {
  let items = [];

  return database.on('value', (snapshot) => {
    snapshot.forEach((item) => {
      items.push({
        id: item.key,
        item: item.val().item
      });
    });   
    res.status(200).json(items);
  }, (error) => {
    res.status(500).json({
      message: `Something went wrong. ${error}`
    })
  })
};

exports.addPlayer = functions.https.onRequest((req, res) => {
  return cors(req, res, () => {
    if(req.method !== 'POST') {
      return res.status(500).json({
        message: 'Not allowed'
      })
    }
    const item = req.body.item;
    database.push({ item });
    getItemsFromDatabase(res);
  });
});

exports.getPlayers = functions.https.onRequest((req, res) => {
  return cors(req, res, () => {
    if(req.method !== 'GET') {
      return res.status(500).json({
        message: 'Not allowed'
      });
    }
    getItemsFromDatabase(res);
  });
});

exports.deletePlayer = functions.https.onRequest((req, res) => {
  return cors(req, res, () => {
    if(req.method !== 'DELETE') {
      return res.status(500).json({
        message: 'Not allowed'
      })
    }
    const id = req.query.id 
    admin.database().ref(`/items/${id}`).remove();
    getItemsFromDatabase(res);
  })
})



  // below is firebase function that takes care of bid creation from ghostPool

  const db = admin.firestore();



  exports.bidCreator = functions.firestore
    .document("ghostPool/{chatId}")
    .onUpdate(change => {
      const data = change.after.data();

      const ghostSize = data.bidders.length;
  
      console.log("check for bidCreator", data, ghostSize);

      if(data.bidders.length){

        
     
        if(ghostSize >= 4){
          var dataObj = data.bidders.splice(0, 4);
         db.collection("TodayFixtures").doc("v4capW6PJh2qlY4MOJJX").get().then((fixtureDetails)=> {
           console.log("fixtureDetials", fixtureDetails.data());
         
          // console.log("fixtureDetails", fixtureDetails.data());
          var obj = {
            "bidId": "001",
            "bidStatus": "booted",
            "SkippedPlayers": "check",
            "bidders": dataObj,
            "bidPrice": 0,
            "activeBidders": dataObj,
            "currentBidder": dataObj[0],
            "team": fixtureDetails.data().team,
            "sportPlyerId": 0
          }
          const batch = db.batch();
            db.collection("smartPool").doc(change.after.id).set(obj);
      
        const ref = db.collection("ghostPool").doc(change.after.id);
      
          batch.set(ref, data, { merge: true });
  
         return batch.commit();
        }).catch(e => {
          console.log(e);
        })
        }else{
          return null;
        }
      } else {
        return null;
      }

      
  
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

    
    
    
// this function triggers when a new doc is added to smartPool
// active data is set to first player in the array of activeBidders
// Todo:trigger an setInterval to 15sec per bidder(change value of max_waiting)
// implement skip option trigger by observing the activeBidders Array
// when the activeBidder is empty allocate the actionItem


  exports.smartGamer = functions.firestore
    .document("smartPool/{chatId}")
    .onCreate((snap, context) => {
      const data = snap.data();
      const ghostSize = data.bidders.length;
      const MAX_WAITING = 10000;
      const index = 0;

      // /let currentBidder = data.activeBidders[index];
      let current_turn = 0;
      let _turn = 0;
      let timeOut,initialWaitTimeOut;
      let players = data.bidders;
      let playit = 0;

      console.log("bidder are", players, data.bidders);


    //   db.collection("ghostPool1").doc(change.after.id).set({currentBidder: players[0], playit: true});
      next_turn();

      function next_turn(){
        if(players <5){
            return new Promise((resolve, reject)=> {
              _turn = current_turn++ % players.length;
              playit = playit +1;
      // update in db as active bidder
      db.collection("smartPool").doc(context.params.chatId).set({currentBidder: players[_turn]}, {merge: true});
      console.log("next turn triggered " , _turn, playit);
      triggerTimeout();
      return resolve(); 
            });
          }else{
            return resolve
          }
      }

      functions.firestore.document("smartPool/{chatId}/activeBidders").onDelete((snap, context)=> {
        const deletedValue =snap.data()
        console.log("checkin for deleted value in this", snap.data());

        // if the activeBidders value is empty then mark the player as sold and allocate him to bidder

        // update the players icon
        
      });

   function triggerTimeout(){
    return new Promise((resolve, reject) => {
      setTimeout(function(){
       return  next_turn().then(data=> {
          return resolve();
        }).catch(e=> {
          console.log("error at triggerTimeOut",e);
        });
      },MAX_WAITING);
   })
  }

   function resetTimeOut(){
      if(typeof timeOut === 'object'){
        console.log("timeout reset");
        clearTimeout(timeOut);
      }
   }


  

      // functions.firestore.document("smartPool/"+change.after.id+"/activeBidders")
      // .onWrite(activeBiddersData => {
      //     players = activeBiddersData;
      //     console.log("check on write", players);
      // });

      
      // this should get updated when ever a values changes in it 
      // const bidders = data.bidders;

  
      // console.log("check for bidCreator", data, ghostSize);

      // if(data.bidders.length){
      //   if(ghostSize >= 4){
      //     var dataObj = data.bidders.splice(0, 4);
      //     var obj = {
      //       "bidId": "001",
      //       "bidStatus": "booted",
      //       "SkippedPlayers": "check",
      //       "bidders": dataObj,
      //       "activeBidders": dataObj
      //     }
      //     const batch = db.batch();
      //     // make an entry in smart pool with first 4 players in ghost pool
      //       db.collection("smartPool").doc(change.after.id).set(obj);
          
      //     // delete entries in ghost pool after the insertion in smartPool
      //   const ref = db.collection("ghostPool").doc(change.after.id);
      
      //     batch.set(ref, data, { merge: true });
  
      //    return batch.commit();
      //   }else{
      //     return null;
      //   }
      // } else {
      //   return null;
      // }
    });

    


    