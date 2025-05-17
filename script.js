  // Menu mobile
  function initMobileMenu() {
    const menuButton = document.getElementById('mobileMenuButton');
    const mobileMenu = document.getElementById('mobileMenu');
      
      menuButton.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });
  }

  function onSubmit(token) {
    const form = document.getElementById('contactForm');
    const submitBtn = form.querySelector('button[type="submit"]');

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="bx bx-loader bx-spin mr-2"></i> Envoi en cours...';

    fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: {
        'Accept': 'application/json'
      }
    })
    .then(response => {
      if (response.ok) {
        alert('Message envoyé avec succès !');
        form.reset();
      } else {
        throw new Error('Erreur réseau');
      }
    })
    .catch(error => {
      alert('Erreur : ' + error.message);
    })
    .finally(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="bx bx-send mr-2"></i> Envoyer le message';
    });
  }

  function toggleFAQ(id) {
    const answer = document.getElementById(`faq-answer-${id}`);
    const isOpen = answer.style.maxHeight && answer.style.maxHeight !== "0px";
    answer.style.maxHeight = isOpen ? "0" : answer.scrollHeight + "px";
  }
  // Fonction pour afficher ou cacher la réponse à une question
function toggleFAQ(id) {
  const answer = document.getElementById(`faq-answer-${id}`);
  const icon = document.querySelector(`#faq-answer-${id} + .flex i`);
  if (answer.style.maxHeight) {
    answer.style.maxHeight = null;
    icon.classList.replace('bx-chevron-up', 'bx-chevron-down');
  } else {
    answer.style.maxHeight = answer.scrollHeight + "px";
    icon.classList.replace('bx-chevron-down', 'bx-chevron-up');
  }
}

// Fonction pour filtrer les questions en fonction de la catégorie
function filterFAQ(category) {
  const faqItems = document.querySelectorAll('.faq-item');
  const categoryButtons = document.querySelectorAll('.faq-category-btn');

  faqItems.forEach(item => {
    if (category === 'all' || item.dataset.category === category) {
      item.style.display = 'block';
    } else {
      item.style.display = 'none';
    }
  });

  categoryButtons.forEach(button => {
    if (button.getAttribute('data-category-btn') === category) {
      button.classList.add('active-category');
    } else {
      button.classList.remove('active-category');
    }
  });
}

// Fonction de recherche pour filtrer les FAQ
function searchFAQ() {
  const query = document.getElementById('faqSearch').value.toLowerCase();
  const faqItems = document.querySelectorAll('.faq-item');
  let hasResults = false;

  faqItems.forEach(item => {
    const questionText = item.querySelector('h3').textContent.toLowerCase();
    if (questionText.includes(query)) {
      item.style.display = 'block';
      hasResults = true;
    } else {
      item.style.display = 'none';
    }
  });

  const noResultsMessage = document.getElementById('noResults');
  if (hasResults) {
    noResultsMessage.classList.add('hidden');
  } else {
    noResultsMessage.classList.remove('hidden');
  }
}

