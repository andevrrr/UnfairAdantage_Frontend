import React, { useState, useEffect } from 'react';
import axios from 'axios';
import WeekSlider from './WeekSelector';

const UsersAvailabilities = (user) => {
  const [userAvailabilities, setUserAvailabilities] = useState([]);

  useEffect(() => {
    const fetchUserAvailabilities = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/users/${user.user}/availability`);
        const availabilities = [{ username: user.user, availability: response.data.availability }];
        setUserAvailabilities(availabilities);
      } catch (error) {
        console.error('Error fetching user availabilities:', error);
      }
    };

    fetchUserAvailabilities();
  }, [user.user]);

  const handleSaveChanges = async () => {
    try {
      const updates = userAvailabilities[0].availability;

      console.log(updates);

      const response = await axios.post(`http://localhost:3000/users/${user.user}/availability`, { updates });
      console.log(response.data);
    } catch (error) {
      console.error('Error saving changes:', error);
    }
  };

  const calculateAvailableDays = (values) => {
    const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    if (values[0] >= 0 && values[1] < daysOfWeek.length) {
      const startDayIndex = values[0];
      const endDayIndex = values[1];

      return daysOfWeek.slice(startDayIndex, endDayIndex + 1).map((day) => ({ day }));
    }

    return [];
  };

  const handleValuesChange = async (weekIndex, newValues, week) => {
    if (newValues === null) {
      try {
        const updatedAvailabilities = [...userAvailabilities];
        const intervalToDelete = updatedAvailabilities[0].availability[weekIndex].intervals[week];

        await axios.delete(`http://localhost:3000/${user.user}/delete-interval/${intervalToDelete._id}`);

        updatedAvailabilities[0].availability[weekIndex].intervals.splice(week, 1);

        setUserAvailabilities(updatedAvailabilities);
      } catch (error) {
        console.error('Error deleting interval:', error);
      }

      return null;
    }

    setUserAvailabilities((prevAvailabilities) => {
      const newAvailabilities = [...prevAvailabilities];
      newAvailabilities[0].availability[weekIndex].intervals[week].availableDays = calculateAvailableDays(newValues);
      return newAvailabilities;
    });
  };

  return (
    <>
      {userAvailabilities.map((userData, userIndex) => (
        userData.availability.map((week, weekIndex) => (
          <WeekSlider
            key={`${userIndex}-${weekIndex}`}
            week={weekIndex + 1}
            initialValues0={calculateInitialValues(week, 0)}
            onValuesChange0={(newValues) => handleValuesChange(weekIndex, newValues, 0)}
            {...(week.intervals.length > 1 && {
              initialValues1: calculateInitialValues(week, 1),
              onValuesChange1: (newValues) => handleValuesChange(weekIndex, newValues, 1),
            })}
          />
        ))
      ))}
      <button onClick={handleSaveChanges}>Save Changes</button>
    </>
  );
};

const calculateInitialValues = (week, number) => {
  if (number === 1 && week.length === 1) {
    return null; // No second interval in the week
  }

  const availableDays = week.intervals[number].availableDays;
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const initialValues = [0, 5];

  if (availableDays && availableDays.length > 0) {
    const startDayIndex = daysOfWeek.indexOf(availableDays[0].day);
    const endDayIndex = daysOfWeek.indexOf(availableDays[availableDays.length - 1].day);

    initialValues[0] = startDayIndex;
    initialValues[1] = endDayIndex;
  }

  return initialValues;
};

export default UsersAvailabilities;
