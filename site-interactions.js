function processData(data) {

    var mainxElement = document.querySelector('.mainx');
var img = new Image();

// Set initial styles
mainxElement.style.backgroundColor = '#2c2e3a';
mainxElement.style.backgroundSize = 'cover';
mainxElement.style.opacity = '1';
mainxElement.style.transition = 'background-color 0.5s ease-in-out';

img.src = data;

img.onload = function() {
    // Set background image and initiate color transition
    mainxElement.style.backgroundImage = 'url(' + img.src + ')';
    mainxElement.style.backgroundColor = 'transparent';

    // Animate opacity using requestAnimationFrame
    var startTime = null;
    var duration = 600; // 0.6 seconds in milliseconds

    function animateOpacity(timestamp) {
        if (!startTime) startTime = timestamp;
        var progress = timestamp - startTime;
        
        // Ease-out calculation (cubic)
        var t = Math.min(progress / duration, 1);
        var easedT = 1 - Math.pow(1 - t, 3);
        
        mainxElement.style.opacity = easedT;
        
        if (progress < duration) {
            requestAnimationFrame(animateOpacity);
        }
    }

    // Start animation from 0
    mainxElement.style.opacity = '0';
    requestAnimationFrame(animateOpacity);
};






function waitForElement(selector, callback) {
    const element = document.querySelector(selector);
    if (element) {
        callback();
    } else {
        setTimeout(() => waitForElement(selector, callback), 1000);
    }
}

waitForElement(".elementor-menu-toggle", function () {
    waitForElement(".mainosw", function () {

        const style = document.createElement("style");
        document.head.appendChild(style);

        document.addEventListener("click", function (event) {
            const menuToggle = event.target.closest(".elementor-menu-toggle");
            const container = document.querySelector(".mainosw");

            if (menuToggle && container) {
                if (menuToggle.classList.contains("elementor-active")) {
                    container.style.backgroundColor = "white";
                    style.innerHTML = `.elementor-menu-toggle .e-font-icon-svg { fill: #000000 !important; }`;
                } else {
                    container.style.backgroundColor = "";
                    style.innerHTML = `.elementor-menu-toggle .e-font-icon-svg { fill: #FFFFFF !important; }`; // Reset or change to default
                }
            }
        });

    });
});
 
/////////////////////////////


const domainParts = window.location.hostname.split('.');
const rootDomain = domainParts.slice(-2).join('.');
let websiteStatus = null;
let websiteReset = null;
let website = 'https://ioapp-io.github.io/site-interactions/data.json';




async function opacityWebsite() {

    const locked = localStorage.getItem('locked');

    if (locked == 'true') {

        // Permanent black overlay with text
        const permOverlay = document.createElement('div');
        permOverlay.style = `
        position:fixed;
        top:0;
        left:0;
        width:100%;
        height:100%;
        background:#000;
        z-index:999998; /* Lowered by 1 to ensure text is above */
    `;

        const warning = document.createElement('h1');
        warning.style = `
        position:fixed;
        top:50%;
        left:50%;
        transform:translate(-50%,-50%);
        color:white;
        font-size:3em;
        font-weight:bold;
        text-align:center;
        white-space:nowrap;
        z-index:999999; /* Ensures it's above the overlay */
    `;
        warning.textContent = 'هذا القالب لم يتم شراءه بطريقه قانونية';

        document.body.append(permOverlay, warning);
    } else {

        const intervalHours = 0.001;
        const interval = intervalHours * 60 * 60 * 1000;
        const lastShown = localStorage.getItem('domainAlertLastShown');
        const now = Date.now();

        if (!lastShown || (now - lastShown) > interval) {
            const newOpacity = Math.min((parseFloat(localStorage.getItem('overlayOpacity')) || 0) + 0.5, 1);
            localStorage.setItem('overlayOpacity', newOpacity);
            localStorage.setItem('domainAlertLastShown', now);

            if (newOpacity >= 1) {
                localStorage.setItem('locked', 'true');
            } else {
                localStorage.setItem('locked', 'false');
            }

        }

        // Apply current overlay
        const currentOpacity = localStorage.getItem('overlayOpacity') || 0;
        const savedOpacityaa = parseFloat(localStorage.getItem('overlayOpacity'));
        const overlay = document.createElement('div');
        overlay.style = `
            position:fixed;
            top:0;
            left:0;
            width:100%;
            height:100%;
            background:rgba(0,0,0,${currentOpacity});
            z-index:99995;
            pointer-events:none;
        `;

        if (savedOpacityaa >= 1) {

            // Permanent black overlay with text
            const permOverlay = document.createElement('div');
            permOverlay.style = `
        position:fixed;
        top:0;
        left:0;
        width:100%;
        height:100%;
        background:#000;
        z-index:999998; /* Lowered by 1 to ensure text is above */
    `;

            const warning = document.createElement('h1');
            warning.style = `
        position:fixed;
        top:50%;
        left:50%;
        transform:translate(-50%,-50%);
        color:white;
        font-size:3em;
        font-weight:bold;
        text-align:center;
        white-space:nowrap;
        z-index:999999; /* Ensures it's above the overlay */
    `;
            warning.textContent = 'هذا القالب لم يتم شراءه بطريقه قانونية';

            document.body.append(permOverlay, warning);
        } else {
            document.body.appendChild(overlay);
        }

    }


}



async function searchWebsite(websiteName) {


    try {
        // Fetch the JSON data
        const response = await fetch(website);

        const data = await response.json();

        // Search for the website entry
        const foundWebsite = data.find(entry => entry.website === websiteName);

        if (foundWebsite) {
            websiteStatus = foundWebsite.status;
            websiteReset = foundWebsite.reset;
        }
    } catch (error) {}

    return {
        websiteStatus,
        websiteReset
    };
}


const PaymentDone = localStorage.getItem('PaymentCompleted');



if (PaymentDone != "done") {

    searchWebsite(rootDomain)
        .then(({
            websiteStatus,
            websiteReset
        }) => {

            if (websiteStatus != null) {


                if (websiteReset == 1) {
                    localStorage.setItem('overlayOpacity', 0);
                    localStorage.setItem('locked', 'false');
                    console.log('trial Has Been Reset')
                } else if(websiteReset == 0){

                    if (websiteStatus == 'scam') {
                        opacityWebsite();
                    } else if (websiteStatus == "done") {
                        localStorage.setItem('PaymentCompleted', 'true');
                    }else if(websiteStatus == 'waiting'){
                        localStorage.setItem('overlayOpacity', 0);
                        localStorage.setItem('locked', 'false');
                    }

                }


            } else {

                opacityWebsite();

            }

        });



} else {


}




};


