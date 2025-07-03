import React from 'react';
import {
  FaFacebookF,
  FaXTwitter,
  FaInstagram,
  FaYoutube
} from 'react-icons/fa6';

const iconStyle = {
  background: '#fff',
  borderRadius: '50%',
  width: '42px',
  height: '42px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#000',
  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.3s ease',
  cursor: 'pointer',
};

const containerStyle = {
  position: 'fixed',
  top: '30%',
  right: '0',
  zIndex: 1000,
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  padding: '5px',
};

const StickySocialLinks = () => {
  return (
    <div style={containerStyle}>
      <a href="https://www.facebook.com/officialnangalbycycle" target="_blank" rel="noopener noreferrer" style={iconStyle}><FaFacebookF /></a>
      <a href="https://x.com/nangalbycycle_" target="_blank" rel="noopener noreferrer" style={iconStyle}><FaXTwitter /></a>
      <a href="https://www.instagram.com/nangalbycycle" target="_blank" rel="noopener noreferrer" style={iconStyle}><FaInstagram /></a>
      <a href="https://www.youtube.com/@Nangalbycycle" target="_blank" rel="noopener noreferrer" style={iconStyle}><FaYoutube /></a> {/* ✅ YouTube Link */}
    </div>
  );
};

export default StickySocialLinks;
