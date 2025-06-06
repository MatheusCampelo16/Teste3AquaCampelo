document.addEventListener('DOMContentLoaded', function() {
    // Elementos do DOM
    const cartIcon = document.querySelector('.cart-icon');
    const cartOverlay = document.querySelector('.cart-overlay');
    const closeCart = document.querySelector('.close-cart');
    const cartContent = document.querySelector('.cart-content');
    const totalPrice = document.querySelector('.total-price');
    const cartCount = document.querySelector('.cart-count');
    const addToCartBtns = document.querySelectorAll('.add-to-cart');
    const checkoutBtn = document.querySelector('.checkout-btn');
    const contactForm = document.getElementById('contact-form');
    const formMessage = document.getElementById('form-message');
    const menuMobile = document.querySelector('.menu-mobile');
    const navMenu = document.querySelector('nav ul');
    
    // Carrinho de compras
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Produtos
    const products = [
        { id: '1', name: 'Água Mineral 500ml', price: 2.50, image: 'assets/produtos/agua-mineral.jpg' },
        { id: '2', name: 'Água com Gás 1L', price: 4.90, image: 'assets/produtos/agua-gas.jpg' },
        { id: '3', name: 'Água Alcalina 500ml', price: 5.90, image: 'assets/produtos/agua-alcalina.jpg' }
    ];
    
    // Funções do carrinho
    function updateCart() {
        // Salvar no localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Atualizar contador
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = totalItems;
        
        // Atualizar total
        const total = cart.reduce((sum, item) => {
            const product = products.find(p => p.id === item.id);
            return sum + (product.price * item.quantity);
        }, 0);
        totalPrice.textContent = `R$ ${total.toFixed(2)}`;
        
        // Renderizar itens
        renderCartItems();
    }
    
    function renderCartItems() {
        if (cart.length === 0) {
            cartContent.innerHTML = '<p class="empty-cart">Seu carrinho está vazio</p>';
            return;
        }
        
        cartContent.innerHTML = '';
        
        cart.forEach(item => {
            const product = products.find(p => p.id === item.id);
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <div class="cart-item-info">
                    <h4>${product.name}</h4>
                    <p>R$ ${product.price.toFixed(2)}</p>
                    <div class="quantity-controls">
                        <button class="decrease" data-id="${item.id}">-</button>
                        <span>${item.quantity}</span>
                        <button class="increase" data-id="${item.id}">+</button>
                    </div>
                </div>
                <button class="cart-item-remove" data-id="${item.id}">
                    <i class="fas fa-trash"></i>
                </button>
            `;
            cartContent.appendChild(cartItem);
        });
        
        // Adicionar eventos
        document.querySelectorAll('.decrease').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                changeQuantity(id, -1);
            });
        });
        
        document.querySelectorAll('.increase').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                changeQuantity(id, 1);
            });
        });
        
        document.querySelectorAll('.cart-item-remove').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                removeItem(id);
            });
        });
    }
    
    function changeQuantity(id, change) {
        const item = cart.find(item => item.id === id);
        
        if (item) {
            item.quantity += change;
            
            if (item.quantity <= 0) {
                cart = cart.filter(item => item.id !== id);
            }
            
            updateCart();
        }
    }
    
    function removeItem(id) {
        cart = cart.filter(item => item.id !== id);
        updateCart();
    }
    
    // Adicionar ao carrinho
    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            const existingItem = cart.find(item => item.id === id);
            
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({ id, quantity: 1 });
            }
            
            // Feedback visual
            this.textContent = 'Adicionado!';
            setTimeout(() => {
                this.textContent = 'Adicionar';
            }, 1000);
            
            updateCart();
        });
    });
    
    // Finalizar compra
    checkoutBtn.addEventListener('click', function() {
        if (cart.length === 0) {
            alert('Seu carrinho está vazio!');
            return;
        }
        
        alert('Compra finalizada com sucesso! Obrigado.');
        cart = [];
        updateCart();
        closeCart.click();
    });
    
    // Formulário de contato
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Simular envio
        setTimeout(() => {
            formMessage.textContent = 'Mensagem enviada com sucesso! Entraremos em contato em breve.';
            formMessage.className = 'form-message success';
            this.reset();
            
            // Esconder mensagem após 5 segundos
            setTimeout(() => {
                formMessage.style.display = 'none';
            }, 5000);
        }, 1000);
    });
    
    // Menu mobile
    menuMobile.addEventListener('click', function() {
        navMenu.classList.toggle('active');
    });
    
    // Abrir/fechar carrinho
    cartIcon.addEventListener('click', function() {
        cartOverlay.style.display = 'flex';
    });
    
    closeCart.addEventListener('click', function() {
        cartOverlay.style.display = 'none';
    });
    
    cartOverlay.addEventListener('click', function(e) {
        if (e.target === cartOverlay) {
            cartOverlay.style.display = 'none';
        }
    });
    
    // Inicializar
    updateCart();
});