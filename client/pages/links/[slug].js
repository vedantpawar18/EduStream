import { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import Head from "next/head";
import axios from "axios";
import moment from "moment";
import { API, APP_NAME } from "../../config";
import InfiniteScroll from "react-infinite-scroller";

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
  const [popular, setPopular] = useState([]);

  const stripHTML = (data) => data.replace(/<\/?[^>]+(>|$)/g, "");

  const head = () => (
    <Head>
      <title>{`${category.name} | ${APP_NAME}`}</title>
      <meta
        name="description"
        content={stripHTML(category.content.substring(0, 160))}
      />
      <meta property="og:title" content={`${category.name} | ${APP_NAME}`} />
      <meta
        property="og:description"
        content={stripHTML(category.content.substring(0, 160))}
      />
      <meta property="og:image" content={category.image.url} />
      <meta property="og:image:secure_url" content={category.image.url} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={`${category.name} | ${APP_NAME}`} />
      <meta
        name="twitter:description"
        content={stripHTML(category.content.substring(0, 160))}
      />
      <meta name="twitter:image" content={category.image.url} />
      <meta name="twitter:creator" content="@YourTwitterHandle" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </Head>
  );

  useEffect(() => {
    loadPopular();
  }, []);

  const loadPopular = async () => {
    const response = await axios.get(`${API}/link/popular/${category.slug}`);
    setPopular(response.data);
  };

  const handleClick = async (linkId) => {
    const response = await axios.put(`${API}/click-count`, { linkId });
    loadUpdatedLinks();
  };

  const loadUpdatedLinks = async () => {
    const response = await axios.post(`${API}/category/${query.slug}`);
    setAllLinks(response.data.links);
  };

  const listOfLinks = () => {
    const uniqueLinks = Array.from(
      new Set(allLinks.map((link) => link._id))
    ).map((id) => allLinks.find((link) => link._id === id));

    return uniqueLinks.map((l, i) => (
      <div
        key={l._id}
        className="row alert p-3 mb-3"
        style={{
          backgroundColor: "rgba(251, 255, 228, 0.8)",
          backdropFilter: "blur(10px)",
          borderRadius: "10px",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div className="col-md-8" onClick={(e) => handleClick(l._id)}>
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
          {l.categories.map((c, index) => (
            <span
              key={index}
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
  };

  const loadMore = async () => {
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

  const listOfPopularLinks = () =>
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
        <div className="col-md-8">
          <div
            onClick={() => handleClick(l._id)}
            style={{ cursor: "pointer", textDecoration: "none" }}
          >
            <a href={l.url} target="_blank" style={{ color: "#3D8D7A" }}>
              <h5 className="pt-2" style={{ fontWeight: "600" }}>
                {l.title}
              </h5>
            </a>
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
          </div>
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

  return (
    <>
      {head()}
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
        <InfiniteScroll
          pageStart={0}
          loadMore={loadMore}
          hasMore={size > 0 && size >= limit}
          loader={
            <img key={0} src="/static/images/loading.gif" alt="loading" />
          }
        >
          <div className="row">
            <div className="col-md-8">{listOfLinks()}</div>
            <div className="col-md-4">
              <h2 className="lead">Most popular in {category.name}</h2>
              <div className="p-3">{listOfPopularLinks()}</div>
            </div>
          </div>
        </InfiniteScroll>
      </Layout>
    </>
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
