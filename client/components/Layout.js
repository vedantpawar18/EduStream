import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { isAuth, logout } from "../helpers/auth";

const Layout = ({ children }) => {
  const router = useRouter();
  const [auth, setAuth] = useState(null);

  useEffect(() => {
    setAuth(isAuth());
  }, []);

  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>My App</title>
      </Head>

      <nav
        className="navbar navbar-expand-lg navbar-dark"
        style={{
          backgroundColor: "#2f2f2f",
        }}
      >
        <div className="container">
          <Link
            href="/"
            className="navbar-brand text-light font-weight-bold"
            style={{
              fontSize: "1.5rem",
              fontWeight: "700",
            }}
          >
            My App
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              {!auth ? (
                <>
                  <li className="nav-item">
                    <Link
                      href="/login"
                      className="nav-link text-light"
                      style={{
                        fontSize: "1.1rem",
                        fontWeight: "500",
                      }}
                    >
                      Login
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      href="/register"
                      className="nav-link text-light"
                      style={{
                        fontSize: "1.1rem",
                        fontWeight: "500",
                      }}
                    >
                      Register
                    </Link>
                  </li>
                </>
              ) : auth.role === "admin" ? (
                <li className="nav-item">
                  <Link
                    href="/admin"
                    className="nav-link text-light"
                    style={{
                      fontSize: "1.1rem",
                      fontWeight: "500",
                    }}
                  >
                    Admin: {auth.name}
                  </Link>
                </li>
              ) : (
                <li className="nav-item">
                  <Link
                    href="/user"
                    className="nav-link text-light"
                    style={{
                      fontSize: "1.1rem",
                      fontWeight: "500",
                    }}
                  >
                    {auth.name}
                  </Link>
                </li>
              )}
              {auth && (
                <li className="nav-item">
                  <a
                    onClick={() => {
                      logout();
                      router.push("/login");
                    }}
                    className="nav-link text-light"
                    style={{
                      cursor: "pointer",
                      fontSize: "1.1rem",
                      fontWeight: "500",
                    }}
                  >
                    Logout
                  </a>
                </li>
              )}
              <li className="nav-item">
                <Link
                  className="nav-link text-light"
                  href="/user/link/create"
                  style={{
                    background: "linear-gradient(45deg, #ff7f50, #ff1493)",
                    color: "white",
                    borderRadius: "30px",
                    padding: "10px 20px",
                    fontSize: "1rem",
                    fontWeight: "500",
                    transition: "background 0.3s ease",
                  }}
                >
                  <i className="bi bi-link-45deg me-2"></i> Submit a Link
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <div
        className="container pt-5 pb-5 shadow-lg rounded-lg"
        style={{
          backgroundColor: "#f4f7f6",
          borderRadius: "10px",
          padding: "30px",
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        {children}
      </div>
 
      <footer
        className="bg-dark text-light py-4 text-center"
        style={{
          backgroundColor: "#2f2f2f",
          color: "white",
          padding: "20px 0",
        }}
      >
        <p style={{ margin: 0, fontSize: "1rem" }}>
          © {new Date().getFullYear()} My App. All rights reserved.
        </p>
      </footer>
    </>
  );
};

export default Layout;
