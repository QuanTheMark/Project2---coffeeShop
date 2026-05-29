// 1. Lưu sẵn đoạn mã HTML của thanh Menu ban đầu vào biến để tái sử dụng
const originalNavHTML = `
    <ul class="nav pe-4 align-items-center">
      <li class="nav-item">
        <a href="./index.html" class="nav-link text-white">Home</a>
      </li>
      <li class="nav-item">
        <a href="./menu.html" class="nav-link text-white">Menu</a>
      </li>
      <li class="nav-item">
        <a href="#" class="nav-link"><i class="fa-solid fa-cart-shopping text-white"></i></a>
      </li>
      <div class="profile">
        <button type="button" id="profile-dropdown" class="dropdown-toggle btn btn-outline-light btn-success" 
        data-bs-toggle="dropdown" aria-expanded="false">
        <i class="fa-solid fa-user"></i>Tài khoản</button>
        <ul id="author-menu-drd" class="dropdown-menu" aria-labelledby="profile-dropdown">
            <!-- <li><a class="dropdown-item" href="./login.html">Đăng nhập</a></li>
            <li><a class="dropdown-item" href="./register.html">Đăng ký</a></li> -->
        </ul>
      </div>
    </ul>
`;

// 2. Định nghĩa đoạn mã nút Button mới cho Mobile (thêm class btn_closed / btn_opened và id chính xác)
const mobileButtonHTML = `
    <button type="button" id="mobile-menu-toggle" class="btn btn-outline-light btn_closed" aria-expanded="false">
        <i class="fa-solid fa-bars"></i>
    </button>
`;


// parse HTML string into an Element (keeps originalNav safe to clone)
function parseHTMLToNode(html) {
	// ...small helper to convert HTML string to Element...
	const tpl = document.createElement('template');
	tpl.innerHTML = html.trim();
	return tpl.content.firstElementChild;
}

// keep a parsed original node for safe restores
const originalNavNode = parseHTMLToNode(originalNavHTML);

// create mobile button element from the string
function createMobileButtonElement() {
	const tpl = document.createElement('template');
	tpl.innerHTML = mobileButtonHTML.trim();
	return tpl.content.firstElementChild;
}

// Hàm xử lý hoán đổi thẻ dựa theo width màn hình
function handleResponsiveMenu() {
    const width = window.innerWidth;
    
    // Tìm phần tử menu đang hiển thị (có thể là ul hoặc button)
    const currentNav = document.querySelector('ul.nav');
    let currentBtn = document.getElementById('mobile-menu-toggle');

    if (width <= 433) {
        // Nếu màn hình nhỏ và đang hiển thị thẻ ul cũ -> Tiến hành thay thế sang Button
        if (currentNav) {
            // use node-based replacement to avoid losing the original HTML string/node
            const mobileBtn = createMobileButtonElement();
            currentNav.replaceWith(mobileBtn);
            console.log("Đã đổi sang thẻ BUTTON cho mobile");
            // thêm sự kiện cho nút mới
            currentBtn = document.getElementById('mobile-menu-toggle');
            if (currentBtn) attachMobileButtonHandlers(currentBtn);
        } else {
            // nếu button đã tồn tại, đảm bảo handlers đã gắn
            if (currentBtn && !currentBtn._handlersAttached) attachMobileButtonHandlers(currentBtn);
        }
    } else {
        // Nếu màn hình lớn và đang hiển thị nút Button -> Tiến hành trả lại thẻ ul ban đầu
        if (currentBtn) {
            // remove side menu if any before swapping back
            destroySideMenu();
            // replace the button with a cloned original nav node (preserves originalNavHTML)
            currentBtn.replaceWith(originalNavNode.cloneNode(true));
            console.log("Đã trả lại thẻ UL cho desktop");
        }
    }
}

// --- New helpers for mobile side menu and state ---

