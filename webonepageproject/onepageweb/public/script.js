// helper: dene fetch (relative) yoksa absolute root
function smartFetch(path) {
    // önce relative (script is in public/, data is sibling of public/)
    return fetch(`../${path}`).catch(() => {
      // fallback: absolute from server root (works if server serves project root)
      return fetch(`/${path}`);
    });
   }
   function showError(tag, err) {
    console.error(tag, err);
    // istersen sayfaya hata mesajı yazabilirsin
   }
   // ABOUT
   smartFetch('data/about.json')
    .then(res => {
      if (!res.ok) throw new Error('about.json not found: ' + res.status);
      return res.json();
    })
    .then(data => {
      if (!data) return;
      document.getElementById('restaurant-name').innerText = data.name || 'Restaurace';
      document.getElementById('restaurant-slogan').innerText = data.slogan || '';
      document.getElementById('restaurant-desc').innerText = data.description || '';
    })
    .catch(err => showError('ABOUT JSON ERROR:', err));
   // MENU
   smartFetch('data/menu.json')
    .then(res => {
      if (!res.ok) throw new Error('menu.json not found: ' + res.status);
      return res.json();
    })
    .then(data => {
      const container = document.getElementById('menu-list');
      if (!data || !Array.isArray(data.menu)) return;
      data.menu.forEach(item => {
        const el = document.createElement('div');
        el.className = 'menu-item';
        el.innerHTML = `<h3>${item.name}</h3><p>${item.description}</p><strong>${item.price} Kč</strong>`;
        container.appendChild(el);
      });
    })
    .catch(err => showError('MENU JSON ERROR:', err));
   // GALLERY
   smartFetch('data/gallery.json')
    .then(res => {
      if (!res.ok) throw new Error('gallery.json not found: ' + res.status);
      return res.json();
    })
    .then(data => {
      const gallery = document.getElementById('gallery-container');
      if (!data || !Array.isArray(data.images)) return;
      data.images.forEach(img => {
        // img.src in JSON should be "assets/img/whatever.jpg"
        const imgEl = document.createElement('img');
        // script.js is in public/, so to reach assets use ../assets/...
        // If the path in JSON already starts with "assets/..." we prefix "../"
        if (img.src.startsWith('assets/')) {
          imgEl.src = `../${img.src}`;
        } else if (img.src.startsWith('/')) {
          imgEl.src = img.src; // absolute
        } else {
          imgEl.src = `../assets/img/${img.src}`; // fallback
        }
        imgEl.alt = img.alt || '';
        gallery.appendChild(imgEl);
      });
    })
    .catch(err => showError('GALLERY JSON ERROR:', err));
   // CONTACT
   smartFetch('data/contact.json')
    .then(res => {
      if (!res.ok) throw new Error('contact.json not found: ' + res.status);
      return res.json();
    })
    .then(data => {
      if (!data) return;
      document.getElementById('address').innerText = data.address || '';
      document.getElementById('phone').innerText = data.phone || '';
      document.getElementById('email').innerText = data.email || '';
      const list = document.getElementById('open-hours');
      list.innerHTML = '';
      if (data.opening_hours) {
        for (let day in data.opening_hours) {
          const li = document.createElement('li');
          li.innerHTML = `<strong>${day}:</strong> ${data.opening_hours[day]}`;
          list.appendChild(li);
        }
      }
    })
    .catch(err => showError('CONTACT JSON ERROR:', err));
