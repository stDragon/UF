#Репозиторий front-end универсального модуля заявки.

## User config

Для начала работы с данным репозиторием измените свои имя и email как на примере ниже.

`git config --global user.name "Anatoliy Soldatov"`

`git config --global user.email "a-soldatov@marya.ru"`

## Install
Запускаем консоль с правами администратора.

Порядок установки:

* установить node+npm 5 версии https://nodejs.org/en/ 

* скачать репозеторий:

```sh
git clone git@dev.marya.ru:a-soldatov/UM.git
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

* для запуска компиляции и старта сервера

```sh
gulp server
```
* для компиляции js

```sh
gulp scripts
```

* для компиляции css

```sh
gulp styles
```
