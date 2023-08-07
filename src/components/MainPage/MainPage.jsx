import SideMenu from '../sidemenu/SideMenu';
import Dropdown from '../dropdowns/Dropdown';
import Header from '../Header/Header';
import Upload from '../upload/Upload';

import './MainPage.css'

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