document.addEventListener('DOMContentLoaded', function() {
    // Reorganize the DOM for two-column layout
    setupTwoColumnLayout();

    // Initialize the scroll animations
    initScrollAnimations();

    // Create overlay for expanded cards
    createOverlay();

    // Initialize card expansion functionality
    initCardExpansion();

    // Initialize sequential navigation
    initSequentialNavigation();
});

/**
 * Reorganizes the DOM elements to create a two-column layout
 */
function setupTwoColumnLayout() {
    const container = document.querySelector('.infographic-container');
    const title = document.querySelector('h1');
    const intro = document.querySelector('.intro-paragraph');
    const sections = document.querySelectorAll('.infographic-section');
    const robot = document.querySelector('.robot-mascot');
    const reference = document.querySelector('.reference');

    // Add classes for grid layout
    title.classList.add('page-title');

    // Create column containers
    const column1 = document.createElement('div');
    column1.className = 'column-1';

    const column2 = document.createElement('div');
    column2.className = 'column-2';

    // Add summary to first column
    const summary = document.createElement('div');
    summary.className = 'infographic-section bg-card-summary';
    summary.innerHTML = `
        <div class="text-content">
            <p>El mundo del arte siempre ha evolucionado, absorbiendo nuevas herramientas y visiones a lo largo de la historia.
            Sin embargo, la irrupción acelerada de la tecnología digital, y en particular la Inteligencia Artificial, presenta hoy un punto de inflexión radical, desafiando nuestras nociones de creatividad y autoría.
            ¿Cómo están exactamente estas fuerzas tecnológicas redefiniendo el proceso creativo, la producción, la difusión e incluso el análisis del arte?.
            Esta infografía explora esta fascinante <span class="highlight">intersección</span>, comenzando por la visión del artista Joaquín Restrepo sobre la integración fundamental entre arte y tecnología y el vertiginoso ritmo de cambio que enfrentamos.</p>
        </div>
    `;

    column1.appendChild(summary);

    // Move sections to second column
    sections.forEach(section => {
        column2.appendChild(section);
    });

    // Clear container and rebuild structure
    while (container.children.length > 2) { // Keep title and intro
        container.removeChild(container.lastChild);
    }

    // Add footer class to reference for grid layout
    reference.classList.add('footer');

    // Clone the robot and add it to the footer
    const robotClone = robot.cloneNode(true);
    reference.appendChild(robotClone);

    container.appendChild(column1);
    container.appendChild(column2);
    container.appendChild(reference);

    // Remove the original robot
    if (robot.parentNode) {
        robot.parentNode.removeChild(robot);
    }
}

/**
 * Initializes the scroll animations for the cards
 */
function initScrollAnimations() {
    const sections = document.querySelectorAll('.infographic-section');

    // Initial check for elements in viewport
    checkVisibility(sections);

    // Check on scroll
    window.addEventListener('scroll', function() {
        checkVisibility(sections);
    });
}

/**
 * Checks if elements are in the viewport and adds/removes the 'visible' class
 */
function checkVisibility(elements) {
    elements.forEach(element => {
        const position = element.getBoundingClientRect();

        // Check if element is in viewport
        if (position.top < window.innerHeight * 0.9 && position.bottom >= 0) {
            element.classList.add('visible');
        } else {
            // Optional: remove the class when element is out of viewport
            // element.classList.remove('visible');
        }
    });
}

/**
 * Creates an overlay for expanded cards
 */
function createOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    document.body.appendChild(overlay);

    // Close expanded card when clicking on overlay
    overlay.addEventListener('click', function() {
        // Close any expanded mini card (old method)
        const expandedCard = document.querySelector('.infographic-section.expanded');
        if (expandedCard) {
            expandedCard.classList.remove('expanded');
        }

        // Close any active full card (new method)
        const activeCard = document.querySelector('.full-card.active');
        if (activeCard) {
            activeCard.classList.remove('active');

            // Get the current active miniature card
            const currentMiniCard = document.querySelector('.column-2 .infographic-section.active-card');
            if (currentMiniCard) {
                // Deactivate current card
                currentMiniCard.classList.remove('active-card');

                // Activate next card if it exists, or first card if this is the last one
                const nextMiniCard = currentMiniCard.nextElementSibling;
                if (nextMiniCard && nextMiniCard.classList.contains('infographic-section')) {
                    nextMiniCard.classList.add('active-card');
                } else {
                    // If there's no next card, activate the first one (circular navigation)
                    const firstMiniCard = document.querySelector('.column-2 .infographic-section');
                    if (firstMiniCard) {
                        firstMiniCard.classList.add('active-card');
                    }
                }
            }
        }

        // Hide the full cards container
        const fullCardsContainer = document.querySelector('.full-cards-container');
        if (fullCardsContainer) {
            fullCardsContainer.classList.remove('active');
        }

        overlay.classList.remove('active');
    });
}

/**
 * Initializes the card expansion functionality
 */
function initCardExpansion() {
    const miniCards = document.querySelectorAll('.column-2 .infographic-section');
    const overlay = document.querySelector('.overlay');
    const fullCardsContainer = document.querySelector('.full-cards-container');

    miniCards.forEach((miniCard, index) => {
        // Add click event to each mini card
        miniCard.addEventListener('click', function(e) {
            // Prevent event bubbling
            e.stopPropagation();

            // Only process click if card is active
            if (!this.classList.contains('active-card')) {
                return;
            }

            // Get the corresponding full card
            const cardNumber = index + 1;
            const fullCard = document.getElementById(`full-card-${cardNumber}`);

            if (!fullCard) {
                console.error(`Full card #${cardNumber} not found`);
                return;
            }

            // Remove active class from any other full card
            const activeCard = document.querySelector('.full-card.active');
            if (activeCard) {
                activeCard.classList.remove('active');
            }

            // Make the full cards container visible
            fullCardsContainer.classList.add('active');

            // Add active class to the selected full card
            fullCard.classList.add('active');

            // Add close button if it doesn't exist
            if (!fullCard.querySelector('.close-btn')) {
                const closeBtn = document.createElement('div');
                closeBtn.className = 'close-btn';
                closeBtn.innerHTML = '×';
                closeBtn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    fullCard.classList.remove('active');
                    overlay.classList.remove('active');
                    fullCardsContainer.classList.remove('active');

                    // Get the current active miniature card
                    const currentMiniCard = document.querySelector('.column-2 .infographic-section.active-card');
                    if (currentMiniCard) {
                        // Deactivate current card
                        currentMiniCard.classList.remove('active-card');

                        // Activate next card if it exists, or first card if this is the last one
                        const nextMiniCard = currentMiniCard.nextElementSibling;
                        if (nextMiniCard && nextMiniCard.classList.contains('infographic-section')) {
                            nextMiniCard.classList.add('active-card');
                        } else {
                            // If there's no next card, activate the first one (circular navigation)
                            const firstMiniCard = document.querySelector('.column-2 .infographic-section');
                            if (firstMiniCard) {
                                firstMiniCard.classList.add('active-card');
                            }
                        }
                    }
                });
                fullCard.appendChild(closeBtn);
            }

            // Show overlay
            overlay.classList.add('active');
        });
    });

}

/**
 * Initializes the sequential navigation for the cards
 * Only the first card is active initially, and each card activates the next one when closed
 */
function initSequentialNavigation() {
    const miniCards = document.querySelectorAll('.column-2 .infographic-section');

    // Deactivate all cards initially (CSS already sets them as inactive by default)
    miniCards.forEach(card => {
        card.classList.remove('active-card');
    });

    // Activate only the first card
    if (miniCards.length > 0) {
        miniCards[0].classList.add('active-card');
    }
}
