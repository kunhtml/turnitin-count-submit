// ==UserScript==
// @name         Đếm Ô Submit Cho Lớp Học Trên Turnitin
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Đếm số ô submit có sẵn và đếm trong 24h có thể submit được bao nhiêu lần
// @author       HieuSTEWIEPhan
// @match        https://www.turnitin.com/class/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    /**
     * Hàm đếm số dòng với <td> thứ hai có lớp 'ibox_portfolio_dates'.
     * @returns {number} - Số dòng phù hợp.
     */
    function countSpecificRows() {
        // Tìm tất cả các dòng `<tr>` trên trang
        const allRows = document.querySelectorAll('tr');
        let specificRowCount = 0;

        allRows.forEach(row => {
            // Tìm `<td>` thứ hai trong dòng hiện tại
            const tds = row.querySelectorAll('td');
            if (tds.length >= 2) {
                const secondTd = tds[1];
                if (secondTd.classList.contains('ibox_portfolio_dates')) {
                    specificRowCount++;
                }
            }
        });

        return specificRowCount;
    }

    /**
     * Hàm đếm số phần tử <span class="type-label">Paper</span>.
     * @returns {number} - Số phần tử phù hợp.
     */
    function countTypeLabelPapers() {
        // Tìm tất cả các phần tử <span> có lớp 'type-label' và nội dung là 'Paper'
        const typeLabels = document.querySelectorAll('span.type-label');
        let paperCount = 0;

        typeLabels.forEach(span => {
            if (span.textContent.trim() === 'Paper') {
                paperCount++;
            }
        });

        return paperCount;
    }

    /**
     * Hàm hiển thị số dòng cụ thể, số phần tử Paper và tổng số.
     * @param {number} specificCount - Số dòng có <td> thứ hai với lớp 'ibox_portfolio_dates'.
     * @param {number} paperCount - Số phần tử <span class="type-label">Paper</span>.
     */
    function displayCounts(specificCount, paperCount) {
        // Tính tổng: (số dòng cụ thể nhân với 3) + số Paper
        const total = (paperCount * 3) ;

        // Tạo phần tử hiển thị số dòng và tổng số
        const infoDiv = document.createElement('div');
        infoDiv.style.backgroundColor = '#e6f7ff';
        infoDiv.style.border = '2px solid #1890ff';
        infoDiv.style.padding = '15px';
        infoDiv.style.margin = '20px';
        infoDiv.style.fontSize = '16px';
        infoDiv.style.fontWeight = 'bold';
        infoDiv.style.borderRadius = '5px';
        infoDiv.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
        infoDiv.innerHTML = `
            <p>Số dòng submit hiện tại là: <span style="color: #1890ff;">${paperCount}</span></p>
            <p>Tổng số lượt bạn có thể submit trong mỗi 24h là: <span style="color: #ff4d4f;">${total}</span></p>
        `;

        // Kiểm tra xem đã có div thông tin trước đó chưa để tránh tạo nhiều lần
        if (document.getElementById('class-row-count-info')) {
            document.getElementById('class-row-count-info').remove();
        }

        // Thêm ID để kiểm tra sau này
        infoDiv.id = 'class-row-count-info';

        // Chèn thông tin vào đầu trang
        document.body.prepend(infoDiv);
    }

    /**
     * Hàm khởi chạy chính để đếm và hiển thị số dòng cụ thể.
     */
    function initialize() {
        const specificCount = countSpecificRows();
        const paperCount = countTypeLabelPapers();
        displayCounts(specificCount, paperCount);
        console.log(`Đã đếm được ${specificCount} ô submit cho Lớp Học và ${paperCount} phần tử <span class="type-label">Paper</span> trong bảng.`);
    }

    /**
     * Đợi cho đến khi toàn bộ nội dung trang đã tải xong.
     */
    window.addEventListener('load', () => {
        // Đợi thêm một thời gian ngắn để đảm bảo các bảng được tải đầy đủ (nếu nội dung được tải động)
        setTimeout(initialize, 2000);
    });

})();
