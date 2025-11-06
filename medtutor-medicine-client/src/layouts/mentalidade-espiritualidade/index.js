import React, { useState } from "react";
import Grid from "@mui/material/Grid";
import { Card, Accordion, AccordionSummary, AccordionDetails, Chip } from "@mui/material";
import Icon from "@mui/material/Icon";
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import colors from "assets/theme/base/colors";
import linearGradient from "assets/theme/functions/linearGradient";
import { GiSelfLove } from "react-icons/gi";
import { IoArrowDown, IoArrowUp, IoMoon, IoTime, IoCalendar, IoCheckmarkCircle, IoCloseCircle, IoAlertCircle } from "react-icons/io5";

const MentalidadeEspiritualidade = () => {
  const { gradients } = colors;
  const { cardContent } = gradients;
  const [expandedPadrao, setExpandedPadrao] = useState(null);
  const [expandedPasso, setExpandedPasso] = useState({});

  const handleChangePadrao = (padraoId) => (event, isExpanded) => {
    setExpandedPadrao(isExpanded ? padraoId : null);
  };

  const handleChangePasso = (padraoId, passoId) => (event, isExpanded) => {
    setExpandedPasso({
      ...expandedPasso,
      [`${padraoId}-${passoId}`]: isExpanded,
    });
  };

  const resumoExecutivo = {
    titulo: "Resumo Executivo",
    conteudo: [
      "Thiago, sua trajetória revela uma impressionante força de superação e resiliência, forjada desde a infância diante de adversidades marcantes.",
      "Foram identificados 7 padrões mentais e emocionais centrais que hoje limitam não apenas sua performance sustentável, mas também sua qualidade de vida e bem-estar integral.",
      "Os padrões raiz principais são: Crença Central de Inadequação, Hipercompensação (Overachiever), Autossacrifício e Perfeccionismo. Estes formam a fundação de uma rede de crenças e comportamentos que alimentam sintomas como negligência do autocuidado, privação crônica de sono, síndrome do impostor e autossabotagem física.",
      "Compreender que estes padrões não surgiram do acaso, mas foram adaptações inteligentes para sobreviver e prosperar em contextos de escassez, é fundamental para iniciar a transformação.",
      "Ao trabalhar estrategicamente as raízes — começando pela crença de inadequação e o ciclo de hipercompensação —, você abrirá espaço para um efeito dominó de mudanças positivas em seu corpo, mente e relações.",
      "O caminho não exige perfeição, mas sim um compromisso genuíno com o autocuidado, a autocompaixão e a reescrita de sua narrativa interna. Com empenho consistente e aplicação das orientações detalhadas, é plenamente possível construir uma Nova Vida Extraordinária, onde alta performance e bem-estar caminham juntos, sem sacrificar sua essência.",
    ],
  };

  const padroes = [
    {
      id: 1,
      nome: "Crença Central de Inadequação",
      subtitulo: "'Nunca serei suficiente, preciso provar meu valor'",
      prioridade: 1,
      categorias: ["Crenca_Limitante"],
      areasImpacto: [
        "Autoestima",
        "Identidade",
        "Relacionamentos",
        "Carreira",
        "Bem Estar Emocional",
        "Qualidade de Vida",
      ],
      origem: {
        periodo: "Infância (0-7 anos) e Pré-adolescência (7-14 anos)",
        contexto:
          "Possivelmente desenvolvida em ambiente de escassez material, necessidade precoce de demonstrar valor para ser aceito e amado, e exposição a situações em que o reconhecimento vinha pelo esforço e superação. Originalmente, essa crença serviu como motor de sobrevivência e superação diante da privação. Tornou-se limitante ao perpetuar a sensação de que nenhum resultado é suficiente, gerando busca interminável por validação e autocrítica constante.",
      },
      manifestacoes: [
        "Pensamentos automáticos de 'preciso fazer mais', 'não posso falhar', 'ninguém vai me reconhecer se eu não entregar tudo'",
        "Dificuldade em reconhecer conquistas e celebrar vitórias",
        "Sentimento persistente de insuficiência, mesmo após grandes realizações",
        "Busca constante por novos desafios e metas sem descanso",
        "Autocrítica severa diante de qualquer erro ou descanso",
        "Dificuldade em aceitar elogios ou acreditar que merece o próprio sucesso",
      ],
      conexoes: {
        raizDe: [
          "Hipercompensação (Overachiever)",
          "Perfeccionismo Paralisante",
          "Síndrome do Impostor",
          "Negligência do Autocuidado",
        ],
        relacionadoCom: ["Autossacrifício Crônico"],
      },
      orientacoes: [
        {
          numero: 1,
          titulo: "Consciência e Mapeamento da Crença",
          oQueFazer:
            "Identifique e registre situações em que o pensamento de não ser suficiente aparece, especialmente quando sente necessidade de provar valor.",
          comoFazer:
            "Durante 7 dias, leve um caderno ou aplicativo de notas e, sempre que sentir pressão interna para se provar, anote: (1) Situação/contexto, (2) Pensamento exato, (3) Emoção sentida (0-10), (4) Ação tomada. Exemplo: 'Recebi feedback no trabalho; pensei que poderia ter feito melhor; senti ansiedade (6/10); fiquei revisando tarefas.' Não tente modificar o pensamento ainda, apenas observe e documente fielmente.",
          porQueFunciona:
            "O registro consciente ativa o córtex pré-frontal, permitindo que você se desidentifique do padrão automático. Segundo a TCC e a neuroplasticidade, só é possível mudar o que se torna consciente; a documentação frequente reduz a fusão com a crença limitante e prepara o terreno para sua ressignificação.",
        },
        {
          numero: 2,
          titulo: "Questionamento Socrático e Desafio de Evidências",
          oQueFazer:
            "Desafie a crença de insuficiência com perguntas estruturadas e busca ativa de evidências contrárias.",
          comoFazer:
            "Escolha 3 registros do passo anterior e, para cada um, pergunte: (1) 'Isso é 100% verdade?'; (2) 'Quais fatos reais mostram que sou suficiente?'; (3) 'Que conquistas objetivas já tive, mesmo sem perfeição?'; (4) 'Se um amigo passasse por isso, o que eu diria a ele?'. Responda por escrito. Repita semanalmente com novos exemplos.",
          porQueFunciona:
            "O questionamento socrático, base da TCC, desafia a rigidez das crenças limitantes e ativa redes neurais alternativas. Esse processo de busca ativa de evidências reformula a percepção interna de valor e começa a enfraquecer o padrão da insuficiência.",
        },
        {
          numero: 3,
          titulo: "Ressignificação Emocional e Reparentalização",
          oQueFazer:
            "Trabalhe com sua 'criança interior' para validar o valor intrínseco, independente de conquistas.",
          comoFazer:
            "Em ambiente tranquilo, feche os olhos e visualize-se como criança nos momentos de maior pressão ou crítica. Imagine-se como adulto acolhendo aquela criança, dizendo frases como: 'Você é suficiente apenas por existir', 'Não precisa provar nada para ser amado'. Repita 2-3x por semana, anotando sensações e resistências.",
          porQueFunciona:
            "A reparentalização (Schema Therapy) cura feridas de amor condicional do passado, promovendo integração de partes internas e criando novas associações emocionais. Isso reduz a compulsão por provas externas de valor e fortalece autoestima autêntica.",
        },
        {
          numero: 4,
          titulo: "Prática de Autoaceitação e Celebração de Conquistas",
          oQueFazer:
            "Estabeleça um ritual semanal para celebrar pequenas e grandes conquistas, reconhecendo seu esforço à parte do resultado final.",
          comoFazer:
            "No final de cada semana, escreva 3 realizações (pequenas ou grandes) e, para cada uma, escreva um elogio verdadeiro a si mesmo. Compartilhe ao menos uma delas com alguém de confiança, permitindo-se sentir orgulho sem culpa.",
          porQueFunciona:
            "A prática recorrente de autoaceitação e celebração cria novas redes neurais de recompensa (neuroplasticidade), reduzindo a dependência de validação externa e reforçando a percepção de suficiência interna.",
        },
      ],
    },
    {
      id: 2,
      nome: "Hipercompensação (Overachiever)",
      subtitulo: "'Preciso conquistar sempre mais para ser digno'",
      prioridade: 2,
      categorias: ["padrão_mental_negativo", "padrão_emocional"],
      areasImpacto: [
        "Autoestima",
        "Identidade",
        "Carreira",
        "Saúde Física",
        "Saúde Mental",
        "Bem Estar Emocional",
        "Qualidade de Vida",
      ],
      origem: {
        periodo: "Pré-adolescência (7-14 anos) e Adolescência (14-21 anos)",
        contexto:
          "Provavelmente se consolidou a partir do ambiente de escassez e validação por desempenho (notas, trabalho precoce), reforçado por experiências em que conquistas eram o principal critério de aceitação. Serviu inicialmente como estratégia adaptativa para obter reconhecimento e segurança. Tornou-se limitante ao criar compulsão por produtividade, dificultando descanso e levando à exaustão física e mental.",
      },
      manifestacoes: [
        "Rotina de trabalho intenso e longas jornadas diárias",
        "Dificuldade em relaxar ou tirar férias sem culpa",
        "Sensação de que nunca é o bastante, mesmo após grandes feitos",
        "Privação crônica de sono e uso excessivo de cafeína para manter performance",
        "Negligência de sinais físicos de exaustão (fadiga, olheiras, queda capilar)",
        "Dificuldade em delegar tarefas ou confiar em outros",
      ],
      conexoes: {
        raizDe: ["Perfeccionismo Paralisante", "Negligência do Autocuidado", "Síndrome do Impostor"],
        alimentadoPor: ["Crença Central de Inadequação"],
        relacionadoCom: ["Autossacrifício Crônico"],
      },
      orientacoes: [
        {
          numero: 1,
          titulo: "Reconhecimento do Ciclo de Hipercompensação",
          oQueFazer:
            "Mapeie como o ciclo de buscar sempre mais se manifesta no seu dia a dia e identifique gatilhos específicos.",
          comoFazer:
            "Durante 10 dias, ao final de cada jornada, reflita e anote: (1) Situações em que sentiu necessidade de fazer mais; (2) O que disparou esse impulso (ex: receber elogio, ver alguém descansando, cobrança interna); (3) Como seu corpo reagiu (sintomas de tensão, cansaço, etc). Busque padrões recorrentes nas anotações.",
          porQueFunciona:
            "O mapeamento de gatilhos torna visível o ciclo automático de hipercompensação, permitindo interromper o piloto automático. Esse processo de auto-observação é fundamental para iniciar mudanças conscientes e criar espaço para novas respostas.",
        },
        {
          numero: 2,
          titulo: "Redefinição de Sucesso e Valor Pessoal",
          oQueFazer:
            "Reformule internamente o que significa ser bem-sucedido e digno, para além das conquistas externas.",
          comoFazer:
            "Crie uma lista de valores pessoais que não dependem de produtividade (ex: integridade, compaixão, criatividade) e escreva uma frase de afirmação para cada um: 'Meu valor está em quem sou, não apenas no que faço'. Leia essas afirmações diariamente, especialmente ao acordar e antes de dormir.",
          porQueFunciona:
            "A repetição de novas definições de sucesso ativa o princípio da neuroplasticidade, criando associações positivas com o ser, não apenas com o fazer. Isso reduz a pressão interna e abre espaço para experiências de descanso sem culpa.",
        },
        {
          numero: 3,
          titulo: "Exposição Gradual ao Descanso e Autocuidado",
          oQueFazer:
            "Implemente pequenas pausas intencionais e práticas de autocuidado, enfrentando gradualmente a ansiedade de não estar produzindo.",
          comoFazer:
            "Programe 1-2 pausas curtas de 10 minutos por dia para atividades não-produtivas (ex: caminhada ao ar livre, música, respiração profunda). Observe e registre a ansiedade ou culpa que surgir, sem julgamento. Aumente gradativamente a duração e frequência das pausas ao longo de 3 semanas.",
          porQueFunciona:
            "Segundo TCC e ACT, a exposição gradual a situações evitadas reduz a ansiedade associada ao descanso e permite recondicionar o sistema nervoso para tolerar relaxamento. Pequenas vitórias fortalecem novas vias neurais de autocuidado.",
        },
      ],
    },
    {
      id: 3,
      nome: "Autossacrifício Crônico",
      subtitulo: "'Preciso abrir mão de mim para cuidar dos outros e garantir segurança'",
      prioridade: 3,
      categorias: ["crenca_limitante", "padrão_emocional", "questão_relacional"],
      areasImpacto: [
        "autoestima",
        "relacionamentos",
        "carreira",
        "bem estar emocional",
        "saúde física",
        "qualidade vida",
      ],
      origem: {
        periodo: "Infância (0-7 anos) e Pré-adolescência (7-14 anos)",
        contexto:
          "Provavelmente originado de situações em que cuidar dos outros era necessário para manter harmonia familiar ou reconhecimento, aliado à experiência de escassez e à parentalização precoce. Serviu como estratégia de sobrevivência e aceitação no grupo. Tornou-se limitante ao criar a sensação de que não é permitido priorizar a si mesmo, perpetuando a negligência do autocuidado e a exaustão emocional.",
      },
      manifestacoes: [
        "Dificuldade em dizer 'não' a demandas de trabalho ou de pessoas próximas",
        "Sentimento de culpa ao priorizar descanso, lazer ou autocuidado",
        "Percepção de que só poderá cuidar de si 'quando tudo estiver resolvido'",
        "Autonegligência em áreas básicas (sono, alimentação, saúde física)",
        "Resistência a pedir ajuda ou delegar tarefas",
        "Sobreposição dos interesses dos outros aos próprios objetivos",
      ],
      conexoes: {
        raizDe: ["Negligência do Autocuidado"],
        alimentadoPor: ["Crença Central de Inadequação"],
        relacionadoCom: ["Hipercompensação (Overachiever)"],
      },
      orientacoes: [
        {
          numero: 1,
          titulo: "Reconhecimento dos Limites e Permissão para o Autocuidado",
          oQueFazer:
            "Liste situações recentes em que abriu mão de si mesmo para atender demandas externas e reflita sobre o impacto real dessas escolhas.",
          comoFazer:
            "Durante 7 dias, registre diariamente: (1) Situação em que priorizou o outro/trabalho em detrimento de si; (2) Emoção sentida; (3) Consequência imediata e tardia da escolha. Reserve um momento ao final da semana para ler os registros e identificar padrões de autossacrifício recorrente.",
          porQueFunciona:
            "A validação consciente dos próprios limites e necessidades é o primeiro passo para quebrar o ciclo automático do autossacrifício, segundo Schema Therapy e TCC. Isso permite que o cérebro reconheça que autocuidado não é egoísmo, mas requisito para saúde e performance sustentável.",
        },
        {
          numero: 2,
          titulo: "Definição e Comunicação de Limites Saudáveis",
          oQueFazer:
            "Pratique a comunicação assertiva de limites, começando por situações de menor risco emocional.",
          comoFazer:
            "Escolha uma situação pequena (ex: recusar um pedido adicional de trabalho fora do horário) e comunique de forma clara e respeitosa: 'No momento, preciso priorizar meu descanso para manter minha qualidade de entrega.' Anote a reação dos outros e o sentimento gerado. Repita esse exercício semanalmente, aumentando gradualmente o grau de desafio.",
          porQueFunciona:
            "A definição e prática de limites, embasadas em TCC e PNL, reforçam a autonomia e diminuem a associação inconsciente entre autocuidado e culpa, criando novas referências internas de merecimento.",
        },
        {
          numero: 3,
          titulo: "Rituais de Autocuidado e Reforço Positivo",
          oQueFazer:
            "Estabeleça pequenos rituais diários de autocuidado e associe-os a reforços positivos intencionais.",
          comoFazer:
            "Inclua ao menos um ato de autocuidado intencional por dia (ex: banho relaxante, refeição nutritiva, pausa para respiração profunda). Após cada ritual, reconheça verbalmente seu mérito: 'Cuidar de mim potencializa tudo que posso oferecer ao mundo.'",
          porQueFunciona:
            "A prática regular de autocuidado, associada a reforço positivo (PNL, neuroplasticidade), cria novas conexões neurais de prazer e mérito ligadas ao bem-estar, reduzindo o ciclo de autossacrifício e promovendo equilíbrio saudável.",
        },
      ],
    },
    {
      id: 4,
      nome: "Perfeccionismo Paralisante",
      subtitulo: "'Só posso descansar quando tudo estiver perfeito'",
      prioridade: 4,
      categorias: ["padrão_mental_negativo"],
      areasImpacto: [
        "autoestima",
        "identidade",
        "carreira",
        "bem estar emocional",
        "saúde mental",
        "qualidade vida",
      ],
      origem: {
        periodo: "Adolescência (14-21 anos) e Vida Adulta Jovem (21-28 anos)",
        contexto:
          "Provavelmente consolidado em ambiente de cobrança interna e externa por resultados excepcionais, reforçado por experiências de crítica e validação apenas pelo desempenho. Serviu como mecanismo de controle e proteção contra críticas ou rejeição. Tornou-se limitante ao gerar procrastinação, autossabotagem e incapacidade de relaxar diante de tarefas inacabadas.",
      },
      manifestacoes: [
        "Dificuldade em finalizar tarefas por nunca estarem 'boas o suficiente'",
        "Autocrítica severa diante de pequenas falhas",
        "Procrastinação em projetos importantes por medo de não atingir o ideal",
        "Sentimento de culpa ao descansar sem ter 'zerado' todas as demandas",
        "Revisão excessiva de trabalhos e relutância em delegar",
        "Dificuldade em aceitar elogios ou reconhecer méritos",
      ],
      conexoes: {
        raizDe: ["Síndrome do Impostor", "Negligência do Autocuidado"],
        alimentadoPor: ["Crença Central de Inadequação", "Hipercompensação (Overachiever)"],
      },
      orientacoes: [
        {
          numero: 1,
          titulo: "Identificação e Desafio do Padrão Tudo-ou-Nada",
          oQueFazer:
            "Observe e registre pensamentos de tudo-ou-nada relacionados à performance e exigência de perfeição.",
          comoFazer:
            "Durante 5 dias, toda vez que perceber pensamentos como 'só serve se estiver perfeito' ou 'não posso errar', anote o contexto, o pensamento e a emoção sentida. Ao final do período, escolha um desses pensamentos e escreva uma alternativa realista ('80% já é excelente', 'errar faz parte do processo').",
          porQueFunciona:
            "A identificação consciente das distorções cognitivas (TCC) permite desafiar o padrão rígido, abrindo espaço para flexibilidade e aceitação do progresso real em vez da perfeição inatingível.",
        },
        {
          numero: 2,
          titulo: "Experimentos Comportamentais com 'Erro Controlado'",
          oQueFazer:
            "Execute pequenas tarefas intencionalmente sem buscar o máximo de perfeição e observe os resultados.",
          comoFazer:
            "Escolha uma atividade semanal (ex: enviar um e-mail sem revisão extra, entregar uma tarefa com 85% do seu melhor) e registre as reações internas e externas. Reflita: 'O que realmente aconteceu? As consequências foram tão negativas quanto eu previa?'. Repita por 4 semanas com tarefas diferentes.",
          porQueFunciona:
            "Ao vivenciar na prática que falhas controladas não geram catástrofes, o cérebro aprende por neuroplasticidade a tolerar a imperfeição, reduzindo o medo do erro e a procrastinação associada ao perfeccionismo.",
        },
        {
          numero: 3,
          titulo: "Ressignificação Emocional e Autoaceitação",
          oQueFazer: "Pratique a autocompaixão diante de erros ou resultados aquém do ideal.",
          comoFazer:
            "Quando cometer um erro ou sentir que não atingiu o padrão desejado, coloque a mão no peito, respire profundamente e repita: 'Eu me permito ser humano, aprender com meus erros e seguir em frente.' Anote um aprendizado extraído de cada situação.",
          porQueFunciona:
            "A autocompaixão, baseada em práticas de Mindfulness e Psicologia Positiva, reduz o impacto emocional do perfeccionismo e fortalece o senso de valor independente do resultado, promovendo bem-estar emocional sustentável.",
        },
      ],
    },
    {
      id: 5,
      nome: "Negligência do Autocuidado",
      subtitulo: "'Cuidar de mim é secundário, só depois de tudo resolvido'",
      prioridade: 5,
      categorias: ["padrão_mental_negativo", "padrão_emocional"],
      areasImpacto: [
        "saúde física",
        "saúde mental",
        "bem estar emocional",
        "autoestima",
        "qualidade vida",
      ],
      origem: {
        periodo: "Adolescência (14-21 anos) e Vida Adulta Jovem (21-28 anos)",
        contexto:
          "Provavelmente consolidada como extensão dos padrões de autossacrifício e hipercompensação, onde o valor pessoal é medido pelo quanto se produz. Serviu inicialmente para garantir sobrevivência e aceitação em ambientes exigentes. Tornou-se limitante ao perpetuar a ideia de que autocuidado é luxo ou fraqueza, levando à exaustão física e emocional.",
      },
      manifestacoes: [
        "Privação crônica de sono e baixa qualidade de descanso",
        "Alimentação adequada apenas quando conveniente, com lapsos de ultraprocessados",
        "Consumo excessivo de café para compensar fadiga",
        "Desmotivação para exercícios físicos e procrastinação do treino",
        "Dificuldade em manter rituais de lazer e relaxamento",
        "Ignorar sinais de exaustão física e emocional até o limite",
      ],
      conexoes: {
        alimentadoPor: [
          "Crença Central de Inadequação",
          "Hipercompensação (Overachiever)",
          "Autossacrifício Crônico",
          "Perfeccionismo Paralisante",
        ],
      },
      orientacoes: [
        {
          numero: 1,
          titulo: "Desafio da Crença de que Autocuidado é Egoísmo ou Luxo",
          oQueFazer:
            "Identifique e registre pensamentos e frases automáticas que desvalorizam o autocuidado.",
          comoFazer:
            "Por 7 dias, toda vez que pensar ou verbalizar frases como 'não tenho tempo para isso', 'não preciso descansar agora', anote o contexto e o que sentiu. Ao final, elabore uma frase alternativa: 'Cuidar de mim é o que me permite cuidar dos outros e performar melhor.'",
          porQueFunciona:
            "A identificação e substituição de crenças automáticas, fundamentada na TCC e PNL, abre espaço para novas associações entre autocuidado e performance, reduzindo a resistência interna a hábitos saudáveis.",
        },
        {
          numero: 2,
          titulo: "Implementação de Micro-hábitos de Autocuidado",
          oQueFazer:
            "Introduza pequenos atos diários de autocuidado, começando por 1-2 minutos por vez.",
          comoFazer:
            "Escolha um micro-hábito (ex: beber um copo de água ao acordar, alongar-se 2 minutos antes do banho). Programe lembretes e registre a execução por 14 dias. Aumente gradualmente o tempo e a variedade das práticas conforme se sentir confortável.",
          porQueFunciona:
            "A criação de micro-hábitos utiliza a neuroplasticidade para estabelecer novas rotinas sem ativar resistências internas, tornando o autocuidado parte natural do dia a dia e reduzindo autossabotagem.",
        },
        {
          numero: 3,
          titulo: "Reforço Positivo e Celebração do Autocuidado",
          oQueFazer:
            "Associe cada ato de autocuidado a uma recompensa simbólica e reconhecimento interno.",
          comoFazer:
            "Após cada micro-hábito realizado, reconheça o mérito dizendo a si mesmo: 'Estou investindo no meu futuro'. Marque no calendário cada dia em que realizou pelo menos um ato de autocuidado. Ao final de 14 dias, premie-se com algo simples (ex: momento de lazer, pequena indulgência saudável).",
          porQueFunciona:
            "O reforço positivo ativa o sistema de recompensa cerebral, tornando o autocuidado atraente e sustentável a longo prazo, segundo princípios da Psicologia Positiva e neurociência comportamental.",
        },
      ],
    },
    {
      id: 6,
      nome: "Síndrome do Impostor",
      subtitulo: "'Em algum momento vão descobrir que não sou tão bom quanto pareço'",
      prioridade: 6,
      categorias: ["padrão_mental_negativo"],
      areasImpacto: ["autoestima", "identidade", "carreira", "bem estar emocional"],
      origem: {
        periodo: "Adolescência (14-21 anos) e Vida Adulta Jovem (21-28 anos)",
        contexto:
          "Provavelmente desenvolvida em ambientes de alta exigência e comparação, quando conquistas não eram internalizadas, reforçando a sensação de ser um 'impostor'. Serviu como proteção contra críticas externas e para manter o padrão de superação. Tornou-se limitante ao gerar ansiedade, autocrítica e medo constante de exposição.",
      },
      manifestacoes: [
        "Dúvida recorrente sobre merecimento de elogios e conquistas",
        "Medo de ser exposto/descoberto como 'menos capaz' do que parece",
        "Minimização de sucessos ('foi sorte', 'qualquer um faria')",
        "Ansiedade antes de avaliações ou apresentações",
        "Hiperpreparo para tarefas por medo de falhar",
        "Dificuldade em pedir ajuda por receio de mostrar vulnerabilidade",
      ],
      conexoes: {
        alimentadoPor: [
          "Crença Central de Inadequação",
          "Perfeccionismo Paralisante",
          "Hipercompensação (Overachiever)",
        ],
      },
      orientacoes: [
        {
          numero: 1,
          titulo: "Reconhecimento de Conquistas e Internalização do Mérito",
          oQueFazer:
            "Crie um inventário detalhado de conquistas pessoais e profissionais, destacando seu papel ativo em cada uma.",
          comoFazer:
            "Liste 10 realizações dos últimos anos e, para cada uma, escreva 3 ações ou qualidades suas que foram fundamentais para o resultado. Releia a lista diariamente por 21 dias, especialmente antes de situações desafiadoras.",
          porQueFunciona:
            "A repetição e internalização de conquistas, baseadas em TCC e neuroplasticidade, fortalecem a autopercepção de competência e reduzem o viés de minimização típico da síndrome do impostor.",
        },
        {
          numero: 2,
          titulo: "Exposição Controlada à Vulnerabilidade",
          oQueFazer:
            "Compartilhe uma insegurança ou dificuldade com alguém de confiança (mentor, amigo, terapeuta) e observe a reação.",
          comoFazer:
            "Escolha uma situação recente em que sentiu medo de não ser bom o suficiente e relate-a a alguém que valorize sua trajetória. Observe a resposta recebida e registre o impacto emocional. Repita mensalmente com diferentes situações.",
          porQueFunciona:
            "A exposição controlada à vulnerabilidade, fundamentada em IFS e práticas de autocompaixão, reduz o medo de ser 'descoberto' e normaliza a imperfeição, fortalecendo a conexão autêntica com os outros.",
        },
      ],
    },
    {
      id: 7,
      nome: "Desconexão do Propósito e Essência",
      subtitulo: "'Meu valor depende só do que produzo, não de quem sou'",
      prioridade: 7,
      categorias: ["bloqueio_desenvolvimento_espiritual"],
      areasImpacto: [
        "identidade",
        "propósito",
        "bem estar emocional",
        "desenvolvimento espiritual",
        "qualidade vida",
      ],
      origem: {
        periodo: "Adolescência (14-21 anos) e Vida Adulta Jovem (21-28 anos)",
        contexto:
          "Pode ter se intensificado em fases de hiperfoco no trabalho e conquistas externas, com pouco espaço para reflexão existencial, espiritualidade e conexão com valores pessoais profundos. Serviu para garantir sobrevivência e aceitação em ambientes competitivos. Tornou-se limitante ao gerar sensação de vazio, ansiedade existencial e dificuldade de encontrar sentido além da performance.",
      },
      manifestacoes: [
        "Sensação de vazio existencial em momentos de pausa",
        "Dificuldade em definir propósito além do trabalho e conquistas",
        "Falta de motivação intrínseca para autocuidado e lazer",
        "Oscilações de ânimo quando resultados externos não correspondem às expectativas",
        "Busca constante por novos desafios para evitar contato com o vazio",
        "Dificuldade em vivenciar práticas espirituais ou contemplativas de forma regular",
      ],
      conexoes: {
        alimentadoPor: ["Crença Central de Inadequação", "Hipercompensação (Overachiever)"],
      },
      orientacoes: [
        {
          numero: 1,
          titulo: "Exploração de Valores e Propósito Autêntico",
          oQueFazer:
            "Dedique tempo para identificar valores, paixões e talentos que existem independentemente da performance.",
          comoFazer:
            "Reserve 20 minutos semanais para responder por escrito: (1) O que me faz sentir vivo além do trabalho? (2) Quais qualidades admiro em mim mesmo? (3) Que legado quero deixar? Utilize ferramentas como Ikigai, journaling existencial e conversas com mentores para aprofundar essas reflexões.",
          porQueFunciona:
            "A exploração intencional de propósito, baseada em Logoterapia e abordagens contemplativas, amplia o sentido de vida, fortalece a identidade autêntica e reduz o vazio existencial, promovendo bem-estar profundo.",
        },
        {
          numero: 2,
          titulo: "Práticas Contemplativas e Reconexão Espiritual",
          oQueFazer:
            "Inclua no cotidiano práticas que cultivem presença, gratidão e conexão com algo maior.",
          comoFazer:
            "Programe 10 minutos diários para meditação mindfulness, oração ou contemplação silenciosa. Experimente momentos semanais de contato com a natureza e registre sensações de paz e pertencimento. Participe de grupos de estudo, retiros ou rituais de passagem conforme preferência pessoal.",
          porQueFunciona:
            "Práticas contemplativas comprovadamente reduzem ansiedade, promovem integração mente-corpo-espírito e fortalecem o senso de propósito, segundo evidências da Psicologia Positiva e da Espiritualidade baseada em sentido.",
        },
      ],
    },
  ];

  const getPrioridadeColor = (prioridade) => {
    if (prioridade <= 2) return "#FF3838";
    if (prioridade <= 4) return "#F9CF05";
    return "#2E72AC";
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <VuiBox pt={3} pb={6}>
        {/* Resumo Executivo */}
        <Card
          sx={{
            borderRadius: "20px",
            background: linearGradient(cardContent.main, cardContent.state, cardContent.deg),
            mb: 3,
          }}
        >
          <VuiBox p={3}>
            <VuiBox display="flex" alignItems="center" mb={2}>
              <GiSelfLove size={32} color="#2E72AC" style={{ marginRight: 12 }} />
              <VuiTypography variant="h4" color="white" fontWeight="bold">
                {resumoExecutivo.titulo}
              </VuiTypography>
            </VuiBox>
            <VuiBox>
              {resumoExecutivo.conteudo.map((paragrafo, index) => (
                <VuiTypography
                  key={index}
                  variant="body2"
                  color="text"
                  fontWeight="regular"
                  mb={index < resumoExecutivo.conteudo.length - 1 ? 2 : 0}
                  sx={{ lineHeight: 1.8 }}
                >
                  {paragrafo}
                </VuiTypography>
              ))}
            </VuiBox>
          </VuiBox>
        </Card>

        {/* Seção Higiene do Sono */}
        <VuiBox mt={6} mb={4}>
          <VuiBox display="flex" alignItems="center" mb={3}>
            <IoMoon size={40} color="#2E72AC" style={{ marginRight: 16 }} />
            <VuiTypography variant="h3" color="white" fontWeight="bold">
              Higiene do Sono
            </VuiTypography>
          </VuiBox>
        </VuiBox>

        {/* Dados do Sono */}
        {(() => {
          const dadosSono = {
            horario_dormir_recomendado: "23:00",
            horario_acordar_recomendado: "07:00",
            duracao_alvo: "8h",
            janela_sono_semana: "23:00-07:00",
            janela_sono_fds: "23:00-07:00",
            consistencia_horario: "Variação máxima ±30min entre semana e fins de semana",
            rotina_pre_sono: [
              "22:00 - Desligar telas e luz branca",
              "22:20 - Banho morno ou técnica respiratória/mindfulness",
              "22:40 - Leitura leve com luz tênue",
              "23:00 - Deitar no horário combinado",
            ],
            gatilhos_evitar: [
              "Cafeína após 16h",
              "Exercício intenso noturno (após 20h)",
              "Telas ou reuniões após 21h",
              "Refeições pesadas após 20h",
            ],
            progressao_ajuste:
              "Reduzir horário de dormir 15 minutos a cada 3 dias até atingir 23:00 sem perda do despertar fixo às 07:00.",
            observacoes_clinicas:
              "Sono cronicamente curto e superficial, mente ativa e jet-lag social moderado (>1h2min). Prioridade máxima para saúde neurocognitiva e metabólica. Impacto de olheiras, fadiga e desempenho oscilante exige ajuste imediato na rotina.",
          };

          return (
            <>
              {/* Card de Resumo - Horários Recomendados */}
              <Card
                sx={{
                  borderRadius: "20px",
                  background: linearGradient(cardContent.main, cardContent.state, cardContent.deg),
                  mb: 3,
                }}
              >
                <VuiBox p={3}>
                  <VuiBox display="flex" alignItems="center" mb={3}>
                    <IoTime size={28} color="#2E72AC" style={{ marginRight: 12 }} />
                    <VuiTypography variant="h5" color="white" fontWeight="bold">
                      Horários Recomendados
                    </VuiTypography>
                  </VuiBox>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={4}>
                      <Card
                        sx={{
                          borderRadius: "15px",
                          background: "rgba(46, 114, 172, 0.2)",
                          p: 2,
                          textAlign: "center",
                        }}
                      >
                        <VuiTypography variant="button" color="text" fontWeight="medium" mb={1}>
                          Dormir
                        </VuiTypography>
                        <VuiTypography variant="h4" color="white" fontWeight="bold">
                          {dadosSono.horario_dormir_recomendado}
                        </VuiTypography>
                      </Card>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Card
                        sx={{
                          borderRadius: "15px",
                          background: "rgba(46, 114, 172, 0.2)",
                          p: 2,
                          textAlign: "center",
                        }}
                      >
                        <VuiTypography variant="button" color="text" fontWeight="medium" mb={1}>
                          Acordar
                        </VuiTypography>
                        <VuiTypography variant="h4" color="white" fontWeight="bold">
                          {dadosSono.horario_acordar_recomendado}
                        </VuiTypography>
                      </Card>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Card
                        sx={{
                          borderRadius: "15px",
                          background: "rgba(46, 114, 172, 0.2)",
                          p: 2,
                          textAlign: "center",
                        }}
                      >
                        <VuiTypography variant="button" color="text" fontWeight="medium" mb={1}>
                          Duração Alvo
                        </VuiTypography>
                        <VuiTypography variant="h4" color="white" fontWeight="bold">
                          {dadosSono.duracao_alvo}
                        </VuiTypography>
                      </Card>
                    </Grid>
                  </Grid>
                  <VuiBox mt={3} p={2} sx={{ background: "rgba(255, 255, 255, 0.05)", borderRadius: "12px" }}>
                    <VuiTypography variant="body2" color="text" fontWeight="regular" sx={{ lineHeight: 1.7 }}>
                      <strong>Consistência:</strong> {dadosSono.consistencia_horario}
                    </VuiTypography>
                  </VuiBox>
                </VuiBox>
              </Card>

              {/* Janela de Sono - Semana e Fins de Semana */}
              <Grid container spacing={3} mb={3}>
                <Grid item xs={12} md={6}>
                  <Card
                    sx={{
                      borderRadius: "20px",
                      background: linearGradient(cardContent.main, cardContent.state, cardContent.deg),
                      height: "100%",
                    }}
                  >
                    <VuiBox p={3}>
                      <VuiBox display="flex" alignItems="center" mb={2}>
                        <IoCalendar size={24} color="#2E72AC" style={{ marginRight: 12 }} />
                        <VuiTypography variant="h6" color="white" fontWeight="bold">
                          Janela de Sono - Semana
                        </VuiTypography>
                      </VuiBox>
                      <VuiBox
                        p={2.5}
                        sx={{
                          background: "rgba(46, 114, 172, 0.15)",
                          borderRadius: "12px",
                          textAlign: "center",
                        }}
                      >
                        <VuiTypography variant="h4" color="white" fontWeight="bold">
                          {dadosSono.janela_sono_semana}
                        </VuiTypography>
                      </VuiBox>
                    </VuiBox>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card
                    sx={{
                      borderRadius: "20px",
                      background: linearGradient(cardContent.main, cardContent.state, cardContent.deg),
                      height: "100%",
                    }}
                  >
                    <VuiBox p={3}>
                      <VuiBox display="flex" alignItems="center" mb={2}>
                        <IoCalendar size={24} color="#2E72AC" style={{ marginRight: 12 }} />
                        <VuiTypography variant="h6" color="white" fontWeight="bold">
                          Janela de Sono - Fins de Semana
                        </VuiTypography>
                      </VuiBox>
                      <VuiBox
                        p={2.5}
                        sx={{
                          background: "rgba(46, 114, 172, 0.15)",
                          borderRadius: "12px",
                          textAlign: "center",
                        }}
                      >
                        <VuiTypography variant="h4" color="white" fontWeight="bold">
                          {dadosSono.janela_sono_fds}
                        </VuiTypography>
                      </VuiBox>
                    </VuiBox>
                  </Card>
                </Grid>
              </Grid>

              {/* Rotina Pré-Sono */}
              <Card
                sx={{
                  borderRadius: "20px",
                  background: linearGradient(cardContent.main, cardContent.state, cardContent.deg),
                  mb: 3,
                }}
              >
                <VuiBox p={3}>
                  <VuiBox display="flex" alignItems="center" mb={3}>
                    <IoCheckmarkCircle size={28} color="#2E72AC" style={{ marginRight: 12 }} />
                    <VuiTypography variant="h5" color="white" fontWeight="bold">
                      Rotina Pré-Sono
                    </VuiTypography>
                  </VuiBox>
                  <VuiBox position="relative">
                    {dadosSono.rotina_pre_sono.map((item, index) => {
                      const [horario, atividade] = item.split(" - ");
                      const isLast = index === dadosSono.rotina_pre_sono.length - 1;
                      return (
                        <VuiBox key={index} position="relative" mb={isLast ? 0 : 3}>
                          <VuiBox display="flex" alignItems="flex-start">
                            {/* Timeline Circle and Line */}
                            <VuiBox
                              sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                mr: 2,
                                flexShrink: 0,
                              }}
                            >
                              <VuiBox
                                sx={{
                                  width: 40,
                                  height: 40,
                                  borderRadius: "50%",
                                  background: linearGradient(
                                    gradients.info.main,
                                    gradients.info.state,
                                    gradients.info.deg
                                  ),
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  zIndex: 2,
                                }}
                              >
                                <VuiTypography variant="button" color="white" fontWeight="bold">
                                  {index + 1}
                                </VuiTypography>
                              </VuiBox>
                              {!isLast && (
                                <VuiBox
                                  sx={{
                                    width: "2px",
                                    height: "calc(100% + 12px)",
                                    background: "rgba(46, 114, 172, 0.3)",
                                    mt: 1,
                                  }}
                                />
                              )}
                            </VuiBox>
                            {/* Conteúdo */}
                            <VuiBox flex={1}>
                              <Card
                                sx={{
                                  borderRadius: "12px",
                                  background: "rgba(255, 255, 255, 0.05)",
                                  p: 2.5,
                                  transition: "all 0.3s ease",
                                  "&:hover": {
                                    background: "rgba(255, 255, 255, 0.08)",
                                    transform: "translateX(4px)",
                                  },
                                }}
                              >
                                <VuiBox display="flex" alignItems="center" mb={1} flexWrap="wrap">
                                  <VuiTypography
                                    variant="h6"
                                    color="white"
                                    fontWeight="bold"
                                    sx={{ minWidth: "80px", mb: { xs: 1, sm: 0 } }}
                                  >
                                    {horario}
                                  </VuiTypography>
                                  <VuiBox
                                    sx={{
                                      flex: 1,
                                      minWidth: "60px",
                                      height: "2px",
                                      background: "rgba(46, 114, 172, 0.3)",
                                      mx: { xs: 0, sm: 2 },
                                      display: { xs: "none", sm: "block" },
                                    }}
                                  />
                                </VuiBox>
                                <VuiTypography variant="body2" color="text" fontWeight="regular" sx={{ lineHeight: 1.7 }}>
                                  {atividade}
                                </VuiTypography>
                              </Card>
                            </VuiBox>
                          </VuiBox>
                        </VuiBox>
                      );
                    })}
                  </VuiBox>
                </VuiBox>
              </Card>

              {/* Gatilhos a Evitar */}
              <Card
                sx={{
                  borderRadius: "20px",
                  background: linearGradient(cardContent.main, cardContent.state, cardContent.deg),
                  mb: 3,
                }}
              >
                <VuiBox p={3}>
                  <VuiBox display="flex" alignItems="center" mb={3}>
                    <IoCloseCircle size={28} color="#FF3838" style={{ marginRight: 12 }} />
                    <VuiTypography variant="h5" color="white" fontWeight="bold">
                      Gatilhos a Evitar
                    </VuiTypography>
                  </VuiBox>
                  <Grid container spacing={2}>
                    {dadosSono.gatilhos_evitar.map((gatilho, index) => (
                      <Grid item xs={12} sm={6} key={index}>
                        <Card
                          sx={{
                            borderRadius: "12px",
                            background: "rgba(255, 56, 56, 0.1)",
                            border: "1px solid rgba(255, 56, 56, 0.2)",
                            p: 2,
                          }}
                        >
                          <VuiBox display="flex" alignItems="center">
                            <VuiBox
                              sx={{
                                width: 32,
                                height: 32,
                                borderRadius: "50%",
                                background: "rgba(255, 56, 56, 0.2)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                mr: 2,
                              }}
                            >
                              <IoCloseCircle size={18} color="#FF3838" />
                            </VuiBox>
                            <VuiTypography variant="body2" color="text" fontWeight="medium" sx={{ lineHeight: 1.6 }}>
                              {gatilho}
                            </VuiTypography>
                          </VuiBox>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </VuiBox>
              </Card>

              {/* Progressão de Ajuste */}
              <Card
                sx={{
                  borderRadius: "20px",
                  background: linearGradient(cardContent.main, cardContent.state, cardContent.deg),
                  mb: 3,
                }}
              >
                <VuiBox p={3}>
                  <VuiBox display="flex" alignItems="center" mb={2}>
                    <IoCheckmarkCircle size={28} color="#F9CF05" style={{ marginRight: 12 }} />
                    <VuiTypography variant="h5" color="white" fontWeight="bold">
                      Progressão de Ajuste
                    </VuiTypography>
                  </VuiBox>
                  <Card
                    sx={{
                      borderRadius: "15px",
                      background: "rgba(249, 207, 5, 0.1)",
                      border: "1px solid rgba(249, 207, 5, 0.2)",
                      p: 2.5,
                    }}
                  >
                    <VuiTypography variant="body2" color="text" fontWeight="regular" sx={{ lineHeight: 1.8 }}>
                      {dadosSono.progressao_ajuste}
                    </VuiTypography>
                  </Card>
                </VuiBox>
              </Card>

              {/* Observações Clínicas */}
              <Card
                sx={{
                  borderRadius: "20px",
                  background: linearGradient(cardContent.main, cardContent.state, cardContent.deg),
                  mb: 3,
                }}
              >
                <VuiBox p={3}>
                  <VuiBox display="flex" alignItems="center" mb={2}>
                    <IoAlertCircle size={28} color="#F9CF05" style={{ marginRight: 12 }} />
                    <VuiTypography variant="h5" color="white" fontWeight="bold">
                      Observações Clínicas
                    </VuiTypography>
                  </VuiBox>
                  <Card
                    sx={{
                      borderRadius: "15px",
                      background: "rgba(249, 207, 5, 0.1)",
                      border: "1px solid rgba(249, 207, 5, 0.3)",
                      p: 2.5,
                    }}
                  >
                    <VuiTypography variant="body2" color="text" fontWeight="regular" sx={{ lineHeight: 1.8 }}>
                      {dadosSono.observacoes_clinicas}
                    </VuiTypography>
                  </Card>
                </VuiBox>
              </Card>
            </>
          );
        })()}

        {/* Título da Seção de Padrões */}
        <VuiBox mb={3} mt={6}>
          <VuiTypography variant="h4" color="white" fontWeight="bold" mb={1}>
            Padrões Identificados
          </VuiTypography>
          <VuiTypography variant="button" color="text" fontWeight="regular">
            Clique em cada padrão para expandir e ver detalhes completos
          </VuiTypography>
        </VuiBox>

        {/* Lista de Padrões */}
        <Grid container spacing={3}>
          {padroes.map((padrao) => (
            <Grid item xs={12} key={padrao.id}>
              <Accordion
                expanded={expandedPadrao === padrao.id}
                onChange={handleChangePadrao(padrao.id)}
                sx={{
                  borderRadius: "20px !important",
                  background: linearGradient(cardContent.main, cardContent.state, cardContent.deg),
                  boxShadow: "none",
                  "&:before": { display: "none" },
                  mb: 2,
                }}
              >
                <AccordionSummary
                  expandIcon={
                    <Icon
                      sx={{
                        color: "white",
                        transform: expandedPadrao === padrao.id ? "rotate(180deg)" : "rotate(0deg)",
                        transition: "transform 0.3s ease",
                      }}
                    >
                      {expandedPadrao === padrao.id ? (
                        <IoArrowUp size={24} />
                      ) : (
                        <IoArrowDown size={24} />
                      )}
                    </Icon>
                  }
                  sx={{
                    borderRadius: "20px",
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.05)",
                    },
                  }}
                >
                  <VuiBox
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    width="100%"
                    pr={2}
                  >
                    <VuiBox display="flex" alignItems="center" flex={1}>
                      <VuiBox
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: "12px",
                          background: `linear-gradient(135deg, ${getPrioridadeColor(
                            padrao.prioridade
                          )} 0%, ${getPrioridadeColor(padrao.prioridade)}CC 100%)`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          mr: 2,
                        }}
                      >
                        <VuiTypography variant="h6" color="white" fontWeight="bold">
                          {padrao.prioridade}
                        </VuiTypography>
                      </VuiBox>
                      <VuiBox>
                        <VuiTypography variant="h5" color="white" fontWeight="bold" mb={0.5}>
                          {padrao.nome}
                        </VuiTypography>
                        <VuiTypography variant="body2" color="text" fontWeight="regular">
                          {padrao.subtitulo}
                        </VuiTypography>
                      </VuiBox>
                    </VuiBox>
                  </VuiBox>
                </AccordionSummary>

                <AccordionDetails sx={{ pt: 3, pb: 3 }}>
                  <VuiBox>
                    {/* Categorias e Áreas de Impacto */}
                    <VuiBox mb={3}>
                      <VuiBox display="flex" flexWrap="wrap" gap={1} mb={2}>
                        {padrao.categorias.map((cat, idx) => (
                          <Chip
                            key={idx}
                            label={cat.replace(/_/g, " ")}
                            size="small"
                            sx={{
                              backgroundColor: "rgba(46, 114, 172, 0.2)",
                              color: "#CBD5E0",
                              fontWeight: "medium",
                            }}
                          />
                        ))}
                      </VuiBox>
                      <VuiTypography variant="caption" color="text" fontWeight="medium" mb={1}>
                        Áreas de Impacto:
                      </VuiTypography>
                      <VuiBox display="flex" flexWrap="wrap" gap={1}>
                        {padrao.areasImpacto.map((area, idx) => (
                          <Chip
                            key={idx}
                            label={area}
                            size="small"
                            sx={{
                              backgroundColor: "rgba(255, 255, 255, 0.05)",
                              color: "#CBD5E0",
                              fontWeight: "regular",
                            }}
                          />
                        ))}
                      </VuiBox>
                    </VuiBox>

                    {/* Origem Estimada */}
                    <Card
                      sx={{
                        borderRadius: "15px",
                        background: "rgba(255, 255, 255, 0.03)",
                        mb: 3,
                      }}
                    >
                      <VuiBox p={2.5}>
                        <VuiTypography variant="h6" color="white" fontWeight="bold" mb={1.5}>
                          Origem Estimada
                        </VuiTypography>
                        <VuiTypography variant="body2" color="text" fontWeight="medium" mb={1}>
                          Período: {padrao.origem.periodo}
                        </VuiTypography>
                        <VuiTypography variant="body2" color="text" fontWeight="regular" sx={{ lineHeight: 1.7 }}>
                          {padrao.origem.contexto}
                        </VuiTypography>
                      </VuiBox>
                    </Card>

                    {/* Manifestações Atuais */}
                    <Card
                      sx={{
                        borderRadius: "15px",
                        background: "rgba(255, 255, 255, 0.03)",
                        mb: 3,
                      }}
                    >
                      <VuiBox p={2.5}>
                        <VuiTypography variant="h6" color="white" fontWeight="bold" mb={1.5}>
                          Manifestações Atuais
                        </VuiTypography>
                        <VuiBox component="ul" sx={{ pl: 3, m: 0 }}>
                          {padrao.manifestacoes.map((manifestacao, idx) => (
                            <li key={idx}>
                              <VuiTypography
                                variant="body2"
                                color="text"
                                fontWeight="regular"
                                mb={1}
                                sx={{ lineHeight: 1.7 }}
                              >
                                {manifestacao}
                              </VuiTypography>
                            </li>
                          ))}
                        </VuiBox>
                      </VuiBox>
                    </Card>

                    {/* Conexões com Outros Padrões */}
                    {(padrao.conexoes.raizDe ||
                      padrao.conexoes.alimentadoPor ||
                      padrao.conexoes.relacionadoCom) && (
                      <Card
                        sx={{
                          borderRadius: "15px",
                          background: "rgba(255, 255, 255, 0.03)",
                          mb: 3,
                        }}
                      >
                        <VuiBox p={2.5}>
                          <VuiTypography variant="h6" color="white" fontWeight="bold" mb={1.5}>
                            Conexões com Outros Padrões
                          </VuiTypography>
                          {padrao.conexoes.raizDe && (
                            <VuiBox mb={2}>
                              <VuiTypography variant="button" color="white" fontWeight="medium" mb={1}>
                                Este padrão é raiz de:
                              </VuiTypography>
                              <VuiBox component="ul" sx={{ pl: 3, m: 0 }}>
                                {padrao.conexoes.raizDe.map((item, idx) => (
                                  <li key={idx}>
                                    <VuiTypography variant="body2" color="text" fontWeight="regular">
                                      → {item}
                                    </VuiTypography>
                                  </li>
                                ))}
                              </VuiBox>
                            </VuiBox>
                          )}
                          {padrao.conexoes.alimentadoPor && (
                            <VuiBox mb={2}>
                              <VuiTypography variant="button" color="white" fontWeight="medium" mb={1}>
                                Este padrão é alimentado por:
                              </VuiTypography>
                              <VuiBox component="ul" sx={{ pl: 3, m: 0 }}>
                                {padrao.conexoes.alimentadoPor.map((item, idx) => (
                                  <li key={idx}>
                                    <VuiTypography variant="body2" color="text" fontWeight="regular">
                                      ← {item}
                                    </VuiTypography>
                                  </li>
                                ))}
                              </VuiBox>
                            </VuiBox>
                          )}
                          {padrao.conexoes.relacionadoCom && (
                            <VuiBox>
                              <VuiTypography variant="button" color="white" fontWeight="medium" mb={1}>
                                Este padrão está relacionado com:
                              </VuiTypography>
                              <VuiBox component="ul" sx={{ pl: 3, m: 0 }}>
                                {padrao.conexoes.relacionadoCom.map((item, idx) => (
                                  <li key={idx}>
                                    <VuiTypography variant="body2" color="text" fontWeight="regular">
                                      ↔ {item}
                                    </VuiTypography>
                                  </li>
                                ))}
                              </VuiBox>
                            </VuiBox>
                          )}
                        </VuiBox>
                      </Card>
                    )}

                    {/* Orientações para Transformação */}
                    <Card
                      sx={{
                        borderRadius: "15px",
                        background: "rgba(46, 114, 172, 0.1)",
                      }}
                    >
                      <VuiBox p={2.5}>
                        <VuiTypography variant="h6" color="white" fontWeight="bold" mb={2}>
                          Orientações para Transformação
                        </VuiTypography>

                        {padrao.orientacoes.map((orientacao) => (
                          <Accordion
                            key={orientacao.numero}
                            expanded={expandedPasso[`${padrao.id}-${orientacao.numero}`] || false}
                            onChange={handleChangePasso(padrao.id, orientacao.numero)}
                            sx={{
                              borderRadius: "12px !important",
                              background: "rgba(255, 255, 255, 0.05)",
                              boxShadow: "none",
                              mb: 2,
                              "&:before": { display: "none" },
                              "&:last-child": { mb: 0 },
                            }}
                          >
                            <AccordionSummary
                              expandIcon={
                                <Icon
                                  sx={{
                                    color: "white",
                                    transform: expandedPasso[`${padrao.id}-${orientacao.numero}`]
                                      ? "rotate(180deg)"
                                      : "rotate(0deg)",
                                    transition: "transform 0.3s ease",
                                  }}
                                >
                                  {expandedPasso[`${padrao.id}-${orientacao.numero}`] ? (
                                    <IoArrowUp size={20} />
                                  ) : (
                                    <IoArrowDown size={20} />
                                  )}
                                </Icon>
                              }
                              sx={{
                                borderRadius: "12px",
                              }}
                            >
                              <VuiBox display="flex" alignItems="center">
                                <VuiBox
                                  sx={{
                                    width: 32,
                                    height: 32,
                                    borderRadius: "8px",
                                    background: linearGradient(
                                      gradients.info.main,
                                      gradients.info.state,
                                      gradients.info.deg
                                    ),
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    mr: 2,
                                  }}
                                >
                                  <VuiTypography variant="button" color="white" fontWeight="bold">
                                    {orientacao.numero}
                                  </VuiTypography>
                                </VuiBox>
                                <VuiTypography variant="h6" color="white" fontWeight="bold">
                                  {orientacao.titulo}
                                </VuiTypography>
                              </VuiBox>
                            </AccordionSummary>
                            <AccordionDetails sx={{ pt: 2, pb: 2 }}>
                              <VuiBox>
                                <VuiBox mb={2}>
                                  <VuiTypography
                                    variant="button"
                                    color="white"
                                    fontWeight="bold"
                                    mb={1}
                                  >
                                    O QUE FAZER:
                                  </VuiTypography>
                                  <VuiTypography variant="body2" color="text" fontWeight="regular" sx={{ lineHeight: 1.7 }}>
                                    {orientacao.oQueFazer}
                                  </VuiTypography>
                                </VuiBox>
                                <VuiBox mb={2}>
                                  <VuiTypography
                                    variant="button"
                                    color="white"
                                    fontWeight="bold"
                                    mb={1}
                                  >
                                    COMO FAZER:
                                  </VuiTypography>
                                  <VuiTypography variant="body2" color="text" fontWeight="regular" sx={{ lineHeight: 1.7 }}>
                                    {orientacao.comoFazer}
                                  </VuiTypography>
                                </VuiBox>
                                <VuiBox>
                                  <VuiTypography
                                    variant="button"
                                    color="white"
                                    fontWeight="bold"
                                    mb={1}
                                  >
                                    POR QUE FUNCIONA:
                                  </VuiTypography>
                                  <VuiTypography variant="body2" color="text" fontWeight="regular" sx={{ lineHeight: 1.7 }}>
                                    {orientacao.porQueFunciona}
                                  </VuiTypography>
                                </VuiBox>
                              </VuiBox>
                            </AccordionDetails>
                          </Accordion>
                        ))}
                      </VuiBox>
                    </Card>
                  </VuiBox>
                </AccordionDetails>
              </Accordion>
            </Grid>
          ))}
        </Grid>
      </VuiBox>
      <Footer />
    </DashboardLayout>
  );
};

export default MentalidadeEspiritualidade;
