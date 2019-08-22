const modal = document.querySelector('#my-modal');
const modalBtn = document.querySelector('.modal-btn');

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
    total : 0,
    PDV : 0,
    bezPDV : 0
  };
  
  
  function fetchBoughtArticles(){

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
        myJson.forEach(function(item){
          let counter = 0;
          if(articlesArray.indexOf(item.idPomocni) == -1) {
            // console.log(articlesArray);
  
            myJson.forEach(function(item2){
              if(item.idPomocni == item2.idPomocni){
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

  document.querySelector('.buy-artical').addEventListener('click', function (e) {
    window.stop();//Ne radi sa Edge meščini
    let kupljeniArtikal = null;
    if (e.target.classList.contains('modal-btn')) {
     
      let url;
      let naslov;
      fetch('http://localhost:3000/artikli')
        .then(function (response) {
          return response.json();
        })
        .then(function (myJson) {
          // console.log(myJson);
          myJson.forEach(function (item) {
            if (item.id === e.target.id) {
              url = item.slika;
              naslov = item.naziv;
              kupljeniArtikal = item;
            }
          });
          modal.innerHTML = `
          <div class="modal-content">
          <div class="modal-header">
              <h2><i class="fas fa-check"></i> Proizvod je dodan u korpu.</h2>
          </div>
          <div class="modal-body">
              <div class="modal-body-img">
                  <img src="${url}" alt="laptop">
              </div>
              <div class="modal-body-desc">
                  <h2 class="heading">${naslov}</h2>
                  
                  <div class="buttons">
                      <a href="#" class="continue"><i class="fas fa-arrow-left"></i> Nastavi sa kupovinom</a>
                      <a href=#" class="finish">Završi sa kupovinom <i class="fas fa-chevron-right"></i></a>
                  </div>
              </div>
          </div>
      </div>
          `;

          fetch('http://localhost:3000/shop', {
  
            method: 'POST',
            headers: {
              'Accept': 'application/json, text/plain, */*',
              'Content-type': 'application/json'
            },
            body: JSON.stringify({ idPomocni: kupljeniArtikal.id, naziv: kupljeniArtikal.naziv, cijena: kupljeniArtikal.cijena, slika: kupljeniArtikal.slika })
          })
            .then((res) => res.json())
  
  
        });
      openModal();
  
    }
  });

  modal.addEventListener('click', function (e) {
    if (e.target.classList.contains('continue')) {
      
      fetchBoughtArticles();
  
      closeModal();
    }
  });

  modal.addEventListener('click', function (e) {
 
  
    if (e.target.classList.contains('finish')) {
      
      fetchBoughtArticles();
      // closeModal();
      setTimeout(function(){
        self.location = 'webshop.html';
        }, 500);
      
    }
  });

  function openModal() {
    modal.style.display = 'block';
  }
  
  // Close
  function closeModal() {
    modal.style.display = 'none';
  }
  
  // Close If Outside Click
  function outsideClick(e) {
    if (e.target == modal) {
      modal.style.display = 'none';
    }
  }

  function setLocalStorage(){
    if(localStorage.getItem('novac') === null){
  
      var novac = null;
  
      novac = dolari;
  
      localStorage.setItem('novac', JSON.stringify(novac));
    } else {
   
      var novac = JSON.parse(localStorage.getItem('novac'));
    
      novac = dolari;
      
      localStorage.setItem('novac', JSON.stringify(novac));
    }
  }
  
  document.querySelector('.pricing-articles').addEventListener('click', function(e){
  
    if(e.target.classList.contains('na-kasu')){
      setLocalStorage();
    };
  
  });

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