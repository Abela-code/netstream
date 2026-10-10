# Netflix Clone (MVP)

Modern Netflix-style streaming UI built with **React 19 + Vite + Firebase**.

## Features

- **Real Authentication** – Email/Password + Google (Firebase Auth)
- **Multiple Profiles** – Netflix-style profile selection (up to 5)
- **My List** – Saved to Firestore per profile
- **Continue Watching** – Progress tracking saved to backend
- **Top 10** – Ranked row
- **AI Recommendations** – Personalized + "Because you watched X"
- **Full Mock Video Player** – Progress bar, episodes, controls
- **Search** – Live TMDB multi-search
- **Detail Pages** – Full title info + similar titles
- **Responsive** – Works on mobile, tablet, desktop
- **Modern UI** – Clean Netflix-inspired design

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Environment

`.env` already contains your TMDB key:

```
VITE_API_KEY=add your TMDB key
```

### 3. Firebase Console (important!)

1. Go to [Firebase Console](https://console.firebase.google.com) → your project 
2. **Authentication** → Sign-in method → Enable **Email/Password** and **Google**
3. **Firestore Database** → Create database (start in **test mode** for development)
4. (Optional) Add your domain to authorized domains under Authentication → Settings

### 4. Run

```bash
npm run dev
```

Open http://localhost:5173

## Project Structure

```
src/
  components/
    Card/          # Movie/TV card with hover actions
    Hero/          # Banner hero section
    Navbar/        # Fixed navigation
    Row/           # Horizontal scrolling row
  context/
    AuthContext    # Auth + profiles
    UserDataContext # My List + Continue Watching
  firebase/
    config.js      # Firebase init
  pages/
    Login, Signup, Profiles, Browse, Detail, Watch, MyList, Search
  services/
    tmdb.js        # TMDB API + recommendation engine
```

## Routes

| Path | Description |
|------|-------------|
| `/login` | Sign in |
| `/signup` | Create account |
| `/profiles` | Choose / manage profiles |
| `/browse` | Home feed |
| `/title/:type/:id` | Detail page |
| `/watch/:type/:id` | Mock video player |
| `/my-list` | Your saved list |
| `/search` | Search |

## Notes

- The video player is a **mock** (fake progress). We can later swap it for real trailers.
- Recommendations are rule-based "AI" (genre similarity + ratings). Can be upgraded to real LLM later.
- Keep Firestore in test mode only for development. Add proper security rules before production.
