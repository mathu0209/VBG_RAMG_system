import React from 'react';

const defaultActivities = [
  { time: 'முற்பகல் 09:00', text: 'பணியாளர்கள் வருகைப்பதிவு நிறைவடைந்தது' },
  { time: 'முற்பகல் 11:30', text: 'வேலைத்தள புவிசார் படம் எடுக்கப்பட்டது' },
  { time: 'பிற்பகல் 02:00', text: 'பணி முன்னேற்றம் புதுப்பிக்கப்பட்டது' },
  { time: 'பிற்பகல் 04:30', text: 'மேற்பார்வையாளர் சரிபார்ப்பு நிறைவடைந்தது' }
];

export const ActivityTimeline = ({ activities = defaultActivities }) => {
  return (
    <div className="timeline-container">
      <div className="timeline-line" />
      {activities.map((item, index) => (
        <div key={index} className="timeline-item">
          <div className="timeline-dot" />
          <div className="timeline-content" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span className="timeline-time" style={{ minWidth: '95px', color: 'var(--primary-blue)', fontWeight: 700 }}>
              {item.time}
            </span>
            <span className="timeline-title" style={{ color: 'var(--text-dark)', fontWeight: 600 }}>
              {item.text}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ActivityTimeline;
