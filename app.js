
/* JH Pizzaria — interações e funcionalidades do site. */
(() => {
    'use strict';

    // Seletores e funções auxiliares.
    const $ = (selector, scope = document) =>
        scope.querySelector(selector);

    const $$ = (selector, scope = document) =>
        [...scope.querySelectorAll(selector)];

    const money = value =>
        value.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });

    // Produtos disponíveis no cardápio.
    const PRODUCTS = {
        p1: {
            id: 'p1',
            name: 'Margherita',
            price: 42.90,
            image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=300&q=80'
        },

        p2: {
            id: 'p2',
            name: 'Calabresa da JH',
            price: 45.90,
            image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=300&q=80'
        },

        p3: {
            id: 'p3',
            name: 'Quatro Queijos',
            price: 49.90,
            image: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=300&q=80'
        },

        p4: {
            id: 'p4',
            name: 'Pepperoni',
            price: 52.90,
            image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=300&q=80'
        },

        p5: {
            id: 'p5',
            name: 'Chocolate & Morango',
            price: 39.90,
            image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=300&q=80'
        },

        p6: {
            id: 'p6',
            name: 'Brigadeiro',
            price: 37.90,
            image: 'https://images.unsplash.com/photo-1579751626657-72bc17010498?auto=format&fit=crop&w=300&q=80'
        },

        p7: {
            id: 'p7',
            name: 'Refrigerante lata',
            price: 6.90,
            image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=300&q=80'
        },

        p8: {
            id: 'p8',
            name: 'Água mineral',
            price: 4.50,
            image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=300&q=80'
        }
    };

    // Recupera os produtos armazenados no carrinho.
    const getCart = () => {
        try {
            return JSON.parse(
                localStorage.getItem('jhCart') || '[]'
            );
        } catch {
            return [];
        }
    };

    // Salva o carrinho e atualiza o contador.
    const saveCart = cart => {
        localStorage.setItem(
            'jhCart',
            JSON.stringify(cart)
        );

        updateCartCount();
    };

    // Exibe mensagens na tela.
    const showToast = message => {
        const toast = $('#toast');

        if (!toast) return;

        toast.textContent = message;
        toast.classList.add('show');

        clearTimeout(showToast.timer);

        showToast.timer = setTimeout(() => {
            toast.classList.remove('show');
        }, 2600);
    };

    // Atualiza a quantidade de produtos no ícone do carrinho.
    function updateCartCount() {
        const count = getCart().reduce(
            (sum, item) => sum + item.qty,
            0
        );

        $$('[data-cart-count]').forEach(el => {
            el.textContent = count;
        });
    }

    // Adiciona produtos ao carrinho.
    function addToCart(id) {
        const product = PRODUCTS[id];

        if (!product) return;

        const cart = getCart();

        const found = cart.find(item => item.id === id);

        if (found) {
            found.qty++;
        } else {
            cart.push({
                ...product,
                qty: 1
            });
        }

        saveCart(cart);

        showToast(
            `${product.name} adicionado ao carrinho.`
        );
    }

    // Menu de navegação para dispositivos móveis.
    $('#menuToggle')?.addEventListener('click', () => {
        const nav = $('#primaryNav');

        const open = nav.classList.toggle('open');

        $('#menuToggle').setAttribute(
            'aria-expanded',
            String(open)
        );

        $('#menuToggle').setAttribute(
            'aria-label',
            open ? 'Fechar menu' : 'Abrir menu'
        );
    });

    // Botões de adicionar ao carrinho.
    $$('.add-cart').forEach(button => {
        button.addEventListener('click', () => {
            addToCart(button.dataset.id);
        });
    });

    updateCartCount();

    // Busca e filtros do cardápio.
    const search = $('#productSearch');

    let activeCategory = 'Todas';

    function filterProducts() {
        if (!$('#productGrid')) return;

        const term = (search?.value || '')
            .trim()
            .toLocaleLowerCase('pt-BR');

        let visible = 0;

        $$('.menu-product').forEach(card => {
            const categoryMatch =
                activeCategory === 'Todas' ||
                card.dataset.category === activeCategory;

            const textMatch = (
                card.dataset.name +
                ' ' +
                card.dataset.ingredients +
                ' ' +
                card.dataset.category.toLowerCase()
            ).includes(term);

            const show = categoryMatch && textMatch;

            card.hidden = !show;

            if (show) {
                visible++;
            }
        });

        $('#noProducts').hidden = visible !== 0;
    }

    search?.addEventListener('input', filterProducts);

    // Botões de categorias.
    $$('.filter-btn').forEach(button => {
        button.addEventListener('click', () => {
            activeCategory = button.dataset.filter;

            $$('.filter-btn').forEach(btn => {
                const active = btn === button;

                btn.classList.toggle('active', active);

                btn.setAttribute(
                    'aria-pressed',
                    String(active)
                );
            });

            filterProducts();
        });
    });

    // Funções do carrinho.
    function renderCart() {
        const host = $('#cartItems');

        if (!host) return;

        const cart = getCart();

        host.innerHTML = '';

        // Exibe mensagem quando o carrinho está vazio.
        if (!cart.length) {
            host.innerHTML = `
                <div class="form-card center-card">
                    <div class="user-icon">🛒</div>

                    <h2 style="font-size:1.7rem">
                        Seu carrinho está vazio
                    </h2>

                    <p class="muted">
                        Que tal escolher uma pizza deliciosa?
                    </p>

                    <a class="btn btn-primary" href="cardapio.html">
                        Explorar cardápio
                    </a>
                </div>
            `;

            updateTotals();

            return;
        }

        // Cria os itens do carrinho.
        cart.forEach(item => {
            const row = document.createElement('article');

            row.className = 'cart-item';

            row.innerHTML = `
                <img src="${item.image}" alt="">

                <div>
                    <h3 style="margin:0">
                        ${item.name}
                    </h3>

                    <p>
                        ${money(item.price)} / unidade
                    </p>

                    <div class="quantity">
                        <button
                            type="button"
                            data-action="minus"
                            aria-label="Diminuir quantidade"
                        >
                            −
                        </button>

                        <strong>
                            ${item.qty}
                        </strong>

                        <button
                            type="button"
                            data-action="plus"
                            aria-label="Aumentar quantidade"
                        >
                            +
                        </button>
                    </div>
                </div>

                <div class="cart-item-price">
                    <strong>
                        ${money(item.price * item.qty)}
                    </strong>

                    <br>

                    <button
                        class="remove-btn"
                        type="button"
                        data-action="remove"
                    >
                        Remover
                    </button>
                </div>
            `;

            row.querySelectorAll('button').forEach(btn => {
                btn.addEventListener('click', () => {
                    changeItem(
                        item.id,
                        btn.dataset.action
                    );
                });
            });

            host.append(row);
        });

        updateTotals();
    }

    // Altera a quantidade ou remove um produto.
    function changeItem(id, action) {
        let cart = getCart();

        const item = cart.find(x => x.id === id);

        if (!item) return;

        if (action === 'plus') {
            item.qty++;
        }

        if (action === 'minus') {
            item.qty--;
        }

        if (action === 'remove' || item.qty <= 0) {
            cart = cart.filter(x => x.id !== id);
        }

        saveCart(cart);

        renderCart();
    }

    // Valores de entrega e desconto.
    let deliveryFee = 0;

    let discountRate = 0;

    // Atualiza os valores do resumo do pedido.
    function updateTotals() {
        const subtotal = getCart().reduce(
            (sum, item) => sum + item.price * item.qty,
            0
        );

        const discount = subtotal * discountRate;

        const fee = subtotal ? deliveryFee : 0;

        if ($('#subtotal')) {
            $('#subtotal').textContent = money(subtotal);
        }

        if ($('#deliveryFee')) {
            $('#deliveryFee').textContent = money(fee);
        }

        if ($('#discountValue')) {
            $('#discountValue').textContent =
                '− ' + money(discount);
        }

        if ($('#discountLine')) {
            $('#discountLine').hidden = discountRate === 0;
        }

        if ($('#total')) {
            $('#total').textContent = money(
                Math.max(0, subtotal + fee - discount)
            );
        }

        if ($('#checkoutBtn')) {
            $('#checkoutBtn').disabled = subtotal === 0;
        }
    }

    // Cálculo demonstrativo do frete.
    $('#shippingForm')?.addEventListener('submit', e => {
        e.preventDefault();

        const cep = $('#cep').value.replace(/\D/g, '');

        if (cep.length !== 8) {
            showToast(
                'Informe um CEP válido com 8 números.'
            );

            return;
        }

        deliveryFee = 7.90;

        updateTotals();

        showToast(
            'Frete demonstrativo de R$ 7,90 calculado.'
        );
    });

    // Aplicação de cupom de desconto.
    $('#couponForm')?.addEventListener('submit', e => {
        e.preventDefault();

        const code = $('#cupom')
            .value
            .trim()
            .toUpperCase();

        if (code === 'JH10') {
            discountRate = 0.10;

            showToast(
                'Cupom JH10 aplicado: 10% de desconto.'
            );
        } else {
            discountRate = 0;

            showToast(
                'Cupom não reconhecido.'
            );
        }

        updateTotals();
    });

    
    
