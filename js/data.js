/* =====================================================================
   Sindicato Rural de Jataí — conteúdo padrão do site
   ---------------------------------------------------------------------
   Tudo o que está aqui é apenas o CONTEÚDO INICIAL. Depois de publicado,
   todo este conteúdo é editável pelo painel da Redação (#/redacao):
   matérias, cotações, diretoria, equipe, espaços, benefícios, convênios,
   história, fotos, vídeos e os dados de contato do sindicato.
   As informações foram levantadas em srjatai.com.br (setembro de 2026).
   ===================================================================== */
window.SRJ = window.SRJ || {};

/* Autor padrão das matérias já existentes e das novas sem autor definido */
SRJ.AUTOR_PADRAO = "Redação SRJ";

/* Categorias disponíveis para as publicações */
SRJ.CATEGORIAS = ["Notícias", "Artigos", "Avisos", "Editais", "Cotações", "Eventos", "Convênios", "Cursos"];

/* =====================================================================
   Conteúdo padrão (editável no painel)
   ===================================================================== */
SRJ.defaults = {

  /* ---------------- Dados do sindicato ---------------- */
  info: {
    nome: "Sindicato Rural de Jataí",
    sigla: "SRJ",
    desde: "1968",
    endereco: "Av. Goiás, 1961, Centro",
    cidade: "Jataí / Goiás",
    cep: "CEP 75800-133",
    telefone: "(64) 3631-8065",
    whatsapp: "(64) 9 9699-6682",
    email: "contato@srjatai.com.br",
    email2: "srural.jatai@gmail.com",
    horario: "Segunda a sexta, em horário comercial",
    parque: "Parque de Exposições de Jataí — Rodovia GO-186, km 04, à esquerda (zona rural)",
    instagram: "https://www.instagram.com/sindicatoruraldejatai",
    facebook: "https://www.facebook.com/srjatai",
    youtube: "https://www.youtube.com/@SindicatoRuraldeJata%C3%AD"
  },

  /* ---------------- Vídeo de abertura ---------------- */
  heroVideo: {
    ativo: "sim",
    video: "assets/video/hero.mp4",
    poster: "assets/img/hero-poster.jpg",
    eyebrow: "Sindicato Rural de Jataí · desde 1968",
    titulo: "Força para o produtor rural",
    texto: "Representação, capacitação e serviços para quem produz no campo.",
    cta1Texto: "Seja um associado",
    cta1Link: "#/associe-se",
    cta2Texto: "Conheça o sindicato",
    cta2Link: "#/historia"
  },

  /* ---------------- Cotações do agro ---------------- */
  cotacoes: {
    data: "2026-02-23",
    anterior: "2026-01-29",
    dolar: 5.15,
    dolarAnterior: 5.21,
    nota: "Soja e milho: descontar FUNRURAL e FUNDEINFRA. Valores por saca de 60 kg (grãos), arroba (pecuária de corte) e quilo (suínos).",
    agricultura: [
      { produto: "Soja", unidade: "R$/sc", obs: "descontar FUNRURAL e FUNDEINFRA", compradores: [
        { nome: "BRF", preco: null, obs: "Fora de mercado" },
        { nome: "Caramuru", preco: 109, obs: "Balcão" },
        { nome: "Cargill", preco: 108, obs: "Balcão" },
        { nome: "Comigo", preco: 109, obs: "Balcão · contrato R$ 109,00 até 28/02/2026" },
        { nome: "Grupo Cereal", preco: 109, obs: "Balcão" },
        { nome: "L. Dreyfus", preco: 109, obs: "Balcão" },
        { nome: "Toyota Novaagri", preco: 109, obs: "Spot · R$ 116,00 para 2027" }
      ]},
      { produto: "Milho", unidade: "R$/sc", obs: "descontar FUNRURAL e FUNDEINFRA", compradores: [
        { nome: "BRF", preco: 57, obs: "Safrinha R$ 51,00" },
        { nome: "Caramuru", preco: null, obs: "Fora de mercado" },
        { nome: "Cargill", preco: 47, obs: "Balcão" },
        { nome: "Comigo", preco: 56, obs: "Balcão" },
        { nome: "Grupo Cereal", preco: 51, obs: "Safrinha 2026 R$ 48,00" },
        { nome: "L. Dreyfus", preco: null, obs: "Fora de mercado" },
        { nome: "Toyota Novaagri", preco: 44, obs: "Futuro" }
      ]},
      { produto: "Sorgo", unidade: "R$/sc", obs: "", compradores: [
        { nome: "BRF", preco: 43, obs: "Safrinha" },
        { nome: "Comigo", preco: 46, obs: "Balcão" },
        { nome: "Grupo Cereal", preco: 39, obs: "Safrinha" }
      ]},
      { produto: "Cana-de-açúcar", unidade: "", obs: "", compradores: [
        { nome: "ATR acumulado", preco: null, obs: "1.1926" },
        { nome: "Cana esteira", preco: 145.46, obs: "por tonelada" }
      ]}
    ],
    pecuaria: [
      { produto: "Boi gordo", unidade: "R$/@", atual: 320, anterior: 305, obs: "" },
      { produto: "Boi China", unidade: "R$/@", atual: 330, anterior: 310, obs: "" },
      { produto: "Vaca", unidade: "R$/@", atual: 305, anterior: 290, obs: "" },
      { produto: "Novilha", unidade: "R$/@", atual: 320, anterior: 300, obs: "" },
      { produto: "Suínos (Comigo)", unidade: "R$/kg", atual: 6.8, anterior: 7.3, obs: "à vista" },
      { produto: "Leite", unidade: "", atual: null, anterior: null, obs: "Preços não repassados" }
    ]
  },

  /* ---------------- Diretoria (eleita em 27/01/2026) ---------------- */
  diretoria: {
    titulares: [
      { nome: "Aline Rezende Vilela Gaiardo", cargo: "Presidente" },
      { nome: "Randolfo Augusto de Oliveira", cargo: "Vice-Presidente" },
      { nome: "Antonio José Gazarini", cargo: "Secretário" },
      { nome: "Rafael Prado", cargo: "Tesoureiro" }
    ],
    suplentes: [
      { nome: "Júlio Priori", cargo: "Secretário suplente" },
      { nome: "Joaquim Ribas", cargo: "Suplente" },
      { nome: "Ricardo Leal", cargo: "Suplente" },
      { nome: "Alceu Ayres", cargo: "Suplente" }
    ],
    conselho: [
      { nome: "Lia Katzer", cargo: "Conselho Fiscal" },
      { nome: "Sílvio Lacerda", cargo: "Conselho Fiscal" },
      { nome: "Adenísia Garcia", cargo: "Conselho Fiscal" },
      { nome: "Fabio Pazzinato", cargo: "Conselho Fiscal" },
      { nome: "Ricardo Peres", cargo: "Conselho Fiscal" },
      { nome: "Caroline Gazarini", cargo: "Conselho Fiscal" },
      { nome: "Vitor Geraldo Gaiardo", cargo: "Conselho Fiscal" },
      { nome: "Joel Ragagnin", cargo: "Conselho Fiscal" }
    ]
  },

  /* ---------------- Equipe ---------------- */
  equipe: [
    { nome: "Renata Souza", cargo: "Secretaria", setor: "Administrativo e Financeiro" },
    { nome: "Rafaela Barros", cargo: "Departamento de RH e Caixa", setor: "Administrativo e Financeiro" },
    { nome: "Josemar Ferro", cargo: "Departamento Financeiro", setor: "Administrativo e Financeiro" },
    { nome: "Renata Loureiro", cargo: "Assessora — Departamento de Contabilidade", setor: "Administrativo e Financeiro" },
    { nome: "Marilene Barros", cargo: "Departamento Pessoal", setor: "Administrativo e Financeiro" },
    { nome: "Nara Regina Vicente", cargo: "Departamento Pessoal", setor: "Administrativo e Financeiro" },
    { nome: "Valquênia Martins", cargo: "Departamento Pessoal", setor: "Administrativo e Financeiro" },
    { nome: "Suzana Lopes da Silva", cargo: "Copeira", setor: "Administrativo e Financeiro" },
    { nome: "Dr. Fábio Fagundes", cargo: "Departamento Jurídico", setor: "Assessoria e Serviços" },
    { nome: "Taynara P. Côrtes", cargo: "Zootecnista — Assessoria Técnica", setor: "Assessoria e Serviços" },
    { nome: "Paulo César de Araújo", cargo: "Leilão", setor: "Assessoria e Serviços" },
    { nome: "Messias Veloso", cargo: "Mobilizador Senar/GO", setor: "Assessoria e Serviços" },
    { nome: "Nayara Dutra", cargo: "Coordenadora", setor: "Centro de Equoterapia Primeiro Passo" },
    { nome: "Ingrid Borges", cargo: "Fisioterapeuta", setor: "Centro de Equoterapia Primeiro Passo" },
    { nome: "Regis Souza de Oliveira", cargo: "Equitador", setor: "Centro de Equoterapia Primeiro Passo" },
    { nome: "Dourival Ferreira Freires", cargo: "Serviços Gerais", setor: "Parque de Exposições" },
    { nome: "Uiliam", cargo: "Zelador", setor: "Parque de Exposições" },
    { nome: "Maria Rosa", cargo: "Zeladora", setor: "Parque de Exposições" }
  ],

  /* ---------------- História ---------------- */
  historia: {
    texto: [
      "A organização dos produtores rurais de Jataí começa em 1965, com a criação da Associação Rural pelo Sr. César de Almeida Melo, que organizou as primeiras exposições agropecuárias locais. Em 19 de fevereiro de 1966, o Sr. Osvaldo França Rezende assumiu a liderança durante a terceira exposição.",
      "A transformação em sindicato ocorreu em 12 de setembro de 1968, mediante a iniciativa das lideranças rurais. O Sr. Vicente da Silva Nogueira foi eleito o primeiro presidente, iniciando um ciclo de gestões trienais que se mantém até hoje.",
      "Desde então a entidade organizou exposições, manteve princípios democráticos de gestão e ampliou seus serviços: capacitação profissional com o Senar, apoio ao emprego rural, informação de mercado, leilões semanais no Parque de Exposições e, desde 2011, o Centro de Equoterapia Primeiro Passo.",
      "Nossa missão é defender incansavelmente os direitos, reivindicações e interesses de todos os membros, em todos os setores da agropecuária."
    ],
    marcos: [
      { ano: "1943", titulo: "1ª Exposição Rural de Jataí", texto: "Em 13 de junho de 1943 fazendeiros e expositores se reúnem na primeira Exposição Rural em Jataí, registro mais antigo do associativismo rural na cidade." },
      { ano: "1965", titulo: "Associação Rural", texto: "O Sr. César de Almeida Melo cria a Associação Rural e organiza as primeiras exposições agropecuárias locais." },
      { ano: "1966", titulo: "3ª Exposição", texto: "Em 19 de fevereiro de 1966 o Sr. Osvaldo França Rezende assume a liderança durante a terceira exposição." },
      { ano: "1968", titulo: "Nasce o Sindicato", texto: "Em 12 de setembro de 1968, por iniciativa das lideranças rurais, a associação é transformada em Sindicato Rural de Jataí." },
      { ano: "1969", titulo: "Primeiro presidente", texto: "O Sr. Vicente da Silva Nogueira é eleito o primeiro presidente do Sindicato, iniciando o ciclo de gestões trienais." },
      { ano: "2011", titulo: "Centro de Equoterapia Primeiro Passo", texto: "O Sindicato cria o centro de equoterapia, serviço gratuito de atendimento à comunidade." },
      { ano: "2026", titulo: "Nova diretoria", texto: "A eleição de 27 de janeiro de 2026 elege Aline Rezende Vilela Gaiardo presidente da entidade." }
    ],
    presidentes: [
      { nome: "Vicente da Silva Nogueira", periodo: "1969 – 1971" },
      { nome: "Carlos Eduardo Vilela", periodo: "1972 – 1974" },
      { nome: "Carlos Eduardo Vilela", periodo: "1975 – 1977" },
      { nome: "Balduíno França Filho", periodo: "1978 – 1980" },
      { nome: "Carlos Eduardo Vilela", periodo: "1981 – 1983" },
      { nome: "Carlos Eduardo Vilela", periodo: "1984 – 1986" },
      { nome: "Belarmino Luiz Neto", periodo: "1987 – 1989" },
      { nome: "Belarmino Luiz Neto", periodo: "1990 – 1993" },
      { nome: "Nélio de Moraes Vilela", periodo: "1993 – 1995" },
      { nome: "Nélio de Moraes Vilela", periodo: "1996 – 1998" },
      { nome: "Ideuzide Assis da Silva", periodo: "" },
      { nome: "Nélio de Moraes Vilela", periodo: "2002 – 2005" },
      { nome: "Mozart Carvalho de Assis", periodo: "" },
      { nome: "Ricardo Assis Peres", periodo: "" },
      { nome: "Vitor Geraldo Gaiardo", periodo: "2018 – 2020" },
      { nome: "Vitor Geraldo Gaiardo", periodo: "2021 – 2023" },
      { nome: "Evandro Vilela Barros", periodo: "Gestão anterior" },
      { nome: "Aline Rezende Vilela Gaiardo", periodo: "Gestão atual" }
    ]
  },

  /* ---------------- Espaços para locação ---------------- */
  locacoes: [
    { nome: "Pavilhão para Shows e Grandes Eventos", capacidade: "3.000", local: "Parque de Exposições", img: "assets/img/pavilhao.jpg",
      itens: "Palco com área de 125 m²\nDois camarins com banheiro\nBanheiros completos masculinos, femininos e adaptados" },
    { nome: "Tatersal", capacidade: "900", local: "Parque de Exposições", img: "assets/img/tatersal.jpg",
      itens: "Estrutura para palco\nBanheiros masculinos e femininos\nCozinha\nBar\nChurrasqueira" },
    { nome: "Fazendinha", capacidade: "300", local: "Parque de Exposições", img: "assets/img/fazendinha.jpg",
      itens: "Banheiros\nCozinha\nChurrasqueira\nFogão a lenha\nAmpla área externa gramada" },
    { nome: "Auditório", capacidade: "200", local: "Prédio do CCAJ, ao lado da sede — Av. Goiás, 1961, Centro", img: "assets/img/auditorio.jpg",
      itens: "Sonoplastia\nCopa com geladeira\nBebedouro com 2 galões de 20 litros e copos\nBanheiros masculino, feminino e adaptado\nTaxa de limpeza inclusa" },
    { nome: "Quiosque", capacidade: "100", local: "Parque de Exposições", img: "assets/img/quiosque.jpg",
      itens: "Churrasqueira\nCozinha\nBar\nBanheiros masculino e feminino\nÁrea externa com pergolado e gramada" },
    { nome: "Sala de Reunião", capacidade: "25", local: "Sede do Sindicato — Av. Goiás, 1961, Centro", img: "assets/img/sala-reuniao.jpg",
      itens: "Sala climatizada\nData show e telão automático\nBanheiros masculino e feminino\nÁgua e café inclusos\nLocação de segunda a sexta, em horário comercial" }
  ],

  /* ---------------- Equoterapia ---------------- */
  equoterapia: {
    nome: "Centro de Equoterapia Primeiro Passo",
    desde: "2011",
    praticantes: "84",
    familias: "211",
    cavalos: "4",
    contratados: "5",
    voluntarios: "2",
    texto: "Em nosso Centro de Equoterapia contamos com uma equipe de profissionais dedicados, incluindo fisioterapeutas, psicóloga, equitadores, auxiliares-guia e coordenadora — sendo 5 contratados e 2 voluntários. Todos os atendimentos são gratuitos, garantindo acesso independentemente da situação financeira dos participantes.",
    indicacoes: "Condições neuromotoras\nPatologias ortopédicas\nDisfunções sensoriomotoras\nDesenvolvimento emocional, social e cognitivo"
  },

  /* ---------------- Benefícios do associado ---------------- */
  beneficios: [
    { titulo: "Mensalidades acessíveis" },
    { titulo: "Prioridade no atendimento" },
    { titulo: "Descontos em aluguéis de espaços" },
    { titulo: "Assessoria jurídica" },
    { titulo: "Cursos profissionalizantes exclusivos para seus funcionários" },
    { titulo: "Entrada gratuita em eventos agropecuários" },
    { titulo: "Atendimento odontológico para você e seus dependentes" },
    { titulo: "Comissão reduzida na compra e na venda do leilão" },
    { titulo: "Clube de Vantagens com parceiros do agronegócio" }
  ],

  /* ---------------- Convênios / Clube de Vantagens ---------------- */
  convenios: [
    { nome: "Exata Brasil", area: "Análises laboratoriais", img: "assets/img/exata.jpg", link: "#/noticia/parceria-exata-brasil",
      beneficio: "Preços diferenciados em análises químicas e físicas de solo, matéria orgânica e nutrientes, bioanálise de solo (enzimas), tecido vegetal, fertilizantes e corretivos. As amostras podem ser entregues na sede do SRJ." },
    { nome: "Senar Goiás", area: "Capacitação", img: "", link: "https://sistemafaeg.com.br/senar/",
      beneficio: "Cursos e treinamentos gratuitos de formação profissional rural e promoção social, mobilizados pelo Sindicato." },
    { nome: "Atendimento odontológico", area: "Saúde", img: "", link: "",
      beneficio: "Atendimento odontológico para o associado e seus dependentes. Consulte a secretaria para agendamento." }
  ],

  /* ---------------- Leilão de gado ---------------- */
  leilao: {
    chamada: "Junte-se a nós todas as quartas-feiras, às 19h30, para o nosso prestigiado leilão de gado — cria, recria e engorda, com grandes volumes de animais. Quem não puder comparecer acompanha a transmissão ao vivo.",
    regras: [
      { titulo: "Início do leilão", texto: "Realizado toda quarta-feira, com início do Jataí Leilões às 19h30." },
      { titulo: "Recepção do gado", texto: "A recepção do gado é das 8h às 19h, apenas na quarta-feira." },
      { titulo: "Retirada dos animais", texto: "A retirada do gado do recinto do leilão terá que ser até as 17h da quinta-feira." },
      { titulo: "Padronização dos lotes", texto: "Os lotes deverão ser padronizados por idade, contendo uma diferença de no máximo 2 meses." },
      { titulo: "Tamanho dos lotes", texto: "Lotes individuais: até 5 animais. Lotes coletivos: a partir de 6 animais." },
      { titulo: "Sanidade", texto: "Animais com problemas de saúde, doenças ou defeitos físicos não são aceitos no leilão." },
      { titulo: "Grandes volumes", texto: "O vendedor que efetuar venda acima de 100 cabeças tem a comissão reduzida pela metade; acima de 200 cabeças, fica isento." }
    ],
    comissoes: [
      { operacao: "Venda — lote coletivo", associado: "1%", naoAssociado: "1,5%" },
      { operacao: "Compra — lote coletivo", associado: "1,5%", naoAssociado: "2%" },
      { operacao: "Venda — lote individual", associado: "3%", naoAssociado: "3,5%" },
      { operacao: "Compra — lote individual", associado: "1,5%", naoAssociado: "2%" }
    ]
  },

  /* ---------------- Cursos ---------------- */
  cursos: {
    chamada: "Uma excelente oportunidade para aprender e crescer no setor agropecuário. Transforme seu potencial em sucesso no campo.",
    passos: [
      { titulo: "Parceria com o Senar", texto: "Os cursos são promovidos em parceria com o Senar Goiás e mobilizados pelo Sindicato Rural de Jataí." },
      { titulo: "Inscrição", texto: "As inscrições são feitas na sede do Sindicato ou pelo WhatsApp, com o mobilizador Senar Messias Veloso." },
      { titulo: "Certificado", texto: "Ao concluir, o participante emite o certificado diretamente no site do Sistema Faeg/Senar." }
    ]
  },

  /* ---------------- Galeria de fotos ---------------- */
  fotos: [
    { src: "assets/img/leilao.jpg", legenda: "Parque de Exposições de Jataí em dia de leilão" },
    { src: "assets/img/sede.jpg", legenda: "Sede do Sindicato Rural de Jataí — Av. Goiás, 1961" },
    { src: "assets/img/equoterapia.jpg", legenda: "Atendimento no Centro de Equoterapia Primeiro Passo" },
    { src: "assets/img/historia1.jpg", legenda: "Fazendeiros e expositores na 1ª Exposição Rural em Jataí, 13 de junho de 1943" },
    { src: "assets/img/historia2.jpg", legenda: "Lideranças rurais nas primeiras exposições agropecuárias" },
    { src: "assets/img/exata.jpg", legenda: "Assinatura da parceria com a Exata Brasil" },
    { src: "assets/img/gal-1.jpg", legenda: "Colheita na região de Jataí" },
    { src: "assets/img/gal-8.jpg", legenda: "Lavoura de grãos" },
    { src: "assets/img/gal-6.jpg", legenda: "Milho — safra" },
    { src: "assets/img/gal-4.jpg", legenda: "Girassol e trigo" },
    { src: "assets/img/gal-9.jpg", legenda: "Pastagem" },
    { src: "assets/img/gal-3.jpg", legenda: "Mudas em viveiro" }
  ],

  /* ---------------- Galeria de vídeos ----------------
     Adicione os vídeos pelo painel colando o link do YouTube.        */
  videos: [],

  /* ---------------- Informações do Agro (links externos) ---------------- */
  links: [
    { nome: "Certificado Senar", desc: "Emissão de certificados dos cursos concluídos.", url: "https://sistemafaeg.com.br/senar/certificados/", icone: "ribbon" },
    { nome: "Cotações — painel Power BI", desc: "Série histórica das cotações levantadas pelo Sindicato.", url: "https://app.powerbi.com/view?r=eyJrIjoiZGU4ZjRmYzAtY2IyOS00NTA3LWE2ZTktZjJlNjk3NWNmMDAyIiwidCI6IjkyZTYxZDA5LTkwM2QtNDg2Zi04NDY5LTY1ODI3MGRhNjg3MCJ9", icone: "chart" },
    { nome: "Boletins agroclimáticos", desc: "Previsões e análises climáticas do Ifag.", url: "https://sistemafaeg.com.br/ifag/dados-e-analises/boletins-agroclimaticos", icone: "cloud" },
    { nome: "Mercado — Soja", desc: "Dados e análises de mercado do Ifag.", url: "https://sistemafaeg.com.br/ifag/dados-e-analises/soja", icone: "chart" },
    { nome: "Agrodefesa", desc: "Declaração de rebanho, GTA e defesa sanitária.", url: "https://www.agrodefesa.go.gov.br/", icone: "doc" },
    { nome: "Sistema Faeg/Senar/Ifag", desc: "Federação, aprendizagem rural e instituto de dados.", url: "https://sistemafaeg.com.br/", icone: "users" }
  ],

  /* ---------------- Parceiros institucionais (rodapé da home) ---------------- */
  parceiros: [
    { nome: "Sindicato Rural de Jataí", desc: "Representação do produtor rural do município", url: "#/historia", logo: "assets/logos/sindicato-rural.svg", fundo: "nao" },
    { nome: "Faeg", desc: "Federação da Agricultura e Pecuária de Goiás", url: "https://sistemafaeg.com.br/", logo: "assets/logos/faeg.svg", fundo: "nao" },
    { nome: "Senar Goiás", desc: "Serviço Nacional de Aprendizagem Rural", url: "https://sistemafaeg.com.br/senar/", logo: "assets/logos/senar.svg", fundo: "nao" },
    { nome: "Ifag", desc: "Instituto para o Fortalecimento da Agropecuária de Goiás", url: "https://sistemafaeg.com.br/ifag/", logo: "assets/logos/ifag.png", fundo: "sim" },
    { nome: "Agrodefesa", desc: "Agência Goiana de Defesa Agropecuária", url: "https://www.agrodefesa.go.gov.br/", logo: "assets/logos/agrodefesa.png", fundo: "sim" }
  ]
};

