---
title: Поиск перелетов по заданным датам
aliases:
    - /alternate-airports
    - /shop-alternate-airports
    - /search
---

{{< toc >}}

## Введение

Для поиска перелетов по заданным датам используется сервис Bargain Finder Max ([BargainFinderMaxRQ](https://developer.sabre.com/docs/soap_apis/air/search/bargain_finder_max)). Дополнительную информацию по работе с сервисом можно получить в [онлайн-справке](https://developer.sabre.com/docs/soap_apis/air/search/bargain_finder_max/help_doc).

Ниже указаны некоторые обязательные и опциональные элементы запроса к сервису.

## Маршрут и даты

#### Обязательные элементы

Маршрут в поисковом запросе задается в последовательно расположенных элементах ```/OTA_AirLowFareSearchRQ/OriginDestinationInformation```, соответствующих плечам маршрута. Плечо может содержать один или несколько сегментов (рейсов). Для каждого плеча маршрута необходимо указать:

- ```/@RPH``` — номер запрашиваемого плеча
- ```/DepartureDateTime``` — дата и время вылета. Время вылета является обязательным для заполнения, рекомендуется во всех случаях указывать время ```11:00```
- ```/OriginLocation/@LocationCode``` — код города или аэропорта вылета
- ```/DestinationLocation/@LocationCode``` — код города или аэропорта прилета

{{< details title="Поиск перелетов по маршруту Сидней-Лондон-Сидней" open=true >}}
```XML
<OriginDestinationInformation RPH="1">
  <DepartureDateTime>2022-12-01T11:00:00</DepartureDateTime>
  <OriginLocation LocationCode="SYD"/>
  <DestinationLocation LocationCode="LON"/>
</OriginDestinationInformation>
<OriginDestinationInformation RPH="2">
  <DepartureDateTime>2022-09-08T11:00:00</DepartureDateTime>
  <OriginLocation LocationCode="LON"/>
  <DestinationLocation LocationCode="SYD"/>
</OriginDestinationInformation>
```
{{< /details >}}

#### Тип пунктов вылета и прилета

Для каждого пункта вылета и прилета на маршруте можно установить его тип:
- значение ```A``` — аэропорт
- значение ```C``` — город (вариант по умолчанию, если не указано никакое значение, а город и аэропорт имеют одинаковый код)

Для этого необходимо указать одно из вышеперечисленных значений в ```/OTA_AirLowFareSearchRQ/OriginDestinationInformation/OriginLocation/@LocationType``` (пункт вылета) или ```/OTA_AirLowFareSearchRQ/OriginDestinationInformation/DestinationLocation/@LocationType``` (пункт прилета). Данная опция может быть актуальна в случае совпадения кодов у города и аэропорта.

#### Альтернативные аэропорты

Для поиска перелетов с альтернативными аэропортами в [BargainFinderMaxRQ](https://developer.sabre.com/docs/soap_apis/air/search/bargain_finder_max) можно или указать альтернативные коды аэропортов и городов в запросе или указать радиус для автоматического выбора альтернативных аэропортов:
- ```/OTA_AirLowFareSearchRQ/OriginDestinationInformation/TPA_Extensions/SisterDestinationLocation/@LocationCode``` — альтернативные коды городов или аэропортов вылета (не более 4)
- ```/OTA_AirLowFareSearchRQ/OriginDestinationInformation/TPA_Extensions/SisterOriginLocation/@LocationCode``` — альтернативные коды городов или аэропортов прилета (не более 4)
- ```/OTA_AirLowFareSearchRQ/OriginDestinationInformation/TPA_Extensions/SisterDestinationMileage/@Number``` — максимальное расстояние в милях для автоматического поиска альтернативных аэропортов вылета (не более ```100```)
- ```/OTA_AirLowFareSearchRQ/OriginDestinationInformation/TPA_Extensions/SisterOriginMileage/@Number``` — максимальное расстояние в милях для поиска альтернативных аэропортов прилета (не более ```100```)

Если указать значение ```true``` у атрибутов ```/SisterDestinationMileage/@AllowBorderCross``` или ```/SisterOriginMileage/@AllowBorderCross```, то альтернативные аэропорт будут найдены только в той же стране, что и указанный в запросе аэропорт или город.

{{< details title="Поиск перелетов с альтернативными аэропортами" open=true >}}
```XML
<OriginDestinationInformation RPH="1">
  <DepartureDateTime>2022-09-01T11:00:00</DepartureDateTime>
  <OriginLocation LocationCode="BER"/>
  <DestinationLocation LocationCode="PAR"/>
  <TPA_Extensions>
    <SisterDestinationLocation LocationCode="NCE"/>
    <SisterDestinationLocation LocationCode="BRU"/>
    <SisterOriginLocation LocationCode="FRA"/>
    <SisterOriginLocation LocationCode="MUC"/>
  </TPA_Extensions>
</OriginDestinationInformation>
```
{{< /details >}}

{{< details title="Поиск перелетов с альтернативными аэропортами" open=true >}}
```XML
<OriginDestinationInformation RPH="1">
  <DepartureDateTime>2022-09-01T11:00:00</DepartureDateTime>
  <OriginLocation LocationCode="BER"/>
  <DestinationLocation LocationCode="PAR"/>
  <TPA_Extensions>
    <SisterDestinationMileage Number="100"/>
    <SisterOriginMileage Number="100"/>
  </TPA_Extensions>
</OriginDestinationInformation>
```
{{< /details >}}

#### Время в пути и время вылета

В запросе можно установить требуемый промежуток времени вылета или прилета:
- ```/OTA_AirLowFareSearchRQ/OriginDestinationInformation/DepartureWindow``` — промежуток допустимого времени вылета (например, ```10002000``` для вылета в промежуток с 10:00 до 20:00)
- ```/OTA_AirLowFareSearchRQ/OriginDestinationInformation/ArrivalWindow``` — промежуток допустимого времени прилета

Время в пути для каждого плеча, включая время пересадок:
- ```/OTA_AirLowFareSearchRQ/OriginDestinationInformation/TPA_Extensions/TotalTravelTime/@Min``` — минимальное время
- ```/OTA_AirLowFareSearchRQ/OriginDestinationInformation/TPA_Extensions/TotalTravelTime/@Max``` — максимальное время

Альтернативное время вылета:
- ```/OTA_AirLowFareSearchRQ/OriginDestinationInformation/TPA_Extensions/AlternateTime/@PlusMinus``` — количество часов, на которое может отличаться время вылета у найденных рейсов относительно заданного для каждого плеча (не более ```9```)
- ```/OTA_AirLowFareSearchRQ/OriginDestinationInformation/TPA_Extensions/AlternateTime/@Minus``` — количество часов, на которое может быть меньше время вылета у найденных рейсов относительно заданного для каждого плеча (не более ```72```)

#### Поиск с известными рейсами

Для поиска рекомендаций, в котором рейсы для одного или нескольких плеч уже известны, необходимо для каждого такого плеча указать:
- ```/OTA_AirLowFareSearchRQ/OriginDestinationInformation/@Fixed``` — признак того, что для этого плеча будет применен указанный рейс, значение ```true```
- ```/OTA_AirLowFareSearchRQ/OriginDestinationInformation/TPA_Extensions/Flight``` — данные о рейсе:
    - ```/@ArrivalDateTime``` — дата и время прибытия рейса
    - ```/@DepartureDateTime``` — дата и время отправления рейса
    - ```/@Number``` — номер рейса
    - ```/@Type``` — всегда ```A```
    - ```/OriginLocation/@LocationCode``` — аэропорт прибытия
    - ```/DestinationLocation/@LocationCode``` — аэропорт отправления
    - ```/Airline/@Marketing``` — код маркетингового перевозчика
    - ```/Airline/@Operating``` — код оперирующего перевозчика

{{< details title="Поиск перелетов с известными рейсами на втором плече" open=true >}}
```XML
<OriginDestinationInformation RPH="1">
  <DepartureDateTime>2022-12-01T11:00:00</DepartureDateTime>
  <OriginLocation LocationCode="SYD"/>
  <DestinationLocation LocationCode="LON"/>
</OriginDestinationInformation>
<OriginDestinationInformation RPH="2">
  <DepartureDateTime>2022-12-08T08:30:00</DepartureDateTime>
  <OriginLocation LocationCode="LON"/>
  <DestinationLocation LocationCode="SYD"/>
    <TPA_Extensions>
      <Flight ArrivalDateTime="2022-12-08T19:20:00" DepartureDateTime="2022-12-08T08:30:00" Number="12" Type="A">
        <OriginLocation LocationCode="LHR"/>
        <DestinationLocation LocationCode="AUH"/>
        <Airline Marketing="EY" Operating="EY"/>
      </Flight>
      <Flight ArrivalDateTime="2022-12-09T17:55:00" DepartureDateTime="2022-12-08T22:10:00" Number="464" Type="A">
        <OriginLocation LocationCode="AUH"/>
        <DestinationLocation LocationCode="SYD"/>
        <Airline Marketing="EY" Operating="EY"/>
      </Flight>
    </TPA_Extensions>
</OriginDestinationInformation>
```
{{< /details >}}

## Остановки и пересадки

Максимальное количество остановок (как со сменой рейса, так и без нее) для всех плеч маршрута задается в атрибуте ```/OTA_AirLowFareSearchRQ/TravelPreferences/@MaxStopsQuantity```.

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

По умолчанию в поисковой выдаче будут представлены только те рекомендации, у которых каждая пересадка не больше:
- 5 часов (300 минут) — для внутренних перелетов
- 13 часов (780 минут) — для международных перелетов

Для того чтобы получить рекомендации с более продолжительными пересадками в запросе к сервису необходимо указать значение ```true``` у атрибута ```/OTA_AirLowFareSearchRQ/TravelPreferences/TPA_Extensions/LongConnectTime/@Enable```.

В этом случае система выполнит два запроса для поиска расписаний (комбинаций рейсов) и объединит полученные результаты в ответе:

| Тип запроса | Обычный поиск | Поиск с длинными пересадками (Long Connect) |
|---|---|---|
| Минимальная продолжительность пересадки | Минимальная продолжительность пересадки, установленная в каждом аэропорту (Minimum Connect Time) | 5 часов для внутренних перелетов, 13 часов для международных перелетов |
| Максимальная продолжительность пересадки | 5 часов для внутренних перелетов, 13 часов для международных перелетов | 24 часа |

Для поиска с длинными пересадками можно дополнительно установить:
- ```/OTA_AirLowFareSearchRQ/TravelPreferences/TPA_Extensions/LongConnectPoints/@Min``` — минимальное количество пересадок
- ```/OTA_AirLowFareSearchRQ/TravelPreferences/TPA_Extensions/LongConnectPoints/@Max``` — максимальное количество пересадок

{{< details title="Рекомендуемые параметры для поиска перелетов с длинными пересадками" open=true >}}
```XML
<LongConnectTime Enable="true"/>
<LongConnectPoints Max="3" Min="1"/>
```
{{< /details >}}

Для каждого плеча в запросе можно указать необходимость совершения пересадки длиной более 24 часов (stopover) в определенном месте. Для этого в запросе необходимо указать:
- ```/OTA_AirLowFareSearchRQ/OriginDestinationInformation/TPA_Extensions/Stopover/StopoverPoint/@LocationCode``` — код города или аэропорта для пересадки длиной более 24 часов
- ```/OTA_AirLowFareSearchRQ/OriginDestinationInformation/TPA_Extensions/Stopover/DepartureDateTime``` — дата вылета из пункта пересадки длиной более 24 часов в пункт назначения

{{< hint warning >}}
Обратите внимание на то, что для каждого плеча можно указать только один пункт пересадки длиной более 24 часов!
{{< /hint >}}

Дополнительно можно указать:
- ```/OTA_AirLowFareSearchRQ/OriginDestinationInformation/TPA_Extensions/Stopover/DepartureWindow``` — промежуток допустимого времени вылета из пункта пересадки длиной более 24 часов (например, ```10002000``` для вылета в промежуток с 10:00 до 20:00)
- ```/OTA_AirLowFareSearchRQ/OriginDestinationInformation/TPA_Extensions/Stopover/StopoverPoint/@LocationType``` — тип пункта пересадки длиной более 24 часов (актуально в случае совпадения кодов у города и аэропорта):
    - значение ```A``` — аэропорт
    - значение ```C``` — город (вариант по умолчанию, если не указано никакое значение, а город и аэропорт имеют одинаковый код)

{{< details title="Поиск перелетов MOW-NYC с пересадкой длиной более 24 часов в IST и временем вылета в промежутке 10:00—22:00" open=true >}}
```XML
<OriginDestinationInformation RPH="1">
  <DepartureDateTime>2022-09-01T11:00:00</DepartureDateTime>
  <OriginLocation LocationCode="MOW"/>
  <DestinationLocation LocationCode="NYC"/>
  <TPA_Extensions>
    <Stopover>
      <DepartureDateTime>2022-09-03T00:00:00</DepartureDateTime>
      <DepartureWindow>10002200</DepartureWindow>
      <StopoverPoint LocationCode="IST" LocationType="C"/>
    </Stopover>
  </TPA_Extensions>
</OriginDestinationInformation>
```
{{< /details >}}

## Пассажиры

Количество мест должно быть задано в элементе ```/OTA_AirLowFareSearchRQ/TravelerInfoSummary/SeatsRequested```.

{{< hint warning >}}
Обратите внимание на то, что количество пассажиров может отличаться от количества мест в том случае, если производится поиск перелетов для младенцев без места.
{{< /hint >}}

Категории пассажиров задаются в последовательно расположенных элементах ```/OTA_AirLowFareSearchRQ/TravelerInfoSummary/AirTravelerAvail/PassengerTypeQuantity```. Для каждой категории пассажира необходимо указать:
- ```/@Code``` — код категории пассажира
- ```/@Quantity``` — количество пассажиров данной категории

Коды основных категорий пассажиров:
- ```ADT``` — взрослый пассажир (от 12 лет)
- ```CNN``` — ребенок (от 2 до 12 лет)
- ```INF``` — младенец без места (до 2 лет)
- ```INS``` — младенец с местом (до 2 лет)

{{< hint warning >}}
Обратите внимание на то, что в некоторых случаях возраст ребенка может влиять стоимость перелета. В этих случаях рекомендуется указывать возраст ребенка в коде категории пассажира. Например, ```C05``` для пятилетнего ребенка.
{{< /hint >}}

## Классы обслуживания и коды тарифов

#### Выбор класса обслуживания

Класс обслуживания задается в элементе ```/OTA_AirLowFareSearchRQ/TravelPreferences/CabinPref```. В качестве атрибутов необходимо указать:
- ```/@PreferLevel``` — выбран предпочтительный класс обслуживания (значение ```Preferred```)
- ```/@Cabin``` — код или название класса обслуживания

Допустимые варианты кодов и названий классов обслуживания:
- ```Economy``` или ```Y``` — экономический класс
- ```PremiumEconomy``` или ```S``` — улучшенный экономический класс
- ```Business``` или ```C``` — бизнес класс
- ```PremiumBusiness``` или ```J``` — улучшенный бизнес класс
- ```First``` или ```F``` — первый класс
- ```PremiumFirst``` или ```P``` — улучшенный первый класс

По умолчанию, если в запросе не указан класс обслуживания, поиск будет производиться так, будто указан экономический класс обслуживания. 

Класс обслуживания также может быть задан для каждого плеча в запросе в элементе ```/OTA_AirLowFareSearchRQ/OriginDestinationInformation/TPA_Extensions/CabinPref```. В качестве атрибутов необходимо указать:
- ```/@PreferLevel``` — выбран предпочтительный класс обслуживания (значение ```Preferred```)
- ```/@Cabin``` — код или название класса обслуживания

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
- ```/@Code``` — класс бронирования
- ```/@PreferLevel``` — добавление класса бронирования в белый (значение ```Preferred```) или черный (значение ```Unacceptable```) список

Черный и белый список классов бронирования для каждого плеча задается в последовательно расположенных элементах ```/OTA_AirLowFareSearchRQ/OriginDestinationInformation/TPA_Extensions/ClassOfService```. Для каждого класса бронирования необходимо указать:
- ```/@Code``` — класс бронирования
- ```/@PreferLevel``` — добавление класса бронирования в белый (значение ```Preferred```) или черный (значение ```Unacceptable```) список

#### Черный и белый список кодов тарифов

Черный и белый список кодов тарифов (*не классов обслуживания!*) для всего запрошенного маршрута задается в последовательно расположенных элементах ```/OTA_AirLowFareSearchRQ/TravelPreferences/TPA_Extensions/FareBasis```. Для каждого кода тарифа необходимо указать:
- ```/@Code``` — код тарифа
- ```/@PreferLevel``` — добавление кода тарифа в белый (значение ```Preferred```) или черный (значение ```Unacceptable```) список

Черный и белый список классов бронирования для каждого плеча задается в последовательно расположенных элементах ```/OTA_AirLowFareSearchRQ/OriginDestinationInformation/TPA_Extensions/FareBasis```. Для каждого класса бронирования необходимо указать:
- ```/@Code``` — код тарифа
- ```/@PreferLevel``` — добавление кода тарифа в белый (значение ```Preferred```) или черный (значение ```Unacceptable```) список

Также сервис позволяет указать вместо кода тарифа маску поиска кода тарифа, в котором помимо букв латинского алфавита и цифр можно использовать следующие спецсимволы:
- ```-``` — ноль или более символов. Например, под условия маски ```Y-OW``` подпадут тарифы ```YOW```, ```YLTOW``` и ```YSTDOW```
- ```?``` — один символ. Например, под условия маски ```Y??OW``` подпадут тарифы ```YPROW``` и ```YECOW```
- ```^X``` — один символ кроме ```X``` (вместо ```X``` может быть указана любая буква латинского алфавита или цифра). Например, под условия маски ```^YLTOW``` подпадут тарифы ```NLTOW```, ```ELTOW```, но не подпадет ```YLTOW```

## Перевозчики

#### Черный и белый список маркетинговых и оперирующих перевозчиков для всего запрошенного маршрута

Черный и белый список маркетинговых и оперирующих перевозчиков для всего запрошенного маршрута задается в последовательно расположенных элементах ```/OTA_AirLowFareSearchRQ/TravelPreferences/VendorPref```. Для каждого перевозчика необходимо указать:
- ```/@Code``` — двухбуквенный код перевозчика
- ```/@PreferLevel``` — добавление перевозчика в белый (значение ```Preferred```) или черный (значение ```Unacceptable```) список
- ```/@Type``` — тип перевозчика. Возможные значения:
    - значение ```Operating``` — оперирующий перевозчик
    - значение ```Marketing``` — маркетинговый перевозчик (вариант по умолчанию в случае отсутствия любого значения)

Дополнительно в запросе можно указать применимость белого списка перевозчиков: ко всем сегментам каждого найденного перелета или хотя бы к одному сегменту каждого найденного перелета. Для этого необходимо добавить элемент ```/OTA_AirLowFareSearchRQ/TravelPreferences/VendorPrefApplicability``` со следующими атрибутами:
- ```/@Value``` — вариант применимости. Возможные значения:
    - значение ```AllSegments``` — для всех сегментов
    - значение ```AtLeastOneSegment``` — хотя бы для одного сегмента
- ```/@Type``` — тип перевозчика. Возможные значения:
    - значение ```Operating``` — оперирующий перевозчик
    - значение ```Marketing``` — маркетинговый перевозчик

Максимум можно добавить два элемента: один для белого списка оперирующих перевозчиков и один для белого списка маркетинговых перевозчиков.

Помимо этого, в последовательно расположенных элементах ```/OTA_AirLowFareSearchRQ/TravelPreferences/VendorPrefPairing``` можно указать комбинации маркетинговых и оперирующих перевозчиков для черного или белого списков. Для каждого элемента необходимо указать:
- ```/@Applicability``` — вариант применимости. Возможные значения:
    - значение ```AllSegments``` — для всех сегментов
    - значение ```AtLeastOneSegment``` — хотя бы для одного сегмента
- ```/@PreferLevel``` — добавление перевозчиков в белый (значение ```Preferred```) или черный (значение ```Unacceptable```) список
- ```/VendorPref``` — элемент с информацией о включении перевозчика в белый или черный список. Для каждого перевозчика необходимо указать:
    - ```/@Code``` — двухбуквенный код перевозчика
    - ```/@Type``` — тип перевозчика. Возможные значения:
        - значение ```Operating``` — оперирующий перевозчик
        - значение ```Marketing``` — маркетинговый перевозчик (вариант по умолчанию в случае отсутствия любого значения)

{{< details title="В результатах поиска во всех рекомендациях во всех сегментов перевозчик XX будет маркетинговым, а XX, YY или ZZ — оперирующими" open=true >}}
```XML
<VendorPrefPairing Applicability="AllSegments" PreferLevel="Preferred">
  <VendorPref Code="XX" Type="Marketing"/>
  <VendorPref Code="XX" Type="Operating"/>
  <VendorPref Code="YY" Type="Operating"/>
  <VendorPref Code="ZZ" Type="Operating"/>
</VendorPrefPairing>
```
{{< /details >}}

{{< details title="В результатах поиска будут отсутствовать рекомендации с сегментами, в которых XX — маркетинговый перевозчик, а YY — оперирующий" open=true >}}
```XML
<VendorPrefPairing PreferLevel="Unacceptable">
  <VendorPref Code="XX" Type="Marketing"/>
  <VendorPref Code="YY" Type="Operating"/>
</VendorPrefPairing>
```
{{< /details >}}

Значение ```true``` у атрибута ```/OTA_AirLowFareSearchRQ/TravelPreferences/TPA_Extensions/ExcludeCallDirectCarriers/@Enabled``` позволяет не выдавать те рекомендации, которые невозможно забронировать в системе бронирования Sabre. Рекомендуется установить это значение у атрибута.

#### Черный и белый список альянсов для всего запрошенного маршрута

Белый список альянсов для всего запрошенного маршрута задается в последовательно расположенных элементах ```/OTA_AirLowFareSearchRQ/TravelPreferences/TPA_Extensions/IncludeAlliancePref```. Для каждого альянса необходимо указать его код в атрибуте ```/@Code```.

Черный список альянсов для всего запрошенного маршрута задается в последовательно расположенных элементах ```/OTA_AirLowFareSearchRQ/TravelPreferences/TPA_Extensions/ExcludeAlliancePref```. Для каждого альянса необходимо указать его код в атрибуте ```/@Code```.

#### Белый список маркетинговых перевозчиков и альянсов для отдельного сегмента

Белый список перевозчиков для отдельного сегмента задается в последовательно расположенных элементах ```/OTA_AirLowFareSearchRQ/OriginDestinationInformation/TPA_Extensions/IncludeVendorPref/@Code```.

Белый список альянсов для отдельного сегмента задается в последовательно расположенных элементах ```/OTA_AirLowFareSearchRQ/OriginDestinationInformation/TPA_Extensions/IncludeAlliancePref/@Code```.

Белые списки альянсов и перевозчиков для отдельного сегмента не могут быть указаны одновременно с белым списком альянсов и перевозчиков для всего маршрута. Т.е. необходимо выбрать или белый список для отдельного сегмента или для всего маршрута.

#### Интерлайн

По умолчанию Sabre ищет рекомендации без учета наличия интерлайн соглашений между перевозчиками. Это означает, что перевозчики могут не разрешать оформлять найденные рекомендации на одном билете. Для того чтобы при поиске перелетов происходила проверка на наличие интерлайн соглашения между перевозчиками, необходимо установить значение ```true``` у атрибута ```/OTA_AirLowFareSearchRQ/TravelPreferences/@ValidInterlineTicket``` в запросе.

Для того чтобы не получать в результатах поиска интерлайн перелеты (перелеты, содержащие несколько маркетинговых перевозчиков), необходимо указать значение ```true``` у атрибута ```/OTA_AirLowFareSearchRQ/TravelPreferences/TPA_Extensions/OnlineIndicator/@Ind```.

#### Кодшер

Для того чтобы исключить из результатов поиска рекомендации с кодшер рейсами (т.е. рейсами, у которых различаются маркетинговый и оперирующий перевозчик) необходимо указать значение ```true``` у атрибута ```/OTA_AirLowFareSearchRQ/TravelPreferences/TPA_Extensions/CodeShareIndicator/@ExcludeCodeshare```.
Если указать также значение ```true``` у атрибута ```/OTA_AirLowFareSearchRQ/TravelPreferences/TPA_Extensions/CodeShareIndicator/@ExcludeCodeshare/@KeepOnlines```, то из результатов поиска будут исключены рекомендации с кодшер рейсами, кроме тех рекомендаций, у которых отсутствует интерлайн (т.е. маркетинговый перевозчик у всех рейсов совпадает).

#### Выбор валидирующего перевозчика

{{< hint danger >}}
Обратите внимание на то, что указанные ниже параметры для управления выбором валидирующего перевозчика доступны только при включенной настройке [Validating Carrier, Interline, and GSA](tjr-settings.html#validating-carrier-interline-and-gsa-новая-логика-выбора-валидирующего-перевозчика)!
{{< /hint >}}

В результатах поиска можно получить все рекомендации для выбранного валидирующего перевозчика. Для этого необходимо указать его код в качестве значения атрибута ```/OTA_AirLowFareSearchRQ/TravelPreferences/TPA_Extensions/ValidatingCarrier/@Code```. Обратите внимание на то, что в этом случае могут быть получены такие рекомендации, у которых при поиске без данного параметра мог быть использован другой валидирующий перевозчик.

Черный список валидирующих перевозчиков задается в последовательно расположенных элементах ```/OTA_AirLowFareSearchRQ/TravelPreferences/TPA_Extensions/ValidatingCarrier/Preference```. Для каждого перевозчика необходимо указать:
- ```/@Code``` — двухбуквенный код перевозчика
- ```/@Level``` — значение ```Unacceptable```

Список приоритетных валидирующих перевозчиков задается в последовательно расположенных элементах ```/OTA_AirLowFareSearchRQ/TravelPreferences/TPA_Extensions/ValidatingCarrier/Preference```. Для каждого перевозчика необходимо указать:
- ```/@Code``` — двухбуквенный код перевозчика
- ```/@Level``` — значение ```Preferred```

Приоритетный валидирующий перевозчик будет выбран в том случае, если существует два или более валидирующих перевозчиков, которые предлагают одинаковую стоимость для одной и той же рекомендации. Если для какой-либо рекомендации перевозчик, указанный в списке приоритетных, не может быть валидирующим или он предлагает большую стоимость, то выбран будет другой валидирующий перевозчик.

## Багаж

#### Нормы провоза багажа

Для получения информации о нормах провоза багажа в структурированном виде (максимальное количество мест багажа или максимальный вес багажа) необходимо указать значение ```A``` у атрибута ```/OTA_AirLowFareSearchRQ/TravelPreferences/Baggage/@RequestType```.

Для получения дополнительной информации в текстовом виде (максимальный вес и размеры багажа) необходимо указать значение ```true``` у атрибута ```/OTA_AirLowFareSearchRQ/TravelPreferences/Baggage/@Description```.

Для получения информации о нормах провоза ручной клади на борту необходимо указать значение ```true``` у атрибута ```/OTA_AirLowFareSearchRQ/TravelPreferences/Baggage/@CarryOnInfo```.

#### Тарифы с багажом

Для поиска тарифов с багажом (как минимум одно бесплатное место провоза багажа) в запросе необходимо указать значение ```true``` у атрибута ```/OTA_AirLowFareSearchRQ/TravelPreferences/Baggage/@FreePieceRequired```. При поиске перелетов с [расчетом стоимости по всем доступным брендам](shop.html#расчет-стоимости-по-всем-доступным-брендам), в результатах поиска будут представлены только те брендированные тарифы, которые имеют как минимум одно бесплатное место провоза багажа.

{{< hint danger >}}
Обратите внимание на то, что для рекомендаций, которые были получены в результатах при поиске тарифов с багажом и, которые не являются брендированными, требуется особый порядок выполнения расчета стоимости и бронирования. См. подробнее в разделах [Создание бронирований в 1 шаг](create-booking-1step.html#расчет-стоимости-по-кодам-тарифов), [Создание бронирований в 2 шага](create-booking-2steps.html#расчет-стоимости-по-кодам-тарифов).
{{< /hint >}}

## Места в салоне

Для получения информации о возможности платного или бесплатного выбора места в салоне необходимо отправить значение ```true``` у атрибута ```/OTA_AirLowFareSearchRQ/TravelPreferences/TPA_Extensions/SeatSelection/@Info```.

## Брендированные тарифы

#### Информация о примененных брендированных тарифах

По умолчанию ответ на запрос не содержит информацию о примененных брендированных тарифах (код бренда, название бренда, код программы брендов и т.д.). Для того чтобы получить эту информацию, необходимо указать значение ```true``` у атрибута ```/OTA_AirLowFareSearchRQ/TravelerInfoSummary/PriceRequestInformation/TPA_Extensions/BrandedFareIndicators/@SingleBrandedFare```.

#### Расчет стоимости по всем доступным брендам

Для получения расчетов по всем доступным брендам для всех найденных рекомендаций необходимо указать значение ```true``` у атрибута ```/OTA_AirLowFareSearchRQ/TravelerInfoSummary/PriceRequestInformation/TPA_Extensions/BrandedFareIndicators/@MultipleBrandedFares```.

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

{{< hint warning >}}
Обратите внимание на то, что в одном поисковом запросе невозможно одновременное получение расчетов по всем брендам и получение [дополнительных расчетов стоимости по заданным критериям](shop.html#дополнительные-расчеты-стоимости-по-заданным-критериям).
{{< /hint >}}

#### Список услуг у найденных брендированных тарифов

Для получения списка услуг у найденных брендированных тарифов необходимо указать значение ```true``` у атрибута ```/OTA_AirLowFareSearchRQ/TravelerInfoSummary/PriceRequestInformation/TPA_Extensions/BrandedFareIndicators/@ReturnBrandAncillaries```. Эта опция может быть запрошена только при запросе информации о примененных брендированных тарифах (```/@SingleBrandedFare```) или при получении расчетов по всем доступным брендам (```/@MultipleBrandedFares```).

Подробнее см. в разделе [Брендированные тарифы](brands.html#список-услуг-у-брендированных-тарифов).

#### Черный и белый список брендов

Черный список брендов задается в последовательно расположенных элементах ```/OTA_AirLowFareSearchRQ/TravelerInfoSummary/PriceRequestInformation/TPA_Extensions/BrandedFareIndicators/BrandFilters/Brand``` (для всего маршрута) или ```/OTA_AirLowFareSearchRQ/OriginDestinationInformation/TPA_Extensions/BrandFilters/Brand``` (для плеча). Для каждого бренда необходимо указать:
- ```/@Code``` — код бренда
- ```/@Level``` — значение ```Unacceptable```

Белый список брендов задается в последовательно расположенных элементах ```/OTA_AirLowFareSearchRQ/TravelerInfoSummary/PriceRequestInformation/TPA_Extensions/BrandedFareIndicators/BrandFilters/Brand``` (для всего маршрута) или ```/OTA_AirLowFareSearchRQ/OriginDestinationInformation/TPA_Extensions/BrandFilters/Brand``` (для плеча). Для каждого бренда необходимо указать:
- ```/@Code``` — код бренда
- ```/@Level``` — значение ```Preferred```

{{< hint warning >}}
Обратите внимание на то, что даже передав один или несколько кодов брендов в белом списке, в ответе расчет для этого плеча может быть выполнен по небрендированному тарифу. Для того чтобы этого избежать, необходимо указать значение ```Unacceptable``` у атрибута ```/OTA_AirLowFareSearchRQ/TravelerInfoSummary/PriceRequestInformation/TPA_Extensions/BrandedFareIndicators/BrandFilters/NonBrandedFares/@PreferLevel``` (для всего маршрута) или ```/OTA_AirLowFareSearchRQ/OriginDestinationInformation/TPA_Extensions/BrandFilters/NonBrandedFares/@PreferLevel``` (для плеча). Для того чтобы расчет был выполнен только по небрендированным тарифам, необходимо указать значение ```Preferred``` у этого атрибута.
{{< /hint >}}

## Дополнительные расчеты стоимости по заданным критериям

Ответ [BargainFinderMaxRQ](https://developer.sabre.com/docs/soap_apis/air/search/bargain_finder_max) по умолчанию содержит расчет стоимости по самому дешевому доступному тарифу (или тарифам) для каждой найденной рекомендации. Описанная ниже функциональность позволяет получить дополнительные расчеты стоимости для каждой найденной рекомендации по указанным в запросе группам критериев. Таким образом, ответ на запрос к сервису [BargainFinderMaxRQ](https://developer.sabre.com/docs/soap_apis/air/search/bargain_finder_max) в этом случае может содержать несколько вариантов расчета стоимости одной и той же рекомендации:
- расчет стоимости по самому дешевому доступному тарифу (или тарифам)
- дополнительные расчеты стоимости по тарифам, выбранным по заданным в запросе группам критериев

Каждая группа критериев задается в последовательно расположенных элементах ```/OTA_AirLowFareSearchRQ/TravelPreferences/TPA_Extensions/FlexibleFares/FareParameters``` запроса. Всего один запрос может содержать до 10 групп критериев. Каждая группа критериев может содержать один или несколько критериев.

{{< hint warning >}}
Обратите внимание на то, что в одном поисковом запросе невозможно одновременное получение дополнительных расчетов стоимости по заданным критериям и [получение расчетов по всем брендам](shop.html#расчет-стоимости-по-всем-доступным-брендам).
{{< /hint >}}

Ниже представлено описание доступных критериев.

#### Количество и категории пассажиров

Различные категории пассажиров могут быть указаны в последовательно расположенных элементах ```/OTA_AirLowFareSearchRQ/TravelPreferences/TPA_Extensions/FlexibleFares/FareParameters/PassengerTypeQuantity```. У каждого элемента нужно указать код категории пассажира (атрибут ```/@Code```) и количество пассажиров данной категории (атрибут ```/@Quantity```).

{{< hint warning >}}
Обратите внимание на то, что общее количество пассажиров в одной группе критериев не должно превышать общее количество пассажиров в основном запросе.
{{< /hint >}}

#### Использование приватных или публичных тарифов

Для получения расчетов только по публичным или только по приватным тарифам необходимо указать значение ```true``` у атрибута ```/OTA_AirLowFareSearchRQ/TravelPreferences/TPA_Extensions/FlexibleFares/FareParameters/PublicFare/@Ind``` или ```/OTA_AirLowFareSearchRQ/TravelPreferences/TPA_Extensions/FlexibleFares/FareParameters/PrivateFare/@Ind```, соответственно.

Дополнительно в качестве критериев можно указать один или несколько Account Code и Corporate ID в последовательно расположенных элементах ```/OTA_AirLowFareSearchRQ/TravelPreferences/TPA_Extensions/FlexibleFares/FareParameters/AccountCode``` и ```/OTA_AirLowFareSearchRQ/TravelPreferences/TPA_Extensions/FlexibleFares/FareParameters/CorporateID```, соответственно. Сами коды указываются в атрибутах ```/@Code``` этих элементов.

По умолчанию даже с указанными Account Code или Corporate ID система может вернуть расчет по тарифу или тарифам, для расчета которого не применялись Account Code или Corporate ID, если этот тариф или тарифы дешевле, чем тарифы с Account Code или Corporate ID или, если тарифы с Account Code или Corporate ID отсутствуют или не применимы.

Однако, если указать значение ```true``` у атрибута ```/OTA_AirLowFareSearchRQ/TravelPreferences/TPA_Extensions/FlexibleFares/FareParameters/NegotiatedFaresOnly/@Ind```, то в полученном расчете для всех тарифов будут использованы указанные Account Code или Corporate ID.

Если указать значение ```true``` у атрибута ```/OTA_AirLowFareSearchRQ/TravelPreferences/TPA_Extensions/FlexibleFares/FareParameters/UseNegotiatedFares/@Ind```, то в полученном расчете как минимум для одного тарифа будут использованы указанные Account Code или Corporate ID.

#### Обмен и возврат

Условия по обмену и возврату билетов, а также получение информации об их условиях задается в элементе ```/OTA_AirLowFareSearchRQ/TravelPreferences/TPA_Extensions/FlexibleFares/FareParameters/VoluntaryChanges``` так же, как и для основного запроса (см. [Обмен и возврат билетов](shop.html#обмен-и-возврат-билетов)).

#### Выбор класса обслуживания

Класс обслуживания может быть указан в качестве значения атрибута ```/OTA_AirLowFareSearchRQ/TravelPreferences/TPA_Extensions/FlexibleFares/FareParameters/Cabin/@Type```. Допустимые варианты кодов и названий классов обслуживания:
- ```Economy``` или ```Y``` — экономический класс
- ```PremiumEconomy``` или ```S``` — улучшенный экономический класс
- ```Business``` или ```C``` — бизнес класс
- ```PremiumBusiness``` или ```J``` — улучшенный бизнес класс
- ```First``` или ```F``` — первый класс
- ```PremiumFirst``` или ```P``` — улучшенный первый класс

Для отключения логики выбора класса обслуживания необходимо указать значение ```true``` у атрибута ```/OTA_AirLowFareSearchRQ/TravelPreferences/TPA_Extensions/FlexibleFares/FareParameters/JumpCabinLogic/@Disabled``` или атрибута ```/OTA_AirLowFareSearchRQ/TravelPreferences/TPA_Extensions/FlexibleFares/FareParameters/KeepSameCabin/@Enabled```. Подробнее о том, как выбирается класс обслуживания и на что влияют указанные выше параметры см. [Классы обслуживания и коды тарифов](shop.html#выбор-класса-обслуживания).

#### Выбор класса бронирования

Черный и белый список классов бронирования задается в элементах ```/OTA_AirLowFareSearchRQ/TravelPreferences/TPA_Extensions/FlexibleFares/FareParameters/ClassOfService``` так же, как и для основного запроса (см. [Черный и белый список классов бронирования](shop.html#черный-и-белый-список-классов-бронирования)).

#### Выбор кода тарифа

Черный и белый список кодов тарифов задается в элементах ```/OTA_AirLowFareSearchRQ/TravelPreferences/TPA_Extensions/FlexibleFares/FareParameters/FareBasis``` так же, как и для основного запроса (см. [Черный и белый список кодов тарифов](shop.html#черный-и-белый-список-кодов-тарифов)).

#### Выбор брендов

Черный и белый список брендов задается в элементах ```/OTA_AirLowFareSearchRQ/TravelPreferences/TPA_Extensions/FlexibleFares/FareParameters/BrandedFareIndicators/BrandFilters/Brand``` так же, как и для основного запроса (см. [Черный и белый список брендов](shop.html#черный-и-белый-список-брендов)).

Для получения информации о примененных брендированных тарифах (код бренда, название бренда, код программы брендов и т.д.) необходимо указать значение ```true``` у атрибута ```/OTA_AirLowFareSearchRQ/TravelPreferences/TPA_Extensions/FlexibleFares/FareParameters/BrandedFareIndicators/@SingleBrandedFare```.

#### Выбор тарифов с багажом

Для запроса тарифов с багажом необходимо указать значение ```true``` у атрибута ```/OTA_AirLowFareSearchRQ/TravelPreferences/TPA_Extensions/FlexibleFares/FareParameters/Baggage/@FreePieceRequired```.

{{< hint danger >}}
Обратите внимание на то, что для рекомендаций, которые были получены в результатах при поиске тарифов с багажом и, которые не являются брендированными, требуется особый порядок выполнения расчета стоимости и бронирования. См. подробнее в разделах [Создание бронирований в 1 шаг](create-booking-1step.html#расчет-стоимости-по-кодам-тарифов), [Создание бронирований в 2 шага](create-booking-2steps.html#расчет-стоимости-по-кодам-тарифов).
{{< /hint >}}

#### Параметры плеча

В запросе можно указать параметры для каждого из запрашиваемого плеч. Для этого необходимо добавить элемент ```/OTA_AirLowFareSearchRQ/TravelPreferences/TPA_Extensions/FlexibleFares/FareParameters/Leg``` и указать в нем в качестве значения атрибута ```/@Num``` номер плеча.

Доступные параметры для каждого плеча:
```/Cabin``` — класс обслуживания (см. выше доступные значения)
```/ClassOfService``` — класс бронирования (см. выше доступные значения)
```/FareBasis``` — код тарифа (см. выше доступные значения)
```/BrandFilters/Brand``` — бренд (см. выше доступные значения)
```/Baggage``` — наличие багажа

#### Пример

В представленном ниже примере в дополнение к основному (самому дешевому) расчету стоимости запрашивается 5 дополнительных расчетов:
1. Расчет по тарифам с багажом
2. Расчет по тарифам, которые можно вернуть и обменять
3. Расчет по тарифам, которые можно вернуть и обменять со штрафом менее 1000 рублей
4. Расчет по тарифам бизнес-класса
5. Расчет по приватным тарифам

Для всех расчетов стоимости дополнительно будет:
- получена информация о примененных брендах
- получена информация об условиях обменов и возвратов
- получены тарифы только в запрашиваемом классе обслуживания

{{< details title="Пример" open=true >}}
```XML
<FlexibleFares>
  <FareParameters>
    <KeepSameCabin Enabled="true"/>
    <VoluntaryChanges Match="Info"/>
    <BrandedFareIndicators SingleBrandedFare="true"/>
    <Baggage FreePieceRequired="true"/>
  </FareParameters>
  <FareParameters>
    <KeepSameCabin Enabled="true"/>
    <VoluntaryChanges Match="All">
      <Penalty Type="Exchange"/>
      <Penalty Type="Refund"/>
    </VoluntaryChanges>
    <BrandedFareIndicators SingleBrandedFare="true"/>
  </FareParameters>
  <FareParameters>
    <KeepSameCabin Enabled="true"/>
    <VoluntaryChanges Match="All">
      <Penalty Amount="1000" CurrencyCode="RUB" Type="Exchange"/>
      <Penalty Amount="1000" CurrencyCode="RUB" Type="Refund"/>
    </VoluntaryChanges>
    <BrandedFareIndicators SingleBrandedFare="true"/>
  </FareParameters>
  <FareParameters>
    <Cabin Type="Business"/>
    <KeepSameCabin Enabled="true"/>
    <VoluntaryChanges Match="Info"/>
    <BrandedFareIndicators SingleBrandedFare="true"/>
  </FareParameters>
  <FareParameters>
    <PrivateFare Ind="true"/>
    <KeepSameCabin Enabled="true"/>
    <VoluntaryChanges Match="Info"/>
    <BrandedFareIndicators SingleBrandedFare="true"/>
  </FareParameters>
</FlexibleFares>
```
{{< /details >}}

#### Дополнительная информация

Дополнительная информация по возможности получения дополнительных расчетов стоимости по заданным критериям доступна в [документации](http://files.developer.sabre.com/doc/providerdoc/shopping/MultipleFaresPerItinerary_DAG.pdf).

## Разнообразие поисковой выдачи

По умолчанию рекомендации для каждого поискового запроса выбираются по их стоимости. Например, запросив 50 рекомендаций, вы получите 50 самых дешевых рекомендаций, отвечающих заданным требованиям. Однако, в некоторых случаях требуется найти такие рекомендации, которые могут быть не самыми дешевыми, но отвечать дополнительным требованиям пассажира или агентства. Например:
- удобное время вылета
- низкое время в пути
- повышенная комиссия перевозчика
- и т.д.

{{< details title="Детали" >}}

Для этого в сервисе [BargainFinderMaxRQ](https://developer.sabre.com/docs/soap_apis/air/search/bargain_finder_max) предусмотрена возможность изменения разнообразия поисковой выдачи. Для этого предлагается разбить поисковую выдачу на две части (корзины):
- корзина с самыми дешевыми перелетами
- корзина с перелетами, отвечающими определенным заданным критериям

Размер первой корзины может быть задан:
- в абсолютных числах (например, 150 рекомендаций из 200). Это число должно быть указано в качестве значения атрибута ```/OTA_AirLowFareSearchRQ/TPA_Extensions/DiversityControl/LowFareBucket/@Options```
- в процентах (например, 75% рекомендаций из 200). Этот процент должен быть указан в качестве значения атрибута ```/OTA_AirLowFareSearchRQ/TPA_Extensions/DiversityControl/LowFareBucket/@Options``` (вместе со знаком ```%``` на конце)
- в процентах максимальной разницы в стоимости между самой дешевой и дорогой рекомендации (например, если указано значение ```100%``` и самая дешевая найденная рекомендация стоит 10000 рублей, то в первой корзине будут только те рекомендации, которые стоят менее 20000 рублей). Этот процент должен быть указан в качестве значения атрибута ```/OTA_AirLowFareSearchRQ/TPA_Extensions/DiversityControl/LowFareBucket/@FareCutOff``` (вместе со знаком ```%``` на конце)

Для составления второй корзины результатов требуется указать один или несколько критериев. Всего доступно 7 критериев. Для каждого критерия можно указать его вес (значимость), а также дополнительные параметры.

Для каждой рекомендации рассчитывается специальный коэффициент, в зависимости от значений используемых критериев, после чего все рекомендации, которые не попадают в первую корзину, сортируются по величине коэффициента и выбираются во вторую корзину.

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

Данный критерия определяет то, насколько важна стоимость найденного перелета для попадания во вторую корзину.

Вес критерия указывается в качестве значения атрибута ```/OTA_AirLowFareSearchRQ/TPA_Extensions/DiversityControl/Dimensions/@PriceWeight```.

#### Время в пути

Данный критерий определяет то, насколько важно время в пути (включая время пересадок) для найденного перелета для попадания во вторую корзину.

Вес критерия указывается в качестве значения атрибута ```/OTA_AirLowFareSearchRQ/TPA_Extensions/DiversityControl/Dimensions/TravelTime/@Weight```.

Коэффициент для данного критерия рассчитывается по следующей формуле:

```(Время в пути для данного перелета - Время в пути самого быстрого перелета) / Время в пути для данного перелета```

#### Выбор перевозчиков

Данный критерий определяет то, насколько важно попадание рекомендации определенного перевозчика во вторую корзину.

Для каждого перевозчика можно указать количество или процент желаемых рекомендаций (атрибут ```/OTA_AirLowFareSearchRQ/TPA_Extensions/DiversityControl/Dimensions/Carrier/Override/@Options```) и его код (атрибут ```/OTA_AirLowFareSearchRQ/TPA_Extensions/DiversityControl/Dimensions/Carrier/Override/@Code```).

Также можно указать количество или процент желаемых рекомендаций для тех перевозчиков, что не были перечислены, т.е. по умолчанию (атрибут ```/OTA_AirLowFareSearchRQ/TPA_Extensions/DiversityControl/Dimensions/Carrier/Default/@Options```).

В запросе в атрибуте ```/OTA_AirLowFareSearchRQ/TPA_Extensions/DiversityControl/Dimensions/Carrier/@OnlineIndicator``` можно указать требуется ли использовать данный критерий только для рекомендаций с одним маркетинговым перевозчиком (значение ```true```) или также для интерлайн рекомендаций.

Вес критерия указывается в качестве значения атрибута ```/OTA_AirLowFareSearchRQ/TPA_Extensions/DiversityControl/Dimensions/Carrier/@Weight```.

Коэффициент для данного критерия рассчитывается по следующей формуле:

```(Количество рекомендаций для перевозчика - Указанное количество рекомендаций для перевозчика) / Количество рекомендаций для перевозчика```

#### Дубликаты

Данный критерий позволяет избавиться от дубликатов (рекомендации с одинаковыми сегментами, продающиеся разными маркетинговыми перевозчиками) во второй корзине.

По умолчанию дубликатом считается только та рекомендация, в которой ни на одном из сегментов маркетинговый перевозчик не является оперирующим.

В запросе также можно указать коды тех маркетинговых перевозчиков, которые необходимо считать оригинальными рекомендациями и оставить во второй корзине (атрибут ```/OTA_AirLowFareSearchRQ/TPA_Extensions/DiversityControl/Dimensions/OperatingDuplicate/PreferredCarrier/@Code```).

Вес критерия указывается в качестве значения атрибута ```/OTA_AirLowFareSearchRQ/TPA_Extensions/DiversityControl/Dimensions/OperatingDuplicate/@Weight```.

Коэффициент для данного критерия определяется по следующему алгоритму:
- 0, если рекомендация считается дубликатом
- 1, если рекомендация не считается дубликатом

#### Комбинации рейсов

Данный критерий позволяет снизить число рекомендаций, у которых совпадают рейсы при перелете туда при разных рейсах при перелете обратно, во второй корзине.

В запросе можно указать сколько комбинаций с одинаковыми рейсами при перелете туда должно быть во второй корзине (атрибут ```/OTA_AirLowFareSearchRQ/TPA_Extensions/DiversityControl/Dimensions/InboundOutboundPairing/@Duplicates```).

Вес критерия указывается в качестве значения атрибута ```/OTA_AirLowFareSearchRQ/TPA_Extensions/DiversityControl/Dimensions/InboundOutboundPairing/@Weight```.

Коэффициент для данного критерия рассчитывается по следующей формуле:

```(Количество различных комбинаций с таким вылетом туда - Указанное количество комбинаций) / Количество различных комбинаций с таким вылетом туда```

#### Время вылета и прилета

Данный критерий позволяет определить временные промежутки в течение дня для получения рекомендаций с вылетом или посадкой в эти промежутки во второй корзине.

В запросе можно указать одно или несколько условий по попаданию рекомендаций в нужный временной промежуток (элементы ```/OTA_AirLowFareSearchRQ/TPA_Extensions/DiversityControl/Dimensions/TimeOfDay/Distribution```). Для каждого условия необходимо указать один из следующих аргументов:
- ```/@Direction``` — направление перелета, для которого действует условие. Возможные значения:
    - ```Outbound``` — перелет туда
    - ```Inbound``` — перелет обратно
- ```/@Leg``` — номер плеча в запросе, для которого действует условие

Дополнительно можно указать:
- ```/@Endpoint``` — выбор применимости условия. Возможные значения:
    - ```Departure``` — взлет
    - ```Arrival``` — посадка

Каждое условие может содержать до 4 временных промежутков (элементы ```/OTA_AirLowFareSearchRQ/TPA_Extensions/DiversityControl/Dimensions/TimeOfDay/Distribution/Range```) со следующими обязательными атрибутами:
- ```Begin``` — начало временного промежутка
- ```End``` — окончание временного промежутка
- ```Options``` — количество или процент желаемых рекомендаций в указанный временной промежуток

Коэффициент для данного критерия рассчитывается по следующей формуле:

```Количество различных плеч для вылета туда за данный временной промежуток * (1 - Указанный процент) / Общее количество различных плеч для вылета туда + Количество различных плеч для вылета обратно за данный временной промежуток * (1 - Указанный процент) / Общее количество различных плеч для вылета обратно```

#### Количество пересадок

Данный критерий определяет то, насколько важно количество пересадок в найденном перелете для попадания во вторую корзину.

Вес критерия указывается в качестве значения атрибута ```/OTA_AirLowFareSearchRQ/TPA_Extensions/DiversityControl/Dimensions/StopsNumber/@Weight```.

Коэффициент для данного критерия рассчитывается по следующей формуле:

```(Количество прямых сегментов × 0 + Количество сегментов с технической посадкой × 0,5 + Количество сегментов с пересадками × 1) / Общее количество сегментов```

Например, коэффициент для перелета из Уфы в Лондон и обратно с пересадкой в Москве составит: (4 × 1)/4 = 1. Коэффициент для перелета из Москвы в Мельбурн с технической посадкой в Куала-Лумпуре: (2 × 0,5)/2 = 0,5.

{{< /details >}}

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

Подробнее о дополнительных услугах см. [Дополнительные услуги](ancillaries.html).

## Обмен и возврат билетов

Атрибут ```/OTA_AirLowFareSearchRQ/TravelerInfoSummary/AirTravelerAvail/PassengerTypeQuantity/TPA_Extensions/VoluntaryChanges/@Match``` со значением равным ```Info``` позволяет получить в результатах поиска информацию о возможности совершения обмена и возврата до и после вылета, а также величину штрафа за обмен и возврат.

В запросе можно указать требования к условиям обмена и возврата билетов для найденных перелетов. Для этого необходимо установить одно из двух значений атрибута ```/OTA_AirLowFareSearchRQ/TravelerInfoSummary/AirTravelerAvail/PassengerTypeQuantity/TPA_Extensions/VoluntaryChanges/@Match```:
- ```All``` — найденные рекомендации должны отвечать всем указанным требованиям
- ```Any``` — найденные рекомендации должны отвечать хотя бы одному из указанных требований

Требования к условиям задаются в последовательно расположенных элементах ```/OTA_AirLowFareSearchRQ/TravelerInfoSummary/AirTravelerAvail/PassengerTypeQuantity/TPA_Extensions/VoluntaryChanges/Penalty``` со следующими опциональными атрибутами:
- ```/@Type``` — тип операции. Возможные значения:
    - ```Refund``` — возврат
    - ```After``` — обмен
- ```/@Exclude``` — исключить тарифы, которые отвечают указанным требованиям. Возможные значения:
    - ```true``` — исключить тарифы
    - ```false``` — не исключать тарифы (по умолчанию)
- ```/@Application``` — применимость штрафа. Возможные значения:
    - ```Before``` — штраф за обмен или возврат до вылета
    - ```After``` — штраф за обмен или возврат после вылета
- ```/@Amount``` — максимальная величина штрафа
- ```/@CurrencyCode``` — код валюты штрафа, например ```RUB```

Всего в запросе может быть до двух требований: одно для обмена и одно для возврата.

Примеры:

{{< details title="Ответ будет содержать информацию об обмене и возврате" open=true >}}
```XML
<VoluntaryChanges Match="Info"/>
```
{{< /details >}}

{{< details title="Ответ будет содержать только те рекомендации, которые можно вернуть" open=true >}}
```XML
<VoluntaryChanges Match="All">
  <Penalty Type="Refund"/>
</VoluntaryChanges>
```
{{< /details >}}

{{< details title="Ответ будет содержать только те рекомендации, которые можно и вернуть и обменять" open=true >}}
```XML
<VoluntaryChanges Match="All">
  <Penalty Type="Exchange"/>
  <Penalty Type="Refund"/>
</VoluntaryChanges>
```
{{< /details >}}

{{< details title="Ответ будет содержать только те рекомендации, которые можно или вернуть или обменять" open=true >}}
```XML
<VoluntaryChanges Match="Any">
  <Penalty Type="Exchange"/>
  <Penalty Type="Refund"/>
</VoluntaryChanges>
```
{{< /details >}}

{{< details title="Ответ будет содержать только те рекомендации, которые можно вернуть и обменять со штрафом не более 1000 рублей" open=true >}}
```XML
<VoluntaryChanges Match="All">
  <Penalty Type="Exchange" Amount="1000" CurrencyCode="RUB"/>
  <Penalty Type="Refund" Amount="1000" CurrencyCode="RUB"/>
</VoluntaryChanges>
```
{{< /details >}}

{{< details title="Ответ будет содержать только те рекомендации, которые нельзя вернуть" open=true >}}
```XML
<VoluntaryChanges Match="All">
  <Penalty Type="Refund" Exclude="true"/>
</VoluntaryChanges>
```
{{< /details >}}

## Публичные и приватные тарифы

По умолчанию [BargainFinderMaxRQ](https://developer.sabre.com/docs/soap_apis/air/search/bargain_finder_max) предлагает рекомендации с расчетом, как по публичным, так и по приватным тарифам. Однако, указав значение атрибута ```/OTA_AirLowFareSearchRQ/TravelerInfoSummary/PriceRequestInformation/TPA_Extensions/PublicFare/@Ind``` или ```/OTA_AirLowFareSearchRQ/TravelerInfoSummary/PriceRequestInformation/TPA_Extensions/PrivateFare/@Ind``` равное ```true``` можно запросить расчет только по публичным или приватным тарифам, соответственно.

Список кодов корпоративных скидок (Corporate ID) задается в последовательно расположенных элементах ```/OTA_AirLowFareSearchRQ/TravelerInfoSummary/PriceRequestInformation/NegotiatedFareCode```. Для каждого кода необходимо указать его значение в атрибуте ```/@Code```. Дополнительно можно задать список перевозчиков, для которых действует данный код. Данный список задается в последовательно расположенных элементах ```/Supplier```. Для каждого элемента необходимо задать код перевозчика в атрибуте ```/Supplier/@Code```.

Список аккаунт кодов (Account Code) задается в последовательно расположенных элементах ```/OTA_AirLowFareSearchRQ/TravelerInfoSummary/PriceRequestInformation/AccountCode```. Для каждого аккаунт кода необходимо указать его значение в атрибуте ```/@Code```.

## Оформление на нескольких билетах

{{< hint danger >}}
Обратите внимание на то, что для работы данной опции требуется включение настройки [Multi-Ticket Shopping and Pricing (Поиск перелетов с оформлением на нескольких билетах)](tjr-settings.html#multi-ticket-shopping-and-pricing-поиск-перелетов-с-оформлением-на-нескольких-билетах). Опция будет активирована в течение 24 часов.
{{< /hint >}}

По умолчанию в результатах поискового присутствуют предложения, которые могут быть оформлены на одном билетом, при использовании данной опции запрашиваемый маршрут туда-обратно (Round Trip, RT) будет разбит на два маршрута туда (One Way, OW) и поиск будет также производиться по ним. Это позволяет сократить количество отправляемых запросов и (или) получать более дешевые предложения в результатах поиска.

Доступно два режима работа данной опции, каждый из которых имеет собственный код, который должен быть указан в атрибуте ```/OTA_AirLowFareSearchRQ/TPA_Extensions/MultiTicket/@DisplayPolicy```:
- ```SOW``` (Show One Ways) — в результатах поиска одновременно будет присутствовать три массива результатов: рекомендации RT и два массива рекомендаций OW туда и обратно. Фактически данный вариант аналогичен отправки трех поисковых запросов: 1xRT, 2xOW.  
- ```SCHS``` (Show CHeapest Solutions) — рекомендации отсортированы по стоимости вне зависимости от того, из чего они состоят: 1xRT или 2xOW.

Дополнительно в запросе можно установить максимальное количество возвращаемых рекомендаций с оформлением на разных билетах:
- ```/OTA_AirLowFareSearchRQ/TPA_Extensions/MultiTicket/@RequestedOneWays``` —  для всего маршрута
- ```/OTA_AirLowFareSearchRQ/OriginDestinationInformation/TPA_Extensions/MaxOneWayOptions/@Value``` —  для каждого плеча по отдельности

{{< hint warning >}}
Рекомендации, которые должны быть оформлены на двух билетах, рекомендуется оформлять в разных бронированиях. В этом случае сценарии бронирования, оформления билетов и другие рекомендуется выполнять параллельно в разных сессиях. Сами сценарии работы с бронированиями не меняются.
{{< /hint >}}

## Дополнительные прямые перелеты

В поисковом запросе можно указать дополнительные прямые перелеты, которые будут добавлены к запрошенным рекомендациям. Количество прямых перелетов может быть задано как в абсолютных числах (атрибут ```/OTA_AirLowFareSearchRQ/TravelPreferences/TPA_Extensions/DiversityParameters/@AdditionalNonStopsNumber```), так и в процентах от общего числа рекомендаций (атрибут ```/OTA_AirLowFareSearchRQ/TravelPreferences/TPA_Extensions/DiversityParameters/@AdditionalNonStopsPercentage```). Общее количество таких рекомендаций не может превышать 100.

## PCC

Запрос к сервису [BargainFinderMaxRQ](https://developer.sabre.com/docs/soap_apis/air/search/bargain_finder_max) должен содержать элемент ```/OTA_AirLowFareSearchRQ/POS``` в корневом элементе:

{{< details title="Пример" open=true >}}
```XML
<POS>
  <Source PseudoCityCode="Ваш PCC">
    <RequestorID ID="1" Type="1">
      <CompanyName Code="TN"/>
    </RequestorID>
  </Source>
</POS>
```
{{< /details >}}

В атрибуте ```/OTA_AirLowFareSearchRQ/POS/Source/@PseudoCityCode``` необходимо указать PCC, из которого производится запрос. Остальные атрибуты должны быть заполнены как в примере выше.

Сервис [BargainFinderMaxRQ](https://developer.sabre.com/docs/soap_apis/air/search/bargain_finder_max) позволяет искать рекомендации в нескольких PCC одновременно. Это может быть актуально для получения приватных тарифов, которые зафайлированы в разных PCC, или для получения рекомендаций, которые доступны не во всех странах.

В случае использования этой опции один PCC будет основным и должен быть задан в качестве значения атрибута ```/OTA_AirLowFareSearchRQ/POS/Source/@PseudoCityCode``` (см. выше). Для каждого дополнительного PCC (всего не более 4) должен быть создан элемент ```/OTA_AirLowFareSearchRQ/TPA_Extensions/AlternatePCC```, у которого в качестве значения атрибута ```/@PseudoCityCode``` указан PCC.

Подробнее о поиске в нескольких PCC см. [документации](http://webservices.sabre.com/drc/providerdoc/shopping/BargainFinderMax_Help/Content/Features/ShopAcrossMultPCCs/Shop_Across_Multiple_PCCs_DAG.pdf).

{{< hint danger >}}
Обратите внимание на то, что использование данной опции требует активации. Пожалуйста, обратитесь к вашему куратору в Sabre для уточнения деталей.
{{< /hint >}}

## Количество рекомендаций

Тип запроса (количество запрашиваемых рекомендаций) должен быть указан в качестве значения атрибута ```/OTA_AirLowFareSearchRQ/TPA_Extensions/IntelliSellTransaction/RequestType/@Name```.

Допустимыми значениями являются:
- ```50ITINS``` — 50 рекомендаций
- ```100ITINS``` — 100 рекомендаций
- ```200ITINS``` — 200 рекомендаций

Дополнительное ограничение на количество возвращаемых рекомендаций можно установить в качестве значения атрибута ```/OTA_AirLowFareSearchRQ/TravelPreferences/TPA_Extensions/NumTrips/@Number```.

## Вид ответа

У сервиса [BargainFinderMaxRQ](https://developer.sabre.com/docs/soap_apis/air/search/bargain_finder_max) существует два основных вида представления ответов, код которого должен быть указан в атрибуте ```/OTA_AirLowFareSearchRQ/@ResponseType``` запроса:
- ```OTA``` — стандартный вид ответа, в котором вся информация представлена в иерархическом виде. Ответ содержит список элементов, каждый из которых содержит информацию о предложенной опции, например, информацию о перелетах, расчет стоимости и т.д. Эти элементы, в свою очередь, могут содержать другие элементы, например, расчет стоимости содержит информацию о таксах (величина, код, название)
- ```GIR``` — группированный или нормализованный вид ответа. Ответ содержит информацию отдельно о рейсах, расчетах стоимости, таксах и т.д. Связность между элементами достигается за счет использования идентификаторов элементов

## Примеры

{{< details title="Пример запроса (базовый запрос, OTA ответ)" >}}
```XML
<OTA_AirLowFareSearchRQ ResponseType="OTA" Version="6.5.0" xmlns="http://www.opentravel.org/OTA/2003/05">
  <POS>
    <Source PseudoCityCode="9LSC">
      <RequestorID ID="1" Type="1">
        <CompanyName Code="TN"/>
      </RequestorID>
    </Source>
  </POS>
  <OriginDestinationInformation RPH="1">
    <DepartureDateTime>2022-12-01T11:00:00</DepartureDateTime>
    <OriginLocation LocationCode="SYD"/>
    <DestinationLocation LocationCode="LON"/>
  </OriginDestinationInformation>
  <OriginDestinationInformation RPH="2">
    <DepartureDateTime>2022-12-08T11:00:00</DepartureDateTime>
    <OriginLocation LocationCode="LON"/>
    <DestinationLocation LocationCode="SYD"/>
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
```
{{< /details >}}

{{< details title="Пример ответа" >}}
```XML
<OTA_AirLowFareSearchRS AvailableItinCount="0" BrandedOneWayItinCount="0" DepartedItinCount="0" PricedItinCount="185" SimpleOneWayItinCount="0" SoldOutItinCount="0" Version="6.5.0" xmlns="http://www.opentravel.org/OTA/2003/05" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <Success/>
  <Warnings>
    <Warning Code="PROCESS" ShortText="NO FARE FOR CLASS USED" Type="MIP"/>
    <Warning Code="GCB14-ISELL-TN-00-2022-05-00-6T9H" MessageClass="I" ShortText="27033" Type="SERVER"/>
    <Warning Code="TRANSACTIONID" MessageClass="I" ShortText="6962466626645600575" Type="WORKERTHREAD"/>
    <Warning Code="RULEID" MessageClass="I" ShortText="15936" Type="DRE"/>
    <Warning Code="RULEID" MessageClass="I" ShortText="27757" Type="DEFAULT"/>
    <Warning Code="MIP" MessageClass="I" ShortText="NO FARE FOR CLASS USED" Type="MIP"/>
  </Warnings>
  <PricedItineraries>
    <PricedItinerary SequenceNumber="1">
      <AirItinerary DirectionInd="Return">
        <OriginDestinationOptions>
          <OriginDestinationOption ArrivalCountry="GB" DepartureCountry="AU" ElapsedTime="1930">
            <FlightSegment ArrivalDateTime="2022-12-01T17:15:00" DepartureDateTime="2022-12-01T09:15:00" ElapsedTime="600" FlightNumber="52" ResBookDesigCode="S" StopQuantity="0">
              <DepartureAirport LocationCode="SYD" TerminalID="1"/>
              <ArrivalAirport LocationCode="HND" TerminalID="3"/>
              <OperatingAirline Code="JL" FlightNumber="52"/>
              <Equipment AirEquipType="789"/>
              <MarketingAirline Code="JL"/>
              <MarriageGrp>O</MarriageGrp>
              <DepartureTimeZone GMTOffset="11"/>
              <ArrivalTimeZone GMTOffset="9"/>
              <TPA_Extensions>
                <eTicket Ind="true"/>
                <Mileage Amount="4836"/>
              </TPA_Extensions>
            </FlightSegment>
            <FlightSegment ArrivalDateTime="2022-12-02T06:25:00" DepartureDateTime="2022-12-02T02:45:00" ElapsedTime="760" FlightNumber="41" ResBookDesigCode="S" StopQuantity="0">
              <DepartureAirport LocationCode="HND" TerminalID="3"/>
              <ArrivalAirport LocationCode="LHR" TerminalID="3"/>
              <OperatingAirline Code="JL" FlightNumber="41"/>
              <Equipment AirEquipType="788"/>
              <MarketingAirline Code="JL"/>
              <MarriageGrp>I</MarriageGrp>
              <DepartureTimeZone GMTOffset="9"/>
              <ArrivalTimeZone GMTOffset="0"/>
              <TPA_Extensions>
                <eTicket Ind="true"/>
                <Mileage Amount="5974"/>
              </TPA_Extensions>
            </FlightSegment>
          </OriginDestinationOption>
          <OriginDestinationOption ArrivalCountry="AU" DepartureCountry="GB" ElapsedTime="1785">
            <FlightSegment ArrivalDateTime="2022-12-09T10:25:00" DepartureDateTime="2022-12-08T13:45:00" ElapsedTime="700" FlightNumber="7120" ResBookDesigCode="S" StopQuantity="0">
              <DepartureAirport LocationCode="LHR" TerminalID="5"/>
              <ArrivalAirport LocationCode="HND" TerminalID="3"/>
              <OperatingAirline Code="BA" FlightNumber="5"/>
              <Equipment AirEquipType="789"/>
              <MarketingAirline Code="JL"/>
              <DisclosureAirline Code="BA"/>
              <MarriageGrp>O</MarriageGrp>
              <DepartureTimeZone GMTOffset="0"/>
              <ArrivalTimeZone GMTOffset="9"/>
              <TPA_Extensions>
                <eTicket Ind="true"/>
                <Mileage Amount="5974"/>
              </TPA_Extensions>
            </FlightSegment>
            <FlightSegment ArrivalDateTime="2022-12-10T06:30:00" DepartureDateTime="2022-12-09T18:40:00" ElapsedTime="590" FlightNumber="51" ResBookDesigCode="S" StopQuantity="0">
              <DepartureAirport LocationCode="HND" TerminalID="3"/>
              <ArrivalAirport LocationCode="SYD" TerminalID="1"/>
              <OperatingAirline Code="JL" FlightNumber="51"/>
              <Equipment AirEquipType="789"/>
              <MarketingAirline Code="JL"/>
              <MarriageGrp>I</MarriageGrp>
              <DepartureTimeZone GMTOffset="9"/>
              <ArrivalTimeZone GMTOffset="11"/>
              <TPA_Extensions>
                <eTicket Ind="true"/>
                <Mileage Amount="4836"/>
              </TPA_Extensions>
            </FlightSegment>
          </OriginDestinationOption>
        </OriginDestinationOptions>
      </AirItinerary>
      <AirItineraryPricingInfo FareReturned="true" LastTicketDate="2022-05-27" LastTicketTime="23:59" PricingSource="ADVJR1" PricingSubSource="MIP">
        <ItinTotalFare>
          <BaseFare Amount="752.00" CurrencyCode="AUD" DecimalPlaces="2"/>
          <FareConstruction Amount="566.20" CurrencyCode="NUC" DecimalPlaces="2"/>
          <EquivFare Amount="33840" CurrencyCode="RUB" DecimalPlaces="0"/>
          <Taxes>
            <Tax Amount="39005" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="TOTALTAX"/>
          </Taxes>
          <TotalFare Amount="72845" CurrencyCode="RUB" DecimalPlaces="0"/>
        </ItinTotalFare>
        <PTC_FareBreakdowns>
          <PTC_FareBreakdown>
            <PassengerTypeQuantity Code="ADT" Quantity="1"/>
            <FareBasisCodes>
              <FareBasisCode ArrivalAirportCode="HND" BookingCode="S" DepartureAirportCode="SYD" FareComponentBeginAirport="SYD" FareComponentCabinCode="Y" FareComponentDirectionality="FROM" FareComponentEndAirport="LHR" FareComponentFareRule="2291" FareComponentFareTariff="44" FareComponentFareType="XEX" FareComponentFareTypeBitmap="00" FareComponentVendorCode="ATP" GovCarrier="JL">SNN0NPCE</FareBasisCode>
              <FareBasisCode ArrivalAirportCode="LHR" AvailabilityBreak="true" BookingCode="S" DepartureAirportCode="HND" GovCarrier="JL">SNN0NPCE</FareBasisCode>
              <FareBasisCode ArrivalAirportCode="HND" BookingCode="S" DepartureAirportCode="LHR" FareComponentBeginAirport="LHR" FareComponentCabinCode="Y" FareComponentDirectionality="TO" FareComponentEndAirport="SYD" FareComponentFareRule="2291" FareComponentFareTariff="44" FareComponentFareType="XEX" FareComponentFareTypeBitmap="00" FareComponentVendorCode="ATP" GovCarrier="JL">SNN0NPCE</FareBasisCode>
              <FareBasisCode ArrivalAirportCode="SYD" AvailabilityBreak="true" BookingCode="S" DepartureAirportCode="HND" GovCarrier="JL">SNN0NPCE</FareBasisCode>
            </FareBasisCodes>
            <PassengerFare>
              <BaseFare Amount="752.00" CurrencyCode="AUD"/>
              <FareConstruction Amount="566.20" CurrencyCode="NUC" DecimalPlaces="2"/>
              <EquivFare Amount="33840" CurrencyCode="RUB" DecimalPlaces="0"/>
              <Taxes>
                <Tax Amount="9945" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                <Tax Amount="9945" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                <Tax Amount="231" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQI"/>
                <Tax Amount="231" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQI"/>
                <Tax Amount="231" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQI"/>
                <Tax Amount="231" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQI"/>
                <Tax Amount="2700" CountryCode="AU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="AU"/>
                <Tax Amount="1450" CountryCode="AU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="WY"/>
                <Tax Amount="1450" CountryCode="AU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="WY2"/>
                <Tax Amount="6678" CountryCode="GB" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="GB"/>
                <Tax Amount="4457" CountryCode="GB" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="UB"/>
                <Tax Amount="728" CountryCode="JP" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="SW"/>
                <Tax Amount="728" CountryCode="JP" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="SW"/>
                <TaxSummary Amount="20814" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                <TaxSummary Amount="2700" CountryCode="AU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="AU"/>
                <TaxSummary Amount="2900" CountryCode="AU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="WY"/>
                <TaxSummary Amount="1456" CountryCode="JP" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="SW"/>
                <TaxSummary Amount="6678" CountryCode="GB" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="GB"/>
                <TaxSummary Amount="4457" CountryCode="GB" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="UB"/>
                <TotalTax Amount="39005" CurrencyCode="RUB" DecimalPlaces="0"/>
              </Taxes>
              <TotalFare Amount="72845" CurrencyCode="RUB"/>
              <TPA_Extensions>
                <Messages>
                  <Message AirlineCode="JL" FailCode="0" Info="RFND RESTR APPLY" Type="N"/>
                  <Message FailCode="0" Info="VALIDATING CARRIER" Type="W"/>
                  <Message FailCode="0" Info="BSP - JL" Type="W"/>
                </Messages>
                <BaggageInformationList>
                  <BaggageInformation AirlineCode="JL" ProvisionType="A">
                    <Segment Id="0"/>
                    <Segment Id="1"/>
                    <Allowance Pieces="2"/>
                  </BaggageInformation>
                  <BaggageInformation AirlineCode="JL" ProvisionType="A">
                    <Segment Id="2"/>
                    <Segment Id="3"/>
                    <Allowance Pieces="2"/>
                  </BaggageInformation>
                </BaggageInformationList>
              </TPA_Extensions>
            </PassengerFare>
            <Endorsements NonRefundableIndicator="true"/>
            <TPA_Extensions>
              <FareCalcLine Info="SYD JL X/TYO JL LON283.10JL X/TYO JL SYD283.10NUC566.20END ROE1.328146"/>
            </TPA_Extensions>
            <FareInfos>
              <FareInfo>
                <FareReference>S</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="M"/>
                </TPA_Extensions>
              </FareInfo>
              <FareInfo>
                <FareReference>S</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="M"/>
                </TPA_Extensions>
              </FareInfo>
              <FareInfo>
                <FareReference>S</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                </TPA_Extensions>
              </FareInfo>
              <FareInfo>
                <FareReference>S</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="M"/>
                </TPA_Extensions>
              </FareInfo>
            </FareInfos>
          </PTC_FareBreakdown>
        </PTC_FareBreakdowns>
        <FareInfos>
          <FareInfo>
            <FareReference>S</FareReference>
            <TPA_Extensions>
              <SeatsRemaining BelowMin="false" Number="9"/>
              <Cabin Cabin="Y"/>
              <Meal Code="M"/>
            </TPA_Extensions>
          </FareInfo>
          <FareInfo>
            <FareReference>S</FareReference>
            <TPA_Extensions>
              <SeatsRemaining BelowMin="false" Number="9"/>
              <Cabin Cabin="Y"/>
              <Meal Code="M"/>
            </TPA_Extensions>
          </FareInfo>
          <FareInfo>
            <FareReference>S</FareReference>
            <TPA_Extensions>
              <SeatsRemaining BelowMin="false" Number="9"/>
              <Cabin Cabin="Y"/>
            </TPA_Extensions>
          </FareInfo>
          <FareInfo>
            <FareReference>S</FareReference>
            <TPA_Extensions>
              <SeatsRemaining BelowMin="false" Number="9"/>
              <Cabin Cabin="Y"/>
              <Meal Code="M"/>
            </TPA_Extensions>
          </FareInfo>
        </FareInfos>
        <TPA_Extensions>
          <DivideInParty Indicator="false"/>
          <ValidatingCarrier NewVcxProcess="true" SettlementMethod="BSP">
            <Default Code="JL"/>
          </ValidatingCarrier>
        </TPA_Extensions>
      </AirItineraryPricingInfo>
      <TicketingInfo TicketType="eTicket" ValidInterline="Yes"/>
      <TPA_Extensions>
        <ValidatingCarrier Code="JL"/>
        <DiversitySwapper WeighedPriceAmount="170534"/>
      </TPA_Extensions>
    </PricedItinerary>
    <!--Другие рекомендации-->
  </PricedItineraries>
</OTA_AirLowFareSearchRS>
```
{{< /details >}}

---

{{< details title="Пример запроса (базовый запрос, GIR ответ)" >}}
```XML
<OTA_AirLowFareSearchRQ ResponseType="GIR" Version="6.5.0" xmlns="http://www.opentravel.org/OTA/2003/05">
  <POS>
    <Source PseudoCityCode="9LSC">
      <RequestorID ID="1" Type="1">
        <CompanyName Code="TN"/>
      </RequestorID>
    </Source>
  </POS>
  <OriginDestinationInformation RPH="1">
    <DepartureDateTime>2022-12-01T11:00:00</DepartureDateTime>
    <OriginLocation LocationCode="SYD"/>
    <DestinationLocation LocationCode="LON"/>
  </OriginDestinationInformation>
  <OriginDestinationInformation RPH="2">
    <DepartureDateTime>2022-12-08T11:00:00</DepartureDateTime>
    <OriginLocation LocationCode="LON"/>
    <DestinationLocation LocationCode="SYD"/>
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
```
{{< /details >}}

{{< details title="Пример ответа" >}}
```XML
<GroupedItineraryResponse Version="6.5.0" xmlns="http://webservices.sabre.com/wsdl/sabreXML1.0.00/shopping/GroupedItineraryResponse" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <Message Code="GCC15-ISELL-TN-00-2022-05-00-P0G7" Severity="Info" Text="27034" Type="SERVER"/>
  <Message Code="TRANSACTIONID" Severity="Info" Text="6962558998358874909" Type="WORKERTHREAD"/>
  <Message Code="RULEID" Severity="Info" Text="15936" Type="DRE"/>
  <Message Code="RULEID" Severity="Info" Text="27757" Type="DEFAULT"/>
  <Statistics Itineraries="185"/>
  <ScheduleDesc ETicketable="true" ElapsedTime="470" Frequency="*MTWTFS" ID="1" Stops="0" TotalMilesFlown="3420">
    <Departure Airport="DXB" City="DXB" Country="AE" Terminal="3" Time="14:30:00+04:00"/>
    <Arrival Airport="LHR" City="LON" Country="GB" Terminal="3" Time="18:20:00Z"/>
    <Carrier Disclosure="EK" Marketing="QF" MarketingFlightNumber="8003" Operating="EK" OperatingFlightNumber="3">
      <Equipment Code="388" TypeForFirstLeg="W" TypeForLastLeg="W"/>
    </Carrier>
  </ScheduleDesc>
  <ScheduleDesc ETicketable="true" ElapsedTime="700" Frequency="SMTWTFS" ID="2" Stops="0" TotalMilesFlown="5974">
    <Departure Airport="LHR" City="LON" Country="GB" Terminal="5" Time="13:45:00Z"/>
    <Arrival Airport="HND" City="TYO" Country="JP" DateAdjustment="1" Terminal="3" Time="10:25:00+09:00"/>
    <Carrier Disclosure="BA" Marketing="JL" MarketingFlightNumber="7120" Operating="BA" OperatingFlightNumber="5">
      <Equipment Code="789" TypeForFirstLeg="W" TypeForLastLeg="W"/>
    </Carrier>
  </ScheduleDesc>
  <ScheduleDesc ETicketable="true" ElapsedTime="905" Frequency="SMTWTF*" ID="3" Stops="0" TotalMilesFlown="7417">
    <Departure Airport="SFO" City="SFO" Country="US" State="CA" Terminal="I" Time="23:00:00-08:00"/>
    <Arrival Airport="SYD" City="SYD" Country="AU" DateAdjustment="2" State="NS" Terminal="1" Time="09:05:00+11:00"/>
    <Carrier Marketing="UA" MarketingFlightNumber="863" Operating="UA" OperatingFlightNumber="863">
      <Equipment Code="789" TypeForFirstLeg="W" TypeForLastLeg="W"/>
    </Carrier>
  </ScheduleDesc>
  <ScheduleDesc ETicketable="true" ElapsedTime="900" Frequency="**TWTF*" ID="4" Stops="0" TotalMilesFlown="7488" TrafficRestriction="Q">
    <Departure Airport="LAX" City="LAX" Country="US" State="CA" Terminal="3" Time="22:30:00-08:00"/>
    <Arrival Airport="SYD" City="SYD" Country="AU" DateAdjustment="2" State="NS" Terminal="1" Time="08:30:00+11:00"/>
    <Carrier Alliances="*S " Disclosure="DL" Marketing="AF" MarketingFlightNumber="8958" Operating="DL" OperatingFlightNumber="41">
      <Equipment Code="359" TypeForFirstLeg="W" TypeForLastLeg="W"/>
    </Carrier>
  </ScheduleDesc>
  <ScheduleDesc ETicketable="true" ElapsedTime="630" Frequency="SMTWTF*" ID="5" Stops="0" TotalMilesFlown="5456">
    <Departure Airport="LAX" City="LAX" Country="US" State="CA" Terminal="7" Time="17:30:00-08:00"/>
    <Arrival Airport="LHR" City="LON" Country="GB" DateAdjustment="1" Terminal="2" Time="12:00:00Z"/>
    <Carrier Marketing="UA" MarketingFlightNumber="923" Operating="UA" OperatingFlightNumber="923">
      <Equipment Code="789" TypeForFirstLeg="W" TypeForLastLeg="W"/>
    </Carrier>
  </ScheduleDesc>
  <!--Другие рейсы-->
  <TaxDesc Amount="252" Code="QR2" Country="AU" Currency="RUB" Description="PASSENGER SERVICE CHARGE DOMESTIC ARRIVAL" ID="1" PublishedAmount="5.59" PublishedCurrency="AUD" Station="SYD"/>
  <TaxDesc Amount="3098" Code="UB" Country="GB" Currency="RUB" Description="PASSENGER SERVICE CHARGE DEPARTURES" ID="2" PublishedAmount="38.96" PublishedCurrency="GBP" Station="LCY"/>
  <TaxDesc Amount="10356" Code="YRF" Currency="RUB" Description="SERVICE FEE - CARRIER-IMPOSED FUEL" ID="3" PublishedAmount="161.80" PublishedCurrency="USD" Station="SYD"/>
  <TaxDesc Amount="760" Code="WC" Country="ZA" Currency="RUB" Description="AIR PASSENGER TAX" ID="4" PublishedAmount="190.00" PublishedCurrency="ZAR" Station="JNB"/>
  <TaxDesc Amount="254" Code="XA" Country="US" Currency="RUB" Description="APHIS PASSENGER FEE PASSENGERS" ID="5" PublishedAmount="3.96" PublishedCurrency="USD" Station="LHR"/>
  <!--Другие таксы-->
  <TaxSummaryDesc Amount="3098" Code="UB" Country="GB" Currency="RUB" Description="PASSENGER SERVICE CHARGE DEPARTURES" ID="1" PublishedAmount="38.96" PublishedCurrency="GBP" Station="LCY"/>
  <TaxSummaryDesc Amount="898" Code="I5" Country="HK" Currency="RUB" Description="AIRPORT PASSENGER SECURITY CHARGE" ID="2" PublishedAmount="55" PublishedCurrency="HKD" Station="HKG"/>
  <TaxSummaryDesc Amount="20814" Code="YQF" Currency="RUB" Description="SERVICE FEE - CARRIER-IMPOSED FUEL" ID="3" PublishedAmount="221.00" PublishedCurrency="AUD" Station="SYD"/>
  <TaxSummaryDesc Amount="760" Code="WC" Country="ZA" Currency="RUB" Description="AIR PASSENGER TAX" ID="4" PublishedAmount="190.00" PublishedCurrency="ZAR" Station="JNB"/>
  <TaxSummaryDesc Amount="13735" Code="YRF" Currency="RUB" Description="SERVICE FEE - CARRIER-IMPOSED FUEL" ID="5" PublishedAmount="1.00" PublishedCurrency="EUR" Station="CDG"/>
  <!--Другие таксы-->
  <OBFeeDesc Amount="0" Currency="RUB" ID="1"/>
  <FareComponentDesc ApplicablePricingCategories="1 10 14 15 23 25 35" CabinCode="S" Direction="EH" Directionality="FROM" FareAmount="1262.28" FareBasisCode="L33AURPO" FareCurrency="AUD" FarePassengerType="ADT" FareRule="AUPO" FareTariff="901" FareType="ZEX" FareTypeBitmap="0E" GoverningCarrier="SQ" ID="1" NegotiatedFare="true" NotValidAfter="2023-12-01" PrivateFare="true" PublishedFareAmount="3353.00" VendorCode="ATP">
    <Segment/>
    <Segment Stopover="true"/>
  </FareComponentDesc>
  <FareComponentDesc ApplicablePricingCategories="4 5 6 7 8 10 12 16" CabinCode="Y" Direction="EH" Directionality="FROM" FareAmount="948.31" FareBasisCode="KS50ABSM" FareCurrency="AUD" FarePassengerType="ADT" FareRule="E2SM" FareTariff="4" FareType="XEX" FareTypeBitmap="00" GoverningCarrier="AF" ID="2" NotValidAfter="2022-12-01" NotValidBefore="2022-12-01" PublishedFareAmount="2519.00" VendorCode="ATP">
    <Segment/>
    <Segment/>
    <Segment Stopover="true"/>
  </FareComponentDesc>
  <FareComponentDesc ApplicablePricingCategories="4 5 7 8 9 10 16 18" CabinCode="Y" Direction="TS" Directionality="FROM" FareAmount="745.39" FareBasisCode="HRCQD" FareCurrency="AUD" FarePassengerType="ADT" FareRule="KQ23" FareTariff="44" FareType="XES" FareTypeBitmap="00" GoverningCarrier="NH" ID="3" NotValidAfter="2022-12-01" NotValidBefore="2022-12-01" PublishedFareAmount="1980.00" VendorCode="ATP">
    <Segment/>
    <Segment Stopover="true"/>
  </FareComponentDesc>
  <FareComponentDesc ApplicablePricingCategories="2 3 4 5 8 9 10 12 15 16 18" CabinCode="Y" Direction="EH" Directionality="FROM" FareAmount="1080.45" FareBasisCode="HLXEU" FareCurrency="AUD" FarePassengerType="ADT" FareRule="5852" FareTariff="4" FareType="XEX" FareTypeBitmap="00" GoverningCarrier="QF" ID="4" NotValidAfter="2022-12-01" NotValidBefore="2022-12-01" PublishedFareAmount="2870.00" VendorCode="ATP">
    <Segment/>
    <Segment Stopover="true"/>
  </FareComponentDesc>
  <FareComponentDesc ApplicablePricingCategories="2 3 4 5 6 8 9 10 11 15 16 18" CabinCode="Y" Direction="AP" Directionality="FROM" FareAmount="993.86" FareBasisCode="VFE0XNDV" FareCurrency="AUD" FarePassengerType="ADT" FareRule="1RUE" FareTariff="307" FareType="SIP" FareTypeBitmap="00" GoverningCarrier="UA" ID="5" NotValidAfter="2023-12-01" PublishedFareAmount="1320.00" VendorCode="ATP">
    <Segment/>
    <Segment Stopover="true"/>
  </FareComponentDesc>
  <!--Другие компоненты тарифов-->
  <ValidatingCarrierDesc ID="1" NewVcxProcess="true" SettlementMethod="BSP">
    <Default Code="HR"/>
  </ValidatingCarrierDesc>
  <ValidatingCarrierDesc ID="2" NewVcxProcess="true" SettlementMethod="TCH">
    <Default Code="EK"/>
  </ValidatingCarrierDesc>
  <ValidatingCarrierDesc ID="3" NewVcxProcess="true" SettlementMethod="BSP">
    <Default Code="UA"/>
  </ValidatingCarrierDesc>
  <ValidatingCarrierDesc ID="4" NewVcxProcess="true" SettlementMethod="BSP">
    <Default Code="AF"/>
  </ValidatingCarrierDesc>
  <ValidatingCarrierDesc ID="5" NewVcxProcess="true" SettlementMethod="BSP">
    <Default Code="MH"/>
  </ValidatingCarrierDesc>
  <!--Другие валидирующие перевозчики-->
  <BaggageAllowanceDesc ID="1" Pieces="1"/>
  <BaggageAllowanceDesc ID="2" Pieces="1"/>
  <BaggageAllowanceDesc ID="3" Unit="kg" Weight="20"/>
  <BaggageAllowanceDesc ID="4" Unit="kg" Weight="35"/>
  <BaggageAllowanceDesc ID="5" Unit="kg" Weight="20"/>
  <!--Другие нормы провоза багажа-->
  <LegDesc ElapsedTime="2035" ID="1">
    <Schedule Ref="97"/>
    <Schedule Ref="99"/>
  </LegDesc>
  <LegDesc ElapsedTime="1355" ID="2">
    <Schedule Ref="74"/>
    <Schedule DepartureDateAdjustment="1" Ref="115"/>
  </LegDesc>
  <LegDesc ElapsedTime="1455" ID="3">
    <Schedule Ref="98"/>
    <Schedule Ref="100"/>
  </LegDesc>
  <LegDesc ElapsedTime="1500" ID="4">
    <Schedule Ref="81"/>
    <Schedule DepartureDateAdjustment="1" Ref="107"/>
  </LegDesc>
  <LegDesc ElapsedTime="1875" ID="5">
    <Schedule Ref="48"/>
    <Schedule Ref="38"/>
    <Schedule Ref="83"/>
  </LegDesc>
  <!--Другие плечи-->
  <ItineraryGroup>
    <GroupDescription>
      <LegDescription ArrivalLocation="LHR" DepartureDate="2022-12-01" DepartureLocation="SYD"/>
      <LegDescription ArrivalLocation="SYD" DepartureDate="2022-12-08" DepartureLocation="LCY"/>
    </GroupDescription>
    <Itinerary ID="1" PricingSource="ADVJR1">
      <Leg Ref="60"/>
      <Leg Ref="50"/>
      <PricingInformation PricingSubsource="MIP">
        <Fare ETicketable="true" GoverningCarriers="AF KL" VITA="true" ValidatingCarrierCode="AF">
          <PassengerInfo NonRefundable="true" PassengerNumber="1" PassengerType="ADT">
            <FareComponent Ref="11">
              <Segment BookingCode="L" CabinCode="Y" MealCode="M" SeatsAvailable="9"/>
              <Segment BookingCode="L" CabinCode="Y" MealCode="BM" SeatsAvailable="9"/>
              <Segment AvailabilityBreak="true" BookingCode="L" CabinCode="Y" SeatsAvailable="9"/>
            </FareComponent>
            <FareComponent Ref="22">
              <Segment BookingCode="Y" CabinCode="Y" MealCode="S" SeatsAvailable="9"/>
              <Segment BookingCode="U" CabinCode="Y" MealCode="M" SeatsAvailable="9"/>
              <Segment AvailabilityBreak="true" BookingCode="U" CabinCode="Y" MealCode="HR" SeatsAvailable="9"/>
            </FareComponent>
            <Tax Ref="19"/>
            <Tax Ref="51"/>
            <Tax Ref="20"/>
            <Tax Ref="52"/>
            <Tax Ref="35"/>
            <Tax Ref="101"/>
            <Tax Ref="55"/>
            <Tax Ref="7"/>
            <Tax Ref="63"/>
            <Tax Ref="70"/>
            <Tax Ref="31"/>
            <Tax Ref="6"/>
            <Tax Ref="74"/>
            <Tax Ref="2"/>
            <Tax Ref="40"/>
            <Tax Ref="34"/>
            <Tax Ref="10"/>
            <Tax Ref="10"/>
            <Tax Ref="81"/>
            <Tax Ref="81"/>
            <TaxSummary Ref="32"/>
            <TaxSummary Ref="5"/>
            <TaxSummary Ref="42"/>
            <TaxSummary Ref="8"/>
            <TaxSummary Ref="66"/>
            <TaxSummary Ref="62"/>
            <TaxSummary Ref="20"/>
            <TaxSummary Ref="23"/>
            <TaxSummary Ref="7"/>
            <TaxSummary Ref="54"/>
            <TaxSummary Ref="1"/>
            <TaxSummary Ref="28"/>
            <TaxSummary Ref="26"/>
            <OBFee Ref="1"/>
            <CurrencyConversion ExchangeRateUsed="45" From="AUD" To="RUB"/>
            <FareMessage Code="0" Info="VALIDATING CARRIER" Type="W"/>
            <FareMessage Code="0" Info="BSP - AF" Type="W"/>
            <FareMessage Code="0" Info="GEN - AF" Type="W"/>
            <FareMessage Code="0" Info="ALTERNATE VALIDATING CARRIER/S" Type="W"/>
            <FareMessage Code="0" Info="BSP - KL" Type="W"/>
            <FareMessage Code="0" Info="CAT 15 SALES RESTRICTIONS FREE TEXT FOUND - VERIFY RULES" Type="W"/>
            <PassengerTotalFare BaseFareAmount="2557.00" BaseFareCurrency="AUD" CommissionAmount="0" CommissionPercentage="0" ConstructionAmount="1924.88" ConstructionCurrency="NUC" Currency="RUB" EquivalentAmount="115065" EquivalentCurrency="RUB" ExchangeRateOne="1.32814600" TotalFare="150300" TotalTaxes="35235"/>
            <BaggageInformation AirlineCode="AF" ProvisionType="A">
              <Segment ID="0"/>
              <Segment ID="1"/>
              <Segment ID="2"/>
              <Allowance Ref="1"/>
            </BaggageInformation>
            <BaggageInformation AirlineCode="KL" ProvisionType="A">
              <Segment ID="3"/>
              <Segment ID="4"/>
              <Segment ID="5"/>
              <Allowance Ref="2"/>
            </BaggageInformation>
          </PassengerInfo>
          <TotalFare BaseFareAmount="2557.00" BaseFareCurrency="AUD" ConstructionAmount="1924.88" ConstructionCurrency="NUC" Currency="RUB" EquivalentAmount="115065" EquivalentCurrency="RUB" TotalPrice="150300" TotalTaxes="35235"/>
          <ValidatingCarrier Ref="13"/>
          <ValidatingCarrier Ref="10"/>
        </Fare>
      </PricingInformation>
      <DiversitySwapper WeighedPrice="380287.358"/>
    </Itinerary>
    <!--Другие рекомендации-->
  </ItineraryGroup>
  <!--Другие маршруты-->
</GroupedItineraryResponse>
```
{{< /details >}}

---

{{< details title="Пример запроса (получение дополнительной информации, OTA ответ)" >}}
```XML
<OTA_AirLowFareSearchRQ ResponseType="OTA" Version="6.5.0" xmlns="http://www.opentravel.org/OTA/2003/05">
  <POS>
    <Source PseudoCityCode="9LSC">
      <RequestorID ID="1" Type="1">
        <CompanyName Code="TN"/>
      </RequestorID>
    </Source>
  </POS>
  <OriginDestinationInformation RPH="1">
    <DepartureDateTime>2022-12-01T11:00:00</DepartureDateTime>
    <OriginLocation LocationCode="SYD"/>
    <DestinationLocation LocationCode="LON"/>
  </OriginDestinationInformation>
  <OriginDestinationInformation RPH="2">
    <DepartureDateTime>2022-12-08T11:00:00</DepartureDateTime>
    <OriginLocation LocationCode="LON"/>
    <DestinationLocation LocationCode="SYD"/>
  </OriginDestinationInformation>
  <TravelPreferences ValidInterlineTicket="true">
    <CabinPref Cabin="Economy" PreferLevel="Preferred"/>
    <TPA_Extensions>
      <LongConnectTime Enable="true"/>
      <LongConnectPoints Max="3" Min="1"/>
      <KeepSameCabin Enabled="true"/>
      <ExcludeCallDirectCarriers Enabled="true"/>
      <SeatSelection Info="true"/>
      <DiversityParameters AdditionalNonStopsPercentage="100"/>
    </TPA_Extensions>
    <AncillaryFees Enable="true">
      <AncillaryFeeGroup Code="BG"/>
    </AncillaryFees>
    <Baggage CarryOnInfo="true" Description="true" RequestType="A"/>
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
```
{{< /details >}}

{{< details title="Пример ответа" >}}
```XML
<OTA_AirLowFareSearchRS AvailableItinCount="0" BrandedOneWayItinCount="0" DepartedItinCount="0" PricedItinCount="150" SimpleOneWayItinCount="0" SoldOutItinCount="0" Version="6.5.0" xmlns="http://www.opentravel.org/OTA/2003/05" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <Success/>
  <Warnings>
    <Warning Code="PROCESS" ShortText="Communication error: Transmission timeout" Type="MIP"/>
    <Warning Code="GCB14-ISELL-TN-00-2022-05-00-133T" MessageClass="I" ShortText="27038" Type="SERVER"/>
    <Warning Code="TRANSACTIONID" MessageClass="I" ShortText="6962596678179234454" Type="WORKERTHREAD"/>
    <Warning Code="RULEID" MessageClass="I" ShortText="15936" Type="DRE"/>
    <Warning Code="RULEID" MessageClass="I" ShortText="27757" Type="DEFAULT"/>
  </Warnings>
  <BrandFeatures>
    <BrandFeature Application="F" CommercialName="STANDARD SEATING" Id="1" ServiceGroup="BF" ServiceType="Z" SubCode="050" Vendor="ATP"/>
    <BrandFeature Application="C" CommercialName="CHOICE OF STANDARD SEAT" Id="2" ServiceGroup="BF" ServiceType="Z" SubCode="050" Vendor="ATP"/>
    <BrandFeature Application="C" CommercialName="STANDARD SEAT SELECTION" Id="3" ServiceGroup="BF" ServiceType="Z" SubCode="050" Vendor="ATP"/>
    <BrandFeature Application="D" CommercialName="REFUNDABLE TICKET" Id="4" ServiceGroup="BF" ServiceType="Z" SubCode="056" Vendor="ATP"/>
    <BrandFeature Application="N" CommercialName="REFUNDABLE TICKET" Id="5" ServiceGroup="BF" ServiceType="Z" SubCode="056" Vendor="ATP"/>
    <!--Другие услуги-->
  </BrandFeatures>
  <PricedItineraries>
    <PricedItinerary SequenceNumber="1">
      <AirItinerary DirectionInd="Return">
        <OriginDestinationOptions>
          <OriginDestinationOption ArrivalCountry="GB" DepartureCountry="AU" ElapsedTime="2460">
            <FlightSegment ArrivalDateTime="2022-12-01T17:15:00" DepartureDateTime="2022-12-01T09:15:00" ElapsedTime="600" FlightNumber="52" ResBookDesigCode="S" StopQuantity="0">
              <DepartureAirport LocationCode="SYD" TerminalID="1"/>
              <ArrivalAirport LocationCode="HND" TerminalID="3"/>
              <OperatingAirline Code="JL" FlightNumber="52"/>
              <Equipment AirEquipType="789"/>
              <MarketingAirline Code="JL"/>
              <MarriageGrp>O</MarriageGrp>
              <DepartureTimeZone GMTOffset="11"/>
              <ArrivalTimeZone GMTOffset="9"/>
              <TPA_Extensions>
                <eTicket Ind="true"/>
                <Mileage Amount="4836"/>
              </TPA_Extensions>
            </FlightSegment>
            <FlightSegment ArrivalDateTime="2022-12-02T15:15:00" DepartureDateTime="2022-12-02T11:30:00" ElapsedTime="765" FlightNumber="43" ResBookDesigCode="S" StopQuantity="0">
              <DepartureAirport LocationCode="HND" TerminalID="3"/>
              <ArrivalAirport LocationCode="LHR" TerminalID="3"/>
              <OperatingAirline Code="JL" FlightNumber="43"/>
              <Equipment AirEquipType="773"/>
              <MarketingAirline Code="JL"/>
              <MarriageGrp>I</MarriageGrp>
              <DepartureTimeZone GMTOffset="9"/>
              <ArrivalTimeZone GMTOffset="0"/>
              <TPA_Extensions>
                <eTicket Ind="true"/>
                <Mileage Amount="5974"/>
              </TPA_Extensions>
            </FlightSegment>
          </OriginDestinationOption>
          <OriginDestinationOption ArrivalCountry="AU" DepartureCountry="GB" ElapsedTime="1785">
            <FlightSegment ArrivalDateTime="2022-12-09T10:25:00" DepartureDateTime="2022-12-08T13:45:00" ElapsedTime="700" FlightNumber="7120" ResBookDesigCode="S" StopQuantity="0">
              <DepartureAirport LocationCode="LHR" TerminalID="5"/>
              <ArrivalAirport LocationCode="HND" TerminalID="3"/>
              <OperatingAirline Code="BA" FlightNumber="5"/>
              <Equipment AirEquipType="789"/>
              <MarketingAirline Code="JL"/>
              <DisclosureAirline Code="BA"/>
              <MarriageGrp>O</MarriageGrp>
              <DepartureTimeZone GMTOffset="0"/>
              <ArrivalTimeZone GMTOffset="9"/>
              <TPA_Extensions>
                <eTicket Ind="true"/>
                <Mileage Amount="5974"/>
              </TPA_Extensions>
            </FlightSegment>
            <FlightSegment ArrivalDateTime="2022-12-10T06:30:00" DepartureDateTime="2022-12-09T18:40:00" ElapsedTime="590" FlightNumber="51" ResBookDesigCode="S" StopQuantity="0">
              <DepartureAirport LocationCode="HND" TerminalID="3"/>
              <ArrivalAirport LocationCode="SYD" TerminalID="1"/>
              <OperatingAirline Code="JL" FlightNumber="51"/>
              <Equipment AirEquipType="789"/>
              <MarketingAirline Code="JL"/>
              <MarriageGrp>I</MarriageGrp>
              <DepartureTimeZone GMTOffset="9"/>
              <ArrivalTimeZone GMTOffset="11"/>
              <TPA_Extensions>
                <eTicket Ind="true"/>
                <Mileage Amount="4836"/>
              </TPA_Extensions>
            </FlightSegment>
          </OriginDestinationOption>
        </OriginDestinationOptions>
      </AirItinerary>
      <AirItineraryPricingInfo FareReturned="true" LastTicketDate="2022-05-27" LastTicketTime="23:59" PricingSource="ADVJR1" PricingSubSource="MIP">
        <ItinTotalFare>
          <BaseFare Amount="2144.00" CurrencyCode="AUD" DecimalPlaces="2"/>
          <FareConstruction Amount="1613.66" CurrencyCode="NUC" DecimalPlaces="2"/>
          <EquivFare Amount="96480" CurrencyCode="RUB" DecimalPlaces="0"/>
          <Taxes>
            <Tax Amount="112286" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="TOTALTAX"/>
          </Taxes>
          <TotalFare Amount="208766" CurrencyCode="RUB" DecimalPlaces="0"/>
        </ItinTotalFare>
        <PTC_FareBreakdowns>
          <PTC_FareBreakdown>
            <PassengerTypeQuantity Code="ADT" Quantity="2"/>
            <FareBasisCodes>
              <FareBasisCode ArrivalAirportCode="HND" BookingCode="S" DepartureAirportCode="SYD" FareComponentBeginAirport="SYD" FareComponentCabinCode="Y" FareComponentDirectionality="FROM" FareComponentEndAirport="LHR" FareComponentFareRule="2291" FareComponentFareTariff="44" FareComponentFareType="XEX" FareComponentFareTypeBitmap="00" FareComponentVendorCode="ATP" GovCarrier="JL">SNN0NPCE</FareBasisCode>
              <FareBasisCode ArrivalAirportCode="LHR" AvailabilityBreak="true" BookingCode="S" DepartureAirportCode="HND" GovCarrier="JL">SNN0NPCE</FareBasisCode>
              <FareBasisCode ArrivalAirportCode="HND" BookingCode="S" DepartureAirportCode="LHR" FareComponentBeginAirport="LHR" FareComponentCabinCode="Y" FareComponentDirectionality="TO" FareComponentEndAirport="SYD" FareComponentFareRule="2291" FareComponentFareTariff="44" FareComponentFareType="XEX" FareComponentFareTypeBitmap="00" FareComponentVendorCode="ATP" GovCarrier="JL">SNN0NPCE</FareBasisCode>
              <FareBasisCode ArrivalAirportCode="SYD" AvailabilityBreak="true" BookingCode="S" DepartureAirportCode="HND" GovCarrier="JL">SNN0NPCE</FareBasisCode>
            </FareBasisCodes>
            <PassengerFare>
              <BaseFare Amount="752.00" CurrencyCode="AUD"/>
              <FareConstruction Amount="566.20" CurrencyCode="NUC" DecimalPlaces="2"/>
              <EquivFare Amount="33840" CurrencyCode="RUB" DecimalPlaces="0"/>
              <Taxes>
                <Tax Amount="9945" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                <Tax Amount="9945" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                <Tax Amount="231" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQI"/>
                <Tax Amount="231" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQI"/>
                <Tax Amount="231" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQI"/>
                <Tax Amount="231" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQI"/>
                <Tax Amount="2700" CountryCode="AU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="AU"/>
                <Tax Amount="1450" CountryCode="AU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="WY"/>
                <Tax Amount="1450" CountryCode="AU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="WY2"/>
                <Tax Amount="6678" CountryCode="GB" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="GB"/>
                <Tax Amount="4457" CountryCode="GB" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="UB"/>
                <Tax Amount="728" CountryCode="JP" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="SW"/>
                <Tax Amount="728" CountryCode="JP" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="SW"/>
                <TaxSummary Amount="20814" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                <TaxSummary Amount="2700" CountryCode="AU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="AU"/>
                <TaxSummary Amount="2900" CountryCode="AU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="WY"/>
                <TaxSummary Amount="1456" CountryCode="JP" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="SW"/>
                <TaxSummary Amount="6678" CountryCode="GB" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="GB"/>
                <TaxSummary Amount="4457" CountryCode="GB" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="UB"/>
                <TotalTax Amount="39005" CurrencyCode="RUB" DecimalPlaces="0"/>
              </Taxes>
              <TotalFare Amount="72845" CurrencyCode="RUB"/>
              <PenaltiesInfo>
                <Penalty Amount="0" Applicability="Before" Changeable="true" ConditionsApply="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                <Penalty Amount="0" Applicability="After" Changeable="true" ConditionsApply="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                <Penalty Amount="27000" Applicability="Before" Cat16Info="true" CurrencyCode="RUB" DecimalPlaces="0" Refundable="true" Type="Refund"/>
                <Penalty Applicability="After" Cat16Info="true" Refundable="false" Type="Refund"/>
              </PenaltiesInfo>
              <TPA_Extensions>
                <Messages>
                  <Message AirlineCode="JL" FailCode="0" Info="RFND RESTR APPLY" Type="N"/>
                  <Message FailCode="0" Info="VALIDATING CARRIER" Type="W"/>
                  <Message FailCode="0" Info="BSP - JL" Type="W"/>
                </Messages>
                <BaggageInformationList>
                  <BaggageInformation AirlineCode="JL" ProvisionType="A">
                    <Segment Id="0"/>
                    <Segment Id="1"/>
                    <Allowance Description1="UP TO 50 POUNDS/23 KILOGRAMS" Description2="UP TO 80 LINEAR INCHES/203 LINEAR CENTIMETERS" Pieces="2"/>
                  </BaggageInformation>
                  <BaggageInformation AirlineCode="JL" ProvisionType="A">
                    <Segment Id="2"/>
                    <Segment Id="3"/>
                    <Allowance Description1="UP TO 50 POUNDS/23 KILOGRAMS" Description2="UP TO 80 LINEAR INCHES/203 LINEAR CENTIMETERS" Pieces="2"/>
                  </BaggageInformation>
                  <BaggageInformation AirlineCode="JL" ProvisionType="B">
                    <Segment Id="0"/>
                    <Allowance Description1="UP TO 22 POUNDS/10 KILOGRAMS" Description2="UP TO 45 LINEAR INCHES/115 LINEAR CENTIMETERS" Pieces="1"/>
                  </BaggageInformation>
                  <BaggageInformation AirlineCode="JL" ProvisionType="B">
                    <Segment Id="1"/>
                    <Allowance Description1="UP TO 22 POUNDS/10 KILOGRAMS" Description2="UP TO 45 LINEAR INCHES/115 LINEAR CENTIMETERS" Pieces="1"/>
                  </BaggageInformation>
                  <BaggageInformation AirlineCode="BA" ProvisionType="B">
                    <Segment Id="2"/>
                    <Allowance Description1="UP TO 34 LINEAR INCHES/85 LINEAR CENTIMETERS" Pieces="1"/>
                  </BaggageInformation>
                  <BaggageInformation AirlineCode="JL" ProvisionType="B">
                    <Segment Id="3"/>
                    <Allowance Description1="UP TO 22 POUNDS/10 KILOGRAMS" Description2="UP TO 45 LINEAR INCHES/115 LINEAR CENTIMETERS" Pieces="1"/>
                  </BaggageInformation>
                </BaggageInformationList>
                <SeatSelectionList>
                  <SeatSelection Type="N">
                    <Segment ID="0"/>
                    <Segment ID="1"/>
                    <Segment ID="2"/>
                    <Segment ID="3"/>
                  </SeatSelection>
                </SeatSelectionList>
              </TPA_Extensions>
            </PassengerFare>
            <Endorsements NonRefundableIndicator="true"/>
            <TPA_Extensions>
              <FareCalcLine Info="SYD JL X/TYO JL LON283.10JL X/TYO JL SYD283.10NUC566.20END ROE1.328146"/>
            </TPA_Extensions>
            <FareInfos>
              <FareInfo>
                <FareReference>S</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="M"/>
                </TPA_Extensions>
              </FareInfo>
              <FareInfo>
                <FareReference>S</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="M"/>
                </TPA_Extensions>
              </FareInfo>
              <FareInfo>
                <FareReference>S</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                </TPA_Extensions>
              </FareInfo>
              <FareInfo>
                <FareReference>S</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="M"/>
                </TPA_Extensions>
              </FareInfo>
            </FareInfos>
          </PTC_FareBreakdown>
          <PTC_FareBreakdown>
            <PassengerTypeQuantity Code="CNN" Quantity="1"/>
            <FareBasisCodes>
              <FareBasisCode ArrivalAirportCode="HND" BookingCode="S" DepartureAirportCode="SYD" FareComponentBeginAirport="SYD" FareComponentCabinCode="Y" FareComponentDirectionality="FROM" FareComponentEndAirport="LHR" FareComponentFareRule="2291" FareComponentFareTariff="44" FareComponentFareType="XEX" FareComponentFareTypeBitmap="01" FareComponentVendorCode="ATP" GovCarrier="JL">SNN0NPCE/CH25</FareBasisCode>
              <FareBasisCode ArrivalAirportCode="LHR" AvailabilityBreak="true" BookingCode="S" DepartureAirportCode="HND" GovCarrier="JL">SNN0NPCE/CH25</FareBasisCode>
              <FareBasisCode ArrivalAirportCode="HND" BookingCode="S" DepartureAirportCode="LHR" FareComponentBeginAirport="LHR" FareComponentCabinCode="Y" FareComponentDirectionality="TO" FareComponentEndAirport="SYD" FareComponentFareRule="2291" FareComponentFareTariff="44" FareComponentFareType="XEX" FareComponentFareTypeBitmap="01" FareComponentVendorCode="ATP" GovCarrier="JL">SNN0NPCE/CH25</FareBasisCode>
              <FareBasisCode ArrivalAirportCode="SYD" AvailabilityBreak="true" BookingCode="S" DepartureAirportCode="HND" GovCarrier="JL">SNN0NPCE/CH25</FareBasisCode>
            </FareBasisCodes>
            <PassengerFare>
              <BaseFare Amount="564.00" CurrencyCode="AUD"/>
              <FareConstruction Amount="424.64" CurrencyCode="NUC" DecimalPlaces="2"/>
              <EquivFare Amount="25380" CurrencyCode="RUB" DecimalPlaces="0"/>
              <Taxes>
                <Tax Amount="9945" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                <Tax Amount="9945" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                <Tax Amount="231" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQI"/>
                <Tax Amount="231" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQI"/>
                <Tax Amount="231" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQI"/>
                <Tax Amount="231" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQI"/>
                <Tax Amount="1450" CountryCode="AU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="WY"/>
                <Tax Amount="1450" CountryCode="AU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="WY2"/>
                <Tax Amount="4457" CountryCode="GB" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="UB"/>
                <Tax Amount="362" CountryCode="JP" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="SW"/>
                <Tax Amount="362" CountryCode="JP" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="SW"/>
                <TaxSummary Amount="20814" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                <TaxSummary Amount="2900" CountryCode="AU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="WY"/>
                <TaxSummary Amount="724" CountryCode="JP" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="SW"/>
                <TaxSummary Amount="4457" CountryCode="GB" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="UB"/>
                <TotalTax Amount="28895" CurrencyCode="RUB" DecimalPlaces="0"/>
              </Taxes>
              <TotalFare Amount="54275" CurrencyCode="RUB"/>
              <PenaltiesInfo>
                <Penalty Amount="0" Applicability="Before" Changeable="true" ConditionsApply="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                <Penalty Amount="0" Applicability="After" Changeable="true" ConditionsApply="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                <Penalty Amount="27000" Applicability="Before" Cat16Info="true" CurrencyCode="RUB" DecimalPlaces="0" Refundable="true" Type="Refund"/>
                <Penalty Applicability="After" Cat16Info="true" Refundable="false" Type="Refund"/>
              </PenaltiesInfo>
              <TPA_Extensions>
                <Messages>
                  <Message AirlineCode="JL" FailCode="0" Info="RFND RESTR APPLY" Type="N"/>
                  <Message FailCode="0" Info="EACH CNN REQUIRES ACCOMPANYING SAME CABIN ADT" Type="W"/>
                  <Message FailCode="0" Info="VALIDATING CARRIER" Type="W"/>
                  <Message FailCode="0" Info="BSP - JL" Type="W"/>
                </Messages>
                <BaggageInformationList>
                  <BaggageInformation AirlineCode="JL" ProvisionType="A">
                    <Segment Id="0"/>
                    <Segment Id="1"/>
                    <Allowance Description1="UP TO 50 POUNDS/23 KILOGRAMS" Description2="UP TO 80 LINEAR INCHES/203 LINEAR CENTIMETERS" Pieces="2"/>
                  </BaggageInformation>
                  <BaggageInformation AirlineCode="JL" ProvisionType="A">
                    <Segment Id="2"/>
                    <Segment Id="3"/>
                    <Allowance Description1="UP TO 50 POUNDS/23 KILOGRAMS" Description2="UP TO 80 LINEAR INCHES/203 LINEAR CENTIMETERS" Pieces="2"/>
                  </BaggageInformation>
                  <BaggageInformation AirlineCode="JL" ProvisionType="B">
                    <Segment Id="0"/>
                    <Allowance Description1="UP TO 22 POUNDS/10 KILOGRAMS" Description2="UP TO 45 LINEAR INCHES/115 LINEAR CENTIMETERS" Pieces="1"/>
                  </BaggageInformation>
                  <BaggageInformation AirlineCode="JL" ProvisionType="B">
                    <Segment Id="1"/>
                    <Allowance Description1="UP TO 22 POUNDS/10 KILOGRAMS" Description2="UP TO 45 LINEAR INCHES/115 LINEAR CENTIMETERS" Pieces="1"/>
                  </BaggageInformation>
                  <BaggageInformation AirlineCode="BA" ProvisionType="B">
                    <Segment Id="2"/>
                    <Allowance Description1="UP TO 34 LINEAR INCHES/85 LINEAR CENTIMETERS" Pieces="1"/>
                  </BaggageInformation>
                  <BaggageInformation AirlineCode="JL" ProvisionType="B">
                    <Segment Id="3"/>
                    <Allowance Description1="UP TO 22 POUNDS/10 KILOGRAMS" Description2="UP TO 45 LINEAR INCHES/115 LINEAR CENTIMETERS" Pieces="1"/>
                  </BaggageInformation>
                </BaggageInformationList>
                <SeatSelectionList>
                  <SeatSelection Type="N">
                    <Segment ID="0"/>
                    <Segment ID="1"/>
                    <Segment ID="2"/>
                    <Segment ID="3"/>
                  </SeatSelection>
                </SeatSelectionList>
              </TPA_Extensions>
            </PassengerFare>
            <Endorsements NonRefundableIndicator="true"/>
            <TPA_Extensions>
              <FareCalcLine Info="SYD JL X/TYO JL LON212.32JL X/TYO JL SYD212.32NUC424.64END ROE1.328146"/>
            </TPA_Extensions>
            <FareInfos>
              <FareInfo>
                <FareReference>S</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="M"/>
                </TPA_Extensions>
              </FareInfo>
              <FareInfo>
                <FareReference>S</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="M"/>
                </TPA_Extensions>
              </FareInfo>
              <FareInfo>
                <FareReference>S</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                </TPA_Extensions>
              </FareInfo>
              <FareInfo>
                <FareReference>S</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="M"/>
                </TPA_Extensions>
              </FareInfo>
            </FareInfos>
          </PTC_FareBreakdown>
          <PTC_FareBreakdown>
            <PassengerTypeQuantity Code="INF" Quantity="1"/>
            <FareBasisCodes>
              <FareBasisCode ArrivalAirportCode="HND" BookingCode="S" DepartureAirportCode="SYD" FareComponentBeginAirport="SYD" FareComponentCabinCode="Y" FareComponentDirectionality="FROM" FareComponentEndAirport="LHR" FareComponentFareRule="2291" FareComponentFareTariff="44" FareComponentFareType="XEX" FareComponentFareTypeBitmap="01" FareComponentVendorCode="ATP" GovCarrier="JL">SNN0NPCE/IN90</FareBasisCode>
              <FareBasisCode ArrivalAirportCode="LHR" AvailabilityBreak="true" BookingCode="S" DepartureAirportCode="HND" GovCarrier="JL">SNN0NPCE/IN90</FareBasisCode>
              <FareBasisCode ArrivalAirportCode="HND" BookingCode="S" DepartureAirportCode="LHR" FareComponentBeginAirport="LHR" FareComponentCabinCode="Y" FareComponentDirectionality="TO" FareComponentEndAirport="SYD" FareComponentFareRule="2291" FareComponentFareTariff="44" FareComponentFareType="XEX" FareComponentFareTypeBitmap="01" FareComponentVendorCode="ATP" GovCarrier="JL">SNN0NPCE/IN90</FareBasisCode>
              <FareBasisCode ArrivalAirportCode="SYD" AvailabilityBreak="true" BookingCode="S" DepartureAirportCode="HND" GovCarrier="JL">SNN0NPCE/IN90</FareBasisCode>
            </FareBasisCodes>
            <PassengerFare>
              <BaseFare Amount="76.00" CurrencyCode="AUD"/>
              <FareConstruction Amount="56.62" CurrencyCode="NUC" DecimalPlaces="2"/>
              <EquivFare Amount="3420" CurrencyCode="RUB" DecimalPlaces="0"/>
              <Taxes>
                <Tax Amount="231" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQI"/>
                <Tax Amount="231" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQI"/>
                <Tax Amount="231" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQI"/>
                <Tax Amount="231" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQI"/>
                <Tax Amount="4457" CountryCode="GB" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="UB"/>
                <TaxSummary Amount="924" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQI"/>
                <TaxSummary Amount="4457" CountryCode="GB" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="UB"/>
                <TotalTax Amount="5381" CurrencyCode="RUB" DecimalPlaces="0"/>
              </Taxes>
              <TotalFare Amount="8801" CurrencyCode="RUB"/>
              <PenaltiesInfo>
                <Penalty Amount="0" Applicability="Before" Changeable="true" ConditionsApply="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                <Penalty Amount="0" Applicability="After" Changeable="true" ConditionsApply="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                <Penalty Amount="27000" Applicability="Before" Cat16Info="true" CurrencyCode="RUB" DecimalPlaces="0" Refundable="true" Type="Refund"/>
                <Penalty Applicability="After" Cat16Info="true" Refundable="false" Type="Refund"/>
              </PenaltiesInfo>
              <TPA_Extensions>
                <Messages>
                  <Message AirlineCode="JL" FailCode="0" Info="RFND RESTR APPLY" Type="N"/>
                  <Message FailCode="0" Info="EACH INF REQUIRES ACCOMPANYING ADT PASSENGER" Type="W"/>
                  <Message FailCode="0" Info="VALIDATING CARRIER" Type="W"/>
                  <Message FailCode="0" Info="BSP - JL" Type="W"/>
                </Messages>
                <BaggageInformationList>
                  <BaggageInformation AirlineCode="JL" ProvisionType="A">
                    <Segment Id="0"/>
                    <Segment Id="1"/>
                    <Allowance Description1="UP TO 50 POUNDS/23 KILOGRAMS" Description2="UP TO 80 LINEAR INCHES/203 LINEAR CENTIMETERS" Pieces="1"/>
                  </BaggageInformation>
                  <BaggageInformation AirlineCode="JL" ProvisionType="A">
                    <Segment Id="2"/>
                    <Segment Id="3"/>
                    <Allowance Description1="UP TO 50 POUNDS/23 KILOGRAMS" Description2="UP TO 80 LINEAR INCHES/203 LINEAR CENTIMETERS" Pieces="1"/>
                  </BaggageInformation>
                  <BaggageInformation AirlineCode="JL" ProvisionType="B">
                    <Segment Id="0"/>
                    <Allowance Description1="UP TO 22 POUNDS/10 KILOGRAMS" Description2="UP TO 45 LINEAR INCHES/115 LINEAR CENTIMETERS" Pieces="1"/>
                  </BaggageInformation>
                  <BaggageInformation AirlineCode="JL" ProvisionType="B">
                    <Segment Id="1"/>
                    <Allowance Description1="UP TO 22 POUNDS/10 KILOGRAMS" Description2="UP TO 45 LINEAR INCHES/115 LINEAR CENTIMETERS" Pieces="1"/>
                  </BaggageInformation>
                  <BaggageInformation AirlineCode="BA" ProvisionType="B">
                    <Segment Id="2"/>
                    <Allowance Description1="UP TO 50 POUNDS/23 KILOGRAMS" Description2="UP TO 50 POUNDS/127 LINEAR CENTIMETERS" Pieces="1"/>
                  </BaggageInformation>
                  <BaggageInformation AirlineCode="JL" ProvisionType="B">
                    <Segment Id="3"/>
                    <Allowance Description1="UP TO 22 POUNDS/10 KILOGRAMS" Description2="UP TO 45 LINEAR INCHES/115 LINEAR CENTIMETERS" Pieces="1"/>
                  </BaggageInformation>
                </BaggageInformationList>
                <SeatSelectionList>
                  <SeatSelection Type="N">
                    <Segment ID="0"/>
                    <Segment ID="1"/>
                    <Segment ID="2"/>
                    <Segment ID="3"/>
                  </SeatSelection>
                </SeatSelectionList>
              </TPA_Extensions>
            </PassengerFare>
            <Endorsements NonRefundableIndicator="true"/>
            <TPA_Extensions>
              <FareCalcLine Info="SYD JL X/TYO JL LON28.31JL X/TYO JL SYD28.31NUC56.62END ROE1.328146"/>
            </TPA_Extensions>
            <FareInfos>
              <FareInfo>
                <FareReference>S</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="M"/>
                </TPA_Extensions>
              </FareInfo>
              <FareInfo>
                <FareReference>S</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="M"/>
                </TPA_Extensions>
              </FareInfo>
              <FareInfo>
                <FareReference>S</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                </TPA_Extensions>
              </FareInfo>
              <FareInfo>
                <FareReference>S</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="M"/>
                </TPA_Extensions>
              </FareInfo>
            </FareInfos>
          </PTC_FareBreakdown>
        </PTC_FareBreakdowns>
        <FareInfos>
          <FareInfo>
            <FareReference>S</FareReference>
            <TPA_Extensions>
              <SeatsRemaining BelowMin="false" Number="9"/>
              <Cabin Cabin="Y"/>
              <Meal Code="M"/>
            </TPA_Extensions>
          </FareInfo>
          <FareInfo>
            <FareReference>S</FareReference>
            <TPA_Extensions>
              <SeatsRemaining BelowMin="false" Number="9"/>
              <Cabin Cabin="Y"/>
              <Meal Code="M"/>
            </TPA_Extensions>
          </FareInfo>
          <FareInfo>
            <FareReference>S</FareReference>
            <TPA_Extensions>
              <SeatsRemaining BelowMin="false" Number="9"/>
              <Cabin Cabin="Y"/>
            </TPA_Extensions>
          </FareInfo>
          <FareInfo>
            <FareReference>S</FareReference>
            <TPA_Extensions>
              <SeatsRemaining BelowMin="false" Number="9"/>
              <Cabin Cabin="Y"/>
              <Meal Code="M"/>
            </TPA_Extensions>
          </FareInfo>
        </FareInfos>
        <TPA_Extensions>
          <DivideInParty Indicator="false"/>
          <AncillaryFeeGroups Message="AIR EXTRAS NOT APPLICABLE OR ARE UNKNOWN FOR THIS ITINERARY"/>
          <ValidatingCarrier NewVcxProcess="true" SettlementMethod="BSP">
            <Default Code="JL"/>
          </ValidatingCarrier>
        </TPA_Extensions>
      </AirItineraryPricingInfo>
      <TicketingInfo TicketType="eTicket" ValidInterline="Yes"/>
      <TPA_Extensions>
        <ValidatingCarrier Code="JL"/>
        <DiversitySwapper WeighedPriceAmount="533239"/>
      </TPA_Extensions>
    </PricedItinerary>
    <!--Другие рекомендации-->
  </PricedItineraries>
</OTA_AirLowFareSearchRS>
```
{{< /details >}}

---

{{< details title="Пример запроса (получение дополнительной информации, GIR ответ)" >}}
```XML
<OTA_AirLowFareSearchRQ ResponseType="GIR" Version="6.5.0" xmlns="http://www.opentravel.org/OTA/2003/05">
  <POS>
    <Source PseudoCityCode="9LSC">
      <RequestorID ID="1" Type="1">
        <CompanyName Code="TN"/>
      </RequestorID>
    </Source>
  </POS>
  <OriginDestinationInformation RPH="1">
    <DepartureDateTime>2022-12-01T11:00:00</DepartureDateTime>
    <OriginLocation LocationCode="SYD"/>
    <DestinationLocation LocationCode="LON"/>
  </OriginDestinationInformation>
  <OriginDestinationInformation RPH="2">
    <DepartureDateTime>2022-12-08T11:00:00</DepartureDateTime>
    <OriginLocation LocationCode="LON"/>
    <DestinationLocation LocationCode="SYD"/>
  </OriginDestinationInformation>
  <TravelPreferences ValidInterlineTicket="true">
    <CabinPref Cabin="Economy" PreferLevel="Preferred"/>
    <TPA_Extensions>
      <LongConnectTime Enable="true"/>
      <LongConnectPoints Max="3" Min="1"/>
      <KeepSameCabin Enabled="true"/>
      <ExcludeCallDirectCarriers Enabled="true"/>
      <SeatSelection Info="true"/>
      <DiversityParameters AdditionalNonStopsPercentage="100"/>
    </TPA_Extensions>
    <AncillaryFees Enable="true">
      <AncillaryFeeGroup Code="BG"/>
    </AncillaryFees>
    <Baggage CarryOnInfo="true" Description="true" RequestType="A"/>
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
```
{{< /details >}}

{{< details title="Пример ответа" >}}
```XML
<GroupedItineraryResponse Version="6.5.0" xmlns="http://webservices.sabre.com/wsdl/sabreXML1.0.00/shopping/GroupedItineraryResponse" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <Message Code="GCB14-ISELL-TN-00-2022-05-00-4HVJ" Severity="Info" Text="27032" Type="SERVER"/>
  <Message Code="TRANSACTIONID" Severity="Info" Text="6962698469073933031" Type="WORKERTHREAD"/>
  <Message Code="RULEID" Severity="Info" Text="15936" Type="DRE"/>
  <Message Code="RULEID" Severity="Info" Text="27757" Type="DEFAULT"/>
  <Message Code="PROCESS" Severity="Error" Text="Communication error: Transmission timeout" Type="MIP"/>
  <Statistics Itineraries="155"/>
  <ScheduleDesc ETicketable="true" ElapsedTime="700" Frequency="SMTWTFS" ID="1" Stops="0" TotalMilesFlown="5974">
    <Departure Airport="LHR" City="LON" Country="GB" Terminal="5" Time="13:45:00Z"/>
    <Arrival Airport="HND" City="TYO" Country="JP" DateAdjustment="1" Terminal="3" Time="10:25:00+09:00"/>
    <Carrier Disclosure="BA" Marketing="JL" MarketingFlightNumber="7120" Operating="BA" OperatingFlightNumber="5">
      <Equipment Code="789" TypeForFirstLeg="W" TypeForLastLeg="W"/>
    </Carrier>
  </ScheduleDesc>
  <ScheduleDesc ETicketable="true" ElapsedTime="905" Frequency="SMTWTF*" ID="2" Stops="0" TotalMilesFlown="7417">
    <Departure Airport="SFO" City="SFO" Country="US" State="CA" Terminal="I" Time="23:00:00-08:00"/>
    <Arrival Airport="SYD" City="SYD" Country="AU" DateAdjustment="2" State="NS" Terminal="1" Time="09:05:00+11:00"/>
    <Carrier Marketing="UA" MarketingFlightNumber="863" Operating="UA" OperatingFlightNumber="863">
      <Equipment Code="789" TypeForFirstLeg="W" TypeForLastLeg="W"/>
    </Carrier>
  </ScheduleDesc>
  <ScheduleDesc ETicketable="true" ElapsedTime="630" Frequency="SMTWTF*" ID="3" Stops="0" TotalMilesFlown="5456">
    <Departure Airport="LAX" City="LAX" Country="US" State="CA" Terminal="7" Time="17:30:00-08:00"/>
    <Arrival Airport="LHR" City="LON" Country="GB" DateAdjustment="1" Terminal="2" Time="12:00:00Z"/>
    <Carrier Marketing="UA" MarketingFlightNumber="923" Operating="UA" OperatingFlightNumber="923">
      <Equipment Code="789" TypeForFirstLeg="W" TypeForLastLeg="W"/>
    </Carrier>
  </ScheduleDesc>
  <ScheduleDesc ETicketable="true" ElapsedTime="770" Frequency="SMTWTFS" ID="4" Stops="0" TotalMilesFlown="5974">
    <Departure Airport="HND" City="TYO" Country="JP" Terminal="3" Time="13:15:00+09:00"/>
    <Arrival Airport="LHR" City="LON" Country="GB" Terminal="5" Time="17:05:00Z"/>
    <Carrier Disclosure="BA" Marketing="JL" MarketingFlightNumber="7121" Operating="BA" OperatingFlightNumber="6">
      <Equipment Code="789" TypeForFirstLeg="W" TypeForLastLeg="W"/>
    </Carrier>
  </ScheduleDesc>
  <ScheduleDesc ETicketable="true" ElapsedTime="795" Frequency="S*TW*F*" ID="5" Stops="0" TotalMilesFlown="5958">
    <Departure Airport="BKK" City="BKK" Country="TH" Time="13:20:00+07:00"/>
    <Arrival Airport="LHR" City="LON" Country="GB" Terminal="2" Time="19:35:00Z"/>
    <Carrier Marketing="TG" MarketingFlightNumber="916" Operating="TG" OperatingFlightNumber="916">
      <Equipment Code="789" TypeForFirstLeg="W" TypeForLastLeg="W"/>
    </Carrier>
  </ScheduleDesc>
  <!--Другие рейсы-->
  <TaxDesc Amount="252" Code="QR2" Country="AU" Currency="RUB" Description="PASSENGER SERVICE CHARGE DOMESTIC ARRIVAL" ID="1" PublishedAmount="5.59" PublishedCurrency="AUD" Station="SYD"/>
  <TaxDesc Amount="4770" Code="YQF" Currency="RUB" Description="SERVICE FEE - CARRIER-IMPOSED FUEL" ID="2" PublishedAmount="106.00" PublishedCurrency="AUD" Station="SYD"/>
  <TaxDesc Amount="58" Code="YQI" Currency="RUB" Description="SERVICE FEE - CARRIER-IMPOSED MISC" ID="3" PublishedAmount="0.90" PublishedCurrency="USD" Station="ICN"/>
  <TaxDesc Amount="10356" Code="YRF" Currency="RUB" Description="SERVICE FEE - CARRIER-IMPOSED FUEL" ID="4" PublishedAmount="161.80" PublishedCurrency="USD" Station="SYD"/>
  <TaxDesc Amount="291" Code="G1" Country="MY" Currency="RUB" Description="DEPARTURE LEVY" ID="5" PublishedAmount="20.00" PublishedCurrency="MYR" Station="KUL"/>
  <!--Другие таксы-->
  <TaxSummaryDesc Amount="898" Code="I5" Country="HK" Currency="RUB" Description="AIRPORT PASSENGER SECURITY CHARGE" ID="1" PublishedAmount="55" PublishedCurrency="HKD" Station="HKG"/>
  <TaxSummaryDesc Amount="20814" Code="YQF" Currency="RUB" Description="SERVICE FEE - CARRIER-IMPOSED FUEL" ID="2" PublishedAmount="221.00" PublishedCurrency="AUD" Station="SYD"/>
  <TaxSummaryDesc Amount="291" Code="G1" Country="MY" Currency="RUB" Description="DEPARTURE LEVY" ID="3" PublishedAmount="20.00" PublishedCurrency="MYR" Station="KUL"/>
  <TaxSummaryDesc Amount="13735" Code="YRF" Currency="RUB" Description="SERVICE FEE - CARRIER-IMPOSED FUEL" ID="4" PublishedAmount="1.00" PublishedCurrency="EUR" Station="CDG"/>
  <TaxSummaryDesc Amount="802" Code="QX" Country="FR" Currency="RUB" Description="PASSENGER SERVICE CHARGE INTERNATIONAL" ID="5" PublishedAmount="11.97" PublishedCurrency="EUR" Station="CDG"/>
  <!--Другие таксы-->
  <OBFeeDesc Amount="0" Currency="RUB" ID="1"/>
  <BrandFeatureDesc Application="F" CommercialName="75 PERCENT MILES EARNED" ID="1" ServiceGroup="BF" ServiceType="Z" SubCode="06C" Vendor="ATP"/>
  <BrandFeatureDesc Application="F" CommercialName="GOLF EQUIPMENT UP TO 15 KG" ID="2" ServiceGroup="BG" ServiceType="C" SubCode="0D4" Vendor="ATP"/>
  <BrandFeatureDesc Application="C" CommercialName="SECOND EXCESS BAG" ID="3" ServiceGroup="BG" ServiceType="C" SubCode="0CD" Vendor="ATP"/>
  <BrandFeatureDesc Application="C" CommercialName="AUH BUSINESS CLASS LOUNGE" ID="4" ServiceGroup="LG" ServiceType="F" SubCode="0AG" Vendor="ATP"/>
  <BrandFeatureDesc Application="C" CommercialName="PRIORITY BOARDING" ID="5" ServiceGroup="TS" ServiceType="F" SubCode="0G6" Vendor="ATP"/>
  <!--Другие услуги-->
  <FareComponentDesc ApplicablePricingCategories="2 3 4 5 7 8 9 10 12 15 16 18 23" CabinCode="Y" Direction="EH" Directionality="FROM" FareAmount="778.15" FareBasisCode="QLWC2AU" FareCurrency="AUD" FarePassengerType="ADT" FareRule="AUGD" FareTariff="4" FareType="XEX" FareTypeBitmap="00" GoverningCarrier="EY" ID="1" NotValidAfter="2022-12-01" NotValidBefore="2022-12-01" PublishedFareAmount="2067.00" VendorCode="ATP">
    <Segment/>
    <Segment Stopover="true">
      <Surcharge Amount="25.00" Currency="NUC" Description="MISCELLANEOUS/OTHER" Type="Q"/>
    </Segment>
    <Brand BrandName="ECONOMY CHOICE" Code="YC" ProgramCode="CFFEY" ProgramDescription="17AUD BP30" ProgramID="125938" ProgramSystemCode="M"/>
  </FareComponentDesc>
  <FareComponentDesc ApplicablePricingCategories="4 5 7 8 9 10 15 16 18 19" CabinCode="Y" Direction="TS" Directionality="TO" FareAmount="28.31" FareBasisCode="SNN0NPCE/IN90" FareCurrency="AUD" FarePassengerType="INF" FareRule="2291" FareTariff="44" FareType="XEX" FareTypeBitmap="01" GoverningCarrier="JL" ID="2" NotValidAfter="2023-12-01" PublishedFareAmount="76.00" TicketDesignator="IN90" VendorCode="ATP">
    <Segment/>
    <Segment/>
  </FareComponentDesc>
  <FareComponentDesc ApplicablePricingCategories="2 3 4 5 6 7 8 9 10 11 12 15 16 18" CabinCode="Y" Direction="AP" Directionality="FROM" FareAmount="636.22" FareBasisCode="TJX00NDT" FareCurrency="AUD" FarePassengerType="ADT" FareRule="2RUE" FareTariff="307" FareType="XPX" FareTypeBitmap="00" GoverningCarrier="UA" ID="3" NotValidAfter="2023-12-01" PublishedFareAmount="1690.00" VendorCode="ATP">
    <Segment/>
    <Segment Stopover="true"/>
    <Brand BrandName="ECONOMY" Code="ECONOMY" ProgramCode="A1S" ProgramDescription="ATLANTIC SPAC" ProgramID="139065" ProgramSystemCode="G"/>
  </FareComponentDesc>
  <FareComponentDesc ApplicablePricingCategories="4 5 6 7 8 10 12 16 19" CabinCode="Y" Direction="EH" Directionality="FROM" FareAmount="72.01" FareBasisCode="LS50ABSM/IN90" FareCurrency="AUD" FarePassengerType="INF" FareRule="E2SM" FareTariff="4" FareType="XEX" FareTypeBitmap="01" GoverningCarrier="AF" ID="4" NotValidAfter="2022-12-01" NotValidBefore="2022-12-01" PublishedFareAmount="192.00" TicketDesignator="IN90" VendorCode="ATP">
    <Segment>
      <Surcharge Amount="9.41" Currency="NUC" Description="MISCELLANEOUS/OTHER" Type="Q"/>
    </Segment>
    <Segment/>
    <Segment Stopover="true"/>
    <Brand BrandName="ECONOMY STANDARD" Code="STANDARD" ProgramCode="CFFAF" ProgramDescription="ICA TO ICA 0 BAG" ProgramID="138270" ProgramSystemCode="X"/>
  </FareComponentDesc>
  <FareComponentDesc ApplicablePricingCategories="3 4 5 7 8 9 10 16 18 19" CabinCode="Y" Direction="TS" Directionality="FROM" FareAmount="60.61" FareBasisCode="KKOP/IN90" FareCurrency="AUD" FarePassengerType="INF" FareRule="OP50" FareTariff="44" FareType="XES" FareTypeBitmap="01" GoverningCarrier="OZ" ID="5" NotValidAfter="2023-12-01" PublishedFareAmount="161.00" TicketDesignator="IN90" VendorCode="ATP">
    <Segment/>
    <Segment Stopover="true"/>
  </FareComponentDesc>
  <!--Другие компоненты тарифов-->
  <ValidatingCarrierDesc ID="1" NewVcxProcess="true" SettlementMethod="BSP">
    <Default Code="HR"/>
  </ValidatingCarrierDesc>
  <ValidatingCarrierDesc ID="2" NewVcxProcess="true" SettlementMethod="BSP">
    <Default Code="UA"/>
  </ValidatingCarrierDesc>
  <ValidatingCarrierDesc ID="3" NewVcxProcess="true" SettlementMethod="BSP">
    <Default Code="AF"/>
  </ValidatingCarrierDesc>
  <ValidatingCarrierDesc ID="4" NewVcxProcess="true" SettlementMethod="BSP">
    <Default Code="MH"/>
  </ValidatingCarrierDesc>
  <ValidatingCarrierDesc ID="5" NewVcxProcess="true" SettlementMethod="BSP">
    <Default Code="UL"/>
  </ValidatingCarrierDesc>
  <!--Другие валидирующие перевозчики-->
  <BaggageAllowanceDesc Description1="UP TO 50 POUNDS/23 KILOGRAMS" Description2="UP TO 45 LINEAR INCHES/115 LINEAR CENTIMETERS" ID="1" Pieces="1"/>
  <BaggageAllowanceDesc Description1="UP TO 50 POUNDS/23 KILOGRAMS" Description2="UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS" ID="2" Pieces="1"/>
  <BaggageAllowanceDesc Description1="UP TO 34 LINEAR INCHES/85 LINEAR CENTIMETERS" ID="3" Pieces="1"/>
  <BaggageAllowanceDesc Description1="UP TO 22 POUNDS/10 KILOGRAMS" Description2="UP TO 45 LINEAR INCHES/115 LINEAR CENTIMETERS" ID="4" Pieces="1"/>
  <BaggageAllowanceDesc ID="5" Pieces="1" Unit="kg" Weight="7"/>
  <!--Другие нормы провоза багажа-->
  <LegDesc ElapsedTime="2170" ID="1">
    <Schedule Ref="31"/>
    <Schedule DepartureDateAdjustment="1" Ref="6"/>
  </LegDesc>
  <LegDesc ElapsedTime="2035" ID="2">
    <Schedule Ref="81"/>
    <Schedule Ref="83"/>
  </LegDesc>
  <LegDesc ElapsedTime="2675" ID="3">
    <Schedule Ref="24"/>
    <Schedule DepartureDateAdjustment="1" Ref="5"/>
  </LegDesc>
  <LegDesc ElapsedTime="2795" ID="4">
    <Schedule Ref="33"/>
    <Schedule DepartureDateAdjustment="2" Ref="22"/>
  </LegDesc>
  <LegDesc ElapsedTime="1355" ID="5">
    <Schedule Ref="66"/>
    <Schedule DepartureDateAdjustment="1" Ref="102"/>
  </LegDesc>
  <!--Другие плечи-->
  <ItineraryGroup>
    <GroupDescription>
      <LegDescription ArrivalLocation="LHR" DepartureDate="2022-12-01" DepartureLocation="SYD"/>
      <LegDescription ArrivalLocation="SYD" DepartureDate="2022-12-08" DepartureLocation="LHR"/>
    </GroupDescription>
    <Itinerary ID="1" PricingSource="ADVJR1">
      <Leg Ref="17"/>
      <Leg Ref="12"/>
      <PricingInformation PricingSubsource="MIP">
        <Fare ETicketable="true" GoverningCarriers="JL JL" LastTicketDate="2022-05-27" LastTicketTime="23:59" VITA="true" ValidatingCarrierCode="JL">
          <PassengerInfo NonRefundable="true" PassengerNumber="2" PassengerType="ADT">
            <FareComponent Ref="48">
              <Segment BookingCode="S" CabinCode="Y" MealCode="M" SeatsAvailable="9"/>
              <Segment AvailabilityBreak="true" BookingCode="S" CabinCode="Y" MealCode="M" SeatsAvailable="9"/>
            </FareComponent>
            <FareComponent Ref="96">
              <Segment BookingCode="S" CabinCode="Y" SeatsAvailable="9"/>
              <Segment AvailabilityBreak="true" BookingCode="S" CabinCode="Y" MealCode="M" SeatsAvailable="9"/>
            </FareComponent>
            <Tax Ref="46"/>
            <Tax Ref="48"/>
            <Tax Ref="26"/>
            <Tax Ref="71"/>
            <Tax Ref="97"/>
            <Tax Ref="71"/>
            <Tax Ref="59"/>
            <Tax Ref="76"/>
            <Tax Ref="78"/>
            <Tax Ref="28"/>
            <Tax Ref="38"/>
            <Tax Ref="88"/>
            <Tax Ref="88"/>
            <TaxSummary Ref="2"/>
            <TaxSummary Ref="38"/>
            <TaxSummary Ref="30"/>
            <TaxSummary Ref="43"/>
            <TaxSummary Ref="15"/>
            <TaxSummary Ref="24"/>
            <CurrencyConversion ExchangeRateUsed="45" From="AUD" To="RUB"/>
            <FareMessage Carrier="JL" Code="0" Info="RFND RESTR APPLY" Type="N"/>
            <FareMessage Code="0" Info="VALIDATING CARRIER" Type="W"/>
            <FareMessage Code="0" Info="BSP - JL" Type="W"/>
            <PassengerTotalFare BaseFareAmount="752.00" BaseFareCurrency="AUD" CommissionAmount="0" CommissionPercentage="0" ConstructionAmount="566.20" ConstructionCurrency="NUC" Currency="RUB" EquivalentAmount="33840" EquivalentCurrency="RUB" ExchangeRateOne="1.32814600" TotalFare="72845" TotalTaxes="39005"/>
            <BaggageInformation AirlineCode="JL" ProvisionType="A">
              <Segment ID="0"/>
              <Segment ID="1"/>
              <Allowance Ref="38"/>
            </BaggageInformation>
            <BaggageInformation AirlineCode="JL" ProvisionType="A">
              <Segment ID="2"/>
              <Segment ID="3"/>
              <Allowance Ref="38"/>
            </BaggageInformation>
            <BaggageInformation AirlineCode="JL" ProvisionType="B">
              <Segment ID="0"/>
              <Allowance Ref="49"/>
            </BaggageInformation>
            <BaggageInformation AirlineCode="JL" ProvisionType="B">
              <Segment ID="1"/>
              <Allowance Ref="49"/>
            </BaggageInformation>
            <BaggageInformation AirlineCode="BA" ProvisionType="B">
              <Segment ID="2"/>
              <Allowance Ref="3"/>
            </BaggageInformation>
            <BaggageInformation AirlineCode="JL" ProvisionType="B">
              <Segment ID="3"/>
              <Allowance Ref="49"/>
            </BaggageInformation>
            <PenaltiesInfo>
              <Penalty Amount="0" Applicability="Before" Changeable="true" ConditionsApply="true" Currency="RUB" Type="Exchange"/>
              <Penalty Amount="0" Applicability="After" Changeable="true" ConditionsApply="true" Currency="RUB" Type="Exchange"/>
              <Penalty Amount="27000" Applicability="Before" Cat16Info="true" Currency="RUB" Refundable="true" Type="Refund"/>
              <Penalty Applicability="After" Cat16Info="true" Refundable="false" Type="Refund"/>
            </PenaltiesInfo>
            <SeatSelection Type="N">
              <Segment ID="0"/>
              <Segment ID="1"/>
              <Segment ID="2"/>
              <Segment ID="3"/>
            </SeatSelection>
          </PassengerInfo>
          <PassengerInfo NonRefundable="true" PassengerNumber="1" PassengerType="CNN">
            <FareComponent Ref="44">
              <Segment BookingCode="S" CabinCode="Y" MealCode="M" SeatsAvailable="9"/>
              <Segment AvailabilityBreak="true" BookingCode="S" CabinCode="Y" MealCode="M" SeatsAvailable="9"/>
            </FareComponent>
            <FareComponent Ref="32">
              <Segment BookingCode="S" CabinCode="Y" SeatsAvailable="9"/>
              <Segment AvailabilityBreak="true" BookingCode="S" CabinCode="Y" MealCode="M" SeatsAvailable="9"/>
            </FareComponent>
            <Tax Ref="46"/>
            <Tax Ref="48"/>
            <Tax Ref="26"/>
            <Tax Ref="71"/>
            <Tax Ref="97"/>
            <Tax Ref="71"/>
            <Tax Ref="76"/>
            <Tax Ref="78"/>
            <Tax Ref="38"/>
            <Tax Ref="72"/>
            <Tax Ref="72"/>
            <TaxSummary Ref="2"/>
            <TaxSummary Ref="30"/>
            <TaxSummary Ref="42"/>
            <TaxSummary Ref="24"/>
            <CurrencyConversion ExchangeRateUsed="45" From="AUD" To="RUB"/>
            <FareMessage Carrier="JL" Code="0" Info="RFND RESTR APPLY" Type="N"/>
            <FareMessage Code="0" Info="EACH CNN REQUIRES ACCOMPANYING SAME CABIN ADT" Type="W"/>
            <FareMessage Code="0" Info="VALIDATING CARRIER" Type="W"/>
            <FareMessage Code="0" Info="BSP - JL" Type="W"/>
            <PassengerTotalFare BaseFareAmount="564.00" BaseFareCurrency="AUD" CommissionAmount="0" CommissionPercentage="0" ConstructionAmount="424.64" ConstructionCurrency="NUC" Currency="RUB" EquivalentAmount="25380" EquivalentCurrency="RUB" ExchangeRateOne="1.32814600" TotalFare="54275" TotalTaxes="28895"/>
            <BaggageInformation AirlineCode="JL" ProvisionType="A">
              <Segment ID="0"/>
              <Segment ID="1"/>
              <Allowance Ref="38"/>
            </BaggageInformation>
            <BaggageInformation AirlineCode="JL" ProvisionType="A">
              <Segment ID="2"/>
              <Segment ID="3"/>
              <Allowance Ref="38"/>
            </BaggageInformation>
            <BaggageInformation AirlineCode="JL" ProvisionType="B">
              <Segment ID="0"/>
              <Allowance Ref="49"/>
            </BaggageInformation>
            <BaggageInformation AirlineCode="JL" ProvisionType="B">
              <Segment ID="1"/>
              <Allowance Ref="49"/>
            </BaggageInformation>
            <BaggageInformation AirlineCode="BA" ProvisionType="B">
              <Segment ID="2"/>
              <Allowance Ref="3"/>
            </BaggageInformation>
            <BaggageInformation AirlineCode="JL" ProvisionType="B">
              <Segment ID="3"/>
              <Allowance Ref="49"/>
            </BaggageInformation>
            <PenaltiesInfo>
              <Penalty Amount="0" Applicability="Before" Changeable="true" ConditionsApply="true" Currency="RUB" Type="Exchange"/>
              <Penalty Amount="0" Applicability="After" Changeable="true" ConditionsApply="true" Currency="RUB" Type="Exchange"/>
              <Penalty Amount="27000" Applicability="Before" Cat16Info="true" Currency="RUB" Refundable="true" Type="Refund"/>
              <Penalty Applicability="After" Cat16Info="true" Refundable="false" Type="Refund"/>
            </PenaltiesInfo>
            <SeatSelection Type="N">
              <Segment ID="0"/>
              <Segment ID="1"/>
              <Segment ID="2"/>
              <Segment ID="3"/>
            </SeatSelection>
          </PassengerInfo>
          <PassengerInfo NonRefundable="true" PassengerNumber="1" PassengerType="INF">
            <FareComponent Ref="60">
              <Segment BookingCode="S" CabinCode="Y" MealCode="M" SeatsAvailable="9"/>
              <Segment AvailabilityBreak="true" BookingCode="S" CabinCode="Y" MealCode="M" SeatsAvailable="9"/>
            </FareComponent>
            <FareComponent Ref="2">
              <Segment BookingCode="S" CabinCode="Y" SeatsAvailable="9"/>
              <Segment AvailabilityBreak="true" BookingCode="S" CabinCode="Y" MealCode="M" SeatsAvailable="9"/>
            </FareComponent>
            <Tax Ref="26"/>
            <Tax Ref="71"/>
            <Tax Ref="97"/>
            <Tax Ref="71"/>
            <Tax Ref="38"/>
            <TaxSummary Ref="21"/>
            <TaxSummary Ref="24"/>
            <CurrencyConversion ExchangeRateUsed="45" From="AUD" To="RUB"/>
            <FareMessage Carrier="JL" Code="0" Info="RFND RESTR APPLY" Type="N"/>
            <FareMessage Code="0" Info="EACH INF REQUIRES ACCOMPANYING ADT PASSENGER" Type="W"/>
            <FareMessage Code="0" Info="VALIDATING CARRIER" Type="W"/>
            <FareMessage Code="0" Info="BSP - JL" Type="W"/>
            <PassengerTotalFare BaseFareAmount="76.00" BaseFareCurrency="AUD" CommissionAmount="0" CommissionPercentage="0" ConstructionAmount="56.62" ConstructionCurrency="NUC" Currency="RUB" EquivalentAmount="3420" EquivalentCurrency="RUB" ExchangeRateOne="1.32814600" TotalFare="8801" TotalTaxes="5381"/>
            <BaggageInformation AirlineCode="JL" ProvisionType="A">
              <Segment ID="0"/>
              <Segment ID="1"/>
              <Allowance Ref="33"/>
            </BaggageInformation>
            <BaggageInformation AirlineCode="JL" ProvisionType="A">
              <Segment ID="2"/>
              <Segment ID="3"/>
              <Allowance Ref="33"/>
            </BaggageInformation>
            <BaggageInformation AirlineCode="JL" ProvisionType="B">
              <Segment ID="0"/>
              <Allowance Ref="49"/>
            </BaggageInformation>
            <BaggageInformation AirlineCode="JL" ProvisionType="B">
              <Segment ID="1"/>
              <Allowance Ref="49"/>
            </BaggageInformation>
            <BaggageInformation AirlineCode="BA" ProvisionType="B">
              <Segment ID="2"/>
              <Allowance Ref="44"/>
            </BaggageInformation>
            <BaggageInformation AirlineCode="JL" ProvisionType="B">
              <Segment ID="3"/>
              <Allowance Ref="49"/>
            </BaggageInformation>
            <PenaltiesInfo>
              <Penalty Amount="0" Applicability="Before" Changeable="true" ConditionsApply="true" Currency="RUB" Type="Exchange"/>
              <Penalty Amount="0" Applicability="After" Changeable="true" ConditionsApply="true" Currency="RUB" Type="Exchange"/>
              <Penalty Amount="27000" Applicability="Before" Cat16Info="true" Currency="RUB" Refundable="true" Type="Refund"/>
              <Penalty Applicability="After" Cat16Info="true" Refundable="false" Type="Refund"/>
            </PenaltiesInfo>
            <SeatSelection Type="N">
              <Segment ID="0"/>
              <Segment ID="1"/>
              <Segment ID="2"/>
              <Segment ID="3"/>
            </SeatSelection>
          </PassengerInfo>
          <AncillaryFeeGroup Message="AIR EXTRAS NOT APPLICABLE OR ARE UNKNOWN FOR THIS ITINERARY"/>
          <TotalFare BaseFareAmount="2144.00" BaseFareCurrency="AUD" ConstructionAmount="1613.66" ConstructionCurrency="NUC" Currency="RUB" EquivalentAmount="96480" EquivalentCurrency="RUB" TotalPrice="208766" TotalTaxes="112286"/>
          <ValidatingCarrier Ref="12"/>
        </Fare>
      </PricingInformation>
      <DiversitySwapper WeighedPrice="533238.527"/>
    </Itinerary>
    <!--Другие рекомендации-->
  </ItineraryGroup>
</GroupedItineraryResponse>
```
{{< /details >}}

---

{{< details title="Пример запроса (получение расчетов стоимости по всем доступным брендам, OTA ответ)" >}}
```XML
<OTA_AirLowFareSearchRQ ResponseType="OTA" Version="6.5.0" xmlns="http://www.opentravel.org/OTA/2003/05">
  <POS>
    <Source PseudoCityCode="9LSC">
      <RequestorID ID="1" Type="1">
        <CompanyName Code="TN"/>
      </RequestorID>
    </Source>
  </POS>
  <OriginDestinationInformation RPH="1">
    <DepartureDateTime>2022-12-01T11:00:00</DepartureDateTime>
    <OriginLocation LocationCode="SYD"/>
    <DestinationLocation LocationCode="LON"/>
  </OriginDestinationInformation>
  <OriginDestinationInformation RPH="2">
    <DepartureDateTime>2022-12-08T11:00:00</DepartureDateTime>
    <OriginLocation LocationCode="LON"/>
    <DestinationLocation LocationCode="SYD"/>
  </OriginDestinationInformation>
  <TravelPreferences ValidInterlineTicket="true">
    <CabinPref Cabin="Economy" PreferLevel="Preferred"/>
    <TPA_Extensions>
      <LongConnectTime Enable="true"/>
      <LongConnectPoints Max="3" Min="1"/>
      <KeepSameCabin Enabled="true"/>
      <ExcludeCallDirectCarriers Enabled="true"/>
      <SeatSelection Info="true"/>
      <DiversityParameters AdditionalNonStopsPercentage="100"/>
    </TPA_Extensions>
    <AncillaryFees Enable="true">
      <AncillaryFeeGroup Code="BG"/>
    </AncillaryFees>
    <Baggage CarryOnInfo="true" Description="true" RequestType="A"/>
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
```
{{< /details >}}

{{< details title="Пример ответа" >}}
```XML
<OTA_AirLowFareSearchRS AvailableItinCount="0" BrandedOneWayItinCount="0" DepartedItinCount="0" PricedItinCount="53" SimpleOneWayItinCount="0" SoldOutItinCount="0" Version="6.5.0" xmlns="http://www.opentravel.org/OTA/2003/05" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <Success/>
  <Warnings>
    <Warning Code="PROCESS" NumberOfOccurences="2" ShortText="Communication error: Transmission timeout" Type="MIP"/>
    <Warning Code="GCA14-ISELL-TN-00-2022-05-00-BQH5" MessageClass="I" ShortText="27040" Type="SERVER"/>
    <Warning Code="TRANSACTIONID" MessageClass="I" ShortText="2260549591948481569" Type="WORKERTHREAD"/>
    <Warning Code="RULEID" MessageClass="I" ShortText="15936" Type="DRE"/>
    <Warning Code="RULEID" MessageClass="I" ShortText="27757" Type="DEFAULT"/>
  </Warnings>
  <BrandFeatures>
    <BrandFeature Application="C" CommercialName="CHOICE OF STANDARD SEAT" Id="1" ServiceGroup="BF" ServiceType="Z" SubCode="050" Vendor="ATP"/>
    <BrandFeature Application="F" CommercialName="STANDARD SEAT SELECTION" Id="2" ServiceGroup="BF" ServiceType="Z" SubCode="050" Vendor="ATP"/>
    <BrandFeature Application="F" CommercialName="CHOICE OF STANDARD SEAT" Id="3" ServiceGroup="BF" ServiceType="Z" SubCode="050" Vendor="ATP"/>
    <BrandFeature Application="F" CommercialName="BASIC SEAT" Id="4" ServiceGroup="BF" ServiceType="Z" SubCode="050" Vendor="ATP"/>
    <BrandFeature Application="C" CommercialName="STANDARD SEAT SELECTION" Id="5" ServiceGroup="BF" ServiceType="Z" SubCode="050" Vendor="ATP"/>
    <!--Другие услуги-->
  </BrandFeatures>
  <PricedItineraries>
    <PricedItinerary SequenceNumber="1">
      <AirItinerary DirectionInd="Return">
        <OriginDestinationOptions>
          <OriginDestinationOption ArrivalCountry="GB" DepartureCountry="AU" ElapsedTime="2460">
            <FlightSegment ArrivalDateTime="2022-12-01T17:15:00" DepartureDateTime="2022-12-01T09:15:00" ElapsedTime="600" FlightNumber="52" ResBookDesigCode="S" StopQuantity="0">
              <DepartureAirport LocationCode="SYD" TerminalID="1"/>
              <ArrivalAirport LocationCode="HND" TerminalID="3"/>
              <OperatingAirline Code="JL" FlightNumber="52"/>
              <Equipment AirEquipType="789"/>
              <MarketingAirline Code="JL"/>
              <MarriageGrp>O</MarriageGrp>
              <DepartureTimeZone GMTOffset="11"/>
              <ArrivalTimeZone GMTOffset="9"/>
              <TPA_Extensions>
                <eTicket Ind="true"/>
                <Mileage Amount="4836"/>
              </TPA_Extensions>
            </FlightSegment>
            <FlightSegment ArrivalDateTime="2022-12-02T15:15:00" DepartureDateTime="2022-12-02T11:30:00" ElapsedTime="765" FlightNumber="43" ResBookDesigCode="S" StopQuantity="0">
              <DepartureAirport LocationCode="HND" TerminalID="3"/>
              <ArrivalAirport LocationCode="LHR" TerminalID="3"/>
              <OperatingAirline Code="JL" FlightNumber="43"/>
              <Equipment AirEquipType="773"/>
              <MarketingAirline Code="JL"/>
              <MarriageGrp>I</MarriageGrp>
              <DepartureTimeZone GMTOffset="9"/>
              <ArrivalTimeZone GMTOffset="0"/>
              <TPA_Extensions>
                <eTicket Ind="true"/>
                <Mileage Amount="5974"/>
              </TPA_Extensions>
            </FlightSegment>
          </OriginDestinationOption>
          <OriginDestinationOption ArrivalCountry="AU" DepartureCountry="GB" ElapsedTime="1785">
            <FlightSegment ArrivalDateTime="2022-12-09T10:25:00" DepartureDateTime="2022-12-08T13:45:00" ElapsedTime="700" FlightNumber="7120" ResBookDesigCode="S" StopQuantity="0">
              <DepartureAirport LocationCode="LHR" TerminalID="5"/>
              <ArrivalAirport LocationCode="HND" TerminalID="3"/>
              <OperatingAirline Code="BA" FlightNumber="5"/>
              <Equipment AirEquipType="789"/>
              <MarketingAirline Code="JL"/>
              <DisclosureAirline Code="BA"/>
              <MarriageGrp>O</MarriageGrp>
              <DepartureTimeZone GMTOffset="0"/>
              <ArrivalTimeZone GMTOffset="9"/>
              <TPA_Extensions>
                <eTicket Ind="true"/>
                <Mileage Amount="5974"/>
              </TPA_Extensions>
            </FlightSegment>
            <FlightSegment ArrivalDateTime="2022-12-10T06:30:00" DepartureDateTime="2022-12-09T18:40:00" ElapsedTime="590" FlightNumber="51" ResBookDesigCode="S" StopQuantity="0">
              <DepartureAirport LocationCode="HND" TerminalID="3"/>
              <ArrivalAirport LocationCode="SYD" TerminalID="1"/>
              <OperatingAirline Code="JL" FlightNumber="51"/>
              <Equipment AirEquipType="789"/>
              <MarketingAirline Code="JL"/>
              <MarriageGrp>I</MarriageGrp>
              <DepartureTimeZone GMTOffset="9"/>
              <ArrivalTimeZone GMTOffset="11"/>
              <TPA_Extensions>
                <eTicket Ind="true"/>
                <Mileage Amount="4836"/>
              </TPA_Extensions>
            </FlightSegment>
          </OriginDestinationOption>
        </OriginDestinationOptions>
      </AirItinerary>
      <AirItineraryPricingInfo FareReturned="true" LastTicketDate="2022-05-27" LastTicketTime="23:59" PricingSource="ADVJR1" PricingSubSource="MIP">
        <ItinTotalFare>
          <BaseFare Amount="2144.00" CurrencyCode="AUD" DecimalPlaces="2"/>
          <FareConstruction Amount="1613.66" CurrencyCode="NUC" DecimalPlaces="2"/>
          <EquivFare Amount="96480" CurrencyCode="RUB" DecimalPlaces="0"/>
          <Taxes>
            <Tax Amount="112286" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="TOTALTAX"/>
          </Taxes>
          <TotalFare Amount="208766" CurrencyCode="RUB" DecimalPlaces="0"/>
        </ItinTotalFare>
        <PTC_FareBreakdowns>
          <PTC_FareBreakdown>
            <PassengerTypeQuantity Code="ADT" Quantity="2"/>
            <FareBasisCodes>
              <FareBasisCode ArrivalAirportCode="HND" BookingCode="S" DepartureAirportCode="SYD" FareComponentBeginAirport="SYD" FareComponentCabinCode="Y" FareComponentDirectionality="FROM" FareComponentEndAirport="LHR" FareComponentFareRule="2291" FareComponentFareTariff="44" FareComponentFareType="XEX" FareComponentFareTypeBitmap="00" FareComponentVendorCode="ATP" GovCarrier="JL">SNN0NPCE</FareBasisCode>
              <FareBasisCode ArrivalAirportCode="LHR" AvailabilityBreak="true" BookingCode="S" DepartureAirportCode="HND" GovCarrier="JL">SNN0NPCE</FareBasisCode>
              <FareBasisCode ArrivalAirportCode="HND" BookingCode="S" DepartureAirportCode="LHR" FareComponentBeginAirport="LHR" FareComponentCabinCode="Y" FareComponentDirectionality="TO" FareComponentEndAirport="SYD" FareComponentFareRule="2291" FareComponentFareTariff="44" FareComponentFareType="XEX" FareComponentFareTypeBitmap="00" FareComponentVendorCode="ATP" GovCarrier="JL">SNN0NPCE</FareBasisCode>
              <FareBasisCode ArrivalAirportCode="SYD" AvailabilityBreak="true" BookingCode="S" DepartureAirportCode="HND" GovCarrier="JL">SNN0NPCE</FareBasisCode>
            </FareBasisCodes>
            <PassengerFare>
              <BaseFare Amount="752.00" CurrencyCode="AUD"/>
              <FareConstruction Amount="566.20" CurrencyCode="NUC" DecimalPlaces="2"/>
              <EquivFare Amount="33840" CurrencyCode="RUB" DecimalPlaces="0"/>
              <Taxes>
                <Tax Amount="9945" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                <Tax Amount="9945" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                <Tax Amount="231" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQI"/>
                <Tax Amount="231" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQI"/>
                <Tax Amount="231" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQI"/>
                <Tax Amount="231" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQI"/>
                <Tax Amount="2700" CountryCode="AU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="AU"/>
                <Tax Amount="1450" CountryCode="AU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="WY"/>
                <Tax Amount="1450" CountryCode="AU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="WY2"/>
                <Tax Amount="6678" CountryCode="GB" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="GB"/>
                <Tax Amount="4457" CountryCode="GB" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="UB"/>
                <Tax Amount="728" CountryCode="JP" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="SW"/>
                <Tax Amount="728" CountryCode="JP" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="SW"/>
                <TaxSummary Amount="20814" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                <TaxSummary Amount="2700" CountryCode="AU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="AU"/>
                <TaxSummary Amount="2900" CountryCode="AU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="WY"/>
                <TaxSummary Amount="1456" CountryCode="JP" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="SW"/>
                <TaxSummary Amount="6678" CountryCode="GB" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="GB"/>
                <TaxSummary Amount="4457" CountryCode="GB" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="UB"/>
                <TotalTax Amount="39005" CurrencyCode="RUB" DecimalPlaces="0"/>
              </Taxes>
              <TotalFare Amount="72845" CurrencyCode="RUB"/>
              <PenaltiesInfo>
                <Penalty Amount="0" Applicability="Before" Changeable="true" ConditionsApply="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                <Penalty Amount="0" Applicability="After" Changeable="true" ConditionsApply="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                <Penalty Amount="27000" Applicability="Before" Cat16Info="true" CurrencyCode="RUB" DecimalPlaces="0" Refundable="true" Type="Refund"/>
                <Penalty Applicability="After" Cat16Info="true" Refundable="false" Type="Refund"/>
              </PenaltiesInfo>
              <TPA_Extensions>
                <Messages>
                  <Message AirlineCode="JL" FailCode="0" Info="RFND RESTR APPLY" Type="N"/>
                  <Message FailCode="0" Info="VALIDATING CARRIER" Type="W"/>
                  <Message FailCode="0" Info="BSP - JL" Type="W"/>
                </Messages>
                <BaggageInformationList>
                  <BaggageInformation AirlineCode="JL" ProvisionType="A">
                    <Segment Id="0"/>
                    <Segment Id="1"/>
                    <Allowance Description1="UP TO 50 POUNDS/23 KILOGRAMS" Description2="UP TO 80 LINEAR INCHES/203 LINEAR CENTIMETERS" Pieces="2"/>
                  </BaggageInformation>
                  <BaggageInformation AirlineCode="JL" ProvisionType="A">
                    <Segment Id="2"/>
                    <Segment Id="3"/>
                    <Allowance Description1="UP TO 50 POUNDS/23 KILOGRAMS" Description2="UP TO 80 LINEAR INCHES/203 LINEAR CENTIMETERS" Pieces="2"/>
                  </BaggageInformation>
                  <BaggageInformation AirlineCode="JL" ProvisionType="B">
                    <Segment Id="0"/>
                    <Allowance Description1="UP TO 22 POUNDS/10 KILOGRAMS" Description2="UP TO 45 LINEAR INCHES/115 LINEAR CENTIMETERS" Pieces="1"/>
                  </BaggageInformation>
                  <BaggageInformation AirlineCode="JL" ProvisionType="B">
                    <Segment Id="1"/>
                    <Allowance Description1="UP TO 22 POUNDS/10 KILOGRAMS" Description2="UP TO 45 LINEAR INCHES/115 LINEAR CENTIMETERS" Pieces="1"/>
                  </BaggageInformation>
                  <BaggageInformation AirlineCode="BA" ProvisionType="B">
                    <Segment Id="2"/>
                    <Allowance Description1="UP TO 34 LINEAR INCHES/85 LINEAR CENTIMETERS" Pieces="1"/>
                  </BaggageInformation>
                  <BaggageInformation AirlineCode="JL" ProvisionType="B">
                    <Segment Id="3"/>
                    <Allowance Description1="UP TO 22 POUNDS/10 KILOGRAMS" Description2="UP TO 45 LINEAR INCHES/115 LINEAR CENTIMETERS" Pieces="1"/>
                  </BaggageInformation>
                </BaggageInformationList>
                <SeatSelectionList>
                  <SeatSelection Type="N">
                    <Segment ID="0"/>
                    <Segment ID="1"/>
                    <Segment ID="2"/>
                    <Segment ID="3"/>
                  </SeatSelection>
                </SeatSelectionList>
              </TPA_Extensions>
            </PassengerFare>
            <Endorsements NonRefundableIndicator="true"/>
            <TPA_Extensions>
              <FareCalcLine Info="SYD JL X/TYO JL LON283.10JL X/TYO JL SYD283.10NUC566.20END ROE1.328146"/>
            </TPA_Extensions>
            <FareInfos>
              <FareInfo>
                <FareReference>S</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="M"/>
                </TPA_Extensions>
              </FareInfo>
              <FareInfo>
                <FareReference>S</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="M"/>
                </TPA_Extensions>
              </FareInfo>
              <FareInfo>
                <FareReference>S</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                </TPA_Extensions>
              </FareInfo>
              <FareInfo>
                <FareReference>S</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="M"/>
                </TPA_Extensions>
              </FareInfo>
            </FareInfos>
          </PTC_FareBreakdown>
          <PTC_FareBreakdown>
            <PassengerTypeQuantity Code="CNN" Quantity="1"/>
            <FareBasisCodes>
              <FareBasisCode ArrivalAirportCode="HND" BookingCode="S" DepartureAirportCode="SYD" FareComponentBeginAirport="SYD" FareComponentCabinCode="Y" FareComponentDirectionality="FROM" FareComponentEndAirport="LHR" FareComponentFareRule="2291" FareComponentFareTariff="44" FareComponentFareType="XEX" FareComponentFareTypeBitmap="01" FareComponentVendorCode="ATP" GovCarrier="JL">SNN0NPCE/CH25</FareBasisCode>
              <FareBasisCode ArrivalAirportCode="LHR" AvailabilityBreak="true" BookingCode="S" DepartureAirportCode="HND" GovCarrier="JL">SNN0NPCE/CH25</FareBasisCode>
              <FareBasisCode ArrivalAirportCode="HND" BookingCode="S" DepartureAirportCode="LHR" FareComponentBeginAirport="LHR" FareComponentCabinCode="Y" FareComponentDirectionality="TO" FareComponentEndAirport="SYD" FareComponentFareRule="2291" FareComponentFareTariff="44" FareComponentFareType="XEX" FareComponentFareTypeBitmap="01" FareComponentVendorCode="ATP" GovCarrier="JL">SNN0NPCE/CH25</FareBasisCode>
              <FareBasisCode ArrivalAirportCode="SYD" AvailabilityBreak="true" BookingCode="S" DepartureAirportCode="HND" GovCarrier="JL">SNN0NPCE/CH25</FareBasisCode>
            </FareBasisCodes>
            <PassengerFare>
              <BaseFare Amount="564.00" CurrencyCode="AUD"/>
              <FareConstruction Amount="424.64" CurrencyCode="NUC" DecimalPlaces="2"/>
              <EquivFare Amount="25380" CurrencyCode="RUB" DecimalPlaces="0"/>
              <Taxes>
                <Tax Amount="9945" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                <Tax Amount="9945" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                <Tax Amount="231" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQI"/>
                <Tax Amount="231" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQI"/>
                <Tax Amount="231" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQI"/>
                <Tax Amount="231" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQI"/>
                <Tax Amount="1450" CountryCode="AU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="WY"/>
                <Tax Amount="1450" CountryCode="AU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="WY2"/>
                <Tax Amount="4457" CountryCode="GB" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="UB"/>
                <Tax Amount="362" CountryCode="JP" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="SW"/>
                <Tax Amount="362" CountryCode="JP" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="SW"/>
                <TaxSummary Amount="20814" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                <TaxSummary Amount="2900" CountryCode="AU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="WY"/>
                <TaxSummary Amount="724" CountryCode="JP" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="SW"/>
                <TaxSummary Amount="4457" CountryCode="GB" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="UB"/>
                <TotalTax Amount="28895" CurrencyCode="RUB" DecimalPlaces="0"/>
              </Taxes>
              <TotalFare Amount="54275" CurrencyCode="RUB"/>
              <PenaltiesInfo>
                <Penalty Amount="0" Applicability="Before" Changeable="true" ConditionsApply="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                <Penalty Amount="0" Applicability="After" Changeable="true" ConditionsApply="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                <Penalty Amount="27000" Applicability="Before" Cat16Info="true" CurrencyCode="RUB" DecimalPlaces="0" Refundable="true" Type="Refund"/>
                <Penalty Applicability="After" Cat16Info="true" Refundable="false" Type="Refund"/>
              </PenaltiesInfo>
              <TPA_Extensions>
                <Messages>
                  <Message AirlineCode="JL" FailCode="0" Info="RFND RESTR APPLY" Type="N"/>
                  <Message FailCode="0" Info="EACH CNN REQUIRES ACCOMPANYING SAME CABIN ADT" Type="W"/>
                  <Message FailCode="0" Info="VALIDATING CARRIER" Type="W"/>
                  <Message FailCode="0" Info="BSP - JL" Type="W"/>
                </Messages>
                <BaggageInformationList>
                  <BaggageInformation AirlineCode="JL" ProvisionType="A">
                    <Segment Id="0"/>
                    <Segment Id="1"/>
                    <Allowance Description1="UP TO 50 POUNDS/23 KILOGRAMS" Description2="UP TO 80 LINEAR INCHES/203 LINEAR CENTIMETERS" Pieces="2"/>
                  </BaggageInformation>
                  <BaggageInformation AirlineCode="JL" ProvisionType="A">
                    <Segment Id="2"/>
                    <Segment Id="3"/>
                    <Allowance Description1="UP TO 50 POUNDS/23 KILOGRAMS" Description2="UP TO 80 LINEAR INCHES/203 LINEAR CENTIMETERS" Pieces="2"/>
                  </BaggageInformation>
                  <BaggageInformation AirlineCode="JL" ProvisionType="B">
                    <Segment Id="0"/>
                    <Allowance Description1="UP TO 22 POUNDS/10 KILOGRAMS" Description2="UP TO 45 LINEAR INCHES/115 LINEAR CENTIMETERS" Pieces="1"/>
                  </BaggageInformation>
                  <BaggageInformation AirlineCode="JL" ProvisionType="B">
                    <Segment Id="1"/>
                    <Allowance Description1="UP TO 22 POUNDS/10 KILOGRAMS" Description2="UP TO 45 LINEAR INCHES/115 LINEAR CENTIMETERS" Pieces="1"/>
                  </BaggageInformation>
                  <BaggageInformation AirlineCode="BA" ProvisionType="B">
                    <Segment Id="2"/>
                    <Allowance Description1="UP TO 34 LINEAR INCHES/85 LINEAR CENTIMETERS" Pieces="1"/>
                  </BaggageInformation>
                  <BaggageInformation AirlineCode="JL" ProvisionType="B">
                    <Segment Id="3"/>
                    <Allowance Description1="UP TO 22 POUNDS/10 KILOGRAMS" Description2="UP TO 45 LINEAR INCHES/115 LINEAR CENTIMETERS" Pieces="1"/>
                  </BaggageInformation>
                </BaggageInformationList>
                <SeatSelectionList>
                  <SeatSelection Type="N">
                    <Segment ID="0"/>
                    <Segment ID="1"/>
                    <Segment ID="2"/>
                    <Segment ID="3"/>
                  </SeatSelection>
                </SeatSelectionList>
              </TPA_Extensions>
            </PassengerFare>
            <Endorsements NonRefundableIndicator="true"/>
            <TPA_Extensions>
              <FareCalcLine Info="SYD JL X/TYO JL LON212.32JL X/TYO JL SYD212.32NUC424.64END ROE1.328146"/>
            </TPA_Extensions>
            <FareInfos>
              <FareInfo>
                <FareReference>S</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="M"/>
                </TPA_Extensions>
              </FareInfo>
              <FareInfo>
                <FareReference>S</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="M"/>
                </TPA_Extensions>
              </FareInfo>
              <FareInfo>
                <FareReference>S</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                </TPA_Extensions>
              </FareInfo>
              <FareInfo>
                <FareReference>S</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="M"/>
                </TPA_Extensions>
              </FareInfo>
            </FareInfos>
          </PTC_FareBreakdown>
          <PTC_FareBreakdown>
            <PassengerTypeQuantity Code="INF" Quantity="1"/>
            <FareBasisCodes>
              <FareBasisCode ArrivalAirportCode="HND" BookingCode="S" DepartureAirportCode="SYD" FareComponentBeginAirport="SYD" FareComponentCabinCode="Y" FareComponentDirectionality="FROM" FareComponentEndAirport="LHR" FareComponentFareRule="2291" FareComponentFareTariff="44" FareComponentFareType="XEX" FareComponentFareTypeBitmap="01" FareComponentVendorCode="ATP" GovCarrier="JL">SNN0NPCE/IN90</FareBasisCode>
              <FareBasisCode ArrivalAirportCode="LHR" AvailabilityBreak="true" BookingCode="S" DepartureAirportCode="HND" GovCarrier="JL">SNN0NPCE/IN90</FareBasisCode>
              <FareBasisCode ArrivalAirportCode="HND" BookingCode="S" DepartureAirportCode="LHR" FareComponentBeginAirport="LHR" FareComponentCabinCode="Y" FareComponentDirectionality="TO" FareComponentEndAirport="SYD" FareComponentFareRule="2291" FareComponentFareTariff="44" FareComponentFareType="XEX" FareComponentFareTypeBitmap="01" FareComponentVendorCode="ATP" GovCarrier="JL">SNN0NPCE/IN90</FareBasisCode>
              <FareBasisCode ArrivalAirportCode="SYD" AvailabilityBreak="true" BookingCode="S" DepartureAirportCode="HND" GovCarrier="JL">SNN0NPCE/IN90</FareBasisCode>
            </FareBasisCodes>
            <PassengerFare>
              <BaseFare Amount="76.00" CurrencyCode="AUD"/>
              <FareConstruction Amount="56.62" CurrencyCode="NUC" DecimalPlaces="2"/>
              <EquivFare Amount="3420" CurrencyCode="RUB" DecimalPlaces="0"/>
              <Taxes>
                <Tax Amount="231" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQI"/>
                <Tax Amount="231" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQI"/>
                <Tax Amount="231" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQI"/>
                <Tax Amount="231" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQI"/>
                <Tax Amount="4457" CountryCode="GB" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="UB"/>
                <TaxSummary Amount="924" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQI"/>
                <TaxSummary Amount="4457" CountryCode="GB" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="UB"/>
                <TotalTax Amount="5381" CurrencyCode="RUB" DecimalPlaces="0"/>
              </Taxes>
              <TotalFare Amount="8801" CurrencyCode="RUB"/>
              <PenaltiesInfo>
                <Penalty Amount="0" Applicability="Before" Changeable="true" ConditionsApply="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                <Penalty Amount="0" Applicability="After" Changeable="true" ConditionsApply="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                <Penalty Amount="27000" Applicability="Before" Cat16Info="true" CurrencyCode="RUB" DecimalPlaces="0" Refundable="true" Type="Refund"/>
                <Penalty Applicability="After" Cat16Info="true" Refundable="false" Type="Refund"/>
              </PenaltiesInfo>
              <TPA_Extensions>
                <Messages>
                  <Message AirlineCode="JL" FailCode="0" Info="RFND RESTR APPLY" Type="N"/>
                  <Message FailCode="0" Info="EACH INF REQUIRES ACCOMPANYING ADT PASSENGER" Type="W"/>
                  <Message FailCode="0" Info="VALIDATING CARRIER" Type="W"/>
                  <Message FailCode="0" Info="BSP - JL" Type="W"/>
                </Messages>
                <BaggageInformationList>
                  <BaggageInformation AirlineCode="JL" ProvisionType="A">
                    <Segment Id="0"/>
                    <Segment Id="1"/>
                    <Allowance Description1="UP TO 50 POUNDS/23 KILOGRAMS" Description2="UP TO 80 LINEAR INCHES/203 LINEAR CENTIMETERS" Pieces="1"/>
                  </BaggageInformation>
                  <BaggageInformation AirlineCode="JL" ProvisionType="A">
                    <Segment Id="2"/>
                    <Segment Id="3"/>
                    <Allowance Description1="UP TO 50 POUNDS/23 KILOGRAMS" Description2="UP TO 80 LINEAR INCHES/203 LINEAR CENTIMETERS" Pieces="1"/>
                  </BaggageInformation>
                  <BaggageInformation AirlineCode="JL" ProvisionType="B">
                    <Segment Id="0"/>
                    <Allowance Description1="UP TO 22 POUNDS/10 KILOGRAMS" Description2="UP TO 45 LINEAR INCHES/115 LINEAR CENTIMETERS" Pieces="1"/>
                  </BaggageInformation>
                  <BaggageInformation AirlineCode="JL" ProvisionType="B">
                    <Segment Id="1"/>
                    <Allowance Description1="UP TO 22 POUNDS/10 KILOGRAMS" Description2="UP TO 45 LINEAR INCHES/115 LINEAR CENTIMETERS" Pieces="1"/>
                  </BaggageInformation>
                  <BaggageInformation AirlineCode="BA" ProvisionType="B">
                    <Segment Id="2"/>
                    <Allowance Description1="UP TO 50 POUNDS/23 KILOGRAMS" Description2="UP TO 50 POUNDS/127 LINEAR CENTIMETERS" Pieces="1"/>
                  </BaggageInformation>
                  <BaggageInformation AirlineCode="JL" ProvisionType="B">
                    <Segment Id="3"/>
                    <Allowance Description1="UP TO 22 POUNDS/10 KILOGRAMS" Description2="UP TO 45 LINEAR INCHES/115 LINEAR CENTIMETERS" Pieces="1"/>
                  </BaggageInformation>
                </BaggageInformationList>
                <SeatSelectionList>
                  <SeatSelection Type="N">
                    <Segment ID="0"/>
                    <Segment ID="1"/>
                    <Segment ID="2"/>
                    <Segment ID="3"/>
                  </SeatSelection>
                </SeatSelectionList>
              </TPA_Extensions>
            </PassengerFare>
            <Endorsements NonRefundableIndicator="true"/>
            <TPA_Extensions>
              <FareCalcLine Info="SYD JL X/TYO JL LON28.31JL X/TYO JL SYD28.31NUC56.62END ROE1.328146"/>
            </TPA_Extensions>
            <FareInfos>
              <FareInfo>
                <FareReference>S</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="M"/>
                </TPA_Extensions>
              </FareInfo>
              <FareInfo>
                <FareReference>S</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="M"/>
                </TPA_Extensions>
              </FareInfo>
              <FareInfo>
                <FareReference>S</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                </TPA_Extensions>
              </FareInfo>
              <FareInfo>
                <FareReference>S</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="M"/>
                </TPA_Extensions>
              </FareInfo>
            </FareInfos>
          </PTC_FareBreakdown>
        </PTC_FareBreakdowns>
        <FareInfos>
          <FareInfo>
            <FareReference>S</FareReference>
            <TPA_Extensions>
              <SeatsRemaining BelowMin="false" Number="9"/>
              <Cabin Cabin="Y"/>
              <Meal Code="M"/>
            </TPA_Extensions>
          </FareInfo>
          <FareInfo>
            <FareReference>S</FareReference>
            <TPA_Extensions>
              <SeatsRemaining BelowMin="false" Number="9"/>
              <Cabin Cabin="Y"/>
              <Meal Code="M"/>
            </TPA_Extensions>
          </FareInfo>
          <FareInfo>
            <FareReference>S</FareReference>
            <TPA_Extensions>
              <SeatsRemaining BelowMin="false" Number="9"/>
              <Cabin Cabin="Y"/>
            </TPA_Extensions>
          </FareInfo>
          <FareInfo>
            <FareReference>S</FareReference>
            <TPA_Extensions>
              <SeatsRemaining BelowMin="false" Number="9"/>
              <Cabin Cabin="Y"/>
              <Meal Code="M"/>
            </TPA_Extensions>
          </FareInfo>
        </FareInfos>
        <TPA_Extensions>
          <DivideInParty Indicator="false"/>
          <AncillaryFeeGroups Message="AIR EXTRAS NOT APPLICABLE OR ARE UNKNOWN FOR THIS ITINERARY"/>
          <ValidatingCarrier NewVcxProcess="true" SettlementMethod="BSP">
            <Default Code="JL"/>
          </ValidatingCarrier>
        </TPA_Extensions>
      </AirItineraryPricingInfo>
      <TicketingInfo TicketType="eTicket" ValidInterline="Yes"/>
      <TPA_Extensions>
        <ValidatingCarrier Code="JL"/>
        <DiversitySwapper WeighedPriceAmount="533239"/>
      </TPA_Extensions>
    </PricedItinerary>
    <!--Другие рекомендации-->
  </PricedItineraries>
</OTA_AirLowFareSearchRS>
```
{{< /details >}}

---

{{< details title="Пример запроса (получение расчетов стоимости по всем доступным брендам, GIR ответ)" >}}
```XML
<OTA_AirLowFareSearchRQ ResponseType="GIR" Version="6.5.0" xmlns="http://www.opentravel.org/OTA/2003/05">
  <POS>
    <Source PseudoCityCode="9LSC">
      <RequestorID ID="1" Type="1">
        <CompanyName Code="TN"/>
      </RequestorID>
    </Source>
  </POS>
  <OriginDestinationInformation RPH="1">
    <DepartureDateTime>2022-12-01T11:00:00</DepartureDateTime>
    <OriginLocation LocationCode="SYD"/>
    <DestinationLocation LocationCode="LON"/>
  </OriginDestinationInformation>
  <OriginDestinationInformation RPH="2">
    <DepartureDateTime>2022-12-08T11:00:00</DepartureDateTime>
    <OriginLocation LocationCode="LON"/>
    <DestinationLocation LocationCode="SYD"/>
  </OriginDestinationInformation>
  <TravelPreferences ValidInterlineTicket="true">
    <CabinPref Cabin="Economy" PreferLevel="Preferred"/>
    <TPA_Extensions>
      <LongConnectTime Enable="true"/>
      <LongConnectPoints Max="3" Min="1"/>
      <KeepSameCabin Enabled="true"/>
      <ExcludeCallDirectCarriers Enabled="true"/>
      <SeatSelection Info="true"/>
      <DiversityParameters AdditionalNonStopsPercentage="100"/>
    </TPA_Extensions>
    <AncillaryFees Enable="true">
      <AncillaryFeeGroup Code="BG"/>
    </AncillaryFees>
    <Baggage CarryOnInfo="true" Description="true" RequestType="A"/>
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
```
{{< /details >}}

{{< details title="Пример ответа" >}}
```XML
<GroupedItineraryResponse Version="6.5.0" xmlns="http://webservices.sabre.com/wsdl/sabreXML1.0.00/shopping/GroupedItineraryResponse" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <Message Code="GCC15-ISELL-TN-00-2022-05-00-6K02" Severity="Info" Text="27040" Type="SERVER"/>
  <Message Code="TRANSACTIONID" Severity="Info" Text="6963313267657017147" Type="WORKERTHREAD"/>
  <Message Code="RULEID" Severity="Info" Text="15936" Type="DRE"/>
  <Message Code="RULEID" Severity="Info" Text="27757" Type="DEFAULT"/>
  <Message Code="PROCESS" NumberOfOccurences="2" Severity="Error" Text="Communication error: Transmission timeout" Type="MIP"/>
  <Statistics Itineraries="69"/>
  <ScheduleDesc ETicketable="true" ElapsedTime="700" Frequency="SMTWTFS" ID="1" Stops="0" TotalMilesFlown="5974">
    <Departure Airport="LHR" City="LON" Country="GB" Terminal="5" Time="13:45:00Z"/>
    <Arrival Airport="HND" City="TYO" Country="JP" DateAdjustment="1" Terminal="3" Time="10:25:00+09:00"/>
    <Carrier Disclosure="BA" Marketing="JL" MarketingFlightNumber="7120" Operating="BA" OperatingFlightNumber="5">
      <Equipment Code="789" TypeForFirstLeg="W" TypeForLastLeg="W"/>
    </Carrier>
  </ScheduleDesc>
  <ScheduleDesc ETicketable="true" ElapsedTime="905" Frequency="SMTWTF*" ID="2" Stops="0" TotalMilesFlown="7417">
    <Departure Airport="SFO" City="SFO" Country="US" State="CA" Terminal="I" Time="23:00:00-08:00"/>
    <Arrival Airport="SYD" City="SYD" Country="AU" DateAdjustment="2" State="NS" Terminal="1" Time="09:05:00+11:00"/>
    <Carrier Marketing="UA" MarketingFlightNumber="863" Operating="UA" OperatingFlightNumber="863">
      <Equipment Code="789" TypeForFirstLeg="W" TypeForLastLeg="W"/>
    </Carrier>
  </ScheduleDesc>
  <ScheduleDesc ETicketable="true" ElapsedTime="630" Frequency="SMTWTF*" ID="3" Stops="0" TotalMilesFlown="5456">
    <Departure Airport="LAX" City="LAX" Country="US" State="CA" Terminal="7" Time="17:30:00-08:00"/>
    <Arrival Airport="LHR" City="LON" Country="GB" DateAdjustment="1" Terminal="2" Time="12:00:00Z"/>
    <Carrier Marketing="UA" MarketingFlightNumber="923" Operating="UA" OperatingFlightNumber="923">
      <Equipment Code="789" TypeForFirstLeg="W" TypeForLastLeg="W"/>
    </Carrier>
  </ScheduleDesc>
  <ScheduleDesc ETicketable="true" ElapsedTime="770" Frequency="SMTWTFS" ID="4" Stops="0" TotalMilesFlown="5974">
    <Departure Airport="HND" City="TYO" Country="JP" Terminal="3" Time="13:15:00+09:00"/>
    <Arrival Airport="LHR" City="LON" Country="GB" Terminal="5" Time="17:05:00Z"/>
    <Carrier Disclosure="BA" Marketing="JL" MarketingFlightNumber="7121" Operating="BA" OperatingFlightNumber="6">
      <Equipment Code="789" TypeForFirstLeg="W" TypeForLastLeg="W"/>
    </Carrier>
  </ScheduleDesc>
  <ScheduleDesc ETicketable="true" ElapsedTime="795" Frequency="S*TW*F*" ID="5" Stops="0" TotalMilesFlown="5958">
    <Departure Airport="BKK" City="BKK" Country="TH" Time="13:20:00+07:00"/>
    <Arrival Airport="LHR" City="LON" Country="GB" Terminal="2" Time="19:35:00Z"/>
    <Carrier Marketing="TG" MarketingFlightNumber="916" Operating="TG" OperatingFlightNumber="916">
      <Equipment Code="789" TypeForFirstLeg="W" TypeForLastLeg="W"/>
    </Carrier>
  </ScheduleDesc>
  <!--Другие рейсы-->
  <TaxDesc Amount="4770" Code="YQF" Currency="RUB" Description="SERVICE FEE - CARRIER-IMPOSED FUEL" ID="1" PublishedAmount="106.00" PublishedCurrency="AUD" Station="SYD"/>
  <TaxDesc Amount="58" Code="YQI" Currency="RUB" Description="SERVICE FEE - CARRIER-IMPOSED MISC" ID="2" PublishedAmount="0.90" PublishedCurrency="USD" Station="ICN"/>
  <TaxDesc Amount="10356" Code="YRF" Currency="RUB" Description="SERVICE FEE - CARRIER-IMPOSED FUEL" ID="3" PublishedAmount="161.80" PublishedCurrency="USD" Station="SYD"/>
  <TaxDesc Amount="291" Code="G1" Country="MY" Currency="RUB" Description="DEPARTURE LEVY" ID="4" PublishedAmount="20.00" PublishedCurrency="MYR" Station="KUL"/>
  <TaxDesc Amount="254" Code="XA" Country="US" Currency="RUB" Description="APHIS PASSENGER FEE PASSENGERS" ID="5" PublishedAmount="3.96" PublishedCurrency="USD" Station="LHR"/>
  <!--Другие таксы-->
  <TaxSummaryDesc Amount="898" Code="I5" Country="HK" Currency="RUB" Description="AIRPORT PASSENGER SECURITY CHARGE" ID="1" PublishedAmount="55" PublishedCurrency="HKD" Station="HKG"/>
  <TaxSummaryDesc Amount="20814" Code="YQF" Currency="RUB" Description="SERVICE FEE - CARRIER-IMPOSED FUEL" ID="2" PublishedAmount="221.00" PublishedCurrency="AUD" Station="SYD"/>
  <TaxSummaryDesc Amount="291" Code="G1" Country="MY" Currency="RUB" Description="DEPARTURE LEVY" ID="3" PublishedAmount="20.00" PublishedCurrency="MYR" Station="KUL"/>
  <TaxSummaryDesc Amount="13735" Code="YRF" Currency="RUB" Description="SERVICE FEE - CARRIER-IMPOSED FUEL" ID="4" PublishedAmount="1.00" PublishedCurrency="EUR" Station="CDG"/>
  <TaxSummaryDesc Amount="802" Code="QX" Country="FR" Currency="RUB" Description="PASSENGER SERVICE CHARGE INTERNATIONAL" ID="5" PublishedAmount="11.97" PublishedCurrency="EUR" Station="CDG"/>
  <!--Другие таксы-->
  <OBFeeDesc Amount="0" Currency="RUB" ID="1"/>
  <BrandFeatureDesc Application="F" CommercialName="75 PERCENT MILES EARNED" ID="1" ServiceGroup="BF" ServiceType="Z" SubCode="06C" Vendor="ATP"/>
  <BrandFeatureDesc Application="F" CommercialName="GOLF EQUIPMENT UP TO 15 KG" ID="2" ServiceGroup="BG" ServiceType="C" SubCode="0D4" Vendor="ATP"/>
  <BrandFeatureDesc Application="C" CommercialName="SECOND EXCESS BAG" ID="3" ServiceGroup="BG" ServiceType="C" SubCode="0CD" Vendor="ATP"/>
  <BrandFeatureDesc Application="C" CommercialName="AUH BUSINESS CLASS LOUNGE" ID="4" ServiceGroup="LG" ServiceType="F" SubCode="0AG" Vendor="ATP"/>
  <BrandFeatureDesc Application="C" CommercialName="PRIORITY BOARDING" ID="5" ServiceGroup="TS" ServiceType="F" SubCode="0G6" Vendor="ATP"/>
  <!--Другие услуги-->
  <FareComponentDesc ApplicablePricingCategories="2 3 4 5 7 8 9 10 12 15 16 18 23" CabinCode="Y" Direction="EH" Directionality="FROM" FareAmount="778.15" FareBasisCode="QLWC2AU" FareCurrency="AUD" FarePassengerType="ADT" FareRule="AUGD" FareTariff="4" FareType="XEX" FareTypeBitmap="00" GoverningCarrier="EY" ID="1" NotValidAfter="2022-12-01" NotValidBefore="2022-12-01" PublishedFareAmount="2067.00" VendorCode="ATP">
    <Segment/>
    <Segment Stopover="true">
      <Surcharge Amount="25.00" Currency="NUC" Description="MISCELLANEOUS/OTHER" Type="Q"/>
    </Segment>
    <Brand BrandName="ECONOMY CHOICE" Code="YC" ProgramCode="CFFEY" ProgramDescription="17AUD BP30" ProgramID="125938" ProgramSystemCode="M"/>
  </FareComponentDesc>
  <FareComponentDesc ApplicablePricingCategories="4 5 7 8 9 10 15 16 18 19" CabinCode="Y" Direction="TS" Directionality="TO" FareAmount="28.31" FareBasisCode="SNN0NPCE/IN90" FareCurrency="AUD" FarePassengerType="INF" FareRule="2291" FareTariff="44" FareType="XEX" FareTypeBitmap="01" GoverningCarrier="JL" ID="2" NotValidAfter="2023-12-01" PublishedFareAmount="76.00" TicketDesignator="IN90" VendorCode="ATP">
    <Segment/>
    <Segment/>
  </FareComponentDesc>
  <FareComponentDesc ApplicablePricingCategories="1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 18" CabinCode="Y" Direction="EH" Directionality="TO" FareAmount="697.58" FareBasisCode="MR31AUIR" FareCurrency="AUD" FarePassengerType="ADT" FareRule="0071" FareTariff="4" FareType="XEX" FareTypeBitmap="00" GoverningCarrier="CX" ID="3" NotValidAfter="2022-12-08" NotValidBefore="2022-12-08" PublishedFareAmount="1853.00" VendorCode="ATP">
    <Segment/>
    <Segment/>
    <Brand BrandName="ECONOMY ESSENTIAL" Code="ECONESSENT" ProgramCode="CFFCX" ProgramDescription="CX WORLDWIDE" ProgramID="138827" ProgramSystemCode="Q"/>
  </FareComponentDesc>
  <FareComponentDesc ApplicablePricingCategories="2 3 4 5 6 7 8 9 10 11 12 15 16 18" CabinCode="Y" Direction="AP" Directionality="FROM" FareAmount="636.22" FareBasisCode="TJX00NDT" FareCurrency="AUD" FarePassengerType="ADT" FareRule="2RUE" FareTariff="307" FareType="XPX" FareTypeBitmap="00" GoverningCarrier="UA" ID="4" NotValidAfter="2023-12-01" PublishedFareAmount="1690.00" VendorCode="ATP">
    <Segment/>
    <Segment Stopover="true"/>
    <Brand BrandName="ECONOMY" Code="ECONOMY" ProgramCode="A1S" ProgramDescription="ATLANTIC SPAC" ProgramID="139065" ProgramSystemCode="G"/>
  </FareComponentDesc>
  <FareComponentDesc ApplicablePricingCategories="4 5 6 7 8 10 12 16 19" CabinCode="Y" Direction="EH" Directionality="FROM" FareAmount="72.01" FareBasisCode="LS50ABSM/IN90" FareCurrency="AUD" FarePassengerType="INF" FareRule="E2SM" FareTariff="4" FareType="XEX" FareTypeBitmap="01" GoverningCarrier="AF" ID="5" NotValidAfter="2022-12-01" NotValidBefore="2022-12-01" PublishedFareAmount="192.00" TicketDesignator="IN90" VendorCode="ATP">
    <Segment>
      <Surcharge Amount="9.41" Currency="NUC" Description="MISCELLANEOUS/OTHER" Type="Q"/>
    </Segment>
    <Segment/>
    <Segment Stopover="true"/>
    <Brand BrandName="ECONOMY STANDARD" Code="STANDARD" ProgramCode="CFFAF" ProgramDescription="ICA TO ICA 0 BAG" ProgramID="138270" ProgramSystemCode="X"/>
  </FareComponentDesc>
  <!--Другие компоненты тарифов-->
  <ValidatingCarrierDesc ID="1" NewVcxProcess="true" SettlementMethod="BSP">
    <Default Code="HR"/>
  </ValidatingCarrierDesc>
  <ValidatingCarrierDesc ID="2" NewVcxProcess="true" SettlementMethod="BSP">
    <Default Code="UA"/>
  </ValidatingCarrierDesc>
  <ValidatingCarrierDesc ID="3" NewVcxProcess="true" SettlementMethod="BSP">
    <Default Code="AF"/>
  </ValidatingCarrierDesc>
  <ValidatingCarrierDesc ID="4" NewVcxProcess="true" SettlementMethod="BSP">
    <Default Code="MH"/>
  </ValidatingCarrierDesc>
  <ValidatingCarrierDesc ID="5" NewVcxProcess="true" SettlementMethod="BSP">
    <Default Code="UL"/>
  </ValidatingCarrierDesc>
  <!--Другие валидирующие перевозчики-->
  <BaggageAllowanceDesc Description1="UP TO 50 POUNDS/23 KILOGRAMS" Description2="UP TO 45 LINEAR INCHES/115 LINEAR CENTIMETERS" ID="1" Pieces="1"/>
  <BaggageAllowanceDesc Description1="UP TO 50 POUNDS/23 KILOGRAMS" Description2="UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS" ID="2" Pieces="1"/>
  <BaggageAllowanceDesc Description1="UP TO 34 LINEAR INCHES/85 LINEAR CENTIMETERS" ID="3" Pieces="1"/>
  <BaggageAllowanceDesc Description1="UP TO 22 POUNDS/10 KILOGRAMS" Description2="UP TO 45 LINEAR INCHES/115 LINEAR CENTIMETERS" ID="4" Pieces="1"/>
  <BaggageAllowanceDesc ID="5" Pieces="1" Unit="kg" Weight="7"/>
  <!--Другие нормы провоза багажа-->
  <LegDesc ElapsedTime="2170" ID="1">
    <Schedule Ref="25"/>
    <Schedule DepartureDateAdjustment="1" Ref="6"/>
  </LegDesc>
  <LegDesc ElapsedTime="2035" ID="2">
    <Schedule Ref="67"/>
    <Schedule Ref="69"/>
  </LegDesc>
  <LegDesc ElapsedTime="2675" ID="3">
    <Schedule Ref="21"/>
    <Schedule DepartureDateAdjustment="1" Ref="5"/>
  </LegDesc>
  <LegDesc ElapsedTime="2795" ID="4">
    <Schedule Ref="27"/>
    <Schedule DepartureDateAdjustment="2" Ref="19"/>
  </LegDesc>
  <LegDesc ElapsedTime="1355" ID="5">
    <Schedule Ref="56"/>
    <Schedule DepartureDateAdjustment="1" Ref="88"/>
  </LegDesc>
  <!--Другие плечи-->
  <ItineraryGroup>
    <GroupDescription>
      <LegDescription ArrivalLocation="LHR" DepartureDate="2022-12-01" DepartureLocation="SYD"/>
      <LegDescription ArrivalLocation="SYD" DepartureDate="2022-12-08" DepartureLocation="LHR"/>
    </GroupDescription>
    <Itinerary ID="1" PricingSource="ADVJR1">
      <Leg Ref="14"/>
      <Leg Ref="10"/>
      <PricingInformation PricingSubsource="MIP">
        <Fare ETicketable="true" GoverningCarriers="JL JL" LastTicketDate="2022-05-27" LastTicketTime="23:59" VITA="true" ValidatingCarrierCode="JL">
          <PassengerInfo NonRefundable="true" PassengerNumber="2" PassengerType="ADT">
            <FareComponent Ref="61">
              <Segment BookingCode="S" CabinCode="Y" MealCode="M" SeatsAvailable="9"/>
              <Segment AvailabilityBreak="true" BookingCode="S" CabinCode="Y" MealCode="M" SeatsAvailable="9"/>
            </FareComponent>
            <FareComponent Ref="131">
              <Segment BookingCode="S" CabinCode="Y" SeatsAvailable="9"/>
              <Segment AvailabilityBreak="true" BookingCode="S" CabinCode="Y" MealCode="M" SeatsAvailable="9"/>
            </FareComponent>
            <Tax Ref="44"/>
            <Tax Ref="46"/>
            <Tax Ref="24"/>
            <Tax Ref="64"/>
            <Tax Ref="88"/>
            <Tax Ref="64"/>
            <Tax Ref="56"/>
            <Tax Ref="68"/>
            <Tax Ref="70"/>
            <Tax Ref="26"/>
            <Tax Ref="36"/>
            <Tax Ref="79"/>
            <Tax Ref="79"/>
            <TaxSummary Ref="2"/>
            <TaxSummary Ref="36"/>
            <TaxSummary Ref="29"/>
            <TaxSummary Ref="40"/>
            <TaxSummary Ref="14"/>
            <TaxSummary Ref="22"/>
            <CurrencyConversion ExchangeRateUsed="45" From="AUD" To="RUB"/>
            <FareMessage Carrier="JL" Code="0" Info="RFND RESTR APPLY" Type="N"/>
            <FareMessage Code="0" Info="VALIDATING CARRIER" Type="W"/>
            <FareMessage Code="0" Info="BSP - JL" Type="W"/>
            <PassengerTotalFare BaseFareAmount="752.00" BaseFareCurrency="AUD" CommissionAmount="0" CommissionPercentage="0" ConstructionAmount="566.20" ConstructionCurrency="NUC" Currency="RUB" EquivalentAmount="33840" EquivalentCurrency="RUB" ExchangeRateOne="1.32814600" TotalFare="72845" TotalTaxes="39005"/>
            <BaggageInformation AirlineCode="JL" ProvisionType="A">
              <Segment ID="0"/>
              <Segment ID="1"/>
              <Allowance Ref="36"/>
            </BaggageInformation>
            <BaggageInformation AirlineCode="JL" ProvisionType="A">
              <Segment ID="2"/>
              <Segment ID="3"/>
              <Allowance Ref="36"/>
            </BaggageInformation>
            <BaggageInformation AirlineCode="JL" ProvisionType="B">
              <Segment ID="0"/>
              <Allowance Ref="46"/>
            </BaggageInformation>
            <BaggageInformation AirlineCode="JL" ProvisionType="B">
              <Segment ID="1"/>
              <Allowance Ref="46"/>
            </BaggageInformation>
            <BaggageInformation AirlineCode="BA" ProvisionType="B">
              <Segment ID="2"/>
              <Allowance Ref="3"/>
            </BaggageInformation>
            <BaggageInformation AirlineCode="JL" ProvisionType="B">
              <Segment ID="3"/>
              <Allowance Ref="46"/>
            </BaggageInformation>
            <PenaltiesInfo>
              <Penalty Amount="0" Applicability="Before" Changeable="true" ConditionsApply="true" Currency="RUB" Type="Exchange"/>
              <Penalty Amount="0" Applicability="After" Changeable="true" ConditionsApply="true" Currency="RUB" Type="Exchange"/>
              <Penalty Amount="27000" Applicability="Before" Cat16Info="true" Currency="RUB" Refundable="true" Type="Refund"/>
              <Penalty Applicability="After" Cat16Info="true" Refundable="false" Type="Refund"/>
            </PenaltiesInfo>
            <SeatSelection Type="N">
              <Segment ID="0"/>
              <Segment ID="1"/>
              <Segment ID="2"/>
              <Segment ID="3"/>
            </SeatSelection>
          </PassengerInfo>
          <PassengerInfo NonRefundable="true" PassengerNumber="1" PassengerType="CNN">
            <FareComponent Ref="56">
              <Segment BookingCode="S" CabinCode="Y" MealCode="M" SeatsAvailable="9"/>
              <Segment AvailabilityBreak="true" BookingCode="S" CabinCode="Y" MealCode="M" SeatsAvailable="9"/>
            </FareComponent>
            <FareComponent Ref="41">
              <Segment BookingCode="S" CabinCode="Y" SeatsAvailable="9"/>
              <Segment AvailabilityBreak="true" BookingCode="S" CabinCode="Y" MealCode="M" SeatsAvailable="9"/>
            </FareComponent>
            <Tax Ref="44"/>
            <Tax Ref="46"/>
            <Tax Ref="24"/>
            <Tax Ref="64"/>
            <Tax Ref="88"/>
            <Tax Ref="64"/>
            <Tax Ref="68"/>
            <Tax Ref="70"/>
            <Tax Ref="36"/>
            <Tax Ref="65"/>
            <Tax Ref="65"/>
            <TaxSummary Ref="2"/>
            <TaxSummary Ref="29"/>
            <TaxSummary Ref="39"/>
            <TaxSummary Ref="22"/>
            <CurrencyConversion ExchangeRateUsed="45" From="AUD" To="RUB"/>
            <FareMessage Carrier="JL" Code="0" Info="RFND RESTR APPLY" Type="N"/>
            <FareMessage Code="0" Info="EACH CNN REQUIRES ACCOMPANYING SAME CABIN ADT" Type="W"/>
            <FareMessage Code="0" Info="VALIDATING CARRIER" Type="W"/>
            <FareMessage Code="0" Info="BSP - JL" Type="W"/>
            <PassengerTotalFare BaseFareAmount="564.00" BaseFareCurrency="AUD" CommissionAmount="0" CommissionPercentage="0" ConstructionAmount="424.64" ConstructionCurrency="NUC" Currency="RUB" EquivalentAmount="25380" EquivalentCurrency="RUB" ExchangeRateOne="1.32814600" TotalFare="54275" TotalTaxes="28895"/>
            <BaggageInformation AirlineCode="JL" ProvisionType="A">
              <Segment ID="0"/>
              <Segment ID="1"/>
              <Allowance Ref="36"/>
            </BaggageInformation>
            <BaggageInformation AirlineCode="JL" ProvisionType="A">
              <Segment ID="2"/>
              <Segment ID="3"/>
              <Allowance Ref="36"/>
            </BaggageInformation>
            <BaggageInformation AirlineCode="JL" ProvisionType="B">
              <Segment ID="0"/>
              <Allowance Ref="46"/>
            </BaggageInformation>
            <BaggageInformation AirlineCode="JL" ProvisionType="B">
              <Segment ID="1"/>
              <Allowance Ref="46"/>
            </BaggageInformation>
            <BaggageInformation AirlineCode="BA" ProvisionType="B">
              <Segment ID="2"/>
              <Allowance Ref="3"/>
            </BaggageInformation>
            <BaggageInformation AirlineCode="JL" ProvisionType="B">
              <Segment ID="3"/>
              <Allowance Ref="46"/>
            </BaggageInformation>
            <PenaltiesInfo>
              <Penalty Amount="0" Applicability="Before" Changeable="true" ConditionsApply="true" Currency="RUB" Type="Exchange"/>
              <Penalty Amount="0" Applicability="After" Changeable="true" ConditionsApply="true" Currency="RUB" Type="Exchange"/>
              <Penalty Amount="27000" Applicability="Before" Cat16Info="true" Currency="RUB" Refundable="true" Type="Refund"/>
              <Penalty Applicability="After" Cat16Info="true" Refundable="false" Type="Refund"/>
            </PenaltiesInfo>
            <SeatSelection Type="N">
              <Segment ID="0"/>
              <Segment ID="1"/>
              <Segment ID="2"/>
              <Segment ID="3"/>
            </SeatSelection>
          </PassengerInfo>
          <PassengerInfo NonRefundable="true" PassengerNumber="1" PassengerType="INF">
            <FareComponent Ref="79">
              <Segment BookingCode="S" CabinCode="Y" MealCode="M" SeatsAvailable="9"/>
              <Segment AvailabilityBreak="true" BookingCode="S" CabinCode="Y" MealCode="M" SeatsAvailable="9"/>
            </FareComponent>
            <FareComponent Ref="2">
              <Segment BookingCode="S" CabinCode="Y" SeatsAvailable="9"/>
              <Segment AvailabilityBreak="true" BookingCode="S" CabinCode="Y" MealCode="M" SeatsAvailable="9"/>
            </FareComponent>
            <Tax Ref="24"/>
            <Tax Ref="64"/>
            <Tax Ref="88"/>
            <Tax Ref="64"/>
            <Tax Ref="36"/>
            <TaxSummary Ref="19"/>
            <TaxSummary Ref="22"/>
            <CurrencyConversion ExchangeRateUsed="45" From="AUD" To="RUB"/>
            <FareMessage Carrier="JL" Code="0" Info="RFND RESTR APPLY" Type="N"/>
            <FareMessage Code="0" Info="EACH INF REQUIRES ACCOMPANYING ADT PASSENGER" Type="W"/>
            <FareMessage Code="0" Info="VALIDATING CARRIER" Type="W"/>
            <FareMessage Code="0" Info="BSP - JL" Type="W"/>
            <PassengerTotalFare BaseFareAmount="76.00" BaseFareCurrency="AUD" CommissionAmount="0" CommissionPercentage="0" ConstructionAmount="56.62" ConstructionCurrency="NUC" Currency="RUB" EquivalentAmount="3420" EquivalentCurrency="RUB" ExchangeRateOne="1.32814600" TotalFare="8801" TotalTaxes="5381"/>
            <BaggageInformation AirlineCode="JL" ProvisionType="A">
              <Segment ID="0"/>
              <Segment ID="1"/>
              <Allowance Ref="32"/>
            </BaggageInformation>
            <BaggageInformation AirlineCode="JL" ProvisionType="A">
              <Segment ID="2"/>
              <Segment ID="3"/>
              <Allowance Ref="32"/>
            </BaggageInformation>
            <BaggageInformation AirlineCode="JL" ProvisionType="B">
              <Segment ID="0"/>
              <Allowance Ref="46"/>
            </BaggageInformation>
            <BaggageInformation AirlineCode="JL" ProvisionType="B">
              <Segment ID="1"/>
              <Allowance Ref="46"/>
            </BaggageInformation>
            <BaggageInformation AirlineCode="BA" ProvisionType="B">
              <Segment ID="2"/>
              <Allowance Ref="40"/>
            </BaggageInformation>
            <BaggageInformation AirlineCode="JL" ProvisionType="B">
              <Segment ID="3"/>
              <Allowance Ref="46"/>
            </BaggageInformation>
            <PenaltiesInfo>
              <Penalty Amount="0" Applicability="Before" Changeable="true" ConditionsApply="true" Currency="RUB" Type="Exchange"/>
              <Penalty Amount="0" Applicability="After" Changeable="true" ConditionsApply="true" Currency="RUB" Type="Exchange"/>
              <Penalty Amount="27000" Applicability="Before" Cat16Info="true" Currency="RUB" Refundable="true" Type="Refund"/>
              <Penalty Applicability="After" Cat16Info="true" Refundable="false" Type="Refund"/>
            </PenaltiesInfo>
            <SeatSelection Type="N">
              <Segment ID="0"/>
              <Segment ID="1"/>
              <Segment ID="2"/>
              <Segment ID="3"/>
            </SeatSelection>
          </PassengerInfo>
          <AncillaryFeeGroup Message="AIR EXTRAS NOT APPLICABLE OR ARE UNKNOWN FOR THIS ITINERARY"/>
          <TotalFare BaseFareAmount="2144.00" BaseFareCurrency="AUD" ConstructionAmount="1613.66" ConstructionCurrency="NUC" Currency="RUB" EquivalentAmount="96480" EquivalentCurrency="RUB" TotalPrice="208766" TotalTaxes="112286"/>
          <ValidatingCarrier Ref="11"/>
        </Fare>
      </PricingInformation>
      <DiversitySwapper WeighedPrice="533238.527"/>
    </Itinerary>
    <!--Другие рекомендации-->
  </ItineraryGroup>
</GroupedItineraryResponse>
```
{{< /details >}}

---

{{< details title="Пример запроса (получение дополнительных расчетов стоимости по заданным критериям, OTA ответ)" >}}
```XML
<OTA_AirLowFareSearchRQ ResponseType="OTA" Version="6.5.0" xmlns="http://www.opentravel.org/OTA/2003/05">
  <POS>
    <Source PseudoCityCode="9LSC">
      <RequestorID ID="1" Type="1">
        <CompanyName Code="TN"/>
      </RequestorID>
    </Source>
  </POS>
  <OriginDestinationInformation RPH="1">
    <DepartureDateTime>2022-12-01T11:00:00</DepartureDateTime>
    <OriginLocation LocationCode="SYD"/>
    <DestinationLocation LocationCode="LON"/>
  </OriginDestinationInformation>
  <OriginDestinationInformation RPH="2">
    <DepartureDateTime>2022-12-08T11:00:00</DepartureDateTime>
    <OriginLocation LocationCode="LON"/>
    <DestinationLocation LocationCode="SYD"/>
  </OriginDestinationInformation>
  <TravelPreferences ValidInterlineTicket="true">
    <CabinPref Cabin="Economy" PreferLevel="Preferred"/>
    <TPA_Extensions>
      <LongConnectTime Enable="true"/>
      <LongConnectPoints Max="3" Min="1"/>
      <KeepSameCabin Enabled="true"/>
      <ExcludeCallDirectCarriers Enabled="true"/>
      <SeatSelection Info="true"/>
      <FlexibleFares>
        <FareParameters>
          <KeepSameCabin Enabled="true"/>
          <VoluntaryChanges Match="Info"/>
          <BrandedFareIndicators SingleBrandedFare="true"/>
          <Baggage FreePieceRequired="true"/>
        </FareParameters>
        <FareParameters>
          <KeepSameCabin Enabled="true"/>
          <VoluntaryChanges Match="All">
            <Penalty Type="Exchange"/>
            <Penalty Type="Refund"/>
          </VoluntaryChanges>
          <BrandedFareIndicators SingleBrandedFare="true"/>
        </FareParameters>
        <FareParameters>
          <KeepSameCabin Enabled="true"/>
          <VoluntaryChanges Match="All">
            <Penalty Amount="1000" CurrencyCode="RUB" Type="Exchange"/>
            <Penalty Amount="1000" CurrencyCode="RUB" Type="Refund"/>
          </VoluntaryChanges>
          <BrandedFareIndicators SingleBrandedFare="true"/>
        </FareParameters>
        <FareParameters>
          <Cabin Type="Business"/>
          <KeepSameCabin Enabled="true"/>
          <VoluntaryChanges Match="Info"/>
          <BrandedFareIndicators SingleBrandedFare="true"/>
        </FareParameters>
        <FareParameters>
          <PrivateFare Ind="true"/>
          <KeepSameCabin Enabled="true"/>
          <VoluntaryChanges Match="Info"/>
          <BrandedFareIndicators SingleBrandedFare="true"/>
        </FareParameters>
      </FlexibleFares>
      <DiversityParameters AdditionalNonStopsPercentage="100"/>
    </TPA_Extensions>
    <AncillaryFees Enable="true">
      <AncillaryFeeGroup Code="BG"/>
    </AncillaryFees>
    <Baggage CarryOnInfo="true" Description="true" RequestType="A"/>
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
```
{{< /details >}}

{{< details title="Пример ответа" >}}
```XML
<OTA_AirLowFareSearchRS AvailableItinCount="0" BrandedOneWayItinCount="0" DepartedItinCount="0" PricedItinCount="200" SimpleOneWayItinCount="0" SoldOutItinCount="0" Version="6.5.0" xmlns="http://www.opentravel.org/OTA/2003/05" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <Success/>
  <Warnings>
    <Warning Code="PROCESS" NumberOfOccurences="22" ShortText="NO COMBINABLE FARES FOR CLASS USED" Type="MIP"/>
    <Warning Code="PROCESS" NumberOfOccurences="2" ShortText="MAXIMUM PENALTY IS TOO RESTRICTIVE: NO FARES WITH CHANGE PENALTY LESS THAN 1000 RUB" Type="MIP"/>
    <Warning Code="PROCESS" NumberOfOccurences="2" ShortText="NO PRIVATE FARES VALID FOR PASSENGER TYPE/CLASS OF SERVICE" Type="MIP"/>
    <Warning Code="PROCESS" ShortText="NO SOLUTION PASSED INTERLINE TICKETING VALIDATION" Type="MIP"/>
    <Warning Code="PROCESS" ShortText="MAXIMUM PENALTY IS TOO RESTRICTIVE: NO FARES WITH REFUND PENALTY LESS THAN 1000 RUB" Type="MIP"/>
    <Warning Code="MIP" MessageClass="I" ShortText="NO COMBINABLE FARES FOR CLASS USED" Type="MIP"/>
    <Warning Code="GCC15-ISELL-TN-00-2022-05-00-DNQZ" MessageClass="I" ShortText="27033" Type="SERVER"/>
    <Warning Code="RULEID" MessageClass="I" ShortText="27757" Type="DEFAULT"/>
    <Warning Code="RULEID" MessageClass="I" ShortText="15936" Type="DRE"/>
    <Warning Code="TRANSACTIONID" MessageClass="I" ShortText="8850649105640106391" Type="WORKERTHREAD"/>
  </Warnings>
  <BrandFeatures>
    <BrandFeature Application="F" CommercialName="SEAT SELECTION STANDARD ZONE" Id="1" ServiceGroup="BF" ServiceType="Z" SubCode="050" Vendor="ATP"/>
    <BrandFeature Application="F" CommercialName="CHOICE OF STANDARD SEAT" Id="2" ServiceGroup="BF" ServiceType="Z" SubCode="050" Vendor="ATP"/>
    <BrandFeature Application="F" CommercialName="STANDARD SEATING" Id="3" ServiceGroup="BF" ServiceType="Z" SubCode="050" Vendor="ATP"/>
    <BrandFeature Application="C" CommercialName="STANDARD SEAT SELECTION" Id="4" ServiceGroup="BF" ServiceType="Z" SubCode="050" Vendor="ATP"/>
    <BrandFeature Application="F" CommercialName="STANDARD SEAT SELECTION" Id="5" ServiceGroup="BF" ServiceType="Z" SubCode="050" Vendor="ATP"/>
    <!--Другие услуги-->
  </BrandFeatures>
  <PricedItineraries>
    <PricedItinerary SequenceNumber="1">
      <AirItinerary DirectionInd="Return">
        <OriginDestinationOptions>
          <OriginDestinationOption ArrivalCountry="GB" DepartureCountry="AU" ElapsedTime="2460">
            <FlightSegment ArrivalDateTime="2022-12-01T17:15:00" DepartureDateTime="2022-12-01T09:15:00" ElapsedTime="600" FlightNumber="52" ResBookDesigCode="V" StopQuantity="0">
              <DepartureAirport LocationCode="SYD" TerminalID="1"/>
              <ArrivalAirport LocationCode="HND" TerminalID="3"/>
              <OperatingAirline Code="JL" FlightNumber="52"/>
              <Equipment AirEquipType="789"/>
              <MarketingAirline Code="JL"/>
              <MarriageGrp>O</MarriageGrp>
              <DepartureTimeZone GMTOffset="11"/>
              <ArrivalTimeZone GMTOffset="9"/>
              <TPA_Extensions>
                <eTicket Ind="true"/>
                <Mileage Amount="4836"/>
              </TPA_Extensions>
            </FlightSegment>
            <FlightSegment ArrivalDateTime="2022-12-02T15:15:00" DepartureDateTime="2022-12-02T11:30:00" ElapsedTime="765" FlightNumber="43" ResBookDesigCode="V" StopQuantity="0">
              <DepartureAirport LocationCode="HND" TerminalID="3"/>
              <ArrivalAirport LocationCode="LHR" TerminalID="3"/>
              <OperatingAirline Code="JL" FlightNumber="43"/>
              <Equipment AirEquipType="773"/>
              <MarketingAirline Code="JL"/>
              <MarriageGrp>I</MarriageGrp>
              <DepartureTimeZone GMTOffset="9"/>
              <ArrivalTimeZone GMTOffset="0"/>
              <TPA_Extensions>
                <eTicket Ind="true"/>
                <Mileage Amount="5974"/>
              </TPA_Extensions>
            </FlightSegment>
          </OriginDestinationOption>
          <OriginDestinationOption ArrivalCountry="AU" DepartureCountry="GB" ElapsedTime="1785">
            <FlightSegment ArrivalDateTime="2022-12-09T10:25:00" DepartureDateTime="2022-12-08T13:45:00" ElapsedTime="700" FlightNumber="7120" ResBookDesigCode="S" StopQuantity="0">
              <DepartureAirport LocationCode="LHR" TerminalID="5"/>
              <ArrivalAirport LocationCode="HND" TerminalID="3"/>
              <OperatingAirline Code="BA" FlightNumber="5"/>
              <Equipment AirEquipType="789"/>
              <MarketingAirline Code="JL"/>
              <DisclosureAirline Code="BA"/>
              <MarriageGrp>O</MarriageGrp>
              <DepartureTimeZone GMTOffset="0"/>
              <ArrivalTimeZone GMTOffset="9"/>
              <TPA_Extensions>
                <eTicket Ind="true"/>
                <Mileage Amount="5974"/>
              </TPA_Extensions>
            </FlightSegment>
            <FlightSegment ArrivalDateTime="2022-12-10T06:30:00" DepartureDateTime="2022-12-09T18:40:00" ElapsedTime="590" FlightNumber="51" ResBookDesigCode="S" StopQuantity="0">
              <DepartureAirport LocationCode="HND" TerminalID="3"/>
              <ArrivalAirport LocationCode="SYD" TerminalID="1"/>
              <OperatingAirline Code="JL" FlightNumber="51"/>
              <Equipment AirEquipType="789"/>
              <MarketingAirline Code="JL"/>
              <MarriageGrp>I</MarriageGrp>
              <DepartureTimeZone GMTOffset="9"/>
              <ArrivalTimeZone GMTOffset="11"/>
              <TPA_Extensions>
                <eTicket Ind="true"/>
                <Mileage Amount="4836"/>
              </TPA_Extensions>
            </FlightSegment>
          </OriginDestinationOption>
        </OriginDestinationOptions>
      </AirItinerary>
      <AirItineraryPricingInfo FareReturned="true" LastTicketDate="2022-06-01" LastTicketTime="23:59" PricingSource="ADVJR1" PricingSubSource="MIP">
        <ItinTotalFare>
          <BaseFare Amount="2517.00" CurrencyCode="AUD" DecimalPlaces="2"/>
          <FareConstruction Amount="1893.67" CurrencyCode="NUC" DecimalPlaces="2"/>
          <EquivFare Amount="104460" CurrencyCode="RUB" DecimalPlaces="0"/>
          <Taxes>
            <Tax Amount="103432" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="TOTALTAX"/>
          </Taxes>
          <TotalFare Amount="207892" CurrencyCode="RUB" DecimalPlaces="0"/>
        </ItinTotalFare>
        <PTC_FareBreakdowns>
          <PTC_FareBreakdown>
            <PassengerTypeQuantity Code="ADT" Quantity="2"/>
            <FareBasisCodes>
              <FareBasisCode ArrivalAirportCode="HND" BookingCode="V" DepartureAirportCode="SYD" FareComponentBeginAirport="SYD" FareComponentCabinCode="Y" FareComponentDirectionality="FROM" FareComponentEndAirport="LHR" FareComponentFareRule="2291" FareComponentFareTariff="44" FareComponentFareType="XEX" FareComponentFareTypeBitmap="00" FareComponentVendorCode="ATP" GovCarrier="JL">VNN0NPCE</FareBasisCode>
              <FareBasisCode ArrivalAirportCode="LHR" AvailabilityBreak="true" BookingCode="V" DepartureAirportCode="HND" GovCarrier="JL">VNN0NPCE</FareBasisCode>
              <FareBasisCode ArrivalAirportCode="HND" BookingCode="S" DepartureAirportCode="LHR" FareComponentBeginAirport="LHR" FareComponentCabinCode="Y" FareComponentDirectionality="TO" FareComponentEndAirport="SYD" FareComponentFareRule="2291" FareComponentFareTariff="44" FareComponentFareType="XEX" FareComponentFareTypeBitmap="00" FareComponentVendorCode="ATP" GovCarrier="JL">SNN0NPCE</FareBasisCode>
              <FareBasisCode ArrivalAirportCode="SYD" AvailabilityBreak="true" BookingCode="S" DepartureAirportCode="HND" GovCarrier="JL">SNN0NPCE</FareBasisCode>
            </FareBasisCodes>
            <PassengerFare>
              <BaseFare Amount="883.00" CurrencyCode="AUD"/>
              <FareConstruction Amount="664.45" CurrencyCode="NUC" DecimalPlaces="2"/>
              <EquivFare Amount="36645" CurrencyCode="RUB" DecimalPlaces="0"/>
              <Taxes>
                <Tax Amount="9172" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                <Tax Amount="9172" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                <Tax Amount="211" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQI"/>
                <Tax Amount="211" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQI"/>
                <Tax Amount="211" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQI"/>
                <Tax Amount="211" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQI"/>
                <Tax Amount="2490" CountryCode="AU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="AU"/>
                <Tax Amount="1338" CountryCode="AU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="WY"/>
                <Tax Amount="1338" CountryCode="AU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="WY2"/>
                <Tax Amount="6132" CountryCode="GB" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="GB"/>
                <Tax Amount="4093" CountryCode="GB" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="UB"/>
                <Tax Amount="677" CountryCode="JP" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="SW"/>
                <Tax Amount="677" CountryCode="JP" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="SW"/>
                <TaxSummary Amount="19188" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                <TaxSummary Amount="2490" CountryCode="AU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="AU"/>
                <TaxSummary Amount="2676" CountryCode="AU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="WY"/>
                <TaxSummary Amount="1354" CountryCode="JP" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="SW"/>
                <TaxSummary Amount="6132" CountryCode="GB" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="GB"/>
                <TaxSummary Amount="4093" CountryCode="GB" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="UB"/>
                <TotalTax Amount="35933" CurrencyCode="RUB" DecimalPlaces="0"/>
              </Taxes>
              <TotalFare Amount="72578" CurrencyCode="RUB"/>
              <PenaltiesInfo>
                <Penalty Amount="0" Applicability="Before" Changeable="true" ConditionsApply="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                <Penalty Amount="0" Applicability="After" Changeable="true" ConditionsApply="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                <Penalty Amount="24900" Applicability="Before" Cat16Info="true" CurrencyCode="RUB" DecimalPlaces="0" Refundable="true" Type="Refund"/>
                <Penalty Applicability="After" Cat16Info="true" Refundable="false" Type="Refund"/>
              </PenaltiesInfo>
              <TPA_Extensions>
                <BaggageInformationList>
                  <BaggageInformation AirlineCode="JL" ProvisionType="A">
                    <Segment Id="0"/>
                    <Segment Id="1"/>
                    <Allowance Description1="UP TO 50 POUNDS/23 KILOGRAMS" Description2="UP TO 80 LINEAR INCHES/203 LINEAR CENTIMETERS" Pieces="2"/>
                  </BaggageInformation>
                  <BaggageInformation AirlineCode="JL" ProvisionType="A">
                    <Segment Id="2"/>
                    <Segment Id="3"/>
                    <Allowance Description1="UP TO 50 POUNDS/23 KILOGRAMS" Description2="UP TO 80 LINEAR INCHES/203 LINEAR CENTIMETERS" Pieces="2"/>
                  </BaggageInformation>
                  <BaggageInformation AirlineCode="JL" ProvisionType="B">
                    <Segment Id="0"/>
                    <Allowance Description1="UP TO 22 POUNDS/10 KILOGRAMS" Description2="UP TO 45 LINEAR INCHES/115 LINEAR CENTIMETERS" Pieces="1"/>
                  </BaggageInformation>
                  <BaggageInformation AirlineCode="JL" ProvisionType="B">
                    <Segment Id="1"/>
                    <Allowance Description1="UP TO 22 POUNDS/10 KILOGRAMS" Description2="UP TO 45 LINEAR INCHES/115 LINEAR CENTIMETERS" Pieces="1"/>
                  </BaggageInformation>
                  <BaggageInformation AirlineCode="BA" ProvisionType="B">
                    <Segment Id="2"/>
                    <Allowance Description1="UP TO 34 LINEAR INCHES/85 LINEAR CENTIMETERS" Pieces="1"/>
                  </BaggageInformation>
                  <BaggageInformation AirlineCode="JL" ProvisionType="B">
                    <Segment Id="3"/>
                    <Allowance Description1="UP TO 22 POUNDS/10 KILOGRAMS" Description2="UP TO 45 LINEAR INCHES/115 LINEAR CENTIMETERS" Pieces="1"/>
                  </BaggageInformation>
                </BaggageInformationList>
                <SeatSelectionList>
                  <SeatSelection Type="N">
                    <Segment ID="0"/>
                    <Segment ID="1"/>
                    <Segment ID="2"/>
                    <Segment ID="3"/>
                  </SeatSelection>
                </SeatSelectionList>
              </TPA_Extensions>
            </PassengerFare>
            <Endorsements NonRefundableIndicator="true"/>
            <TPA_Extensions>
              <FareCalcLine Info="SYD JL X/TYO JL LON381.35JL X/TYO JL SYD283.10NUC664.45END ROE1.328146"/>
            </TPA_Extensions>
            <FareInfos>
              <FareInfo>
                <FareReference>V</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="M"/>
                </TPA_Extensions>
              </FareInfo>
              <FareInfo>
                <FareReference>V</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="M"/>
                </TPA_Extensions>
              </FareInfo>
              <FareInfo>
                <FareReference>S</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                </TPA_Extensions>
              </FareInfo>
              <FareInfo>
                <FareReference>S</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="M"/>
                </TPA_Extensions>
              </FareInfo>
            </FareInfos>
          </PTC_FareBreakdown>
          <PTC_FareBreakdown>
            <PassengerTypeQuantity Code="CNN" Quantity="1"/>
            <FareBasisCodes>
              <FareBasisCode ArrivalAirportCode="HND" BookingCode="V" DepartureAirportCode="SYD" FareComponentBeginAirport="SYD" FareComponentCabinCode="Y" FareComponentDirectionality="FROM" FareComponentEndAirport="LHR" FareComponentFareRule="2291" FareComponentFareTariff="44" FareComponentFareType="XEX" FareComponentFareTypeBitmap="01" FareComponentVendorCode="ATP" GovCarrier="JL">VNN0NPCE/CH25</FareBasisCode>
              <FareBasisCode ArrivalAirportCode="LHR" AvailabilityBreak="true" BookingCode="V" DepartureAirportCode="HND" GovCarrier="JL">VNN0NPCE/CH25</FareBasisCode>
              <FareBasisCode ArrivalAirportCode="HND" BookingCode="S" DepartureAirportCode="LHR" FareComponentBeginAirport="LHR" FareComponentCabinCode="Y" FareComponentDirectionality="TO" FareComponentEndAirport="SYD" FareComponentFareRule="2291" FareComponentFareTariff="44" FareComponentFareType="XEX" FareComponentFareTypeBitmap="01" FareComponentVendorCode="ATP" GovCarrier="JL">SNN0NPCE/CH25</FareBasisCode>
              <FareBasisCode ArrivalAirportCode="SYD" AvailabilityBreak="true" BookingCode="S" DepartureAirportCode="HND" GovCarrier="JL">SNN0NPCE/CH25</FareBasisCode>
            </FareBasisCodes>
            <PassengerFare>
              <BaseFare Amount="662.00" CurrencyCode="AUD"/>
              <FareConstruction Amount="498.33" CurrencyCode="NUC" DecimalPlaces="2"/>
              <EquivFare Amount="27475" CurrencyCode="RUB" DecimalPlaces="0"/>
              <Taxes>
                <Tax Amount="9172" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                <Tax Amount="9172" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                <Tax Amount="211" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQI"/>
                <Tax Amount="211" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQI"/>
                <Tax Amount="211" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQI"/>
                <Tax Amount="211" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQI"/>
                <Tax Amount="1338" CountryCode="AU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="WY"/>
                <Tax Amount="1338" CountryCode="AU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="WY2"/>
                <Tax Amount="4093" CountryCode="GB" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="UB"/>
                <Tax Amount="336" CountryCode="JP" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="SW"/>
                <Tax Amount="336" CountryCode="JP" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="SW"/>
                <TaxSummary Amount="19188" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                <TaxSummary Amount="2676" CountryCode="AU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="WY"/>
                <TaxSummary Amount="672" CountryCode="JP" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="SW"/>
                <TaxSummary Amount="4093" CountryCode="GB" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="UB"/>
                <TotalTax Amount="26629" CurrencyCode="RUB" DecimalPlaces="0"/>
              </Taxes>
              <TotalFare Amount="54104" CurrencyCode="RUB"/>
              <PenaltiesInfo>
                <Penalty Amount="0" Applicability="Before" Changeable="true" ConditionsApply="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                <Penalty Amount="0" Applicability="After" Changeable="true" ConditionsApply="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                <Penalty Amount="24900" Applicability="Before" Cat16Info="true" CurrencyCode="RUB" DecimalPlaces="0" Refundable="true" Type="Refund"/>
                <Penalty Applicability="After" Cat16Info="true" Refundable="false" Type="Refund"/>
              </PenaltiesInfo>
              <TPA_Extensions>
                <BaggageInformationList>
                  <BaggageInformation AirlineCode="JL" ProvisionType="A">
                    <Segment Id="0"/>
                    <Segment Id="1"/>
                    <Allowance Description1="UP TO 50 POUNDS/23 KILOGRAMS" Description2="UP TO 80 LINEAR INCHES/203 LINEAR CENTIMETERS" Pieces="2"/>
                  </BaggageInformation>
                  <BaggageInformation AirlineCode="JL" ProvisionType="A">
                    <Segment Id="2"/>
                    <Segment Id="3"/>
                    <Allowance Description1="UP TO 50 POUNDS/23 KILOGRAMS" Description2="UP TO 80 LINEAR INCHES/203 LINEAR CENTIMETERS" Pieces="2"/>
                  </BaggageInformation>
                  <BaggageInformation AirlineCode="JL" ProvisionType="B">
                    <Segment Id="0"/>
                    <Allowance Description1="UP TO 22 POUNDS/10 KILOGRAMS" Description2="UP TO 45 LINEAR INCHES/115 LINEAR CENTIMETERS" Pieces="1"/>
                  </BaggageInformation>
                  <BaggageInformation AirlineCode="JL" ProvisionType="B">
                    <Segment Id="1"/>
                    <Allowance Description1="UP TO 22 POUNDS/10 KILOGRAMS" Description2="UP TO 45 LINEAR INCHES/115 LINEAR CENTIMETERS" Pieces="1"/>
                  </BaggageInformation>
                  <BaggageInformation AirlineCode="BA" ProvisionType="B">
                    <Segment Id="2"/>
                    <Allowance Description1="UP TO 34 LINEAR INCHES/85 LINEAR CENTIMETERS" Pieces="1"/>
                  </BaggageInformation>
                  <BaggageInformation AirlineCode="JL" ProvisionType="B">
                    <Segment Id="3"/>
                    <Allowance Description1="UP TO 22 POUNDS/10 KILOGRAMS" Description2="UP TO 45 LINEAR INCHES/115 LINEAR CENTIMETERS" Pieces="1"/>
                  </BaggageInformation>
                </BaggageInformationList>
                <SeatSelectionList>
                  <SeatSelection Type="N">
                    <Segment ID="0"/>
                    <Segment ID="1"/>
                    <Segment ID="2"/>
                    <Segment ID="3"/>
                  </SeatSelection>
                </SeatSelectionList>
              </TPA_Extensions>
            </PassengerFare>
            <Endorsements NonRefundableIndicator="true"/>
            <TPA_Extensions>
              <FareCalcLine Info="SYD JL X/TYO JL LON286.01JL X/TYO JL SYD212.32NUC498.33END ROE1.328146"/>
            </TPA_Extensions>
            <FareInfos>
              <FareInfo>
                <FareReference>V</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="M"/>
                </TPA_Extensions>
              </FareInfo>
              <FareInfo>
                <FareReference>V</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="M"/>
                </TPA_Extensions>
              </FareInfo>
              <FareInfo>
                <FareReference>S</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                </TPA_Extensions>
              </FareInfo>
              <FareInfo>
                <FareReference>S</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="M"/>
                </TPA_Extensions>
              </FareInfo>
            </FareInfos>
          </PTC_FareBreakdown>
          <PTC_FareBreakdown>
            <PassengerTypeQuantity Code="INF" Quantity="1"/>
            <FareBasisCodes>
              <FareBasisCode ArrivalAirportCode="HND" BookingCode="V" DepartureAirportCode="SYD" FareComponentBeginAirport="SYD" FareComponentCabinCode="Y" FareComponentDirectionality="FROM" FareComponentEndAirport="LHR" FareComponentFareRule="2291" FareComponentFareTariff="44" FareComponentFareType="XEX" FareComponentFareTypeBitmap="01" FareComponentVendorCode="ATP" GovCarrier="JL">VNN0NPCE/IN90</FareBasisCode>
              <FareBasisCode ArrivalAirportCode="LHR" AvailabilityBreak="true" BookingCode="V" DepartureAirportCode="HND" GovCarrier="JL">VNN0NPCE/IN90</FareBasisCode>
              <FareBasisCode ArrivalAirportCode="HND" BookingCode="S" DepartureAirportCode="LHR" FareComponentBeginAirport="LHR" FareComponentCabinCode="Y" FareComponentDirectionality="TO" FareComponentEndAirport="SYD" FareComponentFareRule="2291" FareComponentFareTariff="44" FareComponentFareType="XEX" FareComponentFareTypeBitmap="01" FareComponentVendorCode="ATP" GovCarrier="JL">SNN0NPCE/IN90</FareBasisCode>
              <FareBasisCode ArrivalAirportCode="SYD" AvailabilityBreak="true" BookingCode="S" DepartureAirportCode="HND" GovCarrier="JL">SNN0NPCE/IN90</FareBasisCode>
            </FareBasisCodes>
            <PassengerFare>
              <BaseFare Amount="89.00" CurrencyCode="AUD"/>
              <FareConstruction Amount="66.44" CurrencyCode="NUC" DecimalPlaces="2"/>
              <EquivFare Amount="3695" CurrencyCode="RUB" DecimalPlaces="0"/>
              <Taxes>
                <Tax Amount="211" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQI"/>
                <Tax Amount="211" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQI"/>
                <Tax Amount="211" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQI"/>
                <Tax Amount="211" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQI"/>
                <Tax Amount="4093" CountryCode="GB" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="UB"/>
                <TaxSummary Amount="844" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQI"/>
                <TaxSummary Amount="4093" CountryCode="GB" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="UB"/>
                <TotalTax Amount="4937" CurrencyCode="RUB" DecimalPlaces="0"/>
              </Taxes>
              <TotalFare Amount="8632" CurrencyCode="RUB"/>
              <PenaltiesInfo>
                <Penalty Amount="0" Applicability="Before" Changeable="true" ConditionsApply="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                <Penalty Amount="0" Applicability="After" Changeable="true" ConditionsApply="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                <Penalty Amount="24900" Applicability="Before" Cat16Info="true" CurrencyCode="RUB" DecimalPlaces="0" Refundable="true" Type="Refund"/>
                <Penalty Applicability="After" Cat16Info="true" Refundable="false" Type="Refund"/>
              </PenaltiesInfo>
              <TPA_Extensions>
                <BaggageInformationList>
                  <BaggageInformation AirlineCode="JL" ProvisionType="A">
                    <Segment Id="0"/>
                    <Segment Id="1"/>
                    <Allowance Description1="UP TO 50 POUNDS/23 KILOGRAMS" Description2="UP TO 80 LINEAR INCHES/203 LINEAR CENTIMETERS" Pieces="1"/>
                  </BaggageInformation>
                  <BaggageInformation AirlineCode="JL" ProvisionType="A">
                    <Segment Id="2"/>
                    <Segment Id="3"/>
                    <Allowance Description1="UP TO 50 POUNDS/23 KILOGRAMS" Description2="UP TO 80 LINEAR INCHES/203 LINEAR CENTIMETERS" Pieces="1"/>
                  </BaggageInformation>
                  <BaggageInformation AirlineCode="JL" ProvisionType="B">
                    <Segment Id="0"/>
                    <Allowance Description1="UP TO 22 POUNDS/10 KILOGRAMS" Description2="UP TO 45 LINEAR INCHES/115 LINEAR CENTIMETERS" Pieces="1"/>
                  </BaggageInformation>
                  <BaggageInformation AirlineCode="JL" ProvisionType="B">
                    <Segment Id="1"/>
                    <Allowance Description1="UP TO 22 POUNDS/10 KILOGRAMS" Description2="UP TO 45 LINEAR INCHES/115 LINEAR CENTIMETERS" Pieces="1"/>
                  </BaggageInformation>
                  <BaggageInformation AirlineCode="BA" ProvisionType="B">
                    <Segment Id="2"/>
                    <Allowance Description1="UP TO 50 POUNDS/23 KILOGRAMS" Description2="UP TO 50 POUNDS/127 LINEAR CENTIMETERS" Pieces="1"/>
                  </BaggageInformation>
                  <BaggageInformation AirlineCode="JL" ProvisionType="B">
                    <Segment Id="3"/>
                    <Allowance Description1="UP TO 22 POUNDS/10 KILOGRAMS" Description2="UP TO 45 LINEAR INCHES/115 LINEAR CENTIMETERS" Pieces="1"/>
                  </BaggageInformation>
                </BaggageInformationList>
                <SeatSelectionList>
                  <SeatSelection Type="N">
                    <Segment ID="0"/>
                    <Segment ID="1"/>
                    <Segment ID="2"/>
                    <Segment ID="3"/>
                  </SeatSelection>
                </SeatSelectionList>
              </TPA_Extensions>
            </PassengerFare>
            <Endorsements NonRefundableIndicator="true"/>
            <TPA_Extensions>
              <FareCalcLine Info="SYD JL X/TYO JL LON38.13JL X/TYO JL SYD28.31NUC66.44END ROE1.328146"/>
            </TPA_Extensions>
            <FareInfos>
              <FareInfo>
                <FareReference>V</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="M"/>
                </TPA_Extensions>
              </FareInfo>
              <FareInfo>
                <FareReference>V</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="M"/>
                </TPA_Extensions>
              </FareInfo>
              <FareInfo>
                <FareReference>S</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                </TPA_Extensions>
              </FareInfo>
              <FareInfo>
                <FareReference>S</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="M"/>
                </TPA_Extensions>
              </FareInfo>
            </FareInfos>
          </PTC_FareBreakdown>
        </PTC_FareBreakdowns>
        <FareInfos>
          <FareInfo>
            <FareReference>V</FareReference>
            <TPA_Extensions>
              <SeatsRemaining BelowMin="false" Number="9"/>
              <Cabin Cabin="Y"/>
              <Meal Code="M"/>
            </TPA_Extensions>
          </FareInfo>
          <FareInfo>
            <FareReference>V</FareReference>
            <TPA_Extensions>
              <SeatsRemaining BelowMin="false" Number="9"/>
              <Cabin Cabin="Y"/>
              <Meal Code="M"/>
            </TPA_Extensions>
          </FareInfo>
          <FareInfo>
            <FareReference>S</FareReference>
            <TPA_Extensions>
              <SeatsRemaining BelowMin="false" Number="9"/>
              <Cabin Cabin="Y"/>
            </TPA_Extensions>
          </FareInfo>
          <FareInfo>
            <FareReference>S</FareReference>
            <TPA_Extensions>
              <SeatsRemaining BelowMin="false" Number="9"/>
              <Cabin Cabin="Y"/>
              <Meal Code="M"/>
            </TPA_Extensions>
          </FareInfo>
        </FareInfos>
        <TPA_Extensions>
          <DivideInParty Indicator="false"/>
          <AncillaryFeeGroups Message="AIR EXTRAS NOT APPLICABLE OR ARE UNKNOWN FOR THIS ITINERARY"/>
          <ValidatingCarrier NewVcxProcess="true" SettlementMethod="BSP">
            <Default Code="JL"/>
          </ValidatingCarrier>
        </TPA_Extensions>
      </AirItineraryPricingInfo>
      <TicketingInfo TicketType="eTicket" ValidInterline="Yes"/>
      <TPA_Extensions>
        <AdditionalFares>
          <AirItineraryPricingInfo FareReturned="true" FlexibleFareID="1" LastTicketDate="2022-06-01" LastTicketTime="23:59" PricingSource="ADVJR1" PricingSubSource="MIP">
            <ItinTotalFare>
              <BaseFare Amount="2517.00" CurrencyCode="AUD" DecimalPlaces="2"/>
              <FareConstruction Amount="1893.67" CurrencyCode="NUC" DecimalPlaces="2"/>
              <EquivFare Amount="104460" CurrencyCode="RUB" DecimalPlaces="0"/>
              <Taxes>
                <Tax Amount="103432" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="TOTALTAX"/>
              </Taxes>
              <TotalFare Amount="207892" CurrencyCode="RUB" DecimalPlaces="0"/>
            </ItinTotalFare>
            <PTC_FareBreakdowns>
              <PTC_FareBreakdown>
                <PassengerTypeQuantity Code="ADT" Quantity="2"/>
                <FareBasisCodes>
                  <FareBasisCode ArrivalAirportCode="HND" BookingCode="V" DepartureAirportCode="SYD" FareComponentBeginAirport="SYD" FareComponentCabinCode="Y" FareComponentDirectionality="FROM" FareComponentEndAirport="LHR" FareComponentFareRule="2291" FareComponentFareTariff="44" FareComponentFareType="XEX" FareComponentFareTypeBitmap="00" FareComponentVendorCode="ATP" GovCarrier="JL">VNN0NPCE</FareBasisCode>
                  <FareBasisCode ArrivalAirportCode="LHR" AvailabilityBreak="true" BookingCode="V" DepartureAirportCode="HND" GovCarrier="JL">VNN0NPCE</FareBasisCode>
                  <FareBasisCode ArrivalAirportCode="HND" BookingCode="S" DepartureAirportCode="LHR" FareComponentBeginAirport="LHR" FareComponentCabinCode="Y" FareComponentDirectionality="TO" FareComponentEndAirport="SYD" FareComponentFareRule="2291" FareComponentFareTariff="44" FareComponentFareType="XEX" FareComponentFareTypeBitmap="00" FareComponentVendorCode="ATP" GovCarrier="JL">SNN0NPCE</FareBasisCode>
                  <FareBasisCode ArrivalAirportCode="SYD" AvailabilityBreak="true" BookingCode="S" DepartureAirportCode="HND" GovCarrier="JL">SNN0NPCE</FareBasisCode>
                </FareBasisCodes>
                <PassengerFare>
                  <BaseFare Amount="883.00" CurrencyCode="AUD"/>
                  <FareConstruction Amount="664.45" CurrencyCode="NUC" DecimalPlaces="2"/>
                  <EquivFare Amount="36645" CurrencyCode="RUB" DecimalPlaces="0"/>
                  <Taxes>
                    <Tax Amount="9172" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                    <Tax Amount="9172" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                    <Tax Amount="211" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQI"/>
                    <Tax Amount="211" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQI"/>
                    <Tax Amount="211" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQI"/>
                    <Tax Amount="211" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQI"/>
                    <Tax Amount="2490" CountryCode="AU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="AU"/>
                    <Tax Amount="1338" CountryCode="AU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="WY"/>
                    <Tax Amount="1338" CountryCode="AU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="WY2"/>
                    <Tax Amount="6132" CountryCode="GB" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="GB"/>
                    <Tax Amount="4093" CountryCode="GB" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="UB"/>
                    <Tax Amount="677" CountryCode="JP" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="SW"/>
                    <Tax Amount="677" CountryCode="JP" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="SW"/>
                    <TaxSummary Amount="19188" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                    <TaxSummary Amount="2490" CountryCode="AU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="AU"/>
                    <TaxSummary Amount="2676" CountryCode="AU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="WY"/>
                    <TaxSummary Amount="1354" CountryCode="JP" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="SW"/>
                    <TaxSummary Amount="6132" CountryCode="GB" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="GB"/>
                    <TaxSummary Amount="4093" CountryCode="GB" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="UB"/>
                    <TotalTax Amount="35933" CurrencyCode="RUB" DecimalPlaces="0"/>
                  </Taxes>
                  <TotalFare Amount="72578" CurrencyCode="RUB"/>
                  <PenaltiesInfo>
                    <Penalty Amount="0" Applicability="Before" Changeable="true" ConditionsApply="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                    <Penalty Amount="0" Applicability="After" Changeable="true" ConditionsApply="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                    <Penalty Amount="24900" Applicability="Before" Cat16Info="true" CurrencyCode="RUB" DecimalPlaces="0" Refundable="true" Type="Refund"/>
                    <Penalty Applicability="After" Cat16Info="true" Refundable="false" Type="Refund"/>
                  </PenaltiesInfo>
                  <TPA_Extensions>
                    <BaggageInformationList>
                      <BaggageInformation AirlineCode="JL" ProvisionType="A">
                        <Segment Id="0"/>
                        <Segment Id="1"/>
                        <Allowance Description1="UP TO 50 POUNDS/23 KILOGRAMS" Description2="UP TO 80 LINEAR INCHES/203 LINEAR CENTIMETERS" Pieces="2"/>
                      </BaggageInformation>
                      <BaggageInformation AirlineCode="JL" ProvisionType="A">
                        <Segment Id="2"/>
                        <Segment Id="3"/>
                        <Allowance Description1="UP TO 50 POUNDS/23 KILOGRAMS" Description2="UP TO 80 LINEAR INCHES/203 LINEAR CENTIMETERS" Pieces="2"/>
                      </BaggageInformation>
                      <BaggageInformation AirlineCode="JL" ProvisionType="B">
                        <Segment Id="0"/>
                        <Allowance Description1="UP TO 22 POUNDS/10 KILOGRAMS" Description2="UP TO 45 LINEAR INCHES/115 LINEAR CENTIMETERS" Pieces="1"/>
                      </BaggageInformation>
                      <BaggageInformation AirlineCode="JL" ProvisionType="B">
                        <Segment Id="1"/>
                        <Allowance Description1="UP TO 22 POUNDS/10 KILOGRAMS" Description2="UP TO 45 LINEAR INCHES/115 LINEAR CENTIMETERS" Pieces="1"/>
                      </BaggageInformation>
                      <BaggageInformation AirlineCode="BA" ProvisionType="B">
                        <Segment Id="2"/>
                        <Allowance Description1="UP TO 34 LINEAR INCHES/85 LINEAR CENTIMETERS" Pieces="1"/>
                      </BaggageInformation>
                      <BaggageInformation AirlineCode="JL" ProvisionType="B">
                        <Segment Id="3"/>
                        <Allowance Description1="UP TO 22 POUNDS/10 KILOGRAMS" Description2="UP TO 45 LINEAR INCHES/115 LINEAR CENTIMETERS" Pieces="1"/>
                      </BaggageInformation>
                    </BaggageInformationList>
                    <SeatSelectionList>
                      <SeatSelection Type="N">
                        <Segment ID="0"/>
                        <Segment ID="1"/>
                        <Segment ID="2"/>
                        <Segment ID="3"/>
                      </SeatSelection>
                    </SeatSelectionList>
                  </TPA_Extensions>
                </PassengerFare>
                <Endorsements NonRefundableIndicator="true"/>
                <TPA_Extensions>
                  <FareCalcLine Info="SYD JL X/TYO JL LON381.35JL X/TYO JL SYD283.10NUC664.45END ROE1.328146"/>
                </TPA_Extensions>
                <FareInfos>
                  <FareInfo>
                    <FareReference>V</FareReference>
                    <TPA_Extensions>
                      <SeatsRemaining BelowMin="false" Number="9"/>
                      <Cabin Cabin="Y"/>
                      <Meal Code="M"/>
                    </TPA_Extensions>
                  </FareInfo>
                  <FareInfo>
                    <FareReference>V</FareReference>
                    <TPA_Extensions>
                      <SeatsRemaining BelowMin="false" Number="9"/>
                      <Cabin Cabin="Y"/>
                      <Meal Code="M"/>
                    </TPA_Extensions>
                  </FareInfo>
                  <FareInfo>
                    <FareReference>S</FareReference>
                    <TPA_Extensions>
                      <SeatsRemaining BelowMin="false" Number="9"/>
                      <Cabin Cabin="Y"/>
                    </TPA_Extensions>
                  </FareInfo>
                  <FareInfo>
                    <FareReference>S</FareReference>
                    <TPA_Extensions>
                      <SeatsRemaining BelowMin="false" Number="9"/>
                      <Cabin Cabin="Y"/>
                      <Meal Code="M"/>
                    </TPA_Extensions>
                  </FareInfo>
                </FareInfos>
              </PTC_FareBreakdown>
              <PTC_FareBreakdown>
                <PassengerTypeQuantity Code="CNN" Quantity="1"/>
                <FareBasisCodes>
                  <FareBasisCode ArrivalAirportCode="HND" BookingCode="V" DepartureAirportCode="SYD" FareComponentBeginAirport="SYD" FareComponentCabinCode="Y" FareComponentDirectionality="FROM" FareComponentEndAirport="LHR" FareComponentFareRule="2291" FareComponentFareTariff="44" FareComponentFareType="XEX" FareComponentFareTypeBitmap="01" FareComponentVendorCode="ATP" GovCarrier="JL">VNN0NPCE/CH25</FareBasisCode>
                  <FareBasisCode ArrivalAirportCode="LHR" AvailabilityBreak="true" BookingCode="V" DepartureAirportCode="HND" GovCarrier="JL">VNN0NPCE/CH25</FareBasisCode>
                  <FareBasisCode ArrivalAirportCode="HND" BookingCode="S" DepartureAirportCode="LHR" FareComponentBeginAirport="LHR" FareComponentCabinCode="Y" FareComponentDirectionality="TO" FareComponentEndAirport="SYD" FareComponentFareRule="2291" FareComponentFareTariff="44" FareComponentFareType="XEX" FareComponentFareTypeBitmap="01" FareComponentVendorCode="ATP" GovCarrier="JL">SNN0NPCE/CH25</FareBasisCode>
                  <FareBasisCode ArrivalAirportCode="SYD" AvailabilityBreak="true" BookingCode="S" DepartureAirportCode="HND" GovCarrier="JL">SNN0NPCE/CH25</FareBasisCode>
                </FareBasisCodes>
                <PassengerFare>
                  <BaseFare Amount="662.00" CurrencyCode="AUD"/>
                  <FareConstruction Amount="498.33" CurrencyCode="NUC" DecimalPlaces="2"/>
                  <EquivFare Amount="27475" CurrencyCode="RUB" DecimalPlaces="0"/>
                  <Taxes>
                    <Tax Amount="9172" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                    <Tax Amount="9172" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                    <Tax Amount="211" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQI"/>
                    <Tax Amount="211" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQI"/>
                    <Tax Amount="211" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQI"/>
                    <Tax Amount="211" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQI"/>
                    <Tax Amount="1338" CountryCode="AU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="WY"/>
                    <Tax Amount="1338" CountryCode="AU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="WY2"/>
                    <Tax Amount="4093" CountryCode="GB" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="UB"/>
                    <Tax Amount="336" CountryCode="JP" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="SW"/>
                    <Tax Amount="336" CountryCode="JP" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="SW"/>
                    <TaxSummary Amount="19188" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                    <TaxSummary Amount="2676" CountryCode="AU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="WY"/>
                    <TaxSummary Amount="672" CountryCode="JP" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="SW"/>
                    <TaxSummary Amount="4093" CountryCode="GB" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="UB"/>
                    <TotalTax Amount="26629" CurrencyCode="RUB" DecimalPlaces="0"/>
                  </Taxes>
                  <TotalFare Amount="54104" CurrencyCode="RUB"/>
                  <PenaltiesInfo>
                    <Penalty Amount="0" Applicability="Before" Changeable="true" ConditionsApply="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                    <Penalty Amount="0" Applicability="After" Changeable="true" ConditionsApply="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                    <Penalty Amount="24900" Applicability="Before" Cat16Info="true" CurrencyCode="RUB" DecimalPlaces="0" Refundable="true" Type="Refund"/>
                    <Penalty Applicability="After" Cat16Info="true" Refundable="false" Type="Refund"/>
                  </PenaltiesInfo>
                  <TPA_Extensions>
                    <BaggageInformationList>
                      <BaggageInformation AirlineCode="JL" ProvisionType="A">
                        <Segment Id="0"/>
                        <Segment Id="1"/>
                        <Allowance Description1="UP TO 50 POUNDS/23 KILOGRAMS" Description2="UP TO 80 LINEAR INCHES/203 LINEAR CENTIMETERS" Pieces="2"/>
                      </BaggageInformation>
                      <BaggageInformation AirlineCode="JL" ProvisionType="A">
                        <Segment Id="2"/>
                        <Segment Id="3"/>
                        <Allowance Description1="UP TO 50 POUNDS/23 KILOGRAMS" Description2="UP TO 80 LINEAR INCHES/203 LINEAR CENTIMETERS" Pieces="2"/>
                      </BaggageInformation>
                      <BaggageInformation AirlineCode="JL" ProvisionType="B">
                        <Segment Id="0"/>
                        <Allowance Description1="UP TO 22 POUNDS/10 KILOGRAMS" Description2="UP TO 45 LINEAR INCHES/115 LINEAR CENTIMETERS" Pieces="1"/>
                      </BaggageInformation>
                      <BaggageInformation AirlineCode="JL" ProvisionType="B">
                        <Segment Id="1"/>
                        <Allowance Description1="UP TO 22 POUNDS/10 KILOGRAMS" Description2="UP TO 45 LINEAR INCHES/115 LINEAR CENTIMETERS" Pieces="1"/>
                      </BaggageInformation>
                      <BaggageInformation AirlineCode="BA" ProvisionType="B">
                        <Segment Id="2"/>
                        <Allowance Description1="UP TO 34 LINEAR INCHES/85 LINEAR CENTIMETERS" Pieces="1"/>
                      </BaggageInformation>
                      <BaggageInformation AirlineCode="JL" ProvisionType="B">
                        <Segment Id="3"/>
                        <Allowance Description1="UP TO 22 POUNDS/10 KILOGRAMS" Description2="UP TO 45 LINEAR INCHES/115 LINEAR CENTIMETERS" Pieces="1"/>
                      </BaggageInformation>
                    </BaggageInformationList>
                    <SeatSelectionList>
                      <SeatSelection Type="N">
                        <Segment ID="0"/>
                        <Segment ID="1"/>
                        <Segment ID="2"/>
                        <Segment ID="3"/>
                      </SeatSelection>
                    </SeatSelectionList>
                  </TPA_Extensions>
                </PassengerFare>
                <Endorsements NonRefundableIndicator="true"/>
                <TPA_Extensions>
                  <FareCalcLine Info="SYD JL X/TYO JL LON286.01JL X/TYO JL SYD212.32NUC498.33END ROE1.328146"/>
                </TPA_Extensions>
                <FareInfos>
                  <FareInfo>
                    <FareReference>V</FareReference>
                    <TPA_Extensions>
                      <SeatsRemaining BelowMin="false" Number="9"/>
                      <Cabin Cabin="Y"/>
                      <Meal Code="M"/>
                    </TPA_Extensions>
                  </FareInfo>
                  <FareInfo>
                    <FareReference>V</FareReference>
                    <TPA_Extensions>
                      <SeatsRemaining BelowMin="false" Number="9"/>
                      <Cabin Cabin="Y"/>
                      <Meal Code="M"/>
                    </TPA_Extensions>
                  </FareInfo>
                  <FareInfo>
                    <FareReference>S</FareReference>
                    <TPA_Extensions>
                      <SeatsRemaining BelowMin="false" Number="9"/>
                      <Cabin Cabin="Y"/>
                    </TPA_Extensions>
                  </FareInfo>
                  <FareInfo>
                    <FareReference>S</FareReference>
                    <TPA_Extensions>
                      <SeatsRemaining BelowMin="false" Number="9"/>
                      <Cabin Cabin="Y"/>
                      <Meal Code="M"/>
                    </TPA_Extensions>
                  </FareInfo>
                </FareInfos>
              </PTC_FareBreakdown>
              <PTC_FareBreakdown>
                <PassengerTypeQuantity Code="INF" Quantity="1"/>
                <FareBasisCodes>
                  <FareBasisCode ArrivalAirportCode="HND" BookingCode="V" DepartureAirportCode="SYD" FareComponentBeginAirport="SYD" FareComponentCabinCode="Y" FareComponentDirectionality="FROM" FareComponentEndAirport="LHR" FareComponentFareRule="2291" FareComponentFareTariff="44" FareComponentFareType="XEX" FareComponentFareTypeBitmap="01" FareComponentVendorCode="ATP" GovCarrier="JL">VNN0NPCE/IN90</FareBasisCode>
                  <FareBasisCode ArrivalAirportCode="LHR" AvailabilityBreak="true" BookingCode="V" DepartureAirportCode="HND" GovCarrier="JL">VNN0NPCE/IN90</FareBasisCode>
                  <FareBasisCode ArrivalAirportCode="HND" BookingCode="S" DepartureAirportCode="LHR" FareComponentBeginAirport="LHR" FareComponentCabinCode="Y" FareComponentDirectionality="TO" FareComponentEndAirport="SYD" FareComponentFareRule="2291" FareComponentFareTariff="44" FareComponentFareType="XEX" FareComponentFareTypeBitmap="01" FareComponentVendorCode="ATP" GovCarrier="JL">SNN0NPCE/IN90</FareBasisCode>
                  <FareBasisCode ArrivalAirportCode="SYD" AvailabilityBreak="true" BookingCode="S" DepartureAirportCode="HND" GovCarrier="JL">SNN0NPCE/IN90</FareBasisCode>
                </FareBasisCodes>
                <PassengerFare>
                  <BaseFare Amount="89.00" CurrencyCode="AUD"/>
                  <FareConstruction Amount="66.44" CurrencyCode="NUC" DecimalPlaces="2"/>
                  <EquivFare Amount="3695" CurrencyCode="RUB" DecimalPlaces="0"/>
                  <Taxes>
                    <Tax Amount="211" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQI"/>
                    <Tax Amount="211" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQI"/>
                    <Tax Amount="211" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQI"/>
                    <Tax Amount="211" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQI"/>
                    <Tax Amount="4093" CountryCode="GB" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="UB"/>
                    <TaxSummary Amount="844" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQI"/>
                    <TaxSummary Amount="4093" CountryCode="GB" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="UB"/>
                    <TotalTax Amount="4937" CurrencyCode="RUB" DecimalPlaces="0"/>
                  </Taxes>
                  <TotalFare Amount="8632" CurrencyCode="RUB"/>
                  <PenaltiesInfo>
                    <Penalty Amount="0" Applicability="Before" Changeable="true" ConditionsApply="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                    <Penalty Amount="0" Applicability="After" Changeable="true" ConditionsApply="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                    <Penalty Amount="24900" Applicability="Before" Cat16Info="true" CurrencyCode="RUB" DecimalPlaces="0" Refundable="true" Type="Refund"/>
                    <Penalty Applicability="After" Cat16Info="true" Refundable="false" Type="Refund"/>
                  </PenaltiesInfo>
                  <TPA_Extensions>
                    <BaggageInformationList>
                      <BaggageInformation AirlineCode="JL" ProvisionType="A">
                        <Segment Id="0"/>
                        <Segment Id="1"/>
                        <Allowance Description1="UP TO 50 POUNDS/23 KILOGRAMS" Description2="UP TO 80 LINEAR INCHES/203 LINEAR CENTIMETERS" Pieces="1"/>
                      </BaggageInformation>
                      <BaggageInformation AirlineCode="JL" ProvisionType="A">
                        <Segment Id="2"/>
                        <Segment Id="3"/>
                        <Allowance Description1="UP TO 50 POUNDS/23 KILOGRAMS" Description2="UP TO 80 LINEAR INCHES/203 LINEAR CENTIMETERS" Pieces="1"/>
                      </BaggageInformation>
                      <BaggageInformation AirlineCode="JL" ProvisionType="B">
                        <Segment Id="0"/>
                        <Allowance Description1="UP TO 22 POUNDS/10 KILOGRAMS" Description2="UP TO 45 LINEAR INCHES/115 LINEAR CENTIMETERS" Pieces="1"/>
                      </BaggageInformation>
                      <BaggageInformation AirlineCode="JL" ProvisionType="B">
                        <Segment Id="1"/>
                        <Allowance Description1="UP TO 22 POUNDS/10 KILOGRAMS" Description2="UP TO 45 LINEAR INCHES/115 LINEAR CENTIMETERS" Pieces="1"/>
                      </BaggageInformation>
                      <BaggageInformation AirlineCode="BA" ProvisionType="B">
                        <Segment Id="2"/>
                        <Allowance Description1="UP TO 50 POUNDS/23 KILOGRAMS" Description2="UP TO 50 POUNDS/127 LINEAR CENTIMETERS" Pieces="1"/>
                      </BaggageInformation>
                      <BaggageInformation AirlineCode="JL" ProvisionType="B">
                        <Segment Id="3"/>
                        <Allowance Description1="UP TO 22 POUNDS/10 KILOGRAMS" Description2="UP TO 45 LINEAR INCHES/115 LINEAR CENTIMETERS" Pieces="1"/>
                      </BaggageInformation>
                    </BaggageInformationList>
                    <SeatSelectionList>
                      <SeatSelection Type="N">
                        <Segment ID="0"/>
                        <Segment ID="1"/>
                        <Segment ID="2"/>
                        <Segment ID="3"/>
                      </SeatSelection>
                    </SeatSelectionList>
                  </TPA_Extensions>
                </PassengerFare>
                <Endorsements NonRefundableIndicator="true"/>
                <TPA_Extensions>
                  <FareCalcLine Info="SYD JL X/TYO JL LON38.13JL X/TYO JL SYD28.31NUC66.44END ROE1.328146"/>
                </TPA_Extensions>
                <FareInfos>
                  <FareInfo>
                    <FareReference>V</FareReference>
                    <TPA_Extensions>
                      <SeatsRemaining BelowMin="false" Number="9"/>
                      <Cabin Cabin="Y"/>
                      <Meal Code="M"/>
                    </TPA_Extensions>
                  </FareInfo>
                  <FareInfo>
                    <FareReference>V</FareReference>
                    <TPA_Extensions>
                      <SeatsRemaining BelowMin="false" Number="9"/>
                      <Cabin Cabin="Y"/>
                      <Meal Code="M"/>
                    </TPA_Extensions>
                  </FareInfo>
                  <FareInfo>
                    <FareReference>S</FareReference>
                    <TPA_Extensions>
                      <SeatsRemaining BelowMin="false" Number="9"/>
                      <Cabin Cabin="Y"/>
                    </TPA_Extensions>
                  </FareInfo>
                  <FareInfo>
                    <FareReference>S</FareReference>
                    <TPA_Extensions>
                      <SeatsRemaining BelowMin="false" Number="9"/>
                      <Cabin Cabin="Y"/>
                      <Meal Code="M"/>
                    </TPA_Extensions>
                  </FareInfo>
                </FareInfos>
              </PTC_FareBreakdown>
            </PTC_FareBreakdowns>
            <FareInfos>
              <FareInfo>
                <FareReference>V</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="M"/>
                </TPA_Extensions>
              </FareInfo>
              <FareInfo>
                <FareReference>V</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="M"/>
                </TPA_Extensions>
              </FareInfo>
              <FareInfo>
                <FareReference>S</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                </TPA_Extensions>
              </FareInfo>
              <FareInfo>
                <FareReference>S</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="M"/>
                </TPA_Extensions>
              </FareInfo>
            </FareInfos>
            <TPA_Extensions>
              <DivideInParty Indicator="false"/>
              <AncillaryFeeGroups Message="AIR EXTRAS NOT APPLICABLE OR ARE UNKNOWN FOR THIS ITINERARY"/>
              <ValidatingCarrier NewVcxProcess="true" SettlementMethod="BSP">
                <Default Code="JL"/>
              </ValidatingCarrier>
            </TPA_Extensions>
          </AirItineraryPricingInfo>
          <TicketingInfo TicketType="eTicket" ValidInterline="Yes"/>
        </AdditionalFares>
        <AdditionalFares>
          <AirItineraryPricingInfo FareReturned="true" FlexibleFareID="2" LastTicketDate="2022-11-17" LastTicketTime="23:59" PricingSource="ADVJR1" PricingSubSource="MIP">
            <ItinTotalFare>
              <BaseFare Amount="36119.00" CurrencyCode="AUD" DecimalPlaces="2"/>
              <FareConstruction Amount="27194.30" CurrencyCode="NUC" DecimalPlaces="2"/>
              <EquivFare Amount="1498945" CurrencyCode="RUB" DecimalPlaces="0"/>
              <Taxes>
                <Tax Amount="131683" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="TOTALTAX"/>
              </Taxes>
              <TotalFare Amount="1630628" CurrencyCode="RUB" DecimalPlaces="0"/>
            </ItinTotalFare>
            <PTC_FareBreakdowns>
              <PTC_FareBreakdown>
                <PassengerTypeQuantity Code="ADT" Quantity="2"/>
                <FareBasisCodes>
                  <FareBasisCode ArrivalAirportCode="HND" BookingCode="Y" DepartureAirportCode="SYD" FareComponentBeginAirport="SYD" FareComponentCabinCode="Y" FareComponentDirectionality="FROM" FareComponentEndAirport="LHR" FareComponentFareRule="2291" FareComponentFareTariff="44" FareComponentFareType="EU" FareComponentFareTypeBitmap="00" FareComponentVendorCode="ATP" GovCarrier="JL">YNN0NP1A</FareBasisCode>
                  <FareBasisCode ArrivalAirportCode="LHR" AvailabilityBreak="true" BookingCode="Y" DepartureAirportCode="HND" GovCarrier="JL">YNN0NP1A</FareBasisCode>
                  <FareBasisCode ArrivalAirportCode="HND" BookingCode="W" DepartureAirportCode="LHR" FareComponentBeginAirport="LHR" FareComponentCabinCode="S" FareComponentDirectionality="TO" FareComponentEndAirport="SYD" FareComponentFareRule="2291" FareComponentFareTariff="44" FareComponentFareType="WU" FareComponentFareTypeBitmap="00" FareComponentVendorCode="ATP" GovCarrier="JL">WNN0NP1A</FareBasisCode>
                  <FareBasisCode ArrivalAirportCode="SYD" AvailabilityBreak="true" BookingCode="W" DepartureAirportCode="HND" GovCarrier="JL">WNN0NP1A</FareBasisCode>
                </FareBasisCodes>
                <PassengerFare>
                  <BaseFare Amount="12673.00" CurrencyCode="AUD"/>
                  <FareConstruction Amount="9541.86" CurrencyCode="NUC" DecimalPlaces="2"/>
                  <EquivFare Amount="525930" CurrencyCode="RUB" DecimalPlaces="0"/>
                  <Taxes>
                    <Tax Amount="9172" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                    <Tax Amount="9172" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                    <Tax Amount="211" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQI"/>
                    <Tax Amount="211" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQI"/>
                    <Tax Amount="211" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQI"/>
                    <Tax Amount="211" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQI"/>
                    <Tax Amount="2490" CountryCode="AU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="AU"/>
                    <Tax Amount="1338" CountryCode="AU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="WY"/>
                    <Tax Amount="1338" CountryCode="AU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="WY2"/>
                    <Tax Amount="13505" CountryCode="GB" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="GB"/>
                    <Tax Amount="4093" CountryCode="GB" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="UB"/>
                    <Tax Amount="677" CountryCode="JP" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="SW"/>
                    <Tax Amount="677" CountryCode="JP" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="SW"/>
                    <TaxSummary Amount="19188" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                    <TaxSummary Amount="2490" CountryCode="AU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="AU"/>
                    <TaxSummary Amount="2676" CountryCode="AU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="WY"/>
                    <TaxSummary Amount="1354" CountryCode="JP" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="SW"/>
                    <TaxSummary Amount="13505" CountryCode="GB" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="GB"/>
                    <TaxSummary Amount="4093" CountryCode="GB" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="UB"/>
                    <TotalTax Amount="43306" CurrencyCode="RUB" DecimalPlaces="0"/>
                  </Taxes>
                  <TotalFare Amount="569236" CurrencyCode="RUB"/>
                  <PenaltiesInfo>
                    <Penalty Amount="0" Applicability="Before" Changeable="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                    <Penalty Amount="0" Applicability="After" Changeable="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                    <Penalty Amount="0" Applicability="Before" Cat16Info="true" CurrencyCode="RUB" DecimalPlaces="0" Refundable="true" Type="Refund"/>
                    <Penalty Amount="0" Applicability="After" Cat16Info="true" CurrencyCode="RUB" DecimalPlaces="0" Refundable="true" Type="Refund"/>
                  </PenaltiesInfo>
                  <TPA_Extensions>
                    <BaggageInformationList>
                      <BaggageInformation AirlineCode="JL" ProvisionType="A">
                        <Segment Id="0"/>
                        <Segment Id="1"/>
                        <Allowance Description1="UP TO 50 POUNDS/23 KILOGRAMS" Description2="UP TO 80 LINEAR INCHES/203 LINEAR CENTIMETERS" Pieces="2"/>
                      </BaggageInformation>
                      <BaggageInformation AirlineCode="JL" ProvisionType="A">
                        <Segment Id="2"/>
                        <Segment Id="3"/>
                        <Allowance Description1="UP TO 50 POUNDS/23 KILOGRAMS" Description2="UP TO 80 LINEAR INCHES/203 LINEAR CENTIMETERS" Pieces="2"/>
                      </BaggageInformation>
                      <BaggageInformation AirlineCode="JL" ProvisionType="B">
                        <Segment Id="0"/>
                        <Allowance Description1="UP TO 22 POUNDS/10 KILOGRAMS" Description2="UP TO 45 LINEAR INCHES/115 LINEAR CENTIMETERS" Pieces="1"/>
                      </BaggageInformation>
                      <BaggageInformation AirlineCode="JL" ProvisionType="B">
                        <Segment Id="1"/>
                        <Allowance Description1="UP TO 22 POUNDS/10 KILOGRAMS" Description2="UP TO 45 LINEAR INCHES/115 LINEAR CENTIMETERS" Pieces="1"/>
                      </BaggageInformation>
                      <BaggageInformation AirlineCode="BA" ProvisionType="B">
                        <Segment Id="2"/>
                        <Allowance Description1="UP TO 34 LINEAR INCHES/85 LINEAR CENTIMETERS" Pieces="1"/>
                      </BaggageInformation>
                      <BaggageInformation AirlineCode="JL" ProvisionType="B">
                        <Segment Id="3"/>
                        <Allowance Description1="UP TO 22 POUNDS/10 KILOGRAMS" Description2="UP TO 45 LINEAR INCHES/115 LINEAR CENTIMETERS" Pieces="1"/>
                      </BaggageInformation>
                    </BaggageInformationList>
                    <SeatSelectionList>
                      <SeatSelection Type="N">
                        <Segment ID="0"/>
                        <Segment ID="1"/>
                        <Segment ID="2"/>
                        <Segment ID="3"/>
                      </SeatSelection>
                    </SeatSelectionList>
                  </TPA_Extensions>
                </PassengerFare>
                <Endorsements NonRefundableIndicator="false"/>
                <TPA_Extensions>
                  <FareCalcLine Info="SYD JL X/TYO JL LON4770.93JL X/TYO JL SYD4770.93NUC9541.86END ROE1.328146"/>
                </TPA_Extensions>
                <FareInfos>
                  <FareInfo>
                    <FareReference>Y</FareReference>
                    <TPA_Extensions>
                      <SeatsRemaining BelowMin="false" Number="9"/>
                      <Cabin Cabin="Y"/>
                      <Meal Code="M"/>
                    </TPA_Extensions>
                  </FareInfo>
                  <FareInfo>
                    <FareReference>Y</FareReference>
                    <TPA_Extensions>
                      <SeatsRemaining BelowMin="false" Number="9"/>
                      <Cabin Cabin="Y"/>
                      <Meal Code="M"/>
                    </TPA_Extensions>
                  </FareInfo>
                  <FareInfo>
                    <FareReference>W</FareReference>
                    <TPA_Extensions>
                      <SeatsRemaining BelowMin="false" Number="9"/>
                      <Cabin Cabin="S"/>
                    </TPA_Extensions>
                  </FareInfo>
                  <FareInfo>
                    <FareReference>W</FareReference>
                    <TPA_Extensions>
                      <SeatsRemaining BelowMin="false" Number="9"/>
                      <Cabin Cabin="S"/>
                      <Meal Code="M"/>
                    </TPA_Extensions>
                  </FareInfo>
                </FareInfos>
              </PTC_FareBreakdown>
              <PTC_FareBreakdown>
                <PassengerTypeQuantity Code="CNN" Quantity="1"/>
                <FareBasisCodes>
                  <FareBasisCode ArrivalAirportCode="HND" BookingCode="Y" DepartureAirportCode="SYD" FareComponentBeginAirport="SYD" FareComponentCabinCode="Y" FareComponentDirectionality="FROM" FareComponentEndAirport="LHR" FareComponentFareRule="2291" FareComponentFareTariff="44" FareComponentFareType="EU" FareComponentFareTypeBitmap="01" FareComponentVendorCode="ATP" GovCarrier="JL">YNN0NP1A/CH25</FareBasisCode>
                  <FareBasisCode ArrivalAirportCode="LHR" AvailabilityBreak="true" BookingCode="Y" DepartureAirportCode="HND" GovCarrier="JL">YNN0NP1A/CH25</FareBasisCode>
                  <FareBasisCode ArrivalAirportCode="HND" BookingCode="W" DepartureAirportCode="LHR" FareComponentBeginAirport="LHR" FareComponentCabinCode="S" FareComponentDirectionality="TO" FareComponentEndAirport="SYD" FareComponentFareRule="2291" FareComponentFareTariff="44" FareComponentFareType="WU" FareComponentFareTypeBitmap="01" FareComponentVendorCode="ATP" GovCarrier="JL">WNN0NP1A/CH25</FareBasisCode>
                  <FareBasisCode ArrivalAirportCode="SYD" AvailabilityBreak="true" BookingCode="W" DepartureAirportCode="HND" GovCarrier="JL">WNN0NP1A/CH25</FareBasisCode>
                </FareBasisCodes>
                <PassengerFare>
                  <BaseFare Amount="9505.00" CurrencyCode="AUD"/>
                  <FareConstruction Amount="7156.40" CurrencyCode="NUC" DecimalPlaces="2"/>
                  <EquivFare Amount="394460" CurrencyCode="RUB" DecimalPlaces="0"/>
                  <Taxes>
                    <Tax Amount="9172" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                    <Tax Amount="9172" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                    <Tax Amount="211" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQI"/>
                    <Tax Amount="211" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQI"/>
                    <Tax Amount="211" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQI"/>
                    <Tax Amount="211" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQI"/>
                    <Tax Amount="1338" CountryCode="AU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="WY"/>
                    <Tax Amount="1338" CountryCode="AU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="WY2"/>
                    <Tax Amount="13505" CountryCode="GB" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="GB"/>
                    <Tax Amount="4093" CountryCode="GB" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="UB"/>
                    <Tax Amount="336" CountryCode="JP" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="SW"/>
                    <Tax Amount="336" CountryCode="JP" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="SW"/>
                    <TaxSummary Amount="19188" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                    <TaxSummary Amount="2676" CountryCode="AU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="WY"/>
                    <TaxSummary Amount="672" CountryCode="JP" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="SW"/>
                    <TaxSummary Amount="13505" CountryCode="GB" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="GB"/>
                    <TaxSummary Amount="4093" CountryCode="GB" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="UB"/>
                    <TotalTax Amount="40134" CurrencyCode="RUB" DecimalPlaces="0"/>
                  </Taxes>
                  <TotalFare Amount="434594" CurrencyCode="RUB"/>
                  <PenaltiesInfo>
                    <Penalty Amount="0" Applicability="Before" Changeable="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                    <Penalty Amount="0" Applicability="After" Changeable="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                    <Penalty Amount="0" Applicability="Before" Cat16Info="true" CurrencyCode="RUB" DecimalPlaces="0" Refundable="true" Type="Refund"/>
                    <Penalty Amount="0" Applicability="After" Cat16Info="true" CurrencyCode="RUB" DecimalPlaces="0" Refundable="true" Type="Refund"/>
                  </PenaltiesInfo>
                  <TPA_Extensions>
                    <BaggageInformationList>
                      <BaggageInformation AirlineCode="JL" ProvisionType="A">
                        <Segment Id="0"/>
                        <Segment Id="1"/>
                        <Allowance Description1="UP TO 50 POUNDS/23 KILOGRAMS" Description2="UP TO 80 LINEAR INCHES/203 LINEAR CENTIMETERS" Pieces="2"/>
                      </BaggageInformation>
                      <BaggageInformation AirlineCode="JL" ProvisionType="A">
                        <Segment Id="2"/>
                        <Segment Id="3"/>
                        <Allowance Description1="UP TO 50 POUNDS/23 KILOGRAMS" Description2="UP TO 80 LINEAR INCHES/203 LINEAR CENTIMETERS" Pieces="2"/>
                      </BaggageInformation>
                      <BaggageInformation AirlineCode="JL" ProvisionType="B">
                        <Segment Id="0"/>
                        <Allowance Description1="UP TO 22 POUNDS/10 KILOGRAMS" Description2="UP TO 45 LINEAR INCHES/115 LINEAR CENTIMETERS" Pieces="1"/>
                      </BaggageInformation>
                      <BaggageInformation AirlineCode="JL" ProvisionType="B">
                        <Segment Id="1"/>
                        <Allowance Description1="UP TO 22 POUNDS/10 KILOGRAMS" Description2="UP TO 45 LINEAR INCHES/115 LINEAR CENTIMETERS" Pieces="1"/>
                      </BaggageInformation>
                      <BaggageInformation AirlineCode="BA" ProvisionType="B">
                        <Segment Id="2"/>
                        <Allowance Description1="UP TO 34 LINEAR INCHES/85 LINEAR CENTIMETERS" Pieces="1"/>
                      </BaggageInformation>
                      <BaggageInformation AirlineCode="JL" ProvisionType="B">
                        <Segment Id="3"/>
                        <Allowance Description1="UP TO 22 POUNDS/10 KILOGRAMS" Description2="UP TO 45 LINEAR INCHES/115 LINEAR CENTIMETERS" Pieces="1"/>
                      </BaggageInformation>
                    </BaggageInformationList>
                    <SeatSelectionList>
                      <SeatSelection Type="N">
                        <Segment ID="0"/>
                        <Segment ID="1"/>
                        <Segment ID="2"/>
                        <Segment ID="3"/>
                      </SeatSelection>
                    </SeatSelectionList>
                  </TPA_Extensions>
                </PassengerFare>
                <Endorsements NonRefundableIndicator="false"/>
                <TPA_Extensions>
                  <FareCalcLine Info="SYD JL X/TYO JL LON3578.20JL X/TYO JL SYD3578.20NUC7156.40END ROE1.328146"/>
                </TPA_Extensions>
                <FareInfos>
                  <FareInfo>
                    <FareReference>Y</FareReference>
                    <TPA_Extensions>
                      <SeatsRemaining BelowMin="false" Number="9"/>
                      <Cabin Cabin="Y"/>
                      <Meal Code="M"/>
                    </TPA_Extensions>
                  </FareInfo>
                  <FareInfo>
                    <FareReference>Y</FareReference>
                    <TPA_Extensions>
                      <SeatsRemaining BelowMin="false" Number="9"/>
                      <Cabin Cabin="Y"/>
                      <Meal Code="M"/>
                    </TPA_Extensions>
                  </FareInfo>
                  <FareInfo>
                    <FareReference>W</FareReference>
                    <TPA_Extensions>
                      <SeatsRemaining BelowMin="false" Number="9"/>
                      <Cabin Cabin="S"/>
                    </TPA_Extensions>
                  </FareInfo>
                  <FareInfo>
                    <FareReference>W</FareReference>
                    <TPA_Extensions>
                      <SeatsRemaining BelowMin="false" Number="9"/>
                      <Cabin Cabin="S"/>
                      <Meal Code="M"/>
                    </TPA_Extensions>
                  </FareInfo>
                </FareInfos>
              </PTC_FareBreakdown>
              <PTC_FareBreakdown>
                <PassengerTypeQuantity Code="INF" Quantity="1"/>
                <FareBasisCodes>
                  <FareBasisCode ArrivalAirportCode="HND" BookingCode="Y" DepartureAirportCode="SYD" FareComponentBeginAirport="SYD" FareComponentCabinCode="Y" FareComponentDirectionality="FROM" FareComponentEndAirport="LHR" FareComponentFareRule="2291" FareComponentFareTariff="44" FareComponentFareType="EU" FareComponentFareTypeBitmap="01" FareComponentVendorCode="ATP" GovCarrier="JL">YNN0NP1A/IN90</FareBasisCode>
                  <FareBasisCode ArrivalAirportCode="LHR" AvailabilityBreak="true" BookingCode="Y" DepartureAirportCode="HND" GovCarrier="JL">YNN0NP1A/IN90</FareBasisCode>
                  <FareBasisCode ArrivalAirportCode="HND" BookingCode="W" DepartureAirportCode="LHR" FareComponentBeginAirport="LHR" FareComponentCabinCode="S" FareComponentDirectionality="TO" FareComponentEndAirport="SYD" FareComponentFareRule="2291" FareComponentFareTariff="44" FareComponentFareType="WU" FareComponentFareTypeBitmap="01" FareComponentVendorCode="ATP" GovCarrier="JL">WNN0NP1A/IN90</FareBasisCode>
                  <FareBasisCode ArrivalAirportCode="SYD" AvailabilityBreak="true" BookingCode="W" DepartureAirportCode="HND" GovCarrier="JL">WNN0NP1A/IN90</FareBasisCode>
                </FareBasisCodes>
                <PassengerFare>
                  <BaseFare Amount="1268.00" CurrencyCode="AUD"/>
                  <FareConstruction Amount="954.18" CurrencyCode="NUC" DecimalPlaces="2"/>
                  <EquivFare Amount="52625" CurrencyCode="RUB" DecimalPlaces="0"/>
                  <Taxes>
                    <Tax Amount="211" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQI"/>
                    <Tax Amount="211" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQI"/>
                    <Tax Amount="211" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQI"/>
                    <Tax Amount="211" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQI"/>
                    <Tax Amount="4093" CountryCode="GB" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="UB"/>
                    <TaxSummary Amount="844" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQI"/>
                    <TaxSummary Amount="4093" CountryCode="GB" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="UB"/>
                    <TotalTax Amount="4937" CurrencyCode="RUB" DecimalPlaces="0"/>
                  </Taxes>
                  <TotalFare Amount="57562" CurrencyCode="RUB"/>
                  <PenaltiesInfo>
                    <Penalty Amount="0" Applicability="Before" Changeable="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                    <Penalty Amount="0" Applicability="After" Changeable="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                    <Penalty Amount="0" Applicability="Before" Cat16Info="true" CurrencyCode="RUB" DecimalPlaces="0" Refundable="true" Type="Refund"/>
                    <Penalty Amount="0" Applicability="After" Cat16Info="true" CurrencyCode="RUB" DecimalPlaces="0" Refundable="true" Type="Refund"/>
                  </PenaltiesInfo>
                  <TPA_Extensions>
                    <BaggageInformationList>
                      <BaggageInformation AirlineCode="JL" ProvisionType="A">
                        <Segment Id="0"/>
                        <Segment Id="1"/>
                        <Allowance Description1="UP TO 50 POUNDS/23 KILOGRAMS" Description2="UP TO 80 LINEAR INCHES/203 LINEAR CENTIMETERS" Pieces="1"/>
                      </BaggageInformation>
                      <BaggageInformation AirlineCode="JL" ProvisionType="A">
                        <Segment Id="2"/>
                        <Segment Id="3"/>
                        <Allowance Description1="UP TO 50 POUNDS/23 KILOGRAMS" Description2="UP TO 80 LINEAR INCHES/203 LINEAR CENTIMETERS" Pieces="1"/>
                      </BaggageInformation>
                      <BaggageInformation AirlineCode="JL" ProvisionType="B">
                        <Segment Id="0"/>
                        <Allowance Description1="UP TO 22 POUNDS/10 KILOGRAMS" Description2="UP TO 45 LINEAR INCHES/115 LINEAR CENTIMETERS" Pieces="1"/>
                      </BaggageInformation>
                      <BaggageInformation AirlineCode="JL" ProvisionType="B">
                        <Segment Id="1"/>
                        <Allowance Description1="UP TO 22 POUNDS/10 KILOGRAMS" Description2="UP TO 45 LINEAR INCHES/115 LINEAR CENTIMETERS" Pieces="1"/>
                      </BaggageInformation>
                      <BaggageInformation AirlineCode="BA" ProvisionType="B">
                        <Segment Id="2"/>
                        <Allowance Description1="UP TO 50 POUNDS/23 KILOGRAMS" Description2="UP TO 50 POUNDS/127 LINEAR CENTIMETERS" Pieces="1"/>
                      </BaggageInformation>
                      <BaggageInformation AirlineCode="JL" ProvisionType="B">
                        <Segment Id="3"/>
                        <Allowance Description1="UP TO 22 POUNDS/10 KILOGRAMS" Description2="UP TO 45 LINEAR INCHES/115 LINEAR CENTIMETERS" Pieces="1"/>
                      </BaggageInformation>
                    </BaggageInformationList>
                    <SeatSelectionList>
                      <SeatSelection Type="N">
                        <Segment ID="0"/>
                        <Segment ID="1"/>
                        <Segment ID="2"/>
                        <Segment ID="3"/>
                      </SeatSelection>
                    </SeatSelectionList>
                  </TPA_Extensions>
                </PassengerFare>
                <Endorsements NonRefundableIndicator="false"/>
                <TPA_Extensions>
                  <FareCalcLine Info="SYD JL X/TYO JL LON477.09JL X/TYO JL SYD477.09NUC954.18END ROE1.328146"/>
                </TPA_Extensions>
                <FareInfos>
                  <FareInfo>
                    <FareReference>Y</FareReference>
                    <TPA_Extensions>
                      <SeatsRemaining BelowMin="false" Number="9"/>
                      <Cabin Cabin="Y"/>
                      <Meal Code="M"/>
                    </TPA_Extensions>
                  </FareInfo>
                  <FareInfo>
                    <FareReference>Y</FareReference>
                    <TPA_Extensions>
                      <SeatsRemaining BelowMin="false" Number="9"/>
                      <Cabin Cabin="Y"/>
                      <Meal Code="M"/>
                    </TPA_Extensions>
                  </FareInfo>
                  <FareInfo>
                    <FareReference>W</FareReference>
                    <TPA_Extensions>
                      <SeatsRemaining BelowMin="false" Number="9"/>
                      <Cabin Cabin="S"/>
                    </TPA_Extensions>
                  </FareInfo>
                  <FareInfo>
                    <FareReference>W</FareReference>
                    <TPA_Extensions>
                      <SeatsRemaining BelowMin="false" Number="9"/>
                      <Cabin Cabin="S"/>
                      <Meal Code="M"/>
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
                  <Meal Code="M"/>
                </TPA_Extensions>
              </FareInfo>
              <FareInfo>
                <FareReference>Y</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="M"/>
                </TPA_Extensions>
              </FareInfo>
              <FareInfo>
                <FareReference>W</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="S"/>
                </TPA_Extensions>
              </FareInfo>
              <FareInfo>
                <FareReference>W</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="S"/>
                  <Meal Code="M"/>
                </TPA_Extensions>
              </FareInfo>
            </FareInfos>
            <TPA_Extensions>
              <DivideInParty Indicator="false"/>
              <AncillaryFeeGroups Message="AIR EXTRAS NOT APPLICABLE OR ARE UNKNOWN FOR THIS ITINERARY"/>
              <ValidatingCarrier NewVcxProcess="true" SettlementMethod="BSP">
                <Default Code="JL"/>
              </ValidatingCarrier>
            </TPA_Extensions>
          </AirItineraryPricingInfo>
          <TicketingInfo TicketType="eTicket" ValidInterline="Yes"/>
        </AdditionalFares>
        <AdditionalFares>
          <AirItineraryPricingInfo FareReturned="true" FlexibleFareID="3" LastTicketDate="2022-11-17" LastTicketTime="23:59" PricingSource="ADVJR1" PricingSubSource="MIP">
            <ItinTotalFare>
              <BaseFare Amount="36119.00" CurrencyCode="AUD" DecimalPlaces="2"/>
              <FareConstruction Amount="27194.30" CurrencyCode="NUC" DecimalPlaces="2"/>
              <EquivFare Amount="1498945" CurrencyCode="RUB" DecimalPlaces="0"/>
              <Taxes>
                <Tax Amount="131683" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="TOTALTAX"/>
              </Taxes>
              <TotalFare Amount="1630628" CurrencyCode="RUB" DecimalPlaces="0"/>
            </ItinTotalFare>
            <PTC_FareBreakdowns>
              <PTC_FareBreakdown>
                <PassengerTypeQuantity Code="ADT" Quantity="2"/>
                <FareBasisCodes>
                  <FareBasisCode ArrivalAirportCode="HND" BookingCode="Y" DepartureAirportCode="SYD" FareComponentBeginAirport="SYD" FareComponentCabinCode="Y" FareComponentDirectionality="FROM" FareComponentEndAirport="LHR" FareComponentFareRule="2291" FareComponentFareTariff="44" FareComponentFareType="EU" FareComponentFareTypeBitmap="00" FareComponentVendorCode="ATP" GovCarrier="JL">YNN0NP1A</FareBasisCode>
                  <FareBasisCode ArrivalAirportCode="LHR" AvailabilityBreak="true" BookingCode="Y" DepartureAirportCode="HND" GovCarrier="JL">YNN0NP1A</FareBasisCode>
                  <FareBasisCode ArrivalAirportCode="HND" BookingCode="W" DepartureAirportCode="LHR" FareComponentBeginAirport="LHR" FareComponentCabinCode="S" FareComponentDirectionality="TO" FareComponentEndAirport="SYD" FareComponentFareRule="2291" FareComponentFareTariff="44" FareComponentFareType="WU" FareComponentFareTypeBitmap="00" FareComponentVendorCode="ATP" GovCarrier="JL">WNN0NP1A</FareBasisCode>
                  <FareBasisCode ArrivalAirportCode="SYD" AvailabilityBreak="true" BookingCode="W" DepartureAirportCode="HND" GovCarrier="JL">WNN0NP1A</FareBasisCode>
                </FareBasisCodes>
                <PassengerFare>
                  <BaseFare Amount="12673.00" CurrencyCode="AUD"/>
                  <FareConstruction Amount="9541.86" CurrencyCode="NUC" DecimalPlaces="2"/>
                  <EquivFare Amount="525930" CurrencyCode="RUB" DecimalPlaces="0"/>
                  <Taxes>
                    <Tax Amount="9172" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                    <Tax Amount="9172" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                    <Tax Amount="211" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQI"/>
                    <Tax Amount="211" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQI"/>
                    <Tax Amount="211" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQI"/>
                    <Tax Amount="211" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQI"/>
                    <Tax Amount="2490" CountryCode="AU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="AU"/>
                    <Tax Amount="1338" CountryCode="AU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="WY"/>
                    <Tax Amount="1338" CountryCode="AU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="WY2"/>
                    <Tax Amount="13505" CountryCode="GB" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="GB"/>
                    <Tax Amount="4093" CountryCode="GB" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="UB"/>
                    <Tax Amount="677" CountryCode="JP" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="SW"/>
                    <Tax Amount="677" CountryCode="JP" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="SW"/>
                    <TaxSummary Amount="19188" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                    <TaxSummary Amount="2490" CountryCode="AU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="AU"/>
                    <TaxSummary Amount="2676" CountryCode="AU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="WY"/>
                    <TaxSummary Amount="1354" CountryCode="JP" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="SW"/>
                    <TaxSummary Amount="13505" CountryCode="GB" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="GB"/>
                    <TaxSummary Amount="4093" CountryCode="GB" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="UB"/>
                    <TotalTax Amount="43306" CurrencyCode="RUB" DecimalPlaces="0"/>
                  </Taxes>
                  <TotalFare Amount="569236" CurrencyCode="RUB"/>
                  <PenaltiesInfo>
                    <Penalty Amount="0" Applicability="Before" Changeable="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                    <Penalty Amount="0" Applicability="After" Changeable="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                    <Penalty Amount="0" Applicability="Before" Cat16Info="true" CurrencyCode="RUB" DecimalPlaces="0" Refundable="true" Type="Refund"/>
                    <Penalty Amount="0" Applicability="After" Cat16Info="true" CurrencyCode="RUB" DecimalPlaces="0" Refundable="true" Type="Refund"/>
                  </PenaltiesInfo>
                  <TPA_Extensions>
                    <BaggageInformationList>
                      <BaggageInformation AirlineCode="JL" ProvisionType="A">
                        <Segment Id="0"/>
                        <Segment Id="1"/>
                        <Allowance Description1="UP TO 50 POUNDS/23 KILOGRAMS" Description2="UP TO 80 LINEAR INCHES/203 LINEAR CENTIMETERS" Pieces="2"/>
                      </BaggageInformation>
                      <BaggageInformation AirlineCode="JL" ProvisionType="A">
                        <Segment Id="2"/>
                        <Segment Id="3"/>
                        <Allowance Description1="UP TO 50 POUNDS/23 KILOGRAMS" Description2="UP TO 80 LINEAR INCHES/203 LINEAR CENTIMETERS" Pieces="2"/>
                      </BaggageInformation>
                      <BaggageInformation AirlineCode="JL" ProvisionType="B">
                        <Segment Id="0"/>
                        <Allowance Description1="UP TO 22 POUNDS/10 KILOGRAMS" Description2="UP TO 45 LINEAR INCHES/115 LINEAR CENTIMETERS" Pieces="1"/>
                      </BaggageInformation>
                      <BaggageInformation AirlineCode="JL" ProvisionType="B">
                        <Segment Id="1"/>
                        <Allowance Description1="UP TO 22 POUNDS/10 KILOGRAMS" Description2="UP TO 45 LINEAR INCHES/115 LINEAR CENTIMETERS" Pieces="1"/>
                      </BaggageInformation>
                      <BaggageInformation AirlineCode="BA" ProvisionType="B">
                        <Segment Id="2"/>
                        <Allowance Description1="UP TO 34 LINEAR INCHES/85 LINEAR CENTIMETERS" Pieces="1"/>
                      </BaggageInformation>
                      <BaggageInformation AirlineCode="JL" ProvisionType="B">
                        <Segment Id="3"/>
                        <Allowance Description1="UP TO 22 POUNDS/10 KILOGRAMS" Description2="UP TO 45 LINEAR INCHES/115 LINEAR CENTIMETERS" Pieces="1"/>
                      </BaggageInformation>
                    </BaggageInformationList>
                    <SeatSelectionList>
                      <SeatSelection Type="N">
                        <Segment ID="0"/>
                        <Segment ID="1"/>
                        <Segment ID="2"/>
                        <Segment ID="3"/>
                      </SeatSelection>
                    </SeatSelectionList>
                  </TPA_Extensions>
                </PassengerFare>
                <Endorsements NonRefundableIndicator="false"/>
                <TPA_Extensions>
                  <FareCalcLine Info="SYD JL X/TYO JL LON4770.93JL X/TYO JL SYD4770.93NUC9541.86END ROE1.328146"/>
                </TPA_Extensions>
                <FareInfos>
                  <FareInfo>
                    <FareReference>Y</FareReference>
                    <TPA_Extensions>
                      <SeatsRemaining BelowMin="false" Number="9"/>
                      <Cabin Cabin="Y"/>
                      <Meal Code="M"/>
                    </TPA_Extensions>
                  </FareInfo>
                  <FareInfo>
                    <FareReference>Y</FareReference>
                    <TPA_Extensions>
                      <SeatsRemaining BelowMin="false" Number="9"/>
                      <Cabin Cabin="Y"/>
                      <Meal Code="M"/>
                    </TPA_Extensions>
                  </FareInfo>
                  <FareInfo>
                    <FareReference>W</FareReference>
                    <TPA_Extensions>
                      <SeatsRemaining BelowMin="false" Number="9"/>
                      <Cabin Cabin="S"/>
                    </TPA_Extensions>
                  </FareInfo>
                  <FareInfo>
                    <FareReference>W</FareReference>
                    <TPA_Extensions>
                      <SeatsRemaining BelowMin="false" Number="9"/>
                      <Cabin Cabin="S"/>
                      <Meal Code="M"/>
                    </TPA_Extensions>
                  </FareInfo>
                </FareInfos>
              </PTC_FareBreakdown>
              <PTC_FareBreakdown>
                <PassengerTypeQuantity Code="CNN" Quantity="1"/>
                <FareBasisCodes>
                  <FareBasisCode ArrivalAirportCode="HND" BookingCode="Y" DepartureAirportCode="SYD" FareComponentBeginAirport="SYD" FareComponentCabinCode="Y" FareComponentDirectionality="FROM" FareComponentEndAirport="LHR" FareComponentFareRule="2291" FareComponentFareTariff="44" FareComponentFareType="EU" FareComponentFareTypeBitmap="01" FareComponentVendorCode="ATP" GovCarrier="JL">YNN0NP1A/CH25</FareBasisCode>
                  <FareBasisCode ArrivalAirportCode="LHR" AvailabilityBreak="true" BookingCode="Y" DepartureAirportCode="HND" GovCarrier="JL">YNN0NP1A/CH25</FareBasisCode>
                  <FareBasisCode ArrivalAirportCode="HND" BookingCode="W" DepartureAirportCode="LHR" FareComponentBeginAirport="LHR" FareComponentCabinCode="S" FareComponentDirectionality="TO" FareComponentEndAirport="SYD" FareComponentFareRule="2291" FareComponentFareTariff="44" FareComponentFareType="WU" FareComponentFareTypeBitmap="01" FareComponentVendorCode="ATP" GovCarrier="JL">WNN0NP1A/CH25</FareBasisCode>
                  <FareBasisCode ArrivalAirportCode="SYD" AvailabilityBreak="true" BookingCode="W" DepartureAirportCode="HND" GovCarrier="JL">WNN0NP1A/CH25</FareBasisCode>
                </FareBasisCodes>
                <PassengerFare>
                  <BaseFare Amount="9505.00" CurrencyCode="AUD"/>
                  <FareConstruction Amount="7156.40" CurrencyCode="NUC" DecimalPlaces="2"/>
                  <EquivFare Amount="394460" CurrencyCode="RUB" DecimalPlaces="0"/>
                  <Taxes>
                    <Tax Amount="9172" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                    <Tax Amount="9172" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                    <Tax Amount="211" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQI"/>
                    <Tax Amount="211" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQI"/>
                    <Tax Amount="211" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQI"/>
                    <Tax Amount="211" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQI"/>
                    <Tax Amount="1338" CountryCode="AU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="WY"/>
                    <Tax Amount="1338" CountryCode="AU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="WY2"/>
                    <Tax Amount="13505" CountryCode="GB" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="GB"/>
                    <Tax Amount="4093" CountryCode="GB" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="UB"/>
                    <Tax Amount="336" CountryCode="JP" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="SW"/>
                    <Tax Amount="336" CountryCode="JP" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="SW"/>
                    <TaxSummary Amount="19188" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                    <TaxSummary Amount="2676" CountryCode="AU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="WY"/>
                    <TaxSummary Amount="672" CountryCode="JP" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="SW"/>
                    <TaxSummary Amount="13505" CountryCode="GB" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="GB"/>
                    <TaxSummary Amount="4093" CountryCode="GB" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="UB"/>
                    <TotalTax Amount="40134" CurrencyCode="RUB" DecimalPlaces="0"/>
                  </Taxes>
                  <TotalFare Amount="434594" CurrencyCode="RUB"/>
                  <PenaltiesInfo>
                    <Penalty Amount="0" Applicability="Before" Changeable="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                    <Penalty Amount="0" Applicability="After" Changeable="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                    <Penalty Amount="0" Applicability="Before" Cat16Info="true" CurrencyCode="RUB" DecimalPlaces="0" Refundable="true" Type="Refund"/>
                    <Penalty Amount="0" Applicability="After" Cat16Info="true" CurrencyCode="RUB" DecimalPlaces="0" Refundable="true" Type="Refund"/>
                  </PenaltiesInfo>
                  <TPA_Extensions>
                    <BaggageInformationList>
                      <BaggageInformation AirlineCode="JL" ProvisionType="A">
                        <Segment Id="0"/>
                        <Segment Id="1"/>
                        <Allowance Description1="UP TO 50 POUNDS/23 KILOGRAMS" Description2="UP TO 80 LINEAR INCHES/203 LINEAR CENTIMETERS" Pieces="2"/>
                      </BaggageInformation>
                      <BaggageInformation AirlineCode="JL" ProvisionType="A">
                        <Segment Id="2"/>
                        <Segment Id="3"/>
                        <Allowance Description1="UP TO 50 POUNDS/23 KILOGRAMS" Description2="UP TO 80 LINEAR INCHES/203 LINEAR CENTIMETERS" Pieces="2"/>
                      </BaggageInformation>
                      <BaggageInformation AirlineCode="JL" ProvisionType="B">
                        <Segment Id="0"/>
                        <Allowance Description1="UP TO 22 POUNDS/10 KILOGRAMS" Description2="UP TO 45 LINEAR INCHES/115 LINEAR CENTIMETERS" Pieces="1"/>
                      </BaggageInformation>
                      <BaggageInformation AirlineCode="JL" ProvisionType="B">
                        <Segment Id="1"/>
                        <Allowance Description1="UP TO 22 POUNDS/10 KILOGRAMS" Description2="UP TO 45 LINEAR INCHES/115 LINEAR CENTIMETERS" Pieces="1"/>
                      </BaggageInformation>
                      <BaggageInformation AirlineCode="BA" ProvisionType="B">
                        <Segment Id="2"/>
                        <Allowance Description1="UP TO 34 LINEAR INCHES/85 LINEAR CENTIMETERS" Pieces="1"/>
                      </BaggageInformation>
                      <BaggageInformation AirlineCode="JL" ProvisionType="B">
                        <Segment Id="3"/>
                        <Allowance Description1="UP TO 22 POUNDS/10 KILOGRAMS" Description2="UP TO 45 LINEAR INCHES/115 LINEAR CENTIMETERS" Pieces="1"/>
                      </BaggageInformation>
                    </BaggageInformationList>
                    <SeatSelectionList>
                      <SeatSelection Type="N">
                        <Segment ID="0"/>
                        <Segment ID="1"/>
                        <Segment ID="2"/>
                        <Segment ID="3"/>
                      </SeatSelection>
                    </SeatSelectionList>
                  </TPA_Extensions>
                </PassengerFare>
                <Endorsements NonRefundableIndicator="false"/>
                <TPA_Extensions>
                  <FareCalcLine Info="SYD JL X/TYO JL LON3578.20JL X/TYO JL SYD3578.20NUC7156.40END ROE1.328146"/>
                </TPA_Extensions>
                <FareInfos>
                  <FareInfo>
                    <FareReference>Y</FareReference>
                    <TPA_Extensions>
                      <SeatsRemaining BelowMin="false" Number="9"/>
                      <Cabin Cabin="Y"/>
                      <Meal Code="M"/>
                    </TPA_Extensions>
                  </FareInfo>
                  <FareInfo>
                    <FareReference>Y</FareReference>
                    <TPA_Extensions>
                      <SeatsRemaining BelowMin="false" Number="9"/>
                      <Cabin Cabin="Y"/>
                      <Meal Code="M"/>
                    </TPA_Extensions>
                  </FareInfo>
                  <FareInfo>
                    <FareReference>W</FareReference>
                    <TPA_Extensions>
                      <SeatsRemaining BelowMin="false" Number="9"/>
                      <Cabin Cabin="S"/>
                    </TPA_Extensions>
                  </FareInfo>
                  <FareInfo>
                    <FareReference>W</FareReference>
                    <TPA_Extensions>
                      <SeatsRemaining BelowMin="false" Number="9"/>
                      <Cabin Cabin="S"/>
                      <Meal Code="M"/>
                    </TPA_Extensions>
                  </FareInfo>
                </FareInfos>
              </PTC_FareBreakdown>
              <PTC_FareBreakdown>
                <PassengerTypeQuantity Code="INF" Quantity="1"/>
                <FareBasisCodes>
                  <FareBasisCode ArrivalAirportCode="HND" BookingCode="Y" DepartureAirportCode="SYD" FareComponentBeginAirport="SYD" FareComponentCabinCode="Y" FareComponentDirectionality="FROM" FareComponentEndAirport="LHR" FareComponentFareRule="2291" FareComponentFareTariff="44" FareComponentFareType="EU" FareComponentFareTypeBitmap="01" FareComponentVendorCode="ATP" GovCarrier="JL">YNN0NP1A/IN90</FareBasisCode>
                  <FareBasisCode ArrivalAirportCode="LHR" AvailabilityBreak="true" BookingCode="Y" DepartureAirportCode="HND" GovCarrier="JL">YNN0NP1A/IN90</FareBasisCode>
                  <FareBasisCode ArrivalAirportCode="HND" BookingCode="W" DepartureAirportCode="LHR" FareComponentBeginAirport="LHR" FareComponentCabinCode="S" FareComponentDirectionality="TO" FareComponentEndAirport="SYD" FareComponentFareRule="2291" FareComponentFareTariff="44" FareComponentFareType="WU" FareComponentFareTypeBitmap="01" FareComponentVendorCode="ATP" GovCarrier="JL">WNN0NP1A/IN90</FareBasisCode>
                  <FareBasisCode ArrivalAirportCode="SYD" AvailabilityBreak="true" BookingCode="W" DepartureAirportCode="HND" GovCarrier="JL">WNN0NP1A/IN90</FareBasisCode>
                </FareBasisCodes>
                <PassengerFare>
                  <BaseFare Amount="1268.00" CurrencyCode="AUD"/>
                  <FareConstruction Amount="954.18" CurrencyCode="NUC" DecimalPlaces="2"/>
                  <EquivFare Amount="52625" CurrencyCode="RUB" DecimalPlaces="0"/>
                  <Taxes>
                    <Tax Amount="211" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQI"/>
                    <Tax Amount="211" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQI"/>
                    <Tax Amount="211" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQI"/>
                    <Tax Amount="211" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQI"/>
                    <Tax Amount="4093" CountryCode="GB" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="UB"/>
                    <TaxSummary Amount="844" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQI"/>
                    <TaxSummary Amount="4093" CountryCode="GB" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="UB"/>
                    <TotalTax Amount="4937" CurrencyCode="RUB" DecimalPlaces="0"/>
                  </Taxes>
                  <TotalFare Amount="57562" CurrencyCode="RUB"/>
                  <PenaltiesInfo>
                    <Penalty Amount="0" Applicability="Before" Changeable="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                    <Penalty Amount="0" Applicability="After" Changeable="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                    <Penalty Amount="0" Applicability="Before" Cat16Info="true" CurrencyCode="RUB" DecimalPlaces="0" Refundable="true" Type="Refund"/>
                    <Penalty Amount="0" Applicability="After" Cat16Info="true" CurrencyCode="RUB" DecimalPlaces="0" Refundable="true" Type="Refund"/>
                  </PenaltiesInfo>
                  <TPA_Extensions>
                    <BaggageInformationList>
                      <BaggageInformation AirlineCode="JL" ProvisionType="A">
                        <Segment Id="0"/>
                        <Segment Id="1"/>
                        <Allowance Description1="UP TO 50 POUNDS/23 KILOGRAMS" Description2="UP TO 80 LINEAR INCHES/203 LINEAR CENTIMETERS" Pieces="1"/>
                      </BaggageInformation>
                      <BaggageInformation AirlineCode="JL" ProvisionType="A">
                        <Segment Id="2"/>
                        <Segment Id="3"/>
                        <Allowance Description1="UP TO 50 POUNDS/23 KILOGRAMS" Description2="UP TO 80 LINEAR INCHES/203 LINEAR CENTIMETERS" Pieces="1"/>
                      </BaggageInformation>
                      <BaggageInformation AirlineCode="JL" ProvisionType="B">
                        <Segment Id="0"/>
                        <Allowance Description1="UP TO 22 POUNDS/10 KILOGRAMS" Description2="UP TO 45 LINEAR INCHES/115 LINEAR CENTIMETERS" Pieces="1"/>
                      </BaggageInformation>
                      <BaggageInformation AirlineCode="JL" ProvisionType="B">
                        <Segment Id="1"/>
                        <Allowance Description1="UP TO 22 POUNDS/10 KILOGRAMS" Description2="UP TO 45 LINEAR INCHES/115 LINEAR CENTIMETERS" Pieces="1"/>
                      </BaggageInformation>
                      <BaggageInformation AirlineCode="BA" ProvisionType="B">
                        <Segment Id="2"/>
                        <Allowance Description1="UP TO 50 POUNDS/23 KILOGRAMS" Description2="UP TO 50 POUNDS/127 LINEAR CENTIMETERS" Pieces="1"/>
                      </BaggageInformation>
                      <BaggageInformation AirlineCode="JL" ProvisionType="B">
                        <Segment Id="3"/>
                        <Allowance Description1="UP TO 22 POUNDS/10 KILOGRAMS" Description2="UP TO 45 LINEAR INCHES/115 LINEAR CENTIMETERS" Pieces="1"/>
                      </BaggageInformation>
                    </BaggageInformationList>
                    <SeatSelectionList>
                      <SeatSelection Type="N">
                        <Segment ID="0"/>
                        <Segment ID="1"/>
                        <Segment ID="2"/>
                        <Segment ID="3"/>
                      </SeatSelection>
                    </SeatSelectionList>
                  </TPA_Extensions>
                </PassengerFare>
                <Endorsements NonRefundableIndicator="false"/>
                <TPA_Extensions>
                  <FareCalcLine Info="SYD JL X/TYO JL LON477.09JL X/TYO JL SYD477.09NUC954.18END ROE1.328146"/>
                </TPA_Extensions>
                <FareInfos>
                  <FareInfo>
                    <FareReference>Y</FareReference>
                    <TPA_Extensions>
                      <SeatsRemaining BelowMin="false" Number="9"/>
                      <Cabin Cabin="Y"/>
                      <Meal Code="M"/>
                    </TPA_Extensions>
                  </FareInfo>
                  <FareInfo>
                    <FareReference>Y</FareReference>
                    <TPA_Extensions>
                      <SeatsRemaining BelowMin="false" Number="9"/>
                      <Cabin Cabin="Y"/>
                      <Meal Code="M"/>
                    </TPA_Extensions>
                  </FareInfo>
                  <FareInfo>
                    <FareReference>W</FareReference>
                    <TPA_Extensions>
                      <SeatsRemaining BelowMin="false" Number="9"/>
                      <Cabin Cabin="S"/>
                    </TPA_Extensions>
                  </FareInfo>
                  <FareInfo>
                    <FareReference>W</FareReference>
                    <TPA_Extensions>
                      <SeatsRemaining BelowMin="false" Number="9"/>
                      <Cabin Cabin="S"/>
                      <Meal Code="M"/>
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
                  <Meal Code="M"/>
                </TPA_Extensions>
              </FareInfo>
              <FareInfo>
                <FareReference>Y</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="M"/>
                </TPA_Extensions>
              </FareInfo>
              <FareInfo>
                <FareReference>W</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="S"/>
                </TPA_Extensions>
              </FareInfo>
              <FareInfo>
                <FareReference>W</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="S"/>
                  <Meal Code="M"/>
                </TPA_Extensions>
              </FareInfo>
            </FareInfos>
            <TPA_Extensions>
              <DivideInParty Indicator="false"/>
              <AncillaryFeeGroups Message="AIR EXTRAS NOT APPLICABLE OR ARE UNKNOWN FOR THIS ITINERARY"/>
              <ValidatingCarrier NewVcxProcess="true" SettlementMethod="BSP">
                <Default Code="JL"/>
              </ValidatingCarrier>
            </TPA_Extensions>
          </AirItineraryPricingInfo>
          <TicketingInfo TicketType="eTicket" ValidInterline="Yes"/>
        </AdditionalFares>
        <ValidatingCarrier Code="JL"/>
        <DiversitySwapper WeighedPriceAmount="531006"/>
      </TPA_Extensions>
    </PricedItinerary>
    <!--Другие рекомендации-->
  </PricedItineraries>
</OTA_AirLowFareSearchRS>
```
{{< /details >}}

---

{{< details title="Пример запроса (получение дополнительных расчетов стоимости по заданным критериям, GIR ответ)" >}}
```XML
<OTA_AirLowFareSearchRQ ResponseType="GIR" Version="6.5.0" xmlns="http://www.opentravel.org/OTA/2003/05">
  <POS>
    <Source PseudoCityCode="9LSC">
      <RequestorID ID="1" Type="1">
        <CompanyName Code="TN"/>
      </RequestorID>
    </Source>
  </POS>
  <OriginDestinationInformation RPH="1">
    <DepartureDateTime>2022-12-01T11:00:00</DepartureDateTime>
    <OriginLocation LocationCode="SYD"/>
    <DestinationLocation LocationCode="LON"/>
  </OriginDestinationInformation>
  <OriginDestinationInformation RPH="2">
    <DepartureDateTime>2022-12-08T11:00:00</DepartureDateTime>
    <OriginLocation LocationCode="LON"/>
    <DestinationLocation LocationCode="SYD"/>
  </OriginDestinationInformation>
  <TravelPreferences ValidInterlineTicket="true">
    <CabinPref Cabin="Economy" PreferLevel="Preferred"/>
    <TPA_Extensions>
      <LongConnectTime Enable="true"/>
      <LongConnectPoints Max="3" Min="1"/>
      <KeepSameCabin Enabled="true"/>
      <ExcludeCallDirectCarriers Enabled="true"/>
      <SeatSelection Info="true"/>
      <FlexibleFares>
        <FareParameters>
          <KeepSameCabin Enabled="true"/>
          <VoluntaryChanges Match="Info"/>
          <BrandedFareIndicators SingleBrandedFare="true"/>
          <Baggage FreePieceRequired="true"/>
        </FareParameters>
        <FareParameters>
          <KeepSameCabin Enabled="true"/>
          <VoluntaryChanges Match="All">
            <Penalty Type="Exchange"/>
            <Penalty Type="Refund"/>
          </VoluntaryChanges>
          <BrandedFareIndicators SingleBrandedFare="true"/>
        </FareParameters>
        <FareParameters>
          <KeepSameCabin Enabled="true"/>
          <VoluntaryChanges Match="All">
            <Penalty Amount="1000" CurrencyCode="RUB" Type="Exchange"/>
            <Penalty Amount="1000" CurrencyCode="RUB" Type="Refund"/>
          </VoluntaryChanges>
          <BrandedFareIndicators SingleBrandedFare="true"/>
        </FareParameters>
        <FareParameters>
          <Cabin Type="Business"/>
          <KeepSameCabin Enabled="true"/>
          <VoluntaryChanges Match="Info"/>
          <BrandedFareIndicators SingleBrandedFare="true"/>
        </FareParameters>
        <FareParameters>
          <PrivateFare Ind="true"/>
          <KeepSameCabin Enabled="true"/>
          <VoluntaryChanges Match="Info"/>
          <BrandedFareIndicators SingleBrandedFare="true"/>
        </FareParameters>
      </FlexibleFares>
      <DiversityParameters AdditionalNonStopsPercentage="100"/>
    </TPA_Extensions>
    <AncillaryFees Enable="true">
      <AncillaryFeeGroup Code="BG"/>
    </AncillaryFees>
    <Baggage CarryOnInfo="true" Description="true" RequestType="A"/>
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
```
{{< /details >}}

{{< details title="Пример ответа" >}}
```XML
<GroupedItineraryResponse Version="6.5.0" xmlns="http://webservices.sabre.com/wsdl/sabreXML1.0.00/shopping/GroupedItineraryResponse" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <Message Code="GCC14-ISELL-TN-00-2022-05-00-1T36" Severity="Info" Text="27032" Type="SERVER"/>
  <Message Code="TRANSACTIONID" Severity="Info" Text="8850841971214793916" Type="WORKERTHREAD"/>
  <Message Code="RULEID" Severity="Info" Text="15936" Type="DRE"/>
  <Message Code="RULEID" Severity="Info" Text="27757" Type="DEFAULT"/>
  <Message Code="PROCESS" Severity="Error" Text="NO SOLUTION PASSED INTERLINE TICKETING VALIDATION" Type="MIP"/>
  <Message Code="PROCESS" NumberOfOccurences="22" Severity="Error" Text="NO COMBINABLE FARES FOR CLASS USED" Type="MIP"/>
  <Message Code="PROCESS" NumberOfOccurences="2" Severity="Error" Text="NO PRIVATE FARES VALID FOR PASSENGER TYPE/CLASS OF SERVICE" Type="MIP"/>
  <Message Code="PROCESS" NumberOfOccurences="2" Severity="Error" Text="MAXIMUM PENALTY IS TOO RESTRICTIVE: NO FARES WITH CHANGE PENALTY LESS THAN 1000 RUB" Type="MIP"/>
  <Message Code="PROCESS" Severity="Error" Text="MAXIMUM PENALTY IS TOO RESTRICTIVE: NO FARES WITH REFUND PENALTY LESS THAN 1000 RUB" Type="MIP"/>
  <Message Code="MIP" Severity="Info" ShortCode="MIP:5053" Text="NO COMBINABLE FARES FOR CLASS USED" Type="MIP"/>
  <Statistics Itineraries="200"/>
  <ScheduleDesc ETicketable="true" ElapsedTime="700" Frequency="SMTWTFS" ID="1" Stops="0" TotalMilesFlown="5974">
    <Departure Airport="LHR" City="LON" Country="GB" Terminal="5" Time="13:45:00Z"/>
    <Arrival Airport="HND" City="TYO" Country="JP" DateAdjustment="1" Terminal="3" Time="10:25:00+09:00"/>
    <Carrier Disclosure="BA" Marketing="JL" MarketingFlightNumber="7120" Operating="BA" OperatingFlightNumber="5">
      <Equipment Code="789" TypeForFirstLeg="W" TypeForLastLeg="W"/>
    </Carrier>
  </ScheduleDesc>
  <ScheduleDesc ETicketable="true" ElapsedTime="80" Frequency="SMTWTF*" ID="2" Stops="0" TotalMilesFlown="231">
    <Departure Airport="LHR" City="LON" Country="GB" Terminal="3" Time="11:45:00Z"/>
    <Arrival Airport="AMS" City="AMS" Country="NL" Time="14:05:00+01:00"/>
    <Carrier Marketing="KL" MarketingFlightNumber="1010" Operating="KL" OperatingFlightNumber="1010">
      <Equipment Code="73H" TypeForFirstLeg="N" TypeForLastLeg="N"/>
    </Carrier>
  </ScheduleDesc>
  <ScheduleDesc ETicketable="true" ElapsedTime="905" Frequency="SMTWTF*" ID="3" Stops="0" TotalMilesFlown="7417">
    <Departure Airport="SFO" City="SFO" Country="US" State="CA" Terminal="I" Time="23:00:00-08:00"/>
    <Arrival Airport="SYD" City="SYD" Country="AU" DateAdjustment="2" State="NS" Terminal="1" Time="09:05:00+11:00"/>
    <Carrier Marketing="UA" MarketingFlightNumber="863" Operating="UA" OperatingFlightNumber="863">
      <Equipment Code="789" TypeForFirstLeg="W" TypeForLastLeg="W"/>
    </Carrier>
  </ScheduleDesc>
  <ScheduleDesc ETicketable="true" ElapsedTime="900" Frequency="**TWTF*" ID="4" Stops="0" TotalMilesFlown="7488" TrafficRestriction="Q">
    <Departure Airport="LAX" City="LAX" Country="US" State="CA" Terminal="3" Time="22:30:00-08:00"/>
    <Arrival Airport="SYD" City="SYD" Country="AU" DateAdjustment="2" State="NS" Terminal="1" Time="08:30:00+11:00"/>
    <Carrier Alliances="*S " Disclosure="DL" Marketing="AF" MarketingFlightNumber="8958" Operating="DL" OperatingFlightNumber="41">
      <Equipment Code="359" TypeForFirstLeg="W" TypeForLastLeg="W"/>
    </Carrier>
  </ScheduleDesc>
  <ScheduleDesc ETicketable="true" ElapsedTime="630" Frequency="SMTWTF*" ID="5" Stops="0" TotalMilesFlown="5456">
    <Departure Airport="LAX" City="LAX" Country="US" State="CA" Terminal="7" Time="17:30:00-08:00"/>
    <Arrival Airport="LHR" City="LON" Country="GB" DateAdjustment="1" Terminal="2" Time="12:00:00Z"/>
    <Carrier Marketing="UA" MarketingFlightNumber="923" Operating="UA" OperatingFlightNumber="923">
      <Equipment Code="789" TypeForFirstLeg="W" TypeForLastLeg="W"/>
    </Carrier>
  </ScheduleDesc>
  <!--Другие рейсы-->
  <TaxDesc Amount="13505" Code="GB" Country="GB" Currency="RUB" Description="AIR PASSENGER DUTY APD" ID="1" PublishedAmount="185.00" PublishedCurrency="GBP" Station="LHR"/>
  <TaxDesc Amount="1164" Code="TS" Country="TH" Currency="RUB" Description="PASSENGER SERVICE CHARGE" ID="2" PublishedAmount="700" PublishedCurrency="THB" Station="BKK"/>
  <TaxDesc Amount="964" Code="QA" Country="QA" Currency="RUB" Description="AIRPORT FEE INTERNATIONAL" ID="3" PublishedAmount="60.00" PublishedCurrency="QAR" Station="DOH"/>
  <TaxDesc Amount="666" Code="YRI" Currency="RUB" Description="SERVICE FEE - CARRIER-IMPOSED MISC" ID="4" PublishedAmount="11.00" PublishedCurrency="EUR" Station="SYD"/>
  <TaxDesc Amount="6132" Code="GB" Country="GB" Currency="RUB" Description="AIR PASSENGER DUTY APD" ID="5" PublishedAmount="84.00" PublishedCurrency="GBP" Station="LCY"/>
  <!--Другие таксы-->
  <TaxSummaryDesc Amount="2828" Code="WY" Country="AU" Currency="RUB" Description="PASSENGER SERVICES CHARGE DEPARTURE INTERNATIONAL" ID="1" PublishedAmount="23.46" PublishedCurrency="AUD" Station="MEL"/>
  <TaxSummaryDesc Amount="1505" Code="WG" Country="AU" Currency="RUB" Description="SAFETY AND SECURITY CHARGE DEPARTURE" ID="2" PublishedAmount="6.50" PublishedCurrency="AUD" Station="SYD"/>
  <TaxSummaryDesc Amount="13505" Code="GB" Country="GB" Currency="RUB" Description="AIR PASSENGER DUTY APD" ID="3" PublishedAmount="185.00" PublishedCurrency="GBP" Station="LHR"/>
  <TaxSummaryDesc Amount="1164" Code="TS" Country="TH" Currency="RUB" Description="PASSENGER SERVICE CHARGE" ID="4" PublishedAmount="700" PublishedCurrency="THB" Station="BKK"/>
  <TaxSummaryDesc Amount="19188" Code="YQF" Currency="RUB" Description="SERVICE FEE - CARRIER-IMPOSED FUEL" ID="5" PublishedAmount="221.00" PublishedCurrency="AUD" Station="SYD"/>
  <!--Другие таксы-->
  <OBFeeDesc Amount="0" Currency="RUB" ID="1"/>
  <BrandFeatureDesc Application="F" CommercialName="PRIORITY IMMIGRATION" ID="1" ServiceGroup="TS" ServiceType="T" SubCode="0LW" Vendor="ATP"/>
  <BrandFeatureDesc Application="C" CommercialName="PREFERRED SEAT SELECTION" ID="2" ServiceGroup="BF" ServiceType="Z" SubCode="VS6" Vendor="ATP"/>
  <BrandFeatureDesc Application="F" CommercialName="75 PERCENT MILES EARNED" ID="3" ServiceGroup="BF" ServiceType="Z" SubCode="06C" Vendor="ATP"/>
  <BrandFeatureDesc Application="F" CommercialName="GOLF EQUIPMENT UP TO 15 KG" ID="4" ServiceGroup="BG" ServiceType="C" SubCode="0D4" Vendor="ATP"/>
  <BrandFeatureDesc Application="C" CommercialName="AUH BUSINESS CLASS LOUNGE" ID="5" ServiceGroup="LG" ServiceType="F" SubCode="0AG" Vendor="ATP"/>
  <!--Другие услуги-->
  <FareComponentDesc ApplicablePricingCategories="2 3 4 5 7 8 9 10 12 15 16 18 19 23" CabinCode="C" Direction="EH" Directionality="TO" FareAmount="3730.38" FareBasisCode="DXAC4AUCH" FareCurrency="AUD" FarePassengerType="CNN" FareRule="AUGD" FareTariff="4" FareType="BAP" FareTypeBitmap="01" GoverningCarrier="EY" ID="1" NotValidAfter="2022-12-08" NotValidBefore="2022-12-08" PublishedFareAmount="9909.00" VendorCode="ATP">
    <Segment>
      <Surcharge Amount="100.00" Currency="NUC" Description="MISCELLANEOUS/OTHER" Type="Q"/>
    </Segment>
    <Segment/>
    <Brand BrandName="BUSINESS CHOICE" Code="JC" ProgramCode="CFFEY" ProgramDescription="17AUD BP30" ProgramID="125938" ProgramSystemCode="M"/>
  </FareComponentDesc>
  <FareComponentDesc ApplicablePricingCategories="1 10 11 14 15 19 23 25 35" CabinCode="Y" Direction="EH" Directionality="TO" FareAmount="571.47" FareBasisCode="W33AURL1PO/CH25" FareCurrency="AUD" FarePassengerType="CNN" FareRule="AUPO" FareTariff="901" FareType="XEX" FareTypeBitmap="0F" GoverningCarrier="SQ" ID="2" NegotiatedFare="true" NotValidAfter="2023-12-01" PrivateFare="true" PublishedFareAmount="1518.00" TicketDesignator="CH25" VendorCode="ATP">
    <Segment/>
    <Segment/>
    <Brand BrandName="ECONOMY STANDARD" Code="YCLSTD" ProgramCode="CFFSQ" ProgramDescription="SYSTEMWIDE" ProgramID="138323" ProgramSystemCode="L"/>
  </FareComponentDesc>
  <FareComponentDesc ApplicablePricingCategories="1 2 3 4 5 6 7 8 9 10 11 12 14 16 18 19 23" CabinCode="Y" Direction="AP" Directionality="FROM" FareAmount="1257.85" FareBasisCode="YS00AENW/CH" FareCurrency="AUD" FarePassengerType="CNN" FareRule="E9NN" FareTariff="307" FareType="EU" FareTypeBitmap="01" GoverningCarrier="VS" ID="3" NotValidAfter="2023-12-01" PublishedFareAmount="3342.00" TicketDesignator="CH" VendorCode="ATP">
    <Segment/>
    <Segment Stopover="true"/>
    <Brand BrandName="ECONOMY CLASSIC FULLY FLEX" Code="YFULLFLEX" ProgramCode="CFFVS" ProgramDescription="EX ROW DEFAULT" ProgramID="136131" ProgramSystemCode="X"/>
  </FareComponentDesc>
  <FareComponentDesc ApplicablePricingCategories="4 5 7 8 9 10 15 16 18 19" CabinCode="S" Direction="TS" Directionality="FROM" FareAmount="546.62" FareBasisCode="RNN0NPCE/CH25" FareCurrency="AUD" FarePassengerType="CNN" FareRule="2291" FareTariff="44" FareType="ZEX" FareTypeBitmap="01" GoverningCarrier="JL" ID="4" NotValidAfter="2023-12-01" PublishedFareAmount="1452.00" TicketDesignator="CH25" VendorCode="ATP">
    <Segment/>
    <Segment Stopover="true"/>
  </FareComponentDesc>
  <FareComponentDesc ApplicablePricingCategories="4 5 7 8 9 10 15 16 18 19" CabinCode="Y" Direction="TS" Directionality="TO" FareAmount="28.31" FareBasisCode="SNN0NPCE/IN90" FareCurrency="AUD" FarePassengerType="INF" FareRule="2291" FareTariff="44" FareType="XEX" FareTypeBitmap="01" GoverningCarrier="JL" ID="5" NotValidAfter="2023-12-01" PublishedFareAmount="76.00" TicketDesignator="IN90" VendorCode="ATP">
    <Segment/>
    <Segment/>
  </FareComponentDesc>
  <!--Другие компоненты тарифов-->
  <ValidatingCarrierDesc ID="1" NewVcxProcess="true" SettlementMethod="BSP">
    <Default Code="HR"/>
  </ValidatingCarrierDesc>
  <ValidatingCarrierDesc ID="2" NewVcxProcess="true" SettlementMethod="TCH">
    <Default Code="EK"/>
  </ValidatingCarrierDesc>
  <ValidatingCarrierDesc ID="3" NewVcxProcess="true" SettlementMethod="BSP">
    <Default Code="QR"/>
  </ValidatingCarrierDesc>
  <ValidatingCarrierDesc ID="4" NewVcxProcess="true" SettlementMethod="BSP">
    <Default Code="UA"/>
  </ValidatingCarrierDesc>
  <ValidatingCarrierDesc ID="5" NewVcxProcess="true" SettlementMethod="BSP">
    <Default Code="AF"/>
  </ValidatingCarrierDesc>
  <!--Другие валидирующие перевозчики-->
  <BaggageAllowanceDesc ID="1" Unit="kg" Weight="30"/>
  <BaggageAllowanceDesc Description1="UP TO 50 POUNDS/23 KILOGRAMS" Description2="UP TO 45 LINEAR INCHES/115 LINEAR CENTIMETERS" ID="2" Pieces="1"/>
  <BaggageAllowanceDesc ID="3" Unit="kg" Weight="40"/>
  <BaggageAllowanceDesc Description1="UP TO 50 POUNDS/23 KILOGRAMS" Description2="UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS" ID="4" Pieces="1"/>
  <BaggageAllowanceDesc Description1="UP TO 34 LINEAR INCHES/85 LINEAR CENTIMETERS" ID="5" Pieces="1"/>
  <!--Другие нормы провоза багажа-->
  <LegDesc ElapsedTime="2170" ID="1">
    <Schedule Ref="42"/>
    <Schedule DepartureDateAdjustment="1" Ref="10"/>
  </LegDesc>
  <LegDesc ElapsedTime="2035" ID="2">
    <Schedule Ref="115"/>
    <Schedule Ref="117"/>
  </LegDesc>
  <LegDesc ElapsedTime="2675" ID="3">
    <Schedule Ref="34"/>
    <Schedule DepartureDateAdjustment="1" Ref="7"/>
  </LegDesc>
  <LegDesc ElapsedTime="1355" ID="4">
    <Schedule Ref="92"/>
    <Schedule DepartureDateAdjustment="1" Ref="142"/>
  </LegDesc>
  <LegDesc ElapsedTime="1455" ID="5">
    <Schedule Ref="116"/>
    <Schedule Ref="118"/>
  </LegDesc>
  <!--Другие плечи-->
  <ItineraryGroup>
    <GroupDescription>
      <LegDescription ArrivalLocation="LGW" DepartureDate="2022-12-01" DepartureLocation="SYD"/>
      <LegDescription ArrivalLocation="SYD" DepartureDate="2022-12-08" DepartureLocation="LHR"/>
    </GroupDescription>
    <Itinerary ID="1" PricingSource="ADVJR1">
      <Leg Ref="55"/>
      <Leg Ref="33"/>
      <PricingInformation BrandsOnAnyMarket="true" PricingSubsource="MIP">
        <Fare ETicketable="true" GoverningCarriers="QR QR" VITA="true" ValidatingCarrierCode="QR">
          <PassengerInfo NonRefundable="false" PassengerNumber="2" PassengerType="ADT">
            <FareComponent Ref="123">
              <Segment BookingCode="V" CabinCode="Y" MealCode="M" SeatsAvailable="9"/>
              <Segment AvailabilityBreak="true" BookingCode="V" CabinCode="Y" MealCode="M" SeatsAvailable="9"/>
              <BrandFeature Ref="123"/>
              <BrandFeature Ref="108"/>
              <BrandFeature Ref="98"/>
              <BrandFeature Ref="191"/>
              <BrandFeature Ref="137"/>
              <BrandFeature Ref="14"/>
              <BrandFeature Ref="138"/>
              <BrandFeature Ref="182"/>
              <BrandFeature Ref="83"/>
              <BrandFeature Ref="89"/>
              <BrandFeature Ref="201"/>
              <BrandFeature Ref="8"/>
              <BrandFeature Ref="114"/>
              <BrandFeature Ref="176"/>
              <BrandFeature Ref="172"/>
              <BrandFeature Ref="192"/>
              <BrandFeature Ref="150"/>
              <BrandFeature Ref="156"/>
              <BrandFeature Ref="100"/>
              <BrandFeature Ref="166"/>
            </FareComponent>
            <FareComponent Ref="209">
              <Segment BookingCode="S" CabinCode="Y" MealCode="M" SeatsAvailable="9"/>
              <Segment AvailabilityBreak="true" BookingCode="S" CabinCode="Y" MealCode="M" SeatsAvailable="9"/>
              <BrandFeature Ref="123"/>
              <BrandFeature Ref="108"/>
              <BrandFeature Ref="98"/>
              <BrandFeature Ref="191"/>
              <BrandFeature Ref="137"/>
              <BrandFeature Ref="14"/>
              <BrandFeature Ref="138"/>
              <BrandFeature Ref="182"/>
              <BrandFeature Ref="83"/>
              <BrandFeature Ref="89"/>
              <BrandFeature Ref="201"/>
              <BrandFeature Ref="8"/>
              <BrandFeature Ref="114"/>
              <BrandFeature Ref="176"/>
              <BrandFeature Ref="172"/>
              <BrandFeature Ref="192"/>
              <BrandFeature Ref="150"/>
              <BrandFeature Ref="156"/>
              <BrandFeature Ref="100"/>
              <BrandFeature Ref="166"/>
            </FareComponent>
            <Tax Ref="19"/>
            <Tax Ref="13"/>
            <Tax Ref="118"/>
            <Tax Ref="118"/>
            <Tax Ref="114"/>
            <Tax Ref="114"/>
            <Tax Ref="128"/>
            <Tax Ref="116"/>
            <Tax Ref="81"/>
            <Tax Ref="88"/>
            <Tax Ref="24"/>
            <Tax Ref="134"/>
            <Tax Ref="134"/>
            <Tax Ref="122"/>
            <Tax Ref="101"/>
            <Tax Ref="58"/>
            <Tax Ref="3"/>
            <Tax Ref="3"/>
            <Tax Ref="106"/>
            <Tax Ref="106"/>
            <TaxSummary Ref="95"/>
            <TaxSummary Ref="36"/>
            <TaxSummary Ref="91"/>
            <TaxSummary Ref="56"/>
            <TaxSummary Ref="24"/>
            <TaxSummary Ref="90"/>
            <TaxSummary Ref="66"/>
            <TaxSummary Ref="63"/>
            <TaxSummary Ref="18"/>
            <TaxSummary Ref="25"/>
            <OBFee Ref="1"/>
            <CurrencyConversion ExchangeRateUsed="41.5" From="AUD" To="RUB"/>
            <PassengerTotalFare BaseFareAmount="1394.00" BaseFareCurrency="AUD" CommissionAmount="0" CommissionPercentage="0" ConstructionAmount="1049.04" ConstructionCurrency="NUC" Currency="RUB" EquivalentAmount="57855" EquivalentCurrency="RUB" ExchangeRateOne="1.32814600" TotalFare="104708" TotalTaxes="46853"/>
            <BaggageInformation AirlineCode="QR" ProvisionType="A">
              <Segment ID="0"/>
              <Segment ID="1"/>
              <Allowance Ref="1"/>
            </BaggageInformation>
            <BaggageInformation AirlineCode="QR" ProvisionType="A">
              <Segment ID="2"/>
              <Segment ID="3"/>
              <Allowance Ref="1"/>
            </BaggageInformation>
            <BaggageInformation AirlineCode="QR" ProvisionType="B">
              <Segment ID="0"/>
              <Allowance Ref="14"/>
            </BaggageInformation>
            <BaggageInformation AirlineCode="QR" ProvisionType="B">
              <Segment ID="1"/>
              <Allowance Ref="14"/>
            </BaggageInformation>
            <BaggageInformation AirlineCode="QR" ProvisionType="B">
              <Segment ID="2"/>
              <Allowance Ref="14"/>
            </BaggageInformation>
            <BaggageInformation AirlineCode="QR" ProvisionType="B">
              <Segment ID="3"/>
              <Allowance Ref="14"/>
            </BaggageInformation>
            <PenaltiesInfo>
              <Penalty Amount="26035" Applicability="Before" Changeable="true" Currency="RUB" Type="Exchange"/>
              <Penalty Amount="26035" Applicability="After" Changeable="true" Currency="RUB" Type="Exchange"/>
              <Penalty Amount="29545" Applicability="Before" Currency="RUB" Refundable="true" Type="Refund"/>
              <Penalty Amount="29545" Applicability="After" Currency="RUB" Refundable="true" Type="Refund"/>
            </PenaltiesInfo>
            <SeatSelection Type="C">
              <Segment ID="0"/>
              <Segment ID="1"/>
              <Segment ID="2"/>
              <Segment ID="3"/>
            </SeatSelection>
          </PassengerInfo>
          <PassengerInfo NonRefundable="false" PassengerNumber="1" PassengerType="CNN">
            <FareComponent Ref="202">
              <Segment BookingCode="V" CabinCode="Y" MealCode="M" SeatsAvailable="9"/>
              <Segment AvailabilityBreak="true" BookingCode="V" CabinCode="Y" MealCode="M" SeatsAvailable="9"/>
              <BrandFeature Ref="123"/>
              <BrandFeature Ref="108"/>
              <BrandFeature Ref="98"/>
              <BrandFeature Ref="191"/>
              <BrandFeature Ref="137"/>
              <BrandFeature Ref="14"/>
              <BrandFeature Ref="138"/>
              <BrandFeature Ref="182"/>
              <BrandFeature Ref="83"/>
              <BrandFeature Ref="89"/>
              <BrandFeature Ref="201"/>
              <BrandFeature Ref="8"/>
              <BrandFeature Ref="114"/>
              <BrandFeature Ref="176"/>
              <BrandFeature Ref="172"/>
              <BrandFeature Ref="192"/>
              <BrandFeature Ref="150"/>
              <BrandFeature Ref="156"/>
              <BrandFeature Ref="100"/>
              <BrandFeature Ref="166"/>
            </FareComponent>
            <FareComponent Ref="138">
              <Segment BookingCode="S" CabinCode="Y" MealCode="M" SeatsAvailable="9"/>
              <Segment AvailabilityBreak="true" BookingCode="S" CabinCode="Y" MealCode="M" SeatsAvailable="9"/>
              <BrandFeature Ref="123"/>
              <BrandFeature Ref="108"/>
              <BrandFeature Ref="98"/>
              <BrandFeature Ref="191"/>
              <BrandFeature Ref="137"/>
              <BrandFeature Ref="14"/>
              <BrandFeature Ref="138"/>
              <BrandFeature Ref="182"/>
              <BrandFeature Ref="83"/>
              <BrandFeature Ref="89"/>
              <BrandFeature Ref="201"/>
              <BrandFeature Ref="8"/>
              <BrandFeature Ref="114"/>
              <BrandFeature Ref="176"/>
              <BrandFeature Ref="172"/>
              <BrandFeature Ref="192"/>
              <BrandFeature Ref="150"/>
              <BrandFeature Ref="156"/>
              <BrandFeature Ref="100"/>
              <BrandFeature Ref="166"/>
            </FareComponent>
            <Tax Ref="19"/>
            <Tax Ref="13"/>
            <Tax Ref="118"/>
            <Tax Ref="118"/>
            <Tax Ref="114"/>
            <Tax Ref="114"/>
            <Tax Ref="116"/>
            <Tax Ref="81"/>
            <Tax Ref="24"/>
            <Tax Ref="134"/>
            <Tax Ref="134"/>
            <Tax Ref="122"/>
            <Tax Ref="101"/>
            <Tax Ref="58"/>
            <Tax Ref="3"/>
            <Tax Ref="3"/>
            <Tax Ref="106"/>
            <Tax Ref="106"/>
            <TaxSummary Ref="95"/>
            <TaxSummary Ref="36"/>
            <TaxSummary Ref="56"/>
            <TaxSummary Ref="24"/>
            <TaxSummary Ref="90"/>
            <TaxSummary Ref="66"/>
            <TaxSummary Ref="18"/>
            <TaxSummary Ref="25"/>
            <OBFee Ref="1"/>
            <CurrencyConversion ExchangeRateUsed="41.5" From="AUD" To="RUB"/>
            <PassengerTotalFare BaseFareAmount="911.00" BaseFareCurrency="AUD" CommissionAmount="0" CommissionPercentage="0" ConstructionAmount="685.37" ConstructionCurrency="NUC" Currency="RUB" EquivalentAmount="37810" EquivalentCurrency="RUB" ExchangeRateOne="1.32814600" TotalFare="76041" TotalTaxes="38231"/>
            <BaggageInformation AirlineCode="QR" ProvisionType="A">
              <Segment ID="0"/>
              <Segment ID="1"/>
              <Allowance Ref="1"/>
            </BaggageInformation>
            <BaggageInformation AirlineCode="QR" ProvisionType="A">
              <Segment ID="2"/>
              <Segment ID="3"/>
              <Allowance Ref="1"/>
            </BaggageInformation>
            <BaggageInformation AirlineCode="QR" ProvisionType="B">
              <Segment ID="0"/>
              <Allowance Ref="14"/>
            </BaggageInformation>
            <BaggageInformation AirlineCode="QR" ProvisionType="B">
              <Segment ID="1"/>
              <Allowance Ref="14"/>
            </BaggageInformation>
            <BaggageInformation AirlineCode="QR" ProvisionType="B">
              <Segment ID="2"/>
              <Allowance Ref="14"/>
            </BaggageInformation>
            <BaggageInformation AirlineCode="QR" ProvisionType="B">
              <Segment ID="3"/>
              <Allowance Ref="14"/>
            </BaggageInformation>
            <PenaltiesInfo>
              <Penalty Amount="26035" Applicability="Before" Changeable="true" Currency="RUB" Type="Exchange"/>
              <Penalty Amount="26035" Applicability="After" Changeable="true" Currency="RUB" Type="Exchange"/>
              <Penalty Amount="29545" Applicability="Before" Currency="RUB" Refundable="true" Type="Refund"/>
              <Penalty Amount="29545" Applicability="After" Currency="RUB" Refundable="true" Type="Refund"/>
            </PenaltiesInfo>
            <SeatSelection Type="C">
              <Segment ID="0"/>
              <Segment ID="1"/>
              <Segment ID="2"/>
              <Segment ID="3"/>
            </SeatSelection>
          </PassengerInfo>
          <PassengerInfo NonRefundable="false" PassengerNumber="1" PassengerType="INF">
            <FareComponent Ref="308">
              <Segment BookingCode="V" CabinCode="Y" MealCode="M" SeatsAvailable="9"/>
              <Segment AvailabilityBreak="true" BookingCode="V" CabinCode="Y" MealCode="M" SeatsAvailable="9"/>
              <BrandFeature Ref="123"/>
              <BrandFeature Ref="108"/>
              <BrandFeature Ref="98"/>
              <BrandFeature Ref="191"/>
              <BrandFeature Ref="137"/>
              <BrandFeature Ref="14"/>
              <BrandFeature Ref="138"/>
              <BrandFeature Ref="182"/>
              <BrandFeature Ref="83"/>
              <BrandFeature Ref="89"/>
              <BrandFeature Ref="201"/>
              <BrandFeature Ref="8"/>
              <BrandFeature Ref="114"/>
              <BrandFeature Ref="176"/>
              <BrandFeature Ref="172"/>
              <BrandFeature Ref="192"/>
              <BrandFeature Ref="150"/>
              <BrandFeature Ref="156"/>
              <BrandFeature Ref="100"/>
              <BrandFeature Ref="166"/>
            </FareComponent>
            <FareComponent Ref="183">
              <Segment BookingCode="S" CabinCode="Y" MealCode="M" SeatsAvailable="9"/>
              <Segment AvailabilityBreak="true" BookingCode="S" CabinCode="Y" MealCode="M" SeatsAvailable="9"/>
              <BrandFeature Ref="123"/>
              <BrandFeature Ref="108"/>
              <BrandFeature Ref="98"/>
              <BrandFeature Ref="191"/>
              <BrandFeature Ref="137"/>
              <BrandFeature Ref="14"/>
              <BrandFeature Ref="138"/>
              <BrandFeature Ref="182"/>
              <BrandFeature Ref="83"/>
              <BrandFeature Ref="89"/>
              <BrandFeature Ref="201"/>
              <BrandFeature Ref="8"/>
              <BrandFeature Ref="114"/>
              <BrandFeature Ref="176"/>
              <BrandFeature Ref="172"/>
              <BrandFeature Ref="192"/>
              <BrandFeature Ref="150"/>
              <BrandFeature Ref="156"/>
              <BrandFeature Ref="100"/>
              <BrandFeature Ref="166"/>
            </FareComponent>
            <Tax Ref="107"/>
            <Tax Ref="39"/>
            <Tax Ref="118"/>
            <Tax Ref="118"/>
            <Tax Ref="114"/>
            <Tax Ref="114"/>
            <Tax Ref="24"/>
            <TaxSummary Ref="42"/>
            <TaxSummary Ref="36"/>
            <TaxSummary Ref="18"/>
            <OBFee Ref="1"/>
            <CurrencyConversion ExchangeRateUsed="41.5" From="AUD" To="RUB"/>
            <PassengerTotalFare BaseFareAmount="221.00" BaseFareCurrency="AUD" CommissionAmount="0" CommissionPercentage="0" ConstructionAmount="165.84" ConstructionCurrency="NUC" Currency="RUB" EquivalentAmount="9175" EquivalentCurrency="RUB" ExchangeRateOne="1.32814600" TotalFare="18184" TotalTaxes="9009"/>
            <BaggageInformation AirlineCode="QR" ProvisionType="A">
              <Segment ID="0"/>
              <Segment ID="1"/>
              <Allowance Ref="69"/>
            </BaggageInformation>
            <BaggageInformation AirlineCode="QR" ProvisionType="A">
              <Segment ID="2"/>
              <Segment ID="3"/>
              <Allowance Ref="69"/>
            </BaggageInformation>
            <PenaltiesInfo>
              <Penalty Amount="0" Applicability="Before" Changeable="true" Currency="RUB" Type="Exchange"/>
              <Penalty Amount="0" Applicability="After" Changeable="true" Currency="RUB" Type="Exchange"/>
              <Penalty Amount="0" Applicability="Before" Currency="RUB" Refundable="true" Type="Refund"/>
              <Penalty Amount="0" Applicability="After" Currency="RUB" Refundable="true" Type="Refund"/>
            </PenaltiesInfo>
            <SeatSelection Type="C">
              <Segment ID="0"/>
              <Segment ID="1"/>
              <Segment ID="2"/>
              <Segment ID="3"/>
            </SeatSelection>
          </PassengerInfo>
          <AncillaryFeeGroup Message="AIR EXTRAS NOT APPLICABLE OR ARE UNKNOWN FOR THIS ITINERARY"/>
          <TotalFare BaseFareAmount="3920.00" BaseFareCurrency="AUD" ConstructionAmount="2949.29" ConstructionCurrency="NUC" Currency="RUB" EquivalentAmount="162695" EquivalentCurrency="RUB" TotalPrice="303641" TotalTaxes="140946"/>
          <ValidatingCarrier Ref="3"/>
        </Fare>
      </PricingInformation>
      <PricingInformation BrandsOnAnyMarket="true" FlexibleFare="1" PricingSubsource="MIP">
        <Fare ETicketable="true" GoverningCarriers="QR QR" VITA="true" ValidatingCarrierCode="QR">
          <PassengerInfo NonRefundable="false" PassengerNumber="2" PassengerType="ADT">
            <FareComponent Ref="123">
              <Segment BookingCode="V" CabinCode="Y" MealCode="M" SeatsAvailable="9"/>
              <Segment AvailabilityBreak="true" BookingCode="V" CabinCode="Y" MealCode="M" SeatsAvailable="9"/>
              <BrandFeature Ref="123"/>
              <BrandFeature Ref="108"/>
              <BrandFeature Ref="98"/>
              <BrandFeature Ref="191"/>
              <BrandFeature Ref="137"/>
              <BrandFeature Ref="14"/>
              <BrandFeature Ref="138"/>
              <BrandFeature Ref="182"/>
              <BrandFeature Ref="83"/>
              <BrandFeature Ref="89"/>
              <BrandFeature Ref="201"/>
              <BrandFeature Ref="8"/>
              <BrandFeature Ref="114"/>
              <BrandFeature Ref="176"/>
              <BrandFeature Ref="172"/>
              <BrandFeature Ref="192"/>
              <BrandFeature Ref="150"/>
              <BrandFeature Ref="156"/>
              <BrandFeature Ref="100"/>
              <BrandFeature Ref="166"/>
            </FareComponent>
            <FareComponent Ref="209">
              <Segment BookingCode="S" CabinCode="Y" MealCode="M" SeatsAvailable="9"/>
              <Segment AvailabilityBreak="true" BookingCode="S" CabinCode="Y" MealCode="M" SeatsAvailable="9"/>
              <BrandFeature Ref="123"/>
              <BrandFeature Ref="108"/>
              <BrandFeature Ref="98"/>
              <BrandFeature Ref="191"/>
              <BrandFeature Ref="137"/>
              <BrandFeature Ref="14"/>
              <BrandFeature Ref="138"/>
              <BrandFeature Ref="182"/>
              <BrandFeature Ref="83"/>
              <BrandFeature Ref="89"/>
              <BrandFeature Ref="201"/>
              <BrandFeature Ref="8"/>
              <BrandFeature Ref="114"/>
              <BrandFeature Ref="176"/>
              <BrandFeature Ref="172"/>
              <BrandFeature Ref="192"/>
              <BrandFeature Ref="150"/>
              <BrandFeature Ref="156"/>
              <BrandFeature Ref="100"/>
              <BrandFeature Ref="166"/>
            </FareComponent>
            <Tax Ref="19"/>
            <Tax Ref="13"/>
            <Tax Ref="118"/>
            <Tax Ref="118"/>
            <Tax Ref="114"/>
            <Tax Ref="114"/>
            <Tax Ref="128"/>
            <Tax Ref="116"/>
            <Tax Ref="81"/>
            <Tax Ref="88"/>
            <Tax Ref="24"/>
            <Tax Ref="134"/>
            <Tax Ref="134"/>
            <Tax Ref="122"/>
            <Tax Ref="101"/>
            <Tax Ref="58"/>
            <Tax Ref="3"/>
            <Tax Ref="3"/>
            <Tax Ref="106"/>
            <Tax Ref="106"/>
            <TaxSummary Ref="95"/>
            <TaxSummary Ref="36"/>
            <TaxSummary Ref="91"/>
            <TaxSummary Ref="56"/>
            <TaxSummary Ref="24"/>
            <TaxSummary Ref="90"/>
            <TaxSummary Ref="66"/>
            <TaxSummary Ref="63"/>
            <TaxSummary Ref="18"/>
            <TaxSummary Ref="25"/>
            <OBFee Ref="1"/>
            <CurrencyConversion ExchangeRateUsed="41.5" From="AUD" To="RUB"/>
            <PassengerTotalFare BaseFareAmount="1394.00" BaseFareCurrency="AUD" CommissionAmount="0" CommissionPercentage="0" ConstructionAmount="1049.04" ConstructionCurrency="NUC" Currency="RUB" EquivalentAmount="57855" EquivalentCurrency="RUB" ExchangeRateOne="1.32814600" TotalFare="104708" TotalTaxes="46853"/>
            <BaggageInformation AirlineCode="QR" ProvisionType="A">
              <Segment ID="0"/>
              <Segment ID="1"/>
              <Allowance Ref="1"/>
            </BaggageInformation>
            <BaggageInformation AirlineCode="QR" ProvisionType="A">
              <Segment ID="2"/>
              <Segment ID="3"/>
              <Allowance Ref="1"/>
            </BaggageInformation>
            <BaggageInformation AirlineCode="QR" ProvisionType="B">
              <Segment ID="0"/>
              <Allowance Ref="14"/>
            </BaggageInformation>
            <BaggageInformation AirlineCode="QR" ProvisionType="B">
              <Segment ID="1"/>
              <Allowance Ref="14"/>
            </BaggageInformation>
            <BaggageInformation AirlineCode="QR" ProvisionType="B">
              <Segment ID="2"/>
              <Allowance Ref="14"/>
            </BaggageInformation>
            <BaggageInformation AirlineCode="QR" ProvisionType="B">
              <Segment ID="3"/>
              <Allowance Ref="14"/>
            </BaggageInformation>
            <PenaltiesInfo>
              <Penalty Amount="26035" Applicability="Before" Changeable="true" Currency="RUB" Type="Exchange"/>
              <Penalty Amount="26035" Applicability="After" Changeable="true" Currency="RUB" Type="Exchange"/>
              <Penalty Amount="29545" Applicability="Before" Currency="RUB" Refundable="true" Type="Refund"/>
              <Penalty Amount="29545" Applicability="After" Currency="RUB" Refundable="true" Type="Refund"/>
            </PenaltiesInfo>
            <SeatSelection Type="C">
              <Segment ID="0"/>
              <Segment ID="1"/>
              <Segment ID="2"/>
              <Segment ID="3"/>
            </SeatSelection>
          </PassengerInfo>
          <PassengerInfo NonRefundable="false" PassengerNumber="1" PassengerType="CNN">
            <FareComponent Ref="202">
              <Segment BookingCode="V" CabinCode="Y" MealCode="M" SeatsAvailable="9"/>
              <Segment AvailabilityBreak="true" BookingCode="V" CabinCode="Y" MealCode="M" SeatsAvailable="9"/>
              <BrandFeature Ref="123"/>
              <BrandFeature Ref="108"/>
              <BrandFeature Ref="98"/>
              <BrandFeature Ref="191"/>
              <BrandFeature Ref="137"/>
              <BrandFeature Ref="14"/>
              <BrandFeature Ref="138"/>
              <BrandFeature Ref="182"/>
              <BrandFeature Ref="83"/>
              <BrandFeature Ref="89"/>
              <BrandFeature Ref="201"/>
              <BrandFeature Ref="8"/>
              <BrandFeature Ref="114"/>
              <BrandFeature Ref="176"/>
              <BrandFeature Ref="172"/>
              <BrandFeature Ref="192"/>
              <BrandFeature Ref="150"/>
              <BrandFeature Ref="156"/>
              <BrandFeature Ref="100"/>
              <BrandFeature Ref="166"/>
            </FareComponent>
            <FareComponent Ref="138">
              <Segment BookingCode="S" CabinCode="Y" MealCode="M" SeatsAvailable="9"/>
              <Segment AvailabilityBreak="true" BookingCode="S" CabinCode="Y" MealCode="M" SeatsAvailable="9"/>
              <BrandFeature Ref="123"/>
              <BrandFeature Ref="108"/>
              <BrandFeature Ref="98"/>
              <BrandFeature Ref="191"/>
              <BrandFeature Ref="137"/>
              <BrandFeature Ref="14"/>
              <BrandFeature Ref="138"/>
              <BrandFeature Ref="182"/>
              <BrandFeature Ref="83"/>
              <BrandFeature Ref="89"/>
              <BrandFeature Ref="201"/>
              <BrandFeature Ref="8"/>
              <BrandFeature Ref="114"/>
              <BrandFeature Ref="176"/>
              <BrandFeature Ref="172"/>
              <BrandFeature Ref="192"/>
              <BrandFeature Ref="150"/>
              <BrandFeature Ref="156"/>
              <BrandFeature Ref="100"/>
              <BrandFeature Ref="166"/>
            </FareComponent>
            <Tax Ref="19"/>
            <Tax Ref="13"/>
            <Tax Ref="118"/>
            <Tax Ref="118"/>
            <Tax Ref="114"/>
            <Tax Ref="114"/>
            <Tax Ref="116"/>
            <Tax Ref="81"/>
            <Tax Ref="24"/>
            <Tax Ref="134"/>
            <Tax Ref="134"/>
            <Tax Ref="122"/>
            <Tax Ref="101"/>
            <Tax Ref="58"/>
            <Tax Ref="3"/>
            <Tax Ref="3"/>
            <Tax Ref="106"/>
            <Tax Ref="106"/>
            <TaxSummary Ref="95"/>
            <TaxSummary Ref="36"/>
            <TaxSummary Ref="56"/>
            <TaxSummary Ref="24"/>
            <TaxSummary Ref="90"/>
            <TaxSummary Ref="66"/>
            <TaxSummary Ref="18"/>
            <TaxSummary Ref="25"/>
            <OBFee Ref="1"/>
            <CurrencyConversion ExchangeRateUsed="41.5" From="AUD" To="RUB"/>
            <PassengerTotalFare BaseFareAmount="911.00" BaseFareCurrency="AUD" CommissionAmount="0" CommissionPercentage="0" ConstructionAmount="685.37" ConstructionCurrency="NUC" Currency="RUB" EquivalentAmount="37810" EquivalentCurrency="RUB" ExchangeRateOne="1.32814600" TotalFare="76041" TotalTaxes="38231"/>
            <BaggageInformation AirlineCode="QR" ProvisionType="A">
              <Segment ID="0"/>
              <Segment ID="1"/>
              <Allowance Ref="1"/>
            </BaggageInformation>
            <BaggageInformation AirlineCode="QR" ProvisionType="A">
              <Segment ID="2"/>
              <Segment ID="3"/>
              <Allowance Ref="1"/>
            </BaggageInformation>
            <BaggageInformation AirlineCode="QR" ProvisionType="B">
              <Segment ID="0"/>
              <Allowance Ref="14"/>
            </BaggageInformation>
            <BaggageInformation AirlineCode="QR" ProvisionType="B">
              <Segment ID="1"/>
              <Allowance Ref="14"/>
            </BaggageInformation>
            <BaggageInformation AirlineCode="QR" ProvisionType="B">
              <Segment ID="2"/>
              <Allowance Ref="14"/>
            </BaggageInformation>
            <BaggageInformation AirlineCode="QR" ProvisionType="B">
              <Segment ID="3"/>
              <Allowance Ref="14"/>
            </BaggageInformation>
            <PenaltiesInfo>
              <Penalty Amount="26035" Applicability="Before" Changeable="true" Currency="RUB" Type="Exchange"/>
              <Penalty Amount="26035" Applicability="After" Changeable="true" Currency="RUB" Type="Exchange"/>
              <Penalty Amount="29545" Applicability="Before" Currency="RUB" Refundable="true" Type="Refund"/>
              <Penalty Amount="29545" Applicability="After" Currency="RUB" Refundable="true" Type="Refund"/>
            </PenaltiesInfo>
            <SeatSelection Type="C">
              <Segment ID="0"/>
              <Segment ID="1"/>
              <Segment ID="2"/>
              <Segment ID="3"/>
            </SeatSelection>
          </PassengerInfo>
          <PassengerInfo NonRefundable="false" PassengerNumber="1" PassengerType="INF">
            <FareComponent Ref="308">
              <Segment BookingCode="V" CabinCode="Y" MealCode="M" SeatsAvailable="9"/>
              <Segment AvailabilityBreak="true" BookingCode="V" CabinCode="Y" MealCode="M" SeatsAvailable="9"/>
              <BrandFeature Ref="123"/>
              <BrandFeature Ref="108"/>
              <BrandFeature Ref="98"/>
              <BrandFeature Ref="191"/>
              <BrandFeature Ref="137"/>
              <BrandFeature Ref="14"/>
              <BrandFeature Ref="138"/>
              <BrandFeature Ref="182"/>
              <BrandFeature Ref="83"/>
              <BrandFeature Ref="89"/>
              <BrandFeature Ref="201"/>
              <BrandFeature Ref="8"/>
              <BrandFeature Ref="114"/>
              <BrandFeature Ref="176"/>
              <BrandFeature Ref="172"/>
              <BrandFeature Ref="192"/>
              <BrandFeature Ref="150"/>
              <BrandFeature Ref="156"/>
              <BrandFeature Ref="100"/>
              <BrandFeature Ref="166"/>
            </FareComponent>
            <FareComponent Ref="183">
              <Segment BookingCode="S" CabinCode="Y" MealCode="M" SeatsAvailable="9"/>
              <Segment AvailabilityBreak="true" BookingCode="S" CabinCode="Y" MealCode="M" SeatsAvailable="9"/>
              <BrandFeature Ref="123"/>
              <BrandFeature Ref="108"/>
              <BrandFeature Ref="98"/>
              <BrandFeature Ref="191"/>
              <BrandFeature Ref="137"/>
              <BrandFeature Ref="14"/>
              <BrandFeature Ref="138"/>
              <BrandFeature Ref="182"/>
              <BrandFeature Ref="83"/>
              <BrandFeature Ref="89"/>
              <BrandFeature Ref="201"/>
              <BrandFeature Ref="8"/>
              <BrandFeature Ref="114"/>
              <BrandFeature Ref="176"/>
              <BrandFeature Ref="172"/>
              <BrandFeature Ref="192"/>
              <BrandFeature Ref="150"/>
              <BrandFeature Ref="156"/>
              <BrandFeature Ref="100"/>
              <BrandFeature Ref="166"/>
            </FareComponent>
            <Tax Ref="107"/>
            <Tax Ref="39"/>
            <Tax Ref="118"/>
            <Tax Ref="118"/>
            <Tax Ref="114"/>
            <Tax Ref="114"/>
            <Tax Ref="24"/>
            <TaxSummary Ref="42"/>
            <TaxSummary Ref="36"/>
            <TaxSummary Ref="18"/>
            <OBFee Ref="1"/>
            <CurrencyConversion ExchangeRateUsed="41.5" From="AUD" To="RUB"/>
            <PassengerTotalFare BaseFareAmount="221.00" BaseFareCurrency="AUD" CommissionAmount="0" CommissionPercentage="0" ConstructionAmount="165.84" ConstructionCurrency="NUC" Currency="RUB" EquivalentAmount="9175" EquivalentCurrency="RUB" ExchangeRateOne="1.32814600" TotalFare="18184" TotalTaxes="9009"/>
            <BaggageInformation AirlineCode="QR" ProvisionType="A">
              <Segment ID="0"/>
              <Segment ID="1"/>
              <Allowance Ref="69"/>
            </BaggageInformation>
            <BaggageInformation AirlineCode="QR" ProvisionType="A">
              <Segment ID="2"/>
              <Segment ID="3"/>
              <Allowance Ref="69"/>
            </BaggageInformation>
            <PenaltiesInfo>
              <Penalty Amount="0" Applicability="Before" Changeable="true" Currency="RUB" Type="Exchange"/>
              <Penalty Amount="0" Applicability="After" Changeable="true" Currency="RUB" Type="Exchange"/>
              <Penalty Amount="0" Applicability="Before" Currency="RUB" Refundable="true" Type="Refund"/>
              <Penalty Amount="0" Applicability="After" Currency="RUB" Refundable="true" Type="Refund"/>
            </PenaltiesInfo>
            <SeatSelection Type="C">
              <Segment ID="0"/>
              <Segment ID="1"/>
              <Segment ID="2"/>
              <Segment ID="3"/>
            </SeatSelection>
          </PassengerInfo>
          <AncillaryFeeGroup Message="AIR EXTRAS NOT APPLICABLE OR ARE UNKNOWN FOR THIS ITINERARY"/>
          <TotalFare BaseFareAmount="3920.00" BaseFareCurrency="AUD" ConstructionAmount="2949.29" ConstructionCurrency="NUC" Currency="RUB" EquivalentAmount="162695" EquivalentCurrency="RUB" TotalPrice="303641" TotalTaxes="140946"/>
          <ValidatingCarrier Ref="3"/>
        </Fare>
      </PricingInformation>
      <PricingInformation BrandsOnAnyMarket="true" FlexibleFare="2" PricingSubsource="MIP">
        <Fare ETicketable="true" GoverningCarriers="QR QR" VITA="true" ValidatingCarrierCode="QR">
          <PassengerInfo NonRefundable="false" PassengerNumber="2" PassengerType="ADT">
            <FareComponent Ref="123">
              <Segment BookingCode="V" CabinCode="Y" MealCode="M" SeatsAvailable="9"/>
              <Segment AvailabilityBreak="true" BookingCode="V" CabinCode="Y" MealCode="M" SeatsAvailable="9"/>
              <BrandFeature Ref="123"/>
              <BrandFeature Ref="108"/>
              <BrandFeature Ref="98"/>
              <BrandFeature Ref="191"/>
              <BrandFeature Ref="137"/>
              <BrandFeature Ref="14"/>
              <BrandFeature Ref="138"/>
              <BrandFeature Ref="182"/>
              <BrandFeature Ref="83"/>
              <BrandFeature Ref="89"/>
              <BrandFeature Ref="201"/>
              <BrandFeature Ref="8"/>
              <BrandFeature Ref="114"/>
              <BrandFeature Ref="176"/>
              <BrandFeature Ref="172"/>
              <BrandFeature Ref="192"/>
              <BrandFeature Ref="150"/>
              <BrandFeature Ref="156"/>
              <BrandFeature Ref="100"/>
              <BrandFeature Ref="166"/>
            </FareComponent>
            <FareComponent Ref="209">
              <Segment BookingCode="S" CabinCode="Y" MealCode="M" SeatsAvailable="9"/>
              <Segment AvailabilityBreak="true" BookingCode="S" CabinCode="Y" MealCode="M" SeatsAvailable="9"/>
              <BrandFeature Ref="123"/>
              <BrandFeature Ref="108"/>
              <BrandFeature Ref="98"/>
              <BrandFeature Ref="191"/>
              <BrandFeature Ref="137"/>
              <BrandFeature Ref="14"/>
              <BrandFeature Ref="138"/>
              <BrandFeature Ref="182"/>
              <BrandFeature Ref="83"/>
              <BrandFeature Ref="89"/>
              <BrandFeature Ref="201"/>
              <BrandFeature Ref="8"/>
              <BrandFeature Ref="114"/>
              <BrandFeature Ref="176"/>
              <BrandFeature Ref="172"/>
              <BrandFeature Ref="192"/>
              <BrandFeature Ref="150"/>
              <BrandFeature Ref="156"/>
              <BrandFeature Ref="100"/>
              <BrandFeature Ref="166"/>
            </FareComponent>
            <Tax Ref="19"/>
            <Tax Ref="13"/>
            <Tax Ref="118"/>
            <Tax Ref="118"/>
            <Tax Ref="114"/>
            <Tax Ref="114"/>
            <Tax Ref="128"/>
            <Tax Ref="116"/>
            <Tax Ref="81"/>
            <Tax Ref="88"/>
            <Tax Ref="24"/>
            <Tax Ref="134"/>
            <Tax Ref="134"/>
            <Tax Ref="122"/>
            <Tax Ref="101"/>
            <Tax Ref="58"/>
            <Tax Ref="3"/>
            <Tax Ref="3"/>
            <Tax Ref="106"/>
            <Tax Ref="106"/>
            <TaxSummary Ref="95"/>
            <TaxSummary Ref="36"/>
            <TaxSummary Ref="91"/>
            <TaxSummary Ref="56"/>
            <TaxSummary Ref="24"/>
            <TaxSummary Ref="90"/>
            <TaxSummary Ref="66"/>
            <TaxSummary Ref="63"/>
            <TaxSummary Ref="18"/>
            <TaxSummary Ref="25"/>
            <OBFee Ref="1"/>
            <CurrencyConversion ExchangeRateUsed="41.5" From="AUD" To="RUB"/>
            <PassengerTotalFare BaseFareAmount="1394.00" BaseFareCurrency="AUD" CommissionAmount="0" CommissionPercentage="0" ConstructionAmount="1049.04" ConstructionCurrency="NUC" Currency="RUB" EquivalentAmount="57855" EquivalentCurrency="RUB" ExchangeRateOne="1.32814600" TotalFare="104708" TotalTaxes="46853"/>
            <BaggageInformation AirlineCode="QR" ProvisionType="A">
              <Segment ID="0"/>
              <Segment ID="1"/>
              <Allowance Ref="1"/>
            </BaggageInformation>
            <BaggageInformation AirlineCode="QR" ProvisionType="A">
              <Segment ID="2"/>
              <Segment ID="3"/>
              <Allowance Ref="1"/>
            </BaggageInformation>
            <BaggageInformation AirlineCode="QR" ProvisionType="B">
              <Segment ID="0"/>
              <Allowance Ref="14"/>
            </BaggageInformation>
            <BaggageInformation AirlineCode="QR" ProvisionType="B">
              <Segment ID="1"/>
              <Allowance Ref="14"/>
            </BaggageInformation>
            <BaggageInformation AirlineCode="QR" ProvisionType="B">
              <Segment ID="2"/>
              <Allowance Ref="14"/>
            </BaggageInformation>
            <BaggageInformation AirlineCode="QR" ProvisionType="B">
              <Segment ID="3"/>
              <Allowance Ref="14"/>
            </BaggageInformation>
            <PenaltiesInfo>
              <Penalty Amount="26035" Applicability="Before" Changeable="true" Currency="RUB" Type="Exchange"/>
              <Penalty Amount="26035" Applicability="After" Changeable="true" Currency="RUB" Type="Exchange"/>
              <Penalty Amount="29545" Applicability="Before" Currency="RUB" Refundable="true" Type="Refund"/>
              <Penalty Amount="29545" Applicability="After" Currency="RUB" Refundable="true" Type="Refund"/>
            </PenaltiesInfo>
            <SeatSelection Type="C">
              <Segment ID="0"/>
              <Segment ID="1"/>
              <Segment ID="2"/>
              <Segment ID="3"/>
            </SeatSelection>
          </PassengerInfo>
          <PassengerInfo NonRefundable="false" PassengerNumber="1" PassengerType="CNN">
            <FareComponent Ref="202">
              <Segment BookingCode="V" CabinCode="Y" MealCode="M" SeatsAvailable="9"/>
              <Segment AvailabilityBreak="true" BookingCode="V" CabinCode="Y" MealCode="M" SeatsAvailable="9"/>
              <BrandFeature Ref="123"/>
              <BrandFeature Ref="108"/>
              <BrandFeature Ref="98"/>
              <BrandFeature Ref="191"/>
              <BrandFeature Ref="137"/>
              <BrandFeature Ref="14"/>
              <BrandFeature Ref="138"/>
              <BrandFeature Ref="182"/>
              <BrandFeature Ref="83"/>
              <BrandFeature Ref="89"/>
              <BrandFeature Ref="201"/>
              <BrandFeature Ref="8"/>
              <BrandFeature Ref="114"/>
              <BrandFeature Ref="176"/>
              <BrandFeature Ref="172"/>
              <BrandFeature Ref="192"/>
              <BrandFeature Ref="150"/>
              <BrandFeature Ref="156"/>
              <BrandFeature Ref="100"/>
              <BrandFeature Ref="166"/>
            </FareComponent>
            <FareComponent Ref="138">
              <Segment BookingCode="S" CabinCode="Y" MealCode="M" SeatsAvailable="9"/>
              <Segment AvailabilityBreak="true" BookingCode="S" CabinCode="Y" MealCode="M" SeatsAvailable="9"/>
              <BrandFeature Ref="123"/>
              <BrandFeature Ref="108"/>
              <BrandFeature Ref="98"/>
              <BrandFeature Ref="191"/>
              <BrandFeature Ref="137"/>
              <BrandFeature Ref="14"/>
              <BrandFeature Ref="138"/>
              <BrandFeature Ref="182"/>
              <BrandFeature Ref="83"/>
              <BrandFeature Ref="89"/>
              <BrandFeature Ref="201"/>
              <BrandFeature Ref="8"/>
              <BrandFeature Ref="114"/>
              <BrandFeature Ref="176"/>
              <BrandFeature Ref="172"/>
              <BrandFeature Ref="192"/>
              <BrandFeature Ref="150"/>
              <BrandFeature Ref="156"/>
              <BrandFeature Ref="100"/>
              <BrandFeature Ref="166"/>
            </FareComponent>
            <Tax Ref="19"/>
            <Tax Ref="13"/>
            <Tax Ref="118"/>
            <Tax Ref="118"/>
            <Tax Ref="114"/>
            <Tax Ref="114"/>
            <Tax Ref="116"/>
            <Tax Ref="81"/>
            <Tax Ref="24"/>
            <Tax Ref="134"/>
            <Tax Ref="134"/>
            <Tax Ref="122"/>
            <Tax Ref="101"/>
            <Tax Ref="58"/>
            <Tax Ref="3"/>
            <Tax Ref="3"/>
            <Tax Ref="106"/>
            <Tax Ref="106"/>
            <TaxSummary Ref="95"/>
            <TaxSummary Ref="36"/>
            <TaxSummary Ref="56"/>
            <TaxSummary Ref="24"/>
            <TaxSummary Ref="90"/>
            <TaxSummary Ref="66"/>
            <TaxSummary Ref="18"/>
            <TaxSummary Ref="25"/>
            <OBFee Ref="1"/>
            <CurrencyConversion ExchangeRateUsed="41.5" From="AUD" To="RUB"/>
            <PassengerTotalFare BaseFareAmount="911.00" BaseFareCurrency="AUD" CommissionAmount="0" CommissionPercentage="0" ConstructionAmount="685.37" ConstructionCurrency="NUC" Currency="RUB" EquivalentAmount="37810" EquivalentCurrency="RUB" ExchangeRateOne="1.32814600" TotalFare="76041" TotalTaxes="38231"/>
            <BaggageInformation AirlineCode="QR" ProvisionType="A">
              <Segment ID="0"/>
              <Segment ID="1"/>
              <Allowance Ref="1"/>
            </BaggageInformation>
            <BaggageInformation AirlineCode="QR" ProvisionType="A">
              <Segment ID="2"/>
              <Segment ID="3"/>
              <Allowance Ref="1"/>
            </BaggageInformation>
            <BaggageInformation AirlineCode="QR" ProvisionType="B">
              <Segment ID="0"/>
              <Allowance Ref="14"/>
            </BaggageInformation>
            <BaggageInformation AirlineCode="QR" ProvisionType="B">
              <Segment ID="1"/>
              <Allowance Ref="14"/>
            </BaggageInformation>
            <BaggageInformation AirlineCode="QR" ProvisionType="B">
              <Segment ID="2"/>
              <Allowance Ref="14"/>
            </BaggageInformation>
            <BaggageInformation AirlineCode="QR" ProvisionType="B">
              <Segment ID="3"/>
              <Allowance Ref="14"/>
            </BaggageInformation>
            <PenaltiesInfo>
              <Penalty Amount="26035" Applicability="Before" Changeable="true" Currency="RUB" Type="Exchange"/>
              <Penalty Amount="26035" Applicability="After" Changeable="true" Currency="RUB" Type="Exchange"/>
              <Penalty Amount="29545" Applicability="Before" Currency="RUB" Refundable="true" Type="Refund"/>
              <Penalty Amount="29545" Applicability="After" Currency="RUB" Refundable="true" Type="Refund"/>
            </PenaltiesInfo>
            <SeatSelection Type="C">
              <Segment ID="0"/>
              <Segment ID="1"/>
              <Segment ID="2"/>
              <Segment ID="3"/>
            </SeatSelection>
          </PassengerInfo>
          <PassengerInfo NonRefundable="false" PassengerNumber="1" PassengerType="INF">
            <FareComponent Ref="308">
              <Segment BookingCode="V" CabinCode="Y" MealCode="M" SeatsAvailable="9"/>
              <Segment AvailabilityBreak="true" BookingCode="V" CabinCode="Y" MealCode="M" SeatsAvailable="9"/>
              <BrandFeature Ref="123"/>
              <BrandFeature Ref="108"/>
              <BrandFeature Ref="98"/>
              <BrandFeature Ref="191"/>
              <BrandFeature Ref="137"/>
              <BrandFeature Ref="14"/>
              <BrandFeature Ref="138"/>
              <BrandFeature Ref="182"/>
              <BrandFeature Ref="83"/>
              <BrandFeature Ref="89"/>
              <BrandFeature Ref="201"/>
              <BrandFeature Ref="8"/>
              <BrandFeature Ref="114"/>
              <BrandFeature Ref="176"/>
              <BrandFeature Ref="172"/>
              <BrandFeature Ref="192"/>
              <BrandFeature Ref="150"/>
              <BrandFeature Ref="156"/>
              <BrandFeature Ref="100"/>
              <BrandFeature Ref="166"/>
            </FareComponent>
            <FareComponent Ref="183">
              <Segment BookingCode="S" CabinCode="Y" MealCode="M" SeatsAvailable="9"/>
              <Segment AvailabilityBreak="true" BookingCode="S" CabinCode="Y" MealCode="M" SeatsAvailable="9"/>
              <BrandFeature Ref="123"/>
              <BrandFeature Ref="108"/>
              <BrandFeature Ref="98"/>
              <BrandFeature Ref="191"/>
              <BrandFeature Ref="137"/>
              <BrandFeature Ref="14"/>
              <BrandFeature Ref="138"/>
              <BrandFeature Ref="182"/>
              <BrandFeature Ref="83"/>
              <BrandFeature Ref="89"/>
              <BrandFeature Ref="201"/>
              <BrandFeature Ref="8"/>
              <BrandFeature Ref="114"/>
              <BrandFeature Ref="176"/>
              <BrandFeature Ref="172"/>
              <BrandFeature Ref="192"/>
              <BrandFeature Ref="150"/>
              <BrandFeature Ref="156"/>
              <BrandFeature Ref="100"/>
              <BrandFeature Ref="166"/>
            </FareComponent>
            <Tax Ref="107"/>
            <Tax Ref="39"/>
            <Tax Ref="118"/>
            <Tax Ref="118"/>
            <Tax Ref="114"/>
            <Tax Ref="114"/>
            <Tax Ref="24"/>
            <TaxSummary Ref="42"/>
            <TaxSummary Ref="36"/>
            <TaxSummary Ref="18"/>
            <OBFee Ref="1"/>
            <CurrencyConversion ExchangeRateUsed="41.5" From="AUD" To="RUB"/>
            <PassengerTotalFare BaseFareAmount="221.00" BaseFareCurrency="AUD" CommissionAmount="0" CommissionPercentage="0" ConstructionAmount="165.84" ConstructionCurrency="NUC" Currency="RUB" EquivalentAmount="9175" EquivalentCurrency="RUB" ExchangeRateOne="1.32814600" TotalFare="18184" TotalTaxes="9009"/>
            <BaggageInformation AirlineCode="QR" ProvisionType="A">
              <Segment ID="0"/>
              <Segment ID="1"/>
              <Allowance Ref="69"/>
            </BaggageInformation>
            <BaggageInformation AirlineCode="QR" ProvisionType="A">
              <Segment ID="2"/>
              <Segment ID="3"/>
              <Allowance Ref="69"/>
            </BaggageInformation>
            <PenaltiesInfo>
              <Penalty Amount="0" Applicability="Before" Changeable="true" Currency="RUB" Type="Exchange"/>
              <Penalty Amount="0" Applicability="After" Changeable="true" Currency="RUB" Type="Exchange"/>
              <Penalty Amount="0" Applicability="Before" Currency="RUB" Refundable="true" Type="Refund"/>
              <Penalty Amount="0" Applicability="After" Currency="RUB" Refundable="true" Type="Refund"/>
            </PenaltiesInfo>
            <SeatSelection Type="C">
              <Segment ID="0"/>
              <Segment ID="1"/>
              <Segment ID="2"/>
              <Segment ID="3"/>
            </SeatSelection>
          </PassengerInfo>
          <AncillaryFeeGroup Message="AIR EXTRAS NOT APPLICABLE OR ARE UNKNOWN FOR THIS ITINERARY"/>
          <TotalFare BaseFareAmount="3920.00" BaseFareCurrency="AUD" ConstructionAmount="2949.29" ConstructionCurrency="NUC" Currency="RUB" EquivalentAmount="162695" EquivalentCurrency="RUB" TotalPrice="303641" TotalTaxes="140946"/>
          <ValidatingCarrier Ref="3"/>
        </Fare>
      </PricingInformation>
      <PricingInformation BrandsOnAnyMarket="true" FlexibleFare="4" PricingSubsource="MIP">
        <Fare ETicketable="true" GoverningCarriers="QR QR" VITA="true" ValidatingCarrierCode="QR">
          <PassengerInfo NonRefundable="false" PassengerNumber="2" PassengerType="ADT">
            <FareComponent Ref="94">
              <Segment BookingCode="D" CabinCode="C" MealCode="M" SeatsAvailable="9"/>
              <Segment AvailabilityBreak="true" BookingCode="D" CabinCode="C" MealCode="M" SeatsAvailable="9"/>
              <BrandFeature Ref="123"/>
              <BrandFeature Ref="108"/>
              <BrandFeature Ref="235"/>
              <BrandFeature Ref="191"/>
              <BrandFeature Ref="137"/>
              <BrandFeature Ref="152"/>
              <BrandFeature Ref="138"/>
              <BrandFeature Ref="182"/>
              <BrandFeature Ref="83"/>
              <BrandFeature Ref="89"/>
              <BrandFeature Ref="201"/>
              <BrandFeature Ref="8"/>
              <BrandFeature Ref="196"/>
              <BrandFeature Ref="176"/>
              <BrandFeature Ref="183"/>
              <BrandFeature Ref="192"/>
              <BrandFeature Ref="81"/>
              <BrandFeature Ref="144"/>
              <BrandFeature Ref="119"/>
              <BrandFeature Ref="117"/>
            </FareComponent>
            <FareComponent Ref="255">
              <Segment BookingCode="D" CabinCode="C" MealCode="M" SeatsAvailable="7"/>
              <Segment AvailabilityBreak="true" BookingCode="D" CabinCode="C" MealCode="M" SeatsAvailable="7"/>
              <BrandFeature Ref="123"/>
              <BrandFeature Ref="108"/>
              <BrandFeature Ref="235"/>
              <BrandFeature Ref="191"/>
              <BrandFeature Ref="137"/>
              <BrandFeature Ref="152"/>
              <BrandFeature Ref="138"/>
              <BrandFeature Ref="182"/>
              <BrandFeature Ref="83"/>
              <BrandFeature Ref="89"/>
              <BrandFeature Ref="201"/>
              <BrandFeature Ref="8"/>
              <BrandFeature Ref="196"/>
              <BrandFeature Ref="176"/>
              <BrandFeature Ref="183"/>
              <BrandFeature Ref="192"/>
              <BrandFeature Ref="81"/>
              <BrandFeature Ref="144"/>
              <BrandFeature Ref="119"/>
              <BrandFeature Ref="117"/>
            </FareComponent>
            <Tax Ref="90"/>
            <Tax Ref="108"/>
            <Tax Ref="59"/>
            <Tax Ref="59"/>
            <Tax Ref="48"/>
            <Tax Ref="48"/>
            <Tax Ref="128"/>
            <Tax Ref="116"/>
            <Tax Ref="81"/>
            <Tax Ref="1"/>
            <Tax Ref="24"/>
            <Tax Ref="134"/>
            <Tax Ref="134"/>
            <Tax Ref="122"/>
            <Tax Ref="101"/>
            <Tax Ref="58"/>
            <Tax Ref="3"/>
            <Tax Ref="3"/>
            <Tax Ref="106"/>
            <Tax Ref="106"/>
            <TaxSummary Ref="15"/>
            <TaxSummary Ref="11"/>
            <TaxSummary Ref="91"/>
            <TaxSummary Ref="56"/>
            <TaxSummary Ref="24"/>
            <TaxSummary Ref="90"/>
            <TaxSummary Ref="66"/>
            <TaxSummary Ref="3"/>
            <TaxSummary Ref="18"/>
            <TaxSummary Ref="25"/>
            <OBFee Ref="1"/>
            <CurrencyConversion ExchangeRateUsed="41.5" From="AUD" To="RUB"/>
            <PassengerTotalFare BaseFareAmount="10264.00" BaseFareCurrency="AUD" CommissionAmount="0" CommissionPercentage="0" ConstructionAmount="7727.89" ConstructionCurrency="NUC" Currency="RUB" EquivalentAmount="425960" EquivalentCurrency="RUB" ExchangeRateOne="1.32814600" TotalFare="494966" TotalTaxes="69006"/>
            <BaggageInformation AirlineCode="QR" ProvisionType="A">
              <Segment ID="0"/>
              <Segment ID="1"/>
              <Allowance Ref="40"/>
            </BaggageInformation>
            <BaggageInformation AirlineCode="QR" ProvisionType="A">
              <Segment ID="2"/>
              <Segment ID="3"/>
              <Allowance Ref="40"/>
            </BaggageInformation>
            <BaggageInformation AirlineCode="QR" ProvisionType="B">
              <Segment ID="0"/>
              <Allowance Ref="15"/>
            </BaggageInformation>
            <BaggageInformation AirlineCode="QR" ProvisionType="B">
              <Segment ID="1"/>
              <Allowance Ref="15"/>
            </BaggageInformation>
            <BaggageInformation AirlineCode="QR" ProvisionType="B">
              <Segment ID="2"/>
              <Allowance Ref="15"/>
            </BaggageInformation>
            <BaggageInformation AirlineCode="QR" ProvisionType="B">
              <Segment ID="3"/>
              <Allowance Ref="15"/>
            </BaggageInformation>
            <PenaltiesInfo>
              <Penalty Amount="41830" Applicability="Before" Changeable="true" Currency="RUB" Type="Exchange"/>
              <Penalty Amount="41830" Applicability="After" Changeable="true" Currency="RUB" Type="Exchange"/>
              <Penalty Amount="44755" Applicability="Before" Currency="RUB" Refundable="true" Type="Refund"/>
              <Penalty Amount="44755" Applicability="After" Currency="RUB" Refundable="true" Type="Refund"/>
            </PenaltiesInfo>
            <SeatSelection Type="F">
              <Segment ID="0"/>
              <Segment ID="1"/>
              <Segment ID="2"/>
              <Segment ID="3"/>
            </SeatSelection>
          </PassengerInfo>
          <PassengerInfo NonRefundable="false" PassengerNumber="1" PassengerType="CNN">
            <FareComponent Ref="294">
              <Segment BookingCode="D" CabinCode="C" MealCode="M" SeatsAvailable="9"/>
              <Segment AvailabilityBreak="true" BookingCode="D" CabinCode="C" MealCode="M" SeatsAvailable="9"/>
              <BrandFeature Ref="123"/>
              <BrandFeature Ref="108"/>
              <BrandFeature Ref="235"/>
              <BrandFeature Ref="191"/>
              <BrandFeature Ref="137"/>
              <BrandFeature Ref="152"/>
              <BrandFeature Ref="138"/>
              <BrandFeature Ref="182"/>
              <BrandFeature Ref="83"/>
              <BrandFeature Ref="89"/>
              <BrandFeature Ref="201"/>
              <BrandFeature Ref="8"/>
              <BrandFeature Ref="196"/>
              <BrandFeature Ref="176"/>
              <BrandFeature Ref="183"/>
              <BrandFeature Ref="192"/>
              <BrandFeature Ref="81"/>
              <BrandFeature Ref="144"/>
              <BrandFeature Ref="119"/>
              <BrandFeature Ref="117"/>
            </FareComponent>
            <FareComponent Ref="135">
              <Segment BookingCode="D" CabinCode="C" MealCode="M" SeatsAvailable="7"/>
              <Segment AvailabilityBreak="true" BookingCode="D" CabinCode="C" MealCode="M" SeatsAvailable="7"/>
              <BrandFeature Ref="123"/>
              <BrandFeature Ref="108"/>
              <BrandFeature Ref="235"/>
              <BrandFeature Ref="191"/>
              <BrandFeature Ref="137"/>
              <BrandFeature Ref="152"/>
              <BrandFeature Ref="138"/>
              <BrandFeature Ref="182"/>
              <BrandFeature Ref="83"/>
              <BrandFeature Ref="89"/>
              <BrandFeature Ref="201"/>
              <BrandFeature Ref="8"/>
              <BrandFeature Ref="196"/>
              <BrandFeature Ref="176"/>
              <BrandFeature Ref="183"/>
              <BrandFeature Ref="192"/>
              <BrandFeature Ref="81"/>
              <BrandFeature Ref="144"/>
              <BrandFeature Ref="119"/>
              <BrandFeature Ref="117"/>
            </FareComponent>
            <Tax Ref="90"/>
            <Tax Ref="108"/>
            <Tax Ref="59"/>
            <Tax Ref="59"/>
            <Tax Ref="48"/>
            <Tax Ref="48"/>
            <Tax Ref="116"/>
            <Tax Ref="81"/>
            <Tax Ref="1"/>
            <Tax Ref="24"/>
            <Tax Ref="134"/>
            <Tax Ref="134"/>
            <Tax Ref="122"/>
            <Tax Ref="101"/>
            <Tax Ref="58"/>
            <Tax Ref="3"/>
            <Tax Ref="3"/>
            <Tax Ref="106"/>
            <Tax Ref="106"/>
            <TaxSummary Ref="15"/>
            <TaxSummary Ref="11"/>
            <TaxSummary Ref="56"/>
            <TaxSummary Ref="24"/>
            <TaxSummary Ref="90"/>
            <TaxSummary Ref="66"/>
            <TaxSummary Ref="3"/>
            <TaxSummary Ref="18"/>
            <TaxSummary Ref="25"/>
            <OBFee Ref="1"/>
            <CurrencyConversion ExchangeRateUsed="41.5" From="AUD" To="RUB"/>
            <PassengerTotalFare BaseFareAmount="9239.00" BaseFareCurrency="AUD" CommissionAmount="0" CommissionPercentage="0" ConstructionAmount="6956.10" ConstructionCurrency="NUC" Currency="RUB" EquivalentAmount="383420" EquivalentCurrency="RUB" ExchangeRateOne="1.32814600" TotalFare="449936" TotalTaxes="66516"/>
            <BaggageInformation AirlineCode="QR" ProvisionType="A">
              <Segment ID="0"/>
              <Segment ID="1"/>
              <Allowance Ref="40"/>
            </BaggageInformation>
            <BaggageInformation AirlineCode="QR" ProvisionType="A">
              <Segment ID="2"/>
              <Segment ID="3"/>
              <Allowance Ref="40"/>
            </BaggageInformation>
            <BaggageInformation AirlineCode="QR" ProvisionType="B">
              <Segment ID="0"/>
              <Allowance Ref="15"/>
            </BaggageInformation>
            <BaggageInformation AirlineCode="QR" ProvisionType="B">
              <Segment ID="1"/>
              <Allowance Ref="15"/>
            </BaggageInformation>
            <BaggageInformation AirlineCode="QR" ProvisionType="B">
              <Segment ID="2"/>
              <Allowance Ref="15"/>
            </BaggageInformation>
            <BaggageInformation AirlineCode="QR" ProvisionType="B">
              <Segment ID="3"/>
              <Allowance Ref="15"/>
            </BaggageInformation>
            <PenaltiesInfo>
              <Penalty Amount="41830" Applicability="Before" Changeable="true" Currency="RUB" Type="Exchange"/>
              <Penalty Amount="41830" Applicability="After" Changeable="true" Currency="RUB" Type="Exchange"/>
              <Penalty Amount="44755" Applicability="Before" Currency="RUB" Refundable="true" Type="Refund"/>
              <Penalty Amount="44755" Applicability="After" Currency="RUB" Refundable="true" Type="Refund"/>
            </PenaltiesInfo>
            <SeatSelection Type="F">
              <Segment ID="0"/>
              <Segment ID="1"/>
              <Segment ID="2"/>
              <Segment ID="3"/>
            </SeatSelection>
          </PassengerInfo>
          <PassengerInfo NonRefundable="false" PassengerNumber="1" PassengerType="INF">
            <FareComponent Ref="211">
              <Segment BookingCode="D" CabinCode="C" MealCode="M" SeatsAvailable="9"/>
              <Segment AvailabilityBreak="true" BookingCode="D" CabinCode="C" MealCode="M" SeatsAvailable="9"/>
              <BrandFeature Ref="123"/>
              <BrandFeature Ref="108"/>
              <BrandFeature Ref="235"/>
              <BrandFeature Ref="191"/>
              <BrandFeature Ref="137"/>
              <BrandFeature Ref="152"/>
              <BrandFeature Ref="138"/>
              <BrandFeature Ref="182"/>
              <BrandFeature Ref="83"/>
              <BrandFeature Ref="89"/>
              <BrandFeature Ref="201"/>
              <BrandFeature Ref="8"/>
              <BrandFeature Ref="196"/>
              <BrandFeature Ref="176"/>
              <BrandFeature Ref="183"/>
              <BrandFeature Ref="192"/>
              <BrandFeature Ref="81"/>
              <BrandFeature Ref="144"/>
              <BrandFeature Ref="119"/>
              <BrandFeature Ref="117"/>
            </FareComponent>
            <FareComponent Ref="34">
              <Segment BookingCode="D" CabinCode="C" MealCode="M" SeatsAvailable="7"/>
              <Segment AvailabilityBreak="true" BookingCode="D" CabinCode="C" MealCode="M" SeatsAvailable="7"/>
              <BrandFeature Ref="123"/>
              <BrandFeature Ref="108"/>
              <BrandFeature Ref="235"/>
              <BrandFeature Ref="191"/>
              <BrandFeature Ref="137"/>
              <BrandFeature Ref="152"/>
              <BrandFeature Ref="138"/>
              <BrandFeature Ref="182"/>
              <BrandFeature Ref="83"/>
              <BrandFeature Ref="89"/>
              <BrandFeature Ref="201"/>
              <BrandFeature Ref="8"/>
              <BrandFeature Ref="196"/>
              <BrandFeature Ref="176"/>
              <BrandFeature Ref="183"/>
              <BrandFeature Ref="192"/>
              <BrandFeature Ref="81"/>
              <BrandFeature Ref="144"/>
              <BrandFeature Ref="119"/>
              <BrandFeature Ref="117"/>
            </FareComponent>
            <Tax Ref="107"/>
            <Tax Ref="39"/>
            <Tax Ref="59"/>
            <Tax Ref="59"/>
            <Tax Ref="48"/>
            <Tax Ref="48"/>
            <Tax Ref="24"/>
            <TaxSummary Ref="42"/>
            <TaxSummary Ref="11"/>
            <TaxSummary Ref="18"/>
            <OBFee Ref="1"/>
            <CurrencyConversion ExchangeRateUsed="41.5" From="AUD" To="RUB"/>
            <PassengerTotalFare BaseFareAmount="1551.00" BaseFareCurrency="AUD" CommissionAmount="0" CommissionPercentage="0" ConstructionAmount="1167.68" ConstructionCurrency="NUC" Currency="RUB" EquivalentAmount="64370" EquivalentCurrency="RUB" ExchangeRateOne="1.32814600" TotalFare="74547" TotalTaxes="10177"/>
            <BaggageInformation AirlineCode="QR" ProvisionType="A">
              <Segment ID="0"/>
              <Segment ID="1"/>
              <Allowance Ref="69"/>
            </BaggageInformation>
            <BaggageInformation AirlineCode="QR" ProvisionType="A">
              <Segment ID="2"/>
              <Segment ID="3"/>
              <Allowance Ref="69"/>
            </BaggageInformation>
            <PenaltiesInfo>
              <Penalty Amount="0" Applicability="Before" Changeable="true" Currency="RUB" Type="Exchange"/>
              <Penalty Amount="0" Applicability="After" Changeable="true" Currency="RUB" Type="Exchange"/>
              <Penalty Amount="0" Applicability="Before" Currency="RUB" Refundable="true" Type="Refund"/>
              <Penalty Amount="0" Applicability="After" Currency="RUB" Refundable="true" Type="Refund"/>
            </PenaltiesInfo>
            <SeatSelection Type="F">
              <Segment ID="0"/>
              <Segment ID="1"/>
              <Segment ID="2"/>
              <Segment ID="3"/>
            </SeatSelection>
          </PassengerInfo>
          <AncillaryFeeGroup Message="AIR EXTRAS NOT APPLICABLE OR ARE UNKNOWN FOR THIS ITINERARY"/>
          <TotalFare BaseFareAmount="31318.00" BaseFareCurrency="AUD" ConstructionAmount="23579.56" ConstructionCurrency="NUC" Currency="RUB" EquivalentAmount="1299710" EquivalentCurrency="RUB" TotalPrice="1514415" TotalTaxes="214705"/>
          <ValidatingCarrier Ref="3"/>
        </Fare>
      </PricingInformation>
      <DiversitySwapper WeighedPrice="794472.573"/>
    </Itinerary>
    <!--Другие рекомендации-->
  </ItineraryGroup>
  <!--Другие маршруты-->
</GroupedItineraryResponse>
```
{{< /details >}}

---

{{< details title="Пример запроса (оформление на нескольких билетах (SOW), OTA ответ)" >}}
```XML
<OTA_AirLowFareSearchRQ ResponseType="OTA" Version="6.5.0" xmlns="http://www.opentravel.org/OTA/2003/05">
  <POS>
    <Source PseudoCityCode="9LSC">
      <RequestorID ID="1" Type="1">
        <CompanyName Code="TN"/>
      </RequestorID>
    </Source>
  </POS>
  <OriginDestinationInformation RPH="1">
    <DepartureDateTime>2022-12-01T11:00:00</DepartureDateTime>
    <OriginLocation LocationCode="SYD"/>
    <DestinationLocation LocationCode="LON"/>
  </OriginDestinationInformation>
  <OriginDestinationInformation RPH="2">
    <DepartureDateTime>2022-12-08T11:00:00</DepartureDateTime>
    <OriginLocation LocationCode="LON"/>
    <DestinationLocation LocationCode="SYD"/>
  </OriginDestinationInformation>
  <TravelPreferences ValidInterlineTicket="true">
    <CabinPref Cabin="Economy" PreferLevel="Preferred"/>
    <TPA_Extensions>
      <LongConnectTime Enable="true"/>
      <LongConnectPoints Max="3" Min="1"/>
      <KeepSameCabin Enabled="true"/>
      <ExcludeCallDirectCarriers Enabled="true"/>
      <SeatSelection Info="true"/>
      <DiversityParameters AdditionalNonStopsPercentage="100"/>
    </TPA_Extensions>
    <AncillaryFees Enable="true">
      <AncillaryFeeGroup Code="BG"/>
    </AncillaryFees>
    <Baggage CarryOnInfo="true" Description="true" RequestType="A"/>
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
```
{{< /details >}}

{{< details title="Пример ответа" >}}
```XML
<OTA_AirLowFareSearchRS AvailableItinCount="0" BrandedOneWayItinCount="0" DepartedItinCount="0" PricedItinCount="159" SimpleOneWayItinCount="61" SoldOutItinCount="0" Version="6.5.0" xmlns="http://www.opentravel.org/OTA/2003/05" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <Success/>
  <Warnings>
    <Warning Code="PROCESS" NumberOfOccurences="2" ShortText="NO FARE FOR CLASS USED" Type="MIP"/>
    <Warning Code="PROCESS" ShortText="Communication error: Transmission timeout" Type="MIP"/>
    <Warning Code="ASE032LPSPIL710.IDM.SGDCPROD.SABRE.COM" MessageClass="I" ShortText="27031" Type="SERVER"/>
    <Warning Code="TRANSACTIONID" MessageClass="I" ShortText="6963719808662294425" Type="WORKERTHREAD"/>
    <Warning Code="RULEID" MessageClass="I" ShortText="15936" Type="DRE"/>
    <Warning Code="RULEID" MessageClass="I" ShortText="27757" Type="DEFAULT"/>
    <Warning Code="MIP" MessageClass="I" ShortText="NO FARE FOR CLASS USED" Type="MIP"/>
  </Warnings>
  <BrandFeatures>
    <BrandFeature Application="F" CommercialName="STANDARD SEATING" Id="1" ServiceGroup="BF" ServiceType="Z" SubCode="050" Vendor="ATP"/>
    <BrandFeature Application="C" CommercialName="STANDARD SEAT RESERVATION" Id="2" ServiceGroup="BF" ServiceType="Z" SubCode="050" Vendor="ATP"/>
    <BrandFeature Application="F" CommercialName="SEAT SELECTION STANDARD ZONE" Id="3" ServiceGroup="BF" ServiceType="Z" SubCode="050" Vendor="ATP"/>
    <BrandFeature Application="F" CommercialName="BASIC SEAT" Id="4" ServiceGroup="BF" ServiceType="Z" SubCode="050" Vendor="ATP"/>
    <BrandFeature Application="C" CommercialName="STANDARD SEAT SELECTION" Id="5" ServiceGroup="BF" ServiceType="Z" SubCode="050" Vendor="ATP"/>
    <!--Другие услуги-->
  </BrandFeatures>
  <PricedItineraries>
    <PricedItinerary SequenceNumber="1">
      <AirItinerary DirectionInd="Return">
        <OriginDestinationOptions>
          <OriginDestinationOption ArrivalCountry="GB" DepartureCountry="AU" ElapsedTime="2460">
            <FlightSegment ArrivalDateTime="2022-12-01T17:15:00" DepartureDateTime="2022-12-01T09:15:00" ElapsedTime="600" FlightNumber="52" ResBookDesigCode="S" StopQuantity="0">
              <DepartureAirport LocationCode="SYD" TerminalID="1"/>
              <ArrivalAirport LocationCode="HND" TerminalID="3"/>
              <OperatingAirline Code="JL" FlightNumber="52"/>
              <Equipment AirEquipType="789"/>
              <MarketingAirline Code="JL"/>
              <MarriageGrp>O</MarriageGrp>
              <DepartureTimeZone GMTOffset="11"/>
              <ArrivalTimeZone GMTOffset="9"/>
              <TPA_Extensions>
                <eTicket Ind="true"/>
                <Mileage Amount="4836"/>
              </TPA_Extensions>
            </FlightSegment>
            <FlightSegment ArrivalDateTime="2022-12-02T15:15:00" DepartureDateTime="2022-12-02T11:30:00" ElapsedTime="765" FlightNumber="43" ResBookDesigCode="S" StopQuantity="0">
              <DepartureAirport LocationCode="HND" TerminalID="3"/>
              <ArrivalAirport LocationCode="LHR" TerminalID="3"/>
              <OperatingAirline Code="JL" FlightNumber="43"/>
              <Equipment AirEquipType="773"/>
              <MarketingAirline Code="JL"/>
              <MarriageGrp>I</MarriageGrp>
              <DepartureTimeZone GMTOffset="9"/>
              <ArrivalTimeZone GMTOffset="0"/>
              <TPA_Extensions>
                <eTicket Ind="true"/>
                <Mileage Amount="5974"/>
              </TPA_Extensions>
            </FlightSegment>
          </OriginDestinationOption>
          <OriginDestinationOption ArrivalCountry="AU" DepartureCountry="GB" ElapsedTime="1785">
            <FlightSegment ArrivalDateTime="2022-12-09T10:25:00" DepartureDateTime="2022-12-08T13:45:00" ElapsedTime="700" FlightNumber="7120" ResBookDesigCode="S" StopQuantity="0">
              <DepartureAirport LocationCode="LHR" TerminalID="5"/>
              <ArrivalAirport LocationCode="HND" TerminalID="3"/>
              <OperatingAirline Code="BA" FlightNumber="5"/>
              <Equipment AirEquipType="789"/>
              <MarketingAirline Code="JL"/>
              <DisclosureAirline Code="BA"/>
              <MarriageGrp>O</MarriageGrp>
              <DepartureTimeZone GMTOffset="0"/>
              <ArrivalTimeZone GMTOffset="9"/>
              <TPA_Extensions>
                <eTicket Ind="true"/>
                <Mileage Amount="5974"/>
              </TPA_Extensions>
            </FlightSegment>
            <FlightSegment ArrivalDateTime="2022-12-10T06:30:00" DepartureDateTime="2022-12-09T18:40:00" ElapsedTime="590" FlightNumber="51" ResBookDesigCode="S" StopQuantity="0">
              <DepartureAirport LocationCode="HND" TerminalID="3"/>
              <ArrivalAirport LocationCode="SYD" TerminalID="1"/>
              <OperatingAirline Code="JL" FlightNumber="51"/>
              <Equipment AirEquipType="789"/>
              <MarketingAirline Code="JL"/>
              <MarriageGrp>I</MarriageGrp>
              <DepartureTimeZone GMTOffset="9"/>
              <ArrivalTimeZone GMTOffset="11"/>
              <TPA_Extensions>
                <eTicket Ind="true"/>
                <Mileage Amount="4836"/>
              </TPA_Extensions>
            </FlightSegment>
          </OriginDestinationOption>
        </OriginDestinationOptions>
      </AirItinerary>
      <AirItineraryPricingInfo FareReturned="true" LastTicketDate="2022-05-27" LastTicketTime="23:59" PricingSource="ADVJR1" PricingSubSource="MIP">
        <ItinTotalFare>
          <BaseFare Amount="2144.00" CurrencyCode="AUD" DecimalPlaces="2"/>
          <FareConstruction Amount="1613.66" CurrencyCode="NUC" DecimalPlaces="2"/>
          <EquivFare Amount="96480" CurrencyCode="RUB" DecimalPlaces="0"/>
          <Taxes>
            <Tax Amount="112286" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="TOTALTAX"/>
          </Taxes>
          <TotalFare Amount="208766" CurrencyCode="RUB" DecimalPlaces="0"/>
        </ItinTotalFare>
        <PTC_FareBreakdowns>
          <PTC_FareBreakdown>
            <PassengerTypeQuantity Code="ADT" Quantity="2"/>
            <FareBasisCodes>
              <FareBasisCode ArrivalAirportCode="HND" BookingCode="S" DepartureAirportCode="SYD" FareComponentBeginAirport="SYD" FareComponentCabinCode="Y" FareComponentDirectionality="FROM" FareComponentEndAirport="LHR" FareComponentFareRule="2291" FareComponentFareTariff="44" FareComponentFareType="XEX" FareComponentFareTypeBitmap="00" FareComponentVendorCode="ATP" GovCarrier="JL">SNN0NPCE</FareBasisCode>
              <FareBasisCode ArrivalAirportCode="LHR" AvailabilityBreak="true" BookingCode="S" DepartureAirportCode="HND" GovCarrier="JL">SNN0NPCE</FareBasisCode>
              <FareBasisCode ArrivalAirportCode="HND" BookingCode="S" DepartureAirportCode="LHR" FareComponentBeginAirport="LHR" FareComponentCabinCode="Y" FareComponentDirectionality="TO" FareComponentEndAirport="SYD" FareComponentFareRule="2291" FareComponentFareTariff="44" FareComponentFareType="XEX" FareComponentFareTypeBitmap="00" FareComponentVendorCode="ATP" GovCarrier="JL">SNN0NPCE</FareBasisCode>
              <FareBasisCode ArrivalAirportCode="SYD" AvailabilityBreak="true" BookingCode="S" DepartureAirportCode="HND" GovCarrier="JL">SNN0NPCE</FareBasisCode>
            </FareBasisCodes>
            <PassengerFare>
              <BaseFare Amount="752.00" CurrencyCode="AUD"/>
              <FareConstruction Amount="566.20" CurrencyCode="NUC" DecimalPlaces="2"/>
              <EquivFare Amount="33840" CurrencyCode="RUB" DecimalPlaces="0"/>
              <Taxes>
                <Tax Amount="9945" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                <Tax Amount="9945" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                <Tax Amount="231" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQI"/>
                <Tax Amount="231" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQI"/>
                <Tax Amount="231" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQI"/>
                <Tax Amount="231" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQI"/>
                <Tax Amount="2700" CountryCode="AU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="AU"/>
                <Tax Amount="1450" CountryCode="AU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="WY"/>
                <Tax Amount="1450" CountryCode="AU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="WY2"/>
                <Tax Amount="6678" CountryCode="GB" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="GB"/>
                <Tax Amount="4457" CountryCode="GB" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="UB"/>
                <Tax Amount="728" CountryCode="JP" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="SW"/>
                <Tax Amount="728" CountryCode="JP" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="SW"/>
                <TaxSummary Amount="20814" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                <TaxSummary Amount="2700" CountryCode="AU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="AU"/>
                <TaxSummary Amount="2900" CountryCode="AU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="WY"/>
                <TaxSummary Amount="1456" CountryCode="JP" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="SW"/>
                <TaxSummary Amount="6678" CountryCode="GB" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="GB"/>
                <TaxSummary Amount="4457" CountryCode="GB" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="UB"/>
                <TotalTax Amount="39005" CurrencyCode="RUB" DecimalPlaces="0"/>
              </Taxes>
              <TotalFare Amount="72845" CurrencyCode="RUB"/>
              <PenaltiesInfo>
                <Penalty Amount="0" Applicability="Before" Changeable="true" ConditionsApply="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                <Penalty Amount="0" Applicability="After" Changeable="true" ConditionsApply="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                <Penalty Amount="27000" Applicability="Before" Cat16Info="true" CurrencyCode="RUB" DecimalPlaces="0" Refundable="true" Type="Refund"/>
                <Penalty Applicability="After" Cat16Info="true" Refundable="false" Type="Refund"/>
              </PenaltiesInfo>
              <TPA_Extensions>
                <Messages>
                  <Message AirlineCode="JL" FailCode="0" Info="RFND RESTR APPLY" Type="N"/>
                  <Message FailCode="0" Info="VALIDATING CARRIER" Type="W"/>
                  <Message FailCode="0" Info="BSP - JL" Type="W"/>
                </Messages>
                <BaggageInformationList>
                  <BaggageInformation AirlineCode="JL" ProvisionType="A">
                    <Segment Id="0"/>
                    <Segment Id="1"/>
                    <Allowance Description1="UP TO 50 POUNDS/23 KILOGRAMS" Description2="UP TO 80 LINEAR INCHES/203 LINEAR CENTIMETERS" Pieces="2"/>
                  </BaggageInformation>
                  <BaggageInformation AirlineCode="JL" ProvisionType="A">
                    <Segment Id="2"/>
                    <Segment Id="3"/>
                    <Allowance Description1="UP TO 50 POUNDS/23 KILOGRAMS" Description2="UP TO 80 LINEAR INCHES/203 LINEAR CENTIMETERS" Pieces="2"/>
                  </BaggageInformation>
                  <BaggageInformation AirlineCode="JL" ProvisionType="B">
                    <Segment Id="0"/>
                    <Allowance Description1="UP TO 22 POUNDS/10 KILOGRAMS" Description2="UP TO 45 LINEAR INCHES/115 LINEAR CENTIMETERS" Pieces="1"/>
                  </BaggageInformation>
                  <BaggageInformation AirlineCode="JL" ProvisionType="B">
                    <Segment Id="1"/>
                    <Allowance Description1="UP TO 22 POUNDS/10 KILOGRAMS" Description2="UP TO 45 LINEAR INCHES/115 LINEAR CENTIMETERS" Pieces="1"/>
                  </BaggageInformation>
                  <BaggageInformation AirlineCode="BA" ProvisionType="B">
                    <Segment Id="2"/>
                    <Allowance Description1="UP TO 34 LINEAR INCHES/85 LINEAR CENTIMETERS" Pieces="1"/>
                  </BaggageInformation>
                  <BaggageInformation AirlineCode="JL" ProvisionType="B">
                    <Segment Id="3"/>
                    <Allowance Description1="UP TO 22 POUNDS/10 KILOGRAMS" Description2="UP TO 45 LINEAR INCHES/115 LINEAR CENTIMETERS" Pieces="1"/>
                  </BaggageInformation>
                </BaggageInformationList>
                <SeatSelectionList>
                  <SeatSelection Type="N">
                    <Segment ID="0"/>
                    <Segment ID="1"/>
                    <Segment ID="2"/>
                    <Segment ID="3"/>
                  </SeatSelection>
                </SeatSelectionList>
              </TPA_Extensions>
            </PassengerFare>
            <Endorsements NonRefundableIndicator="true"/>
            <TPA_Extensions>
              <FareCalcLine Info="SYD JL X/TYO JL LON283.10JL X/TYO JL SYD283.10NUC566.20END ROE1.328146"/>
            </TPA_Extensions>
            <FareInfos>
              <FareInfo>
                <FareReference>S</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="M"/>
                </TPA_Extensions>
              </FareInfo>
              <FareInfo>
                <FareReference>S</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="M"/>
                </TPA_Extensions>
              </FareInfo>
              <FareInfo>
                <FareReference>S</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                </TPA_Extensions>
              </FareInfo>
              <FareInfo>
                <FareReference>S</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="M"/>
                </TPA_Extensions>
              </FareInfo>
            </FareInfos>
          </PTC_FareBreakdown>
          <PTC_FareBreakdown>
            <PassengerTypeQuantity Code="CNN" Quantity="1"/>
            <FareBasisCodes>
              <FareBasisCode ArrivalAirportCode="HND" BookingCode="S" DepartureAirportCode="SYD" FareComponentBeginAirport="SYD" FareComponentCabinCode="Y" FareComponentDirectionality="FROM" FareComponentEndAirport="LHR" FareComponentFareRule="2291" FareComponentFareTariff="44" FareComponentFareType="XEX" FareComponentFareTypeBitmap="01" FareComponentVendorCode="ATP" GovCarrier="JL">SNN0NPCE/CH25</FareBasisCode>
              <FareBasisCode ArrivalAirportCode="LHR" AvailabilityBreak="true" BookingCode="S" DepartureAirportCode="HND" GovCarrier="JL">SNN0NPCE/CH25</FareBasisCode>
              <FareBasisCode ArrivalAirportCode="HND" BookingCode="S" DepartureAirportCode="LHR" FareComponentBeginAirport="LHR" FareComponentCabinCode="Y" FareComponentDirectionality="TO" FareComponentEndAirport="SYD" FareComponentFareRule="2291" FareComponentFareTariff="44" FareComponentFareType="XEX" FareComponentFareTypeBitmap="01" FareComponentVendorCode="ATP" GovCarrier="JL">SNN0NPCE/CH25</FareBasisCode>
              <FareBasisCode ArrivalAirportCode="SYD" AvailabilityBreak="true" BookingCode="S" DepartureAirportCode="HND" GovCarrier="JL">SNN0NPCE/CH25</FareBasisCode>
            </FareBasisCodes>
            <PassengerFare>
              <BaseFare Amount="564.00" CurrencyCode="AUD"/>
              <FareConstruction Amount="424.64" CurrencyCode="NUC" DecimalPlaces="2"/>
              <EquivFare Amount="25380" CurrencyCode="RUB" DecimalPlaces="0"/>
              <Taxes>
                <Tax Amount="9945" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                <Tax Amount="9945" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                <Tax Amount="231" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQI"/>
                <Tax Amount="231" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQI"/>
                <Tax Amount="231" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQI"/>
                <Tax Amount="231" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQI"/>
                <Tax Amount="1450" CountryCode="AU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="WY"/>
                <Tax Amount="1450" CountryCode="AU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="WY2"/>
                <Tax Amount="4457" CountryCode="GB" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="UB"/>
                <Tax Amount="362" CountryCode="JP" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="SW"/>
                <Tax Amount="362" CountryCode="JP" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="SW"/>
                <TaxSummary Amount="20814" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                <TaxSummary Amount="2900" CountryCode="AU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="WY"/>
                <TaxSummary Amount="724" CountryCode="JP" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="SW"/>
                <TaxSummary Amount="4457" CountryCode="GB" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="UB"/>
                <TotalTax Amount="28895" CurrencyCode="RUB" DecimalPlaces="0"/>
              </Taxes>
              <TotalFare Amount="54275" CurrencyCode="RUB"/>
              <PenaltiesInfo>
                <Penalty Amount="0" Applicability="Before" Changeable="true" ConditionsApply="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                <Penalty Amount="0" Applicability="After" Changeable="true" ConditionsApply="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                <Penalty Amount="27000" Applicability="Before" Cat16Info="true" CurrencyCode="RUB" DecimalPlaces="0" Refundable="true" Type="Refund"/>
                <Penalty Applicability="After" Cat16Info="true" Refundable="false" Type="Refund"/>
              </PenaltiesInfo>
              <TPA_Extensions>
                <Messages>
                  <Message AirlineCode="JL" FailCode="0" Info="RFND RESTR APPLY" Type="N"/>
                  <Message FailCode="0" Info="EACH CNN REQUIRES ACCOMPANYING SAME CABIN ADT" Type="W"/>
                  <Message FailCode="0" Info="VALIDATING CARRIER" Type="W"/>
                  <Message FailCode="0" Info="BSP - JL" Type="W"/>
                </Messages>
                <BaggageInformationList>
                  <BaggageInformation AirlineCode="JL" ProvisionType="A">
                    <Segment Id="0"/>
                    <Segment Id="1"/>
                    <Allowance Description1="UP TO 50 POUNDS/23 KILOGRAMS" Description2="UP TO 80 LINEAR INCHES/203 LINEAR CENTIMETERS" Pieces="2"/>
                  </BaggageInformation>
                  <BaggageInformation AirlineCode="JL" ProvisionType="A">
                    <Segment Id="2"/>
                    <Segment Id="3"/>
                    <Allowance Description1="UP TO 50 POUNDS/23 KILOGRAMS" Description2="UP TO 80 LINEAR INCHES/203 LINEAR CENTIMETERS" Pieces="2"/>
                  </BaggageInformation>
                  <BaggageInformation AirlineCode="JL" ProvisionType="B">
                    <Segment Id="0"/>
                    <Allowance Description1="UP TO 22 POUNDS/10 KILOGRAMS" Description2="UP TO 45 LINEAR INCHES/115 LINEAR CENTIMETERS" Pieces="1"/>
                  </BaggageInformation>
                  <BaggageInformation AirlineCode="JL" ProvisionType="B">
                    <Segment Id="1"/>
                    <Allowance Description1="UP TO 22 POUNDS/10 KILOGRAMS" Description2="UP TO 45 LINEAR INCHES/115 LINEAR CENTIMETERS" Pieces="1"/>
                  </BaggageInformation>
                  <BaggageInformation AirlineCode="BA" ProvisionType="B">
                    <Segment Id="2"/>
                    <Allowance Description1="UP TO 34 LINEAR INCHES/85 LINEAR CENTIMETERS" Pieces="1"/>
                  </BaggageInformation>
                  <BaggageInformation AirlineCode="JL" ProvisionType="B">
                    <Segment Id="3"/>
                    <Allowance Description1="UP TO 22 POUNDS/10 KILOGRAMS" Description2="UP TO 45 LINEAR INCHES/115 LINEAR CENTIMETERS" Pieces="1"/>
                  </BaggageInformation>
                </BaggageInformationList>
                <SeatSelectionList>
                  <SeatSelection Type="N">
                    <Segment ID="0"/>
                    <Segment ID="1"/>
                    <Segment ID="2"/>
                    <Segment ID="3"/>
                  </SeatSelection>
                </SeatSelectionList>
              </TPA_Extensions>
            </PassengerFare>
            <Endorsements NonRefundableIndicator="true"/>
            <TPA_Extensions>
              <FareCalcLine Info="SYD JL X/TYO JL LON212.32JL X/TYO JL SYD212.32NUC424.64END ROE1.328146"/>
            </TPA_Extensions>
            <FareInfos>
              <FareInfo>
                <FareReference>S</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="M"/>
                </TPA_Extensions>
              </FareInfo>
              <FareInfo>
                <FareReference>S</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="M"/>
                </TPA_Extensions>
              </FareInfo>
              <FareInfo>
                <FareReference>S</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                </TPA_Extensions>
              </FareInfo>
              <FareInfo>
                <FareReference>S</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="M"/>
                </TPA_Extensions>
              </FareInfo>
            </FareInfos>
          </PTC_FareBreakdown>
          <PTC_FareBreakdown>
            <PassengerTypeQuantity Code="INF" Quantity="1"/>
            <FareBasisCodes>
              <FareBasisCode ArrivalAirportCode="HND" BookingCode="S" DepartureAirportCode="SYD" FareComponentBeginAirport="SYD" FareComponentCabinCode="Y" FareComponentDirectionality="FROM" FareComponentEndAirport="LHR" FareComponentFareRule="2291" FareComponentFareTariff="44" FareComponentFareType="XEX" FareComponentFareTypeBitmap="01" FareComponentVendorCode="ATP" GovCarrier="JL">SNN0NPCE/IN90</FareBasisCode>
              <FareBasisCode ArrivalAirportCode="LHR" AvailabilityBreak="true" BookingCode="S" DepartureAirportCode="HND" GovCarrier="JL">SNN0NPCE/IN90</FareBasisCode>
              <FareBasisCode ArrivalAirportCode="HND" BookingCode="S" DepartureAirportCode="LHR" FareComponentBeginAirport="LHR" FareComponentCabinCode="Y" FareComponentDirectionality="TO" FareComponentEndAirport="SYD" FareComponentFareRule="2291" FareComponentFareTariff="44" FareComponentFareType="XEX" FareComponentFareTypeBitmap="01" FareComponentVendorCode="ATP" GovCarrier="JL">SNN0NPCE/IN90</FareBasisCode>
              <FareBasisCode ArrivalAirportCode="SYD" AvailabilityBreak="true" BookingCode="S" DepartureAirportCode="HND" GovCarrier="JL">SNN0NPCE/IN90</FareBasisCode>
            </FareBasisCodes>
            <PassengerFare>
              <BaseFare Amount="76.00" CurrencyCode="AUD"/>
              <FareConstruction Amount="56.62" CurrencyCode="NUC" DecimalPlaces="2"/>
              <EquivFare Amount="3420" CurrencyCode="RUB" DecimalPlaces="0"/>
              <Taxes>
                <Tax Amount="231" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQI"/>
                <Tax Amount="231" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQI"/>
                <Tax Amount="231" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQI"/>
                <Tax Amount="231" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQI"/>
                <Tax Amount="4457" CountryCode="GB" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="UB"/>
                <TaxSummary Amount="924" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQI"/>
                <TaxSummary Amount="4457" CountryCode="GB" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="UB"/>
                <TotalTax Amount="5381" CurrencyCode="RUB" DecimalPlaces="0"/>
              </Taxes>
              <TotalFare Amount="8801" CurrencyCode="RUB"/>
              <PenaltiesInfo>
                <Penalty Amount="0" Applicability="Before" Changeable="true" ConditionsApply="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                <Penalty Amount="0" Applicability="After" Changeable="true" ConditionsApply="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                <Penalty Amount="27000" Applicability="Before" Cat16Info="true" CurrencyCode="RUB" DecimalPlaces="0" Refundable="true" Type="Refund"/>
                <Penalty Applicability="After" Cat16Info="true" Refundable="false" Type="Refund"/>
              </PenaltiesInfo>
              <TPA_Extensions>
                <Messages>
                  <Message AirlineCode="JL" FailCode="0" Info="RFND RESTR APPLY" Type="N"/>
                  <Message FailCode="0" Info="EACH INF REQUIRES ACCOMPANYING ADT PASSENGER" Type="W"/>
                  <Message FailCode="0" Info="VALIDATING CARRIER" Type="W"/>
                  <Message FailCode="0" Info="BSP - JL" Type="W"/>
                </Messages>
                <BaggageInformationList>
                  <BaggageInformation AirlineCode="JL" ProvisionType="A">
                    <Segment Id="0"/>
                    <Segment Id="1"/>
                    <Allowance Description1="UP TO 50 POUNDS/23 KILOGRAMS" Description2="UP TO 80 LINEAR INCHES/203 LINEAR CENTIMETERS" Pieces="1"/>
                  </BaggageInformation>
                  <BaggageInformation AirlineCode="JL" ProvisionType="A">
                    <Segment Id="2"/>
                    <Segment Id="3"/>
                    <Allowance Description1="UP TO 50 POUNDS/23 KILOGRAMS" Description2="UP TO 80 LINEAR INCHES/203 LINEAR CENTIMETERS" Pieces="1"/>
                  </BaggageInformation>
                  <BaggageInformation AirlineCode="JL" ProvisionType="B">
                    <Segment Id="0"/>
                    <Allowance Description1="UP TO 22 POUNDS/10 KILOGRAMS" Description2="UP TO 45 LINEAR INCHES/115 LINEAR CENTIMETERS" Pieces="1"/>
                  </BaggageInformation>
                  <BaggageInformation AirlineCode="JL" ProvisionType="B">
                    <Segment Id="1"/>
                    <Allowance Description1="UP TO 22 POUNDS/10 KILOGRAMS" Description2="UP TO 45 LINEAR INCHES/115 LINEAR CENTIMETERS" Pieces="1"/>
                  </BaggageInformation>
                  <BaggageInformation AirlineCode="BA" ProvisionType="B">
                    <Segment Id="2"/>
                    <Allowance Description1="UP TO 50 POUNDS/23 KILOGRAMS" Description2="UP TO 50 POUNDS/127 LINEAR CENTIMETERS" Pieces="1"/>
                  </BaggageInformation>
                  <BaggageInformation AirlineCode="JL" ProvisionType="B">
                    <Segment Id="3"/>
                    <Allowance Description1="UP TO 22 POUNDS/10 KILOGRAMS" Description2="UP TO 45 LINEAR INCHES/115 LINEAR CENTIMETERS" Pieces="1"/>
                  </BaggageInformation>
                </BaggageInformationList>
                <SeatSelectionList>
                  <SeatSelection Type="N">
                    <Segment ID="0"/>
                    <Segment ID="1"/>
                    <Segment ID="2"/>
                    <Segment ID="3"/>
                  </SeatSelection>
                </SeatSelectionList>
              </TPA_Extensions>
            </PassengerFare>
            <Endorsements NonRefundableIndicator="true"/>
            <TPA_Extensions>
              <FareCalcLine Info="SYD JL X/TYO JL LON28.31JL X/TYO JL SYD28.31NUC56.62END ROE1.328146"/>
            </TPA_Extensions>
            <FareInfos>
              <FareInfo>
                <FareReference>S</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="M"/>
                </TPA_Extensions>
              </FareInfo>
              <FareInfo>
                <FareReference>S</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="M"/>
                </TPA_Extensions>
              </FareInfo>
              <FareInfo>
                <FareReference>S</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                </TPA_Extensions>
              </FareInfo>
              <FareInfo>
                <FareReference>S</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="M"/>
                </TPA_Extensions>
              </FareInfo>
            </FareInfos>
          </PTC_FareBreakdown>
        </PTC_FareBreakdowns>
        <FareInfos>
          <FareInfo>
            <FareReference>S</FareReference>
            <TPA_Extensions>
              <SeatsRemaining BelowMin="false" Number="9"/>
              <Cabin Cabin="Y"/>
              <Meal Code="M"/>
            </TPA_Extensions>
          </FareInfo>
          <FareInfo>
            <FareReference>S</FareReference>
            <TPA_Extensions>
              <SeatsRemaining BelowMin="false" Number="9"/>
              <Cabin Cabin="Y"/>
              <Meal Code="M"/>
            </TPA_Extensions>
          </FareInfo>
          <FareInfo>
            <FareReference>S</FareReference>
            <TPA_Extensions>
              <SeatsRemaining BelowMin="false" Number="9"/>
              <Cabin Cabin="Y"/>
            </TPA_Extensions>
          </FareInfo>
          <FareInfo>
            <FareReference>S</FareReference>
            <TPA_Extensions>
              <SeatsRemaining BelowMin="false" Number="9"/>
              <Cabin Cabin="Y"/>
              <Meal Code="M"/>
            </TPA_Extensions>
          </FareInfo>
        </FareInfos>
        <TPA_Extensions>
          <DivideInParty Indicator="false"/>
          <AncillaryFeeGroups Message="AIR EXTRAS NOT APPLICABLE OR ARE UNKNOWN FOR THIS ITINERARY"/>
          <ValidatingCarrier NewVcxProcess="true" SettlementMethod="BSP">
            <Default Code="JL"/>
          </ValidatingCarrier>
        </TPA_Extensions>
      </AirItineraryPricingInfo>
      <TicketingInfo TicketType="eTicket" ValidInterline="Yes"/>
      <TPA_Extensions>
        <ValidatingCarrier Code="JL"/>
        <DiversitySwapper WeighedPriceAmount="533239"/>
      </TPA_Extensions>
    </PricedItinerary>
    <!--Другие рекомендации-->
  </PricedItineraries>
  <OneWayItineraries>
    <SimpleOneWayItineraries RPH="1">
      <PricedItinerary SequenceNumber="1">
        <AirItinerary DirectionInd="OneWay">
          <OriginDestinationOptions>
            <OriginDestinationOption ArrivalCountry="GB" DepartureCountry="AU" ElapsedTime="1395">
              <FlightSegment ArrivalDateTime="2022-12-01T21:55:00" DepartureDateTime="2022-12-01T15:45:00" ElapsedTime="550" FlightNumber="100" ResBookDesigCode="V" StopQuantity="0">
                <DepartureAirport LocationCode="SYD" TerminalID="1"/>
                <ArrivalAirport LocationCode="HKG" TerminalID="1"/>
                <OperatingAirline Code="CX" FlightNumber="100"/>
                <Equipment AirEquipType="359"/>
                <MarketingAirline Code="CX"/>
                <MarriageGrp>O</MarriageGrp>
                <DepartureTimeZone GMTOffset="11"/>
                <ArrivalTimeZone GMTOffset="8"/>
                <TPA_Extensions>
                  <eTicket Ind="true"/>
                  <Mileage Amount="4580"/>
                </TPA_Extensions>
              </FlightSegment>
              <FlightSegment ArrivalDateTime="2022-12-02T04:00:00" DepartureDateTime="2022-12-01T23:30:00" ElapsedTime="750" FlightNumber="207" ResBookDesigCode="E" StopQuantity="0">
                <DepartureAirport LocationCode="HKG" TerminalID="1"/>
                <ArrivalAirport LocationCode="LHR" TerminalID="3"/>
                <OperatingAirline Code="VS" FlightNumber="207"/>
                <Equipment AirEquipType="789"/>
                <MarketingAirline Code="VS"/>
                <MarriageGrp>O</MarriageGrp>
                <DepartureTimeZone GMTOffset="8"/>
                <ArrivalTimeZone GMTOffset="0"/>
                <TPA_Extensions>
                  <eTicket Ind="true"/>
                  <Mileage Amount="5994"/>
                </TPA_Extensions>
              </FlightSegment>
            </OriginDestinationOption>
          </OriginDestinationOptions>
        </AirItinerary>
        <AirItineraryPricingInfo BrandsOnAnyMarket="true" FareReturned="true" LastTicketDate="2022-05-23" LastTicketTime="11:44" PricingSource="ADVJR1" PricingSubSource="MIP">
          <ItinTotalFare>
            <BaseFare Amount="2055.00" CurrencyCode="AUD" DecimalPlaces="2"/>
            <FareConstruction Amount="1547.14" CurrencyCode="NUC" DecimalPlaces="2"/>
            <EquivFare Amount="92475" CurrencyCode="RUB" DecimalPlaces="0"/>
            <Taxes>
              <Tax Amount="16636" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="TOTALTAX"/>
            </Taxes>
            <TotalFare Amount="109111" CurrencyCode="RUB" DecimalPlaces="0"/>
          </ItinTotalFare>
          <PTC_FareBreakdowns>
            <PTC_FareBreakdown>
              <PassengerTypeQuantity Code="ADT" Quantity="2"/>
              <FareBasisCodes>
                <FareBasisCode ArrivalAirportCode="HKG" AvailabilityBreak="true" BookingCode="V" DepartureAirportCode="SYD" FareComponentBeginAirport="SYD" FareComponentCabinCode="Y" FareComponentDirectionality="FROM" FareComponentEndAirport="LHR" FareComponentFareRule="E9SY" FareComponentFareTariff="4" FareComponentFareType="XEX" FareComponentFareTypeBitmap="00" FareComponentVendorCode="ATP" GovCarrier="VS">EL00BCSW</FareBasisCode>
                <FareBasisCode ArrivalAirportCode="LHR" AvailabilityBreak="true" BookingCode="E" DepartureAirportCode="HKG" GovCarrier="VS">EL00BCSW</FareBasisCode>
              </FareBasisCodes>
              <PassengerFare>
                <BaseFare Amount="721.00" CurrencyCode="AUD"/>
                <FareConstruction Amount="542.86" CurrencyCode="NUC" DecimalPlaces="2"/>
                <EquivFare Amount="32445" CurrencyCode="RUB" DecimalPlaces="0"/>
                <Taxes>
                  <Tax Amount="2700" CountryCode="AU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="AU"/>
                  <Tax Amount="1408" CountryCode="AU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="WY"/>
                  <Tax Amount="1304" CountryCode="HK" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="G3"/>
                  <Tax Amount="449" CountryCode="HK" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="I5"/>
                  <TaxSummary Amount="2700" CountryCode="AU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="AU"/>
                  <TaxSummary Amount="1408" CountryCode="AU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="WY"/>
                  <TaxSummary Amount="1304" CountryCode="HK" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="G3"/>
                  <TaxSummary Amount="449" CountryCode="HK" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="I5"/>
                  <TotalTax Amount="5861" CurrencyCode="RUB" DecimalPlaces="0"/>
                </Taxes>
                <TotalFare Amount="38306" CurrencyCode="RUB"/>
                <PenaltiesInfo>
                  <Penalty Amount="7040" Applicability="Before" Changeable="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                  <Penalty Amount="7040" Applicability="After" Changeable="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                  <Penalty Amount="7040" Applicability="Before" CurrencyCode="RUB" DecimalPlaces="0" Refundable="true" Type="Refund"/>
                  <Penalty Amount="7040" Applicability="After" CurrencyCode="RUB" DecimalPlaces="0" Refundable="true" Type="Refund"/>
                </PenaltiesInfo>
                <TPA_Extensions>
                  <FareComponents>
                    <FareComponent BrandID="CLASSIC" BrandName="ECONOMY CLASSIC" ProgramCode="CFFVS" ProgramDescription="EX ROW DEFAULT" ProgramID="136131" ProgramSystemCode="X">
                      <Segment FlightIndex="1" LegIndex="1"/>
                      <Segment FlightIndex="2" LegIndex="1"/>
                      <BrandFeatureRef FeatureId="30"/>
                      <BrandFeatureRef FeatureId="79"/>
                      <BrandFeatureRef FeatureId="8"/>
                      <BrandFeatureRef FeatureId="17"/>
                      <BrandFeatureRef FeatureId="22"/>
                      <BrandFeatureRef FeatureId="14"/>
                      <BrandFeatureRef FeatureId="133"/>
                      <BrandFeatureRef FeatureId="105"/>
                      <BrandFeatureRef FeatureId="108"/>
                      <BrandFeatureRef FeatureId="111"/>
                      <BrandFeatureRef FeatureId="157"/>
                      <BrandFeatureRef FeatureId="163"/>
                      <BrandFeatureRef FeatureId="181"/>
                      <BrandFeatureRef FeatureId="187"/>
                      <BrandFeatureRef FeatureId="195"/>
                      <BrandFeatureRef FeatureId="196"/>
                      <BrandFeatureRef FeatureId="192"/>
                      <BrandFeatureRef FeatureId="201"/>
                      <BrandFeatureRef FeatureId="205"/>
                      <BrandFeatureRef FeatureId="213"/>
                    </FareComponent>
                  </FareComponents>
                  <Messages>
                    <Message FailCode="0" Info="VALIDATING CARRIER" Type="W"/>
                    <Message FailCode="0" Info="BSP - VS" Type="W"/>
                    <Message FailCode="0" Info="CAT 15 SALES RESTRICTIONS FREE TEXT FOUND - VERIFY RULES" Type="W"/>
                  </Messages>
                  <BaggageInformationList>
                    <BaggageInformation AirlineCode="VS" ProvisionType="A">
                      <Segment Id="0"/>
                      <Segment Id="1"/>
                      <Allowance Description1="UP TO 50 POUNDS/23 KILOGRAMS" Description2="UP TO 81 LINEAR INCHES/208 LINEAR CENTIMETERS" Pieces="2"/>
                    </BaggageInformation>
                    <BaggageInformation AirlineCode="CX" ProvisionType="B">
                      <Segment Id="0"/>
                      <Allowance Description1="UP TO 15 POUNDS/7 KILOGRAMS" Description2="UP TO 45 LINEAR INCHES/115 LINEAR CENTIMETERS" Pieces="1"/>
                    </BaggageInformation>
                    <BaggageInformation AirlineCode="VS" ProvisionType="B">
                      <Segment Id="1"/>
                      <Allowance Description1="UP TO 22 POUNDS/10 KILOGRAMS" Description2="UP TO 45 LINEAR INCHES/115 LINEAR CENTIMETERS" Pieces="1"/>
                    </BaggageInformation>
                  </BaggageInformationList>
                  <SeatSelectionList>
                    <SeatSelection Type="F">
                      <Segment ID="0"/>
                      <Segment ID="1"/>
                    </SeatSelection>
                  </SeatSelectionList>
                </TPA_Extensions>
              </PassengerFare>
              <Endorsements NonRefundableIndicator="false"/>
              <TPA_Extensions>
                <FareCalcLine Info="SYD CX X/HKG VS LON542.86NUC542.86END ROE1.328146"/>
              </TPA_Extensions>
              <FareInfos>
                <FareInfo>
                  <FareReference>V</FareReference>
                  <TPA_Extensions>
                    <SeatsRemaining BelowMin="false" Number="9"/>
                    <Cabin Cabin="Y"/>
                    <Meal Code="LR"/>
                  </TPA_Extensions>
                </FareInfo>
                <FareInfo>
                  <FareReference>E</FareReference>
                  <TPA_Extensions>
                    <SeatsRemaining BelowMin="false" Number="9"/>
                    <Cabin Cabin="Y"/>
                    <Meal Code="D"/>
                  </TPA_Extensions>
                </FareInfo>
              </FareInfos>
            </PTC_FareBreakdown>
            <PTC_FareBreakdown>
              <PassengerTypeQuantity Code="CNN" Quantity="1"/>
              <FareBasisCodes>
                <FareBasisCode ArrivalAirportCode="HKG" AvailabilityBreak="true" BookingCode="V" DepartureAirportCode="SYD" FareComponentBeginAirport="SYD" FareComponentCabinCode="Y" FareComponentDirectionality="FROM" FareComponentEndAirport="LHR" FareComponentFareRule="E9SY" FareComponentFareTariff="4" FareComponentFareType="XEX" FareComponentFareTypeBitmap="01" FareComponentVendorCode="ATP" GovCarrier="VS">EL00BCSW/CH</FareBasisCode>
                <FareBasisCode ArrivalAirportCode="LHR" AvailabilityBreak="true" BookingCode="E" DepartureAirportCode="HKG" GovCarrier="VS">EL00BCSW/CH</FareBasisCode>
              </FareBasisCodes>
              <PassengerFare>
                <BaseFare Amount="541.00" CurrencyCode="AUD"/>
                <FareConstruction Amount="407.14" CurrencyCode="NUC" DecimalPlaces="2"/>
                <EquivFare Amount="24345" CurrencyCode="RUB" DecimalPlaces="0"/>
                <Taxes>
                  <Tax Amount="1408" CountryCode="AU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="WY"/>
                  <Tax Amount="1304" CountryCode="HK" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="G3"/>
                  <Tax Amount="449" CountryCode="HK" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="I5"/>
                  <TaxSummary Amount="1408" CountryCode="AU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="WY"/>
                  <TaxSummary Amount="1304" CountryCode="HK" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="G3"/>
                  <TaxSummary Amount="449" CountryCode="HK" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="I5"/>
                  <TotalTax Amount="3161" CurrencyCode="RUB" DecimalPlaces="0"/>
                </Taxes>
                <TotalFare Amount="27506" CurrencyCode="RUB"/>
                <PenaltiesInfo>
                  <Penalty Amount="7040" Applicability="Before" Changeable="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                  <Penalty Amount="7040" Applicability="After" Changeable="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                  <Penalty Amount="7040" Applicability="Before" CurrencyCode="RUB" DecimalPlaces="0" Refundable="true" Type="Refund"/>
                  <Penalty Amount="7040" Applicability="After" CurrencyCode="RUB" DecimalPlaces="0" Refundable="true" Type="Refund"/>
                </PenaltiesInfo>
                <TPA_Extensions>
                  <FareComponents>
                    <FareComponent BrandID="CLASSIC" BrandName="ECONOMY CLASSIC" ProgramCode="CFFVS" ProgramDescription="EX ROW DEFAULT" ProgramID="136131" ProgramSystemCode="X">
                      <Segment FlightIndex="1" LegIndex="1"/>
                      <Segment FlightIndex="2" LegIndex="1"/>
                      <BrandFeatureRef FeatureId="30"/>
                      <BrandFeatureRef FeatureId="79"/>
                      <BrandFeatureRef FeatureId="8"/>
                      <BrandFeatureRef FeatureId="17"/>
                      <BrandFeatureRef FeatureId="22"/>
                      <BrandFeatureRef FeatureId="14"/>
                      <BrandFeatureRef FeatureId="133"/>
                      <BrandFeatureRef FeatureId="105"/>
                      <BrandFeatureRef FeatureId="108"/>
                      <BrandFeatureRef FeatureId="111"/>
                      <BrandFeatureRef FeatureId="157"/>
                      <BrandFeatureRef FeatureId="163"/>
                      <BrandFeatureRef FeatureId="181"/>
                      <BrandFeatureRef FeatureId="187"/>
                      <BrandFeatureRef FeatureId="195"/>
                      <BrandFeatureRef FeatureId="196"/>
                      <BrandFeatureRef FeatureId="192"/>
                      <BrandFeatureRef FeatureId="201"/>
                      <BrandFeatureRef FeatureId="205"/>
                      <BrandFeatureRef FeatureId="213"/>
                    </FareComponent>
                  </FareComponents>
                  <Messages>
                    <Message FailCode="0" Info="EACH CNN REQUIRES ACCOMPANYING SAME CABIN ADT" Type="W"/>
                    <Message FailCode="0" Info="VALIDATING CARRIER" Type="W"/>
                    <Message FailCode="0" Info="BSP - VS" Type="W"/>
                    <Message FailCode="0" Info="CAT 15 SALES RESTRICTIONS FREE TEXT FOUND - VERIFY RULES" Type="W"/>
                  </Messages>
                  <BaggageInformationList>
                    <BaggageInformation AirlineCode="VS" ProvisionType="A">
                      <Segment Id="0"/>
                      <Segment Id="1"/>
                      <Allowance Description1="UP TO 50 POUNDS/23 KILOGRAMS" Description2="UP TO 81 LINEAR INCHES/208 LINEAR CENTIMETERS" Pieces="2"/>
                    </BaggageInformation>
                    <BaggageInformation AirlineCode="CX" ProvisionType="B">
                      <Segment Id="0"/>
                      <Allowance Description1="UP TO 15 POUNDS/7 KILOGRAMS" Description2="UP TO 45 LINEAR INCHES/115 LINEAR CENTIMETERS" Pieces="1"/>
                    </BaggageInformation>
                    <BaggageInformation AirlineCode="VS" ProvisionType="B">
                      <Segment Id="1"/>
                      <Allowance Description1="UP TO 22 POUNDS/10 KILOGRAMS" Description2="UP TO 45 LINEAR INCHES/115 LINEAR CENTIMETERS" Pieces="1"/>
                    </BaggageInformation>
                  </BaggageInformationList>
                  <SeatSelectionList>
                    <SeatSelection Type="F">
                      <Segment ID="0"/>
                      <Segment ID="1"/>
                    </SeatSelection>
                  </SeatSelectionList>
                </TPA_Extensions>
              </PassengerFare>
              <Endorsements NonRefundableIndicator="false"/>
              <TPA_Extensions>
                <FareCalcLine Info="SYD CX X/HKG VS LON407.14NUC407.14END ROE1.328146"/>
              </TPA_Extensions>
              <FareInfos>
                <FareInfo>
                  <FareReference>V</FareReference>
                  <TPA_Extensions>
                    <SeatsRemaining BelowMin="false" Number="9"/>
                    <Cabin Cabin="Y"/>
                    <Meal Code="LR"/>
                  </TPA_Extensions>
                </FareInfo>
                <FareInfo>
                  <FareReference>E</FareReference>
                  <TPA_Extensions>
                    <SeatsRemaining BelowMin="false" Number="9"/>
                    <Cabin Cabin="Y"/>
                    <Meal Code="D"/>
                  </TPA_Extensions>
                </FareInfo>
              </FareInfos>
            </PTC_FareBreakdown>
            <PTC_FareBreakdown>
              <PassengerTypeQuantity Code="INF" Quantity="1"/>
              <FareBasisCodes>
                <FareBasisCode ArrivalAirportCode="HKG" AvailabilityBreak="true" BookingCode="V" DepartureAirportCode="SYD" FareComponentBeginAirport="SYD" FareComponentCabinCode="Y" FareComponentDirectionality="FROM" FareComponentEndAirport="LHR" FareComponentFareRule="E9SY" FareComponentFareTariff="4" FareComponentFareType="XEX" FareComponentFareTypeBitmap="01" FareComponentVendorCode="ATP" GovCarrier="VS">EL00BCSW/IN</FareBasisCode>
                <FareBasisCode ArrivalAirportCode="LHR" AvailabilityBreak="true" BookingCode="E" DepartureAirportCode="HKG" GovCarrier="VS">EL00BCSW/IN</FareBasisCode>
              </FareBasisCodes>
              <PassengerFare>
                <BaseFare Amount="72.00" CurrencyCode="AUD"/>
                <FareConstruction Amount="54.28" CurrencyCode="NUC" DecimalPlaces="2"/>
                <EquivFare Amount="3240" CurrencyCode="RUB" DecimalPlaces="0"/>
                <Taxes>
                  <Tax Amount="1304" CountryCode="HK" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="G3"/>
                  <Tax Amount="449" CountryCode="HK" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="I5"/>
                  <TaxSummary Amount="1304" CountryCode="HK" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="G3"/>
                  <TaxSummary Amount="449" CountryCode="HK" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="I5"/>
                  <TotalTax Amount="1753" CurrencyCode="RUB" DecimalPlaces="0"/>
                </Taxes>
                <TotalFare Amount="4993" CurrencyCode="RUB"/>
                <PenaltiesInfo>
                  <Penalty Amount="705" Applicability="Before" Changeable="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                  <Penalty Amount="705" Applicability="After" Changeable="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                  <Penalty Amount="705" Applicability="Before" CurrencyCode="RUB" DecimalPlaces="0" Refundable="true" Type="Refund"/>
                  <Penalty Amount="705" Applicability="After" CurrencyCode="RUB" DecimalPlaces="0" Refundable="true" Type="Refund"/>
                </PenaltiesInfo>
                <TPA_Extensions>
                  <FareComponents>
                    <FareComponent BrandID="CLASSIC" BrandName="ECONOMY CLASSIC" ProgramCode="CFFVS" ProgramDescription="EX ROW DEFAULT" ProgramID="136131" ProgramSystemCode="X">
                      <Segment FlightIndex="1" LegIndex="1"/>
                      <Segment FlightIndex="2" LegIndex="1"/>
                      <BrandFeatureRef FeatureId="30"/>
                      <BrandFeatureRef FeatureId="79"/>
                      <BrandFeatureRef FeatureId="8"/>
                      <BrandFeatureRef FeatureId="17"/>
                      <BrandFeatureRef FeatureId="22"/>
                      <BrandFeatureRef FeatureId="14"/>
                      <BrandFeatureRef FeatureId="133"/>
                      <BrandFeatureRef FeatureId="105"/>
                      <BrandFeatureRef FeatureId="108"/>
                      <BrandFeatureRef FeatureId="111"/>
                      <BrandFeatureRef FeatureId="157"/>
                      <BrandFeatureRef FeatureId="163"/>
                      <BrandFeatureRef FeatureId="181"/>
                      <BrandFeatureRef FeatureId="187"/>
                      <BrandFeatureRef FeatureId="195"/>
                      <BrandFeatureRef FeatureId="196"/>
                      <BrandFeatureRef FeatureId="192"/>
                      <BrandFeatureRef FeatureId="201"/>
                      <BrandFeatureRef FeatureId="205"/>
                      <BrandFeatureRef FeatureId="213"/>
                    </FareComponent>
                  </FareComponents>
                  <Messages>
                    <Message FailCode="0" Info="EACH INF REQUIRES ACCOMPANYING ADT PASSENGER" Type="W"/>
                    <Message FailCode="0" Info="VALIDATING CARRIER" Type="W"/>
                    <Message FailCode="0" Info="BSP - VS" Type="W"/>
                    <Message FailCode="0" Info="CAT 15 SALES RESTRICTIONS FREE TEXT FOUND - VERIFY RULES" Type="W"/>
                  </Messages>
                  <BaggageInformationList>
                    <BaggageInformation AirlineCode="VS" ProvisionType="A">
                      <Segment Id="0"/>
                      <Segment Id="1"/>
                      <Allowance Description1="UP TO 50 POUNDS/23 KILOGRAMS" Description2="UP TO 81 LINEAR INCHES/208 LINEAR CENTIMETERS" Pieces="1"/>
                    </BaggageInformation>
                    <BaggageInformation AirlineCode="VS" ProvisionType="B">
                      <Segment Id="1"/>
                      <Allowance Description1="UP TO 13 POUNDS/6 KILOGRAMS" Description2="UP TO 45 LINEAR INCHES/115 LINEAR CENTIMETERS" Pieces="1" Unit="kg" Weight="6"/>
                    </BaggageInformation>
                  </BaggageInformationList>
                  <SeatSelectionList>
                    <SeatSelection Type="F">
                      <Segment ID="0"/>
                      <Segment ID="1"/>
                    </SeatSelection>
                  </SeatSelectionList>
                </TPA_Extensions>
              </PassengerFare>
              <Endorsements NonRefundableIndicator="false"/>
              <TPA_Extensions>
                <FareCalcLine Info="SYD CX X/HKG VS LON54.28NUC54.28END ROE1.328146"/>
              </TPA_Extensions>
              <FareInfos>
                <FareInfo>
                  <FareReference>V</FareReference>
                  <TPA_Extensions>
                    <SeatsRemaining BelowMin="false" Number="9"/>
                    <Cabin Cabin="Y"/>
                    <Meal Code="LR"/>
                  </TPA_Extensions>
                </FareInfo>
                <FareInfo>
                  <FareReference>E</FareReference>
                  <TPA_Extensions>
                    <SeatsRemaining BelowMin="false" Number="9"/>
                    <Cabin Cabin="Y"/>
                    <Meal Code="D"/>
                  </TPA_Extensions>
                </FareInfo>
              </FareInfos>
            </PTC_FareBreakdown>
          </PTC_FareBreakdowns>
          <FareInfos>
            <FareInfo>
              <FareReference>V</FareReference>
              <TPA_Extensions>
                <SeatsRemaining BelowMin="false" Number="9"/>
                <Cabin Cabin="Y"/>
                <Meal Code="LR"/>
              </TPA_Extensions>
            </FareInfo>
            <FareInfo>
              <FareReference>E</FareReference>
              <TPA_Extensions>
                <SeatsRemaining BelowMin="false" Number="9"/>
                <Cabin Cabin="Y"/>
                <Meal Code="D"/>
              </TPA_Extensions>
            </FareInfo>
          </FareInfos>
          <TPA_Extensions>
            <DivideInParty Indicator="false"/>
            <AncillaryFeeGroups Message="AIR EXTRAS NOT APPLICABLE OR ARE UNKNOWN FOR THIS ITINERARY"/>
            <ValidatingCarrier NewVcxProcess="true" SettlementMethod="BSP">
              <Default Code="VS"/>
            </ValidatingCarrier>
          </TPA_Extensions>
        </AirItineraryPricingInfo>
        <TicketingInfo TicketType="eTicket" ValidInterline="Yes"/>
        <TPA_Extensions>
          <ValidatingCarrier Code="VS"/>
          <DiversitySwapper WeighedPriceAmount="130933"/>
        </TPA_Extensions>
      </PricedItinerary>
      <!--Другие рекомендации-->
    </SimpleOneWayItineraries>
    <SimpleOneWayItineraries RPH="2">
      <PricedItinerary SequenceNumber="1">
        <AirItinerary DirectionInd="OneWay">
          <OriginDestinationOptions>
            <OriginDestinationOption ArrivalCountry="AU" DepartureCountry="GB" ElapsedTime="1945">
              <FlightSegment ArrivalDateTime="2022-12-09T12:40:00" DepartureDateTime="2022-12-08T20:40:00" ElapsedTime="630" FlightNumber="504" ResBookDesigCode="E" StopQuantity="0">
                <DepartureAirport LocationCode="LHR" TerminalID="3"/>
                <ArrivalAirport LocationCode="CMB"/>
                <OperatingAirline Code="UL" FlightNumber="504"/>
                <Equipment AirEquipType="333"/>
                <MarketingAirline Code="UL"/>
                <MarriageGrp>O</MarriageGrp>
                <DepartureTimeZone GMTOffset="0"/>
                <ArrivalTimeZone GMTOffset="5.5"/>
                <TPA_Extensions>
                  <eTicket Ind="true"/>
                  <Mileage Amount="5417"/>
                </TPA_Extensions>
              </FlightSegment>
              <FlightSegment ArrivalDateTime="2022-12-10T16:05:00" DepartureDateTime="2022-12-10T00:05:00" ElapsedTime="630" FlightNumber="606" ResBookDesigCode="E" StopQuantity="0">
                <DepartureAirport LocationCode="CMB"/>
                <ArrivalAirport LocationCode="SYD" TerminalID="1"/>
                <OperatingAirline Code="UL" FlightNumber="606"/>
                <Equipment AirEquipType="333"/>
                <MarketingAirline Code="UL"/>
                <MarriageGrp>I</MarriageGrp>
                <DepartureTimeZone GMTOffset="5.5"/>
                <ArrivalTimeZone GMTOffset="11"/>
                <TPA_Extensions>
                  <eTicket Ind="true"/>
                  <Mileage Amount="5442"/>
                </TPA_Extensions>
              </FlightSegment>
            </OriginDestinationOption>
          </OriginDestinationOptions>
        </AirItinerary>
        <AirItineraryPricingInfo FareReturned="true" PricingSource="ADVJR1" PricingSubSource="MIP">
          <ItinTotalFare>
            <BaseFare Amount="752.00" CurrencyCode="GBP" DecimalPlaces="2"/>
            <FareConstruction Amount="985.15" CurrencyCode="NUC" DecimalPlaces="2"/>
            <EquivFare Amount="59790" CurrencyCode="RUB" DecimalPlaces="0"/>
            <Taxes>
              <Tax Amount="88538" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="TOTALTAX"/>
            </Taxes>
            <TotalFare Amount="148328" CurrencyCode="RUB" DecimalPlaces="0"/>
          </ItinTotalFare>
          <PTC_FareBreakdowns>
            <PTC_FareBreakdown>
              <PassengerTypeQuantity Code="ADT" Quantity="2"/>
              <FareBasisCodes>
                <FareBasisCode ArrivalAirportCode="CMB" BookingCode="E" DepartureAirportCode="LHR" FareComponentBeginAirport="LHR" FareComponentCabinCode="Y" FareComponentDirectionality="FROM" FareComponentEndAirport="SYD" FareComponentFareRule="GB01" FareComponentFareTariff="4" FareComponentFareType="ER" FareComponentFareTypeBitmap="00" FareComponentVendorCode="ATP" GovCarrier="UL">ELOW1GB</FareBasisCode>
                <FareBasisCode ArrivalAirportCode="SYD" AvailabilityBreak="true" BookingCode="E" DepartureAirportCode="CMB" GovCarrier="UL">ELOW1GB</FareBasisCode>
              </FareBasisCodes>
              <PassengerFare>
                <BaseFare Amount="255.00" CurrencyCode="GBP"/>
                <FareConstruction Amount="333.95" CurrencyCode="NUC" DecimalPlaces="2"/>
                <EquivFare Amount="20275" CurrencyCode="RUB" DecimalPlaces="0"/>
                <Taxes>
                  <Tax Amount="16616" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                  <Tax Amount="2502" CountryCode="AU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="WY2"/>
                  <Tax Amount="6678" CountryCode="GB" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="GB"/>
                  <Tax Amount="4457" CountryCode="GB" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="UB"/>
                  <TaxSummary Amount="16616" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                  <TaxSummary Amount="6678" CountryCode="GB" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="GB"/>
                  <TaxSummary Amount="4457" CountryCode="GB" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="UB"/>
                  <TaxSummary Amount="2502" CountryCode="AU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="WY2"/>
                  <TotalTax Amount="30253" CurrencyCode="RUB" DecimalPlaces="0"/>
                </Taxes>
                <TotalFare Amount="50528" CurrencyCode="RUB"/>
                <PenaltiesInfo>
                  <Penalty Amount="25045" Applicability="Before" Changeable="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                  <Penalty Amount="25045" Applicability="After" Changeable="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                  <Penalty Amount="25045" Applicability="Before" CurrencyCode="RUB" DecimalPlaces="0" Refundable="true" Type="Refund"/>
                  <Penalty Amount="25045" Applicability="After" CurrencyCode="RUB" DecimalPlaces="0" Refundable="true" Type="Refund"/>
                </PenaltiesInfo>
                <TPA_Extensions>
                  <Messages>
                    <Message AirlineCode="UL" FailCode="0" Info="CHANGE FEE MAY APPLY/VALID ON UL ONLY" Type="N"/>
                    <Message FailCode="0" Info="VALIDATING CARRIER" Type="W"/>
                    <Message FailCode="0" Info="BSP - UL" Type="W"/>
                  </Messages>
                  <BaggageInformationList>
                    <BaggageInformation AirlineCode="UL" ProvisionType="A">
                      <Segment Id="0"/>
                      <Segment Id="1"/>
                      <Allowance Unit="kg" Weight="30"/>
                    </BaggageInformation>
                    <BaggageInformation AirlineCode="UL" ProvisionType="B">
                      <Segment Id="0"/>
                      <Allowance Description1="UP TO 15 POUNDS/7 KILOGRAMS" Description2="UP TO 45 LINEAR INCHES/115 LINEAR CENTIMETERS" Pieces="1"/>
                    </BaggageInformation>
                    <BaggageInformation AirlineCode="UL" ProvisionType="B">
                      <Segment Id="1"/>
                      <Allowance Description1="UP TO 15 POUNDS/7 KILOGRAMS" Description2="UP TO 45 LINEAR INCHES/115 LINEAR CENTIMETERS" Pieces="1"/>
                    </BaggageInformation>
                  </BaggageInformationList>
                  <SeatSelectionList>
                    <SeatSelection Type="C">
                      <Segment ID="0"/>
                      <Segment ID="1"/>
                    </SeatSelection>
                  </SeatSelectionList>
                </TPA_Extensions>
              </PassengerFare>
              <Endorsements NonRefundableIndicator="false"/>
              <TPA_Extensions>
                <FareCalcLine Info="LON UL X/CMB UL SYD333.95NUC333.95END ROE0.763567"/>
              </TPA_Extensions>
              <FareInfos>
                <FareInfo>
                  <FareReference>E</FareReference>
                  <TPA_Extensions>
                    <SeatsRemaining BelowMin="false" Number="9"/>
                    <Cabin Cabin="Y"/>
                    <Meal Code="BD"/>
                  </TPA_Extensions>
                </FareInfo>
                <FareInfo>
                  <FareReference>E</FareReference>
                  <TPA_Extensions>
                    <SeatsRemaining BelowMin="false" Number="9"/>
                    <Cabin Cabin="Y"/>
                  </TPA_Extensions>
                </FareInfo>
              </FareInfos>
            </PTC_FareBreakdown>
            <PTC_FareBreakdown>
              <PassengerTypeQuantity Code="CNN" Quantity="1"/>
              <FareBasisCodes>
                <FareBasisCode ArrivalAirportCode="CMB" BookingCode="E" DepartureAirportCode="LHR" FareComponentBeginAirport="LHR" FareComponentCabinCode="Y" FareComponentDirectionality="FROM" FareComponentEndAirport="SYD" FareComponentFareRule="GB01" FareComponentFareTariff="4" FareComponentFareType="ER" FareComponentFareTypeBitmap="01" FareComponentVendorCode="ATP" GovCarrier="UL">ELOW1GBCH75</FareBasisCode>
                <FareBasisCode ArrivalAirportCode="SYD" AvailabilityBreak="true" BookingCode="E" DepartureAirportCode="CMB" GovCarrier="UL">ELOW1GBCH75</FareBasisCode>
              </FareBasisCodes>
              <PassengerFare>
                <BaseFare Amount="191.00" CurrencyCode="GBP"/>
                <FareConstruction Amount="250.46" CurrencyCode="NUC" DecimalPlaces="2"/>
                <EquivFare Amount="15185" CurrencyCode="RUB" DecimalPlaces="0"/>
                <Taxes>
                  <Tax Amount="16616" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                  <Tax Amount="2502" CountryCode="AU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="WY2"/>
                  <Tax Amount="4457" CountryCode="GB" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="UB"/>
                  <TaxSummary Amount="16616" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                  <TaxSummary Amount="4457" CountryCode="GB" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="UB"/>
                  <TaxSummary Amount="2502" CountryCode="AU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="WY2"/>
                  <TotalTax Amount="23575" CurrencyCode="RUB" DecimalPlaces="0"/>
                </Taxes>
                <TotalFare Amount="38760" CurrencyCode="RUB"/>
                <PenaltiesInfo>
                  <Penalty Amount="25045" Applicability="Before" Changeable="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                  <Penalty Amount="25045" Applicability="After" Changeable="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                  <Penalty Amount="25045" Applicability="Before" CurrencyCode="RUB" DecimalPlaces="0" Refundable="true" Type="Refund"/>
                  <Penalty Amount="25045" Applicability="After" CurrencyCode="RUB" DecimalPlaces="0" Refundable="true" Type="Refund"/>
                </PenaltiesInfo>
                <TPA_Extensions>
                  <Messages>
                    <Message AirlineCode="UL" FailCode="0" Info="CHANGE FEE MAY APPLY/VALID ON UL ONLY" Type="N"/>
                    <Message FailCode="0" Info="EACH CNN REQUIRES ACCOMPANYING SAME CABIN ADT" Type="W"/>
                    <Message FailCode="0" Info="VALIDATING CARRIER" Type="W"/>
                    <Message FailCode="0" Info="BSP - UL" Type="W"/>
                  </Messages>
                  <BaggageInformationList>
                    <BaggageInformation AirlineCode="UL" ProvisionType="A">
                      <Segment Id="0"/>
                      <Segment Id="1"/>
                      <Allowance Unit="kg" Weight="30"/>
                    </BaggageInformation>
                    <BaggageInformation AirlineCode="UL" ProvisionType="B">
                      <Segment Id="0"/>
                      <Allowance Description1="UP TO 15 POUNDS/7 KILOGRAMS" Description2="UP TO 45 LINEAR INCHES/115 LINEAR CENTIMETERS" Pieces="1"/>
                    </BaggageInformation>
                    <BaggageInformation AirlineCode="UL" ProvisionType="B">
                      <Segment Id="1"/>
                      <Allowance Description1="UP TO 15 POUNDS/7 KILOGRAMS" Description2="UP TO 45 LINEAR INCHES/115 LINEAR CENTIMETERS" Pieces="1"/>
                    </BaggageInformation>
                  </BaggageInformationList>
                  <SeatSelectionList>
                    <SeatSelection Type="C">
                      <Segment ID="0"/>
                      <Segment ID="1"/>
                    </SeatSelection>
                  </SeatSelectionList>
                </TPA_Extensions>
              </PassengerFare>
              <Endorsements NonRefundableIndicator="false"/>
              <TPA_Extensions>
                <FareCalcLine Info="LON UL X/CMB UL SYD250.46NUC250.46END ROE0.763567"/>
              </TPA_Extensions>
              <FareInfos>
                <FareInfo>
                  <FareReference>E</FareReference>
                  <TPA_Extensions>
                    <SeatsRemaining BelowMin="false" Number="9"/>
                    <Cabin Cabin="Y"/>
                    <Meal Code="BD"/>
                  </TPA_Extensions>
                </FareInfo>
                <FareInfo>
                  <FareReference>E</FareReference>
                  <TPA_Extensions>
                    <SeatsRemaining BelowMin="false" Number="9"/>
                    <Cabin Cabin="Y"/>
                  </TPA_Extensions>
                </FareInfo>
              </FareInfos>
            </PTC_FareBreakdown>
            <PTC_FareBreakdown>
              <PassengerTypeQuantity Code="INF" Quantity="1"/>
              <FareBasisCodes>
                <FareBasisCode ArrivalAirportCode="CMB" BookingCode="E" DepartureAirportCode="LHR" FareComponentBeginAirport="LHR" FareComponentCabinCode="Y" FareComponentDirectionality="FROM" FareComponentEndAirport="SYD" FareComponentFareRule="GB01" FareComponentFareTariff="4" FareComponentFareType="ER" FareComponentFareTypeBitmap="01" FareComponentVendorCode="ATP" GovCarrier="UL">ELOW1GBIN20</FareBasisCode>
                <FareBasisCode ArrivalAirportCode="SYD" AvailabilityBreak="true" BookingCode="E" DepartureAirportCode="CMB" GovCarrier="UL">ELOW1GBIN20</FareBasisCode>
              </FareBasisCodes>
              <PassengerFare>
                <BaseFare Amount="51.00" CurrencyCode="GBP"/>
                <FareConstruction Amount="66.79" CurrencyCode="NUC" DecimalPlaces="2"/>
                <EquivFare Amount="4055" CurrencyCode="RUB" DecimalPlaces="0"/>
                <Taxes>
                  <Tax Amount="4457" CountryCode="GB" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="UB"/>
                  <TaxSummary Amount="4457" CountryCode="GB" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="UB"/>
                  <TotalTax Amount="4457" CurrencyCode="RUB" DecimalPlaces="0"/>
                </Taxes>
                <TotalFare Amount="8512" CurrencyCode="RUB"/>
                <PenaltiesInfo>
                  <Penalty Amount="0" Applicability="Before" Changeable="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                  <Penalty Amount="0" Applicability="After" Changeable="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                  <Penalty Amount="0" Applicability="Before" CurrencyCode="RUB" DecimalPlaces="0" Refundable="true" Type="Refund"/>
                  <Penalty Amount="0" Applicability="After" CurrencyCode="RUB" DecimalPlaces="0" Refundable="true" Type="Refund"/>
                </PenaltiesInfo>
                <TPA_Extensions>
                  <Messages>
                    <Message AirlineCode="UL" FailCode="0" Info="CHANGE FEE MAY APPLY/VALID ON UL ONLY" Type="N"/>
                    <Message FailCode="0" Info="EACH INF REQUIRES ACCOMPANYING ADT PASSENGER" Type="W"/>
                    <Message FailCode="0" Info="VALIDATING CARRIER" Type="W"/>
                    <Message FailCode="0" Info="BSP - UL" Type="W"/>
                  </Messages>
                  <BaggageInformationList>
                    <BaggageInformation AirlineCode="UL" ProvisionType="A">
                      <Segment Id="0"/>
                      <Segment Id="1"/>
                      <Allowance Unit="kg" Weight="10"/>
                    </BaggageInformation>
                    <BaggageInformation AirlineCode="UL" ProvisionType="B">
                      <Segment Id="0"/>
                      <Allowance Description1="UP TO 11 POUNDS/5 KILOGRAMS" Description2="UP TO 45 LINEAR INCHES/115 LINEAR CENTIMETERS" Pieces="1"/>
                    </BaggageInformation>
                    <BaggageInformation AirlineCode="UL" ProvisionType="B">
                      <Segment Id="1"/>
                      <Allowance Description1="UP TO 11 POUNDS/5 KILOGRAMS" Description2="UP TO 45 LINEAR INCHES/115 LINEAR CENTIMETERS" Pieces="1"/>
                    </BaggageInformation>
                  </BaggageInformationList>
                  <SeatSelectionList>
                    <SeatSelection Type="C">
                      <Segment ID="0"/>
                      <Segment ID="1"/>
                    </SeatSelection>
                  </SeatSelectionList>
                </TPA_Extensions>
              </PassengerFare>
              <Endorsements NonRefundableIndicator="false"/>
              <TPA_Extensions>
                <FareCalcLine Info="LON UL X/CMB UL SYD66.79NUC66.79END ROE0.763567"/>
              </TPA_Extensions>
              <FareInfos>
                <FareInfo>
                  <FareReference>E</FareReference>
                  <TPA_Extensions>
                    <SeatsRemaining BelowMin="false" Number="9"/>
                    <Cabin Cabin="Y"/>
                    <Meal Code="BD"/>
                  </TPA_Extensions>
                </FareInfo>
                <FareInfo>
                  <FareReference>E</FareReference>
                  <TPA_Extensions>
                    <SeatsRemaining BelowMin="false" Number="9"/>
                    <Cabin Cabin="Y"/>
                  </TPA_Extensions>
                </FareInfo>
              </FareInfos>
            </PTC_FareBreakdown>
          </PTC_FareBreakdowns>
          <FareInfos>
            <FareInfo>
              <FareReference>E</FareReference>
              <TPA_Extensions>
                <SeatsRemaining BelowMin="false" Number="9"/>
                <Cabin Cabin="Y"/>
                <Meal Code="BD"/>
              </TPA_Extensions>
            </FareInfo>
            <FareInfo>
              <FareReference>E</FareReference>
              <TPA_Extensions>
                <SeatsRemaining BelowMin="false" Number="9"/>
                <Cabin Cabin="Y"/>
              </TPA_Extensions>
            </FareInfo>
          </FareInfos>
          <TPA_Extensions>
            <DivideInParty Indicator="false"/>
            <AncillaryFeeGroups>
              <AncillaryFeeGroup Code="BG" Name="BAGGAGE">
                <AncillaryFeeItem Amount="46785" AncillaryTypeCode="F" BaggageID="1" Carrier="UL" Date="2022-12-08" Description="UPTO33LB 15KG BAGGAGE" Description1="UP TO 33 POUNDS/15 KILOGRAMS" DestinationAirport="SYD" EndSegment="2" OriginAirport="LHR" PassengerCode="ALL" StartSegment="1" Subcode="0C1"/>
                <AncillaryFeeItem Amount="62400" AncillaryTypeCode="F" BaggageID="2" Carrier="UL" Date="2022-12-08" Description="UPTO44LB 20KG BAGGAGE" Description1="UP TO 44 POUNDS/20 KILOGRAMS" DestinationAirport="SYD" EndSegment="2" OriginAirport="LHR" PassengerCode="ALL" StartSegment="1" Subcode="0C2"/>
                <AncillaryFeeItem Amount="78020" AncillaryTypeCode="F" BaggageID="3" Carrier="UL" Date="2022-12-08" Description="UPTO55LB 25KG BAGGAGE" Description1="UP TO 55 POUNDS/25 KILOGRAMS" DestinationAirport="SYD" EndSegment="2" OriginAirport="LHR" PassengerCode="ALL" StartSegment="1" Subcode="0C4"/>
                <AncillaryFeeItem Amount="106115" AncillaryTypeCode="F" BaggageID="4" Carrier="UL" Date="2022-12-08" Description="UPTO66LB 30KG BAGGAGE" Description1="UP TO 66 POUNDS/30 KILOGRAMS" DestinationAirport="SYD" EndSegment="2" OriginAirport="LHR" PassengerCode="ALL" StartSegment="1" Subcode="0C5"/>
                <AncillaryFeeItem Amount="123780" AncillaryTypeCode="F" BaggageID="5" Carrier="UL" Date="2022-12-08" Description="UPTO35KG BAGGAGE" Description1="UP TO 77 POUNDS/35 KILOGRAMS" DestinationAirport="SYD" EndSegment="2" OriginAirport="LHR" PassengerCode="ALL" StartSegment="1" Subcode="0C7"/>
                <AncillaryFeeItem Amount="141440" AncillaryTypeCode="F" BaggageID="6" Carrier="UL" Date="2022-12-08" Description="UPTO40KG BAGGAGE" Description1="UP TO 88 POUNDS/40 KILOGRAMS" DestinationAirport="SYD" EndSegment="2" OriginAirport="LHR" PassengerCode="ALL" StartSegment="1" Subcode="0C8"/>
                <AncillaryFeeItem Amount="159105" AncillaryTypeCode="F" BaggageID="7" Carrier="UL" Date="2022-12-08" Description="UPTO100LB 45KG BAGGAGE" Description1="UP TO 100 POUNDS/45 KILOGRAMS" DestinationAirport="SYD" EndSegment="2" OriginAirport="LHR" PassengerCode="ALL" StartSegment="1" Subcode="0C9"/>
                <AncillaryFeeItem Amount="15620" AncillaryTypeCode="F" BaggageID="8" Carrier="UL" Date="2022-12-08" Description="UPTO11LB 5KG BAGGAGE" Description1="UP TO 11 POUNDS/5 KILOGRAMS" DestinationAirport="SYD" EndSegment="2" OriginAirport="LHR" PassengerCode="ALL" StartSegment="1" Subcode="0CW"/>
                <AncillaryFeeItem Amount="31235" AncillaryTypeCode="F" BaggageID="9" Carrier="UL" Date="2022-12-08" Description="UPTO22LB 10KG BAGGAGE" Description1="UP TO 22 POUNDS/10 KILOGRAMS" DestinationAirport="SYD" EndSegment="2" OriginAirport="LHR" PassengerCode="ALL" StartSegment="1" Subcode="0CZ"/>
                <AncillaryFeeItem Amount="176835" AncillaryTypeCode="F" BaggageID="10" Carrier="UL" Date="2022-12-08" Description="UPTO110LB 50KG BAGGAGE" Description1="UP TO 110 POUNDS/50 KILOGRAMS" DestinationAirport="SYD" EndSegment="2" OriginAirport="LHR" PassengerCode="ALL" StartSegment="1" Subcode="0I7"/>
              </AncillaryFeeGroup>
            </AncillaryFeeGroups>
            <ValidatingCarrier NewVcxProcess="true" SettlementMethod="BSP">
              <Default Code="UL"/>
            </ValidatingCarrier>
          </TPA_Extensions>
        </AirItineraryPricingInfo>
        <TicketingInfo TicketType="eTicket" ValidInterline="Yes"/>
        <TPA_Extensions>
          <ValidatingCarrier Code="UL"/>
          <DiversitySwapper WeighedPriceAmount="221920"/>
        </TPA_Extensions>
      </PricedItinerary>
      <!--Другие рекомендации-->
    </SimpleOneWayItineraries>
  </OneWayItineraries>
</OTA_AirLowFareSearchRS>
```
{{< /details >}}

---

{{< details title="Пример запроса (оформление на нескольких билетах (SOW), GIR ответ)" >}}
```XML
<OTA_AirLowFareSearchRQ ResponseType="GIR" Version="6.5.0" xmlns="http://www.opentravel.org/OTA/2003/05">
  <POS>
    <Source PseudoCityCode="9LSC">
      <RequestorID ID="1" Type="1">
        <CompanyName Code="TN"/>
      </RequestorID>
    </Source>
  </POS>
  <OriginDestinationInformation RPH="1">
    <DepartureDateTime>2022-12-01T11:00:00</DepartureDateTime>
    <OriginLocation LocationCode="SYD"/>
    <DestinationLocation LocationCode="LON"/>
  </OriginDestinationInformation>
  <OriginDestinationInformation RPH="2">
    <DepartureDateTime>2022-12-08T11:00:00</DepartureDateTime>
    <OriginLocation LocationCode="LON"/>
    <DestinationLocation LocationCode="SYD"/>
  </OriginDestinationInformation>
  <TravelPreferences ValidInterlineTicket="true">
    <CabinPref Cabin="Economy" PreferLevel="Preferred"/>
    <TPA_Extensions>
      <LongConnectTime Enable="true"/>
      <LongConnectPoints Max="3" Min="1"/>
      <KeepSameCabin Enabled="true"/>
      <ExcludeCallDirectCarriers Enabled="true"/>
      <SeatSelection Info="true"/>
      <DiversityParameters AdditionalNonStopsPercentage="100"/>
    </TPA_Extensions>
    <AncillaryFees Enable="true">
      <AncillaryFeeGroup Code="BG"/>
    </AncillaryFees>
    <Baggage CarryOnInfo="true" Description="true" RequestType="A"/>
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
```
{{< /details >}}

{{< details title="Пример ответа" >}}
```XML
<GroupedItineraryResponse Version="6.5.0" xmlns="http://webservices.sabre.com/wsdl/sabreXML1.0.00/shopping/GroupedItineraryResponse" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <Message Code="GCA14-ISELL-TN-00-2022-05-00-BBHD" Severity="Info" Text="27041" Type="SERVER"/>
  <Message Code="TRANSACTIONID" Severity="Info" Text="2259455144494665856" Type="WORKERTHREAD"/>
  <Message Code="RULEID" Severity="Info" Text="15936" Type="DRE"/>
  <Message Code="RULEID" Severity="Info" Text="27757" Type="DEFAULT"/>
  <Message Code="PROCESS" Severity="Error" Text="Communication error: Transmission timeout" Type="MIP"/>
  <Statistics Itineraries="122" OneWay="61"/>
  <ScheduleDesc ETicketable="true" ElapsedTime="470" Frequency="*MTWTFS" ID="1" Stops="0" TotalMilesFlown="3420">
    <Departure Airport="DXB" City="DXB" Country="AE" Terminal="3" Time="14:30:00+04:00"/>
    <Arrival Airport="LHR" City="LON" Country="GB" Terminal="3" Time="18:20:00Z"/>
    <Carrier Disclosure="EK" Marketing="QF" MarketingFlightNumber="8003" Operating="EK" OperatingFlightNumber="3">
      <Equipment Code="388" TypeForFirstLeg="W" TypeForLastLeg="W"/>
    </Carrier>
  </ScheduleDesc>
  <ScheduleDesc ETicketable="true" ElapsedTime="700" Frequency="SMTWTFS" ID="2" Stops="0" TotalMilesFlown="5974">
    <Departure Airport="LHR" City="LON" Country="GB" Terminal="5" Time="13:45:00Z"/>
    <Arrival Airport="HND" City="TYO" Country="JP" DateAdjustment="1" Terminal="3" Time="10:25:00+09:00"/>
    <Carrier Disclosure="BA" Marketing="JL" MarketingFlightNumber="7120" Operating="BA" OperatingFlightNumber="5">
      <Equipment Code="789" TypeForFirstLeg="W" TypeForLastLeg="W"/>
    </Carrier>
  </ScheduleDesc>
  <ScheduleDesc ETicketable="true" ElapsedTime="785" Frequency="*M*WTFS" ID="3" Stops="0" TotalMilesFlown="6193">
    <Departure Airport="SIN" City="SIN" Country="SG" Terminal="3" Time="00:30:00+08:00"/>
    <Arrival Airport="CPH" City="CPH" Country="DK" Terminal="3" Time="06:35:00+01:00"/>
    <Carrier Disclosure="SQ" Marketing="SK" MarketingFlightNumber="8000" Operating="SQ" OperatingFlightNumber="352">
      <Equipment Code="359" TypeForFirstLeg="W" TypeForLastLeg="W"/>
    </Carrier>
  </ScheduleDesc>
  <ScheduleDesc ETicketable="true" ElapsedTime="905" Frequency="SMTWTF*" ID="4" Stops="0" TotalMilesFlown="7417">
    <Departure Airport="SFO" City="SFO" Country="US" State="CA" Terminal="I" Time="23:00:00-08:00"/>
    <Arrival Airport="SYD" City="SYD" Country="AU" DateAdjustment="2" State="NS" Terminal="1" Time="09:05:00+11:00"/>
    <Carrier Marketing="UA" MarketingFlightNumber="863" Operating="UA" OperatingFlightNumber="863">
      <Equipment Code="789" TypeForFirstLeg="W" TypeForLastLeg="W"/>
    </Carrier>
  </ScheduleDesc>
  <ScheduleDesc ETicketable="true" ElapsedTime="630" Frequency="SMTWTF*" ID="5" Stops="0" TotalMilesFlown="5456">
    <Departure Airport="LAX" City="LAX" Country="US" State="CA" Terminal="7" Time="17:30:00-08:00"/>
    <Arrival Airport="LHR" City="LON" Country="GB" DateAdjustment="1" Terminal="2" Time="12:00:00Z"/>
    <Carrier Marketing="UA" MarketingFlightNumber="923" Operating="UA" OperatingFlightNumber="923">
      <Equipment Code="789" TypeForFirstLeg="W" TypeForLastLeg="W"/>
    </Carrier>
  </ScheduleDesc>
  <!--Другие рейсы-->
  <TaxDesc Amount="252" Code="QR2" Country="AU" Currency="RUB" Description="PASSENGER SERVICE CHARGE DOMESTIC ARRIVAL" ID="1" PublishedAmount="5.59" PublishedCurrency="AUD" Station="SYD"/>
  <TaxDesc Amount="4770" Code="YQF" Currency="RUB" Description="SERVICE FEE - CARRIER-IMPOSED FUEL" ID="2" PublishedAmount="106.00" PublishedCurrency="AUD" Station="SYD"/>
  <TaxDesc Amount="58" Code="YQI" Currency="RUB" Description="SERVICE FEE - CARRIER-IMPOSED MISC" ID="3" PublishedAmount="0.90" PublishedCurrency="USD" Station="ICN"/>
  <TaxDesc Amount="10356" Code="YRF" Currency="RUB" Description="SERVICE FEE - CARRIER-IMPOSED FUEL" ID="4" PublishedAmount="161.80" PublishedCurrency="USD" Station="SYD"/>
  <TaxDesc Amount="291" Code="G1" Country="MY" Currency="RUB" Description="DEPARTURE LEVY" ID="5" PublishedAmount="20.00" PublishedCurrency="MYR" Station="KUL"/>
  <!--Другие таксы-->
  <TaxSummaryDesc Amount="898" Code="I5" Country="HK" Currency="RUB" Description="AIRPORT PASSENGER SECURITY CHARGE" ID="1" PublishedAmount="55" PublishedCurrency="HKD" Station="HKG"/>
  <TaxSummaryDesc Amount="4770" Code="YQF" Currency="RUB" Description="SERVICE FEE - CARRIER-IMPOSED FUEL" ID="2" PublishedAmount="106.00" PublishedCurrency="AUD" Station="SYD"/>
  <TaxSummaryDesc Amount="462" Code="YQI" Currency="RUB" Description="SERVICE FEE - CARRIER-IMPOSED MISC" ID="3" PublishedAmount="3.60" PublishedCurrency="USD" Station="SYD"/>
  <TaxSummaryDesc Amount="20814" Code="YQF" Currency="RUB" Description="SERVICE FEE - CARRIER-IMPOSED FUEL" ID="4" PublishedAmount="221.00" PublishedCurrency="AUD" Station="SYD"/>
  <TaxSummaryDesc Amount="291" Code="G1" Country="MY" Currency="RUB" Description="DEPARTURE LEVY" ID="5" PublishedAmount="20.00" PublishedCurrency="MYR" Station="KUL"/>
  <!--Другие таксы-->
  <OBFeeDesc Amount="0" Currency="RUB" ID="1"/>
  <BrandFeatureDesc Application="C" CommercialName="PREFERRED SEAT SELECTION" ID="1" ServiceGroup="BF" ServiceType="Z" SubCode="VS6" Vendor="ATP"/>
  <BrandFeatureDesc Application="F" CommercialName="75 PERCENT MILES EARNED" ID="2" ServiceGroup="BF" ServiceType="Z" SubCode="06C" Vendor="ATP"/>
  <BrandFeatureDesc Application="F" CommercialName="GOLF EQUIPMENT UP TO 15 KG" ID="3" ServiceGroup="BG" ServiceType="C" SubCode="0D4" Vendor="ATP"/>
  <BrandFeatureDesc Application="D" CommercialName="PRIORITY SECURITY" ID="4" ServiceGroup="TS" ServiceType="F" SubCode="0LW" Vendor="ATP"/>
  <BrandFeatureDesc Application="C" CommercialName="SECOND EXCESS BAG" ID="5" ServiceGroup="BG" ServiceType="C" SubCode="0CD" Vendor="ATP"/>
  <!--Другие услуги-->
  <FareComponentDesc ApplicablePricingCategories="8 9 10 12 15 16 19" CabinCode="Y" Direction="EH" Directionality="FROM" FareAmount="3889.63" FareBasisCode="YOWCH" FareCurrency="GBP" FarePassengerType="CNN" FareRule="2200" FareTariff="4" FareType="EU" FareTypeBitmap="01" GoverningCarrier="QF" ID="1" Mileage="true" MileageSurcharge="0" NotValidAfter="2022-12-08" NotValidBefore="2022-12-08" OneWayFare="true" PublishedFareAmount="2970.00" VendorCode="ATP">
    <Segment/>
    <Brand BrandName="ECONOMY FLEX" Code="ECFL" ProgramCode="CFFQF" ProgramDescription="QFAREA2" ProgramID="136478" ProgramSystemCode="C"/>
  </FareComponentDesc>
  <FareComponentDesc ApplicablePricingCategories="4 5 6 7 8 9 10 11 15 16 18 23" CabinCode="Y" Direction="EH" Directionality="FROM" FareAmount="506.83" FareBasisCode="KOWOSVB" FareCurrency="GBP" FarePassengerType="ADT" FareRule="SV01" FareTariff="4" FareType="PRO" FareTypeBitmap="00" GoverningCarrier="TG" ID="2" NotValidAfter="2022-12-08" NotValidBefore="2022-12-08" OneWayFare="true" PublishedFareAmount="387.00" VendorCode="ATP">
    <Segment/>
    <Segment/>
  </FareComponentDesc>
  <FareComponentDesc ApplicablePricingCategories="2 3 4 5 7 8 9 10 12 15 16 18 23" CabinCode="Y" Direction="EH" Directionality="FROM" FareAmount="778.15" FareBasisCode="QLWC2AU" FareCurrency="AUD" FarePassengerType="ADT" FareRule="AUGD" FareTariff="4" FareType="XEX" FareTypeBitmap="00" GoverningCarrier="EY" ID="3" NotValidAfter="2022-12-01" NotValidBefore="2022-12-01" PublishedFareAmount="2067.00" VendorCode="ATP">
    <Segment/>
    <Segment Stopover="true">
      <Surcharge Amount="25.00" Currency="NUC" Description="MISCELLANEOUS/OTHER" Type="Q"/>
    </Segment>
    <Brand BrandName="ECONOMY CHOICE" Code="YC" ProgramCode="CFFEY" ProgramDescription="17AUD BP30" ProgramID="125938" ProgramSystemCode="M"/>
  </FareComponentDesc>
  <FareComponentDesc ApplicablePricingCategories="4 5 7 8 9 10 15 16 18 19" CabinCode="Y" Direction="TS" Directionality="TO" FareAmount="28.31" FareBasisCode="SNN0NPCE/IN90" FareCurrency="AUD" FarePassengerType="INF" FareRule="2291" FareTariff="44" FareType="XEX" FareTypeBitmap="01" GoverningCarrier="JL" ID="4" NotValidAfter="2023-12-01" PublishedFareAmount="76.00" TicketDesignator="IN90" VendorCode="ATP">
    <Segment/>
    <Segment/>
  </FareComponentDesc>
  <FareComponentDesc ApplicablePricingCategories="2 3 4 5 6 7 8 9 10 11 12 15 16 18" CabinCode="Y" Direction="AP" Directionality="FROM" FareAmount="636.22" FareBasisCode="TJX00NDT" FareCurrency="AUD" FarePassengerType="ADT" FareRule="2RUE" FareTariff="307" FareType="XPX" FareTypeBitmap="00" GoverningCarrier="UA" ID="5" NotValidAfter="2023-12-01" PublishedFareAmount="1690.00" VendorCode="ATP">
    <Segment/>
    <Segment Stopover="true"/>
    <Brand BrandName="ECONOMY" Code="ECONOMY" ProgramCode="A1S" ProgramDescription="ATLANTIC SPAC" ProgramID="139065" ProgramSystemCode="G"/>
  </FareComponentDesc>
  <!--Другие компоненты тарифов-->
  <ValidatingCarrierDesc ID="1" NewVcxProcess="true" SettlementMethod="BSP">
    <Default Code="HR"/>
  </ValidatingCarrierDesc>
  <ValidatingCarrierDesc ID="2" NewVcxProcess="true" SettlementMethod="TCH">
    <Default Code="EK"/>
  </ValidatingCarrierDesc>
  <ValidatingCarrierDesc ID="3" NewVcxProcess="true" SettlementMethod="BSP">
    <Default Code="UA"/>
  </ValidatingCarrierDesc>
  <ValidatingCarrierDesc ID="4" NewVcxProcess="true" SettlementMethod="BSP">
    <Default Code="AF"/>
  </ValidatingCarrierDesc>
  <ValidatingCarrierDesc ID="5" NewVcxProcess="true" SettlementMethod="BSP">
    <Default Code="MH"/>
  </ValidatingCarrierDesc>
  <!--Другие валидирующие перевозчики-->
  <BaggageAllowanceDesc Description1="UP TO 50 POUNDS/23 KILOGRAMS" Description2="UP TO 45 LINEAR INCHES/115 LINEAR CENTIMETERS" ID="1" Pieces="1"/>
  <BaggageAllowanceDesc Description1="UP TO 50 POUNDS/23 KILOGRAMS" Description2="UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS" ID="2" Pieces="1"/>
  <BaggageAllowanceDesc Description1="UP TO 34 LINEAR INCHES/85 LINEAR CENTIMETERS" ID="3" Pieces="1"/>
  <BaggageAllowanceDesc Description1="UP TO 22 POUNDS/10 KILOGRAMS" Description2="UP TO 45 LINEAR INCHES/115 LINEAR CENTIMETERS" ID="4" Pieces="1"/>
  <BaggageAllowanceDesc ID="5" Pieces="1" Unit="kg" Weight="7"/>
  <!--Другие нормы провоза багажа-->
  <LegDesc ElapsedTime="2170" ID="1">
    <Schedule Ref="44"/>
    <Schedule DepartureDateAdjustment="1" Ref="11"/>
  </LegDesc>
  <LegDesc ElapsedTime="2035" ID="2">
    <Schedule Ref="107"/>
    <Schedule Ref="109"/>
  </LegDesc>
  <LegDesc ElapsedTime="2675" ID="3">
    <Schedule Ref="36"/>
    <Schedule DepartureDateAdjustment="1" Ref="7"/>
  </LegDesc>
  <LegDesc ElapsedTime="2795" ID="4">
    <Schedule Ref="46"/>
    <Schedule DepartureDateAdjustment="2" Ref="31"/>
  </LegDesc>
  <LegDesc ElapsedTime="1355" ID="5">
    <Schedule Ref="89"/>
    <Schedule DepartureDateAdjustment="1" Ref="132"/>
  </LegDesc>
  <!--Другие плечи-->
  <ItineraryGroup>
    <GroupDescription>
      <LegDescription ArrivalLocation="LHR" DepartureDate="2022-12-01" DepartureLocation="SYD"/>
      <LegDescription ArrivalLocation="SYD" DepartureDate="2022-12-08" DepartureLocation="LHR"/>
    </GroupDescription>
    <Itinerary ID="1" PricingSource="ADVJR1">
      <Leg Ref="21"/>
      <Leg Ref="13"/>
      <PricingInformation PricingSubsource="MIP">
        <Fare ETicketable="true" GoverningCarriers="JL JL" LastTicketDate="2022-05-27" LastTicketTime="23:59" VITA="true" ValidatingCarrierCode="JL">
          <PassengerInfo NonRefundable="true" PassengerNumber="2" PassengerType="ADT">
            <FareComponent Ref="87">
              <Segment BookingCode="S" CabinCode="Y" MealCode="M" SeatsAvailable="9"/>
              <Segment AvailabilityBreak="true" BookingCode="S" CabinCode="Y" MealCode="M" SeatsAvailable="9"/>
            </FareComponent>
            <FareComponent Ref="181">
              <Segment BookingCode="S" CabinCode="Y" SeatsAvailable="9"/>
              <Segment AvailabilityBreak="true" BookingCode="S" CabinCode="Y" MealCode="M" SeatsAvailable="9"/>
            </FareComponent>
            <Tax Ref="54"/>
            <Tax Ref="57"/>
            <Tax Ref="33"/>
            <Tax Ref="92"/>
            <Tax Ref="126"/>
            <Tax Ref="92"/>
            <Tax Ref="74"/>
            <Tax Ref="98"/>
            <Tax Ref="100"/>
            <Tax Ref="35"/>
            <Tax Ref="46"/>
            <Tax Ref="113"/>
            <Tax Ref="113"/>
            <TaxSummary Ref="4"/>
            <TaxSummary Ref="78"/>
            <TaxSummary Ref="62"/>
            <TaxSummary Ref="93"/>
            <TaxSummary Ref="32"/>
            <TaxSummary Ref="49"/>
            <CurrencyConversion ExchangeRateUsed="45" From="AUD" To="RUB"/>
            <FareMessage Carrier="JL" Code="0" Info="RFND RESTR APPLY" Type="N"/>
            <FareMessage Code="0" Info="VALIDATING CARRIER" Type="W"/>
            <FareMessage Code="0" Info="BSP - JL" Type="W"/>
            <PassengerTotalFare BaseFareAmount="752.00" BaseFareCurrency="AUD" CommissionAmount="0" CommissionPercentage="0" ConstructionAmount="566.20" ConstructionCurrency="NUC" Currency="RUB" EquivalentAmount="33840" EquivalentCurrency="RUB" ExchangeRateOne="1.32814600" TotalFare="72845" TotalTaxes="39005"/>
            <BaggageInformation AirlineCode="JL" ProvisionType="A">
              <Segment ID="0"/>
              <Segment ID="1"/>
              <Allowance Ref="45"/>
            </BaggageInformation>
            <BaggageInformation AirlineCode="JL" ProvisionType="A">
              <Segment ID="2"/>
              <Segment ID="3"/>
              <Allowance Ref="45"/>
            </BaggageInformation>
            <BaggageInformation AirlineCode="JL" ProvisionType="B">
              <Segment ID="0"/>
              <Allowance Ref="56"/>
            </BaggageInformation>
            <BaggageInformation AirlineCode="JL" ProvisionType="B">
              <Segment ID="1"/>
              <Allowance Ref="56"/>
            </BaggageInformation>
            <BaggageInformation AirlineCode="BA" ProvisionType="B">
              <Segment ID="2"/>
              <Allowance Ref="3"/>
            </BaggageInformation>
            <BaggageInformation AirlineCode="JL" ProvisionType="B">
              <Segment ID="3"/>
              <Allowance Ref="56"/>
            </BaggageInformation>
            <PenaltiesInfo>
              <Penalty Amount="0" Applicability="Before" Changeable="true" ConditionsApply="true" Currency="RUB" Type="Exchange"/>
              <Penalty Amount="0" Applicability="After" Changeable="true" ConditionsApply="true" Currency="RUB" Type="Exchange"/>
              <Penalty Amount="27000" Applicability="Before" Cat16Info="true" Currency="RUB" Refundable="true" Type="Refund"/>
              <Penalty Applicability="After" Cat16Info="true" Refundable="false" Type="Refund"/>
            </PenaltiesInfo>
            <SeatSelection Type="N">
              <Segment ID="0"/>
              <Segment ID="1"/>
              <Segment ID="2"/>
              <Segment ID="3"/>
            </SeatSelection>
          </PassengerInfo>
          <PassengerInfo NonRefundable="true" PassengerNumber="1" PassengerType="CNN">
            <FareComponent Ref="78">
              <Segment BookingCode="S" CabinCode="Y" MealCode="M" SeatsAvailable="9"/>
              <Segment AvailabilityBreak="true" BookingCode="S" CabinCode="Y" MealCode="M" SeatsAvailable="9"/>
            </FareComponent>
            <FareComponent Ref="61">
              <Segment BookingCode="S" CabinCode="Y" SeatsAvailable="9"/>
              <Segment AvailabilityBreak="true" BookingCode="S" CabinCode="Y" MealCode="M" SeatsAvailable="9"/>
            </FareComponent>
            <Tax Ref="54"/>
            <Tax Ref="57"/>
            <Tax Ref="33"/>
            <Tax Ref="92"/>
            <Tax Ref="126"/>
            <Tax Ref="92"/>
            <Tax Ref="98"/>
            <Tax Ref="100"/>
            <Tax Ref="46"/>
            <Tax Ref="93"/>
            <Tax Ref="93"/>
            <TaxSummary Ref="4"/>
            <TaxSummary Ref="62"/>
            <TaxSummary Ref="90"/>
            <TaxSummary Ref="49"/>
            <CurrencyConversion ExchangeRateUsed="45" From="AUD" To="RUB"/>
            <FareMessage Carrier="JL" Code="0" Info="RFND RESTR APPLY" Type="N"/>
            <FareMessage Code="0" Info="EACH CNN REQUIRES ACCOMPANYING SAME CABIN ADT" Type="W"/>
            <FareMessage Code="0" Info="VALIDATING CARRIER" Type="W"/>
            <FareMessage Code="0" Info="BSP - JL" Type="W"/>
            <PassengerTotalFare BaseFareAmount="564.00" BaseFareCurrency="AUD" CommissionAmount="0" CommissionPercentage="0" ConstructionAmount="424.64" ConstructionCurrency="NUC" Currency="RUB" EquivalentAmount="25380" EquivalentCurrency="RUB" ExchangeRateOne="1.32814600" TotalFare="54275" TotalTaxes="28895"/>
            <BaggageInformation AirlineCode="JL" ProvisionType="A">
              <Segment ID="0"/>
              <Segment ID="1"/>
              <Allowance Ref="45"/>
            </BaggageInformation>
            <BaggageInformation AirlineCode="JL" ProvisionType="A">
              <Segment ID="2"/>
              <Segment ID="3"/>
              <Allowance Ref="45"/>
            </BaggageInformation>
            <BaggageInformation AirlineCode="JL" ProvisionType="B">
              <Segment ID="0"/>
              <Allowance Ref="56"/>
            </BaggageInformation>
            <BaggageInformation AirlineCode="JL" ProvisionType="B">
              <Segment ID="1"/>
              <Allowance Ref="56"/>
            </BaggageInformation>
            <BaggageInformation AirlineCode="BA" ProvisionType="B">
              <Segment ID="2"/>
              <Allowance Ref="3"/>
            </BaggageInformation>
            <BaggageInformation AirlineCode="JL" ProvisionType="B">
              <Segment ID="3"/>
              <Allowance Ref="56"/>
            </BaggageInformation>
            <PenaltiesInfo>
              <Penalty Amount="0" Applicability="Before" Changeable="true" ConditionsApply="true" Currency="RUB" Type="Exchange"/>
              <Penalty Amount="0" Applicability="After" Changeable="true" ConditionsApply="true" Currency="RUB" Type="Exchange"/>
              <Penalty Amount="27000" Applicability="Before" Cat16Info="true" Currency="RUB" Refundable="true" Type="Refund"/>
              <Penalty Applicability="After" Cat16Info="true" Refundable="false" Type="Refund"/>
            </PenaltiesInfo>
            <SeatSelection Type="N">
              <Segment ID="0"/>
              <Segment ID="1"/>
              <Segment ID="2"/>
              <Segment ID="3"/>
            </SeatSelection>
          </PassengerInfo>
          <PassengerInfo NonRefundable="true" PassengerNumber="1" PassengerType="INF">
            <FareComponent Ref="111">
              <Segment BookingCode="S" CabinCode="Y" MealCode="M" SeatsAvailable="9"/>
              <Segment AvailabilityBreak="true" BookingCode="S" CabinCode="Y" MealCode="M" SeatsAvailable="9"/>
            </FareComponent>
            <FareComponent Ref="4">
              <Segment BookingCode="S" CabinCode="Y" SeatsAvailable="9"/>
              <Segment AvailabilityBreak="true" BookingCode="S" CabinCode="Y" MealCode="M" SeatsAvailable="9"/>
            </FareComponent>
            <Tax Ref="33"/>
            <Tax Ref="92"/>
            <Tax Ref="126"/>
            <Tax Ref="92"/>
            <Tax Ref="46"/>
            <TaxSummary Ref="43"/>
            <TaxSummary Ref="49"/>
            <CurrencyConversion ExchangeRateUsed="45" From="AUD" To="RUB"/>
            <FareMessage Carrier="JL" Code="0" Info="RFND RESTR APPLY" Type="N"/>
            <FareMessage Code="0" Info="EACH INF REQUIRES ACCOMPANYING ADT PASSENGER" Type="W"/>
            <FareMessage Code="0" Info="VALIDATING CARRIER" Type="W"/>
            <FareMessage Code="0" Info="BSP - JL" Type="W"/>
            <PassengerTotalFare BaseFareAmount="76.00" BaseFareCurrency="AUD" CommissionAmount="0" CommissionPercentage="0" ConstructionAmount="56.62" ConstructionCurrency="NUC" Currency="RUB" EquivalentAmount="3420" EquivalentCurrency="RUB" ExchangeRateOne="1.32814600" TotalFare="8801" TotalTaxes="5381"/>
            <BaggageInformation AirlineCode="JL" ProvisionType="A">
              <Segment ID="0"/>
              <Segment ID="1"/>
              <Allowance Ref="39"/>
            </BaggageInformation>
            <BaggageInformation AirlineCode="JL" ProvisionType="A">
              <Segment ID="2"/>
              <Segment ID="3"/>
              <Allowance Ref="39"/>
            </BaggageInformation>
            <BaggageInformation AirlineCode="JL" ProvisionType="B">
              <Segment ID="0"/>
              <Allowance Ref="56"/>
            </BaggageInformation>
            <BaggageInformation AirlineCode="JL" ProvisionType="B">
              <Segment ID="1"/>
              <Allowance Ref="56"/>
            </BaggageInformation>
            <BaggageInformation AirlineCode="BA" ProvisionType="B">
              <Segment ID="2"/>
              <Allowance Ref="51"/>
            </BaggageInformation>
            <BaggageInformation AirlineCode="JL" ProvisionType="B">
              <Segment ID="3"/>
              <Allowance Ref="56"/>
            </BaggageInformation>
            <PenaltiesInfo>
              <Penalty Amount="0" Applicability="Before" Changeable="true" ConditionsApply="true" Currency="RUB" Type="Exchange"/>
              <Penalty Amount="0" Applicability="After" Changeable="true" ConditionsApply="true" Currency="RUB" Type="Exchange"/>
              <Penalty Amount="27000" Applicability="Before" Cat16Info="true" Currency="RUB" Refundable="true" Type="Refund"/>
              <Penalty Applicability="After" Cat16Info="true" Refundable="false" Type="Refund"/>
            </PenaltiesInfo>
            <SeatSelection Type="N">
              <Segment ID="0"/>
              <Segment ID="1"/>
              <Segment ID="2"/>
              <Segment ID="3"/>
            </SeatSelection>
          </PassengerInfo>
          <AncillaryFeeGroup Message="AIR EXTRAS NOT APPLICABLE OR ARE UNKNOWN FOR THIS ITINERARY"/>
          <TotalFare BaseFareAmount="2144.00" BaseFareCurrency="AUD" ConstructionAmount="1613.66" ConstructionCurrency="NUC" Currency="RUB" EquivalentAmount="96480" EquivalentCurrency="RUB" TotalPrice="208766" TotalTaxes="112286"/>
          <ValidatingCarrier Ref="17"/>
        </Fare>
      </PricingInformation>
      <DiversitySwapper WeighedPrice="533238.527"/>
    </Itinerary>
    <!--Другие рекомендации-->
  </ItineraryGroup>
  <ItineraryGroup>
    <GroupDescription ItineraryType="oneWay">
      <LegDescription ArrivalLocation="LHR" DepartureDate="2022-12-01" DepartureLocation="SYD"/>
    </GroupDescription>
    <Itinerary ID="1" PricingSource="ADVJR1">
      <Leg Ref="27"/>
      <PricingInformation BrandsOnAnyMarket="true" PricingSubsource="MIP">
        <Fare ETicketable="true" GoverningCarriers="VS" LastTicketDate="2022-05-23" LastTicketTime="11:45" VITA="true" ValidatingCarrierCode="VS">
          <PassengerInfo NonRefundable="false" PassengerNumber="2" PassengerType="ADT">
            <FareComponent Ref="204">
              <Segment AvailabilityBreak="true" BookingCode="V" CabinCode="Y" MealCode="LR" SeatsAvailable="9"/>
              <Segment AvailabilityBreak="true" BookingCode="E" CabinCode="Y" MealCode="D" SeatsAvailable="9"/>
              <BrandFeature Ref="114"/>
              <BrandFeature Ref="1"/>
              <BrandFeature Ref="63"/>
              <BrandFeature Ref="39"/>
              <BrandFeature Ref="76"/>
              <BrandFeature Ref="15"/>
              <BrandFeature Ref="228"/>
              <BrandFeature Ref="97"/>
              <BrandFeature Ref="167"/>
              <BrandFeature Ref="179"/>
              <BrandFeature Ref="82"/>
              <BrandFeature Ref="88"/>
              <BrandFeature Ref="58"/>
              <BrandFeature Ref="71"/>
              <BrandFeature Ref="221"/>
              <BrandFeature Ref="173"/>
              <BrandFeature Ref="48"/>
              <BrandFeature Ref="153"/>
              <BrandFeature Ref="197"/>
              <BrandFeature Ref="212"/>
            </FareComponent>
            <Tax Ref="74"/>
            <Tax Ref="134"/>
            <Tax Ref="14"/>
            <Tax Ref="110"/>
            <TaxSummary Ref="78"/>
            <TaxSummary Ref="147"/>
            <TaxSummary Ref="14"/>
            <TaxSummary Ref="123"/>
            <CurrencyConversion ExchangeRateUsed="45" From="AUD" To="RUB"/>
            <FareMessage Code="0" Info="VALIDATING CARRIER" Type="W"/>
            <FareMessage Code="0" Info="BSP - VS" Type="W"/>
            <FareMessage Code="0" Info="CAT 15 SALES RESTRICTIONS FREE TEXT FOUND - VERIFY RULES" Type="W"/>
            <PassengerTotalFare BaseFareAmount="721.00" BaseFareCurrency="AUD" CommissionAmount="0" CommissionPercentage="0" ConstructionAmount="542.86" ConstructionCurrency="NUC" Currency="RUB" EquivalentAmount="32445" EquivalentCurrency="RUB" ExchangeRateOne="1.32814600" TotalFare="38306" TotalTaxes="5861"/>
            <BaggageInformation AirlineCode="VS" ProvisionType="A">
              <Segment ID="0"/>
              <Segment ID="1"/>
              <Allowance Ref="34"/>
            </BaggageInformation>
            <BaggageInformation AirlineCode="CX" ProvisionType="B">
              <Segment ID="0"/>
              <Allowance Ref="18"/>
            </BaggageInformation>
            <BaggageInformation AirlineCode="VS" ProvisionType="B">
              <Segment ID="1"/>
              <Allowance Ref="23"/>
            </BaggageInformation>
            <PenaltiesInfo>
              <Penalty Amount="7040" Applicability="Before" Changeable="true" Currency="RUB" Type="Exchange"/>
              <Penalty Amount="7040" Applicability="After" Changeable="true" Currency="RUB" Type="Exchange"/>
              <Penalty Amount="7040" Applicability="Before" Currency="RUB" Refundable="true" Type="Refund"/>
              <Penalty Amount="7040" Applicability="After" Currency="RUB" Refundable="true" Type="Refund"/>
            </PenaltiesInfo>
            <SeatSelection Type="F">
              <Segment ID="0"/>
              <Segment ID="1"/>
            </SeatSelection>
          </PassengerInfo>
          <PassengerInfo NonRefundable="false" PassengerNumber="1" PassengerType="CNN">
            <FareComponent Ref="41">
              <Segment AvailabilityBreak="true" BookingCode="V" CabinCode="Y" MealCode="LR" SeatsAvailable="9"/>
              <Segment AvailabilityBreak="true" BookingCode="E" CabinCode="Y" MealCode="D" SeatsAvailable="9"/>
              <BrandFeature Ref="114"/>
              <BrandFeature Ref="1"/>
              <BrandFeature Ref="63"/>
              <BrandFeature Ref="39"/>
              <BrandFeature Ref="76"/>
              <BrandFeature Ref="15"/>
              <BrandFeature Ref="228"/>
              <BrandFeature Ref="97"/>
              <BrandFeature Ref="167"/>
              <BrandFeature Ref="179"/>
              <BrandFeature Ref="82"/>
              <BrandFeature Ref="88"/>
              <BrandFeature Ref="58"/>
              <BrandFeature Ref="71"/>
              <BrandFeature Ref="221"/>
              <BrandFeature Ref="173"/>
              <BrandFeature Ref="48"/>
              <BrandFeature Ref="153"/>
              <BrandFeature Ref="197"/>
              <BrandFeature Ref="212"/>
            </FareComponent>
            <Tax Ref="134"/>
            <Tax Ref="14"/>
            <Tax Ref="110"/>
            <TaxSummary Ref="147"/>
            <TaxSummary Ref="14"/>
            <TaxSummary Ref="123"/>
            <CurrencyConversion ExchangeRateUsed="45" From="AUD" To="RUB"/>
            <FareMessage Code="0" Info="EACH CNN REQUIRES ACCOMPANYING SAME CABIN ADT" Type="W"/>
            <FareMessage Code="0" Info="VALIDATING CARRIER" Type="W"/>
            <FareMessage Code="0" Info="BSP - VS" Type="W"/>
            <FareMessage Code="0" Info="CAT 15 SALES RESTRICTIONS FREE TEXT FOUND - VERIFY RULES" Type="W"/>
            <PassengerTotalFare BaseFareAmount="541.00" BaseFareCurrency="AUD" CommissionAmount="0" CommissionPercentage="0" ConstructionAmount="407.14" ConstructionCurrency="NUC" Currency="RUB" EquivalentAmount="24345" EquivalentCurrency="RUB" ExchangeRateOne="1.32814600" TotalFare="27506" TotalTaxes="3161"/>
            <BaggageInformation AirlineCode="VS" ProvisionType="A">
              <Segment ID="0"/>
              <Segment ID="1"/>
              <Allowance Ref="34"/>
            </BaggageInformation>
            <BaggageInformation AirlineCode="CX" ProvisionType="B">
              <Segment ID="0"/>
              <Allowance Ref="18"/>
            </BaggageInformation>
            <BaggageInformation AirlineCode="VS" ProvisionType="B">
              <Segment ID="1"/>
              <Allowance Ref="23"/>
            </BaggageInformation>
            <PenaltiesInfo>
              <Penalty Amount="7040" Applicability="Before" Changeable="true" Currency="RUB" Type="Exchange"/>
              <Penalty Amount="7040" Applicability="After" Changeable="true" Currency="RUB" Type="Exchange"/>
              <Penalty Amount="7040" Applicability="Before" Currency="RUB" Refundable="true" Type="Refund"/>
              <Penalty Amount="7040" Applicability="After" Currency="RUB" Refundable="true" Type="Refund"/>
            </PenaltiesInfo>
            <SeatSelection Type="F">
              <Segment ID="0"/>
              <Segment ID="1"/>
            </SeatSelection>
          </PassengerInfo>
          <PassengerInfo NonRefundable="false" PassengerNumber="1" PassengerType="INF">
            <FareComponent Ref="99">
              <Segment AvailabilityBreak="true" BookingCode="V" CabinCode="Y" MealCode="LR" SeatsAvailable="9"/>
              <Segment AvailabilityBreak="true" BookingCode="E" CabinCode="Y" MealCode="D" SeatsAvailable="9"/>
              <BrandFeature Ref="114"/>
              <BrandFeature Ref="1"/>
              <BrandFeature Ref="63"/>
              <BrandFeature Ref="39"/>
              <BrandFeature Ref="76"/>
              <BrandFeature Ref="15"/>
              <BrandFeature Ref="228"/>
              <BrandFeature Ref="97"/>
              <BrandFeature Ref="167"/>
              <BrandFeature Ref="179"/>
              <BrandFeature Ref="82"/>
              <BrandFeature Ref="88"/>
              <BrandFeature Ref="58"/>
              <BrandFeature Ref="71"/>
              <BrandFeature Ref="221"/>
              <BrandFeature Ref="173"/>
              <BrandFeature Ref="48"/>
              <BrandFeature Ref="153"/>
              <BrandFeature Ref="197"/>
              <BrandFeature Ref="212"/>
            </FareComponent>
            <Tax Ref="14"/>
            <Tax Ref="110"/>
            <TaxSummary Ref="14"/>
            <TaxSummary Ref="123"/>
            <CurrencyConversion ExchangeRateUsed="45" From="AUD" To="RUB"/>
            <FareMessage Code="0" Info="EACH INF REQUIRES ACCOMPANYING ADT PASSENGER" Type="W"/>
            <FareMessage Code="0" Info="VALIDATING CARRIER" Type="W"/>
            <FareMessage Code="0" Info="BSP - VS" Type="W"/>
            <FareMessage Code="0" Info="CAT 15 SALES RESTRICTIONS FREE TEXT FOUND - VERIFY RULES" Type="W"/>
            <PassengerTotalFare BaseFareAmount="72.00" BaseFareCurrency="AUD" CommissionAmount="0" CommissionPercentage="0" ConstructionAmount="54.28" ConstructionCurrency="NUC" Currency="RUB" EquivalentAmount="3240" EquivalentCurrency="RUB" ExchangeRateOne="1.32814600" TotalFare="4993" TotalTaxes="1753"/>
            <BaggageInformation AirlineCode="VS" ProvisionType="A">
              <Segment ID="0"/>
              <Segment ID="1"/>
              <Allowance Ref="64"/>
            </BaggageInformation>
            <BaggageInformation AirlineCode="VS" ProvisionType="B">
              <Segment ID="1"/>
              <Allowance Ref="15"/>
            </BaggageInformation>
            <PenaltiesInfo>
              <Penalty Amount="705" Applicability="Before" Changeable="true" Currency="RUB" Type="Exchange"/>
              <Penalty Amount="705" Applicability="After" Changeable="true" Currency="RUB" Type="Exchange"/>
              <Penalty Amount="705" Applicability="Before" Currency="RUB" Refundable="true" Type="Refund"/>
              <Penalty Amount="705" Applicability="After" Currency="RUB" Refundable="true" Type="Refund"/>
            </PenaltiesInfo>
            <SeatSelection Type="F">
              <Segment ID="0"/>
              <Segment ID="1"/>
            </SeatSelection>
          </PassengerInfo>
          <AncillaryFeeGroup Message="AIR EXTRAS NOT APPLICABLE OR ARE UNKNOWN FOR THIS ITINERARY"/>
          <TotalFare BaseFareAmount="2055.00" BaseFareCurrency="AUD" ConstructionAmount="1547.14" ConstructionCurrency="NUC" Currency="RUB" EquivalentAmount="92475" EquivalentCurrency="RUB" TotalPrice="109111" TotalTaxes="16636"/>
          <ValidatingCarrier Ref="8"/>
        </Fare>
      </PricingInformation>
      <DiversitySwapper WeighedPrice="130933.200"/>
    </Itinerary>
    <!--Другие рекомендации-->
  </ItineraryGroup>
  <ItineraryGroup>
    <GroupDescription ItineraryType="oneWay">
      <LegDescription ArrivalLocation="SYD" DepartureDate="2022-12-08" DepartureLocation="LHR"/>
    </GroupDescription>
    <Itinerary ID="1" PricingSource="ADVJR1">
      <Leg Ref="48"/>
      <PricingInformation PricingSubsource="MIP">
        <Fare ETicketable="true" GoverningCarriers="UL" VITA="true" ValidatingCarrierCode="UL">
          <PassengerInfo NonRefundable="false" PassengerNumber="2" PassengerType="ADT">
            <FareComponent Ref="210">
              <Segment BookingCode="E" CabinCode="Y" MealCode="BD" SeatsAvailable="9"/>
              <Segment AvailabilityBreak="true" BookingCode="E" CabinCode="Y" SeatsAvailable="9"/>
            </FareComponent>
            <Tax Ref="94"/>
            <Tax Ref="45"/>
            <Tax Ref="35"/>
            <Tax Ref="46"/>
            <TaxSummary Ref="97"/>
            <TaxSummary Ref="32"/>
            <TaxSummary Ref="49"/>
            <TaxSummary Ref="48"/>
            <CurrencyConversion ExchangeRateUsed="79.5" From="GBP" To="RUB"/>
            <FareMessage Carrier="UL" Code="0" Info="CHANGE FEE MAY APPLY/VALID ON UL ONLY" Type="N"/>
            <FareMessage Code="0" Info="VALIDATING CARRIER" Type="W"/>
            <FareMessage Code="0" Info="BSP - UL" Type="W"/>
            <PassengerTotalFare BaseFareAmount="255.00" BaseFareCurrency="GBP" CommissionAmount="0" CommissionPercentage="0" ConstructionAmount="333.95" ConstructionCurrency="NUC" Currency="RUB" EquivalentAmount="20275" EquivalentCurrency="RUB" ExchangeRateOne="0.76356700" TotalFare="50528" TotalTaxes="30253"/>
            <BaggageInformation AirlineCode="UL" ProvisionType="A">
              <Segment ID="0"/>
              <Segment ID="1"/>
              <Allowance Ref="27"/>
            </BaggageInformation>
            <BaggageInformation AirlineCode="UL" ProvisionType="B">
              <Segment ID="0"/>
              <Allowance Ref="54"/>
            </BaggageInformation>
            <BaggageInformation AirlineCode="UL" ProvisionType="B">
              <Segment ID="1"/>
              <Allowance Ref="54"/>
            </BaggageInformation>
            <PenaltiesInfo>
              <Penalty Amount="25045" Applicability="Before" Changeable="true" Currency="RUB" Type="Exchange"/>
              <Penalty Amount="25045" Applicability="After" Changeable="true" Currency="RUB" Type="Exchange"/>
              <Penalty Amount="25045" Applicability="Before" Currency="RUB" Refundable="true" Type="Refund"/>
              <Penalty Amount="25045" Applicability="After" Currency="RUB" Refundable="true" Type="Refund"/>
            </PenaltiesInfo>
            <SeatSelection Type="C">
              <Segment ID="0"/>
              <Segment ID="1"/>
            </SeatSelection>
          </PassengerInfo>
          <PassengerInfo NonRefundable="false" PassengerNumber="1" PassengerType="CNN">
            <FareComponent Ref="86">
              <Segment BookingCode="E" CabinCode="Y" MealCode="BD" SeatsAvailable="9"/>
              <Segment AvailabilityBreak="true" BookingCode="E" CabinCode="Y" SeatsAvailable="9"/>
            </FareComponent>
            <Tax Ref="94"/>
            <Tax Ref="45"/>
            <Tax Ref="46"/>
            <TaxSummary Ref="97"/>
            <TaxSummary Ref="49"/>
            <TaxSummary Ref="48"/>
            <CurrencyConversion ExchangeRateUsed="79.5" From="GBP" To="RUB"/>
            <FareMessage Carrier="UL" Code="0" Info="CHANGE FEE MAY APPLY/VALID ON UL ONLY" Type="N"/>
            <FareMessage Code="0" Info="EACH CNN REQUIRES ACCOMPANYING SAME CABIN ADT" Type="W"/>
            <FareMessage Code="0" Info="VALIDATING CARRIER" Type="W"/>
            <FareMessage Code="0" Info="BSP - UL" Type="W"/>
            <PassengerTotalFare BaseFareAmount="191.00" BaseFareCurrency="GBP" CommissionAmount="0" CommissionPercentage="0" ConstructionAmount="250.46" ConstructionCurrency="NUC" Currency="RUB" EquivalentAmount="15185" EquivalentCurrency="RUB" ExchangeRateOne="0.76356700" TotalFare="38760" TotalTaxes="23575"/>
            <BaggageInformation AirlineCode="UL" ProvisionType="A">
              <Segment ID="0"/>
              <Segment ID="1"/>
              <Allowance Ref="27"/>
            </BaggageInformation>
            <BaggageInformation AirlineCode="UL" ProvisionType="B">
              <Segment ID="0"/>
              <Allowance Ref="54"/>
            </BaggageInformation>
            <BaggageInformation AirlineCode="UL" ProvisionType="B">
              <Segment ID="1"/>
              <Allowance Ref="54"/>
            </BaggageInformation>
            <PenaltiesInfo>
              <Penalty Amount="25045" Applicability="Before" Changeable="true" Currency="RUB" Type="Exchange"/>
              <Penalty Amount="25045" Applicability="After" Changeable="true" Currency="RUB" Type="Exchange"/>
              <Penalty Amount="25045" Applicability="Before" Currency="RUB" Refundable="true" Type="Refund"/>
              <Penalty Amount="25045" Applicability="After" Currency="RUB" Refundable="true" Type="Refund"/>
            </PenaltiesInfo>
            <SeatSelection Type="C">
              <Segment ID="0"/>
              <Segment ID="1"/>
            </SeatSelection>
          </PassengerInfo>
          <PassengerInfo NonRefundable="false" PassengerNumber="1" PassengerType="INF">
            <FareComponent Ref="92">
              <Segment BookingCode="E" CabinCode="Y" MealCode="BD" SeatsAvailable="9"/>
              <Segment AvailabilityBreak="true" BookingCode="E" CabinCode="Y" SeatsAvailable="9"/>
            </FareComponent>
            <Tax Ref="46"/>
            <TaxSummary Ref="49"/>
            <CurrencyConversion ExchangeRateUsed="79.5" From="GBP" To="RUB"/>
            <FareMessage Carrier="UL" Code="0" Info="CHANGE FEE MAY APPLY/VALID ON UL ONLY" Type="N"/>
            <FareMessage Code="0" Info="EACH INF REQUIRES ACCOMPANYING ADT PASSENGER" Type="W"/>
            <FareMessage Code="0" Info="VALIDATING CARRIER" Type="W"/>
            <FareMessage Code="0" Info="BSP - UL" Type="W"/>
            <PassengerTotalFare BaseFareAmount="51.00" BaseFareCurrency="GBP" CommissionAmount="0" CommissionPercentage="0" ConstructionAmount="66.79" ConstructionCurrency="NUC" Currency="RUB" EquivalentAmount="4055" EquivalentCurrency="RUB" ExchangeRateOne="0.76356700" TotalFare="8512" TotalTaxes="4457"/>
            <BaggageInformation AirlineCode="UL" ProvisionType="A">
              <Segment ID="0"/>
              <Segment ID="1"/>
              <Allowance Ref="10"/>
            </BaggageInformation>
            <BaggageInformation AirlineCode="UL" ProvisionType="B">
              <Segment ID="0"/>
              <Allowance Ref="47"/>
            </BaggageInformation>
            <BaggageInformation AirlineCode="UL" ProvisionType="B">
              <Segment ID="1"/>
              <Allowance Ref="47"/>
            </BaggageInformation>
            <PenaltiesInfo>
              <Penalty Amount="0" Applicability="Before" Changeable="true" Currency="RUB" Type="Exchange"/>
              <Penalty Amount="0" Applicability="After" Changeable="true" Currency="RUB" Type="Exchange"/>
              <Penalty Amount="0" Applicability="Before" Currency="RUB" Refundable="true" Type="Refund"/>
              <Penalty Amount="0" Applicability="After" Currency="RUB" Refundable="true" Type="Refund"/>
            </PenaltiesInfo>
            <SeatSelection Type="C">
              <Segment ID="0"/>
              <Segment ID="1"/>
            </SeatSelection>
          </PassengerInfo>
          <AncillaryFeeGroup>
            <AncillaryFee Code="BG" Name="BAGGAGE">
              <Details Amount="46785" AncillaryTypeCode="F" BaggageID="1" Carrier="UL" Code="ALL" DepartureDate="2022-12-08" Description="UPTO33LB 15KG BAGGAGE" Description1="UP TO 33 POUNDS/15 KILOGRAMS" Destination="SYD" EndSegment="2" Origin="LHR" StartSegment="1" Subcode="0C1"/>
              <Details Amount="62400" AncillaryTypeCode="F" BaggageID="2" Carrier="UL" Code="ALL" DepartureDate="2022-12-08" Description="UPTO44LB 20KG BAGGAGE" Description1="UP TO 44 POUNDS/20 KILOGRAMS" Destination="SYD" EndSegment="2" Origin="LHR" StartSegment="1" Subcode="0C2"/>
              <Details Amount="78020" AncillaryTypeCode="F" BaggageID="3" Carrier="UL" Code="ALL" DepartureDate="2022-12-08" Description="UPTO55LB 25KG BAGGAGE" Description1="UP TO 55 POUNDS/25 KILOGRAMS" Destination="SYD" EndSegment="2" Origin="LHR" StartSegment="1" Subcode="0C4"/>
              <Details Amount="106115" AncillaryTypeCode="F" BaggageID="4" Carrier="UL" Code="ALL" DepartureDate="2022-12-08" Description="UPTO66LB 30KG BAGGAGE" Description1="UP TO 66 POUNDS/30 KILOGRAMS" Destination="SYD" EndSegment="2" Origin="LHR" StartSegment="1" Subcode="0C5"/>
              <Details Amount="123780" AncillaryTypeCode="F" BaggageID="5" Carrier="UL" Code="ALL" DepartureDate="2022-12-08" Description="UPTO35KG BAGGAGE" Description1="UP TO 77 POUNDS/35 KILOGRAMS" Destination="SYD" EndSegment="2" Origin="LHR" StartSegment="1" Subcode="0C7"/>
              <Details Amount="141440" AncillaryTypeCode="F" BaggageID="6" Carrier="UL" Code="ALL" DepartureDate="2022-12-08" Description="UPTO40KG BAGGAGE" Description1="UP TO 88 POUNDS/40 KILOGRAMS" Destination="SYD" EndSegment="2" Origin="LHR" StartSegment="1" Subcode="0C8"/>
              <Details Amount="159105" AncillaryTypeCode="F" BaggageID="7" Carrier="UL" Code="ALL" DepartureDate="2022-12-08" Description="UPTO100LB 45KG BAGGAGE" Description1="UP TO 100 POUNDS/45 KILOGRAMS" Destination="SYD" EndSegment="2" Origin="LHR" StartSegment="1" Subcode="0C9"/>
              <Details Amount="15620" AncillaryTypeCode="F" BaggageID="8" Carrier="UL" Code="ALL" DepartureDate="2022-12-08" Description="UPTO11LB 5KG BAGGAGE" Description1="UP TO 11 POUNDS/5 KILOGRAMS" Destination="SYD" EndSegment="2" Origin="LHR" StartSegment="1" Subcode="0CW"/>
              <Details Amount="31235" AncillaryTypeCode="F" BaggageID="9" Carrier="UL" Code="ALL" DepartureDate="2022-12-08" Description="UPTO22LB 10KG BAGGAGE" Description1="UP TO 22 POUNDS/10 KILOGRAMS" Destination="SYD" EndSegment="2" Origin="LHR" StartSegment="1" Subcode="0CZ"/>
              <Details Amount="176835" AncillaryTypeCode="F" BaggageID="10" Carrier="UL" Code="ALL" DepartureDate="2022-12-08" Description="UPTO110LB 50KG BAGGAGE" Description1="UP TO 110 POUNDS/50 KILOGRAMS" Destination="SYD" EndSegment="2" Origin="LHR" StartSegment="1" Subcode="0I7"/>
            </AncillaryFee>
          </AncillaryFeeGroup>
          <TotalFare BaseFareAmount="752.00" BaseFareCurrency="GBP" ConstructionAmount="985.15" ConstructionCurrency="NUC" Currency="RUB" EquivalentAmount="59790" EquivalentCurrency="RUB" TotalPrice="148328" TotalTaxes="88538"/>
          <ValidatingCarrier Ref="6"/>
        </Fare>
      </PricingInformation>
      <DiversitySwapper WeighedPrice="221920.041"/>
    </Itinerary>
    <!--Другие рекомендации-->
  </ItineraryGroup>
</GroupedItineraryResponse>
```
{{< /details >}}

---

{{< details title="Пример запроса (оформление на нескольких билетах (SCHS), OTA ответ)" >}}
```XML
<OTA_AirLowFareSearchRQ ResponseType="OTA" Version="6.5.0" xmlns="http://www.opentravel.org/OTA/2003/05">
  <POS>
    <Source PseudoCityCode="9LSC">
      <RequestorID ID="1" Type="1">
        <CompanyName Code="TN"/>
      </RequestorID>
    </Source>
  </POS>
  <OriginDestinationInformation RPH="1">
    <DepartureDateTime>2022-12-01T11:00:00</DepartureDateTime>
    <OriginLocation LocationCode="SYD"/>
    <DestinationLocation LocationCode="LON"/>
  </OriginDestinationInformation>
  <OriginDestinationInformation RPH="2">
    <DepartureDateTime>2022-12-08T11:00:00</DepartureDateTime>
    <OriginLocation LocationCode="LON"/>
    <DestinationLocation LocationCode="SYD"/>
  </OriginDestinationInformation>
  <TravelPreferences ValidInterlineTicket="true">
    <CabinPref Cabin="Economy" PreferLevel="Preferred"/>
    <TPA_Extensions>
      <LongConnectTime Enable="true"/>
      <LongConnectPoints Max="3" Min="1"/>
      <KeepSameCabin Enabled="true"/>
      <ExcludeCallDirectCarriers Enabled="true"/>
      <SeatSelection Info="true"/>
      <DiversityParameters AdditionalNonStopsPercentage="100"/>
    </TPA_Extensions>
    <AncillaryFees Enable="true">
      <AncillaryFeeGroup Code="BG"/>
    </AncillaryFees>
    <Baggage CarryOnInfo="true" Description="true" RequestType="A"/>
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
```
{{< /details >}}

{{< details title="Пример ответа" >}}
```XML
<OTA_AirLowFareSearchRS AvailableItinCount="0" BrandedOneWayItinCount="0" DepartedItinCount="0" PricedItinCount="200" SimpleOneWayItinCount="0" SoldOutItinCount="0" Version="6.5.0" xmlns="http://www.opentravel.org/OTA/2003/05" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <Success/>
  <Warnings>
    <Warning Code="PROCESS" ShortText="Communication error: Transmission timeout" Type="MIP"/>
    <Warning Code="GCB14-ISELL-TN-00-2022-05-00-6T9H" MessageClass="I" ShortText="27038" Type="SERVER"/>
    <Warning Code="TRANSACTIONID" MessageClass="I" ShortText="6964010834892247972" Type="WORKERTHREAD"/>
    <Warning Code="RULEID" MessageClass="I" ShortText="15936" Type="DRE"/>
    <Warning Code="RULEID" MessageClass="I" ShortText="27757" Type="DEFAULT"/>
  </Warnings>
  <BrandFeatures>
    <BrandFeature Application="F" CommercialName="STANDARD SEATING" Id="1" ServiceGroup="BF" ServiceType="Z" SubCode="050" Vendor="ATP"/>
    <BrandFeature Application="C" CommercialName="CHOICE OF STANDARD SEAT" Id="2" ServiceGroup="BF" ServiceType="Z" SubCode="050" Vendor="ATP"/>
    <BrandFeature Application="F" CommercialName="BASIC SEAT" Id="3" ServiceGroup="BF" ServiceType="Z" SubCode="050" Vendor="ATP"/>
    <BrandFeature Application="C" CommercialName="STANDARD SEAT RESERVATION" Id="4" ServiceGroup="BF" ServiceType="Z" SubCode="050" Vendor="ATP"/>
    <BrandFeature Application="F" CommercialName="SEAT SELECTION STANDARD ZONE" Id="5" ServiceGroup="BF" ServiceType="Z" SubCode="050" Vendor="ATP"/>
    <!--Другие услуги-->
  </BrandFeatures>
  <PricedItineraries>
    <PricedItinerary SequenceNumber="1">
      <AirItinerary DirectionInd="Return">
        <OriginDestinationOptions>
          <OriginDestinationOption ArrivalCountry="GB" DepartureCountry="AU" ElapsedTime="1930">
            <FlightSegment ArrivalDateTime="2022-12-01T17:15:00" DepartureDateTime="2022-12-01T09:15:00" ElapsedTime="600" FlightNumber="52" ResBookDesigCode="S" StopQuantity="0">
              <DepartureAirport LocationCode="SYD" TerminalID="1"/>
              <ArrivalAirport LocationCode="HND" TerminalID="3"/>
              <OperatingAirline Code="JL" FlightNumber="52"/>
              <Equipment AirEquipType="789"/>
              <MarketingAirline Code="JL"/>
              <MarriageGrp>O</MarriageGrp>
              <DepartureTimeZone GMTOffset="11"/>
              <ArrivalTimeZone GMTOffset="9"/>
              <TPA_Extensions>
                <eTicket Ind="true"/>
                <Mileage Amount="4836"/>
              </TPA_Extensions>
            </FlightSegment>
            <FlightSegment ArrivalDateTime="2022-12-02T06:25:00" DepartureDateTime="2022-12-02T02:45:00" ElapsedTime="760" FlightNumber="41" ResBookDesigCode="S" StopQuantity="0">
              <DepartureAirport LocationCode="HND" TerminalID="3"/>
              <ArrivalAirport LocationCode="LHR" TerminalID="3"/>
              <OperatingAirline Code="JL" FlightNumber="41"/>
              <Equipment AirEquipType="788"/>
              <MarketingAirline Code="JL"/>
              <MarriageGrp>I</MarriageGrp>
              <DepartureTimeZone GMTOffset="9"/>
              <ArrivalTimeZone GMTOffset="0"/>
              <TPA_Extensions>
                <eTicket Ind="true"/>
                <Mileage Amount="5974"/>
              </TPA_Extensions>
            </FlightSegment>
          </OriginDestinationOption>
          <OriginDestinationOption ArrivalCountry="AU" DepartureCountry="GB" ElapsedTime="1785">
            <FlightSegment ArrivalDateTime="2022-12-09T10:25:00" DepartureDateTime="2022-12-08T13:45:00" ElapsedTime="700" FlightNumber="7120" ResBookDesigCode="S" StopQuantity="0">
              <DepartureAirport LocationCode="LHR" TerminalID="5"/>
              <ArrivalAirport LocationCode="HND" TerminalID="3"/>
              <OperatingAirline Code="BA" FlightNumber="5"/>
              <Equipment AirEquipType="789"/>
              <MarketingAirline Code="JL"/>
              <DisclosureAirline Code="BA"/>
              <MarriageGrp>O</MarriageGrp>
              <DepartureTimeZone GMTOffset="0"/>
              <ArrivalTimeZone GMTOffset="9"/>
              <TPA_Extensions>
                <eTicket Ind="true"/>
                <Mileage Amount="5974"/>
              </TPA_Extensions>
            </FlightSegment>
            <FlightSegment ArrivalDateTime="2022-12-10T06:30:00" DepartureDateTime="2022-12-09T18:40:00" ElapsedTime="590" FlightNumber="51" ResBookDesigCode="S" StopQuantity="0">
              <DepartureAirport LocationCode="HND" TerminalID="3"/>
              <ArrivalAirport LocationCode="SYD" TerminalID="1"/>
              <OperatingAirline Code="JL" FlightNumber="51"/>
              <Equipment AirEquipType="789"/>
              <MarketingAirline Code="JL"/>
              <MarriageGrp>I</MarriageGrp>
              <DepartureTimeZone GMTOffset="9"/>
              <ArrivalTimeZone GMTOffset="11"/>
              <TPA_Extensions>
                <eTicket Ind="true"/>
                <Mileage Amount="4836"/>
              </TPA_Extensions>
            </FlightSegment>
          </OriginDestinationOption>
        </OriginDestinationOptions>
      </AirItinerary>
      <AirItineraryPricingInfo FareReturned="true" LastTicketDate="2022-05-27" LastTicketTime="23:59" PricingSource="ADVJR1" PricingSubSource="MIP">
        <ItinTotalFare>
          <BaseFare Amount="2144.00" CurrencyCode="AUD" DecimalPlaces="2"/>
          <FareConstruction Amount="1613.66" CurrencyCode="NUC" DecimalPlaces="2"/>
          <EquivFare Amount="96480" CurrencyCode="RUB" DecimalPlaces="0"/>
          <Taxes>
            <Tax Amount="112286" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="TOTALTAX"/>
          </Taxes>
          <TotalFare Amount="208766" CurrencyCode="RUB" DecimalPlaces="0"/>
        </ItinTotalFare>
        <PTC_FareBreakdowns>
          <PTC_FareBreakdown>
            <PassengerTypeQuantity Code="ADT" Quantity="2"/>
            <FareBasisCodes>
              <FareBasisCode ArrivalAirportCode="HND" BookingCode="S" DepartureAirportCode="SYD" FareComponentBeginAirport="SYD" FareComponentCabinCode="Y" FareComponentDirectionality="FROM" FareComponentEndAirport="LHR" FareComponentFareRule="2291" FareComponentFareTariff="44" FareComponentFareType="XEX" FareComponentFareTypeBitmap="00" FareComponentVendorCode="ATP" GovCarrier="JL">SNN0NPCE</FareBasisCode>
              <FareBasisCode ArrivalAirportCode="LHR" AvailabilityBreak="true" BookingCode="S" DepartureAirportCode="HND" GovCarrier="JL">SNN0NPCE</FareBasisCode>
              <FareBasisCode ArrivalAirportCode="HND" BookingCode="S" DepartureAirportCode="LHR" FareComponentBeginAirport="LHR" FareComponentCabinCode="Y" FareComponentDirectionality="TO" FareComponentEndAirport="SYD" FareComponentFareRule="2291" FareComponentFareTariff="44" FareComponentFareType="XEX" FareComponentFareTypeBitmap="00" FareComponentVendorCode="ATP" GovCarrier="JL">SNN0NPCE</FareBasisCode>
              <FareBasisCode ArrivalAirportCode="SYD" AvailabilityBreak="true" BookingCode="S" DepartureAirportCode="HND" GovCarrier="JL">SNN0NPCE</FareBasisCode>
            </FareBasisCodes>
            <PassengerFare>
              <BaseFare Amount="752.00" CurrencyCode="AUD"/>
              <FareConstruction Amount="566.20" CurrencyCode="NUC" DecimalPlaces="2"/>
              <EquivFare Amount="33840" CurrencyCode="RUB" DecimalPlaces="0"/>
              <Taxes>
                <Tax Amount="9945" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                <Tax Amount="9945" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                <Tax Amount="231" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQI"/>
                <Tax Amount="231" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQI"/>
                <Tax Amount="231" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQI"/>
                <Tax Amount="231" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQI"/>
                <Tax Amount="2700" CountryCode="AU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="AU"/>
                <Tax Amount="1450" CountryCode="AU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="WY"/>
                <Tax Amount="1450" CountryCode="AU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="WY2"/>
                <Tax Amount="6678" CountryCode="GB" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="GB"/>
                <Tax Amount="4457" CountryCode="GB" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="UB"/>
                <Tax Amount="728" CountryCode="JP" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="SW"/>
                <Tax Amount="728" CountryCode="JP" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="SW"/>
                <TaxSummary Amount="20814" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                <TaxSummary Amount="2700" CountryCode="AU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="AU"/>
                <TaxSummary Amount="2900" CountryCode="AU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="WY"/>
                <TaxSummary Amount="1456" CountryCode="JP" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="SW"/>
                <TaxSummary Amount="6678" CountryCode="GB" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="GB"/>
                <TaxSummary Amount="4457" CountryCode="GB" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="UB"/>
                <TotalTax Amount="39005" CurrencyCode="RUB" DecimalPlaces="0"/>
              </Taxes>
              <TotalFare Amount="72845" CurrencyCode="RUB"/>
              <PenaltiesInfo>
                <Penalty Amount="0" Applicability="Before" Changeable="true" ConditionsApply="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                <Penalty Amount="0" Applicability="After" Changeable="true" ConditionsApply="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                <Penalty Amount="27000" Applicability="Before" Cat16Info="true" CurrencyCode="RUB" DecimalPlaces="0" Refundable="true" Type="Refund"/>
                <Penalty Applicability="After" Cat16Info="true" Refundable="false" Type="Refund"/>
              </PenaltiesInfo>
              <TPA_Extensions>
                <Messages>
                  <Message AirlineCode="JL" FailCode="0" Info="RFND RESTR APPLY" Type="N"/>
                  <Message FailCode="0" Info="VALIDATING CARRIER" Type="W"/>
                  <Message FailCode="0" Info="BSP - JL" Type="W"/>
                </Messages>
                <BaggageInformationList>
                  <BaggageInformation AirlineCode="JL" ProvisionType="A">
                    <Segment Id="0"/>
                    <Segment Id="1"/>
                    <Allowance Description1="UP TO 50 POUNDS/23 KILOGRAMS" Description2="UP TO 80 LINEAR INCHES/203 LINEAR CENTIMETERS" Pieces="2"/>
                  </BaggageInformation>
                  <BaggageInformation AirlineCode="JL" ProvisionType="A">
                    <Segment Id="2"/>
                    <Segment Id="3"/>
                    <Allowance Description1="UP TO 50 POUNDS/23 KILOGRAMS" Description2="UP TO 80 LINEAR INCHES/203 LINEAR CENTIMETERS" Pieces="2"/>
                  </BaggageInformation>
                  <BaggageInformation AirlineCode="JL" ProvisionType="B">
                    <Segment Id="0"/>
                    <Allowance Description1="UP TO 22 POUNDS/10 KILOGRAMS" Description2="UP TO 45 LINEAR INCHES/115 LINEAR CENTIMETERS" Pieces="1"/>
                  </BaggageInformation>
                  <BaggageInformation AirlineCode="JL" ProvisionType="B">
                    <Segment Id="1"/>
                    <Allowance Description1="UP TO 22 POUNDS/10 KILOGRAMS" Description2="UP TO 45 LINEAR INCHES/115 LINEAR CENTIMETERS" Pieces="1"/>
                  </BaggageInformation>
                  <BaggageInformation AirlineCode="BA" ProvisionType="B">
                    <Segment Id="2"/>
                    <Allowance Description1="UP TO 34 LINEAR INCHES/85 LINEAR CENTIMETERS" Pieces="1"/>
                  </BaggageInformation>
                  <BaggageInformation AirlineCode="JL" ProvisionType="B">
                    <Segment Id="3"/>
                    <Allowance Description1="UP TO 22 POUNDS/10 KILOGRAMS" Description2="UP TO 45 LINEAR INCHES/115 LINEAR CENTIMETERS" Pieces="1"/>
                  </BaggageInformation>
                </BaggageInformationList>
                <SeatSelectionList>
                  <SeatSelection Type="N">
                    <Segment ID="0"/>
                    <Segment ID="1"/>
                    <Segment ID="2"/>
                    <Segment ID="3"/>
                  </SeatSelection>
                </SeatSelectionList>
              </TPA_Extensions>
            </PassengerFare>
            <Endorsements NonRefundableIndicator="true"/>
            <TPA_Extensions>
              <FareCalcLine Info="SYD JL X/TYO JL LON283.10JL X/TYO JL SYD283.10NUC566.20END ROE1.328146"/>
            </TPA_Extensions>
            <FareInfos>
              <FareInfo>
                <FareReference>S</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="M"/>
                </TPA_Extensions>
              </FareInfo>
              <FareInfo>
                <FareReference>S</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="M"/>
                </TPA_Extensions>
              </FareInfo>
              <FareInfo>
                <FareReference>S</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                </TPA_Extensions>
              </FareInfo>
              <FareInfo>
                <FareReference>S</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="M"/>
                </TPA_Extensions>
              </FareInfo>
            </FareInfos>
          </PTC_FareBreakdown>
          <PTC_FareBreakdown>
            <PassengerTypeQuantity Code="CNN" Quantity="1"/>
            <FareBasisCodes>
              <FareBasisCode ArrivalAirportCode="HND" BookingCode="S" DepartureAirportCode="SYD" FareComponentBeginAirport="SYD" FareComponentCabinCode="Y" FareComponentDirectionality="FROM" FareComponentEndAirport="LHR" FareComponentFareRule="2291" FareComponentFareTariff="44" FareComponentFareType="XEX" FareComponentFareTypeBitmap="01" FareComponentVendorCode="ATP" GovCarrier="JL">SNN0NPCE/CH25</FareBasisCode>
              <FareBasisCode ArrivalAirportCode="LHR" AvailabilityBreak="true" BookingCode="S" DepartureAirportCode="HND" GovCarrier="JL">SNN0NPCE/CH25</FareBasisCode>
              <FareBasisCode ArrivalAirportCode="HND" BookingCode="S" DepartureAirportCode="LHR" FareComponentBeginAirport="LHR" FareComponentCabinCode="Y" FareComponentDirectionality="TO" FareComponentEndAirport="SYD" FareComponentFareRule="2291" FareComponentFareTariff="44" FareComponentFareType="XEX" FareComponentFareTypeBitmap="01" FareComponentVendorCode="ATP" GovCarrier="JL">SNN0NPCE/CH25</FareBasisCode>
              <FareBasisCode ArrivalAirportCode="SYD" AvailabilityBreak="true" BookingCode="S" DepartureAirportCode="HND" GovCarrier="JL">SNN0NPCE/CH25</FareBasisCode>
            </FareBasisCodes>
            <PassengerFare>
              <BaseFare Amount="564.00" CurrencyCode="AUD"/>
              <FareConstruction Amount="424.64" CurrencyCode="NUC" DecimalPlaces="2"/>
              <EquivFare Amount="25380" CurrencyCode="RUB" DecimalPlaces="0"/>
              <Taxes>
                <Tax Amount="9945" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                <Tax Amount="9945" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                <Tax Amount="231" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQI"/>
                <Tax Amount="231" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQI"/>
                <Tax Amount="231" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQI"/>
                <Tax Amount="231" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQI"/>
                <Tax Amount="1450" CountryCode="AU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="WY"/>
                <Tax Amount="1450" CountryCode="AU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="WY2"/>
                <Tax Amount="4457" CountryCode="GB" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="UB"/>
                <Tax Amount="362" CountryCode="JP" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="SW"/>
                <Tax Amount="362" CountryCode="JP" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="SW"/>
                <TaxSummary Amount="20814" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                <TaxSummary Amount="2900" CountryCode="AU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="WY"/>
                <TaxSummary Amount="724" CountryCode="JP" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="SW"/>
                <TaxSummary Amount="4457" CountryCode="GB" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="UB"/>
                <TotalTax Amount="28895" CurrencyCode="RUB" DecimalPlaces="0"/>
              </Taxes>
              <TotalFare Amount="54275" CurrencyCode="RUB"/>
              <PenaltiesInfo>
                <Penalty Amount="0" Applicability="Before" Changeable="true" ConditionsApply="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                <Penalty Amount="0" Applicability="After" Changeable="true" ConditionsApply="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                <Penalty Amount="27000" Applicability="Before" Cat16Info="true" CurrencyCode="RUB" DecimalPlaces="0" Refundable="true" Type="Refund"/>
                <Penalty Applicability="After" Cat16Info="true" Refundable="false" Type="Refund"/>
              </PenaltiesInfo>
              <TPA_Extensions>
                <Messages>
                  <Message AirlineCode="JL" FailCode="0" Info="RFND RESTR APPLY" Type="N"/>
                  <Message FailCode="0" Info="EACH CNN REQUIRES ACCOMPANYING SAME CABIN ADT" Type="W"/>
                  <Message FailCode="0" Info="VALIDATING CARRIER" Type="W"/>
                  <Message FailCode="0" Info="BSP - JL" Type="W"/>
                </Messages>
                <BaggageInformationList>
                  <BaggageInformation AirlineCode="JL" ProvisionType="A">
                    <Segment Id="0"/>
                    <Segment Id="1"/>
                    <Allowance Description1="UP TO 50 POUNDS/23 KILOGRAMS" Description2="UP TO 80 LINEAR INCHES/203 LINEAR CENTIMETERS" Pieces="2"/>
                  </BaggageInformation>
                  <BaggageInformation AirlineCode="JL" ProvisionType="A">
                    <Segment Id="2"/>
                    <Segment Id="3"/>
                    <Allowance Description1="UP TO 50 POUNDS/23 KILOGRAMS" Description2="UP TO 80 LINEAR INCHES/203 LINEAR CENTIMETERS" Pieces="2"/>
                  </BaggageInformation>
                  <BaggageInformation AirlineCode="JL" ProvisionType="B">
                    <Segment Id="0"/>
                    <Allowance Description1="UP TO 22 POUNDS/10 KILOGRAMS" Description2="UP TO 45 LINEAR INCHES/115 LINEAR CENTIMETERS" Pieces="1"/>
                  </BaggageInformation>
                  <BaggageInformation AirlineCode="JL" ProvisionType="B">
                    <Segment Id="1"/>
                    <Allowance Description1="UP TO 22 POUNDS/10 KILOGRAMS" Description2="UP TO 45 LINEAR INCHES/115 LINEAR CENTIMETERS" Pieces="1"/>
                  </BaggageInformation>
                  <BaggageInformation AirlineCode="BA" ProvisionType="B">
                    <Segment Id="2"/>
                    <Allowance Description1="UP TO 34 LINEAR INCHES/85 LINEAR CENTIMETERS" Pieces="1"/>
                  </BaggageInformation>
                  <BaggageInformation AirlineCode="JL" ProvisionType="B">
                    <Segment Id="3"/>
                    <Allowance Description1="UP TO 22 POUNDS/10 KILOGRAMS" Description2="UP TO 45 LINEAR INCHES/115 LINEAR CENTIMETERS" Pieces="1"/>
                  </BaggageInformation>
                </BaggageInformationList>
                <SeatSelectionList>
                  <SeatSelection Type="N">
                    <Segment ID="0"/>
                    <Segment ID="1"/>
                    <Segment ID="2"/>
                    <Segment ID="3"/>
                  </SeatSelection>
                </SeatSelectionList>
              </TPA_Extensions>
            </PassengerFare>
            <Endorsements NonRefundableIndicator="true"/>
            <TPA_Extensions>
              <FareCalcLine Info="SYD JL X/TYO JL LON212.32JL X/TYO JL SYD212.32NUC424.64END ROE1.328146"/>
            </TPA_Extensions>
            <FareInfos>
              <FareInfo>
                <FareReference>S</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="M"/>
                </TPA_Extensions>
              </FareInfo>
              <FareInfo>
                <FareReference>S</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="M"/>
                </TPA_Extensions>
              </FareInfo>
              <FareInfo>
                <FareReference>S</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                </TPA_Extensions>
              </FareInfo>
              <FareInfo>
                <FareReference>S</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="M"/>
                </TPA_Extensions>
              </FareInfo>
            </FareInfos>
          </PTC_FareBreakdown>
          <PTC_FareBreakdown>
            <PassengerTypeQuantity Code="INF" Quantity="1"/>
            <FareBasisCodes>
              <FareBasisCode ArrivalAirportCode="HND" BookingCode="S" DepartureAirportCode="SYD" FareComponentBeginAirport="SYD" FareComponentCabinCode="Y" FareComponentDirectionality="FROM" FareComponentEndAirport="LHR" FareComponentFareRule="2291" FareComponentFareTariff="44" FareComponentFareType="XEX" FareComponentFareTypeBitmap="01" FareComponentVendorCode="ATP" GovCarrier="JL">SNN0NPCE/IN90</FareBasisCode>
              <FareBasisCode ArrivalAirportCode="LHR" AvailabilityBreak="true" BookingCode="S" DepartureAirportCode="HND" GovCarrier="JL">SNN0NPCE/IN90</FareBasisCode>
              <FareBasisCode ArrivalAirportCode="HND" BookingCode="S" DepartureAirportCode="LHR" FareComponentBeginAirport="LHR" FareComponentCabinCode="Y" FareComponentDirectionality="TO" FareComponentEndAirport="SYD" FareComponentFareRule="2291" FareComponentFareTariff="44" FareComponentFareType="XEX" FareComponentFareTypeBitmap="01" FareComponentVendorCode="ATP" GovCarrier="JL">SNN0NPCE/IN90</FareBasisCode>
              <FareBasisCode ArrivalAirportCode="SYD" AvailabilityBreak="true" BookingCode="S" DepartureAirportCode="HND" GovCarrier="JL">SNN0NPCE/IN90</FareBasisCode>
            </FareBasisCodes>
            <PassengerFare>
              <BaseFare Amount="76.00" CurrencyCode="AUD"/>
              <FareConstruction Amount="56.62" CurrencyCode="NUC" DecimalPlaces="2"/>
              <EquivFare Amount="3420" CurrencyCode="RUB" DecimalPlaces="0"/>
              <Taxes>
                <Tax Amount="231" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQI"/>
                <Tax Amount="231" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQI"/>
                <Tax Amount="231" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQI"/>
                <Tax Amount="231" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQI"/>
                <Tax Amount="4457" CountryCode="GB" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="UB"/>
                <TaxSummary Amount="924" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQI"/>
                <TaxSummary Amount="4457" CountryCode="GB" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="UB"/>
                <TotalTax Amount="5381" CurrencyCode="RUB" DecimalPlaces="0"/>
              </Taxes>
              <TotalFare Amount="8801" CurrencyCode="RUB"/>
              <PenaltiesInfo>
                <Penalty Amount="0" Applicability="Before" Changeable="true" ConditionsApply="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                <Penalty Amount="0" Applicability="After" Changeable="true" ConditionsApply="true" CurrencyCode="RUB" DecimalPlaces="0" Type="Exchange"/>
                <Penalty Amount="27000" Applicability="Before" Cat16Info="true" CurrencyCode="RUB" DecimalPlaces="0" Refundable="true" Type="Refund"/>
                <Penalty Applicability="After" Cat16Info="true" Refundable="false" Type="Refund"/>
              </PenaltiesInfo>
              <TPA_Extensions>
                <Messages>
                  <Message AirlineCode="JL" FailCode="0" Info="RFND RESTR APPLY" Type="N"/>
                  <Message FailCode="0" Info="EACH INF REQUIRES ACCOMPANYING ADT PASSENGER" Type="W"/>
                  <Message FailCode="0" Info="VALIDATING CARRIER" Type="W"/>
                  <Message FailCode="0" Info="BSP - JL" Type="W"/>
                </Messages>
                <BaggageInformationList>
                  <BaggageInformation AirlineCode="JL" ProvisionType="A">
                    <Segment Id="0"/>
                    <Segment Id="1"/>
                    <Allowance Description1="UP TO 50 POUNDS/23 KILOGRAMS" Description2="UP TO 80 LINEAR INCHES/203 LINEAR CENTIMETERS" Pieces="1"/>
                  </BaggageInformation>
                  <BaggageInformation AirlineCode="JL" ProvisionType="A">
                    <Segment Id="2"/>
                    <Segment Id="3"/>
                    <Allowance Description1="UP TO 50 POUNDS/23 KILOGRAMS" Description2="UP TO 80 LINEAR INCHES/203 LINEAR CENTIMETERS" Pieces="1"/>
                  </BaggageInformation>
                  <BaggageInformation AirlineCode="JL" ProvisionType="B">
                    <Segment Id="0"/>
                    <Allowance Description1="UP TO 22 POUNDS/10 KILOGRAMS" Description2="UP TO 45 LINEAR INCHES/115 LINEAR CENTIMETERS" Pieces="1"/>
                  </BaggageInformation>
                  <BaggageInformation AirlineCode="JL" ProvisionType="B">
                    <Segment Id="1"/>
                    <Allowance Description1="UP TO 22 POUNDS/10 KILOGRAMS" Description2="UP TO 45 LINEAR INCHES/115 LINEAR CENTIMETERS" Pieces="1"/>
                  </BaggageInformation>
                  <BaggageInformation AirlineCode="BA" ProvisionType="B">
                    <Segment Id="2"/>
                    <Allowance Description1="UP TO 50 POUNDS/23 KILOGRAMS" Description2="UP TO 50 POUNDS/127 LINEAR CENTIMETERS" Pieces="1"/>
                  </BaggageInformation>
                  <BaggageInformation AirlineCode="JL" ProvisionType="B">
                    <Segment Id="3"/>
                    <Allowance Description1="UP TO 22 POUNDS/10 KILOGRAMS" Description2="UP TO 45 LINEAR INCHES/115 LINEAR CENTIMETERS" Pieces="1"/>
                  </BaggageInformation>
                </BaggageInformationList>
                <SeatSelectionList>
                  <SeatSelection Type="N">
                    <Segment ID="0"/>
                    <Segment ID="1"/>
                    <Segment ID="2"/>
                    <Segment ID="3"/>
                  </SeatSelection>
                </SeatSelectionList>
              </TPA_Extensions>
            </PassengerFare>
            <Endorsements NonRefundableIndicator="true"/>
            <TPA_Extensions>
              <FareCalcLine Info="SYD JL X/TYO JL LON28.31JL X/TYO JL SYD28.31NUC56.62END ROE1.328146"/>
            </TPA_Extensions>
            <FareInfos>
              <FareInfo>
                <FareReference>S</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="M"/>
                </TPA_Extensions>
              </FareInfo>
              <FareInfo>
                <FareReference>S</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="M"/>
                </TPA_Extensions>
              </FareInfo>
              <FareInfo>
                <FareReference>S</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                </TPA_Extensions>
              </FareInfo>
              <FareInfo>
                <FareReference>S</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="M"/>
                </TPA_Extensions>
              </FareInfo>
            </FareInfos>
          </PTC_FareBreakdown>
        </PTC_FareBreakdowns>
        <FareInfos>
          <FareInfo>
            <FareReference>S</FareReference>
            <TPA_Extensions>
              <SeatsRemaining BelowMin="false" Number="9"/>
              <Cabin Cabin="Y"/>
              <Meal Code="M"/>
            </TPA_Extensions>
          </FareInfo>
          <FareInfo>
            <FareReference>S</FareReference>
            <TPA_Extensions>
              <SeatsRemaining BelowMin="false" Number="9"/>
              <Cabin Cabin="Y"/>
              <Meal Code="M"/>
            </TPA_Extensions>
          </FareInfo>
          <FareInfo>
            <FareReference>S</FareReference>
            <TPA_Extensions>
              <SeatsRemaining BelowMin="false" Number="9"/>
              <Cabin Cabin="Y"/>
            </TPA_Extensions>
          </FareInfo>
          <FareInfo>
            <FareReference>S</FareReference>
            <TPA_Extensions>
              <SeatsRemaining BelowMin="false" Number="9"/>
              <Cabin Cabin="Y"/>
              <Meal Code="M"/>
            </TPA_Extensions>
          </FareInfo>
        </FareInfos>
        <TPA_Extensions>
          <DivideInParty Indicator="false"/>
          <AncillaryFeeGroups Message="AIR EXTRAS NOT APPLICABLE OR ARE UNKNOWN FOR THIS ITINERARY"/>
          <ValidatingCarrier NewVcxProcess="true" SettlementMethod="BSP">
            <Default Code="JL"/>
          </ValidatingCarrier>
        </TPA_Extensions>
      </AirItineraryPricingInfo>
      <TicketingInfo TicketType="eTicket" ValidInterline="Yes"/>
      <TPA_Extensions>
        <ValidatingCarrier Code="JL"/>
        <DiversitySwapper WeighedPriceAmount="489743"/>
      </TPA_Extensions>
    </PricedItinerary>
    <!--Другие рекомендации-->
  </PricedItineraries>
</OTA_AirLowFareSearchRS>
```
{{< /details >}}
