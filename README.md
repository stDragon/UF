#Репозиторий front-end универсального модуля заявки.

## User config

Для начала работы с данным репозиторием задайте(если не заданы) свои имя и email для git как на примере ниже.

`git config --global user.name "Anatoliy Soldatov"`

`git config --global user.email "a-soldatov@marya.ru"`

## Install
Запускаем консоль с правами администратора.

Порядок установки:

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

Для запуска компиляции и старта сервера.
В этом режими node будет автоматически компилировать css/js после сохранения файлов.
(Если произойдет ошибка синтаксиса, серверу потребуется перезапуск)

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
