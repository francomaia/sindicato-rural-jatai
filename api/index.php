<?php
/* =====================================================================
   Sindicato Rural de Jataí — API da Redação
   PHP 7.4+ / 8.x · sem banco de dados (arquivos JSON em api/data)
   ---------------------------------------------------------------------
   Segurança:
   - senhas com password_hash (bcrypt), nunca em texto
   - sessões com token aleatório de 256 bits e validade
   - bloqueio temporário após tentativas erradas de login
   - troca de senha obrigatória no primeiro acesso
   - autenticação por cabeçalho (imune a CSRF por cookie)
   - upload restrito a imagens verificadas, sem execução de scripts
   - pasta de dados inacessível pelo navegador
   - registro de atividades
   ===================================================================== */
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('Referrer-Policy: strict-origin-when-cross-origin');
header('Cache-Control: no-store, no-cache, must-revalidate');
header('Permissions-Policy: geolocation=(), microphone=(), camera=()');

define('DATA_DIR',    __DIR__ . '/data');
define('SEED_DIR',    __DIR__ . '/seed');
define('UPLOAD_DIR',  dirname(__DIR__) . '/uploads');
define('UPLOAD_URL',  'uploads');
define('SESSAO_DIAS', 15);
define('MAX_UPLOAD',  8 * 1024 * 1024);
define('MAX_POST',    2000000);
define('SENHA_MIN',   8);
define('USUARIO_INICIAL', 'admin');
define('SENHA_INICIAL',   'srj2026');

/* ---------------------------------------------------------------------
   Utilidades
   --------------------------------------------------------------------- */
function responder($dados, int $codigo = 200): void {
    http_response_code($codigo);
    echo json_encode($dados, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}
function erro(string $msg, int $codigo = 400): void { responder(['error' => $msg], $codigo); }

function prepararPastas(): void {
    foreach ([DATA_DIR, UPLOAD_DIR] as $d) {
        if (!is_dir($d)) @mkdir($d, 0755, true);
    }
    $negar = "<IfModule mod_authz_core.c>\nRequire all denied\n</IfModule>\n<IfModule !mod_authz_core.c>\nOrder allow,deny\nDeny from all\n</IfModule>\n";
    if (!file_exists(DATA_DIR . '/.htaccess')) @file_put_contents(DATA_DIR . '/.htaccess', $negar);
    if (!file_exists(DATA_DIR . '/index.html')) @file_put_contents(DATA_DIR . '/index.html', '');
    $up = UPLOAD_DIR . '/.htaccess';
    if (!file_exists($up)) {
        @file_put_contents($up, "Options -Indexes\nphp_flag engine off\n<FilesMatch \"\\.(php|phtml|php\\d|phar|cgi|pl|sh|py|asp|aspx|jsp)$\">\n" . $negar . "</FilesMatch>\n");
    }
}
function lerJson(string $nome, $padrao) {
    $f = DATA_DIR . "/$nome.json";
    if (!file_exists($f)) return $padrao;
    $fp = @fopen($f, 'r');
    if (!$fp) return $padrao;
    flock($fp, LOCK_SH);
    $bruto = stream_get_contents($fp);
    flock($fp, LOCK_UN);
    fclose($fp);
    $j = json_decode((string)$bruto, true);
    return is_array($j) ? $j : $padrao;
}
function gravarJson(string $nome, $dados): void {
    $f = DATA_DIR . "/$nome.json";
    $fp = @fopen($f, 'c');
    if (!$fp) erro('Não foi possível gravar em api/data. Ajuste a permissão da pasta para 755 ou 775.', 500);
    flock($fp, LOCK_EX);
    ftruncate($fp, 0);
    rewind($fp);
    fwrite($fp, json_encode($dados, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT));
    fflush($fp);
    flock($fp, LOCK_UN);
    fclose($fp);
}
function corpo(): array {
    $bruto = file_get_contents('php://input');
    if ($bruto === false || strlen($bruto) > MAX_POST) return [];
    $j = json_decode($bruto, true);
    return is_array($j) ? $j : [];
}
function limpar($v, int $max = 300): string {
    $s = is_scalar($v) ? (string)$v : '';
    $s = strip_tags($s);
    $s = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F]/u', '', $s);
    return trim(mb_substr((string)$s, 0, $max));
}
function idSeguro($v): string { return preg_replace('/[^A-Za-z0-9_-]/', '', (string)$v); }
function slug(string $s): string {
    $s = mb_strtolower($s, 'UTF-8');
    $tr = @iconv('UTF-8', 'ASCII//TRANSLIT//IGNORE', $s);
    if ($tr !== false) $s = $tr;
    $s = preg_replace('/[^a-z0-9]+/', '-', (string)$s);
    return trim(mb_substr((string)$s, 0, 80), '-');
}
function novoId(): string { return substr(bin2hex(random_bytes(8)), 0, 12); }
function ipHash(): string {
    $ip = $_SERVER['HTTP_CF_CONNECTING_IP'] ?? $_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['REMOTE_ADDR'] ?? '0';
    $ip = explode(',', (string)$ip)[0];
    return substr(hash('sha256', trim($ip) . '|srj'), 0, 32);
}

