
interface AIResponse<T> {
  data: T | null;
  error: string | null;
  isPlaceholder: boolean;
}

interface GenerateDialogueOptions {
  characterName: string;
  characterPersonality: string;
  sceneContext: string;
  previousDialogue: string;
}

interface SuggestAlternativesOptions {
  storyTitle: string;
  plotSummary: string;
  currentBranchPoint: string;
}

export interface CharacterVisualizationOptions {
  name: string;
  age: number | null;
  role: string;
  appearance: string;
  personality: string;
  backstory: string;
  motivation: string;
  quirks: string;
}

export interface CharacterVisualizationResult {
  visualDescription: string;
  imagePrompt: string;
}

export interface SceneVisualizationOptions {
  sceneDescription: string;
  title?: string;
  genre?: string;
  mood?: string;
  location?: string;
  characters?: string;
}

export interface SceneVisualizationResult {
  visualDescription: string;
  imagePrompt: string;
}

export interface CharacterImageResult {
  imageData: string;
  mimeType: string;
}

const API_BASE = "http://localhost:3001/api";

async function postToAI<T>(
  endpoint: string,
  body: unknown
): Promise<AIResponse<T>> {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        typeof result.error === "string"
          ? result.error
          : "The AI request failed."
      );
    }

    return {
      data: result as T,
      error: null,
      isPlaceholder: false,
    };
  } catch (error) {
    return {
      data: null,
      error:
        error instanceof Error
          ? error.message
          : "Could not connect to StoryVerse AI.",
      isPlaceholder: false,
    };
  }
}

export async function continueManuscript(
  existingText: string,
  genre: string,
  plotSummary: string
): Promise<AIResponse<string>> {
  const result = await postToAI<{ continuation: string }>(
    "/continue-story",
    {
      manuscript: existingText,
      genre,
      plotSummary,
    }
  );

  return {
    data: result.data?.continuation ?? null,
    error: result.error,
    isPlaceholder: false,
  };
}

export async function generateDialogue(
  options: GenerateDialogueOptions
): Promise<AIResponse<string>> {
  const result = await postToAI<{ dialogue: string }>(
    "/generate-dialogue",
    options
  );

  return {
    data: result.data?.dialogue ?? null,
    error: result.error,
    isPlaceholder: false,
  };
}

export async function suggestAlternatives(
  options: SuggestAlternativesOptions
): Promise<AIResponse<string[]>> {
  const result = await postToAI<{ alternatives: string[] }>(
    "/suggest-alternatives",
    options
  );

  return {
    data: result.data?.alternatives ?? null,
    error: result.error,
    isPlaceholder: false,
  };
}

export async function analyseCharacter(
  backstory: string
): Promise<
  AIResponse<{ traits: string[]; motivationSuggestion: string }>
> {
  return postToAI("/analyse-character", { backstory });
}

export async function visualizeCharacter(
  options: CharacterVisualizationOptions
): Promise<AIResponse<CharacterVisualizationResult>> {
  return postToAI("/visualize-character", options);
}

export async function visualizeScene(
  options: SceneVisualizationOptions
): Promise<AIResponse<SceneVisualizationResult>> {
  return postToAI("/visualize-scene", options);
}

export async function generateCharacterImage(
  imagePrompt: string
): Promise<AIResponse<CharacterImageResult>> {
  return postToAI("/generate-character-image", { imagePrompt });
}
