document.addEventListener("DOMContentLoaded", () => {
    let selectedDate = "";
    let selectedActivity = "";
    let selectedFoods = [];

    // Chuyển đổi giữa các section
    function switchSection(fromId, toId) {
        document.getElementById(`section-${fromId}`).classList.add("hidden");
        document.getElementById(`section-${toId}`).classList.remove("hidden");
        document.getElementById(`section-${toId}`).classList.add("active");
    }

    // Hiển thị và Cập nhật thanh Progress Bar (Đi tới)
    function updateProgress(step) {
        const progressBar = document.getElementById("progress-bar");
        if (step > 0) progressBar.classList.remove("hidden");
        
        document.getElementById(`heart-${step}`).classList.add("glowing");
        if (step > 1) {
            document.getElementById(`line-${step - 1}`).classList.add("glowing");
        }
    }

    // Tắt đèn thanh Progress Bar (Đi lùi)
    function reverseProgress(step) {
        // Tắt tim hiện tại
        document.getElementById(`heart-${step}`).classList.remove("glowing");
        // Tắt line ở phía trước nó (nếu có)
        if (step > 1) {
            document.getElementById(`line-${step - 1}`).classList.remove("glowing");
        }
        // Nếu lùi về section 0 (trang đầu) thì giấu luôn cả thanh progress
        if (step === 1) {
            document.getElementById("progress-bar").classList.add("hidden");
        }
    }

    // ---- LOGIC: TRANG ĐẦU -> NÚT NO DI CHUYỂN ----
    const btnNo = document.getElementById("btn-no");
    const noPositions = [
        { x: 120, y: -60 },
        { x: -120, y: 80 },
        { x: 100, y: 100 }
    ];
    let positionIndex = 0;

    btnNo.addEventListener("mouseover", () => {
        btnNo.style.transform = `translate(${noPositions[positionIndex].x}px, ${noPositions[positionIndex].y}px)`;
        positionIndex = (positionIndex + 1) % noPositions.length; 
    });

    // ---- LOGIC CHUYỂN TRANG: ĐI TIẾP ----
    
    // Nút YES
    document.getElementById("btn-yes").addEventListener("click", () => {
        switchSection(0, 1);
        updateProgress(1); 
    });

    // Nút Continue 1
    document.getElementById("btn-continue-1").addEventListener("click", () => {
        switchSection(1, 2);
        updateProgress(2); 
    });

    // ---- LOGIC CUSTOM POPUP ----
    const customPopup = document.getElementById("custom-popup");
    const popupMessage = document.getElementById("popup-message");
    const btnClosePopup = document.getElementById("btn-close-popup");

    // Hàm hiển thị Popup
    function showPopup(message) {
        popupMessage.textContent = message;      // Gắn nội dung chữ
        customPopup.classList.remove("hidden");  // Hiển thị khung popup
    }

    // Nút đóng Popup
    btnClosePopup.addEventListener("click", () => {
        customPopup.classList.add("hidden");
    });

    // ---- NÚT CONTINUE 2 (Đã thay alert) ----
    document.getElementById("btn-continue-2").addEventListener("click", () => {
        selectedDate = document.getElementById("date-picker").value;
        selectedActivity = document.getElementById("activity-picker").value;
        
        // Validation: Sử dụng hàm showPopup thay cho alert
        if (!selectedDate || !selectedActivity) {
            showPopup("Please pick a date and an activity so I can prepare! 🥰");
            return; 
        }

        switchSection(2, 3);
        updateProgress(3); 
    });

    // ---- LOGIC: CHỌN ĐỒ ĂN ----
    const foodCards = document.querySelectorAll(".food-card");
    foodCards.forEach(card => {
        card.addEventListener("click", () => {
            card.classList.toggle("selected");
            const foodName = card.getAttribute("data-food");
            
            if (card.classList.contains("selected")) {
                selectedFoods.push(foodName);
            } else {
                selectedFoods = selectedFoods.filter(item => item !== foodName);
            }
        });
    });

    // ---- NÚT CONTINUE 3 (Đã thay alert) ----
    document.getElementById("btn-continue-3").addEventListener("click", () => {
        // Validation: Sử dụng hàm showPopup thay cho alert
        if (selectedFoods.length === 0) {
            showPopup("Please select at least one thing you'd like to eat! 🍔");
            return; 
        }

        switchSection(3, 4);
        updateProgress(4); 

        const dateTimeDisplay = `${selectedDate} | ${selectedActivity}`;
        document.getElementById("summary-date-time").textContent = dateTimeDisplay;
        document.getElementById("summary-food").textContent = selectedFoods.join(", ");
    });

    // ---- LOGIC CHUYỂN TRANG: ĐI LÙI (BACK BUTTONS) ----
    
    document.getElementById("btn-back-1").addEventListener("click", () => {
        switchSection(1, 0);
        reverseProgress(1); // Tắt tim 1
    });

    document.getElementById("btn-back-2").addEventListener("click", () => {
        switchSection(2, 1);
        reverseProgress(2); // Tắt tim 2, line 1
    });

    document.getElementById("btn-back-3").addEventListener("click", () => {
        switchSection(3, 2);
        reverseProgress(3); // Tắt tim 3, line 2
    });

    // ---- LOGIC: COPY TEXT ----
    document.getElementById("btn-copy").addEventListener("click", () => {
        const textToCopy = `Yes! I will go on a date with you. \n📅 Date: ${selectedDate} \n⏰ Time/Plan: ${selectedActivity} \n🍴 Food: ${selectedFoods.join(", ")}`;
        
        navigator.clipboard.writeText(textToCopy).then(() => {
            const btnCopy = document.getElementById("btn-copy");
            btnCopy.textContent = "Copied! Now text me 💕";
            btnCopy.style.backgroundColor = "#4caf50"; 
        }).catch(err => {
            // Thay alert nếu copy lỗi
            showPopup("Oops, unable to copy. Please manually copy the plan!");
        });
    });

    document.getElementById("btn-back-3").addEventListener("click", () => {
        switchSection(3, 2);
        reverseProgress(3); // Tắt tim 3, line 2
    });

    // Thêm logic cho nút Back cuối cùng (Section 4 về Section 3)
    document.getElementById("btn-back-4").addEventListener("click", () => {
        switchSection(4, 3);
        reverseProgress(4); // Tắt tim 4, line 3
    });
});