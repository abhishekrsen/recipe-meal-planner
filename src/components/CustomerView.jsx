import { useState } from "react";

export default function CustomerView({ menu, onPlaceOrder }) {
  const [seatNumber, setSeatNumber] = useState("");
  const [cart, setCart] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [orderSuccess, setOrderSuccess] = useState(null);

  const categories = ["all", "Breakfast", "Lunch", "Dinner"];

  const addToCart = (item) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const updateQuantity = (id, delta) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity + delta } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const totalAmount = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleCheckout = (e) => {
    e.preventDefault();
    if (!seatNumber.trim()) {
      alert("Please enter or select your Seat / Table Number first!");
      return;
    }
    if (cart.length === 0) return;

    const newOrder = {
      id: "ORD-" + Math.floor(1000 + Math.random() * 9000),
      seatNumber: seatNumber.trim(),
      items: cart,
      total: totalAmount,
      status: "Pending",
      createdAt: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    onPlaceOrder(newOrder);
    setOrderSuccess(newOrder);
    setCart([]);
  };

  const filteredMenu = menu.filter((item) => {
    const matchesCat =
      activeCategory === "all" || item.category === activeCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="customer-layout">
      {/* Seat Selector Banner */}
      <div className="seat-banner">
        <div className="seat-info">
          <span className="seat-icon">🪑</span>
          <div>
            <h2>Dine-In Table Ordering</h2>
            <p>Select your table/seat number to send orders straight to our kitchen</p>
          </div>
        </div>

        <div className="seat-input-box">
          <label htmlFor="seat-select">Your Seat / Table No:</label>
          <select
            id="seat-select"
            value={seatNumber}
            onChange={(e) => setSeatNumber(e.target.value)}
            className="seat-select"
          >
            <option value="">-- Choose Seat --</option>
            {[...Array(15)].map((_, idx) => (
              <option key={idx + 1} value={`Table ${idx + 1}`}>
                Table {idx + 1}
              </option>
            ))}
          </select>
        </div>
      </div>

      {orderSuccess && (
        <div className="order-confirmation-banner">
          <div>
            <strong>✅ Order #{orderSuccess.id} Sent to Kitchen!</strong>
            <p>
              Preparing your food for <strong>{orderSuccess.seatNumber}</strong>.
              Our waiter will serve you shortly.
            </p>
          </div>
          <button
            className="btn-ghost"
            onClick={() => setOrderSuccess(null)}
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="customer-main-grid">
        {/* Menu Section */}
        <section className="menu-section">
          <div className="toolbar">
            <input
              type="text"
              className="search-input"
              placeholder="Search Masala Dosa, Mandi, Biryani..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="category-filters">
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`filter-btn ${
                    activeCategory === cat ? "active" : ""
                  }`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="recipe-grid">
            {filteredMenu.map((item) => {
              const inCart = cart.find((c) => c.id === item.id);
              return (
                <article key={item.id} className="recipe-card">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="recipe-image"
                  />
                  <div className="recipe-content">
                    <div className="recipe-header">
                      <span
                        className={`badge badge-${item.category.toLowerCase()}`}
                      >
                        {item.category}
                      </span>
                      <span className="price-tag">₹{item.price}</span>
                    </div>

                    <h3 className="recipe-title">{item.title}</h3>
                    <p className="menu-desc">{item.description}</p>

                    <div className="card-actions">
                      <span className="recipe-meta-text">
                        ⏱ {item.prepTime} mins
                      </span>

                      {inCart ? (
                        <div className="qty-controls">
                          <button
                            className="qty-btn"
                            onClick={() => updateQuantity(item.id, -1)}
                          >
                            −
                          </button>
                          <span className="qty-val">{inCart.quantity}</span>
                          <button
                            className="qty-btn"
                            onClick={() => updateQuantity(item.id, 1)}
                          >
                            +
                          </button>
                        </div>
                      ) : (
                        <button
                          className="btn-primary"
                          onClick={() => addToCart(item)}
                        >
                          + Add to Order
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* Live Order Cart Sidebar */}
        <aside className="order-cart-panel">
          <h3>Your Order Tray</h3>
          <p className="cart-seat-label">
            Serving to:{" "}
            <strong>{seatNumber || "No Seat Selected Yet"}</strong>
          </p>

          {cart.length === 0 ? (
            <div className="empty-cart">
              <p>Your tray is empty.</p>
              <span>Tap "+ Add to Order" on any dish to begin.</span>
            </div>
          ) : (
            <>
              <ul className="cart-items-list">
                {cart.map((item) => (
                  <li key={item.id} className="cart-item">
                    <div>
                      <strong>{item.title}</strong>
                      <span>
                        ₹{item.price} × {item.quantity}
                      </span>
                    </div>
                    <div className="qty-controls">
                      <button
                        className="qty-btn"
                        onClick={() => updateQuantity(item.id, -1)}
                      >
                        −
                      </button>
                      <span className="qty-val">{item.quantity}</span>
                      <button
                        className="qty-btn"
                        onClick={() => updateQuantity(item.id, 1)}
                      >
                        +
                      </button>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="cart-summary">
                <div className="summary-row">
                  <span>Total Payable</span>
                  <strong>₹{totalAmount}</strong>
                </div>
                <button
                  className="btn-primary btn-checkout"
                  onClick={handleCheckout}
                >
                  Place Order ({cart.reduce((s, i) => s + i.quantity, 0)} items)
                </button>
              </div>
            </>
          )}
        </aside>
      </div>
    </div>
  );
}