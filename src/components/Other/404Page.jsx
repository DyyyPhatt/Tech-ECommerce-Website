import React, { useEffect, useState } from "react";
import { FaHome, FaExclamationTriangle } from "react-icons/fa";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const NotFound = ({ customMessage, redirectUrl = "/" }) => {
  const [errorReported, setErrorReported] = useState(false);

  const showSuccessToast = (message) => {
    toast.success(message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  useEffect(() => {
    const logError = async () => {
      try {
        await axios.post("/api/log-error", { errorType: "404" });
      } catch (error) {
        console.error("Failed to log error:", error);
      }
    };
    logError();
  }, []);

  const handleRedirect = () => {
    window.location.href = redirectUrl;
  };

  const handleReportError = () => {
    if (!errorReported) {
      showSuccessToast("Error reported successfully!");
      setErrorReported(true);
    }
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center m-5"
      role="alert"
      aria-live="assertive"
    >
      <div className="card text-center shadow-lg" style={{ width: "30rem" }}>
        <div className="card-body">
          <FaExclamationTriangle className="mx-auto h1 text-danger animate-bounce" />
          <h2 className="card-title m-4">Oops! Page Not Found</h2>
          <p className="card-text">
            {customMessage ||
              "The page you're looking for doesn't exist or has been moved."}
          </p>
          <button
            onClick={handleRedirect}
            className="btn btn-primary d-flex align-items-center mx-auto mt-4"
            aria-label="Go to Homepage"
          >
            <FaHome className="me-2" />
            Go to Homepage
          </button>
          <div className="mt-3">
            <button
              onClick={handleReportError}
              className="btn btn-link text-primary"
              aria-label="Report this error"
            >
              Report this error
            </button>
          </div>
        </div>
        <img
          src="https://images.unsplash.com/photo-1584824486509-112e4181ff6b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
          alt="Lost in space illustration"
          className="card-img-bottom mx-auto mb-4 rounded-lg shadow-md"
          style={{ height: "250px", objectFit: "contain" }}
        />
      </div>
    </div>
  );
};

export default NotFound;
