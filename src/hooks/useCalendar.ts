import { useState } from 'react';

export const useCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month, 1).getDay();
  };

  const getPreviousMonthDays = (date: Date) => {
    const firstDay = getFirstDayOfMonth(date);
    const prevMonth = new Date(date.getFullYear(), date.getMonth() - 1);
    const daysInPrevMonth = getDaysInMonth(prevMonth);
    const days = [];

    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({
        date: new Date(prevMonth.getFullYear(), prevMonth.getMonth(), daysInPrevMonth - i),
        isCurrentMonth: false,
      });
    }

    return days;
  };

  const getCurrentMonthDays = (date: Date) => {
    const daysInMonth = getDaysInMonth(date);
    const days = [];

    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        date: new Date(date.getFullYear(), date.getMonth(), i),
        isCurrentMonth: true,
      });
    }

    return days;
  };

  const getNextMonthDays = (date: Date, currentDays: number) => {
    const totalDaysNeeded = 42; // 6 rows * 7 days
    const remainingDays = totalDaysNeeded - currentDays;
    const nextMonth = new Date(date.getFullYear(), date.getMonth() + 1);
    const days = [];

    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: new Date(nextMonth.getFullYear(), nextMonth.getMonth(), i),
        isCurrentMonth: false,
      });
    }

    return days;
  };

  const getAllDaysInMonth = () => {
    const prevMonthDays = getPreviousMonthDays(currentDate);
    const currentMonthDays = getCurrentMonthDays(currentDate);
    const nextMonthDays = getNextMonthDays(
      currentDate,
      prevMonthDays.length + currentMonthDays.length
    );

    return [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];
  };

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  return {
    currentDate,
    getAllDaysInMonth,
    goToPreviousMonth,
    goToNextMonth,
  };
};