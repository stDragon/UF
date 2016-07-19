#Репозиторий front-end универсального модуля заявки.

## User config

Для начала работы с данным репозиторием задайте(если не заданы) свои имя и email для git как на примере ниже.

`git config --global user.name "Anatoliy Soldatov"`

`git config --global user.email "a-soldatov@marya.ru"`

## Install
Запускаем консоль с правами администратора.

Порядок установки:
(при установки на linux иногда потребуется устанавливать с правами администратора "sudo")

* установить node+npm 5 версии https://nodejs.org/en/ 

* скачать репозеторий:

```sh
git clone git@dev.marya.ru:s-oleynik/UM.git
```

* переходим в папку проекта:

```sh
cd UM
```

* установить модули :

```sh
npm install
```
* для скачивания напрямую с гитхаба нужно поправить гит конфиг:

```sh
git config --global url."https://".insteadOf git://
```

* установливаем front-end менеджер пакетов:

сначало глобально

```sh
npm install -g bower
```
потом говорим ему скачать все зависимости

```sh
bower install
```

Сборщик проекта
```sh
npm install -g gulp
```

Для настройки сервера необходимо в корень проекта создать копию файла nconf.js.source и внести в него необходимые правки

Для запуска компиляции и старта сервера.
В этом режими node будет автоматически компилировать css/js после сохранения файлов.
(Если произойдет ошибка синтаксиса, серверу потребуется ручной перезапуск)

```sh
gulp server
```
Для компиляции js

```sh
gulp scripts
```

Для компиляции css

```sh
gulp styles
```

## Внутренние модели

### Config

Начальный конфиг служит для инициализации формы. Получается из сгенерированного скрипта добавляемого перед "body" на сайтах партнеров

Name                     | type           | default                       | description 
------------------------ | -------------- | ----------------------------- | -----------
ID                       | number         | ""                            | ID конфига
serverUrl                | string         | "//module.infcentre.ru"       | Url сервера с которого будет запрашиваться скрипт и на который будут отправляться данные
siteUrl                  | string         | ""                            | Url сайта партнера на котором будет отображаться модуль
formType                 | string         | "calculation"                 | тип заявки
style                    | string/boolean | "/public/css/um-material.css" | стиль для модуля
initType                 | string         | "button"                      | тип отображения модуля 
initPosition             | string         | "fixed"                       | расположение формы или кнопки
showMap                  | boolean        | false                         | есть ли возможность выбора студий в модальном окне карты
showShop                 | boolean        | false                         | показывать ли select с выбором студий
showHeader               | boolean        | false                         | показывать ли заголовок
showPersonalData         | boolean        | true                          | показывать ли чекбокс "согласие с обработкой персональных данных"
phoneVerification        | boolean        | true                          | показывать ли окно подтверждения по смс

### City

Модель города получается с сервера

Name         | type           | required | description 
------------ | -------------- | -------- | -----------
name         | string         | +        | Имя
mr3id        | number         | -        | ID в базе MR3
showShop     | string         | -        | Отображение студий в этом городе

### Shop

Модель студии получается с сервера

Name         | type           | required | description 
------------ | -------------- | -------- | -----------
address      | string         | +        | Адрес
administrator| string         | -        | Имя администратора
brand        | string         | -        | Брэнд
city         | string         | +        | Город
dealer       | string         | -        | Диллер
mr3cityid    | number         | -        | ID города в базе MR3
mr3id        | number         | -        | ID в базе MR3
name         | string         | +        | Имя
priceZone    | string         | -        | Ценовая зона
status       | string         | +        | Статус
lat          | number         | -        | Широта студии (для координат на яндекс картие)
lon          | number         | -        | Долгота студии (для координат на яндекс картие)

### User

Модель пользователя генерируется на клиенте при заполнении формы отправки заявки.

Name         | type           | required | description 
------------ | -------------- | -------- | -----------
id           | number         | +        | ID в базе
mr3id        | number         | -        | ID в базе MR3
configId     | number         | +        | ID конфига в котором вызывается
href         | string         | -        | Страница с которой была отправлена заявка
type         | string         | -        | Тип заявки
name         | string         | -        | Фамилия + имя
surname      | string         | +        | Фамилия
firstName    | string         | +        | Имя
email        | string         | +        | Электронная почта
phone        | string         | +        | Телефон
adphone      | string         | -        | Дополнительный телефон
address      | string         | -        | Адрес
city         | string         | +        | Название города
cityId       | number         | +        | ID города
shop         | string         | -        | Название студии
shopId       | number         | -        | ID студии
kitchen      | string         | -        | Название модели
kitchenId    | string         | -        | ID модели
personalData | boolean        | +        | Согласие обработки персональных данных
wishes       | string         | -        | Пожелания
pref         | string         | -        | Предпочтительный способ связи
product      | string         | -        | Товар
price        | number         | -        | Стоимость
pay          | number         | -        | Первый взнос

### Phone

Модель подтверждения телефона пользователя