/* ---------------------------------------------------------------------
   Usuários e sessões
   --------------------------------------------------------------------- */
function usuarios(): array {
    $u = lerJson('users', []);
    if (!$u) {
        $u = [[
            'id' => 'u1', 'nome' => 'Administrador', 'usuario' => USUARIO_INICIAL,
            'papel' => 'admin', 'hash' => password_hash(SENHA_INICIAL, PASSWORD_DEFAULT),
            'trocarSenha' => true, 'criado' => date('Y-m-d')
        ]];
        gravarJson('users', $u);
    }
    return $u;
}
function usuarioPublico(array $u): array {
    return [
        'id' => $u['id'], 'nome' => $u['nome'], 'usuario' => $u['usuario'],
        'papel' => $u['papel'], 'trocarSenha' => !empty($u['trocarSenha']), 'criado' => $u['criado'] ?? null
    ];
}
function usuarioAtual(): ?array {
    $tok = $_SERVER['HTTP_X_AUTH'] ?? '';
    if (!preg_match('/^[a-f0-9]{64}$/', (string)$tok)) return null;
    $sessoes = lerJson('sessions', []);
    $agora = time();
    $validas = [];
    $achado = null;
    foreach ($sessoes as $s) {
        if (($s['exp'] ?? 0) < $agora) continue;
        $validas[] = $s;
        if (hash_equals((string)$s['token'], (string)$tok)) $achado = $s;
    }
    if (count($validas) !== count($sessoes)) gravarJson('sessions', $validas);
    if (!$achado) return null;
    foreach (usuarios() as $u) if ($u['id'] === $achado['uid']) return $u;
    return null;
}
function exigirUsuario(): array {
    $u = usuarioAtual();
    if (!$u) erro('Sessão expirada. Entre novamente.', 401);
    return $u;
}
function exigirAdmin(): array {
    $u = exigirUsuario();
    if (($u['papel'] ?? '') !== 'admin') erro('Apenas administradores podem fazer isso.', 403);
    return $u;
}
function podeEditar(array $u, array $post): bool {
    return ($u['papel'] ?? '') === 'admin' || ($post['editor'] ?? '') === $u['usuario'] || empty($post['editor']);
}

