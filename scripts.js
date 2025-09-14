// CabMate - Car Management System Scripts

document.addEventListener('DOMContentLoaded', function() {
  // Handle login form submission
  const loginForm = document.querySelector('#login-form form');
  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      showDashboard();
    });
  }

  // Initialize dark mode from localStorage
  initDarkMode();
  
  // Set default active tab
  showSection('dashboard');
  
  // Initialize mobile menu toggle
  initMobileMenu();
  
  // Initialize dropdowns
  initDropdowns();
  
  // Initialize charts if dashboard is visible
  if (document.getElementById('tripAnalyticsChart')) {
    initCharts();
  }
  
  // Initialize maps if booking section is visible
  if (document.getElementById('bookingMap')) {
    initBookingMap();
  }
  
  // Initialize maps if tracking section is visible
  if (document.getElementById('map')) {
    initTrackingMap();
  }
  
  // Initialize role-based access control
  initRBAC();
  
  // Initialize rating system
  initRatingSystem();
});

// Dark Mode Toggle
function initDarkMode() {
  const darkModeToggle = document.querySelector('.dark-mode-toggle');
  const body = document.body;
  
  // Check for saved preference
  if (localStorage.getItem('darkMode') === 'enabled') {
    body.classList.add('dark-mode');
    updateDarkModeIcon(true);
  }
  
  if (darkModeToggle) {
    darkModeToggle.addEventListener('click', function() {
      if (body.classList.contains('dark-mode')) {
        body.classList.remove('dark-mode');
        localStorage.setItem('darkMode', 'disabled');
        updateDarkModeIcon(false);
      } else {
        body.classList.add('dark-mode');
        localStorage.setItem('darkMode', 'enabled');
        updateDarkModeIcon(true);
      }
    });
  }
}

function updateDarkModeIcon(isDarkMode) {
  const darkModeToggle = document.querySelector('.dark-mode-toggle i');
  if (darkModeToggle) {
    if (isDarkMode) {
      darkModeToggle.className = 'fas fa-sun';
    } else {
      darkModeToggle.className = 'fas fa-moon';
    }
  }
}

// Mobile Menu Toggle
function initMobileMenu() {
  const mobileMenuBtn = document.querySelector('.mobile-menu');
  const sidebar = document.querySelector('.sidebar');
  
  if (mobileMenuBtn && sidebar) {
    mobileMenuBtn.addEventListener('click', function() {
      sidebar.classList.toggle('show');
    });
    
    // Close sidebar when clicking outside
    document.addEventListener('click', function(event) {
      if (!sidebar.contains(event.target) && !mobileMenuBtn.contains(event.target) && sidebar.classList.contains('show')) {
        sidebar.classList.remove('show');
      }
    });
  }
}

// Dropdown Management
function initDropdowns() {
  const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
  
  dropdownToggles.forEach(toggle => {
    toggle.addEventListener('click', function(e) {
      e.stopPropagation();
      const dropdown = this.nextElementSibling;
      dropdown.classList.toggle('show');
      
      // Close other dropdowns
      dropdownToggles.forEach(otherToggle => {
        if (otherToggle !== toggle) {
          otherToggle.nextElementSibling.classList.remove('show');
        }
      });
    });
  });
  
  // Close dropdowns when clicking outside
  document.addEventListener('click', function() {
    document.querySelectorAll('.dropdown-menu').forEach(menu => {
      menu.classList.remove('show');
    });
  });
}

// Tab Navigation
function showSection(sectionId) {
  // Hide all sections
  document.querySelectorAll('.section').forEach(section => {
    section.style.display = 'none';
  });
  
  // Show selected section
  const selectedSection = document.getElementById(sectionId);
  if (selectedSection) {
    selectedSection.style.display = 'block';
  }
  
  // Update active menu item
  document.querySelectorAll('.menu-item').forEach(item => {
    item.classList.remove('active');
    if (item.getAttribute('data-section') === sectionId) {
      item.classList.add('active');
    }
  });
  
  // Initialize specific section features
  if (sectionId === 'dashboard' && document.getElementById('tripAnalyticsChart')) {
    initCharts();
  } else if (sectionId === 'booking' && document.getElementById('bookingMap')) {
    initBookingMap();
  } else if (sectionId === 'tracking' && document.getElementById('map')) {
    initTrackingMap();
  }
}

