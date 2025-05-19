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

  // Inicializar a funcionalidade de pesquisa
  filterProductsByName()

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

// Função para filtrar produtos por nome
function filterProductsByName() {
  const searchInput = document.querySelector(".search-box input")

  if (!searchInput) return

  searchInput.addEventListener("input", function () {
    const searchTerm = this.value.toLowerCase().trim()
    const productsContainer = document.getElementById("products-container")

    if (!productsContainer) return

    // Limpar o container de produtos
    productsContainer.innerHTML = ""

    // Se o campo de busca estiver vazio, mostrar todos os produtos
    if (searchTerm === "") {
      loadProducts()
      return
    }

    // Filtrar produtos que contêm o termo de busca no nome
    const filteredProducts = products.filter((product) => product.name.toLowerCase().includes(searchTerm))

    // Se não houver produtos correspondentes
    if (filteredProducts.length === 0) {
      productsContainer.innerHTML = `
        <div class="no-results">
          <i class="fas fa-search"></i>
          <p>Nenhum produto encontrado para "${searchTerm}"</p>
        </div>
      `
      return
    }

    // Renderizar os produtos filtrados
    filteredProducts.forEach((product) => {
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