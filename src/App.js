import './App.css';
import SideMenu from './components/sidemenu/SideMenu';
import Dropdown from './components/dropdowns/Dropdown';
import Header from './components/Header/Header';
import Upload from './components/upload/Upload';

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