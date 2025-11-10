// Legacy JavaScript - ES5 문법, 전역 변수 오염, jQuery 1.x 패턴
// 문제점들을 의도적으로 포함한 레거시 코드

// OrderService 클래스 - 프로토타입 기반 ES5 스타일
function OrderService() {
    this.orders = [];
    this.orderCounter = 1;
    this.productPrices = {
        'laptop': 1200000,
        'mouse': 30000,
        'keyboard': 80000
    };
}

// 메서드들이 프로토타입에 분산되어 있음 - 리팩토링이 필요한 구조
OrderService.prototype.calculateOrderTotal = function(items) {
    var total = 0;
    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        // 하드코딩된 가격 로직 - 테스트하기 어려운 구조
        if (this.productPrices[item.productId]) {
            total += this.productPrices[item.productId] * item.quantity;
        } else {
            // 에러 처리가 일관성 없음
            console.log('Unknown product: ' + item.productId);
        }
    }
    // 할인 로직이 하드코딩됨 - 리팩토링 필요
    if (total > 1000000) {
        total = total * 0.95; // 5% 할인
    }
    return total;
};

OrderService.prototype.createOrder = function(userId, items) {
    // 유효성 검증이 메서드 내부에 혼재됨 - 단일 책임 원칙 위반
    if (!userId) {
        alert('사용자 정보가 필요합니다.');
        return null;
    }
    
    if (!items || items.length === 0) {
        alert('주문 항목이 없습니다.');
        return null;
    }
    
    // 날짜 처리가 일관성 없음
    var orderDate = new Date();
    var formattedDate = moment(orderDate).format('YYYY-MM-DD HH:mm:ss');
    
    var order = {
        id: this.orderCounter++,
        userId: userId,
        items: items,
        total: this.calculateOrderTotal(items),
        status: 'pending',
        createdAt: formattedDate,
        updatedAt: formattedDate
    };
    
    this.orders.push(order);
    
    // DOM 조작이 서비스 레이어에 섞여있음 - 관심사 분리 필요
    this.updateOrderHistory();
    
    return order;
};

OrderService.prototype.updateOrderStatus = function(orderId, status) {
    // 배열 검색이 비효율적
    for (var i = 0; i < this.orders.length; i++) {
        if (this.orders[i].id == orderId) { // == 사용 (=== 권장)
            this.orders[i].status = status;
            this.orders[i].updatedAt = moment().format('YYYY-MM-DD HH:mm:ss');
            
            // 또 다른 DOM 조작 - 관심사 분리 필요
            $('#order-' + orderId + ' .status').text(status);
            return true;
        }
    }
    
    // 일관성 없는 에러 처리
    console.error('Order not found: ' + orderId);
    return false;
};

OrderService.prototype.getOrdersByUser = function(userId) {
    var userOrders = [];
    // 필터링 로직이 하드코딩됨
    for (var i = 0; i < this.orders.length; i++) {
        if (this.orders[i].userId == userId) {
            userOrders.push(this.orders[i]);
        }
    }
    return userOrders;
};

// DOM 조작이 서비스에 혼재됨 - 관심사 분리 필요
OrderService.prototype.updateOrderHistory = function() {
    var $orderList = $('#order-list');
    $orderList.empty();
    
    for (var i = 0; i < this.orders.length; i++) {
        var order = this.orders[i];
        var orderHtml = '<div id="order-' + order.id + '" class="order-item">' +
            '<h4>주문 #' + order.id + ' (상태: <span class="status">' + order.status + '</span>)</h4>' +
            '<p>주문일: ' + order.createdAt + '</p>' +
            '<p>총액: ' + order.total.toLocaleString() + '원</p>' +
            '<ul>';
        
        for (var j = 0; j < order.items.length; j++) {
            var item = order.items[j];
            orderHtml += '<li>' + products[item.productId].name + ' x ' + item.quantity + '</li>';
        }
        
        orderHtml += '</ul></div>';
        $orderList.append(orderHtml);
    }
};

// UserController 클래스 - 더 복잡한 레거시 패턴들
function UserController() {
    this.users = [];
    this.currentUser = null;
    this.userCounter = 1;
    
    // 하드코딩된 관리자 계정
    this.adminUsers = ['admin@example.com', 'manager@example.com'];
}

