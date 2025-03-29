// Chattogram Transport System - JavaScript

document.addEventListener("DOMContentLoaded", function () {
  // DOM Elements
  const darkModeToggle = document.getElementById("darkModeToggle");
  const bookmarkBtn = document.getElementById("bookmarkBtn");
  const routeForm = document.getElementById("routeForm");
  const startLocationInput = document.getElementById("startLocation");
  const endLocationInput = document.getElementById("endLocation");
  const startSuggestions = document.getElementById("startSuggestions");
  const endSuggestions = document.getElementById("endSuggestions");
  const loadingIndicator = document.getElementById("loadingIndicator");
  const resultsSection = document.getElementById("resultsSection");
  const noResultsSection = document.getElementById("noResultsSection");
  const busCards = document.getElementById("busCards");
  const tryAgainBtn = document.getElementById("tryAgainBtn");
  const routeCount = document.getElementById("routeCount");
  const bookmarkedRoutesSection = document.getElementById(
    "bookmarkedRoutesSection"
  );
  const bookmarkedRoutes = document.getElementById("bookmarkedRoutes");

  const busInfoModal = document.getElementById("busInfoModal");
  const closeModal = document.getElementById("closeModal");
  const closeModalBtn = document.getElementById("closeModalBtn");
  const modalBusName = document.getElementById("modalBusName");
  const modalContent = document.getElementById("modalContent");
  const bookmarkRouteBtn = document.getElementById("bookmarkRouteBtn");

  const feedbackModal = document.getElementById("feedbackModal");
  const closeFeedbackModal = document.getElementById("closeFeedbackModal");
  const cancelFeedback = document.getElementById("cancelFeedback");
  const feedbackForm = document.getElementById("feedbackForm");
  const starRating = feedbackModal.querySelectorAll(".fa-star");

  const busCardTemplate = document.getElementById("busCardTemplate");
  const routeVisualization = document.getElementById("routeVisualization");

  // Locations in Chattogram (for autocomplete)
  const locations = [
    "Agrabad",
    "Anderkilla",
    "Bahaddarhat",
    "Bakalia",
    "Baluchara",
    "Bayezid",
    "Chandgaon",
    "Chawkbazar",
    "Chittagong University",
    "Dampara",
    "CEPZ",
    "Dewanhat",
    "GEC Circle",
    "Halishahar",
    "Jamal Khan",
    "Karnaphuli",
    "Khulshi",
    "Kotwali",
    "Lalkhan Bazar",
    "Muradpur",
    "Nasirabad",
    "New Market",
    "Oxygen",
    "Panchlaish",
    "Pahartali",
    "Patenga",
    "Port Area",
    "Prabartak",
    "Reazuddin Bazar",
    "Sadarghat",
    "Sholoshahar",
    "Tiger Pass",
    "Wasa Circle",
  ];

  // Bus routes data (simulated)
  const busRoutesData = [
    {
      id: 1,
      name: "Shohagh Paribahan",
      route: [
        "Agrabad",
        "GEC Circle",
        "Tiger Pass",
        "Muradpur",
        "Oxygen",
        "Bahaddarhat",
      ],
      fare: "৳25",
      time: "35 mins",
      stops: 6,
      schedule: ["7:00 AM", "7:30 AM", "8:00 AM", "8:30 AM", "9:00 AM"],
      facilities: ["Air Conditioned", "WiFi", "Comfortable Seats"],
      rating: 4.2,
    },
    {
      id: 2,
      name: "Chattala Express",
      route: ["Bahaddarhat", "Muradpur", "GEC Circle", "Agrabad"],
      fare: "৳20",
      time: "30 mins",
      stops: 4,
      schedule: ["7:15 AM", "7:45 AM", "8:15 AM", "8:45 AM", "9:15 AM"],
      facilities: ["Standard Seating", "Budget Friendly"],
      rating: 3.8,
    },
    {
      id: 3,
      name: "Karnaphuli Service",
      route: [
        "Patenga",
        "Port Area",
        "Agrabad",
        "GEC Circle",
        "Muradpur",
        "Oxygen",
        "Bahaddarhat",
        "Chittagong University",
      ],
      fare: "৳35",
      time: "50 mins",
      stops: 8,
      schedule: ["6:30 AM", "7:15 AM", "8:00 AM", "8:45 AM", "9:30 AM"],
      facilities: ["Air Conditioned", "Spacious Seating", "Mobile Charging"],
      rating: 4.5,
    },
    {
      id: 4,
      name: "City Link",
      route: [
        "Halishahar",
        "Agrabad",
        "Dewanhat",
        "GEC Circle",
        "Chawkbazar",
        "Muradpur",
        "Oxygen",
      ],
      fare: "৳30",
      time: "45 mins",
      stops: 7,
      schedule: ["7:10 AM", "7:50 AM", "8:30 AM", "9:10 AM", "9:50 AM"],
      facilities: ["Air Conditioned", "WiFi"],
      rating: 4.0,
    },
    {
      id: 5,
      name: "Peninsula Transport",
      route: [
        "Patenga",
        "CEPZ",
        "Agrabad",
        "Dewanhat",
        "GEC Circle",
        "Lalkhan Bazar",
        "Muradpur",
        "Oxygen",
        "Bahaddarhat",
      ],
      fare: "৳40",
      time: "55 mins",
      stops: 9,
      schedule: ["6:45 AM", "7:30 AM", "8:15 AM", "9:00 AM", "9:45 AM"],
      facilities: [
        "Air Conditioned",
        "WiFi",
        "Comfortable Seats",
        "Mobile Charging",
      ],
      rating: 4.7,
    },
  ];

  // Saved routes/bookmarks
  let bookmarkedRoutesList =
    JSON.parse(localStorage.getItem("bookmarkedRoutes")) || [];

  // Current state
  let currentSelectedBus = null;
  let isDarkMode = localStorage.getItem("darkMode") === "true";

  // Initialize the application
  init();

  // Initialize application
  function init() {
    // Set initial dark mode state
    if (isDarkMode) {
      document.body.classList.add("dark-mode");
      darkModeToggle.querySelector("i").classList.remove("fa-moon");
      darkModeToggle.querySelector("i").classList.add("fa-sun");
    }

    // Attach event listeners
    attachEventListeners();

    // Initialize bookmarks
    updateBookmarkedRoutesSection();
  }

  // Attach all event listeners
  function attachEventListeners() {
    // Dark mode toggle
    darkModeToggle.addEventListener("click", toggleDarkMode);

    // Bookmark button
    bookmarkBtn.addEventListener("click", toggleBookmarkedRoutes);

    // Route form submission
    routeForm.addEventListener("submit", handleRouteSearch);

    // Location input events
    startLocationInput.addEventListener("input", function () {
      showSuggestions(this.value, startSuggestions, startLocationInput);
    });

    endLocationInput.addEventListener("input", function () {
      showSuggestions(this.value, endSuggestions, endLocationInput);
    });

    // Click outside to close suggestions
    document.addEventListener("click", function (e) {
      if (!startLocationInput.contains(e.target)) {
        startSuggestions.classList.add("hidden");
      }
      if (!endLocationInput.contains(e.target)) {
        endSuggestions.classList.add("hidden");
      }
    });

    // Try Again button
    tryAgainBtn.addEventListener("click", function () {
      noResultsSection.classList.add("hidden");
      startLocationInput.value = "";
      endLocationInput.value = "";
      startLocationInput.focus();
    });

    // Modal close buttons
    closeModal.addEventListener("click", closeInfoModal);
    closeModalBtn.addEventListener("click", closeInfoModal);

    // Feedback modal
    closeFeedbackModal.addEventListener("click", closeFeedbackModalFn);
    cancelFeedback.addEventListener("click", closeFeedbackModalFn);

    // Star rating
    starRating.forEach((star) => {
      star.addEventListener("click", handleStarRating);
    });

    // Feedback form submission
    feedbackForm.addEventListener("submit", handleFeedbackSubmission);

    // Bookmark route button
    bookmarkRouteBtn.addEventListener("click", handleBookmarkRoute);
  }

  // Toggle dark mode
  function toggleDarkMode() {
    isDarkMode = !isDarkMode;
    document.body.classList.toggle("dark-mode");

    // Toggle icon
    const icon = darkModeToggle.querySelector("i");
    if (isDarkMode) {
      icon.classList.remove("fa-moon");
      icon.classList.add("fa-sun");
    } else {
      icon.classList.remove("fa-sun");
      icon.classList.add("fa-moon");
    }

    // Save preference
    localStorage.setItem("darkMode", isDarkMode);
  }

  // Show location suggestions
  function showSuggestions(value, suggestionsElement, inputElement) {
    if (!value) {
      suggestionsElement.classList.add("hidden");
      return;
    }

    const filteredLocations = locations.filter((location) =>
      location.toLowerCase().includes(value.toLowerCase())
    );

    if (filteredLocations.length === 0) {
      suggestionsElement.classList.add("hidden");
      return;
    }

    suggestionsElement.innerHTML = "";
    filteredLocations.forEach((location) => {
      const suggestionItem = document.createElement("div");
      suggestionItem.classList.add("suggestion-item");
      suggestionItem.textContent = location;
      suggestionItem.addEventListener("click", function () {
        inputElement.value = location;
        suggestionsElement.classList.add("hidden");
      });
      suggestionsElement.appendChild(suggestionItem);
    });

    suggestionsElement.classList.remove("hidden");
  }

  // Handle route search
  function handleRouteSearch(e) {
    e.preventDefault();

    const startLocation = startLocationInput.value.trim();
    const endLocation = endLocationInput.value.trim();

    if (!startLocation || !endLocation) {
      showToast("Please enter both starting point and destination", "warning");
      return;
    }

    // Check if both locations are valid
    if (
      !locations.includes(startLocation) ||
      !locations.includes(endLocation)
    ) {
      showToast(
        "Please select valid locations from the suggestions",
        "warning"
      );
      return;
    }

    // Show loading indicator
    loadingIndicator.classList.remove("hidden");
    resultsSection.classList.add("hidden");
    noResultsSection.classList.add("hidden");
    bookmarkedRoutesSection.classList.add("hidden");

    // Simulate API request
    setTimeout(() => {
      // Filter bus routes that include both start and end locations
      const foundRoutes = busRoutesData.filter((bus) => {
        const route = bus.route;
        const startIndex = route.indexOf(startLocation);
        const endIndex = route.indexOf(endLocation);
        return startIndex !== -1 && endIndex !== -1 && startIndex < endIndex;
      });

      // Hide loading indicator
      loadingIndicator.classList.add("hidden");

      if (foundRoutes.length > 0) {
        displayRoutes(foundRoutes, startLocation, endLocation);
        resultsSection.classList.remove("hidden");
      } else {
        noResultsSection.classList.remove("hidden");
      }
    }, 1500); // Simulate 1.5s loading time
  }

  // Display found routes
  function displayRoutes(routes, startLocation, endLocation) {
    // Clear previous results
    busCards.innerHTML = "";

    // Update route count
    routeCount.textContent = routes.length;

    // Create and visualize a route map
    createRouteVisualization(routes[0], startLocation, endLocation);

    // Create bus cards for each route
    routes.forEach((bus, index) => {
      const card = busCardTemplate.content.cloneNode(true);

      card.querySelector(".bus-name").textContent = bus.name;
      card.querySelector(".bus-fare").textContent = bus.fare;
      card.querySelector(".bus-time").textContent = bus.time;
      card.querySelector(".bus-stops").textContent = bus.stops;

      const busCard = card.querySelector(".bus-card");
      busCard.classList.add("bus-card-container");
      busCard.style.animation = `staggerIn 0.5s ease forwards ${index * 0.1}s`;

      busCard.addEventListener("click", function () {
        showBusDetails(bus, startLocation, endLocation);
      });

      card.querySelector(".view-route").addEventListener("click", function (e) {
        e.stopPropagation(); // Prevent card click event
        showBusDetails(bus, startLocation, endLocation);
      });

      busCards.appendChild(card);
    });
  }

  // Create route visualization
  function createRouteVisualization(bus, startLocation, endLocation) {
    routeVisualization.innerHTML = "";
    const visualEl = routeVisualization;

    const route = bus.route;
    const startIndex = route.indexOf(startLocation);
    const endIndex = route.indexOf(endLocation);

    // Get the relevant stops (from start to end)
    const relevantStops = route.slice(startIndex, endIndex + 1);

    // Layout stops in a line
    const stopWidth = visualEl.offsetWidth / (relevantStops.length + 1);
    relevantStops.forEach((stop, index) => {
      const stopEl = document.createElement("div");
      stopEl.classList.add("route-stop");
      if (index === 0) stopEl.classList.add("origin");
      if (index === relevantStops.length - 1)
        stopEl.classList.add("destination");

      stopEl.style.left = `${stopWidth * (index + 1)}px`;
      stopEl.style.top = "50%";

      // Add tooltip
      stopEl.classList.add("tooltip");
      const tooltip = document.createElement("span");
      tooltip.classList.add("tooltiptext");
      tooltip.textContent = stop;
      stopEl.appendChild(tooltip);

      visualEl.appendChild(stopEl);

      // Add line connecting stops
      if (index < relevantStops.length - 1) {
        const line = document.createElement("div");
        line.classList.add("route-line");
        line.style.left = `${stopWidth * (index + 1)}px`;
        line.style.top = "50%";
        line.style.width = `${stopWidth}px`;
        visualEl.appendChild(line);
      }
    });

    // Add labels for start and end
    const startLabel = document.createElement("div");
    startLabel.classList.add("absolute", "font-semibold", "text-sm");
    startLabel.textContent = startLocation;
    startLabel.style.left = `${stopWidth}px`;
    startLabel.style.top = "70%";
    startLabel.style.transform = "translateX(-50%)";
    visualEl.appendChild(startLabel);

    const endLabel = document.createElement("div");
    endLabel.classList.add("absolute", "font-semibold", "text-sm");
    endLabel.textContent = endLocation;
    endLabel.style.left = `${stopWidth * relevantStops.length}px`;
    endLabel.style.top = "70%";
    endLabel.style.transform = "translateX(-50%)";
    visualEl.appendChild(endLabel);
  }

  // Show bus details in modal
  function showBusDetails(bus, startLocation, endLocation) {
    modalBusName.textContent = bus.name;
    currentSelectedBus = {
      ...bus,
      startLocation,
      endLocation,
    };

    // Check if route is bookmarked
    const isBookmarked = bookmarkedRoutesList.some(
      (route) =>
        route.id === bus.id &&
        route.startLocation === startLocation &&
        route.endLocation === endLocation
    );

    if (isBookmarked) {
      bookmarkRouteBtn.innerHTML = '<i class="fas fa-bookmark mr-1"></i> Saved';
      bookmarkRouteBtn.classList.add("bg-gray-300");
    } else {
      bookmarkRouteBtn.innerHTML =
        '<i class="far fa-bookmark mr-1"></i> Save Route';
      bookmarkRouteBtn.classList.remove("bg-gray-300");
    }

    // Create modal content
    modalContent.innerHTML = `
            <div class="p-3 bg-gray-100 rounded-md mb-4 dark:bg-gray-700">
                <div class="flex justify-between items-center">
                    <div>
                        <span class="text-sm text-gray-500 dark:text-gray-400">From</span>
                        <p class="font-semibold">${startLocation}</p>
                    </div>
                    <i class="fas fa-arrow-right text-blue-600 mx-2"></i>
                    <div>
                        <span class="text-sm text-gray-500 dark:text-gray-400">To</span>
                        <p class="font-semibold">${endLocation}</p>
                    </div>
                </div>
            </div>
            
            <div class="mb-4">
                <h4 class="font-semibold text-lg mb-2">Journey Details</h4>
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <span class="text-sm text-gray-500 dark:text-gray-400">Fare</span>
                        <p class="font-semibold">${bus.fare}</p>
                    </div>
                    <div>
                        <span class="text-sm text-gray-500 dark:text-gray-400">Duration</span>
                        <p class="font-semibold">${bus.time}</p>
                    </div>
                    <div>
                        <span class="text-sm text-gray-500 dark:text-gray-400">Total Stops</span>
                        <p class="font-semibold">${bus.stops}</p>
                    </div>
                    <div>
                        <span class="text-sm text-gray-500 dark:text-gray-400">Rating</span>
                        <p class="font-semibold flex items-center">
                            ${bus.rating}
                            <span class="ml-1 text-yellow-500">
                                ${generateStarRating(bus.rating)}
                            </span>
                        </p>
                    </div>
                </div>
            </div>
            
            <div class="mb-4">
                <h4 class="font-semibold text-lg mb-2">Facilities</h4>
                <div class="flex flex-wrap gap-2">
                    ${bus.facilities
                      .map(
                        (facility) =>
                          `<span class="badge-primary px-2 py-1 rounded-md text-xs">${facility}</span>`
                      )
                      .join("")}
                </div>
            </div>
            
            <div class="mb-4">
                <h4 class="font-semibold text-lg mb-2">Schedule</h4>
                <div class="grid grid-cols-3 gap-2">
                    ${bus.schedule
                      .map(
                        (time) =>
                          `<span class="text-center p-1 border border-gray-200 rounded dark:border-gray-600">${time}</span>`
                      )
                      .join("")}
                </div>
            </div>
            
            <div>
                <h4 class="font-semibold text-lg mb-2">Route Path</h4>
                <div class="timeline">
                    ${getRoutePath(bus.route, startLocation, endLocation)
                      .map(
                        (stop, index, arr) => `
                        <div class="timeline-item">
                            <div class="font-medium">${stop}</div>
                            ${
                              index === 0 || index === arr.length - 1
                                ? `<div class="text-xs ${
                                    index === 0
                                      ? "text-green-600"
                                      : "text-red-600"
                                  }">
                                    ${
                                      index === 0
                                        ? "Starting Point"
                                        : "Destination"
                                    }
                                </div>`
                                : ""
                            }
                        </div>
                    `
                      )
                      .join("")}
                </div>
            </div>
            
            <div class="flex justify-center mt-4">
                <button id="rateBusBtn" class="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none transition">
                    <i class="fas fa-star mr-1"></i> Rate this Service
                </button>
            </div>
        `;

    // Attach rate button event
    document
      .getElementById("rateBusBtn")
      .addEventListener("click", function () {
        busInfoModal.classList.add("hidden");
        openFeedbackModal();
      });

    // Show modal
    busInfoModal.classList.remove("hidden");
  }

  // Close bus info modal
  function closeInfoModal() {
    busInfoModal.classList.add("hidden");
  }

  // Generate star rating HTML
  function generateStarRating(rating) {
    let starsHtml = "";
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(rating)) {
        starsHtml += '<i class="fas fa-star"></i>';
      } else if (i - 0.5 <= rating) {
        starsHtml += '<i class="fas fa-star-half-alt"></i>';
      } else {
        starsHtml += '<i class="far fa-star"></i>';
      }
    }
    return starsHtml;
  }

  // Get route path between start and end
  function getRoutePath(route, start, end) {
    const startIndex = route.indexOf(start);
    const endIndex = route.indexOf(end);

    if (startIndex === -1 || endIndex === -1 || startIndex > endIndex) {
      return [];
    }

    return route.slice(startIndex, endIndex + 1);
  }

  // Open feedback modal
  function openFeedbackModal() {
    // Reset stars
    starRating.forEach((star) => {
      star.classList.remove("fas");
      star.classList.add("far");
    });

    // Clear comment
    document.getElementById("feedbackComment").value = "";

    // Show modal
    feedbackModal.classList.remove("hidden");
  }

  // Close feedback modal
  function closeFeedbackModalFn() {
    feedbackModal.classList.add("hidden");
  }

  // Handle star rating
  function handleStarRating() {
    const rating = parseInt(this.getAttribute("data-rating"));

    starRating.forEach((star) => {
      const starRating = parseInt(star.getAttribute("data-rating"));
      if (starRating <= rating) {
        star.classList.remove("far");
        star.classList.add("fas");
      } else {
        star.classList.remove("fas");
        star.classList.add("far");
      }
    });
  }

  // Handle feedback submission
  function handleFeedbackSubmission(e) {
    e.preventDefault();

    // Get rating
    const ratingValue = feedbackModal.querySelectorAll(".fas").length;
    const comment = document.getElementById("feedbackComment").value;

    if (ratingValue === 0) {
      showToast("Please select a rating", "warning");
      return;
    }

    // Here you would normally send this to a server
    // For this demo, just show a success message
    showToast("Thank you for your feedback!", "success");

    // Close modal
    closeFeedbackModalFn();
  }

  // Toggle bookmarked routes
  function toggleBookmarkedRoutes() {
    // Hide other sections
    resultsSection.classList.add("hidden");
    noResultsSection.classList.add("hidden");

    // Toggle bookmarked routes section
    const isVisible = !bookmarkedRoutesSection.classList.contains("hidden");

    if (isVisible) {
      bookmarkedRoutesSection.classList.add("hidden");
    } else {
      updateBookmarkedRoutesSection();
      bookmarkedRoutesSection.classList.remove("hidden");
    }
  }

  // Update bookmarked routes section
  function updateBookmarkedRoutesSection() {
    bookmarkedRoutes.innerHTML = "";

    if (bookmarkedRoutesList.length === 0) {
      bookmarkedRoutes.innerHTML = `
                <div class="col-span-full text-center p-6 bg-white rounded-lg shadow dark:bg-gray-800">
                    <i class="far fa-bookmark text-4xl text-gray-400 mb-2"></i>
                    <p class="text-gray-600 dark:text-gray-400">No bookmarked routes yet</p>
                    <p class="text-sm text-gray-500 dark:text-gray-500">Your saved routes will appear here</p>
                </div>
            `;
      return;
    }

    // Create bus cards for each bookmarked route
    bookmarkedRoutesList.forEach((bookmark, index) => {
      const card = busCardTemplate.content.cloneNode(true);

      card.querySelector(".bus-name").textContent = bookmark.name;
      card.querySelector(".bus-fare").textContent = bookmark.fare;
      card.querySelector(".bus-time").textContent = bookmark.time;
      card.querySelector(".bus-stops").textContent = bookmark.stops;

      const busCard = card.querySelector(".bus-card");
      busCard.classList.add("bus-card-container");
      busCard.style.animation = `staggerIn 0.5s ease forwards ${index * 0.1}s`;

      // Add from/to info to the card
      const routeInfo = document.createElement("div");
      routeInfo.classList.add(
        "mb-3",
        "pb-2",
        "border-b",
        "border-gray-200",
        "dark:border-gray-700"
      );
      routeInfo.innerHTML = `
                <div class="flex justify-between items-center text-sm">
                    <div>
                        <span class="text-xs text-gray-500 dark:text-gray-400">From</span>
                        <p class="font-medium">${bookmark.startLocation}</p>
                    </div>
                    <i class="fas fa-arrow-right text-blue-600 mx-1"></i>
                    <div>
                        <span class="text-xs text-gray-500 dark:text-gray-400">To</span>
                        <p class="font-medium">${bookmark.endLocation}</p>
                    </div>
                </div>
            `;
      busCard
        .querySelector(".p-4")
        .insertBefore(routeInfo, busCard.querySelector(".p-4").firstChild);

      // Add delete bookmark button
      const btnContainer = document.createElement("div");
      btnContainer.classList.add("flex", "space-x-2", "mt-2");
      btnContainer.innerHTML = `
                <button class="delete-bookmark w-1/2 bg-red-100 hover:bg-red-200 text-red-800 font-semibold py-2 rounded-md transition flex items-center justify-center">
                    <i class="fas fa-trash-alt mr-2"></i> Remove
                </button>
                <button class="view-bookmark w-1/2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition flex items-center justify-center">
                    <i class="fas fa-eye mr-2"></i> View
                </button>
            `;

      // Replace view route button with the new buttons
      const viewRouteBtn = busCard.querySelector(".view-route");
      viewRouteBtn.parentNode.insertBefore(btnContainer, viewRouteBtn);
      viewRouteBtn.remove();

      // Add event listeners
      busCard
        .querySelector(".delete-bookmark")
        .addEventListener("click", function (e) {
          e.stopPropagation();
          removeBookmark(bookmark);
        });

      busCard
        .querySelector(".view-bookmark")
        .addEventListener("click", function (e) {
          e.stopPropagation();
          showBusDetails(
            bookmark,
            bookmark.startLocation,
            bookmark.endLocation
          );
        });

      busCard.addEventListener("click", function () {
        showBusDetails(bookmark, bookmark.startLocation, bookmark.endLocation);
      });

      bookmarkedRoutes.appendChild(card);
    });
  }

  // Handle bookmark route
  function handleBookmarkRoute() {
    if (!currentSelectedBus) return;

    // Check if already bookmarked
    const index = bookmarkedRoutesList.findIndex(
      (route) =>
        route.id === currentSelectedBus.id &&
        route.startLocation === currentSelectedBus.startLocation &&
        route.endLocation === currentSelectedBus.endLocation
    );

    if (index !== -1) {
      // Remove bookmark
      bookmarkedRoutesList.splice(index, 1);
      bookmarkRouteBtn.innerHTML =
        '<i class="far fa-bookmark mr-1"></i> Save Route';
      bookmarkRouteBtn.classList.remove("bg-gray-300");
      showToast("Route removed from bookmarks", "info");
    } else {
      // Add bookmark
      bookmarkedRoutesList.push(currentSelectedBus);
      bookmarkRouteBtn.innerHTML = '<i class="fas fa-bookmark mr-1"></i> Saved';
      bookmarkRouteBtn.classList.add("bg-gray-300");
      showToast("Route saved to bookmarks", "success");
    }

    // Save to local storage
    localStorage.setItem(
      "bookmarkedRoutes",
      JSON.stringify(bookmarkedRoutesList)
    );

    // Update bookmarked routes if visible
    if (!bookmarkedRoutesSection.classList.contains("hidden")) {
      updateBookmarkedRoutesSection();
    }
  }

  // Remove bookmark
  function removeBookmark(bookmark) {
    // Remove from list
    bookmarkedRoutesList = bookmarkedRoutesList.filter(
      (route) =>
        !(
          route.id === bookmark.id &&
          route.startLocation === bookmark.startLocation &&
          route.endLocation === bookmark.endLocation
        )
    );

    // Save to local storage
    localStorage.setItem(
      "bookmarkedRoutes",
      JSON.stringify(bookmarkedRoutesList)
    );

    // Update UI
    updateBookmarkedRoutesSection();

    // Show toast notification
    showToast("Route removed from bookmarks", "info");
  }

  // Show toast notification
  function showToast(message, type = "info") {
    const toast = document.createElement("div");
    toast.classList.add("toast", `toast-${type}`);
    toast.textContent = message;

    document.body.appendChild(toast);

    // Trigger animation
    setTimeout(() => {
      toast.classList.add("show");
    }, 10);

    // Remove after animation
    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 300);
    }, 3000);
  }

  // Get distance between two locations (simulated)
  function getDistanceBetween(start, end) {
    // This would normally use a proper distance calculation API
    // For this demo, we'll just return random values based on location names
    const hash = (start + end).split("").reduce((acc, char) => {
      return acc + char.charCodeAt(0);
    }, 0);

    return (hash % 10) + 5; // Returns a distance between 5-15 km
  }
});
