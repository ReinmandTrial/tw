// Підключення функціоналу "Чертоги Фрілансера"
import { isMobile } from "./functions.js";
// Підключення списку активних модулів
import { flsModules } from "./modules.js";

import 'flowbite';

if (localStorage.getItem('color-theme') === 'dark' || (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
  document.documentElement.classList.add('dark');
} else {
  document.documentElement.classList.remove('dark')
}

var themeToggleDarkIcon = document.getElementById('theme-toggle-dark-icon');
var themeToggleLightIcon = document.getElementById('theme-toggle-light-icon');

// Change the icons inside the button based on previous settings
if (localStorage.getItem('color-theme') === 'dark' || (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    themeToggleLightIcon.classList.remove('hidden');
} else {
    themeToggleDarkIcon.classList.remove('hidden');
}

var themeToggleBtn = document.getElementById('theme-toggle');

themeToggleBtn.addEventListener('click', function() {

    // toggle icons inside button
    themeToggleDarkIcon.classList.toggle('hidden');
    themeToggleLightIcon.classList.toggle('hidden');

    // if set via local storage previously
    if (localStorage.getItem('color-theme')) {
        if (localStorage.getItem('color-theme') === 'light') {
            document.documentElement.classList.add('dark');
            localStorage.setItem('color-theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('color-theme', 'light');
        }

    // if NOT set via local storage previously
    } else {
        if (document.documentElement.classList.contains('dark')) {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('color-theme', 'light');
        } else {
            document.documentElement.classList.add('dark');
            localStorage.setItem('color-theme', 'dark');
        }
    }
    
});


// Находим элементы на странице
const toggleButton = document.getElementById('toggle-filter');
const sidebar = document.getElementById('sidebar');
const closeButton = document.querySelector('#sidebar .sidebar-close');

// Проверяем, существуют ли элементы перед добавлением слушателей событий
if (toggleButton && sidebar && closeButton) {
  
  // Добавляем обработчик клика для кнопки открытия/закрытия фильтра
  toggleButton.addEventListener('click', () => {
    sidebar.classList.add('!block');
  });

  // Добавляем обработчик клика для кнопки закрытия в сайдбаре
  closeButton.addEventListener('click', () => {
    sidebar.classList.remove('!block');
  });
  
} else {
  console.warn("Некоторые элементы не найдены на странице. Проверьте, что все ID и классы указаны верно.");
}

const disabledDates = [
  moment('2024-11-05'),
  moment('2024-11-10'),
  moment('2024-11-15')
];

$('#datepicker').daterangepicker({
  "parentEl": ".modal-container-date",
  "startDate": moment(),  // Start date — today
  // "minDate": moment().subtract(2, 'days'), // Minimum date — two days ago
  "opens": "center", // Optionally position the calendar in the center
  "locale": {
    "applyLabel": "Apply",
    "cancelLabel": "Cancel",
    "fromLabel": "From",
    "toLabel": "To",
    "customRangeLabel": "Select range",
    "previousMonth": "<svg width='16' height='16' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg' class='flex-grow-0 flex-shrink-0 w-4 h-4 relative' preserveAspectRatio='xMidYMid meet'><path d='M12.6667 8H3.33337' stroke='#020617' stroke-width='1.25' stroke-linecap='round' stroke-linejoin='round'></path><path d='M8.00004 12.6673L3.33337 8.00065L8.00004 3.33398' stroke='#020617' stroke-width='1.25' stroke-linecap='round' stroke-linejoin='round'></path></svg>", // Custom prev icon
    "nextMonth": "<svg width='16' height='16' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg' class='flex-grow-0 flex-shrink-0 w-4 h-4 relative' preserveAspectRatio='xMidYMid meet'><path d='M3.33337 8H12.6667' stroke='#020617' stroke-width='1.25' stroke-linecap='round' stroke-linejoin='round'></path><path d='M8 3.33398L12.6667 8.00065L8 12.6673' stroke='#020617' stroke-width='1.25' stroke-linecap='round' stroke-linejoin='round'></path></svg>"  // Custom next icon
  },
  "autoUpdateInput": false,  // Disable auto-updating the input field
  "isInvalidDate": function(date) {
    // Disable specific dates from the disabledDates array
    for (let i = 0; i < disabledDates.length; i++) {
      if (date.isSame(disabledDates[i], 'day')) {
        return true;  // Disable this date
      }
    }
    // Disable all dates before two days ago
    return date.isBefore(moment().subtract(2, 'days'), 'day');
  }
}, function(start, end, label) {
  // Update the input field with either one date or two dates
  if (start.isSame(end)) {
    $('#datepicker').val(start.format('YYYY-MM-DD'));
  } else {
    $('#datepicker').val(start.format('YYYY-MM-DD') + ' - ' + end.format('YYYY-MM-DD'));
  }

  console.log('New date range selected: ' + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD') + ' (predefined range: ' + label + ')');
});


