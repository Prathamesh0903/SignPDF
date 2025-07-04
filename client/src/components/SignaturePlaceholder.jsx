import React from 'react';

function SignaturePlaceholder({ x, y, status }) {
  const colorClass = status === 'signed' ? 'bg-success' : status === 'rejected' ? 'bg-danger' : 'bg-warning';
  const text = status === 'signed' ? 'Signed' : status === 'rejected' ? 'Rejected' : 'Pending';

  return (
    <div
      style={{
        position: 'absolute',
        left: `${x}px`,
        top: `${y}px`,
        width: '100px',
        height: '30px',
        border: `2px dashed ${status === 'signed' ? 'green' : status === 'rejected' ? 'red' : 'orange'}`,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '12px',
        color: 'white',
        borderRadius: '5px',
        padding: '2px 5px',
      }}
      className={`${colorClass} bg-opacity-75`}
    >
      {text}
    </div>
  );
}

export default SignaturePlaceholder;
