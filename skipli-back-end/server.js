import express from "express";
import bodyParser from "body-parser";
import session from "express-session"; // Import express-session
import { initializeApp, applicationDefault, cert } from 'firebase-admin/app';
import { getFirestore, Timestamp, FieldValue, Filter } from 'firebase-admin/firestore';
import { readFile } from 'fs/promises';
import twilio from 'twilio';
import dotenv from 'dotenv';

// Twilio setup
dotenv.config();

const accountSid = 'ACd6a6a729c173e2615fcefda516481569';
const authToken = '064f7155956fe2b99b2a21ccd8f56da2';

const client = twilio(accountSid, authToken);

const serviceAccount = JSON.parse(
  await readFile(
    new URL('./skipli-key.json', import.meta.url)
  )
);

// Firestore setup
initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

// Post requests
const app = express()
const port = 4000

app.use(bodyParser.urlencoded({extended: true}))

// Add the session middleware
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
}))

// Initialize phoneNumber in the session
app.use((req, res, next) => {
  if (!req.session.phoneNumber) {
    req.session.phoneNumber = "";
  }
  next();
});

// Post a phone number to get an access code
app.post("/", (req, res) => {
    req.session.phoneNumber = req.body["phoneNumber"]; // Store phoneNumber in the session

    // Generate a random 6-digit access code
    let ran = ("" + Math.random()).substring(2, 8)
    console.log(ran)

    const info = db.collection("skipli-users");
    info.get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        if (doc.data()["phone number"] === req.session.phoneNumber){
            doc.ref.update({
                "access code": ran,
            })
        }
      });
    }).catch((error) => {
      console.log('Error getting documents:', error);
    });    

    const TWILIO_PHONE_NUMBER = '+18444101304';
    const CELL_PHONE_NUMBER = '+1'+ req.session.phoneNumber;

    // send a code to the phone number
    client.messages
    .create({
        body: ran,
        from:  TWILIO_PHONE_NUMBER,
        to: CELL_PHONE_NUMBER
    })
   
  
    res.redirect("/")
})

// Post the access code to validate it
app.post("/validate", (req, res) => {
    const accessCode = req.body["accessCode"];

    const info = db.collection("skipli-users");
    info.where("phone number","==", req.session.phoneNumber).where("access code", "==", accessCode).get().then((querySnapshot) => {
        if (querySnapshot.empty) {
          res.send("No matching access code in the database");
        } else {
          querySnapshot.forEach((doc) => {
            doc.ref.update({
              "access code": "", // Update the access code to an empty string
            });
          });
      
          res.send("Access code matched successfully!");
        }
    })
})

app.listen(port, () => {
    console.log("Server running on port 4000")
})



