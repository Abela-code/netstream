import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Plus, Pencil } from "lucide-react";
import styles from "./Profiles.module.css";

export default function Profiles() {
  const { user, profiles, selectProfile, addProfile, logout, loading } = useAuth();
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [isKids, setIsKids] = useState(false);
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="full-loader">
        <div className="spinner" />
      </div>
    );
  }

  if (!user) {
    navigate("/login");
    return null;
  }

  const handleSelect = (profile) => {
    selectProfile(profile);
    navigate("/browse");
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    await addProfile(newName.trim(), isKids);
    setNewName("");
    setIsKids(false);
    setAdding(false);
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <span className={styles.logo}>NETFLIX</span>
        <button className={styles.signOut} onClick={logout}>
          Sign Out
        </button>
      </header>

      <div className={styles.content}>
        <h1>Who's watching?</h1>

        <div className={styles.grid}>
          {profiles.map((p) => (
            <button
              key={p.id}
              className={styles.profile}
              onClick={() => handleSelect(p)}
            >
              <div className={styles.avatar}>
                <img src={p.avatar} alt={p.name} />
                {p.isKids && <span className={styles.kidsBadge}>KIDS</span>}
              </div>
              <span className={styles.name}>{p.name}</span>
            </button>
          ))}

          {profiles.length < 5 && !adding && (
            <button className={styles.addBtn} onClick={() => setAdding(true)}>
              <div className={styles.addIcon}>
                <Plus size={48} />
              </div>
              <span className={styles.name}>Add Profile</span>
            </button>
          )}
        </div>

        {adding && (
          <form className={styles.addForm} onSubmit={handleAdd}>
            <h2>Add Profile</h2>
            <input
              type="text"
              placeholder="Name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              autoFocus
              maxLength={20}
            />
            <label className={styles.kidsCheck}>
              <input
                type="checkbox"
                checked={isKids}
                onChange={(e) => setIsKids(e.target.checked)}
              />
              Kids profile?
            </label>
            <div className={styles.formActions}>
              <button type="submit" className={styles.saveBtn}>
                Continue
              </button>
              <button
                type="button"
                className={styles.cancelBtn}
                onClick={() => setAdding(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
