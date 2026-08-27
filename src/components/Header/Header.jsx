import { useEffect, useState } from "react";
import logo from "../../assets/image/logo.png";
import { Link } from "react-router-dom";
import { Search, Bell, User, ChevronDown } from "lucide-react";
import Styles from "./Header.module.css";

export default function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  // for blur
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`${Styles.header} ${isScrolled ? Styles.scrolled : ""}`}>
      <div className={Styles.container}>
        {/* logo */}
        <img className={Styles.logo} src={logo} alt="Netflix" />

        {/* navigation links */}
        <nav className={Styles.nav}>
          <Link className={Styles.navLink} to="/">
            Home
          </Link>
          <Link className={Styles.navLink} to="/tv-shows">
            TV Shows
          </Link>
          <Link className={Styles.navLink} to="/movies">
            Movies
          </Link>
          <Link className={Styles.navLink} to="/new-and-popular">
            New & Popular
          </Link>
          <Link className={Styles.navLink} to="/my-list">
            My List
          </Link>
          <Link className={Styles.navLink} to="/browse-by-language">
            Browse by Language
          </Link>
        </nav>

        {/* right side section */}
        <div className={Styles.rightSection}>
          {/* search */}
          <div className={Styles.searchContainer}>
            {/* search input */}
            {isSearchOpen && (
              <input
                type="text"
                placeholder="movie title"
                className={Styles.searchInput}
              />
            )}

            <button
              className={Styles.searchButton}
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              <Search size={20} />
            </button>
          </div>

          {/* notification */}
          <button className={Styles.iconButton}>
            <Bell size={20} />
            <span className={Styles.notificationBadge}>4</span>
          </button>

          {/* profile */}
          <div className={Styles.profileContainer}>
            <button
              className={Styles.profileButton}
              onClick={() => setIsProfileOpen(!isProfileOpen)}
            >
              {/* user icon */}
              <div className={Styles.profileAvatar}>
                <User size={20} />
              </div>
              {/* dropdown icon */}
              <ChevronDown size={20} />
            </button>
            {/* dropdowns */}
            {isProfileOpen && (
              <div className={Styles.profileMenu}>
                <Link className={Styles.profileMenuItem} to="/account">
                  Account
                </Link>
                <Link className={Styles.profileMenuItem} to="/help">
                  Help Center
                </Link>
                <hr className={Styles.profileMenuDivider} />
                <button className={Styles.profileMenuItem}>Sign out</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
