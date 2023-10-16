import React, { useState, useEffect } from "react";
import ReactSlider from "react-slider";
import "./styles.css";

const WeekSlider = ({
  week,
  initialValues0,
  onValuesChange0,
  initialValues1,
  onValuesChange1,
}) => {
  const [values, setValues] = useState(initialValues0);
  const [prevValues, setPrevValues] = useState(values);
  const [newInterval, setNewInterval] = useState(initialValues1);
  const [prevNewInterval, setPrevNewInterval] = useState(initialValues1);
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
      if (newInterval[1] === newStart && newInterval[0] <= newEnd) {
        // const offset = newStart - newInterval[1] - 1;

        let left = newInterval[0] - 1;
        let right = newInterval[1] - 1;

        if (left < 0) {
          left = 0;
        }

        setNewInterval([left, right]);
        onValuesChange1([left, right]);
        setPrevNewInterval([left, right]);
      }
    }
    setPrevValues(newValues);
    onValuesChange0(newValues);
    setValues(newValues);
  };

  const handleToggleInterval = async () => {
    if (!newInterval) {
      let right = 1;
      if (values[0] === 0 || values[0] === 1) {
        await setValues([2, values[1]]);
        await onValuesChange0([2, values[1]])
      } 
      onValuesChange1([0, right]);
      setNewInterval([0, right]);
      setPrevNewInterval([0, right]);
    } else {
      setNewInterval(null);
      onValuesChange1(null);
    }
  };

  const handleNewIntervalChange = (newValues) => {
    const [newStart, newEnd] = newValues;

    if (values[0] === newEnd && values[1] >= newStart) {
      const offset = newEnd - values[0] + 1;

      let right = values[1] + offset;
      if (right > 6) {
        right = 6;
      }

      onValuesChange0([values[0] + offset, right]);
      setValues([values[0] + offset, right]);
    }

    onValuesChange1(newValues);
    setNewInterval(newValues);
  };

  const handleToggleIntervalFullyAvailable = () => {
    if (isFullyAvailable) {
      setNewInterval(prevNewInterval);
      onValuesChange1(prevNewInterval);
      setValues(prevValues);
      onValuesChange0(prevValues);
    } else {
      setNewInterval(null);
      onValuesChange1(null);
      setValues([0, 6]);
      onValuesChange0([0, 6]);
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
          key={JSON.stringify(values)} 
          defaultValue={values}
          className="horizontal-slider"
          thumbClassName="example-thumb"
          trackClassName="example-track"
          ariaValuetext={(state) => `Thumb value ${daysOfWeek[state.valueNow]}`}
          pearling
          minDistance={1}
          max={6}
          step={1}
          onChange={handleValuesChange}
        ></ReactSlider>
        {newInterval && (
          <ReactSlider
            key={JSON.stringify(newInterval)} 
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
        <button className="sideButtons" onClick={handleToggleInterval}>
          {newInterval ? "-" : "+"}
        </button>
      </div>
    </div>
  );
};

export default WeekSlider;
