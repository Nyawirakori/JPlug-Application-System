document.addEventListener("DOMContentLoaded", function () {
    const locationSelect = document.getElementById("location");
    const serviceSelect = document.getElementById("service");
    const resultsContainer = document.createElement("div");
    resultsContainer.classList.add("mt-3", "text-center");
    document.querySelector("#services .container").appendChild(resultsContainer);

    // Fetch counties data from db.json
    fetch("https://my-json-server.typicode.com/Nyawirakori/JPlug-Application-System/counties")
        .then(response => response.json())
        .then(data => {
            data.counties.forEach(county => {
                const option = document.createElement("option");
                option.value = county.name;
                option.textContent = county.name;
                locationSelect.appendChild(option);
            });
        })
        .catch(error => console.error("Error loading counties:", error));

    // Function to update and display service providers
    function updateServiceProviders() {
        const selectedLocation = locationSelect.value;
        const selectedService = serviceSelect.value;
        resultsContainer.innerHTML = "";

        if (selectedLocation && selectedService) {
            fetch("https://my-json-server.typicode.com/Nyawirakori/JPlug-Application-System/counties")
                .then(response => response.json())
                .then(data => {
                    const county = data.counties.find(c => c.name === selectedLocation);
                    if (county) {
                        const providers = selectedService === "Plumber" ? county.plumbers : county.electricians;
                        if (providers.length > 0) {
                            const list = document.createElement("ul");
                            list.classList.add("list-group", "text-start", "mt-3");

                            providers.forEach(provider => {
                                const listItem = document.createElement("li");
                                listItem.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center");

                                // Provider Name
                                const providerName = document.createElement("span");
                                providerName.textContent = provider;

                                // Booking Button
                                const btn = document.createElement("button");
                                btn.classList.add("btn", "btn-primary", "btn-sm");
                                btn.textContent = "Book";
                                btn.onclick = function () {
                                    alert(`Thank you for booking ${provider}. You will be contacted soon.`);
                                };

                                // Append elements
                                listItem.appendChild(providerName);
                                listItem.appendChild(btn);
                                list.appendChild(listItem);
                            });

                            resultsContainer.appendChild(list);
                        } else {
                            resultsContainer.textContent = "No providers available for this selection.";
                        }
                    }
                })
                .catch(error => console.error("Error fetching service providers:", error));
        }
    }

    locationSelect.addEventListener("change", updateServiceProviders);
    serviceSelect.addEventListener("change", updateServiceProviders);
});
