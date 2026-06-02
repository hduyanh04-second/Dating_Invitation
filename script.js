document.addEventListener("DOMContentLoaded", () => {
    // ---- BIẾN LƯU TRỮ DỮ LIỆU ----
    let selectedDate = "";
    let selectedActivity = "";
    let selectedFoods = [];

    // ---- CÁC HÀM TIỆN ÍCH ----
    // Chuyển đổi giữa các section
    function switchSection(fromId, toId) {
        document.getElementById(`section-${fromId}`).classList.add("hidden");
        document.getElementById(`section-${toId}`).classList.remove("hidden");
        document.getElementById(`section-${toId}`).classList.add("active");
    }

    // Hiển thị và Cập nhật thanh Progress Bar
    function updateProgress(step) {
        const progressBar = document.getElementById("progress-bar");
        if (step > 0) {
            progressBar.classList.remove("hidden");
        }
        
        // Sáng tim
        document.getElementById(`heart-${step}`).classList.add("glowing");
        // Sáng line (nếu có line trước đó)
        if (step > 1) {
            document.getElementById(`line-${step - 1}`).classList.add("glowing");
        }
    }

    // ---- LOGIC: TRANG ĐẦU -> NÚT NO DI CHUYỂN ----
    const btnNo = document.getElementById("btn-no");
    // Tạo 3 tọa độ (x, y) để nút No nhảy tới
    const noPositions = [
        { x: 120, y: -60 },
        { x: -120, y: 80 },
        { x: 100, y: 100 }
    ];
    let positionIndex = 0;

    btnNo.addEventListener("mouseover", () => {
        // Áp dụng transform để di chuyển mượt mà mà không làm vỡ layout (position absolute đôi khi gây lệch)
        btnNo.style.transform = `translate(${noPositions[positionIndex].x}px, ${noPositions[positionIndex].y}px)`;
        // Tăng index để lần hover sau nhảy ra chỗ khác
        positionIndex = (positionIndex + 1) % noPositions.length; 
    });

    // ---- LOGIC CHUYỂN TRANG ----
    
    // Nút YES ở intro (0 -> 1)
    document.getElementById("btn-yes").addEventListener("click", () => {
        switchSection(0, 1);
        updateProgress(1); // Tim 1 sáng
    });

    // Nút Continue ở section 1 (1 -> 2)
    document.getElementById("btn-continue-1").addEventListener("click", () => {
        switchSection(1, 2);
        updateProgress(2); // Tim 2 sáng, Line 1 sáng
    });

    // Nút Continue ở section 2 (2 -> 3)
    document.getElementById("btn-continue-2").addEventListener("click", () => {
        // Lấy dữ liệu
        selectedDate = document.getElementById("date-picker").value;
        selectedActivity = document.getElementById("activity-picker").value;
        
        // Validation nhỏ (Tùy chọn: bạn có thể bắt buộc người ta phải chọn)
        if(!selectedDate) selectedDate = "Any day you want";
        if(!selectedActivity) selectedActivity = "Anytime";

        switchSection(2, 3);
        updateProgress(3); // Tim 3 sáng, Line 2 sáng
    });

    // ---- LOGIC: CHỌN ĐỒ ĂN ----
    const foodCards = document.querySelectorAll(".food-card");
    foodCards.forEach(card => {
        card.addEventListener("click", () => {
            // Toggle class selected để đổi viền (CSS)
            card.classList.toggle("selected");
            const foodName = card.getAttribute("data-food");
            
            // Nếu card đang được chọn thì push vào mảng, nếu bỏ chọn thì xóa khỏi mảng
            if (card.classList.contains("selected")) {
                selectedFoods.push(foodName);
            } else {
                selectedFoods = selectedFoods.filter(item => item !== foodName);
            }
        });
    });

    // Nút Continue ở section 3 (3 -> 4) - TỔNG KẾT
    document.getElementById("btn-continue-3").addEventListener("click", () => {
        switchSection(3, 4);
        updateProgress(4); // Tim 4 sáng, Line 3 sáng

        // Xử lý hiển thị ngày giờ
        const dateTimeDisplay = `${selectedDate} | ${selectedActivity}`;
        document.getElementById("summary-date-time").textContent = dateTimeDisplay;

        // Xử lý hiển thị món ăn
        let foodDisplay = selectedFoods.length > 0 ? selectedFoods.join(", ") : "You decide!";
        document.getElementById("summary-food").textContent = foodDisplay;
    });

    // ---- LOGIC: COPY TEXT ----
    document.getElementById("btn-copy").addEventListener("click", () => {
        const textToCopy = `Yes! I will go on a date with you. \n📅 Date: ${selectedDate} \n⏰ Time/Plan: ${selectedActivity} \n🍴 Food: ${selectedFoods.join(", ")}`;
        
        navigator.clipboard.writeText(textToCopy).then(() => {
            const btnCopy = document.getElementById("btn-copy");
            btnCopy.textContent = "Copied! Now text me 💕";
            btnCopy.style.backgroundColor = "#4caf50"; // Đổi màu xanh lá báo thành công
        }).catch(err => {
            alert("Oops, unable to copy. Please manually copy the plan!");
        });
    });
});