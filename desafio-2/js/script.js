document.getElementById('actionButton').addEventListener('click', () => {
    // Remove existing particles, if any
    document.querySelectorAll('.particle').forEach(el => el.remove());

    // Select the dedicated particle container
    const container = document.getElementById('particlesContainer');

    // Creates 30 particles with random properties
    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');

        // Sets size between 10px and 30px
        const size = Math.floor(Math.random() * 20) + 10;
        particle.style.width = size + "px";
        particle.style.height = size + "px";

        // Random RGB color
        particle.style.backgroundColor = 'rgb(' +
            Math.floor(Math.random() * 256) + ',' +
            Math.floor(Math.random() * 256) + ',' +
            Math.floor(Math.random() * 256) + ')';

        // Random horizontal position within the window
        particle.style.left = Math.floor(Math.random() * window.innerWidth) + "px";

        // Starts near the vertical center
        particle.style.top = "50%";

        // Randomly chooses between circle or square
        particle.style.borderRadius = Math.random() > 0.5 ? "50%" : "0%";

        // Append the particle to the dedicated container
        container.appendChild(particle);

        // Triggers the animation after a small delay to ensure reflow
        setTimeout(() => {
            particle.classList.add('animate');
        }, 100);

        // Remove the particle once its animation is complete
        particle.addEventListener('animationend', () => {
            particle.remove();
        });
    }
});