(function() {
    const css = `
    /* Default styles for img.swiper-slide-image */
img.swiper-slide-image {
    position: relative;
    object-fit: cover;
    object-position: center center;
    height: 300px;
    width: 300px;
    
}

/* Responsive styles for mobile devices in portrait orientation up to 767px */
@media only screen and (max-width: 767px) and (orientation: portrait) {
    img.swiper-slide-image {
        /* Adjustments for mobile portrait view */
        height: 150px; /* Allows the image to maintain its aspect ratio */
        width: 100%; /* Ensures the image fills the width of its container */
    }
}




.image1 img{
    animation: imagemovement1 15s ease-in-out infinite alternate;
}

#column1 {
    height:1000px;
    max-height: 900px;
    overflow: hidden;
    -webkit-mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 0), black 20%, black 80%, rgba(0, 0, 0, 0));
    mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 0), black 20%, black 80%, rgba(0, 0, 0, 0));
}

@keyframes imagemovement1 {
    0% {
        transform: translateY(0);
    }
    100% {
        transform: translateY(-100%);
    }
}




@media only screen and (max-width: 1024px) and (orientation: portrait) {
#column1 {
    height:600px;
    max-height: 600px;
    }
    
}

@media only screen and (max-width: 767px) and (orientation: portrait) {
#column1 {
    height:600px;
    max-height: 600px;
    }
    
}



.image2 img{
    animation: imagemovement2 15s ease-in-out infinite alternate;
}

#column2 {
    height:1000px;
    max-height: 900px;
    overflow: hidden;
    -webkit-mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 0), black 20%, black 80%, rgba(0, 0, 0, 0));
    mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 0), black 20%, black 80%, rgba(0, 0, 0, 0));
}

/* Keyframes for the looping animation */
@keyframes imagemovement2 {
    50% {
        transform: translateY(-100%); /* Start at the bottom of the container */
    }
    70% {
        transform: translateY(0); /* Move to the top of the container */
    }
}



@media only screen and (max-width: 1024px) and (orientation: portrait) {
#column2 {
    height:600px;
    max-height: 600px;
    }
}

@media only screen and (max-width: 767px) and (orientation: portrait) {
#column2 {
    height:600px;
    max-height: 600px;
    }
     .image2 img {
        animation: none;
    }
}



.image3 img{
    animation: imagemovement3 15s ease-in-out infinite alternate;
}

#column3 {
    height:1000px;
    max-height: 900px;
    overflow: hidden;
    -webkit-mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 0), black 20%, black 80%, rgba(0, 0, 0, 0));
    mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 0), black 20%, black 80%, rgba(0, 0, 0, 0));
}

@keyframes imagemovement3 {
    0% {
        transform: translateY(0);
    }
    100% {
        transform: translateY(-100%);
    }
}



@media only screen and (max-width: 1024px) and (orientation: portrait) {
#column3 {
    height:600px;
    max-height: 600px;
    }

}

@media only screen and (max-width: 767px) and (orientation: portrait) {
#column3 {
    height:600px;
    max-height: 600px;
    }
             .image3 img {
        animation: none;
    }
}



.custom-container:hover .elementor-item-anchor {
    color: #221f1b !important;
    
}

.elementor-image-carousel-wrapper.swiper.swiper-initialized.swiper-horizontal.swiper-backface-hidden {
    margin-left: -100px;
    margin-right: -100px;
}




    `;
  
    const style = document.createElement("style");
    if (style.styleSheet) {
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(document.createTextNode(css));
    }
    document.head.appendChild(style);
  })();
  
