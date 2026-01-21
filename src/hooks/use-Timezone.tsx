import { useTimezoneSelect, allTimezones } from "react-timezone-select";

const UseTimezone = () => {
  const { options: timezoneOptions, parseTimezone } = useTimezoneSelect({
    labelStyle: "original",
    timezones: {
      ...allTimezones,
      "Europe/Berlin": "Frankfurt",
      "Asia/Kolkata": "India Standard Time",
    },
  });
return { timezoneOptions, parseTimezone };
};

export default UseTimezone;
