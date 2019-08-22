window.addEventListener('DOMContentLoaded', (e) => {
  fetchBoughtArticles();
  if(screen.width > 380){
    document.getElementById('menu-div').style.display = 'block';
  }
  else{
    document.getElementById('menu-div').style.display = 'none';
  }
});

let total = 0;
let bezPDV = 0;
let PDV = 0;


let dolari = {
  total: 0,
  PDV: 0,
  bezPDV: 0
};


function fetchBoughtArticles() {

  let articles = document.querySelector('.articles');
  let pricing = document.querySelector('.pricing-articles');
  let left = document.querySelector('.left');

  let counterArticles = 0;
  total = 0;
  bezPDV = 0;
  PDV = 0;
  articles.innerHTML = '';
  pricing.innerHTML = '';
  fetch('http://localhost:3000/shop')
    .then(function (response) {
      return response.json();
    })
    .then(function (myJson) {
      counterArticles = myJson.length;
      let articlesArray = [];
      myJson.forEach(function (item) {
        let counter = 0;
        if (articlesArray.indexOf(item.idPomocni) == -1) {
          // console.log(articlesArray);

          myJson.forEach(function (item2) {
            if (item.idPomocni == item2.idPomocni) {
              counter++;
              articlesArray.push(item.idPomocni);
            }
          });

          total += counter * parseFloat(item.cijena);

          articles.innerHTML += `
            <div class="dropdown-article">
               <div class="dropdown-article-img">
                 <img src="${item.slika}" alt="lapas">
               </div>
                <div class="dropdown-article-desc">
                   <h3> ${counter} x ${item.naziv}</h3>
                   <p>${item.cijena} KM</p>
                </div>
            </div>
            `;


        }

      });
      PDV = 17 / 100 * total;
      bezPDV = total - PDV;
      //Cijene se sendaju u localstorage
      dolari.PDV = PDV;
      dolari.bezPDV = bezPDV;
      dolari.total = total;

      pricing.innerHTML = `
        <div class="dropdown-price">
        <p>Dostava: <span>BESPLATNO</span></p>
        <p>Ukupno bez PDV-a: <span id="cijena">${bezPDV.toFixed(2)} KM</span></p>
        <p>Ukupan PDV (17%): <span id="pdv">${PDV.toFixed(2)} KM</span></p>
        <p>Ukupno: <span id="puna-cijena"> ${total.toFixed(2)} KM</span></p>
        </div>
        <a href="webshop.html" class="na-kasu">Na kasu <i class="fas fa-angle-right"></i></a>
        `;
      // console.log(total);

      let articlesCounter = document.querySelector('.articles-counter');
      let articlesTotalPrice = document.querySelector('.articles-total-price');

      articlesCounter.innerHTML = counterArticles;
      articlesTotalPrice.innerHTML = total.toFixed(2);
    });

}

function validateEmail(email) {
  var re = /\S+@\S+\.\S+/;
  return re.test(email);
}

function getLocalStorage(){
    let local = JSON.parse(localStorage.getItem('novac'));
    return local;
}
function saveUserToLocalStorage(user){
  if(localStorage.getItem('korisnik') === null){
    var korisnik = null;
    korisnik = user;
    localStorage.setItem('korisnik', JSON.stringify(korisnik));
  } else {
    var korisnik = JSON.parse(localStorage.getItem('korisnik'));
    korisnik = user;
    localStorage.setItem('korisnik', JSON.stringify(korisnik));
  }
}

function addUser(e) {
  let email = document.getElementById('email-adresa');
  let sifra = document.getElementById('sifra-1');

  let registracija = document.querySelector('.registracija');
  let prijava = document.querySelector('.prijava');

  registracija.addEventListener('click', function (e) {
    let temp = {
      email: email.value,
      sifra: sifra.value
    };
    
    if (validateEmail(email.value) && email.value !== '' && sifra.value.length > 4) {

      fetch('http://localhost:3000/korisnici', {
        method: 'POST',
        body: JSON.stringify(temp),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(res => res.json())
        .then(response => console.log('Success:', JSON.stringify(response)))
        .catch(error => console.error('Error:', error));

        email.value = '';
        sifra.value = '';
    }
    else{
      email.style.border = '1px solid red';
      sifra.style.border = '1px solid red';

    }
  });

  prijava.addEventListener('click', function(){
    let email2 = document.getElementById('email-adresa-2');
    let sifra2 = document.getElementById('sifra-2');

    let temp = {
      email: email2.value,
      sifra: sifra2.value
    };
  //   let a = document.querySelector('.right-section');
  //   a.innerHTML = `
  //   <ul class="list">
  //   <li class="list-item"><a href="#" class="list-item-link"><i class="far fa-user"></i> Moj račun <i
  //               class="fas fa-chevron-down small-size"></i></a></li>
  //   <li class="list-item"><a href="#" class="list-item-link"><i class="fas fa-sign-in-alt"></i>
  //           Odjava</a></li>
  // </ul>
  //   `;
    
    if(email2.value !== '' && sifra2.value !== ''){
      fetch('http://localhost:3000/korisnici')
        .then(function (response) {
          return response.json();
        })
        .then(function (myJson) {
          for(var i = 0; i < myJson.length; i++){
            if(myJson[i].email == temp.email && myJson[i].sifra == temp.sifra){
              let store = {
                email: myJson[i].email,
                sifra: myJson[i].sifra,
                id: myJson[i].id
              };
              saveUserToLocalStorage(store);
              document.querySelector('.section-sign-in').style.display = 'none';
              document.querySelector('.loader').style.display = 'block';
              setTimeout(function(){ 
                
                self.location = 'panel.html';
               }, 1500);
              
            }

          }
        });
    }
    else{
      email2.style.border = '1px solid red';
      sifra2.style.border = '1px solid red';
    }
  })

}

addUser();

document.querySelector('.cart').addEventListener('click', function(){
  self.location = 'webshop.html';
});

document.querySelector('.bars').addEventListener('click', function(e){
  let menu = document.getElementById('menu-div');
  if(e.target.classList.contains('bar-menu')){
    
    if (menu.style.display === "block") {
      menu.style.display = "none";
    } else {
      menu.style.display = "block";
    }
  }
  
});