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
  console.log("category", category)

  const stripHTML = (data) => data.replace(/<\/?[^>]+(>|$)/g, "");

  const head = () => (
    <Head>
      {/* Title with dynamic category name */}
      <title>{`${category.name} | ${APP_NAME}`}</title>
  
      {/* Meta description for better search engine results */}
      <meta
        name="description"
        content={stripHTML(category.content.substring(0, 160))} 
      />
  
      {/* Open Graph meta tags for social media optimization */}
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
  
      {/* Twitter Card meta tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={`${category.name} | ${APP_NAME}`} />
      <meta
        name="twitter:description"
        content={stripHTML(category.content.substring(0, 160))}
      />
      <meta name="twitter:image" content={category.image.url} />
      <meta name="twitter:creator" content="@YourTwitterHandle" />
  
      {/* Structured data for better SERP (Search Engine Results Page) integration */}
      {/* <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: category.name,
            description: stripHTML(category.content.substring(0, 160)),
            image: category.image.url,
            mainEntityOfPage: `${APP_URL}/${category.slug}`,
          }),
        }}
      />  */}
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </Head>
  );
  
  useEffect(() => {
    loadPopular();
  }, []);

  const loadPopular = async () => {
    const response = await axios.get(`${API}/link/popular/${category.slug}`);
    // console.log(response);
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

  const listOfLinks = () =>
    allLinks.map((l, i) => (
      <div key={i} className="row alert alert-primary p-2">
        <div className="col-md-8" onClick={(e) => handleClick(l._id)}>
          <a href={l.url} target="_blank">
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
          <br />
          <span className="badge text-secondary pull-right">
            {l.clicks} clicks
          </span>
        </div>
        <div className="col-md-12">
          <span className="badge text-dark">
            {l.type} / {l.medium}
          </span>
          {l.categories.map((c, i) => (
            <span key={i} className="badge text-success">
              {c.name}
            </span>
          ))}
        </div>
      </div>
    ));

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
      <div key={i} className="row alert alert-secondary p-2">
        <div className="col-md-8" onClick={() => handleClick(l._id)}>
          <a href={l.url} target="_blank">
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
            {l.type} {l.medium}
          </span>
          {l.categories.map((c, i) => (
            <span key={i} className="badge text-success">
              {c.name}
            </span>
          ))}
          <span className="badge text-secondary pull-right">
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
