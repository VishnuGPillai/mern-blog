import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Loader from "../components/Loader";
import Avatar from "../images/avatar.png";

const Authors = () => {
  const [authors, setAuthors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getAuthors = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/users`
        );
        setAuthors(response?.data);
      } catch (error) {
        console.log(error);
      }

      setIsLoading(false);
    };
    getAuthors();
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <section className="authors">
      {authors.length > 0 ? (
        <div className="container authors__container">
          {authors.map(({ _id: id, avatar, name, posts }) => {
            return (
              <Link className="author" key={id} to={`/posts/users/${id}`}>
                <div className="author__avatar">
                  {/* <img src={`${process.env.REACT_APP_ASSETS_URL}/uploads/${avatar}`} alt={`avatar of ${name}`} /> */}
                  {avatar ? (
                    <img src={avatar} alt={`avatar of ${name}`} />
                  ) : (
                    <img src={Avatar} alt={`avatar of ${name}`} />
                  )}
                </div>
                <div className="author__info">
                  <h4>{name}</h4>
                  <p>{posts}</p>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <h2 className="cēntēr̥">No Authors Found</h2>
      )}
    </section>
  );
};

export default Authors;
