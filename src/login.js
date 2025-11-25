import {fireApp, analytics} from '../firebase-config.js';
import {
    createUserWithEmailAndPassword, 
    getAuth, 
    GoogleAuthProvider, 
    signInWithEmailAndPassword, 
    signInWithPopup,
    signOut, 
} from "firebase/auth";

const auth = getAuth(fireApp);
const provider = new GoogleAuthProvider();

// Email and Password Signup
/**
 * @param {string} email
 * @param {string} password
 */
function emailSignup(email, password) {
    return createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        // Signed up 
        const user = userCredential.user;
        console.log('Signup successful:', user);
        return { success: true, user };
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        
        if (errorCode === 'auth/email-already-in-use') {
            console.error('This email is already registered');
            return { success: false, error: 'This email is already registered' };
        } else if (errorCode === 'auth/weak-password') {
            console.error('Password should be at least 6 characters');
            return { success: false, error: 'Password should be at least 6 characters' };
        } else {
            console.error(errorCode, errorMessage);
            return { success: false, error: errorMessage };
        }
    });
}

function emailLogin(email, password) {
    return signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        console.log('Login successful:', user);
        return { success: true, user };
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        
        if (errorCode === 'auth/user-not-found') {
            console.error('No account found with this email');
            return { success: false, error: 'No account found with this email' };
        } else if (errorCode === 'auth/wrong-password' || errorCode === 'auth/invalid-credential') {
            console.error('Invalid email or password');
            return { success: false, error: 'Invalid email or password' };
        } else {
            console.error(errorCode, errorMessage);
            return { success: false, error: errorMessage };
        }
    });
}

// Google Signup
function googleLogin() {

    signInWithPopup(auth, provider)
    .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        // IdP data available using getAdditionalUserInfo(result)
        // ...
    }).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
    });
}

function logout() {
    signOut(auth).then(() => {
  // Sign-out successful.
}).catch((error) => {
  // An error happened.
});
}

export { auth, emailSignup, emailLogin, googleLogin, logout };