/* =====================================================================
   Matérias iniciais — importadas para o painel na primeira execução.
   A partir daí ficam editáveis em #/redacao.
   ===================================================================== */
SRJ.postsIniciais = [
  {
    id: "p-crea-propostas", slug: "propostas-candidatos-crea-go", cat: "Notícias", kicker: "Representação",
    titulo: "Sindicato Rural de Jataí apresenta propostas aos candidatos à Presidência do CREA-GO em defesa dos produtores rurais",
    data: "2026-06-30", autor: "Redação SRJ", img: "assets/img/crea-propostas.jpg", destaque: true,
    tags: ["CREA-GO", "produtor rural", "representação"],
    resumo: "Em reunião com os candidatos à Presidência do Conselho Regional de Engenharia e Agronomia de Goiás, o Sindicato entregou documento com propostas para aperfeiçoar a fiscalização no campo.",
    html: "<p>O Sindicato Rural de Jataí realizou uma reunião com os candidatos à Presidência do Conselho Regional de Engenharia e Agronomia de Goiás (CREA-GO), oportunidade em que apresentou um documento com propostas voltadas ao aperfeiçoamento dos procedimentos de fiscalização no meio rural.</p><p>A iniciativa reflete a missão institucional da entidade de representar e defender os interesses dos produtores rurais, buscando construir soluções que proporcionem maior segurança jurídica e diálogo entre o Conselho, os profissionais e o setor produtivo.</p><p>Entre as principais propostas estão:</p><ul><li>Fortalecer o caráter educativo e preventivo da fiscalização;</li><li>Aperfeiçoar os critérios de autuação baseados em CAR e imagens de satélite;</li><li>Ampliar os canais de comunicação com produtores e profissionais;</li><li>Garantir transparência em todos os processos.</li></ul><p>O documento solicita que a próxima gestão do CREA-GO priorize o diálogo antes da aplicação de penalidades, sempre que houver possibilidade de regularização, promovendo uma atuação equilibrada e compatível com a realidade do campo.</p><p>O Sindicato pediu resposta formal dos candidatos sobre as medidas que pretendem adotar e reafirmou seu compromisso de defender os interesses do agronegócio regional de forma técnica, responsável e propositiva.</p>"
  },
  {
    id: "p-rotatividade", slug: "por-que-trabalhadores-rurais-deixam-fazenda", cat: "Artigos", kicker: "Gestão de pessoas",
    titulo: "Por que os trabalhadores rurais deixam uma fazenda para trabalhar em outra?",
    data: "2026-06-19", autor: "Sílvio Lacerda de Oliveira — Doutor em Ciências Ambientais, Advogado e Zootecnista",
    img: "assets/img/trabalhador.jpg", destaque: false, tags: ["mão de obra", "gestão", "emprego rural"],
    resumo: "A escassez de mão de obra qualificada é apontada por produtores rurais como um dos principais desafios para a competitividade do agronegócio brasileiro. Entenda os fatores que influenciam a retenção no campo.",
    html: "<p>A escassez de mão de obra qualificada é apontada por produtores rurais como um dos principais desafios para a competitividade do agronegócio brasileiro. Levantamentos da Confederação da Agricultura e Pecuária do Brasil (CNA) mostram que a rotatividade no meio rural vai muito além da questão salarial.</p><p>A decisão de um trabalhador deixar uma propriedade resulta da combinação de fatores econômicos, profissionais, familiares e sociais. Entre os fatores de retenção identificados estão:</p><ul><li>Remuneração justa e competitiva;</li><li>Oportunidades de crescimento profissional;</li><li>Acesso a educação e saúde para as famílias;</li><li>Reconhecimento profissional e ambiente respeitoso;</li><li>Condições adequadas de moradia e trabalho;</li><li>Qualidade da liderança e do relacionamento entre colegas.</li></ul><p>A alta rotatividade gera custos significativos com recrutamento, treinamento e perda de produtividade. Esses custos podem representar múltiplas vezes o salário mensal do trabalhador substituído.</p><p>Entre as recomendações estão medidas gerenciais como a integração adequada de novos funcionários, o estabelecimento de critérios claros de progressão profissional e o investimento contínuo em capacitação, fortalecendo a retenção de talentos no agronegócio.</p>"
  },
  {
    id: "p-rebanho", slug: "prazo-declaracao-de-rebanho-prorrogado", cat: "Notícias", kicker: "Agrodefesa",
    titulo: "Prazo da 1ª Etapa da Declaração de Rebanho é prorrogado até 10 de junho",
    data: "2026-06-03", autor: "Taynara P. Côrtes — Zootecnista e Assessora Técnica do SRJ",
    img: "assets/img/rebanho.jpg", destaque: false, tags: ["Agrodefesa", "rebanho", "prazo"],
    resumo: "A Agrodefesa prorrogou o prazo da primeira etapa da Declaração de Rebanho 2026. Produtores têm até 10 de junho para atualizar o cadastro dos animais.",
    html: "<p>A Agência Goiana de Defesa Agropecuária (Agrodefesa) prorrogou o prazo da primeira etapa da Declaração de Rebanho 2026. Agora, os produtores rurais têm até o dia 10 de junho para realizar a atualização cadastral de seus animais.</p><p>A declaração é obrigatória para todos os proprietários de animais de produção, como bovinos, bubalinos, equinos, suínos, ovinos, caprinos, aves, peixes e abelhas. O procedimento mantém o banco de dados da defesa agropecuária atualizado, fortalecendo o controle sanitário e a rastreabilidade.</p><p>A atualização pode ser feita on-line, pelo sistema da Agrodefesa, ou presencialmente nas unidades da agência. O Sindicato Rural de Jataí orienta os produtores a não deixarem a declaração para o último momento, garantindo a regularidade junto aos órgãos competentes.</p>"
  },
  {
    id: "p-crea-autuacoes", slug: "autuacoes-indevidas-crea", cat: "Notícias", kicker: "Defesa do produtor",
    titulo: "Sindicato Rural de Jataí busca soluções para autuações indevidas emitidas pelo CREA contra produtores rurais",
    data: "2026-05-20", autor: "Redação SRJ", img: "assets/img/crea-autuacoes.jpg", destaque: false,
    tags: ["CREA-GO", "FAEG", "CNA"],
    resumo: "A entidade acompanha, junto à FAEG e à CNA, uma situação que há anos preocupa produtores e engenheiros agrônomos de todo o estado de Goiás.",
    html: "<p>O Sindicato Rural de Jataí vem acompanhando e trabalhando de forma ativa em uma situação que há anos vem preocupando e causando transtornos aos produtores rurais e engenheiros agrônomos do nosso município e de todo o estado de Goiás: as autuações emitidas pelo CREA.</p><p>A entidade está atenta e trabalha em conjunto com a FAEG e a CNA para defender os interesses do setor produtivo. Reconhecemos a importância da responsabilidade técnica e do cumprimento das normas, mas é preciso garantir equilíbrio, clareza e segurança jurídica nos procedimentos de autuação.</p><p>O Sindicato reafirma o compromisso de ouvir os produtores, acompanhar casos específicos e manter diálogo permanente com as entidades competentes.</p><blockquote>O produtor rural precisa de segurança para trabalhar.</blockquote>"
  },
  {
    id: "p-vtn", slug: "equilibrio-vtn-2026", cat: "Notícias", kicker: "VTN 2026",
    titulo: "Sindicato Rural de Jataí garante equilíbrio no VTN e evita aumento abusivo para 2026",
    data: "2026-05-06", autor: "Taynara Côrtes — Assessora Técnica do SRJ", img: "assets/img/vtn.jpg", destaque: true,
    tags: ["VTN", "ITR", "tributário"],
    resumo: "Proposta inicial de reajuste entre 25% e 37% no Valor da Terra Nua foi reduzida para 15% após atuação do Sindicato na comissão técnica.",
    html: "<p>O Sindicato Rural de Jataí segue atuando de forma estratégica na defesa dos produtores rurais, especialmente nas discussões sobre o Valor da Terra Nua (VTN), que serve de base para o cálculo do Imposto sobre a Propriedade Territorial Rural (ITR).</p><p>A entidade conseguiu reduzir uma proposta inicial de aumento entre 25% e 37% para 15%, por meio de negociações em uma comissão técnica multidisciplinar. A Lei Ordinária nº 4.280, de 2021, torna obrigatória a participação da sociedade civil nessa decisão, e Jataí é o único município da região com esse formato de deliberação.</p><p>O impacto do VTN é mais significativo no cálculo do ganho de capital em caso de venda de imóveis rurais do que no próprio ITR. A comissão também assegurou que 50% da arrecadação será destinada à pavimentação de estradas municipais.</p>"
  },
  {
    id: "p-exata", slug: "parceria-exata-brasil", cat: "Convênios", kicker: "Clube de Vantagens",
    titulo: "Sindicato Rural de Jataí firma parceria com Exata Brasil e amplia benefícios aos associados",
    data: "2026-03-31", autor: "Redação SRJ", img: "assets/img/exata.jpg", destaque: false,
    tags: ["convênio", "análise de solo", "associado"],
    resumo: "Associados com anuidade em dia passam a ter acesso a análises laboratoriais de solo, tecido vegetal e fertilizantes com preços diferenciados.",
    html: "<p>O Sindicato Rural de Jataí segue fortalecendo seu compromisso com o produtor rural ao firmar uma nova parceria estratégica com a Exata Brasil, empresa referência em análises laboratoriais voltadas ao agronegócio. A iniciativa integra o Clube de Vantagens da entidade.</p><p>Os associados com anuidade em dia têm acesso, com preços diferenciados, a:</p><ul><li>Análises químicas e físicas de solo;</li><li>Avaliação de matéria orgânica e nutrientes;</li><li>Bioanálise de solo (enzimas);</li><li>Análise de tecido vegetal;</li><li>Análise de fertilizantes e corretivos.</li></ul><p>As amostras podem ser entregues diretamente na sede do SRJ, que coordena o encaminhamento ao laboratório, reduzindo deslocamentos, otimizando o tempo do produtor e simplificando os procedimentos.</p><p>A parceria busca aumentar a produtividade, melhorar o aproveitamento de insumos, reduzir custos operacionais e fortalecer a sustentabilidade agrícola da região. Mais informações na sede do Sindicato.</p>"
  },
  {
    id: "p-funrural", slug: "funrural-2026", cat: "Notícias", kicker: "Tributário",
    titulo: "FUNRURAL 2026: alíquotas sobem a partir de 1º de abril",
    data: "2026-02-25", autor: "Redação SRJ", img: "assets/img/funrural.jpg", destaque: false,
    tags: ["FUNRURAL", "tributário", "alíquotas"],
    resumo: "A Lei Complementar nº 224/2025 reduziu benefícios fiscais e eleva a contribuição previdenciária rural. Veja as novas alíquotas para pessoa física e jurídica.",
    html: "<p>A Lei Complementar nº 224/2025 determinou a redução de benefícios fiscais que não foram excluídos expressamente no texto legal. Com isso, haverá aumento nas alíquotas da contribuição previdenciária rural (FUNRURAL) a partir de 1º de abril de 2026.</p><h2>Produtor rural pessoa física e segurado especial</h2><ul><li>Previdência Social: de 1,2% para 1,32%;</li><li>RAT: de 0,1% para 0,11%;</li><li>Senar: 0,2% (sem alteração);</li><li>Alíquota final: de 1,5% para 1,63%.</li></ul><h2>Produtor rural pessoa jurídica</h2><ul><li>Previdência Social: de 1,7% para 1,87%;</li><li>RAT: de 0,1% para 0,11%;</li><li>Senar: 0,25% (sem alteração);</li><li>Alíquota final: de 2,05% para 2,23%.</li></ul><p>O Sindicato orienta os produtores a consultarem seus contadores e advogados para revisar o planejamento tributário, já que as mudanças afetam diretamente os custos de produção.</p>"
  },
  {
    id: "p-cot-2026-02-23", slug: "cotacoes-23-02-2026", cat: "Cotações", kicker: "Boletim", titulo: "Cotações do Agro — 23/02/2026",
    data: "2026-02-23", autor: "Redação SRJ", img: "", destaque: false, tags: ["cotações", "soja", "milho", "boi gordo"],
    resumo: "Dólar R$ 5,15. Soja de R$ 108,00 a R$ 109,00 (balcão). Milho de R$ 44,00 a R$ 57,00. Boi gordo R$ 320,00/@, vaca R$ 305,00/@, novilha R$ 320,00/@. Suínos R$ 6,80/kg.",
    html: "<p><strong>Dólar:</strong> R$ 5,15.</p><h3>Agricultura</h3><p><strong>Soja</strong> (descontar FUNRURAL e FUNDEINFRA): BRF fora de mercado; Caramuru R$ 109,00 (balcão); Cargill R$ 108,00 (balcão); Comigo R$ 109,00 (balcão), contrato R$ 109,00 até 28/02/2026; Grupo Cereal R$ 109,00; L. Dreyfus R$ 109,00; Toyota Novaagri R$ 109,00 (spot) e R$ 116,00 (2027).</p><p><strong>Sorgo:</strong> BRF R$ 43,00 (safrinha); Comigo R$ 46,00; Grupo Cereal R$ 39,00 (safrinha).</p><p><strong>Milho</strong> (descontar FUNRURAL e FUNDEINFRA): BRF R$ 57,00 e R$ 51,00 (safrinha); Caramuru fora de mercado; Cargill R$ 47,00; Comigo R$ 56,00; Grupo Cereal R$ 51,00 e R$ 48,00 (safrinha 2026); L. Dreyfus fora de mercado; Toyota Novaagri R$ 44,00 (futuro).</p><p><strong>Cana-de-açúcar:</strong> ATR acumulado 1.1926; cana esteira R$ 145,46/t.</p><h3>Pecuária</h3><p>Corte (R$/@): boi R$ 320,00; boi China R$ 330,00; vaca R$ 305,00; novilha R$ 320,00. Leite: preços não repassados. Suínos: Comigo R$ 6,80/kg (à vista).</p>"
  },
  {
    id: "p-cot-2026-02-09", slug: "cotacoes-09-02-2026", cat: "Cotações", kicker: "Boletim", titulo: "Cotações do Agro — 09/02/2026",
    data: "2026-02-09", autor: "Redação SRJ", img: "", destaque: false, tags: ["cotações", "soja"],
    resumo: "Dólar R$ 5,19. Soja: BRF fora de mercado; Caramuru R$ 109,00; Cargill R$ 108,00; Comigo R$ 109,00 (contrato R$ 108,00 até 28/02/2026); Grupo Cereal R$ 109,00.",
    html: "<p><strong>Dólar:</strong> R$ 5,19.</p><p><strong>Soja</strong> (descontar FUNRURAL e FUNDEINFRA): BRF fora de mercado; Caramuru R$ 109,00 (balcão); Cargill R$ 108,00 (balcão); Comigo R$ 109,00 (balcão), contrato de soja R$ 108,00 até 28/02/2026; Grupo Cereal R$ 109,00 (balcão).</p>"
  },
  {
    id: "p-edital-assembleia", slug: "edital-convocacao-assembleia-2026", cat: "Editais", kicker: "Edital", titulo: "Edital de convocação — Assembleia Geral",
    data: "2026-02-03", autor: "Redação SRJ", img: "", destaque: false, tags: ["edital", "assembleia"],
    resumo: "O presidente do Sindicato Rural de Jataí, no uso das atribuições que lhe conferem o estatuto da entidade, convoca os associados em condições de exercerem seu direito de voto.",
    html: "<p>O presidente do SINDICATO RURAL DE JATAÍ, no uso das atribuições que lhe conferem o estatuto da entidade e de acordo com as disposições legais, CONVOCA os associados em condições de exercerem seu direito de voto para se reunirem em Assembleia Geral, na sede da entidade, à Av. Goiás, 1961, Centro, Jataí/GO.</p><p>O edital completo está disponível na secretaria do Sindicato e pelo telefone (64) 3631-8065.</p>"
  },
  {
    id: "p-cot-2026-01-29", slug: "cotacoes-29-01-2026", cat: "Cotações", kicker: "Boletim", titulo: "Cotações do Agro — 29/01/2026",
    data: "2026-01-29", autor: "Redação SRJ", img: "", destaque: false, tags: ["cotações", "soja", "milho"],
    resumo: "Dólar R$ 5,21. Soja: BRF R$ 110,00 (2026); Caramuru R$ 110,00; Cargill R$ 108,00; Comigo R$ 110,00; Grupo Cereal R$ 111,00. Boi R$ 305,00/@.",
    html: "<p><strong>Dólar:</strong> R$ 5,21.</p><p><strong>Soja</strong> (descontar FUNRURAL e FUNDEINFRA): BRF soja p/ 2026 R$ 110,00; Caramuru R$ 110,00 (balcão); Cargill R$ 108,00 (balcão); Comigo R$ 110,00 (balcão), contrato R$ 108,00 até 28/02/2026; Grupo Cereal R$ 111,00 (balcão) e R$ 108,00 p/ 2026; L. Dreyfus R$ 108,00; Toyota Novaagri R$ 107,00 (fevereiro).</p><p><strong>Sorgo:</strong> BRF R$ 43,00; Comigo R$ 47,00.</p><p><strong>Milho:</strong> BRF R$ 55,00 e safrinha R$ 50,00; Caramuru fora de mercado; Cargill R$ 48,00; Comigo R$ 57,00; Grupo Cereal R$ 51,00 e safrinha 2026 R$ 48,00; L. Dreyfus e Toyota Novaagri fora de mercado.</p><p><strong>Cana-de-açúcar:</strong> ATR acumulado 1.1926; cana esteira R$ 145,46/t.</p><p><strong>Pecuária de corte:</strong> boi R$ 305,00/@; boi China R$ 310,00/@; vaca R$ 290,00/@; novilha R$ 300,00/@. Leite: preços não repassados. Suínos: Comigo R$ 7,30/kg (à vista).</p>"
  },
  {
    id: "p-cot-2026-01-22", slug: "cotacoes-22-01-2026", cat: "Cotações", kicker: "Boletim", titulo: "Cotações do Agro — 22/01/2026",
    data: "2026-01-22", autor: "Redação SRJ", img: "", destaque: false, tags: ["cotações", "soja"],
    resumo: "Dólar R$ 5,30. Soja: BRF fora de mercado; Caramuru R$ 112,00; Cargill R$ 108,00; Comigo R$ 112,00 (contrato R$ 110,00 até 28/02/2026); Grupo Cereal R$ 112,00.",
    html: "<p><strong>Dólar:</strong> R$ 5,30.</p><p><strong>Soja</strong> (descontar FUNRURAL e FUNDEINFRA): BRF fora de mercado; Caramuru R$ 112,00 (balcão); Cargill R$ 108,00 (balcão); Comigo R$ 112,00 (balcão), contrato R$ 110,00 até 28/02/2026; Grupo Cereal R$ 112,00 (balcão) e soja p/ 2026 R$ 110,00.</p>"
  },
  {
    id: "p-cot-2026-01-08", slug: "cotacoes-08-01-2026", cat: "Cotações", kicker: "Boletim", titulo: "Cotações do Agro — 08/01/2026",
    data: "2026-01-08", autor: "Redação SRJ", img: "", destaque: false, tags: ["cotações", "soja"],
    resumo: "Dólar R$ 5,39. Soja: BRF soja 2026 R$ 111,00; Caramuru R$ 116,00; Cargill R$ 109,00; Comigo R$ 117,00 (contrato R$ 111,00 até 28/02/2026).",
    html: "<p><strong>Dólar:</strong> R$ 5,39.</p><p><strong>Soja</strong> (descontar FUNRURAL e FUNDEINFRA): BRF soja 2026 R$ 111,00; Caramuru R$ 116,00 (balcão); Cargill R$ 109,00 (balcão); Comigo R$ 117,00 (balcão), contrato R$ 111,00 até 28/02/2026; Grupo Cereal sem contato.</p>"
  },
  {
    id: "p-cot-2026-01-05", slug: "cotacoes-05-01-2026", cat: "Cotações", kicker: "Boletim", titulo: "Cotações do Agro — 05/01/2026",
    data: "2026-01-05", autor: "Redação SRJ", img: "", destaque: false, tags: ["cotações", "soja"],
    resumo: "Dólar R$ 5,41. Soja: BRF soja 2026 R$ 113,00; Caramuru fora de mercado; Cargill R$ 109,00; Comigo R$ 118,00; Grupo Cereal R$ 118,00.",
    html: "<p><strong>Dólar:</strong> R$ 5,41.</p><p><strong>Soja</strong> (descontar FUNRURAL e FUNDEINFRA): BRF soja 2026 R$ 113,00; Caramuru fora de mercado; Cargill R$ 109,00 (balcão); Comigo R$ 118,00 (balcão), contrato R$ 112,00 até 28/02/2026; Grupo Cereal R$ 118,00 (balcão).</p>"
  },
  {
    id: "p-funrural-2025", slug: "atencao-produtor-rural-funrural-2025", cat: "Avisos", kicker: "Prazo", titulo: "Atenção, produtor rural: escolha do recolhimento do FUNRURAL 2025",
    data: "2026-01-05", autor: "Redação SRJ", img: "", destaque: false, tags: ["FUNRURAL", "prazo"],
    resumo: "Já fez sua escolha sobre o recolhimento do FUNRURAL 2025? Opções: sobre a comercialização ou sobre a folha de pagamento. Prazo final: 30/01/2026.",
    html: "<p><strong>Atenção, produtor rural!</strong> Já fez sua escolha sobre o recolhimento do FUNRURAL 2025?</p><p>Opções disponíveis:</p><ol><li>Sobre a comercialização;</li><li>Sobre a folha de pagamento.</li></ol><p><strong>Prazo final: 30/01/2026.</strong> Atendimento no Sindicato Rural de Jataí, Av. Goiás, 1961, Centro — (64) 3631-8065.</p>"
  },
  {
    id: "p-chapa", slug: "edital-divulgacao-chapa-registrada", cat: "Editais", kicker: "Eleição 2026", titulo: "Edital de divulgação da chapa registrada",
    data: "2025-12-08", autor: "Redação SRJ", img: "", destaque: false, tags: ["edital", "eleição"],
    resumo: "Em cumprimento ao disposto no Edital, comunicamos que foi registrada a chapa concorrente à eleição deste Sindicato, marcada para o dia 27/01/2026.",
    html: "<p>Em cumprimento ao disposto no Edital de Convocação, comunicamos que foi registrada a seguinte chapa concorrente à eleição deste Sindicato, marcada para o dia 27/01/2026.</p><p>A relação completa dos candidatos está afixada na sede da entidade e disponível na secretaria.</p>"
  },
  {
    id: "p-cot-2025-12-04", slug: "cotacoes-04-12-2025", cat: "Cotações", kicker: "Boletim", titulo: "Cotações do Agro — 04/12/2025",
    data: "2025-12-04", autor: "Redação SRJ", img: "", destaque: false, tags: ["cotações", "soja"],
    resumo: "Dólar R$ 5,30. Soja: BRF soja p/ 2026 R$ 115,00; Caramuru R$ 120,00; Cargill R$ 121,00; Comigo R$ 120,00; Comiva soja p/ 2026 R$ 114,00.",
    html: "<p><strong>Dólar:</strong> R$ 5,30.</p><p><strong>Soja</strong> (descontar FUNRURAL e FUNDEINFRA): BRF soja p/ 2026 R$ 115,00; Caramuru R$ 120,00 (balcão); Cargill R$ 121,00 (balcão); Comigo R$ 120,00 (balcão), contrato R$ 114,00 até 28/02/2026; Comiva soja p/ 2026 R$ 114,00.</p>"
  },
  {
    id: "p-faeg-augustin", slug: "sistema-faeg-recebe-carlos-augustin", cat: "Notícias", kicker: "Sistema Faeg",
    titulo: "Sistema Faeg/Senar/Ifag recebe o assessor especial Carlos Augustin, do Ministério da Agricultura e Pecuária",
    data: "2025-12-03", autor: "Redação SRJ", img: "assets/img/sede.jpg", destaque: false, tags: ["FAEG", "Senar", "Ifag"],
    resumo: "Encontro na sede do Sistema Faeg/Senar/Ifag discutiu o Programa Caminho Verde Brasil, iniciativa que coloca o produtor rural no centro da estratégia para um agro sustentável.",
    html: "<p>Recebemos na sede do Sistema Faeg/Senar/Ifag o assessor especial Carlos Augustin, do Ministério da Agricultura e Pecuária, para discutir o Programa Caminho Verde Brasil, uma iniciativa que coloca o produtor rural no centro da estratégia para fazer um agro cada vez mais sustentável e competitivo.</p><p>O Sindicato Rural de Jataí acompanha as ações do Sistema Faeg e leva as demandas dos produtores da região para as discussões estaduais e federais.</p>"
  },
  {
    id: "p-cot-2025-11-28", slug: "cotacoes-28-11-2025", cat: "Cotações", kicker: "Boletim", titulo: "Cotações do Agro — 28/11/2025",
    data: "2025-11-28", autor: "Redação SRJ", img: "", destaque: false, tags: ["cotações", "soja"],
    resumo: "Dólar R$ 5,34. Soja: BRF soja p/ 2026 R$ 116,00; Caramuru R$ 120,00; Cargill R$ 120,00; Comigo R$ 121,00; Comiva fora de mercado.",
    html: "<p><strong>Dólar:</strong> R$ 5,34.</p><p><strong>Soja</strong> (descontar FUNRURAL e FUNDEINFRA): BRF soja p/ 2026 R$ 116,00; Caramuru R$ 120,00 (balcão); Cargill R$ 120,00 (balcão); Comigo R$ 121,00 (balcão), contrato R$ 116,00 até 28/02/2026; Comiva fora de mercado; Grupo Cereal sem contato.</p>"
  },
  {
    id: "p-edital-eleicao", slug: "edital-convocacao-eleicao-2026", cat: "Editais", kicker: "Eleição 2026", titulo: "Edital de convocação — Eleição da Diretoria",
    data: "2025-11-26", autor: "Redação SRJ", img: "", destaque: false, tags: ["edital", "eleição"],
    resumo: "Pelo presente Edital, faço saber que no dia 27 de janeiro de 2026 (terça-feira), das 07h30 às 17h, será realizada a eleição da Diretoria, Conselho Fiscal e Delegados representantes.",
    html: "<p>Pelo presente Edital, faço saber que no dia 27 de janeiro de 2026 (terça-feira), no horário das 07h30 às 17h00, na sede do Sindicato Rural de Jataí, à Av. Goiás, 1961, Centro, será realizada a eleição para composição da Diretoria, Conselho Fiscal, Delegados representantes junto à Federação e respectivos suplentes.</p><p>O registro de chapas deverá ser requerido à secretaria no prazo previsto no estatuto. Informações: (64) 3631-8065.</p>"
  },
  {
    id: "p-leilao-1709", slug: "jatai-leiloes-17-09-2025", cat: "Eventos", kicker: "Leilão", titulo: "Jataí Leilões — 17/09, às 19h30, no Parque de Exposições",
    data: "2025-09-17", autor: "Redação SRJ", img: "assets/img/banner-leilao.jpg", destaque: false, tags: ["leilão", "pecuária"],
    resumo: "Atenção, senhores(as) pecuaristas! Dia 17/09 às 19h30 tem Jataí Leilões no Parque de Exposições. Cria, recria e engorda, com transmissão ao vivo.",
    html: "<p>Atenção, senhores(as) pecuaristas! Dia 17/09, às 19h30, tem JATAÍ LEILÕES no Parque de Exposições de Jataí. Gado de cria, recria e engorda.</p><p>Transmissão ao vivo pelo canal do Sindicato Rural de Jataí. Informações: (64) 3631-8065 / (64) 9 9699-6682.</p>"
  },
  {
    id: "p-cerrado", slug: "cerrado-producao-e-conservacao", cat: "Eventos", kicker: "Encontro técnico", titulo: "Cerrado: Produção e Conservação",
    data: "2025-09-10", autor: "Redação SRJ", img: "assets/img/cerrado.jpg", destaque: false, tags: ["evento", "meio ambiente", "cerrado"],
    resumo: "Encontro de alto nível reúne agronegócio, pesquisadores e instituições no Centro Cultural Dom Benedito Domingos Cóscia para debater o equilíbrio entre produção e conservação.",
    html: "<p>Encontro de alto nível que reúne profissionais do agronegócio, pesquisadores e instituições públicas e privadas para promover o equilíbrio entre produção agropecuária e conservação ambiental, por meio de dados oficiais, soluções sustentáveis e debates técnicos.</p><p><strong>Local:</strong> Centro Cultural Dom Benedito Domingos Cóscia — Avenida W-003, 690, Setor Epaminondas I, Jataí/GO.</p><p><strong>Público:</strong> produtores rurais, técnicos, empresários e tomadores de decisão. Programação com painéis, palestras e espaço para networking, com expectativa de 800 participantes.</p><p>O objetivo é construir um memorando técnico oficial como referência para decisões estratégicas no campo.</p>"
  },
  {
    id: "p-leilao-3007", slug: "hoje-tem-jatai-leiloes-30-07", cat: "Eventos", kicker: "Leilão", titulo: "Jataí Leilões — 30/07, às 19h30",
    data: "2025-07-30", autor: "Redação SRJ", img: "assets/img/leilao.jpg", destaque: false, tags: ["leilão", "pecuária"],
    resumo: "Dia 30/07 às 19h30 tem Jataí Leilões no Parque de Exposições de Jataí.",
    html: "<p>Dia 30/07, às 19h30, tem JATAÍ LEILÕES no Parque de Exposições de Jataí! Venha fazer excelentes negócios.</p>"
  },
  {
    id: "p-feijoada", slug: "1a-feijoada-da-equoterapia", cat: "Eventos", kicker: "Ação solidária", titulo: "1ª Feijoada Solidária da Equoterapia — 16 de agosto",
    data: "2025-07-23", autor: "Redação SRJ", img: "assets/img/feijoada.jpg", destaque: false, tags: ["equoterapia", "solidariedade", "evento"],
    resumo: "Sábado, 16/08, a partir das 12h, no Tatersal do Parque de Exposições. R$ 70,00 por pessoa, feijoada à vontade, com Fred Viola & Roberto. Renda revertida ao Centro de Equoterapia Primeiro Passo.",
    html: "<p>A 1ª Feijoada Solidária em benefício do Centro de Equoterapia Primeiro Passo acontece no sábado, 16 de agosto, a partir das 12h, no Tatersal do Parque de Exposições de Jataí.</p><p><strong>Valor:</strong> R$ 70,00 por pessoa, com feijoada à vontade, bebidas geladas e apresentação musical de Fred Viola &amp; Roberto. Não serviremos marmita — o atendimento é apenas no local.</p><p>Toda a renda é destinada a manter e fortalecer o trabalho da equoterapia, que transforma a vida de pessoas com necessidades especiais. Comida boa, música animada, gente querida e um propósito lindo: venha ajudar se divertindo.</p>"
  },
  {
    id: "p-carga-fechada", slug: "leilao-especial-carga-fechada", cat: "Eventos", kicker: "Leilão", titulo: "Leilão Especial Carga Fechada",
    data: "2025-06-02", autor: "Redação SRJ", img: "assets/img/banner-leilao.jpg", destaque: false, tags: ["leilão", "pecuária"],
    resumo: "Jataí Leilões convida você, pecuarista, para o leilão de gado Especial Carga Fechada no Parque de Exposições.",
    html: "<p>JATAÍ Leilões convida você, pecuarista, para o leilão de gado Especial Carga Fechada, no Parque de Exposições de Jataí, com transmissão ao vivo. Informações: (64) 3631-8065.</p>"
  },
  {
    id: "p-palestras", slug: "rodada-de-palestras-consultoria-gratuita", cat: "Cursos", kicker: "Capacitação", titulo: "Rodada de palestras com consultoria gratuita",
    data: "2025-05-23", autor: "Redação SRJ", img: "", destaque: false, tags: ["curso", "Senar", "palestra"],
    resumo: "Sindicato Rural de Jataí promove rodada de palestras com consultoria gratuita para produtores rurais.",
    html: "<p>O Sindicato Rural de Jataí promoveu uma rodada de palestras com consultoria gratuita para produtores rurais, em parceria com o Senar Goiás. Fique atento à agenda para as próximas edições.</p>"
  },
  {
    id: "p-expedicao", slug: "expedicao-safra", cat: "Eventos", kicker: "Dia de campo", titulo: "Expedição Safra",
    data: "2025-01-17", autor: "Redação SRJ", img: "assets/img/gal-1.jpg", destaque: false, tags: ["evento", "safra"],
    resumo: "Expedição Safra: o encontro será na Fazenda Aliança, de Volmir Maggione, perto da cidade, sentido Mineiros.",
    html: "<p>Expedição Safra — o encontro será na Fazenda Aliança, de Volmir Maggione, perto da cidade, sentido Mineiros. Produtores, técnicos e parceiros acompanham a avaliação das lavouras da região.</p>"
  },
  {
    id: "p-leilao-1501", slug: "jatai-leiloes-15-01-2025", cat: "Eventos", kicker: "Leilão", titulo: "Jataí Leilões — leilão de gado de corte, 15/01 às 19h30",
    data: "2025-01-14", autor: "Redação SRJ", img: "assets/img/leilao.jpg", destaque: false, tags: ["leilão", "pecuária"],
    resumo: "Jataí Leilões convida você, pecuarista, para mais um leilão de gado de corte, dia 15 de janeiro às 19h30.",
    html: "<p>JATAÍ LEILÕES convida você, pecuarista, para mais um leilão de gado de corte, no dia 15 de janeiro às 19h30, no Parque de Exposições de Jataí.</p>"
  },
  {
    id: "p-leilao-3010", slug: "jatai-leiloes-30-10-2024", cat: "Eventos", kicker: "Leilão", titulo: "Jataí Leilões — 30/10/2024",
    data: "2024-10-28", autor: "Redação SRJ", img: "assets/img/leilao.jpg", destaque: false, tags: ["leilão", "pecuária"],
    resumo: "Venha fazer excelentes negócios! Parque de Exposições de Jataí, 30 de outubro às 19h30.",
    html: "<p>Venha fazer excelentes negócios! Jataí Leilões no Parque de Exposições de Jataí, 30 de outubro, às 19h30.</p>"
  },
  {
    id: "p-cafe-prosa", slug: "cafe-com-prosa-da-pecuaria-29-10-2024", cat: "Eventos", kicker: "Palestra", titulo: "53º Café com Prosa da Pecuária — 29/10/2024",
    data: "2024-10-28", autor: "Redação SRJ", img: "", destaque: false, tags: ["evento", "pecuária", "palestra"],
    resumo: "53º Café com Prosa da Pecuária com o palestrante Alexandre Brito, dia 29 de outubro às 7h30.",
    html: "<p>O 53º Café com Prosa da Pecuária acontece no dia 29 de outubro, às 7h30, com o palestrante Alexandre Brito. Um encontro tradicional de pecuaristas da região para troca de experiências e atualização técnica.</p>"
  }
];

