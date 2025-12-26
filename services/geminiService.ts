
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

// Catálogo Local Massivo Organizado por Décadas
// Nota: Estruturado para máxima cobertura offline
const localCatalog: Omit<Question, 'id' | 'type'>[] = [
  // --- ANOS 80 INTERNACIONAL ---
  { text: "Quem lançou o álbum 'Thriller' em 1982?", options: ["Michael Jackson", "Prince", "Madonna", "Mick Jagger"], correctAnswer: "Michael Jackson", decade: "80s", category: "international" },
  { text: "Qual destes artistas é conhecido como 'The Boss'?", options: ["Bruce Springsteen", "Elvis Presley", "Bono", "David Bowie"], correctAnswer: "Bruce Springsteen", decade: "80s", category: "international" },
  { text: "Quem gravou 'Like a Prayer'?", options: ["Madonna", "Janet Jackson", "Whitney Houston", "Paula Abdul"], correctAnswer: "Madonna", decade: "80s", category: "international" },
  { text: "Qual banda gravou 'Back in Black' em 1980?", options: ["AC/DC", "Led Zeppelin", "Guns N' Roses", "Iron Maiden"], correctAnswer: "AC/DC", decade: "80s", category: "international" },
  { text: "Quem canta 'Purple Rain'?", options: ["Prince", "George Michael", "Lionel Richie", "Rick James"], correctAnswer: "Prince", decade: "80s", category: "international" },
  { text: "Qual banda é famosa pelo tema 'The Final Countdown'?", options: ["Europe", "Scorpions", "Van Halen", "Bon Jovi"], correctAnswer: "Europe", decade: "80s", category: "international" },
  { text: "Qual o vocalista dos Queen que faleceu em 1991?", options: ["Freddie Mercury", "Brian May", "Roger Taylor", "John Deacon"], correctAnswer: "Freddie Mercury", decade: "80s", category: "international" },
  { text: "Qual álbum dos Pink Floyd foi lançado em 1979 mas dominou os 80s?", options: ["The Wall", "Dark Side", "Animals", "Wish You Were Here"], correctAnswer: "The Wall", decade: "80s", category: "international" },
  { text: "Quem canta 'Careless Whisper'?", options: ["George Michael", "Boy George", "Elton John", "Phil Collins"], correctAnswer: "George Michael", decade: "80s", category: "international" },
  { text: "Qual banda lançou 'The Joshua Tree'?", options: ["U2", "R.E.M.", "The Police", "The Smiths"], correctAnswer: "U2", decade: "80s", category: "international" },
  { text: "Quem é a 'Rainha do Pop'?", options: ["Madonna", "Cyndi Lauper", "Tina Turner", "Cher"], correctAnswer: "Madonna", decade: "80s", category: "international" },
  { text: "Qual banda de heavy metal lançou 'Master of Puppets'?", options: ["Metallica", "Megadeth", "Slayer", "Anthrax"], correctAnswer: "Metallica", decade: "80s", category: "international" },
  { text: "Quem gravou 'Another Brick in the Wall'?", options: ["Pink Floyd", "The Who", "Yes", "Genesis"], correctAnswer: "Pink Floyd", decade: "80s", category: "international" },
  { text: "Qual o hit de 1985 de Tina Turner?", options: ["Simply the Best", "What's Love Got to Do with It", "Private Dancer", "We Don't Need Another Hero"], correctAnswer: "Simply the Best", decade: "80s", category: "international" },

  // --- ANOS 80 PORTUGUÊS ---
  { text: "Qual é a banda portuguesa de 'A Minha Casinha'?", options: ["Xutos & Pontapés", "GNR", "UHF", "Sétima Legião"], correctAnswer: "Xutos & Pontapés", decade: "80s", category: "portuguese" },
  { text: "Quem canta o sucesso 'Playback' em 1981?", options: ["Carlos Paião", "Dina", "Lara Li", "Doce"], correctAnswer: "Carlos Paião", decade: "80s", category: "portuguese" },
  { text: "Qual banda portuguesa lançou 'Sete Mares'?", options: ["Sétima Legião", "Madredeus", "GNR", "Trovante"], correctAnswer: "Sétima Legião", decade: "80s", category: "portuguese" },
  { text: "Qual o hit de Rui Veloso de 1980?", options: ["Chico Fininho", "Porto Sentido", "Lado Lunar", "Não Há Estrelas No Céu"], correctAnswer: "Chico Fininho", decade: "80s", category: "portuguese" },
  { text: "Qual banda de Coimbra cantava 'Cavalos de Corrida'?", options: ["UHF", "Xutos & Pontapés", "GNR", "Táxi"], correctAnswer: "UHF", decade: "80s", category: "portuguese" },
  { text: "Qual o nome do grupo feminino de 'Bem Bom'?", options: ["Doce", "Cocktail", "Tentações", "Delirium"], correctAnswer: "Doce", decade: "80s", category: "portuguese" },
  { text: "Quem é o autor de 'O Corpo é que Paga'?", options: ["António Variações", "Heróis do Mar", "Carlos Paião", "Paulo de Carvalho"], correctAnswer: "António Variações", decade: "80s", category: "portuguese" },
  { text: "Qual a banda de 'Dunas'?", options: ["GNR", "Xutos", "Heróis do Mar", "Delfins"], correctAnswer: "GNR", decade: "80s", category: "portuguese" },
  { text: "Quem canta 'Amanhã de Manhã'?", options: ["Doce", "Carlos Paião", "Lara Li", "Lena d'Água"], correctAnswer: "Doce", decade: "80s", category: "portuguese" },
  { text: "Qual banda lançou o icónico 'Amor'?", options: ["Heróis do Mar", "GNR", "Rádio Macau", "Sétima Legião"], correctAnswer: "Heróis do Mar", decade: "80s", category: "portuguese" },

  // --- ANOS 90 INTERNACIONAL ---
  { text: "Qual banda lançou 'Smells Like Teen Spirit' em 1991?", options: ["Nirvana", "Pearl Jam", "Soundgarden", "Alice in Chains"], correctAnswer: "Nirvana", decade: "90s", category: "international" },
  { text: "Quem canta o hit 'Baby One More Time'?", options: ["Britney Spears", "Christina Aguilera", "Jessica Simpson", "Mandy Moore"], correctAnswer: "Britney Spears", decade: "90s", category: "international" },
  { text: "Qual banda britânica lançou 'Wonderwall'?", options: ["Oasis", "Blur", "Pulp", "Radiohead"], correctAnswer: "Oasis", decade: "90s", category: "international" },
  { text: "Qual o nome do álbum de Alanis Morissette de 1995?", options: ["Jagged Little Pill", "Supposed Former", "Under Rug Swept", "Flavors of Entanglement"], correctAnswer: "Jagged Little Pill", decade: "90s", category: "international" },
  { text: "Quem gravou 'I Will Always Love You'?", options: ["Whitney Houston", "Mariah Carey", "Celine Dion", "Toni Braxton"], correctAnswer: "Whitney Houston", decade: "90s", category: "international" },
  { text: "Qual o hit de 1996 das Spice Girls?", options: ["Wannabe", "Say You'll Be There", "2 Become 1", "Stop"], correctAnswer: "Wannabe", decade: "90s", category: "international" },
  { text: "Qual banda de rap lançou 'Enter the Wu-Tang'?", options: ["Wu-Tang Clan", "N.W.A", "Public Enemy", "Outkast"], correctAnswer: "Wu-Tang Clan", decade: "90s", category: "international" },
  { text: "Quem canta 'Losing My Religion'?", options: ["R.E.M.", "U2", "The Cure", "The Smiths"], correctAnswer: "R.E.M.", decade: "90s", category: "international" },
  { text: "Qual banda alemã lançou 'Wind of Change'?", options: ["Scorpions", "Rammstein", "Helloween", "Blind Guardian"], correctAnswer: "Scorpions", decade: "90s", category: "international" },
  { text: "Quem gravou 'My Heart Will Go On'?", options: ["Celine Dion", "Whitney Houston", "Mariah Carey", "Shania Twain"], correctAnswer: "Celine Dion", decade: "90s", category: "international" },

  // --- ANOS 90 PORTUGUÊS ---
  { text: "Qual é o nome da vocalista dos The Gift?", options: ["Sónia Tavares", "Aurea", "Mariza", "Ana Bacalhau"], correctAnswer: "Sónia Tavares", decade: "90s", category: "portuguese" },
  { text: "Qual banda portuguesa canta 'Pronúncia do Norte'?", options: ["GNR", "Xutos & Pontapés", "UHF", "Delfins"], correctAnswer: "GNR", decade: "90s", category: "portuguese" },
  { text: "Quem lançou o álbum 'Viagens' em 1994?", options: ["Pedro Abrunhosa", "Jorge Palma", "Rui Veloso", "Paulo Gonzo"], correctAnswer: "Pedro Abrunhosa", decade: "90s", category: "portuguese" },
  { text: "Qual banda de David Fonseca lançou 'Silence Becomes It'?", options: ["Silence 4", "The Gift", "Wraygunn", "The Legendary Tigerman"], correctAnswer: "Silence 4", decade: "90s", category: "portuguese" },
  { text: "Qual o hit dos Delfins de 1996?", options: ["Sou Como Um Boneco", "Nasce Selvagem", "A Queda de um Anjo", "Baía de Cascais"], correctAnswer: "Sou Como Um Boneco", decade: "90s", category: "portuguese" },
  { text: "Quem canta 'Jardins Proibidos'?", options: ["Paulo Gonzo", "Pedro Abrunhosa", "João Pedro Pais", "André Sardet"], correctAnswer: "Paulo Gonzo", decade: "90s", category: "portuguese" },
  { text: "Qual banda lançou 'O Monstro Precisa de Amigos'?", options: ["Ornatos Violeta", "The Gift", "Clã", "Mão Morta"], correctAnswer: "Ornatos Violeta", decade: "90s", category: "portuguese" },
  { text: "Quem canta 'Não Sou O Único'?", options: ["Xutos & Pontapés", "UHF", "Resistência", "GNR"], correctAnswer: "Xutos & Pontapés", decade: "90s", category: "portuguese" },
  { text: "Qual o grupo de 'Nasce Selvagem'?", options: ["Delfins", "Santos & Pecadores", "Pólo Norte", "Ex-Votos"], correctAnswer: "Delfins", decade: "90s", category: "portuguese" },

  // --- ANOS 00 INTERNACIONAL ---
  { text: "Qual banda britânica é liderada por Chris Martin?", options: ["Coldplay", "Muse", "Radiohead", "Keane"], correctAnswer: "Coldplay", decade: "00s", category: "international" },
  { text: "Qual artista pop lançou 'Poker Face'?", options: ["Lady Gaga", "Katy Perry", "Britney Spears", "Rihanna"], correctAnswer: "Lady Gaga", decade: "00s", category: "international" },
  { text: "Quem gravou 'Crazy in Love' em 2003?", options: ["Beyoncé", "Rihanna", "Alicia Keys", "Ciara"], correctAnswer: "Beyoncé", decade: "00s", category: "international" },
  { text: "Qual banda lançou 'Mr. Brightside'?", options: ["The Killers", "The Strokes", "Arctic Monkeys", "Franz Ferdinand"], correctAnswer: "The Killers", decade: "00s", category: "international" },
  { text: "Quem canta 'Umbrella'?", options: ["Rihanna", "Beyoncé", "Fergie", "Nelly Furtado"], correctAnswer: "Rihanna", decade: "00s", category: "international" },
  { text: "Qual banda lançou o álbum 'Hybrid Theory'?", options: ["Linkin Park", "Limp Bizkit", "Evanescence", "Korn"], correctAnswer: "Linkin Park", decade: "00s", category: "international" },
  { text: "Quem gravou 'Hips Don't Lie'?", options: ["Shakira", "Jennifer Lopez", "Paulina Rubio", "Thalia"], correctAnswer: "Shakira", decade: "00s", category: "international" },
  { text: "Qual banda lançou 'Seven Nation Army'?", options: ["The White Stripes", "The Black Keys", "The Vines", "The Hives"], correctAnswer: "The White Stripes", decade: "00s", category: "international" },
  { text: "Quem canta 'Toxic'?", options: ["Britney Spears", "Madonna", "Kylie Minogue", "Gwen Stefani"], correctAnswer: "Britney Spears", decade: "00s", category: "international" },
  { text: "Qual rapper lançou 'Lose Yourself'?", options: ["Eminem", "Jay-Z", "50 Cent", "Kanye West"], correctAnswer: "Eminem", decade: "00s", category: "international" },

  // --- ANOS 00 PORTUGUÊS ---
  { text: "Qual banda portuguesa canta 'Re-Tratamento'?", options: ["Da Weasel", "Expensive Soul", "Mind da Gap", "Dealema"], correctAnswer: "Da Weasel", decade: "00s", category: "portuguese" },
  { text: "Qual o nome da dupla por trás de 'Chaka Khan'?", options: ["Expensive Soul", "Mind da Gap", "Dealema", "Orelha Negra"], correctAnswer: "Expensive Soul", decade: "00s", category: "portuguese" },
  { text: "Qual projeto de fado eletrónico de 2004?", options: ["A Naifa", "Hoje", "Deolinda", "OqueStrada"], correctAnswer: "A Naifa", decade: "00s", category: "portuguese" },
  { text: "Qual artista luso-canadiana lançou 'Loose'?", options: ["Nelly Furtado", "Aurea", "Lura", "Ana Free"], correctAnswer: "Nelly Furtado", decade: "00s", category: "portuguese" },
  { text: "Quem canta 'Mentira'?", options: ["João Pedro Pais", "André Sardet", "David Fonseca", "Tiago Bettencourt"], correctAnswer: "João Pedro Pais", decade: "00s", category: "portuguese" },
  { text: "Qual a banda de 'Movimento Perpétuo Associativo'?", options: ["Deolinda", "Diabo na Cruz", "Amor Electro", "Os Pontos Negros"], correctAnswer: "Deolinda", decade: "00s", category: "portuguese" },
  { text: "Quem canta 'Para Ti Maria'?", options: ["Xutos & Pontapés", "GNR", "UHF", "Rui Veloso"], correctAnswer: "Xutos & Pontapés", decade: "00s", category: "portuguese" },
  { text: "Qual o hit de 2001 dos Santamaria?", options: ["Castelos de Areia", "Falésia do Amor", "Eu Sei Tu És", "Let's Go To Party"], correctAnswer: "Castelos de Areia", decade: "00s", category: "portuguese" },

  // --- ANOS 10 INTERNACIONAL ---
  { text: "Quem canta 'Rolling in the Deep'?", options: ["Adele", "Rihanna", "Beyoncé", "Lady Gaga"], correctAnswer: "Adele", decade: "2010s", category: "international" },
  { text: "Quem canta 'Shape of You'?", options: ["Ed Sheeran", "Sam Smith", "Harry Styles", "Shawn Mendes"], correctAnswer: "Ed Sheeran", decade: "2010s", category: "international" },
  { text: "Qual artista é conhecido pela música 'Bad Guy'?", options: ["Billie Eilish", "Lorde", "Halsey", "Olivia Rodrigo"], correctAnswer: "Billie Eilish", decade: "2010s", category: "international" },
  { text: "Quem gravou 'Uptown Funk'?", options: ["Mark Ronson ft. Bruno Mars", "Pharrell Williams", "Justin Timberlake", "Daft Punk"], correctAnswer: "Mark Ronson ft. Bruno Mars", decade: "2010s", category: "international" },
  { text: "Qual banda lançou 'Get Lucky'?", options: ["Daft Punk", "Justice", "Phoenix", "Air"], correctAnswer: "Daft Punk", decade: "2010s", category: "international" },
  { text: "Quem canta 'Dark Horse'?", options: ["Katy Perry", "Taylor Swift", "Miley Cyrus", "Selena Gomez"], correctAnswer: "Katy Perry", decade: "2010s", category: "international" },
  { text: "Qual rapper lançou 'Old Town Road'?", options: ["Lil Nas X", "Drake", "Kendrick Lamar", "Travis Scott"], correctAnswer: "Lil Nas X", decade: "2010s", category: "international" },

  // --- ANOS 10 PORTUGUÊS ---
  { text: "Quem canta 'Amar pelos Dois'?", options: ["Salvador Sobral", "Luísa Sobral", "Tiago Iorc", "Diogo Piçarra"], correctAnswer: "Salvador Sobral", decade: "2010s", category: "portuguese" },
  { text: "Qual banda lançou o hit 'Faz Gostoso'?", options: ["Blaya", "Anitta", "Pabllo Vittar", "Ludmilla"], correctAnswer: "Blaya", decade: "2010s", category: "portuguese" },
  { text: "Qual grupo lançou 'Balada do Deserto'?", options: ["D.A.M.A", "HMB", "Átoa", "Wet Bed Gang"], correctAnswer: "D.A.M.A", decade: "2010s", category: "portuguese" },
  { text: "Quem canta 'Busy For Me'?", options: ["Aurea", "Richie Campbell", "Dengaz", "Agir"], correctAnswer: "Aurea", decade: "2010s", category: "portuguese" },
  { text: "Qual o hit de Agir em 2015?", options: ["Como Tu", "Tempo é Dinheiro", "Parte-me o Pescoço", "Manto de Água"], correctAnswer: "Parte-me o Pescoço", decade: "2010s", category: "portuguese" },
  { text: "Quem canta 'Dialectos de Ternura'?", options: ["Da Weasel", "Expensive Soul", "Capicua", "Mundo Segundo"], correctAnswer: "Da Weasel", decade: "2010s", category: "portuguese" },

  // --- ANOS 20 ---
  { text: "Quem é o artista por trás de 'Blinding Lights'?", options: ["The Weeknd", "Dua Lipa", "Harry Styles", "Ed Sheeran"], correctAnswer: "The Weeknd", decade: "2020s", category: "international" },
  { text: "Qual artista lançou 'Flowers' em 2023?", options: ["Miley Cyrus", "Taylor Swift", "Selena Gomez", "Demi Lovato"], correctAnswer: "Miley Cyrus", decade: "2020s", category: "international" },
  { text: "Qual música de Barbara Bandeira foi hit em 2023?", options: ["Como Tu", "Nós os Dois", "Finda", "Onde Vais"], correctAnswer: "Como Tu", decade: "2020s", category: "portuguese" },
  { text: "Quem canta 'Levantou Poeira'?", options: ["Ivandro", "Slow J", "Nininho Vaz Maia", "T-Rex"], correctAnswer: "Ivandro", decade: "2020s", category: "portuguese" },
  { text: "Quem lançou o álbum 'Afro Fado'?", options: ["Slow J", "Dino d'Santiago", "Plutónio", "Richie Campbell"], correctAnswer: "Slow J", decade: "2020s", category: "portuguese" },
  { text: "Qual artista britânica lançou 'Levitating'?", options: ["Dua Lipa", "Adele", "Florence Welch", "Charli XCX"], correctAnswer: "Dua Lipa", decade: "2020s", category: "international" },
  { text: "Quem canta 'Drivers License'?", options: ["Olivia Rodrigo", "Billie Eilish", "Tate McRae", "Sabrina Carpenter"], correctAnswer: "Olivia Rodrigo", decade: "2020s", category: "international" }
];

