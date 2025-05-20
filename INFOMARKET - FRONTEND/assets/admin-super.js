// Variáveis globais
let siteSettings = {};
let supermarkets = [];
let nextSupermarketId = 7; // Começando do ID 7 já que temos 6 supermercados pré-definidos

// Função para inicializar o script quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar tema
    initTheme();
    
    // Carregar configurações do site
    loadSiteSettings();
    
    // Aplicar configurações do site em todas as páginas
    applySiteSettings();
    
    // Inicializar funcionalidades específicas com base na página atual
    initPageSpecificFunctions();
    
    // Inicializar eventos comuns a todas as páginas
    initCommonEvents();
});

// Função para inicializar o tema (claro/escuro)
function initTheme() {
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', function() {
            document.body.classList.toggle('dark-mode');
            document.body.classList.toggle('light-mode');
            
            // Atualizar ícone
            const icon = this.querySelector('i');
            if (document.body.classList.contains('dark-mode')) {
                icon.classList.remove('fa-sun');
                icon.classList.add('fa-moon');
            } else {
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun');
            }
            
            // Salvar preferência
            localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
        });
        
        // Aplicar tema salvo
        const savedTheme = localStorage.getItem('theme') || 'light';
        if (savedTheme === 'dark' && !document.body.classList.contains('dark-mode')) {
            themeToggleBtn.click();
        }
    }
}

// Função para carregar as configurações do site do localStorage
function loadSiteSettings() {
    const savedSettings = localStorage.getItem('siteSettings');
    if (savedSettings) {
        siteSettings = JSON.parse(savedSettings);
    } else {
        // Configurações padrão
        siteSettings = {
            siteName: 'InfoMarket',
            siteDescription: 'InfoMarket é um site comparador de preços de diferentes produtos em diferentes supermercados, permitindo que compre com o melhor preço no supermercado mais próximo a você.',
            contactEmail: 'contato@infomarket.com.br',
            contactPhone: '(27) 99668-9530',
            address: 'Av. Fernando Ferrari, 514 - Goiabeiras, Vitória - ES, 29075-910',
            socialMedia: {
                instagram: 'https://www.instagram.com/itsmaarkim/',
                twitter: 'https://x.com/itsmaarkim',
                linkedin: 'https://www.linkedin.com/in/marcos-vinicius-silva-torres-134b57264/'
            },
            logoUrl: '/images/logo.png'
        };
        
        // Salvar configurações padrão
        localStorage.setItem('siteSettings', JSON.stringify(siteSettings));
    }
}

// Função para aplicar as configurações do site em todas as páginas
function applySiteSettings() {
    // Atualizar título do site
    document.title = document.title.replace('InfoMarket', siteSettings.siteName);
    
    // Atualizar logo e nome do site no header
    const logoText = document.querySelector('.logo h1');
    if (logoText) {
        logoText.textContent = siteSettings.siteName;
    }
    
    // Atualizar informações no footer
    const aboutText = document.querySelector('.footer-section p');
    if (aboutText) {
        aboutText.textContent = siteSettings.siteDescription;
    }
    
    const contactEmail = document.querySelector('.footer-section p:has(i.fa-envelope)');
    if (contactEmail) {
        contactEmail.innerHTML = `<i class="fas fa-envelope"></i> ${siteSettings.contactEmail}`;
    }
    
    const contactPhone = document.querySelector('.footer-section p:has(i.fa-phone)');
    if (contactPhone) {
        contactPhone.innerHTML = `<i class="fas fa-phone"></i> ${siteSettings.contactPhone}`;
    }
    
    // Atualizar links de redes sociais
    const instagramLink = document.querySelector('.social-media a[href*="instagram"]');
    if (instagramLink) {
        instagramLink.href = siteSettings.socialMedia.instagram;
    }
    
    const twitterLink = document.querySelector('.social-media a[href*="x.com"]');
    if (twitterLink) {
        twitterLink.href = siteSettings.socialMedia.twitter;
    }
    
    const linkedinLink = document.querySelector('.social-media a[href*="linkedin"]');
    if (linkedinLink) {
        linkedinLink.href = siteSettings.socialMedia.linkedin;
    }
}

