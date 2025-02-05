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

  const confirmDelete = (slug) => {
    console.log("delete > ", slug);
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
      <Link key={i} href={`/links/${c.slug}`}>
        <div className="bg-light p-3 col-md-6">
          <div className="row">
            <div className="col-md-3">
              <img
                src={c.image && c.image.url}
                alt={c.name}
                style={{ width: "100px", height: "auto" }}
                className="pr-3"
              />
            </div>
            <div className="col-md-6">
              <h3>{c.name}</h3>
            </div>
            <div className="col-md-3">
              <Link href={`/admin/category/${c.slug}`}>
                <button className="btn btn-sm btn-outline-success btn-block mb-1">
                  Update
                </button>
              </Link>

              <button
                onClick={() => confirmDelete(c.slug)}
                className="btn btn-sm btn-outline-danger btn-block"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </Link>
    ));

  return (
    <Layout>
      <div className="row">
        <div className="col">
          <h1>List of Categories</h1>
          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}
        </div>
      </div>

      <div className="row">
        {loading ? (
          <div className="col-12 text-center">Loading...</div>
        ) : (
          listCategories()
        )}
      </div>
    </Layout>
  );
};

export default withAdmin(Read);
