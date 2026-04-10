const puppeteer = require('puppeteer');
const fs = require('fs');

const USERNAME = 'AlexandreCabral25';
const URL = `https://www.behance.net/${USERNAME}`;

(async () => {
    console.log('🚀 Iniciando o navegador (Puppeteer) para extrair o portfólio completo...');
    
    // Inicia o navegador invisível
    const browser = await puppeteer.launch({
        headless: 'new', // usa o modo headless novo, mais eficiente
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // Opcional: Bloqueia recursos desnecessários para acelerar o carregamento
    await page.setRequestInterception(true);
    page.on('request', (req) => {
        if (req.resourceType() === 'font' || req.resourceType() === 'stylesheet') {
            req.abort();
        } else {
            req.continue();
        }
    });

    console.log(`🌍 Acessando a página de perfil: ${URL}`);
    await page.goto(URL, { waitUntil: 'networkidle2', timeout: 60000 });

    console.log('📜 Rolando a página para carregar todos os projetos via GraphQL...');
    // Função para rolar até o fim
    await page.evaluate(async () => {
        await new Promise((resolve) => {
            let totalHeight = 0;
            let distance = 300;
            let timer = setInterval(() => {
                let scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;

                // Para e encerra a rolagem quando o fundo for atingido e nada subir após alguns segundos
                if(totalHeight >= scrollHeight - window.innerHeight) {
                    clearInterval(timer);
                    resolve();
                }
            }, 150);
        });
    });

    // Aguarda um pequeno instante extra para as imagens finais renderizarem completamente
    await new Promise(r => setTimeout(r, 2000));

    console.log('🎣 Extraindo informações dos projetos (Thumbnail, Título, Links, Tags)...');

    // Executamos um bloco de código de fato dentro do navegador local (página do usuário)
    const items = await page.evaluate(() => {
        const projects = [];
        // Seleciona todos os grid items de projetos no Behance
        const coverNodes = document.querySelectorAll('.ProjectCoverNeue-root-B1h, .ProjectCoverBase-cover-L4u');

        coverNodes.forEach(node => {
            // Título
            const titleEl = node.querySelector('.Title-title-hH1, .Title-title-L8s, [class*="Title-"]');
            const title = titleEl ? titleEl.innerText.trim() : '';
            
            // Link
            const linkEl = node.querySelector('a');
            const link = linkEl ? linkEl.href : '';
            
            // Thumbnail
            const imgEl = node.querySelector('img');
            let thumbnail = '';
            if (imgEl) {
                // Muitas vezes o Behance usa imagens lazy load, nós pegamos o que tiver disponivel no SRC ou srcset
                thumbnail = imgEl.src || imgEl.getAttribute('srcset') || '';
                if(thumbnail && thumbnail.includes(' ')) {
                    thumbnail = thumbnail.split(' ')[0]; // Se for srcset, pega a primeira variação
                }
            } else {
                const sourceEl = node.querySelector('source');
                if (sourceEl) {
                    thumbnail = sourceEl.srcset.split(',')[0].split(' ')[0];
                }
            }
            
            // Categorias / Tags originais (Fields do Behance)
            const fieldsNodes = node.querySelectorAll('.ProjectCoverNeue-field-h2F, [class*="field-"]');
            const tags = Array.from(fieldsNodes).map(f => f.innerText.trim());
            
            if (title && link) {
                projects.push({
                    title,
                    link,
                    thumbnail,
                    tags,
                    description: tags.join(' • '), // Cria a descrição como resumo a partir de Tags!
                });
            }
        });
        
        return projects;
    });

    await browser.close();

    console.log(`✅ Fim da varredura! Foram encontrados ${items.length} projetos.`);

    // --- LÓGICA DE CATEGORIZAÇÃO DE VÍDEOS VS DESIGN ---
    const finalProjects = items.map(item => {
        let isVideo = false;
        
        // Verifica se alguma tag contém o termo "video", "motion", "edição", "animação" etc
        const videoKeywords = ['video', 'vídeo', 'motion', 'animation', 'edição', 'animação', 'after effects', 'premiere'];
        
        for (let tag of item.tags) {
            const lowerTag = tag.toLowerCase();
            if (videoKeywords.some(keyword => lowerTag.includes(keyword))) {
                isVideo = true;
                break;
            }
        }

        // Se encontrou as palavras chave, designa à "video", caso contrário, ao filtro "design".
        const category = isVideo ? 'video' : 'design';
        
        return {
            title: item.title,
            description: item.description || (isVideo ? 'Projeto em Vídeo' : 'Projeto Gráfico'),
            thumbnail: item.thumbnail,
            link: item.link,
            category: category,
            type: category, // Para o seu frontend manter o ícone correspondente
            tags: item.tags
        };
    });

    // Escreve os resultados no seu projeto para uso do front-end
    const configContent = `// Arquivo atualizado automaticamente via script sincronizador moderno do Behance (Puppeteer)\nwindow.portfolioConfig = {\n    projects: ${JSON.stringify(finalProjects, null, 4)}\n};\n`;
    
    fs.writeFileSync('config.js', configContent, 'utf8');
    
    console.log(`💾 O config.js e os filtros do seu site foram atualizados com sucesso resolvendo ambos os problemas!`);
    
})();
