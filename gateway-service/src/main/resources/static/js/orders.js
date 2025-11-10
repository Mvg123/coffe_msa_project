let orderModal;

document.addEventListener('DOMContentLoaded', function() {
    orderModal = new bootstrap.Modal(document.getElementById('orderModal'));
    loadOrders();
});

async function loadOrders() {
    try {
        const response = await fetch('/api/orders');
        const orders = await response.json();
        
        const tbody = document.getElementById('orderTableBody');
        tbody.innerHTML = '';
        
        orders.forEach(order => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${order.id}</td>
                <td>${order.productId}</td>
                <td>${order.quantity}</td>
                <td>${order.totalPrice.toLocaleString()}원</td>
                <td>${order.customerName}</td>
                <td>${order.customerEmail}</td>
                <td>${new Date(order.orderDate).toLocaleString()}</td>
                <td>${getStatusText(order.status)}</td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="editOrder(${order.id})">수정</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteOrder(${order.id})">삭제</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error('주문 목록을 불러오는데 실패했습니다:', error);
        alert('주문 목록을 불러오는데 실패했습니다.');
    }
}

// [추가] 재고 이력 보기 함수
async function showHistory(id, name) {
    // 1. 모달 제목 설정 및 열기
    document.getElementById('historyModalTitle').textContent = `[${name}] 재고 변경 이력`;
    const tbody = document.getElementById('historyTableBody');
    tbody.innerHTML = '<tr><td colspan="3">불러오는 중...</td></tr>';
    historyModal.show();

    try {
        // 2. 백엔드 API 호출
        const response = await fetch(`/api/stocks/${id}/history`);
        if (!response.ok) throw new Error('이력 조회 실패');

        const historyList = await response.json();
        tbody.innerHTML = ''; // 로딩 메시지 제거

        if (historyList.length === 0) {
            tbody.innerHTML = '<tr><td colspan="3">변경 이력이 없습니다.</td></tr>';
            return;
        }

        // 3. 테이블 내용 채우기
        historyList.forEach(log => {
            const tr = document.createElement('tr');

            // 타임스탬프 포맷팅
            const timestamp = new Date(log.timestamp).toLocaleString('ko-KR');

            // 변경 수량 포맷팅 (+/- 및 색상)
            const change = log.changeAmount > 0 ? `+${log.changeAmount}` : log.changeAmount;
            const color = log.changeAmount > 0 ? 'text-success' : 'text-danger'; // Bootstrap 클래스

            // 사유 텍스트 (한글화)
            let reasonText = log.reason;
            if (log.reason === 'MANUAL_EDIT') reasonText = '수동 변경';
            if (log.reason === 'ORDER_FULFILLED') reasonText = '주문 출고';

            tr.innerHTML = `
                <td>${timestamp}</td>
                <td class="${color}"><strong>${change}</strong></td>
                <td>${reasonText}</td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error('이력을 불러오는데 실패했습니다:', error);
        tbody.innerHTML = '<tr><td colspan="3" class="text-danger">이력을 불러오는데 실패했습니다.</td></tr>';
    }
}


function getStatusText(status) {
    const statusMap = {
        'PENDING': '대기',
        'PROCESSING': '처리중',
        'COMPLETED': '완료'
    };
    return statusMap[status] || status;
}

function showAddOrderModal() {
    document.getElementById('modalTitle').textContent = '주문 추가';
    document.getElementById('orderForm').reset();
    document.getElementById('orderId').value = '';
    orderModal.show();
}

async function editOrder(id) {
    try {
        const response = await fetch(`/api/orders/${id}`);
        const order = await response.json();
        
        document.getElementById('modalTitle').textContent = '주문 수정';
        document.getElementById('orderId').value = order.id;
        document.getElementById('productId').value = order.productId;
        document.getElementById('quantity').value = order.quantity;
        document.getElementById('totalPrice').value = order.totalPrice;
        document.getElementById('customerName').value = order.customerName;
        document.getElementById('customerEmail').value = order.customerEmail;
        document.getElementById('status').value = order.status;
        
        orderModal.show();
    } catch (error) {
        console.error('주문 정보를 불러오는데 실패했습니다:', error);
        alert('주문 정보를 불러오는데 실패했습니다.');
    }
}

async function saveOrder() {
    const id = document.getElementById('orderId').value;
    const order = {
        productId: parseInt(document.getElementById('productId').value),
        quantity: parseInt(document.getElementById('quantity').value),
        totalPrice: parseFloat(document.getElementById('totalPrice').value),
        customerName: document.getElementById('customerName').value,
        customerEmail: document.getElementById('customerEmail').value,
        status: document.getElementById('status').value
    };

    try {
        const url = id ? `/api/orders/${id}` : '/api/orders';
        const method = id ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(order)
        });

        if (!response.ok) {
            throw new Error('저장에 실패했습니다.');
        }

        orderModal.hide();
        loadOrders();
        alert('저장되었습니다.');
    } catch (error) {
        console.error('저장에 실패했습니다:', error);
        alert('저장에 실패했습니다.');
    }
}

async function deleteOrder(id) {
    if (!confirm('정말 삭제하시겠습니까?')) {
        return;
    }

    try {
        const response = await fetch(`/api/orders/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('삭제에 실패했습니다.');
        }

        loadOrders();
        alert('삭제되었습니다.');
    } catch (error) {
        console.error('삭제에 실패했습니다:', error);
        alert('삭제에 실패했습니다.');
    }
} 