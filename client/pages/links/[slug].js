import { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import axios from "axios";
import moment from "moment";
import { API } from "../../config";

const Links = ({
  query,
  category,
  initialLinks,
  totalLinks,
  linksLimit,
  linkSkip,
}) => {
  const [allLinks, setAllLinks] = useState(initialLinks);
  const [loading, setLoading] = useState(false);

  const loadMoreLinks = async () => {
    setLoading(true);
    const newSkip = allLinks.length;
    try {
      const response = await axios.post(`${API}/category/${query.slug}`, {
        skip: newSkip,
        limit: linksLimit,
      });
      setAllLinks((prevLinks) => [...prevLinks, ...response.data.links]);
    } catch (err) {
      console.error("Error loading more links", err);
    }
    setLoading(false);
  };

  const listOfLinks = () =>
    allLinks.map((l) => (
      <div className="row alert alert-primary p-2" key={l._id}>
        <div className="col-md-8">
          <a href={l.url} target="_blank" rel="noopener noreferrer">
            <h5 className="pt-2">{l.title}</h5>
            <h6 className="pt-2 text-danger" style={{ fontSize: "12px" }}>
              {l.url}
            </h6>
          </a>
        </div>
        <div className="col-md-4 pt-2">
          <span className="pull-right">
            {moment(l.createdAt).fromNow()} by {l.postedBy.name}
          </span>
        </div>
        <div className="col-md-12">
          <span className="badge text-dark">
            {l.type} / {l.medium}
          </span>
          {l.categories.map((c) => (
            <span key={c._id} className="badge text-success">
              {c.name}
            </span>
          ))}
        </div>
      </div>
    ));

  return (
    <Layout>
      <div className="row">
        <div className="col-md-8">
          <h1 className="display-4 font-weight-bold">
            {category.name} - URL/Links
          </h1>
          <div
            className="lead alert alert-secondary pt-4"
            dangerouslySetInnerHTML={{ __html: category.content || "" }}
          />
        </div>
        <div className="col-md-4">
          <img
            src={category.image.url}
            alt={category.name}
            style={{ width: "auto", maxHeight: "200px" }}
          />
        </div>
      </div>
      <br />
      <div className="row">
        <div className="col-md-8">{listOfLinks()}</div>
        <div className="col-md-4">
          <h2 className="lead">Most popular in {category.name}</h2>
          <p>show popular links</p>
        </div>
      </div>

      {allLinks.length < totalLinks && (
        <div className="text-center">
          <button
            className="btn btn-outline-primary"
            onClick={loadMoreLinks}
            disabled={loading}
          >
            {loading ? "Loading..." : "Load More"}
          </button>
        </div>
      )}
    </Layout>
  );
};

Links.getInitialProps = async ({ query, req }) => {
  const skip = 0;
  const limit = 2;
  try {
    const response = await axios.post(`${API}/category/${query.slug}`, {
      skip,
      limit,
    });
    return {
      query,
      category: response.data.category,
      initialLinks: response.data.links,
      totalLinks: response.data.totalLinks,
      linksLimit: limit,
      linkSkip: skip,
    };
  } catch (err) {
    console.error("Error fetching category links:", err);
    return {
      query,
      category: {},
      initialLinks: [],
      totalLinks: 0,
      linksLimit: limit,
      linkSkip: skip,
    };
  }
};

export default Links;
