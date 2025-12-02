// components/YearSelector.jsx
import React from "react";
import "./YearSelector.css";

const YearSelector = ({ selectedYear, onYearChange, availableYears }) => {
  return (
    <div className="year-selector">
      <label htmlFor="year-select">Select Year:</label>
      <select
        id="year-select"
        value={selectedYear}
        onChange={(e) => onYearChange(parseInt(e.target.value))}
        className="year-dropdown"
      >
        {availableYears.map((year) => (
          <option key={year} value={year}>
            {year} {year === 2025 && "✨ Modern Stats"}
          </option>
        ))}
      </select>
    </div>
  );
};

export default YearSelector;
