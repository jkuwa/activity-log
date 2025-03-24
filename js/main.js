'use strict';

{
  // ---------- FullCalendar ----------
  document.addEventListener('DOMContentLoaded', () => {
    const calendarEL = document.querySelector(".js-calendar");
    const dayNames = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    const calendar = new FullCalendar.Calendar(calendarEL, {
      initialView: 'dayGridMonth',
      // ツールバー
      headerToolbar: {
        start: 'prevYear, prev',
        center: 'title',
        end: 'next, nextYear'
      },
      dayHeaderContent: (arg) => {
        return dayNames[arg.date.getDay()]
      },
      // カレンダー
      firstDay: 1,
      contentHeight: 'auto',
      // イベント
      events: [
        {
          title: '2025.03.18',
          start: '2025-03-18',
          end: '2025-03-18'
        },
        {
          title: '2025.03.20',
          start: '2025-03-20',
          end: '2025-03-20'
        }
      ],
      eventDisplay: 'list-item',
    });
    calendar.render();
  });
}