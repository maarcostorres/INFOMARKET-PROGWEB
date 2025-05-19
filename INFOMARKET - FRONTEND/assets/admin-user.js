// Função para inicializar a página de usuários
function initUsersPage() {
    // Verificar se estamos na página de usuários
    const usersTable = document.getElementById("users-table");
    if (!usersTable) return;

    // Botão para adicionar novo usuário
    const addUserBtn = document.getElementById("add-user-btn");
    if (addUserBtn) {
        addUserBtn.addEventListener("click", function() {
            openUserModal();
        });
    }

    // Botões de edição de usuário
    const editBtns = document.querySelectorAll("#users-table .edit-btn");
    editBtns.forEach(btn => {
        btn.addEventListener("click", function() {
            const userId = this.getAttribute("data-id");
            openUserModal(userId);
        });
    });

    // Botões de exclusão de usuário
    const deleteBtns = document.querySelectorAll("#users-table .delete-btn");
    deleteBtns.forEach(btn => {
        btn.addEventListener("click", function() {
            const userId = this.getAttribute("data-id");
            if (confirm("Tem certeza que deseja excluir este usuário?")) {
                deleteUser(userId);
            }
        });
    });

    // Configurar o modal de usuário
    const userModal = document.getElementById("user-modal");
    const modalClose = document.getElementById("user-modal-close");
    const modalCancel = document.getElementById("user-modal-cancel");
    const modalSave = document.getElementById("user-modal-save");

    if (modalClose) {
        modalClose.addEventListener("click", closeUserModal);
    }

    if (modalCancel) {
        modalCancel.addEventListener("click", closeUserModal);
    }

    if (modalSave) {
        modalSave.addEventListener("click", saveUser);
    }

    // Filtro de busca de usuários
    const userSearch = document.getElementById("user-search");
    if (userSearch) {
        userSearch.addEventListener("input", function() {
            filterUsers(this.value);
        });
    }

    // Filtro de status
    const statusFilter = document.getElementById("status-filter");
    if (statusFilter) {
        statusFilter.addEventListener("change", function() {
            filterUsersByStatus(this.value);
        });
    }
}

// Função para abrir o modal de usuário
function openUserModal(userId = null) {
    const modal = document.getElementById("user-modal");
    const modalTitle = document.getElementById("user-modal-title");
    const form = document.getElementById("user-form");
    
    // Limpar o formulário
    form.reset();
    
    if (userId) {
        // Editar usuário existente
        modalTitle.textContent = "Editar Usuário";
        document.getElementById("user-id").value = userId;
        
        // Buscar dados do usuário pelo ID
        const userRow = document.querySelector(`#users-table tr[data-id="${userId}"]`);
        if (userRow) {
            const userName = userRow.querySelector(".user-name").textContent;
            const userEmail = userRow.querySelectorAll("td")[1].textContent;
            const userPhone = userRow.querySelectorAll("td")[2].textContent;
            const userStatus = userRow.querySelector(".user-status").classList.contains("active") ? "active" : 
                              userRow.querySelector(".user-status").classList.contains("inactive") ? "inactive" : "pending";
            
            document.getElementById("user-name").value = userName;
            document.getElementById("user-email").value = userEmail;
            document.getElementById("user-phone").value = userPhone;
            document.getElementById("user-status").value = userStatus;
            
            // Outros campos seriam preenchidos aqui se disponíveis
        }
    } else {
        // Novo usuário
        modalTitle.textContent = "Adicionar Usuário";
        document.getElementById("user-id").value = "";
    }
    
    // Exibir o modal
    modal.classList.add("active");
}

// Função para fechar o modal de usuário
function closeUserModal() {
    const modal = document.getElementById("user-modal");
    modal.classList.remove("active");
}

// Função para salvar o usuário
function saveUser() {
    const userId = document.getElementById("user-id").value;
    const userName = document.getElementById("user-name").value;
    const userEmail = document.getElementById("user-email").value;
    const userPhone = document.getElementById("user-phone").value;
    const userStatus = document.getElementById("user-status").value;
    const userRole = document.getElementById("user-role").value;
    
    // Validar os campos obrigatórios
    if (!userName || !userEmail || !userPhone) {
        alert("Por favor, preencha todos os campos obrigatórios.");
        return;
    }
    
    if (userId) {
        // Atualizar usuário existente
        updateUserInTable(userId, userName, userEmail, userPhone, userStatus, userRole);
    } else {
        // Adicionar novo usuário
        addUserToTable(userName, userEmail, userPhone, userStatus, userRole);
    }
    
    // Fechar o modal
    closeUserModal();
    
    // Mostrar mensagem de sucesso
    alert(userId ? "Usuário atualizado com sucesso!" : "Usuário adicionado com sucesso!");
}

