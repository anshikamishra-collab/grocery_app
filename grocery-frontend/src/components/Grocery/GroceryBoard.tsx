import { gql } from "@apollo/client";
import { useQuery, useMutation } from "@apollo/client/react";
import { motion } from "framer-motion";
import { useState } from "react"; // ✅ Correct useState import
import GroceryCard from "./GroceryCard";
import AddItemModal from "./AddItemModal";

// ----------------- GraphQL Queries -----------------
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

// ----------------- TypeScript Types -----------------
type Item = { id: string; name: string; price: number };
type GroceryList = { id: string; date: string; items: Item[] };
type GetListsData = { getMyLists: GroceryList[] };

// ----------------- Component -----------------
export default function GroceryBoard() {
  const { data, refetch } = useQuery<GetListsData>(GET_LISTS); // ✅ typed
  const [createList] = useMutation(CREATE_LIST);
  const [selectedList, setSelectedList] = useState<string | null>(null); // ✅ correct useState

  return (
    <div className="board">
      <button
        className="floating-btn"
        onClick={async () => {
          await createList();
          refetch();
        }}
      >
        +
      </button>

      {data?.getMyLists.map((list) => (
        <GroceryCard
          key={list.id}
          list={list}
          onAddItem={() => setSelectedList(list.id)}
        />
      ))}

      {selectedList && (
        <AddItemModal
          listId={selectedList}
          onClose={() => {
            setSelectedList(null);
            refetch();
          }}
        />
      )}
    </div>
  );
}