// Charts Initialization
function initCharts() {
  const ctx = document.getElementById('tripAnalyticsChart').getContext('2d');
  
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
      datasets: [{
        label: 'Completed Trips',
        data: [65, 59, 80, 81, 56, 55, 72],
        borderColor: '#4F46E5',
        backgroundColor: 'rgba(79, 70, 229, 0.1)',
        tension: 0.4,
        fill: true
      }, {
        label: 'Cancelled Trips',
        data: [28, 48, 40, 19, 36, 27, 30],
        borderColor: '#EF4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.4,
        fill: true
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            display: true,
            color: 'rgba(0, 0, 0, 0.05)'
          }
        },
        x: {
          grid: {
            display: false
          }
        }
      }
    }
  });
}

// Booking Map Initialization
function initBookingMap() {
  const map = L.map('bookingMap').setView([51.505, -0.09], 13);
  
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);
  
  // Add markers for pickup and dropoff
  const pickupMarker = L.marker([51.505, -0.09], {
    draggable: true,
    icon: L.divIcon({
      className: 'custom-marker pickup-marker',
      html: '<i class="fas fa-map-marker-alt"></i>',
      iconSize: [30, 30],
      iconAnchor: [15, 30]
    })
  }).addTo(map);
  
  const dropoffMarker = L.marker([51.51, -0.1], {
    draggable: true,
    icon: L.divIcon({
      className: 'custom-marker dropoff-marker',
      html: '<i class="fas fa-flag-checkered"></i>',
      iconSize: [30, 30],
      iconAnchor: [15, 30]
    })
  }).addTo(map);
  
  // Draw route between markers
  const routePoints = [
    [51.505, -0.09],
    [51.507, -0.095],
    [51.51, -0.1]
  ];
  
  const routeLine = L.polyline(routePoints, {
    color: '#4F46E5',
    weight: 5,
    opacity: 0.7,
    dashArray: '10, 10',
    lineJoin: 'round'
  }).addTo(map);
  
  // Update route when markers are moved
  function updateRoute() {
    const newRoute = [
      pickupMarker.getLatLng(),
      dropoffMarker.getLatLng()
    ];
    routeLine.setLatLngs(newRoute);
    map.fitBounds(routeLine.getBounds(), { padding: [50, 50] });
    
    // Update fare estimate
    updateFareEstimate();
  }
  
  pickupMarker.on('dragend', updateRoute);
  dropoffMarker.on('dragend', updateRoute);
  
  // Initial fit bounds
  map.fitBounds(routeLine.getBounds(), { padding: [50, 50] });
}

// Tracking Map Initialization
function initTrackingMap() {
  const map = L.map('map').setView([51.505, -0.09], 13);
  
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);
  
  // Add vehicle marker
  const vehicleMarker = L.marker([51.505, -0.09], {
    icon: L.divIcon({
      className: 'vehicle-marker',
      html: '<i class="fas fa-car"></i>',
      iconSize: [30, 30],
      iconAnchor: [15, 15]
    })
  }).addTo(map);
  
  // Add destination marker
  const destinationMarker = L.marker([51.51, -0.1], {
    icon: L.divIcon({
      className: 'destination-marker',
      html: '<i class="fas fa-flag-checkered"></i>',
      iconSize: [30, 30],
      iconAnchor: [15, 30]
    })
  }).addTo(map);
  
  // Draw route path
  const routePoints = [
    [51.505, -0.09],
    [51.507, -0.095],
    [51.508, -0.097],
    [51.51, -0.1]
  ];
  
  const routePath = L.polyline(routePoints, {
    color: '#4F46E5',
    weight: 4,
    opacity: 0.7
  }).addTo(map);
  
  // Draw traveled path
  const traveledPoints = [
    [51.505, -0.09],
    [51.507, -0.095]
  ];
  
  const traveledPath = L.polyline(traveledPoints, {
    color: '#10B981',
    weight: 4,
    opacity: 0.9
  }).addTo(map);
  
  // Simulate vehicle movement
  let currentPointIndex = 1;
  const simulateMovement = setInterval(() => {
    if (currentPointIndex < routePoints.length) {
      // Update vehicle position
      vehicleMarker.setLatLng(routePoints[currentPointIndex]);
      
      // Update traveled path
      traveledPoints.push(routePoints[currentPointIndex]);
      traveledPath.setLatLngs(traveledPoints);
      
      // Update ETA and distance
      updateTrackingInfo(currentPointIndex, routePoints.length);
      
      currentPointIndex++;
    } else {
      clearInterval(simulateMovement);
    }
  }, 3000);
  
  // Fit bounds to show the entire route
  map.fitBounds(routePath.getBounds(), { padding: [50, 50] });
  
  // Initialize vehicle list click handlers
  initVehicleListHandlers(map);
}

