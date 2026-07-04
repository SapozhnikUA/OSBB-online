// ==UserScript==
// @name         OSBB - online "Зміна елементів UI OSBB-online"
// @version      0.9
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
            { urls: [{ label: '💳 Прийом',      url: `https://cabinet.osbb-online.com/Payments` }] },
            { urls: [{ label: '📦 Пачки',       url: `https://osbb-online.com/Account/NavigateExternal?type=payment_packages` }] },
            { urls: [{ label: '📋 Реєстр',      url: `https://osbb-online.com/Admin/Registry` }] },
            { urls: [{ label: '📊 Нарахування', url: `https://osbb-online.com/Admin/Journal?yearMonth=${ym}` }] },
            { urls: [
                { label: '🏦 Осн.',  url: `https://osbb-online.com/House/ViewBankAccountRests/44882?accountNumber=26009025007543`, sameTab: true },
                { label: 'Дод.',     url: `https://osbb-online.com/House/ViewBankAccountRests/44882?accountNumber=26001035010205`, sameTab: true },
            ]},
            { urls: [
                { label: '⬇️ Борги', url: `https://osbb-online.com/Admin/DownloadJournalDebts?yearMonth=${ym}&workID=116027` },
                { label: '📂 База',  url: `https://dontsa2a.kyiv.ua/home/administration/paymentBase/` },
            ]},
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
            minWidth:     '160px',
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

        links.forEach(({ urls }) => {
            const row = document.createElement('div');
            Object.assign(row.style, {
                display:      'flex',
                padding:      '3px 10px',
                gap:          '3px',
                alignItems:   'center',
                borderRadius: '3px',
            });

            urls.forEach(({ label, url, sameTab }, i) => {
                if (i > 0) {
                    const sep = document.createElement('span');
                    sep.textContent = '·';
                    Object.assign(sep.style, { color: '#888', flexShrink: '0' });
                    row.appendChild(sep);
                }
                const a = document.createElement('a');
                a.href = url;
                a.target = sameTab ? '_self' : '_blank';
                a.rel = 'noopener';
                a.textContent = label;
                Object.assign(a.style, {
                    color:          '#1a1a6e',
                    textDecoration: 'none',
                    whiteSpace:     'nowrap',
                    padding:        '1px 3px',
                    borderRadius:   '3px',
                });
                a.addEventListener('mouseenter', () => a.style.background = '#c8c8c8');
                a.addEventListener('mouseleave', () => a.style.background = '');
                row.appendChild(a);
            });

            row.addEventListener('mouseenter', () => row.style.background = '#dedede');
            row.addEventListener('mouseleave', () => row.style.background = '');
            body.appendChild(row);
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

    // ─── 4. Плаваюча кнопка "Зберегти" на EditAccountOwner ──────────────────────
    function createFloatingSaveButton() {
        if (!window.location.href.includes('/Admin/EditAccountOwner/')) return;
        if (document.getElementById('osbb-floating-save')) return;

        const btn = document.createElement('button');
        btn.id = 'osbb-floating-save';
        btn.textContent = '💾 Зберегти';
        Object.assign(btn.style, {
            position:     'fixed',
            bottom:       '24px',
            right:        '24px',
            zIndex:       '99999',
            background:   '#4a7c4e',
            color:        '#fff',
            border:       'none',
            borderRadius: '6px',
            padding:      '10px 20px',
            fontSize:     '14px',
            fontWeight:   'bold',
            fontFamily:   'sans-serif',
            cursor:       'pointer',
            boxShadow:    '0 2px 8px rgba(0,0,0,.35)',
        });
        btn.addEventListener('mouseenter', () => btn.style.background = '#3a6340');
        btn.addEventListener('mouseleave', () => btn.style.background = '#4a7c4e');
        btn.addEventListener('click', () => document.querySelector('form').submit());

        document.body.appendChild(btn);
    }

    // ─── Запуск ──────────────────────────────────────────────────────────────────
    function runAllModifications() {
        modifyAccordionHeight();
        if (window.location.href.includes('/Admin/Registry')) {
            addDownloadIcons();
        }
        createFloatingSaveButton();
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
