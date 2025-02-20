import { useState } from "react";
import Layout from "../../../components/Layout";
import Link from "next/link";
import axios from "axios";
import moment from "moment";
import { API } from "../../../config";
import InfiniteScroll from "react-infinite-scroller";
import withAdmin from "../../withAdmin";
import { getCookie } from "../../../helpers/auth";

const Links = ({ token, links, totalLinks, linksLimit, linkSkip }) => {
  const [allLinks, setAllLinks] = useState(links);
  const [limit, setLimit] = useState(linksLimit);
  const [skip, setSkip] = useState(0);
  const [size, setSize] = useState(totalLinks);

  const confirmDelete = (e, id) => {
    e.preventDefault();
    let answer = window.confirm("Are you sure you want to delete?");
    if (answer) {
      handleDelete(id);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`${API}/link/admin/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("LINK DELETE SUCCESS ", response);
      process.browser && window.location.reload();
    } catch (error) {
      console.log("LINK DELETE ", error);
    }
  };

  const listOfLinks = () =>
    allLinks.map((l, i) => (
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

  const loadMore = async () => {
    let toSkip = skip + limit;

    const response = await axios.post(
      `${API}/links`,
      { skip: toSkip, limit },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setAllLinks([...allLinks, ...response.data]);
    setSize(response.data.length);
    setSkip(toSkip);
  };

  return (
    <Layout>
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <h2
             className="font-weight-bold pb-3" style={{ color: "#3D8D7A" }}
            >
              All Links
            </h2>
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
          <div className="row">{listOfLinks()}</div>
        </InfiniteScroll>
      </div>
    </Layout>
  );
};

Links.getInitialProps = async ({ req }) => {
  let skip = 0;
  let limit = 2;

  const token = getCookie("token", req);

  const response = await axios.post(
    `${API}/links`,
    { skip, limit },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return {
    links: response.data,
    totalLinks: response.data.length,
    linksLimit: limit,
    linkSkip: skip,
    token,
  };
};

export default withAdmin(Links);
