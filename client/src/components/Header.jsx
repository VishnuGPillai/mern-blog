import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Logo from "../images/logo.jpeg";
// import BlogLogo from "../images/blog-logo.avif";
import BlogLogo from "../images/new_blog_logo.png";
import { AiOutlineClose } from "react-icons/ai";
import { FaBars } from "react-icons/fa";

import { UserContext } from "../context/userContext";

const Header = () => {
  const [isNavShowing, setIsNavShowing] = useState(false);
  const { currentUser } = useContext(UserContext);

useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 800) setIsNavShowing(true);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
  }, []);
  
  const closeNavHandler = () => {
    if (window.innerWidth < 800) {
      setIsNavShowing(false);
    } else {
      setIsNavShowing(true);
    }
  };

  return (
    <nav>
      <div className="container nav__container">
        <Link to="/" className="nav__logo" onClick={closeNavHandler}>
          <img src={BlogLogo} className="blog__logo" alt="Navbar Logo" />
        </Link>
        {currentUser && isNavShowing && (
          <ul className="nav__menu">
            <li>
              <Link to={`/profile/${currentUser.id}`} onClick={closeNavHandler}>
                {currentUser.name}
              </Link>
            </li>
            <li>
              <Link to="/create" onClick={closeNavHandler}>
                Create Post
              </Link>
            </li>
            <li>
              <Link to="/authors" onClick={closeNavHandler}>
                Authors
              </Link>
            </li>
            <li>
              <Link to="/logout" onClick={closeNavHandler}>
                Logout
              </Link>
            </li>
          </ul>
        )}
        {!currentUser && isNavShowing && (
          <ul className="nav__menu">
            <li>
              <Link to="/authors" onClick={closeNavHandler}>
                Authors
              </Link>
            </li>
            <li>
              <Link to="/login" onClick={closeNavHandler}>
                Login
              </Link>
            </li>
          </ul>
        )}
        <button
          className="nav__toggle-btn"
          onClick={() => setIsNavShowing(!isNavShowing)}
        >
          {isNavShowing ? <AiOutlineClose /> : <FaBars />}
        </button>
      </div>
    </nav>
  );
};

export default Header;
