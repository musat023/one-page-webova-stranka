function smartFetch(path) {
  // LangSuffix ile gelen yolu kullanır
  return fetch(`../${path}`).catch(() => fetch(`/${path}`));
}

function showError(tag, err) {
  console.error(tag, err);
  // Kullanıcıya da görünen bir hata mesajı eklenebilir
  const errorDiv = document.createElement('div');
  errorDiv.className = 'section-error';
  errorDiv.innerText = `Veri yüklenirken hata oluştu (${tag}). Lütfen ${tag} dosyasının çevirisini (örneğin data/menu_tr.json) kontrol edin.`;
  // Hatanın ait olduğu bölüme eklemeye çalışalım
  if (tag.includes('ABOUT')) document.getElementById('about').appendChild(errorDiv);
  if (tag.includes('MENU')) document.getElementById('menu').appendChild(errorDiv);
  if (tag.includes('GALLERY')) document.getElementById('gallery').appendChild(errorDiv);
  if (tag.includes('CONTACT')) document.getElementById('contact').appendChild(errorDiv);
}

// YENİ: Statik metin çevirileri (JSON'dan gelmeyen başlıklar vb.)
const translations = {
    // Navigasyon Linkleri
    'nav-about': { 'cs': 'O restauraci', 'tr': 'Hakkımızda', 'en': 'About Us' },
    'nav-menu': { 'cs': 'Menu', 'tr': 'Menü', 'en': 'Menu' },
    'nav-gallery': { 'cs': 'Galerie', 'tr': 'Galeri', 'en': 'Gallery' },
    'nav-contact': { 'cs': 'Kontakt', 'tr': 'İletişim', 'en': 'Contact' },
    // Bölüm Başlıkları
    'heading-about': { 'cs': 'O restauraci', 'tr': 'Hakkımızda', 'en': 'About Us' },
    'heading-menu': { 'cs': 'Menu', 'tr': 'Menü', 'en': 'Menu' },
    'heading-gallery': { 'cs': 'Galerie', 'tr': 'Galeri', 'en': 'Gallery' },
    'heading-contact': { 'cs': 'Kontakt', 'tr': 'İletişim', 'en': 'Contact' },
    // İletişim Etiketleri
    'contact-address': { 'cs': 'Adresa:', 'tr': 'Adres:', 'en': 'Address:' },
    'contact-phone': { 'cs': 'Telefon:', 'tr': 'Telefon:', 'en': 'Phone:' },
    'contact-email': { 'cs': 'Email:', 'tr': 'E-posta:', 'en': 'Email:' },
    'contact-hours': { 'cs': 'Otevírací doba', 'tr': 'Çalışma Saatleri', 'en': 'Opening Hours' },
};

// YENİ: Statik metinleri çeviren fonksiyon
function updateStaticText(lang) {
    document.documentElement.lang = lang; // HTML dil etiketini güncelle

    // data-key özniteliği olan tüm elementleri bul
    document.querySelectorAll('[data-key]').forEach(element => {
        const key = element.getAttribute('data-key');
        if (translations[key] && translations[key][lang]) {
            element.innerText = translations[key][lang];
        }
    });
}

// YENİ: JSON dosyasındaki gün isimlerini çeviren fonksiyon
const dayTranslations = {
    'cs': {
        'pondělí': 'Pondělí', 'úterý': 'Úterý', 'středa': 'Středa', 
        'čtvrtek': 'Čtvrtek', 'pátek': 'Pátek', 'sobota': 'Sobota', 'neděle': 'Neděle'
    },
    'tr': {
        'pondělí': 'Pazartesi', 'úterý': 'Salı', 'středa': 'Çarşamba', 
        'čtvrtek': 'Perşembe', 'pátek': 'Cuma', 'sobota': 'Cumartesi', 'neděle': 'Pazar'
    },
    'en': {
        'pondělí': 'Monday', 'úterý': 'Tuesday', 'středa': 'Wednesday', 
        'čtvrtek': 'Thursday', 'pátek': 'Friday', 'sobota': 'Saturday', 'neděle': 'Sunday'
    }
};

