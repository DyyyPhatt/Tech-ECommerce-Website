import React from "react";

const CreatorProfile = ({ creator }) => (
  <div className="col-lg-6 p-5 d-flex align-items-center">
    <img
      src={creator.avatar}
      alt={creator.name}
      className="img-fluid rounded-circle creator-img me-4"
    />
    <div>
      <h3 className="text-dark fs-5">{creator.name}</h3>
      <p className="text-muted mb-1">
        <strong>Age:</strong> {creator.age}
      </p>
      <p className="text-muted mb-1">
        <strong>Gender:</strong> {creator.gender}
      </p>
      <p className="text-muted mb-1">
        <strong>Occupation:</strong> {creator.occupation}
      </p>
      <p className="text-muted">
        <strong>School:</strong> {creator.workplace}
      </p>
    </div>
  </div>
);

export default CreatorProfile;
