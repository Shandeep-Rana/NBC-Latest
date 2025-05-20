'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function FeedbackPopUp() {
  const [showPopup, setShowPopup] = useState(false);
  const router = useRouter();

  const handleClosePopup = () => setShowPopup(false);

  const handleFeedbackClick = () => {
    handleClosePopup();
    router.push('/feedback');
  };

  useEffect(() => {
    const timer = setTimeout(() => setShowPopup(true), 55000);
    return () => clearTimeout(timer);
  }, []);

  if (!showPopup) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '30px',
        left: '30px',
        width: '300px',
        backgroundColor: '#fff',
        borderRadius: '10px',
        boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.2)',
        padding: '20px',
        zIndex: 1000,
        animation: 'fadeInUp 0.5s ease-in-out',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h4 style={{ margin: 0, fontSize: '18px', color: '#333' }}>Enjoying Your Experience?</h4>
        <button
          style={{
            background: 'none',
            border: 'none',
            fontSize: '18px',
            color: '#f15b43',
            cursor: 'pointer',
          }}
          onClick={handleClosePopup}
        >
          &times;
        </button>
      </div>
      <p style={{ color: '#666', fontSize: '14px', margin: '10px 0' }}>
        We&apos;d love to hear your feedback! Rate us or leave a comment.
      </p>
      <button
        style={{
          backgroundColor: '#f15b43',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          padding: '10px 20px',
          cursor: 'pointer',
          width: '100%',
          fontSize: '16px',
          boxShadow: '0px 4px 10px rgba(241, 91, 67, 0.3)',
          transition: 'background-color 0.3s ease, transform 0.3s ease',
        }}
        onClick={handleFeedbackClick}
        onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
        onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
      >
        Rate Us / Give Feedback
      </button>
      <style>
        {`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </div>
  );
}
