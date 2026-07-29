import { useState } from "react";
import axios from "axios";

function Register({ setIsLoggedIn, switchToLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
      await axios.post("http://localhost:5000/api/auth/register", {
        email,
        password,
      });

      alert("Registration successful. Please login.");
      switchToLogin();
    } catch (err) {
      alert("Registration failed");
      console.log(err);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card p-4 shadow-lg border-0" style={{ width: "380px", borderRadius: "15px" }}>
        <h3 className="text-center mb-3">Create Account</h3>

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

        <button className="btn btn-success w-100 mb-2" onClick={handleRegister}>
          Register
        </button>

        <p className="text-center">
          Already have an account?{" "}
          <span
            style={{ cursor: "pointer", color: "#0d6efd" }}
            onClick={switchToLogin}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}

export default Register;