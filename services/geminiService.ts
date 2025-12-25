
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

export const generateQuestions = async (decade: Decade, count: number = 15, excludeIds: string[] = []): Promise<Question[]> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const seed = Math.random().toString(36).substring(7);
    
    const decadeText = decade === 'all' ? 'dos anos 80 até 2024' : `dos anos ${decade}`;
    
    const prompt = `Gera ${count} perguntas de cultura geral sobre música ${decadeText}.
    REGRAS OBRIGATÓRIAS:
    1. A 'correctAnswer' tem de ser o texto idêntico a uma das opções.
    2. Baralha a posição da resposta correta em cada objeto do JSON.
    3. Inclui sucessos de rádio, bandas de rock, pop e música portuguesa (ex: Xutos, Da Weasel, Dino d'Santiago).
    4. Usa Português de Portugal.
    5. IDs excluídos: ${excludeIds.join(',')}.`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: "És um perito em música e história da pop/rock. Respondes apenas em JSON estrito.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              text: { type: Type.STRING },
              options: { type: Type.ARRAY, items: { type: Type.STRING } },
              correctAnswer: { type: Type.STRING },
              decade: { type: Type.STRING }
            },
            required: ["text", "options", "correctAnswer", "decade"]
          }
        }
      }
    });

    const data = JSON.parse(response.text || "[]");
    
    return data.map((q: any, idx: number) => ({
      id: `ai-${seed}-${idx}`,
      text: q.text,
      options: shuffleArray([...q.options]), // Baralhamento extra no cliente
      correctAnswer: q.correctAnswer,
      type: 'text',
      decade: q.decade as Decade
    }));
  } catch (error) {
    console.error("Erro na API:", error);
    // Fallback robusto
    return shuffleArray([
      { id: "f1", text: "Qual destes artistas lançou o álbum 'Thriller'?", options: ["Michael Jackson", "Prince", "Madonna", "George Michael"], correctAnswer: "Michael Jackson", type: "text", decade: "80s" },
      { id: "f2", text: "Quem canta o tema 'O Amor é Mágico'?", options: ["Expensive Soul", "The Gift", "HMB", "Os Quatro e Meia"], correctAnswer: "Expensive Soul", type: "text", decade: "2010s" }
    ]).slice(0, count) as Question[];
  }
};
