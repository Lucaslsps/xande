/**
 * ========================================
 * PORTFOLIO CONFIGURATION
 * ========================================
 * 
 * Este arquivo permite configurar facilmente os itens do portfolio.
 * Edite as configurações abaixo para adicionar, remover ou modificar projetos.
 */

const portfolioConfig = {
    // Configuração da imagem de perfil
    profileImage: {
        src: 'imgs/profile-picture.png',
        alt: 'Alexandre Homem - Designer de Produto e Gráfico'
    },

    // Configuração dos projetos do portfolio
    // Adicione ou remova itens conforme necessário
    projects: [
        {
            id: 1,
            title: 'Projeto 1',
            description: 'Descrição do primeiro projeto',
            category: 'design', // Opções: 'motion', 'video', 'design'
            type: 'image', // Opções: 'image', 'video'
            thumbnail: 'imgs/pic1.webp',
            // Para vídeo, adicione: videoUrl: 'url-do-video'
            link: 'https://www.behance.net/AlexandreCabral25', // Link externo (opcional)
            tags: ['Design', 'Identidade Visual']
        },
        {
            id: 2,
            title: 'Projeto 2',
            description: 'Descrição do segundo projeto',
            category: 'motion', // Opções: 'motion', 'video', 'design'
            type: 'image', // Opções: 'image', 'video'
            thumbnail: 'imgs/pic2.webp',
            link: 'https://www.behance.net/AlexandreCabral25',
            tags: ['Motion Design', 'Animação']
        },
        {
            id: 3,
            title: 'Projeto 3',
            description: 'Descrição do terceiro projeto',
            category: 'video', // Opções: 'motion', 'video', 'design'
            type: 'image', // Opções: 'image', 'video'
            thumbnail: 'imgs/pic3.webp',
            link: 'https://www.behance.net/AlexandreCabral25',
            tags: ['Edição de Vídeo', 'Produção']
        }
    ],

    // Configuração das categorias de filtro
    categories: [
        { id: 'all', label: 'Todos' },
        { id: 'motion', label: 'Motion Design' },
        { id: 'video', label: 'Vídeo' },
        { id: 'design', label: 'Design' }
    ],

    // Links das redes sociais
    socialLinks: {
        behance: 'https://www.behance.net/AlexandreCabral25',
        instagram: 'http://instagram.com/ale_cabral19',
        linkedin: 'https://www.linkedin.com/in/alexandre-homem-166715210',
        twitter: 'http://twitter.com/xand1XD'
    }
};

// Exporta para uso global
window.portfolioConfig = portfolioConfig;
