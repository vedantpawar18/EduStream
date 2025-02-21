import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import Link from "next/link";
import Router from "next/router";
import axios from "axios";
import { showSuccessMessage, showErrorMessage } from "../helpers/alerts";
import { API } from "../config";
import { authenticate, isAuth } from "../helpers/auth";

const Login = () => {
  const [state, setState] = useState({
    email: "",
    password: "",
    error: "",
    success: "",
    buttonText: "Login",
  });

  useEffect(() => {
    isAuth() && Router.push("/");
  }, []);

  const { email, password, error, success, buttonText } = state;

  const handleChange = (name) => (e) => {
    setState({
      ...state,
      [name]: e.target.value,
      error: "",
      success: "",
      buttonText: "Login",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setState({ ...state, buttonText: "Logging in" });
    try {
      const response = await axios.post(`${API}/login`, {
        email,
        password,
      });
      authenticate(response, () =>
        isAuth() && isAuth().role === "admin"
          ? Router.push("/admin")
          : Router.push("/user")
      );
    } catch (error) {
      setState({
        ...state,
        buttonText: "Login",
        error: error.response.data.error,
      });
    }
  };

  const loginForm = () => (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <input
          value={email}
          onChange={handleChange("email")}
          type="email"
          className="form-control"
          placeholder="Type your email"
          required
          style={{
            padding: "15px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            marginBottom: "15px",
            fontSize: "16px",
          }}
        />
      </div>
      <div className="form-group">
        <input
          value={password}
          onChange={handleChange("password")}
          type="password"
          className="form-control"
          placeholder="Type your password"
          required
          style={{
            padding: "15px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            marginBottom: "15px",
            fontSize: "16px",
          }}
        />
      </div>
      <div className="form-group">
        <button
          className="btn btn-outline-warning"
          style={{
            width: "100%",
            padding: "12px",
            backgroundColor: "#2C6A4B",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "16px",
            transition: "all 0.3s",
          }}
        >
          {buttonText}
        </button>
      </div>
    </form>
  );

  return (
    <Layout>
      <div
        className="col-md-6 offset-md-3"
        style={{
          background: "rgba(255, 255, 255, 0.2)",
          backdropFilter: "blur(10px)",
          borderRadius: "15px",
          padding: "30px",
          boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
          transition: "all 0.3s",
        }}
      >
        <h1
          style={{
            color: "#2C6A4B",
            fontSize: "32px",
            fontWeight: "600",
            textAlign: "center",
          }}
        >
          Login
        </h1>
        <br />
        {success && showSuccessMessage(success)}
        {error && showErrorMessage(error)}
        {loginForm()}
        <Link
          href="/auth/password/forgot"
          className="text-danger float-right"
          style={{
            fontSize: "14px",
            marginTop: "10px",
            display: "block",
            textDecoration: "underline",
          }}
        >
          Forgot Password?
        </Link>
      </div>
    </Layout>
  );
};

export default Login;