function limiteLogin(bool $falhou): void {
    $t = lerJson('throttle', []);
    $k = ipHash();
    $agora = time();
    foreach ($t as $kk => $v) if (($v['ate'] ?? 0) < $agora - 3600) unset($t[$kk]);
    $e = $t[$k] ?? ['n' => 0, 'ate' => 0];
    if (($e['n'] ?? 0) >= 5 && ($e['ate'] ?? 0) > $agora) {
        $min = (int)ceil((($e['ate']) - $agora) / 60);
        erro("Muitas tentativas. Tente novamente em {$min} minuto(s).", 429);
    }
    if ($falhou) {
        $e['n'] = ($e['n'] ?? 0) + 1;
        $e['ate'] = $agora + 900;
        $t[$k] = $e;
        gravarJson('throttle', $t);
    } elseif (isset($t[$k])) {
        unset($t[$k]);
        gravarJson('throttle', $t);
    }
}
function anotar(string $usuario, string $acao, string $detalhe = ''): void {
    $log = lerJson('log', []);
    array_unshift($log, [
        'quando' => date('c'), 'usuario' => $usuario,
        'acao' => $acao, 'detalhe' => mb_substr($detalhe, 0, 160)
    ]);
    gravarJson('log', array_slice($log, 0, 300));
}

/* ---------------------------------------------------------------------
   Matérias
   --------------------------------------------------------------------- */
function posts(): array {
    $p = lerJson('posts', null);
    if ($p === null) {
        $semente = SEED_DIR . '/posts.json';
        $p = [];
        if (file_exists($semente)) {
            $j = json_decode((string)file_get_contents($semente), true);
            if (is_array($j)) $p = $j;
        }
        gravarJson('posts', $p);
    }
    return $p;
}

/* ---------------------------------------------------------------------
   E-mail
   --------------------------------------------------------------------- */
function destinatarios(): array {
    $c = lerJson('content', []);
    $info = $c['info'] ?? [];
    $lista = [];
    foreach (['email', 'email2'] as $k) {
        $e = $info[$k] ?? null;
        if ($e && filter_var($e, FILTER_VALIDATE_EMAIL)) $lista[] = $e;
    }
    if (!$lista) $lista = ['contato@srjatai.com.br', 'srural.jatai@gmail.com'];
    return array_values(array_unique($lista));
}
function enviarEmail(array $lead): bool {
    if (!function_exists('mail')) return false;
    $para = implode(', ', destinatarios());
    $assunto = '[Site] ' . $lead['tipo'] . ($lead['nome'] ? ' — ' . $lead['nome'] : '');
    $assunto = '=?UTF-8?B?' . base64_encode($assunto) . '?=';

    $linhas = [
        'Nova mensagem enviada pelo site do Sindicato Rural de Jataí.',
        '',
        'Tipo: ' . $lead['tipo'],
        'Nome: ' . ($lead['nome'] ?: '—'),
        'Telefone: ' . ($lead['telefone'] ?: '—'),
        'E-mail: ' . ($lead['email'] ?: '—'),
        'Recebido em: ' . date('d/m/Y H:i'),
        '',
        str_repeat('-', 48),
        '',
        $lead['resumo'],
        '',
        str_repeat('-', 48),
        'Esta mensagem também está registrada no painel da Redação.'
    ];
    $mensagem = implode("\r\n", $linhas);

    $dominio = preg_replace('/^www\./', '', (string)($_SERVER['HTTP_HOST'] ?? 'srjatai.com.br'));
    $remetente = 'nao-responda@' . $dominio;

    $cab = [
        'MIME-Version: 1.0',
        'Content-Type: text/plain; charset=UTF-8',
        'Content-Transfer-Encoding: 8bit',
        'From: Site SRJ <' . $remetente . '>',
        'X-Mailer: SRJ'
    ];
    if (!empty($lead['email']) && filter_var($lead['email'], FILTER_VALIDATE_EMAIL)) {
        $cab[] = 'Reply-To: ' . $lead['email'];
    }
    $ok = @mail($para, $assunto, $mensagem, implode("\r\n", $cab), '-f' . $remetente);
    return (bool)$ok;
}

/* =====================================================================
   Roteamento
   ===================================================================== */
prepararPastas();
$r = (string)($_GET['r'] ?? '');
$metodo = $_SERVER['REQUEST_METHOD'];

/* ---- status ---- */
if ($r === 'ping') {
    $u = usuarioAtual();
    responder(['ok' => true, 'versao' => '2.0', 'user' => $u ? usuarioPublico($u) : null]);
}

