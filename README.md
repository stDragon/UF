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

## Config

Name	 | type		      | default               | description 
-------- | -------------- | --------------------  | -----------
serverUrl| string         | "http://localhost/"   | Url сервера с которого будет запрашиваться скрипт и на который будут отправляться данные
siteUrl	 | string 		  | ""                    | Url сайта партнера на котором будет отображаться модуль
style	 | string/boolean | "css/um-material.css" | стиль для модуля
type 	 | string         | "button"              | тип отображения модуля 
showMap  | boolean        | false                 | есть ли возможность выбора студий в модальном окне карты
showShop | boolean        | false                 | показывать ли select с выбором студий