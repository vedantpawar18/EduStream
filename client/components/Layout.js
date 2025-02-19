import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import "nprogress/nprogress.css";
import { isAuth, logout } from "../helpers/auth";
import { Navbar, Nav, Container } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

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
        <title>EduStream</title>
      </Head>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          backgroundColor: "#FBFFE4",
          overflow: "hidden",
        }}
      >
        <Navbar
          expand="lg"
          style={{
            backgroundColor: "rgba(61, 141, 122, 0.7)",
            backdropFilter: "blur(15px)",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <Container>
            <Navbar.Brand
              href="/"
              style={{
                fontSize: "1.8rem",
                fontWeight: "700",
                color: "#FBFFE4",
              }}
            >
              EduStream
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="navbar-nav" />
            <Navbar.Collapse id="navbar-nav">
              <Nav className="ms-auto align-items-center">
                {!auth ? (
                  <>
                    <Nav.Link
                      as={Link}
                      href="/login"
                      style={{
                        fontSize: "1.1rem",
                        fontWeight: "500",
                        color: "#FBFFE4",
                        margin: "0 10px",
                      }}
                    >
                      Login
                    </Nav.Link>
                    <Nav.Link
                      as={Link}
                      href="/register"
                      style={{
                        fontSize: "1.1rem",
                        fontWeight: "500",
                        color: "#FBFFE4",
                        margin: "0 10px",
                      }}
                    >
                      Register
                    </Nav.Link>
                  </>
                ) : auth.role === "admin" ? (
                  <Nav.Link
                    as={Link}
                    href="/admin"
                    style={{
                      fontSize: "1.1rem",
                      fontWeight: "500",
                      color: "#FBFFE4",
                      margin: "0 10px",
                    }}
                  >
                    Admin: {auth.name}
                  </Nav.Link>
                ) : (
                  <Nav.Link
                    as={Link}
                    href="/user"
                    style={{
                      fontSize: "1.1rem",
                      fontWeight: "500",
                      color: "#FBFFE4",
                      margin: "0 10px",
                    }}
                  >
                    {auth.name}
                  </Nav.Link>
                )}
                {auth && (
                  <Nav.Link
                    onClick={() => {
                      logout();
                      router.push("/login");
                    }}
                    style={{
                      cursor: "pointer",
                      fontSize: "1.1rem",
                      fontWeight: "500",
                      color: "#FBFFE4",
                      margin: "0 10px",
                    }}
                  >
                    Logout
                  </Nav.Link>
                )}
                <Nav.Link
                  as={Link}
                  href="/user/link/create"
                  style={{
                    background: "linear-gradient(45deg, #FBFFE4, #A3D1C6)",
                    color: "#3D8D7A",
                    borderRadius: "30px",
                    padding: "10px 20px",
                    fontSize: "1rem",
                    fontWeight: "600",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    margin: "0 10px",
                  }}
                  className="hover-effect"
                >
                  <i className="bi bi-link-45deg me-2"></i> Submit a Link
                </Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>

        <div
          style={{
            flex: 1,
            padding: "40px 20px",
            backgroundColor: "rgba(251, 255, 228, 0.85)",
            backdropFilter: "blur(15px)",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            margin: "20px",
            borderRadius: "15px",
          }}
        >
          {children}
        </div>

        <footer
          style={{
            backgroundColor: "rgba(61, 141, 122, 0.7)",
            backdropFilter: "blur(15px)",
            color: "#FBFFE4",
            padding: "20px 0",
            textAlign: "center",
            borderTop: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <p style={{ margin: 0, fontSize: "1rem", fontWeight: "500" }}>
            © {new Date().getFullYear()} EduStream. All rights reserved.
          </p>
        </footer>
      </div>

      <style jsx>{`
        #nprogress .bar {
          background: #a3d1c6 !important; /* Matches your light teal color */
          height: 4px !important;
        }

        #nprogress .spinner {
          display: none; /* Hide the spinner for a cleaner look */
        }

        /* Hover effect for buttons and links */
        .hover-effect:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        }

        /* Adjust navbar links for mobile responsiveness */
        @media (max-width: 768px) {
          .navbar .nav-link {
            font-size: 1rem !important;
            margin: 5px 0 !important;
          }
          .navbar-nav {
            text-align: center;
          }
        }
      `}</style>
    </>
  );
};

export default Layout;
