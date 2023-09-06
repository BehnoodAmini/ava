import "./VoiceBar.css";
import { useState, useEffect } from "react";

import { formatDurationForVoiceBar } from "../../helpers/TimeFunctions";

import Slider from "@mui/material/Slider";
import IconButton from "@mui/material/IconButton";
import PauseRounded from "@mui/icons-material/PauseRounded";
import PlayArrowRounded from "@mui/icons-material/PlayArrowRounded";
import StopIcon from "@mui/icons-material/Stop";
import VolumeUpRounded from "@mui/icons-material/VolumeUpRounded";

const VoiceBar = (props) => {
    const [position, setPosition] = useState(0);
    const [volume, setVolume] = useState(30);
    const [paused, setPaused] = useState(true);

    useEffect(() => {
        if (!paused) {
            const voice = props.audioRef.current;
            const updateCurrentTime = () => {
                const currentTime = voice?.currentTime;
                currentTime && setPosition(Math.ceil(currentTime));
            };
            voice?.addEventListener("timeupdate", updateCurrentTime);
            return () => {
                voice?.removeEventListener("timeupdate", updateCurrentTime);
            };
        }
    }, [paused, props.audioRef]);

    const handleVolumeChange = (value) => {
        if (props.audioRef.current) {
          setVolume(value);
          props.audioRef.current.volume = value / 100;
        }
      };

    const positionHandler = (value) => {
        setPosition(value);
        if (props.audioRef.current) {
            props.audioRef.current.currentTime = value;
        }
    };

    const playAudioHandler = () => {
        if (paused) {
            props.audioRef.current?.play()
        } else {
            props.audioRef.current?.pause();
        }
    };

    const resetAudioHandle = () => {
        if (props.audioRef.current) {
            props.audioRef.current.currentTime = 0;
            props.audioRef.current.pause();

            setPaused(true);
            setPosition(null);
        }
    };

    return (
        <div className="voice-bar">
            <audio
                src={props.audio}
                ref={props.audioRef}
                onEnded={() => setPaused(true)}
                hidden
            ></audio>
            <div className="volume-bar">
                <Slider
                    aria-label="Volume"
                    defaultValue={30}
                    value={volume}
                    onChange={(_, value) => {
                        return handleVolumeChange(value);
                    }}
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
            <div className="duration">
                {!position ?
                      formatDurationForVoiceBar(Math.ceil(props.duration ? props.duration : 0))
                    : formatDurationForVoiceBar(position)
                }
            </div>
            <Slider
                aria-label="time-indicator"
                size="small"
                value={position}
                min={0}
                max={Math.ceil(props.duration ? props.duration : 0)}
                onChange={(_, value) => {
                    return positionHandler(value);
                }}
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
                    onClick={() => {
                        setPaused(!paused);
                        playAudioHandler();
                    }}
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
                    onClick={resetAudioHandle}
                >
                    <StopIcon sx={{ fontSize: "1rem" }} />
                </IconButton>
            </div>
        </div>
    );
}

export default VoiceBar;