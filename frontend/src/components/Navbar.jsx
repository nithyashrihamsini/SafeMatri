import { NavLink, Link } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="navbar">
      <Link to="/" className="brand">SafeMatri</Link>
      <nav>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/screen">Check my health</NavLink>
        <NavLink to="/dashboard">Health worker</NavLink>
      </nav>
    </header>
  );
}