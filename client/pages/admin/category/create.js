import { useState } from "react";
import axios from "axios";
import { API } from "../../../config";
import { showSuccessMessage, showErrorMessage } from "../../../helpers/alerts";
import Layout from "../../../components/Layout";
import withAdmin from "../../withAdmin";

const Create = ({ user, token }) => {
  const [state, setState] = useState({
    name: "",
    content: "",
    error: "",
    success: "",
    formData: process.browser ? new FormData() : null,
    buttonText: "Create",
    imageUploadText: "Upload Image",
  });

  const {
    name,
    content,
    success,
    error,
    formData,
    buttonText,
    imageUploadText,
  } = state;

  const handleChange = (name) => (e) => {
    const value = name === "image" ? e.target.files[0] : e.target.value;
    const imageName =
      name === "image" ? e.target.files[0]?.name : "Upload Image";
    formData.set(name, value);
    setState({
      ...state,
      [name]: value,
      error: "",
      success: "",
      imageUploadText: imageName,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setState({ ...state, buttonText: "Creating..." });

    try {
      const response = await axios.post(`${API}/category`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setState({
        ...state,
        name: "",
        content: "",
        formData: new FormData(),
        buttonText: "Created",
        imageUploadText: "Upload Image",
        success: `${response.data.name} has been created successfully!`,
      });
    } catch (err) {
      setState({
        ...state,
        buttonText: "Create",
        error: err.response?.data?.error || "An error occurred. Please try again.",
      });
    }
  };

  const createCategoryForm = () => (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow-sm">
      <div className="form-group mb-3">
        <label className="text-muted">Name</label>
        <input
          onChange={handleChange("name")}
          value={name}
          type="text"
          className="form-control"
          required
          placeholder="Enter category name"
        />
      </div>
      <div className="form-group mb-3">
        <label className="text-muted">Content</label>
        <textarea
          onChange={handleChange("content")}
          value={content}
          className="form-control"
          required
          placeholder="Enter category description"
        />
      </div>
      <div className="form-group mb-3">
        <label className="btn btn-outline-secondary w-100 text-center">
          {imageUploadText}
          <input
            onChange={handleChange("image")}
            type="file"
            accept="image/*"
            className="form-control"
            hidden
          />
        </label>
      </div>
      <div>
        <button type="submit" className="btn btn-primary w-100">{buttonText}</button>
      </div>
    </form>
  );

  return (
    <Layout>
      <div className="row">
        <div className="col-md-8 offset-md-2">
          <h1 className="text-center mb-4">Create Category</h1>
          {success && showSuccessMessage(success)}
          {error && showErrorMessage(error)}
          {createCategoryForm()}
        </div>
      </div>
    </Layout>
  );
};

export default withAdmin(Create);
