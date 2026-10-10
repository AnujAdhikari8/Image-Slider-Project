
const sliderContainer = document.querySelector(".slider-container");
const sliderTrack = document.querySelector(".slider-track");
const prevButton = document.querySelector(".prev-btn");
const nextButton = document.querySelector(".next-btn");
const dotsContainer = document.querySelector(".slider-dots");

const originalImages = Array.from(sliderTrack.children);

let currentIndex = 0;
let isTransitioning = false;

// Create copies of the first and last images
const firstClone = originalImages[0].cloneNode(true);
const lastClone = originalImages[originalImages.length - 1].cloneNode(true);

firstClone.setAttribute("aria-hidden", "true");
lastClone.setAttribute("aria-hidden", "true");

sliderTrack.appendChild(firstClone);
sliderTrack.insertBefore(lastClone, originalImages[0]);

const allSlides = Array.from(sliderTrack.children);
const totalImages = originalImages.length;

// Create navigation dots
originalImages.forEach((image, index) => {
    const dot = document.createElement("button");

    dot.type = "button";
    dot.setAttribute("aria-label", `Go to image ${index + 1}`);

    dot.addEventListener("click", () => {
        if (isTransitioning || index === currentIndex) return;

        currentIndex = index;
        moveToSlide(currentIndex + 1);
        updateDots();
    });

    dotsContainer.appendChild(dot);
});

const dots = Array.from(dotsContainer.children);

// Position the track
function moveToSlide(position, animate = true) {
    sliderTrack.style.transition = animate
        ? "transform 0.5s ease-in-out"
        : "none";

    sliderTrack.style.transform = `translateX(-${position * 100}%)`;
}

function updateDots() {
    dots.forEach((dot, index) => {
        dot.classList.toggle("active", index === currentIndex);
        dot.setAttribute("aria-current",
            index === currentIndex ? "true" : "false");
    });
}

function goToNext() {
    if (isTransitioning) return;

    isTransitioning = true;
    currentIndex++;
    moveToSlide(currentIndex + 1);
    updateDots();
}

function goToPrevious() {
    if (isTransitioning) return;

    isTransitioning = true;
    currentIndex--;
    moveToSlide(currentIndex + 1);
    updateDots();
}

// Next and Previous button events
nextButton.addEventListener("click", goToNext);
prevButton.addEventListener("click", goToPrevious);

// Handle the infinite loop
sliderTrack.addEventListener("transitionend", () => {
    if (currentIndex >= totalImages) {
        currentIndex = 0;
        moveToSlide(1, false);
    } else if (currentIndex < 0) {
        currentIndex = totalImages - 1;
        moveToSlide(totalImages, false);
    }

    updateDots();
    isTransitioning = false;
});

// Initial position
moveToSlide(1, false);
updateDots();

// Recalculate layout if the window is resized
window.addEventListener("resize", () => {
    moveToSlide(currentIndex + 1, false);
});
