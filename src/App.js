import './App.css';
import SideMenu from './components/SideMenu';
import Dropdown from './components/Dropdown';
import Header from './components/Header';

function App() {
  return (
    <div className="App">
      <Dropdown />
      <Header />
      <SideMenu />
    </div>
  );
}

export default App;