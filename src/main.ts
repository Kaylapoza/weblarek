import { Api } from './components/base/Api';
import { Basket } from './components/Models/basket';
import { Buyer } from './components/Models/buyer';
import { Catalog } from './components/Models/catalog';
import { RequestService } from './components/RequestService';
import './scss/styles.scss';
import { API_URL } from './utils/constants';
import { apiProducts } from './utils/data';

//тестирование данных, классов и их методов

const productsModel = new Catalog();

productsModel.saveProducts(apiProducts.items); //метод для сохранения продуктов, полученных из базы данных
console.log('Массив товаров из каталога: ', productsModel.getProducts())// метод для получения продуктов, сохраненных  в каталоге

console.log( 'метод для получения данных продукта по его id: ',productsModel.getProductByID('c101ab44-ed99-4a54-990d-47aa2bb4e7d9')); //метод для получения данных продукта по его id
console.log('метод для получения данных продукта по его id (несуществующий id): ',productsModel.getProductByID('c101ab44-ed99-4a54-99'));


productsModel.saveCurrentProduct(productsModel.getProducts()[0]);//метод для сохранения выбранного продукта
const savedProduct = productsModel.getCurrentProduct();
console.log('Сохраненный товар: ', savedProduct);// метод для получения данных сохраненного товара


const basketModel = new Basket();
if (savedProduct) {
    basketModel.addItem(savedProduct);// метод для добавления продукта в корзину
    console.log('Проверка наличия определенного товара в корзине: ', basketModel.hasItemInBasket(savedProduct.id));
}
basketModel.addItem(productsModel.getProducts()[3]);//как вариант использования
console.log('Количество товаров в корзине: ', basketModel.getItemCount());
console.log('Продукты в корзине: ', basketModel.getItems()); // метод для получения продуктов из корзины


const buyerModel = new Buyer();
buyerModel.setBuyerData({
    payment: 'cash',
    address: 'London, Example str., 5'
});//метод для сохранение данных в модели

console.log('Сохраненные данные пользователя: ', buyerModel.getBuyerData()); // получение всех данных покупателя;
console.log('Валидация формы: ', buyerModel.validate());
buyerModel.clearBuyerData();
console.log('Форма после очистки: ', buyerModel.getBuyerData());
buyerModel.setBuyerData({
    payment: 'cash',
    address: 'London, Example str., 5',
    phone: '88005553535',
    email: 'example@example.com'
})
console.log('Валидация формы(без ошибок): ', buyerModel.validate());// вернет пустой обьект, так как ошибок нет

const api = new Api(API_URL);
const service = new RequestService(api);

service.getProducts() // получаем продукты с сервера
    .then((data) => {
        productsModel.saveProducts(data.items)// затем сохраняем их в класс, отвечающий за хранение данных на главной странице
        console.log('Массив товаров, полученный с сервера: ', productsModel.getProducts());
    })
    .catch((error) => {
        console.error('Данные не найдены: ', error);
    })
   
const order = Object.assign({}, buyerModel.getBuyerData(), {
    total: basketModel.getTotal(),//сумма стоимости продуктов в корзине
    items: basketModel.getItems().map(item => item.id)
})
service.postOrder(order)// иетод для отправки данных на сервер
    .then((response) => {
        console.log('Данные успешно отправлены', response);
    })
    .catch((error) => {
        console.error('Ошибка при отправке заказа: ', error);
    })

basketModel.removeItem(productsModel.getProducts()[3].id);//метод для удаления товара из корзины
console.log('Продукты в корзине, после удаления: ', basketModel.getItems());
basketModel.cleanBasket();
console.log('Продукты в корзине, после очистки: ', basketModel.getItems());