/* ---- login ---- */
if ($r === 'login' && $metodo === 'POST') {
    limiteLogin(false);
    $b = corpo();
    $login = mb_strtolower(limpar($b['usuario'] ?? '', 60));
    $senha = (string)($b['senha'] ?? '');
    foreach (usuarios() as $u) {
        if ($u['usuario'] === $login && password_verify($senha, $u['hash'])) {
            limiteLogin(false);
            $tok = bin2hex(random_bytes(32));
            $s = lerJson('sessions', []);
            $s[] = ['token' => $tok, 'uid' => $u['id'], 'exp' => time() + SESSAO_DIAS * 86400, 'ip' => ipHash(), 'criada' => date('c')];
            gravarJson('sessions', array_values($s));
            anotar($u['usuario'], 'entrou no painel');
            responder(['token' => $tok, 'user' => usuarioPublico($u)]);
        }
    }
    usleep(500000);
    limiteLogin(true);
    erro('Usuário ou senha incorretos.', 401);
}

if ($r === 'logout' && $metodo === 'POST') {
    $tok = $_SERVER['HTTP_X_AUTH'] ?? '';
    $s = array_values(array_filter(lerJson('sessions', []), function ($x) use ($tok) {
        return !hash_equals((string)$x['token'], (string)$tok);
    }));
    gravarJson('sessions', $s);
    responder(['ok' => true]);
}

/* ---- matérias ---- */
if ($r === 'posts' && $metodo === 'GET') {
    $u = usuarioAtual();
    $p = posts();
    if (!$u) {
        $p = array_values(array_filter($p, function ($x) { return ($x['status'] ?? '') !== 'rascunho'; }));
    }
    usort($p, function ($a, $b) { return strcmp((string)($b['data'] ?? ''), (string)($a['data'] ?? '')); });
    responder(['posts' => $p]);
}

if ($r === 'post' && $metodo === 'POST') {
    $u = exigirUsuario();
    $b = corpo();
    $lista = posts();

    $id = idSeguro($b['id'] ?? '') ?: novoId();
    $idx = null;
    foreach ($lista as $i => $x) if (($x['id'] ?? '') === $id) $idx = $i;
    if ($idx !== null && !podeEditar($u, $lista[$idx])) {
        erro('Você só pode editar as publicações que criou.', 403);
    }

    $titulo = limpar($b['titulo'] ?? '', 200);
    if ($titulo === '') erro('Informe o título da matéria.');

    $html = (string)($b['html'] ?? '');
    if (strlen($html) > MAX_POST) erro('Texto muito longo. Envie as imagens pela biblioteca de mídia em vez de colá-las.');
    $html = preg_replace('#<\s*(script|iframe|object|embed|form|style)[^>]*>.*?<\s*/\s*\1\s*>#is', '', $html);
    $html = preg_replace('#\son[a-z]+\s*=\s*("[^"]*"|\'[^\']*\'|[^\s>]+)#i', '', (string)$html);
    $html = preg_replace('#javascript\s*:#i', '', (string)$html);

    $slugPost = slug((string)($b['slug'] ?? $titulo)) ?: $id;
    foreach ($lista as $x) {
        if (($x['slug'] ?? '') === $slugPost && ($x['id'] ?? '') !== $id) $slugPost .= '-' . substr($id, -4);
    }

    $tags = [];
    foreach ((array)($b['tags'] ?? []) as $t) {
        $t = limpar($t, 40);
        if ($t !== '' && !in_array($t, $tags, true)) $tags[] = $t;
        if (count($tags) >= 12) break;
    }

    $img = (string)($b['img'] ?? '');
    if ($img !== '' && !preg_match('#^(uploads/|assets/|https://|data:image/)#', $img)) $img = '';

    $cat = limpar($b['cat'] ?? 'Notícias', 30);
    $data = preg_match('/^\d{4}-\d{2}-\d{2}$/', (string)($b['data'] ?? '')) ? $b['data'] : date('Y-m-d');

    $registro = [
        'id' => $id,
        'slug' => $slugPost,
        'titulo' => $titulo,
        'kicker' => limpar($b['kicker'] ?? '', 60),
        'cat' => $cat,
        'tags' => $tags,
        'resumo' => limpar($b['resumo'] ?? '', 400),
        'html' => $html,
        'img' => $img,
        'imgAlt' => limpar($b['imgAlt'] ?? '', 200),
        'imgLegenda' => limpar($b['imgLegenda'] ?? '', 200),
        'autor' => limpar($b['autor'] ?? $u['nome'], 140),
        'data' => $data,
        'status' => (($b['status'] ?? '') === 'publicado') ? 'publicado' : 'rascunho',
        'destaque' => !empty($b['destaque']),
        'editor' => $idx !== null ? ($lista[$idx]['editor'] ?? $u['usuario']) : $u['usuario'],
        'atualizado' => date('c'),
        'atualizadoPor' => $u['usuario']
    ];

    if ($idx !== null) $lista[$idx] = $registro;
    else array_unshift($lista, $registro);

    gravarJson('posts', array_values($lista));
    anotar($u['usuario'], $idx === null ? 'criou publicação' : 'editou publicação', $titulo);
    responder(['post' => $registro]);
}

