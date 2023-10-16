import React, { useState, useEffect } from 'react';
import axios from 'axios';
import WeekSlider from './WeekSelector'; 

const UsersAvailabilities = () => {
  const [userAvailabilities, setUserAvailabilities] = useState([]);

  useEffect(() => {
    const fetchUserAvailabilities = async () => {
      try {
        const usernames = ['user1']; 
        const availabilityPromises = usernames.map(async (username) => {
          const response = await axios.get(`http://localhost:3000/users/${username}/availability`);
          return { username, availability: response.data.availability };
        });

        const availabilities = await Promise.all(availabilityPromises);
        setUserAvailabilities(availabilities);
      } catch (error) {
        console.error('Error fetching user availabilities:', error);
      }
    };

    fetchUserAvailabilities();
  }, []);

  const handleSaveChanges = async () => {
    try {
      const updates = userAvailabilities[0].availability;

      console.log(updates);

      const response = await axios.post('http://localhost:3000/users/user1/availability', { updates });
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
  
  

  const handleValuesChange = (weekIndex, newValues) => {
    console.log(weekIndex);
    console.log(newValues);
    setUserAvailabilities((prevAvailabilities) => {
      const newAvailabilities = [...prevAvailabilities];
      newAvailabilities[0].availability[weekIndex].intervals[0].availableDays = calculateAvailableDays(newValues);
      console.log(newAvailabilities);
      return newAvailabilities;
    });
  };

  return (
    <>
      {userAvailabilities.map((user, userIndex) => (
        user.availability.map((week, weekIndex) => (
          <WeekSlider
            key={`${userIndex}-${weekIndex}`}
            week={weekIndex + 1}
            initialValues={calculateInitialValues(week.intervals[0].availableDays)} 
            onValuesChange={(newValues) => handleValuesChange(weekIndex, newValues)}
          />
        ))
      ))}
      <button onClick={handleSaveChanges}>Save Changes</button>
    </>
  );
};

const calculateInitialValues = (availableDays) => {
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const initialValues = [0, 5];

  if (availableDays.length > 0) {
    const startDayIndex = daysOfWeek.indexOf(availableDays[0].day);
    const endDayIndex = daysOfWeek.indexOf(availableDays[availableDays.length - 1].day);

    initialValues[0] = startDayIndex;
    initialValues[1] = endDayIndex;
  }
  return initialValues;
};

export default UsersAvailabilities;
