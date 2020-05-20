# Поиск перелетов по заданным датам

-----

**Оглавление:**
<!-- toc -->

-----

## Введение

Для поиска перелетов по заданным датам используется сервис Bargain Finder Max ([BargainFinderMaxRQ](https://developer.sabre.com/docs/soap_apis/air/search/bargain_finder_max)). Дополнительную информацию по работе с сервисом можно получить в [онлайн-справке](http://webservices.sabre.com/drc/providerdoc/shopping/BargainFinderMax_Help/BargainFinderMax_Help.htm).

Ниже указаны некоторые обязательные и опциональные элементы запроса к сервису.

## Маршрут и даты

#### Обязательные элементы

Маршрут в поисковом запросе задается в последовательно расположенных элементах ```/OTA_AirLowFareSearchRQ/OriginDestinationInformation```, соответствующих плечам маршрута. Плечо может содержать один или несколько сегментов (рейсов). Для каждого плеча маршрута необходимо указать:

- ```OriginDestinationInformation/@RPH``` — номер запрашиваемого плеча
- ```OriginDestinationInformation/DepartureDateTime``` — дата и время вылета. Время вылета является обязательным для заполнения, рекомендуется во всех случаях указывать время ```11:00```
- ```OriginDestinationInformation/OriginLocation/@LocationCode``` — код города или аэропорта вылета
- ```OriginDestinationInformation/DestinationLocation/@LocationCode``` — код города или аэропорта прилета

{% xmlsec "Поиск перелетов по маршруту Москва-Сочи-Москва", true %}
<OriginDestinationInformation RPH="1">
  <DepartureDateTime>2020-09-01T11:00:00</DepartureDateTime>
  <OriginLocation LocationCode="MOW"/>
  <DestinationLocation LocationCode="AER"/>
</OriginDestinationInformation>
<OriginDestinationInformation RPH="2">
  <DepartureDateTime>2020-09-08T11:00:00</DepartureDateTime>
  <OriginLocation LocationCode="AER"/>
  <DestinationLocation LocationCode="MOW"/>
</OriginDestinationInformation>
{% endxmlsec %}

#### Тип пунктов вылета и прилета

Для каждого пункта вылета и прилета на маршруте можно установить его тип:
- значение ```A``` — аэропорт
- значение ```C``` — город (вариант по умолчанию, если не указано никакое значение, а город и аэропорт имеют одинаковый код)

Для этого необходимо указать одно из вышеперечисленных значений в ```/OTA_AirLowFareSearchRQ/OriginDestinationInformation/OriginLocation/@LocationType``` (пункт вылета) или ```/OTA_AirLowFareSearchRQ/OriginDestinationInformation/DestinationLocation/@LocationType``` (пункт прилета). Данная опция может быть актуальна в случае совпадения кодов у города и аэропорта.

#### Альтернативные аэропорты

Для поиска перелетов с альтернативными аэропортами в Bargain Finder Max можно или указать альтернативные коды аэропортов и городов в запросе или указать радиус для автоматического выбора альтернативных аэропортов:
- ```/OTA_AirLowFareSearchRQ/OriginDestinationInformation/TPA_Extensions/SisterDestinationLocation/@LocationCode``` — альтернативные коды городов или аэропортов вылета (не более 4)
- ```/OTA_AirLowFareSearchRQ/OriginDestinationInformation/TPA_Extensions/SisterOriginLocation/@LocationCode``` — альтернативные коды городов или аэропортов прилета (не более 4)
- ```/OTA_AirLowFareSearchRQ/OriginDestinationInformation/TPA_Extensions/SisterDestinationMileage/@Number``` — максимальное расстояние в милях для автоматического поиска альтернативных аэропортов вылета (не более ```100```)
- ```/OTA_AirLowFareSearchRQ/OriginDestinationInformation/TPA_Extensions/SisterOriginMileage/@Number``` — максимальное расстояние в милях для поиска альтернативных аэропортов прилета (не более ```100```)

Если указать значение ```true``` у атрибутов ```/SisterDestinationMileage/@AllowBorderCross``` или ```/SisterOriginMileage/@AllowBorderCross```, то альтернативные аэропорт будут найдены только в той же стране, что и указанный в запросе аэропорт или город.

{% xmlsec "Поиск перелетов с альтернативными аэропортами", true %}
<OriginDestinationInformation RPH="1">
  <DepartureDateTime>2020-09-01T11:00:00</DepartureDateTime>
  <OriginLocation LocationCode="BER"/>
  <DestinationLocation LocationCode="PAR"/>
  <TPA_Extensions>
    <SisterDestinationLocation LocationCode="NCE"/>
    <SisterDestinationLocation LocationCode="BRU"/>
    <SisterOriginLocation LocationCode="FRA"/>
    <SisterOriginLocation LocationCode="MUC"/>
  </TPA_Extensions>
</OriginDestinationInformation>
{% endxmlsec %}

{% xmlsec "Поиск перелетов с альтернативными аэропортами", true %}
<OriginDestinationInformation RPH="1">
  <DepartureDateTime>2020-09-01T11:00:00</DepartureDateTime>
  <OriginLocation LocationCode="BER"/>
  <DestinationLocation LocationCode="PAR"/>
  <TPA_Extensions>
    <SisterDestinationMileage Number="100"/>
    <SisterOriginMileage Number="100"/>
  </TPA_Extensions>
</OriginDestinationInformation>
{% endxmlsec %}

#### Время в пути и время вылета

В запросе можно установить требуемый промежуток времени вылета или прилета:
- ```OriginDestinationInformation/DepartureWindow``` — промежуток допустимого времени вылета (например, ```10002000``` для вылета в промежуток с 10:00 до 20:00)
- ```OriginDestinationInformation/ArrivalWindow``` — промежуток допустимого времени прилета

Время в пути для каждого плеча, включая время пересадок:
- ```OriginDestinationInformation/TPA_Extensions/TotalTravelTime/@Min``` — минимальное время
- ```OriginDestinationInformation/TPA_Extensions/TotalTravelTime/@Max``` — максимальное время

Альтернативное время вылета:
- ```OriginDestinationInformation/TPA_Extensions/AlternateTime/@PlusMinus``` — количество часов, на которое может отличаться время вылета у найденных рейсов относительно заданного для каждого плеча (не более ```9```)
- ```OriginDestinationInformation/TPA_Extensions/AlternateTime/@Minus``` — количество часов, на которое может быть меньше время вылета у найденных рейсов относительно заданного для каждого плеча (не более ```72```)

#### Поиск с известными рейсами

Для поиска вариантов перелетов, в котором рейсы для одного или нескольких плеч уже известны, необходимо для каждого такого плеча указать:
- ```/OTA_AirLowFareSearchRQ/OriginDestinationInformation/@Fixed``` — признак того, что для этого плеча будет применен указанный рейс, значение ```true```
- ```/OTA_AirLowFareSearchRQ/OriginDestinationInformation/TPA_Extensions/Flight``` — данные о рейсе:
    - ```Flight/@ArrivalDateTime``` — дата и время прибытия рейса
    - ```Flight/@DepartureDateTime``` — дата и время отправления рейса
    - ```Flight/@Number``` — номер рейса
    - ```Flight/@Type``` — всегда ```A```
    - ```Flight/OriginLocation/@LocationCode``` — аэропорт прибытия
    - ```Flight/DestinationLocation/@LocationCode``` — аэропорт отправления
    - ```Flight/Airline/@Marketing``` — код маркетингового перевозчика
    - ```Flight/Airline/@Operating``` — код оперирующего перевозчика

{% xmlsec "Поиск перелетов с известными рейсами на втором плече", true %}
<OriginDestinationInformation RPH="1">
  <DepartureDateTime>2020-09-01T11:00:00</DepartureDateTime>
  <OriginLocation LocationCode="LED"/>
  <DestinationLocation LocationCode="AER"/>
</OriginDestinationInformation>
<OriginDestinationInformation RPH="2">
  <DepartureDateTime>2020-09-08T06:50:00</DepartureDateTime>
  <OriginLocation LocationCode="AER"/>
  <DestinationLocation LocationCode="LED"/>
    <TPA_Extensions>
      <Flight ArrivalDateTime="2020-09-08T09:20:00" DepartureDateTime="2020-09-08T06:50:00" Number="1141" Type="A">
        <OriginLocation LocationCode="AER"/>
        <DestinationLocation LocationCode="SVO"/>
        <Airline Marketing="SU" Operating="SU"/>
      </Flight>
      <Flight ArrivalDateTime="2020-09-08T12:20:00" DepartureDateTime="2020-09-08T10:55:00" Number="14" Type="A">
        <OriginLocation LocationCode="SVO"/>
        <DestinationLocation LocationCode="LED"/>
        <Airline Marketing="SU" Operating="SU"/>
      </Flight>
    </TPA_Extensions>
</OriginDestinationInformation>
{% endxmlsec %}

## Остановки и пересадки

Максимальное количество остановок (как со сменой рейса так и без нее) для всех плеч маршрута задается в атрибуте ```/OTA_AirLowFareSearchRQ/TravelPreferences/@MaxStopsQuantity```.

Для каждого плеча в элементе ```/OTA_AirLowFareSearchRQ/OriginDestinationInformation/TPA_Extensions/ConnectionTime``` можно задать следующие атрибуты:
- ```/@Min``` — минимальное время любой пересадки на данном плече
- ```/@Max``` — максимальное время любой пересадки на данном плече
- ```/@ExcludedConnectionBegin``` — начало временного промежутка, во время которого не могут происходить пересадки в формате ```HHMM```
- ```/@ExcludedConnectionEnd``` — конец временного промежутка, во время которого не могут происходить пересадки в формате ```HHMM```

Также для каждого плеча можно указать список предпочтительных мест для пересадок и остановок в последовательно расположенных элементах ```/OTA_AirLowFareSearchRQ/OriginDestinationInformation/ConnectionLocations/ConnectionLocation``` с атрибутом:
- ```/@LocationCode``` — код города или аэропорта

Страны, на территории которых не могут производиться пересадки или остановки, могут быть указаны в последовательно расположенных элементах ```/OTA_AirLowFareSearchRQ/TravelPreferences/TPA_Extensions/CountryPref``` со следующими атрибутами:
- ```/@Code``` — код страны
- ```/@PreferLevel``` — значение ```Unacceptable```

По умолчанию в поисковой выдаче будут представлены только те варианты перелетов, у которых каждая пересадка не больше:
- 5 часов (300 минут) — для внутренних перелетов
- 13 часов (780 минут) — для международных перелетов

Для того чтобы получить варианты перелетов с более продолжительными пересадками в запросе к сервису необходимо указать значение ```true``` у атрибута ```/OTA_AirLowFareSearchRQ/TravelPreferences/TPA_Extensions/LongConnectTime/@Enable```.

В этом случае система выполнит два запроса для поиска расписаний (комбинаций рейсов) и объединит полученные результаты в ответе:

| Тип запроса | Обычный поиск | Поиск с длинными пересадками (Long Connect) |
|---|---|---|
| Минимальная продолжительность пересадки | Минимальная продолжительность пересадки, установленная в каждом аэропорту (Minimum Connect Time) | 5 часов для внутренних перелетов, 13 часов для международных перелетов |
| Максимальная продолжительность пересадки | 5 часов для внутренних перелетов, 13 часов для международных перелетов | 24 часа |

Для поиска с длинными пересадками можно дополнительно установить:
- ```/OTA_AirLowFareSearchRQ/TravelPreferences/TPA_Extensions/LongConnectPoints/@Min``` — минимальное количество пересадок
- ```/OTA_AirLowFareSearchRQ/TravelPreferences/TPA_Extensions/LongConnectPoints/@Max``` — максимальное количество пересадок

{% xmlsec "Рекомендуемые параметры для поиска перелетов с длинными пересадками", true %}
<LongConnectTime Enable="true"/>
<LongConnectPoints Max="3" Min="1"/>
{% endxmlsec %}

Для каждого плеча в запросе можно указать необходимость совершения пересадки длиной более 24 часов (stopover) в определенном месте. Для этого в запросе необходимо указать:
- ```/OTA_AirLowFareSearchRQ/OriginDestinationInformation/TPA_Extensions/Stopover/StopoverPoint/@LocationCode``` — код города или аэропорта для пересадки длиной более 24 часов
- ```/OTA_AirLowFareSearchRQ/OriginDestinationInformation/TPA_Extensions/Stopover/DepartureDateTime``` — дата вылета из пункта пересадки длиной более 24 часов в пункт назначения

*Обратите внимание на то, что для каждого плеча можно указать только один пункт пересадки длиной более 24 часов!*

Дополнительно можно указать:
- ```/OTA_AirLowFareSearchRQ/OriginDestinationInformation/TPA_Extensions/Stopover/DepartureWindow``` — промежуток допустимого времени вылета из пункта пересадки длиной более 24 часов (например, ```10002000``` для вылета в промежуток с 10:00 до 20:00)
- ```/OTA_AirLowFareSearchRQ/OriginDestinationInformation/TPA_Extensions/Stopover/StopoverPoint/@LocationType``` — тип пункта пересадки длиной более 24 часов (актуально в случае совпадения кодов у города и аэропорта):
    - значение ```A``` — аэропорт
    - значение ```C``` — город (вариант по умолчанию, если не указано никакое значение, а город и аэропорт имеют одинаковый код)

{% xmlsec "Поиск перелета из Москвы в Нью-Йорк с пересадкой длиной более 24 часов в Стамбуле и временем вылета в промежутке между 10:00 и 22:00", true %}
<OriginDestinationInformation RPH="1">
  <DepartureDateTime>2020-09-01T11:00:00</DepartureDateTime>
  <OriginLocation LocationCode="MOW"/>
  <DestinationLocation LocationCode="NYC"/>
  <TPA_Extensions>
    <Stopover>
      <DepartureDateTime>2020-09-03T00:00:00</DepartureDateTime>
      <DepartureWindow>10002200</DepartureWindow>
      <StopoverPoint LocationCode="IST" LocationType="C"/>
    </Stopover>
  </TPA_Extensions>
</OriginDestinationInformation>
{% endxmlsec %}

## Пассажиры

Количество мест должно быть задано в элементе ```/OTA_AirLowFareSearchRQ/TravelerInfoSummary/SeatsRequested```.

*Обратите внимание на то, что количество пассажиров может отличаться от количества мест в том случае, если производится поиск перелетов для младенцев без места*

Категории пассажиров задаются в последовательно расположенных элементах ```/OTA_AirLowFareSearchRQ/TravelerInfoSummary/AirTravelerAvail/PassengerTypeQuantity```. Для каждой категории пассажира необходимо указать:
- ```PassengerTypeQuantity/@Code``` — код категории пассажира
- ```PassengerTypeQuantity/@Quantity``` — количество пассажиров данной категории

Коды основных категорий пассажиров:
- ```ADT``` — взрослый пассажир (от 12 лет)
- ```CNN``` — ребенок (от 2 до 12 лет)
- ```INF``` — младенец без места (до 2 лет)
- ```INS``` — младенец с местом (до 2 лет)

*Обратите внимание на то, что в некоторых случаях возраст ребенка может влиять стоимость перелета. В этих случаях рекомендуется указывать возраст ребенка в коде категории пассажира. Например, ```C05``` для пятилетнего ребенка.*

## Классы обслуживания и коды тарифов

Класс обслуживания задается в элементе ```/OTA_AirLowFareSearchRQ/TravelPreferences/CabinPref```. В качестве атрибутов необходимо указать:
- ```CabinPref/@PreferLevel``` — выбран предпочтительный класс обслуживания (значение ```Preferred```)
- ```CabinPref/@Cabin``` — код или название класса обслуживания

Допустимые варианты кодов и названий классов обслуживания:
- ```Economy``` или ```Y``` — экономический класс
- ```PremiumEconomy``` или ```S``` — улучшенный экономический класс
- ```Business``` или ```C``` — бизнес класс
- ```PremiumBusiness``` или ```J``` — улучшенный бизнес класс
- ```First``` или ```F``` — первый класс
- ```PremiumFirst``` или ```P``` — улучшенный первый класс

По умолчанию, если в запросе не указан класс обслуживания, поиск будет производиться так, будто указан экономический класс обслуживания. 

Класс обслуживания также может быть задан для каждого плеча в запросе в элементе ```/OTA_AirLowFareSearchRQ/OriginDestinationInformation/TPA_Extensions/CabinPref```. В качестве атрибутов необходимо указать:
- ```CabinPref/@PreferLevel``` — выбран предпочтительный класс обслуживания (значение ```Preferred```)
- ```CabinPref/@Cabin``` — код или название класса обслуживания

Существует три различных логики выбора класса обслуживания в результатах поиска.

#### Гибкая логика выбора класса обслуживания включена

Эта логика будет использована по умолчанию, если не установлены иные правила (см. ниже).

В случае использования этой логики выбора класса обслуживания, в результатах поиска будут присутствовать варианты перелетов, содержащие рейсы в заданном классе обслуживания или классе обслуживания выше (в зависимости от стоимости и наличия мест) или рейсы в классе обслуживания ниже (если перелет в заданном классе обслуживания невозможен).

#### Гибкая логика выбора класса обслуживания отключена

Для активации этой логики необходимо указать значение ```true``` у атрибута ```/OTA_AirLowFareSearchRQ/TravelPreferences/TPA_Extensions/JumpCabinLogic/@Disabled```.

В случае использования этой логики выбора класса обслуживания, в результатах поиска будут присутствовать варианты перелетов, в которых как минимум один из рейсов будет в заданном классе обслуживания. Остальные рейсы будут или в заданном классе обслуживания или в классе обслуживания ниже (если заданный класс обслуживания недоступен).

#### Включен поиск только в запрашиваемом классе обслуживания

Для активации этой логики необходимо указать значение ```true``` у атрибута ```/OTA_AirLowFareSearchRQ/TravelPreferences/TPA_Extensions/KeepSameCabin/@Enabled```.

В случае использования этой логики выбора класса обслуживания, в результатах поиска будут присутствовать варианты перелетов, в которых все рейсы будут в заданном классе обслуживания.

#### Черный и белый список классов бронирования

Черный и белый список классов бронирования (*не классов обслуживания!*) для всего запрошенного маршрута задается в последовательно расположенных элементах ```/OTA_AirLowFareSearchRQ/TravelPreferences/TPA_Extensions/ClassOfService```. Для каждого класса бронирования необходимо указать:
- ```ClassOfService/@Code``` — класс бронирования
- ```ClassOfService/@PreferLevel``` — добавление класса бронирования в белый (значение ```Preferred```) или черный (значение ```Unacceptable```) список

Черный и белый список классов бронирования для каждого плеча задается в последовательно расположенных элементах ```/OTA_AirLowFareSearchRQ/OriginDestinationInformation/TPA_Extensions/ClassOfService```. Для каждого класса бронирования необходимо указать:
- ```ClassOfService/@Code``` — класс бронирования
- ```ClassOfService/@PreferLevel``` — добавление класса бронирования в белый (значение ```Preferred```) или черный (значение ```Unacceptable```) список

#### Черный и белый список кодов тарифов

Черный и белый список кодов тарифов (*не классов обслуживания!*) для всего запрошенного маршрута задается в последовательно расположенных элементах ```/OTA_AirLowFareSearchRQ/TravelPreferences/TPA_Extensions/FareBasis```. Для каждого кода тарифа необходимо указать:
- ```FareBasis/@Code``` — код тарифа
- ```FareBasis/@PreferLevel``` — добавление кода тарифа в белый (значение ```Preferred```) или черный (значение ```Unacceptable```) список

Черный и белый список классов бронирования для каждого плеча задается в последовательно расположенных элементах ```/OTA_AirLowFareSearchRQ/OriginDestinationInformation/TPA_Extensions/FareBasis```. Для каждого класса бронирования необходимо указать:
- ```FareBasis/@Code``` — код тарифа
- ```FareBasis/@PreferLevel``` — добавление кода тарифа в белый (значение ```Preferred```) или черный (значение ```Unacceptable```) список

Также сервис позволяет указать вместо кода тарифа маску поиска кода тарифа, в котором помимо букв латинского алфавита и цифр можно использовать следующие спецсимволы:
- ```-``` — ноль или более символов. Например, под условия маски ```Y-OW``` подпадут тарифы ```YOW```, ```YLTOW``` и ```YSTDOW```
- ```?``` — один символ. Например, под условия маски ```Y??OW``` подпадут тарифы ```YPROW``` и ```YECOW```
- ```^X``` — один символ кроме ```X``` (вместо ```X``` может быть указана любая буква латинского алфавита или цифра). Например, под условия маски ```^YLTOW``` подпадут тарифы ```NLTOW```, ```ELTOW```, но не подпадет ```YLTOW```

## Перевозчики

#### Черный и белый список маркетинговых и оперирующих перевозчиков для всего запрошенного маршрута

Черный и белый список маркетинговых и оперирующих перевозчиков для всего запрошенного маршрута задается в последовательно расположенных элементах ```/OTA_AirLowFareSearchRQ/TravelPreferences/VendorPref```. Для каждого перевозчика необходимо указать:
- ```VendorPref/@Code``` — двухбуквенный код перевозчика
- ```VendorPref/@PreferLevel``` — добавление перевозчика в белый (значение ```Preferred```) или черный (значение ```Unacceptable```) список
- ```VendorPref/@Type``` — тип перевозчика:
    - значение ```Operating``` — оперирующий перевозчик
    - значение ```Marketing``` — маркетинговый перевозчик (вариант по умолчанию в случае отсутствия любого значения)

Дополнительно в запросе можно указать применимость белого списка перевозчиков: ко всем сегментам каждого найденного перелета или хотя бы к одному сегменту каждого найденного перелета. Для этого необходимо добавить элемент ```/OTA_AirLowFareSearchRQ/TravelPreferences/VendorPrefApplicability``` со следующими атрибутами:
- ```VendorPrefApplicability/@Value``` — вариант применимости:
    - значение ```AllSegments``` — для всех сегментов
    - значение ```AtLeastOneSegment``` — хотя бы для одного сегмента
- ```VendorPrefApplicability/@Type``` — тип перевозчика:
    - значение ```Operating``` — оперирующий перевозчик
    - значение ```Marketing``` — маркетинговый перевозчик

Максимум можно добавить два элемента: один для белого списка оперирующих перевозчиков и один для белого списка маркетинговых перевозчиков.

Помимо этого, в последовательно расположенных элементах ```/OTA_AirLowFareSearchRQ/TravelPreferences/VendorPrefPairing``` можно указать комбинации маркетинговых и оперирующих перевозчиков для черного или белого списков. Для каждого элемента необходимо указать:
- ```VendorPrefPairing/@Applicability``` — вариант применимости:
    - значение ```AllSegments``` — для всех сегментов
    - значение ```AtLeastOneSegment``` — хотя бы для одного сегмента
- ```VendorPrefPairing/@PreferLevel``` — добавление перевозчиков в белый (значение ```Preferred```) или черный (значение ```Unacceptable```) список
- ```VendorPrefPairing/VendorPref``` — элемент с информацией о включении перевозчика в белый или черный список. Для каждого перевозчика необходимо указать:
    - ```VendorPref/@Code``` — двухбуквенный код перевозчика
    - ```VendorPref/@Type``` — тип перевозчика:
        - значение ```Operating``` — оперирующий перевозчик
        - значение ```Marketing``` — маркетинговый перевозчик (вариант по умолчанию в случае отсутствия любого значения)

{% xmlsec "В результатах поиска во всех вариантов перелетов во всех сегментов перевозчик XX будет маркетинговым, а XX, YY или ZZ — оперирующими", true %}
<VendorPrefPairing Applicability="AllSegments" PreferLevel="Preferred">
  <VendorPref Code="XX" Type="Marketing"/>
  <VendorPref Code="XX" Type="Operating"/>
  <VendorPref Code="YY" Type="Operating"/>
  <VendorPref Code="ZZ" Type="Operating"/>
</VendorPrefPairing>
{% endxmlsec %}

{% xmlsec "В результатах поиска будут отсутствовать варианты перелетов с сегментами, в которых XX — маркетинговый перевозчик, а YY — оперирующий", true %}
<VendorPrefPairing PreferLevel="Unacceptable">
  <VendorPref Code="XX" Type="Marketing"/>
  <VendorPref Code="YY" Type="Operating"/>
</VendorPrefPairing>
{% endxmlsec %}

Значение ```true``` у атрибута ```/OTA_AirLowFareSearchRQ/TravelPreferences/TPA_Extensions/ExcludeCallDirectCarriers/@Enabled``` позволяет не выдавать те варианты перелетов, которые невозможно забронировать в системе бронирования Sabre. Рекомендуется установить это значение у атрибута.

#### Черный и белый список альянсов для всего запрошенного маршрута

Белый список альянсов для всего запрошенного маршрута задается в последовательно расположенных элементах ```/OTA_AirLowFareSearchRQ/TravelPreferences/TPA_Extensions/IncludeAlliancePref```. Для каждого альянса необходимо указать его код в атрибуте ```IncludeAlliancePref/@Code```.

Черный список альянсов для всего запрошенного маршрута задается в последовательно расположенных элементах ```/OTA_AirLowFareSearchRQ/TravelPreferences/TPA_Extensions/ExcludeAlliancePref```. Для каждого альянса необходимо указать его код в атрибуте ```ExcludeAlliancePref/@Code```.

#### Белый список маркетинговых перевозчиков и альянсов для отдельного сегмента

Белый список перевозчиков для отдельного сегмента задается в последовательно расположенных элементах ```/OTA_AirLowFareSearchRQ/OriginDestinationInformation/TPA_Extensions/IncludeVendorPref/@Code```.

Белый список альянсов для отдельного сегмента задается в последовательно расположенных элементах ```/OTA_AirLowFareSearchRQ/OriginDestinationInformation/TPA_Extensions/IncludeAlliancePref/@Code```.

Белые списки альянсов и перевозчиков для отдельного сегмента не могут быть указаны одновременно с белым списком альянсов и перевозчиков для всего маршрута. Т.е. необходимо выбрать или белый список для отдельного сегмента или для всего маршрута.

#### Интерлайн

По умолчанию Sabre ищет варианты перелетов без учета наличия интерлайн соглашений между перевозчиками. Это означает, что перевозчики могут не разрешать оформлять найденные варианты перелетов на одном билете. Для того, чтобы при поиске перелетов происходила проверка на наличие интерлайн соглашения между перевозчиками, необходимо установить значение ```true``` у атрибута ```/OTA_AirLowFareSearchRQ/TravelPreferences/@ValidInterlineTicket``` в запросе.

Для того, чтобы не получать в результатах поиска интерлайн перелеты (перелеты, содержащие несколько маркетинговых перевозчиков), необходимо указать значение ```true``` у атрибута ```/OTA_AirLowFareSearchRQ/TravelPreferences/TPA_Extensions/OnlineIndicator/@Ind```.

#### Кодшер

Для того, чтобы исключить из результатов поиска варианты перелетов с кодшер рейсами (т.е. рейсами, у которых различаются маркетинговый и оперирующий перевозчик) необходимо указать значение ```true``` у атрибута ```/OTA_AirLowFareSearchRQ/TravelPreferences/TPA_Extensions/CodeShareIndicator/@ExcludeCodeshare```.
Если указать также значение ```true``` у атрибута ```/OTA_AirLowFareSearchRQ/TravelPreferences/TPA_Extensions/CodeShareIndicator/@ExcludeCodeshare/@KeepOnlines```, то из результатов поиска будут исключены варианты перелетов с кодшер рейсами, кроме тех вариантов перелетов, у которых отсутствует интерлайн (т.е. маркетинговый перевозчик у всех рейсов совпадает).

#### Выбор валидирующего перевозчика

*Обратите внимание на то, что указанные ниже параметры для управления выбором валидирующего перевозчика доступны только при включенной настройке [Validating Carrier, Interline, and GSA](tjr-settings.md#validating_carrier_interline_and_gsa_novaya_logika_vibora_validiruyuschego_perevozchika)!*

В результатах поиска можно получить все варианты перелетов для выбранного валидирующего перевозчика. Для этого необходимо указать его код в качестве значения атрибута ```/OTA_AirLowFareSearchRQ/TravelPreferences/TPA_Extensions/ValidatingCarrier/@Code```. Обратите внимание на то, что в этом случае могут быть получены такие варианты перелетов, у которых при поиске без данного параметра мог быть использован другой валидирующий перевозчик.

Черный список валидирующих перевозчиков задается в последовательно расположенных элементах ```/OTA_AirLowFareSearchRQ/TravelPreferences/TPA_Extensions/ValidatingCarrier/Preference```. Для каждого перевозчика необходимо указать:
- ```Preference/@Code``` — двухбуквенный код перевозчика
- ```Preference/@Level``` — значение ```Unacceptable```

Список приоритетных валидирующих перевозчиков задается в последовательно расположенных элементах ```/OTA_AirLowFareSearchRQ/TravelPreferences/TPA_Extensions/ValidatingCarrier/Preference```. Для каждого перевозчика необходимо указать:
- ```Preference/@Code``` — двухбуквенный код перевозчика
- ```Preference/@Level``` — значение ```Preferred```

Приоритетный валидирующий перевозчик будет выбран в том случае, если существует два или более валидирующих перевозчиков, которые предлагают одинаковую стоимость для одного и того же варианта перелета. Если для какого-либо варианта перелета перевозчик, указанный в списке приоритетных, не может быть валидирующим или он предлагает большую стоимость, то выбран будет другой валидирующий перевозчик.

## Багаж

#### Нормы провоза багажа

Для получения информации о нормах провоза багажа в структурированном виде (максимальное количество мест багажа или максимальный вес багажа) необходимо указать значение ```A``` у атрибута ```/OTA_AirLowFareSearchRQ/TravelPreferences/Baggage/@RequestType```.

Для получения дополнительной информации в текстовом виде (максимальный вес и размеры багажа) необходимо указать значение ```true``` у атрибута ```/OTA_AirLowFareSearchRQ/TravelPreferences/Baggage/@Description```.

#### Тарифы с багажом

Для поиска тарифов с багажом (как минимум одно бесплатное место провоза багажа) в запросе необходимо указать значение ```true``` у атрибута ```/OTA_AirLowFareSearchRQ/TravelPreferences/Baggage/@FreePieceRequired```. При поиске перелетов с [расчетом стоимости по всем доступным брендам](shop.md#raschet_stoimosti_po_vsem_dostupnim_brendam), в результатах поиска будут представлены только те брендированные тарифы, которые имеют как минимум одно бесплатное место провоза багажа.

**Обратите внимание на то, что для вариантов перелетов, которые были получены в результатах при поиске тарифов с багажом и, которые не являются брендированными, требуется особый порядок выполнения расчета стоимости и бронирования. См. подробнее в разделах [Создание бронирований в 1 шаг](create-booking-1step.md#raschet_stoimosti_po_kodam_tarifov), [Создание бронирований в 2 шага](create-booking-2steps.md#raschet_stoimosti_po_kodam_tarifov).**

## Брендированные тарифы

#### Информация о примененных брендированных тарифах

По умолчанию ответ на запрос не содержит информацию о примененных брендированных тарифах (код бренда, название бренда, код программы брендов и т.д.). Для того, чтобы получить эту информацию, необходимо указать значение ```true``` у атрибута ```/OTA_AirLowFareSearchRQ/TravelerInfoSummary/PriceRequestInformation/TPA_Extensions/BrandedFareIndicators/@SingleBrandedFare```.

#### Расчет стоимости по всем доступным брендам

Для получения расчетов по всем доступным брендам для всех найденных вариантов перелетов необходимо указать значение ```true``` у атрибута ```/OTA_AirLowFareSearchRQ/TravelerInfoSummary/PriceRequestInformation/TPA_Extensions/BrandedFareIndicators/@MultipleBrandedFares```.

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

*Обратите внимание на то, что использование возможности получения расчетов по всем доступным брендам требует активации для каждого PCC. Пожалуйста, обратитесь к вашему куратору в Sabre для уточнения деталей.*

*Обратите внимание на то, что в одном поисковом запросе невозможно одновременное получение расчетов по всем брендам и получение дополнительных расчетов стоимости по заданным критериям (см. ниже).*

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

Обратите внимание на то, что даже передав один или несколько кодов брендов в белом списке, в ответе расчет для этого плеча может быть выполнен по небрендированному тарифу. Для того, чтобы этого избежать, необходимо указать значение ```Unacceptable``` у атрибута ```/OTA_AirLowFareSearchRQ/TravelerInfoSummary/PriceRequestInformation/TPA_Extensions/BrandedFareIndicators/BrandFilters/NonBrandedFares/@PreferLevel``` (для всего маршрута) или ```/OTA_AirLowFareSearchRQ/OriginDestinationInformation/TPA_Extensions/BrandFilters/NonBrandedFares/@PreferLevel``` (для плеча). Для того, чтобы расчет был выполнен только по небрендированным тарифам, необходимо указать значение ```Preferred``` у этого атрибута.

## Дополнительные расчеты стоимости по заданным критериям

*Обратите внимание на то, что в одном поисковом запросе невозможно одновременное получение дополнительных расчетов стоимости по заданным критериям и получение расчетов по всем брендам (см. выше).*

Ответ Bargain Finder Max по умолчанию содержит расчет стоимости по самому дешевому доступному тарифу (или тарифам) для каждого найденного варианта перелета. Описанная ниже функциональность позволяет получить дополнительные расчеты стоимости для каждого найденного варианта перелета по указанным в запросе группам критериев. Таким образом, ответ на запрос к сервису Bargain Finder Max в этом случае может содержать несколько вариантов расчета стоимости одного и того же варианта перелета:
- расчет стоимости по самому дешевому доступному тарифу (или тарифам)
- дополнительные расчеты стоимости по тарифам, выбранным по заданным в запросе группам критериев

Каждая группа критериев задается в последовательно расположенных элементах ```/OTA_AirLowFareSearchRQ/TravelPreferences/TPA_Extensions/FlexibleFares/FareParameters``` запроса. Всего один запрос может содержать до 10 групп критериев. Каждая группа критериев может содержать один или несколько критериев.

Ниже представлено описание доступных критериев.

#### Включение или исключение тарифов с ограничениями

Для исключения из расчета тарифов с ограничениями необходимо указать значение ```false``` у одного из атрибутов:
- ```/OTA_AirLowFareSearchRQ/TravelPreferences/TPA_Extensions/FlexibleFares/FareParameters/ResTicketing/@Ind``` — исключение тарифов с ограничениями по срокам бронирования и оформления билетов
- ```/OTA_AirLowFareSearchRQ/TravelPreferences/TPA_Extensions/FlexibleFares/FareParameters/MinMaxStay/@Ind``` — исключение тарифов с ограничениями по срокам минимального и максимального пребывания
- ```/OTA_AirLowFareSearchRQ/TravelPreferences/TPA_Extensions/FlexibleFares/FareParameters/RefundPenalty/@Ind``` — исключение тарифов со штрафами за возврат

Для исключения любых тарифов с ограничениями необходимо указать значение ```true``` у атрибута ```/OTA_AirLowFareSearchRQ/TravelPreferences/TPA_Extensions/FlexibleFares/FareParameters/ExcludeRestricted/@Ind```.

#### Количество и категории пассажиров

Различные категории пассажиров могут быть указаны в последовательно расположенных элементах ```/OTA_AirLowFareSearchRQ/TravelPreferences/TPA_Extensions/FlexibleFares/FareParameters/PassengerTypeQuantity```. У каждого элемента нужно указать код категории пассажира (атрибут ```/@Code```) и количество пассажиров данной категории (атрибут ```/@Quantity```).

*Обратите внимание на то, что общее количество пассажиров в одной группе критериев не должно превышать общее количество пассажиров в основном запросе.*

Для того чтобы получать расчет только для указанных категорий пассажиров во всех тарифах в расчете (т.е. отключить смену категории пассажира в случае невозможности произвести расчет по указанной категории) необходимо указать значение ```true``` у атрибута ```/OTA_AirLowFareSearchRQ/TravelPreferences/TPA_Extensions/FlexibleFares/FareParameters/XOFares/@Ind```.

Для того чтобы получить расчет для указанных категорий пассажиров хотя бы для одного тарифа в расчете необходимо указать значение ```true``` у атрибута ```/OTA_AirLowFareSearchRQ/TravelPreferences/TPA_Extensions/FlexibleFares/FareParameters/UsePassengerFares/@Ind```.

#### Использование приватных или публичных тарифов

Для получения расчетов только по публичным или только по приватным тарифам необходимо указать значение ```true``` у атрибута ```/OTA_AirLowFareSearchRQ/TravelPreferences/TPA_Extensions/FlexibleFares/FareParameters/PublicFare/@Ind``` или ```/OTA_AirLowFareSearchRQ/TravelPreferences/TPA_Extensions/FlexibleFares/FareParameters/PrivateFare/@Ind```, соответственно.

Дополнительно в качестве критериев можно указать один или несколько Account Code и Corporate ID в последовательно расположенных элементах ```/OTA_AirLowFareSearchRQ/TravelPreferences/TPA_Extensions/FlexibleFares/FareParameters/AccountCode``` и ```/OTA_AirLowFareSearchRQ/TravelPreferences/TPA_Extensions/FlexibleFares/FareParameters/CorporateID```, соответственно. Сами коды указываются в атрибутах ```/@Code``` этих элементов.

По умолчанию даже с указанными Account Code или Corporate ID система может вернуть расчет по тарифу или тарифам, для расчета которого не применялись Account Code или Corporate ID, если этот тариф или тарифы дешевле, чем тарифы с Account Code или Corporate ID или, если тарифы с Account Code или Corporate ID отсутствуют или не применимы.

Однако, если указать значение ```true``` у атрибута ```/OTA_AirLowFareSearchRQ/TravelPreferences/TPA_Extensions/FlexibleFares/FareParameters/NegotiatedFaresOnly/@Ind```, то в полученном расчете для всех тарифов будут использованы указанные Account Code или Corporate ID.

Если указать значение ```true``` у атрибута ```/OTA_AirLowFareSearchRQ/TravelPreferences/TPA_Extensions/FlexibleFares/FareParameters/UseNegotiatedFares/@Ind```, то в полученном расчете как минимум для одного тарифа будут использованы указанные Account Code или Corporate ID.

#### Обмен и возврат

Получение информации об условиях обмена и возврата найденных вариантов перелета, а также установка требований к условиям обмена и возврата найденных вариантов производится аналогично тому, как описано в разделе "Обмен и возврат". Для дополнительного расчета все требования необходимо представить в элементе ```/OTA_AirLowFareSearchRQ/TravelPreferences/TPA_Extensions/FlexibleFares/FareParameters/VoluntaryChanges``` (по аналогии с ```/OTA_AirLowFareSearchRQ/TravelerInfoSummary/AirTravelerAvail/PassengerTypeQuantity/TPA_Extensions/VoluntaryChanges``` для основного запроса).

#### Выбор класса обслуживания

Класс обслуживания может быть указан в качестве значения атрибута ```/OTA_AirLowFareSearchRQ/TravelPreferences/TPA_Extensions/FlexibleFares/FareParameters/Cabin/@Type```. Допустимые варианты кодов и названий классов обслуживания:
- ```Economy``` или ```Y``` — экономический класс
- ```PremiumEconomy``` или ```S``` — улучшенный экономический класс
- ```Business``` или ```C``` — бизнес класс
- ```PremiumBusiness``` или ```J``` — улучшенный бизнес класс
- ```First``` или ```F``` — первый класс
- ```PremiumFirst``` или ```P``` — улучшенный первый класс

Для отключения логики выбора класса обслуживания необходимо указать значение ```true``` у атрибута ```/OTA_AirLowFareSearchRQ/TravelPreferences/TPA_Extensions/FlexibleFares/FareParameters/JumpCabinLogic/@Disabled``` или атрибута ```/OTA_AirLowFareSearchRQ/TravelPreferences/TPA_Extensions/FlexibleFares/FareParameters/KeepSameCabin/@Enabled```. Подробнее о том, как выбирается класс обслуживания и на что влияют указанные выше параметры см. [Класс обслуживания](shop.md#klass_obsluzhivaniya). 

#### Выбор класса бронирования

Черный и белый список классов бронирования задается в элементах ```/OTA_AirLowFareSearchRQ/TravelPreferences/TPA_Extensions/FlexibleFares/FareParameters/ClassOfService``` так же, как и для основного запроса.

#### Выбор кода тарифа

Черный и белый список кодов тарифов задается в элементах ```/OTA_AirLowFareSearchRQ/TravelPreferences/TPA_Extensions/FlexibleFares/FareParameters/FareBasis``` так же, как и для основного запроса.

#### Параметры плеча

В запросе можно указать параметры для каждого из запрашиваемого плеч. Для этого необходимо добавить элемент ```/OTA_AirLowFareSearchRQ/TravelPreferences/TPA_Extensions/FlexibleFares/FareParameters/Leg``` и указать в нем в качестве значения атрибута ```/@Num``` номер плеча.

Доступные параметры для каждого плеча:
```Leg/Cabin``` — класс обслуживания (см. выше доступные значения)
```Leg/ClassOfService``` — класс бронирования (см. выше доступные значения)
```Leg/FareBasis``` — код тарифа (см. выше доступные значения)

#### Дополнительная информация

Дополнительная информация по функции Multiple Fares per Itinerary доступна в [документации](http://files.developer.sabre.com/doc/providerdoc/shopping/MultipleFaresPerItinerary_DAG.pdf).

## Разнообразие поисковой выдачи

По умолчанию варианты перелетов для каждого поискового запроса выбираются по их стоимости. Например, запросив 50 вариантов, вы получите 50 самых дешевых вариантов перелетов, отвечающих заданным требованиям. Однако, в некоторых случаях требуется найти такие варианты перелета, которые могут быть не самыми дешевыми, но отвечать дополнительным требованиям пассажира или агентства. Например:
- удобное время вылета
- низкое время в пути
- повышенная комиссия перевозчика
- и т.д.

Для этого в сервисе Bargain Finder Max предусмотрена возможность изменения разнообразия поисковой выдачи. Для этого предлагается разбить поисковую выдачу на две части (корзины):
- корзина с самыми дешевыми перелетами
- корзина с перелетами, отвечающими определенным заданным критериям

Размер первой корзины может быть задан:
- в абсолютных числах (например, 150 вариантов из 200). Это число должно быть указано в качестве значения атрибута ```/OTA_AirLowFareSearchRQ/TPA_Extensions/DiversityControl/LowFareBucket/@Options```
- в процентах (например, 75% вариантов из 200). Этот процент должен быть указан в качестве значения атрибута ```/OTA_AirLowFareSearchRQ/TPA_Extensions/DiversityControl/LowFareBucket/@Options``` (вместе со знаком ```%``` на конце)
- в процентах максимальной разницы в стоимости между самым дешевым и дорогим вариантом перелета (например, если указано значение ```100%``` и самый дешевый найденный перелет стоит 10000 рублей, то в первой корзине будут только те варианты перелетов, которые стоят менее 20000 рублей). Этот процент должен быть указан в качестве значения атрибута ```/OTA_AirLowFareSearchRQ/TPA_Extensions/DiversityControl/LowFareBucket/@FareCutOff``` (вместе со знаком ```%``` на конце)

Для составления второй корзины результатов требуется указать один или несколько критериев. Всего доступно 7 критериев. Для каждого критерия можно указать его вес (значимость), а также дополнительные параметры.

Для каждого варианта перелета рассчитывается специальный коэффициент, в зависимости от значений используемых критериев, после чего все варианты перелетов, которые не попадают в первую корзину, сортируются по величине коэффициента и выбираются во вторую корзину.

Формула для расчета коэффициента:

```Стоимость × (Крит1Вес + Крит2Вес × Крит2Коэфф + Крит3Вес × Крит3Коэфф + Крит4Вес × Крит4Коэфф + Крит5Вес × Крит5Коэфф + Крит6Вес × Крит6Коэфф + Крит7Вес × Крит7Коэфф)```

Где:
- критерий 1 — стоимость
- критерий 2 — время в пути
- критерий 3 — выбор перевозчиков
- критерий 4 — дубликаты
- критерий 5 — комбинации рейсов
- критерий 6 — время вылета и прилета
- критерий 7 — количество пересадок

Для каждой критерия можно указать его вес (от 0 до 10), т.е. указать насколько данный критерий важен по сравнению с остальными. Для всех критериев кроме стоимости также рассчитывается специальный коэффициент, который позволяет сравнивать его с другими критериями и используется в формуле, указанной выше.

#### Стоимость

Данный критерия определяет насколько важна стоимость найденного перелета для попадания во вторую корзину.

Вес критерия указывается в качестве значения атрибута ```/OTA_AirLowFareSearchRQ/TPA_Extensions/DiversityControl/Dimensions/@PriceWeight```.

#### Время в пути

Данный критерий определяет насколько важно время в пути (включая время пересадок) для найденного перелета для попадания во вторую корзину.

Вес критерия указывается в качестве значения атрибута ```/OTA_AirLowFareSearchRQ/TPA_Extensions/DiversityControl/Dimensions/TravelTime/@Weight```.

Коэффициент для данного критерия рассчитывается по следующей формуле:

```(Время в пути для данного перелета - Время в пути самого быстрого перелета) / Время в пути для данного перелета```

#### Выбор перевозчиков

Данный критерий определяет насколько важно попадание вариантов определенного перевозчика во вторую корзину.

Для каждого перевозчика можно указать количество или процент желаемых вариантов (атрибут ```/OTA_AirLowFareSearchRQ/TPA_Extensions/DiversityControl/Dimensions/Carrier/Override/@Options```) и его код (атрибут ```/OTA_AirLowFareSearchRQ/TPA_Extensions/DiversityControl/Dimensions/Carrier/Override/@Code```).

Также можно указать количество или процент желаемых вариантов для тех перевозчиков, что не были перечислены, т.е. по умолчанию (атрибут ```/OTA_AirLowFareSearchRQ/TPA_Extensions/DiversityControl/Dimensions/Carrier/Default/@Options```).

В запросе в атрибуте ```/OTA_AirLowFareSearchRQ/TPA_Extensions/DiversityControl/Dimensions/Carrier/@OnlineIndicator``` можно указать требуется ли использовать данный критерий только для вариантов перелета с одним маркетинговым перевозчиком (значение ```true```) или также для интерлайн вариантов перелета.

Вес критерия указывается в качестве значения атрибута ```/OTA_AirLowFareSearchRQ/TPA_Extensions/DiversityControl/Dimensions/Carrier/@Weight```.

Коэффициент для данного критерия рассчитывается по следующей формуле:

```(Количество вариантов перелета для перевозчика - Указанное количество вариантов для перевозчика) / Количество вариантов перелета для перевозчика```

#### Дубликаты

Данный критерий позволяет избавиться от дубликатов (варианты перелетов с одинаковыми сегментами, продающиеся разными маркетинговыми перевозчиками) во второй корзине.

По умолчанию дубликатом считается только тот вариант перелета, в котором ни на одном из сегментов маркетинговый перевозчик не является оперирующим.

В запросе также можно указать коды тех маркетинговых перевозчиков, которые необходимо считать оригинальными вариантами и оставить во второй корзине (атрибут ```/OTA_AirLowFareSearchRQ/TPA_Extensions/DiversityControl/Dimensions/OperatingDuplicate/PreferredCarrier/@Code```).

Вес критерия указывается в качестве значения атрибута ```/OTA_AirLowFareSearchRQ/TPA_Extensions/DiversityControl/Dimensions/OperatingDuplicate/@Weight```.

Коэффициент для данного критерия определяется по следующему алгоритму:
- 0, если вариант считается дубликатом
- 1, если вариант не считается дубликатом

#### Комбинации рейсов

Данный критерий позволяет снизить число вариантов перелетов, у которых совпадают рейсы при перелете туда при разных рейсах при перелете обратно, во второй корзине.

В запросе можно указать сколько комбинаций с одинаковыми рейсами при перелете туда должно быть во второй корзине (атрибут ```/OTA_AirLowFareSearchRQ/TPA_Extensions/DiversityControl/Dimensions/InboundOutboundPairing/@Duplicates```).

Вес критерия указывается в качестве значения атрибута ```/OTA_AirLowFareSearchRQ/TPA_Extensions/DiversityControl/Dimensions/InboundOutboundPairing/@Weight```.

Коэффициент для данного критерия рассчитывается по следующей формуле:

```(Количество различных комбинаций с таким вылетом туда - Указанное количество комбинаций) / Количество различных комбинаций с таким вылетом туда```

#### Время вылета и прилета

Данный критерий позволяет определить временные промежутки в течение дня получения вариантов перелета с вылетом или посадкой в эти промежутки во второй корзине.

В запросе можно указать одно или несколько условий по попаданию вариантов перелетов в нужный временной промежуток (элементы ```/OTA_AirLowFareSearchRQ/TPA_Extensions/DiversityControl/Dimensions/TimeOfDay/Distribution```). Для каждого условия необходимо указать один из следующих аргументов:
- ```/@Direction``` — направление перелета, для которого действует условие. Возможные варианты:
    - ```Outbound``` — перелет туда
    - ```Inbound``` — перелет обратно
- ```/@Leg``` — номер плеча в запросе, для которого действует условие

Дополнительно можно указать:
- ```/@Endpoint``` — выбор применимости условия. Возможные варианты:
    - ```Departure``` — взлет
    - ```Arrival``` — посадка

Каждое условие может содержать до 4 временных промежутков (элементы ```/OTA_AirLowFareSearchRQ/TPA_Extensions/DiversityControl/Dimensions/TimeOfDay/Distribution/Range```) со следующими обязательными атрибутами:
- ```Begin``` — начало временного промежутка
- ```End``` — окончание временного промежутка
- ```Options``` — количество или процент желаемых вариантов в указанный временной промежуток

Коэффициент для данного критерия рассчитывается по следующей формуле:

```Количество различных плеч для вылета туда за данный временной промежуток * (1 - Указанный процент) / Общее количество различных плеч для вылета туда + Количество различных плеч для вылета обратно за данный временной промежуток * (1 - Указанный процент) / Общее количество различных плеч для вылета обратно```

#### Количество пересадок

Данный критерий определяет насколько важно количество пересадок в найденном перелете для попадания во вторую корзину.

Вес критерия указывается в качестве значения атрибута ```/OTA_AirLowFareSearchRQ/TPA_Extensions/DiversityControl/Dimensions/StopsNumber/@Weight```.

Коэффициент для данного критерия рассчитывается по следующей формуле:

```(Количество прямых сегментов × 0 + Количество сегментов с технической посадкой × 0,5 + Количество сегментов с пересадками × 1) / Общее количество сегментов```

Например, коэффициент для перелета из Уфы в Лондон и обратно с пересадкой в Москве составит: (4 × 1)/4 = 1. Коэффициент для перелета из Москвы в Мельбурн с технической посадкой в Куала-Лумпуре: (2 × 0,5)/2 = 0,5.

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

По умолчанию BargainFinderMaxRQ предлагает варианты перелетов с расчетом, как по публичным, так и по приватным тарифам. Однако, указав значение атрибута ```/OTA_AirLowFareSearchRQ/TravelerInfoSummary/PriceRequestInformation/TPA_Extensions/PublicFare/@Ind``` или ```/OTA_AirLowFareSearchRQ/TravelerInfoSummary/PriceRequestInformation/TPA_Extensions/PrivateFare/@Ind``` равное ```true``` можно запросить расчет только по публичным или приватным тарифам, соответственно.

Список кодов корпоративных скидок (Corporate ID) задается в последовательно расположенных элементах ```/OTA_AirLowFareSearchRQ/TravelerInfoSummary/PriceRequestInformation/NegotiatedFareCode```. Для каждого кода необходимо указать его значение в атрибуте ```NegotiatedFareCode/@Code```. Дополнительно можно задать список перевозчиков, для которых действует данный код. Данный список задается в последовательно расположенных элементах ```NegotiatedFareCode/Supplier```. Для каждого элемента необходимо задать код перевозчика в атрибуте ```NegotiatedFareCode/Supplier/@Code```.

Список аккаунт кодов (Account Code) задается в последовательно расположенных элементах ```/OTA_AirLowFareSearchRQ/TravelerInfoSummary/PriceRequestInformation/AccountCode```. Для каждого аккаунт кода необходимо указать его значение в атрибуте ```AccountCode/@Code```.

## Оформление на нескольких билетах

*Обратите внимание на то, что для работы данной опции требуется включение настройки [Multi-Ticket Shopping and Pricing (Поиск перелетов с оформлением на нескольких билетах)](tjr-settings.md#multi-ticket_shopping_and_pricing_poisk_pereletov_s_oformleniem_na_neskolkih_biletah). Опция будет активирована в течение 24 часов.*

По умолчанию в результатах поискового присутствуют предложения, которые могут быть оформлены на одном билетом, при использовании данной опции запрашиваемый маршрут туда-обратно (Round Trip) будет разбит на два маршрута туда (One Way) и поиск будет также производиться по ним. Это позволяет сократить количество отправляемых запросов и (или) получать более дешевые предложения в результатах поиска.

Доступно два режима работа данной опции, каждый из которых имеет собственный код, который должен быть указан в атрибуте ```/OTA_AirLowFareSearchRQ/TPA_Extensions/MultiTicket/@DisplayPolicy```:
- ```SOW``` (Show One Ways) — в результатах поиска одновременно будет присутствовать три массива результатов: варианты перелетов RT и два массива вариантов перелетов OW туда и обратно. Фактически данный вариант аналогичен отправки трех поисковых запросов: 1xRT, 2xOW.  
- ```SCHS``` (Show CHeapest Solutions) — варианты перелетов отсортированы по стоимости вне зависимости от того, из чего они состоят: 1xRT или 2xOW.

Дополнительно в запросе можно установить максимальное количество возвращаемых вариантов перелетов с оформлением на разных билетах:
- ```/OTA_AirLowFareSearchRQ/TPA_Extensions/MultiTicket/@RequestedOneWays``` —  для всего маршрута
- ```/OTA_AirLowFareSearchRQ/OriginDestinationInformation/TPA_Extensions/MaxOneWayOptions/@Value``` —  для каждого плеча по отдельности

*Варианты перелетов, которые должны быть оформлены на двух билетах, рекомендуется оформлять в разных бронированиях. В этом случае сценарии бронирования, оформления билетов и другие рекомендуется выполнять параллельно в разных сессиях. Сами сценарии работы с бронированиями не меняются.*

## Дополнительные прямые перелеты

В поисковом запросе можно указать дополнительные прямые перелеты, которые будут добавлены к запрошенным вариантам перелета. Количество прямых перелетов может быть задано как в абсолютных числах (атрибут ```/OTA_AirLowFareSearchRQ/TravelPreferences/TPA_Extensions/DiversityParameters/@AdditionalNonStopsNumber```), так и в процентах от общего числа вариантов (атрибут ```/OTA_AirLowFareSearchRQ/TravelPreferences/TPA_Extensions/DiversityParameters/@AdditionalNonStopsPercentage```). Общее количество таких вариантов не может превышать 100.

## Air Shopping Rules Manager

[Air Shopping Rules Manager](https://airshopping.havail.sabre.com) — это бесплатный продукт Sabre, который предоставляет возможность устанавливать различные параметры поисковых запросов через веб-интерфейс. Один или несколько параметров запроса могут объединены через Air Shopping Rules Manager в правила (Traveler Personas). Для того чтобы использовать это правило при отправке запросов, необходимо указать код правила в качестве значения атрибута ```/OTA_AirLowFareSearchRQ/TPA_Extensions/IntelliSellTransaction/TravelerPersona/@Name```.

Подробнее о продукте можно прочитать в [документации](http://files.developer.sabre.com/doc/providerdoc/shopping/Air_Shopping_Rules_Manager_User_Guide_2018.9.pdf).

## PCC

Запрос к сервису BargainFinderMaxRQ должен содержать элемент ```/OTA_AirLowFareSearchRQ/POS``` в корневом элементе:

{% xmlsec "Пример", true %}
<POS>
  <Source PseudoCityCode="Ваш PCC">
    <RequestorID ID="1" Type="1">
      <CompanyName Code="TN"/>
    </RequestorID>
  </Source>
</POS>
{% endxmlsec %}

В атрибуте ```/OTA_AirLowFareSearchRQ/POS/Source/@PseudoCityCode``` необходимо указать PCC, из которого производится запрос. Остальные атрибуты должны быть заполнены как в примере выше.

Сервис Bargain Finder Max позволяет искать варианты перелетов в нескольких PCC одновременно. Это может быть актуально для получения приватных тарифов, которые зафайлированы в разных PCC, или для получения вариантов перелетов, которые доступны не во всех странах.

В случае использования этой опции один PCC будет основным и должен быть задан в качестве значения атрибута ```/OTA_AirLowFareSearchRQ/POS/Source/@PseudoCityCode``` (см. выше). Для каждого дополнительного PCC (всего не более 4) должен быть создан элемент ```/OTA_AirLowFareSearchRQ/TPA_Extensions/AlternatePCC```, у которого в качестве значения атрибута ```/@PseudoCityCode``` указан PCC.

Подробнее о поиске в нескольких PCC см. в [документации](http://webservices.sabre.com/drc/providerdoc/shopping/BargainFinderMax_Help/Content/Features/ShopAcrossMultPCCs/Shop_Across_Multiple_PCCs_DAG.pdf).

*Обратите внимание на то, что использование данной опции требует активации. Пожалуйста, обратитесь к вашему куратору в Sabre для уточнения деталей.*

## Количество вариантов перелетов

Тип запроса (количество запрашиваемых вариантов перелетов) должен быть указан в качестве значения атрибута ```/OTA_AirLowFareSearchRQ/TPA_Extensions/IntelliSellTransaction/RequestType/@Name```.

Допустимыми значениями являются:
- ```50ITINS``` — 50 вариантов перелетов
- ```100ITINS``` — 100 вариантов перелетов
- ```200ITINS``` — 200 вариантов перелетов

Дополнительное ограничение на количество возвращаемых вариантов перелетов можно установить в качестве значения атрибута ```/OTA_AirLowFareSearchRQ/TravelPreferences/TPA_Extensions/NumTrips/@Number```.

## Вид ответа

У сервиса BargainFinderMaxRQ существует два основных вида представления ответов, код которого должен быть указан в атрибуте ```/OTA_AirLowFareSearchRQ/@ResponseType``` запроса:
- ```OTA``` — стандартный вид ответа, в котором вся информация представлена в иерархическом виде. Ответ содержит список элементов, каждый из которых содержит информацию о предложенной опции, например, информацию о перелетах, расчет стоимости и т.д. Эти элементы, в свою очередь, могут содержать другие элементы, например, расчет стоимости содержит информацию о таксах (величина, код, название)
- ```GIR``` — группированный или нормализованный вид ответа. Ответ содержит информацию отдельно о рейсах, расчетах стоимости, таксах и т.д. Связность между элементами достигается за счет использования идентификаторов элементов

## Примеры

{% xmlsec "Пример запроса (базовый запрос, OTA ответ)", false %}
<OTA_AirLowFareSearchRQ ResponseType="OTA" Version="6.1.0" xmlns="http://www.opentravel.org/OTA/2003/05">
  <POS>
    <Source PseudoCityCode="9LSC">
      <RequestorID ID="1" Type="1">
        <CompanyName Code="TN"/>
      </RequestorID>
    </Source>
  </POS>
  <OriginDestinationInformation RPH="1">
    <DepartureDateTime>2020-09-01T11:00:00</DepartureDateTime>
    <OriginLocation LocationCode="MOW"/>
    <DestinationLocation LocationCode="AER"/>
  </OriginDestinationInformation>
  <OriginDestinationInformation RPH="2">
    <DepartureDateTime>2020-09-08T11:00:00</DepartureDateTime>
    <OriginLocation LocationCode="AER"/>
    <DestinationLocation LocationCode="MOW"/>
  </OriginDestinationInformation>
  <TravelPreferences ValidInterlineTicket="true"/>
  <TravelerInfoSummary>
    <SeatsRequested>1</SeatsRequested>
    <AirTravelerAvail>
      <PassengerTypeQuantity Code="ADT" Quantity="1"/>
    </AirTravelerAvail>
  </TravelerInfoSummary>
  <TPA_Extensions>
    <IntelliSellTransaction>
      <RequestType Name="200ITINS"/>
    </IntelliSellTransaction>
  </TPA_Extensions>
</OTA_AirLowFareSearchRQ>
{% endxmlsec %}

{% xmlsec "Пример ответа", false %}
<OTA_AirLowFareSearchRS AvailableItinCount="0" BrandedOneWayItinCount="0" DepartedItinCount="0" PricedItinCount="200" SimpleOneWayItinCount="0" SoldOutItinCount="0" Version="6.1.0" xmlns="http://www.opentravel.org/OTA/2003/05" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <Success/>
  <Warnings>
    <Warning Code="TRANSACTIONID" MessageClass="I" ShortText="7552123726544527443" Type="WORKERTHREAD"/>
    <Warning Code="ASEPT2LAPP00344.IDM.SGDCPROD.SABRE.COM" MessageClass="I" ShortText="27037" Type="SERVER"/>
    <Warning Code="RULEID" MessageClass="I" ShortText="15936" Type="DRE"/>
    <Warning Code="RULEID" MessageClass="I" ShortText="24467" Type="DEFAULT"/>
  </Warnings>
  <PricedItineraries>
    <PricedItinerary SequenceNumber="1">
      <AirItinerary DirectionInd="Return">
        <OriginDestinationOptions>
          <OriginDestinationOption ArrivalCountry="RU" DepartureCountry="RU" ElapsedTime="140">
            <FlightSegment ArrivalDateTime="2020-09-01T15:35:00" DepartureDateTime="2020-09-01T13:15:00" ElapsedTime="140" FlightNumber="1309" ResBookDesigCode="W" StopQuantity="0">
              <DepartureAirport LocationCode="ZIA"/>
              <ArrivalAirport LocationCode="AER"/>
              <OperatingAirline Code="U6" FlightNumber="1309"/>
              <Equipment AirEquipType="320"/>
              <MarketingAirline Code="U6"/>
              <MarriageGrp>O</MarriageGrp>
              <DepartureTimeZone GMTOffset="3"/>
              <ArrivalTimeZone GMTOffset="3"/>
              <TPA_Extensions>
                <eTicket Ind="true"/>
                <Mileage Amount="840"/>
              </TPA_Extensions>
            </FlightSegment>
          </OriginDestinationOption>
          <OriginDestinationOption ArrivalCountry="RU" DepartureCountry="RU" ElapsedTime="145">
            <FlightSegment ArrivalDateTime="2020-09-09T00:45:00" DepartureDateTime="2020-09-08T22:20:00" ElapsedTime="145" FlightNumber="308" ResBookDesigCode="W" StopQuantity="0">
              <DepartureAirport LocationCode="AER"/>
              <ArrivalAirport LocationCode="ZIA"/>
              <OperatingAirline Code="U6" FlightNumber="308"/>
              <Equipment AirEquipType="320"/>
              <MarketingAirline Code="U6"/>
              <MarriageGrp>O</MarriageGrp>
              <DepartureTimeZone GMTOffset="3"/>
              <ArrivalTimeZone GMTOffset="3"/>
              <TPA_Extensions>
                <eTicket Ind="true"/>
                <Mileage Amount="840"/>
              </TPA_Extensions>
            </FlightSegment>
          </OriginDestinationOption>
        </OriginDestinationOptions>
      </AirItinerary>
      <AirItineraryPricingInfo FareReturned="true" LastTicketDate="2020-05-13" LastTicketTime="23:59" PricingSource="ADVJR1" PricingSubSource="MIP">
        <ItinTotalFare>
          <BaseFare Amount="1280" CurrencyCode="RUB" DecimalPlaces="0"/>
          <FareConstruction Amount="1280" CurrencyCode="RUB" DecimalPlaces="0"/>
          <EquivFare Amount="1280" CurrencyCode="RUB" DecimalPlaces="0"/>
          <Taxes>
            <Tax Amount="5490" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="TOTALTAX"/>
          </Taxes>
          <TotalFare Amount="6770" CurrencyCode="RUB" DecimalPlaces="0"/>
        </ItinTotalFare>
        <PTC_FareBreakdowns>
          <PTC_FareBreakdown>
            <PassengerTypeQuantity Code="ADT" Quantity="1"/>
            <FareBasisCodes>
              <FareBasisCode ArrivalAirportCode="AER" AvailabilityBreak="true" BookingCode="W" DepartureAirportCode="ZIA" FareComponentBeginAirport="ZIA" FareComponentDirectionality="FROM" FareComponentEndAirport="AER" FareComponentFareRule="U6PR" FareComponentFareTariff="304" FareComponentFareType="XPN" FareComponentFareTypeBitmap="00" FareComponentVendorCode="ATP" GovCarrier="U6">WPRRT</FareBasisCode>
              <FareBasisCode ArrivalAirportCode="ZIA" AvailabilityBreak="true" BookingCode="W" DepartureAirportCode="AER" FareComponentBeginAirport="AER" FareComponentDirectionality="TO" FareComponentEndAirport="ZIA" FareComponentFareRule="U6PR" FareComponentFareTariff="304" FareComponentFareType="XPN" FareComponentFareTypeBitmap="00" FareComponentVendorCode="ATP" GovCarrier="U6">WPRRT</FareBasisCode>
            </FareBasisCodes>
            <PassengerFare>
              <BaseFare Amount="1280" CurrencyCode="RUB"/>
              <FareConstruction Amount="1280" CurrencyCode="RUB" DecimalPlaces="0"/>
              <EquivFare Amount="1280" CurrencyCode="RUB" DecimalPlaces="0"/>
              <Taxes>
                <Tax Amount="2150" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                <Tax Amount="2150" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                <Tax Amount="400" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRI"/>
                <Tax Amount="400" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRI"/>
                <Tax Amount="75" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                <Tax Amount="120" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                <Tax Amount="75" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI4"/>
                <Tax Amount="120" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI4"/>
                <TaxSummary Amount="4300" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                <TaxSummary Amount="800" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRI"/>
                <TaxSummary Amount="390" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                <TotalTax Amount="5490" CurrencyCode="RUB" DecimalPlaces="0"/>
              </Taxes>
              <TotalFare Amount="6770" CurrencyCode="RUB"/>
              <TPA_Extensions>
                <Messages>
                  <Message AirlineCode="U6" FailCode="0" Info="NONEND" Type="N"/>
                  <Message FailCode="0" Info="VALIDATING CARRIER" Type="W"/>
                  <Message FailCode="0" Info="BSP - U6" Type="W"/>
                  <Message FailCode="0" Info="GEN - U6" Type="W"/>
                  <Message FailCode="0" Info="TCH - U6" Type="W"/>
                  <Message FailCode="0" Info="CAT 15 SALES RESTRICTIONS FREE TEXT FOUND - VERIFY RULES" Type="W"/>
                </Messages>
                <BaggageInformationList>
                  <BaggageInformation AirlineCode="U6" ProvisionType="A">
                    <Segment Id="0"/>
                    <Allowance Unit="kg" Weight="10"/>
                  </BaggageInformation>
                  <BaggageInformation AirlineCode="U6" ProvisionType="A">
                    <Segment Id="1"/>
                    <Allowance Unit="kg" Weight="10"/>
                  </BaggageInformation>
                </BaggageInformationList>
              </TPA_Extensions>
            </PassengerFare>
            <Endorsements NonRefundableIndicator="true"/>
            <TPA_Extensions>
              <FareCalcLine Info="ZIA U6 AER640U6 ZIA640RUB1280END"/>
            </TPA_Extensions>
            <FareInfos>
              <FareInfo>
                <FareReference>W</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="N"/>
                </TPA_Extensions>
              </FareInfo>
              <FareInfo>
                <FareReference>W</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="N"/>
                </TPA_Extensions>
              </FareInfo>
            </FareInfos>
          </PTC_FareBreakdown>
        </PTC_FareBreakdowns>
        <FareInfos>
          <FareInfo>
            <FareReference>W</FareReference>
            <TPA_Extensions>
              <SeatsRemaining BelowMin="false" Number="9"/>
              <Cabin Cabin="Y"/>
              <Meal Code="N"/>
            </TPA_Extensions>
          </FareInfo>
          <FareInfo>
            <FareReference>W</FareReference>
            <TPA_Extensions>
              <SeatsRemaining BelowMin="false" Number="9"/>
              <Cabin Cabin="Y"/>
              <Meal Code="N"/>
            </TPA_Extensions>
          </FareInfo>
        </FareInfos>
        <TPA_Extensions>
          <DivideInParty Indicator="false"/>
          <ValidatingCarrier NewVcxProcess="true" SettlementMethod="BSP">
            <Default Code="U6"/>
          </ValidatingCarrier>
          <ValidatingCarrier NewVcxProcess="true" SettlementMethod="TCH">
            <Default Code="U6"/>
          </ValidatingCarrier>
          <ValidatingCarrier NewVcxProcess="true" SettlementMethod="GEN">
            <Default Code="U6"/>
          </ValidatingCarrier>
        </TPA_Extensions>
      </AirItineraryPricingInfo>
      <TicketingInfo TicketType="eTicket" ValidInterline="Yes"/>
      <TPA_Extensions>
        <ValidatingCarrier Code="U6"/>
        <DiversitySwapper WeighedPriceAmount="4810.26"/>
      </TPA_Extensions>
    </PricedItinerary>
    <!--Другие варианты перелетов-->
  </PricedItineraries>
</OTA_AirLowFareSearchRS>
{% endxmlsec %}

---

{% xmlsec "Пример запроса (базовый запрос, GIR ответ)", false %}
<OTA_AirLowFareSearchRQ xmlns="http://www.opentravel.org/OTA/2003/05" ResponseType="GIR" Version="6.1.0">
  <POS>
    <Source PseudoCityCode="9LSC">
      <RequestorID ID="1" Type="1">
        <CompanyName Code="TN"/>
      </RequestorID>
    </Source>
  </POS>
  <OriginDestinationInformation RPH="1">
    <DepartureDateTime>2020-09-01T11:00:00</DepartureDateTime>
    <OriginLocation LocationCode="MOW"/>
    <DestinationLocation LocationCode="AER"/>
  </OriginDestinationInformation>
  <OriginDestinationInformation RPH="2">
    <DepartureDateTime>2020-09-08T11:00:00</DepartureDateTime>
    <OriginLocation LocationCode="AER"/>
    <DestinationLocation LocationCode="MOW"/>
  </OriginDestinationInformation>
  <TravelPreferences ValidInterlineTicket="true"/>
  <TravelerInfoSummary>
    <SeatsRequested>1</SeatsRequested>
    <AirTravelerAvail>
      <PassengerTypeQuantity Code="ADT" Quantity="1"/>
    </AirTravelerAvail>
  </TravelerInfoSummary>
  <TPA_Extensions>
    <IntelliSellTransaction>
      <RequestType Name="200ITINS"/>
    </IntelliSellTransaction>
  </TPA_Extensions>
</OTA_AirLowFareSearchRQ>

{% endxmlsec %}

{% xmlsec "Пример ответа", false %}
<GroupedItineraryResponse Version="6.1.0" xmlns="http://webservices.sabre.com/wsdl/sabreXML1.0.00/shopping/GroupedItineraryResponse" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <Message Code="TRANSACTIONID" Severity="Info" Text="7552155973190501443" Type="WORKERTHREAD"/>
  <Message Code="ASECT2LAPP00607.IDM.SGDCPROD.SABRE.COM" Severity="Info" Text="27033" Type="SERVER"/>
  <Message Code="RULEID" Severity="Info" Text="15936" Type="DRE"/>
  <Message Code="RULEID" Severity="Info" Text="24467" Type="DEFAULT"/>
  <Message Code="MSG" Severity="Info" Text="NO VALID COMBINATIONS FOUND" Type="MIP"/>
  <Message Code="PROCESS" Severity="Error" Text="No data from MIP Clients" Type="MIP"/>
  <Statistics Itineraries="200"/>
  <ScheduleDesc ETicketable="true" ElapsedTime="140" Frequency="SMTW***" ID="1" Stops="0" TotalMilesFlown="847">
    <Departure Airport="AER" City="AER" Country="RU" Time="09:45:00+03:00"/>
    <Arrival Airport="VKO" City="MOW" Country="RU" Time="12:05:00+03:00"/>
    <Carrier Disclosure="DP" Marketing="H1" MarketingFlightNumber="1537" Operating="H1" OperatingFlightNumber="1537">
      <Equipment Code="737" TypeForFirstLeg="N" TypeForLastLeg="N"/>
    </Carrier>
  </ScheduleDesc>
  <ScheduleDesc ETicketable="true" ElapsedTime="135" Frequency="SMTWTFS" ID="2" Stops="0" TotalMilesFlown="847">
    <Departure Airport="AER" City="AER" Country="RU" Time="04:25:00+03:00"/>
    <Arrival Airport="VKO" City="MOW" Country="RU" Time="06:40:00+03:00"/>
    <Carrier Disclosure="DP" Marketing="H1" MarketingFlightNumber="1435" Operating="H1" OperatingFlightNumber="1435">
      <Equipment Code="737" TypeForFirstLeg="N" TypeForLastLeg="N"/>
    </Carrier>
  </ScheduleDesc>
  <ScheduleDesc ETicketable="true" ElapsedTime="150" Frequency="**T*T**" ID="3" Stops="0" TotalMilesFlown="831">
    <Departure Airport="DME" City="MOW" Country="RU" Time="10:20:00+03:00"/>
    <Arrival Airport="AER" City="AER" Country="RU" Time="12:50:00+03:00"/>
    <Carrier Marketing="U6" MarketingFlightNumber="377" Operating="U6" OperatingFlightNumber="377">
      <Equipment Code="320" TypeForFirstLeg="N" TypeForLastLeg="N"/>
    </Carrier>
  </ScheduleDesc>
  <ScheduleDesc ETicketable="true" ElapsedTime="120" Frequency="SMTWTFS" ID="4" Stops="0" TotalMilesFlown="840">
    <Departure Airport="AER" City="AER" Country="RU" Time="16:30:00+03:00"/>
    <Arrival Airport="ZIA" City="MOW" Country="RU" Time="18:30:00+03:00"/>
    <Carrier Marketing="U6" MarketingFlightNumber="1310" Operating="U6" OperatingFlightNumber="1310">
      <Equipment Code="320" TypeForFirstLeg="N" TypeForLastLeg="N"/>
    </Carrier>
  </ScheduleDesc>
  <ScheduleDesc ETicketable="true" ElapsedTime="140" Frequency="SMTWTFS" ID="5" Stops="0" TotalMilesFlown="847">
    <Departure Airport="AER" City="AER" Country="RU" Time="08:00:00+03:00"/>
    <Arrival Airport="VKO" City="MOW" Country="RU" Time="10:20:00+03:00"/>
    <Carrier Disclosure="DP" Marketing="H1" MarketingFlightNumber="1379" Operating="H1" OperatingFlightNumber="1379">
      <Equipment Code="737" TypeForFirstLeg="N" TypeForLastLeg="N"/>
    </Carrier>
  </ScheduleDesc>
  <!--Другие рейсы-->
  <TaxDesc Amount="810" Code="YQF" Currency="RUB" Description="SERVICE FEE - CARRIER-IMPOSED FUEL" ID="1" PublishedAmount="10.00" PublishedCurrency="EUR" Station="DME"/>
  <TaxDesc Amount="270" Code="YRF" Currency="RUB" Description="SERVICE FEE - CARRIER-IMPOSED FUEL" ID="2" PublishedAmount="270" PublishedCurrency="RUB" Station="AER"/>
  <TaxDesc Amount="190" Code="YQI" Currency="RUB" Description="SERVICE FEE - CARRIER-IMPOSED MISC" ID="3" PublishedAmount="190" PublishedCurrency="RUB" Station="SVO"/>
  <TaxDesc Amount="105" Code="RI4" Country="RU" Currency="RUB" Description="TERMINAL USE CHARGE DOMESTIC ARRIVAL" ID="4" PublishedAmount="105" PublishedCurrency="RUB" Station="AER"/>
  <TaxDesc Amount="1500" Code="YQF" Currency="RUB" Description="SERVICE FEE - CARRIER-IMPOSED FUEL" ID="5" PublishedAmount="1500" PublishedCurrency="RUB" Station="SVO"/>
  <!--Другие таксы-->
  <TaxSummaryDesc Amount="450" Code="RI3" Country="RU" Currency="RUB" Description="TERMINAL USE CHARGE DOMESTIC DEPARTURE" ID="1" PublishedAmount="105" PublishedCurrency="RUB" Station="DME"/>
  <TaxSummaryDesc Amount="2960" Code="YQF" Currency="RUB" Description="SERVICE FEE - CARRIER-IMPOSED FUEL" ID="2" PublishedAmount="10.00" PublishedCurrency="EUR" Station="DME"/>
  <TaxSummaryDesc Amount="420" Code="RI3" Country="RU" Currency="RUB" Description="TERMINAL USE CHARGE DOMESTIC DEPARTURE" ID="3" PublishedAmount="75" PublishedCurrency="RUB" Station="ZIA"/>
  <TaxSummaryDesc Amount="380" Code="YQI" Currency="RUB" Description="SERVICE FEE - CARRIER-IMPOSED MISC" ID="4" PublishedAmount="190" PublishedCurrency="RUB" Station="SVO"/>
  <TaxSummaryDesc Amount="4300" Code="YQF" Currency="RUB" Description="SERVICE FEE - CARRIER-IMPOSED FUEL" ID="5" PublishedAmount="2150" PublishedCurrency="RUB" Station="ZIA"/>
  <!--Другие таксы-->
  <FareComponentDesc ApplicablePricingCategories="4 5 10 15 16 18" Direction="EH" Directionality="TO" FareAmount="4375" FareBasisCode="WFLRT" FareCurrency="RUB" FarePassengerType="ADT" FareRule="SFLX" FareTariff="304" FareType="XEX" FareTypeBitmap="00" GoverningCarrier="S7" ID="1" NotValidAfter="2021-06-18" PublishedFareAmount="8750" VendorCode="ATP">
    <Segment/>
  </FareComponentDesc>
  <FareComponentDesc ApplicablePricingCategories="1 4 5 8 10 12 15 16 18 23" Direction="EH" Directionality="FROM" FareAmount="2187" FareBasisCode="EPRRT" FareCurrency="RUB" FarePassengerType="ADT" FareRule="U6PR" FareTariff="304" FareType="XPN" FareTypeBitmap="00" GoverningCarrier="U6" ID="2" NotValidAfter="2020-09-01" NotValidBefore="2020-09-01" PublishedFareAmount="4375" VendorCode="ATP">
    <Segment Stopover="true"/>
  </FareComponentDesc>
  <FareComponentDesc ApplicablePricingCategories="4 5 10 15 16 18" Direction="EH" Directionality="FROM" FareAmount="5135" FareBasisCode="QBSRT" FareCurrency="RUB" FarePassengerType="ADT" FareRule="SBSC" FareTariff="304" FareType="XAT" FareTypeBitmap="00" GoverningCarrier="S7" ID="3" NotValidAfter="2021-06-18" PublishedFareAmount="10270" VendorCode="ATP">
    <Segment Stopover="true"/>
  </FareComponentDesc>
  <FareComponentDesc ApplicablePricingCategories="1 4 5 8 10 12 15 16 18 23" Direction="EH" Directionality="TO" FareAmount="640" FareBasisCode="WPRRT" FareCurrency="RUB" FarePassengerType="ADT" FareRule="U6PR" FareTariff="304" FareType="XPN" FareTypeBitmap="00" GoverningCarrier="U6" ID="4" NotValidAfter="2020-09-08" NotValidBefore="2020-09-08" PublishedFareAmount="1280" VendorCode="ATP">
    <Segment/>
  </FareComponentDesc>
  <FareComponentDesc ApplicablePricingCategories="4 5 10 15 16 18" Direction="EH" Directionality="FROM" FareAmount="4375" FareBasisCode="WFLRT" FareCurrency="RUB" FarePassengerType="ADT" FareRule="SFLX" FareTariff="304" FareType="XEX" FareTypeBitmap="00" GoverningCarrier="S7" ID="5" NotValidAfter="2020-09-30" PublishedFareAmount="8750" VendorCode="ATP">
    <Segment Stopover="true"/>
  </FareComponentDesc>
  <!--Другие компоненты тарифов-->
  <ValidatingCarrierDesc ID="1" NewVcxProcess="true" SettlementMethod="BSP">
    <Default Code="HR"/>
  </ValidatingCarrierDesc>
  <ValidatingCarrierDesc ID="2" NewVcxProcess="true" SettlementMethod="BSP">
    <Default Code="R3"/>
  </ValidatingCarrierDesc>
  <ValidatingCarrierDesc ID="3" NewVcxProcess="true" SettlementMethod="BSP">
    <Default Code="S7"/>
  </ValidatingCarrierDesc>
  <ValidatingCarrierDesc ID="4" NewVcxProcess="true" SettlementMethod="TCH">
    <Default Code="U6"/>
  </ValidatingCarrierDesc>
  <ValidatingCarrierDesc ID="5" NewVcxProcess="true" SettlementMethod="TCH">
    <Default Code="UT"/>
  </ValidatingCarrierDesc>
  <!--Другие валидирующие перевозчики-->
  <BaggageAllowanceDesc ID="1" Pieces="0"/>
  <BaggageAllowanceDesc ID="2" Pieces="0"/>
  <BaggageAllowanceDesc ID="3" Pieces="0"/>
  <BaggageAllowanceDesc ID="4" Pieces="0"/>
  <BaggageAllowanceDesc ID="5" Pieces="0"/>
  <!--Другие нормы провоза багажа-->
  <LegDesc ElapsedTime="145" ID="1">
    <Schedule Ref="49"/>
  </LegDesc>
  <LegDesc ElapsedTime="135" ID="2">
    <Schedule Ref="50"/>
  </LegDesc>
  <LegDesc ElapsedTime="150" ID="3">
    <Schedule Ref="47"/>
  </LegDesc>
  <LegDesc ElapsedTime="145" ID="4">
    <Schedule Ref="48"/>
  </LegDesc>
  <LegDesc ElapsedTime="140" ID="5">
    <Schedule Ref="45"/>
  </LegDesc>
  <!--Другие плечи-->
  <ItineraryGroup>
    <GroupDescription>
      <LegDescription ArrivalLocation="AER" DepartureDate="2020-09-01" DepartureLocation="DME"/>
      <LegDescription ArrivalLocation="DME" DepartureDate="2020-09-08" DepartureLocation="AER"/>
    </GroupDescription>
    <Itinerary ID="1" PricingSource="ADVJR1">
      <Leg Ref="55"/>
      <Leg Ref="40"/>
      <PricingInformation PricingSubsource="MIP">
        <Fare ETicketable="true" GoverningCarriers="U6 U6" LastTicketDate="2020-05-13" LastTicketTime="23:59" VITA="true" ValidatingCarrierCode="U6">
          <PassengerInfo NonRefundable="true" PassengerNumber="1" PassengerType="ADT">
            <FareComponent Ref="9">
              <Segment AvailabilityBreak="true" BookingCode="W" CabinCode="Y" MealCode="N" SeatsAvailable="9"/>
            </FareComponent>
            <FareComponent Ref="4">
              <Segment AvailabilityBreak="true" BookingCode="W" CabinCode="Y" MealCode="N" SeatsAvailable="9"/>
            </FareComponent>
            <Tax Ref="12"/>
            <Tax Ref="8"/>
            <Tax Ref="35"/>
            <Tax Ref="10"/>
            <Tax Ref="24"/>
            <Tax Ref="27"/>
            <Tax Ref="4"/>
            <Tax Ref="13"/>
            <TaxSummary Ref="13"/>
            <TaxSummary Ref="24"/>
            <TaxSummary Ref="1"/>
            <CurrencyConversion ExchangeRateUsed="1" From="RUB" To="RUB"/>
            <FareMessage Carrier="U6" Code="0" Info="NONEND" Type="N"/>
            <FareMessage Code="0" Info="VALIDATING CARRIER" Type="W"/>
            <FareMessage Code="0" Info="BSP - U6" Type="W"/>
            <FareMessage Code="0" Info="GEN - U6" Type="W"/>
            <FareMessage Code="0" Info="TCH - U6" Type="W"/>
            <FareMessage Code="0" Info="CAT 15 SALES RESTRICTIONS FREE TEXT FOUND - VERIFY RULES" Type="W"/>
            <PassengerTotalFare BaseFareAmount="1280" BaseFareCurrency="RUB" CommissionAmount="0" CommissionPercentage="0" ConstructionAmount="1280" ConstructionCurrency="RUB" Currency="RUB" EquivalentAmount="1280" EquivalentCurrency="RUB" ExchangeRateOne="76.8000000" TotalFare="6830" TotalTaxes="5550"/>
            <BaggageInformation AirlineCode="U6" ProvisionType="A">
              <Segment ID="0"/>
              <Allowance Ref="8"/>
            </BaggageInformation>
            <BaggageInformation AirlineCode="U6" ProvisionType="A">
              <Segment ID="1"/>
              <Allowance Ref="8"/>
            </BaggageInformation>
          </PassengerInfo>
          <TotalFare BaseFareAmount="1280" BaseFareCurrency="RUB" ConstructionAmount="1280" ConstructionCurrency="RUB" Currency="RUB" EquivalentAmount="1280" EquivalentCurrency="RUB" TotalPrice="6830" TotalTaxes="5550"/>
          <ValidatingCarrier Ref="12"/>
          <ValidatingCarrier Ref="4"/>
          <ValidatingCarrier Ref="6"/>
        </Fare>
      </PricingInformation>
      <DiversitySwapper WeighedPrice="4756.607"/>
    </Itinerary>
    <!--Другие варианты перелетов-->
  </ItineraryGroup>
  <!--Другие маршруты-->
</GroupedItineraryResponse>
{% endxmlsec %}

---

{% xmlsec "Пример запроса (получение дополнительной информации, OTA ответ)", false %}
<OTA_AirLowFareSearchRQ ResponseType="OTA" Version="6.1.0" xmlns="http://www.opentravel.org/OTA/2003/05">
  <POS>
    <Source PseudoCityCode="9LSC">
      <RequestorID ID="1" Type="1">
        <CompanyName Code="TN"/>
      </RequestorID>
    </Source>
  </POS>
  <OriginDestinationInformation RPH="1">
    <DepartureDateTime>2020-09-01T11:00:00</DepartureDateTime>
    <OriginLocation LocationCode="MOW"/>
    <DestinationLocation LocationCode="AER"/>
  </OriginDestinationInformation>
  <OriginDestinationInformation RPH="2">
    <DepartureDateTime>2020-09-08T11:00:00</DepartureDateTime>
    <OriginLocation LocationCode="AER"/>
    <DestinationLocation LocationCode="MOW"/>
  </OriginDestinationInformation>
  <TravelPreferences ValidInterlineTicket="true">
    <CabinPref Cabin="Economy" PreferLevel="Preferred"/>
    <TPA_Extensions>
      <LongConnectTime Enable="true"/>
      <LongConnectPoints Max="3" Min="1"/>
      <KeepSameCabin Enabled="true"/>
      <ExcludeCallDirectCarriers Enabled="true"/>
      <DiversityParameters AdditionalNonStopsPercentage="100"/>
    </TPA_Extensions>
    <AncillaryFees Enable="true">
      <AncillaryFeeGroup Code="BG"/>
    </AncillaryFees>
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
    <IntelliSellTransaction>
      <RequestType Name="200ITINS"/>
    </IntelliSellTransaction>
  </TPA_Extensions>
</OTA_AirLowFareSearchRQ>
{% endxmlsec %}

{% xmlsec "Пример ответа", false %}
<OTA_AirLowFareSearchRS AvailableItinCount="0" BrandedOneWayItinCount="0" DepartedItinCount="0" PricedItinCount="294" SimpleOneWayItinCount="0" SoldOutItinCount="0" Version="6.1.0" xmlns="http://www.opentravel.org/OTA/2003/05" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <Success/>
  <Warnings>
    <Warning Code="TRANSACTIONID" MessageClass="I" ShortText="1671195250496342399" Type="WORKERTHREAD"/>
    <Warning Code="ASEPT2LAPP00334.IDM.SGDCPROD.SABRE.COM" MessageClass="I" ShortText="27041" Type="SERVER"/>
    <Warning Code="RULEID" MessageClass="I" ShortText="15936" Type="DRE"/>
    <Warning Code="RULEID" MessageClass="I" ShortText="24467" Type="DEFAULT"/>
  </Warnings>
  <BrandFeatures>
    <BrandFeature Application="C" CommercialName="BASIC SEAT" Id="1" ServiceGroup="BF" ServiceType="Z" SubCode="050" Vendor="ATP"/>
    <BrandFeature Application="C" CommercialName="SEAT SELECTION DURING CHECK IN" Id="2" ServiceGroup="BF" ServiceType="Z" SubCode="050" Vendor="ATP"/>
    <BrandFeature Application="F" CommercialName="SEAT SELECTION DURING CHECK IN" Id="3" ServiceGroup="BF" ServiceType="Z" SubCode="050" Vendor="ATP"/>
    <BrandFeature Application="N" CommercialName="REFUNDABLE TICKET" Id="4" ServiceGroup="BF" ServiceType="Z" SubCode="056" Vendor="ATP"/>
    <BrandFeature Application="C" CommercialName="CHANGEABLE TICKET" Id="5" ServiceGroup="BF" ServiceType="Z" SubCode="059" Vendor="ATP"/>
    <!--Другие услуги-->
  </BrandFeatures>
  <PricedItineraries>
    <PricedItinerary SequenceNumber="1">
      <AirItinerary DirectionInd="Return">
        <OriginDestinationOptions>
          <OriginDestinationOption ArrivalCountry="RU" DepartureCountry="RU" ElapsedTime="140">
            <FlightSegment ArrivalDateTime="2020-09-01T15:35:00" DepartureDateTime="2020-09-01T13:15:00" ElapsedTime="140" FlightNumber="1309" ResBookDesigCode="W" StopQuantity="0">
              <DepartureAirport LocationCode="ZIA"/>
              <ArrivalAirport LocationCode="AER"/>
              <OperatingAirline Code="U6" FlightNumber="1309"/>
              <Equipment AirEquipType="320"/>
              <MarketingAirline Code="U6"/>
              <MarriageGrp>O</MarriageGrp>
              <DepartureTimeZone GMTOffset="3"/>
              <ArrivalTimeZone GMTOffset="3"/>
              <TPA_Extensions>
                <eTicket Ind="true"/>
                <Mileage Amount="840"/>
              </TPA_Extensions>
            </FlightSegment>
          </OriginDestinationOption>
          <OriginDestinationOption ArrivalCountry="RU" DepartureCountry="RU" ElapsedTime="145">
            <FlightSegment ArrivalDateTime="2020-09-09T00:45:00" DepartureDateTime="2020-09-08T22:20:00" ElapsedTime="145" FlightNumber="308" ResBookDesigCode="W" StopQuantity="0">
              <DepartureAirport LocationCode="AER"/>
              <ArrivalAirport LocationCode="ZIA"/>
              <OperatingAirline Code="U6" FlightNumber="308"/>
              <Equipment AirEquipType="320"/>
              <MarketingAirline Code="U6"/>
              <MarriageGrp>O</MarriageGrp>
              <DepartureTimeZone GMTOffset="3"/>
              <ArrivalTimeZone GMTOffset="3"/>
              <TPA_Extensions>
                <eTicket Ind="true"/>
                <Mileage Amount="840"/>
              </TPA_Extensions>
            </FlightSegment>
          </OriginDestinationOption>
        </OriginDestinationOptions>
      </AirItinerary>
      <AirItineraryPricingInfo BrandsOnAnyMarket="true" FareReturned="true" LastTicketDate="2020-05-13" LastTicketTime="23:59" PricingSource="ADVJR1" PricingSubSource="MIP">
        <ItinTotalFare>
          <BaseFare Amount="3520" CurrencyCode="RUB" DecimalPlaces="0"/>
          <FareConstruction Amount="3520" CurrencyCode="RUB" DecimalPlaces="0"/>
          <EquivFare Amount="3520" CurrencyCode="RUB" DecimalPlaces="0"/>
          <Taxes>
            <Tax Amount="16276" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="TOTALTAX"/>
          </Taxes>
          <TotalFare Amount="19796" CurrencyCode="RUB" DecimalPlaces="0"/>
        </ItinTotalFare>
        <PTC_FareBreakdowns>
          <PTC_FareBreakdown>
            <PassengerTypeQuantity Code="ADT" Quantity="2"/>
            <FareBasisCodes>
              <FareBasisCode ArrivalAirportCode="AER" AvailabilityBreak="true" BookingCode="W" DepartureAirportCode="ZIA" FareComponentBeginAirport="ZIA" FareComponentDirectionality="FROM" FareComponentEndAirport="AER" FareComponentFareRule="U6PR" FareComponentFareTariff="304" FareComponentFareType="XPN" FareComponentFareTypeBitmap="00" FareComponentVendorCode="ATP" GovCarrier="U6">WPRRT</FareBasisCode>
              <FareBasisCode ArrivalAirportCode="ZIA" AvailabilityBreak="true" BookingCode="W" DepartureAirportCode="AER" FareComponentBeginAirport="AER" FareComponentDirectionality="TO" FareComponentEndAirport="ZIA" FareComponentFareRule="U6PR" FareComponentFareTariff="304" FareComponentFareType="XPN" FareComponentFareTypeBitmap="00" FareComponentVendorCode="ATP" GovCarrier="U6">WPRRT</FareBasisCode>
            </FareBasisCodes>
            <PassengerFare>
              <BaseFare Amount="1280" CurrencyCode="RUB"/>
              <FareConstruction Amount="1280" CurrencyCode="RUB" DecimalPlaces="0"/>
              <EquivFare Amount="1280" CurrencyCode="RUB" DecimalPlaces="0"/>
              <Taxes>
                <Tax Amount="2150" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                <Tax Amount="2150" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                <Tax Amount="400" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRI"/>
                <Tax Amount="400" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRI"/>
                <Tax Amount="75" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                <Tax Amount="120" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                <Tax Amount="75" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI4"/>
                <Tax Amount="120" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI4"/>
                <TaxSummary Amount="4300" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                <TaxSummary Amount="800" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRI"/>
                <TaxSummary Amount="390" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                <TotalTax Amount="5490" CurrencyCode="RUB" DecimalPlaces="0"/>
              </Taxes>
              <TotalFare Amount="6770" CurrencyCode="RUB"/>
              <PenaltiesInfo>
                <Penalty Amount="0" Applicability="Before" Changeable="true" ConditionsApply="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                <Penalty Amount="3000" Applicability="After" Changeable="true" ConditionsApply="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                <Penalty Applicability="Before" Refundable="false" Type="Refund"/>
                <Penalty Applicability="After" Refundable="false" Type="Refund"/>
              </PenaltiesInfo>
              <TPA_Extensions>
                <FareComponents>
                  <FareComponent BrandID="PR" BrandName="PROMO" ProgramCode="CFFU6" ProgramDescription="U6 DOMESTIC" ProgramID="83326" ProgramSystemCode="A">
                    <Segment FlightIndex="1" LegIndex="1"/>
                    <BrandFeatureRef FeatureId="12"/>
                    <BrandFeatureRef FeatureId="14"/>
                    <BrandFeatureRef FeatureId="17"/>
                    <BrandFeatureRef FeatureId="18"/>
                    <BrandFeatureRef FeatureId="29"/>
                    <BrandFeatureRef FeatureId="30"/>
                    <BrandFeatureRef FeatureId="62"/>
                    <BrandFeatureRef FeatureId="61"/>
                    <BrandFeatureRef FeatureId="45"/>
                    <BrandFeatureRef FeatureId="39"/>
                    <BrandFeatureRef FeatureId="43"/>
                    <BrandFeatureRef FeatureId="65"/>
                    <BrandFeatureRef FeatureId="69"/>
                    <BrandFeatureRef FeatureId="75"/>
                    <BrandFeatureRef FeatureId="77"/>
                  </FareComponent>
                  <FareComponent BrandID="PR" BrandName="PROMO" ProgramCode="CFFU6" ProgramDescription="U6 DOMESTIC" ProgramID="83326" ProgramSystemCode="A">
                    <Segment FlightIndex="1" LegIndex="2"/>
                    <BrandFeatureRef FeatureId="12"/>
                    <BrandFeatureRef FeatureId="14"/>
                    <BrandFeatureRef FeatureId="17"/>
                    <BrandFeatureRef FeatureId="18"/>
                    <BrandFeatureRef FeatureId="29"/>
                    <BrandFeatureRef FeatureId="30"/>
                    <BrandFeatureRef FeatureId="62"/>
                    <BrandFeatureRef FeatureId="61"/>
                    <BrandFeatureRef FeatureId="45"/>
                    <BrandFeatureRef FeatureId="39"/>
                    <BrandFeatureRef FeatureId="43"/>
                    <BrandFeatureRef FeatureId="65"/>
                    <BrandFeatureRef FeatureId="69"/>
                    <BrandFeatureRef FeatureId="75"/>
                    <BrandFeatureRef FeatureId="77"/>
                  </FareComponent>
                </FareComponents>
                <Messages>
                  <Message AirlineCode="U6" FailCode="0" Info="NONEND" Type="N"/>
                  <Message FailCode="0" Info="VALIDATING CARRIER" Type="W"/>
                  <Message FailCode="0" Info="BSP - U6" Type="W"/>
                  <Message FailCode="0" Info="GEN - U6" Type="W"/>
                  <Message FailCode="0" Info="TCH - U6" Type="W"/>
                  <Message FailCode="0" Info="CAT 15 SALES RESTRICTIONS FREE TEXT FOUND - VERIFY RULES" Type="W"/>
                </Messages>
                <BaggageInformationList>
                  <BaggageInformation AirlineCode="U6" ProvisionType="A">
                    <Segment Id="0"/>
                    <Allowance Unit="kg" Weight="10"/>
                  </BaggageInformation>
                  <BaggageInformation AirlineCode="U6" ProvisionType="A">
                    <Segment Id="1"/>
                    <Allowance Unit="kg" Weight="10"/>
                  </BaggageInformation>
                </BaggageInformationList>
              </TPA_Extensions>
            </PassengerFare>
            <Endorsements NonRefundableIndicator="true"/>
            <TPA_Extensions>
              <FareCalcLine Info="ZIA U6 AER640U6 ZIA640RUB1280END"/>
            </TPA_Extensions>
            <FareInfos>
              <FareInfo>
                <FareReference>W</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="N"/>
                </TPA_Extensions>
              </FareInfo>
              <FareInfo>
                <FareReference>W</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="N"/>
                </TPA_Extensions>
              </FareInfo>
            </FareInfos>
          </PTC_FareBreakdown>
          <PTC_FareBreakdown>
            <PassengerTypeQuantity Code="CNN" Quantity="1"/>
            <FareBasisCodes>
              <FareBasisCode ArrivalAirportCode="AER" AvailabilityBreak="true" BookingCode="W" DepartureAirportCode="ZIA" FareComponentBeginAirport="ZIA" FareComponentDirectionality="FROM" FareComponentEndAirport="AER" FareComponentFareRule="U6PR" FareComponentFareTariff="304" FareComponentFareType="XPN" FareComponentFareTypeBitmap="01" FareComponentVendorCode="ATP" GovCarrier="U6">WPRRT/CH25</FareBasisCode>
              <FareBasisCode ArrivalAirportCode="ZIA" AvailabilityBreak="true" BookingCode="W" DepartureAirportCode="AER" FareComponentBeginAirport="AER" FareComponentDirectionality="TO" FareComponentEndAirport="ZIA" FareComponentFareRule="U6PR" FareComponentFareTariff="304" FareComponentFareType="XPN" FareComponentFareTypeBitmap="01" FareComponentVendorCode="ATP" GovCarrier="U6">WPRRT/CH25</FareBasisCode>
            </FareBasisCodes>
            <PassengerFare>
              <BaseFare Amount="960" CurrencyCode="RUB"/>
              <FareConstruction Amount="960" CurrencyCode="RUB" DecimalPlaces="0"/>
              <EquivFare Amount="960" CurrencyCode="RUB" DecimalPlaces="0"/>
              <Taxes>
                <Tax Amount="2150" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                <Tax Amount="2150" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                <Tax Amount="400" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRI"/>
                <Tax Amount="400" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRI"/>
                <Tax Amount="38" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                <Tax Amount="60" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                <Tax Amount="38" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI4"/>
                <Tax Amount="60" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI4"/>
                <TaxSummary Amount="4300" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                <TaxSummary Amount="800" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRI"/>
                <TaxSummary Amount="196" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                <TotalTax Amount="5296" CurrencyCode="RUB" DecimalPlaces="0"/>
              </Taxes>
              <TotalFare Amount="6256" CurrencyCode="RUB"/>
              <PenaltiesInfo>
                <Penalty Amount="0" Applicability="Before" Changeable="true" ConditionsApply="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                <Penalty Amount="3000" Applicability="After" Changeable="true" ConditionsApply="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                <Penalty Applicability="Before" Refundable="false" Type="Refund"/>
                <Penalty Applicability="After" Refundable="false" Type="Refund"/>
              </PenaltiesInfo>
              <TPA_Extensions>
                <FareComponents>
                  <FareComponent BrandID="PR" BrandName="PROMO" ProgramCode="CFFU6" ProgramDescription="U6 DOMESTIC" ProgramID="83326" ProgramSystemCode="A">
                    <Segment FlightIndex="1" LegIndex="1"/>
                    <BrandFeatureRef FeatureId="12"/>
                    <BrandFeatureRef FeatureId="14"/>
                    <BrandFeatureRef FeatureId="17"/>
                    <BrandFeatureRef FeatureId="18"/>
                    <BrandFeatureRef FeatureId="29"/>
                    <BrandFeatureRef FeatureId="30"/>
                    <BrandFeatureRef FeatureId="62"/>
                    <BrandFeatureRef FeatureId="61"/>
                    <BrandFeatureRef FeatureId="45"/>
                    <BrandFeatureRef FeatureId="39"/>
                    <BrandFeatureRef FeatureId="43"/>
                    <BrandFeatureRef FeatureId="65"/>
                    <BrandFeatureRef FeatureId="69"/>
                    <BrandFeatureRef FeatureId="75"/>
                    <BrandFeatureRef FeatureId="77"/>
                  </FareComponent>
                  <FareComponent BrandID="PR" BrandName="PROMO" ProgramCode="CFFU6" ProgramDescription="U6 DOMESTIC" ProgramID="83326" ProgramSystemCode="A">
                    <Segment FlightIndex="1" LegIndex="2"/>
                    <BrandFeatureRef FeatureId="12"/>
                    <BrandFeatureRef FeatureId="14"/>
                    <BrandFeatureRef FeatureId="17"/>
                    <BrandFeatureRef FeatureId="18"/>
                    <BrandFeatureRef FeatureId="29"/>
                    <BrandFeatureRef FeatureId="30"/>
                    <BrandFeatureRef FeatureId="62"/>
                    <BrandFeatureRef FeatureId="61"/>
                    <BrandFeatureRef FeatureId="45"/>
                    <BrandFeatureRef FeatureId="39"/>
                    <BrandFeatureRef FeatureId="43"/>
                    <BrandFeatureRef FeatureId="65"/>
                    <BrandFeatureRef FeatureId="69"/>
                    <BrandFeatureRef FeatureId="75"/>
                    <BrandFeatureRef FeatureId="77"/>
                  </FareComponent>
                </FareComponents>
                <Messages>
                  <Message AirlineCode="U6" FailCode="0" Info="NONEND" Type="N"/>
                  <Message FailCode="0" Info="EACH CNN REQUIRES ACCOMPANYING SAME CABIN ADT" Type="W"/>
                  <Message FailCode="0" Info="VALIDATING CARRIER" Type="W"/>
                  <Message FailCode="0" Info="BSP - U6" Type="W"/>
                  <Message FailCode="0" Info="GEN - U6" Type="W"/>
                  <Message FailCode="0" Info="TCH - U6" Type="W"/>
                  <Message FailCode="0" Info="CAT 15 SALES RESTRICTIONS FREE TEXT FOUND - VERIFY RULES" Type="W"/>
                </Messages>
                <BaggageInformationList>
                  <BaggageInformation AirlineCode="U6" ProvisionType="A">
                    <Segment Id="0"/>
                    <Allowance Unit="kg" Weight="10"/>
                  </BaggageInformation>
                  <BaggageInformation AirlineCode="U6" ProvisionType="A">
                    <Segment Id="1"/>
                    <Allowance Unit="kg" Weight="10"/>
                  </BaggageInformation>
                </BaggageInformationList>
              </TPA_Extensions>
            </PassengerFare>
            <Endorsements NonRefundableIndicator="true"/>
            <TPA_Extensions>
              <FareCalcLine Info="ZIA U6 AER480U6 ZIA480RUB960END"/>
            </TPA_Extensions>
            <FareInfos>
              <FareInfo>
                <FareReference>W</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="N"/>
                </TPA_Extensions>
              </FareInfo>
              <FareInfo>
                <FareReference>W</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="N"/>
                </TPA_Extensions>
              </FareInfo>
            </FareInfos>
          </PTC_FareBreakdown>
          <PTC_FareBreakdown>
            <PassengerTypeQuantity Code="INF" Quantity="1"/>
            <FareBasisCodes>
              <FareBasisCode ArrivalAirportCode="AER" AvailabilityBreak="true" BookingCode="W" DepartureAirportCode="ZIA" FareComponentBeginAirport="ZIA" FareComponentDirectionality="FROM" FareComponentEndAirport="AER" FareComponentFareRule="U6PR" FareComponentFareTariff="304" FareComponentFareType="XPN" FareComponentFareTypeBitmap="01" FareComponentVendorCode="ATP" GovCarrier="U6">WPRRT/IN</FareBasisCode>
              <FareBasisCode ArrivalAirportCode="ZIA" AvailabilityBreak="true" BookingCode="W" DepartureAirportCode="AER" FareComponentBeginAirport="AER" FareComponentDirectionality="TO" FareComponentEndAirport="ZIA" FareComponentFareRule="U6PR" FareComponentFareTariff="304" FareComponentFareType="XPN" FareComponentFareTypeBitmap="01" FareComponentVendorCode="ATP" GovCarrier="U6">WPRRT/IN</FareBasisCode>
            </FareBasisCodes>
            <PassengerFare>
              <BaseFare Amount="0" CurrencyCode="RUB"/>
              <FareConstruction Amount="0" CurrencyCode="RUB" DecimalPlaces="0"/>
              <EquivFare Amount="0" CurrencyCode="RUB" DecimalPlaces="0"/>
              <TotalFare Amount="0" CurrencyCode="RUB"/>
              <PenaltiesInfo>
                <Penalty Amount="0" Applicability="Before" Changeable="true" ConditionsApply="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                <Penalty Amount="0" Applicability="After" Changeable="true" ConditionsApply="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                <Penalty Applicability="Before" Refundable="false" Type="Refund"/>
                <Penalty Applicability="After" Refundable="false" Type="Refund"/>
              </PenaltiesInfo>
              <TPA_Extensions>
                <FareComponents>
                  <FareComponent BrandID="PR" BrandName="PROMO" ProgramCode="CFFU6" ProgramDescription="U6 DOMESTIC" ProgramID="83326" ProgramSystemCode="A">
                    <Segment FlightIndex="1" LegIndex="1"/>
                    <BrandFeatureRef FeatureId="12"/>
                    <BrandFeatureRef FeatureId="14"/>
                    <BrandFeatureRef FeatureId="17"/>
                    <BrandFeatureRef FeatureId="18"/>
                    <BrandFeatureRef FeatureId="29"/>
                    <BrandFeatureRef FeatureId="30"/>
                    <BrandFeatureRef FeatureId="62"/>
                    <BrandFeatureRef FeatureId="61"/>
                    <BrandFeatureRef FeatureId="45"/>
                    <BrandFeatureRef FeatureId="39"/>
                    <BrandFeatureRef FeatureId="43"/>
                    <BrandFeatureRef FeatureId="65"/>
                    <BrandFeatureRef FeatureId="69"/>
                    <BrandFeatureRef FeatureId="75"/>
                    <BrandFeatureRef FeatureId="77"/>
                  </FareComponent>
                  <FareComponent BrandID="PR" BrandName="PROMO" ProgramCode="CFFU6" ProgramDescription="U6 DOMESTIC" ProgramID="83326" ProgramSystemCode="A">
                    <Segment FlightIndex="1" LegIndex="2"/>
                    <BrandFeatureRef FeatureId="12"/>
                    <BrandFeatureRef FeatureId="14"/>
                    <BrandFeatureRef FeatureId="17"/>
                    <BrandFeatureRef FeatureId="18"/>
                    <BrandFeatureRef FeatureId="29"/>
                    <BrandFeatureRef FeatureId="30"/>
                    <BrandFeatureRef FeatureId="62"/>
                    <BrandFeatureRef FeatureId="61"/>
                    <BrandFeatureRef FeatureId="45"/>
                    <BrandFeatureRef FeatureId="39"/>
                    <BrandFeatureRef FeatureId="43"/>
                    <BrandFeatureRef FeatureId="65"/>
                    <BrandFeatureRef FeatureId="69"/>
                    <BrandFeatureRef FeatureId="75"/>
                    <BrandFeatureRef FeatureId="77"/>
                  </FareComponent>
                </FareComponents>
                <Messages>
                  <Message AirlineCode="U6" FailCode="0" Info="NONEND" Type="N"/>
                  <Message FailCode="0" Info="EACH INF REQUIRES ACCOMPANYING ADT PASSENGER" Type="W"/>
                  <Message FailCode="0" Info="VALIDATING CARRIER" Type="W"/>
                  <Message FailCode="0" Info="BSP - U6" Type="W"/>
                  <Message FailCode="0" Info="GEN - U6" Type="W"/>
                  <Message FailCode="0" Info="TCH - U6" Type="W"/>
                  <Message FailCode="0" Info="CAT 15 SALES RESTRICTIONS FREE TEXT FOUND - VERIFY RULES" Type="W"/>
                </Messages>
                <BaggageInformationList>
                  <BaggageInformation AirlineCode="U6" ProvisionType="A">
                    <Segment Id="0"/>
                    <Allowance Unit="kg" Weight="10"/>
                  </BaggageInformation>
                  <BaggageInformation AirlineCode="U6" ProvisionType="A">
                    <Segment Id="1"/>
                    <Allowance Unit="kg" Weight="10"/>
                  </BaggageInformation>
                </BaggageInformationList>
              </TPA_Extensions>
            </PassengerFare>
            <Endorsements NonRefundableIndicator="false"/>
            <TPA_Extensions>
              <FareCalcLine Info="ZIA U6 AER0U6 ZIA0RUB0END"/>
            </TPA_Extensions>
            <FareInfos>
              <FareInfo>
                <FareReference>W</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="N"/>
                </TPA_Extensions>
              </FareInfo>
              <FareInfo>
                <FareReference>W</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="N"/>
                </TPA_Extensions>
              </FareInfo>
            </FareInfos>
          </PTC_FareBreakdown>
        </PTC_FareBreakdowns>
        <FareInfos>
          <FareInfo>
            <FareReference>W</FareReference>
            <TPA_Extensions>
              <SeatsRemaining BelowMin="false" Number="9"/>
              <Cabin Cabin="Y"/>
              <Meal Code="N"/>
            </TPA_Extensions>
          </FareInfo>
          <FareInfo>
            <FareReference>W</FareReference>
            <TPA_Extensions>
              <SeatsRemaining BelowMin="false" Number="9"/>
              <Cabin Cabin="Y"/>
              <Meal Code="N"/>
            </TPA_Extensions>
          </FareInfo>
        </FareInfos>
        <TPA_Extensions>
          <DivideInParty Indicator="false"/>
          <AncillaryFeeGroups>
            <AncillaryFeeGroup Code="BG" Name="BAGGAGE">
              <AncillaryFeeItem Amount="2500" AncillaryTypeCode="F" BaggageID="1" Carrier="U6" Date="2020-09-01" Description="FIRST EXCESS BAG" Description1="FIRST BAG" DestinationAirport="AER" EndSegment="1" OriginAirport="ZIA" PassengerCode="ALL" StartSegment="1" Subcode="0CC"/>
              <AncillaryFeeItem Amount="2500" AncillaryTypeCode="F" BaggageID="2" Carrier="U6" Date="2020-09-01" Description="SECOND EXCESS BAG" Description1="SECOND BAG" DestinationAirport="AER" EndSegment="1" OriginAirport="ZIA" PassengerCode="ALL" StartSegment="1" Subcode="0CD"/>
              <AncillaryFeeItem Amount="2500" AncillaryTypeCode="F" BaggageID="3" Carrier="U6" Date="2020-09-01" Description="THIRD EXCESS BAG" Description1="THIRD BAG" DestinationAirport="AER" EndSegment="1" OriginAirport="ZIA" PassengerCode="ALL" StartSegment="1" Subcode="0CE"/>
              <AncillaryFeeItem Amount="2000" AncillaryTypeCode="F" BaggageID="4" Carrier="U6" Date="2020-09-01" Description="UPTO22LB 10KG BAGGAGE" Description1="UP TO 22 POUNDS/10 KILOGRAMS" DestinationAirport="AER" EndSegment="1" OriginAirport="ZIA" PassengerCode="ALL" StartSegment="1" Subcode="0CZ"/>
              <AncillaryFeeItem Amount="2000" AncillaryTypeCode="F" BaggageID="5" Carrier="U6" Date="2020-09-01" Description="EXCESS WEIGHT SPECIAL CHARGE" Description1="EXCESS WEIGHT" Description2="SPECIAL CHARGE" DestinationAirport="AER" EndSegment="1" OriginAirport="ZIA" PassengerCode="ALL" StartSegment="1" Subcode="0H6"/>
              <AncillaryFeeItem Amount="2500" AncillaryTypeCode="F" BaggageID="6" Carrier="U6" Date="2020-09-01" Description="EXTRA CARRYON BG" Description1="EXCESS SIZE" Description2="SPECIAL CHARGE" DestinationAirport="AER" EndSegment="1" OriginAirport="ZIA" PassengerCode="ALL" StartSegment="1" Subcode="0H7"/>
              <AncillaryFeeItem Amount="2500" AncillaryTypeCode="F" BaggageID="7" Carrier="U6" Date="2020-09-01" Description="CARRY ON HAND BAGGAGE" DestinationAirport="AER" EndSegment="1" OriginAirport="ZIA" PassengerCode="ALL" StartSegment="1" Subcode="0L5" Subgroup="CY"/>
              <AncillaryFeeItem Amount="2500" AncillaryTypeCode="F" BaggageID="8" Carrier="U6" Date="2020-09-08" Description="FIRST EXCESS BAG" Description1="FIRST BAG" DestinationAirport="ZIA" EndSegment="2" OriginAirport="AER" PassengerCode="ALL" StartSegment="2" Subcode="0CC"/>
              <AncillaryFeeItem Amount="2500" AncillaryTypeCode="F" BaggageID="9" Carrier="U6" Date="2020-09-08" Description="SECOND EXCESS BAG" Description1="SECOND BAG" DestinationAirport="ZIA" EndSegment="2" OriginAirport="AER" PassengerCode="ALL" StartSegment="2" Subcode="0CD"/>
              <AncillaryFeeItem Amount="2500" AncillaryTypeCode="F" BaggageID="10" Carrier="U6" Date="2020-09-08" Description="THIRD EXCESS BAG" Description1="THIRD BAG" DestinationAirport="ZIA" EndSegment="2" OriginAirport="AER" PassengerCode="ALL" StartSegment="2" Subcode="0CE"/>
              <AncillaryFeeItem Amount="2000" AncillaryTypeCode="F" BaggageID="11" Carrier="U6" Date="2020-09-08" Description="UPTO22LB 10KG BAGGAGE" Description1="UP TO 22 POUNDS/10 KILOGRAMS" DestinationAirport="ZIA" EndSegment="2" OriginAirport="AER" PassengerCode="ALL" StartSegment="2" Subcode="0CZ"/>
              <AncillaryFeeItem Amount="2000" AncillaryTypeCode="F" BaggageID="12" Carrier="U6" Date="2020-09-08" Description="EXCESS WEIGHT SPECIAL CHARGE" Description1="EXCESS WEIGHT" Description2="SPECIAL CHARGE" DestinationAirport="ZIA" EndSegment="2" OriginAirport="AER" PassengerCode="ALL" StartSegment="2" Subcode="0H6"/>
              <AncillaryFeeItem Amount="2500" AncillaryTypeCode="F" BaggageID="13" Carrier="U6" Date="2020-09-08" Description="EXTRA CARRYON BG" Description1="EXCESS SIZE" Description2="SPECIAL CHARGE" DestinationAirport="ZIA" EndSegment="2" OriginAirport="AER" PassengerCode="ALL" StartSegment="2" Subcode="0H7"/>
              <AncillaryFeeItem Amount="2500" AncillaryTypeCode="F" BaggageID="14" Carrier="U6" Date="2020-09-08" Description="CARRY ON HAND BAGGAGE" DestinationAirport="ZIA" EndSegment="2" OriginAirport="AER" PassengerCode="ALL" StartSegment="2" Subcode="0L5" Subgroup="CY"/>
            </AncillaryFeeGroup>
            <OrderStandardBag>
              <PassengerBags Code="ADT">
                <BaggageSequenceOrder BaggageID="1" StandardBag="1"/>
                <BaggageSequenceOrder BaggageID="2" StandardBag="2"/>
                <BaggageSequenceOrder BaggageID="3" StandardBag="3"/>
                <BaggageSequenceOrder BaggageID="8" StandardBag="1"/>
                <BaggageSequenceOrder BaggageID="9" StandardBag="2"/>
                <BaggageSequenceOrder BaggageID="10" StandardBag="3"/>
              </PassengerBags>
              <PassengerBags Code="CNN">
                <BaggageSequenceOrder BaggageID="1" StandardBag="1"/>
                <BaggageSequenceOrder BaggageID="2" StandardBag="2"/>
                <BaggageSequenceOrder BaggageID="3" StandardBag="3"/>
                <BaggageSequenceOrder BaggageID="8" StandardBag="1"/>
                <BaggageSequenceOrder BaggageID="9" StandardBag="2"/>
                <BaggageSequenceOrder BaggageID="10" StandardBag="3"/>
              </PassengerBags>
              <PassengerBags Code="INF">
                <BaggageSequenceOrder BaggageID="1" StandardBag="1"/>
                <BaggageSequenceOrder BaggageID="2" StandardBag="2"/>
                <BaggageSequenceOrder BaggageID="3" StandardBag="3"/>
                <BaggageSequenceOrder BaggageID="8" StandardBag="1"/>
                <BaggageSequenceOrder BaggageID="9" StandardBag="2"/>
                <BaggageSequenceOrder BaggageID="10" StandardBag="3"/>
              </PassengerBags>
            </OrderStandardBag>
          </AncillaryFeeGroups>
          <ValidatingCarrier NewVcxProcess="true" SettlementMethod="BSP">
            <Default Code="U6"/>
          </ValidatingCarrier>
          <ValidatingCarrier NewVcxProcess="true" SettlementMethod="TCH">
            <Default Code="U6"/>
          </ValidatingCarrier>
          <ValidatingCarrier NewVcxProcess="true" SettlementMethod="GEN">
            <Default Code="U6"/>
          </ValidatingCarrier>
        </TPA_Extensions>
      </AirItineraryPricingInfo>
      <TicketingInfo TicketType="eTicket" ValidInterline="Yes"/>
      <TPA_Extensions>
        <ValidatingCarrier Code="U6"/>
        <DiversitySwapper WeighedPriceAmount="14065.6"/>
      </TPA_Extensions>
    </PricedItinerary>
    <!--Другие варианты перелетов-->
  </PricedItineraries>
</OTA_AirLowFareSearchRS>
{% endxmlsec %}

---

{% xmlsec "Пример запроса (получение дополнительной информации, GIR ответ)", false %}
<OTA_AirLowFareSearchRQ ResponseType="GIR" Version="6.1.0" xmlns="http://www.opentravel.org/OTA/2003/05">
  <POS>
    <Source PseudoCityCode="9LSC">
      <RequestorID ID="1" Type="1">
        <CompanyName Code="TN"/>
      </RequestorID>
    </Source>
  </POS>
  <OriginDestinationInformation RPH="1">
    <DepartureDateTime>2020-09-01T11:00:00</DepartureDateTime>
    <OriginLocation LocationCode="MOW"/>
    <DestinationLocation LocationCode="AER"/>
  </OriginDestinationInformation>
  <OriginDestinationInformation RPH="2">
    <DepartureDateTime>2020-09-08T11:00:00</DepartureDateTime>
    <OriginLocation LocationCode="AER"/>
    <DestinationLocation LocationCode="MOW"/>
  </OriginDestinationInformation>
  <TravelPreferences ValidInterlineTicket="true">
    <CabinPref Cabin="Economy" PreferLevel="Preferred"/>
    <TPA_Extensions>
      <LongConnectTime Enable="true"/>
      <LongConnectPoints Max="3" Min="1"/>
      <KeepSameCabin Enabled="true"/>
      <ExcludeCallDirectCarriers Enabled="true"/>
      <DiversityParameters AdditionalNonStopsPercentage="100"/>
    </TPA_Extensions>
    <AncillaryFees Enable="true">
      <AncillaryFeeGroup Code="BG"/>
    </AncillaryFees>
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
    <IntelliSellTransaction>
      <RequestType Name="200ITINS"/>
    </IntelliSellTransaction>
  </TPA_Extensions>
</OTA_AirLowFareSearchRQ>
{% endxmlsec %}

{% xmlsec "Пример ответа", false %}
<GroupedItineraryResponse Version="6.1.0" xmlns="http://webservices.sabre.com/wsdl/sabreXML1.0.00/shopping/GroupedItineraryResponse" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <Message Code="TRANSACTIONID" Severity="Info" Text="1671115551806596194" Type="WORKERTHREAD"/>
  <Message Code="ASECT2LAPP00609.IDM.SGDCPROD.SABRE.COM" Severity="Info" Text="27032" Type="SERVER"/>
  <Message Code="RULEID" Severity="Info" Text="15936" Type="DRE"/>
  <Message Code="RULEID" Severity="Info" Text="24467" Type="DEFAULT"/>
  <Message Code="MSG" Severity="Info" Text="NO VALID COMBINATIONS FOUND" Type="MIP"/>
  <Message Code="PROCESS" Severity="Error" Text="No data from MIP Clients" Type="MIP"/>
  <Statistics Itineraries="294"/>
  <ScheduleDesc ETicketable="true" ElapsedTime="140" Frequency="SMTW***" ID="1" Stops="0" TotalMilesFlown="847">
    <Departure Airport="AER" City="AER" Country="RU" Time="09:45:00+03:00"/>
    <Arrival Airport="VKO" City="MOW" Country="RU" Time="12:05:00+03:00"/>
    <Carrier Disclosure="DP" Marketing="H1" MarketingFlightNumber="1537" Operating="H1" OperatingFlightNumber="1537">
      <Equipment Code="737" TypeForFirstLeg="N" TypeForLastLeg="N"/>
    </Carrier>
  </ScheduleDesc>
  <ScheduleDesc ETicketable="true" ElapsedTime="135" Frequency="SMTWTFS" ID="2" Stops="0" TotalMilesFlown="847">
    <Departure Airport="AER" City="AER" Country="RU" Time="04:25:00+03:00"/>
    <Arrival Airport="VKO" City="MOW" Country="RU" Time="06:40:00+03:00"/>
    <Carrier Disclosure="DP" Marketing="H1" MarketingFlightNumber="1435" Operating="H1" OperatingFlightNumber="1435">
      <Equipment Code="737" TypeForFirstLeg="N" TypeForLastLeg="N"/>
    </Carrier>
  </ScheduleDesc>
  <ScheduleDesc ETicketable="true" ElapsedTime="150" Frequency="**T*T**" ID="3" Stops="0" TotalMilesFlown="831">
    <Departure Airport="DME" City="MOW" Country="RU" Time="10:20:00+03:00"/>
    <Arrival Airport="AER" City="AER" Country="RU" Time="12:50:00+03:00"/>
    <Carrier Marketing="U6" MarketingFlightNumber="377" Operating="U6" OperatingFlightNumber="377">
      <Equipment Code="320" TypeForFirstLeg="N" TypeForLastLeg="N"/>
    </Carrier>
  </ScheduleDesc>
  <ScheduleDesc ETicketable="true" ElapsedTime="120" Frequency="SMTWTFS" ID="4" Stops="0" TotalMilesFlown="840">
    <Departure Airport="AER" City="AER" Country="RU" Time="16:30:00+03:00"/>
    <Arrival Airport="ZIA" City="MOW" Country="RU" Time="18:30:00+03:00"/>
    <Carrier Marketing="U6" MarketingFlightNumber="1310" Operating="U6" OperatingFlightNumber="1310">
      <Equipment Code="320" TypeForFirstLeg="N" TypeForLastLeg="N"/>
    </Carrier>
  </ScheduleDesc>
  <ScheduleDesc ETicketable="true" ElapsedTime="140" Frequency="SMTWTFS" ID="5" Stops="0" TotalMilesFlown="847">
    <Departure Airport="AER" City="AER" Country="RU" Time="08:00:00+03:00"/>
    <Arrival Airport="VKO" City="MOW" Country="RU" Time="10:20:00+03:00"/>
    <Carrier Disclosure="DP" Marketing="H1" MarketingFlightNumber="1379" Operating="H1" OperatingFlightNumber="1379">
      <Equipment Code="737" TypeForFirstLeg="N" TypeForLastLeg="N"/>
    </Carrier>
  </ScheduleDesc>
  <!--Другие рейсы-->
  <TaxDesc Amount="810" Code="YQF" Currency="RUB" Description="SERVICE FEE - CARRIER-IMPOSED FUEL" ID="1" PublishedAmount="10.00" PublishedCurrency="EUR" Station="DME"/>
  <TaxDesc Amount="270" Code="YRF" Currency="RUB" Description="SERVICE FEE - CARRIER-IMPOSED FUEL" ID="2" PublishedAmount="270" PublishedCurrency="RUB" Station="AER"/>
  <TaxDesc Amount="190" Code="YQI" Currency="RUB" Description="SERVICE FEE - CARRIER-IMPOSED MISC" ID="3" PublishedAmount="190" PublishedCurrency="RUB" Station="SVO"/>
  <TaxDesc Amount="105" Code="RI4" Country="RU" Currency="RUB" Description="TERMINAL USE CHARGE DOMESTIC ARRIVAL" ID="4" PublishedAmount="105" PublishedCurrency="RUB" Station="AER"/>
  <TaxDesc Amount="1500" Code="YQF" Currency="RUB" Description="SERVICE FEE - CARRIER-IMPOSED FUEL" ID="5" PublishedAmount="1500" PublishedCurrency="RUB" Station="SVO"/>
  <!--Другие таксы-->
  <TaxSummaryDesc Amount="450" Code="RI3" Country="RU" Currency="RUB" Description="TERMINAL USE CHARGE DOMESTIC DEPARTURE" ID="1" PublishedAmount="105" PublishedCurrency="RUB" Station="DME"/>
  <TaxSummaryDesc Amount="304" Code="RI3" Country="RU" Currency="RUB" Description="TERMINAL USE CHARGE DOMESTIC DEPARTURE" ID="2" PublishedAmount="92" PublishedCurrency="RUB" Station="SVO"/>
  <TaxSummaryDesc Amount="2960" Code="YQF" Currency="RUB" Description="SERVICE FEE - CARRIER-IMPOSED FUEL" ID="3" PublishedAmount="10.00" PublishedCurrency="EUR" Station="DME"/>
  <TaxSummaryDesc Amount="211" Code="RI3" Country="RU" Currency="RUB" Description="TERMINAL USE CHARGE DOMESTIC DEPARTURE" ID="4" PublishedAmount="38" PublishedCurrency="RUB" Station="ZIA"/>
  <TaxSummaryDesc Amount="226" Code="RI3" Country="RU" Currency="RUB" Description="TERMINAL USE CHARGE DOMESTIC DEPARTURE" ID="5" PublishedAmount="53" PublishedCurrency="RUB" Station="DME"/>
  <!--Другие таксы-->
  <BrandFeatureDesc Application="C" CommercialName="SECOND EXCESS BAG" ID="1" ServiceGroup="BG" ServiceType="C" SubCode="0CD" Vendor="ATP"/>
  <BrandFeatureDesc Application="C" CommercialName="UPGRADE AT CHECKIN TO COMFORT" ID="2" ServiceGroup="BF" ServiceType="Z" SubCode="UT2" Vendor="ATP"/>
  <BrandFeatureDesc Application="C" CommercialName="1ST FISHING EQPMT UPTO 20KG" ID="3" ServiceGroup="BG" ServiceType="C" SubCode="0L1" Vendor="ATP"/>
  <BrandFeatureDesc Application="C" CommercialName="SEAT ASSIGNMENT EXTRA SPACE" ID="4" ServiceGroup="SB" ServiceType="F" SubCode="0BV" Vendor="ATP"/>
  <BrandFeatureDesc Application="N" CommercialName="CARRY15KG 33LBUPTO 45LI 115LCM" ID="5" ServiceGroup="BG" ServiceType="C" SubCode="0MK" Vendor="ATP"/>
  <!--Другие услуги-->
  <FareComponentDesc ApplicablePricingCategories="1 4 5 8 10 12 15 16 18 19 23" Direction="EH" Directionality="FROM" FareBasisCode="APRRT/IN" FarePassengerType="INF" FareRule="U6PR" FareTariff="304" FareType="XPN" FareTypeBitmap="01" GoverningCarrier="U6" ID="1" NotValidAfter="2020-09-30" PublishedFareAmount="0" TicketDesignator="IN" VendorCode="ATP">
    <Segment Stopover="true"/>
    <Brand BrandName="PROMO" Code="PR" ProgramCode="CFFU6" ProgramDescription="U6 DOMESTIC" ProgramID="83326" ProgramSystemCode="A"/>
  </FareComponentDesc>
  <FareComponentDesc ApplicablePricingCategories="7 10 15 16 18" Direction="EH" Directionality="TO" FareAmount="3750" FareBasisCode="OLTRT" FareCurrency="RUB" FarePassengerType="ADT" FareRule="UT22" FareTariff="304" FareType="XEL" FareTypeBitmap="00" GoverningCarrier="UT" ID="2" NotValidAfter="2020-09-08" NotValidBefore="2020-09-08" PublishedFareAmount="7500" VendorCode="ATP">
    <Segment/>
    <Brand BrandName="ECONOMY MINIMUM" Code="MN" ProgramCode="BUT" ProgramDescription="BRANDED FARES UT 5" ProgramID="86060" ProgramSystemCode="B"/>
  </FareComponentDesc>
  <FareComponentDesc ApplicablePricingCategories="7 10 15 16 18 19" Direction="EH" Directionality="TO" FareAmount="2138" FareBasisCode="VLTRT/CH25" FareCurrency="RUB" FarePassengerType="CNN" FareRule="UT22" FareTariff="304" FareType="XEL" FareTypeBitmap="01" GoverningCarrier="UT" ID="3" NotValidAfter="2020-09-08" NotValidBefore="2020-09-08" PublishedFareAmount="4275" TicketDesignator="CH25" VendorCode="ATP">
    <Segment/>
    <Brand BrandName="ECONOMY MINIMUM" Code="MN" ProgramCode="BUT" ProgramDescription="BRANDED FARES UT 5" ProgramID="86060" ProgramSystemCode="B"/>
  </FareComponentDesc>
  <FareComponentDesc ApplicablePricingCategories="1 4 5 7 8 9 10 15 16 18 19 23" Direction="EH" Directionality="TO" FareAmount="3600" FareBasisCode="BLTRTCH" FareCurrency="RUB" FarePassengerType="CNN" FareRule="1040" FareTariff="304" FareType="EIP" FareTypeBitmap="01" GoverningCarrier="Y7" ID="4" NotValidAfter="2020-09-08" NotValidBefore="2020-09-08" PublishedFareAmount="7200" VendorCode="ATP">
    <Segment/>
  </FareComponentDesc>
  <FareComponentDesc ApplicablePricingCategories="10 16" Direction="EH" Directionality="TO" FareAmount="6000" FareBasisCode="TNBR" FareCurrency="RUB" FarePassengerType="ADT" FareRule="ENR1" FareTariff="304" FareType="SB" FareTypeBitmap="00" GoverningCarrier="SU" ID="5" NotValidAfter="2020-09-08" NotValidBefore="2020-09-08" PublishedFareAmount="12000" VendorCode="ATP">
    <Segment/>
    <Brand BrandName="ECONOMY LITE" Code="NB" ProgramCode="CFF1S" ProgramDescription="1S" ProgramID="85965" ProgramSystemCode="X"/>
  </FareComponentDesc>
  <!--Другие компоненты тарифов-->
  <ValidatingCarrierDesc ID="1" NewVcxProcess="true" SettlementMethod="BSP">
    <Default Code="HR"/>
  </ValidatingCarrierDesc>
  <ValidatingCarrierDesc ID="2" NewVcxProcess="true" SettlementMethod="BSP">
    <Default Code="R3"/>
  </ValidatingCarrierDesc>
  <ValidatingCarrierDesc ID="3" NewVcxProcess="true" SettlementMethod="BSP">
    <Default Code="S7"/>
  </ValidatingCarrierDesc>
  <ValidatingCarrierDesc ID="4" NewVcxProcess="true" SettlementMethod="TCH">
    <Default Code="U6"/>
  </ValidatingCarrierDesc>
  <ValidatingCarrierDesc ID="5" NewVcxProcess="true" SettlementMethod="TCH">
    <Default Code="UT"/>
  </ValidatingCarrierDesc>
  <!--Другие валидирующие перевозчики-->
  <BaggageAllowanceDesc ID="1" Pieces="0"/>
  <BaggageAllowanceDesc ID="2" Pieces="0"/>
  <BaggageAllowanceDesc ID="3" Pieces="0"/>
  <BaggageAllowanceDesc ID="4" Pieces="0"/>
  <BaggageAllowanceDesc ID="5" Pieces="0"/>
  <!--Другие нормы провоза багажа-->
  <LegDesc ElapsedTime="145" ID="1">
    <Schedule Ref="59"/>
  </LegDesc>
  <LegDesc ElapsedTime="135" ID="2">
    <Schedule Ref="60"/>
  </LegDesc>
  <LegDesc ElapsedTime="150" ID="3">
    <Schedule Ref="57"/>
  </LegDesc>
  <LegDesc ElapsedTime="145" ID="4">
    <Schedule Ref="58"/>
  </LegDesc>
  <LegDesc ElapsedTime="140" ID="5">
    <Schedule Ref="54"/>
  </LegDesc>
  <!--Другие плечи-->
  <ItineraryGroup>
    <GroupDescription>
      <LegDescription ArrivalLocation="AER" DepartureDate="2020-09-01" DepartureLocation="DME"/>
      <LegDescription ArrivalLocation="DME" DepartureDate="2020-09-08" DepartureLocation="AER"/>
    </GroupDescription>
    <Itinerary ID="1" PricingSource="ADVJR1">
      <Leg Ref="24"/>
      <Leg Ref="13"/>
      <PricingInformation BrandsOnAnyMarket="true" PricingSubsource="MIP">
        <Fare ETicketable="true" GoverningCarriers="U6 U6" LastTicketDate="2020-05-13" LastTicketTime="23:59" VITA="true" ValidatingCarrierCode="U6">
          <PassengerInfo NonRefundable="true" PassengerNumber="2" PassengerType="ADT">
            <FareComponent Ref="35">
              <Segment AvailabilityBreak="true" BookingCode="W" CabinCode="Y" MealCode="N" SeatsAvailable="9"/>
              <BrandFeature Ref="46"/>
              <BrandFeature Ref="81"/>
              <BrandFeature Ref="30"/>
              <BrandFeature Ref="64"/>
              <BrandFeature Ref="40"/>
              <BrandFeature Ref="9"/>
              <BrandFeature Ref="43"/>
              <BrandFeature Ref="5"/>
              <BrandFeature Ref="39"/>
              <BrandFeature Ref="24"/>
              <BrandFeature Ref="53"/>
              <BrandFeature Ref="47"/>
              <BrandFeature Ref="15"/>
              <BrandFeature Ref="61"/>
              <BrandFeature Ref="35"/>
            </FareComponent>
            <FareComponent Ref="20">
              <Segment AvailabilityBreak="true" BookingCode="W" CabinCode="Y" MealCode="N" SeatsAvailable="9"/>
              <BrandFeature Ref="46"/>
              <BrandFeature Ref="81"/>
              <BrandFeature Ref="30"/>
              <BrandFeature Ref="64"/>
              <BrandFeature Ref="40"/>
              <BrandFeature Ref="9"/>
              <BrandFeature Ref="43"/>
              <BrandFeature Ref="5"/>
              <BrandFeature Ref="39"/>
              <BrandFeature Ref="24"/>
              <BrandFeature Ref="53"/>
              <BrandFeature Ref="47"/>
              <BrandFeature Ref="15"/>
              <BrandFeature Ref="61"/>
              <BrandFeature Ref="35"/>
            </FareComponent>
            <Tax Ref="12"/>
            <Tax Ref="8"/>
            <Tax Ref="45"/>
            <Tax Ref="10"/>
            <Tax Ref="31"/>
            <Tax Ref="35"/>
            <Tax Ref="4"/>
            <Tax Ref="13"/>
            <TaxSummary Ref="18"/>
            <TaxSummary Ref="29"/>
            <TaxSummary Ref="1"/>
            <CurrencyConversion ExchangeRateUsed="1" From="RUB" To="RUB"/>
            <FareMessage Carrier="U6" Code="0" Info="NONEND" Type="N"/>
            <FareMessage Code="0" Info="VALIDATING CARRIER" Type="W"/>
            <FareMessage Code="0" Info="BSP - U6" Type="W"/>
            <FareMessage Code="0" Info="GEN - U6" Type="W"/>
            <FareMessage Code="0" Info="TCH - U6" Type="W"/>
            <FareMessage Code="0" Info="CAT 15 SALES RESTRICTIONS FREE TEXT FOUND - VERIFY RULES" Type="W"/>
            <PassengerTotalFare BaseFareAmount="1280" BaseFareCurrency="RUB" CommissionAmount="0" CommissionPercentage="0" ConstructionAmount="1280" ConstructionCurrency="RUB" Currency="RUB" EquivalentAmount="1280" EquivalentCurrency="RUB" ExchangeRateOne="76.8000000" TotalFare="6830" TotalTaxes="5550"/>
            <BaggageInformation AirlineCode="U6" ProvisionType="A">
              <Segment ID="0"/>
              <Allowance Ref="9"/>
            </BaggageInformation>
            <BaggageInformation AirlineCode="U6" ProvisionType="A">
              <Segment ID="1"/>
              <Allowance Ref="9"/>
            </BaggageInformation>
            <PenaltiesInfo>
              <Penalty Amount="0" Applicability="Before" Changeable="true" ConditionsApply="true" Currency="RUB" Type="Exchange"/>
              <Penalty Amount="3000" Applicability="After" Changeable="true" ConditionsApply="true" Currency="RUB" Type="Exchange"/>
              <Penalty Applicability="Before" Refundable="false" Type="Refund"/>
              <Penalty Applicability="After" Refundable="false" Type="Refund"/>
            </PenaltiesInfo>
          </PassengerInfo>
          <PassengerInfo NonRefundable="true" PassengerNumber="1" PassengerType="CNN">
            <FareComponent Ref="83">
              <Segment AvailabilityBreak="true" BookingCode="W" CabinCode="Y" MealCode="N" SeatsAvailable="9"/>
              <BrandFeature Ref="46"/>
              <BrandFeature Ref="81"/>
              <BrandFeature Ref="30"/>
              <BrandFeature Ref="64"/>
              <BrandFeature Ref="40"/>
              <BrandFeature Ref="9"/>
              <BrandFeature Ref="43"/>
              <BrandFeature Ref="5"/>
              <BrandFeature Ref="39"/>
              <BrandFeature Ref="24"/>
              <BrandFeature Ref="53"/>
              <BrandFeature Ref="47"/>
              <BrandFeature Ref="15"/>
              <BrandFeature Ref="61"/>
              <BrandFeature Ref="35"/>
            </FareComponent>
            <FareComponent Ref="92">
              <Segment AvailabilityBreak="true" BookingCode="W" CabinCode="Y" MealCode="N" SeatsAvailable="9"/>
              <BrandFeature Ref="46"/>
              <BrandFeature Ref="81"/>
              <BrandFeature Ref="30"/>
              <BrandFeature Ref="64"/>
              <BrandFeature Ref="40"/>
              <BrandFeature Ref="9"/>
              <BrandFeature Ref="43"/>
              <BrandFeature Ref="5"/>
              <BrandFeature Ref="39"/>
              <BrandFeature Ref="24"/>
              <BrandFeature Ref="53"/>
              <BrandFeature Ref="47"/>
              <BrandFeature Ref="15"/>
              <BrandFeature Ref="61"/>
              <BrandFeature Ref="35"/>
            </FareComponent>
            <Tax Ref="12"/>
            <Tax Ref="8"/>
            <Tax Ref="45"/>
            <Tax Ref="10"/>
            <Tax Ref="25"/>
            <Tax Ref="14"/>
            <Tax Ref="32"/>
            <Tax Ref="16"/>
            <TaxSummary Ref="18"/>
            <TaxSummary Ref="29"/>
            <TaxSummary Ref="5"/>
            <CurrencyConversion ExchangeRateUsed="1" From="RUB" To="RUB"/>
            <FareMessage Carrier="U6" Code="0" Info="NONEND" Type="N"/>
            <FareMessage Code="0" Info="EACH CNN REQUIRES ACCOMPANYING SAME CABIN ADT" Type="W"/>
            <FareMessage Code="0" Info="VALIDATING CARRIER" Type="W"/>
            <FareMessage Code="0" Info="BSP - U6" Type="W"/>
            <FareMessage Code="0" Info="GEN - U6" Type="W"/>
            <FareMessage Code="0" Info="TCH - U6" Type="W"/>
            <FareMessage Code="0" Info="CAT 15 SALES RESTRICTIONS FREE TEXT FOUND - VERIFY RULES" Type="W"/>
            <PassengerTotalFare BaseFareAmount="960" BaseFareCurrency="RUB" CommissionAmount="0" CommissionPercentage="0" ConstructionAmount="960" ConstructionCurrency="RUB" Currency="RUB" EquivalentAmount="960" EquivalentCurrency="RUB" ExchangeRateOne="76.8000000" TotalFare="6286" TotalTaxes="5326"/>
            <BaggageInformation AirlineCode="U6" ProvisionType="A">
              <Segment ID="0"/>
              <Allowance Ref="9"/>
            </BaggageInformation>
            <BaggageInformation AirlineCode="U6" ProvisionType="A">
              <Segment ID="1"/>
              <Allowance Ref="9"/>
            </BaggageInformation>
            <PenaltiesInfo>
              <Penalty Amount="0" Applicability="Before" Changeable="true" ConditionsApply="true" Currency="RUB" Type="Exchange"/>
              <Penalty Amount="3000" Applicability="After" Changeable="true" ConditionsApply="true" Currency="RUB" Type="Exchange"/>
              <Penalty Applicability="Before" Refundable="false" Type="Refund"/>
              <Penalty Applicability="After" Refundable="false" Type="Refund"/>
            </PenaltiesInfo>
          </PassengerInfo>
          <PassengerInfo NonRefundable="false" PassengerNumber="1" PassengerType="INF">
            <FareComponent Ref="52">
              <Segment AvailabilityBreak="true" BookingCode="W" CabinCode="Y" MealCode="N" SeatsAvailable="9"/>
              <BrandFeature Ref="46"/>
              <BrandFeature Ref="81"/>
              <BrandFeature Ref="30"/>
              <BrandFeature Ref="64"/>
              <BrandFeature Ref="40"/>
              <BrandFeature Ref="9"/>
              <BrandFeature Ref="43"/>
              <BrandFeature Ref="5"/>
              <BrandFeature Ref="39"/>
              <BrandFeature Ref="24"/>
              <BrandFeature Ref="53"/>
              <BrandFeature Ref="47"/>
              <BrandFeature Ref="15"/>
              <BrandFeature Ref="61"/>
              <BrandFeature Ref="35"/>
            </FareComponent>
            <FareComponent Ref="66">
              <Segment AvailabilityBreak="true" BookingCode="W" CabinCode="Y" MealCode="N" SeatsAvailable="9"/>
              <BrandFeature Ref="46"/>
              <BrandFeature Ref="81"/>
              <BrandFeature Ref="30"/>
              <BrandFeature Ref="64"/>
              <BrandFeature Ref="40"/>
              <BrandFeature Ref="9"/>
              <BrandFeature Ref="43"/>
              <BrandFeature Ref="5"/>
              <BrandFeature Ref="39"/>
              <BrandFeature Ref="24"/>
              <BrandFeature Ref="53"/>
              <BrandFeature Ref="47"/>
              <BrandFeature Ref="15"/>
              <BrandFeature Ref="61"/>
              <BrandFeature Ref="35"/>
            </FareComponent>
            <CurrencyConversion ExchangeRateUsed="1" From="RUB" To="RUB"/>
            <FareMessage Carrier="U6" Code="0" Info="NONEND" Type="N"/>
            <FareMessage Code="0" Info="EACH INF REQUIRES ACCOMPANYING ADT PASSENGER" Type="W"/>
            <FareMessage Code="0" Info="VALIDATING CARRIER" Type="W"/>
            <FareMessage Code="0" Info="BSP - U6" Type="W"/>
            <FareMessage Code="0" Info="GEN - U6" Type="W"/>
            <FareMessage Code="0" Info="TCH - U6" Type="W"/>
            <FareMessage Code="0" Info="CAT 15 SALES RESTRICTIONS FREE TEXT FOUND - VERIFY RULES" Type="W"/>
            <PassengerTotalFare BaseFareAmount="0" BaseFareCurrency="RUB" CommissionAmount="0" CommissionPercentage="0" ConstructionAmount="0" ConstructionCurrency="RUB" Currency="RUB" EquivalentAmount="0" EquivalentCurrency="RUB" ExchangeRateOne="76.8000000" TotalFare="0" TotalTaxes="0"/>
            <BaggageInformation AirlineCode="U6" ProvisionType="A">
              <Segment ID="0"/>
              <Allowance Ref="9"/>
            </BaggageInformation>
            <BaggageInformation AirlineCode="U6" ProvisionType="A">
              <Segment ID="1"/>
              <Allowance Ref="9"/>
            </BaggageInformation>
            <PenaltiesInfo>
              <Penalty Amount="0" Applicability="Before" Changeable="true" ConditionsApply="true" Currency="RUB" Type="Exchange"/>
              <Penalty Amount="0" Applicability="After" Changeable="true" ConditionsApply="true" Currency="RUB" Type="Exchange"/>
              <Penalty Applicability="Before" Refundable="false" Type="Refund"/>
              <Penalty Applicability="After" Refundable="false" Type="Refund"/>
            </PenaltiesInfo>
          </PassengerInfo>
          <AncillaryFeeGroup>
            <AncillaryFee Code="BG" Name="BAGGAGE">
              <Details Amount="2500" AncillaryTypeCode="F" BaggageID="1" Carrier="U6" Code="ALL" DepartureDate="2020-09-01" Description="FIRST EXCESS BAG" Description1="FIRST BAG" Destination="AER" EndSegment="1" Origin="DME" StartSegment="1" Subcode="0CC"/>
              <Details Amount="2500" AncillaryTypeCode="F" BaggageID="2" Carrier="U6" Code="ALL" DepartureDate="2020-09-01" Description="SECOND EXCESS BAG" Description1="SECOND BAG" Destination="AER" EndSegment="1" Origin="DME" StartSegment="1" Subcode="0CD"/>
              <Details Amount="2500" AncillaryTypeCode="F" BaggageID="3" Carrier="U6" Code="ALL" DepartureDate="2020-09-01" Description="THIRD EXCESS BAG" Description1="THIRD BAG" Destination="AER" EndSegment="1" Origin="DME" StartSegment="1" Subcode="0CE"/>
              <Details Amount="2000" AncillaryTypeCode="F" BaggageID="4" Carrier="U6" Code="ALL" DepartureDate="2020-09-01" Description="UPTO22LB 10KG BAGGAGE" Description1="UP TO 22 POUNDS/10 KILOGRAMS" Destination="AER" EndSegment="1" Origin="DME" StartSegment="1" Subcode="0CZ"/>
              <Details Amount="2000" AncillaryTypeCode="F" BaggageID="5" Carrier="U6" Code="ALL" DepartureDate="2020-09-01" Description="EXCESS WEIGHT SPECIAL CHARGE" Description1="EXCESS WEIGHT" Description2="SPECIAL CHARGE" Destination="AER" EndSegment="1" Origin="DME" StartSegment="1" Subcode="0H6"/>
              <Details Amount="2500" AncillaryTypeCode="F" BaggageID="6" Carrier="U6" Code="ALL" DepartureDate="2020-09-01" Description="EXTRA CARRYON BG" Description1="EXCESS SIZE" Description2="SPECIAL CHARGE" Destination="AER" EndSegment="1" Origin="DME" StartSegment="1" Subcode="0H7"/>
              <Details Amount="2500" AncillaryTypeCode="F" BaggageID="7" Carrier="U6" Code="ALL" DepartureDate="2020-09-01" Description="CARRY ON HAND BAGGAGE" Destination="AER" EndSegment="1" Origin="DME" StartSegment="1" Subcode="0L5" Subgroup="CY"/>
              <Details Amount="2500" AncillaryTypeCode="F" BaggageID="8" Carrier="U6" Code="ALL" DepartureDate="2020-09-08" Description="FIRST EXCESS BAG" Description1="FIRST BAG" Destination="DME" EndSegment="2" Origin="AER" StartSegment="2" Subcode="0CC"/>
              <Details Amount="2500" AncillaryTypeCode="F" BaggageID="9" Carrier="U6" Code="ALL" DepartureDate="2020-09-08" Description="SECOND EXCESS BAG" Description1="SECOND BAG" Destination="DME" EndSegment="2" Origin="AER" StartSegment="2" Subcode="0CD"/>
              <Details Amount="2500" AncillaryTypeCode="F" BaggageID="10" Carrier="U6" Code="ALL" DepartureDate="2020-09-08" Description="THIRD EXCESS BAG" Description1="THIRD BAG" Destination="DME" EndSegment="2" Origin="AER" StartSegment="2" Subcode="0CE"/>
              <Details Amount="2000" AncillaryTypeCode="F" BaggageID="11" Carrier="U6" Code="ALL" DepartureDate="2020-09-08" Description="UPTO22LB 10KG BAGGAGE" Description1="UP TO 22 POUNDS/10 KILOGRAMS" Destination="DME" EndSegment="2" Origin="AER" StartSegment="2" Subcode="0CZ"/>
              <Details Amount="2000" AncillaryTypeCode="F" BaggageID="12" Carrier="U6" Code="ALL" DepartureDate="2020-09-08" Description="EXCESS WEIGHT SPECIAL CHARGE" Description1="EXCESS WEIGHT" Description2="SPECIAL CHARGE" Destination="DME" EndSegment="2" Origin="AER" StartSegment="2" Subcode="0H6"/>
              <Details Amount="2500" AncillaryTypeCode="F" BaggageID="13" Carrier="U6" Code="ALL" DepartureDate="2020-09-08" Description="EXTRA CARRYON BG" Description1="EXCESS SIZE" Description2="SPECIAL CHARGE" Destination="DME" EndSegment="2" Origin="AER" StartSegment="2" Subcode="0H7"/>
              <Details Amount="2500" AncillaryTypeCode="F" BaggageID="14" Carrier="U6" Code="ALL" DepartureDate="2020-09-08" Description="CARRY ON HAND BAGGAGE" Destination="DME" EndSegment="2" Origin="AER" StartSegment="2" Subcode="0L5" Subgroup="CY"/>
            </AncillaryFee>
            <OrderStandardBag>
              <PassengerBags Code="ADT">
                <BaggageSequenceOrder BaggageRef="1" StandardBag="1"/>
                <BaggageSequenceOrder BaggageRef="2" StandardBag="2"/>
                <BaggageSequenceOrder BaggageRef="3" StandardBag="3"/>
                <BaggageSequenceOrder BaggageRef="8" StandardBag="1"/>
                <BaggageSequenceOrder BaggageRef="9" StandardBag="2"/>
                <BaggageSequenceOrder BaggageRef="10" StandardBag="3"/>
              </PassengerBags>
              <PassengerBags Code="CNN">
                <BaggageSequenceOrder BaggageRef="1" StandardBag="1"/>
                <BaggageSequenceOrder BaggageRef="2" StandardBag="2"/>
                <BaggageSequenceOrder BaggageRef="3" StandardBag="3"/>
                <BaggageSequenceOrder BaggageRef="8" StandardBag="1"/>
                <BaggageSequenceOrder BaggageRef="9" StandardBag="2"/>
                <BaggageSequenceOrder BaggageRef="10" StandardBag="3"/>
              </PassengerBags>
              <PassengerBags Code="INF">
                <BaggageSequenceOrder BaggageRef="1" StandardBag="1"/>
                <BaggageSequenceOrder BaggageRef="2" StandardBag="2"/>
                <BaggageSequenceOrder BaggageRef="3" StandardBag="3"/>
                <BaggageSequenceOrder BaggageRef="8" StandardBag="1"/>
                <BaggageSequenceOrder BaggageRef="9" StandardBag="2"/>
                <BaggageSequenceOrder BaggageRef="10" StandardBag="3"/>
              </PassengerBags>
            </OrderStandardBag>
          </AncillaryFeeGroup>
          <TotalFare BaseFareAmount="3520" BaseFareCurrency="RUB" ConstructionAmount="3520" ConstructionCurrency="RUB" Currency="RUB" EquivalentAmount="3520" EquivalentCurrency="RUB" TotalPrice="19946" TotalTaxes="16426"/>
          <ValidatingCarrier Ref="12"/>
          <ValidatingCarrier Ref="4"/>
          <ValidatingCarrier Ref="6"/>
        </Fare>
      </PricingInformation>
      <DiversitySwapper WeighedPrice="13890.964"/>
    </Itinerary>
    <!--Другие варианты перелетов-->
  </ItineraryGroup>
  <!--Другие маршруты-->
</GroupedItineraryResponse>
{% endxmlsec %}

---

{% xmlsec "Пример запроса (получение расчетов стоимости по всем доступным брендам, OTA ответ)", false %}
<OTA_AirLowFareSearchRQ ResponseType="OTA" Version="6.1.0" xmlns="http://www.opentravel.org/OTA/2003/05">
  <POS>
    <Source PseudoCityCode="9LSC">
      <RequestorID ID="1" Type="1">
        <CompanyName Code="TN"/>
      </RequestorID>
    </Source>
  </POS>
  <OriginDestinationInformation RPH="1">
    <DepartureDateTime>2020-09-01T11:00:00</DepartureDateTime>
    <OriginLocation LocationCode="MOW"/>
    <DestinationLocation LocationCode="AER"/>
  </OriginDestinationInformation>
  <OriginDestinationInformation RPH="2">
    <DepartureDateTime>2020-09-08T11:00:00</DepartureDateTime>
    <OriginLocation LocationCode="AER"/>
    <DestinationLocation LocationCode="MOW"/>
  </OriginDestinationInformation>
  <TravelPreferences ValidInterlineTicket="true">
    <CabinPref Cabin="Economy" PreferLevel="Preferred"/>
    <TPA_Extensions>
      <LongConnectTime Enable="true"/>
      <LongConnectPoints Max="3" Min="1"/>
      <KeepSameCabin Enabled="true"/>
      <ExcludeCallDirectCarriers Enabled="true"/>
      <DiversityParameters AdditionalNonStopsPercentage="100"/>
    </TPA_Extensions>
    <AncillaryFees Enable="true">
      <AncillaryFeeGroup Code="BG"/>
    </AncillaryFees>
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
        <BrandedFareIndicators ItinParityBrandlessLeg="true" ItinParityFallbackMode="LegParity" MultipleBrandedFares="true" ParityMode="Itin" ReturnBrandAncillaries="true"/>
      </TPA_Extensions>
    </PriceRequestInformation>
  </TravelerInfoSummary>
  <TPA_Extensions>
    <IntelliSellTransaction>
      <RequestType Name="200ITINS"/>
    </IntelliSellTransaction>
  </TPA_Extensions>
</OTA_AirLowFareSearchRQ>
{% endxmlsec %}

{% xmlsec "Пример ответа", false %}
<OTA_AirLowFareSearchRS AvailableItinCount="0" BrandedOneWayItinCount="0" DepartedItinCount="0" PricedItinCount="290" SimpleOneWayItinCount="0" SoldOutItinCount="0" Version="6.1.0" xmlns="http://www.opentravel.org/OTA/2003/05" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <Success/>
  <Warnings>
    <Warning Code="TRANSACTIONID" MessageClass="I" ShortText="7552310489954407846" Type="WORKERTHREAD"/>
    <Warning Code="ASE002LPSPILA8F.IDM.SGDCPROD.SABRE.COM" MessageClass="I" ShortText="27036" Type="SERVER"/>
    <Warning Code="RULEID" MessageClass="I" ShortText="15936" Type="DRE"/>
    <Warning Code="RULEID" MessageClass="I" ShortText="24467" Type="DEFAULT"/>
  </Warnings>
  <BrandFeatures>
    <BrandFeature Application="F" CommercialName="BASIC SEAT" Id="1" ServiceGroup="BF" ServiceType="Z" SubCode="050" Vendor="ATP"/>
    <BrandFeature Application="F" CommercialName="SEAT SELECTION DURING CHECK IN" Id="2" ServiceGroup="BF" ServiceType="Z" SubCode="050" Vendor="ATP"/>
    <BrandFeature Application="C" CommercialName="SEAT SELECTION DURING CHECK IN" Id="3" ServiceGroup="BF" ServiceType="Z" SubCode="050" Vendor="ATP"/>
    <BrandFeature Application="C" CommercialName="BASIC SEAT" Id="4" ServiceGroup="BF" ServiceType="Z" SubCode="050" Vendor="ATP"/>
    <BrandFeature Application="N" CommercialName="REFUNDABLE TICKET" Id="5" ServiceGroup="BF" ServiceType="Z" SubCode="056" Vendor="ATP"/>
    <!--Другие услуги-->
  </BrandFeatures>
  <PricedItineraries>
    <PricedItinerary SequenceNumber="1">
      <AirItinerary DirectionInd="Return">
        <OriginDestinationOptions>
          <OriginDestinationOption ArrivalCountry="RU" DepartureCountry="RU" ElapsedTime="140">
            <FlightSegment ArrivalDateTime="2020-09-01T15:35:00" DepartureDateTime="2020-09-01T13:15:00" ElapsedTime="140" FlightNumber="1309" ResBookDesigCode="W" StopQuantity="0">
              <DepartureAirport LocationCode="ZIA"/>
              <ArrivalAirport LocationCode="AER"/>
              <OperatingAirline Code="U6" FlightNumber="1309"/>
              <Equipment AirEquipType="320"/>
              <MarketingAirline Code="U6"/>
              <MarriageGrp>O</MarriageGrp>
              <DepartureTimeZone GMTOffset="3"/>
              <ArrivalTimeZone GMTOffset="3"/>
              <TPA_Extensions>
                <eTicket Ind="true"/>
                <Mileage Amount="840"/>
              </TPA_Extensions>
            </FlightSegment>
          </OriginDestinationOption>
          <OriginDestinationOption ArrivalCountry="RU" DepartureCountry="RU" ElapsedTime="145">
            <FlightSegment ArrivalDateTime="2020-09-09T00:45:00" DepartureDateTime="2020-09-08T22:20:00" ElapsedTime="145" FlightNumber="308" ResBookDesigCode="W" StopQuantity="0">
              <DepartureAirport LocationCode="AER"/>
              <ArrivalAirport LocationCode="ZIA"/>
              <OperatingAirline Code="U6" FlightNumber="308"/>
              <Equipment AirEquipType="320"/>
              <MarketingAirline Code="U6"/>
              <MarriageGrp>O</MarriageGrp>
              <DepartureTimeZone GMTOffset="3"/>
              <ArrivalTimeZone GMTOffset="3"/>
              <TPA_Extensions>
                <eTicket Ind="true"/>
                <Mileage Amount="840"/>
              </TPA_Extensions>
            </FlightSegment>
          </OriginDestinationOption>
        </OriginDestinationOptions>
      </AirItinerary>
      <AirItineraryPricingInfo FareReturned="true" LastTicketDate="2020-05-13" LastTicketTime="23:59" PricingSource="ADVJR1" PricingSubSource="MIP">
        <ItinTotalFare>
          <BaseFare Amount="3520" CurrencyCode="RUB" DecimalPlaces="0"/>
          <FareConstruction Amount="3520" CurrencyCode="RUB" DecimalPlaces="0"/>
          <EquivFare Amount="3520" CurrencyCode="RUB" DecimalPlaces="0"/>
          <Taxes>
            <Tax Amount="16276" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="TOTALTAX"/>
          </Taxes>
          <TotalFare Amount="19796" CurrencyCode="RUB" DecimalPlaces="0"/>
        </ItinTotalFare>
        <PTC_FareBreakdowns>
          <PTC_FareBreakdown>
            <PassengerTypeQuantity Code="ADT" Quantity="2"/>
            <FareBasisCodes>
              <FareBasisCode ArrivalAirportCode="AER" AvailabilityBreak="true" BookingCode="W" DepartureAirportCode="ZIA" FareComponentBeginAirport="ZIA" FareComponentDirectionality="FROM" FareComponentEndAirport="AER" FareComponentFareRule="U6PR" FareComponentFareTariff="304" FareComponentFareType="XPN" FareComponentFareTypeBitmap="00" FareComponentVendorCode="ATP" GovCarrier="U6">WPRRT</FareBasisCode>
              <FareBasisCode ArrivalAirportCode="ZIA" AvailabilityBreak="true" BookingCode="W" DepartureAirportCode="AER" FareComponentBeginAirport="AER" FareComponentDirectionality="TO" FareComponentEndAirport="ZIA" FareComponentFareRule="U6PR" FareComponentFareTariff="304" FareComponentFareType="XPN" FareComponentFareTypeBitmap="00" FareComponentVendorCode="ATP" GovCarrier="U6">WPRRT</FareBasisCode>
            </FareBasisCodes>
            <PassengerFare>
              <BaseFare Amount="1280" CurrencyCode="RUB"/>
              <FareConstruction Amount="1280" CurrencyCode="RUB" DecimalPlaces="0"/>
              <EquivFare Amount="1280" CurrencyCode="RUB" DecimalPlaces="0"/>
              <Taxes>
                <Tax Amount="2150" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                <Tax Amount="2150" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                <Tax Amount="400" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRI"/>
                <Tax Amount="400" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRI"/>
                <Tax Amount="75" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                <Tax Amount="120" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                <Tax Amount="75" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI4"/>
                <Tax Amount="120" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI4"/>
                <TaxSummary Amount="4300" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                <TaxSummary Amount="800" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRI"/>
                <TaxSummary Amount="390" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                <TotalTax Amount="5490" CurrencyCode="RUB" DecimalPlaces="0"/>
              </Taxes>
              <TotalFare Amount="6770" CurrencyCode="RUB"/>
              <PenaltiesInfo>
                <Penalty Amount="0" Applicability="Before" Changeable="true" ConditionsApply="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                <Penalty Amount="3000" Applicability="After" Changeable="true" ConditionsApply="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                <Penalty Applicability="Before" Refundable="false" Type="Refund"/>
                <Penalty Applicability="After" Refundable="false" Type="Refund"/>
              </PenaltiesInfo>
              <TPA_Extensions>
                <FareComponents>
                  <FareComponent BrandID="PR" BrandName="PROMO" ProgramCode="CFFU6" ProgramDescription="U6 DOMESTIC" ProgramID="83326" ProgramSystemCode="A">
                    <Segment FlightIndex="1" LegIndex="1"/>
                    <BrandFeatureRef FeatureId="14"/>
                    <BrandFeatureRef FeatureId="17"/>
                    <BrandFeatureRef FeatureId="19"/>
                    <BrandFeatureRef FeatureId="21"/>
                    <BrandFeatureRef FeatureId="36"/>
                    <BrandFeatureRef FeatureId="37"/>
                    <BrandFeatureRef FeatureId="86"/>
                    <BrandFeatureRef FeatureId="85"/>
                    <BrandFeatureRef FeatureId="59"/>
                    <BrandFeatureRef FeatureId="53"/>
                    <BrandFeatureRef FeatureId="55"/>
                    <BrandFeatureRef FeatureId="91"/>
                    <BrandFeatureRef FeatureId="94"/>
                    <BrandFeatureRef FeatureId="99"/>
                    <BrandFeatureRef FeatureId="101"/>
                  </FareComponent>
                  <FareComponent BrandID="PR" BrandName="PROMO" ProgramCode="CFFU6" ProgramDescription="U6 DOMESTIC" ProgramID="83326" ProgramSystemCode="A">
                    <Segment FlightIndex="1" LegIndex="2"/>
                    <BrandFeatureRef FeatureId="14"/>
                    <BrandFeatureRef FeatureId="17"/>
                    <BrandFeatureRef FeatureId="19"/>
                    <BrandFeatureRef FeatureId="21"/>
                    <BrandFeatureRef FeatureId="36"/>
                    <BrandFeatureRef FeatureId="37"/>
                    <BrandFeatureRef FeatureId="86"/>
                    <BrandFeatureRef FeatureId="85"/>
                    <BrandFeatureRef FeatureId="59"/>
                    <BrandFeatureRef FeatureId="53"/>
                    <BrandFeatureRef FeatureId="55"/>
                    <BrandFeatureRef FeatureId="91"/>
                    <BrandFeatureRef FeatureId="94"/>
                    <BrandFeatureRef FeatureId="99"/>
                    <BrandFeatureRef FeatureId="101"/>
                  </FareComponent>
                </FareComponents>
                <Messages>
                  <Message AirlineCode="U6" FailCode="0" Info="NONEND" Type="N"/>
                  <Message FailCode="0" Info="VALIDATING CARRIER" Type="W"/>
                  <Message FailCode="0" Info="BSP - U6" Type="W"/>
                  <Message FailCode="0" Info="GEN - U6" Type="W"/>
                  <Message FailCode="0" Info="TCH - U6" Type="W"/>
                  <Message FailCode="0" Info="CAT 15 SALES RESTRICTIONS FREE TEXT FOUND - VERIFY RULES" Type="W"/>
                </Messages>
                <BaggageInformationList>
                  <BaggageInformation AirlineCode="U6" ProvisionType="A">
                    <Segment Id="0"/>
                    <Allowance Unit="kg" Weight="10"/>
                  </BaggageInformation>
                  <BaggageInformation AirlineCode="U6" ProvisionType="A">
                    <Segment Id="1"/>
                    <Allowance Unit="kg" Weight="10"/>
                  </BaggageInformation>
                </BaggageInformationList>
              </TPA_Extensions>
            </PassengerFare>
            <Endorsements NonRefundableIndicator="true"/>
            <TPA_Extensions>
              <FareCalcLine Info="ZIA U6 AER640U6 ZIA640RUB1280END"/>
            </TPA_Extensions>
            <FareInfos>
              <FareInfo>
                <FareReference>W</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="N"/>
                </TPA_Extensions>
              </FareInfo>
              <FareInfo>
                <FareReference>W</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="N"/>
                </TPA_Extensions>
              </FareInfo>
            </FareInfos>
          </PTC_FareBreakdown>
          <PTC_FareBreakdown>
            <PassengerTypeQuantity Code="CNN" Quantity="1"/>
            <FareBasisCodes>
              <FareBasisCode ArrivalAirportCode="AER" AvailabilityBreak="true" BookingCode="W" DepartureAirportCode="ZIA" FareComponentBeginAirport="ZIA" FareComponentDirectionality="FROM" FareComponentEndAirport="AER" FareComponentFareRule="U6PR" FareComponentFareTariff="304" FareComponentFareType="XPN" FareComponentFareTypeBitmap="01" FareComponentVendorCode="ATP" GovCarrier="U6">WPRRT/CH25</FareBasisCode>
              <FareBasisCode ArrivalAirportCode="ZIA" AvailabilityBreak="true" BookingCode="W" DepartureAirportCode="AER" FareComponentBeginAirport="AER" FareComponentDirectionality="TO" FareComponentEndAirport="ZIA" FareComponentFareRule="U6PR" FareComponentFareTariff="304" FareComponentFareType="XPN" FareComponentFareTypeBitmap="01" FareComponentVendorCode="ATP" GovCarrier="U6">WPRRT/CH25</FareBasisCode>
            </FareBasisCodes>
            <PassengerFare>
              <BaseFare Amount="960" CurrencyCode="RUB"/>
              <FareConstruction Amount="960" CurrencyCode="RUB" DecimalPlaces="0"/>
              <EquivFare Amount="960" CurrencyCode="RUB" DecimalPlaces="0"/>
              <Taxes>
                <Tax Amount="2150" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                <Tax Amount="2150" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                <Tax Amount="400" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRI"/>
                <Tax Amount="400" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRI"/>
                <Tax Amount="38" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                <Tax Amount="60" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                <Tax Amount="38" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI4"/>
                <Tax Amount="60" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI4"/>
                <TaxSummary Amount="4300" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                <TaxSummary Amount="800" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRI"/>
                <TaxSummary Amount="196" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                <TotalTax Amount="5296" CurrencyCode="RUB" DecimalPlaces="0"/>
              </Taxes>
              <TotalFare Amount="6256" CurrencyCode="RUB"/>
              <PenaltiesInfo>
                <Penalty Amount="0" Applicability="Before" Changeable="true" ConditionsApply="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                <Penalty Amount="3000" Applicability="After" Changeable="true" ConditionsApply="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                <Penalty Applicability="Before" Refundable="false" Type="Refund"/>
                <Penalty Applicability="After" Refundable="false" Type="Refund"/>
              </PenaltiesInfo>
              <TPA_Extensions>
                <FareComponents>
                  <FareComponent BrandID="PR" BrandName="PROMO" ProgramCode="CFFU6" ProgramDescription="U6 DOMESTIC" ProgramID="83326" ProgramSystemCode="A">
                    <Segment FlightIndex="1" LegIndex="1"/>
                    <BrandFeatureRef FeatureId="14"/>
                    <BrandFeatureRef FeatureId="17"/>
                    <BrandFeatureRef FeatureId="19"/>
                    <BrandFeatureRef FeatureId="21"/>
                    <BrandFeatureRef FeatureId="36"/>
                    <BrandFeatureRef FeatureId="37"/>
                    <BrandFeatureRef FeatureId="86"/>
                    <BrandFeatureRef FeatureId="85"/>
                    <BrandFeatureRef FeatureId="59"/>
                    <BrandFeatureRef FeatureId="53"/>
                    <BrandFeatureRef FeatureId="55"/>
                    <BrandFeatureRef FeatureId="91"/>
                    <BrandFeatureRef FeatureId="94"/>
                    <BrandFeatureRef FeatureId="99"/>
                    <BrandFeatureRef FeatureId="101"/>
                  </FareComponent>
                  <FareComponent BrandID="PR" BrandName="PROMO" ProgramCode="CFFU6" ProgramDescription="U6 DOMESTIC" ProgramID="83326" ProgramSystemCode="A">
                    <Segment FlightIndex="1" LegIndex="2"/>
                    <BrandFeatureRef FeatureId="14"/>
                    <BrandFeatureRef FeatureId="17"/>
                    <BrandFeatureRef FeatureId="19"/>
                    <BrandFeatureRef FeatureId="21"/>
                    <BrandFeatureRef FeatureId="36"/>
                    <BrandFeatureRef FeatureId="37"/>
                    <BrandFeatureRef FeatureId="86"/>
                    <BrandFeatureRef FeatureId="85"/>
                    <BrandFeatureRef FeatureId="59"/>
                    <BrandFeatureRef FeatureId="53"/>
                    <BrandFeatureRef FeatureId="55"/>
                    <BrandFeatureRef FeatureId="91"/>
                    <BrandFeatureRef FeatureId="94"/>
                    <BrandFeatureRef FeatureId="99"/>
                    <BrandFeatureRef FeatureId="101"/>
                  </FareComponent>
                </FareComponents>
                <Messages>
                  <Message AirlineCode="U6" FailCode="0" Info="NONEND" Type="N"/>
                  <Message FailCode="0" Info="EACH CNN REQUIRES ACCOMPANYING SAME CABIN ADT" Type="W"/>
                  <Message FailCode="0" Info="VALIDATING CARRIER" Type="W"/>
                  <Message FailCode="0" Info="BSP - U6" Type="W"/>
                  <Message FailCode="0" Info="GEN - U6" Type="W"/>
                  <Message FailCode="0" Info="TCH - U6" Type="W"/>
                  <Message FailCode="0" Info="CAT 15 SALES RESTRICTIONS FREE TEXT FOUND - VERIFY RULES" Type="W"/>
                </Messages>
                <BaggageInformationList>
                  <BaggageInformation AirlineCode="U6" ProvisionType="A">
                    <Segment Id="0"/>
                    <Allowance Unit="kg" Weight="10"/>
                  </BaggageInformation>
                  <BaggageInformation AirlineCode="U6" ProvisionType="A">
                    <Segment Id="1"/>
                    <Allowance Unit="kg" Weight="10"/>
                  </BaggageInformation>
                </BaggageInformationList>
              </TPA_Extensions>
            </PassengerFare>
            <Endorsements NonRefundableIndicator="true"/>
            <TPA_Extensions>
              <FareCalcLine Info="ZIA U6 AER480U6 ZIA480RUB960END"/>
            </TPA_Extensions>
            <FareInfos>
              <FareInfo>
                <FareReference>W</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="N"/>
                </TPA_Extensions>
              </FareInfo>
              <FareInfo>
                <FareReference>W</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="N"/>
                </TPA_Extensions>
              </FareInfo>
            </FareInfos>
          </PTC_FareBreakdown>
          <PTC_FareBreakdown>
            <PassengerTypeQuantity Code="INF" Quantity="1"/>
            <FareBasisCodes>
              <FareBasisCode ArrivalAirportCode="AER" AvailabilityBreak="true" BookingCode="W" DepartureAirportCode="ZIA" FareComponentBeginAirport="ZIA" FareComponentDirectionality="FROM" FareComponentEndAirport="AER" FareComponentFareRule="U6PR" FareComponentFareTariff="304" FareComponentFareType="XPN" FareComponentFareTypeBitmap="01" FareComponentVendorCode="ATP" GovCarrier="U6">WPRRT/IN</FareBasisCode>
              <FareBasisCode ArrivalAirportCode="ZIA" AvailabilityBreak="true" BookingCode="W" DepartureAirportCode="AER" FareComponentBeginAirport="AER" FareComponentDirectionality="TO" FareComponentEndAirport="ZIA" FareComponentFareRule="U6PR" FareComponentFareTariff="304" FareComponentFareType="XPN" FareComponentFareTypeBitmap="01" FareComponentVendorCode="ATP" GovCarrier="U6">WPRRT/IN</FareBasisCode>
            </FareBasisCodes>
            <PassengerFare>
              <BaseFare Amount="0" CurrencyCode="RUB"/>
              <FareConstruction Amount="0" CurrencyCode="RUB" DecimalPlaces="0"/>
              <EquivFare Amount="0" CurrencyCode="RUB" DecimalPlaces="0"/>
              <TotalFare Amount="0" CurrencyCode="RUB"/>
              <PenaltiesInfo>
                <Penalty Amount="0" Applicability="Before" Changeable="true" ConditionsApply="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                <Penalty Amount="0" Applicability="After" Changeable="true" ConditionsApply="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                <Penalty Applicability="Before" Refundable="false" Type="Refund"/>
                <Penalty Applicability="After" Refundable="false" Type="Refund"/>
              </PenaltiesInfo>
              <TPA_Extensions>
                <FareComponents>
                  <FareComponent BrandID="PR" BrandName="PROMO" ProgramCode="CFFU6" ProgramDescription="U6 DOMESTIC" ProgramID="83326" ProgramSystemCode="A">
                    <Segment FlightIndex="1" LegIndex="1"/>
                    <BrandFeatureRef FeatureId="14"/>
                    <BrandFeatureRef FeatureId="17"/>
                    <BrandFeatureRef FeatureId="19"/>
                    <BrandFeatureRef FeatureId="21"/>
                    <BrandFeatureRef FeatureId="36"/>
                    <BrandFeatureRef FeatureId="37"/>
                    <BrandFeatureRef FeatureId="86"/>
                    <BrandFeatureRef FeatureId="85"/>
                    <BrandFeatureRef FeatureId="59"/>
                    <BrandFeatureRef FeatureId="53"/>
                    <BrandFeatureRef FeatureId="55"/>
                    <BrandFeatureRef FeatureId="91"/>
                    <BrandFeatureRef FeatureId="94"/>
                    <BrandFeatureRef FeatureId="99"/>
                    <BrandFeatureRef FeatureId="101"/>
                  </FareComponent>
                  <FareComponent BrandID="PR" BrandName="PROMO" ProgramCode="CFFU6" ProgramDescription="U6 DOMESTIC" ProgramID="83326" ProgramSystemCode="A">
                    <Segment FlightIndex="1" LegIndex="2"/>
                    <BrandFeatureRef FeatureId="14"/>
                    <BrandFeatureRef FeatureId="17"/>
                    <BrandFeatureRef FeatureId="19"/>
                    <BrandFeatureRef FeatureId="21"/>
                    <BrandFeatureRef FeatureId="36"/>
                    <BrandFeatureRef FeatureId="37"/>
                    <BrandFeatureRef FeatureId="86"/>
                    <BrandFeatureRef FeatureId="85"/>
                    <BrandFeatureRef FeatureId="59"/>
                    <BrandFeatureRef FeatureId="53"/>
                    <BrandFeatureRef FeatureId="55"/>
                    <BrandFeatureRef FeatureId="91"/>
                    <BrandFeatureRef FeatureId="94"/>
                    <BrandFeatureRef FeatureId="99"/>
                    <BrandFeatureRef FeatureId="101"/>
                  </FareComponent>
                </FareComponents>
                <Messages>
                  <Message AirlineCode="U6" FailCode="0" Info="NONEND" Type="N"/>
                  <Message FailCode="0" Info="EACH INF REQUIRES ACCOMPANYING ADT PASSENGER" Type="W"/>
                  <Message FailCode="0" Info="VALIDATING CARRIER" Type="W"/>
                  <Message FailCode="0" Info="BSP - U6" Type="W"/>
                  <Message FailCode="0" Info="GEN - U6" Type="W"/>
                  <Message FailCode="0" Info="TCH - U6" Type="W"/>
                  <Message FailCode="0" Info="CAT 15 SALES RESTRICTIONS FREE TEXT FOUND - VERIFY RULES" Type="W"/>
                </Messages>
                <BaggageInformationList>
                  <BaggageInformation AirlineCode="U6" ProvisionType="A">
                    <Segment Id="0"/>
                    <Allowance Unit="kg" Weight="10"/>
                  </BaggageInformation>
                  <BaggageInformation AirlineCode="U6" ProvisionType="A">
                    <Segment Id="1"/>
                    <Allowance Unit="kg" Weight="10"/>
                  </BaggageInformation>
                </BaggageInformationList>
              </TPA_Extensions>
            </PassengerFare>
            <Endorsements NonRefundableIndicator="false"/>
            <TPA_Extensions>
              <FareCalcLine Info="ZIA U6 AER0U6 ZIA0RUB0END"/>
            </TPA_Extensions>
            <FareInfos>
              <FareInfo>
                <FareReference>W</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="N"/>
                </TPA_Extensions>
              </FareInfo>
              <FareInfo>
                <FareReference>W</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="N"/>
                </TPA_Extensions>
              </FareInfo>
            </FareInfos>
          </PTC_FareBreakdown>
        </PTC_FareBreakdowns>
        <FareInfos>
          <FareInfo>
            <FareReference>W</FareReference>
            <TPA_Extensions>
              <SeatsRemaining BelowMin="false" Number="9"/>
              <Cabin Cabin="Y"/>
              <Meal Code="N"/>
            </TPA_Extensions>
          </FareInfo>
          <FareInfo>
            <FareReference>W</FareReference>
            <TPA_Extensions>
              <SeatsRemaining BelowMin="false" Number="9"/>
              <Cabin Cabin="Y"/>
              <Meal Code="N"/>
            </TPA_Extensions>
          </FareInfo>
        </FareInfos>
        <TPA_Extensions>
          <DivideInParty Indicator="false"/>
          <AncillaryFeeGroups Message="ADDTL AIR EXTRAS APPLY - REFINE REQUEST">
            <AncillaryFeeGroup Code="BG" Name="BAGGAGE">
              <AncillaryFeeItem Amount="2000" AncillaryTypeCode="F" BaggageID="1" Carrier="U6" Date="2020-09-01" Description="FIRST EXCESS BAG" Description1="FIRST BAG" DestinationAirport="AER" EndSegment="1" OriginAirport="ZIA" PassengerCode="ADT" StartSegment="1" Subcode="0CC"/>
              <AncillaryFeeItem Amount="2500" AncillaryTypeCode="F" BaggageID="2" Carrier="U6" Date="2020-09-01" Description="FIRST EXCESS BAG" Description1="FIRST BAG" DestinationAirport="AER" EndSegment="1" OriginAirport="ZIA" PassengerCode="ALL" StartSegment="1" Subcode="0CC"/>
              <AncillaryFeeItem Amount="2000" AncillaryTypeCode="F" BaggageID="3" Carrier="U6" Date="2020-09-01" Description="SECOND EXCESS BAG" Description1="SECOND BAG" DestinationAirport="AER" EndSegment="1" OriginAirport="ZIA" PassengerCode="ADT" StartSegment="1" Subcode="0CD"/>
              <AncillaryFeeItem Amount="2500" AncillaryTypeCode="F" BaggageID="4" Carrier="U6" Date="2020-09-01" Description="SECOND EXCESS BAG" Description1="SECOND BAG" DestinationAirport="AER" EndSegment="1" OriginAirport="ZIA" PassengerCode="ALL" StartSegment="1" Subcode="0CD"/>
              <AncillaryFeeItem Amount="2000" AncillaryTypeCode="F" BaggageID="5" Carrier="U6" Date="2020-09-01" Description="THIRD EXCESS BAG" Description1="THIRD BAG" DestinationAirport="AER" EndSegment="1" OriginAirport="ZIA" PassengerCode="ADT" StartSegment="1" Subcode="0CE"/>
              <AncillaryFeeItem Amount="2500" AncillaryTypeCode="F" BaggageID="6" Carrier="U6" Date="2020-09-01" Description="THIRD EXCESS BAG" Description1="THIRD BAG" DestinationAirport="AER" EndSegment="1" OriginAirport="ZIA" PassengerCode="ALL" StartSegment="1" Subcode="0CE"/>
              <AncillaryFeeItem Amount="2000" AncillaryTypeCode="F" BaggageID="7" Carrier="U6" Date="2020-09-01" Description="UPTO22LB 10KG BAGGAGE" Description1="UP TO 22 POUNDS/10 KILOGRAMS" DestinationAirport="AER" EndSegment="1" OriginAirport="ZIA" PassengerCode="ALL" StartSegment="1" Subcode="0CZ"/>
              <AncillaryFeeItem Amount="2000" AncillaryTypeCode="F" BaggageID="8" Carrier="U6" Date="2020-09-01" Description="EXCESS WEIGHT SPECIAL CHARGE" Description1="EXCESS WEIGHT" Description2="SPECIAL CHARGE" DestinationAirport="AER" EndSegment="1" OriginAirport="ZIA" PassengerCode="ALL" StartSegment="1" Subcode="0H6"/>
              <AncillaryFeeItem Amount="2500" AncillaryTypeCode="F" BaggageID="9" Carrier="U6" Date="2020-09-01" Description="EXTRA CARRYON BG" Description1="EXCESS SIZE" Description2="SPECIAL CHARGE" DestinationAirport="AER" EndSegment="1" OriginAirport="ZIA" PassengerCode="ALL" StartSegment="1" Subcode="0H7"/>
              <AncillaryFeeItem Amount="2500" AncillaryTypeCode="F" BaggageID="10" Carrier="U6" Date="2020-09-01" Description="CARRY ON HAND BAGGAGE" DestinationAirport="AER" EndSegment="1" OriginAirport="ZIA" PassengerCode="ALL" StartSegment="1" Subcode="0L5" Subgroup="CY"/>
              <AncillaryFeeItem Amount="2000" AncillaryTypeCode="F" BaggageID="11" Carrier="U6" Date="2020-09-08" Description="FIRST EXCESS BAG" Description1="FIRST BAG" DestinationAirport="ZIA" EndSegment="2" OriginAirport="AER" PassengerCode="ADT" StartSegment="2" Subcode="0CC"/>
              <AncillaryFeeItem Amount="2500" AncillaryTypeCode="F" BaggageID="12" Carrier="U6" Date="2020-09-08" Description="FIRST EXCESS BAG" Description1="FIRST BAG" DestinationAirport="ZIA" EndSegment="2" OriginAirport="AER" PassengerCode="ALL" StartSegment="2" Subcode="0CC"/>
              <AncillaryFeeItem Amount="2500" AncillaryTypeCode="F" BaggageID="13" Carrier="U6" Date="2020-09-08" Description="SECOND EXCESS BAG" Description1="SECOND BAG" DestinationAirport="ZIA" EndSegment="2" OriginAirport="AER" PassengerCode="ALL" StartSegment="2" Subcode="0CD"/>
              <AncillaryFeeItem Amount="2500" AncillaryTypeCode="F" BaggageID="14" Carrier="U6" Date="2020-09-08" Description="THIRD EXCESS BAG" Description1="THIRD BAG" DestinationAirport="ZIA" EndSegment="2" OriginAirport="AER" PassengerCode="ALL" StartSegment="2" Subcode="0CE"/>
              <AncillaryFeeItem Amount="2000" AncillaryTypeCode="F" BaggageID="15" Carrier="U6" Date="2020-09-08" Description="UPTO22LB 10KG BAGGAGE" Description1="UP TO 22 POUNDS/10 KILOGRAMS" DestinationAirport="ZIA" EndSegment="2" OriginAirport="AER" PassengerCode="ALL" StartSegment="2" Subcode="0CZ"/>
              <AncillaryFeeItem Amount="2000" AncillaryTypeCode="F" BaggageID="16" Carrier="U6" Date="2020-09-08" Description="EXCESS WEIGHT SPECIAL CHARGE" Description1="EXCESS WEIGHT" Description2="SPECIAL CHARGE" DestinationAirport="ZIA" EndSegment="2" OriginAirport="AER" PassengerCode="ALL" StartSegment="2" Subcode="0H6"/>
              <AncillaryFeeItem Amount="2500" AncillaryTypeCode="F" BaggageID="17" Carrier="U6" Date="2020-09-08" Description="EXTRA CARRYON BG" Description1="EXCESS SIZE" Description2="SPECIAL CHARGE" DestinationAirport="ZIA" EndSegment="2" OriginAirport="AER" PassengerCode="ALL" StartSegment="2" Subcode="0H7"/>
              <AncillaryFeeItem Amount="2500" AncillaryTypeCode="F" BaggageID="18" Carrier="U6" Date="2020-09-08" Description="CARRY ON HAND BAGGAGE" DestinationAirport="ZIA" EndSegment="2" OriginAirport="AER" PassengerCode="ALL" StartSegment="2" Subcode="0L5" Subgroup="CY"/>
            </AncillaryFeeGroup>
            <OrderStandardBag>
              <PassengerBags Code="ADT">
                <BaggageSequenceOrder BaggageID="1" StandardBag="1"/>
                <BaggageSequenceOrder BaggageID="3" StandardBag="2"/>
                <BaggageSequenceOrder BaggageID="5" StandardBag="3"/>
                <BaggageSequenceOrder BaggageID="11" StandardBag="1"/>
                <BaggageSequenceOrder BaggageID="13" StandardBag="2"/>
                <BaggageSequenceOrder BaggageID="14" StandardBag="3"/>
              </PassengerBags>
              <PassengerBags Code="CNN">
                <BaggageSequenceOrder BaggageID="2" StandardBag="1"/>
                <BaggageSequenceOrder BaggageID="4" StandardBag="2"/>
                <BaggageSequenceOrder BaggageID="6" StandardBag="3"/>
                <BaggageSequenceOrder BaggageID="12" StandardBag="1"/>
                <BaggageSequenceOrder BaggageID="13" StandardBag="2"/>
                <BaggageSequenceOrder BaggageID="14" StandardBag="3"/>
              </PassengerBags>
              <PassengerBags Code="INF">
                <BaggageSequenceOrder BaggageID="2" StandardBag="1"/>
                <BaggageSequenceOrder BaggageID="4" StandardBag="2"/>
                <BaggageSequenceOrder BaggageID="6" StandardBag="3"/>
                <BaggageSequenceOrder BaggageID="12" StandardBag="1"/>
                <BaggageSequenceOrder BaggageID="13" StandardBag="2"/>
                <BaggageSequenceOrder BaggageID="14" StandardBag="3"/>
              </PassengerBags>
            </OrderStandardBag>
          </AncillaryFeeGroups>
          <ValidatingCarrier NewVcxProcess="true" SettlementMethod="BSP">
            <Default Code="U6"/>
          </ValidatingCarrier>
          <ValidatingCarrier NewVcxProcess="true" SettlementMethod="TCH">
            <Default Code="U6"/>
          </ValidatingCarrier>
          <ValidatingCarrier NewVcxProcess="true" SettlementMethod="GEN">
            <Default Code="U6"/>
          </ValidatingCarrier>
        </TPA_Extensions>
      </AirItineraryPricingInfo>
      <TicketingInfo TicketType="eTicket" ValidInterline="Yes"/>
      <TPA_Extensions>
        <AdditionalFares>
          <AirItineraryPricingInfo FareReturned="true" LastTicketDate="2020-05-13" LastTicketTime="23:59" PricingSource="ADVJR1" PricingSubSource="MIP">
            <ItinTotalFare>
              <BaseFare Amount="6270" CurrencyCode="RUB" DecimalPlaces="0"/>
              <FareConstruction Amount="6270" CurrencyCode="RUB" DecimalPlaces="0"/>
              <EquivFare Amount="6270" CurrencyCode="RUB" DecimalPlaces="0"/>
              <Taxes>
                <Tax Amount="16276" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="TOTALTAX"/>
              </Taxes>
              <TotalFare Amount="22546" CurrencyCode="RUB" DecimalPlaces="0"/>
            </ItinTotalFare>
            <PTC_FareBreakdowns>
              <PTC_FareBreakdown>
                <PassengerTypeQuantity Code="ADT" Quantity="2"/>
                <FareBasisCodes>
                  <FareBasisCode ArrivalAirportCode="AER" AvailabilityBreak="true" BookingCode="W" DepartureAirportCode="ZIA" FareComponentBeginAirport="ZIA" FareComponentDirectionality="FROM" FareComponentEndAirport="AER" FareComponentFareRule="U6EC" FareComponentFareTariff="304" FareComponentFareType="XEX" FareComponentFareTypeBitmap="00" FareComponentVendorCode="ATP" GovCarrier="U6">WECRT</FareBasisCode>
                  <FareBasisCode ArrivalAirportCode="ZIA" AvailabilityBreak="true" BookingCode="W" DepartureAirportCode="AER" FareComponentBeginAirport="AER" FareComponentDirectionality="TO" FareComponentEndAirport="ZIA" FareComponentFareRule="U6EC" FareComponentFareTariff="304" FareComponentFareType="XEX" FareComponentFareTypeBitmap="00" FareComponentVendorCode="ATP" GovCarrier="U6">WECRT</FareBasisCode>
                </FareBasisCodes>
                <PassengerFare>
                  <BaseFare Amount="2280" CurrencyCode="RUB"/>
                  <FareConstruction Amount="2280" CurrencyCode="RUB" DecimalPlaces="0"/>
                  <EquivFare Amount="2280" CurrencyCode="RUB" DecimalPlaces="0"/>
                  <Taxes>
                    <Tax Amount="2150" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                    <Tax Amount="2150" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                    <Tax Amount="400" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRI"/>
                    <Tax Amount="400" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRI"/>
                    <Tax Amount="75" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                    <Tax Amount="120" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                    <Tax Amount="75" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI4"/>
                    <Tax Amount="120" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI4"/>
                    <TaxSummary Amount="4300" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                    <TaxSummary Amount="800" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRI"/>
                    <TaxSummary Amount="390" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                    <TotalTax Amount="5490" CurrencyCode="RUB" DecimalPlaces="0"/>
                  </Taxes>
                  <TotalFare Amount="7770" CurrencyCode="RUB"/>
                  <PenaltiesInfo>
                    <Penalty Amount="0" Applicability="Before" Changeable="true" ConditionsApply="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                    <Penalty Amount="0" Applicability="After" Changeable="true" ConditionsApply="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                    <Penalty Amount="1500" Applicability="Before" CurrencyCode="RUB" DecimalPlaces="0" Refundable="true" Type="Refund"/>
                    <Penalty Amount="3000" Applicability="After" CurrencyCode="RUB" DecimalPlaces="0" Refundable="true" Type="Refund"/>
                  </PenaltiesInfo>
                  <TPA_Extensions>
                    <FareComponents>
                      <FareComponent BrandID="EC" BrandName="ECONOM" ProgramCode="CFFU6" ProgramDescription="U6 DOMESTIC" ProgramID="83326" ProgramSystemCode="A">
                        <Segment FlightIndex="1" LegIndex="1"/>
                        <BrandFeatureRef FeatureId="15"/>
                        <BrandFeatureRef FeatureId="17"/>
                        <BrandFeatureRef FeatureId="18"/>
                        <BrandFeatureRef FeatureId="20"/>
                        <BrandFeatureRef FeatureId="36"/>
                        <BrandFeatureRef FeatureId="37"/>
                        <BrandFeatureRef FeatureId="86"/>
                        <BrandFeatureRef FeatureId="85"/>
                        <BrandFeatureRef FeatureId="60"/>
                        <BrandFeatureRef FeatureId="51"/>
                        <BrandFeatureRef FeatureId="57"/>
                        <BrandFeatureRef FeatureId="91"/>
                        <BrandFeatureRef FeatureId="94"/>
                        <BrandFeatureRef FeatureId="99"/>
                        <BrandFeatureRef FeatureId="101"/>
                      </FareComponent>
                      <FareComponent BrandID="EC" BrandName="ECONOM" ProgramCode="CFFU6" ProgramDescription="U6 DOMESTIC" ProgramID="83326" ProgramSystemCode="A">
                        <Segment FlightIndex="1" LegIndex="2"/>
                        <BrandFeatureRef FeatureId="15"/>
                        <BrandFeatureRef FeatureId="17"/>
                        <BrandFeatureRef FeatureId="18"/>
                        <BrandFeatureRef FeatureId="20"/>
                        <BrandFeatureRef FeatureId="36"/>
                        <BrandFeatureRef FeatureId="37"/>
                        <BrandFeatureRef FeatureId="86"/>
                        <BrandFeatureRef FeatureId="85"/>
                        <BrandFeatureRef FeatureId="60"/>
                        <BrandFeatureRef FeatureId="51"/>
                        <BrandFeatureRef FeatureId="57"/>
                        <BrandFeatureRef FeatureId="91"/>
                        <BrandFeatureRef FeatureId="94"/>
                        <BrandFeatureRef FeatureId="99"/>
                        <BrandFeatureRef FeatureId="101"/>
                      </FareComponent>
                    </FareComponents>
                    <Messages>
                      <Message AirlineCode="U6" FailCode="0" Info="NONEND" Type="N"/>
                      <Message FailCode="0" Info="VALIDATING CARRIER" Type="W"/>
                      <Message FailCode="0" Info="BSP - U6" Type="W"/>
                      <Message FailCode="0" Info="GEN - U6" Type="W"/>
                      <Message FailCode="0" Info="TCH - U6" Type="W"/>
                      <Message FailCode="0" Info="CAT 15 SALES RESTRICTIONS FREE TEXT FOUND - VERIFY RULES" Type="W"/>
                    </Messages>
                    <BaggageInformationList>
                      <BaggageInformation AirlineCode="U6" ProvisionType="A">
                        <Segment Id="0"/>
                        <Allowance Description1="UP TO 50 POUNDS/23 KILOGRAMS" Description2="UP TO 80 LINEAR INCHES/203 LINEAR CENTIMETERS" Pieces="1"/>
                      </BaggageInformation>
                      <BaggageInformation AirlineCode="U6" ProvisionType="A">
                        <Segment Id="1"/>
                        <Allowance Description1="UP TO 50 POUNDS/23 KILOGRAMS" Description2="UP TO 80 LINEAR INCHES/203 LINEAR CENTIMETERS" Pieces="1"/>
                      </BaggageInformation>
                    </BaggageInformationList>
                  </TPA_Extensions>
                </PassengerFare>
                <Endorsements NonRefundableIndicator="false"/>
                <TPA_Extensions>
                  <FareCalcLine Info="ZIA U6 AER1140U6 ZIA1140RUB2280END"/>
                </TPA_Extensions>
                <FareInfos>
                  <FareInfo>
                    <FareReference>W</FareReference>
                    <TPA_Extensions>
                      <SeatsRemaining BelowMin="false" Number="9"/>
                      <Cabin Cabin="Y"/>
                      <Meal Code="N"/>
                    </TPA_Extensions>
                  </FareInfo>
                  <FareInfo>
                    <FareReference>W</FareReference>
                    <TPA_Extensions>
                      <SeatsRemaining BelowMin="false" Number="9"/>
                      <Cabin Cabin="Y"/>
                      <Meal Code="N"/>
                    </TPA_Extensions>
                  </FareInfo>
                </FareInfos>
              </PTC_FareBreakdown>
              <PTC_FareBreakdown>
                <PassengerTypeQuantity Code="CNN" Quantity="1"/>
                <FareBasisCodes>
                  <FareBasisCode ArrivalAirportCode="AER" AvailabilityBreak="true" BookingCode="W" DepartureAirportCode="ZIA" FareComponentBeginAirport="ZIA" FareComponentDirectionality="FROM" FareComponentEndAirport="AER" FareComponentFareRule="U6EC" FareComponentFareTariff="304" FareComponentFareType="XEX" FareComponentFareTypeBitmap="01" FareComponentVendorCode="ATP" GovCarrier="U6">WECRT/CH25</FareBasisCode>
                  <FareBasisCode ArrivalAirportCode="ZIA" AvailabilityBreak="true" BookingCode="W" DepartureAirportCode="AER" FareComponentBeginAirport="AER" FareComponentDirectionality="TO" FareComponentEndAirport="ZIA" FareComponentFareRule="U6EC" FareComponentFareTariff="304" FareComponentFareType="XEX" FareComponentFareTypeBitmap="01" FareComponentVendorCode="ATP" GovCarrier="U6">WECRT/CH25</FareBasisCode>
                </FareBasisCodes>
                <PassengerFare>
                  <BaseFare Amount="1710" CurrencyCode="RUB"/>
                  <FareConstruction Amount="1710" CurrencyCode="RUB" DecimalPlaces="0"/>
                  <EquivFare Amount="1710" CurrencyCode="RUB" DecimalPlaces="0"/>
                  <Taxes>
                    <Tax Amount="2150" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                    <Tax Amount="2150" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                    <Tax Amount="400" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRI"/>
                    <Tax Amount="400" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRI"/>
                    <Tax Amount="38" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                    <Tax Amount="60" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                    <Tax Amount="38" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI4"/>
                    <Tax Amount="60" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI4"/>
                    <TaxSummary Amount="4300" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                    <TaxSummary Amount="800" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRI"/>
                    <TaxSummary Amount="196" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                    <TotalTax Amount="5296" CurrencyCode="RUB" DecimalPlaces="0"/>
                  </Taxes>
                  <TotalFare Amount="7006" CurrencyCode="RUB"/>
                  <PenaltiesInfo>
                    <Penalty Amount="0" Applicability="Before" Changeable="true" ConditionsApply="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                    <Penalty Amount="0" Applicability="After" Changeable="true" ConditionsApply="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                    <Penalty Amount="1500" Applicability="Before" CurrencyCode="RUB" DecimalPlaces="0" Refundable="true" Type="Refund"/>
                    <Penalty Amount="3000" Applicability="After" CurrencyCode="RUB" DecimalPlaces="0" Refundable="true" Type="Refund"/>
                  </PenaltiesInfo>
                  <TPA_Extensions>
                    <FareComponents>
                      <FareComponent BrandID="EC" BrandName="ECONOM" ProgramCode="CFFU6" ProgramDescription="U6 DOMESTIC" ProgramID="83326" ProgramSystemCode="A">
                        <Segment FlightIndex="1" LegIndex="1"/>
                        <BrandFeatureRef FeatureId="15"/>
                        <BrandFeatureRef FeatureId="17"/>
                        <BrandFeatureRef FeatureId="18"/>
                        <BrandFeatureRef FeatureId="20"/>
                        <BrandFeatureRef FeatureId="36"/>
                        <BrandFeatureRef FeatureId="37"/>
                        <BrandFeatureRef FeatureId="86"/>
                        <BrandFeatureRef FeatureId="85"/>
                        <BrandFeatureRef FeatureId="60"/>
                        <BrandFeatureRef FeatureId="51"/>
                        <BrandFeatureRef FeatureId="57"/>
                        <BrandFeatureRef FeatureId="91"/>
                        <BrandFeatureRef FeatureId="94"/>
                        <BrandFeatureRef FeatureId="99"/>
                        <BrandFeatureRef FeatureId="101"/>
                      </FareComponent>
                      <FareComponent BrandID="EC" BrandName="ECONOM" ProgramCode="CFFU6" ProgramDescription="U6 DOMESTIC" ProgramID="83326" ProgramSystemCode="A">
                        <Segment FlightIndex="1" LegIndex="2"/>
                        <BrandFeatureRef FeatureId="15"/>
                        <BrandFeatureRef FeatureId="17"/>
                        <BrandFeatureRef FeatureId="18"/>
                        <BrandFeatureRef FeatureId="20"/>
                        <BrandFeatureRef FeatureId="36"/>
                        <BrandFeatureRef FeatureId="37"/>
                        <BrandFeatureRef FeatureId="86"/>
                        <BrandFeatureRef FeatureId="85"/>
                        <BrandFeatureRef FeatureId="60"/>
                        <BrandFeatureRef FeatureId="51"/>
                        <BrandFeatureRef FeatureId="57"/>
                        <BrandFeatureRef FeatureId="91"/>
                        <BrandFeatureRef FeatureId="94"/>
                        <BrandFeatureRef FeatureId="99"/>
                        <BrandFeatureRef FeatureId="101"/>
                      </FareComponent>
                    </FareComponents>
                    <Messages>
                      <Message AirlineCode="U6" FailCode="0" Info="NONEND" Type="N"/>
                      <Message FailCode="0" Info="EACH CNN REQUIRES ACCOMPANYING SAME CABIN ADT" Type="W"/>
                      <Message FailCode="0" Info="VALIDATING CARRIER" Type="W"/>
                      <Message FailCode="0" Info="BSP - U6" Type="W"/>
                      <Message FailCode="0" Info="GEN - U6" Type="W"/>
                      <Message FailCode="0" Info="TCH - U6" Type="W"/>
                      <Message FailCode="0" Info="CAT 15 SALES RESTRICTIONS FREE TEXT FOUND - VERIFY RULES" Type="W"/>
                    </Messages>
                    <BaggageInformationList>
                      <BaggageInformation AirlineCode="U6" ProvisionType="A">
                        <Segment Id="0"/>
                        <Allowance Description1="UP TO 50 POUNDS/23 KILOGRAMS" Description2="UP TO 80 LINEAR INCHES/203 LINEAR CENTIMETERS" Pieces="1"/>
                      </BaggageInformation>
                      <BaggageInformation AirlineCode="U6" ProvisionType="A">
                        <Segment Id="1"/>
                        <Allowance Description1="UP TO 50 POUNDS/23 KILOGRAMS" Description2="UP TO 80 LINEAR INCHES/203 LINEAR CENTIMETERS" Pieces="1"/>
                      </BaggageInformation>
                    </BaggageInformationList>
                  </TPA_Extensions>
                </PassengerFare>
                <Endorsements NonRefundableIndicator="false"/>
                <TPA_Extensions>
                  <FareCalcLine Info="ZIA U6 AER855U6 ZIA855RUB1710END"/>
                </TPA_Extensions>
                <FareInfos>
                  <FareInfo>
                    <FareReference>W</FareReference>
                    <TPA_Extensions>
                      <SeatsRemaining BelowMin="false" Number="9"/>
                      <Cabin Cabin="Y"/>
                      <Meal Code="N"/>
                    </TPA_Extensions>
                  </FareInfo>
                  <FareInfo>
                    <FareReference>W</FareReference>
                    <TPA_Extensions>
                      <SeatsRemaining BelowMin="false" Number="9"/>
                      <Cabin Cabin="Y"/>
                      <Meal Code="N"/>
                    </TPA_Extensions>
                  </FareInfo>
                </FareInfos>
              </PTC_FareBreakdown>
              <PTC_FareBreakdown>
                <PassengerTypeQuantity Code="INF" Quantity="1"/>
                <FareBasisCodes>
                  <FareBasisCode ArrivalAirportCode="AER" AvailabilityBreak="true" BookingCode="W" DepartureAirportCode="ZIA" FareComponentBeginAirport="ZIA" FareComponentDirectionality="FROM" FareComponentEndAirport="AER" FareComponentFareRule="U6EC" FareComponentFareTariff="304" FareComponentFareType="XEX" FareComponentFareTypeBitmap="01" FareComponentVendorCode="ATP" GovCarrier="U6">WECRT/IN</FareBasisCode>
                  <FareBasisCode ArrivalAirportCode="ZIA" AvailabilityBreak="true" BookingCode="W" DepartureAirportCode="AER" FareComponentBeginAirport="AER" FareComponentDirectionality="TO" FareComponentEndAirport="ZIA" FareComponentFareRule="U6EC" FareComponentFareTariff="304" FareComponentFareType="XEX" FareComponentFareTypeBitmap="01" FareComponentVendorCode="ATP" GovCarrier="U6">WECRT/IN</FareBasisCode>
                </FareBasisCodes>
                <PassengerFare>
                  <BaseFare Amount="0" CurrencyCode="RUB"/>
                  <FareConstruction Amount="0" CurrencyCode="RUB" DecimalPlaces="0"/>
                  <EquivFare Amount="0" CurrencyCode="RUB" DecimalPlaces="0"/>
                  <TotalFare Amount="0" CurrencyCode="RUB"/>
                  <PenaltiesInfo>
                    <Penalty Amount="0" Applicability="Before" Changeable="true" ConditionsApply="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                    <Penalty Amount="0" Applicability="After" Changeable="true" ConditionsApply="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                    <Penalty Amount="0" Applicability="Before" CurrencyCode="RUB" DecimalPlaces="0" Refundable="true" Type="Refund"/>
                    <Penalty Amount="0" Applicability="After" CurrencyCode="RUB" DecimalPlaces="0" Refundable="true" Type="Refund"/>
                  </PenaltiesInfo>
                  <TPA_Extensions>
                    <FareComponents>
                      <FareComponent BrandID="EC" BrandName="ECONOM" ProgramCode="CFFU6" ProgramDescription="U6 DOMESTIC" ProgramID="83326" ProgramSystemCode="A">
                        <Segment FlightIndex="1" LegIndex="1"/>
                        <BrandFeatureRef FeatureId="15"/>
                        <BrandFeatureRef FeatureId="17"/>
                        <BrandFeatureRef FeatureId="18"/>
                        <BrandFeatureRef FeatureId="20"/>
                        <BrandFeatureRef FeatureId="36"/>
                        <BrandFeatureRef FeatureId="37"/>
                        <BrandFeatureRef FeatureId="86"/>
                        <BrandFeatureRef FeatureId="85"/>
                        <BrandFeatureRef FeatureId="60"/>
                        <BrandFeatureRef FeatureId="51"/>
                        <BrandFeatureRef FeatureId="57"/>
                        <BrandFeatureRef FeatureId="91"/>
                        <BrandFeatureRef FeatureId="94"/>
                        <BrandFeatureRef FeatureId="99"/>
                        <BrandFeatureRef FeatureId="101"/>
                      </FareComponent>
                      <FareComponent BrandID="EC" BrandName="ECONOM" ProgramCode="CFFU6" ProgramDescription="U6 DOMESTIC" ProgramID="83326" ProgramSystemCode="A">
                        <Segment FlightIndex="1" LegIndex="2"/>
                        <BrandFeatureRef FeatureId="15"/>
                        <BrandFeatureRef FeatureId="17"/>
                        <BrandFeatureRef FeatureId="18"/>
                        <BrandFeatureRef FeatureId="20"/>
                        <BrandFeatureRef FeatureId="36"/>
                        <BrandFeatureRef FeatureId="37"/>
                        <BrandFeatureRef FeatureId="86"/>
                        <BrandFeatureRef FeatureId="85"/>
                        <BrandFeatureRef FeatureId="60"/>
                        <BrandFeatureRef FeatureId="51"/>
                        <BrandFeatureRef FeatureId="57"/>
                        <BrandFeatureRef FeatureId="91"/>
                        <BrandFeatureRef FeatureId="94"/>
                        <BrandFeatureRef FeatureId="99"/>
                        <BrandFeatureRef FeatureId="101"/>
                      </FareComponent>
                    </FareComponents>
                    <Messages>
                      <Message AirlineCode="U6" FailCode="0" Info="NONEND" Type="N"/>
                      <Message FailCode="0" Info="EACH INF REQUIRES ACCOMPANYING ADT PASSENGER" Type="W"/>
                      <Message FailCode="0" Info="VALIDATING CARRIER" Type="W"/>
                      <Message FailCode="0" Info="BSP - U6" Type="W"/>
                      <Message FailCode="0" Info="GEN - U6" Type="W"/>
                      <Message FailCode="0" Info="TCH - U6" Type="W"/>
                      <Message FailCode="0" Info="CAT 15 SALES RESTRICTIONS FREE TEXT FOUND - VERIFY RULES" Type="W"/>
                    </Messages>
                    <BaggageInformationList>
                      <BaggageInformation AirlineCode="U6" ProvisionType="A">
                        <Segment Id="0"/>
                        <Allowance Unit="kg" Weight="10"/>
                      </BaggageInformation>
                      <BaggageInformation AirlineCode="U6" ProvisionType="A">
                        <Segment Id="1"/>
                        <Allowance Unit="kg" Weight="10"/>
                      </BaggageInformation>
                    </BaggageInformationList>
                  </TPA_Extensions>
                </PassengerFare>
                <Endorsements NonRefundableIndicator="false"/>
                <TPA_Extensions>
                  <FareCalcLine Info="ZIA U6 AER0U6 ZIA0RUB0END"/>
                </TPA_Extensions>
                <FareInfos>
                  <FareInfo>
                    <FareReference>W</FareReference>
                    <TPA_Extensions>
                      <SeatsRemaining BelowMin="false" Number="9"/>
                      <Cabin Cabin="Y"/>
                      <Meal Code="N"/>
                    </TPA_Extensions>
                  </FareInfo>
                  <FareInfo>
                    <FareReference>W</FareReference>
                    <TPA_Extensions>
                      <SeatsRemaining BelowMin="false" Number="9"/>
                      <Cabin Cabin="Y"/>
                      <Meal Code="N"/>
                    </TPA_Extensions>
                  </FareInfo>
                </FareInfos>
              </PTC_FareBreakdown>
            </PTC_FareBreakdowns>
            <FareInfos>
              <FareInfo>
                <FareReference>W</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="N"/>
                </TPA_Extensions>
              </FareInfo>
              <FareInfo>
                <FareReference>W</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="N"/>
                </TPA_Extensions>
              </FareInfo>
            </FareInfos>
            <TPA_Extensions>
              <DivideInParty Indicator="false"/>
              <AncillaryFeeGroups Message="ADDTL AIR EXTRAS APPLY - REFINE REQUEST">
                <AncillaryFeeGroup Code="BG" Name="BAGGAGE">
                  <AncillaryFeeItem Amount="2000" AncillaryTypeCode="F" BaggageID="1" Carrier="U6" Date="2020-09-01" Description="FIRST EXCESS BAG" Description1="FIRST BAG" DestinationAirport="AER" EndSegment="1" OriginAirport="ZIA" PassengerCode="ADT" StartSegment="1" Subcode="0CC"/>
                  <AncillaryFeeItem Amount="2500" AncillaryTypeCode="F" BaggageID="2" Carrier="U6" Date="2020-09-01" Description="FIRST EXCESS BAG" Description1="FIRST BAG" DestinationAirport="AER" EndSegment="1" OriginAirport="ZIA" PassengerCode="ALL" StartSegment="1" Subcode="0CC"/>
                  <AncillaryFeeItem Amount="2000" AncillaryTypeCode="F" BaggageID="3" Carrier="U6" Date="2020-09-01" Description="SECOND EXCESS BAG" Description1="SECOND BAG" DestinationAirport="AER" EndSegment="1" OriginAirport="ZIA" PassengerCode="ADT" StartSegment="1" Subcode="0CD"/>
                  <AncillaryFeeItem Amount="2500" AncillaryTypeCode="F" BaggageID="4" Carrier="U6" Date="2020-09-01" Description="SECOND EXCESS BAG" Description1="SECOND BAG" DestinationAirport="AER" EndSegment="1" OriginAirport="ZIA" PassengerCode="ALL" StartSegment="1" Subcode="0CD"/>
                  <AncillaryFeeItem Amount="2000" AncillaryTypeCode="F" BaggageID="5" Carrier="U6" Date="2020-09-01" Description="THIRD EXCESS BAG" Description1="THIRD BAG" DestinationAirport="AER" EndSegment="1" OriginAirport="ZIA" PassengerCode="ADT" StartSegment="1" Subcode="0CE"/>
                  <AncillaryFeeItem Amount="2500" AncillaryTypeCode="F" BaggageID="6" Carrier="U6" Date="2020-09-01" Description="THIRD EXCESS BAG" Description1="THIRD BAG" DestinationAirport="AER" EndSegment="1" OriginAirport="ZIA" PassengerCode="ALL" StartSegment="1" Subcode="0CE"/>
                  <AncillaryFeeItem Amount="2000" AncillaryTypeCode="F" BaggageID="7" Carrier="U6" Date="2020-09-01" Description="UPTO22LB 10KG BAGGAGE" Description1="UP TO 22 POUNDS/10 KILOGRAMS" DestinationAirport="AER" EndSegment="1" OriginAirport="ZIA" PassengerCode="ALL" StartSegment="1" Subcode="0CZ"/>
                  <AncillaryFeeItem Amount="2000" AncillaryTypeCode="F" BaggageID="8" Carrier="U6" Date="2020-09-01" Description="EXCESS WEIGHT SPECIAL CHARGE" Description1="EXCESS WEIGHT" Description2="SPECIAL CHARGE" DestinationAirport="AER" EndSegment="1" OriginAirport="ZIA" PassengerCode="ALL" StartSegment="1" Subcode="0H6"/>
                  <AncillaryFeeItem Amount="2500" AncillaryTypeCode="F" BaggageID="9" Carrier="U6" Date="2020-09-01" Description="EXTRA CARRYON BG" Description1="EXCESS SIZE" Description2="SPECIAL CHARGE" DestinationAirport="AER" EndSegment="1" OriginAirport="ZIA" PassengerCode="ALL" StartSegment="1" Subcode="0H7"/>
                  <AncillaryFeeItem Amount="2500" AncillaryTypeCode="F" BaggageID="10" Carrier="U6" Date="2020-09-01" Description="CARRY ON HAND BAGGAGE" DestinationAirport="AER" EndSegment="1" OriginAirport="ZIA" PassengerCode="ALL" StartSegment="1" Subcode="0L5" Subgroup="CY"/>
                  <AncillaryFeeItem Amount="2000" AncillaryTypeCode="F" BaggageID="11" Carrier="U6" Date="2020-09-08" Description="FIRST EXCESS BAG" Description1="FIRST BAG" DestinationAirport="ZIA" EndSegment="2" OriginAirport="AER" PassengerCode="ADT" StartSegment="2" Subcode="0CC"/>
                  <AncillaryFeeItem Amount="2500" AncillaryTypeCode="F" BaggageID="12" Carrier="U6" Date="2020-09-08" Description="FIRST EXCESS BAG" Description1="FIRST BAG" DestinationAirport="ZIA" EndSegment="2" OriginAirport="AER" PassengerCode="ALL" StartSegment="2" Subcode="0CC"/>
                  <AncillaryFeeItem Amount="2500" AncillaryTypeCode="F" BaggageID="13" Carrier="U6" Date="2020-09-08" Description="SECOND EXCESS BAG" Description1="SECOND BAG" DestinationAirport="ZIA" EndSegment="2" OriginAirport="AER" PassengerCode="ALL" StartSegment="2" Subcode="0CD"/>
                  <AncillaryFeeItem Amount="2500" AncillaryTypeCode="F" BaggageID="14" Carrier="U6" Date="2020-09-08" Description="THIRD EXCESS BAG" Description1="THIRD BAG" DestinationAirport="ZIA" EndSegment="2" OriginAirport="AER" PassengerCode="ALL" StartSegment="2" Subcode="0CE"/>
                  <AncillaryFeeItem Amount="2000" AncillaryTypeCode="F" BaggageID="15" Carrier="U6" Date="2020-09-08" Description="UPTO22LB 10KG BAGGAGE" Description1="UP TO 22 POUNDS/10 KILOGRAMS" DestinationAirport="ZIA" EndSegment="2" OriginAirport="AER" PassengerCode="ALL" StartSegment="2" Subcode="0CZ"/>
                  <AncillaryFeeItem Amount="2000" AncillaryTypeCode="F" BaggageID="16" Carrier="U6" Date="2020-09-08" Description="EXCESS WEIGHT SPECIAL CHARGE" Description1="EXCESS WEIGHT" Description2="SPECIAL CHARGE" DestinationAirport="ZIA" EndSegment="2" OriginAirport="AER" PassengerCode="ALL" StartSegment="2" Subcode="0H6"/>
                  <AncillaryFeeItem Amount="2500" AncillaryTypeCode="F" BaggageID="17" Carrier="U6" Date="2020-09-08" Description="EXTRA CARRYON BG" Description1="EXCESS SIZE" Description2="SPECIAL CHARGE" DestinationAirport="ZIA" EndSegment="2" OriginAirport="AER" PassengerCode="ALL" StartSegment="2" Subcode="0H7"/>
                  <AncillaryFeeItem Amount="2500" AncillaryTypeCode="F" BaggageID="18" Carrier="U6" Date="2020-09-08" Description="CARRY ON HAND BAGGAGE" DestinationAirport="ZIA" EndSegment="2" OriginAirport="AER" PassengerCode="ALL" StartSegment="2" Subcode="0L5" Subgroup="CY"/>
                </AncillaryFeeGroup>
                <OrderStandardBag>
                  <PassengerBags Code="ADT">
                    <BaggageSequenceOrder BaggageID="1" StandardBag="1"/>
                    <BaggageSequenceOrder BaggageID="3" StandardBag="2"/>
                    <BaggageSequenceOrder BaggageID="5" StandardBag="3"/>
                    <BaggageSequenceOrder BaggageID="11" StandardBag="1"/>
                    <BaggageSequenceOrder BaggageID="13" StandardBag="2"/>
                    <BaggageSequenceOrder BaggageID="14" StandardBag="3"/>
                  </PassengerBags>
                  <PassengerBags Code="CNN">
                    <BaggageSequenceOrder BaggageID="2" StandardBag="1"/>
                    <BaggageSequenceOrder BaggageID="4" StandardBag="2"/>
                    <BaggageSequenceOrder BaggageID="6" StandardBag="3"/>
                    <BaggageSequenceOrder BaggageID="12" StandardBag="1"/>
                    <BaggageSequenceOrder BaggageID="13" StandardBag="2"/>
                    <BaggageSequenceOrder BaggageID="14" StandardBag="3"/>
                  </PassengerBags>
                  <PassengerBags Code="INF">
                    <BaggageSequenceOrder BaggageID="2" StandardBag="1"/>
                    <BaggageSequenceOrder BaggageID="4" StandardBag="2"/>
                    <BaggageSequenceOrder BaggageID="6" StandardBag="3"/>
                    <BaggageSequenceOrder BaggageID="12" StandardBag="1"/>
                    <BaggageSequenceOrder BaggageID="13" StandardBag="2"/>
                    <BaggageSequenceOrder BaggageID="14" StandardBag="3"/>
                  </PassengerBags>
                </OrderStandardBag>
              </AncillaryFeeGroups>
              <ValidatingCarrier NewVcxProcess="true" SettlementMethod="BSP">
                <Default Code="U6"/>
              </ValidatingCarrier>
              <ValidatingCarrier NewVcxProcess="true" SettlementMethod="TCH">
                <Default Code="U6"/>
              </ValidatingCarrier>
              <ValidatingCarrier NewVcxProcess="true" SettlementMethod="GEN">
                <Default Code="U6"/>
              </ValidatingCarrier>
            </TPA_Extensions>
          </AirItineraryPricingInfo>
          <TicketingInfo TicketType="eTicket" ValidInterline="Yes"/>
        </AdditionalFares>
        <AdditionalFares>
          <AirItineraryPricingInfo FareReturned="true" LastTicketDate="2020-05-13" LastTicketTime="23:59" PricingSource="ADVJR1" PricingSubSource="MIP">
            <ItinTotalFare>
              <BaseFare Amount="17270" CurrencyCode="RUB" DecimalPlaces="0"/>
              <FareConstruction Amount="17270" CurrencyCode="RUB" DecimalPlaces="0"/>
              <EquivFare Amount="17270" CurrencyCode="RUB" DecimalPlaces="0"/>
              <Taxes>
                <Tax Amount="16276" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="TOTALTAX"/>
              </Taxes>
              <TotalFare Amount="33546" CurrencyCode="RUB" DecimalPlaces="0"/>
            </ItinTotalFare>
            <PTC_FareBreakdowns>
              <PTC_FareBreakdown>
                <PassengerTypeQuantity Code="ADT" Quantity="2"/>
                <FareBasisCodes>
                  <FareBasisCode ArrivalAirportCode="AER" AvailabilityBreak="true" BookingCode="W" DepartureAirportCode="ZIA" FareComponentBeginAirport="ZIA" FareComponentDirectionality="FROM" FareComponentEndAirport="AER" FareComponentFareRule="U6LF" FareComponentFareTariff="304" FareComponentFareType="EU" FareComponentFareTypeBitmap="00" FareComponentVendorCode="ATP" GovCarrier="U6">WFLRT</FareBasisCode>
                  <FareBasisCode ArrivalAirportCode="ZIA" AvailabilityBreak="true" BookingCode="W" DepartureAirportCode="AER" FareComponentBeginAirport="AER" FareComponentDirectionality="TO" FareComponentEndAirport="ZIA" FareComponentFareRule="U6LF" FareComponentFareTariff="304" FareComponentFareType="EU" FareComponentFareTypeBitmap="00" FareComponentVendorCode="ATP" GovCarrier="U6">WFLRT</FareBasisCode>
                </FareBasisCodes>
                <PassengerFare>
                  <BaseFare Amount="6280" CurrencyCode="RUB"/>
                  <FareConstruction Amount="6280" CurrencyCode="RUB" DecimalPlaces="0"/>
                  <EquivFare Amount="6280" CurrencyCode="RUB" DecimalPlaces="0"/>
                  <Taxes>
                    <Tax Amount="2150" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                    <Tax Amount="2150" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                    <Tax Amount="400" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRI"/>
                    <Tax Amount="400" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRI"/>
                    <Tax Amount="75" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                    <Tax Amount="120" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                    <Tax Amount="75" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI4"/>
                    <Tax Amount="120" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI4"/>
                    <TaxSummary Amount="4300" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                    <TaxSummary Amount="800" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRI"/>
                    <TaxSummary Amount="390" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                    <TotalTax Amount="5490" CurrencyCode="RUB" DecimalPlaces="0"/>
                  </Taxes>
                  <TotalFare Amount="11770" CurrencyCode="RUB"/>
                  <PenaltiesInfo>
                    <Penalty Amount="0" Applicability="Before" Changeable="true" ConditionsApply="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                    <Penalty Amount="0" Applicability="After" Changeable="true" ConditionsApply="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                    <Penalty Amount="1500" Applicability="Before" CurrencyCode="RUB" DecimalPlaces="0" Refundable="true" Type="Refund"/>
                    <Penalty Amount="3000" Applicability="After" CurrencyCode="RUB" DecimalPlaces="0" Refundable="true" Type="Refund"/>
                  </PenaltiesInfo>
                  <TPA_Extensions>
                    <FareComponents>
                      <FareComponent BrandID="FL" BrandName="FLEXIBLE" ProgramCode="CFFU6" ProgramDescription="U6 DOMESTIC" ProgramID="83326" ProgramSystemCode="A">
                        <Segment FlightIndex="1" LegIndex="1"/>
                        <BrandFeatureRef FeatureId="15"/>
                        <BrandFeatureRef FeatureId="17"/>
                        <BrandFeatureRef FeatureId="18"/>
                        <BrandFeatureRef FeatureId="20"/>
                        <BrandFeatureRef FeatureId="36"/>
                        <BrandFeatureRef FeatureId="37"/>
                        <BrandFeatureRef FeatureId="86"/>
                        <BrandFeatureRef FeatureId="85"/>
                        <BrandFeatureRef FeatureId="60"/>
                        <BrandFeatureRef FeatureId="51"/>
                        <BrandFeatureRef FeatureId="58"/>
                        <BrandFeatureRef FeatureId="91"/>
                        <BrandFeatureRef FeatureId="94"/>
                        <BrandFeatureRef FeatureId="99"/>
                        <BrandFeatureRef FeatureId="101"/>
                      </FareComponent>
                      <FareComponent BrandID="FL" BrandName="FLEXIBLE" ProgramCode="CFFU6" ProgramDescription="U6 DOMESTIC" ProgramID="83326" ProgramSystemCode="A">
                        <Segment FlightIndex="1" LegIndex="2"/>
                        <BrandFeatureRef FeatureId="15"/>
                        <BrandFeatureRef FeatureId="17"/>
                        <BrandFeatureRef FeatureId="18"/>
                        <BrandFeatureRef FeatureId="20"/>
                        <BrandFeatureRef FeatureId="36"/>
                        <BrandFeatureRef FeatureId="37"/>
                        <BrandFeatureRef FeatureId="86"/>
                        <BrandFeatureRef FeatureId="85"/>
                        <BrandFeatureRef FeatureId="60"/>
                        <BrandFeatureRef FeatureId="51"/>
                        <BrandFeatureRef FeatureId="58"/>
                        <BrandFeatureRef FeatureId="91"/>
                        <BrandFeatureRef FeatureId="94"/>
                        <BrandFeatureRef FeatureId="99"/>
                        <BrandFeatureRef FeatureId="101"/>
                      </FareComponent>
                    </FareComponents>
                    <Messages>
                      <Message AirlineCode="U6" FailCode="0" Info="NONEND" Type="N"/>
                      <Message FailCode="0" Info="VALIDATING CARRIER" Type="W"/>
                      <Message FailCode="0" Info="BSP - U6" Type="W"/>
                      <Message FailCode="0" Info="GEN - U6" Type="W"/>
                      <Message FailCode="0" Info="TCH - U6" Type="W"/>
                      <Message FailCode="0" Info="CAT 15 SALES RESTRICTIONS FREE TEXT FOUND - VERIFY RULES" Type="W"/>
                    </Messages>
                    <BaggageInformationList>
                      <BaggageInformation AirlineCode="U6" ProvisionType="A">
                        <Segment Id="0"/>
                        <Allowance Pieces="2"/>
                      </BaggageInformation>
                      <BaggageInformation AirlineCode="U6" ProvisionType="A">
                        <Segment Id="1"/>
                        <Allowance Pieces="2"/>
                      </BaggageInformation>
                    </BaggageInformationList>
                  </TPA_Extensions>
                </PassengerFare>
                <Endorsements NonRefundableIndicator="false"/>
                <TPA_Extensions>
                  <FareCalcLine Info="ZIA U6 AER3140U6 ZIA3140RUB6280END"/>
                </TPA_Extensions>
                <FareInfos>
                  <FareInfo>
                    <FareReference>W</FareReference>
                    <TPA_Extensions>
                      <SeatsRemaining BelowMin="false" Number="9"/>
                      <Cabin Cabin="Y"/>
                      <Meal Code="N"/>
                    </TPA_Extensions>
                  </FareInfo>
                  <FareInfo>
                    <FareReference>W</FareReference>
                    <TPA_Extensions>
                      <SeatsRemaining BelowMin="false" Number="9"/>
                      <Cabin Cabin="Y"/>
                      <Meal Code="N"/>
                    </TPA_Extensions>
                  </FareInfo>
                </FareInfos>
              </PTC_FareBreakdown>
              <PTC_FareBreakdown>
                <PassengerTypeQuantity Code="CNN" Quantity="1"/>
                <FareBasisCodes>
                  <FareBasisCode ArrivalAirportCode="AER" AvailabilityBreak="true" BookingCode="W" DepartureAirportCode="ZIA" FareComponentBeginAirport="ZIA" FareComponentDirectionality="FROM" FareComponentEndAirport="AER" FareComponentFareRule="U6LF" FareComponentFareTariff="304" FareComponentFareType="EU" FareComponentFareTypeBitmap="01" FareComponentVendorCode="ATP" GovCarrier="U6">WFLRT/CH25</FareBasisCode>
                  <FareBasisCode ArrivalAirportCode="ZIA" AvailabilityBreak="true" BookingCode="W" DepartureAirportCode="AER" FareComponentBeginAirport="AER" FareComponentDirectionality="TO" FareComponentEndAirport="ZIA" FareComponentFareRule="U6LF" FareComponentFareTariff="304" FareComponentFareType="EU" FareComponentFareTypeBitmap="01" FareComponentVendorCode="ATP" GovCarrier="U6">WFLRT/CH25</FareBasisCode>
                </FareBasisCodes>
                <PassengerFare>
                  <BaseFare Amount="4710" CurrencyCode="RUB"/>
                  <FareConstruction Amount="4710" CurrencyCode="RUB" DecimalPlaces="0"/>
                  <EquivFare Amount="4710" CurrencyCode="RUB" DecimalPlaces="0"/>
                  <Taxes>
                    <Tax Amount="2150" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                    <Tax Amount="2150" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                    <Tax Amount="400" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRI"/>
                    <Tax Amount="400" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRI"/>
                    <Tax Amount="38" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                    <Tax Amount="60" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                    <Tax Amount="38" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI4"/>
                    <Tax Amount="60" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI4"/>
                    <TaxSummary Amount="4300" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                    <TaxSummary Amount="800" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRI"/>
                    <TaxSummary Amount="196" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                    <TotalTax Amount="5296" CurrencyCode="RUB" DecimalPlaces="0"/>
                  </Taxes>
                  <TotalFare Amount="10006" CurrencyCode="RUB"/>
                  <PenaltiesInfo>
                    <Penalty Amount="0" Applicability="Before" Changeable="true" ConditionsApply="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                    <Penalty Amount="0" Applicability="After" Changeable="true" ConditionsApply="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                    <Penalty Amount="1500" Applicability="Before" CurrencyCode="RUB" DecimalPlaces="0" Refundable="true" Type="Refund"/>
                    <Penalty Amount="3000" Applicability="After" CurrencyCode="RUB" DecimalPlaces="0" Refundable="true" Type="Refund"/>
                  </PenaltiesInfo>
                  <TPA_Extensions>
                    <FareComponents>
                      <FareComponent BrandID="FL" BrandName="FLEXIBLE" ProgramCode="CFFU6" ProgramDescription="U6 DOMESTIC" ProgramID="83326" ProgramSystemCode="A">
                        <Segment FlightIndex="1" LegIndex="1"/>
                        <BrandFeatureRef FeatureId="15"/>
                        <BrandFeatureRef FeatureId="17"/>
                        <BrandFeatureRef FeatureId="18"/>
                        <BrandFeatureRef FeatureId="20"/>
                        <BrandFeatureRef FeatureId="36"/>
                        <BrandFeatureRef FeatureId="37"/>
                        <BrandFeatureRef FeatureId="86"/>
                        <BrandFeatureRef FeatureId="85"/>
                        <BrandFeatureRef FeatureId="60"/>
                        <BrandFeatureRef FeatureId="51"/>
                        <BrandFeatureRef FeatureId="58"/>
                        <BrandFeatureRef FeatureId="91"/>
                        <BrandFeatureRef FeatureId="94"/>
                        <BrandFeatureRef FeatureId="99"/>
                        <BrandFeatureRef FeatureId="101"/>
                      </FareComponent>
                      <FareComponent BrandID="FL" BrandName="FLEXIBLE" ProgramCode="CFFU6" ProgramDescription="U6 DOMESTIC" ProgramID="83326" ProgramSystemCode="A">
                        <Segment FlightIndex="1" LegIndex="2"/>
                        <BrandFeatureRef FeatureId="15"/>
                        <BrandFeatureRef FeatureId="17"/>
                        <BrandFeatureRef FeatureId="18"/>
                        <BrandFeatureRef FeatureId="20"/>
                        <BrandFeatureRef FeatureId="36"/>
                        <BrandFeatureRef FeatureId="37"/>
                        <BrandFeatureRef FeatureId="86"/>
                        <BrandFeatureRef FeatureId="85"/>
                        <BrandFeatureRef FeatureId="60"/>
                        <BrandFeatureRef FeatureId="51"/>
                        <BrandFeatureRef FeatureId="58"/>
                        <BrandFeatureRef FeatureId="91"/>
                        <BrandFeatureRef FeatureId="94"/>
                        <BrandFeatureRef FeatureId="99"/>
                        <BrandFeatureRef FeatureId="101"/>
                      </FareComponent>
                    </FareComponents>
                    <Messages>
                      <Message AirlineCode="U6" FailCode="0" Info="NONEND" Type="N"/>
                      <Message FailCode="0" Info="EACH CNN REQUIRES ACCOMPANYING SAME CABIN ADT" Type="W"/>
                      <Message FailCode="0" Info="VALIDATING CARRIER" Type="W"/>
                      <Message FailCode="0" Info="BSP - U6" Type="W"/>
                      <Message FailCode="0" Info="GEN - U6" Type="W"/>
                      <Message FailCode="0" Info="TCH - U6" Type="W"/>
                      <Message FailCode="0" Info="CAT 15 SALES RESTRICTIONS FREE TEXT FOUND - VERIFY RULES" Type="W"/>
                    </Messages>
                    <BaggageInformationList>
                      <BaggageInformation AirlineCode="U6" ProvisionType="A">
                        <Segment Id="0"/>
                        <Allowance Pieces="2"/>
                      </BaggageInformation>
                      <BaggageInformation AirlineCode="U6" ProvisionType="A">
                        <Segment Id="1"/>
                        <Allowance Pieces="2"/>
                      </BaggageInformation>
                    </BaggageInformationList>
                  </TPA_Extensions>
                </PassengerFare>
                <Endorsements NonRefundableIndicator="false"/>
                <TPA_Extensions>
                  <FareCalcLine Info="ZIA U6 AER2355U6 ZIA2355RUB4710END"/>
                </TPA_Extensions>
                <FareInfos>
                  <FareInfo>
                    <FareReference>W</FareReference>
                    <TPA_Extensions>
                      <SeatsRemaining BelowMin="false" Number="9"/>
                      <Cabin Cabin="Y"/>
                      <Meal Code="N"/>
                    </TPA_Extensions>
                  </FareInfo>
                  <FareInfo>
                    <FareReference>W</FareReference>
                    <TPA_Extensions>
                      <SeatsRemaining BelowMin="false" Number="9"/>
                      <Cabin Cabin="Y"/>
                      <Meal Code="N"/>
                    </TPA_Extensions>
                  </FareInfo>
                </FareInfos>
              </PTC_FareBreakdown>
              <PTC_FareBreakdown>
                <PassengerTypeQuantity Code="INF" Quantity="1"/>
                <FareBasisCodes>
                  <FareBasisCode ArrivalAirportCode="AER" AvailabilityBreak="true" BookingCode="W" DepartureAirportCode="ZIA" FareComponentBeginAirport="ZIA" FareComponentDirectionality="FROM" FareComponentEndAirport="AER" FareComponentFareRule="U6LF" FareComponentFareTariff="304" FareComponentFareType="EU" FareComponentFareTypeBitmap="01" FareComponentVendorCode="ATP" GovCarrier="U6">WFLRT/IN</FareBasisCode>
                  <FareBasisCode ArrivalAirportCode="ZIA" AvailabilityBreak="true" BookingCode="W" DepartureAirportCode="AER" FareComponentBeginAirport="AER" FareComponentDirectionality="TO" FareComponentEndAirport="ZIA" FareComponentFareRule="U6LF" FareComponentFareTariff="304" FareComponentFareType="EU" FareComponentFareTypeBitmap="01" FareComponentVendorCode="ATP" GovCarrier="U6">WFLRT/IN</FareBasisCode>
                </FareBasisCodes>
                <PassengerFare>
                  <BaseFare Amount="0" CurrencyCode="RUB"/>
                  <FareConstruction Amount="0" CurrencyCode="RUB" DecimalPlaces="0"/>
                  <EquivFare Amount="0" CurrencyCode="RUB" DecimalPlaces="0"/>
                  <TotalFare Amount="0" CurrencyCode="RUB"/>
                  <PenaltiesInfo>
                    <Penalty Amount="0" Applicability="Before" Changeable="true" ConditionsApply="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                    <Penalty Amount="0" Applicability="After" Changeable="true" ConditionsApply="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                    <Penalty Amount="0" Applicability="Before" CurrencyCode="RUB" DecimalPlaces="0" Refundable="true" Type="Refund"/>
                    <Penalty Amount="0" Applicability="After" CurrencyCode="RUB" DecimalPlaces="0" Refundable="true" Type="Refund"/>
                  </PenaltiesInfo>
                  <TPA_Extensions>
                    <FareComponents>
                      <FareComponent BrandID="FL" BrandName="FLEXIBLE" ProgramCode="CFFU6" ProgramDescription="U6 DOMESTIC" ProgramID="83326" ProgramSystemCode="A">
                        <Segment FlightIndex="1" LegIndex="1"/>
                        <BrandFeatureRef FeatureId="15"/>
                        <BrandFeatureRef FeatureId="17"/>
                        <BrandFeatureRef FeatureId="18"/>
                        <BrandFeatureRef FeatureId="20"/>
                        <BrandFeatureRef FeatureId="36"/>
                        <BrandFeatureRef FeatureId="37"/>
                        <BrandFeatureRef FeatureId="86"/>
                        <BrandFeatureRef FeatureId="85"/>
                        <BrandFeatureRef FeatureId="60"/>
                        <BrandFeatureRef FeatureId="51"/>
                        <BrandFeatureRef FeatureId="58"/>
                        <BrandFeatureRef FeatureId="91"/>
                        <BrandFeatureRef FeatureId="94"/>
                        <BrandFeatureRef FeatureId="99"/>
                        <BrandFeatureRef FeatureId="101"/>
                      </FareComponent>
                      <FareComponent BrandID="FL" BrandName="FLEXIBLE" ProgramCode="CFFU6" ProgramDescription="U6 DOMESTIC" ProgramID="83326" ProgramSystemCode="A">
                        <Segment FlightIndex="1" LegIndex="2"/>
                        <BrandFeatureRef FeatureId="15"/>
                        <BrandFeatureRef FeatureId="17"/>
                        <BrandFeatureRef FeatureId="18"/>
                        <BrandFeatureRef FeatureId="20"/>
                        <BrandFeatureRef FeatureId="36"/>
                        <BrandFeatureRef FeatureId="37"/>
                        <BrandFeatureRef FeatureId="86"/>
                        <BrandFeatureRef FeatureId="85"/>
                        <BrandFeatureRef FeatureId="60"/>
                        <BrandFeatureRef FeatureId="51"/>
                        <BrandFeatureRef FeatureId="58"/>
                        <BrandFeatureRef FeatureId="91"/>
                        <BrandFeatureRef FeatureId="94"/>
                        <BrandFeatureRef FeatureId="99"/>
                        <BrandFeatureRef FeatureId="101"/>
                      </FareComponent>
                    </FareComponents>
                    <Messages>
                      <Message AirlineCode="U6" FailCode="0" Info="NONEND" Type="N"/>
                      <Message FailCode="0" Info="EACH INF REQUIRES ACCOMPANYING ADT PASSENGER" Type="W"/>
                      <Message FailCode="0" Info="VALIDATING CARRIER" Type="W"/>
                      <Message FailCode="0" Info="BSP - U6" Type="W"/>
                      <Message FailCode="0" Info="GEN - U6" Type="W"/>
                      <Message FailCode="0" Info="TCH - U6" Type="W"/>
                      <Message FailCode="0" Info="CAT 15 SALES RESTRICTIONS FREE TEXT FOUND - VERIFY RULES" Type="W"/>
                    </Messages>
                    <BaggageInformationList>
                      <BaggageInformation AirlineCode="U6" ProvisionType="A">
                        <Segment Id="0"/>
                        <Allowance Unit="kg" Weight="10"/>
                      </BaggageInformation>
                      <BaggageInformation AirlineCode="U6" ProvisionType="A">
                        <Segment Id="1"/>
                        <Allowance Unit="kg" Weight="10"/>
                      </BaggageInformation>
                    </BaggageInformationList>
                  </TPA_Extensions>
                </PassengerFare>
                <Endorsements NonRefundableIndicator="false"/>
                <TPA_Extensions>
                  <FareCalcLine Info="ZIA U6 AER0U6 ZIA0RUB0END"/>
                </TPA_Extensions>
                <FareInfos>
                  <FareInfo>
                    <FareReference>W</FareReference>
                    <TPA_Extensions>
                      <SeatsRemaining BelowMin="false" Number="9"/>
                      <Cabin Cabin="Y"/>
                      <Meal Code="N"/>
                    </TPA_Extensions>
                  </FareInfo>
                  <FareInfo>
                    <FareReference>W</FareReference>
                    <TPA_Extensions>
                      <SeatsRemaining BelowMin="false" Number="9"/>
                      <Cabin Cabin="Y"/>
                      <Meal Code="N"/>
                    </TPA_Extensions>
                  </FareInfo>
                </FareInfos>
              </PTC_FareBreakdown>
            </PTC_FareBreakdowns>
            <FareInfos>
              <FareInfo>
                <FareReference>W</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="N"/>
                </TPA_Extensions>
              </FareInfo>
              <FareInfo>
                <FareReference>W</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="N"/>
                </TPA_Extensions>
              </FareInfo>
            </FareInfos>
            <TPA_Extensions>
              <DivideInParty Indicator="false"/>
              <AncillaryFeeGroups Message="ADDTL AIR EXTRAS APPLY - REFINE REQUEST">
                <AncillaryFeeGroup Code="BG" Name="BAGGAGE">
                  <AncillaryFeeItem Amount="2000" AncillaryTypeCode="F" BaggageID="1" Carrier="U6" Date="2020-09-01" Description="FIRST EXCESS BAG" Description1="FIRST BAG" DestinationAirport="AER" EndSegment="1" OriginAirport="ZIA" PassengerCode="ADT" StartSegment="1" Subcode="0CC"/>
                  <AncillaryFeeItem Amount="2500" AncillaryTypeCode="F" BaggageID="2" Carrier="U6" Date="2020-09-01" Description="FIRST EXCESS BAG" Description1="FIRST BAG" DestinationAirport="AER" EndSegment="1" OriginAirport="ZIA" PassengerCode="ALL" StartSegment="1" Subcode="0CC"/>
                  <AncillaryFeeItem Amount="2000" AncillaryTypeCode="F" BaggageID="3" Carrier="U6" Date="2020-09-01" Description="SECOND EXCESS BAG" Description1="SECOND BAG" DestinationAirport="AER" EndSegment="1" OriginAirport="ZIA" PassengerCode="ADT" StartSegment="1" Subcode="0CD"/>
                  <AncillaryFeeItem Amount="2500" AncillaryTypeCode="F" BaggageID="4" Carrier="U6" Date="2020-09-01" Description="SECOND EXCESS BAG" Description1="SECOND BAG" DestinationAirport="AER" EndSegment="1" OriginAirport="ZIA" PassengerCode="ALL" StartSegment="1" Subcode="0CD"/>
                  <AncillaryFeeItem Amount="2000" AncillaryTypeCode="F" BaggageID="5" Carrier="U6" Date="2020-09-01" Description="THIRD EXCESS BAG" Description1="THIRD BAG" DestinationAirport="AER" EndSegment="1" OriginAirport="ZIA" PassengerCode="ADT" StartSegment="1" Subcode="0CE"/>
                  <AncillaryFeeItem Amount="2500" AncillaryTypeCode="F" BaggageID="6" Carrier="U6" Date="2020-09-01" Description="THIRD EXCESS BAG" Description1="THIRD BAG" DestinationAirport="AER" EndSegment="1" OriginAirport="ZIA" PassengerCode="ALL" StartSegment="1" Subcode="0CE"/>
                  <AncillaryFeeItem Amount="2000" AncillaryTypeCode="F" BaggageID="7" Carrier="U6" Date="2020-09-01" Description="UPTO22LB 10KG BAGGAGE" Description1="UP TO 22 POUNDS/10 KILOGRAMS" DestinationAirport="AER" EndSegment="1" OriginAirport="ZIA" PassengerCode="ALL" StartSegment="1" Subcode="0CZ"/>
                  <AncillaryFeeItem Amount="2000" AncillaryTypeCode="F" BaggageID="8" Carrier="U6" Date="2020-09-01" Description="EXCESS WEIGHT SPECIAL CHARGE" Description1="EXCESS WEIGHT" Description2="SPECIAL CHARGE" DestinationAirport="AER" EndSegment="1" OriginAirport="ZIA" PassengerCode="ALL" StartSegment="1" Subcode="0H6"/>
                  <AncillaryFeeItem Amount="2500" AncillaryTypeCode="F" BaggageID="9" Carrier="U6" Date="2020-09-01" Description="EXTRA CARRYON BG" Description1="EXCESS SIZE" Description2="SPECIAL CHARGE" DestinationAirport="AER" EndSegment="1" OriginAirport="ZIA" PassengerCode="ALL" StartSegment="1" Subcode="0H7"/>
                  <AncillaryFeeItem Amount="2500" AncillaryTypeCode="F" BaggageID="10" Carrier="U6" Date="2020-09-01" Description="CARRY ON HAND BAGGAGE" DestinationAirport="AER" EndSegment="1" OriginAirport="ZIA" PassengerCode="ALL" StartSegment="1" Subcode="0L5" Subgroup="CY"/>
                  <AncillaryFeeItem Amount="2000" AncillaryTypeCode="F" BaggageID="11" Carrier="U6" Date="2020-09-08" Description="FIRST EXCESS BAG" Description1="FIRST BAG" DestinationAirport="ZIA" EndSegment="2" OriginAirport="AER" PassengerCode="ADT" StartSegment="2" Subcode="0CC"/>
                  <AncillaryFeeItem Amount="2500" AncillaryTypeCode="F" BaggageID="12" Carrier="U6" Date="2020-09-08" Description="FIRST EXCESS BAG" Description1="FIRST BAG" DestinationAirport="ZIA" EndSegment="2" OriginAirport="AER" PassengerCode="ALL" StartSegment="2" Subcode="0CC"/>
                  <AncillaryFeeItem Amount="2500" AncillaryTypeCode="F" BaggageID="13" Carrier="U6" Date="2020-09-08" Description="SECOND EXCESS BAG" Description1="SECOND BAG" DestinationAirport="ZIA" EndSegment="2" OriginAirport="AER" PassengerCode="ALL" StartSegment="2" Subcode="0CD"/>
                  <AncillaryFeeItem Amount="2500" AncillaryTypeCode="F" BaggageID="14" Carrier="U6" Date="2020-09-08" Description="THIRD EXCESS BAG" Description1="THIRD BAG" DestinationAirport="ZIA" EndSegment="2" OriginAirport="AER" PassengerCode="ALL" StartSegment="2" Subcode="0CE"/>
                  <AncillaryFeeItem Amount="2000" AncillaryTypeCode="F" BaggageID="15" Carrier="U6" Date="2020-09-08" Description="UPTO22LB 10KG BAGGAGE" Description1="UP TO 22 POUNDS/10 KILOGRAMS" DestinationAirport="ZIA" EndSegment="2" OriginAirport="AER" PassengerCode="ALL" StartSegment="2" Subcode="0CZ"/>
                  <AncillaryFeeItem Amount="2000" AncillaryTypeCode="F" BaggageID="16" Carrier="U6" Date="2020-09-08" Description="EXCESS WEIGHT SPECIAL CHARGE" Description1="EXCESS WEIGHT" Description2="SPECIAL CHARGE" DestinationAirport="ZIA" EndSegment="2" OriginAirport="AER" PassengerCode="ALL" StartSegment="2" Subcode="0H6"/>
                  <AncillaryFeeItem Amount="2500" AncillaryTypeCode="F" BaggageID="17" Carrier="U6" Date="2020-09-08" Description="EXTRA CARRYON BG" Description1="EXCESS SIZE" Description2="SPECIAL CHARGE" DestinationAirport="ZIA" EndSegment="2" OriginAirport="AER" PassengerCode="ALL" StartSegment="2" Subcode="0H7"/>
                  <AncillaryFeeItem Amount="2500" AncillaryTypeCode="F" BaggageID="18" Carrier="U6" Date="2020-09-08" Description="CARRY ON HAND BAGGAGE" DestinationAirport="ZIA" EndSegment="2" OriginAirport="AER" PassengerCode="ALL" StartSegment="2" Subcode="0L5" Subgroup="CY"/>
                </AncillaryFeeGroup>
                <OrderStandardBag>
                  <PassengerBags Code="ADT">
                    <BaggageSequenceOrder BaggageID="1" StandardBag="1"/>
                    <BaggageSequenceOrder BaggageID="3" StandardBag="2"/>
                    <BaggageSequenceOrder BaggageID="5" StandardBag="3"/>
                    <BaggageSequenceOrder BaggageID="11" StandardBag="1"/>
                    <BaggageSequenceOrder BaggageID="13" StandardBag="2"/>
                    <BaggageSequenceOrder BaggageID="14" StandardBag="3"/>
                  </PassengerBags>
                  <PassengerBags Code="CNN">
                    <BaggageSequenceOrder BaggageID="2" StandardBag="1"/>
                    <BaggageSequenceOrder BaggageID="4" StandardBag="2"/>
                    <BaggageSequenceOrder BaggageID="6" StandardBag="3"/>
                    <BaggageSequenceOrder BaggageID="12" StandardBag="1"/>
                    <BaggageSequenceOrder BaggageID="13" StandardBag="2"/>
                    <BaggageSequenceOrder BaggageID="14" StandardBag="3"/>
                  </PassengerBags>
                  <PassengerBags Code="INF">
                    <BaggageSequenceOrder BaggageID="2" StandardBag="1"/>
                    <BaggageSequenceOrder BaggageID="4" StandardBag="2"/>
                    <BaggageSequenceOrder BaggageID="6" StandardBag="3"/>
                    <BaggageSequenceOrder BaggageID="12" StandardBag="1"/>
                    <BaggageSequenceOrder BaggageID="13" StandardBag="2"/>
                    <BaggageSequenceOrder BaggageID="14" StandardBag="3"/>
                  </PassengerBags>
                </OrderStandardBag>
              </AncillaryFeeGroups>
              <ValidatingCarrier NewVcxProcess="true" SettlementMethod="BSP">
                <Default Code="U6"/>
              </ValidatingCarrier>
              <ValidatingCarrier NewVcxProcess="true" SettlementMethod="TCH">
                <Default Code="U6"/>
              </ValidatingCarrier>
              <ValidatingCarrier NewVcxProcess="true" SettlementMethod="GEN">
                <Default Code="U6"/>
              </ValidatingCarrier>
            </TPA_Extensions>
          </AirItineraryPricingInfo>
          <TicketingInfo TicketType="eTicket" ValidInterline="Yes"/>
        </AdditionalFares>
        <ValidatingCarrier Code="U6"/>
        <DiversitySwapper WeighedPriceAmount="14065.6"/>
      </TPA_Extensions>
    </PricedItinerary>
    <!--Другие варианты перелетов-->
  </PricedItineraries>
</OTA_AirLowFareSearchRS>
{% endxmlsec %}

---

{% xmlsec "Пример запроса (получение расчетов стоимости по всем доступным брендам, GIR ответ)", false %}
<OTA_AirLowFareSearchRQ ResponseType="GIR" Version="6.1.0" xmlns="http://www.opentravel.org/OTA/2003/05">
  <POS>
    <Source PseudoCityCode="9LSC">
      <RequestorID ID="1" Type="1">
        <CompanyName Code="TN"/>
      </RequestorID>
    </Source>
  </POS>
  <OriginDestinationInformation RPH="1">
    <DepartureDateTime>2020-09-01T11:00:00</DepartureDateTime>
    <OriginLocation LocationCode="MOW"/>
    <DestinationLocation LocationCode="AER"/>
  </OriginDestinationInformation>
  <OriginDestinationInformation RPH="2">
    <DepartureDateTime>2020-09-08T11:00:00</DepartureDateTime>
    <OriginLocation LocationCode="AER"/>
    <DestinationLocation LocationCode="MOW"/>
  </OriginDestinationInformation>
  <TravelPreferences ValidInterlineTicket="true">
    <CabinPref Cabin="Economy" PreferLevel="Preferred"/>
    <TPA_Extensions>
      <LongConnectTime Enable="true"/>
      <LongConnectPoints Max="3" Min="1"/>
      <KeepSameCabin Enabled="true"/>
      <ExcludeCallDirectCarriers Enabled="true"/>
      <DiversityParameters AdditionalNonStopsPercentage="100"/>
    </TPA_Extensions>
    <AncillaryFees Enable="true">
      <AncillaryFeeGroup Code="BG"/>
    </AncillaryFees>
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
        <BrandedFareIndicators ItinParityBrandlessLeg="true" ItinParityFallbackMode="LegParity" MultipleBrandedFares="true" ParityMode="Itin" ReturnBrandAncillaries="true"/>
      </TPA_Extensions>
    </PriceRequestInformation>
  </TravelerInfoSummary>
  <TPA_Extensions>
    <IntelliSellTransaction>
      <RequestType Name="200ITINS"/>
    </IntelliSellTransaction>
  </TPA_Extensions>
</OTA_AirLowFareSearchRQ>
{% endxmlsec %}

{% xmlsec "Пример ответа", false %}
<GroupedItineraryResponse Version="6.1.0" xmlns="http://webservices.sabre.com/wsdl/sabreXML1.0.00/shopping/GroupedItineraryResponse" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <Message Code="TRANSACTIONID" Severity="Info" Text="7553006373383408513" Type="WORKERTHREAD"/>
  <Message Code="ASE032LPSPIL981.IDM.SGDCPROD.SABRE.COM" Severity="Info" Text="27039" Type="SERVER"/>
  <Message Code="RULEID" Severity="Info" Text="15936" Type="DRE"/>
  <Message Code="RULEID" Severity="Info" Text="24467" Type="DEFAULT"/>
  <Statistics Itineraries="290"/>
  <ScheduleDesc ETicketable="true" ElapsedTime="140" Frequency="SMTW***" ID="1" Stops="0" TotalMilesFlown="847">
    <Departure Airport="AER" City="AER" Country="RU" Time="09:45:00+03:00"/>
    <Arrival Airport="VKO" City="MOW" Country="RU" Time="12:05:00+03:00"/>
    <Carrier Disclosure="DP" Marketing="H1" MarketingFlightNumber="1537" Operating="H1" OperatingFlightNumber="1537">
      <Equipment Code="737" TypeForFirstLeg="N" TypeForLastLeg="N"/>
    </Carrier>
  </ScheduleDesc>
  <ScheduleDesc ETicketable="true" ElapsedTime="135" Frequency="SMTWTFS" ID="2" Stops="0" TotalMilesFlown="847">
    <Departure Airport="AER" City="AER" Country="RU" Time="04:25:00+03:00"/>
    <Arrival Airport="VKO" City="MOW" Country="RU" Time="06:40:00+03:00"/>
    <Carrier Disclosure="DP" Marketing="H1" MarketingFlightNumber="1435" Operating="H1" OperatingFlightNumber="1435">
      <Equipment Code="737" TypeForFirstLeg="N" TypeForLastLeg="N"/>
    </Carrier>
  </ScheduleDesc>
  <ScheduleDesc ETicketable="true" ElapsedTime="150" Frequency="**T*T**" ID="3" Stops="0" TotalMilesFlown="831">
    <Departure Airport="DME" City="MOW" Country="RU" Time="10:20:00+03:00"/>
    <Arrival Airport="AER" City="AER" Country="RU" Time="12:50:00+03:00"/>
    <Carrier Marketing="U6" MarketingFlightNumber="377" Operating="U6" OperatingFlightNumber="377">
      <Equipment Code="320" TypeForFirstLeg="N" TypeForLastLeg="N"/>
    </Carrier>
  </ScheduleDesc>
  <ScheduleDesc ETicketable="true" ElapsedTime="120" Frequency="SMTWTFS" ID="4" Stops="0" TotalMilesFlown="840">
    <Departure Airport="AER" City="AER" Country="RU" Time="16:30:00+03:00"/>
    <Arrival Airport="ZIA" City="MOW" Country="RU" Time="18:30:00+03:00"/>
    <Carrier Marketing="U6" MarketingFlightNumber="1310" Operating="U6" OperatingFlightNumber="1310">
      <Equipment Code="320" TypeForFirstLeg="N" TypeForLastLeg="N"/>
    </Carrier>
  </ScheduleDesc>
  <ScheduleDesc ETicketable="true" ElapsedTime="140" Frequency="SMTWTFS" ID="5" Stops="0" TotalMilesFlown="847">
    <Departure Airport="AER" City="AER" Country="RU" Time="08:00:00+03:00"/>
    <Arrival Airport="VKO" City="MOW" Country="RU" Time="10:20:00+03:00"/>
    <Carrier Disclosure="DP" Marketing="H1" MarketingFlightNumber="1379" Operating="H1" OperatingFlightNumber="1379">
      <Equipment Code="737" TypeForFirstLeg="N" TypeForLastLeg="N"/>
    </Carrier>
  </ScheduleDesc>
  <!--Другие рейсы-->
  <TaxDesc Amount="810" Code="YQF" Currency="RUB" Description="SERVICE FEE - CARRIER-IMPOSED FUEL" ID="1" PublishedAmount="10.00" PublishedCurrency="EUR" Station="DME"/>
  <TaxDesc Amount="270" Code="YRF" Currency="RUB" Description="SERVICE FEE - CARRIER-IMPOSED FUEL" ID="2" PublishedAmount="270" PublishedCurrency="RUB" Station="AER"/>
  <TaxDesc Amount="190" Code="YQI" Currency="RUB" Description="SERVICE FEE - CARRIER-IMPOSED MISC" ID="3" PublishedAmount="190" PublishedCurrency="RUB" Station="SVO"/>
  <TaxDesc Amount="105" Code="RI4" Country="RU" Currency="RUB" Description="TERMINAL USE CHARGE DOMESTIC ARRIVAL" ID="4" PublishedAmount="105" PublishedCurrency="RUB" Station="AER"/>
  <TaxDesc Amount="1500" Code="YQF" Currency="RUB" Description="SERVICE FEE - CARRIER-IMPOSED FUEL" ID="5" PublishedAmount="1500" PublishedCurrency="RUB" Station="SVO"/>
  <!--Другие таксы-->
  <TaxSummaryDesc Amount="450" Code="RI3" Country="RU" Currency="RUB" Description="TERMINAL USE CHARGE DOMESTIC DEPARTURE" ID="1" PublishedAmount="105" PublishedCurrency="RUB" Station="DME"/>
  <TaxSummaryDesc Amount="304" Code="RI3" Country="RU" Currency="RUB" Description="TERMINAL USE CHARGE DOMESTIC DEPARTURE" ID="2" PublishedAmount="92" PublishedCurrency="RUB" Station="SVO"/>
  <TaxSummaryDesc Amount="2960" Code="YQF" Currency="RUB" Description="SERVICE FEE - CARRIER-IMPOSED FUEL" ID="3" PublishedAmount="10.00" PublishedCurrency="EUR" Station="DME"/>
  <TaxSummaryDesc Amount="211" Code="RI3" Country="RU" Currency="RUB" Description="TERMINAL USE CHARGE DOMESTIC DEPARTURE" ID="4" PublishedAmount="38" PublishedCurrency="RUB" Station="ZIA"/>
  <TaxSummaryDesc Amount="226" Code="RI3" Country="RU" Currency="RUB" Description="TERMINAL USE CHARGE DOMESTIC DEPARTURE" ID="5" PublishedAmount="53" PublishedCurrency="RUB" Station="DME"/>
  <!--Другие таксы-->
  <BrandFeatureDesc Application="C" CommercialName="SECOND EXCESS BAG" ID="1" ServiceGroup="BG" ServiceType="C" SubCode="0CD" Vendor="ATP"/>
  <BrandFeatureDesc Application="F" CommercialName="UPTO50LB 23KG AND62LI 158LCM" ID="2" ServiceGroup="BG" ServiceType="C" SubCode="0GO" Vendor="ATP"/>
  <BrandFeatureDesc Application="F" CommercialName="1ST GOLF EQPMT UPTO 20KG" ID="3" ServiceGroup="BG" ServiceType="C" SubCode="0DC" Vendor="ATP"/>
  <BrandFeatureDesc Application="F" CommercialName="CABIN BAG UPTO 10KG 55X40X25CM" ID="4" ServiceGroup="BG" ServiceType="C" SubCode="08A" Vendor="ATP"/>
  <BrandFeatureDesc Application="C" CommercialName="UPGRADE AT CHECKIN TO COMFORT" ID="5" ServiceGroup="BF" ServiceType="Z" SubCode="UT2" Vendor="ATP"/>
  <!--Другие услуги-->
  <FareComponentDesc ApplicablePricingCategories="4 5 10 15 16 18" Direction="EH" Directionality="TO" FareAmount="6335" FareBasisCode="QFLRT" FareCurrency="RUB" FarePassengerType="ADT" FareRule="SFLX" FareTariff="304" FareType="XEX" FareTypeBitmap="00" GoverningCarrier="S7" ID="1" NotValidAfter="2021-06-28" PublishedFareAmount="12670" VendorCode="ATP">
    <Segment/>
    <Brand BrandName="FLEX ECONOMY" Code="YFL" ProgramCode="S7SM" ProgramDescription="SMART CHOICE" ProgramID="84277" ProgramSystemCode="S"/>
  </FareComponentDesc>
  <FareComponentDesc ApplicablePricingCategories="4 5 10 15 16 18 19" Direction="EH" Directionality="FROM" FareAmount="3852" FareBasisCode="QBSRT/CH25" FareCurrency="RUB" FarePassengerType="CNN" FareRule="SBSC" FareTariff="304" FareType="XAT" FareTypeBitmap="01" GoverningCarrier="S7" ID="2" NotValidAfter="2021-06-18" PublishedFareAmount="7705" TicketDesignator="CH25" VendorCode="ATP">
    <Segment Stopover="true"/>
    <Brand BrandName="BASIC ECONOMY" Code="YBS" ProgramCode="S7SM" ProgramDescription="SMART CHOICE" ProgramID="84277" ProgramSystemCode="S"/>
  </FareComponentDesc>
  <FareComponentDesc ApplicablePricingCategories="4 5 10 15 16 18 19" Direction="EH" Directionality="FROM" FareBasisCode="QBSRT/IN00" FarePassengerType="INF" FareRule="SBSC" FareTariff="304" FareType="XAT" FareTypeBitmap="01" GoverningCarrier="S7" ID="3" NotValidAfter="2021-06-18" PublishedFareAmount="0" TicketDesignator="IN00" VendorCode="ATP">
    <Segment Stopover="true"/>
    <Brand BrandName="BASIC ECONOMY" Code="YBS" ProgramCode="S7SM" ProgramDescription="SMART CHOICE" ProgramID="84277" ProgramSystemCode="S"/>
  </FareComponentDesc>
  <FareComponentDesc ApplicablePricingCategories="7 10 15 16 18 19" Direction="EH" Directionality="FROM" FareBasisCode="VLTRT/IN00" FarePassengerType="INF" FareRule="UT22" FareTariff="304" FareType="XEL" FareTypeBitmap="01" GoverningCarrier="UT" ID="4" NotValidAfter="2020-09-01" NotValidBefore="2020-09-01" PublishedFareAmount="0" TicketDesignator="IN00" VendorCode="ATP">
    <Segment Stopover="true"/>
    <Brand BrandName="ECONOMY MINIMUM" Code="MN" ProgramCode="BUT" ProgramDescription="BRANDED FARES UT 5" ProgramID="86060" ProgramSystemCode="B"/>
  </FareComponentDesc>
  <FareComponentDesc ApplicablePricingCategories="4 5 10 15 16 18 19" Direction="EH" Directionality="TO" FareAmount="4753" FareBasisCode="QFLRT/CH25" FareCurrency="RUB" FarePassengerType="CNN" FareRule="SFLX" FareTariff="304" FareType="XEX" FareTypeBitmap="01" GoverningCarrier="S7" ID="5" NotValidAfter="2021-06-28" PublishedFareAmount="9505" TicketDesignator="CH25" VendorCode="ATP">
    <Segment/>
    <Brand BrandName="FLEX ECONOMY" Code="YFL" ProgramCode="S7SM" ProgramDescription="SMART CHOICE" ProgramID="84277" ProgramSystemCode="S"/>
  </FareComponentDesc>
  <!--Другие компоненты тарифов-->
  <ValidatingCarrierDesc ID="1" NewVcxProcess="true" SettlementMethod="BSP">
    <Default Code="HR"/>
  </ValidatingCarrierDesc>
  <ValidatingCarrierDesc ID="2" NewVcxProcess="true" SettlementMethod="BSP">
    <Default Code="R3"/>
  </ValidatingCarrierDesc>
  <ValidatingCarrierDesc ID="3" NewVcxProcess="true" SettlementMethod="BSP">
    <Default Code="S7"/>
  </ValidatingCarrierDesc>
  <ValidatingCarrierDesc ID="4" NewVcxProcess="true" SettlementMethod="TCH">
    <Default Code="U6"/>
  </ValidatingCarrierDesc>
  <ValidatingCarrierDesc ID="5" NewVcxProcess="true" SettlementMethod="TCH">
    <Default Code="UT"/>
  </ValidatingCarrierDesc>
  <!--Другие валидирующие перевозчики-->
  <BaggageAllowanceDesc Description1="UP TO 50 POUNDS/23 KILOGRAMS" Description2="UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS" ID="1" Pieces="2"/>
  <BaggageAllowanceDesc Description1="UP TO 22 POUNDS/10 KILOGRAMS" Description2="UP TO 45 LINEAR INCHES/115 LINEAR CENTIMETERS" ID="2" Pieces="1"/>
  <BaggageAllowanceDesc Description1="UP TO 44 POUNDS/20 KILOGRAMS" ID="3" Pieces="1"/>
  <BaggageAllowanceDesc ID="4" Pieces="0"/>
  <BaggageAllowanceDesc ID="5" Pieces="2"/>
  <!--Другие нормы провоза багажа-->
  <LegDesc ElapsedTime="145" ID="1">
    <Schedule Ref="59"/>
  </LegDesc>
  <LegDesc ElapsedTime="135" ID="2">
    <Schedule Ref="60"/>
  </LegDesc>
  <LegDesc ElapsedTime="150" ID="3">
    <Schedule Ref="57"/>
  </LegDesc>
  <LegDesc ElapsedTime="145" ID="4">
    <Schedule Ref="58"/>
  </LegDesc>
  <LegDesc ElapsedTime="140" ID="5">
    <Schedule Ref="54"/>
  </LegDesc>
  <!--Другие плечи-->
  <ItineraryGroup>
    <GroupDescription>
      <LegDescription ArrivalLocation="AER" DepartureDate="2020-09-01" DepartureLocation="DME"/>
      <LegDescription ArrivalLocation="DME" DepartureDate="2020-09-08" DepartureLocation="AER"/>
    </GroupDescription>
    <Itinerary ID="1" PricingSource="ADVJR1">
      <Leg Ref="15"/>
      <Leg Ref="13"/>
      <PricingInformation PricingSubsource="MIP">
        <Fare ETicketable="true" GoverningCarriers="U6 U6" LastTicketDate="2020-05-13" LastTicketTime="23:59" VITA="true" ValidatingCarrierCode="U6">
          <PassengerInfo NonRefundable="true" PassengerNumber="2" PassengerType="ADT">
            <FareComponent Ref="10">
              <Segment AvailabilityBreak="true" BookingCode="W" CabinCode="Y" SeatsAvailable="9"/>
              <BrandFeature Ref="62"/>
              <BrandFeature Ref="107"/>
              <BrandFeature Ref="42"/>
              <BrandFeature Ref="85"/>
              <BrandFeature Ref="53"/>
              <BrandFeature Ref="16"/>
              <BrandFeature Ref="57"/>
              <BrandFeature Ref="8"/>
              <BrandFeature Ref="52"/>
              <BrandFeature Ref="35"/>
              <BrandFeature Ref="71"/>
              <BrandFeature Ref="63"/>
              <BrandFeature Ref="24"/>
              <BrandFeature Ref="82"/>
              <BrandFeature Ref="48"/>
            </FareComponent>
            <FareComponent Ref="187">
              <Segment AvailabilityBreak="true" BookingCode="W" CabinCode="Y" MealCode="N" SeatsAvailable="9"/>
              <BrandFeature Ref="62"/>
              <BrandFeature Ref="107"/>
              <BrandFeature Ref="42"/>
              <BrandFeature Ref="85"/>
              <BrandFeature Ref="53"/>
              <BrandFeature Ref="16"/>
              <BrandFeature Ref="57"/>
              <BrandFeature Ref="8"/>
              <BrandFeature Ref="52"/>
              <BrandFeature Ref="35"/>
              <BrandFeature Ref="71"/>
              <BrandFeature Ref="63"/>
              <BrandFeature Ref="24"/>
              <BrandFeature Ref="82"/>
              <BrandFeature Ref="48"/>
            </FareComponent>
            <Tax Ref="12"/>
            <Tax Ref="8"/>
            <Tax Ref="45"/>
            <Tax Ref="10"/>
            <Tax Ref="31"/>
            <Tax Ref="35"/>
            <Tax Ref="4"/>
            <Tax Ref="13"/>
            <TaxSummary Ref="18"/>
            <TaxSummary Ref="29"/>
            <TaxSummary Ref="1"/>
            <CurrencyConversion ExchangeRateUsed="1" From="RUB" To="RUB"/>
            <FareMessage Carrier="U6" Code="0" Info="NONEND" Type="N"/>
            <FareMessage Code="0" Info="VALIDATING CARRIER" Type="W"/>
            <FareMessage Code="0" Info="BSP - U6" Type="W"/>
            <FareMessage Code="0" Info="GEN - U6" Type="W"/>
            <FareMessage Code="0" Info="TCH - U6" Type="W"/>
            <FareMessage Code="0" Info="CAT 15 SALES RESTRICTIONS FREE TEXT FOUND - VERIFY RULES" Type="W"/>
            <PassengerTotalFare BaseFareAmount="1280" BaseFareCurrency="RUB" CommissionAmount="0" CommissionPercentage="0" ConstructionAmount="1280" ConstructionCurrency="RUB" Currency="RUB" EquivalentAmount="1280" EquivalentCurrency="RUB" ExchangeRateOne="76.8000000" TotalFare="6830" TotalTaxes="5550"/>
            <BaggageInformation AirlineCode="U6" ProvisionType="A">
              <Segment ID="0"/>
              <Allowance Ref="14"/>
            </BaggageInformation>
            <BaggageInformation AirlineCode="U6" ProvisionType="A">
              <Segment ID="1"/>
              <Allowance Ref="14"/>
            </BaggageInformation>
            <PenaltiesInfo>
              <Penalty Amount="0" Applicability="Before" Changeable="true" ConditionsApply="true" Currency="RUB" Type="Exchange"/>
              <Penalty Amount="3000" Applicability="After" Changeable="true" ConditionsApply="true" Currency="RUB" Type="Exchange"/>
              <Penalty Applicability="Before" Refundable="false" Type="Refund"/>
              <Penalty Applicability="After" Refundable="false" Type="Refund"/>
            </PenaltiesInfo>
          </PassengerInfo>
          <PassengerInfo NonRefundable="true" PassengerNumber="1" PassengerType="CNN">
            <FareComponent Ref="207">
              <Segment AvailabilityBreak="true" BookingCode="W" CabinCode="Y" SeatsAvailable="9"/>
              <BrandFeature Ref="62"/>
              <BrandFeature Ref="107"/>
              <BrandFeature Ref="42"/>
              <BrandFeature Ref="85"/>
              <BrandFeature Ref="53"/>
              <BrandFeature Ref="16"/>
              <BrandFeature Ref="57"/>
              <BrandFeature Ref="8"/>
              <BrandFeature Ref="52"/>
              <BrandFeature Ref="35"/>
              <BrandFeature Ref="71"/>
              <BrandFeature Ref="63"/>
              <BrandFeature Ref="24"/>
              <BrandFeature Ref="82"/>
              <BrandFeature Ref="48"/>
            </FareComponent>
            <FareComponent Ref="121">
              <Segment AvailabilityBreak="true" BookingCode="W" CabinCode="Y" MealCode="N" SeatsAvailable="9"/>
              <BrandFeature Ref="62"/>
              <BrandFeature Ref="107"/>
              <BrandFeature Ref="42"/>
              <BrandFeature Ref="85"/>
              <BrandFeature Ref="53"/>
              <BrandFeature Ref="16"/>
              <BrandFeature Ref="57"/>
              <BrandFeature Ref="8"/>
              <BrandFeature Ref="52"/>
              <BrandFeature Ref="35"/>
              <BrandFeature Ref="71"/>
              <BrandFeature Ref="63"/>
              <BrandFeature Ref="24"/>
              <BrandFeature Ref="82"/>
              <BrandFeature Ref="48"/>
            </FareComponent>
            <Tax Ref="12"/>
            <Tax Ref="8"/>
            <Tax Ref="45"/>
            <Tax Ref="10"/>
            <Tax Ref="25"/>
            <Tax Ref="14"/>
            <Tax Ref="32"/>
            <Tax Ref="16"/>
            <TaxSummary Ref="18"/>
            <TaxSummary Ref="29"/>
            <TaxSummary Ref="5"/>
            <CurrencyConversion ExchangeRateUsed="1" From="RUB" To="RUB"/>
            <FareMessage Carrier="U6" Code="0" Info="NONEND" Type="N"/>
            <FareMessage Code="0" Info="EACH CNN REQUIRES ACCOMPANYING SAME CABIN ADT" Type="W"/>
            <FareMessage Code="0" Info="VALIDATING CARRIER" Type="W"/>
            <FareMessage Code="0" Info="BSP - U6" Type="W"/>
            <FareMessage Code="0" Info="GEN - U6" Type="W"/>
            <FareMessage Code="0" Info="TCH - U6" Type="W"/>
            <FareMessage Code="0" Info="CAT 15 SALES RESTRICTIONS FREE TEXT FOUND - VERIFY RULES" Type="W"/>
            <PassengerTotalFare BaseFareAmount="960" BaseFareCurrency="RUB" CommissionAmount="0" CommissionPercentage="0" ConstructionAmount="960" ConstructionCurrency="RUB" Currency="RUB" EquivalentAmount="960" EquivalentCurrency="RUB" ExchangeRateOne="76.8000000" TotalFare="6286" TotalTaxes="5326"/>
            <BaggageInformation AirlineCode="U6" ProvisionType="A">
              <Segment ID="0"/>
              <Allowance Ref="14"/>
            </BaggageInformation>
            <BaggageInformation AirlineCode="U6" ProvisionType="A">
              <Segment ID="1"/>
              <Allowance Ref="14"/>
            </BaggageInformation>
            <PenaltiesInfo>
              <Penalty Amount="0" Applicability="Before" Changeable="true" ConditionsApply="true" Currency="RUB" Type="Exchange"/>
              <Penalty Amount="3000" Applicability="After" Changeable="true" ConditionsApply="true" Currency="RUB" Type="Exchange"/>
              <Penalty Applicability="Before" Refundable="false" Type="Refund"/>
              <Penalty Applicability="After" Refundable="false" Type="Refund"/>
            </PenaltiesInfo>
          </PassengerInfo>
          <PassengerInfo NonRefundable="false" PassengerNumber="1" PassengerType="INF">
            <FareComponent Ref="92">
              <Segment AvailabilityBreak="true" BookingCode="W" CabinCode="Y" SeatsAvailable="9"/>
              <BrandFeature Ref="62"/>
              <BrandFeature Ref="107"/>
              <BrandFeature Ref="42"/>
              <BrandFeature Ref="85"/>
              <BrandFeature Ref="53"/>
              <BrandFeature Ref="16"/>
              <BrandFeature Ref="57"/>
              <BrandFeature Ref="8"/>
              <BrandFeature Ref="52"/>
              <BrandFeature Ref="35"/>
              <BrandFeature Ref="71"/>
              <BrandFeature Ref="63"/>
              <BrandFeature Ref="24"/>
              <BrandFeature Ref="82"/>
              <BrandFeature Ref="48"/>
            </FareComponent>
            <FareComponent Ref="217">
              <Segment AvailabilityBreak="true" BookingCode="W" CabinCode="Y" MealCode="N" SeatsAvailable="9"/>
              <BrandFeature Ref="62"/>
              <BrandFeature Ref="107"/>
              <BrandFeature Ref="42"/>
              <BrandFeature Ref="85"/>
              <BrandFeature Ref="53"/>
              <BrandFeature Ref="16"/>
              <BrandFeature Ref="57"/>
              <BrandFeature Ref="8"/>
              <BrandFeature Ref="52"/>
              <BrandFeature Ref="35"/>
              <BrandFeature Ref="71"/>
              <BrandFeature Ref="63"/>
              <BrandFeature Ref="24"/>
              <BrandFeature Ref="82"/>
              <BrandFeature Ref="48"/>
            </FareComponent>
            <CurrencyConversion ExchangeRateUsed="1" From="RUB" To="RUB"/>
            <FareMessage Carrier="U6" Code="0" Info="NONEND" Type="N"/>
            <FareMessage Code="0" Info="EACH INF REQUIRES ACCOMPANYING ADT PASSENGER" Type="W"/>
            <FareMessage Code="0" Info="VALIDATING CARRIER" Type="W"/>
            <FareMessage Code="0" Info="BSP - U6" Type="W"/>
            <FareMessage Code="0" Info="GEN - U6" Type="W"/>
            <FareMessage Code="0" Info="TCH - U6" Type="W"/>
            <FareMessage Code="0" Info="CAT 15 SALES RESTRICTIONS FREE TEXT FOUND - VERIFY RULES" Type="W"/>
            <PassengerTotalFare BaseFareAmount="0" BaseFareCurrency="RUB" CommissionAmount="0" CommissionPercentage="0" ConstructionAmount="0" ConstructionCurrency="RUB" Currency="RUB" EquivalentAmount="0" EquivalentCurrency="RUB" ExchangeRateOne="76.8000000" TotalFare="0" TotalTaxes="0"/>
            <BaggageInformation AirlineCode="U6" ProvisionType="A">
              <Segment ID="0"/>
              <Allowance Ref="14"/>
            </BaggageInformation>
            <BaggageInformation AirlineCode="U6" ProvisionType="A">
              <Segment ID="1"/>
              <Allowance Ref="14"/>
            </BaggageInformation>
            <PenaltiesInfo>
              <Penalty Amount="0" Applicability="Before" Changeable="true" ConditionsApply="true" Currency="RUB" Type="Exchange"/>
              <Penalty Amount="0" Applicability="After" Changeable="true" ConditionsApply="true" Currency="RUB" Type="Exchange"/>
              <Penalty Applicability="Before" Refundable="false" Type="Refund"/>
              <Penalty Applicability="After" Refundable="false" Type="Refund"/>
            </PenaltiesInfo>
          </PassengerInfo>
          <AncillaryFeeGroup Message="ADDTL AIR EXTRAS APPLY - REFINE REQUEST">
            <AncillaryFee Code="BG" Name="BAGGAGE">
              <Details Amount="2000" AncillaryTypeCode="F" BaggageID="1" Carrier="U6" Code="ADT" DepartureDate="2020-09-01" Description="FIRST EXCESS BAG" Description1="FIRST BAG" Destination="AER" EndSegment="1" Origin="DME" StartSegment="1" Subcode="0CC"/>
              <Details Amount="2500" AncillaryTypeCode="F" BaggageID="2" Carrier="U6" Code="ALL" DepartureDate="2020-09-01" Description="FIRST EXCESS BAG" Description1="FIRST BAG" Destination="AER" EndSegment="1" Origin="DME" StartSegment="1" Subcode="0CC"/>
              <Details Amount="2500" AncillaryTypeCode="F" BaggageID="3" Carrier="U6" Code="ALL" DepartureDate="2020-09-01" Description="SECOND EXCESS BAG" Description1="SECOND BAG" Destination="AER" EndSegment="1" Origin="DME" StartSegment="1" Subcode="0CD"/>
              <Details Amount="2000" AncillaryTypeCode="F" BaggageID="4" Carrier="U6" Code="ADT" DepartureDate="2020-09-01" Description="SECOND EXCESS BAG" Description1="SECOND BAG" Destination="AER" EndSegment="1" Origin="DME" StartSegment="1" Subcode="0CD"/>
              <Details Amount="2000" AncillaryTypeCode="F" BaggageID="5" Carrier="U6" Code="ADT" DepartureDate="2020-09-01" Description="THIRD EXCESS BAG" Description1="THIRD BAG" Destination="AER" EndSegment="1" Origin="DME" StartSegment="1" Subcode="0CE"/>
              <Details Amount="2500" AncillaryTypeCode="F" BaggageID="6" Carrier="U6" Code="ALL" DepartureDate="2020-09-01" Description="THIRD EXCESS BAG" Description1="THIRD BAG" Destination="AER" EndSegment="1" Origin="DME" StartSegment="1" Subcode="0CE"/>
              <Details Amount="2000" AncillaryTypeCode="F" BaggageID="7" Carrier="U6" Code="ALL" DepartureDate="2020-09-01" Description="UPTO22LB 10KG BAGGAGE" Description1="UP TO 22 POUNDS/10 KILOGRAMS" Destination="AER" EndSegment="1" Origin="DME" StartSegment="1" Subcode="0CZ"/>
              <Details Amount="2000" AncillaryTypeCode="F" BaggageID="8" Carrier="U6" Code="ALL" DepartureDate="2020-09-01" Description="EXCESS WEIGHT SPECIAL CHARGE" Description1="EXCESS WEIGHT" Description2="SPECIAL CHARGE" Destination="AER" EndSegment="1" Origin="DME" StartSegment="1" Subcode="0H6"/>
              <Details Amount="2500" AncillaryTypeCode="F" BaggageID="9" Carrier="U6" Code="ALL" DepartureDate="2020-09-01" Description="EXTRA CARRYON BG" Description1="EXCESS SIZE" Description2="SPECIAL CHARGE" Destination="AER" EndSegment="1" Origin="DME" StartSegment="1" Subcode="0H7"/>
              <Details Amount="2500" AncillaryTypeCode="F" BaggageID="10" Carrier="U6" Code="ALL" DepartureDate="2020-09-01" Description="CARRY ON HAND BAGGAGE" Destination="AER" EndSegment="1" Origin="DME" StartSegment="1" Subcode="0L5" Subgroup="CY"/>
              <Details Amount="2000" AncillaryTypeCode="F" BaggageID="11" Carrier="U6" Code="ADT" DepartureDate="2020-09-08" Description="FIRST EXCESS BAG" Description1="FIRST BAG" Destination="DME" EndSegment="2" Origin="AER" StartSegment="2" Subcode="0CC"/>
              <Details Amount="2500" AncillaryTypeCode="F" BaggageID="12" Carrier="U6" Code="ALL" DepartureDate="2020-09-08" Description="FIRST EXCESS BAG" Description1="FIRST BAG" Destination="DME" EndSegment="2" Origin="AER" StartSegment="2" Subcode="0CC"/>
              <Details Amount="2500" AncillaryTypeCode="F" BaggageID="13" Carrier="U6" Code="ALL" DepartureDate="2020-09-08" Description="SECOND EXCESS BAG" Description1="SECOND BAG" Destination="DME" EndSegment="2" Origin="AER" StartSegment="2" Subcode="0CD"/>
              <Details Amount="2500" AncillaryTypeCode="F" BaggageID="14" Carrier="U6" Code="ALL" DepartureDate="2020-09-08" Description="THIRD EXCESS BAG" Description1="THIRD BAG" Destination="DME" EndSegment="2" Origin="AER" StartSegment="2" Subcode="0CE"/>
              <Details Amount="2000" AncillaryTypeCode="F" BaggageID="15" Carrier="U6" Code="ALL" DepartureDate="2020-09-08" Description="UPTO22LB 10KG BAGGAGE" Description1="UP TO 22 POUNDS/10 KILOGRAMS" Destination="DME" EndSegment="2" Origin="AER" StartSegment="2" Subcode="0CZ"/>
              <Details Amount="2000" AncillaryTypeCode="F" BaggageID="16" Carrier="U6" Code="ALL" DepartureDate="2020-09-08" Description="EXCESS WEIGHT SPECIAL CHARGE" Description1="EXCESS WEIGHT" Description2="SPECIAL CHARGE" Destination="DME" EndSegment="2" Origin="AER" StartSegment="2" Subcode="0H6"/>
              <Details Amount="2500" AncillaryTypeCode="F" BaggageID="17" Carrier="U6" Code="ALL" DepartureDate="2020-09-08" Description="EXTRA CARRYON BG" Description1="EXCESS SIZE" Description2="SPECIAL CHARGE" Destination="DME" EndSegment="2" Origin="AER" StartSegment="2" Subcode="0H7"/>
              <Details Amount="2500" AncillaryTypeCode="F" BaggageID="18" Carrier="U6" Code="ALL" DepartureDate="2020-09-08" Description="CARRY ON HAND BAGGAGE" Destination="DME" EndSegment="2" Origin="AER" StartSegment="2" Subcode="0L5" Subgroup="CY"/>
            </AncillaryFee>
            <OrderStandardBag>
              <PassengerBags Code="ADT">
                <BaggageSequenceOrder BaggageRef="1" StandardBag="1"/>
                <BaggageSequenceOrder BaggageRef="3" StandardBag="2"/>
                <BaggageSequenceOrder BaggageRef="5" StandardBag="3"/>
                <BaggageSequenceOrder BaggageRef="11" StandardBag="1"/>
                <BaggageSequenceOrder BaggageRef="13" StandardBag="2"/>
                <BaggageSequenceOrder BaggageRef="14" StandardBag="3"/>
              </PassengerBags>
              <PassengerBags Code="CNN">
                <BaggageSequenceOrder BaggageRef="2" StandardBag="1"/>
                <BaggageSequenceOrder BaggageRef="3" StandardBag="2"/>
                <BaggageSequenceOrder BaggageRef="6" StandardBag="3"/>
                <BaggageSequenceOrder BaggageRef="12" StandardBag="1"/>
                <BaggageSequenceOrder BaggageRef="13" StandardBag="2"/>
                <BaggageSequenceOrder BaggageRef="14" StandardBag="3"/>
              </PassengerBags>
              <PassengerBags Code="INF">
                <BaggageSequenceOrder BaggageRef="2" StandardBag="1"/>
                <BaggageSequenceOrder BaggageRef="3" StandardBag="2"/>
                <BaggageSequenceOrder BaggageRef="6" StandardBag="3"/>
                <BaggageSequenceOrder BaggageRef="12" StandardBag="1"/>
                <BaggageSequenceOrder BaggageRef="13" StandardBag="2"/>
                <BaggageSequenceOrder BaggageRef="14" StandardBag="3"/>
              </PassengerBags>
            </OrderStandardBag>
          </AncillaryFeeGroup>
          <TotalFare BaseFareAmount="3520" BaseFareCurrency="RUB" ConstructionAmount="3520" ConstructionCurrency="RUB" Currency="RUB" EquivalentAmount="3520" EquivalentCurrency="RUB" TotalPrice="19946" TotalTaxes="16426"/>
          <ValidatingCarrier Ref="12"/>
          <ValidatingCarrier Ref="4"/>
          <ValidatingCarrier Ref="6"/>
        </Fare>
      </PricingInformation>
      <PricingInformation PricingSubsource="MIP">
        <Fare ETicketable="true" GoverningCarriers="U6 U6" LastTicketDate="2020-05-13" LastTicketTime="23:59" VITA="true" ValidatingCarrierCode="U6">
          <PassengerInfo NonRefundable="false" PassengerNumber="2" PassengerType="ADT">
            <FareComponent Ref="194">
              <Segment AvailabilityBreak="true" BookingCode="W" CabinCode="Y" SeatsAvailable="9"/>
              <BrandFeature Ref="27"/>
              <BrandFeature Ref="107"/>
              <BrandFeature Ref="103"/>
              <BrandFeature Ref="45"/>
              <BrandFeature Ref="53"/>
              <BrandFeature Ref="16"/>
              <BrandFeature Ref="57"/>
              <BrandFeature Ref="8"/>
              <BrandFeature Ref="65"/>
              <BrandFeature Ref="39"/>
              <BrandFeature Ref="94"/>
              <BrandFeature Ref="63"/>
              <BrandFeature Ref="24"/>
              <BrandFeature Ref="82"/>
              <BrandFeature Ref="48"/>
            </FareComponent>
            <FareComponent Ref="206">
              <Segment AvailabilityBreak="true" BookingCode="W" CabinCode="Y" MealCode="N" SeatsAvailable="9"/>
              <BrandFeature Ref="27"/>
              <BrandFeature Ref="107"/>
              <BrandFeature Ref="103"/>
              <BrandFeature Ref="45"/>
              <BrandFeature Ref="53"/>
              <BrandFeature Ref="16"/>
              <BrandFeature Ref="57"/>
              <BrandFeature Ref="8"/>
              <BrandFeature Ref="65"/>
              <BrandFeature Ref="39"/>
              <BrandFeature Ref="94"/>
              <BrandFeature Ref="63"/>
              <BrandFeature Ref="24"/>
              <BrandFeature Ref="82"/>
              <BrandFeature Ref="48"/>
            </FareComponent>
            <Tax Ref="12"/>
            <Tax Ref="8"/>
            <Tax Ref="45"/>
            <Tax Ref="10"/>
            <Tax Ref="31"/>
            <Tax Ref="35"/>
            <Tax Ref="4"/>
            <Tax Ref="13"/>
            <TaxSummary Ref="18"/>
            <TaxSummary Ref="29"/>
            <TaxSummary Ref="1"/>
            <CurrencyConversion ExchangeRateUsed="1" From="RUB" To="RUB"/>
            <FareMessage Carrier="U6" Code="0" Info="NONEND" Type="N"/>
            <FareMessage Code="0" Info="VALIDATING CARRIER" Type="W"/>
            <FareMessage Code="0" Info="BSP - U6" Type="W"/>
            <FareMessage Code="0" Info="GEN - U6" Type="W"/>
            <FareMessage Code="0" Info="TCH - U6" Type="W"/>
            <FareMessage Code="0" Info="CAT 15 SALES RESTRICTIONS FREE TEXT FOUND - VERIFY RULES" Type="W"/>
            <PassengerTotalFare BaseFareAmount="2280" BaseFareCurrency="RUB" CommissionAmount="0" CommissionPercentage="0" ConstructionAmount="2280" ConstructionCurrency="RUB" Currency="RUB" EquivalentAmount="2280" EquivalentCurrency="RUB" ExchangeRateOne="76.8000000" TotalFare="7830" TotalTaxes="5550"/>
            <BaggageInformation AirlineCode="U6" ProvisionType="A">
              <Segment ID="0"/>
              <Allowance Ref="15"/>
            </BaggageInformation>
            <BaggageInformation AirlineCode="U6" ProvisionType="A">
              <Segment ID="1"/>
              <Allowance Ref="15"/>
            </BaggageInformation>
            <PenaltiesInfo>
              <Penalty Amount="0" Applicability="Before" Changeable="true" ConditionsApply="true" Currency="RUB" Type="Exchange"/>
              <Penalty Amount="0" Applicability="After" Changeable="true" ConditionsApply="true" Currency="RUB" Type="Exchange"/>
              <Penalty Amount="1500" Applicability="Before" Currency="RUB" Refundable="true" Type="Refund"/>
              <Penalty Amount="3000" Applicability="After" Currency="RUB" Refundable="true" Type="Refund"/>
            </PenaltiesInfo>
          </PassengerInfo>
          <PassengerInfo NonRefundable="false" PassengerNumber="1" PassengerType="CNN">
            <FareComponent Ref="174">
              <Segment AvailabilityBreak="true" BookingCode="W" CabinCode="Y" SeatsAvailable="9"/>
              <BrandFeature Ref="27"/>
              <BrandFeature Ref="107"/>
              <BrandFeature Ref="103"/>
              <BrandFeature Ref="45"/>
              <BrandFeature Ref="53"/>
              <BrandFeature Ref="16"/>
              <BrandFeature Ref="57"/>
              <BrandFeature Ref="8"/>
              <BrandFeature Ref="65"/>
              <BrandFeature Ref="39"/>
              <BrandFeature Ref="94"/>
              <BrandFeature Ref="63"/>
              <BrandFeature Ref="24"/>
              <BrandFeature Ref="82"/>
              <BrandFeature Ref="48"/>
            </FareComponent>
            <FareComponent Ref="119">
              <Segment AvailabilityBreak="true" BookingCode="W" CabinCode="Y" MealCode="N" SeatsAvailable="9"/>
              <BrandFeature Ref="27"/>
              <BrandFeature Ref="107"/>
              <BrandFeature Ref="103"/>
              <BrandFeature Ref="45"/>
              <BrandFeature Ref="53"/>
              <BrandFeature Ref="16"/>
              <BrandFeature Ref="57"/>
              <BrandFeature Ref="8"/>
              <BrandFeature Ref="65"/>
              <BrandFeature Ref="39"/>
              <BrandFeature Ref="94"/>
              <BrandFeature Ref="63"/>
              <BrandFeature Ref="24"/>
              <BrandFeature Ref="82"/>
              <BrandFeature Ref="48"/>
            </FareComponent>
            <Tax Ref="12"/>
            <Tax Ref="8"/>
            <Tax Ref="45"/>
            <Tax Ref="10"/>
            <Tax Ref="25"/>
            <Tax Ref="14"/>
            <Tax Ref="32"/>
            <Tax Ref="16"/>
            <TaxSummary Ref="18"/>
            <TaxSummary Ref="29"/>
            <TaxSummary Ref="5"/>
            <CurrencyConversion ExchangeRateUsed="1" From="RUB" To="RUB"/>
            <FareMessage Carrier="U6" Code="0" Info="NONEND" Type="N"/>
            <FareMessage Code="0" Info="EACH CNN REQUIRES ACCOMPANYING SAME CABIN ADT" Type="W"/>
            <FareMessage Code="0" Info="VALIDATING CARRIER" Type="W"/>
            <FareMessage Code="0" Info="BSP - U6" Type="W"/>
            <FareMessage Code="0" Info="GEN - U6" Type="W"/>
            <FareMessage Code="0" Info="TCH - U6" Type="W"/>
            <FareMessage Code="0" Info="CAT 15 SALES RESTRICTIONS FREE TEXT FOUND - VERIFY RULES" Type="W"/>
            <PassengerTotalFare BaseFareAmount="1710" BaseFareCurrency="RUB" CommissionAmount="0" CommissionPercentage="0" ConstructionAmount="1710" ConstructionCurrency="RUB" Currency="RUB" EquivalentAmount="1710" EquivalentCurrency="RUB" ExchangeRateOne="76.8000000" TotalFare="7036" TotalTaxes="5326"/>
            <BaggageInformation AirlineCode="U6" ProvisionType="A">
              <Segment ID="0"/>
              <Allowance Ref="15"/>
            </BaggageInformation>
            <BaggageInformation AirlineCode="U6" ProvisionType="A">
              <Segment ID="1"/>
              <Allowance Ref="15"/>
            </BaggageInformation>
            <PenaltiesInfo>
              <Penalty Amount="0" Applicability="Before" Changeable="true" ConditionsApply="true" Currency="RUB" Type="Exchange"/>
              <Penalty Amount="0" Applicability="After" Changeable="true" ConditionsApply="true" Currency="RUB" Type="Exchange"/>
              <Penalty Amount="1500" Applicability="Before" Currency="RUB" Refundable="true" Type="Refund"/>
              <Penalty Amount="3000" Applicability="After" Currency="RUB" Refundable="true" Type="Refund"/>
            </PenaltiesInfo>
          </PassengerInfo>
          <PassengerInfo NonRefundable="false" PassengerNumber="1" PassengerType="INF">
            <FareComponent Ref="79">
              <Segment AvailabilityBreak="true" BookingCode="W" CabinCode="Y" SeatsAvailable="9"/>
              <BrandFeature Ref="27"/>
              <BrandFeature Ref="107"/>
              <BrandFeature Ref="103"/>
              <BrandFeature Ref="45"/>
              <BrandFeature Ref="53"/>
              <BrandFeature Ref="16"/>
              <BrandFeature Ref="57"/>
              <BrandFeature Ref="8"/>
              <BrandFeature Ref="65"/>
              <BrandFeature Ref="39"/>
              <BrandFeature Ref="94"/>
              <BrandFeature Ref="63"/>
              <BrandFeature Ref="24"/>
              <BrandFeature Ref="82"/>
              <BrandFeature Ref="48"/>
            </FareComponent>
            <FareComponent Ref="151">
              <Segment AvailabilityBreak="true" BookingCode="W" CabinCode="Y" MealCode="N" SeatsAvailable="9"/>
              <BrandFeature Ref="27"/>
              <BrandFeature Ref="107"/>
              <BrandFeature Ref="103"/>
              <BrandFeature Ref="45"/>
              <BrandFeature Ref="53"/>
              <BrandFeature Ref="16"/>
              <BrandFeature Ref="57"/>
              <BrandFeature Ref="8"/>
              <BrandFeature Ref="65"/>
              <BrandFeature Ref="39"/>
              <BrandFeature Ref="94"/>
              <BrandFeature Ref="63"/>
              <BrandFeature Ref="24"/>
              <BrandFeature Ref="82"/>
              <BrandFeature Ref="48"/>
            </FareComponent>
            <CurrencyConversion ExchangeRateUsed="1" From="RUB" To="RUB"/>
            <FareMessage Carrier="U6" Code="0" Info="NONEND" Type="N"/>
            <FareMessage Code="0" Info="EACH INF REQUIRES ACCOMPANYING ADT PASSENGER" Type="W"/>
            <FareMessage Code="0" Info="VALIDATING CARRIER" Type="W"/>
            <FareMessage Code="0" Info="BSP - U6" Type="W"/>
            <FareMessage Code="0" Info="GEN - U6" Type="W"/>
            <FareMessage Code="0" Info="TCH - U6" Type="W"/>
            <FareMessage Code="0" Info="CAT 15 SALES RESTRICTIONS FREE TEXT FOUND - VERIFY RULES" Type="W"/>
            <PassengerTotalFare BaseFareAmount="0" BaseFareCurrency="RUB" CommissionAmount="0" CommissionPercentage="0" ConstructionAmount="0" ConstructionCurrency="RUB" Currency="RUB" EquivalentAmount="0" EquivalentCurrency="RUB" ExchangeRateOne="76.8000000" TotalFare="0" TotalTaxes="0"/>
            <BaggageInformation AirlineCode="U6" ProvisionType="A">
              <Segment ID="0"/>
              <Allowance Ref="14"/>
            </BaggageInformation>
            <BaggageInformation AirlineCode="U6" ProvisionType="A">
              <Segment ID="1"/>
              <Allowance Ref="14"/>
            </BaggageInformation>
            <PenaltiesInfo>
              <Penalty Amount="0" Applicability="Before" Changeable="true" ConditionsApply="true" Currency="RUB" Type="Exchange"/>
              <Penalty Amount="0" Applicability="After" Changeable="true" ConditionsApply="true" Currency="RUB" Type="Exchange"/>
              <Penalty Amount="0" Applicability="Before" Currency="RUB" Refundable="true" Type="Refund"/>
              <Penalty Amount="0" Applicability="After" Currency="RUB" Refundable="true" Type="Refund"/>
            </PenaltiesInfo>
          </PassengerInfo>
          <AncillaryFeeGroup Message="ADDTL AIR EXTRAS APPLY - REFINE REQUEST">
            <AncillaryFee Code="BG" Name="BAGGAGE">
              <Details Amount="2000" AncillaryTypeCode="F" BaggageID="1" Carrier="U6" Code="ADT" DepartureDate="2020-09-01" Description="FIRST EXCESS BAG" Description1="FIRST BAG" Destination="AER" EndSegment="1" Origin="DME" StartSegment="1" Subcode="0CC"/>
              <Details Amount="2500" AncillaryTypeCode="F" BaggageID="2" Carrier="U6" Code="ALL" DepartureDate="2020-09-01" Description="FIRST EXCESS BAG" Description1="FIRST BAG" Destination="AER" EndSegment="1" Origin="DME" StartSegment="1" Subcode="0CC"/>
              <Details Amount="2500" AncillaryTypeCode="F" BaggageID="3" Carrier="U6" Code="ALL" DepartureDate="2020-09-01" Description="SECOND EXCESS BAG" Description1="SECOND BAG" Destination="AER" EndSegment="1" Origin="DME" StartSegment="1" Subcode="0CD"/>
              <Details Amount="2000" AncillaryTypeCode="F" BaggageID="4" Carrier="U6" Code="ADT" DepartureDate="2020-09-01" Description="SECOND EXCESS BAG" Description1="SECOND BAG" Destination="AER" EndSegment="1" Origin="DME" StartSegment="1" Subcode="0CD"/>
              <Details Amount="2000" AncillaryTypeCode="F" BaggageID="5" Carrier="U6" Code="ADT" DepartureDate="2020-09-01" Description="THIRD EXCESS BAG" Description1="THIRD BAG" Destination="AER" EndSegment="1" Origin="DME" StartSegment="1" Subcode="0CE"/>
              <Details Amount="2500" AncillaryTypeCode="F" BaggageID="6" Carrier="U6" Code="ALL" DepartureDate="2020-09-01" Description="THIRD EXCESS BAG" Description1="THIRD BAG" Destination="AER" EndSegment="1" Origin="DME" StartSegment="1" Subcode="0CE"/>
              <Details Amount="2000" AncillaryTypeCode="F" BaggageID="7" Carrier="U6" Code="ALL" DepartureDate="2020-09-01" Description="UPTO22LB 10KG BAGGAGE" Description1="UP TO 22 POUNDS/10 KILOGRAMS" Destination="AER" EndSegment="1" Origin="DME" StartSegment="1" Subcode="0CZ"/>
              <Details Amount="2000" AncillaryTypeCode="F" BaggageID="8" Carrier="U6" Code="ALL" DepartureDate="2020-09-01" Description="EXCESS WEIGHT SPECIAL CHARGE" Description1="EXCESS WEIGHT" Description2="SPECIAL CHARGE" Destination="AER" EndSegment="1" Origin="DME" StartSegment="1" Subcode="0H6"/>
              <Details Amount="2500" AncillaryTypeCode="F" BaggageID="9" Carrier="U6" Code="ALL" DepartureDate="2020-09-01" Description="EXTRA CARRYON BG" Description1="EXCESS SIZE" Description2="SPECIAL CHARGE" Destination="AER" EndSegment="1" Origin="DME" StartSegment="1" Subcode="0H7"/>
              <Details Amount="2500" AncillaryTypeCode="F" BaggageID="10" Carrier="U6" Code="ALL" DepartureDate="2020-09-01" Description="CARRY ON HAND BAGGAGE" Destination="AER" EndSegment="1" Origin="DME" StartSegment="1" Subcode="0L5" Subgroup="CY"/>
              <Details Amount="2000" AncillaryTypeCode="F" BaggageID="11" Carrier="U6" Code="ADT" DepartureDate="2020-09-08" Description="FIRST EXCESS BAG" Description1="FIRST BAG" Destination="DME" EndSegment="2" Origin="AER" StartSegment="2" Subcode="0CC"/>
              <Details Amount="2500" AncillaryTypeCode="F" BaggageID="12" Carrier="U6" Code="ALL" DepartureDate="2020-09-08" Description="FIRST EXCESS BAG" Description1="FIRST BAG" Destination="DME" EndSegment="2" Origin="AER" StartSegment="2" Subcode="0CC"/>
              <Details Amount="2500" AncillaryTypeCode="F" BaggageID="13" Carrier="U6" Code="ALL" DepartureDate="2020-09-08" Description="SECOND EXCESS BAG" Description1="SECOND BAG" Destination="DME" EndSegment="2" Origin="AER" StartSegment="2" Subcode="0CD"/>
              <Details Amount="2500" AncillaryTypeCode="F" BaggageID="14" Carrier="U6" Code="ALL" DepartureDate="2020-09-08" Description="THIRD EXCESS BAG" Description1="THIRD BAG" Destination="DME" EndSegment="2" Origin="AER" StartSegment="2" Subcode="0CE"/>
              <Details Amount="2000" AncillaryTypeCode="F" BaggageID="15" Carrier="U6" Code="ALL" DepartureDate="2020-09-08" Description="UPTO22LB 10KG BAGGAGE" Description1="UP TO 22 POUNDS/10 KILOGRAMS" Destination="DME" EndSegment="2" Origin="AER" StartSegment="2" Subcode="0CZ"/>
              <Details Amount="2000" AncillaryTypeCode="F" BaggageID="16" Carrier="U6" Code="ALL" DepartureDate="2020-09-08" Description="EXCESS WEIGHT SPECIAL CHARGE" Description1="EXCESS WEIGHT" Description2="SPECIAL CHARGE" Destination="DME" EndSegment="2" Origin="AER" StartSegment="2" Subcode="0H6"/>
              <Details Amount="2500" AncillaryTypeCode="F" BaggageID="17" Carrier="U6" Code="ALL" DepartureDate="2020-09-08" Description="EXTRA CARRYON BG" Description1="EXCESS SIZE" Description2="SPECIAL CHARGE" Destination="DME" EndSegment="2" Origin="AER" StartSegment="2" Subcode="0H7"/>
              <Details Amount="2500" AncillaryTypeCode="F" BaggageID="18" Carrier="U6" Code="ALL" DepartureDate="2020-09-08" Description="CARRY ON HAND BAGGAGE" Destination="DME" EndSegment="2" Origin="AER" StartSegment="2" Subcode="0L5" Subgroup="CY"/>
            </AncillaryFee>
            <OrderStandardBag>
              <PassengerBags Code="ADT">
                <BaggageSequenceOrder BaggageRef="1" StandardBag="1"/>
                <BaggageSequenceOrder BaggageRef="3" StandardBag="2"/>
                <BaggageSequenceOrder BaggageRef="5" StandardBag="3"/>
                <BaggageSequenceOrder BaggageRef="11" StandardBag="1"/>
                <BaggageSequenceOrder BaggageRef="13" StandardBag="2"/>
                <BaggageSequenceOrder BaggageRef="14" StandardBag="3"/>
              </PassengerBags>
              <PassengerBags Code="CNN">
                <BaggageSequenceOrder BaggageRef="2" StandardBag="1"/>
                <BaggageSequenceOrder BaggageRef="3" StandardBag="2"/>
                <BaggageSequenceOrder BaggageRef="6" StandardBag="3"/>
                <BaggageSequenceOrder BaggageRef="12" StandardBag="1"/>
                <BaggageSequenceOrder BaggageRef="13" StandardBag="2"/>
                <BaggageSequenceOrder BaggageRef="14" StandardBag="3"/>
              </PassengerBags>
              <PassengerBags Code="INF">
                <BaggageSequenceOrder BaggageRef="2" StandardBag="1"/>
                <BaggageSequenceOrder BaggageRef="3" StandardBag="2"/>
                <BaggageSequenceOrder BaggageRef="6" StandardBag="3"/>
                <BaggageSequenceOrder BaggageRef="12" StandardBag="1"/>
                <BaggageSequenceOrder BaggageRef="13" StandardBag="2"/>
                <BaggageSequenceOrder BaggageRef="14" StandardBag="3"/>
              </PassengerBags>
            </OrderStandardBag>
          </AncillaryFeeGroup>
          <TotalFare BaseFareAmount="6270" BaseFareCurrency="RUB" ConstructionAmount="6270" ConstructionCurrency="RUB" Currency="RUB" EquivalentAmount="6270" EquivalentCurrency="RUB" TotalPrice="22696" TotalTaxes="16426"/>
          <ValidatingCarrier Ref="12"/>
          <ValidatingCarrier Ref="4"/>
          <ValidatingCarrier Ref="6"/>
        </Fare>
      </PricingInformation>
      <PricingInformation PricingSubsource="MIP">
        <Fare ETicketable="true" GoverningCarriers="U6 U6" LastTicketDate="2020-05-13" LastTicketTime="23:59" VITA="true" ValidatingCarrierCode="U6">
          <PassengerInfo NonRefundable="false" PassengerNumber="2" PassengerType="ADT">
            <FareComponent Ref="17">
              <Segment AvailabilityBreak="true" BookingCode="W" CabinCode="Y" SeatsAvailable="9"/>
              <BrandFeature Ref="27"/>
              <BrandFeature Ref="107"/>
              <BrandFeature Ref="103"/>
              <BrandFeature Ref="45"/>
              <BrandFeature Ref="53"/>
              <BrandFeature Ref="16"/>
              <BrandFeature Ref="57"/>
              <BrandFeature Ref="8"/>
              <BrandFeature Ref="65"/>
              <BrandFeature Ref="39"/>
              <BrandFeature Ref="14"/>
              <BrandFeature Ref="63"/>
              <BrandFeature Ref="24"/>
              <BrandFeature Ref="82"/>
              <BrandFeature Ref="48"/>
            </FareComponent>
            <FareComponent Ref="8">
              <Segment AvailabilityBreak="true" BookingCode="W" CabinCode="Y" MealCode="N" SeatsAvailable="9"/>
              <BrandFeature Ref="27"/>
              <BrandFeature Ref="107"/>
              <BrandFeature Ref="103"/>
              <BrandFeature Ref="45"/>
              <BrandFeature Ref="53"/>
              <BrandFeature Ref="16"/>
              <BrandFeature Ref="57"/>
              <BrandFeature Ref="8"/>
              <BrandFeature Ref="65"/>
              <BrandFeature Ref="39"/>
              <BrandFeature Ref="14"/>
              <BrandFeature Ref="63"/>
              <BrandFeature Ref="24"/>
              <BrandFeature Ref="82"/>
              <BrandFeature Ref="48"/>
            </FareComponent>
            <Tax Ref="12"/>
            <Tax Ref="8"/>
            <Tax Ref="45"/>
            <Tax Ref="10"/>
            <Tax Ref="31"/>
            <Tax Ref="35"/>
            <Tax Ref="4"/>
            <Tax Ref="13"/>
            <TaxSummary Ref="18"/>
            <TaxSummary Ref="29"/>
            <TaxSummary Ref="1"/>
            <CurrencyConversion ExchangeRateUsed="1" From="RUB" To="RUB"/>
            <FareMessage Carrier="U6" Code="0" Info="NONEND" Type="N"/>
            <FareMessage Code="0" Info="VALIDATING CARRIER" Type="W"/>
            <FareMessage Code="0" Info="BSP - U6" Type="W"/>
            <FareMessage Code="0" Info="GEN - U6" Type="W"/>
            <FareMessage Code="0" Info="TCH - U6" Type="W"/>
            <FareMessage Code="0" Info="CAT 15 SALES RESTRICTIONS FREE TEXT FOUND - VERIFY RULES" Type="W"/>
            <PassengerTotalFare BaseFareAmount="6280" BaseFareCurrency="RUB" CommissionAmount="0" CommissionPercentage="0" ConstructionAmount="6280" ConstructionCurrency="RUB" Currency="RUB" EquivalentAmount="6280" EquivalentCurrency="RUB" ExchangeRateOne="76.8000000" TotalFare="11830" TotalTaxes="5550"/>
            <BaggageInformation AirlineCode="U6" ProvisionType="A">
              <Segment ID="0"/>
              <Allowance Ref="5"/>
            </BaggageInformation>
            <BaggageInformation AirlineCode="U6" ProvisionType="A">
              <Segment ID="1"/>
              <Allowance Ref="5"/>
            </BaggageInformation>
            <PenaltiesInfo>
              <Penalty Amount="0" Applicability="Before" Changeable="true" ConditionsApply="true" Currency="RUB" Type="Exchange"/>
              <Penalty Amount="0" Applicability="After" Changeable="true" ConditionsApply="true" Currency="RUB" Type="Exchange"/>
              <Penalty Amount="1500" Applicability="Before" Currency="RUB" Refundable="true" Type="Refund"/>
              <Penalty Amount="3000" Applicability="After" Currency="RUB" Refundable="true" Type="Refund"/>
            </PenaltiesInfo>
          </PassengerInfo>
          <PassengerInfo NonRefundable="false" PassengerNumber="1" PassengerType="CNN">
            <FareComponent Ref="184">
              <Segment AvailabilityBreak="true" BookingCode="W" CabinCode="Y" SeatsAvailable="9"/>
              <BrandFeature Ref="27"/>
              <BrandFeature Ref="107"/>
              <BrandFeature Ref="103"/>
              <BrandFeature Ref="45"/>
              <BrandFeature Ref="53"/>
              <BrandFeature Ref="16"/>
              <BrandFeature Ref="57"/>
              <BrandFeature Ref="8"/>
              <BrandFeature Ref="65"/>
              <BrandFeature Ref="39"/>
              <BrandFeature Ref="14"/>
              <BrandFeature Ref="63"/>
              <BrandFeature Ref="24"/>
              <BrandFeature Ref="82"/>
              <BrandFeature Ref="48"/>
            </FareComponent>
            <FareComponent Ref="56">
              <Segment AvailabilityBreak="true" BookingCode="W" CabinCode="Y" MealCode="N" SeatsAvailable="9"/>
              <BrandFeature Ref="27"/>
              <BrandFeature Ref="107"/>
              <BrandFeature Ref="103"/>
              <BrandFeature Ref="45"/>
              <BrandFeature Ref="53"/>
              <BrandFeature Ref="16"/>
              <BrandFeature Ref="57"/>
              <BrandFeature Ref="8"/>
              <BrandFeature Ref="65"/>
              <BrandFeature Ref="39"/>
              <BrandFeature Ref="14"/>
              <BrandFeature Ref="63"/>
              <BrandFeature Ref="24"/>
              <BrandFeature Ref="82"/>
              <BrandFeature Ref="48"/>
            </FareComponent>
            <Tax Ref="12"/>
            <Tax Ref="8"/>
            <Tax Ref="45"/>
            <Tax Ref="10"/>
            <Tax Ref="25"/>
            <Tax Ref="14"/>
            <Tax Ref="32"/>
            <Tax Ref="16"/>
            <TaxSummary Ref="18"/>
            <TaxSummary Ref="29"/>
            <TaxSummary Ref="5"/>
            <CurrencyConversion ExchangeRateUsed="1" From="RUB" To="RUB"/>
            <FareMessage Carrier="U6" Code="0" Info="NONEND" Type="N"/>
            <FareMessage Code="0" Info="EACH CNN REQUIRES ACCOMPANYING SAME CABIN ADT" Type="W"/>
            <FareMessage Code="0" Info="VALIDATING CARRIER" Type="W"/>
            <FareMessage Code="0" Info="BSP - U6" Type="W"/>
            <FareMessage Code="0" Info="GEN - U6" Type="W"/>
            <FareMessage Code="0" Info="TCH - U6" Type="W"/>
            <FareMessage Code="0" Info="CAT 15 SALES RESTRICTIONS FREE TEXT FOUND - VERIFY RULES" Type="W"/>
            <PassengerTotalFare BaseFareAmount="4710" BaseFareCurrency="RUB" CommissionAmount="0" CommissionPercentage="0" ConstructionAmount="4710" ConstructionCurrency="RUB" Currency="RUB" EquivalentAmount="4710" EquivalentCurrency="RUB" ExchangeRateOne="76.8000000" TotalFare="10036" TotalTaxes="5326"/>
            <BaggageInformation AirlineCode="U6" ProvisionType="A">
              <Segment ID="0"/>
              <Allowance Ref="5"/>
            </BaggageInformation>
            <BaggageInformation AirlineCode="U6" ProvisionType="A">
              <Segment ID="1"/>
              <Allowance Ref="5"/>
            </BaggageInformation>
            <PenaltiesInfo>
              <Penalty Amount="0" Applicability="Before" Changeable="true" ConditionsApply="true" Currency="RUB" Type="Exchange"/>
              <Penalty Amount="0" Applicability="After" Changeable="true" ConditionsApply="true" Currency="RUB" Type="Exchange"/>
              <Penalty Amount="1500" Applicability="Before" Currency="RUB" Refundable="true" Type="Refund"/>
              <Penalty Amount="3000" Applicability="After" Currency="RUB" Refundable="true" Type="Refund"/>
            </PenaltiesInfo>
          </PassengerInfo>
          <PassengerInfo NonRefundable="false" PassengerNumber="1" PassengerType="INF">
            <FareComponent Ref="162">
              <Segment AvailabilityBreak="true" BookingCode="W" CabinCode="Y" SeatsAvailable="9"/>
              <BrandFeature Ref="27"/>
              <BrandFeature Ref="107"/>
              <BrandFeature Ref="103"/>
              <BrandFeature Ref="45"/>
              <BrandFeature Ref="53"/>
              <BrandFeature Ref="16"/>
              <BrandFeature Ref="57"/>
              <BrandFeature Ref="8"/>
              <BrandFeature Ref="65"/>
              <BrandFeature Ref="39"/>
              <BrandFeature Ref="14"/>
              <BrandFeature Ref="63"/>
              <BrandFeature Ref="24"/>
              <BrandFeature Ref="82"/>
              <BrandFeature Ref="48"/>
            </FareComponent>
            <FareComponent Ref="202">
              <Segment AvailabilityBreak="true" BookingCode="W" CabinCode="Y" MealCode="N" SeatsAvailable="9"/>
              <BrandFeature Ref="27"/>
              <BrandFeature Ref="107"/>
              <BrandFeature Ref="103"/>
              <BrandFeature Ref="45"/>
              <BrandFeature Ref="53"/>
              <BrandFeature Ref="16"/>
              <BrandFeature Ref="57"/>
              <BrandFeature Ref="8"/>
              <BrandFeature Ref="65"/>
              <BrandFeature Ref="39"/>
              <BrandFeature Ref="14"/>
              <BrandFeature Ref="63"/>
              <BrandFeature Ref="24"/>
              <BrandFeature Ref="82"/>
              <BrandFeature Ref="48"/>
            </FareComponent>
            <CurrencyConversion ExchangeRateUsed="1" From="RUB" To="RUB"/>
            <FareMessage Carrier="U6" Code="0" Info="NONEND" Type="N"/>
            <FareMessage Code="0" Info="EACH INF REQUIRES ACCOMPANYING ADT PASSENGER" Type="W"/>
            <FareMessage Code="0" Info="VALIDATING CARRIER" Type="W"/>
            <FareMessage Code="0" Info="BSP - U6" Type="W"/>
            <FareMessage Code="0" Info="GEN - U6" Type="W"/>
            <FareMessage Code="0" Info="TCH - U6" Type="W"/>
            <FareMessage Code="0" Info="CAT 15 SALES RESTRICTIONS FREE TEXT FOUND - VERIFY RULES" Type="W"/>
            <PassengerTotalFare BaseFareAmount="0" BaseFareCurrency="RUB" CommissionAmount="0" CommissionPercentage="0" ConstructionAmount="0" ConstructionCurrency="RUB" Currency="RUB" EquivalentAmount="0" EquivalentCurrency="RUB" ExchangeRateOne="76.8000000" TotalFare="0" TotalTaxes="0"/>
            <BaggageInformation AirlineCode="U6" ProvisionType="A">
              <Segment ID="0"/>
              <Allowance Ref="14"/>
            </BaggageInformation>
            <BaggageInformation AirlineCode="U6" ProvisionType="A">
              <Segment ID="1"/>
              <Allowance Ref="14"/>
            </BaggageInformation>
            <PenaltiesInfo>
              <Penalty Amount="0" Applicability="Before" Changeable="true" ConditionsApply="true" Currency="RUB" Type="Exchange"/>
              <Penalty Amount="0" Applicability="After" Changeable="true" ConditionsApply="true" Currency="RUB" Type="Exchange"/>
              <Penalty Amount="0" Applicability="Before" Currency="RUB" Refundable="true" Type="Refund"/>
              <Penalty Amount="0" Applicability="After" Currency="RUB" Refundable="true" Type="Refund"/>
            </PenaltiesInfo>
          </PassengerInfo>
          <AncillaryFeeGroup Message="ADDTL AIR EXTRAS APPLY - REFINE REQUEST">
            <AncillaryFee Code="BG" Name="BAGGAGE">
              <Details Amount="2000" AncillaryTypeCode="F" BaggageID="1" Carrier="U6" Code="ADT" DepartureDate="2020-09-01" Description="FIRST EXCESS BAG" Description1="FIRST BAG" Destination="AER" EndSegment="1" Origin="DME" StartSegment="1" Subcode="0CC"/>
              <Details Amount="2500" AncillaryTypeCode="F" BaggageID="2" Carrier="U6" Code="ALL" DepartureDate="2020-09-01" Description="FIRST EXCESS BAG" Description1="FIRST BAG" Destination="AER" EndSegment="1" Origin="DME" StartSegment="1" Subcode="0CC"/>
              <Details Amount="2500" AncillaryTypeCode="F" BaggageID="3" Carrier="U6" Code="ALL" DepartureDate="2020-09-01" Description="SECOND EXCESS BAG" Description1="SECOND BAG" Destination="AER" EndSegment="1" Origin="DME" StartSegment="1" Subcode="0CD"/>
              <Details Amount="2000" AncillaryTypeCode="F" BaggageID="4" Carrier="U6" Code="ADT" DepartureDate="2020-09-01" Description="SECOND EXCESS BAG" Description1="SECOND BAG" Destination="AER" EndSegment="1" Origin="DME" StartSegment="1" Subcode="0CD"/>
              <Details Amount="2000" AncillaryTypeCode="F" BaggageID="5" Carrier="U6" Code="ADT" DepartureDate="2020-09-01" Description="THIRD EXCESS BAG" Description1="THIRD BAG" Destination="AER" EndSegment="1" Origin="DME" StartSegment="1" Subcode="0CE"/>
              <Details Amount="2500" AncillaryTypeCode="F" BaggageID="6" Carrier="U6" Code="ALL" DepartureDate="2020-09-01" Description="THIRD EXCESS BAG" Description1="THIRD BAG" Destination="AER" EndSegment="1" Origin="DME" StartSegment="1" Subcode="0CE"/>
              <Details Amount="2000" AncillaryTypeCode="F" BaggageID="7" Carrier="U6" Code="ALL" DepartureDate="2020-09-01" Description="UPTO22LB 10KG BAGGAGE" Description1="UP TO 22 POUNDS/10 KILOGRAMS" Destination="AER" EndSegment="1" Origin="DME" StartSegment="1" Subcode="0CZ"/>
              <Details Amount="2000" AncillaryTypeCode="F" BaggageID="8" Carrier="U6" Code="ALL" DepartureDate="2020-09-01" Description="EXCESS WEIGHT SPECIAL CHARGE" Description1="EXCESS WEIGHT" Description2="SPECIAL CHARGE" Destination="AER" EndSegment="1" Origin="DME" StartSegment="1" Subcode="0H6"/>
              <Details Amount="2500" AncillaryTypeCode="F" BaggageID="9" Carrier="U6" Code="ALL" DepartureDate="2020-09-01" Description="EXTRA CARRYON BG" Description1="EXCESS SIZE" Description2="SPECIAL CHARGE" Destination="AER" EndSegment="1" Origin="DME" StartSegment="1" Subcode="0H7"/>
              <Details Amount="2500" AncillaryTypeCode="F" BaggageID="10" Carrier="U6" Code="ALL" DepartureDate="2020-09-01" Description="CARRY ON HAND BAGGAGE" Destination="AER" EndSegment="1" Origin="DME" StartSegment="1" Subcode="0L5" Subgroup="CY"/>
              <Details Amount="2000" AncillaryTypeCode="F" BaggageID="11" Carrier="U6" Code="ADT" DepartureDate="2020-09-08" Description="FIRST EXCESS BAG" Description1="FIRST BAG" Destination="DME" EndSegment="2" Origin="AER" StartSegment="2" Subcode="0CC"/>
              <Details Amount="2500" AncillaryTypeCode="F" BaggageID="12" Carrier="U6" Code="ALL" DepartureDate="2020-09-08" Description="FIRST EXCESS BAG" Description1="FIRST BAG" Destination="DME" EndSegment="2" Origin="AER" StartSegment="2" Subcode="0CC"/>
              <Details Amount="2500" AncillaryTypeCode="F" BaggageID="13" Carrier="U6" Code="ALL" DepartureDate="2020-09-08" Description="SECOND EXCESS BAG" Description1="SECOND BAG" Destination="DME" EndSegment="2" Origin="AER" StartSegment="2" Subcode="0CD"/>
              <Details Amount="2500" AncillaryTypeCode="F" BaggageID="14" Carrier="U6" Code="ALL" DepartureDate="2020-09-08" Description="THIRD EXCESS BAG" Description1="THIRD BAG" Destination="DME" EndSegment="2" Origin="AER" StartSegment="2" Subcode="0CE"/>
              <Details Amount="2000" AncillaryTypeCode="F" BaggageID="15" Carrier="U6" Code="ALL" DepartureDate="2020-09-08" Description="UPTO22LB 10KG BAGGAGE" Description1="UP TO 22 POUNDS/10 KILOGRAMS" Destination="DME" EndSegment="2" Origin="AER" StartSegment="2" Subcode="0CZ"/>
              <Details Amount="2000" AncillaryTypeCode="F" BaggageID="16" Carrier="U6" Code="ALL" DepartureDate="2020-09-08" Description="EXCESS WEIGHT SPECIAL CHARGE" Description1="EXCESS WEIGHT" Description2="SPECIAL CHARGE" Destination="DME" EndSegment="2" Origin="AER" StartSegment="2" Subcode="0H6"/>
              <Details Amount="2500" AncillaryTypeCode="F" BaggageID="17" Carrier="U6" Code="ALL" DepartureDate="2020-09-08" Description="EXTRA CARRYON BG" Description1="EXCESS SIZE" Description2="SPECIAL CHARGE" Destination="DME" EndSegment="2" Origin="AER" StartSegment="2" Subcode="0H7"/>
              <Details Amount="2500" AncillaryTypeCode="F" BaggageID="18" Carrier="U6" Code="ALL" DepartureDate="2020-09-08" Description="CARRY ON HAND BAGGAGE" Destination="DME" EndSegment="2" Origin="AER" StartSegment="2" Subcode="0L5" Subgroup="CY"/>
            </AncillaryFee>
            <OrderStandardBag>
              <PassengerBags Code="ADT">
                <BaggageSequenceOrder BaggageRef="1" StandardBag="1"/>
                <BaggageSequenceOrder BaggageRef="3" StandardBag="2"/>
                <BaggageSequenceOrder BaggageRef="5" StandardBag="3"/>
                <BaggageSequenceOrder BaggageRef="11" StandardBag="1"/>
                <BaggageSequenceOrder BaggageRef="13" StandardBag="2"/>
                <BaggageSequenceOrder BaggageRef="14" StandardBag="3"/>
              </PassengerBags>
              <PassengerBags Code="CNN">
                <BaggageSequenceOrder BaggageRef="2" StandardBag="1"/>
                <BaggageSequenceOrder BaggageRef="3" StandardBag="2"/>
                <BaggageSequenceOrder BaggageRef="6" StandardBag="3"/>
                <BaggageSequenceOrder BaggageRef="12" StandardBag="1"/>
                <BaggageSequenceOrder BaggageRef="13" StandardBag="2"/>
                <BaggageSequenceOrder BaggageRef="14" StandardBag="3"/>
              </PassengerBags>
              <PassengerBags Code="INF">
                <BaggageSequenceOrder BaggageRef="2" StandardBag="1"/>
                <BaggageSequenceOrder BaggageRef="3" StandardBag="2"/>
                <BaggageSequenceOrder BaggageRef="6" StandardBag="3"/>
                <BaggageSequenceOrder BaggageRef="12" StandardBag="1"/>
                <BaggageSequenceOrder BaggageRef="13" StandardBag="2"/>
                <BaggageSequenceOrder BaggageRef="14" StandardBag="3"/>
              </PassengerBags>
            </OrderStandardBag>
          </AncillaryFeeGroup>
          <TotalFare BaseFareAmount="17270" BaseFareCurrency="RUB" ConstructionAmount="17270" ConstructionCurrency="RUB" Currency="RUB" EquivalentAmount="17270" EquivalentCurrency="RUB" TotalPrice="33696" TotalTaxes="16426"/>
          <ValidatingCarrier Ref="12"/>
          <ValidatingCarrier Ref="4"/>
          <ValidatingCarrier Ref="6"/>
        </Fare>
      </PricingInformation>
      <DiversitySwapper WeighedPrice="13297.333"/>
    </Itinerary>
    <!--Другие варианты перелетов-->
  </ItineraryGroup>
  <!--Другие маршруты-->
</GroupedItineraryResponse>
{% endxmlsec %}

---

{% xmlsec "Пример запроса (получение дополнительных расчетов стоимости по заданным критериям, OTA ответ)", false %}
<OTA_AirLowFareSearchRQ ResponseType="OTA" Version="6.1.0" xmlns="http://www.opentravel.org/OTA/2003/05">
  <POS>
    <Source PseudoCityCode="9LSC">
      <RequestorID ID="1" Type="1">
        <CompanyName Code="TN"/>
      </RequestorID>
    </Source>
  </POS>
  <OriginDestinationInformation RPH="1">
    <DepartureDateTime>2020-09-01T11:00:00</DepartureDateTime>
    <OriginLocation LocationCode="MOW"/>
    <DestinationLocation LocationCode="AER"/>
  </OriginDestinationInformation>
  <OriginDestinationInformation RPH="2">
    <DepartureDateTime>2020-09-08T11:00:00</DepartureDateTime>
    <OriginLocation LocationCode="AER"/>
    <DestinationLocation LocationCode="MOW"/>
  </OriginDestinationInformation>
  <TravelPreferences ValidInterlineTicket="true">
    <CabinPref Cabin="Economy" PreferLevel="Preferred"/>
    <TPA_Extensions>
      <LongConnectTime Enable="true"/>
      <LongConnectPoints Max="3" Min="1"/>
      <KeepSameCabin Enabled="true"/>
      <ExcludeCallDirectCarriers Enabled="true"/>
      <FlexibleFares>
        <FareParameters>
          <Cabin Type="Business"/>
          <KeepSameCabin Enabled="true"/>
        </FareParameters>
        <FareParameters>
          <PassengerTypeQuantity Code="ADT" Quantity="2"/>
          <PassengerTypeQuantity Code="CNN" Quantity="1"/>
          <PassengerTypeQuantity Code="INS" Quantity="1"/>
        </FareParameters>
        <FareParameters>
          <PublicFare Ind="true"/>
        </FareParameters>
        <FareParameters>
          <VoluntaryChanges Match="All">
            <Penalty Type="Refund"/>
          </VoluntaryChanges>
        </FareParameters>
      </FlexibleFares>
      <DiversityParameters AdditionalNonStopsPercentage="100"/>
    </TPA_Extensions>
    <AncillaryFees Enable="true">
      <AncillaryFeeGroup Code="BG"/>
    </AncillaryFees>
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
    <IntelliSellTransaction>
      <RequestType Name="200ITINS"/>
    </IntelliSellTransaction>
  </TPA_Extensions>
</OTA_AirLowFareSearchRQ>
{% endxmlsec %}

{% xmlsec "Пример ответа", false %}
<OTA_AirLowFareSearchRS AvailableItinCount="0" BrandedOneWayItinCount="0" DepartedItinCount="0" PricedItinCount="290" SimpleOneWayItinCount="0" SoldOutItinCount="0" Version="6.1.0" xmlns="http://www.opentravel.org/OTA/2003/05" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <Success/>
  <Warnings>
    <Warning Code="PROCESS" NumberOfOccurences="2" ShortText="NO SOLUTION PASSED INTERLINE TICKETING VALIDATION" Type="MIP"/>
    <Warning Code="TRANSACTIONID" MessageClass="I" ShortText="7553100944187759716" Type="WORKERTHREAD"/>
    <Warning Code="ASEPT2LAPP00322.IDM.SGDCPROD.SABRE.COM" MessageClass="I" ShortText="27042" Type="SERVER"/>
    <Warning Code="RULEID" MessageClass="I" ShortText="15936" Type="DRE"/>
    <Warning Code="RULEID" MessageClass="I" ShortText="24467" Type="DEFAULT"/>
    <Warning Code="MIP" MessageClass="I" ShortText="NO SOLUTION PASSED INTERLINE TICKETING VALIDATION" Type="MIP"/>
  </Warnings>
  <BrandFeatures>
    <BrandFeature Application="F" CommercialName="SEAT SELECTION DURING CHECK IN" Id="1" ServiceGroup="BF" ServiceType="Z" SubCode="050" Vendor="ATP"/>
    <BrandFeature Application="C" CommercialName="SEAT SELECTION DURING CHECK IN" Id="2" ServiceGroup="BF" ServiceType="Z" SubCode="050" Vendor="ATP"/>
    <BrandFeature Application="C" CommercialName="BASIC SEAT" Id="3" ServiceGroup="BF" ServiceType="Z" SubCode="050" Vendor="ATP"/>
    <BrandFeature Application="F" CommercialName="BASIC SEAT" Id="4" ServiceGroup="BF" ServiceType="Z" SubCode="050" Vendor="ATP"/>
    <BrandFeature Application="C" CommercialName="REFUNDABLE TICKET" Id="5" ServiceGroup="BF" ServiceType="Z" SubCode="056" Vendor="ATP"/>
    <!--Другие услуги-->
  </BrandFeatures>
  <PricedItineraries>
    <PricedItinerary SequenceNumber="1">
      <AirItinerary DirectionInd="Return">
        <OriginDestinationOptions>
          <OriginDestinationOption ArrivalCountry="RU" DepartureCountry="RU" ElapsedTime="140">
            <FlightSegment ArrivalDateTime="2020-09-01T15:35:00" DepartureDateTime="2020-09-01T13:15:00" ElapsedTime="140" FlightNumber="1309" ResBookDesigCode="W" StopQuantity="0">
              <DepartureAirport LocationCode="ZIA"/>
              <ArrivalAirport LocationCode="AER"/>
              <OperatingAirline Code="U6" FlightNumber="1309"/>
              <Equipment AirEquipType="320"/>
              <MarketingAirline Code="U6"/>
              <MarriageGrp>O</MarriageGrp>
              <DepartureTimeZone GMTOffset="3"/>
              <ArrivalTimeZone GMTOffset="3"/>
              <TPA_Extensions>
                <eTicket Ind="true"/>
                <Mileage Amount="840"/>
              </TPA_Extensions>
            </FlightSegment>
          </OriginDestinationOption>
          <OriginDestinationOption ArrivalCountry="RU" DepartureCountry="RU" ElapsedTime="145">
            <FlightSegment ArrivalDateTime="2020-09-09T00:45:00" DepartureDateTime="2020-09-08T22:20:00" ElapsedTime="145" FlightNumber="308" ResBookDesigCode="W" StopQuantity="0">
              <DepartureAirport LocationCode="AER"/>
              <ArrivalAirport LocationCode="ZIA"/>
              <OperatingAirline Code="U6" FlightNumber="308"/>
              <Equipment AirEquipType="320"/>
              <MarketingAirline Code="U6"/>
              <MarriageGrp>O</MarriageGrp>
              <DepartureTimeZone GMTOffset="3"/>
              <ArrivalTimeZone GMTOffset="3"/>
              <TPA_Extensions>
                <eTicket Ind="true"/>
                <Mileage Amount="840"/>
              </TPA_Extensions>
            </FlightSegment>
          </OriginDestinationOption>
        </OriginDestinationOptions>
      </AirItinerary>
      <AirItineraryPricingInfo BrandsOnAnyMarket="true" FareReturned="true" LastTicketDate="2020-05-13" LastTicketTime="23:59" PricingSource="ADVJR1" PricingSubSource="MIP">
        <ItinTotalFare>
          <BaseFare Amount="3520" CurrencyCode="RUB" DecimalPlaces="0"/>
          <FareConstruction Amount="3520" CurrencyCode="RUB" DecimalPlaces="0"/>
          <EquivFare Amount="3520" CurrencyCode="RUB" DecimalPlaces="0"/>
          <Taxes>
            <Tax Amount="16276" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="TOTALTAX"/>
          </Taxes>
          <TotalFare Amount="19796" CurrencyCode="RUB" DecimalPlaces="0"/>
        </ItinTotalFare>
        <PTC_FareBreakdowns>
          <PTC_FareBreakdown>
            <PassengerTypeQuantity Code="ADT" Quantity="2"/>
            <FareBasisCodes>
              <FareBasisCode ArrivalAirportCode="AER" AvailabilityBreak="true" BookingCode="W" DepartureAirportCode="ZIA" FareComponentBeginAirport="ZIA" FareComponentDirectionality="FROM" FareComponentEndAirport="AER" FareComponentFareRule="U6PR" FareComponentFareTariff="304" FareComponentFareType="XPN" FareComponentFareTypeBitmap="00" FareComponentVendorCode="ATP" GovCarrier="U6">WPRRT</FareBasisCode>
              <FareBasisCode ArrivalAirportCode="ZIA" AvailabilityBreak="true" BookingCode="W" DepartureAirportCode="AER" FareComponentBeginAirport="AER" FareComponentDirectionality="TO" FareComponentEndAirport="ZIA" FareComponentFareRule="U6PR" FareComponentFareTariff="304" FareComponentFareType="XPN" FareComponentFareTypeBitmap="00" FareComponentVendorCode="ATP" GovCarrier="U6">WPRRT</FareBasisCode>
            </FareBasisCodes>
            <PassengerFare>
              <BaseFare Amount="1280" CurrencyCode="RUB"/>
              <FareConstruction Amount="1280" CurrencyCode="RUB" DecimalPlaces="0"/>
              <EquivFare Amount="1280" CurrencyCode="RUB" DecimalPlaces="0"/>
              <Taxes>
                <Tax Amount="2150" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                <Tax Amount="2150" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                <Tax Amount="400" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRI"/>
                <Tax Amount="400" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRI"/>
                <Tax Amount="75" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                <Tax Amount="120" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                <Tax Amount="75" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI4"/>
                <Tax Amount="120" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI4"/>
                <TaxSummary Amount="4300" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                <TaxSummary Amount="800" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRI"/>
                <TaxSummary Amount="390" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                <TotalTax Amount="5490" CurrencyCode="RUB" DecimalPlaces="0"/>
              </Taxes>
              <TotalFare Amount="6770" CurrencyCode="RUB"/>
              <PenaltiesInfo>
                <Penalty Amount="0" Applicability="Before" Changeable="true" ConditionsApply="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                <Penalty Amount="3000" Applicability="After" Changeable="true" ConditionsApply="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                <Penalty Applicability="Before" Refundable="false" Type="Refund"/>
                <Penalty Applicability="After" Refundable="false" Type="Refund"/>
              </PenaltiesInfo>
              <TPA_Extensions>
                <FareComponents>
                  <FareComponent BrandID="PR" BrandName="PROMO" ProgramCode="CFFU6" ProgramDescription="U6 DOMESTIC" ProgramID="83326" ProgramSystemCode="A">
                    <Segment FlightIndex="1" LegIndex="1"/>
                    <BrandFeatureRef FeatureId="16"/>
                    <BrandFeatureRef FeatureId="18"/>
                    <BrandFeatureRef FeatureId="20"/>
                    <BrandFeatureRef FeatureId="25"/>
                    <BrandFeatureRef FeatureId="40"/>
                    <BrandFeatureRef FeatureId="42"/>
                    <BrandFeatureRef FeatureId="99"/>
                    <BrandFeatureRef FeatureId="95"/>
                    <BrandFeatureRef FeatureId="65"/>
                    <BrandFeatureRef FeatureId="58"/>
                    <BrandFeatureRef FeatureId="60"/>
                    <BrandFeatureRef FeatureId="106"/>
                    <BrandFeatureRef FeatureId="110"/>
                    <BrandFeatureRef FeatureId="121"/>
                    <BrandFeatureRef FeatureId="124"/>
                  </FareComponent>
                  <FareComponent BrandID="PR" BrandName="PROMO" ProgramCode="CFFU6" ProgramDescription="U6 DOMESTIC" ProgramID="83326" ProgramSystemCode="A">
                    <Segment FlightIndex="1" LegIndex="2"/>
                    <BrandFeatureRef FeatureId="16"/>
                    <BrandFeatureRef FeatureId="18"/>
                    <BrandFeatureRef FeatureId="20"/>
                    <BrandFeatureRef FeatureId="25"/>
                    <BrandFeatureRef FeatureId="40"/>
                    <BrandFeatureRef FeatureId="42"/>
                    <BrandFeatureRef FeatureId="99"/>
                    <BrandFeatureRef FeatureId="95"/>
                    <BrandFeatureRef FeatureId="65"/>
                    <BrandFeatureRef FeatureId="58"/>
                    <BrandFeatureRef FeatureId="60"/>
                    <BrandFeatureRef FeatureId="106"/>
                    <BrandFeatureRef FeatureId="110"/>
                    <BrandFeatureRef FeatureId="121"/>
                    <BrandFeatureRef FeatureId="124"/>
                  </FareComponent>
                </FareComponents>
                <Messages>
                  <Message AirlineCode="U6" FailCode="0" Info="NONEND" Type="N"/>
                  <Message FailCode="0" Info="VALIDATING CARRIER" Type="W"/>
                  <Message FailCode="0" Info="BSP - U6" Type="W"/>
                  <Message FailCode="0" Info="GEN - U6" Type="W"/>
                  <Message FailCode="0" Info="TCH - U6" Type="W"/>
                  <Message FailCode="0" Info="CAT 15 SALES RESTRICTIONS FREE TEXT FOUND - VERIFY RULES" Type="W"/>
                </Messages>
                <BaggageInformationList>
                  <BaggageInformation AirlineCode="U6" ProvisionType="A">
                    <Segment Id="0"/>
                    <Allowance Unit="kg" Weight="10"/>
                  </BaggageInformation>
                  <BaggageInformation AirlineCode="U6" ProvisionType="A">
                    <Segment Id="1"/>
                    <Allowance Unit="kg" Weight="10"/>
                  </BaggageInformation>
                </BaggageInformationList>
              </TPA_Extensions>
            </PassengerFare>
            <Endorsements NonRefundableIndicator="true"/>
            <TPA_Extensions>
              <FareCalcLine Info="ZIA U6 AER640U6 ZIA640RUB1280END"/>
            </TPA_Extensions>
            <FareInfos>
              <FareInfo>
                <FareReference>W</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="N"/>
                </TPA_Extensions>
              </FareInfo>
              <FareInfo>
                <FareReference>W</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="N"/>
                </TPA_Extensions>
              </FareInfo>
            </FareInfos>
          </PTC_FareBreakdown>
          <PTC_FareBreakdown>
            <PassengerTypeQuantity Code="CNN" Quantity="1"/>
            <FareBasisCodes>
              <FareBasisCode ArrivalAirportCode="AER" AvailabilityBreak="true" BookingCode="W" DepartureAirportCode="ZIA" FareComponentBeginAirport="ZIA" FareComponentDirectionality="FROM" FareComponentEndAirport="AER" FareComponentFareRule="U6PR" FareComponentFareTariff="304" FareComponentFareType="XPN" FareComponentFareTypeBitmap="01" FareComponentVendorCode="ATP" GovCarrier="U6">WPRRT/CH25</FareBasisCode>
              <FareBasisCode ArrivalAirportCode="ZIA" AvailabilityBreak="true" BookingCode="W" DepartureAirportCode="AER" FareComponentBeginAirport="AER" FareComponentDirectionality="TO" FareComponentEndAirport="ZIA" FareComponentFareRule="U6PR" FareComponentFareTariff="304" FareComponentFareType="XPN" FareComponentFareTypeBitmap="01" FareComponentVendorCode="ATP" GovCarrier="U6">WPRRT/CH25</FareBasisCode>
            </FareBasisCodes>
            <PassengerFare>
              <BaseFare Amount="960" CurrencyCode="RUB"/>
              <FareConstruction Amount="960" CurrencyCode="RUB" DecimalPlaces="0"/>
              <EquivFare Amount="960" CurrencyCode="RUB" DecimalPlaces="0"/>
              <Taxes>
                <Tax Amount="2150" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                <Tax Amount="2150" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                <Tax Amount="400" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRI"/>
                <Tax Amount="400" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRI"/>
                <Tax Amount="38" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                <Tax Amount="60" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                <Tax Amount="38" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI4"/>
                <Tax Amount="60" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI4"/>
                <TaxSummary Amount="4300" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                <TaxSummary Amount="800" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRI"/>
                <TaxSummary Amount="196" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                <TotalTax Amount="5296" CurrencyCode="RUB" DecimalPlaces="0"/>
              </Taxes>
              <TotalFare Amount="6256" CurrencyCode="RUB"/>
              <PenaltiesInfo>
                <Penalty Amount="0" Applicability="Before" Changeable="true" ConditionsApply="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                <Penalty Amount="3000" Applicability="After" Changeable="true" ConditionsApply="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                <Penalty Applicability="Before" Refundable="false" Type="Refund"/>
                <Penalty Applicability="After" Refundable="false" Type="Refund"/>
              </PenaltiesInfo>
              <TPA_Extensions>
                <FareComponents>
                  <FareComponent BrandID="PR" BrandName="PROMO" ProgramCode="CFFU6" ProgramDescription="U6 DOMESTIC" ProgramID="83326" ProgramSystemCode="A">
                    <Segment FlightIndex="1" LegIndex="1"/>
                    <BrandFeatureRef FeatureId="16"/>
                    <BrandFeatureRef FeatureId="18"/>
                    <BrandFeatureRef FeatureId="20"/>
                    <BrandFeatureRef FeatureId="25"/>
                    <BrandFeatureRef FeatureId="40"/>
                    <BrandFeatureRef FeatureId="42"/>
                    <BrandFeatureRef FeatureId="99"/>
                    <BrandFeatureRef FeatureId="95"/>
                    <BrandFeatureRef FeatureId="65"/>
                    <BrandFeatureRef FeatureId="58"/>
                    <BrandFeatureRef FeatureId="60"/>
                    <BrandFeatureRef FeatureId="106"/>
                    <BrandFeatureRef FeatureId="110"/>
                    <BrandFeatureRef FeatureId="121"/>
                    <BrandFeatureRef FeatureId="124"/>
                  </FareComponent>
                  <FareComponent BrandID="PR" BrandName="PROMO" ProgramCode="CFFU6" ProgramDescription="U6 DOMESTIC" ProgramID="83326" ProgramSystemCode="A">
                    <Segment FlightIndex="1" LegIndex="2"/>
                    <BrandFeatureRef FeatureId="16"/>
                    <BrandFeatureRef FeatureId="18"/>
                    <BrandFeatureRef FeatureId="20"/>
                    <BrandFeatureRef FeatureId="25"/>
                    <BrandFeatureRef FeatureId="40"/>
                    <BrandFeatureRef FeatureId="42"/>
                    <BrandFeatureRef FeatureId="99"/>
                    <BrandFeatureRef FeatureId="95"/>
                    <BrandFeatureRef FeatureId="65"/>
                    <BrandFeatureRef FeatureId="58"/>
                    <BrandFeatureRef FeatureId="60"/>
                    <BrandFeatureRef FeatureId="106"/>
                    <BrandFeatureRef FeatureId="110"/>
                    <BrandFeatureRef FeatureId="121"/>
                    <BrandFeatureRef FeatureId="124"/>
                  </FareComponent>
                </FareComponents>
                <Messages>
                  <Message AirlineCode="U6" FailCode="0" Info="NONEND" Type="N"/>
                  <Message FailCode="0" Info="EACH CNN REQUIRES ACCOMPANYING SAME CABIN ADT" Type="W"/>
                  <Message FailCode="0" Info="VALIDATING CARRIER" Type="W"/>
                  <Message FailCode="0" Info="BSP - U6" Type="W"/>
                  <Message FailCode="0" Info="GEN - U6" Type="W"/>
                  <Message FailCode="0" Info="TCH - U6" Type="W"/>
                  <Message FailCode="0" Info="CAT 15 SALES RESTRICTIONS FREE TEXT FOUND - VERIFY RULES" Type="W"/>
                </Messages>
                <BaggageInformationList>
                  <BaggageInformation AirlineCode="U6" ProvisionType="A">
                    <Segment Id="0"/>
                    <Allowance Unit="kg" Weight="10"/>
                  </BaggageInformation>
                  <BaggageInformation AirlineCode="U6" ProvisionType="A">
                    <Segment Id="1"/>
                    <Allowance Unit="kg" Weight="10"/>
                  </BaggageInformation>
                </BaggageInformationList>
              </TPA_Extensions>
            </PassengerFare>
            <Endorsements NonRefundableIndicator="true"/>
            <TPA_Extensions>
              <FareCalcLine Info="ZIA U6 AER480U6 ZIA480RUB960END"/>
            </TPA_Extensions>
            <FareInfos>
              <FareInfo>
                <FareReference>W</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="N"/>
                </TPA_Extensions>
              </FareInfo>
              <FareInfo>
                <FareReference>W</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="N"/>
                </TPA_Extensions>
              </FareInfo>
            </FareInfos>
          </PTC_FareBreakdown>
          <PTC_FareBreakdown>
            <PassengerTypeQuantity Code="INF" Quantity="1"/>
            <FareBasisCodes>
              <FareBasisCode ArrivalAirportCode="AER" AvailabilityBreak="true" BookingCode="W" DepartureAirportCode="ZIA" FareComponentBeginAirport="ZIA" FareComponentDirectionality="FROM" FareComponentEndAirport="AER" FareComponentFareRule="U6PR" FareComponentFareTariff="304" FareComponentFareType="XPN" FareComponentFareTypeBitmap="01" FareComponentVendorCode="ATP" GovCarrier="U6">WPRRT/IN</FareBasisCode>
              <FareBasisCode ArrivalAirportCode="ZIA" AvailabilityBreak="true" BookingCode="W" DepartureAirportCode="AER" FareComponentBeginAirport="AER" FareComponentDirectionality="TO" FareComponentEndAirport="ZIA" FareComponentFareRule="U6PR" FareComponentFareTariff="304" FareComponentFareType="XPN" FareComponentFareTypeBitmap="01" FareComponentVendorCode="ATP" GovCarrier="U6">WPRRT/IN</FareBasisCode>
            </FareBasisCodes>
            <PassengerFare>
              <BaseFare Amount="0" CurrencyCode="RUB"/>
              <FareConstruction Amount="0" CurrencyCode="RUB" DecimalPlaces="0"/>
              <EquivFare Amount="0" CurrencyCode="RUB" DecimalPlaces="0"/>
              <TotalFare Amount="0" CurrencyCode="RUB"/>
              <PenaltiesInfo>
                <Penalty Amount="0" Applicability="Before" Changeable="true" ConditionsApply="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                <Penalty Amount="0" Applicability="After" Changeable="true" ConditionsApply="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                <Penalty Applicability="Before" Refundable="false" Type="Refund"/>
                <Penalty Applicability="After" Refundable="false" Type="Refund"/>
              </PenaltiesInfo>
              <TPA_Extensions>
                <FareComponents>
                  <FareComponent BrandID="PR" BrandName="PROMO" ProgramCode="CFFU6" ProgramDescription="U6 DOMESTIC" ProgramID="83326" ProgramSystemCode="A">
                    <Segment FlightIndex="1" LegIndex="1"/>
                    <BrandFeatureRef FeatureId="16"/>
                    <BrandFeatureRef FeatureId="18"/>
                    <BrandFeatureRef FeatureId="20"/>
                    <BrandFeatureRef FeatureId="25"/>
                    <BrandFeatureRef FeatureId="40"/>
                    <BrandFeatureRef FeatureId="42"/>
                    <BrandFeatureRef FeatureId="99"/>
                    <BrandFeatureRef FeatureId="95"/>
                    <BrandFeatureRef FeatureId="65"/>
                    <BrandFeatureRef FeatureId="58"/>
                    <BrandFeatureRef FeatureId="60"/>
                    <BrandFeatureRef FeatureId="106"/>
                    <BrandFeatureRef FeatureId="110"/>
                    <BrandFeatureRef FeatureId="121"/>
                    <BrandFeatureRef FeatureId="124"/>
                  </FareComponent>
                  <FareComponent BrandID="PR" BrandName="PROMO" ProgramCode="CFFU6" ProgramDescription="U6 DOMESTIC" ProgramID="83326" ProgramSystemCode="A">
                    <Segment FlightIndex="1" LegIndex="2"/>
                    <BrandFeatureRef FeatureId="16"/>
                    <BrandFeatureRef FeatureId="18"/>
                    <BrandFeatureRef FeatureId="20"/>
                    <BrandFeatureRef FeatureId="25"/>
                    <BrandFeatureRef FeatureId="40"/>
                    <BrandFeatureRef FeatureId="42"/>
                    <BrandFeatureRef FeatureId="99"/>
                    <BrandFeatureRef FeatureId="95"/>
                    <BrandFeatureRef FeatureId="65"/>
                    <BrandFeatureRef FeatureId="58"/>
                    <BrandFeatureRef FeatureId="60"/>
                    <BrandFeatureRef FeatureId="106"/>
                    <BrandFeatureRef FeatureId="110"/>
                    <BrandFeatureRef FeatureId="121"/>
                    <BrandFeatureRef FeatureId="124"/>
                  </FareComponent>
                </FareComponents>
                <Messages>
                  <Message AirlineCode="U6" FailCode="0" Info="NONEND" Type="N"/>
                  <Message FailCode="0" Info="EACH INF REQUIRES ACCOMPANYING ADT PASSENGER" Type="W"/>
                  <Message FailCode="0" Info="VALIDATING CARRIER" Type="W"/>
                  <Message FailCode="0" Info="BSP - U6" Type="W"/>
                  <Message FailCode="0" Info="GEN - U6" Type="W"/>
                  <Message FailCode="0" Info="TCH - U6" Type="W"/>
                  <Message FailCode="0" Info="CAT 15 SALES RESTRICTIONS FREE TEXT FOUND - VERIFY RULES" Type="W"/>
                </Messages>
                <BaggageInformationList>
                  <BaggageInformation AirlineCode="U6" ProvisionType="A">
                    <Segment Id="0"/>
                    <Allowance Unit="kg" Weight="10"/>
                  </BaggageInformation>
                  <BaggageInformation AirlineCode="U6" ProvisionType="A">
                    <Segment Id="1"/>
                    <Allowance Unit="kg" Weight="10"/>
                  </BaggageInformation>
                </BaggageInformationList>
              </TPA_Extensions>
            </PassengerFare>
            <Endorsements NonRefundableIndicator="false"/>
            <TPA_Extensions>
              <FareCalcLine Info="ZIA U6 AER0U6 ZIA0RUB0END"/>
            </TPA_Extensions>
            <FareInfos>
              <FareInfo>
                <FareReference>W</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="N"/>
                </TPA_Extensions>
              </FareInfo>
              <FareInfo>
                <FareReference>W</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="N"/>
                </TPA_Extensions>
              </FareInfo>
            </FareInfos>
          </PTC_FareBreakdown>
        </PTC_FareBreakdowns>
        <FareInfos>
          <FareInfo>
            <FareReference>W</FareReference>
            <TPA_Extensions>
              <SeatsRemaining BelowMin="false" Number="9"/>
              <Cabin Cabin="Y"/>
              <Meal Code="N"/>
            </TPA_Extensions>
          </FareInfo>
          <FareInfo>
            <FareReference>W</FareReference>
            <TPA_Extensions>
              <SeatsRemaining BelowMin="false" Number="9"/>
              <Cabin Cabin="Y"/>
              <Meal Code="N"/>
            </TPA_Extensions>
          </FareInfo>
        </FareInfos>
        <TPA_Extensions>
          <DivideInParty Indicator="false"/>
          <AncillaryFeeGroups Message="ADDTL AIR EXTRAS APPLY - REFINE REQUEST">
            <AncillaryFeeGroup Code="BG" Name="BAGGAGE">
              <AncillaryFeeItem Amount="2500" AncillaryTypeCode="F" BaggageID="1" Carrier="U6" Date="2020-09-01" Description="FIRST EXCESS BAG" Description1="FIRST BAG" DestinationAirport="AER" EndSegment="1" OriginAirport="ZIA" PassengerCode="ALL" StartSegment="1" Subcode="0CC"/>
              <AncillaryFeeItem Amount="2500" AncillaryTypeCode="F" BaggageID="2" Carrier="U6" Date="2020-09-01" Description="SECOND EXCESS BAG" Description1="SECOND BAG" DestinationAirport="AER" EndSegment="1" OriginAirport="ZIA" PassengerCode="ALL" StartSegment="1" Subcode="0CD"/>
              <AncillaryFeeItem Amount="2500" AncillaryTypeCode="F" BaggageID="3" Carrier="U6" Date="2020-09-01" Description="THIRD EXCESS BAG" Description1="THIRD BAG" DestinationAirport="AER" EndSegment="1" OriginAirport="ZIA" PassengerCode="ALL" StartSegment="1" Subcode="0CE"/>
              <AncillaryFeeItem Amount="2000" AncillaryTypeCode="F" BaggageID="4" Carrier="U6" Date="2020-09-01" Description="UPTO22LB 10KG BAGGAGE" Description1="UP TO 22 POUNDS/10 KILOGRAMS" DestinationAirport="AER" EndSegment="1" OriginAirport="ZIA" PassengerCode="ALL" StartSegment="1" Subcode="0CZ"/>
              <AncillaryFeeItem Amount="2000" AncillaryTypeCode="F" BaggageID="5" Carrier="U6" Date="2020-09-01" Description="EXCESS WEIGHT SPECIAL CHARGE" Description1="EXCESS WEIGHT" Description2="SPECIAL CHARGE" DestinationAirport="AER" EndSegment="1" OriginAirport="ZIA" PassengerCode="ALL" StartSegment="1" Subcode="0H6"/>
              <AncillaryFeeItem Amount="2500" AncillaryTypeCode="F" BaggageID="6" Carrier="U6" Date="2020-09-01" Description="EXTRA CARRYON BG" Description1="EXCESS SIZE" Description2="SPECIAL CHARGE" DestinationAirport="AER" EndSegment="1" OriginAirport="ZIA" PassengerCode="ALL" StartSegment="1" Subcode="0H7"/>
              <AncillaryFeeItem Amount="2500" AncillaryTypeCode="F" BaggageID="7" Carrier="U6" Date="2020-09-01" Description="CARRY ON HAND BAGGAGE" DestinationAirport="AER" EndSegment="1" OriginAirport="ZIA" PassengerCode="ALL" StartSegment="1" Subcode="0L5" Subgroup="CY"/>
              <AncillaryFeeItem Amount="2500" AncillaryTypeCode="F" BaggageID="8" Carrier="U6" Date="2020-09-08" Description="FIRST EXCESS BAG" Description1="FIRST BAG" DestinationAirport="ZIA" EndSegment="2" OriginAirport="AER" PassengerCode="ALL" StartSegment="2" Subcode="0CC"/>
              <AncillaryFeeItem Amount="2500" AncillaryTypeCode="F" BaggageID="9" Carrier="U6" Date="2020-09-08" Description="SECOND EXCESS BAG" Description1="SECOND BAG" DestinationAirport="ZIA" EndSegment="2" OriginAirport="AER" PassengerCode="ALL" StartSegment="2" Subcode="0CD"/>
              <AncillaryFeeItem Amount="2500" AncillaryTypeCode="F" BaggageID="10" Carrier="U6" Date="2020-09-08" Description="THIRD EXCESS BAG" Description1="THIRD BAG" DestinationAirport="ZIA" EndSegment="2" OriginAirport="AER" PassengerCode="ALL" StartSegment="2" Subcode="0CE"/>
              <AncillaryFeeItem Amount="2000" AncillaryTypeCode="F" BaggageID="11" Carrier="U6" Date="2020-09-08" Description="UPTO22LB 10KG BAGGAGE" Description1="UP TO 22 POUNDS/10 KILOGRAMS" DestinationAirport="ZIA" EndSegment="2" OriginAirport="AER" PassengerCode="ALL" StartSegment="2" Subcode="0CZ"/>
              <AncillaryFeeItem Amount="2000" AncillaryTypeCode="F" BaggageID="12" Carrier="U6" Date="2020-09-08" Description="EXCESS WEIGHT SPECIAL CHARGE" Description1="EXCESS WEIGHT" Description2="SPECIAL CHARGE" DestinationAirport="ZIA" EndSegment="2" OriginAirport="AER" PassengerCode="ALL" StartSegment="2" Subcode="0H6"/>
              <AncillaryFeeItem Amount="2500" AncillaryTypeCode="F" BaggageID="13" Carrier="U6" Date="2020-09-08" Description="EXTRA CARRYON BG" Description1="EXCESS SIZE" Description2="SPECIAL CHARGE" DestinationAirport="ZIA" EndSegment="2" OriginAirport="AER" PassengerCode="ALL" StartSegment="2" Subcode="0H7"/>
              <AncillaryFeeItem Amount="2500" AncillaryTypeCode="F" BaggageID="14" Carrier="U6" Date="2020-09-08" Description="CARRY ON HAND BAGGAGE" DestinationAirport="ZIA" EndSegment="2" OriginAirport="AER" PassengerCode="ALL" StartSegment="2" Subcode="0L5" Subgroup="CY"/>
            </AncillaryFeeGroup>
            <OrderStandardBag>
              <PassengerBags Code="ADT">
                <BaggageSequenceOrder BaggageID="1" StandardBag="1"/>
                <BaggageSequenceOrder BaggageID="2" StandardBag="2"/>
                <BaggageSequenceOrder BaggageID="3" StandardBag="3"/>
                <BaggageSequenceOrder BaggageID="8" StandardBag="1"/>
                <BaggageSequenceOrder BaggageID="9" StandardBag="2"/>
                <BaggageSequenceOrder BaggageID="10" StandardBag="3"/>
              </PassengerBags>
              <PassengerBags Code="CNN">
                <BaggageSequenceOrder BaggageID="1" StandardBag="1"/>
                <BaggageSequenceOrder BaggageID="2" StandardBag="2"/>
                <BaggageSequenceOrder BaggageID="3" StandardBag="3"/>
                <BaggageSequenceOrder BaggageID="8" StandardBag="1"/>
                <BaggageSequenceOrder BaggageID="9" StandardBag="2"/>
                <BaggageSequenceOrder BaggageID="10" StandardBag="3"/>
              </PassengerBags>
              <PassengerBags Code="INF">
                <BaggageSequenceOrder BaggageID="1" StandardBag="1"/>
                <BaggageSequenceOrder BaggageID="2" StandardBag="2"/>
                <BaggageSequenceOrder BaggageID="3" StandardBag="3"/>
                <BaggageSequenceOrder BaggageID="8" StandardBag="1"/>
                <BaggageSequenceOrder BaggageID="9" StandardBag="2"/>
                <BaggageSequenceOrder BaggageID="10" StandardBag="3"/>
              </PassengerBags>
            </OrderStandardBag>
          </AncillaryFeeGroups>
          <ValidatingCarrier NewVcxProcess="true" SettlementMethod="BSP">
            <Default Code="U6"/>
          </ValidatingCarrier>
          <ValidatingCarrier NewVcxProcess="true" SettlementMethod="TCH">
            <Default Code="U6"/>
          </ValidatingCarrier>
          <ValidatingCarrier NewVcxProcess="true" SettlementMethod="GEN">
            <Default Code="U6"/>
          </ValidatingCarrier>
        </TPA_Extensions>
      </AirItineraryPricingInfo>
      <TicketingInfo TicketType="eTicket" ValidInterline="Yes"/>
      <TPA_Extensions>
        <AdditionalFares>
          <AirItineraryPricingInfo BrandsOnAnyMarket="true" FareReturned="true" FlexibleFareID="1" LastTicketDate="2020-05-13" LastTicketTime="23:59" PricingSource="ADVJR1" PricingSubSource="MIP">
            <ItinTotalFare>
              <BaseFare Amount="130940" CurrencyCode="RUB" DecimalPlaces="0"/>
              <FareConstruction Amount="130940" CurrencyCode="RUB" DecimalPlaces="0"/>
              <EquivFare Amount="130940" CurrencyCode="RUB" DecimalPlaces="0"/>
              <Taxes>
                <Tax Amount="16276" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="TOTALTAX"/>
              </Taxes>
              <TotalFare Amount="147216" CurrencyCode="RUB" DecimalPlaces="0"/>
            </ItinTotalFare>
            <PTC_FareBreakdowns>
              <PTC_FareBreakdown>
                <PassengerTypeQuantity Code="ADT" Quantity="2"/>
                <FareBasisCodes>
                  <FareBasisCode ArrivalAirportCode="AER" AvailabilityBreak="true" BookingCode="D" DepartureAirportCode="ZIA" FareComponentBeginAirport="ZIA" FareComponentDirectionality="FROM" FareComponentEndAirport="AER" FareComponentFareRule="U6BS" FareComponentFareTariff="304" FareComponentFareType="BS" FareComponentFareTypeBitmap="00" FareComponentVendorCode="ATP" GovCarrier="U6">DBSRT</FareBasisCode>
                  <FareBasisCode ArrivalAirportCode="ZIA" AvailabilityBreak="true" BookingCode="D" DepartureAirportCode="AER" FareComponentBeginAirport="AER" FareComponentDirectionality="TO" FareComponentEndAirport="ZIA" FareComponentFareRule="U6BS" FareComponentFareTariff="304" FareComponentFareType="BS" FareComponentFareTypeBitmap="00" FareComponentVendorCode="ATP" GovCarrier="U6">DBSRT</FareBasisCode>
                </FareBasisCodes>
                <PassengerFare>
                  <BaseFare Amount="52375" CurrencyCode="RUB"/>
                  <FareConstruction Amount="52375" CurrencyCode="RUB" DecimalPlaces="0"/>
                  <EquivFare Amount="52375" CurrencyCode="RUB" DecimalPlaces="0"/>
                  <Taxes>
                    <Tax Amount="2150" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                    <Tax Amount="2150" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                    <Tax Amount="400" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRI"/>
                    <Tax Amount="400" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRI"/>
                    <Tax Amount="75" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                    <Tax Amount="120" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                    <Tax Amount="75" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI4"/>
                    <Tax Amount="120" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI4"/>
                    <TaxSummary Amount="4300" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                    <TaxSummary Amount="800" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRI"/>
                    <TaxSummary Amount="390" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                    <TotalTax Amount="5490" CurrencyCode="RUB" DecimalPlaces="0"/>
                  </Taxes>
                  <TotalFare Amount="57865" CurrencyCode="RUB"/>
                  <TPA_Extensions>
                    <FareComponents>
                      <FareComponent BrandID="BS" BrandName="BUSINESS" ProgramCode="CFFU6" ProgramDescription="U6 DOMESTIC" ProgramID="83326" ProgramSystemCode="A">
                        <Segment FlightIndex="1" LegIndex="1"/>
                        <BrandFeatureRef FeatureId="15"/>
                        <BrandFeatureRef FeatureId="17"/>
                        <BrandFeatureRef FeatureId="19"/>
                        <BrandFeatureRef FeatureId="24"/>
                        <BrandFeatureRef FeatureId="41"/>
                        <BrandFeatureRef FeatureId="42"/>
                        <BrandFeatureRef FeatureId="100"/>
                        <BrandFeatureRef FeatureId="97"/>
                        <BrandFeatureRef FeatureId="66"/>
                        <BrandFeatureRef FeatureId="59"/>
                        <BrandFeatureRef FeatureId="64"/>
                        <BrandFeatureRef FeatureId="105"/>
                        <BrandFeatureRef FeatureId="110"/>
                        <BrandFeatureRef FeatureId="119"/>
                        <BrandFeatureRef FeatureId="123"/>
                      </FareComponent>
                      <FareComponent BrandID="BS" BrandName="BUSINESS" ProgramCode="CFFU6" ProgramDescription="U6 DOMESTIC" ProgramID="83326" ProgramSystemCode="A">
                        <Segment FlightIndex="1" LegIndex="2"/>
                        <BrandFeatureRef FeatureId="15"/>
                        <BrandFeatureRef FeatureId="17"/>
                        <BrandFeatureRef FeatureId="19"/>
                        <BrandFeatureRef FeatureId="24"/>
                        <BrandFeatureRef FeatureId="41"/>
                        <BrandFeatureRef FeatureId="42"/>
                        <BrandFeatureRef FeatureId="100"/>
                        <BrandFeatureRef FeatureId="97"/>
                        <BrandFeatureRef FeatureId="66"/>
                        <BrandFeatureRef FeatureId="59"/>
                        <BrandFeatureRef FeatureId="64"/>
                        <BrandFeatureRef FeatureId="105"/>
                        <BrandFeatureRef FeatureId="110"/>
                        <BrandFeatureRef FeatureId="119"/>
                        <BrandFeatureRef FeatureId="123"/>
                      </FareComponent>
                    </FareComponents>
                    <Messages>
                      <Message AirlineCode="U6" FailCode="0" Info="NONEND" Type="N"/>
                      <Message FailCode="0" Info="VALIDATING CARRIER" Type="W"/>
                      <Message FailCode="0" Info="BSP - U6" Type="W"/>
                      <Message FailCode="0" Info="GEN - U6" Type="W"/>
                      <Message FailCode="0" Info="TCH - U6" Type="W"/>
                      <Message FailCode="0" Info="CAT 15 SALES RESTRICTIONS FREE TEXT FOUND - VERIFY RULES" Type="W"/>
                    </Messages>
                    <BaggageInformationList>
                      <BaggageInformation AirlineCode="U6" ProvisionType="A">
                        <Segment Id="0"/>
                        <Allowance Description1="UP TO 70 POUNDS/32 KILOGRAMS" Description2="UP TO 80 LINEAR INCHES/203 LINEAR CENTIMETERS" Pieces="2"/>
                      </BaggageInformation>
                      <BaggageInformation AirlineCode="U6" ProvisionType="A">
                        <Segment Id="1"/>
                        <Allowance Description1="UP TO 70 POUNDS/32 KILOGRAMS" Description2="UP TO 80 LINEAR INCHES/203 LINEAR CENTIMETERS" Pieces="2"/>
                      </BaggageInformation>
                    </BaggageInformationList>
                  </TPA_Extensions>
                </PassengerFare>
                <Endorsements NonRefundableIndicator="false"/>
                <TPA_Extensions>
                  <FareCalcLine Info="ZIA U6 AER26187U6 ZIA26188RUB52375END"/>
                </TPA_Extensions>
                <FareInfos>
                  <FareInfo>
                    <FareReference>D</FareReference>
                    <TPA_Extensions>
                      <SeatsRemaining BelowMin="false" Number="4"/>
                      <Cabin Cabin="C"/>
                      <Meal Code="H"/>
                    </TPA_Extensions>
                  </FareInfo>
                  <FareInfo>
                    <FareReference>D</FareReference>
                    <TPA_Extensions>
                      <SeatsRemaining BelowMin="false" Number="4"/>
                      <Cabin Cabin="C"/>
                      <Meal Code="H"/>
                    </TPA_Extensions>
                  </FareInfo>
                </FareInfos>
              </PTC_FareBreakdown>
              <PTC_FareBreakdown>
                <PassengerTypeQuantity Code="CNN" Quantity="1"/>
                <FareBasisCodes>
                  <FareBasisCode ArrivalAirportCode="AER" AvailabilityBreak="true" BookingCode="D" DepartureAirportCode="ZIA" FareComponentBeginAirport="ZIA" FareComponentDirectionality="FROM" FareComponentEndAirport="AER" FareComponentFareRule="U6BS" FareComponentFareTariff="304" FareComponentFareType="BS" FareComponentFareTypeBitmap="01" FareComponentVendorCode="ATP" GovCarrier="U6">DBSRT/CH50</FareBasisCode>
                  <FareBasisCode ArrivalAirportCode="ZIA" AvailabilityBreak="true" BookingCode="D" DepartureAirportCode="AER" FareComponentBeginAirport="AER" FareComponentDirectionality="TO" FareComponentEndAirport="ZIA" FareComponentFareRule="U6BS" FareComponentFareTariff="304" FareComponentFareType="BS" FareComponentFareTypeBitmap="01" FareComponentVendorCode="ATP" GovCarrier="U6">DBSRT/CH50</FareBasisCode>
                </FareBasisCodes>
                <PassengerFare>
                  <BaseFare Amount="26190" CurrencyCode="RUB"/>
                  <FareConstruction Amount="26190" CurrencyCode="RUB" DecimalPlaces="0"/>
                  <EquivFare Amount="26190" CurrencyCode="RUB" DecimalPlaces="0"/>
                  <Taxes>
                    <Tax Amount="2150" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                    <Tax Amount="2150" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                    <Tax Amount="400" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRI"/>
                    <Tax Amount="400" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRI"/>
                    <Tax Amount="38" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                    <Tax Amount="60" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                    <Tax Amount="38" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI4"/>
                    <Tax Amount="60" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI4"/>
                    <TaxSummary Amount="4300" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                    <TaxSummary Amount="800" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRI"/>
                    <TaxSummary Amount="196" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                    <TotalTax Amount="5296" CurrencyCode="RUB" DecimalPlaces="0"/>
                  </Taxes>
                  <TotalFare Amount="31486" CurrencyCode="RUB"/>
                  <TPA_Extensions>
                    <FareComponents>
                      <FareComponent BrandID="BS" BrandName="BUSINESS" ProgramCode="CFFU6" ProgramDescription="U6 DOMESTIC" ProgramID="83326" ProgramSystemCode="A">
                        <Segment FlightIndex="1" LegIndex="1"/>
                        <BrandFeatureRef FeatureId="15"/>
                        <BrandFeatureRef FeatureId="17"/>
                        <BrandFeatureRef FeatureId="19"/>
                        <BrandFeatureRef FeatureId="24"/>
                        <BrandFeatureRef FeatureId="41"/>
                        <BrandFeatureRef FeatureId="42"/>
                        <BrandFeatureRef FeatureId="100"/>
                        <BrandFeatureRef FeatureId="97"/>
                        <BrandFeatureRef FeatureId="66"/>
                        <BrandFeatureRef FeatureId="59"/>
                        <BrandFeatureRef FeatureId="64"/>
                        <BrandFeatureRef FeatureId="105"/>
                        <BrandFeatureRef FeatureId="110"/>
                        <BrandFeatureRef FeatureId="119"/>
                        <BrandFeatureRef FeatureId="123"/>
                      </FareComponent>
                      <FareComponent BrandID="BS" BrandName="BUSINESS" ProgramCode="CFFU6" ProgramDescription="U6 DOMESTIC" ProgramID="83326" ProgramSystemCode="A">
                        <Segment FlightIndex="1" LegIndex="2"/>
                        <BrandFeatureRef FeatureId="15"/>
                        <BrandFeatureRef FeatureId="17"/>
                        <BrandFeatureRef FeatureId="19"/>
                        <BrandFeatureRef FeatureId="24"/>
                        <BrandFeatureRef FeatureId="41"/>
                        <BrandFeatureRef FeatureId="42"/>
                        <BrandFeatureRef FeatureId="100"/>
                        <BrandFeatureRef FeatureId="97"/>
                        <BrandFeatureRef FeatureId="66"/>
                        <BrandFeatureRef FeatureId="59"/>
                        <BrandFeatureRef FeatureId="64"/>
                        <BrandFeatureRef FeatureId="105"/>
                        <BrandFeatureRef FeatureId="110"/>
                        <BrandFeatureRef FeatureId="119"/>
                        <BrandFeatureRef FeatureId="123"/>
                      </FareComponent>
                    </FareComponents>
                    <Messages>
                      <Message AirlineCode="U6" FailCode="0" Info="NONEND" Type="N"/>
                      <Message FailCode="0" Info="EACH CNN REQUIRES ACCOMPANYING SAME CABIN ADT" Type="W"/>
                      <Message FailCode="0" Info="VALIDATING CARRIER" Type="W"/>
                      <Message FailCode="0" Info="BSP - U6" Type="W"/>
                      <Message FailCode="0" Info="GEN - U6" Type="W"/>
                      <Message FailCode="0" Info="TCH - U6" Type="W"/>
                      <Message FailCode="0" Info="CAT 15 SALES RESTRICTIONS FREE TEXT FOUND - VERIFY RULES" Type="W"/>
                    </Messages>
                    <BaggageInformationList>
                      <BaggageInformation AirlineCode="U6" ProvisionType="A">
                        <Segment Id="0"/>
                        <Allowance Description1="UP TO 70 POUNDS/32 KILOGRAMS" Description2="UP TO 80 LINEAR INCHES/203 LINEAR CENTIMETERS" Pieces="2"/>
                      </BaggageInformation>
                      <BaggageInformation AirlineCode="U6" ProvisionType="A">
                        <Segment Id="1"/>
                        <Allowance Description1="UP TO 70 POUNDS/32 KILOGRAMS" Description2="UP TO 80 LINEAR INCHES/203 LINEAR CENTIMETERS" Pieces="2"/>
                      </BaggageInformation>
                    </BaggageInformationList>
                  </TPA_Extensions>
                </PassengerFare>
                <Endorsements NonRefundableIndicator="false"/>
                <TPA_Extensions>
                  <FareCalcLine Info="ZIA U6 AER13095U6 ZIA13095RUB26190END"/>
                </TPA_Extensions>
                <FareInfos>
                  <FareInfo>
                    <FareReference>D</FareReference>
                    <TPA_Extensions>
                      <SeatsRemaining BelowMin="false" Number="4"/>
                      <Cabin Cabin="C"/>
                      <Meal Code="H"/>
                    </TPA_Extensions>
                  </FareInfo>
                  <FareInfo>
                    <FareReference>D</FareReference>
                    <TPA_Extensions>
                      <SeatsRemaining BelowMin="false" Number="4"/>
                      <Cabin Cabin="C"/>
                      <Meal Code="H"/>
                    </TPA_Extensions>
                  </FareInfo>
                </FareInfos>
              </PTC_FareBreakdown>
              <PTC_FareBreakdown>
                <PassengerTypeQuantity Code="INF" Quantity="1"/>
                <FareBasisCodes>
                  <FareBasisCode ArrivalAirportCode="AER" AvailabilityBreak="true" BookingCode="D" DepartureAirportCode="ZIA" FareComponentBeginAirport="ZIA" FareComponentDirectionality="FROM" FareComponentEndAirport="AER" FareComponentFareRule="U6BS" FareComponentFareTariff="304" FareComponentFareType="BS" FareComponentFareTypeBitmap="01" FareComponentVendorCode="ATP" GovCarrier="U6">DBSRT/IN</FareBasisCode>
                  <FareBasisCode ArrivalAirportCode="ZIA" AvailabilityBreak="true" BookingCode="D" DepartureAirportCode="AER" FareComponentBeginAirport="AER" FareComponentDirectionality="TO" FareComponentEndAirport="ZIA" FareComponentFareRule="U6BS" FareComponentFareTariff="304" FareComponentFareType="BS" FareComponentFareTypeBitmap="01" FareComponentVendorCode="ATP" GovCarrier="U6">DBSRT/IN</FareBasisCode>
                </FareBasisCodes>
                <PassengerFare>
                  <BaseFare Amount="0" CurrencyCode="RUB"/>
                  <FareConstruction Amount="0" CurrencyCode="RUB" DecimalPlaces="0"/>
                  <EquivFare Amount="0" CurrencyCode="RUB" DecimalPlaces="0"/>
                  <TotalFare Amount="0" CurrencyCode="RUB"/>
                  <TPA_Extensions>
                    <FareComponents>
                      <FareComponent BrandID="BS" BrandName="BUSINESS" ProgramCode="CFFU6" ProgramDescription="U6 DOMESTIC" ProgramID="83326" ProgramSystemCode="A">
                        <Segment FlightIndex="1" LegIndex="1"/>
                        <BrandFeatureRef FeatureId="15"/>
                        <BrandFeatureRef FeatureId="17"/>
                        <BrandFeatureRef FeatureId="19"/>
                        <BrandFeatureRef FeatureId="24"/>
                        <BrandFeatureRef FeatureId="41"/>
                        <BrandFeatureRef FeatureId="42"/>
                        <BrandFeatureRef FeatureId="100"/>
                        <BrandFeatureRef FeatureId="97"/>
                        <BrandFeatureRef FeatureId="66"/>
                        <BrandFeatureRef FeatureId="59"/>
                        <BrandFeatureRef FeatureId="64"/>
                        <BrandFeatureRef FeatureId="105"/>
                        <BrandFeatureRef FeatureId="110"/>
                        <BrandFeatureRef FeatureId="119"/>
                        <BrandFeatureRef FeatureId="123"/>
                      </FareComponent>
                      <FareComponent BrandID="BS" BrandName="BUSINESS" ProgramCode="CFFU6" ProgramDescription="U6 DOMESTIC" ProgramID="83326" ProgramSystemCode="A">
                        <Segment FlightIndex="1" LegIndex="2"/>
                        <BrandFeatureRef FeatureId="15"/>
                        <BrandFeatureRef FeatureId="17"/>
                        <BrandFeatureRef FeatureId="19"/>
                        <BrandFeatureRef FeatureId="24"/>
                        <BrandFeatureRef FeatureId="41"/>
                        <BrandFeatureRef FeatureId="42"/>
                        <BrandFeatureRef FeatureId="100"/>
                        <BrandFeatureRef FeatureId="97"/>
                        <BrandFeatureRef FeatureId="66"/>
                        <BrandFeatureRef FeatureId="59"/>
                        <BrandFeatureRef FeatureId="64"/>
                        <BrandFeatureRef FeatureId="105"/>
                        <BrandFeatureRef FeatureId="110"/>
                        <BrandFeatureRef FeatureId="119"/>
                        <BrandFeatureRef FeatureId="123"/>
                      </FareComponent>
                    </FareComponents>
                    <Messages>
                      <Message AirlineCode="U6" FailCode="0" Info="NONEND" Type="N"/>
                      <Message FailCode="0" Info="EACH INF REQUIRES ACCOMPANYING ADT PASSENGER" Type="W"/>
                      <Message FailCode="0" Info="VALIDATING CARRIER" Type="W"/>
                      <Message FailCode="0" Info="BSP - U6" Type="W"/>
                      <Message FailCode="0" Info="GEN - U6" Type="W"/>
                      <Message FailCode="0" Info="TCH - U6" Type="W"/>
                      <Message FailCode="0" Info="CAT 15 SALES RESTRICTIONS FREE TEXT FOUND - VERIFY RULES" Type="W"/>
                    </Messages>
                    <BaggageInformationList>
                      <BaggageInformation AirlineCode="U6" ProvisionType="A">
                        <Segment Id="0"/>
                        <Allowance Unit="kg" Weight="10"/>
                      </BaggageInformation>
                      <BaggageInformation AirlineCode="U6" ProvisionType="A">
                        <Segment Id="1"/>
                        <Allowance Unit="kg" Weight="10"/>
                      </BaggageInformation>
                    </BaggageInformationList>
                  </TPA_Extensions>
                </PassengerFare>
                <Endorsements NonRefundableIndicator="false"/>
                <TPA_Extensions>
                  <FareCalcLine Info="ZIA U6 AER0U6 ZIA0RUB0END"/>
                </TPA_Extensions>
                <FareInfos>
                  <FareInfo>
                    <FareReference>D</FareReference>
                    <TPA_Extensions>
                      <SeatsRemaining BelowMin="false" Number="4"/>
                      <Cabin Cabin="C"/>
                      <Meal Code="H"/>
                    </TPA_Extensions>
                  </FareInfo>
                  <FareInfo>
                    <FareReference>D</FareReference>
                    <TPA_Extensions>
                      <SeatsRemaining BelowMin="false" Number="4"/>
                      <Cabin Cabin="C"/>
                      <Meal Code="H"/>
                    </TPA_Extensions>
                  </FareInfo>
                </FareInfos>
              </PTC_FareBreakdown>
            </PTC_FareBreakdowns>
            <FareInfos>
              <FareInfo>
                <FareReference>D</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="4"/>
                  <Cabin Cabin="C"/>
                  <Meal Code="H"/>
                </TPA_Extensions>
              </FareInfo>
              <FareInfo>
                <FareReference>D</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="4"/>
                  <Cabin Cabin="C"/>
                  <Meal Code="H"/>
                </TPA_Extensions>
              </FareInfo>
            </FareInfos>
            <TPA_Extensions>
              <DivideInParty Indicator="false"/>
              <AncillaryFeeGroups>
                <AncillaryFeeGroup Code="BG" Name="BAGGAGE">
                  <AncillaryFeeItem Amount="2000" AncillaryTypeCode="F" BaggageID="1" Carrier="U6" Date="2020-09-01" Description="FIRST EXCESS BAG" Description1="FIRST BAG" DestinationAirport="AER" EndSegment="1" OriginAirport="ZIA" PassengerCode="ALL" StartSegment="1" Subcode="0CC"/>
                  <AncillaryFeeItem Amount="2000" AncillaryTypeCode="F" BaggageID="2" Carrier="U6" Date="2020-09-01" Description="SECOND EXCESS BAG" Description1="SECOND BAG" DestinationAirport="AER" EndSegment="1" OriginAirport="ZIA" PassengerCode="ALL" StartSegment="1" Subcode="0CD"/>
                  <AncillaryFeeItem Amount="2000" AncillaryTypeCode="F" BaggageID="3" Carrier="U6" Date="2020-09-01" Description="THIRD EXCESS BAG" Description1="THIRD BAG" DestinationAirport="AER" EndSegment="1" OriginAirport="ZIA" PassengerCode="ALL" StartSegment="1" Subcode="0CE"/>
                  <AncillaryFeeItem Amount="2000" AncillaryTypeCode="F" BaggageID="4" Carrier="U6" Date="2020-09-01" Description="UPTO22LB 10KG BAGGAGE" Description1="UP TO 22 POUNDS/10 KILOGRAMS" DestinationAirport="AER" EndSegment="1" OriginAirport="ZIA" PassengerCode="ALL" StartSegment="1" Subcode="0CZ"/>
                  <AncillaryFeeItem Amount="2000" AncillaryTypeCode="F" BaggageID="5" Carrier="U6" Date="2020-09-01" Description="EXCESS WEIGHT SPECIAL CHARGE" Description1="EXCESS WEIGHT" Description2="SPECIAL CHARGE" DestinationAirport="AER" EndSegment="1" OriginAirport="ZIA" PassengerCode="ALL" StartSegment="1" Subcode="0H6"/>
                  <AncillaryFeeItem Amount="2500" AncillaryTypeCode="F" BaggageID="6" Carrier="U6" Date="2020-09-01" Description="EXTRA CARRYON BG" Description1="EXCESS SIZE" Description2="SPECIAL CHARGE" DestinationAirport="AER" EndSegment="1" OriginAirport="ZIA" PassengerCode="ALL" StartSegment="1" Subcode="0H7"/>
                  <AncillaryFeeItem Amount="2500" AncillaryTypeCode="F" BaggageID="7" Carrier="U6" Date="2020-09-01" Description="CARRY ON HAND BAGGAGE" DestinationAirport="AER" EndSegment="1" OriginAirport="ZIA" PassengerCode="ALL" StartSegment="1" Subcode="0L5" Subgroup="CY"/>
                  <AncillaryFeeItem Amount="2000" AncillaryTypeCode="F" BaggageID="8" Carrier="U6" Date="2020-09-08" Description="FIRST EXCESS BAG" Description1="FIRST BAG" DestinationAirport="ZIA" EndSegment="2" OriginAirport="AER" PassengerCode="ALL" StartSegment="2" Subcode="0CC"/>
                  <AncillaryFeeItem Amount="2000" AncillaryTypeCode="F" BaggageID="9" Carrier="U6" Date="2020-09-08" Description="SECOND EXCESS BAG" Description1="SECOND BAG" DestinationAirport="ZIA" EndSegment="2" OriginAirport="AER" PassengerCode="ALL" StartSegment="2" Subcode="0CD"/>
                  <AncillaryFeeItem Amount="2000" AncillaryTypeCode="F" BaggageID="10" Carrier="U6" Date="2020-09-08" Description="THIRD EXCESS BAG" Description1="THIRD BAG" DestinationAirport="ZIA" EndSegment="2" OriginAirport="AER" PassengerCode="ALL" StartSegment="2" Subcode="0CE"/>
                  <AncillaryFeeItem Amount="2000" AncillaryTypeCode="F" BaggageID="11" Carrier="U6" Date="2020-09-08" Description="UPTO22LB 10KG BAGGAGE" Description1="UP TO 22 POUNDS/10 KILOGRAMS" DestinationAirport="ZIA" EndSegment="2" OriginAirport="AER" PassengerCode="ALL" StartSegment="2" Subcode="0CZ"/>
                  <AncillaryFeeItem Amount="2000" AncillaryTypeCode="F" BaggageID="12" Carrier="U6" Date="2020-09-08" Description="EXCESS WEIGHT SPECIAL CHARGE" Description1="EXCESS WEIGHT" Description2="SPECIAL CHARGE" DestinationAirport="ZIA" EndSegment="2" OriginAirport="AER" PassengerCode="ALL" StartSegment="2" Subcode="0H6"/>
                  <AncillaryFeeItem Amount="2500" AncillaryTypeCode="F" BaggageID="13" Carrier="U6" Date="2020-09-08" Description="EXTRA CARRYON BG" Description1="EXCESS SIZE" Description2="SPECIAL CHARGE" DestinationAirport="ZIA" EndSegment="2" OriginAirport="AER" PassengerCode="ALL" StartSegment="2" Subcode="0H7"/>
                  <AncillaryFeeItem Amount="2500" AncillaryTypeCode="F" BaggageID="14" Carrier="U6" Date="2020-09-08" Description="CARRY ON HAND BAGGAGE" DestinationAirport="ZIA" EndSegment="2" OriginAirport="AER" PassengerCode="ALL" StartSegment="2" Subcode="0L5" Subgroup="CY"/>
                </AncillaryFeeGroup>
                <OrderStandardBag>
                  <PassengerBags Code="ADT">
                    <BaggageSequenceOrder BaggageID="1" StandardBag="1"/>
                    <BaggageSequenceOrder BaggageID="2" StandardBag="2"/>
                    <BaggageSequenceOrder BaggageID="3" StandardBag="3"/>
                    <BaggageSequenceOrder BaggageID="8" StandardBag="1"/>
                    <BaggageSequenceOrder BaggageID="9" StandardBag="2"/>
                    <BaggageSequenceOrder BaggageID="10" StandardBag="3"/>
                  </PassengerBags>
                  <PassengerBags Code="CNN">
                    <BaggageSequenceOrder BaggageID="1" StandardBag="1"/>
                    <BaggageSequenceOrder BaggageID="2" StandardBag="2"/>
                    <BaggageSequenceOrder BaggageID="3" StandardBag="3"/>
                    <BaggageSequenceOrder BaggageID="8" StandardBag="1"/>
                    <BaggageSequenceOrder BaggageID="9" StandardBag="2"/>
                    <BaggageSequenceOrder BaggageID="10" StandardBag="3"/>
                  </PassengerBags>
                  <PassengerBags Code="INF">
                    <BaggageSequenceOrder BaggageID="1" StandardBag="1"/>
                    <BaggageSequenceOrder BaggageID="2" StandardBag="2"/>
                    <BaggageSequenceOrder BaggageID="3" StandardBag="3"/>
                    <BaggageSequenceOrder BaggageID="8" StandardBag="1"/>
                    <BaggageSequenceOrder BaggageID="9" StandardBag="2"/>
                    <BaggageSequenceOrder BaggageID="10" StandardBag="3"/>
                  </PassengerBags>
                </OrderStandardBag>
              </AncillaryFeeGroups>
              <ValidatingCarrier NewVcxProcess="true" SettlementMethod="BSP">
                <Default Code="U6"/>
              </ValidatingCarrier>
              <ValidatingCarrier NewVcxProcess="true" SettlementMethod="TCH">
                <Default Code="U6"/>
              </ValidatingCarrier>
              <ValidatingCarrier NewVcxProcess="true" SettlementMethod="GEN">
                <Default Code="U6"/>
              </ValidatingCarrier>
            </TPA_Extensions>
          </AirItineraryPricingInfo>
          <TicketingInfo TicketType="eTicket" ValidInterline="Yes"/>
        </AdditionalFares>
        <AdditionalFares>
          <AirItineraryPricingInfo BrandsOnAnyMarket="true" FareReturned="true" FlexibleFareID="2" LastTicketDate="2020-05-13" LastTicketTime="23:59" PricingSource="ADVJR1" PricingSubSource="MIP">
            <ItinTotalFare>
              <BaseFare Amount="4480" CurrencyCode="RUB" DecimalPlaces="0"/>
              <FareConstruction Amount="4480" CurrencyCode="RUB" DecimalPlaces="0"/>
              <EquivFare Amount="4480" CurrencyCode="RUB" DecimalPlaces="0"/>
              <Taxes>
                <Tax Amount="21376" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="TOTALTAX"/>
              </Taxes>
              <TotalFare Amount="25856" CurrencyCode="RUB" DecimalPlaces="0"/>
            </ItinTotalFare>
            <PTC_FareBreakdowns>
              <PTC_FareBreakdown>
                <PassengerTypeQuantity Code="ADT" Quantity="2"/>
                <FareBasisCodes>
                  <FareBasisCode ArrivalAirportCode="AER" AvailabilityBreak="true" BookingCode="W" DepartureAirportCode="ZIA" FareComponentBeginAirport="ZIA" FareComponentDirectionality="FROM" FareComponentEndAirport="AER" FareComponentFareRule="U6PR" FareComponentFareTariff="304" FareComponentFareType="XPN" FareComponentFareTypeBitmap="00" FareComponentVendorCode="ATP" GovCarrier="U6">WPRRT</FareBasisCode>
                  <FareBasisCode ArrivalAirportCode="ZIA" AvailabilityBreak="true" BookingCode="W" DepartureAirportCode="AER" FareComponentBeginAirport="AER" FareComponentDirectionality="TO" FareComponentEndAirport="ZIA" FareComponentFareRule="U6PR" FareComponentFareTariff="304" FareComponentFareType="XPN" FareComponentFareTypeBitmap="00" FareComponentVendorCode="ATP" GovCarrier="U6">WPRRT</FareBasisCode>
                </FareBasisCodes>
                <PassengerFare>
                  <BaseFare Amount="1280" CurrencyCode="RUB"/>
                  <FareConstruction Amount="1280" CurrencyCode="RUB" DecimalPlaces="0"/>
                  <EquivFare Amount="1280" CurrencyCode="RUB" DecimalPlaces="0"/>
                  <Taxes>
                    <Tax Amount="2150" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                    <Tax Amount="2150" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                    <Tax Amount="400" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRI"/>
                    <Tax Amount="400" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRI"/>
                    <Tax Amount="75" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                    <Tax Amount="120" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                    <Tax Amount="75" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI4"/>
                    <Tax Amount="120" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI4"/>
                    <TaxSummary Amount="4300" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                    <TaxSummary Amount="800" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRI"/>
                    <TaxSummary Amount="390" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                    <TotalTax Amount="5490" CurrencyCode="RUB" DecimalPlaces="0"/>
                  </Taxes>
                  <TotalFare Amount="6770" CurrencyCode="RUB"/>
                  <TPA_Extensions>
                    <FareComponents>
                      <FareComponent BrandID="PR" BrandName="PROMO" ProgramCode="CFFU6" ProgramDescription="U6 DOMESTIC" ProgramID="83326" ProgramSystemCode="A">
                        <Segment FlightIndex="1" LegIndex="1"/>
                        <BrandFeatureRef FeatureId="16"/>
                        <BrandFeatureRef FeatureId="18"/>
                        <BrandFeatureRef FeatureId="20"/>
                        <BrandFeatureRef FeatureId="25"/>
                        <BrandFeatureRef FeatureId="40"/>
                        <BrandFeatureRef FeatureId="42"/>
                        <BrandFeatureRef FeatureId="99"/>
                        <BrandFeatureRef FeatureId="95"/>
                        <BrandFeatureRef FeatureId="65"/>
                        <BrandFeatureRef FeatureId="58"/>
                        <BrandFeatureRef FeatureId="60"/>
                        <BrandFeatureRef FeatureId="106"/>
                        <BrandFeatureRef FeatureId="110"/>
                        <BrandFeatureRef FeatureId="121"/>
                        <BrandFeatureRef FeatureId="124"/>
                      </FareComponent>
                      <FareComponent BrandID="PR" BrandName="PROMO" ProgramCode="CFFU6" ProgramDescription="U6 DOMESTIC" ProgramID="83326" ProgramSystemCode="A">
                        <Segment FlightIndex="1" LegIndex="2"/>
                        <BrandFeatureRef FeatureId="16"/>
                        <BrandFeatureRef FeatureId="18"/>
                        <BrandFeatureRef FeatureId="20"/>
                        <BrandFeatureRef FeatureId="25"/>
                        <BrandFeatureRef FeatureId="40"/>
                        <BrandFeatureRef FeatureId="42"/>
                        <BrandFeatureRef FeatureId="99"/>
                        <BrandFeatureRef FeatureId="95"/>
                        <BrandFeatureRef FeatureId="65"/>
                        <BrandFeatureRef FeatureId="58"/>
                        <BrandFeatureRef FeatureId="60"/>
                        <BrandFeatureRef FeatureId="106"/>
                        <BrandFeatureRef FeatureId="110"/>
                        <BrandFeatureRef FeatureId="121"/>
                        <BrandFeatureRef FeatureId="124"/>
                      </FareComponent>
                    </FareComponents>
                    <Messages>
                      <Message AirlineCode="U6" FailCode="0" Info="NONEND" Type="N"/>
                      <Message FailCode="0" Info="VALIDATING CARRIER" Type="W"/>
                      <Message FailCode="0" Info="BSP - U6" Type="W"/>
                      <Message FailCode="0" Info="GEN - U6" Type="W"/>
                      <Message FailCode="0" Info="TCH - U6" Type="W"/>
                      <Message FailCode="0" Info="CAT 15 SALES RESTRICTIONS FREE TEXT FOUND - VERIFY RULES" Type="W"/>
                    </Messages>
                    <BaggageInformationList>
                      <BaggageInformation AirlineCode="U6" ProvisionType="A">
                        <Segment Id="0"/>
                        <Allowance Unit="kg" Weight="10"/>
                      </BaggageInformation>
                      <BaggageInformation AirlineCode="U6" ProvisionType="A">
                        <Segment Id="1"/>
                        <Allowance Unit="kg" Weight="10"/>
                      </BaggageInformation>
                    </BaggageInformationList>
                  </TPA_Extensions>
                </PassengerFare>
                <Endorsements NonRefundableIndicator="true"/>
                <TPA_Extensions>
                  <FareCalcLine Info="ZIA U6 AER640U6 ZIA640RUB1280END"/>
                </TPA_Extensions>
                <FareInfos>
                  <FareInfo>
                    <FareReference>W</FareReference>
                    <TPA_Extensions>
                      <SeatsRemaining BelowMin="false" Number="9"/>
                      <Cabin Cabin="Y"/>
                      <Meal Code="N"/>
                    </TPA_Extensions>
                  </FareInfo>
                  <FareInfo>
                    <FareReference>W</FareReference>
                    <TPA_Extensions>
                      <SeatsRemaining BelowMin="false" Number="9"/>
                      <Cabin Cabin="Y"/>
                      <Meal Code="N"/>
                    </TPA_Extensions>
                  </FareInfo>
                </FareInfos>
              </PTC_FareBreakdown>
              <PTC_FareBreakdown>
                <PassengerTypeQuantity Code="CNN" Quantity="1"/>
                <FareBasisCodes>
                  <FareBasisCode ArrivalAirportCode="AER" AvailabilityBreak="true" BookingCode="W" DepartureAirportCode="ZIA" FareComponentBeginAirport="ZIA" FareComponentDirectionality="FROM" FareComponentEndAirport="AER" FareComponentFareRule="U6PR" FareComponentFareTariff="304" FareComponentFareType="XPN" FareComponentFareTypeBitmap="01" FareComponentVendorCode="ATP" GovCarrier="U6">WPRRT/CH25</FareBasisCode>
                  <FareBasisCode ArrivalAirportCode="ZIA" AvailabilityBreak="true" BookingCode="W" DepartureAirportCode="AER" FareComponentBeginAirport="AER" FareComponentDirectionality="TO" FareComponentEndAirport="ZIA" FareComponentFareRule="U6PR" FareComponentFareTariff="304" FareComponentFareType="XPN" FareComponentFareTypeBitmap="01" FareComponentVendorCode="ATP" GovCarrier="U6">WPRRT/CH25</FareBasisCode>
                </FareBasisCodes>
                <PassengerFare>
                  <BaseFare Amount="960" CurrencyCode="RUB"/>
                  <FareConstruction Amount="960" CurrencyCode="RUB" DecimalPlaces="0"/>
                  <EquivFare Amount="960" CurrencyCode="RUB" DecimalPlaces="0"/>
                  <Taxes>
                    <Tax Amount="2150" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                    <Tax Amount="2150" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                    <Tax Amount="400" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRI"/>
                    <Tax Amount="400" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRI"/>
                    <Tax Amount="38" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                    <Tax Amount="60" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                    <Tax Amount="38" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI4"/>
                    <Tax Amount="60" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI4"/>
                    <TaxSummary Amount="4300" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                    <TaxSummary Amount="800" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRI"/>
                    <TaxSummary Amount="196" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                    <TotalTax Amount="5296" CurrencyCode="RUB" DecimalPlaces="0"/>
                  </Taxes>
                  <TotalFare Amount="6256" CurrencyCode="RUB"/>
                  <TPA_Extensions>
                    <FareComponents>
                      <FareComponent BrandID="PR" BrandName="PROMO" ProgramCode="CFFU6" ProgramDescription="U6 DOMESTIC" ProgramID="83326" ProgramSystemCode="A">
                        <Segment FlightIndex="1" LegIndex="1"/>
                        <BrandFeatureRef FeatureId="16"/>
                        <BrandFeatureRef FeatureId="18"/>
                        <BrandFeatureRef FeatureId="20"/>
                        <BrandFeatureRef FeatureId="25"/>
                        <BrandFeatureRef FeatureId="40"/>
                        <BrandFeatureRef FeatureId="42"/>
                        <BrandFeatureRef FeatureId="99"/>
                        <BrandFeatureRef FeatureId="95"/>
                        <BrandFeatureRef FeatureId="65"/>
                        <BrandFeatureRef FeatureId="58"/>
                        <BrandFeatureRef FeatureId="60"/>
                        <BrandFeatureRef FeatureId="106"/>
                        <BrandFeatureRef FeatureId="110"/>
                        <BrandFeatureRef FeatureId="121"/>
                        <BrandFeatureRef FeatureId="124"/>
                      </FareComponent>
                      <FareComponent BrandID="PR" BrandName="PROMO" ProgramCode="CFFU6" ProgramDescription="U6 DOMESTIC" ProgramID="83326" ProgramSystemCode="A">
                        <Segment FlightIndex="1" LegIndex="2"/>
                        <BrandFeatureRef FeatureId="16"/>
                        <BrandFeatureRef FeatureId="18"/>
                        <BrandFeatureRef FeatureId="20"/>
                        <BrandFeatureRef FeatureId="25"/>
                        <BrandFeatureRef FeatureId="40"/>
                        <BrandFeatureRef FeatureId="42"/>
                        <BrandFeatureRef FeatureId="99"/>
                        <BrandFeatureRef FeatureId="95"/>
                        <BrandFeatureRef FeatureId="65"/>
                        <BrandFeatureRef FeatureId="58"/>
                        <BrandFeatureRef FeatureId="60"/>
                        <BrandFeatureRef FeatureId="106"/>
                        <BrandFeatureRef FeatureId="110"/>
                        <BrandFeatureRef FeatureId="121"/>
                        <BrandFeatureRef FeatureId="124"/>
                      </FareComponent>
                    </FareComponents>
                    <Messages>
                      <Message AirlineCode="U6" FailCode="0" Info="NONEND" Type="N"/>
                      <Message FailCode="0" Info="EACH CNN REQUIRES ACCOMPANYING SAME CABIN ADT" Type="W"/>
                      <Message FailCode="0" Info="VALIDATING CARRIER" Type="W"/>
                      <Message FailCode="0" Info="BSP - U6" Type="W"/>
                      <Message FailCode="0" Info="GEN - U6" Type="W"/>
                      <Message FailCode="0" Info="TCH - U6" Type="W"/>
                      <Message FailCode="0" Info="CAT 15 SALES RESTRICTIONS FREE TEXT FOUND - VERIFY RULES" Type="W"/>
                    </Messages>
                    <BaggageInformationList>
                      <BaggageInformation AirlineCode="U6" ProvisionType="A">
                        <Segment Id="0"/>
                        <Allowance Unit="kg" Weight="10"/>
                      </BaggageInformation>
                      <BaggageInformation AirlineCode="U6" ProvisionType="A">
                        <Segment Id="1"/>
                        <Allowance Unit="kg" Weight="10"/>
                      </BaggageInformation>
                    </BaggageInformationList>
                  </TPA_Extensions>
                </PassengerFare>
                <Endorsements NonRefundableIndicator="true"/>
                <TPA_Extensions>
                  <FareCalcLine Info="ZIA U6 AER480U6 ZIA480RUB960END"/>
                </TPA_Extensions>
                <FareInfos>
                  <FareInfo>
                    <FareReference>W</FareReference>
                    <TPA_Extensions>
                      <SeatsRemaining BelowMin="false" Number="9"/>
                      <Cabin Cabin="Y"/>
                      <Meal Code="N"/>
                    </TPA_Extensions>
                  </FareInfo>
                  <FareInfo>
                    <FareReference>W</FareReference>
                    <TPA_Extensions>
                      <SeatsRemaining BelowMin="false" Number="9"/>
                      <Cabin Cabin="Y"/>
                      <Meal Code="N"/>
                    </TPA_Extensions>
                  </FareInfo>
                </FareInfos>
              </PTC_FareBreakdown>
              <PTC_FareBreakdown>
                <PassengerTypeQuantity Code="INS" Quantity="1"/>
                <FareBasisCodes>
                  <FareBasisCode ArrivalAirportCode="AER" AvailabilityBreak="true" BookingCode="W" DepartureAirportCode="ZIA" FareComponentBeginAirport="ZIA" FareComponentDirectionality="FROM" FareComponentEndAirport="AER" FareComponentFareRule="U6PR" FareComponentFareTariff="304" FareComponentFareType="XPN" FareComponentFareTypeBitmap="01" FareComponentVendorCode="ATP" GovCarrier="U6">WPRRTCH</FareBasisCode>
                  <FareBasisCode ArrivalAirportCode="ZIA" AvailabilityBreak="true" BookingCode="W" DepartureAirportCode="AER" FareComponentBeginAirport="AER" FareComponentDirectionality="TO" FareComponentEndAirport="ZIA" FareComponentFareRule="U6PR" FareComponentFareTariff="304" FareComponentFareType="XPN" FareComponentFareTypeBitmap="01" FareComponentVendorCode="ATP" GovCarrier="U6">WPRRTCH</FareBasisCode>
                </FareBasisCodes>
                <PassengerFare>
                  <BaseFare Amount="960" CurrencyCode="RUB"/>
                  <FareConstruction Amount="960" CurrencyCode="RUB" DecimalPlaces="0"/>
                  <EquivFare Amount="960" CurrencyCode="RUB" DecimalPlaces="0"/>
                  <Taxes>
                    <Tax Amount="2150" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                    <Tax Amount="2150" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                    <Tax Amount="400" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRI"/>
                    <Tax Amount="400" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRI"/>
                    <TaxSummary Amount="4300" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                    <TaxSummary Amount="800" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRI"/>
                    <TotalTax Amount="5100" CurrencyCode="RUB" DecimalPlaces="0"/>
                  </Taxes>
                  <TotalFare Amount="6060" CurrencyCode="RUB"/>
                  <TPA_Extensions>
                    <FareComponents>
                      <FareComponent BrandID="PR" BrandName="PROMO" ProgramCode="CFFU6" ProgramDescription="U6 DOMESTIC" ProgramID="83326" ProgramSystemCode="A">
                        <Segment FlightIndex="1" LegIndex="1"/>
                        <BrandFeatureRef FeatureId="16"/>
                        <BrandFeatureRef FeatureId="18"/>
                        <BrandFeatureRef FeatureId="20"/>
                        <BrandFeatureRef FeatureId="25"/>
                        <BrandFeatureRef FeatureId="40"/>
                        <BrandFeatureRef FeatureId="42"/>
                        <BrandFeatureRef FeatureId="99"/>
                        <BrandFeatureRef FeatureId="95"/>
                        <BrandFeatureRef FeatureId="65"/>
                        <BrandFeatureRef FeatureId="58"/>
                        <BrandFeatureRef FeatureId="60"/>
                        <BrandFeatureRef FeatureId="106"/>
                        <BrandFeatureRef FeatureId="110"/>
                        <BrandFeatureRef FeatureId="121"/>
                        <BrandFeatureRef FeatureId="124"/>
                      </FareComponent>
                      <FareComponent BrandID="PR" BrandName="PROMO" ProgramCode="CFFU6" ProgramDescription="U6 DOMESTIC" ProgramID="83326" ProgramSystemCode="A">
                        <Segment FlightIndex="1" LegIndex="2"/>
                        <BrandFeatureRef FeatureId="16"/>
                        <BrandFeatureRef FeatureId="18"/>
                        <BrandFeatureRef FeatureId="20"/>
                        <BrandFeatureRef FeatureId="25"/>
                        <BrandFeatureRef FeatureId="40"/>
                        <BrandFeatureRef FeatureId="42"/>
                        <BrandFeatureRef FeatureId="99"/>
                        <BrandFeatureRef FeatureId="95"/>
                        <BrandFeatureRef FeatureId="65"/>
                        <BrandFeatureRef FeatureId="58"/>
                        <BrandFeatureRef FeatureId="60"/>
                        <BrandFeatureRef FeatureId="106"/>
                        <BrandFeatureRef FeatureId="110"/>
                        <BrandFeatureRef FeatureId="121"/>
                        <BrandFeatureRef FeatureId="124"/>
                      </FareComponent>
                    </FareComponents>
                    <Messages>
                      <Message AirlineCode="U6" FailCode="0" Info="NONEND" Type="N"/>
                      <Message FailCode="0" Info="EACH INF REQUIRES ACCOMPANYING ADT PASSENGER" Type="W"/>
                      <Message FailCode="0" Info="VALIDATING CARRIER" Type="W"/>
                      <Message FailCode="0" Info="BSP - U6" Type="W"/>
                      <Message FailCode="0" Info="GEN - U6" Type="W"/>
                      <Message FailCode="0" Info="TCH - U6" Type="W"/>
                      <Message FailCode="0" Info="CAT 15 SALES RESTRICTIONS FREE TEXT FOUND - VERIFY RULES" Type="W"/>
                    </Messages>
                    <BaggageInformationList>
                      <BaggageInformation AirlineCode="U6" ProvisionType="A">
                        <Segment Id="0"/>
                        <Allowance Unit="kg" Weight="10"/>
                      </BaggageInformation>
                      <BaggageInformation AirlineCode="U6" ProvisionType="A">
                        <Segment Id="1"/>
                        <Allowance Unit="kg" Weight="10"/>
                      </BaggageInformation>
                    </BaggageInformationList>
                  </TPA_Extensions>
                </PassengerFare>
                <Endorsements NonRefundableIndicator="true"/>
                <TPA_Extensions>
                  <FareCalcLine Info="ZIA U6 AER480U6 ZIA480RUB960END"/>
                </TPA_Extensions>
                <FareInfos>
                  <FareInfo>
                    <FareReference>W</FareReference>
                    <TPA_Extensions>
                      <SeatsRemaining BelowMin="false" Number="9"/>
                      <Cabin Cabin="Y"/>
                      <Meal Code="N"/>
                    </TPA_Extensions>
                  </FareInfo>
                  <FareInfo>
                    <FareReference>W</FareReference>
                    <TPA_Extensions>
                      <SeatsRemaining BelowMin="false" Number="9"/>
                      <Cabin Cabin="Y"/>
                      <Meal Code="N"/>
                    </TPA_Extensions>
                  </FareInfo>
                </FareInfos>
              </PTC_FareBreakdown>
            </PTC_FareBreakdowns>
            <FareInfos>
              <FareInfo>
                <FareReference>W</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="N"/>
                </TPA_Extensions>
              </FareInfo>
              <FareInfo>
                <FareReference>W</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="N"/>
                </TPA_Extensions>
              </FareInfo>
            </FareInfos>
            <TPA_Extensions>
              <DivideInParty Indicator="false"/>
              <AncillaryFeeGroups>
                <AncillaryFeeGroup Code="BG" Name="BAGGAGE">
                  <AncillaryFeeItem Amount="2500" AncillaryTypeCode="F" BaggageID="1" Carrier="U6" Date="2020-09-01" Description="FIRST EXCESS BAG" Description1="FIRST BAG" DestinationAirport="AER" EndSegment="1" OriginAirport="ZIA" PassengerCode="ALL" StartSegment="1" Subcode="0CC"/>
                  <AncillaryFeeItem Amount="2500" AncillaryTypeCode="F" BaggageID="2" Carrier="U6" Date="2020-09-01" Description="SECOND EXCESS BAG" Description1="SECOND BAG" DestinationAirport="AER" EndSegment="1" OriginAirport="ZIA" PassengerCode="ALL" StartSegment="1" Subcode="0CD"/>
                  <AncillaryFeeItem Amount="2500" AncillaryTypeCode="F" BaggageID="3" Carrier="U6" Date="2020-09-01" Description="THIRD EXCESS BAG" Description1="THIRD BAG" DestinationAirport="AER" EndSegment="1" OriginAirport="ZIA" PassengerCode="ALL" StartSegment="1" Subcode="0CE"/>
                  <AncillaryFeeItem Amount="2000" AncillaryTypeCode="F" BaggageID="4" Carrier="U6" Date="2020-09-01" Description="UPTO22LB 10KG BAGGAGE" Description1="UP TO 22 POUNDS/10 KILOGRAMS" DestinationAirport="AER" EndSegment="1" OriginAirport="ZIA" PassengerCode="ALL" StartSegment="1" Subcode="0CZ"/>
                  <AncillaryFeeItem Amount="2000" AncillaryTypeCode="F" BaggageID="5" Carrier="U6" Date="2020-09-01" Description="EXCESS WEIGHT SPECIAL CHARGE" Description1="EXCESS WEIGHT" Description2="SPECIAL CHARGE" DestinationAirport="AER" EndSegment="1" OriginAirport="ZIA" PassengerCode="ALL" StartSegment="1" Subcode="0H6"/>
                  <AncillaryFeeItem Amount="2500" AncillaryTypeCode="F" BaggageID="6" Carrier="U6" Date="2020-09-01" Description="EXTRA CARRYON BG" Description1="EXCESS SIZE" Description2="SPECIAL CHARGE" DestinationAirport="AER" EndSegment="1" OriginAirport="ZIA" PassengerCode="ALL" StartSegment="1" Subcode="0H7"/>
                  <AncillaryFeeItem Amount="2500" AncillaryTypeCode="F" BaggageID="7" Carrier="U6" Date="2020-09-01" Description="CARRY ON HAND BAGGAGE" DestinationAirport="AER" EndSegment="1" OriginAirport="ZIA" PassengerCode="ALL" StartSegment="1" Subcode="0L5" Subgroup="CY"/>
                  <AncillaryFeeItem Amount="2500" AncillaryTypeCode="F" BaggageID="8" Carrier="U6" Date="2020-09-08" Description="FIRST EXCESS BAG" Description1="FIRST BAG" DestinationAirport="ZIA" EndSegment="2" OriginAirport="AER" PassengerCode="ALL" StartSegment="2" Subcode="0CC"/>
                  <AncillaryFeeItem Amount="2500" AncillaryTypeCode="F" BaggageID="9" Carrier="U6" Date="2020-09-08" Description="SECOND EXCESS BAG" Description1="SECOND BAG" DestinationAirport="ZIA" EndSegment="2" OriginAirport="AER" PassengerCode="ALL" StartSegment="2" Subcode="0CD"/>
                  <AncillaryFeeItem Amount="2500" AncillaryTypeCode="F" BaggageID="10" Carrier="U6" Date="2020-09-08" Description="THIRD EXCESS BAG" Description1="THIRD BAG" DestinationAirport="ZIA" EndSegment="2" OriginAirport="AER" PassengerCode="ALL" StartSegment="2" Subcode="0CE"/>
                  <AncillaryFeeItem Amount="2000" AncillaryTypeCode="F" BaggageID="11" Carrier="U6" Date="2020-09-08" Description="UPTO22LB 10KG BAGGAGE" Description1="UP TO 22 POUNDS/10 KILOGRAMS" DestinationAirport="ZIA" EndSegment="2" OriginAirport="AER" PassengerCode="ALL" StartSegment="2" Subcode="0CZ"/>
                  <AncillaryFeeItem Amount="2000" AncillaryTypeCode="F" BaggageID="12" Carrier="U6" Date="2020-09-08" Description="EXCESS WEIGHT SPECIAL CHARGE" Description1="EXCESS WEIGHT" Description2="SPECIAL CHARGE" DestinationAirport="ZIA" EndSegment="2" OriginAirport="AER" PassengerCode="ALL" StartSegment="2" Subcode="0H6"/>
                  <AncillaryFeeItem Amount="2500" AncillaryTypeCode="F" BaggageID="13" Carrier="U6" Date="2020-09-08" Description="EXTRA CARRYON BG" Description1="EXCESS SIZE" Description2="SPECIAL CHARGE" DestinationAirport="ZIA" EndSegment="2" OriginAirport="AER" PassengerCode="ALL" StartSegment="2" Subcode="0H7"/>
                  <AncillaryFeeItem Amount="2500" AncillaryTypeCode="F" BaggageID="14" Carrier="U6" Date="2020-09-08" Description="CARRY ON HAND BAGGAGE" DestinationAirport="ZIA" EndSegment="2" OriginAirport="AER" PassengerCode="ALL" StartSegment="2" Subcode="0L5" Subgroup="CY"/>
                </AncillaryFeeGroup>
                <OrderStandardBag>
                  <PassengerBags Code="ADT">
                    <BaggageSequenceOrder BaggageID="1" StandardBag="1"/>
                    <BaggageSequenceOrder BaggageID="2" StandardBag="2"/>
                    <BaggageSequenceOrder BaggageID="3" StandardBag="3"/>
                    <BaggageSequenceOrder BaggageID="8" StandardBag="1"/>
                    <BaggageSequenceOrder BaggageID="9" StandardBag="2"/>
                    <BaggageSequenceOrder BaggageID="10" StandardBag="3"/>
                  </PassengerBags>
                  <PassengerBags Code="CNN">
                    <BaggageSequenceOrder BaggageID="1" StandardBag="1"/>
                    <BaggageSequenceOrder BaggageID="2" StandardBag="2"/>
                    <BaggageSequenceOrder BaggageID="3" StandardBag="3"/>
                    <BaggageSequenceOrder BaggageID="8" StandardBag="1"/>
                    <BaggageSequenceOrder BaggageID="9" StandardBag="2"/>
                    <BaggageSequenceOrder BaggageID="10" StandardBag="3"/>
                  </PassengerBags>
                  <PassengerBags Code="INS">
                    <BaggageSequenceOrder BaggageID="1" StandardBag="1"/>
                    <BaggageSequenceOrder BaggageID="2" StandardBag="2"/>
                    <BaggageSequenceOrder BaggageID="3" StandardBag="3"/>
                    <BaggageSequenceOrder BaggageID="8" StandardBag="1"/>
                    <BaggageSequenceOrder BaggageID="9" StandardBag="2"/>
                    <BaggageSequenceOrder BaggageID="10" StandardBag="3"/>
                  </PassengerBags>
                </OrderStandardBag>
              </AncillaryFeeGroups>
              <ValidatingCarrier NewVcxProcess="true" SettlementMethod="BSP">
                <Default Code="U6"/>
              </ValidatingCarrier>
              <ValidatingCarrier NewVcxProcess="true" SettlementMethod="TCH">
                <Default Code="U6"/>
              </ValidatingCarrier>
              <ValidatingCarrier NewVcxProcess="true" SettlementMethod="GEN">
                <Default Code="U6"/>
              </ValidatingCarrier>
            </TPA_Extensions>
          </AirItineraryPricingInfo>
          <TicketingInfo TicketType="eTicket" ValidInterline="Yes"/>
        </AdditionalFares>
        <AdditionalFares>
          <AirItineraryPricingInfo BrandsOnAnyMarket="true" FareReturned="true" FlexibleFareID="3" LastTicketDate="2020-05-13" LastTicketTime="23:59" PricingSource="ADVJR1" PricingSubSource="MIP">
            <ItinTotalFare>
              <BaseFare Amount="3520" CurrencyCode="RUB" DecimalPlaces="0"/>
              <FareConstruction Amount="3520" CurrencyCode="RUB" DecimalPlaces="0"/>
              <EquivFare Amount="3520" CurrencyCode="RUB" DecimalPlaces="0"/>
              <Taxes>
                <Tax Amount="16276" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="TOTALTAX"/>
              </Taxes>
              <TotalFare Amount="19796" CurrencyCode="RUB" DecimalPlaces="0"/>
            </ItinTotalFare>
            <PTC_FareBreakdowns>
              <PTC_FareBreakdown>
                <PassengerTypeQuantity Code="ADT" Quantity="2"/>
                <FareBasisCodes>
                  <FareBasisCode ArrivalAirportCode="AER" AvailabilityBreak="true" BookingCode="W" DepartureAirportCode="ZIA" FareComponentBeginAirport="ZIA" FareComponentDirectionality="FROM" FareComponentEndAirport="AER" FareComponentFareRule="U6PR" FareComponentFareTariff="304" FareComponentFareType="XPN" FareComponentFareTypeBitmap="00" FareComponentVendorCode="ATP" GovCarrier="U6">WPRRT</FareBasisCode>
                  <FareBasisCode ArrivalAirportCode="ZIA" AvailabilityBreak="true" BookingCode="W" DepartureAirportCode="AER" FareComponentBeginAirport="AER" FareComponentDirectionality="TO" FareComponentEndAirport="ZIA" FareComponentFareRule="U6PR" FareComponentFareTariff="304" FareComponentFareType="XPN" FareComponentFareTypeBitmap="00" FareComponentVendorCode="ATP" GovCarrier="U6">WPRRT</FareBasisCode>
                </FareBasisCodes>
                <PassengerFare>
                  <BaseFare Amount="1280" CurrencyCode="RUB"/>
                  <FareConstruction Amount="1280" CurrencyCode="RUB" DecimalPlaces="0"/>
                  <EquivFare Amount="1280" CurrencyCode="RUB" DecimalPlaces="0"/>
                  <Taxes>
                    <Tax Amount="2150" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                    <Tax Amount="2150" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                    <Tax Amount="400" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRI"/>
                    <Tax Amount="400" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRI"/>
                    <Tax Amount="75" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                    <Tax Amount="120" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                    <Tax Amount="75" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI4"/>
                    <Tax Amount="120" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI4"/>
                    <TaxSummary Amount="4300" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                    <TaxSummary Amount="800" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRI"/>
                    <TaxSummary Amount="390" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                    <TotalTax Amount="5490" CurrencyCode="RUB" DecimalPlaces="0"/>
                  </Taxes>
                  <TotalFare Amount="6770" CurrencyCode="RUB"/>
                  <TPA_Extensions>
                    <FareComponents>
                      <FareComponent BrandID="PR" BrandName="PROMO" ProgramCode="CFFU6" ProgramDescription="U6 DOMESTIC" ProgramID="83326" ProgramSystemCode="A">
                        <Segment FlightIndex="1" LegIndex="1"/>
                        <BrandFeatureRef FeatureId="16"/>
                        <BrandFeatureRef FeatureId="18"/>
                        <BrandFeatureRef FeatureId="20"/>
                        <BrandFeatureRef FeatureId="25"/>
                        <BrandFeatureRef FeatureId="40"/>
                        <BrandFeatureRef FeatureId="42"/>
                        <BrandFeatureRef FeatureId="99"/>
                        <BrandFeatureRef FeatureId="95"/>
                        <BrandFeatureRef FeatureId="65"/>
                        <BrandFeatureRef FeatureId="58"/>
                        <BrandFeatureRef FeatureId="60"/>
                        <BrandFeatureRef FeatureId="106"/>
                        <BrandFeatureRef FeatureId="110"/>
                        <BrandFeatureRef FeatureId="121"/>
                        <BrandFeatureRef FeatureId="124"/>
                      </FareComponent>
                      <FareComponent BrandID="PR" BrandName="PROMO" ProgramCode="CFFU6" ProgramDescription="U6 DOMESTIC" ProgramID="83326" ProgramSystemCode="A">
                        <Segment FlightIndex="1" LegIndex="2"/>
                        <BrandFeatureRef FeatureId="16"/>
                        <BrandFeatureRef FeatureId="18"/>
                        <BrandFeatureRef FeatureId="20"/>
                        <BrandFeatureRef FeatureId="25"/>
                        <BrandFeatureRef FeatureId="40"/>
                        <BrandFeatureRef FeatureId="42"/>
                        <BrandFeatureRef FeatureId="99"/>
                        <BrandFeatureRef FeatureId="95"/>
                        <BrandFeatureRef FeatureId="65"/>
                        <BrandFeatureRef FeatureId="58"/>
                        <BrandFeatureRef FeatureId="60"/>
                        <BrandFeatureRef FeatureId="106"/>
                        <BrandFeatureRef FeatureId="110"/>
                        <BrandFeatureRef FeatureId="121"/>
                        <BrandFeatureRef FeatureId="124"/>
                      </FareComponent>
                    </FareComponents>
                    <Messages>
                      <Message AirlineCode="U6" FailCode="0" Info="NONEND" Type="N"/>
                      <Message FailCode="0" Info="VALIDATING CARRIER" Type="W"/>
                      <Message FailCode="0" Info="BSP - U6" Type="W"/>
                      <Message FailCode="0" Info="GEN - U6" Type="W"/>
                      <Message FailCode="0" Info="TCH - U6" Type="W"/>
                      <Message FailCode="0" Info="CAT 15 SALES RESTRICTIONS FREE TEXT FOUND - VERIFY RULES" Type="W"/>
                    </Messages>
                    <BaggageInformationList>
                      <BaggageInformation AirlineCode="U6" ProvisionType="A">
                        <Segment Id="0"/>
                        <Allowance Unit="kg" Weight="10"/>
                      </BaggageInformation>
                      <BaggageInformation AirlineCode="U6" ProvisionType="A">
                        <Segment Id="1"/>
                        <Allowance Unit="kg" Weight="10"/>
                      </BaggageInformation>
                    </BaggageInformationList>
                  </TPA_Extensions>
                </PassengerFare>
                <Endorsements NonRefundableIndicator="true"/>
                <TPA_Extensions>
                  <FareCalcLine Info="ZIA U6 AER640U6 ZIA640RUB1280END"/>
                </TPA_Extensions>
                <FareInfos>
                  <FareInfo>
                    <FareReference>W</FareReference>
                    <TPA_Extensions>
                      <SeatsRemaining BelowMin="false" Number="9"/>
                      <Cabin Cabin="Y"/>
                      <Meal Code="N"/>
                    </TPA_Extensions>
                  </FareInfo>
                  <FareInfo>
                    <FareReference>W</FareReference>
                    <TPA_Extensions>
                      <SeatsRemaining BelowMin="false" Number="9"/>
                      <Cabin Cabin="Y"/>
                      <Meal Code="N"/>
                    </TPA_Extensions>
                  </FareInfo>
                </FareInfos>
              </PTC_FareBreakdown>
              <PTC_FareBreakdown>
                <PassengerTypeQuantity Code="CNN" Quantity="1"/>
                <FareBasisCodes>
                  <FareBasisCode ArrivalAirportCode="AER" AvailabilityBreak="true" BookingCode="W" DepartureAirportCode="ZIA" FareComponentBeginAirport="ZIA" FareComponentDirectionality="FROM" FareComponentEndAirport="AER" FareComponentFareRule="U6PR" FareComponentFareTariff="304" FareComponentFareType="XPN" FareComponentFareTypeBitmap="01" FareComponentVendorCode="ATP" GovCarrier="U6">WPRRT/CH25</FareBasisCode>
                  <FareBasisCode ArrivalAirportCode="ZIA" AvailabilityBreak="true" BookingCode="W" DepartureAirportCode="AER" FareComponentBeginAirport="AER" FareComponentDirectionality="TO" FareComponentEndAirport="ZIA" FareComponentFareRule="U6PR" FareComponentFareTariff="304" FareComponentFareType="XPN" FareComponentFareTypeBitmap="01" FareComponentVendorCode="ATP" GovCarrier="U6">WPRRT/CH25</FareBasisCode>
                </FareBasisCodes>
                <PassengerFare>
                  <BaseFare Amount="960" CurrencyCode="RUB"/>
                  <FareConstruction Amount="960" CurrencyCode="RUB" DecimalPlaces="0"/>
                  <EquivFare Amount="960" CurrencyCode="RUB" DecimalPlaces="0"/>
                  <Taxes>
                    <Tax Amount="2150" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                    <Tax Amount="2150" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                    <Tax Amount="400" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRI"/>
                    <Tax Amount="400" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRI"/>
                    <Tax Amount="38" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                    <Tax Amount="60" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                    <Tax Amount="38" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI4"/>
                    <Tax Amount="60" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI4"/>
                    <TaxSummary Amount="4300" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                    <TaxSummary Amount="800" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRI"/>
                    <TaxSummary Amount="196" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                    <TotalTax Amount="5296" CurrencyCode="RUB" DecimalPlaces="0"/>
                  </Taxes>
                  <TotalFare Amount="6256" CurrencyCode="RUB"/>
                  <TPA_Extensions>
                    <FareComponents>
                      <FareComponent BrandID="PR" BrandName="PROMO" ProgramCode="CFFU6" ProgramDescription="U6 DOMESTIC" ProgramID="83326" ProgramSystemCode="A">
                        <Segment FlightIndex="1" LegIndex="1"/>
                        <BrandFeatureRef FeatureId="16"/>
                        <BrandFeatureRef FeatureId="18"/>
                        <BrandFeatureRef FeatureId="20"/>
                        <BrandFeatureRef FeatureId="25"/>
                        <BrandFeatureRef FeatureId="40"/>
                        <BrandFeatureRef FeatureId="42"/>
                        <BrandFeatureRef FeatureId="99"/>
                        <BrandFeatureRef FeatureId="95"/>
                        <BrandFeatureRef FeatureId="65"/>
                        <BrandFeatureRef FeatureId="58"/>
                        <BrandFeatureRef FeatureId="60"/>
                        <BrandFeatureRef FeatureId="106"/>
                        <BrandFeatureRef FeatureId="110"/>
                        <BrandFeatureRef FeatureId="121"/>
                        <BrandFeatureRef FeatureId="124"/>
                      </FareComponent>
                      <FareComponent BrandID="PR" BrandName="PROMO" ProgramCode="CFFU6" ProgramDescription="U6 DOMESTIC" ProgramID="83326" ProgramSystemCode="A">
                        <Segment FlightIndex="1" LegIndex="2"/>
                        <BrandFeatureRef FeatureId="16"/>
                        <BrandFeatureRef FeatureId="18"/>
                        <BrandFeatureRef FeatureId="20"/>
                        <BrandFeatureRef FeatureId="25"/>
                        <BrandFeatureRef FeatureId="40"/>
                        <BrandFeatureRef FeatureId="42"/>
                        <BrandFeatureRef FeatureId="99"/>
                        <BrandFeatureRef FeatureId="95"/>
                        <BrandFeatureRef FeatureId="65"/>
                        <BrandFeatureRef FeatureId="58"/>
                        <BrandFeatureRef FeatureId="60"/>
                        <BrandFeatureRef FeatureId="106"/>
                        <BrandFeatureRef FeatureId="110"/>
                        <BrandFeatureRef FeatureId="121"/>
                        <BrandFeatureRef FeatureId="124"/>
                      </FareComponent>
                    </FareComponents>
                    <Messages>
                      <Message AirlineCode="U6" FailCode="0" Info="NONEND" Type="N"/>
                      <Message FailCode="0" Info="EACH CNN REQUIRES ACCOMPANYING SAME CABIN ADT" Type="W"/>
                      <Message FailCode="0" Info="VALIDATING CARRIER" Type="W"/>
                      <Message FailCode="0" Info="BSP - U6" Type="W"/>
                      <Message FailCode="0" Info="GEN - U6" Type="W"/>
                      <Message FailCode="0" Info="TCH - U6" Type="W"/>
                      <Message FailCode="0" Info="CAT 15 SALES RESTRICTIONS FREE TEXT FOUND - VERIFY RULES" Type="W"/>
                    </Messages>
                    <BaggageInformationList>
                      <BaggageInformation AirlineCode="U6" ProvisionType="A">
                        <Segment Id="0"/>
                        <Allowance Unit="kg" Weight="10"/>
                      </BaggageInformation>
                      <BaggageInformation AirlineCode="U6" ProvisionType="A">
                        <Segment Id="1"/>
                        <Allowance Unit="kg" Weight="10"/>
                      </BaggageInformation>
                    </BaggageInformationList>
                  </TPA_Extensions>
                </PassengerFare>
                <Endorsements NonRefundableIndicator="true"/>
                <TPA_Extensions>
                  <FareCalcLine Info="ZIA U6 AER480U6 ZIA480RUB960END"/>
                </TPA_Extensions>
                <FareInfos>
                  <FareInfo>
                    <FareReference>W</FareReference>
                    <TPA_Extensions>
                      <SeatsRemaining BelowMin="false" Number="9"/>
                      <Cabin Cabin="Y"/>
                      <Meal Code="N"/>
                    </TPA_Extensions>
                  </FareInfo>
                  <FareInfo>
                    <FareReference>W</FareReference>
                    <TPA_Extensions>
                      <SeatsRemaining BelowMin="false" Number="9"/>
                      <Cabin Cabin="Y"/>
                      <Meal Code="N"/>
                    </TPA_Extensions>
                  </FareInfo>
                </FareInfos>
              </PTC_FareBreakdown>
              <PTC_FareBreakdown>
                <PassengerTypeQuantity Code="INF" Quantity="1"/>
                <FareBasisCodes>
                  <FareBasisCode ArrivalAirportCode="AER" AvailabilityBreak="true" BookingCode="W" DepartureAirportCode="ZIA" FareComponentBeginAirport="ZIA" FareComponentDirectionality="FROM" FareComponentEndAirport="AER" FareComponentFareRule="U6PR" FareComponentFareTariff="304" FareComponentFareType="XPN" FareComponentFareTypeBitmap="01" FareComponentVendorCode="ATP" GovCarrier="U6">WPRRT/IN</FareBasisCode>
                  <FareBasisCode ArrivalAirportCode="ZIA" AvailabilityBreak="true" BookingCode="W" DepartureAirportCode="AER" FareComponentBeginAirport="AER" FareComponentDirectionality="TO" FareComponentEndAirport="ZIA" FareComponentFareRule="U6PR" FareComponentFareTariff="304" FareComponentFareType="XPN" FareComponentFareTypeBitmap="01" FareComponentVendorCode="ATP" GovCarrier="U6">WPRRT/IN</FareBasisCode>
                </FareBasisCodes>
                <PassengerFare>
                  <BaseFare Amount="0" CurrencyCode="RUB"/>
                  <FareConstruction Amount="0" CurrencyCode="RUB" DecimalPlaces="0"/>
                  <EquivFare Amount="0" CurrencyCode="RUB" DecimalPlaces="0"/>
                  <TotalFare Amount="0" CurrencyCode="RUB"/>
                  <TPA_Extensions>
                    <FareComponents>
                      <FareComponent BrandID="PR" BrandName="PROMO" ProgramCode="CFFU6" ProgramDescription="U6 DOMESTIC" ProgramID="83326" ProgramSystemCode="A">
                        <Segment FlightIndex="1" LegIndex="1"/>
                        <BrandFeatureRef FeatureId="16"/>
                        <BrandFeatureRef FeatureId="18"/>
                        <BrandFeatureRef FeatureId="20"/>
                        <BrandFeatureRef FeatureId="25"/>
                        <BrandFeatureRef FeatureId="40"/>
                        <BrandFeatureRef FeatureId="42"/>
                        <BrandFeatureRef FeatureId="99"/>
                        <BrandFeatureRef FeatureId="95"/>
                        <BrandFeatureRef FeatureId="65"/>
                        <BrandFeatureRef FeatureId="58"/>
                        <BrandFeatureRef FeatureId="60"/>
                        <BrandFeatureRef FeatureId="106"/>
                        <BrandFeatureRef FeatureId="110"/>
                        <BrandFeatureRef FeatureId="121"/>
                        <BrandFeatureRef FeatureId="124"/>
                      </FareComponent>
                      <FareComponent BrandID="PR" BrandName="PROMO" ProgramCode="CFFU6" ProgramDescription="U6 DOMESTIC" ProgramID="83326" ProgramSystemCode="A">
                        <Segment FlightIndex="1" LegIndex="2"/>
                        <BrandFeatureRef FeatureId="16"/>
                        <BrandFeatureRef FeatureId="18"/>
                        <BrandFeatureRef FeatureId="20"/>
                        <BrandFeatureRef FeatureId="25"/>
                        <BrandFeatureRef FeatureId="40"/>
                        <BrandFeatureRef FeatureId="42"/>
                        <BrandFeatureRef FeatureId="99"/>
                        <BrandFeatureRef FeatureId="95"/>
                        <BrandFeatureRef FeatureId="65"/>
                        <BrandFeatureRef FeatureId="58"/>
                        <BrandFeatureRef FeatureId="60"/>
                        <BrandFeatureRef FeatureId="106"/>
                        <BrandFeatureRef FeatureId="110"/>
                        <BrandFeatureRef FeatureId="121"/>
                        <BrandFeatureRef FeatureId="124"/>
                      </FareComponent>
                    </FareComponents>
                    <Messages>
                      <Message AirlineCode="U6" FailCode="0" Info="NONEND" Type="N"/>
                      <Message FailCode="0" Info="EACH INF REQUIRES ACCOMPANYING ADT PASSENGER" Type="W"/>
                      <Message FailCode="0" Info="VALIDATING CARRIER" Type="W"/>
                      <Message FailCode="0" Info="BSP - U6" Type="W"/>
                      <Message FailCode="0" Info="GEN - U6" Type="W"/>
                      <Message FailCode="0" Info="TCH - U6" Type="W"/>
                      <Message FailCode="0" Info="CAT 15 SALES RESTRICTIONS FREE TEXT FOUND - VERIFY RULES" Type="W"/>
                    </Messages>
                    <BaggageInformationList>
                      <BaggageInformation AirlineCode="U6" ProvisionType="A">
                        <Segment Id="0"/>
                        <Allowance Unit="kg" Weight="10"/>
                      </BaggageInformation>
                      <BaggageInformation AirlineCode="U6" ProvisionType="A">
                        <Segment Id="1"/>
                        <Allowance Unit="kg" Weight="10"/>
                      </BaggageInformation>
                    </BaggageInformationList>
                  </TPA_Extensions>
                </PassengerFare>
                <Endorsements NonRefundableIndicator="false"/>
                <TPA_Extensions>
                  <FareCalcLine Info="ZIA U6 AER0U6 ZIA0RUB0END"/>
                </TPA_Extensions>
                <FareInfos>
                  <FareInfo>
                    <FareReference>W</FareReference>
                    <TPA_Extensions>
                      <SeatsRemaining BelowMin="false" Number="9"/>
                      <Cabin Cabin="Y"/>
                      <Meal Code="N"/>
                    </TPA_Extensions>
                  </FareInfo>
                  <FareInfo>
                    <FareReference>W</FareReference>
                    <TPA_Extensions>
                      <SeatsRemaining BelowMin="false" Number="9"/>
                      <Cabin Cabin="Y"/>
                      <Meal Code="N"/>
                    </TPA_Extensions>
                  </FareInfo>
                </FareInfos>
              </PTC_FareBreakdown>
            </PTC_FareBreakdowns>
            <FareInfos>
              <FareInfo>
                <FareReference>W</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="N"/>
                </TPA_Extensions>
              </FareInfo>
              <FareInfo>
                <FareReference>W</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="N"/>
                </TPA_Extensions>
              </FareInfo>
            </FareInfos>
            <TPA_Extensions>
              <DivideInParty Indicator="false"/>
              <AncillaryFeeGroups Message="ADDTL AIR EXTRAS APPLY - REFINE REQUEST">
                <AncillaryFeeGroup Code="BG" Name="BAGGAGE">
                  <AncillaryFeeItem Amount="2500" AncillaryTypeCode="F" BaggageID="1" Carrier="U6" Date="2020-09-01" Description="FIRST EXCESS BAG" Description1="FIRST BAG" DestinationAirport="AER" EndSegment="1" OriginAirport="ZIA" PassengerCode="ALL" StartSegment="1" Subcode="0CC"/>
                  <AncillaryFeeItem Amount="2500" AncillaryTypeCode="F" BaggageID="2" Carrier="U6" Date="2020-09-01" Description="SECOND EXCESS BAG" Description1="SECOND BAG" DestinationAirport="AER" EndSegment="1" OriginAirport="ZIA" PassengerCode="ALL" StartSegment="1" Subcode="0CD"/>
                  <AncillaryFeeItem Amount="2500" AncillaryTypeCode="F" BaggageID="3" Carrier="U6" Date="2020-09-01" Description="THIRD EXCESS BAG" Description1="THIRD BAG" DestinationAirport="AER" EndSegment="1" OriginAirport="ZIA" PassengerCode="ALL" StartSegment="1" Subcode="0CE"/>
                  <AncillaryFeeItem Amount="2000" AncillaryTypeCode="F" BaggageID="4" Carrier="U6" Date="2020-09-01" Description="UPTO22LB 10KG BAGGAGE" Description1="UP TO 22 POUNDS/10 KILOGRAMS" DestinationAirport="AER" EndSegment="1" OriginAirport="ZIA" PassengerCode="ALL" StartSegment="1" Subcode="0CZ"/>
                  <AncillaryFeeItem Amount="2000" AncillaryTypeCode="F" BaggageID="5" Carrier="U6" Date="2020-09-01" Description="EXCESS WEIGHT SPECIAL CHARGE" Description1="EXCESS WEIGHT" Description2="SPECIAL CHARGE" DestinationAirport="AER" EndSegment="1" OriginAirport="ZIA" PassengerCode="ALL" StartSegment="1" Subcode="0H6"/>
                  <AncillaryFeeItem Amount="2500" AncillaryTypeCode="F" BaggageID="6" Carrier="U6" Date="2020-09-01" Description="EXTRA CARRYON BG" Description1="EXCESS SIZE" Description2="SPECIAL CHARGE" DestinationAirport="AER" EndSegment="1" OriginAirport="ZIA" PassengerCode="ALL" StartSegment="1" Subcode="0H7"/>
                  <AncillaryFeeItem Amount="2500" AncillaryTypeCode="F" BaggageID="7" Carrier="U6" Date="2020-09-01" Description="CARRY ON HAND BAGGAGE" DestinationAirport="AER" EndSegment="1" OriginAirport="ZIA" PassengerCode="ALL" StartSegment="1" Subcode="0L5" Subgroup="CY"/>
                  <AncillaryFeeItem Amount="2500" AncillaryTypeCode="F" BaggageID="8" Carrier="U6" Date="2020-09-08" Description="FIRST EXCESS BAG" Description1="FIRST BAG" DestinationAirport="ZIA" EndSegment="2" OriginAirport="AER" PassengerCode="ALL" StartSegment="2" Subcode="0CC"/>
                  <AncillaryFeeItem Amount="2500" AncillaryTypeCode="F" BaggageID="9" Carrier="U6" Date="2020-09-08" Description="SECOND EXCESS BAG" Description1="SECOND BAG" DestinationAirport="ZIA" EndSegment="2" OriginAirport="AER" PassengerCode="ALL" StartSegment="2" Subcode="0CD"/>
                  <AncillaryFeeItem Amount="2500" AncillaryTypeCode="F" BaggageID="10" Carrier="U6" Date="2020-09-08" Description="THIRD EXCESS BAG" Description1="THIRD BAG" DestinationAirport="ZIA" EndSegment="2" OriginAirport="AER" PassengerCode="ALL" StartSegment="2" Subcode="0CE"/>
                  <AncillaryFeeItem Amount="2000" AncillaryTypeCode="F" BaggageID="11" Carrier="U6" Date="2020-09-08" Description="UPTO22LB 10KG BAGGAGE" Description1="UP TO 22 POUNDS/10 KILOGRAMS" DestinationAirport="ZIA" EndSegment="2" OriginAirport="AER" PassengerCode="ALL" StartSegment="2" Subcode="0CZ"/>
                  <AncillaryFeeItem Amount="2000" AncillaryTypeCode="F" BaggageID="12" Carrier="U6" Date="2020-09-08" Description="EXCESS WEIGHT SPECIAL CHARGE" Description1="EXCESS WEIGHT" Description2="SPECIAL CHARGE" DestinationAirport="ZIA" EndSegment="2" OriginAirport="AER" PassengerCode="ALL" StartSegment="2" Subcode="0H6"/>
                  <AncillaryFeeItem Amount="2500" AncillaryTypeCode="F" BaggageID="13" Carrier="U6" Date="2020-09-08" Description="EXTRA CARRYON BG" Description1="EXCESS SIZE" Description2="SPECIAL CHARGE" DestinationAirport="ZIA" EndSegment="2" OriginAirport="AER" PassengerCode="ALL" StartSegment="2" Subcode="0H7"/>
                  <AncillaryFeeItem Amount="2500" AncillaryTypeCode="F" BaggageID="14" Carrier="U6" Date="2020-09-08" Description="CARRY ON HAND BAGGAGE" DestinationAirport="ZIA" EndSegment="2" OriginAirport="AER" PassengerCode="ALL" StartSegment="2" Subcode="0L5" Subgroup="CY"/>
                </AncillaryFeeGroup>
                <OrderStandardBag>
                  <PassengerBags Code="ADT">
                    <BaggageSequenceOrder BaggageID="1" StandardBag="1"/>
                    <BaggageSequenceOrder BaggageID="2" StandardBag="2"/>
                    <BaggageSequenceOrder BaggageID="3" StandardBag="3"/>
                    <BaggageSequenceOrder BaggageID="8" StandardBag="1"/>
                    <BaggageSequenceOrder BaggageID="9" StandardBag="2"/>
                    <BaggageSequenceOrder BaggageID="10" StandardBag="3"/>
                  </PassengerBags>
                  <PassengerBags Code="CNN">
                    <BaggageSequenceOrder BaggageID="1" StandardBag="1"/>
                    <BaggageSequenceOrder BaggageID="2" StandardBag="2"/>
                    <BaggageSequenceOrder BaggageID="3" StandardBag="3"/>
                    <BaggageSequenceOrder BaggageID="8" StandardBag="1"/>
                    <BaggageSequenceOrder BaggageID="9" StandardBag="2"/>
                    <BaggageSequenceOrder BaggageID="10" StandardBag="3"/>
                  </PassengerBags>
                  <PassengerBags Code="INF">
                    <BaggageSequenceOrder BaggageID="1" StandardBag="1"/>
                    <BaggageSequenceOrder BaggageID="2" StandardBag="2"/>
                    <BaggageSequenceOrder BaggageID="3" StandardBag="3"/>
                    <BaggageSequenceOrder BaggageID="8" StandardBag="1"/>
                    <BaggageSequenceOrder BaggageID="9" StandardBag="2"/>
                    <BaggageSequenceOrder BaggageID="10" StandardBag="3"/>
                  </PassengerBags>
                </OrderStandardBag>
              </AncillaryFeeGroups>
              <ValidatingCarrier NewVcxProcess="true" SettlementMethod="BSP">
                <Default Code="U6"/>
              </ValidatingCarrier>
              <ValidatingCarrier NewVcxProcess="true" SettlementMethod="TCH">
                <Default Code="U6"/>
              </ValidatingCarrier>
              <ValidatingCarrier NewVcxProcess="true" SettlementMethod="GEN">
                <Default Code="U6"/>
              </ValidatingCarrier>
            </TPA_Extensions>
          </AirItineraryPricingInfo>
          <TicketingInfo TicketType="eTicket" ValidInterline="Yes"/>
        </AdditionalFares>
        <AdditionalFares>
          <AirItineraryPricingInfo BrandsOnAnyMarket="true" FareReturned="true" FlexibleFareID="4" LastTicketDate="2020-05-13" LastTicketTime="23:59" PricingSource="ADVJR1" PricingSubSource="MIP">
            <ItinTotalFare>
              <BaseFare Amount="5895" CurrencyCode="RUB" DecimalPlaces="0"/>
              <FareConstruction Amount="5895" CurrencyCode="RUB" DecimalPlaces="0"/>
              <EquivFare Amount="5895" CurrencyCode="RUB" DecimalPlaces="0"/>
              <Taxes>
                <Tax Amount="16276" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="TOTALTAX"/>
              </Taxes>
              <TotalFare Amount="22171" CurrencyCode="RUB" DecimalPlaces="0"/>
            </ItinTotalFare>
            <PTC_FareBreakdowns>
              <PTC_FareBreakdown>
                <PassengerTypeQuantity Code="ADT" Quantity="2"/>
                <FareBasisCodes>
                  <FareBasisCode ArrivalAirportCode="AER" AvailabilityBreak="true" BookingCode="W" DepartureAirportCode="ZIA" FareComponentBeginAirport="ZIA" FareComponentDirectionality="FROM" FareComponentEndAirport="AER" FareComponentFareRule="U6EC" FareComponentFareTariff="304" FareComponentFareType="XEX" FareComponentFareTypeBitmap="00" FareComponentVendorCode="ATP" GovCarrier="U6">WECRT</FareBasisCode>
                  <FareBasisCode ArrivalAirportCode="ZIA" AvailabilityBreak="true" BookingCode="W" DepartureAirportCode="AER" FareComponentBeginAirport="AER" FareComponentDirectionality="TO" FareComponentEndAirport="ZIA" FareComponentFareRule="U6EC" FareComponentFareTariff="304" FareComponentFareType="XEX" FareComponentFareTypeBitmap="00" FareComponentVendorCode="ATP" GovCarrier="U6">WECRT</FareBasisCode>
                </FareBasisCodes>
                <PassengerFare>
                  <BaseFare Amount="2280" CurrencyCode="RUB"/>
                  <FareConstruction Amount="2280" CurrencyCode="RUB" DecimalPlaces="0"/>
                  <EquivFare Amount="2280" CurrencyCode="RUB" DecimalPlaces="0"/>
                  <Taxes>
                    <Tax Amount="2150" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                    <Tax Amount="2150" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                    <Tax Amount="400" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRI"/>
                    <Tax Amount="400" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRI"/>
                    <Tax Amount="75" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                    <Tax Amount="120" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                    <Tax Amount="75" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI4"/>
                    <Tax Amount="120" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI4"/>
                    <TaxSummary Amount="4300" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                    <TaxSummary Amount="800" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRI"/>
                    <TaxSummary Amount="390" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                    <TotalTax Amount="5490" CurrencyCode="RUB" DecimalPlaces="0"/>
                  </Taxes>
                  <TotalFare Amount="7770" CurrencyCode="RUB"/>
                  <PenaltiesInfo>
                    <Penalty Amount="0" Applicability="Before" Changeable="true" ConditionsApply="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                    <Penalty Amount="0" Applicability="After" Changeable="true" ConditionsApply="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                    <Penalty Amount="1500" Applicability="Before" CurrencyCode="RUB" DecimalPlaces="0" Refundable="true" Type="Refund"/>
                    <Penalty Amount="3000" Applicability="After" CurrencyCode="RUB" DecimalPlaces="0" Refundable="true" Type="Refund"/>
                  </PenaltiesInfo>
                  <TPA_Extensions>
                    <FareComponents>
                      <FareComponent BrandID="EC" BrandName="ECONOM" ProgramCode="CFFU6" ProgramDescription="U6 DOMESTIC" ProgramID="83326" ProgramSystemCode="A">
                        <Segment FlightIndex="1" LegIndex="1"/>
                        <BrandFeatureRef FeatureId="15"/>
                        <BrandFeatureRef FeatureId="18"/>
                        <BrandFeatureRef FeatureId="22"/>
                        <BrandFeatureRef FeatureId="23"/>
                        <BrandFeatureRef FeatureId="40"/>
                        <BrandFeatureRef FeatureId="42"/>
                        <BrandFeatureRef FeatureId="99"/>
                        <BrandFeatureRef FeatureId="95"/>
                        <BrandFeatureRef FeatureId="66"/>
                        <BrandFeatureRef FeatureId="59"/>
                        <BrandFeatureRef FeatureId="62"/>
                        <BrandFeatureRef FeatureId="106"/>
                        <BrandFeatureRef FeatureId="110"/>
                        <BrandFeatureRef FeatureId="121"/>
                        <BrandFeatureRef FeatureId="124"/>
                      </FareComponent>
                      <FareComponent BrandID="EC" BrandName="ECONOM" ProgramCode="CFFU6" ProgramDescription="U6 DOMESTIC" ProgramID="83326" ProgramSystemCode="A">
                        <Segment FlightIndex="1" LegIndex="2"/>
                        <BrandFeatureRef FeatureId="15"/>
                        <BrandFeatureRef FeatureId="18"/>
                        <BrandFeatureRef FeatureId="22"/>
                        <BrandFeatureRef FeatureId="23"/>
                        <BrandFeatureRef FeatureId="40"/>
                        <BrandFeatureRef FeatureId="42"/>
                        <BrandFeatureRef FeatureId="99"/>
                        <BrandFeatureRef FeatureId="95"/>
                        <BrandFeatureRef FeatureId="66"/>
                        <BrandFeatureRef FeatureId="59"/>
                        <BrandFeatureRef FeatureId="62"/>
                        <BrandFeatureRef FeatureId="106"/>
                        <BrandFeatureRef FeatureId="110"/>
                        <BrandFeatureRef FeatureId="121"/>
                        <BrandFeatureRef FeatureId="124"/>
                      </FareComponent>
                    </FareComponents>
                    <Messages>
                      <Message AirlineCode="U6" FailCode="0" Info="NONEND" Type="N"/>
                      <Message FailCode="0" Info="VALIDATING CARRIER" Type="W"/>
                      <Message FailCode="0" Info="BSP - U6" Type="W"/>
                      <Message FailCode="0" Info="GEN - U6" Type="W"/>
                      <Message FailCode="0" Info="TCH - U6" Type="W"/>
                      <Message FailCode="0" Info="CAT 15 SALES RESTRICTIONS FREE TEXT FOUND - VERIFY RULES" Type="W"/>
                    </Messages>
                    <BaggageInformationList>
                      <BaggageInformation AirlineCode="U6" ProvisionType="A">
                        <Segment Id="0"/>
                        <Allowance Description1="UP TO 50 POUNDS/23 KILOGRAMS" Description2="UP TO 80 LINEAR INCHES/203 LINEAR CENTIMETERS" Pieces="1"/>
                      </BaggageInformation>
                      <BaggageInformation AirlineCode="U6" ProvisionType="A">
                        <Segment Id="1"/>
                        <Allowance Description1="UP TO 50 POUNDS/23 KILOGRAMS" Description2="UP TO 80 LINEAR INCHES/203 LINEAR CENTIMETERS" Pieces="1"/>
                      </BaggageInformation>
                    </BaggageInformationList>
                  </TPA_Extensions>
                </PassengerFare>
                <Endorsements NonRefundableIndicator="false"/>
                <TPA_Extensions>
                  <FareCalcLine Info="ZIA U6 AER1140U6 ZIA1140RUB2280END"/>
                </TPA_Extensions>
                <FareInfos>
                  <FareInfo>
                    <FareReference>W</FareReference>
                    <TPA_Extensions>
                      <SeatsRemaining BelowMin="false" Number="9"/>
                      <Cabin Cabin="Y"/>
                      <Meal Code="N"/>
                    </TPA_Extensions>
                  </FareInfo>
                  <FareInfo>
                    <FareReference>W</FareReference>
                    <TPA_Extensions>
                      <SeatsRemaining BelowMin="false" Number="9"/>
                      <Cabin Cabin="Y"/>
                      <Meal Code="N"/>
                    </TPA_Extensions>
                  </FareInfo>
                </FareInfos>
              </PTC_FareBreakdown>
              <PTC_FareBreakdown>
                <PassengerTypeQuantity Code="CNN" Quantity="1"/>
                <FareBasisCodes>
                  <FareBasisCode ArrivalAirportCode="AER" AvailabilityBreak="true" BookingCode="W" DepartureAirportCode="ZIA" FareComponentBeginAirport="ZIA" FareComponentDirectionality="FROM" FareComponentEndAirport="AER" FareComponentFareRule="U6EC" FareComponentFareTariff="304" FareComponentFareType="XEX" FareComponentFareTypeBitmap="01" FareComponentVendorCode="ATP" GovCarrier="U6">WECRT/CH25</FareBasisCode>
                  <FareBasisCode ArrivalAirportCode="ZIA" AvailabilityBreak="true" BookingCode="W" DepartureAirportCode="AER" FareComponentBeginAirport="AER" FareComponentDirectionality="TO" FareComponentEndAirport="ZIA" FareComponentFareRule="U6PR" FareComponentFareTariff="304" FareComponentFareType="XPN" FareComponentFareTypeBitmap="01" FareComponentVendorCode="ATP" GovCarrier="U6">WPRRT/CH25</FareBasisCode>
                </FareBasisCodes>
                <PassengerFare>
                  <BaseFare Amount="1335" CurrencyCode="RUB"/>
                  <FareConstruction Amount="1335" CurrencyCode="RUB" DecimalPlaces="0"/>
                  <EquivFare Amount="1335" CurrencyCode="RUB" DecimalPlaces="0"/>
                  <Taxes>
                    <Tax Amount="2150" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                    <Tax Amount="2150" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                    <Tax Amount="400" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRI"/>
                    <Tax Amount="400" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRI"/>
                    <Tax Amount="38" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                    <Tax Amount="60" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                    <Tax Amount="38" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI4"/>
                    <Tax Amount="60" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI4"/>
                    <TaxSummary Amount="4300" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                    <TaxSummary Amount="800" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRI"/>
                    <TaxSummary Amount="196" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                    <TotalTax Amount="5296" CurrencyCode="RUB" DecimalPlaces="0"/>
                  </Taxes>
                  <TotalFare Amount="6631" CurrencyCode="RUB"/>
                  <PenaltiesInfo>
                    <Penalty Amount="0" Applicability="Before" Changeable="true" ConditionsApply="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                    <Penalty Amount="3000" Applicability="After" Changeable="true" ConditionsApply="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                    <Penalty Amount="1500" Applicability="Before" CurrencyCode="RUB" DecimalPlaces="0" Refundable="true" Type="Refund"/>
                    <Penalty Amount="1500" Applicability="After" CurrencyCode="RUB" DecimalPlaces="0" Refundable="true" Type="Refund"/>
                  </PenaltiesInfo>
                  <TPA_Extensions>
                    <FareComponents>
                      <FareComponent BrandID="EC" BrandName="ECONOM" ProgramCode="CFFU6" ProgramDescription="U6 DOMESTIC" ProgramID="83326" ProgramSystemCode="A">
                        <Segment FlightIndex="1" LegIndex="1"/>
                        <BrandFeatureRef FeatureId="15"/>
                        <BrandFeatureRef FeatureId="18"/>
                        <BrandFeatureRef FeatureId="22"/>
                        <BrandFeatureRef FeatureId="23"/>
                        <BrandFeatureRef FeatureId="40"/>
                        <BrandFeatureRef FeatureId="42"/>
                        <BrandFeatureRef FeatureId="99"/>
                        <BrandFeatureRef FeatureId="95"/>
                        <BrandFeatureRef FeatureId="66"/>
                        <BrandFeatureRef FeatureId="59"/>
                        <BrandFeatureRef FeatureId="62"/>
                        <BrandFeatureRef FeatureId="106"/>
                        <BrandFeatureRef FeatureId="110"/>
                        <BrandFeatureRef FeatureId="121"/>
                        <BrandFeatureRef FeatureId="124"/>
                      </FareComponent>
                      <FareComponent BrandID="PR" BrandName="PROMO" ProgramCode="CFFU6" ProgramDescription="U6 DOMESTIC" ProgramID="83326" ProgramSystemCode="A">
                        <Segment FlightIndex="1" LegIndex="2"/>
                        <BrandFeatureRef FeatureId="16"/>
                        <BrandFeatureRef FeatureId="18"/>
                        <BrandFeatureRef FeatureId="20"/>
                        <BrandFeatureRef FeatureId="25"/>
                        <BrandFeatureRef FeatureId="40"/>
                        <BrandFeatureRef FeatureId="42"/>
                        <BrandFeatureRef FeatureId="99"/>
                        <BrandFeatureRef FeatureId="95"/>
                        <BrandFeatureRef FeatureId="65"/>
                        <BrandFeatureRef FeatureId="58"/>
                        <BrandFeatureRef FeatureId="60"/>
                        <BrandFeatureRef FeatureId="106"/>
                        <BrandFeatureRef FeatureId="110"/>
                        <BrandFeatureRef FeatureId="121"/>
                        <BrandFeatureRef FeatureId="124"/>
                      </FareComponent>
                    </FareComponents>
                    <Messages>
                      <Message AirlineCode="U6" FailCode="0" Info="NONEND" Type="N"/>
                      <Message FailCode="0" Info="EACH CNN REQUIRES ACCOMPANYING SAME CABIN ADT" Type="W"/>
                      <Message FailCode="0" Info="VALIDATING CARRIER" Type="W"/>
                      <Message FailCode="0" Info="BSP - U6" Type="W"/>
                      <Message FailCode="0" Info="GEN - U6" Type="W"/>
                      <Message FailCode="0" Info="TCH - U6" Type="W"/>
                      <Message FailCode="0" Info="CAT 15 SALES RESTRICTIONS FREE TEXT FOUND - VERIFY RULES" Type="W"/>
                    </Messages>
                    <BaggageInformationList>
                      <BaggageInformation AirlineCode="U6" ProvisionType="A">
                        <Segment Id="0"/>
                        <Allowance Description1="UP TO 50 POUNDS/23 KILOGRAMS" Description2="UP TO 80 LINEAR INCHES/203 LINEAR CENTIMETERS" Pieces="1"/>
                      </BaggageInformation>
                      <BaggageInformation AirlineCode="U6" ProvisionType="A">
                        <Segment Id="1"/>
                        <Allowance Unit="kg" Weight="10"/>
                      </BaggageInformation>
                    </BaggageInformationList>
                  </TPA_Extensions>
                </PassengerFare>
                <Endorsements NonRefundableIndicator="true"/>
                <TPA_Extensions>
                  <FareCalcLine Info="ZIA U6 AER855U6 ZIA480RUB1335END"/>
                </TPA_Extensions>
                <FareInfos>
                  <FareInfo>
                    <FareReference>W</FareReference>
                    <TPA_Extensions>
                      <SeatsRemaining BelowMin="false" Number="9"/>
                      <Cabin Cabin="Y"/>
                      <Meal Code="N"/>
                    </TPA_Extensions>
                  </FareInfo>
                  <FareInfo>
                    <FareReference>W</FareReference>
                    <TPA_Extensions>
                      <SeatsRemaining BelowMin="false" Number="9"/>
                      <Cabin Cabin="Y"/>
                      <Meal Code="N"/>
                    </TPA_Extensions>
                  </FareInfo>
                </FareInfos>
              </PTC_FareBreakdown>
              <PTC_FareBreakdown>
                <PassengerTypeQuantity Code="INF" Quantity="1"/>
                <FareBasisCodes>
                  <FareBasisCode ArrivalAirportCode="AER" AvailabilityBreak="true" BookingCode="W" DepartureAirportCode="ZIA" FareComponentBeginAirport="ZIA" FareComponentDirectionality="FROM" FareComponentEndAirport="AER" FareComponentFareRule="U6EC" FareComponentFareTariff="304" FareComponentFareType="XEX" FareComponentFareTypeBitmap="01" FareComponentVendorCode="ATP" GovCarrier="U6">WECRT/IN</FareBasisCode>
                  <FareBasisCode ArrivalAirportCode="ZIA" AvailabilityBreak="true" BookingCode="W" DepartureAirportCode="AER" FareComponentBeginAirport="AER" FareComponentDirectionality="TO" FareComponentEndAirport="ZIA" FareComponentFareRule="U6EC" FareComponentFareTariff="304" FareComponentFareType="XEX" FareComponentFareTypeBitmap="01" FareComponentVendorCode="ATP" GovCarrier="U6">WECRT/IN</FareBasisCode>
                </FareBasisCodes>
                <PassengerFare>
                  <BaseFare Amount="0" CurrencyCode="RUB"/>
                  <FareConstruction Amount="0" CurrencyCode="RUB" DecimalPlaces="0"/>
                  <EquivFare Amount="0" CurrencyCode="RUB" DecimalPlaces="0"/>
                  <TotalFare Amount="0" CurrencyCode="RUB"/>
                  <PenaltiesInfo>
                    <Penalty Amount="0" Applicability="Before" Changeable="true" ConditionsApply="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                    <Penalty Amount="0" Applicability="After" Changeable="true" ConditionsApply="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                    <Penalty Amount="0" Applicability="Before" CurrencyCode="RUB" DecimalPlaces="0" Refundable="true" Type="Refund"/>
                    <Penalty Amount="0" Applicability="After" CurrencyCode="RUB" DecimalPlaces="0" Refundable="true" Type="Refund"/>
                  </PenaltiesInfo>
                  <TPA_Extensions>
                    <FareComponents>
                      <FareComponent BrandID="EC" BrandName="ECONOM" ProgramCode="CFFU6" ProgramDescription="U6 DOMESTIC" ProgramID="83326" ProgramSystemCode="A">
                        <Segment FlightIndex="1" LegIndex="1"/>
                        <BrandFeatureRef FeatureId="15"/>
                        <BrandFeatureRef FeatureId="18"/>
                        <BrandFeatureRef FeatureId="22"/>
                        <BrandFeatureRef FeatureId="23"/>
                        <BrandFeatureRef FeatureId="40"/>
                        <BrandFeatureRef FeatureId="42"/>
                        <BrandFeatureRef FeatureId="99"/>
                        <BrandFeatureRef FeatureId="95"/>
                        <BrandFeatureRef FeatureId="66"/>
                        <BrandFeatureRef FeatureId="59"/>
                        <BrandFeatureRef FeatureId="62"/>
                        <BrandFeatureRef FeatureId="106"/>
                        <BrandFeatureRef FeatureId="110"/>
                        <BrandFeatureRef FeatureId="121"/>
                        <BrandFeatureRef FeatureId="124"/>
                      </FareComponent>
                      <FareComponent BrandID="EC" BrandName="ECONOM" ProgramCode="CFFU6" ProgramDescription="U6 DOMESTIC" ProgramID="83326" ProgramSystemCode="A">
                        <Segment FlightIndex="1" LegIndex="2"/>
                        <BrandFeatureRef FeatureId="15"/>
                        <BrandFeatureRef FeatureId="18"/>
                        <BrandFeatureRef FeatureId="22"/>
                        <BrandFeatureRef FeatureId="23"/>
                        <BrandFeatureRef FeatureId="40"/>
                        <BrandFeatureRef FeatureId="42"/>
                        <BrandFeatureRef FeatureId="99"/>
                        <BrandFeatureRef FeatureId="95"/>
                        <BrandFeatureRef FeatureId="66"/>
                        <BrandFeatureRef FeatureId="59"/>
                        <BrandFeatureRef FeatureId="62"/>
                        <BrandFeatureRef FeatureId="106"/>
                        <BrandFeatureRef FeatureId="110"/>
                        <BrandFeatureRef FeatureId="121"/>
                        <BrandFeatureRef FeatureId="124"/>
                      </FareComponent>
                    </FareComponents>
                    <Messages>
                      <Message AirlineCode="U6" FailCode="0" Info="NONEND" Type="N"/>
                      <Message FailCode="0" Info="EACH INF REQUIRES ACCOMPANYING ADT PASSENGER" Type="W"/>
                      <Message FailCode="0" Info="VALIDATING CARRIER" Type="W"/>
                      <Message FailCode="0" Info="BSP - U6" Type="W"/>
                      <Message FailCode="0" Info="GEN - U6" Type="W"/>
                      <Message FailCode="0" Info="TCH - U6" Type="W"/>
                      <Message FailCode="0" Info="CAT 15 SALES RESTRICTIONS FREE TEXT FOUND - VERIFY RULES" Type="W"/>
                    </Messages>
                    <BaggageInformationList>
                      <BaggageInformation AirlineCode="U6" ProvisionType="A">
                        <Segment Id="0"/>
                        <Allowance Unit="kg" Weight="10"/>
                      </BaggageInformation>
                      <BaggageInformation AirlineCode="U6" ProvisionType="A">
                        <Segment Id="1"/>
                        <Allowance Unit="kg" Weight="10"/>
                      </BaggageInformation>
                    </BaggageInformationList>
                  </TPA_Extensions>
                </PassengerFare>
                <Endorsements NonRefundableIndicator="false"/>
                <TPA_Extensions>
                  <FareCalcLine Info="ZIA U6 AER0U6 ZIA0RUB0END"/>
                </TPA_Extensions>
                <FareInfos>
                  <FareInfo>
                    <FareReference>W</FareReference>
                    <TPA_Extensions>
                      <SeatsRemaining BelowMin="false" Number="9"/>
                      <Cabin Cabin="Y"/>
                      <Meal Code="N"/>
                    </TPA_Extensions>
                  </FareInfo>
                  <FareInfo>
                    <FareReference>W</FareReference>
                    <TPA_Extensions>
                      <SeatsRemaining BelowMin="false" Number="9"/>
                      <Cabin Cabin="Y"/>
                      <Meal Code="N"/>
                    </TPA_Extensions>
                  </FareInfo>
                </FareInfos>
              </PTC_FareBreakdown>
            </PTC_FareBreakdowns>
            <FareInfos>
              <FareInfo>
                <FareReference>W</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="N"/>
                </TPA_Extensions>
              </FareInfo>
              <FareInfo>
                <FareReference>W</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="N"/>
                </TPA_Extensions>
              </FareInfo>
            </FareInfos>
            <TPA_Extensions>
              <DivideInParty Indicator="false"/>
              <AncillaryFeeGroups Message="ADDTL AIR EXTRAS APPLY - REFINE REQUEST">
                <AncillaryFeeGroup Code="BG" Name="BAGGAGE">
                  <AncillaryFeeItem Amount="2500" AncillaryTypeCode="F" BaggageID="1" Carrier="U6" Date="2020-09-01" Description="FIRST EXCESS BAG" Description1="FIRST BAG" DestinationAirport="AER" EndSegment="1" OriginAirport="ZIA" PassengerCode="ALL" StartSegment="1" Subcode="0CC"/>
                  <AncillaryFeeItem Amount="2500" AncillaryTypeCode="F" BaggageID="2" Carrier="U6" Date="2020-09-01" Description="SECOND EXCESS BAG" Description1="SECOND BAG" DestinationAirport="AER" EndSegment="1" OriginAirport="ZIA" PassengerCode="ALL" StartSegment="1" Subcode="0CD"/>
                  <AncillaryFeeItem Amount="2500" AncillaryTypeCode="F" BaggageID="3" Carrier="U6" Date="2020-09-01" Description="THIRD EXCESS BAG" Description1="THIRD BAG" DestinationAirport="AER" EndSegment="1" OriginAirport="ZIA" PassengerCode="ALL" StartSegment="1" Subcode="0CE"/>
                  <AncillaryFeeItem Amount="2000" AncillaryTypeCode="F" BaggageID="4" Carrier="U6" Date="2020-09-01" Description="UPTO22LB 10KG BAGGAGE" Description1="UP TO 22 POUNDS/10 KILOGRAMS" DestinationAirport="AER" EndSegment="1" OriginAirport="ZIA" PassengerCode="ALL" StartSegment="1" Subcode="0CZ"/>
                  <AncillaryFeeItem Amount="2000" AncillaryTypeCode="F" BaggageID="5" Carrier="U6" Date="2020-09-01" Description="EXCESS WEIGHT SPECIAL CHARGE" Description1="EXCESS WEIGHT" Description2="SPECIAL CHARGE" DestinationAirport="AER" EndSegment="1" OriginAirport="ZIA" PassengerCode="ALL" StartSegment="1" Subcode="0H6"/>
                  <AncillaryFeeItem Amount="2500" AncillaryTypeCode="F" BaggageID="6" Carrier="U6" Date="2020-09-01" Description="EXTRA CARRYON BG" Description1="EXCESS SIZE" Description2="SPECIAL CHARGE" DestinationAirport="AER" EndSegment="1" OriginAirport="ZIA" PassengerCode="ALL" StartSegment="1" Subcode="0H7"/>
                  <AncillaryFeeItem Amount="2500" AncillaryTypeCode="F" BaggageID="7" Carrier="U6" Date="2020-09-01" Description="CARRY ON HAND BAGGAGE" DestinationAirport="AER" EndSegment="1" OriginAirport="ZIA" PassengerCode="ALL" StartSegment="1" Subcode="0L5" Subgroup="CY"/>
                  <AncillaryFeeItem Amount="2500" AncillaryTypeCode="F" BaggageID="8" Carrier="U6" Date="2020-09-08" Description="FIRST EXCESS BAG" Description1="FIRST BAG" DestinationAirport="ZIA" EndSegment="2" OriginAirport="AER" PassengerCode="ALL" StartSegment="2" Subcode="0CC"/>
                  <AncillaryFeeItem Amount="2500" AncillaryTypeCode="F" BaggageID="9" Carrier="U6" Date="2020-09-08" Description="SECOND EXCESS BAG" Description1="SECOND BAG" DestinationAirport="ZIA" EndSegment="2" OriginAirport="AER" PassengerCode="ALL" StartSegment="2" Subcode="0CD"/>
                  <AncillaryFeeItem Amount="2500" AncillaryTypeCode="F" BaggageID="10" Carrier="U6" Date="2020-09-08" Description="THIRD EXCESS BAG" Description1="THIRD BAG" DestinationAirport="ZIA" EndSegment="2" OriginAirport="AER" PassengerCode="ALL" StartSegment="2" Subcode="0CE"/>
                  <AncillaryFeeItem Amount="2000" AncillaryTypeCode="F" BaggageID="11" Carrier="U6" Date="2020-09-08" Description="UPTO22LB 10KG BAGGAGE" Description1="UP TO 22 POUNDS/10 KILOGRAMS" DestinationAirport="ZIA" EndSegment="2" OriginAirport="AER" PassengerCode="ALL" StartSegment="2" Subcode="0CZ"/>
                  <AncillaryFeeItem Amount="2000" AncillaryTypeCode="F" BaggageID="12" Carrier="U6" Date="2020-09-08" Description="EXCESS WEIGHT SPECIAL CHARGE" Description1="EXCESS WEIGHT" Description2="SPECIAL CHARGE" DestinationAirport="ZIA" EndSegment="2" OriginAirport="AER" PassengerCode="ALL" StartSegment="2" Subcode="0H6"/>
                  <AncillaryFeeItem Amount="2500" AncillaryTypeCode="F" BaggageID="13" Carrier="U6" Date="2020-09-08" Description="EXTRA CARRYON BG" Description1="EXCESS SIZE" Description2="SPECIAL CHARGE" DestinationAirport="ZIA" EndSegment="2" OriginAirport="AER" PassengerCode="ALL" StartSegment="2" Subcode="0H7"/>
                  <AncillaryFeeItem Amount="2500" AncillaryTypeCode="F" BaggageID="14" Carrier="U6" Date="2020-09-08" Description="CARRY ON HAND BAGGAGE" DestinationAirport="ZIA" EndSegment="2" OriginAirport="AER" PassengerCode="ALL" StartSegment="2" Subcode="0L5" Subgroup="CY"/>
                </AncillaryFeeGroup>
                <OrderStandardBag>
                  <PassengerBags Code="ADT">
                    <BaggageSequenceOrder BaggageID="1" StandardBag="1"/>
                    <BaggageSequenceOrder BaggageID="2" StandardBag="2"/>
                    <BaggageSequenceOrder BaggageID="3" StandardBag="3"/>
                    <BaggageSequenceOrder BaggageID="8" StandardBag="1"/>
                    <BaggageSequenceOrder BaggageID="9" StandardBag="2"/>
                    <BaggageSequenceOrder BaggageID="10" StandardBag="3"/>
                  </PassengerBags>
                  <PassengerBags Code="CNN">
                    <BaggageSequenceOrder BaggageID="1" StandardBag="1"/>
                    <BaggageSequenceOrder BaggageID="2" StandardBag="2"/>
                    <BaggageSequenceOrder BaggageID="3" StandardBag="3"/>
                    <BaggageSequenceOrder BaggageID="8" StandardBag="1"/>
                    <BaggageSequenceOrder BaggageID="9" StandardBag="2"/>
                    <BaggageSequenceOrder BaggageID="10" StandardBag="3"/>
                  </PassengerBags>
                  <PassengerBags Code="INF">
                    <BaggageSequenceOrder BaggageID="1" StandardBag="1"/>
                    <BaggageSequenceOrder BaggageID="2" StandardBag="2"/>
                    <BaggageSequenceOrder BaggageID="3" StandardBag="3"/>
                    <BaggageSequenceOrder BaggageID="8" StandardBag="1"/>
                    <BaggageSequenceOrder BaggageID="9" StandardBag="2"/>
                    <BaggageSequenceOrder BaggageID="10" StandardBag="3"/>
                  </PassengerBags>
                </OrderStandardBag>
              </AncillaryFeeGroups>
              <ValidatingCarrier NewVcxProcess="true" SettlementMethod="BSP">
                <Default Code="U6"/>
              </ValidatingCarrier>
              <ValidatingCarrier NewVcxProcess="true" SettlementMethod="TCH">
                <Default Code="U6"/>
              </ValidatingCarrier>
              <ValidatingCarrier NewVcxProcess="true" SettlementMethod="GEN">
                <Default Code="U6"/>
              </ValidatingCarrier>
            </TPA_Extensions>
          </AirItineraryPricingInfo>
          <TicketingInfo TicketType="eTicket" ValidInterline="Yes"/>
        </AdditionalFares>
        <ValidatingCarrier Code="U6"/>
        <DiversitySwapper WeighedPriceAmount="14065.6"/>
      </TPA_Extensions>
    </PricedItinerary>
    <!--Другие варианты перелетов-->
  </PricedItineraries>
</OTA_AirLowFareSearchRS>
{% endxmlsec %}

---

{% xmlsec "Пример запроса (получение дополнительных расчетов стоимости по заданным критериям, GIR ответ)", false %}
<OTA_AirLowFareSearchRQ ResponseType="GIR" Version="6.1.0" xmlns="http://www.opentravel.org/OTA/2003/05">
  <POS>
    <Source PseudoCityCode="9LSC">
      <RequestorID ID="1" Type="1">
        <CompanyName Code="TN"/>
      </RequestorID>
    </Source>
  </POS>
  <OriginDestinationInformation RPH="1">
    <DepartureDateTime>2020-09-01T11:00:00</DepartureDateTime>
    <OriginLocation LocationCode="MOW"/>
    <DestinationLocation LocationCode="AER"/>
  </OriginDestinationInformation>
  <OriginDestinationInformation RPH="2">
    <DepartureDateTime>2020-09-08T11:00:00</DepartureDateTime>
    <OriginLocation LocationCode="AER"/>
    <DestinationLocation LocationCode="MOW"/>
  </OriginDestinationInformation>
  <TravelPreferences ValidInterlineTicket="true">
    <CabinPref Cabin="Economy" PreferLevel="Preferred"/>
    <TPA_Extensions>
      <LongConnectTime Enable="true"/>
      <LongConnectPoints Max="3" Min="1"/>
      <KeepSameCabin Enabled="true"/>
      <ExcludeCallDirectCarriers Enabled="true"/>
      <FlexibleFares>
        <FareParameters>
          <Cabin Type="Business"/>
          <KeepSameCabin Enabled="true"/>
        </FareParameters>
        <FareParameters>
          <PassengerTypeQuantity Code="ADT" Quantity="2"/>
          <PassengerTypeQuantity Code="CNN" Quantity="1"/>
          <PassengerTypeQuantity Code="INS" Quantity="1"/>
        </FareParameters>
        <FareParameters>
          <PublicFare Ind="true"/>
        </FareParameters>
        <FareParameters>
          <VoluntaryChanges Match="All">
            <Penalty Type="Refund"/>
          </VoluntaryChanges>
        </FareParameters>
      </FlexibleFares>
      <DiversityParameters AdditionalNonStopsPercentage="100"/>
    </TPA_Extensions>
    <AncillaryFees Enable="true">
      <AncillaryFeeGroup Code="BG"/>
    </AncillaryFees>
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
    <IntelliSellTransaction>
      <RequestType Name="200ITINS"/>
    </IntelliSellTransaction>
  </TPA_Extensions>
</OTA_AirLowFareSearchRQ>
{% endxmlsec %}

{% xmlsec "Пример ответа", false %}
<GroupedItineraryResponse Version="6.1.0" xmlns="http://webservices.sabre.com/wsdl/sabreXML1.0.00/shopping/GroupedItineraryResponse" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <Message Code="TRANSACTIONID" Severity="Info" Text="1669871896716654006" Type="WORKERTHREAD"/>
  <Message Code="ASECT2LAPP00647.IDM.SGDCPROD.SABRE.COM" Severity="Info" Text="27041" Type="SERVER"/>
  <Message Code="RULEID" Severity="Info" Text="15936" Type="DRE"/>
  <Message Code="RULEID" Severity="Info" Text="24467" Type="DEFAULT"/>
  <Message Code="PROCESS" NumberOfOccurences="2" Severity="Error" Text="NO SOLUTION PASSED INTERLINE TICKETING VALIDATION" Type="MIP"/>
  <Message Code="MIP" Severity="Info" Text="NO SOLUTION PASSED INTERLINE TICKETING VALIDATION" Type="MIP"/>
  <Statistics Itineraries="290"/>
  <ScheduleDesc ETicketable="true" ElapsedTime="140" Frequency="SMTW***" ID="1" Stops="0" TotalMilesFlown="847">
    <Departure Airport="AER" City="AER" Country="RU" Time="09:45:00+03:00"/>
    <Arrival Airport="VKO" City="MOW" Country="RU" Time="12:05:00+03:00"/>
    <Carrier Disclosure="DP" Marketing="H1" MarketingFlightNumber="1537" Operating="H1" OperatingFlightNumber="1537">
      <Equipment Code="737" TypeForFirstLeg="N" TypeForLastLeg="N"/>
    </Carrier>
  </ScheduleDesc>
  <ScheduleDesc ETicketable="true" ElapsedTime="135" Frequency="SMTWTFS" ID="2" Stops="0" TotalMilesFlown="847">
    <Departure Airport="AER" City="AER" Country="RU" Time="04:25:00+03:00"/>
    <Arrival Airport="VKO" City="MOW" Country="RU" Time="06:40:00+03:00"/>
    <Carrier Disclosure="DP" Marketing="H1" MarketingFlightNumber="1435" Operating="H1" OperatingFlightNumber="1435">
      <Equipment Code="737" TypeForFirstLeg="N" TypeForLastLeg="N"/>
    </Carrier>
  </ScheduleDesc>
  <ScheduleDesc ETicketable="true" ElapsedTime="150" Frequency="**T*T**" ID="3" Stops="0" TotalMilesFlown="831">
    <Departure Airport="DME" City="MOW" Country="RU" Time="10:20:00+03:00"/>
    <Arrival Airport="AER" City="AER" Country="RU" Time="12:50:00+03:00"/>
    <Carrier Marketing="U6" MarketingFlightNumber="377" Operating="U6" OperatingFlightNumber="377">
      <Equipment Code="320" TypeForFirstLeg="N" TypeForLastLeg="N"/>
    </Carrier>
  </ScheduleDesc>
  <ScheduleDesc ETicketable="true" ElapsedTime="120" Frequency="SMTWTFS" ID="4" Stops="0" TotalMilesFlown="840">
    <Departure Airport="AER" City="AER" Country="RU" Time="16:30:00+03:00"/>
    <Arrival Airport="ZIA" City="MOW" Country="RU" Time="18:30:00+03:00"/>
    <Carrier Marketing="U6" MarketingFlightNumber="1310" Operating="U6" OperatingFlightNumber="1310">
      <Equipment Code="320" TypeForFirstLeg="N" TypeForLastLeg="N"/>
    </Carrier>
  </ScheduleDesc>
  <ScheduleDesc ETicketable="true" ElapsedTime="140" Frequency="SMTWTFS" ID="5" Stops="0" TotalMilesFlown="847">
    <Departure Airport="AER" City="AER" Country="RU" Time="08:00:00+03:00"/>
    <Arrival Airport="VKO" City="MOW" Country="RU" Time="10:20:00+03:00"/>
    <Carrier Disclosure="DP" Marketing="H1" MarketingFlightNumber="1379" Operating="H1" OperatingFlightNumber="1379">
      <Equipment Code="737" TypeForFirstLeg="N" TypeForLastLeg="N"/>
    </Carrier>
  </ScheduleDesc>
  <!--Другие рейсы-->
  <TaxDesc Amount="810" Code="YQF" Currency="RUB" Description="SERVICE FEE - CARRIER-IMPOSED FUEL" ID="1" PublishedAmount="10.00" PublishedCurrency="EUR" Station="DME"/>
  <TaxDesc Amount="270" Code="YRF" Currency="RUB" Description="SERVICE FEE - CARRIER-IMPOSED FUEL" ID="2" PublishedAmount="270" PublishedCurrency="RUB" Station="AER"/>
  <TaxDesc Amount="190" Code="YQI" Currency="RUB" Description="SERVICE FEE - CARRIER-IMPOSED MISC" ID="3" PublishedAmount="190" PublishedCurrency="RUB" Station="SVO"/>
  <TaxDesc Amount="105" Code="RI4" Country="RU" Currency="RUB" Description="TERMINAL USE CHARGE DOMESTIC ARRIVAL" ID="4" PublishedAmount="105" PublishedCurrency="RUB" Station="AER"/>
  <TaxDesc Amount="1500" Code="YQF" Currency="RUB" Description="SERVICE FEE - CARRIER-IMPOSED FUEL" ID="5" PublishedAmount="1500" PublishedCurrency="RUB" Station="SVO"/>
  <!--Другие таксы-->
  <TaxSummaryDesc Amount="450" Code="RI3" Country="RU" Currency="RUB" Description="TERMINAL USE CHARGE DOMESTIC DEPARTURE" ID="1" PublishedAmount="105" PublishedCurrency="RUB" Station="DME"/>
  <TaxSummaryDesc Amount="304" Code="RI3" Country="RU" Currency="RUB" Description="TERMINAL USE CHARGE DOMESTIC DEPARTURE" ID="2" PublishedAmount="92" PublishedCurrency="RUB" Station="SVO"/>
  <TaxSummaryDesc Amount="2960" Code="YQF" Currency="RUB" Description="SERVICE FEE - CARRIER-IMPOSED FUEL" ID="3" PublishedAmount="10.00" PublishedCurrency="EUR" Station="DME"/>
  <TaxSummaryDesc Amount="211" Code="RI3" Country="RU" Currency="RUB" Description="TERMINAL USE CHARGE DOMESTIC DEPARTURE" ID="4" PublishedAmount="38" PublishedCurrency="RUB" Station="ZIA"/>
  <TaxSummaryDesc Amount="226" Code="RI3" Country="RU" Currency="RUB" Description="TERMINAL USE CHARGE DOMESTIC DEPARTURE" ID="5" PublishedAmount="53" PublishedCurrency="RUB" Station="DME"/>
  <!--Другие таксы-->
  <BrandFeatureDesc Application="C" CommercialName="SECOND EXCESS BAG" ID="1" ServiceGroup="BG" ServiceType="C" SubCode="0CD" Vendor="ATP"/>
  <BrandFeatureDesc Application="F" CommercialName="UPTO50LB 23KG AND62LI 158LCM" ID="2" ServiceGroup="BG" ServiceType="C" SubCode="0GO" Vendor="ATP"/>
  <BrandFeatureDesc Application="F" CommercialName="1ST GOLF EQPMT UPTO 20KG" ID="3" ServiceGroup="BG" ServiceType="C" SubCode="0DC" Vendor="ATP"/>
  <BrandFeatureDesc Application="F" CommercialName="CABIN BAG UPTO 10KG 55X40X25CM" ID="4" ServiceGroup="BG" ServiceType="C" SubCode="08A" Vendor="ATP"/>
  <BrandFeatureDesc Application="C" CommercialName="UPGRADE AT CHECKIN TO COMFORT" ID="5" ServiceGroup="BF" ServiceType="Z" SubCode="UT2" Vendor="ATP"/>
  <!--Другие услуги-->
  <FareComponentDesc ApplicablePricingCategories="4 5 10 15 16 18" Direction="EH" Directionality="TO" FareAmount="6335" FareBasisCode="QFLRT" FareCurrency="RUB" FarePassengerType="ADT" FareRule="SFLX" FareTariff="304" FareType="XEX" FareTypeBitmap="00" GoverningCarrier="S7" ID="1" NotValidAfter="2021-06-28" PublishedFareAmount="12670" VendorCode="ATP">
    <Segment/>
    <Brand BrandName="FLEX ECONOMY" Code="YFL" ProgramCode="S7SM" ProgramDescription="SMART CHOICE" ProgramID="84277" ProgramSystemCode="S"/>
  </FareComponentDesc>
  <FareComponentDesc ApplicablePricingCategories="1 4 5 8 10 12 15 16 18 19 23" Direction="EH" Directionality="FROM" FareAmount="480" FareBasisCode="WPRRTCH" FareCurrency="RUB" FarePassengerType="INS" FareRule="U6PR" FareTariff="304" FareType="XPN" FareTypeBitmap="01" GoverningCarrier="U6" ID="2" NotValidAfter="2020-09-01" NotValidBefore="2020-09-01" PublishedFareAmount="960" VendorCode="ATP">
    <Segment Stopover="true"/>
    <Brand BrandName="PROMO" Code="PR" ProgramCode="CFFU6" ProgramDescription="U6 DOMESTIC" ProgramID="83326" ProgramSystemCode="A"/>
  </FareComponentDesc>
  <FareComponentDesc ApplicablePricingCategories="4 5 10 15 16 18 19" Direction="EH" Directionality="FROM" FareAmount="3852" FareBasisCode="QBSRT/CH25" FareCurrency="RUB" FarePassengerType="CNN" FareRule="SBSC" FareTariff="304" FareType="XAT" FareTypeBitmap="01" GoverningCarrier="S7" ID="3" NotValidAfter="2021-06-18" PublishedFareAmount="7705" TicketDesignator="CH25" VendorCode="ATP">
    <Segment Stopover="true"/>
    <Brand BrandName="BASIC ECONOMY" Code="YBS" ProgramCode="S7SM" ProgramDescription="SMART CHOICE" ProgramID="84277" ProgramSystemCode="S"/>
  </FareComponentDesc>
  <FareComponentDesc ApplicablePricingCategories="4 5 10 15 16 18 19" Direction="EH" Directionality="FROM" FareBasisCode="QBSRT/IN00" FarePassengerType="INF" FareRule="SBSC" FareTariff="304" FareType="XAT" FareTypeBitmap="01" GoverningCarrier="S7" ID="4" NotValidAfter="2021-06-18" PublishedFareAmount="0" TicketDesignator="IN00" VendorCode="ATP">
    <Segment Stopover="true"/>
    <Brand BrandName="BASIC ECONOMY" Code="YBS" ProgramCode="S7SM" ProgramDescription="SMART CHOICE" ProgramID="84277" ProgramSystemCode="S"/>
  </FareComponentDesc>
  <FareComponentDesc ApplicablePricingCategories="4 5 10 15 16 18" Direction="EH" Directionality="TO" FareAmount="27500" FareBasisCode="IBSRT" FareCurrency="RUB" FarePassengerType="ADT" FareRule="SBSC" FareTariff="304" FareType="BXN" FareTypeBitmap="00" GoverningCarrier="S7" ID="5" NotValidAfter="2021-08-24" PublishedFareAmount="55000" VendorCode="ATP">
    <Segment/>
    <Brand BrandName="BASIC BUSINESS" Code="CBS" ProgramCode="S7SM" ProgramDescription="SMART CHOICE" ProgramID="84277" ProgramSystemCode="S"/>
  </FareComponentDesc>
  <!--Другие компоненты тарифов-->
  <ValidatingCarrierDesc ID="1" NewVcxProcess="true" SettlementMethod="BSP">
    <Default Code="HR"/>
  </ValidatingCarrierDesc>
  <ValidatingCarrierDesc ID="2" NewVcxProcess="true" SettlementMethod="BSP">
    <Default Code="R3"/>
  </ValidatingCarrierDesc>
  <ValidatingCarrierDesc ID="3" NewVcxProcess="true" SettlementMethod="BSP">
    <Default Code="S7"/>
  </ValidatingCarrierDesc>
  <ValidatingCarrierDesc ID="4" NewVcxProcess="true" SettlementMethod="TCH">
    <Default Code="U6"/>
  </ValidatingCarrierDesc>
  <ValidatingCarrierDesc ID="5" NewVcxProcess="true" SettlementMethod="TCH">
    <Default Code="UT"/>
  </ValidatingCarrierDesc>
  <!--Другие валидирующие перевозчики-->
  <BaggageAllowanceDesc Description1="UP TO 70 POUNDS/32 KILOGRAMS" Description2="UP TO 80 LINEAR INCHES/203 LINEAR CENTIMETERS" ID="1" Pieces="2"/>
  <BaggageAllowanceDesc Description1="UP TO 22 POUNDS/10 KILOGRAMS" Description2="UP TO 45 LINEAR INCHES/115 LINEAR CENTIMETERS" ID="2" Pieces="1"/>
  <BaggageAllowanceDesc Description1="UP TO 22 POUNDS/10 KILOGRAMS" Description2="UP TO 80 LINEAR INCHES/203 LINEAR CENTIMETERS" ID="3" Pieces="1"/>
  <BaggageAllowanceDesc ID="4" Pieces="0"/>
  <BaggageAllowanceDesc ID="5" Pieces="0"/>
  <!--Другие нормы провоза багажа-->
  <LegDesc ElapsedTime="145" ID="1">
    <Schedule Ref="59"/>
  </LegDesc>
  <LegDesc ElapsedTime="135" ID="2">
    <Schedule Ref="60"/>
  </LegDesc>
  <LegDesc ElapsedTime="150" ID="3">
    <Schedule Ref="57"/>
  </LegDesc>
  <LegDesc ElapsedTime="145" ID="4">
    <Schedule Ref="58"/>
  </LegDesc>
  <LegDesc ElapsedTime="140" ID="5">
    <Schedule Ref="54"/>
  </LegDesc>
  <!--Другие плечи-->
  <ItineraryGroup>
    <GroupDescription>
      <LegDescription ArrivalLocation="AER" DepartureDate="2020-09-01" DepartureLocation="DME"/>
      <LegDescription ArrivalLocation="DME" DepartureDate="2020-09-08" DepartureLocation="AER"/>
    </GroupDescription>
    <Itinerary ID="1" PricingSource="ADVJR1">
      <Leg Ref="15"/>
      <Leg Ref="13"/>
      <PricingInformation BrandsOnAnyMarket="true" PricingSubsource="MIP">
        <Fare ETicketable="true" GoverningCarriers="U6 U6" LastTicketDate="2020-05-13" LastTicketTime="23:59" VITA="true" ValidatingCarrierCode="U6">
          <PassengerInfo NonRefundable="true" PassengerNumber="2" PassengerType="ADT">
            <FareComponent Ref="14">
              <Segment AvailabilityBreak="true" BookingCode="W" CabinCode="Y" SeatsAvailable="9"/>
              <BrandFeature Ref="74"/>
              <BrandFeature Ref="131"/>
              <BrandFeature Ref="50"/>
              <BrandFeature Ref="102"/>
              <BrandFeature Ref="62"/>
              <BrandFeature Ref="17"/>
              <BrandFeature Ref="68"/>
              <BrandFeature Ref="9"/>
              <BrandFeature Ref="61"/>
              <BrandFeature Ref="43"/>
              <BrandFeature Ref="85"/>
              <BrandFeature Ref="75"/>
              <BrandFeature Ref="27"/>
              <BrandFeature Ref="99"/>
              <BrandFeature Ref="56"/>
            </FareComponent>
            <FareComponent Ref="235">
              <Segment AvailabilityBreak="true" BookingCode="W" CabinCode="Y" MealCode="N" SeatsAvailable="9"/>
              <BrandFeature Ref="74"/>
              <BrandFeature Ref="131"/>
              <BrandFeature Ref="50"/>
              <BrandFeature Ref="102"/>
              <BrandFeature Ref="62"/>
              <BrandFeature Ref="17"/>
              <BrandFeature Ref="68"/>
              <BrandFeature Ref="9"/>
              <BrandFeature Ref="61"/>
              <BrandFeature Ref="43"/>
              <BrandFeature Ref="85"/>
              <BrandFeature Ref="75"/>
              <BrandFeature Ref="27"/>
              <BrandFeature Ref="99"/>
              <BrandFeature Ref="56"/>
            </FareComponent>
            <Tax Ref="12"/>
            <Tax Ref="8"/>
            <Tax Ref="46"/>
            <Tax Ref="10"/>
            <Tax Ref="31"/>
            <Tax Ref="35"/>
            <Tax Ref="4"/>
            <Tax Ref="13"/>
            <TaxSummary Ref="19"/>
            <TaxSummary Ref="30"/>
            <TaxSummary Ref="1"/>
            <CurrencyConversion ExchangeRateUsed="1" From="RUB" To="RUB"/>
            <FareMessage Carrier="U6" Code="0" Info="NONEND" Type="N"/>
            <FareMessage Code="0" Info="VALIDATING CARRIER" Type="W"/>
            <FareMessage Code="0" Info="BSP - U6" Type="W"/>
            <FareMessage Code="0" Info="GEN - U6" Type="W"/>
            <FareMessage Code="0" Info="TCH - U6" Type="W"/>
            <FareMessage Code="0" Info="CAT 15 SALES RESTRICTIONS FREE TEXT FOUND - VERIFY RULES" Type="W"/>
            <PassengerTotalFare BaseFareAmount="1280" BaseFareCurrency="RUB" CommissionAmount="0" CommissionPercentage="0" ConstructionAmount="1280" ConstructionCurrency="RUB" Currency="RUB" EquivalentAmount="1280" EquivalentCurrency="RUB" ExchangeRateOne="76.8000000" TotalFare="6830" TotalTaxes="5550"/>
            <BaggageInformation AirlineCode="U6" ProvisionType="A">
              <Segment ID="0"/>
              <Allowance Ref="18"/>
            </BaggageInformation>
            <BaggageInformation AirlineCode="U6" ProvisionType="A">
              <Segment ID="1"/>
              <Allowance Ref="18"/>
            </BaggageInformation>
            <PenaltiesInfo>
              <Penalty Amount="0" Applicability="Before" Changeable="true" ConditionsApply="true" Currency="RUB" Type="Exchange"/>
              <Penalty Amount="3000" Applicability="After" Changeable="true" ConditionsApply="true" Currency="RUB" Type="Exchange"/>
              <Penalty Applicability="Before" Refundable="false" Type="Refund"/>
              <Penalty Applicability="After" Refundable="false" Type="Refund"/>
            </PenaltiesInfo>
          </PassengerInfo>
          <PassengerInfo NonRefundable="true" PassengerNumber="1" PassengerType="CNN">
            <FareComponent Ref="257">
              <Segment AvailabilityBreak="true" BookingCode="W" CabinCode="Y" SeatsAvailable="9"/>
              <BrandFeature Ref="74"/>
              <BrandFeature Ref="131"/>
              <BrandFeature Ref="50"/>
              <BrandFeature Ref="102"/>
              <BrandFeature Ref="62"/>
              <BrandFeature Ref="17"/>
              <BrandFeature Ref="68"/>
              <BrandFeature Ref="9"/>
              <BrandFeature Ref="61"/>
              <BrandFeature Ref="43"/>
              <BrandFeature Ref="85"/>
              <BrandFeature Ref="75"/>
              <BrandFeature Ref="27"/>
              <BrandFeature Ref="99"/>
              <BrandFeature Ref="56"/>
            </FareComponent>
            <FareComponent Ref="143">
              <Segment AvailabilityBreak="true" BookingCode="W" CabinCode="Y" MealCode="N" SeatsAvailable="9"/>
              <BrandFeature Ref="74"/>
              <BrandFeature Ref="131"/>
              <BrandFeature Ref="50"/>
              <BrandFeature Ref="102"/>
              <BrandFeature Ref="62"/>
              <BrandFeature Ref="17"/>
              <BrandFeature Ref="68"/>
              <BrandFeature Ref="9"/>
              <BrandFeature Ref="61"/>
              <BrandFeature Ref="43"/>
              <BrandFeature Ref="85"/>
              <BrandFeature Ref="75"/>
              <BrandFeature Ref="27"/>
              <BrandFeature Ref="99"/>
              <BrandFeature Ref="56"/>
            </FareComponent>
            <Tax Ref="12"/>
            <Tax Ref="8"/>
            <Tax Ref="46"/>
            <Tax Ref="10"/>
            <Tax Ref="25"/>
            <Tax Ref="14"/>
            <Tax Ref="32"/>
            <Tax Ref="16"/>
            <TaxSummary Ref="19"/>
            <TaxSummary Ref="30"/>
            <TaxSummary Ref="5"/>
            <CurrencyConversion ExchangeRateUsed="1" From="RUB" To="RUB"/>
            <FareMessage Carrier="U6" Code="0" Info="NONEND" Type="N"/>
            <FareMessage Code="0" Info="EACH CNN REQUIRES ACCOMPANYING SAME CABIN ADT" Type="W"/>
            <FareMessage Code="0" Info="VALIDATING CARRIER" Type="W"/>
            <FareMessage Code="0" Info="BSP - U6" Type="W"/>
            <FareMessage Code="0" Info="GEN - U6" Type="W"/>
            <FareMessage Code="0" Info="TCH - U6" Type="W"/>
            <FareMessage Code="0" Info="CAT 15 SALES RESTRICTIONS FREE TEXT FOUND - VERIFY RULES" Type="W"/>
            <PassengerTotalFare BaseFareAmount="960" BaseFareCurrency="RUB" CommissionAmount="0" CommissionPercentage="0" ConstructionAmount="960" ConstructionCurrency="RUB" Currency="RUB" EquivalentAmount="960" EquivalentCurrency="RUB" ExchangeRateOne="76.8000000" TotalFare="6286" TotalTaxes="5326"/>
            <BaggageInformation AirlineCode="U6" ProvisionType="A">
              <Segment ID="0"/>
              <Allowance Ref="18"/>
            </BaggageInformation>
            <BaggageInformation AirlineCode="U6" ProvisionType="A">
              <Segment ID="1"/>
              <Allowance Ref="18"/>
            </BaggageInformation>
            <PenaltiesInfo>
              <Penalty Amount="0" Applicability="Before" Changeable="true" ConditionsApply="true" Currency="RUB" Type="Exchange"/>
              <Penalty Amount="3000" Applicability="After" Changeable="true" ConditionsApply="true" Currency="RUB" Type="Exchange"/>
              <Penalty Applicability="Before" Refundable="false" Type="Refund"/>
              <Penalty Applicability="After" Refundable="false" Type="Refund"/>
            </PenaltiesInfo>
          </PassengerInfo>
          <PassengerInfo NonRefundable="false" PassengerNumber="1" PassengerType="INF">
            <FareComponent Ref="111">
              <Segment AvailabilityBreak="true" BookingCode="W" CabinCode="Y" SeatsAvailable="9"/>
              <BrandFeature Ref="74"/>
              <BrandFeature Ref="131"/>
              <BrandFeature Ref="50"/>
              <BrandFeature Ref="102"/>
              <BrandFeature Ref="62"/>
              <BrandFeature Ref="17"/>
              <BrandFeature Ref="68"/>
              <BrandFeature Ref="9"/>
              <BrandFeature Ref="61"/>
              <BrandFeature Ref="43"/>
              <BrandFeature Ref="85"/>
              <BrandFeature Ref="75"/>
              <BrandFeature Ref="27"/>
              <BrandFeature Ref="99"/>
              <BrandFeature Ref="56"/>
            </FareComponent>
            <FareComponent Ref="267">
              <Segment AvailabilityBreak="true" BookingCode="W" CabinCode="Y" MealCode="N" SeatsAvailable="9"/>
              <BrandFeature Ref="74"/>
              <BrandFeature Ref="131"/>
              <BrandFeature Ref="50"/>
              <BrandFeature Ref="102"/>
              <BrandFeature Ref="62"/>
              <BrandFeature Ref="17"/>
              <BrandFeature Ref="68"/>
              <BrandFeature Ref="9"/>
              <BrandFeature Ref="61"/>
              <BrandFeature Ref="43"/>
              <BrandFeature Ref="85"/>
              <BrandFeature Ref="75"/>
              <BrandFeature Ref="27"/>
              <BrandFeature Ref="99"/>
              <BrandFeature Ref="56"/>
            </FareComponent>
            <CurrencyConversion ExchangeRateUsed="1" From="RUB" To="RUB"/>
            <FareMessage Carrier="U6" Code="0" Info="NONEND" Type="N"/>
            <FareMessage Code="0" Info="EACH INF REQUIRES ACCOMPANYING ADT PASSENGER" Type="W"/>
            <FareMessage Code="0" Info="VALIDATING CARRIER" Type="W"/>
            <FareMessage Code="0" Info="BSP - U6" Type="W"/>
            <FareMessage Code="0" Info="GEN - U6" Type="W"/>
            <FareMessage Code="0" Info="TCH - U6" Type="W"/>
            <FareMessage Code="0" Info="CAT 15 SALES RESTRICTIONS FREE TEXT FOUND - VERIFY RULES" Type="W"/>
            <PassengerTotalFare BaseFareAmount="0" BaseFareCurrency="RUB" CommissionAmount="0" CommissionPercentage="0" ConstructionAmount="0" ConstructionCurrency="RUB" Currency="RUB" EquivalentAmount="0" EquivalentCurrency="RUB" ExchangeRateOne="76.8000000" TotalFare="0" TotalTaxes="0"/>
            <BaggageInformation AirlineCode="U6" ProvisionType="A">
              <Segment ID="0"/>
              <Allowance Ref="18"/>
            </BaggageInformation>
            <BaggageInformation AirlineCode="U6" ProvisionType="A">
              <Segment ID="1"/>
              <Allowance Ref="18"/>
            </BaggageInformation>
            <PenaltiesInfo>
              <Penalty Amount="0" Applicability="Before" Changeable="true" ConditionsApply="true" Currency="RUB" Type="Exchange"/>
              <Penalty Amount="0" Applicability="After" Changeable="true" ConditionsApply="true" Currency="RUB" Type="Exchange"/>
              <Penalty Applicability="Before" Refundable="false" Type="Refund"/>
              <Penalty Applicability="After" Refundable="false" Type="Refund"/>
            </PenaltiesInfo>
          </PassengerInfo>
          <AncillaryFeeGroup Message="ADDTL AIR EXTRAS APPLY - REFINE REQUEST">
            <AncillaryFee Code="BG" Name="BAGGAGE">
              <Details Amount="2500" AncillaryTypeCode="F" BaggageID="1" Carrier="U6" Code="ALL" DepartureDate="2020-09-01" Description="FIRST EXCESS BAG" Description1="FIRST BAG" Destination="AER" EndSegment="1" Origin="DME" StartSegment="1" Subcode="0CC"/>
              <Details Amount="2500" AncillaryTypeCode="F" BaggageID="2" Carrier="U6" Code="ALL" DepartureDate="2020-09-01" Description="SECOND EXCESS BAG" Description1="SECOND BAG" Destination="AER" EndSegment="1" Origin="DME" StartSegment="1" Subcode="0CD"/>
              <Details Amount="2500" AncillaryTypeCode="F" BaggageID="3" Carrier="U6" Code="ALL" DepartureDate="2020-09-01" Description="THIRD EXCESS BAG" Description1="THIRD BAG" Destination="AER" EndSegment="1" Origin="DME" StartSegment="1" Subcode="0CE"/>
              <Details Amount="2000" AncillaryTypeCode="F" BaggageID="4" Carrier="U6" Code="ALL" DepartureDate="2020-09-01" Description="UPTO22LB 10KG BAGGAGE" Description1="UP TO 22 POUNDS/10 KILOGRAMS" Destination="AER" EndSegment="1" Origin="DME" StartSegment="1" Subcode="0CZ"/>
              <Details Amount="2000" AncillaryTypeCode="F" BaggageID="5" Carrier="U6" Code="ALL" DepartureDate="2020-09-01" Description="EXCESS WEIGHT SPECIAL CHARGE" Description1="EXCESS WEIGHT" Description2="SPECIAL CHARGE" Destination="AER" EndSegment="1" Origin="DME" StartSegment="1" Subcode="0H6"/>
              <Details Amount="2500" AncillaryTypeCode="F" BaggageID="6" Carrier="U6" Code="ALL" DepartureDate="2020-09-01" Description="EXTRA CARRYON BG" Description1="EXCESS SIZE" Description2="SPECIAL CHARGE" Destination="AER" EndSegment="1" Origin="DME" StartSegment="1" Subcode="0H7"/>
              <Details Amount="2500" AncillaryTypeCode="F" BaggageID="7" Carrier="U6" Code="ALL" DepartureDate="2020-09-01" Description="CARRY ON HAND BAGGAGE" Destination="AER" EndSegment="1" Origin="DME" StartSegment="1" Subcode="0L5" Subgroup="CY"/>
              <Details Amount="2500" AncillaryTypeCode="F" BaggageID="8" Carrier="U6" Code="ALL" DepartureDate="2020-09-08" Description="FIRST EXCESS BAG" Description1="FIRST BAG" Destination="DME" EndSegment="2" Origin="AER" StartSegment="2" Subcode="0CC"/>
              <Details Amount="2500" AncillaryTypeCode="F" BaggageID="9" Carrier="U6" Code="ALL" DepartureDate="2020-09-08" Description="SECOND EXCESS BAG" Description1="SECOND BAG" Destination="DME" EndSegment="2" Origin="AER" StartSegment="2" Subcode="0CD"/>
              <Details Amount="2500" AncillaryTypeCode="F" BaggageID="10" Carrier="U6" Code="ALL" DepartureDate="2020-09-08" Description="THIRD EXCESS BAG" Description1="THIRD BAG" Destination="DME" EndSegment="2" Origin="AER" StartSegment="2" Subcode="0CE"/>
              <Details Amount="2000" AncillaryTypeCode="F" BaggageID="11" Carrier="U6" Code="ALL" DepartureDate="2020-09-08" Description="UPTO22LB 10KG BAGGAGE" Description1="UP TO 22 POUNDS/10 KILOGRAMS" Destination="DME" EndSegment="2" Origin="AER" StartSegment="2" Subcode="0CZ"/>
              <Details Amount="2000" AncillaryTypeCode="F" BaggageID="12" Carrier="U6" Code="ALL" DepartureDate="2020-09-08" Description="EXCESS WEIGHT SPECIAL CHARGE" Description1="EXCESS WEIGHT" Description2="SPECIAL CHARGE" Destination="DME" EndSegment="2" Origin="AER" StartSegment="2" Subcode="0H6"/>
              <Details Amount="2500" AncillaryTypeCode="F" BaggageID="13" Carrier="U6" Code="ALL" DepartureDate="2020-09-08" Description="EXTRA CARRYON BG" Description1="EXCESS SIZE" Description2="SPECIAL CHARGE" Destination="DME" EndSegment="2" Origin="AER" StartSegment="2" Subcode="0H7"/>
              <Details Amount="2500" AncillaryTypeCode="F" BaggageID="14" Carrier="U6" Code="ALL" DepartureDate="2020-09-08" Description="CARRY ON HAND BAGGAGE" Destination="DME" EndSegment="2" Origin="AER" StartSegment="2" Subcode="0L5" Subgroup="CY"/>
            </AncillaryFee>
            <OrderStandardBag>
              <PassengerBags Code="ADT">
                <BaggageSequenceOrder BaggageRef="1" StandardBag="1"/>
                <BaggageSequenceOrder BaggageRef="2" StandardBag="2"/>
                <BaggageSequenceOrder BaggageRef="3" StandardBag="3"/>
                <BaggageSequenceOrder BaggageRef="8" StandardBag="1"/>
                <BaggageSequenceOrder BaggageRef="9" StandardBag="2"/>
                <BaggageSequenceOrder BaggageRef="10" StandardBag="3"/>
              </PassengerBags>
              <PassengerBags Code="CNN">
                <BaggageSequenceOrder BaggageRef="1" StandardBag="1"/>
                <BaggageSequenceOrder BaggageRef="2" StandardBag="2"/>
                <BaggageSequenceOrder BaggageRef="3" StandardBag="3"/>
                <BaggageSequenceOrder BaggageRef="8" StandardBag="1"/>
                <BaggageSequenceOrder BaggageRef="9" StandardBag="2"/>
                <BaggageSequenceOrder BaggageRef="10" StandardBag="3"/>
              </PassengerBags>
              <PassengerBags Code="INF">
                <BaggageSequenceOrder BaggageRef="1" StandardBag="1"/>
                <BaggageSequenceOrder BaggageRef="2" StandardBag="2"/>
                <BaggageSequenceOrder BaggageRef="3" StandardBag="3"/>
                <BaggageSequenceOrder BaggageRef="8" StandardBag="1"/>
                <BaggageSequenceOrder BaggageRef="9" StandardBag="2"/>
                <BaggageSequenceOrder BaggageRef="10" StandardBag="3"/>
              </PassengerBags>
            </OrderStandardBag>
          </AncillaryFeeGroup>
          <TotalFare BaseFareAmount="3520" BaseFareCurrency="RUB" ConstructionAmount="3520" ConstructionCurrency="RUB" Currency="RUB" EquivalentAmount="3520" EquivalentCurrency="RUB" TotalPrice="19946" TotalTaxes="16426"/>
          <ValidatingCarrier Ref="12"/>
          <ValidatingCarrier Ref="4"/>
          <ValidatingCarrier Ref="6"/>
        </Fare>
      </PricingInformation>
      <PricingInformation BrandsOnAnyMarket="true" FlexibleFare="2" PricingSubsource="MIP">
        <Fare ETicketable="true" GoverningCarriers="U6 U6" LastTicketDate="2020-05-13" LastTicketTime="23:59" VITA="true" ValidatingCarrierCode="U6">
          <PassengerInfo NonRefundable="true" PassengerNumber="2" PassengerType="ADT">
            <FareComponent Ref="14">
              <Segment AvailabilityBreak="true" BookingCode="W" CabinCode="Y" SeatsAvailable="9"/>
              <BrandFeature Ref="74"/>
              <BrandFeature Ref="131"/>
              <BrandFeature Ref="50"/>
              <BrandFeature Ref="102"/>
              <BrandFeature Ref="62"/>
              <BrandFeature Ref="17"/>
              <BrandFeature Ref="68"/>
              <BrandFeature Ref="9"/>
              <BrandFeature Ref="61"/>
              <BrandFeature Ref="43"/>
              <BrandFeature Ref="85"/>
              <BrandFeature Ref="75"/>
              <BrandFeature Ref="27"/>
              <BrandFeature Ref="99"/>
              <BrandFeature Ref="56"/>
            </FareComponent>
            <FareComponent Ref="235">
              <Segment AvailabilityBreak="true" BookingCode="W" CabinCode="Y" MealCode="N" SeatsAvailable="9"/>
              <BrandFeature Ref="74"/>
              <BrandFeature Ref="131"/>
              <BrandFeature Ref="50"/>
              <BrandFeature Ref="102"/>
              <BrandFeature Ref="62"/>
              <BrandFeature Ref="17"/>
              <BrandFeature Ref="68"/>
              <BrandFeature Ref="9"/>
              <BrandFeature Ref="61"/>
              <BrandFeature Ref="43"/>
              <BrandFeature Ref="85"/>
              <BrandFeature Ref="75"/>
              <BrandFeature Ref="27"/>
              <BrandFeature Ref="99"/>
              <BrandFeature Ref="56"/>
            </FareComponent>
            <Tax Ref="12"/>
            <Tax Ref="8"/>
            <Tax Ref="46"/>
            <Tax Ref="10"/>
            <Tax Ref="31"/>
            <Tax Ref="35"/>
            <Tax Ref="4"/>
            <Tax Ref="13"/>
            <TaxSummary Ref="19"/>
            <TaxSummary Ref="30"/>
            <TaxSummary Ref="1"/>
            <CurrencyConversion ExchangeRateUsed="1" From="RUB" To="RUB"/>
            <FareMessage Carrier="U6" Code="0" Info="NONEND" Type="N"/>
            <FareMessage Code="0" Info="VALIDATING CARRIER" Type="W"/>
            <FareMessage Code="0" Info="BSP - U6" Type="W"/>
            <FareMessage Code="0" Info="GEN - U6" Type="W"/>
            <FareMessage Code="0" Info="TCH - U6" Type="W"/>
            <FareMessage Code="0" Info="CAT 15 SALES RESTRICTIONS FREE TEXT FOUND - VERIFY RULES" Type="W"/>
            <PassengerTotalFare BaseFareAmount="1280" BaseFareCurrency="RUB" CommissionAmount="0" CommissionPercentage="0" ConstructionAmount="1280" ConstructionCurrency="RUB" Currency="RUB" EquivalentAmount="1280" EquivalentCurrency="RUB" ExchangeRateOne="76.8000000" TotalFare="6830" TotalTaxes="5550"/>
            <BaggageInformation AirlineCode="U6" ProvisionType="A">
              <Segment ID="0"/>
              <Allowance Ref="18"/>
            </BaggageInformation>
            <BaggageInformation AirlineCode="U6" ProvisionType="A">
              <Segment ID="1"/>
              <Allowance Ref="18"/>
            </BaggageInformation>
          </PassengerInfo>
          <PassengerInfo NonRefundable="true" PassengerNumber="1" PassengerType="CNN">
            <FareComponent Ref="257">
              <Segment AvailabilityBreak="true" BookingCode="W" CabinCode="Y" SeatsAvailable="9"/>
              <BrandFeature Ref="74"/>
              <BrandFeature Ref="131"/>
              <BrandFeature Ref="50"/>
              <BrandFeature Ref="102"/>
              <BrandFeature Ref="62"/>
              <BrandFeature Ref="17"/>
              <BrandFeature Ref="68"/>
              <BrandFeature Ref="9"/>
              <BrandFeature Ref="61"/>
              <BrandFeature Ref="43"/>
              <BrandFeature Ref="85"/>
              <BrandFeature Ref="75"/>
              <BrandFeature Ref="27"/>
              <BrandFeature Ref="99"/>
              <BrandFeature Ref="56"/>
            </FareComponent>
            <FareComponent Ref="143">
              <Segment AvailabilityBreak="true" BookingCode="W" CabinCode="Y" MealCode="N" SeatsAvailable="9"/>
              <BrandFeature Ref="74"/>
              <BrandFeature Ref="131"/>
              <BrandFeature Ref="50"/>
              <BrandFeature Ref="102"/>
              <BrandFeature Ref="62"/>
              <BrandFeature Ref="17"/>
              <BrandFeature Ref="68"/>
              <BrandFeature Ref="9"/>
              <BrandFeature Ref="61"/>
              <BrandFeature Ref="43"/>
              <BrandFeature Ref="85"/>
              <BrandFeature Ref="75"/>
              <BrandFeature Ref="27"/>
              <BrandFeature Ref="99"/>
              <BrandFeature Ref="56"/>
            </FareComponent>
            <Tax Ref="12"/>
            <Tax Ref="8"/>
            <Tax Ref="46"/>
            <Tax Ref="10"/>
            <Tax Ref="25"/>
            <Tax Ref="14"/>
            <Tax Ref="32"/>
            <Tax Ref="16"/>
            <TaxSummary Ref="19"/>
            <TaxSummary Ref="30"/>
            <TaxSummary Ref="5"/>
            <CurrencyConversion ExchangeRateUsed="1" From="RUB" To="RUB"/>
            <FareMessage Carrier="U6" Code="0" Info="NONEND" Type="N"/>
            <FareMessage Code="0" Info="EACH CNN REQUIRES ACCOMPANYING SAME CABIN ADT" Type="W"/>
            <FareMessage Code="0" Info="VALIDATING CARRIER" Type="W"/>
            <FareMessage Code="0" Info="BSP - U6" Type="W"/>
            <FareMessage Code="0" Info="GEN - U6" Type="W"/>
            <FareMessage Code="0" Info="TCH - U6" Type="W"/>
            <FareMessage Code="0" Info="CAT 15 SALES RESTRICTIONS FREE TEXT FOUND - VERIFY RULES" Type="W"/>
            <PassengerTotalFare BaseFareAmount="960" BaseFareCurrency="RUB" CommissionAmount="0" CommissionPercentage="0" ConstructionAmount="960" ConstructionCurrency="RUB" Currency="RUB" EquivalentAmount="960" EquivalentCurrency="RUB" ExchangeRateOne="76.8000000" TotalFare="6286" TotalTaxes="5326"/>
            <BaggageInformation AirlineCode="U6" ProvisionType="A">
              <Segment ID="0"/>
              <Allowance Ref="18"/>
            </BaggageInformation>
            <BaggageInformation AirlineCode="U6" ProvisionType="A">
              <Segment ID="1"/>
              <Allowance Ref="18"/>
            </BaggageInformation>
          </PassengerInfo>
          <PassengerInfo NonRefundable="true" PassengerNumber="1" PassengerType="INS">
            <FareComponent Ref="2">
              <Segment AvailabilityBreak="true" BookingCode="W" CabinCode="Y" SeatsAvailable="9"/>
              <BrandFeature Ref="74"/>
              <BrandFeature Ref="131"/>
              <BrandFeature Ref="50"/>
              <BrandFeature Ref="102"/>
              <BrandFeature Ref="62"/>
              <BrandFeature Ref="17"/>
              <BrandFeature Ref="68"/>
              <BrandFeature Ref="9"/>
              <BrandFeature Ref="61"/>
              <BrandFeature Ref="43"/>
              <BrandFeature Ref="85"/>
              <BrandFeature Ref="75"/>
              <BrandFeature Ref="27"/>
              <BrandFeature Ref="99"/>
              <BrandFeature Ref="56"/>
            </FareComponent>
            <FareComponent Ref="28">
              <Segment AvailabilityBreak="true" BookingCode="W" CabinCode="Y" MealCode="N" SeatsAvailable="9"/>
              <BrandFeature Ref="74"/>
              <BrandFeature Ref="131"/>
              <BrandFeature Ref="50"/>
              <BrandFeature Ref="102"/>
              <BrandFeature Ref="62"/>
              <BrandFeature Ref="17"/>
              <BrandFeature Ref="68"/>
              <BrandFeature Ref="9"/>
              <BrandFeature Ref="61"/>
              <BrandFeature Ref="43"/>
              <BrandFeature Ref="85"/>
              <BrandFeature Ref="75"/>
              <BrandFeature Ref="27"/>
              <BrandFeature Ref="99"/>
              <BrandFeature Ref="56"/>
            </FareComponent>
            <Tax Ref="12"/>
            <Tax Ref="8"/>
            <Tax Ref="46"/>
            <Tax Ref="10"/>
            <TaxSummary Ref="19"/>
            <TaxSummary Ref="30"/>
            <CurrencyConversion ExchangeRateUsed="1" From="RUB" To="RUB"/>
            <FareMessage Carrier="U6" Code="0" Info="NONEND" Type="N"/>
            <FareMessage Code="0" Info="EACH INF REQUIRES ACCOMPANYING ADT PASSENGER" Type="W"/>
            <FareMessage Code="0" Info="VALIDATING CARRIER" Type="W"/>
            <FareMessage Code="0" Info="BSP - U6" Type="W"/>
            <FareMessage Code="0" Info="GEN - U6" Type="W"/>
            <FareMessage Code="0" Info="TCH - U6" Type="W"/>
            <FareMessage Code="0" Info="CAT 15 SALES RESTRICTIONS FREE TEXT FOUND - VERIFY RULES" Type="W"/>
            <PassengerTotalFare BaseFareAmount="960" BaseFareCurrency="RUB" CommissionAmount="0" CommissionPercentage="0" ConstructionAmount="960" ConstructionCurrency="RUB" Currency="RUB" EquivalentAmount="960" EquivalentCurrency="RUB" ExchangeRateOne="76.8000000" TotalFare="6060" TotalTaxes="5100"/>
            <BaggageInformation AirlineCode="U6" ProvisionType="A">
              <Segment ID="0"/>
              <Allowance Ref="18"/>
            </BaggageInformation>
            <BaggageInformation AirlineCode="U6" ProvisionType="A">
              <Segment ID="1"/>
              <Allowance Ref="18"/>
            </BaggageInformation>
          </PassengerInfo>
          <AncillaryFeeGroup>
            <AncillaryFee Code="BG" Name="BAGGAGE">
              <Details Amount="2500" AncillaryTypeCode="F" BaggageID="1" Carrier="U6" Code="ALL" DepartureDate="2020-09-01" Description="FIRST EXCESS BAG" Description1="FIRST BAG" Destination="AER" EndSegment="1" Origin="DME" StartSegment="1" Subcode="0CC"/>
              <Details Amount="2500" AncillaryTypeCode="F" BaggageID="2" Carrier="U6" Code="ALL" DepartureDate="2020-09-01" Description="SECOND EXCESS BAG" Description1="SECOND BAG" Destination="AER" EndSegment="1" Origin="DME" StartSegment="1" Subcode="0CD"/>
              <Details Amount="2500" AncillaryTypeCode="F" BaggageID="3" Carrier="U6" Code="ALL" DepartureDate="2020-09-01" Description="THIRD EXCESS BAG" Description1="THIRD BAG" Destination="AER" EndSegment="1" Origin="DME" StartSegment="1" Subcode="0CE"/>
              <Details Amount="2000" AncillaryTypeCode="F" BaggageID="4" Carrier="U6" Code="ALL" DepartureDate="2020-09-01" Description="UPTO22LB 10KG BAGGAGE" Description1="UP TO 22 POUNDS/10 KILOGRAMS" Destination="AER" EndSegment="1" Origin="DME" StartSegment="1" Subcode="0CZ"/>
              <Details Amount="2000" AncillaryTypeCode="F" BaggageID="5" Carrier="U6" Code="ALL" DepartureDate="2020-09-01" Description="EXCESS WEIGHT SPECIAL CHARGE" Description1="EXCESS WEIGHT" Description2="SPECIAL CHARGE" Destination="AER" EndSegment="1" Origin="DME" StartSegment="1" Subcode="0H6"/>
              <Details Amount="2500" AncillaryTypeCode="F" BaggageID="6" Carrier="U6" Code="ALL" DepartureDate="2020-09-01" Description="EXTRA CARRYON BG" Description1="EXCESS SIZE" Description2="SPECIAL CHARGE" Destination="AER" EndSegment="1" Origin="DME" StartSegment="1" Subcode="0H7"/>
              <Details Amount="2500" AncillaryTypeCode="F" BaggageID="7" Carrier="U6" Code="ALL" DepartureDate="2020-09-01" Description="CARRY ON HAND BAGGAGE" Destination="AER" EndSegment="1" Origin="DME" StartSegment="1" Subcode="0L5" Subgroup="CY"/>
              <Details Amount="2500" AncillaryTypeCode="F" BaggageID="8" Carrier="U6" Code="ALL" DepartureDate="2020-09-08" Description="FIRST EXCESS BAG" Description1="FIRST BAG" Destination="DME" EndSegment="2" Origin="AER" StartSegment="2" Subcode="0CC"/>
              <Details Amount="2500" AncillaryTypeCode="F" BaggageID="9" Carrier="U6" Code="ALL" DepartureDate="2020-09-08" Description="SECOND EXCESS BAG" Description1="SECOND BAG" Destination="DME" EndSegment="2" Origin="AER" StartSegment="2" Subcode="0CD"/>
              <Details Amount="2500" AncillaryTypeCode="F" BaggageID="10" Carrier="U6" Code="ALL" DepartureDate="2020-09-08" Description="THIRD EXCESS BAG" Description1="THIRD BAG" Destination="DME" EndSegment="2" Origin="AER" StartSegment="2" Subcode="0CE"/>
              <Details Amount="2000" AncillaryTypeCode="F" BaggageID="11" Carrier="U6" Code="ALL" DepartureDate="2020-09-08" Description="UPTO22LB 10KG BAGGAGE" Description1="UP TO 22 POUNDS/10 KILOGRAMS" Destination="DME" EndSegment="2" Origin="AER" StartSegment="2" Subcode="0CZ"/>
              <Details Amount="2000" AncillaryTypeCode="F" BaggageID="12" Carrier="U6" Code="ALL" DepartureDate="2020-09-08" Description="EXCESS WEIGHT SPECIAL CHARGE" Description1="EXCESS WEIGHT" Description2="SPECIAL CHARGE" Destination="DME" EndSegment="2" Origin="AER" StartSegment="2" Subcode="0H6"/>
              <Details Amount="2500" AncillaryTypeCode="F" BaggageID="13" Carrier="U6" Code="ALL" DepartureDate="2020-09-08" Description="EXTRA CARRYON BG" Description1="EXCESS SIZE" Description2="SPECIAL CHARGE" Destination="DME" EndSegment="2" Origin="AER" StartSegment="2" Subcode="0H7"/>
              <Details Amount="2500" AncillaryTypeCode="F" BaggageID="14" Carrier="U6" Code="ALL" DepartureDate="2020-09-08" Description="CARRY ON HAND BAGGAGE" Destination="DME" EndSegment="2" Origin="AER" StartSegment="2" Subcode="0L5" Subgroup="CY"/>
            </AncillaryFee>
            <OrderStandardBag>
              <PassengerBags Code="ADT">
                <BaggageSequenceOrder BaggageRef="1" StandardBag="1"/>
                <BaggageSequenceOrder BaggageRef="2" StandardBag="2"/>
                <BaggageSequenceOrder BaggageRef="3" StandardBag="3"/>
                <BaggageSequenceOrder BaggageRef="8" StandardBag="1"/>
                <BaggageSequenceOrder BaggageRef="9" StandardBag="2"/>
                <BaggageSequenceOrder BaggageRef="10" StandardBag="3"/>
              </PassengerBags>
              <PassengerBags Code="CNN">
                <BaggageSequenceOrder BaggageRef="1" StandardBag="1"/>
                <BaggageSequenceOrder BaggageRef="2" StandardBag="2"/>
                <BaggageSequenceOrder BaggageRef="3" StandardBag="3"/>
                <BaggageSequenceOrder BaggageRef="8" StandardBag="1"/>
                <BaggageSequenceOrder BaggageRef="9" StandardBag="2"/>
                <BaggageSequenceOrder BaggageRef="10" StandardBag="3"/>
              </PassengerBags>
              <PassengerBags Code="INS">
                <BaggageSequenceOrder BaggageRef="1" StandardBag="1"/>
                <BaggageSequenceOrder BaggageRef="2" StandardBag="2"/>
                <BaggageSequenceOrder BaggageRef="3" StandardBag="3"/>
                <BaggageSequenceOrder BaggageRef="8" StandardBag="1"/>
                <BaggageSequenceOrder BaggageRef="9" StandardBag="2"/>
                <BaggageSequenceOrder BaggageRef="10" StandardBag="3"/>
              </PassengerBags>
            </OrderStandardBag>
          </AncillaryFeeGroup>
          <TotalFare BaseFareAmount="4480" BaseFareCurrency="RUB" ConstructionAmount="4480" ConstructionCurrency="RUB" Currency="RUB" EquivalentAmount="4480" EquivalentCurrency="RUB" TotalPrice="26006" TotalTaxes="21526"/>
          <ValidatingCarrier Ref="12"/>
          <ValidatingCarrier Ref="4"/>
          <ValidatingCarrier Ref="6"/>
        </Fare>
      </PricingInformation>
      <PricingInformation BrandsOnAnyMarket="true" FlexibleFare="3" PricingSubsource="MIP">
        <Fare ETicketable="true" GoverningCarriers="U6 U6" LastTicketDate="2020-05-13" LastTicketTime="23:59" VITA="true" ValidatingCarrierCode="U6">
          <PassengerInfo NonRefundable="true" PassengerNumber="2" PassengerType="ADT">
            <FareComponent Ref="14">
              <Segment AvailabilityBreak="true" BookingCode="W" CabinCode="Y" SeatsAvailable="9"/>
              <BrandFeature Ref="74"/>
              <BrandFeature Ref="131"/>
              <BrandFeature Ref="50"/>
              <BrandFeature Ref="102"/>
              <BrandFeature Ref="62"/>
              <BrandFeature Ref="17"/>
              <BrandFeature Ref="68"/>
              <BrandFeature Ref="9"/>
              <BrandFeature Ref="61"/>
              <BrandFeature Ref="43"/>
              <BrandFeature Ref="85"/>
              <BrandFeature Ref="75"/>
              <BrandFeature Ref="27"/>
              <BrandFeature Ref="99"/>
              <BrandFeature Ref="56"/>
            </FareComponent>
            <FareComponent Ref="235">
              <Segment AvailabilityBreak="true" BookingCode="W" CabinCode="Y" MealCode="N" SeatsAvailable="9"/>
              <BrandFeature Ref="74"/>
              <BrandFeature Ref="131"/>
              <BrandFeature Ref="50"/>
              <BrandFeature Ref="102"/>
              <BrandFeature Ref="62"/>
              <BrandFeature Ref="17"/>
              <BrandFeature Ref="68"/>
              <BrandFeature Ref="9"/>
              <BrandFeature Ref="61"/>
              <BrandFeature Ref="43"/>
              <BrandFeature Ref="85"/>
              <BrandFeature Ref="75"/>
              <BrandFeature Ref="27"/>
              <BrandFeature Ref="99"/>
              <BrandFeature Ref="56"/>
            </FareComponent>
            <Tax Ref="12"/>
            <Tax Ref="8"/>
            <Tax Ref="46"/>
            <Tax Ref="10"/>
            <Tax Ref="31"/>
            <Tax Ref="35"/>
            <Tax Ref="4"/>
            <Tax Ref="13"/>
            <TaxSummary Ref="19"/>
            <TaxSummary Ref="30"/>
            <TaxSummary Ref="1"/>
            <CurrencyConversion ExchangeRateUsed="1" From="RUB" To="RUB"/>
            <FareMessage Carrier="U6" Code="0" Info="NONEND" Type="N"/>
            <FareMessage Code="0" Info="VALIDATING CARRIER" Type="W"/>
            <FareMessage Code="0" Info="BSP - U6" Type="W"/>
            <FareMessage Code="0" Info="GEN - U6" Type="W"/>
            <FareMessage Code="0" Info="TCH - U6" Type="W"/>
            <FareMessage Code="0" Info="CAT 15 SALES RESTRICTIONS FREE TEXT FOUND - VERIFY RULES" Type="W"/>
            <PassengerTotalFare BaseFareAmount="1280" BaseFareCurrency="RUB" CommissionAmount="0" CommissionPercentage="0" ConstructionAmount="1280" ConstructionCurrency="RUB" Currency="RUB" EquivalentAmount="1280" EquivalentCurrency="RUB" ExchangeRateOne="76.8000000" TotalFare="6830" TotalTaxes="5550"/>
            <BaggageInformation AirlineCode="U6" ProvisionType="A">
              <Segment ID="0"/>
              <Allowance Ref="18"/>
            </BaggageInformation>
            <BaggageInformation AirlineCode="U6" ProvisionType="A">
              <Segment ID="1"/>
              <Allowance Ref="18"/>
            </BaggageInformation>
          </PassengerInfo>
          <PassengerInfo NonRefundable="true" PassengerNumber="1" PassengerType="CNN">
            <FareComponent Ref="257">
              <Segment AvailabilityBreak="true" BookingCode="W" CabinCode="Y" SeatsAvailable="9"/>
              <BrandFeature Ref="74"/>
              <BrandFeature Ref="131"/>
              <BrandFeature Ref="50"/>
              <BrandFeature Ref="102"/>
              <BrandFeature Ref="62"/>
              <BrandFeature Ref="17"/>
              <BrandFeature Ref="68"/>
              <BrandFeature Ref="9"/>
              <BrandFeature Ref="61"/>
              <BrandFeature Ref="43"/>
              <BrandFeature Ref="85"/>
              <BrandFeature Ref="75"/>
              <BrandFeature Ref="27"/>
              <BrandFeature Ref="99"/>
              <BrandFeature Ref="56"/>
            </FareComponent>
            <FareComponent Ref="143">
              <Segment AvailabilityBreak="true" BookingCode="W" CabinCode="Y" MealCode="N" SeatsAvailable="9"/>
              <BrandFeature Ref="74"/>
              <BrandFeature Ref="131"/>
              <BrandFeature Ref="50"/>
              <BrandFeature Ref="102"/>
              <BrandFeature Ref="62"/>
              <BrandFeature Ref="17"/>
              <BrandFeature Ref="68"/>
              <BrandFeature Ref="9"/>
              <BrandFeature Ref="61"/>
              <BrandFeature Ref="43"/>
              <BrandFeature Ref="85"/>
              <BrandFeature Ref="75"/>
              <BrandFeature Ref="27"/>
              <BrandFeature Ref="99"/>
              <BrandFeature Ref="56"/>
            </FareComponent>
            <Tax Ref="12"/>
            <Tax Ref="8"/>
            <Tax Ref="46"/>
            <Tax Ref="10"/>
            <Tax Ref="25"/>
            <Tax Ref="14"/>
            <Tax Ref="32"/>
            <Tax Ref="16"/>
            <TaxSummary Ref="19"/>
            <TaxSummary Ref="30"/>
            <TaxSummary Ref="5"/>
            <CurrencyConversion ExchangeRateUsed="1" From="RUB" To="RUB"/>
            <FareMessage Carrier="U6" Code="0" Info="NONEND" Type="N"/>
            <FareMessage Code="0" Info="EACH CNN REQUIRES ACCOMPANYING SAME CABIN ADT" Type="W"/>
            <FareMessage Code="0" Info="VALIDATING CARRIER" Type="W"/>
            <FareMessage Code="0" Info="BSP - U6" Type="W"/>
            <FareMessage Code="0" Info="GEN - U6" Type="W"/>
            <FareMessage Code="0" Info="TCH - U6" Type="W"/>
            <FareMessage Code="0" Info="CAT 15 SALES RESTRICTIONS FREE TEXT FOUND - VERIFY RULES" Type="W"/>
            <PassengerTotalFare BaseFareAmount="960" BaseFareCurrency="RUB" CommissionAmount="0" CommissionPercentage="0" ConstructionAmount="960" ConstructionCurrency="RUB" Currency="RUB" EquivalentAmount="960" EquivalentCurrency="RUB" ExchangeRateOne="76.8000000" TotalFare="6286" TotalTaxes="5326"/>
            <BaggageInformation AirlineCode="U6" ProvisionType="A">
              <Segment ID="0"/>
              <Allowance Ref="18"/>
            </BaggageInformation>
            <BaggageInformation AirlineCode="U6" ProvisionType="A">
              <Segment ID="1"/>
              <Allowance Ref="18"/>
            </BaggageInformation>
          </PassengerInfo>
          <PassengerInfo NonRefundable="false" PassengerNumber="1" PassengerType="INF">
            <FareComponent Ref="111">
              <Segment AvailabilityBreak="true" BookingCode="W" CabinCode="Y" SeatsAvailable="9"/>
              <BrandFeature Ref="74"/>
              <BrandFeature Ref="131"/>
              <BrandFeature Ref="50"/>
              <BrandFeature Ref="102"/>
              <BrandFeature Ref="62"/>
              <BrandFeature Ref="17"/>
              <BrandFeature Ref="68"/>
              <BrandFeature Ref="9"/>
              <BrandFeature Ref="61"/>
              <BrandFeature Ref="43"/>
              <BrandFeature Ref="85"/>
              <BrandFeature Ref="75"/>
              <BrandFeature Ref="27"/>
              <BrandFeature Ref="99"/>
              <BrandFeature Ref="56"/>
            </FareComponent>
            <FareComponent Ref="267">
              <Segment AvailabilityBreak="true" BookingCode="W" CabinCode="Y" MealCode="N" SeatsAvailable="9"/>
              <BrandFeature Ref="74"/>
              <BrandFeature Ref="131"/>
              <BrandFeature Ref="50"/>
              <BrandFeature Ref="102"/>
              <BrandFeature Ref="62"/>
              <BrandFeature Ref="17"/>
              <BrandFeature Ref="68"/>
              <BrandFeature Ref="9"/>
              <BrandFeature Ref="61"/>
              <BrandFeature Ref="43"/>
              <BrandFeature Ref="85"/>
              <BrandFeature Ref="75"/>
              <BrandFeature Ref="27"/>
              <BrandFeature Ref="99"/>
              <BrandFeature Ref="56"/>
            </FareComponent>
            <CurrencyConversion ExchangeRateUsed="1" From="RUB" To="RUB"/>
            <FareMessage Carrier="U6" Code="0" Info="NONEND" Type="N"/>
            <FareMessage Code="0" Info="EACH INF REQUIRES ACCOMPANYING ADT PASSENGER" Type="W"/>
            <FareMessage Code="0" Info="VALIDATING CARRIER" Type="W"/>
            <FareMessage Code="0" Info="BSP - U6" Type="W"/>
            <FareMessage Code="0" Info="GEN - U6" Type="W"/>
            <FareMessage Code="0" Info="TCH - U6" Type="W"/>
            <FareMessage Code="0" Info="CAT 15 SALES RESTRICTIONS FREE TEXT FOUND - VERIFY RULES" Type="W"/>
            <PassengerTotalFare BaseFareAmount="0" BaseFareCurrency="RUB" CommissionAmount="0" CommissionPercentage="0" ConstructionAmount="0" ConstructionCurrency="RUB" Currency="RUB" EquivalentAmount="0" EquivalentCurrency="RUB" ExchangeRateOne="76.8000000" TotalFare="0" TotalTaxes="0"/>
            <BaggageInformation AirlineCode="U6" ProvisionType="A">
              <Segment ID="0"/>
              <Allowance Ref="18"/>
            </BaggageInformation>
            <BaggageInformation AirlineCode="U6" ProvisionType="A">
              <Segment ID="1"/>
              <Allowance Ref="18"/>
            </BaggageInformation>
          </PassengerInfo>
          <AncillaryFeeGroup Message="ADDTL AIR EXTRAS APPLY - REFINE REQUEST">
            <AncillaryFee Code="BG" Name="BAGGAGE">
              <Details Amount="2500" AncillaryTypeCode="F" BaggageID="1" Carrier="U6" Code="ALL" DepartureDate="2020-09-01" Description="FIRST EXCESS BAG" Description1="FIRST BAG" Destination="AER" EndSegment="1" Origin="DME" StartSegment="1" Subcode="0CC"/>
              <Details Amount="2500" AncillaryTypeCode="F" BaggageID="2" Carrier="U6" Code="ALL" DepartureDate="2020-09-01" Description="SECOND EXCESS BAG" Description1="SECOND BAG" Destination="AER" EndSegment="1" Origin="DME" StartSegment="1" Subcode="0CD"/>
              <Details Amount="2500" AncillaryTypeCode="F" BaggageID="3" Carrier="U6" Code="ALL" DepartureDate="2020-09-01" Description="THIRD EXCESS BAG" Description1="THIRD BAG" Destination="AER" EndSegment="1" Origin="DME" StartSegment="1" Subcode="0CE"/>
              <Details Amount="2000" AncillaryTypeCode="F" BaggageID="4" Carrier="U6" Code="ALL" DepartureDate="2020-09-01" Description="UPTO22LB 10KG BAGGAGE" Description1="UP TO 22 POUNDS/10 KILOGRAMS" Destination="AER" EndSegment="1" Origin="DME" StartSegment="1" Subcode="0CZ"/>
              <Details Amount="2000" AncillaryTypeCode="F" BaggageID="5" Carrier="U6" Code="ALL" DepartureDate="2020-09-01" Description="EXCESS WEIGHT SPECIAL CHARGE" Description1="EXCESS WEIGHT" Description2="SPECIAL CHARGE" Destination="AER" EndSegment="1" Origin="DME" StartSegment="1" Subcode="0H6"/>
              <Details Amount="2500" AncillaryTypeCode="F" BaggageID="6" Carrier="U6" Code="ALL" DepartureDate="2020-09-01" Description="EXTRA CARRYON BG" Description1="EXCESS SIZE" Description2="SPECIAL CHARGE" Destination="AER" EndSegment="1" Origin="DME" StartSegment="1" Subcode="0H7"/>
              <Details Amount="2500" AncillaryTypeCode="F" BaggageID="7" Carrier="U6" Code="ALL" DepartureDate="2020-09-01" Description="CARRY ON HAND BAGGAGE" Destination="AER" EndSegment="1" Origin="DME" StartSegment="1" Subcode="0L5" Subgroup="CY"/>
              <Details Amount="2500" AncillaryTypeCode="F" BaggageID="8" Carrier="U6" Code="ALL" DepartureDate="2020-09-08" Description="FIRST EXCESS BAG" Description1="FIRST BAG" Destination="DME" EndSegment="2" Origin="AER" StartSegment="2" Subcode="0CC"/>
              <Details Amount="2500" AncillaryTypeCode="F" BaggageID="9" Carrier="U6" Code="ALL" DepartureDate="2020-09-08" Description="SECOND EXCESS BAG" Description1="SECOND BAG" Destination="DME" EndSegment="2" Origin="AER" StartSegment="2" Subcode="0CD"/>
              <Details Amount="2500" AncillaryTypeCode="F" BaggageID="10" Carrier="U6" Code="ALL" DepartureDate="2020-09-08" Description="THIRD EXCESS BAG" Description1="THIRD BAG" Destination="DME" EndSegment="2" Origin="AER" StartSegment="2" Subcode="0CE"/>
              <Details Amount="2000" AncillaryTypeCode="F" BaggageID="11" Carrier="U6" Code="ALL" DepartureDate="2020-09-08" Description="UPTO22LB 10KG BAGGAGE" Description1="UP TO 22 POUNDS/10 KILOGRAMS" Destination="DME" EndSegment="2" Origin="AER" StartSegment="2" Subcode="0CZ"/>
              <Details Amount="2000" AncillaryTypeCode="F" BaggageID="12" Carrier="U6" Code="ALL" DepartureDate="2020-09-08" Description="EXCESS WEIGHT SPECIAL CHARGE" Description1="EXCESS WEIGHT" Description2="SPECIAL CHARGE" Destination="DME" EndSegment="2" Origin="AER" StartSegment="2" Subcode="0H6"/>
              <Details Amount="2500" AncillaryTypeCode="F" BaggageID="13" Carrier="U6" Code="ALL" DepartureDate="2020-09-08" Description="EXTRA CARRYON BG" Description1="EXCESS SIZE" Description2="SPECIAL CHARGE" Destination="DME" EndSegment="2" Origin="AER" StartSegment="2" Subcode="0H7"/>
              <Details Amount="2500" AncillaryTypeCode="F" BaggageID="14" Carrier="U6" Code="ALL" DepartureDate="2020-09-08" Description="CARRY ON HAND BAGGAGE" Destination="DME" EndSegment="2" Origin="AER" StartSegment="2" Subcode="0L5" Subgroup="CY"/>
            </AncillaryFee>
            <OrderStandardBag>
              <PassengerBags Code="ADT">
                <BaggageSequenceOrder BaggageRef="1" StandardBag="1"/>
                <BaggageSequenceOrder BaggageRef="2" StandardBag="2"/>
                <BaggageSequenceOrder BaggageRef="3" StandardBag="3"/>
                <BaggageSequenceOrder BaggageRef="8" StandardBag="1"/>
                <BaggageSequenceOrder BaggageRef="9" StandardBag="2"/>
                <BaggageSequenceOrder BaggageRef="10" StandardBag="3"/>
              </PassengerBags>
              <PassengerBags Code="CNN">
                <BaggageSequenceOrder BaggageRef="1" StandardBag="1"/>
                <BaggageSequenceOrder BaggageRef="2" StandardBag="2"/>
                <BaggageSequenceOrder BaggageRef="3" StandardBag="3"/>
                <BaggageSequenceOrder BaggageRef="8" StandardBag="1"/>
                <BaggageSequenceOrder BaggageRef="9" StandardBag="2"/>
                <BaggageSequenceOrder BaggageRef="10" StandardBag="3"/>
              </PassengerBags>
              <PassengerBags Code="INF">
                <BaggageSequenceOrder BaggageRef="1" StandardBag="1"/>
                <BaggageSequenceOrder BaggageRef="2" StandardBag="2"/>
                <BaggageSequenceOrder BaggageRef="3" StandardBag="3"/>
                <BaggageSequenceOrder BaggageRef="8" StandardBag="1"/>
                <BaggageSequenceOrder BaggageRef="9" StandardBag="2"/>
                <BaggageSequenceOrder BaggageRef="10" StandardBag="3"/>
              </PassengerBags>
            </OrderStandardBag>
          </AncillaryFeeGroup>
          <TotalFare BaseFareAmount="3520" BaseFareCurrency="RUB" ConstructionAmount="3520" ConstructionCurrency="RUB" Currency="RUB" EquivalentAmount="3520" EquivalentCurrency="RUB" TotalPrice="19946" TotalTaxes="16426"/>
          <ValidatingCarrier Ref="12"/>
          <ValidatingCarrier Ref="4"/>
          <ValidatingCarrier Ref="6"/>
        </Fare>
      </PricingInformation>
      <PricingInformation BrandsOnAnyMarket="true" FlexibleFare="4" PricingSubsource="MIP">
        <Fare ETicketable="true" GoverningCarriers="U6 U6" LastTicketDate="2020-05-13" LastTicketTime="23:59" VITA="true" ValidatingCarrierCode="U6">
          <PassengerInfo NonRefundable="false" PassengerNumber="2" PassengerType="ADT">
            <FareComponent Ref="243">
              <Segment AvailabilityBreak="true" BookingCode="W" CabinCode="Y" SeatsAvailable="9"/>
              <BrandFeature Ref="32"/>
              <BrandFeature Ref="131"/>
              <BrandFeature Ref="127"/>
              <BrandFeature Ref="53"/>
              <BrandFeature Ref="62"/>
              <BrandFeature Ref="17"/>
              <BrandFeature Ref="68"/>
              <BrandFeature Ref="9"/>
              <BrandFeature Ref="77"/>
              <BrandFeature Ref="47"/>
              <BrandFeature Ref="114"/>
              <BrandFeature Ref="75"/>
              <BrandFeature Ref="27"/>
              <BrandFeature Ref="99"/>
              <BrandFeature Ref="56"/>
            </FareComponent>
            <FareComponent Ref="256">
              <Segment AvailabilityBreak="true" BookingCode="W" CabinCode="Y" MealCode="N" SeatsAvailable="9"/>
              <BrandFeature Ref="32"/>
              <BrandFeature Ref="131"/>
              <BrandFeature Ref="127"/>
              <BrandFeature Ref="53"/>
              <BrandFeature Ref="62"/>
              <BrandFeature Ref="17"/>
              <BrandFeature Ref="68"/>
              <BrandFeature Ref="9"/>
              <BrandFeature Ref="77"/>
              <BrandFeature Ref="47"/>
              <BrandFeature Ref="114"/>
              <BrandFeature Ref="75"/>
              <BrandFeature Ref="27"/>
              <BrandFeature Ref="99"/>
              <BrandFeature Ref="56"/>
            </FareComponent>
            <Tax Ref="12"/>
            <Tax Ref="8"/>
            <Tax Ref="46"/>
            <Tax Ref="10"/>
            <Tax Ref="31"/>
            <Tax Ref="35"/>
            <Tax Ref="4"/>
            <Tax Ref="13"/>
            <TaxSummary Ref="19"/>
            <TaxSummary Ref="30"/>
            <TaxSummary Ref="1"/>
            <CurrencyConversion ExchangeRateUsed="1" From="RUB" To="RUB"/>
            <FareMessage Carrier="U6" Code="0" Info="NONEND" Type="N"/>
            <FareMessage Code="0" Info="VALIDATING CARRIER" Type="W"/>
            <FareMessage Code="0" Info="BSP - U6" Type="W"/>
            <FareMessage Code="0" Info="GEN - U6" Type="W"/>
            <FareMessage Code="0" Info="TCH - U6" Type="W"/>
            <FareMessage Code="0" Info="CAT 15 SALES RESTRICTIONS FREE TEXT FOUND - VERIFY RULES" Type="W"/>
            <PassengerTotalFare BaseFareAmount="2280" BaseFareCurrency="RUB" CommissionAmount="0" CommissionPercentage="0" ConstructionAmount="2280" ConstructionCurrency="RUB" Currency="RUB" EquivalentAmount="2280" EquivalentCurrency="RUB" ExchangeRateOne="76.8000000" TotalFare="7830" TotalTaxes="5550"/>
            <BaggageInformation AirlineCode="U6" ProvisionType="A">
              <Segment ID="0"/>
              <Allowance Ref="20"/>
            </BaggageInformation>
            <BaggageInformation AirlineCode="U6" ProvisionType="A">
              <Segment ID="1"/>
              <Allowance Ref="20"/>
            </BaggageInformation>
            <PenaltiesInfo>
              <Penalty Amount="0" Applicability="Before" Changeable="true" ConditionsApply="true" Currency="RUB" Type="Exchange"/>
              <Penalty Amount="0" Applicability="After" Changeable="true" ConditionsApply="true" Currency="RUB" Type="Exchange"/>
              <Penalty Amount="1500" Applicability="Before" Currency="RUB" Refundable="true" Type="Refund"/>
              <Penalty Amount="3000" Applicability="After" Currency="RUB" Refundable="true" Type="Refund"/>
            </PenaltiesInfo>
          </PassengerInfo>
          <PassengerInfo NonRefundable="true" PassengerNumber="1" PassengerType="CNN">
            <FareComponent Ref="211">
              <Segment AvailabilityBreak="true" BookingCode="W" CabinCode="Y" SeatsAvailable="9"/>
              <BrandFeature Ref="32"/>
              <BrandFeature Ref="131"/>
              <BrandFeature Ref="127"/>
              <BrandFeature Ref="53"/>
              <BrandFeature Ref="62"/>
              <BrandFeature Ref="17"/>
              <BrandFeature Ref="68"/>
              <BrandFeature Ref="9"/>
              <BrandFeature Ref="77"/>
              <BrandFeature Ref="47"/>
              <BrandFeature Ref="114"/>
              <BrandFeature Ref="75"/>
              <BrandFeature Ref="27"/>
              <BrandFeature Ref="99"/>
              <BrandFeature Ref="56"/>
            </FareComponent>
            <FareComponent Ref="143">
              <Segment AvailabilityBreak="true" BookingCode="W" CabinCode="Y" MealCode="N" SeatsAvailable="9"/>
              <BrandFeature Ref="74"/>
              <BrandFeature Ref="131"/>
              <BrandFeature Ref="50"/>
              <BrandFeature Ref="102"/>
              <BrandFeature Ref="62"/>
              <BrandFeature Ref="17"/>
              <BrandFeature Ref="68"/>
              <BrandFeature Ref="9"/>
              <BrandFeature Ref="61"/>
              <BrandFeature Ref="43"/>
              <BrandFeature Ref="85"/>
              <BrandFeature Ref="75"/>
              <BrandFeature Ref="27"/>
              <BrandFeature Ref="99"/>
              <BrandFeature Ref="56"/>
            </FareComponent>
            <Tax Ref="12"/>
            <Tax Ref="8"/>
            <Tax Ref="46"/>
            <Tax Ref="10"/>
            <Tax Ref="25"/>
            <Tax Ref="14"/>
            <Tax Ref="32"/>
            <Tax Ref="16"/>
            <TaxSummary Ref="19"/>
            <TaxSummary Ref="30"/>
            <TaxSummary Ref="5"/>
            <CurrencyConversion ExchangeRateUsed="1" From="RUB" To="RUB"/>
            <FareMessage Carrier="U6" Code="0" Info="NONEND" Type="N"/>
            <FareMessage Code="0" Info="EACH CNN REQUIRES ACCOMPANYING SAME CABIN ADT" Type="W"/>
            <FareMessage Code="0" Info="VALIDATING CARRIER" Type="W"/>
            <FareMessage Code="0" Info="BSP - U6" Type="W"/>
            <FareMessage Code="0" Info="GEN - U6" Type="W"/>
            <FareMessage Code="0" Info="TCH - U6" Type="W"/>
            <FareMessage Code="0" Info="CAT 15 SALES RESTRICTIONS FREE TEXT FOUND - VERIFY RULES" Type="W"/>
            <PassengerTotalFare BaseFareAmount="1335" BaseFareCurrency="RUB" CommissionAmount="0" CommissionPercentage="0" ConstructionAmount="1335" ConstructionCurrency="RUB" Currency="RUB" EquivalentAmount="1335" EquivalentCurrency="RUB" ExchangeRateOne="76.8000000" TotalFare="6661" TotalTaxes="5326"/>
            <BaggageInformation AirlineCode="U6" ProvisionType="A">
              <Segment ID="0"/>
              <Allowance Ref="20"/>
            </BaggageInformation>
            <BaggageInformation AirlineCode="U6" ProvisionType="A">
              <Segment ID="1"/>
              <Allowance Ref="18"/>
            </BaggageInformation>
            <PenaltiesInfo>
              <Penalty Amount="0" Applicability="Before" Changeable="true" ConditionsApply="true" Currency="RUB" Type="Exchange"/>
              <Penalty Amount="3000" Applicability="After" Changeable="true" ConditionsApply="true" Currency="RUB" Type="Exchange"/>
              <Penalty Amount="1500" Applicability="Before" Currency="RUB" Refundable="true" Type="Refund"/>
              <Penalty Amount="1500" Applicability="After" Currency="RUB" Refundable="true" Type="Refund"/>
            </PenaltiesInfo>
          </PassengerInfo>
          <PassengerInfo NonRefundable="false" PassengerNumber="1" PassengerType="INF">
            <FareComponent Ref="96">
              <Segment AvailabilityBreak="true" BookingCode="W" CabinCode="Y" SeatsAvailable="9"/>
              <BrandFeature Ref="32"/>
              <BrandFeature Ref="131"/>
              <BrandFeature Ref="127"/>
              <BrandFeature Ref="53"/>
              <BrandFeature Ref="62"/>
              <BrandFeature Ref="17"/>
              <BrandFeature Ref="68"/>
              <BrandFeature Ref="9"/>
              <BrandFeature Ref="77"/>
              <BrandFeature Ref="47"/>
              <BrandFeature Ref="114"/>
              <BrandFeature Ref="75"/>
              <BrandFeature Ref="27"/>
              <BrandFeature Ref="99"/>
              <BrandFeature Ref="56"/>
            </FareComponent>
            <FareComponent Ref="182">
              <Segment AvailabilityBreak="true" BookingCode="W" CabinCode="Y" MealCode="N" SeatsAvailable="9"/>
              <BrandFeature Ref="32"/>
              <BrandFeature Ref="131"/>
              <BrandFeature Ref="127"/>
              <BrandFeature Ref="53"/>
              <BrandFeature Ref="62"/>
              <BrandFeature Ref="17"/>
              <BrandFeature Ref="68"/>
              <BrandFeature Ref="9"/>
              <BrandFeature Ref="77"/>
              <BrandFeature Ref="47"/>
              <BrandFeature Ref="114"/>
              <BrandFeature Ref="75"/>
              <BrandFeature Ref="27"/>
              <BrandFeature Ref="99"/>
              <BrandFeature Ref="56"/>
            </FareComponent>
            <CurrencyConversion ExchangeRateUsed="1" From="RUB" To="RUB"/>
            <FareMessage Carrier="U6" Code="0" Info="NONEND" Type="N"/>
            <FareMessage Code="0" Info="EACH INF REQUIRES ACCOMPANYING ADT PASSENGER" Type="W"/>
            <FareMessage Code="0" Info="VALIDATING CARRIER" Type="W"/>
            <FareMessage Code="0" Info="BSP - U6" Type="W"/>
            <FareMessage Code="0" Info="GEN - U6" Type="W"/>
            <FareMessage Code="0" Info="TCH - U6" Type="W"/>
            <FareMessage Code="0" Info="CAT 15 SALES RESTRICTIONS FREE TEXT FOUND - VERIFY RULES" Type="W"/>
            <PassengerTotalFare BaseFareAmount="0" BaseFareCurrency="RUB" CommissionAmount="0" CommissionPercentage="0" ConstructionAmount="0" ConstructionCurrency="RUB" Currency="RUB" EquivalentAmount="0" EquivalentCurrency="RUB" ExchangeRateOne="76.8000000" TotalFare="0" TotalTaxes="0"/>
            <BaggageInformation AirlineCode="U6" ProvisionType="A">
              <Segment ID="0"/>
              <Allowance Ref="18"/>
            </BaggageInformation>
            <BaggageInformation AirlineCode="U6" ProvisionType="A">
              <Segment ID="1"/>
              <Allowance Ref="18"/>
            </BaggageInformation>
            <PenaltiesInfo>
              <Penalty Amount="0" Applicability="Before" Changeable="true" ConditionsApply="true" Currency="RUB" Type="Exchange"/>
              <Penalty Amount="0" Applicability="After" Changeable="true" ConditionsApply="true" Currency="RUB" Type="Exchange"/>
              <Penalty Amount="0" Applicability="Before" Currency="RUB" Refundable="true" Type="Refund"/>
              <Penalty Amount="0" Applicability="After" Currency="RUB" Refundable="true" Type="Refund"/>
            </PenaltiesInfo>
          </PassengerInfo>
          <AncillaryFeeGroup Message="ADDTL AIR EXTRAS APPLY - REFINE REQUEST">
            <AncillaryFee Code="BG" Name="BAGGAGE">
              <Details Amount="2500" AncillaryTypeCode="F" BaggageID="1" Carrier="U6" Code="ALL" DepartureDate="2020-09-01" Description="FIRST EXCESS BAG" Description1="FIRST BAG" Destination="AER" EndSegment="1" Origin="DME" StartSegment="1" Subcode="0CC"/>
              <Details Amount="2500" AncillaryTypeCode="F" BaggageID="2" Carrier="U6" Code="ALL" DepartureDate="2020-09-01" Description="SECOND EXCESS BAG" Description1="SECOND BAG" Destination="AER" EndSegment="1" Origin="DME" StartSegment="1" Subcode="0CD"/>
              <Details Amount="2500" AncillaryTypeCode="F" BaggageID="3" Carrier="U6" Code="ALL" DepartureDate="2020-09-01" Description="THIRD EXCESS BAG" Description1="THIRD BAG" Destination="AER" EndSegment="1" Origin="DME" StartSegment="1" Subcode="0CE"/>
              <Details Amount="2000" AncillaryTypeCode="F" BaggageID="4" Carrier="U6" Code="ALL" DepartureDate="2020-09-01" Description="UPTO22LB 10KG BAGGAGE" Description1="UP TO 22 POUNDS/10 KILOGRAMS" Destination="AER" EndSegment="1" Origin="DME" StartSegment="1" Subcode="0CZ"/>
              <Details Amount="2000" AncillaryTypeCode="F" BaggageID="5" Carrier="U6" Code="ALL" DepartureDate="2020-09-01" Description="EXCESS WEIGHT SPECIAL CHARGE" Description1="EXCESS WEIGHT" Description2="SPECIAL CHARGE" Destination="AER" EndSegment="1" Origin="DME" StartSegment="1" Subcode="0H6"/>
              <Details Amount="2500" AncillaryTypeCode="F" BaggageID="6" Carrier="U6" Code="ALL" DepartureDate="2020-09-01" Description="EXTRA CARRYON BG" Description1="EXCESS SIZE" Description2="SPECIAL CHARGE" Destination="AER" EndSegment="1" Origin="DME" StartSegment="1" Subcode="0H7"/>
              <Details Amount="2500" AncillaryTypeCode="F" BaggageID="7" Carrier="U6" Code="ALL" DepartureDate="2020-09-01" Description="CARRY ON HAND BAGGAGE" Destination="AER" EndSegment="1" Origin="DME" StartSegment="1" Subcode="0L5" Subgroup="CY"/>
              <Details Amount="2500" AncillaryTypeCode="F" BaggageID="8" Carrier="U6" Code="ALL" DepartureDate="2020-09-08" Description="FIRST EXCESS BAG" Description1="FIRST BAG" Destination="DME" EndSegment="2" Origin="AER" StartSegment="2" Subcode="0CC"/>
              <Details Amount="2500" AncillaryTypeCode="F" BaggageID="9" Carrier="U6" Code="ALL" DepartureDate="2020-09-08" Description="SECOND EXCESS BAG" Description1="SECOND BAG" Destination="DME" EndSegment="2" Origin="AER" StartSegment="2" Subcode="0CD"/>
              <Details Amount="2500" AncillaryTypeCode="F" BaggageID="10" Carrier="U6" Code="ALL" DepartureDate="2020-09-08" Description="THIRD EXCESS BAG" Description1="THIRD BAG" Destination="DME" EndSegment="2" Origin="AER" StartSegment="2" Subcode="0CE"/>
              <Details Amount="2000" AncillaryTypeCode="F" BaggageID="11" Carrier="U6" Code="ALL" DepartureDate="2020-09-08" Description="UPTO22LB 10KG BAGGAGE" Description1="UP TO 22 POUNDS/10 KILOGRAMS" Destination="DME" EndSegment="2" Origin="AER" StartSegment="2" Subcode="0CZ"/>
              <Details Amount="2000" AncillaryTypeCode="F" BaggageID="12" Carrier="U6" Code="ALL" DepartureDate="2020-09-08" Description="EXCESS WEIGHT SPECIAL CHARGE" Description1="EXCESS WEIGHT" Description2="SPECIAL CHARGE" Destination="DME" EndSegment="2" Origin="AER" StartSegment="2" Subcode="0H6"/>
              <Details Amount="2500" AncillaryTypeCode="F" BaggageID="13" Carrier="U6" Code="ALL" DepartureDate="2020-09-08" Description="EXTRA CARRYON BG" Description1="EXCESS SIZE" Description2="SPECIAL CHARGE" Destination="DME" EndSegment="2" Origin="AER" StartSegment="2" Subcode="0H7"/>
              <Details Amount="2500" AncillaryTypeCode="F" BaggageID="14" Carrier="U6" Code="ALL" DepartureDate="2020-09-08" Description="CARRY ON HAND BAGGAGE" Destination="DME" EndSegment="2" Origin="AER" StartSegment="2" Subcode="0L5" Subgroup="CY"/>
            </AncillaryFee>
            <OrderStandardBag>
              <PassengerBags Code="ADT">
                <BaggageSequenceOrder BaggageRef="1" StandardBag="1"/>
                <BaggageSequenceOrder BaggageRef="2" StandardBag="2"/>
                <BaggageSequenceOrder BaggageRef="3" StandardBag="3"/>
                <BaggageSequenceOrder BaggageRef="8" StandardBag="1"/>
                <BaggageSequenceOrder BaggageRef="9" StandardBag="2"/>
                <BaggageSequenceOrder BaggageRef="10" StandardBag="3"/>
              </PassengerBags>
              <PassengerBags Code="CNN">
                <BaggageSequenceOrder BaggageRef="1" StandardBag="1"/>
                <BaggageSequenceOrder BaggageRef="2" StandardBag="2"/>
                <BaggageSequenceOrder BaggageRef="3" StandardBag="3"/>
                <BaggageSequenceOrder BaggageRef="8" StandardBag="1"/>
                <BaggageSequenceOrder BaggageRef="9" StandardBag="2"/>
                <BaggageSequenceOrder BaggageRef="10" StandardBag="3"/>
              </PassengerBags>
              <PassengerBags Code="INF">
                <BaggageSequenceOrder BaggageRef="1" StandardBag="1"/>
                <BaggageSequenceOrder BaggageRef="2" StandardBag="2"/>
                <BaggageSequenceOrder BaggageRef="3" StandardBag="3"/>
                <BaggageSequenceOrder BaggageRef="8" StandardBag="1"/>
                <BaggageSequenceOrder BaggageRef="9" StandardBag="2"/>
                <BaggageSequenceOrder BaggageRef="10" StandardBag="3"/>
              </PassengerBags>
            </OrderStandardBag>
          </AncillaryFeeGroup>
          <TotalFare BaseFareAmount="5895" BaseFareCurrency="RUB" ConstructionAmount="5895" ConstructionCurrency="RUB" Currency="RUB" EquivalentAmount="5895" EquivalentCurrency="RUB" TotalPrice="22321" TotalTaxes="16426"/>
          <ValidatingCarrier Ref="12"/>
          <ValidatingCarrier Ref="4"/>
          <ValidatingCarrier Ref="6"/>
        </Fare>
      </PricingInformation>
      <DiversitySwapper WeighedPrice="13297.333"/>
    </Itinerary>
    <!--Другие варианты перелетов-->
  </ItineraryGroup>
  <!--Другие маршруты-->
</GroupedItineraryResponse>
{% endxmlsec %}

---

{% xmlsec "Пример запроса (оформление на нескольких билетах (SOW), OTA ответ)", false %}
<OTA_AirLowFareSearchRQ ResponseType="OTA" Version="6.1.0" xmlns="http://www.opentravel.org/OTA/2003/05">
  <POS>
    <Source PseudoCityCode="9LSC">
      <RequestorID ID="1" Type="1">
        <CompanyName Code="TN"/>
      </RequestorID>
    </Source>
  </POS>
  <OriginDestinationInformation RPH="1">
    <DepartureDateTime>2020-09-01T11:00:00</DepartureDateTime>
    <OriginLocation LocationCode="MOW"/>
    <DestinationLocation LocationCode="AER"/>
  </OriginDestinationInformation>
  <OriginDestinationInformation RPH="2">
    <DepartureDateTime>2020-09-08T11:00:00</DepartureDateTime>
    <OriginLocation LocationCode="AER"/>
    <DestinationLocation LocationCode="MOW"/>
  </OriginDestinationInformation>
  <TravelPreferences ValidInterlineTicket="true">
    <CabinPref Cabin="Economy" PreferLevel="Preferred"/>
    <TPA_Extensions>
      <LongConnectTime Enable="true"/>
      <LongConnectPoints Max="3" Min="1"/>
      <KeepSameCabin Enabled="true"/>
      <ExcludeCallDirectCarriers Enabled="true"/>
      <DiversityParameters AdditionalNonStopsPercentage="100"/>
    </TPA_Extensions>
    <AncillaryFees Enable="true">
      <AncillaryFeeGroup Code="BG"/>
    </AncillaryFees>
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
    <IntelliSellTransaction>
      <RequestType Name="200ITINS"/>
    </IntelliSellTransaction>
    <MultiTicket DisplayPolicy="SOW"/>
  </TPA_Extensions>
</OTA_AirLowFareSearchRQ>
{% endxmlsec %}

{% xmlsec "Пример ответа", false %}
<OTA_AirLowFareSearchRS AvailableItinCount="0" BrandedOneWayItinCount="0" DepartedItinCount="0" PricedItinCount="294" SimpleOneWayItinCount="85" SoldOutItinCount="0" Version="6.1.0" xmlns="http://www.opentravel.org/OTA/2003/05" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <Success/>
  <Warnings>
    <Warning Code="PROCESS" ShortText="No data from MIP Clients" Type="MIP"/>
    <Warning Code="TRANSACTIONID" MessageClass="I" ShortText="7553735757371651885" Type="WORKERTHREAD"/>
    <Warning Code="ASEPT2LAPP00323.IDM.SGDCPROD.SABRE.COM" MessageClass="I" ShortText="27035" Type="SERVER"/>
    <Warning Code="RULEID" MessageClass="I" ShortText="15936" Type="DRE"/>
    <Warning Code="RULEID" MessageClass="I" ShortText="24467" Type="DEFAULT"/>
    <Warning Code="MSG" MessageClass="I" ShortText="NO VALID COMBINATIONS FOUND" Type="MIP"/>
  </Warnings>
  <BrandFeatures>
    <BrandFeature Application="F" CommercialName="SEAT SELECTION DURING CHECK IN" Id="1" ServiceGroup="BF" ServiceType="Z" SubCode="050" Vendor="ATP"/>
    <BrandFeature Application="C" CommercialName="SEAT SELECTION DURING CHECK IN" Id="2" ServiceGroup="BF" ServiceType="Z" SubCode="050" Vendor="ATP"/>
    <BrandFeature Application="C" CommercialName="BASIC SEAT" Id="3" ServiceGroup="BF" ServiceType="Z" SubCode="050" Vendor="ATP"/>
    <BrandFeature Application="N" CommercialName="REFUNDABLE TICKET" Id="4" ServiceGroup="BF" ServiceType="Z" SubCode="056" Vendor="ATP"/>
    <BrandFeature Application="C" CommercialName="CHANGEABLE TICKET" Id="5" ServiceGroup="BF" ServiceType="Z" SubCode="059" Vendor="ATP"/>
    <!--Другие услуги-->
  </BrandFeatures>
  <PricedItineraries>
    <PricedItinerary SequenceNumber="1">
      <AirItinerary DirectionInd="Return">
        <OriginDestinationOptions>
          <OriginDestinationOption ArrivalCountry="RU" DepartureCountry="RU" ElapsedTime="140">
            <FlightSegment ArrivalDateTime="2020-09-01T15:35:00" DepartureDateTime="2020-09-01T13:15:00" ElapsedTime="140" FlightNumber="1309" ResBookDesigCode="W" StopQuantity="0">
              <DepartureAirport LocationCode="ZIA"/>
              <ArrivalAirport LocationCode="AER"/>
              <OperatingAirline Code="U6" FlightNumber="1309"/>
              <Equipment AirEquipType="320"/>
              <MarketingAirline Code="U6"/>
              <MarriageGrp>O</MarriageGrp>
              <DepartureTimeZone GMTOffset="3"/>
              <ArrivalTimeZone GMTOffset="3"/>
              <TPA_Extensions>
                <eTicket Ind="true"/>
                <Mileage Amount="840"/>
              </TPA_Extensions>
            </FlightSegment>
          </OriginDestinationOption>
          <OriginDestinationOption ArrivalCountry="RU" DepartureCountry="RU" ElapsedTime="145">
            <FlightSegment ArrivalDateTime="2020-09-09T00:45:00" DepartureDateTime="2020-09-08T22:20:00" ElapsedTime="145" FlightNumber="308" ResBookDesigCode="W" StopQuantity="0">
              <DepartureAirport LocationCode="AER"/>
              <ArrivalAirport LocationCode="ZIA"/>
              <OperatingAirline Code="U6" FlightNumber="308"/>
              <Equipment AirEquipType="320"/>
              <MarketingAirline Code="U6"/>
              <MarriageGrp>O</MarriageGrp>
              <DepartureTimeZone GMTOffset="3"/>
              <ArrivalTimeZone GMTOffset="3"/>
              <TPA_Extensions>
                <eTicket Ind="true"/>
                <Mileage Amount="840"/>
              </TPA_Extensions>
            </FlightSegment>
          </OriginDestinationOption>
        </OriginDestinationOptions>
      </AirItinerary>
      <AirItineraryPricingInfo BrandsOnAnyMarket="true" FareReturned="true" LastTicketDate="2020-05-13" LastTicketTime="23:59" PricingSource="ADVJR1" PricingSubSource="MIP">
        <ItinTotalFare>
          <BaseFare Amount="3520" CurrencyCode="RUB" DecimalPlaces="0"/>
          <FareConstruction Amount="3520" CurrencyCode="RUB" DecimalPlaces="0"/>
          <EquivFare Amount="3520" CurrencyCode="RUB" DecimalPlaces="0"/>
          <Taxes>
            <Tax Amount="16276" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="TOTALTAX"/>
          </Taxes>
          <TotalFare Amount="19796" CurrencyCode="RUB" DecimalPlaces="0"/>
        </ItinTotalFare>
        <PTC_FareBreakdowns>
          <PTC_FareBreakdown>
            <PassengerTypeQuantity Code="ADT" Quantity="2"/>
            <FareBasisCodes>
              <FareBasisCode ArrivalAirportCode="AER" AvailabilityBreak="true" BookingCode="W" DepartureAirportCode="ZIA" FareComponentBeginAirport="ZIA" FareComponentDirectionality="FROM" FareComponentEndAirport="AER" FareComponentFareRule="U6PR" FareComponentFareTariff="304" FareComponentFareType="XPN" FareComponentFareTypeBitmap="00" FareComponentVendorCode="ATP" GovCarrier="U6">WPRRT</FareBasisCode>
              <FareBasisCode ArrivalAirportCode="ZIA" AvailabilityBreak="true" BookingCode="W" DepartureAirportCode="AER" FareComponentBeginAirport="AER" FareComponentDirectionality="TO" FareComponentEndAirport="ZIA" FareComponentFareRule="U6PR" FareComponentFareTariff="304" FareComponentFareType="XPN" FareComponentFareTypeBitmap="00" FareComponentVendorCode="ATP" GovCarrier="U6">WPRRT</FareBasisCode>
            </FareBasisCodes>
            <PassengerFare>
              <BaseFare Amount="1280" CurrencyCode="RUB"/>
              <FareConstruction Amount="1280" CurrencyCode="RUB" DecimalPlaces="0"/>
              <EquivFare Amount="1280" CurrencyCode="RUB" DecimalPlaces="0"/>
              <Taxes>
                <Tax Amount="2150" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                <Tax Amount="2150" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                <Tax Amount="400" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRI"/>
                <Tax Amount="400" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRI"/>
                <Tax Amount="75" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                <Tax Amount="120" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                <Tax Amount="75" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI4"/>
                <Tax Amount="120" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI4"/>
                <TaxSummary Amount="4300" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                <TaxSummary Amount="800" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRI"/>
                <TaxSummary Amount="390" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                <TotalTax Amount="5490" CurrencyCode="RUB" DecimalPlaces="0"/>
              </Taxes>
              <TotalFare Amount="6770" CurrencyCode="RUB"/>
              <PenaltiesInfo>
                <Penalty Amount="0" Applicability="Before" Changeable="true" ConditionsApply="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                <Penalty Amount="3000" Applicability="After" Changeable="true" ConditionsApply="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                <Penalty Applicability="Before" Refundable="false" Type="Refund"/>
                <Penalty Applicability="After" Refundable="false" Type="Refund"/>
              </PenaltiesInfo>
              <TPA_Extensions>
                <FareComponents>
                  <FareComponent BrandID="PR" BrandName="PROMO" ProgramCode="CFFU6" ProgramDescription="U6 DOMESTIC" ProgramID="83326" ProgramSystemCode="A">
                    <Segment FlightIndex="1" LegIndex="1"/>
                    <BrandFeatureRef FeatureId="13"/>
                    <BrandFeatureRef FeatureId="16"/>
                    <BrandFeatureRef FeatureId="20"/>
                    <BrandFeatureRef FeatureId="21"/>
                    <BrandFeatureRef FeatureId="33"/>
                    <BrandFeatureRef FeatureId="34"/>
                    <BrandFeatureRef FeatureId="70"/>
                    <BrandFeatureRef FeatureId="68"/>
                    <BrandFeatureRef FeatureId="50"/>
                    <BrandFeatureRef FeatureId="45"/>
                    <BrandFeatureRef FeatureId="48"/>
                    <BrandFeatureRef FeatureId="74"/>
                    <BrandFeatureRef FeatureId="77"/>
                    <BrandFeatureRef FeatureId="83"/>
                    <BrandFeatureRef FeatureId="85"/>
                  </FareComponent>
                  <FareComponent BrandID="PR" BrandName="PROMO" ProgramCode="CFFU6" ProgramDescription="U6 DOMESTIC" ProgramID="83326" ProgramSystemCode="A">
                    <Segment FlightIndex="1" LegIndex="2"/>
                    <BrandFeatureRef FeatureId="13"/>
                    <BrandFeatureRef FeatureId="16"/>
                    <BrandFeatureRef FeatureId="20"/>
                    <BrandFeatureRef FeatureId="21"/>
                    <BrandFeatureRef FeatureId="33"/>
                    <BrandFeatureRef FeatureId="34"/>
                    <BrandFeatureRef FeatureId="70"/>
                    <BrandFeatureRef FeatureId="68"/>
                    <BrandFeatureRef FeatureId="50"/>
                    <BrandFeatureRef FeatureId="45"/>
                    <BrandFeatureRef FeatureId="48"/>
                    <BrandFeatureRef FeatureId="74"/>
                    <BrandFeatureRef FeatureId="77"/>
                    <BrandFeatureRef FeatureId="83"/>
                    <BrandFeatureRef FeatureId="85"/>
                  </FareComponent>
                </FareComponents>
                <Messages>
                  <Message AirlineCode="U6" FailCode="0" Info="NONEND" Type="N"/>
                  <Message FailCode="0" Info="VALIDATING CARRIER" Type="W"/>
                  <Message FailCode="0" Info="BSP - U6" Type="W"/>
                  <Message FailCode="0" Info="GEN - U6" Type="W"/>
                  <Message FailCode="0" Info="TCH - U6" Type="W"/>
                  <Message FailCode="0" Info="CAT 15 SALES RESTRICTIONS FREE TEXT FOUND - VERIFY RULES" Type="W"/>
                </Messages>
                <BaggageInformationList>
                  <BaggageInformation AirlineCode="U6" ProvisionType="A">
                    <Segment Id="0"/>
                    <Allowance Unit="kg" Weight="10"/>
                  </BaggageInformation>
                  <BaggageInformation AirlineCode="U6" ProvisionType="A">
                    <Segment Id="1"/>
                    <Allowance Unit="kg" Weight="10"/>
                  </BaggageInformation>
                </BaggageInformationList>
              </TPA_Extensions>
            </PassengerFare>
            <Endorsements NonRefundableIndicator="true"/>
            <TPA_Extensions>
              <FareCalcLine Info="ZIA U6 AER640U6 ZIA640RUB1280END"/>
            </TPA_Extensions>
            <FareInfos>
              <FareInfo>
                <FareReference>W</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="N"/>
                </TPA_Extensions>
              </FareInfo>
              <FareInfo>
                <FareReference>W</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="N"/>
                </TPA_Extensions>
              </FareInfo>
            </FareInfos>
          </PTC_FareBreakdown>
          <PTC_FareBreakdown>
            <PassengerTypeQuantity Code="CNN" Quantity="1"/>
            <FareBasisCodes>
              <FareBasisCode ArrivalAirportCode="AER" AvailabilityBreak="true" BookingCode="W" DepartureAirportCode="ZIA" FareComponentBeginAirport="ZIA" FareComponentDirectionality="FROM" FareComponentEndAirport="AER" FareComponentFareRule="U6PR" FareComponentFareTariff="304" FareComponentFareType="XPN" FareComponentFareTypeBitmap="01" FareComponentVendorCode="ATP" GovCarrier="U6">WPRRT/CH25</FareBasisCode>
              <FareBasisCode ArrivalAirportCode="ZIA" AvailabilityBreak="true" BookingCode="W" DepartureAirportCode="AER" FareComponentBeginAirport="AER" FareComponentDirectionality="TO" FareComponentEndAirport="ZIA" FareComponentFareRule="U6PR" FareComponentFareTariff="304" FareComponentFareType="XPN" FareComponentFareTypeBitmap="01" FareComponentVendorCode="ATP" GovCarrier="U6">WPRRT/CH25</FareBasisCode>
            </FareBasisCodes>
            <PassengerFare>
              <BaseFare Amount="960" CurrencyCode="RUB"/>
              <FareConstruction Amount="960" CurrencyCode="RUB" DecimalPlaces="0"/>
              <EquivFare Amount="960" CurrencyCode="RUB" DecimalPlaces="0"/>
              <Taxes>
                <Tax Amount="2150" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                <Tax Amount="2150" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                <Tax Amount="400" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRI"/>
                <Tax Amount="400" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRI"/>
                <Tax Amount="38" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                <Tax Amount="60" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                <Tax Amount="38" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI4"/>
                <Tax Amount="60" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI4"/>
                <TaxSummary Amount="4300" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                <TaxSummary Amount="800" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRI"/>
                <TaxSummary Amount="196" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                <TotalTax Amount="5296" CurrencyCode="RUB" DecimalPlaces="0"/>
              </Taxes>
              <TotalFare Amount="6256" CurrencyCode="RUB"/>
              <PenaltiesInfo>
                <Penalty Amount="0" Applicability="Before" Changeable="true" ConditionsApply="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                <Penalty Amount="3000" Applicability="After" Changeable="true" ConditionsApply="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                <Penalty Applicability="Before" Refundable="false" Type="Refund"/>
                <Penalty Applicability="After" Refundable="false" Type="Refund"/>
              </PenaltiesInfo>
              <TPA_Extensions>
                <FareComponents>
                  <FareComponent BrandID="PR" BrandName="PROMO" ProgramCode="CFFU6" ProgramDescription="U6 DOMESTIC" ProgramID="83326" ProgramSystemCode="A">
                    <Segment FlightIndex="1" LegIndex="1"/>
                    <BrandFeatureRef FeatureId="13"/>
                    <BrandFeatureRef FeatureId="16"/>
                    <BrandFeatureRef FeatureId="20"/>
                    <BrandFeatureRef FeatureId="21"/>
                    <BrandFeatureRef FeatureId="33"/>
                    <BrandFeatureRef FeatureId="34"/>
                    <BrandFeatureRef FeatureId="70"/>
                    <BrandFeatureRef FeatureId="68"/>
                    <BrandFeatureRef FeatureId="50"/>
                    <BrandFeatureRef FeatureId="45"/>
                    <BrandFeatureRef FeatureId="48"/>
                    <BrandFeatureRef FeatureId="74"/>
                    <BrandFeatureRef FeatureId="77"/>
                    <BrandFeatureRef FeatureId="83"/>
                    <BrandFeatureRef FeatureId="85"/>
                  </FareComponent>
                  <FareComponent BrandID="PR" BrandName="PROMO" ProgramCode="CFFU6" ProgramDescription="U6 DOMESTIC" ProgramID="83326" ProgramSystemCode="A">
                    <Segment FlightIndex="1" LegIndex="2"/>
                    <BrandFeatureRef FeatureId="13"/>
                    <BrandFeatureRef FeatureId="16"/>
                    <BrandFeatureRef FeatureId="20"/>
                    <BrandFeatureRef FeatureId="21"/>
                    <BrandFeatureRef FeatureId="33"/>
                    <BrandFeatureRef FeatureId="34"/>
                    <BrandFeatureRef FeatureId="70"/>
                    <BrandFeatureRef FeatureId="68"/>
                    <BrandFeatureRef FeatureId="50"/>
                    <BrandFeatureRef FeatureId="45"/>
                    <BrandFeatureRef FeatureId="48"/>
                    <BrandFeatureRef FeatureId="74"/>
                    <BrandFeatureRef FeatureId="77"/>
                    <BrandFeatureRef FeatureId="83"/>
                    <BrandFeatureRef FeatureId="85"/>
                  </FareComponent>
                </FareComponents>
                <Messages>
                  <Message AirlineCode="U6" FailCode="0" Info="NONEND" Type="N"/>
                  <Message FailCode="0" Info="EACH CNN REQUIRES ACCOMPANYING SAME CABIN ADT" Type="W"/>
                  <Message FailCode="0" Info="VALIDATING CARRIER" Type="W"/>
                  <Message FailCode="0" Info="BSP - U6" Type="W"/>
                  <Message FailCode="0" Info="GEN - U6" Type="W"/>
                  <Message FailCode="0" Info="TCH - U6" Type="W"/>
                  <Message FailCode="0" Info="CAT 15 SALES RESTRICTIONS FREE TEXT FOUND - VERIFY RULES" Type="W"/>
                </Messages>
                <BaggageInformationList>
                  <BaggageInformation AirlineCode="U6" ProvisionType="A">
                    <Segment Id="0"/>
                    <Allowance Unit="kg" Weight="10"/>
                  </BaggageInformation>
                  <BaggageInformation AirlineCode="U6" ProvisionType="A">
                    <Segment Id="1"/>
                    <Allowance Unit="kg" Weight="10"/>
                  </BaggageInformation>
                </BaggageInformationList>
              </TPA_Extensions>
            </PassengerFare>
            <Endorsements NonRefundableIndicator="true"/>
            <TPA_Extensions>
              <FareCalcLine Info="ZIA U6 AER480U6 ZIA480RUB960END"/>
            </TPA_Extensions>
            <FareInfos>
              <FareInfo>
                <FareReference>W</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="N"/>
                </TPA_Extensions>
              </FareInfo>
              <FareInfo>
                <FareReference>W</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="N"/>
                </TPA_Extensions>
              </FareInfo>
            </FareInfos>
          </PTC_FareBreakdown>
          <PTC_FareBreakdown>
            <PassengerTypeQuantity Code="INF" Quantity="1"/>
            <FareBasisCodes>
              <FareBasisCode ArrivalAirportCode="AER" AvailabilityBreak="true" BookingCode="W" DepartureAirportCode="ZIA" FareComponentBeginAirport="ZIA" FareComponentDirectionality="FROM" FareComponentEndAirport="AER" FareComponentFareRule="U6PR" FareComponentFareTariff="304" FareComponentFareType="XPN" FareComponentFareTypeBitmap="01" FareComponentVendorCode="ATP" GovCarrier="U6">WPRRT/IN</FareBasisCode>
              <FareBasisCode ArrivalAirportCode="ZIA" AvailabilityBreak="true" BookingCode="W" DepartureAirportCode="AER" FareComponentBeginAirport="AER" FareComponentDirectionality="TO" FareComponentEndAirport="ZIA" FareComponentFareRule="U6PR" FareComponentFareTariff="304" FareComponentFareType="XPN" FareComponentFareTypeBitmap="01" FareComponentVendorCode="ATP" GovCarrier="U6">WPRRT/IN</FareBasisCode>
            </FareBasisCodes>
            <PassengerFare>
              <BaseFare Amount="0" CurrencyCode="RUB"/>
              <FareConstruction Amount="0" CurrencyCode="RUB" DecimalPlaces="0"/>
              <EquivFare Amount="0" CurrencyCode="RUB" DecimalPlaces="0"/>
              <TotalFare Amount="0" CurrencyCode="RUB"/>
              <PenaltiesInfo>
                <Penalty Amount="0" Applicability="Before" Changeable="true" ConditionsApply="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                <Penalty Amount="0" Applicability="After" Changeable="true" ConditionsApply="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                <Penalty Applicability="Before" Refundable="false" Type="Refund"/>
                <Penalty Applicability="After" Refundable="false" Type="Refund"/>
              </PenaltiesInfo>
              <TPA_Extensions>
                <FareComponents>
                  <FareComponent BrandID="PR" BrandName="PROMO" ProgramCode="CFFU6" ProgramDescription="U6 DOMESTIC" ProgramID="83326" ProgramSystemCode="A">
                    <Segment FlightIndex="1" LegIndex="1"/>
                    <BrandFeatureRef FeatureId="13"/>
                    <BrandFeatureRef FeatureId="16"/>
                    <BrandFeatureRef FeatureId="20"/>
                    <BrandFeatureRef FeatureId="21"/>
                    <BrandFeatureRef FeatureId="33"/>
                    <BrandFeatureRef FeatureId="34"/>
                    <BrandFeatureRef FeatureId="70"/>
                    <BrandFeatureRef FeatureId="68"/>
                    <BrandFeatureRef FeatureId="50"/>
                    <BrandFeatureRef FeatureId="45"/>
                    <BrandFeatureRef FeatureId="48"/>
                    <BrandFeatureRef FeatureId="74"/>
                    <BrandFeatureRef FeatureId="77"/>
                    <BrandFeatureRef FeatureId="83"/>
                    <BrandFeatureRef FeatureId="85"/>
                  </FareComponent>
                  <FareComponent BrandID="PR" BrandName="PROMO" ProgramCode="CFFU6" ProgramDescription="U6 DOMESTIC" ProgramID="83326" ProgramSystemCode="A">
                    <Segment FlightIndex="1" LegIndex="2"/>
                    <BrandFeatureRef FeatureId="13"/>
                    <BrandFeatureRef FeatureId="16"/>
                    <BrandFeatureRef FeatureId="20"/>
                    <BrandFeatureRef FeatureId="21"/>
                    <BrandFeatureRef FeatureId="33"/>
                    <BrandFeatureRef FeatureId="34"/>
                    <BrandFeatureRef FeatureId="70"/>
                    <BrandFeatureRef FeatureId="68"/>
                    <BrandFeatureRef FeatureId="50"/>
                    <BrandFeatureRef FeatureId="45"/>
                    <BrandFeatureRef FeatureId="48"/>
                    <BrandFeatureRef FeatureId="74"/>
                    <BrandFeatureRef FeatureId="77"/>
                    <BrandFeatureRef FeatureId="83"/>
                    <BrandFeatureRef FeatureId="85"/>
                  </FareComponent>
                </FareComponents>
                <Messages>
                  <Message AirlineCode="U6" FailCode="0" Info="NONEND" Type="N"/>
                  <Message FailCode="0" Info="EACH INF REQUIRES ACCOMPANYING ADT PASSENGER" Type="W"/>
                  <Message FailCode="0" Info="VALIDATING CARRIER" Type="W"/>
                  <Message FailCode="0" Info="BSP - U6" Type="W"/>
                  <Message FailCode="0" Info="GEN - U6" Type="W"/>
                  <Message FailCode="0" Info="TCH - U6" Type="W"/>
                  <Message FailCode="0" Info="CAT 15 SALES RESTRICTIONS FREE TEXT FOUND - VERIFY RULES" Type="W"/>
                </Messages>
                <BaggageInformationList>
                  <BaggageInformation AirlineCode="U6" ProvisionType="A">
                    <Segment Id="0"/>
                    <Allowance Unit="kg" Weight="10"/>
                  </BaggageInformation>
                  <BaggageInformation AirlineCode="U6" ProvisionType="A">
                    <Segment Id="1"/>
                    <Allowance Unit="kg" Weight="10"/>
                  </BaggageInformation>
                </BaggageInformationList>
              </TPA_Extensions>
            </PassengerFare>
            <Endorsements NonRefundableIndicator="false"/>
            <TPA_Extensions>
              <FareCalcLine Info="ZIA U6 AER0U6 ZIA0RUB0END"/>
            </TPA_Extensions>
            <FareInfos>
              <FareInfo>
                <FareReference>W</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="N"/>
                </TPA_Extensions>
              </FareInfo>
              <FareInfo>
                <FareReference>W</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="N"/>
                </TPA_Extensions>
              </FareInfo>
            </FareInfos>
          </PTC_FareBreakdown>
        </PTC_FareBreakdowns>
        <FareInfos>
          <FareInfo>
            <FareReference>W</FareReference>
            <TPA_Extensions>
              <SeatsRemaining BelowMin="false" Number="9"/>
              <Cabin Cabin="Y"/>
              <Meal Code="N"/>
            </TPA_Extensions>
          </FareInfo>
          <FareInfo>
            <FareReference>W</FareReference>
            <TPA_Extensions>
              <SeatsRemaining BelowMin="false" Number="9"/>
              <Cabin Cabin="Y"/>
              <Meal Code="N"/>
            </TPA_Extensions>
          </FareInfo>
        </FareInfos>
        <TPA_Extensions>
          <DivideInParty Indicator="false"/>
          <AncillaryFeeGroups>
            <AncillaryFeeGroup Code="BG" Name="BAGGAGE">
              <AncillaryFeeItem Amount="2500" AncillaryTypeCode="F" BaggageID="1" Carrier="U6" Date="2020-09-01" Description="FIRST EXCESS BAG" Description1="FIRST BAG" DestinationAirport="AER" EndSegment="1" OriginAirport="ZIA" PassengerCode="ALL" StartSegment="1" Subcode="0CC"/>
              <AncillaryFeeItem Amount="2500" AncillaryTypeCode="F" BaggageID="2" Carrier="U6" Date="2020-09-01" Description="SECOND EXCESS BAG" Description1="SECOND BAG" DestinationAirport="AER" EndSegment="1" OriginAirport="ZIA" PassengerCode="ALL" StartSegment="1" Subcode="0CD"/>
              <AncillaryFeeItem Amount="2500" AncillaryTypeCode="F" BaggageID="3" Carrier="U6" Date="2020-09-01" Description="THIRD EXCESS BAG" Description1="THIRD BAG" DestinationAirport="AER" EndSegment="1" OriginAirport="ZIA" PassengerCode="ALL" StartSegment="1" Subcode="0CE"/>
              <AncillaryFeeItem Amount="2000" AncillaryTypeCode="F" BaggageID="4" Carrier="U6" Date="2020-09-01" Description="UPTO22LB 10KG BAGGAGE" Description1="UP TO 22 POUNDS/10 KILOGRAMS" DestinationAirport="AER" EndSegment="1" OriginAirport="ZIA" PassengerCode="ALL" StartSegment="1" Subcode="0CZ"/>
              <AncillaryFeeItem Amount="2000" AncillaryTypeCode="F" BaggageID="5" Carrier="U6" Date="2020-09-01" Description="EXCESS WEIGHT SPECIAL CHARGE" Description1="EXCESS WEIGHT" Description2="SPECIAL CHARGE" DestinationAirport="AER" EndSegment="1" OriginAirport="ZIA" PassengerCode="ALL" StartSegment="1" Subcode="0H6"/>
              <AncillaryFeeItem Amount="2500" AncillaryTypeCode="F" BaggageID="6" Carrier="U6" Date="2020-09-01" Description="EXTRA CARRYON BG" Description1="EXCESS SIZE" Description2="SPECIAL CHARGE" DestinationAirport="AER" EndSegment="1" OriginAirport="ZIA" PassengerCode="ALL" StartSegment="1" Subcode="0H7"/>
              <AncillaryFeeItem Amount="2500" AncillaryTypeCode="F" BaggageID="7" Carrier="U6" Date="2020-09-01" Description="CARRY ON HAND BAGGAGE" DestinationAirport="AER" EndSegment="1" OriginAirport="ZIA" PassengerCode="ALL" StartSegment="1" Subcode="0L5" Subgroup="CY"/>
              <AncillaryFeeItem Amount="2500" AncillaryTypeCode="F" BaggageID="8" Carrier="U6" Date="2020-09-08" Description="FIRST EXCESS BAG" Description1="FIRST BAG" DestinationAirport="ZIA" EndSegment="2" OriginAirport="AER" PassengerCode="ALL" StartSegment="2" Subcode="0CC"/>
              <AncillaryFeeItem Amount="2500" AncillaryTypeCode="F" BaggageID="9" Carrier="U6" Date="2020-09-08" Description="SECOND EXCESS BAG" Description1="SECOND BAG" DestinationAirport="ZIA" EndSegment="2" OriginAirport="AER" PassengerCode="ALL" StartSegment="2" Subcode="0CD"/>
              <AncillaryFeeItem Amount="2500" AncillaryTypeCode="F" BaggageID="10" Carrier="U6" Date="2020-09-08" Description="THIRD EXCESS BAG" Description1="THIRD BAG" DestinationAirport="ZIA" EndSegment="2" OriginAirport="AER" PassengerCode="ALL" StartSegment="2" Subcode="0CE"/>
              <AncillaryFeeItem Amount="2000" AncillaryTypeCode="F" BaggageID="11" Carrier="U6" Date="2020-09-08" Description="UPTO22LB 10KG BAGGAGE" Description1="UP TO 22 POUNDS/10 KILOGRAMS" DestinationAirport="ZIA" EndSegment="2" OriginAirport="AER" PassengerCode="ALL" StartSegment="2" Subcode="0CZ"/>
              <AncillaryFeeItem Amount="2000" AncillaryTypeCode="F" BaggageID="12" Carrier="U6" Date="2020-09-08" Description="EXCESS WEIGHT SPECIAL CHARGE" Description1="EXCESS WEIGHT" Description2="SPECIAL CHARGE" DestinationAirport="ZIA" EndSegment="2" OriginAirport="AER" PassengerCode="ALL" StartSegment="2" Subcode="0H6"/>
              <AncillaryFeeItem Amount="2500" AncillaryTypeCode="F" BaggageID="13" Carrier="U6" Date="2020-09-08" Description="EXTRA CARRYON BG" Description1="EXCESS SIZE" Description2="SPECIAL CHARGE" DestinationAirport="ZIA" EndSegment="2" OriginAirport="AER" PassengerCode="ALL" StartSegment="2" Subcode="0H7"/>
              <AncillaryFeeItem Amount="2500" AncillaryTypeCode="F" BaggageID="14" Carrier="U6" Date="2020-09-08" Description="CARRY ON HAND BAGGAGE" DestinationAirport="ZIA" EndSegment="2" OriginAirport="AER" PassengerCode="ALL" StartSegment="2" Subcode="0L5" Subgroup="CY"/>
            </AncillaryFeeGroup>
            <OrderStandardBag>
              <PassengerBags Code="ADT">
                <BaggageSequenceOrder BaggageID="1" StandardBag="1"/>
                <BaggageSequenceOrder BaggageID="2" StandardBag="2"/>
                <BaggageSequenceOrder BaggageID="3" StandardBag="3"/>
                <BaggageSequenceOrder BaggageID="8" StandardBag="1"/>
                <BaggageSequenceOrder BaggageID="9" StandardBag="2"/>
                <BaggageSequenceOrder BaggageID="10" StandardBag="3"/>
              </PassengerBags>
              <PassengerBags Code="CNN">
                <BaggageSequenceOrder BaggageID="1" StandardBag="1"/>
                <BaggageSequenceOrder BaggageID="2" StandardBag="2"/>
                <BaggageSequenceOrder BaggageID="3" StandardBag="3"/>
                <BaggageSequenceOrder BaggageID="8" StandardBag="1"/>
                <BaggageSequenceOrder BaggageID="9" StandardBag="2"/>
                <BaggageSequenceOrder BaggageID="10" StandardBag="3"/>
              </PassengerBags>
              <PassengerBags Code="INF">
                <BaggageSequenceOrder BaggageID="1" StandardBag="1"/>
                <BaggageSequenceOrder BaggageID="2" StandardBag="2"/>
                <BaggageSequenceOrder BaggageID="3" StandardBag="3"/>
                <BaggageSequenceOrder BaggageID="8" StandardBag="1"/>
                <BaggageSequenceOrder BaggageID="9" StandardBag="2"/>
                <BaggageSequenceOrder BaggageID="10" StandardBag="3"/>
              </PassengerBags>
            </OrderStandardBag>
          </AncillaryFeeGroups>
          <ValidatingCarrier NewVcxProcess="true" SettlementMethod="BSP">
            <Default Code="U6"/>
          </ValidatingCarrier>
          <ValidatingCarrier NewVcxProcess="true" SettlementMethod="TCH">
            <Default Code="U6"/>
          </ValidatingCarrier>
          <ValidatingCarrier NewVcxProcess="true" SettlementMethod="GEN">
            <Default Code="U6"/>
          </ValidatingCarrier>
        </TPA_Extensions>
      </AirItineraryPricingInfo>
      <TicketingInfo TicketType="eTicket" ValidInterline="Yes"/>
      <TPA_Extensions>
        <ValidatingCarrier Code="U6"/>
        <DiversitySwapper WeighedPriceAmount="14065.6"/>
      </TPA_Extensions>
    </PricedItinerary>
    <!--Другие варианты перелетов-->
  </PricedItineraries>
  <OneWayItineraries>
    <SimpleOneWayItineraries RPH="1">
      <PricedItinerary SequenceNumber="1">
        <AirItinerary DirectionInd="OneWay">
          <OriginDestinationOptions>
            <OriginDestinationOption ArrivalCountry="RU" DepartureCountry="RU" ElapsedTime="135">
              <FlightSegment ArrivalDateTime="2020-09-01T21:25:00" DepartureDateTime="2020-09-01T19:10:00" ElapsedTime="135" FlightNumber="307" ResBookDesigCode="W" StopQuantity="0">
                <DepartureAirport LocationCode="ZIA"/>
                <ArrivalAirport LocationCode="AER"/>
                <OperatingAirline Code="U6" FlightNumber="307"/>
                <Equipment AirEquipType="320"/>
                <MarketingAirline Code="U6"/>
                <MarriageGrp>O</MarriageGrp>
                <DepartureTimeZone GMTOffset="3"/>
                <ArrivalTimeZone GMTOffset="3"/>
                <TPA_Extensions>
                  <eTicket Ind="true"/>
                  <Mileage Amount="840"/>
                </TPA_Extensions>
              </FlightSegment>
            </OriginDestinationOption>
          </OriginDestinationOptions>
        </AirItinerary>
        <AirItineraryPricingInfo BrandsOnAnyMarket="true" FareReturned="true" LastTicketDate="2020-05-13" LastTicketTime="23:59" PricingSource="ADVJR1" PricingSubSource="MIP">
          <ItinTotalFare>
            <BaseFare Amount="4510" CurrencyCode="RUB" DecimalPlaces="0"/>
            <FareConstruction Amount="4510" CurrencyCode="RUB" DecimalPlaces="0"/>
            <EquivFare Amount="4510" CurrencyCode="RUB" DecimalPlaces="0"/>
            <Taxes>
              <Tax Amount="8138" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="TOTALTAX"/>
            </Taxes>
            <TotalFare Amount="12648" CurrencyCode="RUB" DecimalPlaces="0"/>
          </ItinTotalFare>
          <PTC_FareBreakdowns>
            <PTC_FareBreakdown>
              <PassengerTypeQuantity Code="ADT" Quantity="2"/>
              <FareBasisCodes>
                <FareBasisCode ArrivalAirportCode="AER" AvailabilityBreak="true" BookingCode="W" DepartureAirportCode="ZIA" FareComponentBeginAirport="ZIA" FareComponentDirectionality="FROM" FareComponentEndAirport="AER" FareComponentFareRule="U6PR" FareComponentFareTariff="304" FareComponentFareType="XPN" FareComponentFareTypeBitmap="00" FareComponentVendorCode="ATP" GovCarrier="U6">WPROW</FareBasisCode>
              </FareBasisCodes>
              <PassengerFare>
                <BaseFare Amount="1640" CurrencyCode="RUB"/>
                <FareConstruction Amount="1640" CurrencyCode="RUB" DecimalPlaces="0"/>
                <EquivFare Amount="1640" CurrencyCode="RUB" DecimalPlaces="0"/>
                <Taxes>
                  <Tax Amount="2150" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                  <Tax Amount="400" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRI"/>
                  <Tax Amount="75" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                  <Tax Amount="120" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI4"/>
                  <TaxSummary Amount="2150" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                  <TaxSummary Amount="400" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRI"/>
                  <TaxSummary Amount="195" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                  <TotalTax Amount="2745" CurrencyCode="RUB" DecimalPlaces="0"/>
                </Taxes>
                <TotalFare Amount="4385" CurrencyCode="RUB"/>
                <PenaltiesInfo>
                  <Penalty Amount="3000" Applicability="Before" Changeable="true" ConditionsApply="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                  <Penalty Applicability="After" Changeable="false" Type="Exchange"/>
                  <Penalty Applicability="Before" Refundable="false" Type="Refund"/>
                  <Penalty Applicability="After" Refundable="false" Type="Refund"/>
                </PenaltiesInfo>
                <TPA_Extensions>
                  <FareComponents>
                    <FareComponent BrandID="PR" BrandName="PROMO" ProgramCode="CFFU6" ProgramDescription="U6 DOMESTIC" ProgramID="83326" ProgramSystemCode="A">
                      <Segment FlightIndex="1" LegIndex="1"/>
                      <BrandFeatureRef FeatureId="13"/>
                      <BrandFeatureRef FeatureId="16"/>
                      <BrandFeatureRef FeatureId="20"/>
                      <BrandFeatureRef FeatureId="21"/>
                      <BrandFeatureRef FeatureId="33"/>
                      <BrandFeatureRef FeatureId="34"/>
                      <BrandFeatureRef FeatureId="70"/>
                      <BrandFeatureRef FeatureId="68"/>
                      <BrandFeatureRef FeatureId="50"/>
                      <BrandFeatureRef FeatureId="45"/>
                      <BrandFeatureRef FeatureId="48"/>
                      <BrandFeatureRef FeatureId="74"/>
                      <BrandFeatureRef FeatureId="77"/>
                      <BrandFeatureRef FeatureId="83"/>
                      <BrandFeatureRef FeatureId="85"/>
                    </FareComponent>
                  </FareComponents>
                  <Messages>
                    <Message AirlineCode="U6" FailCode="0" Info="NONEND" Type="N"/>
                    <Message FailCode="0" Info="VALIDATING CARRIER" Type="W"/>
                    <Message FailCode="0" Info="BSP - U6" Type="W"/>
                    <Message FailCode="0" Info="GEN - U6" Type="W"/>
                    <Message FailCode="0" Info="TCH - U6" Type="W"/>
                    <Message FailCode="0" Info="CAT 15 SALES RESTRICTIONS FREE TEXT FOUND - VERIFY RULES" Type="W"/>
                  </Messages>
                  <BaggageInformationList>
                    <BaggageInformation AirlineCode="U6" ProvisionType="A">
                      <Segment Id="0"/>
                      <Allowance Unit="kg" Weight="10"/>
                    </BaggageInformation>
                  </BaggageInformationList>
                </TPA_Extensions>
              </PassengerFare>
              <Endorsements NonRefundableIndicator="true"/>
              <TPA_Extensions>
                <FareCalcLine Info="ZIA U6 AER1640RUB1640END"/>
              </TPA_Extensions>
              <FareInfos>
                <FareInfo>
                  <FareReference>W</FareReference>
                  <TPA_Extensions>
                    <SeatsRemaining BelowMin="false" Number="9"/>
                    <Cabin Cabin="Y"/>
                    <Meal Code="N"/>
                  </TPA_Extensions>
                </FareInfo>
              </FareInfos>
            </PTC_FareBreakdown>
            <PTC_FareBreakdown>
              <PassengerTypeQuantity Code="CNN" Quantity="1"/>
              <FareBasisCodes>
                <FareBasisCode ArrivalAirportCode="AER" AvailabilityBreak="true" BookingCode="W" DepartureAirportCode="ZIA" FareComponentBeginAirport="ZIA" FareComponentDirectionality="FROM" FareComponentEndAirport="AER" FareComponentFareRule="U6PR" FareComponentFareTariff="304" FareComponentFareType="XPN" FareComponentFareTypeBitmap="01" FareComponentVendorCode="ATP" GovCarrier="U6">WPROW/CH25</FareBasisCode>
              </FareBasisCodes>
              <PassengerFare>
                <BaseFare Amount="1230" CurrencyCode="RUB"/>
                <FareConstruction Amount="1230" CurrencyCode="RUB" DecimalPlaces="0"/>
                <EquivFare Amount="1230" CurrencyCode="RUB" DecimalPlaces="0"/>
                <Taxes>
                  <Tax Amount="2150" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                  <Tax Amount="400" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRI"/>
                  <Tax Amount="38" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                  <Tax Amount="60" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI4"/>
                  <TaxSummary Amount="2150" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                  <TaxSummary Amount="400" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRI"/>
                  <TaxSummary Amount="98" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                  <TotalTax Amount="2648" CurrencyCode="RUB" DecimalPlaces="0"/>
                </Taxes>
                <TotalFare Amount="3878" CurrencyCode="RUB"/>
                <PenaltiesInfo>
                  <Penalty Amount="3000" Applicability="Before" Changeable="true" ConditionsApply="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                  <Penalty Applicability="After" Changeable="false" Type="Exchange"/>
                  <Penalty Applicability="Before" Refundable="false" Type="Refund"/>
                  <Penalty Applicability="After" Refundable="false" Type="Refund"/>
                </PenaltiesInfo>
                <TPA_Extensions>
                  <FareComponents>
                    <FareComponent BrandID="PR" BrandName="PROMO" ProgramCode="CFFU6" ProgramDescription="U6 DOMESTIC" ProgramID="83326" ProgramSystemCode="A">
                      <Segment FlightIndex="1" LegIndex="1"/>
                      <BrandFeatureRef FeatureId="13"/>
                      <BrandFeatureRef FeatureId="16"/>
                      <BrandFeatureRef FeatureId="20"/>
                      <BrandFeatureRef FeatureId="21"/>
                      <BrandFeatureRef FeatureId="33"/>
                      <BrandFeatureRef FeatureId="34"/>
                      <BrandFeatureRef FeatureId="70"/>
                      <BrandFeatureRef FeatureId="68"/>
                      <BrandFeatureRef FeatureId="50"/>
                      <BrandFeatureRef FeatureId="45"/>
                      <BrandFeatureRef FeatureId="48"/>
                      <BrandFeatureRef FeatureId="74"/>
                      <BrandFeatureRef FeatureId="77"/>
                      <BrandFeatureRef FeatureId="83"/>
                      <BrandFeatureRef FeatureId="85"/>
                    </FareComponent>
                  </FareComponents>
                  <Messages>
                    <Message AirlineCode="U6" FailCode="0" Info="NONEND" Type="N"/>
                    <Message FailCode="0" Info="EACH CNN REQUIRES ACCOMPANYING SAME CABIN ADT" Type="W"/>
                    <Message FailCode="0" Info="VALIDATING CARRIER" Type="W"/>
                    <Message FailCode="0" Info="BSP - U6" Type="W"/>
                    <Message FailCode="0" Info="GEN - U6" Type="W"/>
                    <Message FailCode="0" Info="TCH - U6" Type="W"/>
                    <Message FailCode="0" Info="CAT 15 SALES RESTRICTIONS FREE TEXT FOUND - VERIFY RULES" Type="W"/>
                  </Messages>
                  <BaggageInformationList>
                    <BaggageInformation AirlineCode="U6" ProvisionType="A">
                      <Segment Id="0"/>
                      <Allowance Unit="kg" Weight="10"/>
                    </BaggageInformation>
                  </BaggageInformationList>
                </TPA_Extensions>
              </PassengerFare>
              <Endorsements NonRefundableIndicator="true"/>
              <TPA_Extensions>
                <FareCalcLine Info="ZIA U6 AER1230RUB1230END"/>
              </TPA_Extensions>
              <FareInfos>
                <FareInfo>
                  <FareReference>W</FareReference>
                  <TPA_Extensions>
                    <SeatsRemaining BelowMin="false" Number="9"/>
                    <Cabin Cabin="Y"/>
                    <Meal Code="N"/>
                  </TPA_Extensions>
                </FareInfo>
              </FareInfos>
            </PTC_FareBreakdown>
            <PTC_FareBreakdown>
              <PassengerTypeQuantity Code="INF" Quantity="1"/>
              <FareBasisCodes>
                <FareBasisCode ArrivalAirportCode="AER" AvailabilityBreak="true" BookingCode="W" DepartureAirportCode="ZIA" FareComponentBeginAirport="ZIA" FareComponentDirectionality="FROM" FareComponentEndAirport="AER" FareComponentFareRule="U6PR" FareComponentFareTariff="304" FareComponentFareType="XPN" FareComponentFareTypeBitmap="01" FareComponentVendorCode="ATP" GovCarrier="U6">WPROW/IN</FareBasisCode>
              </FareBasisCodes>
              <PassengerFare>
                <BaseFare Amount="0" CurrencyCode="RUB"/>
                <FareConstruction Amount="0" CurrencyCode="RUB" DecimalPlaces="0"/>
                <EquivFare Amount="0" CurrencyCode="RUB" DecimalPlaces="0"/>
                <TotalFare Amount="0" CurrencyCode="RUB"/>
                <PenaltiesInfo>
                  <Penalty Amount="0" Applicability="Before" Changeable="true" ConditionsApply="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                  <Penalty Applicability="After" Changeable="false" Type="Exchange"/>
                  <Penalty Applicability="Before" Refundable="false" Type="Refund"/>
                  <Penalty Applicability="After" Refundable="false" Type="Refund"/>
                </PenaltiesInfo>
                <TPA_Extensions>
                  <FareComponents>
                    <FareComponent BrandID="PR" BrandName="PROMO" ProgramCode="CFFU6" ProgramDescription="U6 DOMESTIC" ProgramID="83326" ProgramSystemCode="A">
                      <Segment FlightIndex="1" LegIndex="1"/>
                      <BrandFeatureRef FeatureId="13"/>
                      <BrandFeatureRef FeatureId="16"/>
                      <BrandFeatureRef FeatureId="20"/>
                      <BrandFeatureRef FeatureId="21"/>
                      <BrandFeatureRef FeatureId="33"/>
                      <BrandFeatureRef FeatureId="34"/>
                      <BrandFeatureRef FeatureId="70"/>
                      <BrandFeatureRef FeatureId="68"/>
                      <BrandFeatureRef FeatureId="50"/>
                      <BrandFeatureRef FeatureId="45"/>
                      <BrandFeatureRef FeatureId="48"/>
                      <BrandFeatureRef FeatureId="74"/>
                      <BrandFeatureRef FeatureId="77"/>
                      <BrandFeatureRef FeatureId="83"/>
                      <BrandFeatureRef FeatureId="85"/>
                    </FareComponent>
                  </FareComponents>
                  <Messages>
                    <Message AirlineCode="U6" FailCode="0" Info="NONEND" Type="N"/>
                    <Message FailCode="0" Info="EACH INF REQUIRES ACCOMPANYING ADT PASSENGER" Type="W"/>
                    <Message FailCode="0" Info="VALIDATING CARRIER" Type="W"/>
                    <Message FailCode="0" Info="BSP - U6" Type="W"/>
                    <Message FailCode="0" Info="GEN - U6" Type="W"/>
                    <Message FailCode="0" Info="TCH - U6" Type="W"/>
                    <Message FailCode="0" Info="CAT 15 SALES RESTRICTIONS FREE TEXT FOUND - VERIFY RULES" Type="W"/>
                  </Messages>
                  <BaggageInformationList>
                    <BaggageInformation AirlineCode="U6" ProvisionType="A">
                      <Segment Id="0"/>
                      <Allowance Unit="kg" Weight="10"/>
                    </BaggageInformation>
                  </BaggageInformationList>
                </TPA_Extensions>
              </PassengerFare>
              <Endorsements NonRefundableIndicator="false"/>
              <TPA_Extensions>
                <FareCalcLine Info="ZIA U6 AER0RUB0END"/>
              </TPA_Extensions>
              <FareInfos>
                <FareInfo>
                  <FareReference>W</FareReference>
                  <TPA_Extensions>
                    <SeatsRemaining BelowMin="false" Number="9"/>
                    <Cabin Cabin="Y"/>
                    <Meal Code="N"/>
                  </TPA_Extensions>
                </FareInfo>
              </FareInfos>
            </PTC_FareBreakdown>
          </PTC_FareBreakdowns>
          <FareInfos>
            <FareInfo>
              <FareReference>W</FareReference>
              <TPA_Extensions>
                <SeatsRemaining BelowMin="false" Number="9"/>
                <Cabin Cabin="Y"/>
                <Meal Code="N"/>
              </TPA_Extensions>
            </FareInfo>
          </FareInfos>
          <TPA_Extensions>
            <DivideInParty Indicator="false"/>
            <AncillaryFeeGroups>
              <AncillaryFeeGroup Code="BG" Name="BAGGAGE">
                <AncillaryFeeItem Amount="2500" AncillaryTypeCode="F" BaggageID="1" Carrier="U6" Date="2020-09-01" Description="FIRST EXCESS BAG" Description1="FIRST BAG" DestinationAirport="AER" EndSegment="1" OriginAirport="ZIA" PassengerCode="ALL" StartSegment="1" Subcode="0CC"/>
                <AncillaryFeeItem Amount="2500" AncillaryTypeCode="F" BaggageID="2" Carrier="U6" Date="2020-09-01" Description="SECOND EXCESS BAG" Description1="SECOND BAG" DestinationAirport="AER" EndSegment="1" OriginAirport="ZIA" PassengerCode="ALL" StartSegment="1" Subcode="0CD"/>
                <AncillaryFeeItem Amount="2500" AncillaryTypeCode="F" BaggageID="3" Carrier="U6" Date="2020-09-01" Description="THIRD EXCESS BAG" Description1="THIRD BAG" DestinationAirport="AER" EndSegment="1" OriginAirport="ZIA" PassengerCode="ALL" StartSegment="1" Subcode="0CE"/>
                <AncillaryFeeItem Amount="2000" AncillaryTypeCode="F" BaggageID="4" Carrier="U6" Date="2020-09-01" Description="UPTO22LB 10KG BAGGAGE" Description1="UP TO 22 POUNDS/10 KILOGRAMS" DestinationAirport="AER" EndSegment="1" OriginAirport="ZIA" PassengerCode="ALL" StartSegment="1" Subcode="0CZ"/>
                <AncillaryFeeItem Amount="2000" AncillaryTypeCode="F" BaggageID="5" Carrier="U6" Date="2020-09-01" Description="EXCESS WEIGHT SPECIAL CHARGE" Description1="EXCESS WEIGHT" Description2="SPECIAL CHARGE" DestinationAirport="AER" EndSegment="1" OriginAirport="ZIA" PassengerCode="ALL" StartSegment="1" Subcode="0H6"/>
                <AncillaryFeeItem Amount="2500" AncillaryTypeCode="F" BaggageID="6" Carrier="U6" Date="2020-09-01" Description="EXTRA CARRYON BG" Description1="EXCESS SIZE" Description2="SPECIAL CHARGE" DestinationAirport="AER" EndSegment="1" OriginAirport="ZIA" PassengerCode="ALL" StartSegment="1" Subcode="0H7"/>
                <AncillaryFeeItem Amount="2500" AncillaryTypeCode="F" BaggageID="7" Carrier="U6" Date="2020-09-01" Description="CARRY ON HAND BAGGAGE" DestinationAirport="AER" EndSegment="1" OriginAirport="ZIA" PassengerCode="ALL" StartSegment="1" Subcode="0L5" Subgroup="CY"/>
              </AncillaryFeeGroup>
              <OrderStandardBag>
                <PassengerBags Code="ADT">
                  <BaggageSequenceOrder BaggageID="1" StandardBag="1"/>
                  <BaggageSequenceOrder BaggageID="2" StandardBag="2"/>
                  <BaggageSequenceOrder BaggageID="3" StandardBag="3"/>
                </PassengerBags>
                <PassengerBags Code="CNN">
                  <BaggageSequenceOrder BaggageID="1" StandardBag="1"/>
                  <BaggageSequenceOrder BaggageID="2" StandardBag="2"/>
                  <BaggageSequenceOrder BaggageID="3" StandardBag="3"/>
                </PassengerBags>
                <PassengerBags Code="INF">
                  <BaggageSequenceOrder BaggageID="1" StandardBag="1"/>
                  <BaggageSequenceOrder BaggageID="2" StandardBag="2"/>
                  <BaggageSequenceOrder BaggageID="3" StandardBag="3"/>
                </PassengerBags>
              </OrderStandardBag>
            </AncillaryFeeGroups>
            <ValidatingCarrier NewVcxProcess="true" SettlementMethod="BSP">
              <Default Code="U6"/>
            </ValidatingCarrier>
            <ValidatingCarrier NewVcxProcess="true" SettlementMethod="TCH">
              <Default Code="U6"/>
            </ValidatingCarrier>
            <ValidatingCarrier NewVcxProcess="true" SettlementMethod="GEN">
              <Default Code="U6"/>
            </ValidatingCarrier>
          </TPA_Extensions>
        </AirItineraryPricingInfo>
        <TicketingInfo TicketType="eTicket" ValidInterline="Yes"/>
        <TPA_Extensions>
          <ValidatingCarrier Code="U6"/>
          <DiversitySwapper WeighedPriceAmount="6534.8"/>
        </TPA_Extensions>
      </PricedItinerary>
      <!--Другие варианты перелетов-->
    </SimpleOneWayItineraries>
    <SimpleOneWayItineraries RPH="2">
      <PricedItinerary SequenceNumber="1">
        <AirItinerary DirectionInd="OneWay">
          <OriginDestinationOptions>
            <OriginDestinationOption ArrivalCountry="RU" DepartureCountry="RU" ElapsedTime="145">
              <FlightSegment ArrivalDateTime="2020-09-09T00:45:00" DepartureDateTime="2020-09-08T22:20:00" ElapsedTime="145" FlightNumber="308" ResBookDesigCode="W" StopQuantity="0">
                <DepartureAirport LocationCode="AER"/>
                <ArrivalAirport LocationCode="ZIA"/>
                <OperatingAirline Code="U6" FlightNumber="308"/>
                <Equipment AirEquipType="320"/>
                <MarketingAirline Code="U6"/>
                <MarriageGrp>O</MarriageGrp>
                <DepartureTimeZone GMTOffset="3"/>
                <ArrivalTimeZone GMTOffset="3"/>
                <TPA_Extensions>
                  <eTicket Ind="true"/>
                  <Mileage Amount="840"/>
                </TPA_Extensions>
              </FlightSegment>
            </OriginDestinationOption>
          </OriginDestinationOptions>
        </AirItinerary>
        <AirItineraryPricingInfo BrandsOnAnyMarket="true" FareReturned="true" LastTicketDate="2020-05-13" LastTicketTime="23:59" PricingSource="ADVJR1" PricingSubSource="MIP">
          <ItinTotalFare>
            <BaseFare Amount="4510" CurrencyCode="RUB" DecimalPlaces="0"/>
            <FareConstruction Amount="4510" CurrencyCode="RUB" DecimalPlaces="0"/>
            <EquivFare Amount="4510" CurrencyCode="RUB" DecimalPlaces="0"/>
            <Taxes>
              <Tax Amount="8138" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="TOTALTAX"/>
            </Taxes>
            <TotalFare Amount="12648" CurrencyCode="RUB" DecimalPlaces="0"/>
          </ItinTotalFare>
          <PTC_FareBreakdowns>
            <PTC_FareBreakdown>
              <PassengerTypeQuantity Code="ADT" Quantity="2"/>
              <FareBasisCodes>
                <FareBasisCode ArrivalAirportCode="ZIA" AvailabilityBreak="true" BookingCode="W" DepartureAirportCode="AER" FareComponentBeginAirport="AER" FareComponentDirectionality="FROM" FareComponentEndAirport="ZIA" FareComponentFareRule="U6PR" FareComponentFareTariff="304" FareComponentFareType="XPN" FareComponentFareTypeBitmap="00" FareComponentVendorCode="ATP" GovCarrier="U6">WPROW</FareBasisCode>
              </FareBasisCodes>
              <PassengerFare>
                <BaseFare Amount="1640" CurrencyCode="RUB"/>
                <FareConstruction Amount="1640" CurrencyCode="RUB" DecimalPlaces="0"/>
                <EquivFare Amount="1640" CurrencyCode="RUB" DecimalPlaces="0"/>
                <Taxes>
                  <Tax Amount="2150" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                  <Tax Amount="400" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRI"/>
                  <Tax Amount="120" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                  <Tax Amount="75" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI4"/>
                  <TaxSummary Amount="2150" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                  <TaxSummary Amount="400" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRI"/>
                  <TaxSummary Amount="195" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                  <TotalTax Amount="2745" CurrencyCode="RUB" DecimalPlaces="0"/>
                </Taxes>
                <TotalFare Amount="4385" CurrencyCode="RUB"/>
                <PenaltiesInfo>
                  <Penalty Amount="3000" Applicability="Before" Changeable="true" ConditionsApply="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                  <Penalty Applicability="After" Changeable="false" Type="Exchange"/>
                  <Penalty Applicability="Before" Refundable="false" Type="Refund"/>
                  <Penalty Applicability="After" Refundable="false" Type="Refund"/>
                </PenaltiesInfo>
                <TPA_Extensions>
                  <FareComponents>
                    <FareComponent BrandID="PR" BrandName="PROMO" ProgramCode="CFFU6" ProgramDescription="U6 DOMESTIC" ProgramID="83326" ProgramSystemCode="A">
                      <Segment FlightIndex="1" LegIndex="1"/>
                      <BrandFeatureRef FeatureId="13"/>
                      <BrandFeatureRef FeatureId="16"/>
                      <BrandFeatureRef FeatureId="20"/>
                      <BrandFeatureRef FeatureId="21"/>
                      <BrandFeatureRef FeatureId="33"/>
                      <BrandFeatureRef FeatureId="34"/>
                      <BrandFeatureRef FeatureId="70"/>
                      <BrandFeatureRef FeatureId="68"/>
                      <BrandFeatureRef FeatureId="50"/>
                      <BrandFeatureRef FeatureId="45"/>
                      <BrandFeatureRef FeatureId="48"/>
                      <BrandFeatureRef FeatureId="74"/>
                      <BrandFeatureRef FeatureId="77"/>
                      <BrandFeatureRef FeatureId="83"/>
                      <BrandFeatureRef FeatureId="85"/>
                    </FareComponent>
                  </FareComponents>
                  <Messages>
                    <Message AirlineCode="U6" FailCode="0" Info="NONEND" Type="N"/>
                    <Message FailCode="0" Info="VALIDATING CARRIER" Type="W"/>
                    <Message FailCode="0" Info="BSP - U6" Type="W"/>
                    <Message FailCode="0" Info="GEN - U6" Type="W"/>
                    <Message FailCode="0" Info="TCH - U6" Type="W"/>
                    <Message FailCode="0" Info="CAT 15 SALES RESTRICTIONS FREE TEXT FOUND - VERIFY RULES" Type="W"/>
                  </Messages>
                  <BaggageInformationList>
                    <BaggageInformation AirlineCode="U6" ProvisionType="A">
                      <Segment Id="0"/>
                      <Allowance Unit="kg" Weight="10"/>
                    </BaggageInformation>
                  </BaggageInformationList>
                </TPA_Extensions>
              </PassengerFare>
              <Endorsements NonRefundableIndicator="true"/>
              <TPA_Extensions>
                <FareCalcLine Info="AER U6 ZIA1640RUB1640END"/>
              </TPA_Extensions>
              <FareInfos>
                <FareInfo>
                  <FareReference>W</FareReference>
                  <TPA_Extensions>
                    <SeatsRemaining BelowMin="false" Number="9"/>
                    <Cabin Cabin="Y"/>
                    <Meal Code="N"/>
                  </TPA_Extensions>
                </FareInfo>
              </FareInfos>
            </PTC_FareBreakdown>
            <PTC_FareBreakdown>
              <PassengerTypeQuantity Code="CNN" Quantity="1"/>
              <FareBasisCodes>
                <FareBasisCode ArrivalAirportCode="ZIA" AvailabilityBreak="true" BookingCode="W" DepartureAirportCode="AER" FareComponentBeginAirport="AER" FareComponentDirectionality="FROM" FareComponentEndAirport="ZIA" FareComponentFareRule="U6PR" FareComponentFareTariff="304" FareComponentFareType="XPN" FareComponentFareTypeBitmap="01" FareComponentVendorCode="ATP" GovCarrier="U6">WPROW/CH25</FareBasisCode>
              </FareBasisCodes>
              <PassengerFare>
                <BaseFare Amount="1230" CurrencyCode="RUB"/>
                <FareConstruction Amount="1230" CurrencyCode="RUB" DecimalPlaces="0"/>
                <EquivFare Amount="1230" CurrencyCode="RUB" DecimalPlaces="0"/>
                <Taxes>
                  <Tax Amount="2150" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                  <Tax Amount="400" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRI"/>
                  <Tax Amount="60" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                  <Tax Amount="38" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI4"/>
                  <TaxSummary Amount="2150" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                  <TaxSummary Amount="400" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRI"/>
                  <TaxSummary Amount="98" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                  <TotalTax Amount="2648" CurrencyCode="RUB" DecimalPlaces="0"/>
                </Taxes>
                <TotalFare Amount="3878" CurrencyCode="RUB"/>
                <PenaltiesInfo>
                  <Penalty Amount="3000" Applicability="Before" Changeable="true" ConditionsApply="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                  <Penalty Applicability="After" Changeable="false" Type="Exchange"/>
                  <Penalty Applicability="Before" Refundable="false" Type="Refund"/>
                  <Penalty Applicability="After" Refundable="false" Type="Refund"/>
                </PenaltiesInfo>
                <TPA_Extensions>
                  <FareComponents>
                    <FareComponent BrandID="PR" BrandName="PROMO" ProgramCode="CFFU6" ProgramDescription="U6 DOMESTIC" ProgramID="83326" ProgramSystemCode="A">
                      <Segment FlightIndex="1" LegIndex="1"/>
                      <BrandFeatureRef FeatureId="13"/>
                      <BrandFeatureRef FeatureId="16"/>
                      <BrandFeatureRef FeatureId="20"/>
                      <BrandFeatureRef FeatureId="21"/>
                      <BrandFeatureRef FeatureId="33"/>
                      <BrandFeatureRef FeatureId="34"/>
                      <BrandFeatureRef FeatureId="70"/>
                      <BrandFeatureRef FeatureId="68"/>
                      <BrandFeatureRef FeatureId="50"/>
                      <BrandFeatureRef FeatureId="45"/>
                      <BrandFeatureRef FeatureId="48"/>
                      <BrandFeatureRef FeatureId="74"/>
                      <BrandFeatureRef FeatureId="77"/>
                      <BrandFeatureRef FeatureId="83"/>
                      <BrandFeatureRef FeatureId="85"/>
                    </FareComponent>
                  </FareComponents>
                  <Messages>
                    <Message AirlineCode="U6" FailCode="0" Info="NONEND" Type="N"/>
                    <Message FailCode="0" Info="EACH CNN REQUIRES ACCOMPANYING SAME CABIN ADT" Type="W"/>
                    <Message FailCode="0" Info="VALIDATING CARRIER" Type="W"/>
                    <Message FailCode="0" Info="BSP - U6" Type="W"/>
                    <Message FailCode="0" Info="GEN - U6" Type="W"/>
                    <Message FailCode="0" Info="TCH - U6" Type="W"/>
                    <Message FailCode="0" Info="CAT 15 SALES RESTRICTIONS FREE TEXT FOUND - VERIFY RULES" Type="W"/>
                  </Messages>
                  <BaggageInformationList>
                    <BaggageInformation AirlineCode="U6" ProvisionType="A">
                      <Segment Id="0"/>
                      <Allowance Unit="kg" Weight="10"/>
                    </BaggageInformation>
                  </BaggageInformationList>
                </TPA_Extensions>
              </PassengerFare>
              <Endorsements NonRefundableIndicator="true"/>
              <TPA_Extensions>
                <FareCalcLine Info="AER U6 ZIA1230RUB1230END"/>
              </TPA_Extensions>
              <FareInfos>
                <FareInfo>
                  <FareReference>W</FareReference>
                  <TPA_Extensions>
                    <SeatsRemaining BelowMin="false" Number="9"/>
                    <Cabin Cabin="Y"/>
                    <Meal Code="N"/>
                  </TPA_Extensions>
                </FareInfo>
              </FareInfos>
            </PTC_FareBreakdown>
            <PTC_FareBreakdown>
              <PassengerTypeQuantity Code="INF" Quantity="1"/>
              <FareBasisCodes>
                <FareBasisCode ArrivalAirportCode="ZIA" AvailabilityBreak="true" BookingCode="W" DepartureAirportCode="AER" FareComponentBeginAirport="AER" FareComponentDirectionality="FROM" FareComponentEndAirport="ZIA" FareComponentFareRule="U6PR" FareComponentFareTariff="304" FareComponentFareType="XPN" FareComponentFareTypeBitmap="01" FareComponentVendorCode="ATP" GovCarrier="U6">WPROW/IN</FareBasisCode>
              </FareBasisCodes>
              <PassengerFare>
                <BaseFare Amount="0" CurrencyCode="RUB"/>
                <FareConstruction Amount="0" CurrencyCode="RUB" DecimalPlaces="0"/>
                <EquivFare Amount="0" CurrencyCode="RUB" DecimalPlaces="0"/>
                <TotalFare Amount="0" CurrencyCode="RUB"/>
                <PenaltiesInfo>
                  <Penalty Amount="0" Applicability="Before" Changeable="true" ConditionsApply="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                  <Penalty Applicability="After" Changeable="false" Type="Exchange"/>
                  <Penalty Applicability="Before" Refundable="false" Type="Refund"/>
                  <Penalty Applicability="After" Refundable="false" Type="Refund"/>
                </PenaltiesInfo>
                <TPA_Extensions>
                  <FareComponents>
                    <FareComponent BrandID="PR" BrandName="PROMO" ProgramCode="CFFU6" ProgramDescription="U6 DOMESTIC" ProgramID="83326" ProgramSystemCode="A">
                      <Segment FlightIndex="1" LegIndex="1"/>
                      <BrandFeatureRef FeatureId="13"/>
                      <BrandFeatureRef FeatureId="16"/>
                      <BrandFeatureRef FeatureId="20"/>
                      <BrandFeatureRef FeatureId="21"/>
                      <BrandFeatureRef FeatureId="33"/>
                      <BrandFeatureRef FeatureId="34"/>
                      <BrandFeatureRef FeatureId="70"/>
                      <BrandFeatureRef FeatureId="68"/>
                      <BrandFeatureRef FeatureId="50"/>
                      <BrandFeatureRef FeatureId="45"/>
                      <BrandFeatureRef FeatureId="48"/>
                      <BrandFeatureRef FeatureId="74"/>
                      <BrandFeatureRef FeatureId="77"/>
                      <BrandFeatureRef FeatureId="83"/>
                      <BrandFeatureRef FeatureId="85"/>
                    </FareComponent>
                  </FareComponents>
                  <Messages>
                    <Message AirlineCode="U6" FailCode="0" Info="NONEND" Type="N"/>
                    <Message FailCode="0" Info="EACH INF REQUIRES ACCOMPANYING ADT PASSENGER" Type="W"/>
                    <Message FailCode="0" Info="VALIDATING CARRIER" Type="W"/>
                    <Message FailCode="0" Info="BSP - U6" Type="W"/>
                    <Message FailCode="0" Info="GEN - U6" Type="W"/>
                    <Message FailCode="0" Info="TCH - U6" Type="W"/>
                    <Message FailCode="0" Info="CAT 15 SALES RESTRICTIONS FREE TEXT FOUND - VERIFY RULES" Type="W"/>
                  </Messages>
                  <BaggageInformationList>
                    <BaggageInformation AirlineCode="U6" ProvisionType="A">
                      <Segment Id="0"/>
                      <Allowance Unit="kg" Weight="10"/>
                    </BaggageInformation>
                  </BaggageInformationList>
                </TPA_Extensions>
              </PassengerFare>
              <Endorsements NonRefundableIndicator="false"/>
              <TPA_Extensions>
                <FareCalcLine Info="AER U6 ZIA0RUB0END"/>
              </TPA_Extensions>
              <FareInfos>
                <FareInfo>
                  <FareReference>W</FareReference>
                  <TPA_Extensions>
                    <SeatsRemaining BelowMin="false" Number="9"/>
                    <Cabin Cabin="Y"/>
                    <Meal Code="N"/>
                  </TPA_Extensions>
                </FareInfo>
              </FareInfos>
            </PTC_FareBreakdown>
          </PTC_FareBreakdowns>
          <FareInfos>
            <FareInfo>
              <FareReference>W</FareReference>
              <TPA_Extensions>
                <SeatsRemaining BelowMin="false" Number="9"/>
                <Cabin Cabin="Y"/>
                <Meal Code="N"/>
              </TPA_Extensions>
            </FareInfo>
          </FareInfos>
          <TPA_Extensions>
            <DivideInParty Indicator="false"/>
            <AncillaryFeeGroups>
              <AncillaryFeeGroup Code="BG" Name="BAGGAGE">
                <AncillaryFeeItem Amount="2500" AncillaryTypeCode="F" BaggageID="1" Carrier="U6" Date="2020-09-08" Description="FIRST EXCESS BAG" Description1="FIRST BAG" DestinationAirport="ZIA" EndSegment="1" OriginAirport="AER" PassengerCode="ALL" StartSegment="1" Subcode="0CC"/>
                <AncillaryFeeItem Amount="2500" AncillaryTypeCode="F" BaggageID="2" Carrier="U6" Date="2020-09-08" Description="SECOND EXCESS BAG" Description1="SECOND BAG" DestinationAirport="ZIA" EndSegment="1" OriginAirport="AER" PassengerCode="ALL" StartSegment="1" Subcode="0CD"/>
                <AncillaryFeeItem Amount="2500" AncillaryTypeCode="F" BaggageID="3" Carrier="U6" Date="2020-09-08" Description="THIRD EXCESS BAG" Description1="THIRD BAG" DestinationAirport="ZIA" EndSegment="1" OriginAirport="AER" PassengerCode="ALL" StartSegment="1" Subcode="0CE"/>
                <AncillaryFeeItem Amount="2000" AncillaryTypeCode="F" BaggageID="4" Carrier="U6" Date="2020-09-08" Description="UPTO22LB 10KG BAGGAGE" Description1="UP TO 22 POUNDS/10 KILOGRAMS" DestinationAirport="ZIA" EndSegment="1" OriginAirport="AER" PassengerCode="ALL" StartSegment="1" Subcode="0CZ"/>
                <AncillaryFeeItem Amount="2000" AncillaryTypeCode="F" BaggageID="5" Carrier="U6" Date="2020-09-08" Description="EXCESS WEIGHT SPECIAL CHARGE" Description1="EXCESS WEIGHT" Description2="SPECIAL CHARGE" DestinationAirport="ZIA" EndSegment="1" OriginAirport="AER" PassengerCode="ALL" StartSegment="1" Subcode="0H6"/>
                <AncillaryFeeItem Amount="2500" AncillaryTypeCode="F" BaggageID="6" Carrier="U6" Date="2020-09-08" Description="EXTRA CARRYON BG" Description1="EXCESS SIZE" Description2="SPECIAL CHARGE" DestinationAirport="ZIA" EndSegment="1" OriginAirport="AER" PassengerCode="ALL" StartSegment="1" Subcode="0H7"/>
                <AncillaryFeeItem Amount="2500" AncillaryTypeCode="F" BaggageID="7" Carrier="U6" Date="2020-09-08" Description="CARRY ON HAND BAGGAGE" DestinationAirport="ZIA" EndSegment="1" OriginAirport="AER" PassengerCode="ALL" StartSegment="1" Subcode="0L5" Subgroup="CY"/>
              </AncillaryFeeGroup>
              <OrderStandardBag>
                <PassengerBags Code="ADT">
                  <BaggageSequenceOrder BaggageID="1" StandardBag="1"/>
                  <BaggageSequenceOrder BaggageID="2" StandardBag="2"/>
                  <BaggageSequenceOrder BaggageID="3" StandardBag="3"/>
                </PassengerBags>
                <PassengerBags Code="CNN">
                  <BaggageSequenceOrder BaggageID="1" StandardBag="1"/>
                  <BaggageSequenceOrder BaggageID="2" StandardBag="2"/>
                  <BaggageSequenceOrder BaggageID="3" StandardBag="3"/>
                </PassengerBags>
                <PassengerBags Code="INF">
                  <BaggageSequenceOrder BaggageID="1" StandardBag="1"/>
                  <BaggageSequenceOrder BaggageID="2" StandardBag="2"/>
                  <BaggageSequenceOrder BaggageID="3" StandardBag="3"/>
                </PassengerBags>
              </OrderStandardBag>
            </AncillaryFeeGroups>
            <ValidatingCarrier NewVcxProcess="true" SettlementMethod="BSP">
              <Default Code="U6"/>
            </ValidatingCarrier>
            <ValidatingCarrier NewVcxProcess="true" SettlementMethod="TCH">
              <Default Code="U6"/>
            </ValidatingCarrier>
            <ValidatingCarrier NewVcxProcess="true" SettlementMethod="GEN">
              <Default Code="U6"/>
            </ValidatingCarrier>
          </TPA_Extensions>
        </AirItineraryPricingInfo>
        <TicketingInfo TicketType="eTicket" ValidInterline="Yes"/>
        <TPA_Extensions>
          <ValidatingCarrier Code="U6"/>
          <DiversitySwapper WeighedPriceAmount="9551.42"/>
        </TPA_Extensions>
      </PricedItinerary>
      <!--Другие варианты перелетов-->
    </SimpleOneWayItineraries>
  </OneWayItineraries>
</OTA_AirLowFareSearchRS>
{% endxmlsec %}

---

{% xmlsec "Пример запроса (оформление на нескольких билетах (SOW), GIR ответ)", false %}
<OTA_AirLowFareSearchRQ ResponseType="GIR" Version="6.1.0" xmlns="http://www.opentravel.org/OTA/2003/05">
  <POS>
    <Source PseudoCityCode="9LSC">
      <RequestorID ID="1" Type="1">
        <CompanyName Code="TN"/>
      </RequestorID>
    </Source>
  </POS>
  <OriginDestinationInformation RPH="1">
    <DepartureDateTime>2020-09-01T11:00:00</DepartureDateTime>
    <OriginLocation LocationCode="MOW"/>
    <DestinationLocation LocationCode="AER"/>
  </OriginDestinationInformation>
  <OriginDestinationInformation RPH="2">
    <DepartureDateTime>2020-09-08T11:00:00</DepartureDateTime>
    <OriginLocation LocationCode="AER"/>
    <DestinationLocation LocationCode="MOW"/>
  </OriginDestinationInformation>
  <TravelPreferences ValidInterlineTicket="true">
    <CabinPref Cabin="Economy" PreferLevel="Preferred"/>
    <TPA_Extensions>
      <LongConnectTime Enable="true"/>
      <LongConnectPoints Max="3" Min="1"/>
      <KeepSameCabin Enabled="true"/>
      <ExcludeCallDirectCarriers Enabled="true"/>
      <DiversityParameters AdditionalNonStopsPercentage="100"/>
    </TPA_Extensions>
    <AncillaryFees Enable="true">
      <AncillaryFeeGroup Code="BG"/>
    </AncillaryFees>
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
    <IntelliSellTransaction>
      <RequestType Name="200ITINS"/>
    </IntelliSellTransaction>
    <MultiTicket DisplayPolicy="SOW"/>
  </TPA_Extensions>
</OTA_AirLowFareSearchRQ>
{% endxmlsec %}

{% xmlsec "Пример ответа", false %}
<GroupedItineraryResponse Version="6.1.0" xmlns="http://webservices.sabre.com/wsdl/sabreXML1.0.00/shopping/GroupedItineraryResponse" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <Message Code="TRANSACTIONID" Severity="Info" Text="7553855780338564863" Type="WORKERTHREAD"/>
  <Message Code="ASECT2LAPP00630.IDM.SGDCPROD.SABRE.COM" Severity="Info" Text="27037" Type="SERVER"/>
  <Message Code="RULEID" Severity="Info" Text="15936" Type="DRE"/>
  <Message Code="RULEID" Severity="Info" Text="24467" Type="DEFAULT"/>
  <Message Code="MSG" NumberOfOccurences="3" Severity="Info" Text="NO VALID COMBINATIONS FOUND" Type="MIP"/>
  <Message Code="PROCESS" NumberOfOccurences="3" Severity="Error" Text="No data from MIP Clients" Type="MIP"/>
  <Statistics Itineraries="294" OneWay="85"/>
  <ScheduleDesc ETicketable="true" ElapsedTime="140" Frequency="SMTW***" ID="1" Stops="0" TotalMilesFlown="847">
    <Departure Airport="AER" City="AER" Country="RU" Time="09:45:00+03:00"/>
    <Arrival Airport="VKO" City="MOW" Country="RU" Time="12:05:00+03:00"/>
    <Carrier Disclosure="DP" Marketing="H1" MarketingFlightNumber="1537" Operating="H1" OperatingFlightNumber="1537">
      <Equipment Code="737" TypeForFirstLeg="N" TypeForLastLeg="N"/>
    </Carrier>
  </ScheduleDesc>
  <ScheduleDesc ETicketable="true" ElapsedTime="135" Frequency="SMTWTFS" ID="2" Stops="0" TotalMilesFlown="847">
    <Departure Airport="AER" City="AER" Country="RU" Time="04:25:00+03:00"/>
    <Arrival Airport="VKO" City="MOW" Country="RU" Time="06:40:00+03:00"/>
    <Carrier Disclosure="DP" Marketing="H1" MarketingFlightNumber="1435" Operating="H1" OperatingFlightNumber="1435">
      <Equipment Code="737" TypeForFirstLeg="N" TypeForLastLeg="N"/>
    </Carrier>
  </ScheduleDesc>
  <ScheduleDesc ETicketable="true" ElapsedTime="150" Frequency="**T*T**" ID="3" Stops="0" TotalMilesFlown="831">
    <Departure Airport="DME" City="MOW" Country="RU" Time="10:20:00+03:00"/>
    <Arrival Airport="AER" City="AER" Country="RU" Time="12:50:00+03:00"/>
    <Carrier Marketing="U6" MarketingFlightNumber="377" Operating="U6" OperatingFlightNumber="377">
      <Equipment Code="320" TypeForFirstLeg="N" TypeForLastLeg="N"/>
    </Carrier>
  </ScheduleDesc>
  <ScheduleDesc ETicketable="true" ElapsedTime="120" Frequency="SMTWTFS" ID="4" Stops="0" TotalMilesFlown="840">
    <Departure Airport="AER" City="AER" Country="RU" Time="16:30:00+03:00"/>
    <Arrival Airport="ZIA" City="MOW" Country="RU" Time="18:30:00+03:00"/>
    <Carrier Marketing="U6" MarketingFlightNumber="1310" Operating="U6" OperatingFlightNumber="1310">
      <Equipment Code="320" TypeForFirstLeg="N" TypeForLastLeg="N"/>
    </Carrier>
  </ScheduleDesc>
  <ScheduleDesc ETicketable="true" ElapsedTime="140" Frequency="SMTWTFS" ID="5" Stops="0" TotalMilesFlown="847">
    <Departure Airport="AER" City="AER" Country="RU" Time="08:00:00+03:00"/>
    <Arrival Airport="VKO" City="MOW" Country="RU" Time="10:20:00+03:00"/>
    <Carrier Disclosure="DP" Marketing="H1" MarketingFlightNumber="1379" Operating="H1" OperatingFlightNumber="1379">
      <Equipment Code="737" TypeForFirstLeg="N" TypeForLastLeg="N"/>
    </Carrier>
  </ScheduleDesc>
  <!--Другие рейсы-->
  <TaxDesc Amount="810" Code="YQF" Currency="RUB" Description="SERVICE FEE - CARRIER-IMPOSED FUEL" ID="1" PublishedAmount="10.00" PublishedCurrency="EUR" Station="DME"/>
  <TaxDesc Amount="270" Code="YRF" Currency="RUB" Description="SERVICE FEE - CARRIER-IMPOSED FUEL" ID="2" PublishedAmount="270" PublishedCurrency="RUB" Station="AER"/>
  <TaxDesc Amount="190" Code="YQI" Currency="RUB" Description="SERVICE FEE - CARRIER-IMPOSED MISC" ID="3" PublishedAmount="190" PublishedCurrency="RUB" Station="SVO"/>
  <TaxDesc Amount="105" Code="RI4" Country="RU" Currency="RUB" Description="TERMINAL USE CHARGE DOMESTIC ARRIVAL" ID="4" PublishedAmount="105" PublishedCurrency="RUB" Station="AER"/>
  <TaxDesc Amount="1500" Code="YQF" Currency="RUB" Description="SERVICE FEE - CARRIER-IMPOSED FUEL" ID="5" PublishedAmount="1500" PublishedCurrency="RUB" Station="SVO"/>
  <!--Другие таксы-->
  <TaxSummaryDesc Amount="810" Code="YQF" Currency="RUB" Description="SERVICE FEE - CARRIER-IMPOSED FUEL" ID="1" PublishedAmount="10.00" PublishedCurrency="EUR" Station="DME"/>
  <TaxSummaryDesc Amount="450" Code="RI3" Country="RU" Currency="RUB" Description="TERMINAL USE CHARGE DOMESTIC DEPARTURE" ID="2" PublishedAmount="105" PublishedCurrency="RUB" Station="DME"/>
  <TaxSummaryDesc Amount="270" Code="YRF" Currency="RUB" Description="SERVICE FEE - CARRIER-IMPOSED FUEL" ID="3" PublishedAmount="270" PublishedCurrency="RUB" Station="AER"/>
  <TaxSummaryDesc Amount="304" Code="RI3" Country="RU" Currency="RUB" Description="TERMINAL USE CHARGE DOMESTIC DEPARTURE" ID="4" PublishedAmount="92" PublishedCurrency="RUB" Station="SVO"/>
  <TaxSummaryDesc Amount="190" Code="YQI" Currency="RUB" Description="SERVICE FEE - CARRIER-IMPOSED MISC" ID="5" PublishedAmount="190" PublishedCurrency="RUB" Station="SVO"/>
  <!--Другие таксы-->
  <BrandFeatureDesc Application="C" CommercialName="SECOND EXCESS BAG" ID="1" ServiceGroup="BG" ServiceType="C" SubCode="0CD" Vendor="ATP"/>
  <BrandFeatureDesc Application="C" CommercialName="UPGRADE AT CHECKIN TO COMFORT" ID="2" ServiceGroup="BF" ServiceType="Z" SubCode="UT2" Vendor="ATP"/>
  <BrandFeatureDesc Application="C" CommercialName="1ST FISHING EQPMT UPTO 20KG" ID="3" ServiceGroup="BG" ServiceType="C" SubCode="0L1" Vendor="ATP"/>
  <BrandFeatureDesc Application="C" CommercialName="SEAT ASSIGNMENT EXTRA SPACE" ID="4" ServiceGroup="SB" ServiceType="F" SubCode="0BV" Vendor="ATP"/>
  <BrandFeatureDesc Application="N" CommercialName="CARRY15KG 33LBUPTO 45LI 115LCM" ID="5" ServiceGroup="BG" ServiceType="C" SubCode="0MK" Vendor="ATP"/>
  <!--Другие услуги-->
  <FareComponentDesc ApplicablePricingCategories="1 4 5 8 10 12 15 16 18 19 23" Direction="EH" Directionality="FROM" FareAmount="1535" FareBasisCode="APROW/CH25" FareCurrency="RUB" FarePassengerType="CNN" FareRule="U6PR" FareTariff="304" FareType="XPN" FareTypeBitmap="01" GoverningCarrier="U6" ID="1" NotValidAfter="2020-09-01" NotValidBefore="2020-09-01" OneWayFare="true" PublishedFareAmount="1535" TicketDesignator="CH25" VendorCode="ATP">
    <Segment/>
    <Brand BrandName="PROMO" Code="PR" ProgramCode="CFFU6" ProgramDescription="U6 DOMESTIC" ProgramID="83326" ProgramSystemCode="A"/>
  </FareComponentDesc>
  <FareComponentDesc ApplicablePricingCategories="1 4 5 8 10 12 15 16 18 19 23" Direction="EH" Directionality="FROM" FareBasisCode="APRRT/IN" FarePassengerType="INF" FareRule="U6PR" FareTariff="304" FareType="XPN" FareTypeBitmap="01" GoverningCarrier="U6" ID="2" NotValidAfter="2020-09-30" PublishedFareAmount="0" TicketDesignator="IN" VendorCode="ATP">
    <Segment Stopover="true"/>
    <Brand BrandName="PROMO" Code="PR" ProgramCode="CFFU6" ProgramDescription="U6 DOMESTIC" ProgramID="83326" ProgramSystemCode="A"/>
  </FareComponentDesc>
  <FareComponentDesc ApplicablePricingCategories="10 16 19" Direction="EH" Directionality="FROM" FareAmount="5250" FareBasisCode="ENOR/CH25" FareCurrency="RUB" FarePassengerType="CNN" FareRule="ENR1" FareTariff="304" FareType="SBP" FareTypeBitmap="01" GoverningCarrier="SU" ID="3" NotValidAfter="2020-09-01" NotValidBefore="2020-09-01" OneWayFare="true" PublishedFareAmount="5250" TicketDesignator="CH25" VendorCode="ATP">
    <Segment/>
    <Brand BrandName="ECONOMY LITE" Code="NB" ProgramCode="CFF1S" ProgramDescription="1S" ProgramID="85965" ProgramSystemCode="X"/>
  </FareComponentDesc>
  <FareComponentDesc ApplicablePricingCategories="7 10 15 16 18" Direction="EH" Directionality="TO" FareAmount="3750" FareBasisCode="OLTRT" FareCurrency="RUB" FarePassengerType="ADT" FareRule="UT22" FareTariff="304" FareType="XEL" FareTypeBitmap="00" GoverningCarrier="UT" ID="4" NotValidAfter="2020-09-08" NotValidBefore="2020-09-08" PublishedFareAmount="7500" VendorCode="ATP">
    <Segment/>
    <Brand BrandName="ECONOMY MINIMUM" Code="MN" ProgramCode="BUT" ProgramDescription="BRANDED FARES UT 5" ProgramID="86060" ProgramSystemCode="B"/>
  </FareComponentDesc>
  <FareComponentDesc ApplicablePricingCategories="7 10 15 16 18 19" Direction="EH" Directionality="TO" FareAmount="2138" FareBasisCode="VLTRT/CH25" FareCurrency="RUB" FarePassengerType="CNN" FareRule="UT22" FareTariff="304" FareType="XEL" FareTypeBitmap="01" GoverningCarrier="UT" ID="5" NotValidAfter="2020-09-08" NotValidBefore="2020-09-08" PublishedFareAmount="4275" TicketDesignator="CH25" VendorCode="ATP">
    <Segment/>
    <Brand BrandName="ECONOMY MINIMUM" Code="MN" ProgramCode="BUT" ProgramDescription="BRANDED FARES UT 5" ProgramID="86060" ProgramSystemCode="B"/>
  </FareComponentDesc>
  <!--Другие компоненты тарифов-->
  <ValidatingCarrierDesc ID="1" NewVcxProcess="true" SettlementMethod="BSP">
    <Default Code="HR"/>
  </ValidatingCarrierDesc>
  <ValidatingCarrierDesc ID="2" NewVcxProcess="true" SettlementMethod="BSP">
    <Default Code="R3"/>
  </ValidatingCarrierDesc>
  <ValidatingCarrierDesc ID="3" NewVcxProcess="true" SettlementMethod="BSP">
    <Default Code="S7"/>
  </ValidatingCarrierDesc>
  <ValidatingCarrierDesc ID="4" NewVcxProcess="true" SettlementMethod="TCH">
    <Default Code="U6"/>
  </ValidatingCarrierDesc>
  <ValidatingCarrierDesc ID="5" NewVcxProcess="true" SettlementMethod="TCH">
    <Default Code="UT"/>
  </ValidatingCarrierDesc>
  <!--Другие валидирующие перевозчики-->
  <BaggageAllowanceDesc Description1="UP TO 44 POUNDS/20 KILOGRAMS" ID="1" Pieces="1"/>
  <BaggageAllowanceDesc ID="2" Pieces="0"/>
  <BaggageAllowanceDesc ID="3" Pieces="0"/>
  <BaggageAllowanceDesc ID="4" Pieces="0"/>
  <BaggageAllowanceDesc ID="5" Pieces="0"/>
  <!--Другие нормы провоза багажа-->
  <LegDesc ElapsedTime="145" ID="1">
    <Schedule Ref="66"/>
  </LegDesc>
  <LegDesc ElapsedTime="135" ID="2">
    <Schedule Ref="67"/>
  </LegDesc>
  <LegDesc ElapsedTime="150" ID="3">
    <Schedule Ref="64"/>
  </LegDesc>
  <LegDesc ElapsedTime="145" ID="4">
    <Schedule Ref="65"/>
  </LegDesc>
  <LegDesc ElapsedTime="140" ID="5">
    <Schedule Ref="68"/>
  </LegDesc>
  <!--Другие плечи-->
  <ItineraryGroup>
    <GroupDescription>
      <LegDescription ArrivalLocation="AER" DepartureDate="2020-09-01" DepartureLocation="DME"/>
      <LegDescription ArrivalLocation="DME" DepartureDate="2020-09-08" DepartureLocation="AER"/>
    </GroupDescription>
    <Itinerary ID="1" PricingSource="ADVJR1">
      <Leg Ref="25"/>
      <Leg Ref="14"/>
      <PricingInformation BrandsOnAnyMarket="true" PricingSubsource="MIP">
        <Fare ETicketable="true" GoverningCarriers="U6 U6" LastTicketDate="2020-05-13" LastTicketTime="23:59" VITA="true" ValidatingCarrierCode="U6">
          <PassengerInfo NonRefundable="true" PassengerNumber="2" PassengerType="ADT">
            <FareComponent Ref="69">
              <Segment AvailabilityBreak="true" BookingCode="W" CabinCode="Y" MealCode="N" SeatsAvailable="9"/>
              <BrandFeature Ref="49"/>
              <BrandFeature Ref="89"/>
              <BrandFeature Ref="32"/>
              <BrandFeature Ref="68"/>
              <BrandFeature Ref="43"/>
              <BrandFeature Ref="10"/>
              <BrandFeature Ref="46"/>
              <BrandFeature Ref="5"/>
              <BrandFeature Ref="42"/>
              <BrandFeature Ref="26"/>
              <BrandFeature Ref="56"/>
              <BrandFeature Ref="50"/>
              <BrandFeature Ref="16"/>
              <BrandFeature Ref="65"/>
              <BrandFeature Ref="38"/>
            </FareComponent>
            <FareComponent Ref="33">
              <Segment AvailabilityBreak="true" BookingCode="W" CabinCode="Y" MealCode="N" SeatsAvailable="9"/>
              <BrandFeature Ref="49"/>
              <BrandFeature Ref="89"/>
              <BrandFeature Ref="32"/>
              <BrandFeature Ref="68"/>
              <BrandFeature Ref="43"/>
              <BrandFeature Ref="10"/>
              <BrandFeature Ref="46"/>
              <BrandFeature Ref="5"/>
              <BrandFeature Ref="42"/>
              <BrandFeature Ref="26"/>
              <BrandFeature Ref="56"/>
              <BrandFeature Ref="50"/>
              <BrandFeature Ref="16"/>
              <BrandFeature Ref="65"/>
              <BrandFeature Ref="38"/>
            </FareComponent>
            <Tax Ref="13"/>
            <Tax Ref="8"/>
            <Tax Ref="53"/>
            <Tax Ref="10"/>
            <Tax Ref="37"/>
            <Tax Ref="42"/>
            <Tax Ref="4"/>
            <Tax Ref="14"/>
            <TaxSummary Ref="48"/>
            <TaxSummary Ref="74"/>
            <TaxSummary Ref="2"/>
            <CurrencyConversion ExchangeRateUsed="1" From="RUB" To="RUB"/>
            <FareMessage Carrier="U6" Code="0" Info="NONEND" Type="N"/>
            <FareMessage Code="0" Info="VALIDATING CARRIER" Type="W"/>
            <FareMessage Code="0" Info="BSP - U6" Type="W"/>
            <FareMessage Code="0" Info="GEN - U6" Type="W"/>
            <FareMessage Code="0" Info="TCH - U6" Type="W"/>
            <FareMessage Code="0" Info="CAT 15 SALES RESTRICTIONS FREE TEXT FOUND - VERIFY RULES" Type="W"/>
            <PassengerTotalFare BaseFareAmount="1280" BaseFareCurrency="RUB" CommissionAmount="0" CommissionPercentage="0" ConstructionAmount="1280" ConstructionCurrency="RUB" Currency="RUB" EquivalentAmount="1280" EquivalentCurrency="RUB" ExchangeRateOne="76.8000000" TotalFare="6830" TotalTaxes="5550"/>
            <BaggageInformation AirlineCode="U6" ProvisionType="A">
              <Segment ID="0"/>
              <Allowance Ref="11"/>
            </BaggageInformation>
            <BaggageInformation AirlineCode="U6" ProvisionType="A">
              <Segment ID="1"/>
              <Allowance Ref="11"/>
            </BaggageInformation>
            <PenaltiesInfo>
              <Penalty Amount="0" Applicability="Before" Changeable="true" ConditionsApply="true" Currency="RUB" Type="Exchange"/>
              <Penalty Amount="3000" Applicability="After" Changeable="true" ConditionsApply="true" Currency="RUB" Type="Exchange"/>
              <Penalty Applicability="Before" Refundable="false" Type="Refund"/>
              <Penalty Applicability="After" Refundable="false" Type="Refund"/>
            </PenaltiesInfo>
          </PassengerInfo>
          <PassengerInfo NonRefundable="true" PassengerNumber="1" PassengerType="CNN">
            <FareComponent Ref="163">
              <Segment AvailabilityBreak="true" BookingCode="W" CabinCode="Y" MealCode="N" SeatsAvailable="9"/>
              <BrandFeature Ref="49"/>
              <BrandFeature Ref="89"/>
              <BrandFeature Ref="32"/>
              <BrandFeature Ref="68"/>
              <BrandFeature Ref="43"/>
              <BrandFeature Ref="10"/>
              <BrandFeature Ref="46"/>
              <BrandFeature Ref="5"/>
              <BrandFeature Ref="42"/>
              <BrandFeature Ref="26"/>
              <BrandFeature Ref="56"/>
              <BrandFeature Ref="50"/>
              <BrandFeature Ref="16"/>
              <BrandFeature Ref="65"/>
              <BrandFeature Ref="38"/>
            </FareComponent>
            <FareComponent Ref="181">
              <Segment AvailabilityBreak="true" BookingCode="W" CabinCode="Y" MealCode="N" SeatsAvailable="9"/>
              <BrandFeature Ref="49"/>
              <BrandFeature Ref="89"/>
              <BrandFeature Ref="32"/>
              <BrandFeature Ref="68"/>
              <BrandFeature Ref="43"/>
              <BrandFeature Ref="10"/>
              <BrandFeature Ref="46"/>
              <BrandFeature Ref="5"/>
              <BrandFeature Ref="42"/>
              <BrandFeature Ref="26"/>
              <BrandFeature Ref="56"/>
              <BrandFeature Ref="50"/>
              <BrandFeature Ref="16"/>
              <BrandFeature Ref="65"/>
              <BrandFeature Ref="38"/>
            </FareComponent>
            <Tax Ref="13"/>
            <Tax Ref="8"/>
            <Tax Ref="53"/>
            <Tax Ref="10"/>
            <Tax Ref="29"/>
            <Tax Ref="15"/>
            <Tax Ref="38"/>
            <Tax Ref="19"/>
            <TaxSummary Ref="48"/>
            <TaxSummary Ref="74"/>
            <TaxSummary Ref="21"/>
            <CurrencyConversion ExchangeRateUsed="1" From="RUB" To="RUB"/>
            <FareMessage Carrier="U6" Code="0" Info="NONEND" Type="N"/>
            <FareMessage Code="0" Info="EACH CNN REQUIRES ACCOMPANYING SAME CABIN ADT" Type="W"/>
            <FareMessage Code="0" Info="VALIDATING CARRIER" Type="W"/>
            <FareMessage Code="0" Info="BSP - U6" Type="W"/>
            <FareMessage Code="0" Info="GEN - U6" Type="W"/>
            <FareMessage Code="0" Info="TCH - U6" Type="W"/>
            <FareMessage Code="0" Info="CAT 15 SALES RESTRICTIONS FREE TEXT FOUND - VERIFY RULES" Type="W"/>
            <PassengerTotalFare BaseFareAmount="960" BaseFareCurrency="RUB" CommissionAmount="0" CommissionPercentage="0" ConstructionAmount="960" ConstructionCurrency="RUB" Currency="RUB" EquivalentAmount="960" EquivalentCurrency="RUB" ExchangeRateOne="76.8000000" TotalFare="6286" TotalTaxes="5326"/>
            <BaggageInformation AirlineCode="U6" ProvisionType="A">
              <Segment ID="0"/>
              <Allowance Ref="11"/>
            </BaggageInformation>
            <BaggageInformation AirlineCode="U6" ProvisionType="A">
              <Segment ID="1"/>
              <Allowance Ref="11"/>
            </BaggageInformation>
            <PenaltiesInfo>
              <Penalty Amount="0" Applicability="Before" Changeable="true" ConditionsApply="true" Currency="RUB" Type="Exchange"/>
              <Penalty Amount="3000" Applicability="After" Changeable="true" ConditionsApply="true" Currency="RUB" Type="Exchange"/>
              <Penalty Applicability="Before" Refundable="false" Type="Refund"/>
              <Penalty Applicability="After" Refundable="false" Type="Refund"/>
            </PenaltiesInfo>
          </PassengerInfo>
          <PassengerInfo NonRefundable="false" PassengerNumber="1" PassengerType="INF">
            <FareComponent Ref="107">
              <Segment AvailabilityBreak="true" BookingCode="W" CabinCode="Y" MealCode="N" SeatsAvailable="9"/>
              <BrandFeature Ref="49"/>
              <BrandFeature Ref="89"/>
              <BrandFeature Ref="32"/>
              <BrandFeature Ref="68"/>
              <BrandFeature Ref="43"/>
              <BrandFeature Ref="10"/>
              <BrandFeature Ref="46"/>
              <BrandFeature Ref="5"/>
              <BrandFeature Ref="42"/>
              <BrandFeature Ref="26"/>
              <BrandFeature Ref="56"/>
              <BrandFeature Ref="50"/>
              <BrandFeature Ref="16"/>
              <BrandFeature Ref="65"/>
              <BrandFeature Ref="38"/>
            </FareComponent>
            <FareComponent Ref="136">
              <Segment AvailabilityBreak="true" BookingCode="W" CabinCode="Y" MealCode="N" SeatsAvailable="9"/>
              <BrandFeature Ref="49"/>
              <BrandFeature Ref="89"/>
              <BrandFeature Ref="32"/>
              <BrandFeature Ref="68"/>
              <BrandFeature Ref="43"/>
              <BrandFeature Ref="10"/>
              <BrandFeature Ref="46"/>
              <BrandFeature Ref="5"/>
              <BrandFeature Ref="42"/>
              <BrandFeature Ref="26"/>
              <BrandFeature Ref="56"/>
              <BrandFeature Ref="50"/>
              <BrandFeature Ref="16"/>
              <BrandFeature Ref="65"/>
              <BrandFeature Ref="38"/>
            </FareComponent>
            <CurrencyConversion ExchangeRateUsed="1" From="RUB" To="RUB"/>
            <FareMessage Carrier="U6" Code="0" Info="NONEND" Type="N"/>
            <FareMessage Code="0" Info="EACH INF REQUIRES ACCOMPANYING ADT PASSENGER" Type="W"/>
            <FareMessage Code="0" Info="VALIDATING CARRIER" Type="W"/>
            <FareMessage Code="0" Info="BSP - U6" Type="W"/>
            <FareMessage Code="0" Info="GEN - U6" Type="W"/>
            <FareMessage Code="0" Info="TCH - U6" Type="W"/>
            <FareMessage Code="0" Info="CAT 15 SALES RESTRICTIONS FREE TEXT FOUND - VERIFY RULES" Type="W"/>
            <PassengerTotalFare BaseFareAmount="0" BaseFareCurrency="RUB" CommissionAmount="0" CommissionPercentage="0" ConstructionAmount="0" ConstructionCurrency="RUB" Currency="RUB" EquivalentAmount="0" EquivalentCurrency="RUB" ExchangeRateOne="76.8000000" TotalFare="0" TotalTaxes="0"/>
            <BaggageInformation AirlineCode="U6" ProvisionType="A">
              <Segment ID="0"/>
              <Allowance Ref="11"/>
            </BaggageInformation>
            <BaggageInformation AirlineCode="U6" ProvisionType="A">
              <Segment ID="1"/>
              <Allowance Ref="11"/>
            </BaggageInformation>
            <PenaltiesInfo>
              <Penalty Amount="0" Applicability="Before" Changeable="true" ConditionsApply="true" Currency="RUB" Type="Exchange"/>
              <Penalty Amount="0" Applicability="After" Changeable="true" ConditionsApply="true" Currency="RUB" Type="Exchange"/>
              <Penalty Applicability="Before" Refundable="false" Type="Refund"/>
              <Penalty Applicability="After" Refundable="false" Type="Refund"/>
            </PenaltiesInfo>
          </PassengerInfo>
          <AncillaryFeeGroup>
            <AncillaryFee Code="BG" Name="BAGGAGE">
              <Details Amount="2500" AncillaryTypeCode="F" BaggageID="1" Carrier="U6" Code="ALL" DepartureDate="2020-09-01" Description="FIRST EXCESS BAG" Description1="FIRST BAG" Destination="AER" EndSegment="1" Origin="DME" StartSegment="1" Subcode="0CC"/>
              <Details Amount="2500" AncillaryTypeCode="F" BaggageID="2" Carrier="U6" Code="ALL" DepartureDate="2020-09-01" Description="SECOND EXCESS BAG" Description1="SECOND BAG" Destination="AER" EndSegment="1" Origin="DME" StartSegment="1" Subcode="0CD"/>
              <Details Amount="2500" AncillaryTypeCode="F" BaggageID="3" Carrier="U6" Code="ALL" DepartureDate="2020-09-01" Description="THIRD EXCESS BAG" Description1="THIRD BAG" Destination="AER" EndSegment="1" Origin="DME" StartSegment="1" Subcode="0CE"/>
              <Details Amount="2000" AncillaryTypeCode="F" BaggageID="4" Carrier="U6" Code="ALL" DepartureDate="2020-09-01" Description="UPTO22LB 10KG BAGGAGE" Description1="UP TO 22 POUNDS/10 KILOGRAMS" Destination="AER" EndSegment="1" Origin="DME" StartSegment="1" Subcode="0CZ"/>
              <Details Amount="2000" AncillaryTypeCode="F" BaggageID="5" Carrier="U6" Code="ALL" DepartureDate="2020-09-01" Description="EXCESS WEIGHT SPECIAL CHARGE" Description1="EXCESS WEIGHT" Description2="SPECIAL CHARGE" Destination="AER" EndSegment="1" Origin="DME" StartSegment="1" Subcode="0H6"/>
              <Details Amount="2500" AncillaryTypeCode="F" BaggageID="6" Carrier="U6" Code="ALL" DepartureDate="2020-09-01" Description="EXTRA CARRYON BG" Description1="EXCESS SIZE" Description2="SPECIAL CHARGE" Destination="AER" EndSegment="1" Origin="DME" StartSegment="1" Subcode="0H7"/>
              <Details Amount="2500" AncillaryTypeCode="F" BaggageID="7" Carrier="U6" Code="ALL" DepartureDate="2020-09-01" Description="CARRY ON HAND BAGGAGE" Destination="AER" EndSegment="1" Origin="DME" StartSegment="1" Subcode="0L5" Subgroup="CY"/>
              <Details Amount="2500" AncillaryTypeCode="F" BaggageID="8" Carrier="U6" Code="ALL" DepartureDate="2020-09-08" Description="FIRST EXCESS BAG" Description1="FIRST BAG" Destination="DME" EndSegment="2" Origin="AER" StartSegment="2" Subcode="0CC"/>
              <Details Amount="2500" AncillaryTypeCode="F" BaggageID="9" Carrier="U6" Code="ALL" DepartureDate="2020-09-08" Description="SECOND EXCESS BAG" Description1="SECOND BAG" Destination="DME" EndSegment="2" Origin="AER" StartSegment="2" Subcode="0CD"/>
              <Details Amount="2500" AncillaryTypeCode="F" BaggageID="10" Carrier="U6" Code="ALL" DepartureDate="2020-09-08" Description="THIRD EXCESS BAG" Description1="THIRD BAG" Destination="DME" EndSegment="2" Origin="AER" StartSegment="2" Subcode="0CE"/>
              <Details Amount="2000" AncillaryTypeCode="F" BaggageID="11" Carrier="U6" Code="ALL" DepartureDate="2020-09-08" Description="UPTO22LB 10KG BAGGAGE" Description1="UP TO 22 POUNDS/10 KILOGRAMS" Destination="DME" EndSegment="2" Origin="AER" StartSegment="2" Subcode="0CZ"/>
              <Details Amount="2000" AncillaryTypeCode="F" BaggageID="12" Carrier="U6" Code="ALL" DepartureDate="2020-09-08" Description="EXCESS WEIGHT SPECIAL CHARGE" Description1="EXCESS WEIGHT" Description2="SPECIAL CHARGE" Destination="DME" EndSegment="2" Origin="AER" StartSegment="2" Subcode="0H6"/>
              <Details Amount="2500" AncillaryTypeCode="F" BaggageID="13" Carrier="U6" Code="ALL" DepartureDate="2020-09-08" Description="EXTRA CARRYON BG" Description1="EXCESS SIZE" Description2="SPECIAL CHARGE" Destination="DME" EndSegment="2" Origin="AER" StartSegment="2" Subcode="0H7"/>
              <Details Amount="2500" AncillaryTypeCode="F" BaggageID="14" Carrier="U6" Code="ALL" DepartureDate="2020-09-08" Description="CARRY ON HAND BAGGAGE" Destination="DME" EndSegment="2" Origin="AER" StartSegment="2" Subcode="0L5" Subgroup="CY"/>
            </AncillaryFee>
            <OrderStandardBag>
              <PassengerBags Code="ADT">
                <BaggageSequenceOrder BaggageRef="1" StandardBag="1"/>
                <BaggageSequenceOrder BaggageRef="2" StandardBag="2"/>
                <BaggageSequenceOrder BaggageRef="3" StandardBag="3"/>
                <BaggageSequenceOrder BaggageRef="8" StandardBag="1"/>
                <BaggageSequenceOrder BaggageRef="9" StandardBag="2"/>
                <BaggageSequenceOrder BaggageRef="10" StandardBag="3"/>
              </PassengerBags>
              <PassengerBags Code="CNN">
                <BaggageSequenceOrder BaggageRef="1" StandardBag="1"/>
                <BaggageSequenceOrder BaggageRef="2" StandardBag="2"/>
                <BaggageSequenceOrder BaggageRef="3" StandardBag="3"/>
                <BaggageSequenceOrder BaggageRef="8" StandardBag="1"/>
                <BaggageSequenceOrder BaggageRef="9" StandardBag="2"/>
                <BaggageSequenceOrder BaggageRef="10" StandardBag="3"/>
              </PassengerBags>
              <PassengerBags Code="INF">
                <BaggageSequenceOrder BaggageRef="1" StandardBag="1"/>
                <BaggageSequenceOrder BaggageRef="2" StandardBag="2"/>
                <BaggageSequenceOrder BaggageRef="3" StandardBag="3"/>
                <BaggageSequenceOrder BaggageRef="8" StandardBag="1"/>
                <BaggageSequenceOrder BaggageRef="9" StandardBag="2"/>
                <BaggageSequenceOrder BaggageRef="10" StandardBag="3"/>
              </PassengerBags>
            </OrderStandardBag>
          </AncillaryFeeGroup>
          <TotalFare BaseFareAmount="3520" BaseFareCurrency="RUB" ConstructionAmount="3520" ConstructionCurrency="RUB" Currency="RUB" EquivalentAmount="3520" EquivalentCurrency="RUB" TotalPrice="19946" TotalTaxes="16426"/>
          <ValidatingCarrier Ref="14"/>
          <ValidatingCarrier Ref="4"/>
          <ValidatingCarrier Ref="6"/>
        </Fare>
      </PricingInformation>
      <DiversitySwapper WeighedPrice="13890.964"/>
    </Itinerary>
    <!--Другие варианты перелетов-->
  </ItineraryGroup>
  <!--Другие маршруты-->
</GroupedItineraryResponse>
{% endxmlsec %}

---

{% xmlsec "Пример запроса (оформление на нескольких билетах (SCHS), OTA ответ)", false %}
<OTA_AirLowFareSearchRQ ResponseType="OTA" Version="6.1.0" xmlns="http://www.opentravel.org/OTA/2003/05">
  <POS>
    <Source PseudoCityCode="9LSC">
      <RequestorID ID="1" Type="1">
        <CompanyName Code="TN"/>
      </RequestorID>
    </Source>
  </POS>
  <OriginDestinationInformation RPH="1">
    <DepartureDateTime>2020-09-01T11:00:00</DepartureDateTime>
    <OriginLocation LocationCode="MOW"/>
    <DestinationLocation LocationCode="AER"/>
  </OriginDestinationInformation>
  <OriginDestinationInformation RPH="2">
    <DepartureDateTime>2020-09-08T11:00:00</DepartureDateTime>
    <OriginLocation LocationCode="AER"/>
    <DestinationLocation LocationCode="MOW"/>
  </OriginDestinationInformation>
  <TravelPreferences ValidInterlineTicket="true">
    <CabinPref Cabin="Economy" PreferLevel="Preferred"/>
    <TPA_Extensions>
      <LongConnectTime Enable="true"/>
      <LongConnectPoints Max="3" Min="1"/>
      <KeepSameCabin Enabled="true"/>
      <ExcludeCallDirectCarriers Enabled="true"/>
      <DiversityParameters AdditionalNonStopsPercentage="100"/>
    </TPA_Extensions>
    <AncillaryFees Enable="true">
      <AncillaryFeeGroup Code="BG"/>
    </AncillaryFees>
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
    <IntelliSellTransaction>
      <RequestType Name="200ITINS"/>
    </IntelliSellTransaction>
    <MultiTicket DisplayPolicy="SCHS"/>
  </TPA_Extensions>
</OTA_AirLowFareSearchRQ>
{% endxmlsec %}

{% xmlsec "Пример ответа", false %}
<OTA_AirLowFareSearchRS AvailableItinCount="0" BrandedOneWayItinCount="0" DepartedItinCount="0" PricedItinCount="300" SimpleOneWayItinCount="0" SoldOutItinCount="0" Version="6.1.0" xmlns="http://www.opentravel.org/OTA/2003/05" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <Success/>
  <Warnings>
    <Warning Code="PROCESS" NumberOfOccurences="3" ShortText="No data from MIP Clients" Type="MIP"/>
    <Warning Code="TRANSACTIONID" MessageClass="I" ShortText="7553917931245893043" Type="WORKERTHREAD"/>
    <Warning Code="ASEPT2LAPP00306.IDM.SGDCPROD.SABRE.COM" MessageClass="I" ShortText="27037" Type="SERVER"/>
    <Warning Code="RULEID" MessageClass="I" ShortText="15936" Type="DRE"/>
    <Warning Code="RULEID" MessageClass="I" ShortText="24467" Type="DEFAULT"/>
    <Warning Code="MSG" MessageClass="I" NumberOfOccurences="3" ShortText="NO VALID COMBINATIONS FOUND" Type="MIP"/>
  </Warnings>
  <BrandFeatures>
    <BrandFeature Application="C" CommercialName="BASIC SEAT" Id="1" ServiceGroup="BF" ServiceType="Z" SubCode="050" Vendor="ATP"/>
    <BrandFeature Application="C" CommercialName="SEAT SELECTION DURING CHECK IN" Id="2" ServiceGroup="BF" ServiceType="Z" SubCode="050" Vendor="ATP"/>
    <BrandFeature Application="N" CommercialName="REFUNDABLE TICKET" Id="3" ServiceGroup="BF" ServiceType="Z" SubCode="056" Vendor="ATP"/>
    <BrandFeature Application="C" CommercialName="CHANGEABLE TICKET" Id="4" ServiceGroup="BF" ServiceType="Z" SubCode="059" Vendor="ATP"/>
    <BrandFeature Application="N" CommercialName="CHANGE ANYTIME" Id="5" ServiceGroup="BF" ServiceType="Z" SubCode="068" Vendor="ATP"/>
    <!--Другие услуги-->
  </BrandFeatures>
  <PricedItineraries>
    <PricedItinerary SequenceNumber="1">
      <AirItinerary DirectionInd="Return">
        <OriginDestinationOptions>
          <OriginDestinationOption ArrivalCountry="RU" DepartureCountry="RU" ElapsedTime="140">
            <FlightSegment ArrivalDateTime="2020-09-01T15:35:00" DepartureDateTime="2020-09-01T13:15:00" ElapsedTime="140" FlightNumber="1309" ResBookDesigCode="W" StopQuantity="0">
              <DepartureAirport LocationCode="ZIA"/>
              <ArrivalAirport LocationCode="AER"/>
              <OperatingAirline Code="U6" FlightNumber="1309"/>
              <Equipment AirEquipType="320"/>
              <MarketingAirline Code="U6"/>
              <MarriageGrp>O</MarriageGrp>
              <DepartureTimeZone GMTOffset="3"/>
              <ArrivalTimeZone GMTOffset="3"/>
              <TPA_Extensions>
                <eTicket Ind="true"/>
                <Mileage Amount="840"/>
              </TPA_Extensions>
            </FlightSegment>
          </OriginDestinationOption>
          <OriginDestinationOption ArrivalCountry="RU" DepartureCountry="RU" ElapsedTime="145">
            <FlightSegment ArrivalDateTime="2020-09-09T00:45:00" DepartureDateTime="2020-09-08T22:20:00" ElapsedTime="145" FlightNumber="308" ResBookDesigCode="W" StopQuantity="0">
              <DepartureAirport LocationCode="AER"/>
              <ArrivalAirport LocationCode="ZIA"/>
              <OperatingAirline Code="U6" FlightNumber="308"/>
              <Equipment AirEquipType="320"/>
              <MarketingAirline Code="U6"/>
              <MarriageGrp>O</MarriageGrp>
              <DepartureTimeZone GMTOffset="3"/>
              <ArrivalTimeZone GMTOffset="3"/>
              <TPA_Extensions>
                <eTicket Ind="true"/>
                <Mileage Amount="840"/>
              </TPA_Extensions>
            </FlightSegment>
          </OriginDestinationOption>
        </OriginDestinationOptions>
      </AirItinerary>
      <AirItineraryPricingInfo BrandsOnAnyMarket="true" FareReturned="true" LastTicketDate="2020-05-13" LastTicketTime="23:59" PricingSource="ADVJR1" PricingSubSource="MIP">
        <ItinTotalFare>
          <BaseFare Amount="3520" CurrencyCode="RUB" DecimalPlaces="0"/>
          <FareConstruction Amount="3520" CurrencyCode="RUB" DecimalPlaces="0"/>
          <EquivFare Amount="3520" CurrencyCode="RUB" DecimalPlaces="0"/>
          <Taxes>
            <Tax Amount="16276" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="TOTALTAX"/>
          </Taxes>
          <TotalFare Amount="19796" CurrencyCode="RUB" DecimalPlaces="0"/>
        </ItinTotalFare>
        <PTC_FareBreakdowns>
          <PTC_FareBreakdown>
            <PassengerTypeQuantity Code="ADT" Quantity="2"/>
            <FareBasisCodes>
              <FareBasisCode ArrivalAirportCode="AER" AvailabilityBreak="true" BookingCode="W" DepartureAirportCode="ZIA" FareComponentBeginAirport="ZIA" FareComponentDirectionality="FROM" FareComponentEndAirport="AER" FareComponentFareRule="U6PR" FareComponentFareTariff="304" FareComponentFareType="XPN" FareComponentFareTypeBitmap="00" FareComponentVendorCode="ATP" GovCarrier="U6">WPRRT</FareBasisCode>
              <FareBasisCode ArrivalAirportCode="ZIA" AvailabilityBreak="true" BookingCode="W" DepartureAirportCode="AER" FareComponentBeginAirport="AER" FareComponentDirectionality="TO" FareComponentEndAirport="ZIA" FareComponentFareRule="U6PR" FareComponentFareTariff="304" FareComponentFareType="XPN" FareComponentFareTypeBitmap="00" FareComponentVendorCode="ATP" GovCarrier="U6">WPRRT</FareBasisCode>
            </FareBasisCodes>
            <PassengerFare>
              <BaseFare Amount="1280" CurrencyCode="RUB"/>
              <FareConstruction Amount="1280" CurrencyCode="RUB" DecimalPlaces="0"/>
              <EquivFare Amount="1280" CurrencyCode="RUB" DecimalPlaces="0"/>
              <Taxes>
                <Tax Amount="2150" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                <Tax Amount="2150" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                <Tax Amount="400" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRI"/>
                <Tax Amount="400" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRI"/>
                <Tax Amount="75" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                <Tax Amount="120" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                <Tax Amount="75" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI4"/>
                <Tax Amount="120" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI4"/>
                <TaxSummary Amount="4300" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                <TaxSummary Amount="800" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRI"/>
                <TaxSummary Amount="390" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                <TotalTax Amount="5490" CurrencyCode="RUB" DecimalPlaces="0"/>
              </Taxes>
              <TotalFare Amount="6770" CurrencyCode="RUB"/>
              <PenaltiesInfo>
                <Penalty Amount="0" Applicability="Before" Changeable="true" ConditionsApply="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                <Penalty Amount="3000" Applicability="After" Changeable="true" ConditionsApply="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                <Penalty Applicability="Before" Refundable="false" Type="Refund"/>
                <Penalty Applicability="After" Refundable="false" Type="Refund"/>
              </PenaltiesInfo>
              <TPA_Extensions>
                <FareComponents>
                  <FareComponent BrandID="PR" BrandName="PROMO" ProgramCode="CFFU6" ProgramDescription="U6 DOMESTIC" ProgramID="83326" ProgramSystemCode="A">
                    <Segment FlightIndex="1" LegIndex="1"/>
                    <BrandFeatureRef FeatureId="11"/>
                    <BrandFeatureRef FeatureId="12"/>
                    <BrandFeatureRef FeatureId="14"/>
                    <BrandFeatureRef FeatureId="16"/>
                    <BrandFeatureRef FeatureId="27"/>
                    <BrandFeatureRef FeatureId="28"/>
                    <BrandFeatureRef FeatureId="61"/>
                    <BrandFeatureRef FeatureId="59"/>
                    <BrandFeatureRef FeatureId="41"/>
                    <BrandFeatureRef FeatureId="38"/>
                    <BrandFeatureRef FeatureId="40"/>
                    <BrandFeatureRef FeatureId="64"/>
                    <BrandFeatureRef FeatureId="68"/>
                    <BrandFeatureRef FeatureId="74"/>
                    <BrandFeatureRef FeatureId="76"/>
                  </FareComponent>
                  <FareComponent BrandID="PR" BrandName="PROMO" ProgramCode="CFFU6" ProgramDescription="U6 DOMESTIC" ProgramID="83326" ProgramSystemCode="A">
                    <Segment FlightIndex="1" LegIndex="2"/>
                    <BrandFeatureRef FeatureId="11"/>
                    <BrandFeatureRef FeatureId="12"/>
                    <BrandFeatureRef FeatureId="14"/>
                    <BrandFeatureRef FeatureId="16"/>
                    <BrandFeatureRef FeatureId="27"/>
                    <BrandFeatureRef FeatureId="28"/>
                    <BrandFeatureRef FeatureId="61"/>
                    <BrandFeatureRef FeatureId="59"/>
                    <BrandFeatureRef FeatureId="41"/>
                    <BrandFeatureRef FeatureId="38"/>
                    <BrandFeatureRef FeatureId="40"/>
                    <BrandFeatureRef FeatureId="64"/>
                    <BrandFeatureRef FeatureId="68"/>
                    <BrandFeatureRef FeatureId="74"/>
                    <BrandFeatureRef FeatureId="76"/>
                  </FareComponent>
                </FareComponents>
                <Messages>
                  <Message AirlineCode="U6" FailCode="0" Info="NONEND" Type="N"/>
                  <Message FailCode="0" Info="VALIDATING CARRIER" Type="W"/>
                  <Message FailCode="0" Info="BSP - U6" Type="W"/>
                  <Message FailCode="0" Info="GEN - U6" Type="W"/>
                  <Message FailCode="0" Info="TCH - U6" Type="W"/>
                  <Message FailCode="0" Info="CAT 15 SALES RESTRICTIONS FREE TEXT FOUND - VERIFY RULES" Type="W"/>
                </Messages>
                <BaggageInformationList>
                  <BaggageInformation AirlineCode="U6" ProvisionType="A">
                    <Segment Id="0"/>
                    <Allowance Unit="kg" Weight="10"/>
                  </BaggageInformation>
                  <BaggageInformation AirlineCode="U6" ProvisionType="A">
                    <Segment Id="1"/>
                    <Allowance Unit="kg" Weight="10"/>
                  </BaggageInformation>
                </BaggageInformationList>
              </TPA_Extensions>
            </PassengerFare>
            <Endorsements NonRefundableIndicator="true"/>
            <TPA_Extensions>
              <FareCalcLine Info="ZIA U6 AER640U6 ZIA640RUB1280END"/>
            </TPA_Extensions>
            <FareInfos>
              <FareInfo>
                <FareReference>W</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="N"/>
                </TPA_Extensions>
              </FareInfo>
              <FareInfo>
                <FareReference>W</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="N"/>
                </TPA_Extensions>
              </FareInfo>
            </FareInfos>
          </PTC_FareBreakdown>
          <PTC_FareBreakdown>
            <PassengerTypeQuantity Code="CNN" Quantity="1"/>
            <FareBasisCodes>
              <FareBasisCode ArrivalAirportCode="AER" AvailabilityBreak="true" BookingCode="W" DepartureAirportCode="ZIA" FareComponentBeginAirport="ZIA" FareComponentDirectionality="FROM" FareComponentEndAirport="AER" FareComponentFareRule="U6PR" FareComponentFareTariff="304" FareComponentFareType="XPN" FareComponentFareTypeBitmap="01" FareComponentVendorCode="ATP" GovCarrier="U6">WPRRT/CH25</FareBasisCode>
              <FareBasisCode ArrivalAirportCode="ZIA" AvailabilityBreak="true" BookingCode="W" DepartureAirportCode="AER" FareComponentBeginAirport="AER" FareComponentDirectionality="TO" FareComponentEndAirport="ZIA" FareComponentFareRule="U6PR" FareComponentFareTariff="304" FareComponentFareType="XPN" FareComponentFareTypeBitmap="01" FareComponentVendorCode="ATP" GovCarrier="U6">WPRRT/CH25</FareBasisCode>
            </FareBasisCodes>
            <PassengerFare>
              <BaseFare Amount="960" CurrencyCode="RUB"/>
              <FareConstruction Amount="960" CurrencyCode="RUB" DecimalPlaces="0"/>
              <EquivFare Amount="960" CurrencyCode="RUB" DecimalPlaces="0"/>
              <Taxes>
                <Tax Amount="2150" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                <Tax Amount="2150" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                <Tax Amount="400" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRI"/>
                <Tax Amount="400" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRI"/>
                <Tax Amount="38" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                <Tax Amount="60" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                <Tax Amount="38" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI4"/>
                <Tax Amount="60" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI4"/>
                <TaxSummary Amount="4300" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                <TaxSummary Amount="800" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRI"/>
                <TaxSummary Amount="196" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                <TotalTax Amount="5296" CurrencyCode="RUB" DecimalPlaces="0"/>
              </Taxes>
              <TotalFare Amount="6256" CurrencyCode="RUB"/>
              <PenaltiesInfo>
                <Penalty Amount="0" Applicability="Before" Changeable="true" ConditionsApply="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                <Penalty Amount="3000" Applicability="After" Changeable="true" ConditionsApply="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                <Penalty Applicability="Before" Refundable="false" Type="Refund"/>
                <Penalty Applicability="After" Refundable="false" Type="Refund"/>
              </PenaltiesInfo>
              <TPA_Extensions>
                <FareComponents>
                  <FareComponent BrandID="PR" BrandName="PROMO" ProgramCode="CFFU6" ProgramDescription="U6 DOMESTIC" ProgramID="83326" ProgramSystemCode="A">
                    <Segment FlightIndex="1" LegIndex="1"/>
                    <BrandFeatureRef FeatureId="11"/>
                    <BrandFeatureRef FeatureId="12"/>
                    <BrandFeatureRef FeatureId="14"/>
                    <BrandFeatureRef FeatureId="16"/>
                    <BrandFeatureRef FeatureId="27"/>
                    <BrandFeatureRef FeatureId="28"/>
                    <BrandFeatureRef FeatureId="61"/>
                    <BrandFeatureRef FeatureId="59"/>
                    <BrandFeatureRef FeatureId="41"/>
                    <BrandFeatureRef FeatureId="38"/>
                    <BrandFeatureRef FeatureId="40"/>
                    <BrandFeatureRef FeatureId="64"/>
                    <BrandFeatureRef FeatureId="68"/>
                    <BrandFeatureRef FeatureId="74"/>
                    <BrandFeatureRef FeatureId="76"/>
                  </FareComponent>
                  <FareComponent BrandID="PR" BrandName="PROMO" ProgramCode="CFFU6" ProgramDescription="U6 DOMESTIC" ProgramID="83326" ProgramSystemCode="A">
                    <Segment FlightIndex="1" LegIndex="2"/>
                    <BrandFeatureRef FeatureId="11"/>
                    <BrandFeatureRef FeatureId="12"/>
                    <BrandFeatureRef FeatureId="14"/>
                    <BrandFeatureRef FeatureId="16"/>
                    <BrandFeatureRef FeatureId="27"/>
                    <BrandFeatureRef FeatureId="28"/>
                    <BrandFeatureRef FeatureId="61"/>
                    <BrandFeatureRef FeatureId="59"/>
                    <BrandFeatureRef FeatureId="41"/>
                    <BrandFeatureRef FeatureId="38"/>
                    <BrandFeatureRef FeatureId="40"/>
                    <BrandFeatureRef FeatureId="64"/>
                    <BrandFeatureRef FeatureId="68"/>
                    <BrandFeatureRef FeatureId="74"/>
                    <BrandFeatureRef FeatureId="76"/>
                  </FareComponent>
                </FareComponents>
                <Messages>
                  <Message AirlineCode="U6" FailCode="0" Info="NONEND" Type="N"/>
                  <Message FailCode="0" Info="EACH CNN REQUIRES ACCOMPANYING SAME CABIN ADT" Type="W"/>
                  <Message FailCode="0" Info="VALIDATING CARRIER" Type="W"/>
                  <Message FailCode="0" Info="BSP - U6" Type="W"/>
                  <Message FailCode="0" Info="GEN - U6" Type="W"/>
                  <Message FailCode="0" Info="TCH - U6" Type="W"/>
                  <Message FailCode="0" Info="CAT 15 SALES RESTRICTIONS FREE TEXT FOUND - VERIFY RULES" Type="W"/>
                </Messages>
                <BaggageInformationList>
                  <BaggageInformation AirlineCode="U6" ProvisionType="A">
                    <Segment Id="0"/>
                    <Allowance Unit="kg" Weight="10"/>
                  </BaggageInformation>
                  <BaggageInformation AirlineCode="U6" ProvisionType="A">
                    <Segment Id="1"/>
                    <Allowance Unit="kg" Weight="10"/>
                  </BaggageInformation>
                </BaggageInformationList>
              </TPA_Extensions>
            </PassengerFare>
            <Endorsements NonRefundableIndicator="true"/>
            <TPA_Extensions>
              <FareCalcLine Info="ZIA U6 AER480U6 ZIA480RUB960END"/>
            </TPA_Extensions>
            <FareInfos>
              <FareInfo>
                <FareReference>W</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="N"/>
                </TPA_Extensions>
              </FareInfo>
              <FareInfo>
                <FareReference>W</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="N"/>
                </TPA_Extensions>
              </FareInfo>
            </FareInfos>
          </PTC_FareBreakdown>
          <PTC_FareBreakdown>
            <PassengerTypeQuantity Code="INF" Quantity="1"/>
            <FareBasisCodes>
              <FareBasisCode ArrivalAirportCode="AER" AvailabilityBreak="true" BookingCode="W" DepartureAirportCode="ZIA" FareComponentBeginAirport="ZIA" FareComponentDirectionality="FROM" FareComponentEndAirport="AER" FareComponentFareRule="U6PR" FareComponentFareTariff="304" FareComponentFareType="XPN" FareComponentFareTypeBitmap="01" FareComponentVendorCode="ATP" GovCarrier="U6">WPRRT/IN</FareBasisCode>
              <FareBasisCode ArrivalAirportCode="ZIA" AvailabilityBreak="true" BookingCode="W" DepartureAirportCode="AER" FareComponentBeginAirport="AER" FareComponentDirectionality="TO" FareComponentEndAirport="ZIA" FareComponentFareRule="U6PR" FareComponentFareTariff="304" FareComponentFareType="XPN" FareComponentFareTypeBitmap="01" FareComponentVendorCode="ATP" GovCarrier="U6">WPRRT/IN</FareBasisCode>
            </FareBasisCodes>
            <PassengerFare>
              <BaseFare Amount="0" CurrencyCode="RUB"/>
              <FareConstruction Amount="0" CurrencyCode="RUB" DecimalPlaces="0"/>
              <EquivFare Amount="0" CurrencyCode="RUB" DecimalPlaces="0"/>
              <TotalFare Amount="0" CurrencyCode="RUB"/>
              <PenaltiesInfo>
                <Penalty Amount="0" Applicability="Before" Changeable="true" ConditionsApply="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                <Penalty Amount="0" Applicability="After" Changeable="true" ConditionsApply="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                <Penalty Applicability="Before" Refundable="false" Type="Refund"/>
                <Penalty Applicability="After" Refundable="false" Type="Refund"/>
              </PenaltiesInfo>
              <TPA_Extensions>
                <FareComponents>
                  <FareComponent BrandID="PR" BrandName="PROMO" ProgramCode="CFFU6" ProgramDescription="U6 DOMESTIC" ProgramID="83326" ProgramSystemCode="A">
                    <Segment FlightIndex="1" LegIndex="1"/>
                    <BrandFeatureRef FeatureId="11"/>
                    <BrandFeatureRef FeatureId="12"/>
                    <BrandFeatureRef FeatureId="14"/>
                    <BrandFeatureRef FeatureId="16"/>
                    <BrandFeatureRef FeatureId="27"/>
                    <BrandFeatureRef FeatureId="28"/>
                    <BrandFeatureRef FeatureId="61"/>
                    <BrandFeatureRef FeatureId="59"/>
                    <BrandFeatureRef FeatureId="41"/>
                    <BrandFeatureRef FeatureId="38"/>
                    <BrandFeatureRef FeatureId="40"/>
                    <BrandFeatureRef FeatureId="64"/>
                    <BrandFeatureRef FeatureId="68"/>
                    <BrandFeatureRef FeatureId="74"/>
                    <BrandFeatureRef FeatureId="76"/>
                  </FareComponent>
                  <FareComponent BrandID="PR" BrandName="PROMO" ProgramCode="CFFU6" ProgramDescription="U6 DOMESTIC" ProgramID="83326" ProgramSystemCode="A">
                    <Segment FlightIndex="1" LegIndex="2"/>
                    <BrandFeatureRef FeatureId="11"/>
                    <BrandFeatureRef FeatureId="12"/>
                    <BrandFeatureRef FeatureId="14"/>
                    <BrandFeatureRef FeatureId="16"/>
                    <BrandFeatureRef FeatureId="27"/>
                    <BrandFeatureRef FeatureId="28"/>
                    <BrandFeatureRef FeatureId="61"/>
                    <BrandFeatureRef FeatureId="59"/>
                    <BrandFeatureRef FeatureId="41"/>
                    <BrandFeatureRef FeatureId="38"/>
                    <BrandFeatureRef FeatureId="40"/>
                    <BrandFeatureRef FeatureId="64"/>
                    <BrandFeatureRef FeatureId="68"/>
                    <BrandFeatureRef FeatureId="74"/>
                    <BrandFeatureRef FeatureId="76"/>
                  </FareComponent>
                </FareComponents>
                <Messages>
                  <Message AirlineCode="U6" FailCode="0" Info="NONEND" Type="N"/>
                  <Message FailCode="0" Info="EACH INF REQUIRES ACCOMPANYING ADT PASSENGER" Type="W"/>
                  <Message FailCode="0" Info="VALIDATING CARRIER" Type="W"/>
                  <Message FailCode="0" Info="BSP - U6" Type="W"/>
                  <Message FailCode="0" Info="GEN - U6" Type="W"/>
                  <Message FailCode="0" Info="TCH - U6" Type="W"/>
                  <Message FailCode="0" Info="CAT 15 SALES RESTRICTIONS FREE TEXT FOUND - VERIFY RULES" Type="W"/>
                </Messages>
                <BaggageInformationList>
                  <BaggageInformation AirlineCode="U6" ProvisionType="A">
                    <Segment Id="0"/>
                    <Allowance Unit="kg" Weight="10"/>
                  </BaggageInformation>
                  <BaggageInformation AirlineCode="U6" ProvisionType="A">
                    <Segment Id="1"/>
                    <Allowance Unit="kg" Weight="10"/>
                  </BaggageInformation>
                </BaggageInformationList>
              </TPA_Extensions>
            </PassengerFare>
            <Endorsements NonRefundableIndicator="false"/>
            <TPA_Extensions>
              <FareCalcLine Info="ZIA U6 AER0U6 ZIA0RUB0END"/>
            </TPA_Extensions>
            <FareInfos>
              <FareInfo>
                <FareReference>W</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="N"/>
                </TPA_Extensions>
              </FareInfo>
              <FareInfo>
                <FareReference>W</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="N"/>
                </TPA_Extensions>
              </FareInfo>
            </FareInfos>
          </PTC_FareBreakdown>
        </PTC_FareBreakdowns>
        <FareInfos>
          <FareInfo>
            <FareReference>W</FareReference>
            <TPA_Extensions>
              <SeatsRemaining BelowMin="false" Number="9"/>
              <Cabin Cabin="Y"/>
              <Meal Code="N"/>
            </TPA_Extensions>
          </FareInfo>
          <FareInfo>
            <FareReference>W</FareReference>
            <TPA_Extensions>
              <SeatsRemaining BelowMin="false" Number="9"/>
              <Cabin Cabin="Y"/>
              <Meal Code="N"/>
            </TPA_Extensions>
          </FareInfo>
        </FareInfos>
        <TPA_Extensions>
          <DivideInParty Indicator="false"/>
          <AncillaryFeeGroups>
            <AncillaryFeeGroup Code="BG" Name="BAGGAGE">
              <AncillaryFeeItem Amount="2500" AncillaryTypeCode="F" BaggageID="1" Carrier="U6" Date="2020-09-01" Description="FIRST EXCESS BAG" Description1="FIRST BAG" DestinationAirport="AER" EndSegment="1" OriginAirport="ZIA" PassengerCode="ALL" StartSegment="1" Subcode="0CC"/>
              <AncillaryFeeItem Amount="2500" AncillaryTypeCode="F" BaggageID="2" Carrier="U6" Date="2020-09-01" Description="SECOND EXCESS BAG" Description1="SECOND BAG" DestinationAirport="AER" EndSegment="1" OriginAirport="ZIA" PassengerCode="ALL" StartSegment="1" Subcode="0CD"/>
              <AncillaryFeeItem Amount="2500" AncillaryTypeCode="F" BaggageID="3" Carrier="U6" Date="2020-09-01" Description="THIRD EXCESS BAG" Description1="THIRD BAG" DestinationAirport="AER" EndSegment="1" OriginAirport="ZIA" PassengerCode="ALL" StartSegment="1" Subcode="0CE"/>
              <AncillaryFeeItem Amount="2000" AncillaryTypeCode="F" BaggageID="4" Carrier="U6" Date="2020-09-01" Description="UPTO22LB 10KG BAGGAGE" Description1="UP TO 22 POUNDS/10 KILOGRAMS" DestinationAirport="AER" EndSegment="1" OriginAirport="ZIA" PassengerCode="ALL" StartSegment="1" Subcode="0CZ"/>
              <AncillaryFeeItem Amount="2000" AncillaryTypeCode="F" BaggageID="5" Carrier="U6" Date="2020-09-01" Description="EXCESS WEIGHT SPECIAL CHARGE" Description1="EXCESS WEIGHT" Description2="SPECIAL CHARGE" DestinationAirport="AER" EndSegment="1" OriginAirport="ZIA" PassengerCode="ALL" StartSegment="1" Subcode="0H6"/>
              <AncillaryFeeItem Amount="2500" AncillaryTypeCode="F" BaggageID="6" Carrier="U6" Date="2020-09-01" Description="EXTRA CARRYON BG" Description1="EXCESS SIZE" Description2="SPECIAL CHARGE" DestinationAirport="AER" EndSegment="1" OriginAirport="ZIA" PassengerCode="ALL" StartSegment="1" Subcode="0H7"/>
              <AncillaryFeeItem Amount="2500" AncillaryTypeCode="F" BaggageID="7" Carrier="U6" Date="2020-09-01" Description="CARRY ON HAND BAGGAGE" DestinationAirport="AER" EndSegment="1" OriginAirport="ZIA" PassengerCode="ALL" StartSegment="1" Subcode="0L5" Subgroup="CY"/>
              <AncillaryFeeItem Amount="2500" AncillaryTypeCode="F" BaggageID="8" Carrier="U6" Date="2020-09-08" Description="FIRST EXCESS BAG" Description1="FIRST BAG" DestinationAirport="ZIA" EndSegment="2" OriginAirport="AER" PassengerCode="ALL" StartSegment="2" Subcode="0CC"/>
              <AncillaryFeeItem Amount="2500" AncillaryTypeCode="F" BaggageID="9" Carrier="U6" Date="2020-09-08" Description="SECOND EXCESS BAG" Description1="SECOND BAG" DestinationAirport="ZIA" EndSegment="2" OriginAirport="AER" PassengerCode="ALL" StartSegment="2" Subcode="0CD"/>
              <AncillaryFeeItem Amount="2500" AncillaryTypeCode="F" BaggageID="10" Carrier="U6" Date="2020-09-08" Description="THIRD EXCESS BAG" Description1="THIRD BAG" DestinationAirport="ZIA" EndSegment="2" OriginAirport="AER" PassengerCode="ALL" StartSegment="2" Subcode="0CE"/>
              <AncillaryFeeItem Amount="2000" AncillaryTypeCode="F" BaggageID="11" Carrier="U6" Date="2020-09-08" Description="UPTO22LB 10KG BAGGAGE" Description1="UP TO 22 POUNDS/10 KILOGRAMS" DestinationAirport="ZIA" EndSegment="2" OriginAirport="AER" PassengerCode="ALL" StartSegment="2" Subcode="0CZ"/>
              <AncillaryFeeItem Amount="2000" AncillaryTypeCode="F" BaggageID="12" Carrier="U6" Date="2020-09-08" Description="EXCESS WEIGHT SPECIAL CHARGE" Description1="EXCESS WEIGHT" Description2="SPECIAL CHARGE" DestinationAirport="ZIA" EndSegment="2" OriginAirport="AER" PassengerCode="ALL" StartSegment="2" Subcode="0H6"/>
              <AncillaryFeeItem Amount="2500" AncillaryTypeCode="F" BaggageID="13" Carrier="U6" Date="2020-09-08" Description="EXTRA CARRYON BG" Description1="EXCESS SIZE" Description2="SPECIAL CHARGE" DestinationAirport="ZIA" EndSegment="2" OriginAirport="AER" PassengerCode="ALL" StartSegment="2" Subcode="0H7"/>
              <AncillaryFeeItem Amount="2500" AncillaryTypeCode="F" BaggageID="14" Carrier="U6" Date="2020-09-08" Description="CARRY ON HAND BAGGAGE" DestinationAirport="ZIA" EndSegment="2" OriginAirport="AER" PassengerCode="ALL" StartSegment="2" Subcode="0L5" Subgroup="CY"/>
            </AncillaryFeeGroup>
            <OrderStandardBag>
              <PassengerBags Code="ADT">
                <BaggageSequenceOrder BaggageID="1" StandardBag="1"/>
                <BaggageSequenceOrder BaggageID="2" StandardBag="2"/>
                <BaggageSequenceOrder BaggageID="3" StandardBag="3"/>
                <BaggageSequenceOrder BaggageID="8" StandardBag="1"/>
                <BaggageSequenceOrder BaggageID="9" StandardBag="2"/>
                <BaggageSequenceOrder BaggageID="10" StandardBag="3"/>
              </PassengerBags>
              <PassengerBags Code="CNN">
                <BaggageSequenceOrder BaggageID="1" StandardBag="1"/>
                <BaggageSequenceOrder BaggageID="2" StandardBag="2"/>
                <BaggageSequenceOrder BaggageID="3" StandardBag="3"/>
                <BaggageSequenceOrder BaggageID="8" StandardBag="1"/>
                <BaggageSequenceOrder BaggageID="9" StandardBag="2"/>
                <BaggageSequenceOrder BaggageID="10" StandardBag="3"/>
              </PassengerBags>
              <PassengerBags Code="INF">
                <BaggageSequenceOrder BaggageID="1" StandardBag="1"/>
                <BaggageSequenceOrder BaggageID="2" StandardBag="2"/>
                <BaggageSequenceOrder BaggageID="3" StandardBag="3"/>
                <BaggageSequenceOrder BaggageID="8" StandardBag="1"/>
                <BaggageSequenceOrder BaggageID="9" StandardBag="2"/>
                <BaggageSequenceOrder BaggageID="10" StandardBag="3"/>
              </PassengerBags>
            </OrderStandardBag>
          </AncillaryFeeGroups>
          <ValidatingCarrier NewVcxProcess="true" SettlementMethod="BSP">
            <Default Code="U6"/>
          </ValidatingCarrier>
          <ValidatingCarrier NewVcxProcess="true" SettlementMethod="TCH">
            <Default Code="U6"/>
          </ValidatingCarrier>
          <ValidatingCarrier NewVcxProcess="true" SettlementMethod="GEN">
            <Default Code="U6"/>
          </ValidatingCarrier>
        </TPA_Extensions>
      </AirItineraryPricingInfo>
      <TicketingInfo TicketType="eTicket" ValidInterline="Yes"/>
      <TPA_Extensions>
        <ValidatingCarrier Code="U6"/>
        <DiversitySwapper WeighedPriceAmount="14378.1"/>
      </TPA_Extensions>
    </PricedItinerary>
    <!--Другие варианты перелетов-->
  </PricedItineraries>
</OTA_AirLowFareSearchRS>
{% endxmlsec %}

---

{% xmlsec "Пример запроса (оформление на нескольких билетах (SCHS), GIR ответ)", false %}
<OTA_AirLowFareSearchRQ ResponseType="GIR" Version="6.1.0" xmlns="http://www.opentravel.org/OTA/2003/05">
  <POS>
    <Source PseudoCityCode="9LSC">
      <RequestorID ID="1" Type="1">
        <CompanyName Code="TN"/>
      </RequestorID>
    </Source>
  </POS>
  <OriginDestinationInformation RPH="1">
    <DepartureDateTime>2020-09-01T11:00:00</DepartureDateTime>
    <OriginLocation LocationCode="MOW"/>
    <DestinationLocation LocationCode="AER"/>
  </OriginDestinationInformation>
  <OriginDestinationInformation RPH="2">
    <DepartureDateTime>2020-09-08T11:00:00</DepartureDateTime>
    <OriginLocation LocationCode="AER"/>
    <DestinationLocation LocationCode="MOW"/>
  </OriginDestinationInformation>
  <TravelPreferences ValidInterlineTicket="true">
    <CabinPref Cabin="Economy" PreferLevel="Preferred"/>
    <TPA_Extensions>
      <LongConnectTime Enable="true"/>
      <LongConnectPoints Max="3" Min="1"/>
      <KeepSameCabin Enabled="true"/>
      <ExcludeCallDirectCarriers Enabled="true"/>
      <DiversityParameters AdditionalNonStopsPercentage="100"/>
    </TPA_Extensions>
    <AncillaryFees Enable="true">
      <AncillaryFeeGroup Code="BG"/>
    </AncillaryFees>
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
    <IntelliSellTransaction>
      <RequestType Name="200ITINS"/>
    </IntelliSellTransaction>
    <MultiTicket DisplayPolicy="SCHS"/>
  </TPA_Extensions>
</OTA_AirLowFareSearchRQ>
{% endxmlsec %}

{% xmlsec "Пример ответа", false %}
<GroupedItineraryResponse Version="6.1.0" xmlns="http://webservices.sabre.com/wsdl/sabreXML1.0.00/shopping/GroupedItineraryResponse" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <Message Code="TRANSACTIONID" Severity="Info" Text="7554053288918792658" Type="WORKERTHREAD"/>
  <Message Code="ASE032LPSPIL7ED.IDM.SGDCPROD.SABRE.COM" Severity="Info" Text="27036" Type="SERVER"/>
  <Message Code="RULEID" Severity="Info" Text="15936" Type="DRE"/>
  <Message Code="RULEID" Severity="Info" Text="24467" Type="DEFAULT"/>
  <Statistics Itineraries="300"/>
  <ScheduleDesc ETicketable="true" ElapsedTime="150" Frequency="**T*T**" ID="1" Stops="0" TotalMilesFlown="831">
    <Departure Airport="DME" City="MOW" Country="RU" Time="10:20:00+03:00"/>
    <Arrival Airport="AER" City="AER" Country="RU" Time="12:50:00+03:00"/>
    <Carrier Marketing="U6" MarketingFlightNumber="377" Operating="U6" OperatingFlightNumber="377">
      <Equipment Code="320" TypeForFirstLeg="N" TypeForLastLeg="N"/>
    </Carrier>
  </ScheduleDesc>
  <ScheduleDesc ETicketable="true" ElapsedTime="120" Frequency="SMTWTFS" ID="2" Stops="0" TotalMilesFlown="840">
    <Departure Airport="AER" City="AER" Country="RU" Time="16:30:00+03:00"/>
    <Arrival Airport="ZIA" City="MOW" Country="RU" Time="18:30:00+03:00"/>
    <Carrier Marketing="U6" MarketingFlightNumber="1310" Operating="U6" OperatingFlightNumber="1310">
      <Equipment Code="320" TypeForFirstLeg="N" TypeForLastLeg="N"/>
    </Carrier>
  </ScheduleDesc>
  <ScheduleDesc ETicketable="true" ElapsedTime="140" Frequency="*MTWTFS" ID="3" Stops="0" TotalMilesFlown="847">
    <Departure Airport="AER" City="AER" Country="RU" Time="14:10:00+03:00"/>
    <Arrival Airport="VKO" City="MOW" Country="RU" Terminal="A" Time="16:30:00+03:00"/>
    <Carrier Marketing="R3" MarketingFlightNumber="474" Operating="R3" OperatingFlightNumber="474">
      <Equipment Code="73H" TypeForFirstLeg="N" TypeForLastLeg="N"/>
    </Carrier>
  </ScheduleDesc>
  <ScheduleDesc ETicketable="true" ElapsedTime="140" Frequency="SMT*TF*" ID="4" Stops="0" TotalMilesFlown="873">
    <Departure Airport="AER" City="AER" Country="RU" Time="19:35:00+03:00"/>
    <Arrival Airport="SVO" City="MOW" Country="RU" Terminal="D" Time="21:55:00+03:00"/>
    <Carrier Marketing="N4" MarketingFlightNumber="226" Operating="N4" OperatingFlightNumber="226">
      <Equipment Code="321" TypeForFirstLeg="N" TypeForLastLeg="N"/>
    </Carrier>
  </ScheduleDesc>
  <ScheduleDesc ETicketable="true" ElapsedTime="145" Frequency="S*T*T**" ID="5" Stops="0" TotalMilesFlown="847">
    <Departure Airport="VKO" City="MOW" Country="RU" Time="14:10:00+03:00"/>
    <Arrival Airport="AER" City="AER" Country="RU" Time="16:35:00+03:00"/>
    <Carrier Disclosure="DP" Marketing="H1" MarketingFlightNumber="1408" Operating="H1" OperatingFlightNumber="1408">
      <Equipment Code="737" TypeForFirstLeg="N" TypeForLastLeg="N"/>
    </Carrier>
  </ScheduleDesc>
  <!--Другие рейсы-->
  <TaxDesc Amount="810" Code="YQF" Currency="RUB" Description="SERVICE FEE - CARRIER-IMPOSED FUEL" ID="1" PublishedAmount="10.00" PublishedCurrency="EUR" Station="DME"/>
  <TaxDesc Amount="270" Code="YRF" Currency="RUB" Description="SERVICE FEE - CARRIER-IMPOSED FUEL" ID="2" PublishedAmount="270" PublishedCurrency="RUB" Station="AER"/>
  <TaxDesc Amount="190" Code="YQI" Currency="RUB" Description="SERVICE FEE - CARRIER-IMPOSED MISC" ID="3" PublishedAmount="190" PublishedCurrency="RUB" Station="SVO"/>
  <TaxDesc Amount="105" Code="RI4" Country="RU" Currency="RUB" Description="TERMINAL USE CHARGE DOMESTIC ARRIVAL" ID="4" PublishedAmount="105" PublishedCurrency="RUB" Station="AER"/>
  <TaxDesc Amount="1500" Code="YQF" Currency="RUB" Description="SERVICE FEE - CARRIER-IMPOSED FUEL" ID="5" PublishedAmount="1500" PublishedCurrency="RUB" Station="SVO"/>
  <!--Другие таксы-->
  <TaxSummaryDesc Amount="810" Code="YQF" Currency="RUB" Description="SERVICE FEE - CARRIER-IMPOSED FUEL" ID="1" PublishedAmount="10.00" PublishedCurrency="EUR" Station="DME"/>
  <TaxSummaryDesc Amount="450" Code="RI3" Country="RU" Currency="RUB" Description="TERMINAL USE CHARGE DOMESTIC DEPARTURE" ID="2" PublishedAmount="105" PublishedCurrency="RUB" Station="DME"/>
  <TaxSummaryDesc Amount="304" Code="RI3" Country="RU" Currency="RUB" Description="TERMINAL USE CHARGE DOMESTIC DEPARTURE" ID="3" PublishedAmount="92" PublishedCurrency="RUB" Station="SVO"/>
  <TaxSummaryDesc Amount="190" Code="YQI" Currency="RUB" Description="SERVICE FEE - CARRIER-IMPOSED MISC" ID="4" PublishedAmount="190" PublishedCurrency="RUB" Station="SVO"/>
  <TaxSummaryDesc Amount="304" Code="RI3" Country="RU" Currency="RUB" Description="TERMINAL USE CHARGE DOMESTIC DEPARTURE" ID="5" PublishedAmount="184" PublishedCurrency="RUB" Station="SVO"/>
  <!--Другие таксы-->
  <BrandFeatureDesc Application="C" CommercialName="SECOND EXCESS BAG" ID="1" ServiceGroup="BG" ServiceType="C" SubCode="0CD" Vendor="ATP"/>
  <BrandFeatureDesc Application="C" CommercialName="UPGRADE AT CHECKIN TO COMFORT" ID="2" ServiceGroup="BF" ServiceType="Z" SubCode="UT2" Vendor="ATP"/>
  <BrandFeatureDesc Application="C" CommercialName="1ST FISHING EQPMT UPTO 20KG" ID="3" ServiceGroup="BG" ServiceType="C" SubCode="0L1" Vendor="ATP"/>
  <BrandFeatureDesc Application="C" CommercialName="SEAT ASSIGNMENT EXTRA SPACE" ID="4" ServiceGroup="SB" ServiceType="F" SubCode="0BV" Vendor="ATP"/>
  <BrandFeatureDesc Application="N" CommercialName="CARRY15KG 33LBUPTO 45LI 115LCM" ID="5" ServiceGroup="BG" ServiceType="C" SubCode="0MK" Vendor="ATP"/>
  <!--Другие услуги-->
  <FareComponentDesc ApplicablePricingCategories="7 10 15 16 18 19" Direction="EH" Directionality="FROM" FareBasisCode="VLTRT/IN00" FarePassengerType="INF" FareRule="UT22" FareTariff="304" FareType="XEL" FareTypeBitmap="01" GoverningCarrier="UT" ID="1" NotValidAfter="2020-09-01" NotValidBefore="2020-09-01" PublishedFareAmount="0" TicketDesignator="IN00" VendorCode="ATP">
    <Segment Stopover="true"/>
    <Brand BrandName="ECONOMY MINIMUM" Code="MN" ProgramCode="BUT" ProgramDescription="BRANDED FARES UT 5" ProgramID="86060" ProgramSystemCode="B"/>
  </FareComponentDesc>
  <FareComponentDesc ApplicablePricingCategories="1 4 5 8 10 12 15 16 18 19 23" Direction="EH" Directionality="FROM" FareAmount="2135" FareBasisCode="EPROW/CH25" FareCurrency="RUB" FarePassengerType="CNN" FareRule="U6PR" FareTariff="304" FareType="XPN" FareTypeBitmap="01" GoverningCarrier="U6" ID="2" NotValidAfter="2020-09-01" NotValidBefore="2020-09-01" OneWayFare="true" PublishedFareAmount="2135" TicketDesignator="CH25" VendorCode="ATP">
    <Segment/>
    <Brand BrandName="PROMO" Code="PR" ProgramCode="CFFU6" ProgramDescription="U6 DOMESTIC" ProgramID="83326" ProgramSystemCode="A"/>
  </FareComponentDesc>
  <FareComponentDesc ApplicablePricingCategories="4 5 7 9 10 15 16 18" Direction="EH" Directionality="FROM" FareAmount="3099" FareBasisCode="TOWDP" FareCurrency="RUB" FarePassengerType="ADT" FareRule="H1DP" FareTariff="304" FareType="SIP" FareTypeBitmap="00" GoverningCarrier="H1" ID="3" NotValidAfter="2021-09-01" OneWayFare="true" PublishedFareAmount="3099" VendorCode="ATP">
    <Segment/>
  </FareComponentDesc>
  <FareComponentDesc ApplicablePricingCategories="4 5 7 9 10 15 16 18" Direction="EH" Directionality="FROM" FareAmount="4099" FareBasisCode="ROWDP" FareCurrency="RUB" FarePassengerType="ADT" FareRule="H1DP" FareTariff="304" FareType="SIP" FareTypeBitmap="00" GoverningCarrier="H1" ID="4" NotValidAfter="2021-09-01" OneWayFare="true" PublishedFareAmount="4099" VendorCode="ATP">
    <Segment/>
  </FareComponentDesc>
  <FareComponentDesc ApplicablePricingCategories="1 4 5 8 10 12 15 16 18 23" Direction="EH" Directionality="FROM" FareAmount="640" FareBasisCode="WPRRT" FareCurrency="RUB" FarePassengerType="ADT" FareRule="U6PR" FareTariff="304" FareType="XPN" FareTypeBitmap="00" GoverningCarrier="U6" ID="5" NotValidAfter="2020-09-01" NotValidBefore="2020-09-01" PublishedFareAmount="1280" VendorCode="ATP">
    <Segment Stopover="true"/>
    <Brand BrandName="PROMO" Code="PR" ProgramCode="CFFU6" ProgramDescription="U6 DOMESTIC" ProgramID="83326" ProgramSystemCode="A"/>
  </FareComponentDesc>
  <!--Другие компоненты тарифов-->
  <ValidatingCarrierDesc ID="1" NewVcxProcess="true" SettlementMethod="BSP">
    <Default Code="HR"/>
  </ValidatingCarrierDesc>
  <ValidatingCarrierDesc ID="2" NewVcxProcess="true" SettlementMethod="BSP">
    <Default Code="R3"/>
  </ValidatingCarrierDesc>
  <ValidatingCarrierDesc ID="3" NewVcxProcess="true" SettlementMethod="BSP">
    <Default Code="S7"/>
  </ValidatingCarrierDesc>
  <ValidatingCarrierDesc ID="4" NewVcxProcess="true" SettlementMethod="TCH">
    <Default Code="U6"/>
  </ValidatingCarrierDesc>
  <ValidatingCarrierDesc ID="5" NewVcxProcess="true" SettlementMethod="TCH">
    <Default Code="UT"/>
  </ValidatingCarrierDesc>
  <!--Другие валидирующие перевозчики-->
  <BaggageAllowanceDesc ID="1" Pieces="0"/>
  <BaggageAllowanceDesc ID="2" Pieces="0"/>
  <BaggageAllowanceDesc ID="3" Pieces="0"/>
  <BaggageAllowanceDesc ID="4" Pieces="0"/>
  <BaggageAllowanceDesc ID="5" Pieces="0"/>
  <!--Другие нормы провоза багажа-->
  <LegDesc ElapsedTime="135" ID="1">
    <Schedule Ref="40"/>
  </LegDesc>
  <LegDesc ElapsedTime="150" ID="2">
    <Schedule Ref="39"/>
  </LegDesc>
  <LegDesc ElapsedTime="140" ID="3">
    <Schedule Ref="38"/>
  </LegDesc>
  <LegDesc ElapsedTime="145" ID="4">
    <Schedule Ref="36"/>
  </LegDesc>
  <LegDesc ElapsedTime="130" ID="5">
    <Schedule Ref="37"/>
  </LegDesc>
  <!--Другие плечи-->
  <ItineraryGroup>
    <GroupDescription>
      <LegDescription ArrivalLocation="AER" DepartureDate="2020-09-01" DepartureLocation="DME"/>
      <LegDescription ArrivalLocation="DME" DepartureDate="2020-09-08" DepartureLocation="AER"/>
    </GroupDescription>
    <Itinerary ID="1" PricingSource="ADVJR1">
      <Leg Ref="15"/>
      <Leg Ref="36"/>
      <PricingInformation BrandsOnAnyMarket="true" PricingSubsource="MIP">
        <Fare ETicketable="true" GoverningCarriers="U6 U6" LastTicketDate="2020-05-13" LastTicketTime="23:59" VITA="true" ValidatingCarrierCode="U6">
          <PassengerInfo NonRefundable="true" PassengerNumber="2" PassengerType="ADT">
            <FareComponent Ref="5">
              <Segment AvailabilityBreak="true" BookingCode="W" CabinCode="Y" MealCode="N" SeatsAvailable="9"/>
              <BrandFeature Ref="44"/>
              <BrandFeature Ref="80"/>
              <BrandFeature Ref="28"/>
              <BrandFeature Ref="61"/>
              <BrandFeature Ref="38"/>
              <BrandFeature Ref="9"/>
              <BrandFeature Ref="41"/>
              <BrandFeature Ref="5"/>
              <BrandFeature Ref="37"/>
              <BrandFeature Ref="24"/>
              <BrandFeature Ref="50"/>
              <BrandFeature Ref="45"/>
              <BrandFeature Ref="15"/>
              <BrandFeature Ref="58"/>
              <BrandFeature Ref="33"/>
            </FareComponent>
            <FareComponent Ref="114">
              <Segment AvailabilityBreak="true" BookingCode="W" CabinCode="Y" MealCode="N" SeatsAvailable="9"/>
              <BrandFeature Ref="44"/>
              <BrandFeature Ref="80"/>
              <BrandFeature Ref="28"/>
              <BrandFeature Ref="61"/>
              <BrandFeature Ref="38"/>
              <BrandFeature Ref="9"/>
              <BrandFeature Ref="41"/>
              <BrandFeature Ref="5"/>
              <BrandFeature Ref="37"/>
              <BrandFeature Ref="24"/>
              <BrandFeature Ref="50"/>
              <BrandFeature Ref="45"/>
              <BrandFeature Ref="15"/>
              <BrandFeature Ref="58"/>
              <BrandFeature Ref="33"/>
            </FareComponent>
            <Tax Ref="13"/>
            <Tax Ref="8"/>
            <Tax Ref="53"/>
            <Tax Ref="10"/>
            <Tax Ref="37"/>
            <Tax Ref="42"/>
            <Tax Ref="4"/>
            <Tax Ref="14"/>
            <TaxSummary Ref="43"/>
            <TaxSummary Ref="67"/>
            <TaxSummary Ref="2"/>
            <CurrencyConversion ExchangeRateUsed="1" From="RUB" To="RUB"/>
            <FareMessage Carrier="U6" Code="0" Info="NONEND" Type="N"/>
            <FareMessage Code="0" Info="VALIDATING CARRIER" Type="W"/>
            <FareMessage Code="0" Info="BSP - U6" Type="W"/>
            <FareMessage Code="0" Info="GEN - U6" Type="W"/>
            <FareMessage Code="0" Info="TCH - U6" Type="W"/>
            <FareMessage Code="0" Info="CAT 15 SALES RESTRICTIONS FREE TEXT FOUND - VERIFY RULES" Type="W"/>
            <PassengerTotalFare BaseFareAmount="1280" BaseFareCurrency="RUB" CommissionAmount="0" CommissionPercentage="0" ConstructionAmount="1280" ConstructionCurrency="RUB" Currency="RUB" EquivalentAmount="1280" EquivalentCurrency="RUB" ExchangeRateOne="76.8000000" TotalFare="6830" TotalTaxes="5550"/>
            <BaggageInformation AirlineCode="U6" ProvisionType="A">
              <Segment ID="0"/>
              <Allowance Ref="9"/>
            </BaggageInformation>
            <BaggageInformation AirlineCode="U6" ProvisionType="A">
              <Segment ID="1"/>
              <Allowance Ref="9"/>
            </BaggageInformation>
            <PenaltiesInfo>
              <Penalty Amount="0" Applicability="Before" Changeable="true" ConditionsApply="true" Currency="RUB" Type="Exchange"/>
              <Penalty Amount="3000" Applicability="After" Changeable="true" ConditionsApply="true" Currency="RUB" Type="Exchange"/>
              <Penalty Applicability="Before" Refundable="false" Type="Refund"/>
              <Penalty Applicability="After" Refundable="false" Type="Refund"/>
            </PenaltiesInfo>
          </PassengerInfo>
          <PassengerInfo NonRefundable="true" PassengerNumber="1" PassengerType="CNN">
            <FareComponent Ref="128">
              <Segment AvailabilityBreak="true" BookingCode="W" CabinCode="Y" MealCode="N" SeatsAvailable="9"/>
              <BrandFeature Ref="44"/>
              <BrandFeature Ref="80"/>
              <BrandFeature Ref="28"/>
              <BrandFeature Ref="61"/>
              <BrandFeature Ref="38"/>
              <BrandFeature Ref="9"/>
              <BrandFeature Ref="41"/>
              <BrandFeature Ref="5"/>
              <BrandFeature Ref="37"/>
              <BrandFeature Ref="24"/>
              <BrandFeature Ref="50"/>
              <BrandFeature Ref="45"/>
              <BrandFeature Ref="15"/>
              <BrandFeature Ref="58"/>
              <BrandFeature Ref="33"/>
            </FareComponent>
            <FareComponent Ref="70">
              <Segment AvailabilityBreak="true" BookingCode="W" CabinCode="Y" MealCode="N" SeatsAvailable="9"/>
              <BrandFeature Ref="44"/>
              <BrandFeature Ref="80"/>
              <BrandFeature Ref="28"/>
              <BrandFeature Ref="61"/>
              <BrandFeature Ref="38"/>
              <BrandFeature Ref="9"/>
              <BrandFeature Ref="41"/>
              <BrandFeature Ref="5"/>
              <BrandFeature Ref="37"/>
              <BrandFeature Ref="24"/>
              <BrandFeature Ref="50"/>
              <BrandFeature Ref="45"/>
              <BrandFeature Ref="15"/>
              <BrandFeature Ref="58"/>
              <BrandFeature Ref="33"/>
            </FareComponent>
            <Tax Ref="13"/>
            <Tax Ref="8"/>
            <Tax Ref="53"/>
            <Tax Ref="10"/>
            <Tax Ref="29"/>
            <Tax Ref="15"/>
            <Tax Ref="38"/>
            <Tax Ref="19"/>
            <TaxSummary Ref="43"/>
            <TaxSummary Ref="67"/>
            <TaxSummary Ref="19"/>
            <CurrencyConversion ExchangeRateUsed="1" From="RUB" To="RUB"/>
            <FareMessage Carrier="U6" Code="0" Info="NONEND" Type="N"/>
            <FareMessage Code="0" Info="EACH CNN REQUIRES ACCOMPANYING SAME CABIN ADT" Type="W"/>
            <FareMessage Code="0" Info="VALIDATING CARRIER" Type="W"/>
            <FareMessage Code="0" Info="BSP - U6" Type="W"/>
            <FareMessage Code="0" Info="GEN - U6" Type="W"/>
            <FareMessage Code="0" Info="TCH - U6" Type="W"/>
            <FareMessage Code="0" Info="CAT 15 SALES RESTRICTIONS FREE TEXT FOUND - VERIFY RULES" Type="W"/>
            <PassengerTotalFare BaseFareAmount="960" BaseFareCurrency="RUB" CommissionAmount="0" CommissionPercentage="0" ConstructionAmount="960" ConstructionCurrency="RUB" Currency="RUB" EquivalentAmount="960" EquivalentCurrency="RUB" ExchangeRateOne="76.8000000" TotalFare="6286" TotalTaxes="5326"/>
            <BaggageInformation AirlineCode="U6" ProvisionType="A">
              <Segment ID="0"/>
              <Allowance Ref="9"/>
            </BaggageInformation>
            <BaggageInformation AirlineCode="U6" ProvisionType="A">
              <Segment ID="1"/>
              <Allowance Ref="9"/>
            </BaggageInformation>
            <PenaltiesInfo>
              <Penalty Amount="0" Applicability="Before" Changeable="true" ConditionsApply="true" Currency="RUB" Type="Exchange"/>
              <Penalty Amount="3000" Applicability="After" Changeable="true" ConditionsApply="true" Currency="RUB" Type="Exchange"/>
              <Penalty Applicability="Before" Refundable="false" Type="Refund"/>
              <Penalty Applicability="After" Refundable="false" Type="Refund"/>
            </PenaltiesInfo>
          </PassengerInfo>
          <PassengerInfo NonRefundable="false" PassengerNumber="1" PassengerType="INF">
            <FareComponent Ref="54">
              <Segment AvailabilityBreak="true" BookingCode="W" CabinCode="Y" MealCode="N" SeatsAvailable="9"/>
              <BrandFeature Ref="44"/>
              <BrandFeature Ref="80"/>
              <BrandFeature Ref="28"/>
              <BrandFeature Ref="61"/>
              <BrandFeature Ref="38"/>
              <BrandFeature Ref="9"/>
              <BrandFeature Ref="41"/>
              <BrandFeature Ref="5"/>
              <BrandFeature Ref="37"/>
              <BrandFeature Ref="24"/>
              <BrandFeature Ref="50"/>
              <BrandFeature Ref="45"/>
              <BrandFeature Ref="15"/>
              <BrandFeature Ref="58"/>
              <BrandFeature Ref="33"/>
            </FareComponent>
            <FareComponent Ref="132">
              <Segment AvailabilityBreak="true" BookingCode="W" CabinCode="Y" MealCode="N" SeatsAvailable="9"/>
              <BrandFeature Ref="44"/>
              <BrandFeature Ref="80"/>
              <BrandFeature Ref="28"/>
              <BrandFeature Ref="61"/>
              <BrandFeature Ref="38"/>
              <BrandFeature Ref="9"/>
              <BrandFeature Ref="41"/>
              <BrandFeature Ref="5"/>
              <BrandFeature Ref="37"/>
              <BrandFeature Ref="24"/>
              <BrandFeature Ref="50"/>
              <BrandFeature Ref="45"/>
              <BrandFeature Ref="15"/>
              <BrandFeature Ref="58"/>
              <BrandFeature Ref="33"/>
            </FareComponent>
            <CurrencyConversion ExchangeRateUsed="1" From="RUB" To="RUB"/>
            <FareMessage Carrier="U6" Code="0" Info="NONEND" Type="N"/>
            <FareMessage Code="0" Info="EACH INF REQUIRES ACCOMPANYING ADT PASSENGER" Type="W"/>
            <FareMessage Code="0" Info="VALIDATING CARRIER" Type="W"/>
            <FareMessage Code="0" Info="BSP - U6" Type="W"/>
            <FareMessage Code="0" Info="GEN - U6" Type="W"/>
            <FareMessage Code="0" Info="TCH - U6" Type="W"/>
            <FareMessage Code="0" Info="CAT 15 SALES RESTRICTIONS FREE TEXT FOUND - VERIFY RULES" Type="W"/>
            <PassengerTotalFare BaseFareAmount="0" BaseFareCurrency="RUB" CommissionAmount="0" CommissionPercentage="0" ConstructionAmount="0" ConstructionCurrency="RUB" Currency="RUB" EquivalentAmount="0" EquivalentCurrency="RUB" ExchangeRateOne="76.8000000" TotalFare="0" TotalTaxes="0"/>
            <BaggageInformation AirlineCode="U6" ProvisionType="A">
              <Segment ID="0"/>
              <Allowance Ref="9"/>
            </BaggageInformation>
            <BaggageInformation AirlineCode="U6" ProvisionType="A">
              <Segment ID="1"/>
              <Allowance Ref="9"/>
            </BaggageInformation>
            <PenaltiesInfo>
              <Penalty Amount="0" Applicability="Before" Changeable="true" ConditionsApply="true" Currency="RUB" Type="Exchange"/>
              <Penalty Amount="0" Applicability="After" Changeable="true" ConditionsApply="true" Currency="RUB" Type="Exchange"/>
              <Penalty Applicability="Before" Refundable="false" Type="Refund"/>
              <Penalty Applicability="After" Refundable="false" Type="Refund"/>
            </PenaltiesInfo>
          </PassengerInfo>
          <AncillaryFeeGroup>
            <AncillaryFee Code="BG" Name="BAGGAGE">
              <Details Amount="2500" AncillaryTypeCode="F" BaggageID="1" Carrier="U6" Code="ALL" DepartureDate="2020-09-01" Description="FIRST EXCESS BAG" Description1="FIRST BAG" Destination="AER" EndSegment="1" Origin="DME" StartSegment="1" Subcode="0CC"/>
              <Details Amount="2500" AncillaryTypeCode="F" BaggageID="2" Carrier="U6" Code="ALL" DepartureDate="2020-09-01" Description="SECOND EXCESS BAG" Description1="SECOND BAG" Destination="AER" EndSegment="1" Origin="DME" StartSegment="1" Subcode="0CD"/>
              <Details Amount="2500" AncillaryTypeCode="F" BaggageID="3" Carrier="U6" Code="ALL" DepartureDate="2020-09-01" Description="THIRD EXCESS BAG" Description1="THIRD BAG" Destination="AER" EndSegment="1" Origin="DME" StartSegment="1" Subcode="0CE"/>
              <Details Amount="2000" AncillaryTypeCode="F" BaggageID="4" Carrier="U6" Code="ALL" DepartureDate="2020-09-01" Description="UPTO22LB 10KG BAGGAGE" Description1="UP TO 22 POUNDS/10 KILOGRAMS" Destination="AER" EndSegment="1" Origin="DME" StartSegment="1" Subcode="0CZ"/>
              <Details Amount="2000" AncillaryTypeCode="F" BaggageID="5" Carrier="U6" Code="ALL" DepartureDate="2020-09-01" Description="EXCESS WEIGHT SPECIAL CHARGE" Description1="EXCESS WEIGHT" Description2="SPECIAL CHARGE" Destination="AER" EndSegment="1" Origin="DME" StartSegment="1" Subcode="0H6"/>
              <Details Amount="2500" AncillaryTypeCode="F" BaggageID="6" Carrier="U6" Code="ALL" DepartureDate="2020-09-01" Description="EXTRA CARRYON BG" Description1="EXCESS SIZE" Description2="SPECIAL CHARGE" Destination="AER" EndSegment="1" Origin="DME" StartSegment="1" Subcode="0H7"/>
              <Details Amount="2500" AncillaryTypeCode="F" BaggageID="7" Carrier="U6" Code="ALL" DepartureDate="2020-09-01" Description="CARRY ON HAND BAGGAGE" Destination="AER" EndSegment="1" Origin="DME" StartSegment="1" Subcode="0L5" Subgroup="CY"/>
              <Details Amount="2500" AncillaryTypeCode="F" BaggageID="8" Carrier="U6" Code="ALL" DepartureDate="2020-09-08" Description="FIRST EXCESS BAG" Description1="FIRST BAG" Destination="DME" EndSegment="2" Origin="AER" StartSegment="2" Subcode="0CC"/>
              <Details Amount="2500" AncillaryTypeCode="F" BaggageID="9" Carrier="U6" Code="ALL" DepartureDate="2020-09-08" Description="SECOND EXCESS BAG" Description1="SECOND BAG" Destination="DME" EndSegment="2" Origin="AER" StartSegment="2" Subcode="0CD"/>
              <Details Amount="2500" AncillaryTypeCode="F" BaggageID="10" Carrier="U6" Code="ALL" DepartureDate="2020-09-08" Description="THIRD EXCESS BAG" Description1="THIRD BAG" Destination="DME" EndSegment="2" Origin="AER" StartSegment="2" Subcode="0CE"/>
              <Details Amount="2000" AncillaryTypeCode="F" BaggageID="11" Carrier="U6" Code="ALL" DepartureDate="2020-09-08" Description="UPTO22LB 10KG BAGGAGE" Description1="UP TO 22 POUNDS/10 KILOGRAMS" Destination="DME" EndSegment="2" Origin="AER" StartSegment="2" Subcode="0CZ"/>
              <Details Amount="2000" AncillaryTypeCode="F" BaggageID="12" Carrier="U6" Code="ALL" DepartureDate="2020-09-08" Description="EXCESS WEIGHT SPECIAL CHARGE" Description1="EXCESS WEIGHT" Description2="SPECIAL CHARGE" Destination="DME" EndSegment="2" Origin="AER" StartSegment="2" Subcode="0H6"/>
              <Details Amount="2500" AncillaryTypeCode="F" BaggageID="13" Carrier="U6" Code="ALL" DepartureDate="2020-09-08" Description="EXTRA CARRYON BG" Description1="EXCESS SIZE" Description2="SPECIAL CHARGE" Destination="DME" EndSegment="2" Origin="AER" StartSegment="2" Subcode="0H7"/>
              <Details Amount="2500" AncillaryTypeCode="F" BaggageID="14" Carrier="U6" Code="ALL" DepartureDate="2020-09-08" Description="CARRY ON HAND BAGGAGE" Destination="DME" EndSegment="2" Origin="AER" StartSegment="2" Subcode="0L5" Subgroup="CY"/>
            </AncillaryFee>
            <OrderStandardBag>
              <PassengerBags Code="ADT">
                <BaggageSequenceOrder BaggageRef="1" StandardBag="1"/>
                <BaggageSequenceOrder BaggageRef="2" StandardBag="2"/>
                <BaggageSequenceOrder BaggageRef="3" StandardBag="3"/>
                <BaggageSequenceOrder BaggageRef="8" StandardBag="1"/>
                <BaggageSequenceOrder BaggageRef="9" StandardBag="2"/>
                <BaggageSequenceOrder BaggageRef="10" StandardBag="3"/>
              </PassengerBags>
              <PassengerBags Code="CNN">
                <BaggageSequenceOrder BaggageRef="1" StandardBag="1"/>
                <BaggageSequenceOrder BaggageRef="2" StandardBag="2"/>
                <BaggageSequenceOrder BaggageRef="3" StandardBag="3"/>
                <BaggageSequenceOrder BaggageRef="8" StandardBag="1"/>
                <BaggageSequenceOrder BaggageRef="9" StandardBag="2"/>
                <BaggageSequenceOrder BaggageRef="10" StandardBag="3"/>
              </PassengerBags>
              <PassengerBags Code="INF">
                <BaggageSequenceOrder BaggageRef="1" StandardBag="1"/>
                <BaggageSequenceOrder BaggageRef="2" StandardBag="2"/>
                <BaggageSequenceOrder BaggageRef="3" StandardBag="3"/>
                <BaggageSequenceOrder BaggageRef="8" StandardBag="1"/>
                <BaggageSequenceOrder BaggageRef="9" StandardBag="2"/>
                <BaggageSequenceOrder BaggageRef="10" StandardBag="3"/>
              </PassengerBags>
            </OrderStandardBag>
          </AncillaryFeeGroup>
          <TotalFare BaseFareAmount="3520" BaseFareCurrency="RUB" ConstructionAmount="3520" ConstructionCurrency="RUB" Currency="RUB" EquivalentAmount="3520" EquivalentCurrency="RUB" TotalPrice="19946" TotalTaxes="16426"/>
          <ValidatingCarrier Ref="14"/>
          <ValidatingCarrier Ref="4"/>
          <ValidatingCarrier Ref="6"/>
        </Fare>
      </PricingInformation>
      <DiversitySwapper WeighedPrice="14753.162"/>
    </Itinerary>
    <!--Другие варианты перелетов-->
  </ItineraryGroup>
  <!--Другие маршруты-->
</GroupedItineraryResponse>
{% endxmlsec %}
