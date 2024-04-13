import React from "react";
import LoaderGif from "../images/loader.gif";

const Loader = () => {
  return (
    <div className="loader">
      <div className="loader__image">
        <img src={LoaderGif} alt="hehee" />
      </div>
    </div>
  );
};

export default Loader;
