import { useAuth0 } from "@auth0/auth0-react";
import Dashboard from "./pages/Dashboard";

function App() {
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0();

  if (isLoading) return <div className="center">Loading...</div>;

  if (!isAuthenticated)
    return (
      <div className="auth-screen">
        <div className="auth-card">
          <h1>Grocery Planner</h1>
          <button onClick={() => loginWithRedirect()}>Login to Continue</button>
        </div>
      </div>
    );

  return <Dashboard />;
}

export default App;
