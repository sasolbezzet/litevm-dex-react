import React from 'react';

export const Button: React.FC<{ onClick?: () => void }> = ({ onClick }) => (
  <button className="button" onClick={onClick}>
    Interact
  </button>
);