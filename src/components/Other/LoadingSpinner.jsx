import React from "react";

const LoadingSpinner = () => (
  <div className="loading-container">
    <button className="btn btn-primary" type="button" disabled>
      <span
        className="spinner-border spinner-border-sm"
        aria-hidden="true"
      ></span>
      <span role="status">Loading...</span>
    </button>
  </div>
);

export default LoadingSpinner;
