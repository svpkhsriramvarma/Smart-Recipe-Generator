const DIETARY_OPTIONS = [
  'vegetarian',
  'vegan',
  'gluten-free',
  'dairy-free',
  'high-protein',
  'low-carb'
];

const DIFFICULTY_OPTIONS = [
  { value: 'all', label: 'All Levels' },
  { value: 'easy', label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'hard', label: 'Hard' }
];

const COOK_TIME_OPTIONS = [
  { value: 'all', label: 'Any Time' },
  { value: 'fast', label: 'Quick (< 30 min)' },
  { value: 'medium', label: 'Medium (30-60 min)' },
  { value: 'long', label: 'Long (> 60 min)' }
];

export default function FilterPanel({
  dietaryPreferences,
  onDietaryChange,
  filters,
  onFilterChange
}) {
  const toggleDietary = (option) => {
    if (dietaryPreferences.includes(option)) {
      onDietaryChange(dietaryPreferences.filter(pref => pref !== option));
    } else {
      onDietaryChange([...dietaryPreferences, option]);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 space-y-6">
      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-3">Dietary Preferences</h3>
        <div className="flex flex-wrap gap-2">
          {DIETARY_OPTIONS.map((option) => (
            <button
              key={option}
              onClick={() => toggleDietary(option)}
              className={`px-4 py-2 rounded-full font-medium transition-all ${
                dietaryPreferences.includes(option)
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-bold text-gray-800 mb-3">Difficulty</h3>
        <div className="grid grid-cols-2 gap-2">
          {DIFFICULTY_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => onFilterChange({ ...filters, difficulty: option.value })}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filters.difficulty === option.value
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-bold text-gray-800 mb-3">Cook Time</h3>
        <div className="grid grid-cols-2 gap-2">
          {COOK_TIME_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => onFilterChange({ ...filters, cookTime: option.value })}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filters.cookTime === option.value
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