$('#checkoutBtn')?.addEventListener('click', async () => {
    const cart = getCart();

    if (!cart.length) return;

    const email = localStorage.getItem('jhUsuario');

    if (!email) {
        showToast('Faça login antes de finalizar o pedido.');
        return;
    }

    const idsProdutos = {
        p1: 5,
        p2: 6,
        p3: 7,
        p4: 8,
        p5: 9,
        p6: 10,
        p7: 11,
        p8: 12
    };

    const pedido = {
        email: email,
        itens: cart.map(item => ({
            produtoId: idsProdutos[item.id],
            quantidade: item.qty
        }))
    };

    try {
        const resposta = await fetch(
            'https://localhost:7121/api/Pedidos',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(pedido)
            }
        );

        const resultado = await resposta.json();

        if (!resposta.ok) {
            showToast(resultado.mensagem || 'Erro ao realizar pedido.');
            return;
        }

        localStorage.removeItem('jhCart');

        deliveryFee = 0;
        discountRate = 0;

        updateCartCount();
        renderCart();

        showToast('Pedido realizado com sucesso!');

    } catch (erro) {
        console.error(erro);
        showToast('Não foi possível conectar à API.');
    }
});


    renderCart();

    // Simulação de sessão na página de pedidos.
    $('#toggleOrders')?.addEventListener('click', () => {
        const logged = $('#loggedIn').hidden;

        $('#loggedIn').hidden = !logged;

        $('#loggedOut').hidden = logged;

        $('#toggleOrders').textContent = logged
            ? 'Voltar ao estado deslogado'
            : 'Simular usuário logado';
    });

    // Validação dos formulários.
    [
        'loginForm',
        'registerForm',
        'profileForm'
    ].forEach(id => {
        $('#' + id)?.addEventListener('submit', e => {
            e.preventDefault();

            if (!e.currentTarget.reportValidity()) {
                return;
            }

            showToast(
                'Formulário preenchido e validado com sucesso.'
            );
        });
    });

    // Recuperação de senha demonstrativa.
    $('#forgotPassword')?.addEventListener('click', e => {
        e.preventDefault();

        showToast(
            'Solicitação de recuperação de senha registrada.'
        );
    });

    // Encerramento da sessão demonstrativa.
    $('#logoutBtn')?.addEventListener('click', () => {
        showToast('Sessão demonstrativa encerrada.');

        location.href = 'index.html';
    });

})();

