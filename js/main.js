'use strict';

$(function() {
  // ---------- タブ ----------
  $(".js-tabBtn").on('click', function() {
    if ( $(this).hasClass('is-current') ) {
      return;
    }
    // 選択中のタブを外す
    $(".is-current").removeClass('is-current').attr({
      'aria-selected': 'false',
      'tabindex': '-1',
    });
    $(".js-tabContent").removeClass('is-open');

    // コンテンツを表示
    const index = $(".js-tabBtn").index(this);
    $(".js-tabContent").eq(index).addClass('is-open');
    // タブの切り替え
    $(this).addClass('is-current').attr({
      'aria-selected': 'true',
      'tabindex': '0'
    })
  });

  // キーボード操作
  $(".js-tabBtn").keydown(function(e) {
    if ( e.which === 37 ) {
      e.preventDefault();
      const prevTab = $(this).prev('.js-tabBtn');

      if ( prevTab.length ) {
        prevTab.focus();
      }
    } else if ( e.which === 39 ) {
      e.preventDefault();
      const nextTab = $(this).next('.js-tabBtn');

      if ( nextTab.length ) {
        nextTab.focus();
      }
    }
  });

});


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