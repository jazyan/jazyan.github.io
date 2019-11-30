window.onload = function() {
    Particles.init({
        selector: '.background',
        maxParticles: 150,
        sizeVariations: 5,
        speed: 0.25,
        color: ['#FFFFFF', '#00FFFF', '#FF7F50'],
        minDistance: 120,
        connectParticles: true,
        responsive: null,
    });
};