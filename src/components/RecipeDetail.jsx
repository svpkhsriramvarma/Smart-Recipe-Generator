import { X, Heart, Clock, ChefHat, Users } from 'lucide-react';
import StarRating from './StarRating';
import Button from './Button';
import { useState } from 'react';
import { isFavorite, getRating } from '../utils/storageUtils';

export default function RecipeDetail({ recipe, onClose, onToggleFavorite, onRate }) {
  const [servings, setServings] = useState(4);
  const [favorite, setFavorite] = useState(isFavorite(recipe.id));
  const [currentRating, setCurrentRating] = useState(getRating(recipe.id));

  const baseServings = 4;
  const multiplier = servings / baseServings;

  const handleToggleFavorite = () => {
    setFavorite(!favorite);
    onToggleFavorite(recipe);
  };

  const handleRate = (rating) => {
    setCurrentRating(rating);
    onRate(recipe.id, rating);
  };

  const difficultyColors = {
    easy: 'bg-green-100 text-green-700',
    medium: 'bg-yellow-100 text-yellow-700',
    hard: 'bg-red-100 text-red-700'
  };

  const cookTimeLabels = {
    fast: '< 30 minutes',
    medium: '30-60 minutes',
    long: '> 60 minutes'
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto my-8">
        <div className="sticky top-0 bg-gradient-to-br from-emerald-400 to-teal-500 p-6 flex items-start justify-between">
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-white mb-2">{recipe.name}</h2>
            <p className="text-emerald-50">{recipe.cuisine} Cuisine</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleToggleFavorite}
              className="p-2 bg-white rounded-full hover:scale-110 transition-transform"
            >
              <Heart
                size={24}
                className={`${favorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
              />
            </button>
            <button
              onClick={onClose}
              className="p-2 bg-white rounded-full hover:scale-110 transition-transform"
            >
              <X size={24} className="text-gray-700" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Clock size={20} className="text-emerald-600" />
                <span className="font-medium">{cookTimeLabels[recipe.cookTime]}</span>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${difficultyColors[recipe.difficulty]}`}>
                {recipe.difficulty}
              </span>
            </div>
            <StarRating rating={currentRating} onRate={handleRate} size={24} />
          </div>

          {recipe.dietaryTags && recipe.dietaryTags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {recipe.dietaryTags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-blue-50 text-blue-600 text-sm font-medium rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Nutrition Facts</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg p-4 text-center">
                <p className="text-sm text-gray-600 mb-1">Calories</p>
                <p className="text-2xl font-bold text-emerald-600">{Math.round(recipe.nutrition.calories * multiplier)}</p>
              </div>
              <div className="bg-white rounded-lg p-4 text-center">
                <p className="text-sm text-gray-600 mb-1">Protein</p>
                <p className="text-2xl font-bold text-blue-600">{Math.round(recipe.nutrition.protein * multiplier)}g</p>
              </div>
              <div className="bg-white rounded-lg p-4 text-center">
                <p className="text-sm text-gray-600 mb-1">Carbs</p>
                <p className="text-2xl font-bold text-yellow-600">{Math.round(recipe.nutrition.carbs * multiplier)}g</p>
              </div>
              <div className="bg-white rounded-lg p-4 text-center">
                <p className="text-sm text-gray-600 mb-1">Fats</p>
                <p className="text-2xl font-bold text-orange-600">{Math.round(recipe.nutrition.fats * multiplier)}g</p>
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <ChefHat size={24} className="text-emerald-600" />
                Ingredients
              </h3>
              <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-4 py-2">
                <Users size={20} className="text-gray-600" />
                <button
                  onClick={() => setServings(Math.max(1, servings - 1))}
                  className="px-3 py-1 bg-white rounded hover:bg-gray-100 font-bold"
                >
                  -
                </button>
                <span className="font-bold w-8 text-center">{servings}</span>
                <button
                  onClick={() => setServings(servings + 1)}
                  className="px-3 py-1 bg-white rounded hover:bg-gray-100 font-bold"
                >
                  +
                </button>
              </div>
            </div>
            <ul className="space-y-2">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index} className="flex items-start gap-3 bg-gray-50 p-3 rounded-lg">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span className="text-gray-700">{ingredient}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Instructions</h3>
            <ol className="space-y-4">
              {recipe.steps.map((step, index) => (
                <li key={index} className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold">
                    {index + 1}
                  </span>
                  <p className="text-gray-700 pt-1">{step}</p>
                </li>
              ))}
            </ol>
          </div>

          <div className="border-t pt-6 flex justify-end">
            <Button onClick={onClose}>Close</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
