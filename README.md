# Site do Sindicato Rural de Jataí

Site institucional completo com painel de administração próprio — sem WordPress, sem banco de dados.

Front-end em HTML, CSS e JavaScript puro. Back-end em PHP com armazenamento em arquivos JSON, pronto para hospedagem compartilhada (Hostinger, Locaweb, HostGator).

---

## O que o site tem

**Páginas públicas** — Início, História, Diretoria, Nossa Equipe, Cotações do Agro, Locação de Espaços, Cursos e Treinamentos, Balcão de Emprego Rural, Eventos, Equoterapia, Notícias (com filtros e tags), Matéria, Galeria de Fotos, Galeria de Vídeos, Clube de Vantagens, Seja um Associado, Leilão de Gado, Contato, Informações do Agro, Mapa do Site e página de erro.

**Recursos** — faixa de cotações em tempo real, contagem regressiva para o leilão de quarta-feira, busca global (Ctrl+K), carrossel de destaques, barra de acessibilidade (alto contraste e tamanho de fonte), formulários que chegam por e-mail e WhatsApp, galeria com lightbox e compartilhamento de matérias.

**Painel da Redação** (`#/redacao`) — publicações, editor de texto com imagens e tags, biblioteca de mídia, editor de cotações, editor de todo o conteúdo do site, mensagens recebidas, usuários, registro de atividades e conta.

---

## Estrutura

```
index.html            página única, rotas por hash (#/pagina)
css/style.css         identidade visual (verde #70B078, laranja #E08038, fonte Archivo)
js/data.js            conteúdo inicial + estrutura dos editores do painel
js/core.js            utilitários, ícones, armazenamento e camada de conteúdo
js/app.js             páginas públicas, rotas e animações
js/admin.js           painel da Redação (carregado só quando o painel abre)
api/index.php         back-end: publicações, conteúdo, mídia, usuários, mensagens
api/seed/posts.json   matérias iniciais, importadas na primeira execução
api/data/             dados gravados pelo painel (criada automaticamente, bloqueada ao público)
uploads/              imagens enviadas pelo painel (criada automaticamente)
assets/               logo e fotos
```

---

## Publicar na Hostinger

1. No hPanel, abra **Gerenciador de arquivos** e entre em `public_html`.
2. Envie todo o conteúdo desta pasta (compacte em `.zip`, envie e extraia).
3. Em **Avançado → Configuração PHP**, use **PHP 8.1 ou superior**.
4. Confirme que `api/data` e `uploads` têm permissão de escrita (755; se der erro ao salvar, 775).
5. Ative o **SSL gratuito** no painel da hospedagem.
6. Acesse `https://seudominio.com.br/#/redacao` e entre com `admin` / `srj2026`.
7. O sistema **exige a troca da senha** no primeiro acesso. Em **Usuários**, crie o login de cada jornalista.

Sem o PHP (abrindo o `index.html` direto ou num servidor de arquivos estáticos), o site funciona normalmente e o painel entra em **modo local**: as alterações ficam salvas apenas no navegador de quem editou. Serve para demonstração.

---

## Tudo é editável pelo painel

| Seção do painel | O que altera |
|---|---|
| Publicações | Todas as matérias, inclusive as 30 importadas do site antigo |
| Cotações | Dólar, agricultura por comprador e pecuária — alimenta a faixa do topo |
| Conteúdo do site | Dados do sindicato, diretoria, equipe, história, espaços, equoterapia, benefícios, convênios, leilão, cursos, fotos, vídeos, links e parceiros |
| Mídia | Biblioteca de imagens enviadas |
| Mensagens | Envios dos formulários de contato, pré-cadastro e currículo |
| Usuários | Contas de acesso e papéis |
| Segurança | Proteções ativas e registro de atividades |

Não há texto fixo no código que o sindicato não consiga trocar sozinho.

---

## Segurança

- Senhas guardadas com `password_hash` (bcrypt), nunca em texto.
- Sessão por token aleatório de 256 bits, com validade de 15 dias.
- Bloqueio temporário após 5 tentativas de login erradas.
- Troca de senha obrigatória no primeiro acesso e senha mínima de 8 caracteres.
- Autenticação por cabeçalho `X-Auth`, imune a CSRF por cookie.
- Upload restrito a JPG, PNG, WebP e GIF, com verificação real do arquivo.
- Execução de scripts bloqueada na pasta `uploads`.
- Pasta `api/data` inacessível pelo navegador.
- HTML das matérias limpo de scripts no navegador e no servidor.
- Permissões por papel: jornalista edita apenas as próprias matérias.
- Registro de atividades de quem publicou, editou ou excluiu.

---

## Manutenção

**Ao alterar CSS ou JS**, aumente o número da versão em `index.html` (`?v=8` → `?v=9`) e em `js/app.js` (linha que carrega `admin.js`). Isso força o navegador a baixar a versão nova em vez da que está em cache.

**Backup**: copie a pasta `api/data` (conteúdo e publicações) e `uploads` (imagens) periodicamente.

---

## Compatibilidade

Chrome, Edge, Firefox, Safari 13+ e navegadores móveis. JavaScript escrito em ES5 com prefixos `-webkit-` onde necessário, sem dependências externas além da fonte Archivo do Google Fonts.

---

Desenvolvido por [@ofrancomaia](https://instagram.com/ofrancomaia).