// LOGIN DA JH PIZZARIA
const loginForm = document.querySelector('#loginForm');

loginForm?.addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = document.querySelector('#email').value.trim();
    const senha = document.querySelector('#password').value;

    try {
        const resposta = await fetch(
            'https://localhost:7121/api/auth/login',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    senha: senha
                })
            }
        );

        const dados = await resposta.json();

        if (!resposta.ok) {
            alert(dados.mensagem || 'E-mail ou senha incorretos.');
            return;
        }

        localStorage.setItem('jhUsuario', email);

        alert('Login realizado com sucesso!');

        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);

    } catch (erro) {
        console.error(erro);
        alert('Não foi possível conectar ao servidor.');
    }
});

// CADASTRO DA JH PIZZARIA
const registerForm = document.querySelector('#registerForm');

registerForm?.addEventListener('submit', async (event) => {
    event.preventDefault();

    const nome = document.querySelector('#nome').value.trim();
    const telefone = document.querySelector('#telefone').value.trim();
    const email = document.querySelector('#email').value.trim();
    const senha = document.querySelector('#senha').value;

    if (senha.length < 8) {
        alert('A senha deve ter pelo menos 8 caracteres.');
        return;
    }

    try {
        const resposta = await fetch(
            'https://localhost:7121/api/auth/cadastro',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    nome: nome,
                    telefone: telefone,
                    email: email,
                    senha: senha
                })
            }
        );

        const dados = await resposta.json();

        if (!resposta.ok) {
            alert(dados.mensagem || dados.detalhe || 'Erro ao realizar cadastro.');
            return;
        }

        alert('Conta criada com sucesso! Faça seu login.');

        window.location.href = 'login.html';

    } catch (erro) {
        console.error(erro);
        alert('Não foi possível conectar ao servidor.');
    }
});

