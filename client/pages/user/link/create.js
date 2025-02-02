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
        <div className="form-check ml-3" key={typeOption}>
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
      ))}
    </>
  );

  const showMedium = () => (
    <>
      {["video", "book"].map((mediumOption) => (
        <div className="form-check ml-3" key={mediumOption}>
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
      ))}
    </>
  );

  const renderCategories = () =>
    loadedCategories.map((c) => (
      <li className="list-unstyled" key={c._id}>
        <input
          type="checkbox"
          onChange={handleCategoryToggle(c._id)}
          className="mr-2"
          checked={categories.includes(c._id)}
        />
        <label className="form-check-label">{c.name}</label>
      </li>
    ));

  return (
    <Layout>
      <div className="row">
        <div className="col-md-12">
          <h1>Submit Link/URL</h1>
          <br />
        </div>
      </div>

      <div className="row">
        <div className="col-md-4">
          <div className="form-group">
            <label className="text-muted">Category</label>
            <ul style={{ maxHeight: "150px", overflowY: "auto" }}>
              {renderCategories()}
            </ul>
          </div>

          <div className="form-group">
            <label className="text-muted">Type</label>
            {showTypes()}
          </div>

          <div className="form-group">
            <label className="text-muted">Medium</label>
            {showMedium()}
          </div>
        </div>

        <div className="col-md-8">
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
              />
            </div>
            <div className="form-group">
              <label className="text-muted">URL</label>
              <input
                type="url"
                className="form-control"
                value={url}
                onChange={(e) => handleChange(e, "url")}
              />
            </div>
            <button
              disabled={!token}
              className="btn btn-outline-warning"
              type="submit"
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
