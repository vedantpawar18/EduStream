import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import axios from "axios";
import moment from "moment";
import Link from "next/link";
import { API } from "../config";

const Home = ({ categories }) => {
  const [popular, setPopular] = useState([]);

  useEffect(() => {
    loadPopular();
  }, []);

  const loadPopular = async () => {
    const response = await axios.get(`${API}/link/popular`);
    setPopular(response.data);
  };

  const handleClick = async (linkId) => {
    const response = await axios.put(`${API}/click-count`, { linkId });
    loadPopular();
  };

  const listOfLinks = () =>
    popular.map((l, i) => (
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
        <div className="col-md-8" onClick={() => handleClick(l._id)}>
          <a
            href={l.url}
            target="_blank"
            style={{ textDecoration: "none", color: "#3D8D7A" }}
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
        </div>
      </div>
    ));

  const listCategories = () =>
    categories.map((c, i) => (
      <div key={i} className="col-lg-4 col-md-6 col-sm-12 mb-4">
        <Link style={{ textDecoration: "none" }} href={`/links/${c.slug}`}>
          <div
            className="p-3 h-100"
            style={{
              backgroundColor: "rgba(179, 216, 168, 0.8)",
              backdropFilter: "blur(10px)",
              borderRadius: "10px",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              cursor: "pointer",
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
            }}
          >
            <div className="d-flex align-items-center">
              <div className="flex-shrink-0">
                <img
                  src={c.image && c.image.url}
                  alt={c.name}
                  style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "10px",
                    objectFit: "fit",
                  }}
                />
              </div>
              <div className="flex-grow-1 ms-3">
                <h3
                  style={{
                    color: "#3D8D7A",
                    fontWeight: "600",
                    fontSize: "1.25rem",
                  }}
                >
                  {c.name}
                </h3>
              </div>
            </div>
          </div>
        </Link>
      </div>
    ));

  return (
    <Layout>
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <h1 className="font-weight-bold mb-4" style={{ color: "#3D8D7A" }}>
              Browse Tutorials/Courses
            </h1>
          </div>
        </div>

        <div className="row">{listCategories()}</div>

        <div className="row pt-5">
          <div className="col-md-12">
            <h2 className="font-weight-bold pb-3" style={{ color: "#3D8D7A" }}>
              Trending Links
            </h2>
            {listOfLinks()}
          </div>
        </div>
      </div>
    </Layout>
  );
};

Home.getInitialProps = async () => {
  const response = await axios.get(`${API}/categories`);
  return {
    categories: response.data,
  };
};

export default Home;
