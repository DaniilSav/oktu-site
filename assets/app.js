/* ОКТУ. Интерактив главной страницы */
(() => {
  'use strict';

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  /* ---------- данные ---------- */

  const BRANCHES = {
    1: [
      ['38.02.01', 'Экономика и бухгалтерский учёт (по отраслям)', 'spec'],
      ['38.02.08', 'Торговое дело', 'spec'],
      ['43.02.15', 'Поварское и кондитерское дело', 'spec'],
      ['43.02.16', 'Туризм и гостеприимство', 'spec'],
      ['46.02.01', 'Документационное обеспечение управления и архивоведение', 'spec'],
      ['43.01.09', 'Повар, кондитер', 'prof']
    ],
    2: [
      ['08.02.01', 'Строительство и эксплуатация зданий и сооружений', 'spec'],
      ['23.02.01', 'Организация перевозок и управление на транспорте (по видам)', 'spec'],
      ['23.02.07', 'Техническое обслуживание и ремонт автотранспортных средств', 'spec'],
      ['08.01.28', 'Мастер отделочных строительных и декоративных работ', 'prof'],
      ['11.01.01', 'Монтажник радиоэлектронной аппаратуры и приборов', 'prof'],
      ['15.01.05', 'Сварщик (ручной и частично механизированной сварки)', 'prof'],
      ['23.01.08', 'Слесарь по ремонту строительных машин', 'prof']
    ],
    3: [
      ['09.02.11', 'Разработка и управление программным обеспечением', 'spec'],
      ['11.02.16', 'Монтаж, обслуживание и ремонт электронных приборов и устройств', 'spec'],
      ['13.02.13', 'Эксплуатация и обслуживание электромеханического оборудования', 'spec'],
      ['15.02.16', 'Технология машиностроения', 'spec'],
      ['15.02.17', 'Обслуживание и ремонт промышленного оборудования (по отраслям)', 'spec'],
      ['13.01.10', 'Электромонтёр по ремонту и обслуживанию электрооборудования', 'prof'],
      ['15.01.35', 'Мастер слесарных работ', 'prof'],
      ['15.01.38', 'Оператор-наладчик металлообрабатывающих станков', 'prof']
    ]
  };

  const STAFF = [
    ['Лаптева Ксения Николаевна', 'Директор', '8 (48439) 6-01-67', '+74843960167'],
    ['Лучина Наталья Ивановна', 'Заместитель директора по учебной работе', '8 (48439) 6-38-88', '+74843963888'],
    ['Касьян Анна Александровна', 'Заместитель директора по учебно-производственной работе', '8 (48439) 6-44-87', '+74843964487'],
    ['Полякова Наталья Валерьевна', 'Заместитель директора по учебно-производственной работе', '8 (48439) 6-35-21', '+74843963521'],
    ['Горбачева Вера Игоревна', 'Заместитель директора по учебно-производственной работе', '8 (48439) 3-31-86', '+74843933186'],
    ['Антонова Наталья Александровна', 'Заместитель директора по воспитательной работе', '8 (48439) 6-44-87', '+74843964487'],
    ['Гуль Анастасия Александровна', 'Заместитель директора по безопасности и АХЧ', '8 (48439) 5-61-66', '+74843956166'],
    ['Абрамова Елена Леонидовна', 'Ведущий специалист по кадрам', '8 (48439) 6-15-15', '+74843961515']
  ];

  /* ---------- бегущая строка ---------- */

  const track = $('#marqueeTrack');
  if (track) {
    const all = Object.values(BRANCHES).flat();
    const row = all.map(([code, name]) =>
      `<span class="marquee__item"><span class="marquee__code">${code}</span>${name}</span>`
    ).join('');
    track.innerHTML = row + row;
  }

  /* ---------- шапка: состояние прилипания ---------- */

  const header = $('#header');
  const sentinel = $('#sentinel');
  if (header && sentinel) {
    new IntersectionObserver(([e]) => {
      header.dataset.stuck = String(!e.isIntersecting);
    }).observe(sentinel);
  }

  /* ---------- мегаменю ---------- */

  const megaWrap = $('#megaWrap');
  const megaBtn  = $('#megaBtn');
  const mega     = $('#mega');
  let megaTimer;

  const setMega = (open) => {
    if (!mega) return;
    mega.dataset.open = String(open);
    megaBtn.setAttribute('aria-expanded', String(open));
  };

  if (megaWrap) {
    megaBtn.addEventListener('click', () => setMega(mega.dataset.open !== 'true'));

    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      megaWrap.addEventListener('mouseenter', () => { clearTimeout(megaTimer); setMega(true); });
      megaWrap.addEventListener('mouseleave', () => { megaTimer = setTimeout(() => setMega(false), 140); });
    }
    megaWrap.addEventListener('focusout', (e) => {
      if (!megaWrap.contains(e.relatedTarget)) setMega(false);
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mega.dataset.open === 'true') { setMega(false); megaBtn.focus(); }
    });
    document.addEventListener('click', (e) => {
      if (!megaWrap.contains(e.target)) setMega(false);
    });
  }

  /* ---------- мобильное меню ---------- */

  const drawer = $('#drawer');
  const burger = $('#burger');

  const setDrawer = (open) => {
    drawer.dataset.open = String(open);
    burger.setAttribute('aria-expanded', String(open));
    drawer.toggleAttribute('inert', !open);
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) $('#drawerClose').focus();
  };

  if (drawer && burger) {
    burger.addEventListener('click', () => setDrawer(drawer.dataset.open !== 'true'));
    $('#drawerClose').addEventListener('click', () => { setDrawer(false); burger.focus(); });
    $$('a', drawer).forEach(a => a.addEventListener('click', () => setDrawer(false)));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && drawer.dataset.open === 'true') { setDrawer(false); burger.focus(); }
    });
  }

  /* ---------- тема ---------- */

  const themeBtn = $('#themeBtn');
  const themeUse = $('#themeUse');
  const sysDark = window.matchMedia('(prefers-color-scheme: dark)');

  const isDark = () => {
    const explicit = document.documentElement.dataset.theme;
    return explicit ? explicit === 'dark' : sysDark.matches;
  };

  const paintThemeIcon = () => {
    themeUse.setAttribute('href', isDark() ? '#i-sun' : '#i-moon');
  };

  if (themeBtn) {
    try {
      const saved = localStorage.getItem('oktu-theme');
      if (saved === 'dark' || saved === 'light') document.documentElement.dataset.theme = saved;
    } catch (_) {}
    paintThemeIcon();
    sysDark.addEventListener('change', paintThemeIcon);

    themeBtn.addEventListener('click', () => {
      const next = isDark() ? 'light' : 'dark';
      document.documentElement.dataset.theme = next;
      try { localStorage.setItem('oktu-theme', next); } catch (_) {}
      paintThemeIcon();
    });
  }

  /* ---------- версия для слабовидящих ---------- */

  const visionBtn = $('#visionBtn');
  if (visionBtn) {
    try {
      if (localStorage.getItem('oktu-vision') === 'on') {
        document.documentElement.dataset.vision = 'on';
        visionBtn.setAttribute('aria-pressed', 'true');
      }
    } catch (_) {}

    visionBtn.addEventListener('click', () => {
      const on = document.documentElement.dataset.vision !== 'on';
      if (on) document.documentElement.dataset.vision = 'on';
      else delete document.documentElement.dataset.vision;
      visionBtn.setAttribute('aria-pressed', String(on));
      try { localStorage.setItem('oktu-vision', on ? 'on' : 'off'); } catch (_) {}
    });
  }

  /* ---------- вкладки: специальности ---------- */

  const tabs = $$('.tab');
  const pill = $('#pill');
  const panel = $('#programs-panel');

  const movePill = (tab) => {
    if (!pill || !tab) return;
    const list = tab.parentElement;
    const a = tab.getBoundingClientRect();
    const b = list.getBoundingClientRect();
    pill.style.width = a.width + 'px';
    pill.style.transform = `translateX(${a.left - b.left - list.clientLeft}px)`;
  };

  const renderPrograms = (branch) => {
    const list = BRANCHES[branch] || [];
    panel.innerHTML = list.map(([code, name, kind], i) => `
      <div class="program" style="--d:${i * 45}ms">
        <span class="program__code">${code}</span>
        <span class="program__name">${name}</span>
        <span class="program__kind" data-kind="${kind}">${kind === 'spec' ? 'специальность' : 'профессия'}</span>
      </div>`).join('');

    // следующий кадр, чтобы сработал переход, а не мгновенная отрисовка
    requestAnimationFrame(() => {
      requestAnimationFrame(() => $$('.program', panel).forEach(p => p.classList.add('is-shown')));
    });
  };

  const selectTab = (tab) => {
    tabs.forEach(t => {
      const on = t === tab;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
    });
    panel.setAttribute('aria-labelledby', tab.id);
    movePill(tab);
    renderPrograms(tab.dataset.branch);
  };

  if (tabs.length) {
    tabs.forEach(tab => tab.addEventListener('click', () => selectTab(tab)));

    // стрелки влево/вправо по списку вкладок
    $('.tabs__list').addEventListener('keydown', (e) => {
      const i = tabs.indexOf(document.activeElement);
      if (i < 0) return;
      let next = null;
      if (e.key === 'ArrowRight') next = tabs[(i + 1) % tabs.length];
      if (e.key === 'ArrowLeft')  next = tabs[(i - 1 + tabs.length) % tabs.length];
      if (e.key === 'Home') next = tabs[0];
      if (e.key === 'End')  next = tabs[tabs.length - 1];
      if (!next) return;
      e.preventDefault();
      next.focus();
      selectTab(next);
    });

    document.fonts?.ready.then(() => movePill($('.tab[aria-selected="true"]')));
    window.addEventListener('resize', () => movePill($('.tab[aria-selected="true"]')));
    selectTab(tabs[0]);
  }

  /* ---------- администрация ---------- */

  const staff = $('#staff');
  if (staff) {
    staff.innerHTML = STAFF.map(([name, role, tel, href]) => `
      <div class="staff__row">
        <div>
          <div class="staff__name">${name}</div>
          <div class="staff__role">${role}</div>
        </div>
        <a class="staff__tel" href="tel:${href}">${tel}</a>
      </div>`).join('');
  }

  /* ---------- появление блоков при прокрутке ---------- */

  const revealTargets = $$('[data-reveal], .step');
  if (reduced.matches) {
    revealTargets.forEach(el => el.classList.add('is-in'));
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.12 });
    revealTargets.forEach(el => io.observe(el));
  }

  /* ---------- счётчики ---------- */

  const counters = $$('[data-count]');
  const runCount = (el) => {
    const target = Number(el.dataset.count);
    if (reduced.matches) { el.textContent = target; return; }
    const dur = 900;
    const t0 = performance.now();
    const tick = (now) => {
      const p = Math.min(1, (now - t0) / dur);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  if (counters.length) {
    const cio = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        runCount(entry.target);
        cio.unobserve(entry.target);
      });
    }, { threshold: 0.6 });
    counters.forEach(el => cio.observe(el));
  }
})();
