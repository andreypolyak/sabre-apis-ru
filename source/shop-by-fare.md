# Поиск перелетов по кодам тарифов

-----

**Оглавление:**
<!-- toc -->

-----

## Введение

Для проверки наличия мест по указанному коду тарифа в указанный промежуток дат и поиска рейсов по этому тарифу используется сервис [PromotionalShoppingRQ](https://developer.sabre.com/docs/read/soap_apis/air/search/shop_by_specific_fare).

Алгоритм получения информации о наличии мест по указанному тарифу состоит из нескольких запросов к сервису PromotionalShoppingRQ, которые описаны ниже.

*Обратите внимание на то, что сервис будет работать только в том случае, если для всего перелета используется один тариф.*

## Алгоритм поиска перелетов по коду тарифа

{% rd "0", "checked", "shop-by-fare" %}Round Trip маршрут (туда и обратно){% endrd %}

{% rd "1", "", "shop-by-fare" %}One Way маршрут (только туда){% endrd %}

{% imgsec "Схема", "0", "shop-by-fare" %}./assets/svg/shop-by-fare/shop-by-fare[RT].svg{% endimgsec %}

{% imgsec "Схема", "1", "shop-by-fare" %}./assets/svg/shop-by-fare/shop-by-fare[OW].svg{% endimgsec %}

## Общие для всех шагов элементы

Указанные ниже элементы и атрибуты должны быть заполнены во всех запросах и на всех шагах.

#### Параметры запроса

- ```/OTA_BestFareFinderRQ/BestFareFinderPreferences/@RequestStep``` — номер шага (см. ниже)
- ```/OTA_BestFareFinderRQ/BestFareFinderPreferences/@RequestType``` — тип перелета: ```O``` для One Way или ```R``` для Round Trip

#### Маршрут

- ```/OTA_BestFareFinderRQ/BestFareFinderPreferences/@ArrivalCity``` — код города или аэропорта прибытия
- ```/OTA_BestFareFinderRQ/BestFareFinderPreferences/@Carrier``` — код маркетингового перевозчика (перевозчика, по тарифу которого, должен быть произведен поиск мест)
- ```/OTA_BestFareFinderRQ/BestFareFinderPreferences/@DepartureCity``` — код города или аэропорта вылета

#### PCC

- ```/OTA_BestFareFinderRQ/POS/@CompanyCode``` — код компании, всегда ```TN```
- ```/OTA_BestFareFinderRQ/POS/@PseudoCityCode``` — PCC, в котором должна производиться проверка наличия мест

#### Информация о тарифе

- ```/OTA_BestFareFinderRQ/BestFareFinderPreferences/RequestedFares/RequestedFare/@FareAmount``` — величина тарифа
- ```/OTA_BestFareFinderRQ/BestFareFinderPreferences/RequestedFares/RequestedFare/@FareBasisCode``` — код тарифа
- ```/OTA_BestFareFinderRQ/BestFareFinderPreferences/RequestedFares/RequestedFare/@FareCurrency``` — код валюты тарифа

Указанные ниже атрибуты должны быть заполнены только в том случае, если производится поиск по приватному тарифу, требующему заполнения Account Code или Corporate ID.

- ```/OTA_BestFareFinderRQ/BestFareFinderPreferences/PrivateFareData/AccountCode/@Code``` — значение Account Code
- ```/OTA_BestFareFinderRQ/BestFareFinderPreferences/PrivateFareData/CorporateId/@Code``` — значение Corporate ID

#### Количество и категории пассажиров

Элемент ```/OTA_BestFareFinderRQ/BestFareFinderPreferences/PassengerTypes/PassengerType``` может повторяться в запросе для каждой дополнительной категории пассажира

- ```/OTA_BestFareFinderRQ/BestFareFinderPreferences/PassengerTypes/PassengerType/@Count``` — количество пассажиров
- ```/OTA_BestFareFinderRQ/BestFareFinderPreferences/PassengerTypes/PassengerType/@Type``` — категория пассажира

## Получение списка дат для вылета "Туда"

Шаг 1. На этом шаге производится проверка наличия мест на перелете "Туда".

- ```/OTA_BestFareFinderRQ/BestFareFinderPreferences/DateRange/@OutboundDate``` — дата начала промежутка проверки
- ```/OTA_BestFareFinderRQ/BestFareFinderPreferences/DateRange/@DateRange``` — количество дней для проверки наличия мест относительно указанного дня. Максимально можно указать 93 дня — 3 месяца

{% xmlsec "Пример запроса", false %}
<OTA_BestFareFinderRQ Version="1.0.4" xmlns="http://www.sabre.com/OTA/BFF/2010/07">
  <POS CompanyCode="TN" PseudoCityCode="9LSC"/>
  <BestFareFinderPreferences ArrivalCity="LON" Carrier="SU" DepartureCity="MOW" RequestStep="1" RequestType="R">
    <DateRange DateRange="90" OutboundDate="2018-09-01"/>
    <RequestedFares>
      <RequestedFare FareAmount="145" FareBasisCode="NVU5" FareCurrency="EUR"/>
    </RequestedFares>
    <PassengerTypes>
      <PassengerType Count="2" Type="ADT"/>
      <PassengerType Count="1" Type="CNN"/>
      <PassengerType Count="1" Type="INF"/>
    </PassengerTypes>
  </BestFareFinderPreferences>
</OTA_BestFareFinderRQ>
{% endxmlsec %}

{% xmlsec "Пример ответа", false %}
<OTA_BestFareFinderRS BestFareFinderOptions="90" Version="1.0.4" xmlns="http://www.sabre.com/OTA/BFF/2010/07">
  <Success/>
  <Warnings>
    <Warning Code="PROCESS" Text="PROCESSING ERROR DETECTED" Type="IF2"/>
    <Warning Code="TRANSACTIONID" MessageClass="I" Text="846360272632969174" Type="WORKERTHREAD"/>
    <Warning Code="TTFHLC700" MessageClass="I" Text="27033" Type="SERVER"/>
    <Warning Code="RULEID" MessageClass="I" Text="25598" Type="DRE"/>
    <Warning Code="RULEID" MessageClass="I" Text="13318" Type="DEFAULT"/>
  </Warnings>
  <Solutions>
    <Outbound DepartureDate="2018-09-01" FareBasisCode="NVU5"/>
    <Outbound DepartureDate="2018-09-02" FareBasisCode="NVU5"/>
    <Outbound DepartureDate="2018-09-03" FareBasisCode="NVU5"/>
    <Outbound DepartureDate="2018-09-04" FareBasisCode="NVU5"/>
    <Outbound DepartureDate="2018-09-05" FareBasisCode="NVU5"/>
    <Outbound DepartureDate="2018-09-06" FareBasisCode="NVU5"/>
    <Outbound DepartureDate="2018-09-07" FareBasisCode="NVU5"/>
    <Outbound DepartureDate="2018-09-08" FareBasisCode="NVU5"/>
    <Outbound DepartureDate="2018-09-09" FareBasisCode="NVU5"/>
    <Outbound DepartureDate="2018-09-10" FareBasisCode="NVU5"/>
    <Outbound DepartureDate="2018-09-11" FareBasisCode="NVU5"/>
    <Outbound DepartureDate="2018-09-12" FareBasisCode="NVU5"/>
    <Outbound DepartureDate="2018-09-13" FareBasisCode="NVU5"/>
    <Outbound DepartureDate="2018-09-14" FareBasisCode="NVU5"/>
    <Outbound DepartureDate="2018-09-15" FareBasisCode="NVU5"/>
    <Outbound DepartureDate="2018-09-16" FareBasisCode="NVU5"/>
    <Outbound DepartureDate="2018-09-17" FareBasisCode="NVU5"/>
    <Outbound DepartureDate="2018-09-18" FareBasisCode="NVU5"/>
    <Outbound DepartureDate="2018-09-19" FareBasisCode="NVU5"/>
    <Outbound DepartureDate="2018-09-20" FareBasisCode="NVU5"/>
    <Outbound DepartureDate="2018-09-21" FareBasisCode="NVU5"/>
    <Outbound DepartureDate="2018-09-22" FareBasisCode="NVU5"/>
    <Outbound DepartureDate="2018-09-23" FareBasisCode="NVU5"/>
    <Outbound DepartureDate="2018-09-24" FareBasisCode="NVU5"/>
    <Outbound DepartureDate="2018-09-25" FareBasisCode="NVU5"/>
    <Outbound DepartureDate="2018-09-26" FareBasisCode="NVU5"/>
    <Outbound DepartureDate="2018-09-27" FareBasisCode="NVU5"/>
    <Outbound DepartureDate="2018-09-28" FareBasisCode="NVU5"/>
    <Outbound DepartureDate="2018-09-29" FareBasisCode="NVU5"/>
    <Outbound DepartureDate="2018-09-30" FareBasisCode="NVU5"/>
    <Outbound DepartureDate="2018-10-01" FareBasisCode="NVU5"/>
    <Outbound DepartureDate="2018-10-02" FareBasisCode="NVU5"/>
    <Outbound DepartureDate="2018-10-03" FareBasisCode="NVU5"/>
    <Outbound DepartureDate="2018-10-04" FareBasisCode="NVU5"/>
    <Outbound DepartureDate="2018-10-05" FareBasisCode="NVU5"/>
    <Outbound DepartureDate="2018-10-06" FareBasisCode="NVU5"/>
    <Outbound DepartureDate="2018-10-07" FareBasisCode="NVU5"/>
    <Outbound DepartureDate="2018-10-08" FareBasisCode="NVU5"/>
    <Outbound DepartureDate="2018-10-09" FareBasisCode="NVU5"/>
    <Outbound DepartureDate="2018-10-10" FareBasisCode="NVU5"/>
    <Outbound DepartureDate="2018-10-11" FareBasisCode="NVU5"/>
    <Outbound DepartureDate="2018-10-12" FareBasisCode="NVU5"/>
    <Outbound DepartureDate="2018-10-13" FareBasisCode="NVU5"/>
    <Outbound DepartureDate="2018-10-14" FareBasisCode="NVU5"/>
    <Outbound DepartureDate="2018-10-15" FareBasisCode="NVU5"/>
    <Outbound DepartureDate="2018-10-16" FareBasisCode="NVU5"/>
    <Outbound DepartureDate="2018-10-17" FareBasisCode="NVU5"/>
    <Outbound DepartureDate="2018-10-18" FareBasisCode="NVU5"/>
    <Outbound DepartureDate="2018-10-19" FareBasisCode="NVU5"/>
    <Outbound DepartureDate="2018-10-20" FareBasisCode="NVU5"/>
    <Outbound DepartureDate="2018-10-21" FareBasisCode="NVU5"/>
    <Outbound DepartureDate="2018-10-22" FareBasisCode="NVU5"/>
    <Outbound DepartureDate="2018-10-23" FareBasisCode="NVU5"/>
    <Outbound DepartureDate="2018-10-24" FareBasisCode="NVU5"/>
    <Outbound DepartureDate="2018-10-25" FareBasisCode="NVU5"/>
    <Outbound DepartureDate="2018-10-26" FareBasisCode="NVU5"/>
    <Outbound DepartureDate="2018-10-27" FareBasisCode="NVU5"/>
    <Outbound DepartureDate="2018-10-28" FareBasisCode="NVU5"/>
    <Outbound DepartureDate="2018-10-29" FareBasisCode="NVU5"/>
    <Outbound DepartureDate="2018-10-30" FareBasisCode="NVU5"/>
    <Outbound DepartureDate="2018-10-31" FareBasisCode="NVU5"/>
    <Outbound DepartureDate="2018-11-01" FareBasisCode="NVU5"/>
    <Outbound DepartureDate="2018-11-02" FareBasisCode="NVU5"/>
    <Outbound DepartureDate="2018-11-03" FareBasisCode="NVU5"/>
    <Outbound DepartureDate="2018-11-04" FareBasisCode="NVU5"/>
    <Outbound DepartureDate="2018-11-05" FareBasisCode="NVU5"/>
    <Outbound DepartureDate="2018-11-06" FareBasisCode="NVU5"/>
    <Outbound DepartureDate="2018-11-07" FareBasisCode="NVU5"/>
    <Outbound DepartureDate="2018-11-08" FareBasisCode="NVU5"/>
    <Outbound DepartureDate="2018-11-09" FareBasisCode="NVU5"/>
    <Outbound DepartureDate="2018-11-10" FareBasisCode="NVU5"/>
    <Outbound DepartureDate="2018-11-11" FareBasisCode="NVU5"/>
    <Outbound DepartureDate="2018-11-12" FareBasisCode="NVU5"/>
    <Outbound DepartureDate="2018-11-13" FareBasisCode="NVU5"/>
    <Outbound DepartureDate="2018-11-14" FareBasisCode="NVU5"/>
    <Outbound DepartureDate="2018-11-15" FareBasisCode="NVU5"/>
    <Outbound DepartureDate="2018-11-16" FareBasisCode="NVU5"/>
    <Outbound DepartureDate="2018-11-17" FareBasisCode="NVU5"/>
    <Outbound DepartureDate="2018-11-18" FareBasisCode="NVU5"/>
    <Outbound DepartureDate="2018-11-19" FareBasisCode="NVU5"/>
    <Outbound DepartureDate="2018-11-20" FareBasisCode="NVU5"/>
    <Outbound DepartureDate="2018-11-21" FareBasisCode="NVU5"/>
    <Outbound DepartureDate="2018-11-22" FareBasisCode="NVU5"/>
    <Outbound DepartureDate="2018-11-23" FareBasisCode="NVU5"/>
    <Outbound DepartureDate="2018-11-24" FareBasisCode="NVU5"/>
    <Outbound DepartureDate="2018-11-25" FareBasisCode="NVU5"/>
    <Outbound DepartureDate="2018-11-26" FareBasisCode="NVU5"/>
    <Outbound DepartureDate="2018-11-27" FareBasisCode="NVU5"/>
    <Outbound DepartureDate="2018-11-28" FareBasisCode="NVU5"/>
    <Outbound DepartureDate="2018-11-29" FareBasisCode="NVU5"/>
  </Solutions>
</OTA_BestFareFinderRS>
{% endxmlsec %}

## Получение списка дат для вылета "Обратно"

Шаг 3. На этом шаге производится проверка наличия мест на перелете "Обратно".

- ```/OTA_BestFareFinderRQ/BestFareFinderPreferences/DateLists/Outbound/@Date``` — дата вылета "Туда"
- ```/OTA_BestFareFinderRQ/BestFareFinderPreferences/DateRange/@DateRange``` — количество дней для проверки наличия мест относительно указанного дня. Максимально можно указать 93 дня — 3 месяца

{% xmlsec "Пример запроса", false %}
<OTA_BestFareFinderRQ Version="1.0.4" xmlns="http://www.sabre.com/OTA/BFF/2010/07">
  <POS CompanyCode="TN" PseudoCityCode="9LSC"/>
  <BestFareFinderPreferences ArrivalCity="LON" Carrier="SU" DepartureCity="MOW" RequestStep="3" RequestType="R">
    <DateRange DateRange="90"/>
    <DateLists>
      <Outbound Date="2018-10-13"/>
    </DateLists>
    <RequestedFares>
      <RequestedFare FareAmount="145" FareBasisCode="NVU5" FareCurrency="EUR"/>
    </RequestedFares>
    <PassengerTypes>
      <PassengerType Count="1" Type="ADT"/>
      <PassengerType Count="1" Type="CNN"/>
      <PassengerType Count="1" Type="INF"/>
    </PassengerTypes>
  </BestFareFinderPreferences>
</OTA_BestFareFinderRQ>
{% endxmlsec %}

{% xmlsec "Пример ответа", false %}
<OTA_BestFareFinderRS BestFareFinderOptions="1" Version="1.0.4" xmlns="http://www.sabre.com/OTA/BFF/2010/07">
  <Success/>
  <Warnings>
    <Warning Code="PROCESS" Text="PROCESSING ERROR DETECTED" Type="IF2"/>
    <Warning Code="TRANSACTIONID" MessageClass="I" Text="846378574463267585" Type="WORKERTHREAD"/>
    <Warning Code="TTFHLC701" MessageClass="I" Text="27041" Type="SERVER"/>
    <Warning Code="RULEID" MessageClass="I" Text="25598" Type="DRE"/>
    <Warning Code="RULEID" MessageClass="I" Text="13318" Type="DEFAULT"/>
  </Warnings>
  <Solutions>
    <Outbound DepartureDate="2018-10-13">
      <Inbound DepartureDate="2018-10-13" FareBasisCode="NVU5"/>
      <Inbound DepartureDate="2018-10-14" FareBasisCode="NVU5"/>
      <Inbound DepartureDate="2018-10-15" FareBasisCode="NVU5"/>
      <Inbound DepartureDate="2018-10-16" FareBasisCode="NVU5"/>
      <Inbound DepartureDate="2018-10-17" FareBasisCode="NVU5"/>
      <Inbound DepartureDate="2018-10-18" FareBasisCode="NVU5"/>
      <Inbound DepartureDate="2018-10-19" FareBasisCode="NVU5"/>
      <Inbound DepartureDate="2018-10-20" FareBasisCode="NVU5"/>
      <Inbound DepartureDate="2018-10-21" FareBasisCode="NVU5"/>
      <Inbound DepartureDate="2018-10-22" FareBasisCode="NVU5"/>
      <Inbound DepartureDate="2018-10-23" FareBasisCode="NVU5"/>
      <Inbound DepartureDate="2018-10-24" FareBasisCode="NVU5"/>
      <Inbound DepartureDate="2018-10-25" FareBasisCode="NVU5"/>
      <Inbound DepartureDate="2018-10-26" FareBasisCode="NVU5"/>
      <Inbound DepartureDate="2018-10-27" FareBasisCode="NVU5"/>
      <Inbound DepartureDate="2018-10-28" FareBasisCode="NVU5"/>
      <Inbound DepartureDate="2018-10-29" FareBasisCode="NVU5"/>
      <Inbound DepartureDate="2018-10-30" FareBasisCode="NVU5"/>
      <Inbound DepartureDate="2018-10-31" FareBasisCode="NVU5"/>
      <Inbound DepartureDate="2018-11-01" FareBasisCode="NVU5"/>
      <Inbound DepartureDate="2018-11-02" FareBasisCode="NVU5"/>
      <Inbound DepartureDate="2018-11-03" FareBasisCode="NVU5"/>
      <Inbound DepartureDate="2018-11-04" FareBasisCode="NVU5"/>
      <Inbound DepartureDate="2018-11-05" FareBasisCode="NVU5"/>
      <Inbound DepartureDate="2018-11-06" FareBasisCode="NVU5"/>
      <Inbound DepartureDate="2018-11-07" FareBasisCode="NVU5"/>
      <Inbound DepartureDate="2018-11-08" FareBasisCode="NVU5"/>
      <Inbound DepartureDate="2018-11-09" FareBasisCode="NVU5"/>
      <Inbound DepartureDate="2018-11-10" FareBasisCode="NVU5"/>
      <Inbound DepartureDate="2018-11-11" FareBasisCode="NVU5"/>
      <Inbound DepartureDate="2018-11-12" FareBasisCode="NVU5"/>
      <Inbound DepartureDate="2018-11-13" FareBasisCode="NVU5"/>
      <Inbound DepartureDate="2018-11-14" FareBasisCode="NVU5"/>
      <Inbound DepartureDate="2018-11-15" FareBasisCode="NVU5"/>
      <Inbound DepartureDate="2018-11-16" FareBasisCode="NVU5"/>
      <Inbound DepartureDate="2018-11-17" FareBasisCode="NVU5"/>
      <Inbound DepartureDate="2018-11-18" FareBasisCode="NVU5"/>
      <Inbound DepartureDate="2018-11-19" FareBasisCode="NVU5"/>
      <Inbound DepartureDate="2018-11-20" FareBasisCode="NVU5"/>
      <Inbound DepartureDate="2018-11-21" FareBasisCode="NVU5"/>
      <Inbound DepartureDate="2018-11-22" FareBasisCode="NVU5"/>
      <Inbound DepartureDate="2018-11-23" FareBasisCode="NVU5"/>
      <Inbound DepartureDate="2018-11-24" FareBasisCode="NVU5"/>
      <Inbound DepartureDate="2018-11-25" FareBasisCode="NVU5"/>
      <Inbound DepartureDate="2018-11-26" FareBasisCode="NVU5"/>
      <Inbound DepartureDate="2018-11-27" FareBasisCode="NVU5"/>
      <Inbound DepartureDate="2018-11-28" FareBasisCode="NVU5"/>
      <Inbound DepartureDate="2018-11-29" FareBasisCode="NVU5"/>
      <Inbound DepartureDate="2018-11-30" FareBasisCode="NVU5"/>
      <Inbound DepartureDate="2018-12-01" FareBasisCode="NVU5"/>
      <Inbound DepartureDate="2018-12-02" FareBasisCode="NVU5"/>
      <Inbound DepartureDate="2018-12-03" FareBasisCode="NVU5"/>
      <Inbound DepartureDate="2018-12-04" FareBasisCode="NVU5"/>
      <Inbound DepartureDate="2018-12-05" FareBasisCode="NVU5"/>
      <Inbound DepartureDate="2018-12-06" FareBasisCode="NVU5"/>
      <Inbound DepartureDate="2018-12-07" FareBasisCode="NVU5"/>
      <Inbound DepartureDate="2018-12-08" FareBasisCode="NVU5"/>
      <Inbound DepartureDate="2018-12-09" FareBasisCode="NVU5"/>
      <Inbound DepartureDate="2018-12-10" FareBasisCode="NVU5"/>
      <Inbound DepartureDate="2018-12-11" FareBasisCode="NVU5"/>
      <Inbound DepartureDate="2018-12-12" FareBasisCode="NVU5"/>
      <Inbound DepartureDate="2018-12-13" FareBasisCode="NVU5"/>
      <Inbound DepartureDate="2018-12-14" FareBasisCode="NVU5"/>
      <Inbound DepartureDate="2018-12-15" FareBasisCode="NVU5"/>
      <Inbound DepartureDate="2018-12-16" FareBasisCode="NVU5"/>
      <Inbound DepartureDate="2018-12-17" FareBasisCode="NVU5"/>
      <Inbound DepartureDate="2018-12-18" FareBasisCode="NVU5"/>
      <Inbound DepartureDate="2018-12-19" FareBasisCode="NVU5"/>
      <Inbound DepartureDate="2018-12-20" FareBasisCode="NVU5"/>
      <Inbound DepartureDate="2018-12-21" FareBasisCode="NVU5"/>
      <Inbound DepartureDate="2018-12-22" FareBasisCode="NVU5"/>
      <Inbound Availability="false" DepartureDate="2018-12-23" FareBasisCode="NVU5"/>
      <Inbound DepartureDate="2018-12-24" FareBasisCode="NVU5"/>
      <Inbound DepartureDate="2018-12-25" FareBasisCode="NVU5"/>
      <Inbound DepartureDate="2018-12-26" FareBasisCode="NVU5"/>
      <Inbound DepartureDate="2018-12-27" FareBasisCode="NVU5"/>
      <Inbound DepartureDate="2018-12-28" FareBasisCode="NVU5"/>
      <Inbound DepartureDate="2018-12-29" FareBasisCode="NVU5"/>
      <Inbound DepartureDate="2018-12-30" FareBasisCode="NVU5"/>
      <Inbound DepartureDate="2018-12-31" FareBasisCode="NVU5"/>
      <Inbound DepartureDate="2019-01-01" FareBasisCode="NVU5"/>
      <Inbound DepartureDate="2019-01-02" FareBasisCode="NVU5"/>
      <Inbound DepartureDate="2019-01-03" FareBasisCode="NVU5"/>
      <Inbound DepartureDate="2019-01-04" FareBasisCode="NVU5"/>
      <Inbound Availability="false" DepartureDate="2019-01-05" FareBasisCode="NVU5"/>
      <Inbound DepartureDate="2019-01-06" FareBasisCode="NVU5"/>
      <Inbound Availability="false" DepartureDate="2019-01-07" FareBasisCode="NVU5"/>
      <Inbound Availability="false" DepartureDate="2019-01-08" FareBasisCode="NVU5"/>
      <Inbound Availability="false" DepartureDate="2019-01-09" FareBasisCode="NVU5"/>
      <Inbound Availability="false" DepartureDate="2019-01-10" FareBasisCode="NVU5"/>
    </Outbound>
  </Solutions>
</OTA_BestFareFinderRS>
{% endxmlsec %}

## Получения списка рейсов для вылета "Туда"

Шаг 5. На этом шаге производится получение списка вариантов перелета (рейсов) по выбранному тарифу в выбранную дату.

- ```/OTA_BestFareFinderRQ/BestFareFinderPreferences/@OutboundDateTime``` — дата вылета "Туда"

{% xmlsec "Пример запроса", false %}
<OTA_BestFareFinderRQ Version="1.0.4" xmlns="http://www.sabre.com/OTA/BFF/2010/07">
  <POS CompanyCode="TN" PseudoCityCode="9LSC"/>
  <BestFareFinderPreferences ArrivalCity="LON" Carrier="SU" DepartureCity="MOW" OutboundDateTime="2018-10-13T00:00:00" RequestStep="5" RequestType="R">
    <RequestedFares>
      <RequestedFare FareAmount="145" FareBasisCode="NVU5" FareCurrency="EUR"/>
    </RequestedFares>
    <PassengerTypes>
      <PassengerType Count="1" Type="ADT"/>
      <PassengerType Count="1" Type="CNN"/>
      <PassengerType Count="1" Type="INF"/>
    </PassengerTypes>
  </BestFareFinderPreferences>
</OTA_BestFareFinderRQ>
{% endxmlsec %}

{% xmlsec "Пример ответа", false %}
<OTA_BestFareFinderRS BestFareFinderOptions="1" Version="1.0.4" xmlns="http://www.sabre.com/OTA/BFF/2010/07">
  <Success/>
  <Warnings>
    <Warning Code="PROCESS" Text="No complete journey can be built in IF2/ADVJR1." Type="IF2"/>
    <Warning Code="TRANSACTIONID" MessageClass="I" Text="846395796203338847" Type="WORKERTHREAD"/>
    <Warning Code="TTFHLC951" MessageClass="I" Text="27039" Type="SERVER"/>
    <Warning Code="RULEID" MessageClass="I" Text="25598" Type="DRE"/>
    <Warning Code="RULEID" MessageClass="I" Text="13318" Type="DEFAULT"/>
    <Warning Code="MSG" MessageClass="I" Text="NO FLIGHT SCHEDULES FOR QUALIFIERS USED" Type="SCHEDULES"/>
  </Warnings>
  <Solutions>
    <Outbound DepartureDate="2018-10-13" FareBasisCode="NVU5">
      <Schedules>
        <Schedule>
          <Flight ElapsedTime="260" Equipment="321" MarriageGrp="O" ResBookDesigCode="N">
            <Departure Airport="SVO" DateTime="2018-10-13T13:40:00" GMTOffset="3"/>
            <Arrival Airport="LHR" DateTime="2018-10-13T16:00:00" GMTOffset="1"/>
            <MarketingAirline Code="SU" FlightNumber="2582"/>
            <OperatingAirline Code="SU" FlightNumber="2582"/>
          </Flight>
        </Schedule>
        <Schedule>
          <Flight ElapsedTime="245" Equipment="333" MarriageGrp="O" ResBookDesigCode="N">
            <Departure Airport="SVO" DateTime="2018-10-13T10:00:00" GMTOffset="3"/>
            <Arrival Airport="LHR" DateTime="2018-10-13T12:05:00" GMTOffset="1"/>
            <MarketingAirline Code="SU" FlightNumber="2578"/>
            <OperatingAirline Code="SU" FlightNumber="2578"/>
          </Flight>
        </Schedule>
        <Schedule>
          <Flight ElapsedTime="245" Equipment="320" MarriageGrp="O" ResBookDesigCode="N">
            <Departure Airport="SVO" DateTime="2018-10-13T08:50:00" GMTOffset="3"/>
            <Arrival Airport="LHR" DateTime="2018-10-13T10:55:00" GMTOffset="1"/>
            <MarketingAirline Code="SU" FlightNumber="2576"/>
            <OperatingAirline Code="SU" FlightNumber="2576"/>
          </Flight>
        </Schedule>
        <Schedule>
          <Flight ElapsedTime="250" Equipment="73H" MarriageGrp="O" ResBookDesigCode="N">
            <Departure Airport="SVO" DateTime="2018-10-13T05:50:00" GMTOffset="3"/>
            <Arrival Airport="LHR" DateTime="2018-10-13T08:00:00" GMTOffset="1"/>
            <MarketingAirline Code="SU" FlightNumber="2570"/>
            <OperatingAirline Code="SU" FlightNumber="2570"/>
          </Flight>
        </Schedule>
        <Schedule>
          <Flight ElapsedTime="240" Equipment="333" MarriageGrp="O" ResBookDesigCode="N">
            <Departure Airport="SVO" DateTime="2018-10-13T19:25:00" GMTOffset="3"/>
            <Arrival Airport="LHR" DateTime="2018-10-13T21:25:00" GMTOffset="1"/>
            <MarketingAirline Code="SU" FlightNumber="263"/>
            <OperatingAirline Code="SU" FlightNumber="263"/>
          </Flight>
        </Schedule>
        <Schedule>
          <Flight ElapsedTime="80" Equipment="73H" MarriageGrp="O" ResBookDesigCode="N">
            <Departure Airport="SVO" DateTime="2018-10-13T12:00:00" GMTOffset="3"/>
            <Arrival Airport="LED" DateTime="2018-10-13T13:20:00" GMTOffset="3"/>
            <MarketingAirline Code="SU" FlightNumber="42"/>
            <OperatingAirline Code="SU" FlightNumber="42"/>
          </Flight>
          <Flight ElapsedTime="210" Equipment="319" MarriageGrp="O" ResBookDesigCode="N">
            <Departure Airport="LED" DateTime="2018-10-13T14:30:00" GMTOffset="3"/>
            <Arrival Airport="LGW" DateTime="2018-10-13T16:00:00" GMTOffset="1"/>
            <MarketingAirline Code="SU" FlightNumber="6619"/>
            <OperatingAirline Code="SU" FlightNumber="6619" ShortName="FV"/>
          </Flight>
        </Schedule>
        <Schedule>
          <Flight ElapsedTime="80" Equipment="320" MarriageGrp="O" ResBookDesigCode="N">
            <Departure Airport="SVO" DateTime="2018-10-13T11:30:00" GMTOffset="3"/>
            <Arrival Airport="LED" DateTime="2018-10-13T12:50:00" GMTOffset="3"/>
            <MarketingAirline Code="SU" FlightNumber="16"/>
            <OperatingAirline Code="SU" FlightNumber="16"/>
          </Flight>
          <Flight ElapsedTime="210" Equipment="319" MarriageGrp="O" ResBookDesigCode="N">
            <Departure Airport="LED" DateTime="2018-10-13T14:30:00" GMTOffset="3"/>
            <Arrival Airport="LGW" DateTime="2018-10-13T16:00:00" GMTOffset="1"/>
            <MarketingAirline Code="SU" FlightNumber="6619"/>
            <OperatingAirline Code="SU" FlightNumber="6619" ShortName="FV"/>
          </Flight>
        </Schedule>
        <Schedule>
          <Flight ElapsedTime="80" Equipment="32A" MarriageGrp="O" ResBookDesigCode="N">
            <Departure Airport="SVO" DateTime="2018-10-13T10:55:00" GMTOffset="3"/>
            <Arrival Airport="LED" DateTime="2018-10-13T12:15:00" GMTOffset="3"/>
            <MarketingAirline Code="SU" FlightNumber="14"/>
            <OperatingAirline Code="SU" FlightNumber="14"/>
          </Flight>
          <Flight ElapsedTime="210" Equipment="319" MarriageGrp="O" ResBookDesigCode="N">
            <Departure Airport="LED" DateTime="2018-10-13T14:30:00" GMTOffset="3"/>
            <Arrival Airport="LGW" DateTime="2018-10-13T16:00:00" GMTOffset="1"/>
            <MarketingAirline Code="SU" FlightNumber="6619"/>
            <OperatingAirline Code="SU" FlightNumber="6619" ShortName="FV"/>
          </Flight>
        </Schedule>
        <Schedule>
          <Flight ElapsedTime="85" Equipment="319" MarriageGrp="O" ResBookDesigCode="N">
            <Departure Airport="VKO" DateTime="2018-10-13T09:55:00" GMTOffset="3"/>
            <Arrival Airport="LED" DateTime="2018-10-13T11:20:00" GMTOffset="3"/>
            <MarketingAirline Code="SU" FlightNumber="6024"/>
            <OperatingAirline Code="SU" FlightNumber="6024" ShortName="FV"/>
          </Flight>
          <Flight ElapsedTime="210" Equipment="319" MarriageGrp="O" ResBookDesigCode="N">
            <Departure Airport="LED" DateTime="2018-10-13T14:30:00" GMTOffset="3"/>
            <Arrival Airport="LGW" DateTime="2018-10-13T16:00:00" GMTOffset="1"/>
            <MarketingAirline Code="SU" FlightNumber="6619"/>
            <OperatingAirline Code="SU" FlightNumber="6619" ShortName="FV"/>
          </Flight>
        </Schedule>
        <Schedule>
          <Flight ElapsedTime="85" Equipment="320" MarriageGrp="O" ResBookDesigCode="N">
            <Departure Airport="SVO" DateTime="2018-10-13T09:50:00" GMTOffset="3"/>
            <Arrival Airport="LED" DateTime="2018-10-13T11:15:00" GMTOffset="3"/>
            <MarketingAirline Code="SU" FlightNumber="12"/>
            <OperatingAirline Code="SU" FlightNumber="12"/>
          </Flight>
          <Flight ElapsedTime="210" Equipment="319" MarriageGrp="O" ResBookDesigCode="N">
            <Departure Airport="LED" DateTime="2018-10-13T14:30:00" GMTOffset="3"/>
            <Arrival Airport="LGW" DateTime="2018-10-13T16:00:00" GMTOffset="1"/>
            <MarketingAirline Code="SU" FlightNumber="6619"/>
            <OperatingAirline Code="SU" FlightNumber="6619" ShortName="FV"/>
          </Flight>
        </Schedule>
        <Schedule>
          <Flight ElapsedTime="80" Equipment="32B" MarriageGrp="O" ResBookDesigCode="N">
            <Departure Airport="SVO" DateTime="2018-10-13T08:25:00" GMTOffset="3"/>
            <Arrival Airport="LED" DateTime="2018-10-13T09:45:00" GMTOffset="3"/>
            <MarketingAirline Code="SU" FlightNumber="10"/>
            <OperatingAirline Code="SU" FlightNumber="10"/>
          </Flight>
          <Flight ElapsedTime="210" Equipment="319" MarriageGrp="O" ResBookDesigCode="N">
            <Departure Airport="LED" DateTime="2018-10-13T14:30:00" GMTOffset="3"/>
            <Arrival Airport="LGW" DateTime="2018-10-13T16:00:00" GMTOffset="1"/>
            <MarketingAirline Code="SU" FlightNumber="6619"/>
            <OperatingAirline Code="SU" FlightNumber="6619" ShortName="FV"/>
          </Flight>
        </Schedule>
        <Schedule>
          <Flight ElapsedTime="80" Equipment="32A" MarriageGrp="O" ResBookDesigCode="N">
            <Departure Airport="SVO" DateTime="2018-10-13T07:10:00" GMTOffset="3"/>
            <Arrival Airport="LED" DateTime="2018-10-13T08:30:00" GMTOffset="3"/>
            <MarketingAirline Code="SU" FlightNumber="6"/>
            <OperatingAirline Code="SU" FlightNumber="6"/>
          </Flight>
          <Flight ElapsedTime="210" Equipment="319" MarriageGrp="O" ResBookDesigCode="N">
            <Departure Airport="LED" DateTime="2018-10-13T14:30:00" GMTOffset="3"/>
            <Arrival Airport="LGW" DateTime="2018-10-13T16:00:00" GMTOffset="1"/>
            <MarketingAirline Code="SU" FlightNumber="6619"/>
            <OperatingAirline Code="SU" FlightNumber="6619" ShortName="FV"/>
          </Flight>
        </Schedule>
        <Schedule>
          <Flight ElapsedTime="80" Equipment="320" MarriageGrp="O" ResBookDesigCode="N">
            <Departure Airport="SVO" DateTime="2018-10-13T06:05:00" GMTOffset="3"/>
            <Arrival Airport="LED" DateTime="2018-10-13T07:25:00" GMTOffset="3"/>
            <MarketingAirline Code="SU" FlightNumber="2"/>
            <OperatingAirline Code="SU" FlightNumber="2"/>
          </Flight>
          <Flight ElapsedTime="210" Equipment="319" MarriageGrp="O" ResBookDesigCode="N">
            <Departure Airport="LED" DateTime="2018-10-13T14:30:00" GMTOffset="3"/>
            <Arrival Airport="LGW" DateTime="2018-10-13T16:00:00" GMTOffset="1"/>
            <MarketingAirline Code="SU" FlightNumber="6619"/>
            <OperatingAirline Code="SU" FlightNumber="6619" ShortName="FV"/>
          </Flight>
        </Schedule>
      </Schedules>
    </Outbound>
  </Solutions>
</OTA_BestFareFinderRS>
{% endxmlsec %}

## Получения списка рейсов для вылета "Обратно"

Шаг 6. На этом шаге производится получение списка вариантов перелета (рейсов) по выбранному тарифу в выбранную дату.

- ```/OTA_BestFareFinderRQ/BestFareFinderPreferences/@OutboundDateTime``` — дата вылета "Туда"
- ```/OTA_BestFareFinderRQ/BestFareFinderPreferences/@InboundDateTime``` — дата вылета "Обратно"

{% xmlsec "Пример запроса", false %}
<OTA_BestFareFinderRQ Version="1.0.4" xmlns="http://www.sabre.com/OTA/BFF/2010/07">
  <POS CompanyCode="TN" PseudoCityCode="9LSC"/>
  <BestFareFinderPreferences ArrivalCity="LON" Carrier="SU" DepartureCity="MOW" InboundDateTime="2018-11-13T00:00:00" OutboundDateTime="2018-10-13T00:00:00" RequestStep="6" RequestType="R">
    <RequestedFares>
      <RequestedFare FareAmount="145" FareBasisCode="NVU5" FareCurrency="EUR"/>
    </RequestedFares>
    <PassengerTypes>
      <PassengerType Count="1" Type="ADT"/>
      <PassengerType Count="1" Type="CNN"/>
      <PassengerType Count="1" Type="INF"/>
    </PassengerTypes>
  </BestFareFinderPreferences>
</OTA_BestFareFinderRQ>
{% endxmlsec %}

{% xmlsec "Пример ответа", false %}
<OTA_BestFareFinderRS BestFareFinderOptions="1" Version="1.0.4" xmlns="http://www.sabre.com/OTA/BFF/2010/07">
  <Success/>
  <Warnings>
    <Warning Code="PROCESS" Text="No complete journey can be built in IF2/ADVJR1." Type="IF2"/>
    <Warning Code="TRANSACTIONID" MessageClass="I" Text="846415029961455335" Type="WORKERTHREAD"/>
    <Warning Code="TTFHLC950" MessageClass="I" Text="27034" Type="SERVER"/>
    <Warning Code="RULEID" MessageClass="I" Text="25598" Type="DRE"/>
    <Warning Code="RULEID" MessageClass="I" Text="13318" Type="DEFAULT"/>
    <Warning Code="MSG" MessageClass="I" Text="NO FLIGHT SCHEDULES FOR QUALIFIERS USED" Type="SCHEDULES"/>
  </Warnings>
  <Solutions>
    <Outbound DepartureDate="2018-10-13">
      <Inbound DepartureDate="2018-11-13" FareBasisCode="NVU5">
        <Schedules>
          <Schedule>
            <Flight ElapsedTime="225" Equipment="333" MarriageGrp="O" ResBookDesigCode="N">
              <Departure Airport="LHR" DateTime="2018-11-13T13:30:00" GMTOffset="0"/>
              <Arrival Airport="SVO" DateTime="2018-11-13T20:15:00" GMTOffset="3"/>
              <MarketingAirline Code="SU" FlightNumber="2579"/>
              <OperatingAirline Code="SU" FlightNumber="2579"/>
            </Flight>
          </Schedule>
          <Schedule>
            <Flight ElapsedTime="235" Equipment="321" MarriageGrp="O" ResBookDesigCode="N">
              <Departure Airport="LHR" DateTime="2018-11-13T10:40:00" GMTOffset="0"/>
              <Arrival Airport="SVO" DateTime="2018-11-13T17:35:00" GMTOffset="3"/>
              <MarketingAirline Code="SU" FlightNumber="2581"/>
              <OperatingAirline Code="SU" FlightNumber="2581"/>
            </Flight>
          </Schedule>
          <Schedule>
            <Flight ElapsedTime="215" Equipment="32B" MarriageGrp="O" ResBookDesigCode="N">
              <Departure Airport="LHR" DateTime="2018-11-13T22:30:00" GMTOffset="0"/>
              <Arrival Airport="SVO" DateTime="2018-11-14T05:05:00" GMTOffset="3"/>
              <MarketingAirline Code="SU" FlightNumber="2585"/>
              <OperatingAirline Code="SU" FlightNumber="2585"/>
            </Flight>
          </Schedule>
        </Schedules>
      </Inbound>
    </Outbound>
  </Solutions>
</OTA_BestFareFinderRS>
{% endxmlsec %}
