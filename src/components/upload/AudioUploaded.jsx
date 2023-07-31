import simpleTextIcon from "../../assets/images/simple-text-icon.svg";
import timedTextIcon from "../../assets/images/timed-text-icon.svg"
import downloadIcon from "../../assets/images/download-icon.svg";
import copyIcon from "../../assets/images/copy-icon.svg";
import refreshIcon from "../../assets/images/refresh-icon.svg";

const AudioUploaded = (props) => {
    <div className="center-uploaded">
        <div className="upload-navbar">
            <div className="upload-navbar-right">
                <button className="simple-text-button">
                    <img
                        className="simple-text-icon"
                        src={simpleTextIcon}
                        alt="simple-text-icon"
                    />
                    <div className="simple-text">متن ساده</div>
                </button>
                <button className="timed-text-button">
                    <img
                        className="timed-text-icon"
                        src={timedTextIcon}
                        alt="timed-text-icon"
                    />
                    <div className="timed-text">متن زمان بندی شده</div>
                </button>
            </div>
            <div className="upload-navbar-left">
                <button className="download">
                    <img
                        className="download-icon"
                        src={downloadIcon}
                        alt="download-icon"
                    />
                </button>
                <button className="copy">
                    <img
                        className="copy-icon"
                        src={copyIcon}
                        alt="copy-icon"
                    />
                </button>
                <button className="refresh-button" style={{ backgroundColor: props.color }}>
                    <img
                        className="refresh-icon"
                        src={refreshIcon}
                        alt="refresh-icon"
                    />
                    <div className="refresh-text">شروع دوباره</div>
                </button>
            </div>
            <hr style={{ color: "#000000", opacity: '50%' }} />
        </div>
        <div className="text-box">

        </div>
        <div className="voice-bar">
            
        </div>
    </div>
}

export default AudioUploaded;