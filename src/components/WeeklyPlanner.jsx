export default function WeeklyPlanner({ plan, onClearDay }) {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  return (
    <section className="planner-container">
      <div className="planner-header">
        <h2>Weekly Meal Schedule</h2>
        <p>Assign recipes from the catalog to prepare your weekly calendar</p>
      </div>

      <div className="planner-grid">
        {days.map((day) => {
          const meal = plan[day];
          return (
            <div key={day} className={`day-card ${meal ? "has-meal" : ""}`}>
              <div className="day-name">{day.slice(0, 3)}</div>
              <div className="day-slot">
                {meal ? (
                  <>
                    <p className="meal-title">{meal}</p>
                    <button 
                      className="btn-clear-slot" 
                      onClick={() => onClearDay(day)}
                      title="Clear slot"
                    >
                      ×
                    </button>
                  </>
                ) : (
                  <span className="unplanned-label">Unassigned</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}