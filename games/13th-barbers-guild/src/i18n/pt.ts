import { capFirst } from "../utils";

export const messages = {
  welcome:
    "Bem-vindo jovem barbeiro-cirurgião ⚕️! Esta é sua chance de entrar para a <b>13º Guilda de Barbeiros</b> e trabalhar com os melhores!",
  instructions: `✅ Pressione <em>ESPAÇO</em> ou clique em qualquer lugar da tela para continuar.\n✅ Pressione <em>ESC</em> a qualquer momento para recomeçar.\n✅ Arraste poções para o caldeirão quando solicitado.\n✅ Dentro de ${
    import.meta.env.VITE_TIME_LIMIT
  } segundos, ganhe um crédito por cada cura!`,
  level1Callout:
    "Você está em fase de testes! As doenças estão se espalhando pelo reino!",
  levelNCallout: (count: number) =>
    `As doenças estão piores que nunca! Agora você precisa combinar ${count} ingredientes para uma cura.`,
  levelParams: (count: number) => {
    const nextLevelAction =
      count === 1
        ? "entrar para a Guilda de Barbeiros"
        : `avançar para o nível ${count}`;
    return `Você acredita que pode obter ${
      import.meta.env.VITE_PATIENT_LIMIT
    } créditos para ${nextLevelAction} dentro de ${
      import.meta.env.VITE_TIME_LIMIT
    } segundos? Uma falha resultará em sua demissão 🔥!`;
  },
  ingredientList: (items: string) =>
    `<h4>Atenção!</h4><p>Ministre as poções de acordo com a doença:</p><p>${items}</p><p>Está pronto para começar?</p>`,
  gameOver:
    "<h4>Tempo esgotado!</h4><p>Você é uma vergonha para nossa guilda! Não ouse voltar aqui antes de estar realmente preparado!</p>",
  gameComplete:
    "<h4>Jogo concluído!</h4><p>Parabéns! Seu nome será lembrado mesmo daqui 1300 ano como o maior barbeiro-cirurgião de sempre. Ben Kingsley vai interpretá-lo em filmes!</p>",
  teardownIntructions:
    "<p>Pressione <i>ESC</i> ou clique em <i>Reset</i> to reiniciar.</p>",
  diseases: {
    flu: {
      name: "Gripe",
      symptoms: "Estou me sentindo febril e odeio esse nariz entupido!",
      symptomsShort: "febre e nariz escorrendo",
    },
    measles: {
      name: "Sarampo",
      symptoms:
        "Meu corpo está repleto de manchas vermelhas e estou queimando!",
      symptomsShort: "manchas vermelhas e febre",
    },
    plague: {
      name: "Praga",
      symptoms:
        "Estas ínguas inchadas são muito dolorosas! Meu corpo inteiro dói!",
      symptomsShort: "ínguas inchadas e dor no corpo",
    },
  },
  ingredients: [
    "Língua de Sapo",
    "Rabo de Salamandra",
    "Pata de Gato",
    "Dente de Rato",
    "Erva Infernal",
    "Osso de Texugo",
  ],
  health: {
    good: [
      "Me ajude doutor!",
      "O que pode fazer por mim senhor?",
      "Estou assustado, me ajude por favor!",
    ],
    gettingBetter: [
      "Não estou completamente recuperado, mas estou sentindo pequena melhora!",
      "Eu acho que houve uma pequena mudança para melhor em como me sinto",
      "Eu notei uma pequena melhora em minha condição",
      "Não estou tão mal como antes, houve pequena melhora.",
      "Estou sem sentindo ligeiramente melhor, mas ainda com algum desconforto.",
    ],
    bad: [
      "Não estou me sentindo melhor! Lembre-se:",
      "Estou me sentindo pior, o que é que me deu doutor?",
    ],
    dead: [
      (disease: string, symptoms: string, ingredients: string) =>
        `Você deveria salvar pessoas! Ele só precisava de ${ingredients} para ${symptoms}, claros sinais de ${capFirst(
          disease,
        )}.`,
      (disease: string, symptoms: string, ingredients: string) =>
        `Como espera se juntar à guilda matando seus pacientes? ${capFirst(
          symptoms,
        )}, sintomas de ${capFirst(
          disease,
        )}, deveriam ser curados com ${ingredients}.`,
    ],
    cured: [
      "Me sinto muito melhor doutor! Obrigado!",
      "Você é um herói senhor. Me sinto renovado!",
      "É um milagre! Me sinto eu mesmo novamente!",
    ],
  },
};