/* =====================================================================
   Estrutura dos editores do painel (Conteúdo do site)
   tipo: "objeto" (um formulário) ou "lista" (vários itens)
   campo.t: texto | area | linhas | numero | imagem | select
   ===================================================================== */
SRJ.schemas = [
  { key: "info", titulo: "Dados do sindicato", desc: "Endereço, telefones, e-mails e redes sociais usados em todo o site.", tipo: "objeto", campos: [
    { k: "nome", l: "Nome" }, { k: "sigla", l: "Sigla" }, { k: "desde", l: "Fundado em (ano)" },
    { k: "endereco", l: "Endereço" }, { k: "cidade", l: "Cidade / estado" }, { k: "cep", l: "CEP" },
    { k: "telefone", l: "Telefone" }, { k: "whatsapp", l: "WhatsApp" },
    { k: "email", l: "E-mail principal" }, { k: "email2", l: "E-mail secundário" },
    { k: "horario", l: "Horário de atendimento" }, { k: "parque", l: "Parque de Exposições", t: "area" },
    { k: "instagram", l: "Instagram (link)" }, { k: "facebook", l: "Facebook (link)" }, { k: "youtube", l: "YouTube (link)" }
  ]},
  { key: "heroVideo", titulo: "Vídeo de abertura", desc: "O vídeo que abre a página inicial, antes dos destaques.", tipo: "objeto", campos: [
    { k: "ativo", l: "Mostrar na página inicial", t: "select", opcoes: ["sim", "nao"] },
    { k: "video", l: "Arquivo de vídeo (MP4)" },
    { k: "poster", l: "Imagem de espera", t: "imagem" },
    { k: "eyebrow", l: "Linha de apoio" },
    { k: "titulo", l: "Título" },
    { k: "texto", l: "Texto", t: "area" },
    { k: "cta1Texto", l: "Botão 1 — texto" }, { k: "cta1Link", l: "Botão 1 — link" },
    { k: "cta2Texto", l: "Botão 2 — texto" }, { k: "cta2Link", l: "Botão 2 — link" }
  ]},
  { key: "diretoria.titulares", titulo: "Diretoria executiva", tipo: "lista", campos: [{ k: "nome", l: "Nome" }, { k: "cargo", l: "Cargo" }] },
  { key: "diretoria.suplentes", titulo: "Suplentes", tipo: "lista", campos: [{ k: "nome", l: "Nome" }, { k: "cargo", l: "Cargo" }] },
  { key: "diretoria.conselho", titulo: "Conselho fiscal", tipo: "lista", campos: [{ k: "nome", l: "Nome" }, { k: "cargo", l: "Cargo" }] },
  { key: "equipe", titulo: "Nossa equipe", desc: "Os colaboradores são agrupados pelo setor informado.", tipo: "lista", campos: [{ k: "nome", l: "Nome" }, { k: "cargo", l: "Cargo" }, { k: "setor", l: "Setor" }] },
  { key: "historia.texto", titulo: "História — texto", tipo: "lista", simples: "Parágrafo", campos: [{ k: "_", l: "Parágrafo", t: "area" }] },
  { key: "historia.marcos", titulo: "História — linha do tempo", tipo: "lista", campos: [{ k: "ano", l: "Ano" }, { k: "titulo", l: "Título" }, { k: "texto", l: "Texto", t: "area" }] },
  { key: "historia.presidentes", titulo: "História — presidentes", tipo: "lista", campos: [{ k: "nome", l: "Nome" }, { k: "periodo", l: "Período" }] },
  { key: "locacoes", titulo: "Espaços para locação", tipo: "lista", campos: [
    { k: "nome", l: "Nome do espaço" }, { k: "capacidade", l: "Capacidade (pessoas)" }, { k: "local", l: "Onde fica" },
    { k: "img", l: "Foto", t: "imagem" }, { k: "itens", l: "Itens (um por linha)", t: "linhas" } ]},
  { key: "equoterapia", titulo: "Equoterapia", tipo: "objeto", campos: [
    { k: "nome", l: "Nome do centro" }, { k: "desde", l: "Criado em (ano)" },
    { k: "praticantes", l: "Praticantes ativos" }, { k: "familias", l: "Famílias atendidas" },
    { k: "cavalos", l: "Cavalos" }, { k: "contratados", l: "Profissionais contratados" }, { k: "voluntarios", l: "Voluntários" },
    { k: "texto", l: "Texto de apresentação", t: "area" }, { k: "indicacoes", l: "Indicações (uma por linha)", t: "linhas" } ]},
  { key: "beneficios", titulo: "Benefícios do associado", tipo: "lista", campos: [{ k: "titulo", l: "Benefício" }] },
  { key: "convenios", titulo: "Convênios / Clube de Vantagens", tipo: "lista", campos: [
    { k: "nome", l: "Parceiro" }, { k: "area", l: "Área" }, { k: "beneficio", l: "Benefício", t: "area" },
    { k: "img", l: "Imagem", t: "imagem" }, { k: "link", l: "Link (opcional)" } ]},
  { key: "leilao.chamada", titulo: "Leilão — texto de abertura", tipo: "texto", campo: { l: "Texto", t: "area" } },
  { key: "leilao.regras", titulo: "Leilão — regulamento", tipo: "lista", campos: [{ k: "titulo", l: "Regra" }, { k: "texto", l: "Descrição", t: "area" }] },
  { key: "leilao.comissoes", titulo: "Leilão — comissões", tipo: "lista", campos: [
    { k: "operacao", l: "Operação" }, { k: "associado", l: "Associado" }, { k: "naoAssociado", l: "Não associado" } ]},
  { key: "cursos.chamada", titulo: "Cursos — chamada", tipo: "texto", campo: { l: "Texto", t: "area" } },
  { key: "cursos.passos", titulo: "Cursos — como funciona", tipo: "lista", campos: [{ k: "titulo", l: "Etapa" }, { k: "texto", l: "Descrição", t: "area" }] },
  { key: "fotos", titulo: "Galeria de fotos", tipo: "lista", campos: [{ k: "src", l: "Foto", t: "imagem" }, { k: "legenda", l: "Legenda" }] },
  { key: "videos", titulo: "Galeria de vídeos", desc: "Cole o link do vídeo no YouTube.", tipo: "lista", campos: [
    { k: "titulo", l: "Título" }, { k: "url", l: "Link do YouTube" }, { k: "desc", l: "Descrição", t: "area" }, { k: "data", l: "Data (AAAA-MM-DD)" } ]},
  { key: "links", titulo: "Informações do Agro", desc: "Links de serviços externos usados pelo produtor.", tipo: "lista", campos: [
    { k: "nome", l: "Nome" }, { k: "desc", l: "Descrição", t: "area" }, { k: "url", l: "Endereço (link)" },
    { k: "icone", l: "Ícone", t: "select", opcoes: ["ribbon", "chart", "cloud", "doc", "users", "cap", "gavel", "building"] } ]},
  { key: "parceiros", titulo: "Parceiros institucionais", desc: "Faixa de logos no fim da página inicial. Sem logo, aparece o nome escrito.", tipo: "lista", campos: [
    { k: "nome", l: "Nome" }, { k: "desc", l: "Descrição" }, { k: "url", l: "Link" },
    { k: "logo", l: "Arquivo do logo" },
    { k: "fundo", l: "Logo colorido (ganha fundo branco)", t: "select", opcoes: ["nao", "sim"] } ]}
];
