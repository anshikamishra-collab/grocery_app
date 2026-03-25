export default function GroceryCard({ list, onAddItem }: any) {
  const total = list.items.reduce(
    (sum: number, item: any) => sum + item.price,
    0,
  );

  return (
    <div className="card">
      <div className="card-header">
        <h4>{new Date(Number(list.date)).toLocaleDateString()}</h4>
        <span className="item-count">{list.items.length} items</span>
      </div>

      <div className="items">
        {list.items.length === 0 && (
          <div className="empty-text">No items yet</div>
        )}

        {list.items.map((item: any) => (
          <div key={item.id} className="item-row">
            <span>{item.name}</span>
            <span>₹{item.price.toFixed(2)}</span>
          </div>
        ))}
      </div>

      <div className="card-footer">
        <div className="total">Total: ₹{total.toFixed(2)}</div>
        <button className="pill-btn" onClick={onAddItem}>
          + Add Item
        </button>
      </div>
    </div>
  );
}
