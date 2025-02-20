import { useState, useEffect } from "react";
import Layout from "../../../components/Layout";
import axios from "axios";
import withUser from "../../withUser";
import { getCookie, isAuth } from "../../../helpers/auth";
import { API } from "../../../config";
import { showSuccessMessage, showErrorMessage } from "../../../helpers/alerts";

const Update = ({ oldLink, token }) => {
  const [state, setState] = useState({
    title: oldLink.title,
    url: oldLink.url,
    categories: oldLink.categories,
    loadedCategories: [],
    success: "",
    error: "",
    type: oldLink.type,
    medium: oldLink.medium,
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

  // load categories when component mounts using useEffect
  useEffect(() => {
    loadCategories();
  }, [success]);

  const loadCategories = async () => {
    const response = await axios.get(`${API}/categories`);
    setState({ ...state, loadedCategories: response.data });
  };

  const handleTitleChange = (e) => {
    setState({ ...state, title: e.target.value, error: "", success: "" });
  };

  const handleURLChange = (e) => {
    setState({ ...state, url: e.target.value, error: "", success: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let dynamicUpdateUrl;
    if (isAuth() && isAuth().role === "admin") {
      dynamicUpdateUrl = `${API}/link/admin/${oldLink._id}`;
    } else {
      dynamicUpdateUrl = `${API}/link/${oldLink._id}`;
    }

    try {
      const response = await axios.put(
        dynamicUpdateUrl,
        { title, url, categories, type, medium },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setState({ ...state, success: "Link is updated" });
    } catch (error) {
      console.log("LINK SUBMIT ERROR", error);
      setState({ ...state, error: error.response.data.error });
    }
  };

  const handleTypeClick = (e) => {
    setState({ ...state, type: e.target.value, success: "", error: "" });
  };

  const handleMediumClick = (e) => {
    setState({ ...state, medium: e.target.value, success: "", error: "" });
  };

  const showMedium = () => (
    <>
      <div className="form-check ml-3">
        <label className="form-check-label">
          <input
            type="radio"
            onClick={handleMediumClick}
            checked={medium === "video"}
            value="video"
            className="from-check-input"
            name="medium"
          />{" "}
          Video
        </label>
      </div>

      <div className="form-check ml-3">
        <label className="form-check-label">
          <input
            type="radio"
            onClick={handleMediumClick}
            checked={medium === "book"}
            value="book"
            className="from-check-input"
            name="medium"
          />{" "}
          Book
        </label>
      </div>
    </>
  );

  const showTypes = () => (
    <>
      <div className="form-check ml-3">
        <label className="form-check-label">
          <input
            type="radio"
            onClick={handleTypeClick}
            checked={type === "free"}
            value="free"
            className="from-check-input"
            name="type"
          />{" "}
          Free
        </label>
      </div>

      <div className="form-check ml-3">
        <label className="form-check-label">
          <input
            type="radio"
            onClick={handleTypeClick}
            checked={type === "paid"}
            value="paid"
            className="from-check-input"
            name="type"
          />{" "}
          Paid
        </label>
      </div>
    </>
  );

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

  // show categories > checkbox
  const showCategories = () => {
    return (
      loadedCategories &&
      loadedCategories.map((c, i) => (
        <li className="list-unstyled" key={c._id}>
          <input
            type="checkbox"
            checked={categories.includes(c._id)}
            onChange={handleToggle(c._id)}
            className="mr-2"
          />
          <label className="form-check-label">{c.name}</label>
        </li>
      ))
    );
  };

  // link create form
  const submitLinkForm = () => (
    <form onSubmit={handleSubmit}>
      <div className="form-group mb-4">
        <label className="text-muted">Title</label>
        <input
          type="text"
          className="form-control input-lg rounded-3 shadow-sm"
          onChange={handleTitleChange}
          value={title}
          placeholder="Enter link title"
          required
        />
      </div>

      <div className="form-group mb-4">
        <label className="text-muted">URL</label>
        <input
          type="url"
          className="form-control input-lg rounded-3 shadow-sm"
          onChange={handleURLChange}
          value={url}
          placeholder="Enter link URL"
          required
        />
      </div>

      <div className="form-group">
        <label className="text-muted">Categories</label>
        <ul style={{ maxHeight: "100px", overflowY: "scroll" }}>
          {showCategories()}
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

      <div className="mb-4">
        <button
          disabled={!token}
          className="btn btn-primary"
          style={{ backgroundColor: "#3D8D7A" }}
          type="submit"
        >
          {isAuth() || token ? "Update" : "Login to update"}
        </button>
      </div>
    </form>
  );

  return (
    <Layout>
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <h1 className="font-weight-bold text-center text-primary mb-4">
              Update Link/URL
            </h1>

            {success && showSuccessMessage(success)}
            {error && showErrorMessage(error)}

            {submitLinkForm()}
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

        .btn-warning {
          background-color: #ffb74d;
          border-color: #ffb74d;
        }

        .btn-warning:hover {
          background-color: #ff9800;
          border-color: #ff9800;
        }

        .text-primary {
          color: #3d8d7a !important;
        }
      `}</style>
    </Layout>
  );
};

Update.getInitialProps = async ({ req, token, query }) => {
  const response = await axios.get(`${API}/link/${query.id}`);
  return { oldLink: response.data, token };
};

export default withUser(Update);
