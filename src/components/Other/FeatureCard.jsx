import React from "react";

const FeatureCard = ({ icon, title, content }) => (
  <div className="col">
    <div className="p-4 d-flex flex-column gap-4 bg-white rounded shadow-sm hover-shadow h-100">
      <div className="d-flex justify-content-center mb-2">{icon}</div>
      <div>
        <h3 className="text-dark h5 fw-semibold mb-2">{title}</h3>
        <p className="text-muted">{content}</p>
      </div>
    </div>
  </div>
);

export default FeatureCard;
