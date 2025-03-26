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

  // グローバル変数
  let myChart;

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


  // ---------- Chart ----------
  document.querySelector(".js-selectMonth").addEventListener('click', function() {
    fetchData();
  });

  // スプシ取得
  async function fetchData() {
    const monthInput = document.querySelector("#month").value;
    if (!monthInput) {
      alert("年月を選択してください");
      return;
    }

    const [year, month] = monthInput.split("-");
    const url = `https://script.google.com/macros/s/AKfycby-XNZoasusI39MDGszVTI8PF87MAjr4GOPXZTXQYysFPiALiKL7I1igFvHucNLu9_y/exec?year=${year}&month=${month}`;

    try {
      const response = await fetch(url);   // 非同期でデータ取得
      const data = await response.json();   // JSON読み取り
      const title = `${year}.${month}`;

      updateChart(data, title);
    } catch (error) {
      console.error("データ取得エラー: ", error);
      alert("データ取得に失敗しました");
    }
  }

  // グラフの描画
  function updateChart(data, title) {
    // weekKeyを取得
    const allWeekKeys = [...new Set(data.flatMap(item => Object.keys(item).filter(key => key !== 'category')))];
    allWeekKeys.sort((a, b) => a.localeCompare(b, undefined, {numeric: true}));   // 順に並べる
    const labels = allWeekKeys;
    // カテゴリ名取得
    const categories = data.map(item => item.category);

    // データセット
    const datasets = categories.map(category => {
      return {
        label: category,
        data: labels.map(weekKey => {
          const categoryData = data.find(item => item.category === category);
          return categoryData ? categoryData[weekKey] : 0;
        }),
      };
    });

    const ctx = document.querySelector(".js-chart");

    if (myChart) {
      myChart.destroy();
    }

    Chart.defaults.font.family = "'Zen Maru Gothic', 'serif'";
    myChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: datasets
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: title,
            position: 'bottom',
            font: {
              size: 20,
              weight: 400
            },
            padding: {top: 32}
          },
          tooltip: {
            backgroundColor: '#fff',
            titleColor: '#246286',
            titleFont: {
              size: 14,
              weight: 400
            },
            bodyColor: '#246286',
          }
        },
        scales: {
          x: {
            stacked: true
          },
          y: {
            stacked: true,
            beginAtZero: true
          }
        }
      }
    });
  }
}

