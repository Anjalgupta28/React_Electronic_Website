
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const bodyParser = require('body-parser');
// const StudentDataService = require('./components/services/student.services')
const app = express();
const port = 8000;

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

const fcmServerKey = 'AAAAU5L6Ot4:APA91bHllsVZw87NKvNxQKEgWKbhwGaq5hFjsGs2sdj_UWfH4Fnr7waamRs6WyCfdBriow88H4muBNAbMBnL4un6K220LkFOlBZ278ugyELUDUzxQtSikQc3SLTuWTV565j_CgQL-vmU';

app.get('/data/:id', (req, res) => {
  const { id } = req.params;

  // Check if the required data is present
  if (!id) {
    return res.status(400).json({ error: 'Missing id parameter' });
  }

  const confirmationMessage = `Are you sure you want to delete item ${id}?`;
  res.send({ confirmation_message: confirmationMessage });
});

app.delete('/delete/:id', async (req, res) => {
  console.log("inside delete")
  const id = req.params;
  console.log(id)
  try {
    // Delete the record using StudentDataService.deleteStudent(id) or any other method
    // const studentDoc = doc(db, "student", id);
    // deleteDoc(studentDoc)
    // await StudentDataService.deleteStudent(id);
    // res.json({ message: 'Record deleted successfully!' });

  } catch (error) {
    res.status(500).json({ error: 'Failed to delete record' });
  }
  // Return the success response
  res.json({ message: 'Record deleted successfully!' });
});

app.post('/send-notification', async (req, res) => {
  try {
    const { notification } = req.body;

    // Send the notification to FCM API
    const response = await axios.post('https://fcm.googleapis.com/fcm/send', {
      notification,
      // Add other FCM options or target device tokens here if needed
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${fcmServerKey}`,
      },
    });

    console.log('FCM API response:', response.data);
    res.status(200).json({ message: 'Push notification sent successfully' });
  } catch (error) {
    console.error('Error sending push notification:', error.response.data);
    res.status(500).json({ error: 'Failed to send push notification' });
  }
});

app.post('/token', (req, res) => {
  const { token } = req.body;
  // Save the token to the database or perform any other required action
  console.log('Token received:', token);
  res.sendStatus(200);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
