// Example script to dynamically load pins
document.addEventListener("DOMContentLoaded", () => {
    const pinGallery = document.getElementById("pin-gallery");

    // Mock data for pins
    const pins = [
        { id: 1, title: "Pin 1", image: "images/pin1.jpg" },
        { id: 2, title: "Pin 2", image: "images/pin2.jpg" },
        { id: 3, title: "Pin 3", image: "images/pin3.jpg" },
    ];

    // Function to display pins
    pins.forEach((pin) => {
        const pinDiv = document.createElement("div");
        pinDiv.innerHTML = `
            <img src="${pin.image}" alt="${pin.title}" style="width:100%">
            <p>${pin.title}</p>
        `;
        pinGallery.appendChild(pinDiv);
    });
});
