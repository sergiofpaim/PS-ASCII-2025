document.getElementById("footer-text").innerHTML = `© ${new Date().getFullYear()} By Sérgio F. Paim, All Rights Reserved`;

function openModal() {
    document.getElementById("myModal").style.display = "block";
}

function closeModal() {
    document.getElementById("myModal").style.display = "none";
}

window.onclick = function (event) {
    if (event.target === document.getElementById("myModal")) {
        closeModal();
    }
}