import { useState, useRef } from "react";

const monthsName = [
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

const daysName = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

function validation(value) {
  //Валидация даты
  let validDate = new Date(value);
  if (!isNaN(validDate)) {
    return true;
  } else {
    return false;
  }
}

function DateInput() {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [tempDate, setTempDate] = useState(new Date());
  const [date, setDate] = useState("");
  const [isCalendarOpen, setCalendar] = useState(false);
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [menuElm, setMenuElm] = useState("months");
  const [secondMenu, setSecondMenu] = useState(false);
  const ref = useRef();

  const toggleCalendar = () => {
    // Открытие/закрытие календаря
    setCalendar(!isCalendarOpen);
    if (isMenuOpen) {
      toggleMenu();
    }
  };

  const toggleMenu = (elm) => {
    // Открытие/закрытие меню
    setSecondMenu(0);
    setCalendar(!isCalendarOpen);
    setMenuOpen(!isMenuOpen);
    setMenuElm(elm);
  };

  const handleDateClick = (day) => {
    // Выбор дня
    const newDate = new Date(currentYear, currentMonth, day);
    setTempDate(newDate);
  };

  const handlePrevMonth = () => {
    // Переключение на предыдущий месяц
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    // Переключение на следующий месяц
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handlePrevYear = () => {
    // Переключение на предыдущий год
    setCurrentYear(currentYear - 1);
  };

  const handleNextYear = () => {
    // Переключение на следующий год
    setCurrentYear(currentYear + 1);
  };

  const handleConfirm = () => {
    // Подтверждение выбранной даты
    const arr = new Date(currentYear, currentMonth, tempDate.getDate())
      .toLocaleDateString()
      .split(".");
    [arr[0], arr[2]] = [arr[2], arr[0]];
    setDate(arr.join("-"));
    setCalendar(false);
    ref.current.dataset.validation = true;
  };

  const handleCancel = () => {
    // Отмена выбора даты
    setCalendar(false);
  };

  const renderCalendar = () => {
    // Рендер дней месяца
    const daysCount = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDay = new Date(currentYear, currentMonth, 0).getDay();
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(
        <li className="calendar__daysList_item empty" key={`empty-${i}`}></li>
      );
    }

    for (let day = 1; day <= daysCount; day++) {
      days.push(
        <li
          className={`calendar__daysList_item ${
            day === tempDate.getDate() ? "selected" : ""
          }`}
          key={day}
          onClick={() => handleDateClick(day)}
          onKeyDown={(e) => (e.key === "Enter" ? handleDateClick(day) : null)}
        >
          <button>{day}</button>
        </li>
      );
    }
    return days;
  };

  const renderMonths = () => {
    // Рендер меню (месяцы)
    const months = [];
    for (let i = 0; i < monthsName.length; i++) {
      months.push(
        <li
          className={`calendar__menu_item ${
            i === currentMonth ? "selected" : ""
          }`}
          key={i}
          onClick={() => setCurrentMonth(i)}
          onKeyDown={(e) => (e.key === "Enter" ? setCurrentMonth(i) : null)}
        >
          <button>{monthsName[i]}</button>
        </li>
      );
    }
    return months;
  };

  const renderYears = () => {
    // Рендер меню (год)
    const years = [];
    for (let i = currentYear - 4; i < currentYear + 8; i++) {
      years.push(
        <li
          className={`calendar__menu_item ${
            i === currentYear ? "selected" : ""
          }`}
          key={i}
          onClick={() => setCurrentYear(i)}
          onKeyDown={(e) => (e.key === "Enter" ? setCurrentYear(i) : null)}
        >
          <button>{i}</button>
        </li>
      );
    }
    return years;
  };

  const handleChange = (event) => {
    // Обработчик ввода в input
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
    // Имитация отправки формы
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
        onChange={(event) => handleChange(event)}
        onKeyDown={handleSubmit}
        value={date}
        max="9999-12-31"
      />
      {date.length > 0 && (
        <button
          className="date__input_clear"
          onMouseEnter={(e) => (e.currentTarget.style.opacity = 1)}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = 0)}
          onClick={() => setDate("")}
          title="Очистить"
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 16 16"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M4.11 2.697L2.698 4.11 6.586 8l-3.89 3.89 1.415 1.413L8 9.414l3.89 3.89 1.413-1.415L9.414 8l3.89-3.89-1.415-1.413L8 6.586l-3.89-3.89z"
              fill="#6F7DAD"
            ></path>
          </svg>
        </button>
      )}
      <div className="date__picker">
        <button
          className="date__picker_btn"
          onClick={toggleCalendar}
          title="Открыть календарь"
        >
          <svg
            width="8"
            height="10"
            viewBox="0 0 8 10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="date__picker_icon"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M6.91667 1.77865H6.5V0.945312H5.66667V1.77865H2.33333V0.945312H1.5V1.77865H1.08333C0.620833 1.77865 0.25 2.15365 0.25 2.61198V8.44531C0.25 8.90365 0.620833 9.27865 1.08333 9.27865H6.91667C7.375 9.27865 7.75 8.90365 7.75 8.44531V2.61198C7.75 2.15365 7.375 1.77865 6.91667 1.77865ZM6.91667 8.44531H1.08333V3.86198H6.91667V8.44531ZM1.70833 5.52865C1.70833 4.95365 2.175 4.48698 2.75 4.48698C3.325 4.48698 3.79167 4.95365 3.79167 5.52865C3.79167 6.10365 3.325 6.57031 2.75 6.57031C2.175 6.57031 1.70833 6.10365 1.70833 5.52865Z"
              fill="#4B7CDD"
            />
          </svg>
        </button>
        {isCalendarOpen && (
          <div
            className="calendar"
            style={{ top: ref.current.getBoundingClientRect().height }}
          >
            <header className="calendar__header">
              <div className="calendar__header_month">
                <button title="Предыдущий месяц" onClick={handlePrevMonth}>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 16 16"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M6 8l4-3.5v7L6 8z" fill="#6484C5"></path>
                  </svg>
                </button>
                <span
                  tabIndex="0"
                  onKeyDown={(e) =>
                    e.key === "Enter" ? toggleMenu("months") : null
                  }
                  onClick={() => toggleMenu("months")}
                >{`${monthsName[currentMonth]}`}</span>
                <button title="Следующий месяц" onClick={handleNextMonth}>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 16 16"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M10 8l-4 3.5v-7L10 8z" fill="#6484C5"></path>
                  </svg>
                </button>
              </div>
              <div className="calendar__header_year">
                <button title="Предыдущий год" onClick={handlePrevYear}>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 16 16"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M6 8l4-3.5v7L6 8z" fill="#6484C5"></path>
                  </svg>
                </button>
                <span
                  tabIndex="0"
                  onKeyDown={(e) =>
                    e.key === "Enter" ? toggleMenu("years") : null
                  }
                  onClick={() => toggleMenu("years")}
                >{`${currentYear}`}</span>
                <button title="Следующий год" onClick={handleNextYear}>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 16 16"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M10 8l-4 3.5v-7L10 8z" fill="#6484C5"></path>
                  </svg>
                </button>
              </div>
            </header>
            <main className="calendar__main">
              <ul className="calendar__daysOfWeek">
                {daysName.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
              <ul className="calendar__daysList">{renderCalendar()}</ul>
            </main>
            <footer className="calendar__footer">
              <button
                className="calendar__footer_confirm"
                onClick={handleConfirm}
              >
                Подтвердить
              </button>
              <button
                className="calendar__footer_cancel"
                onClick={handleCancel}
              >
                Отменить
              </button>
            </footer>
          </div>
        )}
        {isMenuOpen && (
          <div
            className="calendar"
            style={{ top: ref.current.getBoundingClientRect().height }}
          >
            <header className="calendar__header">
              <div className="calendar__header_month">
                <span>{`${monthsName[currentMonth]}`}</span>
              </div>
              <div className="calendar__header_year">
                <span>{`${currentYear}`}</span>
              </div>
            </header>
            <ul className="calendar__menu">
              {menuElm === "months" ? renderMonths() : renderYears()}
            </ul>
            <footer className="calendar__footer">
              <button
                className="calendar__footer_confirm"
                onClick={() => {
                  menuElm === "months"
                    ? setMenuElm("years")
                    : setMenuElm("months");
                  if (secondMenu) {
                    toggleCalendar();
                    handleDateClick(
                      tempDate.toLocaleDateString().split(".")[0]
                    );
                  }
                  setSecondMenu(true);
                }}
              >
                Подтвердить
              </button>
              <button className="calendar__footer_cancel" onClick={toggleMenu}>
                Отменить
              </button>
            </footer>
          </div>
        )}
      </div>
    </div>
  );
}

export default DateInput;
