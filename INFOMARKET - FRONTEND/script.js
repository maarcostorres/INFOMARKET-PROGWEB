// Funções de tema e sidebar
function toggleTheme() {
    const body = document.body
    const themeToggleBtn = document.getElementById("theme-toggle-btn")
  
    body.classList.toggle("dark-mode")
    body.classList.toggle("light-mode")
  
    const isDarkMode = body.classList.contains("dark-mode")
    themeToggleBtn.innerHTML = isDarkMode ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>'
  
    // Salvar preferência do usuário
    localStorage.setItem("theme", isDarkMode ? "dark" : "light")
  }
  
  // Função para alternar a barra lateral
  document.addEventListener("DOMContentLoaded", () => {
    const menuToggle = document.getElementById("menu-toggle")
    const sidebar = document.getElementById("sidebar")
    const main = document.querySelector("main")
  
    // Verificar se os elementos existem antes de continuar
    if (!menuToggle || !sidebar || !main) return
  
    function toggleSidebar() {
      sidebar.classList.toggle("active")
      main.classList.toggle("sidebar-active")
    }
  
    // Inicialização da sidebar
    if (window.innerWidth >= 992) {
      sidebar.classList.add("active")
      main.classList.add("sidebar-active")
    } else {
      sidebar.classList.remove("active")
      main.classList.remove("sidebar-active")
    }
  
    // Adicionar evento de clique ao botão de menu
    menuToggle.addEventListener("click", (event) => {
      event.stopPropagation()
      toggleSidebar()
    })
  
    // Fechar a sidebar quando clicar fora dela em telas pequenas
    document.addEventListener("click", (event) => {
      if (
        window.innerWidth < 992 &&
        sidebar &&
        menuToggle &&
        !sidebar.contains(event.target) &&
        !menuToggle.contains(event.target) &&
        sidebar.classList.contains("active")
      ) {
        toggleSidebar()
      }
    })
  
    // Impedir que cliques dentro da sidebar a fechem
    sidebar.addEventListener("click", (event) => {
      event.stopPropagation()
    })
  
    // Ajustar a sidebar ao redimensionar a janela
    window.addEventListener("resize", () => {
      if (window.innerWidth >= 992) {
        sidebar.classList.add("active")
        main.classList.add("sidebar-active")
      } else {
        sidebar.classList.remove("active")
        main.classList.remove("sidebar-active")
      }
    })
  
    // Configurar o botão de alternância de tema
    const themeToggleBtn = document.getElementById("theme-toggle-btn")
    if (themeToggleBtn) {
      themeToggleBtn.addEventListener("click", toggleTheme)
    }
  
    // Verificar e aplicar o tema salvo
    const savedTheme = localStorage.getItem("theme")
    if (savedTheme === "dark") {
      document.body.classList.add("dark-mode")
      document.body.classList.remove("light-mode")
      if (themeToggleBtn) {
        themeToggleBtn.innerHTML = '<i class="fas fa-moon"></i>'
      }
    }
  
    // Carregar produtos
    loadProducts()
  
    // Atualizar contador do carrinho
    updateCartCount()
  
    // Se estiver na página do carrinho, renderizar os itens
    if (window.location.pathname.includes("cart.html")) {
      renderCartItems()
    }
  
    // Inicializar funcionalidades da página de perfil
    initProfilePage()

    // Verificar se o usuário é administrador
    checkAdminStatus()
  })
  
  // Dados de exemplo para produtos
  const products = [
    {
      id: 1,
      name: "Arroz Branco Tipo 1 - 5kg",
      image: "/images/Arroz.png",
      prices: {
        Carone: 22.9,
        Carrefour: 24.5,
        Perim: 23.99,
        BH: 22.99,
      },
    },
    {
      id: 2,
      name: "Feijão Preto - 1kg",
      image: "/images/feijão.png",
      prices: {
        Carone: 7.49,
        Carrefour: 7.99,
        Perim: 7.29,
        BH: 7.89,
      },
    },
    {
      id: 3,
      name: "Farinha de Trigo - 1kg",
      image: "/images/Farinha de Trigo.png",
      prices: {
        Carone: 5.99,
        Carrefour: 6.49,
        Perim: 5.89,
        BH: 6.19,
      },
    },
    {
      id: 4,
      name: "Café em Pó - 500g",
      image: "/images/cafe.png",
      prices: {
        Carone: 16.9,
        Carrefour: 17.99,
        Perim: 16.49,
        BH: 17.29,
      },
    },
    {
      id: 5,
      name: "Açúcar Cristal - 5kg",
      image: "/images/acucar.png",
      prices: {
        Carone: 15.99,
        Carrefour: 16.49,
        Perim: 15.79,
        BH: 16.29,
      },
    },
    {
      id: 6,
      name: "Óleo de Soja - 900ml",
      image: "/images/soja.png",
      prices: {
        Carone: 4.79,
        Carrefour: 4.99,
        Perim: 4.69,
        BH: 4.89,
      },
    },
  ]
  
  // Função para carregar produtos na página
  function loadProducts() {
    const productsContainer = document.getElementById("products-container")
    if (!productsContainer) return
  
    productsContainer.innerHTML = ""
  
    products.forEach((product) => {
      // Encontrar o menor preço
      let minPrice = Number.POSITIVE_INFINITY
      let minPriceStore = ""
  
      for (const [store, price] of Object.entries(product.prices)) {
        if (price < minPrice) {
          minPrice = price
          minPriceStore = store
        }
      }
  
      // Criar elemento de produto
      const productElement = document.createElement("div")
      productElement.className = "product-card"
  
      // Formatar HTML do produto
      productElement.innerHTML = `
              <div class="product-image">
                  <img src="${product.image}" alt="${product.name}">
              </div>
              <div class="product-info">
                  <h3 class="product-name">${product.name}</h3>
                  <table class="price-comparison-table">
                      <tbody>
                          ${Object.entries(product.prices)
                            .map(
                              ([store, price]) => `
                              <tr>
                                  <th>${store}</th>
                                  <td class="${store === minPriceStore ? "best-price" : ""}">
                                      R$ ${price.toFixed(2).replace(".", ",")}
                                  </td>
                              </tr>
                          `,
                            )
                            .join("")}
                      </tbody>
                  </table>
                  <button class="add-to-cart" data-product-id="${product.id}">Adicionar ao Carrinho</button>
              </div>
          `
  
      productsContainer.appendChild(productElement)
    })
  
    // Adicionar event listeners aos botões de adicionar ao carrinho
    const addToCartButtons = document.querySelectorAll(".add-to-cart")
    addToCartButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const productId = Number.parseInt(this.getAttribute("data-product-id"))
        addToCart(productId)
      })
    })
  }
  
  // Função para adicionar novos produtos (você pode chamar esta função para adicionar produtos)
  function addNewProduct(name, image, prices) {
    const newId = products.length > 0 ? Math.max(...products.map((p) => p.id)) + 1 : 1
  
    const newProduct = {
      id: newId,
      name: name,
      image: image || "/placeholder.svg?height=200&width=200",
      prices: prices || {
        Carone: 0,
        Carrefour: 0,
        Perim: 0,
        BH: 0,
      },
    }
  
    products.push(newProduct)
    loadProducts() // Recarregar a lista de produtos
  
    return newProduct
  }
  
  // FUNÇÕES DO CARRINHO
  
  // Função para obter o carrinho do localStorage
  function getCart() {
    const cart = localStorage.getItem("cart")
    return cart ? JSON.parse(cart) : []
  }
  
  // Função para salvar o carrinho no localStorage
  function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart))
  }
  
  // Função para adicionar um produto ao carrinho
  function addToCart(productId) {
    const cart = getCart()
    const product = products.find((p) => p.id === productId)
  
    if (!product) return
  
    // Verificar se o produto já está no carrinho
    const existingItem = cart.find((item) => item.id === productId)
  
    if (existingItem) {
      existingItem.quantity += 1
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        image: product.image,
        prices: product.prices,
        quantity: 1,
      })
    }
  
    saveCart(cart)
    updateCartCount()
  
    // Mostrar feedback ao usuário
    alert(`${product.name} adicionado ao carrinho!`)
  }
  
  // Função para remover um produto do carrinho
  function removeFromCart(productId) {
    let cart = getCart()
    cart = cart.filter((item) => item.id !== productId)
    saveCart(cart)
    updateCartCount()
  
    // Se estiver na página do carrinho, atualizar a visualização
    if (window.location.pathname.includes("cart.html")) {
      renderCartItems()
    }
  }
  
  // Função para atualizar a quantidade de um produto no carrinho
  function updateCartItemQuantity(productId, quantity) {
    const cart = getCart()
    const item = cart.find((item) => item.id === productId)
  
    if (item) {
      item.quantity = Math.max(1, quantity) // Garantir que a quantidade seja pelo menos 1
      saveCart(cart)
  
      // Se estiver na página do carrinho, atualizar a visualização
      if (window.location.pathname.includes("cart.html")) {
        renderCartItems()
      }
    }
  
    updateCartCount()
  }
  
  // Função para atualizar o contador de itens no carrinho
  function updateCartCount() {
    const cart = getCart()
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0)
  
    const cartCountElements = document.querySelectorAll("#cart-count")
    cartCountElements.forEach((element) => {
      element.textContent = totalItems
    })
  }
  
  // Função para encontrar o melhor preço de um produto
  function findBestPrice(prices) {
    let minPrice = Number.POSITIVE_INFINITY
    let minPriceStore = ""
  
    for (const [store, price] of Object.entries(prices)) {
      if (price < minPrice) {
        minPrice = price
        minPriceStore = store
      }
    }
  
    return { store: minPriceStore, price: minPrice }
  }
  
  // Função para calcular o total do carrinho
  function calculateCartTotal() {
    const cart = getCart()
    let total = 0
    let regularTotal = 0 // Total sem considerar os melhores preços
  
    cart.forEach((item) => {
      const bestPrice = findBestPrice(item.prices)
      total += bestPrice.price * item.quantity
  
      // Calcular o total regular usando o preço médio
      const avgPrice =
        Object.values(item.prices).reduce((sum, price) => sum + price, 0) / Object.values(item.prices).length
      regularTotal += avgPrice * item.quantity
    })
  
    return {
      total: total,
      savings: regularTotal - total,
    }
  }
  
  // Função para renderizar os itens do carrinho na página do carrinho
  function renderCartItems() {
    const cartItemsContainer = document.getElementById("cart-items")
    const emptyCartElement = document.getElementById("empty-cart")
    const cartSummaryElement = document.getElementById("cart-summary")
    const subtotalElement = document.getElementById("cart-subtotal")
    const totalElement = document.getElementById("cart-total")
    const savingsElement = document.getElementById("savings-amount")
  
    if (!cartItemsContainer) return
  
    const cart = getCart()
  
    // Mostrar mensagem de carrinho vazio se não houver itens
    if (cart.length === 0) {
      if (emptyCartElement) emptyCartElement.style.display = "block"
      if (cartSummaryElement) cartSummaryElement.style.display = "none"
      return
    }
  
    // Esconder mensagem de carrinho vazio e mostrar o resumo
    if (emptyCartElement) emptyCartElement.style.display = "none"
    if (cartSummaryElement) cartSummaryElement.style.display = "block"
  
    // Limpar o container de itens (exceto a mensagem de carrinho vazio)
    const itemsToRemove = cartItemsContainer.querySelectorAll(".cart-item")
    itemsToRemove.forEach((item) => item.remove())
  
    // Adicionar cada item do carrinho
    cart.forEach((item) => {
      const bestPrice = findBestPrice(item.prices)
  
      const cartItemElement = document.createElement("div")
      cartItemElement.className = "cart-item"
  
      cartItemElement.innerHTML = `
              <img src="${item.image}" alt="${item.name}" class="cart-item-image">
              <div class="cart-item-details">
                  <h3 class="cart-item-name">${item.name}</h3>
                  <div class="cart-item-prices">
                      ${Object.entries(item.prices)
                        .map(
                          ([store, price]) => `
                          <div class="price-item ${store === bestPrice.store ? "best-price" : ""}">
                              <span>${store}</span>
                              <span>R$ ${price.toFixed(2).replace(".", ",")}</span>
                          </div>
                      `,
                        )
                        .join("")}
                  </div>
              </div>
              <div class="cart-item-actions">
                  <div class="quantity-control">
                      <button class="quantity-btn decrease" data-product-id="${item.id}">-</button>
                      <input type="number" class="quantity-input" value="${item.quantity}" min="1" data-product-id="${item.id}">
                      <button class="quantity-btn increase" data-product-id="${item.id}">+</button>
                  </div>
                  <button class="remove-item" data-product-id="${item.id}">
                      <i class="fas fa-trash"></i>
                  </button>
              </div>
          `
  
      cartItemsContainer.appendChild(cartItemElement)
    })
  
    // Adicionar event listeners para os botões de quantidade e remoção
    const decreaseButtons = document.querySelectorAll(".quantity-btn.decrease")
    const increaseButtons = document.querySelectorAll(".quantity-btn.increase")
    const quantityInputs = document.querySelectorAll(".quantity-input")
    const removeButtons = document.querySelectorAll(".remove-item")
  
    decreaseButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const productId = Number.parseInt(this.getAttribute("data-product-id"))
        const item = cart.find((item) => item.id === productId)
        if (item && item.quantity > 1) {
          updateCartItemQuantity(productId, item.quantity - 1)
        }
      })
    })
  
    increaseButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const productId = Number.parseInt(this.getAttribute("data-product-id"))
        const item = cart.find((item) => item.id === productId)
        if (item) {
          updateCartItemQuantity(productId, item.quantity + 1)
        }
      })
    })
  
    quantityInputs.forEach((input) => {
      input.addEventListener("change", function () {
        const productId = Number.parseInt(this.getAttribute("data-product-id"))
        const quantity = Number.parseInt(this.value)
        if (!isNaN(quantity) && quantity > 0) {
          updateCartItemQuantity(productId, quantity)
        } else {
          this.value = 1
          updateCartItemQuantity(productId, 1)
        }
      })
    })
  
    removeButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const productId = Number.parseInt(this.getAttribute("data-product-id"))
        removeFromCart(productId)
      })
    })
  
    // Atualizar o resumo do carrinho
    const totals = calculateCartTotal()
  
    if (subtotalElement) {
      subtotalElement.textContent = `R$ ${totals.total.toFixed(2).replace(".", ",")}`
    }
  
    if (totalElement) {
      totalElement.textContent = `R$ ${totals.total.toFixed(2).replace(".", ",")}`
    }
  
    if (savingsElement) {
      savingsElement.textContent = `R$ ${totals.savings.toFixed(2).replace(".", ",")}`
    }
  }
  
  // Adicionar event listener para o botão de finalizar compra
  document.addEventListener("DOMContentLoaded", () => {
    const checkoutBtn = document.querySelector(".checkout-btn")
  
    if (checkoutBtn) {
      checkoutBtn.addEventListener("click", () => {
        alert("Compra finalizada com sucesso! Obrigado por escolher o InfoMarket.")
        // Limpar o carrinho após a finalização
        saveCart([])
        updateCartCount()
        renderCartItems()
      })
    }
  })
  
  // FUNÇÕES DA PÁGINA DE PERFIL
  
  // Função para inicializar a página de perfil
  function initProfilePage() {
    // Verificar se estamos na página de perfil
    if (!window.location.pathname.includes("profile.html")) return
  
    // Navegação entre as seções do perfil
    const menuItems = document.querySelectorAll(".profile-menu li a")
    const sections = document.querySelectorAll(".profile-section-content")
  
    menuItems.forEach((item) => {
      item.addEventListener("click", function (e) {
        e.preventDefault()
  
        const targetId = this.getAttribute("href").substring(1)
  
        // Remover classe active de todos os itens do menu
        menuItems.forEach((menuItem) => {
          menuItem.parentElement.classList.remove("active")
        })
  
        // Adicionar classe active ao item clicado
        this.parentElement.classList.add("active")
  
        // Esconder todas as seções
        sections.forEach((section) => {
          section.classList.remove("active")
        })
  
        // Mostrar a seção correspondente
        document.getElementById(targetId).classList.add("active")
  
        // Rolar para o topo da seção em dispositivos móveis
        if (window.innerWidth <= 768) {
          document.querySelector(".profile-content").scrollIntoView({ behavior: "smooth" })
        }
      })
    })
  
    // Atualizar valor do slider de distância
    const distanceSlider = document.getElementById("distance")
    const rangeValue = document.querySelector(".range-value")
  
    if (distanceSlider && rangeValue) {
      distanceSlider.addEventListener("input", function () {
        rangeValue.textContent = this.value + " km"
      })
    }
  
    // Toggle para autenticação de dois fatores
    const twoFactorToggle = document.getElementById("two-factor")
    const toggleStatus = document.querySelector(".toggle-status")
  
    if (twoFactorToggle && toggleStatus) {
      twoFactorToggle.addEventListener("change", function () {
        toggleStatus.textContent = this.checked ? "Ativado" : "Desativado"
      })
    }
  
    // Validação de formulário de informações pessoais
    const personalInfoForm = document.querySelector("#personal-info form")
  
    if (personalInfoForm) {
      personalInfoForm.addEventListener("submit", (e) => {
        e.preventDefault()
  
        // Aqui você adicionaria a lógica para salvar as informações
        // Por exemplo, enviar para um servidor via AJAX
  
        // Simulação de salvamento bem-sucedido
        alert("Informações pessoais atualizadas com sucesso!")
      })
    }
  
    // Validação de formulário de segurança (troca de senha)
    const securityForm = document.querySelector("#security form")
  
    if (securityForm) {
      securityForm.addEventListener("submit", (e) => {
        e.preventDefault()
  
        const currentPassword = document.getElementById("current-password").value
        const newPassword = document.getElementById("new-password").value
        const confirmPassword = document.getElementById("confirm-password").value
  
        // Validação básica
        if (!currentPassword || !newPassword || !confirmPassword) {
          alert("Por favor, preencha todos os campos de senha.")
          return
        }
  
        if (newPassword !== confirmPassword) {
          alert("A nova senha e a confirmação não coincidem.")
          return
        }
  
        // Verificar requisitos de senha
        const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/
        if (!passwordRegex.test(newPassword)) {
          alert("A nova senha não atende aos requisitos de segurança.")
          return
        }
  
        // Simulação de atualização bem-sucedida
        alert("Senha atualizada com sucesso!")
        securityForm.reset()
      })
    }
  
    // Botões de adicionar, editar e excluir endereço
    const addAddressBtn = document.querySelector(".add-address-btn")
    const editBtns = document.querySelectorAll(".edit-btn")
    const deleteBtns = document.querySelectorAll(".delete-btn")
  
    if (addAddressBtn) {
      addAddressBtn.addEventListener("click", () => {
        // Aqui você abriria um modal ou redirecionaria para uma página de adição de endereço
        alert("Funcionalidade de adicionar endereço será implementada em breve!")
      })
    }
  
    editBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        // Aqui você abriria um modal ou redirecionaria para uma página de edição de endereço
        alert("Funcionalidade de editar endereço será implementada em breve!")
      })
    })
  
    deleteBtns.forEach((btn) => {
      btn.addEventListener("click", function () {
        if (confirm("Tem certeza que deseja excluir este endereço?")) {
          // Aqui você removeria o endereço do banco de dados
          // Por enquanto, apenas remove o elemento da página
          this.closest(".address-card").remove()
        }
      })
    })
  
    // Botões de ver detalhes dos pedidos
    const viewDetailsBtns = document.querySelectorAll(".view-details-btn")
  
    viewDetailsBtns.forEach((btn) => {
      btn.addEventListener("click", function () {
        const orderId = this.closest(".order-card").querySelector(".order-info h3").textContent.split("#")[1]
        alert(`Detalhes do pedido #${orderId} serão exibidos em breve!`)
      })
    })
  
    // Botão de logout
    const logoutBtn = document.querySelector(".logout a")
  
    if (logoutBtn) {
      logoutBtn.addEventListener("click", (e) => {
        e.preventDefault()
  
        if (confirm("Tem certeza que deseja sair?")) {
          // Aqui você faria o logout do usuário e redirecionaria para a página inicial
          window.location.href = "index.html"
        }
      })
    }
  
    // Botão para alterar foto de perfil
    const changeAvatarBtn = document.querySelector(".change-avatar-btn")
    
    if (changeAvatarBtn) {
      changeAvatarBtn.addEventListener("click", () => {
        alert("Funcionalidade de alterar foto será implementada em breve!")
      })
    }
  
    // Formulário de preferências
    const preferencesForm = document.querySelector("#preferences form")
    
    if (preferencesForm) {
      preferencesForm.addEventListener("submit", (e) => {
        e.preventDefault()
        alert("Preferências salvas com sucesso!")
      })
    }
  }

  // Função para verificar se o usuário é administrador
  function checkAdminStatus() {
    // Adicionar link para área administrativa no menu do usuário
    const accountMenu = document.querySelector(".account a");
    if (accountMenu) {
      // Verificar se o usuário está logado como administrador
      // Aqui você usaria uma lógica real para verificar se o usuário é admin
      const isAdmin = localStorage.getItem("isAdmin") === "true";
      
      if (isAdmin) {
        // Adicionar opção de administração ao menu do usuário
        const accountInfo = accountMenu.querySelector(".account-info");
        if (accountInfo) {
          accountInfo.innerHTML = "Admin";
        }
        
        // Adicionar link para o painel administrativo
        const userActions = document.querySelector(".user-actions");
        if (userActions) {
          const adminLink = document.createElement("div");
          adminLink.className = "admin-link";
          adminLink.innerHTML = `
            <a href="admin-dashboard.html">
              <i class="fas fa-user-shield"></i>
              <span>Painel Admin</span>
            </a>
          `;
          userActions.appendChild(adminLink);
        }
      }
    }
  }
  
  // Simular login como administrador (para fins de demonstração)
  // Em um sistema real, isso seria feito através de autenticação adequada
  localStorage.setItem("isAdmin", "true");