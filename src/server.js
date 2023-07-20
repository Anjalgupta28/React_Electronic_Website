const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const port = 8000;

const { doc, deleteDoc, getFirestore, getDoc } = require("firebase/firestore");
const { initializeApp } = require("firebase/app")
const FCM = require('fcm-node');
const fcmServerKey = 'AAAAU5L6Ot4:APA91bGR-nLv_2TOTLIpxyZenjPjU5wL9OVTzERtQesCx8xQKif_qD-KnM69vnaFXYMjIYyR-VvFYRP1EMcwbGMtvec53M_FR-Cfgl8LNxGr-4LJ-Ti2QkyUbyvaUcdW4zSFA_cTwtPs';
const fcm = new FCM(fcmServerKey);

const firebaseConfig = {
  apiKey: "AIzaSyDg7OqGs5LpKSTM6B7FtYjAwcCRQdJ-9kw",
  authDomain: "student-crud-apps.firebaseapp.com",
  projectId: "student-crud-apps",
  storageBucket: "student-crud-apps.appspot.com",
  messagingSenderId: "358948158174",
  appId: "1:358948158174:web:0ba4394a20e82d6db6604f",
  measurementId: "G-KTTL8YSR04"
};

initializeApp(firebaseConfig);
const db = getFirestore(); // Get Firestore instance

app.use(express.json());//Middleware
app.use(cors());//Middleware
app.use(bodyParser.json());//Middleware

app.get('/data/:id', async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: 'Missing id parameter' });
  }
  const confirmationMessage = `Are you sure, You want to delete this record ${id}?`;
  res.send({ confirmation_message: confirmationMessage });
});

app.delete('/delete/:id', async (req, res) => {
  const { id } = req.params; // Extract the id from req.params
  try {
    const studentDoc = doc(db, "student", id);
    await deleteDoc(studentDoc);
    // Send push notification
  const notification = {
    to: 'cM13pTIvoB0eykdzTrPVW2:APA91bFWrHv1A6gEDzouKkkJc4QYcsqLCzU0MsysYKiwOHj5hQ-Etko5xn5N4JdKLubOSsxQ1OSgm-8zmgrig-P1rzwA2bRKODUp6jjShQZYEA_r_OC1hlt_eo9LHDiCYQfr4VO9Gy0K',
    notification: {
      title: "Record Deleted Successfully",
      body: "The record has been deleted successfully!",
      Image: "http://image.ibb.co/frYOFd/tmlogo.png"
    }
  };
  fcm.send(notification, (err, response) => {
    if (err) {
      console.log("Failed to send push notification:", err);
    } else {
      console.log('Push notification sent successfully using Delete API:', response);
    }
  });
    // Include the message in the API response
    const message = 'Record deleted successfully!';
    res.json({ message });
  } catch (error) {
    console.error("Error deleting record:", error);
    res.status(500).json({ error: 'Failed to delete record' });
  }
});

app.post('/token', (req, res) => {
  const { token } = req.body;
  console.log('Token received:', token);
  res.sendStatus(200);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// app.post('/send-notification', async (req, res) => {
//   try {
//     const { notification } = req.body;
//     // Send the notification to FCM API
//     const response = await axios.post('https://fcm.googleapis.com/fcm/send', {...notification}, {
//       // Add other FCM options or target device tokens here if needed
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${fcmServerKey}`,
//       },
//     })
//     // .then(res=>console.log("res check:",res))
//     //   .catch(err=>console.log("res check err:", err))
//     console.log('FCM API response:', response.data);
//     res.status(200).json({ message: 'Push notification sent successfully !!!!!!!!!!!!' });
//   } catch (error) {
//     if(error.response && error.response.data){
//       console.error('Error sending push notification:', error.response.data);
//     }else{
//       console.error('Unknown Error occurred while sending Push Notification', error);
//     }
//     res.status(500).json({ error: 'Failed to send push notification' });
//   }
// });


// app.get('/data/:id', async (req, res) => {
//   const { id } = req.params;
//   // Check if the required data is present
//   if (!id) {
//     return res.status(400).json({ error: 'Missing id parameter' });
//   }
//   try {
//   const studentDoc = await getDoc(doc(db, 'student', id));
//   const studentData = studentDoc.data();
  
//   if (studentData && studentData.token) {
//     const msg = {
//       to: studentData.token,
//       notification: {
//         title: 'Hey',
//         body: 'Do you want to delete this user?'
//       }
//     };

//     fcm.send(msg, (err, response) => {
//       if (err) {
//         console.log('ERROR', err);
//       } else {
//         console.log('Sent Success', response);
//       }
//     });
//   } else {
//     console.log('Token not found for the student');
//   }
// } catch (error) {
//   console.error('Error fetching student data:', error);
// }
  
//   const confirmationMessage = `Are you sure you want to delete this record ${id}?`;
//   res.send({ confirmation_message: confirmationMessage });
// });

// app.delete('/delete/:id', async (req, res) => {
//   console.log("inside delete")
//   const { id } = req.params; // Extract the id from req.params
//   try {
//     const studentDoc = doc(db, "student", id);
//     await deleteDoc(studentDoc);
//     // Send push notification
//     res.json({ message: 'Record deleted successfully!' });
//   } catch (error) {
//     console.error("Error deleting record:", error);
//     res.status(500).json({ error: 'Failed to delete record' });
//   }
// });