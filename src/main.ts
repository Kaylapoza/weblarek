import { Api } from './components/base/Api';
import { Basket } from './components/base/Models/basket';
import { Buyer } from './components/base/Models/buyer';
import { Catalog } from './components/base/Models/catalog';
import { RequestService } from './components/base/RequestService';
import './scss/styles.scss';
import { API_URL } from './utils/constants';


const catalog = new Catalog();
const basket = new Basket();
const buyer = new Buyer('', '','','');


const api = new Api(API_URL);
const service = new RequestService(api);

service.getProducts() // получаем продукты с сервера
    .then((data) => {
        catalog.saveProducts(data)// затем сохраняем их в класс, отвечающий за хранение данных на главной странице
        console.log('Массив товаров, полученный с сервера: ', catalog.getProducts());
    })


