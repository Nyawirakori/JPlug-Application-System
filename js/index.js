document.addEventListener("DOMContentLoaded", function () {
    const locationSelect = document.getElementById("location");
    const serviceSelect = document.getElementById("service");
    const resultsContainer = document.createElement("div");
    resultsContainer.classList.add("mt-3");
    document.querySelector("#services .container").appendChild(resultsContainer);

    fetchCounties(locationSelect);

    function fetchCounties(locationSelect) {
        fetch("http://localhost:3000/counties")
            .then(response => response.json())
            .then(data => {
                data.forEach(county => {
                    const option = document.createElement("option");
                    option.value = county.name;
                    option.textContent = county.name;
                    locationSelect.appendChild(option);
                });
            })
            .catch(error => console.error("Error loading counties:", error));
    }

    function createStarRating(ratingContainer, updateRatingCallback) {
        let rating = 0;

        for (let i = 1; i <= 5; i++) {
            const star = document.createElement("span");
            star.innerHTML = "&#9734;";
            star.classList.add("star");

            star.addEventListener("click", () => {
                rating = i;
                updateStars(ratingContainer, rating);
                updateRatingCallback(rating);
            });

            ratingContainer.appendChild(star);
        }

        function updateStars(container, currentRating) {
            container.childNodes.forEach((star, index) => {
                if (index < currentRating) {
                    star.classList.add("rated");
                } else {
                    star.classList.remove("rated");
                }
            });
        }
    }

    function renderServiceProviders(providers) {
        resultsContainer.innerHTML = "";

        const row = document.createElement("div");
        row.classList.add("row");

        providers.forEach(provider => {
            const col = document.createElement("div");
            col.classList.add("col-md-6", "mb-4");

            const card = document.createElement("div");
            card.classList.add("card");

            const cardBody = document.createElement("div");
            cardBody.classList.add("card-body");

            const providerName = document.createElement("h5");
            providerName.classList.add("card-title");
            providerName.textContent = provider;

            const bookButton = document.createElement("button");
            bookButton.classList.add("btn", "btn-primary", "btn-sm", "mt-2");
            bookButton.textContent = "Book";
            bookButton.addEventListener('click', (event) => {
                event.preventDefault();
                showBookingDetails(provider, serviceSelect.value);
            });

            // Container for the rating and display
            const ratingWrapper = document.createElement("div");
            ratingWrapper.classList.add("mt-2", "d-flex", "flex-column");

            const ratingContainer = document.createElement("div");
            ratingContainer.classList.add("star-rating");

            const rateService = document.createElement("p");
            rateService.textContent = "Rate the service";


            const ratingDisplay = document.createElement("div");
            ratingDisplay.classList.add("mt-2");

            createStarRating(ratingContainer, (rating) => {
                ratingDisplay.textContent = `Your rating is: ${rating}/5`;
            });
            
            ratingWrapper.appendChild(rateService);
            ratingWrapper.appendChild(ratingContainer);
            ratingWrapper.appendChild(ratingDisplay);

            cardBody.appendChild(providerName);
            cardBody.appendChild(bookButton);
            cardBody.appendChild(ratingWrapper);
            card.appendChild(cardBody);
            col.appendChild(card);
            row.appendChild(col);
        });

        resultsContainer.appendChild(row);
    }

    function updateServiceProviders() {
        const selectedLocation = locationSelect.value;
        const selectedService = serviceSelect.value;

        if (selectedLocation && selectedService) {
            fetch("http://localhost:3000/counties")
                .then(response => response.json())
                .then(data => {
                    const county = data.find(c => c.name === selectedLocation);
                    const providers = county ? (selectedService === "Plumber" ? county.plumbers : county.electricians) : [];
                    renderServiceProviders(providers);
                })
                .catch(error => console.error("Error fetching service providers:", error));
        } else {
            renderServiceProviders([]);
        }
    }

    locationSelect.addEventListener("change", updateServiceProviders);
    serviceSelect.addEventListener("change", updateServiceProviders);

    const darkModeButton = document.querySelector(".dark-button");
    if (darkModeButton) {
        darkModeButton.addEventListener("click", changeTheme);
    }

    function changeTheme() {
        document.body.classList.toggle("dark");
    }

    const bookingDetailsContainer = document.createElement("div");
    bookingDetailsContainer.classList.add("booking-details", "mt-4", "p-4", "bg-light", "rounded", "shadow", "d-none");
     bookingDetailsContainer.style.background= "linear-gradient(108.1deg, rgb(167, 220, 225) 11.2%, rgb(217, 239, 242) 88.9%)";
    document.querySelector("#services .container").appendChild(bookingDetailsContainer);

    // Booking confirmation Section
    function showBookingDetails(providerName, serviceType) {
        bookingDetailsContainer.innerHTML = ""; 
        bookingDetailsContainer.classList.remove("d-none"); 

        const title = document.createElement("h4");
        title.textContent = "Booking Confirmation";
        title.classList.add("mb-3");

        const providerInfo = document.createElement("p");
        providerInfo.textContent = `You have booked ${providerName} (${serviceType}).`;

        const timeInfo = document.createElement("p");
        timeInfo.textContent = `Time: ${new Date().toLocaleTimeString()}`;


        bookingDetailsContainer.appendChild(title);
        bookingDetailsContainer.appendChild(providerInfo);
        bookingDetailsContainer.appendChild(timeInfo);
        bookingDetailsContainer.appendChild(closeButton);
    }
});