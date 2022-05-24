---
title: Создание бронирований в 2 шага
---

{{< toc >}}

## Алгоритм создания бронирований

![](/sabre-apis-ru/assets/svg/create-booking-2steps/create-booking-2steps.svg)

## Бронирование сегментов (EnhancedAirBookRQ)

{{< hint warning >}}
Для создания бронирований в других PCC предварительно требуется отправить запрос к сервису [ContextChangeLLSRQ](https://developer.sabre.com/docs/read/soap_apis/management/utility/change_aaa) (см. [Переход в другие PCC](change-pcc.html)).
{{< /hint >}}

В качестве первого шага при создании бронирований используется сервис [EnhancedAirBookRQ](https://developer.sabre.com/docs/read/soap_apis/air/book/orchestrated_air_booking), который позволяет забронировать сегменты и выполнить расчет их стоимости.

### Контроль выполнения запроса

EnhancedAirBookRQ является сервисом-оркестратором различных низкоуровневых сервисов. Сервис позволяет остановить ход выполнения запроса в том случае, если запуск любого из низкоуровневых сервисов завершится ошибкой. Для этого необходимо установить значение ```true``` у атрибута ```/EnhancedAirBookRQ/@HaltOnError```. Если дополнительно установить значение ```true``` у атрибута ```/EnhancedAirBookRQ/@IgnoreOnError```, то помимо остановки выполнения запроса, сервис также [очистит](edit-booking.html#игнорирование-бронирования-ignoretransactionllsrq) содержимое текущей [сессии](authentication.html#сессии).

Рекомендуется установить ```true``` в качестве значений обоих атрибутов.

### Проверка минимального стыковочного времени

Для проверки минимального стыковочного времени в запросе необходимо указать значение ```true``` у атрибута ```/EnhancedAirBookRQ/@haltOnInvalidMCT```. В случае наличия в бронировании сегментов с нарушением правил минимального стыковочного времени, сервис прервет выполнение запроса и вернет ошибку следующего вида:

{{< details title="Нарушение правил минимального стыковочного времени" open=true >}}
```XML
<SystemSpecificResults>
  <Message code="ERR.SP.BUSINESS_ERROR">Invalid connect time between air segments - please verify itinerary</Message>
  <Message code="ERR.SP.PROVIDER_ERROR">SabreCommandLLSRQ: INVALID CONNECT TIME SEGS 1 AND 2 - MINIMUM IS 60 MINUTES VERIFY ANY REMAINING SEGS</Message>
</SystemSpecificResults>
```
{{< /details >}}

Бронирование в этом случае создано не будет.

### Предварительная обработка бронирования

#### Чтение бронирования

Для того чтобы произвести бронирование сегментов в уже существующем бронировании необходимо указать код бронирования (PNR Record Locator) в качестве значения атрибута ```/EnhancedAirBookRQ/PreProcessing/UniqueID/@ID```. При создании бронирования не требуется указывать этот атрибут.

#### Игнорирование бронирования

Установка значения ```true``` у атрибута ```/EnhancedAirBookRQ/PreProcessing/@IgnoreBefore``` позволяет игнорировать содержимое текущей сессии перед началом выполнения запроса. Рекомендуется указывать этот атрибут при первоначальном создании бронирования.

### Добавление сегментов

#### Информация о сегментах

Информация о сегментах должна быть указана в элементах ```/EnhancedAirBookRQ/OTA_AirBookRQ/OriginDestinationInformation/FlightSegment```:
- ```/@DepartureDateTime``` — дата отправления
- ```/@FlightNumber``` и ```/MarketingAirline/@FlightNumber``` — номер рейса
- ```/@DepartureDateTime``` — дата отправления
- ```/@NumberInParty``` —  количество запрашиваемых мест (младенцы без места не учитываются)
- ```/@ResBookDesigCode``` —  класс бронирования
- ```/@Status``` —  статус сегмента (при бронировании используется статус ```NN```)
- ```/DestinationLocation/@LocationCode``` —  код пункта прибытия
- ```/MarketingAirline/@Code``` —  код маркетингового перевозчика
- ```/MarriageGrp``` —  индикатор женатого сегмента (подробнее см. ниже). Возможные значения:
    - ```O``` — обычный сегмент
    - ```I``` — женатый сегмент (продолжение предыдущего сегмента)
- ```/OriginLocation/@LocationCode``` —  код пункта отправления

{{< hint danger >}}
Обратите внимание на необходимость корректного заполнения индикатора женатого сегмента! В противном случае, перевозчик может не подтвердить места при создании бронирования. Информацию для заполнения можно взять из ответа на запрос к сервису [BargainFinderMaxRQ](shop.html).
{{< /hint >}}

#### Алгоритм установки индикатора женатого сегмента по данным из стандартного (OTA) ответа сервиса BargainFinderMaxRQ
1. Проассоциировать все сегменты в выбранной рекомендации с соответствующими им элементами ```/OTA_AirLowFareSearchRS/PricedItineraries/PricedItinerary/AirItineraryPricingInfo/PTC_FareBreakdowns/PTC_FareBreakdown/FareBasisCodes/FareBasisCode``` (```/OTA_AirLowFareSearchRS/PricedItineraries/PricedItinerary/TPA_Extensions/AdditionalFares/AirItineraryPricingInfo/PTC_FareBreakdowns/PTC_FareBreakdown/FareBasisCodes/FareBasisCode``` для дополнительных расчетов или ```/OTA_AirLowFareSearchRS/PricedItineraries/PricedItinerary/TPA_Extensions/AdditionalFares/AirItineraryPricingInfo/Tickets/Ticket/AirItineraryPricingInfo/PTC_FareBreakdowns/PTC_FareBreakdown/FareBasisCodes/FareBasisCode``` для MultiTicket рекомендаций). Количество элементов ```FareBasisCode``` будет равно количеству сегментов в рекомендации и идти они будут в том же порядке.
2. Наличие атрибута ```FareBasisCode/@AvailabilityBreak``` означает, что следующий сегмент не является женатым с текущим. Отсутствие атрибута означает, что следующий сегмент является женатым с текущим.
3. В соответствии с правилами указываются индикаторы женатого сегмента:
    - У первого сегмента всегда указывается значение ```O``` (обычный сегмент)
    - Если у предыдущего сегмента значение атрибута ```/@AvailabilityBreak``` равно ```true```, то у текущего сегмента указывается значение ```O``` (обычный сегмент)
    - Если у предыдущего сегмента нет атрибута ```/@AvailabilityBreak```, то у текущего сегмента указывается значение ```I``` (женатый сегмент)

#### Алгоритм установки индикатора женатого сегмента по данным из группированного (GIR) ответа сервиса BargainFinderMaxRQ
1. Проассоциировать все сегменты в выбранной рекомендации с соответствующими им элементами ```/GroupedItineraryResponse/ItineraryGroup/Itinerary/PricingInformation/Fare/PassengerInfo/FareComponent/Segment``` (```/GroupedItineraryResponse/ItineraryGroup/Itinerary/PricingInformation/Ticket/PricingInformation/Fare/PassengerInfo/FareComponent/Segment``` для MultiTicket рекомендаций). Количество элементов ```FareBasisCode``` будет равно количеству сегментов в рекомендации и идти они будут в том же порядке.
2. Наличие атрибута ```Segment/@AvailabilityBreak``` означает, что следующий сегмент не является женатым с текущим. Отсутствие атрибута означает, что следующий сегмент является женатым с текущим.
3. В соответствии с правилами указываются индикаторы женатого сегмента:
    - У первого сегмента всегда указывается значение ```O``` (обычный сегмент)
    - Если у предыдущего сегмента значение атрибута ```/@AvailabilityBreak``` равно ```true```, то у текущего сегмента указывается значение ```O``` (обычный сегмент)
    - Если у предыдущего сегмента нет атрибута ```/@AvailabilityBreak```, то у текущего сегмента указывается значение ```I``` (женатый сегмент)

{{< details title="Пример (3 места на рейсе SU1138 из Шереметьево в Сочи 15 марта в Y классе)" open=true >}}
```XML
<FlightSegment DepartureDateTime="2019-03-15T06:50" FlightNumber="1138" NumberInParty="3" ResBookDesigCode="Y" Status="NN">
  <DestinationLocation LocationCode="AER"/>
  <MarketingAirline Code="SU" FlightNumber="1138"/>
  <MarriageGrp>O</MarriageGrp>
  <OriginLocation LocationCode="SVO"/>
</FlightSegment>
```
{{< /details >}}

#### Проверка статусов сегментов

Сервис EnhancedAirBookRQ позволяет указать список статусов сегментов, при появлении которых выполнение запроса будет остановлено. Статусы сегментов необходимо указать в атрибутах ```/EnhancedAirBookRQ/OTA_AirBookRQ/HaltOnStatus/@Code```.

{{< details title="Рекомендуемый список статусов сегментов" open=true >}}
```XML
<HaltOnStatus Code="HL"/>
<HaltOnStatus Code="HN"/>
<HaltOnStatus Code="HX"/>
<HaltOnStatus Code="LL"/>
<HaltOnStatus Code="NN"/>
<HaltOnStatus Code="NO"/>
<HaltOnStatus Code="PN"/>
<HaltOnStatus Code="UC"/>
<HaltOnStatus Code="UN"/>
<HaltOnStatus Code="US"/>
<HaltOnStatus Code="UU"/>
```
{{< /details >}}

Сервис будет проверять статусы сегментов каждые ```/EnhancedAirBookRQ/OTA_AirBookRQ/RedisplayReservation/@WaitInterval``` миллисекунд ```/EnhancedAirBookRQ/OTA_AirBookRQ/RedisplayReservation/@NumAttempts``` раз до тех пор, пока статусы сегментов не изменятся с ```NN``` на другие. Если после выполнения всех проверок сегменты будут по-прежнему иметь статус ```NN``` и этот статус будет указан в списке статусов сегментов (см. выше), то выполнение запроса будет прервано. 

{{< details title="Рекомендуемые значения (10 проверок 500 миллисекунд)" open=true >}}
```XML
<RedisplayReservation NumAttempts="10" WaitInterval="500"/>
```
{{< /details >}}

Сервис предоставляет возможность автоматического перебронирования сегментов на доступный класс в случае появления статуса сегмента ```UC```. Для этого необходимо указать значение ```true``` у атрибута ```/EnhancedAirBookRQ/OTA_AirBookRQ/RetryRebook/@Option```.

#### Добавление наземных сегментов

В Sabre все сегменты в бронировании должны идти последовательно без разрывов, т.е. город отправления (**не аэропорт!**) следующего сегмента должен быть равен городу прибытия предыдущего сегмента. Если в бронировании есть разрывы, то необходимо вставить специальные наземные сегменты — ARUNK (Arrival Unknown).

В процессе создания бронирования в 2 шага наземные сегменты могут быть добавлены в бронирование в двух местах:
- до момента расчета стоимости в запросе к сервису EnhancedAirBookRQ
- после момента расчета стоимости в запросе к сервису PassengerDetailsRQ (см. описание ниже)

Для добавления наземных сегментов в сервисе EnhancedAirBookRQ необходимо добавить в запрос элемент ```/EnhancedAirBookRQ/PostProcessing/ARUNK_RQ```. Этот элемент можно указывать во всех запросах, если наземный сегмент не требуется, то он просто не будет вставлен в бронирование, при этом выполнение запроса не прервется.

### Расчет стоимости

В запросе можно указать один или несколько последовательно идущих элементов ```/EnhancedAirBookRQ/OTA_AirPriceRQ```, в каждом из которых можно передать независимые параметры расчета стоимости (см. ниже).

#### Создание PQ

Для сохранения в бронировании PQ (Price Quote, расчет стоимости) необходимо указать значение ```true``` у атрибута ```/EnhancedAirBookRQ/OTA_AirPriceRQ/PriceRequestInformation/@Retain```. В дальнейшем PQ потребуется в бронировании для оформления билетов.

#### Выбор валидирующего перевозчика

Код валидирующего перевозчика необходимо указать в качестве значения атрибута ```/EnhancedAirBookRQ/OTA_AirPriceRQ/PriceRequestInformation/OptionalQualifiers/FlightQualifiers/VendorPrefs/Airline/@Code```.

#### Выбор стока

В случае, если оформление билета планируется не на стоке BSP, то в запросе необходимо указать код стока в качестве значения элемента ```/EnhancedAirBookRQ/OTA_AirPriceRQ/PriceRequestInformation/OptionalQualifiers/MiscQualifiers/ValidationMethod```.

Доступные коды стоков:

| Сток | Код стока |
| -- | -- |
| Сток BSP | ```BSP``` |
| Прямой сток Аэрофлота | ```RUT``` |
| Прямой сток других авиакомпаний | ```GEN``` |
| Сток ТКП | ```TCH``` |

#### Выбор категорий пассажиров

Для каждой категории пассажиров в запрос необходимо добавить элемент ```/EnhancedAirBookRQ/OTA_AirPriceRQ/PriceRequestInformation/OptionalQualifiers/PricingQualifiers/PassengerType``` со следующими атрибутами:
- ```/@Code``` — код категории пассажиров
- ```/@Quantity``` — количество пассажиров выбранной категории

Коды основных категорий пассажиров:
- ```ADT``` — взрослый пассажир (от 12 лет)
- ```CNN``` — ребенок (от 2 до 12 лет)
- ```INF``` — младенец без места (до 2 лет)
- ```INS``` — младенец с местом (до 2 лет)

{{< hint warning >}}
Обратите внимание на то, что в некоторых случаях возраст ребенка может влиять стоимость перелета. В этих случаях рекомендуется указывать возраст ребенка в коде категории пассажира. Например, ```C05``` для пятилетнего ребенка.
{{< /hint >}}

#### Расчет стоимости по брендированным тарифам 

Алгоритм внесения информации о бренде различается в зависимости от того применяется ли один и тот же бренд для всех сегментов бронирования или несколько разных брендов применяются для разных сегментов.

Для получения этой информации необходимо проанализировать ответ сервиса BargainFinderMaxRQ или RevalidateItinRQ:
- если все элементы ```/OTA_AirLowFareSearchRS/PricedItineraries/PricedItinerary/AirItineraryPricingInfo/PTC_FareBreakdowns/PTC_FareBreakdown/PassengerFare/TPA_Extensions/FareComponents/FareComponent``` (для самой дешевой комбинации брендов) или ```/OTA_AirLowFareSearchRS/PricedItineraries/PricedItinerary/TPA_Extensions/AdditionalFares/AirItineraryPricingInfo/PTC_FareBreakdowns/PTC_FareBreakdown/PassengerFare/TPA_Extensions/FareComponents/FareComponent``` (для дополнительных вариантов) содержат один и тот же код бренда в качестве значения атрибута ```/@BrandID```, то для всего бронирования должен быть выбран один бренд
- если все указанные выше элементы имеют различный атрибут ```/@BrandID``` или некоторые из указанных элементов не имеют атрибута ```/@BrandID```, то при бронировании должен применяться посегментный выбор бренда

##### Выбор бренда для всего бронирования

Код бренда для всего бронирования нужно указать в элементе ```/EnhancedAirBookRQ/OTA_AirPriceRQ/PriceRequestInformation/OptionalQualifiers/PricingQualifiers/Brand```.

{{< hint warning >}}
Выбранный бренд рекомендуется сохранить в бронировании в качестве ремарки для последующего использования при перерасчете стоимости в бронировании.
{{< /hint >}}

##### Посегментный выбор брендов

{{< hint warning >}}
Обратите внимание на то, что многие перевозчики имеют жесткие требования относительно комбинации различных брендов. Не рекомендуется комбинировать их самостоятельно! Результаты поиска Bargain Finder Max будут содержать только те комбинации брендов, которые разрешены перевозчиком.
{{< /hint >}}

Для посегментного выбора бренда в случае получения расчетов по всем брендам в результатах поиска (сервис BargainFinderMaxRQ) или при проверке стоимости и наличия мест (сервис RevalidateItinRQ) необходимо определить соответствие между элементами ```/OTA_AirLowFareSearchRS/PricedItineraries/PricedItinerary/AirItineraryPricingInfo/PTC_FareBreakdowns/PTC_FareBreakdown/PassengerFare/TPA_Extensions/FareComponents/FareComponent``` (для самой дешевой комбинации брендов) или ```/OTA_AirLowFareSearchRS/PricedItineraries/PricedItinerary/TPA_Extensions/AdditionalFares/AirItineraryPricingInfo/PTC_FareBreakdowns/PTC_FareBreakdown/PassengerFare/TPA_Extensions/FareComponents/FareComponent``` (для дополнительных вариантов) и сегментами. Для этого каждый элемент ```/FareComponent``` содержит дочерние элементы ```/Segment```, каждый из которых соответствует одному сегменту в маршруте перелета. Для установления точного соответствия между элементом ```/Segment``` и сегментами в путешествии используются атрибуты:
- ```/Segment/@LegIndex``` — номер плеча
- ```/Segment/@FlightIndex``` — номер сегмента в плече


После получения соответствия между брендами и сегментами необходимо в запросе указать:
- последовательности сегментов, имеющих одинаковый бренд или не имеющих бренда в элементах ```/EnhancedAirBookRQ/OTA_AirPriceRQ/PriceRequestInformation/OptionalQualifiers/PricingQualifiers/ItineraryOptions/SegmentSelect``` со следующими атрибутами:
    - ```/@Number``` — номер сегмента начала последовательности
    - ```/@EndNumber``` — номер сегмента конца последовательности (опционально)
    - ```/@RPH``` — порядковый номер последовательности
- коды брендов в последовательно расположенных элементах ```/EnhancedAirBookRQ/OTA_AirPriceRQ/PriceRequestInformation/OptionalQualifiers/PricingQualifiers/Brand```, где в качестве значения атрибута ```/@RPH``` должен быть номер последовательности из предыдущего пункта. Обратите внимание на то, что если для каких-то сегментов код бренда не должен быть использован, то в качестве значения элемента ```/Brand``` для этой последовательности должна быть пустая строка

{{< hint warning >}}
Выбранные бренды рекомендуется сохранить в бронировании в качестве ремарок для последующего использования при перерасчете стоимости в бронировании.
{{< /hint >}}

Пример:

| Номер сегмента | Код бренда |
| - | -- |
| 1 | AA |
| 2 | AA |
| 3 | -  |
| 4 | -  |
| 5 | BB |

{{< details title="Пример" open=true >}}
```XML
<PricingQualifiers>
  <Brand RPH="1">AA</Brand>
  <Brand RPH="2"/>
  <Brand RPH="3">BB</Brand>
  <ItineraryOptions>
    <SegmentSelect Number="1" EndNumber="2" RPH="1"/>
    <SegmentSelect Number="3" EndNumber="4" RPH="2"/>
    <SegmentSelect Number="5" RPH="3"/>
  </ItineraryOptions>
</PricingQualifiers>
```
{{< /details >}}

#### Расчет стоимости по приватным тарифам

По умолчанию сервис производит расчет по самому дешевому доступному тарифу, доступному для выбранных сегментов вне зависимости от его типа: приватный или публичный.

Однако в запросе можно специально указывать чтобы расчет производился только по публичным или только по приватным тарифам:
- по публичным тарифам — значение ```true``` у атрибута ```/EnhancedAirBookRQ/OTA_AirPriceRQ/PriceRequestInformation/OptionalQualifiers/PricingQualifiers/FareOptions/@Public```
- по приватным тарифам — значение ```true``` у атрибута ```/EnhancedAirBookRQ/OTA_AirPriceRQ/PriceRequestInformation/OptionalQualifiers/PricingQualifiers/FareOptions/@Private```

Некоторые приватные тарифы требуют ввод специальных кодов для использования их при расчете стоимости:
- список кодов корпоративных скидок (Corporate ID) задается в последовательно расположенных элементах ```/EnhancedAirBookRQ/OTA_AirPriceRQ/PriceRequestInformation/OptionalQualifiers/PricingQualifiers/Corporate/ID```
- список аккаунт кодов (Account Code) задается в последовательно расположенных элементах ```/EnhancedAirBookRQ/OTA_AirPriceRQ/PriceRequestInformation/OptionalQualifiers/PricingQualifiers/Account/Code```

#### Расчет стоимости по кодам тарифов

{{< hint danger >}}
Обратите внимание на то, что расчет стоимости по кодам тарифов рекомендуется только при бронировании тех рекомендаций, которые были получены в результате поиска перелетов с тарифами с багажом (атрибут ```/OTA_AirLowFareSearchRQ/TravelPreferences/Baggage/@FreePieceRequired```) и не являются брендированными. В противном случае, рекомендуется использовать стандартный способ расчета стоимости перелетов — с указанием [брендов](create-booking-2steps.html#расчет-стоимости-по-брендированным-тарифам).
{{< /hint >}}

{{< hint danger >}}
Для успешного оформления билетов, в бронированиях, в которых был выполнен расчет стоимости по кодам тарифов, требуется включение настройки [Ticket from Stored Fare](tjr-settings.html#ticket-from-stored-fare-оформление-билетов-по-сохраненным-pq-без-перерасчета) в PCC, в котором создается бронирование и оформляются билеты.
{{< /hint >}}

Расчет стоимости по кодам тарифов может приводить к невозможности оформить билет в случае изменения кодов тарифов перевозчика, а также в случае невозможности забронировать выбранный класс бронирования.

##### Выбор кода тарифа для всего бронирования

Код тарифа для всего бронирования нужно указать в элементе ```/EnhancedAirBookRQ/OTA_AirPriceRQ/PriceRequestInformation/OptionalQualifiers/PricingQualifiers/SpecificFare/FareBasis```.

##### Посегментный выбор кодов тарифов

Посегментный выбор кодов тарифов требуется в тех случаях, когда расчет стоимости бронирования должен быть выполнен по разным тарифам для разных сегментов. Для посегментного выбора кодов тарифов в запросе необходимо указать:
- последовательности сегментов, имеющих одинаковый код тарифа, в элементах ```/EnhancedAirBookRQ/OTA_AirPriceRQ/PriceRequestInformation/OptionalQualifiers/PricingQualifiers/ItineraryOptions/SegmentSelect``` со следующими атрибутами:
    - ```/@Number``` — номер сегмента начала последовательности
    - ```/@EndNumber``` — номер сегмента конца последовательности (опционально)
    - ```/@RPH``` — порядковый номер последовательности
- тарифы в последовательно расположенных элементах ```/EnhancedAirBookRQ/OTA_AirPriceRQ/PriceRequestInformation/OptionalQualifiers/PricingQualifiers/SpecificFare``` со следующими дочерними элементами и атрибутами:
    - ```/@RPH``` — номер последовательности из предыдущего пункта
    - ```/FareBasis``` — код тарифа

#### Получение условий обменов и возвратов

Для получения в ответе на запрос условий обменов и возвратов требуется указать значение ```true``` у атрибута ```/EnhancedAirBookRQ/OTA_AirPriceRQ/PriceRequestInformation/OptionalQualifiers/PricingQualifiers/SpecificPenalty/@AdditionalInfo```.

#### Выбор форм оплаты

Подробнее о выборе форм оплаты в Sabre см. в [Выбор форм оплаты](fop.html).

В Sabre при выполнении расчета стоимости бронирования можно указать одну или несколько форм оплаты. Возможные варианты форм оплаты:

##### Наличный или безналичный расчет

При использовании наличного или безналичного расчета код формы оплаты необходимо указать в качестве значения атрибута ```/EnhancedAirBookRQ/OTA_AirPriceRQ/PriceRequestInformation/OptionalQualifiers/FOP_Qualifiers/BasicFOP/@Type```.

Коды форм оплаты:
- ```CA``` — наличный расчет
- ```CK``` — безналичный расчет

##### Банковская карта

При использовании банковской карты в качестве формы оплаты необходимо добавить элемент ```/EnhancedAirBookRQ/OTA_AirPriceRQ/PriceRequestInformation/OptionalQualifiers/FOP_Qualifiers/BasicFOP/CC_Info/PaymentCard``` в запрос и указать следующие атрибуты:
- ```/@Code``` — код платежной системы
- ```/@ExpireDate``` — год и месяц срока истечения действия карты (формат ```YYYY-MM```)
- ```/@ManualApprovalCode``` — код авторизации платежа (в случае наличия)
- ```/@Number``` — номер карты

Список кодов основных платежных систем:
- ```VI``` — Visa
- ```CA``` — Master Card
- ```AX``` — American Express

##### Двойная форма оплаты (наличный или безналичный расчет и кредитная карта)

{{< hint warning >}}
Обратите внимание на то, что двойная форма оплаты возможна только для билетов!
{{< /hint >}}

Для использования двух форм оплаты необходимо добавить информацию о каждой в элементы ```/EnhancedAirBookRQ/OTA_AirPriceRQ/PriceRequestInformation/OptionalQualifiers/FOP_Qualifiers/BSP_Ticketing/MultipleFOP/FOP_One``` и ```/EnhancedAirBookRQ/OTA_AirPriceRQ/PriceRequestInformation/OptionalQualifiers/FOP_Qualifiers/BSP_Ticketing/MultipleFOP/FOP_Two``` соответственно. У данных элементов необходимо указать код формы оплаты в атрибуте ```/@Type```, если используется форма оплаты наличный или безналичный расчет (```CA``` или ```CK```).

В качестве значения атрибута ```/EnhancedAirBookRQ/OTA_AirPriceRQ/PriceRequestInformation/OptionalQualifiers/FOP_Qualifiers/BSP_Ticketing/MultipleFOP/Fare/@Amount``` должна быть указана сумма, которая будет списана со второй формы оплаты. Обратите внимание на то, что эта сумма не может превышать величину тарифа для билета.

При использовании двойной формы оплаты оформление билета может производиться только для одного PQ.

#### Сравнение с заданной стоимостью

Сервис позволяет сравнивать полученную при расчете стоимость с заданной в запросе (например, полученной в результатах поиска). Стоимость должна быть указана в качестве значения атрибута ```/EnhancedAirBookRQ/OTA_AirPriceRQ/PriceComparison/@AmountSpecified```.

Дополнительно можно указать необходимость остановки выполнения запроса в случае превышения заданной стоимости. Для этого необходимо указать значение ```true``` у атрибута ```/EnhancedAirBookRQ/OTA_AirPriceRQ/PriceComparison/AcceptablePriceIncrease/@HaltOnNonAcceptablePrice```.

В элементах ```/EnhancedAirBookRQ/OTA_AirPriceRQ/PriceComparison/AcceptablePriceIncrease/Amount``` и ```/EnhancedAirBookRQ/OTA_AirPriceRQ/PriceComparison/AcceptablePriceIncrease/Percent``` можно указать абсолютную величину или процент, которые будут являться допустимым уровнем превышения заданной цены.

{{< details title="Пример (работа сервиса будет прервана, если стоимость бронирования превышает 10500 рублей)" open=true >}}
```XML
<PriceComparison AmountSpecified="10000">
  <AcceptablePriceIncrease HaltOnNonAcceptablePrice="true">
    <Amount>500</Amount>
  </AcceptablePriceIncrease>
</PriceComparison>
```
{{< /details >}}

### Завершающая обработка бронирования

#### Чтение бронирования

Сервис позволяет прочитать полученное бронирование после успешного завершения работы всех предыдущих операций и вернуть его содержимое в ответе. Для этого необходимо добавить элемент ```/EnhancedAirBookRQ/PostProcessing/RedisplayReservation```. Дополнительно можно установить задержку перед чтением бронирования в качестве значения атрибута ```/EnhancedAirBookRQ/PostProcessing/RedisplayReservation/@WaitInterval``` (в миллисекундах).

#### Игнорирование бронирования

В некоторых случаях может пригодиться возможность игнорирования бронирования после успешного выполнения всех предыдущих операций, например, если запрос был выполнен для актуализации стоимости перелета. Для этого необходимо указать значение ```true``` у атрибута ```/EnhancedAirBookRQ/PostProcessing/@IgnoreAfter```. При создании бронирования не требуется указывать этот атрибут.

### Пример

{{< details title="Пример запроса" >}}
```XML
<EnhancedAirBookRQ HaltOnError="true" IgnoreOnError="true" haltOnInvalidMCT="true" version="3.10.0" xmlns="http://services.sabre.com/sp/eab/v3_10">
  <OTA_AirBookRQ>
    <RetryRebook Option="true"/>
    <HaltOnStatus Code="HL"/>
    <HaltOnStatus Code="HN"/>
    <HaltOnStatus Code="HX"/>
    <HaltOnStatus Code="LL"/>
    <HaltOnStatus Code="NN"/>
    <HaltOnStatus Code="NO"/>
    <HaltOnStatus Code="PN"/>
    <HaltOnStatus Code="UC"/>
    <HaltOnStatus Code="UN"/>
    <HaltOnStatus Code="US"/>
    <HaltOnStatus Code="UU"/>
    <OriginDestinationInformation>
      <FlightSegment DepartureDateTime="2022-12-01T00:00:00" FlightNumber="2463" NumberInParty="3" ResBookDesigCode="Y" Status="NN">
        <DestinationLocation LocationCode="AUH"/>
        <MarketingAirline Code="EY" FlightNumber="2463"/>
        <MarriageGrp>O</MarriageGrp>
        <OriginLocation LocationCode="SYD"/>
      </FlightSegment>
      <FlightSegment DepartureDateTime="2022-12-02T00:00:00" FlightNumber="25" NumberInParty="3" ResBookDesigCode="Y" Status="NN">
        <DestinationLocation LocationCode="LHR"/>
        <MarketingAirline Code="EY" FlightNumber="25"/>
        <MarriageGrp>I</MarriageGrp>
        <OriginLocation LocationCode="AUH"/>
      </FlightSegment>
      <FlightSegment DepartureDateTime="2022-12-08T00:00:00" FlightNumber="12" NumberInParty="3" ResBookDesigCode="Y" Status="NN">
        <DestinationLocation LocationCode="AUH"/>
        <MarketingAirline Code="EY" FlightNumber="12"/>
        <MarriageGrp>I</MarriageGrp>
        <OriginLocation LocationCode="LHR"/>
      </FlightSegment>
      <FlightSegment DepartureDateTime="2022-12-08T00:00:00" FlightNumber="464" NumberInParty="3" ResBookDesigCode="Y" Status="NN">
        <DestinationLocation LocationCode="SYD"/>
        <MarketingAirline Code="EY" FlightNumber="464"/>
        <MarriageGrp>I</MarriageGrp>
        <OriginLocation LocationCode="AUH"/>
      </FlightSegment>
    </OriginDestinationInformation>
    <RedisplayReservation NumAttempts="10" WaitInterval="500"/>
  </OTA_AirBookRQ>
  <OTA_AirPriceRQ>
    <PriceComparison AmountSpecified="575387"/>
    <PriceRequestInformation Retain="true">
      <OptionalQualifiers>
        <FlightQualifiers>
          <VendorPrefs>
            <Airline Code="EY"/>
          </VendorPrefs>
        </FlightQualifiers>
        <PricingQualifiers>
          <Brand>YF</Brand>
          <PassengerType Code="ADT" Quantity="2"/>
          <PassengerType Code="CNN" Quantity="1"/>
          <PassengerType Code="INF" Quantity="1"/>
          <SpecificPenalty AdditionalInfo="true"/>
        </PricingQualifiers>
      </OptionalQualifiers>
    </PriceRequestInformation>
  </OTA_AirPriceRQ>
  <PostProcessing IgnoreAfter="false">
    <RedisplayReservation/>
  </PostProcessing>
  <PreProcessing IgnoreBefore="true"/>
</EnhancedAirBookRQ>
```
{{< /details >}}

{{< details title="Пример ответа" >}}
```XML
<EnhancedAirBookRS xmlns="http://services.sabre.com/sp/eab/v3_10">
  <ApplicationResults status="Complete" xmlns="http://services.sabre.com/STL_Payload/v02_01" xmlns:ns10="http://services.sabre.com/essm/session/v1" xmlns:ns11="http://services.sabre.com/STL_Header/v02_01" xmlns:ns12="http://webservices.sabre.com/servicesplatform/eiapi/1.0.0" xmlns:ns13="http://www.OpenTravel.org/ns/OTA2/AppInfo_v01_00" xmlns:ns14="http://services.sabre.com/sp/preferences/v1" xmlns:ns15="http://services.sabre.com/STL/v01" xmlns:ns16="http://services.sabre.com/ssse/trace/v01" xmlns:ns2="http://services.sabre.com/essm/diagnostic/v1" xmlns:ns3="http://services.sabre.com/essm/core/v1" xmlns:ns4="http://opentravel.org/common/message/v02" xmlns:ns5="http://opentravel.org/common/v02" xmlns:ns6="http://services.sabre.com/STL_Payload/v02_02" xmlns:ns7="http://services.sabre.com/sp/ssp/v1" xmlns:ns8="http://services.sabre.com/STL_Header/v02_02" xmlns:ns9="http://services.sabre.com/STL_Header/v120">
    <Success timeStamp="2022-05-20T04:56:31.973-05:00"/>
  </ApplicationResults>
  <OTA_AirBookRS>
    <OriginDestinationOption>
      <FlightSegment ArrivalDateTime="12-02T06:40" DepartureDateTime="12-01T23:25" FlightNumber="2463" NumberInParty="003" ResBookDesigCode="Y" Status="NN" eTicket="true">
        <DestinationLocation LocationCode="AUH"/>
        <MarketingAirline Code="EY" FlightNumber="2463"/>
        <OriginLocation LocationCode="SYD"/>
      </FlightSegment>
      <FlightSegment ArrivalDateTime="12-02T14:10" DepartureDateTime="12-02T10:35" FlightNumber="0025" NumberInParty="003" ResBookDesigCode="Y" Status="NN" eTicket="true">
        <DestinationLocation LocationCode="LHR"/>
        <MarketingAirline Code="EY" FlightNumber="0025"/>
        <OriginLocation LocationCode="AUH"/>
      </FlightSegment>
      <FlightSegment ArrivalDateTime="12-08T19:20" DepartureDateTime="12-08T08:30" FlightNumber="0012" NumberInParty="003" ResBookDesigCode="Y" Status="NN" eTicket="true">
        <DestinationLocation LocationCode="AUH"/>
        <MarketingAirline Code="EY" FlightNumber="0012"/>
        <OriginLocation LocationCode="LHR"/>
      </FlightSegment>
      <FlightSegment ArrivalDateTime="12-09T17:55" DepartureDateTime="12-08T22:10" FlightNumber="0464" NumberInParty="003" ResBookDesigCode="Y" Status="NN" eTicket="true">
        <DestinationLocation LocationCode="SYD"/>
        <MarketingAirline Code="EY" FlightNumber="0464"/>
        <OriginLocation LocationCode="AUH"/>
      </FlightSegment>
    </OriginDestinationOption>
  </OTA_AirBookRS>
  <OTA_AirPriceRS>
    <PriceComparison AmountReturned="575387" AmountSpecified="575387"/>
    <PriceQuote>
      <MiscInformation>
        <BaggageInfo>
          <SubCodeProperties RPH="1" SolutionSequenceNmbr="1">
            <AncillaryFeeGroupCode>BG</AncillaryFeeGroupCode>
            <CommercialNameofBaggageItemType>FREE BAGGAGE ALLOWANCE</CommercialNameofBaggageItemType>
            <EMD_Type>4</EMD_Type>
            <ExtendedSubCodeKey>0DFAAEY</ExtendedSubCodeKey>
          </SubCodeProperties>
          <SubCodeProperties RPH="2" SolutionSequenceNmbr="1">
            <AncillaryFeeGroupCode>BG</AncillaryFeeGroupCode>
            <AncillaryService SubGroupCode="CY">
              <Text>CARRY ON HAND BAGGAGE</Text>
            </AncillaryService>
            <CommercialNameofBaggageItemType>CARRYON HAND BAGGAGE ALLOWANCE</CommercialNameofBaggageItemType>
            <EMD_Type>4</EMD_Type>
            <ExtendedSubCodeKey>0LNABEY</ExtendedSubCodeKey>
            <RFIC>C</RFIC>
          </SubCodeProperties>
        </BaggageInfo>
        <HeaderInformation SolutionSequenceNmbr="1">
          <DepartureDate>2022-12-01</DepartureDate>
          <Text>VALIDATING CARRIER SPECIFIED</Text>
          <Text>BSP - EY</Text>
          <Text>TCH - EY</Text>
          <Text>CHG BEF DEP UP TO RUB13500/CHG AFT DEP UP TO RUB13500/REF BEF</Text>
          <Text>DEP UP TO RUB0/REF AFT DEP UP TO RUB0/SEE RULES</Text>
          <Text>BAG ALLOWANCE     -SYDLHR-35KG/EY</Text>
          <Text>BAG ALLOWANCE     -LHRSYD-35KG/EY</Text>
          <Text>CARRY ON ALLOWANCE</Text>
          <Text>SYDAUH AUHLHR LHRAUH AUHSYD-01P/07KG/EY</Text>
          <Text>CARRY ON CHARGES</Text>
          <Text>SYDAUH AUHLHR LHRAUH AUHSYD-EY-CARRY ON FEES UNKNOWN-CONTACT CA</Text>
          <Text>RRIER</Text>
          <Text>ADDITIONAL ALLOWANCES AND/OR DISCOUNTS MAY APPLY DEPENDING ON</Text>
          <Text>FLYER-SPECIFIC FACTORS /E.G. FREQUENT FLYER STATUS/MILITARY/</Text>
          <Text>CREDIT CARD FORM OF PAYMENT/EARLY PURCHASE OVER INTERNET,ETC./</Text>
          <Text>VALIDATING CARRIER SPECIFIED</Text>
          <Text>BSP - EY</Text>
          <Text>TCH - EY</Text>
          <Text>CHG BEF DEP UP TO RUB13500/CHG AFT DEP UP TO RUB13500/REF BEF</Text>
          <Text>DEP UP TO RUB0/REF AFT DEP UP TO RUB0/SEE RULES</Text>
          <Text>BAG ALLOWANCE     -SYDLHR-35KG/EY</Text>
          <Text>BAG ALLOWANCE     -LHRSYD-35KG/EY</Text>
          <Text>CARRY ON ALLOWANCE</Text>
          <Text>SYDAUH AUHLHR LHRAUH AUHSYD-01P/07KG/EY</Text>
          <Text>CARRY ON CHARGES</Text>
          <Text>SYDAUH AUHLHR LHRAUH AUHSYD-EY-CARRY ON FEES UNKNOWN-CONTACT CA</Text>
          <Text>RRIER</Text>
          <Text>ADDITIONAL ALLOWANCES AND/OR DISCOUNTS MAY APPLY DEPENDING ON</Text>
          <Text>FLYER-SPECIFIC FACTORS /E.G. FREQUENT FLYER STATUS/MILITARY/</Text>
          <Text>CREDIT CARD FORM OF PAYMENT/EARLY PURCHASE OVER INTERNET,ETC./</Text>
          <Text>REQUIRES ACCOMPANYING ADT PASSENGER</Text>
          <Text>EACH INF REQUIRES ACCOMPANYING ADT PASSENGER</Text>
          <Text>VALIDATING CARRIER SPECIFIED</Text>
          <Text>BSP - EY</Text>
          <Text>TCH - EY</Text>
          <Text>CHG BEF DEP UP TO RUB13500/CHG AFT DEP UP TO RUB13500/REF BEF</Text>
          <Text>DEP UP TO RUB0/REF AFT DEP UP TO RUB0/SEE RULES</Text>
          <Text>BAG ALLOWANCE     -SYDLHR-10KG/EY</Text>
          <Text>BAG ALLOWANCE     -LHRSYD-10KG/EY</Text>
          <Text>CARRY ON ALLOWANCE</Text>
          <Text>SYDAUH AUHLHR LHRAUH AUHSYD-01P/05KG/EY</Text>
          <Text>CARRY ON CHARGES</Text>
          <Text>SYDAUH AUHLHR LHRAUH AUHSYD-EY-CARRY ON FEES UNKNOWN-CONTACT CA</Text>
          <Text>RRIER</Text>
          <Text>ADDITIONAL ALLOWANCES AND/OR DISCOUNTS MAY APPLY DEPENDING ON</Text>
          <Text>FLYER-SPECIFIC FACTORS /E.G. FREQUENT FLYER STATUS/MILITARY/</Text>
          <Text>CREDIT CARD FORM OF PAYMENT/EARLY PURCHASE OVER INTERNET,ETC./</Text>
          <ValidatingCarrier Code="EY"/>
        </HeaderInformation>
        <SolutionInformation SolutionSequenceNmbr="1">
          <BaseFareCurrencyCode>AUD</BaseFareCurrencyCode>
          <CurrencyCode>RUB</CurrencyCode>
          <GrandTotalBaseFareAmount>526185</GrandTotalBaseFareAmount>
          <GrandTotalEquivFareAmount>11693.00</GrandTotalEquivFareAmount>
          <GrandTotalTaxes>49202</GrandTotalTaxes>
          <RequiresRebook>false</RequiresRebook>
          <TicketNumber>0</TicketNumber>
          <TotalAmount>575387</TotalAmount>
        </SolutionInformation>
        <ValidatingCarrier NewValidatingProcess="true" SolutionSequenceNmbr="1">
          <SettlementMethod>BSP</SettlementMethod>
          <Ticket CarrierCode="EY" Type="ETKTREQ" ValidatingCarrierType="Default"/>
        </ValidatingCarrier>
        <ValidatingCarrier NewValidatingProcess="true" SolutionSequenceNmbr="1">
          <SettlementMethod>TCH</SettlementMethod>
          <Ticket CarrierCode="EY" Type="ETKTPREF" ValidatingCarrierType="Default"/>
        </ValidatingCarrier>
      </MiscInformation>
      <PricedItinerary AlternativePricing="false" CurrencyCode="RUB" MultiTicket="false" TotalAmount="575387">
        <AirItineraryPricingInfo SolutionSequenceNmbr="1">
          <BaggageProvisions RPH="1">
            <Associations>
              <CarrierCode RPH="1">EY</CarrierCode>
              <CarrierCode RPH="2">EY</CarrierCode>
              <CountForSegmentAssociatedID>2</CountForSegmentAssociatedID>
              <DepartureDate RPH="1">2022-12-01</DepartureDate>
              <DepartureDate RPH="2">2022-12-02</DepartureDate>
              <DestinationLocation LocationCode="AUH" RPH="1"/>
              <DestinationLocation LocationCode="LHR" RPH="2"/>
              <FlightNumber RPH="1">2463</FlightNumber>
              <FlightNumber RPH="2">25</FlightNumber>
              <OriginLocation LocationCode="SYD" RPH="1"/>
              <OriginLocation LocationCode="AUH" RPH="2"/>
              <PNR_Segment RPH="1">2</PNR_Segment>
              <PNR_Segment RPH="2">3</PNR_Segment>
              <ResBookDesigCode RPH="1">Y</ResBookDesigCode>
              <ResBookDesigCode RPH="2">Y</ResBookDesigCode>
              <StatusCode RPH="1">SS</StatusCode>
              <StatusCode RPH="2">SS</StatusCode>
            </Associations>
            <CarrierWhoseBaggageProvisionsApply>EY</CarrierWhoseBaggageProvisionsApply>
            <ProvisionType>A</ProvisionType>
            <SubCodeInfo>
              <SubCodeForChargesOthers>0DFAAEY</SubCodeForChargesOthers>
            </SubCodeInfo>
            <WeightLimit Units="K">35</WeightLimit>
          </BaggageProvisions>
          <BaggageProvisions RPH="2">
            <Associations>
              <CarrierCode RPH="1">EY</CarrierCode>
              <CarrierCode RPH="2">EY</CarrierCode>
              <CountForSegmentAssociatedID>2</CountForSegmentAssociatedID>
              <DepartureDate RPH="1">2022-12-08</DepartureDate>
              <DepartureDate RPH="2">2022-12-08</DepartureDate>
              <DestinationLocation LocationCode="AUH" RPH="1"/>
              <DestinationLocation LocationCode="SYD" RPH="2"/>
              <FlightNumber RPH="1">12</FlightNumber>
              <FlightNumber RPH="2">464</FlightNumber>
              <OriginLocation LocationCode="LHR" RPH="1"/>
              <OriginLocation LocationCode="AUH" RPH="2"/>
              <PNR_Segment RPH="1">4</PNR_Segment>
              <PNR_Segment RPH="2">5</PNR_Segment>
              <ResBookDesigCode RPH="1">Y</ResBookDesigCode>
              <ResBookDesigCode RPH="2">Y</ResBookDesigCode>
              <StatusCode RPH="1">SS</StatusCode>
              <StatusCode RPH="2">SS</StatusCode>
            </Associations>
            <CarrierWhoseBaggageProvisionsApply>EY</CarrierWhoseBaggageProvisionsApply>
            <ProvisionType>A</ProvisionType>
            <SubCodeInfo>
              <SubCodeForChargesOthers>0DFAAEY</SubCodeForChargesOthers>
            </SubCodeInfo>
            <WeightLimit Units="K">35</WeightLimit>
          </BaggageProvisions>
          <BaggageProvisions RPH="3">
            <Associations>
              <CarrierCode RPH="1">EY</CarrierCode>
              <CarrierCode RPH="2">EY</CarrierCode>
              <CarrierCode RPH="3">EY</CarrierCode>
              <CarrierCode RPH="4">EY</CarrierCode>
              <CountForSegmentAssociatedID>4</CountForSegmentAssociatedID>
              <DepartureDate RPH="1">2022-12-01</DepartureDate>
              <DepartureDate RPH="2">2022-12-02</DepartureDate>
              <DepartureDate RPH="3">2022-12-08</DepartureDate>
              <DepartureDate RPH="4">2022-12-08</DepartureDate>
              <DestinationLocation LocationCode="AUH" RPH="1"/>
              <DestinationLocation LocationCode="LHR" RPH="2"/>
              <DestinationLocation LocationCode="AUH" RPH="3"/>
              <DestinationLocation LocationCode="SYD" RPH="4"/>
              <FlightNumber RPH="1">2463</FlightNumber>
              <FlightNumber RPH="2">25</FlightNumber>
              <FlightNumber RPH="3">12</FlightNumber>
              <FlightNumber RPH="4">464</FlightNumber>
              <OriginLocation LocationCode="SYD" RPH="1"/>
              <OriginLocation LocationCode="AUH" RPH="2"/>
              <OriginLocation LocationCode="LHR" RPH="3"/>
              <OriginLocation LocationCode="AUH" RPH="4"/>
              <PNR_Segment RPH="1">2</PNR_Segment>
              <PNR_Segment RPH="2">3</PNR_Segment>
              <PNR_Segment RPH="3">4</PNR_Segment>
              <PNR_Segment RPH="4">5</PNR_Segment>
              <ResBookDesigCode RPH="1">Y</ResBookDesigCode>
              <ResBookDesigCode RPH="2">Y</ResBookDesigCode>
              <ResBookDesigCode RPH="3">Y</ResBookDesigCode>
              <ResBookDesigCode RPH="4">Y</ResBookDesigCode>
              <StatusCode RPH="1">SS</StatusCode>
              <StatusCode RPH="2">SS</StatusCode>
              <StatusCode RPH="3">SS</StatusCode>
              <StatusCode RPH="4">SS</StatusCode>
            </Associations>
            <CarrierWhoseBaggageProvisionsApply>EY</CarrierWhoseBaggageProvisionsApply>
            <NumPiecesBDI>1</NumPiecesBDI>
            <ProvisionType>B</ProvisionType>
            <SubCodeInfo>
              <SubCodeForChargesOthers>0LNABEY</SubCodeForChargesOthers>
            </SubCodeInfo>
            <WeightLimit Units="K">7</WeightLimit>
          </BaggageProvisions>
          <FareCalculation>
            <Text>SYD EY X/AUH EY LON Q25.00 1531.08EY X/AUH Q25.00EY SYD1504.72NUC3085.80END ROE1.328146</Text>
          </FareCalculation>
          <FareCalculationBreakdown>
            <Departure AirlineCode="EY" AirportCode="SYD" ArrivalAirportCode="AUH" ArrivalCityCode="AUH" CityCode="SYD" GenericInd="X"/>
            <FareBasis Cabin="Y" Code="YLWF2AU" FilingCarrier="EY"/>
            <FreeBaggageAllowance>KG035</FreeBaggageAllowance>
          </FareCalculationBreakdown>
          <FareCalculationBreakdown>
            <Branch FirstJointCarrier="EY" PCC="9LSC"/>
            <Departure AirlineCode="EY" AirportCode="AUH" ArrivalAirportCode="LHR" ArrivalCityCode="LON" CityCode="AUH" GenericInd="O"/>
            <FareBasis Cabin="Y" Code="YLWF2AU" FareAmount="1531.08" FarePassengerType="ADT" FareType="P" FilingCarrier="EY" GlobalInd="EH" Market="SYDLON" TripTypeInd="R"/>
            <FreeBaggageAllowance>KG035</FreeBaggageAllowance>
            <RuleCategoryIndicator>2</RuleCategoryIndicator>
            <RuleCategoryIndicator>3</RuleCategoryIndicator>
            <RuleCategoryIndicator>4</RuleCategoryIndicator>
            <RuleCategoryIndicator>5</RuleCategoryIndicator>
            <RuleCategoryIndicator>7</RuleCategoryIndicator>
            <RuleCategoryIndicator>8</RuleCategoryIndicator>
            <RuleCategoryIndicator>9</RuleCategoryIndicator>
            <RuleCategoryIndicator>10</RuleCategoryIndicator>
            <RuleCategoryIndicator>12</RuleCategoryIndicator>
            <RuleCategoryIndicator>15</RuleCategoryIndicator>
            <RuleCategoryIndicator>16</RuleCategoryIndicator>
            <RuleCategoryIndicator>18</RuleCategoryIndicator>
            <RuleCategoryIndicator>23</RuleCategoryIndicator>
            <Surcharges Ind="Q" Type="UNK">25.00</Surcharges>
          </FareCalculationBreakdown>
          <FareCalculationBreakdown>
            <Departure AirlineCode="EY" AirportCode="LHR" ArrivalAirportCode="AUH" ArrivalCityCode="AUH" CityCode="LON" GenericInd="X"/>
            <FareBasis Cabin="Y" Code="YLXF2AU" FilingCarrier="EY"/>
            <FreeBaggageAllowance>KG035</FreeBaggageAllowance>
            <Surcharges Ind="Q" Type="UNK">25.00</Surcharges>
          </FareCalculationBreakdown>
          <FareCalculationBreakdown>
            <Branch FirstJointCarrier="EY" PCC="9LSC"/>
            <Departure AirlineCode="EY" AirportCode="AUH" ArrivalAirportCode="SYD" ArrivalCityCode="SYD" CityCode="AUH" GenericInd="O"/>
            <FareBasis Cabin="Y" Code="YLXF2AU" FareAmount="1504.72" FarePassengerType="ADT" FareType="P" FilingCarrier="EY" GlobalInd="EH" Market="SYDLON" TripTypeInd="R"/>
            <FreeBaggageAllowance>KG035</FreeBaggageAllowance>
            <RuleCategoryIndicator>2</RuleCategoryIndicator>
            <RuleCategoryIndicator>3</RuleCategoryIndicator>
            <RuleCategoryIndicator>4</RuleCategoryIndicator>
            <RuleCategoryIndicator>5</RuleCategoryIndicator>
            <RuleCategoryIndicator>7</RuleCategoryIndicator>
            <RuleCategoryIndicator>8</RuleCategoryIndicator>
            <RuleCategoryIndicator>9</RuleCategoryIndicator>
            <RuleCategoryIndicator>10</RuleCategoryIndicator>
            <RuleCategoryIndicator>12</RuleCategoryIndicator>
            <RuleCategoryIndicator>15</RuleCategoryIndicator>
            <RuleCategoryIndicator>16</RuleCategoryIndicator>
            <RuleCategoryIndicator>18</RuleCategoryIndicator>
            <RuleCategoryIndicator>23</RuleCategoryIndicator>
          </FareCalculationBreakdown>
          <ItinTotalFare NonRefundableInd="O">
            <BaggageInfo>
              <NonUS_DOT_Disclosure>
                <Text>BAG ALLOWANCE     -SYDLHR-35KG/EY</Text>
                <Text>BAG ALLOWANCE     -LHRSYD-35KG/EY</Text>
                <Text>CARRY ON ALLOWANCE</Text>
                <Text>SYDAUH AUHLHR LHRAUH AUHSYD-01P/07KG/EY</Text>
                <Text>CARRY ON CHARGES</Text>
                <Text>SYDAUH AUHLHR LHRAUH AUHSYD-EY-CARRY ON FEES UNKNOWN-CONTACT CA</Text>
                <Text>RRIER</Text>
                <Text>ADDITIONAL ALLOWANCES AND/OR DISCOUNTS MAY APPLY DEPENDING ON</Text>
                <Text>FLYER-SPECIFIC FACTORS /E.G. FREQUENT FLYER STATUS/MILITARY/</Text>
                <Text>CREDIT CARD FORM OF PAYMENT/EARLY PURCHASE OVER INTERNET,ETC./</Text>
              </NonUS_DOT_Disclosure>
            </BaggageInfo>
            <BaseFare Amount="4099.00" CurrencyCode="AUD"/>
            <Construction Amount="3085.80" CurrencyCode="NUC" RateOfExchange="1.328146"/>
            <Endorsements>
              <Text>NON ENDO/ REF</Text>
            </Endorsements>
            <EquivFare Amount="184455" CurrencyCode="RUB"/>
            <Taxes TotalAmount="18041">
              <Tax Amount="2700" TaxCode="AU" TaxName="PASSENGER MOVEMENT CHARGE  PMC" TicketingTaxCode="AU"/>
              <Tax Amount="2816" TaxCode="WY" TaxName="PASSENGER SERVICES CHARGE DEPA" TicketingTaxCode="WY"/>
              <Tax Amount="174" TaxCode="ZR2" TaxName="INTERNATIONAL ADVANCED PASSENG" TicketingTaxCode="ZR"/>
              <Tax Amount="1216" TaxCode="F62" TaxName="PASSENGER FACILITIES CHARGE" TicketingTaxCode="F6"/>
              <Tax Amount="6678" TaxCode="GB" TaxName="AIR PASSENGER DUTY APD" TicketingTaxCode="GB"/>
              <Tax Amount="4457" TaxCode="UB" TaxName="PASSENGER SERVICE CHARGE DEPAR" TicketingTaxCode="UB"/>
            </Taxes>
            <TotalFare Amount="202496" CurrencyCode="RUB"/>
            <Warnings>
              <Warning ShortText="MIXED PASSENGER TYPES - VERIFY RESTRICTIONS"/>
            </Warnings>
          </ItinTotalFare>
          <PassengerTypeQuantity Code="ADT" Quantity="2"/>
          <PTC_FareBreakdown>
            <Cabin>Y</Cabin>
            <FareBasis Code="YLWF2AU" FilingCarrier="EY"/>
            <FreeBaggageAllowance>KG035</FreeBaggageAllowance>
          </PTC_FareBreakdown>
          <PTC_FareBreakdown>
            <BrandedFareInformation>
              <BrandCode>YF</BrandCode>
              <BrandName>ECONOMY CHOICE PLUS</BrandName>
              <ProgramCode>CFFEY</ProgramCode>
              <ProgramName>17AUD BP30</ProgramName>
            </BrandedFareInformation>
            <Cabin>Y</Cabin>
            <FareBasis Code="YLWF2AU" FareAmount="1531.08" FarePassengerType="ADT" FareType="P" FilingCarrier="EY" GlobalInd="EH" Market="SYDLON"/>
            <FreeBaggageAllowance>KG035</FreeBaggageAllowance>
            <Surcharges Ind="Q" Type="UNK">25.00</Surcharges>
          </PTC_FareBreakdown>
          <PTC_FareBreakdown>
            <Cabin>Y</Cabin>
            <FareBasis Code="YLXF2AU" FilingCarrier="EY"/>
            <FreeBaggageAllowance>KG035</FreeBaggageAllowance>
            <Surcharges Ind="Q" Type="UNK">25.00</Surcharges>
          </PTC_FareBreakdown>
          <PTC_FareBreakdown>
            <BrandedFareInformation>
              <BrandCode>YF</BrandCode>
              <BrandName>ECONOMY CHOICE PLUS</BrandName>
              <ProgramCode>CFFEY</ProgramCode>
              <ProgramName>17AUD BP30</ProgramName>
            </BrandedFareInformation>
            <Cabin>Y</Cabin>
            <FareBasis Code="YLXF2AU" FareAmount="1504.72" FarePassengerType="ADT" FareType="P" FilingCarrier="EY" GlobalInd="EH" Market="SYDLON"/>
            <FreeBaggageAllowance>KG035</FreeBaggageAllowance>
          </PTC_FareBreakdown>
          <SpecificPenalty>
            <PenaltyInformation Amount="13500" Cat16="false" Currency="RUB" NotApplicable="false" Type="CPBD"/>
          </SpecificPenalty>
          <SpecificPenalty>
            <PenaltyInformation Amount="13500" Cat16="false" Currency="RUB" NotApplicable="false" Type="CPAD"/>
          </SpecificPenalty>
          <SpecificPenalty>
            <PenaltyInformation Amount="0" Cat16="false" Currency="RUB" NotApplicable="false" Type="RPBD"/>
          </SpecificPenalty>
          <SpecificPenalty>
            <PenaltyInformation Amount="0" Cat16="false" Currency="RUB" NotApplicable="false" Type="RPAD"/>
          </SpecificPenalty>
        </AirItineraryPricingInfo>
        <AirItineraryPricingInfo SolutionSequenceNmbr="1">
          <BaggageProvisions RPH="1">
            <Associations>
              <CarrierCode RPH="1">EY</CarrierCode>
              <CarrierCode RPH="2">EY</CarrierCode>
              <CountForSegmentAssociatedID>2</CountForSegmentAssociatedID>
              <DepartureDate RPH="1">2022-12-01</DepartureDate>
              <DepartureDate RPH="2">2022-12-02</DepartureDate>
              <DestinationLocation LocationCode="AUH" RPH="1"/>
              <DestinationLocation LocationCode="LHR" RPH="2"/>
              <FlightNumber RPH="1">2463</FlightNumber>
              <FlightNumber RPH="2">25</FlightNumber>
              <OriginLocation LocationCode="SYD" RPH="1"/>
              <OriginLocation LocationCode="AUH" RPH="2"/>
              <PNR_Segment RPH="1">2</PNR_Segment>
              <PNR_Segment RPH="2">3</PNR_Segment>
              <ResBookDesigCode RPH="1">Y</ResBookDesigCode>
              <ResBookDesigCode RPH="2">Y</ResBookDesigCode>
              <StatusCode RPH="1">SS</StatusCode>
              <StatusCode RPH="2">SS</StatusCode>
            </Associations>
            <CarrierWhoseBaggageProvisionsApply>EY</CarrierWhoseBaggageProvisionsApply>
            <ProvisionType>A</ProvisionType>
            <SubCodeInfo>
              <SubCodeForChargesOthers>0DFAAEY</SubCodeForChargesOthers>
            </SubCodeInfo>
            <WeightLimit Units="K">35</WeightLimit>
          </BaggageProvisions>
          <BaggageProvisions RPH="2">
            <Associations>
              <CarrierCode RPH="1">EY</CarrierCode>
              <CarrierCode RPH="2">EY</CarrierCode>
              <CountForSegmentAssociatedID>2</CountForSegmentAssociatedID>
              <DepartureDate RPH="1">2022-12-08</DepartureDate>
              <DepartureDate RPH="2">2022-12-08</DepartureDate>
              <DestinationLocation LocationCode="AUH" RPH="1"/>
              <DestinationLocation LocationCode="SYD" RPH="2"/>
              <FlightNumber RPH="1">12</FlightNumber>
              <FlightNumber RPH="2">464</FlightNumber>
              <OriginLocation LocationCode="LHR" RPH="1"/>
              <OriginLocation LocationCode="AUH" RPH="2"/>
              <PNR_Segment RPH="1">4</PNR_Segment>
              <PNR_Segment RPH="2">5</PNR_Segment>
              <ResBookDesigCode RPH="1">Y</ResBookDesigCode>
              <ResBookDesigCode RPH="2">Y</ResBookDesigCode>
              <StatusCode RPH="1">SS</StatusCode>
              <StatusCode RPH="2">SS</StatusCode>
            </Associations>
            <CarrierWhoseBaggageProvisionsApply>EY</CarrierWhoseBaggageProvisionsApply>
            <ProvisionType>A</ProvisionType>
            <SubCodeInfo>
              <SubCodeForChargesOthers>0DFAAEY</SubCodeForChargesOthers>
            </SubCodeInfo>
            <WeightLimit Units="K">35</WeightLimit>
          </BaggageProvisions>
          <BaggageProvisions RPH="3">
            <Associations>
              <CarrierCode RPH="1">EY</CarrierCode>
              <CarrierCode RPH="2">EY</CarrierCode>
              <CarrierCode RPH="3">EY</CarrierCode>
              <CarrierCode RPH="4">EY</CarrierCode>
              <CountForSegmentAssociatedID>4</CountForSegmentAssociatedID>
              <DepartureDate RPH="1">2022-12-01</DepartureDate>
              <DepartureDate RPH="2">2022-12-02</DepartureDate>
              <DepartureDate RPH="3">2022-12-08</DepartureDate>
              <DepartureDate RPH="4">2022-12-08</DepartureDate>
              <DestinationLocation LocationCode="AUH" RPH="1"/>
              <DestinationLocation LocationCode="LHR" RPH="2"/>
              <DestinationLocation LocationCode="AUH" RPH="3"/>
              <DestinationLocation LocationCode="SYD" RPH="4"/>
              <FlightNumber RPH="1">2463</FlightNumber>
              <FlightNumber RPH="2">25</FlightNumber>
              <FlightNumber RPH="3">12</FlightNumber>
              <FlightNumber RPH="4">464</FlightNumber>
              <OriginLocation LocationCode="SYD" RPH="1"/>
              <OriginLocation LocationCode="AUH" RPH="2"/>
              <OriginLocation LocationCode="LHR" RPH="3"/>
              <OriginLocation LocationCode="AUH" RPH="4"/>
              <PNR_Segment RPH="1">2</PNR_Segment>
              <PNR_Segment RPH="2">3</PNR_Segment>
              <PNR_Segment RPH="3">4</PNR_Segment>
              <PNR_Segment RPH="4">5</PNR_Segment>
              <ResBookDesigCode RPH="1">Y</ResBookDesigCode>
              <ResBookDesigCode RPH="2">Y</ResBookDesigCode>
              <ResBookDesigCode RPH="3">Y</ResBookDesigCode>
              <ResBookDesigCode RPH="4">Y</ResBookDesigCode>
              <StatusCode RPH="1">SS</StatusCode>
              <StatusCode RPH="2">SS</StatusCode>
              <StatusCode RPH="3">SS</StatusCode>
              <StatusCode RPH="4">SS</StatusCode>
            </Associations>
            <CarrierWhoseBaggageProvisionsApply>EY</CarrierWhoseBaggageProvisionsApply>
            <NumPiecesBDI>1</NumPiecesBDI>
            <ProvisionType>B</ProvisionType>
            <SubCodeInfo>
              <SubCodeForChargesOthers>0LNABEY</SubCodeForChargesOthers>
            </SubCodeInfo>
            <WeightLimit Units="K">7</WeightLimit>
          </BaggageProvisions>
          <FareCalculation>
            <Text>SYD EY X/AUH EY LON Q25.00 1148.31EY X/AUH Q25.00EY SYD1128.54NUC2326.85END ROE1.328146</Text>
          </FareCalculation>
          <FareCalculationBreakdown>
            <Departure AirlineCode="EY" AirportCode="SYD" ArrivalAirportCode="AUH" ArrivalCityCode="AUH" CityCode="SYD" GenericInd="X"/>
            <FareBasis Cabin="Y" Code="YLWF2AUCH" FilingCarrier="EY"/>
            <FreeBaggageAllowance>KG035</FreeBaggageAllowance>
          </FareCalculationBreakdown>
          <FareCalculationBreakdown>
            <Branch FirstJointCarrier="EY" PCC="9LSC"/>
            <Departure AirlineCode="EY" AirportCode="AUH" ArrivalAirportCode="LHR" ArrivalCityCode="LON" CityCode="AUH" GenericInd="O"/>
            <FareBasis Cabin="Y" Code="YLWF2AUCH" FareAmount="1148.31" FarePassengerType="CNN" FareType="P" FilingCarrier="EY" GlobalInd="EH" Market="SYDLON" TripTypeInd="R"/>
            <FreeBaggageAllowance>KG035</FreeBaggageAllowance>
            <RuleCategoryIndicator>2</RuleCategoryIndicator>
            <RuleCategoryIndicator>3</RuleCategoryIndicator>
            <RuleCategoryIndicator>4</RuleCategoryIndicator>
            <RuleCategoryIndicator>5</RuleCategoryIndicator>
            <RuleCategoryIndicator>7</RuleCategoryIndicator>
            <RuleCategoryIndicator>8</RuleCategoryIndicator>
            <RuleCategoryIndicator>9</RuleCategoryIndicator>
            <RuleCategoryIndicator>10</RuleCategoryIndicator>
            <RuleCategoryIndicator>12</RuleCategoryIndicator>
            <RuleCategoryIndicator>15</RuleCategoryIndicator>
            <RuleCategoryIndicator>16</RuleCategoryIndicator>
            <RuleCategoryIndicator>18</RuleCategoryIndicator>
            <RuleCategoryIndicator>19</RuleCategoryIndicator>
            <RuleCategoryIndicator>23</RuleCategoryIndicator>
            <Surcharges Ind="Q" Type="UNK">25.00</Surcharges>
          </FareCalculationBreakdown>
          <FareCalculationBreakdown>
            <Departure AirlineCode="EY" AirportCode="LHR" ArrivalAirportCode="AUH" ArrivalCityCode="AUH" CityCode="LON" GenericInd="X"/>
            <FareBasis Cabin="Y" Code="YLXF2AUCH" FilingCarrier="EY"/>
            <FreeBaggageAllowance>KG035</FreeBaggageAllowance>
            <Surcharges Ind="Q" Type="UNK">25.00</Surcharges>
          </FareCalculationBreakdown>
          <FareCalculationBreakdown>
            <Branch FirstJointCarrier="EY" PCC="9LSC"/>
            <Departure AirlineCode="EY" AirportCode="AUH" ArrivalAirportCode="SYD" ArrivalCityCode="SYD" CityCode="AUH" GenericInd="O"/>
            <FareBasis Cabin="Y" Code="YLXF2AUCH" FareAmount="1128.54" FarePassengerType="CNN" FareType="P" FilingCarrier="EY" GlobalInd="EH" Market="SYDLON" TripTypeInd="R"/>
            <FreeBaggageAllowance>KG035</FreeBaggageAllowance>
            <RuleCategoryIndicator>2</RuleCategoryIndicator>
            <RuleCategoryIndicator>3</RuleCategoryIndicator>
            <RuleCategoryIndicator>4</RuleCategoryIndicator>
            <RuleCategoryIndicator>5</RuleCategoryIndicator>
            <RuleCategoryIndicator>7</RuleCategoryIndicator>
            <RuleCategoryIndicator>8</RuleCategoryIndicator>
            <RuleCategoryIndicator>9</RuleCategoryIndicator>
            <RuleCategoryIndicator>10</RuleCategoryIndicator>
            <RuleCategoryIndicator>12</RuleCategoryIndicator>
            <RuleCategoryIndicator>15</RuleCategoryIndicator>
            <RuleCategoryIndicator>16</RuleCategoryIndicator>
            <RuleCategoryIndicator>18</RuleCategoryIndicator>
            <RuleCategoryIndicator>19</RuleCategoryIndicator>
            <RuleCategoryIndicator>23</RuleCategoryIndicator>
          </FareCalculationBreakdown>
          <ItinTotalFare NonRefundableInd="O">
            <BaggageInfo>
              <NonUS_DOT_Disclosure>
                <Text>BAG ALLOWANCE     -SYDLHR-35KG/EY</Text>
                <Text>BAG ALLOWANCE     -LHRSYD-35KG/EY</Text>
                <Text>CARRY ON ALLOWANCE</Text>
                <Text>SYDAUH AUHLHR LHRAUH AUHSYD-01P/07KG/EY</Text>
                <Text>CARRY ON CHARGES</Text>
                <Text>SYDAUH AUHLHR LHRAUH AUHSYD-EY-CARRY ON FEES UNKNOWN-CONTACT CA</Text>
                <Text>RRIER</Text>
                <Text>ADDITIONAL ALLOWANCES AND/OR DISCOUNTS MAY APPLY DEPENDING ON</Text>
                <Text>FLYER-SPECIFIC FACTORS /E.G. FREQUENT FLYER STATUS/MILITARY/</Text>
                <Text>CREDIT CARD FORM OF PAYMENT/EARLY PURCHASE OVER INTERNET,ETC./</Text>
              </NonUS_DOT_Disclosure>
            </BaggageInfo>
            <BaseFare Amount="3091.00" CurrencyCode="AUD"/>
            <Construction Amount="2326.85" CurrencyCode="NUC" RateOfExchange="1.328146"/>
            <Endorsements>
              <Text>NON ENDO/ REF</Text>
            </Endorsements>
            <EquivFare Amount="139095" CurrencyCode="RUB"/>
            <Taxes TotalAmount="8663">
              <Tax Amount="2816" TaxCode="WY" TaxName="PASSENGER SERVICES CHARGE DEPA" TicketingTaxCode="WY"/>
              <Tax Amount="174" TaxCode="ZR2" TaxName="INTERNATIONAL ADVANCED PASSENG" TicketingTaxCode="ZR"/>
              <Tax Amount="1216" TaxCode="F62" TaxName="PASSENGER FACILITIES CHARGE" TicketingTaxCode="F6"/>
              <Tax Amount="4457" TaxCode="UB" TaxName="PASSENGER SERVICE CHARGE DEPAR" TicketingTaxCode="UB"/>
            </Taxes>
            <TotalFare Amount="147758" CurrencyCode="RUB"/>
            <Warnings>
              <Warning ShortText="MIXED PASSENGER TYPES - VERIFY RESTRICTIONS"/>
            </Warnings>
          </ItinTotalFare>
          <PassengerTypeQuantity Code="CNN" Quantity="1"/>
          <PTC_FareBreakdown>
            <Cabin>Y</Cabin>
            <FareBasis Code="YLWF2AUCH" FilingCarrier="EY"/>
            <FreeBaggageAllowance>KG035</FreeBaggageAllowance>
          </PTC_FareBreakdown>
          <PTC_FareBreakdown>
            <BrandedFareInformation>
              <BrandCode>YF</BrandCode>
              <BrandName>ECONOMY CHOICE PLUS</BrandName>
              <ProgramCode>CFFEY</ProgramCode>
              <ProgramName>17AUD BP30</ProgramName>
            </BrandedFareInformation>
            <Cabin>Y</Cabin>
            <FareBasis Code="YLWF2AUCH" FareAmount="1148.31" FarePassengerType="CNN" FareType="P" FilingCarrier="EY" GlobalInd="EH" Market="SYDLON"/>
            <FreeBaggageAllowance>KG035</FreeBaggageAllowance>
            <Surcharges Ind="Q" Type="UNK">25.00</Surcharges>
          </PTC_FareBreakdown>
          <PTC_FareBreakdown>
            <Cabin>Y</Cabin>
            <FareBasis Code="YLXF2AUCH" FilingCarrier="EY"/>
            <FreeBaggageAllowance>KG035</FreeBaggageAllowance>
            <Surcharges Ind="Q" Type="UNK">25.00</Surcharges>
          </PTC_FareBreakdown>
          <PTC_FareBreakdown>
            <BrandedFareInformation>
              <BrandCode>YF</BrandCode>
              <BrandName>ECONOMY CHOICE PLUS</BrandName>
              <ProgramCode>CFFEY</ProgramCode>
              <ProgramName>17AUD BP30</ProgramName>
            </BrandedFareInformation>
            <Cabin>Y</Cabin>
            <FareBasis Code="YLXF2AUCH" FareAmount="1128.54" FarePassengerType="CNN" FareType="P" FilingCarrier="EY" GlobalInd="EH" Market="SYDLON"/>
            <FreeBaggageAllowance>KG035</FreeBaggageAllowance>
          </PTC_FareBreakdown>
          <SpecificPenalty>
            <PenaltyInformation Amount="13500" Cat16="false" Currency="RUB" NotApplicable="false" Type="CPBD"/>
          </SpecificPenalty>
          <SpecificPenalty>
            <PenaltyInformation Amount="13500" Cat16="false" Currency="RUB" NotApplicable="false" Type="CPAD"/>
          </SpecificPenalty>
          <SpecificPenalty>
            <PenaltyInformation Amount="0" Cat16="false" Currency="RUB" NotApplicable="false" Type="RPBD"/>
          </SpecificPenalty>
          <SpecificPenalty>
            <PenaltyInformation Amount="0" Cat16="false" Currency="RUB" NotApplicable="false" Type="RPAD"/>
          </SpecificPenalty>
        </AirItineraryPricingInfo>
        <AirItineraryPricingInfo SolutionSequenceNmbr="1">
          <BaggageProvisions RPH="1">
            <Associations>
              <CarrierCode RPH="1">EY</CarrierCode>
              <CarrierCode RPH="2">EY</CarrierCode>
              <CountForSegmentAssociatedID>2</CountForSegmentAssociatedID>
              <DepartureDate RPH="1">2022-12-01</DepartureDate>
              <DepartureDate RPH="2">2022-12-02</DepartureDate>
              <DestinationLocation LocationCode="AUH" RPH="1"/>
              <DestinationLocation LocationCode="LHR" RPH="2"/>
              <FlightNumber RPH="1">2463</FlightNumber>
              <FlightNumber RPH="2">25</FlightNumber>
              <OriginLocation LocationCode="SYD" RPH="1"/>
              <OriginLocation LocationCode="AUH" RPH="2"/>
              <PNR_Segment RPH="1">2</PNR_Segment>
              <PNR_Segment RPH="2">3</PNR_Segment>
              <ResBookDesigCode RPH="1">Y</ResBookDesigCode>
              <ResBookDesigCode RPH="2">Y</ResBookDesigCode>
              <StatusCode RPH="1">SS</StatusCode>
              <StatusCode RPH="2">SS</StatusCode>
            </Associations>
            <CarrierWhoseBaggageProvisionsApply>EY</CarrierWhoseBaggageProvisionsApply>
            <ProvisionType>A</ProvisionType>
            <SubCodeInfo>
              <SubCodeForChargesOthers>0DFAAEY</SubCodeForChargesOthers>
            </SubCodeInfo>
            <WeightLimit Units="K">10</WeightLimit>
          </BaggageProvisions>
          <BaggageProvisions RPH="2">
            <Associations>
              <CarrierCode RPH="1">EY</CarrierCode>
              <CarrierCode RPH="2">EY</CarrierCode>
              <CountForSegmentAssociatedID>2</CountForSegmentAssociatedID>
              <DepartureDate RPH="1">2022-12-08</DepartureDate>
              <DepartureDate RPH="2">2022-12-08</DepartureDate>
              <DestinationLocation LocationCode="AUH" RPH="1"/>
              <DestinationLocation LocationCode="SYD" RPH="2"/>
              <FlightNumber RPH="1">12</FlightNumber>
              <FlightNumber RPH="2">464</FlightNumber>
              <OriginLocation LocationCode="LHR" RPH="1"/>
              <OriginLocation LocationCode="AUH" RPH="2"/>
              <PNR_Segment RPH="1">4</PNR_Segment>
              <PNR_Segment RPH="2">5</PNR_Segment>
              <ResBookDesigCode RPH="1">Y</ResBookDesigCode>
              <ResBookDesigCode RPH="2">Y</ResBookDesigCode>
              <StatusCode RPH="1">SS</StatusCode>
              <StatusCode RPH="2">SS</StatusCode>
            </Associations>
            <CarrierWhoseBaggageProvisionsApply>EY</CarrierWhoseBaggageProvisionsApply>
            <ProvisionType>A</ProvisionType>
            <SubCodeInfo>
              <SubCodeForChargesOthers>0DFAAEY</SubCodeForChargesOthers>
            </SubCodeInfo>
            <WeightLimit Units="K">10</WeightLimit>
          </BaggageProvisions>
          <BaggageProvisions RPH="3">
            <Associations>
              <CarrierCode RPH="1">EY</CarrierCode>
              <CarrierCode RPH="2">EY</CarrierCode>
              <CarrierCode RPH="3">EY</CarrierCode>
              <CarrierCode RPH="4">EY</CarrierCode>
              <CountForSegmentAssociatedID>4</CountForSegmentAssociatedID>
              <DepartureDate RPH="1">2022-12-01</DepartureDate>
              <DepartureDate RPH="2">2022-12-02</DepartureDate>
              <DepartureDate RPH="3">2022-12-08</DepartureDate>
              <DepartureDate RPH="4">2022-12-08</DepartureDate>
              <DestinationLocation LocationCode="AUH" RPH="1"/>
              <DestinationLocation LocationCode="LHR" RPH="2"/>
              <DestinationLocation LocationCode="AUH" RPH="3"/>
              <DestinationLocation LocationCode="SYD" RPH="4"/>
              <FlightNumber RPH="1">2463</FlightNumber>
              <FlightNumber RPH="2">25</FlightNumber>
              <FlightNumber RPH="3">12</FlightNumber>
              <FlightNumber RPH="4">464</FlightNumber>
              <OriginLocation LocationCode="SYD" RPH="1"/>
              <OriginLocation LocationCode="AUH" RPH="2"/>
              <OriginLocation LocationCode="LHR" RPH="3"/>
              <OriginLocation LocationCode="AUH" RPH="4"/>
              <PNR_Segment RPH="1">2</PNR_Segment>
              <PNR_Segment RPH="2">3</PNR_Segment>
              <PNR_Segment RPH="3">4</PNR_Segment>
              <PNR_Segment RPH="4">5</PNR_Segment>
              <ResBookDesigCode RPH="1">Y</ResBookDesigCode>
              <ResBookDesigCode RPH="2">Y</ResBookDesigCode>
              <ResBookDesigCode RPH="3">Y</ResBookDesigCode>
              <ResBookDesigCode RPH="4">Y</ResBookDesigCode>
              <StatusCode RPH="1">SS</StatusCode>
              <StatusCode RPH="2">SS</StatusCode>
              <StatusCode RPH="3">SS</StatusCode>
              <StatusCode RPH="4">SS</StatusCode>
            </Associations>
            <CarrierWhoseBaggageProvisionsApply>EY</CarrierWhoseBaggageProvisionsApply>
            <NumPiecesBDI>1</NumPiecesBDI>
            <ProvisionType>B</ProvisionType>
            <SubCodeInfo>
              <SubCodeForChargesOthers>0LNABEY</SubCodeForChargesOthers>
            </SubCodeInfo>
            <WeightLimit Units="K">5</WeightLimit>
          </BaggageProvisions>
          <FareCalculation>
            <Text>SYD EY X/AUH EY LON153.10EY X/AUH EY SYD150.47NUC303.57END ROE1.328146</Text>
          </FareCalculation>
          <FareCalculationBreakdown>
            <Departure AirlineCode="EY" AirportCode="SYD" ArrivalAirportCode="AUH" ArrivalCityCode="AUH" CityCode="SYD" GenericInd="X"/>
            <FareBasis Cabin="Y" Code="YLWF2AUIN" FilingCarrier="EY"/>
            <FreeBaggageAllowance>KG010</FreeBaggageAllowance>
          </FareCalculationBreakdown>
          <FareCalculationBreakdown>
            <Branch FirstJointCarrier="EY" PCC="9LSC"/>
            <Departure AirlineCode="EY" AirportCode="AUH" ArrivalAirportCode="LHR" ArrivalCityCode="LON" CityCode="AUH" GenericInd="O"/>
            <FareBasis Cabin="Y" Code="YLWF2AUIN" FareAmount="153.10" FarePassengerType="INF" FareType="P" FilingCarrier="EY" GlobalInd="EH" Market="SYDLON" TripTypeInd="R"/>
            <FreeBaggageAllowance>KG010</FreeBaggageAllowance>
            <RuleCategoryIndicator>2</RuleCategoryIndicator>
            <RuleCategoryIndicator>3</RuleCategoryIndicator>
            <RuleCategoryIndicator>4</RuleCategoryIndicator>
            <RuleCategoryIndicator>5</RuleCategoryIndicator>
            <RuleCategoryIndicator>7</RuleCategoryIndicator>
            <RuleCategoryIndicator>8</RuleCategoryIndicator>
            <RuleCategoryIndicator>9</RuleCategoryIndicator>
            <RuleCategoryIndicator>10</RuleCategoryIndicator>
            <RuleCategoryIndicator>12</RuleCategoryIndicator>
            <RuleCategoryIndicator>15</RuleCategoryIndicator>
            <RuleCategoryIndicator>16</RuleCategoryIndicator>
            <RuleCategoryIndicator>18</RuleCategoryIndicator>
            <RuleCategoryIndicator>19</RuleCategoryIndicator>
            <RuleCategoryIndicator>23</RuleCategoryIndicator>
          </FareCalculationBreakdown>
          <FareCalculationBreakdown>
            <Departure AirlineCode="EY" AirportCode="LHR" ArrivalAirportCode="AUH" ArrivalCityCode="AUH" CityCode="LON" GenericInd="X"/>
            <FareBasis Cabin="Y" Code="YLXF2AUIN" FilingCarrier="EY"/>
            <FreeBaggageAllowance>KG010</FreeBaggageAllowance>
          </FareCalculationBreakdown>
          <FareCalculationBreakdown>
            <Branch FirstJointCarrier="EY" PCC="9LSC"/>
            <Departure AirlineCode="EY" AirportCode="AUH" ArrivalAirportCode="SYD" ArrivalCityCode="SYD" CityCode="AUH" GenericInd="O"/>
            <FareBasis Cabin="Y" Code="YLXF2AUIN" FareAmount="150.47" FarePassengerType="INF" FareType="P" FilingCarrier="EY" GlobalInd="EH" Market="SYDLON" TripTypeInd="R"/>
            <FreeBaggageAllowance>KG010</FreeBaggageAllowance>
            <RuleCategoryIndicator>2</RuleCategoryIndicator>
            <RuleCategoryIndicator>3</RuleCategoryIndicator>
            <RuleCategoryIndicator>4</RuleCategoryIndicator>
            <RuleCategoryIndicator>5</RuleCategoryIndicator>
            <RuleCategoryIndicator>7</RuleCategoryIndicator>
            <RuleCategoryIndicator>8</RuleCategoryIndicator>
            <RuleCategoryIndicator>9</RuleCategoryIndicator>
            <RuleCategoryIndicator>10</RuleCategoryIndicator>
            <RuleCategoryIndicator>12</RuleCategoryIndicator>
            <RuleCategoryIndicator>15</RuleCategoryIndicator>
            <RuleCategoryIndicator>16</RuleCategoryIndicator>
            <RuleCategoryIndicator>18</RuleCategoryIndicator>
            <RuleCategoryIndicator>19</RuleCategoryIndicator>
            <RuleCategoryIndicator>23</RuleCategoryIndicator>
          </FareCalculationBreakdown>
          <ItinTotalFare NonRefundableInd="O">
            <BaggageInfo>
              <NonUS_DOT_Disclosure>
                <Text>BAG ALLOWANCE     -SYDLHR-10KG/EY</Text>
                <Text>BAG ALLOWANCE     -LHRSYD-10KG/EY</Text>
                <Text>CARRY ON ALLOWANCE</Text>
                <Text>SYDAUH AUHLHR LHRAUH AUHSYD-01P/05KG/EY</Text>
                <Text>CARRY ON CHARGES</Text>
                <Text>SYDAUH AUHLHR LHRAUH AUHSYD-EY-CARRY ON FEES UNKNOWN-CONTACT CA</Text>
                <Text>RRIER</Text>
                <Text>ADDITIONAL ALLOWANCES AND/OR DISCOUNTS MAY APPLY DEPENDING ON</Text>
                <Text>FLYER-SPECIFIC FACTORS /E.G. FREQUENT FLYER STATUS/MILITARY/</Text>
                <Text>CREDIT CARD FORM OF PAYMENT/EARLY PURCHASE OVER INTERNET,ETC./</Text>
              </NonUS_DOT_Disclosure>
            </BaggageInfo>
            <BaseFare Amount="404.00" CurrencyCode="AUD"/>
            <Construction Amount="303.57" CurrencyCode="NUC" RateOfExchange="1.328146"/>
            <Endorsements>
              <Text>NON ENDO/ REF</Text>
            </Endorsements>
            <EquivFare Amount="18180" CurrencyCode="RUB"/>
            <Taxes TotalAmount="4457">
              <Tax Amount="4457" TaxCode="UB" TaxName="PASSENGER SERVICE CHARGE DEPAR" TicketingTaxCode="UB"/>
            </Taxes>
            <TotalFare Amount="22637" CurrencyCode="RUB"/>
            <Warnings>
              <Warning ShortText="MIXED PASSENGER TYPES - VERIFY RESTRICTIONS"/>
            </Warnings>
          </ItinTotalFare>
          <PassengerTypeQuantity Code="INF" Quantity="1"/>
          <PTC_FareBreakdown>
            <Cabin>Y</Cabin>
            <FareBasis Code="YLWF2AUIN" FilingCarrier="EY"/>
            <FreeBaggageAllowance>KG010</FreeBaggageAllowance>
          </PTC_FareBreakdown>
          <PTC_FareBreakdown>
            <BrandedFareInformation>
              <BrandCode>YF</BrandCode>
              <BrandName>ECONOMY CHOICE PLUS</BrandName>
              <ProgramCode>CFFEY</ProgramCode>
              <ProgramName>17AUD BP30</ProgramName>
            </BrandedFareInformation>
            <Cabin>Y</Cabin>
            <FareBasis Code="YLWF2AUIN" FareAmount="153.10" FarePassengerType="INF" FareType="P" FilingCarrier="EY" GlobalInd="EH" Market="SYDLON"/>
            <FreeBaggageAllowance>KG010</FreeBaggageAllowance>
          </PTC_FareBreakdown>
          <PTC_FareBreakdown>
            <Cabin>Y</Cabin>
            <FareBasis Code="YLXF2AUIN" FilingCarrier="EY"/>
            <FreeBaggageAllowance>KG010</FreeBaggageAllowance>
          </PTC_FareBreakdown>
          <PTC_FareBreakdown>
            <BrandedFareInformation>
              <BrandCode>YF</BrandCode>
              <BrandName>ECONOMY CHOICE PLUS</BrandName>
              <ProgramCode>CFFEY</ProgramCode>
              <ProgramName>17AUD BP30</ProgramName>
            </BrandedFareInformation>
            <Cabin>Y</Cabin>
            <FareBasis Code="YLXF2AUIN" FareAmount="150.47" FarePassengerType="INF" FareType="P" FilingCarrier="EY" GlobalInd="EH" Market="SYDLON"/>
            <FreeBaggageAllowance>KG010</FreeBaggageAllowance>
          </PTC_FareBreakdown>
          <SpecificPenalty>
            <PenaltyInformation Amount="13500" Cat16="false" Currency="RUB" NotApplicable="false" Type="CPBD"/>
          </SpecificPenalty>
          <SpecificPenalty>
            <PenaltyInformation Amount="13500" Cat16="false" Currency="RUB" NotApplicable="false" Type="CPAD"/>
          </SpecificPenalty>
          <SpecificPenalty>
            <PenaltyInformation Amount="0" Cat16="false" Currency="RUB" NotApplicable="false" Type="RPBD"/>
          </SpecificPenalty>
          <SpecificPenalty>
            <PenaltyInformation Amount="0" Cat16="false" Currency="RUB" NotApplicable="false" Type="RPAD"/>
          </SpecificPenalty>
        </AirItineraryPricingInfo>
      </PricedItinerary>
    </PriceQuote>
  </OTA_AirPriceRS>
  <TravelItineraryReadRS>
    <TravelItinerary>
      <CustomerInfo/>
      <ItineraryInfo>
        <ItineraryPricing>
          <PriceQuote RPH="1">
            <MiscInformation>
              <SignatureLine ExpirationDateTime="00:00" Source="SYS" Status="ACTIVE">
                <Text>9LSC 9LSC*AWT 1256/20MAY22</Text>
              </SignatureLine>
            </MiscInformation>
            <PricedItinerary DisplayOnly="false" InputMessage="WPAEY¥P2ADT/1CNN/1INF¥MP-I¥BRYF¥RQ" RPH="1" StatusCode="A" StoredDateTime="2022-05-20T12:56" TaxExempt="false" ValidatingCarrier="EY">
              <AirItineraryPricingInfo>
                <ItinTotalFare>
                  <BaseFare Amount="4099.00" CurrencyCode="AUD"/>
                  <EquivFare Amount="184455" CurrencyCode="RUB"/>
                  <Taxes>
                    <Tax Amount="18041" TaxCode="XT"/>
                    <TaxBreakdownCode TaxPaid="false">2700AU</TaxBreakdownCode>
                    <TaxBreakdownCode TaxPaid="false">2816WY</TaxBreakdownCode>
                    <TaxBreakdownCode TaxPaid="false">174ZR</TaxBreakdownCode>
                    <TaxBreakdownCode TaxPaid="false">1216F6</TaxBreakdownCode>
                    <TaxBreakdownCode TaxPaid="false">6678GB</TaxBreakdownCode>
                    <TaxBreakdownCode TaxPaid="false">4457UB</TaxBreakdownCode>
                  </Taxes>
                  <TotalFare Amount="202496" CurrencyCode="RUB"/>
                  <Totals>
                    <BaseFare Amount="8198.00"/>
                    <EquivFare Amount="368910"/>
                    <Taxes>
                      <Tax Amount="36082"/>
                    </Taxes>
                    <TotalFare Amount="404992"/>
                  </Totals>
                </ItinTotalFare>
                <PassengerTypeQuantity Code="ADT" Quantity="02"/>
                <PTC_FareBreakdown>
                  <Endorsements>
                    <Endorsement type="PRICING_PARAMETER">
                      <Text>WPAEY$P2ADT/1CNN/1INF$MP-I$BRYF$RQ</Text>
                    </Endorsement>
                    <Endorsement type="WARNING">
                      <Text>VALIDATING CARRIER SPECIFIED</Text>
                    </Endorsement>
                    <Endorsement type="WARNING">
                      <Text>BSP - EY</Text>
                    </Endorsement>
                    <Endorsement type="WARNING">
                      <Text>TCH - EY</Text>
                    </Endorsement>
                    <Endorsement type="WARNING">
                      <Text>CHG BEF DEP UP TO RUB1XXX0/CHG AFT DEP UP TO RUB1XXX0/REF BEF</Text>
                    </Endorsement>
                    <Endorsement type="WARNING">
                      <Text>DEP UP TO RUB0/REF AFT DEP UP TO RUB0/SEE RULES</Text>
                    </Endorsement>
                    <Endorsement type="SYSTEM_ENDORSEMENT">
                      <Text>NON ENDO/ REF</Text>
                    </Endorsement>
                  </Endorsements>
                  <FareBasis Code="YLWF2AU/YLWF2AU/YLXF2AU/YLXF2AU"/>
                  <FareCalculation>
                    <Text>SYD EY X/AUH EY LON Q25.00 1531.08EY X/AUH Q25.00EY SYD1504.72NUC3085.80END ROE1.328146</Text>
                  </FareCalculation>
                  <FareSource>ATPC</FareSource>
                  <FlightSegment ConnectionInd="O" DepartureDateTime="12-01T23:25" FlightNumber="2463" ResBookDesigCode="Y" SegmentNumber="1" Status="OK">
                    <BaggageAllowance Number="35K"/>
                    <FareBasis Code="YLWF2AU"/>
                    <MarketingAirline Code="EY" FlightNumber="2463"/>
                    <OriginLocation LocationCode="SYD"/>
                    <ValidityDates>
                      <NotValidAfter>2022-12-01</NotValidAfter>
                      <NotValidBefore>2022-12-01</NotValidBefore>
                    </ValidityDates>
                  </FlightSegment>
                  <FlightSegment ConnectionInd="X" DepartureDateTime="12-02T10:35" FlightNumber="25" ResBookDesigCode="Y" SegmentNumber="2" Status="OK">
                    <BaggageAllowance Number="35K"/>
                    <FareBasis Code="YLWF2AU"/>
                    <MarketingAirline Code="EY" FlightNumber="25"/>
                    <OriginLocation LocationCode="AUH"/>
                    <ValidityDates>
                      <NotValidAfter>2022-12-02</NotValidAfter>
                      <NotValidBefore>2022-12-02</NotValidBefore>
                    </ValidityDates>
                  </FlightSegment>
                  <FlightSegment ConnectionInd="O" DepartureDateTime="12-08T08:30" FlightNumber="12" ResBookDesigCode="Y" SegmentNumber="3" Status="OK">
                    <BaggageAllowance Number="35K"/>
                    <FareBasis Code="YLXF2AU"/>
                    <MarketingAirline Code="EY" FlightNumber="12"/>
                    <OriginLocation LocationCode="LHR"/>
                    <ValidityDates>
                      <NotValidAfter>2022-12-08</NotValidAfter>
                      <NotValidBefore>2022-12-08</NotValidBefore>
                    </ValidityDates>
                  </FlightSegment>
                  <FlightSegment ConnectionInd="X" DepartureDateTime="12-08T22:10" FlightNumber="464" ResBookDesigCode="Y" SegmentNumber="4" Status="OK">
                    <BaggageAllowance Number="35K"/>
                    <FareBasis Code="YLXF2AU"/>
                    <MarketingAirline Code="EY" FlightNumber="464"/>
                    <OriginLocation LocationCode="AUH"/>
                    <ValidityDates>
                      <NotValidAfter>2022-12-08</NotValidAfter>
                      <NotValidBefore>2022-12-08</NotValidBefore>
                    </ValidityDates>
                  </FlightSegment>
                  <FlightSegment>
                    <OriginLocation LocationCode="SYD"/>
                  </FlightSegment>
                  <FareComponent Amount="153108" FareBasisCode="YLWF2AU" FareComponentNumber="1" FareDirectionality="FROM" GoverningCarrier="EY" TicketDesignator="">
                    <Location Destination="LON" Origin="SYD"/>
                    <Dates ArrivalDateTime="12-02T14:10" DepartureDateTime="12-01T23:25"/>
                    <FlightSegmentNumbers>
                      <FlightSegmentNumber>1</FlightSegmentNumber>
                      <FlightSegmentNumber>2</FlightSegmentNumber>
                    </FlightSegmentNumbers>
                  </FareComponent>
                  <FareComponent Amount="150472" FareBasisCode="YLXF2AU" FareComponentNumber="2" FareDirectionality="TO" GoverningCarrier="EY" TicketDesignator="">
                    <Location Destination="SYD" Origin="LON"/>
                    <Dates ArrivalDateTime="12-09T17:55" DepartureDateTime="12-08T08:30"/>
                    <FlightSegmentNumbers>
                      <FlightSegmentNumber>3</FlightSegmentNumber>
                      <FlightSegmentNumber>4</FlightSegmentNumber>
                    </FlightSegmentNumbers>
                  </FareComponent>
                </PTC_FareBreakdown>
              </AirItineraryPricingInfo>
            </PricedItinerary>
            <ResponseHeader>
              <Text>FARE - PRICE RETAINED</Text>
              <Text>FARE NOT GUARANTEED UNTIL TICKETED</Text>
            </ResponseHeader>
            <PriceQuotePlus DiscountAmount="0" DisplayOnly="false" DomesticIntlInd="I" IT_BT_Fare="BT" ItineraryChanged="false" ManualFare="false" NUCSuppresion="false" NegotiatedFare="false" PricingStatus="S" SubjToGovtApproval="false" SystemIndicator="S" VerifyFareCalc="false">
              <TicketingInstructionsInfo/>
            </PriceQuotePlus>
          </PriceQuote>
          <PriceQuote RPH="2">
            <MiscInformation>
              <SignatureLine ExpirationDateTime="00:00" Source="SYS" Status="ACTIVE">
                <Text>9LSC 9LSC*AWT 1256/20MAY22</Text>
              </SignatureLine>
            </MiscInformation>
            <PricedItinerary DisplayOnly="false" InputMessage="WPAEY¥P2ADT/1CNN/1INF¥MP-I¥BRYF¥RQ" RPH="2" StatusCode="A" StoredDateTime="2022-05-20T12:56" TaxExempt="false" ValidatingCarrier="EY">
              <AirItineraryPricingInfo>
                <ItinTotalFare>
                  <BaseFare Amount="3091.00" CurrencyCode="AUD"/>
                  <EquivFare Amount="139095" CurrencyCode="RUB"/>
                  <Taxes>
                    <Tax Amount="8663" TaxCode="XT"/>
                    <TaxBreakdownCode TaxPaid="false">2816WY</TaxBreakdownCode>
                    <TaxBreakdownCode TaxPaid="false">174ZR</TaxBreakdownCode>
                    <TaxBreakdownCode TaxPaid="false">1216F6</TaxBreakdownCode>
                    <TaxBreakdownCode TaxPaid="false">4457UB</TaxBreakdownCode>
                  </Taxes>
                  <TotalFare Amount="147758" CurrencyCode="RUB"/>
                  <Totals>
                    <BaseFare Amount="3091.00"/>
                    <EquivFare Amount="139095"/>
                    <Taxes>
                      <Tax Amount="8663"/>
                    </Taxes>
                    <TotalFare Amount="147758"/>
                  </Totals>
                </ItinTotalFare>
                <PassengerTypeQuantity Code="CNN" Quantity="01"/>
                <PTC_FareBreakdown>
                  <Endorsements>
                    <Endorsement type="PRICING_PARAMETER">
                      <Text>WPAEY$P2ADT/1CNN/1INF$MP-I$BRYF$RQ</Text>
                    </Endorsement>
                    <Endorsement type="WARNING">
                      <Text>VALIDATING CARRIER SPECIFIED</Text>
                    </Endorsement>
                    <Endorsement type="WARNING">
                      <Text>BSP - EY</Text>
                    </Endorsement>
                    <Endorsement type="WARNING">
                      <Text>TCH - EY</Text>
                    </Endorsement>
                    <Endorsement type="WARNING">
                      <Text>CHG BEF DEP UP TO RUB1XXX0/CHG AFT DEP UP TO RUB1XXX0/REF BEF</Text>
                    </Endorsement>
                    <Endorsement type="WARNING">
                      <Text>DEP UP TO RUB0/REF AFT DEP UP TO RUB0/SEE RULES</Text>
                    </Endorsement>
                    <Endorsement type="SYSTEM_ENDORSEMENT">
                      <Text>NON ENDO/ REF</Text>
                    </Endorsement>
                  </Endorsements>
                  <FareBasis Code="YLWF2AUCH/YLWF2AUCH/YLXF2AUCH/YLXF2AUCH"/>
                  <FareCalculation>
                    <Text>SYD EY X/AUH EY LON Q25.00 1148.31EY X/AUH Q25.00EY SYD1128.54NUC2326.85END ROE1.328146</Text>
                  </FareCalculation>
                  <FareSource>ATPC</FareSource>
                  <FlightSegment ConnectionInd="O" DepartureDateTime="12-01T23:25" FlightNumber="2463" ResBookDesigCode="Y" SegmentNumber="1" Status="OK">
                    <BaggageAllowance Number="35K"/>
                    <FareBasis Code="YLWF2AUCH"/>
                    <MarketingAirline Code="EY" FlightNumber="2463"/>
                    <OriginLocation LocationCode="SYD"/>
                    <ValidityDates>
                      <NotValidAfter>2022-12-01</NotValidAfter>
                      <NotValidBefore>2022-12-01</NotValidBefore>
                    </ValidityDates>
                  </FlightSegment>
                  <FlightSegment ConnectionInd="X" DepartureDateTime="12-02T10:35" FlightNumber="25" ResBookDesigCode="Y" SegmentNumber="2" Status="OK">
                    <BaggageAllowance Number="35K"/>
                    <FareBasis Code="YLWF2AUCH"/>
                    <MarketingAirline Code="EY" FlightNumber="25"/>
                    <OriginLocation LocationCode="AUH"/>
                    <ValidityDates>
                      <NotValidAfter>2022-12-02</NotValidAfter>
                      <NotValidBefore>2022-12-02</NotValidBefore>
                    </ValidityDates>
                  </FlightSegment>
                  <FlightSegment ConnectionInd="O" DepartureDateTime="12-08T08:30" FlightNumber="12" ResBookDesigCode="Y" SegmentNumber="3" Status="OK">
                    <BaggageAllowance Number="35K"/>
                    <FareBasis Code="YLXF2AUCH"/>
                    <MarketingAirline Code="EY" FlightNumber="12"/>
                    <OriginLocation LocationCode="LHR"/>
                    <ValidityDates>
                      <NotValidAfter>2022-12-08</NotValidAfter>
                      <NotValidBefore>2022-12-08</NotValidBefore>
                    </ValidityDates>
                  </FlightSegment>
                  <FlightSegment ConnectionInd="X" DepartureDateTime="12-08T22:10" FlightNumber="464" ResBookDesigCode="Y" SegmentNumber="4" Status="OK">
                    <BaggageAllowance Number="35K"/>
                    <FareBasis Code="YLXF2AUCH"/>
                    <MarketingAirline Code="EY" FlightNumber="464"/>
                    <OriginLocation LocationCode="AUH"/>
                    <ValidityDates>
                      <NotValidAfter>2022-12-08</NotValidAfter>
                      <NotValidBefore>2022-12-08</NotValidBefore>
                    </ValidityDates>
                  </FlightSegment>
                  <FlightSegment>
                    <OriginLocation LocationCode="SYD"/>
                  </FlightSegment>
                  <FareComponent Amount="114831" FareBasisCode="YLWF2AUCH" FareComponentNumber="1" FareDirectionality="FROM" GoverningCarrier="EY" TicketDesignator="">
                    <Location Destination="LON" Origin="SYD"/>
                    <Dates ArrivalDateTime="12-02T14:10" DepartureDateTime="12-01T23:25"/>
                    <FlightSegmentNumbers>
                      <FlightSegmentNumber>1</FlightSegmentNumber>
                      <FlightSegmentNumber>2</FlightSegmentNumber>
                    </FlightSegmentNumbers>
                  </FareComponent>
                  <FareComponent Amount="112854" FareBasisCode="YLXF2AUCH" FareComponentNumber="2" FareDirectionality="TO" GoverningCarrier="EY" TicketDesignator="">
                    <Location Destination="SYD" Origin="LON"/>
                    <Dates ArrivalDateTime="12-09T17:55" DepartureDateTime="12-08T08:30"/>
                    <FlightSegmentNumbers>
                      <FlightSegmentNumber>3</FlightSegmentNumber>
                      <FlightSegmentNumber>4</FlightSegmentNumber>
                    </FlightSegmentNumbers>
                  </FareComponent>
                </PTC_FareBreakdown>
              </AirItineraryPricingInfo>
            </PricedItinerary>
            <ResponseHeader>
              <Text>FARE - PRICE RETAINED</Text>
              <Text>FARE NOT GUARANTEED UNTIL TICKETED</Text>
            </ResponseHeader>
            <PriceQuotePlus DiscountAmount="0" DisplayOnly="false" DomesticIntlInd="I" IT_BT_Fare="BT" ItineraryChanged="false" ManualFare="false" NUCSuppresion="false" NegotiatedFare="false" PricingStatus="S" SubjToGovtApproval="false" SystemIndicator="S" VerifyFareCalc="false">
              <TicketingInstructionsInfo/>
            </PriceQuotePlus>
          </PriceQuote>
          <PriceQuote RPH="3">
            <MiscInformation>
              <SignatureLine ExpirationDateTime="00:00" Source="SYS" Status="ACTIVE">
                <Text>9LSC 9LSC*AWT 1256/20MAY22</Text>
              </SignatureLine>
            </MiscInformation>
            <PricedItinerary DisplayOnly="false" InputMessage="WPAEY¥P2ADT/1CNN/1INF¥MP-I¥BRYF¥RQ" RPH="3" StatusCode="A" StoredDateTime="2022-05-20T12:56" TaxExempt="false" ValidatingCarrier="EY">
              <AirItineraryPricingInfo>
                <ItinTotalFare>
                  <BaseFare Amount="404.00" CurrencyCode="AUD"/>
                  <EquivFare Amount="18180" CurrencyCode="RUB"/>
                  <Taxes>
                    <Tax Amount="4457" TaxCode="UB"/>
                  </Taxes>
                  <TotalFare Amount="22637" CurrencyCode="RUB"/>
                  <Totals>
                    <BaseFare Amount="404.00"/>
                    <EquivFare Amount="18180"/>
                    <Taxes>
                      <Tax Amount="4457"/>
                    </Taxes>
                    <TotalFare Amount="22637"/>
                  </Totals>
                </ItinTotalFare>
                <PassengerTypeQuantity Code="INF" Quantity="01"/>
                <PTC_FareBreakdown>
                  <Endorsements>
                    <Endorsement type="PRICING_PARAMETER">
                      <Text>WPAEY$P2ADT/1CNN/1INF$MP-I$BRYF$RQ</Text>
                    </Endorsement>
                    <Endorsement type="WARNING">
                      <Text>REQUIRES ACCOMPANYING ADT PASSENGER</Text>
                    </Endorsement>
                    <Endorsement type="WARNING">
                      <Text>EACH INF REQUIRES ACCOMPANYING ADT PASSENGER</Text>
                    </Endorsement>
                    <Endorsement type="WARNING">
                      <Text>VALIDATING CARRIER SPECIFIED</Text>
                    </Endorsement>
                    <Endorsement type="WARNING">
                      <Text>BSP - EY</Text>
                    </Endorsement>
                    <Endorsement type="WARNING">
                      <Text>TCH - EY</Text>
                    </Endorsement>
                    <Endorsement type="WARNING">
                      <Text>CHG BEF DEP UP TO RUB1XXX0/CHG AFT DEP UP TO RUB1XXX0/REF BEF</Text>
                    </Endorsement>
                    <Endorsement type="WARNING">
                      <Text>DEP UP TO RUB0/REF AFT DEP UP TO RUB0/SEE RULES</Text>
                    </Endorsement>
                    <Endorsement type="SYSTEM_ENDORSEMENT">
                      <Text>NON ENDO/ REF</Text>
                    </Endorsement>
                  </Endorsements>
                  <FareBasis Code="YLWF2AUIN/YLWF2AUIN/YLXF2AUIN/YLXF2AUIN"/>
                  <FareCalculation>
                    <Text>SYD EY X/AUH EY LON153.10EY X/AUH EY SYD150.47NUC303.57END ROE1.328146</Text>
                  </FareCalculation>
                  <FareSource>ATPC</FareSource>
                  <FlightSegment ConnectionInd="O" DepartureDateTime="12-01T23:25" FlightNumber="2463" ResBookDesigCode="Y" SegmentNumber="1" Status="NS">
                    <BaggageAllowance Number="10K"/>
                    <FareBasis Code="YLWF2AUIN"/>
                    <MarketingAirline Code="EY" FlightNumber="2463"/>
                    <OriginLocation LocationCode="SYD"/>
                    <ValidityDates>
                      <NotValidAfter>2022-12-01</NotValidAfter>
                      <NotValidBefore>2022-12-01</NotValidBefore>
                    </ValidityDates>
                  </FlightSegment>
                  <FlightSegment ConnectionInd="X" DepartureDateTime="12-02T10:35" FlightNumber="25" ResBookDesigCode="Y" SegmentNumber="2" Status="NS">
                    <BaggageAllowance Number="10K"/>
                    <FareBasis Code="YLWF2AUIN"/>
                    <MarketingAirline Code="EY" FlightNumber="25"/>
                    <OriginLocation LocationCode="AUH"/>
                    <ValidityDates>
                      <NotValidAfter>2022-12-02</NotValidAfter>
                      <NotValidBefore>2022-12-02</NotValidBefore>
                    </ValidityDates>
                  </FlightSegment>
                  <FlightSegment ConnectionInd="O" DepartureDateTime="12-08T08:30" FlightNumber="12" ResBookDesigCode="Y" SegmentNumber="3" Status="NS">
                    <BaggageAllowance Number="10K"/>
                    <FareBasis Code="YLXF2AUIN"/>
                    <MarketingAirline Code="EY" FlightNumber="12"/>
                    <OriginLocation LocationCode="LHR"/>
                    <ValidityDates>
                      <NotValidAfter>2022-12-08</NotValidAfter>
                      <NotValidBefore>2022-12-08</NotValidBefore>
                    </ValidityDates>
                  </FlightSegment>
                  <FlightSegment ConnectionInd="X" DepartureDateTime="12-08T22:10" FlightNumber="464" ResBookDesigCode="Y" SegmentNumber="4" Status="NS">
                    <BaggageAllowance Number="10K"/>
                    <FareBasis Code="YLXF2AUIN"/>
                    <MarketingAirline Code="EY" FlightNumber="464"/>
                    <OriginLocation LocationCode="AUH"/>
                    <ValidityDates>
                      <NotValidAfter>2022-12-08</NotValidAfter>
                      <NotValidBefore>2022-12-08</NotValidBefore>
                    </ValidityDates>
                  </FlightSegment>
                  <FlightSegment>
                    <OriginLocation LocationCode="SYD"/>
                  </FlightSegment>
                  <FareComponent Amount="15310" FareBasisCode="YLWF2AUIN" FareComponentNumber="1" FareDirectionality="FROM" GoverningCarrier="EY" TicketDesignator="">
                    <Location Destination="LON" Origin="SYD"/>
                    <Dates ArrivalDateTime="12-02T14:10" DepartureDateTime="12-01T23:25"/>
                    <FlightSegmentNumbers>
                      <FlightSegmentNumber>1</FlightSegmentNumber>
                      <FlightSegmentNumber>2</FlightSegmentNumber>
                    </FlightSegmentNumbers>
                  </FareComponent>
                  <FareComponent Amount="15047" FareBasisCode="YLXF2AUIN" FareComponentNumber="2" FareDirectionality="TO" GoverningCarrier="EY" TicketDesignator="">
                    <Location Destination="SYD" Origin="LON"/>
                    <Dates ArrivalDateTime="12-09T17:55" DepartureDateTime="12-08T08:30"/>
                    <FlightSegmentNumbers>
                      <FlightSegmentNumber>3</FlightSegmentNumber>
                      <FlightSegmentNumber>4</FlightSegmentNumber>
                    </FlightSegmentNumbers>
                  </FareComponent>
                </PTC_FareBreakdown>
              </AirItineraryPricingInfo>
            </PricedItinerary>
            <ResponseHeader>
              <Text>FARE - PRICE RETAINED</Text>
              <Text>FARE USED TO CALCULATE DISCOUNT</Text>
              <Text>FARE NOT GUARANTEED UNTIL TICKETED</Text>
            </ResponseHeader>
            <PriceQuotePlus DiscountAmount="0" DisplayOnly="false" DomesticIntlInd="I" IT_BT_Fare="BT" ItineraryChanged="false" ManualFare="false" NUCSuppresion="false" NegotiatedFare="false" PricingStatus="S" SubjToGovtApproval="false" SystemIndicator="S" VerifyFareCalc="false">
              <TicketingInstructionsInfo/>
            </PriceQuotePlus>
          </PriceQuote>
          <PriceQuoteTotals>
            <BaseFare Amount="11693.00"/>
            <EquivFare Amount="526185.00"/>
            <Taxes>
              <Tax Amount="49202.00"/>
            </Taxes>
            <TotalFare Amount="575387.00"/>
          </PriceQuoteTotals>
        </ItineraryPricing>
        <ReservationItems>
          <Item RPH="1">
            <FlightSegment AirMilesFlown="7506" ArrivalDateTime="12-02T06:40" CodeShare="false" ConnectionInd="O" DayOfWeekInd="4" DepartureDateTime="2022-12-01T23:25" ElapsedTime="13.15" FlightNumber="2463" Id="3" IsPast="false" NumberInParty="03" ResBookDesigCode="Y" SegmentNumber="0001" SmokingAllowed="false" SpecialMeal="false" Status="SS" StopQuantity="00" eTicket="true">
              <DestinationLocation LocationCode="AUH"/>
              <Equipment AirEquipType="789"/>
              <MarketingAirline Code="EY" FlightNumber="2463" ResBookDesigCode="Y">
                <Banner>MARKETED BY ETIHAD AIRWAYS</Banner>
              </MarketingAirline>
              <MarriageGrp Group="001" Ind="O" Sequence="1"/>
              <Meal Code="R"/>
              <OperatingAirline Code="EY" FlightNumber="2463" ResBookDesigCode="Y">
                <Banner>OPERATED BY ETIHAD AIRWAYS</Banner>
              </OperatingAirline>
              <OperatingAirlinePricing Code="EY"/>
              <DisclosureCarrier Code="EY" DOT="false">
                <Banner>ETIHAD AIRWAYS</Banner>
              </DisclosureCarrier>
              <OriginLocation LocationCode="SYD"/>
              <SupplierRef ID="DCEY"/>
              <UpdatedArrivalTime>12-02T06:40</UpdatedArrivalTime>
              <UpdatedDepartureTime>12-01T23:25</UpdatedDepartureTime>
              <Cabin Code="Y" Lang="EN" Name="ECONOMY" SabreCode="Y" ShortName="ECONOMY"/>
            </FlightSegment>
            <Product>
              <ProductDetails productCategory="AIR">
                <ProductName type="AIR"/>
                <Air segmentAssociationId="2" sequence="1">
                  <DepartureAirport>SYD</DepartureAirport>
                  <ArrivalAirport>AUH</ArrivalAirport>
                  <EquipmentType>789</EquipmentType>
                  <MarketingAirlineCode>EY</MarketingAirlineCode>
                  <MarketingFlightNumber>2463</MarketingFlightNumber>
                  <MarketingClassOfService>Y</MarketingClassOfService>
                  <MarriageGrp>
                    <Group>1</Group>
                    <Sequence>1</Sequence>
                  </MarriageGrp>
                  <Cabin code="Y" lang="EN" name="ECONOMY" sabreCode="Y" shortName="ECONOMY"/>
                  <MealCode>R</MealCode>
                  <ElapsedTime>795</ElapsedTime>
                  <AirMilesFlown>7506</AirMilesFlown>
                  <FunnelFlight>false</FunnelFlight>
                  <ChangeOfGauge>false</ChangeOfGauge>
                  <DisclosureCarrier Code="EY" DOT="false">
                    <Banner>ETIHAD AIRWAYS</Banner>
                  </DisclosureCarrier>
                  <AirlineRefId>DCEY</AirlineRefId>
                  <Eticket>true</Eticket>
                  <DepartureDateTime>2022-12-01T23:25:00</DepartureDateTime>
                  <ArrivalDateTime>2022-12-02T06:40:00</ArrivalDateTime>
                  <FlightNumber>2463</FlightNumber>
                  <ClassOfService>Y</ClassOfService>
                  <ActionCode>SS</ActionCode>
                  <NumberInParty>3</NumberInParty>
                  <inboundConnection>false</inboundConnection>
                  <outboundConnection>true</outboundConnection>
                  <ScheduleChangeIndicator>false</ScheduleChangeIndicator>
                </Air>
              </ProductDetails>
            </Product>
          </Item>
          <Item RPH="2">
            <FlightSegment AirMilesFlown="3420" ArrivalDateTime="12-02T14:10" CodeShare="false" ConnectionInd="I" DayOfWeekInd="5" DepartureDateTime="2022-12-02T10:35" ElapsedTime="07.35" FlightNumber="0025" Id="4" IsPast="false" NumberInParty="03" ResBookDesigCode="Y" SegmentNumber="0002" SmokingAllowed="false" SpecialMeal="false" Status="SS" StopQuantity="00" eTicket="true">
              <DestinationLocation LocationCode="LHR" Terminal="TERMINAL 3" TerminalCode="3"/>
              <Equipment AirEquipType="789"/>
              <MarketingAirline Code="EY" FlightNumber="0025" ResBookDesigCode="Y">
                <Banner>MARKETED BY ETIHAD AIRWAYS</Banner>
              </MarketingAirline>
              <MarriageGrp Group="001" Ind="I" Sequence="2"/>
              <Meal Code="M"/>
              <OperatingAirline Code="EY" FlightNumber="0025" ResBookDesigCode="Y">
                <Banner>OPERATED BY ETIHAD AIRWAYS</Banner>
              </OperatingAirline>
              <OperatingAirlinePricing Code="EY"/>
              <DisclosureCarrier Code="EY" DOT="false">
                <Banner>ETIHAD AIRWAYS</Banner>
              </DisclosureCarrier>
              <OriginLocation LocationCode="AUH" Terminal="TERMINAL 3" TerminalCode="3"/>
              <SupplierRef ID="DCEY"/>
              <UpdatedArrivalTime>12-02T14:10</UpdatedArrivalTime>
              <UpdatedDepartureTime>12-02T10:35</UpdatedDepartureTime>
              <Cabin Code="Y" Lang="EN" Name="ECONOMY" SabreCode="Y" ShortName="ECONOMY"/>
            </FlightSegment>
            <Product>
              <ProductDetails productCategory="AIR">
                <ProductName type="AIR"/>
                <Air segmentAssociationId="3" sequence="2">
                  <DepartureAirport>AUH</DepartureAirport>
                  <DepartureTerminalName>TERMINAL 3</DepartureTerminalName>
                  <DepartureTerminalCode>3</DepartureTerminalCode>
                  <ArrivalAirport>LHR</ArrivalAirport>
                  <ArrivalTerminalName>TERMINAL 3</ArrivalTerminalName>
                  <ArrivalTerminalCode>3</ArrivalTerminalCode>
                  <EquipmentType>789</EquipmentType>
                  <MarketingAirlineCode>EY</MarketingAirlineCode>
                  <MarketingFlightNumber>25</MarketingFlightNumber>
                  <MarketingClassOfService>Y</MarketingClassOfService>
                  <MarriageGrp>
                    <Group>1</Group>
                    <Sequence>2</Sequence>
                  </MarriageGrp>
                  <Cabin code="Y" lang="EN" name="ECONOMY" sabreCode="Y" shortName="ECONOMY"/>
                  <MealCode>M</MealCode>
                  <ElapsedTime>455</ElapsedTime>
                  <AirMilesFlown>3420</AirMilesFlown>
                  <FunnelFlight>false</FunnelFlight>
                  <ChangeOfGauge>false</ChangeOfGauge>
                  <DisclosureCarrier Code="EY" DOT="false">
                    <Banner>ETIHAD AIRWAYS</Banner>
                  </DisclosureCarrier>
                  <AirlineRefId>DCEY</AirlineRefId>
                  <Eticket>true</Eticket>
                  <DepartureDateTime>2022-12-02T10:35:00</DepartureDateTime>
                  <ArrivalDateTime>2022-12-02T14:10:00</ArrivalDateTime>
                  <FlightNumber>25</FlightNumber>
                  <ClassOfService>Y</ClassOfService>
                  <ActionCode>SS</ActionCode>
                  <NumberInParty>3</NumberInParty>
                  <inboundConnection>true</inboundConnection>
                  <outboundConnection>false</outboundConnection>
                  <ScheduleChangeIndicator>false</ScheduleChangeIndicator>
                </Air>
              </ProductDetails>
            </Product>
          </Item>
          <Item RPH="3">
            <FlightSegment AirMilesFlown="3420" ArrivalDateTime="12-08T19:20" CodeShare="false" DayOfWeekInd="4" DepartureDateTime="2022-12-08T08:30" ElapsedTime="06.50" FlightNumber="0012" Id="5" IsPast="false" NumberInParty="03" ResBookDesigCode="Y" SegmentNumber="0003" SmokingAllowed="false" SpecialMeal="false" Status="SS" StopQuantity="00" eTicket="true">
              <DestinationLocation LocationCode="AUH" Terminal="TERMINAL 3" TerminalCode="3"/>
              <Equipment AirEquipType="781"/>
              <MarketingAirline Code="EY" FlightNumber="0012" ResBookDesigCode="Y">
                <Banner>MARKETED BY ETIHAD AIRWAYS</Banner>
              </MarketingAirline>
              <MarriageGrp Group="002" Sequence="1"/>
              <Meal Code="M"/>
              <OperatingAirline Code="EY" FlightNumber="0012" ResBookDesigCode="Y">
                <Banner>OPERATED BY ETIHAD AIRWAYS</Banner>
              </OperatingAirline>
              <OperatingAirlinePricing Code="EY"/>
              <DisclosureCarrier Code="EY" DOT="false">
                <Banner>ETIHAD AIRWAYS</Banner>
              </DisclosureCarrier>
              <OriginLocation LocationCode="LHR" Terminal="TERMINAL 3" TerminalCode="3"/>
              <SupplierRef ID="DCEY"/>
              <UpdatedArrivalTime>12-08T19:20</UpdatedArrivalTime>
              <UpdatedDepartureTime>12-08T08:30</UpdatedDepartureTime>
              <Cabin Code="Y" Lang="EN" Name="ECONOMY" SabreCode="Y" ShortName="ECONOMY"/>
            </FlightSegment>
            <Product>
              <ProductDetails productCategory="AIR">
                <ProductName type="AIR"/>
                <Air segmentAssociationId="4" sequence="3">
                  <DepartureAirport>LHR</DepartureAirport>
                  <DepartureTerminalName>TERMINAL 3</DepartureTerminalName>
                  <DepartureTerminalCode>3</DepartureTerminalCode>
                  <ArrivalAirport>AUH</ArrivalAirport>
                  <ArrivalTerminalName>TERMINAL 3</ArrivalTerminalName>
                  <ArrivalTerminalCode>3</ArrivalTerminalCode>
                  <EquipmentType>781</EquipmentType>
                  <MarketingAirlineCode>EY</MarketingAirlineCode>
                  <MarketingFlightNumber>12</MarketingFlightNumber>
                  <MarketingClassOfService>Y</MarketingClassOfService>
                  <MarriageGrp>
                    <Group>2</Group>
                    <Sequence>1</Sequence>
                  </MarriageGrp>
                  <Cabin code="Y" lang="EN" name="ECONOMY" sabreCode="Y" shortName="ECONOMY"/>
                  <MealCode>M</MealCode>
                  <ElapsedTime>410</ElapsedTime>
                  <AirMilesFlown>3420</AirMilesFlown>
                  <FunnelFlight>false</FunnelFlight>
                  <ChangeOfGauge>false</ChangeOfGauge>
                  <DisclosureCarrier Code="EY" DOT="false">
                    <Banner>ETIHAD AIRWAYS</Banner>
                  </DisclosureCarrier>
                  <AirlineRefId>DCEY</AirlineRefId>
                  <Eticket>true</Eticket>
                  <DepartureDateTime>2022-12-08T08:30:00</DepartureDateTime>
                  <ArrivalDateTime>2022-12-08T19:20:00</ArrivalDateTime>
                  <FlightNumber>12</FlightNumber>
                  <ClassOfService>Y</ClassOfService>
                  <ActionCode>SS</ActionCode>
                  <NumberInParty>3</NumberInParty>
                  <inboundConnection>false</inboundConnection>
                  <outboundConnection>false</outboundConnection>
                  <ScheduleChangeIndicator>false</ScheduleChangeIndicator>
                </Air>
              </ProductDetails>
            </Product>
          </Item>
          <Item RPH="4">
            <FlightSegment AirMilesFlown="7506" ArrivalDateTime="12-09T17:55" CodeShare="false" DayOfWeekInd="4" DepartureDateTime="2022-12-08T22:10" ElapsedTime="13.45" FlightNumber="0464" Id="6" IsPast="false" NumberInParty="03" ResBookDesigCode="Y" SegmentNumber="0004" SmokingAllowed="false" SpecialMeal="false" Status="SS" StopQuantity="00" eTicket="true">
              <DestinationLocation LocationCode="SYD"/>
              <Equipment AirEquipType="789"/>
              <MarketingAirline Code="EY" FlightNumber="0464" ResBookDesigCode="Y">
                <Banner>MARKETED BY ETIHAD AIRWAYS</Banner>
              </MarketingAirline>
              <MarriageGrp Group="002" Sequence="2"/>
              <OperatingAirline Code="EY" FlightNumber="0464" ResBookDesigCode="Y">
                <Banner>OPERATED BY ETIHAD AIRWAYS</Banner>
              </OperatingAirline>
              <OperatingAirlinePricing Code="EY"/>
              <DisclosureCarrier Code="EY" DOT="false">
                <Banner>ETIHAD AIRWAYS</Banner>
              </DisclosureCarrier>
              <OriginLocation LocationCode="AUH"/>
              <SupplierRef ID="DCEY"/>
              <UpdatedArrivalTime>12-09T17:55</UpdatedArrivalTime>
              <UpdatedDepartureTime>12-08T22:10</UpdatedDepartureTime>
              <Cabin Code="Y" Lang="EN" Name="ECONOMY" SabreCode="Y" ShortName="ECONOMY"/>
            </FlightSegment>
            <Product>
              <ProductDetails productCategory="AIR">
                <ProductName type="AIR"/>
                <Air segmentAssociationId="5" sequence="4">
                  <DepartureAirport>AUH</DepartureAirport>
                  <ArrivalAirport>SYD</ArrivalAirport>
                  <EquipmentType>789</EquipmentType>
                  <MarketingAirlineCode>EY</MarketingAirlineCode>
                  <MarketingFlightNumber>464</MarketingFlightNumber>
                  <MarketingClassOfService>Y</MarketingClassOfService>
                  <MarriageGrp>
                    <Group>2</Group>
                    <Sequence>2</Sequence>
                  </MarriageGrp>
                  <Cabin code="Y" lang="EN" name="ECONOMY" sabreCode="Y" shortName="ECONOMY"/>
                  <ElapsedTime>825</ElapsedTime>
                  <AirMilesFlown>7506</AirMilesFlown>
                  <FunnelFlight>false</FunnelFlight>
                  <ChangeOfGauge>false</ChangeOfGauge>
                  <DisclosureCarrier Code="EY" DOT="false">
                    <Banner>ETIHAD AIRWAYS</Banner>
                  </DisclosureCarrier>
                  <AirlineRefId>DCEY</AirlineRefId>
                  <Eticket>true</Eticket>
                  <DepartureDateTime>2022-12-08T22:10:00</DepartureDateTime>
                  <ArrivalDateTime>2022-12-09T17:55:00</ArrivalDateTime>
                  <FlightNumber>464</FlightNumber>
                  <ClassOfService>Y</ClassOfService>
                  <ActionCode>SS</ActionCode>
                  <NumberInParty>3</NumberInParty>
                  <inboundConnection>false</inboundConnection>
                  <outboundConnection>false</outboundConnection>
                  <ScheduleChangeIndicator>false</ScheduleChangeIndicator>
                </Air>
              </ProductDetails>
            </Product>
          </Item>
        </ReservationItems>
      </ItineraryInfo>
      <ItineraryRef AirExtras="false" InhibitCode="U" PartitionID="AA" PrimeHostID="1S">
        <Header>PRICE QUOTE RECORD EXISTS - SYSTEM</Header>
        <Source PseudoCityCode="9LSC"/>
      </ItineraryRef>
    </TravelItinerary>
  </TravelItineraryReadRS>
</EnhancedAirBookRS>
```
{{< /details >}}

## Добавление данных о пассажирах (PassengerDetailsRQ)

В качестве второго шага при создании бронирований используется сервис [PassengerDetailsRQ](https://developer.sabre.com/docs/soap_apis/management/itinerary/Passenger_Details), который позволяет добавить данные о пассажирах и сохранить бронирование.

### Контроль выполнения запроса

PassengerDetailsRQ является сервисом-оркестратором различных низкоуровневых сервисов. Сервис позволяет остановить ход выполнения запроса в том случае, если запуск любого из низкоуровневых сервисов завершится ошибкой. Для этого необходимо установить значение ```true``` у атрибута ```/PassengerDetailsRQ/@haltOnError```. Если дополнительно установить значение ```true``` у атрибута ```/PassengerDetailsRQ/@ignoreOnError```, то помимо остановки выполнения запроса, сервис также [очистит](edit-booking.html#игнорирование-бронирования-ignoretransactionllsrq) содержимое текущей [сессии](authentication.html#сессии).

Рекомендуется установить ```true``` в качестве значений обоих атрибутов.

### Предварительная обработка бронирования

#### Чтение бронирования

Для того чтобы произвести бронирование сегментов в уже существующем бронировании необходимо указать код бронирования (PNR Record Locator) в качестве значения атрибута ```/PassengerDetailsRQ/PreProcessing/UniqueID/@id```. При создании бронирования не требуется указывать этот атрибут.

#### Игнорирование бронирования

Установка значения ```true``` у атрибута ```/PassengerDetailsRQ/PreProcessing/@IgnoreBefore``` позволяет игнорировать содержимое текущей сессии перед началом выполнения запроса. При создании бронирования не требуется указывать этот атрибут.

### Добавление пассажиров

Пассажиры должны быть указаны в элементах ```/PassengerDetailsRQ/TravelItineraryAddInfoRQ/CustomerInfo/PersonName```:
- ```/GivenName``` — поле имени (см. ниже)
- ```/Surname``` — поле фамилии (см. ниже)
- ```/@NameNumber``` — номер пассажира. Пассажиры в бронировании должны иметь номер от ```1.1``` до ```9.1```
- ```/@PassengerType``` — категория пассажира
- ```/@Infant``` — признак младенца без места

Максимальная длина полей имени и фамилии — 29 символов. Рекомендуется использовать следующий алгоритм заполнения полей:

Поле фамилии:
1. заполняется фамилия
2. если фамилия длиннее 29 символов, заполняются первые 29 символов фамилии

Поле имени (отчество не требуется):
1. заполняется имя и титул (```MR``` для мужчин, ```MRS``` или ```MS``` для женщин)
2. если имя и титул длиннее 29 символов, заполняется только имя
3. если имя длиннее 29 символов, заполняются первые 29 символов имени

Поле имени (требуется отчество):
1. заполняется имя, отчество и титул (```MR``` для мужчин, ```MRS``` или ```MS``` для женщин)
2. если имя, отчество и титул длиннее 29 символов, заполняется имя и отчество
3. если имя и отчество длиннее 29 символов, то заполняется имя, первая буква отчества и титул
4. если имя, первая буква отчества и титул длиннее 29 символов, то заполняется имя и титул
5. если имя и титул длиннее 29 символов, заполняется только имя
6. если имя длиннее 29 символов, заполняются первые 29 символов имени

Коды основных категорий пассажиров:
- ```ADT``` — взрослый пассажир (от 12 лет)
- ```CNN``` — ребенок (от 2 до 12 лет)
- ```INF``` — младенец без места (до 2 лет)
- ```INS``` — младенец с местом (до 2 лет)

{{< hint warning >}}
Обратите внимание на то, что для успешного создания бронирования, содержащего детей или младенцев, необходима отправка специальных SSR сообщений ```CHLD``` или ```INFT``` (см. ниже).
{{< /hint >}}

{{< details title="Пример" open=true >}}
```XML
<PersonName NameNumber="1.1" PassengerType="ADT">
  <GivenName>IVAN IVANOVICH MR</GivenName>
  <Surname>IVANOV</Surname>
</PersonName>
<PersonName NameNumber="2.1" PassengerType="CNN">
  <GivenName>ANDREY IVANOVICH MR</GivenName>
  <Surname>IVANOV</Surname>
</PersonName>
<PersonName Infant="true" NameNumber="3.1" PassengerType="INF">
  <GivenName>EKATERINA IVANOVNA MRS</GivenName>
  <Surname>IVANOVA</Surname>
</PersonName>
```
{{< /details >}}

### Связка пассажиров с PQ

Для корректного сохранения бронирования требуется связать созданные в результате выполнения запроса к сервису EnhancedAirBookRQ PQ и пассажиров, добавляемых в запросе PassengerDetailsRQ. Для этого необходимо добавить элемент ```/PassengerDetailsRQ/PriceQuoteInfo/Link``` для каждого пассажира в бронировании и указать:
- ```/@nameNumber``` — номер пассажира
- ```/@record``` — номер PQ. Отдельный PQ будет создан для каждой категории пассажиров в том порядке, в каком они указаны в запросе к сервису EnhancedAirBookRQ.

{{< details title="Пример" open=true >}}
```XML
<Link nameNumber="1.1" record="1"/>
<Link nameNumber="2.1" record="1"/>
<Link nameNumber="3.1" record="2"/>
<Link nameNumber="4.1" record="3"/>
```
{{< /details >}}

### Добавление контактной информации

#### Телефоны

Телефоны указываются в элементах ```/PassengerDetailsRQ/TravelItineraryAddInfoRQ/CustomerInfo/ContactNumbers/ContactNumber```. Для каждого  телефона необходимо указать:
- ```/@Phone``` — номер телефона (может содержать цифры, буквы латинского алфавита, пробелы, символы ```-```, ```.``` и ```,```)
- ```/@PhoneUseType``` — тип телефона. Возможные значения:
    - ```A``` — телефон агентства
    - ```B``` — рабочий телефон
    - ```F``` — факс
    - ```H``` — домашний телефон
    - ```M``` — мобильный телефон

{{< hint warning >}}
Обратите внимание на то, что любое бронирование должно содержать как минимум один телефон.
{{< /hint >}}

{{< details title="Пример (телефон агентства и первого пассажира)" open=true >}}
```XML
<ContactNumber Phone="74991234567" PhoneUseType="A"/>
<ContactNumber Phone="79851234567" PhoneUseType="M"/>
```
{{< /details >}}

#### Адреса электронной почты

Адреса электронной почты должны быть размещены в качестве значений атрибута ```/PassengerDetailsRQ/TravelItineraryAddInfoRQ/CustomerInfo/Email/@Address```.

Дополнительно можно указать:
- ```/@NameNumber``` — номер пассажира, которому принадлежит электронная почта
- ```/@Type``` — тип адреса. Возможные значения:
    - ```TO``` — адрес будет в поле To (Кому) письма
    - ```FR``` — адрес будет в поле From (От кого) письма
    - ```CC``` — адрес будет в поле CC (Копия) письма
    - ```BC``` — адрес будет в поле BC (Скрытая копия) письма

{{< hint warning >}}
Обратите внимание на то, что в случае добавления адреса электронной почты в бронирование и в случае наличия зарегистрированной на этот адрес учетной записи в [TripCase](https://www.tripcase.com), бронирование автоматически появится в личном кабинете этой учетной записи в TripCase.
{{< /hint >}}

{{< details title="Пример (адреса пассажира и агентства (для отправки скрытой копии))" open=true >}}
```XML
<Email Address="customer@customer.com" NameNumber="1.1" Type="TO"/>
<Email Address="agency@agency.com" Type="BC"/>
```
{{< /details >}}

### Добавление карт лояльности

Карты лояльности (карты часто летающих пассажиров) должны быть указаны в элементах ```/PassengerDetailsRQ/TravelItineraryAddInfoRQ/CustomerInfo/CustLoyalty```:
- ```/@MembershipID``` — номер карты лояльности
- ```/@NameNumber``` — номер пассажира
- ```/@ProgramID``` — код перевозчика, выпустившего карту
- ```/@TravelingCarrierCode``` — код маркетингового перевозчика, для сегментов которого будет применена карта лояльности

{{< details title="Пример (у первого пассажира карта KL для сегментов SU, у второго пассажира карта SU для сегментов SU)" open=true >}}
```XML
<CustLoyalty MembershipID="1234567890" NameNumber="1.1" ProgramID="KL" TravelingCarrierCode="SU"/>
<CustLoyalty MembershipID="0987654321" NameNumber="2.1" ProgramID="SU" TravelingCarrierCode="SU"/>
```
{{< /details >}}

### Добавление паспортных данных и отправка других сообщений перевозчику (SSR и OSI)

#### Паспортные данные (SSR DOCS)

Паспортные данные должны быть добавлены в бронирование и отправлены в виде SSR сообщений с кодом ```DOCS```. Для добавления паспорта или другого документа (например, свидетельства о рождении) необходимо добавить элемент ```/PassengerDetailsRQ/SpecialReqDetails/SpecialServiceRQ/SpecialServiceInfo/AdvancePassenger```:
- ```/@SegmentNumber``` — номер сегмента, к которому будет привязан паспорт. Опциональное поле. Возможные значения:
    - номер сегмента (например, ```3```)
    - ```A``` для всех сегментов (рекомендуемый вариант)
- ```/Document/@ExpirationDate``` — срок окончания действия договора
- ```/Document/@Number``` — номер документа
- ```/Document/@Type``` — тип документа (всегда указывается значение ```P```)
- ```/Document/IssueCountry``` — код страны выдачи документа
- ```/Document/NationalityCountry``` — код страны гражданства пассажира
- ```/PersonName/@DateOfBirth``` — дата рождения пассажира
- ```/PersonName/@DocumentHolder``` — индикатор владельца паспорта. Значение ```true``` указывается только в том случае, если один или несколько других пассажиров в этом же бронировании вписаны в тот же паспорт
- ```/PersonName/@Gender``` — пол. Возможные значения:
    - ```M``` — мужской
    - ```F``` — женский
    - ```MI``` — младенец мальчик
    - ```FI``` — младенец девочка
- ```/PersonName/@NameNumber``` — номер пассажира в бронировании. Для младенцев без места указывается номер сопровождающего его взрослого
- ```/PersonName/GivenName``` — имя
- ```/PersonName/MiddleName``` — отчество
- ```/PersonName/Surname``` — фамилия

{{< hint warning >}}
Обратите внимание на то, что большинство перевозчиков требует наличие паспортных данных для всех пассажиров перед оформлением билетов.
{{< /hint >}}

{{< details title="Пример отправки паспорта для взрослого" open=true >}}
```XML
<AdvancePassenger SegmentNumber="A">
  <Document ExpirationDate="2020-11-20" Number="1234567890" Type="P">
    <IssueCountry>RU</IssueCountry>
    <NationalityCountry>RU</NationalityCountry>
  </Document>
  <PersonName DateOfBirth="1980-11-20" DocumentHolder="true" Gender="M" NameNumber="1.1">
    <GivenName>IVAN</GivenName>
    <MiddleName>IVANOVICH</MiddleName>
    <Surname>IVANOV</Surname>
  </PersonName>
</AdvancePassenger>
```
{{< /details >}}

{{< details title="Пример отправки паспорта для младенца без места (привязывается к сопровождающему взрослому пассажиру с номером 1.1)" open=true >}}
```XML
<AdvancePassenger SegmentNumber="A">
  <Document ExpirationDate="2017-04-15" Number="1234567890" Type="P">
    <IssueCountry>RU</IssueCountry>
    <NationalityCountry>RU</NationalityCountry>
  </Document>
  <PersonName DateOfBirth="2015-02-20" DocumentHolder="false" Gender="FI" NameNumber="1.1">
    <GivenName>EKATERINA</GivenName>
    <MiddleName>IVANOVNA</MiddleName>
    <Surname>IVANOVA</Surname>
  </PersonName>
</AdvancePassenger>
```
{{< /details >}}

#### Данные для идентификации личности (SSR FOID)

Некоторые перевозчики требуют отправки дополнительных данных для идентификации личности (SSR с кодом ```FOID```). Для этого необходимо добавить элемент ```/PassengerDetailsRQ/SpecialReqDetails/SpecialServiceRQ/SpecialServiceInfo/Service``` со следующими данными:
- ```/@SegmentNumber``` — номер сегмента, к которому будет привязаны данные. Опциональное поле. Возможные значения:
    - номер сегмента (например, ```3```)
    - ```A``` для всех сегментов
- ```/@SSR_Code``` — код SSR. Указывается значение ```FOID```
- ```/PersonName/NameNumber``` — номер пассажира в бронировании (для младенцев указывается их номер)
- ```/Text``` — текст сообщения. Большинство перевозчиков требуют данные в формате ```PP[код страны гражданства][номер паспорта]```

{{< details title="Пример" open=true >}}
```XML
<Service SSR_Code="FOID">
  <PersonName NameNumber="1.1"/>
  <Text>PPRU1234567890</Text>
</Service>
```
{{< /details >}}

#### Визовая информация (SSR DOCO)

В некоторых случаях перевозчики требуют отправки визовой информации (SSR с кодом ```DOCO```). Для этого необходимо добавить элемент ```/PassengerDetailsRQ/SpecialReqDetails/SpecialServiceRQ/SpecialServiceInfo/AdvancePassenger``` со следующими данными:
- ```/@SegmentNumber``` — номер сегмента, к которому будет привязаны данные. Опциональное поле. Возможные значения:
    - номер сегмента (например, ```3```)
    - ```A``` для всех сегментов
- ```/Document/@Type``` — тип документа (всегда указывается значение ```V```)
- ```/Document/@Number``` — номер визы
- ```/Document/Visa/@ExpirationDate``` — дата окончания действия визы
- ```/Document/Visa/@IssueDate``` — дата получения визы
- ```/Document/Visa/ApplicableCountry``` — код страны действия визы
- ```/Document/Visa/PlaceOfBirth``` — место рождения (город и код страны, например ```MOSCOW RU```)
- ```/Document/Visa/PlaceOfIssue``` — место получения визы (город и код страны)
- ```/PersonName/@NameNumber``` — номер пассажира визы бронировании

{{< details title="Пример" open=true >}}
```XML
<AdvancePassenger SegmentNumber="A">
  <Document Number="1234567890" Type="V">
    <Visa IssueDate="2016-12-20">
      <ApplicableCountry>US</ApplicableCountry>
      <PlaceOfBirth>SAMARA RU</PlaceOfBirth>
      <PlaceOfIssue>MOSCOW RU</PlaceOfIssue>
    </Visa>
  </Document>
  <PersonName NameNumber="1.1"/>
</AdvancePassenger>
```
{{< /details >}}

#### Данные о месте пребывания или проживания в стране назначения (SSR DOCA)

В некоторых случаях перевозчики требуют отправки данных о месте пребывания или проживания в стране назначения  (SSR с кодом ```DOCA```). Для этого необходимо добавить элемент ```/PassengerDetailsRQ/SpecialReqDetails/SpecialServiceRQ/SpecialServiceInfo/AdvancePassenger``` со следующими данными:
- ```/@SegmentNumber``` — номер сегмента, к которому будет привязаны данные. Опциональное поле. Возможные значения:
    - номер сегмента (например, ```3```)
    - ```A``` для всех сегментов
- ```/ResidentDestinationAddress/@Type``` — тип. Возможные значения:
    - ```D``` — адрес пребывания (destination)
    - ```R``` — адрес проживания (resident)
- ```/ResidentDestinationAddress/City``` — город
- ```/ResidentDestinationAddress/Country``` — код страны
- ```/ResidentDestinationAddress/Street``` — адрес
- ```/ResidentDestinationAddress/State``` — код штата или провинции
- ```/ResidentDestinationAddress/Zip``` — индекс
- ```/PersonName/@NameNumber``` — номер пассажира в бронировании

{{< details title="Пример" open=true >}}
```XML
<AdvancePassenger SegmentNumber="A">
  <PersonName NameNumber="1.1"/>
  <ResidentDestinationAddress Type="D">
    <City>LONDON</City>
    <Country>GB</Country>
    <Street>10 DOWNING STREET</Street>
    <State>EN</State>
    <Zip>7A1 H3P</Zip>
  </ResidentDestinationAddress>
</AdvancePassenger>
```
{{< /details >}}

#### Данные о младенцах (SSR INFT)

При добавлении в бронирование младенцев без места требуется отправка специального сообщения (SSR с кодом ```INFT```). Для этого необходимо добавить элемент ```/PassengerDetailsRQ/SpecialReqDetails/SpecialServiceRQ/SpecialServiceInfo/Service``` со следующими данными:
- ```/@SegmentNumber``` — номер сегмента, к которому будет привязаны данные. Опциональное поле. Возможные значения:
    - номер сегмента (например, ```3```)
    - ```A``` для всех сегментов
- ```/@SSR_Code``` — код SSR. Указывается значение ```INFT```
- ```/PersonName/NameNumber``` — номер сопровождающего взрослого пассажира
- ```/Text``` — текст сообщения в формате ```[фамилия (как при добавлении пассажира)]/[имя (как при добавлении пассажира, включая титул)]/[дата рождения в формате ДДМММГГ]```

{{< hint warning >}}
Обратите внимание на то, что система не разрешает сохранение бронирования с младенцами без места без отправки SSR с кодом ```INFT``` для каждого младенца без места. Одного взрослого пассажира может сопровождать только один младенец без места.
{{< /hint >}}

{{< details title="Пример" open=true >}}
```XML
<Service SSR_Code="INFT">
  <PersonName NameNumber="1.1"/>
  <Text>IVANOVA/EKATERINA/20FEB16</Text>
</Service>
```
{{< /details >}}

#### Данные о детях (SSR CHLD)

При добавлении в бронирование детей некоторые перевозчики требуют добавление специального сообщения (SSR с кодом ```CHLD```). Для этого необходимо добавить элемент ```/PassengerDetailsRQ/SpecialReqDetails/SpecialServiceRQ/SpecialServiceInfo/Service``` со следующими данными:
- ```/@SegmentNumber``` — номер сегмента, к которому будет привязаны данные. Опциональное поле. Возможные значения:
    - номер сегмента (например, ```3```)
    - ```A``` для всех сегментов
- ```/@SSR_Code``` — код SSR. Указывается значение ```CHLD```
- ```/PersonName/NameNumber``` — номер пассажира в бронировании
- ```/Text``` — текст сообщения с датой рождения ребенка в формате ```ДДМММГГ```

{{< details title="Пример" open=true >}}
```XML
<Service SSR_Code="CHLD">
  <PersonName NameNumber="3.1"/>
  <Text>15JAN10</Text>
</Service>
```
{{< /details >}}

#### Контактные данные (SSR CTCE/CTCM/CTCR)

Номер телефона пассажира может быть добавлен в бронирование и отправлен в виде SSR сообщения с кодом ```CTCM```. Для этого необходимо добавить элемент ```/PassengerDetailsRQ/SpecialReqDetails/SpecialServiceRQ/SpecialServiceInfo/Service``` со следующими данными:
- ```/@SegmentNumber``` — номер сегмента, к которому будет привязаны данные. Опциональное поле. Возможные значения:
    - номер сегмента (например, ```3```)
    - ```A``` для всех сегментов
- ```/@SSR_Code``` — код SSR. Указывается значение ```CTCM```
- ```/PersonName/NameNumber``` — номер пассажира в бронировании
- ```/Text``` — номер телефона пассажира (только цифры). Опционально можно добавить двухбуквенный код предпочтительного для пассажира языка общения после символа ```/```, например ```/RU``` для русского языка.

{{< details title="Пример" open=true >}}
```XML
<Service SSR_Code="CTCM">
  <PersonName NameNumber="1.1"/>
  <Text>79851234567/RU</Text>
</Service>
```
{{< /details >}}

Адрес электронной почты может быть добавлен в бронирование и отправлен в виде SSR сообщения с кодом ```CTCE```. Для этого необходимо добавить элемент ```/PassengerDetailsRQ/SpecialReqDetails/SpecialServiceRQ/SpecialServiceInfo/Service``` со следующими данными:
- ```/@SegmentNumber``` — номер сегмента, к которому будет привязаны данные. Опциональное поле. Возможные значения:
    - номер сегмента (например, ```3```)
    - ```A``` для всех сегментов
- ```/@SSR_Code``` — код SSR. Указывается значение ```CTCE```
- ```/PersonName/NameNumber``` — номер пассажира в бронировании
- ```/Text``` — адрес электронной почты пассажира (только буквы, цифры и знак ```.```). Опционально можно добавить двухбуквенный код предпочтительного для пассажира языка общения после символа ```/```, например ```/RU``` для русского языка. Для замены спецсимволов в адресе необходимо провести следующие замены:
    - ```//``` вместо ```@```
    - ```..``` вместо ```_```
    - ```./``` вместо ```-```

{{< details title="Пример" open=true >}}
```XML
<Service SSR_Code="CTCE">
  <PersonName NameNumber="1.1"/>
  <Text>CUSTOMER//CUSTOMER.COM/RU</Text>
</Service>
```
{{< /details >}}

В случае отказа пассажира от передачи контактных данных, необходимо передать SSR сообщение с кодом ```CTCR```. Для этого необходимо добавить элемент ```/PassengerDetailsRQ/SpecialReqDetails/SpecialServiceRQ/SpecialServiceInfo/Service``` со следующими данными:
- ```/@SegmentNumber``` — номер сегмента, к которому будет привязаны данные. Опциональное поле. Возможные значения:
    - номер сегмента (например, ```3```)
    - ```A``` для всех сегментов
- ```/@SSR_Code``` — код SSR. Указывается значение ```CTCE```
- ```/PersonName/NameNumber``` — номер пассажира в бронировании
- ```/Text``` — сообщение об отказе предоставления контактной информации, например ```REFUSED```

{{< details title="Пример" open=true >}}
```XML
<Service SSR_Code="CTCR">
  <PersonName NameNumber="1.1"/>
  <Text>REFUSED</Text>
</Service>
```
{{< /details >}}

#### Другие SSR сообщения

Для отправки других SSR (Special Service Request) сообщений необходимо добавить элемент ```/PassengerDetailsRQ/SpecialReqDetails/SpecialServiceRQ/SpecialServiceInfo/Service``` со следующими данными:
- ```/@SegmentNumber``` — номер сегмента, к которому будет привязаны данные. Опциональное поле. Возможные значения:
    - номер сегмента (например, ```3```)
    - ```A``` для всех сегментов
- ```/@SSR_Code``` — код SSR
- ```/PersonName/NameNumber``` — номер пассажира
- ```/Text``` — текст сообщения

{{< details title="Пример" open=true >}}
```XML
<Service SSR_Code="OTHS">
  <PersonName NameNumber="1.1"/>
  <Text>SSR TEXT HERE</Text>
</Service>
```
{{< /details >}}

#### OSI сообщения

Для отправки OSI (Other Service Information) сообщений необходимо добавить элемент ```/PassengerDetailsRQ/SpecialReqDetails/SpecialServiceRQ/SpecialServiceInfo/Service``` со следующими данными:
- ```/VendorPrefs/Airline/@Code``` — код перевозчика
- ```/@SSR_Code``` — код сообщения. Всегда ```OSI```
- ```/PersonName/NameNumber``` — номер пассажира
- ```/Text``` — текст сообщения

{{< details title="Пример" open=true >}}
```XML
<Service SSR_Code="OSI">
  <Text>OSI TEXT</Text>
  <VendorPrefs>
    <Airline Code="SU"/>
  </VendorPrefs>
</Service>
```
{{< /details >}}

### Добавление ремарок

Ремарки — дополнительная текстовая информация, которая может быть добавлена в бронирование. Ремарк могут содержать буквы латинского алфавита, цифры, пробелы, символы ```-```, ```.``` и ```,```. Длина каждой ремарки не может превышать 70 символов. В одном запросе можно передать не более 98 ремарок. Общее число ремарок не должно превышать 999 штук.

Для каждой ремарки необходимо добавление элемента ```/PassengerDetailsRQ/SpecialReqDetails/AddRemarkRQ/RemarkInfo/Remark```:
- ```/@Type``` — тип ремарки. Всегда ```General```
- ```/Text``` — текст ремарки

{{< details title="Пример" open=true >}}
```XML
<Remark Type="General">
  <Text>TEST REMARK</Text>
</Remark>
```
{{< /details >}}

### Установка тайм-лимита

При создании бронирования необходимо установить тайм-лимит бронирования в элементе ```/PassengerDetailsRQ/TravelItineraryAddInfoRQ/AgencyInfo/Ticketing```.

Обязательно требуется указать:
- ```/@TicketType``` — тип тайм-лимита:
    - ```7TAW``` — бронирование готово к оформлению билетов
    - ```7TAX``` — бронирование **не** готово к оформлению билетов
    - ```7T-A``` — тайм-лимит не установлен (бронирование не попадет в очередь при наступлении времени тайм-лимита)

Дополнительно можно указать:
- ```/@PseudoCityCode``` — PCC, в очередь в котором должно быть помещено бронирование 
- ```/@QueueNumber``` — номер очереди, в которую должно быть помещено бронирование в случае наступления тайм-лимита
- ```/@TicketTimeLimit``` — время наступления тайм-лимита

Установленное время наступления тайм-лимита должно отвечать следующим требованиям:
- не быть раньше, чем текущее время
- не быть позже, чем время вылета для самого раннего сегмента в бронировании
- быть кратным одному часу. Например: ```01-31T23:00```

Если в запросе не было указано время тайм-лимита или время тайм-лимита меньше, чем через 2 часа, то бронирование будет перемещено в очередь немедленно. В противном случае бронирование будет помещено в очередь при наступлении тайм-лимита.

По умолчанию при наступлении тайм-лимита бронирование будет помещено в 9 (для ```7TAW```) или 10 (для ```7TAX```) очередь. В случае, если была указана другая очередь, то бронирование попадет в нее.

По умолчанию бронирование помещено в очередь в том PCC, в котором оно было создано. В случае, если был указан другой PCC, то бронирование попадет в очередь в этом PCC.

Подробнее о тайм-лимите бронирований см. в разделе [Тайм-лимиты бронирований](timelimit.html).

### Завершающая обработка бронирования

#### Игнорирование бронирования

В некоторых случаях может пригодиться возможность игнорирования бронирования после успешного выполнения всех предыдущих операций без сохранения бронирования. Для этого необходимо указать значение ```true``` у атрибута ```/PassengerDetailsRQ/PostProcessing/@ignoreAfter```. При создании бронирования не требуется указывать этот атрибут.

#### Чтение бронирования

Сервис позволяет прочитать полученное бронирование после успешного завершения работы всех предыдущих операций (включая сохранение бронирования) и вернуть его содержимое в ответе. Для этого необходимо добавить элемент ```/PassengerDetailsRQ/PostProcessing/RedisplayReservation```.

#### Добавление наземных сегментов

В Sabre все сегменты в бронировании должны идти последовательно без разрывов, т.е. город отправления (**не аэропорт!**) следующего сегмента должен быть равен городу прибытия предыдущего сегмента. Если в бронировании есть разрывы, то необходимо вставить специальные наземные сегменты — ARUNK (Arrival Unknown).

В процессе создания бронирования в 2 шага наземные сегменты могут быть добавлены в бронирование в двух местах:
- до момента расчета стоимости в запросе к сервису EnhancedAirBookRQ (см. описание выше)
- после момента расчета стоимости в запросе к сервису PassengerDetailsRQ

Для добавления наземных сегментов в сервисе PassengerDetailsRQ необходимо добавить в запрос элемент ```/PassengerDetailsRQ/PostProcessing/ARUNK_RQ```. Этот элемент можно указывать во всех запросах. Если наземный сегмент не требуется, то он просто не будет вставлен в бронирование, при этом выполнение запроса не прервется.

#### Сохранение бронирования

Для сохранения бронирования требуется добавить в запрос элемент ```/PassengerDetailsRQ/PostProcessing/EndTransactionRQ```:
- ```/EndTransaction/@Ind``` — признак сохранения бронирования. Не требуется, если бронирование должно быть помещено в очередь (см. ниже)
- ```/Source/@ReceivedFrom``` — значения поля Received From. Используется для идентификации инициатора изменений в истории бронирования

#### Помещение бронирования в очередь

Сервис позволяет поместить бронирование в очередь после сохранения бронирования. Для этого требуется добавить элемент ```/PassengerDetailsRQ/PostProcessing/QueuePlaceRQ/QueueInfo/QueueIdentifier``` со следующими атрибутами:
- ```/@Number``` — номер очереди
- ```/@PseudoCityCode``` — PCC (опционально)

По умолчанию бронирование попадет в очередь в том PCC, в котором было создано бронирование. Для помещения бронирования в очередь в другом PCC требуется наличие между двумя PCC Branch Access. Подробнее о Branch Access см. в разделе [Конфигурация Sabre](configuration.html).

{{< details title="Пример" open=true >}}
```XML
<QueueInfo>
  <QueueIdentifier Number="100" PseudoCityCode="8XFG"/>
</QueueInfo>
```
{{< /details >}}

Для отправки бронирования в несколько очередей необходимо добавить элементы ```QueueIdentifier``` с указанными выше атрибутами для каждой очереди внутри элемента ```/PassengerDetailsRQ/PostProcessing/QueuePlaceRQ/MultiQueuePlace```.

{{< details title="Пример" open=true >}}
```XML
<MultiQueuePlace>
  <QueueIdentifier Number="100" PseudoCityCode="8XFG"/>
  <QueueIdentifier Number="101" PseudoCityCode="8XFG"/>
  <QueueIdentifier Number="102" PseudoCityCode="8XFG"/>
</MultiQueuePlace>
```
{{< /details >}}

### Пример

{{< details title="Пример запроса" >}}
```XML
<PassengerDetailsRQ haltOnError="true" ignoreOnError="false" version="3.4.0" xmlns="http://services.sabre.com/sp/pd/v3_4">
  <PostProcessing ignoreAfter="false">
    <RedisplayReservation/>
    <EndTransactionRQ>
      <EndTransaction Ind="true"/>
      <Source ReceivedFrom="API"/>
    </EndTransactionRQ>
  </PostProcessing>
  <PriceQuoteInfo>
    <Link nameNumber="1.1" record="1"/>
    <Link nameNumber="2.1" record="1"/>
    <Link nameNumber="3.1" record="2"/>
    <Link nameNumber="4.1" record="3"/>
  </PriceQuoteInfo>
  <SpecialReqDetails>
    <AddRemarkRQ>
      <RemarkInfo>
        <Remark Type="General">
          <Text>TEXT REMARK</Text>
        </Remark>
      </RemarkInfo>
    </AddRemarkRQ>
    <SpecialServiceRQ>
      <SpecialServiceInfo>
        <AdvancePassenger SegmentNumber="A">
          <Document ExpirationDate="2025-11-20" Number="1234567890" Type="P">
            <IssueCountry>RU</IssueCountry>
            <NationalityCountry>RU</NationalityCountry>
          </Document>
          <PersonName DateOfBirth="1980-11-20" DocumentHolder="true" Gender="M" NameNumber="1.1">
            <GivenName>IVAN</GivenName>
            <MiddleName>IVANOVICH</MiddleName>
            <Surname>IVANOV</Surname>
          </PersonName>
        </AdvancePassenger>
        <AdvancePassenger SegmentNumber="A">
          <Document ExpirationDate="2025-08-15" Number="2234567890" Type="P">
            <IssueCountry>RU</IssueCountry>
            <NationalityCountry>RU</NationalityCountry>
          </Document>
          <PersonName DateOfBirth="1980-01-20" DocumentHolder="false" Gender="F" NameNumber="2.1">
            <GivenName>ELENA</GivenName>
            <MiddleName>IVANOVNA</MiddleName>
            <Surname>IVANOVA</Surname>
          </PersonName>
        </AdvancePassenger>
        <AdvancePassenger SegmentNumber="A">
          <Document ExpirationDate="2025-11-20" Number="3234567890" Type="P">
            <IssueCountry>RU</IssueCountry>
            <NationalityCountry>RU</NationalityCountry>
          </Document>
          <PersonName DateOfBirth="2012-01-15" DocumentHolder="false" Gender="M" NameNumber="3.1">
            <GivenName>ANDREY</GivenName>
            <MiddleName>IVANOVICH</MiddleName>
            <Surname>IVANOV</Surname>
          </PersonName>
        </AdvancePassenger>
        <AdvancePassenger SegmentNumber="A">
          <Document ExpirationDate="2025-04-15" Number="1234567890" Type="P">
            <IssueCountry>RU</IssueCountry>
            <NationalityCountry>RU</NationalityCountry>
          </Document>
          <PersonName DateOfBirth="2022-02-20" DocumentHolder="false" Gender="FI" NameNumber="1.1">
            <GivenName>EKATERINA</GivenName>
            <MiddleName>IVANOVNA</MiddleName>
            <Surname>IVANOVA</Surname>
          </PersonName>
        </AdvancePassenger>
        <Service SSR_Code="INFT">
          <PersonName NameNumber="1.1"/>
          <Text>IVANOVA/EKATERINA/20FEB22</Text>
        </Service>
        <Service SSR_Code="CTCM">
          <PersonName NameNumber="1.1"/>
          <Text>79851234567/RU</Text>
        </Service>
        <Service SSR_Code="CTCE">
          <PersonName NameNumber="1.1"/>
          <Text>CUSTOMER//CUSTOMER.COM/RU</Text>
        </Service>
      </SpecialServiceInfo>
    </SpecialServiceRQ>
  </SpecialReqDetails>
  <TravelItineraryAddInfoRQ>
    <AgencyInfo>
      <Ticketing TicketType="7TAW"/>
    </AgencyInfo>
    <CustomerInfo>
      <ContactNumbers>
        <ContactNumber Phone="74991234567" PhoneUseType="A"/>
        <ContactNumber Phone="79851234567" PhoneUseType="M"/>
      </ContactNumbers>
      <Email Address="customer@customer.com" NameNumber="1.1" Type="TO"/>
      <Email Address="agency@agency.com" Type="BC"/>
      <PersonName NameNumber="1.1" PassengerType="ADT">
        <GivenName>IVAN MR</GivenName>
        <Surname>IVANOV</Surname>
      </PersonName>
      <PersonName NameNumber="2.1" PassengerType="ADT">
        <GivenName>ELENA MS</GivenName>
        <Surname>IVANOVA</Surname>
      </PersonName>
      <PersonName NameNumber="3.1" PassengerType="CNN">
        <GivenName>ANDREY</GivenName>
        <Surname>IVANOV</Surname>
      </PersonName>
      <PersonName Infant="true" NameNumber="4.1" PassengerType="INF">
        <GivenName>EKATERINA</GivenName>
        <Surname>IVANOVA</Surname>
      </PersonName>
    </CustomerInfo>
  </TravelItineraryAddInfoRQ>
</PassengerDetailsRQ>
```
{{< /details >}}

{{< details title="Пример ответа" >}}
```XML
<PassengerDetailsRS xmlns="http://services.sabre.com/sp/pd/v3_4">
  <ApplicationResults status="Complete" xmlns="http://services.sabre.com/STL_Payload/v02_01" xmlns:ns10="http://services.sabre.com/essm/session/v1" xmlns:ns11="http://services.sabre.com/STL_Header/v02_01" xmlns:ns12="http://webservices.sabre.com/servicesplatform/eiapi/1.0.0" xmlns:ns13="http://www.OpenTravel.org/ns/OTA2/AppInfo_v01_00" xmlns:ns14="http://services.sabre.com/sp/preferences/v1" xmlns:ns15="http://services.sabre.com/STL/v01" xmlns:ns16="http://services.sabre.com/ssse/trace/v01" xmlns:ns2="http://services.sabre.com/essm/diagnostic/v1" xmlns:ns3="http://services.sabre.com/essm/core/v1" xmlns:ns4="http://opentravel.org/common/message/v02" xmlns:ns5="http://opentravel.org/common/v02" xmlns:ns6="http://services.sabre.com/STL_Payload/v02_02" xmlns:ns7="http://services.sabre.com/sp/ssp/v1" xmlns:ns8="http://services.sabre.com/STL_Header/v02_02" xmlns:ns9="http://services.sabre.com/STL_Header/v120">
    <Success timeStamp="2022-05-20T04:56:40.141-05:00"/>
    <Warning timeStamp="2022-05-20T04:56:39.733-05:00" type="BusinessLogic">
      <SystemSpecificResults>
        <Message code="WARN.SWS.HOST.WARNING_RESPONSE">EndTransactionLLSRQ: TTY REQ PEND</Message>
      </SystemSpecificResults>
    </Warning>
  </ApplicationResults>
  <ItineraryRef ID="TFPSFW"/>
  <TravelItineraryReadRS>
    <TravelItinerary>
      <CustomerInfo>
        <ContactNumbers>
          <ContactNumber Id="18" LocationCode="MOW" Phone="74991234567-A" RPH="001"/>
          <ContactNumber Id="19" LocationCode="MOW" Phone="79851234567-M" RPH="002"/>
        </ContactNumbers>
        <PersonName NameNumber="01.01" PassengerType="ADT" RPH="1" WithInfant="false" elementId="pnr-7.1">
          <Email Comment="BC/" Id="17" Type="BC">AGENCY@AGENCY.COM</Email>
          <Email Comment="TO/" Id="16" Type="TO">CUSTOMER@CUSTOMER.COM</Email>
          <GivenName>IVAN MR</GivenName>
          <Surname>IVANOV</Surname>
        </PersonName>
        <PersonName NameNumber="02.01" PassengerType="ADT" RPH="2" WithInfant="false" elementId="pnr-9.2">
          <Email Comment="BC/" Id="17" Type="BC">AGENCY@AGENCY.COM</Email>
          <GivenName>ELENA MS</GivenName>
          <Surname>IVANOVA</Surname>
        </PersonName>
        <PersonName NameNumber="03.01" PassengerType="CNN" RPH="3" WithInfant="false" elementId="pnr-11.3">
          <Email Comment="BC/" Id="17" Type="BC">AGENCY@AGENCY.COM</Email>
          <GivenName>ANDREY</GivenName>
          <Surname>IVANOV</Surname>
        </PersonName>
        <PersonName NameNumber="04.01" PassengerType="INF" RPH="4" WithInfant="true" elementId="pnr-13.4">
          <Email Comment="BC/" Id="17" Type="BC">AGENCY@AGENCY.COM</Email>
          <GivenName>EKATERINA</GivenName>
          <Surname>IVANOVA</Surname>
        </PersonName>
      </CustomerInfo>
      <ItineraryInfo>
        <ItineraryPricing>
          <PriceQuote RPH="1">
            <MiscInformation>
              <SignatureLine ExpirationDateTime="00:00" Source="SYS" Status="ACTIVE">
                <Text>9LSC 9LSC*AWT 1256/20MAY22</Text>
              </SignatureLine>
            </MiscInformation>
            <PricedItinerary DisplayOnly="false" InputMessage="WPAEY¥P2ADT/1CNN/1INF¥MP-I¥BRYF¥RQ" RPH="1" StatusCode="A" StoredDateTime="2022-05-20T12:56" TaxExempt="false" ValidatingCarrier="EY">
              <AirItineraryPricingInfo>
                <ItinTotalFare>
                  <BaseFare Amount="4099.00" CurrencyCode="AUD"/>
                  <EquivFare Amount="184455" CurrencyCode="RUB"/>
                  <Taxes>
                    <Tax Amount="18041" TaxCode="XT"/>
                    <TaxBreakdownCode TaxPaid="false">2700AU</TaxBreakdownCode>
                    <TaxBreakdownCode TaxPaid="false">2816WY</TaxBreakdownCode>
                    <TaxBreakdownCode TaxPaid="false">174ZR</TaxBreakdownCode>
                    <TaxBreakdownCode TaxPaid="false">1216F6</TaxBreakdownCode>
                    <TaxBreakdownCode TaxPaid="false">6678GB</TaxBreakdownCode>
                    <TaxBreakdownCode TaxPaid="false">4457UB</TaxBreakdownCode>
                  </Taxes>
                  <TotalFare Amount="202496" CurrencyCode="RUB"/>
                  <Totals>
                    <BaseFare Amount="8198.00"/>
                    <EquivFare Amount="368910"/>
                    <Taxes>
                      <Tax Amount="36082"/>
                    </Taxes>
                    <TotalFare Amount="404992"/>
                  </Totals>
                </ItinTotalFare>
                <PassengerTypeQuantity Code="ADT" Quantity="02"/>
                <PTC_FareBreakdown>
                  <Endorsements>
                    <Endorsement type="PRICING_PARAMETER">
                      <Text>WPAEY$P2ADT/1CNN/1INF$MP-I$BRYF$RQ</Text>
                    </Endorsement>
                    <Endorsement type="WARNING">
                      <Text>VALIDATING CARRIER SPECIFIED</Text>
                    </Endorsement>
                    <Endorsement type="WARNING">
                      <Text>BSP - EY</Text>
                    </Endorsement>
                    <Endorsement type="WARNING">
                      <Text>TCH - EY</Text>
                    </Endorsement>
                    <Endorsement type="WARNING">
                      <Text>CHG BEF DEP UP TO RUB1XXX0/CHG AFT DEP UP TO RUB1XXX0/REF BEF</Text>
                    </Endorsement>
                    <Endorsement type="WARNING">
                      <Text>DEP UP TO RUB0/REF AFT DEP UP TO RUB0/SEE RULES</Text>
                    </Endorsement>
                    <Endorsement type="SYSTEM_ENDORSEMENT">
                      <Text>NON ENDO/ REF</Text>
                    </Endorsement>
                  </Endorsements>
                  <FareBasis Code="YLWF2AU/YLWF2AU/YLXF2AU/YLXF2AU"/>
                  <FareCalculation>
                    <Text>SYD EY X/AUH EY LON Q25.00 1531.08EY X/AUH Q25.00EY SYD1504.72NUC3085.80END ROE1.328146</Text>
                  </FareCalculation>
                  <FareSource>ATPC</FareSource>
                  <FlightSegment ConnectionInd="O" DepartureDateTime="12-01T23:25" FlightNumber="2463" ResBookDesigCode="Y" SegmentNumber="1" Status="OK">
                    <BaggageAllowance Number="35K"/>
                    <FareBasis Code="YLWF2AU"/>
                    <MarketingAirline Code="EY" FlightNumber="2463"/>
                    <OriginLocation LocationCode="SYD"/>
                    <ValidityDates>
                      <NotValidAfter>2022-12-01</NotValidAfter>
                      <NotValidBefore>2022-12-01</NotValidBefore>
                    </ValidityDates>
                  </FlightSegment>
                  <FlightSegment ConnectionInd="X" DepartureDateTime="12-02T10:35" FlightNumber="25" ResBookDesigCode="Y" SegmentNumber="2" Status="OK">
                    <BaggageAllowance Number="35K"/>
                    <FareBasis Code="YLWF2AU"/>
                    <MarketingAirline Code="EY" FlightNumber="25"/>
                    <OriginLocation LocationCode="AUH"/>
                    <ValidityDates>
                      <NotValidAfter>2022-12-02</NotValidAfter>
                      <NotValidBefore>2022-12-02</NotValidBefore>
                    </ValidityDates>
                  </FlightSegment>
                  <FlightSegment ConnectionInd="O" DepartureDateTime="12-08T08:30" FlightNumber="12" ResBookDesigCode="Y" SegmentNumber="3" Status="OK">
                    <BaggageAllowance Number="35K"/>
                    <FareBasis Code="YLXF2AU"/>
                    <MarketingAirline Code="EY" FlightNumber="12"/>
                    <OriginLocation LocationCode="LHR"/>
                    <ValidityDates>
                      <NotValidAfter>2022-12-08</NotValidAfter>
                      <NotValidBefore>2022-12-08</NotValidBefore>
                    </ValidityDates>
                  </FlightSegment>
                  <FlightSegment ConnectionInd="X" DepartureDateTime="12-08T22:10" FlightNumber="464" ResBookDesigCode="Y" SegmentNumber="4" Status="OK">
                    <BaggageAllowance Number="35K"/>
                    <FareBasis Code="YLXF2AU"/>
                    <MarketingAirline Code="EY" FlightNumber="464"/>
                    <OriginLocation LocationCode="AUH"/>
                    <ValidityDates>
                      <NotValidAfter>2022-12-08</NotValidAfter>
                      <NotValidBefore>2022-12-08</NotValidBefore>
                    </ValidityDates>
                  </FlightSegment>
                  <FlightSegment>
                    <OriginLocation LocationCode="SYD"/>
                  </FlightSegment>
                  <FareComponent Amount="153108" FareBasisCode="YLWF2AU" FareComponentNumber="1" FareDirectionality="FROM" GoverningCarrier="EY" TicketDesignator="">
                    <Location Destination="LON" Origin="SYD"/>
                    <Dates ArrivalDateTime="12-02T14:10" DepartureDateTime="12-01T23:25"/>
                    <FlightSegmentNumbers>
                      <FlightSegmentNumber>1</FlightSegmentNumber>
                      <FlightSegmentNumber>2</FlightSegmentNumber>
                    </FlightSegmentNumbers>
                  </FareComponent>
                  <FareComponent Amount="150472" FareBasisCode="YLXF2AU" FareComponentNumber="2" FareDirectionality="TO" GoverningCarrier="EY" TicketDesignator="">
                    <Location Destination="SYD" Origin="LON"/>
                    <Dates ArrivalDateTime="12-09T17:55" DepartureDateTime="12-08T08:30"/>
                    <FlightSegmentNumbers>
                      <FlightSegmentNumber>3</FlightSegmentNumber>
                      <FlightSegmentNumber>4</FlightSegmentNumber>
                    </FlightSegmentNumbers>
                  </FareComponent>
                </PTC_FareBreakdown>
              </AirItineraryPricingInfo>
            </PricedItinerary>
            <ResponseHeader>
              <Text>FARE - PRICE RETAINED</Text>
              <Text>FARE NOT GUARANTEED UNTIL TICKETED</Text>
            </ResponseHeader>
            <PriceQuotePlus DiscountAmount="0" DisplayOnly="false" DomesticIntlInd="I" IT_BT_Fare="BT" ItineraryChanged="false" ManualFare="false" NUCSuppresion="false" NegotiatedFare="false" PricingStatus="S" SubjToGovtApproval="false" SystemIndicator="S" VerifyFareCalc="false">
              <PassengerInfo PassengerType="ADT">
                <PassengerData NameNumber="01.01">IVANOV/IVAN MR</PassengerData>
                <PassengerData NameNumber="02.01">IVANOVA/ELENA MS</PassengerData>
              </PassengerInfo>
              <TicketingInstructionsInfo/>
            </PriceQuotePlus>
          </PriceQuote>
          <PriceQuote RPH="2">
            <MiscInformation>
              <SignatureLine ExpirationDateTime="00:00" Source="SYS" Status="ACTIVE">
                <Text>9LSC 9LSC*AWT 1256/20MAY22</Text>
              </SignatureLine>
            </MiscInformation>
            <PricedItinerary DisplayOnly="false" InputMessage="WPAEY¥P2ADT/1CNN/1INF¥MP-I¥BRYF¥RQ" RPH="2" StatusCode="A" StoredDateTime="2022-05-20T12:56" TaxExempt="false" ValidatingCarrier="EY">
              <AirItineraryPricingInfo>
                <ItinTotalFare>
                  <BaseFare Amount="3091.00" CurrencyCode="AUD"/>
                  <EquivFare Amount="139095" CurrencyCode="RUB"/>
                  <Taxes>
                    <Tax Amount="8663" TaxCode="XT"/>
                    <TaxBreakdownCode TaxPaid="false">2816WY</TaxBreakdownCode>
                    <TaxBreakdownCode TaxPaid="false">174ZR</TaxBreakdownCode>
                    <TaxBreakdownCode TaxPaid="false">1216F6</TaxBreakdownCode>
                    <TaxBreakdownCode TaxPaid="false">4457UB</TaxBreakdownCode>
                  </Taxes>
                  <TotalFare Amount="147758" CurrencyCode="RUB"/>
                  <Totals>
                    <BaseFare Amount="3091.00"/>
                    <EquivFare Amount="139095"/>
                    <Taxes>
                      <Tax Amount="8663"/>
                    </Taxes>
                    <TotalFare Amount="147758"/>
                  </Totals>
                </ItinTotalFare>
                <PassengerTypeQuantity Code="CNN" Quantity="01"/>
                <PTC_FareBreakdown>
                  <Endorsements>
                    <Endorsement type="PRICING_PARAMETER">
                      <Text>WPAEY$P2ADT/1CNN/1INF$MP-I$BRYF$RQ</Text>
                    </Endorsement>
                    <Endorsement type="WARNING">
                      <Text>VALIDATING CARRIER SPECIFIED</Text>
                    </Endorsement>
                    <Endorsement type="WARNING">
                      <Text>BSP - EY</Text>
                    </Endorsement>
                    <Endorsement type="WARNING">
                      <Text>TCH - EY</Text>
                    </Endorsement>
                    <Endorsement type="WARNING">
                      <Text>CHG BEF DEP UP TO RUB1XXX0/CHG AFT DEP UP TO RUB1XXX0/REF BEF</Text>
                    </Endorsement>
                    <Endorsement type="WARNING">
                      <Text>DEP UP TO RUB0/REF AFT DEP UP TO RUB0/SEE RULES</Text>
                    </Endorsement>
                    <Endorsement type="SYSTEM_ENDORSEMENT">
                      <Text>NON ENDO/ REF</Text>
                    </Endorsement>
                  </Endorsements>
                  <FareBasis Code="YLWF2AUCH/YLWF2AUCH/YLXF2AUCH/YLXF2AUCH"/>
                  <FareCalculation>
                    <Text>SYD EY X/AUH EY LON Q25.00 1148.31EY X/AUH Q25.00EY SYD1128.54NUC2326.85END ROE1.328146</Text>
                  </FareCalculation>
                  <FareSource>ATPC</FareSource>
                  <FlightSegment ConnectionInd="O" DepartureDateTime="12-01T23:25" FlightNumber="2463" ResBookDesigCode="Y" SegmentNumber="1" Status="OK">
                    <BaggageAllowance Number="35K"/>
                    <FareBasis Code="YLWF2AUCH"/>
                    <MarketingAirline Code="EY" FlightNumber="2463"/>
                    <OriginLocation LocationCode="SYD"/>
                    <ValidityDates>
                      <NotValidAfter>2022-12-01</NotValidAfter>
                      <NotValidBefore>2022-12-01</NotValidBefore>
                    </ValidityDates>
                  </FlightSegment>
                  <FlightSegment ConnectionInd="X" DepartureDateTime="12-02T10:35" FlightNumber="25" ResBookDesigCode="Y" SegmentNumber="2" Status="OK">
                    <BaggageAllowance Number="35K"/>
                    <FareBasis Code="YLWF2AUCH"/>
                    <MarketingAirline Code="EY" FlightNumber="25"/>
                    <OriginLocation LocationCode="AUH"/>
                    <ValidityDates>
                      <NotValidAfter>2022-12-02</NotValidAfter>
                      <NotValidBefore>2022-12-02</NotValidBefore>
                    </ValidityDates>
                  </FlightSegment>
                  <FlightSegment ConnectionInd="O" DepartureDateTime="12-08T08:30" FlightNumber="12" ResBookDesigCode="Y" SegmentNumber="3" Status="OK">
                    <BaggageAllowance Number="35K"/>
                    <FareBasis Code="YLXF2AUCH"/>
                    <MarketingAirline Code="EY" FlightNumber="12"/>
                    <OriginLocation LocationCode="LHR"/>
                    <ValidityDates>
                      <NotValidAfter>2022-12-08</NotValidAfter>
                      <NotValidBefore>2022-12-08</NotValidBefore>
                    </ValidityDates>
                  </FlightSegment>
                  <FlightSegment ConnectionInd="X" DepartureDateTime="12-08T22:10" FlightNumber="464" ResBookDesigCode="Y" SegmentNumber="4" Status="OK">
                    <BaggageAllowance Number="35K"/>
                    <FareBasis Code="YLXF2AUCH"/>
                    <MarketingAirline Code="EY" FlightNumber="464"/>
                    <OriginLocation LocationCode="AUH"/>
                    <ValidityDates>
                      <NotValidAfter>2022-12-08</NotValidAfter>
                      <NotValidBefore>2022-12-08</NotValidBefore>
                    </ValidityDates>
                  </FlightSegment>
                  <FlightSegment>
                    <OriginLocation LocationCode="SYD"/>
                  </FlightSegment>
                  <FareComponent Amount="114831" FareBasisCode="YLWF2AUCH" FareComponentNumber="1" FareDirectionality="FROM" GoverningCarrier="EY" TicketDesignator="">
                    <Location Destination="LON" Origin="SYD"/>
                    <Dates ArrivalDateTime="12-02T14:10" DepartureDateTime="12-01T23:25"/>
                    <FlightSegmentNumbers>
                      <FlightSegmentNumber>1</FlightSegmentNumber>
                      <FlightSegmentNumber>2</FlightSegmentNumber>
                    </FlightSegmentNumbers>
                  </FareComponent>
                  <FareComponent Amount="112854" FareBasisCode="YLXF2AUCH" FareComponentNumber="2" FareDirectionality="TO" GoverningCarrier="EY" TicketDesignator="">
                    <Location Destination="SYD" Origin="LON"/>
                    <Dates ArrivalDateTime="12-09T17:55" DepartureDateTime="12-08T08:30"/>
                    <FlightSegmentNumbers>
                      <FlightSegmentNumber>3</FlightSegmentNumber>
                      <FlightSegmentNumber>4</FlightSegmentNumber>
                    </FlightSegmentNumbers>
                  </FareComponent>
                </PTC_FareBreakdown>
              </AirItineraryPricingInfo>
            </PricedItinerary>
            <ResponseHeader>
              <Text>FARE - PRICE RETAINED</Text>
              <Text>FARE NOT GUARANTEED UNTIL TICKETED</Text>
            </ResponseHeader>
            <PriceQuotePlus DiscountAmount="0" DisplayOnly="false" DomesticIntlInd="I" IT_BT_Fare="BT" ItineraryChanged="false" ManualFare="false" NUCSuppresion="false" NegotiatedFare="false" PricingStatus="S" SubjToGovtApproval="false" SystemIndicator="S" VerifyFareCalc="false">
              <PassengerInfo PassengerType="CNN">
                <PassengerData NameNumber="03.01">IVANOV/ANDREY</PassengerData>
              </PassengerInfo>
              <TicketingInstructionsInfo/>
            </PriceQuotePlus>
          </PriceQuote>
          <PriceQuote RPH="3">
            <MiscInformation>
              <SignatureLine ExpirationDateTime="00:00" Source="SYS" Status="ACTIVE">
                <Text>9LSC 9LSC*AWT 1256/20MAY22</Text>
              </SignatureLine>
            </MiscInformation>
            <PricedItinerary DisplayOnly="false" InputMessage="WPAEY¥P2ADT/1CNN/1INF¥MP-I¥BRYF¥RQ" RPH="3" StatusCode="A" StoredDateTime="2022-05-20T12:56" TaxExempt="false" ValidatingCarrier="EY">
              <AirItineraryPricingInfo>
                <ItinTotalFare>
                  <BaseFare Amount="404.00" CurrencyCode="AUD"/>
                  <EquivFare Amount="18180" CurrencyCode="RUB"/>
                  <Taxes>
                    <Tax Amount="4457" TaxCode="UB"/>
                  </Taxes>
                  <TotalFare Amount="22637" CurrencyCode="RUB"/>
                  <Totals>
                    <BaseFare Amount="404.00"/>
                    <EquivFare Amount="18180"/>
                    <Taxes>
                      <Tax Amount="4457"/>
                    </Taxes>
                    <TotalFare Amount="22637"/>
                  </Totals>
                </ItinTotalFare>
                <PassengerTypeQuantity Code="INF" Quantity="01"/>
                <PTC_FareBreakdown>
                  <Endorsements>
                    <Endorsement type="PRICING_PARAMETER">
                      <Text>WPAEY$P2ADT/1CNN/1INF$MP-I$BRYF$RQ</Text>
                    </Endorsement>
                    <Endorsement type="WARNING">
                      <Text>REQUIRES ACCOMPANYING ADT PASSENGER</Text>
                    </Endorsement>
                    <Endorsement type="WARNING">
                      <Text>EACH INF REQUIRES ACCOMPANYING ADT PASSENGER</Text>
                    </Endorsement>
                    <Endorsement type="WARNING">
                      <Text>VALIDATING CARRIER SPECIFIED</Text>
                    </Endorsement>
                    <Endorsement type="WARNING">
                      <Text>BSP - EY</Text>
                    </Endorsement>
                    <Endorsement type="WARNING">
                      <Text>TCH - EY</Text>
                    </Endorsement>
                    <Endorsement type="WARNING">
                      <Text>CHG BEF DEP UP TO RUB1XXX0/CHG AFT DEP UP TO RUB1XXX0/REF BEF</Text>
                    </Endorsement>
                    <Endorsement type="WARNING">
                      <Text>DEP UP TO RUB0/REF AFT DEP UP TO RUB0/SEE RULES</Text>
                    </Endorsement>
                    <Endorsement type="SYSTEM_ENDORSEMENT">
                      <Text>NON ENDO/ REF</Text>
                    </Endorsement>
                  </Endorsements>
                  <FareBasis Code="YLWF2AUIN/YLWF2AUIN/YLXF2AUIN/YLXF2AUIN"/>
                  <FareCalculation>
                    <Text>SYD EY X/AUH EY LON153.10EY X/AUH EY SYD150.47NUC303.57END ROE1.328146</Text>
                  </FareCalculation>
                  <FareSource>ATPC</FareSource>
                  <FlightSegment ConnectionInd="O" DepartureDateTime="12-01T23:25" FlightNumber="2463" ResBookDesigCode="Y" SegmentNumber="1" Status="NS">
                    <BaggageAllowance Number="10K"/>
                    <FareBasis Code="YLWF2AUIN"/>
                    <MarketingAirline Code="EY" FlightNumber="2463"/>
                    <OriginLocation LocationCode="SYD"/>
                    <ValidityDates>
                      <NotValidAfter>2022-12-01</NotValidAfter>
                      <NotValidBefore>2022-12-01</NotValidBefore>
                    </ValidityDates>
                  </FlightSegment>
                  <FlightSegment ConnectionInd="X" DepartureDateTime="12-02T10:35" FlightNumber="25" ResBookDesigCode="Y" SegmentNumber="2" Status="NS">
                    <BaggageAllowance Number="10K"/>
                    <FareBasis Code="YLWF2AUIN"/>
                    <MarketingAirline Code="EY" FlightNumber="25"/>
                    <OriginLocation LocationCode="AUH"/>
                    <ValidityDates>
                      <NotValidAfter>2022-12-02</NotValidAfter>
                      <NotValidBefore>2022-12-02</NotValidBefore>
                    </ValidityDates>
                  </FlightSegment>
                  <FlightSegment ConnectionInd="O" DepartureDateTime="12-08T08:30" FlightNumber="12" ResBookDesigCode="Y" SegmentNumber="3" Status="NS">
                    <BaggageAllowance Number="10K"/>
                    <FareBasis Code="YLXF2AUIN"/>
                    <MarketingAirline Code="EY" FlightNumber="12"/>
                    <OriginLocation LocationCode="LHR"/>
                    <ValidityDates>
                      <NotValidAfter>2022-12-08</NotValidAfter>
                      <NotValidBefore>2022-12-08</NotValidBefore>
                    </ValidityDates>
                  </FlightSegment>
                  <FlightSegment ConnectionInd="X" DepartureDateTime="12-08T22:10" FlightNumber="464" ResBookDesigCode="Y" SegmentNumber="4" Status="NS">
                    <BaggageAllowance Number="10K"/>
                    <FareBasis Code="YLXF2AUIN"/>
                    <MarketingAirline Code="EY" FlightNumber="464"/>
                    <OriginLocation LocationCode="AUH"/>
                    <ValidityDates>
                      <NotValidAfter>2022-12-08</NotValidAfter>
                      <NotValidBefore>2022-12-08</NotValidBefore>
                    </ValidityDates>
                  </FlightSegment>
                  <FlightSegment>
                    <OriginLocation LocationCode="SYD"/>
                  </FlightSegment>
                  <FareComponent Amount="15310" FareBasisCode="YLWF2AUIN" FareComponentNumber="1" FareDirectionality="FROM" GoverningCarrier="EY" TicketDesignator="">
                    <Location Destination="LON" Origin="SYD"/>
                    <Dates ArrivalDateTime="12-02T14:10" DepartureDateTime="12-01T23:25"/>
                    <FlightSegmentNumbers>
                      <FlightSegmentNumber>1</FlightSegmentNumber>
                      <FlightSegmentNumber>2</FlightSegmentNumber>
                    </FlightSegmentNumbers>
                  </FareComponent>
                  <FareComponent Amount="15047" FareBasisCode="YLXF2AUIN" FareComponentNumber="2" FareDirectionality="TO" GoverningCarrier="EY" TicketDesignator="">
                    <Location Destination="SYD" Origin="LON"/>
                    <Dates ArrivalDateTime="12-09T17:55" DepartureDateTime="12-08T08:30"/>
                    <FlightSegmentNumbers>
                      <FlightSegmentNumber>3</FlightSegmentNumber>
                      <FlightSegmentNumber>4</FlightSegmentNumber>
                    </FlightSegmentNumbers>
                  </FareComponent>
                </PTC_FareBreakdown>
              </AirItineraryPricingInfo>
            </PricedItinerary>
            <ResponseHeader>
              <Text>FARE - PRICE RETAINED</Text>
              <Text>FARE USED TO CALCULATE DISCOUNT</Text>
              <Text>FARE NOT GUARANTEED UNTIL TICKETED</Text>
            </ResponseHeader>
            <PriceQuotePlus DiscountAmount="0" DisplayOnly="false" DomesticIntlInd="I" IT_BT_Fare="BT" ItineraryChanged="false" ManualFare="false" NUCSuppresion="false" NegotiatedFare="false" PricingStatus="S" SubjToGovtApproval="false" SystemIndicator="S" VerifyFareCalc="false">
              <PassengerInfo PassengerType="INF">
                <PassengerData NameNumber="04.01">IVANOVA/EKATERINA</PassengerData>
              </PassengerInfo>
              <TicketingInstructionsInfo/>
            </PriceQuotePlus>
          </PriceQuote>
          <PriceQuoteTotals>
            <BaseFare Amount="11693.00"/>
            <EquivFare Amount="526185.00"/>
            <Taxes>
              <Tax Amount="49202.00"/>
            </Taxes>
            <TotalFare Amount="575387.00"/>
          </PriceQuoteTotals>
        </ItineraryPricing>
        <ReservationItems>
          <Item RPH="1">
            <FlightSegment AirMilesFlown="7506" ArrivalDateTime="12-02T06:40" CodeShare="false" ConnectionInd="O" DayOfWeekInd="4" DepartureDateTime="2022-12-01T23:25" ElapsedTime="13.15" FlightNumber="2463" Id="3" IsPast="false" NumberInParty="03" ResBookDesigCode="Y" SegmentBookedDate="2022-05-20T04:56:00" SegmentNumber="0001" SmokingAllowed="false" SpecialMeal="false" Status="HK" StopQuantity="00" eTicket="true">
              <DestinationLocation LocationCode="AUH"/>
              <Equipment AirEquipType="789"/>
              <MarketingAirline Code="EY" FlightNumber="2463" ResBookDesigCode="Y">
                <Banner>MARKETED BY ETIHAD AIRWAYS</Banner>
              </MarketingAirline>
              <MarriageGrp Group="001" Ind="O" Sequence="1"/>
              <Meal Code="R"/>
              <OperatingAirline Code="EY" FlightNumber="2463" ResBookDesigCode="Y">
                <Banner>OPERATED BY ETIHAD AIRWAYS</Banner>
              </OperatingAirline>
              <OperatingAirlinePricing Code="EY"/>
              <DisclosureCarrier Code="EY" DOT="false">
                <Banner>ETIHAD AIRWAYS</Banner>
              </DisclosureCarrier>
              <OriginLocation LocationCode="SYD"/>
              <SupplierRef ID="DCEY"/>
              <UpdatedArrivalTime>12-02T06:40</UpdatedArrivalTime>
              <UpdatedDepartureTime>12-01T23:25</UpdatedDepartureTime>
              <Cabin Code="Y" Lang="EN" Name="ECONOMY" SabreCode="Y" ShortName="ECONOMY"/>
            </FlightSegment>
            <Product>
              <ProductDetails productCategory="AIR">
                <ProductName type="AIR"/>
                <Air segmentAssociationId="2" sequence="1">
                  <DepartureAirport>SYD</DepartureAirport>
                  <ArrivalAirport>AUH</ArrivalAirport>
                  <EquipmentType>789</EquipmentType>
                  <MarketingAirlineCode>EY</MarketingAirlineCode>
                  <MarketingFlightNumber>2463</MarketingFlightNumber>
                  <MarketingClassOfService>Y</MarketingClassOfService>
                  <MarriageGrp>
                    <Group>1</Group>
                    <Sequence>1</Sequence>
                  </MarriageGrp>
                  <Cabin code="Y" lang="EN" name="ECONOMY" sabreCode="Y" shortName="ECONOMY"/>
                  <MealCode>R</MealCode>
                  <ElapsedTime>795</ElapsedTime>
                  <AirMilesFlown>7506</AirMilesFlown>
                  <FunnelFlight>false</FunnelFlight>
                  <ChangeOfGauge>false</ChangeOfGauge>
                  <DisclosureCarrier Code="EY" DOT="false">
                    <Banner>ETIHAD AIRWAYS</Banner>
                  </DisclosureCarrier>
                  <AirlineRefId>DCEY</AirlineRefId>
                  <Eticket>true</Eticket>
                  <DepartureDateTime>2022-12-01T23:25:00</DepartureDateTime>
                  <ArrivalDateTime>2022-12-02T06:40:00</ArrivalDateTime>
                  <FlightNumber>2463</FlightNumber>
                  <ClassOfService>Y</ClassOfService>
                  <ActionCode>HK</ActionCode>
                  <NumberInParty>3</NumberInParty>
                  <inboundConnection>false</inboundConnection>
                  <outboundConnection>true</outboundConnection>
                  <ScheduleChangeIndicator>false</ScheduleChangeIndicator>
                  <SegmentBookedDate>2022-05-20T04:56:00</SegmentBookedDate>
                </Air>
              </ProductDetails>
            </Product>
          </Item>
          <Item RPH="2">
            <FlightSegment AirMilesFlown="3420" ArrivalDateTime="12-02T14:10" CodeShare="false" ConnectionInd="I" DayOfWeekInd="5" DepartureDateTime="2022-12-02T10:35" ElapsedTime="07.35" FlightNumber="0025" Id="4" IsPast="false" NumberInParty="03" ResBookDesigCode="Y" SegmentBookedDate="2022-05-20T04:56:00" SegmentNumber="0002" SmokingAllowed="false" SpecialMeal="false" Status="HK" StopQuantity="00" eTicket="true">
              <DestinationLocation LocationCode="LHR" Terminal="TERMINAL 3" TerminalCode="3"/>
              <Equipment AirEquipType="789"/>
              <MarketingAirline Code="EY" FlightNumber="0025" ResBookDesigCode="Y">
                <Banner>MARKETED BY ETIHAD AIRWAYS</Banner>
              </MarketingAirline>
              <MarriageGrp Group="001" Ind="I" Sequence="2"/>
              <Meal Code="M"/>
              <OperatingAirline Code="EY" FlightNumber="0025" ResBookDesigCode="Y">
                <Banner>OPERATED BY ETIHAD AIRWAYS</Banner>
              </OperatingAirline>
              <OperatingAirlinePricing Code="EY"/>
              <DisclosureCarrier Code="EY" DOT="false">
                <Banner>ETIHAD AIRWAYS</Banner>
              </DisclosureCarrier>
              <OriginLocation LocationCode="AUH" Terminal="TERMINAL 3" TerminalCode="3"/>
              <SupplierRef ID="DCEY"/>
              <UpdatedArrivalTime>12-02T14:10</UpdatedArrivalTime>
              <UpdatedDepartureTime>12-02T10:35</UpdatedDepartureTime>
              <Cabin Code="Y" Lang="EN" Name="ECONOMY" SabreCode="Y" ShortName="ECONOMY"/>
            </FlightSegment>
            <Product>
              <ProductDetails productCategory="AIR">
                <ProductName type="AIR"/>
                <Air segmentAssociationId="3" sequence="2">
                  <DepartureAirport>AUH</DepartureAirport>
                  <DepartureTerminalName>TERMINAL 3</DepartureTerminalName>
                  <DepartureTerminalCode>3</DepartureTerminalCode>
                  <ArrivalAirport>LHR</ArrivalAirport>
                  <ArrivalTerminalName>TERMINAL 3</ArrivalTerminalName>
                  <ArrivalTerminalCode>3</ArrivalTerminalCode>
                  <EquipmentType>789</EquipmentType>
                  <MarketingAirlineCode>EY</MarketingAirlineCode>
                  <MarketingFlightNumber>25</MarketingFlightNumber>
                  <MarketingClassOfService>Y</MarketingClassOfService>
                  <MarriageGrp>
                    <Group>1</Group>
                    <Sequence>2</Sequence>
                  </MarriageGrp>
                  <Cabin code="Y" lang="EN" name="ECONOMY" sabreCode="Y" shortName="ECONOMY"/>
                  <MealCode>M</MealCode>
                  <ElapsedTime>455</ElapsedTime>
                  <AirMilesFlown>3420</AirMilesFlown>
                  <FunnelFlight>false</FunnelFlight>
                  <ChangeOfGauge>false</ChangeOfGauge>
                  <DisclosureCarrier Code="EY" DOT="false">
                    <Banner>ETIHAD AIRWAYS</Banner>
                  </DisclosureCarrier>
                  <AirlineRefId>DCEY</AirlineRefId>
                  <Eticket>true</Eticket>
                  <DepartureDateTime>2022-12-02T10:35:00</DepartureDateTime>
                  <ArrivalDateTime>2022-12-02T14:10:00</ArrivalDateTime>
                  <FlightNumber>25</FlightNumber>
                  <ClassOfService>Y</ClassOfService>
                  <ActionCode>HK</ActionCode>
                  <NumberInParty>3</NumberInParty>
                  <inboundConnection>true</inboundConnection>
                  <outboundConnection>false</outboundConnection>
                  <ScheduleChangeIndicator>false</ScheduleChangeIndicator>
                  <SegmentBookedDate>2022-05-20T04:56:00</SegmentBookedDate>
                </Air>
              </ProductDetails>
            </Product>
          </Item>
          <Item RPH="3">
            <FlightSegment AirMilesFlown="3420" ArrivalDateTime="12-08T19:20" CodeShare="false" ConnectionInd="O" DayOfWeekInd="4" DepartureDateTime="2022-12-08T08:30" ElapsedTime="06.50" FlightNumber="0012" Id="5" IsPast="false" NumberInParty="03" ResBookDesigCode="Y" SegmentBookedDate="2022-05-20T04:56:00" SegmentNumber="0003" SmokingAllowed="false" SpecialMeal="false" Status="HK" StopQuantity="00" eTicket="true">
              <DestinationLocation LocationCode="AUH" Terminal="TERMINAL 3" TerminalCode="3"/>
              <Equipment AirEquipType="781"/>
              <MarketingAirline Code="EY" FlightNumber="0012" ResBookDesigCode="Y">
                <Banner>MARKETED BY ETIHAD AIRWAYS</Banner>
              </MarketingAirline>
              <MarriageGrp Group="002" Ind="O" Sequence="1"/>
              <Meal Code="M"/>
              <OperatingAirline Code="EY" FlightNumber="0012" ResBookDesigCode="Y">
                <Banner>OPERATED BY ETIHAD AIRWAYS</Banner>
              </OperatingAirline>
              <OperatingAirlinePricing Code="EY"/>
              <DisclosureCarrier Code="EY" DOT="false">
                <Banner>ETIHAD AIRWAYS</Banner>
              </DisclosureCarrier>
              <OriginLocation LocationCode="LHR" Terminal="TERMINAL 3" TerminalCode="3"/>
              <SupplierRef ID="DCEY"/>
              <UpdatedArrivalTime>12-08T19:20</UpdatedArrivalTime>
              <UpdatedDepartureTime>12-08T08:30</UpdatedDepartureTime>
              <Cabin Code="Y" Lang="EN" Name="ECONOMY" SabreCode="Y" ShortName="ECONOMY"/>
            </FlightSegment>
            <Product>
              <ProductDetails productCategory="AIR">
                <ProductName type="AIR"/>
                <Air segmentAssociationId="4" sequence="3">
                  <DepartureAirport>LHR</DepartureAirport>
                  <DepartureTerminalName>TERMINAL 3</DepartureTerminalName>
                  <DepartureTerminalCode>3</DepartureTerminalCode>
                  <ArrivalAirport>AUH</ArrivalAirport>
                  <ArrivalTerminalName>TERMINAL 3</ArrivalTerminalName>
                  <ArrivalTerminalCode>3</ArrivalTerminalCode>
                  <EquipmentType>781</EquipmentType>
                  <MarketingAirlineCode>EY</MarketingAirlineCode>
                  <MarketingFlightNumber>12</MarketingFlightNumber>
                  <MarketingClassOfService>Y</MarketingClassOfService>
                  <MarriageGrp>
                    <Group>2</Group>
                    <Sequence>1</Sequence>
                  </MarriageGrp>
                  <Cabin code="Y" lang="EN" name="ECONOMY" sabreCode="Y" shortName="ECONOMY"/>
                  <MealCode>M</MealCode>
                  <ElapsedTime>410</ElapsedTime>
                  <AirMilesFlown>3420</AirMilesFlown>
                  <FunnelFlight>false</FunnelFlight>
                  <ChangeOfGauge>false</ChangeOfGauge>
                  <DisclosureCarrier Code="EY" DOT="false">
                    <Banner>ETIHAD AIRWAYS</Banner>
                  </DisclosureCarrier>
                  <AirlineRefId>DCEY</AirlineRefId>
                  <Eticket>true</Eticket>
                  <DepartureDateTime>2022-12-08T08:30:00</DepartureDateTime>
                  <ArrivalDateTime>2022-12-08T19:20:00</ArrivalDateTime>
                  <FlightNumber>12</FlightNumber>
                  <ClassOfService>Y</ClassOfService>
                  <ActionCode>HK</ActionCode>
                  <NumberInParty>3</NumberInParty>
                  <inboundConnection>false</inboundConnection>
                  <outboundConnection>true</outboundConnection>
                  <ScheduleChangeIndicator>false</ScheduleChangeIndicator>
                  <SegmentBookedDate>2022-05-20T04:56:00</SegmentBookedDate>
                </Air>
              </ProductDetails>
            </Product>
          </Item>
          <Item RPH="4">
            <FlightSegment AirMilesFlown="7506" ArrivalDateTime="12-09T17:55" CodeShare="false" ConnectionInd="I" DayOfWeekInd="4" DepartureDateTime="2022-12-08T22:10" ElapsedTime="13.45" FlightNumber="0464" Id="6" IsPast="false" NumberInParty="03" ResBookDesigCode="Y" SegmentBookedDate="2022-05-20T04:56:00" SegmentNumber="0004" SmokingAllowed="false" SpecialMeal="false" Status="HK" StopQuantity="00" eTicket="true">
              <DestinationLocation LocationCode="SYD"/>
              <Equipment AirEquipType="789"/>
              <MarketingAirline Code="EY" FlightNumber="0464" ResBookDesigCode="Y">
                <Banner>MARKETED BY ETIHAD AIRWAYS</Banner>
              </MarketingAirline>
              <MarriageGrp Group="002" Ind="I" Sequence="2"/>
              <OperatingAirline Code="EY" FlightNumber="0464" ResBookDesigCode="Y">
                <Banner>OPERATED BY ETIHAD AIRWAYS</Banner>
              </OperatingAirline>
              <OperatingAirlinePricing Code="EY"/>
              <DisclosureCarrier Code="EY" DOT="false">
                <Banner>ETIHAD AIRWAYS</Banner>
              </DisclosureCarrier>
              <OriginLocation LocationCode="AUH"/>
              <SupplierRef ID="DCEY"/>
              <UpdatedArrivalTime>12-09T17:55</UpdatedArrivalTime>
              <UpdatedDepartureTime>12-08T22:10</UpdatedDepartureTime>
              <Cabin Code="Y" Lang="EN" Name="ECONOMY" SabreCode="Y" ShortName="ECONOMY"/>
            </FlightSegment>
            <Product>
              <ProductDetails productCategory="AIR">
                <ProductName type="AIR"/>
                <Air segmentAssociationId="5" sequence="4">
                  <DepartureAirport>AUH</DepartureAirport>
                  <ArrivalAirport>SYD</ArrivalAirport>
                  <EquipmentType>789</EquipmentType>
                  <MarketingAirlineCode>EY</MarketingAirlineCode>
                  <MarketingFlightNumber>464</MarketingFlightNumber>
                  <MarketingClassOfService>Y</MarketingClassOfService>
                  <MarriageGrp>
                    <Group>2</Group>
                    <Sequence>2</Sequence>
                  </MarriageGrp>
                  <Cabin code="Y" lang="EN" name="ECONOMY" sabreCode="Y" shortName="ECONOMY"/>
                  <ElapsedTime>825</ElapsedTime>
                  <AirMilesFlown>7506</AirMilesFlown>
                  <FunnelFlight>false</FunnelFlight>
                  <ChangeOfGauge>false</ChangeOfGauge>
                  <DisclosureCarrier Code="EY" DOT="false">
                    <Banner>ETIHAD AIRWAYS</Banner>
                  </DisclosureCarrier>
                  <AirlineRefId>DCEY</AirlineRefId>
                  <Eticket>true</Eticket>
                  <DepartureDateTime>2022-12-08T22:10:00</DepartureDateTime>
                  <ArrivalDateTime>2022-12-09T17:55:00</ArrivalDateTime>
                  <FlightNumber>464</FlightNumber>
                  <ClassOfService>Y</ClassOfService>
                  <ActionCode>HK</ActionCode>
                  <NumberInParty>3</NumberInParty>
                  <inboundConnection>true</inboundConnection>
                  <outboundConnection>false</outboundConnection>
                  <ScheduleChangeIndicator>false</ScheduleChangeIndicator>
                  <SegmentBookedDate>2022-05-20T04:56:00</SegmentBookedDate>
                </Air>
              </ProductDetails>
            </Product>
          </Item>
        </ReservationItems>
        <Ticketing RPH="01" TicketTimeLimit="TAW/"/>
      </ItineraryInfo>
      <ItineraryRef AirExtras="false" ID="TFPSFW" InhibitCode="U" PartitionID="AA" PrimeHostID="1S">
        <Header>PRICE QUOTE RECORD EXISTS - SYSTEM</Header>
        <Source AAA_PseudoCityCode="9LSC" CreateDateTime="2022-05-20T04:56" CreationAgent="AWT" HomePseudoCityCode="9LSC" LastUpdateDateTime="2022-05-20T04:56" PseudoCityCode="9LSC" ReceivedFrom="API" SequenceNumber="1"/>
      </ItineraryRef>
      <RemarkInfo>
        <Remark Id="30" RPH="001" Type="General">
          <Text>TEXT REMARK</Text>
        </Remark>
      </RemarkInfo>
      <SpecialServiceInfo Id="20" RPH="001" Type="GFX">
        <Service SSR_Code="SSR" SSR_Type="DOCS">
          <Airline Code="EY"/>
          <PersonName NameNumber="01.01">IVANOV/IVAN MR</PersonName>
          <Text>HK1/P/RU/1234567890/RU/20NOV1980/M/20NOV2025/IVANOV/IVAN/IVANOVICH/H</Text>
        </Service>
      </SpecialServiceInfo>
      <SpecialServiceInfo Id="21" RPH="002" Type="GFX">
        <Service SSR_Code="SSR" SSR_Type="DOCS">
          <Airline Code="EY"/>
          <PersonName NameNumber="02.01">IVANOVA/ELENA MS</PersonName>
          <Text>HK1/P/RU/2234567890/RU/20JAN1980/F/15AUG2025/IVANOVA/ELENA/IVANOVNA</Text>
        </Service>
      </SpecialServiceInfo>
      <SpecialServiceInfo Id="22" RPH="003" Type="GFX">
        <Service SSR_Code="SSR" SSR_Type="DOCS">
          <Airline Code="EY"/>
          <PersonName NameNumber="03.01">IVANOV/ANDREY</PersonName>
          <Text>HK1/P/RU/3234567890/RU/15JAN2012/M/20NOV2025/IVANOV/ANDREY/IVANOVICH</Text>
        </Service>
      </SpecialServiceInfo>
      <SpecialServiceInfo Id="23" RPH="004" Type="GFX">
        <Service SSR_Code="SSR" SSR_Type="DOCS">
          <Airline Code="EY"/>
          <PersonName NameNumber="01.01">IVANOV/IVAN MR</PersonName>
          <Text>HK1/P/RU/1234567890/RU/20FEB2022/FI/15APR2025/IVANOVA/EKATERINA/IVANOVNA</Text>
        </Service>
      </SpecialServiceInfo>
      <SpecialServiceInfo Id="24" RPH="005" Type="GFX">
        <Service SSR_Code="SSR" SSR_Type="INFT">
          <Airline Code="EY"/>
          <PersonName NameNumber="01.01">IVANOV/IVAN MR</PersonName>
          <Text>NN1 SYDAUH2463Y01DEC/IVANOVA/EKATERINA/20FEB22</Text>
        </Service>
      </SpecialServiceInfo>
      <SpecialServiceInfo Id="25" RPH="006" Type="GFX">
        <Service SSR_Code="SSR" SSR_Type="INFT">
          <Airline Code="EY"/>
          <PersonName NameNumber="01.01">IVANOV/IVAN MR</PersonName>
          <Text>NN1 AUHLHR0025Y02DEC/IVANOVA/EKATERINA/20FEB22</Text>
        </Service>
      </SpecialServiceInfo>
      <SpecialServiceInfo Id="26" RPH="007" Type="GFX">
        <Service SSR_Code="SSR" SSR_Type="INFT">
          <Airline Code="EY"/>
          <PersonName NameNumber="01.01">IVANOV/IVAN MR</PersonName>
          <Text>NN1 LHRAUH0012Y08DEC/IVANOVA/EKATERINA/20FEB22</Text>
        </Service>
      </SpecialServiceInfo>
      <SpecialServiceInfo Id="27" RPH="008" Type="GFX">
        <Service SSR_Code="SSR" SSR_Type="INFT">
          <Airline Code="EY"/>
          <PersonName NameNumber="01.01">IVANOV/IVAN MR</PersonName>
          <Text>NN1 AUHSYD0464Y08DEC/IVANOVA/EKATERINA/20FEB22</Text>
        </Service>
      </SpecialServiceInfo>
      <SpecialServiceInfo Id="28" RPH="009" Type="GFX">
        <Service SSR_Code="SSR" SSR_Type="CTCM">
          <Airline Code="EY"/>
          <PersonName NameNumber="01.01">IVANOV/IVAN MR</PersonName>
          <Text>HK1/79851234567/RU</Text>
        </Service>
      </SpecialServiceInfo>
      <SpecialServiceInfo Id="29" RPH="010" Type="GFX">
        <Service SSR_Code="SSR" SSR_Type="CTCE">
          <Airline Code="EY"/>
          <PersonName NameNumber="01.01">IVANOV/IVAN MR</PersonName>
          <Text>HK1/CUSTOMER//CUSTOMER.COM/RU</Text>
        </Service>
      </SpecialServiceInfo>
      <OpenReservationElements>
        <OpenReservationElement elementId="pnr-20" id="20" type="SRVC">
          <ServiceRequest actionCode="HK" airlineCode="EY" code="DOCS" serviceCount="1" serviceType="SSR" ssrType="GFX">
            <FreeText>/P/RU/1234567890/RU/20NOV1980/M/20NOV2025/IVANOV/IVAN/IVANOVICH/H</FreeText>
            <FullText>DOCS EY HK1/P/RU/1234567890/RU/20NOV1980/M/20NOV2025/IVANOV/IVAN/IVANOVICH/H</FullText>
            <TravelDocument>
              <Type>P</Type>
              <DocumentIssueCountry>RU</DocumentIssueCountry>
              <DocumentNumber>1234567890</DocumentNumber>
              <DocumentNationalityCountry>RU</DocumentNationalityCountry>
              <DocumentExpirationDate>20NOV2025</DocumentExpirationDate>
              <DateOfBirth>20NOV1980</DateOfBirth>
              <Gender>M</Gender>
              <LastName>IVANOV</LastName>
              <FirstName>IVAN</FirstName>
              <MiddleName>IVANOVICH</MiddleName>
              <Infant>false</Infant>
              <PrimaryDocHolderInd>true</PrimaryDocHolderInd>
              <HasDocumentData>true</HasDocumentData>
            </TravelDocument>
          </ServiceRequest>
          <NameAssociation>
            <LastName>IVANOV</LastName>
            <FirstName>IVAN MR</FirstName>
            <ReferenceId>1</ReferenceId>
            <NameRefNumber>01.01</NameRefNumber>
          </NameAssociation>
        </OpenReservationElement>
        <OpenReservationElement elementId="pnr-21" id="21" type="SRVC">
          <ServiceRequest actionCode="HK" airlineCode="EY" code="DOCS" serviceCount="1" serviceType="SSR" ssrType="GFX">
            <FreeText>/P/RU/2234567890/RU/20JAN1980/F/15AUG2025/IVANOVA/ELENA/IVANOVNA</FreeText>
            <FullText>DOCS EY HK1/P/RU/2234567890/RU/20JAN1980/F/15AUG2025/IVANOVA/ELENA/IVANOVNA</FullText>
            <TravelDocument>
              <Type>P</Type>
              <DocumentIssueCountry>RU</DocumentIssueCountry>
              <DocumentNumber>2234567890</DocumentNumber>
              <DocumentNationalityCountry>RU</DocumentNationalityCountry>
              <DocumentExpirationDate>15AUG2025</DocumentExpirationDate>
              <DateOfBirth>20JAN1980</DateOfBirth>
              <Gender>F</Gender>
              <LastName>IVANOVA</LastName>
              <FirstName>ELENA</FirstName>
              <MiddleName>IVANOVNA</MiddleName>
              <Infant>false</Infant>
              <PrimaryDocHolderInd>false</PrimaryDocHolderInd>
              <HasDocumentData>true</HasDocumentData>
            </TravelDocument>
          </ServiceRequest>
          <NameAssociation>
            <LastName>IVANOVA</LastName>
            <FirstName>ELENA MS</FirstName>
            <ReferenceId>2</ReferenceId>
            <NameRefNumber>02.01</NameRefNumber>
          </NameAssociation>
        </OpenReservationElement>
        <OpenReservationElement elementId="pnr-22" id="22" type="SRVC">
          <ServiceRequest actionCode="HK" airlineCode="EY" code="DOCS" serviceCount="1" serviceType="SSR" ssrType="GFX">
            <FreeText>/P/RU/3234567890/RU/15JAN2012/M/20NOV2025/IVANOV/ANDREY/IVANOVICH</FreeText>
            <FullText>DOCS EY HK1/P/RU/3234567890/RU/15JAN2012/M/20NOV2025/IVANOV/ANDREY/IVANOVICH</FullText>
            <TravelDocument>
              <Type>P</Type>
              <DocumentIssueCountry>RU</DocumentIssueCountry>
              <DocumentNumber>3234567890</DocumentNumber>
              <DocumentNationalityCountry>RU</DocumentNationalityCountry>
              <DocumentExpirationDate>20NOV2025</DocumentExpirationDate>
              <DateOfBirth>15JAN2012</DateOfBirth>
              <Gender>M</Gender>
              <LastName>IVANOV</LastName>
              <FirstName>ANDREY</FirstName>
              <MiddleName>IVANOVICH</MiddleName>
              <Infant>false</Infant>
              <PrimaryDocHolderInd>false</PrimaryDocHolderInd>
              <HasDocumentData>true</HasDocumentData>
            </TravelDocument>
          </ServiceRequest>
          <NameAssociation>
            <LastName>IVANOV</LastName>
            <FirstName>ANDREY</FirstName>
            <ReferenceId>3</ReferenceId>
            <NameRefNumber>03.01</NameRefNumber>
          </NameAssociation>
        </OpenReservationElement>
        <OpenReservationElement elementId="pnr-23" id="23" type="SRVC">
          <ServiceRequest actionCode="HK" airlineCode="EY" code="DOCS" serviceCount="1" serviceType="SSR" ssrType="GFX">
            <FreeText>/P/RU/1234567890/RU/20FEB2022/FI/15APR2025/IVANOVA/EKATERINA/IVANOVNA</FreeText>
            <FullText>DOCS EY HK1/P/RU/1234567890/RU/20FEB2022/FI/15APR2025/IVANOVA/EKATERINA/IVANOVNA</FullText>
            <TravelDocument>
              <Type>P</Type>
              <DocumentIssueCountry>RU</DocumentIssueCountry>
              <DocumentNumber>1234567890</DocumentNumber>
              <DocumentNationalityCountry>RU</DocumentNationalityCountry>
              <DocumentExpirationDate>15APR2025</DocumentExpirationDate>
              <DateOfBirth>20FEB2022</DateOfBirth>
              <Gender>FI</Gender>
              <LastName>IVANOVA</LastName>
              <FirstName>EKATERINA</FirstName>
              <MiddleName>IVANOVNA</MiddleName>
              <Infant>true</Infant>
              <PrimaryDocHolderInd>false</PrimaryDocHolderInd>
              <HasDocumentData>true</HasDocumentData>
            </TravelDocument>
          </ServiceRequest>
          <NameAssociation>
            <LastName>IVANOV</LastName>
            <FirstName>IVAN MR</FirstName>
            <ReferenceId>1</ReferenceId>
            <NameRefNumber>01.01</NameRefNumber>
          </NameAssociation>
        </OpenReservationElement>
        <OpenReservationElement elementId="pnr-24" id="24" type="SRVC">
          <ServiceRequest actionCode="NN" airlineCode="EY" code="INFT" serviceCount="1" serviceType="SSR" ssrType="GFX">
            <FreeText>/IVANOVA/EKATERINA/20FEB22</FreeText>
            <FullText>INFT EY NN1 SYDAUH2463Y01DEC/IVANOVA/EKATERINA/20FEB22</FullText>
          </ServiceRequest>
          <SegmentAssociation Id="3" SegmentAssociationId="2">
            <AirSegment>
              <CarrierCode>EY</CarrierCode>
              <FlightNumber>2463</FlightNumber>
              <DepartureDate>2022-12-01</DepartureDate>
              <BoardPoint>SYD</BoardPoint>
              <OffPoint>AUH</OffPoint>
              <ClassOfService>Y</ClassOfService>
              <BookingStatus>NN</BookingStatus>
            </AirSegment>
          </SegmentAssociation>
          <NameAssociation>
            <LastName>IVANOV</LastName>
            <FirstName>IVAN MR</FirstName>
            <ReferenceId>1</ReferenceId>
            <NameRefNumber>01.01</NameRefNumber>
          </NameAssociation>
        </OpenReservationElement>
        <OpenReservationElement elementId="pnr-25" id="25" type="SRVC">
          <ServiceRequest actionCode="NN" airlineCode="EY" code="INFT" serviceCount="1" serviceType="SSR" ssrType="GFX">
            <FreeText>/IVANOVA/EKATERINA/20FEB22</FreeText>
            <FullText>INFT EY NN1 AUHLHR0025Y02DEC/IVANOVA/EKATERINA/20FEB22</FullText>
          </ServiceRequest>
          <SegmentAssociation Id="4" SegmentAssociationId="3">
            <AirSegment>
              <CarrierCode>EY</CarrierCode>
              <FlightNumber>0025</FlightNumber>
              <DepartureDate>2022-12-02</DepartureDate>
              <BoardPoint>AUH</BoardPoint>
              <OffPoint>LHR</OffPoint>
              <ClassOfService>Y</ClassOfService>
              <BookingStatus>NN</BookingStatus>
            </AirSegment>
          </SegmentAssociation>
          <NameAssociation>
            <LastName>IVANOV</LastName>
            <FirstName>IVAN MR</FirstName>
            <ReferenceId>1</ReferenceId>
            <NameRefNumber>01.01</NameRefNumber>
          </NameAssociation>
        </OpenReservationElement>
        <OpenReservationElement elementId="pnr-26" id="26" type="SRVC">
          <ServiceRequest actionCode="NN" airlineCode="EY" code="INFT" serviceCount="1" serviceType="SSR" ssrType="GFX">
            <FreeText>/IVANOVA/EKATERINA/20FEB22</FreeText>
            <FullText>INFT EY NN1 LHRAUH0012Y08DEC/IVANOVA/EKATERINA/20FEB22</FullText>
          </ServiceRequest>
          <SegmentAssociation Id="5" SegmentAssociationId="4">
            <AirSegment>
              <CarrierCode>EY</CarrierCode>
              <FlightNumber>0012</FlightNumber>
              <DepartureDate>2022-12-08</DepartureDate>
              <BoardPoint>LHR</BoardPoint>
              <OffPoint>AUH</OffPoint>
              <ClassOfService>Y</ClassOfService>
              <BookingStatus>NN</BookingStatus>
            </AirSegment>
          </SegmentAssociation>
          <NameAssociation>
            <LastName>IVANOV</LastName>
            <FirstName>IVAN MR</FirstName>
            <ReferenceId>1</ReferenceId>
            <NameRefNumber>01.01</NameRefNumber>
          </NameAssociation>
        </OpenReservationElement>
        <OpenReservationElement elementId="pnr-27" id="27" type="SRVC">
          <ServiceRequest actionCode="NN" airlineCode="EY" code="INFT" serviceCount="1" serviceType="SSR" ssrType="GFX">
            <FreeText>/IVANOVA/EKATERINA/20FEB22</FreeText>
            <FullText>INFT EY NN1 AUHSYD0464Y08DEC/IVANOVA/EKATERINA/20FEB22</FullText>
          </ServiceRequest>
          <SegmentAssociation Id="6" SegmentAssociationId="5">
            <AirSegment>
              <CarrierCode>EY</CarrierCode>
              <FlightNumber>0464</FlightNumber>
              <DepartureDate>2022-12-08</DepartureDate>
              <BoardPoint>AUH</BoardPoint>
              <OffPoint>SYD</OffPoint>
              <ClassOfService>Y</ClassOfService>
              <BookingStatus>NN</BookingStatus>
            </AirSegment>
          </SegmentAssociation>
          <NameAssociation>
            <LastName>IVANOV</LastName>
            <FirstName>IVAN MR</FirstName>
            <ReferenceId>1</ReferenceId>
            <NameRefNumber>01.01</NameRefNumber>
          </NameAssociation>
        </OpenReservationElement>
        <OpenReservationElement elementId="pnr-28" id="28" type="SRVC">
          <ServiceRequest actionCode="HK" airlineCode="EY" code="CTCM" serviceCount="1" serviceType="SSR" ssrType="GFX">
            <FreeText>/79851234567/RU</FreeText>
            <FullText>CTCM EY HK1/79851234567/RU</FullText>
            <PassengerContactMobilePhone>
              <PhoneNumber>79851234567</PhoneNumber>
              <Language>RU</Language>
            </PassengerContactMobilePhone>
          </ServiceRequest>
          <NameAssociation>
            <LastName>IVANOV</LastName>
            <FirstName>IVAN MR</FirstName>
            <ReferenceId>1</ReferenceId>
            <NameRefNumber>01.01</NameRefNumber>
          </NameAssociation>
        </OpenReservationElement>
        <OpenReservationElement elementId="pnr-29" id="29" type="SRVC">
          <ServiceRequest actionCode="HK" airlineCode="EY" code="CTCE" serviceCount="1" serviceType="SSR" ssrType="GFX">
            <Comment>COM/RU</Comment>
            <FreeText>/CUSTOMER//CUSTOMER.COM/RU</FreeText>
            <FullText>CTCE EY HK1/CUSTOMER//CUSTOMER.COM/RU</FullText>
            <PassengerContactEmail>
              <Email>CUSTOMER@CUSTOMER.COM</Email>
              <Language>RU</Language>
            </PassengerContactEmail>
          </ServiceRequest>
          <NameAssociation>
            <LastName>IVANOV</LastName>
            <FirstName>IVAN MR</FirstName>
            <ReferenceId>1</ReferenceId>
            <NameRefNumber>01.01</NameRefNumber>
          </NameAssociation>
        </OpenReservationElement>
        <OpenReservationElement elementId="pnr-17" id="17" type="PSG_DETAILS_MAIL">
          <Email comment="BC/" type="BC">
            <Address>AGENCY@AGENCY.COM</Address>
          </Email>
        </OpenReservationElement>
        <OpenReservationElement elementId="pnr-16" id="16" type="PSG_DETAILS_MAIL">
          <Email comment="TO/" type="TO">
            <Address>CUSTOMER@CUSTOMER.COM</Address>
          </Email>
          <NameAssociation>
            <LastName>IVANOV</LastName>
            <FirstName>IVAN MR</FirstName>
            <ReferenceId>1</ReferenceId>
            <NameRefNumber>01.01</NameRefNumber>
          </NameAssociation>
        </OpenReservationElement>
      </OpenReservationElements>
    </TravelItinerary>
  </TravelItineraryReadRS>
</PassengerDetailsRS>
```
{{< /details >}}
