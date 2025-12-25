
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

export const generateQuestions = async (decade: Decade, count: number = 15, excludeTexts: string[] = []): Promise<Question[]> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const decadeText = decade === 'all' ? 'dos anos 80 até 2025' : `dos anos ${decade}`;
    
    // Usamos o texto das perguntas anteriores para o modelo saber o que NÃO perguntar
    const recentQuestions = excludeTexts.slice(-20).join(' | ');

    const prompt = `Gera uma lista de ${count} perguntas de escolha múltipla sobre música ${decadeText}.
    
    REGRAS CRÍTICAS DE RANDOMIZAÇÃO:
    1. A 'correctAnswer' DEVE ser distribuída aleatoriamente entre as opções (não coloques sempre na primeira).
    2. NÃO repitas estas perguntas ou temas recentes: ${recentQuestions}.
    3. Inclui uma mistura equilibrada de artistas internacionais (Pop, Rock, Hip-Hop) e Portugueses (Rock, Fado, Pop atual).
    4. Garante que as 4 opções são plausíveis.
    5. O campo 'correctAnswer' tem de ser EXATAMENTE igual a uma das strings no array 'options'.

    Língua: Português de Portugal.`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: "És um mestre de quiz musical. Respondes apenas em JSON puro.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              text: { type: Type.STRING },
              options: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING },
                minItems: 4,
                maxItems: 4
              },
              correctAnswer: { type: Type.STRING },
              decade: { type: Type.STRING }
            },
            required: ["text", "options", "correctAnswer", "decade"]
          }
        }
      }
    });

    const data = JSON.parse(response.text || "[]");
    
    if (data.length === 0) throw new Error("Vazio");

    return data.map((q: any, idx: number) => {
      // Baralhamos as opções no cliente por segurança extra
      const shuffledOptions = shuffleArray([...q.options]);
      return {
        id: btoa(q.text).substring(0, 16) + idx, // ID baseado no texto para consistência
        text: q.text,
        options: shuffledOptions,
        correctAnswer: q.correctAnswer,
        type: 'text',
        decade: q.decade as Decade
      };
    });
  } catch (error) {
    console.error("Fallback ativado:", error);
    
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
      { id: "f10", text: "Qual destas músicas é dos Queen?", options: ["Bohemian Rhapsody", "Stairway to Heaven", "Imagine", "Satisfaction"], correctAnswer: "Bohemian Rhapsody", type: "text", decade: "all" },
      { id: "f11", text: "Quem venceu o Festival da Canção 2024?", options: ["Iolanda", "Bibi", "Noble", "No Maka"], correctAnswer: "Iolanda", type: "text", decade: "2020s" },
      { id: "f12", text: "Qual o nome do álbum de estreia dos Capitão Fausto?", options: ["Gazela", "Pipa de Massa", "Lousã", "Capitão Fausto"], correctAnswer: "Gazela", type: "text", decade: "2010s" }
    ];

    return shuffleArray(fallbackCatalog).slice(0, count);
  }
};