Name         | type           | default  | required | description 
------------ | -------------- | -------- | -------- | -----------
configId     | string         | ""       | +        | ID конфига в котором вызывается
userId       | string         | ""       | +        | ID связанного пользователя
phone        | string         | ""       | +        | Номер телефона
confirm      | boolean        | false    | +        | Телефон подтвержден
code         | string         | ""       | +        | Код подтверждения

### Code

Модель кода страны 

Name         | type           | default  | required | description 
------------ | -------------- | -------- | -------- | -----------
active       | boolean        | ""       | -        | Страна активная по умолчанию
available    | boolean        | ""       | -        | Доступность страны
code         | string         | ""       | +        | Код страны
name         | string         | ""       | +        | Русское название страны
isoCode      | string         | ""       | +        | ISO код страны
mask         | boolean        | false    | +        | Телефонная маска
img          | string         | ""       | +        | Флаг страны

## Принцип работы

### Инициализация

На странице http://module.infcentre.ru/um/ партнер получает код скрипта вида:

```html
<script type="text/javascript" src="http://module.infcentre.ru/public/js/marya-um.min.js"></script>
<script>UM.init({"id":"29BA15DA-DE36-170B-7BD4-570303E6C321"});</script>
```

Который необходимо вставить в подвал перед "body" на сайтах партнера.
Если необходимо запустить скрипт на определенной странице, скрипт необходимо добавить только на этой странице.

Код состоит из двух или трех частей в зависимости от конфигурации

* Подключение скрипта модуля

```html
<script type="text/javascript" src="http://module.infcentre.ru/public/js/marya-um.js"></script>
```
Если на сайте используется jQuery, underscore или backbone скрипт необходимо подключать после них.

* Запуск модуля с определенными настройками. Настройки превязаны к ID. 

```html
<script>UM.init({"id":"29BA15DA-DE36-170B-7BD4-570303E6C321"});</script>
```

* Если в настройках был выбрано "Начальное отображение" -> "В статичном элементе", к скрипту добавится div элемент в котором будет запускатся модуль

Для кнопки он соответстует:

```html
<button type="button" data-id="29BA15DA-DE36-170B-7BD4-570303E6C321" data-type="um-btn-init">Заказать кухню</button>
```

при нажатию на эту кнопку откроется форма

Для формы:

```html
<div data-id="29BA15DA-DE36-170B-7BD4-570303E6C321" data-type="um-form-init"></div>
```

Внутрь этой области будут выводиться состояния.

### Состояния

После инициализации внутри облости будут отображатся состояния.

Для просчета их три. 

1. Непосредственно сама форма ввода данных пользователя.
2. Форма подтверждения телефона (опцианальено).
3. Статус "Спасибо за заказ".

### Данные 

Модели формы доступны из массива UM.forms[id], где id это ID конфигуратора.
(доступ по ID сделан потому что в последствии планируется использование несколький типов заявок независящих друг от друга).

Получение данных в формате JSON:

```js
UM.forms[id].toJSON();
```

Передать в форму данные пользовател.

Список передаваемых данны можно получить из таблици модели [User](#user)
Если вы хотите передать город, студию, модель кухни, лучше передваать только cityId, shopId, kitchenId. Названия будут выставлены автоматически по ID.

* когда форма уже загружена
Не пытайтесь использовать до отработки UM.init, этот вариант работает только когда форма уже отрендарена

```js
var user = {
        surname: '',
        firstName: '',
        email: '',
        phone: '',
        city: ''
    },
    id = '29BA15DA-DE36-170B-7BD4-570303E6C321';
    
UM.forms[id].set(user);
```

* при загрузке формы

var user = {
        surname: '',
        firstName: '',
        email: '',
        phone: '',
        city: ''
    };
UM.init({"id":"29BA15DA-DE36-170B-7BD4-570303E6C321"}, {user : user});

## События

Так как модуль написан на backbone модели и коллекции имеют события http://backbonejs.ru/#Events-catalog

### Глобальные

Это события измения состояния заявки.
Чтобы проследить за этими событиями используется глобальная слежка за всеми событиями и отлавлевать интересующий нас по ID конфигурации

```js
UM.vent.on('event', function, context);
```

Список глобальных событий ('event')

event              | data           | description 
------------------ | -------------- | -----------
button:show        | id             | показать фиксированную кнопку
page:show          | id             | показать форму заявки
page:showPhoneForm | id             | показать форму подтверждения телефона
page:showConfirm   | id             | показать "заявка принята"

Например мы хотим перенаправить пользователя (через 5 сек) после получения "ваша заявка принята"

```js
UM.vent.on('page:showConfirm', function(id){
    if (id == "29BA15DA-DE36-170B-7BD4-570303E6C321") {
        console.log('Форма id: ' + id + ' отправила заявку');
        setTimeout(rederect, 5000);
    }
});

function rederect(){
     window.location.href = "//www.marya.ru"
}
```

### Внутренние

Чтобы следить за изменениями формы используется функция прослушивания событий модели 

```js
UM.vent.listenTo(model, 'event', function);
```

Пример получить данные после успешной отправки данных на сервер и вывести почту в консоль

```js
UM.vent.listenTo(UM.forms['29BA15DA-DE36-170B-7BD4-570303E6C321'], 'sync', function(model){
    var data = model.toJSON();
    console.log(data.email);
});
```