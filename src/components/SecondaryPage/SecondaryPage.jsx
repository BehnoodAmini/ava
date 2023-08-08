import "./SecondaryPage.css";

import SideMenu from '../sidemenu/SideMenu';
import Dropdown from '../dropdowns/Dropdown';
import ArchiveHeader from "../ArchiveHeader/ArchiveHeader";

const SecondaryPage = () => {
    return (
        <div className="second-page">
            <Dropdown />
            <ArchiveHeader />
            
            <SideMenu />
        </div>
    );
}

export default SecondaryPage;