import React from 'react';
import { useNavigate } from 'react-router-dom';

function Page1() {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate('/page2');
  };

  return (
    <div className='App'>
      <h1>Page1</h1>
      <button onClick={handleNavigate}>Go to Page2</button>
    </div>
  );
}

export default Page1;