// Função para atualizar um usuário na tabela
function updateUserInTable(userId, name, email, phone, status, role) {
    const userRow = document.querySelector(`#users-table tr[data-id="${userId}"]`);
    if (userRow) {
        userRow.querySelector(".user-name").textContent = name;
        
        const cells = userRow.querySelectorAll("td");
        cells[1].textContent = email;
        cells[2].textContent = phone;
        
        const statusSpan = userRow.querySelector(".user-status");
        statusSpan.className = "user-status " + status;
        statusSpan.textContent = status === "active" ? "Ativo" : status === "inactive" ? "Inativo" : "Pendente";
    }
    
    // Aqui você também atualizaria os dados no array de usuários
    updateUserInArray(userId, name, email, phone, status, role);
}

// Função para adicionar um novo usuário à tabela
function addUserToTable(name, email, phone, status, role) {
    const usersTable = document.getElementById("users-table").querySelector("tbody");
    
    // Gerar um novo ID para o usuário
    const newId = generateNewUserId();
    
    // Formatar o status para exibição
    const statusText = status === "active" ? "Ativo" : status === "inactive" ? "Inativo" : "Pendente";
    
    // Criar a nova linha da tabela
    const newRow = document.createElement("tr");
    newRow.setAttribute("data-id", newId);
    
    // Data de registro atual
    const today = new Date();
    const registerDate = `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getFullYear()}`;
    
    newRow.innerHTML = `
        <td class="user-name">${name}</td>
        <td>${email}</td>
        <td>${phone}</td>
        <td>${registerDate}</td>
        <td><span class="user-status ${status}">${statusText}</span></td>
        <td class="actions">
            <button class="btn edit-btn" data-id="${newId}"><i class="fas fa-edit"></i></button>
            <button class="btn delete-btn" data-id="${newId}"><i class="fas fa-trash"></i></button>
        </td>
    `;
    
    // Adicionar a nova linha à tabela
    usersTable.appendChild(newRow);
    
    // Adicionar event listeners aos novos botões
    newRow.querySelector(".edit-btn").addEventListener("click", function() {
        openUserModal(newId);
    });
    
    newRow.querySelector(".delete-btn").addEventListener("click", function() {
        if (confirm("Tem certeza que deseja excluir este usuário?")) {
            deleteUser(newId);
        }
    });
    
    // Aqui você também adicionaria o usuário ao array de usuários
    addUserToArray(newId, name, email, phone, status, role, registerDate);
}

// Função para excluir um usuário
function deleteUser(userId) {
    const userRow = document.querySelector(`#users-table tr[data-id="${userId}"]`);
    if (userRow) {
        userRow.remove();
    }
    
    // Aqui você também removeria o usuário do array de usuários
    removeUserFromArray(userId);
    
    // Mostrar mensagem de sucesso
    alert("Usuário excluído com sucesso!");
}

// Função para filtrar usuários por nome ou email
function filterUsers(searchTerm) {
    const rows = document.querySelectorAll("#users-table tbody tr");
    searchTerm = searchTerm.toLowerCase();
    
    rows.forEach(row => {
        const userName = row.querySelector(".user-name").textContent.toLowerCase();
        const userEmail = row.querySelectorAll("td")[1].textContent.toLowerCase();
        
        if (userName.includes(searchTerm) || userEmail.includes(searchTerm)) {
            row.style.display = "";
        } else {
            row.style.display = "none";
        }
    });
}

// Função para filtrar usuários por status
function filterUsersByStatus(status) {
    const rows = document.querySelectorAll("#users-table tbody tr");
    
    rows.forEach(row => {
        const userStatus = row.querySelector(".user-status");
        
        if (!status || userStatus.classList.contains(status)) {
            row.style.display = "";
        } else {
            row.style.display = "none";
        }
    });
}

// Funções auxiliares para manipular o array de usuários
function generateNewUserId() {
    // Encontrar o maior ID atual e incrementar
    const rows = document.querySelectorAll("#users-table tbody tr");
    let maxId = 0;
    
    rows.forEach(row => {
        const id = parseInt(row.getAttribute("data-id"));
        if (id > maxId) {
            maxId = id;
        }
    });
    
    return maxId + 1;
}

function updateUserInArray(id, name, email, phone, status, role) {
    // Esta função atualizaria o usuário no array de usuários
    console.log(`Usuário atualizado no array: ${id}`);
}

function addUserToArray(id, name, email, phone, status, role, registerDate) {
    // Esta função adicionaria o usuário ao array de usuários
    console.log(`Usuário adicionado ao array: ${id}`);
}

function removeUserFromArray(id) {
    // Esta função removeria o usuário do array de usuários
    console.log(`Usuário removido do array: ${id}`);
}