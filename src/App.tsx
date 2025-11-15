import { useState, useEffect } from 'react';
import { ChefHat, Heart, Home, Sparkles } from 'lucide-react';
import IngredientInput from './components/IngredientInput';
import FilterPanel from './components/FilterPanel';
import RecipeList from './components/RecipeList';
import RecipeDetail from './components/RecipeDetail';
import FavoritesView from './components/FavoritesView';
import LoadingSpinner from './components/LoadingSpinner';
import Button from './components/Button';
import { generateRecipesWithGemini } from './services/geminiService';
import { addFavorite, removeFavorite, setRating, getRecommendations } from './utils/storageUtils';
import recipesData from './data/recipesData.json';

type View = 'home' | 'recipes' | 'favorites';

function App() {
  const [currentView, setCurrentView] = useState<View>('home');
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [dietaryPreferences, setDietaryPreferences] = useState<string[]>([]);
  const [filters, setFilters] = useState({ difficulty: 'all', cookTime: 'all' });
  const [recipes, setRecipes] = useState<any[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [favoritesRefresh, setFavoritesRefresh] = useState(0);

  useEffect(() => {
    const title = document.querySelector('title');
    if (title) {
      title.textContent = 'Smart Recipe Generator';
    }
  }, []);

  const handleGenerateRecipes = async () => {
    if (ingredients.length === 0) {
      alert('Please add at least one ingredient');
      return;
    }

    setLoading(true);
    setCurrentView('recipes');

    try {
      const generatedRecipes = await generateRecipesWithGemini(
        ingredients,
        dietaryPreferences,
        filters
      );
      setRecipes(generatedRecipes);
    } catch (error) {
      console.error('Error generating recipes:', error);
      alert('Failed to generate recipes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = (recipe: any) => {
    const favorites = JSON.parse(localStorage.getItem('recipe_favorites') || '[]');
    const exists = favorites.find((fav: any) => fav.id === recipe.id);

    if (exists) {
      removeFavorite(recipe.id);
    } else {
      addFavorite(recipe);
    }

    setFavoritesRefresh(prev => prev + 1);
  };

  const handleRate = (recipeId: number, rating: number) => {
    setRating(recipeId, rating);
  };

  const recommendations = getRecommendations(recipesData);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <nav className="bg-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ChefHat size={32} className="text-emerald-600" />
              <h1 className="text-2xl font-bold text-gray-800">Smart Recipe Generator</h1>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentView('home')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  currentView === 'home'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Home size={20} />
                <span className="hidden sm:inline">Home</span>
              </button>
              <button
                onClick={() => setCurrentView('favorites')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  currentView === 'favorites'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Heart size={20} />
                <span className="hidden sm:inline">Favorites</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {currentView === 'home' && (
          <div className="space-y-8">
            <div className="text-center space-y-4 py-8">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800">
                Discover Your Next Meal
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Enter your ingredients and let AI create delicious recipes tailored to your preferences
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Your Ingredients</h3>
                  <IngredientInput
                    ingredients={ingredients}
                    onIngredientsChange={setIngredients}
                  />
                </div>

                <div className="text-center">
                  <Button
                    onClick={handleGenerateRecipes}
                    disabled={loading || ingredients.length === 0}
                    className="text-lg px-8 py-4"
                  >
                    <Sparkles size={20} className="inline mr-2" />
                    Generate Recipes
                  </Button>
                </div>
              </div>

              <div>
                <FilterPanel
                  dietaryPreferences={dietaryPreferences}
                  onDietaryChange={setDietaryPreferences}
                  filters={filters}
                  onFilterChange={setFilters}
                />
              </div>
            </div>

            {recommendations.length > 0 && (
              <div className="mt-12">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">Recommended For You</h3>
                  <p className="text-gray-600">Based on your favorites and ratings</p>
                </div>
                <RecipeList
                  recipes={recommendations}
                  onSelectRecipe={setSelectedRecipe}
                  onToggleFavorite={handleToggleFavorite}
                  onRate={handleRate}
                  emptyMessage=""
                />
              </div>
            )}
          </div>
        )}

        {currentView === 'recipes' && (
          <div>
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Generated Recipes</h2>
              <p className="text-gray-600">
                Found {recipes.length} {recipes.length === 1 ? 'recipe' : 'recipes'} matching your criteria
              </p>
            </div>

            {loading ? (
              <LoadingSpinner message="Generating delicious recipes..." />
            ) : (
              <RecipeList
                recipes={recipes}
                onSelectRecipe={setSelectedRecipe}
                onToggleFavorite={handleToggleFavorite}
                onRate={handleRate}
                emptyMessage="No recipes found. Try adjusting your ingredients or filters."
              />
            )}
          </div>
        )}

        {currentView === 'favorites' && (
          <FavoritesView
            onSelectRecipe={setSelectedRecipe}
            onToggleFavorite={handleToggleFavorite}
            onRate={handleRate}
            refreshTrigger={favoritesRefresh}
          />
        )}
      </main>

      {selectedRecipe && (
        <RecipeDetail
          recipe={selectedRecipe}
          onClose={() => setSelectedRecipe(null)}
          onToggleFavorite={handleToggleFavorite}
          onRate={handleRate}
        />
      )}
    </div>
  );
}

export default App;
