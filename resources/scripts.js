// Set dynamic hero height

function setDynamicHeroHeight() {
    const header = document.querySelector('header');
    const clients = document.querySelector('.clients');
    const headerHeight = header ? header.offsetHeight : 0;
    const clientsHeight = clients ? clients.offsetHeight : 0;
    document.documentElement.style.setProperty('--header-height', headerHeight + 'px');
    document.documentElement.style.setProperty('--clients-height', clientsHeight + 'px');
}
window.addEventListener('resize', setDynamicHeroHeight);
window.addEventListener('DOMContentLoaded', setDynamicHeroHeight);

// Script pour une animation marquee parfaitement seamless
document.addEventListener('DOMContentLoaded', function() {
    const marquee = document.querySelector('.clients-marquee');
    
    if (marquee) {
        // Attendre que toutes les images soient chargées
        const images = marquee.querySelectorAll('img');
        let loadedImages = 0;
        
        function checkAllImagesLoaded() {
            loadedImages++;
            if (loadedImages === images.length) {
                // Toutes les images sont chargées, ajuster l'animation
                adjustMarqueeAnimation();
            }
        }
        
        // Écouter le chargement de chaque image
        images.forEach(img => {
            if (img.complete) {
                checkAllImagesLoaded();
            } else {
                img.addEventListener('load', checkAllImagesLoaded);
                img.addEventListener('error', checkAllImagesLoaded); // En cas d'erreur aussi
            }
        });
        
        function adjustMarqueeAnimation() {
            // Calculer la largeur exacte du premier ensemble d'éléments
            const firstSet = marquee.children.length / 2;
            let firstSetWidth = 0;
            
            for (let i = 0; i < firstSet; i++) {
                const element = marquee.children[i];
                firstSetWidth += element.offsetWidth;
                if (i < firstSet - 1) {
                    firstSetWidth += 48; // Gap
                }
            }
            
            // Ajuster l'animation CSS avec la largeur exacte
            marquee.style.setProperty('--marquee-width', `${firstSetWidth}px`);
            
            // Créer une animation CSS personnalisée
            const style = document.createElement('style');
            style.textContent = `
                @keyframes marqueeSeamless {
                    0% {
                        transform: translateX(0) translateZ(0);
                    }
                    100% {
                        transform: translateX(-${firstSetWidth}px) translateZ(0);
                    }
                }
                .clients-marquee {
                    animation: marqueeSeamless 25s linear infinite !important;
                }
            `;
            document.head.appendChild(style);
        }
    }
}); 