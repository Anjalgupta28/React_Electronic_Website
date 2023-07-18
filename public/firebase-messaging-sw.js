importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js"
);

const firebaseConfig = {
    apiKey: "AIzaSyDg7OqGs5LpKSTM6B7FtYjAwcCRQdJ-9kw",
  authDomain: "student-crud-apps.firebaseapp.com",
  projectId: "student-crud-apps",
  storageBucket: "student-crud-apps.appspot.com",
  messagingSenderId: "358948158174",
  appId: "1:358948158174:web:0ba4394a20e82d6db6604f",
  measurementId: "G-KTTL8YSR04"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.image,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});