import { useAuth0 } from "@auth0/auth0-react";
import { ApolloProvider } from "@apollo/client/react";
import { useEffect, useState } from "react";
import { createApolloClient } from "../lib/apollo";
import Sidebar from "../components/Layout/Sidebar";
import Header from "../components/Layout/Header";
import GroceryBoard from "../components/Grocery/GroceryBoard";

export default function Dashboard() {
  const { getAccessTokenSilently } = useAuth0();
  const [client, setClient] = useState<any>(null);

  useEffect(() => {
    const init = async () => {
      const apollo = await createApolloClient(getAccessTokenSilently);
      setClient(apollo);
    };
    init();
  }, []);

  if (!client) return <div>Loading...</div>;

  return (
    <ApolloProvider client={client}>
      <div className="layout">
        <Sidebar />
        <div className="main">
          <Header />
          <GroceryBoard />
        </div>
      </div>
    </ApolloProvider>
  );
}