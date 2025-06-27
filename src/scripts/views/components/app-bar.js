import authRepository from '../../data/auth-repository.js';

class AppBar extends HTMLElement {
  constructor() {
    super();

    this._isAuthenticated = authRepository.isAuthenticated();

    this._handleAuthChange = this._handleAuthChange.bind(this);
    this._handleLogout = this._handleLogout.bind(this);

    this._handleMenuToggle = () => {
      const navList = this.querySelector('.app-nav__list');
      if (navList) {
        navList.classList.toggle('app-nav__list--open');
      }
    };
  }

  connectedCallback() {
    this.render();

    window.addEventListener('user-logged-in', this._handleAuthChange);
    window.addEventListener('user-logged-out', this._handleAuthChange);

    this._attachEventListeners();
  }

  disconnectedCallback() {
    window.removeEventListener('user-logged-in', this._handleAuthChange);
    window.removeEventListener('user-logged-out', this._handleAuthChange);

    const menuToggle = this.querySelector('.menu-toggle');
    if (menuToggle) {
      menuToggle.removeEventListener('click', this._handleMenuToggle);
    }

    const logoutButton = this.querySelector('#logoutButton');
    if (logoutButton) {
      logoutButton.removeEventListener('click', this._handleLogout);
    }
  }

  render() {
    const userData = authRepository.getUserData() || {};

    this.innerHTML = `
      <nav class="app-nav">
        <div class="app-nav__brand">
          <a href="#/" class="app-nav__title">Dicoding Story</a>
        </div>
        
        <button class="menu-toggle" aria-label="Toggle menu">
          <i class="fas fa-bars"></i>
        </button>
        
        <ul class="app-nav__list ${
          this._isAuthenticated ? '' : 'app-nav__list--guest'
        }">
          <li class="app-nav__item">
            <a href="#/" class="app-nav__link">
              <i class="fas fa-home"></i>
              <span>Home</span>
            </a>
          </li>
          
          ${
            this._isAuthenticated
              ? `
                <li class="app-nav__item">
                  <a href="#/add" class="app-nav__link">
                    <i class="fas fa-plus-circle"></i>
                    <span>Add Story</span>
                  </a>
                </li>
                <li class="app-nav__item">
                  <a href="#/saved" class="app-nav__link">
                    <i class="fas fa-database"></i>
                    <span>Saved Offline Stories</span>
                  </a>
                </li>
                <li class="app-nav__item">
                  <button id="enableNotificationBtn" class="app-nav__button">
                    <i class="fas fa-bell"></i>
                    <span>Aktifkan Notifikasi</span>
                  </button>
                </li>
                <li class="app-nav__item app-nav__item--user">
                  <span class="app-nav__user">
                    <i class="fas fa-user-circle"></i>
                    <span>${userData.name || 'User'}</span>
                  </span>
                </li>
                <li id="logoutButton" class="app-nav__button">
                  <i class="fas fa-sign-out-alt"></i>
                  <span>Logout</span>
                </li>
              `
              : `
                <li class="app-nav__item">
                  <a href="#/login" class="app-nav__link">
                    <i class="fas fa-sign-in-alt"></i>
                    <span>Login</span>
                  </a>
                </li>
                <li class="app-nav__item">
                  <a href="#/register" class="app-nav__link app-nav__link--register">
                    <i class="fas fa-user-plus"></i>
                    <span>Register</span>
                  </a>
                </li>
              `
          }
        </ul>
      </nav>
    `;

    this._attachEventListeners();
  }

  _attachEventListeners() {
    const logoutButton = this.querySelector('#logoutButton');
    if (logoutButton) {
      logoutButton.addEventListener('click', this._handleLogout);
    }

    const menuToggle = this.querySelector('.menu-toggle');
    if (menuToggle) {
      menuToggle.addEventListener('click', this._handleMenuToggle);
    }

    // Event listener tombol notifikasi
    const notifBtn = this.querySelector('#enableNotificationBtn');
    if (notifBtn) {
      notifBtn.addEventListener('click', async () => {
        if ('Notification' in window) {
          const permission = await Notification.requestPermission();
          if (permission === 'granted') {
            notifBtn.disabled = true;
            notifBtn.innerHTML =
              '<i class="fas fa-bell"></i> <span>Notifikasi Aktif</span>';
            // === Tampilkan notifikasi dari Chrome ===
            new Notification('Notifikasi Aktif', {
              body: 'Anda akan mendapatkan notifikasi dari aplikasi.',
              icon: '/favicon.png',
            });
          } else {
            alert('Izin notifikasi ditolak.');
          }
        }
      });
    }
  }

  _handleAuthChange() {
    this._isAuthenticated = authRepository.isAuthenticated();
    this.render();
  }

  _handleLogout(event) {
    event.preventDefault();
    authRepository.logout();
    window.location.hash = '#/';
  }
}

customElements.define('app-bar', AppBar);

export default AppBar;
