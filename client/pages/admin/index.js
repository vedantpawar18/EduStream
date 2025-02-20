import Layout from "../../components/Layout";
import withAdmin from "../withAdmin";
import Link from "next/link";
import { FaCog, FaPlusCircle } from "react-icons/fa";

const Admin = ({ user }) => (
  <Layout>
    <h1 className="text-center my-2">Admin Dashboard</h1>

    <div className="row mt-2">
      <div className="col-md-3">
        <div
          className="card shadow-sm"
          style={{
            backgroundColor: "rgba(251, 255, 228, 0.8)",
            backdropFilter: "blur(10px)",
            borderRadius: "10px",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          }}
        >
          <div className="card-body">
            <h5 className="card-title text-center">Admin Menu</h5>
            <nav>
              <ul className="nav flex-column">
                <li className="nav-item mb-3">
                  <Link
                    href="/admin/category/create"
                    className="nav-link d-flex align-items-center"
                    style={{ textDecoration: "none", color: "#3D8D7A" }}
                  >
                    <FaPlusCircle className="me-2" /> Create Category
                  </Link>
                </li>
                <li className="nav-item mb-3">
                  <Link
                    href="/admin/category/read"
                    className="nav-link d-flex align-items-center"
                    style={{ textDecoration: "none", color: "#3D8D7A" }}
                  >
                    <FaCog className="me-2" /> All Categories
                  </Link>
                </li>
                <li className="nav-item mb-3">
                  <Link
                    href="/admin/link/read"
                    className="nav-link d-flex align-items-center"
                    style={{ textDecoration: "none", color: "#3D8D7A" }}
                  >
                    <FaCog className="me-2" /> All Links
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>

      <div className="col-md-9">
        <div
          className="card shadow-sm"
          style={{
            backgroundColor: "rgba(251, 255, 228, 0.8)",
            backdropFilter: "blur(10px)",
            borderRadius: "10px",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          }}
        >
          <div className="card-body">
            <h4 className="card-title" style={{ fontWeight: "600" }}>
              Welcome, {user ? user.name : "Admin"}
            </h4>
            <p
              className="card-text"
              style={{ fontSize: "14px", color: "#A3D1C6" }}
            >
              Here you can manage categories, settings, and more.
            </p>
            <Link href="/admin/category/create">
              <button className="btn btn-primary">Create New Category</button>
            </Link>
          </div>
        </div>
      </div>
    </div>

    <style jsx>{`
      .nav-link {
        word-wrap: break-word;
        overflow-wrap: break-word;
        word-break: break-word;
      }

      .card-title {
        font-weight: 600;
        font-size: 1.5rem;
      }

      .card-text {
        color: #a3d1c6;
        font-size: 14px;
      }

      .btn-primary {
        background-color: #3d8d7a;
        border-color: #3d8d7a;
      }

      .btn-primary:hover {
        background-color: #2a6c58;
        border-color: #2a6c58;
      }
    `}</style>
  </Layout>
);

export default withAdmin(Admin);
