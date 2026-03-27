// Do Frontend và Backend chạy chung 1 server (port 3103), ta dùng đường dẫn tương đối
const API_BASE_URL = '/api/v1';

// Khi trang web vừa tải xong, tự động lấy danh sách sự kiện
document.addEventListener('DOMContentLoaded', () => {
    const loggedInId = localStorage.getItem('loggedInUserId');
    const userIdInput = document.getElementById('userId');
    if(userIdInput && loggedInId) {
        userIdInput.value = loggedInId;
    }
    loadEvents();
});

// Hàm gọi API lấy danh sách Sự kiện
function loadEvents() {
    fetch(`${API_BASE_URL}/events`)
        .then(response => response.json())
        .then(events => {
            const eventListDiv = document.getElementById('event-list');
            eventListDiv.innerHTML = ''; // Xóa chữ "Đang tải"

            events.forEach(event => {
                // Tạo thẻ HTML cho từng sự kiện
                // Sử dụng chính xác các trường: EventId, name, price, leftcapacity từ EventReponse của em
                const col = document.createElement('div');
                col.className = 'col-md-6 mb-3';
                col.innerHTML = `
                    <div class="card event-card h-100" onclick="selectEvent(${event.eventId})">
                        <div class="card-body">
                            <h5 class="card-title text-primary">${event.name}</h5>
                            <p class="card-text mb-1">📍 Địa điểm: <strong>${event.venue.name}</strong> - ${event.venue.address}</p>
                            <p class="card-text mb-1">Kho vé còn: <strong>${event.leftcapacity}</strong> vé</p>
                            <p class="price-tag mb-0">${event.price} VND</p>
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

// Hàm đẩy EventId vào form khi click chọn sự kiện
function selectEvent(eventId) {
    document.getElementById('eventId').value = eventId;
    showAlert(`Đã chọn Sự kiện ID: ${eventId}. Vui lòng nhập thông tin để mua vé!`, 'info');
}

// Bắt sự kiện khi người dùng bấm nút XÁC NHẬN ĐẶT VÉ
document.getElementById('booking-form').addEventListener('submit', function(e) {
    e.preventDefault(); // Chặn hành vi load lại trang mặc định

    // 1. Thu thập dữ liệu từ Form (Map chính xác tên biến trong BookingRequest của em)
    const payload = {
        userId: document.getElementById('userId').value,
        eventId: document.getElementById('eventId').value,
        ticketcount: document.getElementById('ticketCount').value
    };

    // 2. Gửi request POST xuống Controller Order
    fetch(`${API_BASE_URL}/order/create`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    })
        .then(async response => {
            const data = await response.json();

            // Nếu HTTP status là 2xx (Thành công)
            if (response.ok) {
                // data lúc này chính là OrderReponse
                showAlert(`🎉 Đặt vé thành công! Mã đơn: ${data.bookingId} - Tổng tiền: ${data.totalPrice} VND`, 'success');
                loadEvents(); // Load lại để cập nhật số lượng vé mới nhất
                document.getElementById('ticketCount').value = 1; // reset form
            } else {
                // Nếu có lỗi do em chủ động throw (chặn ở backend)
                // data lúc này chính là ErrorResponse của em
                showAlert(`❌ Đặt vé thất bại: ${data.message || 'Lỗi hệ thống'}`, 'danger');
            }
        })
        .catch(error => {
            showAlert('❌ Không thể kết nối đến Server!', 'danger');
        });
});

// Hàm hiển thị hộp thoại thông báo UI
function showAlert(message, type) {
    const alertBox = document.getElementById('alert-box');
    alertBox.className = `alert alert-${type}`;
    alertBox.innerHTML = message;
    alertBox.classList.remove('d-none');
}
const registerForm = document.getElementById('register-form');
if (registerForm) {
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Đóng gói data chuẩn theo class CustomerRequest của em
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
                if (data.CustomerId) {
                    showAuthAlert(`Đăng ký thành công! Xin chào ${data.name}. Bạn có thể đăng nhập ngay!`, 'success');
                    registerForm.reset();
                } else {
                    showAuthAlert('Đăng ký thất bại, vui lòng kiểm tra lại!', 'danger');
                }
            })
            .catch(err => showAuthAlert('Lỗi kết nối máy chủ!', 'danger'));
    });
}

// Xử lý Form Đăng Nhập
const loginForm = document.getElementById('login-form');
if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        // TẠM THỜI MÔ PHỎNG VÌ BACKEND CHƯA CÓ API /login
        // Thầy giả sử nếu nhập đúng form thì coi như đăng nhập thành công với CustomerId = 1
        if(email && password) {
            // Lưu CustomerId vào LocalStorage của trình duyệt
            localStorage.setItem('loggedInUserId', 1); // Em thay số 1 này bằng data từ API sau khi viết nhé
            localStorage.setItem('loggedInUserName', email);

            showAuthAlert('Đăng nhập thành công! Đang chuyển hướng...', 'success');
            setTimeout(() => {
                window.location.href = 'index.html'; // Chuyển về trang chủ
            }, 1000);
        }
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