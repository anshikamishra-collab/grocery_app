import { useAuth0 } from "@auth0/auth0-react";

export default function Header() {
  const { logout, user } = useAuth0();

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "U";

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <div className="header">
      <div className="header-left">
        <h3>
          {greeting}, {user?.name?.split(" ")[0] ?? "there"} 👋
        </h3>
        <p>Here's your grocery overview</p>
      </div>

      <div className="header-right">
        <div className="header-avatar" title={user?.name}>
          {user?.picture ? (
            <img
              src={user.picture}
              alt={user.name}
              style={{
                width: "100%",
                height: "100%",
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />
          ) : (
            initials
          )}
        </div>
        <button
          className="logout-btn"
          onClick={() =>
            logout({ logoutParams: { returnTo: window.location.origin } })
          }
        >
          ↩ Logout
        </button>
      </div>
    </div>
  );
}
