import { Heart, Clock, ChefHat } from 'lucide-react';
import StarRating from './StarRating';
import { isFavorite, getRating } from '../utils/storageUtils';
import { useState } from 'react';

export default function RecipeCard({ recipe, onSelect, onToggleFavorite, onRate }) {
  const [favorite, setFavorite] = useState(isFavorite(recipe.id));
  const [currentRating, setCurrentRating] = useState(getRating(recipe.id));

  const handleToggleFavorite = (e) => {
    e.stopPropagation();
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
    fast: '< 30 min',
    medium: '30-60 min',
    long: '> 60 min'
  };

  return (
    <div
      onClick={() => onSelect(recipe)}
      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden group"
    >
      <div className="relative h-48 bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
        <ChefHat size={64} className="text-white opacity-30" />
        <button
          onClick={handleToggleFavorite}
          className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-lg hover:scale-110 transition-transform"
        >
          <Heart
            size={20}
            className={`${favorite ? 'fill-red-500 text-red-500' : 'text-gray-400'} transition-colors`}
          />
        </button>
        {recipe.isGenerated && (
          <span className="absolute top-3 left-3 px-3 py-1 bg-blue-500 text-white text-xs font-semibold rounded-full">
            AI Generated
          </span>
        )}
      </div>

      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-emerald-600 transition-colors">
          {recipe.name}
        </h3>

        <div className="flex flex-wrap gap-2 mb-3">
          {recipe.dietaryTags && recipe.dietaryTags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-4 mb-3 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Clock size={16} />
            <span>{cookTimeLabels[recipe.cookTime] || recipe.cookTime}</span>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${difficultyColors[recipe.difficulty]}`}>
            {recipe.difficulty}
          </span>
        </div>

        <div className="border-t pt-3 mt-3">
          <div className="flex items-center justify-between">
            <StarRating rating={currentRating} onRate={handleRate} size={18} />
            <span className="text-sm text-gray-500">{recipe.cuisine}</span>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2 mt-4 pt-4 border-t text-center">
          <div>
            <p className="text-xs text-gray-500">Calories</p>
            <p className="font-semibold text-gray-800">{recipe.nutrition.calories}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Protein</p>
            <p className="font-semibold text-gray-800">{recipe.nutrition.protein}g</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Carbs</p>
            <p className="font-semibold text-gray-800">{recipe.nutrition.carbs}g</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Fats</p>
            <p className="font-semibold text-gray-800">{recipe.nutrition.fats}g</p>
          </div>
        </div>
      </div>
    </div>
  );
}
