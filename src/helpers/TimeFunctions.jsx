import moment from 'moment-jalaali';

// FORMAT DURATION WITHOUT EXTRA ZERO AT LEFT
export const formatDurationNoZero = (value) => {
    const timeIndex = value.split(":");
    const hours = parseInt(timeIndex[0]);
    const minutes = parseInt(timeIndex[1]);
    const seconds = parseInt(timeIndex[2]);

    if (hours === 0) {
        let time = `${minutes}:${seconds.toString().padStart(2, "0")}`;
        return time;
    } else {
        let time = `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
        return time;
    }
}; 

// FORMAT DURATION WITH EXTRA ZERO AT LEFT
export const formatDuration = (value) => {
    const timeIndex = value.split(":");
    const hours = parseInt(timeIndex[0]);
    const minutes = parseInt(timeIndex[1]);
    const seconds = parseInt(timeIndex[2]);

    if (hours === 0) {
        let time = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
        return time;
    } else {
        let time = `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
        return time;
    }
};

// FORMAT DURATION BUG SOLVER FOR VOICEBAR
export const formatDurationForVoiceBar = (value) => {
    const minute = Math.floor(value / 60);
    const secondLeft = value - minute * 60;
    return `${minute < 10 ? `0${minute}` : minute}:${secondLeft < 10 ? `0${secondLeft}` : secondLeft}`;
}

// FOR CONVERT TIME THAT API GIVES TO SECONDS FOR VOICEBAR SLIDER
export const convertTimeToSeconds = (timeString) => {
    // Split the time string into an array of hours, minutes, and seconds.
    const timeArray = timeString.split(":");
    // Convert the hours, minutes, and seconds to numbers.
    const hours = parseInt(timeArray[0]);
    const minutes = parseInt(timeArray[1]);
    const seconds = parseInt(timeArray[2]);
    const hoursInSeconds = hours * 3600;
    const minutesInSeconds = minutes * 60;
    const secondsInSeconds = seconds * 1;
    const totalSeconds = hoursInSeconds + minutesInSeconds + secondsInSeconds;

    return totalSeconds;
}

// FOR CONVERTING AD DATE TO SOLAR DATE(PERSIAN CALENDAR)
export const convertADDateToSolarDate = (date) => {
    const persianDate = moment(date, 'YYYY-MM-DD HH:mm:ss').format('jYYYY-jMM-jDD');
    return persianDate;
}