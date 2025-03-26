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
  const ctx = document.querySelector(".js-chart");

  // 年月取得
  document.querySelector(".js-setMonth").addEventListener('click', function() {
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
    const url = `https://script.google.com/macros/s/AKfycbyAAn6f_wblOfB_GUnxPooyQIUqHhHoPuJmTcITT4iKKmb4FYh_GT3ZoxljQUCAdj1k/exec?year=${year}&month=${month}`;

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
    const allWeekKeys = [...new Set( data.flatMap( item => Object.keys(item).filter( key => key !== 'category' )))];
    allWeekKeys.sort( (a, b) => a.localeCompare(b, undefined, {numeric: true}) );   // 順に並べる
    const labels = allWeekKeys;

    // カテゴリ名取得
    const categories = data.map( item => item.category );

    // データセット
    const datasets = categories.map( category => {
      return {
        label: category,
        data: labels.map( weekKey => {
          const categoryData = data.find( item => item.category === category);
          return categoryData[weekKey] ? categoryData[weekKey] : 0;
        }),
      };
    });

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
              size: 16,
              weight: 400
            },
            padding: {top: 16}
          },
          tooltip: {
            backgroundColor: '#fff',
            titleColor: '#246286',
            titleFont: {
              size: 14,
              weight: 400
            },
            bodyColor: '#246286',
            borderColor: '#246286',
            borderWidth: 1
          }
        },
        scales: {
          x: {
            stacked: true,
            ticks: {
              font: {
                size: 14
              }
            }
          },
          y: {
            stacked: true,
            beginAtZero: true
          }
        },
        barPercentage: 0.5,
        responsive: true,
        maintainAspectRatio: false
      }
    });
  }

  // canvasサイズ指定
  function setCanvasHeight() {
    const bp = 768;
    if ( window.innerWidth < bp ) {
      ctx.style.height = '360px';
    } else {
      ctx.style.height = '520px';
    }
  }

  // 初回実行
  setCanvasHeight();
  // リサイズ時実行
  window.addEventListener('resize', setCanvasHeight);


  // ページ読み込み時にグラフ表示
  document.addEventListener('DOMContentLoaded', () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = ("0" + (today.getMonth() + 1)).slice(-2);
    const currentMonth = `${year}-${month}`;

    // input にセット
    const monthInput = document.querySelector("#month");
    monthInput.value = currentMonth;

    fetchData();
  });
}

