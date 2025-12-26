
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

// Catálogo Local Verificado (Focado estritamente em Portugal e sucessos Internacionais)
const localCatalog: Omit<Question, 'id' | 'type'>[] = [
  // --- ANOS 80 INTERNACIONAL ---
  { text: "Quem lançou o álbum 'Thriller' em 1982?", options: ["Michael Jackson", "Prince", "Madonna", "Mick Jagger"], correctAnswer: "Michael Jackson", decade: "80s", category: "international" },
  { text: "Qual destes artistas é conhecido como 'The Boss'?", options: ["Bruce Springsteen", "Elvis Presley", "Bono", "David Bowie"], correctAnswer: "Bruce Springsteen", decade: "80s", category: "international" },
  { text: "Qual banda gravou 'Back in Black' em 1980?", options: ["AC/DC", "Led Zeppelin", "Guns N' Roses", "Iron Maiden"], correctAnswer: "AC/DC", decade: "80s", category: "international" },
  { text: "Qual banda é famosa pelo tema 'The Final Countdown'?", options: ["Europe", "Scorpions", "Van Halen", "Bon Jovi"], correctAnswer: "Europe", decade: "80s", category: "international" },
  { text: "Quem canta 'Careless Whisper'?", options: ["George Michael", "Boy George", "Elton John", "Phil Collins"], correctAnswer: "George Michael", decade: "80s", category: "international" },

  // --- ANOS 80 PORTUGUÊS (Artistas de Portugal) ---
  { text: "Qual é a banda portuguesa do hino 'A Minha Casinha'?", options: ["Xutos & Pontapés", "GNR", "UHF", "Sétima Legião"], correctAnswer: "Xutos & Pontapés", decade: "80s", category: "portuguese" },
  { text: "Quem canta o sucesso 'Playback' em 1981?", options: ["Carlos Paião", "Dina", "Lara Li", "Doce"], correctAnswer: "Carlos Paião", decade: "80s", category: "portuguese" },
  { text: "Qual banda portuguesa lançou o tema 'Sete Mares'?", options: ["Sétima Legião", "Madredeus", "GNR", "Trovante"], correctAnswer: "Sétima Legião", decade: "80s", category: "portuguese" },
  { text: "Qual o hit de Rui Veloso de 1980 que deu início ao 'Rock Português'?", options: ["Chico Fininho", "Porto Sentido", "Lado Lunar", "Não Há Estrelas No Céu"], correctAnswer: "Chico Fininho", decade: "80s", category: "portuguese" },
  { text: "Quem é o autor do tema 'O Corpo é que Paga'?", options: ["António Variações", "Heróis do Mar", "Carlos Paião", "Sérgio Godinho"], correctAnswer: "António Variações", decade: "80s", category: "portuguese" },
  { text: "Qual a banda do álbum 'Psicopátria'?", options: ["GNR", "Xutos", "Heróis do Mar", "Delfins"], correctAnswer: "GNR", decade: "80s", category: "portuguese" },

  // --- ANOS 90 INTERNACIONAL ---
  { text: "Qual banda lançou 'Smells Like Teen Spirit' em 1991?", options: ["Nirvana", "Pearl Jam", "Soundgarden", "Alice in Chains"], correctAnswer: "Nirvana", decade: "90s", category: "international" },
  { text: "Qual banda britânica lançou 'Wonderwall'?", options: ["Oasis", "Blur", "Pulp", "Radiohead"], correctAnswer: "Oasis", decade: "90s", category: "international" },
  { text: "Quem gravou 'I Will Always Love You' para o filme O Guarda-Costas?", options: ["Whitney Houston", "Mariah Carey", "Celine Dion", "Toni Braxton"], correctAnswer: "Whitney Houston", decade: "90s", category: "international" },

  // --- ANOS 90 PORTUGUÊS (Artistas de Portugal) ---
  { text: "Qual é o nome da vocalista da banda The Gift?", options: ["Sónia Tavares", "Aurea", "Mariza", "Ana Bacalhau"], correctAnswer: "Sónia Tavares", decade: "90s", category: "portuguese" },
  { text: "Quem lançou o álbum 'Viagens' em 1994?", options: ["Pedro Abrunhosa", "Jorge Palma", "Rui Veloso", "Paulo Gonzo"], correctAnswer: "Pedro Abrunhosa", decade: "90s", category: "portuguese" },
  { text: "Qual banda de David Fonseca lançou o hit 'Borrow'?", options: ["Silence 4", "The Gift", "Wraygunn", "Blasted Mechanism"], correctAnswer: "Silence 4", decade: "90s", category: "portuguese" },
  { text: "Qual o grande hit dos Delfins de 1996?", options: ["Sou Como Um Rio", "Nasce Selvagem", "A Queda de um Anjo", "Baía de Cascais"], correctAnswer: "Sou Como Um Rio", decade: "90s", category: "portuguese" },
  { text: "Quem canta 'Jardins Proibidos'?", options: ["Paulo Gonzo", "Pedro Abrunhosa", "João Pedro Pais", "André Sardet"], correctAnswer: "Paulo Gonzo", decade: "90s", category: "portuguese" },
  { text: "Qual banda lançou o icónico álbum 'O Monstro Precisa de Amigos'?", options: ["Ornatos Violeta", "The Gift", "Clã", "Mão Morta"], correctAnswer: "Ornatos Violeta", decade: "90s", category: "portuguese" },
  { text: "Quem canta o tema 'O Sopro do Coração'?", options: ["Clã", "The Gift", "Silence 4", "Trabalhadores do Comércio"], correctAnswer: "Clã", decade: "90s", category: "portuguese" },

  // --- ANOS 00 INTERNACIONAL ---
  { text: "Qual banda britânica é liderada por Chris Martin?", options: ["Coldplay", "Muse", "Radiohead", "Keane"], correctAnswer: "Coldplay", decade: "00s", category: "international" },
  { text: "Qual artista pop lançou 'Poker Face'?", options: ["Lady Gaga", "Katy Perry", "Britney Spears", "Rihanna"], correctAnswer: "Lady Gaga", decade: "00s", category: "international" },
  { text: "Qual banda lançou 'Mr. Brightside'?", options: ["The Killers", "The Strokes", "Arctic Monkeys", "Franz Ferdinand"], correctAnswer: "The Killers", decade: "00s", category: "international" },

  // --- ANOS 00 PORTUGUÊS ---
  { text: "Qual banda portuguesa canta 'Re-Tratamento'?", options: ["Da Weasel", "Expensive Soul", "Mind da Gap", "Dealema"], correctAnswer: "Da Weasel", decade: "00s", category: "portuguese" },
  { text: "Qual artista luso-canadiana lançou 'Loose'?", options: ["Nelly Furtado", "Aurea", "Lura", "Ana Free"], correctAnswer: "Nelly Furtado", decade: "00s", category: "portuguese" },
  { text: "Qual a banda de 'Movimento Perpétuo Associativo'?", options: ["Deolinda", "Diabo na Cruz", "Amor Electro", "Os Pontos Negros"], correctAnswer: "Deolinda", decade: "00s", category: "portuguese" },
  { text: "Quem canta o hit 'Carta' (2003)?", options: ["Toranja", "Delfins", "Silence 4", "Santos & Pecadores"], correctAnswer: "Toranja", decade: "00s", category: "portuguese" },

  // --- ANOS 10 INTERNACIONAL ---
  { text: "Quem canta 'Rolling in the Deep'?", options: ["Adele", "Rihanna", "Beyoncé", "Lady Gaga"], correctAnswer: "Adele", decade: "2010s", category: "international" },
  { text: "Quem canta 'Shape of You'?", options: ["Ed Sheeran", "Sam Smith", "Harry Styles", "Shawn Mendes"], correctAnswer: "Ed Sheeran", decade: "2010s", category: "international" },

  // --- ANOS 10 PORTUGUÊS ---
  { text: "Quem venceu a Eurovisão por Portugal com 'Amar pelos Dois'?", options: ["Salvador Sobral", "Luísa Sobral", "Conan Osiris", "MARO"], correctAnswer: "Salvador Sobral", decade: "2010s", category: "portuguese" },
  { text: "Qual artista lançou 'Faz Gostoso'?", options: ["Blaya", "Anitta", "Pabllo Vittar", "Ludmilla"], correctAnswer: "Blaya", decade: "2010s", category: "portuguese" },
  { text: "Quem canta 'Busy For Me'?", options: ["Aurea", "Richie Campbell", "Dengaz", "Agir"], correctAnswer: "Aurea", decade: "2010s", category: "portuguese" },
  { text: "Qual banda lançou 'A Máquina (Acordou agora)'?", options: ["Amor Electro", "Deolinda", "The Gift", "HMB"], correctAnswer: "Amor Electro", decade: "2010s", category: "portuguese" },

  // --- ANOS 20 PORTUGUÊS ---
  { text: "Qual música de Barbara Bandeira e Ivandro foi um mega hit em 2023?", options: ["Como Tu", "Nós os Dois", "Finda", "Onde Vais"], correctAnswer: "Como Tu", decade: "2020s", category: "portuguese" },
  { text: "Quem lançou o álbum 'Afro Fado' em 2023?", options: ["Slow J", "Dino d'Santiago", "Plutónio", "Richie Campbell"], correctAnswer: "Slow J", decade: "2020s", category: "portuguese" },
  { text: "Quem canta 'Sorriso'?", options: ["Ivandro", "Slow J", "T-Rex", "Nininho Vaz Maia"], correctAnswer: "Ivandro", decade: "2020s", category: "portuguese" },
  { text: "Quem canta 'Casa' em dueto com Buba Espinho?", options: ["D.A.M.A", "HMB", "Os Quatro e Meia", "Expresso Transatlântico"], correctAnswer: "D.A.M.A", decade: "2020s", category: "portuguese" }
];

