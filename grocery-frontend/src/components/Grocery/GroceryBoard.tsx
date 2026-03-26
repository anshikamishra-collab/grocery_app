import { gql } from "@apollo/client";
import { useQuery, useMutation } from "@apollo/client/react";
import { useState } from "react";
import GroceryCard from "./GroceryCard";
import AddItemModal from "./AddItemModal";

const GET_LISTS = gql`
  query {
    getMyLists {
      id
      date
      items {
        id
        name
        price
      }
    }
  }
`;

const CREATE_LIST = gql`
  mutation {
    createList {
      id
      date
    }
  }
`;

type Item = { id: string; name: string; price: number };
type GroceryList = { id: string; date: string; items: Item[] };
type GetListsData = { getMyLists: GroceryList[] };

export default function GroceryBoard() {
  const { data, refetch } = useQuery<GetListsData>(GET_LISTS);
  const [createList] = useMutation(CREATE_LIST);
  const [selectedList, setSelectedList] = useState<string | null>(null);

  const lists = data?.getMyLists ?? [];
  const totalItems = lists.reduce((s, l) => s + l.items.length, 0);
  const totalSpend = lists.reduce(
    (s, l) => s + l.items.reduce((si, i) => si + i.price, 0),
    0
  );

  return (
    <>
      <div className="board-header">
        <div>
          <div className="board-title">Your Lists</div>
          <div className="board-subtitle">
            {lists.length === 0
              ? "No lists yet — tap + to create your first one"
              : `${lists.length} list${lists.length !== 1 ? "s" : ""} · ${totalItems} items`}
          </div>
        </div>

        {lists.length > 0 && (
          <div className="board-stats">
            <div className="stat-chip">
              <span className="stat-chip-value">{lists.length}</span>
              <span className="stat-chip-label">Lists</span>
            </div>
            <div className="stat-chip">
              <span className="stat-chip-value">₹{totalSpend.toFixed(0)}</span>
              <span className="stat-chip-label">Spent</span>
            </div>
          </div>
        )}
      </div>

      <div className="board">
        {lists.map((list) => (
          <GroceryCard
            key={list.id}
            list={list}
            onAddItem={() => setSelectedList(list.id)}
            onRefetch={refetch}
          />
        ))}
      </div>

      <button
        className="floating-btn"
        title="New List"
        onClick={async () => {
          await createList();
          refetch();
        }}
      >
        +
      </button>

      {selectedList && (
        <AddItemModal
          listId={selectedList}
          onClose={() => {
            setSelectedList(null);
            refetch();
          }}
        />
      )}
    </>
  );
}