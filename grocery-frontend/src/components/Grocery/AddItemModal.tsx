import { gql } from "@apollo/client";
import { useQuery, useMutation } from "@apollo/client/react";
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
  const [price, setPrice] = useState(0);
  const [addItem] = useMutation(ADD_ITEM);

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Add Item</h3>
        <input
          placeholder="Item name"
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="number"
          placeholder="Price"
          onChange={(e) => setPrice(parseFloat(e.target.value))}
        />
        <button
          onClick={async () => {
            await addItem({ variables: { listId, name, price } });
            onClose();
          }}
        >
          Add
        </button>
      </div>
    </div>
  );
}