if ($r === 'post' && $metodo === 'DELETE') {
    $u = exigirUsuario();
    $id = idSeguro($_GET['id'] ?? '');
    $lista = posts();
    $titulo = '';
    $novo = [];
    foreach ($lista as $x) {
        if (($x['id'] ?? '') === $id) {
            if (!podeEditar($u, $x)) erro('Você só pode excluir as publicações que criou.', 403);
            $titulo = $x['titulo'] ?? '';
            continue;
        }
        $novo[] = $x;
    }
    gravarJson('posts', $novo);
    anotar($u['usuario'], 'excluiu publicação', $titulo);
    responder(['ok' => true]);
}

/* ---- conteúdo do site ---- */
if ($r === 'content' && $metodo === 'GET') {
    responder(['content' => lerJson('content', [])]);
}
if ($r === 'content' && $metodo === 'POST') {
    $u = exigirUsuario();
    $b = corpo();
    $key = (string)($b['key'] ?? '');
    if (!preg_match('/^[a-zA-Z0-9_.]{1,60}$/', $key)) erro('Chave de conteúdo inválida.');
    if (!array_key_exists('valor', $b)) erro('Conteúdo ausente.');
    $bruto = json_encode($b['valor']);
    if ($bruto === false || strlen($bruto) > 400000) erro('Conteúdo muito grande.');
    $c = lerJson('content', []);
    $c[$key] = $b['valor'];
    gravarJson('content', $c);
    anotar($u['usuario'], 'atualizou conteúdo', $key);
    responder(['ok' => true]);
}

/* ---- upload de imagens ---- */
if ($r === 'upload' && $metodo === 'POST') {
    $u = exigirUsuario();
    if (empty($_FILES['file']) || !is_uploaded_file($_FILES['file']['tmp_name'] ?? '')) {
        erro('Nenhum arquivo recebido.');
    }
    $f = $_FILES['file'];
    if (($f['error'] ?? 1) !== UPLOAD_ERR_OK) erro('Falha no envio do arquivo.');
    if (($f['size'] ?? 0) > MAX_UPLOAD) erro('Imagem acima de 8 MB.');

    $info = @getimagesize($f['tmp_name']);
    if (!$info || empty($info[2])) erro('O arquivo não é uma imagem válida.');
    $mapa = [IMAGETYPE_JPEG => 'jpg', IMAGETYPE_PNG => 'png', IMAGETYPE_WEBP => 'webp', IMAGETYPE_GIF => 'gif'];
    if (!isset($mapa[$info[2]])) erro('Formato não suportado. Use JPG, PNG, WebP ou GIF.');
    $ext = $mapa[$info[2]];

    $sub = date('Y/m');
    $dir = UPLOAD_DIR . "/$sub";
    if (!is_dir($dir) && !@mkdir($dir, 0755, true)) {
        erro('Não foi possível criar a pasta uploads. Ajuste as permissões.', 500);
    }
    $nome = date('Ymd-His') . '-' . substr(bin2hex(random_bytes(4)), 0, 8) . '.' . $ext;
    if (!@move_uploaded_file($f['tmp_name'], "$dir/$nome")) erro('Não foi possível salvar a imagem.', 500);
    @chmod("$dir/$nome", 0644);

    $url = UPLOAD_URL . "/$sub/$nome";
    $m = lerJson('media', []);
    array_unshift($m, [
        'url' => $url, 'nome' => limpar($f['name'] ?? $nome, 120),
        'quando' => date('c'), 'por' => $u['usuario'],
        'largura' => $info[0], 'altura' => $info[1]
    ]);
    gravarJson('media', array_slice($m, 0, 500));
    responder(['url' => $url, 'largura' => $info[0], 'altura' => $info[1]]);
}

