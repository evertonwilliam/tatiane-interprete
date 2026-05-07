# Tatiane Leão - Intérprete de Libras

## 📋 Descrição

Site profissional landing page para Tatiane Leão, especializada em interpretação e educação em Libras (Língua Brasileira de Sinais). O site foi desenvolvido com foco em **acessibilidade**, **responsividade** e **inclusão**.

## ✨ Características Principais

### 🎨 Design Moderno
- Cores inspiradas em Libras (azul, branco, tons pastéis)
- Interface intuitiva e moderna
- Animações suaves e transições fluidas
- Design responsivo (mobile-first)

### ♿ Acessibilidade
- **Modo Escuro/Claro**: Toggle entre temas para conforto visual
- **Preparado para Leitores de Tela**: HTML semântico com ARIA labels
- **Navegação Intuitiva**: Menu fixo e smooth scroll
- **Contraste Adequado**: Cores com contraste conforme WCAG
- **Fontes Legíveis**: Fonte Poppins, tamanhos generosos

### 📱 Responsividade
- Totalmente responsivo para:
  - Celulares (320px+)
  - Tablets (768px+)
  - Desktops (1024px+)
  - Notebooks (1200px+)

### 🎥 Seção de Vídeos
- **Até 6 vídeos do YouTube** embutidos
- Layout responsivo para players de vídeo
- Proporção 16:9 mantida automaticamente
- Fácil customização de vídeos

### 🚀 Performance
- Carregamento rápido
- Imagens otimizadas
- CSS e JavaScript otimizado
- Estrutura leve

## 📁 Estrutura do Projeto

```
tatiane-leao-site-v2/
├── index.html              # Página completa com seção de vídeos
├── css/
│   └── styles.css          # Estilos CSS (completo com vídeos)
├── js/
│   └── script.js           # Lógica JavaScript
├── imagens/                # Pasta para armazenar imagens
│   ├── tatiane-leao-hero.jpg
│   ├── portfolio-evento.jpg
│   ├── portfolio-educacao.jpg
│   ├── portfolio-saude.jpg
│   ├── portfolio-treinamento.jpg
│   ├── portfolio-inclusao.jpg
│   └── portfolio-consultoria.jpg
└── README.md              # Este arquivo
```

## 🎯 Seções do Site

1. **Header Fixo**: Menu de navegação sempre visível com links para cada seção
2. **Hero Section**: Apresentação principal com foto e CTA
3. **Experiência**: Dados profissionais, empresa e especialidades
4. **Portfólio**: Galeria de trabalhos e atuações
5. **Vídeos**: Até 6 vídeos do YouTube embutidos 🎥
6. **Sobre**: Descrição completa da profissional
7. **Serviços**: Detalhamento dos serviços oferecidos
8. **Contato**: Formulário, informações e redes sociais
9. **Footer**: Rodapé com links e copyright

## 🎥 Como Adicionar Vídeos do YouTube

### Passo 1: Obter o ID do Vídeo
1. Abra o vídeo no YouTube
2. Copie o ID da URL:
   - Exemplo: `https://www.youtube.com/watch?v=**dQw4w9WgXcQ**`
   - O ID é: `dQw4w9WgXcQ`

### Passo 2: Editar o HTML
1. Abra `index.html`
2. Procure pela seção `<!-- Seção Vídeos YouTube -->`
3. Substitua os placeholders:

```html
<!-- Antes -->
<iframe src="https://www.youtube.com/embed/ADICIONE_VIDEO_ID_1">

<!-- Depois -->
<iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ">
```

### Passo 3: Personalizar Títulos e Descrições
```html
<h3>Título do Vídeo 1</h3>
<p>Descrição breve do conteúdo do vídeo 1</p>
```

### Exemplo Completo
```html
<div class="video-item">
    <div class="video-wrapper">
        <iframe 
            width="100%" 
            height="315" 
            src="https://www.youtube.com/embed/dQw4w9WgXcQ" 
            title="Libras Básico - Aula 1" 
            frameborder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
            allowfullscreen
            loading="lazy">
        </iframe>
    </div>
    <h3>Libras Básico - Aula 1</h3>
    <p>Aprenda os conceitos básicos da Língua de Sinais</p>
</div>
```

## 🛠️ Como Usar

### Instalação
1. Extraia a pasta `tatiane-leao-site-v2`
2. Não há dependências externas - funciona localmente!
3. Abra `index.html` em seu navegador

### Customização

#### Adicionar Imagens
1. Coloque as imagens na pasta `imagens/`
2. Atualize os `src` no HTML:
```html
<img src="imagens/sua-imagem.jpg" alt="Descrição">
```

#### Atualizar Informações
1. Edite as informações de contato em:
   - Links WhatsApp: `5517985853652`
   - Email: `tatiane.leao@gmail.com`
   - Instagram: `@tatiane.leao.75`
   - Facebook: `@tatiane.leao.75`

#### Configurar Tema de Cores
Edite as variáveis CSS em `css/styles.css`:
```css
:root {
    --primary-color: #0066cc;      /* Cor primária */
    --accent-color: #00b8e6;       /* Cor de destaque */
    /* ... outras cores */
}
```

## 🌐 Deploy (Publicar Online)

### Opção 1: GitHub Pages
1. Crie uma conta em GitHub
2. Crie um novo repositório público
3. Faça upload dos arquivos
4. Ative GitHub Pages nas configurações

### Opção 2: Netlify
1. Acesse netlify.com
2. Faça drag & drop da pasta do projeto
3. Site será publicado automaticamente

### Opção 3: Servidor Web
1. Contrate hospedagem
2. Use FTP para upload dos arquivos
3. Configure DNS (domínio)

## 🎨 Recursos de Acessibilidade Implementados

✅ Modo escuro/claro (preservado em localStorage)  
✅ Menu responsivo para dispositivos móveis  
✅ Navegação por teclado (Tab)  
✅ ARIA labels para elementos interativos  
✅ Contraste de cores adequado  
✅ Fontes legíveis em vários tamanhos  
✅ Botão "voltar ao topo" para facilitar navegação  
✅ Formulário acessível com campos nomeados  
✅ Smooth scroll para melhor experiência  
✅ Vídeos embutidos com suporte a teclado  

## 📱 Compatibilidade

- ✅ Chrome/Edge (Recomendado)
- ✅ Firefox
- ✅ Safari
- ✅ Opera
- ✅ Navegadores mobile (iOS/Android)

## 🔧 Tecnologias Utilizadas

- **HTML5**: Estrutura semântica
- **CSS3**: Design responsivo, flexbox, grid, animações
- **JavaScript Vanilla**: Sem dependências externas
- **YouTube Embed API**: Para incorporar vídeos
- **Font Awesome**: Ícones
- **Google Fonts**: Fonte Poppins

## 📄 Licença

Este projeto foi desenvolvido especificamente para Tatiane Leão. Todos os direitos reservados.

## 💬 Suporte

Para dúvidas ou personalizações, entre em contato através das informações disponíveis no site.

---

**Desenvolvido com ❤️ para promover acessibilidade e inclusão da comunidade surda.**

Versão 2.0 - Com suporte a vídeos YouTube - 2024