// YENİ: Tüm içeriği yükleyen ana fonksiyon
function loadContent(lang) {
    // Önceki hata mesajlarını temizle
    document.querySelectorAll('.section-error').forEach(e => e.remove());
    
    // Aktif dil butonunu işaretle
    document.querySelectorAll('#language-switcher button').forEach(button => {
        button.classList.remove('active-lang');
    });
    document.getElementById(`lang-${lang}`).classList.add('active-lang');

    // Statik metinleri çevir
    updateStaticText(lang);

    // Dil uzantısını belirle (Çekçe için boş, diğerleri için _tr veya _en)
    const langSuffix = lang === 'cs' ? '' : `_${lang}`;

    // **********************************************
    // ABOUT
    // **********************************************
    smartFetch(`data/about${langSuffix}.json`)
        .then(res => res.json())
        .then(data => {
            document.getElementById('restaurant-name').innerText = data.name || 'Restaurace';
            document.getElementById('restaurant-slogan').innerText = data.slogan || '';
            document.getElementById('restaurant-desc').innerText = data.description || '';
        })
        .catch(err => showError(`ABOUT JSON ERROR (data/about${langSuffix}.json)`, err));

    // **********************************************
    // MENU + FILTER
    // **********************************************
    smartFetch(`data/menu${langSuffix}.json`)
        .then(res => res.json())
        .then(data => {
            const container = document.getElementById('menu-list');
            const filterContainer = document.getElementById('filter-buttons');
            const allCategories = [...new Set(data.menu.map(item => item.category))];

            function renderMenu(menu, activeBtn = null) {
                // Önceki aktif butonu temizle
                document.querySelectorAll('#filter-buttons button').forEach(button => {
                    button.classList.remove('active-filter');
                });

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

            // Filtre butonlarını temizle
            filterContainer.innerHTML = ''; 

            // "Tümü" butonunu oluştur (Dil çevirisine göre)
            const allBtn = document.createElement('button');
            allBtn.innerText = lang === 'en' ? 'All' : (lang === 'tr' ? 'Tümü' : 'Menu'); 
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
        .catch(err => showError(`MENU JSON ERROR (data/menu${langSuffix}.json)`, err));


    // **********************************************
    // GALLERY (Dil bağımsız)
    // **********************************************
    smartFetch('data/gallery.json')
        .then(res => res.json())
        .then(data => {
            const gallery = document.getElementById('gallery-container');
            gallery.innerHTML = ''; // Önceki görselleri temizle

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
                imgEl.onclick = () => createLightbox(imgEl.src, imgEl.alt); 
                gallery.appendChild(imgEl);
            });
        })
        .catch(err => showError('GALLERY JSON ERROR (data/gallery.json)', err));

    // **********************************************
    // CONTACT
    // **********************************************
    smartFetch(`data/contact${langSuffix}.json`)
        .then(res => res.json())
        .then(data => {
            document.getElementById('address').innerText = data.address || '';
            document.getElementById('phone').innerText = data.phone || '';
            document.getElementById('email').innerText = data.email || '';
            const list = document.getElementById('open-hours');
            list.innerHTML = '';
            
            // JSON'daki gün anahtarlarını alıp çeviri objesi ile eşleştir
            for (let dayKey in data.opening_hours) {
                const li = document.createElement('li');
                // Gün ismini güncel dile çevir
                const translatedDay = dayTranslations[lang][dayKey] || dayKey; 
                
                li.innerHTML = `<strong>${translatedDay}:</strong> ${data.opening_hours[dayKey]}`;
                list.appendChild(li);
            }
        })
        .catch(err => showError(`CONTACT JSON ERROR (data/contact${langSuffix}.json)`, err));
}

// YENİ: Butonların kullanacağı global fonksiyonu tanımla
window.changeLanguage = loadContent;


// **********************************************
// HEADER SHRINK EFFECT (Başlık Küçültme) 
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