# Рекомендации по работе с Sabre APIs

Цель данных рекомендаций — описать основные понятия и подходы при использовании Sabre APIs для построения B2B и B2C решений, предназначенных для бронирования авиабилетов.

Следует учитывать, что данные рекомендации не заменяют собой документацию по Sabre APIs и системе Sabre, но дополняет их. При разработке рекомендаций учитывались особенности российского рынка авиаперевозок.

Руководство ориентировано на разработчиков программного обеспечения, однако составлено с учетом того, что разработку также сопровождает специалист, прошедший тренинг по работе в системе Sabre.

## Обновления

**06.05.2020**. В различных разделах рекомендаций обновлены версии используемых сервисов:
- BargainFinderMaxRQ до [версии 6.1.0](https://developer.sabre.com/docs/soap_apis/air/search/bargain_finder_max/release-note)
- BargainFinderMax_ADRQ до [версии 6.1.0](https://developer.sabre.com/docs/soap_apis/air/search/bargain_finder_max/bfm_ad/release-note)
- RevalidateItinRQ до [версии 6.1.0](https://developer.sabre.com/docs/soap_apis/air/search/revalidate_itinerary/release-note)
- TicketingDocumentServicesRQ до [версии 3.26.0](https://developer.sabre.com/docs/sabre_sonic_apis/soap/ticketing/get_ticket_doc_details/release-note)

В разделе [Тайм-лимиты бронирований](timelimit.md) добавлено описание возможности получать время тайм-лимита в ответах на запросы к сервисам [BargainFinderMaxRQ](https://developer.sabre.com/docs/soap_apis/air/search/bargain_finder_max), [BargainFinderMax_ADRQ](https://developer.sabre.com/docs/soap_apis/air/search/bargain_finder_max/bfm_ad) и [RevalidateItinRQ](https://developer.sabre.com/docs/read/soap_apis/air/search/revalidate_itinerary).

-----------

**16.04.2020**. Создан раздел [Выбор форм оплаты](fop.md). Информация по выбору форм оплаты также обновлена в разделах [Создание бронирований в 1 шаг](create-booking-1step.md), [Создание бронирований в 2 шага](create-booking-2steps.md), [Оформление билетов и EMD](issue-ticket.md) и [Обмен билетов](exchange-ticket.md).

Обновлена версия сервиса QueueAccessLLSRQ до [версии 2.1.0](https://developer.sabre.com/docs/soap_apis/management/queue/Access_Queue/release-note).

-----------

**09.04.2020**. В разделах [Создание бронирований в 1 шаг](create-booking-1step.md), [Создание бронирований в 2 шага](create-booking-2steps.md) и [Оформление билетов и EMD](issue-ticket.md) добавлено описание возможности остановить выполнение запроса в случае наличия в бронировании сегментов с нарушением правил минимального стыковочного времени (атрибут ```/@haltOnInvalidMCT```).

В разделах [Поиск перелетов по заданным датам](shop.md), [Проверка стоимости и наличия мест](revalidate-itinerary.md), [Создание бронирований в 1 шаг](create-booking-1step.md) и [Создание бронирований в 2 шага](create-booking-2steps.md) добавлены рекомендации по поиску, проверки стоимости и бронированию перелетов по тарифам с багажом.

-----------

**03.02.2020**. Создан раздел [Коллекция Postman](postman.md), содержащий коллекцию Postman со всеми запросами к сервисам Sabre.

В различных разделах рекомендаций обновлены версии используемых сервисов:
- BargainFinderMaxRQ до [версии 5.2.0](https://developer.sabre.com/docs/soap_apis/air/search/bargain_finder_max/release-note)
- BargainFinderMax_ADRQ до [версии 5.2.0](https://developer.sabre.com/docs/soap_apis/air/search/bargain_finder_max/bfm_ad/release-note)
- AirSchedulesAndAvailabilityRQ до [версии 5.3.1](https://developer.sabre.com/docs/soap_apis/air/search/air_schedules_availability/release-note)
- RevalidateItinRQ до [версии 5.2.0](https://developer.sabre.com/docs/soap_apis/air/search/revalidate_itinerary/release-note)
- CreatePassengerNameRecordRQ до [версии 2.3.0](https://developer.sabre.com/docs/soap_apis/air/book/create_passenger_name_record/release-note)
- TravelItineraryDivideLLSRQ до [версии 2.0.3](https://developer.sabre.com/docs/soap_apis/management/itinerary/Divide_Itinerary/release-note)
- GetAncillaryOffersRQ до [версии 3.1.0](https://developer.sabre.com/docs/soap_apis/air/search/get_ancillary_offers/release-note)
- AirTicketRQ до [версии 1.2.1](https://developer.sabre.com/docs/soap_apis/air/fulfill/enhanced_air_ticket/release-note)
- DesignatePrinterLLSRQ до [версии 2.0.2](https://developer.sabre.com/docs/soap_apis/management/utility/Designate_Printer/release-note)
- VoidTicketLLSRQ до [версии 2.1.0](https://developer.sabre.com/docs/soap_apis/air/fulfill/Void_Air_Ticket/release-note)
- TKT_ExchangeRQ до [версии 1.4.0](https://developer.sabre.com/docs/soap_apis/air/fulfill/schedule_change/release-note)
- StructureFareRulesRQ до [версии 1.0.5](https://developer.sabre.com/docs/soap_apis/air/utility/get_structured_fare_rules/release-note)

В разделе [Поиск перелетов по заданным датам](shop.md) добавлено:
- черный и белый список кодов тарифов
- черный и белый список классов бронирования
- режим выбора брендов для самого дешевого расчета стоимости (все плечи имеют одинаковый бренд/каждое плечо имеет свой бренд/нет ограничений) в случае расчета стоимости по всем доступным брендам
- ограничение количества возвращаемых One Way вариантов перелетов при поиске с оформлением на нескольких билетах
- ограничение количества возвращаемых вариантов перелетов

В разделе [Поиск по расписаниям и получение данных о наличии мест](get-availability.md) добавлено:
- поиск по заданным рейсам
- календарный поиск

В разделе [Проверка стоимости и наличия мест](revalidate-itinerary.md) добавлено:
- черный и белый список классов бронирования
- режим выбора брендов для самого дешевого расчета стоимости (все плечи имеют одинаковый бренд/каждое плечо имеет свой бренд/нет ограничений) в случае расчета стоимости по всем доступным брендам
- расчет стоимости с оформлением на нескольких билетах.

В разделах [Создание бронирований в 1 шаг](create-booking-1step.md) и [Создание бронирований в 2 шага](create-booking-2steps.md) добавлено описание возможности отправки SSR с кодом ```CTCM```, ```CTCE``` и ```CTCR``` для отправки контактных данных пассажиров перевозчикам.

В разделах [Редактирование бронирований](edit-booking.md), [Бронирование мест в салоне](book-air-seats.md), [Обмен билетов](exchange-ticket.md), [Вынужденный обмен билетов](involuntary-exchange-ticket.md), [Тайм-лимиты бронирований](timelimit.md) сервис добавления новых элементов бронирования [PassengerDetailsRQ](https://developer.sabre.com/docs/soap_apis/management/itinerary/Passenger_Details) заменен на новый сервис [UpdatePassengerNameRecordRQ](https://developer.sabre.com/docs/soap_apis/air/book/update_passenger_name_record).

В разделе [Редактирование бронирований](edit-booking.md) сервисы для удаления элементов бронирования [DeleteSpecialServiceLLSRQ](https://developer.sabre.com/docs/read/soap_apis/management/itinerary/delete_special_service), [ModifyRemarkLLSRQ](https://developer.sabre.com/docs/read/soap_apis/management/itinerary/modify_itinerary_remark) и [TravelItineraryModifyInfoLLSRQ](https://developer.sabre.com/docs/soap_apis/management/itinerary/modify_itinerary) заменены на сервис [UpdateReservationRQ](https://developer.sabre.com/docs/read/soap_apis/management/itinerary/update_itinerary).

В разделе [Бронирование дополнительных услуг](book-ancillaries.md) добавлена информация об отправке SSR сообщений для подтверждения дополнительных услуг.

В разделе [Оформление билетов и EMD](issue-ticket.md) добавлено описание проверки успешности сохранения билетов и EMD в бронировании. Эта проверка позволяет убрать необходимость чтения бронирования после оформления билетов и EMD.

В разделе [Чтение масок билетов и EMD](get-ticket.md) добавлено описание сервиса [TicketingDocumentServicesRQ](https://developer.sabre.com/docs/sabre_sonic_apis/soap/ticketing/get_ticket_doc_details) для чтения масок билетов и EMD из базы данных Sabre.

Создан раздел [Обмены и возвраты билетов](exchanges-refunds.md) с общей информацией о выполнении обменов и возвратов с использованием Sabre APIs.

В разделе [Войдирование билетов и EMD](void-ticket.md) добавлено описание атрибута ```/@NumResponses```, который рекомендуется указывать в запросах к сервису [VoidTicketLLSRQ](https://developer.sabre.com/docs/soap_apis/air/fulfill/Void_Air_Ticket).

В разделе [Получение текста правил тарифов](fare-rules.md) исправлены алгоритмы получения данных для составления запросов, а также добавлены алгоритмы для получения данных из ответа сервиса [RevalidateItinRQ](https://developer.sabre.com/docs/read/soap_apis/air/search/revalidate_itinerary).

Переработана структура раздела [Получение структурированных правил тарифов](structure-fare-rules.md).

Во всех разделах сервис для сохранения бронирования [EndTransactionLLSRQ](https://developer.sabre.com/docs/soap_apis/management/itinerary/End_Transaction) заменен на новый сервис [EnhancedEndTransactionRQ](https://developer.sabre.com/docs/soap_apis/utility/reservation/enhanced_end_transaction), который умеет обрабатывать предупреждения системы. В разделе [Вынужденный обмен билетов](involuntary-exchange-ticket.md) этот сервис используется для принятия изменений в расписании вместо отправки терминальной команды при помощи сервиса [SabreCommandLLSRQ](https://developer.sabre.com/docs/read/soap_apis/management/utility/send_sabre_command).

Во всех разделах добавлены ссылки на новые агентские порталы Sabre: Sabre Central (вместо Agency eServices) и Finder (вместо Format Finder). 

В разделе [Начало работы](introduction.md) добавлена дополнительная информация о процедурах очищения тестовой среды и календарь процедур на 2020 год.

В разделах [Конфигурация Sabre](configuration.md) и [Аутентификация](authentication.md) добавлена информация о блокировках учетных записей (EPR) и о способах разблокировки их.

В разделах [Начало работы](introduction.md) и [Отправка терминальных команд](commands.md) добавлены ссылки на [справочник форматов Sabre](http://airts.ru/upload/Manuals_and_Installers/Manuals/Practice_manuals/Format.pdf).

Создан раздел [Переход в другие PCC](change-pcc.md) с описанием сервиса [ContextChangeLLSRQ](https://developer.sabre.com/docs/soap_apis/management/utility/change_aaa). Из других разделов убраны примеры использования этого сервиса и добавлены ссылки на новый раздел.

Добавлена поддержка HTTPS для страниц сайта.

-----------

**07.06.2019**. В различных разделах рекомендаций обновлены версии используемых сервисов:
- BargainFinderMaxRQ до [версии 5.1.0](https://releasenotes.developer.sabre.com/2019/03/28/bargain-finder-max-v5-1-0-on-march-28-2019)
- BargainFinderMax_ADRQ до версии 5.1.0
- RevalidateItinRQ до [версии 5.1.0](https://releasenotes.developer.sabre.com/2019/03/28/revalidate-itinerary-v5-1-0-on-march-28-2019)
- ExchangeShoppingRQ до [версии 2.3.0](https://releasenotes.developer.sabre.com/2019/04/01/exchange-shopping-v2-3-0-on-april-1-2019)
- EnhancedAirBookRQ до [версии 3.10.0](https://releasenotes.developer.sabre.com/2019/05/21/orchestrated-air-booking-v3-10-0-on-may-21-2019)
- CreatePassengerNameRecordRQ до [версии 2.2.0](https://releasenotes.developer.sabre.com/2019/06/06/create-passenger-name-record-v2-2-0-on-june-6-2019)

В разделе [Поиск перелетов по заданным датам](shop.md) добавлено описание возможности производить поиск только брендированных или небрендированных тарифов, запрещать поиск по аэропортам в других странах при поиске альтернативных аэропортов вылета и прилета, а также получать в ответе на запрос информацию об услугах для найденных брендов.

В разделе [Проверка стоимости и наличия мест](revalidate-itinerary.md) добавлено описание возможности получать расчет перелета во всех доступных брендах, а также получать в ответе на запрос информацию об услугах для найденных брендов.

В разделе [Поиск вариантов перелетов для обмена](shop-exchange-ticket.md) добавлено описание возможности производить поиск только брендированных или небрендированных тарифов, производить поиск перелетов только для заданных брендов, а также получать в ответе на запрос информацию об услугах для найденных брендов.

В связи с этими изменениями была переработана структура раздела [Брендированные тарифы](brands.md), а также были удалены разделы Расчет стоимости по всем брендам (расчет можно произвести при помощи сервиса [RevalidateItinRQ](revalidate-itinerary.md)) и Получение информации о брендах (информацию можно получить в ответах на запросы к сервисам [BargainFinderMaxRQ](shop.md), [BargainFinderMax_ADRQ](shop-alternate-dates.md), [RevalidateItinRQ](revalidate-itinerary.md) и [ExchangeShoppingRQ](shop-exchange-ticket.md)).

В разделах [Создание бронирований в 1 шаг](create-booking-1step.md) и [Создание бронирований в 2 шага](create-booking-2steps.md) добавлено описание возможности вставлять наземные сегменты как до момента расчета стоимости, так и после него.

В разделе [Бронирование дополнительных услуг](book-ancillaries.md) обновлены описания элементов ```CommisionIndicator``` и ```InterlineIndicator```.

-----------

**28.03.2019**. Обновлена версия сервиса EnhancedSeatMapRQ до [версии 6.0.0](https://releasenotes.developer.sabre.com/2019/03/13/enhanced-seat-map-v6-0-0-on-march-13-2019).

В разделе [Поиск перелетов по заданным датам](shop.md) добавлено:
- описание возможности поиска комбинаций перелетов с частично известными рейсами
- ссылка на документацию по работе функции поиска в нескольких PCC
- дополнительные примеры запросов и ответов

В разделе [Получение списка дополнительных услуг](get-ancillaries.md) добавлено описание возможности получения списка дополнительных услуг для бронирований с оформленными билетами.

В разделе [Получение карты мест в салоне](get-air-seats.md) добавлено описание возможности получать карту мест в салоне для всех пассажиров в бронировании.

В разделе [Настройки PCC](tjr-settings.md) обновлено описание многих настроек.

В разделах [Создание бронирований в 1 шаг](create-booking-1step.md) и [Создание бронирований в 2 шага](create-booking-2steps.md) добавлено:
- описание возможности не устанавливать тайм-лимит при создании бронирования (значение ```7T-A```)
- описание возможности получения условий обменов и возвратов

-----------

**20.02.2019**. Создан раздел [Вынужденный обмен билетов](involuntary-exchange-ticket.md).

Удален раздел Ревалидация билетов. Вместо ревалидации билетов рекомендуется использовать вынужденный обмен билетов.

-----------

**14.02.2019**. Создан раздел [Проверка стоимости и наличия мест](revalidate-itinerary.md).

Удален раздел Неподтвержденные места.

Переработана структура раздела [Получение текста правил тарифов](fare-rules.md).

Раздел Получение информации о наличии мест переименован в [Поиск по расписаниям и получение данных о наличии мест](get-availability.md).

В разделе [Настройки PCC](tjr-settings.md) добавлено описание настройки Passenger Name Association, которая активирует возможность привязки некоторых элементов бронирования к пассажирам.

-----------

**06.02.2019**. В различных разделах рекомендаций обновлены версии используемых сервисов:
- BargainFinderMaxRQ до [версии 4.3.0](https://releasenotes.developer.sabre.com/2018/09/20/bargain-finder-max-v4-3-0-on-september-20-2018)
- BargainFinderMax_ADRQ до [версии 4.3.0](https://releasenotes.developer.sabre.com/2018/09/20/alternate-date-v4-3-0-on-september-20-2018)
- ExchangeShoppingRQ до [версии 2.2.0](https://releasenotes.developer.sabre.com/2018/12/12/exchange-shopping-v2-2-0-on-december-12-2018)
- PassengerDetailsRQ до [версии 3.4.0](https://releasenotes.developer.sabre.com/2018/12/23/passenger-details-v3-4-0-on-december-23-2018)
- AirSchedulesAndAvailabilityRQ до версии [5.2.0](https://releasenotes.developer.sabre.com/2018/10/21/air-schedules-and-availability-v5-2-0-on-october-21-2018)
- EndTransactionLLSRQ до [версии 2.0.9](https://releasenotes.developer.sabre.com/2018/09/27/end-transaction-v2-0-9-on-september-27-2018)
- PO_AllBrandsPricingRQ до [версии 1.0.9](https://releasenotes.developer.sabre.com/2018/09/20/price-with-multiple-brands-v1-0-9-on-september-20-2018)
- UpdateReservationRQ до [версии 1.19.0](https://releasenotes.developer.sabre.com/2018/08/16/update-itinerary-v1-19-0-on-august-16-2018)
- GetAncillaryOffersRQ до версии 3.0.2
- OTA_AirPriceLLSRQ до [версии 2.17.0](https://releasenotes.developer.sabre.com/2018/08/02/price-air-itinerary-v2-17-0-on-august-2-2018)

В разделе [Настройки PCC](tjr-settings.md) добавлено описание настроек, изменяющих логику работы с валидирующими перевозчиками Validating Carrier, Interline, and GSA и Restrict Validating Carrier to Traditional Validating Carrier.

В разделе [Поиск перелетов по заданным датам](shop.md) добавлено описание следующих возможностей:
- возможность управления выбором валидирующего перевозчика
- возможность указать черный и белый список кодов брендов
- Air Shopping Rules Manager — бесплатный продукт Sabre, который предоставляет возможность устанавливать различные параметры поисковых запросов через веб-интерфейс

В разделе [Создание бронирований в 1 шаг](create-booking-1step.md) добавлено описание следующих возможностей:
- возможность указать выбранный сток при создании расчета стоимости
- алгоритм установки индикатора женатого сегмента по данным из ответа сервиса BargainFinderMaxRQ
- проверка подтверждения сегментов бронирования и наличия локаторов перевозчиков

В разделе [Создание бронирований в 2 шага](create-booking-2steps.md) добавлено описание следующих возможностей:
- возможность указать выбранный сток при создании расчета стоимости
- алгоритм установки индикатора женатого сегмента по данным из ответа сервиса BargainFinderMaxRQ

В разделе [Обмен билетов](exchange-ticket.md) предлагается использование нового сервиса для подготовки и расчета стоимости обмена билетов [ExchangeBookingRQ](https://developer.sabre.com/docs/read/soap_apis/air/fulfill/exchange_booking).

В разделе [Поиск вариантов перелетов для обмена](shop-exchange-ticket.md) добавлено описание возможности получения дополнительной информации о нормах провоза багажа, проверки возможности возврата или переиспользования EMD и обновлена структура.

В разделе [Получение данных о наличии мест](get-availability.md) добавлено описание возможности исключения интерлайн перелетов.

В разделе Расчет стоимости по всем брендам добавлено описание возможности использования черных и белых списков брендов.

В разделе [Получение списка дополнительных услуг](get-ancillaries.md) убрана рекомендация отправлять элемент ```/gao:GetAncillaryOffersRQ/gao:AncillaryRequestOptions/anc:ServiceType``` в запросе к сервису GetAncillaryOffersRQ.

-----------

**03.07.2018**. В различных разделах рекомендаций обновлены версии используемых сервисов:
- CreatePassengerNameRecordRQ до [версии 2.1.0](https://releasenotes.developer.sabre.com/2018/06/27/create-passenger-name-record-v2-1-0-on-june-27-2018)
- BargainFinderMaxRQ до [версии 4.2.0](https://releasenotes.developer.sabre.com/2018/06/27/bargain-finder-max-v4-2-0-on-june-27-2018)
- BargainFinderMax_ADRQ до [версии 4.2.0](https://releasenotes.developer.sabre.com/2018/06/27/alternate-date-v4-2-0-on-june-27-2018)
- PO_AllBrandsPricingRQ до [версии 1.0.8](https://releasenotes.developer.sabre.com/2018/06/27/price-with-multiple-brands-v1-0-8-on-june-27-2018)
- QueueAccessLLSRQ до [версии 2.0.9](https://releasenotes.developer.sabre.com/2018/04/26/access-queue-v2-0-9-on-april-26-2018)
- UpdateReservationRQ до [версии 1.18.0](https://releasenotes.developer.sabre.com/2018/02/21/update-itinerary-v1-18-0-on-february-21-2018)

Разделы Получение расписаний и Проверка наличия мест объединены в раздел [Получение информации о наличии мест](get-availability.md), в котором представлены рекомендации по использованию нового сервиса [AirSchedulesAndAvailabilityRQ](https://developer.sabre.com/docs/soap_apis/air/search/air_schedules_availability).

В разделах [Создание бронирований в 1 шаг](create-booking-1step.md) и [Создание бронирований в 2 шага](create-booking-2steps.md) добавлено описание возможности указывать несколько разных инструкций расчета стоимости при создании бронирования.

В разделах [Поиск перелетов по заданным датам](shop.md) и Расчет по всем брендам добавлено описание атрибутов для выбора режима отбора брендированных тарифов.

В разделе [Получение норм провоза багажа](baggage.md) добавлено описание процесса получения норм провоза при расчете стомости перелета по всем доступным брендам при помощи сервиса [PO_AllBrandsPricingRQ](https://developer.sabre.com/docs/soap_apis/air/book/price_with_multiple_brands).

В разделе [Бронирование дополнительных услуг](ancillaries.md) расширен список обязательных для заполнения элементов в запросе к сервису UpdateReservationRQ.

Удален раздел Поиск по гибким направлениям. Для поиска перелетов по гибким направлениям предлагается использовать сервис BargainFinderMaxRQ (см. [Поиск перелетов по заданным датам](shop.md)).

В разделе [Начало работы](introduction.md) указан способ получения полного доступа к документации на портале Sabre Dev Studio и подписки на рассылку Sabre APIs.

-----------

**17.05.2018**. В разделах [Чтение масок билетов и EMD](get-ticket.md) и Ревалидация билетов для чтение масок билетов и EMD используется сервис [TKT_ElectronicDocumentServicesRQ](https://developer.sabre.com/docs/soap_apis/air/fulfill/get_electronic_document).

-----------

**24.04.2018**. В разделе [Настройки PCC](tjr-settings.md) добавлено описание настройки Multi-Ticket Shopping and Pricing (Поиск перелетов с оформлением на нескольких билетах).

-----------

**16.04.2018**. В разделе [Поиск перелетов по заданным датам](shop.md) в подразделе Маршрут и даты добавлено описание возможности поиска перелетов по альтернативным направлениям и датам.

-----------

**06.04.2018**. В различных разделах рекомендаций обновлены версии используемых сервисов:
- BargainFinderMaxRQ до [версии 4.1.0](https://releasenotes.developer.sabre.com/2018/03/27/bargain-finder-max-v4-1-0-on-march-27-2018)
- BargainFinderMax_ADRQ до [версии 4.1.0](https://releasenotes.developer.sabre.com/2018/03/27/alternate-date-v4-1-0-on-march-27-2018)
- BargainFinderMax_ASRQ до [версии 4.1.0](https://releasenotes.developer.sabre.com/2018/03/27/alternate-airport-shop-v4-1-0-on-march-27-2018)
- TravelitineraryReadRQ до [версии 3.10.0](https://releasenotes.developer.sabre.com/2017/11/16/get-itinerary-v3-10-0-on-november-16-2017)
- EnhancedAirBookRQ до [версии 3.9.0](https://releasenotes.developer.sabre.com/2018/01/25/enhanced-air-book-v3-9-0-on-january-25-2018)
- PO_AllBrandsPricingRQ до версии 1.0.6
- StructureFareRulesRQ до [версии 1.0.4](https://releasenotes.developer.sabre.com/2018/03/27/get-structured-fare-rules-v1-0-4-on-march-27-2018)

В разделе [Поиск перелетов по заданным датам](shop.md) добавлены:
- возможность задать класс обслуживания для каждого плеча по отдельности
- возможность убрать из поисковой выдачи варианты перелетов с кодшер рейсами

Удален раздел с устаревшим процессом низкоуровневого оформления билетов. Для оформления билетов рекомендуется использовать процесс, описанный в разделе [Оформление билетов и EMD](issue-ticket.md).

Создан раздел [Получение норм провоза багажа](baggage.md).

Создан раздел [Чтение бронирований из архива](get-archive-booking.md).

В разделе [Оформление билетов и EMD](issue-ticket.md) исправлены ошибки в XPath адресах элементов запроса AirTicketRQ.

В разделах [Создание бронирований в 1 шаг](create-booking-1step.md) и [Создание бронирований в 2 шага](create-booking-2steps.md) убрано описание необходимости указания типа перевозчика (hosted или non-hosted) при добавлении документов и других SSR и OSI сообщений в запросах к сервисам CreatePassengerNameRecordRQ и PassengerDetailsRQ.

В разделе [Бронирование дополнительных услуг](book-ancillaries.md) добавлена [ссылка](https://developer.sabre.com/files/SSR_-__Free_Text_Table_for_Air_Extras.xlsx) на список шаблонов SSR сообщений, которые требуется отправлять перевозчикам.

В разделе [Бронирование дополнительных услуг](ancillaries.md) расширен список обязательных для заполнения элементов в запросе к сервису UpdateReservationRQ.

Рекомендации по выполнению обменов и возвратов выделены в 4 раздела:
- [Поиск вариантов перелетов для обмена](shop-exchange-ticket.md)
- [Обмен билетов](exchange-ticket.md)
- [Расчет стоимости возврата билетов](price-refund-ticket.md)
- [Возврат билетов](refund-ticket.md)

Рекомендации по работе с инструментами Air Merchandising выделены в следующие разделы:
- [Брендированные тарифы](brands.md)
    - Расчет стоимости по всем брендам
    - Получение информации о брендах
- [Дополнительные услуги](ancillaries.md)
    - [Получение списка дополнительных услуг](get-ancillaries.md)
    - [Бронирование дополнительных услуг](book-ancillaries.md)
    - [Отмена дополнительных услуг](cancel-ancillaries.md)
- [Места в салоне](air-seats.md)
    - [Получение карты мест в салоне](get-air-seats.md)
    - [Бронирование мест в салоне](book-air-seats.md)
    - [Отмена мест в салоне](cancel-air-seats.md)

Раздел Чтение и редактирование бронирований разделен на два раздела:
- [Чтение бронирований](get-booking.md)
- [Редактирование бронирований](edit-booking.md)

В разделе [Настройки PCC](tjr-settings.md):
- для настройки Ticket from Stored Fare указано как она будет работать при попытке оформить билеты с истекшим тайм-лимитом
- настройка Ticket Using Multiple PQ отмечена как нерекомендуемая для включения
- для настройки PSPT Warning Message указан формат OSI сообщения для добавления паспорта для младенца, а также приведены примеры его добавления

В разделе [Оптимизация времени поиска](shop-optimization.md) добавлена рекомендация по использованию постоянного HTTP соединения (HTTP persistent connection).

В разделе [Поиск перелетов по заданным датам](shop.md) дополнено описание логики выбора класса обслуживания.

Изменена структура раздела [Обработка очередей](queues.md).

В разделе [Получение карты мест в салоне](get-air-seats.md) добавлено описание способа расшифровки характеристик мест в салоне.

Обновлен процесс поиска перелетов по коду тарифа в разделе [Поиск перелетов по кодам тарифов](shop-by-fare.md).

Исправлена ошибка, из-за которой в некоторых случаях не работали ссылки в оглавлении разделов.

Обновлены примеры запросов и ответов к сервисам, а также схемы процессов.

-----------

**25.12.2017**. В различных разделах рекомендаций обновлены версии используемых сервисов:
- BargainFinderMaxRQ до [версии 3.4.0](https://releasenotes.developer.sabre.com/2017/12/13/bargain-finder-max-v3-4-0-on-december-13-2017)
- BargainFinderMax_ADRQ до версии 3.4.0
- BargainFinderMax_ASRQ до версии 3.4.0
- AirTicketRQ до [версии 1.2.0](https://releasenotes.developer.sabre.com/2017/12/14/enhanced-air-ticket-v1-2-0-on-december-14-2017)
- AirTicketLLSRQ до [версии 2.11.0](https://releasenotes.developer.sabre.com/2017/12/06/issue-air-ticket-v2-11-0-on-december-6-2017)
- ExchangeShoppingRQ до [версии 2.1.0](https://releasenotes.developer.sabre.com/2017/12/05/exchange-shopping-v2-1-0-on-december-5-2017)
- QueueCountLLSRQ до [версии 2.2.1](https://releasenotes.developer.sabre.com/2017/11/16/get-queue-count-v2-2-1-on-november-16-2017)
- OTA_AirRulesLLSRQ до [версии 2.3.0](https://releasenotes.developer.sabre.com/2017/11/16/air-fare-rules-v2-3-0-on-november-16-2017)
- EndTransactionLLSRQ до [версии 2.0.8](https://releasenotes.developer.sabre.com/2017/11/16/end-transaction-v2-0-8-on-november-16-2017)

В разделе [Поиск перелетов по заданным датам](shop.md) добавлено описание следующих возможностей:
- поиск в нескольких PCC
- возможность указать желаемый пункт для длительной пересадки (stopover) для каждого плеча
- возможность указать желаемые классы бронирования для каждого плеча или всего маршрута
- возможность указать комбинацию оперирующего и маркетингового перевозчика для черного или белого списка
- возможность в функции Multiple Fares per Itinerary запросить расчет, в котором как минимум для одного тарифа были применены заданные Account Code или Corporate ID 
- возможность в функции Multiple Fares per Itinerary запросить расчет, в котором как минимум для одного тарифа была применена запрошенная категория пассажира
- возможность в функции Multiple Fares per Itinerary указать желаемые классы бронирования для каждого плеча или всего маршрута
- возможность в функции Multiple Fares per Itinerary указать желаемый класс обслуживания для каждого плеча

Раздел Низкоуровневое оформление (используется сервис AirTicketLLSRQ) признан устаревшим и со временем будет удален. Рекомендуемый процесс оформления билетов и EMD представлен в разделе [Оформление билетов и EMD](issue-ticket.md) (используется сервис AirTicketRQ).

В разделе [Оформление билетов и EMD](issue-ticket.md) добавлены рекомендации по проверке данных до и после оформления билетов и EMD, а также рекомендации по добавлению туркода.

В разделе [Войдирование билетов и EMD](void-ticket.md) добавлен процесс войдирования не сохраненных в бронировании билетов и EMD.

Создан раздел [Возврат билетов](refund-ticket.md).

В разделах [Создание бронирований в 1 шаг](create-booking-1step.md) и [Создание бронирований в 2 шага](create-booking-2steps.md) обновлены примеры запросов.

В разделе [Формирование отчетов](report-ticket.md) обновлены рекомендации по использованию сервиса [TKT_TravelAgencyReportsRQ](https://developer.sabre.com/docs/read/soap_apis/air/fulfill/display_audit_trail).

В разделе [Аутентификация](authentication.md) добавлено описание и ссылка для загрузки скрипта для терминала Sabre Red Workspace для копирования идентификатора сессии в буфер обмена.

Из раздела [Начало работы](introduction.md) удалены рекомендации по отправке команд, начинающихся с ```OVHE```, для работы в тестовой среде. Теперь Bookability перевозчиков в тестовой среде должен быть высоким по умолчанию.

-----------

**25.10.2017**. В разделе [Тайм-лимиты бронирований](timelimit.md) добавлены новые шаблоны для SSR сообщений следующих авиакомпаний: 3U, 5N, 6H, 7R, 8M, A3, AC, AE, AH, AM, BA, BD, BG, BJ, CI, CM, DL, EW, F9, GA, GS, H1, HO, HZ, IG, JD, JP, K6, KM, MF, MI, NH, NT, NX, OD, OM, OY, PN, QF, QS, RS, SA, ST, SV, SW, SX, SU, TA, TN, TR, UL, VT, VX, VY, W2, XQ, ZH, ZM.

Теперь раздел содержит шаблоны для 142 авиакомпаний.

-----------

**23.10.2017**. В разделе [Поиск перелетов по заданным датам](shop.md) обновлены подразделы "Маршрут", "Остановки и пересадки", "Branded Fares" и другие.

В разделе [Начало работы](introduction.md) расширено описание формата SOAP сообщений.

Информация о бронировании брендированных тарифов перенесена из раздела Branded Fares в разделы [Создание бронирований в 1 шаг](create-booking-1step.md) и [Создание бронирований в 2 шага](create-booking-2steps.md).

Созданы разделы Расчет стоимости по всем брендам и Получение информации о брендах.

В разделе [Настройки PCC](tjr-settings.md) для настройки Minimum Connect Time Edit добавлена информация об обработке результатов работы настройки сервисами CreatePassengerNameRecordRQ и PassengerDetailsRQ, а для настройки PSPT Warning Message информация об отключении предупреждений при оформлении билетов для младенцев без места.

Создан раздел [Чтение масок билетов и EMD](get-ticket.md).

В разделе [Получение текста правил](fare-rules.md) добавлена информация о получении текста правил тарифов при помощи сервиса OTA_AirRulesLLSRQ на основании ответа сервиса для чтения бронирования TravelItineraryReadRQ.

В разделе Расчет стоимости по всем брендам для сервиса PO_AllBrandsPricingRQ указаны дополнительные параметры расчета стоимости.

-----------

**18.09.2017**. В разделе [Начало работы](introduction.md) обновлена информация об использовании "боевой" и "тестовой" сред.

Упрощен процесс бронирования дополнительных услуг в разделе [Бронирование дополнительных услуг](ancillaries.md).

Создан раздел [Отмена дополнительных услуг](cancel-ancillaries.md).

Создан раздел [Отмена мест в салоне](cancel-air-seats.md).

В разделе [Список сервисов](services.md) теперь указывается поддержка сервисами работу с сессиями и токенами доступа, а также добавлены ссылки на руководства пользователя.

-----------

**25.08.2017**. Создан раздел [Обработка ошибок](errors.md) с перечнем часто встречающихся ошибок и рекомендациями по их обработке. *Раздел находится в разработке.*

В разделе [Бронирование мест в салоне](air-seats.md) упрощен алгоритм бронирования мест в салоне.

Раздел [Создание бронирований](create-booking.md) разделен на два раздела:
- [Создание бронирований в 1 шаг](create-booking-1step.md) — моментальное создание бронирования, используется сервис CreatePassengerNameRecordRQ
- [Создание бронирований в 2 шага](create-booking-2steps.md) — моментальное бронирование сегментов и хранение их в текущей сессии до момента получения всех данных, необходимых для создания бронирования, используются сервисы EnhancedAirBookRQ и PassengerDetailsRQ

Обновлена версия сервиса CreatePassengerNameRecordRQ до [версии 2.0.0](https://releasenotes.developer.sabre.com/2017/07/27/create-passenger-name-record-v2-0-0-on-july-27-2017).

-----------

**10.08.2017**. В разделе [Формирование отчетов](report-ticket.md) добавлена информация о формировании отчета о неиспользованных билетах.

-----------

**09.08.2017**. В различных разделах рекомендаций обновлены версии используемых сервисов:
- BargainFinderMaxRQ до [версии 3.2.0](https://releasenotes.developer.sabre.com/2017/06/15/bargain-finder-max-v3-2-0-on-june-15-2017)
- BargainFinderMax_ADRQ до [версии 3.2.0](https://releasenotes.developer.sabre.com/2017/06/15/alternate-date-v3-2-0-on-june-15-2017)
- BargainFinderMax_ASRQ до [версии 3.2.0](https://releasenotes.developer.sabre.com/2017/06/15/alternate-airport-shop-v3-2-0-on-june-15-2017)
- EnhancedAirBook до [версии 3.8.0](https://releasenotes.developer.sabre.com/2017/06/16/enhanced-air-book-v3-8-0-on-june-16-2017)
- TravelItineraryReadRQ до [версии 3.9.0](https://releasenotes.developer.sabre.com/2017/05/12/travel-itinerary-read-v3-9-on-may-12-2017)
- OTA_AirPriceLLSRQ до [версии 2.16.0](https://releasenotes.developer.sabre.com/2017/06/22/price-air-itinerary-v2-16-0-on-june-22-2017)
- AirTicketRQ до [версии 1.1.0](https://releasenotes.developer.sabre.com/2017/06/22/orchestrated-air-ticket-v1-1-0-on-june-22-2017)
- AirTicketLLSRQ до [версии 2.10.0](https://releasenotes.developer.sabre.com/2017/06/22/issue-air-ticket-v2-10-0-on-june-22-2017)
- DeleteSpecialServiceLLSRQ до [версии 2.2.1](https://releasenotes.developer.sabre.com/2017/06/22/delete-special-service-v2-2-1-on-june-22-2017)

В разделе [Оформление билетов и EMD](issue-ticket.md) добавлено описание возможности оформлять билеты и EMD в разных инструкциях в рамках одного вызова сервиса AirTicketRQ.

Разделы Использование очередей, Обработка очередей без входа в очереди, Обработка очередей со входом в очереди объединены в один раздел [Обработка очередей](queues.md).

Обновлен раздел [Начало работы](introduction.md).

-----------

**04.08.2017**. Создан раздел [Обмен билетов](exchange-ticket.md).

Создан раздел [Оптимизация времени поиска](shop-optimization.md).

-----------

**05.05.2017**. Переработан раздел [Получение текста правил](fare-rules.md).

Создан раздел [Получение структурированных правил](structure-fare-rules.md).

Обновлен раздел [Получение курсов валют](currency-rates.md).

Раздел [Сессии](authentication.md) переименован в [Аутентификация](authentication.md) и переработан.

В разделе [Создание бронирований](create-booking.md) изменены требования к дате пассивного сегмента, используемого для увеличение срока хранения бронирования (не более 180 дней от даты последнего сегмента в бронировании).

В разделе [Branded Fares](brands.md) в запросе к сервису PO_AllBrandsPricingRQ добавлен обязательный атрибут для заполненения ```/@ArrivalDate``` — дата и время прибытия для сегмента.

Обновлен раздел [Перерасчет стоимости бронирований](reprice-booking.md).

Раздел [Редактирование бронирований](edit-booking.md) переименован в [Чтение и редактирование бронирований](edit-booking.md).

-----------

**03.04.2017**. Создан раздел [Поиск по гибким направлениям](shop-alternate-airports.md).

В разделе [Поиск перелетов по заданным датам](shop.md) добавлена информация о возможности установки требований к условиям обмена и возврата билетов (например для исключения невозвратных вариантов перелета) и расширено описание функции изменения разнообразия поисковой выдачи (Diversity Swapper).

-----------

**31.03.2017**. В различных разделах рекомендаций обновлены версии используемых сервисов:
- BargainFinderMaxRQ до [версии 3.1.0](https://releasenotes.developer.sabre.com/2017/03/30/bargain-finder-max-v3-1-0-on-march-30-2017-2)
- BargainFinderMax_ADRQ до [версии 3.1.0](https://releasenotes.developer.sabre.com/2017/03/30/alternate-date-v3-1-0-on-march-30-2017-2)
- EndTransactionLLSRQ до [версии 2.0.7](https://releasenotes.developer.sabre.com/2017/03/23/endtransaction-v2-0-7-on-march-23-2017)
- OTA_AirAvailLLSRQ до [версии 2.4.0](https://releasenotes.developer.sabre.com/2017/03/23/air-availability-v2-4-0-on-march-23-2017)
- OTA_AirPriceLLSRQ до [версии 2.15.0](https://releasenotes.developer.sabre.com/2017/03/23/price-air-itinerary-v2-15-0-on-march-23-2017)
- OTA_AirRulesLLSRQ до [версии 2.2.1](https://releasenotes.developer.sabre.com/2017/03/23/air-fare-rules-v2-2-1-on-march-23-2017)
- QueueAccessLLSRQ до [версии 2.0.8](https://releasenotes.developer.sabre.com/2017/03/23/access-queue-v2-0-8-on-march-23-2017)
- RulesFromPriceLLSRQ до [версии 2.1.0](https://releasenotes.developer.sabre.com/2017/03/23/fare-rules-from-air-price-v2-1-0-on-march-23-2017)

В разделе [Поиск перелетов по заданным датам](shop.md) добавлена возможность установить применимость черных и белых списков перевозчиков ко всем сегментам перелета или хотя бы одному.

В разделе [Проверка наличия мест](availability.md) добавлена возможность исключить интерлайн перевозки.

В разделе [Тайм-лимиты бронирований](timelimit.md) добавлен новый шаблон для SSR сообщения авиакомпании 3K.

-----------

**14.02.2017**. Переработан раздел [Создание бронирований](create-booking.md):
- обновлена структура раздела
- добавлены дополнительные примеры
- добавлено описание функции сравнения стоимости бронирования с заданной в сервисе EnhancedAirBookRQ
- добавлено описание отправки дополнительной информации в SSR типа ```DOCO``` и ```DOCA```
- другие изменения

В разделах [Поиск перелетов по заданным датам](shop.md) и [Поиск по гибким датам](shop-alternate-dates.md) добавлены новые примеры.

В разделе [Формирование отчетов](report-ticket.md) обновлена версия сервиса TKT_TravelAgencyReportsRQ до [версии 1.2.2](https://releasenotes.developer.sabre.com/2016/11/03/display-audit-trail-v1-2-2-on-november-3-2016).

В разделе [Тайм-лимиты бронирований](timelimit.md) добавлен новый шаблон для SSR сообщения авиакомпании CA.

Раздел Оформление билетов и EMD (устаревший способ) переименован в Низкоуровневое оформление билетов и EMD.

Обновлен внешний вид бокового меню.

Блоки с примерами запросов и ответов теперь можно сворачивать и разворачивать по клику на заголовок, а также копировать в буфер обмена.

-----------

**06.02.2017**. Обновлена структура разделов, посвященных очередям:
- в разделе [Обработка очередей](queues.md) представлена общая информация об очередях, а также рекомендации по обработке некоторых системных очередей
- в разделах [Обработка очередей без входа в очереди](queues.md) и [Обработка очередей со входом в очереди](queues.md) представлены два разных алгоритма обработки очередей
- в разделе [Помещение бронирований в очереди](queue-place.md) представлена информация о помещении бронирований в очереди при создании бронирований и в любой другой момент
- в разделе [Тайм-лимиты бронирований](timelimit.md) представлена информация о получении и установке тайм-лимита бронирования, включая шаблоны SSR сообщений, в которых перевозчики присылают тайм-лимиты

Блоки с примерами запросов и ответов теперь по умолчанию свернуты.

-----------

**25.01.2017**. В разделе [Бронирование мест в салоне](air-seats.md) обновлена версия сервиса EnhancedSeatMapRQ до [версии 5.0.0](https://releasenotes.developer.sabre.com/2016/11/30/enhancedseatmap-v5-0-0-on), а также добавлена возможность получения карты мест для указанного тарифа и категории пассажира.

-----------

**30.12.2016**. В разделе [Branded Fares](brands.md) добавлено описание возможности получать информацию об используемом бренде в результатах поиска без необходимости получения расчета по всем доступным брендам.

Переработан раздел [Поиск по кодам тарифов](shop-by-fare.md).

-----------

**26.12.2016**. В разделе [Оформление билетов и EMD](issue-ticket.md) представлен обновленный процесс оформления билетов и EMD при помощи сервиса-обертки (orchestrated service) [AirTicketRQ](https://developer.sabre.com/docs/soap_apis/air/fulfill/enhanced_air_ticket). Устаревший процесс оформления билетов и EMD при помощи низкоуровневого сервиса [AirTicketLLSRQ](https://developer.sabre.com/docs/read/soap_apis/air/fulfill/issue_air_ticket) перенесен в раздел Оформление билетов и EMD (устаревший способ).

В разделе [Поиск перелетов по заданным датам](shop.md) добавлено описание возможностей получения дополнительной информации о нормах провоза багажа.

В разделе [Branded Fares](brands.md) добавлен процесс получения расчетов по всем доступным брендам по запросу к сервису [PO_AllBrandsPricingRQ](https://developer.sabre.com/docs/soap_apis/air/book/price_with_multiple_brands).

-----------

**19.12.2016**. В разделе [Настройки PCC](tjr-settings.md) добавлена возможность проверки настроек в конкретном PCC.

Создан раздел Ревалидация билетов.

Переработан раздел Неподтвержденные места.

-----------

**16.12.2016**. В разделе [Поиск перелетов по заданным датам](shop.md) обновлена версия сервиса BargainFinderMaxRQ до [версии 3.0.0](https://releasenotes.developer.sabre.com/2016/12/15/bargain-finder-max-v3-0-0-on-december-15-2016-2).

В разделе были добавлены:
- возможность указать тип пункта вылета (аэропорт или город)
- возможность задать черный или белый список оперирующих перевозчиков
- описание функции Multiple Fares per Itinerary

-----------

**15.12.2016**. Обновлен раздел [Branded Fares](brands.md) в связи с добавлением поддержки Branded Fares авиакомпанией S7 Airlines (S7).

В разделе [Настройки PCC](tjr-settings.md) добавлена информация о настройке Minimum Connect Time Edit, которая проверяет соответствие бронируемого перелета минимальному времени для пересадки в аэропорту.

-----------

**09.12.2016**. Создан раздел [Настройки PCC](tjr-settings.md), содержащий перечень рекомендованных и иных настроек PCC (TJR).

Переработан раздел [Редактирование бронирований](edit-booking.md).

Создан раздел Air Merchandising, объединяющий разделы со всеми возможностями Sabre по поиску и бронированию дополнительных услуг и брендированных тарифов.

Создан раздел [История бронирований](get-history-booking.md).

Обновлена структура других разделов.

В различных разделах рекомендаций обновлены версии используемых сервисов:
- AirTicketLLSRQ до [версии 2.9.0](https://releasenotes.developer.sabre.com/2016/11/10/issue-air-ticket-v2-9-0-on-november-10-2016)
- OTA_AirPriceLLSRQ до [версии 2.14.0](https://releasenotes.developer.sabre.com/2016/11/10/price-air-itinerary-v2-14-0-on-november-10-2016)
- TravelItineraryReadRQ до [версии 3.8.0](https://releasenotes.developer.sabre.com/2016/09/21/tir-v3-8-on-september-21-2016)

-----------

**30.11.2016**. В разделе [Бронирование мест в салоне](air-seats.md) представлен упрощенный процесс бронирования мест в салоне.

В разделе [Поиск перелетов по заданным датам](shop.md) добавлен подраздел Интерлайн.

-----------

**25.11.2016**. Создан раздел [Список сервисов](services.md), содержащий список всех использованных в данных рекомендациях сервисов, актуальную версия, ссылки на документацию, соответствующие им терминальные команды, а также ссылки на разделы, в которых эти сервисы представлены.

-----------

**07.11.2016**. Создан раздел [Поиск по кодам тарифов](shop-by-fare.md) с рекомендациями по работе с сервисом [PromotionalShoppingRQ](https://developer.sabre.com/docs/read/soap_apis/air/search/shop_by_specific_fare) (проверка наличия мест по указанному коду тарифа в указанный промежуток дат).

Рекомендации по работе с сервисом [BargainFinderMax_ADRQ](https://developer.sabre.com/docs/soap_apis/air/search/bargain_finder_max/bfm_ad) вынесены в отдельный раздел — [Поиск по гибким датам](shop-alternate-dates.md).

-----------

**03.11.2016**. В разделе [Бронирование дополнительных услуг](ancillaries.md) изменен запрос на получение списка дополнительных услуг.

Создан раздел [Бронирование мест в салоне](air-seats.md).

Переработан раздел [Создание бронирований](create-booking.md):
- обновлена структура раздела
- добавлен алгоритм создания бронирования в другом PCC
- добавлено описание сервиса [CreatePassengerNameRecordRQ](https://developer.sabre.com/docs/read/soap_apis/air/book/create_passenger_name_record) для создания бронирования в один запрос

Изменения в разделе [Branded Fares](brands.md):
- добавлен алгоритм бронирования перелетов с использованием нескольких брендов
- добавлена информация о поддержке авиакомпанией Аэрофлот Branded Fares
- добавлен способ поиска и бронирования тарифов группы "Бизнес Гибкий" авиакомпании S7

В различных разделах рекомендаций обновлены версии используемых сервисов:
- BargainFinderMaxRQ до [версии 1.9.7](https://releasenotes.developer.sabre.com/2016/09/28/bargain-finder-max-v1-9-7-on-september-28-2016-2)
- EnhancedAirBookRQ до [версии 3.7.0](https://releasenotes.developer.sabre.com/2016/09/20/enhanced-air-book-v3-7-0-on-september-20-2016)

В разделе [Конфигурация Sabre](configuration.md) добавлена инструкция по отключению функции "Divide in Party" для сервиса Bargain Finder Max (выдача разных классов бронирования для разных категорий пассажиров в результатах поиска).

В разделе [Использование очередей](queues.md) добавлен новый алгоритм обработки очередей.

-----------

**19.09.2016**. Раздел [Выбор альтернативных тарифов](brands.md) переименован в [Branded Fares](brands.md) и переработан.

Обратите внимание на то, что с 16 сентября 2016 года авиакомпания UTair больше не требует использования категории пассажира ```CMM``` для поиска и бронирования рейсов по тарифам группы (бренда) "Лайт".

-----------

**06.09.2016**. В разделе [Сессии](authentication.md) добавлена информация об использовании сессий, созданных в Sabre Red Workspace (при помощи терминальной команды ```OIATH```).

В разделе [Создание бронирований](create-booking.md) добавлена информация о добавлении бонусных карт, а также об отправке запросов специального сервиса (SSR) и дополнительной информации (OSI) перевозчику.

-----------

**05.09.2016**. Добавлен раздел [Отчет о продажах](report-ticket.md) с информацией о новом сервисе для получения отчета о продажах ([TKT_TravelAgencyReportsRQ](https://developer.sabre.com/docs/read/soap_apis/air/fulfill/display_audit_trail)).

В разделе [Начало работы](introduction.md) добавлена ссылка на централизованное [хранилище](http://releasenotes.developer.sabre.com/category/soap) обновлений сервисов Sabre.

В различных разделах рекомендаций обновлены версии используемых сервисов:
- EndTransactionLLSRQ до [версии 2.0.6](http://releasenotes.developer.sabre.com/2016/08/25/end-transaction-v2-0-6-on-august-25-2016)
- OTA_CancelLLSRQ до [версии 2.0.2](http://releasenotes.developer.sabre.com/2016/08/25/cancel-itinerary-segments-v2-0-2-on-august-25-2016)
- DeletePriceQuoteLLSRQ до [версии 2.1.0](http://releasenotes.developer.sabre.com/2016/08/25/delete-price-quote-v2-1-0-on-august-25-2016)
- QueueAccessLLSRQ до [версии 2.0.7](http://releasenotes.developer.sabre.com/2016/08/25/access-queue-v2-0-7-on-august-25-2016)
- AirTicketLLSRQ до [версии 2.8.0](http://releasenotes.developer.sabre.com/2016/08/25/issue-air-ticket-v2-8-0-on-august-25-2016)
- OTA_AirPriceLLSRQ до [версии 2.13.0](http://releasenotes.developer.sabre.com/2016/08/25/price-air-itinerary-v2-13-0-on-august-25-2016)

-----------

**29.08.2016**. В разделе [Бронирование дополнительных услуг](ancillaries.md) добавлена информация об удалении дополнительных услуг.

В разделе [Создание бронирований](create-booking.md) добавлена информация о бронировании отдельных мест для младенцев, а также увеличении срока хранения бронирования в системе (добавление Retention Segment).

В разделе [Сессии](authentication.md) добавлена информация о получении количества используемых сессий.

В разделе [Отправка терминальных команд](commands.md) добавлена информация о вводе специальных символов.

В разделе [Поиск перелетов по заданным датам](shop.md) добавлена рекомендация указывать время вылета ```11:00``` в поисковом запросе, а также описание атрибута ```ExcludeCallDirectCarriers```, позволяющего не выдавать варианты перелетов тех перевозчиков, которые не доступны для бронирования в Sabre.

Переработан раздел [Конфигурация Sabre](configuration.md).

-----------

**19.08.2016**. Обновлены адреса для отправки запросов к сервисам Sabre:
- среда **CERT**: ```https://sws-crt.cert.havail.sabre.com```
- среда **RES**: ```https://webservices.havail.sabre.com```

Подробнее см. [Начало работы](introduction.md).

Обновлен раздел [Branded Fares](brands.md) в связи с добавлением поддержки Branded Fares авиакомпанией UTair (UT).

В раздел [Отправка терминальных команд](commands.md) добавлена информация о заполнения масок в терминальном режиме.

-----------

**30.07.2016**. Переработан раздел [Бронирование дополнительных услуг](ancillaries.md).

-----------

**22.07.2016**. Обновлен раздел [Branded Fares](brands.md) в связи с добавлением поддержки Branded Fares авиакомпанией Уральские Авиалинии (U6).

Обновлен раздел [Оформление билетов и EMD](issue-ticket.md) для предотвращения случаев непопадения билета в бронировании. Рекомендуется:
- указать ```10``` в качестве значения атрибута ```/AirTicketRQ/@NumResponses```
- включить проверку появления билета при чтении бронирования

В связи с обновлением сервиса BargainFinderMaxRQ до версии 1.9.5. обновлен раздел [Поиск перелетов по заданным датам](shop.md).

-----------

**18.07.2016**. Обновлен раздел [Получение правил тарифов](fare-rules.md), в который были добавлены алгоритмы получения правил тарифа для текущего бронирования, а также из результатов поиска.

-----------

**05.07.2016**. Добавлены разделы [Получение расписаний](schedules.md) и [Проверка наличия мест](availability.md).

-----------

**08.06.2016**. Добавлены команды для самостоятельного включения и отключения настроек TJR в разделе [Конфигурация Sabre](configuration.md).

-----------

**30.05.2016**. В связи с выходом версии 3.6.0 сервиса [EnhancedAirBookRQ](https://developer.sabre.com/docs/soap_apis/air/book/orchestrated_air_booking) обновлен раздел [Создание бронирований](create-booking.md).

Основные изменения:
- в сервисе появилась встроенная возможность перебронирования в случае получения статуса сегмента ```UC```. В связи с этим процесс, указанный в разделе [Неподтвержденные места](unconfirmed.md) (перебронирование сегментов отдельным запросом) считается устаревшим
- изменен формат индикаторов связанных сегментов с ```true``` и ```false``` на ```I``` и ```O```. Теперь он соответствует формату, используемому в ответах поисковых сервисов Bargain Finder Max

-----------