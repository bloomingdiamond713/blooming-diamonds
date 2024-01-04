import React from "react";
import useCountdownTimer from "../../hooks/useCountDownTimer";

const CountDownTimer = ({ targetDate }) => {
  const timeLeft = useCountdownTimer(targetDate);

  const addLeadingZero = (value) => (value < 10 ? `0${value}` : value);

  return (
    <div className="flex justify-between items-center mt-8">
      <div className="rounded-lg w-[23%] bg-[#f7f7f7] text-center py-2">
        <h4 className="text-3xl text-[#f8d340] font-bold">
          {addLeadingZero(timeLeft.days)}
        </h4>
        <p className="text-sm">Days</p>
      </div>
      <div className="rounded-lg w-[23%] bg-[#f7f7f7] text-center py-2">
        <h4 className="text-3xl text-[#f8d340] font-bold">
          {addLeadingZero(timeLeft.hours)}
        </h4>
        <p className="text-sm">Hours</p>
      </div>
      <div className="rounded-lg w-[23%] bg-[#f7f7f7] text-center py-2">
        <h4 className="text-3xl text-[#f8d340] font-bold">
          {addLeadingZero(timeLeft.minutes)}
        </h4>
        <p className="text-sm">Minutes</p>
      </div>
      <div className="rounded-lg w-[23%] bg-[#f7f7f7] text-center py-2">
        <h4 className="text-3xl text-[#f8d340] font-bold">
          {addLeadingZero(timeLeft.seconds)}
        </h4>
        <p className="text-sm">Seconds</p>
      </div>
    </div>
  );
};

export default CountDownTimer;
