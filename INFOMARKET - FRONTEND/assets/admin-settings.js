// Este arquivo contém funcionalidades específicas para a página de configurações

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar navegação das abas de configurações
    initSettingsTabs();
});

// Função para inicializar as abas de configurações
function initSettingsTabs() {
    const tabLinks = document.querySelectorAll('.settings-nav li');
    const tabContents = document.querySelectorAll('.settings-tab');
    
    if (tabLinks.length === 0 || tabContents.length === 0) return;
    
    tabLinks.forEach(link => {
        link.addEventListener('click', function() {
            // Remover classe active de todos os links
            tabLinks.forEach(l => l.classList.remove('active'));
            
            // Adicionar classe active ao link clicado
            this.classList.add('active');
            
            // Obter o ID da aba
            const tabId = this.dataset.tab;
            
            // Esconder todas as abas
            tabContents.forEach(tab => tab.classList.remove('active'));
            
            // Mostrar a aba correspondente
            const tabContent = document.getElementById(`${tabId}-tab`);
            if (tabContent) {
                tabContent.classList.add('active');
            }
        });
    });
}