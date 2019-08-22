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
function deleteData(item, url) {
  return fetch(url + '/' + item, {
    method: 'delete'
  })
    .then(response => response.json());
}

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

          left.innerHTML += `
            <div class="article article-margin-down" id="${item.idPomocni}">
            <div class="article-img">
                <img src="${item.slika}" alt="laptop">
            </div>
            <div class="article-desc">
                <a href="${item.idPomocni}.html" class="heading-link">${item.naziv}</a>
                <a href="#" class="delete-link">Obriši <i class="fas fa-trash-alt"></i></a>
            </div>
            <div class="buttons">
                <button class="sizing" value="-"><i class="fas fa-minus make-less"></i></button>
                <input type="text" id="counter-${item.idPomocni}" value="${counter}" readonly>
                <button class="sizing" value="-"><i class="fas fa-plus make-more"></i></button>
            </div>
            <div class="article-price">
                <p class="big">${(counter * parseFloat(item.cijena)).toFixed(2)} KM</p>
                <p class="small">${counter} x ${item.cijena} KM</p>
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
      // console.log(dolari);

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

      document.getElementById('bucket-counter').innerHTML = `(${counterArticles})`;

      document.querySelector('.webshop-total').innerHTML = total.toFixed(2);
      document.querySelector('.webshop-pdv').innerHTML = PDV.toFixed(2);
      document.querySelector('.webshop-bez-pdv').innerHTML = bezPDV.toFixed(2);

    });

}

function setLocalStorage() {
  if (localStorage.getItem('novac') === null) {
    var novac = null;
    novac = dolari;
    localStorage.setItem('novac', JSON.stringify(novac));
  } else {
    var novac = JSON.parse(localStorage.getItem('novac'));
    novac = dolari;
    localStorage.setItem('novac', JSON.stringify(novac));
  }
}

function getLocalStorage() {
  let local = JSON.parse(localStorage.getItem('novac'));
  return local;
}

let local = getLocalStorage();
document.querySelector('.webshop-bez-pdv').innerHTML = local.bezPDV.toFixed(2);
document.querySelector('.webshop-pdv').innerHTML = local.PDV.toFixed(2);
document.querySelector('.webshop-total').innerHTML = local.total.toFixed(2);




document.querySelector('.left').addEventListener('click', function (e) {

  if (e.target.classList.contains('make-less')) {
    let targetiranje = e.target.parentNode.parentNode.parentNode.id;

    let ID = `counter-${targetiranje}`;
    if (document.getElementById(ID).value > 1) {
      document.getElementById(ID).value -= 1;
      fetch('http://localhost:3000/shop')
        .then(function (response) {
          return response.json();
        })
        .then(function (myJson) {
          for (var i = 0; i < myJson.length; i++) {
            if (myJson[i].idPomocni == targetiranje) {
              let id = myJson[i].id;
              deleteData(id, 'http://localhost:3000/shop');
              //  window.stop();

              return;
            }
          }
        });

    }


  }
  if (e.target.classList.contains('make-more')) {
    let targetiranje = e.target.parentNode.parentNode.parentNode.id;

    let ID = `counter-${targetiranje}`;
    let vrijednost = document.getElementById(ID).value;

    let vrijednostInt = parseInt(vrijednost);
    if (vrijednostInt < 10) {
      vrijednostInt += 1;

      vrijednost = vrijednostInt.toString();

      document.getElementById(ID).value = vrijednost;

      fetch('http://localhost:3000/artikli')
        .then(function (response) {
          return response.json();
        })
        .then(function (myJson) {

          for (var i = 0; i < myJson.length; i++) {
            if (myJson[i].id == targetiranje) {

              let tempJson = {
                idPomocni: myJson[i].id,
                naziv: myJson[i].naziv,
                cijena: myJson[i].cijena,
                slika: myJson[i].slika
              };

              fetch('http://localhost:3000/shop', {
                method: 'POST',
                body: JSON.stringify(tempJson),
                headers: {
                  'Content-Type': 'application/json'
                }
              }).then(res => res.json())
                .then(response => console.log('Success:', JSON.stringify(response)))
                .catch(error => console.error('Error:', error));
              return;
            }
            //  setLocalStorage();

          }
        });
    }
  }
});


function populateInvoice() {
  fetch('http://localhost:3000/shop')
    .then(function (response) {
      return response.json();
    })
    .then(function (myJson) {
      // console.log(myJson);
      let tabelaDiv = document.querySelector('.table-invoice');
      let artikli;

      counterArticles = myJson.length;
      let articlesArray = [];
      let total = 0;
      let html = `
        <table>
                    <tr>
                      <th>Količina</th>
                      <th>Naziv</th>
                      <th>Cijena</th>
                    </tr>
                   ${
        myJson.forEach(function (item) {
          let counter = 0;
          if (articlesArray.indexOf(item.idPomocni) == -1) {
            myJson.forEach(function (item2) {
              if (item.idPomocni == item2.idPomocni) {
                counter++;
                articlesArray.push(item.idPomocni);
              }
            });

            total += counter * parseFloat(item.cijena);

            artikli += `
                                         <tr>
                                             <td> ${counter}</td>
                                             <td>${item.naziv}</td>
                                             <td>${(item.cijena * counter).toFixed(2)} KM</td>
                                        </tr>
                                       `;
          }
        })
        }
                   ${artikli}
                    <tr>
                        <td class="sum-bold">Ukupno:</td>
                        <td></td>
                        <td class="sum-bold">${total.toFixed(2)} KM</td>
                      </tr>
                  </table>
    
    `;

      tabelaDiv.innerHTML = html;
    });
}

function deleteAllArticles() {
  let ID = '';
  fetch('http://localhost:3000/shop')
    .then(function (response) {
      return response.json();
    })
    .then(function (myJson) {
      let IDs = '';
      for (var i = 0; i < myJson.length; i++) {
        if (i == 0) {
          IDs += `${myJson[i].id}`
        }
        else {
          IDs += `,${myJson[i].id}`
        }
      }

      console.log(`http://localhost:3000/shop/${IDs}`);
      fetch(`http://localhost:3000/shop/${IDs}`, {
        method: 'delete'
      })
      .then(response => response.json());

    });
}

document.getElementById('submit-invoice').addEventListener('click', function () {
  let webshop = document.querySelector('.section-webshop');
  webshop.style.display = 'none';
  let loader = document.querySelector('.loader');
  loader.style.display = 'block';

  function myFunction() {
    setTimeout(function () {
      loader.style.display = 'none';
      document.querySelector('.h1-invoice').innerHTML = 'Pošiljka zaprimljena';
      document.getElementById('paragraph-desc-invoice').innerHTML = `<i class="fas fa-truck"></i>Brza dostava u roku 48 sati`;
      populateInvoice();
      document.getElementById('logo-invoice').innerHTML = '<img src="img/logo.png" alt="logo">';

    }, 2000);

  }
  myFunction();
  // deleteAllArticles();
});

document.querySelector('.left').addEventListener('click', function(e){
  if (e.target.classList.contains('delete-link')) {
    let idTemp = e.target.parentNode.parentNode.id;
    // console.log(idTemp);
    // fetch('http://localhost:3000/shop')
    //   .then(function (response) {
    //     return response.json();
    //   })
    //   .then(function (myJson) {
    //     myJson.forEach(function(item){
    //       if(item.idPomocni == idTemp){
    //         deleteData(item.id,'http://localhost:3000/shop');
            
    //         document.getElementById(idTemp).innerHTML = '';
    //       }

    //     })
    //   });
  }
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
