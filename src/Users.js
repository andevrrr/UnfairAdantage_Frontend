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

  return (
    <>
      {userAvailabilities.map((user, userIndex) => (
        user.availability.map((week, weekIndex) => (
          <WeekSlider key={`${userIndex}-${weekIndex}`} week={weekIndex + 1} initialValues={calculateInitialValues(week)} />
        ))
      ))}
    </>
  );
};

const calculateInitialValues = (availability) => {
    console.log(availability)
    const initialValues = [0, 5]; 
    const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  

      if (availability.availableDays.length > 0) {
        const startDayIndex = daysOfWeek.indexOf(availability.availableDays[0].day);
        const endDayIndex = daysOfWeek.indexOf(availability.availableDays[availability.availableDays.length - 1].day);

        initialValues[0] = startDayIndex;
        initialValues[1] = endDayIndex;
      }
      
      console.log(initialValues);
    
    return initialValues;
  };

export default UsersAvailabilities;
