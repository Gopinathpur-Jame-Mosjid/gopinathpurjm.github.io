// ১) Firebase Console → Project settings → Your apps → Web app থেকে config কপি করে নিচে বসান
window.FIREBASE_CONFIG = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
// ২) মালিকের Gmail (firestore.rules ও storage.rules-এর সাথে একই হতে হবে)
window.OWNER_EMAIL = "shironamhinantor@gmail.com";
// ৩) Push notification-এর জন্য: Firebase Console → Project settings → Cloud Messaging → Web Push certificates → Generate key pair
window.VAPID_KEY = "YOUR_VAPID_KEY";
// ৪) Cloudflare Worker-এর লিংক (README দেখুন)
window.PUSH_API = "https://YOUR-WORKER.workers.dev";
