import "./VoiceBar.css";
import { useState } from "react";

import Slider from "@mui/material/Slider";
import IconButton from "@mui/material/IconButton";
import PauseRounded from "@mui/icons-material/PauseRounded";
import PlayArrowRounded from "@mui/icons-material/PlayArrowRounded";
import StopIcon from "@mui/icons-material/Stop";
import VolumeUpRounded from "@mui/icons-material/VolumeUpRounded";

const VoiceBar = (props) => {
    const duration = 200; // seconds
    const [position, setPosition] = useState(0);
    const [paused, setPaused] = useState(true);
    function formatDuration(value) {
        const minute = Math.floor(value / 60);
        const secondLeft = value - minute * 60;
        return `${minute < 10 ? `0${minute}` : minute}:${secondLeft < 10 ? `0${secondLeft}` : secondLeft}`;
    }
    return (
        <div className="voice-bar">
            <div className="volume-bar">
                <Slider
                    aria-label="Volume"
                    defaultValue={30}
                    sx={{
                        "& .MuiSlider-track": {
                            border: "none",
                            backgroundColor: props.color
                        },
                        "& .MuiSlider-thumb": {
                            display: "none"
                        },
                        "& .MuiSlider-rail": {
                            opacity: 0.28,
                            color: "rgb(0 0 0 / 50%)"
                        }
                    }}
                />
                <div className="volume-icon">
                    <VolumeUpRounded />
                </div>
            </div>
            <div className="duration">{formatDuration(position)}</div>
            <Slider
                aria-label="time-indicator"
                size="small"
                value={position}
                min={0}
                step={1}
                max={duration}
                onChange={(_, value) => setPosition(value)}
                sx={{
                    width: "25rem",
                    height: 4,
                    "& .MuiSlider-thumb": {
                        color: props.color,
                        width: 14,
                        height: 14,
                        transition: "0.3s cubic-bezier(.47,1.64,.41,.8)",
                        "&:before": {
                            boxShadow: "0 2px 12px 0 rgba(0,0,0,0.4)"
                        },
                        "&:hover, &.Mui-focusVisible": {
                            boxShadow: `0px 0px 0px 8px ${"rgb(0 0 0 / 16%)"}`
                        },
                        "&.Mui-active": {
                            width: 10,
                            height: 10
                        }
                    },
                    "& .MuiSlider-rail": {
                        opacity: 0.28,
                        color: "rgb(0 0 0 / 50%)"
                    },
                    "& .MuiSlider-track": {
                        color: props.color
                    }
                }}
            />
            <div className="buttons">
                <IconButton
                    className="play-pause"
                    aria-label={paused ? "play" : "pause"}
                    onClick={() => setPaused(!paused)}
                >
                    {paused ? (
                        <PlayArrowRounded sx={{ fontSize: "1rem" }} />
                    ) : (
                        <PauseRounded sx={{ fontSize: "1rem" }} />
                    )}
                </IconButton>
                <IconButton
                    className="stop"
                    aria-label={paused ? "play" : "pause"}
                    onClick={() => {
                        setPaused(true);
                        setPosition(0)
                    }}
                >
                    <StopIcon sx={{ fontSize: "1rem" }} />
                </IconButton>
            </div>
        </div>
    );
}

export default VoiceBar;