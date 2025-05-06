// Всплывающая плашка о согласии на использование кук
(function() {
  if (localStorage.getItem('cookieConsentAccepted')) return;
  
  var bar = document.createElement('div');
  bar.className = 'cookie-consent-bar';
  bar.innerHTML = '<span>Мы используем cookies для улучшения работы сайта. Продолжая пользоваться сайтом, вы соглашаетесь с <a href="politika-v-otnoshenii-obrabotki-personalnyh-dannyh.pdf" target="_blank">Политикой обработки данных</a>.</span><button class="cookie-consent-btn">Ок</button>';
  document.body.appendChild(bar);
  
  bar.querySelector('.cookie-consent-btn').onclick = function() {
    localStorage.setItem('cookieConsentAccepted', '1');
    bar.classList.add('cookie-consent-hide');
    setTimeout(function() { bar.remove(); }, 400);
  };
})();
