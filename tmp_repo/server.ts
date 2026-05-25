import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

let aiClient: GoogleGenAI | null = null;

function getAI() {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY environment variable is required");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route: Evaluate Hunter
  app.post("/api/oraculo", async (req, res) => {
    try {
      const { level, rank, pClass, stats, gold } = req.body;
      const ai = getAI();
      const prompt = `Analise o seguinte caçador do seu sistema: 
Nome: Sung Jin-Woo (Jogador). 
Nível atual: ${level}. 
Rank Estimado: ${rank}. 
Classe atual: ${pClass || 'Nenhuma'}. 
Atributos -> Força: ${stats.str}, Agilidade: ${stats.agi}, Vitalidade: ${stats.vit}, Inteligência: ${stats.int}. 
Ouro acumulado: ${gold}.

Com base nestes dados precisos, escreva um relatório de avaliação curto (máximo de 2 parágrafos) do ponto de vista do "Sistema". Indique se os atributos dele estão balanceados. Não hesite em zombar se ele for fraco, ou reverenciá-lo (de forma contida) se ele já tiver atingido a Ascensão Divina (Deus Monarca/Estelar).`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: "Você é o 'Sistema' implacável e onisciente do universo de Solo Leveling. Você observa o caçador. Fale diretamente com o jogador em português. Seja analítico, impiedoso, levemente arrogante, mas misterioso e épico. Use terminologias de RPG cósmico (mana, fendas, monarcas, estelar). Responda sempre formatado de forma limpa e muito concisa."
        }
      });

      res.json({ text: response.text });
    } catch (err: any) {
      console.error("Oraculo error:", err);
      res.status(500).json({ error: err.message || "Failed to communicate with Gemini" });
    }
  });

  // API Route: Item Lore / Aura Reads
  app.post("/api/aura", async (req, res) => {
    try {
      const { itemName, itemRank } = req.body;
      const ai = getAI();
      const prompt = `Crie uma história de origem épica, misteriosa e curta (exatamente 2 frases) para o item/artefato "${itemName}" de Rank "${itemRank}". Descreva sua aura destrutiva ou que tipo de criatura ancestral o forjou. Responda do ponto de vista do Sistema.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: "Você é o 'Sistema' implacável e onisciente do universo de Solo Leveling. Você observa o caçador. Fale diretamente com o jogador em português. Seja analítico, impiedoso, levemente arrogante, mas misterioso e épico. Use terminologias de RPG cósmico (mana, fendas, monarcas, estelar). Responda sempre formatado de forma limpa e muito concisa."
        }
      });

      res.json({ text: response.text });
    } catch (err: any) {
      console.error("Aura error:", err);
      res.status(500).json({ error: err.message || "Failed to communicate with Gemini" });
    }
  });

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Serve static UI through Vite in development, or Express static in production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
