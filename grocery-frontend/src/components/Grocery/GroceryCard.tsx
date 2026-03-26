import { gql } from "@apollo/client";
import { useQuery, useMutation } from "@apollo/client/react";
import { useState } from "react";

const UPDATE_ITEM = gql`
  mutation UpdateItem($itemId: String!, $name: String!, $price: Float!) {
    updateItem(itemId: $itemId, name: $name, price: $price) {
      id
      name
      price
    }
  }
`;

const DELETE_ITEM = gql`
  mutation DeleteItem($itemId: String!) {
    deleteItem(itemId: $itemId) {
      id
    }
  }
`;

const DELETE_LIST = gql`
  mutation DeleteList($listId: String!) {
    deleteList(listId: $listId) {
      id
    }
  }
`;

type Item = { id: string; name: string; price: number };

function ItemRow({
  item,
  onUpdated,
  onDeleted,
}: {
  item: Item;
  onUpdated: () => void;
  onDeleted: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(item.name);
  const [price, setPrice] = useState(item.price);

  const [updateItem, { loading: updating }] = useMutation(UPDATE_ITEM);
  const [deleteItem, { loading: deleting }] = useMutation(DELETE_ITEM);

  const handleSave = async () => {
    if (!name.trim()) return;
    await updateItem({ variables: { itemId: item.id, name, price } });
    setEditing(false);
    onUpdated();
  };

  const handleDelete = async () => {
    await deleteItem({ variables: { itemId: item.id } });
    onDeleted();
  };

  if (editing) {
    return (
      <div className="item-row item-row--editing">
        <input
          className="item-edit-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Item name"
          autoFocus
        />
        <input
          className="item-edit-input item-edit-input--price"
          type="number"
          value={price}
          onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
          placeholder="Price"
        />
        <div className="item-row-actions">
          <button
            className="item-action-btn item-action-btn--save"
            onClick={handleSave}
            disabled={updating}
            title="Save"
          >
            {updating ? "…" : "✓"}
          </button>
          <button
            className="item-action-btn item-action-btn--cancel"
            onClick={() => {
              setName(item.name);
              setPrice(item.price);
              setEditing(false);
            }}
            title="Cancel"
          >
            ✕
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="item-row item-row--view">
      <span className="item-row-name">{item.name}</span>
      <div className="item-row-right">
        <span className="item-row-price">₹{item.price.toFixed(2)}</span>
        <div className="item-row-actions item-row-actions--hover">
          <button
            className="item-action-btn item-action-btn--edit"
            onClick={() => setEditing(true)}
            title="Edit"
          >
            ✎
          </button>
          <button
            className="item-action-btn item-action-btn--delete"
            onClick={handleDelete}
            disabled={deleting}
            title="Delete"
          >
            {deleting ? "…" : "🗑"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function GroceryCard({ list, onAddItem, onRefetch }: any) {
  const total = list.items.reduce(
    (sum: number, item: any) => sum + item.price,
    0
  );

  const [deleteList, { loading: deletingList }] = useMutation(DELETE_LIST);

  const handleDeleteList = async () => {
    if (!window.confirm("Delete this entire list?")) return;
    await deleteList({ variables: { listId: list.id } });
    onRefetch();
  };

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
        <div className="card-header-right">
          <span className="item-count-badge">
            {list.items.length} {list.items.length === 1 ? "item" : "items"}
          </span>
          <button
            className="card-delete-btn"
            onClick={handleDeleteList}
            disabled={deletingList}
            title="Delete list"
          >
            {deletingList ? "…" : "🗑"}
          </button>
        </div>
      </div>

      <div className="items">
        {list.items.length === 0 && (
          <div className="empty-text">No items yet</div>
        )}
        {list.items.map((item: any) => (
          <ItemRow
            key={item.id}
            item={item}
            onUpdated={onRefetch}
            onDeleted={onRefetch}
          />
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