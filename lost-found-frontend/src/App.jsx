
import { useEffect, useState } from "react";
import "./App.css";

const API = "http://localhost:8080/api";

function App() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    type: "LOST",
    category: "",
    location: "",
    description: "",
    contact: "",
  });

  async function loadItems() {
    setLoading(true);
    try {
      const response = await fetch(`${API}/items`);
      if (!response.ok) throw new Error("Unable to load items");
      setItems(await response.json());
    } catch {
      setMessage("Cannot connect to the backend. Check that Spring Boot is running.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadItems();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");

    try {
      const response = await fetch(`${API}/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.detail || error.message || "Could not report the item");
      }

      setMessage("Item reported successfully!");
      setForm({
        title: "",
        type: "LOST",
        category: "",
        location: "",
        description: "",
        contact: "",
      });

      await loadItems();
    } catch (error) {
      setMessage(error.message || "Unable to connect to the backend.");
    }
  }

  const visibleItems = items.filter((item) => {
    const term = search.toLowerCase();
    const matchesSearch =
      (item.title || "").toLowerCase().includes(term) ||
      (item.category || "").toLowerCase().includes(term) ||
      (item.location || "").toLowerCase().includes(term);

    return matchesSearch && (filter === "ALL" || item.type === filter);
  });

  return (
    <div className="app">
      <header className="navbar">
        <a className="brand" href="#home">
          <span className="brand-icon">⌕</span>
          Campus<span>Find</span>
        </a>
        <nav>
          <a href="#home">Home</a>
          <a href="#report">Report Item</a>
          <a href="#items">Browse Items</a>
        </nav>
      </header>

      <main>
        <section className="hero" id="home">
          <div className="hero-content">
            <p className="eyebrow">YOUR CAMPUS, CONNECTED</p>
            <h1>Lost something?<br /><span>Let's find it.</span></h1>
            <p className="hero-description">
              A little help goes a long way. Report lost belongings,
              share found items, and help your campus community reunite.
            </p>
            <div className="hero-actions">
              <a className="button button-primary" href="#items">Find an Item ↗</a>
              <a className="button button-light" href="#report">Report an Item +</a>
            </div>
          </div>
          <div className="hero-art" aria-hidden="true">
            <div className="art-circle">
              <div className="art-card card-one">🎒<span>Backpack</span></div>
              <div className="art-card card-two">🔑<span>Keys</span></div>
              <div className="art-card card-three">📱<span>Phone</span></div>
              <div className="art-center">⌕</div>
            </div>
            <div className="art-note">Good things find their way back ✨</div>
          </div>
        </section>

        <section className="stats">
          <div><strong>{items.length}</strong><span>Reported items</span></div>
          <div><strong>{items.filter((item) => item.type === "LOST").length}</strong><span>Lost items</span></div>
          <div><strong>{items.filter((item) => item.type === "FOUND").length}</strong><span>Found items</span></div>
        </section>

        <section className="report-section" id="report">
          <div className="section-heading">
            <p className="eyebrow">HELP YOUR COMMUNITY</p>
            <h2>Report an item</h2>
            <p>Tell us what happened. A few details can make a big difference.</p>
          </div>

          <form className="report-form" onSubmit={handleSubmit}>
            <div className="type-choice">
              <label className={form.type === "LOST" ? "type-option selected" : "type-option"}>
                <input
                  type="radio"
                  name="type"
                  value="LOST"
                  checked={form.type === "LOST"}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                />
                <span>🔎</span>
                <span><strong>I lost something</strong><small>Help me find it</small></span>
              </label>
              <label className={form.type === "FOUND" ? "type-option selected" : "type-option"}>
                <input
                  type="radio"
                  name="type"
                  value="FOUND"
                  checked={form.type === "FOUND"}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                />
                <span>🤝</span>
                <span><strong>I found something</strong><small>Help return it</small></span>
              </label>
            </div>

            <div className="form-grid">
              <label>Item name *
                <input required placeholder="e.g. Black water bottle" value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })} />
              </label>
              <label>Category *
                <select required value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}>
                  <option value="">Choose category</option>
                  <option>Electronics</option>
                  <option>Books & Notes</option>
                  <option>Bags</option>
                  <option>Keys & Cards</option>
                  <option>Clothing</option>
                  <option>Accessories</option>
                  <option>Other</option>
                </select>
              </label>
              <label>Location *
                <input required placeholder="e.g. Library, Block A" value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })} />
              </label>
              <label>Your contact *
                <input required placeholder="Email or phone" value={form.contact}
                  onChange={(e) => setForm({ ...form, contact: e.target.value })} />
              </label>
              <label className="full-width">Description
                <textarea rows="4" placeholder="Color, brand, identifying details..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </label>
            </div>

            <button className="button button-primary submit-button" type="submit">
              Submit Report ↗
            </button>
            {message && <p className="message" role="status">{message}</p>}
          </form>
        </section>

        <section className="items-section" id="items">
          <div className="section-heading">
            <p className="eyebrow">THE COMMUNITY BOARD</p>
            <h2>Browse reported items</h2>
            <p>Something look familiar? Search the latest campus reports.</p>
          </div>

          <div className="browse-tools">
            <input
              className="search-input"
              placeholder="Search by item, category or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div className="filter-buttons">
              {["ALL", "LOST", "FOUND"].map((value) => (
                <button key={value}
                  className={filter === value ? "filter-button active" : "filter-button"}
                  onClick={() => setFilter(value)}>{value === "ALL" ? "All items" : value}</button>
              ))}
            </div>
          </div>

          {loading ? <p className="empty-state">Loading items...</p> :
            visibleItems.length === 0 ? (
              <div className="empty-state">
                <span>🧭</span>
                <h3>No items found yet</h3>
                <p>Try another search or be the first to report an item.</p>
              </div>
            ) : (
              <div className="items-grid">
                {visibleItems.map((item) => (
                  <article className="item-card" key={item.id}>
                    <div className="item-card-top">
                      <span className={item.type === "LOST" ? "item-badge lost" : "item-badge found"}>
                        {item.type}
                      </span>
                      <span className="item-status">{item.status}</span>
                    </div>
                    <h3>{item.title}</h3>
                    <p className="item-category">{item.category}</p>
                    <p className="item-description">{item.description || "No additional description."}</p>
                    <div className="item-location">📍 {item.location}</div>
                    <div className="item-contact">Contact: {item.contact}</div>
                    {item.type === "FOUND" && item.status === "OPEN" &&
                      <ClaimButton item={item} onMessage={setMessage} />}
                  </article>
                ))}
              </div>
            )}
        </section>
      </main>

      <footer>
        <a className="brand" href="#home">Campus<span>Find</span></a>
        <p>Small acts of kindness make a big difference. 💛</p>
        <small>Campus Lost & Found Management System</small>
      </footer>
    </div>
  );
}

function ClaimButton({ item, onMessage }) {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [message, setClaimMessage] = useState("");
  const [open, setOpen] = useState(false);

  async function submitClaim(event) {
    event.preventDefault();
    try {
      const response = await fetch(`${API}/claims`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itemId: item.id,
          claimantName: name,
          contact,
          message: message,
        }),
      });

      if (!response.ok) throw new Error("Could not submit claim");
      onMessage("Claim submitted! The campus team can review it.");
      setOpen(false);
      setName("");
      setContact("");
      setClaimMessage("");
    } catch (error) {
      onMessage(error.message);
    }
  }

  return (
    <div className="claim-area">
      <button className="button button-light claim-toggle" onClick={() => setOpen(!open)}>
        {open ? "Cancel" : "This is mine — Claim"}
      </button>
      {open && <form className="claim-form" onSubmit={submitClaim}>
        <label>Your name *
          <input required value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label>Your contact *
          <input required value={contact} onChange={(e) => setContact(e.target.value)} />
        </label>
        <label>Proof or details
          <textarea rows="2" value={message} onChange={(e) => setClaimMessage(e.target.value)} />
        </label>
        <button className="button button-primary" type="submit">Send Claim</button>
      </form>}
    </div>
  );
}

export default App;
