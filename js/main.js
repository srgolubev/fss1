// Загрузка данных и рендеринг карточек и секций
fetch("data/activities.json")
  .then((res) => res.json())
  .then((data) => {
    renderFestivalDesc(data.festivalDesc);
    renderCards(data.activities);
    // Карта
    renderYandexMap();
  });

// Загрузка партнёров из отдельного файла
fetch("data/partners.json")
  .then((res) => res.json())
  .then((partners) => {
    renderPartners(partners);
  });

// Отдельная загрузка секций площадок
fetch("data/sections.json")
  .then((res) => res.json())
  .then((sections) => {
    renderSections(sections);
    renderSectionsMenu(sections);
  });

function renderFestivalDesc(desc) {
  document.querySelector(".festival-desc").innerHTML = `<p>${desc}</p>`;
}

function renderCards(activities) {
  const grid = document.getElementById("cards-grid");
  grid.innerHTML = activities
    .map((card) => {
      const images = card.images || [];
      let mainImg = "";
      let otherImgs = [];
      if (images.length > 0) {
        const idx = Math.floor(Math.random() * images.length);
        mainImg = images[idx];
        otherImgs = images.filter((img, i) => i !== idx);
      }
      return `
      <div class="swiper-slide">
        <div class="card">
          ${mainImg ? `<img class="card-img" src="${mainImg}" alt="${card.title}">` : ""}
          <div class="card-category">${card.category}</div>
          <div class="card-title">${card.title}</div>
          <div class="card-desc">${card.desc}</div>

        </div>
      </div>
    `;
    })
    .join("");
  // Инициализация Swiper после рендера
  if (window.cardsSwiper) window.cardsSwiper.destroy(true, true);
  window.cardsSwiper = new Swiper(".cards-swiper", {
    direction: "horizontal",
    slidesPerView: "auto",
    centeredSlides: false,
    spaceBetween: 16,
    mousewheel: false,
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    // адаптивность и другие опции можно добавить по желанию
  });
}

function renderSections(sections) {
  const container = document.getElementById("sections");
  // Группировка секций по категориям
  const grouped = {};
  sections.forEach((sec) => {
    const cat = sec.category || "Другое";
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(sec);
  });
  const categories = Object.keys(grouped);
  let html = "";
  categories.forEach((cat) => {
    html += `<div class="section-category-group">
      <h2 class="section-category-title">${cat}</h2>`;
    grouped[cat].forEach((sec) => {
      const id =
        "section-" +
        sec.title
          .toLowerCase()
          .replace(/[^a-zа-я0-9]+/gi, "-")
          .replace(/^-+|-+$/g, "");
      const desc = sec.content || sec.desc || "";
      const images = sec.images || [];
      const reg = sec.registration || sec.reg;
      const mainImg = images.length > 0 ? images[0] : null;
      html += `<section id="${id}" class="section-card">
        <h3 class="section-card-title">${sec.title}</h3>
        ${mainImg ? `<img class="section-card-img" src="${mainImg}" alt="${sec.title}">` : ""}
        ${desc ? `<div class="section-card-content">${desc.replace(/\n/g, "<br>")}</div>` : ""}
        ${reg ? `<a href="${reg}" class="section-card-btn" target="_blank">Регистрация</a>` : ""}
        ${sec.time ? `<div class="section-card-time">${sec.time}</div>` : ""}
      </section>`;
    });
    html += "</div>";
  });
  container.innerHTML = html;
}

function renderSectionsMenu(sections) {
  const menu = document.getElementById("sections-menu");
  // Группировка секций по категориям
  const grouped = {};
  sections.forEach((sec) => {
    const cat = sec.category || "Другое";
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(sec);
  });
  const categories = Object.keys(grouped);
  // Быстрый поиск id секции по title
  const sectionIdByTitle = {};
  sections.forEach((sec) => {
    const id =
      "section-" +
      sec.title
        .toLowerCase()
        .replace(/[^a-zа-я0-9]+/gi, "-")
        .replace(/^-+|-+$/g, "");
    sectionIdByTitle[sec.title.trim()] = id;
  });
  let html = `<ul class="sections-menu-list">`;
  html += `<li><a href="#activities" class="sections-menu-link">Активности</a></li>`;
  categories.forEach((cat) => {
    if (grouped[cat].length === 1) {
      // Одиночный пункт
      const sec = grouped[cat][0];
      const id = sectionIdByTitle[sec.title]
        ? `#${sectionIdByTitle[sec.title]}`
        : "#";
      html += `<li><a href="${id}" class="sections-menu-link">${sec.title}</a></li>`;
    } else {
      // Категория с выпадающим списком
      html +=
        `<li class="sections-menu-dropdown"><span class="dropdown-title">${cat}<span class="dropdown-arrow">▼</span></span><ul class="sections-menu-dropdown-list">` +
        grouped[cat]
          .map((sec) => {
            const id = sectionIdByTitle[sec.title]
              ? `#${sectionIdByTitle[sec.title]}`
              : "#";
            return `<li><a href="${id}" class="sections-menu-link">${sec.title}</a></li>`;
          })
          .join("") +
        `</ul></li>`;
    }
  });
  html += `</ul>`;
  menu.innerHTML = html;
  // Плавный скролл
  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", function (e) {
      const hash = this.getAttribute("href");
      const target = document.querySelector(hash);
      if (target && hash !== "#") {
        e.preventDefault();
        window.scrollTo({
          top: target.getBoundingClientRect().top + window.scrollY - 60,
          behavior: "smooth",
        });
      }
    });
  });
}

function renderPartners(partners) {
  const container = document.getElementById('partners-logos');
  container.innerHTML = `
    <div class="partners-logos-grid">
      ${partners.map(p => `
        <a href="${p.link||'#'}" target="_blank" title="${p.name}">
          <img src="${p.logo}" alt="${p.name}">
        </a>
      `).join('')}
    </div>
  `;
}

function renderYandexMap() {
  const script = document.createElement("script");
  script.src = "https://api-maps.yandex.ru/2.1/?lang=ru_RU";
  script.onload = () => {
    ymaps.ready(() => {
      const map = new ymaps.Map("yandex-map", {
        center: [55.714422, 37.560588],
        zoom: 16,
      });
      map.geoObjects.add(
        new ymaps.Placemark([55.714422, 37.560588], {
          balloonContent:
            "Олимпийский комплекс «Лужники», Южное спортивное ядро",
        }),
      );
    });
  };
  document.body.appendChild(script);
}
