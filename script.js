let carrinho = [];
let modalQt = 1;
let modalKey = 0;

const qs = function (el) {                           // Nessa função não utilizei arrow function
    return document.querySelector(el);
}

const qsl = (el) => document.querySelectorAll(el);  //Já nessa utilizo arrow function

//Essa é a lista das pizzas selecionadas
pizzaJson.map((item, index) => {
    let pizzaItem = qs('.models .pizza-item').cloneNode(true);

    pizzaItem.setAttribute('data-key', index);
    pizzaItem.querySelector('.pizza-item--img img').src = item.img;
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2).replace('.', ',')}`;
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;

    pizzaItem.querySelector('a').addEventListener('click', (e) => {
        e.preventDefault();
        let key = e.target.closest('.pizza-item').getAttribute('data-key');
        modalQt = 1;
        modalKey = key;

        qs('.pizzaBig img').src = pizzaJson[key].img;
        qs('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
        qs('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
        qs('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2).replace('.', ',')}`;
        qs('.pizzaInfo--size.selected').classList.remove('selected');
        qsl('.pizzaInfo--size').forEach((size, sizeIndex) => {
            if (sizeIndex == 2) {
                size.classList.add('selected');
            }
            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];
        });

        qs('.pizzaInfo--qt').innerHTML = modalQt;

        qs('.pizzaWindowArea').style.opacity = 0;
        qs('.pizzaWindowArea').style.display = 'flex';
        setTimeout(() => {
            qs('.pizzaWindowArea').style.opacity = 1;
        })
    });

    qs('.pizza-area').append(pizzaItem);
});

//Eventos do funcionamento do MODAL
function closeModal() {
    qs('.pizzaWindowArea').style.opacity = 0;
    setTimeout(() => {
        qs('.pizzaWindowArea').style.display = 'none';
    }, 500);
}

qsl('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item) => {   //Fechar modal pedido
    item.addEventListener('click', closeModal);
});

qs('.pizzaInfo--qtmenos').addEventListener('click', () => {  //Adicionar mais itens
    if (modalQt > 1) {
        modalQt--;
        qs('.pizzaInfo--qt').innerHTML = modalQt;
    }
});

qs('.pizzaInfo--qtmais').addEventListener('click', () => {  //Remover mais itens
    modalQt++;
    qs('.pizzaInfo--qt').innerHTML = modalQt;
});

qsl('.pizzaInfo--size').forEach((size, sizeIndex) => {  //Selecionando e limpando as opções de tamanho
    size.addEventListener('click', (e) => {
        qs('.pizzaInfo--size.selected').classList.remove('selected');
        size.classList.add('selected');
    })
});

qs('.pizzaInfo--addButton').addEventListener('click', () => {  //Adicionando item ao carrinho    
    let size = parseInt(qs('.pizzaInfo--size.selected').getAttribute('data-key'));

    let identificador = pizzaJson[modalKey].id + '@' + size;    //Criado um identificados (pedidos)

    let key = carrinho.findIndex((item) => {          //Através do identificador podemos juntar os itens,
        return item.identificador == identificador     //dentro do pedido
    });

    if (key > -1) {
        carrinho[key].qt += modalQt;
    } else {
        carrinho.push({
            identificador,
            id: pizzaJson[modalKey].id,
            size,
            qt: modalQt
        });
        atualizarCarrinho();
        closeModal();
    }
});

function atualizarCarrinho() {
    if (carrinho.length > 0) {
        qs('aside').classList.add('show');
        for (let i in carrinho) {
            let pizzaItem = pizzaJson.find((item) => item.id == carrinho[i].id);
        }
    } else {
        qs('aside').classList.remove('show');
    }
}