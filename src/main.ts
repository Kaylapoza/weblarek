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
import { Contacts } from './components/views/Forms/contacts';
import { Order } from './components/views/Forms/order';
import { Gallery } from './components/views/gallery';
import { Header } from './components/views/header';
import { Modal } from './components/views/modal';
import { Success } from './components/views/success';
import './scss/styles.scss';
import { IBuyer, IProduct, TPayment, ValidationErrors } from './types';
import { API_URL } from './utils/constants';
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
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

const cardPreview = new CardPreview(cloneTemplate(cardPreviewTemplate), {
  onClick: () => {
    events.emit('preview:toggle-basket')
  }
}) // создаем экземпляр карточки превью, и делаем только одно событие для переключения кнопки
const basketView = new Basket(cloneTemplate(basketTemplate), events);
const orderView = new Order(cloneTemplate(orderTemplate), events);
const contactsView = new Contacts(cloneTemplate(contactsTemplate), events);
const successView = new Success(cloneTemplate(successTemplate), events);
const gallery = new Gallery(galleryContainer);
const modal = new Modal(modalContainer, events); //экземпляр модального окна

// КАТАЛОГ
events.on('items:changed', () => {
  const galleryCards = productsModel.getProducts().map((item) => {
    const card = new CatalogCard(cloneTemplate(cardCatalogTemplate), {
      onClick: () => {
        events.emit('card:select', item); //вешаем обработчик на каждую карточку
      },
    });
    return card.render(item)
  });
  gallery.items = galleryCards;
});

//клик на карточку в каталоге, сохраняет выбранный товар для дальнейшего подробноо отображения
events.on('card:select', (product: IProduct) => {
  productsModel.saveCurrentProduct(product);

  //определяем состояние кнопки покупки
  let buttonText = 'Купить';
  let isButtonValid = true;

  if (product.price === null) {
    isButtonValid = false;
    buttonText = 'Недоступно';
  } else if (basketModel.hasItemInBasket(product.id)) {
    buttonText = 'Удалить из корзины';
  }

  modal.render({ content: cardPreview.render({
    title: product.title,
    price: product.price,
    category: product.category,
    image: product.image,
    description: product.description,
    buttonText: buttonText,
    valid: isButtonValid,
  })});
  modal.open();
});

events.on('preview:toggle-basket', () => {
  const product = productsModel.getCurrentProduct();
  if (!product) return;

  if (basketModel.hasItemInBasket(product.id)) {
    basketModel.removeItem(product.id) //если товар в корзине есть - удаляем
    cardPreview.render({ buttonText: 'Купить'}) // и сразу перерисовываем текст кнопки
  } else {
    basketModel.addItem(product) //  впротивном случае добавляем товар в корзину
    cardPreview.render({buttonText: 'Удалить из корзины'}); // и снова меняем кнопку
  }

})

//функция рендеринга товаров в корзине. Вынес в отдельную функцию так как код используется и при открытии и при изменении корзины
function renderBasketItems() {
  const items = basketModel.getItems();

  const basketCards = items.map((item, index) => {
    const cardBasket = new CardBasket(cloneTemplate(cardBasketTeplate), {
      onClick: () => {
        events.emit('basket:delete', item);
      },
    });
    return cardBasket.render({
      title: item.title,
      price: item.price,
      index: index + 1,
    });
  });

  basketView.items = basketCards;
  basketView.total = basketModel.getTotal();

  basketView.active = items.length > 0;
}

//события на удалениетовара из корзины
events.on('basket:delete', (item: IProduct) => {
  basketModel.removeItem(item.id)
})

//событие изменения в корзине
events.on('basket:change', () => {
  header.counter = basketModel.getItemCount();

  renderBasketItems();
});

// сбытие открытия корзины
events.on('basket:open', () => {
  modal.render({content: basketView.render()})
  modal.open()
});

//Шаг 1. Заказ. Способ оплаты и адрес
events.on('order:open', () => {
  //открытие формы заказа из корзины
  buyerModel.clearBuyerData();

  //стартовое пустое состояние формы
  modal.render({
    content: orderView.render({})
  });

  modal.open();
});

// выбор способа оплаты
events.on('order:payment-change', (data: { payment: TPayment }) => {
  buyerModel.setBuyerData({ payment: data.payment });
});

// события на ввод адреса доставки
events.on('order.address:changed', (data: { field: string; value: string }) => {
  buyerModel.setBuyerData({ address: data.value });
});

// события на изменения в форме
events.on(
  'buyer:changed',
  (eventData: { data: IBuyer; errors: ValidationErrors }) => {
    const { errors } = eventData;
    const currentBuyerData = eventData.data;

    orderView.payment = currentBuyerData.payment;
    orderView.address = currentBuyerData.address; //синхронизируем данные из модели ордер в view

    const orderErrors = [errors.address, errors.payment].filter((error): error is string => Boolean(error));

    orderView.errors = orderErrors;
    orderView.valid = orderErrors.length === 0;

    // обработка шага 2 - заполнения формы контактов
    contactsView.email = currentBuyerData.email;
    contactsView.phone = currentBuyerData.phone; // так же само синхронизируем данный из модели

    const contactsErrors = [errors.email, errors.phone].filter((error): error is string => Boolean(error));

    contactsView.errors = contactsErrors;
    contactsView.valid = contactsErrors.length === 0;
  }
);

// сабмит формы и переход к заполнению контактов
events.on('order:submit', () => {
  modal.render({
    content: contactsView.render({
      email: '',
      phone: '',
      valid: false,
      errors: [],
    }),
  });
});

// ввод email
events.on(
  'contacts.email:changed',
  (data: { field: string; value: string }) => {
    buyerModel.setBuyerData({ email: data.value });
  }
);

// ввод телефона
events.on(
  'contacts.phone:changed',
  (data: { field: string; value: string }) => {
    buyerModel.setBuyerData({ phone: data.value });
  }
);

// отправка формы
events.on('contacts:submit', () => {
  const orderPrice = basketModel.getTotal();

  const orderData = {
    ...buyerModel.getBuyerData(),
    total: orderPrice,
    items: basketModel.getItems().map((product) => product.id),
  };

  service
    .postOrder(orderData)
    .then((res) => {
      basketModel.cleanBasket();
      buyerModel.clearBuyerData();
      modal.render({
        content: successView.render({
          total: res.total
        }),
      });
    })
    .catch((error) => {
      console.error('Ошибка отправки заказа', error);
    });
});

// финальное окно успешного заказа
events.on('success:close', () => {
  modal.close();
});

header.counter = 0;

service
  .getProducts() // получаем продукты с сервера
  .then((data) => {
    productsModel.saveProducts(data.items); // затем сохраняем их в класс, отвечающий за хранение данных на главной странице
  })
  .catch((error) => {
    console.error('Данные не найдены: ', error);
  });
