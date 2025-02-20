import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import Router from "next/router";
import axios from "axios";
import { showSuccessMessage, showErrorMessage } from "../helpers/alerts";
import { API } from "../config";
import { isAuth } from "../helpers/auth";

const Register = () => {
  const [state, setState] = useState({
    name: "",
    email: "",
    password: "",
    error: "",
    success: "",
    buttonText: "Register",
    loadedCategories: [],
    categories: [],
  });

  const {
    name,
    email,
    password,
    error,
    success,
    buttonText,
    loadedCategories,
    categories,
  } = state;

  useEffect(() => {
    isAuth() && Router.push("/");
  }, []);

  // load categories when component mounts using useEffect
  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    const response = await axios.get(`${API}/categories`);
    setState({ ...state, loadedCategories: response.data });
  };

  const handleToggle = (c) => () => {
    const clickedCategory = categories.indexOf(c);
    const all = [...categories];

    if (clickedCategory === -1) {
      all.push(c);
    } else {
      all.splice(clickedCategory, 1);
    }

    setState({ ...state, categories: all, success: "", error: "" });
  };

  const showCategories = () => {
    return (
      loadedCategories &&
      loadedCategories.map((c, i) => (
        <div className="col-lg-3 col-md-4 col-sm-6 mb-3" key={c._id}>
          <div className="form-check">
            <input
              type="checkbox"
              onChange={handleToggle(c._id)}
              className="form-check-input"
              checked={categories.includes(c._id)}
            />
            <label className="form-check-label">{c.name}</label>
          </div>
        </div>
      ))
    );
  };

  const handleChange = (name) => (e) => {
    setState({
      ...state,
      [name]: e.target.value,
      error: "",
      success: "",
      buttonText: "Register",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setState({ ...state, buttonText: "Registering" });
    try {
      const response = await axios.post(`${API}/register`, {
        name,
        email,
        password,
        categories,
      });
      setState({
        ...state,
        name: "",
        email: "",
        password: "",
        buttonText: "Submitted",
        success: response.data.message,
      });
    } catch (error) {
      setState({
        ...state,
        buttonText: "Register",
        error: error.response.data.error,
      });
    }
  };

  const registerForm = () => (
    <form onSubmit={handleSubmit}>
      <div className="form-group" style={{ marginBottom: "12px" }}>
        <input
          value={name}
          onChange={handleChange("name")}
          type="text"
          className="form-control"
          style={{
            borderRadius: "8px",
            padding: "12px",
            backgroundColor: "#F7F7F7",
            border: "1px solid #ddd",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.05)",
          }}
          placeholder="Type your name"
          required
        />
      </div>
      <div className="form-group" style={{ marginBottom: "12px" }}>
        <input
          value={email}
          onChange={handleChange("email")}
          type="email"
          className="form-control"
          style={{
            borderRadius: "8px",
            padding: "12px",
            backgroundColor: "#F7F7F7",
            border: "1px solid #ddd",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.05)",
          }}
          placeholder="Type your email"
          required
        />
      </div>
      <div className="form-group" style={{ marginBottom: "12px" }}>
        <input
          value={password}
          onChange={handleChange("password")}
          type="password"
          className="form-control"
          style={{
            borderRadius: "8px",
            padding: "12px",
            backgroundColor: "#F7F7F7",
            border: "1px solid #ddd",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.05)",
          }}
          placeholder="Type your password"
          required
        />
      </div>

      <div className="form-group" style={{ marginBottom: "12px" }}>
        <div className="row">
          <div className="col-12">
            <div className="form-group">
              <label className="text-muted">Category</label>
              <div className="row"> {showCategories()}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="form-group">
        <button
          className="btn btn-primary btn-block"
          style={{
            backgroundColor: "#2C6A4B",
            color: "white",
            padding: "12px",
            borderRadius: "8px",
            fontWeight: "600",
            transition: "background-color 0.3s ease-in-out",
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
          background: "rgba(255, 255, 255, 0.8)",
          borderRadius: "12px",
          padding: "20px",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h1
          style={{
            color: "#2C6A4B",
            fontWeight: "600",
            fontSize: "30px",
            textAlign: "center",
          }}
        >
          Register
        </h1>
        <br />
        {success && showSuccessMessage(success)}
        {error && showErrorMessage(error)}
        {registerForm()}
      </div>
    </Layout>
  );
};

export default Register;