if ($r === 'media' && $metodo === 'GET') {
    exigirUsuario();
    responder(['media' => lerJson('media', [])]);
}
if ($r === 'media' && $metodo === 'DELETE') {
    $u = exigirUsuario();
    $url = (string)($_GET['url'] ?? '');
    if (!preg_match('#^uploads/\d{4}/\d{2}/[A-Za-z0-9._-]+$#', $url)) erro('Endereço inválido.');
    $arq = dirname(__DIR__) . '/' . $url;
    $base = realpath(UPLOAD_DIR);
    $real = realpath($arq);
    if ($real && $base && strpos($real, $base) === 0) @unlink($real);
    $m = array_values(array_filter(lerJson('media', []), function ($x) use ($url) { return ($x['url'] ?? '') !== $url; }));
    gravarJson('media', $m);
    anotar($u['usuario'], 'excluiu imagem', $url);
    responder(['ok' => true]);
}

/* ---- usuários ---- */
if ($r === 'users' && $metodo === 'GET') {
    exigirAdmin();
    responder(['users' => array_map('usuarioPublico', usuarios())]);
}
if ($r === 'user' && $metodo === 'POST') {
    $admin = exigirAdmin();
    $b = corpo();
    $lista = usuarios();
    $login = mb_strtolower(preg_replace('/[^a-z0-9._-]/i', '', (string)($b['usuario'] ?? '')));
    $nome = limpar($b['nome'] ?? '', 80);
    $senha = (string)($b['senha'] ?? '');
    $papel = (($b['papel'] ?? '') === 'admin') ? 'admin' : 'jornalista';
    if ($login === '' || $nome === '') erro('Informe nome e login.');
    if (mb_strlen($login) < 3) erro('O login precisa ter ao menos 3 caracteres.');

    $id = idSeguro($b['id'] ?? '');
    $idx = null;
    foreach ($lista as $i => $x) {
        if ($x['id'] === $id) $idx = $i;
        if ($x['usuario'] === $login && $x['id'] !== $id) erro('Já existe um usuário com esse login.');
    }
    if ($idx === null && strlen($senha) < SENHA_MIN) erro('A senha precisa ter ao menos ' . SENHA_MIN . ' caracteres.');

    $reg = $idx !== null ? $lista[$idx] : ['id' => novoId(), 'criado' => date('Y-m-d')];
    $reg['nome'] = $nome;
    $reg['usuario'] = $login;
    $reg['papel'] = $papel;
    if ($senha !== '') {
        if (strlen($senha) < SENHA_MIN) erro('A senha precisa ter ao menos ' . SENHA_MIN . ' caracteres.');
        $reg['hash'] = password_hash($senha, PASSWORD_DEFAULT);
        $reg['trocarSenha'] = true;
    }
    if ($idx !== null) $lista[$idx] = $reg; else $lista[] = $reg;
    gravarJson('users', $lista);
    anotar($admin['usuario'], $idx === null ? 'criou usuário' : 'editou usuário', $login);
    responder(['user' => usuarioPublico($reg)]);
}
if ($r === 'user' && $metodo === 'DELETE') {
    $admin = exigirAdmin();
    $id = idSeguro($_GET['id'] ?? '');
    if ($id === $admin['id']) erro('Você não pode remover a si mesmo.');
    $lista = array_values(array_filter(usuarios(), function ($x) use ($id) { return $x['id'] !== $id; }));
    if (!$lista) erro('É preciso manter ao menos um usuário.');
    gravarJson('users', $lista);
    $s = array_values(array_filter(lerJson('sessions', []), function ($x) use ($id) { return ($x['uid'] ?? '') !== $id; }));
    gravarJson('sessions', $s);
    anotar($admin['usuario'], 'removeu usuário', $id);
    responder(['ok' => true]);
}
if ($r === 'password' && $metodo === 'POST') {
    $eu = exigirUsuario();
    $b = corpo();
    $atual = (string)($b['atual'] ?? '');
    $nova = (string)($b['nova'] ?? '');
    if (strlen($nova) < SENHA_MIN) erro('A nova senha precisa ter ao menos ' . SENHA_MIN . ' caracteres.');
    if ($nova === $atual) erro('A nova senha precisa ser diferente da atual.');
    $lista = usuarios();
    foreach ($lista as $i => $x) {
        if ($x['id'] === $eu['id']) {
            if (!password_verify($atual, $x['hash'])) erro('Senha atual incorreta.');
            $lista[$i]['hash'] = password_hash($nova, PASSWORD_DEFAULT);
            $lista[$i]['trocarSenha'] = false;
            gravarJson('users', $lista);
            anotar($eu['usuario'], 'alterou a própria senha');
            responder(['ok' => true]);
        }
    }
    erro('Usuário não encontrado.', 404);
}

