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