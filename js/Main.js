const BACKEND_URL = "https://nyangsiba-backend.onrender.com"; // Render에서 배포된 Flask 서버 URL

document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("guestbook-form");
    const nameInput = document.getElementById("name");
    const messageInput = document.getElementById("message");
    const guestbookList = document.getElementById("guestbook-list");

    function fetchMessages() {
        fetch(`${BACKEND_URL}/messages`)
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

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const name = nameInput.value.trim();
        const message = messageInput.value.trim();

        if (name === "" || message === "") {
            alert("이름과 메세지를 입력해주세요!");
            return;
        }

        fetch(`${BACKEND_URL}/add-message`, {
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

    function confirmDelete(id, listItem) {
        const popup = document.createElement("div");
        popup.classList.add("popup");
        popup.innerHTML = `
            <p>정말 삭제하시겠습니까?</p>
            <button class="confirm-btn">냥</button>
            <button class="cancel-btn">아니냥</button>
        `;

        document.body.appendChild(popup);

        popup.querySelector(".confirm-btn").addEventListener("click", function () {
            fetch(`${BACKEND_URL}/delete-message/${id}`, {
                method: "DELETE"
            })
            .then(() => {
                listItem.remove();
                popup.remove();
                fetchMessages();
            })
            .catch(err => console.error("Error deleting message:", err));
        });

        popup.querySelector(".cancel-btn").addEventListener("click", function () {
            popup.remove();
        });
    }

    fetchMessages();
});
