document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("guestbook-form");
    const nameInput = document.getElementById("name");
    const messageInput = document.getElementById("message");
    const guestbookList = document.getElementById("guestbook-list");

    // 📌 1) 방명록 데이터 불러오기
    function fetchMessages() {
        fetch("http://localhost:5000/messages")
            .then(res => res.json())
            .then(data => {
                guestbookList.innerHTML = "";
                data.forEach(entry => {
                    const listItem = document.createElement("li");
                    listItem.innerHTML = `<strong>${entry.name}</strong>: ${entry.message}`;

                    // ❌ 삭제 버튼 추가
                    const deleteButton = document.createElement("button");
                    deleteButton.textContent = "❌";
                    deleteButton.classList.add("delete-btn");
                    deleteButton.addEventListener("click", function () {
                        confirmDelete(entry.id, listItem);
                    });

                    listItem.appendChild(deleteButton);
                    guestbookList.appendChild(listItem);
                });
            })
            .catch(err => console.error("Error fetching messages:", err));
    }

    // 📌 2) 새로운 방명록 추가하기
    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const name = nameInput.value.trim();
        const message = messageInput.value.trim();

        if (name === "" || message === "") {
            alert("이름과 메세지를 입력해주세요!");
            return;
        }

        fetch("http://localhost:5000/add-message", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, message })
        })
        .then(res => res.json())
        .then(() => {
            nameInput.value = "";
            messageInput.value = "";
            fetchMessages(); // 새로고침 없이 목록 업데이트
        })
        .catch(err => console.error("Error adding message:", err));
    });

    // 📌 3) 삭제 확인 팝업 함수
    function confirmDelete(id, listItem) {
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
            fetch(`http://localhost:5000/delete-message/${id}`, {
                method: "DELETE"
            })
            .then(() => {
                listItem.remove();
                popup.remove();
            })
            .catch(err => console.error("Error deleting message:", err));
        });

        // "아니냥" 버튼 클릭 시 팝업 닫기
        popup.querySelector(".cancel-btn").addEventListener("click", function () {
            popup.remove();
        });
    }

    fetchMessages();
});
