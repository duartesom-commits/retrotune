
import { GoogleGenAI, Type } from "@google/genai";
import { Question, Decade, Category } from "../types";

export const shuffleArray = <T>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const prepareQuestion = (q: any, idx: number, decade: Decade, category: Category): Question => {
  // Garantia absoluta: baralhamos as opções aqui, no cliente,
  // independentemente de como a IA ou o fallback as enviou.
  const shuffledOptions = shuffleArray([...q.options]);
  return {
    id: btoa(q.text).substring(0, 16) + idx + Math.random().toString(36).substring(2, 5),
    text: q.text,
    options: shuffledOptions,
    correctAnswer: q.correctAnswer,
    type: 'text',
    decade: q.decade as Decade || decade, // Use provided decade or fallback
    category: q.category as Category || category // Use provided category or fallback
  };
};

export const generateQuestions = async (decade: Decade, category: Category, count: number = 15, excludeTexts: string[] = []): Promise<Question[]> => {
  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    console.warn("API_KEY não encontrada no process.env. A usar modo de reserva.");
    return getFallbackQuestions(decade, category, count, excludeTexts);
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const decadeText = decade === 'all' ? 'dos anos 80 até 2025' : `dos anos ${decade}`;
    const categoryText = 
      category === 'portuguese' ? 'de artistas portugueses' :
      category === 'international' ? 'de artistas internacionais' :
      'de artistas portugueses e internacionais';
    
    const recentQuestions = excludeTexts.slice(-30).join(' | ');

    const prompt = `Gera uma lista de ${count} perguntas de escolha múltipla sobre música ${categoryText} ${decadeText}.
    
    REGRAS:
    1. A 'correctAnswer' DEVE ser uma das opções.
    2. Nenhuma pergunta deve ser sobre artistas ou bandas brasileiras.
    3. NÃO repitas estas perguntas: ${recentQuestions}.
    4. Inclui sucessos de rádio em Portugal e internacionais (se a categoria permitir).
    5. Responde APENAS em JSON.`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: "És um especialista em quiz de música. Resposta exclusiva em JSON.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              text: { type: Type.STRING },
              options: { type: Type.ARRAY, items: { type: Type.STRING }, minItems: 4, maxItems: 4 },
              correctAnswer: { type: Type.STRING },
              decade: { type: Type.STRING },
              category: { type: Type.STRING } // Incluindo a categoria no esquema
            },
            required: ["text", "options", "correctAnswer", "decade", "category"]
          }
        }
      }
    });

    const data = JSON.parse(response.text || "[]");
    return data.map((q: any, i: number) => prepareQuestion(q, i, decade, category));
    
  } catch (error) {
    console.error("Erro na geração via Gemini:", error);
    return getFallbackQuestions(decade, category, count, excludeTexts);
  }
};

