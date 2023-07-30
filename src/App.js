import './App.css';
import SideMenu from './components/SideMenu';
import Dropdown from './components/Dropdown';
import Header from './components/Header';
import Upload from './components/Upload';

function App() {
  return (
    <div className="App">
      <Dropdown />
      <Header />
      <Upload />
      <SideMenu />
    </div>
  );
}

export default App;