// CONTROLE DE LOGIN NA PÁGINA MEUS PEDIDOS
const loggedOut = document.querySelector('#loggedOut');
const loggedIn = document.querySelector('#loggedIn');

if (loggedOut && loggedIn) {
    const usuario = localStorage.getItem('jhUsuario');

    if (usuario) {
        loggedOut.hidden = true;
        loggedIn.hidden = false;
    } else {
        loggedOut.hidden = false;
        loggedIn.hidden = true;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const usuario = localStorage.getItem('jhUsuario');
    const navActions = document.querySelector('.nav-actions');

    if (usuario && navActions) {
        navActions.innerHTML = `
            <a class="btn btn-outline btn-small" href="perfil.html">
                Minha conta
            </a>

            <button class="btn btn-primary btn-small" id="logoutBtn">
                Sair
            </button>
        `;

        document.querySelector('#logoutBtn').addEventListener('click', () => {
            localStorage.removeItem('jhUsuario');
            window.location.href = 'index.html';
        });
    }
});

document.addEventListener('DOMContentLoaded', async () => {
    const lista = document.querySelector('#listaPedidos');
    const semPedidos = document.querySelector('#semPedidos');
    const loggedIn = document.querySelector('#loggedIn');

    if (!lista || !loggedIn) return;

    const email = localStorage.getItem('jhUsuario');

    if (!email) return;

    try {
        const resposta = await fetch(
            `https://localhost:7121/api/Pedidos/historico?email=${encodeURIComponent(email)}`
        );

        if (!resposta.ok) {
            throw new Error('Erro ao buscar pedidos.');
        }

        const pedidos = await resposta.json();

        lista.innerHTML = '';

        if (pedidos.length === 0) {
            semPedidos.hidden = false;
            return;
        }

        semPedidos.hidden = true;

        pedidos.forEach(pedido => {
            const cartao = document.createElement('article');
            cartao.className = 'order-card';

            const data = new Date(pedido.data).toLocaleDateString('pt-BR');

            cartao.innerHTML = `
                <div class="order-top">
                    <div>
                        <span class="eyebrow">
                            Pedido #${pedido.id}
                        </span>
                        <h3 style="margin:5px 0">
                            Pedido de ${data}
                        </h3>
                    </div>

                    <span class="status">
                        ${pedido.status}
                    </span>
                </div>

                <strong>
                    R$ ${Number(pedido.total).toFixed(2).replace('.', ',')}
                </strong>
            `;

            lista.appendChild(cartao);
        });

    } catch (erro) {
        console.error('Erro no histórico:', erro);
        lista.textContent = 'Não foi possível carregar seus pedidos.';
    }
});
