import "./SecondaryPage.css";

import SideMenu from '../sidemenu/SideMenu';
import Dropdown from '../dropdowns/Dropdown';
import ArchiveHeader from "../archiveHeader/ArchiveHeader";
import ArchiveList from "../ArchiveList/ArchiveList";

const SecondaryPage = () => {
    return (
        <div className="second-page">
            <Dropdown />
            <ArchiveHeader />
            <ArchiveList />
            <SideMenu />
        </div>
    );
}

export default SecondaryPage;