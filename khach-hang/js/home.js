
// Chuyển ảnh banner
const slides = document.querySelectorAll(".hero-slider img");

let currentSlide = 0;

function changeSlide() {
    if (!slides.length) return;

    slides[currentSlide].classList.remove("active");
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add("active");
}

// Tự động chuyển ảnh sau mỗi 4 giây
if (slides.length > 1) {
    setInterval(changeSlide, 4000);
}

// FR-12 và FR-13: Lọc và sắp xếp xe
const vehicleSection = document.querySelector(".vehicles");

if (vehicleSection) {
    const filterSidebar = vehicleSection.querySelector(".filter-sidebar");
    const filterToggle = vehicleSection.querySelector(".mobile-filter-toggle");
    const filterOverlay = vehicleSection.querySelector(".filter-overlay");
    const resetButton = vehicleSection.querySelector(".btn-reset");
    const sortSelect = vehicleSection.querySelector("#vehicle-sort");
    const vehicleGrid = vehicleSection.querySelector(".vehicle-grid");
    const emptyMessage = vehicleSection.querySelector(".vehicle-empty");

    const originalCards = Array.from(
        vehicleGrid.querySelectorAll(".vehicle-card")
    );

    // Lấy thông tin xe
    function getCardData(card) {
        const typeText = card.querySelector(".vehicle-type")?.textContent.trim().toLowerCase() || "";
        const title = card.querySelector(".vehicle-title h3")?.textContent.trim().toLowerCase() || "";
        const specs = card.querySelector(".vehicle-specs")?.textContent.toLowerCase() || "";
        const ratingText = card.querySelector(".rating")?.textContent || "";
        const priceText = card.querySelector(".vehicle-price")?.textContent || "";

        const place = specs.includes("hà nội") ? "ha-noi"
            : specs.includes("tp.hcm") ? "hcm"
                : specs.includes("đà nẵng") ? "da-nang"
                    : specs.includes("vũng tàu") ? "vung-tau" : "";

        let type = "xe-may";

        if (typeText.includes("ô tô")) {
            type = "o-to";
        } else if (typeText.includes("xe điện")) {
            type = "xe-dien";
        }

        const brand = title.includes("honda") ? "honda"
            : title.includes("yamaha") ? "yamaha"
                : title.includes("vinfast") ? "vinfast" : "";

        return {
            type: type,
            brand: brand,
            place: place,
            price: Number(priceText.replace(/[^0-9]/g, "")) || 0,
            rating: Number((ratingText.match(/[0-9]+(?:[.,][0-9]+)?/) || ["0"])[0].replace(",", ".")),
            delivery: (card.dataset.delivery || "").split(",")
        };
    }

    // Lấy các giá trị đang được chọn
    function selectedValues(name) {
        return Array.from(
            vehicleSection.querySelectorAll(`input[name="${name}"]:checked`)
        ).map(input => input.value);
    }

    // FR-12: Lọc xe
    function filterVehicles() {
        const types = selectedValues("type");
        const places = selectedValues("place");
        const brands = selectedValues("brand");
        const deliveries = selectedValues("delivery");

        const price = vehicleSection.querySelector('input[name="price"]:checked')?.value || "";

        const minRating = Number(
            vehicleSection.querySelector('input[name="rating-filter"]:checked')?.value || 0
        );

        let visibleCount = 0;

        originalCards.forEach(card => {
            const data = getCardData(card);
            let matches = true;

            if (types.length && !types.includes(data.type)) {
                matches = false;
            }

            if (places.length && !places.includes(data.place)) {
                matches = false;
            }

            if (brands.length && !brands.includes(data.brand)) {
                matches = false;
            }

            if (deliveries.length && !deliveries.some(value => data.delivery.includes(value))) {
                matches = false;
            }

            if (price === "under-200" && data.price >= 200000) {
                matches = false;
            }

            if (price === "200-400" && (data.price < 200000 || data.price > 400000)) {
                matches = false;
            }

            if (price === "over-400" && data.price <= 400000) {
                matches = false;
            }

            if (minRating && data.rating < minRating) {
                matches = false;
            }

            card.hidden = !matches;

            if (matches) {
                visibleCount++;
            }
        });

        emptyMessage.hidden = visibleCount > 0;

        sortVehicles();
    }

    // FR-13: Sắp xếp xe
    function sortVehicles() {
        const sortType = sortSelect.value;

        const visibleCards = originalCards.filter(card => !card.hidden);
        const hiddenCards = originalCards.filter(card => card.hidden);

        if (sortType === "price-asc") {
            visibleCards.sort((a, b) =>
                getCardData(a).price - getCardData(b).price
            );
        }

        else if (sortType === "price-desc") {
            visibleCards.sort((a, b) =>
                getCardData(b).price - getCardData(a).price
            );
        }

        else if (sortType === "rating-desc") {
            visibleCards.sort((a, b) =>
                getCardData(b).rating - getCardData(a).rating
            );
        }

        else if (sortType === "distance-asc") {
            if (window.showToast) {
                window.showToast("Chưa thể sắp xếp theo khoảng cách vì dữ liệu xe hiện chưa có tọa độ.");
            }
            return;
        }

        [...visibleCards, ...hiddenCards].forEach(card => {
            vehicleGrid.appendChild(card);
        });
    }

    // Đặt lại bộ lọc
    function resetFilters() {
        vehicleSection.querySelectorAll(".filter-sidebar input").forEach(input => {
            input.checked = false;
        });

        sortSelect.value = "default";

        filterVehicles();
    }

    // Đóng Bottom Sheet
    function closeFilterSheet() {
        filterSidebar.classList.remove("is-open");
        filterOverlay.classList.remove("is-visible");
        document.body.classList.remove("filter-open");

        filterToggle.setAttribute("aria-expanded", "false");
    }

    // Mở Bottom Sheet trên điện thoại
    filterToggle.addEventListener("click", () => {
        filterSidebar.classList.add("is-open");
        filterOverlay.classList.add("is-visible");
        document.body.classList.add("filter-open");

        filterToggle.setAttribute("aria-expanded", "true");
    });

    // Bấm bên ngoài để đóng
    filterOverlay.addEventListener("click", closeFilterSheet);

    // Sự kiện đặt lại
    resetButton.addEventListener("click", resetFilters);

    // Sự kiện lọc
    vehicleSection.querySelectorAll(".filter-sidebar input").forEach(input => {
        input.addEventListener("change", filterVehicles);
    });

    // Sự kiện sắp xếp
    sortSelect.addEventListener("change", sortVehicles);

    filterVehicles();
}


