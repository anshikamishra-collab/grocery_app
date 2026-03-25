import { useAuth0 } from "@auth0/auth0-react";
import Dashboard from "./pages/Dashboard";

function App() {
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0();

  if (isLoading)
    return (
      <div className="center">
        <div className="spinner" />
        <span>Loading...</span>
      </div>
    );

  if (!isAuthenticated)
    return (
      <div className="auth-screen">
        <div className="auth-card">
          <div className="auth-logo">🛒</div>
          <h1>Grocery Planner</h1>
          <p className="auth-tagline">Plan smarter, shop better.</p>
          <button onClick={() => loginWithRedirect()}>
            Login to Continue →
          </button>
        </div>
      </div>
    );

  return <Dashboard />;
}

export default App;