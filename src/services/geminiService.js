import recipesData from '../data/recipesData.json';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

export const generateRecipesWithGemini = async (ingredients, dietaryPreferences, filters) => {
  if (!GEMINI_API_KEY) {
    console.warn('Gemini API key not found, using fallback recipes');
    return getFallbackRecipes(ingredients, dietaryPreferences, filters);
  }

  try {
    const prompt = buildPrompt(ingredients, dietaryPreferences, filters);

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2048,
        }
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!generatedText) {
      throw new Error('No content generated');
    }

    const recipes = parseGeminiResponse(generatedText);
    return recipes.length > 0 ? recipes : getFallbackRecipes(ingredients, dietaryPreferences, filters);

  } catch (error) {
    console.error('Gemini API Error:', error);
    return getFallbackRecipes(ingredients, dietaryPreferences, filters);
  }
};

const buildPrompt = (ingredients, dietaryPreferences, filters) => {
  const ingredientsList = ingredients.join(', ');
  const dietaryList = dietaryPreferences.length > 0 ? dietaryPreferences.join(', ') : 'none';
  const difficultyText = filters.difficulty !== 'all' ? filters.difficulty : 'any difficulty';
  const cookTimeText = filters.cookTime !== 'all' ? filters.cookTime : 'any cook time';

  return `Generate 3 unique recipes using these ingredients: ${ingredientsList}

Requirements:
- Dietary preferences: ${dietaryList}
- Difficulty level: ${difficultyText}
- Cook time: ${cookTimeText}

For each recipe, provide the response in this EXACT JSON format:
{
  "recipes": [
    {
      "name": "Recipe Name",
      "ingredients": ["ingredient 1", "ingredient 2", "..."],
      "steps": ["step 1", "step 2", "..."],
      "nutrition": {
        "calories": 300,
        "protein": 20,
        "carbs": 40,
        "fats": 10
      },
      "difficulty": "easy|medium|hard",
      "cookTime": "fast|medium|long",
      "cuisine": "cuisine type"
    }
  ]
}

Important:
- Include all provided ingredients in the recipes
- Provide realistic nutritional values
- Give clear, step-by-step cooking instructions
- Make sure recipes match the dietary preferences
- Return ONLY valid JSON, no additional text`;
};

const parseGeminiResponse = (text) => {
  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in response');
    }

    const parsed = JSON.parse(jsonMatch[0]);

    if (!parsed.recipes || !Array.isArray(parsed.recipes)) {
      throw new Error('Invalid recipe format');
    }

    return parsed.recipes.map((recipe, index) => ({
      id: Date.now() + index,
      name: recipe.name || 'Unnamed Recipe',
      ingredients: recipe.ingredients || [],
      steps: recipe.steps || [],
      nutrition: {
        calories: recipe.nutrition?.calories || 0,
        protein: recipe.nutrition?.protein || 0,
        carbs: recipe.nutrition?.carbs || 0,
        fats: recipe.nutrition?.fats || 0,
      },
      difficulty: recipe.difficulty || 'medium',
      cookTime: recipe.cookTime || 'medium',
      cuisine: recipe.cuisine || 'International',
      dietaryTags: [],
      isGenerated: true
    }));

  } catch (error) {
    console.error('Parse Error:', error);
    return [];
  }
};

const getFallbackRecipes = (ingredients, dietaryPreferences, filters) => {
  let filtered = [...recipesData];

  if (ingredients.length > 0) {
    filtered = filtered.filter(recipe => {
      const recipeIngredients = recipe.ingredients.map(i => i.toLowerCase());
      return ingredients.some(ing =>
        recipeIngredients.some(recIng =>
          recIng.includes(ing.toLowerCase()) || ing.toLowerCase().includes(recIng)
        )
      );
    });
  }

  if (dietaryPreferences.length > 0) {
    filtered = filtered.filter(recipe =>
      dietaryPreferences.some(pref =>
        recipe.dietaryTags.includes(pref.toLowerCase())
      )
    );
  }

  if (filters.difficulty !== 'all') {
    filtered = filtered.filter(recipe => recipe.difficulty === filters.difficulty);
  }

  if (filters.cookTime !== 'all') {
    filtered = filtered.filter(recipe => recipe.cookTime === filters.cookTime);
  }

  return filtered.slice(0, 6);
};
