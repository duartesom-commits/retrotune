
import { GoogleGenAI, Type } from "@google/genai";
import { Question, Decade } from "../types";

export const shuffleArray = <T>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const prepareQuestion = (q: any, idx: number): Question => {
  // Garantia absoluta: baralhamos as opções aqui, no cliente,
  // independentemente de como a IA ou o fallback as enviou.
  const shuffledOptions = shuffleArray([...q.options]);
  return {
    id: btoa(q.text).substring(0, 16) + idx + Math.random().toString(36).substring(2, 5),
    text: q.text,
    options: shuffledOptions,
    correctAnswer: q.correctAnswer,
    type: 'text',
    decade: q.decade as Decade
  };
};

export const generateQuestions = async (decade: Decade, count: number = 15, excludeTexts: string[] = []): Promise<Question[]> => {
  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    console.warn("API_KEY não encontrada no process.env. A usar modo de reserva.");
    return getFallbackQuestions(decade, count, excludeTexts);
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const decadeText = decade === 'all' ? 'dos anos 80 até 2025' : `dos anos ${decade}`;
    const recentQuestions = excludeTexts.slice(-30).join(' | ');

    const prompt = `Gera uma lista de ${count} perguntas de escolha múltipla sobre música ${decadeText}.
    
    REGRAS:
    1. A 'correctAnswer' DEVE ser uma das opções.
    2. NÃO repitas estas perguntas: ${recentQuestions}.
    3. Inclui sucessos de rádio em Portugal e internacionais.
    4. Responde APENAS em JSON.`;

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
              decade: { type: Type.STRING }
            },
            required: ["text", "options", "correctAnswer", "decade"]
          }
        }
      }
    });

    const data = JSON.parse(response.text || "[]");
    return data.map((q: any, i: number) => prepareQuestion(q, i));
    
  } catch (error) {
    console.error("Erro na geração via Gemini:", error);
    return getFallbackQuestions(decade, count, excludeTexts);
  }
};

function getFallbackQuestions(decade: Decade, count: number, excludeTexts: string[]): Question[] {
  const fallbackCatalog = [
    { text: "Quem lançou o álbum 'Thriller' em 1982?", options: ["Michael Jackson", "Prince", "Madonna", "Mick Jagger"], correctAnswer: "Michael Jackson", decade: "80s" },
    { text: "Qual é a banda portuguesa de 'A Minha Casinha'?", options: ["Xutos & Pontapés", "GNR", "UHF", "Sétima Legião"], correctAnswer: "Xutos & Pontapés", decade: "80s" },
    { text: "Qual banda britânica é liderada por Chris Martin?", options: ["Coldplay", "Muse", "Radiohead", "Keane"], correctAnswer: "Coldplay", decade: "00s" },
    { text: "Quem canta o êxito 'Amar pelos Dois'?", options: ["Salvador Sobral", "Luísa Sobral", "Tiago Iorc", "Diogo Piçarra"], correctAnswer: "Salvador Sobral", decade: "2010s" },
    { text: "Qual destes artistas é conhecido como 'The Boss'?", options: ["Bruce Springsteen", "Elvis Presley", "Bono", "David Bowie"], correctAnswer: "Bruce Springsteen", decade: "80s" },
    { text: "Qual é o nome da vocalista dos The Gift?", options: ["Sónia Tavares", "Aurea", "Mariza", "Ana Bacalhau"], correctAnswer: "Sónia Tavares", decade: "90s" },
    { text: "Qual banda portuguesa canta 'Re-Tratamento'?", options: ["Da Weasel", "Expensive Soul", "Mind da Gap", "Dealema"], correctAnswer: "Da Weasel", decade: "00s" },
    { text: "Qual destas músicas é dos Queen?", options: ["Bohemian Rhapsody", "Stairway to Heaven", "Imagine", "Satisfaction"], correctAnswer: "Bohemian Rhapsody", decade: "all" }
  ];

  const available = fallbackCatalog.filter(q => !excludeTexts.includes(q.text));
  const source = available.length > 3 ? available : fallbackCatalog;
  
  return shuffleArray(source)
    .slice(0, count)
    .map((q, i) => prepareQuestion(q, i));
}
