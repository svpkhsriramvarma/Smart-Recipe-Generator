const FAVORITES_KEY = 'recipe_favorites';
const RATINGS_KEY = 'recipe_ratings';

export const getFavorites = () => {
  try {
    const favorites = localStorage.getItem(FAVORITES_KEY);
    return favorites ? JSON.parse(favorites) : [];
  } catch (error) {
    console.error('Error getting favorites:', error);
    return [];
  }
};

export const addFavorite = (recipe) => {
  try {
    const favorites = getFavorites();
    const exists = favorites.find(fav => fav.id === recipe.id);

    if (!exists) {
      favorites.push(recipe);
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    }

    return favorites;
  } catch (error) {
    console.error('Error adding favorite:', error);
    return getFavorites();
  }
};

export const removeFavorite = (recipeId) => {
  try {
    const favorites = getFavorites();
    const filtered = favorites.filter(fav => fav.id !== recipeId);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(filtered));
    return filtered;
  } catch (error) {
    console.error('Error removing favorite:', error);
    return getFavorites();
  }
};

export const isFavorite = (recipeId) => {
  const favorites = getFavorites();
  return favorites.some(fav => fav.id === recipeId);
};

export const getRatings = () => {
  try {
    const ratings = localStorage.getItem(RATINGS_KEY);
    return ratings ? JSON.parse(ratings) : {};
  } catch (error) {
    console.error('Error getting ratings:', error);
    return {};
  }
};

export const setRating = (recipeId, rating) => {
  try {
    const ratings = getRatings();
    ratings[recipeId] = rating;
    localStorage.setItem(RATINGS_KEY, JSON.stringify(ratings));
    return ratings;
  } catch (error) {
    console.error('Error setting rating:', error);
    return getRatings();
  }
};

export const getRating = (recipeId) => {
  const ratings = getRatings();
  return ratings[recipeId] || 0;
};

export const getRecommendations = (allRecipes) => {
  const favorites = getFavorites();
  const ratings = getRatings();

  if (favorites.length === 0) {
    return [];
  }

  const favoriteTags = new Set();
  const favoriteCuisines = new Set();

  favorites.forEach(fav => {
    if (fav.dietaryTags) {
      fav.dietaryTags.forEach(tag => favoriteTags.add(tag));
    }
    if (fav.cuisine) {
      favoriteCuisines.add(fav.cuisine);
    }
  });

  const highRatedIds = Object.entries(ratings)
    .filter(([, rating]) => rating >= 4)
    .map(([id]) => parseInt(id));

  const favoriteIds = new Set(favorites.map(fav => fav.id));

  const recommendations = allRecipes
    .filter(recipe => !favoriteIds.has(recipe.id))
    .map(recipe => {
      let score = 0;

      if (recipe.dietaryTags) {
        recipe.dietaryTags.forEach(tag => {
          if (favoriteTags.has(tag)) score += 2;
        });
      }

      if (recipe.cuisine && favoriteCuisines.has(recipe.cuisine)) {
        score += 3;
      }

      if (highRatedIds.includes(recipe.id)) {
        score += 5;
      }

      return { ...recipe, score };
    })
    .filter(recipe => recipe.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 6);

  return recommendations;
};
