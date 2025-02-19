import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import axios from "axios";
import Resizer from "react-image-file-resizer";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import { API } from "../../../config";
import { showSuccessMessage, showErrorMessage } from "../../../helpers/alerts";
import Layout from "../../../components/Layout";
import withAdmin from "../../withAdmin";
import "react-quill/dist/quill.bubble.css";

const Create = ({ user, token }) => {
  const [state, setState] = useState({
    name: "",
    error: "",
    success: "",
    buttonText: "Create",
    image: "",
  });
  const [content, setContent] = useState("");
  const [imageUploadButtonName, setImageUploadButtonName] =
    useState("Upload image");

  const { name, success, error, image, buttonText } = state;

  const handleChange = (name) => (e) => {
    setState({ ...state, [name]: e.target.value, error: "", success: "" });
  };

  const handleContent = (e) => {
    setContent(e);
    setState({ ...state, success: "", error: "" });
  };

  const handleImage = (event) => {
    let fileInput = false;
    if (event.target.files[0]) {
      fileInput = true;
    }
    setImageUploadButtonName(event.target.files[0].name);
    if (fileInput) {
      Resizer.imageFileResizer(
        event.target.files[0],
        300,
        300,
        "JPEG",
        100,
        0,
        (uri) => {
          setState({ ...state, image: uri, success: "", error: "" });
        },
        "base64"
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setState({ ...state, buttonText: "Creating" });
    try {
      const response = await axios.post(
        `${API}/category`,
        { name, content, image },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setImageUploadButtonName("Upload image");
      setState({
        ...state,
        name: "",
        content: "",
        image: "",
        buttonText: "Created",
        success: `${response.data.name} is created`,
      });
    } catch (error) {
      setState({
        ...state,
        buttonText: "Create",
        error: error.response?.data?.error || "Something went wrong",
      });
    }
  };

  const createCategoryForm = () => (
    <form onSubmit={handleSubmit}>
      <div className="form-group mb-4">
        <label className="text-muted">Category Name</label>
        <input
          onChange={handleChange("name")}
          value={name}
          type="text"
          className="form-control input-lg rounded-3 shadow-sm"
          placeholder="Enter category name"
          required
        />
      </div>
      <div className="form-group mb-4">
        <label className="text-muted">Category Content</label>
        <ReactQuill
          value={content}
          onChange={handleContent}
          placeholder="Write something..."
          theme="bubble"
          className="pb-5 mb-3"
          style={{ border: "1px solid #666", borderRadius: "8px" }}
        />
      </div>
      <div className="form-group mb-4">
        <label className="btn btn-outline-secondary rounded-3 p-3 shadow-sm">
          <input
            onChange={handleImage}
            type="file"
            accept="image/*"
            className="form-control"
            hidden
          />
          {imageUploadButtonName}
        </label>
      </div>
      <div>
        <button className="btn btn-primary">
          {buttonText}
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
              Create Category
            </h1>

            {success && showSuccessMessage(success)}
            {error && showErrorMessage(error)}

            {createCategoryForm()}
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

export default withAdmin(Create);