/* ---- mensagens dos formulários ---- */
if ($r === 'lead' && $metodo === 'POST') {
    $b = corpo();
    $leads = lerJson('leads', []);
    $meu = ipHash();
    $recentes = array_filter($leads, function ($x) use ($meu) {
        return ($x['ip'] ?? '') === $meu && strtotime((string)($x['quando'] ?? '')) > time() - 600;
    });
    if (count($recentes) >= 5) erro('Muitos envios seguidos. Tente novamente em alguns minutos.', 429);

    $reg = [
        'id' => novoId(),
        'quando' => date('c'),
        'tipo' => limpar($b['tipo'] ?? 'Contato', 60),
        'nome' => limpar($b['nome'] ?? '', 120),
        'telefone' => limpar($b['telefone'] ?? '', 40),
        'email' => limpar($b['email'] ?? '', 120),
        'resumo' => limpar($b['resumo'] ?? '', 4000),
        'ip' => $meu
    ];
    if ($reg['resumo'] === '') erro('Mensagem vazia.');

    array_unshift($leads, $reg);
    gravarJson('leads', array_slice($leads, 0, 1000));
    $enviado = enviarEmail($reg);
    responder(['ok' => true, 'email' => $enviado]);
}
if ($r === 'leads' && $metodo === 'GET') {
    exigirUsuario();
    $l = array_map(function ($x) { unset($x['ip']); return $x; }, lerJson('leads', []));
    responder(['leads' => $l]);
}
if ($r === 'lead' && $metodo === 'DELETE') {
    $u = exigirUsuario();
    $id = idSeguro($_GET['id'] ?? '');
    $l = array_values(array_filter(lerJson('leads', []), function ($x) use ($id) { return ($x['id'] ?? '') !== $id; }));
    gravarJson('leads', $l);
    anotar($u['usuario'], 'excluiu mensagem');
    responder(['ok' => true]);
}

/* ---- registro de atividades ---- */
if ($r === 'log' && $metodo === 'GET') {
    exigirAdmin();
    responder(['log' => lerJson('log', [])]);
}

erro('Rota não encontrada.', 404);
