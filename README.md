Цей посібник описує кроки для налаштування та запуску додатку на Ubuntu, включаючи фронт-енд і бек-енд частини.

Налаштування фронт-енду

1. Встановлення Node.js (версія 17 або вище)

curl -o- https://fnm.vercel.app/install | bash
fnm install 17

2. Встановлення npm та збірка фронт-енду

Перейдіть до кореневої папки фронт-енду (sh-medicine-prescription-list) і виконайте:

npm install
npm run build

Примітка: Виконуйте npm run build після внесення змін у код для повторної збірки фронт-енду.

3. Встановлення HTTP-сервера для фронт-енду

npm install -g http-server

Налаштування бек-енду

1. Встановлення Java Runtime Environment (JRE, версія 17 або вище)

sudo apt install openjdk-17-jre

2. Встановлення Maven

sudo apt install maven -y

3. Очищення та збірка бек-енду

Виконайте наступне для очищення попередніх збірок і створення .jar файлу:

mvn clean package

Запуск додатку

Запуск бек-енду та фронт-енду

Виконайте наступні команди для запуску обох компонентів у фоновому режимі:

nohup bash -c 'cd /home/administrator/superhumans-document-list/prescriptionlist-back/prescriptionlist/target/ && sudo java -jar prescriptionlist-0.0.1-SNAPSHOT.jar' &
sleep 5
nohup bash -c 'cd /home/administrator/superhumans-document-list/sh-medicine-prescription-list/ && serve -s dist -l tcp://192.168.24.32:5173' &

Допоміжні команди

Перегляд ідентифікаторів запущених процесів

Щоб перевірити ідентифікатори запущених процесів Java та сервера:

ps aux | grep java  

ps aux | grep serve

Завершення процесу

Щоб зупинити процес, використовуйте його ідентифікатор:

sudo kill <ідентифікатор_процесу>
