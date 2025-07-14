// Script para autenticação
document.addEventListener('DOMContentLoaded', function() {
    setupAuthListeners();
    checkAuthRedirect();
});

// Configurar event listeners para autenticação
function setupAuthListeners() {
    // Login com Google
    const googleLoginBtn = document.getElementById('google-login-btn');
    if (googleLoginBtn) {
        googleLoginBtn.addEventListener('click', loginWithGoogle);
    }
    
    // Login com email
    const emailLoginForm = document.getElementById('email-login-form');
    if (emailLoginForm) {
        emailLoginForm.addEventListener('submit', loginWithEmail);
    }
}

// Verificar se usuário já está logado e redirecionar
async function checkAuthRedirect() {
    try {
        const user = await window.checkAuth();
        if (user) {
            // Usuário já está logado, redirecionar para home
            window.location.href = 'index.html';
        }
    } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
    }
}

// Login com Google
async function loginWithGoogle() {
    try {
        showMessage('Conectando com Google...', 'info');
        
        const result = await window.signInWithPopup(window.firebaseAuth, window.googleProvider);
        const user = result.user;
        
        // Salvar dados do usuário no banco de dados
        await saveUserToDatabase(user);
        
        showMessage('Login realizado com sucesso!', 'success');
        
        // Redirecionar após 1 segundo
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
        
    } catch (error) {
        console.error('Erro no login com Google:', error);
        let errorMessage = 'Erro ao fazer login com Google';
        
        switch (error.code) {
            case 'auth/popup-closed-by-user':
                errorMessage = 'Login cancelado pelo usuário';
                break;
            case 'auth/popup-blocked':
                errorMessage = 'Pop-up bloqueado pelo navegador. Permita pop-ups para este site';
                break;
            case 'auth/network-request-failed':
                errorMessage = 'Erro de conexão. Verifique sua internet';
                break;
            default:
                errorMessage = error.message;
        }
        
        showMessage(errorMessage, 'error');
    }
}

// Login com email e senha
async function loginWithEmail(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    if (!email || !password) {
        showMessage('Por favor, preencha todos os campos', 'error');
        return;
    }
    
    try {
        showMessage('Fazendo login...', 'info');
        
        const userCredential = await window.signInWithEmailAndPassword(window.firebaseAuth, email, password);
        const user = userCredential.user;
        
        showMessage('Login realizado com sucesso!', 'success');
        
        // Redirecionar após 1 segundo
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
        
    } catch (error) {
        console.error('Erro no login:', error);
        let errorMessage = 'Erro ao fazer login';
        
        switch (error.code) {
            case 'auth/user-not-found':
                errorMessage = 'Usuário não encontrado';
                break;
            case 'auth/wrong-password':
                errorMessage = 'Senha incorreta';
                break;
            case 'auth/invalid-email':
                errorMessage = 'Email inválido';
                break;
            case 'auth/user-disabled':
                errorMessage = 'Usuário desabilitado';
                break;
            case 'auth/too-many-requests':
                errorMessage = 'Muitas tentativas. Tente novamente mais tarde';
                break;
            case 'auth/network-request-failed':
                errorMessage = 'Erro de conexão. Verifique sua internet';
                break;
            default:
                errorMessage = error.message;
        }
        
        showMessage(errorMessage, 'error');
    }
}

// Salvar dados do usuário no banco de dados
async function saveUserToDatabase(user) {
    try {
        const userRef = window.ref(window.firebaseDatabase, `customers/${user.uid}`);
        const snapshot = await window.get(userRef);
        
        // Se o usuário não existe no banco, criar registro
        if (!snapshot.exists()) {
            const userData = {
                uid: user.uid,
                fullName: user.displayName || '',
                email: user.email,
                photoURL: user.photoURL || '',
                city: '',
                phone: '',
                street: '',
                number: '',
                neighborhood: '',
                state: '',
                cep: '',
                createdAt: new Date().toISOString(),
                provider: 'google'
            };
            
            await window.set(userRef, userData);
            console.log('Usuário salvo no banco de dados');
        } else {
            // Atualizar dados básicos se necessário
            const existingData = snapshot.val();
            const updates = {};
            
            if (user.displayName && user.displayName !== existingData.fullName) {
                updates.fullName = user.displayName;
            }
            
            if (user.photoURL && user.photoURL !== existingData.photoURL) {
                updates.photoURL = user.photoURL;
            }
            
            if (Object.keys(updates).length > 0) {
                updates.lastLogin = new Date().toISOString();
                await window.update(userRef, updates);
                console.log('Dados do usuário atualizados');
            }
        }
    } catch (error) {
        console.error('Erro ao salvar usuário no banco:', error);
        // Não mostrar erro para o usuário, pois o login foi bem-sucedido
    }
}

