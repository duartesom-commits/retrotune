
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
    
    const prompt = `Gera uma lista de ${count} perguntas únicas de cultura geral sobre música ${decadeText}.
    REGRAS OBRIGATÓRIAS:
    1. A 'correctAnswer' tem de ser exatamente igual a uma das opções.
    2. Baralha a posição da resposta correta.
    3. Inclui sucessos internacionais e música portuguesa (ex: Xutos, Capitão Fausto, GNR, Ana Moura).
    4. Usa Português de Portugal.
    5. IDs que NÃO podes repetir (excluídos): ${excludeIds.join(',')}.`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: "És um perito em música. Respondes exclusivamente em formato JSON.",
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
    
    if (data.length === 0) throw new Error("API retornou array vazio");

    return data.map((q: any, idx: number) => ({
      id: `ai-${seed}-${idx}`,
      text: q.text,
      options: shuffleArray([...q.options]),
      correctAnswer: q.correctAnswer,
      type: 'text',
      decade: q.decade as Decade
    }));
  } catch (error) {
    console.error("Erro na API, a usar catálogo de reserva:", error);
    
    // Fallback expandido para garantir um jogo completo se a rede falhar
    const fallbackCatalog: Question[] = [
      { id: "f1", text: "Quem lançou o álbum 'Thriller' em 1982?", options: ["Michael Jackson", "Prince", "Madonna", "Mick Jagger"], correctAnswer: "Michael Jackson", type: "text", decade: "80s" },
      { id: "f2", text: "Qual é a banda portuguesa de 'A Minha Casinha'?", options: ["Xutos & Pontapés", "GNR", "UHF", "Sétima Legião"], correctAnswer: "Xutos & Pontapés", type: "text", decade: "80s" },
      { id: "f3", text: "Qual banda britânica é liderada por Chris Martin?", options: ["Coldplay", "Muse", "Radiohead", "Keane"], correctAnswer: "Coldplay", type: "text", decade: "00s" },
      { id: "f4", text: "Quem canta o êxito 'Amar pelos Dois'?", options: ["Salvador Sobral", "Luísa Sobral", "Tiago Iorc", "Diogo Piçarra"], correctAnswer: "Salvador Sobral", type: "text", decade: "2010s" },
      { id: "f5", text: "Qual destes artistas é conhecido como 'The Boss'?", options: ["Bruce Springsteen", "Elvis Presley", "Bono", "David Bowie"], correctAnswer: "Bruce Springsteen", type: "text", decade: "80s" },
      { id: "f6", text: "Qual é o nome da vocalista dos The Gift?", options: ["Sónia Tavares", "Aurea", "Mariza", "Ana Bacalhau"], correctAnswer: "Sónia Tavares", type: "text", decade: "90s" },
      { id: "f7", text: "Em que década os Nirvana lançaram 'Nevermind'?", options: ["Anos 90", "Anos 80", "Anos 2000", "Anos 70"], correctAnswer: "Anos 90", type: "text", decade: "90s" },
      { id: "f8", text: "Quem é a artista de 'Flowers' (2023)?", options: ["Miley Cyrus", "Taylor Swift", "Dua Lipa", "Adele"], correctAnswer: "Miley Cyrus", type: "text", decade: "2020s" },
      { id: "f9", text: "Qual banda portuguesa canta 'Re-Tratamento'?", options: ["Da Weasel", "Expensive Soul", "Mind da Gap", "Dealema"], correctAnswer: "Da Weasel", type: "text", decade: "00s" },
      { id: "f10", text: "Qual destas músicas é dos Queen?", options: ["Bohemian Rhapsody", "Stairway to Heaven", "Imagine", "Satisfaction"], correctAnswer: "Bohemian Rhapsody", type: "text", decade: "all" }
    ];

    return shuffleArray(fallbackCatalog).slice(0, count);
  }
};
