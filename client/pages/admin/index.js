import Layout from "../../components/Layout";
import withAdmin from "../withAdmin";
import Link from "next/link";
import { FaCog, FaPlusCircle } from "react-icons/fa"; // Example for adding icons

const Admin = ({ user }) => (
  <Layout>
    <h1 className="text-center my-5">Admin Dashboard</h1>

    <div className="row mt-4">
      {/* Sidebar Section */}
      <div className="col-md-3">
        <div className="card shadow-sm">
          <div className="card-body">
            <h5 className="card-title text-center">Admin Menu</h5>
            <nav>
              <ul className="nav flex-column">
                <li className="nav-item mb-3">
                  <Link
                    href="/admin/category/create"
                    className="nav-link d-flex align-items-center"
                  >
                    <FaPlusCircle className="me-2" /> Create Category
                  </Link>
                </li>
                {/* Add other navigation links here */}
                <li className="nav-item mb-3">
                  <Link
                    href="/admin/category/read"
                    className="nav-link d-flex align-items-center"
                  >
                    <FaCog className="me-2" />All Categories
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>

      {/* Main Content Section */}
      <div className="col-md-9">
        <div className="card shadow-sm">
          <div className="card-body">
            <h4 className="card-title">
              Welcome, {user ? user.name : "Admin"}
            </h4>
            <p className="card-text">
              Here you can manage categories, settings, and more.
            </p>
            {/* Additional content for the main area can go here */}
            <button className="btn btn-primary">Create New Category</button>
          </div>
        </div>
      </div>
    </div>
  </Layout>
);

export default withAdmin(Admin);