// Initialiser l'affichage par défaut des FAQ
document.addEventListener('DOMContentLoaded', () => {
  filterFAQ('all');
});

 // Données des contacts avec coordonnées GPS
    const contacts = [
      {
        id: 1,
        name: "SAMU - Urgences Médicales",
        number: "112",
        city: "Tout le Bénin",
        category: "urgence",
        subcategory: "medicale",
        price: 0,
        rating: 4.8,
        calls: 890,
        certified: true,
        premium: false,
        location: { lat: 6.3728, lng: 2.3596 } // Cotonou
      },
      {
        id: 2,
        name: "Hôpital Saint Jean de Dieu",
        number: "+229 21 34 12 34",
        city: "Ouidah",
        category: "sante",
        subcategory: "hopital",
        price: 0,
        rating: 4.1,
        calls: 320,
        certified: true,
        premium: false,
        location: { lat: 6.3639, lng: 2.0851 } // Ouidah
      },
      {
        id: 3,
        name: "Plombier Express Ouidah",
        number: "+229 97 85 43 21",
        city: "Ouidah",
        category: "artisan",
        subcategory: "plombier",
        price: 250,
        rating: 4.4,
        calls: 145,
        certified: true,
        premium: true,
        location: { lat: 6.3650, lng: 2.0900 } // Ouidah
      },
      {
        id: 4,
        name: "Police Nationale",
        number: "117",
        city: "Tout le Bénin",
        category: "urgence",
        subcategory: "police",
        price: 0,
        rating: 4.3,
        calls: 765,
        certified: true,
        premium: false,
        location: { lat: 6.3667, lng: 2.4167 } // Cotonou
      },
      {
        id: 5,
        name: "Taxi Moto Ouidah Express",
        number: "+229 96 54 32 10",
        city: "Ouidah",
        category: "transport",
        subcategory: "moto",
        price: 150,
        rating: 3.9,
        calls: 310,
        certified: true,
        premium: false,
        location: { lat: 6.3640, lng: 2.0860 } // Ouidah
      },
      {
        id: 6,
        name: "Clinique La Croix",
        number: "+229 21 30 45 67",
        city: "Cotonou",
        category: "sante",
        subcategory: "clinique",
        price: 0,
        rating: 4.2,
        calls: 230,
        certified: true,
        premium: true,
        location: { lat: 6.3680, lng: 2.4250 } // Cotonou
      }
    ];

    // Variables globales
    let userLocation = null;
    let currentContacts = [];
    let MAX_DISTANCE_KM = 10; // Valeur par défaut
    let map = null;

    // Initialisation
    document.addEventListener('DOMContentLoaded', function() {
      initMobileMenu();
      loadContacts(contacts);
      initLocationButton();
      initTestimonials();
      setupFilters();
      setupPaymentModal();
    });

    // Chargement initial des contacts
    function loadContacts(contactsData) {
      currentContacts = contactsData;
      displayContacts(currentContacts);
      updateCityFilterOptions(currentContacts);
    }

    // Bouton de géolocalisation
    function initLocationButton() {
      const locationBtn = document.getElementById('locationFilter');
      locationBtn.addEventListener('click', requestUserLocation);
    }

    // Demande la localisation
    function requestUserLocation() {
      const statusElement = document.getElementById('locationStatus');
      
      statusElement.innerHTML = '<i class="bx bx-loader-circle bx-spin"></i> Localisation en cours...';
      
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          position => {
            userLocation = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            statusElement.innerHTML = '<i class="bx bx-check-circle"></i> Localisation activée';
            filterNearbyContacts();
          },
          error => {
            console.error("Erreur de géolocalisation:", error);
            statusElement.innerHTML = '<i class="bx bx-error-circle"></i> ' + 
              (error.code === error.PERMISSION_DENIED 
                ? 'Autorisation refusée' 
                : 'Localisation non disponible');
          },
          { enableHighAccuracy: true, timeout: 10000 }
        );
      } else {
        statusElement.innerHTML = '<i class="bx bx-error-circle"></i> Géolocalisation non supportée';
      }
    }

    // Filtre les contacts proches
    function filterNearbyContacts() {
      if (!userLocation) return;
      
      const nearbyContacts = contacts.filter(contact => {
        if (!contact.location) return false;
        const distance = calculateDistance(
          userLocation.lat, 
          userLocation.lng,
          contact.location.lat,
          contact.location.lng
        );
        contact.distance = distance; // Stocke la distance pour l'affichage
        return distance <= MAX_DISTANCE_KM;
      });

      // Trie par distance
      nearbyContacts.sort((a, b) => a.distance - b.distance);
      
      currentContacts = nearbyContacts;
      displayContacts(currentContacts);
      displayMap(currentContacts);
    }

    // Calcul de distance (formule Haversine)
    function calculateDistance(lat1, lon1, lat2, lon2) {
      const R = 6371; // Rayon de la Terre en km
      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLon = (lon2 - lon1) * Math.PI / 180;
      const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      return R * c;
    }

    // Affichage de la carte
    function displayMap(contactsToShow) {
      const mapContainer = document.getElementById('mapContainer');
      mapContainer.classList.remove('hidden');
      
      // Réinitialise la carte si elle existe déjà
      if (map) {
        map.remove();
      }
      
      // Crée un nouvel élément div pour la carte
      const mapDiv = document.createElement('div');
      mapDiv.id = 'map';
      mapContainer.innerHTML = '';
      mapContainer.appendChild(mapDiv);
      
      // Initialisation de la carte
      map = L.map('map').setView([userLocation.lat, userLocation.lng], 13);
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }).addTo(map);

      // Marqueur pour la position utilisateur
      L.marker([userLocation.lat, userLocation.lng], {
        icon: L.icon({
          iconUrl: 'https://cdn.jsdelivr.net/npm/leaflet@1.7.1/dist/images/marker-icon.png',
          shadowUrl: 'https://cdn.jsdelivr.net/npm/leaflet@1.7.1/dist/images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41]
        })
      })
      .bindPopup("<b>Votre position</b>")
      .addTo(map);

      // Marqueurs pour les contacts
      contactsToShow.forEach(contact => {
        if (contact.location) {
          L.marker([contact.location.lat, contact.location.lng])
            .bindPopup(`
              <b>${contact.name}</b><br>
              <i class='bx bx-phone'></i> ${contact.number}<br>
              <i class='bx bx-map'></i> ${contact.city}<br>
              ${contact.distance ? `<i class='bx bx-map-pin'></i> ${contact.distance.toFixed(1)} km` : ''}
            `)
            .addTo(map);
        }
      });
    }

    // Mise à jour des options de filtre par ville
    function updateCityFilterOptions(contacts) {
      const cityFilter = document.getElementById('cityFilter');
      
      // Garde seulement l'option "Toutes les villes"
      while (cityFilter.options.length > 1) {
        cityFilter.remove(1);
      }
      
      // Récupère les villes uniques
      const uniqueCities = [...new Set(contacts.map(contact => contact.city))];
      
      // Trie par ordre alphabétique
      uniqueCities.sort();
      
      // Ajoute les options de ville
      uniqueCities.forEach(city => {
        const option = document.createElement('option');
        option.value = city;
        option.textContent = city;
        cityFilter.appendChild(option);
      });
    }

    // Affichage des contacts
    function displayContacts(contactsToShow) {
      const container = document.getElementById('contactsContainer');
      container.innerHTML = '';

      if (contactsToShow.length === 0) {
        container.innerHTML = `
          <div class="col-span-full text-center py-10">
            <i class='bx bx-search-alt-2 text-4xl text-gray-400 mb-3'></i>
            <p class="text-gray-600">Aucun résultat trouvé</p>
            <button onclick="resetFilters()" class="mt-4 text-green-600 font-medium">
              Réinitialiser les filtres
            </button>
          </div>
        `;
        return;
      }

      contactsToShow.forEach(contact => {
        const contactCard = document.createElement('div');
        contactCard.className = 'bg-white rounded-lg shadow-md overflow-hidden contact-card transition duration-300';
        
        let distanceInfo = '';
        if (contact.distance) {
          distanceInfo = `
            <div class="mt-2 flex items-center text-blue-600 text-sm">
              <i class='bx bx-map-pin mr-1'></i>
              <span>À ${contact.distance.toFixed(1)} km</span>
            </div>
          `;
        }
        
        contactCard.innerHTML = `
          <div class="p-5">
            <div class="flex justify-between items-start">
              <h3 class="text-xl font-bold text-gray-800">${contact.name}</h3>
              ${contact.certified ? 
                '<span class="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center">' +
                  '<i class="bx bx-check-shield mr-1"></i> Certifié' +
                '</span>' : ''}
            </div>
            
            <div class="mt-2 flex items-center text-gray-600 text-sm">
              <i class="bx bx-category mr-2"></i>
              <span>${formatCategory(contact.subcategory)}</span>
            </div>
            
            <div class="mt-2 flex items-center text-gray-600">
              <i class="bx bx-map mr-2"></i>
              <span>${contact.city}</span>
            </div>
            
            ${distanceInfo}
            
            <div class="mt-4 flex justify-between items-center">
              <div class="text-2xl font-bold text-green-600">${contact.number}</div>
              <div class="flex items-center">
                ${generateRatingStars(contact.rating)}
                <span class="ml-1 text-gray-500 text-sm">${contact.rating.toFixed(1)}</span>
              </div>
            </div>
            
            <div class="mt-4 flex items-center text-gray-500 text-sm">
              <i class="bx bx-phone-call mr-1"></i>
              <span>${contact.calls || 0} appels</span>
            </div>
            
            <div class="mt-5 pt-4 border-t border-gray-100">
              ${contact.premium ? `
                <button class="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 py-2 rounded-lg font-bold flex items-center justify-center transition">
                  <i class="bx bx-crown mr-2"></i> Premium
                </button>
              ` : `
                ${contact.price > 0 ? `
                  <button onclick="initMoMoPayment(${contact.id})" 
                    class="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded-lg flex items-center justify-center transition">
                    <i class="bx bx-credit-card mr-2"></i> Payer (${contact.price} FCFA)
                  </button>
                ` : `
                  <a href="tel:${contact.number.replace(/\s+/g, '')}" 
                    class="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg flex items-center justify-center transition">
                    <i class="bx bx-phone mr-2"></i> Appeler gratuit
                  </a>
                `}
              `}
            </div>
          </div>
        `;
        container.appendChild(contactCard);
      });
    }

    // Formatage des catégories pour affichage
    function formatCategory(subcategory) {
      const categories = {
        "medicale": "Urgence médicale",
        "police": "Police",
        "hopital": "Hôpital",
        "pharmacie": "Pharmacie",
        "plombier": "Plombier",
        "electricien": "Électricien",
        "moto": "Moto-taxi",
        "restaurant": "Restaurant",
        "hotel": "Hôtel",
        "clinique": "Clinique"
      };
      return categories[subcategory] || subcategory;
    }

    // Génération des étoiles de notation
    function generateRatingStars(rating) {
      let stars = '';
      for (let i = 1; i <= 5; i++) {
        if (i <= Math.floor(rating)) {
          stars += '<i class="bx bxs-star text-yellow-400"></i>';
        } else if (i === Math.ceil(rating) && rating % 1 > 0) {
          stars += '<i class="bx bxs-star-half text-yellow-400"></i>';
        } else {
          stars += '<i class="bx bx-star text-yellow-400"></i>';
        }
      }
      return stars;
    }

    // Configuration des filtres
    function setupFilters() {
      const filters = {
        city: 'all',
        category: 'all',
        rating: 0,
        price: 'all',
        search: ''
      };

      // Écouteurs d'événements
      document.getElementById('cityFilter').addEventListener('change', (e) => {
        filters.city = e.target.value;
        applyFilters(filters);
      });

      document.getElementById('categoryFilter').addEventListener('change', (e) => {
        filters.category = e.target.value;
        applyFilters(filters);
      });

      document.getElementById('ratingFilter').addEventListener('change', (e) => {
        filters.rating = parseInt(e.target.value);
        applyFilters(filters);
      });

      document.getElementById('priceFilter').addEventListener('change', (e) => {
        filters.price = e.target.value;
        applyFilters(filters);
      });

      document.getElementById('searchInput').addEventListener('input', (e) => {
        filters.search = e.target.value.toLowerCase();
        applyFilters(filters);
      });

      document.getElementById('distanceFilter').addEventListener('change', function(e) {
        MAX_DISTANCE_KM = parseInt(e.target.value);
        if (userLocation) {
          filterNearbyContacts();
        }
      });
    }

    // Application des filtres
    function applyFilters(filters) {
      const filtered = contacts.filter(contact => {
        // Filtre ville
        if (filters.city !== 'all' && contact.city !== filters.city) return false;
        
        // Filtre catégorie
        if (filters.category !== 'all' && contact.category !== filters.category) return false;
        
        // Filtre note
        if (contact.rating < filters.rating) return false;
        
        // Filtre prix
        if (filters.price === 'free' && contact.price > 0) return false;
        if (filters.price === 'paid' && contact.price <= 0) return false;
        
        // Filtre recherche
        if (filters.search && 
            !contact.name.toLowerCase().includes(filters.search) && 
            !contact.number.includes(filters.search) &&
            !contact.city.toLowerCase().includes(filters.search)) {
          return false;
        }
        
        return true;
      });

      currentContacts = filtered;
      displayContacts(currentContacts);
      
      // Cache la carte si on utilise des filtres normaux
      if (filters.city !== 'all' || filters.category !== 'all' || filters.search !== '') {
        document.getElementById('mapContainer').classList.add('hidden');
      }
    }

    // Initialisation des témoignages
    function initTestimonials() {
      const testimonials = [
        {
          name: "Kévin D.",
          city: "Cotonou",
          text: "J'ai trouvé un électricien en 5 minutes à minuit quand j'avais une panique. Sauveur !",
          rating: 5
        },
        {
          name: "Aïcha M.",
          city: "Parakou",
          text: "La géolocalisation m'a permis de trouver une pharmacie de garde à 500m de chez moi.",
          rating: 4
        },
        {
          name: "Pascal T.",
          city: "Porto-Novo",
          text: "Les numéros certifiés sont vraiment fiables. J'ai résolu mon problème de plomberie rapidement.",
          rating: 5
        }
      ];
      
      const container = document.getElementById('testimonialsContainer');
      if (!container) return;
      
      container.innerHTML = testimonials.map(testimonial => `
        <div class="bg-white p-6 rounded-lg shadow-md">
          <div class="flex mb-4">
            ${generateRatingStars(testimonial.rating)}
          </div>
          <p class="text-gray-700 mb-4">"${testimonial.text}"</p>
          <div class="flex items-center">
            <div class="bg-green-100 text-green-800 rounded-full w-10 h-10 flex items-center justify-center mr-3">
              ${testimonial.name.charAt(0)}
            </div>
            <div>
              <h4 class="font-medium">${testimonial.name}</h4>
              <p class="text-sm text-gray-600">${testimonial.city}</p>
            </div>
          </div>
        </div>
      `).join('');
    }

    // Configuration du modal de paiement
    function setupPaymentModal() {
      document.getElementById('confirmPayment').addEventListener('click', function() {
        const momoNumber = document.getElementById('momoNumber').value;
        if (!momoNumber || !momoNumber.startsWith('229') || momoNumber.length !== 11) {
          alert('Veuillez entrer un numéro MoMo valide (229XXXXXXXX)');
          return;
        }
        
        // Simulation de paiement
        alert(`Paiement initié vers ${momoNumber}. En production, intégrez l'API MoMo ici.`);
        closeModal('paymentModal');
      });
    }

    // Fonctions globales
    window.openModal = function(modalId) {
      document.getElementById(modalId).classList.remove('hidden');
    };

    window.closeModal = function(modalId) {
      document.getElementById(modalId).classList.add('hidden');
    };

    window.initMoMoPayment = function(contactId) {
      const contact = contacts.find(c => c.id === contactId);
      if (!contact) return;

      document.getElementById('paymentAmount').textContent = contact.price;
      document.getElementById('paymentContact').textContent = contact.name;
      openModal('paymentModal');
    };

    window.initMoMoSubscription = function(plan) {
  const amount = plan === 'monthly' ? 3000 : 30000;
  const description = plan === 'monthly' ? 'Abonnement mensuel' : 'Abonnement annuel';

  // Simulation de l'API MoMo
  alert(`Initialisation du paiement MoMo pour ${description} (${amount} FCFA). En production, intégrez l'API réelle ici.`);

  // Simulation de paiement réussi
  setTimeout(() => {
    closeModal('subscriptionModal');
    alert(`Paiement de ${amount} FCFA réussi ! Vous êtes maintenant abonné Premium.`);
    // Ici vous activeriez le statut premium en backend
  }, 2000);
};


    window.resetFilters = function() {
      document.getElementById('cityFilter').value = 'all';
      document.getElementById('categoryFilter').value = 'all';
      document.getElementById('ratingFilter').value = '0';
      document.getElementById('priceFilter').value = 'all';
      document.getElementById('searchInput').value = '';
      document.getElementById('distanceFilter').value = '10';
      MAX_DISTANCE_KM = 10;
      
      currentContacts = contacts;
      displayContacts(currentContacts);
      document.getElementById('mapContainer').classList.add('hidden');
      document.getElementById('locationStatus').innerHTML = '';
    };
  