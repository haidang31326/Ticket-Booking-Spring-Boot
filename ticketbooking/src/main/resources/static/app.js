const API_BASE_URL = '/api/v1';

// ==================== KHỞI CHẠY KHI LOAD TRANG ==================== //
document.addEventListener('DOMContentLoaded', () => {
    const currentPath = window.location.pathname;
    const loggedInId = localStorage.getItem('loggedInUserId');

    // 1. Bảo vệ trang: Nếu chưa đăng nhập và không ở trang login -> Đá về login
    if (!currentPath.includes('login.html') && !loggedInId) {
        window.location.href = 'login.html';
        return; // Dừng lập tức
    }

    // 2. Tự động điền UserId vào ô input nếu có
    const userIdInput = document.getElementById('userId');
    if(userIdInput && loggedInId) {
        userIdInput.value = loggedInId;
    }

    // 3. Tải danh sách sự kiện (chỉ chạy ở trang index)
    loadEvents();
});


// ==================== LOGIC TRANG CHỦ (ĐẶT VÉ) ==================== //
function loadEvents() {
    const eventListDiv = document.getElementById('event-list');
    if (!eventListDiv) return;

    fetch(`${API_BASE_URL}/events`)
        .then(response => response.json())
        .then(events => {
            eventListDiv.innerHTML = '';

            events.forEach(event => {
                const col = document.createElement('div');
                col.className = 'col-md-6 mb-3';
                col.innerHTML = `
                    <div class="card event-card h-100" onclick="selectEvent(${event.eventId})">
                        <div class="card-body">
                            <h5 class="card-title text-primary">${event.name}</h5>
                            <p class="card-text mb-1">📍 Địa điểm: <strong>${event.venue ? event.venue.name : 'Đang cập nhật'}</strong> - ${event.venue ? event.venue.address : ''}</p>
                            <p class="card-text mb-1">🎟️ Kho vé còn: <strong>${event.leftcapacity}</strong> vé</p>
                            <p class="price-tag mb-0">💰 ${event.price} VND</p>
                        </div>
                        <div class="card-footer bg-transparent border-top-0">
                            <button class="btn btn-sm btn-outline-primary w-100">Chọn Sự Kiện Này</button>
                        </div>
                    </div>
                `;
                eventListDiv.appendChild(col);
            });
        })
        .catch(error => showAlert('Lỗi khi tải danh sách sự kiện: ' + error, 'danger'));
}

function selectEvent(eventId) {
    const eventInput = document.getElementById('eventId');
    if (eventInput) {
        eventInput.value = eventId;
        showAlert(`Đã chọn Sự kiện ID: ${eventId}. Vui lòng nhập thông tin để mua vé!`, 'info');
    }
}

const bookingForm = document.getElementById('booking-form');
if (bookingForm) {
    bookingForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const payload = {
            userId: document.getElementById('userId').value,
            eventId: document.getElementById('eventId').value,
            ticketcount: document.getElementById('ticketCount').value
        };

        fetch(`${API_BASE_URL}/order/create`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
            .then(async response => {
                const data = await response.json();
                if (response.ok) {
                    showAlert(`🎉 Đặt vé thành công! Mã đơn: ${data.bookingId} - Tổng tiền: ${data.totalPrice} VND`, 'success');
                    loadEvents();
                    document.getElementById('ticketCount').value = 1;
                } else {
                    showAlert(`❌ Đặt vé thất bại: ${data.message || 'Lỗi hệ thống'}`, 'danger');
                }
            })
            .catch(error => showAlert('❌ Không thể kết nối đến Server!', 'danger'));
    });
}

function showAlert(message, type) {
    const alertBox = document.getElementById('alert-box');
    if (alertBox) {
        alertBox.className = `alert alert-${type}`;
        alertBox.innerHTML = message;
        alertBox.classList.remove('d-none');
    } else {
        console.log(`[${type}] ${message}`);
    }
}


// ==================== LOGIC ĐĂNG NHẬP / ĐĂNG KÝ ==================== //
const registerForm = document.getElementById('register-form');
if (registerForm) {
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const payload = {
            name: document.getElementById('reg-name').value,
            email: document.getElementById('reg-email').value,
            password: document.getElementById('reg-password').value,
            address: document.getElementById('reg-address').value
        };

        fetch(`${API_BASE_URL}/customer/create`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
            .then(response => response.json())
            .then(data => {
                if (data.CustomerId || data.customerId) {
                    showAuthAlert(`Đăng ký thành công! Xin chào ${data.name}.`, 'success');
                    registerForm.reset();
                    setTimeout(() => toggleForm('login'), 1500);
                } else {
                    showAuthAlert('Đăng ký thất bại, vui lòng kiểm tra lại!', 'danger');
                }
            })
            .catch(err => showAuthAlert('Lỗi kết nối máy chủ!', 'danger'));
    });
}

const loginForm = document.getElementById('login-form');
if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const payload = {
            email: document.getElementById('login-email').value,
            password: document.getElementById('login-password').value
        };

        fetch(`${API_BASE_URL}/customer/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
            .then(async response => {
                const data = await response.json();
                if (response.ok) {
                    const idToSave = data.CustomerId || data.customerId;
                    localStorage.setItem('loggedInUserId', idToSave);
                    localStorage.setItem('loggedInUserName', data.name);

                    showAuthAlert('Đăng nhập thành công! Đang chuyển hướng...', 'success');
                    setTimeout(() => {
                        // Đăng nhập xong đá thẳng vào Dashboard
                        window.location.href = 'dashboard.html';
                    }, 1000);
                } else {
                    showAuthAlert(`❌ Lỗi: ${data.message || 'Sai email hoặc mật khẩu!'}`, 'danger');
                }
            })
            .catch(err => showAuthAlert('❌ Không thể kết nối đến Server!', 'danger'));
    });
}

function showAuthAlert(message, type) {
    const alertBox = document.getElementById('auth-alert');
    if(alertBox) {
        alertBox.className = `alert alert-${type}`;
        alertBox.innerHTML = message;
        alertBox.classList.remove('d-none');
    }
}

// ==================== LOGIC ĐĂNG XUẤT ==================== //
function logoutUser() {
    if(confirm("Bạn có chắc chắn muốn đăng xuất không?")) {
        localStorage.removeItem('loggedInUserId');
        localStorage.removeItem('loggedInUserName');
        window.location.href = 'login.html';
    }
}