const prepareQuestion = (q: any, idx: number, decade: Decade, category: Category): Question => {
  const shuffledOptions = shuffleArray([...q.options]);
  return {
    id: btoa(q.text + Math.random()).substring(0, 16),
    text: q.text,
    options: shuffledOptions,
    correctAnswer: q.correctAnswer,
    type: 'text',
    decade: (q.decade as Decade) || decade,
    category: (q.category as Category) || category
  };
};

export const generateQuestions = async (decade: Decade, category: Category, count: number = 20, excludeTexts: string[] = []): Promise<Question[]> => {
  // Filtragem rigorosa do catálogo local
  let candidates = localCatalog.filter(q => !excludeTexts.includes(q.text));

  if (decade !== 'all') {
    candidates = candidates.filter(q => q.decade === decade);
  }
  if (category !== 'both') {
    candidates = candidates.filter(q => q.category === category);
  }

  const apiKey = process.env.API_KEY;
  if (apiKey) {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const decadeLabel = decade === 'all' ? 'dos anos 80 até hoje' : `da década de ${decade}`;
      
      let categoryStrictInstruction = '';
      if (category === 'portuguese') {
        categoryStrictInstruction = `O tema é MÚSICA DE PORTUGAL (Artistas de Portugal). 
        EXEMPLOS PERMITIDOS (Portugal): Xutos & Pontapés, GNR, Delfins, Pedro Abrunhosa, David Fonseca, Silence 4, Sétima Legião, Rui Veloso, Da Weasel, Slow J, Ivandro, Barbara Bandeira, Dino D'Santiago, Clã, Ornatos Violeta.
        EXEMPLOS PROIBIDOS: Madonna, Queen, Anitta, Ivete Sangalo, Roberto Carlos, Michel Teló, Legião Urbana, Skank.
        REGRA: Artistas do Brasil são PROIBIDOS. Artistas internacionais são PROIBIDOS. Foca-te APENAS em Portugal.`;
      } else if (category === 'international') {
        categoryStrictInstruction = 'O tema é MÚSICA INTERNACIONAL (Global). Foca-te em sucessos mundiais. NUNCA incluas artistas de Portugal ou do Brasil.';
      } else {
        categoryStrictInstruction = 'Gera uma mistura equilibrada de artistas de Portugal e Internacionais.';
      }

      const prompt = `Gera ${count} perguntas de escolha múltipla sobre música ${decadeLabel}.
      CATEGORIA: ${categoryStrictInstruction}
      ESTRUTURA: JSON apenas.
      RESPOSTA: 4 opções, 1 correta.`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          systemInstruction: "És um historiador musical especialista em Portugal e no Mundo. Sabes distinguir Portugal de qualquer outro país. Respondes sempre com factos musicais corretos e verificados.",
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
                category: { type: Type.STRING }
              },
              required: ["text", "options", "correctAnswer", "decade", "category"]
            }
          }
        }
      });

      const data = JSON.parse(response.text || "[]");
      
      // Filtro de segurança anti-alucinação e anti-Brasil
      const validatedData = data.filter((q: any) => {
        const textLower = q.text.toLowerCase();
        const optionsLower = q.options.join(' ').toLowerCase();
        if (category === 'portuguese') {
          const forbidden = ['ivete', 'sangalo', 'brasil', 'brazil', 'anitta', 'teló', 'luan', 'sertanejo', 'pagode', 'claudia leitte'];
          if (forbidden.some(f => textLower.includes(f) || optionsLower.includes(f))) return false;
        }
        return true;
      });

      if (validatedData.length > 0) {
        const finalSet = [...validatedData, ...candidates].slice(0, count);
        return finalSet.map((q: any, i: number) => prepareQuestion(q, i, decade, category));
      }
    } catch (e) {
      console.warn("IA indisponível, recorrendo a catálogo verificado.");
    }
  }

  // Fallback seguro
  const source = candidates.length > 0 ? candidates : localCatalog;
  return shuffleArray(source)
    .slice(0, count)
    .map((q, i) => prepareQuestion(q, i, decade, category));
};
