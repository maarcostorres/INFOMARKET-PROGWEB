// FUNCTION DE ALTERAÇÃO DA BARRA LATERAL
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar');
    const main = document.querySelector('main');
    
    // Em telas menores, a sidebar começa fechada
    if (window.innerWidth < 992) {
        sidebar.classList.remove('active');
        main.classList.remove('sidebar-active');
    } else {
        sidebar.classList.add('active');
        main.classList.add('sidebar-active');
    }
    
    menuToggle.addEventListener('click', function() {
        sidebar.classList.toggle('active');
        main.classList.toggle('sidebar-active');
    });
    
    // Fechar a sidebar quando clicar fora dela em telas pequenas
    document.addEventListener('click', function(event) {
        if (window.innerWidth < 992 && 
            !sidebar.contains(event.target) && 
            !menuToggle.contains(event.target) && 
            sidebar.classList.contains('active')) {
            sidebar.classList.remove('active');
            main.classList.remove('sidebar-active');
        }
    });
    
    // LOAD PRODUTOS
    loadProducts();
});

// Dados de exemplo para produtos
// Esta é a parte que você pode modificar para adicionar novos produtos
const products = [
    {
        id: 1,
        name: "Arroz Branco Tipo 1 - 5kg",
        image: "/placeholder.svg?height=200&width=200",
        prices: {
            "Carone": 22.90,
            "Carrefour": 24.50,
            "Perim": 23.99,
            "BH": 22.99
        }
    },
    {
        id: 2,
        name: "Feijão Preto - 1kg",
        image: "/placeholder.svg?height=200&width=200",
        prices: {
            "Carone": 7.49,
            "Carrefour": 7.99,
            "Perim": 7.29,
            "BH": 7.89
        }
    },
    {
        id: 3,
        name: "Farinha de Trigo - 1kg",
        image: "/placeholder.svg?height=200&width=200",
        prices: {
            "Carone": 5.99,
            "Carrefour": 6.49,
            "Perim": 5.89,
            "BH": 6.19
        }
    },
    {
        id: 4,
        name: "Café em Pó - 500g",
        image: "/placeholder.svg?height=200&width=200",
        prices: {
            "Carone": 16.90,
            "Carrefour": 17.99,
            "Perim": 16.49,
            "BH": 17.29
        }
    },
    {
        id: 5,
        name: "Açúcar Cristal - 5kg",
        image: "/placeholder.svg?height=200&width=200",
        prices: {
            "Carone": 15.99,
            "Carrefour": 16.49,
            "Perim": 15.79,
            "BH": 16.29
        }
    },
    {
        id: 6,
        name: "Óleo de Soja - 900ml",
        image: "/placeholder.svg?height=200&width=200",
        prices: {
            "Carone": 4.79,
            "Carrefour": 4.99,
            "Perim": 4.69,
            "BH": 4.89
        }
    }
];

// Função para carregar produtos na página
function loadProducts() {
    const productsContainer = document.getElementById('products-container');
    if (!productsContainer) return;
    
    productsContainer.innerHTML = '';
    
    products.forEach(product => {
        // Encontrar o menor preço
        let minPrice = Infinity;
        let minPriceStore = '';
        
        for (const [store, price] of Object.entries(product.prices)) {
            if (price < minPrice) {
                minPrice = price;
                minPriceStore = store;
            }
        }
        
        // Criar elemento de produto
        const productElement = document.createElement('div');
        productElement.className = 'product-card';
        
        // Formatar HTML do produto
        productElement.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <table class="price-comparison-table">
                    <tbody>
                        ${Object.entries(product.prices).map(([store, price]) => `
                            <tr>
                                <th>${store}</th>
                                <td class="${store === minPriceStore ? 'best-price' : ''}">
                                    R$ ${price.toFixed(2).replace('.', ',')}
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                <button class="add-to-cart">Adicionar ao Carrinho</button>
            </div>
        `;
        
        productsContainer.appendChild(productElement);
    });
}

// Função para adicionar novos produtos (você pode chamar esta função para adicionar produtos)
function addNewProduct(name, image, prices) {
    const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
    
    const newProduct = {
        id: newId,
        name: name,
        image: image || "/placeholder.svg?height=200&width=200",
        prices: prices || {
            "Carone": 0,
            "Carrefour": 0,
            "Perim": 0,
            "BH": 0
        }
    };
    
    products.push(newProduct);
    loadProducts(); // Recarregar a lista de produtos
    
    return newProduct;
}

// Exemplo de como adicionar um novo produto:
// addNewProduct(
//     "Sabão em Pó - 1kg", 
//     "/placeholder.svg?height=200&width=200", 
//     {
//         "Carone": 12.90,
//         "Carrefour": 13.49,
//         "Perim": 12.99,
//         "BH": 13.29
//     }
// );

// Fvck exemple