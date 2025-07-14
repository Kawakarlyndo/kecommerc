// Script para perfil do usuário
let currentUser = null;
let isEditMode = false;

document.addEventListener('DOMContentLoaded', function() {
    checkAuthAndLoadProfile();
    setupProfileForm();
});

// Verificar autenticação e carregar perfil
async function checkAuthAndLoadProfile() {
    try {
        currentUser = await window.checkAuth();
        
        if (!currentUser) {
            // Usuário não logado, redirecionar para login
            window.location.href = 'login.html';
            return;
        }
        
        await loadUserProfile();
        
    } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        showMessage('Erro ao carregar perfil: ' + error.message, 'error');
    }
}

// Configurar formulário de perfil
function setupProfileForm() {
    const editProfileForm = document.getElementById('edit-profile-form');
    if (editProfileForm) {
        editProfileForm.addEventListener('submit', handleProfileUpdate);
    }
    
    // Configurar máscara de telefone
    const phoneInput = document.getElementById('edit-phone');
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
    
    // Configurar máscara de CEP
    const cepInput = document.getElementById('edit-cep');
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

// Carregar perfil do usuário
async function loadUserProfile() {
    try {
        const userRef = window.ref(window.firebaseDatabase, `customers/${currentUser.uid}`);
        const snapshot = await window.get(userRef);
        
        if (snapshot.exists()) {
            const userData = snapshot.val();
            displayUserProfile(userData);
        } else {
            // Criar perfil básico se não existir
            const basicUserData = {
                uid: currentUser.uid,
                fullName: currentUser.displayName || '',
                email: currentUser.email,
                photoURL: currentUser.photoURL || '',
                city: '',
                phone: '',
                street: '',
                number: '',
                neighborhood: '',
                state: '',
                cep: '',
                createdAt: new Date().toISOString()
            };
            
            await window.set(userRef, basicUserData);
            displayUserProfile(basicUserData);
        }
        
    } catch (error) {
        console.error('Erro ao carregar perfil:', error);
        showMessage('Erro ao carregar perfil: ' + error.message, 'error');
    }
}

// Exibir perfil do usuário
function displayUserProfile(userData) {
    // Foto do perfil
    const profilePhoto = document.getElementById('profile-photo');
    const avatarPlaceholder = document.getElementById('avatar-placeholder');
    
    if (userData.photoURL) {
        if (profilePhoto) {
            profilePhoto.src = userData.photoURL;
            profilePhoto.style.display = 'block';
        }
        if (avatarPlaceholder) {
            avatarPlaceholder.style.display = 'none';
        }
    } else {
        if (profilePhoto) {
            profilePhoto.style.display = 'none';
        }
        if (avatarPlaceholder) {
            avatarPlaceholder.style.display = 'flex';
        }
    }
    
    // Informações do cabeçalho
    updateElement('profile-name', userData.fullName || 'Nome não informado');
    updateElement('profile-email', userData.email || 'Email não informado');
    updateElement('profile-city', userData.city || 'Cidade não informada');
    updateElement('profile-phone', userData.phone || 'Telefone não informado');
    
    // Informações pessoais
    updateElement('view-fullName', userData.fullName || 'Não informado');
    updateElement('view-email', userData.email || 'Não informado');
    updateElement('view-city', userData.city || 'Não informado');
    updateElement('view-phone', userData.phone || 'Não informado');
    
    // Endereço
    updateElement('view-street', userData.street || 'Não informado');
    updateElement('view-number', userData.number || 'Não informado');
    updateElement('view-neighborhood', userData.neighborhood || 'Não informado');
    updateElement('view-state', userData.state || 'Não informado');
    updateElement('view-cep', userData.cep || 'Não informado');
    
    // Preencher formulário de edição
    fillEditForm(userData);
}

// Atualizar elemento do DOM
function updateElement(id, value) {
    const element = document.getElementById(id);
    if (element) {
        if (id.includes('city') || id.includes('phone')) {
            element.innerHTML = `<i class="fas fa-${id.includes('city') ? 'map-marker-alt' : 'phone'}"></i> ${value}`;
        } else {
            element.textContent = value;
        }
    }
}

// Preencher formulário de edição
function fillEditForm(userData) {
    const fields = [
        'edit-fullName', 'edit-email', 'edit-city', 'edit-phone',
        'edit-street', 'edit-number', 'edit-neighborhood', 'edit-state', 'edit-cep'
    ];
    
    fields.forEach(fieldId => {
        const element = document.getElementById(fieldId);
        if (element) {
            const fieldName = fieldId.replace('edit-', '');
            element.value = userData[fieldName] || '';
        }
    });
}

// Alternar modo de edição
function toggleEditMode() {
    isEditMode = !isEditMode;
    
    const profileView = document.getElementById('profile-view');
    const addressView = document.getElementById('address-view');
    const editProfileForm = document.getElementById('edit-profile-form');
    const editAddressForm = document.getElementById('edit-address-form');
    const editBtn = document.getElementById('edit-profile-btn');
    
    if (isEditMode) {
        // Entrar no modo de edição
        if (profileView) profileView.style.display = 'none';
        if (addressView) addressView.style.display = 'none';
        if (editProfileForm) editProfileForm.style.display = 'block';
        if (editAddressForm) editAddressForm.style.display = 'block';
        if (editBtn) {
            editBtn.innerHTML = '<i class="fas fa-times"></i> Cancelar';
            editBtn.onclick = cancelEdit;
        }
    } else {
        // Sair do modo de edição
        if (profileView) profileView.style.display = 'block';
        if (addressView) addressView.style.display = 'block';
        if (editProfileForm) editProfileForm.style.display = 'none';
        if (editAddressForm) editAddressForm.style.display = 'none';
        if (editBtn) {
            editBtn.innerHTML = '<i class="fas fa-edit"></i> Editar Perfil';
            editBtn.onclick = toggleEditMode;
        }
    }
}

// Cancelar edição
function cancelEdit() {
    isEditMode = false;
    toggleEditMode();
    
    // Recarregar dados originais
    loadUserProfile();
}

// Manipular atualização do perfil
async function handleProfileUpdate(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const profileData = Object.fromEntries(formData.entries());
    
    // Adicionar dados do endereço
    const addressData = {
        street: document.getElementById('edit-street').value,
        number: document.getElementById('edit-number').value,
        neighborhood: document.getElementById('edit-neighborhood').value,
        state: document.getElementById('edit-state').value,
        cep: document.getElementById('edit-cep').value
    };
    
    const allData = { ...profileData, ...addressData };
    
    // Validar dados
    if (!validateProfileData(allData)) {
        return;
    }
    
    try {
        showMessage('Atualizando perfil...', 'info');
        
        // Preparar dados para atualização
        const updates = {
            fullName: allData.fullName,
            city: allData.city,
            phone: allData.phone,
            street: allData.street,
            number: allData.number,
            neighborhood: allData.neighborhood,
            state: allData.state,
            cep: allData.cep,
            updatedAt: new Date().toISOString()
        };
        
        // Atualizar no banco de dados
        const userRef = window.ref(window.firebaseDatabase, `customers/${currentUser.uid}`);
        await window.update(userRef, updates);
        
        showMessage('Perfil atualizado com sucesso!', 'success');
        
        // Sair do modo de edição
        cancelEdit();
        
    } catch (error) {
        console.error('Erro ao atualizar perfil:', error);
        showMessage('Erro ao atualizar perfil: ' + error.message, 'error');
    }
}

// Validar dados do perfil
function validateProfileData(data) {
    // Verificar campos obrigatórios
    const requiredFields = ['fullName', 'city', 'phone'];
    
    for (const field of requiredFields) {
        if (!data[field] || data[field].trim() === '') {
            showMessage(`O campo ${getProfileFieldLabel(field)} é obrigatório`, 'error');
            return false;
        }
    }
    
    // Validar telefone
    const phoneDigits = data.phone.replace(/\D/g, '');
    if (phoneDigits.length < 10 || phoneDigits.length > 11) {
        showMessage('Por favor, insira um telefone válido', 'error');
        return false;
    }
    
    // Validar CEP se preenchido
    if (data.cep) {
        const cepDigits = data.cep.replace(/\D/g, '');
        if (cepDigits.length !== 8) {
            showMessage('Por favor, insira um CEP válido', 'error');
            return false;
        }
    }
    
    return true;
}

// Obter label do campo do perfil
function getProfileFieldLabel(field) {
    const labels = {
        fullName: 'Nome Completo',
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

// Exportar funções para uso global
window.toggleEditMode = toggleEditMode;
window.cancelEdit = cancelEdit;