function getFallbackQuestions(decade: Decade, category: Category, count: number, excludeTexts: string[]): Question[] {
  // Fix: Remove type assertion here. The `prepareQuestion` function will add the missing properties.
  const fallbackCatalog = [ 
    { text: "Quem lançou o álbum 'Thriller' em 1982?", options: ["Michael Jackson", "Prince", "Madonna", "Mick Jagger"], correctAnswer: "Michael Jackson", decade: "80s", category: "international" },
    { text: "Qual é a banda portuguesa de 'A Minha Casinha'?", options: ["Xutos & Pontapés", "GNR", "UHF", "Sétima Legião"], correctAnswer: "Xutos & Pontapés", decade: "80s", category: "portuguese" },
    { text: "Qual banda britânica é liderada por Chris Martin?", options: ["Coldplay", "Muse", "Radiohead", "Keane"], correctAnswer: "Coldplay", decade: "00s", category: "international" },
    { text: "Quem canta o êxito 'Amar pelos Dois'?", options: ["Salvador Sobral", "Luísa Sobral", "Tiago Iorc", "Diogo Piçarra"], correctAnswer: "Salvador Sobral", decade: "2010s", category: "portuguese" },
    { text: "Qual destes artistas é conhecido como 'The Boss'?", options: ["Bruce Springsteen", "Elvis Presley", "Bono", "David Bowie"], correctAnswer: "Bruce Springsteen", decade: "80s", category: "international" },
    { text: "Qual é o nome da vocalista dos The Gift?", options: ["Sónia Tavares", "Aurea", "Mariza", "Ana Bacalhau"], correctAnswer: "Sónia Tavares", decade: "90s", category: "portuguese" },
    { text: "Qual banda portuguesa canta 'Re-Tratamento'?", options: ["Da Weasel", "Expensive Soul", "Mind da Gap", "Dealema"], correctAnswer: "Da Weasel", decade: "00s", category: "portuguese" },
    { text: "Qual destas músicas é dos Queen?", options: ["Bohemian Rhapsody", "Stairway to Heaven", "Imagine", "Satisfaction"], correctAnswer: "Bohemian Rhapsody", decade: "all", category: "international" },
    { text: "Quem canta 'Despacito'?", options: ["Luis Fonsi", "Ricky Martin", "Enrique Iglesias", "Maluma"], correctAnswer: "Luis Fonsi", decade: "2010s", category: "international" },
    { text: "Qual o álbum de estreia dos Ornatos Violeta?", options: ["Cão!", "O Monstro Precisa de Amigos", "O Amor É Mágico", "As Coisas Lá de Casa"], correctAnswer: "Cão!", decade: "90s", category: "portuguese" },
    { text: "Quem é o artista por trás de 'Blinding Lights'?", options: ["The Weeknd", "Dua Lipa", "Harry Styles", "Ed Sheeran"], correctAnswer: "The Weeknd", decade: "2020s", category: "international" },
    { text: "Qual o nome do primeiro álbum dos Mão Morta?", options: ["Bófia", "Mão Morta", "Cães de Crómio", "Mutantes S.21"], correctAnswer: "Mão Morta", decade: "80s", category: "portuguese" },
    { text: "Quem gravou 'Like a Prayer'?", options: ["Madonna", "Janet Jackson", "Whitney Houston", "Paula Abdul"], correctAnswer: "Madonna", decade: "80s", category: "international" },
    { text: "Qual artista é conhecido pela música 'Bad Guy'?", options: ["Billie Eilish", "Lorde", "Halsey", "Olivia Rodrigo"], correctAnswer: "Billie Eilish", decade: "2010s", category: "international" },
    { text: "Qual o nome do vocalista dos Xutos & Pontapés?", options: ["Tim", "Zé Pedro", "Kalú", "Gui"], correctAnswer: "Tim", decade: "80s", category: "portuguese" },
    { text: "Quem canta 'Rolling in the Deep'?", options: ["Adele", "Rihanna", "Beyoncé", "Lady Gaga"], correctAnswer: "Adele", decade: "2010s", category: "international" },
    { text: "Qual o nome da banda do álbum 'Viagens'?", options: ["Clã", "Expensive Soul", "GNR", "D.A.M.A"], correctAnswer: "Clã", decade: "00s", category: "portuguese" },
    { text: "Qual artista pop lançou 'Poker Face'?", options: ["Lady Gaga", "Katy Perry", "Britney Spears", "Rihanna"], correctAnswer: "Lady Gaga", decade: "00s", category: "international" },
    { text: "Qual o nome da dupla por trás de 'Chaka Khan'?", options: ["Expensive Soul", "Mind da Gap", "Dealema", "Orelha Negra"], correctAnswer: "Expensive Soul", decade: "00s", category: "portuguese" },
    { text: "Quem canta o sucesso 'Watermelon Sugar'?", options: ["Harry Styles", "Shawn Mendes", "Justin Bieber", "Ed Sheeran"], correctAnswer: "Harry Styles", decade: "2020s", category: "international" },
  ];

  let filtered = fallbackCatalog.filter(q => !excludeTexts.includes(q.text));

  // Filtrar por década
  if (decade !== 'all') {
    filtered = filtered.filter(q => q.decade === decade);
  }

  // Filtrar por categoria
  if (category !== 'both') {
    filtered = filtered.filter(q => q.category === category);
  }

  // Se o filtro resultou em poucas perguntas, relaxa o filtro de categoria para ter mais variedade.
  // Se ainda assim for pouco, usa o catálogo original (sem filtro de categoria e década).
  if (filtered.length < count / 2) { // se menos de metade do count, relaxar
    filtered = fallbackCatalog.filter(q => !excludeTexts.includes(q.text)); // Reset ao filtro de exclusão
    if (decade !== 'all') { // Mantém o filtro de década
      filtered = filtered.filter(q => q.decade === decade);
    }
  }

  const source = filtered.length > 0 ? filtered : fallbackCatalog.filter(q => !excludeTexts.includes(q.text));
  
  return shuffleArray(source)
    .slice(0, count)
    .map((q, i) => prepareQuestion(q, i, decade, category)); // Pass decade and category to prepareQuestion
}