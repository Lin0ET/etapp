import React from 'react';
import { useNavigate } from 'react-router-dom';

function Page2() {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate('/page3');
  };

  return (
    <div className='App'>
      <h1>Page2</h1>
      <button onClick={handleNavigate}>Go to Page3</button>
    </div>
  );
}

export default Page2;
