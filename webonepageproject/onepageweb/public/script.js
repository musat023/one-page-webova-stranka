function smartFetch(path) {
  return fetch(`../${path}`).catch(() => fetch(`/${path}`));
}

function showError(tag, err) {
  console.error(tag, err);
  // Kullanıcıya da görünen bir hata mesajı eklenebilir
  const errorDiv = document.createElement('div');
  errorDiv.style.cssText = 'color: #f00; margin-top: 20px; text-align: center;';
  errorDiv.innerText = `Veri yüklenirken hata oluştu (${tag}). Lütfen konsolu kontrol edin.`;
  // Hatanın ait olduğu bölüme eklemeye çalışalım
  if (tag.includes('ABOUT')) document.getElementById('about').appendChild(errorDiv);
  if (tag.includes('MENU')) document.getElementById('menu').appendChild(errorDiv);
  if (tag.includes('GALLERY')) document.getElementById('gallery').appendChild(errorDiv);
  if (tag.includes('CONTACT')) document.getElementById('contact').appendChild(errorDiv);
}

// ABOUT
smartFetch('data/about.json')
  .then(res => res.json())
  .then(data => {
    document.getElementById('restaurant-name').innerText = data.name || 'Restaurace';
    document.getElementById('restaurant-slogan').innerText = data.slogan || '';
    document.getElementById('restaurant-desc').innerText = data.description || '';
  })
  .catch(err => showError('ABOUT JSON ERROR:', err));

// MENU + FILTER (AKTİF BUTON VE TÜMÜ İŞLEVSELLİĞİ EKLENDİ)
smartFetch('data/menu.json')
  .then(res => res.json())
  .then(data => {
    const container = document.getElementById('menu-list');
    const filterContainer = document.getElementById('filter-buttons');
    const allCategories = [...new Set(data.menu.map(item => item.category))];

    // renderMenu fonksiyonu artık aktif butonu da yönetiyor
    function renderMenu(menu, activeBtn = null) {
      // Önceki aktif butonu temizle
      document.querySelectorAll('#filter-buttons button').forEach(button => {
        button.classList.remove('active-filter');
      });

      // Yeni aktif butona sınıfı ekle (style.css'te tanımlanmalıdır)
      if (activeBtn) {
          activeBtn.classList.add('active-filter');
      }

      container.innerHTML = '';
      menu.forEach(item => {
        const el = document.createElement('div');
        el.className = 'menu-item';

        el.innerHTML = `
          <img src="${item.img}" alt="${item.alt || item.name}" class="menu-img">
          <h3>${item.name}</h3>
          <p>${item.description}</p>
          <strong>${item.price} Kč</strong>
        `;
        
        container.appendChild(el);
      });
    }

    // "Tümü" butonunu oluştur (Varsayılan aktif)
    const allBtn = document.createElement('button');
    allBtn.innerText = 'Tümü';
    allBtn.onclick = () => renderMenu(data.menu, allBtn);
    filterContainer.appendChild(allBtn);

    // Kategori butonlarını oluştur
    allCategories.forEach(cat => {
      const btn = document.createElement('button');
      btn.innerText = cat;
      btn.onclick = () => renderMenu(data.menu.filter(item => item.category === cat), btn);
      filterContainer.appendChild(btn);
    });

    // Başlangıçta tüm menüyü göster ve "Tümü" butonunu aktif et
    renderMenu(data.menu, allBtn);
  })
  .catch(err => showError('MENU JSON ERROR:', err));


// GALLERY (LIGHTBOX/BÜYÜTME İŞLEVİ EKLENDİ)
smartFetch('data/gallery.json')
  .then(res => res.json())
  .then(data => {
    const gallery = document.getElementById('gallery-container');

    // Lightbox oluşturan yardımcı fonksiyon
    function createLightbox(imgSrc, imgAlt) {
        const lightbox = document.createElement('div');
        lightbox.id = 'lightbox';
        lightbox.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
            background: rgba(0, 0, 0, 0.9); display: flex; justify-content: center; 
            align-items: center; z-index: 2000; cursor: pointer;
        `;
        
        const img = document.createElement('img');
        img.src = imgSrc;
        img.alt = imgAlt;
        // Büyütülen görsel için stil
        img.style.cssText = `
            max-width: 90%; max-height: 90%; object-fit: contain; 
            box-shadow: 0 0 25px rgba(255, 230, 150, 0.8); border-radius: 10px;
        `;

        lightbox.appendChild(img);
        document.body.appendChild(lightbox);

        // Tıklayınca lightbox'ı kapatma
        lightbox.onclick = () => lightbox.remove();
    }

    data.images.forEach(img => {
      const imgEl = document.createElement('img');
      imgEl.src = `../${img.src}`;
      imgEl.alt = img.alt || '';
      // Görsele tıklandığında lightbox'ı aç
      imgEl.onclick = () => createLightbox(imgEl.src, imgEl.alt); 
      gallery.appendChild(imgEl);
    });
  })
  .catch(err => showError('GALLERY JSON ERROR:', err));

// CONTACT
smartFetch('data/contact.json')
  .then(res => res.json())
  .then(data => {
    document.getElementById('address').innerText = data.address || '';
    document.getElementById('phone').innerText = data.phone || '';
    document.getElementById('email').innerText = data.email || '';
    const list = document.getElementById('open-hours');
    list.innerHTML = '';
    for (let day in data.opening_hours) {
      const li = document.createElement('li');
      li.innerHTML = `<strong>${day}:</strong> ${data.opening_hours[day]}`;
      list.appendChild(li);
    }
  })
  .catch(err => showError('CONTACT JSON ERROR:', err));

// **********************************************
// HEADER SHRINK EFFECT (Başlık Küçültme) EKLENDİ
// **********************************************
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    // Sayfa kaydırma 50 pikseli geçtiğinde "scrolled" sınıfını ekle
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});