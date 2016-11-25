# Автоматические обмены

-----

**Оглавление:**
<!-- toc -->

-----

Раздел находится в разработке
<!-- ContextChangeLLSRQ at the beginning -->
<!-- TravelItineraryReadRQ at the end -->

## Алгоритм автоматического обмена билетов

{% imgsec "Схема", "0", "exchange" %}./assets/svg/Exchange Tickets/[RU]Exchange Tickets-0.svg{% endimgsec %}

## Введение

Автоматические обмены — это дополнительный продукт, который позволяет автоматизировать обмен авиабилетов, как при работе через Sabre APIs, так и при работе в терминале Sabre Red Workspace. Для подключения продукта, пожалуйста, обратитесь к вашему куратору в Sabre.

В данном руководстве предложен алгоритм выполнения обмена всех билетов, которые имеются в бронировании, для всех пассажиров. Предполагается, что каждый присутствующий в бронировании билет оформлен для всех присутствующих в бронировании сегментов.

## Чтение бронирования (TravelItineraryReadRQ)

Используется сервис [TravelItineraryReadRQ](https://developer.sabre.com/docs/read/soap_apis/management/itinerary/get_itinerary/resources). В качестве значения атрибута ```/TravelItineraryReadRQ/UniqueID/@ID``` в запросе указывается код бронирования (PNR Record Locator).

{% xmlsec "Пример запроса" %}

{% endxmlsec %}

{% xmlsec "Пример ответа" %}

{% endxmlsec %}

## Чтение маски билета (eTicketCouponLLSRQ)

Для сопоставления номеров билетов и номеров пассажиров, присутствующих в бронировании используется сервис чтения маски билета [eTicketCouponLLSRQ](https://developer.sabre.com/docs/read/soap_apis/air/fulfill/get_eticket_details/resources).

В запросе указывается номер билета (3 цифры код перевозчика + 10 цифр номер билета). Номер билета указан в ответе на запрос TravelItineraryReadRQ в значении атрибута ```/TravelItineraryReadRS/TravelItinerary/ItineraryInfo/Ticketing/@RPH```.

{% xmlsec "Пример запроса" %}

{% endxmlsec %}

{% xmlsec "Пример ответа" %}

{% endxmlsec %}

## Проверка возможности совершения автоматического обмена (ExchangeShoppingLLSRQ)

Для того чтобы проверить возможность совершения автоматического обмена необходимо отправить запрос к сервису [ExchangeShoppingLLSRQ](https://developer.sabre.com/docs/soap_apis/air/search/shop_exchange_options/resources).

{% xmlsec "Пример запроса" %}

{% endxmlsec %}

{% xmlsec "Пример ответа" %}

{% endxmlsec %}

## Игнорирование бронирования (IgnoreTransactionLLSRQ)

В случае, если автоматический обмен билета невозможен, необходимо игнорировать текущее бронирование. Для этого используется сервис [IgnoreTransactionLLSRQ](https://developer.sabre.com/docs/soap_apis/management/itinerary/ignore_transaction/resources).

{% xmlsec "Пример запроса" %}

{% endxmlsec %}

{% xmlsec "Пример ответа" %}

{% endxmlsec %}

## Отмена сегментов (OTA_CancelLLSRQ)

Производится отмена (удаление) тех сегментов, которые должны быть изменены при проведении обмена. Для этого используется сервис [OTA_CancelLLSRQ](https://developer.sabre.com/docs/read/soap_apis/air/book/cancel_itinerary_segments/resources).

В запросе к сервису необходимо указать какие именно сегменты должны быть отменены:
- ```<Segment Type="entire"/>``` — все сегменты
- ```<Segment Type="air"/>``` — все авиасегменты
- ```<Segment Number="1"/>``` — первый сегмент
- ```<Segment Number="2" EndNumber="4"/>``` — сегменты со второго по четвертый

Вместе с сегментами будут отменены привязанные к ним дополнительные услуги.

Номера сегментов указаны в ответе на запрос TravelItineraryReadRQ в ```TravelItinerary/ItineraryInfo/ReservationItems/Item/@RPH```.

{% xmlsec "Пример запроса" %}

{% endxmlsec %}

{% xmlsec "Пример ответа" %}

{% endxmlsec %}

## Бронирование фиктивных сегментов (EnhancedAirBookRQ)

Для того чтобы получить варианты обмена необходимо забронировать новые сегменты. Т.к. на этом этапе неизвестно какой именно рейс выберет пользователь, можно забронировать новый сегмент со специальным статусом ```QF```. При бронировании сегментов с таким статусом не производится обращение к инвенторной системе перевозчика и следовательно не требуется подтверждение сегментов.

Рекомендуется бронировать сегменты с теми же номерами рейсов, классом бронирования ```Y``` (экономический) или ```C``` (бизнес) и датой вылета выбранной пользователем.

Для бронирования сегментов используется сервис [EnhancedAirBookRQ](https://developer.sabre.com/docs/read/soap_apis/air/book/orchestrated_air_booking/reources) (см. [Создание бронирований](/create-booking.md)).

{% xmlsec "Пример запроса" %}

{% endxmlsec %}

{% xmlsec "Пример ответа" %}

{% endxmlsec %}

## Получение вариантов обмена (ExchangeShoppingLLSRQ)

Для получения вариантов обмена необходимо указать номер билета и номер пассажира, а также максимальное количество предложенных вариантов в ответе — 19.

{% xmlsec "Пример запроса" %}

{% endxmlsec %}

{% xmlsec "Пример ответа" %}

{% endxmlsec %}

## Игнорирование бронирования (IgnoreTransactionLLSRQ)

В случае, если ни один из вариантов не был выбран пользователем, необходимо игнорировать все изменения в бронировании, которые были сделаны на предыдущих шагах. Для этого используется сервис [IgnoreTransactionLLSRQ](https://developer.sabre.com/docs/soap_apis/management/itinerary/ignore_transaction/resources).

{% xmlsec "Пример запроса" %}

{% endxmlsec %}

{% xmlsec "Пример ответа" %}

{% endxmlsec %}

## Отмена фиктивных сегментов (OTA_CancelLLSRQ)

В случае, если пользователь выбрал один из предложенных вариантов обмена, необходимо отменить фиктивные сегменты, добавленные ранее.  Для этого используется сервис [OTA_CancelLLSRQ](https://developer.sabre.com/docs/read/soap_apis/air/book/cancel_itinerary_segments/resources).

В качестве параметра в запросе указывается какие именно сегменты необходимо отменить:
- ```<Segment Type="entire"/>``` — все сегменты
- ```<Segment Type="air"/>``` — все авиасегменты
- ```<Segment Number="1"/>``` — первый сегмент
- ```<Segment Number="2" EndNumber="4"/>``` — сегменты со второго по четвертый

Вместе с сегментами будут отменены привязанные к ним дополнительные услуги.

## Бронирование сегментов (EnhancedAirBookRQ)

Производится бронирование выбранных пользователем сегментов для совершения обмена при помощи сервиса [EnhancedAirBookRQ](XXX) (см. [Создание бронирований](/create-booking.md)).

{% xmlsec "Пример запроса" %}

{% endxmlsec %}

{% xmlsec "Пример ответа" %}

{% endxmlsec %}

## Расчет стоимости обмена для других категорий пассажиров (AutomatedExchangesLLSRQ)

Стоимость обмена может отличаться для других категорий пассажиров, имеющихся в бронировании. Для получения полной стоимости обмена для всех пассажиров рекомендуется произвести расчет стоимости обмена для всех категорий пассажиров в бронировании.

Для расчета стоимости обмена для других пассажиров используется сервис [AutomatedExchangesLLSRQ](https://developer.sabre.com/docs/soap_apis/air/fulfill/auto_price_air_exchanges/resources).

В запросе необходимо указать:
- ```/AutomatedExchangesRQ/ExchangeComparison/@OriginalTicketNumber``` — номер билета к обмену 
- ```/AutomatedExchangesRQ/ExchangeComparison/PriceRequestInformation/OptionalQualifiers/FlightQualifiers/VendorPrefs/Airline/@Code``` — код валидирующего перевозчика
- ```/AutomatedExchangesRQ/ExchangeComparison/PriceRequestInformation/OptionalQualifiers/PricingQualifiers/NameSelect/@NameNumber``` — номер пассажира, на которого оформлен билет

Выполнив последовательно расчет стоимости для всех категорий пассажиров, можно получить стоимость обмена всех билетов в бронировании.

{% xmlsec "Пример запроса" %}

{% endxmlsec %}

{% xmlsec "Пример ответа" %}

{% endxmlsec %}

## Игнорирование бронирования (IgnoreTransactionLLSRQ)

В случае, если пользователь не подтвердил проведение обмена, необходимо игнорировать все изменения в бронировании, которые были сделаны на предыдущих шагах. Для этого используется сервис [IgnoreTransactionLLSRQ](https://developer.sabre.com/docs/soap_apis/management/itinerary/ignore_transaction/resources).

{% xmlsec "Пример запроса" %}

{% endxmlsec %}

{% xmlsec "Пример ответа" %}

{% endxmlsec %}

## Сохранение бронирования (EndTransactionLLSRQ)

В случае, если пользователь подтвердил проведение обмена, необходимо сохранить добавленные ранее сегменты. Для этого используется сервис [EndTransactionLLSRQ](https://developer.sabre.com/docs/soap_apis/management/itinerary/end_transaction/resources).

В запросе нужно указать код ```ReceivedFrom```, он будет отображаться в истории бронирования.

{% xmlsec "Пример запроса" %}

{% endxmlsec %}

{% xmlsec "Пример ответа" %}

{% endxmlsec %}

## Чтение бронирования (TravelItineraryReadRQ)

Используется сервис [TravelItineraryReadRQ](https://developer.sabre.com/docs/read/soap_apis/management/itinerary/get_itinerary/resources). В качестве значения атрибута ```/TravelItineraryReadRQ/UniqueID/@ID``` в запросе указывается код бронирования (PNR Record Locator).

{% xmlsec "Пример запроса" %}

{% endxmlsec %}

{% xmlsec "Пример ответа" %}

{% endxmlsec %}

## Расчет стоимости обмена (AutomatedExchangesLLSRQ)

Для расчета стоимости обмена для других пассажиров используется сервис [AutomatedExchangesLLSRQ](https://developer.sabre.com/docs/soap_apis/air/fulfill/auto_price_air_exchanges/resources).

В запросе необходимо указать:
- ```/AutomatedExchangesRQ/ExchangeComparison/@OriginalTicketNumber``` — номер билета к обмену 
- ```/AutomatedExchangesRQ/ExchangeComparison/PriceRequestInformation/OptionalQualifiers/FlightQualifiers/VendorPrefs/Airline/@Code``` — код валидирующего перевозчика
- ```/AutomatedExchangesRQ/ExchangeComparison/PriceRequestInformation/OptionalQualifiers/PricingQualifiers/NameSelect/@NameNumber``` — номер пассажира, на которого оформлен билет

{% xmlsec "Пример запроса" %}

{% endxmlsec %}

{% xmlsec "Пример ответа" %}

{% endxmlsec %}

## Сохранение расчета стоимости обмена (AutomatedExchangesLLSRQ)

Для сохранения расчета стоимости обмена также используется сервис [AutomatedExchangesLLSRQ](https://developer.sabre.com/docs/soap_apis/air/fulfill/auto_price_air_exchanges/resources).

## Сохранение бронирования (EndTransactionLLSRQ)

Для сохранения бронирования м расчетом стоимости бронирования используется сервис [EndTransactionLLSRQ](https://developer.sabre.com/docs/soap_apis/management/itinerary/end_transaction/resources).

В запросе нужно указать код ```ReceivedFrom```, он будет отображаться в истории бронирования.

{% xmlsec "Пример запроса" %}

{% endxmlsec %}

{% xmlsec "Пример ответа" %}

{% endxmlsec %}

## Оформление билетов

Оформление новых билетов производится в соответствии с инструкцией изложенной в разделе [Оформление билетов и EMD](/issue-ticket.md).

XXX - PQR