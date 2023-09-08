import './MainPage.css';

import SideMenu from '../sidemenu/SideMenu';
import Dropdown from '../dropdowns/Dropdown';
import Header from '../header/Header';
import Upload from '../upload/Upload';

const MainPage = () => {
    return (
        <div className='first-page'>
            <Dropdown />
            <Header />
            <Upload />
            <SideMenu />
        </div>
    );
}

export default MainPage;
