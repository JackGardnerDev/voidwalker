document.addEventListener('DOMContentLoaded', () => {
    const audio = document.getElementById('bg-audio');
    const slider = document.getElementById('soundInput');
    const soundLevel = document.getElementById('soundLevel');

    // Retrieve saved volume or default to 25%
    const savedVolume = localStorage.getItem('soundVolume');
    const volume = savedVolume ? parseFloat(savedVolume) : 0.25;

    // Apply volume
    audio.volume = volume;

    // Try playing audio after user interaction
    document.addEventListener('click', () => {
        audio.play().catch(err => console.log('Autoplay blocked:', err));
    }, { once: true });

    // If slider exists on this page
    if (slider && soundLevel) {
        slider.value = volume * 100;
        soundLevel.textContent = `${slider.value}%`;

        // Update text live
        slider.addEventListener('input', () => {
            soundLevel.textContent = `${slider.value}%`;
        });

        // Save new volume on submit
        document.getElementById('soundForm').addEventListener('submit', (e) => {
            e.preventDefault();
            const newVolume = slider.value / 100;
            localStorage.setItem('soundVolume', newVolume);
            audio.volume = newVolume;
        });
    }
});