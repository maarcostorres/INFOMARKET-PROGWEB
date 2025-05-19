// Funções para o Dashboard Administrativo
document.addEventListener("DOMContentLoaded", function() {
    // Inicializar o gráfico de vendas se estiver na página de dashboard
    const salesChartCanvas = document.getElementById("salesChart");
    if (salesChartCanvas) {
        initSalesChart();
    }

    // Inicializar funcionalidades da página de produtos
    initProductsPage();

    // Inicializar funcionalidades da página de usuários
    initUsersPage();

    // Botões de período do gráfico
    const periodBtns = document.querySelectorAll(".period-btn");
    if (periodBtns.length > 0) {
        periodBtns.forEach(btn => {
            btn.addEventListener("click", function() {
                periodBtns.forEach(b => b.classList.remove("active"));
                this.classList.add("active");
                // Aqui você atualizaria o gráfico com base no período selecionado
                updateChartPeriod(this.textContent.trim());
            });
        });
    }
});

// Função para inicializar o gráfico de vendas
function initSalesChart() {
    const ctx = document.getElementById("salesChart").getContext("2d");
    
    const salesChart = new Chart(ctx, {
        type: "line",
        data: {
            labels: ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"],
            datasets: [{
                label: "Vendas (R$)",
                data: [450, 380, 520, 490, 600, 580, 430],
                backgroundColor: "rgba(231, 76, 60, 0.2)",
                borderColor: "#e74c3c",
                borderWidth: 2,
                tension: 0.3,
                pointBackgroundColor: "#e74c3c",
                pointRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: "rgba(0, 0, 0, 0.05)"
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });

    return salesChart;
}

// Função para atualizar o período do gráfico
function updateChartPeriod(period) {
    // Aqui você atualizaria os dados do gráfico com base no período selecionado
    console.log(`Período selecionado: ${period}`);
    // Exemplo: salesChart.data.labels = [...]; salesChart.data.datasets[0].data = [...]; salesChart.update();
}

// Função para inicializar a página de produtos
function initProductsPage() {
    // Verificar se estamos na página de produtos
    const productsTable = document.getElementById("products-table");
    if (!productsTable) return;

    // Botão para adicionar novo produto
    const addProductBtn = document.getElementById("add-product-btn");
    if (addProductBtn) {
        addProductBtn.addEventListener("click", function() {
            openProductModal();
        });
    }

    // Botões de edição de produto
    const editBtns = document.querySelectorAll("#products-table .edit-btn");
    editBtns.forEach(btn => {
        btn.addEventListener("click", function() {
            const productId = this.getAttribute("data-id");
            openProductModal(productId);
        });
    });

    // Botões de exclusão de produto
    const deleteBtns = document.querySelectorAll("#products-table .delete-btn");
    deleteBtns.forEach(btn => {
        btn.addEventListener("click", function() {
            const productId = this.getAttribute("data-id");
            if (confirm("Tem certeza que deseja excluir este produto?")) {
                deleteProduct(productId);
            }
        });
    });

    // Configurar o modal de produto
    const productModal = document.getElementById("product-modal");
    const modalClose = document.getElementById("modal-close");
    const modalCancel = document.getElementById("modal-cancel");
    const modalSave = document.getElementById("modal-save");

    if (modalClose) {
        modalClose.addEventListener("click", closeProductModal);
    }

    if (modalCancel) {
        modalCancel.addEventListener("click", closeProductModal);
    }

    if (modalSave) {
        modalSave.addEventListener("click", saveProduct);
    }

    // Filtro de busca de produtos
    const productSearch = document.getElementById("product-search");
    if (productSearch) {
        productSearch.addEventListener("input", function() {
            filterProducts(this.value);
        });
    }

    // Filtro de categoria
    const categoryFilter = document.getElementById("category-filter");
    if (categoryFilter) {
        categoryFilter.addEventListener("change", function() {
            filterProductsByCategory(this.value);
        });
    }
}

// Função para abrir o modal de produto
function openProductModal(productId = null) {
    const modal = document.getElementById("product-modal");
    const modalTitle = document.getElementById("modal-title");
    const form = document.getElementById("product-form");
    
    // Limpar o formulário
    form.reset();
    
    if (productId) {
        // Editar produto existente
        modalTitle.textContent = "Editar Produto";
        document.getElementById("product-id").value = productId;
        
        // Buscar dados do produto pelo ID
        const productRow = document.querySelector(`#products-table tr[data-id="${productId}"]`);
        if (productRow) {
            const productName = productRow.querySelector(".product-name").textContent;
            const productImage = productRow.querySelector("img").src;
            const prices = productRow.querySelectorAll("td:not(:first-child):not(:last-child):not(.product-name)");
            
            document.getElementById("product-name").value = productName;
            document.getElementById("product-image").value = productImage;
            
            // Preencher os preços (assumindo a ordem: Carone, Carrefour, Perim, BH)
            if (prices.length >= 4) {
                document.getElementById("price-carone").value = prices[0].textContent.replace("R$ ", "").replace(",", ".");
                document.getElementById("price-carrefour").value = prices[1].textContent.replace("R$ ", "").replace(",", ".");
                document.getElementById("price-perim").value = prices[2].textContent.replace("R$ ", "").replace(",", ".");
                document.getElementById("price-bh").value = prices[3].textContent.replace("R$ ", "").replace(",", ".");
            }
            
            // Categoria e descrição seriam preenchidas aqui se disponíveis
        }
    } else {
        // Novo produto
        modalTitle.textContent = "Adicionar Produto";
        document.getElementById("product-id").value = "";
    }
    
    // Exibir o modal
    modal.classList.add("active");
}

// Função para fechar o modal de produto
function closeProductModal() {
    const modal = document.getElementById("product-modal");
    modal.classList.remove("active");
}

// Função para salvar o produto
function saveProduct() {
    const productId = document.getElementById("product-id").value;
    const productName = document.getElementById("product-name").value;
    const productImage = document.getElementById("product-image").value;
    const priceCarone = parseFloat(document.getElementById("price-carone").value);
    const priceCarrefour = parseFloat(document.getElementById("price-carrefour").value);
    const pricePerim = parseFloat(document.getElementById("price-perim").value);
    const priceBH = parseFloat(document.getElementById("price-bh").value);
    
    // Validar os campos obrigatórios
    if (!productName || !productImage || isNaN(priceCarone) || isNaN(priceCarrefour) || isNaN(pricePerim) || isNaN(priceBH)) {
        alert("Por favor, preencha todos os campos obrigatórios.");
        return;
    }
    
    if (productId) {
        // Atualizar produto existente
        updateProductInTable(productId, productName, productImage, priceCarone, priceCarrefour, pricePerim, priceBH);
    } else {
        // Adicionar novo produto
        addProductToTable(productName, productImage, priceCarone, priceCarrefour, pricePerim, priceBH);
    }
    
    // Fechar o modal
    closeProductModal();
    
    // Mostrar mensagem de sucesso
    alert(productId ? "Produto atualizado com sucesso!" : "Produto adicionado com sucesso!");
}

// Função para atualizar um produto na tabela
function updateProductInTable(productId, name, image, priceCarone, priceCarrefour, pricePerim, priceBH) {
    const productRow = document.querySelector(`#products-table tr[data-id="${productId}"]`);
    if (productRow) {
        productRow.querySelector("img").src = image;
        productRow.querySelector(".product-name").textContent = name;
        
        const cells = productRow.querySelectorAll("td:not(:first-child):not(:last-child):not(.product-name)");
        if (cells.length >= 4) {
            cells[0].textContent = `R$ ${priceCarone.toFixed(2).replace(".", ",")}`;
            cells[1].textContent = `R$ ${priceCarrefour.toFixed(2).replace(".", ",")}`;
            cells[2].textContent = `R$ ${pricePerim.toFixed(2).replace(".", ",")}`;
            cells[3].textContent = `R$ ${priceBH.toFixed(2).replace(".", ",")}`;
        }
    }
    
    // Aqui você também atualizaria os dados no array de produtos
    updateProductInArray(productId, name, image, priceCarone, priceCarrefour, pricePerim, priceBH);
}

// Função para adicionar um novo produto à tabela
function addProductToTable(name, image, priceCarone, priceCarrefour, pricePerim, priceBH) {
    const productsTable = document.getElementById("products-table").querySelector("tbody");
    
    // Gerar um novo ID para o produto
    const newId = generateNewProductId();
    
    // Criar a nova linha da tabela
    const newRow = document.createElement("tr");
    newRow.setAttribute("data-id", newId);
    
    newRow.innerHTML = `
        <td><img src="${image}" alt="${name}"></td>
        <td class="product-name">${name}</td>
        <td>R$ ${priceCarone.toFixed(2).replace(".", ",")}</td>
        <td>R$ ${priceCarrefour.toFixed(2).replace(".", ",")}</td>
        <td>R$ ${pricePerim.toFixed(2).replace(".", ",")}</td>
        <td>R$ ${priceBH.toFixed(2).replace(".", ",")}</td>
        <td class="actions">
            <button class="btn edit-btn" data-id="${newId}"><i class="fas fa-edit"></i></button>
            <button class="btn delete-btn" data-id="${newId}"><i class="fas fa-trash"></i></button>
        </td>
    `;
    
    // Adicionar a nova linha à tabela
    productsTable.appendChild(newRow);
    
    // Adicionar event listeners aos novos botões
    newRow.querySelector(".edit-btn").addEventListener("click", function() {
        openProductModal(newId);
    });
    
    newRow.querySelector(".delete-btn").addEventListener("click", function() {
        if (confirm("Tem certeza que deseja excluir este produto?")) {
            deleteProduct(newId);
        }
    });
    
    // Aqui você também adicionaria o produto ao array de produtos
    addProductToArray(newId, name, image, priceCarone, priceCarrefour, pricePerim, priceBH);
}

// Função para excluir um produto
function deleteProduct(productId) {
    const productRow = document.querySelector(`#products-table tr[data-id="${productId}"]`);
    if (productRow) {
        productRow.remove();
    }
    
    // Aqui você também removeria o produto do array de produtos
    removeProductFromArray(productId);
    
    // Mostrar mensagem de sucesso
    alert("Produto excluído com sucesso!");
}

// Função para filtrar produtos por nome
function filterProducts(searchTerm) {
    const rows = document.querySelectorAll("#products-table tbody tr");
    searchTerm = searchTerm.toLowerCase();
    
    rows.forEach(row => {
        const productName = row.querySelector(".product-name").textContent.toLowerCase();
        if (productName.includes(searchTerm)) {
            row.style.display = "";
        } else {
            row.style.display = "none";
        }
    });
}

// Função para filtrar produtos por categoria
function filterProductsByCategory(category) {
    // Esta função seria implementada se você tiver a categoria visível na tabela
    // ou se você tiver um array de produtos com as categorias
    console.log(`Filtrar por categoria: ${category}`);
}

// Funções auxiliares para manipular o array de produtos
function generateNewProductId() {
    // Encontrar o maior ID atual e incrementar
    const rows = document.querySelectorAll("#products-table tbody tr");
    let maxId = 0;
    
    rows.forEach(row => {
        const id = parseInt(row.getAttribute("data-id"));
        if (id > maxId) {
            maxId = id;
        }
    });
    
    return maxId + 1;
}

function updateProductInArray(id, name, image, priceCarone, priceCarrefour, pricePerim, priceBH) {
    // Esta função atualizaria o produto no array de produtos
    // Exemplo: products[productIndex] = { id, name, image, prices: { ... } };
    console.log(`Produto atualizado no array: ${id}`);
}

function addProductToArray(id, name, image, priceCarone, priceCarrefour, pricePerim, priceBH) {
    // Esta função adicionaria o produto ao array de produtos
    // Exemplo: products.push({ id, name, image, prices: { ... } });
    console.log(`Produto adicionado ao array: ${id}`);
}

function removeProductFromArray(id) {
    // Esta função removeria o produto do array de produtos
    // Exemplo: products = products.filter(p => p.id !== id);
    console.log(`Produto removido do array: ${id}`);
}