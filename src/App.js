import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';

import './App.css';

const MainPage = lazy(() => import('./components/MainPage/MainPage'));
const SecondaryPage = lazy(() => import('./components/SecondaryPage/SecondaryPage'));

function App() {
  return (
    <div className="App">
        <Routes>
          <Route
            path='/'
            element={
              <Suspense >
                <MainPage />
              </Suspense>
            }
          />

          <Route
            path='/archive'
            element={
              <Suspense>
                <SecondaryPage />
              </Suspense>
            }
          />
        </Routes>
    </div>
  );
}

export default App;