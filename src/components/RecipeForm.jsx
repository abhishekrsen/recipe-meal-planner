import { useState } from "react";

export default function RecipeForm({ onAddRecipe, onClose }) {
  const [formData, setFormData] = useState({
    title: "",
    category: "Lunch",
    prepTime: "",
    calories: "",
    image: "",
    ingredientsText: "",
    instructions: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    // Convert newline-separated string into a clean array
    const ingredientsArray = formData.ingredientsText
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);

    const newRecipe = {
      id: "rec-" + crypto.randomUUID(),
      title: formData.title.trim(),
      category: formData.category,
      prepTime: Number(formData.prepTime) || 15,
      calories: Number(formData.calories) || 300,
      image: formData.image.trim() || "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=500&auto=format&fit=crop&q=60",
      ingredients: ingredientsArray.length ? ingredientsArray : ["Assorted fresh ingredients"],
      instructions: formData.instructions.trim() || "Prepare ingredients and cook to preference."
    };

    onAddRecipe(newRecipe);
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-panel">
        <header className="modal-header">
          <h2>Create New Recipe</h2>
          <button className="btn-close" onClick={onClose}>×</button>
        </header>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Recipe Title</label>
            <input 
              type="text" 
              name="title" 
              required 
              value={formData.title} 
              onChange={handleChange} 
              placeholder="e.g., Berry Smoothie Bowl" 
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Category</label>
              <select name="category" value={formData.category} onChange={handleChange}>
                <option value="Breakfast">Breakfast</option>
                <option value="Lunch">Lunch</option>
                <option value="Dinner">Dinner</option>
                <option value="Snack">Snack</option>
              </select>
            </div>
            <div className="form-group">
              <label>Prep Time (mins)</label>
              <input 
                type="number" 
                name="prepTime" 
                value={formData.prepTime} 
                onChange={handleChange} 
                placeholder="20" 
              />
            </div>
            <div className="form-group">
              <label>Calories</label>
              <input 
                type="number" 
                name="calories" 
                value={formData.calories} 
                onChange={handleChange} 
                placeholder="400" 
              />
            </div>
          </div>

          <div className="form-group">
            <label>Image URL (Optional)</label>
            <input 
              type="url" 
              name="image" 
              value={formData.image} 
              onChange={handleChange} 
              placeholder="https://..." 
            />
          </div>

          <div className="form-group">
            <label>Ingredients (one per line)</label>
            <textarea 
              name="ingredientsText" 
              rows="3" 
              value={formData.ingredientsText} 
              onChange={handleChange}
              placeholder="1 cup Greek yogurt&#10;1/2 cup berries&#10;1 tbsp honey"
            />
          </div>

          <div className="form-group">
            <label>Instructions</label>
            <textarea 
              name="instructions" 
              rows="2" 
              value={formData.instructions} 
              onChange={handleChange}
              placeholder="Step-by-step preparation steps..."
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary">Save Recipe</button>
          </div>
        </form>
      </div>
    </div>
  );
}