// Função para inicializar funcionalidades específicas com base na página atual
function initPageSpecificFunctions() {
    const currentPage = window.location.pathname.split('/').pop();
    
    if (currentPage === 'admin-settings.html') {
        initSettingsPage();
    } else if (currentPage === 'admin-supermarkets.html') {
        loadSupermarkets();
        initSupermarketsPage();
    }
}

// Função para inicializar a página de configurações
function initSettingsPage() {
    // Preencher formulário com as configurações atuais
    document.getElementById('site-name').value = siteSettings.siteName;
    document.getElementById('site-description').value = siteSettings.siteDescription;
    document.getElementById('contact-email').value = siteSettings.contactEmail;
    document.getElementById('contact-phone').value = siteSettings.contactPhone;
    document.getElementById('address').value = siteSettings.address;
    document.getElementById('instagram').value = siteSettings.socialMedia.instagram;
    document.getElementById('twitter').value = siteSettings.socialMedia.twitter;
    document.getElementById('linkedin').value = siteSettings.socialMedia.linkedin;
    
    // Adicionar evento para salvar configurações
    const settingsForm = document.querySelector('.settings-form');
    if (settingsForm) {
        settingsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Atualizar objeto de configurações
            siteSettings.siteName = document.getElementById('site-name').value;
            siteSettings.siteDescription = document.getElementById('site-description').value;
            siteSettings.contactEmail = document.getElementById('contact-email').value;
            siteSettings.contactPhone = document.getElementById('contact-phone').value;
            siteSettings.address = document.getElementById('address').value;
            siteSettings.socialMedia.instagram = document.getElementById('instagram').value;
            siteSettings.socialMedia.twitter = document.getElementById('twitter').value;
            siteSettings.socialMedia.linkedin = document.getElementById('linkedin').value;
            
            // Salvar no localStorage
            localStorage.setItem('siteSettings', JSON.stringify(siteSettings));
            
            // Aplicar configurações
            applySiteSettings();
            
            // Mostrar mensagem de sucesso
            showNotification('Configurações salvas com sucesso!', 'success');
        });
    }
    
    // Adicionar evento para o botão de cancelar
    const cancelBtn = document.querySelector('.cancel-btn');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Recarregar configurações do localStorage
            loadSiteSettings();
            
            // Preencher formulário novamente
            document.getElementById('site-name').value = siteSettings.siteName;
            document.getElementById('site-description').value = siteSettings.siteDescription;
            document.getElementById('contact-email').value = siteSettings.contactEmail;
            document.getElementById('contact-phone').value = siteSettings.contactPhone;
            document.getElementById('address').value = siteSettings.address;
            document.getElementById('instagram').value = siteSettings.socialMedia.instagram;
            document.getElementById('twitter').value = siteSettings.socialMedia.twitter;
            document.getElementById('linkedin').value = siteSettings.socialMedia.linkedin;
            
            showNotification('Alterações canceladas', 'info');
        });
    }
}