UserController.prototype.registerUser = function(username, email, password) {
    // 유효성 검증, 데이터 처리, DOM 조작이 모두 한 메서드에 섞임
    
    // 클라이언트 측 유효성 검증 - 서버 검증 없음
    if (!username || username.length < 2) {
        this.showError('사용자명은 2자 이상이어야 합니다.');
        return false;
    }
    
    if (!this.validateEmail(email)) {
        this.showError('유효한 이메일을 입력해주세요.');
        return false;
    }
    
    if (!password || password.length < 4) {
        this.showError('비밀번호는 4자 이상이어야 합니다.');
        return false;
    }
    
    // 중복 검사가 비효율적
    for (var i = 0; i < this.users.length; i++) {
        if (this.users[i].email === email) {
            this.showError('이미 존재하는 이메일입니다.');
            return false;
        }
    }
    
    // 비밀번호를 평문으로 저장 - 보안 문제
    var user = {
        id: this.userCounter++,
        username: username,
        email: email,
        password: password, // 평문 저장!
        role: this.adminUsers.indexOf(email) !== -1 ? 'admin' : 'user',
        createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
        isActive: true
    };
    
    this.users.push(user);
    
    // 성공 시 자동 로그인
    this.loginUser(email, password);
    
    // DOM 직접 조작
    this.updateUserList();
    this.clearForm();
    this.showSuccess('회원가입이 완료되었습니다.');
    
    return true;
};

UserController.prototype.loginUser = function(email, password) {
    // 로그인 로직, 세션 관리, DOM 업데이트가 혼재
    
    if (!email || !password) {
        this.showError('이메일과 비밀번호를 입력해주세요.');
        return false;
    }
    
    // 사용자 검색이 비효율적
    var user = null;
    for (var i = 0; i < this.users.length; i++) {
        if (this.users[i].email === email && this.users[i].password === password) {
            user = this.users[i];
            break;
        }
    }
    
    if (!user) {
        this.showError('이메일 또는 비밀번호가 틀렸습니다.');
        return false;
    }
    
    if (!user.isActive) {
        this.showError('비활성화된 계정입니다.');
        return false;
    }
    
    // 전역 변수에 직접 할당
    this.currentUser = user;
    currentUser = user; // 전역 변수 오염
    
    // 로그인 상태 UI 업데이트
    this.updateUserInfo();
    this.showSuccess('환영합니다, ' + user.username + '님!');
    
    // 관리자면 추가 기능 표시
    if (user.role === 'admin') {
        $('#admin-panel').show();
    }
    
    return true;
};

