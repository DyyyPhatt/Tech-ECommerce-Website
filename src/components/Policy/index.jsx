import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Policy.css";
import BreadCrumb from "../../components/Other/BreadCrumb";
import LoadingSpinner from "../../components/Other/LoadingSpinner";
import NotFound from "../../components/Other/404Page";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./Policy.css";

const PolicyPage = ({ policyTitle, breadcrumbTitle }) => {
  const [policy, setPolicy] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchPolicy = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8081/api/policies/title/${encodeURIComponent(
            policyTitle
          )}`
        );
        setPolicy(response.data);
      } catch (error) {
        console.error(`Error fetching ${policyTitle.toLowerCase()}:`, error);
        toast.error(
          `Unable to fetch ${policyTitle.toLowerCase()}. Please try again!`,
          {
            autoClose: 5000,
          }
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPolicy();
  }, [policyTitle]);

  if (loading) return <LoadingSpinner />;

  return (
    <>
      <ToastContainer />
      <BreadCrumb title={breadcrumbTitle} />
      <div className="policy-wrapper-container">
        <div className="policy-wrapper shadow-lg">
          {policy ? (
            <>
              <h2 className="policy-title">{policy.title}</h2>
              <div
                className="policy-content"
                dangerouslySetInnerHTML={{ __html: policy.content }}
              />
            </>
          ) : (
            <NotFound />
          )}
        </div>
      </div>
    </>
  );
};

export default PolicyPage;
