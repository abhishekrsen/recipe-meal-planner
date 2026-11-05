import { useState, useEffect } from "react";
import { initialRecipes } from "./data/initialRecipes";
import RecipeCard from "./components/RecipeCard";
import RecipeForm from "./components/RecipeForm";
import WeeklyPlanner from "./components/WeeklyPlanner";
import "./App.css";

const DEFAULT_PLAN = {
  Monday: "Avocado Egg Toast",
  Tuesday: null,
  Wednesday: "Mediterranean Pasta",
  Thursday: null,
  Friday: "Crispy Tofu Stir-Fry",
  Saturday: null,
  Sunday: null
};

export default function App() {
  const [recipes, setRecipes] = useState(() => {
    const saved = localStorage.getItem("meal_recipes");
    return saved ? JSON.parse(saved) : initialRecipes;
  });

  const [mealPlan, setMealPlan] = useState(() => {
    const saved = localStorage.getItem("weekly_meal_plan");
    return saved ? JSON.parse(saved) : DEFAULT_PLAN;
  });

  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("meal_recipes", JSON.stringify(recipes));
  }, [recipes]);

  useEffect(() => {
    localStorage.setItem("weekly_meal_plan", JSON.stringify(mealPlan));
  }, [mealPlan]);

  const handleAddRecipe = (newRecipe) => {
    setRecipes([newRecipe, ...recipes]);
  };

  const handleDeleteRecipe = (id) => {
    setRecipes(recipes.filter((r) => r.id !== id));
  };

  const handleAssignMeal = (day, recipeTitle) => {
    setMealPlan((prev) => ({ ...prev, [day]: recipeTitle }));
  };

  const handleClearDay = (day) => {
    setMealPlan((prev) => ({ ...prev, [day]: null }));
  };

  const categories = ["all", "Breakfast", "Lunch", "Dinner"];

  const filteredRecipes = recipes.filter((item) => {
    const matchesCategory = activeTab === "all" || item.category === activeTab;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.ingredients.some(ing => ing.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="app-shell">
      <header className="navbar">
  <div className="navbar-brand">
    <svg 
      className="brand-logo-svg" 
      viewBox="0 0 100 100" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="navBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ff7e29" />
          <stop offset="100%" stopColor="#ea580c" />
        </linearGradient>
        <linearGradient id="navCurryGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
      </defs>

      {/* Circular Badge */}
      <circle cx="50" cy="50" r="46" fill="url(#navBgGrad)" stroke="#c2410c" strokeWidth="4" />

      {/* Animated Steam */}
      <path className="steam s1" d="M40 28 Q37 20 42 14" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.85" />
      <path className="steam s2" d="M50 25 Q54 18 49 11" stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round" fill="none" opacity="0.95" />
      <path className="steam s3" d="M60 28 Q63 20 58 14" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.85" />

      {/* Clay Pot / Chatti */}
      <path d="M22 48 Q18 78 50 78 Q82 78 78 48 Z" fill="#78350f" stroke="#451a03" strokeWidth="4" />
      <ellipse cx="50" cy="48" rx="30" ry="8" fill="#92400e" stroke="#451a03" strokeWidth="3.5" />
      <ellipse cx="50" cy="48" rx="25" ry="5.5" fill="url(#navCurryGrad)" />

      {/* Leaves & Garnish */}
      <ellipse cx="44" cy="48" rx="3" ry="1.5" fill="#15803d" transform="rotate(-15 44 48)" />
      <ellipse cx="56" cy="47" rx="2.5" ry="1.2" fill="#166534" transform="rotate(20 56 47)" />
      <path d="M48 48 Q52 46 51 50" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" fill="none" />
    </svg>

    <div>
      <h1 className="brand-title">Enthaa Kazhikaa?</h1>
      <p className="subtitle">You just worry about cooking... leave the planning to us!</p>
    </div>
  </div>

  <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
    + Add Recipe
  </button>
</header>

      <WeeklyPlanner plan={mealPlan} onClearDay={handleClearDay} />

      <section className="catalog-section">
        <div className="toolbar">
          <input
            type="text"
            className="search-input"
            placeholder="Search by recipe or ingredient..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <div className="category-filters">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`filter-btn ${activeTab === cat ? "active" : ""}`}
                onClick={() => setActiveTab(cat)}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="recipe-grid">
          {filteredRecipes.length > 0 ? (
            filteredRecipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onDelete={handleDeleteRecipe}
                onAssignMeal={handleAssignMeal}
              />
            ))
          ) : (
            <div className="empty-state">
              <p>No recipes match your criteria. Add one or clear your search.</p>
            </div>
          )}
        </div>
      </section>

      {isModalOpen && (
        <RecipeForm
          onAddRecipe={handleAddRecipe}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}