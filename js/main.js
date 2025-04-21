// Загрузка данных и рендеринг карточек и секций
fetch('data/activities.json')
  .then(res => res.json())
  .then(data => {
    renderFestivalDesc(data.festivalDesc);
    renderCards(data.activities);
    renderSections(data.sections);
    renderPartners(data.partners);
    // Карта
    renderYandexMap();
  });

function renderFestivalDesc(desc) {
  document.querySelector('.festival-desc').innerHTML = `<p>${desc}</p>`;
}

function renderCards(activities) {
  const grid = document.getElementById('cards-grid');
  grid.innerHTML = activities.map(card => {
    const images = card.images || [];
    let mainImg = '';
    let otherImgs = [];
    if (images.length > 0) {
      const idx = Math.floor(Math.random() * images.length);
      mainImg = images[idx];
      otherImgs = images.filter((img, i) => i !== idx);
    }
    return `
      <div class="swiper-slide">
        <div class="card">
          ${mainImg ? `<img class="card-img" src="${mainImg}" alt="${card.title}">` : ''}
          <div class="card-category">${card.category}</div>
          <div class="card-title">${card.title}</div>
          <div class="card-desc">${card.desc}</div>

        </div>
      </div>
    `;
  }).join('');
  // Инициализация Swiper после рендера
  if (window.cardsSwiper) window.cardsSwiper.destroy(true, true);
  window.cardsSwiper = new Swiper('.cards-swiper', {
    direction: 'horizontal',
    slidesPerView: 'auto',
    centeredSlides: false,
    spaceBetween: 16,
    mousewheel: false,
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    // адаптивность и другие опции можно добавить по желанию
  });
}

function renderSections(sections) {
  const container = document.getElementById('sections');
  container.innerHTML = sections.map(sec => `
    <section class="activity-section">
      <h3>${sec.title}</h3>
      <div class="section-desc">${sec.desc}</div>
      <div class="section-images">
        ${(sec.images||[]).map(img => `<img src="${img}" alt="${sec.title}" style="max-width:120px;margin:0.3em;">`).join('')}
      </div>
      ${sec.time ? `<div class="section-time">Время: ${sec.time}</div>` : ''}
      ${sec.reg ? `<a href="${sec.reg}" class="section-reg">Регистрация</a>` : ''}
    </section>
  `).join('');
}

function renderPartners(partners) {
  const container = document.getElementById('partners-logos');
  container.innerHTML = partners.map(p => `
    <a href="${p.link||'#'}" target="_blank" title="${p.name}">
      <img src="${p.logo}" alt="${p.name}" style="height:48px;margin:0.7em;">
      ${p.caption ? `<div class="partner-caption">${p.caption}</div>` : ''}
    </a>
  `).join('');
}

function renderYandexMap() {
  const script = document.createElement('script');
  script.src = 'https://api-maps.yandex.ru/2.1/?lang=ru_RU';
  script.onload = () => {
    ymaps.ready(() => {
      const map = new ymaps.Map('yandex-map', {
        center: [55.714422, 37.560588],
        zoom: 16
      });
      map.geoObjects.add(new ymaps.Placemark([55.714422, 37.560588], {
        balloonContent: 'Олимпийский комплекс «Лужники», Южное спортивное ядро'
      }));
    });
  };
  document.body.appendChild(script);
}
