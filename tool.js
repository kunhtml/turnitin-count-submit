// ==UserScript==
// @name         Đếm Số Ô Có Thể Submit Trong Bảng trên Turnitin
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Đếm số ô có thể submit trong bảng trên Turnitin và tính tổng bằng cách nhân với 3
// @author       Bạn
// @match        https://www.turnitin.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    /**
     * Hàm đếm số dòng cụ thể trong bảng dựa trên cấu trúc `<tr>` được cung cấp.
     * @returns {number} - Số dòng phù hợp.
     */
    function countSpecificRows() {
        // Tìm tất cả các dòng `<tr>` trên trang
        const allRows = document.querySelectorAll('tr');
        let specificRowCount = 0;

        allRows.forEach(row => {
            // Tìm `<td>` thứ hai trong dòng hiện tại
            const secondTd = row.querySelectorAll('td')[1];
            if (secondTd && secondTd.classList.contains('ibox_portfolio_dates')) {
                specificRowCount++;
            }
        });

        return specificRowCount;
    }

    /**
     * Hàm hiển thị số ô có thể submit và tổng số sau khi nhân với 3.
     * @param {number} count - Số ô đã đếm.
     */
    function displayRowCount(count) {
        // Tính tổng bằng cách nhân số ô với 3
        const total = count * 3;

        // Tạo phần tử hiển thị số ô và tổng số
        const infoDiv = document.createElement('div');
        infoDiv.style.backgroundColor = '#e6f7ff';
        infoDiv.style.border = '2px solid #1890ff';
        infoDiv.style.padding = '10px';
        infoDiv.style.margin = '20px';
        infoDiv.style.fontSize = '16px';
        infoDiv.style.fontWeight = 'bold';
        infoDiv.style.borderRadius = '5px';
        infoDiv.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
        infoDiv.innerHTML = `
            <p>Số ô có thể submit là: <span style="color: #1890ff;">${count}</span></p>
            <p>Tổng là: <span style="color: #1890ff;">${total} lần submit trong 24h</span></p>
        `;

        // Chèn thông tin vào đầu trang hoặc vị trí bạn mong muốn
        document.body.prepend(infoDiv);
    }

    /**
     * Hàm khởi chạy chính để đếm và hiển thị số dòng cụ thể.
     */
    function initialize() {
        const count = countSpecificRows();
        displayRowCount(count);
        console.log(`Đã đếm được ${count} ô có thể submit trong bảng.`);
    }

    /**
     * Đợi cho đến khi toàn bộ nội dung trang đã tải xong.
     */
    window.addEventListener('load', () => {
        // Đợi thêm một thời gian ngắn để đảm bảo các bảng được tải đầy đủ (nếu nội dung được tải động)
        setTimeout(initialize, 2000);
    });

})();
