import React from 'react';

export default function LoadingSpinner({ text = 'Loading...' }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '1rem 0' }}>
      <div style={{
        width: 24, height: 24, border: '3px solid #009900', borderTop: '3px solid #23243a', borderRadius: '50%',
        animation: 'spin 1s linear infinite', marginRight: 10
      }} />
      <span style={{ color: '#009900', fontWeight: 600 }}>{text}</span>
      <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
