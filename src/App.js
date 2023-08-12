import { Route, Routes } from 'react-router-dom';

import './App.css';

import MainPage from './components/MainPage/MainPage';
import SecondaryPage from './components/SecondaryPage/SecondaryPage';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route
          path='/'
          element={<MainPage />}
        />
        <Route
          path='/archive'
          element={<SecondaryPage />}
        />
      </Routes>
      {/*<MainPage />
      <SecondaryPage />*/}
    </div>
  );
}

export default App;