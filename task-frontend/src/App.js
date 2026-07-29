import { useState, useEffect } from "react";
import Login from "./Login";
import Register from "./Register";
import Dashboard from "./Dashboard";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Toaster } from "react-hot-toast";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("token")
  );

  const [showRegister, setShowRegister] = useState(false);

  // ✅ NEW: Dark mode state
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  // ✅ Apply theme to body
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("bg-dark", "text-light");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("bg-dark", "text-light");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <>
     <Toaster position="top-right" />
      {/* your routes/components */}
      {isLoggedIn ? (
        <Dashboard
          setIsLoggedIn={setIsLoggedIn}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />
      ) : showRegister ? (
        <Register
          setIsLoggedIn={setIsLoggedIn}
          switchToLogin={() => setShowRegister(false)}
          darkMode={darkMode}
        />
      ) : (
        <Login
          setIsLoggedIn={setIsLoggedIn}
          switchToRegister={() => setShowRegister(true)}
          darkMode={darkMode}
        />
      )}

      <ToastContainer position="top-right" autoClose={2000} />
    </>
  );
}

export default App;