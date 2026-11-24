import { useState, useEffect } from "react";
import { initialMenu } from "./data/initialRecipes";
import RoleSelector from "./components/RoleSelector";
import CustomerView from "./components/CustomerView";
import AdminDashboard from "./components/AdminDashboard";
import "./App.css";

export default function App() {
  const [role, setRole] = useState(null); // null | "customer" | "admin"

  const [menu, setMenu] = useState(() => {
    const saved = localStorage.getItem("restaurant_menu");
    return saved ? JSON.parse(saved) : initialMenu;
  });

  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem("restaurant_orders");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("restaurant_menu", JSON.stringify(menu));
  }, [menu]);

  useEffect(() => {
    localStorage.setItem("restaurant_orders", JSON.stringify(orders));
  }, [orders]);

  // Real-time sync across tabs so Admin sees Customer orders immediately
  useEffect(() => {
    const handleStorageSync = (e) => {
      if (e.key === "restaurant_orders" && e.newValue) {
        setOrders(JSON.parse(e.newValue));
      }
      if (e.key === "restaurant_menu" && e.newValue) {
        setMenu(JSON.parse(e.newValue));
      }
    };
    window.addEventListener("storage", handleStorageSync);
    return () => window.removeEventListener("storage", handleStorageSync);
  }, []);

  const handlePlaceOrder = (newOrder) => {
    setOrders((prev) => [newOrder, ...prev]);
  };

  const handleUpdateOrderStatus = (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
  };

  const handleDeleteOrder = (orderId) => {
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
  };

  const handleAddMenuItem = (item) => {
    setMenu((prev) => [item, ...prev]);
  };

  const handleDeleteMenuItem = (id) => {
    setMenu((prev) => prev.filter((m) => m.id !== id));
  };

  if (!role) {
    return <RoleSelector onSelectRole={setRole} />;
  }

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
            <circle cx="50" cy="50" r="46" fill="url(#navBgGrad)" stroke="#c2410c" strokeWidth="4" />
            <path className="steam s1" d="M40 28 Q37 20 42 14" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.85" />
            <path className="steam s2" d="M50 25 Q54 18 49 11" stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round" fill="none" opacity="0.95" />
            <path className="steam s3" d="M60 28 Q63 20 58 14" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.85" />
            <path d="M22 48 Q18 78 50 78 Q82 78 78 48 Z" fill="#78350f" stroke="#451a03" strokeWidth="4" />
            <ellipse cx="50" cy="48" rx="30" ry="8" fill="#92400e" stroke="#451a03" strokeWidth="3.5" />
            <ellipse cx="50" cy="48" rx="25" ry="5.5" fill="url(#navCurryGrad)" />
            <ellipse cx="44" cy="48" rx="3" ry="1.5" fill="#15803d" transform="rotate(-15 44 48)" />
            <ellipse cx="56" cy="47" rx="2.5" ry="1.2" fill="#166534" transform="rotate(20 56 47)" />
            <path d="M48 48 Q52 46 51 50" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" fill="none" />
          </svg>

          <div>
            <h1 className="brand-title">Enthaa Kazhikaa?</h1>
            <p className="subtitle">
              {role === "admin"
                ? "Staff & Waiter Order Console"
                : "Authentic Kerala & Arabian Table Ordering"}
            </p>
          </div>
        </div>

        <div className="nav-right">
          <span className={`role-pill ${role}`}>
            {role === "admin" ? "👨‍🍳 Admin Mode" : "🍽️ Customer Mode"}
          </span>
          <button className="btn-secondary" onClick={() => setRole(null)}>
            Switch Role
          </button>
        </div>
      </header>

      {role === "customer" ? (
        <CustomerView menu={menu} onPlaceOrder={handlePlaceOrder} />
      ) : (
        <AdminDashboard
          orders={orders}
          menu={menu}
          onUpdateOrderStatus={handleUpdateOrderStatus}
          onDeleteOrder={handleDeleteOrder}
          onAddMenuItem={handleAddMenuItem}
          onDeleteMenuItem={handleDeleteMenuItem}
        />
      )}
    </div>
  );
}