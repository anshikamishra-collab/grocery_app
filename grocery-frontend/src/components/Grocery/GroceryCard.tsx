export default function GroceryCard({ list, onAddItem }: any) {
  const total = list.items.reduce(
    (sum: number, item: any) => sum + item.price,
    0
  );

  const date = new Date(Number(list.date));
  const day = date.toLocaleDateString("en-IN", { day: "2-digit" });
  const monthYear = date.toLocaleDateString("en-IN", {
    month: "short",
    year: "numeric",
  });

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-date">
          <div className="card-date-day">{day}</div>
          <div className="card-date-month">{monthYear}</div>
        </div>
        <span className="item-count-badge">
          {list.items.length} {list.items.length === 1 ? "item" : "items"}
        </span>
      </div>

      <div className="items">
        {list.items.length === 0 && (
          <div className="empty-text">No items yet</div>
        )}
        {list.items.map((item: any) => (
          <div key={item.id} className="item-row">
            <span className="item-row-name">{item.name}</span>
            <span className="item-row-price">₹{item.price.toFixed(2)}</span>
          </div>
        ))}
      </div>

      <div className="card-divider" />

      <div className="card-footer">
        <div>
          <div className="total-label">Total</div>
          <div className="total-amount">₹{total.toFixed(2)}</div>
        </div>
        <button className="pill-btn" onClick={onAddItem}>
          + Add Item
        </button>
      </div>
    </div>
  );
}