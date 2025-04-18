const nav = document.querySelector('.nav')
const logo = document.querySelector('.nav-logo svg');
const progressBar = document.querySelector('.progress-container');
window.addEventListener('scroll', fixNav)

logo.querySelectorAll('path').forEach(path => {
    path.setAttribute('fill', 'white');
});

window.onscroll = function() {scrollProgress()};
function scrollProgress() {
    var winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    var height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    var scrolled = (winScroll / height) * 100;
    progressBar.style.width = scrolled + "%";
}

function fixNav() {

    if (window.scrollY > 0) {
        nav.classList.add('active');
        nav.classList.add('nav-scrolled');
        progressBar.classList.add('scrolled');
    } else {
        nav.classList.remove('active');
        nav.classList.remove('nav-scrolled');
        progressBar.classList.remove('scrolled');
    }
}

document.querySelector('.nav-logo').addEventListener('click', function (e) {
    e.preventDefault();
    document.querySelector('body').scrollIntoView({
        behavior: 'smooth'
    });
});

document.querySelectorAll('.nav-container a').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

var txt = "Bienvenue sur le site de la CGT Alteia";
const headerContent = document.getElementById('header-title');
let i = 0;
const speed = 100;

function typeWriter() {
    if (i < txt.length) {
      headerContent.innerHTML += txt.charAt(i);
      i++;
      setTimeout(typeWriter, speed);
    }
  }

typeWriter();

document.addEventListener('DOMContentLoaded', function () {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const title = item.querySelector('.faq-title');

        title.addEventListener('click', () => {
            // Close all other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });

            // Toggle current item
            item.classList.toggle('active');
        });
    });
});

function initMap() {

    /* markers */
    const markers = [
        {
            position: { lat: 43.609080040558375, lng: 1.4367670648787751 },
            title: "Union Départementale - Bourse du Travail de Toulouse",
            address: "19 Pl. Saint-Sernin, 31000 Toulouse",
            phone: "05 61 21 53 75",
        },
        {
            position: { lat: 43.541360527559846, lng: 1.5225178242916866 },
            title: "Union Locale de Labège",
            address: "2058 Rte de Baziege la Lauragaise, 31670 Labège",
            phone: "05 61 80 01 99"
        },
        {
            position: { lat: 43.54355109518269, lng: 1.5079677919071945 },
            title: "Section Syndicale CGT Alteia",
            address: "1 L'Occitane, 31670 Labège",
            phone: "06 46 76 55 54"
        },
    ]
    /* center of the map is average position of all markers */
    const bounds = new google.maps.LatLngBounds();

    const customIcon = "./poi.svg";

    const mapOptions = {
        zoom: 12,
        styles: [
            { featureType: "all", elementType: "labels", stylers: [{ visibility: "simplified" }] },
            { featureType: "all", elementType: "labels.text", stylers: [{ color: "#444444" }] },
            { featureType: "administrative.country", elementType: "all", stylers: [{ visibility: "simplified" }] },
            { featureType: "administrative.country", elementType: "geometry", stylers: [{ visibility: "simplified" }] },
            { featureType: "administrative.province", elementType: "all", stylers: [{ visibility: "off" }] },
            { featureType: "administrative.locality", elementType: "all", stylers: [{ visibility: "simplified" }, { saturation: -100 }, { lightness: 30 }] },
            { featureType: "administrative.neighborhood", elementType: "all", stylers: [{ visibility: "off" }] },
            { featureType: "administrative.land_parcel", elementType: "all", stylers: [{ visibility: "off" }] },
            { featureType: "landscape", elementType: "all", stylers: [{ visibility: "simplified" }, { gamma: 0.00 }, { lightness: 74 }] },
            { featureType: "landscape", elementType: "geometry", stylers: [{ color: "#ffffff" }] },
            { featureType: "poi", elementType: "all", stylers: [{ visibility: "off" }] },
            { featureType: "road", elementType: "geometry", stylers: [{ visibility: "simplified" }, { color: "#ff0000" }, { saturation: -15 }, { lightness: 40 }, { gamma: 1.25 }] },
            { featureType: "road", elementType: "labels", stylers: [{ visibility: "off" }] },
            { featureType: "transit", elementType: "labels", stylers: [{ visibility: "simplified" }] },
            { featureType: "transit", elementType: "labels.icon", stylers: [{ visibility: "off" }] },
            { featureType: "transit.line", elementType: "geometry", stylers: [{ color: "#ff0000" }, { lightness: 80 }] },
            { featureType: "transit.station", elementType: "geometry", stylers: [{ color: "#e5e5e5" }] },
            { featureType: "water", elementType: "geometry", stylers: [{ color: "#efefef" }] },
            { featureType: "water", elementType: "labels", stylers: [{ visibility: "off" }] }
        ]
    };

    const map = new google.maps.Map(document.getElementById('google-map'), mapOptions);

    const infoWindow = new google.maps.InfoWindow({
        minWidth: 200,
        maxWidth: 200
    });

    markers.forEach(marker => {
        const markerObj = new google.maps.Marker({
            position: marker.position,
            map: map,
            title: marker.title,
            icon: customIcon
        });

        markerObj.addListener('click', () => {
            infoWindow.setContent(`
                <div class="info-window">
                    <h3>${marker.title}</h3>
                    <address>
                        <p>${marker.address}</p>
                    </address>
                    <p>${marker.phone}</p>
                </div>
            `);
            infoWindow.open(map, markerObj);
        });


        bounds.extend(new google.maps.LatLng(marker.position.lat, marker.position.lng));
    });
    
    map.fitBounds(bounds);

}