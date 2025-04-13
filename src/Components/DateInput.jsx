import { useState, useRef } from "react";

const mounthName = [
  "Январь",
  "Февраль",
  "Март",
  "Апрель",
  "Май",
  "Июнь",
  "Июль",
  "Август",
  "Сентябрь",
  "Октябрь",
  "Ноябрь",
  "Декабрь",
];

function validation(value) {
  let validDate = new Date(value);
  if (!isNaN(validDate)) {
    return true;
  } else {
    return false;
  }
}

function DateInput() {
  const [date, setDate] = useState("");
  const [isCalendarOpen, setCalendar] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [tempDate, setTempDate] = useState(new Date());
  const ref = useRef();

  const toggleCalendar = () => {
    setCalendar(!isCalendarOpen);
  };

  const handleDateClick = (day) => {
    const newDate = new Date(currentYear, currentMonth, day);
    setTempDate(newDate);
  };

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handlePrevYear = () => {
    setCurrentYear(currentYear - 1);
  };

  const handleNextYear = () => {
    setCurrentYear(currentYear + 1);
  };

  const confirm = () => {
    const arr = tempDate.toLocaleDateString().split(".");
    [arr[0], arr[2]] = [arr[2], arr[0]];
    setDate(arr.join("-"));
    setCalendar(false);
    ref.current.dataset.validation = true;
  };

  const cancel = () => {
    setCalendar(false);
  };

  const renderCalendar = () => {
    const daysCount = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDay = new Date(currentYear, currentMonth + 1, 1).getDay();
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div className="calendar__days_day empty" key={`empty-${i}`}></div>
      );
    }

    for (let day = 1; day <= daysCount; day++) {
      days.push(
        <div
          className={`calendar__days_day ${
            day === tempDate.getDate() ? "selected" : ""
          }`}
          key={day}
          onClick={() => handleDateClick(day)}
        >
          {day}
        </div>
      );
    }
    return days;
  };

  const changeHandler = (event) => {
    setDate(event.target.value);
    if (validation(event.target.value)) {
      ref.current.dataset.validation = true;
      setCurrentMonth(Number(event.target.value.split("-")[1]) - 1);
      setCurrentYear(Number(event.target.value.split("-")[0]));
      handleDateClick(Number(event.target.value.split("-")[2]));
    } else {
      ref.current.dataset.validation = false;
    }
  };

  const handleSubmit = (e) => {
    if (e.key === "Enter" && validation(date)) {
      ref.current.style.pointerEvents = "none";
      ref.current.classList.add("disable");
      setCalendar(false);
    } else if (e.key === "Enter" && !validation(date)) {
      ref.current.dataset.validation = false;
    }
  };

  return (
    <div className="date__input" ref={ref}>
      <input
        type="date"
        id="date"
        name="date"
        placeholder="Выберите дату"
        onChange={(event) => changeHandler(event)}
        onKeyDown={handleSubmit}
        value={date}
      />
      {date.length > 0 && (
        <span
          className="date__input_clear"
          onMouseEnter={(e) => (e.currentTarget.style.opacity = 1)}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = 0)}
          onClick={() => setDate("")}
        >
          ✕
        </span>
      )}
      <div className="date__picker">
        <svg
          width="8"
          height="10"
          viewBox="0 0 8 10"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          onClick={toggleCalendar}
          className="date__picker_icon"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M6.91667 1.77865H6.5V0.945312H5.66667V1.77865H2.33333V0.945312H1.5V1.77865H1.08333C0.620833 1.77865 0.25 2.15365 0.25 2.61198V8.44531C0.25 8.90365 0.620833 9.27865 1.08333 9.27865H6.91667C7.375 9.27865 7.75 8.90365 7.75 8.44531V2.61198C7.75 2.15365 7.375 1.77865 6.91667 1.77865ZM6.91667 8.44531H1.08333V3.86198H6.91667V8.44531ZM1.70833 5.52865C1.70833 4.95365 2.175 4.48698 2.75 4.48698C3.325 4.48698 3.79167 4.95365 3.79167 5.52865C3.79167 6.10365 3.325 6.57031 2.75 6.57031C2.175 6.57031 1.70833 6.10365 1.70833 5.52865Z"
            fill="#4B7CDD"
          />
        </svg>
        {isCalendarOpen && (
          <div
            className="calendar"
            style={{ top: ref.current.getBoundingClientRect().height }}
          >
            <div className="calendar__header">
              <div className="calendar__header_month">
                <button onClick={handlePrevMonth}>🢐</button>
                <span>{`${mounthName[currentMonth]}`}</span>
                <button onClick={handleNextMonth}>🢒</button>
              </div>
              <div className="calendar__header_year">
                <button onClick={handlePrevYear}>🢐</button>
                <span>{`${currentYear}`}</span>
                <button onClick={handleNextYear}>🢒</button>
              </div>
            </div>
            <div className="calendar__main">
              <div className="calendar__daysOfWeek">
                <div>Пн</div>
                <div>Вт</div>
                <div>Ср</div>
                <div>Чт</div>
                <div>Пт</div>
                <div>Сб</div>
                <div>Вс</div>
              </div>
              <div className="calendar__days">{renderCalendar()}</div>
            </div>
            <div className="calendar__footer">
              <button className="calendar__footer_confirm" onClick={confirm}>
                Подтвердить
              </button>
              <button className="calendar__footer_cancel" onClick={cancel}>
                Отменить
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DateInput;
