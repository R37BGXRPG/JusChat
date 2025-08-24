// Firebase imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.5.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc,
  getDocs,
  collection,
  query,
  where
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

// 🔐 Login handler
window.loginUser = async function(email, password) {
  try {
    const userCred = await signInWithEmailAndPassword(auth, email, password);
    console.log("Logged in:", userCred.user.uid);
    window.location.href = "index.html";
  } catch (err) {
    alert("Login failed: " + err.message);
  }
};

// 🆕 Signup handler with unique username
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
      createdAt: Date.now()
    });

    console.log("Signed up:", userCred.user.uid);
    window.location.href = "index.html";
  } catch (err) {
    alert("Signup failed: " + err.message);
  }
};

// 🎨 Theme, font, and frosted glass logic
document.addEventListener('DOMContentLoaded', () => {
  const FROSTED_GLASS_IMAGE_URL = 'http://googleusercontent.com/file_content/11';

  function applySavedSettings() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      document.documentElement.setAttribute('data-theme', savedTheme);
      const themeSelect = document.getElementById('theme-select');
      if (themeSelect) themeSelect.value = savedTheme;
    }

    const savedSpecialTheme = localStorage.getItem('specialTheme');
    if (savedSpecialTheme === 'frosted-glass-effect') {
      document.body.style.backgroundImage = `url('${FROSTED_GLASS_IMAGE_URL}')`;
      const wrapper = document.querySelector('.main-content-wrapper');
      if (wrapper) wrapper.classList.add('frosted-glass-effect');
    }
    const specialThemeSelect = document.getElementById('special-theme-select');
    if (specialThemeSelect) specialThemeSelect.value = savedSpecialTheme;

    const savedFont = localStorage.getItem('font');
    if (savedFont) {
      document.documentElement.setAttribute('data-font', savedFont);
      const fontSelect = document.getElementById('font-select');
      if (fontSelect) fontSelect.value = savedFont;
    }
  }

  applySavedSettings();

  const themeSelect = document.getElementById('theme-select');
  const specialThemeSelect = document.getElementById('special-theme-select');
  const fontSelect = document.getElementById('font-select');

  if (themeSelect) {
    themeSelect.addEventListener('change', (e) => {
      const selected = e.target.value;
      document.documentElement.setAttribute('data-theme', selected);
      localStorage.setItem('theme', selected);
    });
  }

  if (specialThemeSelect) {
    specialThemeSelect.addEventListener('change', (e) => {
      const wrapper = document.querySelector('.main-content-wrapper');
      document.body.style.backgroundImage = 'none';
      if (wrapper) wrapper.classList.remove('frosted-glass-effect');

      const selected = e.target.value;
      if (selected === 'frosted-glass') {
        document.body.style.backgroundImage = `url('${FROSTED_GLASS_IMAGE_URL}')`;
        if (wrapper) wrapper.classList.add('frosted-glass-effect');
      }
      localStorage.setItem('specialTheme', selected);
    });
  }

  if (fontSelect) {
    fontSelect.addEventListener('change', (e) => {
      const selected = e.target.value;
      document.documentElement.setAttribute('data-font', selected);
      localStorage.setItem('font', selected);
    });
  }
});

// 🌈 RGB variable updater
function getRgbValues(varName) {
  const hex = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
  if (hex.startsWith('#')) {
    const r = parseInt(hex.substring(1, 3), 16);
    const g = parseInt(hex.substring(3, 5), 16);
    const b = parseInt(hex.substring(5, 7), 16);
    return `${r}, ${g}, ${b}`;
  }
  return '255, 255, 255';
}

function updateRgbVariables() {
  const root = document.documentElement;
  root.style.setProperty('--bg-rgb', getRgbValues('--bg'));
  root.style.setProperty('--box-bg-rgb', getRgbValues('--box-bg'));
  root.style.setProperty('--border-color-rgb', getRgbValues('--border-color'));
  root.style.setProperty('--shadow-rgb', getRgbValues('--shadow'));
}

window.addEventListener('change', (e) => {
  if (e.target.id === 'theme-select') updateRgbVariables();
});

updateRgbVariables();