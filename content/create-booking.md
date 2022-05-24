---
title: Создание бронирований
---

Sabre APIs предусматривают два различных алгоритма создания бронирований:

| Алгоритм | **[Создание бронирований в 1 шаг](create-booking-1step.html)** | **[Создание бронирований в 2 шага](create-booking-2steps.html)** |
|---|---|---|
| **Описание** | Моментальное создание бронирования | Моментальное бронирование сегментов и хранение их в текущей сессии до момента получения всех данных, необходимых для создания бронирования |
| **Схема процесса** | ![](/sabre-apis-ru/assets/svg/create-booking/1step.svg) | ![](/sabre-apis-ru/assets/svg/create-booking/2steps.svg) |
| **Используемые сервисы** | [CreatePassengerNameRecordRQ](https://developer.sabre.com/docs/read/soap_apis/air/book/create_passenger_name_record) | [EnhancedAirBookRQ](https://developer.sabre.com/docs/read/soap_apis/air/book/orchestrated_air_booking) и [PassengerDetailsRQ](https://developer.sabre.com/docs/soap_apis/management/itinerary/Passenger_Details) |
| **Способы [аутентификации](authentication.html)** | Сессии или токены | Сессии |