function ensureMobileStyles() {
    if (document.getElementById('mobile-menu-styles')) return;
    const css = `
    .mobile-side-backdrop {
        position: fixed; inset: 0; background: rgba(0,0,0,0.4); z-index: 1040; opacity: 0; transition: opacity 250ms ease;
        pointer-events: none;
    }
    .mobile-side-backdrop.visible { opacity: 1; pointer-events: auto; }
    .mobile-side-menu {
        position: fixed; top: 0; right: 0; height: 100%; width: 280px; max-width: 80%;
        background: #fff; z-index: 1050; transform: translateX(110%); transition: transform 300ms ease;
        box-shadow: -4px 0 12px rgba(0,0,0,0.15); padding: 18px; overflow-y: auto;
        font-family: inherit;
    }
    .mobile-side-menu.opened { transform: translateX(0); }
    .mobile-side-menu .item { padding: 10px 8px; border-bottom: 1px solid #eee; color: #333; text-decoration: none; display: block; }
    .mobile-side-menu .header { font-weight: 600; margin-bottom: 8px; }
    .mobile-side-menu .small { font-size: 0.9em; color: #666; }
    .mobile-side-menu .btn-logout { margin-top: 12px; display: inline-block; padding: 8px 10px; background:#dc3545; color:#fff; border-radius:4px; text-decoration:none; }

    /* mobile toggle button: smooth transition and icon rotation */
    
    #mobile-menu-toggle i {
        display: inline-block;
        transition: transform 220ms ease;
        transform-origin: center;
    }
    /* closed state - slight lift on hover */
    #mobile-menu-toggle.btn_closed:hover {
        transform: translateY(-2px);
    }
    /* opened state - subtle rotation/scale + color accent */
    #mobile-menu-toggle.btn_opened {
        transform: rotate(6deg) scale(0.98);
        background-color: rgba(220,53,69,0.06);
        border-color: #dc3545;
        color: #dc3545;
    }
    #mobile-menu-toggle.btn_opened i {
        transform: rotate(90deg);
    }

    /* close button: bolder black outline and hover/active -> red */
    .mobile-side-menu .close-btn {
        position: absolute;
        top: 12px;
        left: 12px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 42px;
        height: 38px;
        padding: 6px 10px;
        font-size: 18px;
        background: transparent;
        border: 2px solid #000; /* bold black outline */
        color: #444;
        border-radius: 6px;
        cursor: pointer;
        z-index: 2;
        transition: border-color 180ms ease, color 180ms ease, background-color 180ms ease, transform 120ms ease;
    }
    .mobile-side-menu .close-btn:hover,
    .mobile-side-menu .close-btn:active {
        border-color: #dc3545; /* red on hover/active */
        color: #444;
        background-color: rgba(235, 38, 58, 0.82);
    }
    .mobile-side-menu .close-btn:active {
        transform: translateY(1px) scale(0.99);
    }
    .mobile-side-menu .close-btn:focus { outline: 2px solid #007bff; }

    /* ensure menu content sits below the close button */
    #mobile-side-menu-content {
        margin-top: 60px; /* leaves space under the close button */
    }
    `;
    const s = document.createElement('style');
    s.id = 'mobile-menu-styles';
    s.appendChild(document.createTextNode(css));
    document.head.appendChild(s);
}

function attachMobileButtonHandlers(btn) {
    if (!btn) return;
    btn._handlersAttached = true;
    ensureMobileStyles();

    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleSideMenu();
    });
    // close menu on resize to desktop
    window.addEventListener('resize', () => {
        if (window.innerWidth > 430.2) destroySideMenu();
    });
}

function createSideMenuElements() {
    // if exists, return
    if (document.getElementById('mobile-side-menu')) return;

    const backdrop = document.createElement('div');
    backdrop.className = 'mobile-side-backdrop';
    backdrop.id = 'mobile-side-backdrop';

    const menu = document.createElement('aside');
    menu.className = 'mobile-side-menu';
    menu.id = 'mobile-side-menu';

    // close button (new)
    const closeBtn = document.createElement('button');
    closeBtn.className = 'close-btn';
    closeBtn.type = 'button';
    closeBtn.setAttribute('aria-label', 'Đóng menu');
    closeBtn.innerHTML = '<i class="fa-solid fa-x" aria-hidden="true"></i>'; // use FA icon
    menu.appendChild(closeBtn);

    const content = document.createElement('div');
    content.id = 'mobile-side-menu-content';
    menu.appendChild(content);

    document.body.appendChild(backdrop);
    document.body.appendChild(menu);

    // close when clicking backdrop
    backdrop.addEventListener('click', () => toggleSideMenu(false));
    // close when clicking close button
    closeBtn.addEventListener('click', () => toggleSideMenu(false));
}

