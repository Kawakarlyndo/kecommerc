// Configuração do Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getDatabase, ref, set, get, push, remove, update, onValue, query, orderByChild, equalTo } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyCGHYT4oC-GVKaFW_6RBHy1zrgd5wihDcM",
  authDomain: "portfolio-91d7b.firebaseapp.com",
  databaseURL: "https://portfolio-91d7b-default-rtdb.firebaseio.com",
  projectId: "portfolio-91d7b",
  storageBucket: "portfolio-91d7b.firebasestorage.app",
  messagingSenderId: "6133951328",
  appId: "1:6133951328:web:4f5efca1c3deb2ddf50c05",
  measurementId: "G-FMYLX10FDS"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);
const googleProvider = new GoogleAuthProvider();

// Exportar para uso global
window.firebaseAuth = auth;
window.firebaseDatabase = database;
window.googleProvider = googleProvider;

// Exportar funções do Firebase
window.signInWithPopup = signInWithPopup;
window.signInWithEmailAndPassword = signInWithEmailAndPassword;
window.createUserWithEmailAndPassword = createUserWithEmailAndPassword;
window.signOut = signOut;
window.onAuthStateChanged = onAuthStateChanged;
window.ref = ref;
window.set = set;
window.get = get;
window.push = push;
window.remove = remove;
window.update = update;
window.onValue = onValue;
window.query = query;
window.orderByChild = orderByChild;
window.equalTo = equalTo;

// Função para verificar autenticação
window.checkAuth = function() {
    return new Promise((resolve) => {
        onAuthStateChanged(auth, (user) => {
            resolve(user);
        });
    });
};

// Função para obter usuário atual
window.getCurrentUser = function() {
    return auth.currentUser;
};

// Função para logout
window.logout = function() {
    signOut(auth).then(() => {
        showMessage('Logout realizado com sucesso!', 'success');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    }).catch((error) => {
        console.error('Erro no logout:', error);
        showMessage('Erro ao fazer logout: ' + error.message, 'error');
    });
};

// Função para mostrar mensagens
window.showMessage = function(message, type = 'info') {
    const messageDiv = document.getElementById('message');
    if (messageDiv) {
        messageDiv.textContent = message;
        messageDiv.className = `message ${type}`;
        messageDiv.style.display = 'block';
        
        // Auto-hide após 5 segundos
        setTimeout(() => {
            messageDiv.style.display = 'none';
        }, 5000);
    }
};

// Função para formatar moeda
window.formatCurrency = function(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
};

// Função para gerar ID único
window.generateId = function() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Verificar estado de autenticação ao carregar
document.addEventListener('DOMContentLoaded', function() {
    onAuthStateChanged(auth, (user) => {
        const profileLink = document.getElementById('profile-link');
        const logoutBtn = document.getElementById('logout-btn');
        const loginLinks = document.querySelectorAll('a[href="login.html"]');
        
        if (user) {
            // Usuário logado
            if (profileLink) profileLink.style.display = 'block';
            if (logoutBtn) logoutBtn.style.display = 'block';
            loginLinks.forEach(link => {
                if (link.textContent === 'Login') {
                    link.style.display = 'none';
                }
            });
        } else {
            // Usuário não logado
            if (profileLink) profileLink.style.display = 'none';
            if (logoutBtn) logoutBtn.style.display = 'none';
            loginLinks.forEach(link => {
                if (link.textContent === 'Login') {
                    link.style.display = 'block';
                }
            });
        }
    });
});

console.log('Firebase configurado com sucesso!');

