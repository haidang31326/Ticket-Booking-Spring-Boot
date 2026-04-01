const App = {
    // ĐỊA CHỈ API CỦA SPRING BOOT
    API_BASE_URL: 'http://139.59.229.249:3103/api/v1',

    // STATE
    currentUser: JSON.parse(localStorage.getItem('currentUser')) || null,
    isLoginMode: true,

    // 1. CẬP NHẬT NAVBAR DỰA VÀO TRẠNG THÁI LOGIN
    updateNavbar() {
        const nav = document.getElementById('nav-links');
        if (!nav) return;

        const path = window.location.pathname;
        const isIndex = path.includes('index.html') || path.endsWith('/');
        const isHistory = path.includes('history.html');
        const isDashboard = path.includes('dashboard.html');

        let html = `<a href="index.html" class="hover:text-indigo-200 font-medium ${isIndex ? 'text-indigo-200 border-b-2' : ''}">Sự kiện</a>`;

        if (this.currentUser) {
            html += `<a href="history.html" class="hover:text-indigo-200 font-medium ${isHistory ? 'text-indigo-200 border-b-2' : ''}">Vé của tôi</a>`;

            // Nếu là admin thì hiện nút Quản trị
            if (this.currentUser.email === 'admin@gmail.com') {
                html += `<a href="dashboard.html" class="hover:text-indigo-200 font-medium flex items-center gap-1 ${isDashboard ? 'text-indigo-200 border-b-2' : ''}"><i class="fa-solid fa-shield"></i> Quản trị</a>`;
            }

            html += `
                <div class="flex items-center gap-3 ml-4 pl-4 border-l border-indigo-500">
                    <span class="text-sm font-semibold"><i class="fa-solid fa-user"></i> ${this.currentUser.name}</span>
                    <button onclick="App.logout()" class="bg-indigo-700 p-2 rounded-full hover:bg-indigo-800 transition" title="Đăng xuất"><i class="fa-solid fa-right-from-bracket"></i></button>
                </div>
            `;
        } else {
            html += `<a href="login.html" class="bg-white text-indigo-600 px-4 py-2 rounded-lg font-bold hover:bg-indigo-50 transition">Đăng nhập</a>`;
        }
        nav.innerHTML = html;
    },

    // 2. CORE: HÀM GỌI API TRỰC TIẾP VÀO SPRING BOOT
    async callApi(endpoint, method = 'GET', body = null) {
        try {
            const options = {
                method,
                headers: { 'Content-Type': 'application/json' }
            };
            if (body) options.body = JSON.stringify(body);

            const response = await fetch(this.API_BASE_URL + endpoint, options);
            if (!response.ok) throw new Error('API Error: ' + response.statusText);

            return await response.json();
        } catch (error) {
            this.showToast('Lỗi kết nối Server! Vui lòng bật Backend ở cổng 3103.', 'error');
            console.error("Lỗi API:", error);
            throw error;
        }
    },

    // 3. API LẤY SỰ KIỆN (Trang Chủ)
    async loadEvents() {
        try {
            const eventsList = await this.callApi('/events');
            const container = document.getElementById('events-container');
            if (!container) return;

            if(!eventsList || eventsList.length === 0) {
                container.innerHTML = '<p class="col-span-3 text-center text-slate-500">Chưa có sự kiện nào.</p>';
                return;
            }

            container.innerHTML = eventsList.map(event => {
                // Tuyệt chiêu bọc lót: Lấy đúng ID dù Backend trả về viết hoa hay thường
                const safeEventId = event.eventId || event.EventId || event.id;

                return `
                <div class="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-slate-100 flex flex-col">
                    <div class="h-48 bg-slate-200 relative">
                        <img src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=400&fit=crop&q=80&random=${safeEventId}" class="w-full h-full object-cover" />
                        <div class="absolute top-3 right-3 bg-white/90 px-3 py-1 rounded-full text-indigo-700 font-bold text-sm shadow-sm">
                            ${(event.price || 0).toLocaleString()} VNĐ
                        </div>
                    </div>
                    <div class="p-5 flex flex-col flex-1">
                        <h3 class="text-xl font-bold text-slate-800 mb-3">${event.name}</h3>
                        <div class="space-y-2 text-sm text-slate-600 mb-6">
                            <div class="flex items-center gap-2"><i class="fa-solid fa-ticket text-indigo-500"></i> Còn ${event.leftcapacity} / ${event.capacity} vé</div>
                            <div class="flex items-center gap-2"><i class="fa-solid fa-location-dot text-indigo-500"></i> ${event.venue?.name || 'Đang cập nhật'}</div>
                        </div>
                        <div class="mt-auto flex items-center gap-3 pt-4 border-t border-slate-100">
                            <select id="qty-${safeEventId}" class="bg-slate-50 border border-slate-200 rounded-lg p-2 outline-none font-medium">
                                <option value="1">1 vé</option><option value="2">2 vé</option><option value="3">3 vé</option><option value="4">4 vé</option>
                            </select>
                            <button onclick="App.bookTicket(${safeEventId})" class="flex-1 bg-indigo-600 text-white font-semibold py-2 rounded-lg hover:bg-indigo-700 transition">Đặt Ngay</button>
                        </div>
                    </div>
                </div>
                `;
            }).join('');
        } catch (e) {
            console.error("Lỗi khi tải sự kiện:", e);
        }
    },

    // 4. API ĐẶT VÉ
    async bookTicket(safeEventId) {
        if (!this.currentUser) {
            window.location.href = 'login.html';
            return;
        }

        const qty = document.getElementById(`qty-${safeEventId}`).value;
        const safeUserId = this.currentUser.customerId || this.currentUser.CustomerId || this.currentUser.id;

        // Đóng gói dữ liệu (Viết thường chữ cái đầu theo chuẩn Spring Boot)
        const payload = {
            userId: safeUserId,
            eventId: safeEventId,
            ticketcount: parseInt(qty)
        };

        // In ra Console để bạn dễ dàng kiểm tra dữ liệu trước khi gửi
        console.log("🚀 Payload gửi lên Backend:", payload);

        try {
            await this.callApi('/order/create', 'POST', payload);
            this.showToast('Đặt vé thành công!');
            setTimeout(() => { window.location.href = 'history.html'; }, 1000);
        } catch (e) {
            console.error("Lỗi khi đặt vé:", e);
        }
    },

    // 5. API LỊCH SỬ MUA VÉ (Trang history.html)
    async loadOrders() {
        try {
            const orders = await this.callApi(`/order/user/${this.currentUser.customerId}`);
            const tbody = document.getElementById('orders-tbody');
            if (!tbody) return;

            if(!orders || orders.length === 0) {
                tbody.innerHTML = `<tr><td colspan="5" class="p-8 text-center text-slate-500">Bạn chưa mua vé nào.</td></tr>`;
                return;
            }
            tbody.innerHTML = orders.map(order => `
                <tr class="border-b border-slate-100 hover:bg-slate-50">
                    <td class="p-4 font-mono text-indigo-600">#${order.bookingId}</td>
                    <td class="p-4 font-medium">Sự kiện #${order.eventId}</td>
                    <td class="p-4">${order.ticketCount} vé</td>
                    <td class="p-4 font-semibold">${(order.totalPrice || 0).toLocaleString()}đ</td>
                    <td class="p-4 text-xs text-slate-500">${order.bookingTime ? new Date(order.bookingTime).toLocaleString() : 'N/A'}</td>
                </tr>
            `).join('');
        } catch (e) {}
    },

    // 6. CHỨC NĂNG ĐĂNG NHẬP / ĐĂNG KÝ
    toggleAuthMode() {
        this.isLoginMode = !this.isLoginMode;
        document.getElementById('auth-title').innerText = this.isLoginMode ? 'Đăng nhập' : 'Tạo tài khoản';
        document.getElementById('auth-btn').innerText = this.isLoginMode ? 'Đăng Nhập' : 'Đăng Ký';
        document.getElementById('auth-toggle-text').innerText = this.isLoginMode ? 'Chưa có tài khoản?' : 'Đã có tài khoản?';
        document.getElementById('auth-toggle-btn').innerText = this.isLoginMode ? 'Đăng ký ngay' : 'Đăng nhập';
        document.getElementById('register-fields').style.display = this.isLoginMode ? 'none' : 'block';
    },

    async handleAuthSubmit(e) {
        e.preventDefault();
        const email = document.getElementById('auth-email').value;
        const password = document.getElementById('auth-password').value;

        try {
            let user;
            if (this.isLoginMode) {
                user = await this.callApi('/customer/login', 'POST', { email, password });
            } else {
                const name = document.getElementById('auth-name').value;
                const address = document.getElementById('auth-address').value;
                user = await this.callApi('/customer/create', 'POST', { name, email, password, address });
            }

            localStorage.setItem('currentUser', JSON.stringify(user));
            this.showToast('Thành công! Đang chuyển hướng...');
            setTimeout(() => { window.location.href = 'index.html'; }, 1000);
        } catch (err) {
            this.showToast('Sai thông tin, vui lòng thử lại', 'error');
        }
    },

    logout() {
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    },

    // Điền nhanh thông tin Admin để tiện bấm đăng nhập
    testAdminLogin() {
        document.getElementById('auth-email').value = 'admin@gmail.com';
        document.getElementById('auth-password').value = 'admin123';
    },

    // 7. API QUẢN TRỊ ADMIN (Trang dashboard.html)
    async loadVenues() {
        try {
            const venuesList = await this.callApi('/venues');
            const ul = document.getElementById('venues-list');
            const select = document.getElementById('ev-venue');

            if (ul) ul.innerHTML = venuesList.map(v => `<li class="bg-slate-50 p-2 rounded border">${v.name} - ${v.address}</li>`).join('');
            if (select) select.innerHTML = '<option value="">-- Chọn --</option>' + venuesList.map(v => `<option value="${v.venueid}">${v.name} (Chứa: ${v.totalCapacity})</option>`).join('');
        } catch (e) {}
    },

    async createVenue(e) {
        e.preventDefault();
        try {
            await this.callApi('/venue/create', 'POST', {
                venueName: document.getElementById('ven-name').value,
                venueAddress: document.getElementById('ven-addr').value,
                venueCapacity: parseInt(document.getElementById('ven-cap').value)
            });
            this.showToast('Tạo địa điểm thành công!');
            e.target.reset();
            this.loadVenues();
        } catch (err) {}
    },

    async createEvent(e) {
        e.preventDefault();
        const cap = parseInt(document.getElementById('ev-cap').value);
        try {
            await this.callApi('/event/create', 'POST', {
                eventName: document.getElementById('ev-name').value,
                capacity: cap,
                leftcapacity: cap, // Backend sẽ trừ dần số này khi có người đặt
                price: parseFloat(document.getElementById('ev-price').value),
                venueId: parseInt(document.getElementById('ev-venue').value)
            });
            this.showToast('Tạo sự kiện thành công!');
            e.target.reset();
            setTimeout(() => { window.location.href = 'index.html'; }, 1000);
        } catch (err) {}
    },

    // === HÀM HIỂN THỊ THÔNG BÁO ===
    showToast(msg, type = 'success') {
        let container = document.getElementById('toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-container';
            document.body.appendChild(container);
        }
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `<i class="fa-solid fa-${type === 'success' ? 'check-circle' : 'circle-exclamation'}"></i> ${msg}`;
        container.appendChild(toast);
        setTimeout(() => { toast.remove(); }, 3000);
    }
};

// INITIALIZER - CHẠY KHI TRANG LOAD XONG
document.addEventListener('DOMContentLoaded', () => {
    App.updateNavbar();
    const path = window.location.pathname;

    // Route logic dựa vào tên file
    if (path.includes('index.html') || path === '/' || path.endsWith('/')) {
        App.loadEvents();
    } else if (path.includes('history.html')) {
        if (!App.currentUser) window.location.href = 'login.html';
        else App.loadOrders();
    } else if (path.includes('dashboard.html')) {
        if (!App.currentUser || App.currentUser.email !== 'admin@gmail.com') window.location.href = 'index.html';
        else App.loadVenues();
    }
});