const prepareQuestion = (q: any, idx: number, decade: Decade, category: Category): Question => {
  const shuffledOptions = shuffleArray([...q.options]);
  return {
    id: btoa(q.text + Math.random()).substring(0, 16),
    text: q.text,
    options: shuffledOptions,
    correctAnswer: q.correctAnswer,
    type: 'text',
    decade: q.decade as Decade || decade,
    category: q.category as Category || category
  };
};

export const generateQuestions = async (decade: Decade, category: Category, count: number = 15, excludeTexts: string[] = []): Promise<Question[]> => {
  // Modo Offline/Híbrido Prioritário
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
      const decadeText = decade === 'all' ? 'dos anos 80 até hoje' : `dos anos ${decade}`;
      const categoryText = 
        category === 'portuguese' ? 'de artistas portugueses' :
        category === 'international' ? 'de artistas internacionais' :
        'de artistas portugueses e internacionais';
      
      const prompt = `Gera ${count} perguntas de escolha múltipla sobre música ${categoryText} ${decadeText}.
      REGRAS:
      1. Responde APENAS em JSON.
      2. 'correctAnswer' deve ser uma das opções.
      3. NÃO incluas artistas brasileiros.
      4. Foca em cultura geral e marcos históricos.`;

      const aiPromise = ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          systemInstruction: "Expert em Quiz Musical. Resposta em JSON.",
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

      const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 2500));
      const response: any = await Promise.race([aiPromise, timeoutPromise]);
      const data = JSON.parse(response.text || "[]");
      if (data.length > 0) {
        return data.map((q: any, i: number) => prepareQuestion(q, i, decade, category));
      }
    } catch (e) {
      console.warn("Gemini indisponível, usando catálogo local.");
    }
  }

  // Fallback Offline Robusto
  if (candidates.length < count) {
     candidates = localCatalog.filter(q => !excludeTexts.includes(q.text));
     if (decade !== 'all') candidates = candidates.filter(q => q.decade === decade);
  }

  const source = candidates.length >= count ? candidates : localCatalog;
  return shuffleArray(source)
    .slice(0, count)
    .map((q, i) => prepareQuestion(q, i, decade, category));
};
