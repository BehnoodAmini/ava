import './ArchiveHeader.css'

const ArchiveHeader = () => {
    return ( 
        <div className="archive-header">
            <h2 className="archive-title">آرشیو من</h2>
            <div className="archive-lables">
                <div className="first-blank"></div>
                <div className="file-name">نام فایل</div>
                <div className="date">تاریخ بارگذاری</div>
                <div className="data-type">نوع فایل</div>
                <div className="file-length">مدت زمان</div>
                <div className="last-blank"></div>
            </div>
        </div>
     );
}
 
export default ArchiveHeader;