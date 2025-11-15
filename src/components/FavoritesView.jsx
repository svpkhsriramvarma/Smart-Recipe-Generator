import { Heart } from 'lucide-react';
import RecipeList from './RecipeList';
import { useEffect, useState } from 'react';
import { getFavorites } from '../utils/storageUtils';

export default function FavoritesView({ onSelectRecipe, onToggleFavorite, onRate, refreshTrigger }) {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    setFavorites(getFavorites());
  }, [refreshTrigger]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Heart size={32} className="text-red-500 fill-red-500" />
        <div>
          <h2 className="text-3xl font-bold text-gray-800">My Favorites</h2>
          <p className="text-gray-600">
            {favorites.length} {favorites.length === 1 ? 'recipe' : 'recipes'} saved
          </p>
        </div>
      </div>

      <RecipeList
        recipes={favorites}
        onSelectRecipe={onSelectRecipe}
        onToggleFavorite={onToggleFavorite}
        onRate={onRate}
        emptyMessage="No favorite recipes yet. Start adding some from the recipe list!"
      />
    </div>
  );
}
