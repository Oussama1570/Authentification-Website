import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const RegisterPage = () => {
  // 🧠 Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState(null);

  const navigate = useNavigate();

  // 📤 Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(null);

    try {
      await axios.post("http://localhost:5000/api/auth/register", {
        email,
        password,
      });

      alert("Registration successful!");
      navigate("/login"); // 🔁 Redirect to login after success
    } catch (err) {
      setErrorMsg(err.response?.data?.msg || "Registration failed");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto mt-10 space-y-5 bg-white dark:bg-gray-800 p-6 shadow-md rounded"
    >
      <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white">
        📝 Create Your Account
      </h2>

      <input
        type="email"
        placeholder="Email"
        className="border p-2 w-full rounded dark:bg-gray-700 dark:text-white"
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <input
        type="password"
        placeholder="Password"
        className="border p-2 w-full rounded dark:bg-gray-700 dark:text-white"
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      {errorMsg && (
        <p className="text-sm text-red-600 text-center">{errorMsg}</p>
      )}

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded w-full hover:bg-blue-700"
      >
        Register
      </button>

      <p className="text-sm text-center text-gray-600 dark:text-gray-400">
        Already have an account?{" "}
        <Link
          to="/login"
          className="text-blue-600 hover:underline dark:text-blue-400"
        >
          Login here
        </Link>
      </p>
    </form>
  );
};

export default RegisterPage;