function updateTrackingInfo(current, total) {
  const etaElement = document.querySelector('.tracking-eta');
  const distanceElement = document.querySelector('.tracking-distance');
  
  if (etaElement) {
    const remainingPoints = total - current;
    const minutes = remainingPoints * 3; // 3 minutes per point
    etaElement.textContent = `${minutes} mins`;
  }
  
  if (distanceElement) {
    const remainingDistance = ((total - current) * 0.5).toFixed(1); // 0.5 km per point
    distanceElement.textContent = `${remainingDistance} km`;
  }
}

function initVehicleListHandlers(map) {
  const vehicleItems = document.querySelectorAll('.vehicle-item');
  
  vehicleItems.forEach(item => {
    item.addEventListener('click', function() {
      // Remove active class from all items
      vehicleItems.forEach(v => v.classList.remove('active'));
      
      // Add active class to clicked item
      this.classList.add('active');
      
      // Update map view (in a real app, this would show the selected vehicle)
      const vehicleId = this.getAttribute('data-vehicle-id');
      if (vehicleId) {
        // This would fetch real coordinates in a production app
        const newPosition = [
          51.505 + (Math.random() * 0.01),
          -0.09 + (Math.random() * 0.01)
        ];
        
        map.setView(newPosition, 15);
      }
    });
  });
}

// Form Validation
function validateBookingForm() {
  const pickup = document.getElementById('pickup').value;
  const dropoff = document.getElementById('dropoff').value;
  const date = document.getElementById('date').value;
  const time = document.getElementById('time').value;
  
  if (!pickup || !dropoff || !date || !time) {
    alert('Please fill in all required fields');
    return false;
  }
  
  return true;
}

// Fare Estimation
function updateFareEstimate() {
  const basePrice = 5.00;
  const distancePrice = Math.random() * 10 + 5; // Random distance price between 5-15
  const taxPrice = (basePrice + distancePrice) * 0.1; // 10% tax
  
  document.querySelector('.base-price').textContent = `$${basePrice.toFixed(2)}`;
  document.querySelector('.distance-price').textContent = `$${distancePrice.toFixed(2)}`;
  document.querySelector('.tax-price').textContent = `$${taxPrice.toFixed(2)}`;
  document.querySelector('.total-price').textContent = `$${(basePrice + distancePrice + taxPrice).toFixed(2)}`;
}

// Vehicle Selection
function selectVehicle(vehicleId) {
  document.querySelectorAll('.vehicle-option').forEach(option => {
    option.classList.remove('selected');
  });
  
  document.querySelector(`[data-vehicle-id="${vehicleId}"]`).classList.add('selected');
  document.getElementById('selectedVehicle').value = vehicleId;
  
  // Update fare estimate based on vehicle type
  updateFareEstimate();
}

