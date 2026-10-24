
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json({ limit: "2mb" }));

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error("Missing GEMINI_API_KEY in server/.env");
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey });
const MODEL = "gemini-3.8-flash";

// Generate text with automatic retries for temporary Gemini errors.
async function generateText(prompt: string): Promise<string> {
  const maxAttempts = 3;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model: MODEL,
        contents: prompt,
      });

      const text = response.text?.trim();

      if (!text) {
        throw new Error("Gemini returned an empty response.");
      }

      return text;
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : String(error);

      const status =
        typeof error === "object" &&
        error !== null &&
        "status" in error
          ? (error as { status?: number }).status
          : undefined;

      const isTemporary =
        status === 429 ||
        status === 500 ||
        status === 502 ||
        status === 503 ||
        status === 504 ||
        /high demand|unavailable|overloaded|rate limit|try again later/i.test(
          message
        );

      if (!isTemporary || attempt === maxAttempts) {
        console.error(
          `Gemini request failed on attempt ${attempt}/${maxAttempts}:`,
          message
        );
        throw error;
      }

      const delayMs = attempt * 2000;

      console.warn(
        `Gemini temporarily unavailable. Retrying in ${
          delayMs / 1000
        } seconds (attempt ${attempt + 1}/${maxAttempts})...`
      );

      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }

  throw new Error("Gemini request failed after all retry attempts.");
}

function getString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function parseJson<T>(text: string): T {
  const cleaned = text
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "")
    .trim();

  return JSON.parse(cleaned) as T;
}

// Health check
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "StoryVerse AI backend",
  });
});

// Continue a story manuscript
app.post("/api/continue-story", async (req, res) => {
  try {
    const manuscript = getString(req.body?.manuscript);
    const genre = getString(req.body?.genre, "Fiction");
    const plotSummary = getString(req.body?.plotSummary);

    if (!manuscript.trim()) {
      res.status(400).json({
        error: "Please provide some manuscript text.",
      });
      return;
    }

    const prompt = `
You are StoryVerse AI, a creative writing assistant.

Continue the writer's manuscript naturally.
Do not repeat the existing text.
Maintain the established characters, voice, tone, continuity, and point of view.
Do not resolve major mysteries or plotlines too quickly.
Write approximately 300-500 words.

Genre: ${genre}
Plot summary: ${plotSummary || "Not provided"}

Existing manuscript:
${manuscript}

Return only the continuation of the story.
`;

    const continuation = await generateText(prompt);

    res.json({ continuation });
  } catch (error) {
    console.error("Continue-story error:", error);
    res.status(500).json({
      error: "Could not continue the story. Please try again.",
    });
  }
});

// Generate character dialogue
app.post("/api/generate-dialogue", async (req, res) => {
  try {
    const characterName = getString(req.body?.characterName);
    const characterPersonality = getString(
      req.body?.characterPersonality
    );
    const sceneContext = getString(req.body?.sceneContext);
    const previousDialogue = getString(req.body?.previousDialogue);

    if (!characterName.trim() || !sceneContext.trim()) {
      res.status(400).json({
        error: "Character name and scene context are required.",
      });
      return;
    }

    const prompt = `
You are a dialogue-writing assistant for StoryVerse AI.

Write natural, distinctive dialogue for this character.
Reflect the character's personality, emotional state, and circumstances.
Avoid generic dialogue and unnecessary exposition.

Character: ${characterName}
Personality: ${characterPersonality || "Not specified"}
Scene context: ${sceneContext}
Previous dialogue:
${previousDialogue || "No previous dialogue"}

Return only the new dialogue, without analysis.
`;

    const dialogue = await generateText(prompt);

    res.json({ dialogue });
  } catch (error) {
    console.error("Generate-dialogue error:", error);
    res.status(500).json({
      error: "Could not generate dialogue. Please try again.",
    });
  }
});

// Suggest alternative story directions
app.post("/api/suggest-alternatives", async (req, res) => {
  try {
    const storyTitle = getString(req.body?.storyTitle);
    const plotSummary = getString(req.body?.plotSummary);
    const currentBranchPoint = getString(
      req.body?.currentBranchPoint
    );

    if (!currentBranchPoint.trim()) {
      res.status(400).json({
        error: "Please describe the point where the story branches.",
      });
      return;
    }

    const prompt = `
You are StoryVerse AI, a story-possibility explorer.

Suggest exactly three meaningfully different directions the story
could take from the branch point below.

Each option should be specific, dramatically interesting, and consistent
with the information provided. Do not force a happy ending.

Story title: ${storyTitle || "Untitled"}
Plot summary: ${plotSummary || "Not provided"}
Branch point: ${currentBranchPoint}

Return valid JSON only in this format:
{
  "alternatives": [
    "First possible direction",
    "Second possible direction",
    "Third possible direction"
  ]
}
`;

    const parsed = parseJson<{ alternatives: string[] }>(
      await generateText(prompt)
    );

    res.json({ alternatives: parsed.alternatives });
  } catch (error) {
    console.error("Suggest-alternatives error:", error);
    res.status(500).json({
      error: "Could not suggest alternatives. Please try again.",
    });
  }
});

