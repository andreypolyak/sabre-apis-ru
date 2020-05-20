# Проверка стоимости и наличия мест

-----

**Оглавление:**
<!-- toc -->

-----

## Введение

Для проверки стоимости и наличия мест на определенном маршруте может быть использован сервис [RevalidateItinRQ](https://developer.sabre.com/docs/read/soap_apis/air/search/revalidate_itinerary). Ниже представлены ситуации, при которых он может быть использован:
- Проверка стоимости и наличия мест после того, как пользователь выбрал вариант перелета в поисковой выдаче, но до того, как он внес все необходимые данные для создания бронирования.
- Получение самого дешевого доступного варианта тарификации с учетом наличия мест в случае, если перевозчик не подтвердил места в момент взятия мест
- Актуализация варианта перелета после перехода пользователя с сайта метапоисковика на сайт агентства
- Получение актуального расчета стоимости после поиска по расписанию
- Получение альтернативных вариантов расчета для заданного варианта перелета

Схема сервиса соответствует схеме, используемой сервисами семейства Bargain Finder Max: [BargainFinderMaxRQ](https://developer.sabre.com/docs/soap_apis/air/search/bargain_finder_max) и [BargainFinderMax_ADRQ](https://developer.sabre.com/docs/soap_apis/air/search/bargain_finder_max/bfm_ad).

## Сегменты

Маршрут в запросе к сервису задается в последовательно расположенных элементах ```/OTA_AirLowFareSearchRQ/OriginDestinationInformation```, соответствующих плечам маршрута. Плечо может содержать один или несколько сегментов (рейсов). Для каждого плеча маршрута необходимо указать:

- ```OriginDestinationInformation/@RPH``` — номер запрашиваемого плеча
- ```OriginDestinationInformation/DepartureDateTime``` — дата и время вылета для плеча
- ```OriginDestinationInformation/OriginLocation/@LocationCode``` — код аэропорта вылета
- ```OriginDestinationInformation/DestinationLocation/@LocationCode``` — код аэропорта прилета

Информация о сегментах, соответствующих каждому плечу, передается в последовательно расположенных элементах ```/OTA_AirLowFareSearchRQ/OriginDestinationInformation/TPA_Extensions/Flight```. Для каждого сегмента необходимо указать:
- ```Flight/@ArrivalDateTime``` — дата и время прибытия рейса
- ```Flight/@ClassOfService``` — класс бронирования
- ```Flight/@DepartureDateTime``` — дата и время отправления рейса
- ```Flight/@Number``` — номер рейса
- ```Flight/@Type``` — всегда ```A```
- ```Flight/OriginLocation/@LocationCode``` — аэропорт прибытия
- ```Flight/DestinationLocation/@LocationCode``` — аэропорт отправления
- ```Flight/Airline/@Marketing``` — код маркетингового перевозчика
- ```Flight/Airline/@Operating``` — код оперирующего перевозчика

## Пассажиры

Количество мест должно быть задано в элементе ```/OTA_AirLowFareSearchRQ/TravelerInfoSummary/SeatsRequested```.

*Обратите внимание на то, что количество пассажиров может отличаться от количества мест в случае, если производится поиск перелетов для младенцев без места*

Категории пассажиров задаются в последовательно расположенных элементах ```/OTA_AirLowFareSearchRQ/TravelerInfoSummary/AirTravelerAvail/PassengerTypeQuantity```. Для каждой категории пассажира необходимо указать:
- ```PassengerTypeQuantity/@Code``` — код категории пассажира
- ```PassengerTypeQuantity/@Quantity``` — количество пассажиров данной категории

Коды основных категорий пассажиров:
- ```ADT``` — взрослый пассажир (от 12 лет)
- ```CNN``` — ребенок (от 2 до 12 лет)
- ```INF``` — младенец без места (до 2 лет)
- ```INS``` — младенец с местом (до 2 лет)

## Багаж

#### Нормы провоза багажа

Для получения информации о нормах провоза багажа в структурированном виде (максимальное количество мест багажа или максимальный вес багажа) необходимо указать значение ```A``` у атрибута ```/OTA_AirLowFareSearchRQ/TravelPreferences/Baggage/@RequestType```.

Для получения дополнительной информации в текстовом виде (максимальный вес и размеры багажа) необходимо указать значение ```true``` у атрибута ```/OTA_AirLowFareSearchRQ/TravelPreferences/Baggage/@Description```.

#### Тарифы с багажом

Для поиска тарифов с багажом (как минимум одно бесплатное место провоза багажа) в запросе необходимо указать значение ```true``` у атрибута ```/OTA_AirLowFareSearchRQ/TravelPreferences/Baggage/@FreePieceRequired```. При проверке стоимости и наличия мест для перелетов с [расчетом стоимости по всем доступным брендам](revalidate-itinerary.md#raschet_stoimosti_po_vsem_dostupnim_brendam), в результатах будут представлены только те брендированные тарифы, которые имеют как минимум одно бесплатное место провоза багажа.

**Обратите внимание на то, что для вариантов перелетов, которые были получены в результатах при поиске тарифов с багажом и, которые не являются брендированными, требуется особый порядок выполнения расчета стоимости и бронирования. См. подробнее в разделах [Создание бронирований в 1 шаг](create-booking-1step.md#raschet_stoimosti_po_kodam_tarifov), [Создание бронирований в 2 шага](create-booking-2steps.md#raschet_stoimosti_po_kodam_tarifov).**

## Коды тарифов

В случае необходимости выполнения расчета стоимости по заданному тарифу его код может быть передан в качестве значения атрибута ```/OTA_AirLowFareSearchRQ/OriginDestinationInformation/TPA_Extensions/FareBasis/@Code``` (применение тарифа для выбранного плеча маршрута) или ```/OTA_AirLowFareSearchRQ/TravelPreferences/TPA_Extensions/FareBasis/@Code``` (применение тарифа для всего маршрута).

И для плеча маршрута и для всего маршрута можно передать несколько кодов тарифов в последовательно расположенных элементах ```FareBasis```. В этом случае сервис выберет любой тариф из перечисленных, который будет соответствовать остальным условиям запроса (класс бронирования, бренд, режим работы и т.д.). В случае, если несколько тарифов будут соответствовать остальным условиям запроса, то будет выбран самый дешевый тариф.

Также сервис позволяет указать вместо кода тарифа маску поиска кода тарифа, в котором помимо букв латинского алфавита и цифр можно использовать следующие спецсимволы:
- ```-``` — ноль или более символов. Например, под условия маски ```Y-OW``` подпадут тарифы ```YOW```, ```YLTOW``` и ```YSTDOW```
- ```?``` — один символ. Например, под условия маски ```Y??OW``` подпадут тарифы ```YPROW``` и ```YECOW```
- ```^X``` — один символ кроме ```X``` (вместо ```X``` может быть указана любая буква латинского алфавита или цифра). Например, под условия маски ```^YLTOW``` подпадут тарифы ```NLTOW```, ```ELTOW```, но не подпадет ```YLTOW```

## Классы бронирования

Черный и белый список классов бронирования (*не классов обслуживания!*) для всех рейсов в запросе задается в последовательно расположенных элементах ```/OTA_AirLowFareSearchRQ/TravelPreferences/TPA_Extensions/ClassOfService```. Для каждого класса бронирования необходимо указать:
- ```ClassOfService/@Code``` — класс бронирования
- ```ClassOfService/@PreferLevel``` — добавление класса бронирования в белый (значение ```Preferred```) или черный (значение ```Unacceptable```) список

Черный и белый список классов бронирования для каждого плеча задается в последовательно расположенных элементах ```/OTA_AirLowFareSearchRQ/OriginDestinationInformation/TPA_Extensions/ClassOfService```. Для каждого класса бронирования необходимо указать:
- ```ClassOfService/@Code``` — класс бронирования
- ```ClassOfService/@PreferLevel``` — добавление класса бронирования в белый (значение ```Preferred```) или черный (значение ```Unacceptable```) список

Черные и белые списки классов бронирования могут быть указаны только при использовании [режимов работы](revalidate-itinerary.md#rezhim_raboti) ```L``` и ```B```.

## Брендированные тарифы

#### Информация о примененных брендированных тарифах

По умолчанию ответ на запрос не содержит информацию о примененных брендированных тарифах (код бренда, название бренда, код программы брендов и т.д.). Для того, чтобы получить эту информацию, необходимо указать значение ```true``` у атрибута ```/OTA_AirLowFareSearchRQ/TravelerInfoSummary/PriceRequestInformation/TPA_Extensions/BrandedFareIndicators/@SingleBrandedFare```.

#### Расчет стоимости по всем доступным брендам

Для получения расчета стоимости по всем доступным брендам необходимо указать значение ```true``` у атрибута ```/OTA_AirLowFareSearchRQ/TravelerInfoSummary/PriceRequestInformation/TPA_Extensions/BrandedFareIndicators/@MultipleBrandedFares```.

Также дополнительно в элементе ```/OTA_AirLowFareSearchRQ/TravelerInfoSummary/PriceRequestInformation/TPA_Extensions/BrandedFareIndicators``` можно указать атрибуты:
- ```/@UpsellLimit``` — максимальное количество предлагаемых дополнительных брендированных тарифов (по умолчанию — 12)
- ```/@ParityMode``` — режим выбора брендов:
    - ```Itin``` — для всего перелета будет использован один и тот же бренд
    - ```Leg``` — для каждого плеча перелета могут быть использованы разные бренды (режим по умолчанию)
- ```/@ItinParityBrandlessLeg``` — режим выбора брендов, если у атрибута ```/@ParityMode``` выбрано значение ```Itin```, однако для части сегментов не предусмотрены брендированные тарифы. Возможные значения:
    - ```true``` — ответ может содержать варианты расчетов, при которых для части сегментов указан один бренд, а для других сегментов бренд не указан
    - ```false``` — ответ не может содержать варианты расчетов, при которых для части сегментов указан один бренд, а для других сегментов бренд не указан (режим по умолчанию)
- ```/@ItinParityFallbackMode``` — режим выбора брендов, если у атрибута ```/@ParityMode``` выбрано значение ```Itin```, однако отсутствует возможность использовать одинаковый бренд для всех сегментов в перелете. Возможные значения:
    - ```LegParity``` — для каждого плеча перелета могут быть использованы разные бренды
    - ```LowestSingle``` — расчет по самым дешевым тарифам без учета брендов (режим по умолчанию)
- ```/@ParityModeForLowest``` — по умолчанию (когда данный атрибут не указан) при расчете стоимости по всем брендам самый дешевый вариант расчета может быть выполнен частично или полностью по тарифам, которые не являются брендированными. Чтобы этого избежать можно указать:
    - ```Itin``` — для всего перелета будет использован один и тот же бренд
    - ```Leg``` — для каждого плеча перелета могут быть использованы разные бренды

**Расчет стоимости по всем доступным брендам возможен только при использовании режимов работы ```L``` и ```B``` (см. ниже).**

#### Список услуг у найденных брендированных тарифов

Для получения списка услуг у найденных брендированных тарифов необходимо указать значение ```true``` у атрибута ```/OTA_AirLowFareSearchRQ/TravelerInfoSummary/PriceRequestInformation/TPA_Extensions/BrandedFareIndicators/@ReturnBrandAncillaries```. Эта опция может быть запрошена только при запросе информации о примененных брендированных тарифах (```/@SingleBrandedFare```) или при получении расчетов по всем доступным брендам (```/@MultipleBrandedFares```).

Подробнее см. в разделе [Брендированные тарифы](brands.md#spisok_uslug_u_brendirovannih_tarifov).

#### Черный и белый список брендов

Черный список брендов задается в последовательно расположенных элементах ```/OTA_AirLowFareSearchRQ/TravelerInfoSummary/PriceRequestInformation/TPA_Extensions/BrandedFareIndicators/BrandFilters/Brand``` (для всего маршрута) или ```/OTA_AirLowFareSearchRQ/OriginDestinationInformation/TPA_Extensions/BrandFilters/Brand``` (для плеча). Для каждого бренда необходимо указать:
- ```Preference/@Code``` — код бренда
- ```Preference/@Level``` — значение ```Unacceptable```

Белый список брендов задается в последовательно расположенных элементах ```/OTA_AirLowFareSearchRQ/TravelerInfoSummary/PriceRequestInformation/TPA_Extensions/BrandedFareIndicators/BrandFilters/Brand``` (для всего маршрута) или ```/OTA_AirLowFareSearchRQ/OriginDestinationInformation/TPA_Extensions/BrandFilters/Brand``` (для плеча). Для каждого бренда необходимо указать:
- ```Preference/@Code``` — код бренда
- ```Preference/@Level``` — значение ```Preferred```

Для корректной проверки наличия мест и расчета стоимости вариантов перелетов, выбранных в результатах поиска с [расчетом по всем доступным брендам](shop.md#raschet_stoimosti_po_vsem_dostupnim_brendam) необходимо указать соответствующие коды бренды в белом списке. Обратите внимание на то, что бренд в белом списке указывается для всего плеча. Если для разных сегментов одного плеча применяются разные бренды, то белый список брендов указывать не требуется.

Обратите внимание на то, что даже передав один или несколько кодов брендов в белом списке, в ответе расчет для этого плеча может быть выполнен по небрендированному тарифу. Для того, чтобы этого избежать, необходимо указать значение ```Unacceptable``` у атрибута ```/OTA_AirLowFareSearchRQ/TravelerInfoSummary/PriceRequestInformation/TPA_Extensions/BrandedFareIndicators/BrandFilters/NonBrandedFares/@PreferLevel``` (для всего маршрута) или ```/OTA_AirLowFareSearchRQ/OriginDestinationInformation/TPA_Extensions/BrandFilters/NonBrandedFares/@PreferLevel``` (для плеча). Для того, чтобы расчет был выполнен только по небрендированным тарифам, необходимо указать значение ```Preferred``` у этого атрибута.

## Валидирующий перевозчик

По умолчанию сервис выполняет расчет стоимости варианта перелета, используя ту логику, которая определяется состоянием настроек [Validating Carrier, Interline, and GSA](tjr-settings.md#validating_carrier_interline_and_gsa_novaya_logika_vibora_validiruyuschego_perevozchika) и [Restrict Validating Carrier to Traditional Validating Carrier](tjr-settings.md#restrict_validating_carrier_to_traditional_validating_carrier_traditsionnaya_logika_vibora_validiruyuschego_perevozchika). Для переопределения валидирующего перевозчика его код необходимо указать в качестве значения атрибута ```/OTA_AirLowFareSearchRQ/TravelPreferences/TPA_Extensions/ValidatingCarrier/@Code```.

## Дополнительные услуги

Атрибут ```/OTA_AirLowFareSearchRQ/TravelPreferences/AncillaryFees/@Enable``` со значением равным ```true``` позволяет запросить дополнительную информацию о наличии у перевозчика дополнительных услуг и их стоимости.

При необходимости можно ограничить список возвращаемых дополнительных услуг, указав их коды в качестве значений атрибута ```/@Code``` последовательно расположенных элементов ```/OTA_AirLowFareSearchRQ/TravelPreferences/AncillaryFees/AncillaryFeeGroup```.

Доступные категории дополнительных услуг:
- ```BG``` — багаж
- ```GT``` — наземные перевозки
- ```IE``` — развлечения на борту
- ```LG``` — доступ в залы ожидания
- ```MD``` — медицинские услуги
- ```PT``` — перевозка животных
- ```SA``` — бронирование мест в салоне
- ```ML``` — питание и напитки
- ```UN``` — несопровождаемые дети

Подробнее о дополнительных услугах см. в [Дополнительные услуги](ancillaries.md).

## Обмен и возврат билетов

Атрибут ```/OTA_AirLowFareSearchRQ/TravelerInfoSummary/AirTravelerAvail/PassengerTypeQuantity/TPA_Extensions/VoluntaryChanges/@Match``` со значением равным ```Info``` позволяет получить в результатах поиска информацию о возможности совершения обмена и возврата до и после вылета, а также величину штрафа за обмен и возврат.

В запросе можно указать требования к условиям обмена и возврата билетов для найденных перелетов. Для этого необходимо установить одно из двух значений атрибута ```/OTA_AirLowFareSearchRQ/TravelerInfoSummary/AirTravelerAvail/PassengerTypeQuantity/TPA_Extensions/VoluntaryChanges/@Match```:
- ```All``` — найденные варианты должны отвечать всем указанным требованиям
- ```Any``` — найденные варианты должны отвечать хотя бы одному из указанных требований

Требования к условиям задаются в последовательно расположенных элементах ```/OTA_AirLowFareSearchRQ/TravelerInfoSummary/AirTravelerAvail/PassengerTypeQuantity/TPA_Extensions/VoluntaryChanges/Penalty``` со следующими опциональными атрибутами:
- ```/@Type``` — тип операции. Возможные варианты:
    - ```Refund``` — возврат
    - ```After``` — обмен
- ```/@Exclude``` — исключить тарифы, которые отвечают указанным требованиям. Возможные варианты:
    - ```true``` — исключить тарифы
    - ```false``` — не исключать тарифы (по умолчанию)
- ```/@Application``` — применимость штрафа. Возможные варианты:
    - ```Before``` — штраф за обмен или возврат до вылета
    - ```After``` — штраф за обмен или возврат после вылета
- ```/@Amount``` — максимальная величина штрафа
- ```/@CurrencyCode``` — код валюты штрафа, например ```RUB```

Всего в запросе может быть до двух требований: одно для обмена и одно для возврата.

Примеры:

{% xmlsec "Ответ будет содержать информацию об обмене и возврате", true %}
<VoluntaryChanges Match="Info"/>
{% endxmlsec %}

{% xmlsec "Ответ будет содержать только те варианты, которые можно вернуть", true %}
<VoluntaryChanges Match="All">
  <Penalty Type="Refund"/>
</VoluntaryChanges>
{% endxmlsec %}

{% xmlsec "Ответ будет содержать только те варианты, которые можно и вернуть и обменять", true %}
<VoluntaryChanges Match="All">
  <Penalty Type="Exchange"/>
  <Penalty Type="Refund"/>
</VoluntaryChanges>
{% endxmlsec %}

{% xmlsec "Ответ будет содержать только те варианты, которые можно или вернуть или обменять", true %}
<VoluntaryChanges Match="Any">
  <Penalty Type="Exchange"/>
  <Penalty Type="Refund"/>
</VoluntaryChanges>
{% endxmlsec %}

{% xmlsec "Ответ будет содержать только те варианты, которые можно вернуть и обменять со штрафом не более 1000 рублей", true %}
<VoluntaryChanges Match="All">
  <Penalty Type="Exchange" Amount="1000" CurrencyCode="RUB"/>
  <Penalty Type="Refund" Amount="1000" CurrencyCode="RUB"/>
</VoluntaryChanges>
{% endxmlsec %}

{% xmlsec "Ответ будет содержать только те варианты, которые нельзя вернуть", true %}
<VoluntaryChanges Match="All">
  <Penalty Type="Refund" Exclude="true"/>
</VoluntaryChanges>
{% endxmlsec %}

## Публичные и приватные тарифы

По умолчанию сервис выполняет расчет стоимости по самому дешевому доступному тарифу в соответствии с запрошенными параметрами вне зависимости от того являются ли они публичными или приватными тарифами. Однако, указав значение атрибута ```/OTA_AirLowFareSearchRQ/TravelerInfoSummary/PriceRequestInformation/TPA_Extensions/PublicFare/@Ind``` или ```/OTA_AirLowFareSearchRQ/TravelerInfoSummary/PriceRequestInformation/TPA_Extensions/PrivateFare/@Ind``` равное ```true``` можно запросить расчет только по публичным или приватным тарифам, соответственно.

Список кодов корпоративных скидок (Corporate ID) задается в последовательно расположенных элементах ```/OTA_AirLowFareSearchRQ/TravelerInfoSummary/PriceRequestInformation/NegotiatedFareCode```. Для каждого кода необходимо указать его значение в атрибуте ```NegotiatedFareCode/@Code```. Дополнительно можно задать список перевозчиков, для которых действует данный код. Данный список задается в последовательно расположенных элементах ```NegotiatedFareCode/Supplier```. Для каждого элемента необходимо задать код перевозчика в атрибуте ```NegotiatedFareCode/Supplier/@Code```.

Список аккаунт кодов (Account Code) задается в последовательно расположенных элементах ```/OTA_AirLowFareSearchRQ/TravelerInfoSummary/PriceRequestInformation/AccountCode```. Для каждого аккаунт кода необходимо указать его значение в атрибуте ```AccountCode/@Code```.

## Оформление на нескольких билетах

По умолчанию сервис выполняет расчет стоимости для указанных в запросе сегментов так, чтобы их можно было оформить на одном билете. При использовании данной опции запрашиваемый маршрут туда-обратно (Round Trip) может быть разбит на два маршрута туда (One Way) для оформления на двух билетах.

Доступно два режима работа данной опции, каждый из которых имеет собственный код, который должен быть указан в атрибуте ```/OTA_AirLowFareSearchRQ/TPA_Extensions/MultiTicket/@DisplayPolicy```:
- ```SOW``` (Show One Ways) — в ответе будет представлен как расчет стоимости на одном билете, так и на двух  
- ```SCHS``` (Show CHeapest Solutions) — в ответе будет представлен или расчет стоимости на одном или на двух билетах в зависимости от того, что будет дешевле

*Варианты перелетов, которые должны быть оформлены на двух билетах, рекомендуется оформлять в разных бронированиях. В этом случае сценарии бронирования, оформления билетов и другие рекомендуется выполнять параллельно в разных сессиях. Сами сценарии работы с бронированиями не меняются.*

## iPCC

Запрос к сервису RevalidateItinRQ должен содержать элемент ```/OTA_AirLowFareSearchRQ/POS``` в корневом элементе:

{% xmlsec "Пример", true %}
<POS>
  <Source PseudoCityCode="Ваш iPCC">
    <RequestorID ID="1" Type="1">
      <CompanyName Code="TN"/>
    </RequestorID>
  </Source>
</POS>
{% endxmlsec %}

В атрибуте ```/OTA_AirLowFareSearchRQ/POS/Source/@PseudoCityCode``` необходимо указать iPCC, из которого производится запрос. Остальные атрибуты должны быть заполнены как в примере выше.

## Режим работы

Сервис имеет три режима на выбор, код которого должен быть указан в качестве значения атрибута ```/OTA_AirLowFareSearchRQ/TravelPreferences/TPA_Extensions/VerificationItinCallLogic/@Value```:
- ```L``` (Lowest) — получение расчета стоимости для самого дешевого класса бронирования с учетом наличия мест и параметров расчета, указанных в запросе
- ```M``` (Matched) — получение расчета стоимости для указанного в запросе класса бронирования с учетом наличия мест и параметров расчета, указанных в запросе
- ```B``` (Both) — комбинация двух указанных выше режимов. Ответ будет содержать два расчета стоимости: для самого дешевого класса бронирования с учетом наличия мест и параметров расчета, указанных в запросе, и для указанного в запросе класса бронирования с учетом наличия мест и параметров расчета, указанных в запросе. В случае совпадения расчетов по самому дешевому классу бронированию и указанному в запросе классу бронирования сервис все равно вернет в ответе два расчета стоимости

По умолчанию сервис всегда проверяет наличие мест в любом из указанных выше режимов. Это означает, что сервис не вернет расчет стоимости в каком-либо классе бронирования, если его невозможно забронировать. Проверку наличия мест можно отключить, указав значение ```false``` у атрибута ```/OTA_AirLowFareSearchRQ/TravelPreferences/TPA_Extensions/VerificationItinCallLogic/@AlwaysCheckAvailability```.

## Вид ответа

У сервиса RevalidateItinRQ существует два основных вида представления ответов, код которого должен быть указан в атрибуте ```/OTA_AirLowFareSearchRQ/@ResponseType``` запроса:
- ```OTA``` — стандартный вид ответа, в котором вся информация представлена в иерархическом виде. Ответ содержит список элементов, каждый из которых содержит информацию о предложенной опции, например, информацию о перелетах, расчет стоимости и т.д. Эти элементы, в свою очередь, могут содержать другие элементы, например, расчет стоимости содержит информацию о таксах (величина, код, название)
- ```GIR``` — группированный или нормализованный вид ответа. Ответ содержит информацию отдельно о рейсах, расчетах стоимости, таксах и т.д. Связность между элементами достигается за счет использования идентификаторов элементов

## Примеры

{% xmlsec "Пример запроса (L режим)", false %}
<OTA_AirLowFareSearchRQ ResponseType="OTA" Version="6.1.0" xmlns="http://www.opentravel.org/OTA/2003/05">
  <POS>
    <Source PseudoCityCode="9LSC">
      <RequestorID ID="1" Type="1">
        <CompanyName Code="TN"/>
      </RequestorID>
    </Source>
  </POS>
  <OriginDestinationInformation RPH="1">
    <DepartureDateTime>2020-09-01T05:00:00</DepartureDateTime>
    <OriginLocation LocationCode="LED"/>
    <DestinationLocation LocationCode="AER"/>
    <TPA_Extensions>
      <Flight ArrivalDateTime="2020-09-01T06:25:00" ClassOfService="Y" DepartureDateTime="2020-09-01T05:00:00" Number="35" Type="A">
        <OriginLocation LocationCode="LED"/>
        <DestinationLocation LocationCode="SVO"/>
        <Airline Marketing="SU" Operating="SU"/>
      </Flight>
      <Flight ArrivalDateTime="2020-09-01T10:15:00" ClassOfService="Y" DepartureDateTime="2020-09-01T07:45:00" Number="1138" Type="A">
        <OriginLocation LocationCode="SVO"/>
        <DestinationLocation LocationCode="AER"/>
        <Airline Marketing="SU" Operating="SU"/>
      </Flight>
    </TPA_Extensions>
  </OriginDestinationInformation>
  <OriginDestinationInformation RPH="2">
    <DepartureDateTime>2020-09-08T06:50:00</DepartureDateTime>
    <OriginLocation LocationCode="AER"/>
    <DestinationLocation LocationCode="LED"/>
    <TPA_Extensions>
      <Flight ArrivalDateTime="2020-09-08T09:20:00" ClassOfService="Y" DepartureDateTime="2020-09-08T06:50:00" Number="1141" Type="A">
        <OriginLocation LocationCode="AER"/>
        <DestinationLocation LocationCode="SVO"/>
        <Airline Marketing="SU" Operating="SU"/>
      </Flight>
      <Flight ArrivalDateTime="2020-09-08T12:20:00" ClassOfService="Y" DepartureDateTime="2020-09-08T10:55:00" Number="14" Type="A">
        <OriginLocation LocationCode="SVO"/>
        <DestinationLocation LocationCode="LED"/>
        <Airline Marketing="SU" Operating="SU"/>
      </Flight>
    </TPA_Extensions>
  </OriginDestinationInformation>
  <TravelPreferences>
    <TPA_Extensions>
      <VerificationItinCallLogic Value="L"/>
    </TPA_Extensions>
    <Baggage Description="true" RequestType="A"/>
  </TravelPreferences>
  <TravelerInfoSummary>
    <SeatsRequested>3</SeatsRequested>
    <AirTravelerAvail>
      <PassengerTypeQuantity Code="ADT" Quantity="2">
        <TPA_Extensions>
          <VoluntaryChanges Match="Info"/>
        </TPA_Extensions>
      </PassengerTypeQuantity>
      <PassengerTypeQuantity Code="CNN" Quantity="1">
        <TPA_Extensions>
          <VoluntaryChanges Match="Info"/>
        </TPA_Extensions>
      </PassengerTypeQuantity>
      <PassengerTypeQuantity Code="INF" Quantity="1">
        <TPA_Extensions>
          <VoluntaryChanges Match="Info"/>
        </TPA_Extensions>
      </PassengerTypeQuantity>
    </AirTravelerAvail>
    <PriceRequestInformation>
      <TPA_Extensions>
        <BrandedFareIndicators ReturnBrandAncillaries="true" SingleBrandedFare="true"/>
      </TPA_Extensions>
    </PriceRequestInformation>
  </TravelerInfoSummary>
</OTA_AirLowFareSearchRQ>
{% endxmlsec %}

{% xmlsec "Пример ответа", false %}
<OTA_AirLowFareSearchRS AvailableItinCount="0" BrandedOneWayItinCount="0" DepartedItinCount="0" PricedItinCount="1" SimpleOneWayItinCount="0" SoldOutItinCount="0" Version="6.1.0" xmlns="http://www.opentravel.org/OTA/2003/05" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <Success/>
  <Warnings>
    <Warning Code="TRANSACTIONID" MessageClass="I" ShortText="7547455509160214271" Type="WORKERTHREAD"/>
    <Warning Code="ASECT2LAPP00610.IDM.SGDCPROD.SABRE.COM" MessageClass="I" ShortText="27041" Type="SERVER"/>
    <Warning Code="RULEID" MessageClass="I" ShortText="24113" Type="DRE"/>
    <Warning Code="RULEID" MessageClass="I" ShortText="24111" Type="DEFAULT"/>
  </Warnings>
  <BrandFeatures>
    <BrandFeature Application="C" CommercialName="BASIC SEAT" Id="1" ServiceGroup="BF" ServiceType="Z" SubCode="050" Vendor="ATP"/>
    <BrandFeature Application="C" CommercialName="CHANGEABLE TICKET" Id="2" ServiceGroup="BF" ServiceType="Z" SubCode="059" Vendor="ATP"/>
    <BrandFeature Application="N" CommercialName="25 PERCENT MILES EARNED" Id="3" ServiceGroup="BF" ServiceType="Z" SubCode="06A" Vendor="ATP"/>
    <BrandFeature Application="N" CommercialName="150 PERCENT MILES EARNED" Id="4" ServiceGroup="BF" ServiceType="Z" SubCode="06M" Vendor="ATP"/>
    <BrandFeature Application="N" CommercialName="200 PERCENT MILES EARNED" Id="5" ServiceGroup="BF" ServiceType="Z" SubCode="06N" Vendor="ATP"/>
    <BrandFeature Application="N" CommercialName="125 MILES EARNED" Id="6" ServiceGroup="BF" ServiceType="Z" SubCode="06Y" Vendor="ATP"/>
    <BrandFeature Application="N" CommercialName="CHANGE IN CASE OF NO SHOW" Id="7" ServiceGroup="BF" ServiceType="Z" SubCode="CNS" Vendor="ATP"/>
    <BrandFeature Application="F" CommercialName="75 TO 125 PCNT MILES EARNED" Id="8" ServiceGroup="BF" ServiceType="Z" SubCode="ME1" Vendor="ATP"/>
    <BrandFeature Application="N" CommercialName="100 TO 150 PCNT MILES EARNED" Id="9" ServiceGroup="BF" ServiceType="Z" SubCode="ME2" Vendor="ATP"/>
    <BrandFeature Application="N" CommercialName="150 TO 200 PCNT MILES EARNED" Id="10" ServiceGroup="BF" ServiceType="Z" SubCode="ME3" Vendor="ATP"/>
    <BrandFeature Application="N" CommercialName="200 TO 250 PCNT MILES EARNED" Id="11" ServiceGroup="BF" ServiceType="Z" SubCode="ME4" Vendor="ATP"/>
    <BrandFeature Application="N" CommercialName="OPEN RETURN DATE" Id="12" ServiceGroup="BF" ServiceType="Z" SubCode="ORD" Vendor="ATP"/>
    <BrandFeature Application="N" CommercialName="REFUND AFTER CHECKIN CLOSURE" Id="13" ServiceGroup="BF" ServiceType="Z" SubCode="RBA" Vendor="ATP"/>
    <BrandFeature Application="N" CommercialName="REFUND BEFORE CHECKIN CLOSURE" Id="14" ServiceGroup="BF" ServiceType="Z" SubCode="RBC" Vendor="ATP"/>
    <BrandFeature Application="N" CommercialName="STOPOVER" Id="15" ServiceGroup="BF" ServiceType="Z" SubCode="STO" Vendor="ATP"/>
    <BrandFeature Application="C" CommercialName="UPGRADE AT CHECKIN TO COMFORT" Id="16" ServiceGroup="BF" ServiceType="Z" SubCode="UT2" Vendor="ATP"/>
    <BrandFeature Application="C" CommercialName="SECOND EXCESS BAG" Id="17" ServiceGroup="BG" ServiceType="C" SubCode="0CD" Vendor="ATP"/>
    <BrandFeature Application="N" CommercialName="UPTO70LB 32KG AND62LI 158LCM" Id="18" ServiceGroup="BG" ServiceType="C" SubCode="0FM" Vendor="ATP"/>
    <BrandFeature Application="C" CommercialName="UPTO50LB 23KG AND62LI 158LCM" Id="19" ServiceGroup="BG" ServiceType="C" SubCode="0GO" Vendor="ATP"/>
    <BrandFeature Application="F" CommercialName="CARRY10KG 22LBUPTO 55X40X25CM" Id="20" ServiceGroup="BG" ServiceType="C" SubCode="0MJ" Vendor="ATP"/>
    <BrandFeature Application="N" CommercialName="CARRY15KG 33LBUPTO 55X40X25CM" Id="21" ServiceGroup="BG" ServiceType="C" SubCode="0MK" Vendor="ATP"/>
    <BrandFeature Application="C" CommercialName="INTERNET ACCESS" Id="22" ServiceGroup="IE" ServiceType="F" SubCode="0CL" Vendor="ATP"/>
    <BrandFeature Application="N" CommercialName="LOUNGE ACCESS" Id="23" ServiceGroup="LG" ServiceType="F" SubCode="0BX" Vendor="ATP"/>
    <BrandFeature Application="N" CommercialName="PRIORITY CHECK IN" Id="24" ServiceGroup="TS" ServiceType="F" SubCode="03P" Vendor="ATP"/>
    <BrandFeature Application="N" CommercialName="PRIORITY BOARDING" Id="25" ServiceGroup="TS" ServiceType="F" SubCode="0G6" Vendor="ATP"/>
    <BrandFeature Application="N" CommercialName="PRIORITY BAGGAGE" Id="26" ServiceGroup="TS" ServiceType="F" SubCode="0LF" Vendor="ATP"/>
    <BrandFeature Application="N" CommercialName="UPGRADE WITH MILES BONUS" Id="27" ServiceGroup="UP" ServiceType="F" SubCode="0NI" Vendor="ATP"/>
    <BrandFeature Application="C" CommercialName="UPGRADE AT CHECKIN TO BUSINESS" Id="28" ServiceGroup="UP" ServiceType="F" SubCode="UPF" Vendor="ATP"/>
  </BrandFeatures>
  <PricedItineraries>
    <PricedItinerary SequenceNumber="1">
      <AirItinerary DirectionInd="Return">
        <OriginDestinationOptions>
          <OriginDestinationOption ArrivalCountry="RU" DepartureCountry="RU" ElapsedTime="315">
            <FlightSegment ArrivalDateTime="2020-09-01T06:25:00" DepartureDateTime="2020-09-01T05:00:00" ElapsedTime="85" FlightNumber="35" ResBookDesigCode="N" StopQuantity="0">
              <DepartureAirport LocationCode="LED" TerminalID="1"/>
              <ArrivalAirport LocationCode="SVO" TerminalID="B"/>
              <OperatingAirline Code="SU" FlightNumber="35"/>
              <Equipment AirEquipType="320"/>
              <MarketingAirline Code="SU"/>
              <MarriageGrp>O</MarriageGrp>
              <DepartureTimeZone GMTOffset="3"/>
              <ArrivalTimeZone GMTOffset="3"/>
              <TPA_Extensions>
                <eTicket Ind="true"/>
                <Mileage Amount="372"/>
              </TPA_Extensions>
            </FlightSegment>
            <FlightSegment ArrivalDateTime="2020-09-01T10:15:00" DepartureDateTime="2020-09-01T07:40:00" ElapsedTime="155" FlightNumber="1138" ResBookDesigCode="N" StopQuantity="0">
              <DepartureAirport LocationCode="SVO" TerminalID="B"/>
              <ArrivalAirport LocationCode="AER"/>
              <OperatingAirline Code="SU" FlightNumber="1138"/>
              <Equipment AirEquipType="73H"/>
              <MarketingAirline Code="SU"/>
              <MarriageGrp>I</MarriageGrp>
              <DepartureTimeZone GMTOffset="3"/>
              <ArrivalTimeZone GMTOffset="3"/>
              <TPA_Extensions>
                <eTicket Ind="true"/>
                <Mileage Amount="873"/>
              </TPA_Extensions>
            </FlightSegment>
          </OriginDestinationOption>
          <OriginDestinationOption ArrivalCountry="RU" DepartureCountry="RU" ElapsedTime="345">
            <FlightSegment ArrivalDateTime="2020-09-08T08:45:00" DepartureDateTime="2020-09-08T06:20:00" ElapsedTime="145" FlightNumber="1141" ResBookDesigCode="T" StopQuantity="0">
              <DepartureAirport LocationCode="AER"/>
              <ArrivalAirport LocationCode="SVO" TerminalID="B"/>
              <OperatingAirline Code="SU" FlightNumber="1141"/>
              <Equipment AirEquipType="32A"/>
              <MarketingAirline Code="SU"/>
              <MarriageGrp>O</MarriageGrp>
              <DepartureTimeZone GMTOffset="3"/>
              <ArrivalTimeZone GMTOffset="3"/>
              <TPA_Extensions>
                <eTicket Ind="true"/>
                <Mileage Amount="873"/>
              </TPA_Extensions>
            </FlightSegment>
            <FlightSegment ArrivalDateTime="2020-09-08T12:05:00" DepartureDateTime="2020-09-08T10:40:00" ElapsedTime="85" FlightNumber="14" ResBookDesigCode="T" StopQuantity="0">
              <DepartureAirport LocationCode="SVO" TerminalID="B"/>
              <ArrivalAirport LocationCode="LED" TerminalID="1"/>
              <OperatingAirline Code="SU" FlightNumber="14"/>
              <Equipment AirEquipType="320"/>
              <MarketingAirline Code="SU"/>
              <MarriageGrp>I</MarriageGrp>
              <DepartureTimeZone GMTOffset="3"/>
              <ArrivalTimeZone GMTOffset="3"/>
              <TPA_Extensions>
                <eTicket Ind="true"/>
                <Mileage Amount="372"/>
              </TPA_Extensions>
            </FlightSegment>
          </OriginDestinationOption>
        </OriginDestinationOptions>
      </AirItinerary>
      <AirItineraryPricingInfo BrandsOnAnyMarket="true" FareReturned="true" LastTicketDate="2020-05-31" LastTicketTime="23:59" PricingSource="WPNI1_ITIN" PricingSubSource="MIP">
        <ItinTotalFare>
          <BaseFare Amount="31215" CurrencyCode="RUB" DecimalPlaces="0"/>
          <FareConstruction Amount="31213" CurrencyCode="RUB" DecimalPlaces="0"/>
          <EquivFare Amount="31215" CurrencyCode="RUB" DecimalPlaces="0"/>
          <Taxes>
            <Tax Amount="24470" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="TOTALTAX"/>
          </Taxes>
          <TotalFare Amount="55685" CurrencyCode="RUB" DecimalPlaces="0"/>
        </ItinTotalFare>
        <PTC_FareBreakdowns>
          <PTC_FareBreakdown>
            <PassengerTypeQuantity Code="ADT" Quantity="2"/>
            <FareBasisCodes>
              <FareBasisCode ArrivalAirportCode="SVO" BookingCode="N" DepartureAirportCode="LED" FareComponentBeginAirport="LED" FareComponentDirectionality="FROM" FareComponentEndAirport="AER" FareComponentFareRule="ENR1" FareComponentFareTariff="304" FareComponentFareType="SB" FareComponentFareTypeBitmap="00" FareComponentVendorCode="ATP" GovCarrier="SU">NNBR</FareBasisCode>
              <FareBasisCode ArrivalAirportCode="AER" AvailabilityBreak="true" BookingCode="N" DepartureAirportCode="SVO" GovCarrier="SU">NNBR</FareBasisCode>
              <FareBasisCode ArrivalAirportCode="SVO" BookingCode="T" DepartureAirportCode="AER" FareComponentBeginAirport="AER" FareComponentDirectionality="TO" FareComponentEndAirport="LED" FareComponentFareRule="ENR1" FareComponentFareTariff="304" FareComponentFareType="SB" FareComponentFareTypeBitmap="00" FareComponentVendorCode="ATP" GovCarrier="SU">TNBR</FareBasisCode>
              <FareBasisCode ArrivalAirportCode="LED" AvailabilityBreak="true" BookingCode="T" DepartureAirportCode="SVO" GovCarrier="SU">TNBR</FareBasisCode>
            </FareBasisCodes>
            <PassengerFare>
              <BaseFare Amount="11350" CurrencyCode="RUB"/>
              <FareConstruction Amount="11350" CurrencyCode="RUB" DecimalPlaces="0"/>
              <EquivFare Amount="11350" CurrencyCode="RUB" DecimalPlaces="0"/>
              <Taxes>
                <Tax Amount="1500" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                <Tax Amount="1500" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                <Tax Amount="1500" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                <Tax Amount="1500" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                <Tax Amount="270" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRF"/>
                <Tax Amount="270" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRF"/>
                <Tax Amount="270" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRF"/>
                <Tax Amount="270" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRF"/>
                <Tax Amount="158" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                <Tax Amount="184" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                <Tax Amount="120" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                <Tax Amount="184" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                <Tax Amount="158" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI4"/>
                <Tax Amount="184" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI4"/>
                <Tax Amount="120" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI4"/>
                <Tax Amount="184" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI4"/>
                <TaxSummary Amount="6000" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                <TaxSummary Amount="1080" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRF"/>
                <TaxSummary Amount="1292" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                <TotalTax Amount="8372" CurrencyCode="RUB" DecimalPlaces="0"/>
              </Taxes>
              <TotalFare Amount="19722" CurrencyCode="RUB"/>
              <PenaltiesInfo>
                <Penalty Amount="2600" Applicability="Before" Changeable="true" ConditionsApply="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                <Penalty Amount="2600" Applicability="After" Changeable="true" ConditionsApply="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                <Penalty Applicability="Before" Refundable="false" Type="Refund"/>
                <Penalty Applicability="After" Refundable="false" Type="Refund"/>
              </PenaltiesInfo>
              <TPA_Extensions>
                <FareComponents>
                  <FareComponent BrandID="NB" BrandName="ECONOMY LITE" ProgramCode="CFF1S" ProgramDescription="1S" ProgramID="85965" ProgramSystemCode="X">
                    <Segment FlightIndex="1" LegIndex="1"/>
                    <Segment FlightIndex="2" LegIndex="1"/>
                    <BrandFeatureRef FeatureId="3"/>
                    <BrandFeatureRef FeatureId="8"/>
                    <BrandFeatureRef FeatureId="9"/>
                    <BrandFeatureRef FeatureId="10"/>
                    <BrandFeatureRef FeatureId="6"/>
                    <BrandFeatureRef FeatureId="4"/>
                    <BrandFeatureRef FeatureId="5"/>
                    <BrandFeatureRef FeatureId="11"/>
                    <BrandFeatureRef FeatureId="2"/>
                    <BrandFeatureRef FeatureId="7"/>
                    <BrandFeatureRef FeatureId="14"/>
                    <BrandFeatureRef FeatureId="13"/>
                    <BrandFeatureRef FeatureId="12"/>
                    <BrandFeatureRef FeatureId="16"/>
                    <BrandFeatureRef FeatureId="15"/>
                    <BrandFeatureRef FeatureId="1"/>
                    <BrandFeatureRef FeatureId="20"/>
                    <BrandFeatureRef FeatureId="21"/>
                    <BrandFeatureRef FeatureId="19"/>
                    <BrandFeatureRef FeatureId="18"/>
                    <BrandFeatureRef FeatureId="17"/>
                    <BrandFeatureRef FeatureId="22"/>
                    <BrandFeatureRef FeatureId="23"/>
                    <BrandFeatureRef FeatureId="25"/>
                    <BrandFeatureRef FeatureId="26"/>
                    <BrandFeatureRef FeatureId="24"/>
                    <BrandFeatureRef FeatureId="27"/>
                    <BrandFeatureRef FeatureId="28"/>
                  </FareComponent>
                  <FareComponent BrandID="NB" BrandName="ECONOMY LITE" ProgramCode="CFF1S" ProgramDescription="1S" ProgramID="85965" ProgramSystemCode="X">
                    <Segment FlightIndex="1" LegIndex="2"/>
                    <Segment FlightIndex="2" LegIndex="2"/>
                    <BrandFeatureRef FeatureId="3"/>
                    <BrandFeatureRef FeatureId="8"/>
                    <BrandFeatureRef FeatureId="9"/>
                    <BrandFeatureRef FeatureId="10"/>
                    <BrandFeatureRef FeatureId="6"/>
                    <BrandFeatureRef FeatureId="4"/>
                    <BrandFeatureRef FeatureId="5"/>
                    <BrandFeatureRef FeatureId="11"/>
                    <BrandFeatureRef FeatureId="2"/>
                    <BrandFeatureRef FeatureId="7"/>
                    <BrandFeatureRef FeatureId="14"/>
                    <BrandFeatureRef FeatureId="13"/>
                    <BrandFeatureRef FeatureId="12"/>
                    <BrandFeatureRef FeatureId="16"/>
                    <BrandFeatureRef FeatureId="15"/>
                    <BrandFeatureRef FeatureId="1"/>
                    <BrandFeatureRef FeatureId="20"/>
                    <BrandFeatureRef FeatureId="21"/>
                    <BrandFeatureRef FeatureId="19"/>
                    <BrandFeatureRef FeatureId="18"/>
                    <BrandFeatureRef FeatureId="17"/>
                    <BrandFeatureRef FeatureId="22"/>
                    <BrandFeatureRef FeatureId="23"/>
                    <BrandFeatureRef FeatureId="25"/>
                    <BrandFeatureRef FeatureId="26"/>
                    <BrandFeatureRef FeatureId="24"/>
                    <BrandFeatureRef FeatureId="27"/>
                    <BrandFeatureRef FeatureId="28"/>
                  </FareComponent>
                </FareComponents>
                <Messages>
                  <Message AirlineCode="SU" FailCode="0" Info="NONREF/HEBO3BPATEH" Type="N"/>
                  <Message FailCode="0" Info="VALIDATING CARRIER" Type="W"/>
                  <Message FailCode="0" Info="BSP - SU" Type="W"/>
                  <Message FailCode="0" Info="RUT - SU" Type="W"/>
                </Messages>
                <BaggageInformationList>
                  <BaggageInformation AirlineCode="SU" ProvisionType="A">
                    <Segment Id="0"/>
                    <Segment Id="1"/>
                    <Allowance Pieces="0"/>
                  </BaggageInformation>
                  <BaggageInformation AirlineCode="SU" ProvisionType="A">
                    <Segment Id="2"/>
                    <Segment Id="3"/>
                    <Allowance Pieces="0"/>
                  </BaggageInformation>
                </BaggageInformationList>
              </TPA_Extensions>
            </PassengerFare>
            <Endorsements NonRefundableIndicator="true"/>
            <TPA_Extensions>
              <FareCalcLine Info="LED SU X/MOW SU AER4500SU X/MOW SU LED6850RUB11350END"/>
            </TPA_Extensions>
            <FareInfos>
              <FareInfo>
                <FareReference>N</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="S"/>
                </TPA_Extensions>
              </FareInfo>
              <FareInfo>
                <FareReference>N</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="S"/>
                </TPA_Extensions>
              </FareInfo>
              <FareInfo>
                <FareReference>T</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="S"/>
                </TPA_Extensions>
              </FareInfo>
              <FareInfo>
                <FareReference>T</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="S"/>
                </TPA_Extensions>
              </FareInfo>
            </FareInfos>
          </PTC_FareBreakdown>
          <PTC_FareBreakdown>
            <PassengerTypeQuantity Code="CNN" Quantity="1"/>
            <FareBasisCodes>
              <FareBasisCode ArrivalAirportCode="SVO" BookingCode="N" DepartureAirportCode="LED" FareComponentBeginAirport="LED" FareComponentDirectionality="FROM" FareComponentEndAirport="AER" FareComponentFareRule="ENR1" FareComponentFareTariff="304" FareComponentFareType="SB" FareComponentFareTypeBitmap="01" FareComponentVendorCode="ATP" GovCarrier="SU">NNBR/CH25</FareBasisCode>
              <FareBasisCode ArrivalAirportCode="AER" AvailabilityBreak="true" BookingCode="N" DepartureAirportCode="SVO" GovCarrier="SU">NNBR/CH25</FareBasisCode>
              <FareBasisCode ArrivalAirportCode="SVO" BookingCode="T" DepartureAirportCode="AER" FareComponentBeginAirport="AER" FareComponentDirectionality="TO" FareComponentEndAirport="LED" FareComponentFareRule="ENR1" FareComponentFareTariff="304" FareComponentFareType="SB" FareComponentFareTypeBitmap="01" FareComponentVendorCode="ATP" GovCarrier="SU">TNBR/CH25</FareBasisCode>
              <FareBasisCode ArrivalAirportCode="LED" AvailabilityBreak="true" BookingCode="T" DepartureAirportCode="SVO" GovCarrier="SU">TNBR/CH25</FareBasisCode>
            </FareBasisCodes>
            <PassengerFare>
              <BaseFare Amount="8515" CurrencyCode="RUB"/>
              <FareConstruction Amount="8513" CurrencyCode="RUB" DecimalPlaces="0"/>
              <EquivFare Amount="8515" CurrencyCode="RUB" DecimalPlaces="0"/>
              <Taxes>
                <Tax Amount="1500" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                <Tax Amount="1500" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                <Tax Amount="1500" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                <Tax Amount="1500" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                <Tax Amount="270" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRF"/>
                <Tax Amount="270" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRF"/>
                <Tax Amount="270" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRF"/>
                <Tax Amount="270" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRF"/>
                <Tax Amount="79" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                <Tax Amount="92" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                <Tax Amount="60" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                <Tax Amount="92" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                <Tax Amount="79" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI4"/>
                <Tax Amount="92" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI4"/>
                <Tax Amount="60" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI4"/>
                <Tax Amount="92" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI4"/>
                <TaxSummary Amount="6000" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                <TaxSummary Amount="1080" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRF"/>
                <TaxSummary Amount="646" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                <TotalTax Amount="7726" CurrencyCode="RUB" DecimalPlaces="0"/>
              </Taxes>
              <TotalFare Amount="16241" CurrencyCode="RUB"/>
              <PenaltiesInfo>
                <Penalty Amount="2600" Applicability="Before" Changeable="true" ConditionsApply="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                <Penalty Amount="2600" Applicability="After" Changeable="true" ConditionsApply="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                <Penalty Applicability="Before" Refundable="false" Type="Refund"/>
                <Penalty Applicability="After" Refundable="false" Type="Refund"/>
              </PenaltiesInfo>
              <TPA_Extensions>
                <FareComponents>
                  <FareComponent BrandID="NB" BrandName="ECONOMY LITE" ProgramCode="CFF1S" ProgramDescription="1S" ProgramID="85965" ProgramSystemCode="X">
                    <Segment FlightIndex="1" LegIndex="1"/>
                    <Segment FlightIndex="2" LegIndex="1"/>
                    <BrandFeatureRef FeatureId="3"/>
                    <BrandFeatureRef FeatureId="8"/>
                    <BrandFeatureRef FeatureId="9"/>
                    <BrandFeatureRef FeatureId="10"/>
                    <BrandFeatureRef FeatureId="6"/>
                    <BrandFeatureRef FeatureId="4"/>
                    <BrandFeatureRef FeatureId="5"/>
                    <BrandFeatureRef FeatureId="11"/>
                    <BrandFeatureRef FeatureId="2"/>
                    <BrandFeatureRef FeatureId="7"/>
                    <BrandFeatureRef FeatureId="14"/>
                    <BrandFeatureRef FeatureId="13"/>
                    <BrandFeatureRef FeatureId="12"/>
                    <BrandFeatureRef FeatureId="16"/>
                    <BrandFeatureRef FeatureId="15"/>
                    <BrandFeatureRef FeatureId="1"/>
                    <BrandFeatureRef FeatureId="20"/>
                    <BrandFeatureRef FeatureId="21"/>
                    <BrandFeatureRef FeatureId="19"/>
                    <BrandFeatureRef FeatureId="18"/>
                    <BrandFeatureRef FeatureId="17"/>
                    <BrandFeatureRef FeatureId="22"/>
                    <BrandFeatureRef FeatureId="23"/>
                    <BrandFeatureRef FeatureId="25"/>
                    <BrandFeatureRef FeatureId="26"/>
                    <BrandFeatureRef FeatureId="24"/>
                    <BrandFeatureRef FeatureId="27"/>
                    <BrandFeatureRef FeatureId="28"/>
                  </FareComponent>
                  <FareComponent BrandID="NB" BrandName="ECONOMY LITE" ProgramCode="CFF1S" ProgramDescription="1S" ProgramID="85965" ProgramSystemCode="X">
                    <Segment FlightIndex="1" LegIndex="2"/>
                    <Segment FlightIndex="2" LegIndex="2"/>
                    <BrandFeatureRef FeatureId="3"/>
                    <BrandFeatureRef FeatureId="8"/>
                    <BrandFeatureRef FeatureId="9"/>
                    <BrandFeatureRef FeatureId="10"/>
                    <BrandFeatureRef FeatureId="6"/>
                    <BrandFeatureRef FeatureId="4"/>
                    <BrandFeatureRef FeatureId="5"/>
                    <BrandFeatureRef FeatureId="11"/>
                    <BrandFeatureRef FeatureId="2"/>
                    <BrandFeatureRef FeatureId="7"/>
                    <BrandFeatureRef FeatureId="14"/>
                    <BrandFeatureRef FeatureId="13"/>
                    <BrandFeatureRef FeatureId="12"/>
                    <BrandFeatureRef FeatureId="16"/>
                    <BrandFeatureRef FeatureId="15"/>
                    <BrandFeatureRef FeatureId="1"/>
                    <BrandFeatureRef FeatureId="20"/>
                    <BrandFeatureRef FeatureId="21"/>
                    <BrandFeatureRef FeatureId="19"/>
                    <BrandFeatureRef FeatureId="18"/>
                    <BrandFeatureRef FeatureId="17"/>
                    <BrandFeatureRef FeatureId="22"/>
                    <BrandFeatureRef FeatureId="23"/>
                    <BrandFeatureRef FeatureId="25"/>
                    <BrandFeatureRef FeatureId="26"/>
                    <BrandFeatureRef FeatureId="24"/>
                    <BrandFeatureRef FeatureId="27"/>
                    <BrandFeatureRef FeatureId="28"/>
                  </FareComponent>
                </FareComponents>
                <Messages>
                  <Message AirlineCode="SU" FailCode="0" Info="NONREF/HEBO3BPATEH" Type="N"/>
                  <Message FailCode="0" Info="EACH CNN REQUIRES ACCOMPANYING SAME CABIN ADT" Type="W"/>
                  <Message FailCode="0" Info="VALIDATING CARRIER" Type="W"/>
                  <Message FailCode="0" Info="BSP - SU" Type="W"/>
                  <Message FailCode="0" Info="RUT - SU" Type="W"/>
                </Messages>
                <BaggageInformationList>
                  <BaggageInformation AirlineCode="SU" ProvisionType="A">
                    <Segment Id="0"/>
                    <Segment Id="1"/>
                    <Allowance Pieces="0"/>
                  </BaggageInformation>
                  <BaggageInformation AirlineCode="SU" ProvisionType="A">
                    <Segment Id="2"/>
                    <Segment Id="3"/>
                    <Allowance Pieces="0"/>
                  </BaggageInformation>
                </BaggageInformationList>
              </TPA_Extensions>
            </PassengerFare>
            <Endorsements NonRefundableIndicator="true"/>
            <TPA_Extensions>
              <FareCalcLine Info="LED SU X/MOW SU AER3375SU X/MOW SU LED5138RUB8513END"/>
            </TPA_Extensions>
            <FareInfos>
              <FareInfo>
                <FareReference>N</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="S"/>
                </TPA_Extensions>
              </FareInfo>
              <FareInfo>
                <FareReference>N</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="S"/>
                </TPA_Extensions>
              </FareInfo>
              <FareInfo>
                <FareReference>T</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="S"/>
                </TPA_Extensions>
              </FareInfo>
              <FareInfo>
                <FareReference>T</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="S"/>
                </TPA_Extensions>
              </FareInfo>
            </FareInfos>
          </PTC_FareBreakdown>
          <PTC_FareBreakdown>
            <PassengerTypeQuantity Code="INF" Quantity="1"/>
            <FareBasisCodes>
              <FareBasisCode ArrivalAirportCode="SVO" BookingCode="N" DepartureAirportCode="LED" FareComponentBeginAirport="LED" FareComponentDirectionality="FROM" FareComponentEndAirport="AER" FareComponentFareRule="ENR1" FareComponentFareTariff="304" FareComponentFareType="SB" FareComponentFareTypeBitmap="01" FareComponentVendorCode="ATP" GovCarrier="SU">NNBR/IN00</FareBasisCode>
              <FareBasisCode ArrivalAirportCode="AER" AvailabilityBreak="true" BookingCode="N" DepartureAirportCode="SVO" GovCarrier="SU">NNBR/IN00</FareBasisCode>
              <FareBasisCode ArrivalAirportCode="SVO" BookingCode="T" DepartureAirportCode="AER" FareComponentBeginAirport="AER" FareComponentDirectionality="TO" FareComponentEndAirport="LED" FareComponentFareRule="ENR1" FareComponentFareTariff="304" FareComponentFareType="SB" FareComponentFareTypeBitmap="01" FareComponentVendorCode="ATP" GovCarrier="SU">TNBR/IN00</FareBasisCode>
              <FareBasisCode ArrivalAirportCode="LED" AvailabilityBreak="true" BookingCode="T" DepartureAirportCode="SVO" GovCarrier="SU">TNBR/IN00</FareBasisCode>
            </FareBasisCodes>
            <PassengerFare>
              <BaseFare Amount="0" CurrencyCode="RUB"/>
              <FareConstruction Amount="0" CurrencyCode="RUB" DecimalPlaces="0"/>
              <EquivFare Amount="0" CurrencyCode="RUB" DecimalPlaces="0"/>
              <TotalFare Amount="0" CurrencyCode="RUB"/>
              <PenaltiesInfo>
                <Penalty Amount="2600" Applicability="Before" Changeable="true" ConditionsApply="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                <Penalty Amount="2600" Applicability="After" Changeable="true" ConditionsApply="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                <Penalty Applicability="Before" Refundable="false" Type="Refund"/>
                <Penalty Applicability="After" Refundable="false" Type="Refund"/>
              </PenaltiesInfo>
              <TPA_Extensions>
                <FareComponents>
                  <FareComponent BrandID="NB" BrandName="ECONOMY LITE" ProgramCode="CFF1S" ProgramDescription="1S" ProgramID="85965" ProgramSystemCode="X">
                    <Segment FlightIndex="1" LegIndex="1"/>
                    <Segment FlightIndex="2" LegIndex="1"/>
                    <BrandFeatureRef FeatureId="3"/>
                    <BrandFeatureRef FeatureId="8"/>
                    <BrandFeatureRef FeatureId="9"/>
                    <BrandFeatureRef FeatureId="10"/>
                    <BrandFeatureRef FeatureId="6"/>
                    <BrandFeatureRef FeatureId="4"/>
                    <BrandFeatureRef FeatureId="5"/>
                    <BrandFeatureRef FeatureId="11"/>
                    <BrandFeatureRef FeatureId="2"/>
                    <BrandFeatureRef FeatureId="7"/>
                    <BrandFeatureRef FeatureId="14"/>
                    <BrandFeatureRef FeatureId="13"/>
                    <BrandFeatureRef FeatureId="12"/>
                    <BrandFeatureRef FeatureId="16"/>
                    <BrandFeatureRef FeatureId="15"/>
                    <BrandFeatureRef FeatureId="1"/>
                    <BrandFeatureRef FeatureId="20"/>
                    <BrandFeatureRef FeatureId="21"/>
                    <BrandFeatureRef FeatureId="19"/>
                    <BrandFeatureRef FeatureId="18"/>
                    <BrandFeatureRef FeatureId="17"/>
                    <BrandFeatureRef FeatureId="22"/>
                    <BrandFeatureRef FeatureId="23"/>
                    <BrandFeatureRef FeatureId="25"/>
                    <BrandFeatureRef FeatureId="26"/>
                    <BrandFeatureRef FeatureId="24"/>
                    <BrandFeatureRef FeatureId="27"/>
                    <BrandFeatureRef FeatureId="28"/>
                  </FareComponent>
                  <FareComponent BrandID="NB" BrandName="ECONOMY LITE" ProgramCode="CFF1S" ProgramDescription="1S" ProgramID="85965" ProgramSystemCode="X">
                    <Segment FlightIndex="1" LegIndex="2"/>
                    <Segment FlightIndex="2" LegIndex="2"/>
                    <BrandFeatureRef FeatureId="3"/>
                    <BrandFeatureRef FeatureId="8"/>
                    <BrandFeatureRef FeatureId="9"/>
                    <BrandFeatureRef FeatureId="10"/>
                    <BrandFeatureRef FeatureId="6"/>
                    <BrandFeatureRef FeatureId="4"/>
                    <BrandFeatureRef FeatureId="5"/>
                    <BrandFeatureRef FeatureId="11"/>
                    <BrandFeatureRef FeatureId="2"/>
                    <BrandFeatureRef FeatureId="7"/>
                    <BrandFeatureRef FeatureId="14"/>
                    <BrandFeatureRef FeatureId="13"/>
                    <BrandFeatureRef FeatureId="12"/>
                    <BrandFeatureRef FeatureId="16"/>
                    <BrandFeatureRef FeatureId="15"/>
                    <BrandFeatureRef FeatureId="1"/>
                    <BrandFeatureRef FeatureId="20"/>
                    <BrandFeatureRef FeatureId="21"/>
                    <BrandFeatureRef FeatureId="19"/>
                    <BrandFeatureRef FeatureId="18"/>
                    <BrandFeatureRef FeatureId="17"/>
                    <BrandFeatureRef FeatureId="22"/>
                    <BrandFeatureRef FeatureId="23"/>
                    <BrandFeatureRef FeatureId="25"/>
                    <BrandFeatureRef FeatureId="26"/>
                    <BrandFeatureRef FeatureId="24"/>
                    <BrandFeatureRef FeatureId="27"/>
                    <BrandFeatureRef FeatureId="28"/>
                  </FareComponent>
                </FareComponents>
                <Messages>
                  <Message AirlineCode="SU" FailCode="0" Info="NONREF/HEBO3BPATEH" Type="N"/>
                  <Message FailCode="0" Info="EACH INF REQUIRES ACCOMPANYING ADT PASSENGER" Type="W"/>
                  <Message FailCode="0" Info="VALIDATING CARRIER" Type="W"/>
                  <Message FailCode="0" Info="BSP - SU" Type="W"/>
                  <Message FailCode="0" Info="RUT - SU" Type="W"/>
                </Messages>
                <BaggageInformationList>
                  <BaggageInformation AirlineCode="SU" ProvisionType="A">
                    <Segment Id="0"/>
                    <Segment Id="1"/>
                    <Allowance Pieces="0"/>
                  </BaggageInformation>
                  <BaggageInformation AirlineCode="SU" ProvisionType="A">
                    <Segment Id="2"/>
                    <Segment Id="3"/>
                    <Allowance Pieces="0"/>
                  </BaggageInformation>
                </BaggageInformationList>
              </TPA_Extensions>
            </PassengerFare>
            <Endorsements NonRefundableIndicator="true"/>
            <TPA_Extensions>
              <FareCalcLine Info="LED SU X/MOW SU AER0SU X/MOW SU LED0RUB0END"/>
            </TPA_Extensions>
            <FareInfos>
              <FareInfo>
                <FareReference>N</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="S"/>
                </TPA_Extensions>
              </FareInfo>
              <FareInfo>
                <FareReference>N</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="S"/>
                </TPA_Extensions>
              </FareInfo>
              <FareInfo>
                <FareReference>T</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="S"/>
                </TPA_Extensions>
              </FareInfo>
              <FareInfo>
                <FareReference>T</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="S"/>
                </TPA_Extensions>
              </FareInfo>
            </FareInfos>
          </PTC_FareBreakdown>
        </PTC_FareBreakdowns>
        <FareInfos>
          <FareInfo>
            <FareReference>N</FareReference>
            <TPA_Extensions>
              <SeatsRemaining BelowMin="false" Number="9"/>
              <Cabin Cabin="Y"/>
              <Meal Code="S"/>
            </TPA_Extensions>
          </FareInfo>
          <FareInfo>
            <FareReference>N</FareReference>
            <TPA_Extensions>
              <SeatsRemaining BelowMin="false" Number="9"/>
              <Cabin Cabin="Y"/>
              <Meal Code="S"/>
            </TPA_Extensions>
          </FareInfo>
          <FareInfo>
            <FareReference>T</FareReference>
            <TPA_Extensions>
              <SeatsRemaining BelowMin="false" Number="9"/>
              <Cabin Cabin="Y"/>
              <Meal Code="S"/>
            </TPA_Extensions>
          </FareInfo>
          <FareInfo>
            <FareReference>T</FareReference>
            <TPA_Extensions>
              <SeatsRemaining BelowMin="false" Number="9"/>
              <Cabin Cabin="Y"/>
              <Meal Code="S"/>
            </TPA_Extensions>
          </FareInfo>
        </FareInfos>
        <TPA_Extensions>
          <DivideInParty Indicator="false"/>
          <ValidatingCarrier NewVcxProcess="true" SettlementMethod="BSP">
            <Default Code="SU"/>
          </ValidatingCarrier>
          <ValidatingCarrier NewVcxProcess="true" SettlementMethod="RUT">
            <Default Code="SU"/>
          </ValidatingCarrier>
        </TPA_Extensions>
      </AirItineraryPricingInfo>
      <TicketingInfo TicketType="eTicket" ValidInterline="Yes"/>
      <TPA_Extensions>
        <ValidatingCarrier Code="SU"/>
      </TPA_Extensions>
    </PricedItinerary>
  </PricedItineraries>
  <TPA_Extensions>
    <AirlineOrderList>
      <AirlineOrder Code="SU" SequenceNumber="1"/>
    </AirlineOrderList>
  </TPA_Extensions>
</OTA_AirLowFareSearchRS>
{% endxmlsec %}

---

{% xmlsec "Пример запроса (M режим)", false %}
<OTA_AirLowFareSearchRQ ResponseType="OTA" Version="6.1.0" xmlns="http://www.opentravel.org/OTA/2003/05">
  <POS>
    <Source PseudoCityCode="9LSC">
      <RequestorID ID="1" Type="1">
        <CompanyName Code="TN"/>
      </RequestorID>
    </Source>
  </POS>
  <OriginDestinationInformation RPH="1">
    <DepartureDateTime>2020-09-01T05:00:00</DepartureDateTime>
    <OriginLocation LocationCode="LED"/>
    <DestinationLocation LocationCode="AER"/>
    <TPA_Extensions>
      <Flight ArrivalDateTime="2020-09-01T06:25:00" ClassOfService="Y" DepartureDateTime="2020-09-01T05:00:00" Number="35" Type="A">
        <OriginLocation LocationCode="LED"/>
        <DestinationLocation LocationCode="SVO"/>
        <Airline Marketing="SU" Operating="SU"/>
      </Flight>
      <Flight ArrivalDateTime="2020-09-01T10:15:00" ClassOfService="Y" DepartureDateTime="2020-09-01T07:45:00" Number="1138" Type="A">
        <OriginLocation LocationCode="SVO"/>
        <DestinationLocation LocationCode="AER"/>
        <Airline Marketing="SU" Operating="SU"/>
      </Flight>
    </TPA_Extensions>
  </OriginDestinationInformation>
  <OriginDestinationInformation RPH="2">
    <DepartureDateTime>2020-09-08T06:50:00</DepartureDateTime>
    <OriginLocation LocationCode="AER"/>
    <DestinationLocation LocationCode="LED"/>
    <TPA_Extensions>
      <Flight ArrivalDateTime="2020-09-08T09:20:00" ClassOfService="Y" DepartureDateTime="2020-09-08T06:50:00" Number="1141" Type="A">
        <OriginLocation LocationCode="AER"/>
        <DestinationLocation LocationCode="SVO"/>
        <Airline Marketing="SU" Operating="SU"/>
      </Flight>
      <Flight ArrivalDateTime="2020-09-08T12:20:00" ClassOfService="Y" DepartureDateTime="2020-09-08T10:55:00" Number="14" Type="A">
        <OriginLocation LocationCode="SVO"/>
        <DestinationLocation LocationCode="LED"/>
        <Airline Marketing="SU" Operating="SU"/>
      </Flight>
    </TPA_Extensions>
  </OriginDestinationInformation>
  <TravelPreferences>
    <TPA_Extensions>
      <VerificationItinCallLogic Value="M"/>
    </TPA_Extensions>
    <Baggage Description="true" RequestType="A"/>
  </TravelPreferences>
  <TravelerInfoSummary>
    <SeatsRequested>3</SeatsRequested>
    <AirTravelerAvail>
      <PassengerTypeQuantity Code="ADT" Quantity="2">
        <TPA_Extensions>
          <VoluntaryChanges Match="Info"/>
        </TPA_Extensions>
      </PassengerTypeQuantity>
      <PassengerTypeQuantity Code="CNN" Quantity="1">
        <TPA_Extensions>
          <VoluntaryChanges Match="Info"/>
        </TPA_Extensions>
      </PassengerTypeQuantity>
      <PassengerTypeQuantity Code="INF" Quantity="1">
        <TPA_Extensions>
          <VoluntaryChanges Match="Info"/>
        </TPA_Extensions>
      </PassengerTypeQuantity>
    </AirTravelerAvail>
    <PriceRequestInformation>
      <TPA_Extensions>
        <BrandedFareIndicators ReturnBrandAncillaries="true" SingleBrandedFare="true"/>
      </TPA_Extensions>
    </PriceRequestInformation>
  </TravelerInfoSummary>
</OTA_AirLowFareSearchRQ>
{% endxmlsec %}

{% xmlsec "Пример ответа", false %}
<OTA_AirLowFareSearchRS AvailableItinCount="0" BrandedOneWayItinCount="0" DepartedItinCount="0" PricedItinCount="1" SimpleOneWayItinCount="0" SoldOutItinCount="0" Version="6.1.0" xmlns="http://www.opentravel.org/OTA/2003/05" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <Success/>
  <Warnings>
    <Warning Code="TRANSACTIONID" MessageClass="I" ShortText="7547532634086698039" Type="WORKERTHREAD"/>
    <Warning Code="ASECT2LAPP00623.IDM.SGDCPROD.SABRE.COM" MessageClass="I" ShortText="27041" Type="SERVER"/>
    <Warning Code="RULEID" MessageClass="I" ShortText="24113" Type="DRE"/>
    <Warning Code="RULEID" MessageClass="I" ShortText="24111" Type="DEFAULT"/>
  </Warnings>
  <BrandFeatures>
    <BrandFeature Application="F" CommercialName="BASIC SEAT" Id="1" ServiceGroup="BF" ServiceType="Z" SubCode="050" Vendor="ATP"/>
    <BrandFeature Application="C" CommercialName="BASIC SEAT" Id="2" ServiceGroup="BF" ServiceType="Z" SubCode="050" Vendor="ATP"/>
    <BrandFeature Application="C" CommercialName="CHANGEABLE TICKET" Id="3" ServiceGroup="BF" ServiceType="Z" SubCode="059" Vendor="ATP"/>
    <BrandFeature Application="F" CommercialName="CHANGEABLE TICKET" Id="4" ServiceGroup="BF" ServiceType="Z" SubCode="059" Vendor="ATP"/>
    <BrandFeature Application="N" CommercialName="25 PERCENT MILES EARNED" Id="5" ServiceGroup="BF" ServiceType="Z" SubCode="06A" Vendor="ATP"/>
    <BrandFeature Application="N" CommercialName="150 PERCENT MILES EARNED" Id="6" ServiceGroup="BF" ServiceType="Z" SubCode="06M" Vendor="ATP"/>
    <BrandFeature Application="N" CommercialName="200 PERCENT MILES EARNED" Id="7" ServiceGroup="BF" ServiceType="Z" SubCode="06N" Vendor="ATP"/>
    <BrandFeature Application="N" CommercialName="125 MILES EARNED" Id="8" ServiceGroup="BF" ServiceType="Z" SubCode="06Y" Vendor="ATP"/>
    <BrandFeature Application="F" CommercialName="CHANGE IN CASE OF NO SHOW" Id="9" ServiceGroup="BF" ServiceType="Z" SubCode="CNS" Vendor="ATP"/>
    <BrandFeature Application="N" CommercialName="CHANGE IN CASE OF NO SHOW" Id="10" ServiceGroup="BF" ServiceType="Z" SubCode="CNS" Vendor="ATP"/>
    <BrandFeature Application="F" CommercialName="75 TO 125 PCNT MILES EARNED" Id="11" ServiceGroup="BF" ServiceType="Z" SubCode="ME1" Vendor="ATP"/>
    <BrandFeature Application="N" CommercialName="75 TO 125 PCNT MILES EARNED" Id="12" ServiceGroup="BF" ServiceType="Z" SubCode="ME1" Vendor="ATP"/>
    <BrandFeature Application="N" CommercialName="100 TO 150 PCNT MILES EARNED" Id="13" ServiceGroup="BF" ServiceType="Z" SubCode="ME2" Vendor="ATP"/>
    <BrandFeature Application="F" CommercialName="150 TO 200 PCNT MILES EARNED" Id="14" ServiceGroup="BF" ServiceType="Z" SubCode="ME3" Vendor="ATP"/>
    <BrandFeature Application="N" CommercialName="150 TO 200 PCNT MILES EARNED" Id="15" ServiceGroup="BF" ServiceType="Z" SubCode="ME3" Vendor="ATP"/>
    <BrandFeature Application="N" CommercialName="200 TO 250 PCNT MILES EARNED" Id="16" ServiceGroup="BF" ServiceType="Z" SubCode="ME4" Vendor="ATP"/>
    <BrandFeature Application="N" CommercialName="OPEN RETURN DATE" Id="17" ServiceGroup="BF" ServiceType="Z" SubCode="ORD" Vendor="ATP"/>
    <BrandFeature Application="F" CommercialName="OPEN RETURN DATE" Id="18" ServiceGroup="BF" ServiceType="Z" SubCode="ORD" Vendor="ATP"/>
    <BrandFeature Application="N" CommercialName="REFUND AFTER CHECKIN CLOSURE" Id="19" ServiceGroup="BF" ServiceType="Z" SubCode="RBA" Vendor="ATP"/>
    <BrandFeature Application="F" CommercialName="REFUND AFTER CHECKIN CLOSURE" Id="20" ServiceGroup="BF" ServiceType="Z" SubCode="RBA" Vendor="ATP"/>
    <BrandFeature Application="F" CommercialName="REFUND BEFORE CHECKIN CLOSURE" Id="21" ServiceGroup="BF" ServiceType="Z" SubCode="RBC" Vendor="ATP"/>
    <BrandFeature Application="N" CommercialName="REFUND BEFORE CHECKIN CLOSURE" Id="22" ServiceGroup="BF" ServiceType="Z" SubCode="RBC" Vendor="ATP"/>
    <BrandFeature Application="F" CommercialName="STOPOVER" Id="23" ServiceGroup="BF" ServiceType="Z" SubCode="STO" Vendor="ATP"/>
    <BrandFeature Application="N" CommercialName="STOPOVER" Id="24" ServiceGroup="BF" ServiceType="Z" SubCode="STO" Vendor="ATP"/>
    <BrandFeature Application="C" CommercialName="UPGRADE AT CHECKIN TO COMFORT" Id="25" ServiceGroup="BF" ServiceType="Z" SubCode="UT2" Vendor="ATP"/>
    <BrandFeature Application="C" CommercialName="SECOND EXCESS BAG" Id="26" ServiceGroup="BG" ServiceType="C" SubCode="0CD" Vendor="ATP"/>
    <BrandFeature Application="F" CommercialName="SECOND EXCESS BAG" Id="27" ServiceGroup="BG" ServiceType="C" SubCode="0CD" Vendor="ATP"/>
    <BrandFeature Application="N" CommercialName="UPTO70LB 32KG AND62LI 158LCM" Id="28" ServiceGroup="BG" ServiceType="C" SubCode="0FM" Vendor="ATP"/>
    <BrandFeature Application="C" CommercialName="UPTO50LB 23KG AND62LI 158LCM" Id="29" ServiceGroup="BG" ServiceType="C" SubCode="0GO" Vendor="ATP"/>
    <BrandFeature Application="F" CommercialName="UPTO50LB 23KG AND62LI 158LCM" Id="30" ServiceGroup="BG" ServiceType="C" SubCode="0GO" Vendor="ATP"/>
    <BrandFeature Application="F" CommercialName="CARRY10KG 22LBUPTO 55X40X25CM" Id="31" ServiceGroup="BG" ServiceType="C" SubCode="0MJ" Vendor="ATP"/>
    <BrandFeature Application="N" CommercialName="CARRY15KG 33LBUPTO 55X40X25CM" Id="32" ServiceGroup="BG" ServiceType="C" SubCode="0MK" Vendor="ATP"/>
    <BrandFeature Application="C" CommercialName="INTERNET ACCESS" Id="33" ServiceGroup="IE" ServiceType="F" SubCode="0CL" Vendor="ATP"/>
    <BrandFeature Application="N" CommercialName="LOUNGE ACCESS" Id="34" ServiceGroup="LG" ServiceType="F" SubCode="0BX" Vendor="ATP"/>
    <BrandFeature Application="N" CommercialName="PRIORITY CHECK IN" Id="35" ServiceGroup="TS" ServiceType="F" SubCode="03P" Vendor="ATP"/>
    <BrandFeature Application="N" CommercialName="PRIORITY BOARDING" Id="36" ServiceGroup="TS" ServiceType="F" SubCode="0G6" Vendor="ATP"/>
    <BrandFeature Application="N" CommercialName="PRIORITY BAGGAGE" Id="37" ServiceGroup="TS" ServiceType="F" SubCode="0LF" Vendor="ATP"/>
    <BrandFeature Application="N" CommercialName="UPGRADE WITH MILES BONUS" Id="38" ServiceGroup="UP" ServiceType="F" SubCode="0NI" Vendor="ATP"/>
    <BrandFeature Application="F" CommercialName="UPGRADE WITH MILES BONUS" Id="39" ServiceGroup="UP" ServiceType="F" SubCode="0NI" Vendor="ATP"/>
    <BrandFeature Application="C" CommercialName="UPGRADE AT CHECKIN TO BUSINESS" Id="40" ServiceGroup="UP" ServiceType="F" SubCode="UPF" Vendor="ATP"/>
  </BrandFeatures>
  <PricedItineraries>
    <PricedItinerary SequenceNumber="1">
      <AirItinerary DirectionInd="Return">
        <OriginDestinationOptions>
          <OriginDestinationOption ArrivalCountry="RU" DepartureCountry="RU" ElapsedTime="315">
            <FlightSegment ArrivalDateTime="2020-09-01T06:25:00" DepartureDateTime="2020-09-01T05:00:00" ElapsedTime="85" FlightNumber="35" ResBookDesigCode="Y" StopQuantity="0">
              <DepartureAirport LocationCode="LED" TerminalID="1"/>
              <ArrivalAirport LocationCode="SVO" TerminalID="B"/>
              <OperatingAirline Code="SU" FlightNumber="35"/>
              <Equipment AirEquipType="320"/>
              <MarketingAirline Code="SU"/>
              <MarriageGrp>O</MarriageGrp>
              <DepartureTimeZone GMTOffset="3"/>
              <ArrivalTimeZone GMTOffset="3"/>
              <TPA_Extensions>
                <eTicket Ind="true"/>
                <Mileage Amount="372"/>
              </TPA_Extensions>
            </FlightSegment>
            <FlightSegment ArrivalDateTime="2020-09-01T10:15:00" DepartureDateTime="2020-09-01T07:40:00" ElapsedTime="155" FlightNumber="1138" ResBookDesigCode="Y" StopQuantity="0">
              <DepartureAirport LocationCode="SVO" TerminalID="B"/>
              <ArrivalAirport LocationCode="AER"/>
              <OperatingAirline Code="SU" FlightNumber="1138"/>
              <Equipment AirEquipType="73H"/>
              <MarketingAirline Code="SU"/>
              <MarriageGrp>I</MarriageGrp>
              <DepartureTimeZone GMTOffset="3"/>
              <ArrivalTimeZone GMTOffset="3"/>
              <TPA_Extensions>
                <eTicket Ind="true"/>
                <Mileage Amount="873"/>
              </TPA_Extensions>
            </FlightSegment>
          </OriginDestinationOption>
          <OriginDestinationOption ArrivalCountry="RU" DepartureCountry="RU" ElapsedTime="345">
            <FlightSegment ArrivalDateTime="2020-09-08T08:45:00" DepartureDateTime="2020-09-08T06:20:00" ElapsedTime="145" FlightNumber="1141" ResBookDesigCode="Y" StopQuantity="0">
              <DepartureAirport LocationCode="AER"/>
              <ArrivalAirport LocationCode="SVO" TerminalID="B"/>
              <OperatingAirline Code="SU" FlightNumber="1141"/>
              <Equipment AirEquipType="32A"/>
              <MarketingAirline Code="SU"/>
              <MarriageGrp>O</MarriageGrp>
              <DepartureTimeZone GMTOffset="3"/>
              <ArrivalTimeZone GMTOffset="3"/>
              <TPA_Extensions>
                <eTicket Ind="true"/>
                <Mileage Amount="873"/>
              </TPA_Extensions>
            </FlightSegment>
            <FlightSegment ArrivalDateTime="2020-09-08T12:05:00" DepartureDateTime="2020-09-08T10:40:00" ElapsedTime="85" FlightNumber="14" ResBookDesigCode="Y" StopQuantity="0">
              <DepartureAirport LocationCode="SVO" TerminalID="B"/>
              <ArrivalAirport LocationCode="LED" TerminalID="1"/>
              <OperatingAirline Code="SU" FlightNumber="14"/>
              <Equipment AirEquipType="320"/>
              <MarketingAirline Code="SU"/>
              <MarriageGrp>I</MarriageGrp>
              <DepartureTimeZone GMTOffset="3"/>
              <ArrivalTimeZone GMTOffset="3"/>
              <TPA_Extensions>
                <eTicket Ind="true"/>
                <Mileage Amount="372"/>
              </TPA_Extensions>
            </FlightSegment>
          </OriginDestinationOption>
        </OriginDestinationOptions>
      </AirItinerary>
      <AirItineraryPricingInfo BrandsOnAnyMarket="true" FareReturned="true" LastTicketDate="2020-08-27" LastTicketTime="23:59" PricingSource="WPNI1_ITIN" PricingSubSource="MIP" Revalidated="true">
        <ItinTotalFare>
          <BaseFare Amount="176000" CurrencyCode="RUB" DecimalPlaces="0"/>
          <FareConstruction Amount="176000" CurrencyCode="RUB" DecimalPlaces="0"/>
          <EquivFare Amount="176000" CurrencyCode="RUB" DecimalPlaces="0"/>
          <Taxes>
            <Tax Amount="24470" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="TOTALTAX"/>
          </Taxes>
          <TotalFare Amount="200470" CurrencyCode="RUB" DecimalPlaces="0"/>
        </ItinTotalFare>
        <PTC_FareBreakdowns>
          <PTC_FareBreakdown>
            <PassengerTypeQuantity Code="ADT" Quantity="2"/>
            <FareBasisCodes>
              <FareBasisCode ArrivalAirportCode="SVO" BookingCode="Y" DepartureAirportCode="LED" FareComponentBeginAirport="LED" FareComponentDirectionality="FROM" FareComponentEndAirport="AER" FareComponentFareRule="ENR1" FareComponentFareTariff="304" FareComponentFareType="SB" FareComponentFareTypeBitmap="00" FareComponentVendorCode="ATP" GovCarrier="SU">YNBR</FareBasisCode>
              <FareBasisCode ArrivalAirportCode="AER" AvailabilityBreak="true" BookingCode="Y" DepartureAirportCode="SVO" GovCarrier="SU">YNBR</FareBasisCode>
              <FareBasisCode ArrivalAirportCode="SVO" BookingCode="Y" DepartureAirportCode="AER" FareComponentBeginAirport="AER" FareComponentDirectionality="TO" FareComponentEndAirport="LED" FareComponentFareRule="ENR1" FareComponentFareTariff="304" FareComponentFareType="SB" FareComponentFareTypeBitmap="00" FareComponentVendorCode="ATP" GovCarrier="SU">YNBR</FareBasisCode>
              <FareBasisCode ArrivalAirportCode="LED" AvailabilityBreak="true" BookingCode="Y" DepartureAirportCode="SVO" GovCarrier="SU">YNBR</FareBasisCode>
            </FareBasisCodes>
            <PassengerFare>
              <BaseFare Amount="68600" CurrencyCode="RUB"/>
              <FareConstruction Amount="68600" CurrencyCode="RUB" DecimalPlaces="0"/>
              <EquivFare Amount="68600" CurrencyCode="RUB" DecimalPlaces="0"/>
              <Taxes>
                <Tax Amount="1500" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                <Tax Amount="1500" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                <Tax Amount="1500" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                <Tax Amount="1500" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                <Tax Amount="270" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRF"/>
                <Tax Amount="270" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRF"/>
                <Tax Amount="270" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRF"/>
                <Tax Amount="270" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRF"/>
                <Tax Amount="158" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                <Tax Amount="184" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                <Tax Amount="120" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                <Tax Amount="184" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                <Tax Amount="158" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI4"/>
                <Tax Amount="184" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI4"/>
                <Tax Amount="120" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI4"/>
                <Tax Amount="184" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI4"/>
                <TaxSummary Amount="6000" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                <TaxSummary Amount="1080" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRF"/>
                <TaxSummary Amount="1292" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                <TotalTax Amount="8372" CurrencyCode="RUB" DecimalPlaces="0"/>
              </Taxes>
              <TotalFare Amount="76972" CurrencyCode="RUB"/>
              <PenaltiesInfo>
                <Penalty Amount="2600" Applicability="Before" Changeable="true" ConditionsApply="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                <Penalty Amount="2600" Applicability="After" Changeable="true" ConditionsApply="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                <Penalty Applicability="Before" Refundable="false" Type="Refund"/>
                <Penalty Applicability="After" Refundable="false" Type="Refund"/>
              </PenaltiesInfo>
              <TPA_Extensions>
                <FareComponents>
                  <FareComponent BrandID="NB" BrandName="ECONOMY LITE" ProgramCode="CFF1S" ProgramDescription="1S" ProgramID="85965" ProgramSystemCode="X">
                    <Segment FlightIndex="1" LegIndex="1"/>
                    <Segment FlightIndex="2" LegIndex="1"/>
                    <BrandFeatureRef FeatureId="5"/>
                    <BrandFeatureRef FeatureId="11"/>
                    <BrandFeatureRef FeatureId="13"/>
                    <BrandFeatureRef FeatureId="15"/>
                    <BrandFeatureRef FeatureId="8"/>
                    <BrandFeatureRef FeatureId="6"/>
                    <BrandFeatureRef FeatureId="7"/>
                    <BrandFeatureRef FeatureId="16"/>
                    <BrandFeatureRef FeatureId="3"/>
                    <BrandFeatureRef FeatureId="10"/>
                    <BrandFeatureRef FeatureId="22"/>
                    <BrandFeatureRef FeatureId="19"/>
                    <BrandFeatureRef FeatureId="17"/>
                    <BrandFeatureRef FeatureId="25"/>
                    <BrandFeatureRef FeatureId="24"/>
                    <BrandFeatureRef FeatureId="2"/>
                    <BrandFeatureRef FeatureId="31"/>
                    <BrandFeatureRef FeatureId="32"/>
                    <BrandFeatureRef FeatureId="29"/>
                    <BrandFeatureRef FeatureId="28"/>
                    <BrandFeatureRef FeatureId="26"/>
                    <BrandFeatureRef FeatureId="33"/>
                    <BrandFeatureRef FeatureId="34"/>
                    <BrandFeatureRef FeatureId="36"/>
                    <BrandFeatureRef FeatureId="37"/>
                    <BrandFeatureRef FeatureId="35"/>
                    <BrandFeatureRef FeatureId="38"/>
                    <BrandFeatureRef FeatureId="40"/>
                  </FareComponent>
                  <FareComponent BrandID="NB" BrandName="ECONOMY LITE" ProgramCode="CFF1S" ProgramDescription="1S" ProgramID="85965" ProgramSystemCode="X">
                    <Segment FlightIndex="1" LegIndex="2"/>
                    <Segment FlightIndex="2" LegIndex="2"/>
                    <BrandFeatureRef FeatureId="5"/>
                    <BrandFeatureRef FeatureId="11"/>
                    <BrandFeatureRef FeatureId="13"/>
                    <BrandFeatureRef FeatureId="15"/>
                    <BrandFeatureRef FeatureId="8"/>
                    <BrandFeatureRef FeatureId="6"/>
                    <BrandFeatureRef FeatureId="7"/>
                    <BrandFeatureRef FeatureId="16"/>
                    <BrandFeatureRef FeatureId="3"/>
                    <BrandFeatureRef FeatureId="10"/>
                    <BrandFeatureRef FeatureId="22"/>
                    <BrandFeatureRef FeatureId="19"/>
                    <BrandFeatureRef FeatureId="17"/>
                    <BrandFeatureRef FeatureId="25"/>
                    <BrandFeatureRef FeatureId="24"/>
                    <BrandFeatureRef FeatureId="2"/>
                    <BrandFeatureRef FeatureId="31"/>
                    <BrandFeatureRef FeatureId="32"/>
                    <BrandFeatureRef FeatureId="29"/>
                    <BrandFeatureRef FeatureId="28"/>
                    <BrandFeatureRef FeatureId="26"/>
                    <BrandFeatureRef FeatureId="33"/>
                    <BrandFeatureRef FeatureId="34"/>
                    <BrandFeatureRef FeatureId="36"/>
                    <BrandFeatureRef FeatureId="37"/>
                    <BrandFeatureRef FeatureId="35"/>
                    <BrandFeatureRef FeatureId="38"/>
                    <BrandFeatureRef FeatureId="40"/>
                  </FareComponent>
                </FareComponents>
                <Messages>
                  <Message AirlineCode="SU" FailCode="0" Info="NONREF/HEBO3BPATEH" Type="N"/>
                  <Message FailCode="0" Info="VALIDATING CARRIER" Type="W"/>
                  <Message FailCode="0" Info="BSP - SU" Type="W"/>
                  <Message FailCode="0" Info="RUT - SU" Type="W"/>
                </Messages>
                <BaggageInformationList>
                  <BaggageInformation AirlineCode="SU" ProvisionType="A">
                    <Segment Id="0"/>
                    <Segment Id="1"/>
                    <Allowance Pieces="0"/>
                  </BaggageInformation>
                  <BaggageInformation AirlineCode="SU" ProvisionType="A">
                    <Segment Id="2"/>
                    <Segment Id="3"/>
                    <Allowance Pieces="0"/>
                  </BaggageInformation>
                </BaggageInformationList>
              </TPA_Extensions>
            </PassengerFare>
            <Endorsements NonRefundableIndicator="true"/>
            <TPA_Extensions>
              <FareCalcLine Info="LED SU X/MOW SU AER34300SU X/MOW SU LED34300RUB68600END"/>
            </TPA_Extensions>
            <FareInfos>
              <FareInfo>
                <FareReference>Y</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="S"/>
                </TPA_Extensions>
              </FareInfo>
              <FareInfo>
                <FareReference>Y</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="S"/>
                </TPA_Extensions>
              </FareInfo>
              <FareInfo>
                <FareReference>Y</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="S"/>
                </TPA_Extensions>
              </FareInfo>
              <FareInfo>
                <FareReference>Y</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="S"/>
                </TPA_Extensions>
              </FareInfo>
            </FareInfos>
          </PTC_FareBreakdown>
          <PTC_FareBreakdown>
            <PassengerTypeQuantity Code="CNN" Quantity="1"/>
            <FareBasisCodes>
              <FareBasisCode ArrivalAirportCode="SVO" BookingCode="Y" DepartureAirportCode="LED" FareComponentBeginAirport="LED" FareComponentDirectionality="FROM" FareComponentEndAirport="AER" FareComponentFareRule="EFR1" FareComponentFareTariff="304" FareComponentFareType="EU" FareComponentFareTypeBitmap="01" FareComponentVendorCode="ATP" GovCarrier="SU">YFMR/CH50</FareBasisCode>
              <FareBasisCode ArrivalAirportCode="AER" AvailabilityBreak="true" BookingCode="Y" DepartureAirportCode="SVO" GovCarrier="SU">YFMR/CH50</FareBasisCode>
              <FareBasisCode ArrivalAirportCode="SVO" BookingCode="Y" DepartureAirportCode="AER" FareComponentBeginAirport="AER" FareComponentDirectionality="TO" FareComponentEndAirport="LED" FareComponentFareRule="EFR1" FareComponentFareTariff="304" FareComponentFareType="EU" FareComponentFareTypeBitmap="01" FareComponentVendorCode="ATP" GovCarrier="SU">YFMR/CH50</FareBasisCode>
              <FareBasisCode ArrivalAirportCode="LED" AvailabilityBreak="true" BookingCode="Y" DepartureAirportCode="SVO" GovCarrier="SU">YFMR/CH50</FareBasisCode>
            </FareBasisCodes>
            <PassengerFare>
              <BaseFare Amount="38800" CurrencyCode="RUB"/>
              <FareConstruction Amount="38800" CurrencyCode="RUB" DecimalPlaces="0"/>
              <EquivFare Amount="38800" CurrencyCode="RUB" DecimalPlaces="0"/>
              <Taxes>
                <Tax Amount="1500" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                <Tax Amount="1500" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                <Tax Amount="1500" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                <Tax Amount="1500" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                <Tax Amount="270" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRF"/>
                <Tax Amount="270" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRF"/>
                <Tax Amount="270" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRF"/>
                <Tax Amount="270" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRF"/>
                <Tax Amount="79" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                <Tax Amount="92" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                <Tax Amount="60" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                <Tax Amount="92" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                <Tax Amount="79" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI4"/>
                <Tax Amount="92" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI4"/>
                <Tax Amount="60" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI4"/>
                <Tax Amount="92" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI4"/>
                <TaxSummary Amount="6000" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                <TaxSummary Amount="1080" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRF"/>
                <TaxSummary Amount="646" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                <TotalTax Amount="7726" CurrencyCode="RUB" DecimalPlaces="0"/>
              </Taxes>
              <TotalFare Amount="46526" CurrencyCode="RUB"/>
              <PenaltiesInfo>
                <Penalty Amount="0" Applicability="Before" Changeable="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                <Penalty Amount="0" Applicability="After" Changeable="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                <Penalty Amount="0" Applicability="Before" CurrencyCode="RUB" DecimalPlaces="0" Refundable="true" Type="Refund"/>
                <Penalty Amount="0" Applicability="After" CurrencyCode="RUB" DecimalPlaces="0" Refundable="true" Type="Refund"/>
              </PenaltiesInfo>
              <TPA_Extensions>
                <FareComponents>
                  <FareComponent BrandID="EL" BrandName="ECONOMY FLEX" ProgramCode="CFF1S" ProgramDescription="1S" ProgramID="85965" ProgramSystemCode="X">
                    <Segment FlightIndex="1" LegIndex="1"/>
                    <Segment FlightIndex="2" LegIndex="1"/>
                    <BrandFeatureRef FeatureId="5"/>
                    <BrandFeatureRef FeatureId="12"/>
                    <BrandFeatureRef FeatureId="13"/>
                    <BrandFeatureRef FeatureId="14"/>
                    <BrandFeatureRef FeatureId="8"/>
                    <BrandFeatureRef FeatureId="6"/>
                    <BrandFeatureRef FeatureId="7"/>
                    <BrandFeatureRef FeatureId="16"/>
                    <BrandFeatureRef FeatureId="4"/>
                    <BrandFeatureRef FeatureId="9"/>
                    <BrandFeatureRef FeatureId="21"/>
                    <BrandFeatureRef FeatureId="20"/>
                    <BrandFeatureRef FeatureId="18"/>
                    <BrandFeatureRef FeatureId="25"/>
                    <BrandFeatureRef FeatureId="23"/>
                    <BrandFeatureRef FeatureId="1"/>
                    <BrandFeatureRef FeatureId="31"/>
                    <BrandFeatureRef FeatureId="32"/>
                    <BrandFeatureRef FeatureId="30"/>
                    <BrandFeatureRef FeatureId="28"/>
                    <BrandFeatureRef FeatureId="27"/>
                    <BrandFeatureRef FeatureId="33"/>
                    <BrandFeatureRef FeatureId="34"/>
                    <BrandFeatureRef FeatureId="36"/>
                    <BrandFeatureRef FeatureId="37"/>
                    <BrandFeatureRef FeatureId="35"/>
                    <BrandFeatureRef FeatureId="39"/>
                    <BrandFeatureRef FeatureId="40"/>
                  </FareComponent>
                  <FareComponent BrandID="EL" BrandName="ECONOMY FLEX" ProgramCode="CFF1S" ProgramDescription="1S" ProgramID="85965" ProgramSystemCode="X">
                    <Segment FlightIndex="1" LegIndex="2"/>
                    <Segment FlightIndex="2" LegIndex="2"/>
                    <BrandFeatureRef FeatureId="5"/>
                    <BrandFeatureRef FeatureId="12"/>
                    <BrandFeatureRef FeatureId="13"/>
                    <BrandFeatureRef FeatureId="14"/>
                    <BrandFeatureRef FeatureId="8"/>
                    <BrandFeatureRef FeatureId="6"/>
                    <BrandFeatureRef FeatureId="7"/>
                    <BrandFeatureRef FeatureId="16"/>
                    <BrandFeatureRef FeatureId="4"/>
                    <BrandFeatureRef FeatureId="9"/>
                    <BrandFeatureRef FeatureId="21"/>
                    <BrandFeatureRef FeatureId="20"/>
                    <BrandFeatureRef FeatureId="18"/>
                    <BrandFeatureRef FeatureId="25"/>
                    <BrandFeatureRef FeatureId="23"/>
                    <BrandFeatureRef FeatureId="1"/>
                    <BrandFeatureRef FeatureId="31"/>
                    <BrandFeatureRef FeatureId="32"/>
                    <BrandFeatureRef FeatureId="30"/>
                    <BrandFeatureRef FeatureId="28"/>
                    <BrandFeatureRef FeatureId="27"/>
                    <BrandFeatureRef FeatureId="33"/>
                    <BrandFeatureRef FeatureId="34"/>
                    <BrandFeatureRef FeatureId="36"/>
                    <BrandFeatureRef FeatureId="37"/>
                    <BrandFeatureRef FeatureId="35"/>
                    <BrandFeatureRef FeatureId="39"/>
                    <BrandFeatureRef FeatureId="40"/>
                  </FareComponent>
                </FareComponents>
                <Messages>
                  <Message FailCode="0" Info="EACH CNN REQUIRES ACCOMPANYING SAME CABIN ADT" Type="W"/>
                  <Message FailCode="0" Info="VALIDATING CARRIER" Type="W"/>
                  <Message FailCode="0" Info="BSP - SU" Type="W"/>
                  <Message FailCode="0" Info="RUT - SU" Type="W"/>
                </Messages>
                <BaggageInformationList>
                  <BaggageInformation AirlineCode="SU" ProvisionType="A">
                    <Segment Id="0"/>
                    <Segment Id="1"/>
                    <Allowance Description1="UP TO 50 POUNDS/23 KILOGRAMS" Description2="UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS" Pieces="2"/>
                  </BaggageInformation>
                  <BaggageInformation AirlineCode="SU" ProvisionType="A">
                    <Segment Id="2"/>
                    <Segment Id="3"/>
                    <Allowance Description1="UP TO 50 POUNDS/23 KILOGRAMS" Description2="UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS" Pieces="2"/>
                  </BaggageInformation>
                </BaggageInformationList>
              </TPA_Extensions>
            </PassengerFare>
            <Endorsements NonRefundableIndicator="false"/>
            <TPA_Extensions>
              <FareCalcLine Info="LED SU X/MOW SU AER19400SU X/MOW SU LED19400RUB38800END"/>
            </TPA_Extensions>
            <FareInfos>
              <FareInfo>
                <FareReference>Y</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="S"/>
                </TPA_Extensions>
              </FareInfo>
              <FareInfo>
                <FareReference>Y</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="S"/>
                </TPA_Extensions>
              </FareInfo>
              <FareInfo>
                <FareReference>Y</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="S"/>
                </TPA_Extensions>
              </FareInfo>
              <FareInfo>
                <FareReference>Y</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="S"/>
                </TPA_Extensions>
              </FareInfo>
            </FareInfos>
          </PTC_FareBreakdown>
          <PTC_FareBreakdown>
            <PassengerTypeQuantity Code="INF" Quantity="1"/>
            <FareBasisCodes>
              <FareBasisCode ArrivalAirportCode="SVO" BookingCode="Y" DepartureAirportCode="LED" FareComponentBeginAirport="LED" FareComponentDirectionality="FROM" FareComponentEndAirport="AER" FareComponentFareRule="ENR1" FareComponentFareTariff="304" FareComponentFareType="SB" FareComponentFareTypeBitmap="01" FareComponentVendorCode="ATP" GovCarrier="SU">YNBR/IN00</FareBasisCode>
              <FareBasisCode ArrivalAirportCode="AER" AvailabilityBreak="true" BookingCode="Y" DepartureAirportCode="SVO" GovCarrier="SU">YNBR/IN00</FareBasisCode>
              <FareBasisCode ArrivalAirportCode="SVO" BookingCode="Y" DepartureAirportCode="AER" FareComponentBeginAirport="AER" FareComponentDirectionality="TO" FareComponentEndAirport="LED" FareComponentFareRule="ENR1" FareComponentFareTariff="304" FareComponentFareType="SB" FareComponentFareTypeBitmap="01" FareComponentVendorCode="ATP" GovCarrier="SU">YNBR/IN00</FareBasisCode>
              <FareBasisCode ArrivalAirportCode="LED" AvailabilityBreak="true" BookingCode="Y" DepartureAirportCode="SVO" GovCarrier="SU">YNBR/IN00</FareBasisCode>
            </FareBasisCodes>
            <PassengerFare>
              <BaseFare Amount="0" CurrencyCode="RUB"/>
              <FareConstruction Amount="0" CurrencyCode="RUB" DecimalPlaces="0"/>
              <EquivFare Amount="0" CurrencyCode="RUB" DecimalPlaces="0"/>
              <TotalFare Amount="0" CurrencyCode="RUB"/>
              <PenaltiesInfo>
                <Penalty Amount="2600" Applicability="Before" Changeable="true" ConditionsApply="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                <Penalty Amount="2600" Applicability="After" Changeable="true" ConditionsApply="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                <Penalty Applicability="Before" Refundable="false" Type="Refund"/>
                <Penalty Applicability="After" Refundable="false" Type="Refund"/>
              </PenaltiesInfo>
              <TPA_Extensions>
                <FareComponents>
                  <FareComponent BrandID="NB" BrandName="ECONOMY LITE" ProgramCode="CFF1S" ProgramDescription="1S" ProgramID="85965" ProgramSystemCode="X">
                    <Segment FlightIndex="1" LegIndex="1"/>
                    <Segment FlightIndex="2" LegIndex="1"/>
                    <BrandFeatureRef FeatureId="5"/>
                    <BrandFeatureRef FeatureId="11"/>
                    <BrandFeatureRef FeatureId="13"/>
                    <BrandFeatureRef FeatureId="15"/>
                    <BrandFeatureRef FeatureId="8"/>
                    <BrandFeatureRef FeatureId="6"/>
                    <BrandFeatureRef FeatureId="7"/>
                    <BrandFeatureRef FeatureId="16"/>
                    <BrandFeatureRef FeatureId="3"/>
                    <BrandFeatureRef FeatureId="10"/>
                    <BrandFeatureRef FeatureId="22"/>
                    <BrandFeatureRef FeatureId="19"/>
                    <BrandFeatureRef FeatureId="17"/>
                    <BrandFeatureRef FeatureId="25"/>
                    <BrandFeatureRef FeatureId="24"/>
                    <BrandFeatureRef FeatureId="2"/>
                    <BrandFeatureRef FeatureId="31"/>
                    <BrandFeatureRef FeatureId="32"/>
                    <BrandFeatureRef FeatureId="29"/>
                    <BrandFeatureRef FeatureId="28"/>
                    <BrandFeatureRef FeatureId="26"/>
                    <BrandFeatureRef FeatureId="33"/>
                    <BrandFeatureRef FeatureId="34"/>
                    <BrandFeatureRef FeatureId="36"/>
                    <BrandFeatureRef FeatureId="37"/>
                    <BrandFeatureRef FeatureId="35"/>
                    <BrandFeatureRef FeatureId="38"/>
                    <BrandFeatureRef FeatureId="40"/>
                  </FareComponent>
                  <FareComponent BrandID="NB" BrandName="ECONOMY LITE" ProgramCode="CFF1S" ProgramDescription="1S" ProgramID="85965" ProgramSystemCode="X">
                    <Segment FlightIndex="1" LegIndex="2"/>
                    <Segment FlightIndex="2" LegIndex="2"/>
                    <BrandFeatureRef FeatureId="5"/>
                    <BrandFeatureRef FeatureId="11"/>
                    <BrandFeatureRef FeatureId="13"/>
                    <BrandFeatureRef FeatureId="15"/>
                    <BrandFeatureRef FeatureId="8"/>
                    <BrandFeatureRef FeatureId="6"/>
                    <BrandFeatureRef FeatureId="7"/>
                    <BrandFeatureRef FeatureId="16"/>
                    <BrandFeatureRef FeatureId="3"/>
                    <BrandFeatureRef FeatureId="10"/>
                    <BrandFeatureRef FeatureId="22"/>
                    <BrandFeatureRef FeatureId="19"/>
                    <BrandFeatureRef FeatureId="17"/>
                    <BrandFeatureRef FeatureId="25"/>
                    <BrandFeatureRef FeatureId="24"/>
                    <BrandFeatureRef FeatureId="2"/>
                    <BrandFeatureRef FeatureId="31"/>
                    <BrandFeatureRef FeatureId="32"/>
                    <BrandFeatureRef FeatureId="29"/>
                    <BrandFeatureRef FeatureId="28"/>
                    <BrandFeatureRef FeatureId="26"/>
                    <BrandFeatureRef FeatureId="33"/>
                    <BrandFeatureRef FeatureId="34"/>
                    <BrandFeatureRef FeatureId="36"/>
                    <BrandFeatureRef FeatureId="37"/>
                    <BrandFeatureRef FeatureId="35"/>
                    <BrandFeatureRef FeatureId="38"/>
                    <BrandFeatureRef FeatureId="40"/>
                  </FareComponent>
                </FareComponents>
                <Messages>
                  <Message AirlineCode="SU" FailCode="0" Info="NONREF/HEBO3BPATEH" Type="N"/>
                  <Message FailCode="0" Info="EACH INF REQUIRES ACCOMPANYING ADT PASSENGER" Type="W"/>
                  <Message FailCode="0" Info="VALIDATING CARRIER" Type="W"/>
                  <Message FailCode="0" Info="BSP - SU" Type="W"/>
                  <Message FailCode="0" Info="RUT - SU" Type="W"/>
                </Messages>
                <BaggageInformationList>
                  <BaggageInformation AirlineCode="SU" ProvisionType="A">
                    <Segment Id="0"/>
                    <Segment Id="1"/>
                    <Allowance Pieces="0"/>
                  </BaggageInformation>
                  <BaggageInformation AirlineCode="SU" ProvisionType="A">
                    <Segment Id="2"/>
                    <Segment Id="3"/>
                    <Allowance Pieces="0"/>
                  </BaggageInformation>
                </BaggageInformationList>
              </TPA_Extensions>
            </PassengerFare>
            <Endorsements NonRefundableIndicator="true"/>
            <TPA_Extensions>
              <FareCalcLine Info="LED SU X/MOW SU AER0SU X/MOW SU LED0RUB0END"/>
            </TPA_Extensions>
            <FareInfos>
              <FareInfo>
                <FareReference>Y</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="S"/>
                </TPA_Extensions>
              </FareInfo>
              <FareInfo>
                <FareReference>Y</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="S"/>
                </TPA_Extensions>
              </FareInfo>
              <FareInfo>
                <FareReference>Y</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="S"/>
                </TPA_Extensions>
              </FareInfo>
              <FareInfo>
                <FareReference>Y</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="S"/>
                </TPA_Extensions>
              </FareInfo>
            </FareInfos>
          </PTC_FareBreakdown>
        </PTC_FareBreakdowns>
        <FareInfos>
          <FareInfo>
            <FareReference>Y</FareReference>
            <TPA_Extensions>
              <SeatsRemaining BelowMin="false" Number="9"/>
              <Cabin Cabin="Y"/>
              <Meal Code="S"/>
            </TPA_Extensions>
          </FareInfo>
          <FareInfo>
            <FareReference>Y</FareReference>
            <TPA_Extensions>
              <SeatsRemaining BelowMin="false" Number="9"/>
              <Cabin Cabin="Y"/>
              <Meal Code="S"/>
            </TPA_Extensions>
          </FareInfo>
          <FareInfo>
            <FareReference>Y</FareReference>
            <TPA_Extensions>
              <SeatsRemaining BelowMin="false" Number="9"/>
              <Cabin Cabin="Y"/>
              <Meal Code="S"/>
            </TPA_Extensions>
          </FareInfo>
          <FareInfo>
            <FareReference>Y</FareReference>
            <TPA_Extensions>
              <SeatsRemaining BelowMin="false" Number="9"/>
              <Cabin Cabin="Y"/>
              <Meal Code="S"/>
            </TPA_Extensions>
          </FareInfo>
        </FareInfos>
        <TPA_Extensions>
          <DivideInParty Indicator="false"/>
          <ValidatingCarrier NewVcxProcess="true" SettlementMethod="BSP">
            <Default Code="SU"/>
          </ValidatingCarrier>
          <ValidatingCarrier NewVcxProcess="true" SettlementMethod="RUT">
            <Default Code="SU"/>
          </ValidatingCarrier>
        </TPA_Extensions>
      </AirItineraryPricingInfo>
      <TicketingInfo TicketType="eTicket" ValidInterline="Yes"/>
      <TPA_Extensions>
        <ValidatingCarrier Code="SU"/>
      </TPA_Extensions>
    </PricedItinerary>
  </PricedItineraries>
  <TPA_Extensions>
    <AirlineOrderList>
      <AirlineOrder Code="SU" SequenceNumber="1"/>
    </AirlineOrderList>
  </TPA_Extensions>
</OTA_AirLowFareSearchRS>
{% endxmlsec %}

---

{% xmlsec "Пример запроса (B режим)", false %}
<OTA_AirLowFareSearchRQ ResponseType="OTA" Version="6.1.0" xmlns="http://www.opentravel.org/OTA/2003/05">
  <POS>
    <Source PseudoCityCode="9LSC">
      <RequestorID ID="1" Type="1">
        <CompanyName Code="TN"/>
      </RequestorID>
    </Source>
  </POS>
  <OriginDestinationInformation RPH="1">
    <DepartureDateTime>2020-09-01T05:00:00</DepartureDateTime>
    <OriginLocation LocationCode="LED"/>
    <DestinationLocation LocationCode="AER"/>
    <TPA_Extensions>
      <Flight ArrivalDateTime="2020-09-01T06:25:00" ClassOfService="Y" DepartureDateTime="2020-09-01T05:00:00" Number="35" Type="A">
        <OriginLocation LocationCode="LED"/>
        <DestinationLocation LocationCode="SVO"/>
        <Airline Marketing="SU" Operating="SU"/>
      </Flight>
      <Flight ArrivalDateTime="2020-09-01T10:15:00" ClassOfService="Y" DepartureDateTime="2020-09-01T07:45:00" Number="1138" Type="A">
        <OriginLocation LocationCode="SVO"/>
        <DestinationLocation LocationCode="AER"/>
        <Airline Marketing="SU" Operating="SU"/>
      </Flight>
    </TPA_Extensions>
  </OriginDestinationInformation>
  <OriginDestinationInformation RPH="2">
    <DepartureDateTime>2020-09-08T06:50:00</DepartureDateTime>
    <OriginLocation LocationCode="AER"/>
    <DestinationLocation LocationCode="LED"/>
    <TPA_Extensions>
      <Flight ArrivalDateTime="2020-09-08T09:20:00" ClassOfService="Y" DepartureDateTime="2020-09-08T06:50:00" Number="1141" Type="A">
        <OriginLocation LocationCode="AER"/>
        <DestinationLocation LocationCode="SVO"/>
        <Airline Marketing="SU" Operating="SU"/>
      </Flight>
      <Flight ArrivalDateTime="2020-09-08T12:20:00" ClassOfService="Y" DepartureDateTime="2020-09-08T10:55:00" Number="14" Type="A">
        <OriginLocation LocationCode="SVO"/>
        <DestinationLocation LocationCode="LED"/>
        <Airline Marketing="SU" Operating="SU"/>
      </Flight>
    </TPA_Extensions>
  </OriginDestinationInformation>
  <TravelPreferences>
    <TPA_Extensions>
      <VerificationItinCallLogic Value="B"/>
    </TPA_Extensions>
    <Baggage Description="true" RequestType="A"/>
  </TravelPreferences>
  <TravelerInfoSummary>
    <SeatsRequested>3</SeatsRequested>
    <AirTravelerAvail>
      <PassengerTypeQuantity Code="ADT" Quantity="2">
        <TPA_Extensions>
          <VoluntaryChanges Match="Info"/>
        </TPA_Extensions>
      </PassengerTypeQuantity>
      <PassengerTypeQuantity Code="CNN" Quantity="1">
        <TPA_Extensions>
          <VoluntaryChanges Match="Info"/>
        </TPA_Extensions>
      </PassengerTypeQuantity>
      <PassengerTypeQuantity Code="INF" Quantity="1">
        <TPA_Extensions>
          <VoluntaryChanges Match="Info"/>
        </TPA_Extensions>
      </PassengerTypeQuantity>
    </AirTravelerAvail>
    <PriceRequestInformation>
      <TPA_Extensions>
        <BrandedFareIndicators ReturnBrandAncillaries="true" SingleBrandedFare="true"/>
      </TPA_Extensions>
    </PriceRequestInformation>
  </TravelerInfoSummary>
</OTA_AirLowFareSearchRQ>
{% endxmlsec %}

{% xmlsec "Пример ответа", false %}
<OTA_AirLowFareSearchRS AvailableItinCount="0" BrandedOneWayItinCount="0" DepartedItinCount="0" PricedItinCount="1" SimpleOneWayItinCount="0" SoldOutItinCount="0" Version="6.1.0" xmlns="http://www.opentravel.org/OTA/2003/05" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <Success/>
  <Warnings>
    <Warning Code="TRANSACTIONID" MessageClass="I" ShortText="7547568725902446898" Type="WORKERTHREAD"/>
    <Warning Code="ASEPT2LAPP00340.IDM.SGDCPROD.SABRE.COM" MessageClass="I" ShortText="27040" Type="SERVER"/>
    <Warning Code="RULEID" MessageClass="I" ShortText="24113" Type="DRE"/>
    <Warning Code="RULEID" MessageClass="I" ShortText="24111" Type="DEFAULT"/>
  </Warnings>
  <BrandFeatures>
    <BrandFeature Application="F" CommercialName="BASIC SEAT" Id="1" ServiceGroup="BF" ServiceType="Z" SubCode="050" Vendor="ATP"/>
    <BrandFeature Application="C" CommercialName="BASIC SEAT" Id="2" ServiceGroup="BF" ServiceType="Z" SubCode="050" Vendor="ATP"/>
    <BrandFeature Application="C" CommercialName="CHANGEABLE TICKET" Id="3" ServiceGroup="BF" ServiceType="Z" SubCode="059" Vendor="ATP"/>
    <BrandFeature Application="F" CommercialName="CHANGEABLE TICKET" Id="4" ServiceGroup="BF" ServiceType="Z" SubCode="059" Vendor="ATP"/>
    <BrandFeature Application="N" CommercialName="25 PERCENT MILES EARNED" Id="5" ServiceGroup="BF" ServiceType="Z" SubCode="06A" Vendor="ATP"/>
    <BrandFeature Application="N" CommercialName="150 PERCENT MILES EARNED" Id="6" ServiceGroup="BF" ServiceType="Z" SubCode="06M" Vendor="ATP"/>
    <BrandFeature Application="N" CommercialName="200 PERCENT MILES EARNED" Id="7" ServiceGroup="BF" ServiceType="Z" SubCode="06N" Vendor="ATP"/>
    <BrandFeature Application="N" CommercialName="125 MILES EARNED" Id="8" ServiceGroup="BF" ServiceType="Z" SubCode="06Y" Vendor="ATP"/>
    <BrandFeature Application="F" CommercialName="CHANGE IN CASE OF NO SHOW" Id="9" ServiceGroup="BF" ServiceType="Z" SubCode="CNS" Vendor="ATP"/>
    <BrandFeature Application="N" CommercialName="CHANGE IN CASE OF NO SHOW" Id="10" ServiceGroup="BF" ServiceType="Z" SubCode="CNS" Vendor="ATP"/>
    <BrandFeature Application="F" CommercialName="75 TO 125 PCNT MILES EARNED" Id="11" ServiceGroup="BF" ServiceType="Z" SubCode="ME1" Vendor="ATP"/>
    <BrandFeature Application="N" CommercialName="75 TO 125 PCNT MILES EARNED" Id="12" ServiceGroup="BF" ServiceType="Z" SubCode="ME1" Vendor="ATP"/>
    <BrandFeature Application="N" CommercialName="100 TO 150 PCNT MILES EARNED" Id="13" ServiceGroup="BF" ServiceType="Z" SubCode="ME2" Vendor="ATP"/>
    <BrandFeature Application="F" CommercialName="150 TO 200 PCNT MILES EARNED" Id="14" ServiceGroup="BF" ServiceType="Z" SubCode="ME3" Vendor="ATP"/>
    <BrandFeature Application="N" CommercialName="150 TO 200 PCNT MILES EARNED" Id="15" ServiceGroup="BF" ServiceType="Z" SubCode="ME3" Vendor="ATP"/>
    <BrandFeature Application="N" CommercialName="200 TO 250 PCNT MILES EARNED" Id="16" ServiceGroup="BF" ServiceType="Z" SubCode="ME4" Vendor="ATP"/>
    <BrandFeature Application="N" CommercialName="OPEN RETURN DATE" Id="17" ServiceGroup="BF" ServiceType="Z" SubCode="ORD" Vendor="ATP"/>
    <BrandFeature Application="F" CommercialName="OPEN RETURN DATE" Id="18" ServiceGroup="BF" ServiceType="Z" SubCode="ORD" Vendor="ATP"/>
    <BrandFeature Application="N" CommercialName="REFUND AFTER CHECKIN CLOSURE" Id="19" ServiceGroup="BF" ServiceType="Z" SubCode="RBA" Vendor="ATP"/>
    <BrandFeature Application="F" CommercialName="REFUND AFTER CHECKIN CLOSURE" Id="20" ServiceGroup="BF" ServiceType="Z" SubCode="RBA" Vendor="ATP"/>
    <BrandFeature Application="F" CommercialName="REFUND BEFORE CHECKIN CLOSURE" Id="21" ServiceGroup="BF" ServiceType="Z" SubCode="RBC" Vendor="ATP"/>
    <BrandFeature Application="N" CommercialName="REFUND BEFORE CHECKIN CLOSURE" Id="22" ServiceGroup="BF" ServiceType="Z" SubCode="RBC" Vendor="ATP"/>
    <BrandFeature Application="F" CommercialName="STOPOVER" Id="23" ServiceGroup="BF" ServiceType="Z" SubCode="STO" Vendor="ATP"/>
    <BrandFeature Application="N" CommercialName="STOPOVER" Id="24" ServiceGroup="BF" ServiceType="Z" SubCode="STO" Vendor="ATP"/>
    <BrandFeature Application="C" CommercialName="UPGRADE AT CHECKIN TO COMFORT" Id="25" ServiceGroup="BF" ServiceType="Z" SubCode="UT2" Vendor="ATP"/>
    <BrandFeature Application="C" CommercialName="SECOND EXCESS BAG" Id="26" ServiceGroup="BG" ServiceType="C" SubCode="0CD" Vendor="ATP"/>
    <BrandFeature Application="F" CommercialName="SECOND EXCESS BAG" Id="27" ServiceGroup="BG" ServiceType="C" SubCode="0CD" Vendor="ATP"/>
    <BrandFeature Application="N" CommercialName="UPTO70LB 32KG AND62LI 158LCM" Id="28" ServiceGroup="BG" ServiceType="C" SubCode="0FM" Vendor="ATP"/>
    <BrandFeature Application="C" CommercialName="UPTO50LB 23KG AND62LI 158LCM" Id="29" ServiceGroup="BG" ServiceType="C" SubCode="0GO" Vendor="ATP"/>
    <BrandFeature Application="F" CommercialName="UPTO50LB 23KG AND62LI 158LCM" Id="30" ServiceGroup="BG" ServiceType="C" SubCode="0GO" Vendor="ATP"/>
    <BrandFeature Application="F" CommercialName="CARRY10KG 22LBUPTO 55X40X25CM" Id="31" ServiceGroup="BG" ServiceType="C" SubCode="0MJ" Vendor="ATP"/>
    <BrandFeature Application="N" CommercialName="CARRY15KG 33LBUPTO 55X40X25CM" Id="32" ServiceGroup="BG" ServiceType="C" SubCode="0MK" Vendor="ATP"/>
    <BrandFeature Application="C" CommercialName="INTERNET ACCESS" Id="33" ServiceGroup="IE" ServiceType="F" SubCode="0CL" Vendor="ATP"/>
    <BrandFeature Application="N" CommercialName="LOUNGE ACCESS" Id="34" ServiceGroup="LG" ServiceType="F" SubCode="0BX" Vendor="ATP"/>
    <BrandFeature Application="N" CommercialName="PRIORITY CHECK IN" Id="35" ServiceGroup="TS" ServiceType="F" SubCode="03P" Vendor="ATP"/>
    <BrandFeature Application="N" CommercialName="PRIORITY BOARDING" Id="36" ServiceGroup="TS" ServiceType="F" SubCode="0G6" Vendor="ATP"/>
    <BrandFeature Application="N" CommercialName="PRIORITY BAGGAGE" Id="37" ServiceGroup="TS" ServiceType="F" SubCode="0LF" Vendor="ATP"/>
    <BrandFeature Application="N" CommercialName="UPGRADE WITH MILES BONUS" Id="38" ServiceGroup="UP" ServiceType="F" SubCode="0NI" Vendor="ATP"/>
    <BrandFeature Application="F" CommercialName="UPGRADE WITH MILES BONUS" Id="39" ServiceGroup="UP" ServiceType="F" SubCode="0NI" Vendor="ATP"/>
    <BrandFeature Application="C" CommercialName="UPGRADE AT CHECKIN TO BUSINESS" Id="40" ServiceGroup="UP" ServiceType="F" SubCode="UPF" Vendor="ATP"/>
  </BrandFeatures>
  <PricedItineraries>
    <PricedItinerary SequenceNumber="1">
      <AirItinerary DirectionInd="Return">
        <OriginDestinationOptions>
          <OriginDestinationOption ArrivalCountry="RU" DepartureCountry="RU" ElapsedTime="315">
            <FlightSegment ArrivalDateTime="2020-09-01T06:25:00" DepartureDateTime="2020-09-01T05:00:00" ElapsedTime="85" FlightNumber="35" ResBookDesigCode="Y" StopQuantity="0">
              <DepartureAirport LocationCode="LED" TerminalID="1"/>
              <ArrivalAirport LocationCode="SVO" TerminalID="B"/>
              <OperatingAirline Code="SU" FlightNumber="35"/>
              <Equipment AirEquipType="320"/>
              <MarketingAirline Code="SU"/>
              <MarriageGrp>O</MarriageGrp>
              <DepartureTimeZone GMTOffset="3"/>
              <ArrivalTimeZone GMTOffset="3"/>
              <TPA_Extensions>
                <eTicket Ind="true"/>
                <Mileage Amount="372"/>
              </TPA_Extensions>
            </FlightSegment>
            <FlightSegment ArrivalDateTime="2020-09-01T10:15:00" DepartureDateTime="2020-09-01T07:40:00" ElapsedTime="155" FlightNumber="1138" ResBookDesigCode="Y" StopQuantity="0">
              <DepartureAirport LocationCode="SVO" TerminalID="B"/>
              <ArrivalAirport LocationCode="AER"/>
              <OperatingAirline Code="SU" FlightNumber="1138"/>
              <Equipment AirEquipType="73H"/>
              <MarketingAirline Code="SU"/>
              <MarriageGrp>I</MarriageGrp>
              <DepartureTimeZone GMTOffset="3"/>
              <ArrivalTimeZone GMTOffset="3"/>
              <TPA_Extensions>
                <eTicket Ind="true"/>
                <Mileage Amount="873"/>
              </TPA_Extensions>
            </FlightSegment>
          </OriginDestinationOption>
          <OriginDestinationOption ArrivalCountry="RU" DepartureCountry="RU" ElapsedTime="345">
            <FlightSegment ArrivalDateTime="2020-09-08T08:45:00" DepartureDateTime="2020-09-08T06:20:00" ElapsedTime="145" FlightNumber="1141" ResBookDesigCode="Y" StopQuantity="0">
              <DepartureAirport LocationCode="AER"/>
              <ArrivalAirport LocationCode="SVO" TerminalID="B"/>
              <OperatingAirline Code="SU" FlightNumber="1141"/>
              <Equipment AirEquipType="32A"/>
              <MarketingAirline Code="SU"/>
              <MarriageGrp>O</MarriageGrp>
              <DepartureTimeZone GMTOffset="3"/>
              <ArrivalTimeZone GMTOffset="3"/>
              <TPA_Extensions>
                <eTicket Ind="true"/>
                <Mileage Amount="873"/>
              </TPA_Extensions>
            </FlightSegment>
            <FlightSegment ArrivalDateTime="2020-09-08T12:05:00" DepartureDateTime="2020-09-08T10:40:00" ElapsedTime="85" FlightNumber="14" ResBookDesigCode="Y" StopQuantity="0">
              <DepartureAirport LocationCode="SVO" TerminalID="B"/>
              <ArrivalAirport LocationCode="LED" TerminalID="1"/>
              <OperatingAirline Code="SU" FlightNumber="14"/>
              <Equipment AirEquipType="320"/>
              <MarketingAirline Code="SU"/>
              <MarriageGrp>I</MarriageGrp>
              <DepartureTimeZone GMTOffset="3"/>
              <ArrivalTimeZone GMTOffset="3"/>
              <TPA_Extensions>
                <eTicket Ind="true"/>
                <Mileage Amount="372"/>
              </TPA_Extensions>
            </FlightSegment>
          </OriginDestinationOption>
        </OriginDestinationOptions>
      </AirItinerary>
      <AirItineraryPricingInfo BrandsOnAnyMarket="true" FareReturned="true" LastTicketDate="2020-08-27" LastTicketTime="23:59" PricingSource="WPNI1_ITIN" PricingSubSource="MIP" Revalidated="true">
        <ItinTotalFare>
          <BaseFare Amount="176000" CurrencyCode="RUB" DecimalPlaces="0"/>
          <FareConstruction Amount="176000" CurrencyCode="RUB" DecimalPlaces="0"/>
          <EquivFare Amount="176000" CurrencyCode="RUB" DecimalPlaces="0"/>
          <Taxes>
            <Tax Amount="24470" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="TOTALTAX"/>
          </Taxes>
          <TotalFare Amount="200470" CurrencyCode="RUB" DecimalPlaces="0"/>
        </ItinTotalFare>
        <PTC_FareBreakdowns>
          <PTC_FareBreakdown>
            <PassengerTypeQuantity Code="ADT" Quantity="2"/>
            <FareBasisCodes>
              <FareBasisCode ArrivalAirportCode="SVO" BookingCode="Y" DepartureAirportCode="LED" FareComponentBeginAirport="LED" FareComponentDirectionality="FROM" FareComponentEndAirport="AER" FareComponentFareRule="ENR1" FareComponentFareTariff="304" FareComponentFareType="SB" FareComponentFareTypeBitmap="00" FareComponentVendorCode="ATP" GovCarrier="SU">YNBR</FareBasisCode>
              <FareBasisCode ArrivalAirportCode="AER" AvailabilityBreak="true" BookingCode="Y" DepartureAirportCode="SVO" GovCarrier="SU">YNBR</FareBasisCode>
              <FareBasisCode ArrivalAirportCode="SVO" BookingCode="Y" DepartureAirportCode="AER" FareComponentBeginAirport="AER" FareComponentDirectionality="TO" FareComponentEndAirport="LED" FareComponentFareRule="ENR1" FareComponentFareTariff="304" FareComponentFareType="SB" FareComponentFareTypeBitmap="00" FareComponentVendorCode="ATP" GovCarrier="SU">YNBR</FareBasisCode>
              <FareBasisCode ArrivalAirportCode="LED" AvailabilityBreak="true" BookingCode="Y" DepartureAirportCode="SVO" GovCarrier="SU">YNBR</FareBasisCode>
            </FareBasisCodes>
            <PassengerFare>
              <BaseFare Amount="68600" CurrencyCode="RUB"/>
              <FareConstruction Amount="68600" CurrencyCode="RUB" DecimalPlaces="0"/>
              <EquivFare Amount="68600" CurrencyCode="RUB" DecimalPlaces="0"/>
              <Taxes>
                <Tax Amount="1500" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                <Tax Amount="1500" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                <Tax Amount="1500" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                <Tax Amount="1500" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                <Tax Amount="270" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRF"/>
                <Tax Amount="270" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRF"/>
                <Tax Amount="270" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRF"/>
                <Tax Amount="270" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRF"/>
                <Tax Amount="158" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                <Tax Amount="184" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                <Tax Amount="120" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                <Tax Amount="184" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                <Tax Amount="158" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI4"/>
                <Tax Amount="184" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI4"/>
                <Tax Amount="120" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI4"/>
                <Tax Amount="184" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI4"/>
                <TaxSummary Amount="6000" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                <TaxSummary Amount="1080" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRF"/>
                <TaxSummary Amount="1292" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                <TotalTax Amount="8372" CurrencyCode="RUB" DecimalPlaces="0"/>
              </Taxes>
              <TotalFare Amount="76972" CurrencyCode="RUB"/>
              <PenaltiesInfo>
                <Penalty Amount="2600" Applicability="Before" Changeable="true" ConditionsApply="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                <Penalty Amount="2600" Applicability="After" Changeable="true" ConditionsApply="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                <Penalty Applicability="Before" Refundable="false" Type="Refund"/>
                <Penalty Applicability="After" Refundable="false" Type="Refund"/>
              </PenaltiesInfo>
              <TPA_Extensions>
                <FareComponents>
                  <FareComponent BrandID="NB" BrandName="ECONOMY LITE" ProgramCode="CFF1S" ProgramDescription="1S" ProgramID="85965" ProgramSystemCode="X">
                    <Segment FlightIndex="1" LegIndex="1"/>
                    <Segment FlightIndex="2" LegIndex="1"/>
                    <BrandFeatureRef FeatureId="5"/>
                    <BrandFeatureRef FeatureId="11"/>
                    <BrandFeatureRef FeatureId="13"/>
                    <BrandFeatureRef FeatureId="15"/>
                    <BrandFeatureRef FeatureId="8"/>
                    <BrandFeatureRef FeatureId="6"/>
                    <BrandFeatureRef FeatureId="7"/>
                    <BrandFeatureRef FeatureId="16"/>
                    <BrandFeatureRef FeatureId="3"/>
                    <BrandFeatureRef FeatureId="10"/>
                    <BrandFeatureRef FeatureId="22"/>
                    <BrandFeatureRef FeatureId="19"/>
                    <BrandFeatureRef FeatureId="17"/>
                    <BrandFeatureRef FeatureId="25"/>
                    <BrandFeatureRef FeatureId="24"/>
                    <BrandFeatureRef FeatureId="2"/>
                    <BrandFeatureRef FeatureId="31"/>
                    <BrandFeatureRef FeatureId="32"/>
                    <BrandFeatureRef FeatureId="29"/>
                    <BrandFeatureRef FeatureId="28"/>
                    <BrandFeatureRef FeatureId="26"/>
                    <BrandFeatureRef FeatureId="33"/>
                    <BrandFeatureRef FeatureId="34"/>
                    <BrandFeatureRef FeatureId="36"/>
                    <BrandFeatureRef FeatureId="37"/>
                    <BrandFeatureRef FeatureId="35"/>
                    <BrandFeatureRef FeatureId="38"/>
                    <BrandFeatureRef FeatureId="40"/>
                  </FareComponent>
                  <FareComponent BrandID="NB" BrandName="ECONOMY LITE" ProgramCode="CFF1S" ProgramDescription="1S" ProgramID="85965" ProgramSystemCode="X">
                    <Segment FlightIndex="1" LegIndex="2"/>
                    <Segment FlightIndex="2" LegIndex="2"/>
                    <BrandFeatureRef FeatureId="5"/>
                    <BrandFeatureRef FeatureId="11"/>
                    <BrandFeatureRef FeatureId="13"/>
                    <BrandFeatureRef FeatureId="15"/>
                    <BrandFeatureRef FeatureId="8"/>
                    <BrandFeatureRef FeatureId="6"/>
                    <BrandFeatureRef FeatureId="7"/>
                    <BrandFeatureRef FeatureId="16"/>
                    <BrandFeatureRef FeatureId="3"/>
                    <BrandFeatureRef FeatureId="10"/>
                    <BrandFeatureRef FeatureId="22"/>
                    <BrandFeatureRef FeatureId="19"/>
                    <BrandFeatureRef FeatureId="17"/>
                    <BrandFeatureRef FeatureId="25"/>
                    <BrandFeatureRef FeatureId="24"/>
                    <BrandFeatureRef FeatureId="2"/>
                    <BrandFeatureRef FeatureId="31"/>
                    <BrandFeatureRef FeatureId="32"/>
                    <BrandFeatureRef FeatureId="29"/>
                    <BrandFeatureRef FeatureId="28"/>
                    <BrandFeatureRef FeatureId="26"/>
                    <BrandFeatureRef FeatureId="33"/>
                    <BrandFeatureRef FeatureId="34"/>
                    <BrandFeatureRef FeatureId="36"/>
                    <BrandFeatureRef FeatureId="37"/>
                    <BrandFeatureRef FeatureId="35"/>
                    <BrandFeatureRef FeatureId="38"/>
                    <BrandFeatureRef FeatureId="40"/>
                  </FareComponent>
                </FareComponents>
                <Messages>
                  <Message AirlineCode="SU" FailCode="0" Info="NONREF/HEBO3BPATEH" Type="N"/>
                  <Message FailCode="0" Info="VALIDATING CARRIER" Type="W"/>
                  <Message FailCode="0" Info="BSP - SU" Type="W"/>
                  <Message FailCode="0" Info="RUT - SU" Type="W"/>
                </Messages>
                <BaggageInformationList>
                  <BaggageInformation AirlineCode="SU" ProvisionType="A">
                    <Segment Id="0"/>
                    <Segment Id="1"/>
                    <Allowance Pieces="0"/>
                  </BaggageInformation>
                  <BaggageInformation AirlineCode="SU" ProvisionType="A">
                    <Segment Id="2"/>
                    <Segment Id="3"/>
                    <Allowance Pieces="0"/>
                  </BaggageInformation>
                </BaggageInformationList>
              </TPA_Extensions>
            </PassengerFare>
            <Endorsements NonRefundableIndicator="true"/>
            <TPA_Extensions>
              <FareCalcLine Info="LED SU X/MOW SU AER34300SU X/MOW SU LED34300RUB68600END"/>
            </TPA_Extensions>
            <FareInfos>
              <FareInfo>
                <FareReference>Y</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="S"/>
                </TPA_Extensions>
              </FareInfo>
              <FareInfo>
                <FareReference>Y</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="S"/>
                </TPA_Extensions>
              </FareInfo>
              <FareInfo>
                <FareReference>Y</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="S"/>
                </TPA_Extensions>
              </FareInfo>
              <FareInfo>
                <FareReference>Y</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="S"/>
                </TPA_Extensions>
              </FareInfo>
            </FareInfos>
          </PTC_FareBreakdown>
          <PTC_FareBreakdown>
            <PassengerTypeQuantity Code="CNN" Quantity="1"/>
            <FareBasisCodes>
              <FareBasisCode ArrivalAirportCode="SVO" BookingCode="Y" DepartureAirportCode="LED" FareComponentBeginAirport="LED" FareComponentDirectionality="FROM" FareComponentEndAirport="AER" FareComponentFareRule="EFR1" FareComponentFareTariff="304" FareComponentFareType="EU" FareComponentFareTypeBitmap="01" FareComponentVendorCode="ATP" GovCarrier="SU">YFMR/CH50</FareBasisCode>
              <FareBasisCode ArrivalAirportCode="AER" AvailabilityBreak="true" BookingCode="Y" DepartureAirportCode="SVO" GovCarrier="SU">YFMR/CH50</FareBasisCode>
              <FareBasisCode ArrivalAirportCode="SVO" BookingCode="Y" DepartureAirportCode="AER" FareComponentBeginAirport="AER" FareComponentDirectionality="TO" FareComponentEndAirport="LED" FareComponentFareRule="EFR1" FareComponentFareTariff="304" FareComponentFareType="EU" FareComponentFareTypeBitmap="01" FareComponentVendorCode="ATP" GovCarrier="SU">YFMR/CH50</FareBasisCode>
              <FareBasisCode ArrivalAirportCode="LED" AvailabilityBreak="true" BookingCode="Y" DepartureAirportCode="SVO" GovCarrier="SU">YFMR/CH50</FareBasisCode>
            </FareBasisCodes>
            <PassengerFare>
              <BaseFare Amount="38800" CurrencyCode="RUB"/>
              <FareConstruction Amount="38800" CurrencyCode="RUB" DecimalPlaces="0"/>
              <EquivFare Amount="38800" CurrencyCode="RUB" DecimalPlaces="0"/>
              <Taxes>
                <Tax Amount="1500" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                <Tax Amount="1500" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                <Tax Amount="1500" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                <Tax Amount="1500" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                <Tax Amount="270" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRF"/>
                <Tax Amount="270" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRF"/>
                <Tax Amount="270" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRF"/>
                <Tax Amount="270" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRF"/>
                <Tax Amount="79" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                <Tax Amount="92" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                <Tax Amount="60" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                <Tax Amount="92" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                <Tax Amount="79" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI4"/>
                <Tax Amount="92" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI4"/>
                <Tax Amount="60" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI4"/>
                <Tax Amount="92" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI4"/>
                <TaxSummary Amount="6000" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                <TaxSummary Amount="1080" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRF"/>
                <TaxSummary Amount="646" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                <TotalTax Amount="7726" CurrencyCode="RUB" DecimalPlaces="0"/>
              </Taxes>
              <TotalFare Amount="46526" CurrencyCode="RUB"/>
              <PenaltiesInfo>
                <Penalty Amount="0" Applicability="Before" Changeable="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                <Penalty Amount="0" Applicability="After" Changeable="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                <Penalty Amount="0" Applicability="Before" CurrencyCode="RUB" DecimalPlaces="0" Refundable="true" Type="Refund"/>
                <Penalty Amount="0" Applicability="After" CurrencyCode="RUB" DecimalPlaces="0" Refundable="true" Type="Refund"/>
              </PenaltiesInfo>
              <TPA_Extensions>
                <FareComponents>
                  <FareComponent BrandID="EL" BrandName="ECONOMY FLEX" ProgramCode="CFF1S" ProgramDescription="1S" ProgramID="85965" ProgramSystemCode="X">
                    <Segment FlightIndex="1" LegIndex="1"/>
                    <Segment FlightIndex="2" LegIndex="1"/>
                    <BrandFeatureRef FeatureId="5"/>
                    <BrandFeatureRef FeatureId="12"/>
                    <BrandFeatureRef FeatureId="13"/>
                    <BrandFeatureRef FeatureId="14"/>
                    <BrandFeatureRef FeatureId="8"/>
                    <BrandFeatureRef FeatureId="6"/>
                    <BrandFeatureRef FeatureId="7"/>
                    <BrandFeatureRef FeatureId="16"/>
                    <BrandFeatureRef FeatureId="4"/>
                    <BrandFeatureRef FeatureId="9"/>
                    <BrandFeatureRef FeatureId="21"/>
                    <BrandFeatureRef FeatureId="20"/>
                    <BrandFeatureRef FeatureId="18"/>
                    <BrandFeatureRef FeatureId="25"/>
                    <BrandFeatureRef FeatureId="23"/>
                    <BrandFeatureRef FeatureId="1"/>
                    <BrandFeatureRef FeatureId="31"/>
                    <BrandFeatureRef FeatureId="32"/>
                    <BrandFeatureRef FeatureId="30"/>
                    <BrandFeatureRef FeatureId="28"/>
                    <BrandFeatureRef FeatureId="27"/>
                    <BrandFeatureRef FeatureId="33"/>
                    <BrandFeatureRef FeatureId="34"/>
                    <BrandFeatureRef FeatureId="36"/>
                    <BrandFeatureRef FeatureId="37"/>
                    <BrandFeatureRef FeatureId="35"/>
                    <BrandFeatureRef FeatureId="39"/>
                    <BrandFeatureRef FeatureId="40"/>
                  </FareComponent>
                  <FareComponent BrandID="EL" BrandName="ECONOMY FLEX" ProgramCode="CFF1S" ProgramDescription="1S" ProgramID="85965" ProgramSystemCode="X">
                    <Segment FlightIndex="1" LegIndex="2"/>
                    <Segment FlightIndex="2" LegIndex="2"/>
                    <BrandFeatureRef FeatureId="5"/>
                    <BrandFeatureRef FeatureId="12"/>
                    <BrandFeatureRef FeatureId="13"/>
                    <BrandFeatureRef FeatureId="14"/>
                    <BrandFeatureRef FeatureId="8"/>
                    <BrandFeatureRef FeatureId="6"/>
                    <BrandFeatureRef FeatureId="7"/>
                    <BrandFeatureRef FeatureId="16"/>
                    <BrandFeatureRef FeatureId="4"/>
                    <BrandFeatureRef FeatureId="9"/>
                    <BrandFeatureRef FeatureId="21"/>
                    <BrandFeatureRef FeatureId="20"/>
                    <BrandFeatureRef FeatureId="18"/>
                    <BrandFeatureRef FeatureId="25"/>
                    <BrandFeatureRef FeatureId="23"/>
                    <BrandFeatureRef FeatureId="1"/>
                    <BrandFeatureRef FeatureId="31"/>
                    <BrandFeatureRef FeatureId="32"/>
                    <BrandFeatureRef FeatureId="30"/>
                    <BrandFeatureRef FeatureId="28"/>
                    <BrandFeatureRef FeatureId="27"/>
                    <BrandFeatureRef FeatureId="33"/>
                    <BrandFeatureRef FeatureId="34"/>
                    <BrandFeatureRef FeatureId="36"/>
                    <BrandFeatureRef FeatureId="37"/>
                    <BrandFeatureRef FeatureId="35"/>
                    <BrandFeatureRef FeatureId="39"/>
                    <BrandFeatureRef FeatureId="40"/>
                  </FareComponent>
                </FareComponents>
                <Messages>
                  <Message FailCode="0" Info="EACH CNN REQUIRES ACCOMPANYING SAME CABIN ADT" Type="W"/>
                  <Message FailCode="0" Info="VALIDATING CARRIER" Type="W"/>
                  <Message FailCode="0" Info="BSP - SU" Type="W"/>
                  <Message FailCode="0" Info="RUT - SU" Type="W"/>
                </Messages>
                <BaggageInformationList>
                  <BaggageInformation AirlineCode="SU" ProvisionType="A">
                    <Segment Id="0"/>
                    <Segment Id="1"/>
                    <Allowance Description1="UP TO 50 POUNDS/23 KILOGRAMS" Description2="UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS" Pieces="2"/>
                  </BaggageInformation>
                  <BaggageInformation AirlineCode="SU" ProvisionType="A">
                    <Segment Id="2"/>
                    <Segment Id="3"/>
                    <Allowance Description1="UP TO 50 POUNDS/23 KILOGRAMS" Description2="UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS" Pieces="2"/>
                  </BaggageInformation>
                </BaggageInformationList>
              </TPA_Extensions>
            </PassengerFare>
            <Endorsements NonRefundableIndicator="false"/>
            <TPA_Extensions>
              <FareCalcLine Info="LED SU X/MOW SU AER19400SU X/MOW SU LED19400RUB38800END"/>
            </TPA_Extensions>
            <FareInfos>
              <FareInfo>
                <FareReference>Y</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="S"/>
                </TPA_Extensions>
              </FareInfo>
              <FareInfo>
                <FareReference>Y</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="S"/>
                </TPA_Extensions>
              </FareInfo>
              <FareInfo>
                <FareReference>Y</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="S"/>
                </TPA_Extensions>
              </FareInfo>
              <FareInfo>
                <FareReference>Y</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="S"/>
                </TPA_Extensions>
              </FareInfo>
            </FareInfos>
          </PTC_FareBreakdown>
          <PTC_FareBreakdown>
            <PassengerTypeQuantity Code="INF" Quantity="1"/>
            <FareBasisCodes>
              <FareBasisCode ArrivalAirportCode="SVO" BookingCode="Y" DepartureAirportCode="LED" FareComponentBeginAirport="LED" FareComponentDirectionality="FROM" FareComponentEndAirport="AER" FareComponentFareRule="ENR1" FareComponentFareTariff="304" FareComponentFareType="SB" FareComponentFareTypeBitmap="01" FareComponentVendorCode="ATP" GovCarrier="SU">YNBR/IN00</FareBasisCode>
              <FareBasisCode ArrivalAirportCode="AER" AvailabilityBreak="true" BookingCode="Y" DepartureAirportCode="SVO" GovCarrier="SU">YNBR/IN00</FareBasisCode>
              <FareBasisCode ArrivalAirportCode="SVO" BookingCode="Y" DepartureAirportCode="AER" FareComponentBeginAirport="AER" FareComponentDirectionality="TO" FareComponentEndAirport="LED" FareComponentFareRule="ENR1" FareComponentFareTariff="304" FareComponentFareType="SB" FareComponentFareTypeBitmap="01" FareComponentVendorCode="ATP" GovCarrier="SU">YNBR/IN00</FareBasisCode>
              <FareBasisCode ArrivalAirportCode="LED" AvailabilityBreak="true" BookingCode="Y" DepartureAirportCode="SVO" GovCarrier="SU">YNBR/IN00</FareBasisCode>
            </FareBasisCodes>
            <PassengerFare>
              <BaseFare Amount="0" CurrencyCode="RUB"/>
              <FareConstruction Amount="0" CurrencyCode="RUB" DecimalPlaces="0"/>
              <EquivFare Amount="0" CurrencyCode="RUB" DecimalPlaces="0"/>
              <TotalFare Amount="0" CurrencyCode="RUB"/>
              <PenaltiesInfo>
                <Penalty Amount="2600" Applicability="Before" Changeable="true" ConditionsApply="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                <Penalty Amount="2600" Applicability="After" Changeable="true" ConditionsApply="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                <Penalty Applicability="Before" Refundable="false" Type="Refund"/>
                <Penalty Applicability="After" Refundable="false" Type="Refund"/>
              </PenaltiesInfo>
              <TPA_Extensions>
                <FareComponents>
                  <FareComponent BrandID="NB" BrandName="ECONOMY LITE" ProgramCode="CFF1S" ProgramDescription="1S" ProgramID="85965" ProgramSystemCode="X">
                    <Segment FlightIndex="1" LegIndex="1"/>
                    <Segment FlightIndex="2" LegIndex="1"/>
                    <BrandFeatureRef FeatureId="5"/>
                    <BrandFeatureRef FeatureId="11"/>
                    <BrandFeatureRef FeatureId="13"/>
                    <BrandFeatureRef FeatureId="15"/>
                    <BrandFeatureRef FeatureId="8"/>
                    <BrandFeatureRef FeatureId="6"/>
                    <BrandFeatureRef FeatureId="7"/>
                    <BrandFeatureRef FeatureId="16"/>
                    <BrandFeatureRef FeatureId="3"/>
                    <BrandFeatureRef FeatureId="10"/>
                    <BrandFeatureRef FeatureId="22"/>
                    <BrandFeatureRef FeatureId="19"/>
                    <BrandFeatureRef FeatureId="17"/>
                    <BrandFeatureRef FeatureId="25"/>
                    <BrandFeatureRef FeatureId="24"/>
                    <BrandFeatureRef FeatureId="2"/>
                    <BrandFeatureRef FeatureId="31"/>
                    <BrandFeatureRef FeatureId="32"/>
                    <BrandFeatureRef FeatureId="29"/>
                    <BrandFeatureRef FeatureId="28"/>
                    <BrandFeatureRef FeatureId="26"/>
                    <BrandFeatureRef FeatureId="33"/>
                    <BrandFeatureRef FeatureId="34"/>
                    <BrandFeatureRef FeatureId="36"/>
                    <BrandFeatureRef FeatureId="37"/>
                    <BrandFeatureRef FeatureId="35"/>
                    <BrandFeatureRef FeatureId="38"/>
                    <BrandFeatureRef FeatureId="40"/>
                  </FareComponent>
                  <FareComponent BrandID="NB" BrandName="ECONOMY LITE" ProgramCode="CFF1S" ProgramDescription="1S" ProgramID="85965" ProgramSystemCode="X">
                    <Segment FlightIndex="1" LegIndex="2"/>
                    <Segment FlightIndex="2" LegIndex="2"/>
                    <BrandFeatureRef FeatureId="5"/>
                    <BrandFeatureRef FeatureId="11"/>
                    <BrandFeatureRef FeatureId="13"/>
                    <BrandFeatureRef FeatureId="15"/>
                    <BrandFeatureRef FeatureId="8"/>
                    <BrandFeatureRef FeatureId="6"/>
                    <BrandFeatureRef FeatureId="7"/>
                    <BrandFeatureRef FeatureId="16"/>
                    <BrandFeatureRef FeatureId="3"/>
                    <BrandFeatureRef FeatureId="10"/>
                    <BrandFeatureRef FeatureId="22"/>
                    <BrandFeatureRef FeatureId="19"/>
                    <BrandFeatureRef FeatureId="17"/>
                    <BrandFeatureRef FeatureId="25"/>
                    <BrandFeatureRef FeatureId="24"/>
                    <BrandFeatureRef FeatureId="2"/>
                    <BrandFeatureRef FeatureId="31"/>
                    <BrandFeatureRef FeatureId="32"/>
                    <BrandFeatureRef FeatureId="29"/>
                    <BrandFeatureRef FeatureId="28"/>
                    <BrandFeatureRef FeatureId="26"/>
                    <BrandFeatureRef FeatureId="33"/>
                    <BrandFeatureRef FeatureId="34"/>
                    <BrandFeatureRef FeatureId="36"/>
                    <BrandFeatureRef FeatureId="37"/>
                    <BrandFeatureRef FeatureId="35"/>
                    <BrandFeatureRef FeatureId="38"/>
                    <BrandFeatureRef FeatureId="40"/>
                  </FareComponent>
                </FareComponents>
                <Messages>
                  <Message AirlineCode="SU" FailCode="0" Info="NONREF/HEBO3BPATEH" Type="N"/>
                  <Message FailCode="0" Info="EACH INF REQUIRES ACCOMPANYING ADT PASSENGER" Type="W"/>
                  <Message FailCode="0" Info="VALIDATING CARRIER" Type="W"/>
                  <Message FailCode="0" Info="BSP - SU" Type="W"/>
                  <Message FailCode="0" Info="RUT - SU" Type="W"/>
                </Messages>
                <BaggageInformationList>
                  <BaggageInformation AirlineCode="SU" ProvisionType="A">
                    <Segment Id="0"/>
                    <Segment Id="1"/>
                    <Allowance Pieces="0"/>
                  </BaggageInformation>
                  <BaggageInformation AirlineCode="SU" ProvisionType="A">
                    <Segment Id="2"/>
                    <Segment Id="3"/>
                    <Allowance Pieces="0"/>
                  </BaggageInformation>
                </BaggageInformationList>
              </TPA_Extensions>
            </PassengerFare>
            <Endorsements NonRefundableIndicator="true"/>
            <TPA_Extensions>
              <FareCalcLine Info="LED SU X/MOW SU AER0SU X/MOW SU LED0RUB0END"/>
            </TPA_Extensions>
            <FareInfos>
              <FareInfo>
                <FareReference>Y</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="S"/>
                </TPA_Extensions>
              </FareInfo>
              <FareInfo>
                <FareReference>Y</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="S"/>
                </TPA_Extensions>
              </FareInfo>
              <FareInfo>
                <FareReference>Y</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="S"/>
                </TPA_Extensions>
              </FareInfo>
              <FareInfo>
                <FareReference>Y</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="S"/>
                </TPA_Extensions>
              </FareInfo>
            </FareInfos>
          </PTC_FareBreakdown>
        </PTC_FareBreakdowns>
        <FareInfos>
          <FareInfo>
            <FareReference>Y</FareReference>
            <TPA_Extensions>
              <SeatsRemaining BelowMin="false" Number="9"/>
              <Cabin Cabin="Y"/>
              <Meal Code="S"/>
            </TPA_Extensions>
          </FareInfo>
          <FareInfo>
            <FareReference>Y</FareReference>
            <TPA_Extensions>
              <SeatsRemaining BelowMin="false" Number="9"/>
              <Cabin Cabin="Y"/>
              <Meal Code="S"/>
            </TPA_Extensions>
          </FareInfo>
          <FareInfo>
            <FareReference>Y</FareReference>
            <TPA_Extensions>
              <SeatsRemaining BelowMin="false" Number="9"/>
              <Cabin Cabin="Y"/>
              <Meal Code="S"/>
            </TPA_Extensions>
          </FareInfo>
          <FareInfo>
            <FareReference>Y</FareReference>
            <TPA_Extensions>
              <SeatsRemaining BelowMin="false" Number="9"/>
              <Cabin Cabin="Y"/>
              <Meal Code="S"/>
            </TPA_Extensions>
          </FareInfo>
        </FareInfos>
        <TPA_Extensions>
          <DivideInParty Indicator="false"/>
          <ValidatingCarrier NewVcxProcess="true" SettlementMethod="BSP">
            <Default Code="SU"/>
          </ValidatingCarrier>
          <ValidatingCarrier NewVcxProcess="true" SettlementMethod="RUT">
            <Default Code="SU"/>
          </ValidatingCarrier>
        </TPA_Extensions>
      </AirItineraryPricingInfo>
      <TicketingInfo TicketType="eTicket" ValidInterline="Yes"/>
      <TPA_Extensions>
        <AdditionalFares>
          <AirItineraryPricingInfo BrandsOnAnyMarket="true" FareReturned="true" LastTicketDate="2020-05-31" LastTicketTime="23:59" PricingSource="WPNI1_ITIN" PricingSubSource="MIP">
            <ItinTotalFare>
              <BaseFare Amount="31215" CurrencyCode="RUB" DecimalPlaces="0"/>
              <FareConstruction Amount="31213" CurrencyCode="RUB" DecimalPlaces="0"/>
              <EquivFare Amount="31215" CurrencyCode="RUB" DecimalPlaces="0"/>
              <Taxes>
                <Tax Amount="24470" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="TOTALTAX"/>
              </Taxes>
              <TotalFare Amount="55685" CurrencyCode="RUB" DecimalPlaces="0"/>
            </ItinTotalFare>
            <PTC_FareBreakdowns>
              <PTC_FareBreakdown>
                <PassengerTypeQuantity Code="ADT" Quantity="2"/>
                <FareBasisCodes>
                  <FareBasisCode ArrivalAirportCode="SVO" BookingCode="N" DepartureAirportCode="LED" FareComponentBeginAirport="LED" FareComponentDirectionality="FROM" FareComponentEndAirport="AER" FareComponentFareRule="ENR1" FareComponentFareTariff="304" FareComponentFareType="SB" FareComponentFareTypeBitmap="00" FareComponentVendorCode="ATP" GovCarrier="SU">NNBR</FareBasisCode>
                  <FareBasisCode ArrivalAirportCode="AER" AvailabilityBreak="true" BookingCode="N" DepartureAirportCode="SVO" GovCarrier="SU">NNBR</FareBasisCode>
                  <FareBasisCode ArrivalAirportCode="SVO" BookingCode="T" DepartureAirportCode="AER" FareComponentBeginAirport="AER" FareComponentDirectionality="TO" FareComponentEndAirport="LED" FareComponentFareRule="ENR1" FareComponentFareTariff="304" FareComponentFareType="SB" FareComponentFareTypeBitmap="00" FareComponentVendorCode="ATP" GovCarrier="SU">TNBR</FareBasisCode>
                  <FareBasisCode ArrivalAirportCode="LED" AvailabilityBreak="true" BookingCode="T" DepartureAirportCode="SVO" GovCarrier="SU">TNBR</FareBasisCode>
                </FareBasisCodes>
                <PassengerFare>
                  <BaseFare Amount="11350" CurrencyCode="RUB"/>
                  <FareConstruction Amount="11350" CurrencyCode="RUB" DecimalPlaces="0"/>
                  <EquivFare Amount="11350" CurrencyCode="RUB" DecimalPlaces="0"/>
                  <Taxes>
                    <Tax Amount="1500" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                    <Tax Amount="1500" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                    <Tax Amount="1500" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                    <Tax Amount="1500" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                    <Tax Amount="270" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRF"/>
                    <Tax Amount="270" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRF"/>
                    <Tax Amount="270" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRF"/>
                    <Tax Amount="270" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRF"/>
                    <Tax Amount="158" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                    <Tax Amount="184" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                    <Tax Amount="120" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                    <Tax Amount="184" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                    <Tax Amount="158" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI4"/>
                    <Tax Amount="184" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI4"/>
                    <Tax Amount="120" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI4"/>
                    <Tax Amount="184" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI4"/>
                    <TaxSummary Amount="6000" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                    <TaxSummary Amount="1080" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRF"/>
                    <TaxSummary Amount="1292" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                    <TotalTax Amount="8372" CurrencyCode="RUB" DecimalPlaces="0"/>
                  </Taxes>
                  <TotalFare Amount="19722" CurrencyCode="RUB"/>
                  <PenaltiesInfo>
                    <Penalty Amount="2600" Applicability="Before" Changeable="true" ConditionsApply="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                    <Penalty Amount="2600" Applicability="After" Changeable="true" ConditionsApply="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                    <Penalty Applicability="Before" Refundable="false" Type="Refund"/>
                    <Penalty Applicability="After" Refundable="false" Type="Refund"/>
                  </PenaltiesInfo>
                  <TPA_Extensions>
                    <FareComponents>
                      <FareComponent BrandID="NB" BrandName="ECONOMY LITE" ProgramCode="CFF1S" ProgramDescription="1S" ProgramID="85965" ProgramSystemCode="X">
                        <Segment FlightIndex="1" LegIndex="1"/>
                        <Segment FlightIndex="2" LegIndex="1"/>
                        <BrandFeatureRef FeatureId="5"/>
                        <BrandFeatureRef FeatureId="11"/>
                        <BrandFeatureRef FeatureId="13"/>
                        <BrandFeatureRef FeatureId="15"/>
                        <BrandFeatureRef FeatureId="8"/>
                        <BrandFeatureRef FeatureId="6"/>
                        <BrandFeatureRef FeatureId="7"/>
                        <BrandFeatureRef FeatureId="16"/>
                        <BrandFeatureRef FeatureId="3"/>
                        <BrandFeatureRef FeatureId="10"/>
                        <BrandFeatureRef FeatureId="22"/>
                        <BrandFeatureRef FeatureId="19"/>
                        <BrandFeatureRef FeatureId="17"/>
                        <BrandFeatureRef FeatureId="25"/>
                        <BrandFeatureRef FeatureId="24"/>
                        <BrandFeatureRef FeatureId="2"/>
                        <BrandFeatureRef FeatureId="31"/>
                        <BrandFeatureRef FeatureId="32"/>
                        <BrandFeatureRef FeatureId="29"/>
                        <BrandFeatureRef FeatureId="28"/>
                        <BrandFeatureRef FeatureId="26"/>
                        <BrandFeatureRef FeatureId="33"/>
                        <BrandFeatureRef FeatureId="34"/>
                        <BrandFeatureRef FeatureId="36"/>
                        <BrandFeatureRef FeatureId="37"/>
                        <BrandFeatureRef FeatureId="35"/>
                        <BrandFeatureRef FeatureId="38"/>
                        <BrandFeatureRef FeatureId="40"/>
                      </FareComponent>
                      <FareComponent BrandID="NB" BrandName="ECONOMY LITE" ProgramCode="CFF1S" ProgramDescription="1S" ProgramID="85965" ProgramSystemCode="X">
                        <Segment FlightIndex="1" LegIndex="2"/>
                        <Segment FlightIndex="2" LegIndex="2"/>
                        <BrandFeatureRef FeatureId="5"/>
                        <BrandFeatureRef FeatureId="11"/>
                        <BrandFeatureRef FeatureId="13"/>
                        <BrandFeatureRef FeatureId="15"/>
                        <BrandFeatureRef FeatureId="8"/>
                        <BrandFeatureRef FeatureId="6"/>
                        <BrandFeatureRef FeatureId="7"/>
                        <BrandFeatureRef FeatureId="16"/>
                        <BrandFeatureRef FeatureId="3"/>
                        <BrandFeatureRef FeatureId="10"/>
                        <BrandFeatureRef FeatureId="22"/>
                        <BrandFeatureRef FeatureId="19"/>
                        <BrandFeatureRef FeatureId="17"/>
                        <BrandFeatureRef FeatureId="25"/>
                        <BrandFeatureRef FeatureId="24"/>
                        <BrandFeatureRef FeatureId="2"/>
                        <BrandFeatureRef FeatureId="31"/>
                        <BrandFeatureRef FeatureId="32"/>
                        <BrandFeatureRef FeatureId="29"/>
                        <BrandFeatureRef FeatureId="28"/>
                        <BrandFeatureRef FeatureId="26"/>
                        <BrandFeatureRef FeatureId="33"/>
                        <BrandFeatureRef FeatureId="34"/>
                        <BrandFeatureRef FeatureId="36"/>
                        <BrandFeatureRef FeatureId="37"/>
                        <BrandFeatureRef FeatureId="35"/>
                        <BrandFeatureRef FeatureId="38"/>
                        <BrandFeatureRef FeatureId="40"/>
                      </FareComponent>
                    </FareComponents>
                    <Messages>
                      <Message AirlineCode="SU" FailCode="0" Info="NONREF/HEBO3BPATEH" Type="N"/>
                      <Message FailCode="0" Info="VALIDATING CARRIER" Type="W"/>
                      <Message FailCode="0" Info="BSP - SU" Type="W"/>
                      <Message FailCode="0" Info="RUT - SU" Type="W"/>
                    </Messages>
                    <BaggageInformationList>
                      <BaggageInformation AirlineCode="SU" ProvisionType="A">
                        <Segment Id="0"/>
                        <Segment Id="1"/>
                        <Allowance Pieces="0"/>
                      </BaggageInformation>
                      <BaggageInformation AirlineCode="SU" ProvisionType="A">
                        <Segment Id="2"/>
                        <Segment Id="3"/>
                        <Allowance Pieces="0"/>
                      </BaggageInformation>
                    </BaggageInformationList>
                  </TPA_Extensions>
                </PassengerFare>
                <Endorsements NonRefundableIndicator="true"/>
                <TPA_Extensions>
                  <FareCalcLine Info="LED SU X/MOW SU AER4500SU X/MOW SU LED6850RUB11350END"/>
                </TPA_Extensions>
                <FareInfos>
                  <FareInfo>
                    <FareReference>N</FareReference>
                    <TPA_Extensions>
                      <SeatsRemaining BelowMin="false" Number="9"/>
                      <Cabin Cabin="Y"/>
                      <Meal Code="S"/>
                    </TPA_Extensions>
                  </FareInfo>
                  <FareInfo>
                    <FareReference>N</FareReference>
                    <TPA_Extensions>
                      <SeatsRemaining BelowMin="false" Number="9"/>
                      <Cabin Cabin="Y"/>
                      <Meal Code="S"/>
                    </TPA_Extensions>
                  </FareInfo>
                  <FareInfo>
                    <FareReference>T</FareReference>
                    <TPA_Extensions>
                      <SeatsRemaining BelowMin="false" Number="9"/>
                      <Cabin Cabin="Y"/>
                      <Meal Code="S"/>
                    </TPA_Extensions>
                  </FareInfo>
                  <FareInfo>
                    <FareReference>T</FareReference>
                    <TPA_Extensions>
                      <SeatsRemaining BelowMin="false" Number="9"/>
                      <Cabin Cabin="Y"/>
                      <Meal Code="S"/>
                    </TPA_Extensions>
                  </FareInfo>
                </FareInfos>
              </PTC_FareBreakdown>
              <PTC_FareBreakdown>
                <PassengerTypeQuantity Code="CNN" Quantity="1"/>
                <FareBasisCodes>
                  <FareBasisCode ArrivalAirportCode="SVO" BookingCode="N" DepartureAirportCode="LED" FareComponentBeginAirport="LED" FareComponentDirectionality="FROM" FareComponentEndAirport="AER" FareComponentFareRule="ENR1" FareComponentFareTariff="304" FareComponentFareType="SB" FareComponentFareTypeBitmap="01" FareComponentVendorCode="ATP" GovCarrier="SU">NNBR/CH25</FareBasisCode>
                  <FareBasisCode ArrivalAirportCode="AER" AvailabilityBreak="true" BookingCode="N" DepartureAirportCode="SVO" GovCarrier="SU">NNBR/CH25</FareBasisCode>
                  <FareBasisCode ArrivalAirportCode="SVO" BookingCode="T" DepartureAirportCode="AER" FareComponentBeginAirport="AER" FareComponentDirectionality="TO" FareComponentEndAirport="LED" FareComponentFareRule="ENR1" FareComponentFareTariff="304" FareComponentFareType="SB" FareComponentFareTypeBitmap="01" FareComponentVendorCode="ATP" GovCarrier="SU">TNBR/CH25</FareBasisCode>
                  <FareBasisCode ArrivalAirportCode="LED" AvailabilityBreak="true" BookingCode="T" DepartureAirportCode="SVO" GovCarrier="SU">TNBR/CH25</FareBasisCode>
                </FareBasisCodes>
                <PassengerFare>
                  <BaseFare Amount="8515" CurrencyCode="RUB"/>
                  <FareConstruction Amount="8513" CurrencyCode="RUB" DecimalPlaces="0"/>
                  <EquivFare Amount="8515" CurrencyCode="RUB" DecimalPlaces="0"/>
                  <Taxes>
                    <Tax Amount="1500" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                    <Tax Amount="1500" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                    <Tax Amount="1500" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                    <Tax Amount="1500" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                    <Tax Amount="270" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRF"/>
                    <Tax Amount="270" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRF"/>
                    <Tax Amount="270" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRF"/>
                    <Tax Amount="270" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRF"/>
                    <Tax Amount="79" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                    <Tax Amount="92" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                    <Tax Amount="60" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                    <Tax Amount="92" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                    <Tax Amount="79" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI4"/>
                    <Tax Amount="92" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI4"/>
                    <Tax Amount="60" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI4"/>
                    <Tax Amount="92" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI4"/>
                    <TaxSummary Amount="6000" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                    <TaxSummary Amount="1080" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRF"/>
                    <TaxSummary Amount="646" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                    <TotalTax Amount="7726" CurrencyCode="RUB" DecimalPlaces="0"/>
                  </Taxes>
                  <TotalFare Amount="16241" CurrencyCode="RUB"/>
                  <PenaltiesInfo>
                    <Penalty Amount="2600" Applicability="Before" Changeable="true" ConditionsApply="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                    <Penalty Amount="2600" Applicability="After" Changeable="true" ConditionsApply="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                    <Penalty Applicability="Before" Refundable="false" Type="Refund"/>
                    <Penalty Applicability="After" Refundable="false" Type="Refund"/>
                  </PenaltiesInfo>
                  <TPA_Extensions>
                    <FareComponents>
                      <FareComponent BrandID="NB" BrandName="ECONOMY LITE" ProgramCode="CFF1S" ProgramDescription="1S" ProgramID="85965" ProgramSystemCode="X">
                        <Segment FlightIndex="1" LegIndex="1"/>
                        <Segment FlightIndex="2" LegIndex="1"/>
                        <BrandFeatureRef FeatureId="5"/>
                        <BrandFeatureRef FeatureId="11"/>
                        <BrandFeatureRef FeatureId="13"/>
                        <BrandFeatureRef FeatureId="15"/>
                        <BrandFeatureRef FeatureId="8"/>
                        <BrandFeatureRef FeatureId="6"/>
                        <BrandFeatureRef FeatureId="7"/>
                        <BrandFeatureRef FeatureId="16"/>
                        <BrandFeatureRef FeatureId="3"/>
                        <BrandFeatureRef FeatureId="10"/>
                        <BrandFeatureRef FeatureId="22"/>
                        <BrandFeatureRef FeatureId="19"/>
                        <BrandFeatureRef FeatureId="17"/>
                        <BrandFeatureRef FeatureId="25"/>
                        <BrandFeatureRef FeatureId="24"/>
                        <BrandFeatureRef FeatureId="2"/>
                        <BrandFeatureRef FeatureId="31"/>
                        <BrandFeatureRef FeatureId="32"/>
                        <BrandFeatureRef FeatureId="29"/>
                        <BrandFeatureRef FeatureId="28"/>
                        <BrandFeatureRef FeatureId="26"/>
                        <BrandFeatureRef FeatureId="33"/>
                        <BrandFeatureRef FeatureId="34"/>
                        <BrandFeatureRef FeatureId="36"/>
                        <BrandFeatureRef FeatureId="37"/>
                        <BrandFeatureRef FeatureId="35"/>
                        <BrandFeatureRef FeatureId="38"/>
                        <BrandFeatureRef FeatureId="40"/>
                      </FareComponent>
                      <FareComponent BrandID="NB" BrandName="ECONOMY LITE" ProgramCode="CFF1S" ProgramDescription="1S" ProgramID="85965" ProgramSystemCode="X">
                        <Segment FlightIndex="1" LegIndex="2"/>
                        <Segment FlightIndex="2" LegIndex="2"/>
                        <BrandFeatureRef FeatureId="5"/>
                        <BrandFeatureRef FeatureId="11"/>
                        <BrandFeatureRef FeatureId="13"/>
                        <BrandFeatureRef FeatureId="15"/>
                        <BrandFeatureRef FeatureId="8"/>
                        <BrandFeatureRef FeatureId="6"/>
                        <BrandFeatureRef FeatureId="7"/>
                        <BrandFeatureRef FeatureId="16"/>
                        <BrandFeatureRef FeatureId="3"/>
                        <BrandFeatureRef FeatureId="10"/>
                        <BrandFeatureRef FeatureId="22"/>
                        <BrandFeatureRef FeatureId="19"/>
                        <BrandFeatureRef FeatureId="17"/>
                        <BrandFeatureRef FeatureId="25"/>
                        <BrandFeatureRef FeatureId="24"/>
                        <BrandFeatureRef FeatureId="2"/>
                        <BrandFeatureRef FeatureId="31"/>
                        <BrandFeatureRef FeatureId="32"/>
                        <BrandFeatureRef FeatureId="29"/>
                        <BrandFeatureRef FeatureId="28"/>
                        <BrandFeatureRef FeatureId="26"/>
                        <BrandFeatureRef FeatureId="33"/>
                        <BrandFeatureRef FeatureId="34"/>
                        <BrandFeatureRef FeatureId="36"/>
                        <BrandFeatureRef FeatureId="37"/>
                        <BrandFeatureRef FeatureId="35"/>
                        <BrandFeatureRef FeatureId="38"/>
                        <BrandFeatureRef FeatureId="40"/>
                      </FareComponent>
                    </FareComponents>
                    <Messages>
                      <Message AirlineCode="SU" FailCode="0" Info="NONREF/HEBO3BPATEH" Type="N"/>
                      <Message FailCode="0" Info="EACH CNN REQUIRES ACCOMPANYING SAME CABIN ADT" Type="W"/>
                      <Message FailCode="0" Info="VALIDATING CARRIER" Type="W"/>
                      <Message FailCode="0" Info="BSP - SU" Type="W"/>
                      <Message FailCode="0" Info="RUT - SU" Type="W"/>
                    </Messages>
                    <BaggageInformationList>
                      <BaggageInformation AirlineCode="SU" ProvisionType="A">
                        <Segment Id="0"/>
                        <Segment Id="1"/>
                        <Allowance Pieces="0"/>
                      </BaggageInformation>
                      <BaggageInformation AirlineCode="SU" ProvisionType="A">
                        <Segment Id="2"/>
                        <Segment Id="3"/>
                        <Allowance Pieces="0"/>
                      </BaggageInformation>
                    </BaggageInformationList>
                  </TPA_Extensions>
                </PassengerFare>
                <Endorsements NonRefundableIndicator="true"/>
                <TPA_Extensions>
                  <FareCalcLine Info="LED SU X/MOW SU AER3375SU X/MOW SU LED5138RUB8513END"/>
                </TPA_Extensions>
                <FareInfos>
                  <FareInfo>
                    <FareReference>N</FareReference>
                    <TPA_Extensions>
                      <SeatsRemaining BelowMin="false" Number="9"/>
                      <Cabin Cabin="Y"/>
                      <Meal Code="S"/>
                    </TPA_Extensions>
                  </FareInfo>
                  <FareInfo>
                    <FareReference>N</FareReference>
                    <TPA_Extensions>
                      <SeatsRemaining BelowMin="false" Number="9"/>
                      <Cabin Cabin="Y"/>
                      <Meal Code="S"/>
                    </TPA_Extensions>
                  </FareInfo>
                  <FareInfo>
                    <FareReference>T</FareReference>
                    <TPA_Extensions>
                      <SeatsRemaining BelowMin="false" Number="9"/>
                      <Cabin Cabin="Y"/>
                      <Meal Code="S"/>
                    </TPA_Extensions>
                  </FareInfo>
                  <FareInfo>
                    <FareReference>T</FareReference>
                    <TPA_Extensions>
                      <SeatsRemaining BelowMin="false" Number="9"/>
                      <Cabin Cabin="Y"/>
                      <Meal Code="S"/>
                    </TPA_Extensions>
                  </FareInfo>
                </FareInfos>
              </PTC_FareBreakdown>
              <PTC_FareBreakdown>
                <PassengerTypeQuantity Code="INF" Quantity="1"/>
                <FareBasisCodes>
                  <FareBasisCode ArrivalAirportCode="SVO" BookingCode="N" DepartureAirportCode="LED" FareComponentBeginAirport="LED" FareComponentDirectionality="FROM" FareComponentEndAirport="AER" FareComponentFareRule="ENR1" FareComponentFareTariff="304" FareComponentFareType="SB" FareComponentFareTypeBitmap="01" FareComponentVendorCode="ATP" GovCarrier="SU">NNBR/IN00</FareBasisCode>
                  <FareBasisCode ArrivalAirportCode="AER" AvailabilityBreak="true" BookingCode="N" DepartureAirportCode="SVO" GovCarrier="SU">NNBR/IN00</FareBasisCode>
                  <FareBasisCode ArrivalAirportCode="SVO" BookingCode="T" DepartureAirportCode="AER" FareComponentBeginAirport="AER" FareComponentDirectionality="TO" FareComponentEndAirport="LED" FareComponentFareRule="ENR1" FareComponentFareTariff="304" FareComponentFareType="SB" FareComponentFareTypeBitmap="01" FareComponentVendorCode="ATP" GovCarrier="SU">TNBR/IN00</FareBasisCode>
                  <FareBasisCode ArrivalAirportCode="LED" AvailabilityBreak="true" BookingCode="T" DepartureAirportCode="SVO" GovCarrier="SU">TNBR/IN00</FareBasisCode>
                </FareBasisCodes>
                <PassengerFare>
                  <BaseFare Amount="0" CurrencyCode="RUB"/>
                  <FareConstruction Amount="0" CurrencyCode="RUB" DecimalPlaces="0"/>
                  <EquivFare Amount="0" CurrencyCode="RUB" DecimalPlaces="0"/>
                  <TotalFare Amount="0" CurrencyCode="RUB"/>
                  <PenaltiesInfo>
                    <Penalty Amount="2600" Applicability="Before" Changeable="true" ConditionsApply="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                    <Penalty Amount="2600" Applicability="After" Changeable="true" ConditionsApply="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                    <Penalty Applicability="Before" Refundable="false" Type="Refund"/>
                    <Penalty Applicability="After" Refundable="false" Type="Refund"/>
                  </PenaltiesInfo>
                  <TPA_Extensions>
                    <FareComponents>
                      <FareComponent BrandID="NB" BrandName="ECONOMY LITE" ProgramCode="CFF1S" ProgramDescription="1S" ProgramID="85965" ProgramSystemCode="X">
                        <Segment FlightIndex="1" LegIndex="1"/>
                        <Segment FlightIndex="2" LegIndex="1"/>
                        <BrandFeatureRef FeatureId="5"/>
                        <BrandFeatureRef FeatureId="11"/>
                        <BrandFeatureRef FeatureId="13"/>
                        <BrandFeatureRef FeatureId="15"/>
                        <BrandFeatureRef FeatureId="8"/>
                        <BrandFeatureRef FeatureId="6"/>
                        <BrandFeatureRef FeatureId="7"/>
                        <BrandFeatureRef FeatureId="16"/>
                        <BrandFeatureRef FeatureId="3"/>
                        <BrandFeatureRef FeatureId="10"/>
                        <BrandFeatureRef FeatureId="22"/>
                        <BrandFeatureRef FeatureId="19"/>
                        <BrandFeatureRef FeatureId="17"/>
                        <BrandFeatureRef FeatureId="25"/>
                        <BrandFeatureRef FeatureId="24"/>
                        <BrandFeatureRef FeatureId="2"/>
                        <BrandFeatureRef FeatureId="31"/>
                        <BrandFeatureRef FeatureId="32"/>
                        <BrandFeatureRef FeatureId="29"/>
                        <BrandFeatureRef FeatureId="28"/>
                        <BrandFeatureRef FeatureId="26"/>
                        <BrandFeatureRef FeatureId="33"/>
                        <BrandFeatureRef FeatureId="34"/>
                        <BrandFeatureRef FeatureId="36"/>
                        <BrandFeatureRef FeatureId="37"/>
                        <BrandFeatureRef FeatureId="35"/>
                        <BrandFeatureRef FeatureId="38"/>
                        <BrandFeatureRef FeatureId="40"/>
                      </FareComponent>
                      <FareComponent BrandID="NB" BrandName="ECONOMY LITE" ProgramCode="CFF1S" ProgramDescription="1S" ProgramID="85965" ProgramSystemCode="X">
                        <Segment FlightIndex="1" LegIndex="2"/>
                        <Segment FlightIndex="2" LegIndex="2"/>
                        <BrandFeatureRef FeatureId="5"/>
                        <BrandFeatureRef FeatureId="11"/>
                        <BrandFeatureRef FeatureId="13"/>
                        <BrandFeatureRef FeatureId="15"/>
                        <BrandFeatureRef FeatureId="8"/>
                        <BrandFeatureRef FeatureId="6"/>
                        <BrandFeatureRef FeatureId="7"/>
                        <BrandFeatureRef FeatureId="16"/>
                        <BrandFeatureRef FeatureId="3"/>
                        <BrandFeatureRef FeatureId="10"/>
                        <BrandFeatureRef FeatureId="22"/>
                        <BrandFeatureRef FeatureId="19"/>
                        <BrandFeatureRef FeatureId="17"/>
                        <BrandFeatureRef FeatureId="25"/>
                        <BrandFeatureRef FeatureId="24"/>
                        <BrandFeatureRef FeatureId="2"/>
                        <BrandFeatureRef FeatureId="31"/>
                        <BrandFeatureRef FeatureId="32"/>
                        <BrandFeatureRef FeatureId="29"/>
                        <BrandFeatureRef FeatureId="28"/>
                        <BrandFeatureRef FeatureId="26"/>
                        <BrandFeatureRef FeatureId="33"/>
                        <BrandFeatureRef FeatureId="34"/>
                        <BrandFeatureRef FeatureId="36"/>
                        <BrandFeatureRef FeatureId="37"/>
                        <BrandFeatureRef FeatureId="35"/>
                        <BrandFeatureRef FeatureId="38"/>
                        <BrandFeatureRef FeatureId="40"/>
                      </FareComponent>
                    </FareComponents>
                    <Messages>
                      <Message AirlineCode="SU" FailCode="0" Info="NONREF/HEBO3BPATEH" Type="N"/>
                      <Message FailCode="0" Info="EACH INF REQUIRES ACCOMPANYING ADT PASSENGER" Type="W"/>
                      <Message FailCode="0" Info="VALIDATING CARRIER" Type="W"/>
                      <Message FailCode="0" Info="BSP - SU" Type="W"/>
                      <Message FailCode="0" Info="RUT - SU" Type="W"/>
                    </Messages>
                    <BaggageInformationList>
                      <BaggageInformation AirlineCode="SU" ProvisionType="A">
                        <Segment Id="0"/>
                        <Segment Id="1"/>
                        <Allowance Pieces="0"/>
                      </BaggageInformation>
                      <BaggageInformation AirlineCode="SU" ProvisionType="A">
                        <Segment Id="2"/>
                        <Segment Id="3"/>
                        <Allowance Pieces="0"/>
                      </BaggageInformation>
                    </BaggageInformationList>
                  </TPA_Extensions>
                </PassengerFare>
                <Endorsements NonRefundableIndicator="true"/>
                <TPA_Extensions>
                  <FareCalcLine Info="LED SU X/MOW SU AER0SU X/MOW SU LED0RUB0END"/>
                </TPA_Extensions>
                <FareInfos>
                  <FareInfo>
                    <FareReference>N</FareReference>
                    <TPA_Extensions>
                      <SeatsRemaining BelowMin="false" Number="9"/>
                      <Cabin Cabin="Y"/>
                      <Meal Code="S"/>
                    </TPA_Extensions>
                  </FareInfo>
                  <FareInfo>
                    <FareReference>N</FareReference>
                    <TPA_Extensions>
                      <SeatsRemaining BelowMin="false" Number="9"/>
                      <Cabin Cabin="Y"/>
                      <Meal Code="S"/>
                    </TPA_Extensions>
                  </FareInfo>
                  <FareInfo>
                    <FareReference>T</FareReference>
                    <TPA_Extensions>
                      <SeatsRemaining BelowMin="false" Number="9"/>
                      <Cabin Cabin="Y"/>
                      <Meal Code="S"/>
                    </TPA_Extensions>
                  </FareInfo>
                  <FareInfo>
                    <FareReference>T</FareReference>
                    <TPA_Extensions>
                      <SeatsRemaining BelowMin="false" Number="9"/>
                      <Cabin Cabin="Y"/>
                      <Meal Code="S"/>
                    </TPA_Extensions>
                  </FareInfo>
                </FareInfos>
              </PTC_FareBreakdown>
            </PTC_FareBreakdowns>
            <FareInfos>
              <FareInfo>
                <FareReference>N</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="S"/>
                </TPA_Extensions>
              </FareInfo>
              <FareInfo>
                <FareReference>N</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="S"/>
                </TPA_Extensions>
              </FareInfo>
              <FareInfo>
                <FareReference>T</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="S"/>
                </TPA_Extensions>
              </FareInfo>
              <FareInfo>
                <FareReference>T</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="S"/>
                </TPA_Extensions>
              </FareInfo>
            </FareInfos>
            <TPA_Extensions>
              <DivideInParty Indicator="false"/>
              <ValidatingCarrier NewVcxProcess="true" SettlementMethod="BSP">
                <Default Code="SU"/>
              </ValidatingCarrier>
              <ValidatingCarrier NewVcxProcess="true" SettlementMethod="RUT">
                <Default Code="SU"/>
              </ValidatingCarrier>
            </TPA_Extensions>
          </AirItineraryPricingInfo>
          <TicketingInfo TicketType="eTicket" ValidInterline="Yes"/>
        </AdditionalFares>
        <ValidatingCarrier Code="SU"/>
      </TPA_Extensions>
    </PricedItinerary>
  </PricedItineraries>
  <TPA_Extensions>
    <AirlineOrderList>
      <AirlineOrder Code="SU" SequenceNumber="1"/>
    </AirlineOrderList>
  </TPA_Extensions>
</OTA_AirLowFareSearchRS>
{% endxmlsec %}

---

{% xmlsec "Пример запроса (расчет по заданному тарифу)", false %}
<OTA_AirLowFareSearchRQ ResponseType="OTA" Version="6.1.0" xmlns="http://www.opentravel.org/OTA/2003/05">
  <POS>
    <Source PseudoCityCode="9LSC">
      <RequestorID ID="1" Type="1">
        <CompanyName Code="TN"/>
      </RequestorID>
    </Source>
  </POS>
  <OriginDestinationInformation RPH="1">
    <DepartureDateTime>2020-09-01T05:00:00</DepartureDateTime>
    <OriginLocation LocationCode="LED"/>
    <DestinationLocation LocationCode="AER"/>
    <TPA_Extensions>
      <Flight ArrivalDateTime="2020-09-01T06:25:00" ClassOfService="Y" DepartureDateTime="2020-09-01T05:00:00" Number="35" Type="A">
        <OriginLocation LocationCode="LED"/>
        <DestinationLocation LocationCode="SVO"/>
        <Airline Marketing="SU" Operating="SU"/>
      </Flight>
      <Flight ArrivalDateTime="2020-09-01T10:15:00" ClassOfService="Y" DepartureDateTime="2020-09-01T07:45:00" Number="1138" Type="A">
        <OriginLocation LocationCode="SVO"/>
        <DestinationLocation LocationCode="AER"/>
        <Airline Marketing="SU" Operating="SU"/>
      </Flight>
      <FareBasis Code="QCLR"/>
    </TPA_Extensions>
  </OriginDestinationInformation>
  <OriginDestinationInformation RPH="2">
    <DepartureDateTime>2020-09-08T06:50:00</DepartureDateTime>
    <OriginLocation LocationCode="AER"/>
    <DestinationLocation LocationCode="LED"/>
    <TPA_Extensions>
      <Flight ArrivalDateTime="2020-09-08T09:20:00" ClassOfService="Y" DepartureDateTime="2020-09-08T06:50:00" Number="1141" Type="A">
        <OriginLocation LocationCode="AER"/>
        <DestinationLocation LocationCode="SVO"/>
        <Airline Marketing="SU" Operating="SU"/>
      </Flight>
      <Flight ArrivalDateTime="2020-09-08T12:20:00" ClassOfService="Y" DepartureDateTime="2020-09-08T10:55:00" Number="14" Type="A">
        <OriginLocation LocationCode="SVO"/>
        <DestinationLocation LocationCode="LED"/>
        <Airline Marketing="SU" Operating="SU"/>
      </Flight>
      <FareBasis Code="MCLR"/>
    </TPA_Extensions>
  </OriginDestinationInformation>
  <TravelPreferences>
    <TPA_Extensions>
      <VerificationItinCallLogic Value="L"/>
    </TPA_Extensions>
    <Baggage Description="true" RequestType="A"/>
  </TravelPreferences>
  <TravelerInfoSummary>
    <SeatsRequested>3</SeatsRequested>
    <AirTravelerAvail>
      <PassengerTypeQuantity Code="ADT" Quantity="2">
        <TPA_Extensions>
          <VoluntaryChanges Match="Info"/>
        </TPA_Extensions>
      </PassengerTypeQuantity>
      <PassengerTypeQuantity Code="CNN" Quantity="1">
        <TPA_Extensions>
          <VoluntaryChanges Match="Info"/>
        </TPA_Extensions>
      </PassengerTypeQuantity>
      <PassengerTypeQuantity Code="INF" Quantity="1">
        <TPA_Extensions>
          <VoluntaryChanges Match="Info"/>
        </TPA_Extensions>
      </PassengerTypeQuantity>
    </AirTravelerAvail>
    <PriceRequestInformation>
      <TPA_Extensions>
        <BrandedFareIndicators ReturnBrandAncillaries="true" SingleBrandedFare="true"/>
      </TPA_Extensions>
    </PriceRequestInformation>
  </TravelerInfoSummary>
</OTA_AirLowFareSearchRQ>
{% endxmlsec %}

{% xmlsec "Пример ответа", false %}
<OTA_AirLowFareSearchRS AvailableItinCount="0" BrandedOneWayItinCount="0" DepartedItinCount="0" PricedItinCount="1" SimpleOneWayItinCount="0" SoldOutItinCount="0" Version="6.1.0" xmlns="http://www.opentravel.org/OTA/2003/05" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <Success/>
  <Warnings>
    <Warning Code="TRANSACTIONID" MessageClass="I" ShortText="7547606392679150272" Type="WORKERTHREAD"/>
    <Warning Code="ASE002LPSPILBD2.IDM.SGDCPROD.SABRE.COM" MessageClass="I" ShortText="27042" Type="SERVER"/>
    <Warning Code="RULEID" MessageClass="I" ShortText="24113" Type="DRE"/>
    <Warning Code="RULEID" MessageClass="I" ShortText="24111" Type="DEFAULT"/>
  </Warnings>
  <BrandFeatures>
    <BrandFeature Application="F" CommercialName="BASIC SEAT" Id="1" ServiceGroup="BF" ServiceType="Z" SubCode="050" Vendor="ATP"/>
    <BrandFeature Application="C" CommercialName="CHANGEABLE TICKET" Id="2" ServiceGroup="BF" ServiceType="Z" SubCode="059" Vendor="ATP"/>
    <BrandFeature Application="N" CommercialName="25 PERCENT MILES EARNED" Id="3" ServiceGroup="BF" ServiceType="Z" SubCode="06A" Vendor="ATP"/>
    <BrandFeature Application="N" CommercialName="150 PERCENT MILES EARNED" Id="4" ServiceGroup="BF" ServiceType="Z" SubCode="06M" Vendor="ATP"/>
    <BrandFeature Application="N" CommercialName="200 PERCENT MILES EARNED" Id="5" ServiceGroup="BF" ServiceType="Z" SubCode="06N" Vendor="ATP"/>
    <BrandFeature Application="N" CommercialName="125 MILES EARNED" Id="6" ServiceGroup="BF" ServiceType="Z" SubCode="06Y" Vendor="ATP"/>
    <BrandFeature Application="N" CommercialName="CHANGE IN CASE OF NO SHOW" Id="7" ServiceGroup="BF" ServiceType="Z" SubCode="CNS" Vendor="ATP"/>
    <BrandFeature Application="N" CommercialName="75 TO 125 PCNT MILES EARNED" Id="8" ServiceGroup="BF" ServiceType="Z" SubCode="ME1" Vendor="ATP"/>
    <BrandFeature Application="F" CommercialName="100 TO 150 PCNT MILES EARNED" Id="9" ServiceGroup="BF" ServiceType="Z" SubCode="ME2" Vendor="ATP"/>
    <BrandFeature Application="N" CommercialName="150 TO 200 PCNT MILES EARNED" Id="10" ServiceGroup="BF" ServiceType="Z" SubCode="ME3" Vendor="ATP"/>
    <BrandFeature Application="N" CommercialName="200 TO 250 PCNT MILES EARNED" Id="11" ServiceGroup="BF" ServiceType="Z" SubCode="ME4" Vendor="ATP"/>
    <BrandFeature Application="N" CommercialName="OPEN RETURN DATE" Id="12" ServiceGroup="BF" ServiceType="Z" SubCode="ORD" Vendor="ATP"/>
    <BrandFeature Application="N" CommercialName="REFUND AFTER CHECKIN CLOSURE" Id="13" ServiceGroup="BF" ServiceType="Z" SubCode="RBA" Vendor="ATP"/>
    <BrandFeature Application="C" CommercialName="REFUND BEFORE CHECKIN CLOSURE" Id="14" ServiceGroup="BF" ServiceType="Z" SubCode="RBC" Vendor="ATP"/>
    <BrandFeature Application="F" CommercialName="STOPOVER" Id="15" ServiceGroup="BF" ServiceType="Z" SubCode="STO" Vendor="ATP"/>
    <BrandFeature Application="C" CommercialName="UPGRADE AT CHECKIN TO COMFORT" Id="16" ServiceGroup="BF" ServiceType="Z" SubCode="UT2" Vendor="ATP"/>
    <BrandFeature Application="C" CommercialName="SECOND EXCESS BAG" Id="17" ServiceGroup="BG" ServiceType="C" SubCode="0CD" Vendor="ATP"/>
    <BrandFeature Application="N" CommercialName="UPTO70LB 32KG AND62LI 158LCM" Id="18" ServiceGroup="BG" ServiceType="C" SubCode="0FM" Vendor="ATP"/>
    <BrandFeature Application="F" CommercialName="UPTO50LB 23KG AND62LI 158LCM" Id="19" ServiceGroup="BG" ServiceType="C" SubCode="0GO" Vendor="ATP"/>
    <BrandFeature Application="F" CommercialName="CARRY10KG 22LBUPTO 55X40X25CM" Id="20" ServiceGroup="BG" ServiceType="C" SubCode="0MJ" Vendor="ATP"/>
    <BrandFeature Application="N" CommercialName="CARRY15KG 33LBUPTO 55X40X25CM" Id="21" ServiceGroup="BG" ServiceType="C" SubCode="0MK" Vendor="ATP"/>
    <BrandFeature Application="C" CommercialName="INTERNET ACCESS" Id="22" ServiceGroup="IE" ServiceType="F" SubCode="0CL" Vendor="ATP"/>
    <BrandFeature Application="N" CommercialName="LOUNGE ACCESS" Id="23" ServiceGroup="LG" ServiceType="F" SubCode="0BX" Vendor="ATP"/>
    <BrandFeature Application="N" CommercialName="PRIORITY CHECK IN" Id="24" ServiceGroup="TS" ServiceType="F" SubCode="03P" Vendor="ATP"/>
    <BrandFeature Application="N" CommercialName="PRIORITY BOARDING" Id="25" ServiceGroup="TS" ServiceType="F" SubCode="0G6" Vendor="ATP"/>
    <BrandFeature Application="N" CommercialName="PRIORITY BAGGAGE" Id="26" ServiceGroup="TS" ServiceType="F" SubCode="0LF" Vendor="ATP"/>
    <BrandFeature Application="N" CommercialName="UPGRADE WITH MILES BONUS" Id="27" ServiceGroup="UP" ServiceType="F" SubCode="0NI" Vendor="ATP"/>
    <BrandFeature Application="C" CommercialName="UPGRADE AT CHECKIN TO BUSINESS" Id="28" ServiceGroup="UP" ServiceType="F" SubCode="UPF" Vendor="ATP"/>
  </BrandFeatures>
  <PricedItineraries>
    <PricedItinerary SequenceNumber="1">
      <AirItinerary DirectionInd="Return">
        <OriginDestinationOptions>
          <OriginDestinationOption ArrivalCountry="RU" DepartureCountry="RU" ElapsedTime="315">
            <FlightSegment ArrivalDateTime="2020-09-01T06:25:00" DepartureDateTime="2020-09-01T05:00:00" ElapsedTime="85" FlightNumber="35" ResBookDesigCode="Q" StopQuantity="0">
              <DepartureAirport LocationCode="LED" TerminalID="1"/>
              <ArrivalAirport LocationCode="SVO" TerminalID="B"/>
              <OperatingAirline Code="SU" FlightNumber="35"/>
              <Equipment AirEquipType="320"/>
              <MarketingAirline Code="SU"/>
              <MarriageGrp>O</MarriageGrp>
              <DepartureTimeZone GMTOffset="3"/>
              <ArrivalTimeZone GMTOffset="3"/>
              <TPA_Extensions>
                <eTicket Ind="true"/>
                <Mileage Amount="372"/>
              </TPA_Extensions>
            </FlightSegment>
            <FlightSegment ArrivalDateTime="2020-09-01T10:15:00" DepartureDateTime="2020-09-01T07:40:00" ElapsedTime="155" FlightNumber="1138" ResBookDesigCode="Q" StopQuantity="0">
              <DepartureAirport LocationCode="SVO" TerminalID="B"/>
              <ArrivalAirport LocationCode="AER"/>
              <OperatingAirline Code="SU" FlightNumber="1138"/>
              <Equipment AirEquipType="73H"/>
              <MarketingAirline Code="SU"/>
              <MarriageGrp>I</MarriageGrp>
              <DepartureTimeZone GMTOffset="3"/>
              <ArrivalTimeZone GMTOffset="3"/>
              <TPA_Extensions>
                <eTicket Ind="true"/>
                <Mileage Amount="873"/>
              </TPA_Extensions>
            </FlightSegment>
          </OriginDestinationOption>
          <OriginDestinationOption ArrivalCountry="RU" DepartureCountry="RU" ElapsedTime="345">
            <FlightSegment ArrivalDateTime="2020-09-08T08:45:00" DepartureDateTime="2020-09-08T06:20:00" ElapsedTime="145" FlightNumber="1141" ResBookDesigCode="M" StopQuantity="0">
              <DepartureAirport LocationCode="AER"/>
              <ArrivalAirport LocationCode="SVO" TerminalID="B"/>
              <OperatingAirline Code="SU" FlightNumber="1141"/>
              <Equipment AirEquipType="32A"/>
              <MarketingAirline Code="SU"/>
              <MarriageGrp>O</MarriageGrp>
              <DepartureTimeZone GMTOffset="3"/>
              <ArrivalTimeZone GMTOffset="3"/>
              <TPA_Extensions>
                <eTicket Ind="true"/>
                <Mileage Amount="873"/>
              </TPA_Extensions>
            </FlightSegment>
            <FlightSegment ArrivalDateTime="2020-09-08T12:05:00" DepartureDateTime="2020-09-08T10:40:00" ElapsedTime="85" FlightNumber="14" ResBookDesigCode="M" StopQuantity="0">
              <DepartureAirport LocationCode="SVO" TerminalID="B"/>
              <ArrivalAirport LocationCode="LED" TerminalID="1"/>
              <OperatingAirline Code="SU" FlightNumber="14"/>
              <Equipment AirEquipType="320"/>
              <MarketingAirline Code="SU"/>
              <MarriageGrp>I</MarriageGrp>
              <DepartureTimeZone GMTOffset="3"/>
              <ArrivalTimeZone GMTOffset="3"/>
              <TPA_Extensions>
                <eTicket Ind="true"/>
                <Mileage Amount="372"/>
              </TPA_Extensions>
            </FlightSegment>
          </OriginDestinationOption>
        </OriginDestinationOptions>
      </AirItinerary>
      <AirItineraryPricingInfo BrandsOnAnyMarket="true" FareReturned="true" LastTicketDate="2020-05-31" LastTicketTime="23:59" PricingSource="WPNI1_ITIN" PricingSubSource="MIP">
        <ItinTotalFare>
          <BaseFare Amount="93365" CurrencyCode="RUB" DecimalPlaces="0"/>
          <FareConstruction Amount="93362" CurrencyCode="RUB" DecimalPlaces="0"/>
          <EquivFare Amount="93365" CurrencyCode="RUB" DecimalPlaces="0"/>
          <Taxes>
            <Tax Amount="24470" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="TOTALTAX"/>
          </Taxes>
          <TotalFare Amount="117835" CurrencyCode="RUB" DecimalPlaces="0"/>
        </ItinTotalFare>
        <PTC_FareBreakdowns>
          <PTC_FareBreakdown>
            <PassengerTypeQuantity Code="ADT" Quantity="2"/>
            <FareBasisCodes>
              <FareBasisCode ArrivalAirportCode="SVO" BookingCode="Q" DepartureAirportCode="LED" FareComponentBeginAirport="LED" FareComponentDirectionality="FROM" FareComponentEndAirport="AER" FareComponentFareRule="ECR1" FareComponentFareTariff="304" FareComponentFareType="XEX" FareComponentFareTypeBitmap="00" FareComponentVendorCode="ATP" GovCarrier="SU">QCLR</FareBasisCode>
              <FareBasisCode ArrivalAirportCode="AER" AvailabilityBreak="true" BookingCode="Q" DepartureAirportCode="SVO" GovCarrier="SU">QCLR</FareBasisCode>
              <FareBasisCode ArrivalAirportCode="SVO" BookingCode="M" DepartureAirportCode="AER" FareComponentBeginAirport="AER" FareComponentDirectionality="TO" FareComponentEndAirport="LED" FareComponentFareRule="ECR1" FareComponentFareTariff="304" FareComponentFareType="XEX" FareComponentFareTypeBitmap="00" FareComponentVendorCode="ATP" GovCarrier="SU">MCLR</FareBasisCode>
              <FareBasisCode ArrivalAirportCode="LED" AvailabilityBreak="true" BookingCode="M" DepartureAirportCode="SVO" GovCarrier="SU">MCLR</FareBasisCode>
            </FareBasisCodes>
            <PassengerFare>
              <BaseFare Amount="33950" CurrencyCode="RUB"/>
              <FareConstruction Amount="33950" CurrencyCode="RUB" DecimalPlaces="0"/>
              <EquivFare Amount="33950" CurrencyCode="RUB" DecimalPlaces="0"/>
              <Taxes>
                <Tax Amount="1500" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                <Tax Amount="1500" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                <Tax Amount="1500" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                <Tax Amount="1500" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                <Tax Amount="270" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRF"/>
                <Tax Amount="270" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRF"/>
                <Tax Amount="270" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRF"/>
                <Tax Amount="270" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRF"/>
                <Tax Amount="158" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                <Tax Amount="184" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                <Tax Amount="120" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                <Tax Amount="184" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                <Tax Amount="158" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI4"/>
                <Tax Amount="184" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI4"/>
                <Tax Amount="120" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI4"/>
                <Tax Amount="184" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI4"/>
                <TaxSummary Amount="6000" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                <TaxSummary Amount="1080" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRF"/>
                <TaxSummary Amount="1292" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                <TotalTax Amount="8372" CurrencyCode="RUB" DecimalPlaces="0"/>
              </Taxes>
              <TotalFare Amount="42322" CurrencyCode="RUB"/>
              <PenaltiesInfo>
                <Penalty Amount="2600" Applicability="Before" Changeable="true" ConditionsApply="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                <Penalty Amount="2600" Applicability="After" Changeable="true" ConditionsApply="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                <Penalty Amount="2600" Applicability="Before" ConditionsApply="true" CurrencyCode="RUB" DecimalPlaces="0" Refundable="true" Type="Refund"/>
                <Penalty Amount="5200" Applicability="After" Cat16Info="true" CurrencyCode="RUB" DecimalPlaces="0" Refundable="true" Type="Refund"/>
              </PenaltiesInfo>
              <TPA_Extensions>
                <FareComponents>
                  <FareComponent BrandID="EC" BrandName="ECONOMY CLASSIC" ProgramCode="CFF1S" ProgramDescription="1S" ProgramID="85965" ProgramSystemCode="X">
                    <Segment FlightIndex="1" LegIndex="1"/>
                    <Segment FlightIndex="2" LegIndex="1"/>
                    <BrandFeatureRef FeatureId="3"/>
                    <BrandFeatureRef FeatureId="8"/>
                    <BrandFeatureRef FeatureId="9"/>
                    <BrandFeatureRef FeatureId="10"/>
                    <BrandFeatureRef FeatureId="6"/>
                    <BrandFeatureRef FeatureId="4"/>
                    <BrandFeatureRef FeatureId="5"/>
                    <BrandFeatureRef FeatureId="11"/>
                    <BrandFeatureRef FeatureId="2"/>
                    <BrandFeatureRef FeatureId="7"/>
                    <BrandFeatureRef FeatureId="14"/>
                    <BrandFeatureRef FeatureId="13"/>
                    <BrandFeatureRef FeatureId="12"/>
                    <BrandFeatureRef FeatureId="16"/>
                    <BrandFeatureRef FeatureId="15"/>
                    <BrandFeatureRef FeatureId="1"/>
                    <BrandFeatureRef FeatureId="20"/>
                    <BrandFeatureRef FeatureId="21"/>
                    <BrandFeatureRef FeatureId="19"/>
                    <BrandFeatureRef FeatureId="18"/>
                    <BrandFeatureRef FeatureId="17"/>
                    <BrandFeatureRef FeatureId="22"/>
                    <BrandFeatureRef FeatureId="23"/>
                    <BrandFeatureRef FeatureId="25"/>
                    <BrandFeatureRef FeatureId="26"/>
                    <BrandFeatureRef FeatureId="24"/>
                    <BrandFeatureRef FeatureId="27"/>
                    <BrandFeatureRef FeatureId="28"/>
                  </FareComponent>
                  <FareComponent BrandID="EC" BrandName="ECONOMY CLASSIC" ProgramCode="CFF1S" ProgramDescription="1S" ProgramID="85965" ProgramSystemCode="X">
                    <Segment FlightIndex="1" LegIndex="2"/>
                    <Segment FlightIndex="2" LegIndex="2"/>
                    <BrandFeatureRef FeatureId="3"/>
                    <BrandFeatureRef FeatureId="8"/>
                    <BrandFeatureRef FeatureId="9"/>
                    <BrandFeatureRef FeatureId="10"/>
                    <BrandFeatureRef FeatureId="6"/>
                    <BrandFeatureRef FeatureId="4"/>
                    <BrandFeatureRef FeatureId="5"/>
                    <BrandFeatureRef FeatureId="11"/>
                    <BrandFeatureRef FeatureId="2"/>
                    <BrandFeatureRef FeatureId="7"/>
                    <BrandFeatureRef FeatureId="14"/>
                    <BrandFeatureRef FeatureId="13"/>
                    <BrandFeatureRef FeatureId="12"/>
                    <BrandFeatureRef FeatureId="16"/>
                    <BrandFeatureRef FeatureId="15"/>
                    <BrandFeatureRef FeatureId="1"/>
                    <BrandFeatureRef FeatureId="20"/>
                    <BrandFeatureRef FeatureId="21"/>
                    <BrandFeatureRef FeatureId="19"/>
                    <BrandFeatureRef FeatureId="18"/>
                    <BrandFeatureRef FeatureId="17"/>
                    <BrandFeatureRef FeatureId="22"/>
                    <BrandFeatureRef FeatureId="23"/>
                    <BrandFeatureRef FeatureId="25"/>
                    <BrandFeatureRef FeatureId="26"/>
                    <BrandFeatureRef FeatureId="24"/>
                    <BrandFeatureRef FeatureId="27"/>
                    <BrandFeatureRef FeatureId="28"/>
                  </FareComponent>
                </FareComponents>
                <Messages>
                  <Message FailCode="0" Info="VALIDATING CARRIER" Type="W"/>
                  <Message FailCode="0" Info="BSP - SU" Type="W"/>
                  <Message FailCode="0" Info="RUT - SU" Type="W"/>
                </Messages>
                <BaggageInformationList>
                  <BaggageInformation AirlineCode="SU" ProvisionType="A">
                    <Segment Id="0"/>
                    <Segment Id="1"/>
                    <Allowance Description1="UP TO 50 POUNDS/23 KILOGRAMS" Description2="UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS" Pieces="1"/>
                  </BaggageInformation>
                  <BaggageInformation AirlineCode="SU" ProvisionType="A">
                    <Segment Id="2"/>
                    <Segment Id="3"/>
                    <Allowance Description1="UP TO 50 POUNDS/23 KILOGRAMS" Description2="UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS" Pieces="1"/>
                  </BaggageInformation>
                </BaggageInformationList>
              </TPA_Extensions>
            </PassengerFare>
            <Endorsements NonRefundableIndicator="true"/>
            <TPA_Extensions>
              <FareCalcLine Info="LED SU X/MOW SU AER9450SU X/MOW SU LED24500RUB33950END"/>
            </TPA_Extensions>
            <FareInfos>
              <FareInfo>
                <FareReference>Q</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="S"/>
                </TPA_Extensions>
              </FareInfo>
              <FareInfo>
                <FareReference>Q</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="S"/>
                </TPA_Extensions>
              </FareInfo>
              <FareInfo>
                <FareReference>M</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="S"/>
                </TPA_Extensions>
              </FareInfo>
              <FareInfo>
                <FareReference>M</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="S"/>
                </TPA_Extensions>
              </FareInfo>
            </FareInfos>
          </PTC_FareBreakdown>
          <PTC_FareBreakdown>
            <PassengerTypeQuantity Code="CNN" Quantity="1"/>
            <FareBasisCodes>
              <FareBasisCode ArrivalAirportCode="SVO" BookingCode="Q" DepartureAirportCode="LED" FareComponentBeginAirport="LED" FareComponentDirectionality="FROM" FareComponentEndAirport="AER" FareComponentFareRule="ECR1" FareComponentFareTariff="304" FareComponentFareType="XEX" FareComponentFareTypeBitmap="01" FareComponentVendorCode="ATP" GovCarrier="SU">QCLR/CH25</FareBasisCode>
              <FareBasisCode ArrivalAirportCode="AER" AvailabilityBreak="true" BookingCode="Q" DepartureAirportCode="SVO" GovCarrier="SU">QCLR/CH25</FareBasisCode>
              <FareBasisCode ArrivalAirportCode="SVO" BookingCode="M" DepartureAirportCode="AER" FareComponentBeginAirport="AER" FareComponentDirectionality="TO" FareComponentEndAirport="LED" FareComponentFareRule="ECR1" FareComponentFareTariff="304" FareComponentFareType="XEX" FareComponentFareTypeBitmap="01" FareComponentVendorCode="ATP" GovCarrier="SU">MCLR/CH25</FareBasisCode>
              <FareBasisCode ArrivalAirportCode="LED" AvailabilityBreak="true" BookingCode="M" DepartureAirportCode="SVO" GovCarrier="SU">MCLR/CH25</FareBasisCode>
            </FareBasisCodes>
            <PassengerFare>
              <BaseFare Amount="25465" CurrencyCode="RUB"/>
              <FareConstruction Amount="25462" CurrencyCode="RUB" DecimalPlaces="0"/>
              <EquivFare Amount="25465" CurrencyCode="RUB" DecimalPlaces="0"/>
              <Taxes>
                <Tax Amount="1500" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                <Tax Amount="1500" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                <Tax Amount="1500" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                <Tax Amount="1500" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                <Tax Amount="270" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRF"/>
                <Tax Amount="270" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRF"/>
                <Tax Amount="270" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRF"/>
                <Tax Amount="270" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRF"/>
                <Tax Amount="79" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                <Tax Amount="92" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                <Tax Amount="60" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                <Tax Amount="92" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                <Tax Amount="79" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI4"/>
                <Tax Amount="92" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI4"/>
                <Tax Amount="60" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI4"/>
                <Tax Amount="92" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI4"/>
                <TaxSummary Amount="6000" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                <TaxSummary Amount="1080" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRF"/>
                <TaxSummary Amount="646" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                <TotalTax Amount="7726" CurrencyCode="RUB" DecimalPlaces="0"/>
              </Taxes>
              <TotalFare Amount="33191" CurrencyCode="RUB"/>
              <PenaltiesInfo>
                <Penalty Amount="2600" Applicability="Before" Changeable="true" ConditionsApply="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                <Penalty Amount="2600" Applicability="After" Changeable="true" ConditionsApply="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                <Penalty Amount="2600" Applicability="Before" ConditionsApply="true" CurrencyCode="RUB" DecimalPlaces="0" Refundable="true" Type="Refund"/>
                <Penalty Amount="5200" Applicability="After" Cat16Info="true" CurrencyCode="RUB" DecimalPlaces="0" Refundable="true" Type="Refund"/>
              </PenaltiesInfo>
              <TPA_Extensions>
                <FareComponents>
                  <FareComponent BrandID="EC" BrandName="ECONOMY CLASSIC" ProgramCode="CFF1S" ProgramDescription="1S" ProgramID="85965" ProgramSystemCode="X">
                    <Segment FlightIndex="1" LegIndex="1"/>
                    <Segment FlightIndex="2" LegIndex="1"/>
                    <BrandFeatureRef FeatureId="3"/>
                    <BrandFeatureRef FeatureId="8"/>
                    <BrandFeatureRef FeatureId="9"/>
                    <BrandFeatureRef FeatureId="10"/>
                    <BrandFeatureRef FeatureId="6"/>
                    <BrandFeatureRef FeatureId="4"/>
                    <BrandFeatureRef FeatureId="5"/>
                    <BrandFeatureRef FeatureId="11"/>
                    <BrandFeatureRef FeatureId="2"/>
                    <BrandFeatureRef FeatureId="7"/>
                    <BrandFeatureRef FeatureId="14"/>
                    <BrandFeatureRef FeatureId="13"/>
                    <BrandFeatureRef FeatureId="12"/>
                    <BrandFeatureRef FeatureId="16"/>
                    <BrandFeatureRef FeatureId="15"/>
                    <BrandFeatureRef FeatureId="1"/>
                    <BrandFeatureRef FeatureId="20"/>
                    <BrandFeatureRef FeatureId="21"/>
                    <BrandFeatureRef FeatureId="19"/>
                    <BrandFeatureRef FeatureId="18"/>
                    <BrandFeatureRef FeatureId="17"/>
                    <BrandFeatureRef FeatureId="22"/>
                    <BrandFeatureRef FeatureId="23"/>
                    <BrandFeatureRef FeatureId="25"/>
                    <BrandFeatureRef FeatureId="26"/>
                    <BrandFeatureRef FeatureId="24"/>
                    <BrandFeatureRef FeatureId="27"/>
                    <BrandFeatureRef FeatureId="28"/>
                  </FareComponent>
                  <FareComponent BrandID="EC" BrandName="ECONOMY CLASSIC" ProgramCode="CFF1S" ProgramDescription="1S" ProgramID="85965" ProgramSystemCode="X">
                    <Segment FlightIndex="1" LegIndex="2"/>
                    <Segment FlightIndex="2" LegIndex="2"/>
                    <BrandFeatureRef FeatureId="3"/>
                    <BrandFeatureRef FeatureId="8"/>
                    <BrandFeatureRef FeatureId="9"/>
                    <BrandFeatureRef FeatureId="10"/>
                    <BrandFeatureRef FeatureId="6"/>
                    <BrandFeatureRef FeatureId="4"/>
                    <BrandFeatureRef FeatureId="5"/>
                    <BrandFeatureRef FeatureId="11"/>
                    <BrandFeatureRef FeatureId="2"/>
                    <BrandFeatureRef FeatureId="7"/>
                    <BrandFeatureRef FeatureId="14"/>
                    <BrandFeatureRef FeatureId="13"/>
                    <BrandFeatureRef FeatureId="12"/>
                    <BrandFeatureRef FeatureId="16"/>
                    <BrandFeatureRef FeatureId="15"/>
                    <BrandFeatureRef FeatureId="1"/>
                    <BrandFeatureRef FeatureId="20"/>
                    <BrandFeatureRef FeatureId="21"/>
                    <BrandFeatureRef FeatureId="19"/>
                    <BrandFeatureRef FeatureId="18"/>
                    <BrandFeatureRef FeatureId="17"/>
                    <BrandFeatureRef FeatureId="22"/>
                    <BrandFeatureRef FeatureId="23"/>
                    <BrandFeatureRef FeatureId="25"/>
                    <BrandFeatureRef FeatureId="26"/>
                    <BrandFeatureRef FeatureId="24"/>
                    <BrandFeatureRef FeatureId="27"/>
                    <BrandFeatureRef FeatureId="28"/>
                  </FareComponent>
                </FareComponents>
                <Messages>
                  <Message FailCode="0" Info="EACH CNN REQUIRES ACCOMPANYING SAME CABIN ADT" Type="W"/>
                  <Message FailCode="0" Info="VALIDATING CARRIER" Type="W"/>
                  <Message FailCode="0" Info="BSP - SU" Type="W"/>
                  <Message FailCode="0" Info="RUT - SU" Type="W"/>
                </Messages>
                <BaggageInformationList>
                  <BaggageInformation AirlineCode="SU" ProvisionType="A">
                    <Segment Id="0"/>
                    <Segment Id="1"/>
                    <Allowance Description1="UP TO 50 POUNDS/23 KILOGRAMS" Description2="UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS" Pieces="1"/>
                  </BaggageInformation>
                  <BaggageInformation AirlineCode="SU" ProvisionType="A">
                    <Segment Id="2"/>
                    <Segment Id="3"/>
                    <Allowance Description1="UP TO 50 POUNDS/23 KILOGRAMS" Description2="UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS" Pieces="1"/>
                  </BaggageInformation>
                </BaggageInformationList>
              </TPA_Extensions>
            </PassengerFare>
            <Endorsements NonRefundableIndicator="true"/>
            <TPA_Extensions>
              <FareCalcLine Info="LED SU X/MOW SU AER7087SU X/MOW SU LED18375RUB25462END"/>
            </TPA_Extensions>
            <FareInfos>
              <FareInfo>
                <FareReference>Q</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="S"/>
                </TPA_Extensions>
              </FareInfo>
              <FareInfo>
                <FareReference>Q</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="S"/>
                </TPA_Extensions>
              </FareInfo>
              <FareInfo>
                <FareReference>M</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="S"/>
                </TPA_Extensions>
              </FareInfo>
              <FareInfo>
                <FareReference>M</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="S"/>
                </TPA_Extensions>
              </FareInfo>
            </FareInfos>
          </PTC_FareBreakdown>
          <PTC_FareBreakdown>
            <PassengerTypeQuantity Code="INF" Quantity="1"/>
            <FareBasisCodes>
              <FareBasisCode ArrivalAirportCode="SVO" BookingCode="Q" DepartureAirportCode="LED" FareComponentBeginAirport="LED" FareComponentDirectionality="FROM" FareComponentEndAirport="AER" FareComponentFareRule="ECR1" FareComponentFareTariff="304" FareComponentFareType="XEX" FareComponentFareTypeBitmap="01" FareComponentVendorCode="ATP" GovCarrier="SU">QCLR/IN00</FareBasisCode>
              <FareBasisCode ArrivalAirportCode="AER" AvailabilityBreak="true" BookingCode="Q" DepartureAirportCode="SVO" GovCarrier="SU">QCLR/IN00</FareBasisCode>
              <FareBasisCode ArrivalAirportCode="SVO" BookingCode="M" DepartureAirportCode="AER" FareComponentBeginAirport="AER" FareComponentDirectionality="TO" FareComponentEndAirport="LED" FareComponentFareRule="ECR1" FareComponentFareTariff="304" FareComponentFareType="XEX" FareComponentFareTypeBitmap="01" FareComponentVendorCode="ATP" GovCarrier="SU">MCLR/IN00</FareBasisCode>
              <FareBasisCode ArrivalAirportCode="LED" AvailabilityBreak="true" BookingCode="M" DepartureAirportCode="SVO" GovCarrier="SU">MCLR/IN00</FareBasisCode>
            </FareBasisCodes>
            <PassengerFare>
              <BaseFare Amount="0" CurrencyCode="RUB"/>
              <FareConstruction Amount="0" CurrencyCode="RUB" DecimalPlaces="0"/>
              <EquivFare Amount="0" CurrencyCode="RUB" DecimalPlaces="0"/>
              <TotalFare Amount="0" CurrencyCode="RUB"/>
              <PenaltiesInfo>
                <Penalty Amount="2600" Applicability="Before" Changeable="true" ConditionsApply="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                <Penalty Amount="2600" Applicability="After" Changeable="true" ConditionsApply="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                <Penalty Amount="2600" Applicability="Before" ConditionsApply="true" CurrencyCode="RUB" DecimalPlaces="0" Refundable="true" Type="Refund"/>
                <Penalty Amount="5200" Applicability="After" Cat16Info="true" CurrencyCode="RUB" DecimalPlaces="0" Refundable="true" Type="Refund"/>
              </PenaltiesInfo>
              <TPA_Extensions>
                <FareComponents>
                  <FareComponent BrandID="EC" BrandName="ECONOMY CLASSIC" ProgramCode="CFF1S" ProgramDescription="1S" ProgramID="85965" ProgramSystemCode="X">
                    <Segment FlightIndex="1" LegIndex="1"/>
                    <Segment FlightIndex="2" LegIndex="1"/>
                    <BrandFeatureRef FeatureId="3"/>
                    <BrandFeatureRef FeatureId="8"/>
                    <BrandFeatureRef FeatureId="9"/>
                    <BrandFeatureRef FeatureId="10"/>
                    <BrandFeatureRef FeatureId="6"/>
                    <BrandFeatureRef FeatureId="4"/>
                    <BrandFeatureRef FeatureId="5"/>
                    <BrandFeatureRef FeatureId="11"/>
                    <BrandFeatureRef FeatureId="2"/>
                    <BrandFeatureRef FeatureId="7"/>
                    <BrandFeatureRef FeatureId="14"/>
                    <BrandFeatureRef FeatureId="13"/>
                    <BrandFeatureRef FeatureId="12"/>
                    <BrandFeatureRef FeatureId="16"/>
                    <BrandFeatureRef FeatureId="15"/>
                    <BrandFeatureRef FeatureId="1"/>
                    <BrandFeatureRef FeatureId="20"/>
                    <BrandFeatureRef FeatureId="21"/>
                    <BrandFeatureRef FeatureId="19"/>
                    <BrandFeatureRef FeatureId="18"/>
                    <BrandFeatureRef FeatureId="17"/>
                    <BrandFeatureRef FeatureId="22"/>
                    <BrandFeatureRef FeatureId="23"/>
                    <BrandFeatureRef FeatureId="25"/>
                    <BrandFeatureRef FeatureId="26"/>
                    <BrandFeatureRef FeatureId="24"/>
                    <BrandFeatureRef FeatureId="27"/>
                    <BrandFeatureRef FeatureId="28"/>
                  </FareComponent>
                  <FareComponent BrandID="EC" BrandName="ECONOMY CLASSIC" ProgramCode="CFF1S" ProgramDescription="1S" ProgramID="85965" ProgramSystemCode="X">
                    <Segment FlightIndex="1" LegIndex="2"/>
                    <Segment FlightIndex="2" LegIndex="2"/>
                    <BrandFeatureRef FeatureId="3"/>
                    <BrandFeatureRef FeatureId="8"/>
                    <BrandFeatureRef FeatureId="9"/>
                    <BrandFeatureRef FeatureId="10"/>
                    <BrandFeatureRef FeatureId="6"/>
                    <BrandFeatureRef FeatureId="4"/>
                    <BrandFeatureRef FeatureId="5"/>
                    <BrandFeatureRef FeatureId="11"/>
                    <BrandFeatureRef FeatureId="2"/>
                    <BrandFeatureRef FeatureId="7"/>
                    <BrandFeatureRef FeatureId="14"/>
                    <BrandFeatureRef FeatureId="13"/>
                    <BrandFeatureRef FeatureId="12"/>
                    <BrandFeatureRef FeatureId="16"/>
                    <BrandFeatureRef FeatureId="15"/>
                    <BrandFeatureRef FeatureId="1"/>
                    <BrandFeatureRef FeatureId="20"/>
                    <BrandFeatureRef FeatureId="21"/>
                    <BrandFeatureRef FeatureId="19"/>
                    <BrandFeatureRef FeatureId="18"/>
                    <BrandFeatureRef FeatureId="17"/>
                    <BrandFeatureRef FeatureId="22"/>
                    <BrandFeatureRef FeatureId="23"/>
                    <BrandFeatureRef FeatureId="25"/>
                    <BrandFeatureRef FeatureId="26"/>
                    <BrandFeatureRef FeatureId="24"/>
                    <BrandFeatureRef FeatureId="27"/>
                    <BrandFeatureRef FeatureId="28"/>
                  </FareComponent>
                </FareComponents>
                <Messages>
                  <Message FailCode="0" Info="EACH INF REQUIRES ACCOMPANYING ADT PASSENGER" Type="W"/>
                  <Message FailCode="0" Info="VALIDATING CARRIER" Type="W"/>
                  <Message FailCode="0" Info="BSP - SU" Type="W"/>
                  <Message FailCode="0" Info="RUT - SU" Type="W"/>
                </Messages>
                <BaggageInformationList>
                  <BaggageInformation AirlineCode="SU" ProvisionType="A">
                    <Segment Id="0"/>
                    <Segment Id="1"/>
                    <Allowance Description1="UP TO 22 POUNDS/10 KILOGRAMS" Description2="UP TO 45 LINEAR INCHES/115 LINEAR CENTIMETERS" Pieces="1"/>
                  </BaggageInformation>
                  <BaggageInformation AirlineCode="SU" ProvisionType="A">
                    <Segment Id="2"/>
                    <Segment Id="3"/>
                    <Allowance Description1="UP TO 22 POUNDS/10 KILOGRAMS" Description2="UP TO 45 LINEAR INCHES/115 LINEAR CENTIMETERS" Pieces="1"/>
                  </BaggageInformation>
                </BaggageInformationList>
              </TPA_Extensions>
            </PassengerFare>
            <Endorsements NonRefundableIndicator="true"/>
            <TPA_Extensions>
              <FareCalcLine Info="LED SU X/MOW SU AER0SU X/MOW SU LED0RUB0END"/>
            </TPA_Extensions>
            <FareInfos>
              <FareInfo>
                <FareReference>Q</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="S"/>
                </TPA_Extensions>
              </FareInfo>
              <FareInfo>
                <FareReference>Q</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="S"/>
                </TPA_Extensions>
              </FareInfo>
              <FareInfo>
                <FareReference>M</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="S"/>
                </TPA_Extensions>
              </FareInfo>
              <FareInfo>
                <FareReference>M</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="S"/>
                </TPA_Extensions>
              </FareInfo>
            </FareInfos>
          </PTC_FareBreakdown>
        </PTC_FareBreakdowns>
        <FareInfos>
          <FareInfo>
            <FareReference>Q</FareReference>
            <TPA_Extensions>
              <SeatsRemaining BelowMin="false" Number="9"/>
              <Cabin Cabin="Y"/>
              <Meal Code="S"/>
            </TPA_Extensions>
          </FareInfo>
          <FareInfo>
            <FareReference>Q</FareReference>
            <TPA_Extensions>
              <SeatsRemaining BelowMin="false" Number="9"/>
              <Cabin Cabin="Y"/>
              <Meal Code="S"/>
            </TPA_Extensions>
          </FareInfo>
          <FareInfo>
            <FareReference>M</FareReference>
            <TPA_Extensions>
              <SeatsRemaining BelowMin="false" Number="9"/>
              <Cabin Cabin="Y"/>
              <Meal Code="S"/>
            </TPA_Extensions>
          </FareInfo>
          <FareInfo>
            <FareReference>M</FareReference>
            <TPA_Extensions>
              <SeatsRemaining BelowMin="false" Number="9"/>
              <Cabin Cabin="Y"/>
              <Meal Code="S"/>
            </TPA_Extensions>
          </FareInfo>
        </FareInfos>
        <TPA_Extensions>
          <DivideInParty Indicator="false"/>
          <ValidatingCarrier NewVcxProcess="true" SettlementMethod="BSP">
            <Default Code="SU"/>
          </ValidatingCarrier>
          <ValidatingCarrier NewVcxProcess="true" SettlementMethod="RUT">
            <Default Code="SU"/>
          </ValidatingCarrier>
        </TPA_Extensions>
      </AirItineraryPricingInfo>
      <TicketingInfo TicketType="eTicket" ValidInterline="Yes"/>
      <TPA_Extensions>
        <ValidatingCarrier Code="SU"/>
      </TPA_Extensions>
    </PricedItinerary>
  </PricedItineraries>
  <TPA_Extensions>
    <AirlineOrderList>
      <AirlineOrder Code="SU" SequenceNumber="1"/>
    </AirlineOrderList>
  </TPA_Extensions>
</OTA_AirLowFareSearchRS>
{% endxmlsec %}

---

{% xmlsec "Пример запроса (расчет по заданному бренду)", false %}
<OTA_AirLowFareSearchRQ ResponseType="OTA" Version="6.1.0" xmlns="http://www.opentravel.org/OTA/2003/05">
  <POS>
    <Source PseudoCityCode="9LSC">
      <RequestorID ID="1" Type="1">
        <CompanyName Code="TN"/>
      </RequestorID>
    </Source>
  </POS>
  <OriginDestinationInformation RPH="1">
    <DepartureDateTime>2020-09-01T05:00:00</DepartureDateTime>
    <OriginLocation LocationCode="LED"/>
    <DestinationLocation LocationCode="AER"/>
    <TPA_Extensions>
      <Flight ArrivalDateTime="2020-09-01T06:25:00" ClassOfService="Y" DepartureDateTime="2020-09-01T05:00:00" Number="35" Type="A">
        <OriginLocation LocationCode="LED"/>
        <DestinationLocation LocationCode="SVO"/>
        <Airline Marketing="SU" Operating="SU"/>
      </Flight>
      <Flight ArrivalDateTime="2020-09-01T10:15:00" ClassOfService="Y" DepartureDateTime="2020-09-01T07:45:00" Number="1138" Type="A">
        <OriginLocation LocationCode="SVO"/>
        <DestinationLocation LocationCode="AER"/>
        <Airline Marketing="SU" Operating="SU"/>
      </Flight>
      <BrandFilters>
        <Brand Code="EC" PreferLevel="Preferred"/>
      </BrandFilters>
    </TPA_Extensions>
  </OriginDestinationInformation>
  <OriginDestinationInformation RPH="2">
    <DepartureDateTime>2020-09-08T06:50:00</DepartureDateTime>
    <OriginLocation LocationCode="AER"/>
    <DestinationLocation LocationCode="LED"/>
    <TPA_Extensions>
      <Flight ArrivalDateTime="2020-09-08T09:20:00" ClassOfService="Y" DepartureDateTime="2020-09-08T06:50:00" Number="1141" Type="A">
        <OriginLocation LocationCode="AER"/>
        <DestinationLocation LocationCode="SVO"/>
        <Airline Marketing="SU" Operating="SU"/>
      </Flight>
      <Flight ArrivalDateTime="2020-09-08T12:20:00" ClassOfService="Y" DepartureDateTime="2020-09-08T10:55:00" Number="14" Type="A">
        <OriginLocation LocationCode="SVO"/>
        <DestinationLocation LocationCode="LED"/>
        <Airline Marketing="SU" Operating="SU"/>
      </Flight>
      <BrandFilters>
        <Brand Code="EC" PreferLevel="Preferred"/>
      </BrandFilters>
    </TPA_Extensions>
  </OriginDestinationInformation>
  <TravelPreferences>
    <TPA_Extensions>
      <VerificationItinCallLogic Value="L"/>
    </TPA_Extensions>
    <Baggage Description="true" RequestType="A"/>
  </TravelPreferences>
  <TravelerInfoSummary>
    <SeatsRequested>3</SeatsRequested>
    <AirTravelerAvail>
      <PassengerTypeQuantity Code="ADT" Quantity="2">
        <TPA_Extensions>
          <VoluntaryChanges Match="Info"/>
        </TPA_Extensions>
      </PassengerTypeQuantity>
      <PassengerTypeQuantity Code="CNN" Quantity="1">
        <TPA_Extensions>
          <VoluntaryChanges Match="Info"/>
        </TPA_Extensions>
      </PassengerTypeQuantity>
      <PassengerTypeQuantity Code="INF" Quantity="1">
        <TPA_Extensions>
          <VoluntaryChanges Match="Info"/>
        </TPA_Extensions>
      </PassengerTypeQuantity>
    </AirTravelerAvail>
    <PriceRequestInformation>
      <TPA_Extensions>
        <BrandedFareIndicators ReturnBrandAncillaries="true" SingleBrandedFare="true"/>
      </TPA_Extensions>
    </PriceRequestInformation>
  </TravelerInfoSummary>
</OTA_AirLowFareSearchRQ>
{% endxmlsec %}

{% xmlsec "Пример ответа", false %}
<OTA_AirLowFareSearchRS AvailableItinCount="0" BrandedOneWayItinCount="0" DepartedItinCount="0" PricedItinCount="1" SimpleOneWayItinCount="0" SoldOutItinCount="0" Version="6.1.0" xmlns="http://www.opentravel.org/OTA/2003/05" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <Success/>
  <Warnings>
    <Warning Code="TRANSACTIONID" MessageClass="I" ShortText="7547637930551369878" Type="WORKERTHREAD"/>
    <Warning Code="ASE032LPSPIL981.IDM.SGDCPROD.SABRE.COM" MessageClass="I" ShortText="27032" Type="SERVER"/>
    <Warning Code="RULEID" MessageClass="I" ShortText="24113" Type="DRE"/>
    <Warning Code="RULEID" MessageClass="I" ShortText="24111" Type="DEFAULT"/>
  </Warnings>
  <BrandFeatures>
    <BrandFeature Application="F" CommercialName="BASIC SEAT" Id="1" ServiceGroup="BF" ServiceType="Z" SubCode="050" Vendor="ATP"/>
    <BrandFeature Application="C" CommercialName="CHANGEABLE TICKET" Id="2" ServiceGroup="BF" ServiceType="Z" SubCode="059" Vendor="ATP"/>
    <BrandFeature Application="N" CommercialName="25 PERCENT MILES EARNED" Id="3" ServiceGroup="BF" ServiceType="Z" SubCode="06A" Vendor="ATP"/>
    <BrandFeature Application="N" CommercialName="150 PERCENT MILES EARNED" Id="4" ServiceGroup="BF" ServiceType="Z" SubCode="06M" Vendor="ATP"/>
    <BrandFeature Application="N" CommercialName="200 PERCENT MILES EARNED" Id="5" ServiceGroup="BF" ServiceType="Z" SubCode="06N" Vendor="ATP"/>
    <BrandFeature Application="N" CommercialName="125 MILES EARNED" Id="6" ServiceGroup="BF" ServiceType="Z" SubCode="06Y" Vendor="ATP"/>
    <BrandFeature Application="N" CommercialName="CHANGE IN CASE OF NO SHOW" Id="7" ServiceGroup="BF" ServiceType="Z" SubCode="CNS" Vendor="ATP"/>
    <BrandFeature Application="N" CommercialName="75 TO 125 PCNT MILES EARNED" Id="8" ServiceGroup="BF" ServiceType="Z" SubCode="ME1" Vendor="ATP"/>
    <BrandFeature Application="F" CommercialName="100 TO 150 PCNT MILES EARNED" Id="9" ServiceGroup="BF" ServiceType="Z" SubCode="ME2" Vendor="ATP"/>
    <BrandFeature Application="N" CommercialName="150 TO 200 PCNT MILES EARNED" Id="10" ServiceGroup="BF" ServiceType="Z" SubCode="ME3" Vendor="ATP"/>
    <BrandFeature Application="N" CommercialName="200 TO 250 PCNT MILES EARNED" Id="11" ServiceGroup="BF" ServiceType="Z" SubCode="ME4" Vendor="ATP"/>
    <BrandFeature Application="N" CommercialName="OPEN RETURN DATE" Id="12" ServiceGroup="BF" ServiceType="Z" SubCode="ORD" Vendor="ATP"/>
    <BrandFeature Application="N" CommercialName="REFUND AFTER CHECKIN CLOSURE" Id="13" ServiceGroup="BF" ServiceType="Z" SubCode="RBA" Vendor="ATP"/>
    <BrandFeature Application="C" CommercialName="REFUND BEFORE CHECKIN CLOSURE" Id="14" ServiceGroup="BF" ServiceType="Z" SubCode="RBC" Vendor="ATP"/>
    <BrandFeature Application="F" CommercialName="STOPOVER" Id="15" ServiceGroup="BF" ServiceType="Z" SubCode="STO" Vendor="ATP"/>
    <BrandFeature Application="C" CommercialName="UPGRADE AT CHECKIN TO COMFORT" Id="16" ServiceGroup="BF" ServiceType="Z" SubCode="UT2" Vendor="ATP"/>
    <BrandFeature Application="C" CommercialName="SECOND EXCESS BAG" Id="17" ServiceGroup="BG" ServiceType="C" SubCode="0CD" Vendor="ATP"/>
    <BrandFeature Application="N" CommercialName="UPTO70LB 32KG AND62LI 158LCM" Id="18" ServiceGroup="BG" ServiceType="C" SubCode="0FM" Vendor="ATP"/>
    <BrandFeature Application="F" CommercialName="UPTO50LB 23KG AND62LI 158LCM" Id="19" ServiceGroup="BG" ServiceType="C" SubCode="0GO" Vendor="ATP"/>
    <BrandFeature Application="F" CommercialName="CARRY10KG 22LBUPTO 55X40X25CM" Id="20" ServiceGroup="BG" ServiceType="C" SubCode="0MJ" Vendor="ATP"/>
    <BrandFeature Application="N" CommercialName="CARRY15KG 33LBUPTO 55X40X25CM" Id="21" ServiceGroup="BG" ServiceType="C" SubCode="0MK" Vendor="ATP"/>
    <BrandFeature Application="C" CommercialName="INTERNET ACCESS" Id="22" ServiceGroup="IE" ServiceType="F" SubCode="0CL" Vendor="ATP"/>
    <BrandFeature Application="N" CommercialName="LOUNGE ACCESS" Id="23" ServiceGroup="LG" ServiceType="F" SubCode="0BX" Vendor="ATP"/>
    <BrandFeature Application="N" CommercialName="PRIORITY CHECK IN" Id="24" ServiceGroup="TS" ServiceType="F" SubCode="03P" Vendor="ATP"/>
    <BrandFeature Application="N" CommercialName="PRIORITY BOARDING" Id="25" ServiceGroup="TS" ServiceType="F" SubCode="0G6" Vendor="ATP"/>
    <BrandFeature Application="N" CommercialName="PRIORITY BAGGAGE" Id="26" ServiceGroup="TS" ServiceType="F" SubCode="0LF" Vendor="ATP"/>
    <BrandFeature Application="N" CommercialName="UPGRADE WITH MILES BONUS" Id="27" ServiceGroup="UP" ServiceType="F" SubCode="0NI" Vendor="ATP"/>
    <BrandFeature Application="C" CommercialName="UPGRADE AT CHECKIN TO BUSINESS" Id="28" ServiceGroup="UP" ServiceType="F" SubCode="UPF" Vendor="ATP"/>
  </BrandFeatures>
  <PricedItineraries>
    <PricedItinerary SequenceNumber="1">
      <AirItinerary DirectionInd="Return">
        <OriginDestinationOptions>
          <OriginDestinationOption ArrivalCountry="RU" DepartureCountry="RU" ElapsedTime="315">
            <FlightSegment ArrivalDateTime="2020-09-01T06:25:00" DepartureDateTime="2020-09-01T05:00:00" ElapsedTime="85" FlightNumber="35" ResBookDesigCode="N" StopQuantity="0">
              <DepartureAirport LocationCode="LED" TerminalID="1"/>
              <ArrivalAirport LocationCode="SVO" TerminalID="B"/>
              <OperatingAirline Code="SU" FlightNumber="35"/>
              <Equipment AirEquipType="320"/>
              <MarketingAirline Code="SU"/>
              <MarriageGrp>O</MarriageGrp>
              <DepartureTimeZone GMTOffset="3"/>
              <ArrivalTimeZone GMTOffset="3"/>
              <TPA_Extensions>
                <eTicket Ind="true"/>
                <Mileage Amount="372"/>
              </TPA_Extensions>
            </FlightSegment>
            <FlightSegment ArrivalDateTime="2020-09-01T10:15:00" DepartureDateTime="2020-09-01T07:40:00" ElapsedTime="155" FlightNumber="1138" ResBookDesigCode="N" StopQuantity="0">
              <DepartureAirport LocationCode="SVO" TerminalID="B"/>
              <ArrivalAirport LocationCode="AER"/>
              <OperatingAirline Code="SU" FlightNumber="1138"/>
              <Equipment AirEquipType="73H"/>
              <MarketingAirline Code="SU"/>
              <MarriageGrp>I</MarriageGrp>
              <DepartureTimeZone GMTOffset="3"/>
              <ArrivalTimeZone GMTOffset="3"/>
              <TPA_Extensions>
                <eTicket Ind="true"/>
                <Mileage Amount="873"/>
              </TPA_Extensions>
            </FlightSegment>
          </OriginDestinationOption>
          <OriginDestinationOption ArrivalCountry="RU" DepartureCountry="RU" ElapsedTime="345">
            <FlightSegment ArrivalDateTime="2020-09-08T08:45:00" DepartureDateTime="2020-09-08T06:20:00" ElapsedTime="145" FlightNumber="1141" ResBookDesigCode="T" StopQuantity="0">
              <DepartureAirport LocationCode="AER"/>
              <ArrivalAirport LocationCode="SVO" TerminalID="B"/>
              <OperatingAirline Code="SU" FlightNumber="1141"/>
              <Equipment AirEquipType="32A"/>
              <MarketingAirline Code="SU"/>
              <MarriageGrp>O</MarriageGrp>
              <DepartureTimeZone GMTOffset="3"/>
              <ArrivalTimeZone GMTOffset="3"/>
              <TPA_Extensions>
                <eTicket Ind="true"/>
                <Mileage Amount="873"/>
              </TPA_Extensions>
            </FlightSegment>
            <FlightSegment ArrivalDateTime="2020-09-08T12:05:00" DepartureDateTime="2020-09-08T10:40:00" ElapsedTime="85" FlightNumber="14" ResBookDesigCode="T" StopQuantity="0">
              <DepartureAirport LocationCode="SVO" TerminalID="B"/>
              <ArrivalAirport LocationCode="LED" TerminalID="1"/>
              <OperatingAirline Code="SU" FlightNumber="14"/>
              <Equipment AirEquipType="320"/>
              <MarketingAirline Code="SU"/>
              <MarriageGrp>I</MarriageGrp>
              <DepartureTimeZone GMTOffset="3"/>
              <ArrivalTimeZone GMTOffset="3"/>
              <TPA_Extensions>
                <eTicket Ind="true"/>
                <Mileage Amount="372"/>
              </TPA_Extensions>
            </FlightSegment>
          </OriginDestinationOption>
        </OriginDestinationOptions>
      </AirItinerary>
      <AirItineraryPricingInfo BrandsOnAnyMarket="true" FareReturned="true" LastTicketDate="2020-05-31" LastTicketTime="23:59" PricingSource="WPNI1_ITIN" PricingSubSource="MIP">
        <ItinTotalFare>
          <BaseFare Amount="39465" CurrencyCode="RUB" DecimalPlaces="0"/>
          <FareConstruction Amount="39463" CurrencyCode="RUB" DecimalPlaces="0"/>
          <EquivFare Amount="39465" CurrencyCode="RUB" DecimalPlaces="0"/>
          <Taxes>
            <Tax Amount="24470" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="TOTALTAX"/>
          </Taxes>
          <TotalFare Amount="63935" CurrencyCode="RUB" DecimalPlaces="0"/>
        </ItinTotalFare>
        <PTC_FareBreakdowns>
          <PTC_FareBreakdown>
            <PassengerTypeQuantity Code="ADT" Quantity="2"/>
            <FareBasisCodes>
              <FareBasisCode ArrivalAirportCode="SVO" BookingCode="N" DepartureAirportCode="LED" FareComponentBeginAirport="LED" FareComponentDirectionality="FROM" FareComponentEndAirport="AER" FareComponentFareRule="ECR1" FareComponentFareTariff="304" FareComponentFareType="XEX" FareComponentFareTypeBitmap="00" FareComponentVendorCode="ATP" GovCarrier="SU">NCLR</FareBasisCode>
              <FareBasisCode ArrivalAirportCode="AER" AvailabilityBreak="true" BookingCode="N" DepartureAirportCode="SVO" GovCarrier="SU">NCLR</FareBasisCode>
              <FareBasisCode ArrivalAirportCode="SVO" BookingCode="T" DepartureAirportCode="AER" FareComponentBeginAirport="AER" FareComponentDirectionality="TO" FareComponentEndAirport="LED" FareComponentFareRule="ECR1" FareComponentFareTariff="304" FareComponentFareType="XEX" FareComponentFareTypeBitmap="00" FareComponentVendorCode="ATP" GovCarrier="SU">TCLR</FareBasisCode>
              <FareBasisCode ArrivalAirportCode="LED" AvailabilityBreak="true" BookingCode="T" DepartureAirportCode="SVO" GovCarrier="SU">TCLR</FareBasisCode>
            </FareBasisCodes>
            <PassengerFare>
              <BaseFare Amount="14350" CurrencyCode="RUB"/>
              <FareConstruction Amount="14350" CurrencyCode="RUB" DecimalPlaces="0"/>
              <EquivFare Amount="14350" CurrencyCode="RUB" DecimalPlaces="0"/>
              <Taxes>
                <Tax Amount="1500" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                <Tax Amount="1500" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                <Tax Amount="1500" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                <Tax Amount="1500" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                <Tax Amount="270" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRF"/>
                <Tax Amount="270" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRF"/>
                <Tax Amount="270" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRF"/>
                <Tax Amount="270" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRF"/>
                <Tax Amount="158" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                <Tax Amount="184" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                <Tax Amount="120" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                <Tax Amount="184" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                <Tax Amount="158" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI4"/>
                <Tax Amount="184" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI4"/>
                <Tax Amount="120" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI4"/>
                <Tax Amount="184" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI4"/>
                <TaxSummary Amount="6000" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                <TaxSummary Amount="1080" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRF"/>
                <TaxSummary Amount="1292" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                <TotalTax Amount="8372" CurrencyCode="RUB" DecimalPlaces="0"/>
              </Taxes>
              <TotalFare Amount="22722" CurrencyCode="RUB"/>
              <PenaltiesInfo>
                <Penalty Amount="2600" Applicability="Before" Changeable="true" ConditionsApply="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                <Penalty Amount="2600" Applicability="After" Changeable="true" ConditionsApply="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                <Penalty Amount="2600" Applicability="Before" ConditionsApply="true" CurrencyCode="RUB" DecimalPlaces="0" Refundable="true" Type="Refund"/>
                <Penalty Amount="5200" Applicability="After" Cat16Info="true" CurrencyCode="RUB" DecimalPlaces="0" Refundable="true" Type="Refund"/>
              </PenaltiesInfo>
              <TPA_Extensions>
                <FareComponents>
                  <FareComponent BrandID="EC" BrandName="ECONOMY CLASSIC" ProgramCode="CFF1S" ProgramDescription="1S" ProgramID="85965" ProgramSystemCode="X">
                    <Segment FlightIndex="1" LegIndex="1"/>
                    <Segment FlightIndex="2" LegIndex="1"/>
                    <BrandFeatureRef FeatureId="3"/>
                    <BrandFeatureRef FeatureId="8"/>
                    <BrandFeatureRef FeatureId="9"/>
                    <BrandFeatureRef FeatureId="10"/>
                    <BrandFeatureRef FeatureId="6"/>
                    <BrandFeatureRef FeatureId="4"/>
                    <BrandFeatureRef FeatureId="5"/>
                    <BrandFeatureRef FeatureId="11"/>
                    <BrandFeatureRef FeatureId="2"/>
                    <BrandFeatureRef FeatureId="7"/>
                    <BrandFeatureRef FeatureId="14"/>
                    <BrandFeatureRef FeatureId="13"/>
                    <BrandFeatureRef FeatureId="12"/>
                    <BrandFeatureRef FeatureId="16"/>
                    <BrandFeatureRef FeatureId="15"/>
                    <BrandFeatureRef FeatureId="1"/>
                    <BrandFeatureRef FeatureId="20"/>
                    <BrandFeatureRef FeatureId="21"/>
                    <BrandFeatureRef FeatureId="19"/>
                    <BrandFeatureRef FeatureId="18"/>
                    <BrandFeatureRef FeatureId="17"/>
                    <BrandFeatureRef FeatureId="22"/>
                    <BrandFeatureRef FeatureId="23"/>
                    <BrandFeatureRef FeatureId="25"/>
                    <BrandFeatureRef FeatureId="26"/>
                    <BrandFeatureRef FeatureId="24"/>
                    <BrandFeatureRef FeatureId="27"/>
                    <BrandFeatureRef FeatureId="28"/>
                  </FareComponent>
                  <FareComponent BrandID="EC" BrandName="ECONOMY CLASSIC" ProgramCode="CFF1S" ProgramDescription="1S" ProgramID="85965" ProgramSystemCode="X">
                    <Segment FlightIndex="1" LegIndex="2"/>
                    <Segment FlightIndex="2" LegIndex="2"/>
                    <BrandFeatureRef FeatureId="3"/>
                    <BrandFeatureRef FeatureId="8"/>
                    <BrandFeatureRef FeatureId="9"/>
                    <BrandFeatureRef FeatureId="10"/>
                    <BrandFeatureRef FeatureId="6"/>
                    <BrandFeatureRef FeatureId="4"/>
                    <BrandFeatureRef FeatureId="5"/>
                    <BrandFeatureRef FeatureId="11"/>
                    <BrandFeatureRef FeatureId="2"/>
                    <BrandFeatureRef FeatureId="7"/>
                    <BrandFeatureRef FeatureId="14"/>
                    <BrandFeatureRef FeatureId="13"/>
                    <BrandFeatureRef FeatureId="12"/>
                    <BrandFeatureRef FeatureId="16"/>
                    <BrandFeatureRef FeatureId="15"/>
                    <BrandFeatureRef FeatureId="1"/>
                    <BrandFeatureRef FeatureId="20"/>
                    <BrandFeatureRef FeatureId="21"/>
                    <BrandFeatureRef FeatureId="19"/>
                    <BrandFeatureRef FeatureId="18"/>
                    <BrandFeatureRef FeatureId="17"/>
                    <BrandFeatureRef FeatureId="22"/>
                    <BrandFeatureRef FeatureId="23"/>
                    <BrandFeatureRef FeatureId="25"/>
                    <BrandFeatureRef FeatureId="26"/>
                    <BrandFeatureRef FeatureId="24"/>
                    <BrandFeatureRef FeatureId="27"/>
                    <BrandFeatureRef FeatureId="28"/>
                  </FareComponent>
                </FareComponents>
                <Messages>
                  <Message FailCode="0" Info="VALIDATING CARRIER" Type="W"/>
                  <Message FailCode="0" Info="BSP - SU" Type="W"/>
                  <Message FailCode="0" Info="RUT - SU" Type="W"/>
                </Messages>
                <BaggageInformationList>
                  <BaggageInformation AirlineCode="SU" ProvisionType="A">
                    <Segment Id="0"/>
                    <Segment Id="1"/>
                    <Allowance Description1="UP TO 50 POUNDS/23 KILOGRAMS" Description2="UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS" Pieces="1"/>
                  </BaggageInformation>
                  <BaggageInformation AirlineCode="SU" ProvisionType="A">
                    <Segment Id="2"/>
                    <Segment Id="3"/>
                    <Allowance Description1="UP TO 50 POUNDS/23 KILOGRAMS" Description2="UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS" Pieces="1"/>
                  </BaggageInformation>
                </BaggageInformationList>
              </TPA_Extensions>
            </PassengerFare>
            <Endorsements NonRefundableIndicator="true"/>
            <TPA_Extensions>
              <FareCalcLine Info="LED SU X/MOW SU AER6000SU X/MOW SU LED8350RUB14350END"/>
            </TPA_Extensions>
            <FareInfos>
              <FareInfo>
                <FareReference>N</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="S"/>
                </TPA_Extensions>
              </FareInfo>
              <FareInfo>
                <FareReference>N</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="S"/>
                </TPA_Extensions>
              </FareInfo>
              <FareInfo>
                <FareReference>T</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="S"/>
                </TPA_Extensions>
              </FareInfo>
              <FareInfo>
                <FareReference>T</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="S"/>
                </TPA_Extensions>
              </FareInfo>
            </FareInfos>
          </PTC_FareBreakdown>
          <PTC_FareBreakdown>
            <PassengerTypeQuantity Code="CNN" Quantity="1"/>
            <FareBasisCodes>
              <FareBasisCode ArrivalAirportCode="SVO" BookingCode="N" DepartureAirportCode="LED" FareComponentBeginAirport="LED" FareComponentDirectionality="FROM" FareComponentEndAirport="AER" FareComponentFareRule="ECR1" FareComponentFareTariff="304" FareComponentFareType="XEX" FareComponentFareTypeBitmap="01" FareComponentVendorCode="ATP" GovCarrier="SU">NCLR/CH25</FareBasisCode>
              <FareBasisCode ArrivalAirportCode="AER" AvailabilityBreak="true" BookingCode="N" DepartureAirportCode="SVO" GovCarrier="SU">NCLR/CH25</FareBasisCode>
              <FareBasisCode ArrivalAirportCode="SVO" BookingCode="T" DepartureAirportCode="AER" FareComponentBeginAirport="AER" FareComponentDirectionality="TO" FareComponentEndAirport="LED" FareComponentFareRule="ECR1" FareComponentFareTariff="304" FareComponentFareType="XEX" FareComponentFareTypeBitmap="01" FareComponentVendorCode="ATP" GovCarrier="SU">TCLR/CH25</FareBasisCode>
              <FareBasisCode ArrivalAirportCode="LED" AvailabilityBreak="true" BookingCode="T" DepartureAirportCode="SVO" GovCarrier="SU">TCLR/CH25</FareBasisCode>
            </FareBasisCodes>
            <PassengerFare>
              <BaseFare Amount="10765" CurrencyCode="RUB"/>
              <FareConstruction Amount="10763" CurrencyCode="RUB" DecimalPlaces="0"/>
              <EquivFare Amount="10765" CurrencyCode="RUB" DecimalPlaces="0"/>
              <Taxes>
                <Tax Amount="1500" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                <Tax Amount="1500" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                <Tax Amount="1500" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                <Tax Amount="1500" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                <Tax Amount="270" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRF"/>
                <Tax Amount="270" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRF"/>
                <Tax Amount="270" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRF"/>
                <Tax Amount="270" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRF"/>
                <Tax Amount="79" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                <Tax Amount="92" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                <Tax Amount="60" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                <Tax Amount="92" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                <Tax Amount="79" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI4"/>
                <Tax Amount="92" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI4"/>
                <Tax Amount="60" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI4"/>
                <Tax Amount="92" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI4"/>
                <TaxSummary Amount="6000" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                <TaxSummary Amount="1080" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRF"/>
                <TaxSummary Amount="646" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                <TotalTax Amount="7726" CurrencyCode="RUB" DecimalPlaces="0"/>
              </Taxes>
              <TotalFare Amount="18491" CurrencyCode="RUB"/>
              <PenaltiesInfo>
                <Penalty Amount="2600" Applicability="Before" Changeable="true" ConditionsApply="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                <Penalty Amount="2600" Applicability="After" Changeable="true" ConditionsApply="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                <Penalty Amount="2600" Applicability="Before" ConditionsApply="true" CurrencyCode="RUB" DecimalPlaces="0" Refundable="true" Type="Refund"/>
                <Penalty Amount="5200" Applicability="After" Cat16Info="true" CurrencyCode="RUB" DecimalPlaces="0" Refundable="true" Type="Refund"/>
              </PenaltiesInfo>
              <TPA_Extensions>
                <FareComponents>
                  <FareComponent BrandID="EC" BrandName="ECONOMY CLASSIC" ProgramCode="CFF1S" ProgramDescription="1S" ProgramID="85965" ProgramSystemCode="X">
                    <Segment FlightIndex="1" LegIndex="1"/>
                    <Segment FlightIndex="2" LegIndex="1"/>
                    <BrandFeatureRef FeatureId="3"/>
                    <BrandFeatureRef FeatureId="8"/>
                    <BrandFeatureRef FeatureId="9"/>
                    <BrandFeatureRef FeatureId="10"/>
                    <BrandFeatureRef FeatureId="6"/>
                    <BrandFeatureRef FeatureId="4"/>
                    <BrandFeatureRef FeatureId="5"/>
                    <BrandFeatureRef FeatureId="11"/>
                    <BrandFeatureRef FeatureId="2"/>
                    <BrandFeatureRef FeatureId="7"/>
                    <BrandFeatureRef FeatureId="14"/>
                    <BrandFeatureRef FeatureId="13"/>
                    <BrandFeatureRef FeatureId="12"/>
                    <BrandFeatureRef FeatureId="16"/>
                    <BrandFeatureRef FeatureId="15"/>
                    <BrandFeatureRef FeatureId="1"/>
                    <BrandFeatureRef FeatureId="20"/>
                    <BrandFeatureRef FeatureId="21"/>
                    <BrandFeatureRef FeatureId="19"/>
                    <BrandFeatureRef FeatureId="18"/>
                    <BrandFeatureRef FeatureId="17"/>
                    <BrandFeatureRef FeatureId="22"/>
                    <BrandFeatureRef FeatureId="23"/>
                    <BrandFeatureRef FeatureId="25"/>
                    <BrandFeatureRef FeatureId="26"/>
                    <BrandFeatureRef FeatureId="24"/>
                    <BrandFeatureRef FeatureId="27"/>
                    <BrandFeatureRef FeatureId="28"/>
                  </FareComponent>
                  <FareComponent BrandID="EC" BrandName="ECONOMY CLASSIC" ProgramCode="CFF1S" ProgramDescription="1S" ProgramID="85965" ProgramSystemCode="X">
                    <Segment FlightIndex="1" LegIndex="2"/>
                    <Segment FlightIndex="2" LegIndex="2"/>
                    <BrandFeatureRef FeatureId="3"/>
                    <BrandFeatureRef FeatureId="8"/>
                    <BrandFeatureRef FeatureId="9"/>
                    <BrandFeatureRef FeatureId="10"/>
                    <BrandFeatureRef FeatureId="6"/>
                    <BrandFeatureRef FeatureId="4"/>
                    <BrandFeatureRef FeatureId="5"/>
                    <BrandFeatureRef FeatureId="11"/>
                    <BrandFeatureRef FeatureId="2"/>
                    <BrandFeatureRef FeatureId="7"/>
                    <BrandFeatureRef FeatureId="14"/>
                    <BrandFeatureRef FeatureId="13"/>
                    <BrandFeatureRef FeatureId="12"/>
                    <BrandFeatureRef FeatureId="16"/>
                    <BrandFeatureRef FeatureId="15"/>
                    <BrandFeatureRef FeatureId="1"/>
                    <BrandFeatureRef FeatureId="20"/>
                    <BrandFeatureRef FeatureId="21"/>
                    <BrandFeatureRef FeatureId="19"/>
                    <BrandFeatureRef FeatureId="18"/>
                    <BrandFeatureRef FeatureId="17"/>
                    <BrandFeatureRef FeatureId="22"/>
                    <BrandFeatureRef FeatureId="23"/>
                    <BrandFeatureRef FeatureId="25"/>
                    <BrandFeatureRef FeatureId="26"/>
                    <BrandFeatureRef FeatureId="24"/>
                    <BrandFeatureRef FeatureId="27"/>
                    <BrandFeatureRef FeatureId="28"/>
                  </FareComponent>
                </FareComponents>
                <Messages>
                  <Message FailCode="0" Info="EACH CNN REQUIRES ACCOMPANYING SAME CABIN ADT" Type="W"/>
                  <Message FailCode="0" Info="VALIDATING CARRIER" Type="W"/>
                  <Message FailCode="0" Info="BSP - SU" Type="W"/>
                  <Message FailCode="0" Info="RUT - SU" Type="W"/>
                </Messages>
                <BaggageInformationList>
                  <BaggageInformation AirlineCode="SU" ProvisionType="A">
                    <Segment Id="0"/>
                    <Segment Id="1"/>
                    <Allowance Description1="UP TO 50 POUNDS/23 KILOGRAMS" Description2="UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS" Pieces="1"/>
                  </BaggageInformation>
                  <BaggageInformation AirlineCode="SU" ProvisionType="A">
                    <Segment Id="2"/>
                    <Segment Id="3"/>
                    <Allowance Description1="UP TO 50 POUNDS/23 KILOGRAMS" Description2="UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS" Pieces="1"/>
                  </BaggageInformation>
                </BaggageInformationList>
              </TPA_Extensions>
            </PassengerFare>
            <Endorsements NonRefundableIndicator="true"/>
            <TPA_Extensions>
              <FareCalcLine Info="LED SU X/MOW SU AER4500SU X/MOW SU LED6263RUB10763END"/>
            </TPA_Extensions>
            <FareInfos>
              <FareInfo>
                <FareReference>N</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="S"/>
                </TPA_Extensions>
              </FareInfo>
              <FareInfo>
                <FareReference>N</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="S"/>
                </TPA_Extensions>
              </FareInfo>
              <FareInfo>
                <FareReference>T</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="S"/>
                </TPA_Extensions>
              </FareInfo>
              <FareInfo>
                <FareReference>T</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="S"/>
                </TPA_Extensions>
              </FareInfo>
            </FareInfos>
          </PTC_FareBreakdown>
          <PTC_FareBreakdown>
            <PassengerTypeQuantity Code="INF" Quantity="1"/>
            <FareBasisCodes>
              <FareBasisCode ArrivalAirportCode="SVO" BookingCode="N" DepartureAirportCode="LED" FareComponentBeginAirport="LED" FareComponentDirectionality="FROM" FareComponentEndAirport="AER" FareComponentFareRule="ECR1" FareComponentFareTariff="304" FareComponentFareType="XEX" FareComponentFareTypeBitmap="01" FareComponentVendorCode="ATP" GovCarrier="SU">NCLR/IN00</FareBasisCode>
              <FareBasisCode ArrivalAirportCode="AER" AvailabilityBreak="true" BookingCode="N" DepartureAirportCode="SVO" GovCarrier="SU">NCLR/IN00</FareBasisCode>
              <FareBasisCode ArrivalAirportCode="SVO" BookingCode="T" DepartureAirportCode="AER" FareComponentBeginAirport="AER" FareComponentDirectionality="TO" FareComponentEndAirport="LED" FareComponentFareRule="ECR1" FareComponentFareTariff="304" FareComponentFareType="XEX" FareComponentFareTypeBitmap="01" FareComponentVendorCode="ATP" GovCarrier="SU">TCLR/IN00</FareBasisCode>
              <FareBasisCode ArrivalAirportCode="LED" AvailabilityBreak="true" BookingCode="T" DepartureAirportCode="SVO" GovCarrier="SU">TCLR/IN00</FareBasisCode>
            </FareBasisCodes>
            <PassengerFare>
              <BaseFare Amount="0" CurrencyCode="RUB"/>
              <FareConstruction Amount="0" CurrencyCode="RUB" DecimalPlaces="0"/>
              <EquivFare Amount="0" CurrencyCode="RUB" DecimalPlaces="0"/>
              <TotalFare Amount="0" CurrencyCode="RUB"/>
              <PenaltiesInfo>
                <Penalty Amount="2600" Applicability="Before" Changeable="true" ConditionsApply="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                <Penalty Amount="2600" Applicability="After" Changeable="true" ConditionsApply="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                <Penalty Amount="2600" Applicability="Before" ConditionsApply="true" CurrencyCode="RUB" DecimalPlaces="0" Refundable="true" Type="Refund"/>
                <Penalty Amount="5200" Applicability="After" Cat16Info="true" CurrencyCode="RUB" DecimalPlaces="0" Refundable="true" Type="Refund"/>
              </PenaltiesInfo>
              <TPA_Extensions>
                <FareComponents>
                  <FareComponent BrandID="EC" BrandName="ECONOMY CLASSIC" ProgramCode="CFF1S" ProgramDescription="1S" ProgramID="85965" ProgramSystemCode="X">
                    <Segment FlightIndex="1" LegIndex="1"/>
                    <Segment FlightIndex="2" LegIndex="1"/>
                    <BrandFeatureRef FeatureId="3"/>
                    <BrandFeatureRef FeatureId="8"/>
                    <BrandFeatureRef FeatureId="9"/>
                    <BrandFeatureRef FeatureId="10"/>
                    <BrandFeatureRef FeatureId="6"/>
                    <BrandFeatureRef FeatureId="4"/>
                    <BrandFeatureRef FeatureId="5"/>
                    <BrandFeatureRef FeatureId="11"/>
                    <BrandFeatureRef FeatureId="2"/>
                    <BrandFeatureRef FeatureId="7"/>
                    <BrandFeatureRef FeatureId="14"/>
                    <BrandFeatureRef FeatureId="13"/>
                    <BrandFeatureRef FeatureId="12"/>
                    <BrandFeatureRef FeatureId="16"/>
                    <BrandFeatureRef FeatureId="15"/>
                    <BrandFeatureRef FeatureId="1"/>
                    <BrandFeatureRef FeatureId="20"/>
                    <BrandFeatureRef FeatureId="21"/>
                    <BrandFeatureRef FeatureId="19"/>
                    <BrandFeatureRef FeatureId="18"/>
                    <BrandFeatureRef FeatureId="17"/>
                    <BrandFeatureRef FeatureId="22"/>
                    <BrandFeatureRef FeatureId="23"/>
                    <BrandFeatureRef FeatureId="25"/>
                    <BrandFeatureRef FeatureId="26"/>
                    <BrandFeatureRef FeatureId="24"/>
                    <BrandFeatureRef FeatureId="27"/>
                    <BrandFeatureRef FeatureId="28"/>
                  </FareComponent>
                  <FareComponent BrandID="EC" BrandName="ECONOMY CLASSIC" ProgramCode="CFF1S" ProgramDescription="1S" ProgramID="85965" ProgramSystemCode="X">
                    <Segment FlightIndex="1" LegIndex="2"/>
                    <Segment FlightIndex="2" LegIndex="2"/>
                    <BrandFeatureRef FeatureId="3"/>
                    <BrandFeatureRef FeatureId="8"/>
                    <BrandFeatureRef FeatureId="9"/>
                    <BrandFeatureRef FeatureId="10"/>
                    <BrandFeatureRef FeatureId="6"/>
                    <BrandFeatureRef FeatureId="4"/>
                    <BrandFeatureRef FeatureId="5"/>
                    <BrandFeatureRef FeatureId="11"/>
                    <BrandFeatureRef FeatureId="2"/>
                    <BrandFeatureRef FeatureId="7"/>
                    <BrandFeatureRef FeatureId="14"/>
                    <BrandFeatureRef FeatureId="13"/>
                    <BrandFeatureRef FeatureId="12"/>
                    <BrandFeatureRef FeatureId="16"/>
                    <BrandFeatureRef FeatureId="15"/>
                    <BrandFeatureRef FeatureId="1"/>
                    <BrandFeatureRef FeatureId="20"/>
                    <BrandFeatureRef FeatureId="21"/>
                    <BrandFeatureRef FeatureId="19"/>
                    <BrandFeatureRef FeatureId="18"/>
                    <BrandFeatureRef FeatureId="17"/>
                    <BrandFeatureRef FeatureId="22"/>
                    <BrandFeatureRef FeatureId="23"/>
                    <BrandFeatureRef FeatureId="25"/>
                    <BrandFeatureRef FeatureId="26"/>
                    <BrandFeatureRef FeatureId="24"/>
                    <BrandFeatureRef FeatureId="27"/>
                    <BrandFeatureRef FeatureId="28"/>
                  </FareComponent>
                </FareComponents>
                <Messages>
                  <Message FailCode="0" Info="EACH INF REQUIRES ACCOMPANYING ADT PASSENGER" Type="W"/>
                  <Message FailCode="0" Info="VALIDATING CARRIER" Type="W"/>
                  <Message FailCode="0" Info="BSP - SU" Type="W"/>
                  <Message FailCode="0" Info="RUT - SU" Type="W"/>
                </Messages>
                <BaggageInformationList>
                  <BaggageInformation AirlineCode="SU" ProvisionType="A">
                    <Segment Id="0"/>
                    <Segment Id="1"/>
                    <Allowance Description1="UP TO 22 POUNDS/10 KILOGRAMS" Description2="UP TO 45 LINEAR INCHES/115 LINEAR CENTIMETERS" Pieces="1"/>
                  </BaggageInformation>
                  <BaggageInformation AirlineCode="SU" ProvisionType="A">
                    <Segment Id="2"/>
                    <Segment Id="3"/>
                    <Allowance Description1="UP TO 22 POUNDS/10 KILOGRAMS" Description2="UP TO 45 LINEAR INCHES/115 LINEAR CENTIMETERS" Pieces="1"/>
                  </BaggageInformation>
                </BaggageInformationList>
              </TPA_Extensions>
            </PassengerFare>
            <Endorsements NonRefundableIndicator="true"/>
            <TPA_Extensions>
              <FareCalcLine Info="LED SU X/MOW SU AER0SU X/MOW SU LED0RUB0END"/>
            </TPA_Extensions>
            <FareInfos>
              <FareInfo>
                <FareReference>N</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="S"/>
                </TPA_Extensions>
              </FareInfo>
              <FareInfo>
                <FareReference>N</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="S"/>
                </TPA_Extensions>
              </FareInfo>
              <FareInfo>
                <FareReference>T</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="S"/>
                </TPA_Extensions>
              </FareInfo>
              <FareInfo>
                <FareReference>T</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="S"/>
                </TPA_Extensions>
              </FareInfo>
            </FareInfos>
          </PTC_FareBreakdown>
        </PTC_FareBreakdowns>
        <FareInfos>
          <FareInfo>
            <FareReference>N</FareReference>
            <TPA_Extensions>
              <SeatsRemaining BelowMin="false" Number="9"/>
              <Cabin Cabin="Y"/>
              <Meal Code="S"/>
            </TPA_Extensions>
          </FareInfo>
          <FareInfo>
            <FareReference>N</FareReference>
            <TPA_Extensions>
              <SeatsRemaining BelowMin="false" Number="9"/>
              <Cabin Cabin="Y"/>
              <Meal Code="S"/>
            </TPA_Extensions>
          </FareInfo>
          <FareInfo>
            <FareReference>T</FareReference>
            <TPA_Extensions>
              <SeatsRemaining BelowMin="false" Number="9"/>
              <Cabin Cabin="Y"/>
              <Meal Code="S"/>
            </TPA_Extensions>
          </FareInfo>
          <FareInfo>
            <FareReference>T</FareReference>
            <TPA_Extensions>
              <SeatsRemaining BelowMin="false" Number="9"/>
              <Cabin Cabin="Y"/>
              <Meal Code="S"/>
            </TPA_Extensions>
          </FareInfo>
        </FareInfos>
        <TPA_Extensions>
          <DivideInParty Indicator="false"/>
          <ValidatingCarrier NewVcxProcess="true" SettlementMethod="BSP">
            <Default Code="SU"/>
          </ValidatingCarrier>
          <ValidatingCarrier NewVcxProcess="true" SettlementMethod="RUT">
            <Default Code="SU"/>
          </ValidatingCarrier>
        </TPA_Extensions>
      </AirItineraryPricingInfo>
      <TicketingInfo TicketType="eTicket" ValidInterline="Yes"/>
      <TPA_Extensions>
        <ValidatingCarrier Code="SU"/>
      </TPA_Extensions>
    </PricedItinerary>
  </PricedItineraries>
  <TPA_Extensions>
    <AirlineOrderList>
      <AirlineOrder Code="SU" SequenceNumber="1"/>
    </AirlineOrderList>
  </TPA_Extensions>
</OTA_AirLowFareSearchRS>
{% endxmlsec %}

---

{% xmlsec "Пример запроса (расчет по всем доступным брендам)", false %}
<OTA_AirLowFareSearchRQ ResponseType="OTA" Version="6.1.0" xmlns="http://www.opentravel.org/OTA/2003/05">
  <POS>
    <Source PseudoCityCode="9LSC">
      <RequestorID ID="1" Type="1">
        <CompanyName Code="TN"/>
      </RequestorID>
    </Source>
  </POS>
  <OriginDestinationInformation RPH="1">
    <DepartureDateTime>2020-09-01T05:00:00</DepartureDateTime>
    <OriginLocation LocationCode="LED"/>
    <DestinationLocation LocationCode="AER"/>
    <TPA_Extensions>
      <Flight ArrivalDateTime="2020-09-01T06:25:00" ClassOfService="Y" DepartureDateTime="2020-09-01T05:00:00" Number="35" Type="A">
        <OriginLocation LocationCode="LED"/>
        <DestinationLocation LocationCode="SVO"/>
        <Airline Marketing="SU" Operating="SU"/>
      </Flight>
      <Flight ArrivalDateTime="2020-09-01T10:15:00" ClassOfService="Y" DepartureDateTime="2020-09-01T07:45:00" Number="1138" Type="A">
        <OriginLocation LocationCode="SVO"/>
        <DestinationLocation LocationCode="AER"/>
        <Airline Marketing="SU" Operating="SU"/>
      </Flight>
    </TPA_Extensions>
  </OriginDestinationInformation>
  <OriginDestinationInformation RPH="2">
    <DepartureDateTime>2020-09-08T06:50:00</DepartureDateTime>
    <OriginLocation LocationCode="AER"/>
    <DestinationLocation LocationCode="LED"/>
    <TPA_Extensions>
      <Flight ArrivalDateTime="2020-09-08T09:20:00" ClassOfService="Y" DepartureDateTime="2020-09-08T06:50:00" Number="1141" Type="A">
        <OriginLocation LocationCode="AER"/>
        <DestinationLocation LocationCode="SVO"/>
        <Airline Marketing="SU" Operating="SU"/>
      </Flight>
      <Flight ArrivalDateTime="2020-09-08T12:20:00" ClassOfService="Y" DepartureDateTime="2020-09-08T10:55:00" Number="14" Type="A">
        <OriginLocation LocationCode="SVO"/>
        <DestinationLocation LocationCode="LED"/>
        <Airline Marketing="SU" Operating="SU"/>
      </Flight>
    </TPA_Extensions>
  </OriginDestinationInformation>
  <TravelPreferences>
    <TPA_Extensions>
      <VerificationItinCallLogic Value="L"/>
    </TPA_Extensions>
    <Baggage Description="true" RequestType="A"/>
  </TravelPreferences>
  <TravelerInfoSummary>
    <SeatsRequested>3</SeatsRequested>
    <AirTravelerAvail>
      <PassengerTypeQuantity Code="ADT" Quantity="2">
        <TPA_Extensions>
          <VoluntaryChanges Match="Info"/>
        </TPA_Extensions>
      </PassengerTypeQuantity>
      <PassengerTypeQuantity Code="CNN" Quantity="1">
        <TPA_Extensions>
          <VoluntaryChanges Match="Info"/>
        </TPA_Extensions>
      </PassengerTypeQuantity>
      <PassengerTypeQuantity Code="INF" Quantity="1">
        <TPA_Extensions>
          <VoluntaryChanges Match="Info"/>
        </TPA_Extensions>
      </PassengerTypeQuantity>
    </AirTravelerAvail>
    <PriceRequestInformation>
      <TPA_Extensions>
        <BrandedFareIndicators MultipleBrandedFares="true" ReturnBrandAncillaries="true"/>
      </TPA_Extensions>
    </PriceRequestInformation>
  </TravelerInfoSummary>
</OTA_AirLowFareSearchRQ>
{% endxmlsec %}

{% xmlsec "Пример ответа", false %}
<OTA_AirLowFareSearchRS AvailableItinCount="0" BrandedOneWayItinCount="0" DepartedItinCount="0" PricedItinCount="1" SimpleOneWayItinCount="0" SoldOutItinCount="0" Version="6.1.0" xmlns="http://www.opentravel.org/OTA/2003/05" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <Success/>
  <Warnings>
    <Warning Code="TRANSACTIONID" MessageClass="I" ShortText="7547665276685256335" Type="WORKERTHREAD"/>
    <Warning Code="ASE032LPSPIL7ED.IDM.SGDCPROD.SABRE.COM" MessageClass="I" ShortText="27041" Type="SERVER"/>
    <Warning Code="RULEID" MessageClass="I" ShortText="24113" Type="DRE"/>
    <Warning Code="RULEID" MessageClass="I" ShortText="24111" Type="DEFAULT"/>
  </Warnings>
  <BrandFeatures>
    <BrandFeature Application="F" CommercialName="BASIC SEAT" Id="1" ServiceGroup="BF" ServiceType="Z" SubCode="050" Vendor="ATP"/>
    <BrandFeature Application="C" CommercialName="BASIC SEAT" Id="2" ServiceGroup="BF" ServiceType="Z" SubCode="050" Vendor="ATP"/>
    <BrandFeature Application="F" CommercialName="CHANGEABLE TICKET" Id="3" ServiceGroup="BF" ServiceType="Z" SubCode="059" Vendor="ATP"/>
    <BrandFeature Application="C" CommercialName="CHANGEABLE TICKET" Id="4" ServiceGroup="BF" ServiceType="Z" SubCode="059" Vendor="ATP"/>
    <BrandFeature Application="N" CommercialName="25 PERCENT MILES EARNED" Id="5" ServiceGroup="BF" ServiceType="Z" SubCode="06A" Vendor="ATP"/>
    <BrandFeature Application="N" CommercialName="150 PERCENT MILES EARNED" Id="6" ServiceGroup="BF" ServiceType="Z" SubCode="06M" Vendor="ATP"/>
    <BrandFeature Application="F" CommercialName="150 PERCENT MILES EARNED" Id="7" ServiceGroup="BF" ServiceType="Z" SubCode="06M" Vendor="ATP"/>
    <BrandFeature Application="N" CommercialName="200 PERCENT MILES EARNED" Id="8" ServiceGroup="BF" ServiceType="Z" SubCode="06N" Vendor="ATP"/>
    <BrandFeature Application="N" CommercialName="125 MILES EARNED" Id="9" ServiceGroup="BF" ServiceType="Z" SubCode="06Y" Vendor="ATP"/>
    <BrandFeature Application="F" CommercialName="CHANGE IN CASE OF NO SHOW" Id="10" ServiceGroup="BF" ServiceType="Z" SubCode="CNS" Vendor="ATP"/>
    <BrandFeature Application="N" CommercialName="CHANGE IN CASE OF NO SHOW" Id="11" ServiceGroup="BF" ServiceType="Z" SubCode="CNS" Vendor="ATP"/>
    <BrandFeature Application="C" CommercialName="CHANGE IN CASE OF NO SHOW" Id="12" ServiceGroup="BF" ServiceType="Z" SubCode="CNS" Vendor="ATP"/>
    <BrandFeature Application="N" CommercialName="75 TO 125 PCNT MILES EARNED" Id="13" ServiceGroup="BF" ServiceType="Z" SubCode="ME1" Vendor="ATP"/>
    <BrandFeature Application="F" CommercialName="75 TO 125 PCNT MILES EARNED" Id="14" ServiceGroup="BF" ServiceType="Z" SubCode="ME1" Vendor="ATP"/>
    <BrandFeature Application="N" CommercialName="100 TO 150 PCNT MILES EARNED" Id="15" ServiceGroup="BF" ServiceType="Z" SubCode="ME2" Vendor="ATP"/>
    <BrandFeature Application="F" CommercialName="100 TO 150 PCNT MILES EARNED" Id="16" ServiceGroup="BF" ServiceType="Z" SubCode="ME2" Vendor="ATP"/>
    <BrandFeature Application="N" CommercialName="150 TO 200 PCNT MILES EARNED" Id="17" ServiceGroup="BF" ServiceType="Z" SubCode="ME3" Vendor="ATP"/>
    <BrandFeature Application="F" CommercialName="150 TO 200 PCNT MILES EARNED" Id="18" ServiceGroup="BF" ServiceType="Z" SubCode="ME3" Vendor="ATP"/>
    <BrandFeature Application="N" CommercialName="200 TO 250 PCNT MILES EARNED" Id="19" ServiceGroup="BF" ServiceType="Z" SubCode="ME4" Vendor="ATP"/>
    <BrandFeature Application="F" CommercialName="200 TO 250 PCNT MILES EARNED" Id="20" ServiceGroup="BF" ServiceType="Z" SubCode="ME4" Vendor="ATP"/>
    <BrandFeature Application="N" CommercialName="OPEN RETURN DATE" Id="21" ServiceGroup="BF" ServiceType="Z" SubCode="ORD" Vendor="ATP"/>
    <BrandFeature Application="F" CommercialName="OPEN RETURN DATE" Id="22" ServiceGroup="BF" ServiceType="Z" SubCode="ORD" Vendor="ATP"/>
    <BrandFeature Application="F" CommercialName="REFUND AFTER CHECKIN CLOSURE" Id="23" ServiceGroup="BF" ServiceType="Z" SubCode="RBA" Vendor="ATP"/>
    <BrandFeature Application="C" CommercialName="REFUND AFTER CHECKIN CLOSURE" Id="24" ServiceGroup="BF" ServiceType="Z" SubCode="RBA" Vendor="ATP"/>
    <BrandFeature Application="N" CommercialName="REFUND AFTER CHECKIN CLOSURE" Id="25" ServiceGroup="BF" ServiceType="Z" SubCode="RBA" Vendor="ATP"/>
    <BrandFeature Application="N" CommercialName="REFUND BEFORE CHECKIN CLOSURE" Id="26" ServiceGroup="BF" ServiceType="Z" SubCode="RBC" Vendor="ATP"/>
    <BrandFeature Application="C" CommercialName="REFUND BEFORE CHECKIN CLOSURE" Id="27" ServiceGroup="BF" ServiceType="Z" SubCode="RBC" Vendor="ATP"/>
    <BrandFeature Application="F" CommercialName="REFUND BEFORE CHECKIN CLOSURE" Id="28" ServiceGroup="BF" ServiceType="Z" SubCode="RBC" Vendor="ATP"/>
    <BrandFeature Application="N" CommercialName="STOPOVER" Id="29" ServiceGroup="BF" ServiceType="Z" SubCode="STO" Vendor="ATP"/>
    <BrandFeature Application="F" CommercialName="STOPOVER" Id="30" ServiceGroup="BF" ServiceType="Z" SubCode="STO" Vendor="ATP"/>
    <BrandFeature Application="N" CommercialName="UPGRADE AT CHECKIN TO COMFORT" Id="31" ServiceGroup="BF" ServiceType="Z" SubCode="UT2" Vendor="ATP"/>
    <BrandFeature Application="C" CommercialName="UPGRADE AT CHECKIN TO COMFORT" Id="32" ServiceGroup="BF" ServiceType="Z" SubCode="UT2" Vendor="ATP"/>
    <BrandFeature Application="F" CommercialName="SECOND EXCESS BAG" Id="33" ServiceGroup="BG" ServiceType="C" SubCode="0CD" Vendor="ATP"/>
    <BrandFeature Application="C" CommercialName="SECOND EXCESS BAG" Id="34" ServiceGroup="BG" ServiceType="C" SubCode="0CD" Vendor="ATP"/>
    <BrandFeature Application="F" CommercialName="UPTO70LB 32KG AND62LI 158LCM" Id="35" ServiceGroup="BG" ServiceType="C" SubCode="0FM" Vendor="ATP"/>
    <BrandFeature Application="N" CommercialName="UPTO70LB 32KG AND62LI 158LCM" Id="36" ServiceGroup="BG" ServiceType="C" SubCode="0FM" Vendor="ATP"/>
    <BrandFeature Application="F" CommercialName="UPTO50LB 23KG AND62LI 158LCM" Id="37" ServiceGroup="BG" ServiceType="C" SubCode="0GO" Vendor="ATP"/>
    <BrandFeature Application="N" CommercialName="UPTO50LB 23KG AND62LI 158LCM" Id="38" ServiceGroup="BG" ServiceType="C" SubCode="0GO" Vendor="ATP"/>
    <BrandFeature Application="C" CommercialName="UPTO50LB 23KG AND62LI 158LCM" Id="39" ServiceGroup="BG" ServiceType="C" SubCode="0GO" Vendor="ATP"/>
    <BrandFeature Application="N" CommercialName="CARRY10KG 22LBUPTO 55X40X25CM" Id="40" ServiceGroup="BG" ServiceType="C" SubCode="0MJ" Vendor="ATP"/>
    <BrandFeature Application="F" CommercialName="CARRY10KG 22LBUPTO 55X40X25CM" Id="41" ServiceGroup="BG" ServiceType="C" SubCode="0MJ" Vendor="ATP"/>
    <BrandFeature Application="N" CommercialName="CARRY15KG 33LBUPTO 55X40X25CM" Id="42" ServiceGroup="BG" ServiceType="C" SubCode="0MK" Vendor="ATP"/>
    <BrandFeature Application="F" CommercialName="CARRY15KG 33LBUPTO 55X40X25CM" Id="43" ServiceGroup="BG" ServiceType="C" SubCode="0MK" Vendor="ATP"/>
    <BrandFeature Application="C" CommercialName="INTERNET ACCESS" Id="44" ServiceGroup="IE" ServiceType="F" SubCode="0CL" Vendor="ATP"/>
    <BrandFeature Application="N" CommercialName="LOUNGE ACCESS" Id="45" ServiceGroup="LG" ServiceType="F" SubCode="0BX" Vendor="ATP"/>
    <BrandFeature Application="F" CommercialName="LOUNGE ACCESS" Id="46" ServiceGroup="LG" ServiceType="F" SubCode="0BX" Vendor="ATP"/>
    <BrandFeature Application="N" CommercialName="PRIORITY CHECK IN" Id="47" ServiceGroup="TS" ServiceType="F" SubCode="03P" Vendor="ATP"/>
    <BrandFeature Application="F" CommercialName="PRIORITY CHECK IN" Id="48" ServiceGroup="TS" ServiceType="F" SubCode="03P" Vendor="ATP"/>
    <BrandFeature Application="F" CommercialName="PRIORITY BOARDING" Id="49" ServiceGroup="TS" ServiceType="F" SubCode="0G6" Vendor="ATP"/>
    <BrandFeature Application="N" CommercialName="PRIORITY BOARDING" Id="50" ServiceGroup="TS" ServiceType="F" SubCode="0G6" Vendor="ATP"/>
    <BrandFeature Application="N" CommercialName="PRIORITY BAGGAGE" Id="51" ServiceGroup="TS" ServiceType="F" SubCode="0LF" Vendor="ATP"/>
    <BrandFeature Application="F" CommercialName="PRIORITY BAGGAGE" Id="52" ServiceGroup="TS" ServiceType="F" SubCode="0LF" Vendor="ATP"/>
    <BrandFeature Application="N" CommercialName="UPGRADE WITH MILES BONUS" Id="53" ServiceGroup="UP" ServiceType="F" SubCode="0NI" Vendor="ATP"/>
    <BrandFeature Application="F" CommercialName="UPGRADE WITH MILES BONUS" Id="54" ServiceGroup="UP" ServiceType="F" SubCode="0NI" Vendor="ATP"/>
    <BrandFeature Application="N" CommercialName="UPGRADE AT CHECKIN TO BUSINESS" Id="55" ServiceGroup="UP" ServiceType="F" SubCode="UPF" Vendor="ATP"/>
    <BrandFeature Application="C" CommercialName="UPGRADE AT CHECKIN TO BUSINESS" Id="56" ServiceGroup="UP" ServiceType="F" SubCode="UPF" Vendor="ATP"/>
  </BrandFeatures>
  <PricedItineraries>
    <PricedItinerary SequenceNumber="1">
      <AirItinerary DirectionInd="Return">
        <OriginDestinationOptions>
          <OriginDestinationOption ArrivalCountry="RU" DepartureCountry="RU" ElapsedTime="315">
            <FlightSegment ArrivalDateTime="2020-09-01T06:25:00" DepartureDateTime="2020-09-01T05:00:00" ElapsedTime="85" FlightNumber="35" ResBookDesigCode="N" StopQuantity="0">
              <DepartureAirport LocationCode="LED" TerminalID="1"/>
              <ArrivalAirport LocationCode="SVO" TerminalID="B"/>
              <OperatingAirline Code="SU" FlightNumber="35"/>
              <Equipment AirEquipType="320"/>
              <MarketingAirline Code="SU"/>
              <MarriageGrp>O</MarriageGrp>
              <DepartureTimeZone GMTOffset="3"/>
              <ArrivalTimeZone GMTOffset="3"/>
              <TPA_Extensions>
                <eTicket Ind="true"/>
                <Mileage Amount="372"/>
              </TPA_Extensions>
            </FlightSegment>
            <FlightSegment ArrivalDateTime="2020-09-01T10:15:00" DepartureDateTime="2020-09-01T07:40:00" ElapsedTime="155" FlightNumber="1138" ResBookDesigCode="N" StopQuantity="0">
              <DepartureAirport LocationCode="SVO" TerminalID="B"/>
              <ArrivalAirport LocationCode="AER"/>
              <OperatingAirline Code="SU" FlightNumber="1138"/>
              <Equipment AirEquipType="73H"/>
              <MarketingAirline Code="SU"/>
              <MarriageGrp>I</MarriageGrp>
              <DepartureTimeZone GMTOffset="3"/>
              <ArrivalTimeZone GMTOffset="3"/>
              <TPA_Extensions>
                <eTicket Ind="true"/>
                <Mileage Amount="873"/>
              </TPA_Extensions>
            </FlightSegment>
          </OriginDestinationOption>
          <OriginDestinationOption ArrivalCountry="RU" DepartureCountry="RU" ElapsedTime="345">
            <FlightSegment ArrivalDateTime="2020-09-08T08:45:00" DepartureDateTime="2020-09-08T06:20:00" ElapsedTime="145" FlightNumber="1141" ResBookDesigCode="T" StopQuantity="0">
              <DepartureAirport LocationCode="AER"/>
              <ArrivalAirport LocationCode="SVO" TerminalID="B"/>
              <OperatingAirline Code="SU" FlightNumber="1141"/>
              <Equipment AirEquipType="32A"/>
              <MarketingAirline Code="SU"/>
              <MarriageGrp>O</MarriageGrp>
              <DepartureTimeZone GMTOffset="3"/>
              <ArrivalTimeZone GMTOffset="3"/>
              <TPA_Extensions>
                <eTicket Ind="true"/>
                <Mileage Amount="873"/>
              </TPA_Extensions>
            </FlightSegment>
            <FlightSegment ArrivalDateTime="2020-09-08T12:05:00" DepartureDateTime="2020-09-08T10:40:00" ElapsedTime="85" FlightNumber="14" ResBookDesigCode="T" StopQuantity="0">
              <DepartureAirport LocationCode="SVO" TerminalID="B"/>
              <ArrivalAirport LocationCode="LED" TerminalID="1"/>
              <OperatingAirline Code="SU" FlightNumber="14"/>
              <Equipment AirEquipType="320"/>
              <MarketingAirline Code="SU"/>
              <MarriageGrp>I</MarriageGrp>
              <DepartureTimeZone GMTOffset="3"/>
              <ArrivalTimeZone GMTOffset="3"/>
              <TPA_Extensions>
                <eTicket Ind="true"/>
                <Mileage Amount="372"/>
              </TPA_Extensions>
            </FlightSegment>
          </OriginDestinationOption>
        </OriginDestinationOptions>
      </AirItinerary>
      <AirItineraryPricingInfo FareReturned="true" LastTicketDate="2020-05-31" LastTicketTime="23:59" PricingSource="WPNI1_ITIN" PricingSubSource="MIP">
        <ItinTotalFare>
          <BaseFare Amount="31215" CurrencyCode="RUB" DecimalPlaces="0"/>
          <FareConstruction Amount="31213" CurrencyCode="RUB" DecimalPlaces="0"/>
          <EquivFare Amount="31215" CurrencyCode="RUB" DecimalPlaces="0"/>
          <Taxes>
            <Tax Amount="24470" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="TOTALTAX"/>
          </Taxes>
          <TotalFare Amount="55685" CurrencyCode="RUB" DecimalPlaces="0"/>
        </ItinTotalFare>
        <PTC_FareBreakdowns>
          <PTC_FareBreakdown>
            <PassengerTypeQuantity Code="ADT" Quantity="2"/>
            <FareBasisCodes>
              <FareBasisCode ArrivalAirportCode="SVO" BookingCode="N" DepartureAirportCode="LED" FareComponentBeginAirport="LED" FareComponentDirectionality="FROM" FareComponentEndAirport="AER" FareComponentFareRule="ENR1" FareComponentFareTariff="304" FareComponentFareType="SB" FareComponentFareTypeBitmap="00" FareComponentVendorCode="ATP" GovCarrier="SU">NNBR</FareBasisCode>
              <FareBasisCode ArrivalAirportCode="AER" AvailabilityBreak="true" BookingCode="N" DepartureAirportCode="SVO" GovCarrier="SU">NNBR</FareBasisCode>
              <FareBasisCode ArrivalAirportCode="SVO" BookingCode="T" DepartureAirportCode="AER" FareComponentBeginAirport="AER" FareComponentDirectionality="TO" FareComponentEndAirport="LED" FareComponentFareRule="ENR1" FareComponentFareTariff="304" FareComponentFareType="SB" FareComponentFareTypeBitmap="00" FareComponentVendorCode="ATP" GovCarrier="SU">TNBR</FareBasisCode>
              <FareBasisCode ArrivalAirportCode="LED" AvailabilityBreak="true" BookingCode="T" DepartureAirportCode="SVO" GovCarrier="SU">TNBR</FareBasisCode>
            </FareBasisCodes>
            <PassengerFare>
              <BaseFare Amount="11350" CurrencyCode="RUB"/>
              <FareConstruction Amount="11350" CurrencyCode="RUB" DecimalPlaces="0"/>
              <EquivFare Amount="11350" CurrencyCode="RUB" DecimalPlaces="0"/>
              <Taxes>
                <Tax Amount="1500" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                <Tax Amount="1500" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                <Tax Amount="1500" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                <Tax Amount="1500" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                <Tax Amount="270" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRF"/>
                <Tax Amount="270" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRF"/>
                <Tax Amount="270" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRF"/>
                <Tax Amount="270" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRF"/>
                <Tax Amount="158" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                <Tax Amount="184" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                <Tax Amount="120" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                <Tax Amount="184" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                <Tax Amount="158" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI4"/>
                <Tax Amount="184" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI4"/>
                <Tax Amount="120" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI4"/>
                <Tax Amount="184" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI4"/>
                <TaxSummary Amount="6000" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                <TaxSummary Amount="1080" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRF"/>
                <TaxSummary Amount="1292" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                <TotalTax Amount="8372" CurrencyCode="RUB" DecimalPlaces="0"/>
              </Taxes>
              <TotalFare Amount="19722" CurrencyCode="RUB"/>
              <PenaltiesInfo>
                <Penalty Amount="2600" Applicability="Before" Changeable="true" ConditionsApply="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                <Penalty Amount="2600" Applicability="After" Changeable="true" ConditionsApply="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                <Penalty Applicability="Before" Refundable="false" Type="Refund"/>
                <Penalty Applicability="After" Refundable="false" Type="Refund"/>
              </PenaltiesInfo>
              <TPA_Extensions>
                <FareComponents>
                  <FareComponent BrandID="NB" BrandName="ECONOMY LITE" ProgramCode="CFF1S" ProgramDescription="1S" ProgramID="85965" ProgramSystemCode="X">
                    <Segment FlightIndex="1" LegIndex="1"/>
                    <Segment FlightIndex="2" LegIndex="1"/>
                    <BrandFeatureRef FeatureId="5"/>
                    <BrandFeatureRef FeatureId="14"/>
                    <BrandFeatureRef FeatureId="15"/>
                    <BrandFeatureRef FeatureId="17"/>
                    <BrandFeatureRef FeatureId="9"/>
                    <BrandFeatureRef FeatureId="6"/>
                    <BrandFeatureRef FeatureId="8"/>
                    <BrandFeatureRef FeatureId="19"/>
                    <BrandFeatureRef FeatureId="4"/>
                    <BrandFeatureRef FeatureId="11"/>
                    <BrandFeatureRef FeatureId="26"/>
                    <BrandFeatureRef FeatureId="25"/>
                    <BrandFeatureRef FeatureId="21"/>
                    <BrandFeatureRef FeatureId="32"/>
                    <BrandFeatureRef FeatureId="29"/>
                    <BrandFeatureRef FeatureId="2"/>
                    <BrandFeatureRef FeatureId="41"/>
                    <BrandFeatureRef FeatureId="42"/>
                    <BrandFeatureRef FeatureId="39"/>
                    <BrandFeatureRef FeatureId="36"/>
                    <BrandFeatureRef FeatureId="34"/>
                    <BrandFeatureRef FeatureId="44"/>
                    <BrandFeatureRef FeatureId="45"/>
                    <BrandFeatureRef FeatureId="50"/>
                    <BrandFeatureRef FeatureId="51"/>
                    <BrandFeatureRef FeatureId="47"/>
                    <BrandFeatureRef FeatureId="53"/>
                    <BrandFeatureRef FeatureId="56"/>
                  </FareComponent>
                  <FareComponent BrandID="NB" BrandName="ECONOMY LITE" ProgramCode="CFF1S" ProgramDescription="1S" ProgramID="85965" ProgramSystemCode="X">
                    <Segment FlightIndex="1" LegIndex="2"/>
                    <Segment FlightIndex="2" LegIndex="2"/>
                    <BrandFeatureRef FeatureId="5"/>
                    <BrandFeatureRef FeatureId="14"/>
                    <BrandFeatureRef FeatureId="15"/>
                    <BrandFeatureRef FeatureId="17"/>
                    <BrandFeatureRef FeatureId="9"/>
                    <BrandFeatureRef FeatureId="6"/>
                    <BrandFeatureRef FeatureId="8"/>
                    <BrandFeatureRef FeatureId="19"/>
                    <BrandFeatureRef FeatureId="4"/>
                    <BrandFeatureRef FeatureId="11"/>
                    <BrandFeatureRef FeatureId="26"/>
                    <BrandFeatureRef FeatureId="25"/>
                    <BrandFeatureRef FeatureId="21"/>
                    <BrandFeatureRef FeatureId="32"/>
                    <BrandFeatureRef FeatureId="29"/>
                    <BrandFeatureRef FeatureId="2"/>
                    <BrandFeatureRef FeatureId="41"/>
                    <BrandFeatureRef FeatureId="42"/>
                    <BrandFeatureRef FeatureId="39"/>
                    <BrandFeatureRef FeatureId="36"/>
                    <BrandFeatureRef FeatureId="34"/>
                    <BrandFeatureRef FeatureId="44"/>
                    <BrandFeatureRef FeatureId="45"/>
                    <BrandFeatureRef FeatureId="50"/>
                    <BrandFeatureRef FeatureId="51"/>
                    <BrandFeatureRef FeatureId="47"/>
                    <BrandFeatureRef FeatureId="53"/>
                    <BrandFeatureRef FeatureId="56"/>
                  </FareComponent>
                </FareComponents>
                <Messages>
                  <Message AirlineCode="SU" FailCode="0" Info="NONREF/HEBO3BPATEH" Type="N"/>
                  <Message FailCode="0" Info="VALIDATING CARRIER" Type="W"/>
                  <Message FailCode="0" Info="BSP - SU" Type="W"/>
                  <Message FailCode="0" Info="RUT - SU" Type="W"/>
                </Messages>
                <BaggageInformationList>
                  <BaggageInformation AirlineCode="SU" ProvisionType="A">
                    <Segment Id="0"/>
                    <Segment Id="1"/>
                    <Allowance Pieces="0"/>
                  </BaggageInformation>
                  <BaggageInformation AirlineCode="SU" ProvisionType="A">
                    <Segment Id="2"/>
                    <Segment Id="3"/>
                    <Allowance Pieces="0"/>
                  </BaggageInformation>
                </BaggageInformationList>
              </TPA_Extensions>
            </PassengerFare>
            <Endorsements NonRefundableIndicator="true"/>
            <TPA_Extensions>
              <FareCalcLine Info="LED SU X/MOW SU AER4500SU X/MOW SU LED6850RUB11350END"/>
            </TPA_Extensions>
            <FareInfos>
              <FareInfo>
                <FareReference>N</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="S"/>
                </TPA_Extensions>
              </FareInfo>
              <FareInfo>
                <FareReference>N</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="S"/>
                </TPA_Extensions>
              </FareInfo>
              <FareInfo>
                <FareReference>T</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="S"/>
                </TPA_Extensions>
              </FareInfo>
              <FareInfo>
                <FareReference>T</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="S"/>
                </TPA_Extensions>
              </FareInfo>
            </FareInfos>
          </PTC_FareBreakdown>
          <PTC_FareBreakdown>
            <PassengerTypeQuantity Code="CNN" Quantity="1"/>
            <FareBasisCodes>
              <FareBasisCode ArrivalAirportCode="SVO" BookingCode="N" DepartureAirportCode="LED" FareComponentBeginAirport="LED" FareComponentDirectionality="FROM" FareComponentEndAirport="AER" FareComponentFareRule="ENR1" FareComponentFareTariff="304" FareComponentFareType="SB" FareComponentFareTypeBitmap="01" FareComponentVendorCode="ATP" GovCarrier="SU">NNBR/CH25</FareBasisCode>
              <FareBasisCode ArrivalAirportCode="AER" AvailabilityBreak="true" BookingCode="N" DepartureAirportCode="SVO" GovCarrier="SU">NNBR/CH25</FareBasisCode>
              <FareBasisCode ArrivalAirportCode="SVO" BookingCode="T" DepartureAirportCode="AER" FareComponentBeginAirport="AER" FareComponentDirectionality="TO" FareComponentEndAirport="LED" FareComponentFareRule="ENR1" FareComponentFareTariff="304" FareComponentFareType="SB" FareComponentFareTypeBitmap="01" FareComponentVendorCode="ATP" GovCarrier="SU">TNBR/CH25</FareBasisCode>
              <FareBasisCode ArrivalAirportCode="LED" AvailabilityBreak="true" BookingCode="T" DepartureAirportCode="SVO" GovCarrier="SU">TNBR/CH25</FareBasisCode>
            </FareBasisCodes>
            <PassengerFare>
              <BaseFare Amount="8515" CurrencyCode="RUB"/>
              <FareConstruction Amount="8513" CurrencyCode="RUB" DecimalPlaces="0"/>
              <EquivFare Amount="8515" CurrencyCode="RUB" DecimalPlaces="0"/>
              <Taxes>
                <Tax Amount="1500" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                <Tax Amount="1500" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                <Tax Amount="1500" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                <Tax Amount="1500" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                <Tax Amount="270" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRF"/>
                <Tax Amount="270" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRF"/>
                <Tax Amount="270" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRF"/>
                <Tax Amount="270" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRF"/>
                <Tax Amount="79" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                <Tax Amount="92" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                <Tax Amount="60" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                <Tax Amount="92" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                <Tax Amount="79" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI4"/>
                <Tax Amount="92" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI4"/>
                <Tax Amount="60" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI4"/>
                <Tax Amount="92" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI4"/>
                <TaxSummary Amount="6000" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                <TaxSummary Amount="1080" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRF"/>
                <TaxSummary Amount="646" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                <TotalTax Amount="7726" CurrencyCode="RUB" DecimalPlaces="0"/>
              </Taxes>
              <TotalFare Amount="16241" CurrencyCode="RUB"/>
              <PenaltiesInfo>
                <Penalty Amount="2600" Applicability="Before" Changeable="true" ConditionsApply="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                <Penalty Amount="2600" Applicability="After" Changeable="true" ConditionsApply="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                <Penalty Applicability="Before" Refundable="false" Type="Refund"/>
                <Penalty Applicability="After" Refundable="false" Type="Refund"/>
              </PenaltiesInfo>
              <TPA_Extensions>
                <FareComponents>
                  <FareComponent BrandID="NB" BrandName="ECONOMY LITE" ProgramCode="CFF1S" ProgramDescription="1S" ProgramID="85965" ProgramSystemCode="X">
                    <Segment FlightIndex="1" LegIndex="1"/>
                    <Segment FlightIndex="2" LegIndex="1"/>
                    <BrandFeatureRef FeatureId="5"/>
                    <BrandFeatureRef FeatureId="14"/>
                    <BrandFeatureRef FeatureId="15"/>
                    <BrandFeatureRef FeatureId="17"/>
                    <BrandFeatureRef FeatureId="9"/>
                    <BrandFeatureRef FeatureId="6"/>
                    <BrandFeatureRef FeatureId="8"/>
                    <BrandFeatureRef FeatureId="19"/>
                    <BrandFeatureRef FeatureId="4"/>
                    <BrandFeatureRef FeatureId="11"/>
                    <BrandFeatureRef FeatureId="26"/>
                    <BrandFeatureRef FeatureId="25"/>
                    <BrandFeatureRef FeatureId="21"/>
                    <BrandFeatureRef FeatureId="32"/>
                    <BrandFeatureRef FeatureId="29"/>
                    <BrandFeatureRef FeatureId="2"/>
                    <BrandFeatureRef FeatureId="41"/>
                    <BrandFeatureRef FeatureId="42"/>
                    <BrandFeatureRef FeatureId="39"/>
                    <BrandFeatureRef FeatureId="36"/>
                    <BrandFeatureRef FeatureId="34"/>
                    <BrandFeatureRef FeatureId="44"/>
                    <BrandFeatureRef FeatureId="45"/>
                    <BrandFeatureRef FeatureId="50"/>
                    <BrandFeatureRef FeatureId="51"/>
                    <BrandFeatureRef FeatureId="47"/>
                    <BrandFeatureRef FeatureId="53"/>
                    <BrandFeatureRef FeatureId="56"/>
                  </FareComponent>
                  <FareComponent BrandID="NB" BrandName="ECONOMY LITE" ProgramCode="CFF1S" ProgramDescription="1S" ProgramID="85965" ProgramSystemCode="X">
                    <Segment FlightIndex="1" LegIndex="2"/>
                    <Segment FlightIndex="2" LegIndex="2"/>
                    <BrandFeatureRef FeatureId="5"/>
                    <BrandFeatureRef FeatureId="14"/>
                    <BrandFeatureRef FeatureId="15"/>
                    <BrandFeatureRef FeatureId="17"/>
                    <BrandFeatureRef FeatureId="9"/>
                    <BrandFeatureRef FeatureId="6"/>
                    <BrandFeatureRef FeatureId="8"/>
                    <BrandFeatureRef FeatureId="19"/>
                    <BrandFeatureRef FeatureId="4"/>
                    <BrandFeatureRef FeatureId="11"/>
                    <BrandFeatureRef FeatureId="26"/>
                    <BrandFeatureRef FeatureId="25"/>
                    <BrandFeatureRef FeatureId="21"/>
                    <BrandFeatureRef FeatureId="32"/>
                    <BrandFeatureRef FeatureId="29"/>
                    <BrandFeatureRef FeatureId="2"/>
                    <BrandFeatureRef FeatureId="41"/>
                    <BrandFeatureRef FeatureId="42"/>
                    <BrandFeatureRef FeatureId="39"/>
                    <BrandFeatureRef FeatureId="36"/>
                    <BrandFeatureRef FeatureId="34"/>
                    <BrandFeatureRef FeatureId="44"/>
                    <BrandFeatureRef FeatureId="45"/>
                    <BrandFeatureRef FeatureId="50"/>
                    <BrandFeatureRef FeatureId="51"/>
                    <BrandFeatureRef FeatureId="47"/>
                    <BrandFeatureRef FeatureId="53"/>
                    <BrandFeatureRef FeatureId="56"/>
                  </FareComponent>
                </FareComponents>
                <Messages>
                  <Message AirlineCode="SU" FailCode="0" Info="NONREF/HEBO3BPATEH" Type="N"/>
                  <Message FailCode="0" Info="EACH CNN REQUIRES ACCOMPANYING SAME CABIN ADT" Type="W"/>
                  <Message FailCode="0" Info="VALIDATING CARRIER" Type="W"/>
                  <Message FailCode="0" Info="BSP - SU" Type="W"/>
                  <Message FailCode="0" Info="RUT - SU" Type="W"/>
                </Messages>
                <BaggageInformationList>
                  <BaggageInformation AirlineCode="SU" ProvisionType="A">
                    <Segment Id="0"/>
                    <Segment Id="1"/>
                    <Allowance Pieces="0"/>
                  </BaggageInformation>
                  <BaggageInformation AirlineCode="SU" ProvisionType="A">
                    <Segment Id="2"/>
                    <Segment Id="3"/>
                    <Allowance Pieces="0"/>
                  </BaggageInformation>
                </BaggageInformationList>
              </TPA_Extensions>
            </PassengerFare>
            <Endorsements NonRefundableIndicator="true"/>
            <TPA_Extensions>
              <FareCalcLine Info="LED SU X/MOW SU AER3375SU X/MOW SU LED5138RUB8513END"/>
            </TPA_Extensions>
            <FareInfos>
              <FareInfo>
                <FareReference>N</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="S"/>
                </TPA_Extensions>
              </FareInfo>
              <FareInfo>
                <FareReference>N</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="S"/>
                </TPA_Extensions>
              </FareInfo>
              <FareInfo>
                <FareReference>T</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="S"/>
                </TPA_Extensions>
              </FareInfo>
              <FareInfo>
                <FareReference>T</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="S"/>
                </TPA_Extensions>
              </FareInfo>
            </FareInfos>
          </PTC_FareBreakdown>
          <PTC_FareBreakdown>
            <PassengerTypeQuantity Code="INF" Quantity="1"/>
            <FareBasisCodes>
              <FareBasisCode ArrivalAirportCode="SVO" BookingCode="N" DepartureAirportCode="LED" FareComponentBeginAirport="LED" FareComponentDirectionality="FROM" FareComponentEndAirport="AER" FareComponentFareRule="ENR1" FareComponentFareTariff="304" FareComponentFareType="SB" FareComponentFareTypeBitmap="01" FareComponentVendorCode="ATP" GovCarrier="SU">NNBR/IN00</FareBasisCode>
              <FareBasisCode ArrivalAirportCode="AER" AvailabilityBreak="true" BookingCode="N" DepartureAirportCode="SVO" GovCarrier="SU">NNBR/IN00</FareBasisCode>
              <FareBasisCode ArrivalAirportCode="SVO" BookingCode="T" DepartureAirportCode="AER" FareComponentBeginAirport="AER" FareComponentDirectionality="TO" FareComponentEndAirport="LED" FareComponentFareRule="ENR1" FareComponentFareTariff="304" FareComponentFareType="SB" FareComponentFareTypeBitmap="01" FareComponentVendorCode="ATP" GovCarrier="SU">TNBR/IN00</FareBasisCode>
              <FareBasisCode ArrivalAirportCode="LED" AvailabilityBreak="true" BookingCode="T" DepartureAirportCode="SVO" GovCarrier="SU">TNBR/IN00</FareBasisCode>
            </FareBasisCodes>
            <PassengerFare>
              <BaseFare Amount="0" CurrencyCode="RUB"/>
              <FareConstruction Amount="0" CurrencyCode="RUB" DecimalPlaces="0"/>
              <EquivFare Amount="0" CurrencyCode="RUB" DecimalPlaces="0"/>
              <TotalFare Amount="0" CurrencyCode="RUB"/>
              <PenaltiesInfo>
                <Penalty Amount="2600" Applicability="Before" Changeable="true" ConditionsApply="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                <Penalty Amount="2600" Applicability="After" Changeable="true" ConditionsApply="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                <Penalty Applicability="Before" Refundable="false" Type="Refund"/>
                <Penalty Applicability="After" Refundable="false" Type="Refund"/>
              </PenaltiesInfo>
              <TPA_Extensions>
                <FareComponents>
                  <FareComponent BrandID="NB" BrandName="ECONOMY LITE" ProgramCode="CFF1S" ProgramDescription="1S" ProgramID="85965" ProgramSystemCode="X">
                    <Segment FlightIndex="1" LegIndex="1"/>
                    <Segment FlightIndex="2" LegIndex="1"/>
                    <BrandFeatureRef FeatureId="5"/>
                    <BrandFeatureRef FeatureId="14"/>
                    <BrandFeatureRef FeatureId="15"/>
                    <BrandFeatureRef FeatureId="17"/>
                    <BrandFeatureRef FeatureId="9"/>
                    <BrandFeatureRef FeatureId="6"/>
                    <BrandFeatureRef FeatureId="8"/>
                    <BrandFeatureRef FeatureId="19"/>
                    <BrandFeatureRef FeatureId="4"/>
                    <BrandFeatureRef FeatureId="11"/>
                    <BrandFeatureRef FeatureId="26"/>
                    <BrandFeatureRef FeatureId="25"/>
                    <BrandFeatureRef FeatureId="21"/>
                    <BrandFeatureRef FeatureId="32"/>
                    <BrandFeatureRef FeatureId="29"/>
                    <BrandFeatureRef FeatureId="2"/>
                    <BrandFeatureRef FeatureId="41"/>
                    <BrandFeatureRef FeatureId="42"/>
                    <BrandFeatureRef FeatureId="39"/>
                    <BrandFeatureRef FeatureId="36"/>
                    <BrandFeatureRef FeatureId="34"/>
                    <BrandFeatureRef FeatureId="44"/>
                    <BrandFeatureRef FeatureId="45"/>
                    <BrandFeatureRef FeatureId="50"/>
                    <BrandFeatureRef FeatureId="51"/>
                    <BrandFeatureRef FeatureId="47"/>
                    <BrandFeatureRef FeatureId="53"/>
                    <BrandFeatureRef FeatureId="56"/>
                  </FareComponent>
                  <FareComponent BrandID="NB" BrandName="ECONOMY LITE" ProgramCode="CFF1S" ProgramDescription="1S" ProgramID="85965" ProgramSystemCode="X">
                    <Segment FlightIndex="1" LegIndex="2"/>
                    <Segment FlightIndex="2" LegIndex="2"/>
                    <BrandFeatureRef FeatureId="5"/>
                    <BrandFeatureRef FeatureId="14"/>
                    <BrandFeatureRef FeatureId="15"/>
                    <BrandFeatureRef FeatureId="17"/>
                    <BrandFeatureRef FeatureId="9"/>
                    <BrandFeatureRef FeatureId="6"/>
                    <BrandFeatureRef FeatureId="8"/>
                    <BrandFeatureRef FeatureId="19"/>
                    <BrandFeatureRef FeatureId="4"/>
                    <BrandFeatureRef FeatureId="11"/>
                    <BrandFeatureRef FeatureId="26"/>
                    <BrandFeatureRef FeatureId="25"/>
                    <BrandFeatureRef FeatureId="21"/>
                    <BrandFeatureRef FeatureId="32"/>
                    <BrandFeatureRef FeatureId="29"/>
                    <BrandFeatureRef FeatureId="2"/>
                    <BrandFeatureRef FeatureId="41"/>
                    <BrandFeatureRef FeatureId="42"/>
                    <BrandFeatureRef FeatureId="39"/>
                    <BrandFeatureRef FeatureId="36"/>
                    <BrandFeatureRef FeatureId="34"/>
                    <BrandFeatureRef FeatureId="44"/>
                    <BrandFeatureRef FeatureId="45"/>
                    <BrandFeatureRef FeatureId="50"/>
                    <BrandFeatureRef FeatureId="51"/>
                    <BrandFeatureRef FeatureId="47"/>
                    <BrandFeatureRef FeatureId="53"/>
                    <BrandFeatureRef FeatureId="56"/>
                  </FareComponent>
                </FareComponents>
                <Messages>
                  <Message AirlineCode="SU" FailCode="0" Info="NONREF/HEBO3BPATEH" Type="N"/>
                  <Message FailCode="0" Info="EACH INF REQUIRES ACCOMPANYING ADT PASSENGER" Type="W"/>
                  <Message FailCode="0" Info="VALIDATING CARRIER" Type="W"/>
                  <Message FailCode="0" Info="BSP - SU" Type="W"/>
                  <Message FailCode="0" Info="RUT - SU" Type="W"/>
                </Messages>
                <BaggageInformationList>
                  <BaggageInformation AirlineCode="SU" ProvisionType="A">
                    <Segment Id="0"/>
                    <Segment Id="1"/>
                    <Allowance Pieces="0"/>
                  </BaggageInformation>
                  <BaggageInformation AirlineCode="SU" ProvisionType="A">
                    <Segment Id="2"/>
                    <Segment Id="3"/>
                    <Allowance Pieces="0"/>
                  </BaggageInformation>
                </BaggageInformationList>
              </TPA_Extensions>
            </PassengerFare>
            <Endorsements NonRefundableIndicator="true"/>
            <TPA_Extensions>
              <FareCalcLine Info="LED SU X/MOW SU AER0SU X/MOW SU LED0RUB0END"/>
            </TPA_Extensions>
            <FareInfos>
              <FareInfo>
                <FareReference>N</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="S"/>
                </TPA_Extensions>
              </FareInfo>
              <FareInfo>
                <FareReference>N</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="S"/>
                </TPA_Extensions>
              </FareInfo>
              <FareInfo>
                <FareReference>T</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="S"/>
                </TPA_Extensions>
              </FareInfo>
              <FareInfo>
                <FareReference>T</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="S"/>
                </TPA_Extensions>
              </FareInfo>
            </FareInfos>
          </PTC_FareBreakdown>
        </PTC_FareBreakdowns>
        <FareInfos>
          <FareInfo>
            <FareReference>N</FareReference>
            <TPA_Extensions>
              <SeatsRemaining BelowMin="false" Number="9"/>
              <Cabin Cabin="Y"/>
              <Meal Code="S"/>
            </TPA_Extensions>
          </FareInfo>
          <FareInfo>
            <FareReference>N</FareReference>
            <TPA_Extensions>
              <SeatsRemaining BelowMin="false" Number="9"/>
              <Cabin Cabin="Y"/>
              <Meal Code="S"/>
            </TPA_Extensions>
          </FareInfo>
          <FareInfo>
            <FareReference>T</FareReference>
            <TPA_Extensions>
              <SeatsRemaining BelowMin="false" Number="9"/>
              <Cabin Cabin="Y"/>
              <Meal Code="S"/>
            </TPA_Extensions>
          </FareInfo>
          <FareInfo>
            <FareReference>T</FareReference>
            <TPA_Extensions>
              <SeatsRemaining BelowMin="false" Number="9"/>
              <Cabin Cabin="Y"/>
              <Meal Code="S"/>
            </TPA_Extensions>
          </FareInfo>
        </FareInfos>
        <TPA_Extensions>
          <DivideInParty Indicator="false"/>
          <ValidatingCarrier NewVcxProcess="true" SettlementMethod="BSP">
            <Default Code="SU"/>
          </ValidatingCarrier>
          <ValidatingCarrier NewVcxProcess="true" SettlementMethod="RUT">
            <Default Code="SU"/>
          </ValidatingCarrier>
        </TPA_Extensions>
      </AirItineraryPricingInfo>
      <TicketingInfo TicketType="eTicket" ValidInterline="Yes"/>
      <TPA_Extensions>
        <AdditionalFares>
          <AirItineraryPricingInfo FareReturned="true" LastTicketDate="2020-05-31" LastTicketTime="23:59" PricingSource="WPNI1_ITIN" PricingSubSource="MIP">
            <ItinTotalFare>
              <BaseFare Amount="39465" CurrencyCode="RUB" DecimalPlaces="0"/>
              <FareConstruction Amount="39463" CurrencyCode="RUB" DecimalPlaces="0"/>
              <EquivFare Amount="39465" CurrencyCode="RUB" DecimalPlaces="0"/>
              <Taxes>
                <Tax Amount="24470" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="TOTALTAX"/>
              </Taxes>
              <TotalFare Amount="63935" CurrencyCode="RUB" DecimalPlaces="0"/>
            </ItinTotalFare>
            <PTC_FareBreakdowns>
              <PTC_FareBreakdown>
                <PassengerTypeQuantity Code="ADT" Quantity="2"/>
                <FareBasisCodes>
                  <FareBasisCode ArrivalAirportCode="SVO" BookingCode="N" DepartureAirportCode="LED" FareComponentBeginAirport="LED" FareComponentDirectionality="FROM" FareComponentEndAirport="AER" FareComponentFareRule="ECR1" FareComponentFareTariff="304" FareComponentFareType="XEX" FareComponentFareTypeBitmap="00" FareComponentVendorCode="ATP" GovCarrier="SU">NCLR</FareBasisCode>
                  <FareBasisCode ArrivalAirportCode="AER" AvailabilityBreak="true" BookingCode="N" DepartureAirportCode="SVO" GovCarrier="SU">NCLR</FareBasisCode>
                  <FareBasisCode ArrivalAirportCode="SVO" BookingCode="T" DepartureAirportCode="AER" FareComponentBeginAirport="AER" FareComponentDirectionality="TO" FareComponentEndAirport="LED" FareComponentFareRule="ECR1" FareComponentFareTariff="304" FareComponentFareType="XEX" FareComponentFareTypeBitmap="00" FareComponentVendorCode="ATP" GovCarrier="SU">TCLR</FareBasisCode>
                  <FareBasisCode ArrivalAirportCode="LED" AvailabilityBreak="true" BookingCode="T" DepartureAirportCode="SVO" GovCarrier="SU">TCLR</FareBasisCode>
                </FareBasisCodes>
                <PassengerFare>
                  <BaseFare Amount="14350" CurrencyCode="RUB"/>
                  <FareConstruction Amount="14350" CurrencyCode="RUB" DecimalPlaces="0"/>
                  <EquivFare Amount="14350" CurrencyCode="RUB" DecimalPlaces="0"/>
                  <Taxes>
                    <Tax Amount="1500" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                    <Tax Amount="1500" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                    <Tax Amount="1500" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                    <Tax Amount="1500" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                    <Tax Amount="270" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRF"/>
                    <Tax Amount="270" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRF"/>
                    <Tax Amount="270" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRF"/>
                    <Tax Amount="270" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRF"/>
                    <Tax Amount="158" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                    <Tax Amount="184" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                    <Tax Amount="120" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                    <Tax Amount="184" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                    <Tax Amount="158" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI4"/>
                    <Tax Amount="184" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI4"/>
                    <Tax Amount="120" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI4"/>
                    <Tax Amount="184" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI4"/>
                    <TaxSummary Amount="6000" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                    <TaxSummary Amount="1080" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRF"/>
                    <TaxSummary Amount="1292" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                    <TotalTax Amount="8372" CurrencyCode="RUB" DecimalPlaces="0"/>
                  </Taxes>
                  <TotalFare Amount="22722" CurrencyCode="RUB"/>
                  <PenaltiesInfo>
                    <Penalty Amount="2600" Applicability="Before" Changeable="true" ConditionsApply="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                    <Penalty Amount="2600" Applicability="After" Changeable="true" ConditionsApply="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                    <Penalty Amount="2600" Applicability="Before" ConditionsApply="true" CurrencyCode="RUB" DecimalPlaces="0" Refundable="true" Type="Refund"/>
                    <Penalty Amount="5200" Applicability="After" Cat16Info="true" CurrencyCode="RUB" DecimalPlaces="0" Refundable="true" Type="Refund"/>
                  </PenaltiesInfo>
                  <TPA_Extensions>
                    <FareComponents>
                      <FareComponent BrandID="EC" BrandName="ECONOMY CLASSIC" ProgramCode="CFF1S" ProgramDescription="1S" ProgramID="85965" ProgramSystemCode="X">
                        <Segment FlightIndex="1" LegIndex="1"/>
                        <Segment FlightIndex="2" LegIndex="1"/>
                        <BrandFeatureRef FeatureId="5"/>
                        <BrandFeatureRef FeatureId="13"/>
                        <BrandFeatureRef FeatureId="16"/>
                        <BrandFeatureRef FeatureId="17"/>
                        <BrandFeatureRef FeatureId="9"/>
                        <BrandFeatureRef FeatureId="6"/>
                        <BrandFeatureRef FeatureId="8"/>
                        <BrandFeatureRef FeatureId="19"/>
                        <BrandFeatureRef FeatureId="4"/>
                        <BrandFeatureRef FeatureId="11"/>
                        <BrandFeatureRef FeatureId="27"/>
                        <BrandFeatureRef FeatureId="25"/>
                        <BrandFeatureRef FeatureId="21"/>
                        <BrandFeatureRef FeatureId="32"/>
                        <BrandFeatureRef FeatureId="30"/>
                        <BrandFeatureRef FeatureId="1"/>
                        <BrandFeatureRef FeatureId="41"/>
                        <BrandFeatureRef FeatureId="42"/>
                        <BrandFeatureRef FeatureId="37"/>
                        <BrandFeatureRef FeatureId="36"/>
                        <BrandFeatureRef FeatureId="34"/>
                        <BrandFeatureRef FeatureId="44"/>
                        <BrandFeatureRef FeatureId="45"/>
                        <BrandFeatureRef FeatureId="50"/>
                        <BrandFeatureRef FeatureId="51"/>
                        <BrandFeatureRef FeatureId="47"/>
                        <BrandFeatureRef FeatureId="53"/>
                        <BrandFeatureRef FeatureId="56"/>
                      </FareComponent>
                      <FareComponent BrandID="EC" BrandName="ECONOMY CLASSIC" ProgramCode="CFF1S" ProgramDescription="1S" ProgramID="85965" ProgramSystemCode="X">
                        <Segment FlightIndex="1" LegIndex="2"/>
                        <Segment FlightIndex="2" LegIndex="2"/>
                        <BrandFeatureRef FeatureId="5"/>
                        <BrandFeatureRef FeatureId="13"/>
                        <BrandFeatureRef FeatureId="16"/>
                        <BrandFeatureRef FeatureId="17"/>
                        <BrandFeatureRef FeatureId="9"/>
                        <BrandFeatureRef FeatureId="6"/>
                        <BrandFeatureRef FeatureId="8"/>
                        <BrandFeatureRef FeatureId="19"/>
                        <BrandFeatureRef FeatureId="4"/>
                        <BrandFeatureRef FeatureId="11"/>
                        <BrandFeatureRef FeatureId="27"/>
                        <BrandFeatureRef FeatureId="25"/>
                        <BrandFeatureRef FeatureId="21"/>
                        <BrandFeatureRef FeatureId="32"/>
                        <BrandFeatureRef FeatureId="30"/>
                        <BrandFeatureRef FeatureId="1"/>
                        <BrandFeatureRef FeatureId="41"/>
                        <BrandFeatureRef FeatureId="42"/>
                        <BrandFeatureRef FeatureId="37"/>
                        <BrandFeatureRef FeatureId="36"/>
                        <BrandFeatureRef FeatureId="34"/>
                        <BrandFeatureRef FeatureId="44"/>
                        <BrandFeatureRef FeatureId="45"/>
                        <BrandFeatureRef FeatureId="50"/>
                        <BrandFeatureRef FeatureId="51"/>
                        <BrandFeatureRef FeatureId="47"/>
                        <BrandFeatureRef FeatureId="53"/>
                        <BrandFeatureRef FeatureId="56"/>
                      </FareComponent>
                    </FareComponents>
                    <Messages>
                      <Message FailCode="0" Info="VALIDATING CARRIER" Type="W"/>
                      <Message FailCode="0" Info="BSP - SU" Type="W"/>
                      <Message FailCode="0" Info="RUT - SU" Type="W"/>
                    </Messages>
                    <BaggageInformationList>
                      <BaggageInformation AirlineCode="SU" ProvisionType="A">
                        <Segment Id="0"/>
                        <Segment Id="1"/>
                        <Allowance Description1="UP TO 50 POUNDS/23 KILOGRAMS" Description2="UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS" Pieces="1"/>
                      </BaggageInformation>
                      <BaggageInformation AirlineCode="SU" ProvisionType="A">
                        <Segment Id="2"/>
                        <Segment Id="3"/>
                        <Allowance Description1="UP TO 50 POUNDS/23 KILOGRAMS" Description2="UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS" Pieces="1"/>
                      </BaggageInformation>
                    </BaggageInformationList>
                  </TPA_Extensions>
                </PassengerFare>
                <Endorsements NonRefundableIndicator="true"/>
                <TPA_Extensions>
                  <FareCalcLine Info="LED SU X/MOW SU AER6000SU X/MOW SU LED8350RUB14350END"/>
                </TPA_Extensions>
                <FareInfos>
                  <FareInfo>
                    <FareReference>N</FareReference>
                    <TPA_Extensions>
                      <SeatsRemaining BelowMin="false" Number="9"/>
                      <Cabin Cabin="Y"/>
                      <Meal Code="S"/>
                    </TPA_Extensions>
                  </FareInfo>
                  <FareInfo>
                    <FareReference>N</FareReference>
                    <TPA_Extensions>
                      <SeatsRemaining BelowMin="false" Number="9"/>
                      <Cabin Cabin="Y"/>
                      <Meal Code="S"/>
                    </TPA_Extensions>
                  </FareInfo>
                  <FareInfo>
                    <FareReference>T</FareReference>
                    <TPA_Extensions>
                      <SeatsRemaining BelowMin="false" Number="9"/>
                      <Cabin Cabin="Y"/>
                      <Meal Code="S"/>
                    </TPA_Extensions>
                  </FareInfo>
                  <FareInfo>
                    <FareReference>T</FareReference>
                    <TPA_Extensions>
                      <SeatsRemaining BelowMin="false" Number="9"/>
                      <Cabin Cabin="Y"/>
                      <Meal Code="S"/>
                    </TPA_Extensions>
                  </FareInfo>
                </FareInfos>
              </PTC_FareBreakdown>
              <PTC_FareBreakdown>
                <PassengerTypeQuantity Code="CNN" Quantity="1"/>
                <FareBasisCodes>
                  <FareBasisCode ArrivalAirportCode="SVO" BookingCode="N" DepartureAirportCode="LED" FareComponentBeginAirport="LED" FareComponentDirectionality="FROM" FareComponentEndAirport="AER" FareComponentFareRule="ECR1" FareComponentFareTariff="304" FareComponentFareType="XEX" FareComponentFareTypeBitmap="01" FareComponentVendorCode="ATP" GovCarrier="SU">NCLR/CH25</FareBasisCode>
                  <FareBasisCode ArrivalAirportCode="AER" AvailabilityBreak="true" BookingCode="N" DepartureAirportCode="SVO" GovCarrier="SU">NCLR/CH25</FareBasisCode>
                  <FareBasisCode ArrivalAirportCode="SVO" BookingCode="T" DepartureAirportCode="AER" FareComponentBeginAirport="AER" FareComponentDirectionality="TO" FareComponentEndAirport="LED" FareComponentFareRule="ECR1" FareComponentFareTariff="304" FareComponentFareType="XEX" FareComponentFareTypeBitmap="01" FareComponentVendorCode="ATP" GovCarrier="SU">TCLR/CH25</FareBasisCode>
                  <FareBasisCode ArrivalAirportCode="LED" AvailabilityBreak="true" BookingCode="T" DepartureAirportCode="SVO" GovCarrier="SU">TCLR/CH25</FareBasisCode>
                </FareBasisCodes>
                <PassengerFare>
                  <BaseFare Amount="10765" CurrencyCode="RUB"/>
                  <FareConstruction Amount="10763" CurrencyCode="RUB" DecimalPlaces="0"/>
                  <EquivFare Amount="10765" CurrencyCode="RUB" DecimalPlaces="0"/>
                  <Taxes>
                    <Tax Amount="1500" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                    <Tax Amount="1500" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                    <Tax Amount="1500" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                    <Tax Amount="1500" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                    <Tax Amount="270" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRF"/>
                    <Tax Amount="270" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRF"/>
                    <Tax Amount="270" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRF"/>
                    <Tax Amount="270" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRF"/>
                    <Tax Amount="79" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                    <Tax Amount="92" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                    <Tax Amount="60" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                    <Tax Amount="92" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                    <Tax Amount="79" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI4"/>
                    <Tax Amount="92" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI4"/>
                    <Tax Amount="60" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI4"/>
                    <Tax Amount="92" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI4"/>
                    <TaxSummary Amount="6000" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                    <TaxSummary Amount="1080" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRF"/>
                    <TaxSummary Amount="646" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                    <TotalTax Amount="7726" CurrencyCode="RUB" DecimalPlaces="0"/>
                  </Taxes>
                  <TotalFare Amount="18491" CurrencyCode="RUB"/>
                  <PenaltiesInfo>
                    <Penalty Amount="2600" Applicability="Before" Changeable="true" ConditionsApply="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                    <Penalty Amount="2600" Applicability="After" Changeable="true" ConditionsApply="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                    <Penalty Amount="2600" Applicability="Before" ConditionsApply="true" CurrencyCode="RUB" DecimalPlaces="0" Refundable="true" Type="Refund"/>
                    <Penalty Amount="5200" Applicability="After" Cat16Info="true" CurrencyCode="RUB" DecimalPlaces="0" Refundable="true" Type="Refund"/>
                  </PenaltiesInfo>
                  <TPA_Extensions>
                    <FareComponents>
                      <FareComponent BrandID="EC" BrandName="ECONOMY CLASSIC" ProgramCode="CFF1S" ProgramDescription="1S" ProgramID="85965" ProgramSystemCode="X">
                        <Segment FlightIndex="1" LegIndex="1"/>
                        <Segment FlightIndex="2" LegIndex="1"/>
                        <BrandFeatureRef FeatureId="5"/>
                        <BrandFeatureRef FeatureId="13"/>
                        <BrandFeatureRef FeatureId="16"/>
                        <BrandFeatureRef FeatureId="17"/>
                        <BrandFeatureRef FeatureId="9"/>
                        <BrandFeatureRef FeatureId="6"/>
                        <BrandFeatureRef FeatureId="8"/>
                        <BrandFeatureRef FeatureId="19"/>
                        <BrandFeatureRef FeatureId="4"/>
                        <BrandFeatureRef FeatureId="11"/>
                        <BrandFeatureRef FeatureId="27"/>
                        <BrandFeatureRef FeatureId="25"/>
                        <BrandFeatureRef FeatureId="21"/>
                        <BrandFeatureRef FeatureId="32"/>
                        <BrandFeatureRef FeatureId="30"/>
                        <BrandFeatureRef FeatureId="1"/>
                        <BrandFeatureRef FeatureId="41"/>
                        <BrandFeatureRef FeatureId="42"/>
                        <BrandFeatureRef FeatureId="37"/>
                        <BrandFeatureRef FeatureId="36"/>
                        <BrandFeatureRef FeatureId="34"/>
                        <BrandFeatureRef FeatureId="44"/>
                        <BrandFeatureRef FeatureId="45"/>
                        <BrandFeatureRef FeatureId="50"/>
                        <BrandFeatureRef FeatureId="51"/>
                        <BrandFeatureRef FeatureId="47"/>
                        <BrandFeatureRef FeatureId="53"/>
                        <BrandFeatureRef FeatureId="56"/>
                      </FareComponent>
                      <FareComponent BrandID="EC" BrandName="ECONOMY CLASSIC" ProgramCode="CFF1S" ProgramDescription="1S" ProgramID="85965" ProgramSystemCode="X">
                        <Segment FlightIndex="1" LegIndex="2"/>
                        <Segment FlightIndex="2" LegIndex="2"/>
                        <BrandFeatureRef FeatureId="5"/>
                        <BrandFeatureRef FeatureId="13"/>
                        <BrandFeatureRef FeatureId="16"/>
                        <BrandFeatureRef FeatureId="17"/>
                        <BrandFeatureRef FeatureId="9"/>
                        <BrandFeatureRef FeatureId="6"/>
                        <BrandFeatureRef FeatureId="8"/>
                        <BrandFeatureRef FeatureId="19"/>
                        <BrandFeatureRef FeatureId="4"/>
                        <BrandFeatureRef FeatureId="11"/>
                        <BrandFeatureRef FeatureId="27"/>
                        <BrandFeatureRef FeatureId="25"/>
                        <BrandFeatureRef FeatureId="21"/>
                        <BrandFeatureRef FeatureId="32"/>
                        <BrandFeatureRef FeatureId="30"/>
                        <BrandFeatureRef FeatureId="1"/>
                        <BrandFeatureRef FeatureId="41"/>
                        <BrandFeatureRef FeatureId="42"/>
                        <BrandFeatureRef FeatureId="37"/>
                        <BrandFeatureRef FeatureId="36"/>
                        <BrandFeatureRef FeatureId="34"/>
                        <BrandFeatureRef FeatureId="44"/>
                        <BrandFeatureRef FeatureId="45"/>
                        <BrandFeatureRef FeatureId="50"/>
                        <BrandFeatureRef FeatureId="51"/>
                        <BrandFeatureRef FeatureId="47"/>
                        <BrandFeatureRef FeatureId="53"/>
                        <BrandFeatureRef FeatureId="56"/>
                      </FareComponent>
                    </FareComponents>
                    <Messages>
                      <Message FailCode="0" Info="EACH CNN REQUIRES ACCOMPANYING SAME CABIN ADT" Type="W"/>
                      <Message FailCode="0" Info="VALIDATING CARRIER" Type="W"/>
                      <Message FailCode="0" Info="BSP - SU" Type="W"/>
                      <Message FailCode="0" Info="RUT - SU" Type="W"/>
                    </Messages>
                    <BaggageInformationList>
                      <BaggageInformation AirlineCode="SU" ProvisionType="A">
                        <Segment Id="0"/>
                        <Segment Id="1"/>
                        <Allowance Description1="UP TO 50 POUNDS/23 KILOGRAMS" Description2="UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS" Pieces="1"/>
                      </BaggageInformation>
                      <BaggageInformation AirlineCode="SU" ProvisionType="A">
                        <Segment Id="2"/>
                        <Segment Id="3"/>
                        <Allowance Description1="UP TO 50 POUNDS/23 KILOGRAMS" Description2="UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS" Pieces="1"/>
                      </BaggageInformation>
                    </BaggageInformationList>
                  </TPA_Extensions>
                </PassengerFare>
                <Endorsements NonRefundableIndicator="true"/>
                <TPA_Extensions>
                  <FareCalcLine Info="LED SU X/MOW SU AER4500SU X/MOW SU LED6263RUB10763END"/>
                </TPA_Extensions>
                <FareInfos>
                  <FareInfo>
                    <FareReference>N</FareReference>
                    <TPA_Extensions>
                      <SeatsRemaining BelowMin="false" Number="9"/>
                      <Cabin Cabin="Y"/>
                      <Meal Code="S"/>
                    </TPA_Extensions>
                  </FareInfo>
                  <FareInfo>
                    <FareReference>N</FareReference>
                    <TPA_Extensions>
                      <SeatsRemaining BelowMin="false" Number="9"/>
                      <Cabin Cabin="Y"/>
                      <Meal Code="S"/>
                    </TPA_Extensions>
                  </FareInfo>
                  <FareInfo>
                    <FareReference>T</FareReference>
                    <TPA_Extensions>
                      <SeatsRemaining BelowMin="false" Number="9"/>
                      <Cabin Cabin="Y"/>
                      <Meal Code="S"/>
                    </TPA_Extensions>
                  </FareInfo>
                  <FareInfo>
                    <FareReference>T</FareReference>
                    <TPA_Extensions>
                      <SeatsRemaining BelowMin="false" Number="9"/>
                      <Cabin Cabin="Y"/>
                      <Meal Code="S"/>
                    </TPA_Extensions>
                  </FareInfo>
                </FareInfos>
              </PTC_FareBreakdown>
              <PTC_FareBreakdown>
                <PassengerTypeQuantity Code="INF" Quantity="1"/>
                <FareBasisCodes>
                  <FareBasisCode ArrivalAirportCode="SVO" BookingCode="N" DepartureAirportCode="LED" FareComponentBeginAirport="LED" FareComponentDirectionality="FROM" FareComponentEndAirport="AER" FareComponentFareRule="ECR1" FareComponentFareTariff="304" FareComponentFareType="XEX" FareComponentFareTypeBitmap="01" FareComponentVendorCode="ATP" GovCarrier="SU">NCLR/IN00</FareBasisCode>
                  <FareBasisCode ArrivalAirportCode="AER" AvailabilityBreak="true" BookingCode="N" DepartureAirportCode="SVO" GovCarrier="SU">NCLR/IN00</FareBasisCode>
                  <FareBasisCode ArrivalAirportCode="SVO" BookingCode="T" DepartureAirportCode="AER" FareComponentBeginAirport="AER" FareComponentDirectionality="TO" FareComponentEndAirport="LED" FareComponentFareRule="ECR1" FareComponentFareTariff="304" FareComponentFareType="XEX" FareComponentFareTypeBitmap="01" FareComponentVendorCode="ATP" GovCarrier="SU">TCLR/IN00</FareBasisCode>
                  <FareBasisCode ArrivalAirportCode="LED" AvailabilityBreak="true" BookingCode="T" DepartureAirportCode="SVO" GovCarrier="SU">TCLR/IN00</FareBasisCode>
                </FareBasisCodes>
                <PassengerFare>
                  <BaseFare Amount="0" CurrencyCode="RUB"/>
                  <FareConstruction Amount="0" CurrencyCode="RUB" DecimalPlaces="0"/>
                  <EquivFare Amount="0" CurrencyCode="RUB" DecimalPlaces="0"/>
                  <TotalFare Amount="0" CurrencyCode="RUB"/>
                  <PenaltiesInfo>
                    <Penalty Amount="2600" Applicability="Before" Changeable="true" ConditionsApply="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                    <Penalty Amount="2600" Applicability="After" Changeable="true" ConditionsApply="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                    <Penalty Amount="2600" Applicability="Before" ConditionsApply="true" CurrencyCode="RUB" DecimalPlaces="0" Refundable="true" Type="Refund"/>
                    <Penalty Amount="5200" Applicability="After" Cat16Info="true" CurrencyCode="RUB" DecimalPlaces="0" Refundable="true" Type="Refund"/>
                  </PenaltiesInfo>
                  <TPA_Extensions>
                    <FareComponents>
                      <FareComponent BrandID="EC" BrandName="ECONOMY CLASSIC" ProgramCode="CFF1S" ProgramDescription="1S" ProgramID="85965" ProgramSystemCode="X">
                        <Segment FlightIndex="1" LegIndex="1"/>
                        <Segment FlightIndex="2" LegIndex="1"/>
                        <BrandFeatureRef FeatureId="5"/>
                        <BrandFeatureRef FeatureId="13"/>
                        <BrandFeatureRef FeatureId="16"/>
                        <BrandFeatureRef FeatureId="17"/>
                        <BrandFeatureRef FeatureId="9"/>
                        <BrandFeatureRef FeatureId="6"/>
                        <BrandFeatureRef FeatureId="8"/>
                        <BrandFeatureRef FeatureId="19"/>
                        <BrandFeatureRef FeatureId="4"/>
                        <BrandFeatureRef FeatureId="11"/>
                        <BrandFeatureRef FeatureId="27"/>
                        <BrandFeatureRef FeatureId="25"/>
                        <BrandFeatureRef FeatureId="21"/>
                        <BrandFeatureRef FeatureId="32"/>
                        <BrandFeatureRef FeatureId="30"/>
                        <BrandFeatureRef FeatureId="1"/>
                        <BrandFeatureRef FeatureId="41"/>
                        <BrandFeatureRef FeatureId="42"/>
                        <BrandFeatureRef FeatureId="37"/>
                        <BrandFeatureRef FeatureId="36"/>
                        <BrandFeatureRef FeatureId="34"/>
                        <BrandFeatureRef FeatureId="44"/>
                        <BrandFeatureRef FeatureId="45"/>
                        <BrandFeatureRef FeatureId="50"/>
                        <BrandFeatureRef FeatureId="51"/>
                        <BrandFeatureRef FeatureId="47"/>
                        <BrandFeatureRef FeatureId="53"/>
                        <BrandFeatureRef FeatureId="56"/>
                      </FareComponent>
                      <FareComponent BrandID="EC" BrandName="ECONOMY CLASSIC" ProgramCode="CFF1S" ProgramDescription="1S" ProgramID="85965" ProgramSystemCode="X">
                        <Segment FlightIndex="1" LegIndex="2"/>
                        <Segment FlightIndex="2" LegIndex="2"/>
                        <BrandFeatureRef FeatureId="5"/>
                        <BrandFeatureRef FeatureId="13"/>
                        <BrandFeatureRef FeatureId="16"/>
                        <BrandFeatureRef FeatureId="17"/>
                        <BrandFeatureRef FeatureId="9"/>
                        <BrandFeatureRef FeatureId="6"/>
                        <BrandFeatureRef FeatureId="8"/>
                        <BrandFeatureRef FeatureId="19"/>
                        <BrandFeatureRef FeatureId="4"/>
                        <BrandFeatureRef FeatureId="11"/>
                        <BrandFeatureRef FeatureId="27"/>
                        <BrandFeatureRef FeatureId="25"/>
                        <BrandFeatureRef FeatureId="21"/>
                        <BrandFeatureRef FeatureId="32"/>
                        <BrandFeatureRef FeatureId="30"/>
                        <BrandFeatureRef FeatureId="1"/>
                        <BrandFeatureRef FeatureId="41"/>
                        <BrandFeatureRef FeatureId="42"/>
                        <BrandFeatureRef FeatureId="37"/>
                        <BrandFeatureRef FeatureId="36"/>
                        <BrandFeatureRef FeatureId="34"/>
                        <BrandFeatureRef FeatureId="44"/>
                        <BrandFeatureRef FeatureId="45"/>
                        <BrandFeatureRef FeatureId="50"/>
                        <BrandFeatureRef FeatureId="51"/>
                        <BrandFeatureRef FeatureId="47"/>
                        <BrandFeatureRef FeatureId="53"/>
                        <BrandFeatureRef FeatureId="56"/>
                      </FareComponent>
                    </FareComponents>
                    <Messages>
                      <Message FailCode="0" Info="EACH INF REQUIRES ACCOMPANYING ADT PASSENGER" Type="W"/>
                      <Message FailCode="0" Info="VALIDATING CARRIER" Type="W"/>
                      <Message FailCode="0" Info="BSP - SU" Type="W"/>
                      <Message FailCode="0" Info="RUT - SU" Type="W"/>
                    </Messages>
                    <BaggageInformationList>
                      <BaggageInformation AirlineCode="SU" ProvisionType="A">
                        <Segment Id="0"/>
                        <Segment Id="1"/>
                        <Allowance Description1="UP TO 22 POUNDS/10 KILOGRAMS" Description2="UP TO 45 LINEAR INCHES/115 LINEAR CENTIMETERS" Pieces="1"/>
                      </BaggageInformation>
                      <BaggageInformation AirlineCode="SU" ProvisionType="A">
                        <Segment Id="2"/>
                        <Segment Id="3"/>
                        <Allowance Description1="UP TO 22 POUNDS/10 KILOGRAMS" Description2="UP TO 45 LINEAR INCHES/115 LINEAR CENTIMETERS" Pieces="1"/>
                      </BaggageInformation>
                    </BaggageInformationList>
                  </TPA_Extensions>
                </PassengerFare>
                <Endorsements NonRefundableIndicator="true"/>
                <TPA_Extensions>
                  <FareCalcLine Info="LED SU X/MOW SU AER0SU X/MOW SU LED0RUB0END"/>
                </TPA_Extensions>
                <FareInfos>
                  <FareInfo>
                    <FareReference>N</FareReference>
                    <TPA_Extensions>
                      <SeatsRemaining BelowMin="false" Number="9"/>
                      <Cabin Cabin="Y"/>
                      <Meal Code="S"/>
                    </TPA_Extensions>
                  </FareInfo>
                  <FareInfo>
                    <FareReference>N</FareReference>
                    <TPA_Extensions>
                      <SeatsRemaining BelowMin="false" Number="9"/>
                      <Cabin Cabin="Y"/>
                      <Meal Code="S"/>
                    </TPA_Extensions>
                  </FareInfo>
                  <FareInfo>
                    <FareReference>T</FareReference>
                    <TPA_Extensions>
                      <SeatsRemaining BelowMin="false" Number="9"/>
                      <Cabin Cabin="Y"/>
                      <Meal Code="S"/>
                    </TPA_Extensions>
                  </FareInfo>
                  <FareInfo>
                    <FareReference>T</FareReference>
                    <TPA_Extensions>
                      <SeatsRemaining BelowMin="false" Number="9"/>
                      <Cabin Cabin="Y"/>
                      <Meal Code="S"/>
                    </TPA_Extensions>
                  </FareInfo>
                </FareInfos>
              </PTC_FareBreakdown>
            </PTC_FareBreakdowns>
            <FareInfos>
              <FareInfo>
                <FareReference>N</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="S"/>
                </TPA_Extensions>
              </FareInfo>
              <FareInfo>
                <FareReference>N</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="S"/>
                </TPA_Extensions>
              </FareInfo>
              <FareInfo>
                <FareReference>T</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="S"/>
                </TPA_Extensions>
              </FareInfo>
              <FareInfo>
                <FareReference>T</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="S"/>
                </TPA_Extensions>
              </FareInfo>
            </FareInfos>
            <TPA_Extensions>
              <DivideInParty Indicator="false"/>
              <ValidatingCarrier NewVcxProcess="true" SettlementMethod="BSP">
                <Default Code="SU"/>
              </ValidatingCarrier>
              <ValidatingCarrier NewVcxProcess="true" SettlementMethod="RUT">
                <Default Code="SU"/>
              </ValidatingCarrier>
            </TPA_Extensions>
          </AirItineraryPricingInfo>
          <TicketingInfo TicketType="eTicket" ValidInterline="Yes"/>
        </AdditionalFares>
        <AdditionalFares>
          <AirItineraryPricingInfo FareReturned="true" LastTicketDate="2020-05-31" LastTicketTime="23:59" PricingSource="WPNI1_ITIN" PricingSubSource="MIP">
            <ItinTotalFare>
              <BaseFare Amount="55965" CurrencyCode="RUB" DecimalPlaces="0"/>
              <FareConstruction Amount="55963" CurrencyCode="RUB" DecimalPlaces="0"/>
              <EquivFare Amount="55965" CurrencyCode="RUB" DecimalPlaces="0"/>
              <Taxes>
                <Tax Amount="24470" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="TOTALTAX"/>
              </Taxes>
              <TotalFare Amount="80435" CurrencyCode="RUB" DecimalPlaces="0"/>
            </ItinTotalFare>
            <PTC_FareBreakdowns>
              <PTC_FareBreakdown>
                <PassengerTypeQuantity Code="ADT" Quantity="2"/>
                <FareBasisCodes>
                  <FareBasisCode ArrivalAirportCode="SVO" BookingCode="N" DepartureAirportCode="LED" FareComponentBeginAirport="LED" FareComponentDirectionality="FROM" FareComponentEndAirport="AER" FareComponentFareRule="EFR1" FareComponentFareTariff="304" FareComponentFareType="EUP" FareComponentFareTypeBitmap="00" FareComponentVendorCode="ATP" GovCarrier="SU">NFMR</FareBasisCode>
                  <FareBasisCode ArrivalAirportCode="AER" AvailabilityBreak="true" BookingCode="N" DepartureAirportCode="SVO" GovCarrier="SU">NFMR</FareBasisCode>
                  <FareBasisCode ArrivalAirportCode="SVO" BookingCode="T" DepartureAirportCode="AER" FareComponentBeginAirport="AER" FareComponentDirectionality="TO" FareComponentEndAirport="LED" FareComponentFareRule="EFR1" FareComponentFareTariff="304" FareComponentFareType="EUP" FareComponentFareTypeBitmap="00" FareComponentVendorCode="ATP" GovCarrier="SU">TFMR</FareBasisCode>
                  <FareBasisCode ArrivalAirportCode="LED" AvailabilityBreak="true" BookingCode="T" DepartureAirportCode="SVO" GovCarrier="SU">TFMR</FareBasisCode>
                </FareBasisCodes>
                <PassengerFare>
                  <BaseFare Amount="20350" CurrencyCode="RUB"/>
                  <FareConstruction Amount="20350" CurrencyCode="RUB" DecimalPlaces="0"/>
                  <EquivFare Amount="20350" CurrencyCode="RUB" DecimalPlaces="0"/>
                  <Taxes>
                    <Tax Amount="1500" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                    <Tax Amount="1500" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                    <Tax Amount="1500" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                    <Tax Amount="1500" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                    <Tax Amount="270" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRF"/>
                    <Tax Amount="270" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRF"/>
                    <Tax Amount="270" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRF"/>
                    <Tax Amount="270" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRF"/>
                    <Tax Amount="158" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                    <Tax Amount="184" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                    <Tax Amount="120" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                    <Tax Amount="184" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                    <Tax Amount="158" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI4"/>
                    <Tax Amount="184" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI4"/>
                    <Tax Amount="120" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI4"/>
                    <Tax Amount="184" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI4"/>
                    <TaxSummary Amount="6000" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                    <TaxSummary Amount="1080" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRF"/>
                    <TaxSummary Amount="1292" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                    <TotalTax Amount="8372" CurrencyCode="RUB" DecimalPlaces="0"/>
                  </Taxes>
                  <TotalFare Amount="28722" CurrencyCode="RUB"/>
                  <PenaltiesInfo>
                    <Penalty Amount="0" Applicability="Before" Changeable="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                    <Penalty Amount="0" Applicability="After" Changeable="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                    <Penalty Amount="0" Applicability="Before" CurrencyCode="RUB" DecimalPlaces="0" Refundable="true" Type="Refund"/>
                    <Penalty Amount="0" Applicability="After" CurrencyCode="RUB" DecimalPlaces="0" Refundable="true" Type="Refund"/>
                  </PenaltiesInfo>
                  <TPA_Extensions>
                    <FareComponents>
                      <FareComponent BrandID="EL" BrandName="ECONOMY FLEX" ProgramCode="CFF1S" ProgramDescription="1S" ProgramID="85965" ProgramSystemCode="X">
                        <Segment FlightIndex="1" LegIndex="1"/>
                        <Segment FlightIndex="2" LegIndex="1"/>
                        <BrandFeatureRef FeatureId="5"/>
                        <BrandFeatureRef FeatureId="13"/>
                        <BrandFeatureRef FeatureId="15"/>
                        <BrandFeatureRef FeatureId="18"/>
                        <BrandFeatureRef FeatureId="9"/>
                        <BrandFeatureRef FeatureId="6"/>
                        <BrandFeatureRef FeatureId="8"/>
                        <BrandFeatureRef FeatureId="19"/>
                        <BrandFeatureRef FeatureId="3"/>
                        <BrandFeatureRef FeatureId="10"/>
                        <BrandFeatureRef FeatureId="28"/>
                        <BrandFeatureRef FeatureId="23"/>
                        <BrandFeatureRef FeatureId="22"/>
                        <BrandFeatureRef FeatureId="32"/>
                        <BrandFeatureRef FeatureId="30"/>
                        <BrandFeatureRef FeatureId="1"/>
                        <BrandFeatureRef FeatureId="41"/>
                        <BrandFeatureRef FeatureId="42"/>
                        <BrandFeatureRef FeatureId="37"/>
                        <BrandFeatureRef FeatureId="36"/>
                        <BrandFeatureRef FeatureId="33"/>
                        <BrandFeatureRef FeatureId="44"/>
                        <BrandFeatureRef FeatureId="45"/>
                        <BrandFeatureRef FeatureId="50"/>
                        <BrandFeatureRef FeatureId="51"/>
                        <BrandFeatureRef FeatureId="47"/>
                        <BrandFeatureRef FeatureId="54"/>
                        <BrandFeatureRef FeatureId="56"/>
                      </FareComponent>
                      <FareComponent BrandID="EL" BrandName="ECONOMY FLEX" ProgramCode="CFF1S" ProgramDescription="1S" ProgramID="85965" ProgramSystemCode="X">
                        <Segment FlightIndex="1" LegIndex="2"/>
                        <Segment FlightIndex="2" LegIndex="2"/>
                        <BrandFeatureRef FeatureId="5"/>
                        <BrandFeatureRef FeatureId="13"/>
                        <BrandFeatureRef FeatureId="15"/>
                        <BrandFeatureRef FeatureId="18"/>
                        <BrandFeatureRef FeatureId="9"/>
                        <BrandFeatureRef FeatureId="6"/>
                        <BrandFeatureRef FeatureId="8"/>
                        <BrandFeatureRef FeatureId="19"/>
                        <BrandFeatureRef FeatureId="3"/>
                        <BrandFeatureRef FeatureId="10"/>
                        <BrandFeatureRef FeatureId="28"/>
                        <BrandFeatureRef FeatureId="23"/>
                        <BrandFeatureRef FeatureId="22"/>
                        <BrandFeatureRef FeatureId="32"/>
                        <BrandFeatureRef FeatureId="30"/>
                        <BrandFeatureRef FeatureId="1"/>
                        <BrandFeatureRef FeatureId="41"/>
                        <BrandFeatureRef FeatureId="42"/>
                        <BrandFeatureRef FeatureId="37"/>
                        <BrandFeatureRef FeatureId="36"/>
                        <BrandFeatureRef FeatureId="33"/>
                        <BrandFeatureRef FeatureId="44"/>
                        <BrandFeatureRef FeatureId="45"/>
                        <BrandFeatureRef FeatureId="50"/>
                        <BrandFeatureRef FeatureId="51"/>
                        <BrandFeatureRef FeatureId="47"/>
                        <BrandFeatureRef FeatureId="54"/>
                        <BrandFeatureRef FeatureId="56"/>
                      </FareComponent>
                    </FareComponents>
                    <Messages>
                      <Message FailCode="0" Info="VALIDATING CARRIER" Type="W"/>
                      <Message FailCode="0" Info="BSP - SU" Type="W"/>
                      <Message FailCode="0" Info="RUT - SU" Type="W"/>
                    </Messages>
                    <BaggageInformationList>
                      <BaggageInformation AirlineCode="SU" ProvisionType="A">
                        <Segment Id="0"/>
                        <Segment Id="1"/>
                        <Allowance Description1="UP TO 50 POUNDS/23 KILOGRAMS" Description2="UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS" Pieces="2"/>
                      </BaggageInformation>
                      <BaggageInformation AirlineCode="SU" ProvisionType="A">
                        <Segment Id="2"/>
                        <Segment Id="3"/>
                        <Allowance Description1="UP TO 50 POUNDS/23 KILOGRAMS" Description2="UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS" Pieces="2"/>
                      </BaggageInformation>
                    </BaggageInformationList>
                  </TPA_Extensions>
                </PassengerFare>
                <Endorsements NonRefundableIndicator="false"/>
                <TPA_Extensions>
                  <FareCalcLine Info="LED SU X/MOW SU AER9000SU X/MOW SU LED11350RUB20350END"/>
                </TPA_Extensions>
                <FareInfos>
                  <FareInfo>
                    <FareReference>N</FareReference>
                    <TPA_Extensions>
                      <SeatsRemaining BelowMin="false" Number="9"/>
                      <Cabin Cabin="Y"/>
                      <Meal Code="S"/>
                    </TPA_Extensions>
                  </FareInfo>
                  <FareInfo>
                    <FareReference>N</FareReference>
                    <TPA_Extensions>
                      <SeatsRemaining BelowMin="false" Number="9"/>
                      <Cabin Cabin="Y"/>
                      <Meal Code="S"/>
                    </TPA_Extensions>
                  </FareInfo>
                  <FareInfo>
                    <FareReference>T</FareReference>
                    <TPA_Extensions>
                      <SeatsRemaining BelowMin="false" Number="9"/>
                      <Cabin Cabin="Y"/>
                      <Meal Code="S"/>
                    </TPA_Extensions>
                  </FareInfo>
                  <FareInfo>
                    <FareReference>T</FareReference>
                    <TPA_Extensions>
                      <SeatsRemaining BelowMin="false" Number="9"/>
                      <Cabin Cabin="Y"/>
                      <Meal Code="S"/>
                    </TPA_Extensions>
                  </FareInfo>
                </FareInfos>
              </PTC_FareBreakdown>
              <PTC_FareBreakdown>
                <PassengerTypeQuantity Code="CNN" Quantity="1"/>
                <FareBasisCodes>
                  <FareBasisCode ArrivalAirportCode="SVO" BookingCode="N" DepartureAirportCode="LED" FareComponentBeginAirport="LED" FareComponentDirectionality="FROM" FareComponentEndAirport="AER" FareComponentFareRule="EFR1" FareComponentFareTariff="304" FareComponentFareType="EUP" FareComponentFareTypeBitmap="01" FareComponentVendorCode="ATP" GovCarrier="SU">NFMR/CH25</FareBasisCode>
                  <FareBasisCode ArrivalAirportCode="AER" AvailabilityBreak="true" BookingCode="N" DepartureAirportCode="SVO" GovCarrier="SU">NFMR/CH25</FareBasisCode>
                  <FareBasisCode ArrivalAirportCode="SVO" BookingCode="T" DepartureAirportCode="AER" FareComponentBeginAirport="AER" FareComponentDirectionality="TO" FareComponentEndAirport="LED" FareComponentFareRule="EFR1" FareComponentFareTariff="304" FareComponentFareType="EUP" FareComponentFareTypeBitmap="01" FareComponentVendorCode="ATP" GovCarrier="SU">TFMR/CH25</FareBasisCode>
                  <FareBasisCode ArrivalAirportCode="LED" AvailabilityBreak="true" BookingCode="T" DepartureAirportCode="SVO" GovCarrier="SU">TFMR/CH25</FareBasisCode>
                </FareBasisCodes>
                <PassengerFare>
                  <BaseFare Amount="15265" CurrencyCode="RUB"/>
                  <FareConstruction Amount="15263" CurrencyCode="RUB" DecimalPlaces="0"/>
                  <EquivFare Amount="15265" CurrencyCode="RUB" DecimalPlaces="0"/>
                  <Taxes>
                    <Tax Amount="1500" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                    <Tax Amount="1500" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                    <Tax Amount="1500" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                    <Tax Amount="1500" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                    <Tax Amount="270" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRF"/>
                    <Tax Amount="270" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRF"/>
                    <Tax Amount="270" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRF"/>
                    <Tax Amount="270" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRF"/>
                    <Tax Amount="79" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                    <Tax Amount="92" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                    <Tax Amount="60" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                    <Tax Amount="92" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                    <Tax Amount="79" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI4"/>
                    <Tax Amount="92" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI4"/>
                    <Tax Amount="60" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI4"/>
                    <Tax Amount="92" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI4"/>
                    <TaxSummary Amount="6000" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                    <TaxSummary Amount="1080" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRF"/>
                    <TaxSummary Amount="646" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                    <TotalTax Amount="7726" CurrencyCode="RUB" DecimalPlaces="0"/>
                  </Taxes>
                  <TotalFare Amount="22991" CurrencyCode="RUB"/>
                  <PenaltiesInfo>
                    <Penalty Amount="0" Applicability="Before" Changeable="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                    <Penalty Amount="0" Applicability="After" Changeable="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                    <Penalty Amount="0" Applicability="Before" CurrencyCode="RUB" DecimalPlaces="0" Refundable="true" Type="Refund"/>
                    <Penalty Amount="0" Applicability="After" CurrencyCode="RUB" DecimalPlaces="0" Refundable="true" Type="Refund"/>
                  </PenaltiesInfo>
                  <TPA_Extensions>
                    <FareComponents>
                      <FareComponent BrandID="EL" BrandName="ECONOMY FLEX" ProgramCode="CFF1S" ProgramDescription="1S" ProgramID="85965" ProgramSystemCode="X">
                        <Segment FlightIndex="1" LegIndex="1"/>
                        <Segment FlightIndex="2" LegIndex="1"/>
                        <BrandFeatureRef FeatureId="5"/>
                        <BrandFeatureRef FeatureId="13"/>
                        <BrandFeatureRef FeatureId="15"/>
                        <BrandFeatureRef FeatureId="18"/>
                        <BrandFeatureRef FeatureId="9"/>
                        <BrandFeatureRef FeatureId="6"/>
                        <BrandFeatureRef FeatureId="8"/>
                        <BrandFeatureRef FeatureId="19"/>
                        <BrandFeatureRef FeatureId="3"/>
                        <BrandFeatureRef FeatureId="10"/>
                        <BrandFeatureRef FeatureId="28"/>
                        <BrandFeatureRef FeatureId="23"/>
                        <BrandFeatureRef FeatureId="22"/>
                        <BrandFeatureRef FeatureId="32"/>
                        <BrandFeatureRef FeatureId="30"/>
                        <BrandFeatureRef FeatureId="1"/>
                        <BrandFeatureRef FeatureId="41"/>
                        <BrandFeatureRef FeatureId="42"/>
                        <BrandFeatureRef FeatureId="37"/>
                        <BrandFeatureRef FeatureId="36"/>
                        <BrandFeatureRef FeatureId="33"/>
                        <BrandFeatureRef FeatureId="44"/>
                        <BrandFeatureRef FeatureId="45"/>
                        <BrandFeatureRef FeatureId="50"/>
                        <BrandFeatureRef FeatureId="51"/>
                        <BrandFeatureRef FeatureId="47"/>
                        <BrandFeatureRef FeatureId="54"/>
                        <BrandFeatureRef FeatureId="56"/>
                      </FareComponent>
                      <FareComponent BrandID="EL" BrandName="ECONOMY FLEX" ProgramCode="CFF1S" ProgramDescription="1S" ProgramID="85965" ProgramSystemCode="X">
                        <Segment FlightIndex="1" LegIndex="2"/>
                        <Segment FlightIndex="2" LegIndex="2"/>
                        <BrandFeatureRef FeatureId="5"/>
                        <BrandFeatureRef FeatureId="13"/>
                        <BrandFeatureRef FeatureId="15"/>
                        <BrandFeatureRef FeatureId="18"/>
                        <BrandFeatureRef FeatureId="9"/>
                        <BrandFeatureRef FeatureId="6"/>
                        <BrandFeatureRef FeatureId="8"/>
                        <BrandFeatureRef FeatureId="19"/>
                        <BrandFeatureRef FeatureId="3"/>
                        <BrandFeatureRef FeatureId="10"/>
                        <BrandFeatureRef FeatureId="28"/>
                        <BrandFeatureRef FeatureId="23"/>
                        <BrandFeatureRef FeatureId="22"/>
                        <BrandFeatureRef FeatureId="32"/>
                        <BrandFeatureRef FeatureId="30"/>
                        <BrandFeatureRef FeatureId="1"/>
                        <BrandFeatureRef FeatureId="41"/>
                        <BrandFeatureRef FeatureId="42"/>
                        <BrandFeatureRef FeatureId="37"/>
                        <BrandFeatureRef FeatureId="36"/>
                        <BrandFeatureRef FeatureId="33"/>
                        <BrandFeatureRef FeatureId="44"/>
                        <BrandFeatureRef FeatureId="45"/>
                        <BrandFeatureRef FeatureId="50"/>
                        <BrandFeatureRef FeatureId="51"/>
                        <BrandFeatureRef FeatureId="47"/>
                        <BrandFeatureRef FeatureId="54"/>
                        <BrandFeatureRef FeatureId="56"/>
                      </FareComponent>
                    </FareComponents>
                    <Messages>
                      <Message FailCode="0" Info="EACH CNN REQUIRES ACCOMPANYING SAME CABIN ADT" Type="W"/>
                      <Message FailCode="0" Info="VALIDATING CARRIER" Type="W"/>
                      <Message FailCode="0" Info="BSP - SU" Type="W"/>
                      <Message FailCode="0" Info="RUT - SU" Type="W"/>
                    </Messages>
                    <BaggageInformationList>
                      <BaggageInformation AirlineCode="SU" ProvisionType="A">
                        <Segment Id="0"/>
                        <Segment Id="1"/>
                        <Allowance Description1="UP TO 50 POUNDS/23 KILOGRAMS" Description2="UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS" Pieces="2"/>
                      </BaggageInformation>
                      <BaggageInformation AirlineCode="SU" ProvisionType="A">
                        <Segment Id="2"/>
                        <Segment Id="3"/>
                        <Allowance Description1="UP TO 50 POUNDS/23 KILOGRAMS" Description2="UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS" Pieces="2"/>
                      </BaggageInformation>
                    </BaggageInformationList>
                  </TPA_Extensions>
                </PassengerFare>
                <Endorsements NonRefundableIndicator="false"/>
                <TPA_Extensions>
                  <FareCalcLine Info="LED SU X/MOW SU AER6750SU X/MOW SU LED8513RUB15263END"/>
                </TPA_Extensions>
                <FareInfos>
                  <FareInfo>
                    <FareReference>N</FareReference>
                    <TPA_Extensions>
                      <SeatsRemaining BelowMin="false" Number="9"/>
                      <Cabin Cabin="Y"/>
                      <Meal Code="S"/>
                    </TPA_Extensions>
                  </FareInfo>
                  <FareInfo>
                    <FareReference>N</FareReference>
                    <TPA_Extensions>
                      <SeatsRemaining BelowMin="false" Number="9"/>
                      <Cabin Cabin="Y"/>
                      <Meal Code="S"/>
                    </TPA_Extensions>
                  </FareInfo>
                  <FareInfo>
                    <FareReference>T</FareReference>
                    <TPA_Extensions>
                      <SeatsRemaining BelowMin="false" Number="9"/>
                      <Cabin Cabin="Y"/>
                      <Meal Code="S"/>
                    </TPA_Extensions>
                  </FareInfo>
                  <FareInfo>
                    <FareReference>T</FareReference>
                    <TPA_Extensions>
                      <SeatsRemaining BelowMin="false" Number="9"/>
                      <Cabin Cabin="Y"/>
                      <Meal Code="S"/>
                    </TPA_Extensions>
                  </FareInfo>
                </FareInfos>
              </PTC_FareBreakdown>
              <PTC_FareBreakdown>
                <PassengerTypeQuantity Code="INF" Quantity="1"/>
                <FareBasisCodes>
                  <FareBasisCode ArrivalAirportCode="SVO" BookingCode="N" DepartureAirportCode="LED" FareComponentBeginAirport="LED" FareComponentDirectionality="FROM" FareComponentEndAirport="AER" FareComponentFareRule="EFR1" FareComponentFareTariff="304" FareComponentFareType="EUP" FareComponentFareTypeBitmap="01" FareComponentVendorCode="ATP" GovCarrier="SU">NFMR/IN00</FareBasisCode>
                  <FareBasisCode ArrivalAirportCode="AER" AvailabilityBreak="true" BookingCode="N" DepartureAirportCode="SVO" GovCarrier="SU">NFMR/IN00</FareBasisCode>
                  <FareBasisCode ArrivalAirportCode="SVO" BookingCode="T" DepartureAirportCode="AER" FareComponentBeginAirport="AER" FareComponentDirectionality="TO" FareComponentEndAirport="LED" FareComponentFareRule="EFR1" FareComponentFareTariff="304" FareComponentFareType="EUP" FareComponentFareTypeBitmap="01" FareComponentVendorCode="ATP" GovCarrier="SU">TFMR/IN00</FareBasisCode>
                  <FareBasisCode ArrivalAirportCode="LED" AvailabilityBreak="true" BookingCode="T" DepartureAirportCode="SVO" GovCarrier="SU">TFMR/IN00</FareBasisCode>
                </FareBasisCodes>
                <PassengerFare>
                  <BaseFare Amount="0" CurrencyCode="RUB"/>
                  <FareConstruction Amount="0" CurrencyCode="RUB" DecimalPlaces="0"/>
                  <EquivFare Amount="0" CurrencyCode="RUB" DecimalPlaces="0"/>
                  <TotalFare Amount="0" CurrencyCode="RUB"/>
                  <PenaltiesInfo>
                    <Penalty Amount="0" Applicability="Before" Changeable="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                    <Penalty Amount="0" Applicability="After" Changeable="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                    <Penalty Amount="0" Applicability="Before" CurrencyCode="RUB" DecimalPlaces="0" Refundable="true" Type="Refund"/>
                    <Penalty Amount="0" Applicability="After" CurrencyCode="RUB" DecimalPlaces="0" Refundable="true" Type="Refund"/>
                  </PenaltiesInfo>
                  <TPA_Extensions>
                    <FareComponents>
                      <FareComponent BrandID="EL" BrandName="ECONOMY FLEX" ProgramCode="CFF1S" ProgramDescription="1S" ProgramID="85965" ProgramSystemCode="X">
                        <Segment FlightIndex="1" LegIndex="1"/>
                        <Segment FlightIndex="2" LegIndex="1"/>
                        <BrandFeatureRef FeatureId="5"/>
                        <BrandFeatureRef FeatureId="13"/>
                        <BrandFeatureRef FeatureId="15"/>
                        <BrandFeatureRef FeatureId="18"/>
                        <BrandFeatureRef FeatureId="9"/>
                        <BrandFeatureRef FeatureId="6"/>
                        <BrandFeatureRef FeatureId="8"/>
                        <BrandFeatureRef FeatureId="19"/>
                        <BrandFeatureRef FeatureId="3"/>
                        <BrandFeatureRef FeatureId="10"/>
                        <BrandFeatureRef FeatureId="28"/>
                        <BrandFeatureRef FeatureId="23"/>
                        <BrandFeatureRef FeatureId="22"/>
                        <BrandFeatureRef FeatureId="32"/>
                        <BrandFeatureRef FeatureId="30"/>
                        <BrandFeatureRef FeatureId="1"/>
                        <BrandFeatureRef FeatureId="41"/>
                        <BrandFeatureRef FeatureId="42"/>
                        <BrandFeatureRef FeatureId="37"/>
                        <BrandFeatureRef FeatureId="36"/>
                        <BrandFeatureRef FeatureId="33"/>
                        <BrandFeatureRef FeatureId="44"/>
                        <BrandFeatureRef FeatureId="45"/>
                        <BrandFeatureRef FeatureId="50"/>
                        <BrandFeatureRef FeatureId="51"/>
                        <BrandFeatureRef FeatureId="47"/>
                        <BrandFeatureRef FeatureId="54"/>
                        <BrandFeatureRef FeatureId="56"/>
                      </FareComponent>
                      <FareComponent BrandID="EL" BrandName="ECONOMY FLEX" ProgramCode="CFF1S" ProgramDescription="1S" ProgramID="85965" ProgramSystemCode="X">
                        <Segment FlightIndex="1" LegIndex="2"/>
                        <Segment FlightIndex="2" LegIndex="2"/>
                        <BrandFeatureRef FeatureId="5"/>
                        <BrandFeatureRef FeatureId="13"/>
                        <BrandFeatureRef FeatureId="15"/>
                        <BrandFeatureRef FeatureId="18"/>
                        <BrandFeatureRef FeatureId="9"/>
                        <BrandFeatureRef FeatureId="6"/>
                        <BrandFeatureRef FeatureId="8"/>
                        <BrandFeatureRef FeatureId="19"/>
                        <BrandFeatureRef FeatureId="3"/>
                        <BrandFeatureRef FeatureId="10"/>
                        <BrandFeatureRef FeatureId="28"/>
                        <BrandFeatureRef FeatureId="23"/>
                        <BrandFeatureRef FeatureId="22"/>
                        <BrandFeatureRef FeatureId="32"/>
                        <BrandFeatureRef FeatureId="30"/>
                        <BrandFeatureRef FeatureId="1"/>
                        <BrandFeatureRef FeatureId="41"/>
                        <BrandFeatureRef FeatureId="42"/>
                        <BrandFeatureRef FeatureId="37"/>
                        <BrandFeatureRef FeatureId="36"/>
                        <BrandFeatureRef FeatureId="33"/>
                        <BrandFeatureRef FeatureId="44"/>
                        <BrandFeatureRef FeatureId="45"/>
                        <BrandFeatureRef FeatureId="50"/>
                        <BrandFeatureRef FeatureId="51"/>
                        <BrandFeatureRef FeatureId="47"/>
                        <BrandFeatureRef FeatureId="54"/>
                        <BrandFeatureRef FeatureId="56"/>
                      </FareComponent>
                    </FareComponents>
                    <Messages>
                      <Message FailCode="0" Info="EACH INF REQUIRES ACCOMPANYING ADT PASSENGER" Type="W"/>
                      <Message FailCode="0" Info="VALIDATING CARRIER" Type="W"/>
                      <Message FailCode="0" Info="BSP - SU" Type="W"/>
                      <Message FailCode="0" Info="RUT - SU" Type="W"/>
                    </Messages>
                    <BaggageInformationList>
                      <BaggageInformation AirlineCode="SU" ProvisionType="A">
                        <Segment Id="0"/>
                        <Segment Id="1"/>
                        <Allowance Description1="UP TO 22 POUNDS/10 KILOGRAMS" Description2="UP TO 45 LINEAR INCHES/115 LINEAR CENTIMETERS" Pieces="1"/>
                      </BaggageInformation>
                      <BaggageInformation AirlineCode="SU" ProvisionType="A">
                        <Segment Id="2"/>
                        <Segment Id="3"/>
                        <Allowance Description1="UP TO 22 POUNDS/10 KILOGRAMS" Description2="UP TO 45 LINEAR INCHES/115 LINEAR CENTIMETERS" Pieces="1"/>
                      </BaggageInformation>
                    </BaggageInformationList>
                  </TPA_Extensions>
                </PassengerFare>
                <Endorsements NonRefundableIndicator="false"/>
                <TPA_Extensions>
                  <FareCalcLine Info="LED SU X/MOW SU AER0SU X/MOW SU LED0RUB0END"/>
                </TPA_Extensions>
                <FareInfos>
                  <FareInfo>
                    <FareReference>N</FareReference>
                    <TPA_Extensions>
                      <SeatsRemaining BelowMin="false" Number="9"/>
                      <Cabin Cabin="Y"/>
                      <Meal Code="S"/>
                    </TPA_Extensions>
                  </FareInfo>
                  <FareInfo>
                    <FareReference>N</FareReference>
                    <TPA_Extensions>
                      <SeatsRemaining BelowMin="false" Number="9"/>
                      <Cabin Cabin="Y"/>
                      <Meal Code="S"/>
                    </TPA_Extensions>
                  </FareInfo>
                  <FareInfo>
                    <FareReference>T</FareReference>
                    <TPA_Extensions>
                      <SeatsRemaining BelowMin="false" Number="9"/>
                      <Cabin Cabin="Y"/>
                      <Meal Code="S"/>
                    </TPA_Extensions>
                  </FareInfo>
                  <FareInfo>
                    <FareReference>T</FareReference>
                    <TPA_Extensions>
                      <SeatsRemaining BelowMin="false" Number="9"/>
                      <Cabin Cabin="Y"/>
                      <Meal Code="S"/>
                    </TPA_Extensions>
                  </FareInfo>
                </FareInfos>
              </PTC_FareBreakdown>
            </PTC_FareBreakdowns>
            <FareInfos>
              <FareInfo>
                <FareReference>N</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="S"/>
                </TPA_Extensions>
              </FareInfo>
              <FareInfo>
                <FareReference>N</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="S"/>
                </TPA_Extensions>
              </FareInfo>
              <FareInfo>
                <FareReference>T</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="S"/>
                </TPA_Extensions>
              </FareInfo>
              <FareInfo>
                <FareReference>T</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="S"/>
                </TPA_Extensions>
              </FareInfo>
            </FareInfos>
            <TPA_Extensions>
              <DivideInParty Indicator="false"/>
              <ValidatingCarrier NewVcxProcess="true" SettlementMethod="BSP">
                <Default Code="SU"/>
              </ValidatingCarrier>
              <ValidatingCarrier NewVcxProcess="true" SettlementMethod="RUT">
                <Default Code="SU"/>
              </ValidatingCarrier>
            </TPA_Extensions>
          </AirItineraryPricingInfo>
          <TicketingInfo TicketType="eTicket" ValidInterline="Yes"/>
        </AdditionalFares>
        <AdditionalFares>
          <AirItineraryPricingInfo FareReturned="true" LastTicketDate="2020-05-31" LastTicketTime="23:59" PricingSource="WPNI1_ITIN" PricingSubSource="MIP">
            <ItinTotalFare>
              <BaseFare Amount="192850" CurrencyCode="RUB" DecimalPlaces="0"/>
              <FareConstruction Amount="192850" CurrencyCode="RUB" DecimalPlaces="0"/>
              <EquivFare Amount="192850" CurrencyCode="RUB" DecimalPlaces="0"/>
              <Taxes>
                <Tax Amount="42470" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="TOTALTAX"/>
              </Taxes>
              <TotalFare Amount="235320" CurrencyCode="RUB" DecimalPlaces="0"/>
            </ItinTotalFare>
            <PTC_FareBreakdowns>
              <PTC_FareBreakdown>
                <PassengerTypeQuantity Code="ADT" Quantity="2"/>
                <FareBasisCodes>
                  <FareBasisCode ArrivalAirportCode="SVO" BookingCode="I" DepartureAirportCode="LED" FareComponentBeginAirport="LED" FareComponentDirectionality="FROM" FareComponentEndAirport="AER" FareComponentFareRule="BBR1" FareComponentFareTariff="304" FareComponentFareType="BXR" FareComponentFareTypeBitmap="00" FareComponentVendorCode="ATP" GovCarrier="SU">IBSR</FareBasisCode>
                  <FareBasisCode ArrivalAirportCode="AER" AvailabilityBreak="true" BookingCode="I" DepartureAirportCode="SVO" GovCarrier="SU">IBSR</FareBasisCode>
                  <FareBasisCode ArrivalAirportCode="SVO" BookingCode="I" DepartureAirportCode="AER" FareComponentBeginAirport="AER" FareComponentDirectionality="TO" FareComponentEndAirport="LED" FareComponentFareRule="BBR1" FareComponentFareTariff="304" FareComponentFareType="BXR" FareComponentFareTypeBitmap="00" FareComponentVendorCode="ATP" GovCarrier="SU">IBSR</FareBasisCode>
                  <FareBasisCode ArrivalAirportCode="LED" AvailabilityBreak="true" BookingCode="I" DepartureAirportCode="SVO" GovCarrier="SU">IBSR</FareBasisCode>
                </FareBasisCodes>
                <PassengerFare>
                  <BaseFare Amount="66500" CurrencyCode="RUB"/>
                  <FareConstruction Amount="66500" CurrencyCode="RUB" DecimalPlaces="0"/>
                  <EquivFare Amount="66500" CurrencyCode="RUB" DecimalPlaces="0"/>
                  <Taxes>
                    <Tax Amount="3000" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                    <Tax Amount="3000" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                    <Tax Amount="3000" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                    <Tax Amount="3000" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                    <Tax Amount="270" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRF"/>
                    <Tax Amount="270" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRF"/>
                    <Tax Amount="270" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRF"/>
                    <Tax Amount="270" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRF"/>
                    <Tax Amount="158" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                    <Tax Amount="184" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                    <Tax Amount="120" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                    <Tax Amount="184" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                    <Tax Amount="158" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI4"/>
                    <Tax Amount="184" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI4"/>
                    <Tax Amount="120" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI4"/>
                    <Tax Amount="184" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI4"/>
                    <TaxSummary Amount="12000" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                    <TaxSummary Amount="1080" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRF"/>
                    <TaxSummary Amount="1292" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                    <TotalTax Amount="14372" CurrencyCode="RUB" DecimalPlaces="0"/>
                  </Taxes>
                  <TotalFare Amount="80872" CurrencyCode="RUB"/>
                  <PenaltiesInfo>
                    <Penalty Amount="2600" Applicability="Before" Changeable="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                    <Penalty Amount="2600" Applicability="After" Changeable="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                    <Penalty Applicability="Before" Refundable="false" Type="Refund"/>
                    <Penalty Applicability="After" Refundable="false" Type="Refund"/>
                  </PenaltiesInfo>
                  <TPA_Extensions>
                    <FareComponents>
                      <FareComponent BrandID="BA" BrandName="BUSINESS BASE" ProgramCode="CFF1S" ProgramDescription="1S" ProgramID="85965" ProgramSystemCode="X">
                        <Segment FlightIndex="1" LegIndex="1"/>
                        <Segment FlightIndex="2" LegIndex="1"/>
                        <BrandFeatureRef FeatureId="5"/>
                        <BrandFeatureRef FeatureId="13"/>
                        <BrandFeatureRef FeatureId="15"/>
                        <BrandFeatureRef FeatureId="17"/>
                        <BrandFeatureRef FeatureId="9"/>
                        <BrandFeatureRef FeatureId="7"/>
                        <BrandFeatureRef FeatureId="8"/>
                        <BrandFeatureRef FeatureId="19"/>
                        <BrandFeatureRef FeatureId="4"/>
                        <BrandFeatureRef FeatureId="12"/>
                        <BrandFeatureRef FeatureId="26"/>
                        <BrandFeatureRef FeatureId="25"/>
                        <BrandFeatureRef FeatureId="21"/>
                        <BrandFeatureRef FeatureId="31"/>
                        <BrandFeatureRef FeatureId="30"/>
                        <BrandFeatureRef FeatureId="1"/>
                        <BrandFeatureRef FeatureId="40"/>
                        <BrandFeatureRef FeatureId="43"/>
                        <BrandFeatureRef FeatureId="38"/>
                        <BrandFeatureRef FeatureId="35"/>
                        <BrandFeatureRef FeatureId="34"/>
                        <BrandFeatureRef FeatureId="44"/>
                        <BrandFeatureRef FeatureId="46"/>
                        <BrandFeatureRef FeatureId="49"/>
                        <BrandFeatureRef FeatureId="52"/>
                        <BrandFeatureRef FeatureId="48"/>
                        <BrandFeatureRef FeatureId="53"/>
                        <BrandFeatureRef FeatureId="55"/>
                      </FareComponent>
                      <FareComponent BrandID="BA" BrandName="BUSINESS BASE" ProgramCode="CFF1S" ProgramDescription="1S" ProgramID="85965" ProgramSystemCode="X">
                        <Segment FlightIndex="1" LegIndex="2"/>
                        <Segment FlightIndex="2" LegIndex="2"/>
                        <BrandFeatureRef FeatureId="5"/>
                        <BrandFeatureRef FeatureId="13"/>
                        <BrandFeatureRef FeatureId="15"/>
                        <BrandFeatureRef FeatureId="17"/>
                        <BrandFeatureRef FeatureId="9"/>
                        <BrandFeatureRef FeatureId="7"/>
                        <BrandFeatureRef FeatureId="8"/>
                        <BrandFeatureRef FeatureId="19"/>
                        <BrandFeatureRef FeatureId="4"/>
                        <BrandFeatureRef FeatureId="12"/>
                        <BrandFeatureRef FeatureId="26"/>
                        <BrandFeatureRef FeatureId="25"/>
                        <BrandFeatureRef FeatureId="21"/>
                        <BrandFeatureRef FeatureId="31"/>
                        <BrandFeatureRef FeatureId="30"/>
                        <BrandFeatureRef FeatureId="1"/>
                        <BrandFeatureRef FeatureId="40"/>
                        <BrandFeatureRef FeatureId="43"/>
                        <BrandFeatureRef FeatureId="38"/>
                        <BrandFeatureRef FeatureId="35"/>
                        <BrandFeatureRef FeatureId="34"/>
                        <BrandFeatureRef FeatureId="44"/>
                        <BrandFeatureRef FeatureId="46"/>
                        <BrandFeatureRef FeatureId="49"/>
                        <BrandFeatureRef FeatureId="52"/>
                        <BrandFeatureRef FeatureId="48"/>
                        <BrandFeatureRef FeatureId="53"/>
                        <BrandFeatureRef FeatureId="55"/>
                      </FareComponent>
                    </FareComponents>
                    <Messages>
                      <Message AirlineCode="SU" FailCode="0" Info="NONREF/HEBO3BPATEH" Type="N"/>
                      <Message FailCode="0" Info="VALIDATING CARRIER" Type="W"/>
                      <Message FailCode="0" Info="BSP - SU" Type="W"/>
                      <Message FailCode="0" Info="RUT - SU" Type="W"/>
                    </Messages>
                    <BaggageInformationList>
                      <BaggageInformation AirlineCode="SU" ProvisionType="A">
                        <Segment Id="0"/>
                        <Segment Id="1"/>
                        <Allowance Description1="UP TO 70 POUNDS/32 KILOGRAMS" Description2="UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS" Pieces="1"/>
                      </BaggageInformation>
                      <BaggageInformation AirlineCode="SU" ProvisionType="A">
                        <Segment Id="2"/>
                        <Segment Id="3"/>
                        <Allowance Description1="UP TO 70 POUNDS/32 KILOGRAMS" Description2="UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS" Pieces="1"/>
                      </BaggageInformation>
                    </BaggageInformationList>
                  </TPA_Extensions>
                </PassengerFare>
                <Endorsements NonRefundableIndicator="true"/>
                <TPA_Extensions>
                  <FareCalcLine Info="LED SU X/MOW SU AER33250SU X/MOW SU LED33250RUB66500END"/>
                </TPA_Extensions>
                <FareInfos>
                  <FareInfo>
                    <FareReference>I</FareReference>
                    <TPA_Extensions>
                      <SeatsRemaining BelowMin="false" Number="8"/>
                      <Cabin Cabin="C"/>
                      <Meal Code="S"/>
                    </TPA_Extensions>
                  </FareInfo>
                  <FareInfo>
                    <FareReference>I</FareReference>
                    <TPA_Extensions>
                      <SeatsRemaining BelowMin="false" Number="6"/>
                      <Cabin Cabin="C"/>
                      <Meal Code="B"/>
                    </TPA_Extensions>
                  </FareInfo>
                  <FareInfo>
                    <FareReference>I</FareReference>
                    <TPA_Extensions>
                      <SeatsRemaining BelowMin="false" Number="3"/>
                      <Cabin Cabin="C"/>
                      <Meal Code="B"/>
                    </TPA_Extensions>
                  </FareInfo>
                  <FareInfo>
                    <FareReference>I</FareReference>
                    <TPA_Extensions>
                      <SeatsRemaining BelowMin="false" Number="8"/>
                      <Cabin Cabin="C"/>
                      <Meal Code="S"/>
                    </TPA_Extensions>
                  </FareInfo>
                </FareInfos>
              </PTC_FareBreakdown>
              <PTC_FareBreakdown>
                <PassengerTypeQuantity Code="CNN" Quantity="1"/>
                <FareBasisCodes>
                  <FareBasisCode ArrivalAirportCode="SVO" BookingCode="I" DepartureAirportCode="LED" FareComponentBeginAirport="LED" FareComponentDirectionality="FROM" FareComponentEndAirport="AER" FareComponentFareRule="BBR1" FareComponentFareTariff="304" FareComponentFareType="BXR" FareComponentFareTypeBitmap="01" FareComponentVendorCode="ATP" GovCarrier="SU">IBSR/CH10</FareBasisCode>
                  <FareBasisCode ArrivalAirportCode="AER" AvailabilityBreak="true" BookingCode="I" DepartureAirportCode="SVO" GovCarrier="SU">IBSR/CH10</FareBasisCode>
                  <FareBasisCode ArrivalAirportCode="SVO" BookingCode="I" DepartureAirportCode="AER" FareComponentBeginAirport="AER" FareComponentDirectionality="TO" FareComponentEndAirport="LED" FareComponentFareRule="BBR1" FareComponentFareTariff="304" FareComponentFareType="BXR" FareComponentFareTypeBitmap="01" FareComponentVendorCode="ATP" GovCarrier="SU">IBSR/CH10</FareBasisCode>
                  <FareBasisCode ArrivalAirportCode="LED" AvailabilityBreak="true" BookingCode="I" DepartureAirportCode="SVO" GovCarrier="SU">IBSR/CH10</FareBasisCode>
                </FareBasisCodes>
                <PassengerFare>
                  <BaseFare Amount="59850" CurrencyCode="RUB"/>
                  <FareConstruction Amount="59850" CurrencyCode="RUB" DecimalPlaces="0"/>
                  <EquivFare Amount="59850" CurrencyCode="RUB" DecimalPlaces="0"/>
                  <Taxes>
                    <Tax Amount="3000" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                    <Tax Amount="3000" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                    <Tax Amount="3000" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                    <Tax Amount="3000" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                    <Tax Amount="270" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRF"/>
                    <Tax Amount="270" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRF"/>
                    <Tax Amount="270" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRF"/>
                    <Tax Amount="270" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRF"/>
                    <Tax Amount="79" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                    <Tax Amount="92" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                    <Tax Amount="60" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                    <Tax Amount="92" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                    <Tax Amount="79" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI4"/>
                    <Tax Amount="92" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI4"/>
                    <Tax Amount="60" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI4"/>
                    <Tax Amount="92" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI4"/>
                    <TaxSummary Amount="12000" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                    <TaxSummary Amount="1080" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRF"/>
                    <TaxSummary Amount="646" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                    <TotalTax Amount="13726" CurrencyCode="RUB" DecimalPlaces="0"/>
                  </Taxes>
                  <TotalFare Amount="73576" CurrencyCode="RUB"/>
                  <PenaltiesInfo>
                    <Penalty Amount="2600" Applicability="Before" Changeable="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                    <Penalty Amount="2600" Applicability="After" Changeable="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                    <Penalty Applicability="Before" Refundable="false" Type="Refund"/>
                    <Penalty Applicability="After" Refundable="false" Type="Refund"/>
                  </PenaltiesInfo>
                  <TPA_Extensions>
                    <FareComponents>
                      <FareComponent BrandID="BA" BrandName="BUSINESS BASE" ProgramCode="CFF1S" ProgramDescription="1S" ProgramID="85965" ProgramSystemCode="X">
                        <Segment FlightIndex="1" LegIndex="1"/>
                        <Segment FlightIndex="2" LegIndex="1"/>
                        <BrandFeatureRef FeatureId="5"/>
                        <BrandFeatureRef FeatureId="13"/>
                        <BrandFeatureRef FeatureId="15"/>
                        <BrandFeatureRef FeatureId="17"/>
                        <BrandFeatureRef FeatureId="9"/>
                        <BrandFeatureRef FeatureId="7"/>
                        <BrandFeatureRef FeatureId="8"/>
                        <BrandFeatureRef FeatureId="19"/>
                        <BrandFeatureRef FeatureId="4"/>
                        <BrandFeatureRef FeatureId="12"/>
                        <BrandFeatureRef FeatureId="26"/>
                        <BrandFeatureRef FeatureId="25"/>
                        <BrandFeatureRef FeatureId="21"/>
                        <BrandFeatureRef FeatureId="31"/>
                        <BrandFeatureRef FeatureId="30"/>
                        <BrandFeatureRef FeatureId="1"/>
                        <BrandFeatureRef FeatureId="40"/>
                        <BrandFeatureRef FeatureId="43"/>
                        <BrandFeatureRef FeatureId="38"/>
                        <BrandFeatureRef FeatureId="35"/>
                        <BrandFeatureRef FeatureId="34"/>
                        <BrandFeatureRef FeatureId="44"/>
                        <BrandFeatureRef FeatureId="46"/>
                        <BrandFeatureRef FeatureId="49"/>
                        <BrandFeatureRef FeatureId="52"/>
                        <BrandFeatureRef FeatureId="48"/>
                        <BrandFeatureRef FeatureId="53"/>
                        <BrandFeatureRef FeatureId="55"/>
                      </FareComponent>
                      <FareComponent BrandID="BA" BrandName="BUSINESS BASE" ProgramCode="CFF1S" ProgramDescription="1S" ProgramID="85965" ProgramSystemCode="X">
                        <Segment FlightIndex="1" LegIndex="2"/>
                        <Segment FlightIndex="2" LegIndex="2"/>
                        <BrandFeatureRef FeatureId="5"/>
                        <BrandFeatureRef FeatureId="13"/>
                        <BrandFeatureRef FeatureId="15"/>
                        <BrandFeatureRef FeatureId="17"/>
                        <BrandFeatureRef FeatureId="9"/>
                        <BrandFeatureRef FeatureId="7"/>
                        <BrandFeatureRef FeatureId="8"/>
                        <BrandFeatureRef FeatureId="19"/>
                        <BrandFeatureRef FeatureId="4"/>
                        <BrandFeatureRef FeatureId="12"/>
                        <BrandFeatureRef FeatureId="26"/>
                        <BrandFeatureRef FeatureId="25"/>
                        <BrandFeatureRef FeatureId="21"/>
                        <BrandFeatureRef FeatureId="31"/>
                        <BrandFeatureRef FeatureId="30"/>
                        <BrandFeatureRef FeatureId="1"/>
                        <BrandFeatureRef FeatureId="40"/>
                        <BrandFeatureRef FeatureId="43"/>
                        <BrandFeatureRef FeatureId="38"/>
                        <BrandFeatureRef FeatureId="35"/>
                        <BrandFeatureRef FeatureId="34"/>
                        <BrandFeatureRef FeatureId="44"/>
                        <BrandFeatureRef FeatureId="46"/>
                        <BrandFeatureRef FeatureId="49"/>
                        <BrandFeatureRef FeatureId="52"/>
                        <BrandFeatureRef FeatureId="48"/>
                        <BrandFeatureRef FeatureId="53"/>
                        <BrandFeatureRef FeatureId="55"/>
                      </FareComponent>
                    </FareComponents>
                    <Messages>
                      <Message AirlineCode="SU" FailCode="0" Info="NONREF/HEBO3BPATEH" Type="N"/>
                      <Message FailCode="0" Info="EACH CNN REQUIRES ACCOMPANYING SAME CABIN ADT" Type="W"/>
                      <Message FailCode="0" Info="VALIDATING CARRIER" Type="W"/>
                      <Message FailCode="0" Info="BSP - SU" Type="W"/>
                      <Message FailCode="0" Info="RUT - SU" Type="W"/>
                    </Messages>
                    <BaggageInformationList>
                      <BaggageInformation AirlineCode="SU" ProvisionType="A">
                        <Segment Id="0"/>
                        <Segment Id="1"/>
                        <Allowance Description1="UP TO 70 POUNDS/32 KILOGRAMS" Description2="UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS" Pieces="1"/>
                      </BaggageInformation>
                      <BaggageInformation AirlineCode="SU" ProvisionType="A">
                        <Segment Id="2"/>
                        <Segment Id="3"/>
                        <Allowance Description1="UP TO 70 POUNDS/32 KILOGRAMS" Description2="UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS" Pieces="1"/>
                      </BaggageInformation>
                    </BaggageInformationList>
                  </TPA_Extensions>
                </PassengerFare>
                <Endorsements NonRefundableIndicator="true"/>
                <TPA_Extensions>
                  <FareCalcLine Info="LED SU X/MOW SU AER29925SU X/MOW SU LED29925RUB59850END"/>
                </TPA_Extensions>
                <FareInfos>
                  <FareInfo>
                    <FareReference>I</FareReference>
                    <TPA_Extensions>
                      <SeatsRemaining BelowMin="false" Number="8"/>
                      <Cabin Cabin="C"/>
                      <Meal Code="S"/>
                    </TPA_Extensions>
                  </FareInfo>
                  <FareInfo>
                    <FareReference>I</FareReference>
                    <TPA_Extensions>
                      <SeatsRemaining BelowMin="false" Number="6"/>
                      <Cabin Cabin="C"/>
                      <Meal Code="B"/>
                    </TPA_Extensions>
                  </FareInfo>
                  <FareInfo>
                    <FareReference>I</FareReference>
                    <TPA_Extensions>
                      <SeatsRemaining BelowMin="false" Number="3"/>
                      <Cabin Cabin="C"/>
                      <Meal Code="B"/>
                    </TPA_Extensions>
                  </FareInfo>
                  <FareInfo>
                    <FareReference>I</FareReference>
                    <TPA_Extensions>
                      <SeatsRemaining BelowMin="false" Number="8"/>
                      <Cabin Cabin="C"/>
                      <Meal Code="S"/>
                    </TPA_Extensions>
                  </FareInfo>
                </FareInfos>
              </PTC_FareBreakdown>
              <PTC_FareBreakdown>
                <PassengerTypeQuantity Code="INF" Quantity="1"/>
                <FareBasisCodes>
                  <FareBasisCode ArrivalAirportCode="SVO" BookingCode="I" DepartureAirportCode="LED" FareComponentBeginAirport="LED" FareComponentDirectionality="FROM" FareComponentEndAirport="AER" FareComponentFareRule="BBR1" FareComponentFareTariff="304" FareComponentFareType="BXR" FareComponentFareTypeBitmap="01" FareComponentVendorCode="ATP" GovCarrier="SU">IBSR/IN00</FareBasisCode>
                  <FareBasisCode ArrivalAirportCode="AER" AvailabilityBreak="true" BookingCode="I" DepartureAirportCode="SVO" GovCarrier="SU">IBSR/IN00</FareBasisCode>
                  <FareBasisCode ArrivalAirportCode="SVO" BookingCode="I" DepartureAirportCode="AER" FareComponentBeginAirport="AER" FareComponentDirectionality="TO" FareComponentEndAirport="LED" FareComponentFareRule="BBR1" FareComponentFareTariff="304" FareComponentFareType="BXR" FareComponentFareTypeBitmap="01" FareComponentVendorCode="ATP" GovCarrier="SU">IBSR/IN00</FareBasisCode>
                  <FareBasisCode ArrivalAirportCode="LED" AvailabilityBreak="true" BookingCode="I" DepartureAirportCode="SVO" GovCarrier="SU">IBSR/IN00</FareBasisCode>
                </FareBasisCodes>
                <PassengerFare>
                  <BaseFare Amount="0" CurrencyCode="RUB"/>
                  <FareConstruction Amount="0" CurrencyCode="RUB" DecimalPlaces="0"/>
                  <EquivFare Amount="0" CurrencyCode="RUB" DecimalPlaces="0"/>
                  <TotalFare Amount="0" CurrencyCode="RUB"/>
                  <PenaltiesInfo>
                    <Penalty Amount="2600" Applicability="Before" Changeable="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                    <Penalty Amount="2600" Applicability="After" Changeable="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                    <Penalty Applicability="Before" Refundable="false" Type="Refund"/>
                    <Penalty Applicability="After" Refundable="false" Type="Refund"/>
                  </PenaltiesInfo>
                  <TPA_Extensions>
                    <FareComponents>
                      <FareComponent BrandID="BA" BrandName="BUSINESS BASE" ProgramCode="CFF1S" ProgramDescription="1S" ProgramID="85965" ProgramSystemCode="X">
                        <Segment FlightIndex="1" LegIndex="1"/>
                        <Segment FlightIndex="2" LegIndex="1"/>
                        <BrandFeatureRef FeatureId="5"/>
                        <BrandFeatureRef FeatureId="13"/>
                        <BrandFeatureRef FeatureId="15"/>
                        <BrandFeatureRef FeatureId="17"/>
                        <BrandFeatureRef FeatureId="9"/>
                        <BrandFeatureRef FeatureId="7"/>
                        <BrandFeatureRef FeatureId="8"/>
                        <BrandFeatureRef FeatureId="19"/>
                        <BrandFeatureRef FeatureId="4"/>
                        <BrandFeatureRef FeatureId="12"/>
                        <BrandFeatureRef FeatureId="26"/>
                        <BrandFeatureRef FeatureId="25"/>
                        <BrandFeatureRef FeatureId="21"/>
                        <BrandFeatureRef FeatureId="31"/>
                        <BrandFeatureRef FeatureId="30"/>
                        <BrandFeatureRef FeatureId="1"/>
                        <BrandFeatureRef FeatureId="40"/>
                        <BrandFeatureRef FeatureId="43"/>
                        <BrandFeatureRef FeatureId="38"/>
                        <BrandFeatureRef FeatureId="35"/>
                        <BrandFeatureRef FeatureId="34"/>
                        <BrandFeatureRef FeatureId="44"/>
                        <BrandFeatureRef FeatureId="46"/>
                        <BrandFeatureRef FeatureId="49"/>
                        <BrandFeatureRef FeatureId="52"/>
                        <BrandFeatureRef FeatureId="48"/>
                        <BrandFeatureRef FeatureId="53"/>
                        <BrandFeatureRef FeatureId="55"/>
                      </FareComponent>
                      <FareComponent BrandID="BA" BrandName="BUSINESS BASE" ProgramCode="CFF1S" ProgramDescription="1S" ProgramID="85965" ProgramSystemCode="X">
                        <Segment FlightIndex="1" LegIndex="2"/>
                        <Segment FlightIndex="2" LegIndex="2"/>
                        <BrandFeatureRef FeatureId="5"/>
                        <BrandFeatureRef FeatureId="13"/>
                        <BrandFeatureRef FeatureId="15"/>
                        <BrandFeatureRef FeatureId="17"/>
                        <BrandFeatureRef FeatureId="9"/>
                        <BrandFeatureRef FeatureId="7"/>
                        <BrandFeatureRef FeatureId="8"/>
                        <BrandFeatureRef FeatureId="19"/>
                        <BrandFeatureRef FeatureId="4"/>
                        <BrandFeatureRef FeatureId="12"/>
                        <BrandFeatureRef FeatureId="26"/>
                        <BrandFeatureRef FeatureId="25"/>
                        <BrandFeatureRef FeatureId="21"/>
                        <BrandFeatureRef FeatureId="31"/>
                        <BrandFeatureRef FeatureId="30"/>
                        <BrandFeatureRef FeatureId="1"/>
                        <BrandFeatureRef FeatureId="40"/>
                        <BrandFeatureRef FeatureId="43"/>
                        <BrandFeatureRef FeatureId="38"/>
                        <BrandFeatureRef FeatureId="35"/>
                        <BrandFeatureRef FeatureId="34"/>
                        <BrandFeatureRef FeatureId="44"/>
                        <BrandFeatureRef FeatureId="46"/>
                        <BrandFeatureRef FeatureId="49"/>
                        <BrandFeatureRef FeatureId="52"/>
                        <BrandFeatureRef FeatureId="48"/>
                        <BrandFeatureRef FeatureId="53"/>
                        <BrandFeatureRef FeatureId="55"/>
                      </FareComponent>
                    </FareComponents>
                    <Messages>
                      <Message AirlineCode="SU" FailCode="0" Info="NONREF/HEBO3BPATEH" Type="N"/>
                      <Message FailCode="0" Info="EACH INF REQUIRES ACCOMPANYING ADT PASSENGER" Type="W"/>
                      <Message FailCode="0" Info="VALIDATING CARRIER" Type="W"/>
                      <Message FailCode="0" Info="BSP - SU" Type="W"/>
                      <Message FailCode="0" Info="RUT - SU" Type="W"/>
                    </Messages>
                    <BaggageInformationList>
                      <BaggageInformation AirlineCode="SU" ProvisionType="A">
                        <Segment Id="0"/>
                        <Segment Id="1"/>
                        <Allowance Description1="UP TO 22 POUNDS/10 KILOGRAMS" Description2="UP TO 45 LINEAR INCHES/115 LINEAR CENTIMETERS" Pieces="1"/>
                      </BaggageInformation>
                      <BaggageInformation AirlineCode="SU" ProvisionType="A">
                        <Segment Id="2"/>
                        <Segment Id="3"/>
                        <Allowance Description1="UP TO 22 POUNDS/10 KILOGRAMS" Description2="UP TO 45 LINEAR INCHES/115 LINEAR CENTIMETERS" Pieces="1"/>
                      </BaggageInformation>
                    </BaggageInformationList>
                  </TPA_Extensions>
                </PassengerFare>
                <Endorsements NonRefundableIndicator="true"/>
                <TPA_Extensions>
                  <FareCalcLine Info="LED SU X/MOW SU AER0SU X/MOW SU LED0RUB0END"/>
                </TPA_Extensions>
                <FareInfos>
                  <FareInfo>
                    <FareReference>I</FareReference>
                    <TPA_Extensions>
                      <SeatsRemaining BelowMin="false" Number="8"/>
                      <Cabin Cabin="C"/>
                      <Meal Code="S"/>
                    </TPA_Extensions>
                  </FareInfo>
                  <FareInfo>
                    <FareReference>I</FareReference>
                    <TPA_Extensions>
                      <SeatsRemaining BelowMin="false" Number="6"/>
                      <Cabin Cabin="C"/>
                      <Meal Code="B"/>
                    </TPA_Extensions>
                  </FareInfo>
                  <FareInfo>
                    <FareReference>I</FareReference>
                    <TPA_Extensions>
                      <SeatsRemaining BelowMin="false" Number="3"/>
                      <Cabin Cabin="C"/>
                      <Meal Code="B"/>
                    </TPA_Extensions>
                  </FareInfo>
                  <FareInfo>
                    <FareReference>I</FareReference>
                    <TPA_Extensions>
                      <SeatsRemaining BelowMin="false" Number="8"/>
                      <Cabin Cabin="C"/>
                      <Meal Code="S"/>
                    </TPA_Extensions>
                  </FareInfo>
                </FareInfos>
              </PTC_FareBreakdown>
            </PTC_FareBreakdowns>
            <FareInfos>
              <FareInfo>
                <FareReference>I</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="8"/>
                  <Cabin Cabin="C"/>
                  <Meal Code="S"/>
                </TPA_Extensions>
              </FareInfo>
              <FareInfo>
                <FareReference>I</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="6"/>
                  <Cabin Cabin="C"/>
                  <Meal Code="B"/>
                </TPA_Extensions>
              </FareInfo>
              <FareInfo>
                <FareReference>I</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="3"/>
                  <Cabin Cabin="C"/>
                  <Meal Code="B"/>
                </TPA_Extensions>
              </FareInfo>
              <FareInfo>
                <FareReference>I</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="8"/>
                  <Cabin Cabin="C"/>
                  <Meal Code="S"/>
                </TPA_Extensions>
              </FareInfo>
            </FareInfos>
            <TPA_Extensions>
              <DivideInParty Indicator="false"/>
              <ValidatingCarrier NewVcxProcess="true" SettlementMethod="BSP">
                <Default Code="SU"/>
              </ValidatingCarrier>
              <ValidatingCarrier NewVcxProcess="true" SettlementMethod="RUT">
                <Default Code="SU"/>
              </ValidatingCarrier>
            </TPA_Extensions>
          </AirItineraryPricingInfo>
          <TicketingInfo TicketType="eTicket" ValidInterline="Yes"/>
        </AdditionalFares>
        <AdditionalFares>
          <AirItineraryPricingInfo FareReturned="true" LastTicketDate="2020-05-31" LastTicketTime="23:59" PricingSource="WPNI1_ITIN" PricingSubSource="MIP">
            <ItinTotalFare>
              <BaseFare Amount="227650" CurrencyCode="RUB" DecimalPlaces="0"/>
              <FareConstruction Amount="227650" CurrencyCode="RUB" DecimalPlaces="0"/>
              <EquivFare Amount="227650" CurrencyCode="RUB" DecimalPlaces="0"/>
              <Taxes>
                <Tax Amount="42470" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="TOTALTAX"/>
              </Taxes>
              <TotalFare Amount="270120" CurrencyCode="RUB" DecimalPlaces="0"/>
            </ItinTotalFare>
            <PTC_FareBreakdowns>
              <PTC_FareBreakdown>
                <PassengerTypeQuantity Code="ADT" Quantity="2"/>
                <FareBasisCodes>
                  <FareBasisCode ArrivalAirportCode="SVO" BookingCode="I" DepartureAirportCode="LED" FareComponentBeginAirport="LED" FareComponentDirectionality="FROM" FareComponentEndAirport="AER" FareComponentFareRule="BCR1" FareComponentFareTariff="304" FareComponentFareType="BX" FareComponentFareTypeBitmap="00" FareComponentVendorCode="ATP" GovCarrier="SU">ICLR</FareBasisCode>
                  <FareBasisCode ArrivalAirportCode="AER" AvailabilityBreak="true" BookingCode="I" DepartureAirportCode="SVO" GovCarrier="SU">ICLR</FareBasisCode>
                  <FareBasisCode ArrivalAirportCode="SVO" BookingCode="I" DepartureAirportCode="AER" FareComponentBeginAirport="AER" FareComponentDirectionality="TO" FareComponentEndAirport="LED" FareComponentFareRule="BCR1" FareComponentFareTariff="304" FareComponentFareType="BX" FareComponentFareTypeBitmap="00" FareComponentVendorCode="ATP" GovCarrier="SU">ICLR</FareBasisCode>
                  <FareBasisCode ArrivalAirportCode="LED" AvailabilityBreak="true" BookingCode="I" DepartureAirportCode="SVO" GovCarrier="SU">ICLR</FareBasisCode>
                </FareBasisCodes>
                <PassengerFare>
                  <BaseFare Amount="78500" CurrencyCode="RUB"/>
                  <FareConstruction Amount="78500" CurrencyCode="RUB" DecimalPlaces="0"/>
                  <EquivFare Amount="78500" CurrencyCode="RUB" DecimalPlaces="0"/>
                  <Taxes>
                    <Tax Amount="3000" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                    <Tax Amount="3000" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                    <Tax Amount="3000" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                    <Tax Amount="3000" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                    <Tax Amount="270" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRF"/>
                    <Tax Amount="270" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRF"/>
                    <Tax Amount="270" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRF"/>
                    <Tax Amount="270" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRF"/>
                    <Tax Amount="158" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                    <Tax Amount="184" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                    <Tax Amount="120" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                    <Tax Amount="184" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                    <Tax Amount="158" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI4"/>
                    <Tax Amount="184" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI4"/>
                    <Tax Amount="120" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI4"/>
                    <Tax Amount="184" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI4"/>
                    <TaxSummary Amount="12000" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                    <TaxSummary Amount="1080" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRF"/>
                    <TaxSummary Amount="1292" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                    <TotalTax Amount="14372" CurrencyCode="RUB" DecimalPlaces="0"/>
                  </Taxes>
                  <TotalFare Amount="92872" CurrencyCode="RUB"/>
                  <PenaltiesInfo>
                    <Penalty Amount="2600" Applicability="Before" Changeable="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                    <Penalty Amount="2600" Applicability="After" Changeable="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                    <Penalty Amount="2600" Applicability="Before" CurrencyCode="RUB" DecimalPlaces="0" Refundable="true" Type="Refund"/>
                    <Penalty Amount="2600" Applicability="After" CurrencyCode="RUB" DecimalPlaces="0" Refundable="true" Type="Refund"/>
                  </PenaltiesInfo>
                  <TPA_Extensions>
                    <FareComponents>
                      <FareComponent BrandID="BC" BrandName="BUSINESS CLASSIC" ProgramCode="CFF1S" ProgramDescription="1S" ProgramID="85965" ProgramSystemCode="X">
                        <Segment FlightIndex="1" LegIndex="1"/>
                        <Segment FlightIndex="2" LegIndex="1"/>
                        <BrandFeatureRef FeatureId="5"/>
                        <BrandFeatureRef FeatureId="13"/>
                        <BrandFeatureRef FeatureId="15"/>
                        <BrandFeatureRef FeatureId="18"/>
                        <BrandFeatureRef FeatureId="9"/>
                        <BrandFeatureRef FeatureId="6"/>
                        <BrandFeatureRef FeatureId="8"/>
                        <BrandFeatureRef FeatureId="19"/>
                        <BrandFeatureRef FeatureId="4"/>
                        <BrandFeatureRef FeatureId="12"/>
                        <BrandFeatureRef FeatureId="27"/>
                        <BrandFeatureRef FeatureId="24"/>
                        <BrandFeatureRef FeatureId="21"/>
                        <BrandFeatureRef FeatureId="31"/>
                        <BrandFeatureRef FeatureId="30"/>
                        <BrandFeatureRef FeatureId="1"/>
                        <BrandFeatureRef FeatureId="40"/>
                        <BrandFeatureRef FeatureId="43"/>
                        <BrandFeatureRef FeatureId="38"/>
                        <BrandFeatureRef FeatureId="35"/>
                        <BrandFeatureRef FeatureId="33"/>
                        <BrandFeatureRef FeatureId="44"/>
                        <BrandFeatureRef FeatureId="46"/>
                        <BrandFeatureRef FeatureId="49"/>
                        <BrandFeatureRef FeatureId="52"/>
                        <BrandFeatureRef FeatureId="48"/>
                        <BrandFeatureRef FeatureId="53"/>
                        <BrandFeatureRef FeatureId="55"/>
                      </FareComponent>
                      <FareComponent BrandID="BC" BrandName="BUSINESS CLASSIC" ProgramCode="CFF1S" ProgramDescription="1S" ProgramID="85965" ProgramSystemCode="X">
                        <Segment FlightIndex="1" LegIndex="2"/>
                        <Segment FlightIndex="2" LegIndex="2"/>
                        <BrandFeatureRef FeatureId="5"/>
                        <BrandFeatureRef FeatureId="13"/>
                        <BrandFeatureRef FeatureId="15"/>
                        <BrandFeatureRef FeatureId="18"/>
                        <BrandFeatureRef FeatureId="9"/>
                        <BrandFeatureRef FeatureId="6"/>
                        <BrandFeatureRef FeatureId="8"/>
                        <BrandFeatureRef FeatureId="19"/>
                        <BrandFeatureRef FeatureId="4"/>
                        <BrandFeatureRef FeatureId="12"/>
                        <BrandFeatureRef FeatureId="27"/>
                        <BrandFeatureRef FeatureId="24"/>
                        <BrandFeatureRef FeatureId="21"/>
                        <BrandFeatureRef FeatureId="31"/>
                        <BrandFeatureRef FeatureId="30"/>
                        <BrandFeatureRef FeatureId="1"/>
                        <BrandFeatureRef FeatureId="40"/>
                        <BrandFeatureRef FeatureId="43"/>
                        <BrandFeatureRef FeatureId="38"/>
                        <BrandFeatureRef FeatureId="35"/>
                        <BrandFeatureRef FeatureId="33"/>
                        <BrandFeatureRef FeatureId="44"/>
                        <BrandFeatureRef FeatureId="46"/>
                        <BrandFeatureRef FeatureId="49"/>
                        <BrandFeatureRef FeatureId="52"/>
                        <BrandFeatureRef FeatureId="48"/>
                        <BrandFeatureRef FeatureId="53"/>
                        <BrandFeatureRef FeatureId="55"/>
                      </FareComponent>
                    </FareComponents>
                    <Messages>
                      <Message FailCode="0" Info="VALIDATING CARRIER" Type="W"/>
                      <Message FailCode="0" Info="BSP - SU" Type="W"/>
                      <Message FailCode="0" Info="RUT - SU" Type="W"/>
                    </Messages>
                    <BaggageInformationList>
                      <BaggageInformation AirlineCode="SU" ProvisionType="A">
                        <Segment Id="0"/>
                        <Segment Id="1"/>
                        <Allowance Description1="UP TO 70 POUNDS/32 KILOGRAMS" Description2="UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS" Pieces="2"/>
                      </BaggageInformation>
                      <BaggageInformation AirlineCode="SU" ProvisionType="A">
                        <Segment Id="2"/>
                        <Segment Id="3"/>
                        <Allowance Description1="UP TO 70 POUNDS/32 KILOGRAMS" Description2="UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS" Pieces="2"/>
                      </BaggageInformation>
                    </BaggageInformationList>
                  </TPA_Extensions>
                </PassengerFare>
                <Endorsements NonRefundableIndicator="false"/>
                <TPA_Extensions>
                  <FareCalcLine Info="LED SU X/MOW SU AER39250SU X/MOW SU LED39250RUB78500END"/>
                </TPA_Extensions>
                <FareInfos>
                  <FareInfo>
                    <FareReference>I</FareReference>
                    <TPA_Extensions>
                      <SeatsRemaining BelowMin="false" Number="8"/>
                      <Cabin Cabin="C"/>
                      <Meal Code="S"/>
                    </TPA_Extensions>
                  </FareInfo>
                  <FareInfo>
                    <FareReference>I</FareReference>
                    <TPA_Extensions>
                      <SeatsRemaining BelowMin="false" Number="6"/>
                      <Cabin Cabin="C"/>
                      <Meal Code="B"/>
                    </TPA_Extensions>
                  </FareInfo>
                  <FareInfo>
                    <FareReference>I</FareReference>
                    <TPA_Extensions>
                      <SeatsRemaining BelowMin="false" Number="3"/>
                      <Cabin Cabin="C"/>
                      <Meal Code="B"/>
                    </TPA_Extensions>
                  </FareInfo>
                  <FareInfo>
                    <FareReference>I</FareReference>
                    <TPA_Extensions>
                      <SeatsRemaining BelowMin="false" Number="8"/>
                      <Cabin Cabin="C"/>
                      <Meal Code="S"/>
                    </TPA_Extensions>
                  </FareInfo>
                </FareInfos>
              </PTC_FareBreakdown>
              <PTC_FareBreakdown>
                <PassengerTypeQuantity Code="CNN" Quantity="1"/>
                <FareBasisCodes>
                  <FareBasisCode ArrivalAirportCode="SVO" BookingCode="I" DepartureAirportCode="LED" FareComponentBeginAirport="LED" FareComponentDirectionality="FROM" FareComponentEndAirport="AER" FareComponentFareRule="BCR1" FareComponentFareTariff="304" FareComponentFareType="BX" FareComponentFareTypeBitmap="01" FareComponentVendorCode="ATP" GovCarrier="SU">ICLR/CH10</FareBasisCode>
                  <FareBasisCode ArrivalAirportCode="AER" AvailabilityBreak="true" BookingCode="I" DepartureAirportCode="SVO" GovCarrier="SU">ICLR/CH10</FareBasisCode>
                  <FareBasisCode ArrivalAirportCode="SVO" BookingCode="I" DepartureAirportCode="AER" FareComponentBeginAirport="AER" FareComponentDirectionality="TO" FareComponentEndAirport="LED" FareComponentFareRule="BCR1" FareComponentFareTariff="304" FareComponentFareType="BX" FareComponentFareTypeBitmap="01" FareComponentVendorCode="ATP" GovCarrier="SU">ICLR/CH10</FareBasisCode>
                  <FareBasisCode ArrivalAirportCode="LED" AvailabilityBreak="true" BookingCode="I" DepartureAirportCode="SVO" GovCarrier="SU">ICLR/CH10</FareBasisCode>
                </FareBasisCodes>
                <PassengerFare>
                  <BaseFare Amount="70650" CurrencyCode="RUB"/>
                  <FareConstruction Amount="70650" CurrencyCode="RUB" DecimalPlaces="0"/>
                  <EquivFare Amount="70650" CurrencyCode="RUB" DecimalPlaces="0"/>
                  <Taxes>
                    <Tax Amount="3000" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                    <Tax Amount="3000" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                    <Tax Amount="3000" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                    <Tax Amount="3000" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                    <Tax Amount="270" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRF"/>
                    <Tax Amount="270" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRF"/>
                    <Tax Amount="270" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRF"/>
                    <Tax Amount="270" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRF"/>
                    <Tax Amount="79" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                    <Tax Amount="92" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                    <Tax Amount="60" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                    <Tax Amount="92" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                    <Tax Amount="79" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI4"/>
                    <Tax Amount="92" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI4"/>
                    <Tax Amount="60" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI4"/>
                    <Tax Amount="92" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI4"/>
                    <TaxSummary Amount="12000" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                    <TaxSummary Amount="1080" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRF"/>
                    <TaxSummary Amount="646" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                    <TotalTax Amount="13726" CurrencyCode="RUB" DecimalPlaces="0"/>
                  </Taxes>
                  <TotalFare Amount="84376" CurrencyCode="RUB"/>
                  <PenaltiesInfo>
                    <Penalty Amount="2600" Applicability="Before" Changeable="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                    <Penalty Amount="2600" Applicability="After" Changeable="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                    <Penalty Amount="2600" Applicability="Before" CurrencyCode="RUB" DecimalPlaces="0" Refundable="true" Type="Refund"/>
                    <Penalty Amount="2600" Applicability="After" CurrencyCode="RUB" DecimalPlaces="0" Refundable="true" Type="Refund"/>
                  </PenaltiesInfo>
                  <TPA_Extensions>
                    <FareComponents>
                      <FareComponent BrandID="BC" BrandName="BUSINESS CLASSIC" ProgramCode="CFF1S" ProgramDescription="1S" ProgramID="85965" ProgramSystemCode="X">
                        <Segment FlightIndex="1" LegIndex="1"/>
                        <Segment FlightIndex="2" LegIndex="1"/>
                        <BrandFeatureRef FeatureId="5"/>
                        <BrandFeatureRef FeatureId="13"/>
                        <BrandFeatureRef FeatureId="15"/>
                        <BrandFeatureRef FeatureId="18"/>
                        <BrandFeatureRef FeatureId="9"/>
                        <BrandFeatureRef FeatureId="6"/>
                        <BrandFeatureRef FeatureId="8"/>
                        <BrandFeatureRef FeatureId="19"/>
                        <BrandFeatureRef FeatureId="4"/>
                        <BrandFeatureRef FeatureId="12"/>
                        <BrandFeatureRef FeatureId="27"/>
                        <BrandFeatureRef FeatureId="24"/>
                        <BrandFeatureRef FeatureId="21"/>
                        <BrandFeatureRef FeatureId="31"/>
                        <BrandFeatureRef FeatureId="30"/>
                        <BrandFeatureRef FeatureId="1"/>
                        <BrandFeatureRef FeatureId="40"/>
                        <BrandFeatureRef FeatureId="43"/>
                        <BrandFeatureRef FeatureId="38"/>
                        <BrandFeatureRef FeatureId="35"/>
                        <BrandFeatureRef FeatureId="33"/>
                        <BrandFeatureRef FeatureId="44"/>
                        <BrandFeatureRef FeatureId="46"/>
                        <BrandFeatureRef FeatureId="49"/>
                        <BrandFeatureRef FeatureId="52"/>
                        <BrandFeatureRef FeatureId="48"/>
                        <BrandFeatureRef FeatureId="53"/>
                        <BrandFeatureRef FeatureId="55"/>
                      </FareComponent>
                      <FareComponent BrandID="BC" BrandName="BUSINESS CLASSIC" ProgramCode="CFF1S" ProgramDescription="1S" ProgramID="85965" ProgramSystemCode="X">
                        <Segment FlightIndex="1" LegIndex="2"/>
                        <Segment FlightIndex="2" LegIndex="2"/>
                        <BrandFeatureRef FeatureId="5"/>
                        <BrandFeatureRef FeatureId="13"/>
                        <BrandFeatureRef FeatureId="15"/>
                        <BrandFeatureRef FeatureId="18"/>
                        <BrandFeatureRef FeatureId="9"/>
                        <BrandFeatureRef FeatureId="6"/>
                        <BrandFeatureRef FeatureId="8"/>
                        <BrandFeatureRef FeatureId="19"/>
                        <BrandFeatureRef FeatureId="4"/>
                        <BrandFeatureRef FeatureId="12"/>
                        <BrandFeatureRef FeatureId="27"/>
                        <BrandFeatureRef FeatureId="24"/>
                        <BrandFeatureRef FeatureId="21"/>
                        <BrandFeatureRef FeatureId="31"/>
                        <BrandFeatureRef FeatureId="30"/>
                        <BrandFeatureRef FeatureId="1"/>
                        <BrandFeatureRef FeatureId="40"/>
                        <BrandFeatureRef FeatureId="43"/>
                        <BrandFeatureRef FeatureId="38"/>
                        <BrandFeatureRef FeatureId="35"/>
                        <BrandFeatureRef FeatureId="33"/>
                        <BrandFeatureRef FeatureId="44"/>
                        <BrandFeatureRef FeatureId="46"/>
                        <BrandFeatureRef FeatureId="49"/>
                        <BrandFeatureRef FeatureId="52"/>
                        <BrandFeatureRef FeatureId="48"/>
                        <BrandFeatureRef FeatureId="53"/>
                        <BrandFeatureRef FeatureId="55"/>
                      </FareComponent>
                    </FareComponents>
                    <Messages>
                      <Message FailCode="0" Info="EACH CNN REQUIRES ACCOMPANYING SAME CABIN ADT" Type="W"/>
                      <Message FailCode="0" Info="VALIDATING CARRIER" Type="W"/>
                      <Message FailCode="0" Info="BSP - SU" Type="W"/>
                      <Message FailCode="0" Info="RUT - SU" Type="W"/>
                    </Messages>
                    <BaggageInformationList>
                      <BaggageInformation AirlineCode="SU" ProvisionType="A">
                        <Segment Id="0"/>
                        <Segment Id="1"/>
                        <Allowance Description1="UP TO 70 POUNDS/32 KILOGRAMS" Description2="UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS" Pieces="2"/>
                      </BaggageInformation>
                      <BaggageInformation AirlineCode="SU" ProvisionType="A">
                        <Segment Id="2"/>
                        <Segment Id="3"/>
                        <Allowance Description1="UP TO 70 POUNDS/32 KILOGRAMS" Description2="UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS" Pieces="2"/>
                      </BaggageInformation>
                    </BaggageInformationList>
                  </TPA_Extensions>
                </PassengerFare>
                <Endorsements NonRefundableIndicator="false"/>
                <TPA_Extensions>
                  <FareCalcLine Info="LED SU X/MOW SU AER35325SU X/MOW SU LED35325RUB70650END"/>
                </TPA_Extensions>
                <FareInfos>
                  <FareInfo>
                    <FareReference>I</FareReference>
                    <TPA_Extensions>
                      <SeatsRemaining BelowMin="false" Number="8"/>
                      <Cabin Cabin="C"/>
                      <Meal Code="S"/>
                    </TPA_Extensions>
                  </FareInfo>
                  <FareInfo>
                    <FareReference>I</FareReference>
                    <TPA_Extensions>
                      <SeatsRemaining BelowMin="false" Number="6"/>
                      <Cabin Cabin="C"/>
                      <Meal Code="B"/>
                    </TPA_Extensions>
                  </FareInfo>
                  <FareInfo>
                    <FareReference>I</FareReference>
                    <TPA_Extensions>
                      <SeatsRemaining BelowMin="false" Number="3"/>
                      <Cabin Cabin="C"/>
                      <Meal Code="B"/>
                    </TPA_Extensions>
                  </FareInfo>
                  <FareInfo>
                    <FareReference>I</FareReference>
                    <TPA_Extensions>
                      <SeatsRemaining BelowMin="false" Number="8"/>
                      <Cabin Cabin="C"/>
                      <Meal Code="S"/>
                    </TPA_Extensions>
                  </FareInfo>
                </FareInfos>
              </PTC_FareBreakdown>
              <PTC_FareBreakdown>
                <PassengerTypeQuantity Code="INF" Quantity="1"/>
                <FareBasisCodes>
                  <FareBasisCode ArrivalAirportCode="SVO" BookingCode="I" DepartureAirportCode="LED" FareComponentBeginAirport="LED" FareComponentDirectionality="FROM" FareComponentEndAirport="AER" FareComponentFareRule="BCR1" FareComponentFareTariff="304" FareComponentFareType="BX" FareComponentFareTypeBitmap="01" FareComponentVendorCode="ATP" GovCarrier="SU">ICLR/IN00</FareBasisCode>
                  <FareBasisCode ArrivalAirportCode="AER" AvailabilityBreak="true" BookingCode="I" DepartureAirportCode="SVO" GovCarrier="SU">ICLR/IN00</FareBasisCode>
                  <FareBasisCode ArrivalAirportCode="SVO" BookingCode="I" DepartureAirportCode="AER" FareComponentBeginAirport="AER" FareComponentDirectionality="TO" FareComponentEndAirport="LED" FareComponentFareRule="BCR1" FareComponentFareTariff="304" FareComponentFareType="BX" FareComponentFareTypeBitmap="01" FareComponentVendorCode="ATP" GovCarrier="SU">ICLR/IN00</FareBasisCode>
                  <FareBasisCode ArrivalAirportCode="LED" AvailabilityBreak="true" BookingCode="I" DepartureAirportCode="SVO" GovCarrier="SU">ICLR/IN00</FareBasisCode>
                </FareBasisCodes>
                <PassengerFare>
                  <BaseFare Amount="0" CurrencyCode="RUB"/>
                  <FareConstruction Amount="0" CurrencyCode="RUB" DecimalPlaces="0"/>
                  <EquivFare Amount="0" CurrencyCode="RUB" DecimalPlaces="0"/>
                  <TotalFare Amount="0" CurrencyCode="RUB"/>
                  <PenaltiesInfo>
                    <Penalty Amount="2600" Applicability="Before" Changeable="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                    <Penalty Amount="2600" Applicability="After" Changeable="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                    <Penalty Amount="2600" Applicability="Before" CurrencyCode="RUB" DecimalPlaces="0" Refundable="true" Type="Refund"/>
                    <Penalty Amount="2600" Applicability="After" CurrencyCode="RUB" DecimalPlaces="0" Refundable="true" Type="Refund"/>
                  </PenaltiesInfo>
                  <TPA_Extensions>
                    <FareComponents>
                      <FareComponent BrandID="BC" BrandName="BUSINESS CLASSIC" ProgramCode="CFF1S" ProgramDescription="1S" ProgramID="85965" ProgramSystemCode="X">
                        <Segment FlightIndex="1" LegIndex="1"/>
                        <Segment FlightIndex="2" LegIndex="1"/>
                        <BrandFeatureRef FeatureId="5"/>
                        <BrandFeatureRef FeatureId="13"/>
                        <BrandFeatureRef FeatureId="15"/>
                        <BrandFeatureRef FeatureId="18"/>
                        <BrandFeatureRef FeatureId="9"/>
                        <BrandFeatureRef FeatureId="6"/>
                        <BrandFeatureRef FeatureId="8"/>
                        <BrandFeatureRef FeatureId="19"/>
                        <BrandFeatureRef FeatureId="4"/>
                        <BrandFeatureRef FeatureId="12"/>
                        <BrandFeatureRef FeatureId="27"/>
                        <BrandFeatureRef FeatureId="24"/>
                        <BrandFeatureRef FeatureId="21"/>
                        <BrandFeatureRef FeatureId="31"/>
                        <BrandFeatureRef FeatureId="30"/>
                        <BrandFeatureRef FeatureId="1"/>
                        <BrandFeatureRef FeatureId="40"/>
                        <BrandFeatureRef FeatureId="43"/>
                        <BrandFeatureRef FeatureId="38"/>
                        <BrandFeatureRef FeatureId="35"/>
                        <BrandFeatureRef FeatureId="33"/>
                        <BrandFeatureRef FeatureId="44"/>
                        <BrandFeatureRef FeatureId="46"/>
                        <BrandFeatureRef FeatureId="49"/>
                        <BrandFeatureRef FeatureId="52"/>
                        <BrandFeatureRef FeatureId="48"/>
                        <BrandFeatureRef FeatureId="53"/>
                        <BrandFeatureRef FeatureId="55"/>
                      </FareComponent>
                      <FareComponent BrandID="BC" BrandName="BUSINESS CLASSIC" ProgramCode="CFF1S" ProgramDescription="1S" ProgramID="85965" ProgramSystemCode="X">
                        <Segment FlightIndex="1" LegIndex="2"/>
                        <Segment FlightIndex="2" LegIndex="2"/>
                        <BrandFeatureRef FeatureId="5"/>
                        <BrandFeatureRef FeatureId="13"/>
                        <BrandFeatureRef FeatureId="15"/>
                        <BrandFeatureRef FeatureId="18"/>
                        <BrandFeatureRef FeatureId="9"/>
                        <BrandFeatureRef FeatureId="6"/>
                        <BrandFeatureRef FeatureId="8"/>
                        <BrandFeatureRef FeatureId="19"/>
                        <BrandFeatureRef FeatureId="4"/>
                        <BrandFeatureRef FeatureId="12"/>
                        <BrandFeatureRef FeatureId="27"/>
                        <BrandFeatureRef FeatureId="24"/>
                        <BrandFeatureRef FeatureId="21"/>
                        <BrandFeatureRef FeatureId="31"/>
                        <BrandFeatureRef FeatureId="30"/>
                        <BrandFeatureRef FeatureId="1"/>
                        <BrandFeatureRef FeatureId="40"/>
                        <BrandFeatureRef FeatureId="43"/>
                        <BrandFeatureRef FeatureId="38"/>
                        <BrandFeatureRef FeatureId="35"/>
                        <BrandFeatureRef FeatureId="33"/>
                        <BrandFeatureRef FeatureId="44"/>
                        <BrandFeatureRef FeatureId="46"/>
                        <BrandFeatureRef FeatureId="49"/>
                        <BrandFeatureRef FeatureId="52"/>
                        <BrandFeatureRef FeatureId="48"/>
                        <BrandFeatureRef FeatureId="53"/>
                        <BrandFeatureRef FeatureId="55"/>
                      </FareComponent>
                    </FareComponents>
                    <Messages>
                      <Message FailCode="0" Info="EACH INF REQUIRES ACCOMPANYING ADT PASSENGER" Type="W"/>
                      <Message FailCode="0" Info="VALIDATING CARRIER" Type="W"/>
                      <Message FailCode="0" Info="BSP - SU" Type="W"/>
                      <Message FailCode="0" Info="RUT - SU" Type="W"/>
                    </Messages>
                    <BaggageInformationList>
                      <BaggageInformation AirlineCode="SU" ProvisionType="A">
                        <Segment Id="0"/>
                        <Segment Id="1"/>
                        <Allowance Description1="UP TO 22 POUNDS/10 KILOGRAMS" Description2="UP TO 45 LINEAR INCHES/115 LINEAR CENTIMETERS" Pieces="1"/>
                      </BaggageInformation>
                      <BaggageInformation AirlineCode="SU" ProvisionType="A">
                        <Segment Id="2"/>
                        <Segment Id="3"/>
                        <Allowance Description1="UP TO 22 POUNDS/10 KILOGRAMS" Description2="UP TO 45 LINEAR INCHES/115 LINEAR CENTIMETERS" Pieces="1"/>
                      </BaggageInformation>
                    </BaggageInformationList>
                  </TPA_Extensions>
                </PassengerFare>
                <Endorsements NonRefundableIndicator="false"/>
                <TPA_Extensions>
                  <FareCalcLine Info="LED SU X/MOW SU AER0SU X/MOW SU LED0RUB0END"/>
                </TPA_Extensions>
                <FareInfos>
                  <FareInfo>
                    <FareReference>I</FareReference>
                    <TPA_Extensions>
                      <SeatsRemaining BelowMin="false" Number="8"/>
                      <Cabin Cabin="C"/>
                      <Meal Code="S"/>
                    </TPA_Extensions>
                  </FareInfo>
                  <FareInfo>
                    <FareReference>I</FareReference>
                    <TPA_Extensions>
                      <SeatsRemaining BelowMin="false" Number="6"/>
                      <Cabin Cabin="C"/>
                      <Meal Code="B"/>
                    </TPA_Extensions>
                  </FareInfo>
                  <FareInfo>
                    <FareReference>I</FareReference>
                    <TPA_Extensions>
                      <SeatsRemaining BelowMin="false" Number="3"/>
                      <Cabin Cabin="C"/>
                      <Meal Code="B"/>
                    </TPA_Extensions>
                  </FareInfo>
                  <FareInfo>
                    <FareReference>I</FareReference>
                    <TPA_Extensions>
                      <SeatsRemaining BelowMin="false" Number="8"/>
                      <Cabin Cabin="C"/>
                      <Meal Code="S"/>
                    </TPA_Extensions>
                  </FareInfo>
                </FareInfos>
              </PTC_FareBreakdown>
            </PTC_FareBreakdowns>
            <FareInfos>
              <FareInfo>
                <FareReference>I</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="8"/>
                  <Cabin Cabin="C"/>
                  <Meal Code="S"/>
                </TPA_Extensions>
              </FareInfo>
              <FareInfo>
                <FareReference>I</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="6"/>
                  <Cabin Cabin="C"/>
                  <Meal Code="B"/>
                </TPA_Extensions>
              </FareInfo>
              <FareInfo>
                <FareReference>I</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="3"/>
                  <Cabin Cabin="C"/>
                  <Meal Code="B"/>
                </TPA_Extensions>
              </FareInfo>
              <FareInfo>
                <FareReference>I</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="8"/>
                  <Cabin Cabin="C"/>
                  <Meal Code="S"/>
                </TPA_Extensions>
              </FareInfo>
            </FareInfos>
            <TPA_Extensions>
              <DivideInParty Indicator="false"/>
              <ValidatingCarrier NewVcxProcess="true" SettlementMethod="BSP">
                <Default Code="SU"/>
              </ValidatingCarrier>
              <ValidatingCarrier NewVcxProcess="true" SettlementMethod="RUT">
                <Default Code="SU"/>
              </ValidatingCarrier>
            </TPA_Extensions>
          </AirItineraryPricingInfo>
          <TicketingInfo TicketType="eTicket" ValidInterline="Yes"/>
        </AdditionalFares>
        <AdditionalFares>
          <AirItineraryPricingInfo FareReturned="true" LastTicketDate="2020-05-31" LastTicketTime="23:59" PricingSource="WPNI1_ITIN" PricingSubSource="MIP">
            <ItinTotalFare>
              <BaseFare Amount="285650" CurrencyCode="RUB" DecimalPlaces="0"/>
              <FareConstruction Amount="285650" CurrencyCode="RUB" DecimalPlaces="0"/>
              <EquivFare Amount="285650" CurrencyCode="RUB" DecimalPlaces="0"/>
              <Taxes>
                <Tax Amount="42470" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="TOTALTAX"/>
              </Taxes>
              <TotalFare Amount="328120" CurrencyCode="RUB" DecimalPlaces="0"/>
            </ItinTotalFare>
            <PTC_FareBreakdowns>
              <PTC_FareBreakdown>
                <PassengerTypeQuantity Code="ADT" Quantity="2"/>
                <FareBasisCodes>
                  <FareBasisCode ArrivalAirportCode="SVO" BookingCode="I" DepartureAirportCode="LED" FareComponentBeginAirport="LED" FareComponentDirectionality="FROM" FareComponentEndAirport="AER" FareComponentFareRule="BFR1" FareComponentFareTariff="304" FareComponentFareType="BR" FareComponentFareTypeBitmap="00" FareComponentVendorCode="ATP" GovCarrier="SU">IFMR</FareBasisCode>
                  <FareBasisCode ArrivalAirportCode="AER" AvailabilityBreak="true" BookingCode="I" DepartureAirportCode="SVO" GovCarrier="SU">IFMR</FareBasisCode>
                  <FareBasisCode ArrivalAirportCode="SVO" BookingCode="I" DepartureAirportCode="AER" FareComponentBeginAirport="AER" FareComponentDirectionality="TO" FareComponentEndAirport="LED" FareComponentFareRule="BFR1" FareComponentFareTariff="304" FareComponentFareType="BR" FareComponentFareTypeBitmap="00" FareComponentVendorCode="ATP" GovCarrier="SU">IFMR</FareBasisCode>
                  <FareBasisCode ArrivalAirportCode="LED" AvailabilityBreak="true" BookingCode="I" DepartureAirportCode="SVO" GovCarrier="SU">IFMR</FareBasisCode>
                </FareBasisCodes>
                <PassengerFare>
                  <BaseFare Amount="98500" CurrencyCode="RUB"/>
                  <FareConstruction Amount="98500" CurrencyCode="RUB" DecimalPlaces="0"/>
                  <EquivFare Amount="98500" CurrencyCode="RUB" DecimalPlaces="0"/>
                  <Taxes>
                    <Tax Amount="3000" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                    <Tax Amount="3000" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                    <Tax Amount="3000" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                    <Tax Amount="3000" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                    <Tax Amount="270" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRF"/>
                    <Tax Amount="270" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRF"/>
                    <Tax Amount="270" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRF"/>
                    <Tax Amount="270" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRF"/>
                    <Tax Amount="158" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                    <Tax Amount="184" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                    <Tax Amount="120" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                    <Tax Amount="184" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                    <Tax Amount="158" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI4"/>
                    <Tax Amount="184" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI4"/>
                    <Tax Amount="120" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI4"/>
                    <Tax Amount="184" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI4"/>
                    <TaxSummary Amount="12000" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                    <TaxSummary Amount="1080" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRF"/>
                    <TaxSummary Amount="1292" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                    <TotalTax Amount="14372" CurrencyCode="RUB" DecimalPlaces="0"/>
                  </Taxes>
                  <TotalFare Amount="112872" CurrencyCode="RUB"/>
                  <PenaltiesInfo>
                    <Penalty Amount="0" Applicability="Before" Changeable="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                    <Penalty Amount="0" Applicability="After" Changeable="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                    <Penalty Amount="0" Applicability="Before" CurrencyCode="RUB" DecimalPlaces="0" Refundable="true" Type="Refund"/>
                    <Penalty Amount="0" Applicability="After" CurrencyCode="RUB" DecimalPlaces="0" Refundable="true" Type="Refund"/>
                  </PenaltiesInfo>
                  <TPA_Extensions>
                    <FareComponents>
                      <FareComponent BrandID="BL" BrandName="BUSINESS FLEX" ProgramCode="CFF1S" ProgramDescription="1S" ProgramID="85965" ProgramSystemCode="X">
                        <Segment FlightIndex="1" LegIndex="1"/>
                        <Segment FlightIndex="2" LegIndex="1"/>
                        <BrandFeatureRef FeatureId="5"/>
                        <BrandFeatureRef FeatureId="13"/>
                        <BrandFeatureRef FeatureId="15"/>
                        <BrandFeatureRef FeatureId="17"/>
                        <BrandFeatureRef FeatureId="9"/>
                        <BrandFeatureRef FeatureId="6"/>
                        <BrandFeatureRef FeatureId="8"/>
                        <BrandFeatureRef FeatureId="20"/>
                        <BrandFeatureRef FeatureId="3"/>
                        <BrandFeatureRef FeatureId="10"/>
                        <BrandFeatureRef FeatureId="28"/>
                        <BrandFeatureRef FeatureId="23"/>
                        <BrandFeatureRef FeatureId="22"/>
                        <BrandFeatureRef FeatureId="31"/>
                        <BrandFeatureRef FeatureId="30"/>
                        <BrandFeatureRef FeatureId="1"/>
                        <BrandFeatureRef FeatureId="40"/>
                        <BrandFeatureRef FeatureId="43"/>
                        <BrandFeatureRef FeatureId="38"/>
                        <BrandFeatureRef FeatureId="35"/>
                        <BrandFeatureRef FeatureId="33"/>
                        <BrandFeatureRef FeatureId="44"/>
                        <BrandFeatureRef FeatureId="46"/>
                        <BrandFeatureRef FeatureId="49"/>
                        <BrandFeatureRef FeatureId="52"/>
                        <BrandFeatureRef FeatureId="48"/>
                        <BrandFeatureRef FeatureId="53"/>
                        <BrandFeatureRef FeatureId="55"/>
                      </FareComponent>
                      <FareComponent BrandID="BL" BrandName="BUSINESS FLEX" ProgramCode="CFF1S" ProgramDescription="1S" ProgramID="85965" ProgramSystemCode="X">
                        <Segment FlightIndex="1" LegIndex="2"/>
                        <Segment FlightIndex="2" LegIndex="2"/>
                        <BrandFeatureRef FeatureId="5"/>
                        <BrandFeatureRef FeatureId="13"/>
                        <BrandFeatureRef FeatureId="15"/>
                        <BrandFeatureRef FeatureId="17"/>
                        <BrandFeatureRef FeatureId="9"/>
                        <BrandFeatureRef FeatureId="6"/>
                        <BrandFeatureRef FeatureId="8"/>
                        <BrandFeatureRef FeatureId="20"/>
                        <BrandFeatureRef FeatureId="3"/>
                        <BrandFeatureRef FeatureId="10"/>
                        <BrandFeatureRef FeatureId="28"/>
                        <BrandFeatureRef FeatureId="23"/>
                        <BrandFeatureRef FeatureId="22"/>
                        <BrandFeatureRef FeatureId="31"/>
                        <BrandFeatureRef FeatureId="30"/>
                        <BrandFeatureRef FeatureId="1"/>
                        <BrandFeatureRef FeatureId="40"/>
                        <BrandFeatureRef FeatureId="43"/>
                        <BrandFeatureRef FeatureId="38"/>
                        <BrandFeatureRef FeatureId="35"/>
                        <BrandFeatureRef FeatureId="33"/>
                        <BrandFeatureRef FeatureId="44"/>
                        <BrandFeatureRef FeatureId="46"/>
                        <BrandFeatureRef FeatureId="49"/>
                        <BrandFeatureRef FeatureId="52"/>
                        <BrandFeatureRef FeatureId="48"/>
                        <BrandFeatureRef FeatureId="53"/>
                        <BrandFeatureRef FeatureId="55"/>
                      </FareComponent>
                    </FareComponents>
                    <Messages>
                      <Message FailCode="0" Info="VALIDATING CARRIER" Type="W"/>
                      <Message FailCode="0" Info="BSP - SU" Type="W"/>
                      <Message FailCode="0" Info="RUT - SU" Type="W"/>
                    </Messages>
                    <BaggageInformationList>
                      <BaggageInformation AirlineCode="SU" ProvisionType="A">
                        <Segment Id="0"/>
                        <Segment Id="1"/>
                        <Allowance Description1="UP TO 70 POUNDS/32 KILOGRAMS" Description2="UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS" Pieces="2"/>
                      </BaggageInformation>
                      <BaggageInformation AirlineCode="SU" ProvisionType="A">
                        <Segment Id="2"/>
                        <Segment Id="3"/>
                        <Allowance Description1="UP TO 70 POUNDS/32 KILOGRAMS" Description2="UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS" Pieces="2"/>
                      </BaggageInformation>
                    </BaggageInformationList>
                  </TPA_Extensions>
                </PassengerFare>
                <Endorsements NonRefundableIndicator="false"/>
                <TPA_Extensions>
                  <FareCalcLine Info="LED SU X/MOW SU AER49250SU X/MOW SU LED49250RUB98500END"/>
                </TPA_Extensions>
                <FareInfos>
                  <FareInfo>
                    <FareReference>I</FareReference>
                    <TPA_Extensions>
                      <SeatsRemaining BelowMin="false" Number="8"/>
                      <Cabin Cabin="C"/>
                      <Meal Code="S"/>
                    </TPA_Extensions>
                  </FareInfo>
                  <FareInfo>
                    <FareReference>I</FareReference>
                    <TPA_Extensions>
                      <SeatsRemaining BelowMin="false" Number="6"/>
                      <Cabin Cabin="C"/>
                      <Meal Code="B"/>
                    </TPA_Extensions>
                  </FareInfo>
                  <FareInfo>
                    <FareReference>I</FareReference>
                    <TPA_Extensions>
                      <SeatsRemaining BelowMin="false" Number="3"/>
                      <Cabin Cabin="C"/>
                      <Meal Code="B"/>
                    </TPA_Extensions>
                  </FareInfo>
                  <FareInfo>
                    <FareReference>I</FareReference>
                    <TPA_Extensions>
                      <SeatsRemaining BelowMin="false" Number="8"/>
                      <Cabin Cabin="C"/>
                      <Meal Code="S"/>
                    </TPA_Extensions>
                  </FareInfo>
                </FareInfos>
              </PTC_FareBreakdown>
              <PTC_FareBreakdown>
                <PassengerTypeQuantity Code="CNN" Quantity="1"/>
                <FareBasisCodes>
                  <FareBasisCode ArrivalAirportCode="SVO" BookingCode="I" DepartureAirportCode="LED" FareComponentBeginAirport="LED" FareComponentDirectionality="FROM" FareComponentEndAirport="AER" FareComponentFareRule="BFR1" FareComponentFareTariff="304" FareComponentFareType="BR" FareComponentFareTypeBitmap="01" FareComponentVendorCode="ATP" GovCarrier="SU">IFMR/CH10</FareBasisCode>
                  <FareBasisCode ArrivalAirportCode="AER" AvailabilityBreak="true" BookingCode="I" DepartureAirportCode="SVO" GovCarrier="SU">IFMR/CH10</FareBasisCode>
                  <FareBasisCode ArrivalAirportCode="SVO" BookingCode="I" DepartureAirportCode="AER" FareComponentBeginAirport="AER" FareComponentDirectionality="TO" FareComponentEndAirport="LED" FareComponentFareRule="BFR1" FareComponentFareTariff="304" FareComponentFareType="BR" FareComponentFareTypeBitmap="01" FareComponentVendorCode="ATP" GovCarrier="SU">IFMR/CH10</FareBasisCode>
                  <FareBasisCode ArrivalAirportCode="LED" AvailabilityBreak="true" BookingCode="I" DepartureAirportCode="SVO" GovCarrier="SU">IFMR/CH10</FareBasisCode>
                </FareBasisCodes>
                <PassengerFare>
                  <BaseFare Amount="88650" CurrencyCode="RUB"/>
                  <FareConstruction Amount="88650" CurrencyCode="RUB" DecimalPlaces="0"/>
                  <EquivFare Amount="88650" CurrencyCode="RUB" DecimalPlaces="0"/>
                  <Taxes>
                    <Tax Amount="3000" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                    <Tax Amount="3000" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                    <Tax Amount="3000" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                    <Tax Amount="3000" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                    <Tax Amount="270" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRF"/>
                    <Tax Amount="270" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRF"/>
                    <Tax Amount="270" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRF"/>
                    <Tax Amount="270" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRF"/>
                    <Tax Amount="79" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                    <Tax Amount="92" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                    <Tax Amount="60" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                    <Tax Amount="92" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                    <Tax Amount="79" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI4"/>
                    <Tax Amount="92" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI4"/>
                    <Tax Amount="60" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI4"/>
                    <Tax Amount="92" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI4"/>
                    <TaxSummary Amount="12000" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                    <TaxSummary Amount="1080" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRF"/>
                    <TaxSummary Amount="646" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                    <TotalTax Amount="13726" CurrencyCode="RUB" DecimalPlaces="0"/>
                  </Taxes>
                  <TotalFare Amount="102376" CurrencyCode="RUB"/>
                  <PenaltiesInfo>
                    <Penalty Amount="0" Applicability="Before" Changeable="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                    <Penalty Amount="0" Applicability="After" Changeable="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                    <Penalty Amount="0" Applicability="Before" CurrencyCode="RUB" DecimalPlaces="0" Refundable="true" Type="Refund"/>
                    <Penalty Amount="0" Applicability="After" CurrencyCode="RUB" DecimalPlaces="0" Refundable="true" Type="Refund"/>
                  </PenaltiesInfo>
                  <TPA_Extensions>
                    <FareComponents>
                      <FareComponent BrandID="BL" BrandName="BUSINESS FLEX" ProgramCode="CFF1S" ProgramDescription="1S" ProgramID="85965" ProgramSystemCode="X">
                        <Segment FlightIndex="1" LegIndex="1"/>
                        <Segment FlightIndex="2" LegIndex="1"/>
                        <BrandFeatureRef FeatureId="5"/>
                        <BrandFeatureRef FeatureId="13"/>
                        <BrandFeatureRef FeatureId="15"/>
                        <BrandFeatureRef FeatureId="17"/>
                        <BrandFeatureRef FeatureId="9"/>
                        <BrandFeatureRef FeatureId="6"/>
                        <BrandFeatureRef FeatureId="8"/>
                        <BrandFeatureRef FeatureId="20"/>
                        <BrandFeatureRef FeatureId="3"/>
                        <BrandFeatureRef FeatureId="10"/>
                        <BrandFeatureRef FeatureId="28"/>
                        <BrandFeatureRef FeatureId="23"/>
                        <BrandFeatureRef FeatureId="22"/>
                        <BrandFeatureRef FeatureId="31"/>
                        <BrandFeatureRef FeatureId="30"/>
                        <BrandFeatureRef FeatureId="1"/>
                        <BrandFeatureRef FeatureId="40"/>
                        <BrandFeatureRef FeatureId="43"/>
                        <BrandFeatureRef FeatureId="38"/>
                        <BrandFeatureRef FeatureId="35"/>
                        <BrandFeatureRef FeatureId="33"/>
                        <BrandFeatureRef FeatureId="44"/>
                        <BrandFeatureRef FeatureId="46"/>
                        <BrandFeatureRef FeatureId="49"/>
                        <BrandFeatureRef FeatureId="52"/>
                        <BrandFeatureRef FeatureId="48"/>
                        <BrandFeatureRef FeatureId="53"/>
                        <BrandFeatureRef FeatureId="55"/>
                      </FareComponent>
                      <FareComponent BrandID="BL" BrandName="BUSINESS FLEX" ProgramCode="CFF1S" ProgramDescription="1S" ProgramID="85965" ProgramSystemCode="X">
                        <Segment FlightIndex="1" LegIndex="2"/>
                        <Segment FlightIndex="2" LegIndex="2"/>
                        <BrandFeatureRef FeatureId="5"/>
                        <BrandFeatureRef FeatureId="13"/>
                        <BrandFeatureRef FeatureId="15"/>
                        <BrandFeatureRef FeatureId="17"/>
                        <BrandFeatureRef FeatureId="9"/>
                        <BrandFeatureRef FeatureId="6"/>
                        <BrandFeatureRef FeatureId="8"/>
                        <BrandFeatureRef FeatureId="20"/>
                        <BrandFeatureRef FeatureId="3"/>
                        <BrandFeatureRef FeatureId="10"/>
                        <BrandFeatureRef FeatureId="28"/>
                        <BrandFeatureRef FeatureId="23"/>
                        <BrandFeatureRef FeatureId="22"/>
                        <BrandFeatureRef FeatureId="31"/>
                        <BrandFeatureRef FeatureId="30"/>
                        <BrandFeatureRef FeatureId="1"/>
                        <BrandFeatureRef FeatureId="40"/>
                        <BrandFeatureRef FeatureId="43"/>
                        <BrandFeatureRef FeatureId="38"/>
                        <BrandFeatureRef FeatureId="35"/>
                        <BrandFeatureRef FeatureId="33"/>
                        <BrandFeatureRef FeatureId="44"/>
                        <BrandFeatureRef FeatureId="46"/>
                        <BrandFeatureRef FeatureId="49"/>
                        <BrandFeatureRef FeatureId="52"/>
                        <BrandFeatureRef FeatureId="48"/>
                        <BrandFeatureRef FeatureId="53"/>
                        <BrandFeatureRef FeatureId="55"/>
                      </FareComponent>
                    </FareComponents>
                    <Messages>
                      <Message FailCode="0" Info="EACH CNN REQUIRES ACCOMPANYING SAME CABIN ADT" Type="W"/>
                      <Message FailCode="0" Info="VALIDATING CARRIER" Type="W"/>
                      <Message FailCode="0" Info="BSP - SU" Type="W"/>
                      <Message FailCode="0" Info="RUT - SU" Type="W"/>
                    </Messages>
                    <BaggageInformationList>
                      <BaggageInformation AirlineCode="SU" ProvisionType="A">
                        <Segment Id="0"/>
                        <Segment Id="1"/>
                        <Allowance Description1="UP TO 70 POUNDS/32 KILOGRAMS" Description2="UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS" Pieces="2"/>
                      </BaggageInformation>
                      <BaggageInformation AirlineCode="SU" ProvisionType="A">
                        <Segment Id="2"/>
                        <Segment Id="3"/>
                        <Allowance Description1="UP TO 70 POUNDS/32 KILOGRAMS" Description2="UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS" Pieces="2"/>
                      </BaggageInformation>
                    </BaggageInformationList>
                  </TPA_Extensions>
                </PassengerFare>
                <Endorsements NonRefundableIndicator="false"/>
                <TPA_Extensions>
                  <FareCalcLine Info="LED SU X/MOW SU AER44325SU X/MOW SU LED44325RUB88650END"/>
                </TPA_Extensions>
                <FareInfos>
                  <FareInfo>
                    <FareReference>I</FareReference>
                    <TPA_Extensions>
                      <SeatsRemaining BelowMin="false" Number="8"/>
                      <Cabin Cabin="C"/>
                      <Meal Code="S"/>
                    </TPA_Extensions>
                  </FareInfo>
                  <FareInfo>
                    <FareReference>I</FareReference>
                    <TPA_Extensions>
                      <SeatsRemaining BelowMin="false" Number="6"/>
                      <Cabin Cabin="C"/>
                      <Meal Code="B"/>
                    </TPA_Extensions>
                  </FareInfo>
                  <FareInfo>
                    <FareReference>I</FareReference>
                    <TPA_Extensions>
                      <SeatsRemaining BelowMin="false" Number="3"/>
                      <Cabin Cabin="C"/>
                      <Meal Code="B"/>
                    </TPA_Extensions>
                  </FareInfo>
                  <FareInfo>
                    <FareReference>I</FareReference>
                    <TPA_Extensions>
                      <SeatsRemaining BelowMin="false" Number="8"/>
                      <Cabin Cabin="C"/>
                      <Meal Code="S"/>
                    </TPA_Extensions>
                  </FareInfo>
                </FareInfos>
              </PTC_FareBreakdown>
              <PTC_FareBreakdown>
                <PassengerTypeQuantity Code="INF" Quantity="1"/>
                <FareBasisCodes>
                  <FareBasisCode ArrivalAirportCode="SVO" BookingCode="I" DepartureAirportCode="LED" FareComponentBeginAirport="LED" FareComponentDirectionality="FROM" FareComponentEndAirport="AER" FareComponentFareRule="BFR1" FareComponentFareTariff="304" FareComponentFareType="BR" FareComponentFareTypeBitmap="01" FareComponentVendorCode="ATP" GovCarrier="SU">IFMR/IN00</FareBasisCode>
                  <FareBasisCode ArrivalAirportCode="AER" AvailabilityBreak="true" BookingCode="I" DepartureAirportCode="SVO" GovCarrier="SU">IFMR/IN00</FareBasisCode>
                  <FareBasisCode ArrivalAirportCode="SVO" BookingCode="I" DepartureAirportCode="AER" FareComponentBeginAirport="AER" FareComponentDirectionality="TO" FareComponentEndAirport="LED" FareComponentFareRule="BFR1" FareComponentFareTariff="304" FareComponentFareType="BR" FareComponentFareTypeBitmap="01" FareComponentVendorCode="ATP" GovCarrier="SU">IFMR/IN00</FareBasisCode>
                  <FareBasisCode ArrivalAirportCode="LED" AvailabilityBreak="true" BookingCode="I" DepartureAirportCode="SVO" GovCarrier="SU">IFMR/IN00</FareBasisCode>
                </FareBasisCodes>
                <PassengerFare>
                  <BaseFare Amount="0" CurrencyCode="RUB"/>
                  <FareConstruction Amount="0" CurrencyCode="RUB" DecimalPlaces="0"/>
                  <EquivFare Amount="0" CurrencyCode="RUB" DecimalPlaces="0"/>
                  <TotalFare Amount="0" CurrencyCode="RUB"/>
                  <PenaltiesInfo>
                    <Penalty Amount="0" Applicability="Before" Changeable="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                    <Penalty Amount="0" Applicability="After" Changeable="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                    <Penalty Amount="0" Applicability="Before" CurrencyCode="RUB" DecimalPlaces="0" Refundable="true" Type="Refund"/>
                    <Penalty Amount="0" Applicability="After" CurrencyCode="RUB" DecimalPlaces="0" Refundable="true" Type="Refund"/>
                  </PenaltiesInfo>
                  <TPA_Extensions>
                    <FareComponents>
                      <FareComponent BrandID="BL" BrandName="BUSINESS FLEX" ProgramCode="CFF1S" ProgramDescription="1S" ProgramID="85965" ProgramSystemCode="X">
                        <Segment FlightIndex="1" LegIndex="1"/>
                        <Segment FlightIndex="2" LegIndex="1"/>
                        <BrandFeatureRef FeatureId="5"/>
                        <BrandFeatureRef FeatureId="13"/>
                        <BrandFeatureRef FeatureId="15"/>
                        <BrandFeatureRef FeatureId="17"/>
                        <BrandFeatureRef FeatureId="9"/>
                        <BrandFeatureRef FeatureId="6"/>
                        <BrandFeatureRef FeatureId="8"/>
                        <BrandFeatureRef FeatureId="20"/>
                        <BrandFeatureRef FeatureId="3"/>
                        <BrandFeatureRef FeatureId="10"/>
                        <BrandFeatureRef FeatureId="28"/>
                        <BrandFeatureRef FeatureId="23"/>
                        <BrandFeatureRef FeatureId="22"/>
                        <BrandFeatureRef FeatureId="31"/>
                        <BrandFeatureRef FeatureId="30"/>
                        <BrandFeatureRef FeatureId="1"/>
                        <BrandFeatureRef FeatureId="40"/>
                        <BrandFeatureRef FeatureId="43"/>
                        <BrandFeatureRef FeatureId="38"/>
                        <BrandFeatureRef FeatureId="35"/>
                        <BrandFeatureRef FeatureId="33"/>
                        <BrandFeatureRef FeatureId="44"/>
                        <BrandFeatureRef FeatureId="46"/>
                        <BrandFeatureRef FeatureId="49"/>
                        <BrandFeatureRef FeatureId="52"/>
                        <BrandFeatureRef FeatureId="48"/>
                        <BrandFeatureRef FeatureId="53"/>
                        <BrandFeatureRef FeatureId="55"/>
                      </FareComponent>
                      <FareComponent BrandID="BL" BrandName="BUSINESS FLEX" ProgramCode="CFF1S" ProgramDescription="1S" ProgramID="85965" ProgramSystemCode="X">
                        <Segment FlightIndex="1" LegIndex="2"/>
                        <Segment FlightIndex="2" LegIndex="2"/>
                        <BrandFeatureRef FeatureId="5"/>
                        <BrandFeatureRef FeatureId="13"/>
                        <BrandFeatureRef FeatureId="15"/>
                        <BrandFeatureRef FeatureId="17"/>
                        <BrandFeatureRef FeatureId="9"/>
                        <BrandFeatureRef FeatureId="6"/>
                        <BrandFeatureRef FeatureId="8"/>
                        <BrandFeatureRef FeatureId="20"/>
                        <BrandFeatureRef FeatureId="3"/>
                        <BrandFeatureRef FeatureId="10"/>
                        <BrandFeatureRef FeatureId="28"/>
                        <BrandFeatureRef FeatureId="23"/>
                        <BrandFeatureRef FeatureId="22"/>
                        <BrandFeatureRef FeatureId="31"/>
                        <BrandFeatureRef FeatureId="30"/>
                        <BrandFeatureRef FeatureId="1"/>
                        <BrandFeatureRef FeatureId="40"/>
                        <BrandFeatureRef FeatureId="43"/>
                        <BrandFeatureRef FeatureId="38"/>
                        <BrandFeatureRef FeatureId="35"/>
                        <BrandFeatureRef FeatureId="33"/>
                        <BrandFeatureRef FeatureId="44"/>
                        <BrandFeatureRef FeatureId="46"/>
                        <BrandFeatureRef FeatureId="49"/>
                        <BrandFeatureRef FeatureId="52"/>
                        <BrandFeatureRef FeatureId="48"/>
                        <BrandFeatureRef FeatureId="53"/>
                        <BrandFeatureRef FeatureId="55"/>
                      </FareComponent>
                    </FareComponents>
                    <Messages>
                      <Message FailCode="0" Info="EACH INF REQUIRES ACCOMPANYING ADT PASSENGER" Type="W"/>
                      <Message FailCode="0" Info="VALIDATING CARRIER" Type="W"/>
                      <Message FailCode="0" Info="BSP - SU" Type="W"/>
                      <Message FailCode="0" Info="RUT - SU" Type="W"/>
                    </Messages>
                    <BaggageInformationList>
                      <BaggageInformation AirlineCode="SU" ProvisionType="A">
                        <Segment Id="0"/>
                        <Segment Id="1"/>
                        <Allowance Description1="UP TO 22 POUNDS/10 KILOGRAMS" Description2="UP TO 45 LINEAR INCHES/115 LINEAR CENTIMETERS" Pieces="1"/>
                      </BaggageInformation>
                      <BaggageInformation AirlineCode="SU" ProvisionType="A">
                        <Segment Id="2"/>
                        <Segment Id="3"/>
                        <Allowance Description1="UP TO 22 POUNDS/10 KILOGRAMS" Description2="UP TO 45 LINEAR INCHES/115 LINEAR CENTIMETERS" Pieces="1"/>
                      </BaggageInformation>
                    </BaggageInformationList>
                  </TPA_Extensions>
                </PassengerFare>
                <Endorsements NonRefundableIndicator="false"/>
                <TPA_Extensions>
                  <FareCalcLine Info="LED SU X/MOW SU AER0SU X/MOW SU LED0RUB0END"/>
                </TPA_Extensions>
                <FareInfos>
                  <FareInfo>
                    <FareReference>I</FareReference>
                    <TPA_Extensions>
                      <SeatsRemaining BelowMin="false" Number="8"/>
                      <Cabin Cabin="C"/>
                      <Meal Code="S"/>
                    </TPA_Extensions>
                  </FareInfo>
                  <FareInfo>
                    <FareReference>I</FareReference>
                    <TPA_Extensions>
                      <SeatsRemaining BelowMin="false" Number="6"/>
                      <Cabin Cabin="C"/>
                      <Meal Code="B"/>
                    </TPA_Extensions>
                  </FareInfo>
                  <FareInfo>
                    <FareReference>I</FareReference>
                    <TPA_Extensions>
                      <SeatsRemaining BelowMin="false" Number="3"/>
                      <Cabin Cabin="C"/>
                      <Meal Code="B"/>
                    </TPA_Extensions>
                  </FareInfo>
                  <FareInfo>
                    <FareReference>I</FareReference>
                    <TPA_Extensions>
                      <SeatsRemaining BelowMin="false" Number="8"/>
                      <Cabin Cabin="C"/>
                      <Meal Code="S"/>
                    </TPA_Extensions>
                  </FareInfo>
                </FareInfos>
              </PTC_FareBreakdown>
            </PTC_FareBreakdowns>
            <FareInfos>
              <FareInfo>
                <FareReference>I</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="8"/>
                  <Cabin Cabin="C"/>
                  <Meal Code="S"/>
                </TPA_Extensions>
              </FareInfo>
              <FareInfo>
                <FareReference>I</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="6"/>
                  <Cabin Cabin="C"/>
                  <Meal Code="B"/>
                </TPA_Extensions>
              </FareInfo>
              <FareInfo>
                <FareReference>I</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="3"/>
                  <Cabin Cabin="C"/>
                  <Meal Code="B"/>
                </TPA_Extensions>
              </FareInfo>
              <FareInfo>
                <FareReference>I</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="8"/>
                  <Cabin Cabin="C"/>
                  <Meal Code="S"/>
                </TPA_Extensions>
              </FareInfo>
            </FareInfos>
            <TPA_Extensions>
              <DivideInParty Indicator="false"/>
              <ValidatingCarrier NewVcxProcess="true" SettlementMethod="BSP">
                <Default Code="SU"/>
              </ValidatingCarrier>
              <ValidatingCarrier NewVcxProcess="true" SettlementMethod="RUT">
                <Default Code="SU"/>
              </ValidatingCarrier>
            </TPA_Extensions>
          </AirItineraryPricingInfo>
          <TicketingInfo TicketType="eTicket" ValidInterline="Yes"/>
        </AdditionalFares>
        <ValidatingCarrier Code="SU"/>
      </TPA_Extensions>
    </PricedItinerary>
  </PricedItineraries>
  <TPA_Extensions>
    <AirlineOrderList>
      <AirlineOrder Code="SU" SequenceNumber="1"/>
    </AirlineOrderList>
  </TPA_Extensions>
</OTA_AirLowFareSearchRS>
{% endxmlsec %}

---

{% xmlsec "Пример запроса (оформление на нескольких билетах (SOW))", false %}
<OTA_AirLowFareSearchRQ ResponseType="OTA" Version="6.1.0" xmlns="http://www.opentravel.org/OTA/2003/05">
  <POS>
    <Source PseudoCityCode="9LSC">
      <RequestorID ID="1" Type="1">
        <CompanyName Code="TN"/>
      </RequestorID>
    </Source>
  </POS>
  <OriginDestinationInformation RPH="1">
    <DepartureDateTime>2020-09-01T05:00:00</DepartureDateTime>
    <OriginLocation LocationCode="LED"/>
    <DestinationLocation LocationCode="AER"/>
    <TPA_Extensions>
      <Flight ArrivalDateTime="2020-09-01T06:25:00" ClassOfService="Y" DepartureDateTime="2020-09-01T05:00:00" Number="35" Type="A">
        <OriginLocation LocationCode="LED"/>
        <DestinationLocation LocationCode="SVO"/>
        <Airline Marketing="SU" Operating="SU"/>
      </Flight>
      <Flight ArrivalDateTime="2020-09-01T10:15:00" ClassOfService="Y" DepartureDateTime="2020-09-01T07:45:00" Number="1138" Type="A">
        <OriginLocation LocationCode="SVO"/>
        <DestinationLocation LocationCode="AER"/>
        <Airline Marketing="SU" Operating="SU"/>
      </Flight>
    </TPA_Extensions>
  </OriginDestinationInformation>
  <OriginDestinationInformation RPH="2">
    <DepartureDateTime>2020-09-08T06:50:00</DepartureDateTime>
    <OriginLocation LocationCode="AER"/>
    <DestinationLocation LocationCode="LED"/>
    <TPA_Extensions>
      <Flight ArrivalDateTime="2020-09-08T09:20:00" ClassOfService="Y" DepartureDateTime="2020-09-08T06:50:00" Number="1141" Type="A">
        <OriginLocation LocationCode="AER"/>
        <DestinationLocation LocationCode="SVO"/>
        <Airline Marketing="SU" Operating="SU"/>
      </Flight>
      <Flight ArrivalDateTime="2020-09-08T12:20:00" ClassOfService="Y" DepartureDateTime="2020-09-08T10:55:00" Number="14" Type="A">
        <OriginLocation LocationCode="SVO"/>
        <DestinationLocation LocationCode="LED"/>
        <Airline Marketing="SU" Operating="SU"/>
      </Flight>
    </TPA_Extensions>
  </OriginDestinationInformation>
  <TravelPreferences>
    <TPA_Extensions>
      <VerificationItinCallLogic Value="L"/>
    </TPA_Extensions>
    <Baggage Description="true" RequestType="A"/>
  </TravelPreferences>
  <TravelerInfoSummary>
    <SeatsRequested>3</SeatsRequested>
    <AirTravelerAvail>
      <PassengerTypeQuantity Code="ADT" Quantity="2">
        <TPA_Extensions>
          <VoluntaryChanges Match="Info"/>
        </TPA_Extensions>
      </PassengerTypeQuantity>
      <PassengerTypeQuantity Code="CNN" Quantity="1">
        <TPA_Extensions>
          <VoluntaryChanges Match="Info"/>
        </TPA_Extensions>
      </PassengerTypeQuantity>
      <PassengerTypeQuantity Code="INF" Quantity="1">
        <TPA_Extensions>
          <VoluntaryChanges Match="Info"/>
        </TPA_Extensions>
      </PassengerTypeQuantity>
    </AirTravelerAvail>
    <PriceRequestInformation>
      <TPA_Extensions>
        <BrandedFareIndicators ReturnBrandAncillaries="true" SingleBrandedFare="true"/>
      </TPA_Extensions>
    </PriceRequestInformation>
  </TravelerInfoSummary>
  <TPA_Extensions>
    <MultiTicket DisplayPolicy="SOW"/>
  </TPA_Extensions>
</OTA_AirLowFareSearchRQ>
{% endxmlsec %}

{% xmlsec "Пример ответа", false %}
<OTA_AirLowFareSearchRS AvailableItinCount="0" BrandedOneWayItinCount="0" DepartedItinCount="0" PricedItinCount="1" SimpleOneWayItinCount="2" SoldOutItinCount="0" Version="6.1.0" xmlns="http://www.opentravel.org/OTA/2003/05" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <Success/>
  <Warnings>
    <Warning Code="TRANSACTIONID" MessageClass="I" ShortText="1675674547784536483" Type="WORKERTHREAD"/>
    <Warning Code="ASEPT2LAPP00309.IDM.SGDCPROD.SABRE.COM" MessageClass="I" ShortText="27037" Type="SERVER"/>
    <Warning Code="RULEID" MessageClass="I" ShortText="24113" Type="DRE"/>
    <Warning Code="RULEID" MessageClass="I" ShortText="24111" Type="DEFAULT"/>
  </Warnings>
  <BrandFeatures>
    <BrandFeature Application="C" CommercialName="BASIC SEAT" Id="1" ServiceGroup="BF" ServiceType="Z" SubCode="050" Vendor="ATP"/>
    <BrandFeature Application="C" CommercialName="CHANGEABLE TICKET" Id="2" ServiceGroup="BF" ServiceType="Z" SubCode="059" Vendor="ATP"/>
    <BrandFeature Application="N" CommercialName="25 PERCENT MILES EARNED" Id="3" ServiceGroup="BF" ServiceType="Z" SubCode="06A" Vendor="ATP"/>
    <BrandFeature Application="N" CommercialName="150 PERCENT MILES EARNED" Id="4" ServiceGroup="BF" ServiceType="Z" SubCode="06M" Vendor="ATP"/>
    <BrandFeature Application="N" CommercialName="200 PERCENT MILES EARNED" Id="5" ServiceGroup="BF" ServiceType="Z" SubCode="06N" Vendor="ATP"/>
    <BrandFeature Application="N" CommercialName="125 MILES EARNED" Id="6" ServiceGroup="BF" ServiceType="Z" SubCode="06Y" Vendor="ATP"/>
    <BrandFeature Application="N" CommercialName="CHANGE IN CASE OF NO SHOW" Id="7" ServiceGroup="BF" ServiceType="Z" SubCode="CNS" Vendor="ATP"/>
    <BrandFeature Application="F" CommercialName="75 TO 125 PCNT MILES EARNED" Id="8" ServiceGroup="BF" ServiceType="Z" SubCode="ME1" Vendor="ATP"/>
    <BrandFeature Application="N" CommercialName="100 TO 150 PCNT MILES EARNED" Id="9" ServiceGroup="BF" ServiceType="Z" SubCode="ME2" Vendor="ATP"/>
    <BrandFeature Application="N" CommercialName="150 TO 200 PCNT MILES EARNED" Id="10" ServiceGroup="BF" ServiceType="Z" SubCode="ME3" Vendor="ATP"/>
    <BrandFeature Application="N" CommercialName="200 TO 250 PCNT MILES EARNED" Id="11" ServiceGroup="BF" ServiceType="Z" SubCode="ME4" Vendor="ATP"/>
    <BrandFeature Application="N" CommercialName="OPEN RETURN DATE" Id="12" ServiceGroup="BF" ServiceType="Z" SubCode="ORD" Vendor="ATP"/>
    <BrandFeature Application="N" CommercialName="REFUND AFTER CHECKIN CLOSURE" Id="13" ServiceGroup="BF" ServiceType="Z" SubCode="RBA" Vendor="ATP"/>
    <BrandFeature Application="N" CommercialName="REFUND BEFORE CHECKIN CLOSURE" Id="14" ServiceGroup="BF" ServiceType="Z" SubCode="RBC" Vendor="ATP"/>
    <BrandFeature Application="N" CommercialName="STOPOVER" Id="15" ServiceGroup="BF" ServiceType="Z" SubCode="STO" Vendor="ATP"/>
    <BrandFeature Application="C" CommercialName="UPGRADE AT CHECKIN TO COMFORT" Id="16" ServiceGroup="BF" ServiceType="Z" SubCode="UT2" Vendor="ATP"/>
    <BrandFeature Application="C" CommercialName="SECOND EXCESS BAG" Id="17" ServiceGroup="BG" ServiceType="C" SubCode="0CD" Vendor="ATP"/>
    <BrandFeature Application="N" CommercialName="UPTO70LB 32KG AND62LI 158LCM" Id="18" ServiceGroup="BG" ServiceType="C" SubCode="0FM" Vendor="ATP"/>
    <BrandFeature Application="C" CommercialName="UPTO50LB 23KG AND62LI 158LCM" Id="19" ServiceGroup="BG" ServiceType="C" SubCode="0GO" Vendor="ATP"/>
    <BrandFeature Application="F" CommercialName="CARRY10KG 22LBUPTO 55X40X25CM" Id="20" ServiceGroup="BG" ServiceType="C" SubCode="0MJ" Vendor="ATP"/>
    <BrandFeature Application="N" CommercialName="CARRY15KG 33LBUPTO 55X40X25CM" Id="21" ServiceGroup="BG" ServiceType="C" SubCode="0MK" Vendor="ATP"/>
    <BrandFeature Application="C" CommercialName="INTERNET ACCESS" Id="22" ServiceGroup="IE" ServiceType="F" SubCode="0CL" Vendor="ATP"/>
    <BrandFeature Application="N" CommercialName="LOUNGE ACCESS" Id="23" ServiceGroup="LG" ServiceType="F" SubCode="0BX" Vendor="ATP"/>
    <BrandFeature Application="N" CommercialName="PRIORITY CHECK IN" Id="24" ServiceGroup="TS" ServiceType="F" SubCode="03P" Vendor="ATP"/>
    <BrandFeature Application="N" CommercialName="PRIORITY BOARDING" Id="25" ServiceGroup="TS" ServiceType="F" SubCode="0G6" Vendor="ATP"/>
    <BrandFeature Application="N" CommercialName="PRIORITY BAGGAGE" Id="26" ServiceGroup="TS" ServiceType="F" SubCode="0LF" Vendor="ATP"/>
    <BrandFeature Application="N" CommercialName="UPGRADE WITH MILES BONUS" Id="27" ServiceGroup="UP" ServiceType="F" SubCode="0NI" Vendor="ATP"/>
    <BrandFeature Application="C" CommercialName="UPGRADE AT CHECKIN TO BUSINESS" Id="28" ServiceGroup="UP" ServiceType="F" SubCode="UPF" Vendor="ATP"/>
  </BrandFeatures>
  <PricedItineraries>
    <PricedItinerary SequenceNumber="1">
      <AirItinerary DirectionInd="Return">
        <OriginDestinationOptions>
          <OriginDestinationOption ArrivalCountry="RU" DepartureCountry="RU" ElapsedTime="315">
            <FlightSegment ArrivalDateTime="2020-09-01T06:25:00" DepartureDateTime="2020-09-01T05:00:00" ElapsedTime="85" FlightNumber="35" ResBookDesigCode="N" StopQuantity="0">
              <DepartureAirport LocationCode="LED" TerminalID="1"/>
              <ArrivalAirport LocationCode="SVO" TerminalID="B"/>
              <OperatingAirline Code="SU" FlightNumber="35"/>
              <Equipment AirEquipType="320"/>
              <MarketingAirline Code="SU"/>
              <MarriageGrp>O</MarriageGrp>
              <DepartureTimeZone GMTOffset="3"/>
              <ArrivalTimeZone GMTOffset="3"/>
              <TPA_Extensions>
                <eTicket Ind="true"/>
                <Mileage Amount="372"/>
              </TPA_Extensions>
            </FlightSegment>
            <FlightSegment ArrivalDateTime="2020-09-01T10:15:00" DepartureDateTime="2020-09-01T07:40:00" ElapsedTime="155" FlightNumber="1138" ResBookDesigCode="N" StopQuantity="0">
              <DepartureAirport LocationCode="SVO" TerminalID="B"/>
              <ArrivalAirport LocationCode="AER"/>
              <OperatingAirline Code="SU" FlightNumber="1138"/>
              <Equipment AirEquipType="73H"/>
              <MarketingAirline Code="SU"/>
              <MarriageGrp>I</MarriageGrp>
              <DepartureTimeZone GMTOffset="3"/>
              <ArrivalTimeZone GMTOffset="3"/>
              <TPA_Extensions>
                <eTicket Ind="true"/>
                <Mileage Amount="873"/>
              </TPA_Extensions>
            </FlightSegment>
          </OriginDestinationOption>
          <OriginDestinationOption ArrivalCountry="RU" DepartureCountry="RU" ElapsedTime="345">
            <FlightSegment ArrivalDateTime="2020-09-08T08:45:00" DepartureDateTime="2020-09-08T06:20:00" ElapsedTime="145" FlightNumber="1141" ResBookDesigCode="T" StopQuantity="0">
              <DepartureAirport LocationCode="AER"/>
              <ArrivalAirport LocationCode="SVO" TerminalID="B"/>
              <OperatingAirline Code="SU" FlightNumber="1141"/>
              <Equipment AirEquipType="32A"/>
              <MarketingAirline Code="SU"/>
              <MarriageGrp>O</MarriageGrp>
              <DepartureTimeZone GMTOffset="3"/>
              <ArrivalTimeZone GMTOffset="3"/>
              <TPA_Extensions>
                <eTicket Ind="true"/>
                <Mileage Amount="873"/>
              </TPA_Extensions>
            </FlightSegment>
            <FlightSegment ArrivalDateTime="2020-09-08T12:05:00" DepartureDateTime="2020-09-08T10:40:00" ElapsedTime="85" FlightNumber="14" ResBookDesigCode="T" StopQuantity="0">
              <DepartureAirport LocationCode="SVO" TerminalID="B"/>
              <ArrivalAirport LocationCode="LED" TerminalID="1"/>
              <OperatingAirline Code="SU" FlightNumber="14"/>
              <Equipment AirEquipType="320"/>
              <MarketingAirline Code="SU"/>
              <MarriageGrp>I</MarriageGrp>
              <DepartureTimeZone GMTOffset="3"/>
              <ArrivalTimeZone GMTOffset="3"/>
              <TPA_Extensions>
                <eTicket Ind="true"/>
                <Mileage Amount="372"/>
              </TPA_Extensions>
            </FlightSegment>
          </OriginDestinationOption>
        </OriginDestinationOptions>
      </AirItinerary>
      <AirItineraryPricingInfo BrandsOnAnyMarket="true" FareReturned="true" LastTicketDate="2020-05-31" LastTicketTime="23:59" PricingSource="WPNI1_ITIN" PricingSubSource="MIP">
        <ItinTotalFare>
          <BaseFare Amount="31215" CurrencyCode="RUB" DecimalPlaces="0"/>
          <FareConstruction Amount="31213" CurrencyCode="RUB" DecimalPlaces="0"/>
          <EquivFare Amount="31215" CurrencyCode="RUB" DecimalPlaces="0"/>
          <Taxes>
            <Tax Amount="24470" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="TOTALTAX"/>
          </Taxes>
          <TotalFare Amount="55685" CurrencyCode="RUB" DecimalPlaces="0"/>
        </ItinTotalFare>
        <PTC_FareBreakdowns>
          <PTC_FareBreakdown>
            <PassengerTypeQuantity Code="ADT" Quantity="2"/>
            <FareBasisCodes>
              <FareBasisCode ArrivalAirportCode="SVO" BookingCode="N" DepartureAirportCode="LED" FareComponentBeginAirport="LED" FareComponentDirectionality="FROM" FareComponentEndAirport="AER" FareComponentFareRule="ENR1" FareComponentFareTariff="304" FareComponentFareType="SB" FareComponentFareTypeBitmap="00" FareComponentVendorCode="ATP" GovCarrier="SU">NNBR</FareBasisCode>
              <FareBasisCode ArrivalAirportCode="AER" AvailabilityBreak="true" BookingCode="N" DepartureAirportCode="SVO" GovCarrier="SU">NNBR</FareBasisCode>
              <FareBasisCode ArrivalAirportCode="SVO" BookingCode="T" DepartureAirportCode="AER" FareComponentBeginAirport="AER" FareComponentDirectionality="TO" FareComponentEndAirport="LED" FareComponentFareRule="ENR1" FareComponentFareTariff="304" FareComponentFareType="SB" FareComponentFareTypeBitmap="00" FareComponentVendorCode="ATP" GovCarrier="SU">TNBR</FareBasisCode>
              <FareBasisCode ArrivalAirportCode="LED" AvailabilityBreak="true" BookingCode="T" DepartureAirportCode="SVO" GovCarrier="SU">TNBR</FareBasisCode>
            </FareBasisCodes>
            <PassengerFare>
              <BaseFare Amount="11350" CurrencyCode="RUB"/>
              <FareConstruction Amount="11350" CurrencyCode="RUB" DecimalPlaces="0"/>
              <EquivFare Amount="11350" CurrencyCode="RUB" DecimalPlaces="0"/>
              <Taxes>
                <Tax Amount="1500" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                <Tax Amount="1500" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                <Tax Amount="1500" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                <Tax Amount="1500" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                <Tax Amount="270" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRF"/>
                <Tax Amount="270" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRF"/>
                <Tax Amount="270" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRF"/>
                <Tax Amount="270" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRF"/>
                <Tax Amount="158" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                <Tax Amount="184" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                <Tax Amount="120" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                <Tax Amount="184" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                <Tax Amount="158" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI4"/>
                <Tax Amount="184" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI4"/>
                <Tax Amount="120" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI4"/>
                <Tax Amount="184" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI4"/>
                <TaxSummary Amount="6000" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                <TaxSummary Amount="1080" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRF"/>
                <TaxSummary Amount="1292" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                <TotalTax Amount="8372" CurrencyCode="RUB" DecimalPlaces="0"/>
              </Taxes>
              <TotalFare Amount="19722" CurrencyCode="RUB"/>
              <PenaltiesInfo>
                <Penalty Amount="2600" Applicability="Before" Changeable="true" ConditionsApply="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                <Penalty Amount="2600" Applicability="After" Changeable="true" ConditionsApply="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                <Penalty Applicability="Before" Refundable="false" Type="Refund"/>
                <Penalty Applicability="After" Refundable="false" Type="Refund"/>
              </PenaltiesInfo>
              <TPA_Extensions>
                <FareComponents>
                  <FareComponent BrandID="NB" BrandName="ECONOMY LITE" ProgramCode="CFF1S" ProgramDescription="1S" ProgramID="85965" ProgramSystemCode="X">
                    <Segment FlightIndex="1" LegIndex="1"/>
                    <Segment FlightIndex="2" LegIndex="1"/>
                    <BrandFeatureRef FeatureId="3"/>
                    <BrandFeatureRef FeatureId="8"/>
                    <BrandFeatureRef FeatureId="9"/>
                    <BrandFeatureRef FeatureId="10"/>
                    <BrandFeatureRef FeatureId="6"/>
                    <BrandFeatureRef FeatureId="4"/>
                    <BrandFeatureRef FeatureId="5"/>
                    <BrandFeatureRef FeatureId="11"/>
                    <BrandFeatureRef FeatureId="2"/>
                    <BrandFeatureRef FeatureId="7"/>
                    <BrandFeatureRef FeatureId="14"/>
                    <BrandFeatureRef FeatureId="13"/>
                    <BrandFeatureRef FeatureId="12"/>
                    <BrandFeatureRef FeatureId="16"/>
                    <BrandFeatureRef FeatureId="15"/>
                    <BrandFeatureRef FeatureId="1"/>
                    <BrandFeatureRef FeatureId="20"/>
                    <BrandFeatureRef FeatureId="21"/>
                    <BrandFeatureRef FeatureId="19"/>
                    <BrandFeatureRef FeatureId="18"/>
                    <BrandFeatureRef FeatureId="17"/>
                    <BrandFeatureRef FeatureId="22"/>
                    <BrandFeatureRef FeatureId="23"/>
                    <BrandFeatureRef FeatureId="25"/>
                    <BrandFeatureRef FeatureId="26"/>
                    <BrandFeatureRef FeatureId="24"/>
                    <BrandFeatureRef FeatureId="27"/>
                    <BrandFeatureRef FeatureId="28"/>
                  </FareComponent>
                  <FareComponent BrandID="NB" BrandName="ECONOMY LITE" ProgramCode="CFF1S" ProgramDescription="1S" ProgramID="85965" ProgramSystemCode="X">
                    <Segment FlightIndex="1" LegIndex="2"/>
                    <Segment FlightIndex="2" LegIndex="2"/>
                    <BrandFeatureRef FeatureId="3"/>
                    <BrandFeatureRef FeatureId="8"/>
                    <BrandFeatureRef FeatureId="9"/>
                    <BrandFeatureRef FeatureId="10"/>
                    <BrandFeatureRef FeatureId="6"/>
                    <BrandFeatureRef FeatureId="4"/>
                    <BrandFeatureRef FeatureId="5"/>
                    <BrandFeatureRef FeatureId="11"/>
                    <BrandFeatureRef FeatureId="2"/>
                    <BrandFeatureRef FeatureId="7"/>
                    <BrandFeatureRef FeatureId="14"/>
                    <BrandFeatureRef FeatureId="13"/>
                    <BrandFeatureRef FeatureId="12"/>
                    <BrandFeatureRef FeatureId="16"/>
                    <BrandFeatureRef FeatureId="15"/>
                    <BrandFeatureRef FeatureId="1"/>
                    <BrandFeatureRef FeatureId="20"/>
                    <BrandFeatureRef FeatureId="21"/>
                    <BrandFeatureRef FeatureId="19"/>
                    <BrandFeatureRef FeatureId="18"/>
                    <BrandFeatureRef FeatureId="17"/>
                    <BrandFeatureRef FeatureId="22"/>
                    <BrandFeatureRef FeatureId="23"/>
                    <BrandFeatureRef FeatureId="25"/>
                    <BrandFeatureRef FeatureId="26"/>
                    <BrandFeatureRef FeatureId="24"/>
                    <BrandFeatureRef FeatureId="27"/>
                    <BrandFeatureRef FeatureId="28"/>
                  </FareComponent>
                </FareComponents>
                <Messages>
                  <Message AirlineCode="SU" FailCode="0" Info="NONREF/HEBO3BPATEH" Type="N"/>
                  <Message FailCode="0" Info="VALIDATING CARRIER" Type="W"/>
                  <Message FailCode="0" Info="BSP - SU" Type="W"/>
                  <Message FailCode="0" Info="RUT - SU" Type="W"/>
                </Messages>
                <BaggageInformationList>
                  <BaggageInformation AirlineCode="SU" ProvisionType="A">
                    <Segment Id="0"/>
                    <Segment Id="1"/>
                    <Allowance Pieces="0"/>
                  </BaggageInformation>
                  <BaggageInformation AirlineCode="SU" ProvisionType="A">
                    <Segment Id="2"/>
                    <Segment Id="3"/>
                    <Allowance Pieces="0"/>
                  </BaggageInformation>
                </BaggageInformationList>
              </TPA_Extensions>
            </PassengerFare>
            <Endorsements NonRefundableIndicator="true"/>
            <TPA_Extensions>
              <FareCalcLine Info="LED SU X/MOW SU AER4500SU X/MOW SU LED6850RUB11350END"/>
            </TPA_Extensions>
            <FareInfos>
              <FareInfo>
                <FareReference>N</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="S"/>
                </TPA_Extensions>
              </FareInfo>
              <FareInfo>
                <FareReference>N</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="S"/>
                </TPA_Extensions>
              </FareInfo>
              <FareInfo>
                <FareReference>T</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="S"/>
                </TPA_Extensions>
              </FareInfo>
              <FareInfo>
                <FareReference>T</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="S"/>
                </TPA_Extensions>
              </FareInfo>
            </FareInfos>
          </PTC_FareBreakdown>
          <PTC_FareBreakdown>
            <PassengerTypeQuantity Code="CNN" Quantity="1"/>
            <FareBasisCodes>
              <FareBasisCode ArrivalAirportCode="SVO" BookingCode="N" DepartureAirportCode="LED" FareComponentBeginAirport="LED" FareComponentDirectionality="FROM" FareComponentEndAirport="AER" FareComponentFareRule="ENR1" FareComponentFareTariff="304" FareComponentFareType="SB" FareComponentFareTypeBitmap="01" FareComponentVendorCode="ATP" GovCarrier="SU">NNBR/CH25</FareBasisCode>
              <FareBasisCode ArrivalAirportCode="AER" AvailabilityBreak="true" BookingCode="N" DepartureAirportCode="SVO" GovCarrier="SU">NNBR/CH25</FareBasisCode>
              <FareBasisCode ArrivalAirportCode="SVO" BookingCode="T" DepartureAirportCode="AER" FareComponentBeginAirport="AER" FareComponentDirectionality="TO" FareComponentEndAirport="LED" FareComponentFareRule="ENR1" FareComponentFareTariff="304" FareComponentFareType="SB" FareComponentFareTypeBitmap="01" FareComponentVendorCode="ATP" GovCarrier="SU">TNBR/CH25</FareBasisCode>
              <FareBasisCode ArrivalAirportCode="LED" AvailabilityBreak="true" BookingCode="T" DepartureAirportCode="SVO" GovCarrier="SU">TNBR/CH25</FareBasisCode>
            </FareBasisCodes>
            <PassengerFare>
              <BaseFare Amount="8515" CurrencyCode="RUB"/>
              <FareConstruction Amount="8513" CurrencyCode="RUB" DecimalPlaces="0"/>
              <EquivFare Amount="8515" CurrencyCode="RUB" DecimalPlaces="0"/>
              <Taxes>
                <Tax Amount="1500" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                <Tax Amount="1500" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                <Tax Amount="1500" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                <Tax Amount="1500" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                <Tax Amount="270" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRF"/>
                <Tax Amount="270" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRF"/>
                <Tax Amount="270" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRF"/>
                <Tax Amount="270" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRF"/>
                <Tax Amount="79" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                <Tax Amount="92" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                <Tax Amount="60" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                <Tax Amount="92" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                <Tax Amount="79" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI4"/>
                <Tax Amount="92" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI4"/>
                <Tax Amount="60" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI4"/>
                <Tax Amount="92" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI4"/>
                <TaxSummary Amount="6000" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                <TaxSummary Amount="1080" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRF"/>
                <TaxSummary Amount="646" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                <TotalTax Amount="7726" CurrencyCode="RUB" DecimalPlaces="0"/>
              </Taxes>
              <TotalFare Amount="16241" CurrencyCode="RUB"/>
              <PenaltiesInfo>
                <Penalty Amount="2600" Applicability="Before" Changeable="true" ConditionsApply="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                <Penalty Amount="2600" Applicability="After" Changeable="true" ConditionsApply="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                <Penalty Applicability="Before" Refundable="false" Type="Refund"/>
                <Penalty Applicability="After" Refundable="false" Type="Refund"/>
              </PenaltiesInfo>
              <TPA_Extensions>
                <FareComponents>
                  <FareComponent BrandID="NB" BrandName="ECONOMY LITE" ProgramCode="CFF1S" ProgramDescription="1S" ProgramID="85965" ProgramSystemCode="X">
                    <Segment FlightIndex="1" LegIndex="1"/>
                    <Segment FlightIndex="2" LegIndex="1"/>
                    <BrandFeatureRef FeatureId="3"/>
                    <BrandFeatureRef FeatureId="8"/>
                    <BrandFeatureRef FeatureId="9"/>
                    <BrandFeatureRef FeatureId="10"/>
                    <BrandFeatureRef FeatureId="6"/>
                    <BrandFeatureRef FeatureId="4"/>
                    <BrandFeatureRef FeatureId="5"/>
                    <BrandFeatureRef FeatureId="11"/>
                    <BrandFeatureRef FeatureId="2"/>
                    <BrandFeatureRef FeatureId="7"/>
                    <BrandFeatureRef FeatureId="14"/>
                    <BrandFeatureRef FeatureId="13"/>
                    <BrandFeatureRef FeatureId="12"/>
                    <BrandFeatureRef FeatureId="16"/>
                    <BrandFeatureRef FeatureId="15"/>
                    <BrandFeatureRef FeatureId="1"/>
                    <BrandFeatureRef FeatureId="20"/>
                    <BrandFeatureRef FeatureId="21"/>
                    <BrandFeatureRef FeatureId="19"/>
                    <BrandFeatureRef FeatureId="18"/>
                    <BrandFeatureRef FeatureId="17"/>
                    <BrandFeatureRef FeatureId="22"/>
                    <BrandFeatureRef FeatureId="23"/>
                    <BrandFeatureRef FeatureId="25"/>
                    <BrandFeatureRef FeatureId="26"/>
                    <BrandFeatureRef FeatureId="24"/>
                    <BrandFeatureRef FeatureId="27"/>
                    <BrandFeatureRef FeatureId="28"/>
                  </FareComponent>
                  <FareComponent BrandID="NB" BrandName="ECONOMY LITE" ProgramCode="CFF1S" ProgramDescription="1S" ProgramID="85965" ProgramSystemCode="X">
                    <Segment FlightIndex="1" LegIndex="2"/>
                    <Segment FlightIndex="2" LegIndex="2"/>
                    <BrandFeatureRef FeatureId="3"/>
                    <BrandFeatureRef FeatureId="8"/>
                    <BrandFeatureRef FeatureId="9"/>
                    <BrandFeatureRef FeatureId="10"/>
                    <BrandFeatureRef FeatureId="6"/>
                    <BrandFeatureRef FeatureId="4"/>
                    <BrandFeatureRef FeatureId="5"/>
                    <BrandFeatureRef FeatureId="11"/>
                    <BrandFeatureRef FeatureId="2"/>
                    <BrandFeatureRef FeatureId="7"/>
                    <BrandFeatureRef FeatureId="14"/>
                    <BrandFeatureRef FeatureId="13"/>
                    <BrandFeatureRef FeatureId="12"/>
                    <BrandFeatureRef FeatureId="16"/>
                    <BrandFeatureRef FeatureId="15"/>
                    <BrandFeatureRef FeatureId="1"/>
                    <BrandFeatureRef FeatureId="20"/>
                    <BrandFeatureRef FeatureId="21"/>
                    <BrandFeatureRef FeatureId="19"/>
                    <BrandFeatureRef FeatureId="18"/>
                    <BrandFeatureRef FeatureId="17"/>
                    <BrandFeatureRef FeatureId="22"/>
                    <BrandFeatureRef FeatureId="23"/>
                    <BrandFeatureRef FeatureId="25"/>
                    <BrandFeatureRef FeatureId="26"/>
                    <BrandFeatureRef FeatureId="24"/>
                    <BrandFeatureRef FeatureId="27"/>
                    <BrandFeatureRef FeatureId="28"/>
                  </FareComponent>
                </FareComponents>
                <Messages>
                  <Message AirlineCode="SU" FailCode="0" Info="NONREF/HEBO3BPATEH" Type="N"/>
                  <Message FailCode="0" Info="EACH CNN REQUIRES ACCOMPANYING SAME CABIN ADT" Type="W"/>
                  <Message FailCode="0" Info="VALIDATING CARRIER" Type="W"/>
                  <Message FailCode="0" Info="BSP - SU" Type="W"/>
                  <Message FailCode="0" Info="RUT - SU" Type="W"/>
                </Messages>
                <BaggageInformationList>
                  <BaggageInformation AirlineCode="SU" ProvisionType="A">
                    <Segment Id="0"/>
                    <Segment Id="1"/>
                    <Allowance Pieces="0"/>
                  </BaggageInformation>
                  <BaggageInformation AirlineCode="SU" ProvisionType="A">
                    <Segment Id="2"/>
                    <Segment Id="3"/>
                    <Allowance Pieces="0"/>
                  </BaggageInformation>
                </BaggageInformationList>
              </TPA_Extensions>
            </PassengerFare>
            <Endorsements NonRefundableIndicator="true"/>
            <TPA_Extensions>
              <FareCalcLine Info="LED SU X/MOW SU AER3375SU X/MOW SU LED5138RUB8513END"/>
            </TPA_Extensions>
            <FareInfos>
              <FareInfo>
                <FareReference>N</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="S"/>
                </TPA_Extensions>
              </FareInfo>
              <FareInfo>
                <FareReference>N</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="S"/>
                </TPA_Extensions>
              </FareInfo>
              <FareInfo>
                <FareReference>T</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="S"/>
                </TPA_Extensions>
              </FareInfo>
              <FareInfo>
                <FareReference>T</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="S"/>
                </TPA_Extensions>
              </FareInfo>
            </FareInfos>
          </PTC_FareBreakdown>
          <PTC_FareBreakdown>
            <PassengerTypeQuantity Code="INF" Quantity="1"/>
            <FareBasisCodes>
              <FareBasisCode ArrivalAirportCode="SVO" BookingCode="N" DepartureAirportCode="LED" FareComponentBeginAirport="LED" FareComponentDirectionality="FROM" FareComponentEndAirport="AER" FareComponentFareRule="ENR1" FareComponentFareTariff="304" FareComponentFareType="SB" FareComponentFareTypeBitmap="01" FareComponentVendorCode="ATP" GovCarrier="SU">NNBR/IN00</FareBasisCode>
              <FareBasisCode ArrivalAirportCode="AER" AvailabilityBreak="true" BookingCode="N" DepartureAirportCode="SVO" GovCarrier="SU">NNBR/IN00</FareBasisCode>
              <FareBasisCode ArrivalAirportCode="SVO" BookingCode="T" DepartureAirportCode="AER" FareComponentBeginAirport="AER" FareComponentDirectionality="TO" FareComponentEndAirport="LED" FareComponentFareRule="ENR1" FareComponentFareTariff="304" FareComponentFareType="SB" FareComponentFareTypeBitmap="01" FareComponentVendorCode="ATP" GovCarrier="SU">TNBR/IN00</FareBasisCode>
              <FareBasisCode ArrivalAirportCode="LED" AvailabilityBreak="true" BookingCode="T" DepartureAirportCode="SVO" GovCarrier="SU">TNBR/IN00</FareBasisCode>
            </FareBasisCodes>
            <PassengerFare>
              <BaseFare Amount="0" CurrencyCode="RUB"/>
              <FareConstruction Amount="0" CurrencyCode="RUB" DecimalPlaces="0"/>
              <EquivFare Amount="0" CurrencyCode="RUB" DecimalPlaces="0"/>
              <TotalFare Amount="0" CurrencyCode="RUB"/>
              <PenaltiesInfo>
                <Penalty Amount="2600" Applicability="Before" Changeable="true" ConditionsApply="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                <Penalty Amount="2600" Applicability="After" Changeable="true" ConditionsApply="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                <Penalty Applicability="Before" Refundable="false" Type="Refund"/>
                <Penalty Applicability="After" Refundable="false" Type="Refund"/>
              </PenaltiesInfo>
              <TPA_Extensions>
                <FareComponents>
                  <FareComponent BrandID="NB" BrandName="ECONOMY LITE" ProgramCode="CFF1S" ProgramDescription="1S" ProgramID="85965" ProgramSystemCode="X">
                    <Segment FlightIndex="1" LegIndex="1"/>
                    <Segment FlightIndex="2" LegIndex="1"/>
                    <BrandFeatureRef FeatureId="3"/>
                    <BrandFeatureRef FeatureId="8"/>
                    <BrandFeatureRef FeatureId="9"/>
                    <BrandFeatureRef FeatureId="10"/>
                    <BrandFeatureRef FeatureId="6"/>
                    <BrandFeatureRef FeatureId="4"/>
                    <BrandFeatureRef FeatureId="5"/>
                    <BrandFeatureRef FeatureId="11"/>
                    <BrandFeatureRef FeatureId="2"/>
                    <BrandFeatureRef FeatureId="7"/>
                    <BrandFeatureRef FeatureId="14"/>
                    <BrandFeatureRef FeatureId="13"/>
                    <BrandFeatureRef FeatureId="12"/>
                    <BrandFeatureRef FeatureId="16"/>
                    <BrandFeatureRef FeatureId="15"/>
                    <BrandFeatureRef FeatureId="1"/>
                    <BrandFeatureRef FeatureId="20"/>
                    <BrandFeatureRef FeatureId="21"/>
                    <BrandFeatureRef FeatureId="19"/>
                    <BrandFeatureRef FeatureId="18"/>
                    <BrandFeatureRef FeatureId="17"/>
                    <BrandFeatureRef FeatureId="22"/>
                    <BrandFeatureRef FeatureId="23"/>
                    <BrandFeatureRef FeatureId="25"/>
                    <BrandFeatureRef FeatureId="26"/>
                    <BrandFeatureRef FeatureId="24"/>
                    <BrandFeatureRef FeatureId="27"/>
                    <BrandFeatureRef FeatureId="28"/>
                  </FareComponent>
                  <FareComponent BrandID="NB" BrandName="ECONOMY LITE" ProgramCode="CFF1S" ProgramDescription="1S" ProgramID="85965" ProgramSystemCode="X">
                    <Segment FlightIndex="1" LegIndex="2"/>
                    <Segment FlightIndex="2" LegIndex="2"/>
                    <BrandFeatureRef FeatureId="3"/>
                    <BrandFeatureRef FeatureId="8"/>
                    <BrandFeatureRef FeatureId="9"/>
                    <BrandFeatureRef FeatureId="10"/>
                    <BrandFeatureRef FeatureId="6"/>
                    <BrandFeatureRef FeatureId="4"/>
                    <BrandFeatureRef FeatureId="5"/>
                    <BrandFeatureRef FeatureId="11"/>
                    <BrandFeatureRef FeatureId="2"/>
                    <BrandFeatureRef FeatureId="7"/>
                    <BrandFeatureRef FeatureId="14"/>
                    <BrandFeatureRef FeatureId="13"/>
                    <BrandFeatureRef FeatureId="12"/>
                    <BrandFeatureRef FeatureId="16"/>
                    <BrandFeatureRef FeatureId="15"/>
                    <BrandFeatureRef FeatureId="1"/>
                    <BrandFeatureRef FeatureId="20"/>
                    <BrandFeatureRef FeatureId="21"/>
                    <BrandFeatureRef FeatureId="19"/>
                    <BrandFeatureRef FeatureId="18"/>
                    <BrandFeatureRef FeatureId="17"/>
                    <BrandFeatureRef FeatureId="22"/>
                    <BrandFeatureRef FeatureId="23"/>
                    <BrandFeatureRef FeatureId="25"/>
                    <BrandFeatureRef FeatureId="26"/>
                    <BrandFeatureRef FeatureId="24"/>
                    <BrandFeatureRef FeatureId="27"/>
                    <BrandFeatureRef FeatureId="28"/>
                  </FareComponent>
                </FareComponents>
                <Messages>
                  <Message AirlineCode="SU" FailCode="0" Info="NONREF/HEBO3BPATEH" Type="N"/>
                  <Message FailCode="0" Info="EACH INF REQUIRES ACCOMPANYING ADT PASSENGER" Type="W"/>
                  <Message FailCode="0" Info="VALIDATING CARRIER" Type="W"/>
                  <Message FailCode="0" Info="BSP - SU" Type="W"/>
                  <Message FailCode="0" Info="RUT - SU" Type="W"/>
                </Messages>
                <BaggageInformationList>
                  <BaggageInformation AirlineCode="SU" ProvisionType="A">
                    <Segment Id="0"/>
                    <Segment Id="1"/>
                    <Allowance Pieces="0"/>
                  </BaggageInformation>
                  <BaggageInformation AirlineCode="SU" ProvisionType="A">
                    <Segment Id="2"/>
                    <Segment Id="3"/>
                    <Allowance Pieces="0"/>
                  </BaggageInformation>
                </BaggageInformationList>
              </TPA_Extensions>
            </PassengerFare>
            <Endorsements NonRefundableIndicator="true"/>
            <TPA_Extensions>
              <FareCalcLine Info="LED SU X/MOW SU AER0SU X/MOW SU LED0RUB0END"/>
            </TPA_Extensions>
            <FareInfos>
              <FareInfo>
                <FareReference>N</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="S"/>
                </TPA_Extensions>
              </FareInfo>
              <FareInfo>
                <FareReference>N</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="S"/>
                </TPA_Extensions>
              </FareInfo>
              <FareInfo>
                <FareReference>T</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="S"/>
                </TPA_Extensions>
              </FareInfo>
              <FareInfo>
                <FareReference>T</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="S"/>
                </TPA_Extensions>
              </FareInfo>
            </FareInfos>
          </PTC_FareBreakdown>
        </PTC_FareBreakdowns>
        <FareInfos>
          <FareInfo>
            <FareReference>N</FareReference>
            <TPA_Extensions>
              <SeatsRemaining BelowMin="false" Number="9"/>
              <Cabin Cabin="Y"/>
              <Meal Code="S"/>
            </TPA_Extensions>
          </FareInfo>
          <FareInfo>
            <FareReference>N</FareReference>
            <TPA_Extensions>
              <SeatsRemaining BelowMin="false" Number="9"/>
              <Cabin Cabin="Y"/>
              <Meal Code="S"/>
            </TPA_Extensions>
          </FareInfo>
          <FareInfo>
            <FareReference>T</FareReference>
            <TPA_Extensions>
              <SeatsRemaining BelowMin="false" Number="9"/>
              <Cabin Cabin="Y"/>
              <Meal Code="S"/>
            </TPA_Extensions>
          </FareInfo>
          <FareInfo>
            <FareReference>T</FareReference>
            <TPA_Extensions>
              <SeatsRemaining BelowMin="false" Number="9"/>
              <Cabin Cabin="Y"/>
              <Meal Code="S"/>
            </TPA_Extensions>
          </FareInfo>
        </FareInfos>
        <TPA_Extensions>
          <DivideInParty Indicator="false"/>
          <ValidatingCarrier NewVcxProcess="true" SettlementMethod="BSP">
            <Default Code="SU"/>
          </ValidatingCarrier>
          <ValidatingCarrier NewVcxProcess="true" SettlementMethod="RUT">
            <Default Code="SU"/>
          </ValidatingCarrier>
        </TPA_Extensions>
      </AirItineraryPricingInfo>
      <TicketingInfo TicketType="eTicket" ValidInterline="Yes"/>
      <TPA_Extensions>
        <ValidatingCarrier Code="SU"/>
      </TPA_Extensions>
    </PricedItinerary>
  </PricedItineraries>
  <OneWayItineraries>
    <SimpleOneWayItineraries RPH="1">
      <PricedItinerary SequenceNumber="1">
        <AirItinerary DirectionInd="OneWay">
          <OriginDestinationOptions>
            <OriginDestinationOption ArrivalCountry="RU" DepartureCountry="RU" ElapsedTime="315">
              <FlightSegment ArrivalDateTime="2020-09-01T06:25:00" DepartureDateTime="2020-09-01T05:00:00" ElapsedTime="85" FlightNumber="35" ResBookDesigCode="N" StopQuantity="0">
                <DepartureAirport LocationCode="LED" TerminalID="1"/>
                <ArrivalAirport LocationCode="SVO" TerminalID="B"/>
                <OperatingAirline Code="SU" FlightNumber="35"/>
                <Equipment AirEquipType="320"/>
                <MarketingAirline Code="SU"/>
                <MarriageGrp>O</MarriageGrp>
                <DepartureTimeZone GMTOffset="3"/>
                <ArrivalTimeZone GMTOffset="3"/>
                <TPA_Extensions>
                  <eTicket Ind="true"/>
                  <Mileage Amount="372"/>
                </TPA_Extensions>
              </FlightSegment>
              <FlightSegment ArrivalDateTime="2020-09-01T10:15:00" DepartureDateTime="2020-09-01T07:40:00" ElapsedTime="155" FlightNumber="1138" ResBookDesigCode="N" StopQuantity="0">
                <DepartureAirport LocationCode="SVO" TerminalID="B"/>
                <ArrivalAirport LocationCode="AER"/>
                <OperatingAirline Code="SU" FlightNumber="1138"/>
                <Equipment AirEquipType="73H"/>
                <MarketingAirline Code="SU"/>
                <MarriageGrp>I</MarriageGrp>
                <DepartureTimeZone GMTOffset="3"/>
                <ArrivalTimeZone GMTOffset="3"/>
                <TPA_Extensions>
                  <eTicket Ind="true"/>
                  <Mileage Amount="873"/>
                </TPA_Extensions>
              </FlightSegment>
            </OriginDestinationOption>
          </OriginDestinationOptions>
        </AirItinerary>
        <AirItineraryPricingInfo BrandsOnAnyMarket="true" FareReturned="true" LastTicketDate="2020-05-31" LastTicketTime="23:59" PricingSource="WPNI1_ITIN" PricingSubSource="MIP">
          <ItinTotalFare>
            <BaseFare Amount="14850" CurrencyCode="RUB" DecimalPlaces="0"/>
            <FareConstruction Amount="14850" CurrencyCode="RUB" DecimalPlaces="0"/>
            <EquivFare Amount="14850" CurrencyCode="RUB" DecimalPlaces="0"/>
            <Taxes>
              <Tax Amount="12235" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="TOTALTAX"/>
            </Taxes>
            <TotalFare Amount="27085" CurrencyCode="RUB" DecimalPlaces="0"/>
          </ItinTotalFare>
          <PTC_FareBreakdowns>
            <PTC_FareBreakdown>
              <PassengerTypeQuantity Code="ADT" Quantity="2"/>
              <FareBasisCodes>
                <FareBasisCode ArrivalAirportCode="SVO" BookingCode="N" DepartureAirportCode="LED" FareComponentBeginAirport="LED" FareComponentDirectionality="FROM" FareComponentEndAirport="AER" FareComponentFareRule="ENR1" FareComponentFareTariff="304" FareComponentFareType="SBP" FareComponentFareTypeBitmap="00" FareComponentVendorCode="ATP" GovCarrier="SU">NNOR</FareBasisCode>
                <FareBasisCode ArrivalAirportCode="AER" AvailabilityBreak="true" BookingCode="N" DepartureAirportCode="SVO" GovCarrier="SU">NNOR</FareBasisCode>
              </FareBasisCodes>
              <PassengerFare>
                <BaseFare Amount="5400" CurrencyCode="RUB"/>
                <FareConstruction Amount="5400" CurrencyCode="RUB" DecimalPlaces="0"/>
                <EquivFare Amount="5400" CurrencyCode="RUB" DecimalPlaces="0"/>
                <Taxes>
                  <Tax Amount="1500" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                  <Tax Amount="1500" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                  <Tax Amount="270" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRF"/>
                  <Tax Amount="270" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRF"/>
                  <Tax Amount="158" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                  <Tax Amount="184" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                  <Tax Amount="120" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI4"/>
                  <Tax Amount="184" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI4"/>
                  <TaxSummary Amount="3000" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                  <TaxSummary Amount="540" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRF"/>
                  <TaxSummary Amount="646" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                  <TotalTax Amount="4186" CurrencyCode="RUB" DecimalPlaces="0"/>
                </Taxes>
                <TotalFare Amount="9586" CurrencyCode="RUB"/>
                <PenaltiesInfo>
                  <Penalty Amount="2600" Applicability="Before" Changeable="true" ConditionsApply="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                  <Penalty Amount="2600" Applicability="After" Changeable="true" ConditionsApply="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                  <Penalty Applicability="Before" Refundable="false" Type="Refund"/>
                  <Penalty Applicability="After" Refundable="false" Type="Refund"/>
                </PenaltiesInfo>
                <TPA_Extensions>
                  <FareComponents>
                    <FareComponent BrandID="NB" BrandName="ECONOMY LITE" ProgramCode="CFF1S" ProgramDescription="1S" ProgramID="85965" ProgramSystemCode="X">
                      <Segment FlightIndex="1" LegIndex="1"/>
                      <Segment FlightIndex="2" LegIndex="1"/>
                      <BrandFeatureRef FeatureId="3"/>
                      <BrandFeatureRef FeatureId="8"/>
                      <BrandFeatureRef FeatureId="9"/>
                      <BrandFeatureRef FeatureId="10"/>
                      <BrandFeatureRef FeatureId="6"/>
                      <BrandFeatureRef FeatureId="4"/>
                      <BrandFeatureRef FeatureId="5"/>
                      <BrandFeatureRef FeatureId="11"/>
                      <BrandFeatureRef FeatureId="2"/>
                      <BrandFeatureRef FeatureId="7"/>
                      <BrandFeatureRef FeatureId="14"/>
                      <BrandFeatureRef FeatureId="13"/>
                      <BrandFeatureRef FeatureId="12"/>
                      <BrandFeatureRef FeatureId="16"/>
                      <BrandFeatureRef FeatureId="15"/>
                      <BrandFeatureRef FeatureId="1"/>
                      <BrandFeatureRef FeatureId="20"/>
                      <BrandFeatureRef FeatureId="21"/>
                      <BrandFeatureRef FeatureId="19"/>
                      <BrandFeatureRef FeatureId="18"/>
                      <BrandFeatureRef FeatureId="17"/>
                      <BrandFeatureRef FeatureId="22"/>
                      <BrandFeatureRef FeatureId="23"/>
                      <BrandFeatureRef FeatureId="25"/>
                      <BrandFeatureRef FeatureId="26"/>
                      <BrandFeatureRef FeatureId="24"/>
                      <BrandFeatureRef FeatureId="27"/>
                      <BrandFeatureRef FeatureId="28"/>
                    </FareComponent>
                  </FareComponents>
                  <Messages>
                    <Message AirlineCode="SU" FailCode="0" Info="NONREF/HEBO3BPATEH" Type="N"/>
                    <Message FailCode="0" Info="VALIDATING CARRIER" Type="W"/>
                    <Message FailCode="0" Info="BSP - SU" Type="W"/>
                    <Message FailCode="0" Info="RUT - SU" Type="W"/>
                  </Messages>
                  <BaggageInformationList>
                    <BaggageInformation AirlineCode="SU" ProvisionType="A">
                      <Segment Id="0"/>
                      <Segment Id="1"/>
                      <Allowance Pieces="0"/>
                    </BaggageInformation>
                  </BaggageInformationList>
                </TPA_Extensions>
              </PassengerFare>
              <Endorsements NonRefundableIndicator="true"/>
              <TPA_Extensions>
                <FareCalcLine Info="LED SU X/MOW SU AER5400RUB5400END"/>
              </TPA_Extensions>
              <FareInfos>
                <FareInfo>
                  <FareReference>N</FareReference>
                  <TPA_Extensions>
                    <SeatsRemaining BelowMin="false" Number="9"/>
                    <Cabin Cabin="Y"/>
                    <Meal Code="S"/>
                  </TPA_Extensions>
                </FareInfo>
                <FareInfo>
                  <FareReference>N</FareReference>
                  <TPA_Extensions>
                    <SeatsRemaining BelowMin="false" Number="9"/>
                    <Cabin Cabin="Y"/>
                    <Meal Code="S"/>
                  </TPA_Extensions>
                </FareInfo>
              </FareInfos>
            </PTC_FareBreakdown>
            <PTC_FareBreakdown>
              <PassengerTypeQuantity Code="CNN" Quantity="1"/>
              <FareBasisCodes>
                <FareBasisCode ArrivalAirportCode="SVO" BookingCode="N" DepartureAirportCode="LED" FareComponentBeginAirport="LED" FareComponentDirectionality="FROM" FareComponentEndAirport="AER" FareComponentFareRule="ENR1" FareComponentFareTariff="304" FareComponentFareType="SBP" FareComponentFareTypeBitmap="01" FareComponentVendorCode="ATP" GovCarrier="SU">NNOR/CH25</FareBasisCode>
                <FareBasisCode ArrivalAirportCode="AER" AvailabilityBreak="true" BookingCode="N" DepartureAirportCode="SVO" GovCarrier="SU">NNOR/CH25</FareBasisCode>
              </FareBasisCodes>
              <PassengerFare>
                <BaseFare Amount="4050" CurrencyCode="RUB"/>
                <FareConstruction Amount="4050" CurrencyCode="RUB" DecimalPlaces="0"/>
                <EquivFare Amount="4050" CurrencyCode="RUB" DecimalPlaces="0"/>
                <Taxes>
                  <Tax Amount="1500" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                  <Tax Amount="1500" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                  <Tax Amount="270" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRF"/>
                  <Tax Amount="270" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRF"/>
                  <Tax Amount="79" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                  <Tax Amount="92" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                  <Tax Amount="60" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI4"/>
                  <Tax Amount="92" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI4"/>
                  <TaxSummary Amount="3000" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                  <TaxSummary Amount="540" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRF"/>
                  <TaxSummary Amount="323" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                  <TotalTax Amount="3863" CurrencyCode="RUB" DecimalPlaces="0"/>
                </Taxes>
                <TotalFare Amount="7913" CurrencyCode="RUB"/>
                <PenaltiesInfo>
                  <Penalty Amount="2600" Applicability="Before" Changeable="true" ConditionsApply="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                  <Penalty Amount="2600" Applicability="After" Changeable="true" ConditionsApply="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                  <Penalty Applicability="Before" Refundable="false" Type="Refund"/>
                  <Penalty Applicability="After" Refundable="false" Type="Refund"/>
                </PenaltiesInfo>
                <TPA_Extensions>
                  <FareComponents>
                    <FareComponent BrandID="NB" BrandName="ECONOMY LITE" ProgramCode="CFF1S" ProgramDescription="1S" ProgramID="85965" ProgramSystemCode="X">
                      <Segment FlightIndex="1" LegIndex="1"/>
                      <Segment FlightIndex="2" LegIndex="1"/>
                      <BrandFeatureRef FeatureId="3"/>
                      <BrandFeatureRef FeatureId="8"/>
                      <BrandFeatureRef FeatureId="9"/>
                      <BrandFeatureRef FeatureId="10"/>
                      <BrandFeatureRef FeatureId="6"/>
                      <BrandFeatureRef FeatureId="4"/>
                      <BrandFeatureRef FeatureId="5"/>
                      <BrandFeatureRef FeatureId="11"/>
                      <BrandFeatureRef FeatureId="2"/>
                      <BrandFeatureRef FeatureId="7"/>
                      <BrandFeatureRef FeatureId="14"/>
                      <BrandFeatureRef FeatureId="13"/>
                      <BrandFeatureRef FeatureId="12"/>
                      <BrandFeatureRef FeatureId="16"/>
                      <BrandFeatureRef FeatureId="15"/>
                      <BrandFeatureRef FeatureId="1"/>
                      <BrandFeatureRef FeatureId="20"/>
                      <BrandFeatureRef FeatureId="21"/>
                      <BrandFeatureRef FeatureId="19"/>
                      <BrandFeatureRef FeatureId="18"/>
                      <BrandFeatureRef FeatureId="17"/>
                      <BrandFeatureRef FeatureId="22"/>
                      <BrandFeatureRef FeatureId="23"/>
                      <BrandFeatureRef FeatureId="25"/>
                      <BrandFeatureRef FeatureId="26"/>
                      <BrandFeatureRef FeatureId="24"/>
                      <BrandFeatureRef FeatureId="27"/>
                      <BrandFeatureRef FeatureId="28"/>
                    </FareComponent>
                  </FareComponents>
                  <Messages>
                    <Message AirlineCode="SU" FailCode="0" Info="NONREF/HEBO3BPATEH" Type="N"/>
                    <Message FailCode="0" Info="EACH CNN REQUIRES ACCOMPANYING SAME CABIN ADT" Type="W"/>
                    <Message FailCode="0" Info="VALIDATING CARRIER" Type="W"/>
                    <Message FailCode="0" Info="BSP - SU" Type="W"/>
                    <Message FailCode="0" Info="RUT - SU" Type="W"/>
                  </Messages>
                  <BaggageInformationList>
                    <BaggageInformation AirlineCode="SU" ProvisionType="A">
                      <Segment Id="0"/>
                      <Segment Id="1"/>
                      <Allowance Pieces="0"/>
                    </BaggageInformation>
                  </BaggageInformationList>
                </TPA_Extensions>
              </PassengerFare>
              <Endorsements NonRefundableIndicator="true"/>
              <TPA_Extensions>
                <FareCalcLine Info="LED SU X/MOW SU AER4050RUB4050END"/>
              </TPA_Extensions>
              <FareInfos>
                <FareInfo>
                  <FareReference>N</FareReference>
                  <TPA_Extensions>
                    <SeatsRemaining BelowMin="false" Number="9"/>
                    <Cabin Cabin="Y"/>
                    <Meal Code="S"/>
                  </TPA_Extensions>
                </FareInfo>
                <FareInfo>
                  <FareReference>N</FareReference>
                  <TPA_Extensions>
                    <SeatsRemaining BelowMin="false" Number="9"/>
                    <Cabin Cabin="Y"/>
                    <Meal Code="S"/>
                  </TPA_Extensions>
                </FareInfo>
              </FareInfos>
            </PTC_FareBreakdown>
            <PTC_FareBreakdown>
              <PassengerTypeQuantity Code="INF" Quantity="1"/>
              <FareBasisCodes>
                <FareBasisCode ArrivalAirportCode="SVO" BookingCode="N" DepartureAirportCode="LED" FareComponentBeginAirport="LED" FareComponentDirectionality="FROM" FareComponentEndAirport="AER" FareComponentFareRule="ENR1" FareComponentFareTariff="304" FareComponentFareType="SBP" FareComponentFareTypeBitmap="01" FareComponentVendorCode="ATP" GovCarrier="SU">NNOR/IN00</FareBasisCode>
                <FareBasisCode ArrivalAirportCode="AER" AvailabilityBreak="true" BookingCode="N" DepartureAirportCode="SVO" GovCarrier="SU">NNOR/IN00</FareBasisCode>
              </FareBasisCodes>
              <PassengerFare>
                <BaseFare Amount="0" CurrencyCode="RUB"/>
                <FareConstruction Amount="0" CurrencyCode="RUB" DecimalPlaces="0"/>
                <EquivFare Amount="0" CurrencyCode="RUB" DecimalPlaces="0"/>
                <TotalFare Amount="0" CurrencyCode="RUB"/>
                <PenaltiesInfo>
                  <Penalty Amount="2600" Applicability="Before" Changeable="true" ConditionsApply="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                  <Penalty Amount="2600" Applicability="After" Changeable="true" ConditionsApply="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                  <Penalty Applicability="Before" Refundable="false" Type="Refund"/>
                  <Penalty Applicability="After" Refundable="false" Type="Refund"/>
                </PenaltiesInfo>
                <TPA_Extensions>
                  <FareComponents>
                    <FareComponent BrandID="NB" BrandName="ECONOMY LITE" ProgramCode="CFF1S" ProgramDescription="1S" ProgramID="85965" ProgramSystemCode="X">
                      <Segment FlightIndex="1" LegIndex="1"/>
                      <Segment FlightIndex="2" LegIndex="1"/>
                      <BrandFeatureRef FeatureId="3"/>
                      <BrandFeatureRef FeatureId="8"/>
                      <BrandFeatureRef FeatureId="9"/>
                      <BrandFeatureRef FeatureId="10"/>
                      <BrandFeatureRef FeatureId="6"/>
                      <BrandFeatureRef FeatureId="4"/>
                      <BrandFeatureRef FeatureId="5"/>
                      <BrandFeatureRef FeatureId="11"/>
                      <BrandFeatureRef FeatureId="2"/>
                      <BrandFeatureRef FeatureId="7"/>
                      <BrandFeatureRef FeatureId="14"/>
                      <BrandFeatureRef FeatureId="13"/>
                      <BrandFeatureRef FeatureId="12"/>
                      <BrandFeatureRef FeatureId="16"/>
                      <BrandFeatureRef FeatureId="15"/>
                      <BrandFeatureRef FeatureId="1"/>
                      <BrandFeatureRef FeatureId="20"/>
                      <BrandFeatureRef FeatureId="21"/>
                      <BrandFeatureRef FeatureId="19"/>
                      <BrandFeatureRef FeatureId="18"/>
                      <BrandFeatureRef FeatureId="17"/>
                      <BrandFeatureRef FeatureId="22"/>
                      <BrandFeatureRef FeatureId="23"/>
                      <BrandFeatureRef FeatureId="25"/>
                      <BrandFeatureRef FeatureId="26"/>
                      <BrandFeatureRef FeatureId="24"/>
                      <BrandFeatureRef FeatureId="27"/>
                      <BrandFeatureRef FeatureId="28"/>
                    </FareComponent>
                  </FareComponents>
                  <Messages>
                    <Message AirlineCode="SU" FailCode="0" Info="NONREF/HEBO3BPATEH" Type="N"/>
                    <Message FailCode="0" Info="EACH INF REQUIRES ACCOMPANYING ADT PASSENGER" Type="W"/>
                    <Message FailCode="0" Info="VALIDATING CARRIER" Type="W"/>
                    <Message FailCode="0" Info="BSP - SU" Type="W"/>
                    <Message FailCode="0" Info="RUT - SU" Type="W"/>
                  </Messages>
                  <BaggageInformationList>
                    <BaggageInformation AirlineCode="SU" ProvisionType="A">
                      <Segment Id="0"/>
                      <Segment Id="1"/>
                      <Allowance Pieces="0"/>
                    </BaggageInformation>
                  </BaggageInformationList>
                </TPA_Extensions>
              </PassengerFare>
              <Endorsements NonRefundableIndicator="true"/>
              <TPA_Extensions>
                <FareCalcLine Info="LED SU X/MOW SU AER0RUB0END"/>
              </TPA_Extensions>
              <FareInfos>
                <FareInfo>
                  <FareReference>N</FareReference>
                  <TPA_Extensions>
                    <SeatsRemaining BelowMin="false" Number="9"/>
                    <Cabin Cabin="Y"/>
                    <Meal Code="S"/>
                  </TPA_Extensions>
                </FareInfo>
                <FareInfo>
                  <FareReference>N</FareReference>
                  <TPA_Extensions>
                    <SeatsRemaining BelowMin="false" Number="9"/>
                    <Cabin Cabin="Y"/>
                    <Meal Code="S"/>
                  </TPA_Extensions>
                </FareInfo>
              </FareInfos>
            </PTC_FareBreakdown>
          </PTC_FareBreakdowns>
          <FareInfos>
            <FareInfo>
              <FareReference>N</FareReference>
              <TPA_Extensions>
                <SeatsRemaining BelowMin="false" Number="9"/>
                <Cabin Cabin="Y"/>
                <Meal Code="S"/>
              </TPA_Extensions>
            </FareInfo>
            <FareInfo>
              <FareReference>N</FareReference>
              <TPA_Extensions>
                <SeatsRemaining BelowMin="false" Number="9"/>
                <Cabin Cabin="Y"/>
                <Meal Code="S"/>
              </TPA_Extensions>
            </FareInfo>
          </FareInfos>
          <TPA_Extensions>
            <DivideInParty Indicator="false"/>
            <ValidatingCarrier NewVcxProcess="true" SettlementMethod="BSP">
              <Default Code="SU"/>
            </ValidatingCarrier>
            <ValidatingCarrier NewVcxProcess="true" SettlementMethod="RUT">
              <Default Code="SU"/>
            </ValidatingCarrier>
          </TPA_Extensions>
        </AirItineraryPricingInfo>
        <TicketingInfo TicketType="eTicket" ValidInterline="Yes"/>
        <TPA_Extensions>
          <ValidatingCarrier Code="SU"/>
        </TPA_Extensions>
      </PricedItinerary>
    </SimpleOneWayItineraries>
    <SimpleOneWayItineraries RPH="2">
      <PricedItinerary SequenceNumber="1">
        <AirItinerary DirectionInd="OneWay">
          <OriginDestinationOptions>
            <OriginDestinationOption ArrivalCountry="RU" DepartureCountry="RU" ElapsedTime="345">
              <FlightSegment ArrivalDateTime="2020-09-08T08:45:00" DepartureDateTime="2020-09-08T06:20:00" ElapsedTime="145" FlightNumber="1141" ResBookDesigCode="T" StopQuantity="0">
                <DepartureAirport LocationCode="AER"/>
                <ArrivalAirport LocationCode="SVO" TerminalID="B"/>
                <OperatingAirline Code="SU" FlightNumber="1141"/>
                <Equipment AirEquipType="32A"/>
                <MarketingAirline Code="SU"/>
                <MarriageGrp>O</MarriageGrp>
                <DepartureTimeZone GMTOffset="3"/>
                <ArrivalTimeZone GMTOffset="3"/>
                <TPA_Extensions>
                  <eTicket Ind="true"/>
                  <Mileage Amount="873"/>
                </TPA_Extensions>
              </FlightSegment>
              <FlightSegment ArrivalDateTime="2020-09-08T12:05:00" DepartureDateTime="2020-09-08T10:40:00" ElapsedTime="85" FlightNumber="14" ResBookDesigCode="T" StopQuantity="0">
                <DepartureAirport LocationCode="SVO" TerminalID="B"/>
                <ArrivalAirport LocationCode="LED" TerminalID="1"/>
                <OperatingAirline Code="SU" FlightNumber="14"/>
                <Equipment AirEquipType="320"/>
                <MarketingAirline Code="SU"/>
                <MarriageGrp>I</MarriageGrp>
                <DepartureTimeZone GMTOffset="3"/>
                <ArrivalTimeZone GMTOffset="3"/>
                <TPA_Extensions>
                  <eTicket Ind="true"/>
                  <Mileage Amount="372"/>
                </TPA_Extensions>
              </FlightSegment>
            </OriginDestinationOption>
          </OriginDestinationOptions>
        </AirItinerary>
        <AirItineraryPricingInfo BrandsOnAnyMarket="true" FareReturned="true" LastTicketDate="2020-06-07" LastTicketTime="23:59" PricingSource="WPNI1_ITIN" PricingSubSource="MIP">
          <ItinTotalFare>
            <BaseFare Amount="22605" CurrencyCode="RUB" DecimalPlaces="0"/>
            <FareConstruction Amount="22605" CurrencyCode="RUB" DecimalPlaces="0"/>
            <EquivFare Amount="22605" CurrencyCode="RUB" DecimalPlaces="0"/>
            <Taxes>
              <Tax Amount="12235" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="TOTALTAX"/>
            </Taxes>
            <TotalFare Amount="34840" CurrencyCode="RUB" DecimalPlaces="0"/>
          </ItinTotalFare>
          <PTC_FareBreakdowns>
            <PTC_FareBreakdown>
              <PassengerTypeQuantity Code="ADT" Quantity="2"/>
              <FareBasisCodes>
                <FareBasisCode ArrivalAirportCode="SVO" BookingCode="T" DepartureAirportCode="AER" FareComponentBeginAirport="AER" FareComponentDirectionality="FROM" FareComponentEndAirport="LED" FareComponentFareRule="ENR1" FareComponentFareTariff="304" FareComponentFareType="SBP" FareComponentFareTypeBitmap="00" FareComponentVendorCode="ATP" GovCarrier="SU">TNOR</FareBasisCode>
                <FareBasisCode ArrivalAirportCode="LED" AvailabilityBreak="true" BookingCode="T" DepartureAirportCode="SVO" GovCarrier="SU">TNOR</FareBasisCode>
              </FareBasisCodes>
              <PassengerFare>
                <BaseFare Amount="8220" CurrencyCode="RUB"/>
                <FareConstruction Amount="8220" CurrencyCode="RUB" DecimalPlaces="0"/>
                <EquivFare Amount="8220" CurrencyCode="RUB" DecimalPlaces="0"/>
                <Taxes>
                  <Tax Amount="1500" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                  <Tax Amount="1500" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                  <Tax Amount="270" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRF"/>
                  <Tax Amount="270" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRF"/>
                  <Tax Amount="120" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                  <Tax Amount="184" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                  <Tax Amount="158" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI4"/>
                  <Tax Amount="184" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI4"/>
                  <TaxSummary Amount="3000" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                  <TaxSummary Amount="540" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRF"/>
                  <TaxSummary Amount="646" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                  <TotalTax Amount="4186" CurrencyCode="RUB" DecimalPlaces="0"/>
                </Taxes>
                <TotalFare Amount="12406" CurrencyCode="RUB"/>
                <PenaltiesInfo>
                  <Penalty Amount="2600" Applicability="Before" Changeable="true" ConditionsApply="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                  <Penalty Amount="2600" Applicability="After" Changeable="true" ConditionsApply="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                  <Penalty Applicability="Before" Refundable="false" Type="Refund"/>
                  <Penalty Applicability="After" Refundable="false" Type="Refund"/>
                </PenaltiesInfo>
                <TPA_Extensions>
                  <FareComponents>
                    <FareComponent BrandID="NB" BrandName="ECONOMY LITE" ProgramCode="CFF1S" ProgramDescription="1S" ProgramID="85965" ProgramSystemCode="X">
                      <Segment FlightIndex="1" LegIndex="1"/>
                      <Segment FlightIndex="2" LegIndex="1"/>
                      <BrandFeatureRef FeatureId="3"/>
                      <BrandFeatureRef FeatureId="8"/>
                      <BrandFeatureRef FeatureId="9"/>
                      <BrandFeatureRef FeatureId="10"/>
                      <BrandFeatureRef FeatureId="6"/>
                      <BrandFeatureRef FeatureId="4"/>
                      <BrandFeatureRef FeatureId="5"/>
                      <BrandFeatureRef FeatureId="11"/>
                      <BrandFeatureRef FeatureId="2"/>
                      <BrandFeatureRef FeatureId="7"/>
                      <BrandFeatureRef FeatureId="14"/>
                      <BrandFeatureRef FeatureId="13"/>
                      <BrandFeatureRef FeatureId="12"/>
                      <BrandFeatureRef FeatureId="16"/>
                      <BrandFeatureRef FeatureId="15"/>
                      <BrandFeatureRef FeatureId="1"/>
                      <BrandFeatureRef FeatureId="20"/>
                      <BrandFeatureRef FeatureId="21"/>
                      <BrandFeatureRef FeatureId="19"/>
                      <BrandFeatureRef FeatureId="18"/>
                      <BrandFeatureRef FeatureId="17"/>
                      <BrandFeatureRef FeatureId="22"/>
                      <BrandFeatureRef FeatureId="23"/>
                      <BrandFeatureRef FeatureId="25"/>
                      <BrandFeatureRef FeatureId="26"/>
                      <BrandFeatureRef FeatureId="24"/>
                      <BrandFeatureRef FeatureId="27"/>
                      <BrandFeatureRef FeatureId="28"/>
                    </FareComponent>
                  </FareComponents>
                  <Messages>
                    <Message AirlineCode="SU" FailCode="0" Info="NONREF/HEBO3BPATEH" Type="N"/>
                    <Message FailCode="0" Info="VALIDATING CARRIER" Type="W"/>
                    <Message FailCode="0" Info="BSP - SU" Type="W"/>
                    <Message FailCode="0" Info="RUT - SU" Type="W"/>
                  </Messages>
                  <BaggageInformationList>
                    <BaggageInformation AirlineCode="SU" ProvisionType="A">
                      <Segment Id="0"/>
                      <Segment Id="1"/>
                      <Allowance Pieces="0"/>
                    </BaggageInformation>
                  </BaggageInformationList>
                </TPA_Extensions>
              </PassengerFare>
              <Endorsements NonRefundableIndicator="true"/>
              <TPA_Extensions>
                <FareCalcLine Info="AER SU X/MOW SU LED8220RUB8220END"/>
              </TPA_Extensions>
              <FareInfos>
                <FareInfo>
                  <FareReference>T</FareReference>
                  <TPA_Extensions>
                    <SeatsRemaining BelowMin="false" Number="9"/>
                    <Cabin Cabin="Y"/>
                    <Meal Code="S"/>
                  </TPA_Extensions>
                </FareInfo>
                <FareInfo>
                  <FareReference>T</FareReference>
                  <TPA_Extensions>
                    <SeatsRemaining BelowMin="false" Number="9"/>
                    <Cabin Cabin="Y"/>
                    <Meal Code="S"/>
                  </TPA_Extensions>
                </FareInfo>
              </FareInfos>
            </PTC_FareBreakdown>
            <PTC_FareBreakdown>
              <PassengerTypeQuantity Code="CNN" Quantity="1"/>
              <FareBasisCodes>
                <FareBasisCode ArrivalAirportCode="SVO" BookingCode="T" DepartureAirportCode="AER" FareComponentBeginAirport="AER" FareComponentDirectionality="FROM" FareComponentEndAirport="LED" FareComponentFareRule="ENR1" FareComponentFareTariff="304" FareComponentFareType="SBP" FareComponentFareTypeBitmap="01" FareComponentVendorCode="ATP" GovCarrier="SU">TNOR/CH25</FareBasisCode>
                <FareBasisCode ArrivalAirportCode="LED" AvailabilityBreak="true" BookingCode="T" DepartureAirportCode="SVO" GovCarrier="SU">TNOR/CH25</FareBasisCode>
              </FareBasisCodes>
              <PassengerFare>
                <BaseFare Amount="6165" CurrencyCode="RUB"/>
                <FareConstruction Amount="6165" CurrencyCode="RUB" DecimalPlaces="0"/>
                <EquivFare Amount="6165" CurrencyCode="RUB" DecimalPlaces="0"/>
                <Taxes>
                  <Tax Amount="1500" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                  <Tax Amount="1500" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                  <Tax Amount="270" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRF"/>
                  <Tax Amount="270" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRF"/>
                  <Tax Amount="60" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                  <Tax Amount="92" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                  <Tax Amount="79" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI4"/>
                  <Tax Amount="92" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI4"/>
                  <TaxSummary Amount="3000" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                  <TaxSummary Amount="540" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRF"/>
                  <TaxSummary Amount="323" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                  <TotalTax Amount="3863" CurrencyCode="RUB" DecimalPlaces="0"/>
                </Taxes>
                <TotalFare Amount="10028" CurrencyCode="RUB"/>
                <PenaltiesInfo>
                  <Penalty Amount="2600" Applicability="Before" Changeable="true" ConditionsApply="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                  <Penalty Amount="2600" Applicability="After" Changeable="true" ConditionsApply="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                  <Penalty Applicability="Before" Refundable="false" Type="Refund"/>
                  <Penalty Applicability="After" Refundable="false" Type="Refund"/>
                </PenaltiesInfo>
                <TPA_Extensions>
                  <FareComponents>
                    <FareComponent BrandID="NB" BrandName="ECONOMY LITE" ProgramCode="CFF1S" ProgramDescription="1S" ProgramID="85965" ProgramSystemCode="X">
                      <Segment FlightIndex="1" LegIndex="1"/>
                      <Segment FlightIndex="2" LegIndex="1"/>
                      <BrandFeatureRef FeatureId="3"/>
                      <BrandFeatureRef FeatureId="8"/>
                      <BrandFeatureRef FeatureId="9"/>
                      <BrandFeatureRef FeatureId="10"/>
                      <BrandFeatureRef FeatureId="6"/>
                      <BrandFeatureRef FeatureId="4"/>
                      <BrandFeatureRef FeatureId="5"/>
                      <BrandFeatureRef FeatureId="11"/>
                      <BrandFeatureRef FeatureId="2"/>
                      <BrandFeatureRef FeatureId="7"/>
                      <BrandFeatureRef FeatureId="14"/>
                      <BrandFeatureRef FeatureId="13"/>
                      <BrandFeatureRef FeatureId="12"/>
                      <BrandFeatureRef FeatureId="16"/>
                      <BrandFeatureRef FeatureId="15"/>
                      <BrandFeatureRef FeatureId="1"/>
                      <BrandFeatureRef FeatureId="20"/>
                      <BrandFeatureRef FeatureId="21"/>
                      <BrandFeatureRef FeatureId="19"/>
                      <BrandFeatureRef FeatureId="18"/>
                      <BrandFeatureRef FeatureId="17"/>
                      <BrandFeatureRef FeatureId="22"/>
                      <BrandFeatureRef FeatureId="23"/>
                      <BrandFeatureRef FeatureId="25"/>
                      <BrandFeatureRef FeatureId="26"/>
                      <BrandFeatureRef FeatureId="24"/>
                      <BrandFeatureRef FeatureId="27"/>
                      <BrandFeatureRef FeatureId="28"/>
                    </FareComponent>
                  </FareComponents>
                  <Messages>
                    <Message AirlineCode="SU" FailCode="0" Info="NONREF/HEBO3BPATEH" Type="N"/>
                    <Message FailCode="0" Info="EACH CNN REQUIRES ACCOMPANYING SAME CABIN ADT" Type="W"/>
                    <Message FailCode="0" Info="VALIDATING CARRIER" Type="W"/>
                    <Message FailCode="0" Info="BSP - SU" Type="W"/>
                    <Message FailCode="0" Info="RUT - SU" Type="W"/>
                  </Messages>
                  <BaggageInformationList>
                    <BaggageInformation AirlineCode="SU" ProvisionType="A">
                      <Segment Id="0"/>
                      <Segment Id="1"/>
                      <Allowance Pieces="0"/>
                    </BaggageInformation>
                  </BaggageInformationList>
                </TPA_Extensions>
              </PassengerFare>
              <Endorsements NonRefundableIndicator="true"/>
              <TPA_Extensions>
                <FareCalcLine Info="AER SU X/MOW SU LED6165RUB6165END"/>
              </TPA_Extensions>
              <FareInfos>
                <FareInfo>
                  <FareReference>T</FareReference>
                  <TPA_Extensions>
                    <SeatsRemaining BelowMin="false" Number="9"/>
                    <Cabin Cabin="Y"/>
                    <Meal Code="S"/>
                  </TPA_Extensions>
                </FareInfo>
                <FareInfo>
                  <FareReference>T</FareReference>
                  <TPA_Extensions>
                    <SeatsRemaining BelowMin="false" Number="9"/>
                    <Cabin Cabin="Y"/>
                    <Meal Code="S"/>
                  </TPA_Extensions>
                </FareInfo>
              </FareInfos>
            </PTC_FareBreakdown>
            <PTC_FareBreakdown>
              <PassengerTypeQuantity Code="INF" Quantity="1"/>
              <FareBasisCodes>
                <FareBasisCode ArrivalAirportCode="SVO" BookingCode="T" DepartureAirportCode="AER" FareComponentBeginAirport="AER" FareComponentDirectionality="FROM" FareComponentEndAirport="LED" FareComponentFareRule="ENR1" FareComponentFareTariff="304" FareComponentFareType="SBP" FareComponentFareTypeBitmap="01" FareComponentVendorCode="ATP" GovCarrier="SU">TNOR/IN00</FareBasisCode>
                <FareBasisCode ArrivalAirportCode="LED" AvailabilityBreak="true" BookingCode="T" DepartureAirportCode="SVO" GovCarrier="SU">TNOR/IN00</FareBasisCode>
              </FareBasisCodes>
              <PassengerFare>
                <BaseFare Amount="0" CurrencyCode="RUB"/>
                <FareConstruction Amount="0" CurrencyCode="RUB" DecimalPlaces="0"/>
                <EquivFare Amount="0" CurrencyCode="RUB" DecimalPlaces="0"/>
                <TotalFare Amount="0" CurrencyCode="RUB"/>
                <PenaltiesInfo>
                  <Penalty Amount="2600" Applicability="Before" Changeable="true" ConditionsApply="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                  <Penalty Amount="2600" Applicability="After" Changeable="true" ConditionsApply="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                  <Penalty Applicability="Before" Refundable="false" Type="Refund"/>
                  <Penalty Applicability="After" Refundable="false" Type="Refund"/>
                </PenaltiesInfo>
                <TPA_Extensions>
                  <FareComponents>
                    <FareComponent BrandID="NB" BrandName="ECONOMY LITE" ProgramCode="CFF1S" ProgramDescription="1S" ProgramID="85965" ProgramSystemCode="X">
                      <Segment FlightIndex="1" LegIndex="1"/>
                      <Segment FlightIndex="2" LegIndex="1"/>
                      <BrandFeatureRef FeatureId="3"/>
                      <BrandFeatureRef FeatureId="8"/>
                      <BrandFeatureRef FeatureId="9"/>
                      <BrandFeatureRef FeatureId="10"/>
                      <BrandFeatureRef FeatureId="6"/>
                      <BrandFeatureRef FeatureId="4"/>
                      <BrandFeatureRef FeatureId="5"/>
                      <BrandFeatureRef FeatureId="11"/>
                      <BrandFeatureRef FeatureId="2"/>
                      <BrandFeatureRef FeatureId="7"/>
                      <BrandFeatureRef FeatureId="14"/>
                      <BrandFeatureRef FeatureId="13"/>
                      <BrandFeatureRef FeatureId="12"/>
                      <BrandFeatureRef FeatureId="16"/>
                      <BrandFeatureRef FeatureId="15"/>
                      <BrandFeatureRef FeatureId="1"/>
                      <BrandFeatureRef FeatureId="20"/>
                      <BrandFeatureRef FeatureId="21"/>
                      <BrandFeatureRef FeatureId="19"/>
                      <BrandFeatureRef FeatureId="18"/>
                      <BrandFeatureRef FeatureId="17"/>
                      <BrandFeatureRef FeatureId="22"/>
                      <BrandFeatureRef FeatureId="23"/>
                      <BrandFeatureRef FeatureId="25"/>
                      <BrandFeatureRef FeatureId="26"/>
                      <BrandFeatureRef FeatureId="24"/>
                      <BrandFeatureRef FeatureId="27"/>
                      <BrandFeatureRef FeatureId="28"/>
                    </FareComponent>
                  </FareComponents>
                  <Messages>
                    <Message AirlineCode="SU" FailCode="0" Info="NONREF/HEBO3BPATEH" Type="N"/>
                    <Message FailCode="0" Info="EACH INF REQUIRES ACCOMPANYING ADT PASSENGER" Type="W"/>
                    <Message FailCode="0" Info="VALIDATING CARRIER" Type="W"/>
                    <Message FailCode="0" Info="BSP - SU" Type="W"/>
                    <Message FailCode="0" Info="RUT - SU" Type="W"/>
                  </Messages>
                  <BaggageInformationList>
                    <BaggageInformation AirlineCode="SU" ProvisionType="A">
                      <Segment Id="0"/>
                      <Segment Id="1"/>
                      <Allowance Pieces="0"/>
                    </BaggageInformation>
                  </BaggageInformationList>
                </TPA_Extensions>
              </PassengerFare>
              <Endorsements NonRefundableIndicator="true"/>
              <TPA_Extensions>
                <FareCalcLine Info="AER SU X/MOW SU LED0RUB0END"/>
              </TPA_Extensions>
              <FareInfos>
                <FareInfo>
                  <FareReference>T</FareReference>
                  <TPA_Extensions>
                    <SeatsRemaining BelowMin="false" Number="9"/>
                    <Cabin Cabin="Y"/>
                    <Meal Code="S"/>
                  </TPA_Extensions>
                </FareInfo>
                <FareInfo>
                  <FareReference>T</FareReference>
                  <TPA_Extensions>
                    <SeatsRemaining BelowMin="false" Number="9"/>
                    <Cabin Cabin="Y"/>
                    <Meal Code="S"/>
                  </TPA_Extensions>
                </FareInfo>
              </FareInfos>
            </PTC_FareBreakdown>
          </PTC_FareBreakdowns>
          <FareInfos>
            <FareInfo>
              <FareReference>T</FareReference>
              <TPA_Extensions>
                <SeatsRemaining BelowMin="false" Number="9"/>
                <Cabin Cabin="Y"/>
                <Meal Code="S"/>
              </TPA_Extensions>
            </FareInfo>
            <FareInfo>
              <FareReference>T</FareReference>
              <TPA_Extensions>
                <SeatsRemaining BelowMin="false" Number="9"/>
                <Cabin Cabin="Y"/>
                <Meal Code="S"/>
              </TPA_Extensions>
            </FareInfo>
          </FareInfos>
          <TPA_Extensions>
            <DivideInParty Indicator="false"/>
            <ValidatingCarrier NewVcxProcess="true" SettlementMethod="BSP">
              <Default Code="SU"/>
            </ValidatingCarrier>
            <ValidatingCarrier NewVcxProcess="true" SettlementMethod="RUT">
              <Default Code="SU"/>
            </ValidatingCarrier>
          </TPA_Extensions>
        </AirItineraryPricingInfo>
        <TicketingInfo TicketType="eTicket" ValidInterline="Yes"/>
        <TPA_Extensions>
          <ValidatingCarrier Code="SU"/>
        </TPA_Extensions>
      </PricedItinerary>
    </SimpleOneWayItineraries>
  </OneWayItineraries>
  <TPA_Extensions>
    <AirlineOrderList>
      <AirlineOrder Code="SU" SequenceNumber="1"/>
    </AirlineOrderList>
  </TPA_Extensions>
</OTA_AirLowFareSearchRS>
{% endxmlsec %}

---

{% xmlsec "Пример запроса (оформление на нескольких билетах (SCHS))", false %}
<OTA_AirLowFareSearchRQ ResponseType="OTA" Version="6.1.0" xmlns="http://www.opentravel.org/OTA/2003/05">
  <POS>
    <Source PseudoCityCode="9LSC">
      <RequestorID ID="1" Type="1">
        <CompanyName Code="TN"/>
      </RequestorID>
    </Source>
  </POS>
  <OriginDestinationInformation RPH="1">
    <DepartureDateTime>2020-09-01T05:00:00</DepartureDateTime>
    <OriginLocation LocationCode="LED"/>
    <DestinationLocation LocationCode="AER"/>
    <TPA_Extensions>
      <Flight ArrivalDateTime="2020-09-01T06:25:00" ClassOfService="Y" DepartureDateTime="2020-09-01T05:00:00" Number="35" Type="A">
        <OriginLocation LocationCode="LED"/>
        <DestinationLocation LocationCode="SVO"/>
        <Airline Marketing="SU" Operating="SU"/>
      </Flight>
      <Flight ArrivalDateTime="2020-09-01T10:15:00" ClassOfService="Y" DepartureDateTime="2020-09-01T07:45:00" Number="1138" Type="A">
        <OriginLocation LocationCode="SVO"/>
        <DestinationLocation LocationCode="AER"/>
        <Airline Marketing="SU" Operating="SU"/>
      </Flight>
    </TPA_Extensions>
  </OriginDestinationInformation>
  <OriginDestinationInformation RPH="2">
    <DepartureDateTime>2020-09-08T06:50:00</DepartureDateTime>
    <OriginLocation LocationCode="AER"/>
    <DestinationLocation LocationCode="LED"/>
    <TPA_Extensions>
      <Flight ArrivalDateTime="2020-09-08T09:20:00" ClassOfService="Y" DepartureDateTime="2020-09-08T06:50:00" Number="1141" Type="A">
        <OriginLocation LocationCode="AER"/>
        <DestinationLocation LocationCode="SVO"/>
        <Airline Marketing="SU" Operating="SU"/>
      </Flight>
      <Flight ArrivalDateTime="2020-09-08T12:20:00" ClassOfService="Y" DepartureDateTime="2020-09-08T10:55:00" Number="14" Type="A">
        <OriginLocation LocationCode="SVO"/>
        <DestinationLocation LocationCode="LED"/>
        <Airline Marketing="SU" Operating="SU"/>
      </Flight>
    </TPA_Extensions>
  </OriginDestinationInformation>
  <TravelPreferences>
    <TPA_Extensions>
      <VerificationItinCallLogic Value="L"/>
    </TPA_Extensions>
    <Baggage Description="true" RequestType="A"/>
  </TravelPreferences>
  <TravelerInfoSummary>
    <SeatsRequested>3</SeatsRequested>
    <AirTravelerAvail>
      <PassengerTypeQuantity Code="ADT" Quantity="2">
        <TPA_Extensions>
          <VoluntaryChanges Match="Info"/>
        </TPA_Extensions>
      </PassengerTypeQuantity>
      <PassengerTypeQuantity Code="CNN" Quantity="1">
        <TPA_Extensions>
          <VoluntaryChanges Match="Info"/>
        </TPA_Extensions>
      </PassengerTypeQuantity>
      <PassengerTypeQuantity Code="INF" Quantity="1">
        <TPA_Extensions>
          <VoluntaryChanges Match="Info"/>
        </TPA_Extensions>
      </PassengerTypeQuantity>
    </AirTravelerAvail>
    <PriceRequestInformation>
      <TPA_Extensions>
        <BrandedFareIndicators ReturnBrandAncillaries="true" SingleBrandedFare="true"/>
      </TPA_Extensions>
    </PriceRequestInformation>
  </TravelerInfoSummary>
  <TPA_Extensions>
    <MultiTicket DisplayPolicy="SCHS"/>
  </TPA_Extensions>
</OTA_AirLowFareSearchRQ>
{% endxmlsec %}

{% xmlsec "Пример ответа", false %}
<OTA_AirLowFareSearchRS AvailableItinCount="0" BrandedOneWayItinCount="0" DepartedItinCount="0" PricedItinCount="1" SimpleOneWayItinCount="0" SoldOutItinCount="0" Version="6.1.0" xmlns="http://www.opentravel.org/OTA/2003/05" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <Success/>
  <Warnings>
    <Warning Code="TRANSACTIONID" MessageClass="I" ShortText="1675645257185425400" Type="WORKERTHREAD"/>
    <Warning Code="ASEPT2LAPP00311.IDM.SGDCPROD.SABRE.COM" MessageClass="I" ShortText="27034" Type="SERVER"/>
    <Warning Code="RULEID" MessageClass="I" ShortText="24113" Type="DRE"/>
    <Warning Code="RULEID" MessageClass="I" ShortText="24111" Type="DEFAULT"/>
  </Warnings>
  <BrandFeatures>
    <BrandFeature Application="C" CommercialName="BASIC SEAT" Id="1" ServiceGroup="BF" ServiceType="Z" SubCode="050" Vendor="ATP"/>
    <BrandFeature Application="C" CommercialName="CHANGEABLE TICKET" Id="2" ServiceGroup="BF" ServiceType="Z" SubCode="059" Vendor="ATP"/>
    <BrandFeature Application="N" CommercialName="25 PERCENT MILES EARNED" Id="3" ServiceGroup="BF" ServiceType="Z" SubCode="06A" Vendor="ATP"/>
    <BrandFeature Application="N" CommercialName="150 PERCENT MILES EARNED" Id="4" ServiceGroup="BF" ServiceType="Z" SubCode="06M" Vendor="ATP"/>
    <BrandFeature Application="N" CommercialName="200 PERCENT MILES EARNED" Id="5" ServiceGroup="BF" ServiceType="Z" SubCode="06N" Vendor="ATP"/>
    <BrandFeature Application="N" CommercialName="125 MILES EARNED" Id="6" ServiceGroup="BF" ServiceType="Z" SubCode="06Y" Vendor="ATP"/>
    <BrandFeature Application="N" CommercialName="CHANGE IN CASE OF NO SHOW" Id="7" ServiceGroup="BF" ServiceType="Z" SubCode="CNS" Vendor="ATP"/>
    <BrandFeature Application="F" CommercialName="75 TO 125 PCNT MILES EARNED" Id="8" ServiceGroup="BF" ServiceType="Z" SubCode="ME1" Vendor="ATP"/>
    <BrandFeature Application="N" CommercialName="100 TO 150 PCNT MILES EARNED" Id="9" ServiceGroup="BF" ServiceType="Z" SubCode="ME2" Vendor="ATP"/>
    <BrandFeature Application="N" CommercialName="150 TO 200 PCNT MILES EARNED" Id="10" ServiceGroup="BF" ServiceType="Z" SubCode="ME3" Vendor="ATP"/>
    <BrandFeature Application="N" CommercialName="200 TO 250 PCNT MILES EARNED" Id="11" ServiceGroup="BF" ServiceType="Z" SubCode="ME4" Vendor="ATP"/>
    <BrandFeature Application="N" CommercialName="OPEN RETURN DATE" Id="12" ServiceGroup="BF" ServiceType="Z" SubCode="ORD" Vendor="ATP"/>
    <BrandFeature Application="N" CommercialName="REFUND AFTER CHECKIN CLOSURE" Id="13" ServiceGroup="BF" ServiceType="Z" SubCode="RBA" Vendor="ATP"/>
    <BrandFeature Application="N" CommercialName="REFUND BEFORE CHECKIN CLOSURE" Id="14" ServiceGroup="BF" ServiceType="Z" SubCode="RBC" Vendor="ATP"/>
    <BrandFeature Application="N" CommercialName="STOPOVER" Id="15" ServiceGroup="BF" ServiceType="Z" SubCode="STO" Vendor="ATP"/>
    <BrandFeature Application="C" CommercialName="UPGRADE AT CHECKIN TO COMFORT" Id="16" ServiceGroup="BF" ServiceType="Z" SubCode="UT2" Vendor="ATP"/>
    <BrandFeature Application="C" CommercialName="SECOND EXCESS BAG" Id="17" ServiceGroup="BG" ServiceType="C" SubCode="0CD" Vendor="ATP"/>
    <BrandFeature Application="N" CommercialName="UPTO70LB 32KG AND62LI 158LCM" Id="18" ServiceGroup="BG" ServiceType="C" SubCode="0FM" Vendor="ATP"/>
    <BrandFeature Application="C" CommercialName="UPTO50LB 23KG AND62LI 158LCM" Id="19" ServiceGroup="BG" ServiceType="C" SubCode="0GO" Vendor="ATP"/>
    <BrandFeature Application="F" CommercialName="CARRY10KG 22LBUPTO 55X40X25CM" Id="20" ServiceGroup="BG" ServiceType="C" SubCode="0MJ" Vendor="ATP"/>
    <BrandFeature Application="N" CommercialName="CARRY15KG 33LBUPTO 55X40X25CM" Id="21" ServiceGroup="BG" ServiceType="C" SubCode="0MK" Vendor="ATP"/>
    <BrandFeature Application="C" CommercialName="INTERNET ACCESS" Id="22" ServiceGroup="IE" ServiceType="F" SubCode="0CL" Vendor="ATP"/>
    <BrandFeature Application="N" CommercialName="LOUNGE ACCESS" Id="23" ServiceGroup="LG" ServiceType="F" SubCode="0BX" Vendor="ATP"/>
    <BrandFeature Application="N" CommercialName="PRIORITY CHECK IN" Id="24" ServiceGroup="TS" ServiceType="F" SubCode="03P" Vendor="ATP"/>
    <BrandFeature Application="N" CommercialName="PRIORITY BOARDING" Id="25" ServiceGroup="TS" ServiceType="F" SubCode="0G6" Vendor="ATP"/>
    <BrandFeature Application="N" CommercialName="PRIORITY BAGGAGE" Id="26" ServiceGroup="TS" ServiceType="F" SubCode="0LF" Vendor="ATP"/>
    <BrandFeature Application="N" CommercialName="UPGRADE WITH MILES BONUS" Id="27" ServiceGroup="UP" ServiceType="F" SubCode="0NI" Vendor="ATP"/>
    <BrandFeature Application="C" CommercialName="UPGRADE AT CHECKIN TO BUSINESS" Id="28" ServiceGroup="UP" ServiceType="F" SubCode="UPF" Vendor="ATP"/>
  </BrandFeatures>
  <PricedItineraries>
    <PricedItinerary SequenceNumber="1">
      <AirItinerary DirectionInd="Return">
        <OriginDestinationOptions>
          <OriginDestinationOption ArrivalCountry="RU" DepartureCountry="RU" ElapsedTime="315">
            <FlightSegment ArrivalDateTime="2020-09-01T06:25:00" DepartureDateTime="2020-09-01T05:00:00" ElapsedTime="85" FlightNumber="35" ResBookDesigCode="N" StopQuantity="0">
              <DepartureAirport LocationCode="LED" TerminalID="1"/>
              <ArrivalAirport LocationCode="SVO" TerminalID="B"/>
              <OperatingAirline Code="SU" FlightNumber="35"/>
              <Equipment AirEquipType="320"/>
              <MarketingAirline Code="SU"/>
              <MarriageGrp>O</MarriageGrp>
              <DepartureTimeZone GMTOffset="3"/>
              <ArrivalTimeZone GMTOffset="3"/>
              <TPA_Extensions>
                <eTicket Ind="true"/>
                <Mileage Amount="372"/>
              </TPA_Extensions>
            </FlightSegment>
            <FlightSegment ArrivalDateTime="2020-09-01T10:15:00" DepartureDateTime="2020-09-01T07:40:00" ElapsedTime="155" FlightNumber="1138" ResBookDesigCode="N" StopQuantity="0">
              <DepartureAirport LocationCode="SVO" TerminalID="B"/>
              <ArrivalAirport LocationCode="AER"/>
              <OperatingAirline Code="SU" FlightNumber="1138"/>
              <Equipment AirEquipType="73H"/>
              <MarketingAirline Code="SU"/>
              <MarriageGrp>I</MarriageGrp>
              <DepartureTimeZone GMTOffset="3"/>
              <ArrivalTimeZone GMTOffset="3"/>
              <TPA_Extensions>
                <eTicket Ind="true"/>
                <Mileage Amount="873"/>
              </TPA_Extensions>
            </FlightSegment>
          </OriginDestinationOption>
          <OriginDestinationOption ArrivalCountry="RU" DepartureCountry="RU" ElapsedTime="345">
            <FlightSegment ArrivalDateTime="2020-09-08T08:45:00" DepartureDateTime="2020-09-08T06:20:00" ElapsedTime="145" FlightNumber="1141" ResBookDesigCode="T" StopQuantity="0">
              <DepartureAirport LocationCode="AER"/>
              <ArrivalAirport LocationCode="SVO" TerminalID="B"/>
              <OperatingAirline Code="SU" FlightNumber="1141"/>
              <Equipment AirEquipType="32A"/>
              <MarketingAirline Code="SU"/>
              <MarriageGrp>O</MarriageGrp>
              <DepartureTimeZone GMTOffset="3"/>
              <ArrivalTimeZone GMTOffset="3"/>
              <TPA_Extensions>
                <eTicket Ind="true"/>
                <Mileage Amount="873"/>
              </TPA_Extensions>
            </FlightSegment>
            <FlightSegment ArrivalDateTime="2020-09-08T12:05:00" DepartureDateTime="2020-09-08T10:40:00" ElapsedTime="85" FlightNumber="14" ResBookDesigCode="T" StopQuantity="0">
              <DepartureAirport LocationCode="SVO" TerminalID="B"/>
              <ArrivalAirport LocationCode="LED" TerminalID="1"/>
              <OperatingAirline Code="SU" FlightNumber="14"/>
              <Equipment AirEquipType="320"/>
              <MarketingAirline Code="SU"/>
              <MarriageGrp>I</MarriageGrp>
              <DepartureTimeZone GMTOffset="3"/>
              <ArrivalTimeZone GMTOffset="3"/>
              <TPA_Extensions>
                <eTicket Ind="true"/>
                <Mileage Amount="372"/>
              </TPA_Extensions>
            </FlightSegment>
          </OriginDestinationOption>
        </OriginDestinationOptions>
      </AirItinerary>
      <AirItineraryPricingInfo BrandsOnAnyMarket="true" FareReturned="true" LastTicketDate="2020-05-31" LastTicketTime="23:59" PricingSource="WPNI1_ITIN" PricingSubSource="MIP">
        <ItinTotalFare>
          <BaseFare Amount="31215" CurrencyCode="RUB" DecimalPlaces="0"/>
          <FareConstruction Amount="31213" CurrencyCode="RUB" DecimalPlaces="0"/>
          <EquivFare Amount="31215" CurrencyCode="RUB" DecimalPlaces="0"/>
          <Taxes>
            <Tax Amount="24470" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="TOTALTAX"/>
          </Taxes>
          <TotalFare Amount="55685" CurrencyCode="RUB" DecimalPlaces="0"/>
        </ItinTotalFare>
        <PTC_FareBreakdowns>
          <PTC_FareBreakdown>
            <PassengerTypeQuantity Code="ADT" Quantity="2"/>
            <FareBasisCodes>
              <FareBasisCode ArrivalAirportCode="SVO" BookingCode="N" DepartureAirportCode="LED" FareComponentBeginAirport="LED" FareComponentDirectionality="FROM" FareComponentEndAirport="AER" FareComponentFareRule="ENR1" FareComponentFareTariff="304" FareComponentFareType="SB" FareComponentFareTypeBitmap="00" FareComponentVendorCode="ATP" GovCarrier="SU">NNBR</FareBasisCode>
              <FareBasisCode ArrivalAirportCode="AER" AvailabilityBreak="true" BookingCode="N" DepartureAirportCode="SVO" GovCarrier="SU">NNBR</FareBasisCode>
              <FareBasisCode ArrivalAirportCode="SVO" BookingCode="T" DepartureAirportCode="AER" FareComponentBeginAirport="AER" FareComponentDirectionality="TO" FareComponentEndAirport="LED" FareComponentFareRule="ENR1" FareComponentFareTariff="304" FareComponentFareType="SB" FareComponentFareTypeBitmap="00" FareComponentVendorCode="ATP" GovCarrier="SU">TNBR</FareBasisCode>
              <FareBasisCode ArrivalAirportCode="LED" AvailabilityBreak="true" BookingCode="T" DepartureAirportCode="SVO" GovCarrier="SU">TNBR</FareBasisCode>
            </FareBasisCodes>
            <PassengerFare>
              <BaseFare Amount="11350" CurrencyCode="RUB"/>
              <FareConstruction Amount="11350" CurrencyCode="RUB" DecimalPlaces="0"/>
              <EquivFare Amount="11350" CurrencyCode="RUB" DecimalPlaces="0"/>
              <Taxes>
                <Tax Amount="1500" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                <Tax Amount="1500" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                <Tax Amount="1500" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                <Tax Amount="1500" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                <Tax Amount="270" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRF"/>
                <Tax Amount="270" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRF"/>
                <Tax Amount="270" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRF"/>
                <Tax Amount="270" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRF"/>
                <Tax Amount="158" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                <Tax Amount="184" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                <Tax Amount="120" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                <Tax Amount="184" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                <Tax Amount="158" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI4"/>
                <Tax Amount="184" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI4"/>
                <Tax Amount="120" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI4"/>
                <Tax Amount="184" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI4"/>
                <TaxSummary Amount="6000" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                <TaxSummary Amount="1080" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRF"/>
                <TaxSummary Amount="1292" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                <TotalTax Amount="8372" CurrencyCode="RUB" DecimalPlaces="0"/>
              </Taxes>
              <TotalFare Amount="19722" CurrencyCode="RUB"/>
              <PenaltiesInfo>
                <Penalty Amount="2600" Applicability="Before" Changeable="true" ConditionsApply="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                <Penalty Amount="2600" Applicability="After" Changeable="true" ConditionsApply="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                <Penalty Applicability="Before" Refundable="false" Type="Refund"/>
                <Penalty Applicability="After" Refundable="false" Type="Refund"/>
              </PenaltiesInfo>
              <TPA_Extensions>
                <FareComponents>
                  <FareComponent BrandID="NB" BrandName="ECONOMY LITE" ProgramCode="CFF1S" ProgramDescription="1S" ProgramID="85965" ProgramSystemCode="X">
                    <Segment FlightIndex="1" LegIndex="1"/>
                    <Segment FlightIndex="2" LegIndex="1"/>
                    <BrandFeatureRef FeatureId="3"/>
                    <BrandFeatureRef FeatureId="8"/>
                    <BrandFeatureRef FeatureId="9"/>
                    <BrandFeatureRef FeatureId="10"/>
                    <BrandFeatureRef FeatureId="6"/>
                    <BrandFeatureRef FeatureId="4"/>
                    <BrandFeatureRef FeatureId="5"/>
                    <BrandFeatureRef FeatureId="11"/>
                    <BrandFeatureRef FeatureId="2"/>
                    <BrandFeatureRef FeatureId="7"/>
                    <BrandFeatureRef FeatureId="14"/>
                    <BrandFeatureRef FeatureId="13"/>
                    <BrandFeatureRef FeatureId="12"/>
                    <BrandFeatureRef FeatureId="16"/>
                    <BrandFeatureRef FeatureId="15"/>
                    <BrandFeatureRef FeatureId="1"/>
                    <BrandFeatureRef FeatureId="20"/>
                    <BrandFeatureRef FeatureId="21"/>
                    <BrandFeatureRef FeatureId="19"/>
                    <BrandFeatureRef FeatureId="18"/>
                    <BrandFeatureRef FeatureId="17"/>
                    <BrandFeatureRef FeatureId="22"/>
                    <BrandFeatureRef FeatureId="23"/>
                    <BrandFeatureRef FeatureId="25"/>
                    <BrandFeatureRef FeatureId="26"/>
                    <BrandFeatureRef FeatureId="24"/>
                    <BrandFeatureRef FeatureId="27"/>
                    <BrandFeatureRef FeatureId="28"/>
                  </FareComponent>
                  <FareComponent BrandID="NB" BrandName="ECONOMY LITE" ProgramCode="CFF1S" ProgramDescription="1S" ProgramID="85965" ProgramSystemCode="X">
                    <Segment FlightIndex="1" LegIndex="2"/>
                    <Segment FlightIndex="2" LegIndex="2"/>
                    <BrandFeatureRef FeatureId="3"/>
                    <BrandFeatureRef FeatureId="8"/>
                    <BrandFeatureRef FeatureId="9"/>
                    <BrandFeatureRef FeatureId="10"/>
                    <BrandFeatureRef FeatureId="6"/>
                    <BrandFeatureRef FeatureId="4"/>
                    <BrandFeatureRef FeatureId="5"/>
                    <BrandFeatureRef FeatureId="11"/>
                    <BrandFeatureRef FeatureId="2"/>
                    <BrandFeatureRef FeatureId="7"/>
                    <BrandFeatureRef FeatureId="14"/>
                    <BrandFeatureRef FeatureId="13"/>
                    <BrandFeatureRef FeatureId="12"/>
                    <BrandFeatureRef FeatureId="16"/>
                    <BrandFeatureRef FeatureId="15"/>
                    <BrandFeatureRef FeatureId="1"/>
                    <BrandFeatureRef FeatureId="20"/>
                    <BrandFeatureRef FeatureId="21"/>
                    <BrandFeatureRef FeatureId="19"/>
                    <BrandFeatureRef FeatureId="18"/>
                    <BrandFeatureRef FeatureId="17"/>
                    <BrandFeatureRef FeatureId="22"/>
                    <BrandFeatureRef FeatureId="23"/>
                    <BrandFeatureRef FeatureId="25"/>
                    <BrandFeatureRef FeatureId="26"/>
                    <BrandFeatureRef FeatureId="24"/>
                    <BrandFeatureRef FeatureId="27"/>
                    <BrandFeatureRef FeatureId="28"/>
                  </FareComponent>
                </FareComponents>
                <Messages>
                  <Message AirlineCode="SU" FailCode="0" Info="NONREF/HEBO3BPATEH" Type="N"/>
                  <Message FailCode="0" Info="VALIDATING CARRIER" Type="W"/>
                  <Message FailCode="0" Info="BSP - SU" Type="W"/>
                  <Message FailCode="0" Info="RUT - SU" Type="W"/>
                </Messages>
                <BaggageInformationList>
                  <BaggageInformation AirlineCode="SU" ProvisionType="A">
                    <Segment Id="0"/>
                    <Segment Id="1"/>
                    <Allowance Pieces="0"/>
                  </BaggageInformation>
                  <BaggageInformation AirlineCode="SU" ProvisionType="A">
                    <Segment Id="2"/>
                    <Segment Id="3"/>
                    <Allowance Pieces="0"/>
                  </BaggageInformation>
                </BaggageInformationList>
              </TPA_Extensions>
            </PassengerFare>
            <Endorsements NonRefundableIndicator="true"/>
            <TPA_Extensions>
              <FareCalcLine Info="LED SU X/MOW SU AER4500SU X/MOW SU LED6850RUB11350END"/>
            </TPA_Extensions>
            <FareInfos>
              <FareInfo>
                <FareReference>N</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="S"/>
                </TPA_Extensions>
              </FareInfo>
              <FareInfo>
                <FareReference>N</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="S"/>
                </TPA_Extensions>
              </FareInfo>
              <FareInfo>
                <FareReference>T</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="S"/>
                </TPA_Extensions>
              </FareInfo>
              <FareInfo>
                <FareReference>T</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="S"/>
                </TPA_Extensions>
              </FareInfo>
            </FareInfos>
          </PTC_FareBreakdown>
          <PTC_FareBreakdown>
            <PassengerTypeQuantity Code="CNN" Quantity="1"/>
            <FareBasisCodes>
              <FareBasisCode ArrivalAirportCode="SVO" BookingCode="N" DepartureAirportCode="LED" FareComponentBeginAirport="LED" FareComponentDirectionality="FROM" FareComponentEndAirport="AER" FareComponentFareRule="ENR1" FareComponentFareTariff="304" FareComponentFareType="SB" FareComponentFareTypeBitmap="01" FareComponentVendorCode="ATP" GovCarrier="SU">NNBR/CH25</FareBasisCode>
              <FareBasisCode ArrivalAirportCode="AER" AvailabilityBreak="true" BookingCode="N" DepartureAirportCode="SVO" GovCarrier="SU">NNBR/CH25</FareBasisCode>
              <FareBasisCode ArrivalAirportCode="SVO" BookingCode="T" DepartureAirportCode="AER" FareComponentBeginAirport="AER" FareComponentDirectionality="TO" FareComponentEndAirport="LED" FareComponentFareRule="ENR1" FareComponentFareTariff="304" FareComponentFareType="SB" FareComponentFareTypeBitmap="01" FareComponentVendorCode="ATP" GovCarrier="SU">TNBR/CH25</FareBasisCode>
              <FareBasisCode ArrivalAirportCode="LED" AvailabilityBreak="true" BookingCode="T" DepartureAirportCode="SVO" GovCarrier="SU">TNBR/CH25</FareBasisCode>
            </FareBasisCodes>
            <PassengerFare>
              <BaseFare Amount="8515" CurrencyCode="RUB"/>
              <FareConstruction Amount="8513" CurrencyCode="RUB" DecimalPlaces="0"/>
              <EquivFare Amount="8515" CurrencyCode="RUB" DecimalPlaces="0"/>
              <Taxes>
                <Tax Amount="1500" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                <Tax Amount="1500" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                <Tax Amount="1500" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                <Tax Amount="1500" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                <Tax Amount="270" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRF"/>
                <Tax Amount="270" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRF"/>
                <Tax Amount="270" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRF"/>
                <Tax Amount="270" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRF"/>
                <Tax Amount="79" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                <Tax Amount="92" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                <Tax Amount="60" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                <Tax Amount="92" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                <Tax Amount="79" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI4"/>
                <Tax Amount="92" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI4"/>
                <Tax Amount="60" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI4"/>
                <Tax Amount="92" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI4"/>
                <TaxSummary Amount="6000" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                <TaxSummary Amount="1080" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRF"/>
                <TaxSummary Amount="646" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                <TotalTax Amount="7726" CurrencyCode="RUB" DecimalPlaces="0"/>
              </Taxes>
              <TotalFare Amount="16241" CurrencyCode="RUB"/>
              <PenaltiesInfo>
                <Penalty Amount="2600" Applicability="Before" Changeable="true" ConditionsApply="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                <Penalty Amount="2600" Applicability="After" Changeable="true" ConditionsApply="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                <Penalty Applicability="Before" Refundable="false" Type="Refund"/>
                <Penalty Applicability="After" Refundable="false" Type="Refund"/>
              </PenaltiesInfo>
              <TPA_Extensions>
                <FareComponents>
                  <FareComponent BrandID="NB" BrandName="ECONOMY LITE" ProgramCode="CFF1S" ProgramDescription="1S" ProgramID="85965" ProgramSystemCode="X">
                    <Segment FlightIndex="1" LegIndex="1"/>
                    <Segment FlightIndex="2" LegIndex="1"/>
                    <BrandFeatureRef FeatureId="3"/>
                    <BrandFeatureRef FeatureId="8"/>
                    <BrandFeatureRef FeatureId="9"/>
                    <BrandFeatureRef FeatureId="10"/>
                    <BrandFeatureRef FeatureId="6"/>
                    <BrandFeatureRef FeatureId="4"/>
                    <BrandFeatureRef FeatureId="5"/>
                    <BrandFeatureRef FeatureId="11"/>
                    <BrandFeatureRef FeatureId="2"/>
                    <BrandFeatureRef FeatureId="7"/>
                    <BrandFeatureRef FeatureId="14"/>
                    <BrandFeatureRef FeatureId="13"/>
                    <BrandFeatureRef FeatureId="12"/>
                    <BrandFeatureRef FeatureId="16"/>
                    <BrandFeatureRef FeatureId="15"/>
                    <BrandFeatureRef FeatureId="1"/>
                    <BrandFeatureRef FeatureId="20"/>
                    <BrandFeatureRef FeatureId="21"/>
                    <BrandFeatureRef FeatureId="19"/>
                    <BrandFeatureRef FeatureId="18"/>
                    <BrandFeatureRef FeatureId="17"/>
                    <BrandFeatureRef FeatureId="22"/>
                    <BrandFeatureRef FeatureId="23"/>
                    <BrandFeatureRef FeatureId="25"/>
                    <BrandFeatureRef FeatureId="26"/>
                    <BrandFeatureRef FeatureId="24"/>
                    <BrandFeatureRef FeatureId="27"/>
                    <BrandFeatureRef FeatureId="28"/>
                  </FareComponent>
                  <FareComponent BrandID="NB" BrandName="ECONOMY LITE" ProgramCode="CFF1S" ProgramDescription="1S" ProgramID="85965" ProgramSystemCode="X">
                    <Segment FlightIndex="1" LegIndex="2"/>
                    <Segment FlightIndex="2" LegIndex="2"/>
                    <BrandFeatureRef FeatureId="3"/>
                    <BrandFeatureRef FeatureId="8"/>
                    <BrandFeatureRef FeatureId="9"/>
                    <BrandFeatureRef FeatureId="10"/>
                    <BrandFeatureRef FeatureId="6"/>
                    <BrandFeatureRef FeatureId="4"/>
                    <BrandFeatureRef FeatureId="5"/>
                    <BrandFeatureRef FeatureId="11"/>
                    <BrandFeatureRef FeatureId="2"/>
                    <BrandFeatureRef FeatureId="7"/>
                    <BrandFeatureRef FeatureId="14"/>
                    <BrandFeatureRef FeatureId="13"/>
                    <BrandFeatureRef FeatureId="12"/>
                    <BrandFeatureRef FeatureId="16"/>
                    <BrandFeatureRef FeatureId="15"/>
                    <BrandFeatureRef FeatureId="1"/>
                    <BrandFeatureRef FeatureId="20"/>
                    <BrandFeatureRef FeatureId="21"/>
                    <BrandFeatureRef FeatureId="19"/>
                    <BrandFeatureRef FeatureId="18"/>
                    <BrandFeatureRef FeatureId="17"/>
                    <BrandFeatureRef FeatureId="22"/>
                    <BrandFeatureRef FeatureId="23"/>
                    <BrandFeatureRef FeatureId="25"/>
                    <BrandFeatureRef FeatureId="26"/>
                    <BrandFeatureRef FeatureId="24"/>
                    <BrandFeatureRef FeatureId="27"/>
                    <BrandFeatureRef FeatureId="28"/>
                  </FareComponent>
                </FareComponents>
                <Messages>
                  <Message AirlineCode="SU" FailCode="0" Info="NONREF/HEBO3BPATEH" Type="N"/>
                  <Message FailCode="0" Info="EACH CNN REQUIRES ACCOMPANYING SAME CABIN ADT" Type="W"/>
                  <Message FailCode="0" Info="VALIDATING CARRIER" Type="W"/>
                  <Message FailCode="0" Info="BSP - SU" Type="W"/>
                  <Message FailCode="0" Info="RUT - SU" Type="W"/>
                </Messages>
                <BaggageInformationList>
                  <BaggageInformation AirlineCode="SU" ProvisionType="A">
                    <Segment Id="0"/>
                    <Segment Id="1"/>
                    <Allowance Pieces="0"/>
                  </BaggageInformation>
                  <BaggageInformation AirlineCode="SU" ProvisionType="A">
                    <Segment Id="2"/>
                    <Segment Id="3"/>
                    <Allowance Pieces="0"/>
                  </BaggageInformation>
                </BaggageInformationList>
              </TPA_Extensions>
            </PassengerFare>
            <Endorsements NonRefundableIndicator="true"/>
            <TPA_Extensions>
              <FareCalcLine Info="LED SU X/MOW SU AER3375SU X/MOW SU LED5138RUB8513END"/>
            </TPA_Extensions>
            <FareInfos>
              <FareInfo>
                <FareReference>N</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="S"/>
                </TPA_Extensions>
              </FareInfo>
              <FareInfo>
                <FareReference>N</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="S"/>
                </TPA_Extensions>
              </FareInfo>
              <FareInfo>
                <FareReference>T</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="S"/>
                </TPA_Extensions>
              </FareInfo>
              <FareInfo>
                <FareReference>T</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="S"/>
                </TPA_Extensions>
              </FareInfo>
            </FareInfos>
          </PTC_FareBreakdown>
          <PTC_FareBreakdown>
            <PassengerTypeQuantity Code="INF" Quantity="1"/>
            <FareBasisCodes>
              <FareBasisCode ArrivalAirportCode="SVO" BookingCode="N" DepartureAirportCode="LED" FareComponentBeginAirport="LED" FareComponentDirectionality="FROM" FareComponentEndAirport="AER" FareComponentFareRule="ENR1" FareComponentFareTariff="304" FareComponentFareType="SB" FareComponentFareTypeBitmap="01" FareComponentVendorCode="ATP" GovCarrier="SU">NNBR/IN00</FareBasisCode>
              <FareBasisCode ArrivalAirportCode="AER" AvailabilityBreak="true" BookingCode="N" DepartureAirportCode="SVO" GovCarrier="SU">NNBR/IN00</FareBasisCode>
              <FareBasisCode ArrivalAirportCode="SVO" BookingCode="T" DepartureAirportCode="AER" FareComponentBeginAirport="AER" FareComponentDirectionality="TO" FareComponentEndAirport="LED" FareComponentFareRule="ENR1" FareComponentFareTariff="304" FareComponentFareType="SB" FareComponentFareTypeBitmap="01" FareComponentVendorCode="ATP" GovCarrier="SU">TNBR/IN00</FareBasisCode>
              <FareBasisCode ArrivalAirportCode="LED" AvailabilityBreak="true" BookingCode="T" DepartureAirportCode="SVO" GovCarrier="SU">TNBR/IN00</FareBasisCode>
            </FareBasisCodes>
            <PassengerFare>
              <BaseFare Amount="0" CurrencyCode="RUB"/>
              <FareConstruction Amount="0" CurrencyCode="RUB" DecimalPlaces="0"/>
              <EquivFare Amount="0" CurrencyCode="RUB" DecimalPlaces="0"/>
              <TotalFare Amount="0" CurrencyCode="RUB"/>
              <PenaltiesInfo>
                <Penalty Amount="2600" Applicability="Before" Changeable="true" ConditionsApply="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                <Penalty Amount="2600" Applicability="After" Changeable="true" ConditionsApply="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                <Penalty Applicability="Before" Refundable="false" Type="Refund"/>
                <Penalty Applicability="After" Refundable="false" Type="Refund"/>
              </PenaltiesInfo>
              <TPA_Extensions>
                <FareComponents>
                  <FareComponent BrandID="NB" BrandName="ECONOMY LITE" ProgramCode="CFF1S" ProgramDescription="1S" ProgramID="85965" ProgramSystemCode="X">
                    <Segment FlightIndex="1" LegIndex="1"/>
                    <Segment FlightIndex="2" LegIndex="1"/>
                    <BrandFeatureRef FeatureId="3"/>
                    <BrandFeatureRef FeatureId="8"/>
                    <BrandFeatureRef FeatureId="9"/>
                    <BrandFeatureRef FeatureId="10"/>
                    <BrandFeatureRef FeatureId="6"/>
                    <BrandFeatureRef FeatureId="4"/>
                    <BrandFeatureRef FeatureId="5"/>
                    <BrandFeatureRef FeatureId="11"/>
                    <BrandFeatureRef FeatureId="2"/>
                    <BrandFeatureRef FeatureId="7"/>
                    <BrandFeatureRef FeatureId="14"/>
                    <BrandFeatureRef FeatureId="13"/>
                    <BrandFeatureRef FeatureId="12"/>
                    <BrandFeatureRef FeatureId="16"/>
                    <BrandFeatureRef FeatureId="15"/>
                    <BrandFeatureRef FeatureId="1"/>
                    <BrandFeatureRef FeatureId="20"/>
                    <BrandFeatureRef FeatureId="21"/>
                    <BrandFeatureRef FeatureId="19"/>
                    <BrandFeatureRef FeatureId="18"/>
                    <BrandFeatureRef FeatureId="17"/>
                    <BrandFeatureRef FeatureId="22"/>
                    <BrandFeatureRef FeatureId="23"/>
                    <BrandFeatureRef FeatureId="25"/>
                    <BrandFeatureRef FeatureId="26"/>
                    <BrandFeatureRef FeatureId="24"/>
                    <BrandFeatureRef FeatureId="27"/>
                    <BrandFeatureRef FeatureId="28"/>
                  </FareComponent>
                  <FareComponent BrandID="NB" BrandName="ECONOMY LITE" ProgramCode="CFF1S" ProgramDescription="1S" ProgramID="85965" ProgramSystemCode="X">
                    <Segment FlightIndex="1" LegIndex="2"/>
                    <Segment FlightIndex="2" LegIndex="2"/>
                    <BrandFeatureRef FeatureId="3"/>
                    <BrandFeatureRef FeatureId="8"/>
                    <BrandFeatureRef FeatureId="9"/>
                    <BrandFeatureRef FeatureId="10"/>
                    <BrandFeatureRef FeatureId="6"/>
                    <BrandFeatureRef FeatureId="4"/>
                    <BrandFeatureRef FeatureId="5"/>
                    <BrandFeatureRef FeatureId="11"/>
                    <BrandFeatureRef FeatureId="2"/>
                    <BrandFeatureRef FeatureId="7"/>
                    <BrandFeatureRef FeatureId="14"/>
                    <BrandFeatureRef FeatureId="13"/>
                    <BrandFeatureRef FeatureId="12"/>
                    <BrandFeatureRef FeatureId="16"/>
                    <BrandFeatureRef FeatureId="15"/>
                    <BrandFeatureRef FeatureId="1"/>
                    <BrandFeatureRef FeatureId="20"/>
                    <BrandFeatureRef FeatureId="21"/>
                    <BrandFeatureRef FeatureId="19"/>
                    <BrandFeatureRef FeatureId="18"/>
                    <BrandFeatureRef FeatureId="17"/>
                    <BrandFeatureRef FeatureId="22"/>
                    <BrandFeatureRef FeatureId="23"/>
                    <BrandFeatureRef FeatureId="25"/>
                    <BrandFeatureRef FeatureId="26"/>
                    <BrandFeatureRef FeatureId="24"/>
                    <BrandFeatureRef FeatureId="27"/>
                    <BrandFeatureRef FeatureId="28"/>
                  </FareComponent>
                </FareComponents>
                <Messages>
                  <Message AirlineCode="SU" FailCode="0" Info="NONREF/HEBO3BPATEH" Type="N"/>
                  <Message FailCode="0" Info="EACH INF REQUIRES ACCOMPANYING ADT PASSENGER" Type="W"/>
                  <Message FailCode="0" Info="VALIDATING CARRIER" Type="W"/>
                  <Message FailCode="0" Info="BSP - SU" Type="W"/>
                  <Message FailCode="0" Info="RUT - SU" Type="W"/>
                </Messages>
                <BaggageInformationList>
                  <BaggageInformation AirlineCode="SU" ProvisionType="A">
                    <Segment Id="0"/>
                    <Segment Id="1"/>
                    <Allowance Pieces="0"/>
                  </BaggageInformation>
                  <BaggageInformation AirlineCode="SU" ProvisionType="A">
                    <Segment Id="2"/>
                    <Segment Id="3"/>
                    <Allowance Pieces="0"/>
                  </BaggageInformation>
                </BaggageInformationList>
              </TPA_Extensions>
            </PassengerFare>
            <Endorsements NonRefundableIndicator="true"/>
            <TPA_Extensions>
              <FareCalcLine Info="LED SU X/MOW SU AER0SU X/MOW SU LED0RUB0END"/>
            </TPA_Extensions>
            <FareInfos>
              <FareInfo>
                <FareReference>N</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="S"/>
                </TPA_Extensions>
              </FareInfo>
              <FareInfo>
                <FareReference>N</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="S"/>
                </TPA_Extensions>
              </FareInfo>
              <FareInfo>
                <FareReference>T</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="S"/>
                </TPA_Extensions>
              </FareInfo>
              <FareInfo>
                <FareReference>T</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="S"/>
                </TPA_Extensions>
              </FareInfo>
            </FareInfos>
          </PTC_FareBreakdown>
        </PTC_FareBreakdowns>
        <FareInfos>
          <FareInfo>
            <FareReference>N</FareReference>
            <TPA_Extensions>
              <SeatsRemaining BelowMin="false" Number="9"/>
              <Cabin Cabin="Y"/>
              <Meal Code="S"/>
            </TPA_Extensions>
          </FareInfo>
          <FareInfo>
            <FareReference>N</FareReference>
            <TPA_Extensions>
              <SeatsRemaining BelowMin="false" Number="9"/>
              <Cabin Cabin="Y"/>
              <Meal Code="S"/>
            </TPA_Extensions>
          </FareInfo>
          <FareInfo>
            <FareReference>T</FareReference>
            <TPA_Extensions>
              <SeatsRemaining BelowMin="false" Number="9"/>
              <Cabin Cabin="Y"/>
              <Meal Code="S"/>
            </TPA_Extensions>
          </FareInfo>
          <FareInfo>
            <FareReference>T</FareReference>
            <TPA_Extensions>
              <SeatsRemaining BelowMin="false" Number="9"/>
              <Cabin Cabin="Y"/>
              <Meal Code="S"/>
            </TPA_Extensions>
          </FareInfo>
        </FareInfos>
        <TPA_Extensions>
          <DivideInParty Indicator="false"/>
          <ValidatingCarrier NewVcxProcess="true" SettlementMethod="BSP">
            <Default Code="SU"/>
          </ValidatingCarrier>
          <ValidatingCarrier NewVcxProcess="true" SettlementMethod="RUT">
            <Default Code="SU"/>
          </ValidatingCarrier>
        </TPA_Extensions>
      </AirItineraryPricingInfo>
      <TicketingInfo TicketType="eTicket" ValidInterline="Yes"/>
      <TPA_Extensions>
        <ValidatingCarrier Code="SU"/>
      </TPA_Extensions>
    </PricedItinerary>
  </PricedItineraries>
  <TPA_Extensions>
    <AirlineOrderList>
      <AirlineOrder Code="SU" SequenceNumber="1"/>
    </AirlineOrderList>
  </TPA_Extensions>
</OTA_AirLowFareSearchRS>
{% endxmlsec %}

---

{% xmlsec "Пример запроса (GIR ответ)", false %}
<OTA_AirLowFareSearchRQ ResponseType="GIR" Version="6.1.0" xmlns="http://www.opentravel.org/OTA/2003/05">
  <POS>
    <Source PseudoCityCode="9LSC">
      <RequestorID ID="1" Type="1">
        <CompanyName Code="TN"/>
      </RequestorID>
    </Source>
  </POS>
  <OriginDestinationInformation RPH="1">
    <DepartureDateTime>2020-09-01T05:00:00</DepartureDateTime>
    <OriginLocation LocationCode="LED"/>
    <DestinationLocation LocationCode="AER"/>
    <TPA_Extensions>
      <Flight ArrivalDateTime="2020-09-01T06:25:00" ClassOfService="Y" DepartureDateTime="2020-09-01T05:00:00" Number="35" Type="A">
        <OriginLocation LocationCode="LED"/>
        <DestinationLocation LocationCode="SVO"/>
        <Airline Marketing="SU" Operating="SU"/>
      </Flight>
      <Flight ArrivalDateTime="2020-09-01T10:15:00" ClassOfService="Y" DepartureDateTime="2020-09-01T07:45:00" Number="1138" Type="A">
        <OriginLocation LocationCode="SVO"/>
        <DestinationLocation LocationCode="AER"/>
        <Airline Marketing="SU" Operating="SU"/>
      </Flight>
    </TPA_Extensions>
  </OriginDestinationInformation>
  <OriginDestinationInformation RPH="2">
    <DepartureDateTime>2020-09-08T06:50:00</DepartureDateTime>
    <OriginLocation LocationCode="AER"/>
    <DestinationLocation LocationCode="LED"/>
    <TPA_Extensions>
      <Flight ArrivalDateTime="2020-09-08T09:20:00" ClassOfService="Y" DepartureDateTime="2020-09-08T06:50:00" Number="1141" Type="A">
        <OriginLocation LocationCode="AER"/>
        <DestinationLocation LocationCode="SVO"/>
        <Airline Marketing="SU" Operating="SU"/>
      </Flight>
      <Flight ArrivalDateTime="2020-09-08T12:20:00" ClassOfService="Y" DepartureDateTime="2020-09-08T10:55:00" Number="14" Type="A">
        <OriginLocation LocationCode="SVO"/>
        <DestinationLocation LocationCode="LED"/>
        <Airline Marketing="SU" Operating="SU"/>
      </Flight>
    </TPA_Extensions>
  </OriginDestinationInformation>
  <TravelPreferences>
    <TPA_Extensions>
      <VerificationItinCallLogic Value="L"/>
    </TPA_Extensions>
    <Baggage Description="true" RequestType="A"/>
  </TravelPreferences>
  <TravelerInfoSummary>
    <SeatsRequested>3</SeatsRequested>
    <AirTravelerAvail>
      <PassengerTypeQuantity Code="ADT" Quantity="2">
        <TPA_Extensions>
          <VoluntaryChanges Match="Info"/>
        </TPA_Extensions>
      </PassengerTypeQuantity>
      <PassengerTypeQuantity Code="CNN" Quantity="1">
        <TPA_Extensions>
          <VoluntaryChanges Match="Info"/>
        </TPA_Extensions>
      </PassengerTypeQuantity>
      <PassengerTypeQuantity Code="INF" Quantity="1">
        <TPA_Extensions>
          <VoluntaryChanges Match="Info"/>
        </TPA_Extensions>
      </PassengerTypeQuantity>
    </AirTravelerAvail>
    <PriceRequestInformation>
      <TPA_Extensions>
        <BrandedFareIndicators ReturnBrandAncillaries="true" SingleBrandedFare="true"/>
      </TPA_Extensions>
    </PriceRequestInformation>
  </TravelerInfoSummary>
</OTA_AirLowFareSearchRQ>
{% endxmlsec %}

{% xmlsec "Пример ответа", false %}
<GroupedItineraryResponse Version="6.1.0" xmlns="http://webservices.sabre.com/wsdl/sabreXML1.0.00/shopping/GroupedItineraryResponse" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <Message Code="TRANSACTIONID" Severity="Info" Text="7547747613635778625" Type="WORKERTHREAD"/>
  <Message Code="ASEPT2LAPP00316.IDM.SGDCPROD.SABRE.COM" Severity="Info" Text="27031" Type="SERVER"/>
  <Message Code="RULEID" Severity="Info" Text="24113" Type="DRE"/>
  <Message Code="RULEID" Severity="Info" Text="24111" Type="DEFAULT"/>
  <Statistics Itineraries="1"/>
  <ScheduleDesc ETicketable="true" ElapsedTime="85" Frequency="SMTWTFS" ID="1" Stops="0" TotalMilesFlown="372">
    <Departure Airport="SVO" City="MOW" Country="RU" Terminal="B" Time="10:40:00+03:00"/>
    <Arrival Airport="LED" City="LED" Country="RU" Terminal="1" Time="12:05:00+03:00"/>
    <Carrier Marketing="SU" MarketingFlightNumber="14" Operating="SU" OperatingFlightNumber="14">
      <Equipment Code="320" TypeForFirstLeg="N" TypeForLastLeg="N"/>
    </Carrier>
  </ScheduleDesc>
  <ScheduleDesc ETicketable="true" ElapsedTime="155" Frequency="S*TWTFS" ID="2" Stops="0" TotalMilesFlown="873">
    <Departure Airport="SVO" City="MOW" Country="RU" Terminal="B" Time="07:40:00+03:00"/>
    <Arrival Airport="AER" City="AER" Country="RU" Time="10:15:00+03:00"/>
    <Carrier Marketing="SU" MarketingFlightNumber="1138" Operating="SU" OperatingFlightNumber="1138">
      <Equipment Code="73H" TypeForFirstLeg="N" TypeForLastLeg="N"/>
    </Carrier>
  </ScheduleDesc>
  <ScheduleDesc ETicketable="true" ElapsedTime="85" Frequency="SMTWTFS" ID="3" Stops="0" TotalMilesFlown="372">
    <Departure Airport="LED" City="LED" Country="RU" Terminal="1" Time="05:00:00+03:00"/>
    <Arrival Airport="SVO" City="MOW" Country="RU" Terminal="B" Time="06:25:00+03:00"/>
    <Carrier Marketing="SU" MarketingFlightNumber="35" Operating="SU" OperatingFlightNumber="35">
      <Equipment Code="320" TypeForFirstLeg="N" TypeForLastLeg="N"/>
    </Carrier>
  </ScheduleDesc>
  <ScheduleDesc ETicketable="true" ElapsedTime="145" Frequency="SMTWTFS" ID="4" Stops="0" TotalMilesFlown="873">
    <Departure Airport="AER" City="AER" Country="RU" Time="06:20:00+03:00"/>
    <Arrival Airport="SVO" City="MOW" Country="RU" Terminal="B" Time="08:45:00+03:00"/>
    <Carrier Marketing="SU" MarketingFlightNumber="1141" Operating="SU" OperatingFlightNumber="1141">
      <Equipment Code="32A" TypeForFirstLeg="N" TypeForLastLeg="N"/>
    </Carrier>
  </ScheduleDesc>
  <TaxDesc Amount="270" Code="YRF" Currency="RUB" Description="SERVICE FEE - CARRIER-IMPOSED FUEL" ID="1" PublishedAmount="270" PublishedCurrency="RUB" Station="AER"/>
  <TaxDesc Amount="270" Code="YRF" Currency="RUB" Description="SERVICE FEE - CARRIER-IMPOSED FUEL" ID="2" PublishedAmount="270" PublishedCurrency="RUB" Station="LED"/>
  <TaxDesc Amount="1500" Code="YQF" Currency="RUB" Description="SERVICE FEE - CARRIER-IMPOSED FUEL" ID="3" PublishedAmount="1500" PublishedCurrency="RUB" Station="SVO"/>
  <TaxDesc Amount="120" Code="RI4" Country="RU" Currency="RUB" Description="TERMINAL USE CHARGE DOMESTIC ARRIVAL" ID="4" PublishedAmount="120" PublishedCurrency="RUB" Station="SVO"/>
  <TaxDesc Amount="79" Code="RI4" Country="RU" Currency="RUB" Description="TERMINAL USE CHARGE DOMESTIC ARRIVAL" ID="5" PublishedAmount="79" PublishedCurrency="RUB" Station="SVO"/>
  <TaxDesc Amount="60" Code="RI3" Country="RU" Currency="RUB" Description="TERMINAL USE CHARGE DOMESTIC DEPARTURE" ID="6" PublishedAmount="60" PublishedCurrency="RUB" Station="AER"/>
  <TaxDesc Amount="1500" Code="YQF" Currency="RUB" Description="SERVICE FEE - CARRIER-IMPOSED FUEL" ID="7" PublishedAmount="1500" PublishedCurrency="RUB" Station="LED"/>
  <TaxDesc Amount="92" Code="RI4" Country="RU" Currency="RUB" Description="TERMINAL USE CHARGE DOMESTIC ARRIVAL" ID="8" PublishedAmount="92" PublishedCurrency="RUB" Station="AER"/>
  <TaxDesc Amount="270" Code="YRF" Currency="RUB" Description="SERVICE FEE - CARRIER-IMPOSED FUEL" ID="9" PublishedAmount="270" PublishedCurrency="RUB" Station="SVO"/>
  <TaxDesc Amount="184" Code="RI4" Country="RU" Currency="RUB" Description="TERMINAL USE CHARGE DOMESTIC ARRIVAL" ID="10" PublishedAmount="184" PublishedCurrency="RUB" Station="AER"/>
  <TaxDesc Amount="158" Code="RI3" Country="RU" Currency="RUB" Description="TERMINAL USE CHARGE DOMESTIC DEPARTURE" ID="11" PublishedAmount="158" PublishedCurrency="RUB" Station="LED"/>
  <TaxDesc Amount="158" Code="RI4" Country="RU" Currency="RUB" Description="TERMINAL USE CHARGE DOMESTIC ARRIVAL" ID="12" PublishedAmount="158" PublishedCurrency="RUB" Station="SVO"/>
  <TaxDesc Amount="184" Code="RI4" Country="RU" Currency="RUB" Description="TERMINAL USE CHARGE DOMESTIC ARRIVAL" ID="13" PublishedAmount="184" PublishedCurrency="RUB" Station="LED"/>
  <TaxDesc Amount="60" Code="RI4" Country="RU" Currency="RUB" Description="TERMINAL USE CHARGE DOMESTIC ARRIVAL" ID="14" PublishedAmount="60" PublishedCurrency="RUB" Station="SVO"/>
  <TaxDesc Amount="92" Code="RI4" Country="RU" Currency="RUB" Description="TERMINAL USE CHARGE DOMESTIC ARRIVAL" ID="15" PublishedAmount="92" PublishedCurrency="RUB" Station="LED"/>
  <TaxDesc Amount="1500" Code="YQF" Currency="RUB" Description="SERVICE FEE - CARRIER-IMPOSED FUEL" ID="16" PublishedAmount="1500" PublishedCurrency="RUB" Station="AER"/>
  <TaxDesc Amount="120" Code="RI3" Country="RU" Currency="RUB" Description="TERMINAL USE CHARGE DOMESTIC DEPARTURE" ID="17" PublishedAmount="120" PublishedCurrency="RUB" Station="AER"/>
  <TaxDesc Amount="79" Code="RI3" Country="RU" Currency="RUB" Description="TERMINAL USE CHARGE DOMESTIC DEPARTURE" ID="18" PublishedAmount="79" PublishedCurrency="RUB" Station="LED"/>
  <TaxDesc Amount="92" Code="RI3" Country="RU" Currency="RUB" Description="TERMINAL USE CHARGE DOMESTIC DEPARTURE" ID="19" PublishedAmount="92" PublishedCurrency="RUB" Station="SVO"/>
  <TaxDesc Amount="184" Code="RI3" Country="RU" Currency="RUB" Description="TERMINAL USE CHARGE DOMESTIC DEPARTURE" ID="20" PublishedAmount="184" PublishedCurrency="RUB" Station="SVO"/>
  <TaxSummaryDesc Amount="1080" Code="YRF" Currency="RUB" Description="SERVICE FEE - CARRIER-IMPOSED FUEL" ID="1" PublishedAmount="270" PublishedCurrency="RUB" Station="LED"/>
  <TaxSummaryDesc Amount="646" Code="RI3" Country="RU" Currency="RUB" Description="TERMINAL USE CHARGE DOMESTIC DEPARTURE" ID="2" PublishedAmount="79" PublishedCurrency="RUB" Station="LED"/>
  <TaxSummaryDesc Amount="6000" Code="YQF" Currency="RUB" Description="SERVICE FEE - CARRIER-IMPOSED FUEL" ID="3" PublishedAmount="1500" PublishedCurrency="RUB" Station="LED"/>
  <TaxSummaryDesc Amount="1292" Code="RI3" Country="RU" Currency="RUB" Description="TERMINAL USE CHARGE DOMESTIC DEPARTURE" ID="4" PublishedAmount="158" PublishedCurrency="RUB" Station="LED"/>
  <BrandFeatureDesc Application="C" CommercialName="SECOND EXCESS BAG" ID="1" ServiceGroup="BG" ServiceType="C" SubCode="0CD" Vendor="ATP"/>
  <BrandFeatureDesc Application="C" CommercialName="UPGRADE AT CHECKIN TO COMFORT" ID="2" ServiceGroup="BF" ServiceType="Z" SubCode="UT2" Vendor="ATP"/>
  <BrandFeatureDesc Application="N" CommercialName="LOUNGE ACCESS" ID="3" ServiceGroup="LG" ServiceType="F" SubCode="0BX" Vendor="ATP"/>
  <BrandFeatureDesc Application="N" CommercialName="REFUND BEFORE CHECKIN CLOSURE" ID="4" ServiceGroup="BF" ServiceType="Z" SubCode="RBC" Vendor="ATP"/>
  <BrandFeatureDesc Application="N" CommercialName="CHANGE IN CASE OF NO SHOW" ID="5" ServiceGroup="BF" ServiceType="Z" SubCode="CNS" Vendor="ATP"/>
  <BrandFeatureDesc Application="N" CommercialName="150 TO 200 PCNT MILES EARNED" ID="6" ServiceGroup="BF" ServiceType="Z" SubCode="ME3" Vendor="ATP"/>
  <BrandFeatureDesc Application="N" CommercialName="PRIORITY BAGGAGE" ID="7" ServiceGroup="TS" ServiceType="F" SubCode="0LF" Vendor="ATP"/>
  <BrandFeatureDesc Application="N" CommercialName="OPEN RETURN DATE" ID="8" ServiceGroup="BF" ServiceType="Z" SubCode="ORD" Vendor="ATP"/>
  <BrandFeatureDesc Application="N" CommercialName="200 TO 250 PCNT MILES EARNED" ID="9" ServiceGroup="BF" ServiceType="Z" SubCode="ME4" Vendor="ATP"/>
  <BrandFeatureDesc Application="N" CommercialName="25 PERCENT MILES EARNED" ID="10" ServiceGroup="BF" ServiceType="Z" SubCode="06A" Vendor="ATP"/>
  <BrandFeatureDesc Application="N" CommercialName="REFUND AFTER CHECKIN CLOSURE" ID="11" ServiceGroup="BF" ServiceType="Z" SubCode="RBA" Vendor="ATP"/>
  <BrandFeatureDesc Application="C" CommercialName="UPTO50LB 23KG AND62LI 158LCM" ID="12" ServiceGroup="BG" ServiceType="C" SubCode="0GO" Vendor="ATP"/>
  <BrandFeatureDesc Application="C" CommercialName="BASIC SEAT" ID="13" ServiceGroup="BF" ServiceType="Z" SubCode="050" Vendor="ATP"/>
  <BrandFeatureDesc Application="C" CommercialName="UPGRADE AT CHECKIN TO BUSINESS" ID="14" ServiceGroup="UP" ServiceType="F" SubCode="UPF" Vendor="ATP"/>
  <BrandFeatureDesc Application="F" CommercialName="CARRY10KG 22LBUPTO 55X40X25CM" ID="15" ServiceGroup="BG" ServiceType="C" SubCode="0MJ" Vendor="ATP"/>
  <BrandFeatureDesc Application="C" CommercialName="CHANGEABLE TICKET" ID="16" ServiceGroup="BF" ServiceType="Z" SubCode="059" Vendor="ATP"/>
  <BrandFeatureDesc Application="N" CommercialName="125 MILES EARNED" ID="17" ServiceGroup="BF" ServiceType="Z" SubCode="06Y" Vendor="ATP"/>
  <BrandFeatureDesc Application="N" CommercialName="UPTO70LB 32KG AND62LI 158LCM" ID="18" ServiceGroup="BG" ServiceType="C" SubCode="0FM" Vendor="ATP"/>
  <BrandFeatureDesc Application="N" CommercialName="100 TO 150 PCNT MILES EARNED" ID="19" ServiceGroup="BF" ServiceType="Z" SubCode="ME2" Vendor="ATP"/>
  <BrandFeatureDesc Application="N" CommercialName="200 PERCENT MILES EARNED" ID="20" ServiceGroup="BF" ServiceType="Z" SubCode="06N" Vendor="ATP"/>
  <BrandFeatureDesc Application="N" CommercialName="STOPOVER" ID="21" ServiceGroup="BF" ServiceType="Z" SubCode="STO" Vendor="ATP"/>
  <BrandFeatureDesc Application="N" CommercialName="PRIORITY CHECK IN" ID="22" ServiceGroup="TS" ServiceType="F" SubCode="03P" Vendor="ATP"/>
  <BrandFeatureDesc Application="N" CommercialName="150 PERCENT MILES EARNED" ID="23" ServiceGroup="BF" ServiceType="Z" SubCode="06M" Vendor="ATP"/>
  <BrandFeatureDesc Application="C" CommercialName="INTERNET ACCESS" ID="24" ServiceGroup="IE" ServiceType="F" SubCode="0CL" Vendor="ATP"/>
  <BrandFeatureDesc Application="F" CommercialName="75 TO 125 PCNT MILES EARNED" ID="25" ServiceGroup="BF" ServiceType="Z" SubCode="ME1" Vendor="ATP"/>
  <BrandFeatureDesc Application="N" CommercialName="CARRY15KG 33LBUPTO 55X40X25CM" ID="26" ServiceGroup="BG" ServiceType="C" SubCode="0MK" Vendor="ATP"/>
  <BrandFeatureDesc Application="N" CommercialName="PRIORITY BOARDING" ID="27" ServiceGroup="TS" ServiceType="F" SubCode="0G6" Vendor="ATP"/>
  <BrandFeatureDesc Application="N" CommercialName="UPGRADE WITH MILES BONUS" ID="28" ServiceGroup="UP" ServiceType="F" SubCode="0NI" Vendor="ATP"/>
  <FareComponentDesc ApplicablePricingCategories="10 16 19" Direction="EH" Directionality="FROM" FareAmount="3375" FareBasisCode="NNBR/CH25" FareCurrency="RUB" FarePassengerType="CNN" FareRule="ENR1" FareTariff="304" FareType="SB" FareTypeBitmap="01" GoverningCarrier="SU" ID="1" NotValidAfter="2020-09-01" NotValidBefore="2020-09-01" PublishedFareAmount="6750" TicketDesignator="CH25" VendorCode="ATP">
    <Segment/>
    <Segment Stopover="true"/>
    <Brand BrandName="ECONOMY LITE" Code="NB" ProgramCode="CFF1S" ProgramDescription="1S" ProgramID="85965" ProgramSystemCode="X"/>
  </FareComponentDesc>
  <FareComponentDesc ApplicablePricingCategories="10 16" Direction="EH" Directionality="FROM" FareAmount="4500" FareBasisCode="NNBR" FareCurrency="RUB" FarePassengerType="ADT" FareRule="ENR1" FareTariff="304" FareType="SB" FareTypeBitmap="00" GoverningCarrier="SU" ID="2" NotValidAfter="2020-09-01" NotValidBefore="2020-09-01" PublishedFareAmount="9000" VendorCode="ATP">
    <Segment/>
    <Segment Stopover="true"/>
    <Brand BrandName="ECONOMY LITE" Code="NB" ProgramCode="CFF1S" ProgramDescription="1S" ProgramID="85965" ProgramSystemCode="X"/>
  </FareComponentDesc>
  <FareComponentDesc ApplicablePricingCategories="10 16" Direction="EH" Directionality="TO" FareAmount="6850" FareBasisCode="TNBR" FareCurrency="RUB" FarePassengerType="ADT" FareRule="ENR1" FareTariff="304" FareType="SB" FareTypeBitmap="00" GoverningCarrier="SU" ID="3" NotValidAfter="2020-09-08" NotValidBefore="2020-09-08" PublishedFareAmount="13700" VendorCode="ATP">
    <Segment/>
    <Segment/>
    <Brand BrandName="ECONOMY LITE" Code="NB" ProgramCode="CFF1S" ProgramDescription="1S" ProgramID="85965" ProgramSystemCode="X"/>
  </FareComponentDesc>
  <FareComponentDesc ApplicablePricingCategories="10 16 19" Direction="EH" Directionality="FROM" FareBasisCode="NNBR/IN00" FarePassengerType="INF" FareRule="ENR1" FareTariff="304" FareType="SB" FareTypeBitmap="01" GoverningCarrier="SU" ID="4" NotValidAfter="2020-09-01" NotValidBefore="2020-09-01" PublishedFareAmount="0" TicketDesignator="IN00" VendorCode="ATP">
    <Segment/>
    <Segment Stopover="true"/>
    <Brand BrandName="ECONOMY LITE" Code="NB" ProgramCode="CFF1S" ProgramDescription="1S" ProgramID="85965" ProgramSystemCode="X"/>
  </FareComponentDesc>
  <FareComponentDesc ApplicablePricingCategories="10 16 19" Direction="EH" Directionality="TO" FareAmount="5138" FareBasisCode="TNBR/CH25" FareCurrency="RUB" FarePassengerType="CNN" FareRule="ENR1" FareTariff="304" FareType="SB" FareTypeBitmap="01" GoverningCarrier="SU" ID="5" NotValidAfter="2020-09-08" NotValidBefore="2020-09-08" PublishedFareAmount="10275" TicketDesignator="CH25" VendorCode="ATP">
    <Segment/>
    <Segment/>
    <Brand BrandName="ECONOMY LITE" Code="NB" ProgramCode="CFF1S" ProgramDescription="1S" ProgramID="85965" ProgramSystemCode="X"/>
  </FareComponentDesc>
  <FareComponentDesc ApplicablePricingCategories="10 16 19" Direction="EH" Directionality="TO" FareBasisCode="TNBR/IN00" FarePassengerType="INF" FareRule="ENR1" FareTariff="304" FareType="SB" FareTypeBitmap="01" GoverningCarrier="SU" ID="6" NotValidAfter="2020-09-08" NotValidBefore="2020-09-08" PublishedFareAmount="0" TicketDesignator="IN00" VendorCode="ATP">
    <Segment/>
    <Segment/>
    <Brand BrandName="ECONOMY LITE" Code="NB" ProgramCode="CFF1S" ProgramDescription="1S" ProgramID="85965" ProgramSystemCode="X"/>
  </FareComponentDesc>
  <ValidatingCarrierDesc ID="1" NewVcxProcess="true" SettlementMethod="RUT">
    <Default Code="SU"/>
  </ValidatingCarrierDesc>
  <ValidatingCarrierDesc ID="2" NewVcxProcess="true" SettlementMethod="BSP">
    <Default Code="SU"/>
  </ValidatingCarrierDesc>
  <BaggageAllowanceDesc ID="1" Pieces="0"/>
  <LegDesc ElapsedTime="345" ID="1">
    <Schedule Ref="4"/>
    <Schedule Ref="1"/>
  </LegDesc>
  <LegDesc ElapsedTime="315" ID="2">
    <Schedule Ref="3"/>
    <Schedule Ref="2"/>
  </LegDesc>
  <ItineraryGroup>
    <GroupDescription>
      <LegDescription ArrivalLocation="AER" DepartureDate="2020-09-01" DepartureLocation="LED"/>
      <LegDescription ArrivalLocation="LED" DepartureDate="2020-09-08" DepartureLocation="AER"/>
    </GroupDescription>
    <Itinerary CurrentItinerary="true" ID="1" PricingSource="WPNI1_ITIN">
      <Leg Ref="2"/>
      <Leg Ref="1"/>
      <PricingInformation BrandsOnAnyMarket="true" PricingSubsource="MIP">
        <Fare ETicketable="true" GoverningCarriers="SU SU" LastTicketDate="2020-05-31" LastTicketTime="23:59" VITA="true" ValidatingCarrierCode="SU">
          <PassengerInfo NonRefundable="true" PassengerNumber="2" PassengerType="ADT">
            <FareComponent Ref="2">
              <Segment BookingCode="N" CabinCode="Y" MealCode="S" SeatsAvailable="9"/>
              <Segment AvailabilityBreak="true" BookingCode="N" CabinCode="Y" MealCode="S" SeatsAvailable="9"/>
              <BrandFeature Ref="10"/>
              <BrandFeature Ref="25"/>
              <BrandFeature Ref="19"/>
              <BrandFeature Ref="6"/>
              <BrandFeature Ref="17"/>
              <BrandFeature Ref="23"/>
              <BrandFeature Ref="20"/>
              <BrandFeature Ref="9"/>
              <BrandFeature Ref="16"/>
              <BrandFeature Ref="5"/>
              <BrandFeature Ref="4"/>
              <BrandFeature Ref="11"/>
              <BrandFeature Ref="8"/>
              <BrandFeature Ref="2"/>
              <BrandFeature Ref="21"/>
              <BrandFeature Ref="13"/>
              <BrandFeature Ref="15"/>
              <BrandFeature Ref="26"/>
              <BrandFeature Ref="12"/>
              <BrandFeature Ref="18"/>
              <BrandFeature Ref="1"/>
              <BrandFeature Ref="24"/>
              <BrandFeature Ref="3"/>
              <BrandFeature Ref="27"/>
              <BrandFeature Ref="7"/>
              <BrandFeature Ref="22"/>
              <BrandFeature Ref="28"/>
              <BrandFeature Ref="14"/>
            </FareComponent>
            <FareComponent Ref="3">
              <Segment BookingCode="T" CabinCode="Y" MealCode="S" SeatsAvailable="9"/>
              <Segment AvailabilityBreak="true" BookingCode="T" CabinCode="Y" MealCode="S" SeatsAvailable="9"/>
              <BrandFeature Ref="10"/>
              <BrandFeature Ref="25"/>
              <BrandFeature Ref="19"/>
              <BrandFeature Ref="6"/>
              <BrandFeature Ref="17"/>
              <BrandFeature Ref="23"/>
              <BrandFeature Ref="20"/>
              <BrandFeature Ref="9"/>
              <BrandFeature Ref="16"/>
              <BrandFeature Ref="5"/>
              <BrandFeature Ref="4"/>
              <BrandFeature Ref="11"/>
              <BrandFeature Ref="8"/>
              <BrandFeature Ref="2"/>
              <BrandFeature Ref="21"/>
              <BrandFeature Ref="13"/>
              <BrandFeature Ref="15"/>
              <BrandFeature Ref="26"/>
              <BrandFeature Ref="12"/>
              <BrandFeature Ref="18"/>
              <BrandFeature Ref="1"/>
              <BrandFeature Ref="24"/>
              <BrandFeature Ref="3"/>
              <BrandFeature Ref="27"/>
              <BrandFeature Ref="7"/>
              <BrandFeature Ref="22"/>
              <BrandFeature Ref="28"/>
              <BrandFeature Ref="14"/>
            </FareComponent>
            <Tax Ref="7"/>
            <Tax Ref="3"/>
            <Tax Ref="16"/>
            <Tax Ref="3"/>
            <Tax Ref="2"/>
            <Tax Ref="9"/>
            <Tax Ref="1"/>
            <Tax Ref="9"/>
            <Tax Ref="11"/>
            <Tax Ref="20"/>
            <Tax Ref="17"/>
            <Tax Ref="20"/>
            <Tax Ref="12"/>
            <Tax Ref="10"/>
            <Tax Ref="4"/>
            <Tax Ref="13"/>
            <TaxSummary Ref="3"/>
            <TaxSummary Ref="1"/>
            <TaxSummary Ref="4"/>
            <CurrencyConversion ExchangeRateUsed="1" From="RUB" To="RUB"/>
            <FareMessage Carrier="SU" Code="0" Info="NONREF/HEBO3BPATEH" Type="N"/>
            <FareMessage Code="0" Info="VALIDATING CARRIER" Type="W"/>
            <FareMessage Code="0" Info="BSP - SU" Type="W"/>
            <FareMessage Code="0" Info="RUT - SU" Type="W"/>
            <PassengerTotalFare BaseFareAmount="11350" BaseFareCurrency="RUB" CommissionAmount="0" CommissionPercentage="0" ConstructionAmount="11350" ConstructionCurrency="RUB" Currency="RUB" EquivalentAmount="11350" EquivalentCurrency="RUB" ExchangeRateOne="76.8000000" TotalFare="19722" TotalTaxes="8372"/>
            <BaggageInformation AirlineCode="SU" ProvisionType="A">
              <Segment ID="0"/>
              <Segment ID="1"/>
              <Allowance Ref="1"/>
            </BaggageInformation>
            <BaggageInformation AirlineCode="SU" ProvisionType="A">
              <Segment ID="2"/>
              <Segment ID="3"/>
              <Allowance Ref="1"/>
            </BaggageInformation>
            <PenaltiesInfo>
              <Penalty Amount="2600" Applicability="Before" Changeable="true" ConditionsApply="true" Currency="RUB" Type="Exchange"/>
              <Penalty Amount="2600" Applicability="After" Changeable="true" ConditionsApply="true" Currency="RUB" Type="Exchange"/>
              <Penalty Applicability="Before" Refundable="false" Type="Refund"/>
              <Penalty Applicability="After" Refundable="false" Type="Refund"/>
            </PenaltiesInfo>
          </PassengerInfo>
          <PassengerInfo NonRefundable="true" PassengerNumber="1" PassengerType="CNN">
            <FareComponent Ref="1">
              <Segment BookingCode="N" CabinCode="Y" MealCode="S" SeatsAvailable="9"/>
              <Segment AvailabilityBreak="true" BookingCode="N" CabinCode="Y" MealCode="S" SeatsAvailable="9"/>
              <BrandFeature Ref="10"/>
              <BrandFeature Ref="25"/>
              <BrandFeature Ref="19"/>
              <BrandFeature Ref="6"/>
              <BrandFeature Ref="17"/>
              <BrandFeature Ref="23"/>
              <BrandFeature Ref="20"/>
              <BrandFeature Ref="9"/>
              <BrandFeature Ref="16"/>
              <BrandFeature Ref="5"/>
              <BrandFeature Ref="4"/>
              <BrandFeature Ref="11"/>
              <BrandFeature Ref="8"/>
              <BrandFeature Ref="2"/>
              <BrandFeature Ref="21"/>
              <BrandFeature Ref="13"/>
              <BrandFeature Ref="15"/>
              <BrandFeature Ref="26"/>
              <BrandFeature Ref="12"/>
              <BrandFeature Ref="18"/>
              <BrandFeature Ref="1"/>
              <BrandFeature Ref="24"/>
              <BrandFeature Ref="3"/>
              <BrandFeature Ref="27"/>
              <BrandFeature Ref="7"/>
              <BrandFeature Ref="22"/>
              <BrandFeature Ref="28"/>
              <BrandFeature Ref="14"/>
            </FareComponent>
            <FareComponent Ref="5">
              <Segment BookingCode="T" CabinCode="Y" MealCode="S" SeatsAvailable="9"/>
              <Segment AvailabilityBreak="true" BookingCode="T" CabinCode="Y" MealCode="S" SeatsAvailable="9"/>
              <BrandFeature Ref="10"/>
              <BrandFeature Ref="25"/>
              <BrandFeature Ref="19"/>
              <BrandFeature Ref="6"/>
              <BrandFeature Ref="17"/>
              <BrandFeature Ref="23"/>
              <BrandFeature Ref="20"/>
              <BrandFeature Ref="9"/>
              <BrandFeature Ref="16"/>
              <BrandFeature Ref="5"/>
              <BrandFeature Ref="4"/>
              <BrandFeature Ref="11"/>
              <BrandFeature Ref="8"/>
              <BrandFeature Ref="2"/>
              <BrandFeature Ref="21"/>
              <BrandFeature Ref="13"/>
              <BrandFeature Ref="15"/>
              <BrandFeature Ref="26"/>
              <BrandFeature Ref="12"/>
              <BrandFeature Ref="18"/>
              <BrandFeature Ref="1"/>
              <BrandFeature Ref="24"/>
              <BrandFeature Ref="3"/>
              <BrandFeature Ref="27"/>
              <BrandFeature Ref="7"/>
              <BrandFeature Ref="22"/>
              <BrandFeature Ref="28"/>
              <BrandFeature Ref="14"/>
            </FareComponent>
            <Tax Ref="7"/>
            <Tax Ref="3"/>
            <Tax Ref="16"/>
            <Tax Ref="3"/>
            <Tax Ref="2"/>
            <Tax Ref="9"/>
            <Tax Ref="1"/>
            <Tax Ref="9"/>
            <Tax Ref="18"/>
            <Tax Ref="19"/>
            <Tax Ref="6"/>
            <Tax Ref="19"/>
            <Tax Ref="5"/>
            <Tax Ref="8"/>
            <Tax Ref="14"/>
            <Tax Ref="15"/>
            <TaxSummary Ref="3"/>
            <TaxSummary Ref="1"/>
            <TaxSummary Ref="2"/>
            <CurrencyConversion ExchangeRateUsed="1" From="RUB" To="RUB"/>
            <FareMessage Carrier="SU" Code="0" Info="NONREF/HEBO3BPATEH" Type="N"/>
            <FareMessage Code="0" Info="EACH CNN REQUIRES ACCOMPANYING SAME CABIN ADT" Type="W"/>
            <FareMessage Code="0" Info="VALIDATING CARRIER" Type="W"/>
            <FareMessage Code="0" Info="BSP - SU" Type="W"/>
            <FareMessage Code="0" Info="RUT - SU" Type="W"/>
            <PassengerTotalFare BaseFareAmount="8515" BaseFareCurrency="RUB" CommissionAmount="0" CommissionPercentage="0" ConstructionAmount="8513" ConstructionCurrency="RUB" Currency="RUB" EquivalentAmount="8515" EquivalentCurrency="RUB" ExchangeRateOne="76.8000000" TotalFare="16241" TotalTaxes="7726"/>
            <BaggageInformation AirlineCode="SU" ProvisionType="A">
              <Segment ID="0"/>
              <Segment ID="1"/>
              <Allowance Ref="1"/>
            </BaggageInformation>
            <BaggageInformation AirlineCode="SU" ProvisionType="A">
              <Segment ID="2"/>
              <Segment ID="3"/>
              <Allowance Ref="1"/>
            </BaggageInformation>
            <PenaltiesInfo>
              <Penalty Amount="2600" Applicability="Before" Changeable="true" ConditionsApply="true" Currency="RUB" Type="Exchange"/>
              <Penalty Amount="2600" Applicability="After" Changeable="true" ConditionsApply="true" Currency="RUB" Type="Exchange"/>
              <Penalty Applicability="Before" Refundable="false" Type="Refund"/>
              <Penalty Applicability="After" Refundable="false" Type="Refund"/>
            </PenaltiesInfo>
          </PassengerInfo>
          <PassengerInfo NonRefundable="true" PassengerNumber="1" PassengerType="INF">
            <FareComponent Ref="4">
              <Segment BookingCode="N" CabinCode="Y" MealCode="S" SeatsAvailable="9"/>
              <Segment AvailabilityBreak="true" BookingCode="N" CabinCode="Y" MealCode="S" SeatsAvailable="9"/>
              <BrandFeature Ref="10"/>
              <BrandFeature Ref="25"/>
              <BrandFeature Ref="19"/>
              <BrandFeature Ref="6"/>
              <BrandFeature Ref="17"/>
              <BrandFeature Ref="23"/>
              <BrandFeature Ref="20"/>
              <BrandFeature Ref="9"/>
              <BrandFeature Ref="16"/>
              <BrandFeature Ref="5"/>
              <BrandFeature Ref="4"/>
              <BrandFeature Ref="11"/>
              <BrandFeature Ref="8"/>
              <BrandFeature Ref="2"/>
              <BrandFeature Ref="21"/>
              <BrandFeature Ref="13"/>
              <BrandFeature Ref="15"/>
              <BrandFeature Ref="26"/>
              <BrandFeature Ref="12"/>
              <BrandFeature Ref="18"/>
              <BrandFeature Ref="1"/>
              <BrandFeature Ref="24"/>
              <BrandFeature Ref="3"/>
              <BrandFeature Ref="27"/>
              <BrandFeature Ref="7"/>
              <BrandFeature Ref="22"/>
              <BrandFeature Ref="28"/>
              <BrandFeature Ref="14"/>
            </FareComponent>
            <FareComponent Ref="6">
              <Segment BookingCode="T" CabinCode="Y" MealCode="S" SeatsAvailable="9"/>
              <Segment AvailabilityBreak="true" BookingCode="T" CabinCode="Y" MealCode="S" SeatsAvailable="9"/>
              <BrandFeature Ref="10"/>
              <BrandFeature Ref="25"/>
              <BrandFeature Ref="19"/>
              <BrandFeature Ref="6"/>
              <BrandFeature Ref="17"/>
              <BrandFeature Ref="23"/>
              <BrandFeature Ref="20"/>
              <BrandFeature Ref="9"/>
              <BrandFeature Ref="16"/>
              <BrandFeature Ref="5"/>
              <BrandFeature Ref="4"/>
              <BrandFeature Ref="11"/>
              <BrandFeature Ref="8"/>
              <BrandFeature Ref="2"/>
              <BrandFeature Ref="21"/>
              <BrandFeature Ref="13"/>
              <BrandFeature Ref="15"/>
              <BrandFeature Ref="26"/>
              <BrandFeature Ref="12"/>
              <BrandFeature Ref="18"/>
              <BrandFeature Ref="1"/>
              <BrandFeature Ref="24"/>
              <BrandFeature Ref="3"/>
              <BrandFeature Ref="27"/>
              <BrandFeature Ref="7"/>
              <BrandFeature Ref="22"/>
              <BrandFeature Ref="28"/>
              <BrandFeature Ref="14"/>
            </FareComponent>
            <CurrencyConversion ExchangeRateUsed="1" From="RUB" To="RUB"/>
            <FareMessage Carrier="SU" Code="0" Info="NONREF/HEBO3BPATEH" Type="N"/>
            <FareMessage Code="0" Info="EACH INF REQUIRES ACCOMPANYING ADT PASSENGER" Type="W"/>
            <FareMessage Code="0" Info="VALIDATING CARRIER" Type="W"/>
            <FareMessage Code="0" Info="BSP - SU" Type="W"/>
            <FareMessage Code="0" Info="RUT - SU" Type="W"/>
            <PassengerTotalFare BaseFareAmount="0" BaseFareCurrency="RUB" CommissionAmount="0" CommissionPercentage="0" ConstructionAmount="0" ConstructionCurrency="RUB" Currency="RUB" EquivalentAmount="0" EquivalentCurrency="RUB" ExchangeRateOne="76.8000000" TotalFare="0" TotalTaxes="0"/>
            <BaggageInformation AirlineCode="SU" ProvisionType="A">
              <Segment ID="0"/>
              <Segment ID="1"/>
              <Allowance Ref="1"/>
            </BaggageInformation>
            <BaggageInformation AirlineCode="SU" ProvisionType="A">
              <Segment ID="2"/>
              <Segment ID="3"/>
              <Allowance Ref="1"/>
            </BaggageInformation>
            <PenaltiesInfo>
              <Penalty Amount="2600" Applicability="Before" Changeable="true" ConditionsApply="true" Currency="RUB" Type="Exchange"/>
              <Penalty Amount="2600" Applicability="After" Changeable="true" ConditionsApply="true" Currency="RUB" Type="Exchange"/>
              <Penalty Applicability="Before" Refundable="false" Type="Refund"/>
              <Penalty Applicability="After" Refundable="false" Type="Refund"/>
            </PenaltiesInfo>
          </PassengerInfo>
          <TotalFare BaseFareAmount="31215" BaseFareCurrency="RUB" ConstructionAmount="31213" ConstructionCurrency="RUB" Currency="RUB" EquivalentAmount="31215" EquivalentCurrency="RUB" TotalPrice="55685" TotalTaxes="24470"/>
          <ValidatingCarrier Ref="2"/>
          <ValidatingCarrier Ref="1"/>
        </Fare>
      </PricingInformation>
    </Itinerary>
  </ItineraryGroup>
</GroupedItineraryResponse>
{% endxmlsec %}