// Role-Based Access Control
function initRBAC() {
  // Define user roles and permissions
  const roles = {
    admin: {
      name: 'Administrator',
      permissions: ['view_dashboard', 'book_trip', 'track_vehicles', 'manage_users', 'view_feedback', 'view_reports']
    },
    driver: {
      name: 'Driver',
      permissions: ['view_dashboard', 'track_vehicles', 'view_feedback']
    },
    passenger: {
      name: 'Passenger',
      permissions: ['book_trip', 'track_vehicles', 'view_feedback']
    }
  };
  
  // Get user role from localStorage or set default
  let userRole = localStorage.getItem('userRole') || 'passenger';
  
  // For demo purposes, allow role switching
  const roleSelect = document.getElementById('roleSelect');
  if (roleSelect) {
    roleSelect.value = userRole;
    roleSelect.addEventListener('change', function() {
      userRole = this.value;
      localStorage.setItem('userRole', userRole);
      applyRolePermissions(roles[userRole].permissions);
      updateUserInfo(roles[userRole].name);
    });
  }
  
  // Apply permissions based on role
  applyRolePermissions(roles[userRole].permissions);
  updateUserInfo(roles[userRole].name);
}

function applyRolePermissions(permissions) {
  // Menu items mapping to permissions
  const menuPermissions = {
    'menu-dashboard': 'view_dashboard',
    'menu-booking': 'book_trip',
    'menu-tracking': 'track_vehicles',
    'menu-users': 'manage_users',
    'menu-feedback': 'view_feedback',
    'menu-reports': 'view_reports'
  };
  
  // Show/hide menu items based on permissions
  Object.keys(menuPermissions).forEach(menuId => {
    const menuItem = document.getElementById(menuId);
    if (menuItem) {
      if (permissions.includes(menuPermissions[menuId])) {
        menuItem.style.display = 'flex';
      } else {
        menuItem.style.display = 'none';
      }
    }
  });
  
  // If current section is not allowed, switch to first allowed section
  const currentActiveMenu = document.querySelector('.menu-item.active');
  if (currentActiveMenu && currentActiveMenu.style.display === 'none') {
    const firstVisibleMenu = document.querySelector('.menu-item[style="display: flex;"]');
    if (firstVisibleMenu) {
      const sectionId = firstVisibleMenu.getAttribute('data-section');
      showSection(sectionId);
    }
  }
}

function updateUserInfo(roleName) {
  const userRoleElement = document.querySelector('.user-role');
  if (userRoleElement) {
    userRoleElement.textContent = roleName;
  }
  
  const userInitials = document.querySelector('.user-initials');
  if (userInitials) {
    // In a real app, this would use the actual user's initials
    userInitials.textContent = 'JD';
  }
}

// Rating System
function initRatingSystem() {
  const ratingStars = document.querySelectorAll('.rating-star');
  const ratingInput = document.getElementById('ratingValue');
  
  if (ratingStars.length && ratingInput) {
    ratingStars.forEach((star, index) => {
      star.addEventListener('click', () => {
        const rating = index + 1;
        ratingInput.value = rating;
        
        // Update stars UI
        ratingStars.forEach((s, i) => {
          if (i < rating) {
            s.classList.add('active');
          } else {
            s.classList.remove('active');
          }
        });
      });
      
      star.addEventListener('mouseover', () => {
        const rating = index + 1;
        
        // Update stars UI on hover
        ratingStars.forEach((s, i) => {
          if (i < rating) {
            s.classList.add('hover');
          } else {
            s.classList.remove('hover');
          }
        });
      });
      
      star.addEventListener('mouseout', () => {
        // Remove hover class
        ratingStars.forEach(s => {
          s.classList.remove('hover');
        });
      });
    });
  }
  
  // Handle feedback form submission
  const feedbackForm = document.getElementById('feedbackForm');
  if (feedbackForm) {
    feedbackForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const tripId = document.getElementById('tripId').value;
      const rating = document.getElementById('ratingValue').value;
      const comments = document.getElementById('comments').value;
      
      if (!tripId || !rating) {
        alert('Please provide a Trip ID and Rating');
        return;
      }
      
      // In a real app, this would submit to a server
      alert(`Thank you for your feedback! Trip ID: ${tripId}, Rating: ${rating}/5`);
      
      // Reset form
      this.reset();
      ratingStars.forEach(s => s.classList.remove('active'));
      ratingInput.value = '';
    });
  }
}