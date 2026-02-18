// ==UserScript==
// @name         OSBB - online "Зміна елементів UI OSBB-online"
// @version      0.3
// @description  Змінює деякі елементи відображення та додає посилання на квитанції
// @author       Sapozhnik
// @match        https://osbb-online.com/*
// @grant        none
// @downloadURL  https://github.com/SapozhnikUA/OSBB-online/raw/refs/heads/main/OSBB-online-UI.user.js
// @updateURL    https://github.com/SapozhnikUA/OSBB-online/raw/refs/heads/main/OSBB-online-UI.user.js
// ==/UserScript==

(function() {
    'use strict';

    // 1. Функція для зміни висоти акордеона
    function modifyAccordionHeight() {
        const accordionContents = document.querySelectorAll(
            'div.ui-accordion-content.ui-helper-reset.ui-widget-content.ui-corner-bottom.ui-accordion-content-active'
        );

        accordionContents.forEach(accordionDiv => {
            const tableInside = accordionDiv.querySelector('table[style*="margin-left: auto;"][style*="margin-right: auto;"]');
            if (tableInside && accordionDiv.style.height !== '399px') {
                accordionDiv.style.height = '399px';
            }
        });
    }

    // 2. Функція для додавання іконки завантаження квитанції
    function addDownloadIcons() {
        // Шукаємо посилання, які ведуть на керування акаунтом
        const accountLinks = document.querySelectorAll('a[href*="/Admin/ManageAccount/"]:not(.bill-added)');

        accountLinks.forEach(link => {
            const href = link.getAttribute('href');
            // Витягуємо ID за допомогою регулярного виразу
            const match = href.match(/\/Admin\/ManageAccount\/(\d+)/);
            
            if (match && match[1]) {
                const accountId = match[1];
                
                // Створюємо елемент іконки-посилання
                const downloadBtn = document.createElement('a');
                downloadBtn.href = `https://osbb-online.com/Account/DownloadBill/${accountId}`;
                downloadBtn.target = "_blank";
                downloadBtn.title = "Завантажити квитанцію";
                downloadBtn.style.marginLeft = "8px";
                downloadBtn.style.textDecoration = "none";
                downloadBtn.innerHTML = "📥"; // Можна замінити на іконку шрифту, якщо він підключений

                // Додаємо іконку після тексту посилання
                link.parentNode.insertBefore(downloadBtn, link.nextSibling);
                
                // Позначаємо посилання як оброблене, щоб не додавати іконку двічі
                link.classList.add('bill-added');
            }
        });
    }

    // Запуск функцій
    function runAllModifications() {
        modifyAccordionHeight();
        if (window.location.href.includes('/Admin/Registry')) {
            addDownloadIcons();
        }
    }

    // Ініціалізація
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', runAllModifications);
    } else {
        runAllModifications();
    }

    // Спостерігач за динамічними змінами
    const observer = new MutationObserver(() => {
        runAllModifications();
    });

    observer.observe(document.body, { childList: true, subtree: true });

})();