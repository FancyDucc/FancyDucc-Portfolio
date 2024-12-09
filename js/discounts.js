document.addEventListener("DOMContentLoaded", function() {
    const cumulativeDiscounts = {};

    function updateDiscount(discountPercentage, services) {
        const discountCard = document.getElementById('discount-card');
        const discountedServicesList = document.getElementById('discounted-services-list');

        if (discountCard && discountedServicesList) {
            services.forEach(service => {
                const serviceKey = service.name.toLowerCase();
                if (!cumulativeDiscounts[serviceKey]) {
                    cumulativeDiscounts[serviceKey] = 1;
                }
                cumulativeDiscounts[serviceKey] *= (1 - discountPercentage / 100);
                const existingListItem = Array.from(discountedServicesList.children).find(item => item.textContent.includes(service.description));
                if (!existingListItem) {
                    const listItem = document.createElement('li');
                    listItem.textContent = `${discountPercentage}% Discount on ${service.description}`;
                    discountedServicesList.appendChild(listItem);
                }
                const cards = document.querySelectorAll('.card');
                cards.forEach(card => {
                    const cardHeader = card.querySelector('h4, h3');
                    if (cardHeader && cardHeader.textContent.toLowerCase().includes(serviceKey)) {
                        const priceElements = card.querySelectorAll('.price[data-original-price]');
                        priceElements.forEach(priceElement => {
                            const originalPrice = parseFloat(priceElement.getAttribute("data-original-price"));
                            const discountedPrice = (originalPrice * cumulativeDiscounts[serviceKey]).toFixed(2);
                            const discountedRobuxEquivalent = Math.round(discountedPrice * 80);
                            const suffixMatch = priceElement.textContent.match(/\/(hr|script|track|asset|animation|build)$/);
                            const suffix = suffixMatch ? suffixMatch[0] : '/hr';
                            if (priceElement.classList.contains('usd')) {
                                priceElement.textContent = `$${discountedPrice}${suffix}`;
                            } else if (priceElement.classList.contains('robux')) {
                                priceElement.textContent = `${discountedRobuxEquivalent} Robux${suffix}`;
                            }
                            priceElement.style.color = "#ff5252";
                        });
                        const startingPriceElements = card.querySelectorAll('p strong.price');
                        startingPriceElements.forEach(startingPriceElement => {
                            const priceText = startingPriceElement.textContent;
                            if (priceText.includes('$')) {
                                const originalPrice = parseFloat(startingPriceElement.getAttribute("data-original-price"));
                                const discountedPrice = (originalPrice * cumulativeDiscounts[serviceKey]).toFixed(2);
                                const discountedRobux = Math.round(discountedPrice * 80);
                                const suffixMatch = startingPriceElement.textContent.match(/\/(hr|script|track|asset|animation|build)$/);
                                const suffix = suffixMatch ? suffixMatch[0] : '/hr';

                                if (startingPriceElement.classList.contains('usd')) {
                                    startingPriceElement.textContent = `$${discountedPrice}${suffix}`;
                                } else if (startingPriceElement.classList.contains('robux')) {
                                    startingPriceElement.textContent = `${discountedRobux} Robux${suffix}`;
                                }
                            }
                        });
                    }
                });
            });
        } else {
            const paymentsSection = document.getElementById('payments');
            if (paymentsSection) {
                paymentsSection.insertAdjacentHTML('afterbegin', '<p style="color: #a1a1a1;">No discounts are currently available. Please check back later!</p>');
            }
        }
    }
    //updateDiscount(15, [
    //    { name: 'building', description: 'Building Services' },
    //]);
});
