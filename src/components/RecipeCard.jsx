import { useState } from "react";

export default function RecipeCard({ recipe, onDelete, onAssignMeal }) {
  const [showDetails, setShowDetails] = useState(false);
  const [selectedDay, setSelectedDay] = useState("Monday");

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  const handlePlanClick = () => {
    onAssignMeal(selectedDay, recipe.title);
  };

  return (
    <article className="recipe-card">
      <img src={recipe.image} alt={recipe.title} className="recipe-image" />
      <div className="recipe-content">
        <div className="recipe-header">
          <span className={`badge badge-${recipe.category.toLowerCase()}`}>
            {recipe.category}
          </span>
          <span className="recipe-meta-text">{recipe.prepTime} mins • {recipe.calories} kcal</span>
        </div>

        <h3 className="recipe-title">{recipe.title}</h3>

        <button 
          className="btn-toggle-details"
          onClick={() => setShowDetails(!showDetails)}
        >
          {showDetails ? "Hide Details ▲" : "View Ingredients & Steps ▼"}
        </button>

        {showDetails && (
          <div className="recipe-expanded">
            <strong>Ingredients:</strong>
            <ul>
              {recipe.ingredients.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
            <strong>Instructions:</strong>
            <p>{recipe.instructions}</p>
          </div>
        )}

        <div className="card-actions">
          <div className="planner-select-row">
            <select 
              value={selectedDay} 
              onChange={(e) => setSelectedDay(e.target.value)}
              className="day-dropdown"
            >
              {days.map((day) => (
                <option key={day} value={day}>{day.slice(0, 3)}</option>
              ))}
            </select>
            <button className="btn-secondary" onClick={handlePlanClick}>
              + Plan
            </button>
          </div>
          <button className="btn-delete" onClick={() => onDelete(recipe.id)}>
            Remove
          </button>
        </div>
      </div>
    </article>
  );
}