// 여러 책임이 혼재된 메서드들
UserController.prototype.validateEmail = function(email) {
    // 간단한 이메일 검증 - 완전하지 않음
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

UserController.prototype.updateUserInfo = function() {
    var $userInfo = $('#user-info');
    if (this.currentUser) {
        $userInfo.html(
            '<span>환영합니다, ' + this.currentUser.username + '님</span>' +
            '<button onclick="userController.logout()">로그아웃</button>'
        );
        $('#order-section').show();
    } else {
        $userInfo.html('<span>로그인이 필요합니다.</span>');
        $('#order-section').hide();
    }
};

UserController.prototype.updateUserList = function() {
    var $userList = $('#user-list');
    $userList.empty();
    
    if (this.currentUser && this.currentUser.role === 'admin') {
        $userList.append('<h3>사용자 목록 (관리자 전용)</h3>');
        
        for (var i = 0; i < this.users.length; i++) {
            var user = this.users[i];
            var userHtml = '<div class="user-item">' +
                '<span>' + user.username + ' (' + user.email + ') - ' + user.role + '</span>' +
                '<button onclick="userController.toggleUserStatus(' + user.id + ')">' +
                (user.isActive ? '비활성화' : '활성화') + '</button></div>';
            $userList.append(userHtml);
        }
    }
};

UserController.prototype.logout = function() {
    this.currentUser = null;
    currentUser = null; // 전역 변수 정리
    
    this.updateUserInfo();
    this.clearForm();
    $('#user-list').empty();
    $('#admin-panel').hide();
    this.showSuccess('로그아웃되었습니다.');
};

UserController.prototype.toggleUserStatus = function(userId) {
    // 사용자 상태 토글 - 관리자 기능
    for (var i = 0; i < this.users.length; i++) {
        if (this.users[i].id == userId) {
            this.users[i].isActive = !this.users[i].isActive;
            this.updateUserList();
            break;
        }
    }
};

// UI 관련 메서드들도 UserController에 혼재
UserController.prototype.showError = function(message) {
    alert('오류: ' + message); // alert 사용 - 사용자 경험 나쁨
};

UserController.prototype.showSuccess = function(message) {
    alert('성공: ' + message); // alert 사용
};

UserController.prototype.clearForm = function() {
    $('#username').val('');
    $('#email').val('');
    $('#password').val('');
};

// 전역 함수들 - 네임스페이스 오염
function initApp() {
    // 전역 객체들 초기화
    userController = new UserController();
    orderService = new OrderService();
    
    // 초기 UI 상태 설정
    $('#order-section').hide();
    $('#admin-panel').hide();
    
    // 테스트 데이터 추가
    userController.users.push({
        id: 999,
        username: '테스트관리자',
        email: 'admin@example.com',
        password: 'admin123',
        role: 'admin',
        createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
        isActive: true
    });
}

function handleUserAction(action) {
    var username = $('#username').val();
    var email = $('#email').val();
    var password = $('#password').val();
    
    if (action === 'register') {
        userController.registerUser(username, email, password);
    } else if (action === 'login') {
        userController.loginUser(email, password);
    }
}

function addToOrder() {
    if (!currentUser) {
        alert('로그인이 필요합니다.');
        return;
    }
    
    var productId = $('#product-select').val();
    var quantity = parseInt($('#quantity').val());
    
    if (!productId || !quantity || quantity < 1) {
        alert('상품과 수량을 올바르게 선택해주세요.');
        return;
    }
    
    // 현재 주문에 항목 추가
    var existingItem = null;
    for (var i = 0; i < currentOrder.items.length; i++) {
        if (currentOrder.items[i].productId === productId) {
            existingItem = currentOrder.items[i];
            break;
        }
    }
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        currentOrder.items.push({
            productId: productId,
            quantity: quantity
        });
    }
    
    // 현재 주문 UI 업데이트
    updateCurrentOrderUI();
    
    // 폼 클리어
    $('#product-select').val('');
    $('#quantity').val('');
}

function updateCurrentOrderUI() {
    var $orderItems = $('#order-items');
    $orderItems.empty();
    
    currentOrder.total = 0;
    
    for (var i = 0; i < currentOrder.items.length; i++) {
        var item = currentOrder.items[i];
        var product = products[item.productId];
        var itemTotal = product.price * item.quantity;
        currentOrder.total += itemTotal;
        
        var itemHtml = '<div class="order-item">' +
            '<span>' + product.name + ' x ' + item.quantity + '</span>' +
            '<span>' + itemTotal.toLocaleString() + '원</span>' +
            '<button onclick="removeFromOrder(\'' + item.productId + '\')">제거</button>' +
            '</div>';
        $orderItems.append(itemHtml);
    }
    
    // 할인 적용 (OrderService와 중복 로직)
    var finalTotal = currentOrder.total;
    if (finalTotal > 1000000) {
        finalTotal = finalTotal * 0.95;
    }
    
    $('#order-total').text('총액: ' + finalTotal.toLocaleString() + '원');
    $('#submit-order-btn').prop('disabled', currentOrder.items.length === 0);
}

function removeFromOrder(productId) {
    // 주문에서 항목 제거
    currentOrder.items = currentOrder.items.filter(function(item) {
        return item.productId !== productId;
    });
    updateCurrentOrderUI();
}

function submitOrder() {
    if (!currentUser) {
        alert('로그인이 필요합니다.');
        return;
    }
    
    if (currentOrder.items.length === 0) {
        alert('주문할 상품이 없습니다.');
        return;
    }
    
    // OrderService를 통해 주문 생성
    var order = orderService.createOrder(currentUser.id, currentOrder.items);
    
    if (order) {
        alert('주문이 완료되었습니다. 주문번호: ' + order.id);
        
        // 현재 주문 초기화
        currentOrder = { items: [], total: 0 };
        updateCurrentOrderUI();
    }
}

// 더 많은 전역 함수들...
$(document).ready(function() {
    initApp();
});