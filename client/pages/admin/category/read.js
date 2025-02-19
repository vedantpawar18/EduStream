import { useState, useEffect } from "react";
import axios from "axios";
import { API } from "../../../config";
import Link from "next/link";
import { showSuccessMessage, showErrorMessage } from "../../../helpers/alerts";
import Layout from "../../../components/Layout";
import withAdmin from "../../withAdmin";

const Read = ({ user, token }) => {
  const [state, setState] = useState({
    error: "",
    success: "",
    categories: [],
    loading: false,
  });

  const { error, success, categories, loading } = state;

  useEffect(() => {
    loadCategories();
  }, []);

  const confirmDelete = (e, slug) => {
    e.preventDefault();
    let answer = window.confirm("Are you sure you want to delete?");
    if (answer) {
      handleDelete(slug);
    }
  };

  const handleDelete = async (slug) => {
    try {
      const response = await axios.delete(`${API}/category/${slug}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("CATEGORY DELETE SUCCESS ", response);
      loadCategories();
    } catch (error) {
      console.log("CATEGORY DELETE ", error);
    }
  };

  const loadCategories = async () => {
    setState((prevState) => ({ ...prevState, loading: true }));
    try {
      const response = await axios.get(`${API}/categories`);
      setState((prevState) => ({
        ...prevState,
        categories: response.data,
        loading: false,
      }));
    } catch (err) {
      setState((prevState) => ({
        ...prevState,
        loading: false,
        error: "Failed to load categories",
      }));
      showErrorMessage("Failed to load categories");
    }
  };

  const listCategories = () =>
    categories.map((c, i) => (
      <div key={i} className="col-md-6">
        <div
          className="bg-light p-3"
          style={{
            backgroundColor: "rgba(251, 255, 228, 0.8)",
            backdropFilter: "blur(10px)",
            borderRadius: "10px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          }}
        >
          <div className="row">
            <div className="col-md-3">
              <img
                src={c.image && c.image.url}
                alt={c.name}
                style={{
                  width: "100px",
                  height: "auto",
                  borderRadius: "10px",
                  objectFit: "cover",
                }}
              />
            </div>
            <div className="col-md-6">
              <h3 style={{ color: "#3D8D7A", fontWeight: "600" }}>{c.name}</h3>
            </div>
            <div className="col-md-3">
              <Link href={`/admin/category/${c.slug}`}>
                <button
                  className="btn btn-sm btn-outline-success btn-block mb-1"
                  style={{
                    color: "#3D8D7A",
                    borderColor: "#3D8D7A",
                    transition: "background-color 0.3s, color 0.3s",
                  }}
                >
                  Update
                </button>
              </Link>

              <button
                onClick={(e) => confirmDelete(e, c.slug)}
                className="btn btn-sm btn-outline-danger btn-block"
                style={{
                  color: "#f44336",
                  borderColor: "#f44336",
                  transition: "background-color 0.3s, color 0.3s",
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    ));

  return (
    <Layout>
      <div className="container">
        <div className="row">
          <div className="col">
            <h1
              className="font-weight-bold text-center mb-4"
              style={{ color: "#3D8D7A" }}
            >
              List of Categories
            </h1>
            {error && (
              <div
                className="alert alert-danger"
                style={{ borderRadius: "8px" }}
              >
                {error}
              </div>
            )}
            {success && (
              <div
                className="alert alert-success"
                style={{ borderRadius: "8px" }}
              >
                {success}
              </div>
            )}
          </div>
        </div>

        <div className="row">
          {loading ? (
            <div className="col-12 text-center">Loading...</div>
          ) : (
            listCategories()
          )}
        </div>
      </div>

      <style jsx>{`
        .row {
          margin-top: 20px;
        }

        .btn-outline-success {
          color: #3d8d7a;
          border-color: #3d8d7a;
        }

        .btn-outline-success:hover {
          background-color: #3d8d7a;
          color: #fff;
          border-color: #3d8d7a;
        }

        .btn-outline-danger {
          color: #f44336;
          border-color: #f44336;
        }

        .btn-outline-danger:hover {
          background-color: #f44336;
          color: #fff;
          border-color: #f44336;
        }

        .alert {
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        h1 {
          color: #3d8d7a;
          font-weight: 600;
        }
      `}</style>
    </Layout>
  );
};

export default withAdmin(Read);
