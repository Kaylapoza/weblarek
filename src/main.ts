import { Api } from './components/base/Api';
import { EventEmitter } from './components/base/Events';
import { BasketModel } from './components/Models/basketModel';
import { Buyer } from './components/Models/buyer';
import { Catalog } from './components/Models/catalog';
import { RequestService } from './components/RequestService';
import { Basket } from './components/views/basket';
import { CardBasket } from './components/views/Cards/cardBasket';
import { CatalogCard } from './components/views/Cards/cardCatalog';
import { CardPreview } from './components/views/Cards/cardPreview';
import { Header } from './components/views/header';
import { Modal } from './components/views/modal';
import './scss/styles.scss';
import { IProduct } from './types';
import { API_URL } from './utils/constants';
import { apiProducts } from './utils/data';
import { cloneTemplate, ensureElement } from './utils/utils';

//ИНИЦИАЛИЗАЦИЯ КОМПОНЕНТОВ
const events = new EventEmitter();
const productsModel = new Catalog(events);
const basketModel = new BasketModel(events);
const buyerModel = new Buyer(events);
const api = new Api(API_URL);
const service = new RequestService(api);
const galleryContainer = ensureElement<HTMLElement>('.gallery');
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const modalContainer = ensureElement<HTMLElement>('#modal-container');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const header = new Header(events, ensureElement<HTMLElement>('.header'));
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const cardBasketTeplate = ensureElement<HTMLTemplateElement>('#card-basket');

const basketView = new Basket(cloneTemplate(basketTemplate), events);
const modal = new Modal(modalContainer, events);//экземпляр модального окна

// КАТАЛОГ
events.on('items:changed', () => {
    galleryContainer.innerHTML = ''; //очищаем контейнер перед выодом
    //Берем актуальный массив товаров и делаем карточки
    productsModel.getProducts().forEach((item) => {
        const card = new CatalogCard(cloneTemplate(cardCatalogTemplate), {
            onClick: () => {
                events.emit('card:select', item); //вешаем обработчик на каждую карточку
            }
        })
        galleryContainer.append(card.render(item));
    })
})

//клик на карточку в каталоге, сохраняет выбранный товар для дальнейшего подробноо отображения    
events.on('card:select', (item: IProduct) => {
    productsModel.saveCurrentProduct(item);
})

//ПРЕВЬЮ КАРТОЧКА
// Иземенение текущего товара в превью
events.on('preview:changed', () => {
    const product = productsModel.getCurrentProduct(); //берем уже сохраненный товар из модели
    if (!product) return;

    //создали компонент отображения карточки в превью
    const cardPreview = new CardPreview(cloneTemplate(cardPreviewTemplate), {
        onClick: () => {
            if (basketModel.hasItemInBasket(product.id)) {
                events.emit('basket:delete', product);
            } else {
                events.emit('card:add-to-basket', product)
            }
        }
    })

    //определяем состояние кнопки покупки
    let buttonText = 'Купить';
    let isButtonValid = true;

    if (product.price === null) {
        isButtonValid = false;
        buttonText = 'Недоступно';
    } else if (basketModel.hasItemInBasket(product.id)) {
        buttonText = 'Удалить из корзины';
    }

    //Передали данные в сеттеры и зарендерили
    const previewHTML = cardPreview.render({
        title: product.title,
        price: product.price,
        category: product.category,
        image: product.image,
        description: product.description,
        buttonText: buttonText,
        valid: isButtonValid
    })

    modal.render({content: previewHTML});
    modal.open();
})

//КОРЗИНА
// событие добавления из превью
events.on('card:add-to-basket', (product: IProduct) => {
    basketModel.addItem(product);
    modal.close();
})

//событие удаления из корзины
events.on('basket:delete', (product: IProduct) => {
    basketModel.removeItem(product.id);
    if (productsModel.getCurrentProduct()?.id === product.id) {
        modal.close();
    }
})

//функция рендеринга товаров в корзине. Вынес в отдельную функцию так как код используется и при открытии и при изменении корзины
function renderBasketItems() {
    const items = basketModel.getItems();

    const basketCards = items.map((item, index) => {
        const cardBasket = new CardBasket(cloneTemplate(cardBasketTeplate), {
            onClick: () => {
                events.emit('basket:delete', item)
            }
        })
        return cardBasket.render({
            title: item.title,
            price: item.price,
            index: index + 1
        })
    })

    basketView.items = basketCards;
    basketView.total = basketModel.getTotal();

    basketView.active = items.length > 0;
}

//событие изменения в корзине
events.on('basket:change', () => {
    header.counter = basketModel.getItemCount();

    renderBasketItems();
})

events.on('basket:open', () => {
    renderBasketItems();

    modal.render({content: basketView.render()})
    modal.open();
})

header.counter = 0;

service.getProducts() // получаем продукты с сервера
    .then((data) => {
        productsModel.saveProducts(data.items)// затем сохраняем их в класс, отвечающий за хранение данных на главной странице
    })
    .catch((error) => {
        console.error('Данные не найдены: ', error);
    })



