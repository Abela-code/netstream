import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Search, Bell, ChevronDown } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import styles from "./Navbar.module.css";

const navLinks = [
  { label: "Home", path: "/browse" },
  { label: "TV Shows", path: "/browse?category=tv" },
  { label: "Movies", path: "/browse?category=movies" },
  { label: "New & Popular", path: "/browse?category=new" },
  { label: "My List", path: "/my-list" },
  { label: "Browse by Language", path: "/browse?category=language" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { activeProfile, logout, profiles, selectProfile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const switchProfile = () => {
    navigate("/profiles");
  };

  const isActive = (path) => {
    if (path === "/browse") {
      return location.pathname === "/browse" && !location.search;
    }
    if (path.startsWith("/browse?")) {
      return location.pathname === "/browse" && location.search === path.slice(path.indexOf("?"));
    }
    return location.pathname === path;
  };

  return (
    <header className={`${styles.nav} ${scrolled ? styles.scrolled : ""}`}>
      <div className={styles.inner}>
        <div className={styles.left}>
          <Link to="/browse" className={styles.logo}>
            NETFLIX
          </Link>
          <nav className={styles.links}>
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={isActive(link.path) ? styles.active : ""}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className={styles.right}>
          <button
            className={styles.iconBtn}
            onClick={() => navigate("/search")}
            aria-label="Search"
          >
            <Search size={22} />
          </button>
          <button className={styles.iconBtn} aria-label="Notifications">
            <Bell size={22} />
          </button>

          <div
            className={styles.profileMenu}
            onMouseEnter={() => setMenuOpen(true)}
            onMouseLeave={() => setMenuOpen(false)}
          >
            <button className={styles.profileBtn}>
              {activeProfile && (
                <img
                  src={activeProfile.avatar}
                  alt={activeProfile.name}
                  className={styles.avatar}
                />
              )}
              <ChevronDown size={16} className={menuOpen ? styles.chevronOpen : ""} />
            </button>

            {menuOpen && (
              <div className={styles.dropdown}>
                {profiles.map((p) => (
                  <button
                    key={p.id}
                    className={styles.dropdownItem}
                    onClick={() => {
                      selectProfile(p);
                      setMenuOpen(false);
                    }}
                  >
                    <img src={p.avatar} alt={p.name} />
                    <span>{p.name}</span>
                  </button>
                ))}
                <div className={styles.divider} />
                <button className={styles.dropdownItem} onClick={switchProfile}>
                  Manage Profiles
                </button>
                <button className={styles.dropdownItem} onClick={handleLogout}>
                  Sign out of Netflix
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
