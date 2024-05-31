import React from 'react';
import { useNavigate } from 'react-router-dom';

function Page3() {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate('/');
  };

  return (
    <div className='App'>
      <h1>Page3</h1>
      <button onClick={handleNavigate}>Go to Page1</button>
    </div>
  );
}

export default Page3;
