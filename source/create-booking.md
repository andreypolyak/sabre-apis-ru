# Создание бронирований

Sabre APIs предусматривают два различных алгоритма создания бронирований:

| Алгоритм | **[Создание бронирований в 1 шаг](create-booking-1step.md)** | **[Создание бронирований в 2 шага](create-booking-2steps.md)** |
|---|---|---|
| **Описание** | Моментальное создание бронирования | Моментальное бронирование сегментов и хранение их в текущей сессии до момента получения всех данных, необходимых для создания бронирования |
| **Схема процесса** | <img src="assets/svg/create-booking/1step.svg"/> | <img src="assets/svg/create-booking/2steps.svg"/> |
| **Используемые сервисы** | [CreatePassengerNameRecordRQ](https://developer.sabre.com/docs/read/soap_apis/air/book/create_passenger_name_record) | [EnhancedAirBookRQ](https://developer.sabre.com/docs/read/soap_apis/air/book/orchestrated_air_booking) и [PassengerDetailsRQ](https://developer.sabre.com/docs/soap_apis/management/itinerary/Passenger_Details) |
| **Способы [аутентификации](authentication.md)** | Сессии или токены | Сессии |