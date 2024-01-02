import React from "react";
import { Link } from "react-router-dom";

const ErrorPage = () => {
  return (
    <div>
      <h1>404</h1>
      <h2>Page not found</h2>
      <Link to="/">Back to Home</Link>
    </div>
  );
};

export default ErrorPage;
