import { useState } from "react";
import axios from "axios";

function Login({ setIsLoggedIn, switchToRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password }
      );

      localStorage.setItem("token", res.data.token);
      setIsLoggedIn(true);
    } catch (err) {
      alert("Login failed");
      console.log(err);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow" style={{ width: "350px" }}>
        <h3 className="text-center mb-3">Login</h3>

        <input
          type="email"
          className="form-control mb-2"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="form-control mb-3"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="btn btn-primary w-100" onClick={handleLogin}>
          Login
        </button>
      </div>

        <p className="text-center mt-2">
          Don’t have an account?{" "}
        <span
          style={{ cursor: "pointer", color: "#0d6efd" }}
          onClick={switchToRegister}
        >
          Register
        </span>
      </p>
    </div>

    
  );
}

export default Login;