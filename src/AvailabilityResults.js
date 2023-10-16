import React, { useState, useEffect } from "react";
import axios from "axios";

const AvailabilityResults = () => {
  const [user1Availability, setUser1Availability] = useState([]);
  const [user2Availability, setUser2Availability] = useState([]);
  const [commonAvailableDays, setCommonAvailableDays] = useState([]);
  const [selectedOption, setSelectedOption] = useState("This Week");

  useEffect(() => {
    axios
      .get("http://localhost:3000/users/user1/availability")
      .then((response) => {
        setUser1Availability(response.data.availability);
      })
      .catch((error) => {
        console.error("Error fetching User 1 availability", error);
      });

    axios
      .get("http://localhost:3000/users/user2/availability")
      .then((response) => {
        setUser2Availability(response.data.availability);
      })
      .catch((error) => {
        console.error("Error fetching User 2 availability", error);
      });
  }, []);

  const findCommonAvailableDays = (week) => {
    if (!user1Availability || !user2Availability) {
      console.error("User availability data not available");
      return;
    }

    const getUserDays = (availability, week) => {
      const weekData = availability.find(
        (userWeek) => userWeek.weekNumber === week
      );
      return new Set(
        (weekData?.intervals || []).flatMap((interval) =>
          (interval.availableDays || []).map((day) => day.day)
        )
      );
    };

    const user1Days = getUserDays(user1Availability, week);
    const user2Days = getUserDays(user2Availability, week);

    const commonDays = Array.from(user1Days).filter((day) =>
      user2Days.has(day)
    );

    setCommonAvailableDays(commonDays);
  };

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  useEffect(() => {
    switch (selectedOption) {
      case "This Week":
        findCommonAvailableDays(1);
        break;
      case "Next Week":
        findCommonAvailableDays(2);
        break;
      case "Week 3":
        findCommonAvailableDays(3);
        break;
      case "Week 4":
        findCommonAvailableDays(4);
        break;
      case "Week 5":
        findCommonAvailableDays(5);
        break;
      case "Week 6":
        findCommonAvailableDays(6);
        break;
      case "Week 7":
        findCommonAvailableDays(7);
        break;
      default:
        break;
    }
  }, [selectedOption, user1Availability, user2Availability]);

  const getFullDayName = (dayShortcut) => {
    const dayMappings = {
      Mon: "Monday",
      Tue: "Tuesday",
      Wed: "Wednesday",
      Thu: "Thursday",
      Fri: "Friday",
      Sat: "Saturday",
      Sun: "Sunday",
    };
    return dayMappings[dayShortcut] || dayShortcut;
  };

  return (
    <div className="availability-results">
      <div>
        <h2>Available Days for both Users </h2>
        <select onChange={handleOptionChange} value={selectedOption}>
          <option>This Week</option>
          <option>Next Week</option>
          <option>Week 3</option>
          <option>Week 4</option>
          <option>Week 5</option>
          <option>Week 6</option>
          <option>Week 7</option>
        </select>
      </div>
      <div>
        <h3>Common Available Days {selectedOption}:</h3>
        <ul>
          {commonAvailableDays.map((day, index) => (
            <li key={index}>{getFullDayName(day)}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AvailabilityResults;
