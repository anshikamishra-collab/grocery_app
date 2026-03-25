import { useAuth0 } from "@auth0/auth0-react";

export default function Header() {
  const { logout, user } = useAuth0();

  return (
    <div className="header">
      <h3>Welcome, {user?.name}</h3>
      <button
        onClick={() =>
          logout({ logoutParams: { returnTo: window.location.origin } })
        }
      >
        Logout
      </button>
    </div>
  );
}