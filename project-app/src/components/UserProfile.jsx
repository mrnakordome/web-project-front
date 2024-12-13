// src/components/UserProfile.jsx
import React from 'react';

const UserProfile = ({ followingCount, followersCount }) => {
  return (
    <section className="user-profile">
      <div className="user-icon">👤</div>
      <div className="follow-stats">
        <div>
          <span>{followingCount}</span>
          Following
        </div>
        <div>
          <span>{followersCount}</span>
          Followers
        </div>
      </div>
    </section>
  );
};

export default UserProfile;