// Função para carregar supermercados do localStorage ou usar os padrões
function loadSupermarkets() {
    const savedSupermarkets = localStorage.getItem('supermarkets');
    if (savedSupermarkets) {
        supermarkets = JSON.parse(savedSupermarkets);
        
        // Encontrar o próximo ID disponível
        if (supermarkets.length > 0) {
            const maxId = Math.max(...supermarkets.map(s => parseInt(s.id)));
            nextSupermarketId = maxId + 1;
        }
    } else {
        // Supermercados padrão
        supermarkets = [
            {
                id: 1,
                name: 'Carone',
                logo: '/images/caronelogo.png',
                address: 'Av. Jerônimo Monteiro, 1000, Vitória',
                phone: '(27) 3333-1111',
                email: 'contato@carone.com.br',
                website: 'https://www.carone.com.br',
                products: 245,
                status: 'active',
                description: 'O Carone é uma rede de supermercados com mais de 30 anos de tradição no Espírito Santo. Oferecemos produtos de qualidade com os melhores preços e um atendimento diferenciado para nossos clientes.',
                hours: 'Segunda a Sábado: 08:00 às 22:00\nDomingo: 08:00 às 20:00',
                orders: 87,
                revenue: 'R$ 12.450'
            },
            {
                id: 2,
                name: 'Carrefour',
                logo: '/images/carrefourlogo.png',
                address: 'Av. Norte Sul, 500, Serra',
                phone: '(27) 3333-2222',
                email: 'contato@carrefour.com.br',
                website: 'https://www.carrefour.com.br',
                products: 312,
                status: 'active',
                description: 'O Carrefour é uma rede internacional de hipermercados. Oferecemos uma grande variedade de produtos alimentícios e não alimentícios.',
                hours: 'Segunda a Domingo: 08:00 às 22:00',
                orders: 105,
                revenue: 'R$ 18.750'
            },
            {
                id: 3,
                name: 'Perim',
                logo: '/images/perimlogo.png',
                address: 'Av. Luciano das Neves, 200, Vila Velha',
                phone: '(27) 3333-3333',
                email: 'contato@perim.com.br',
                website: 'https://www.perim.com.br',
                products: 198,
                status: 'active',
                description: 'O Perim é uma rede de supermercados do Espírito Santo. Oferecemos produtos de qualidade com preços competitivos.',
                hours: 'Segunda a Sábado: 07:00 às 21:00\nDomingo: 07:00 às 13:00',
                orders: 62,
                revenue: 'R$ 9.320'
            },
            {
                id: 4,
                name: 'BH',
                logo: '/images/bhlogo.png',
                address: 'Av. Carlos Lindenberg, 300, Cariacica',
                phone: '(27) 3333-4444',
                email: 'contato@bh.com.br',
                website: 'https://www.bh.com.br',
                products: 176,
                status: 'active',
                description: 'O BH é uma rede de supermercados com foco em preços baixos e qualidade nos produtos.',
                hours: 'Segunda a Sábado: 08:00 às 20:00\nDomingo: 08:00 às 14:00',
                orders: 48,
                revenue: 'R$ 7.890'
            },
        ];
        
        // Salvar supermercados padrão
        localStorage.setItem('supermarkets', JSON.stringify(supermarkets));
    }
}

// Função para inicializar a página de supermercados
function initSupermarketsPage() {
    // Renderizar tabela de supermercados
    renderSupermarketsTable();
    
    // Adicionar evento para o botão de adicionar supermercado
    const addSupermarketBtn = document.getElementById('add-supermarket-btn');
    if (addSupermarketBtn) {
        addSupermarketBtn.addEventListener('click', function() {
            openSupermarketModal();
        });
    }
    
    // Adicionar eventos para os botões de ação na tabela
    const supermarketsTable = document.getElementById('supermarkets-table');
    if (supermarketsTable) {
        supermarketsTable.addEventListener('click', function(e) {
            const target = e.target.closest('.btn');
            if (!target) return;
            
            const supermarketId = target.dataset.id;
            
            if (target.classList.contains('view-btn')) {
                openSupermarketViewModal(supermarketId);
            } else if (target.classList.contains('edit-btn')) {
                openSupermarketModal(supermarketId);
            } else if (target.classList.contains('delete-btn')) {
                confirmDeleteSupermarket(supermarketId);
            }
        });
    }
    
    // Adicionar eventos para os botões do modal de edição
    const supermarketModalSave = document.getElementById('supermarket-modal-save');
    if (supermarketModalSave) {
        supermarketModalSave.addEventListener('click', saveSupermarket);
    }
    
    const supermarketModalCancel = document.getElementById('supermarket-modal-cancel');
    if (supermarketModalCancel) {
        supermarketModalCancel.addEventListener('click', closeSupermarketModal);
    }
    
    const supermarketModalClose = document.getElementById('supermarket-modal-close');
    if (supermarketModalClose) {
        supermarketModalClose.addEventListener('click', closeSupermarketModal);
    }
    
    // Adicionar eventos para os botões do modal de visualização
    const supermarketViewCancel = document.getElementById('supermarket-view-cancel');
    if (supermarketViewCancel) {
        supermarketViewCancel.addEventListener('click', closeSupermarketViewModal);
    }
    
    const supermarketViewClose = document.getElementById('supermarket-view-close');
    if (supermarketViewClose) {
        supermarketViewClose.addEventListener('click', closeSupermarketViewModal);
    }
    
    // Adicionar evento para o campo de busca
    const supermarketSearch = document.getElementById('supermarket-search');
    if (supermarketSearch) {
        supermarketSearch.addEventListener('input', function() {
            filterSupermarkets();
        });
    }
    
    // Adicionar eventos para os filtros
    const statusFilter = document.getElementById('status-filter');
    if (statusFilter) {
        statusFilter.addEventListener('change', function() {
            filterSupermarkets();
        });
    }
    
    const locationFilter = document.getElementById('location-filter');
    if (locationFilter) {
        locationFilter.addEventListener('change', function() {
            filterSupermarkets();
        });
    }
}

