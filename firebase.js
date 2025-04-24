import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDiIuU1pIxVEhj-BJYlUL_5o4UuDeMFALA",
  authDomain: "goal-buddy-8c917.firebaseapp.com",
  projectId: "goal-buddy-8c917",
  storageBucket: "goal-buddy-8c917.appspot.com",
  messagingSenderId: "577833704998",
  appId: "1:577833704998:web:28a10a5ab92c555e6cd0e7",
  measurementId: "G-YFRJPEDSR6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth and Firestore
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);

// Sign-in with Google
export const signIn = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    console.log("Signed in as:", user.displayName);
  } catch (error) {
    console.error("Error signing in:", error.message);
  }
};

// Check for authentication state
export const checkAuthState = () => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log("User is signed in:", user.uid);
      // Call a function to load the user's data here
      fetchGoal(user.uid, "your_goal_id_here");
    } else {
      console.log("No user signed in.");
    }
  });
};

// Fetch goal from Firestore for the authenticated user
export const fetchGoal = async (userId, goalId) => {
  try {
    // Make sure you're using the authenticated user's UID for the path
    const goalRef = doc(db, "users", userId, "goals", goalId);
    const goalDoc = await getDoc(goalRef);

    if (goalDoc.exists()) {
      console.log("Goal Data:", goalDoc.data());
    } else {
      console.log("No such document!");
    }
  } catch (error) {
    console.error("Error fetching goal:", error.message);
  }
};
