// Initialize Firebase with your config
const firebaseConfig = {
    apiKey: "AIzaSyCZK8nOx4WrD6iy_IZSFnHNasp1N_1V7ME",
    authDomain: "thundersmp-7b951.firebaseapp.com",
    databaseURL: "https://thundersmp-7b951-default-rtdb.firebaseio.com/",
    projectId: "thundersmp-7b951",
    storageBucket: "thundersmp-7b951.appspot.com",
    messagingSenderId: "359217033672",
    appId: "1:359217033672:web:906ec8b35d62352d5650fd",
    measurementId: "G-FXJNFWBT79"
};
firebase.initializeApp(firebaseConfig);

const database = firebase.database();
const chatRef = database.ref('chat');
const auth = firebase.auth();
const usersRef = database.ref('users');

let currentUser = null;

// Create a Google Auth Provider
const googleProvider = new firebase.auth.GoogleAuthProvider();

// Function to sign in with Google
function signInWithGoogle() {
    auth.signInWithPopup(googleProvider)
        .then((result) => {
            console.log("User signed in:", result.user);
            return checkOrCreateUser(result.user);
        })
        .then(() => {
            updateUIAfterLogin();
        })
        .catch((error) => {
            console.error("Error during Google sign in: ", error);
        });
}

// Function to check if user exists in database, if not create them
function checkOrCreateUser(user) {
    return usersRef.child(user.uid).once('value')
        .then((snapshot) => {
            if (!snapshot.exists()) {
                return usersRef.child(user.uid).set({
                    name: user.displayName,
                    email: user.email,
                    role: 'member'
                });
            }
        });
}

// Function to update UI after login
function updateUIAfterLogin() {
    usersRef.child(auth.currentUser.uid).once('value')
        .then((snapshot) => {
            currentUser = snapshot.val();
            currentUser.uid = auth.currentUser.uid;
            document.getElementById('loginContainer').style.display = 'none';
            document.getElementById('chatContainer').style.display = 'block';
            document.getElementById('userInfo').textContent = `Logged in as: ${currentUser.name}`;
            if (currentUser.role === 'admin') {
                document.getElementById('adminPanel').style.display = 'block';
            }
            loadChatMessages();
        });
}

// Function to sign out
function signOut() {
    auth.signOut().then(() => {
        currentUser = null;
        document.getElementById('loginContainer').style.display = 'block';
        document.getElementById('chatContainer').style.display = 'none';
        document.getElementById('adminPanel').style.display = 'none';
        document.getElementById('userInfo').textContent = '';
    }).catch((error) => {
        console.error("Error signing out: ", error);
    });
}

// Function to load chat messages
function loadChatMessages() {
    chatRef.on('child_added', (snapshot) => {
        const message = snapshot.val();
        displayMessage(message);
    });
}

// Function to display a message
function displayMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.textContent = `${message.name}: ${message.text}`;
    document.getElementById('messages').appendChild(messageElement);
}

// Function to send a message
function sendMessage() {
    const messageInput = document.getElementById('messageInput');
    const message = messageInput.value.trim();
    if (message && currentUser) {
        chatRef.push({
            name: currentUser.name,
            text: message,
            timestamp: firebase.database.ServerValue.TIMESTAMP
        });
        messageInput.value = '';
    }
}

// Function to make a user an admin
function makeAdmin(uid) {
    if (currentUser && currentUser.role === 'admin') {
        usersRef.child(uid).update({ role: 'admin' })
            .then(() => alert('User has been made an admin'))
            .catch((error) => console.error('Error making user admin:', error));
    } else {
        alert('You do not have permission to perform this action');
    }
}

// Listen for auth state changes
auth.onAuthStateChanged((user) => {
    if (user) {
        checkOrCreateUser(user).then(updateUIAfterLogin);
    } else {
        document.getElementById('loginContainer').style.display = 'block';
        document.getElementById('chatContainer').style.display = 'none';
        document.getElementById('adminPanel').style.display = 'none';
    }
});

// Add event listeners
document.getElementById('googleSignInButton').addEventListener('click', signInWithGoogle);
document.getElementById('signOutButton').addEventListener('click', signOut);
document.getElementById('sendButton').addEventListener('click', sendMessage);
