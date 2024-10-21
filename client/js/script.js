const navLinks = document.querySelector('.nav__links');
const menuOpen = document.getElementById('menuOpen');
const menuClose = document.getElementById('menuClose');

menuOpen.addEventListener('click', () => {
    navLinks.classList.add('active');
    menuClose.style.display = 'block'; 
    menuOpen.style.display = 'none'; 
});

menuClose.addEventListener('click', () => {
    navLinks.classList.remove('active');
    menuOpen.style.display = 'block';
    menuClose.style.display = 'none';
});




document.querySelector('.sidebar__toggle').addEventListener('click', () => {
    document.querySelector('.sidebar').classList.toggle('hidden');
});

document.getElementById('loadMoreBtn').addEventListener('click', function() {
    const servicesContainer = document.querySelector('.services__grid');
  
    const newServices = `
      <div class="service">
        <img src="https://up.yimg.com/ib/th?id=OIP.NGRHa1I2fO2MM4qXmptBTwHaHa&pid=Api&rs=1&c=1&qlt=95&w=108&h=108" alt="Mental Health Support">
        <h3>Mental Health Support</h3>
        <p>Access online counseling sessions and mental health support from licensed professionals to help you with stress, anxiety, and more.</p>
      </div>
  
      <div class="service">
        <img src="https://up.yimg.com/ib/th?id=OIP.0JSBqjChMv8V2p_d07-1nAHaHa&pid=Api&rs=1&c=1&qlt=95&w=115&h=115" alt="Nutrition Consultation">
        <h3>Nutrition Consultation</h3>
        <p>Get personalized meal plans and dietary advice from certified nutritionists to help you meet your health and wellness goals.</p>
      </div>
  
      <div class="service">
        <img src="https://up.yimg.com/ib/th?id=OIP.1dYTGhkdSdiRjjzsww1ttQHaHg&pid=Api&rs=1&c=1&qlt=95&w=103&h=105" alt="Vaccine Reminders">
        <h3>Vaccine Reminders</h3>
        <p>Receive timely reminders for vaccines and immunizations for you and your family, and keep your health records up to date.</p>
      </div>
  
      <div class="service">
        <img src="https://up.yimg.com/ib/th?id=OIP.6mOxVSEqVffKl0ps_Ugk9QHaHa&pid=Api&rs=1&c=1&qlt=95&w=108&h=108" alt="Fitness Trainer">
        <h3>Fitness Trainer</h3>
        <p>Get access to personalized fitness plans and virtual workouts from certified trainers to help you stay in shape from home.</p>
      </div>
    `;
  
    servicesContainer.innerHTML += newServices;

    this.style.display = 'none';
  });


var swiper = new Swiper(".mySwiper", {
    pagination: {
        el: ".swiper-pagination",
        clickable: true,
    },
    slidesPerView: 1,
    spaceBetween: 30,
    centeredSlides: true,
    loop: true,
    autoplay: {
        delay: 3000,
        disableOnInteraction: false,
    },
    breakpoints: {
        640: {
            slidesPerView: 2,
        }
    }
});
  