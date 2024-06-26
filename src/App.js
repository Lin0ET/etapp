import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
//import Page1 from './page1';
import Page2 from './page2';
import Page3 from './page3';
import Chat from './chat';

function App() {
  return (

    <div className=''>
      
      <Routes>
        <Route path='/' element={<Chat/>} />
        <Route path='/page2' element={<Page2 />} />
        <Route path='/page3' element={<Page3 />} />
      </Routes>

    </div>
  );
}

export default App;