// Analyse a character's backstory
app.post("/api/analyse-character", async (req, res) => {
  try {
    const backstory = getString(req.body?.backstory);

    if (!backstory.trim()) {
      res.status(400).json({
        error: "Please provide a character backstory.",
      });
      return;
    }

    const prompt = `
You are StoryVerse AI, a character-development assistant.

Analyse the character backstory and suggest believable personality traits
and one useful motivation idea. Base your analysis only on the supplied text.

Backstory:
${backstory}

Return valid JSON only:
{
  "traits": ["trait 1", "trait 2", "trait 3", "trait 4"],
  "motivationSuggestion": "A specific motivation suggestion"
}
`;

    const result = parseJson<{
      traits: string[];
      motivationSuggestion: string;
    }>(await generateText(prompt));

    res.json(result);
  } catch (error) {
    console.error("Analyse-character error:", error);
    res.status(500).json({
      error: "Could not analyse the character. Please try again.",
    });
  }
});

// Generate a character's visual description and image prompt
app.post("/api/visualize-character", async (req, res) => {
  try {
    const name = getString(req.body?.name, "Unnamed character");
    const age = req.body?.age;
    const role = getString(req.body?.role);
    const appearance = getString(req.body?.appearance);
    const personality = getString(req.body?.personality);
    const backstory = getString(req.body?.backstory);
    const motivation = getString(req.body?.motivation);
    const quirks = getString(req.body?.quirks);

    const prompt = `
You are StoryVerse AI's character visualization assistant.

Create a vivid, consistent visual concept for a fictional character.
Use the writer's details as the source of truth. Do not invent contradictory
physical features or unnecessary backstory.

Character name: ${name}
Age: ${age ?? "Not specified"}
Role: ${role || "Not specified"}
Appearance: ${appearance || "Not specified"}
Personality: ${personality || "Not specified"}
Backstory: ${backstory || "Not specified"}
Motivation: ${motivation || "Not specified"}
Quirks: ${quirks || "Not specified"}

Return valid JSON only in this format:
{
  "visualDescription": "A vivid description of the character's appearance, clothing, expression, posture, and overall visual presence.",
  "imagePrompt": "A detailed image-generation prompt depicting this character. Include appearance, clothing, pose, lighting, setting, and visual style."
}

Keep the visual description useful to a writer and the image prompt ready
to use with an image-generation model.
`;

    const result = parseJson<{
      visualDescription: string;
      imagePrompt: string;
    }>(await generateText(prompt));

    if (!result.visualDescription || !result.imagePrompt) {
      throw new Error(
        "Gemini returned incomplete character visualization."
      );
    }

    res.json(result);
  } catch (error) {
    console.error("Character visualization error:", error);
    res.status(500).json({
      error: "Could not visualize this character. Please try again.",
    });
  }
});

// Generate a scene's visual description and image prompt
app.post("/api/visualize-scene", async (req, res) => {
  try {
    const sceneDescription = getString(req.body?.sceneDescription);
    const title = getString(req.body?.title);
    const genre = getString(req.body?.genre);
    const mood = getString(req.body?.mood);
    const location = getString(req.body?.location);
    const characters = getString(req.body?.characters);

    if (!sceneDescription.trim()) {
      res.status(400).json({
        error: "Please provide a scene description.",
      });
      return;
    }

    const prompt = `
You are StoryVerse AI's scene visualization assistant.

Translate the writer's scene into a vivid cinematic visual concept.
Preserve the story details and do not change the events.

Story title: ${title || "Untitled"}
Genre: ${genre || "Not specified"}
Mood: ${mood || "Not specified"}
Location: ${location || "Not specified"}
Characters present: ${characters || "Not specified"}

Scene description:
${sceneDescription}

Return valid JSON only in this format:
{
  "visualDescription": "A cinematic description of the scene's composition, environment, lighting, atmosphere, character positions, and visual details.",
  "imagePrompt": "A detailed image-generation prompt for this scene, ready to use with an image-generation model."
}
`;

    const result = parseJson<{
      visualDescription: string;
      imagePrompt: string;
    }>(await generateText(prompt));

    if (!result.visualDescription || !result.imagePrompt) {
      throw new Error(
        "Gemini returned incomplete scene visualization."
      );
    }

    res.json(result);
  } catch (error) {
    console.error("Scene visualization error:", error);
    res.status(500).json({
      error: "Could not visualize this scene. Please try again.",
    });
  }
});

// Start the backend
app.listen(PORT, () => {
  console.log(
    `StoryVerse AI backend running at http://localhost:${PORT}`
  );
});
