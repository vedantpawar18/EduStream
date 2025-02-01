import Layout from "../components/Layout";
import axios from "axios";
import Link from "next/link";
import { API } from "../config";

const Home = ({ categories }) => {
  const listCategories = () =>
    categories.map((c, i) => (
      <div className="col-md-4 mb-4" key={i}>
        <Link href="/" passHref>
          <div className="card shadow-lg border-0 rounded-lg overflow-hidden hover-card">
            <div className="card-body p-3">
              <div className="row">
                <div className="col-md-4">
                  <img
                    src={c.image && c.image.url}
                    alt={c.name}
                    className="img-fluid rounded-lg shadow-sm"
                    style={{
                      maxHeight: "150px",
                      objectFit: "cover",
                    }}
                  />
                </div>
                <div className="col-md-8 d-flex align-items-center">
                  <h5 className="card-title text-truncate">{c.name}</h5>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </div>
    ));

  return (
    <Layout>
      <div className="container mt-5">
        <div className="row mb-4">
          <div className="col-md-12 text-center">
            <h1 className="font-weight-bold display-4 text-primary mb-4">
              Browse Tutorials & Courses
            </h1>
            <p className="lead text-muted">
              Explore a variety of categories and enhance your learning journey.
            </p>
          </div>
        </div>

        <div className="row">{listCategories()}</div>
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
