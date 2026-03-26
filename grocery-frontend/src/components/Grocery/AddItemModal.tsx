import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import { useState } from "react";

const ADD_ITEM = gql`
  mutation AddItem($listId: String!, $name: String!, $price: Float!) {
    addItem(listId: $listId, name: $name, price: $price) {
      id
    }
  }
`;

export default function AddItemModal({ listId, onClose }: any) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [addItem, { loading }] = useMutation(ADD_ITEM);

  const handleAdd = async () => {
    if (!name.trim() || price === "") return;
    await addItem({ variables: { listId, name, price: Number(price) } });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-title">Add Item</div>
        <div className="modal-subtitle">Add a new item to this list</div>

        <div className="modal-input-group">
          <label className="modal-label">Item Name</label>
          <input
            placeholder="e.g. Tomatoes"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            autoFocus
          />
        </div>

        <div className="modal-input-group">
          <label className="modal-label">Price (₹)</label>
          <input
            type="number"
            placeholder="e.g. 40"
            value={price}
            onChange={(e) =>
              setPrice(e.target.value === "" ? "" : parseFloat(e.target.value))
            }
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          />
        </div>

        <div className="modal-actions">
          <button className="modal-btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button
            className="modal-btn-primary"
            onClick={handleAdd}
            disabled={loading || !name.trim() || price === ""}
          >
            {loading ? "Adding…" : "Add Item"}
          </button>
        </div>
      </div>
    </div>
  );
}