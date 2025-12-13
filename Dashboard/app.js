import { initializeApp } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/9.4.0/firebase-auth.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyBJzIyBtJIofQAEhWyB9f-HtEnEHcLCBuA",
  authDomain: "posttestiot-b9a20.firebaseapp.com",
  databaseURL: "https://posttestiot-b9a20-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "posttestiot-b9a20",
  storageBucket: "posttestiot-b9a20.firebasestorage.app",
  messagingSenderId: "824085669032",
  appId: "1:824085669032:web:b2358a66340787a5ae8e9d",
  measurementId: "G-13HZ4NWPBG"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getDatabase();

const loginForm = document.getElementById("loginForm");
const dashboard = document.getElementById("dashboard");

// LOGIN DAN LOGOUT
document.getElementById("loginBtn").addEventListener("click", () => {
    const email = document.getElementById("email").value;
    const pass = document.getElementById("password").value;

    signInWithEmailAndPassword(auth, email, pass)
        .then(() => {
            loginForm.style.display = "none";
            dashboard.style.display = "block";
            listenToSensors();
        })
        .catch(err => alert("Login gagal: " + err.message));
});

document.getElementById("logoutBtn").addEventListener("click", () => {
    signOut(auth).then(() => {
        dashboard.style.display = "none";
        loginForm.style.display = "block";
    });
});

// MENAMPILKAN DATA SENSOR 
function listenToSensors() {
    const sensorRef = ref(db, "greenhouse/sensors");

    onValue(sensorRef, (snapshot) => {
        const d = snapshot.val() || {};

        updateSoil(d.soilMoisture);
        updateLight(d.lightlevel);
        updateMotion(d.motion);
    });
}

function updateSoil(value) {
    document.getElementById("soilMoisture").innerText = value + "%";
    const status = value < 30 ? "Kering" : value < 70 ? "Cukup" : "Basah";
    document.getElementById("soilStatus").innerText = status;
}

function updateLight(value) {
    document.getElementById("lightlevel").innerText = value + "%";
    const status = value < 30 ? "Redup" : value < 70 ? "Cukup" : "Terang";
    document.getElementById("lightStatus").innerText = status;
}

function updateMotion(value) {
    document.getElementById("motion").innerText = value ? "Terdeteksi" : "Tidak Terdeteksi";
    const status = value ? "Ada Gerakan" : "Aman";
    document.getElementById("motionStatus").innerText = status;
}