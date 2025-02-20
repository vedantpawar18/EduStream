import { useState, useEffect } from "react";
import Layout from "../../../components/Layout";
import axios from "axios";
import { getCookie, isAuth } from "../../../helpers/auth";
import { API } from "../../../config";
import { showSuccessMessage, showErrorMessage } from "../../../helpers/alerts";

const Create = ({ token }) => {
  const [state, setState] = useState({
    title: "",
    url: "",
    categories: [],
    loadedCategories: [],
    success: "",
    error: "",
    type: "",
    medium: "",
  });

  const {
    title,
    url,
    categories,
    loadedCategories,
    success,
    error,
    type,
    medium,
  } = state;

  useEffect(() => {
    loadCategories();
  }, [success]);

  const loadCategories = async () => {
    try {
      const { data } = await axios.get(`${API}/categories`);
      setState((prevState) => ({ ...prevState, loadedCategories: data }));
    } catch (err) {
      console.error("Failed to load categories:", err);
    }
  };

  const handleChange = (e, field) => {
    setState((prevState) => ({
      ...prevState,
      [field]: e.target.value,
      error: "",
      success: "",
    }));
  };

  const handleCategoryToggle = (category) => () => {
    setState((prevState) => {
      const updatedCategories = prevState.categories.includes(category)
        ? prevState.categories.filter((c) => c !== category)
        : [...prevState.categories, category];
      return {
        ...prevState,
        categories: updatedCategories,
        error: "",
        success: "",
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `${API}/link`,
        { title, url, categories, type, medium },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setState({
        ...state,
        title: "",
        url: "",
        success: "Link is created successfully!",
        error: "",
        categories: [],
        type: "",
        medium: "",
      });
    } catch (err) {
      setState({ ...state, error: err.response.data.error });
    }
  };

  const showTypes = () => (
    <>
      {["free", "paid"].map((typeOption) => (
        <div className="col-lg-3 col-md-4 col-sm-6 mb-3" key={typeOption}>
          <div className="form-check">
            <input
              type="radio"
              onChange={() =>
                handleChange({ target: { value: typeOption } }, "type")
              }
              checked={type === typeOption}
              value={typeOption}
              className="form-check-input"
              name="type"
            />
            <label className="form-check-label">
              {typeOption.charAt(0).toUpperCase() + typeOption.slice(1)}
            </label>
          </div>
        </div>
      ))}
    </>
  );

  const showMedium = () => (
    <>
      {["video", "book"].map((mediumOption) => (
        <div className="col-lg-3 col-md-4 col-sm-6 mb-3" key={mediumOption}>
          <div className="form-check">
            <input
              type="radio"
              onChange={() =>
                handleChange({ target: { value: mediumOption } }, "medium")
              }
              checked={medium === mediumOption}
              value={mediumOption}
              className="form-check-input"
              name="medium"
            />
            <label className="form-check-label">
              {mediumOption.charAt(0).toUpperCase() + mediumOption.slice(1)}
            </label>
          </div>
        </div>
      ))}
    </>
  );

  const renderCategories = () =>
    loadedCategories.map((c) => (
      <div className="col-lg-3 col-md-4 col-sm-6 mb-3" key={c._id}>
        <div className="form-check">
          <input
            type="checkbox"
            onChange={handleCategoryToggle(c._id)}
            className="form-check-input"
            checked={categories.includes(c._id)}
          />
          <label className="form-check-label">{c.name}</label>
        </div>
      </div>
    ));

  return (
    <Layout>
      <div
        className="row justify-content-center"
        style={{
          background: "rgba(255, 255, 255, 0.2)",
          backdropFilter: "blur(10px)",
          borderRadius: "15px",
          padding: "30px",
          boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
          transition: "all 0.3s",
        }}
      >
        <div className="col-md-8">
          <h1
            style={{
              color: "#2C6A4B",
              fontSize: "32px",
              fontWeight: "600",
              textAlign: "center",
            }}
          >
            Submit Link/URL
          </h1>
          <br />
          {success && showSuccessMessage(success)}
          {error && showErrorMessage(error)}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="text-muted">Title</label>
              <input
                type="text"
                className="form-control"
                value={title}
                onChange={(e) => handleChange(e, "title")}
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
              <label className="text-muted">URL</label>
              <input
                type="url"
                className="form-control"
                value={url}
                onChange={(e) => handleChange(e, "url")}
                style={{
                  padding: "15px",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                  marginBottom: "15px",
                  fontSize: "16px",
                }}
              />
            </div>

            <div className="row">
              <div className="col-12">
                <div className="form-group">
                  <label className="text-muted">Category</label>
                  <div className="row">{renderCategories()}</div>
                </div>
              </div>

              <div className="row">
                <div className="col-12">
                  <div className="form-group">
                    <label className="text-muted">Type</label>
                    <div className="row">{showTypes()}</div>
                  </div>

                  <div className="form-group">
                    <label className="text-muted">Medium</label>
                    <div className="row">{showMedium()}</div>
                  </div>
                </div>
              </div>
            </div>

            <button
              disabled={!token}
              className="btn btn-outline-warning"
              type="submit"
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
              {isAuth() || token ? "Post" : "Login to post"}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

Create.getInitialProps = ({ req }) => {
  const token = getCookie("token", req);
  return { token };
};

export default Create;
