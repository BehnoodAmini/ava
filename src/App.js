import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';

import { CircularProgress } from '@mui/material';

import './App.css';

const MainPage = lazy(() => import('./components/mainPage/MainPage'));
const SecondaryPage = lazy(() => import('./components/secondaryPage/SecondaryPage'));

function App() {
  return (
    <div className="App">
        <Routes>
          <Route
            path='/'
            element={
              <Suspense fallback={<CircularProgress color='success' />} >
                <MainPage />
              </Suspense>
            }
          />

          <Route
            path='/archive'
            element={
              <Suspense fallback={<CircularProgress color='success' />} >
                <SecondaryPage />
              </Suspense>
            }
          />
        </Routes>
    </div>
  );
}

export default App;