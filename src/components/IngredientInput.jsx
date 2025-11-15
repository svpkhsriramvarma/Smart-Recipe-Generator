import { X, Plus } from 'lucide-react';
import { useState } from 'react';

const COMMON_INGREDIENTS = [
  'chicken', 'beef', 'pork', 'salmon', 'shrimp', 'eggs',
  'rice', 'pasta', 'quinoa', 'bread', 'potatoes', 'sweet potato',
  'tomatoes', 'onion', 'garlic', 'bell peppers', 'broccoli', 'spinach',
  'carrots', 'mushrooms', 'lettuce', 'cucumber', 'avocado', 'kale',
  'cheese', 'milk', 'butter', 'yogurt', 'cream',
  'olive oil', 'soy sauce', 'honey', 'lemon', 'lime'
];

export default function IngredientInput({ ingredients, onIngredientsChange }) {
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filteredSuggestions = COMMON_INGREDIENTS.filter(
    ing => ing.toLowerCase().includes(inputValue.toLowerCase()) && !ingredients.includes(ing)
  );

  const handleAddIngredient = (ingredient) => {
    const trimmed = ingredient.trim().toLowerCase();
    if (trimmed && !ingredients.includes(trimmed)) {
      onIngredientsChange([...ingredients, trimmed]);
      setInputValue('');
      setShowSuggestions(false);
    }
  };

  const handleRemoveIngredient = (ingredient) => {
    onIngredientsChange(ingredients.filter(ing => ing !== ingredient));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      handleAddIngredient(inputValue);
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              setShowSuggestions(e.target.value.length > 0);
            }}
            onKeyPress={handleKeyPress}
            onFocus={() => setShowSuggestions(inputValue.length > 0)}
            placeholder="Type an ingredient..."
            className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-emerald-500 focus:outline-none transition-colors"
          />
          <button
            onClick={() => handleAddIngredient(inputValue)}
            disabled={!inputValue.trim()}
            className="px-4 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <Plus size={20} />
          </button>
        </div>

        {showSuggestions && filteredSuggestions.length > 0 && (
          <div className="absolute z-10 w-full mt-2 bg-white border-2 border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {filteredSuggestions.slice(0, 10).map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => handleAddIngredient(suggestion)}
                className="w-full px-4 py-2 text-left hover:bg-emerald-50 transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>

      {ingredients.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {ingredients.map((ingredient) => (
            <span
              key={ingredient}
              className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full flex items-center gap-2 font-medium"
            >
              {ingredient}
              <button
                onClick={() => handleRemoveIngredient(ingredient)}
                className="hover:text-emerald-900 transition-colors"
              >
                <X size={16} />
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="border-t pt-4">
        <p className="text-sm text-gray-600 mb-2 font-medium">Quick Add:</p>
        <div className="flex flex-wrap gap-2">
          {COMMON_INGREDIENTS.slice(0, 12)
            .filter(ing => !ingredients.includes(ing))
            .map((ingredient) => (
              <button
                key={ingredient}
                onClick={() => handleAddIngredient(ingredient)}
                className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-emerald-100 hover:text-emerald-700 transition-colors"
              >
                + {ingredient}
              </button>
            ))}
        </div>
      </div>
    </div>
  );
}
