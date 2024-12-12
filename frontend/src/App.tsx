import React from 'react';
import './App.css';
import ManagementTabs from './components/ManageTabs';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App: React.FC = () => {
  return (
    <div className='mainWrapper'>
      <h2>Organization Hierarchy</h2>
      <div className='containerLarge'>
        <ToastContainer autoClose={2000} />
        <ManagementTabs />
      </div>
    </div>
  );
};

export default App;