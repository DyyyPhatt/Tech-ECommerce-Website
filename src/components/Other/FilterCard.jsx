import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const FilterCard = ({
  title,
  filterType,
  options,
  selectedIds,
  handleChange,
  toggleFilter,
  activeFilter,
  renderLabel,
}) => (
  <div className="filter-card mb-3">
    <h3 className="filter-title d-flex justify-content-between align-items-center">
      {title}
      <button
        className="btn btn-link p-0"
        type="button"
        onClick={() => toggleFilter(filterType)}
        aria-expanded={activeFilter === filterType}
        aria-controls={`collapse${
          filterType.charAt(0).toUpperCase() + filterType.slice(1)
        }`}
      >
        <i
          className={`fas ${
            activeFilter === filterType ? "fa-chevron-up" : "fa-chevron-down"
          }`}
        ></i>
      </button>
    </h3>
    <AnimatePresence>
      {activeFilter === filterType && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          id={`collapse${
            filterType.charAt(0).toUpperCase() + filterType.slice(1)
          }`}
        >
          <ul className="filter-list">
            {options.map((option) => (
              <li key={option.id}>
                <input
                  type="checkbox"
                  id={option.id}
                  checked={selectedIds.includes(option.id)}
                  onChange={() => handleChange(option.id)}
                />
                <label htmlFor={option.id}>
                  {renderLabel
                    ? renderLabel(option)
                    : option.name ||
                      option.cateName ||
                      option.brandName ||
                      option.cateBlogName ||
                      option.conditionName}
                </label>
              </li>
            ))}
          </ul>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

export default FilterCard;
