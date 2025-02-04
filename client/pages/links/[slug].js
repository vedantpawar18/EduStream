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
  const [limit, setLimit] = useState(linksLimit);
  const [skip, setSkip] = useState(linkSkip);
  const [size, setSize] = useState(totalLinks);
  const [loading, setLoading] = useState(false);

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

  const loadMoreLinks = async () => {
    setLoading(true);
    let toSkip = skip + limit;
    try {
      const response = await axios.post(`${API}/category/${query.slug}`, {
        skip: toSkip,
        limit: limit,
      });
      setAllLinks((prevLinks) => [...prevLinks, ...response.data.links]);
      setSize(response.data.links.length);
      setSkip(toSkip);
    } catch (err) {
      console.error("Error loading more links", err);
    }
    setLoading(false);
  };

  const loadMoreButton = () => {
    return size > 0 && size >= limit ? (
      <button
        onClick={loadMoreLinks}
        className="btn btn-outline-primary"
        disabled={loading}
      >
        {loading ? "Loading..." : "Load More"}
      </button>
    ) : null;
  };

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

      <div className="text-center pt-4 pb-5">{loadMoreButton()}</div>
    </Layout>
  );
};

Links.getInitialProps = async ({ query, req }) => {
  let skip = 0;
  let limit = 2;

  try {
    const response = await axios.post(`${API}/category/${query.slug}`, {
      skip,
      limit,
    });

    return {
      query,
      category: response.data.category,
      initialLinks: response.data.links,
      totalLinks: response.data.links.length,
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