function renderMenuContent() {
    const content = document.getElementById('mobile-side-menu-content');
    if (!content) return;
    // read user from localStorage (expect JSON like {name,email,sodu})
    let user = null;
    try { user = JSON.parse(localStorage.getItem('user')); } catch(e) { user = null; }

    content.innerHTML = ''; // clear

    if (!user) {
        // not logged in: show Đăng nhập, Đăng ký
        const header = document.createElement('div');
        header.className = 'header';
        header.textContent = 'Tài khoản';
        content.appendChild(header);

        const login = document.createElement('a');
        login.className = 'item';
        login.href = './login.html';
        login.textContent = 'Đăng nhập';
        content.appendChild(login);

        const register = document.createElement('a');
        register.className = 'item';
        register.href = './register.html';
        register.textContent = 'Đăng ký';
        content.appendChild(register);
    } else {
        // logged in: tên, email, số dư, đơn hàng, đăng xuất
        const name = document.createElement('div');
        name.className = 'header';
        name.textContent = user.name || 'Người dùng';
        content.appendChild(name);

        const email = document.createElement('div');
        email.className = 'small';
        email.textContent = user.email || '';
        content.appendChild(email);

        const sodu = document.createElement('a');
        sodu.className = 'item';
        sodu.href = '#';
        sodu.textContent = 'Số dư: ' + (user.sodu != null ? user.sodu : '0');
        content.appendChild(sodu);

        const orders = document.createElement('a');
        orders.className = 'item';
        orders.href = './orders.html';
        orders.textContent = 'Đơn hàng';
        content.appendChild(orders);

        const logout = document.createElement('a');
        logout.className = 'btn-logout';
        logout.href = '#';
        logout.textContent = 'Đăng xuất';
        logout.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('user');
            renderMenuContent();
            // optionally close menu
            toggleSideMenu(false);
        });
        content.appendChild(logout);
    }
}

function toggleSideMenu(forceOpen) {
    createSideMenuElements();
    const backdrop = document.getElementById('mobile-side-backdrop');
    const menu = document.getElementById('mobile-side-menu');
    const btn = document.getElementById('mobile-menu-toggle');
    if (!menu || !backdrop) return;

    const isOpen = menu.classList.contains('opened');
    const shouldOpen = typeof forceOpen === 'boolean' ? forceOpen : !isOpen;

    if (shouldOpen) {
        renderMenuContent();

        // ensure starting from hidden state (no opened/visible)
        menu.classList.remove('opened');
        backdrop.classList.remove('visible');

        // force reflow so browser registers the starting transform/opacity
        // then schedule adding classes on next frame to trigger CSS transition smoothly
        // (offsetWidth read is a safe reflow trigger)
        void menu.offsetWidth;

        requestAnimationFrame(() => {
            menu.classList.add('opened');
            backdrop.classList.add('visible');
            if (btn) {
                btn.classList.remove('btn_closed');
                btn.classList.add('btn_opened');
                btn.setAttribute('aria-expanded', 'true');
            }
        });
    } else {
        // close: remove classes to trigger closing transition
        menu.classList.remove('opened');
        backdrop.classList.remove('visible');
        if (btn) {
            btn.classList.remove('btn_opened');
            btn.classList.add('btn_closed');
            btn.setAttribute('aria-expanded', 'false');
        }
        // remove elements after transition ends
        setTimeout(() => {
            destroySideMenu();
        }, 350);
    }
}

function destroySideMenu() {
    const backdrop = document.getElementById('mobile-side-backdrop');
    const menu = document.getElementById('mobile-side-menu');
    const btn = document.getElementById('mobile-menu-toggle');
    if (backdrop) backdrop.remove();
    if (menu) menu.remove();
    if (btn) {
        btn.classList.remove('btn_opened');
        btn.classList.add('btn_closed');
        btn.setAttribute('aria-expanded', 'false');
    }
}

// 3. Lắng nghe sự kiện thay đổi kích thước màn hình
window.addEventListener('resize', handleResponsiveMenu);

// 4. Chạy hàm ngay lần đầu tiên tải trang để kiểm tra thiết bị hiện tại
document.addEventListener('DOMContentLoaded', handleResponsiveMenu);
