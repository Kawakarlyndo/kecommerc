// Script principal para a página inicial
let allProducts = [];
let filteredProducts = [];

// Aguardar carregamento do DOM
document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
    setupEventListeners();
});

// Configurar event listeners
function setupEventListeners() {
    // Hamburger menu
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }
    
    // Pesquisa em tempo real
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(searchProducts, 300));
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchProducts();
            }
        });
    }
}

// Função debounce para otimizar pesquisa
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Carregar produtos do Firebase
async function loadProducts() {
    try {
        showLoading(true);
        
        const productsRef = window.ref(window.firebaseDatabase, 'products');
        
        window.onValue(productsRef, (snapshot) => {
            const data = snapshot.val();
            allProducts = [];
            
            if (data) {
                Object.keys(data).forEach(key => {
                    allProducts.push({
                        id: key,
                        ...data[key]
                    });
                });
            }
            
            filteredProducts = [...allProducts];
            displayProducts(filteredProducts);
            showLoading(false);
        });
        
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        showMessage('Erro ao carregar produtos: ' + error.message, 'error');
        showLoading(false);
    }
}

// Exibir produtos na tela
function displayProducts(products) {
    const productsGrid = document.getElementById('products-grid');
    const noProducts = document.getElementById('no-products');
    
    if (!productsGrid) return;
    
    if (products.length === 0) {
        productsGrid.style.display = 'none';
        if (noProducts) noProducts.style.display = 'block';
        return;
    }
    
    if (noProducts) noProducts.style.display = 'none';
    productsGrid.style.display = 'grid';
    
    productsGrid.innerHTML = products.map(product => `
        <div class="product-card" data-category="${product.category}">
            <div class="product-image">
                <i class="fas fa-tshirt"></i>
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.productName}</h3>
                <span class="product-category">${product.category}</span>
                <div class="product-price">${formatCurrency(parseFloat(product.price))}</div>
                <div class="product-quantity">
                    <i class="fas fa-box"></i>
                    ${product.quantity} em estoque
                </div>
                ${product.description ? `<p class="product-description">${product.description}</p>` : ''}
            </div>
        </div>
    `).join('');
}

// Mostrar/ocultar loading
function showLoading(show) {
    const loading = document.getElementById('loading');
    const productsGrid = document.getElementById('products-grid');
    
    if (loading) {
        loading.style.display = show ? 'block' : 'none';
    }
    
    if (productsGrid) {
        productsGrid.style.display = show ? 'none' : 'grid';
    }
}

// Pesquisar produtos
function searchProducts() {
    const searchInput = document.getElementById('search-input');
    if (!searchInput) return;
    
    const searchTerm = searchInput.value.toLowerCase().trim();
    
    if (searchTerm === '') {
        filteredProducts = [...allProducts];
    } else {
        filteredProducts = allProducts.filter(product => 
            product.productName.toLowerCase().includes(searchTerm) ||
            product.category.toLowerCase().includes(searchTerm) ||
            product.id.toLowerCase().includes(searchTerm)
        );
    }
    
    displayProducts(filteredProducts);
    updateFilterButtons();
}

// Filtrar por categoria
function filterByCategory(category) {
    const searchInput = document.getElementById('search-input');
    if (searchInput) searchInput.value = '';
    
    filteredProducts = allProducts.filter(product => 
        product.category === category
    );
    
    displayProducts(filteredProducts);
    updateFilterButtons(category);
}

// Mostrar todos os produtos
function showAllProducts() {
    const searchInput = document.getElementById('search-input');
    if (searchInput) searchInput.value = '';
    
    filteredProducts = [...allProducts];
    displayProducts(filteredProducts);
    updateFilterButtons();
}

// Atualizar botões de filtro
function updateFilterButtons(activeCategory = null) {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(btn => {
        btn.classList.remove('active');
        
        if (!activeCategory && btn.textContent === 'Todos') {
            btn.classList.add('active');
        } else if (btn.textContent === activeCategory) {
            btn.classList.add('active');
        }
    });
}

// Scroll suave para produtos
function scrollToProducts() {
    const productsSection = document.getElementById('products');
    if (productsSection) {
        productsSection.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Função global para formatar moeda (fallback)
if (typeof window.formatCurrency === 'undefined') {
    window.formatCurrency = function(value) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    };
}

// Função global para mostrar mensagens (fallback)
if (typeof window.showMessage === 'undefined') {
    window.showMessage = function(message, type = 'info') {
        console.log(`${type.toUpperCase()}: ${message}`);
        alert(message);
    };
}

// Exportar funções para uso global
window.searchProducts = searchProducts;
window.filterByCategory = filterByCategory;
window.showAllProducts = showAllProducts;
window.scrollToProducts = scrollToProducts;

