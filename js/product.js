// Script para gerenciamento de produtos
let isEditMode = false;
let editingProductId = null;

document.addEventListener('DOMContentLoaded', function() {
    setupProductForm();
    loadProductsTable();
    setupSearchProduct();
});

// Configurar formulário de produto
function setupProductForm() {
    const productForm = document.getElementById('product-form');
    if (productForm) {
        productForm.addEventListener('submit', handleProductSubmit);
    }
    
    // Configurar máscara de preço
    const priceInput = document.getElementById('price');
    if (priceInput) {
        priceInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/[^\d.,]/g, '');
            e.target.value = value;
        });
    }
}

// Configurar pesquisa de produto
function setupSearchProduct() {
    const searchInput = document.getElementById('search-product');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchProductById();
            }
        });
    }
}

// Manipular envio do formulário de produto
async function handleProductSubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const productData = Object.fromEntries(formData.entries());
    
    // Validar dados
    if (!validateProductData(productData)) {
        return;
    }
    
    try {
        if (isEditMode && editingProductId) {
            await updateProduct(editingProductId, productData);
        } else {
            await createProduct(productData);
        }
        
        // Limpar formulário e resetar modo de edição
        event.target.reset();
        cancelEdit();
        
        // Recarregar tabela
        loadProductsTable();
        
    } catch (error) {
        console.error('Erro ao salvar produto:', error);
        showMessage('Erro ao salvar produto: ' + error.message, 'error');
    }
}

