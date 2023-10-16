// WeekSlider.js

import React, { useState, useEffect } from "react";
import ReactSlider from "react-slider";
import "./styles.css";

const WeekSlider = ({ week, initialValues, onValuesChange }) => {
  const [values, setValues] = useState(initialValues);
  const [prevValues, prevSetValues] = useState(values);
  const [newInterval, setNewInterval] = useState(null);
  const [isFullyAvailable, setIsFullyAvailable] = useState(false);

  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const handleValuesChange = (newValues) => {
    const [newStart, newEnd] = newValues;

    if (newInterval) {
      if (newInterval[1] == newStart && newInterval[0] <= newEnd) {
        // const offset = newStart - newInterval[1] - 1;

        let left = newInterval[0] - 1;
        let right = newInterval[1] - 1;

        if (left < 0) {
          left = 0;
        }

        setNewInterval([left, right]);
      }
    }
    prevSetValues(newValues);
    onValuesChange(newValues);
    setValues(newValues);
  };

  const handleToggleInterval = () => {
    if (!newInterval) {
      let right = 1;
      if (values[0] == right) {
        setValues[0] += 1;
      }
      setNewInterval([0, right]);
    } else {
      setNewInterval(null);
    }
  };

  const handleNewIntervalChange = (newValues) => {
    const [newStart, newEnd] = newValues;

    if (values[0] == newEnd && values[1] >= newStart) {
      const offset = newEnd - values[0] + 1;

      let right = values[1] + offset;
      if (right > 6) {
        right = 6;
      }

      onValuesChange([values[0] + offset, right]);
      setValues([values[0] + offset, right]);
    }

    setNewInterval(newValues);
  };

  const handleToggleIntervalFullyAvailable = () => {
    if (isFullyAvailable) {
      setNewInterval(null);

      setValues(prevValues);
      onValuesChange(prevValues);
    } else {
      setNewInterval(null);
      setValues([0, 6]);
      onValuesChange([0, 6]);
    }
    setIsFullyAvailable(!isFullyAvailable);
  };

  return (
    <div className="container">
      <div>
          <input
            type="checkbox"
            id="fullyAvailableCheckbox"
            checked={isFullyAvailable}
            onChange={handleToggleIntervalFullyAvailable}
          />
          <label htmlFor="fullyAvailableCheckbox">Fully Available</label>
        </div>
      <div className="week-slider-container">
        <h2>Week {week}</h2>
        <ReactSlider
          className="horizontal-slider"
          thumbClassName="example-thumb"
          trackClassName="example-track"
          defaultValue={values}
          ariaValuetext={(state) => `Thumb value ${daysOfWeek[state.valueNow]}`}
          pearling
          minDistance={1}
          max={6}
          step={1}
          onChange={handleValuesChange}
        ></ReactSlider>
        {newInterval && (
          <ReactSlider
            className="horizontal-slider"
            thumbClassName="example-thumb2"
            trackClassName="example-track"
            defaultValue={newInterval}
            ariaValuetext={(state) =>
              `Thumb value ${daysOfWeek[state.valueNow]}`
            }
            pearling
            minDistance={1}
            max={6}
            step={1}
            onChange={handleNewIntervalChange}
          ></ReactSlider>
        )}
        <div className="days-of-week">
          {daysOfWeek.map((day, index) => (
            <div
              key={index}
              className={`day-label ${
                values[0] <= index && index <= values[1] ? "selected" : ""
              } ${
                newInterval &&
                newInterval[0] <= index &&
                index <= newInterval[1]
                  ? "selected-second"
                  : ""
              }`}
            >
              <div className="days">{day}</div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <button  className="sideButtons" onClick={handleToggleInterval}>
          {newInterval ? "-" : "+"}
        </button>
      </div>
    </div>
  );
};

export default WeekSlider;
