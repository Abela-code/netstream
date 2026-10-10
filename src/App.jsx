import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profiles from "./pages/Profiles";
import Browse from "./pages/Browse";
import Detail from "./pages/Detail";
import Watch from "./pages/Watch";
import MyList from "./pages/MyList";
import Search from "./pages/Search";

function ProtectedRoute({ children }) {
  const { user, activeProfile, loading } = useAuth();
  if (loading) {
    return (
      <div className="full-loader">
        <div className="spinner" />
      </div>
    );
  }
  if (!user) return <Navigate to="/login" replace />;
  if (!activeProfile) return <Navigate to="/profiles" replace />;
  return children;
}

function PublicOnly({ children }) {
  const { user, activeProfile, loading } = useAuth();
  if (loading) {
    return (
      <div className="full-loader">
        <div className="spinner" />
      </div>
    );
  }
  if (user && activeProfile) return <Navigate to="/browse" replace />;
  if (user && !activeProfile) return <Navigate to="/profiles" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/browse" replace />} />
      <Route
        path="/login"
        element={
          <PublicOnly>
            <Login />
          </PublicOnly>
        }
      />
      <Route
        path="/signup"
        element={
          <PublicOnly>
            <Signup />
          </PublicOnly>
        }
      />
      <Route path="/profiles" element={<Profiles />} />
      <Route
        path="/browse"
        element={
          <ProtectedRoute>
            <Browse />
          </ProtectedRoute>
        }
      />
      <Route
        path="/title/:type/:id"
        element={
          <ProtectedRoute>
            <Detail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/watch/:type/:id"
        element={
          <ProtectedRoute>
            <Watch />
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-list"
        element={
          <ProtectedRoute>
            <MyList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/search"
        element={
          <ProtectedRoute>
            <Search />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/browse" replace />} />
    </Routes>
  );
}
