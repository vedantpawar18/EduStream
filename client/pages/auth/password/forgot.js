import { useState, useEffect } from "react";
import axios from "axios";
import { showSuccessMessage, showErrorMessage } from "../../../helpers/alerts";
import { API } from "../../../config";
import Layout from "../../../components/Layout";

const ForgotPassword = () => {
  const [state, setState] = useState({
    email: "",
    buttonText: "Forgot Password",
    success: "",
    error: "",
  });
  const { email, buttonText, success, error } = state;

  const handleChange = (e) => {
    setState({ ...state, email: e.target.value, success: "", error: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`${API}/forgot-password`, { email });
      setState({
        ...state,
        email: "",
        buttonText: "Done",
        success: response.data.message,
      });
    } catch (error) {
      console.log("FORGOT PW ERROR", error);
      setState({
        ...state,
        buttonText: "Forgot Password",
        error: error.response.data.error,
      });
    }
  };

  const passwordForgotForm = () => (
    <form onSubmit={handleSubmit}>
      <div className="form-group mb-4">
        <input
          type="email"
          className="form-control input-lg rounded-3 shadow-sm"
          onChange={handleChange}
          value={email}
          placeholder="Type your email"
          required
        />
      </div>
      <div>
        <button
          style={{ backgroundColor: "#3D8D7A" }}
          className="btn btn-primary"
        >
          {buttonText}
        </button>
      </div>
    </form>
  );

  return (
    <Layout>
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <h1 className="font-weight-bold text-center text-primary mb-4">
              Forgot Password
            </h1>
            {success && showSuccessMessage(success)}
            {error && showErrorMessage(error)}
            {passwordForgotForm()}
          </div>
        </div>
      </div>

      <style jsx>{`
        .container {
          background-color: rgba(251, 255, 228, 0.8);
          backdrop-filter: blur(10px);
          border-radius: 10px;
          padding: 20px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .form-control {
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .btn-primary {
          background-color: #3d8d7a;
          border-color: #3d8d7a;
        }

        .btn-primary:hover {
          background-color: #2a6c58;
          border-color: #2a6c58;
        }

        .text-primary {
          color: #3d8d7a !important;
        }
      `}</style>
    </Layout>
  );
};

export default ForgotPassword;
