import RecipeCard from './RecipeCard';

export default function RecipeList({ recipes, onSelectRecipe, onToggleFavorite, onRate, emptyMessage }) {
  if (recipes.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-xl text-gray-500">{emptyMessage || 'No recipes found'}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {recipes.map((recipe) => (
        <RecipeCard
          key={recipe.id}
          recipe={recipe}
          onSelect={onSelectRecipe}
          onToggleFavorite={onToggleFavorite}
          onRate={onRate}
        />
      ))}
    </div>
  );
}