// Lưu thông tin xe khi khách bấm Đặt cọc
document.querySelectorAll(".btn-deposit").forEach(function (button) {
    button.addEventListener("click", function (event) {
        event.preventDefault();

        const vehicleCard = button.closest(".vehicle-card");

        const vehicleName = vehicleCard.querySelector(".vehicle-title h3").textContent.trim();
        const vehicleType = vehicleCard.querySelector(".vehicle-type").textContent.trim();
        const vehicleRating = vehicleCard.querySelector(".rating").textContent.trim();
        const vehicleSpecs = vehicleCard.querySelector(".vehicle-specs").textContent.trim();
        const vehiclePrice = vehicleCard.querySelector(".vehicle-price").textContent.trim();
        const vehicleImage = vehicleCard.querySelector(".vehicle-image img").src;

        sessionStorage.setItem("selectedVehicleName", vehicleName);
        sessionStorage.setItem("selectedVehicleType", vehicleType);
        sessionStorage.setItem("selectedVehicleRating", vehicleRating);
        sessionStorage.setItem("selectedVehicleSpecs", vehicleSpecs);
        sessionStorage.setItem("selectedVehiclePrice", vehiclePrice);
        sessionStorage.setItem("selectedVehicleImage", vehicleImage);

        if (window.motogoNavigate) { window.motogoNavigate(button.href); } else { window.location.href = button.href; }
    });
});

