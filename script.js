// Firebase imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup
} from "https://www.gstatic.com/firebasejs/10.5.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc,
  getDocs,
  collection,
  query,
  where,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove
} from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyA7OMNG2gHH2ZHhfQoWTbB6w5ZYaFCjBk8",
  authDomain: "juschat-2a8a6.firebaseapp.com",
  projectId: "juschat-2a8a6",
  storageBucket: "juschat-2a8a6.appspot.com",
  messagingSenderId: "16171982663",
  appId: "1:16171982663:web:13cbcac9ffe732454a3662",
  measurementId: "G-25RE5GTR3D"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// 🔐 Email/Password Login
window.loginUser = async function(email, password) {
  try {
    const userCred = await signInWithEmailAndPassword(auth, email, password);
    console.log("Logged in:", userCred.user.uid);
    window.location.href = "index.html";
  } catch (err) {
    alert("Login failed: " + err.message);
  }
};

// 🆕 Signup with Unique Username
window.signupUser = async function(username, email, password) {
  try {
    const q = query(collection(db, "users"), where("username", "==", username));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      alert("Username already taken");
      return;
    }

    const userCred = await createUserWithEmailAndPassword(auth, email, password);
    await setDoc(doc(db, "users", userCred.user.uid), {
      username: username,
      createdAt: Date.now(),
      sent: [],
      arrived: [],
      friends: []
    });

    console.log("Signed up:", userCred.user.uid);
    window.location.href = "index.html";
  } catch (err) {
    alert("Signup failed: " + err.message);
  }
};

// 🔐 Google Login
window.loginWithGoogle = async function() {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      await setDoc(userRef, {
        username: user.displayName || "user_" + Date.now(),
        createdAt: Date.now(),
        sent: [],
        arrived: [],
        friends: []
      });
    }

    console.log("Google login:", user.uid);
    window.location.href = "index.html";
  } catch (err) {
    alert("Google login failed: " + err.message);
  }
};

// 🤝 Send Friend Request
window.sendFriendRequest = async function(targetUsername) {
  const user = auth.currentUser;
  const senderSnap = await getDoc(doc(db, "users", user.uid));
  const senderUsername = senderSnap.data().username;

  const q = query(collection(db, "users"), where("username", "==", targetUsername));
  const snapshot = await getDocs(q);
  if (snapshot.empty) return alert("User not found");

  const targetDoc = snapshot.docs[0];
  const targetUid = targetDoc.id;

  await updateDoc(doc(db, "users", user.uid), {
    sent: arrayUnion(targetUsername)
  });

  await updateDoc(doc(db, "users", targetUid), {
    arrived: arrayUnion(senderUsername)
  });

  alert("Friend request sent to " + targetUsername);
};

// ✅ Accept Friend Request
window.acceptFriendRequest = async function(senderUsername) {
  const user = auth.currentUser;
  const receiverSnap = await getDoc(doc(db, "users", user.uid));
  const receiverUsername = receiverSnap.data().username;

  const q = query(collection(db, "users"), where("username", "==", senderUsername));
  const snapshot = await getDocs(q);
  if (snapshot.empty) return alert("Sender not found");

  const senderDoc = snapshot.docs[0];
  const senderUid = senderDoc.id;

  await updateDoc(doc(db, "users", user.uid), {
    friends: arrayUnion(senderUsername),
    arrived: arrayRemove(senderUsername)
  });

  await updateDoc(doc(db, "users", senderUid), {
    friends: arrayUnion(receiverUsername),
    sent: arrayRemove(receiverUsername)
  });

  alert("You are now friends with " + senderUsername);
};