import React, { useState } from 'react';
import ReactSlider from 'react-slider';
import './styles.css'; 

const WeekSlider = ({ week, initialValues }) => {
  const [values, setValues] = useState(initialValues);

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const handleValuesChange = (newValues) => {
    setValues(newValues);
  };

  const isDayInInterval = (dayIndex) => {
    return dayIndex >= values[0] && dayIndex <= values[1];
  };

  return (
    <div className='container'>
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
        >
        </ReactSlider>
        <div className="days-of-week">
          {daysOfWeek.map((day, index) => (
            <div
              key={index}
              className={`day-label ${isDayInInterval(index) ? 'selected' : ''}`}
            >
              <div className='days'> {day} </div>
            </div>
          ))}
        </div>
        <div className="circle-left" style={{ left: `calc(${values[0] * (100 / 6)}% - 7.5px)` }} />
        <div className="circle-right" style={{ left: `calc(${values[1] * (100 / 6)}% - 7.5px)` }} />
      </div>
    </div>
  );
};

export default WeekSlider;

