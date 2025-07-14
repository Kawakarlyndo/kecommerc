// Script para cadastro de clientes
document.addEventListener('DOMContentLoaded', function() {
    setupCustomerForm();
    setupPhoneMask();
    setupCepMask();
});

// Configurar formulário de cliente
function setupCustomerForm() {
    const customerForm = document.getElementById('customer-form');
    if (customerForm) {
        customerForm.addEventListener('submit', handleCustomerSubmit);
    }
}

// Configurar máscara de telefone
function setupPhoneMask() {
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.length <= 11) {
                if (value.length <= 10) {
                    value = value.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
                } else {
                    value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
                }
            }
            
            e.target.value = value;
        });
    }
}

// Configurar máscara de CEP
function setupCepMask() {
    const cepInput = document.getElementById('cep');
    if (cepInput) {
        cepInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.length <= 8) {
                value = value.replace(/(\d{5})(\d{3})/, '$1-$2');
            }
            
            e.target.value = value;
        });
    }
}

// Manipular envio do formulário de cliente
async function handleCustomerSubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const customerData = Object.fromEntries(formData.entries());
    
    // Validar dados
    if (!validateCustomerData(customerData)) {
        return;
    }
    
    try {
        showMessage('Cadastrando cliente...', 'info');
        
        // Criar usuário no Firebase Auth
        const userCredential = await window.createUserWithEmailAndPassword(
            window.firebaseAuth, 
            customerData.email, 
            customerData.password
        );
        
        const user = userCredential.user;
        
        // Preparar dados para salvar no banco
        const userData = {
            uid: user.uid,
            fullName: customerData.fullName,
            email: customerData.email,
            city: customerData.city,
            phone: customerData.phone,
            street: customerData.street,
            number: customerData.number,
            neighborhood: customerData.neighborhood,
            state: customerData.state,
            cep: customerData.cep,
            photoURL: '',
            createdAt: new Date().toISOString(),
            provider: 'email'
        };
        
        // Salvar no Realtime Database
        const userRef = window.ref(window.firebaseDatabase, `customers/${user.uid}`);
        await window.set(userRef, userData);
        
        showMessage('Cliente cadastrado com sucesso!', 'success');
        
        // Limpar formulário
        event.target.reset();
        
        // Redirecionar para login após 2 segundos
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
        
    } catch (error) {
        console.error('Erro ao cadastrar cliente:', error);
        let errorMessage = 'Erro ao cadastrar cliente';
        
        switch (error.code) {
            case 'auth/email-already-in-use':
                errorMessage = 'Este email já está em uso';
                break;
            case 'auth/invalid-email':
                errorMessage = 'Email inválido';
                break;
            case 'auth/weak-password':
                errorMessage = 'A senha deve ter pelo menos 6 caracteres';
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

// Validar dados do cliente
function validateCustomerData(data) {
    // Verificar campos obrigatórios
    const requiredFields = [
        'fullName', 'email', 'password', 'confirmPassword',
        'city', 'phone', 'street', 'number', 'neighborhood', 'state', 'cep'
    ];
    
    for (const field of requiredFields) {
        if (!data[field] || data[field].trim() === '') {
            showMessage(`O campo ${getFieldLabel(field)} é obrigatório`, 'error');
            return false;
        }
    }
    
    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        showMessage('Por favor, insira um email válido', 'error');
        return false;
    }
    
    // Validar senhas
    if (data.password.length < 6) {
        showMessage('A senha deve ter pelo menos 6 caracteres', 'error');
        return false;
    }
    
    if (data.password !== data.confirmPassword) {
        showMessage('As senhas não coincidem', 'error');
        return false;
    }
    
    // Validar telefone
    const phoneDigits = data.phone.replace(/\D/g, '');
    if (phoneDigits.length < 10 || phoneDigits.length > 11) {
        showMessage('Por favor, insira um telefone válido', 'error');
        return false;
    }
    
    // Validar CEP
    const cepDigits = data.cep.replace(/\D/g, '');
    if (cepDigits.length !== 8) {
        showMessage('Por favor, insira um CEP válido', 'error');
        return false;
    }
    
    return true;
}

// Obter label do campo
function getFieldLabel(field) {
    const labels = {
        fullName: 'Nome Completo',
        email: 'Email',
        password: 'Senha',
        confirmPassword: 'Confirmar Senha',
        city: 'Cidade',
        phone: 'Telefone',
        street: 'Rua',
        number: 'Número',
        neighborhood: 'Bairro',
        state: 'Estado',
        cep: 'CEP'
    };
    
    return labels[field] || field;
}

