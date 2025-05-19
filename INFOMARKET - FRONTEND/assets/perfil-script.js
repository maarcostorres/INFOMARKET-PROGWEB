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