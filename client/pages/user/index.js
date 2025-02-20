import Layout from "../../components/Layout";
import Link from "next/link";
import Router from "next/router";
import axios from "axios";
import moment from "moment";
import { API } from "../../config";
import { getCookie } from "../../helpers/auth";
import withUser from "../withUser";
import { FaCog, FaPlusCircle } from "react-icons/fa";

const User = ({ user, userLinks, token }) => {
  const confirmDelete = (e, id) => {
    e.preventDefault();
    let answer = window.confirm("Are you sure you want to delete?");
    if (answer) {
      handleDelete(id);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`${API}/link/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      Router.replace("/user");
    } catch (error) {
      console.log("LINK DELETE ERROR", error);
    }
  };

  const listOfLinks = () =>
    userLinks.map((l, i) => (
      <div
        key={i}
        className="row alert p-3 mb-3"
        style={{
          backgroundColor: "rgba(251, 255, 228, 0.8)",
          backdropFilter: "blur(10px)",
          borderRadius: "10px",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div className="col-md-8">
          <a
            href={l.url}
            target="_blank"
            style={{
              textDecoration: "none",
              color: "#3D8D7A",
            }}
          >
            <h5 className="pt-2" style={{ fontWeight: "600" }}>
              {l.title}
            </h5>
            <h6
              className="pt-2"
              style={{
                fontSize: "12px",
                color: "#A3D1C6",
                wordWrap: "break-word",
                overflowWrap: "break-word",
                wordBreak: "break-word",
              }}
            >
              {l.url}
            </h6>
          </a>
        </div>
        <div className="col-md-4 pt-2">
          <span
            className="pull-right"
            style={{ color: "#3D8D7A", fontSize: "14px" }}
          >
            {moment(l.createdAt).fromNow()} by {l.postedBy.name}
          </span>
        </div>

        <div className="col-md-12">
          <span
            className="badge"
            style={{
              backgroundColor: "#B3D8A8",
              color: "#3D8D7A",
              marginRight: "5px",
            }}
          >
            {l.type} {l.medium}
          </span>
          {l.categories.map((c, i) => (
            <span
              key={i}
              className="badge"
              style={{
                backgroundColor: "#FBFFE4",
                color: "#3D8D7A",
                marginRight: "5px",
              }}
            >
              {c.name}
            </span>
          ))}
          <span
            className="badge pull-right"
            style={{ backgroundColor: "#A3D1C6", color: "#3D8D7A" }}
          >
            {l.clicks} clicks
          </span>
          <span
            onClick={(e) => confirmDelete(e, l._id)}
            className="badge text-danger pull-right"
            style={{ cursor: "pointer" }}
          >
            Delete
          </span>
          <Link href={`/user/link/${l._id}`}>
            <span
              className="badge text-warning pull-right"
              style={{ cursor: "pointer" }}
            >
              Update
            </span>
          </Link>
        </div>
      </div>
    ));

  return (
    <Layout>
      <h1 className="text-center my-3">
        {user.name}'s Dashboard{" "}
        <span className="text-danger">/{user.role}</span>
      </h1>

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
              <h5 className="card-title text-center">User Menu</h5>
              <nav>
                <ul className="nav flex-column">
                  <li className="nav-item mb-3">
                    <Link
                      href="/user/link/create"
                      className="nav-link d-flex align-items-center"
                      style={{ textDecoration: "none", color: "#3D8D7A" }}
                    >
                      <FaPlusCircle className="me-2" /> Submit a Link
                    </Link>
                  </li>
                  <li className="nav-item mb-3">
                    <Link
                      href="/user/profile/update"
                      className="nav-link d-flex align-items-center"
                      style={{ textDecoration: "none", color: "#3D8D7A" }}
                    >
                      <FaCog className="me-2" /> Update Profile
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
              marginTop:"24px"
            }}
          >
            <div className="card-body">
              <h4 className="card-title" style={{ fontWeight: "600" }}>
                Your Links
              </h4>
              <p
                className="card-text"
                style={{ fontSize: "14px", color: "#A3D1C6" }}
              >
                Manage your links below.
              </p>
              <Link href="/user/link/create">
                <button className="btn btn-primary mb-4">
                  Create New Link
                </button>
              </Link>
              {listOfLinks()}
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

        .badge {
          margin-right: 5px;
        }
      `}</style>
    </Layout>
  );
};

export default withUser(User);
