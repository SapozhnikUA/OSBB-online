// ==UserScript==
// @name         OSBB - online "Зміна елементів UI OSBB-online"
// @version      0.2
// @description  Змінює деякі елементи відображення
// @author       Sapozhnik
// @match        https://osbb-online.com/*
// @grant        none
// @downloadURL https://github.com/SapozhnikUA/OSBB-online/raw/refs/heads/main/OSBB-online-UI.user.js
// @updateURL https://github.com/SapozhnikUA/OSBB-online/raw/refs/heads/main/OSBB-online-UI.user.js
// ==/UserScript==

(function() {
    'use strict';

    // Функція, яка буде виконуватися при завантаженні DOM
    function modifyAccordionHeight() {
        // Знаходимо всі div елементи, які відповідають вказаним класам
        const accordionContents = document.querySelectorAll(
            'div.ui-accordion-content.ui-helper-reset.ui-widget-content.ui-corner-bottom.ui-accordion-content-active'
        );

        accordionContents.forEach(accordionDiv => {
            // Перевіряємо, чи містить поточний div таблицю зі стилями margin-left: auto; margin-right: auto;
            const tableInside = accordionDiv.querySelector('table[style*="margin-left: auto;"][style*="margin-right: auto;"]');

            if (tableInside) {
                // Якщо таблиця знайдена, змінюємо стиль height для div
                accordionDiv.style.height = '399px';
                console.log('Змінено висоту елемента:', accordionDiv);
            }
        });
    }

    // Виконуємо функцію після повного завантаження DOM
    // Використовуємо DOMContentLoaded, щоб переконатися, що всі елементи доступні
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', modifyAccordionHeight);
    } else {
        // Якщо DOM вже завантажений (наприклад, скрипт завантажується пізніше), виконуємо відразу
        modifyAccordionHeight();
    }

    // Додатково можна додати спостерігач за змінами в DOM, якщо контент завантажується динамічно
    // Цей розділ є необов'язковим, але може бути корисним для односторінкових додатків (SPA)
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                // Перевіряємо, чи додалися нові елементи, які можуть бути нашими акордеонами
                modifyAccordionHeight();
            }
        });
    });

    // Спостерігаємо за змінами в тілі документа
    observer.observe(document.body, { childList: true, subtree: true });

})();
