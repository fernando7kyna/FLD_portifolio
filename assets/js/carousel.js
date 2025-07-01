document.addEventListener('DOMContentLoaded', function() {
    const track = document.querySelector('.carousel-track');
    const items = document.querySelectorAll('.carousel-item');
    const prevButton = document.querySelector('.carousel-button.prev');
    const nextButton = document.querySelector('.carousel-button.next');
    const dotsContainer = document.querySelector('.carousel-dots');

    let currentIndex = 0;
    let isDragging = false;
    let startPos = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;

    // Criar pontos de navegação
    items.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('carousel-dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });

    // Atualizar pontos de navegação
    function updateDots() {
        const dots = document.querySelectorAll('.carousel-dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }

    // Ir para um slide específico
    function goToSlide(index) {
        currentIndex = index;
        const slideWidth = items[0].offsetWidth;
        currentTranslate = -slideWidth * currentIndex;
        prevTranslate = currentTranslate;
        setSliderPosition();
        updateDots();
    }

    // Configurar posição do slider
    function setSliderPosition() {
        track.style.transform = `translateX(${currentTranslate}px)`;
    }

    // Botões de navegação
    prevButton.addEventListener('click', () => {
        if (currentIndex <= 0) return;
        goToSlide(currentIndex - 1);
    });

    nextButton.addEventListener('click', () => {
        if (currentIndex >= items.length - 1) return;
        goToSlide(currentIndex + 1);
    });

    // Touch events
    track.addEventListener('touchstart', touchStart);
    track.addEventListener('touchmove', touchMove);
    track.addEventListener('touchend', touchEnd);

    function touchStart(event) {
        isDragging = true;
        startPos = event.touches[0].clientX;
    }

    function touchMove(event) {
        if (!isDragging) return;
        const currentPosition = event.touches[0].clientX;
        const diff = currentPosition - startPos;
        currentTranslate = prevTranslate + diff;
        setSliderPosition();
    }

    function touchEnd() {
        isDragging = false;
        const slideWidth = items[0].offsetWidth;
        const diff = currentTranslate - prevTranslate;
        
        if (Math.abs(diff) > slideWidth / 3) {
            if (diff > 0 && currentIndex > 0) {
                goToSlide(currentIndex - 1);
            } else if (diff < 0 && currentIndex < items.length - 1) {
                goToSlide(currentIndex + 1);
            } else {
                goToSlide(currentIndex);
            }
        } else {
            goToSlide(currentIndex);
        }
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            if (currentIndex > 0) goToSlide(currentIndex - 1);
        } else if (e.key === 'ArrowRight') {
            if (currentIndex < items.length - 1) goToSlide(currentIndex + 1);
        }
    });

    // Auto play (opcional)
    let autoPlayInterval;
    function startAutoPlay() {
        autoPlayInterval = setInterval(() => {
            if (currentIndex >= items.length - 1) {
                goToSlide(0);
            } else {
                goToSlide(currentIndex + 1);
            }
        }, 5000); // Muda a cada 5 segundos
    }

    function stopAutoPlay() {
        clearInterval(autoPlayInterval);
    }

    // Iniciar autoplay
    startAutoPlay();

    // Parar autoplay quando o usuário interagir
    track.addEventListener('mouseenter', stopAutoPlay);
    track.addEventListener('mouseleave', startAutoPlay);
    track.addEventListener('touchstart', stopAutoPlay);
    track.addEventListener('touchend', startAutoPlay);
}); 