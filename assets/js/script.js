/* =========================================================
   Halyk Bank — "Инвестируйте в золото" — page logic
   Vanilla JS, no build step, data-driven components.
   ========================================================= */
(function () {
  "use strict";

  /* ---------------------------------------------------------
   * DATA CONFIG
   * --------------------------------------------------------- */

  const GOLD_IMG_BASE = "https://halykbank.kz/storage/app/media/2026/gold/new/";

  /** Config for the "Мерные слитки аффинированного золота" cards. */
  const GOLD_BARS = [
    { weight: 5,   width: "14,1 мм", length: "24,2 мм", metal: "Золото", purity: "999,9", pdf: "https://halykbank.kz/storage/app/media/2026/gold/5-gold.pdf",   img: GOLD_IMG_BASE + "5-new.png" },
    { weight: 10,  width: "15 мм",   length: "25,8 мм", metal: "Золото", purity: "999,9", pdf: "https://halykbank.kz/storage/app/media/2026/gold/10-gold.pdf",  img: GOLD_IMG_BASE + "10-new.png" },
    { weight: 20,  width: "17,4 мм", length: "30 мм",   metal: "Золото", purity: "999,9", pdf: "https://halykbank.kz/storage/app/media/2026/gold/20-gold.pdf",  img: GOLD_IMG_BASE + "20-new.png" },
    { weight: 50,  width: "22 мм",   length: "37,9 мм", metal: "Золото", purity: "999,9", pdf: "https://halykbank.kz/storage/app/media/2026/gold/50-gold.pdf",  img: GOLD_IMG_BASE + "50-new.png" },
    { weight: 100, width: "32 мм",   length: "55 мм",   metal: "Золото", purity: "999,9", pdf: "https://halykbank.kz/storage/app/media/2026/gold/100-gold.pdf", img: GOLD_IMG_BASE + "100-new.png" },
  ];

  /** Branches (филиалы), matching the original site's select options. */
  const BRANCHES = [
    { code: "AST", name: "Астанинский городской филиал" },
    { code: "ALM", name: "Алматинский городской филиал" },
    { code: "AKM", name: "Акмолинский ОФ" },
    { code: "AKT", name: "Актюбинский ОФ" },
    { code: "ATY", name: "Атырауский ОФ" },
    { code: "BAY", name: "Байконырский РФ" },
    { code: "BHS", name: "Балхашский РФ" },
    { code: "VOS", name: "Восточно-Казахстанский ОФ" },
    { code: "JHA", name: "Жамбылский ОФ" },
    { code: "JHO", name: "Жанаозенский РФ" },
    { code: "JEZ", name: "ОФ «Ұлытау»" },
    { code: "ZAP", name: "Западно-Казахстанский ОФ" },
    { code: "KAR", name: "Карагандинский ОФ" },
    { code: "KUS", name: "Костанайский ОФ" },
    { code: "KZY", name: "Кызылординский ОФ" },
    { code: "MAN", name: "Мангистауский ОФ" },
    { code: "PAV", name: "Павлодарский ОФ" },
    { code: "SEV", name: "Северо-Казахстанский ОФ" },
    { code: "SEM", name: "ОФ Абай" },
    { code: "TDK", name: "ОФ «Жетiсу»" },
    { code: "TEM", name: "Темиртауский РФ" },
    { code: "YUZ", name: "Туркестанский ОФ" },
    { code: "SHY", name: "Шымкентский городской филиал" },
    { code: "EKB", name: "Экибастузский РФ" },
    { code: "KON", name: "Алматинский ОФ (г. Конаев)" },
  ];

  /** Gold rate (KZT), identical across branches on the source site. */
  const GOLD_RATE = {
    sell_rate_1: 64193.21, // до 100 гр
    sell_rate_2: 63884.59, // до 1000 гр
    sell_rate_3: 63575.97, // от 1000 гр
    buy_rate: 59752.89,
    buy_rate_damage: 43120.64,
    updated: "15.09.2026 17:51:00",
  };

  /** FAQ — order matches the source page exactly. */
  const FAQ_ITEMS = [
    {
      q: "Как приобрести/продать золотые слитки в Банке и где осуществляется покупка/продажа?",
      a: "<p>Приобретение и продажа слитков осуществляется по предварительной заявке, которую необходимо оформить на сайте Банка. После обработки заявки менеджер Банка связывается с клиентом, информирует о наличии слитка и сообщает адрес отделения, в котором можно совершить покупку и продажу.</p>",
    },
    {
      q: "Продаёт ли Банк серебряные слитки или коллекционные монеты?",
      a: "<p>Нет, Банк реализует только золотые слитки.</p>",
    },
    {
      q: "Когда необходимо оставить заявку?",
      a: "<p>Заявку рекомендуется оформить не позднее чем за один рабочий день до планируемой даты покупки. Операции покупки и продажи осуществляются только в рабочие дни.</p>",
    },
    {
      q: "По какому курсу осуществляется покупка и продажа слитков?",
      a: "<p>Операции проводятся по курсу, действующему на момент совершения сделки.</p>",
    },
    {
      q: "Допускается ли передача слитка третьим лицам?",
      a: "<p>Да, клиент вправе распоряжаться приобретённым слитком по своему усмотрению.</p>",
    },
    {
      q: "Можно ли вскрывать упаковку или повреждать слиток?",
      a: "<p>В случае, если клиент планирует в дальнейшем продать слиток Банку, вскрытие упаковки или повреждение слитка не допускается. При нарушении целостности упаковки цена обратного выкупа может быть существенно снижена.</p><p>Если клиент не планирует осуществлять обратную продажу Банку, он вправе распоряжаться слитком по своему усмотрению.</p>",
    },
    {
      q: "Можно ли приобрести слитки за иностранную валюту?",
      a: "<p>Нет. Оплата производится только в теңге. При необходимости иностранную валюту можно обменять в Банке.</p>",
    },
    {
      q: "Какие есть альтернативы приобретению золотых слитков?",
      a: '<p>В качестве альтернативы Банк предлагает металлические счета. <a href="https://halykbank.kz/other/metallicheskie-scheta">Подробнее</a>.</p>',
    },
    {
      q: "Какими способами можно оплатить покупку слитка?",
      a: "<p>Оплата осуществляется наличными денежными средствами. При оплате с использованием карты или текущего/депозитного счёта кассир проводит две операции: снятие средств и последующую покупку слитка. В связи с этим возможно взимание комиссии за обналичивание согласно тарифам Банка. Оплата картами других банков не предусмотрена. Кредитование и рассрочка не предоставляются.</p>",
    },
    {
      q: "Осуществляет ли Банк хранение приобретённых слитков?",
      a: '<p>Нет. Клиент обязан самостоятельно забрать слитки после покупки. Но можно арендовать и хранить в сейфовой ячейке. <a href="https://halykbank.kz/other/sejfovye-yachejki">Подробнее</a>.</p>',
    },
    {
      q: "Какие документы необходимы для покупки или продажи слитков?",
      a: "<p>Документ, удостоверяющий личность. Дополнительный документ для иностранных граждан — индивидуальный идентификационный номер (ИИН).</p>",
    },
    {
      q: "Можно ли вывезти золотые слитки за пределы Республики Казахстан?",
      a: "<p>Нет. На текущий момент вывоз слитков запрещён в соответствии с действующим Указом Президента Республики Казахстан.</p>",
    },
    {
      q: "Подлежат ли налогообложению слитки?",
      a: "<p>Согласно Налогового Кодекса РК доход полученный от прироста стоимости при реализации инвестиционного золота подлежит налогообложению клиентом самостоятельно. Для детальной информации по декларированию и уплате налогов необходимо обратиться в Комитет Государственных доходов.</p>",
    },
    {
      q: "Где посмотреть детальную информацию по характеристикам слитков предыдущего дизайна?",
      a: '<p>Буклеты предыдущего дизайна размещены по <a href="https://halykbank.kz/documents">ссылке</a> в разделе Другие услуги.</p>',
    },
  ];

  const fmt = (n) =>
    n.toLocaleString("ru-RU", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const fmtInt = (n) => Math.round(n).toLocaleString("ru-RU");

  /* ---------------------------------------------------------
   * HEADER: search toggle, language switcher, mobile menu
   * --------------------------------------------------------- */
  function initHeader() {
    const searchToggle = document.getElementById("searchToggle");
    const searchPanel = document.getElementById("searchPanel");
    searchToggle.addEventListener("click", () => {
      const isHidden = searchPanel.hidden;
      searchPanel.hidden = !isHidden;
      searchToggle.setAttribute("aria-expanded", String(isHidden));
    });

    const langBtn = document.getElementById("langBtn");
    const langList = document.getElementById("langList");
    langBtn.addEventListener("click", () => {
      const isHidden = langList.hidden;
      langList.hidden = !isHidden;
      langBtn.setAttribute("aria-expanded", String(isHidden));
    });

    const mobileToggle = document.getElementById("mobileMenuToggle");
    const mobileMenu = document.getElementById("mobileMenu");
    mobileToggle.addEventListener("click", () => {
      const isHidden = mobileMenu.hidden;
      mobileMenu.hidden = !isHidden;
      mobileToggle.setAttribute("aria-expanded", String(isHidden));
      document.body.style.overflow = isHidden ? "hidden" : "";
    });

    document.addEventListener("click", (e) => {
      if (!langBtn.parentElement.contains(e.target)) {
        langList.hidden = true;
        langBtn.setAttribute("aria-expanded", "false");
      }
      if (!searchToggle.contains(e.target) && !searchPanel.contains(e.target)) {
        searchPanel.hidden = true;
        searchToggle.setAttribute("aria-expanded", "false");
      }
    });

    document.getElementById("heroScrollBtn").addEventListener("click", () => {
      const next = document.querySelector(".buy-sell");
      if (next) next.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  /* ---------------------------------------------------------
   * BUY / SELL TABS
   * --------------------------------------------------------- */
  function initTabs() {
    const buyBtn = document.getElementById("tabBtnBuy");
    const sellBtn = document.getElementById("tabBtnSell");
    const buyPanel = document.getElementById("tabPanelBuy");
    const sellPanel = document.getElementById("tabPanelSell");

    function activate(which) {
      const buyActive = which === "buy";
      buyBtn.classList.toggle("is-active", buyActive);
      sellBtn.classList.toggle("is-active", !buyActive);
      buyBtn.setAttribute("aria-selected", String(buyActive));
      sellBtn.setAttribute("aria-selected", String(!buyActive));
      buyBtn.tabIndex = buyActive ? 0 : -1;
      sellBtn.tabIndex = buyActive ? -1 : 0;
      buyPanel.hidden = !buyActive;
      sellPanel.hidden = buyActive;
    }

    buyBtn.addEventListener("click", () => activate("buy"));
    sellBtn.addEventListener("click", () => activate("sell"));

    [buyBtn, sellBtn].forEach((btn, i, arr) => {
      btn.addEventListener("keydown", (e) => {
        if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
          arr[(i + 1) % arr.length].focus();
          arr[(i + 1) % arr.length].click();
        }
      });
    });
  }

  /* ---------------------------------------------------------
   * GOLD BARS — render from config + carousel controls
   * --------------------------------------------------------- */
  function renderGoldBars() {
    const track = document.getElementById("goldBarsTrack");
    track.innerHTML = GOLD_BARS.map((bar) => `
      <article class="gold-bar-card" role="listitem">
        <div class="gold-bar-card__media">
          <img src="${bar.img}" alt="Мерный слиток аффинированного золота весом ${bar.weight} грамм" loading="lazy">
        </div>
        <div>
          <h3 class="gold-bar-card__title">Мерный слиток аффинированного золота весом ${bar.weight} грамм</h3>
          <div class="gold-bar-card__specs">
            <div>Масса<strong>${bar.weight} гр.</strong></div>
            <div>Ширина<strong>${bar.width}</strong></div>
            <div>Длина<strong>${bar.length}</strong></div>
            <div>Металл<strong>${bar.metal}</strong></div>
            <div>Проба<strong>${bar.purity}</strong></div>
          </div>
        </div>
        <div class="gold-bar-card__cta">
          <a href="${bar.pdf}" class="btn btn--white" target="_blank" rel="noopener">Подробнее</a>
        </div>
      </article>
    `).join("");
  }

  function initCarousel() {
    const viewport = document.getElementById("carouselViewport");
    const prev = document.getElementById("carouselPrev");
    const next = document.getElementById("carouselNext");

    function scrollByCard(dir) {
      const card = viewport.querySelector(".gold-bar-card");
      if (!card) return;
      const gap = 24;
      const amount = card.getBoundingClientRect().width + gap;
      viewport.scrollBy({ left: dir * amount, behavior: "smooth" });
    }

    function updateArrows() {
      const max = viewport.scrollWidth - viewport.clientWidth - 4;
      prev.disabled = viewport.scrollLeft <= 0;
      next.disabled = viewport.scrollLeft >= max;
    }

    prev.addEventListener("click", () => scrollByCard(-1));
    next.addEventListener("click", () => scrollByCard(1));
    viewport.addEventListener("scroll", updateArrows);
    window.addEventListener("resize", updateArrows);
    updateArrows();
  }

  /* ---------------------------------------------------------
   * CUSTOM SELECT (accessible listbox-style dropdown)
   * Builds a select for the branch list, calling onChange(code).
   * --------------------------------------------------------- */
  function buildBranchSelect(btnEl, listEl, initialCode, onChange) {
    let current = initialCode;

    function render() {
      const branch = BRANCHES.find((b) => b.code === current);
      btnEl.textContent = branch ? branch.name : "Выберите филиал";
      listEl.innerHTML = BRANCHES.map((b) => `
        <li role="option" aria-selected="${b.code === current}">
          <button type="button" data-code="${b.code}">${b.name}</button>
        </li>
      `).join("");
    }

    render();

    btnEl.addEventListener("click", () => {
      const isHidden = listEl.hidden;
      listEl.hidden = !isHidden;
      btnEl.setAttribute("aria-expanded", String(isHidden));
    });

    listEl.addEventListener("click", (e) => {
      const btn = e.target.closest("button[data-code]");
      if (!btn) return;
      current = btn.dataset.code;
      render();
      listEl.hidden = true;
      btnEl.setAttribute("aria-expanded", "false");
      onChange(current);
    });

    document.addEventListener("click", (e) => {
      if (!btnEl.parentElement.contains(e.target)) {
        listEl.hidden = true;
        btnEl.setAttribute("aria-expanded", "false");
      }
    });

    return { get: () => current, set: (code) => { current = code; render(); } };
  }

  /* ---------------------------------------------------------
   * GOLD RATE TABLE
   * --------------------------------------------------------- */
  function initGoldRateTable() {
    document.getElementById("rateDate").textContent = GOLD_RATE.updated;

    const table = document.getElementById("rateTable");
    const rows = [
      { label: ["до", "100"], sell: GOLD_RATE.sell_rate_1 },
      { label: ["до", "1000"], sell: GOLD_RATE.sell_rate_2 },
      { label: ["от", "1000"], sell: GOLD_RATE.sell_rate_3 },
    ];
    rows.forEach((r) => {
      const row = document.createElement("div");
      row.className = "rate-table__row";
      row.innerHTML = `
        <div>${r.label[0]} ${r.label[1]}</div>
        <div>${fmt(r.sell)}</div>
        <div>${fmt(GOLD_RATE.buy_rate)}</div>
        <div>${fmt(GOLD_RATE.buy_rate_damage)}</div>
      `;
      table.appendChild(row);
    });

    buildBranchSelect(
      document.getElementById("branchSelectBtn"),
      document.getElementById("branchSelectList"),
      "AKM",
      () => {} // rates identical across branches on the source site
    );
  }

  /* ---------------------------------------------------------
   * ORDER FORM — dynamic line items + live calculation
   * --------------------------------------------------------- */
  function initOrderForm() {
    const MAX_LINES = 5;
    const lineItemsWrap = document.getElementById("lineItems");
    const addBtn = document.getElementById("addLineItem");
    const removeBtn = document.getElementById("removeLineItem");
    const submitBtn = document.getElementById("submitBtn");
    const form = document.getElementById("goldOrderForm");
    const successMsg = document.getElementById("formSuccess");

    let lineCount = 1;
    const lines = []; // { weight, amount }

    // build branch select for the form
    buildBranchSelect(
      document.getElementById("branchFormSelectBtn"),
      document.getElementById("branchFormSelectList"),
      "AST",
      () => {}
    );

    function weightSelectHTML(idx) {
      return `
        <li role="option" aria-selected="true"><button type="button" data-weight="">Выберите вес слитка</button></li>
        ${[5, 10, 20, 50, 100].map((w) => `<li role="option"><button type="button" data-weight="${w}">${w}</button></li>`).join("")}
      `;
    }

    function addLine() {
      if (lineCount > MAX_LINES) return;
      const idx = lineCount;
      lines[idx] = { weight: null, amount: 0 };

      const row = document.createElement("div");
      row.className = "line-item";
      row.dataset.idx = String(idx);
      row.innerHTML = `
        <div class="select" data-role="weight-select">
          <button type="button" class="select__btn" aria-haspopup="listbox" aria-expanded="false">Выберите вес слитка</button>
          <ul class="select__list" role="listbox" hidden>${weightSelectHTML(idx)}</ul>
        </div>
        <div class="form-field">
          <label class="sr-only" for="amount-${idx}">Количество</label>
          <input type="text" inputmode="numeric" id="amount-${idx}" placeholder="Укажите количество" data-role="amount-input">
        </div>
      `;
      lineItemsWrap.appendChild(row);

      const wSelBtn = row.querySelector(".select__btn");
      const wSelList = row.querySelector(".select__list");
      wSelBtn.addEventListener("click", () => {
        const isHidden = wSelList.hidden;
        wSelList.hidden = !isHidden;
        wSelBtn.setAttribute("aria-expanded", String(isHidden));
      });
      wSelList.addEventListener("click", (e) => {
        const btn = e.target.closest("button[data-weight]");
        if (!btn) return;
        const val = btn.dataset.weight;
        wSelBtn.textContent = val ? val : "Выберите вес слитка";
        lines[idx].weight = val ? Number(val) : null;
        wSelList.hidden = true;
        wSelBtn.setAttribute("aria-expanded", "false");
        recalc();
      });
      document.addEventListener("click", (e) => {
        if (!wSelBtn.parentElement.contains(e.target)) {
          wSelList.hidden = true;
          wSelBtn.setAttribute("aria-expanded", "false");
        }
      });

      const amountInput = row.querySelector('[data-role="amount-input"]');
      amountInput.addEventListener("input", () => {
        const digits = amountInput.value.replace(/\D/g, "").slice(0, 5);
        amountInput.value = digits;
        lines[idx].amount = digits ? Number(digits) : 0;
        recalc();
      });

      lineCount++;
      addBtn.hidden = lineCount > MAX_LINES;
      removeBtn.hidden = lineCount <= 2;
    }

    function removeLine() {
      if (lineCount <= 1) return;
      lineCount--;
      lines[lineCount] = undefined;
      const row = lineItemsWrap.querySelector(`[data-idx="${lineCount}"]`);
      if (row) row.remove();
      addBtn.hidden = lineCount > MAX_LINES;
      removeBtn.hidden = lineCount <= 1;
      recalc();
    }

    addBtn.addEventListener("click", addLine);
    removeBtn.addEventListener("click", removeLine);

    // first line (index 0) lives inline before the "Добавить" row
    const firstRow = document.createElement("div");
    firstRow.className = "line-item";
    firstRow.dataset.idx = "0";
    firstRow.innerHTML = `
      <div class="select" data-role="weight-select">
        <button type="button" class="select__btn" aria-haspopup="listbox" aria-expanded="false">Выберите вес слитка</button>
        <ul class="select__list" role="listbox" hidden>${weightSelectHTML(0)}</ul>
      </div>
      <div class="form-field">
        <label class="sr-only" for="amount-0">Количество</label>
        <input type="text" inputmode="numeric" id="amount-0" placeholder="Укажите количество" data-role="amount-input">
      </div>
    `;
    lineItemsWrap.appendChild(firstRow);
    lines[0] = { weight: null, amount: 0 };
    removeBtn.hidden = true;

    (function wireFirstRow() {
      const wSelBtn = firstRow.querySelector(".select__btn");
      const wSelList = firstRow.querySelector(".select__list");
      wSelBtn.addEventListener("click", () => {
        const isHidden = wSelList.hidden;
        wSelList.hidden = !isHidden;
        wSelBtn.setAttribute("aria-expanded", String(isHidden));
      });
      wSelList.addEventListener("click", (e) => {
        const btn = e.target.closest("button[data-weight]");
        if (!btn) return;
        const val = btn.dataset.weight;
        wSelBtn.textContent = val ? val : "Выберите вес слитка";
        lines[0].weight = val ? Number(val) : null;
        wSelList.hidden = true;
        wSelBtn.setAttribute("aria-expanded", "false");
        recalc();
      });
      document.addEventListener("click", (e) => {
        if (!wSelBtn.parentElement.contains(e.target)) {
          wSelList.hidden = true;
          wSelBtn.setAttribute("aria-expanded", "false");
        }
      });
      const amountInput = firstRow.querySelector('[data-role="amount-input"]');
      amountInput.addEventListener("input", () => {
        const digits = amountInput.value.replace(/\D/g, "").slice(0, 5);
        amountInput.value = digits;
        lines[0].amount = digits ? Number(digits) : 0;
        recalc();
      });
    })();

    function currentType() {
      const checked = form.querySelector('input[name="type"]:checked');
      return checked ? checked.value : "buy";
    }

    form.querySelectorAll('input[name="type"]').forEach((r) =>
      r.addEventListener("change", recalc)
    );

    function recalc() {
      const type = currentType(); // buy = "Покупка у банка" -> uses sell_rate; sell = "Продажа банку" -> uses buy_rate
      const rate = type === "buy" ? weightedSellRate() : GOLD_RATE.buy_rate;

      let totalWeight = 0;
      let totalCount = 0;
      lines.forEach((l) => {
        if (l && l.weight && l.amount) {
          totalWeight += l.weight * l.amount;
          totalCount += l.amount;
        }
      });

      const totalSum = totalWeight * rate;

      document.getElementById("sumWeight").textContent = fmtInt(totalWeight);
      document.getElementById("sumCount").textContent = fmtInt(totalCount);
      document.getElementById("sumTotal").textContent = fmtInt(totalSum);
      document.getElementById("perGramLabel").textContent =
        type === "buy" ? "покупке у банка" : "продаже банку";
      document.getElementById("perGramValue").textContent = fmt(rate);

      submitBtn.disabled = !(totalWeight > 0 && form.firstName.value.trim() && form.lastName.value.trim() && isValidPhone(form.phone.value) && document.getElementById("agree").checked);
    }

    function weightedSellRate() {
      // Mirrors the source site's graduated pricing by total grams.
      let totalWeight = 0;
      lines.forEach((l) => { if (l && l.weight && l.amount) totalWeight += l.weight * l.amount; });
      if (totalWeight >= 1000) return GOLD_RATE.sell_rate_3;
      if (totalWeight >= 100) return GOLD_RATE.sell_rate_2;
      return GOLD_RATE.sell_rate_1;
    }

    function isValidPhone(v) {
      return /^\+7\(\d{3}\)\d{3}-\d{2}-\d{2}$/.test(v);
    }

    // phone mask: +7(XXX)XXX-XX-XX
    const phoneInput = document.getElementById("phone");
    phoneInput.addEventListener("input", () => {
      let digits = phoneInput.value.replace(/\D/g, "");
      if (digits.startsWith("7")) digits = digits.slice(1);
      if (digits.startsWith("8")) digits = digits.slice(1);
      digits = digits.slice(0, 10);
      let out = "+7";
      if (digits.length > 0) out += "(" + digits.slice(0, 3);
      if (digits.length >= 3) out += ")" + digits.slice(3, 6);
      if (digits.length >= 6) out += "-" + digits.slice(6, 8);
      if (digits.length >= 8) out += "-" + digits.slice(8, 10);
      phoneInput.value = out;
      recalc();
    });
    phoneInput.addEventListener("focus", () => {
      if (!phoneInput.value) phoneInput.value = "+7(";
    });

    [form.firstName, form.lastName].forEach((el) => el && el.addEventListener("input", recalc));
    document.getElementById("agree").addEventListener("change", recalc);

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (submitBtn.disabled) return;
      form.hidden = true;
      successMsg.hidden = false;
      successMsg.scrollIntoView({ behavior: "smooth", block: "center" });
    });

    recalc();
  }

  /* ---------------------------------------------------------
   * FAQ ACCORDION — render from config
   * --------------------------------------------------------- */
  function renderFAQ() {
    const list = document.getElementById("faqList");
    list.innerHTML = FAQ_ITEMS.map((item, i) => `
      <div class="faq-item" data-idx="${i}">
        <h3>
          <button type="button" class="faq-item__q" id="faqQ${i}" aria-expanded="false" aria-controls="faqA${i}">
            <span>${item.q}</span>
            <span class="faq-item__icon" aria-hidden="true">
              <svg class="icon-plus" width="32" height="32" viewBox="0 0 32 32" fill="none"><path d="M24 16H8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M16 24V8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
              <svg class="icon-minus" width="32" height="32" viewBox="0 0 32 32" fill="none"><path d="M24 16H8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
            </span>
          </button>
        </h3>
        <div class="faq-item__a" id="faqA${i}" role="region" aria-labelledby="faqQ${i}">
          ${item.a}
        </div>
      </div>
    `).join("");

    list.addEventListener("click", (e) => {
      const btn = e.target.closest(".faq-item__q");
      if (!btn) return;
      const item = btn.closest(".faq-item");
      const answer = item.querySelector(".faq-item__a");
      const isOpen = item.classList.contains("is-open");

      list.querySelectorAll(".faq-item.is-open").forEach((openItem) => {
        if (openItem !== item) {
          openItem.classList.remove("is-open");
          openItem.querySelector(".faq-item__q").setAttribute("aria-expanded", "false");
          openItem.querySelector(".faq-item__a").style.maxHeight = null;
        }
      });

      if (isOpen) {
        item.classList.remove("is-open");
        btn.setAttribute("aria-expanded", "false");
        answer.style.maxHeight = null;
      } else {
        item.classList.add("is-open");
        btn.setAttribute("aria-expanded", "true");
        answer.style.maxHeight = answer.scrollHeight + 40 + "px";
      }
    });

    list.addEventListener("keydown", (e) => {
      if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
      const buttons = Array.from(list.querySelectorAll(".faq-item__q"));
      const i = buttons.indexOf(document.activeElement);
      if (i === -1) return;
      e.preventDefault();
      const nextIdx = e.key === "ArrowDown" ? Math.min(i + 1, buttons.length - 1) : Math.max(i - 1, 0);
      buttons[nextIdx].focus();
    });
  }

  /* ---------------------------------------------------------
   * INIT
   * --------------------------------------------------------- */
  document.addEventListener("DOMContentLoaded", () => {
    initHeader();
    initTabs();
    renderGoldBars();
    initCarousel();
    initGoldRateTable();
    initOrderForm();
    renderFAQ();
  });
})();