// Criar novo produto
async function createProduct(productData) {
    showMessage('Cadastrando produto...', 'info');
    
    const productId = window.generateId();
    const productWithId = {
        ...productData,
        id: productId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    
    const productRef = window.ref(window.firebaseDatabase, `products/${productId}`);
    await window.set(productRef, productWithId);
    
    showMessage('Produto cadastrado com sucesso!', 'success');
}

// Atualizar produto existente
async function updateProduct(productId, productData) {
    showMessage('Atualizando produto...', 'info');
    
    const updates = {
        ...productData,
        updatedAt: new Date().toISOString()
    };
    
    const productRef = window.ref(window.firebaseDatabase, `products/${productId}`);
    await window.update(productRef, updates);
    
    showMessage('Produto atualizado com sucesso!', 'success');
}

// Carregar tabela de produtos
async function loadProductsTable() {
    try {
        showLoadingTable(true);
        
        const productsRef = window.ref(window.firebaseDatabase, 'products');
        
        window.onValue(productsRef, (snapshot) => {
            const data = snapshot.val();
            const products = [];
            
            if (data) {
                Object.keys(data).forEach(key => {
                    products.push({
                        id: key,
                        ...data[key]
                    });
                });
            }
            
            displayProductsTable(products);
            showLoadingTable(false);
        });
        
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        showMessage('Erro ao carregar produtos: ' + error.message, 'error');
        showLoadingTable(false);
    }
}

// Exibir produtos na tabela
function displayProductsTable(products) {
    const tbody = document.getElementById('products-tbody');
    const table = document.getElementById('products-table');
    const noProducts = document.getElementById('no-products-found');
    
    if (!tbody) return;
    
    if (products.length === 0) {
        if (table) table.style.display = 'none';
        if (noProducts) noProducts.style.display = 'block';
        return;
    }
    
    if (table) table.style.display = 'table';
    if (noProducts) noProducts.style.display = 'none';
    
    tbody.innerHTML = products.map(product => `
        <tr>
            <td>${product.id}</td>
            <td>${product.productName}</td>
            <td>${product.category}</td>
            <td>${product.quantity}</td>
            <td>${formatCurrency(parseFloat(product.price))}</td>
            <td class="table-actions">
                <button onclick="editProduct('${product.id}')" class="edit-btn">
                    <i class="fas fa-edit"></i>
                    Editar
                </button>
                <button onclick="deleteProduct('${product.id}')" class="delete-btn">
                    <i class="fas fa-trash"></i>
                    Excluir
                </button>
            </td>
        </tr>
    `).join('');
}

// Mostrar/ocultar loading da tabela
function showLoadingTable(show) {
    const loading = document.getElementById('loading-products');
    const table = document.getElementById('products-table');
    
    if (loading) {
        loading.style.display = show ? 'block' : 'none';
    }
    
    if (table) {
        table.style.display = show ? 'none' : 'table';
    }
}

// Editar produto
async function editProduct(productId) {
    try {
        const productRef = window.ref(window.firebaseDatabase, `products/${productId}`);
        const snapshot = await window.get(productRef);
        
        if (snapshot.exists()) {
            const product = snapshot.val();
            
            // Preencher formulário
            document.getElementById('productId').value = productId;
            document.getElementById('productName').value = product.productName;
            document.getElementById('category').value = product.category;
            document.getElementById('quantity').value = product.quantity;
            document.getElementById('price').value = product.price;
            document.getElementById('description').value = product.description || '';
            
            // Ativar modo de edição
            isEditMode = true;
            editingProductId = productId;
            
            // Atualizar interface
            document.getElementById('form-title').textContent = 'Editar Produto';
            document.getElementById('submit-text').textContent = 'Atualizar Produto';
            document.getElementById('cancel-edit-btn').style.display = 'inline-flex';
            
            // Scroll para o formulário
            document.querySelector('.form-section').scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
            
        } else {
            showMessage('Produto não encontrado', 'error');
        }
        
    } catch (error) {
        console.error('Erro ao carregar produto para edição:', error);
        showMessage('Erro ao carregar produto: ' + error.message, 'error');
    }
}

// Cancelar edição
function cancelEdit() {
    isEditMode = false;
    editingProductId = null;
    
    // Resetar interface
    document.getElementById('form-title').textContent = 'Cadastro de Produto';
    document.getElementById('submit-text').textContent = 'Cadastrar Produto';
    document.getElementById('cancel-edit-btn').style.display = 'none';
    
    // Limpar formulário
    document.getElementById('product-form').reset();
}

// Excluir produto
async function deleteProduct(productId) {
    if (!confirm('Tem certeza que deseja excluir este produto?')) {
        return;
    }
    
    try {
        showMessage('Excluindo produto...', 'info');
        
        const productRef = window.ref(window.firebaseDatabase, `products/${productId}`);
        await window.remove(productRef);
        
        showMessage('Produto excluído com sucesso!', 'success');
        
        // Se estava editando este produto, cancelar edição
        if (editingProductId === productId) {
            cancelEdit();
        }
        
    } catch (error) {
        console.error('Erro ao excluir produto:', error);
        showMessage('Erro ao excluir produto: ' + error.message, 'error');
    }
}

// Pesquisar produto por ID
async function searchProductById() {
    const searchInput = document.getElementById('search-product');
    if (!searchInput) return;
    
    const searchTerm = searchInput.value.trim();
    
    if (!searchTerm) {
        loadProductsTable();
        return;
    }
    
    try {
        showLoadingTable(true);
        
        const productsRef = window.ref(window.firebaseDatabase, 'products');
        const snapshot = await window.get(productsRef);
        
        if (snapshot.exists()) {
            const data = snapshot.val();
            const products = [];
            
            Object.keys(data).forEach(key => {
                const product = { id: key, ...data[key] };
                
                // Buscar por ID ou nome
                if (key.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    product.productName.toLowerCase().includes(searchTerm.toLowerCase())) {
                    products.push(product);
                }
            });
            
            displayProductsTable(products);
        } else {
            displayProductsTable([]);
        }
        
        showLoadingTable(false);
        
    } catch (error) {
        console.error('Erro ao pesquisar produto:', error);
        showMessage('Erro ao pesquisar produto: ' + error.message, 'error');
        showLoadingTable(false);
    }
}

// Validar dados do produto
function validateProductData(data) {
    // Verificar campos obrigatórios
    const requiredFields = ['productName', 'category', 'quantity', 'price'];
    
    for (const field of requiredFields) {
        if (!data[field] || data[field].trim() === '') {
            showMessage(`O campo ${getProductFieldLabel(field)} é obrigatório`, 'error');
            return false;
        }
    }
    
    // Validar quantidade
    const quantity = parseInt(data.quantity);
    if (isNaN(quantity) || quantity < 0) {
        showMessage('A quantidade deve ser um número válido maior ou igual a zero', 'error');
        return false;
    }
    
    // Validar preço
    const price = parseFloat(data.price);
    if (isNaN(price) || price < 0) {
        showMessage('O preço deve ser um número válido maior ou igual a zero', 'error');
        return false;
    }
    
    return true;
}

// Obter label do campo do produto
function getProductFieldLabel(field) {
    const labels = {
        productName: 'Nome do Produto',
        category: 'Categoria',
        quantity: 'Quantidade',
        price: 'Preço'
    };
    
    return labels[field] || field;
}

// Exportar funções para uso global
window.editProduct = editProduct;
window.deleteProduct = deleteProduct;
window.cancelEdit = cancelEdit;
window.searchProductById = searchProductById;

