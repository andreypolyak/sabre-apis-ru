# Создание бронирований в 1 шаг

-----

**Оглавление:**
<!-- toc -->

-----

Для создания бронирования в 1 шаг используется сервис [CreatePassengerNameRecordRQ](https://developer.sabre.com/docs/read/soap_apis/air/book/create_passenger_name_record).

## Переход в другой PCC

Для создания бронирования в другом PCC в запросе можно его указать в качестве значения атрибута ```/CreatePassengerNameRecordRQ/@targetCity```.

Сервис выполнит переход в этот PCC до момента создания бронирования и выполнит переход обратно после выполнения. 

*Обратите внимание на то, что для перехода в другой PCC требуется наличие Branch Access между ним и iPCC, в котором была создана сессия. Подробнее о Branch Access см. в разделе [Конфигурация Sabre](configuration.md).*

## Добавление сегментов

#### Информация о сегментах

Информация о сегментах должна быть указана в элементах ```/CreatePassengerNameRecordRQ/AirBook/OriginDestinationInformation/FlightSegment```:
- ```/@DepartureDateTime``` — дата отправления
- ```/@FlightNumber``` и ```/MarketingAirline/@FlightNumber``` — номер рейса
- ```/@DepartureDateTime``` — дата отправления
- ```/@NumberInParty``` —  количество запрашиваемых мест (младенцы без места не учитываются)
- ```/@ResBookDesigCode``` —  класс бронирования
- ```/@Status``` —  статус сегмента (при бронировании используется статус ```NN```)
- ```/DestinationLocation/@LocationCode``` —  код пункта прибытия
- ```/MarketingAirline/@Code``` —  код маркетингового перевозчика
- ```/MarriageGrp``` —  индикатор женатого сегмента (подробнее см. ниже). Возможные варианты заполнения:
    - ```O``` — обычный сегмент
    - ```I``` — женатый сегмент (продолжение предыдущего сегмента)
- ```/OriginLocation/@LocationCode``` —  код пункта отправления

*Обратите внимание на необходимость корректного заполнения индикатора женатого сегмента! В противном случае, перевозчик может не подтвердить места при создании бронирования. Информацию для заполнения можно взять из ответа на запрос к сервису [BargainFinderMaxRQ](shop.md).*

**Алгоритм установки индикатора женатого сегмента по данным из стандартного (OTA) ответа сервиса BargainFinderMaxRQ:**
1. Проассоциировать все сегменты в выбранном варианте перелета с соответствующими им элементами ```/OTA_AirLowFareSearchRS/PricedItineraries/PricedItinerary/AirItineraryPricingInfo/PTC_FareBreakdowns/PTC_FareBreakdown/FareBasisCodes/FareBasisCode``` (```/OTA_AirLowFareSearchRS/PricedItineraries/PricedItinerary/TPA_Extensions/AdditionalFares/AirItineraryPricingInfo/PTC_FareBreakdowns/PTC_FareBreakdown/FareBasisCodes/FareBasisCode``` для дополнительных расчетов или ```/OTA_AirLowFareSearchRS/PricedItineraries/PricedItinerary/TPA_Extensions/AdditionalFares/AirItineraryPricingInfo/Tickets/Ticket/AirItineraryPricingInfo/PTC_FareBreakdowns/PTC_FareBreakdown/FareBasisCodes/FareBasisCode``` для MultiTicket вариантов перелетов). Количество элементов ```FareBasisCode``` будет равно количеству сегментов в варианте перелета и идти они будут в том же порядке.
2. Наличие атрибута ```FareBasisCode/@AvailabilityBreak``` означает, что следующий сегмент не является женатым с текущим. Отсутствие атрибута означает, что следующий сегмент является женатым с текущим.
3. В соответствии с правилами указываются индикаторы женатого сегмента:
    - У первого сегмента всегда указывается значение ```O``` (обычный сегмент)
    - Если у предыдущего сегмента значение атрибута ```/@AvailabilityBreak``` равно ```true```, то у текущего сегмента указывается значение ```O``` (обычный сегмент)
    - Если у предыдущего сегмента нет атрибута ```/@AvailabilityBreak```, то у текущего сегмента указывается значение ```I``` (женатый сегмент)

**Алгоритм установки индикатора женатого сегмента по данным из группированного (GIR) ответа сервиса BargainFinderMaxRQ:**
1. Проассоциировать все сегменты в выбранном варианте перелета с соответствующими им элементами ```/GroupedItineraryResponse/ItineraryGroup/Itinerary/PricingInformation/Fare/PassengerInfo/FareComponent/Segment``` (```/GroupedItineraryResponse/ItineraryGroup/Itinerary/PricingInformation/Ticket/PricingInformation/Fare/PassengerInfo/FareComponent/Segment``` для MultiTicket вариантов перелетов). Количество элементов ```FareBasisCode``` будет равно количеству сегментов в варианте перелета и идти они будут в том же порядке.
2. Наличие атрибута ```Segment/@AvailabilityBreak``` означает, что следующий сегмент не является женатым с текущим. Отсутствие атрибута означает, что следующий сегмент является женатым с текущим.
3. В соответствии с правилами указываются индикаторы женатого сегмента:
    - У первого сегмента всегда указывается значение ```O``` (обычный сегмент)
    - Если у предыдущего сегмента значение атрибута ```/@AvailabilityBreak``` равно ```true```, то у текущего сегмента указывается значение ```O``` (обычный сегмент)
    - Если у предыдущего сегмента нет атрибута ```/@AvailabilityBreak```, то у текущего сегмента указывается значение ```I``` (женатый сегмент)

{% xmlsec "Пример (3 места на рейсе SU1138 из Шереметьево в Сочи 15 марта в Y классе)", true %}
<FlightSegment DepartureDateTime="2019-03-15T06:50" FlightNumber="1138" NumberInParty="3" ResBookDesigCode="Y" Status="NN">
  <DestinationLocation LocationCode="AER"/>
  <MarketingAirline Code="SU" FlightNumber="1138"/>
  <MarriageGrp>O</MarriageGrp>
  <OriginLocation LocationCode="SVO"/>
</FlightSegment>
{% endxmlsec %}

#### Проверка статусов сегментов

Сервис CreatePassengerNameRecordRQ позволяет указать список статусов сегментов, при появлении которых выполнение запроса будет остановлено. Статусы сегментов необходимо указать в атрибутах ```/CreatePassengerNameRecordRQ/AirBook/HaltOnStatus/@Code```.

{% xmlsec "Рекомендуемый список статусов сегментов", true %}
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
{% endxmlsec %}

Сервис будет проверять статусы сегментов каждые ```/CreatePassengerNameRecordRQ/AirBook/RedisplayReservation/@WaitInterval``` миллисекунд ```/CreatePassengerNameRecordRQ/AirBook/RedisplayReservation/@NumAttempts``` раз до тех пор, пока статусы сегментов не изменятся с ```NN``` на другие. Если после выполнения всех проверок сегменты будут по-прежнему иметь статус ```NN``` и этот статус будет указан в списке статусов сегментов (см. выше), то выполнение запроса будет прервано. 

{% xmlsec "Рекомендуемые значения (10 проверок 500 миллисекунд)", true %}
<RedisplayReservation NumAttempts="10" WaitInterval="500"/>
{% endxmlsec %}

Сервис предоставляет возможность автоматического перебронирования сегментов на доступный класс в случае появления статуса сегмента ```UC```. Для этого необходимо указать значение ```true``` у атрибута ```/CreatePassengerNameRecordRQ/AirBook/RetryRebook/@Option```.

#### Проверка минимального стыковочного времени

Для проверки минимального стыковочного времени в запросе необходимо указать значение ```true``` у атрибута ```/CreatePassengerNameRecordRQ/@haltOnInvalidMCT```. В случае наличия в бронировании сегментов с нарушением правил минимального стыковочного времени, сервис прервет выполнение запроса и вернет ошибку следующего вида:

{% xmlsec "Нарушение правил минимального стыковочного времени", true %}
<SystemSpecificResults>
  <Message code="WARN.SP.BUSINESS_ERROR">EnhancedAirBookRQ: Invalid connect time between air segments - please verify itinerary</Message>
  <Message code="ERR.SP.PROVIDER_ERROR">SabreCommandLLSRQ: INVALID CONNECT TIME SEGS 1 AND 2 - MINIMUM IS 60 MINUTES VERIFY ANY REMAINING SEGS</Message>
</SystemSpecificResults>
{% endxmlsec %}

Бронирование в этом случае создано не будет.

## Расчет стоимости

В запросе можно указать один или несколько последовательно идущих элементов ```/CreatePassengerNameRecordRQ/AirPrice```, в каждом из которых можно передать независимые параметры расчета стоимости (см. ниже).

#### Обработка ошибок

Сервис может прекратить выполнение запроса и игнорировать забронированные сегменты, если при выполнении расчета стоимости произойдет ошибка. Для этого необходимо указать в запросе значение ```true``` у атрибута ```/CreatePassengerNameRecordRQ/@haltOnAirPriceError```.

#### Создание PQ

Для сохранения в бронировании PQ (Price Quote, расчет стоимости) необходимо указать значение ```true``` у атрибута ```/CreatePassengerNameRecordRQ/AirPrice/PriceRequestInformation/@Retain```. В дальнейшем PQ потребуется в бронировании для оформления билетов.

#### Выбор валидирующего перевозчика

Код валидирующего перевозчика необходимо указать в качестве значения атрибута ```/CreatePassengerNameRecordRQ/AirPrice/PriceRequestInformation/@Retain```.

#### Выбор стока

В случае, если оформление билета планируется не на стоке BSP, то в запросе необходимо указать код стока в качестве значения элемента ```/CreatePassengerNameRecordRQ/AirPrice/PriceRequestInformation/OptionalQualifiers/MiscQualifiers/ValidationMethod```.

Доступные коды стоков:

| Сток | Код стока |
| -- | -- |
| Сток BSP | ```BSP``` |
| Прямой сток Аэрофлота | ```RUT``` |
| Прямой сток других авиакомпаний | ```GEN``` |
| Сток ТКП | ```TCH``` |

#### Расчет стоимости по брендированным тарифам

Алгоритм внесения информации о бренде различается в зависимости от того применяется ли один и тот же бренд для всех сегментов бронирования или несколько разных брендов применяются для разных сегментов.

Для получения этой информации необходимо проанализировать ответ сервиса BargainFinderMaxRQ или RevalidateItinRQ:
- если все элементы ```/OTA_AirLowFareSearchRS/PricedItineraries/PricedItinerary/AirItineraryPricingInfo/PTC_FareBreakdowns/PTC_FareBreakdown/PassengerFare/TPA_Extensions/FareComponents/FareComponent``` (для самой дешевой комбинации брендов) или ```/OTA_AirLowFareSearchRS/PricedItineraries/PricedItinerary/TPA_Extensions/AdditionalFares/AirItineraryPricingInfo/PTC_FareBreakdowns/PTC_FareBreakdown/PassengerFare/TPA_Extensions/FareComponents/FareComponent``` (для дополнительных вариантов) содержат один и тот же код бренда в качестве значения атрибута ```/@BrandID```, то для всего бронирования должен быть выбран один бренд
- если все указанные выше элементы имеют различный атрибут ```/@BrandID``` или некоторые из указанных элементов не имеют атрибута ```/@BrandID```, то при бронировании должен применяться посегментный выбор бренда

##### Выбор бренда для всего бронирования

Код бренда для всего бронирования нужно указать в элементе ```/CreatePassengerNameRecordRQ/AirPrice/PriceRequestInformation/OptionalQualifiers/PricingQualifiers/Brand```.

*Выбранный бренд рекомендуется сохранить в бронировании в качестве ремарки для последующего использования при перерасчете стоимости в бронировании.*

##### Посегментный выбор брендов

*Обратите внимание на то, что многие перевозчики имеют жесткие требования относительно комбинации различных брендов. Не рекомендуется комбинировать их самостоятельно! Результаты поиска Bargain Finder Max будут содержать только те комбинации брендов, которые разрешены перевозчиком.*

Для посегментного выбора бренда в случае получения расчетов по всем брендам в результатах поиска (сервис BargainFinderMaxRQ) или при проверке стоимости и наличия мест (сервис RevalidateItinRQ) необходимо определить соответствие между элементами ```/OTA_AirLowFareSearchRS/PricedItineraries/PricedItinerary/AirItineraryPricingInfo/PTC_FareBreakdowns/PTC_FareBreakdown/PassengerFare/TPA_Extensions/FareComponents/FareComponent``` (для самой дешевой комбинации брендов) или ```/OTA_AirLowFareSearchRS/PricedItineraries/PricedItinerary/TPA_Extensions/AdditionalFares/AirItineraryPricingInfo/PTC_FareBreakdowns/PTC_FareBreakdown/PassengerFare/TPA_Extensions/FareComponents/FareComponent``` (для дополнительных вариантов) и сегментами. Для этого каждый элемент ```/FareComponent``` содержит дочерние элементы ```/Segment```, каждый из которых соответствует одному сегменту в маршруте перелета. Для установления точного соответствия между элементом ```/Segment``` и сегментами в путешествии используются атрибуты:
- ```/Segment/@LegIndex``` — номер плеча
- ```/Segment/@FlightIndex``` — номер сегмента в плече

После получения соответствия между брендами и сегментами необходимо в запросе указать:
- последовательности сегментов, имеющих одинаковый бренд или не имеющих бренда в элементах ```/CreatePassengerNameRecordRQ/AirPrice/PriceRequestInformation/OptionalQualifiers/PricingQualifiers/ItineraryOptions/SegmentSelect``` со следующими атрибутами:
    - ```/@Number``` — номер сегмента начала последовательности
    - ```/@EndNumber``` — номер сегмента конца последовательности (опционально)
    - ```/@RPH``` — порядковый номер последовательности
- коды брендов в последовательно расположенных элементах ```/CreatePassengerNameRecordRQ/AirPrice/PriceRequestInformation/OptionalQualifiers/PricingQualifiers/Brand```, где в качестве значения атрибута ```/@RPH``` должен быть номер последовательности из предыдущего пункта. Обратите внимание на то, что если для каких-то сегментов код бренда не должен быть использован, то в качестве значения элемента ```/Brand``` для этой последовательности должна быть пустая строка

*Выбранные бренды рекомендуется сохранить в бронировании в качестве ремарок для последующего использования при перерасчете стоимости в бронировании.*

Пример:

| Номер сегмента | Код бренда |
| - | -- |
| 1 | AA |
| 2 | AA |
| 3 | -  |
| 4 | -  |
| 5 | BB |

{% xmlsec "Пример", true %}
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
{% endxmlsec %}

Обратите внимание на то, что добавление наземных сегментов (до момента расчета стоимости, см. ниже) влияет на нумерацию сегментов в бронировании. Например, если в запросе указаны два сегмента SVO-KRR и AER-SVO и запрошено добавление наземных сегментов, то в момент расчета стоимости сегмент AER-SVO будет третьим в бронировании.

#### Расчет стоимости по приватным тарифам

По умолчанию сервис производит расчет по самому дешевому доступному тарифу, доступному для выбранных сегментов вне зависимости от его типа: приватный или публичный.

Однако в запросе можно специально указывать чтобы расчет производился только по публичным или только по приватным тарифам:
- по публичным тарифам — значение ```true``` у атрибута ```/CreatePassengerNameRecordRQ/AirPrice/PriceRequestInformation/OptionalQualifiers/PricingQualifiers/FareOptions/@Public```
- по приватным тарифам — значение ```true``` у атрибута ```/CreatePassengerNameRecordRQ/AirPrice/PriceRequestInformation/OptionalQualifiers/PricingQualifiers/FareOptions/@Private```

Некоторые приватные тарифы требуют ввод специальных кодов для использования их при расчете стоимости:
- список кодов корпоративных скидок (Corporate ID) задается в последовательно расположенных элементах ```/CreatePassengerNameRecordRQ/AirPrice/PriceRequestInformation/OptionalQualifiers/PricingQualifiers/Corporate/ID```
- список аккаунт кодов (Account Code) задается в последовательно расположенных элементах ```/CreatePassengerNameRecordRQ/AirPrice/PriceRequestInformation/OptionalQualifiers/PricingQualifiers/Account/Code```

#### Расчет стоимости по кодам тарифов

**Обратите внимание на то, что расчет стоимости по кодам тарифов рекомендуется только в случае бронирования варианта перелета, который был получен в результатах поиска перелетов с наличием багажа и, который не является брендированным. В противном случае, рекомендуется использовать стандартный способ расчета стоимости вариантов перелетов (указывая или не указывая коды брендов).**

**Для успешного оформления билетов, в бронированиях, в которых был выполнен расчет стоимости по кодам тарифов, требуется включение настройки [Ticket from Stored Fare](tjr-settings.md#ticket_from_stored_fare_oformlenie_biletov_po_sohranennim_pq_bez_pererascheta) в PCC, в котором создается бронирование и оформляются билеты.**

Расчет стоимости по кодам тарифов может приводить к невозможности оформить билет в случае изменения кодов тарифов перевозчика, а также в случае невозможности забронировать выбранный класс бронирования.

##### Выбор кода тарифа для всего бронирования

Код тарифа для всего бронирования нужно указать в элементе ```/CreatePassengerNameRecordRQ/AirPrice/PriceRequestInformation/OptionalQualifiers/PricingQualifiers/SpecificFare/FareBasis```.

##### Посегментный выбор кодов тарифов

Посегментный выбор кодов тарифов требуется в тех случаях, когда расчет стоимости бронирования должен быть выполнен по разным тарифам для разных сегментов. Для посегментного выбора кодов тарифов в запросе необходимо указать:
- последовательности сегментов, имеющих одинаковый код тарифа, в элементах ```/CreatePassengerNameRecordRQ/AirPrice/PriceRequestInformation/OptionalQualifiers/PricingQualifiers/ItineraryOptions/SegmentSelect``` со следующими атрибутами:
    - ```/@Number``` — номер сегмента начала последовательности
    - ```/@EndNumber``` — номер сегмента конца последовательности (опционально)
    - ```/@RPH``` — порядковый номер последовательности
- тарифы в последовательно расположенных элементах ```/CreatePassengerNameRecordRQ/AirPrice/PriceRequestInformation/OptionalQualifiers/PricingQualifiers/SpecificFare``` со следующими дочерними элементами и атрибутами:
    - ```/@RPH``` — номер последовательности из предыдущего пункта
    - ```/FareBasis``` — код тарифа

#### Получение условий обменов и возвратов

Для получения в ответе на запрос условий обменов и возвратов требуется указать значение ```true``` у атрибута ```/CreatePassengerNameRecordRQ/AirPrice/PriceRequestInformation/OptionalQualifiers/PricingQualifiers/SpecificPenalty/@AdditionalInfo```.

#### Выбор форм оплаты

Подробнее о выборе форм оплаты в Sabre см. в [Выбор форм оплаты](fop.md).

В Sabre при выполнении расчета стоимости бронирования можно указать одну или несколько форм оплаты. Возможные варианты форм оплаты:

##### Наличный или безналичный расчет

При использовании наличного или безналичного расчета код формы оплаты необходимо указать в качестве значения атрибута ```/CreatePassengerNameRecordRQ/AirPrice/PriceRequestInformation/OptionalQualifiers/FOP_Qualifiers/BasicFOP/@Type```.

Коды форм оплаты:
- ```CA``` — наличный расчет
- ```CK``` — безналичный расчет

##### Банковская карта

При использовании банковской карты в качестве формы оплаты необходимо добавить элемент ```/CreatePassengerNameRecordRQ/AirPrice/PriceRequestInformation/OptionalQualifiers/FOP_Qualifiers/BasicFOP/CC_Info/PaymentCard``` в запрос и указать следующие атрибуты:
- ```/@Code``` — код платежной системы
- ```/@ExpireDate``` — год и месяц срока истечения действия карты (формат ```YYYY-MM```)
- ```/@ManualApprovalCode``` — код авторизации платежа (в случае наличия)
- ```/@Number``` — номер карты

Список кодов основных платежных систем:
- ```VI``` — Visa
- ```CA``` — Master Card
- ```AX``` — American Express

##### Двойная форма оплаты (наличный или безналичный расчет и кредитная карта)

*Обратите внимание на то, что двойная форма оплаты возможна только для билетов!*

Для использования двух форм оплаты необходимо добавить информацию о каждой в элементы ```/CreatePassengerNameRecordRQ/AirPrice/PriceRequestInformation/OptionalQualifiers/FOP_Qualifiers/BSP_Ticketing/MultipleFOP/FOP_One``` и ```/CreatePassengerNameRecordRQ/AirPrice/PriceRequestInformation/OptionalQualifiers/FOP_Qualifiers/BSP_Ticketing/MultipleFOP/FOP_Two``` соответственно. У данных элементов необходимо указать код формы оплаты в атрибуте ```/@Type```, если используется форма оплаты наличный или безналичный расчет (```CA``` или ```CK```).

В качестве значения атрибута ```/CreatePassengerNameRecordRQ/AirPrice/PriceRequestInformation/OptionalQualifiers/FOP_Qualifiers/BSP_Ticketing/MultipleFOP/Fare/@Amount``` должна быть указана сумма, которая будет списана со второй формы оплаты. Обратите внимание на то, что эта сумма не может превышать величину тарифа для билета.

При использовании двойной формы оплаты оформление билета может производиться только для одного PQ.

#### Сравнение с заданной стоимостью

Сервис позволяет сравнивать полученную при расчете стоимость с заданной в запросе (например, полученной в результатах поиска). Стоимость должна быть указана в качестве значения атрибута ```/CreatePassengerNameRecordRQ/AirPrice/PriceComparison/@AmountSpecified```.

Дополнительно можно указать необходимость остановки выполнения запроса в случае превышения заданной стоимости. Для этого необходимо указать значение ```true``` у атрибута ```/CreatePassengerNameRecordRQ/AirPrice/PriceComparison/AcceptablePriceIncrease/@HaltOnNonAcceptablePrice```.

В элементах ```/CreatePassengerNameRecordRQ/AirPrice/PriceComparison/AcceptablePriceIncrease/Amount``` и ```/CreatePassengerNameRecordRQ/AirPrice/PriceComparison/AcceptablePriceIncrease/Percent``` можно указать абсолютную величину или процент, которые будут являться допустимым уровнем превышения заданной цены.

{% xmlsec "Пример (работа сервиса будет прервана, если стоимость бронирования превышает 10500 рублей)", true %}
<PriceComparison AmountSpecified="10000">
  <AcceptablePriceIncrease HaltOnNonAcceptablePrice="true">
    <Amount>500</Amount>
  </AcceptablePriceIncrease>
</PriceComparison>
{% endxmlsec %}

## Добавление пассажиров

Пассажиры должны быть указаны в элементах ```/CreatePassengerNameRecordRQ/TravelItineraryAddInfo/CustomerInfo/PersonName```:
- ```/GivenName``` — поле имени (см. ниже)
- ```/Surname``` — поле фамилии (см. ниже)
- ```/@NameNumber``` — номер пассажира. Пассажиры в бронировании должны иметь номер от ```1.1``` до ```9.1```
- ```/@PassengerType``` — категория пассажира
- ```/@Infant``` — признак младенца без места

Обратите внимание на то, что максимальная длина полей имени и фамилии — 29 символов. Рекомендуется использовать следующий алгоритм заполнения полей:

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

*Обратите внимание на то, что для успешного создания бронирования, содержащего детей или младенцев, необходима отправка специальных SSR сообщений ```CHLD``` или ```INFT``` (см. ниже).*

*Обратите внимание на то, что в некоторых случаях возраст ребенка может влиять стоимость перелета. В этих случаях рекомендуется указывать возраст ребенка в коде категории пассажира. Например, ```C05``` для пятилетнего ребенка.*

{% xmlsec "Пример", true %}
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
{% endxmlsec %}

## Добавление контактной информации

#### Телефоны

Телефоны указываются в элементах ```/CreatePassengerNameRecordRQ/TravelItineraryAddInfo/CustomerInfo/ContactNumbers/ContactNumber```. Для каждого  телефона необходимо указать:
- ```/@Phone``` — номер телефона (может содержать цифры, буквы латинского алфавита, пробелы, символы ```-```, ```.``` и ```,```)
- ```/@PhoneUseType``` — тип телефона. Возможные значения:
    - ```A``` — телефон агентства
    - ```B``` — рабочий телефон
    - ```F``` — факс
    - ```H``` — домашний телефон
    - ```M``` — мобильный телефон

*Обратите внимание на то, что любое бронирование должно содержать как минимум один телефон.*

{% xmlsec "Пример (телефон агентства и первого пассажира)", true %}
<ContactNumber Phone="74991234567" PhoneUseType="A"/>
<ContactNumber Phone="79851234567" PhoneUseType="M"/>
{% endxmlsec %}

#### Адреса электронной почты

Адреса электронной почты должны быть размещены в качестве значений атрибута ```/CreatePassengerNameRecordRQ/TravelItineraryAddInfo/CustomerInfo/Email/@Address```.

Дополнительно можно указать:
- ```/@NameNumber``` — номер пассажира, которому принадлежит электронная почта
- ```/@Type``` — тип адреса. Возможные значения:
    - ```TO``` — адрес будет в поле To (Кому) письма
    - ```FR``` — адрес будет в поле From (От кого) письма
    - ```CC``` — адрес будет в поле CC (Копия) письма
    - ```BC``` — адрес будет в поле BC (Скрытая копия) письма

*Обратите внимание на то, что в случае добавления адреса электронной почты в бронирование и в случае наличия зарегистрированной на этот адрес учетной записи в [TripCase](https://www.tripcase.com), бронирование автоматически появится в личном кабинете этой учетной записи в TripCase.*

{% xmlsec "Пример (адреса пассажира и агентства (для отправки скрытой копии))", true %}
<Email Address="customer@customer.com" NameNumber="1.1" Type="TO"/>
<Email Address="agency@agency.com" Type="BC"/>
{% endxmlsec %}

## Добавление карт лояльности

Карты лояльности (карты часто летающих пассажиров) должны быть указаны в элементах ```/CreatePassengerNameRecordRQ/TravelItineraryAddInfo/CustomerInfo/CustLoyalty```:
- ```/@MembershipID``` — номер карты лояльности
- ```/@NameNumber``` — номер пассажира
- ```/@ProgramID``` — код перевозчика, выпустившего карту
- ```/@TravelingCarrierCode``` — код маркетингового перевозчика, для сегментов которого будет применена карта лояльности

{% xmlsec "Пример (у первого пассажира карта KL для сегментов SU, у второго пассажира карта SU для сегментов SU)", true %}
<CustLoyalty MembershipID="1234567890" NameNumber="1.1" ProgramID="KL" TravelingCarrierCode="SU"/>
<CustLoyalty MembershipID="0987654321" NameNumber="2.1" ProgramID="SU" TravelingCarrierCode="SU"/>
{% endxmlsec %}

## Добавление паспортных данных и отправка других сообщений перевозчику (SSR и OSI)

#### Паспортные данные (SSR DOCS)

Паспортные данные должны быть добавлены в бронирование и отправлены в виде SSR сообщений с кодом ```DOCS```. Для добавления паспорта или другого документа (например, свидетельства о рождении) необходимо добавить элемент ```/CreatePassengerNameRecordRQ/SpecialReqDetails/SpecialService/SpecialServiceInfo/AdvancePassenger```:
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

*Обратите внимание на то, что большинство перевозчиков требует наличие паспортных данных для всех пассажиров перед оформлением билетов.*

{% xmlsec "Пример отправки паспорта для взрослого", true %}
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
{% endxmlsec %}

{% xmlsec "Пример отправки паспорта для младенца без места (привязывается к сопровождающему взрослому пассажиру с номером 1.1)", true %}
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
{% endxmlsec %}

#### Данные для идентификации личности (SSR FOID)

Некоторые перевозчики требуют отправки дополнительных данных для идентификации личности (SSR с кодом ```FOID```). Для этого необходимо добавить элемент ```/CreatePassengerNameRecordRQ/SpecialReqDetails/SpecialService/SpecialServiceInfo/Service``` со следующими данными:
- ```/@SegmentNumber``` — номер сегмента, к которому будет привязаны данные. Опциональное поле. Возможные значения:
    - номер сегмента (например, ```3```)
    - ```A``` для всех сегментов
- ```/@SSR_Code``` — код SSR. Указывается значение ```FOID```
- ```/PersonName/NameNumber``` — номер пассажира в бронировании (для младенцев указывается их номер)
- ```/Text``` — текст сообщения. Большинство перевозчиков требуют данные в формате ```PP[код страны гражданства][номер паспорта]```

{% xmlsec "Пример", true %}
<Service SSR_Code="FOID">
  <PersonName NameNumber="1.1"/>
  <Text>PPRU1234567890</Text>
</Service>
{% endxmlsec %}

#### Визовая информация (SSR DOCO)

В некоторых случаях перевозчики требуют отправки визовой информации (SSR с кодом ```DOCO```). Для этого необходимо добавить элемент ```/CreatePassengerNameRecordRQ/SpecialReqDetails/SpecialService/SpecialServiceInfo/AdvancePassenger``` со следующими данными:
- ```/@SegmentNumber``` — номер сегмента, к которому будет привязаны данные. Опциональное поле. Возможные значения:
    - номер сегмента (например, ```3```)
    - ```A``` для всех сегментов
- ```/Document/@Type``` — тип документа (всегда указывается значение ```V```)
- ```/Document/@Number``` — номер визы
- ```/Document/Visa/@IssueDate``` — дата получения визы
- ```/Document/Visa/ApplicableCountry``` — код страны действия визы
- ```/Document/Visa/PlaceOfBirth``` — место рождения (город и код страны, например ```MOSCOW RU```)
- ```/Document/Visa/PlaceOfIssue``` — место получения визы (город и код страны)
- ```/PersonName/@NameNumber``` — номер пассажира визы бронировании

{% xmlsec "Пример", true %}
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
{% endxmlsec %}

#### Данные о месте пребывания или проживания в стране назначения (SSR DOCA)

В некоторых случаях перевозчики требуют отправки данных о месте пребывания или проживания в стране назначения  (SSR с кодом ```DOCA```). Для этого необходимо добавить элемент ```/CreatePassengerNameRecordRQ/SpecialReqDetails/SpecialService/SpecialServiceInfo/AdvancePassenger``` со следующими данными:
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

{% xmlsec "Пример", true %}
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
{% endxmlsec %}

#### Данные о младенцах (SSR INFT)

При добавлении в бронирование младенцев без места требуется отправка специального сообщения (SSR с кодом ```INFT```). Для этого необходимо добавить элемент ```/CreatePassengerNameRecordRQ/SpecialReqDetails/SpecialService/SpecialServiceInfo/Service``` со следующими данными:
- ```/@SegmentNumber``` — номер сегмента, к которому будет привязаны данные. Опциональное поле. Возможные значения:
    - номер сегмента (например, ```3```)
    - ```A``` для всех сегментов
- ```/@SSR_Code``` — код SSR. Указывается значение ```INFT```
- ```/PersonName/NameNumber``` — номер сопровождающего взрослого пассажира
- ```/Text``` — текст сообщения в формате ```[фамилия (как при добавлении пассажира)]/[имя (как при добавлении пассажира, включая титул)]/[дата рождения в формате ДДМММГГ]```

*Обратите внимание на то, что система не разрешает сохранение бронирования с младенцами без места без отправки SSR с кодом ```INFT``` для каждого младенца без места. Одного взрослого пассажира может сопровождать только один младенец без места.*

{% xmlsec "Пример", true %}
<Service SSR_Code="INFT">
  <PersonName NameNumber="1.1"/>
  <Text>IVANOVA/EKATERINA/20FEB16</Text>
</Service>
{% endxmlsec %}

#### Данные о детях (SSR CHLD)

При добавлении в бронирование детей некоторые перевозчики требуют добавление специального сообщения (SSR с кодом ```CHLD```). Для этого необходимо добавить элемент ```/CreatePassengerNameRecordRQ/SpecialReqDetails/SpecialService/SpecialServiceInfo/Service``` со следующими данными:
- ```/@SegmentNumber``` — номер сегмента, к которому будет привязаны данные. Опциональное поле. Возможные значения:
    - номер сегмента (например, ```3```)
    - ```A``` для всех сегментов
- ```/@SSR_Code``` — код SSR. Указывается значение ```CHLD```
- ```/PersonName/NameNumber``` — номер пассажира в бронировании
- ```/Text``` — текст сообщения с датой рождения ребенка в формате ```ДДМММГГ```

{% xmlsec "Пример", true %}
<Service SSR_Code="CHLD">
  <PersonName NameNumber="3.1"/>
  <Text>15JAN10</Text>
</Service>
{% endxmlsec %}

#### Контактные данные (SSR CTCE/CTCM/CTCR)

Номер телефона пассажира может быть добавлен в бронирование и отправлен в виде SSR сообщения с кодом ```CTCM```. Для этого необходимо добавить элемент ```/CreatePassengerNameRecordRQ/SpecialReqDetails/SpecialService/SpecialServiceInfo/Service``` со следующими данными:
- ```/@SegmentNumber``` — номер сегмента, к которому будет привязаны данные. Опциональное поле. Возможные значения:
    - номер сегмента (например, ```3```)
    - ```A``` для всех сегментов
- ```/@SSR_Code``` — код SSR. Указывается значение ```CTCM```
- ```/PersonName/NameNumber``` — номер пассажира в бронировании
- ```/Text``` — номер телефона пассажира (только цифры). Опционально можно добавить двухбуквенный код предпочтительного для пассажира языка общения после символа ```/```, например ```/RU``` для русского языка.

{% xmlsec "Пример", true %}
<Service SSR_Code="CTCM">
  <PersonName NameNumber="1.1"/>
  <Text>79851234567/RU</Text>
</Service>
{% endxmlsec %}

Адрес электронной почты может быть добавлен в бронирование и отправлен в виде SSR сообщения с кодом ```CTCE```. Для этого необходимо добавить элемент ```/CreatePassengerNameRecordRQ/SpecialReqDetails/SpecialService/SpecialServiceInfo/Service``` со следующими данными:
- ```/@SegmentNumber``` — номер сегмента, к которому будет привязаны данные. Опциональное поле. Возможные значения:
    - номер сегмента (например, ```3```)
    - ```A``` для всех сегментов
- ```/@SSR_Code``` — код SSR. Указывается значение ```CTCE```
- ```/PersonName/NameNumber``` — номер пассажира в бронировании
- ```/Text``` — адрес электронной почты пассажира (только буквы, цифры и знак ```.```). Опционально можно добавить двухбуквенный код предпочтительного для пассажира языка общения после символа ```/```, например ```/RU``` для русского языка. Для замены спецсимволов в адресе необходимо провести следующие замены:
    - ```//``` вместо ```@```
    - ```..``` вместо ```_```
    - ```/``` вместо ```-```

{% xmlsec "Пример", true %}
<Service SSR_Code="CTCE">
  <PersonName NameNumber="1.1"/>
  <Text>CUSTOMER//CUSTOMER.COM/RU</Text>
</Service>
{% endxmlsec %}

В случае отказа пассажира от передачи контактных данных, необходимо передать SSR сообщение с кодом ```CTCR```. Для этого необходимо добавить элемент ```/CreatePassengerNameRecordRQ/SpecialReqDetails/SpecialService/SpecialServiceInfo/Service``` со следующими данными:
- ```/@SegmentNumber``` — номер сегмента, к которому будет привязаны данные. Опциональное поле. Возможные значения:
    - номер сегмента (например, ```3```)
    - ```A``` для всех сегментов
- ```/@SSR_Code``` — код SSR. Указывается значение ```CTCE```
- ```/PersonName/NameNumber``` — номер пассажира в бронировании
- ```/Text``` — сообщение об отказе предоставления контактной информации, например ```REFUSED```

{% xmlsec "Пример", true %}
<Service SSR_Code="CTCR">
  <PersonName NameNumber="1.1"/>
  <Text>REFUSED</Text>
</Service>
{% endxmlsec %}

#### Другие SSR сообщения

Для отправки других SSR (Special Service Request) сообщений необходимо добавить элемент ```/CreatePassengerNameRecordRQ/SpecialReqDetails/SpecialService/SpecialServiceInfo/Service``` со следующими данными:
- ```/@SegmentNumber``` — номер сегмента, к которому будет привязаны данные. Опциональное поле. Возможные значения:
    - номер сегмента (например, ```3```)
    - ```A``` для всех сегментов
- ```/@SSR_Code``` — код SSR
- ```/PersonName/NameNumber``` — номер пассажира
- ```/Text``` — текст сообщения

{% xmlsec "Пример", true %}
<Service SSR_Code="OTHS">
  <PersonName NameNumber="1.1"/>
  <Text>SSR TEXT HERE</Text>
</Service>
{% endxmlsec %}

#### OSI сообщения

Для отправки OSI (Other Service Information) сообщений необходимо добавить элемент ```/CreatePassengerNameRecordRQ/SpecialReqDetails/SpecialService/SpecialServiceInfo/Service``` со следующими данными:
- ```/VendorPrefs/Airline/@Code``` — код перевозчика
- ```/@SSR_Code``` — код сообщения. Всегда ```OSI```
- ```/PersonName/NameNumber``` — номер пассажира
- ```/Text``` — текст сообщения

{% xmlsec "Пример", true %}
<Service SSR_Code="OSI">
  <Text>OSI TEXT</Text>
  <VendorPrefs>
    <Airline Code="SU"/>
  </VendorPrefs>
</Service>
{% endxmlsec %}

## Добавление ремарок

Ремарки — дополнительная текстовая информация, которая может быть добавлена в бронирование. Ремарк могут содержать буквы латинского алфавита, цифры, пробелы, символы ```-```, ```.``` и ```,```. Длина каждой ремарки не может превышать 70 символов. В одном запросе можно передать не более 98 ремарок. Общее число ремарок не должно превышать 999 штук.

Для каждой ремарки необходимо добавление элемента ```/CreatePassengerNameRecordRQ/SpecialReqDetails/AddRemark/RemarkInfo/Remark```:
- ```/@Type``` — тип ремарки. Всегда ```General```
- ```/Text``` — текст ремарки

{% xmlsec "Пример", true %}
<Remark Type="General">
  <Text>TEST REMARK</Text>
</Remark>
{% endxmlsec %}

## Установка тайм-лимита

При создании бронирования необходимо установить тайм-лимит бронирования в элементе ```/CreatePassengerNameRecordRQ/TravelItineraryAddInfo/AgencyInfo/Ticketing```.

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

Подробнее о тайм-лимите бронирований см. в разделе [Тайм-лимиты бронирований](timelimit.md).

## Завершающая обработка бронирования

#### Добавление наземных сегментов

В Sabre все сегменты в бронировании должны идти последовательно без разрывов, т.е. город отправления (**не аэропорт!**) следующего сегмента должен быть равен городу прибытия предыдущего сегмента. Если в бронировании есть разрывы, то необходимо вставить специальные наземные сегменты — ARUNK (Arrival Unknown).

Для добавления наземных сегментов в сервисе EnhancedAirBookRQ необходимо добавить в запрос элемент ```/EnhancedAirBookRQ/PostProcessing/ARUNK_RQ```. Этот элемент можно указывать во всех запросах, если наземный сегмент не требуется, то он просто не будет вставлен в бронирование, при этом выполнение запроса не прервется.

По умолчанию наземные сегменты будут добавлены после момента расчета стоимости, однако, если указать значение ```true``` у атрибута ```/CreatePassengerNameRecordRQ/PostProcessing/ARUNK/@priorPricing```, то наземные сегменты будут добавлены до момента расчета стоимости.

#### Сохранение бронирования

Для сохранения бронирования требуется добавить в запрос элемент ```/CreatePassengerNameRecordRQ/PostProcessing/EndTransactionRQ``` и указать значение поля Received From (используется для идентификации инициатора изменений в истории бронирования) в качестве значения атрибута ```/CreatePassengerNameRecordRQ/PostProcessing/EndTransactionRQ/Source/@ReceivedFrom```.

#### Помещение бронирования в очередь

Сервис позволяет поместить бронирование в очередь после сохранения бронирования. Для этого требуется добавить элемент ```/CreatePassengerNameRecordRQ/PostProcessing/QueuePlace/QueueInfo/QueueIdentifier``` со следующими атрибутами:
- ```/@Number``` — номер очереди
- ```/@PseudoCityCode``` — PCC (опционально)

По умолчанию бронирование попадет в очередь в том PCC, в котором было создано бронирование. Для помещения бронирования в очередь в другом PCC требуется наличие между двумя PCC Branch Access. Подробнее о Branch Access см. в разделе [Конфигурация Sabre](configuration.md).

{% xmlsec "Пример", true %}
<QueueInfo>
  <QueueIdentifier Number="100" PseudoCityCode="8XFG"/>
</QueueInfo>
{% endxmlsec %}

Для отправки бронирования в несколько очередей необходимо добавить элементы ```QueueIdentifier``` с указанными выше атрибутами для каждой очереди внутри элемента ```/CreatePassengerNameRecordRQ/PostProcessing/QueuePlace/MultiQueuePlace```.

{% xmlsec "Пример", true %}
<MultiQueuePlace>
  <QueueIdentifier Number="100" PseudoCityCode="8XFG"/>
  <QueueIdentifier Number="101" PseudoCityCode="8XFG"/>
  <QueueIdentifier Number="102" PseudoCityCode="8XFG"/>
</MultiQueuePlace>
{% endxmlsec %}

#### Проверка подтверждения сегментов бронирования

Сервис позволяет проверить статусы сегментов бронирования после сохранения бронирования. Для этого требуется добавить элемент ```/CreatePassengerNameRecordRQ/PostProcessing/PostBookingHKValidation``` со следующими атрибутами:
- ```/@waitInterval``` — временной интервал между проверками в миллисекундах (от 100 до 10000 миллисекунд)
- ```/@numAttempts``` — количество попыток проверок (от 1 до 6)

В случае, если не все сегменты будут иметь статусы ```HK``` (сегмент подтвержден), сервис выдаст предупреждение в ответе.

Данная проверка может быть полезна при бронировании кодшер перелетов, когда маркетинговый перевозчик сначала подтверждает сегменты, а после получения ответа от оперирующего перевозчика, отменяет подтверждение у сегментов.

#### Проверка наличия локаторов перевозчиков

Сервис позволяет проверить наличие локаторов перевозчиков у всех сегментов после сохранения бронирования. Для этого требуется добавить элемент ```/CreatePassengerNameRecordRQ/PostProcessing/WaitForAirlineRecLoc``` со следующими атрибутами:
- ```/@waitInterval``` — временной интервал между проверками в миллисекундах (от 100 до 10000 миллисекунд)
- ```/@numAttempts``` — количество попыток проверок (от 1 до 6)

В случае, если не все сегменты будут иметь локаторы перевозчиков, сервис выдаст предупреждение в ответе.

#### Чтение бронирования

Сервис позволяет прочитать полученное бронирование после успешного завершения работы всех предыдущих операций (включая сохранение бронирования) и вернуть его содержимое в ответе. Для этого необходимо добавить элемент ```/CreatePassengerNameRecordRQ/PostProcessing/RedisplayReservation```.

## Пример

{% xmlsec "Пример запроса", false %}
<CreatePassengerNameRecordRQ haltOnAirPriceError="true" haltOnInvalidMCT="true" targetCity="2FRH" version="2.3.0" xmlns="http://services.sabre.com/sp/reservation/v2_3">
  <TravelItineraryAddInfo>
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
  </TravelItineraryAddInfo>
  <AirBook>
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
      <FlightSegment DepartureDateTime="2020-09-01T00:00:00" FlightNumber="1138" NumberInParty="3" ResBookDesigCode="Y" Status="NN">
        <DestinationLocation LocationCode="AER"/>
        <MarketingAirline Code="SU" FlightNumber="1138"/>
        <OriginLocation LocationCode="SVO"/>
      </FlightSegment>
      <FlightSegment DepartureDateTime="2020-09-08T00:00:00" FlightNumber="1129" NumberInParty="3" ResBookDesigCode="Y" Status="NN">
        <DestinationLocation LocationCode="SVO"/>
        <MarketingAirline Code="SU" FlightNumber="1129"/>
        <OriginLocation LocationCode="AER"/>
      </FlightSegment>
    </OriginDestinationInformation>
    <RedisplayReservation NumAttempts="10" WaitInterval="500"/>
  </AirBook>
  <AirPrice>
    <PriceComparison AmountSpecified="177220"/>
    <PriceRequestInformation Retain="true">
      <OptionalQualifiers>
        <FlightQualifiers>
          <VendorPrefs>
            <Airline Code="SU"/>
          </VendorPrefs>
        </FlightQualifiers>
        <PricingQualifiers>
          <Brand>EC</Brand>
          <SpecificPenalty AdditionalInfo="true"/>
        </PricingQualifiers>
      </OptionalQualifiers>
    </PriceRequestInformation>
  </AirPrice>
  <SpecialReqDetails>
    <AddRemark>
      <RemarkInfo>
        <Remark Type="General">
          <Text>TEXT REMARK</Text>
        </Remark>
      </RemarkInfo>
    </AddRemark>
    <SpecialService>
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
          <PersonName DateOfBirth="2019-02-20" DocumentHolder="false" Gender="FI" NameNumber="1.1">
            <GivenName>EKATERINA</GivenName>
            <MiddleName>IVANOVNA</MiddleName>
            <Surname>IVANOVA</Surname>
          </PersonName>
        </AdvancePassenger>
        <Service SSR_Code="INFT">
          <PersonName NameNumber="1.1"/>
          <Text>IVANOVA/EKATERINA/20FEB19</Text>
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
    </SpecialService>
  </SpecialReqDetails>
  <PostProcessing>
    <EndTransaction>
      <Source ReceivedFrom="API"/>
    </EndTransaction>
    <WaitForAirlineRecLoc numAttempts="6" waitInterval="500"/>
    <RedisplayReservation/>
  </PostProcessing>
</CreatePassengerNameRecordRQ>
{% endxmlsec %}

{% xmlsec "Пример ответа", false %}
<CreatePassengerNameRecordRS xmlns="http://services.sabre.com/sp/reservation/v2_3">
  <ApplicationResults status="Complete" xmlns="http://services.sabre.com/STL_Payload/v02_01">
    <Success timeStamp="2020-01-22T03:15:19.998-06:00"/>
    <Warning timeStamp="2020-01-22T03:15:18.930-06:00" type="BusinessLogic">
      <SystemSpecificResults>
        <Message code="WARN.SWS.HOST.WARNING_RESPONSE">EndTransactionLLSRQ: TTY REQ PEND</Message>
      </SystemSpecificResults>
    </Warning>
  </ApplicationResults>
  <ItineraryRef ID="XQSTDE"/>
  <AirBook>
    <OriginDestinationOption>
      <FlightSegment ArrivalDateTime="09-01T10:15" DepartureDateTime="09-01T07:45" FlightNumber="1138" NumberInParty="003" ResBookDesigCode="Y" Status="NN" eTicket="true">
        <DestinationLocation LocationCode="AER"/>
        <MarketingAirline Code="SU" FlightNumber="1138"/>
        <OriginLocation LocationCode="SVO"/>
      </FlightSegment>
      <FlightSegment ArrivalDateTime="09-08T05:20" DepartureDateTime="09-08T02:45" FlightNumber="1129" NumberInParty="003" ResBookDesigCode="Y" Status="NN" eTicket="true">
        <DestinationLocation LocationCode="SVO"/>
        <MarketingAirline Code="SU" FlightNumber="1129"/>
        <OriginLocation LocationCode="AER"/>
      </FlightSegment>
    </OriginDestinationOption>
  </AirBook>
  <AirPrice>
    <PriceComparison AmountReturned="177220" AmountSpecified="177220"/>
    <PriceQuote>
      <MiscInformation>
        <BaggageInfo>
          <SubCodeProperties RPH="1" SolutionSequenceNmbr="1">
            <AncillaryFeeGroupCode>BG</AncillaryFeeGroupCode>
            <AncillaryService SubGroupCode="CY">
              <Text>CARRY ON HAND BAGGAGE</Text>
            </AncillaryService>
            <CommercialNameofBaggageItemType>CARRY10KG 22LB 55L X 40W X 25H</CommercialNameofBaggageItemType>
            <DescriptionOne Code="10">
              <Text>UP TO 22 POUNDS/10 KILOGRAMS</Text>
            </DescriptionOne>
            <DescriptionTwo Code="55">
              <Text>55CM LENGTH X 40CM WIDTH X 25CM HEIGHT</Text>
            </DescriptionTwo>
            <EMD_Type>4</EMD_Type>
            <ExtendedSubCodeKey>08AACSU</ExtendedSubCodeKey>
            <RFIC>C</RFIC>
            <SizeWeightInfo>
              <MaximumWeightInAlternate Units="K">10</MaximumWeightInAlternate>
              <MaximumWeight Units="L">22</MaximumWeight>
            </SizeWeightInfo>
          </SubCodeProperties>
          <SubCodeProperties RPH="2" SolutionSequenceNmbr="1">
            <AncillaryFeeGroupCode>BG</AncillaryFeeGroupCode>
            <CommercialNameofBaggageItemType>FREE BAGGAGE ALLOWANCE</CommercialNameofBaggageItemType>
            <EMD_Type>4</EMD_Type>
            <ExtendedSubCodeKey>0DFAASU</ExtendedSubCodeKey>
          </SubCodeProperties>
          <SubCodeProperties RPH="3" SolutionSequenceNmbr="1">
            <AncillaryFeeGroupCode>BG</AncillaryFeeGroupCode>
            <CommercialNameofBaggageItemType>UPTO 22LB 10KG AND45LI 115LCM</CommercialNameofBaggageItemType>
            <DescriptionOne Code="10">
              <Text>UP TO 22 POUNDS/10 KILOGRAMS</Text>
            </DescriptionOne>
            <DescriptionTwo Code="4U">
              <Text>UP TO 45 LINEAR INCHES/115 LINEAR CENTIMETERS</Text>
            </DescriptionTwo>
            <EMD_Type>4</EMD_Type>
            <ExtendedSubCodeKey>0E3ACSU</ExtendedSubCodeKey>
            <RFIC>C</RFIC>
            <SizeWeightInfo>
              <MaximumSizeInAlternate Units="C">115</MaximumSizeInAlternate>
              <MaximumSize Units="I">45</MaximumSize>
              <MaximumWeightInAlternate Units="K">10</MaximumWeightInAlternate>
              <MaximumWeight Units="L">22</MaximumWeight>
            </SizeWeightInfo>
          </SubCodeProperties>
          <SubCodeProperties RPH="4" SolutionSequenceNmbr="1">
            <AncillaryFeeGroupCode>BG</AncillaryFeeGroupCode>
            <CommercialNameofBaggageItemType>UPTO50LB 23KG AND62LI 158LCM</CommercialNameofBaggageItemType>
            <DescriptionOne Code="23">
              <Text>UP TO 50 POUNDS/23 KILOGRAMS</Text>
            </DescriptionOne>
            <DescriptionTwo Code="6U">
              <Text>UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS</Text>
            </DescriptionTwo>
            <EMD_Type>2</EMD_Type>
            <ExtendedSubCodeKey>0GOACSU</ExtendedSubCodeKey>
            <RFIC>C</RFIC>
            <SizeWeightInfo>
              <MaximumSizeInAlternate Units="C">158</MaximumSizeInAlternate>
              <MaximumSize Units="I">62</MaximumSize>
              <MaximumWeightInAlternate Units="K">23</MaximumWeightInAlternate>
              <MaximumWeight Units="L">50</MaximumWeight>
            </SizeWeightInfo>
          </SubCodeProperties>
          <SubCodeProperties RPH="5" SolutionSequenceNmbr="1">
            <AncillaryFeeGroupCode>BG</AncillaryFeeGroupCode>
            <AncillaryService SubGroupCode="CY">
              <Text>CARRY ON HAND BAGGAGE</Text>
            </AncillaryService>
            <CommercialNameofBaggageItemType>CARRYON HAND BAGGAGE ALLOWANCE</CommercialNameofBaggageItemType>
            <EMD_Type>4</EMD_Type>
            <ExtendedSubCodeKey>0LNABSU</ExtendedSubCodeKey>
          </SubCodeProperties>
          <SubCodeProperties RPH="6" SolutionSequenceNmbr="1">
            <AncillaryFeeGroupCode>BG</AncillaryFeeGroupCode>
            <CommercialNameofBaggageItemType>PREPAID BAGGAGE 23KG</CommercialNameofBaggageItemType>
            <DescriptionOne Code="23">
              <Text>UP TO 50 POUNDS/23 KILOGRAMS</Text>
            </DescriptionOne>
            <EMD_Type>2</EMD_Type>
            <ExtendedSubCodeKey>0C3ACSU</ExtendedSubCodeKey>
            <RFIC>C</RFIC>
            <SizeWeightInfo>
              <MaximumWeightInAlternate Units="K">23</MaximumWeightInAlternate>
              <MaximumWeight Units="L">50</MaximumWeight>
            </SizeWeightInfo>
          </SubCodeProperties>
        </BaggageInfo>
        <HeaderInformation SolutionSequenceNmbr="1">
          <DepartureDate>2020-09-01</DepartureDate>
          <LastTicketingDate>08-27T23:59</LastTicketingDate>
          <Text>VALIDATING CARRIER SPECIFIED - SU</Text>
          <Text>CHG BEF DEP UP TO RUB2600/CHG AFT DEP UP TO RUB2600/REF BEF DEP</Text>
          <Text>UP TO RUB2600/REF AFT DEP UP TO RUB5200/OTHERWISE NON-CHG</Text>
          <Text>NON-REF/SEE RULES</Text>
          <Text>BAG ALLOWANCE     -SVOAER-01P/SU/EACH PIECE UP TO 50 POUNDS/23</Text>
          <Text>KILOGRAMS AND UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS</Text>
          <Text>2NDCHECKED BAG FEE-SVOAER-RUB2000/SU/UP TO 50 POUNDS/23 KILOGRA</Text>
          <Text>MS</Text>
          <Text>BAG ALLOWANCE     -AERSVO-01P/SU/EACH PIECE UP TO 50 POUNDS/23</Text>
          <Text>KILOGRAMS AND UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS</Text>
          <Text>2NDCHECKED BAG FEE-AERSVO-RUB2000/SU/UP TO 50 POUNDS/23 KILOGRA</Text>
          <Text>MS</Text>
          <Text>CARRY ON ALLOWANCE</Text>
          <Text>SVOAER AERSVO-01P/SU</Text>
          <Text>01/UP TO 22 POUNDS/10 KILOGRAMS AND 55CM LENGTH X 40CM WIDTH X</Text>
          <Text>25CM HEIGHT</Text>
          <Text>CARRY ON CHARGES</Text>
          <Text>SVOAER AERSVO-SU-CARRY ON FEES UNKNOWN-CONTACT CARRIER</Text>
          <Text>ADDITIONAL ALLOWANCES AND/OR DISCOUNTS MAY APPLY DEPENDING ON</Text>
          <Text>FLYER-SPECIFIC FACTORS /E.G. FREQUENT FLYER STATUS/MILITARY/</Text>
          <Text>CREDIT CARD FORM OF PAYMENT/EARLY PURCHASE OVER INTERNET,ETC./</Text>
          <Text>EACH CNN REQUIRES ACCOMPANYING SAME CABIN ADT</Text>
          <Text>VALIDATING CARRIER SPECIFIED - SU</Text>
          <Text>CHG BEF DEP UP TO RUB2600/CHG AFT DEP UP TO RUB2600/REF BEF DEP</Text>
          <Text>UP TO RUB2600/REF AFT DEP UP TO RUB5200/OTHERWISE NON-CHG</Text>
          <Text>NON-REF/SEE RULES</Text>
          <Text>BAG ALLOWANCE     -SVOAER-01P/SU/EACH PIECE UP TO 50 POUNDS/23</Text>
          <Text>KILOGRAMS AND UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS</Text>
          <Text>2NDCHECKED BAG FEE-SVOAER-RUB2000/SU/UP TO 50 POUNDS/23 KILOGRA</Text>
          <Text>MS</Text>
          <Text>BAG ALLOWANCE     -AERSVO-01P/SU/EACH PIECE UP TO 50 POUNDS/23</Text>
          <Text>KILOGRAMS AND UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS</Text>
          <Text>2NDCHECKED BAG FEE-AERSVO-RUB2000/SU/UP TO 50 POUNDS/23 KILOGRA</Text>
          <Text>MS</Text>
          <Text>CARRY ON ALLOWANCE</Text>
          <Text>SVOAER AERSVO-01P/SU</Text>
          <Text>01/UP TO 22 POUNDS/10 KILOGRAMS AND 55CM LENGTH X 40CM WIDTH X</Text>
          <Text>25CM HEIGHT</Text>
          <Text>CARRY ON CHARGES</Text>
          <Text>SVOAER AERSVO-SU-CARRY ON FEES UNKNOWN-CONTACT CARRIER</Text>
          <Text>ADDITIONAL ALLOWANCES AND/OR DISCOUNTS MAY APPLY DEPENDING ON</Text>
          <Text>FLYER-SPECIFIC FACTORS /E.G. FREQUENT FLYER STATUS/MILITARY/</Text>
          <Text>CREDIT CARD FORM OF PAYMENT/EARLY PURCHASE OVER INTERNET,ETC./</Text>
          <Text>REQUIRES ACCOMPANYING ADT PASSENGER</Text>
          <Text>EACH INF REQUIRES ACCOMPANYING ADT PASSENGER</Text>
          <Text>VALIDATING CARRIER SPECIFIED - SU</Text>
          <Text>CHG BEF DEP UP TO RUB0/CHG AFT DEP UP TO RUB0/REF BEF DEP UP TO</Text>
          <Text>RUB0/REF AFT DEP UP TO RUB5200/OTHERWISE NON-CHG NON-REF/SEE</Text>
          <Text>RULES</Text>
          <Text>BAG ALLOWANCE     -SVOAER-01P/SU/EACH PIECE UP TO 22 POUNDS/10</Text>
          <Text>KILOGRAMS AND UP TO 45 LINEAR INCHES/115 LINEAR CENTIMETERS</Text>
          <Text>2NDCHECKED BAG FEE-SVOAER-RUB2000/SU/UP TO 50 POUNDS/23 KILOGRA</Text>
          <Text>MS</Text>
          <Text>BAG ALLOWANCE     -AERSVO-01P/SU/EACH PIECE UP TO 22 POUNDS/10</Text>
          <Text>KILOGRAMS AND UP TO 45 LINEAR INCHES/115 LINEAR CENTIMETERS</Text>
          <Text>2NDCHECKED BAG FEE-AERSVO-RUB2000/SU/UP TO 50 POUNDS/23 KILOGRA</Text>
          <Text>MS</Text>
          <Text>CARRY ON ALLOWANCE</Text>
          <Text>SVOAER AERSVO-NIL/SU</Text>
          <Text>CARRY ON CHARGES</Text>
          <Text>SVOAER AERSVO-SU-CARRY ON FEES UNKNOWN-CONTACT CARRIER</Text>
          <Text>ADDITIONAL ALLOWANCES AND/OR DISCOUNTS MAY APPLY DEPENDING ON</Text>
          <Text>FLYER-SPECIFIC FACTORS /E.G. FREQUENT FLYER STATUS/MILITARY/</Text>
          <Text>CREDIT CARD FORM OF PAYMENT/EARLY PURCHASE OVER INTERNET,ETC./</Text>
          <Text>ELECTRONIC TICKETING NOT VALID FOR INFANTS</Text>
          <Text>01SEP DEPARTURE DATE-----LAST DAY TO PURCHASE 27AUG/2359</Text>
          <ValidatingCarrier Code="SU"/>
        </HeaderInformation>
        <SolutionInformation SolutionSequenceNmbr="1">
          <BaseFareCurrencyCode>RUB</BaseFareCurrencyCode>
          <CurrencyCode>RUB</CurrencyCode>
          <GrandTotalEquivFareAmount>159500</GrandTotalEquivFareAmount>
          <GrandTotalTaxes>17720</GrandTotalTaxes>
          <RequiresRebook>false</RequiresRebook>
          <TicketNumber>0</TicketNumber>
          <TotalAmount>177220</TotalAmount>
        </SolutionInformation>
        <ValidatingCarrier NewValidatingProcess="true" SolutionSequenceNmbr="1">
          <SettlementMethod>BSP</SettlementMethod>
          <Ticket CarrierCode="SU" Type="ETKTREQ" ValidatingCarrierType="Default"/>
        </ValidatingCarrier>
      </MiscInformation>
      <PricedItinerary AlternativePricing="false" CurrencyCode="RUB" MultiTicket="false" TotalAmount="177220">
        <AirItineraryPricingInfo SolutionSequenceNmbr="1">
          <BaggageProvisions RPH="1">
            <Associations>
              <CarrierCode RPH="1">SU</CarrierCode>
              <CountForSegmentAssociatedID>1</CountForSegmentAssociatedID>
              <DepartureDate RPH="1">2020-09-01</DepartureDate>
              <DestinationLocation LocationCode="AER" RPH="1"/>
              <FlightNumber RPH="1">1138</FlightNumber>
              <OriginLocation LocationCode="SVO" RPH="1"/>
              <PNR_Segment RPH="1">2</PNR_Segment>
              <ResBookDesigCode RPH="1">Y</ResBookDesigCode>
              <StatusCode RPH="1">SS</StatusCode>
            </Associations>
            <CarrierWhoseBaggageProvisionsApply>SU</CarrierWhoseBaggageProvisionsApply>
            <NumPiecesBDI>1</NumPiecesBDI>
            <NumPiecesITR>1</NumPiecesITR>
            <ProvisionType>A</ProvisionType>
            <SubCodeInfo>
              <SubCodeForAllowance RPH="1">0GOACSU</SubCodeForAllowance>
              <SubCodeForChargesOthers>0DFAASU</SubCodeForChargesOthers>
            </SubCodeInfo>
          </BaggageProvisions>
          <BaggageProvisions RPH="2">
            <Associations>
              <CarrierCode RPH="1">SU</CarrierCode>
              <CountForSegmentAssociatedID>1</CountForSegmentAssociatedID>
              <DepartureDate RPH="1">2020-09-01</DepartureDate>
              <DestinationLocation LocationCode="AER" RPH="1"/>
              <FlightNumber RPH="1">1138</FlightNumber>
              <OriginLocation LocationCode="SVO" RPH="1"/>
              <PNR_Segment RPH="1">2</PNR_Segment>
              <ResBookDesigCode RPH="1">Y</ResBookDesigCode>
              <StatusCode RPH="1">SS</StatusCode>
            </Associations>
            <CarrierWhoseBaggageProvisionsApply>SU</CarrierWhoseBaggageProvisionsApply>
            <Commissionable>N</Commissionable>
            <FeeApplicationIndicator>4</FeeApplicationIndicator>
            <FeeNotGuaranteedIndicator>N</FeeNotGuaranteedIndicator>
            <FirstOccurrence>1</FirstOccurrence>
            <Interlineable>Y</Interlineable>
            <LastOccurrence>1</LastOccurrence>
            <PassengerType Code="ADT"/>
            <PriceInformation>
              <Base Amount="2000" CurrencyCode="RUB"/>
              <Equiv Amount="2000" CurrencyCode="RUB"/>
              <TaxIndicator>X</TaxIndicator>
              <Total>2000</Total>
            </PriceInformation>
            <ProvisionType>C</ProvisionType>
            <RefundForm>1</RefundForm>
            <RefundReissue>Y</RefundReissue>
            <SubCodeInfo>
              <SubCodeForChargesOthers>0C3ACSU</SubCodeForChargesOthers>
            </SubCodeInfo>
          </BaggageProvisions>
          <BaggageProvisions RPH="3">
            <Associations>
              <CarrierCode RPH="1">SU</CarrierCode>
              <CountForSegmentAssociatedID>1</CountForSegmentAssociatedID>
              <DepartureDate RPH="1">2020-09-01</DepartureDate>
              <DestinationLocation LocationCode="AER" RPH="1"/>
              <FlightNumber RPH="1">1138</FlightNumber>
              <OriginLocation LocationCode="SVO" RPH="1"/>
              <PNR_Segment RPH="1">2</PNR_Segment>
              <ResBookDesigCode RPH="1">Y</ResBookDesigCode>
              <StatusCode RPH="1">SS</StatusCode>
            </Associations>
            <CarrierWhoseBaggageProvisionsApply>SU</CarrierWhoseBaggageProvisionsApply>
            <Commissionable>N</Commissionable>
            <FeeApplicationIndicator>4</FeeApplicationIndicator>
            <FeeNotGuaranteedIndicator>N</FeeNotGuaranteedIndicator>
            <FirstOccurrence>1</FirstOccurrence>
            <Interlineable>Y</Interlineable>
            <LastOccurrence>1</LastOccurrence>
            <PassengerType Code="ADT"/>
            <PriceInformation>
              <Base Amount="2000" CurrencyCode="RUB"/>
              <Equiv Amount="2000" CurrencyCode="RUB"/>
              <TaxIndicator>X</TaxIndicator>
              <Total>2000</Total>
            </PriceInformation>
            <ProvisionType>P</ProvisionType>
            <RefundForm>1</RefundForm>
            <RefundReissue>Y</RefundReissue>
            <SubCodeInfo>
              <SubCodeForChargesOthers>0C3ACSU</SubCodeForChargesOthers>
            </SubCodeInfo>
          </BaggageProvisions>
          <BaggageProvisions RPH="4">
            <Associations>
              <CarrierCode RPH="1">SU</CarrierCode>
              <CountForSegmentAssociatedID>1</CountForSegmentAssociatedID>
              <DepartureDate RPH="1">2020-09-08</DepartureDate>
              <DestinationLocation LocationCode="SVO" RPH="1"/>
              <FlightNumber RPH="1">1129</FlightNumber>
              <OriginLocation LocationCode="AER" RPH="1"/>
              <PNR_Segment RPH="1">3</PNR_Segment>
              <ResBookDesigCode RPH="1">Y</ResBookDesigCode>
              <StatusCode RPH="1">SS</StatusCode>
            </Associations>
            <CarrierWhoseBaggageProvisionsApply>SU</CarrierWhoseBaggageProvisionsApply>
            <NumPiecesBDI>1</NumPiecesBDI>
            <NumPiecesITR>1</NumPiecesITR>
            <ProvisionType>A</ProvisionType>
            <SubCodeInfo>
              <SubCodeForAllowance RPH="1">0GOACSU</SubCodeForAllowance>
              <SubCodeForChargesOthers>0DFAASU</SubCodeForChargesOthers>
            </SubCodeInfo>
          </BaggageProvisions>
          <BaggageProvisions RPH="5">
            <Associations>
              <CarrierCode RPH="1">SU</CarrierCode>
              <CountForSegmentAssociatedID>1</CountForSegmentAssociatedID>
              <DepartureDate RPH="1">2020-09-08</DepartureDate>
              <DestinationLocation LocationCode="SVO" RPH="1"/>
              <FlightNumber RPH="1">1129</FlightNumber>
              <OriginLocation LocationCode="AER" RPH="1"/>
              <PNR_Segment RPH="1">3</PNR_Segment>
              <ResBookDesigCode RPH="1">Y</ResBookDesigCode>
              <StatusCode RPH="1">SS</StatusCode>
            </Associations>
            <CarrierWhoseBaggageProvisionsApply>SU</CarrierWhoseBaggageProvisionsApply>
            <Commissionable>N</Commissionable>
            <FeeApplicationIndicator>4</FeeApplicationIndicator>
            <FeeNotGuaranteedIndicator>N</FeeNotGuaranteedIndicator>
            <FirstOccurrence>1</FirstOccurrence>
            <Interlineable>Y</Interlineable>
            <LastOccurrence>1</LastOccurrence>
            <PassengerType Code="ADT"/>
            <PriceInformation>
              <Base Amount="2000" CurrencyCode="RUB"/>
              <Equiv Amount="2000" CurrencyCode="RUB"/>
              <TaxIndicator>X</TaxIndicator>
              <Total>2000</Total>
            </PriceInformation>
            <ProvisionType>C</ProvisionType>
            <RefundForm>1</RefundForm>
            <RefundReissue>Y</RefundReissue>
            <SubCodeInfo>
              <SubCodeForChargesOthers>0C3ACSU</SubCodeForChargesOthers>
            </SubCodeInfo>
          </BaggageProvisions>
          <BaggageProvisions RPH="6">
            <Associations>
              <CarrierCode RPH="1">SU</CarrierCode>
              <CountForSegmentAssociatedID>1</CountForSegmentAssociatedID>
              <DepartureDate RPH="1">2020-09-08</DepartureDate>
              <DestinationLocation LocationCode="SVO" RPH="1"/>
              <FlightNumber RPH="1">1129</FlightNumber>
              <OriginLocation LocationCode="AER" RPH="1"/>
              <PNR_Segment RPH="1">3</PNR_Segment>
              <ResBookDesigCode RPH="1">Y</ResBookDesigCode>
              <StatusCode RPH="1">SS</StatusCode>
            </Associations>
            <CarrierWhoseBaggageProvisionsApply>SU</CarrierWhoseBaggageProvisionsApply>
            <Commissionable>N</Commissionable>
            <FeeApplicationIndicator>4</FeeApplicationIndicator>
            <FeeNotGuaranteedIndicator>N</FeeNotGuaranteedIndicator>
            <FirstOccurrence>1</FirstOccurrence>
            <Interlineable>Y</Interlineable>
            <LastOccurrence>1</LastOccurrence>
            <PassengerType Code="ADT"/>
            <PriceInformation>
              <Base Amount="2000" CurrencyCode="RUB"/>
              <Equiv Amount="2000" CurrencyCode="RUB"/>
              <TaxIndicator>X</TaxIndicator>
              <Total>2000</Total>
            </PriceInformation>
            <ProvisionType>P</ProvisionType>
            <RefundForm>1</RefundForm>
            <RefundReissue>Y</RefundReissue>
            <SubCodeInfo>
              <SubCodeForChargesOthers>0C3ACSU</SubCodeForChargesOthers>
            </SubCodeInfo>
          </BaggageProvisions>
          <BaggageProvisions RPH="7">
            <Associations>
              <CarrierCode RPH="1">SU</CarrierCode>
              <CarrierCode RPH="2">SU</CarrierCode>
              <CountForSegmentAssociatedID>2</CountForSegmentAssociatedID>
              <DepartureDate RPH="1">2020-09-01</DepartureDate>
              <DepartureDate RPH="2">2020-09-08</DepartureDate>
              <DestinationLocation LocationCode="AER" RPH="1"/>
              <DestinationLocation LocationCode="SVO" RPH="2"/>
              <FlightNumber RPH="1">1138</FlightNumber>
              <FlightNumber RPH="2">1129</FlightNumber>
              <OriginLocation LocationCode="SVO" RPH="1"/>
              <OriginLocation LocationCode="AER" RPH="2"/>
              <PNR_Segment RPH="1">2</PNR_Segment>
              <PNR_Segment RPH="2">3</PNR_Segment>
              <ResBookDesigCode RPH="1">Y</ResBookDesigCode>
              <ResBookDesigCode RPH="2">Y</ResBookDesigCode>
              <StatusCode RPH="1">SS</StatusCode>
              <StatusCode RPH="2">SS</StatusCode>
            </Associations>
            <CarrierWhoseBaggageProvisionsApply>SU</CarrierWhoseBaggageProvisionsApply>
            <NumPiecesBDI>1</NumPiecesBDI>
            <NumPiecesITR>1</NumPiecesITR>
            <ProvisionType>B</ProvisionType>
            <SubCodeInfo>
              <SubCodeForAllowance RPH="1">08AACSU</SubCodeForAllowance>
              <SubCodeForChargesOthers>0LNABSU</SubCodeForChargesOthers>
            </SubCodeInfo>
          </BaggageProvisions>
          <FareCalculation>
            <Text>MOW SU AER29000SU MOW29000RUB58000END</Text>
          </FareCalculation>
          <FareCalculationBreakdown>
            <Branch FirstJointCarrier="SU" PCC="2FRH"/>
            <Departure AirlineCode="SU" AirportCode="SVO" ArrivalAirportCode="AER" ArrivalCityCode="AER" CityCode="MOW" GenericInd="O"/>
            <FareBasis Cabin="Y" Code="YCLR" FareAmount="29000" FarePassengerType="ADT" FareType="P" FilingCarrier="SU" GlobalInd="EH" Market="MOWAER" TripTypeInd="R"/>
            <FreeBaggageAllowance>PC001</FreeBaggageAllowance>
            <RuleCategoryIndicator>10</RuleCategoryIndicator>
            <RuleCategoryIndicator>16</RuleCategoryIndicator>
          </FareCalculationBreakdown>
          <FareCalculationBreakdown>
            <Branch FirstJointCarrier="SU" PCC="2FRH"/>
            <Departure AirlineCode="SU" AirportCode="AER" ArrivalAirportCode="SVO" ArrivalCityCode="MOW" CityCode="AER" GenericInd="O"/>
            <FareBasis Cabin="Y" Code="YCLR" FareAmount="29000" FarePassengerType="ADT" FareType="P" FilingCarrier="SU" GlobalInd="EH" Market="MOWAER" TripTypeInd="R"/>
            <FreeBaggageAllowance>PC001</FreeBaggageAllowance>
            <RuleCategoryIndicator>10</RuleCategoryIndicator>
            <RuleCategoryIndicator>16</RuleCategoryIndicator>
          </FareCalculationBreakdown>
          <ItinTotalFare NonRefundableInd="N">
            <BaggageInfo>
              <NonUS_DOT_Disclosure>
                <Text>BAG ALLOWANCE     -SVOAER-01P/SU/EACH PIECE UP TO 50 POUNDS/23</Text>
                <Text>KILOGRAMS AND UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS</Text>
                <Text>2NDCHECKED BAG FEE-SVOAER-RUB2000/SU/UP TO 50 POUNDS/23 KILOGRA</Text>
                <Text>MS</Text>
                <Text>BAG ALLOWANCE     -AERSVO-01P/SU/EACH PIECE UP TO 50 POUNDS/23</Text>
                <Text>KILOGRAMS AND UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS</Text>
                <Text>2NDCHECKED BAG FEE-AERSVO-RUB2000/SU/UP TO 50 POUNDS/23 KILOGRA</Text>
                <Text>MS</Text>
                <Text>CARRY ON ALLOWANCE</Text>
                <Text>SVOAER AERSVO-01P/SU</Text>
                <Text>01/UP TO 22 POUNDS/10 KILOGRAMS AND 55CM LENGTH X 40CM WIDTH X</Text>
                <Text>25CM HEIGHT</Text>
                <Text>CARRY ON CHARGES</Text>
                <Text>SVOAER AERSVO-SU-CARRY ON FEES UNKNOWN-CONTACT CARRIER</Text>
                <Text>ADDITIONAL ALLOWANCES AND/OR DISCOUNTS MAY APPLY DEPENDING ON</Text>
                <Text>FLYER-SPECIFIC FACTORS /E.G. FREQUENT FLYER STATUS/MILITARY/</Text>
                <Text>CREDIT CARD FORM OF PAYMENT/EARLY PURCHASE OVER INTERNET,ETC./</Text>
              </NonUS_DOT_Disclosure>
            </BaggageInfo>
            <BaseFare Amount="58000" CurrencyCode="RUB"/>
            <Construction Amount="58000" CurrencyCode="RUB" RateOfExchange="64.400000"/>
            <Taxes TotalAmount="6008">
              <Tax Amount="5400" TaxCode="YQF" TaxName="SERVICE FEE - CARRIER-IMPOSED" TicketingTaxCode="YQ"/>
              <Tax Amount="608" TaxCode="RI3" TaxName="TERMINAL USE CHARGE DOMESTIC D" TicketingTaxCode="RI"/>
            </Taxes>
            <TotalFare Amount="64008" CurrencyCode="RUB"/>
            <Warnings>
              <Warning ShortText="MIXED PASSENGER TYPES - VERIFY RESTRICTIONS"/>
            </Warnings>
          </ItinTotalFare>
          <PassengerTypeQuantity Code="ADT" Quantity="2"/>
          <PTC_FareBreakdown>
            <BrandedFareInformation>
              <BrandCode>EC</BrandCode>
              <BrandName>ECONOMY CLASSIC</BrandName>
              <ProgramCode>CFF1S</ProgramCode>
              <ProgramName>NEW BRANDS AFL</ProgramName>
            </BrandedFareInformation>
            <Cabin>Y</Cabin>
            <FareBasis Code="YCLR" FareAmount="29000" FarePassengerType="ADT" FareType="P" FilingCarrier="SU" GlobalInd="EH" Market="MOWAER"/>
            <FreeBaggageAllowance>PC001</FreeBaggageAllowance>
          </PTC_FareBreakdown>
          <PTC_FareBreakdown>
            <BrandedFareInformation>
              <BrandCode>EC</BrandCode>
              <BrandName>ECONOMY CLASSIC</BrandName>
              <ProgramCode>CFF1S</ProgramCode>
              <ProgramName>NEW BRANDS AFL</ProgramName>
            </BrandedFareInformation>
            <Cabin>Y</Cabin>
            <FareBasis Code="YCLR" FareAmount="29000" FarePassengerType="ADT" FareType="P" FilingCarrier="SU" GlobalInd="EH" Market="MOWAER"/>
            <FreeBaggageAllowance>PC001</FreeBaggageAllowance>
          </PTC_FareBreakdown>
          <SpecificPenalty>
            <PenaltyInformation Amount="2600" Cat16="false" Currency="RUB" NotApplicable="true" Type="CPBD"/>
          </SpecificPenalty>
          <SpecificPenalty>
            <PenaltyInformation Amount="2600" Cat16="false" Currency="RUB" NotApplicable="true" Type="CPAD"/>
          </SpecificPenalty>
          <SpecificPenalty>
            <PenaltyInformation Amount="2600" Cat16="false" Currency="RUB" NotApplicable="true" Type="RPBD"/>
          </SpecificPenalty>
          <SpecificPenalty>
            <PenaltyInformation Amount="5200" Cat16="true" Currency="RUB" NotApplicable="false" Type="RPAD"/>
          </SpecificPenalty>
        </AirItineraryPricingInfo>
        <AirItineraryPricingInfo SolutionSequenceNmbr="1">
          <BaggageProvisions RPH="1">
            <Associations>
              <CarrierCode RPH="1">SU</CarrierCode>
              <CountForSegmentAssociatedID>1</CountForSegmentAssociatedID>
              <DepartureDate RPH="1">2020-09-01</DepartureDate>
              <DestinationLocation LocationCode="AER" RPH="1"/>
              <FlightNumber RPH="1">1138</FlightNumber>
              <OriginLocation LocationCode="SVO" RPH="1"/>
              <PNR_Segment RPH="1">2</PNR_Segment>
              <ResBookDesigCode RPH="1">Y</ResBookDesigCode>
              <StatusCode RPH="1">SS</StatusCode>
            </Associations>
            <CarrierWhoseBaggageProvisionsApply>SU</CarrierWhoseBaggageProvisionsApply>
            <NumPiecesBDI>1</NumPiecesBDI>
            <NumPiecesITR>1</NumPiecesITR>
            <ProvisionType>A</ProvisionType>
            <SubCodeInfo>
              <SubCodeForAllowance RPH="1">0GOACSU</SubCodeForAllowance>
              <SubCodeForChargesOthers>0DFAASU</SubCodeForChargesOthers>
            </SubCodeInfo>
          </BaggageProvisions>
          <BaggageProvisions RPH="2">
            <Associations>
              <CarrierCode RPH="1">SU</CarrierCode>
              <CountForSegmentAssociatedID>1</CountForSegmentAssociatedID>
              <DepartureDate RPH="1">2020-09-01</DepartureDate>
              <DestinationLocation LocationCode="AER" RPH="1"/>
              <FlightNumber RPH="1">1138</FlightNumber>
              <OriginLocation LocationCode="SVO" RPH="1"/>
              <PNR_Segment RPH="1">2</PNR_Segment>
              <ResBookDesigCode RPH="1">Y</ResBookDesigCode>
              <StatusCode RPH="1">SS</StatusCode>
            </Associations>
            <CarrierWhoseBaggageProvisionsApply>SU</CarrierWhoseBaggageProvisionsApply>
            <Commissionable>N</Commissionable>
            <FeeApplicationIndicator>4</FeeApplicationIndicator>
            <FeeNotGuaranteedIndicator>N</FeeNotGuaranteedIndicator>
            <FirstOccurrence>1</FirstOccurrence>
            <Interlineable>Y</Interlineable>
            <LastOccurrence>1</LastOccurrence>
            <PassengerType Code="CNN"/>
            <PriceInformation>
              <Base Amount="2000" CurrencyCode="RUB"/>
              <Equiv Amount="2000" CurrencyCode="RUB"/>
              <TaxIndicator>X</TaxIndicator>
              <Total>2000</Total>
            </PriceInformation>
            <ProvisionType>C</ProvisionType>
            <RefundForm>1</RefundForm>
            <RefundReissue>Y</RefundReissue>
            <SubCodeInfo>
              <SubCodeForChargesOthers>0C3ACSU</SubCodeForChargesOthers>
            </SubCodeInfo>
          </BaggageProvisions>
          <BaggageProvisions RPH="3">
            <Associations>
              <CarrierCode RPH="1">SU</CarrierCode>
              <CountForSegmentAssociatedID>1</CountForSegmentAssociatedID>
              <DepartureDate RPH="1">2020-09-01</DepartureDate>
              <DestinationLocation LocationCode="AER" RPH="1"/>
              <FlightNumber RPH="1">1138</FlightNumber>
              <OriginLocation LocationCode="SVO" RPH="1"/>
              <PNR_Segment RPH="1">2</PNR_Segment>
              <ResBookDesigCode RPH="1">Y</ResBookDesigCode>
              <StatusCode RPH="1">SS</StatusCode>
            </Associations>
            <CarrierWhoseBaggageProvisionsApply>SU</CarrierWhoseBaggageProvisionsApply>
            <Commissionable>N</Commissionable>
            <FeeApplicationIndicator>4</FeeApplicationIndicator>
            <FeeNotGuaranteedIndicator>N</FeeNotGuaranteedIndicator>
            <FirstOccurrence>1</FirstOccurrence>
            <Interlineable>Y</Interlineable>
            <LastOccurrence>1</LastOccurrence>
            <PassengerType Code="CNN"/>
            <PriceInformation>
              <Base Amount="2000" CurrencyCode="RUB"/>
              <Equiv Amount="2000" CurrencyCode="RUB"/>
              <TaxIndicator>X</TaxIndicator>
              <Total>2000</Total>
            </PriceInformation>
            <ProvisionType>P</ProvisionType>
            <RefundForm>1</RefundForm>
            <RefundReissue>Y</RefundReissue>
            <SubCodeInfo>
              <SubCodeForChargesOthers>0C3ACSU</SubCodeForChargesOthers>
            </SubCodeInfo>
          </BaggageProvisions>
          <BaggageProvisions RPH="4">
            <Associations>
              <CarrierCode RPH="1">SU</CarrierCode>
              <CountForSegmentAssociatedID>1</CountForSegmentAssociatedID>
              <DepartureDate RPH="1">2020-09-08</DepartureDate>
              <DestinationLocation LocationCode="SVO" RPH="1"/>
              <FlightNumber RPH="1">1129</FlightNumber>
              <OriginLocation LocationCode="AER" RPH="1"/>
              <PNR_Segment RPH="1">3</PNR_Segment>
              <ResBookDesigCode RPH="1">Y</ResBookDesigCode>
              <StatusCode RPH="1">SS</StatusCode>
            </Associations>
            <CarrierWhoseBaggageProvisionsApply>SU</CarrierWhoseBaggageProvisionsApply>
            <NumPiecesBDI>1</NumPiecesBDI>
            <NumPiecesITR>1</NumPiecesITR>
            <ProvisionType>A</ProvisionType>
            <SubCodeInfo>
              <SubCodeForAllowance RPH="1">0GOACSU</SubCodeForAllowance>
              <SubCodeForChargesOthers>0DFAASU</SubCodeForChargesOthers>
            </SubCodeInfo>
          </BaggageProvisions>
          <BaggageProvisions RPH="5">
            <Associations>
              <CarrierCode RPH="1">SU</CarrierCode>
              <CountForSegmentAssociatedID>1</CountForSegmentAssociatedID>
              <DepartureDate RPH="1">2020-09-08</DepartureDate>
              <DestinationLocation LocationCode="SVO" RPH="1"/>
              <FlightNumber RPH="1">1129</FlightNumber>
              <OriginLocation LocationCode="AER" RPH="1"/>
              <PNR_Segment RPH="1">3</PNR_Segment>
              <ResBookDesigCode RPH="1">Y</ResBookDesigCode>
              <StatusCode RPH="1">SS</StatusCode>
            </Associations>
            <CarrierWhoseBaggageProvisionsApply>SU</CarrierWhoseBaggageProvisionsApply>
            <Commissionable>N</Commissionable>
            <FeeApplicationIndicator>4</FeeApplicationIndicator>
            <FeeNotGuaranteedIndicator>N</FeeNotGuaranteedIndicator>
            <FirstOccurrence>1</FirstOccurrence>
            <Interlineable>Y</Interlineable>
            <LastOccurrence>1</LastOccurrence>
            <PassengerType Code="CNN"/>
            <PriceInformation>
              <Base Amount="2000" CurrencyCode="RUB"/>
              <Equiv Amount="2000" CurrencyCode="RUB"/>
              <TaxIndicator>X</TaxIndicator>
              <Total>2000</Total>
            </PriceInformation>
            <ProvisionType>C</ProvisionType>
            <RefundForm>1</RefundForm>
            <RefundReissue>Y</RefundReissue>
            <SubCodeInfo>
              <SubCodeForChargesOthers>0C3ACSU</SubCodeForChargesOthers>
            </SubCodeInfo>
          </BaggageProvisions>
          <BaggageProvisions RPH="6">
            <Associations>
              <CarrierCode RPH="1">SU</CarrierCode>
              <CountForSegmentAssociatedID>1</CountForSegmentAssociatedID>
              <DepartureDate RPH="1">2020-09-08</DepartureDate>
              <DestinationLocation LocationCode="SVO" RPH="1"/>
              <FlightNumber RPH="1">1129</FlightNumber>
              <OriginLocation LocationCode="AER" RPH="1"/>
              <PNR_Segment RPH="1">3</PNR_Segment>
              <ResBookDesigCode RPH="1">Y</ResBookDesigCode>
              <StatusCode RPH="1">SS</StatusCode>
            </Associations>
            <CarrierWhoseBaggageProvisionsApply>SU</CarrierWhoseBaggageProvisionsApply>
            <Commissionable>N</Commissionable>
            <FeeApplicationIndicator>4</FeeApplicationIndicator>
            <FeeNotGuaranteedIndicator>N</FeeNotGuaranteedIndicator>
            <FirstOccurrence>1</FirstOccurrence>
            <Interlineable>Y</Interlineable>
            <LastOccurrence>1</LastOccurrence>
            <PassengerType Code="CNN"/>
            <PriceInformation>
              <Base Amount="2000" CurrencyCode="RUB"/>
              <Equiv Amount="2000" CurrencyCode="RUB"/>
              <TaxIndicator>X</TaxIndicator>
              <Total>2000</Total>
            </PriceInformation>
            <ProvisionType>P</ProvisionType>
            <RefundForm>1</RefundForm>
            <RefundReissue>Y</RefundReissue>
            <SubCodeInfo>
              <SubCodeForChargesOthers>0C3ACSU</SubCodeForChargesOthers>
            </SubCodeInfo>
          </BaggageProvisions>
          <BaggageProvisions RPH="7">
            <Associations>
              <CarrierCode RPH="1">SU</CarrierCode>
              <CarrierCode RPH="2">SU</CarrierCode>
              <CountForSegmentAssociatedID>2</CountForSegmentAssociatedID>
              <DepartureDate RPH="1">2020-09-01</DepartureDate>
              <DepartureDate RPH="2">2020-09-08</DepartureDate>
              <DestinationLocation LocationCode="AER" RPH="1"/>
              <DestinationLocation LocationCode="SVO" RPH="2"/>
              <FlightNumber RPH="1">1138</FlightNumber>
              <FlightNumber RPH="2">1129</FlightNumber>
              <OriginLocation LocationCode="SVO" RPH="1"/>
              <OriginLocation LocationCode="AER" RPH="2"/>
              <PNR_Segment RPH="1">2</PNR_Segment>
              <PNR_Segment RPH="2">3</PNR_Segment>
              <ResBookDesigCode RPH="1">Y</ResBookDesigCode>
              <ResBookDesigCode RPH="2">Y</ResBookDesigCode>
              <StatusCode RPH="1">SS</StatusCode>
              <StatusCode RPH="2">SS</StatusCode>
            </Associations>
            <CarrierWhoseBaggageProvisionsApply>SU</CarrierWhoseBaggageProvisionsApply>
            <NumPiecesBDI>1</NumPiecesBDI>
            <NumPiecesITR>1</NumPiecesITR>
            <ProvisionType>B</ProvisionType>
            <SubCodeInfo>
              <SubCodeForAllowance RPH="1">08AACSU</SubCodeForAllowance>
              <SubCodeForChargesOthers>0LNABSU</SubCodeForChargesOthers>
            </SubCodeInfo>
          </BaggageProvisions>
          <FareCalculation>
            <Text>MOW SU AER21750SU MOW21750RUB43500END</Text>
          </FareCalculation>
          <FareCalculationBreakdown>
            <Branch FirstJointCarrier="SU" PCC="2FRH"/>
            <Departure AirlineCode="SU" AirportCode="SVO" ArrivalAirportCode="AER" ArrivalCityCode="AER" CityCode="MOW" GenericInd="O"/>
            <FareBasis Cabin="Y" Code="YCLR/CH25" FareAmount="21750" FarePassengerType="CNN" FareType="P" FilingCarrier="SU" GlobalInd="EH" Market="MOWAER" TicketDesignator="CH25" TripTypeInd="R"/>
            <FreeBaggageAllowance>PC001</FreeBaggageAllowance>
            <RuleCategoryIndicator>10</RuleCategoryIndicator>
            <RuleCategoryIndicator>16</RuleCategoryIndicator>
            <RuleCategoryIndicator>19</RuleCategoryIndicator>
          </FareCalculationBreakdown>
          <FareCalculationBreakdown>
            <Branch FirstJointCarrier="SU" PCC="2FRH"/>
            <Departure AirlineCode="SU" AirportCode="AER" ArrivalAirportCode="SVO" ArrivalCityCode="MOW" CityCode="AER" GenericInd="O"/>
            <FareBasis Cabin="Y" Code="YCLR/CH25" FareAmount="21750" FarePassengerType="CNN" FareType="P" FilingCarrier="SU" GlobalInd="EH" Market="MOWAER" TicketDesignator="CH25" TripTypeInd="R"/>
            <FreeBaggageAllowance>PC001</FreeBaggageAllowance>
            <RuleCategoryIndicator>10</RuleCategoryIndicator>
            <RuleCategoryIndicator>16</RuleCategoryIndicator>
            <RuleCategoryIndicator>19</RuleCategoryIndicator>
          </FareCalculationBreakdown>
          <ItinTotalFare NonRefundableInd="N">
            <BaggageInfo>
              <NonUS_DOT_Disclosure>
                <Text>BAG ALLOWANCE     -SVOAER-01P/SU/EACH PIECE UP TO 50 POUNDS/23</Text>
                <Text>KILOGRAMS AND UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS</Text>
                <Text>2NDCHECKED BAG FEE-SVOAER-RUB2000/SU/UP TO 50 POUNDS/23 KILOGRA</Text>
                <Text>MS</Text>
                <Text>BAG ALLOWANCE     -AERSVO-01P/SU/EACH PIECE UP TO 50 POUNDS/23</Text>
                <Text>KILOGRAMS AND UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS</Text>
                <Text>2NDCHECKED BAG FEE-AERSVO-RUB2000/SU/UP TO 50 POUNDS/23 KILOGRA</Text>
                <Text>MS</Text>
                <Text>CARRY ON ALLOWANCE</Text>
                <Text>SVOAER AERSVO-01P/SU</Text>
                <Text>01/UP TO 22 POUNDS/10 KILOGRAMS AND 55CM LENGTH X 40CM WIDTH X</Text>
                <Text>25CM HEIGHT</Text>
                <Text>CARRY ON CHARGES</Text>
                <Text>SVOAER AERSVO-SU-CARRY ON FEES UNKNOWN-CONTACT CARRIER</Text>
                <Text>ADDITIONAL ALLOWANCES AND/OR DISCOUNTS MAY APPLY DEPENDING ON</Text>
                <Text>FLYER-SPECIFIC FACTORS /E.G. FREQUENT FLYER STATUS/MILITARY/</Text>
                <Text>CREDIT CARD FORM OF PAYMENT/EARLY PURCHASE OVER INTERNET,ETC./</Text>
              </NonUS_DOT_Disclosure>
            </BaggageInfo>
            <BaseFare Amount="43500" CurrencyCode="RUB"/>
            <Construction Amount="43500" CurrencyCode="RUB" RateOfExchange="64.400000"/>
            <Taxes TotalAmount="5704">
              <Tax Amount="5400" TaxCode="YQF" TaxName="SERVICE FEE - CARRIER-IMPOSED" TicketingTaxCode="YQ"/>
              <Tax Amount="304" TaxCode="RI3" TaxName="TERMINAL USE CHARGE DOMESTIC D" TicketingTaxCode="RI"/>
            </Taxes>
            <TotalFare Amount="49204" CurrencyCode="RUB"/>
            <Warnings>
              <Warning ShortText="MIXED PASSENGER TYPES - VERIFY RESTRICTIONS"/>
            </Warnings>
          </ItinTotalFare>
          <PassengerTypeQuantity Code="CNN" Quantity="1"/>
          <PTC_FareBreakdown>
            <BrandedFareInformation>
              <BrandCode>EC</BrandCode>
              <BrandName>ECONOMY CLASSIC</BrandName>
              <ProgramCode>CFF1S</ProgramCode>
              <ProgramName>NEW BRANDS AFL</ProgramName>
            </BrandedFareInformation>
            <Cabin>Y</Cabin>
            <FareBasis Code="YCLR/CH25" FareAmount="21750" FarePassengerType="CNN" FareType="P" FilingCarrier="SU" GlobalInd="EH" Market="MOWAER" TicketDesignator="CH25"/>
            <FreeBaggageAllowance>PC001</FreeBaggageAllowance>
          </PTC_FareBreakdown>
          <PTC_FareBreakdown>
            <BrandedFareInformation>
              <BrandCode>EC</BrandCode>
              <BrandName>ECONOMY CLASSIC</BrandName>
              <ProgramCode>CFF1S</ProgramCode>
              <ProgramName>NEW BRANDS AFL</ProgramName>
            </BrandedFareInformation>
            <Cabin>Y</Cabin>
            <FareBasis Code="YCLR/CH25" FareAmount="21750" FarePassengerType="CNN" FareType="P" FilingCarrier="SU" GlobalInd="EH" Market="MOWAER" TicketDesignator="CH25"/>
            <FreeBaggageAllowance>PC001</FreeBaggageAllowance>
          </PTC_FareBreakdown>
          <SpecificPenalty>
            <PenaltyInformation Amount="2600" Cat16="false" Currency="RUB" NotApplicable="true" Type="CPBD"/>
          </SpecificPenalty>
          <SpecificPenalty>
            <PenaltyInformation Amount="2600" Cat16="false" Currency="RUB" NotApplicable="true" Type="CPAD"/>
          </SpecificPenalty>
          <SpecificPenalty>
            <PenaltyInformation Amount="2600" Cat16="false" Currency="RUB" NotApplicable="true" Type="RPBD"/>
          </SpecificPenalty>
          <SpecificPenalty>
            <PenaltyInformation Amount="5200" Cat16="true" Currency="RUB" NotApplicable="false" Type="RPAD"/>
          </SpecificPenalty>
        </AirItineraryPricingInfo>
        <AirItineraryPricingInfo SolutionSequenceNmbr="1">
          <BaggageProvisions RPH="1">
            <Associations>
              <CarrierCode RPH="1">SU</CarrierCode>
              <CountForSegmentAssociatedID>1</CountForSegmentAssociatedID>
              <DepartureDate RPH="1">2020-09-01</DepartureDate>
              <DestinationLocation LocationCode="AER" RPH="1"/>
              <FlightNumber RPH="1">1138</FlightNumber>
              <OriginLocation LocationCode="SVO" RPH="1"/>
              <PNR_Segment RPH="1">2</PNR_Segment>
              <ResBookDesigCode RPH="1">Y</ResBookDesigCode>
              <StatusCode RPH="1">SS</StatusCode>
            </Associations>
            <CarrierWhoseBaggageProvisionsApply>SU</CarrierWhoseBaggageProvisionsApply>
            <NumPiecesBDI>1</NumPiecesBDI>
            <NumPiecesITR>1</NumPiecesITR>
            <ProvisionType>A</ProvisionType>
            <SubCodeInfo>
              <SubCodeForAllowance RPH="1">0E3ACSU</SubCodeForAllowance>
              <SubCodeForChargesOthers>0DFAASU</SubCodeForChargesOthers>
            </SubCodeInfo>
          </BaggageProvisions>
          <BaggageProvisions RPH="2">
            <Associations>
              <CarrierCode RPH="1">SU</CarrierCode>
              <CountForSegmentAssociatedID>1</CountForSegmentAssociatedID>
              <DepartureDate RPH="1">2020-09-01</DepartureDate>
              <DestinationLocation LocationCode="AER" RPH="1"/>
              <FlightNumber RPH="1">1138</FlightNumber>
              <OriginLocation LocationCode="SVO" RPH="1"/>
              <PNR_Segment RPH="1">2</PNR_Segment>
              <ResBookDesigCode RPH="1">Y</ResBookDesigCode>
              <StatusCode RPH="1">SS</StatusCode>
            </Associations>
            <CarrierWhoseBaggageProvisionsApply>SU</CarrierWhoseBaggageProvisionsApply>
            <Commissionable>N</Commissionable>
            <FeeApplicationIndicator>4</FeeApplicationIndicator>
            <FeeNotGuaranteedIndicator>N</FeeNotGuaranteedIndicator>
            <FirstOccurrence>1</FirstOccurrence>
            <Interlineable>Y</Interlineable>
            <LastOccurrence>1</LastOccurrence>
            <PassengerType Code="INF"/>
            <PriceInformation>
              <Base Amount="2000" CurrencyCode="RUB"/>
              <Equiv Amount="2000" CurrencyCode="RUB"/>
              <TaxIndicator>X</TaxIndicator>
              <Total>2000</Total>
            </PriceInformation>
            <ProvisionType>C</ProvisionType>
            <RefundForm>1</RefundForm>
            <RefundReissue>Y</RefundReissue>
            <SubCodeInfo>
              <SubCodeForChargesOthers>0C3ACSU</SubCodeForChargesOthers>
            </SubCodeInfo>
          </BaggageProvisions>
          <BaggageProvisions RPH="3">
            <Associations>
              <CarrierCode RPH="1">SU</CarrierCode>
              <CountForSegmentAssociatedID>1</CountForSegmentAssociatedID>
              <DepartureDate RPH="1">2020-09-01</DepartureDate>
              <DestinationLocation LocationCode="AER" RPH="1"/>
              <FlightNumber RPH="1">1138</FlightNumber>
              <OriginLocation LocationCode="SVO" RPH="1"/>
              <PNR_Segment RPH="1">2</PNR_Segment>
              <ResBookDesigCode RPH="1">Y</ResBookDesigCode>
              <StatusCode RPH="1">SS</StatusCode>
            </Associations>
            <CarrierWhoseBaggageProvisionsApply>SU</CarrierWhoseBaggageProvisionsApply>
            <Commissionable>N</Commissionable>
            <FeeApplicationIndicator>4</FeeApplicationIndicator>
            <FeeNotGuaranteedIndicator>N</FeeNotGuaranteedIndicator>
            <FirstOccurrence>1</FirstOccurrence>
            <Interlineable>Y</Interlineable>
            <LastOccurrence>1</LastOccurrence>
            <PassengerType Code="INF"/>
            <PriceInformation>
              <Base Amount="2000" CurrencyCode="RUB"/>
              <Equiv Amount="2000" CurrencyCode="RUB"/>
              <TaxIndicator>X</TaxIndicator>
              <Total>2000</Total>
            </PriceInformation>
            <ProvisionType>P</ProvisionType>
            <RefundForm>1</RefundForm>
            <RefundReissue>Y</RefundReissue>
            <SubCodeInfo>
              <SubCodeForChargesOthers>0C3ACSU</SubCodeForChargesOthers>
            </SubCodeInfo>
          </BaggageProvisions>
          <BaggageProvisions RPH="4">
            <Associations>
              <CarrierCode RPH="1">SU</CarrierCode>
              <CountForSegmentAssociatedID>1</CountForSegmentAssociatedID>
              <DepartureDate RPH="1">2020-09-08</DepartureDate>
              <DestinationLocation LocationCode="SVO" RPH="1"/>
              <FlightNumber RPH="1">1129</FlightNumber>
              <OriginLocation LocationCode="AER" RPH="1"/>
              <PNR_Segment RPH="1">3</PNR_Segment>
              <ResBookDesigCode RPH="1">Y</ResBookDesigCode>
              <StatusCode RPH="1">SS</StatusCode>
            </Associations>
            <CarrierWhoseBaggageProvisionsApply>SU</CarrierWhoseBaggageProvisionsApply>
            <NumPiecesBDI>1</NumPiecesBDI>
            <NumPiecesITR>1</NumPiecesITR>
            <ProvisionType>A</ProvisionType>
            <SubCodeInfo>
              <SubCodeForAllowance RPH="1">0E3ACSU</SubCodeForAllowance>
              <SubCodeForChargesOthers>0DFAASU</SubCodeForChargesOthers>
            </SubCodeInfo>
          </BaggageProvisions>
          <BaggageProvisions RPH="5">
            <Associations>
              <CarrierCode RPH="1">SU</CarrierCode>
              <CountForSegmentAssociatedID>1</CountForSegmentAssociatedID>
              <DepartureDate RPH="1">2020-09-08</DepartureDate>
              <DestinationLocation LocationCode="SVO" RPH="1"/>
              <FlightNumber RPH="1">1129</FlightNumber>
              <OriginLocation LocationCode="AER" RPH="1"/>
              <PNR_Segment RPH="1">3</PNR_Segment>
              <ResBookDesigCode RPH="1">Y</ResBookDesigCode>
              <StatusCode RPH="1">SS</StatusCode>
            </Associations>
            <CarrierWhoseBaggageProvisionsApply>SU</CarrierWhoseBaggageProvisionsApply>
            <Commissionable>N</Commissionable>
            <FeeApplicationIndicator>4</FeeApplicationIndicator>
            <FeeNotGuaranteedIndicator>N</FeeNotGuaranteedIndicator>
            <FirstOccurrence>1</FirstOccurrence>
            <Interlineable>Y</Interlineable>
            <LastOccurrence>1</LastOccurrence>
            <PassengerType Code="INF"/>
            <PriceInformation>
              <Base Amount="2000" CurrencyCode="RUB"/>
              <Equiv Amount="2000" CurrencyCode="RUB"/>
              <TaxIndicator>X</TaxIndicator>
              <Total>2000</Total>
            </PriceInformation>
            <ProvisionType>C</ProvisionType>
            <RefundForm>1</RefundForm>
            <RefundReissue>Y</RefundReissue>
            <SubCodeInfo>
              <SubCodeForChargesOthers>0C3ACSU</SubCodeForChargesOthers>
            </SubCodeInfo>
          </BaggageProvisions>
          <BaggageProvisions RPH="6">
            <Associations>
              <CarrierCode RPH="1">SU</CarrierCode>
              <CountForSegmentAssociatedID>1</CountForSegmentAssociatedID>
              <DepartureDate RPH="1">2020-09-08</DepartureDate>
              <DestinationLocation LocationCode="SVO" RPH="1"/>
              <FlightNumber RPH="1">1129</FlightNumber>
              <OriginLocation LocationCode="AER" RPH="1"/>
              <PNR_Segment RPH="1">3</PNR_Segment>
              <ResBookDesigCode RPH="1">Y</ResBookDesigCode>
              <StatusCode RPH="1">SS</StatusCode>
            </Associations>
            <CarrierWhoseBaggageProvisionsApply>SU</CarrierWhoseBaggageProvisionsApply>
            <Commissionable>N</Commissionable>
            <FeeApplicationIndicator>4</FeeApplicationIndicator>
            <FeeNotGuaranteedIndicator>N</FeeNotGuaranteedIndicator>
            <FirstOccurrence>1</FirstOccurrence>
            <Interlineable>Y</Interlineable>
            <LastOccurrence>1</LastOccurrence>
            <PassengerType Code="INF"/>
            <PriceInformation>
              <Base Amount="2000" CurrencyCode="RUB"/>
              <Equiv Amount="2000" CurrencyCode="RUB"/>
              <TaxIndicator>X</TaxIndicator>
              <Total>2000</Total>
            </PriceInformation>
            <ProvisionType>P</ProvisionType>
            <RefundForm>1</RefundForm>
            <RefundReissue>Y</RefundReissue>
            <SubCodeInfo>
              <SubCodeForChargesOthers>0C3ACSU</SubCodeForChargesOthers>
            </SubCodeInfo>
          </BaggageProvisions>
          <BaggageProvisions RPH="7">
            <Associations>
              <CarrierCode RPH="1">SU</CarrierCode>
              <CarrierCode RPH="2">SU</CarrierCode>
              <CountForSegmentAssociatedID>2</CountForSegmentAssociatedID>
              <DepartureDate RPH="1">2020-09-01</DepartureDate>
              <DepartureDate RPH="2">2020-09-08</DepartureDate>
              <DestinationLocation LocationCode="AER" RPH="1"/>
              <DestinationLocation LocationCode="SVO" RPH="2"/>
              <FlightNumber RPH="1">1138</FlightNumber>
              <FlightNumber RPH="2">1129</FlightNumber>
              <OriginLocation LocationCode="SVO" RPH="1"/>
              <OriginLocation LocationCode="AER" RPH="2"/>
              <PNR_Segment RPH="1">2</PNR_Segment>
              <PNR_Segment RPH="2">3</PNR_Segment>
              <ResBookDesigCode RPH="1">Y</ResBookDesigCode>
              <ResBookDesigCode RPH="2">Y</ResBookDesigCode>
              <StatusCode RPH="1">SS</StatusCode>
              <StatusCode RPH="2">SS</StatusCode>
            </Associations>
            <CarrierWhoseBaggageProvisionsApply>SU</CarrierWhoseBaggageProvisionsApply>
            <NumPiecesBDI>0</NumPiecesBDI>
            <ProvisionType>B</ProvisionType>
            <SubCodeInfo>
              <SubCodeForChargesOthers>0LNABSU</SubCodeForChargesOthers>
            </SubCodeInfo>
          </BaggageProvisions>
          <FareCalculation>
            <Text>MOW SU AER0SU MOW0RUB0END</Text>
          </FareCalculation>
          <FareCalculationBreakdown>
            <Branch FirstJointCarrier="SU" PCC="2FRH"/>
            <Departure AirlineCode="SU" AirportCode="SVO" ArrivalAirportCode="AER" ArrivalCityCode="AER" CityCode="MOW" GenericInd="O"/>
            <FareBasis Cabin="Y" Code="YCLR/IN00" FareAmount="0" FarePassengerType="INF" FareType="P" FilingCarrier="SU" GlobalInd="EH" Market="MOWAER" TicketDesignator="IN00" TripTypeInd="R"/>
            <FreeBaggageAllowance>PC001</FreeBaggageAllowance>
            <RuleCategoryIndicator>10</RuleCategoryIndicator>
            <RuleCategoryIndicator>16</RuleCategoryIndicator>
            <RuleCategoryIndicator>19</RuleCategoryIndicator>
          </FareCalculationBreakdown>
          <FareCalculationBreakdown>
            <Branch FirstJointCarrier="SU" PCC="2FRH"/>
            <Departure AirlineCode="SU" AirportCode="AER" ArrivalAirportCode="SVO" ArrivalCityCode="MOW" CityCode="AER" GenericInd="O"/>
            <FareBasis Cabin="Y" Code="YCLR/IN00" FareAmount="0" FarePassengerType="INF" FareType="P" FilingCarrier="SU" GlobalInd="EH" Market="MOWAER" TicketDesignator="IN00" TripTypeInd="R"/>
            <FreeBaggageAllowance>PC001</FreeBaggageAllowance>
            <RuleCategoryIndicator>10</RuleCategoryIndicator>
            <RuleCategoryIndicator>16</RuleCategoryIndicator>
            <RuleCategoryIndicator>19</RuleCategoryIndicator>
          </FareCalculationBreakdown>
          <ItinTotalFare NonRefundableInd="N">
            <BaggageInfo>
              <NonUS_DOT_Disclosure>
                <Text>BAG ALLOWANCE     -SVOAER-01P/SU/EACH PIECE UP TO 22 POUNDS/10</Text>
                <Text>KILOGRAMS AND UP TO 45 LINEAR INCHES/115 LINEAR CENTIMETERS</Text>
                <Text>2NDCHECKED BAG FEE-SVOAER-RUB2000/SU/UP TO 50 POUNDS/23 KILOGRA</Text>
                <Text>MS</Text>
                <Text>BAG ALLOWANCE     -AERSVO-01P/SU/EACH PIECE UP TO 22 POUNDS/10</Text>
                <Text>KILOGRAMS AND UP TO 45 LINEAR INCHES/115 LINEAR CENTIMETERS</Text>
                <Text>2NDCHECKED BAG FEE-AERSVO-RUB2000/SU/UP TO 50 POUNDS/23 KILOGRA</Text>
                <Text>MS</Text>
                <Text>CARRY ON ALLOWANCE</Text>
                <Text>SVOAER AERSVO-NIL/SU</Text>
                <Text>CARRY ON CHARGES</Text>
                <Text>SVOAER AERSVO-SU-CARRY ON FEES UNKNOWN-CONTACT CARRIER</Text>
                <Text>ADDITIONAL ALLOWANCES AND/OR DISCOUNTS MAY APPLY DEPENDING ON</Text>
                <Text>FLYER-SPECIFIC FACTORS /E.G. FREQUENT FLYER STATUS/MILITARY/</Text>
                <Text>CREDIT CARD FORM OF PAYMENT/EARLY PURCHASE OVER INTERNET,ETC./</Text>
              </NonUS_DOT_Disclosure>
            </BaggageInfo>
            <BaseFare Amount="0" CurrencyCode="RUB"/>
            <Construction Amount="0" CurrencyCode="RUB" RateOfExchange="64.400000"/>
            <Taxes TotalAmount="0"/>
            <TotalFare Amount="0" CurrencyCode="RUB"/>
            <Warnings>
              <Warning ShortText="MIXED PASSENGER TYPES - VERIFY RESTRICTIONS"/>
            </Warnings>
          </ItinTotalFare>
          <PassengerTypeQuantity Code="INF" Quantity="1"/>
          <PTC_FareBreakdown>
            <BrandedFareInformation>
              <BrandCode>EC</BrandCode>
              <BrandName>ECONOMY CLASSIC</BrandName>
              <ProgramCode>CFF1S</ProgramCode>
              <ProgramName>NEW BRANDS AFL</ProgramName>
            </BrandedFareInformation>
            <Cabin>Y</Cabin>
            <FareBasis Code="YCLR/IN00" FareAmount="0" FarePassengerType="INF" FareType="P" FilingCarrier="SU" GlobalInd="EH" Market="MOWAER" TicketDesignator="IN00"/>
            <FreeBaggageAllowance>PC001</FreeBaggageAllowance>
          </PTC_FareBreakdown>
          <PTC_FareBreakdown>
            <BrandedFareInformation>
              <BrandCode>EC</BrandCode>
              <BrandName>ECONOMY CLASSIC</BrandName>
              <ProgramCode>CFF1S</ProgramCode>
              <ProgramName>NEW BRANDS AFL</ProgramName>
            </BrandedFareInformation>
            <Cabin>Y</Cabin>
            <FareBasis Code="YCLR/IN00" FareAmount="0" FarePassengerType="INF" FareType="P" FilingCarrier="SU" GlobalInd="EH" Market="MOWAER" TicketDesignator="IN00"/>
            <FreeBaggageAllowance>PC001</FreeBaggageAllowance>
          </PTC_FareBreakdown>
          <SpecificPenalty>
            <PenaltyInformation Amount="0" Cat16="false" Currency="RUB" NotApplicable="true" Type="CPBD"/>
          </SpecificPenalty>
          <SpecificPenalty>
            <PenaltyInformation Amount="0" Cat16="false" Currency="RUB" NotApplicable="true" Type="CPAD"/>
          </SpecificPenalty>
          <SpecificPenalty>
            <PenaltyInformation Amount="0" Cat16="false" Currency="RUB" NotApplicable="true" Type="RPBD"/>
          </SpecificPenalty>
          <SpecificPenalty>
            <PenaltyInformation Amount="5200" Cat16="true" Currency="RUB" NotApplicable="false" Type="RPAD"/>
          </SpecificPenalty>
        </AirItineraryPricingInfo>
      </PricedItinerary>
    </PriceQuote>
  </AirPrice>
  <TravelItineraryRead>
    <TravelItinerary>
      <CustomerInfo>
        <ContactNumbers>
          <ContactNumber Id="14" LocationCode="MOW" Phone="74991234567-A" RPH="001"/>
          <ContactNumber Id="15" LocationCode="MOW" Phone="79851234567-M" RPH="002"/>
        </ContactNumbers>
        <PersonName NameNumber="01.01" PassengerType="ADT" RPH="1" WithInfant="false" elementId="pnr-2.1">
          <Email Comment="BC/" Id="13" Type="BC">AGENCY@AGENCY.COM</Email>
          <Email Comment="TO/" Id="12" Type="TO">CUSTOMER@CUSTOMER.COM</Email>
          <GivenName>IVAN MR</GivenName>
          <Surname>IVANOV</Surname>
        </PersonName>
        <PersonName NameNumber="02.01" PassengerType="ADT" RPH="2" WithInfant="false" elementId="pnr-4.2">
          <Email Comment="BC/" Id="13" Type="BC">AGENCY@AGENCY.COM</Email>
          <GivenName>ELENA MS</GivenName>
          <Surname>IVANOVA</Surname>
        </PersonName>
        <PersonName NameNumber="03.01" PassengerType="CNN" RPH="3" WithInfant="false" elementId="pnr-6.3">
          <Email Comment="BC/" Id="13" Type="BC">AGENCY@AGENCY.COM</Email>
          <GivenName>ANDREY</GivenName>
          <Surname>IVANOV</Surname>
        </PersonName>
        <PersonName NameNumber="04.01" PassengerType="INF" RPH="4" WithInfant="true" elementId="pnr-8.4">
          <Email Comment="BC/" Id="13" Type="BC">AGENCY@AGENCY.COM</Email>
          <GivenName>EKATERINA</GivenName>
          <Surname>IVANOVA</Surname>
        </PersonName>
      </CustomerInfo>
      <ItineraryInfo>
        <ItineraryPricing>
          <PriceQuote RPH="1">
            <MiscInformation>
              <SignatureLine ExpirationDateTime="00:00" Source="SYS" Status="ACTIVE">
                <Text>2FRH 9LSC*AWT 1215/22JAN20</Text>
              </SignatureLine>
            </MiscInformation>
            <PricedItinerary DisplayOnly="false" InputMessage="WPASU¥MP-I¥BREC¥RQ" RPH="1" StatusCode="A" StoredDateTime="2020-01-22T12:15" TaxExempt="false" ValidatingCarrier="SU">
              <AirItineraryPricingInfo>
                <ItinTotalFare>
                  <BaseFare Amount="58000" CurrencyCode="RUB"/>
                  <Taxes>
                    <Tax Amount="6008" TaxCode="XT"/>
                    <TaxBreakdownCode TaxPaid="false">5400YQ</TaxBreakdownCode>
                    <TaxBreakdownCode TaxPaid="false">608RI</TaxBreakdownCode>
                  </Taxes>
                  <TotalFare Amount="64008" CurrencyCode="RUB"/>
                  <Totals>
                    <BaseFare Amount="116000"/>
                    <Taxes>
                      <Tax Amount="12016"/>
                    </Taxes>
                    <TotalFare Amount="128016"/>
                  </Totals>
                </ItinTotalFare>
                <PassengerTypeQuantity Code="ADT" Quantity="02"/>
                <PTC_FareBreakdown>
                  <Endorsements>
                    <Endorsement type="PRICING_PARAMETER">
                      <Text>WPASU$MP-I$BREC$RQ</Text>
                    </Endorsement>
                    <Endorsement type="WARNING">
                      <Text>VALIDATING CARRIER SPECIFIED - SU</Text>
                    </Endorsement>
                    <Endorsement type="WARNING">
                      <Text>CHG BEF DEP UP TO RUB2600/CHG AFT DEP UP TO RUB2600/REF BEF DEP</Text>
                    </Endorsement>
                    <Endorsement type="WARNING">
                      <Text>UP TO RUB2600/REF AFT DEP UP TO RUB5200/OTHERWISE NON-CHG</Text>
                    </Endorsement>
                    <Endorsement type="WARNING">
                      <Text>NON-REF/SEE RULES</Text>
                    </Endorsement>
                  </Endorsements>
                  <FareBasis Code="YCLR/YCLR"/>
                  <FareCalculation>
                    <Text>MOW SU AER29000SU MOW29000RUB58000END</Text>
                  </FareCalculation>
                  <FareSource>ATPC</FareSource>
                  <FlightSegment ConnectionInd="O" DepartureDateTime="09-01T07:45" FlightNumber="1138" ResBookDesigCode="Y" SegmentNumber="1" Status="OK">
                    <BaggageAllowance Number="01P"/>
                    <FareBasis Code="YCLR"/>
                    <MarketingAirline Code="SU" FlightNumber="1138"/>
                    <OriginLocation LocationCode="SVO"/>
                    <ValidityDates>
                      <NotValidAfter>2020-09-01</NotValidAfter>
                      <NotValidBefore>2020-09-01</NotValidBefore>
                    </ValidityDates>
                  </FlightSegment>
                  <FlightSegment ConnectionInd="O" DepartureDateTime="09-08T02:45" FlightNumber="1129" ResBookDesigCode="Y" SegmentNumber="2" Status="OK">
                    <BaggageAllowance Number="01P"/>
                    <FareBasis Code="YCLR"/>
                    <MarketingAirline Code="SU" FlightNumber="1129"/>
                    <OriginLocation LocationCode="AER"/>
                    <ValidityDates>
                      <NotValidAfter>2020-09-08</NotValidAfter>
                      <NotValidBefore>2020-09-08</NotValidBefore>
                    </ValidityDates>
                  </FlightSegment>
                  <FlightSegment>
                    <OriginLocation LocationCode="SVO"/>
                  </FlightSegment>
                  <FareComponent Amount="29000" FareBasisCode="YCLR" FareComponentNumber="1" FareDirectionality="FROM" GoverningCarrier="SU" TicketDesignator="">
                    <Location Destination="AER" Origin="MOW"/>
                    <Dates ArrivalDateTime="09-01T10:15" DepartureDateTime="09-01T07:45"/>
                    <FlightSegmentNumbers>
                      <FlightSegmentNumber>1</FlightSegmentNumber>
                    </FlightSegmentNumbers>
                  </FareComponent>
                  <FareComponent Amount="29000" FareBasisCode="YCLR" FareComponentNumber="2" FareDirectionality="TO" GoverningCarrier="SU" TicketDesignator="">
                    <Location Destination="MOW" Origin="AER"/>
                    <Dates ArrivalDateTime="09-08T05:20" DepartureDateTime="09-08T02:45"/>
                    <FlightSegmentNumbers>
                      <FlightSegmentNumber>2</FlightSegmentNumber>
                    </FlightSegmentNumbers>
                  </FareComponent>
                  <ResTicketingRestrictions>LAST DAY TO PURCHASE 27AUG/2359</ResTicketingRestrictions>
                  <ResTicketingRestrictions>GUARANTEED FARE APPL IF PURCHASED BEFORE 27AUG</ResTicketingRestrictions>
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
                <Text>2FRH 9LSC*AWT 1215/22JAN20</Text>
              </SignatureLine>
            </MiscInformation>
            <PricedItinerary DisplayOnly="false" InputMessage="WPASU¥MP-I¥BREC¥RQ" RPH="2" StatusCode="A" StoredDateTime="2020-01-22T12:15" TaxExempt="false" ValidatingCarrier="SU">
              <AirItineraryPricingInfo>
                <ItinTotalFare>
                  <BaseFare Amount="43500" CurrencyCode="RUB"/>
                  <Taxes>
                    <Tax Amount="5704" TaxCode="XT"/>
                    <TaxBreakdownCode TaxPaid="false">5400YQ</TaxBreakdownCode>
                    <TaxBreakdownCode TaxPaid="false">304RI</TaxBreakdownCode>
                  </Taxes>
                  <TotalFare Amount="49204" CurrencyCode="RUB"/>
                  <Totals>
                    <BaseFare Amount="43500"/>
                    <Taxes>
                      <Tax Amount="5704"/>
                    </Taxes>
                    <TotalFare Amount="49204"/>
                  </Totals>
                </ItinTotalFare>
                <PassengerTypeQuantity Code="CNN" Quantity="01"/>
                <PTC_FareBreakdown>
                  <Endorsements>
                    <Endorsement type="PRICING_PARAMETER">
                      <Text>WPASU$MP-I$BREC$RQ</Text>
                    </Endorsement>
                    <Endorsement type="WARNING">
                      <Text>EACH CNN REQUIRES ACCOMPANYING SAME CABIN ADT</Text>
                    </Endorsement>
                    <Endorsement type="WARNING">
                      <Text>VALIDATING CARRIER SPECIFIED - SU</Text>
                    </Endorsement>
                    <Endorsement type="WARNING">
                      <Text>CHG BEF DEP UP TO RUB2600/CHG AFT DEP UP TO RUB2600/REF BEF DEP</Text>
                    </Endorsement>
                    <Endorsement type="WARNING">
                      <Text>UP TO RUB2600/REF AFT DEP UP TO RUB5200/OTHERWISE NON-CHG</Text>
                    </Endorsement>
                    <Endorsement type="WARNING">
                      <Text>NON-REF/SEE RULES</Text>
                    </Endorsement>
                  </Endorsements>
                  <FareBasis Code="YCLR/CH25/YCLR/CH25"/>
                  <FareCalculation>
                    <Text>MOW SU AER21750SU MOW21750RUB43500END</Text>
                  </FareCalculation>
                  <FareSource>ATPC</FareSource>
                  <FlightSegment ConnectionInd="O" DepartureDateTime="09-01T07:45" FlightNumber="1138" ResBookDesigCode="Y" SegmentNumber="1" Status="OK">
                    <BaggageAllowance Number="01P"/>
                    <FareBasis Code="YCLR/CH25"/>
                    <MarketingAirline Code="SU" FlightNumber="1138"/>
                    <OriginLocation LocationCode="SVO"/>
                    <ValidityDates>
                      <NotValidAfter>2020-09-01</NotValidAfter>
                      <NotValidBefore>2020-09-01</NotValidBefore>
                    </ValidityDates>
                  </FlightSegment>
                  <FlightSegment ConnectionInd="O" DepartureDateTime="09-08T02:45" FlightNumber="1129" ResBookDesigCode="Y" SegmentNumber="2" Status="OK">
                    <BaggageAllowance Number="01P"/>
                    <FareBasis Code="YCLR/CH25"/>
                    <MarketingAirline Code="SU" FlightNumber="1129"/>
                    <OriginLocation LocationCode="AER"/>
                    <ValidityDates>
                      <NotValidAfter>2020-09-08</NotValidAfter>
                      <NotValidBefore>2020-09-08</NotValidBefore>
                    </ValidityDates>
                  </FlightSegment>
                  <FlightSegment>
                    <OriginLocation LocationCode="SVO"/>
                  </FlightSegment>
                  <FareComponent Amount="21750" FareBasisCode="YCLR/CH25" FareComponentNumber="1" FareDirectionality="FROM" GoverningCarrier="SU" TicketDesignator="CH25">
                    <Location Destination="AER" Origin="MOW"/>
                    <Dates ArrivalDateTime="09-01T10:15" DepartureDateTime="09-01T07:45"/>
                    <FlightSegmentNumbers>
                      <FlightSegmentNumber>1</FlightSegmentNumber>
                    </FlightSegmentNumbers>
                  </FareComponent>
                  <FareComponent Amount="21750" FareBasisCode="YCLR/CH25" FareComponentNumber="2" FareDirectionality="TO" GoverningCarrier="SU" TicketDesignator="CH25">
                    <Location Destination="MOW" Origin="AER"/>
                    <Dates ArrivalDateTime="09-08T05:20" DepartureDateTime="09-08T02:45"/>
                    <FlightSegmentNumbers>
                      <FlightSegmentNumber>2</FlightSegmentNumber>
                    </FlightSegmentNumbers>
                  </FareComponent>
                  <ResTicketingRestrictions>LAST DAY TO PURCHASE 27AUG/2359</ResTicketingRestrictions>
                  <ResTicketingRestrictions>GUARANTEED FARE APPL IF PURCHASED BEFORE 27AUG</ResTicketingRestrictions>
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
                <Text>2FRH 9LSC*AWT 1215/22JAN20</Text>
              </SignatureLine>
            </MiscInformation>
            <PricedItinerary DisplayOnly="false" InputMessage="WPASU¥MP-I¥BREC¥RQ" RPH="3" StatusCode="A" StoredDateTime="2020-01-22T12:15" TaxExempt="false" ValidatingCarrier="SU">
              <AirItineraryPricingInfo>
                <ItinTotalFare>
                  <BaseFare Amount="0" CurrencyCode="RUB"/>
                  <Taxes>
                    <Tax Amount="0" TaxCode="TE"/>
                  </Taxes>
                  <TotalFare Amount="0" CurrencyCode="RUB"/>
                  <Totals>
                    <BaseFare Amount="0"/>
                    <Taxes>
                      <Tax Amount="0"/>
                    </Taxes>
                    <TotalFare Amount="0"/>
                  </Totals>
                </ItinTotalFare>
                <PassengerTypeQuantity Code="INF" Quantity="01"/>
                <PTC_FareBreakdown>
                  <Endorsements>
                    <Endorsement type="PRICING_PARAMETER">
                      <Text>WPASU$MP-I$BREC$RQ</Text>
                    </Endorsement>
                    <Endorsement type="WARNING">
                      <Text>REQUIRES ACCOMPANYING ADT PASSENGER</Text>
                    </Endorsement>
                    <Endorsement type="WARNING">
                      <Text>EACH INF REQUIRES ACCOMPANYING ADT PASSENGER</Text>
                    </Endorsement>
                    <Endorsement type="WARNING">
                      <Text>VALIDATING CARRIER SPECIFIED - SU</Text>
                    </Endorsement>
                    <Endorsement type="WARNING">
                      <Text>CHG BEF DEP UP TO RUB0/CHG AFT DEP UP TO RUB0/REF BEF DEP UP TO</Text>
                    </Endorsement>
                    <Endorsement type="WARNING">
                      <Text>RUB0/REF AFT DEP UP TO RUB5200/OTHERWISE NON-CHG NON-REF/SEE</Text>
                    </Endorsement>
                    <Endorsement type="WARNING">
                      <Text>RULES</Text>
                    </Endorsement>
                  </Endorsements>
                  <FareBasis Code="YCLR/IN00/YCLR/IN00"/>
                  <FareCalculation>
                    <Text>MOW SU AER0SU MOW0RUB0END</Text>
                  </FareCalculation>
                  <FareSource>ATPC</FareSource>
                  <FlightSegment ConnectionInd="O" DepartureDateTime="09-01T07:45" FlightNumber="1138" ResBookDesigCode="Y" SegmentNumber="1" Status="NS">
                    <BaggageAllowance Number="01P"/>
                    <FareBasis Code="YCLR/IN00"/>
                    <MarketingAirline Code="SU" FlightNumber="1138"/>
                    <OriginLocation LocationCode="SVO"/>
                    <ValidityDates>
                      <NotValidAfter>2020-09-01</NotValidAfter>
                      <NotValidBefore>2020-09-01</NotValidBefore>
                    </ValidityDates>
                  </FlightSegment>
                  <FlightSegment ConnectionInd="O" DepartureDateTime="09-08T02:45" FlightNumber="1129" ResBookDesigCode="Y" SegmentNumber="2" Status="NS">
                    <BaggageAllowance Number="01P"/>
                    <FareBasis Code="YCLR/IN00"/>
                    <MarketingAirline Code="SU" FlightNumber="1129"/>
                    <OriginLocation LocationCode="AER"/>
                    <ValidityDates>
                      <NotValidAfter>2020-09-08</NotValidAfter>
                      <NotValidBefore>2020-09-08</NotValidBefore>
                    </ValidityDates>
                  </FlightSegment>
                  <FlightSegment>
                    <OriginLocation LocationCode="SVO"/>
                  </FlightSegment>
                  <FareComponent Amount="0" FareBasisCode="YCLR/IN00" FareComponentNumber="1" FareDirectionality="FROM" GoverningCarrier="SU" TicketDesignator="IN00">
                    <Location Destination="AER" Origin="MOW"/>
                    <Dates ArrivalDateTime="09-01T10:15" DepartureDateTime="09-01T07:45"/>
                    <FlightSegmentNumbers>
                      <FlightSegmentNumber>1</FlightSegmentNumber>
                    </FlightSegmentNumbers>
                  </FareComponent>
                  <FareComponent Amount="0" FareBasisCode="YCLR/IN00" FareComponentNumber="2" FareDirectionality="TO" GoverningCarrier="SU" TicketDesignator="IN00">
                    <Location Destination="MOW" Origin="AER"/>
                    <Dates ArrivalDateTime="09-08T05:20" DepartureDateTime="09-08T02:45"/>
                    <FlightSegmentNumbers>
                      <FlightSegmentNumber>2</FlightSegmentNumber>
                    </FlightSegmentNumbers>
                  </FareComponent>
                  <ResTicketingRestrictions>LAST DAY TO PURCHASE 27AUG/2359</ResTicketingRestrictions>
                  <ResTicketingRestrictions>GUARANTEED FARE APPL IF PURCHASED BEFORE 27AUG</ResTicketingRestrictions>
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
            <BaseFare Amount="159500.00"/>
            <Taxes>
              <Tax Amount="17720.00"/>
            </Taxes>
            <TotalFare Amount="177220.00"/>
          </PriceQuoteTotals>
        </ItineraryPricing>
        <ReservationItems>
          <Item RPH="1">
            <FlightSegment AirMilesFlown="0873" ArrivalDateTime="09-01T10:15" CodeShare="false" DayOfWeekInd="2" DepartureDateTime="2020-09-01T07:45" ElapsedTime="02.30" FlightNumber="1138" Id="16" IsPast="false" NumberInParty="03" ResBookDesigCode="Y" SegmentBookedDate="2020-01-22T03:15:00" SegmentNumber="0001" SmokingAllowed="false" SpecialMeal="false" Status="HK" StopQuantity="00" eTicket="true">
              <DestinationLocation LocationCode="AER"/>
              <Equipment AirEquipType="73H"/>
              <MarketingAirline Code="SU" FlightNumber="1138" ResBookDesigCode="Y">
                <Banner>MARKETED BY AEROFLOT</Banner>
              </MarketingAirline>
              <Meal Code="S"/>
              <OperatingAirline Code="SU" FlightNumber="1138" ResBookDesigCode="Y">
                <Banner>OPERATED BY AEROFLOT</Banner>
              </OperatingAirline>
              <OperatingAirlinePricing Code="SU"/>
              <DisclosureCarrier Code="SU" DOT="false">
                <Banner>AEROFLOT</Banner>
              </DisclosureCarrier>
              <OriginLocation LocationCode="SVO" Terminal="TERMINAL B - DOMESTIC" TerminalCode="B"/>
              <SupplierRef ID="DCSU*XQSTMF"/>
              <UpdatedArrivalTime>09-01T10:15</UpdatedArrivalTime>
              <UpdatedDepartureTime>09-01T07:45</UpdatedDepartureTime>
            </FlightSegment>
            <Product>
              <ProductDetails productCategory="AIR">
                <ProductName type="AIR"/>
                <Air segmentAssociationId="2" sequence="1">
                  <DepartureAirport>SVO</DepartureAirport>
                  <DepartureTerminalName>TERMINAL B - DOMESTIC</DepartureTerminalName>
                  <DepartureTerminalCode>B</DepartureTerminalCode>
                  <ArrivalAirport>AER</ArrivalAirport>
                  <EquipmentType>73H</EquipmentType>
                  <MarketingAirlineCode>SU</MarketingAirlineCode>
                  <MarketingFlightNumber>1138</MarketingFlightNumber>
                  <MarketingClassOfService>Y</MarketingClassOfService>
                  <MealCode>S</MealCode>
                  <ElapsedTime>150</ElapsedTime>
                  <AirMilesFlown>873</AirMilesFlown>
                  <FunnelFlight>false</FunnelFlight>
                  <ChangeOfGauge>false</ChangeOfGauge>
                  <DisclosureCarrier Code="SU" DOT="false">
                    <Banner>AEROFLOT</Banner>
                  </DisclosureCarrier>
                  <AirlineRefId>DCSU*XQSTMF</AirlineRefId>
                  <Eticket>true</Eticket>
                  <DepartureDateTime>2020-09-01T07:45:00</DepartureDateTime>
                  <ArrivalDateTime>2020-09-01T10:15:00</ArrivalDateTime>
                  <FlightNumber>1138</FlightNumber>
                  <ClassOfService>Y</ClassOfService>
                  <ActionCode>HK</ActionCode>
                  <NumberInParty>3</NumberInParty>
                  <inboundConnection>false</inboundConnection>
                  <outboundConnection>false</outboundConnection>
                  <SegmentBookedDate>2020-01-22T03:15:00</SegmentBookedDate>
                </Air>
              </ProductDetails>
            </Product>
          </Item>
          <Item RPH="2">
            <FlightSegment AirMilesFlown="0873" ArrivalDateTime="09-08T05:20" CodeShare="false" DayOfWeekInd="2" DepartureDateTime="2020-09-08T02:45" ElapsedTime="02.35" FlightNumber="1129" Id="17" IsPast="false" NumberInParty="03" ResBookDesigCode="Y" SegmentBookedDate="2020-01-22T03:15:00" SegmentNumber="0002" SmokingAllowed="false" SpecialMeal="false" Status="HK" StopQuantity="00" eTicket="true">
              <DestinationLocation LocationCode="SVO" Terminal="TERMINAL B - DOMESTIC" TerminalCode="B"/>
              <Equipment AirEquipType="73H"/>
              <MarketingAirline Code="SU" FlightNumber="1129" ResBookDesigCode="Y">
                <Banner>MARKETED BY AEROFLOT</Banner>
              </MarketingAirline>
              <Meal Code="S"/>
              <OperatingAirline Code="SU" FlightNumber="1129" ResBookDesigCode="Y">
                <Banner>OPERATED BY AEROFLOT</Banner>
              </OperatingAirline>
              <OperatingAirlinePricing Code="SU"/>
              <DisclosureCarrier Code="SU" DOT="false">
                <Banner>AEROFLOT</Banner>
              </DisclosureCarrier>
              <OriginLocation LocationCode="AER"/>
              <SupplierRef ID="DCSU*XQSTMF"/>
              <UpdatedArrivalTime>09-08T05:20</UpdatedArrivalTime>
              <UpdatedDepartureTime>09-08T02:45</UpdatedDepartureTime>
            </FlightSegment>
            <Product>
              <ProductDetails productCategory="AIR">
                <ProductName type="AIR"/>
                <Air segmentAssociationId="3" sequence="2">
                  <DepartureAirport>AER</DepartureAirport>
                  <ArrivalAirport>SVO</ArrivalAirport>
                  <ArrivalTerminalName>TERMINAL B - DOMESTIC</ArrivalTerminalName>
                  <ArrivalTerminalCode>B</ArrivalTerminalCode>
                  <EquipmentType>73H</EquipmentType>
                  <MarketingAirlineCode>SU</MarketingAirlineCode>
                  <MarketingFlightNumber>1129</MarketingFlightNumber>
                  <MarketingClassOfService>Y</MarketingClassOfService>
                  <MealCode>S</MealCode>
                  <ElapsedTime>155</ElapsedTime>
                  <AirMilesFlown>873</AirMilesFlown>
                  <FunnelFlight>false</FunnelFlight>
                  <ChangeOfGauge>false</ChangeOfGauge>
                  <DisclosureCarrier Code="SU" DOT="false">
                    <Banner>AEROFLOT</Banner>
                  </DisclosureCarrier>
                  <AirlineRefId>DCSU*XQSTMF</AirlineRefId>
                  <Eticket>true</Eticket>
                  <DepartureDateTime>2020-09-08T02:45:00</DepartureDateTime>
                  <ArrivalDateTime>2020-09-08T05:20:00</ArrivalDateTime>
                  <FlightNumber>1129</FlightNumber>
                  <ClassOfService>Y</ClassOfService>
                  <ActionCode>HK</ActionCode>
                  <NumberInParty>3</NumberInParty>
                  <inboundConnection>false</inboundConnection>
                  <outboundConnection>false</outboundConnection>
                  <SegmentBookedDate>2020-01-22T03:15:00</SegmentBookedDate>
                </Air>
              </ProductDetails>
            </Product>
          </Item>
        </ReservationItems>
        <Ticketing RPH="01" TicketTimeLimit="TAW/"/>
      </ItineraryInfo>
      <ItineraryRef AirExtras="false" ID="XQSTDE" InhibitCode="U" PartitionID="AA" PrimeHostID="1S">
        <Header>PRICE QUOTE RECORD EXISTS - SYSTEM</Header>
        <Source AAA_PseudoCityCode="2FRH" CreateDateTime="2020-01-22T03:15" CreationAgent="AWT" HomePseudoCityCode="9LSC" LastUpdateDateTime="2020-01-22T03:15" PseudoCityCode="2FRH" ReceivedFrom="API" SequenceNumber="1"/>
      </ItineraryRef>
      <RemarkInfo>
        <Remark Id="26" RPH="001" Type="General">
          <Text>TEXT REMARK</Text>
        </Remark>
      </RemarkInfo>
      <SpecialServiceInfo Id="9" RPH="001" Type="AFX">
        <Service SSR_Code="OSI">
          <PersonName NameNumber="04.01">I/IVANOVA/EKATERINA</PersonName>
          <Text>AA INF</Text>
        </Service>
      </SpecialServiceInfo>
      <SpecialServiceInfo Id="18" RPH="001" Type="GFX">
        <Service SSR_Code="SSR" SSR_Type="INFT">
          <Airline Code="SU"/>
          <PersonName NameNumber="01.01">IVANOV/IVAN MR</PersonName>
          <Text>NN1 SVOAER1138Y01SEP/IVANOVA/EKATERINA/20FEB19</Text>
        </Service>
      </SpecialServiceInfo>
      <SpecialServiceInfo Id="19" RPH="002" Type="GFX">
        <Service SSR_Code="SSR" SSR_Type="INFT">
          <Airline Code="SU"/>
          <PersonName NameNumber="01.01">IVANOV/IVAN MR</PersonName>
          <Text>NN1 AERSVO1129Y08SEP/IVANOVA/EKATERINA/20FEB19</Text>
        </Service>
      </SpecialServiceInfo>
      <SpecialServiceInfo Id="20" RPH="003" Type="GFX">
        <Service SSR_Code="SSR" SSR_Type="CTCM">
          <Airline Code="SU"/>
          <PersonName NameNumber="01.01">IVANOV/IVAN MR</PersonName>
          <Text>HK1/79851234567/RU</Text>
        </Service>
      </SpecialServiceInfo>
      <SpecialServiceInfo Id="21" RPH="004" Type="GFX">
        <Service SSR_Code="SSR" SSR_Type="CTCE">
          <Airline Code="SU"/>
          <PersonName NameNumber="01.01">IVANOV/IVAN MR</PersonName>
          <Text>HK1/CUSTOMER//CUSTOMER.COM/RU</Text>
        </Service>
      </SpecialServiceInfo>
      <SpecialServiceInfo Id="22" RPH="005" Type="GFX">
        <Service SSR_Code="SSR" SSR_Type="DOCS">
          <Airline Code="SU"/>
          <PersonName NameNumber="01.01">IVANOV/IVAN MR</PersonName>
          <Text>HK1/P/RU/1234567890/RU/20NOV1980/M/20NOV2025/IVANOV/IVAN/IVANOVICH/H</Text>
        </Service>
      </SpecialServiceInfo>
      <SpecialServiceInfo Id="23" RPH="006" Type="GFX">
        <Service SSR_Code="SSR" SSR_Type="DOCS">
          <Airline Code="SU"/>
          <PersonName NameNumber="02.01">IVANOVA/ELENA MS</PersonName>
          <Text>HK1/P/RU/2234567890/RU/20JAN1980/F/15AUG2025/IVANOVA/ELENA/IVANOVNA</Text>
        </Service>
      </SpecialServiceInfo>
      <SpecialServiceInfo Id="24" RPH="007" Type="GFX">
        <Service SSR_Code="SSR" SSR_Type="DOCS">
          <Airline Code="SU"/>
          <PersonName NameNumber="03.01">IVANOV/ANDREY</PersonName>
          <Text>HK1/P/RU/3234567890/RU/15JAN2012/M/20NOV2025/IVANOV/ANDREY/IVANOVICH</Text>
        </Service>
      </SpecialServiceInfo>
      <SpecialServiceInfo Id="25" RPH="008" Type="GFX">
        <Service SSR_Code="SSR" SSR_Type="DOCS">
          <Airline Code="SU"/>
          <PersonName NameNumber="01.01">IVANOV/IVAN MR</PersonName>
          <Text>HK1/P/RU/1234567890/RU/20FEB2019/FI/15APR2025/IVANOVA/EKATERINA/IVANOVNA</Text>
        </Service>
      </SpecialServiceInfo>
      <OpenReservationElements>
        <OpenReservationElement elementId="pnr-9" id="9" type="SRVC">
          <ServiceRequest airlineCode="AA" serviceType="OSI" ssrType="AFX">
            <FreeText>INF</FreeText>
            <FullText>AA INF</FullText>
          </ServiceRequest>
          <NameAssociation>
            <LastName>IVANOVA</LastName>
            <FirstName>EKATERINA</FirstName>
            <ReferenceId>4</ReferenceId>
            <NameRefNumber>04.01</NameRefNumber>
          </NameAssociation>
        </OpenReservationElement>
        <OpenReservationElement elementId="pnr-or-16" id="16"/>
        <OpenReservationElement elementId="pnr-or-16" id="16"/>
        <OpenReservationElement elementId="pnr-or-17" id="17"/>
        <OpenReservationElement elementId="pnr-or-17" id="17"/>
        <OpenReservationElement elementId="pnr-18" id="18" type="SRVC">
          <ServiceRequest actionCode="NN" airlineCode="SU" code="INFT" serviceCount="1" serviceType="SSR" ssrType="GFX">
            <FreeText>/IVANOVA/EKATERINA/20FEB19</FreeText>
            <FullText>INFT SU NN1 SVOAER1138Y01SEP/IVANOVA/EKATERINA/20FEB19</FullText>
          </ServiceRequest>
          <SegmentAssociation Id="16" SegmentAssociationId="2">
            <AirSegment>
              <CarrierCode>SU</CarrierCode>
              <FlightNumber>1138</FlightNumber>
              <DepartureDate>2020-09-01</DepartureDate>
              <BoardPoint>SVO</BoardPoint>
              <OffPoint>AER</OffPoint>
              <ClassOfService>Y</ClassOfService>
            </AirSegment>
          </SegmentAssociation>
          <NameAssociation>
            <LastName>IVANOV</LastName>
            <FirstName>IVAN MR</FirstName>
            <ReferenceId>1</ReferenceId>
            <NameRefNumber>01.01</NameRefNumber>
          </NameAssociation>
        </OpenReservationElement>
        <OpenReservationElement elementId="pnr-19" id="19" type="SRVC">
          <ServiceRequest actionCode="NN" airlineCode="SU" code="INFT" serviceCount="1" serviceType="SSR" ssrType="GFX">
            <FreeText>/IVANOVA/EKATERINA/20FEB19</FreeText>
            <FullText>INFT SU NN1 AERSVO1129Y08SEP/IVANOVA/EKATERINA/20FEB19</FullText>
          </ServiceRequest>
          <SegmentAssociation Id="17" SegmentAssociationId="3">
            <AirSegment>
              <CarrierCode>SU</CarrierCode>
              <FlightNumber>1129</FlightNumber>
              <DepartureDate>2020-09-08</DepartureDate>
              <BoardPoint>AER</BoardPoint>
              <OffPoint>SVO</OffPoint>
              <ClassOfService>Y</ClassOfService>
            </AirSegment>
          </SegmentAssociation>
          <NameAssociation>
            <LastName>IVANOV</LastName>
            <FirstName>IVAN MR</FirstName>
            <ReferenceId>1</ReferenceId>
            <NameRefNumber>01.01</NameRefNumber>
          </NameAssociation>
        </OpenReservationElement>
        <OpenReservationElement elementId="pnr-20" id="20" type="SRVC">
          <ServiceRequest actionCode="HK" airlineCode="SU" code="CTCM" serviceCount="1" serviceType="SSR" ssrType="GFX">
            <FreeText>/79851234567/RU</FreeText>
            <FullText>CTCM SU HK1/79851234567/RU</FullText>
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
        <OpenReservationElement elementId="pnr-21" id="21" type="SRVC">
          <ServiceRequest actionCode="HK" airlineCode="SU" code="CTCE" serviceCount="1" serviceType="SSR" ssrType="GFX">
            <Comment>COM/RU</Comment>
            <FreeText>/CUSTOMER//CUSTOMER.COM/RU</FreeText>
            <FullText>CTCE SU HK1/CUSTOMER//CUSTOMER.COM/RU</FullText>
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
        <OpenReservationElement elementId="pnr-22" id="22" type="SRVC">
          <ServiceRequest actionCode="HK" airlineCode="SU" code="DOCS" serviceCount="1" serviceType="SSR" ssrType="GFX">
            <FreeText>/P/RU/1234567890/RU/20NOV1980/M/20NOV2025/IVANOV/IVAN/IVANOVICH/H</FreeText>
            <FullText>DOCS SU HK1/P/RU/1234567890/RU/20NOV1980/M/20NOV2025/IVANOV/IVAN/IVANOVICH/H</FullText>
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
        <OpenReservationElement elementId="pnr-23" id="23" type="SRVC">
          <ServiceRequest actionCode="HK" airlineCode="SU" code="DOCS" serviceCount="1" serviceType="SSR" ssrType="GFX">
            <FreeText>/P/RU/2234567890/RU/20JAN1980/F/15AUG2025/IVANOVA/ELENA/IVANOVNA</FreeText>
            <FullText>DOCS SU HK1/P/RU/2234567890/RU/20JAN1980/F/15AUG2025/IVANOVA/ELENA/IVANOVNA</FullText>
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
        <OpenReservationElement elementId="pnr-24" id="24" type="SRVC">
          <ServiceRequest actionCode="HK" airlineCode="SU" code="DOCS" serviceCount="1" serviceType="SSR" ssrType="GFX">
            <FreeText>/P/RU/3234567890/RU/15JAN2012/M/20NOV2025/IVANOV/ANDREY/IVANOVICH</FreeText>
            <FullText>DOCS SU HK1/P/RU/3234567890/RU/15JAN2012/M/20NOV2025/IVANOV/ANDREY/IVANOVICH</FullText>
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
        <OpenReservationElement elementId="pnr-25" id="25" type="SRVC">
          <ServiceRequest actionCode="HK" airlineCode="SU" code="DOCS" serviceCount="1" serviceType="SSR" ssrType="GFX">
            <FreeText>/P/RU/1234567890/RU/20FEB2019/FI/15APR2025/IVANOVA/EKATERINA/IVANOVNA</FreeText>
            <FullText>DOCS SU HK1/P/RU/1234567890/RU/20FEB2019/FI/15APR2025/IVANOVA/EKATERINA/IVANOVNA</FullText>
            <TravelDocument>
              <Type>P</Type>
              <DocumentIssueCountry>RU</DocumentIssueCountry>
              <DocumentNumber>1234567890</DocumentNumber>
              <DocumentNationalityCountry>RU</DocumentNationalityCountry>
              <DocumentExpirationDate>15APR2025</DocumentExpirationDate>
              <DateOfBirth>20FEB2019</DateOfBirth>
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
        <OpenReservationElement elementId="pnr-13" id="13" type="PSG_DETAILS_MAIL">
          <Email comment="BC/" type="BC">
            <Address>AGENCY@AGENCY.COM</Address>
          </Email>
        </OpenReservationElement>
        <OpenReservationElement elementId="pnr-12" id="12" type="PSG_DETAILS_MAIL">
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
  </TravelItineraryRead>
</CreatePassengerNameRecordRS>
{% endxmlsec %}
