document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("guestbook-form");
    const nameInput = document.getElementById("name");
    const messageInput = document.getElementById("message");
    const guestbookList = document.getElementById("guestbook-list");

    form.addEventListener("submit", function (event) {
        event.preventDefault(); // 새로고침 방지

        const name = nameInput.value.trim();
        const message = messageInput.value.trim();

        if (name === "" || message === "") {
            alert("이름과 메세지를 입력해주세요!");
            return;
        }

        // 새로운 방명록 항목 추가
        const listItem = document.createElement("li");
        listItem.innerHTML = `<strong>${name}</strong>: ${message}`;
        guestbookList.appendChild(listItem);

        // ❌ 삭제 버튼 추가
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "❌";
        deleteButton.classList.add("delete-btn");
        deleteButton.addEventListener("click", function () {
            confirmDelete(listItem);
        });

        listItem.appendChild(deleteButton);
        guestbookList.appendChild(listItem);

        nameInput.value = "";
        messageInput.value = "";
    });

    // 삭제 확인 팝업 함수
    function confirmDelete(listItem) {
        const popup = document.createElement("div");
        popup.classList.add("popup");
        popup.innerHTML = `
            <p>정말 삭제하시겠습니까?</p>
            <button class="confirm-btn">냥</button>
            <button class="cancel-btn">아니냥</button>
        `;

        document.body.appendChild(popup);

        // "냥" 버튼 클릭 시 삭제
        popup.querySelector(".confirm-btn").addEventListener("click", function () {
            listItem.remove();
            popup.remove();
        });

        // "취소" 버튼 클릭 시 팝업 닫기
        popup.querySelector(".cancel-btn").addEventListener("click", function () {
            popup.remove();
        });
    }
});
