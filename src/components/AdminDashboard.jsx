import { useState } from "react";

export default function AdminDashboard({
  orders,
  menu,
  onUpdateOrderStatus,
  onDeleteOrder,
  onAddMenuItem,
  onDeleteMenuItem,
}) {
  const [activeTab, setActiveTab] = useState("orders");
  const [newDish, setNewDish] = useState({
    title: "",
    category: "Lunch",
    price: "",
    prepTime: "",
    image: "",
    description: "",
  });

  const handleDishSubmit = (e) => {
    e.preventDefault();
    if (!newDish.title.trim() || !newDish.price) return;

    onAddMenuItem({
      id: "menu-" + crypto.randomUUID(),
      title: newDish.title.trim(),
      category: newDish.category,
      price: Number(newDish.price),
      prepTime: Number(newDish.prepTime) || 15,
      image:
        newDish.image.trim() ||
        "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80",
      description:
        newDish.description.trim() || "Freshly prepared house specialty.",
    });

    setNewDish({
      title: "",
      category: "Lunch",
      price: "",
      prepTime: "",
      image: "",
      description: "",
    });
    alert("New dish added to the customer menu!");
  };

  const pendingCount = orders.filter((o) => o.status !== "Served").length;

  return (
    <div className="admin-dashboard">
      <div className="admin-header-bar">
        <div>
          <h2>Waiter & Kitchen Order Console</h2>
          <p className="subtitle">
            Monitor live table orders in real time and update serving status
          </p>
        </div>

        <div className="admin-tabs">
          <button
            className={`filter-btn ${activeTab === "orders" ? "active" : ""}`}
            onClick={() => setActiveTab("orders")}
          >
            Live Table Orders ({pendingCount} Active)
          </button>
          <button
            className={`filter-btn ${activeTab === "menu" ? "active" : ""}`}
            onClick={() => setActiveTab("menu")}
          >
            Manage Menu ({menu.length})
          </button>
        </div>
      </div>

      {activeTab === "orders" ? (
        <section>
          {orders.length === 0 ? (
            <div className="empty-state">
              <p>No customer orders yet. Orders placed from tables will appear here automatically.</p>
            </div>
          ) : (
            <div className="orders-grid">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className={`order-ticket status-${order.status.toLowerCase()}`}
                >
                  <div className="ticket-header">
                    <span className="seat-badge">🪑 {order.seatNumber}</span>
                    <span className="order-time">
                      #{order.id} • {order.createdAt}
                    </span>
                  </div>

                  <ul className="ticket-items">
                    {order.items.map((item) => (
                      <li key={item.id}>
                        <span>
                          <strong>{item.quantity}×</strong> {item.title}
                        </span>
                        <span>₹{item.price * item.quantity}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="ticket-footer">
                    <div className="ticket-total">
                      Total Bill: <strong>₹{order.total}</strong>
                    </div>

                    <div className="status-controls">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          onUpdateOrderStatus(order.id, e.target.value)
                        }
                        className="status-select"
                      >
                        <option value="Pending">🟡 Pending</option>
                        <option value="Preparing">🔥 Preparing</option>
                        <option value="Served">✅ Served</option>
                      </select>

                      <button
                        className="btn-delete"
                        onClick={() => onDeleteOrder(order.id)}
                        title="Clear ticket"
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      ) : (
        <section className="menu-manager-grid">
          <form onSubmit={handleDishSubmit} className="add-dish-card">
            <h3>Add New Menu Item</h3>
            <div className="form-group">
              <label>Dish Name</label>
              <input
                type="text"
                required
                value={newDish.title}
                onChange={(e) =>
                  setNewDish({ ...newDish, title: e.target.value })
                }
                placeholder="e.g., Kappa & Meen Curry"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Category</label>
                <select
                  value={newDish.category}
                  onChange={(e) =>
                    setNewDish({ ...newDish, category: e.target.value })
                  }
                >
                  <option value="Breakfast">Breakfast</option>
                  <option value="Lunch">Lunch</option>
                  <option value="Dinner">Dinner</option>
                </select>
              </div>
              <div className="form-group">
                <label>Price (₹)</label>
                <input
                  type="number"
                  required
                  value={newDish.price}
                  onChange={(e) =>
                    setNewDish({ ...newDish, price: e.target.value })
                  }
                  placeholder="180"
                />
              </div>
              <div className="form-group">
                <label>Prep (mins)</label>
                <input
                  type="number"
                  value={newDish.prepTime}
                  onChange={(e) =>
                    setNewDish({ ...newDish, prepTime: e.target.value })
                  }
                  placeholder="20"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Image URL (Optional)</label>
              <input
                type="url"
                value={newDish.image}
                onChange={(e) =>
                  setNewDish({ ...newDish, image: e.target.value })
                }
                placeholder="https://..."
              />
            </div>

            <div className="form-group">
              <label>Short Description</label>
              <textarea
                rows="2"
                value={newDish.description}
                onChange={(e) =>
                  setNewDish({ ...newDish, description: e.target.value })
                }
                placeholder="Describe flavors, sides, spice level..."
              />
            </div>

            <button type="submit" className="btn-primary">
              + Publish to Menu
            </button>
          </form>

          <div className="admin-menu-list">
            <h3>Current Menu Items</h3>
            {menu.map((item) => (
              <div key={item.id} className="admin-menu-row">
                <div>
                  <strong>{item.title}</strong>
                  <span>
                    {item.category} • ₹{item.price}
                  </span>
                </div>
                <button
                  className="btn-delete"
                  onClick={() => onDeleteMenuItem(item.id)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}