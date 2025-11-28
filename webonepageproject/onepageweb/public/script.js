function smartFetch(path) {
  return fetch(`../${path}`).catch(() => fetch(`/${path}`));
}

function showError(tag, err) {
  console.error(tag, err);
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

// MENU + FILTER
smartFetch('data/menu.json')
  .then(res => res.json())
  .then(data => {
    const container = document.getElementById('menu-list');
    const filterContainer = document.getElementById('filter-buttons');
    const allCategories = [...new Set(data.menu.map(item => item.category))];

    allCategories.forEach(cat => {
      const btn = document.createElement('button');
      btn.innerText = cat;
      btn.onclick = () => renderMenu(data.menu.filter(item => item.category === cat));
      filterContainer.appendChild(btn);
    });

    function renderMenu(menu) {
      container.innerHTML = '';
      menu.forEach(item => {
        const el = document.createElement('div');
        el.className = 'menu-item';
        el.innerHTML = `<h3>${item.name}</h3><p>${item.description}</p><strong>${item.price} Kč</strong>`;
        container.appendChild(el);
      });
    }

    renderMenu(data.menu);
  })
  .catch(err => showError('MENU JSON ERROR:', err));

// GALLERY
smartFetch('data/gallery.json')
  .then(res => res.json())
  .then(data => {
    const gallery = document.getElementById('gallery-container');
    data.images.forEach(img => {
      const imgEl = document.createElement('img');
      imgEl.src = `../${img.src}`;
      imgEl.alt = img.alt || '';
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