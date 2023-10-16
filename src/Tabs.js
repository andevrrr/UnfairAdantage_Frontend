import React, { useState } from 'react';
import UsersAvailabilities from './Users';
import AvailabilityResults from './AvailabilityResults';

const Tabs = () => {
  const [activeTab, setActiveTab] = useState(1);

  const handleTabChange = (tabNumber) => {
    setActiveTab(tabNumber);
  };

  return (
    <div className="tabs-container">
      <div className="tab-buttons">
        <button onClick={() => handleTabChange(1)}>User 1</button>
        <button onClick={() => handleTabChange(2)}>User 2</button>
        <button onClick={() => handleTabChange(3)}>Tab 3</button>
      </div>
      <div className="tab-content">
        {activeTab === 1 && <UsersAvailabilities user="user1" />}
        {activeTab === 2 && <UsersAvailabilities user="user2" />}
        {activeTab === 3 && <AvailabilityResults />}
      </div>
    </div>
  );
}

export default Tabs;