// Função para renderizar a tabela de supermercados
function renderSupermarketsTable() {
    const tableBody = document.querySelector('#supermarkets-table tbody');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    supermarkets.forEach(supermarket => {
        const statusClass = supermarket.status === 'active' ? 'active' : 
                           supermarket.status === 'pending' ? 'pending' : 'inactive';
        
        const statusText = supermarket.status === 'active' ? 'Ativo' : 
                          supermarket.status === 'pending' ? 'Pendente' : 'Inativo';
        
        const row = document.createElement('tr');
        row.dataset.id = supermarket.id;
        
        row.innerHTML = `
            <td><img src="${supermarket.logo}" alt="${supermarket.name}"></td>
            <td class="supermarket-name">${supermarket.name}</td>
            <td>${supermarket.address}</td>
            <td>${supermarket.phone}</td>
            <td>${supermarket.products}</td>
            <td><span class="user-status ${statusClass}">${statusText}</span></td>
            <td class="actions">
                <button class="btn view-btn" data-id="${supermarket.id}"><i class="fas fa-eye"></i></button>
                <button class="btn edit-btn" data-id="${supermarket.id}"><i class="fas fa-edit"></i></button>
                <button class="btn delete-btn" data-id="${supermarket.id}"><i class="fas fa-trash"></i></button>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
}

// Função para abrir o modal de edição de supermercado
function openSupermarketModal(supermarketId = null) {
    const modal = document.getElementById('supermarket-modal');
    const modalTitle = document.getElementById('supermarket-modal-title');
    const form = document.getElementById('supermarket-form');
    
    if (!modal || !modalTitle || !form) return;
    
    // Limpar formulário
    form.reset();
    
    if (supermarketId) {
        // Editar supermercado existente
        const supermarket = supermarkets.find(s => s.id == supermarketId);
        if (!supermarket) return;
        
        modalTitle.textContent = 'Editar Supermercado';
        document.getElementById('supermarket-id').value = supermarket.id;
        document.getElementById('supermarket-name-input').value = supermarket.name;
        document.getElementById('supermarket-logo-input').value = supermarket.logo;
        document.getElementById('supermarket-address-input').value = supermarket.address;
        document.getElementById('supermarket-phone-input').value = supermarket.phone;
        document.getElementById('supermarket-email-input').value = supermarket.email;
        document.getElementById('supermarket-website-input').value = supermarket.website;
        document.getElementById('supermarket-status-input').value = supermarket.status;
        document.getElementById('supermarket-hours-input').value = supermarket.hours;
        document.getElementById('supermarket-description-input').value = supermarket.description;
    } else {
        // Adicionar novo supermercado
        modalTitle.textContent = 'Adicionar Supermercado';
        document.getElementById('supermarket-id').value = '';
        document.getElementById('supermarket-status-input').value = 'active';
    }
    
    // Abrir modal
    modal.classList.add('active');
}

// Função para fechar o modal de edição de supermercado
function closeSupermarketModal() {
    const modal = document.getElementById('supermarket-modal');
    if (modal) {
        modal.classList.remove('active');
    }
}

// Função para salvar supermercado
function saveSupermarket() {
    const form = document.getElementById('supermarket-form');
    if (!form) return;
    
    // Validar formulário
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    const supermarketId = document.getElementById('supermarket-id').value;
    const name = document.getElementById('supermarket-name-input').value;
    const logo = document.getElementById('supermarket-logo-input').value;
    const address = document.getElementById('supermarket-address-input').value;
    const phone = document.getElementById('supermarket-phone-input').value;
    const email = document.getElementById('supermarket-email-input').value;
    const website = document.getElementById('supermarket-website-input').value;
    const status = document.getElementById('supermarket-status-input').value;
    const hours = document.getElementById('supermarket-hours-input').value;
    const description = document.getElementById('supermarket-description-input').value;
    
    if (supermarketId) {
        // Atualizar supermercado existente
        const index = supermarkets.findIndex(s => s.id == supermarketId);
        if (index !== -1) {
            supermarkets[index] = {
                ...supermarkets[index],
                name,
                logo,
                address,
                phone,
                email,
                website,
                status,
                hours,
                description
            };
            
            showNotification('Supermercado atualizado com sucesso!', 'success');
        }
    } else {
        // Adicionar novo supermercado
        const newSupermarket = {
            id: nextSupermarketId++,
            name,
            logo,
            address,
            phone,
            email,
            website,
            products: 0,
            status,
            description,
            hours,
            orders: 0,
            revenue: 'R$ 0'
        };
        
        supermarkets.push(newSupermarket);
        showNotification('Supermercado adicionado com sucesso!', 'success');
    }
    
    // Salvar no localStorage
    localStorage.setItem('supermarkets', JSON.stringify(supermarkets));
    
    // Atualizar tabela
    renderSupermarketsTable();
    
    // Fechar modal
    closeSupermarketModal();
}

// Função para confirmar exclusão de supermercado
function confirmDeleteSupermarket(supermarketId) {
    const supermarket = supermarkets.find(s => s.id == supermarketId);
    if (!supermarket) return;
    
    if (confirm(`Tem certeza que deseja excluir o supermercado "${supermarket.name}"?`)) {
        deleteSupermarket(supermarketId);
    }
}

// Função para excluir supermercado
function deleteSupermarket(supermarketId) {
    const index = supermarkets.findIndex(s => s.id == supermarketId);
    if (index !== -1) {
        supermarkets.splice(index, 1);
        
        // Salvar no localStorage
        localStorage.setItem('supermarkets', JSON.stringify(supermarkets));
        
        // Atualizar tabela
        renderSupermarketsTable();
        
        showNotification('Supermercado excluído com sucesso!', 'success');
    }
}

// Função para abrir o modal de visualização de supermercado
function openSupermarketViewModal(supermarketId) {
    const supermarket = supermarkets.find(s => s.id == supermarketId);
    if (!supermarket) return;
    
    const modal = document.getElementById('supermarket-view-modal');
    if (!modal) return;
    
    // Preencher dados do supermercado
    document.getElementById('supermarket-view-title').textContent = `Detalhes do Supermercado - ${supermarket.name}`;
    document.getElementById('supermarket-logo').src = supermarket.logo;
    document.getElementById('supermarket-name').textContent = supermarket.name;
    document.getElementById('supermarket-address').innerHTML = `<i class="fas fa-map-marker-alt"></i> ${supermarket.address}`;
    document.getElementById('supermarket-phone').innerHTML = `<i class="fas fa-phone"></i> ${supermarket.phone}`;
    document.getElementById('supermarket-email').innerHTML = `<i class="fas fa-envelope"></i> ${supermarket.email}`;
    document.getElementById('supermarket-website').innerHTML = `<i class="fas fa-globe"></i> <a href="${supermarket.website}" target="_blank">${supermarket.website}</a>`;
    
    const statusClass = supermarket.status === 'active' ? 'active' : 
                       supermarket.status === 'pending' ? 'pending' : 'inactive';
    
    const statusText = supermarket.status === 'active' ? 'Ativo' : 
                      supermarket.status === 'pending' ? 'Pendente' : 'Inativo';
    
    const statusBadge = document.getElementById('supermarket-status-badge');
    statusBadge.className = `user-status ${statusClass}`;
    statusBadge.textContent = statusText;
    
    document.getElementById('supermarket-products').textContent = supermarket.products;
    document.getElementById('supermarket-orders').textContent = supermarket.orders;
    document.getElementById('supermarket-revenue').textContent = supermarket.revenue;
    document.getElementById('supermarket-description').textContent = supermarket.description;
    document.getElementById('supermarket-hours').innerHTML = supermarket.hours.replace(/\n/g, '<br>');
    
    // Abrir modal
    modal.classList.add('active');
}

// Função para fechar o modal de visualização de supermercado
function closeSupermarketViewModal() {
    const modal = document.getElementById('supermarket-view-modal');
    if (modal) {
        modal.classList.remove('active');
    }
}

// Função para filtrar supermercados
function filterSupermarkets() {
    const searchTerm = document.getElementById('supermarket-search').value.toLowerCase();
    const statusFilter = document.getElementById('status-filter').value;
    const locationFilter = document.getElementById('location-filter').value;
    
    const rows = document.querySelectorAll('#supermarkets-table tbody tr');
    
    rows.forEach(row => {
        const supermarketId = row.dataset.id;
        const supermarket = supermarkets.find(s => s.id == supermarketId);
        if (!supermarket) return;
        
        const nameMatch = supermarket.name.toLowerCase().includes(searchTerm);
        const addressMatch = supermarket.address.toLowerCase().includes(searchTerm);
        const phoneMatch = supermarket.phone.toLowerCase().includes(searchTerm);
        
        const statusMatch = !statusFilter || supermarket.status === statusFilter;
        
        const locationMatch = !locationFilter || 
                             (locationFilter === 'vitoria' && supermarket.address.includes('Vitória')) ||
                             (locationFilter === 'vila-velha' && supermarket.address.includes('Vila Velha')) ||
                             (locationFilter === 'serra' && supermarket.address.includes('Serra')) ||
                             (locationFilter === 'cariacica' && supermarket.address.includes('Cariacica'));
        
        if ((nameMatch || addressMatch || phoneMatch) && statusMatch && locationMatch) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

// Função para inicializar eventos comuns a todas as páginas
function initCommonEvents() {
    // Toggle do menu lateral
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar');
    
    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', function() {
            sidebar.classList.toggle('active');
        });
    }
}

// Função para mostrar notificação
function showNotification(message, type = 'info') {
    // Verificar se já existe uma notificação
    let notification = document.querySelector('.notification');
    
    if (!notification) {
        // Criar elemento de notificação
        notification = document.createElement('div');
        notification.className = 'notification';
        document.body.appendChild(notification);
    }
    
    // Definir classe de tipo
    notification.className = `notification ${type}`;
    
    // Definir mensagem
    notification.textContent = message;
    
    // Mostrar notificação
    notification.classList.add('show');
    
    // Esconder após 3 segundos
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Adicionar estilos CSS para notificações
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 5px;
        color: white;
        font-weight: 500;
        z-index: 9999;
        opacity: 0;
        transform: translateY(-20px);
        transition: opacity 0.3s, transform 0.3s;
        max-width: 300px;
    }
    
    .notification.show {
        opacity: 1;
        transform: translateY(0);
    }
    
    .notification.success {
        background-color: #2ecc71;
    }
    
    .notification.error {
        background-color: #e74c3c;
    }
    
    .notification.info {
        background-color: #3498db;
    }
    
    .notification.warning {
        background-color: #f39c12;
    }
`;

document.head.appendChild(notificationStyles);