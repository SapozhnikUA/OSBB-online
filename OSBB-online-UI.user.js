// ==UserScript==
// @name         OSBB - online "Зміна елементів UI OSBB-online"
// @version      0.5
// @description  Змінює деякі елементи відображення та додає посилання на квитанції
// @author       Sapozhnik
// @match        https://osbb-online.com/*
// @match        https://cabinet.osbb-online.com/*
// @grant        none
// @downloadURL  https://github.com/SapozhnikUA/OSBB-online/raw/refs/heads/main/OSBB-online-UI.user.js
// @updateURL    https://github.com/SapozhnikUA/OSBB-online/raw/refs/heads/main/OSBB-online-UI.user.js
// ==/UserScript==
(function() {
    'use strict';

    // ─── 1. Акордеон ────────────────────────────────────────────────────────────
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

    // ─── 2. Іконки завантаження квитанцій ───────────────────────────────────────
    function addDownloadIcons() {
        const accountLinks = document.querySelectorAll('a[href*="/Admin/ManageAccount/"]:not(.bill-added)');
        accountLinks.forEach(link => {
            const href = link.getAttribute('href');
            const match = href.match(/\/Admin\/ManageAccount\/(\d+)/);
            if (match && match[1]) {
                const accountId = match[1];
                const downloadBtn = document.createElement('a');
                downloadBtn.href = `https://osbb-online.com/Account/DownloadBill/${accountId}`;
                downloadBtn.target = '_blank';
                downloadBtn.title = 'Завантажити квитанцію';
                downloadBtn.style.marginLeft = '8px';
                downloadBtn.style.textDecoration = 'none';
                downloadBtn.innerHTML = '📥';
                link.parentNode.insertBefore(downloadBtn, link.nextSibling);
                link.classList.add('bill-added');
            }
        });
    }

    // ─── 3. Плаваюче меню швидких посилань ──────────────────────────────────────
    function createFloatingMenu() {
        if (document.getElementById('osbb-floating-menu')) return;

        const now = new Date();
        const ym = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}`;

        const links = [
            { label: '🏦 Рахунок основний',   url: `https://osbb-online.com/House/ViewBankAccountRests/44882?accountNumber=26009025007543`, sameTab: true },
            { label: '🏦 Рахунок додатковий', url: `https://osbb-online.com/House/ViewBankAccountRests/44882?accountNumber=26001035010205`, sameTab: true },
            { label: '💳 Прийом',              url: `https://cabinet.osbb-online.com/Payments` },
            { label: '📦 Пачки',               url: `https://osbb-online.com/Account/NavigateExternal?type=payment_packages` },
            { label: '📋 Реєстр',              url: `https://osbb-online.com/Admin/Registry` },
            { label: '📊 Нарахування',         url: `https://osbb-online.com/Admin/Journal?yearMonth=${ym}` },
            { label: '⬇️ Борги (скачати)',     url: `https://osbb-online.com/Admin/DownloadJournalDebts?yearMonth=${ym}&workID=116027` },
        ];

        const savedX = parseInt(localStorage.getItem('osbb-menu-x'), 10);
        const savedY = parseInt(localStorage.getItem('osbb-menu-y'), 10);
        const startX = isNaN(savedX) ? (window.innerWidth - 200) : savedX;
        const startY = isNaN(savedY) ? 80 : savedY;

        const panel = document.createElement('div');
        panel.id = 'osbb-floating-menu';
        Object.assign(panel.style, {
            position:     'fixed',
            left:         `${startX}px`,
            top:          `${startY}px`,
            zIndex:       '99999',
            background:   '#e8e8e8',
            border:       '1px solid #aaa',
            borderRadius: '6px',
            boxShadow:    '0 2px 8px rgba(0,0,0,.35)',
            minWidth:     '180px',
            fontFamily:   'sans-serif',
            fontSize:     '13px',
            userSelect:   'none',
        });

        const header = document.createElement('div');
        header.textContent = '⚡ OSBB Меню';
        Object.assign(header.style, {
            background:     '#999',
            color:          '#fff',
            padding:        '5px 8px',
            borderRadius:   '5px 5px 0 0',
            cursor:         'grab',
            fontWeight:     'bold',
            fontSize:       '12px',
            display:        'flex',
            justifyContent: 'space-between',
            alignItems:     'center',
        });

        const toggleBtn = document.createElement('span');
        toggleBtn.textContent = '▲';
        Object.assign(toggleBtn.style, {
            cursor:   'pointer',
            fontSize: '11px',
            padding:  '0 2px',
        });
        header.appendChild(toggleBtn);
        panel.appendChild(header);

        const body = document.createElement('div');
        body.id = 'osbb-floating-body';
        Object.assign(body.style, { padding: '6px 0' });

        links.forEach(({ label, url, sameTab }) => {
            const a = document.createElement('a');
            a.href = url;
            a.target = sameTab ? '_self' : '_blank';
            a.rel = 'noopener';
            a.textContent = label;
            Object.assign(a.style, {
                display:        'block',
                padding:        '4px 10px',
                color:          '#1a1a6e',
                textDecoration: 'none',
                whiteSpace:     'nowrap',
            });
            a.addEventListener('mouseenter', () => a.style.background = '#d0d0d0');
            a.addEventListener('mouseleave', () => a.style.background = '');
            body.appendChild(a);
        });

        panel.appendChild(body);
        document.body.appendChild(panel);

        // ── Згортання/розгортання ──
        let collapsed = localStorage.getItem('osbb-menu-collapsed') === '1';
        function applyCollapse() {
            body.style.display    = collapsed ? 'none' : 'block';
            toggleBtn.textContent = collapsed ? '▼' : '▲';
            localStorage.setItem('osbb-menu-collapsed', collapsed ? '1' : '0');
        }
        applyCollapse();
        toggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            collapsed = !collapsed;
            applyCollapse();
        });

        // ── Drag ──
        let dragging = false, ox = 0, oy = 0;

        header.addEventListener('mousedown', (e) => {
            if (e.target === toggleBtn) return;
            dragging = true;
            ox = e.clientX - panel.offsetLeft;
            oy = e.clientY - panel.offsetTop;
            header.style.cursor = 'grabbing';
            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (!dragging) return;
            let nx = e.clientX - ox;
            let ny = e.clientY - oy;
            nx = Math.max(0, Math.min(nx, window.innerWidth  - panel.offsetWidth));
            ny = Math.max(0, Math.min(ny, window.innerHeight - panel.offsetHeight));
            panel.style.left = `${nx}px`;
            panel.style.top  = `${ny}px`;
        });

        document.addEventListener('mouseup', () => {
            if (!dragging) return;
            dragging = false;
            header.style.cursor = 'grab';
            localStorage.setItem('osbb-menu-x', parseInt(panel.style.left, 10));
            localStorage.setItem('osbb-menu-y', parseInt(panel.style.top,  10));
        });
    }

    // ─── Запуск ──────────────────────────────────────────────────────────────────
    function runAllModifications() {
        modifyAccordionHeight();
        if (window.location.href.includes('/Admin/Registry')) {
            addDownloadIcons();
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            runAllModifications();
            createFloatingMenu();
        });
    } else {
        runAllModifications();
        createFloatingMenu();
    }

    const observer = new MutationObserver(() => runAllModifications());
    observer.observe(document.body, { childList: true, subtree: true });
})();