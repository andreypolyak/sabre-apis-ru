# Получение списка дополнительных услуг

-----

**Оглавление:**
<!-- toc -->

-----

## Введение

*Для получения списка дополнительных услуг в других PCC предварительно требуется отправить запрос к сервису [ContextChangeLLSRQ](https://developer.sabre.com/docs/read/soap_apis/management/utility/change_aaa) (см. [Переход в другие PCC](change-pcc.md)).*

Для получения списка дополнительных услуг используется сервис [GetAncillaryOffersRQ](https://developer.sabre.com/docs/soap_apis/air/search/get_ancillary_offers).

Обратите внимание на то, что в запросе к сервису используются разные неймспейсы. В данных рекомендациях они имеют следующие коды:
- ```gao``` — ```http://services.sabre.com/merch/ancillary/offer/v03```
- ```anc``` — ```http://services.sabre.com/merch/ancillary/v03```
- ```flt``` — ```http://services.sabre.com/merch/flight/v03```
- ```itin``` — ```http://services.sabre.com/merch/itinerary/v03```
- ```pax``` — ```http://services.sabre.com/merch/passenger/v03```

## Общие параметры запроса списка дополнительных услуг

В запросе необходимо указать следующие параметры:

- ```/gao:GetAncillaryOffersRQ/gao:RequestType``` — тип запроса. Всегда значение ```payload```
- ```/gao:GetAncillaryOffersRQ/gao:RequestMode``` — режим запроса. Всегда значение ```booking```

Опционально можно указать:
- ```/gao:GetAncillaryOffersRQ/gao:AncillaryRequestOptions/anc:Group``` — категория запрашиваемых дополнительных услуг. Возможные значения:
    - ```BG``` — багаж
    - ```GT``` — наземные перевозки
    - ```IE``` — развлечения на борту
    - ```LG``` — доступ в залы ожидания
    - ```MD``` — медицинские услуги
    - ```PT``` — перевозка животных
    - ```SA``` — бронирование мест в салоне
    - ```ML``` — питание и напитки
    - ```UN``` — несопровождаемые дети

По умолчанию в ответе на запрос будут представлены все возможные дополнительные услуги.

Сервис позволяет запросить список дополнительных услуг как до оформления билетов, так и после их оформления. В зависимости от этого различается список элементов и атрибутов, которые требуется указать в запросе.

## Параметры запроса списка дополнительных услуг до оформления билетов

### Пассажиры

*Обратите внимание на то, что в Sabre нельзя забронировать дополнительные услуги для младенцев без места.*

Для каждого пассажира в бронировании необходимо указать:

- ```/gao:GetAncillaryOffersRQ/gao:QueryByItinerary/gao:QueryPassengerItinerary/gao:Passenger/@id``` — уникальный идентификатор пассажира
- ```/gao:GetAncillaryOffersRQ/gao:QueryByItinerary/gao:QueryPassengerItinerary/gao:Passenger/@type``` — категория пассажира

Для каждой связки пассажира и сегмента необходимо указать:

- ```/gao:GetAncillaryOffersRQ/gao:QueryByItinerary/gao:QueryPassengerItinerary/gao:PassengerItinerary/gao:PassengerSegment/@segmentRef``` — идентификатор соответствующего сегмента
- ```/gao:GetAncillaryOffersRQ/gao:QueryByItinerary/gao:QueryPassengerItinerary/gao:PassengerItinerary/gao:PassengerSegment/itin:FareBreakAssociation/@FareInfoRef``` — идентификатор тарифа, использованного для расчета стоимости для указанного пассажира на указанном сегменте

### Сегменты

Для каждого сегмента в бронировании необходимо указать:
- ```/gao:GetAncillaryOffersRQ/gao:QueryByItinerary/gao:Segment/@id``` — уникальный идентификатор сегмента
- ```/gao:GetAncillaryOffersRQ/gao:QueryByItinerary/gao:Segment/itin:FlightDetail/@id``` — уникальный идентификатор рейса
- ```/gao:GetAncillaryOffersRQ/gao:QueryByItinerary/gao:Segment/itin:FlightDetail/flt:Airline``` — код маркетингового перевозчика
- ```/gao:GetAncillaryOffersRQ/gao:QueryByItinerary/gao:Segment/itin:FlightDetail/flt:FlightNumber``` — номер рейса
- ```/gao:GetAncillaryOffersRQ/gao:QueryByItinerary/gao:Segment/itin:FlightDetail/flt:DepartureAirport``` — код аэропорта отправления
- ```/gao:GetAncillaryOffersRQ/gao:QueryByItinerary/gao:Segment/itin:FlightDetail/flt:DepartureDate``` — дата вылета
- ```/gao:GetAncillaryOffersRQ/gao:QueryByItinerary/gao:Segment/itin:FlightDetail/flt:DepartureTime``` — время вылета
- ```/gao:GetAncillaryOffersRQ/gao:QueryByItinerary/gao:Segment/itin:FlightDetail/flt:ArrivalAirport``` — код аэропорта прибытия
- ```/gao:GetAncillaryOffersRQ/gao:QueryByItinerary/gao:Segment/itin:FlightDetail/flt:ClassOfService``` — класс бронирования

### Тарифы

Для каждого использованного при расчете стоимости тарифа необходимо указать:

*Обратите внимание на то, что в случае запроса списка дополнительных услуг для разных категорий пассажиров (например, для взрослых и детей) необходимо указать соответствующие им тарифы.*

- ```/gao:GetAncillaryOffersRQ/gao:QueryByItinerary/gao:FareInfo/@id``` — уникальный идентификатор тарифа
- ```/gao:GetAncillaryOffersRQ/gao:QueryByItinerary/gao:FareInfo/FareComponentID``` — номер компонента тарифа
- ```/gao:GetAncillaryOffersRQ/gao:QueryByItinerary/gao:FareInfo/GoverningCarrier``` — код перевозчика, зафайлировавшего тариф
- ```/gao:GetAncillaryOffersRQ/gao:QueryByItinerary/gao:FareInfo/FareBasisCode``` — код тарифа

### Пример

{% xmlsec "Пример запроса", false %}
<gao:GetAncillaryOffersRQ version="3.1.0" xmlns:anc="http://services.sabre.com/merch/ancillary/v03" xmlns:flt="http://services.sabre.com/merch/flight/v03" xmlns:gao="http://services.sabre.com/merch/ancillary/offer/v03" xmlns:itin="http://services.sabre.com/merch/itinerary/v03" xmlns:pax="http://services.sabre.com/merch/passenger/v03">
  <gao:RequestType>payload</gao:RequestType>
  <gao:RequestMode>booking</gao:RequestMode>
  <gao:QueryByItinerary>
    <gao:QueryPassengerItinerary>
      <gao:Passenger id="pax_1" type="ADT">
        <pax:PersonName>
          <pax:First>IVAN MR</pax:First>
          <pax:Last>IVANOV</pax:Last>
        </pax:PersonName>
      </gao:Passenger>
      <gao:PassengerItinerary>
        <gao:PassengerSegment segmentRef="seg_1">
          <itin:FareBreakAssociation FareInfoRef="fare_1"/>
        </gao:PassengerSegment>
        <gao:PassengerSegment segmentRef="seg_2">
          <itin:FareBreakAssociation FareInfoRef="fare_2"/>
        </gao:PassengerSegment>
      </gao:PassengerItinerary>
    </gao:QueryPassengerItinerary>
    <gao:QueryPassengerItinerary>
      <gao:Passenger id="pax_2" type="ADT">
        <pax:PersonName>
          <pax:First>ELENA MS</pax:First>
          <pax:Last>IVANOVA</pax:Last>
        </pax:PersonName>
      </gao:Passenger>
      <gao:PassengerItinerary>
        <gao:PassengerSegment segmentRef="seg_1">
          <itin:FareBreakAssociation FareInfoRef="fare_1"/>
        </gao:PassengerSegment>
        <gao:PassengerSegment segmentRef="seg_2">
          <itin:FareBreakAssociation FareInfoRef="fare_2"/>
        </gao:PassengerSegment>
      </gao:PassengerItinerary>
    </gao:QueryPassengerItinerary>
    <gao:QueryPassengerItinerary>
      <gao:Passenger id="pax_3" type="CNN">
        <pax:PersonName>
          <pax:First>ANDREY</pax:First>
          <pax:Last>IVANOV</pax:Last>
        </pax:PersonName>
      </gao:Passenger>
      <gao:PassengerItinerary>
        <gao:PassengerSegment segmentRef="seg_1">
          <itin:FareBreakAssociation FareInfoRef="fare_3"/>
        </gao:PassengerSegment>
        <gao:PassengerSegment segmentRef="seg_2">
          <itin:FareBreakAssociation FareInfoRef="fare_4"/>
        </gao:PassengerSegment>
      </gao:PassengerItinerary>
    </gao:QueryPassengerItinerary>
    <gao:Segment id="seg_1">
      <itin:FlightDetail id="flight_1">
        <flt:Airline>EY</flt:Airline>
        <flt:FlightNumber>68</flt:FlightNumber>
        <flt:DepartureAirport>DME</flt:DepartureAirport>
        <flt:DepartureDate>2020-09-01</flt:DepartureDate>
        <flt:DepartureTime>12:40:00</flt:DepartureTime>
        <flt:ArrivalAirport>AUH</flt:ArrivalAirport>
        <flt:ClassOfService>Y</flt:ClassOfService>
      </itin:FlightDetail>
    </gao:Segment>
    <gao:Segment id="seg_2">
      <itin:FlightDetail id="flight_2">
        <flt:Airline>EY</flt:Airline>
        <flt:FlightNumber>65</flt:FlightNumber>
        <flt:DepartureAirport>AUH</flt:DepartureAirport>
        <flt:DepartureDate>2020-09-08</flt:DepartureDate>
        <flt:DepartureTime>02:25:00</flt:DepartureTime>
        <flt:ArrivalAirport>DME</flt:ArrivalAirport>
        <flt:ClassOfService>B</flt:ClassOfService>
      </itin:FlightDetail>
    </gao:Segment>
    <gao:FareInfo id="fare_1">
      <FareComponentID>1</FareComponentID>
      <GoverningCarrier>EY</GoverningCarrier>
      <FareBasisCode>YLRTRU/YF</FareBasisCode>
    </gao:FareInfo>
    <gao:FareInfo id="fare_2">
      <FareComponentID>2</FareComponentID>
      <GoverningCarrier>EY</GoverningCarrier>
      <FareBasisCode>BLRTRU/YF</FareBasisCode>
    </gao:FareInfo>
    <gao:FareInfo id="fare_3">
      <FareComponentID>1</FareComponentID>
      <GoverningCarrier>EY</GoverningCarrier>
      <FareBasisCode>YLRTRUCH/YF</FareBasisCode>
    </gao:FareInfo>
    <gao:FareInfo id="fare_4">
      <FareComponentID>2</FareComponentID>
      <GoverningCarrier>EY</GoverningCarrier>
      <FareBasisCode>BLRTRUCH/YF</FareBasisCode>
    </gao:FareInfo>
  </gao:QueryByItinerary>
</gao:GetAncillaryOffersRQ>
{% endxmlsec %}

{% xmlsec "Пример ответа", false %}
<ns38:GetAncillaryOffersRS xmlns:ns38="http://services.sabre.com/merch/ancillary/offer/v03">
  <ns20:ApplicationResults status="Complete" xmlns:ns20="http://services.sabre.com/STL_Payload/v02_01">
    <ns20:Success timeStamp="2020-01-23T07:01:39.311-06:00"/>
  </ns20:ApplicationResults>
  <ns38:AncillaryDefinition id="ancillary_5">
    <SubCode>0BQ</SubCode>
    <Airline>EY</Airline>
    <CommercialName>TRAIN</CommercialName>
    <Vendor>MMGR</Vendor>
    <Group>GT</Group>
    <GroupDescription>GROUND TRANSPORTATION</GroupDescription>
    <SubGroup>TN</SubGroup>
    <SubGroupDescription>TRAIN</SubGroupDescription>
    <ReasonForIssuance code="B">GROUND_TRANSPORT_NON_AIR_SERVICES</ReasonForIssuance>
    <ElectronicMiscDocType code="2">FLIGHT_COUPON_ASSOCIATED</ElectronicMiscDocType>
    <BookingMethod code="BLANK">ANY_ALLOWED</BookingMethod>
  </ns38:AncillaryDefinition>
  <ns38:AncillaryDefinition id="ancillary_6">
    <SubCode>0BR</SubCode>
    <Airline>EY</Airline>
    <CommercialName>TRANSFER</CommercialName>
    <Vendor>MMGR</Vendor>
    <Group>GT</Group>
    <GroupDescription>GROUND TRANSPORTATION</GroupDescription>
    <SubGroup>TF</SubGroup>
    <SubGroupDescription>TRANSFER</SubGroupDescription>
    <ReasonForIssuance code="B">GROUND_TRANSPORT_NON_AIR_SERVICES</ReasonForIssuance>
    <ElectronicMiscDocType code="2">FLIGHT_COUPON_ASSOCIATED</ElectronicMiscDocType>
    <BookingMethod code="BLANK">ANY_ALLOWED</BookingMethod>
  </ns38:AncillaryDefinition>
  <ns38:AncillaryDefinition id="ancillary_9">
    <SubCode>DAJ</SubCode>
    <Airline>EY</Airline>
    <CommercialName>DYNAMIC AUCTION Y TO J</CommercialName>
    <Vendor>MMGR</Vendor>
    <Group>IE</Group>
    <GroupDescription>IN-FLIGHT ENTERTAINMENT</GroupDescription>
    <ReasonForIssuance code="G">IN_FLIGHT_SERVICES</ReasonForIssuance>
    <ElectronicMiscDocType code="2">FLIGHT_COUPON_ASSOCIATED</ElectronicMiscDocType>
    <BookingMethod code="BLANK">ANY_ALLOWED</BookingMethod>
  </ns38:AncillaryDefinition>
  <ns38:AncillaryDefinition id="ancillary_10">
    <SubCode>IUC</SubCode>
    <Airline>EY</Airline>
    <CommercialName>INSTANT AIRPORT UPGRADE Y TO C</CommercialName>
    <Vendor>MMGR</Vendor>
    <Group>IE</Group>
    <GroupDescription>IN-FLIGHT ENTERTAINMENT</GroupDescription>
    <ReasonForIssuance code="I">INDIVIDUAL_AIRLINE_USE</ReasonForIssuance>
    <ElectronicMiscDocType code="2">FLIGHT_COUPON_ASSOCIATED</ElectronicMiscDocType>
    <BookingMethod code="BLANK">ANY_ALLOWED</BookingMethod>
  </ns38:AncillaryDefinition>
  <ns38:AncillaryDefinition id="ancillary_11">
    <SubCode>NFS</SubCode>
    <Airline>EY</Airline>
    <CommercialName>NEIGHBOR FREE SEAT</CommercialName>
    <Vendor>MMGR</Vendor>
    <Group>IE</Group>
    <GroupDescription>IN-FLIGHT ENTERTAINMENT</GroupDescription>
    <ReasonForIssuance code="G">IN_FLIGHT_SERVICES</ReasonForIssuance>
    <ElectronicMiscDocType code="2">FLIGHT_COUPON_ASSOCIATED</ElectronicMiscDocType>
    <BookingMethod code="BLANK">ANY_ALLOWED</BookingMethod>
  </ns38:AncillaryDefinition>
  <ns38:AncillaryDefinition id="ancillary_12">
    <SubCode>PCS</SubCode>
    <Airline>EY</Airline>
    <CommercialName>PAID CHAUFFER SERVICE</CommercialName>
    <Vendor>MMGR</Vendor>
    <Group>IE</Group>
    <GroupDescription>IN-FLIGHT ENTERTAINMENT</GroupDescription>
    <ReasonForIssuance code="B">GROUND_TRANSPORT_NON_AIR_SERVICES</ReasonForIssuance>
    <ElectronicMiscDocType code="2">FLIGHT_COUPON_ASSOCIATED</ElectronicMiscDocType>
    <BookingMethod code="BLANK">ANY_ALLOWED</BookingMethod>
  </ns38:AncillaryDefinition>
  <ns38:AncillaryDefinition id="ancillary_13">
    <SubCode>PLS</SubCode>
    <Airline>EY</Airline>
    <CommercialName>PLUS GRADE Y TO J</CommercialName>
    <Vendor>MMGR</Vendor>
    <Group>IE</Group>
    <GroupDescription>IN-FLIGHT ENTERTAINMENT</GroupDescription>
    <ReasonForIssuance code="G">IN_FLIGHT_SERVICES</ReasonForIssuance>
    <ElectronicMiscDocType code="2">FLIGHT_COUPON_ASSOCIATED</ElectronicMiscDocType>
    <BookingMethod code="BLANK">ANY_ALLOWED</BookingMethod>
  </ns38:AncillaryDefinition>
  <ns38:AncillaryDefinition id="ancillary_14">
    <SubCode>PUC</SubCode>
    <Airline>EY</Airline>
    <CommercialName>PUSH UPGRADE Y TO C</CommercialName>
    <Vendor>MMGR</Vendor>
    <Group>IE</Group>
    <GroupDescription>IN-FLIGHT ENTERTAINMENT</GroupDescription>
    <ReasonForIssuance code="G">IN_FLIGHT_SERVICES</ReasonForIssuance>
    <ElectronicMiscDocType code="2">FLIGHT_COUPON_ASSOCIATED</ElectronicMiscDocType>
    <BookingMethod code="BLANK">ANY_ALLOWED</BookingMethod>
  </ns38:AncillaryDefinition>
  <ns38:AncillaryDefinition id="ancillary_15">
    <SubCode>SCS</SubCode>
    <Airline>EY</Airline>
    <CommercialName>SPECIAL CATERING 1380</CommercialName>
    <Vendor>MMGR</Vendor>
    <Group>IE</Group>
    <GroupDescription>IN-FLIGHT ENTERTAINMENT</GroupDescription>
    <ReasonForIssuance code="G">IN_FLIGHT_SERVICES</ReasonForIssuance>
    <ElectronicMiscDocType code="2">FLIGHT_COUPON_ASSOCIATED</ElectronicMiscDocType>
    <BookingMethod code="BLANK">ANY_ALLOWED</BookingMethod>
  </ns38:AncillaryDefinition>
  <ns38:AncillaryDefinition id="ancillary_17">
    <SubCode>HDC</SubCode>
    <Airline>EY</Airline>
    <CommercialName>HUB DISRUPTION COST</CommercialName>
    <Vendor>MMGR</Vendor>
    <Group>IE</Group>
    <GroupDescription>IN-FLIGHT ENTERTAINMENT</GroupDescription>
    <ReasonForIssuance code="G">IN_FLIGHT_SERVICES</ReasonForIssuance>
    <ElectronicMiscDocType code="2">FLIGHT_COUPON_ASSOCIATED</ElectronicMiscDocType>
    <BookingMethod code="BLANK">ANY_ALLOWED</BookingMethod>
  </ns38:AncillaryDefinition>
  <ns38:AncillaryDefinition id="ancillary_19">
    <SubCode>MRS</SubCode>
    <Airline>EY</Airline>
    <CommercialName>MEET AND GREET</CommercialName>
    <Vendor>MMGR</Vendor>
    <Group>IE</Group>
    <GroupDescription>IN-FLIGHT ENTERTAINMENT</GroupDescription>
    <ReasonForIssuance code="I">INDIVIDUAL_AIRLINE_USE</ReasonForIssuance>
    <ElectronicMiscDocType code="2">FLIGHT_COUPON_ASSOCIATED</ElectronicMiscDocType>
    <BookingMethod code="BLANK">ANY_ALLOWED</BookingMethod>
  </ns38:AncillaryDefinition>
  <ns38:AncillaryDefinition id="ancillary_25">
    <SubCode>0B4</SubCode>
    <Airline>EY</Airline>
    <CommercialName>OXYGEN</CommercialName>
    <Vendor>MMGR</Vendor>
    <Group>MD</Group>
    <GroupDescription>MEDICAL</GroupDescription>
    <SubGroup>OX</SubGroup>
    <SubGroupDescription>OXYGEN</SubGroupDescription>
    <ReasonForIssuance code="E">AIRPORT_SERVICES</ReasonForIssuance>
    <ElectronicMiscDocType code="2">FLIGHT_COUPON_ASSOCIATED</ElectronicMiscDocType>
    <BookingMethod code="BLANK">ANY_ALLOWED</BookingMethod>
  </ns38:AncillaryDefinition>
  <ns38:AncillaryDefinition id="ancillary_27">
    <SubCode>01F</SubCode>
    <Airline>EY</Airline>
    <CommercialName>JAPANESE MEAL</CommercialName>
    <Vendor>MMGR</Vendor>
    <Group>ML</Group>
    <GroupDescription>MEAL/BEVERAGE</GroupDescription>
    <ReasonForIssuance code="G">IN_FLIGHT_SERVICES</ReasonForIssuance>
    <ElectronicMiscDocType code="2">FLIGHT_COUPON_ASSOCIATED</ElectronicMiscDocType>
    <BookingMethod code="BLANK">ANY_ALLOWED</BookingMethod>
  </ns38:AncillaryDefinition>
  <ns38:AncillaryDefinition id="ancillary_28">
    <SubCode>0AM</SubCode>
    <Airline>EY</Airline>
    <CommercialName>HOT DINNER</CommercialName>
    <Vendor>MMGR</Vendor>
    <Group>ML</Group>
    <GroupDescription>MEAL/BEVERAGE</GroupDescription>
    <SubGroup>DI</SubGroup>
    <SubGroupDescription>DINNER</SubGroupDescription>
    <ReasonForIssuance code="G">IN_FLIGHT_SERVICES</ReasonForIssuance>
    <ElectronicMiscDocType code="2">FLIGHT_COUPON_ASSOCIATED</ElectronicMiscDocType>
    <BookingMethod code="BLANK">ANY_ALLOWED</BookingMethod>
  </ns38:AncillaryDefinition>
  <ns38:AncillaryDefinition id="ancillary_29">
    <SubCode>01I</SubCode>
    <Airline>EY</Airline>
    <CommercialName>KOREAN MEAL</CommercialName>
    <Vendor>MMGR</Vendor>
    <Group>ML</Group>
    <GroupDescription>MEAL/BEVERAGE</GroupDescription>
    <ReasonForIssuance code="G">IN_FLIGHT_SERVICES</ReasonForIssuance>
    <ElectronicMiscDocType code="2">FLIGHT_COUPON_ASSOCIATED</ElectronicMiscDocType>
    <BookingMethod code="BLANK">ANY_ALLOWED</BookingMethod>
  </ns38:AncillaryDefinition>
  <ns38:AncillaryDefinition id="ancillary_31">
    <SubCode>FAL</SubCode>
    <Airline>EY</Airline>
    <CommercialName>FALCON</CommercialName>
    <Vendor>MMGR</Vendor>
    <Group>PT</Group>
    <GroupDescription>PETS</GroupDescription>
    <ReasonForIssuance code="I">INDIVIDUAL_AIRLINE_USE</ReasonForIssuance>
    <ElectronicMiscDocType code="2">FLIGHT_COUPON_ASSOCIATED</ElectronicMiscDocType>
    <BookingMethod code="BLANK">ANY_ALLOWED</BookingMethod>
  </ns38:AncillaryDefinition>
  <ns38:AncillaryDefinition id="ancillary_33">
    <SubCode>0B5</SubCode>
    <Airline>EY</Airline>
    <CommercialName>PRE RESERVED SEAT ASSIGNMENT</CommercialName>
    <Vendor>ATP</Vendor>
    <Group>SA</Group>
    <GroupDescription>SEAT ASSIGNMENT</GroupDescription>
    <SpecialService>SEAT</SpecialService>
    <ReasonForIssuance code="A">AIR_TRANSPORTATION</ReasonForIssuance>
    <SpecialServiceDetails type="NOTALLOWED"/>
    <ElectronicMiscDocType code="2">FLIGHT_COUPON_ASSOCIATED</ElectronicMiscDocType>
    <BookingMethod code="01">SPECIAL_SERVICE_REQUEST</BookingMethod>
  </ns38:AncillaryDefinition>
  <ns38:AncillaryDefinition id="ancillary_50">
    <SubCode>BHS</SubCode>
    <Airline>EY</Airline>
    <CommercialName>BULKHEAD SEAT SALE</CommercialName>
    <Vendor>MMGR</Vendor>
    <Group>SA</Group>
    <GroupDescription>SEAT ASSIGNMENT</GroupDescription>
    <ReasonForIssuance code="A">AIR_TRANSPORTATION</ReasonForIssuance>
    <ElectronicMiscDocType code="2">FLIGHT_COUPON_ASSOCIATED</ElectronicMiscDocType>
    <BookingMethod code="BLANK">ANY_ALLOWED</BookingMethod>
  </ns38:AncillaryDefinition>
  <ns38:AncillaryDefinition id="ancillary_69">
    <SubCode>0BV</SubCode>
    <Airline>EY</Airline>
    <CommercialName>STANDBY</CommercialName>
    <Vendor>MMGR</Vendor>
    <Group>SB</Group>
    <GroupDescription>STANDBY</GroupDescription>
    <ReasonForIssuance code="B">GROUND_TRANSPORT_NON_AIR_SERVICES</ReasonForIssuance>
    <ElectronicMiscDocType code="2">FLIGHT_COUPON_ASSOCIATED</ElectronicMiscDocType>
    <BookingMethod code="BLANK">ANY_ALLOWED</BookingMethod>
  </ns38:AncillaryDefinition>
  <ns38:AncillaryDefinition id="ancillary_70">
    <SubCode>0CP</SubCode>
    <Airline>EY</Airline>
    <CommercialName>STANDBY CONFIRMED</CommercialName>
    <Vendor>MMGR</Vendor>
    <Group>SB</Group>
    <GroupDescription>STANDBY</GroupDescription>
    <SubGroup>CF</SubGroup>
    <SubGroupDescription>CONFIRMED</SubGroupDescription>
    <ReasonForIssuance code="B">GROUND_TRANSPORT_NON_AIR_SERVICES</ReasonForIssuance>
    <ElectronicMiscDocType code="2">FLIGHT_COUPON_ASSOCIATED</ElectronicMiscDocType>
    <BookingMethod code="BLANK">ANY_ALLOWED</BookingMethod>
  </ns38:AncillaryDefinition>
  <ns38:AncillaryDefinition id="ancillary_73">
    <SubCode>03P</SubCode>
    <Airline>EY</Airline>
    <CommercialName>PRIORITY ACCESS</CommercialName>
    <Vendor>ATP</Vendor>
    <Group>TS</Group>
    <GroupDescription>TRAVEL SERVICES</GroupDescription>
    <SubGroup>PO</SubGroup>
    <SubGroupDescription>PRIORITY CHECK IN</SubGroupDescription>
    <SpecialService>ASVC</SpecialService>
    <ReasonForIssuance code="E">AIRPORT_SERVICES</ReasonForIssuance>
    <SpecialServiceDetails type="NOTALLOWED"/>
    <ElectronicMiscDocType code="2">FLIGHT_COUPON_ASSOCIATED</ElectronicMiscDocType>
    <BookingMethod code="01">SPECIAL_SERVICE_REQUEST</BookingMethod>
  </ns38:AncillaryDefinition>
  <ns38:AncillaryDefinition id="ancillary_74">
    <SubCode>0BG</SubCode>
    <Airline>EY</Airline>
    <CommercialName>TRIP INSURANCE</CommercialName>
    <Vendor>MMGR</Vendor>
    <Group>TS</Group>
    <GroupDescription>TRAVEL SERVICES</GroupDescription>
    <SubGroup>TI</SubGroup>
    <SubGroupDescription>TRIP INSURANCE</SubGroupDescription>
    <ReasonForIssuance code="D">FINANCIAL_IMPACT</ReasonForIssuance>
    <ElectronicMiscDocType code="2">FLIGHT_COUPON_ASSOCIATED</ElectronicMiscDocType>
    <BookingMethod code="BLANK">ANY_ALLOWED</BookingMethod>
  </ns38:AncillaryDefinition>
  <ns38:AncillaryDefinition id="ancillary_77">
    <SubCode>AUP</SubCode>
    <Airline>EY</Airline>
    <CommercialName>AIRPORT UPGRADE PROMO RATE</CommercialName>
    <Vendor>MMGR</Vendor>
    <Group>UP</Group>
    <GroupDescription>UPGRADES</GroupDescription>
    <ReasonForIssuance code="A">AIR_TRANSPORTATION</ReasonForIssuance>
    <ElectronicMiscDocType code="2">FLIGHT_COUPON_ASSOCIATED</ElectronicMiscDocType>
    <BookingMethod code="BLANK">ANY_ALLOWED</BookingMethod>
  </ns38:AncillaryDefinition>
  <ns38:AncillaryDefinition id="ancillary_79">
    <SubCode>0C1</SubCode>
    <Airline>EY</Airline>
    <CommercialName>UPTO33LB 15KG BAGGAGE</CommercialName>
    <Vendor>ATP</Vendor>
    <Description1>
      <Description1Code>15</Description1Code>
      <Description1Text>UP TO 33 POUNDS/15 KILOGRAMS</Description1Text>
    </Description1>
    <Group>BG</Group>
    <GroupDescription>BAGGAGE</GroupDescription>
    <BaggageWeightLimit>
      <Weight unit="KILO">15</Weight>
      <LimitType>U</LimitType>
    </BaggageWeightLimit>
    <BaggageWeightLimit>
      <Weight unit="POUND">33</Weight>
      <LimitType>U</LimitType>
    </BaggageWeightLimit>
    <SpecialService>ASVC</SpecialService>
    <ReasonForIssuance code="C">BAGGAGE</ReasonForIssuance>
    <SpecialServiceDetails type="NOTALLOWED"/>
    <ElectronicMiscDocType code="2">FLIGHT_COUPON_ASSOCIATED</ElectronicMiscDocType>
    <BookingMethod code="01">SPECIAL_SERVICE_REQUEST</BookingMethod>
  </ns38:AncillaryDefinition>
  <ns38:AncillaryDefinition id="ancillary_81">
    <SubCode>0C2</SubCode>
    <Airline>EY</Airline>
    <CommercialName>UPTO44LB 20KG BAGGAGE</CommercialName>
    <Vendor>ATP</Vendor>
    <Description1>
      <Description1Code>20</Description1Code>
      <Description1Text>UP TO 44 POUNDS/20 KILOGRAMS</Description1Text>
    </Description1>
    <Group>BG</Group>
    <GroupDescription>BAGGAGE</GroupDescription>
    <BaggageWeightLimit>
      <Weight unit="KILO">20</Weight>
      <LimitType>U</LimitType>
    </BaggageWeightLimit>
    <BaggageWeightLimit>
      <Weight unit="POUND">44</Weight>
      <LimitType>U</LimitType>
    </BaggageWeightLimit>
    <SpecialService>ASVC</SpecialService>
    <ReasonForIssuance code="C">BAGGAGE</ReasonForIssuance>
    <SpecialServiceDetails type="NOTALLOWED"/>
    <ElectronicMiscDocType code="2">FLIGHT_COUPON_ASSOCIATED</ElectronicMiscDocType>
    <BookingMethod code="01">SPECIAL_SERVICE_REQUEST</BookingMethod>
  </ns38:AncillaryDefinition>
  <ns38:AncillaryDefinition id="ancillary_83">
    <SubCode>0C4</SubCode>
    <Airline>EY</Airline>
    <CommercialName>UPTO55LB 25KG BAGGAGE</CommercialName>
    <Vendor>ATP</Vendor>
    <Description1>
      <Description1Code>25</Description1Code>
      <Description1Text>UP TO 55 POUNDS/25 KILOGRAMS</Description1Text>
    </Description1>
    <Group>BG</Group>
    <GroupDescription>BAGGAGE</GroupDescription>
    <BaggageWeightLimit>
      <Weight unit="KILO">25</Weight>
      <LimitType>U</LimitType>
    </BaggageWeightLimit>
    <BaggageWeightLimit>
      <Weight unit="POUND">55</Weight>
      <LimitType>U</LimitType>
    </BaggageWeightLimit>
    <SpecialService>ASVC</SpecialService>
    <ReasonForIssuance code="C">BAGGAGE</ReasonForIssuance>
    <SpecialServiceDetails type="NOTALLOWED"/>
    <ElectronicMiscDocType code="2">FLIGHT_COUPON_ASSOCIATED</ElectronicMiscDocType>
    <BookingMethod code="01">SPECIAL_SERVICE_REQUEST</BookingMethod>
  </ns38:AncillaryDefinition>
  <ns38:AncillaryDefinition id="ancillary_85">
    <SubCode>0C5</SubCode>
    <Airline>EY</Airline>
    <CommercialName>UPTO66LB 30KG BAGGAGE</CommercialName>
    <Vendor>ATP</Vendor>
    <Description1>
      <Description1Code>30</Description1Code>
      <Description1Text>UP TO 66 POUNDS/30 KILOGRAMS</Description1Text>
    </Description1>
    <Group>BG</Group>
    <GroupDescription>BAGGAGE</GroupDescription>
    <BaggageWeightLimit>
      <Weight unit="KILO">30</Weight>
      <LimitType>U</LimitType>
    </BaggageWeightLimit>
    <BaggageWeightLimit>
      <Weight unit="POUND">66</Weight>
      <LimitType>U</LimitType>
    </BaggageWeightLimit>
    <SpecialService>ASVC</SpecialService>
    <ReasonForIssuance code="C">BAGGAGE</ReasonForIssuance>
    <SpecialServiceDetails type="NOTALLOWED"/>
    <ElectronicMiscDocType code="2">FLIGHT_COUPON_ASSOCIATED</ElectronicMiscDocType>
    <BookingMethod code="01">SPECIAL_SERVICE_REQUEST</BookingMethod>
  </ns38:AncillaryDefinition>
  <ns38:AncillaryDefinition id="ancillary_87">
    <SubCode>0C7</SubCode>
    <Airline>EY</Airline>
    <CommercialName>UPTO35KG BAGGAGE</CommercialName>
    <Vendor>ATP</Vendor>
    <Description1>
      <Description1Code>35</Description1Code>
      <Description1Text>UP TO 77 POUNDS/35 KILOGRAMS</Description1Text>
    </Description1>
    <Group>BG</Group>
    <GroupDescription>BAGGAGE</GroupDescription>
    <BaggageWeightLimit>
      <Weight unit="KILO">35</Weight>
      <LimitType>U</LimitType>
    </BaggageWeightLimit>
    <BaggageWeightLimit>
      <Weight unit="POUND">77</Weight>
      <LimitType>U</LimitType>
    </BaggageWeightLimit>
    <SpecialService>ASVC</SpecialService>
    <ReasonForIssuance code="C">BAGGAGE</ReasonForIssuance>
    <SpecialServiceDetails type="NOTALLOWED"/>
    <ElectronicMiscDocType code="2">FLIGHT_COUPON_ASSOCIATED</ElectronicMiscDocType>
    <BookingMethod code="01">SPECIAL_SERVICE_REQUEST</BookingMethod>
  </ns38:AncillaryDefinition>
  <ns38:AncillaryDefinition id="ancillary_89">
    <SubCode>0CW</SubCode>
    <Airline>EY</Airline>
    <CommercialName>UPTO11LB 5KG BAGGAGE</CommercialName>
    <Vendor>ATP</Vendor>
    <Description1>
      <Description1Code>05</Description1Code>
      <Description1Text>UP TO 11 POUNDS/5 KILOGRAMS</Description1Text>
    </Description1>
    <Group>BG</Group>
    <GroupDescription>BAGGAGE</GroupDescription>
    <BaggageWeightLimit>
      <Weight unit="KILO">5</Weight>
      <LimitType>U</LimitType>
    </BaggageWeightLimit>
    <BaggageWeightLimit>
      <Weight unit="POUND">11</Weight>
      <LimitType>U</LimitType>
    </BaggageWeightLimit>
    <SpecialService>ASVC</SpecialService>
    <ReasonForIssuance code="C">BAGGAGE</ReasonForIssuance>
    <SpecialServiceDetails type="NOTALLOWED"/>
    <ElectronicMiscDocType code="2">FLIGHT_COUPON_ASSOCIATED</ElectronicMiscDocType>
    <BookingMethod code="01">SPECIAL_SERVICE_REQUEST</BookingMethod>
  </ns38:AncillaryDefinition>
  <ns38:AncillaryDefinition id="ancillary_91">
    <SubCode>0CZ</SubCode>
    <Airline>EY</Airline>
    <CommercialName>UPTO22LB 10KG BAGGAGE</CommercialName>
    <Vendor>ATP</Vendor>
    <Description1>
      <Description1Code>10</Description1Code>
      <Description1Text>UP TO 22 POUNDS/10 KILOGRAMS</Description1Text>
    </Description1>
    <Group>BG</Group>
    <GroupDescription>BAGGAGE</GroupDescription>
    <BaggageWeightLimit>
      <Weight unit="KILO">10</Weight>
      <LimitType>U</LimitType>
    </BaggageWeightLimit>
    <BaggageWeightLimit>
      <Weight unit="POUND">22</Weight>
      <LimitType>U</LimitType>
    </BaggageWeightLimit>
    <SpecialService>ASVC</SpecialService>
    <ReasonForIssuance code="C">BAGGAGE</ReasonForIssuance>
    <SpecialServiceDetails type="NOTALLOWED"/>
    <ElectronicMiscDocType code="2">FLIGHT_COUPON_ASSOCIATED</ElectronicMiscDocType>
    <BookingMethod code="01">SPECIAL_SERVICE_REQUEST</BookingMethod>
  </ns38:AncillaryDefinition>
  <ns38:AncillaryDefinition id="ancillary_94">
    <SubCode>0DG</SubCode>
    <Airline>EY</Airline>
    <CommercialName>WEIGHT SYSTEM CHARGE</CommercialName>
    <Vendor>ATP</Vendor>
    <Description1>
      <Description1Code>WT</Description1Code>
      <Description1Text>WEIGHT SYSTEM CHARGE</Description1Text>
    </Description1>
    <Group>BG</Group>
    <GroupDescription>BAGGAGE</GroupDescription>
    <SubGroup>XS</SubGroup>
    <SubGroupDescription>BAGGAGE EXCESS</SubGroupDescription>
    <SpecialService>ASVC</SpecialService>
    <ReasonForIssuance code="C">BAGGAGE</ReasonForIssuance>
    <SpecialServiceDetails type="NOTALLOWED"/>
    <ElectronicMiscDocType code="2">FLIGHT_COUPON_ASSOCIATED</ElectronicMiscDocType>
    <BookingMethod code="01">SPECIAL_SERVICE_REQUEST</BookingMethod>
  </ns38:AncillaryDefinition>
  <ns38:AncillaryDefinition id="ancillary_1">
    <SubCode>BU1</SubCode>
    <Airline>EY</Airline>
    <CommercialName>Bundle Bag and Seat EY DOM</CommercialName>
    <Vendor>MMGR</Vendor>
    <Group>BD</Group>
    <GroupDescription>BUNDLED SERVICES</GroupDescription>
    <ReasonForIssuance code="E">AIRPORT_SERVICES</ReasonForIssuance>
    <ElectronicMiscDocType code="2">FLIGHT_COUPON_ASSOCIATED</ElectronicMiscDocType>
    <BookingMethod code="BLANK">ANY_ALLOWED</BookingMethod>
    <ConsumedAtIssuanceIndicator>false</ConsumedAtIssuanceIndicator>
  </ns38:AncillaryDefinition>
  <ns38:AncillaryDefinition id="ancillary_301">
    <SubCode>0B0</SubCode>
    <Airline>EY</Airline>
    <CommercialName>UNACCOMPANIED MINOR FEE INTL</CommercialName>
    <Vendor>MMGR</Vendor>
    <Group>UN</Group>
    <GroupDescription>UNACCOMPANIED TRAVEL ESCORT</GroupDescription>
    <SubGroup>MR</SubGroup>
    <SubGroupDescription>UNACCOMPANIED MINOR</SubGroupDescription>
    <ReasonForIssuance code="E">AIRPORT_SERVICES</ReasonForIssuance>
    <ElectronicMiscDocType code="2">FLIGHT_COUPON_ASSOCIATED</ElectronicMiscDocType>
    <BookingMethod code="BLANK">ANY_ALLOWED</BookingMethod>
  </ns38:AncillaryDefinition>
  <ns38:Ancillary ancillaryDefinitionRef="ancillary_5" ancillaryId="ancillary_ancillary_5">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>2000</SequenceNumber>
    <TravelDateEffective>2013-08-01</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>PAYMENT_REQUIRED</AirExtraStatus>
    <Footnote>X</Footnote>
  </ns38:Ancillary>
  <ns38:Ancillary ancillaryDefinitionRef="ancillary_6" ancillaryId="ancillary_ancillary_6">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>1000</SequenceNumber>
    <TravelDateEffective>2014-12-05</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>PAYMENT_REQUIRED</AirExtraStatus>
    <Footnote>N</Footnote>
  </ns38:Ancillary>
  <ns38:Ancillary ancillaryDefinitionRef="ancillary_9" ancillaryId="ancillary_ancillary_9">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>1000</SequenceNumber>
    <TravelDateEffective>2018-02-20</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>CONFIRMED</AirExtraStatus>
    <Footnote/>
  </ns38:Ancillary>
  <ns38:Ancillary ancillaryDefinitionRef="ancillary_10" ancillaryId="ancillary_ancillary_10">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>42000</SequenceNumber>
    <TravelDateEffective>2013-06-13</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>PAYMENT_REQUIRED</AirExtraStatus>
    <Footnote>N</Footnote>
  </ns38:Ancillary>
  <ns38:Ancillary ancillaryDefinitionRef="ancillary_11" ancillaryId="ancillary_ancillary_11">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>2000</SequenceNumber>
    <TravelDateEffective>2017-02-22</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>CONFIRMED</AirExtraStatus>
    <Footnote/>
  </ns38:Ancillary>
  <ns38:Ancillary ancillaryDefinitionRef="ancillary_12" ancillaryId="ancillary_ancillary_12">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>1000</SequenceNumber>
    <TravelDateEffective>2018-12-05</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>PAYMENT_REQUIRED</AirExtraStatus>
    <Footnote>N</Footnote>
  </ns38:Ancillary>
  <ns38:Ancillary ancillaryDefinitionRef="ancillary_13" ancillaryId="ancillary_ancillary_13">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>1000</SequenceNumber>
    <TravelDateEffective>2018-11-25</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>CONFIRMED</AirExtraStatus>
    <Footnote>N</Footnote>
  </ns38:Ancillary>
  <ns38:Ancillary ancillaryDefinitionRef="ancillary_14" ancillaryId="ancillary_ancillary_14">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>62000</SequenceNumber>
    <TravelDateEffective>2013-02-28</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>PAYMENT_REQUIRED</AirExtraStatus>
    <Footnote>N</Footnote>
  </ns38:Ancillary>
  <ns38:Ancillary ancillaryDefinitionRef="ancillary_15" ancillaryId="ancillary_ancillary_15">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>1000</SequenceNumber>
    <TravelDateEffective>2014-09-03</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>NO_AE</AirExtraStatus>
    <Footnote>*</Footnote>
  </ns38:Ancillary>
  <ns38:Ancillary ancillaryDefinitionRef="ancillary_17" ancillaryId="ancillary_ancillary_17">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>37000</SequenceNumber>
    <TravelDateEffective>2018-09-27</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>PAYMENT_REQUIRED</AirExtraStatus>
    <Footnote>N</Footnote>
  </ns38:Ancillary>
  <ns38:Ancillary ancillaryDefinitionRef="ancillary_10" ancillaryId="ancillary_ancillary_18">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>82000</SequenceNumber>
    <TravelDateEffective>2013-03-19</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>PAYMENT_REQUIRED</AirExtraStatus>
    <Footnote>N</Footnote>
  </ns38:Ancillary>
  <ns38:Ancillary ancillaryDefinitionRef="ancillary_19" ancillaryId="ancillary_ancillary_19">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>1000</SequenceNumber>
    <TravelDateEffective>2018-10-24</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>PAYMENT_REQUIRED</AirExtraStatus>
    <Footnote>/</Footnote>
  </ns38:Ancillary>
  <ns38:Ancillary ancillaryDefinitionRef="ancillary_25" ancillaryId="ancillary_ancillary_25">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>1000</SequenceNumber>
    <TravelDateEffective>2016-06-06</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>PAYMENT_REQUIRED</AirExtraStatus>
    <Footnote>X</Footnote>
  </ns38:Ancillary>
  <ns38:Ancillary ancillaryDefinitionRef="ancillary_27" ancillaryId="ancillary_ancillary_27">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>1000</SequenceNumber>
    <TravelDateEffective>2013-08-14</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>PAYMENT_REQUIRED</AirExtraStatus>
    <Footnote/>
  </ns38:Ancillary>
  <ns38:Ancillary ancillaryDefinitionRef="ancillary_28" ancillaryId="ancillary_ancillary_28">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>1000</SequenceNumber>
    <TravelDateEffective>2016-02-09</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>PAYMENT_REQUIRED</AirExtraStatus>
    <Footnote>/</Footnote>
  </ns38:Ancillary>
  <ns38:Ancillary ancillaryDefinitionRef="ancillary_29" ancillaryId="ancillary_ancillary_29">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>1000</SequenceNumber>
    <TravelDateEffective>2013-08-14</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>PAYMENT_REQUIRED</AirExtraStatus>
    <Footnote>-</Footnote>
  </ns38:Ancillary>
  <ns38:Ancillary ancillaryDefinitionRef="ancillary_31" ancillaryId="ancillary_ancillary_31">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>P</SectorPortionInd>
    <SequenceNumber>5000</SequenceNumber>
    <TravelDateEffective>2017-06-20</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>PAYMENT_REQUIRED</AirExtraStatus>
    <Footnote>X</Footnote>
  </ns38:Ancillary>
  <ns38:Ancillary ancillaryDefinitionRef="ancillary_33" ancillaryId="ancillary_ancillary_33">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>293130</SequenceNumber>
    <TravelDateEffective>1980-01-01</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>PAYMENT_REQUIRED</AirExtraStatus>
    <PADIS_SeatProcessing>
      <PADIS_CodeTableInfo>
        <Characteristic>
          <Code>CH</Code>
          <TranslatedName>CHARGEABLE</TranslatedName>
          <AbbreviatedName>PAID</AbbreviatedName>
        </Characteristic>
        <Characteristic>
          <Code>E</Code>
          <TranslatedName>EXIT</TranslatedName>
          <AbbreviatedName>EXIT</AbbreviatedName>
        </Characteristic>
      </PADIS_CodeTableInfo>
    </PADIS_SeatProcessing>
    <Footnote>@</Footnote>
  </ns38:Ancillary>
  <ns38:Ancillary ancillaryDefinitionRef="ancillary_33" ancillaryId="ancillary_ancillary_34">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>331630</SequenceNumber>
    <TravelDateEffective>1980-01-01</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>PAYMENT_REQUIRED</AirExtraStatus>
    <PADIS_SeatProcessing>
      <PADIS_CodeTableInfo>
        <Characteristic>
          <Code>CH</Code>
          <TranslatedName>CHARGEABLE</TranslatedName>
          <AbbreviatedName>PAID</AbbreviatedName>
        </Characteristic>
        <Characteristic>
          <Code>L</Code>
          <TranslatedName>LEG SPACE</TranslatedName>
          <AbbreviatedName>LEGSP</AbbreviatedName>
        </Characteristic>
      </PADIS_CodeTableInfo>
    </PADIS_SeatProcessing>
    <Footnote>@</Footnote>
  </ns38:Ancillary>
  <ns38:Ancillary ancillaryDefinitionRef="ancillary_33" ancillaryId="ancillary_ancillary_35">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>546130</SequenceNumber>
    <TravelDateEffective>1980-01-01</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>PAYMENT_REQUIRED</AirExtraStatus>
    <PADIS_SeatProcessing>
      <PADIS_CodeTableInfo>
        <Characteristic>
          <Code>CH</Code>
          <TranslatedName>CHARGEABLE</TranslatedName>
          <AbbreviatedName>PAID</AbbreviatedName>
        </Characteristic>
        <Characteristic>
          <Code>O</Code>
          <TranslatedName>PREFERRED</TranslatedName>
          <AbbreviatedName>PRFST</AbbreviatedName>
        </Characteristic>
      </PADIS_CodeTableInfo>
    </PADIS_SeatProcessing>
    <Footnote>@</Footnote>
  </ns38:Ancillary>
  <ns38:Ancillary ancillaryDefinitionRef="ancillary_33" ancillaryId="ancillary_ancillary_36">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>570630</SequenceNumber>
    <TravelDateEffective>1980-01-01</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>CONFIRMED</AirExtraStatus>
    <PADIS_SeatProcessing>
      <PADIS_CodeTableInfo>
        <Characteristic>
          <Code>CH</Code>
          <TranslatedName>CHARGEABLE</TranslatedName>
          <AbbreviatedName>PAID</AbbreviatedName>
        </Characteristic>
        <Characteristic>
          <Code>W</Code>
          <TranslatedName>WINDOW</TranslatedName>
          <AbbreviatedName>WIND</AbbreviatedName>
        </Characteristic>
      </PADIS_CodeTableInfo>
    </PADIS_SeatProcessing>
    <Footnote>@</Footnote>
  </ns38:Ancillary>
  <ns38:Ancillary ancillaryDefinitionRef="ancillary_33" ancillaryId="ancillary_ancillary_37">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>571130</SequenceNumber>
    <TravelDateEffective>1980-01-01</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>CONFIRMED</AirExtraStatus>
    <PADIS_SeatProcessing>
      <PADIS_CodeTableInfo>
        <Characteristic>
          <Code>CH</Code>
          <TranslatedName>CHARGEABLE</TranslatedName>
          <AbbreviatedName>PAID</AbbreviatedName>
        </Characteristic>
        <Characteristic>
          <Code>W</Code>
          <TranslatedName>WINDOW</TranslatedName>
          <AbbreviatedName>WIND</AbbreviatedName>
        </Characteristic>
      </PADIS_CodeTableInfo>
    </PADIS_SeatProcessing>
    <Footnote>@</Footnote>
  </ns38:Ancillary>
  <ns38:Ancillary ancillaryDefinitionRef="ancillary_33" ancillaryId="ancillary_ancillary_38">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>572630</SequenceNumber>
    <TravelDateEffective>1980-01-01</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>CONFIRMED</AirExtraStatus>
    <PADIS_SeatProcessing>
      <PADIS_CodeTableInfo>
        <Characteristic>
          <Code>A</Code>
          <TranslatedName>AISLE</TranslatedName>
          <AbbreviatedName>AISLE</AbbreviatedName>
        </Characteristic>
        <Characteristic>
          <Code>CH</Code>
          <TranslatedName>CHARGEABLE</TranslatedName>
          <AbbreviatedName>PAID</AbbreviatedName>
        </Characteristic>
      </PADIS_CodeTableInfo>
    </PADIS_SeatProcessing>
    <Footnote>@</Footnote>
  </ns38:Ancillary>
  <ns38:Ancillary ancillaryDefinitionRef="ancillary_33" ancillaryId="ancillary_ancillary_39">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>573130</SequenceNumber>
    <TravelDateEffective>1980-01-01</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>CONFIRMED</AirExtraStatus>
    <PADIS_SeatProcessing>
      <PADIS_CodeTableInfo>
        <Characteristic>
          <Code>A</Code>
          <TranslatedName>AISLE</TranslatedName>
          <AbbreviatedName>AISLE</AbbreviatedName>
        </Characteristic>
        <Characteristic>
          <Code>CH</Code>
          <TranslatedName>CHARGEABLE</TranslatedName>
          <AbbreviatedName>PAID</AbbreviatedName>
        </Characteristic>
      </PADIS_CodeTableInfo>
    </PADIS_SeatProcessing>
    <Footnote>@</Footnote>
  </ns38:Ancillary>
  <ns38:Ancillary ancillaryDefinitionRef="ancillary_33" ancillaryId="ancillary_ancillary_40">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>574630</SequenceNumber>
    <TravelDateEffective>1980-01-01</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>CONFIRMED</AirExtraStatus>
    <PADIS_SeatProcessing>
      <PADIS_CodeTableInfo>
        <Characteristic>
          <Code>CH</Code>
          <TranslatedName>CHARGEABLE</TranslatedName>
          <AbbreviatedName>PAID</AbbreviatedName>
        </Characteristic>
      </PADIS_CodeTableInfo>
    </PADIS_SeatProcessing>
    <Footnote>@</Footnote>
  </ns38:Ancillary>
  <ns38:Ancillary ancillaryDefinitionRef="ancillary_33" ancillaryId="ancillary_ancillary_41">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>575130</SequenceNumber>
    <TravelDateEffective>1980-01-01</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>CONFIRMED</AirExtraStatus>
    <PADIS_SeatProcessing>
      <PADIS_CodeTableInfo>
        <Characteristic>
          <Code>CH</Code>
          <TranslatedName>CHARGEABLE</TranslatedName>
          <AbbreviatedName>PAID</AbbreviatedName>
        </Characteristic>
      </PADIS_CodeTableInfo>
    </PADIS_SeatProcessing>
    <Footnote>@</Footnote>
  </ns38:Ancillary>
  <ns38:Ancillary ancillaryDefinitionRef="ancillary_33" ancillaryId="ancillary_ancillary_42">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>690380</SequenceNumber>
    <TravelDateEffective>1980-01-01</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>CONFIRMED</AirExtraStatus>
    <PADIS_SeatProcessing>
      <PADIS_CodeTableInfo>
        <Characteristic>
          <Code>CH</Code>
          <TranslatedName>CHARGEABLE</TranslatedName>
          <AbbreviatedName>PAID</AbbreviatedName>
        </Characteristic>
        <Characteristic>
          <Code>O</Code>
          <TranslatedName>PREFERRED</TranslatedName>
          <AbbreviatedName>PRFST</AbbreviatedName>
        </Characteristic>
      </PADIS_CodeTableInfo>
    </PADIS_SeatProcessing>
    <Footnote>@</Footnote>
  </ns38:Ancillary>
  <ns38:Ancillary ancillaryDefinitionRef="ancillary_33" ancillaryId="ancillary_ancillary_43">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>690880</SequenceNumber>
    <TravelDateEffective>1980-01-01</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>CONFIRMED</AirExtraStatus>
    <PADIS_SeatProcessing>
      <PADIS_CodeTableInfo>
        <Characteristic>
          <Code>CH</Code>
          <TranslatedName>CHARGEABLE</TranslatedName>
          <AbbreviatedName>PAID</AbbreviatedName>
        </Characteristic>
        <Characteristic>
          <Code>W</Code>
          <TranslatedName>WINDOW</TranslatedName>
          <AbbreviatedName>WIND</AbbreviatedName>
        </Characteristic>
      </PADIS_CodeTableInfo>
    </PADIS_SeatProcessing>
    <Footnote>@</Footnote>
  </ns38:Ancillary>
  <ns38:Ancillary ancillaryDefinitionRef="ancillary_33" ancillaryId="ancillary_ancillary_44">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>691380</SequenceNumber>
    <TravelDateEffective>1980-01-01</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>CONFIRMED</AirExtraStatus>
    <PADIS_SeatProcessing>
      <PADIS_CodeTableInfo>
        <Characteristic>
          <Code>A</Code>
          <TranslatedName>AISLE</TranslatedName>
          <AbbreviatedName>AISLE</AbbreviatedName>
        </Characteristic>
        <Characteristic>
          <Code>CH</Code>
          <TranslatedName>CHARGEABLE</TranslatedName>
          <AbbreviatedName>PAID</AbbreviatedName>
        </Characteristic>
      </PADIS_CodeTableInfo>
    </PADIS_SeatProcessing>
    <Footnote>@</Footnote>
  </ns38:Ancillary>
  <ns38:Ancillary ancillaryDefinitionRef="ancillary_33" ancillaryId="ancillary_ancillary_45">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>691880</SequenceNumber>
    <TravelDateEffective>1980-01-01</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>CONFIRMED</AirExtraStatus>
    <PADIS_SeatProcessing>
      <PADIS_CodeTableInfo>
        <Characteristic>
          <Code>CH</Code>
          <TranslatedName>CHARGEABLE</TranslatedName>
          <AbbreviatedName>PAID</AbbreviatedName>
        </Characteristic>
      </PADIS_CodeTableInfo>
    </PADIS_SeatProcessing>
    <Footnote>@</Footnote>
  </ns38:Ancillary>
  <ns38:Ancillary ancillaryDefinitionRef="ancillary_33" ancillaryId="ancillary_ancillary_46">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>692380</SequenceNumber>
    <TravelDateEffective>1980-01-01</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>CONFIRMED</AirExtraStatus>
    <PADIS_SeatProcessing>
      <PADIS_CodeTableInfo>
        <Characteristic>
          <Code>CH</Code>
          <TranslatedName>CHARGEABLE</TranslatedName>
          <AbbreviatedName>PAID</AbbreviatedName>
        </Characteristic>
        <Characteristic>
          <Code>O</Code>
          <TranslatedName>PREFERRED</TranslatedName>
          <AbbreviatedName>PRFST</AbbreviatedName>
        </Characteristic>
      </PADIS_CodeTableInfo>
    </PADIS_SeatProcessing>
    <Footnote>@</Footnote>
  </ns38:Ancillary>
  <ns38:Ancillary ancillaryDefinitionRef="ancillary_33" ancillaryId="ancillary_ancillary_47">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>692880</SequenceNumber>
    <TravelDateEffective>1980-01-01</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>CONFIRMED</AirExtraStatus>
    <PADIS_SeatProcessing>
      <PADIS_CodeTableInfo>
        <Characteristic>
          <Code>CH</Code>
          <TranslatedName>CHARGEABLE</TranslatedName>
          <AbbreviatedName>PAID</AbbreviatedName>
        </Characteristic>
        <Characteristic>
          <Code>W</Code>
          <TranslatedName>WINDOW</TranslatedName>
          <AbbreviatedName>WIND</AbbreviatedName>
        </Characteristic>
      </PADIS_CodeTableInfo>
    </PADIS_SeatProcessing>
    <Footnote>@</Footnote>
  </ns38:Ancillary>
  <ns38:Ancillary ancillaryDefinitionRef="ancillary_33" ancillaryId="ancillary_ancillary_48">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>693380</SequenceNumber>
    <TravelDateEffective>1980-01-01</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>CONFIRMED</AirExtraStatus>
    <PADIS_SeatProcessing>
      <PADIS_CodeTableInfo>
        <Characteristic>
          <Code>A</Code>
          <TranslatedName>AISLE</TranslatedName>
          <AbbreviatedName>AISLE</AbbreviatedName>
        </Characteristic>
        <Characteristic>
          <Code>CH</Code>
          <TranslatedName>CHARGEABLE</TranslatedName>
          <AbbreviatedName>PAID</AbbreviatedName>
        </Characteristic>
      </PADIS_CodeTableInfo>
    </PADIS_SeatProcessing>
    <Footnote>@</Footnote>
  </ns38:Ancillary>
  <ns38:Ancillary ancillaryDefinitionRef="ancillary_33" ancillaryId="ancillary_ancillary_49">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>693880</SequenceNumber>
    <TravelDateEffective>1980-01-01</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>CONFIRMED</AirExtraStatus>
    <PADIS_SeatProcessing>
      <PADIS_CodeTableInfo>
        <Characteristic>
          <Code>CH</Code>
          <TranslatedName>CHARGEABLE</TranslatedName>
          <AbbreviatedName>PAID</AbbreviatedName>
        </Characteristic>
      </PADIS_CodeTableInfo>
    </PADIS_SeatProcessing>
    <Footnote>@</Footnote>
  </ns38:Ancillary>
  <ns38:Ancillary ancillaryDefinitionRef="ancillary_50" ancillaryId="ancillary_ancillary_50">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>23000</SequenceNumber>
    <TravelDateEffective>2018-04-02</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>PAYMENT_REQUIRED</AirExtraStatus>
    <Footnote>@</Footnote>
  </ns38:Ancillary>
  <ns38:Ancillary ancillaryDefinitionRef="ancillary_33" ancillaryId="ancillary_ancillary_54">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>571630</SequenceNumber>
    <TravelDateEffective>1980-01-01</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>CONFIRMED</AirExtraStatus>
    <PADIS_SeatProcessing>
      <PADIS_CodeTableInfo>
        <Characteristic>
          <Code>CH</Code>
          <TranslatedName>CHARGEABLE</TranslatedName>
          <AbbreviatedName>PAID</AbbreviatedName>
        </Characteristic>
        <Characteristic>
          <Code>W</Code>
          <TranslatedName>WINDOW</TranslatedName>
          <AbbreviatedName>WIND</AbbreviatedName>
        </Characteristic>
      </PADIS_CodeTableInfo>
    </PADIS_SeatProcessing>
    <Footnote>@</Footnote>
  </ns38:Ancillary>
  <ns38:Ancillary ancillaryDefinitionRef="ancillary_33" ancillaryId="ancillary_ancillary_55">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>572130</SequenceNumber>
    <TravelDateEffective>1980-01-01</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>CONFIRMED</AirExtraStatus>
    <PADIS_SeatProcessing>
      <PADIS_CodeTableInfo>
        <Characteristic>
          <Code>CH</Code>
          <TranslatedName>CHARGEABLE</TranslatedName>
          <AbbreviatedName>PAID</AbbreviatedName>
        </Characteristic>
        <Characteristic>
          <Code>W</Code>
          <TranslatedName>WINDOW</TranslatedName>
          <AbbreviatedName>WIND</AbbreviatedName>
        </Characteristic>
      </PADIS_CodeTableInfo>
    </PADIS_SeatProcessing>
    <Footnote>@</Footnote>
  </ns38:Ancillary>
  <ns38:Ancillary ancillaryDefinitionRef="ancillary_33" ancillaryId="ancillary_ancillary_56">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>573630</SequenceNumber>
    <TravelDateEffective>1980-01-01</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>CONFIRMED</AirExtraStatus>
    <PADIS_SeatProcessing>
      <PADIS_CodeTableInfo>
        <Characteristic>
          <Code>A</Code>
          <TranslatedName>AISLE</TranslatedName>
          <AbbreviatedName>AISLE</AbbreviatedName>
        </Characteristic>
        <Characteristic>
          <Code>CH</Code>
          <TranslatedName>CHARGEABLE</TranslatedName>
          <AbbreviatedName>PAID</AbbreviatedName>
        </Characteristic>
      </PADIS_CodeTableInfo>
    </PADIS_SeatProcessing>
    <Footnote>@</Footnote>
  </ns38:Ancillary>
  <ns38:Ancillary ancillaryDefinitionRef="ancillary_33" ancillaryId="ancillary_ancillary_57">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>574130</SequenceNumber>
    <TravelDateEffective>1980-01-01</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>CONFIRMED</AirExtraStatus>
    <PADIS_SeatProcessing>
      <PADIS_CodeTableInfo>
        <Characteristic>
          <Code>A</Code>
          <TranslatedName>AISLE</TranslatedName>
          <AbbreviatedName>AISLE</AbbreviatedName>
        </Characteristic>
        <Characteristic>
          <Code>CH</Code>
          <TranslatedName>CHARGEABLE</TranslatedName>
          <AbbreviatedName>PAID</AbbreviatedName>
        </Characteristic>
      </PADIS_CodeTableInfo>
    </PADIS_SeatProcessing>
    <Footnote>@</Footnote>
  </ns38:Ancillary>
  <ns38:Ancillary ancillaryDefinitionRef="ancillary_33" ancillaryId="ancillary_ancillary_58">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>575630</SequenceNumber>
    <TravelDateEffective>1980-01-01</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>CONFIRMED</AirExtraStatus>
    <PADIS_SeatProcessing>
      <PADIS_CodeTableInfo>
        <Characteristic>
          <Code>CH</Code>
          <TranslatedName>CHARGEABLE</TranslatedName>
          <AbbreviatedName>PAID</AbbreviatedName>
        </Characteristic>
      </PADIS_CodeTableInfo>
    </PADIS_SeatProcessing>
    <Footnote>@</Footnote>
  </ns38:Ancillary>
  <ns38:Ancillary ancillaryDefinitionRef="ancillary_33" ancillaryId="ancillary_ancillary_59">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>576130</SequenceNumber>
    <TravelDateEffective>1980-01-01</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>CONFIRMED</AirExtraStatus>
    <PADIS_SeatProcessing>
      <PADIS_CodeTableInfo>
        <Characteristic>
          <Code>CH</Code>
          <TranslatedName>CHARGEABLE</TranslatedName>
          <AbbreviatedName>PAID</AbbreviatedName>
        </Characteristic>
      </PADIS_CodeTableInfo>
    </PADIS_SeatProcessing>
    <Footnote>@</Footnote>
  </ns38:Ancillary>
  <ns38:Ancillary ancillaryDefinitionRef="ancillary_33" ancillaryId="ancillary_ancillary_60">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>690630</SequenceNumber>
    <TravelDateEffective>1980-01-01</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>CONFIRMED</AirExtraStatus>
    <PADIS_SeatProcessing>
      <PADIS_CodeTableInfo>
        <Characteristic>
          <Code>CH</Code>
          <TranslatedName>CHARGEABLE</TranslatedName>
          <AbbreviatedName>PAID</AbbreviatedName>
        </Characteristic>
        <Characteristic>
          <Code>O</Code>
          <TranslatedName>PREFERRED</TranslatedName>
          <AbbreviatedName>PRFST</AbbreviatedName>
        </Characteristic>
      </PADIS_CodeTableInfo>
    </PADIS_SeatProcessing>
    <Footnote>@</Footnote>
  </ns38:Ancillary>
  <ns38:Ancillary ancillaryDefinitionRef="ancillary_33" ancillaryId="ancillary_ancillary_61">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>691130</SequenceNumber>
    <TravelDateEffective>1980-01-01</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>CONFIRMED</AirExtraStatus>
    <PADIS_SeatProcessing>
      <PADIS_CodeTableInfo>
        <Characteristic>
          <Code>CH</Code>
          <TranslatedName>CHARGEABLE</TranslatedName>
          <AbbreviatedName>PAID</AbbreviatedName>
        </Characteristic>
        <Characteristic>
          <Code>W</Code>
          <TranslatedName>WINDOW</TranslatedName>
          <AbbreviatedName>WIND</AbbreviatedName>
        </Characteristic>
      </PADIS_CodeTableInfo>
    </PADIS_SeatProcessing>
    <Footnote>@</Footnote>
  </ns38:Ancillary>
  <ns38:Ancillary ancillaryDefinitionRef="ancillary_33" ancillaryId="ancillary_ancillary_62">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>691630</SequenceNumber>
    <TravelDateEffective>1980-01-01</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>CONFIRMED</AirExtraStatus>
    <PADIS_SeatProcessing>
      <PADIS_CodeTableInfo>
        <Characteristic>
          <Code>A</Code>
          <TranslatedName>AISLE</TranslatedName>
          <AbbreviatedName>AISLE</AbbreviatedName>
        </Characteristic>
        <Characteristic>
          <Code>CH</Code>
          <TranslatedName>CHARGEABLE</TranslatedName>
          <AbbreviatedName>PAID</AbbreviatedName>
        </Characteristic>
      </PADIS_CodeTableInfo>
    </PADIS_SeatProcessing>
    <Footnote>@</Footnote>
  </ns38:Ancillary>
  <ns38:Ancillary ancillaryDefinitionRef="ancillary_33" ancillaryId="ancillary_ancillary_63">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>692130</SequenceNumber>
    <TravelDateEffective>1980-01-01</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>CONFIRMED</AirExtraStatus>
    <PADIS_SeatProcessing>
      <PADIS_CodeTableInfo>
        <Characteristic>
          <Code>CH</Code>
          <TranslatedName>CHARGEABLE</TranslatedName>
          <AbbreviatedName>PAID</AbbreviatedName>
        </Characteristic>
      </PADIS_CodeTableInfo>
    </PADIS_SeatProcessing>
    <Footnote>@</Footnote>
  </ns38:Ancillary>
  <ns38:Ancillary ancillaryDefinitionRef="ancillary_33" ancillaryId="ancillary_ancillary_64">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>692630</SequenceNumber>
    <TravelDateEffective>1980-01-01</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>CONFIRMED</AirExtraStatus>
    <PADIS_SeatProcessing>
      <PADIS_CodeTableInfo>
        <Characteristic>
          <Code>CH</Code>
          <TranslatedName>CHARGEABLE</TranslatedName>
          <AbbreviatedName>PAID</AbbreviatedName>
        </Characteristic>
        <Characteristic>
          <Code>O</Code>
          <TranslatedName>PREFERRED</TranslatedName>
          <AbbreviatedName>PRFST</AbbreviatedName>
        </Characteristic>
      </PADIS_CodeTableInfo>
    </PADIS_SeatProcessing>
    <Footnote>@</Footnote>
  </ns38:Ancillary>
  <ns38:Ancillary ancillaryDefinitionRef="ancillary_33" ancillaryId="ancillary_ancillary_65">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>693130</SequenceNumber>
    <TravelDateEffective>1980-01-01</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>CONFIRMED</AirExtraStatus>
    <PADIS_SeatProcessing>
      <PADIS_CodeTableInfo>
        <Characteristic>
          <Code>CH</Code>
          <TranslatedName>CHARGEABLE</TranslatedName>
          <AbbreviatedName>PAID</AbbreviatedName>
        </Characteristic>
        <Characteristic>
          <Code>W</Code>
          <TranslatedName>WINDOW</TranslatedName>
          <AbbreviatedName>WIND</AbbreviatedName>
        </Characteristic>
      </PADIS_CodeTableInfo>
    </PADIS_SeatProcessing>
    <Footnote>@</Footnote>
  </ns38:Ancillary>
  <ns38:Ancillary ancillaryDefinitionRef="ancillary_33" ancillaryId="ancillary_ancillary_66">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>693630</SequenceNumber>
    <TravelDateEffective>1980-01-01</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>CONFIRMED</AirExtraStatus>
    <PADIS_SeatProcessing>
      <PADIS_CodeTableInfo>
        <Characteristic>
          <Code>A</Code>
          <TranslatedName>AISLE</TranslatedName>
          <AbbreviatedName>AISLE</AbbreviatedName>
        </Characteristic>
        <Characteristic>
          <Code>CH</Code>
          <TranslatedName>CHARGEABLE</TranslatedName>
          <AbbreviatedName>PAID</AbbreviatedName>
        </Characteristic>
      </PADIS_CodeTableInfo>
    </PADIS_SeatProcessing>
    <Footnote>@</Footnote>
  </ns38:Ancillary>
  <ns38:Ancillary ancillaryDefinitionRef="ancillary_33" ancillaryId="ancillary_ancillary_67">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>694130</SequenceNumber>
    <TravelDateEffective>1980-01-01</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>CONFIRMED</AirExtraStatus>
    <PADIS_SeatProcessing>
      <PADIS_CodeTableInfo>
        <Characteristic>
          <Code>CH</Code>
          <TranslatedName>CHARGEABLE</TranslatedName>
          <AbbreviatedName>PAID</AbbreviatedName>
        </Characteristic>
      </PADIS_CodeTableInfo>
    </PADIS_SeatProcessing>
    <Footnote>@</Footnote>
  </ns38:Ancillary>
  <ns38:Ancillary ancillaryDefinitionRef="ancillary_69" ancillaryId="ancillary_ancillary_69">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>4000</SequenceNumber>
    <TravelDateEffective>2014-02-25</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>PAYMENT_REQUIRED</AirExtraStatus>
    <Footnote>N</Footnote>
  </ns38:Ancillary>
  <ns38:Ancillary ancillaryDefinitionRef="ancillary_70" ancillaryId="ancillary_ancillary_70">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>4000</SequenceNumber>
    <TravelDateEffective>2014-02-25</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>PAYMENT_REQUIRED</AirExtraStatus>
    <Footnote>X</Footnote>
  </ns38:Ancillary>
  <ns38:Ancillary ancillaryDefinitionRef="ancillary_73" ancillaryId="ancillary_ancillary_73">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>P</SectorPortionInd>
    <SequenceNumber>37562</SequenceNumber>
    <TravelDateEffective>1980-01-01</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>PAYMENT_REQUIRED</AirExtraStatus>
    <Footnote>N</Footnote>
  </ns38:Ancillary>
  <ns38:Ancillary ancillaryDefinitionRef="ancillary_74" ancillaryId="ancillary_ancillary_74">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>1000</SequenceNumber>
    <TravelDateEffective>2019-01-22</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>PAYMENT_REQUIRED</AirExtraStatus>
    <Footnote>X</Footnote>
  </ns38:Ancillary>
  <ns38:Ancillary ancillaryDefinitionRef="ancillary_77" ancillaryId="ancillary_ancillary_77">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>3000</SequenceNumber>
    <TravelDateEffective>2017-02-07</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>NO_AE</AirExtraStatus>
    <Footnote>*</Footnote>
  </ns38:Ancillary>
  <ns38:Ancillary ancillaryDefinitionRef="ancillary_79" ancillaryId="ancillary_ancillary_79">
    <ServiceType>C</ServiceType>
    <SectorPortionInd>P</SectorPortionInd>
    <BaggageData>
      <FirstOccurrence>-1</FirstOccurrence>
      <LastOccurrence>-1</LastOccurrence>
      <Weight unit="KILO">15</Weight>
    </BaggageData>
    <SequenceNumber>29318</SequenceNumber>
    <TravelDateEffective>1980-01-01</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>PAYMENT_REQUIRED</AirExtraStatus>
    <Footnote>N</Footnote>
  </ns38:Ancillary>
  <ns38:Ancillary ancillaryDefinitionRef="ancillary_81" ancillaryId="ancillary_ancillary_81">
    <ServiceType>C</ServiceType>
    <SectorPortionInd>P</SectorPortionInd>
    <BaggageData>
      <FirstOccurrence>-1</FirstOccurrence>
      <LastOccurrence>-1</LastOccurrence>
      <Weight unit="KILO">20</Weight>
    </BaggageData>
    <SequenceNumber>29318</SequenceNumber>
    <TravelDateEffective>1980-01-01</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>PAYMENT_REQUIRED</AirExtraStatus>
    <Footnote>N</Footnote>
  </ns38:Ancillary>
  <ns38:Ancillary ancillaryDefinitionRef="ancillary_83" ancillaryId="ancillary_ancillary_83">
    <ServiceType>C</ServiceType>
    <SectorPortionInd>P</SectorPortionInd>
    <BaggageData>
      <FirstOccurrence>-1</FirstOccurrence>
      <LastOccurrence>-1</LastOccurrence>
      <Weight unit="KILO">25</Weight>
    </BaggageData>
    <SequenceNumber>29318</SequenceNumber>
    <TravelDateEffective>1980-01-01</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>PAYMENT_REQUIRED</AirExtraStatus>
    <Footnote>N</Footnote>
  </ns38:Ancillary>
  <ns38:Ancillary ancillaryDefinitionRef="ancillary_85" ancillaryId="ancillary_ancillary_85">
    <ServiceType>C</ServiceType>
    <SectorPortionInd>P</SectorPortionInd>
    <BaggageData>
      <FirstOccurrence>-1</FirstOccurrence>
      <LastOccurrence>-1</LastOccurrence>
      <Weight unit="KILO">30</Weight>
    </BaggageData>
    <SequenceNumber>29318</SequenceNumber>
    <TravelDateEffective>1980-01-01</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>PAYMENT_REQUIRED</AirExtraStatus>
    <Footnote>N</Footnote>
  </ns38:Ancillary>
  <ns38:Ancillary ancillaryDefinitionRef="ancillary_87" ancillaryId="ancillary_ancillary_87">
    <ServiceType>C</ServiceType>
    <SectorPortionInd>P</SectorPortionInd>
    <BaggageData>
      <FirstOccurrence>-1</FirstOccurrence>
      <LastOccurrence>-1</LastOccurrence>
      <Weight unit="KILO">35</Weight>
    </BaggageData>
    <SequenceNumber>16833</SequenceNumber>
    <TravelDateEffective>1980-01-01</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>PAYMENT_REQUIRED</AirExtraStatus>
    <Footnote>N</Footnote>
  </ns38:Ancillary>
  <ns38:Ancillary ancillaryDefinitionRef="ancillary_89" ancillaryId="ancillary_ancillary_89">
    <ServiceType>C</ServiceType>
    <SectorPortionInd>P</SectorPortionInd>
    <BaggageData>
      <FirstOccurrence>-1</FirstOccurrence>
      <LastOccurrence>-1</LastOccurrence>
      <Weight unit="KILO">5</Weight>
    </BaggageData>
    <SequenceNumber>104225</SequenceNumber>
    <TravelDateEffective>1980-01-01</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>PAYMENT_REQUIRED</AirExtraStatus>
    <Footnote>N</Footnote>
  </ns38:Ancillary>
  <ns38:Ancillary ancillaryDefinitionRef="ancillary_91" ancillaryId="ancillary_ancillary_91">
    <ServiceType>C</ServiceType>
    <SectorPortionInd>P</SectorPortionInd>
    <BaggageData>
      <FirstOccurrence>-1</FirstOccurrence>
      <LastOccurrence>-1</LastOccurrence>
      <Weight unit="KILO">10</Weight>
    </BaggageData>
    <SequenceNumber>29318</SequenceNumber>
    <TravelDateEffective>1980-01-01</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>PAYMENT_REQUIRED</AirExtraStatus>
    <Footnote>N</Footnote>
  </ns38:Ancillary>
  <ns38:Ancillary ancillaryDefinitionRef="ancillary_94" ancillaryId="ancillary_ancillary_94">
    <ServiceType>C</ServiceType>
    <SectorPortionInd>P</SectorPortionInd>
    <BaggageData>
      <FirstOccurrence>-1</FirstOccurrence>
      <LastOccurrence>-1</LastOccurrence>
    </BaggageData>
    <SequenceNumber>280500</SequenceNumber>
    <TravelDateEffective>1980-01-01</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>PAYMENT_REQUIRED</AirExtraStatus>
    <Footnote>N</Footnote>
  </ns38:Ancillary>
  <ns38:Ancillary ancillaryDefinitionRef="ancillary_1" ancillaryId="ancillary_ancillary_1">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>P</SectorPortionInd>
    <SequenceNumber>1000</SequenceNumber>
    <TravelDateEffective>2019-08-04</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>PAYMENT_REQUIRED</AirExtraStatus>
    <Footnote>X</Footnote>
  </ns38:Ancillary>
  <ns38:Ancillary ancillaryDefinitionRef="ancillary_301" ancillaryId="ancillary_ancillary_301">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>1000</SequenceNumber>
    <TravelDateEffective>2013-08-01</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>PAYMENT_REQUIRED</AirExtraStatus>
    <Footnote>X</Footnote>
  </ns38:Ancillary>
  <ns38:Offers ancillaryRef="ancillary_ancillary_5" offerId="offer_ancillary_5">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">100868</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="AED" xmlns:ns2="http://services.sabre.com/merch/common/v03">6000</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">100868</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">100868</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">100868</ns2:EquivAmount>
      </TTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>Y</RefundableReissuable>
      <FormOfRefund code="1">ORIGINAL</FormOfRefund>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_1" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_6" offerId="offer_ancillary_6">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">100868</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="AED" xmlns:ns2="http://services.sabre.com/merch/common/v03">6000</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">100868</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">100868</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">100868</ns2:EquivAmount>
      </TTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_1" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_5" offerId="offer_ancillary_7">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">100868</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="AED" xmlns:ns2="http://services.sabre.com/merch/common/v03">6000</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">100868</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">100868</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">100868</ns2:EquivAmount>
      </TTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>Y</RefundableReissuable>
      <FormOfRefund code="1">ORIGINAL</FormOfRefund>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_2" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_6" offerId="offer_ancillary_8">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">100868</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="AED" xmlns:ns2="http://services.sabre.com/merch/common/v03">6000</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">100868</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">100868</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">100868</ns2:EquivAmount>
      </TTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_2" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_9" offerId="offer_ancillary_9">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:EquivAmount>
      </TTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>Y</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <FreeOfChargeRules>EMD_REQUIRED</FreeOfChargeRules>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_1" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_10" offerId="offer_ancillary_10">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">24600</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD" xmlns:ns2="http://services.sabre.com/merch/common/v03">400.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">24600</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">24600</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">24600</ns2:EquivAmount>
      </TTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>N</RefundableReissuable>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_1" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_11" offerId="offer_ancillary_11">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:EquivAmount>
      </TTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>Y</RefundableReissuable>
      <FormOfRefund code="1">ORIGINAL</FormOfRefund>
      <Commissionable>false</Commissionable>
      <FreeOfChargeRules>EMD_REQUIRED</FreeOfChargeRules>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_1" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_12" offerId="offer_ancillary_12">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">6150</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD" xmlns:ns2="http://services.sabre.com/merch/common/v03">100.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">6150</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">6150</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">6150</ns2:EquivAmount>
      </TTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>N</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FeeApplicationMethod code="3">ITEM</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_1" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_13" offerId="offer_ancillary_13">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:EquivAmount>
      </TTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>N</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <FreeOfChargeRules>EMD_REQUIRED</FreeOfChargeRules>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_1" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_14" offerId="offer_ancillary_14">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">25830</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD" xmlns:ns2="http://services.sabre.com/merch/common/v03">420.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">25830</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">25830</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">25830</ns2:EquivAmount>
      </TTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>N</RefundableReissuable>
      <FeeApplicationMethod code="3">ITEM</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_1" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_15" offerId="offer_ancillary_15">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:EquivAmount>
      </TTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>N</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_1" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_9" offerId="offer_ancillary_16">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:EquivAmount>
      </TTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>Y</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <FreeOfChargeRules>EMD_REQUIRED</FreeOfChargeRules>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_2" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_17" offerId="offer_ancillary_17">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">15375</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD" xmlns:ns2="http://services.sabre.com/merch/common/v03">250.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">15375</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">15375</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">15375</ns2:EquivAmount>
      </TTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>N</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_2" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_18" offerId="offer_ancillary_18">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">27675</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD" xmlns:ns2="http://services.sabre.com/merch/common/v03">450.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">27675</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">27675</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">27675</ns2:EquivAmount>
      </TTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>N</RefundableReissuable>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_2" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_19" offerId="offer_ancillary_19">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">4182</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD" xmlns:ns2="http://services.sabre.com/merch/common/v03">68.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">4182</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">4182</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">4182</ns2:EquivAmount>
      </TTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>Y</RefundableReissuable>
      <FormOfRefund code="1">ORIGINAL</FormOfRefund>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FeeApplicationMethod code="3">ITEM</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_2" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_11" offerId="offer_ancillary_20">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:EquivAmount>
      </TTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>Y</RefundableReissuable>
      <FormOfRefund code="1">ORIGINAL</FormOfRefund>
      <Commissionable>false</Commissionable>
      <FreeOfChargeRules>EMD_REQUIRED</FreeOfChargeRules>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_2" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_12" offerId="offer_ancillary_21">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">6150</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD" xmlns:ns2="http://services.sabre.com/merch/common/v03">100.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">6150</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">6150</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">6150</ns2:EquivAmount>
      </TTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>N</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FeeApplicationMethod code="3">ITEM</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_2" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_13" offerId="offer_ancillary_22">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:EquivAmount>
      </TTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>N</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <FreeOfChargeRules>EMD_REQUIRED</FreeOfChargeRules>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_2" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_14" offerId="offer_ancillary_23">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">25830</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD" xmlns:ns2="http://services.sabre.com/merch/common/v03">420.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">25830</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">25830</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">25830</ns2:EquivAmount>
      </TTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>N</RefundableReissuable>
      <FeeApplicationMethod code="3">ITEM</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_2" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_15" offerId="offer_ancillary_24">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:EquivAmount>
      </TTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>N</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_2" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_25" offerId="offer_ancillary_25">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">845686</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="EUR" xmlns:ns2="http://services.sabre.com/merch/common/v03">12345.78</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">845686</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">845686</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">845686</ns2:EquivAmount>
      </TTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>Y</RefundableReissuable>
      <FormOfRefund code="1">ORIGINAL</FormOfRefund>
      <Commissionable>false</Commissionable>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_1" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_25" offerId="offer_ancillary_26">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">845686</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="EUR" xmlns:ns2="http://services.sabre.com/merch/common/v03">12345.78</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">845686</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">845686</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">845686</ns2:EquivAmount>
      </TTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>Y</RefundableReissuable>
      <FormOfRefund code="1">ORIGINAL</FormOfRefund>
      <Commissionable>false</Commissionable>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_2" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_27" offerId="offer_ancillary_27">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">984</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD" xmlns:ns2="http://services.sabre.com/merch/common/v03">16.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">984</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">984</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">984</ns2:EquivAmount>
      </TTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>Y</RefundableReissuable>
      <FormOfRefund code="1">ORIGINAL</FormOfRefund>
      <Commissionable>false</Commissionable>
      <FeeApplicationMethod code="1">ONE_WAY</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_1" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_28" offerId="offer_ancillary_28">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">308</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD" xmlns:ns2="http://services.sabre.com/merch/common/v03">5.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">308</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">308</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">308</ns2:EquivAmount>
      </TTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>Y</RefundableReissuable>
      <FormOfRefund code="1">ORIGINAL</FormOfRefund>
      <Commissionable>false</Commissionable>
      <FeeApplicationMethod code="3">ITEM</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_1" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_29" offerId="offer_ancillary_29">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">800</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD" xmlns:ns2="http://services.sabre.com/merch/common/v03">13.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">800</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">800</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">800</ns2:EquivAmount>
      </TTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>Y</RefundableReissuable>
      <FormOfRefund code="1">ORIGINAL</FormOfRefund>
      <FeeApplicationMethod code="5">TICKET</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_2" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_28" offerId="offer_ancillary_30">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">308</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD" xmlns:ns2="http://services.sabre.com/merch/common/v03">5.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">308</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">308</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">308</ns2:EquivAmount>
      </TTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>Y</RefundableReissuable>
      <FormOfRefund code="1">ORIGINAL</FormOfRefund>
      <Commissionable>false</Commissionable>
      <FeeApplicationMethod code="3">ITEM</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_2" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_31" offerId="offer_ancillary_31">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">15990</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD" xmlns:ns2="http://services.sabre.com/merch/common/v03">260.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">15990</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">15990</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">15990</ns2:EquivAmount>
      </TTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>Y</RefundableReissuable>
      <FormOfRefund code="1">ORIGINAL</FormOfRefund>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FeeApplicationMethod code="4">PER_BAGGAGE_TRAVEL</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_1" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_31" offerId="offer_ancillary_32">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">15990</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD" xmlns:ns2="http://services.sabre.com/merch/common/v03">260.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">15990</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">15990</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">15990</ns2:EquivAmount>
      </TTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>Y</RefundableReissuable>
      <FormOfRefund code="1">ORIGINAL</FormOfRefund>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FeeApplicationMethod code="4">PER_BAGGAGE_TRAVEL</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_2" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_33" offerId="offer_ancillary_33">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">3998</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD" xmlns:ns2="http://services.sabre.com/merch/common/v03">65.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">3998</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">3998</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">3998</ns2:EquivAmount>
      </TTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>N</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment inventoryLevel="168" segmentId="seg_1" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_34" offerId="offer_ancillary_34">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">3998</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD" xmlns:ns2="http://services.sabre.com/merch/common/v03">65.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">3998</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">3998</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">3998</ns2:EquivAmount>
      </TTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>N</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment inventoryLevel="168" segmentId="seg_1" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_35" offerId="offer_ancillary_35">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">923</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD" xmlns:ns2="http://services.sabre.com/merch/common/v03">15.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">923</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">923</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">923</ns2:EquivAmount>
      </TTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>N</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment inventoryLevel="168" segmentId="seg_1" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:PurchaseByDate xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">2020-08-30</ns12:PurchaseByDate>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_36" offerId="offer_ancillary_36">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:EquivAmount>
      </TTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>N</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FreeOfChargeRules>BOOKING_REQUIRED</FreeOfChargeRules>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment inventoryLevel="168" segmentId="seg_1" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:PurchaseByDate xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">2020-08-30</ns12:PurchaseByDate>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_37" offerId="offer_ancillary_37">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:EquivAmount>
      </TTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>N</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FreeOfChargeRules>BOOKING_REQUIRED</FreeOfChargeRules>
      <FreeOfChargeRules>EMD_REQUIRED</FreeOfChargeRules>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment inventoryLevel="168" segmentId="seg_1" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:PurchaseByDate xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">2020-08-30</ns12:PurchaseByDate>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_38" offerId="offer_ancillary_38">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:EquivAmount>
      </TTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>N</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FreeOfChargeRules>BOOKING_REQUIRED</FreeOfChargeRules>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment inventoryLevel="168" segmentId="seg_1" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:PurchaseByDate xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">2020-08-30</ns12:PurchaseByDate>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_39" offerId="offer_ancillary_39">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:EquivAmount>
      </TTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>N</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FreeOfChargeRules>BOOKING_REQUIRED</FreeOfChargeRules>
      <FreeOfChargeRules>EMD_REQUIRED</FreeOfChargeRules>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment inventoryLevel="168" segmentId="seg_1" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:PurchaseByDate xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">2020-08-30</ns12:PurchaseByDate>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_40" offerId="offer_ancillary_40">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:EquivAmount>
      </TTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>N</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FreeOfChargeRules>BOOKING_REQUIRED</FreeOfChargeRules>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment inventoryLevel="168" segmentId="seg_1" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:PurchaseByDate xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">2020-08-30</ns12:PurchaseByDate>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_41" offerId="offer_ancillary_41">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:EquivAmount>
      </TTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>N</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FreeOfChargeRules>BOOKING_REQUIRED</FreeOfChargeRules>
      <FreeOfChargeRules>EMD_REQUIRED</FreeOfChargeRules>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment inventoryLevel="168" segmentId="seg_1" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:PurchaseByDate xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">2020-08-30</ns12:PurchaseByDate>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_42" offerId="offer_ancillary_42">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:EquivAmount>
      </TTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>N</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FreeOfChargeRules>BOOKING_REQUIRED</FreeOfChargeRules>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment inventoryLevel="168" segmentId="seg_1" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_43" offerId="offer_ancillary_43">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:EquivAmount>
      </TTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>N</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FreeOfChargeRules>BOOKING_REQUIRED</FreeOfChargeRules>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment inventoryLevel="168" segmentId="seg_1" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_44" offerId="offer_ancillary_44">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:EquivAmount>
      </TTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>N</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FreeOfChargeRules>BOOKING_REQUIRED</FreeOfChargeRules>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment inventoryLevel="168" segmentId="seg_1" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_45" offerId="offer_ancillary_45">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:EquivAmount>
      </TTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>N</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FreeOfChargeRules>BOOKING_REQUIRED</FreeOfChargeRules>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment inventoryLevel="168" segmentId="seg_1" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_46" offerId="offer_ancillary_46">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:EquivAmount>
      </TTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>N</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FreeOfChargeRules>BOOKING_REQUIRED</FreeOfChargeRules>
      <FreeOfChargeRules>EMD_REQUIRED</FreeOfChargeRules>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment inventoryLevel="168" segmentId="seg_1" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_47" offerId="offer_ancillary_47">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:EquivAmount>
      </TTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>N</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FreeOfChargeRules>BOOKING_REQUIRED</FreeOfChargeRules>
      <FreeOfChargeRules>EMD_REQUIRED</FreeOfChargeRules>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment inventoryLevel="168" segmentId="seg_1" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_48" offerId="offer_ancillary_48">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:EquivAmount>
      </TTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>N</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FreeOfChargeRules>BOOKING_REQUIRED</FreeOfChargeRules>
      <FreeOfChargeRules>EMD_REQUIRED</FreeOfChargeRules>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment inventoryLevel="168" segmentId="seg_1" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_49" offerId="offer_ancillary_49">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:EquivAmount>
      </TTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>N</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FreeOfChargeRules>BOOKING_REQUIRED</FreeOfChargeRules>
      <FreeOfChargeRules>EMD_REQUIRED</FreeOfChargeRules>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment inventoryLevel="168" segmentId="seg_1" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_50" offerId="offer_ancillary_50">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">1230</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD" xmlns:ns2="http://services.sabre.com/merch/common/v03">20.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">1230</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">1230</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">1230</ns2:EquivAmount>
      </TTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>N</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_1" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_33" offerId="offer_ancillary_51">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">3998</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD" xmlns:ns2="http://services.sabre.com/merch/common/v03">65.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">3998</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">3998</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">3998</ns2:EquivAmount>
      </TTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>N</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment inventoryLevel="168" segmentId="seg_2" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_34" offerId="offer_ancillary_52">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">3998</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD" xmlns:ns2="http://services.sabre.com/merch/common/v03">65.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">3998</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">3998</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">3998</ns2:EquivAmount>
      </TTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>N</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment inventoryLevel="168" segmentId="seg_2" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_35" offerId="offer_ancillary_53">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">923</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD" xmlns:ns2="http://services.sabre.com/merch/common/v03">15.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">923</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">923</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">923</ns2:EquivAmount>
      </TTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>N</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment inventoryLevel="168" segmentId="seg_2" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:PurchaseByDate xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">2020-09-06</ns12:PurchaseByDate>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_54" offerId="offer_ancillary_54">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:EquivAmount>
      </TTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>N</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FreeOfChargeRules>BOOKING_REQUIRED</FreeOfChargeRules>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment inventoryLevel="168" segmentId="seg_2" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:PurchaseByDate xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">2020-09-06</ns12:PurchaseByDate>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_55" offerId="offer_ancillary_55">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:EquivAmount>
      </TTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>N</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FreeOfChargeRules>BOOKING_REQUIRED</FreeOfChargeRules>
      <FreeOfChargeRules>EMD_REQUIRED</FreeOfChargeRules>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment inventoryLevel="168" segmentId="seg_2" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:PurchaseByDate xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">2020-09-06</ns12:PurchaseByDate>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_56" offerId="offer_ancillary_56">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:EquivAmount>
      </TTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>N</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FreeOfChargeRules>BOOKING_REQUIRED</FreeOfChargeRules>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment inventoryLevel="168" segmentId="seg_2" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:PurchaseByDate xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">2020-09-06</ns12:PurchaseByDate>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_57" offerId="offer_ancillary_57">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:EquivAmount>
      </TTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>N</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FreeOfChargeRules>BOOKING_REQUIRED</FreeOfChargeRules>
      <FreeOfChargeRules>EMD_REQUIRED</FreeOfChargeRules>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment inventoryLevel="168" segmentId="seg_2" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:PurchaseByDate xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">2020-09-06</ns12:PurchaseByDate>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_58" offerId="offer_ancillary_58">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:EquivAmount>
      </TTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>N</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FreeOfChargeRules>BOOKING_REQUIRED</FreeOfChargeRules>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment inventoryLevel="168" segmentId="seg_2" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:PurchaseByDate xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">2020-09-06</ns12:PurchaseByDate>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_59" offerId="offer_ancillary_59">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:EquivAmount>
      </TTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>N</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FreeOfChargeRules>BOOKING_REQUIRED</FreeOfChargeRules>
      <FreeOfChargeRules>EMD_REQUIRED</FreeOfChargeRules>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment inventoryLevel="168" segmentId="seg_2" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:PurchaseByDate xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">2020-09-06</ns12:PurchaseByDate>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_60" offerId="offer_ancillary_60">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:EquivAmount>
      </TTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>N</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FreeOfChargeRules>BOOKING_REQUIRED</FreeOfChargeRules>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment inventoryLevel="168" segmentId="seg_2" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_61" offerId="offer_ancillary_61">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:EquivAmount>
      </TTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>N</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FreeOfChargeRules>BOOKING_REQUIRED</FreeOfChargeRules>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment inventoryLevel="168" segmentId="seg_2" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_62" offerId="offer_ancillary_62">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:EquivAmount>
      </TTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>N</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FreeOfChargeRules>BOOKING_REQUIRED</FreeOfChargeRules>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment inventoryLevel="168" segmentId="seg_2" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_63" offerId="offer_ancillary_63">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:EquivAmount>
      </TTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>N</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FreeOfChargeRules>BOOKING_REQUIRED</FreeOfChargeRules>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment inventoryLevel="168" segmentId="seg_2" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_64" offerId="offer_ancillary_64">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:EquivAmount>
      </TTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>N</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FreeOfChargeRules>BOOKING_REQUIRED</FreeOfChargeRules>
      <FreeOfChargeRules>EMD_REQUIRED</FreeOfChargeRules>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment inventoryLevel="168" segmentId="seg_2" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_65" offerId="offer_ancillary_65">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:EquivAmount>
      </TTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>N</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FreeOfChargeRules>BOOKING_REQUIRED</FreeOfChargeRules>
      <FreeOfChargeRules>EMD_REQUIRED</FreeOfChargeRules>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment inventoryLevel="168" segmentId="seg_2" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_66" offerId="offer_ancillary_66">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:EquivAmount>
      </TTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>N</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FreeOfChargeRules>BOOKING_REQUIRED</FreeOfChargeRules>
      <FreeOfChargeRules>EMD_REQUIRED</FreeOfChargeRules>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment inventoryLevel="168" segmentId="seg_2" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_67" offerId="offer_ancillary_67">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:EquivAmount>
      </TTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>N</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FreeOfChargeRules>BOOKING_REQUIRED</FreeOfChargeRules>
      <FreeOfChargeRules>EMD_REQUIRED</FreeOfChargeRules>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment inventoryLevel="168" segmentId="seg_2" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_50" offerId="offer_ancillary_68">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">1230</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD" xmlns:ns2="http://services.sabre.com/merch/common/v03">20.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">1230</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">1230</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">1230</ns2:EquivAmount>
      </TTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>N</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_2" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_69" offerId="offer_ancillary_69">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">2829</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD" xmlns:ns2="http://services.sabre.com/merch/common/v03">46.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">2829</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">2829</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">2829</ns2:EquivAmount>
      </TTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>N</RefundableReissuable>
      <FormOfRefund code="1">ORIGINAL</FormOfRefund>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_1" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_70" offerId="offer_ancillary_70">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">3137</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD" xmlns:ns2="http://services.sabre.com/merch/common/v03">51.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">3137</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">3137</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">3137</ns2:EquivAmount>
      </TTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>Y</RefundableReissuable>
      <FormOfRefund code="1">ORIGINAL</FormOfRefund>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_1" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_69" offerId="offer_ancillary_71">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">2829</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD" xmlns:ns2="http://services.sabre.com/merch/common/v03">46.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">2829</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">2829</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">2829</ns2:EquivAmount>
      </TTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>N</RefundableReissuable>
      <FormOfRefund code="1">ORIGINAL</FormOfRefund>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_2" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_70" offerId="offer_ancillary_72">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">3137</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD" xmlns:ns2="http://services.sabre.com/merch/common/v03">51.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">3137</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">3137</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">3137</ns2:EquivAmount>
      </TTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>Y</RefundableReissuable>
      <FormOfRefund code="1">ORIGINAL</FormOfRefund>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_2" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_73" offerId="offer_ancillary_73">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">1230</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD" xmlns:ns2="http://services.sabre.com/merch/common/v03">20.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">1230</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">1230</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">1230</ns2:EquivAmount>
      </TTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>N</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_1" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:PurchaseByDate xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">2020-09-01</ns12:PurchaseByDate>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_74" offerId="offer_ancillary_74">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">6150</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD" xmlns:ns2="http://services.sabre.com/merch/common/v03">100.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">6150</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">6150</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">6150</ns2:EquivAmount>
      </TTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>Y</RefundableReissuable>
      <FormOfRefund code="1">ORIGINAL</FormOfRefund>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_1" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_73" offerId="offer_ancillary_75">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">1230</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD" xmlns:ns2="http://services.sabre.com/merch/common/v03">20.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">1230</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">1230</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">1230</ns2:EquivAmount>
      </TTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>N</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_2" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:PurchaseByDate xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">2020-09-07</ns12:PurchaseByDate>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_74" offerId="offer_ancillary_76">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">6150</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD" xmlns:ns2="http://services.sabre.com/merch/common/v03">100.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">6150</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">6150</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">6150</ns2:EquivAmount>
      </TTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>Y</RefundableReissuable>
      <FormOfRefund code="1">ORIGINAL</FormOfRefund>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_2" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_77" offerId="offer_ancillary_77">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>true</Unavailable>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Commissionable>false</Commissionable>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_1" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:PurchaseByDate xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">2020-08-31</ns12:PurchaseByDate>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_77" offerId="offer_ancillary_78">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>true</Unavailable>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Commissionable>false</Commissionable>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_2" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:PurchaseByDate xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">2020-09-06</ns12:PurchaseByDate>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_79" offerId="offer_ancillary_79">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">20790</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD" xmlns:ns2="http://services.sabre.com/merch/common/v03">338.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">20790</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">20790</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">20790</ns2:EquivAmount>
      </TTL_Price>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>true</Interlineable>
      <FeeApplicationMethod code="4">PER_BAGGAGE_TRAVEL</FeeApplicationMethod>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_1" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:PurchaseByDate xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">2020-08-30</ns12:PurchaseByDate>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_81" offerId="offer_ancillary_81">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">27675</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD" xmlns:ns2="http://services.sabre.com/merch/common/v03">450.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">27675</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">27675</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">27675</ns2:EquivAmount>
      </TTL_Price>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>true</Interlineable>
      <FeeApplicationMethod code="4">PER_BAGGAGE_TRAVEL</FeeApplicationMethod>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_1" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:PurchaseByDate xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">2020-08-30</ns12:PurchaseByDate>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_83" offerId="offer_ancillary_83">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">34625</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD" xmlns:ns2="http://services.sabre.com/merch/common/v03">563.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">34625</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">34625</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">34625</ns2:EquivAmount>
      </TTL_Price>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>true</Interlineable>
      <FeeApplicationMethod code="4">PER_BAGGAGE_TRAVEL</FeeApplicationMethod>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_1" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:PurchaseByDate xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">2020-08-30</ns12:PurchaseByDate>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_85" offerId="offer_ancillary_85">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">41515</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD" xmlns:ns2="http://services.sabre.com/merch/common/v03">675.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">41515</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">41515</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">41515</ns2:EquivAmount>
      </TTL_Price>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>true</Interlineable>
      <FeeApplicationMethod code="4">PER_BAGGAGE_TRAVEL</FeeApplicationMethod>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_1" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:PurchaseByDate xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">2020-08-30</ns12:PurchaseByDate>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_87" offerId="offer_ancillary_87">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">48465</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD" xmlns:ns2="http://services.sabre.com/merch/common/v03">788.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">48465</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">48465</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">48465</ns2:EquivAmount>
      </TTL_Price>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>true</Interlineable>
      <FeeApplicationMethod code="4">PER_BAGGAGE_TRAVEL</FeeApplicationMethod>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_1" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:PurchaseByDate xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">2020-08-30</ns12:PurchaseByDate>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_89" offerId="offer_ancillary_89">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">6950</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD" xmlns:ns2="http://services.sabre.com/merch/common/v03">113.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">6950</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">6950</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">6950</ns2:EquivAmount>
      </TTL_Price>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>true</Interlineable>
      <FeeApplicationMethod code="4">PER_BAGGAGE_TRAVEL</FeeApplicationMethod>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_1" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:PurchaseByDate xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">2020-08-30</ns12:PurchaseByDate>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_91" offerId="offer_ancillary_91">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">13840</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD" xmlns:ns2="http://services.sabre.com/merch/common/v03">225.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">13840</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">13840</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">13840</ns2:EquivAmount>
      </TTL_Price>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>true</Interlineable>
      <FeeApplicationMethod code="4">PER_BAGGAGE_TRAVEL</FeeApplicationMethod>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_1" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:PurchaseByDate xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">2020-08-30</ns12:PurchaseByDate>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_94" offerId="offer_ancillary_94">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">1540</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD" xmlns:ns2="http://services.sabre.com/merch/common/v03">25.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">1540</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">1540</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">1540</ns2:EquivAmount>
      </TTL_Price>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>true</Interlineable>
      <FeeApplicationMethod code="K">PER_1KG_OVER_FREE_BAGGAGE_ALLOWANCE</FeeApplicationMethod>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_1" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_79" offerId="offer_ancillary_96">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">20790</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD" xmlns:ns2="http://services.sabre.com/merch/common/v03">338.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">20790</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">20790</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">20790</ns2:EquivAmount>
      </TTL_Price>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>true</Interlineable>
      <FeeApplicationMethod code="4">PER_BAGGAGE_TRAVEL</FeeApplicationMethod>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_2" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:PurchaseByDate xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">2020-09-06</ns12:PurchaseByDate>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_81" offerId="offer_ancillary_98">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">27675</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD" xmlns:ns2="http://services.sabre.com/merch/common/v03">450.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">27675</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">27675</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">27675</ns2:EquivAmount>
      </TTL_Price>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>true</Interlineable>
      <FeeApplicationMethod code="4">PER_BAGGAGE_TRAVEL</FeeApplicationMethod>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_2" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:PurchaseByDate xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">2020-09-06</ns12:PurchaseByDate>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_83" offerId="offer_ancillary_100">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">34625</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD" xmlns:ns2="http://services.sabre.com/merch/common/v03">563.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">34625</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">34625</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">34625</ns2:EquivAmount>
      </TTL_Price>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>true</Interlineable>
      <FeeApplicationMethod code="4">PER_BAGGAGE_TRAVEL</FeeApplicationMethod>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_2" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:PurchaseByDate xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">2020-09-06</ns12:PurchaseByDate>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_85" offerId="offer_ancillary_102">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">41515</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD" xmlns:ns2="http://services.sabre.com/merch/common/v03">675.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">41515</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">41515</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">41515</ns2:EquivAmount>
      </TTL_Price>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>true</Interlineable>
      <FeeApplicationMethod code="4">PER_BAGGAGE_TRAVEL</FeeApplicationMethod>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_2" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:PurchaseByDate xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">2020-09-06</ns12:PurchaseByDate>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_87" offerId="offer_ancillary_104">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">48465</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD" xmlns:ns2="http://services.sabre.com/merch/common/v03">788.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">48465</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">48465</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">48465</ns2:EquivAmount>
      </TTL_Price>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>true</Interlineable>
      <FeeApplicationMethod code="4">PER_BAGGAGE_TRAVEL</FeeApplicationMethod>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_2" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:PurchaseByDate xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">2020-09-06</ns12:PurchaseByDate>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_89" offerId="offer_ancillary_106">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">6950</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD" xmlns:ns2="http://services.sabre.com/merch/common/v03">113.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">6950</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">6950</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">6950</ns2:EquivAmount>
      </TTL_Price>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>true</Interlineable>
      <FeeApplicationMethod code="4">PER_BAGGAGE_TRAVEL</FeeApplicationMethod>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_2" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:PurchaseByDate xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">2020-09-06</ns12:PurchaseByDate>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_91" offerId="offer_ancillary_108">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">13840</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD" xmlns:ns2="http://services.sabre.com/merch/common/v03">225.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">13840</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">13840</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">13840</ns2:EquivAmount>
      </TTL_Price>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>true</Interlineable>
      <FeeApplicationMethod code="4">PER_BAGGAGE_TRAVEL</FeeApplicationMethod>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_2" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:PurchaseByDate xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">2020-09-06</ns12:PurchaseByDate>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_94" offerId="offer_ancillary_111">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">1540</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD" xmlns:ns2="http://services.sabre.com/merch/common/v03">25.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">1540</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">1540</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">1540</ns2:EquivAmount>
      </TTL_Price>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>true</Interlineable>
      <FeeApplicationMethod code="K">PER_1KG_OVER_FREE_BAGGAGE_ALLOWANCE</FeeApplicationMethod>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_2" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_1" offerId="offer_ancillary_1">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">3867</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="AED" xmlns:ns2="http://services.sabre.com/merch/common/v03">230</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">3867</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">3867</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">3867</ns2:EquivAmount>
      </TTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>Y</RefundableReissuable>
      <FormOfRefund code="1">ORIGINAL</FormOfRefund>
      <Commissionable>false</Commissionable>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:LinkedAE xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">offer_ancillary_89 offer_ancillary_40</ns12:LinkedAE>
    <ns12:Segment inventoryLevel="168" segmentId="seg_1" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_1" offerId="offer_ancillary_3">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">3867</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="AED" xmlns:ns2="http://services.sabre.com/merch/common/v03">230</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">3867</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">3867</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">3867</ns2:EquivAmount>
      </TTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>Y</RefundableReissuable>
      <FormOfRefund code="1">ORIGINAL</FormOfRefund>
      <Commissionable>false</Commissionable>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:LinkedAE xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">offer_ancillary_58 offer_ancillary_106</ns12:LinkedAE>
    <ns12:Segment inventoryLevel="168" segmentId="seg_2" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_301" offerId="offer_ancillary_301">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">861</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD" xmlns:ns2="http://services.sabre.com/merch/common/v03">14.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">861</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">861</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">861</ns2:EquivAmount>
      </TTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>Y</RefundableReissuable>
      <FormOfRefund code="1">ORIGINAL</FormOfRefund>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_1" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_301" offerId="offer_ancillary_302">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">861</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD" xmlns:ns2="http://services.sabre.com/merch/common/v03">14.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">861</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">861</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">861</ns2:EquivAmount>
      </TTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>Y</RefundableReissuable>
      <FormOfRefund code="1">ORIGINAL</FormOfRefund>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_2" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:PassengerOffers>
    <ns12:PassengerReference passengerId="pax_1" passengerType="ADT" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:OfferRefs xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">offer_ancillary_5 offer_ancillary_6 offer_ancillary_7 offer_ancillary_8 offer_ancillary_9 offer_ancillary_10 offer_ancillary_11 offer_ancillary_12 offer_ancillary_13 offer_ancillary_14 offer_ancillary_15 offer_ancillary_16 offer_ancillary_17 offer_ancillary_18 offer_ancillary_19 offer_ancillary_20 offer_ancillary_21 offer_ancillary_22 offer_ancillary_23 offer_ancillary_24 offer_ancillary_25 offer_ancillary_26 offer_ancillary_27 offer_ancillary_28 offer_ancillary_29 offer_ancillary_30 offer_ancillary_31 offer_ancillary_32 offer_ancillary_33 offer_ancillary_34 offer_ancillary_35 offer_ancillary_36 offer_ancillary_37 offer_ancillary_38 offer_ancillary_39 offer_ancillary_40 offer_ancillary_41 offer_ancillary_42 offer_ancillary_43 offer_ancillary_44 offer_ancillary_45 offer_ancillary_46 offer_ancillary_47 offer_ancillary_48 offer_ancillary_49 offer_ancillary_50 offer_ancillary_51 offer_ancillary_52 offer_ancillary_53 offer_ancillary_54 offer_ancillary_55 offer_ancillary_56 offer_ancillary_57 offer_ancillary_58 offer_ancillary_59 offer_ancillary_60 offer_ancillary_61 offer_ancillary_62 offer_ancillary_63 offer_ancillary_64 offer_ancillary_65 offer_ancillary_66 offer_ancillary_67 offer_ancillary_68 offer_ancillary_69 offer_ancillary_70 offer_ancillary_71 offer_ancillary_72 offer_ancillary_73 offer_ancillary_74 offer_ancillary_75 offer_ancillary_76 offer_ancillary_77 offer_ancillary_78 offer_ancillary_79 offer_ancillary_81 offer_ancillary_83 offer_ancillary_85 offer_ancillary_87 offer_ancillary_89 offer_ancillary_91 offer_ancillary_94 offer_ancillary_96 offer_ancillary_98 offer_ancillary_100 offer_ancillary_102 offer_ancillary_104 offer_ancillary_106 offer_ancillary_108 offer_ancillary_111 offer_ancillary_1 offer_ancillary_3</ns12:OfferRefs>
  </ns38:PassengerOffers>
  <ns38:PassengerOffers>
    <ns12:PassengerReference passengerId="pax_2" passengerType="ADT" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:OfferRefs xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">offer_ancillary_5 offer_ancillary_6 offer_ancillary_7 offer_ancillary_8 offer_ancillary_9 offer_ancillary_10 offer_ancillary_11 offer_ancillary_12 offer_ancillary_13 offer_ancillary_14 offer_ancillary_15 offer_ancillary_16 offer_ancillary_17 offer_ancillary_18 offer_ancillary_19 offer_ancillary_20 offer_ancillary_21 offer_ancillary_22 offer_ancillary_23 offer_ancillary_24 offer_ancillary_25 offer_ancillary_26 offer_ancillary_27 offer_ancillary_28 offer_ancillary_29 offer_ancillary_30 offer_ancillary_31 offer_ancillary_32 offer_ancillary_33 offer_ancillary_34 offer_ancillary_35 offer_ancillary_36 offer_ancillary_37 offer_ancillary_38 offer_ancillary_39 offer_ancillary_40 offer_ancillary_41 offer_ancillary_42 offer_ancillary_43 offer_ancillary_44 offer_ancillary_45 offer_ancillary_46 offer_ancillary_47 offer_ancillary_48 offer_ancillary_49 offer_ancillary_50 offer_ancillary_51 offer_ancillary_52 offer_ancillary_53 offer_ancillary_54 offer_ancillary_55 offer_ancillary_56 offer_ancillary_57 offer_ancillary_58 offer_ancillary_59 offer_ancillary_60 offer_ancillary_61 offer_ancillary_62 offer_ancillary_63 offer_ancillary_64 offer_ancillary_65 offer_ancillary_66 offer_ancillary_67 offer_ancillary_68 offer_ancillary_69 offer_ancillary_70 offer_ancillary_71 offer_ancillary_72 offer_ancillary_73 offer_ancillary_74 offer_ancillary_75 offer_ancillary_76 offer_ancillary_77 offer_ancillary_78 offer_ancillary_79 offer_ancillary_81 offer_ancillary_83 offer_ancillary_85 offer_ancillary_87 offer_ancillary_89 offer_ancillary_91 offer_ancillary_94 offer_ancillary_96 offer_ancillary_98 offer_ancillary_100 offer_ancillary_102 offer_ancillary_104 offer_ancillary_106 offer_ancillary_108 offer_ancillary_111 offer_ancillary_1 offer_ancillary_3</ns12:OfferRefs>
  </ns38:PassengerOffers>
  <ns38:PassengerOffers>
    <ns12:PassengerReference passengerId="pax_3" passengerType="CNN" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:OfferRefs xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">offer_ancillary_5 offer_ancillary_6 offer_ancillary_7 offer_ancillary_8 offer_ancillary_9 offer_ancillary_10 offer_ancillary_11 offer_ancillary_12 offer_ancillary_13 offer_ancillary_14 offer_ancillary_15 offer_ancillary_16 offer_ancillary_17 offer_ancillary_18 offer_ancillary_19 offer_ancillary_20 offer_ancillary_21 offer_ancillary_22 offer_ancillary_23 offer_ancillary_24 offer_ancillary_25 offer_ancillary_26 offer_ancillary_27 offer_ancillary_28 offer_ancillary_29 offer_ancillary_30 offer_ancillary_31 offer_ancillary_32 offer_ancillary_33 offer_ancillary_34 offer_ancillary_35 offer_ancillary_36 offer_ancillary_37 offer_ancillary_38 offer_ancillary_39 offer_ancillary_40 offer_ancillary_41 offer_ancillary_42 offer_ancillary_43 offer_ancillary_44 offer_ancillary_45 offer_ancillary_46 offer_ancillary_47 offer_ancillary_48 offer_ancillary_49 offer_ancillary_50 offer_ancillary_51 offer_ancillary_52 offer_ancillary_53 offer_ancillary_54 offer_ancillary_55 offer_ancillary_56 offer_ancillary_57 offer_ancillary_58 offer_ancillary_59 offer_ancillary_60 offer_ancillary_61 offer_ancillary_62 offer_ancillary_63 offer_ancillary_64 offer_ancillary_65 offer_ancillary_66 offer_ancillary_67 offer_ancillary_68 offer_ancillary_69 offer_ancillary_70 offer_ancillary_71 offer_ancillary_72 offer_ancillary_73 offer_ancillary_74 offer_ancillary_75 offer_ancillary_76 offer_ancillary_301 offer_ancillary_302 offer_ancillary_77 offer_ancillary_78 offer_ancillary_79 offer_ancillary_81 offer_ancillary_83 offer_ancillary_85 offer_ancillary_87 offer_ancillary_89 offer_ancillary_91 offer_ancillary_94 offer_ancillary_96 offer_ancillary_98 offer_ancillary_100 offer_ancillary_102 offer_ancillary_104 offer_ancillary_106 offer_ancillary_108 offer_ancillary_111 offer_ancillary_1 offer_ancillary_3</ns12:OfferRefs>
  </ns38:PassengerOffers>
  <ns38:ResponseOptions>
    <ns38:EmptyGroupList>FF UU CO LG</ns38:EmptyGroupList>
    <ns38:InactiveGroupList>99 ST BF RO</ns38:InactiveGroupList>
  </ns38:ResponseOptions>
</ns38:GetAncillaryOffersRS>
{% endxmlsec %}

## Параметры запроса списка дополнительных услуг после оформления билетов

### Пассажиры

*Обратите внимание на то, что в Sabre нельзя забронировать дополнительные услуги для младенцев без места.*

Для каждого пассажира в бронировании необходимо указать:

- ```/gao:GetAncillaryOffersRQ/gao:QueryByItinerary/gao:QueryPassengerItinerary/gao:Passenger/@id``` — уникальный идентификатор пассажира
- ```/gao:GetAncillaryOffersRQ/gao:QueryByItinerary/gao:QueryPassengerItinerary/gao:Passenger/@nameReferenceNumber``` — номер пассажира в бронировании
- ```/gao:GetAncillaryOffersRQ/gao:QueryByItinerary/gao:QueryPassengerItinerary/gao:PassengerItinerary/@ticketReferenceNumber``` — номер билета

Для каждой связки пассажира и сегмента необходимо указать:

- ```/gao:GetAncillaryOffersRQ/gao:QueryByItinerary/gao:QueryPassengerItinerary/gao:PassengerItinerary/gao:PassengerSegment/@segmentRef``` — идентификатор соответствующего сегмента

### Сегменты

Для каждого сегмента в бронировании необходимо указать:
- ```/gao:GetAncillaryOffersRQ/gao:QueryByItinerary/gao:Segment/@id``` — уникальный идентификатор сегмента
- ```/gao:GetAncillaryOffersRQ/gao:QueryByItinerary/gao:Segment/itin:FlightDetail/@id``` — уникальный идентификатор рейса
- ```/gao:GetAncillaryOffersRQ/gao:QueryByItinerary/gao:Segment/itin:FlightDetail/flt:Airline``` — код маркетингового перевозчика
- ```/gao:GetAncillaryOffersRQ/gao:QueryByItinerary/gao:Segment/itin:FlightDetail/flt:FlightNumber``` — номер рейса
- ```/gao:GetAncillaryOffersRQ/gao:QueryByItinerary/gao:Segment/itin:FlightDetail/flt:DepartureAirport``` — код аэропорта отправления
- ```/gao:GetAncillaryOffersRQ/gao:QueryByItinerary/gao:Segment/itin:FlightDetail/flt:DepartureDate``` — дата вылета
- ```/gao:GetAncillaryOffersRQ/gao:QueryByItinerary/gao:Segment/itin:FlightDetail/flt:DepartureTime``` — время вылета
- ```/gao:GetAncillaryOffersRQ/gao:QueryByItinerary/gao:Segment/itin:FlightDetail/flt:ArrivalAirport``` — код аэропорта прибытия
- ```/gao:GetAncillaryOffersRQ/gao:QueryByItinerary/gao:Segment/itin:FlightDetail/flt:ClassOfService``` — класс бронирования

### Пример

{% xmlsec "Пример запроса", false %}
<gao:GetAncillaryOffersRQ version="3.1.0" xmlns:anc="http://services.sabre.com/merch/ancillary/v03" xmlns:flt="http://services.sabre.com/merch/flight/v03" xmlns:gao="http://services.sabre.com/merch/ancillary/offer/v03" xmlns:itin="http://services.sabre.com/merch/itinerary/v03" xmlns:pax="http://services.sabre.com/merch/passenger/v03">
  <gao:RequestType>payload</gao:RequestType>
  <gao:RequestMode>booking</gao:RequestMode>
  <gao:QueryByItinerary>
    <gao:QueryPassengerItinerary>
      <gao:Passenger id="pax_1" nameReferenceNumber="1.1"/>
      <gao:PassengerItinerary ticketReferenceNumber="6075588031885">
        <gao:PassengerSegment segmentRef="seg_1"/>
        <gao:PassengerSegment segmentRef="seg_2"/>
      </gao:PassengerItinerary>
    </gao:QueryPassengerItinerary>
    <gao:QueryPassengerItinerary>
      <gao:Passenger id="pax_2" nameReferenceNumber="2.1"/>
      <gao:PassengerItinerary ticketReferenceNumber="6075588031886">
        <gao:PassengerSegment segmentRef="seg_1"/>
        <gao:PassengerSegment segmentRef="seg_2"/>
      </gao:PassengerItinerary>
    </gao:QueryPassengerItinerary>
    <gao:QueryPassengerItinerary>
      <gao:Passenger id="pax_3" nameReferenceNumber="3.1"/>
      <gao:PassengerItinerary ticketReferenceNumber="6075588031888">
        <gao:PassengerSegment segmentRef="seg_1"/>
        <gao:PassengerSegment segmentRef="seg_2"/>
      </gao:PassengerItinerary>
    </gao:QueryPassengerItinerary>
    <gao:Segment id="seg_1">
      <itin:FlightDetail id="flight_1">
        <flt:Airline>EY</flt:Airline>
        <flt:FlightNumber>68</flt:FlightNumber>
        <flt:DepartureAirport>DME</flt:DepartureAirport>
        <flt:DepartureDate>2020-09-01</flt:DepartureDate>
        <flt:DepartureTime>12:40:00</flt:DepartureTime>
        <flt:ArrivalAirport>AUH</flt:ArrivalAirport>
        <flt:ClassOfService>Y</flt:ClassOfService>
      </itin:FlightDetail>
    </gao:Segment>
    <gao:Segment id="seg_2">
      <itin:FlightDetail id="flight_2">
        <flt:Airline>EY</flt:Airline>
        <flt:FlightNumber>65</flt:FlightNumber>
        <flt:DepartureAirport>AUH</flt:DepartureAirport>
        <flt:DepartureDate>2020-09-08</flt:DepartureDate>
        <flt:DepartureTime>02:25:00</flt:DepartureTime>
        <flt:ArrivalAirport>DME</flt:ArrivalAirport>
        <flt:ClassOfService>B</flt:ClassOfService>
      </itin:FlightDetail>
    </gao:Segment>
  </gao:QueryByItinerary>
</gao:GetAncillaryOffersRQ>
{% endxmlsec %}

{% xmlsec "Пример ответа", false %}
<ns38:GetAncillaryOffersRS xmlns:ns38="http://services.sabre.com/merch/ancillary/offer/v03">
  <ns20:ApplicationResults status="Complete" xmlns:ns20="http://services.sabre.com/STL_Payload/v02_01">
    <ns20:Success timeStamp="2020-01-23T07:01:50.401-06:00"/>
  </ns20:ApplicationResults>
  <ns38:AncillaryDefinition id="ancillary_5">
    <SubCode>0BQ</SubCode>
    <Airline>EY</Airline>
    <CommercialName>TRAIN</CommercialName>
    <Vendor>MMGR</Vendor>
    <Group>GT</Group>
    <GroupDescription>GROUND TRANSPORTATION</GroupDescription>
    <SubGroup>TN</SubGroup>
    <SubGroupDescription>TRAIN</SubGroupDescription>
    <ReasonForIssuance code="B">GROUND_TRANSPORT_NON_AIR_SERVICES</ReasonForIssuance>
    <ElectronicMiscDocType code="2">FLIGHT_COUPON_ASSOCIATED</ElectronicMiscDocType>
    <BookingMethod code="BLANK">ANY_ALLOWED</BookingMethod>
  </ns38:AncillaryDefinition>
  <ns38:AncillaryDefinition id="ancillary_6">
    <SubCode>0BR</SubCode>
    <Airline>EY</Airline>
    <CommercialName>TRANSFER</CommercialName>
    <Vendor>MMGR</Vendor>
    <Group>GT</Group>
    <GroupDescription>GROUND TRANSPORTATION</GroupDescription>
    <SubGroup>TF</SubGroup>
    <SubGroupDescription>TRANSFER</SubGroupDescription>
    <ReasonForIssuance code="B">GROUND_TRANSPORT_NON_AIR_SERVICES</ReasonForIssuance>
    <ElectronicMiscDocType code="2">FLIGHT_COUPON_ASSOCIATED</ElectronicMiscDocType>
    <BookingMethod code="BLANK">ANY_ALLOWED</BookingMethod>
  </ns38:AncillaryDefinition>
  <ns38:AncillaryDefinition id="ancillary_9">
    <SubCode>DAJ</SubCode>
    <Airline>EY</Airline>
    <CommercialName>DYNAMIC AUCTION Y TO J</CommercialName>
    <Vendor>MMGR</Vendor>
    <Group>IE</Group>
    <GroupDescription>IN-FLIGHT ENTERTAINMENT</GroupDescription>
    <ReasonForIssuance code="G">IN_FLIGHT_SERVICES</ReasonForIssuance>
    <ElectronicMiscDocType code="2">FLIGHT_COUPON_ASSOCIATED</ElectronicMiscDocType>
    <BookingMethod code="BLANK">ANY_ALLOWED</BookingMethod>
  </ns38:AncillaryDefinition>
  <ns38:AncillaryDefinition id="ancillary_10">
    <SubCode>IUC</SubCode>
    <Airline>EY</Airline>
    <CommercialName>INSTANT AIRPORT UPGRADE Y TO C</CommercialName>
    <Vendor>MMGR</Vendor>
    <Group>IE</Group>
    <GroupDescription>IN-FLIGHT ENTERTAINMENT</GroupDescription>
    <ReasonForIssuance code="I">INDIVIDUAL_AIRLINE_USE</ReasonForIssuance>
    <ElectronicMiscDocType code="2">FLIGHT_COUPON_ASSOCIATED</ElectronicMiscDocType>
    <BookingMethod code="BLANK">ANY_ALLOWED</BookingMethod>
  </ns38:AncillaryDefinition>
  <ns38:AncillaryDefinition id="ancillary_11">
    <SubCode>NFS</SubCode>
    <Airline>EY</Airline>
    <CommercialName>NEIGHBOR FREE SEAT</CommercialName>
    <Vendor>MMGR</Vendor>
    <Group>IE</Group>
    <GroupDescription>IN-FLIGHT ENTERTAINMENT</GroupDescription>
    <ReasonForIssuance code="G">IN_FLIGHT_SERVICES</ReasonForIssuance>
    <ElectronicMiscDocType code="2">FLIGHT_COUPON_ASSOCIATED</ElectronicMiscDocType>
    <BookingMethod code="BLANK">ANY_ALLOWED</BookingMethod>
  </ns38:AncillaryDefinition>
  <ns38:AncillaryDefinition id="ancillary_12">
    <SubCode>PCS</SubCode>
    <Airline>EY</Airline>
    <CommercialName>PAID CHAUFFER SERVICE</CommercialName>
    <Vendor>MMGR</Vendor>
    <Group>IE</Group>
    <GroupDescription>IN-FLIGHT ENTERTAINMENT</GroupDescription>
    <ReasonForIssuance code="B">GROUND_TRANSPORT_NON_AIR_SERVICES</ReasonForIssuance>
    <ElectronicMiscDocType code="2">FLIGHT_COUPON_ASSOCIATED</ElectronicMiscDocType>
    <BookingMethod code="BLANK">ANY_ALLOWED</BookingMethod>
  </ns38:AncillaryDefinition>
  <ns38:AncillaryDefinition id="ancillary_13">
    <SubCode>PLS</SubCode>
    <Airline>EY</Airline>
    <CommercialName>PLUS GRADE Y TO J</CommercialName>
    <Vendor>MMGR</Vendor>
    <Group>IE</Group>
    <GroupDescription>IN-FLIGHT ENTERTAINMENT</GroupDescription>
    <ReasonForIssuance code="G">IN_FLIGHT_SERVICES</ReasonForIssuance>
    <ElectronicMiscDocType code="2">FLIGHT_COUPON_ASSOCIATED</ElectronicMiscDocType>
    <BookingMethod code="BLANK">ANY_ALLOWED</BookingMethod>
  </ns38:AncillaryDefinition>
  <ns38:AncillaryDefinition id="ancillary_14">
    <SubCode>PUC</SubCode>
    <Airline>EY</Airline>
    <CommercialName>PUSH UPGRADE Y TO C</CommercialName>
    <Vendor>MMGR</Vendor>
    <Group>IE</Group>
    <GroupDescription>IN-FLIGHT ENTERTAINMENT</GroupDescription>
    <ReasonForIssuance code="G">IN_FLIGHT_SERVICES</ReasonForIssuance>
    <ElectronicMiscDocType code="2">FLIGHT_COUPON_ASSOCIATED</ElectronicMiscDocType>
    <BookingMethod code="BLANK">ANY_ALLOWED</BookingMethod>
  </ns38:AncillaryDefinition>
  <ns38:AncillaryDefinition id="ancillary_15">
    <SubCode>SCS</SubCode>
    <Airline>EY</Airline>
    <CommercialName>SPECIAL CATERING 1380</CommercialName>
    <Vendor>MMGR</Vendor>
    <Group>IE</Group>
    <GroupDescription>IN-FLIGHT ENTERTAINMENT</GroupDescription>
    <ReasonForIssuance code="G">IN_FLIGHT_SERVICES</ReasonForIssuance>
    <ElectronicMiscDocType code="2">FLIGHT_COUPON_ASSOCIATED</ElectronicMiscDocType>
    <BookingMethod code="BLANK">ANY_ALLOWED</BookingMethod>
  </ns38:AncillaryDefinition>
  <ns38:AncillaryDefinition id="ancillary_17">
    <SubCode>HDC</SubCode>
    <Airline>EY</Airline>
    <CommercialName>HUB DISRUPTION COST</CommercialName>
    <Vendor>MMGR</Vendor>
    <Group>IE</Group>
    <GroupDescription>IN-FLIGHT ENTERTAINMENT</GroupDescription>
    <ReasonForIssuance code="G">IN_FLIGHT_SERVICES</ReasonForIssuance>
    <ElectronicMiscDocType code="2">FLIGHT_COUPON_ASSOCIATED</ElectronicMiscDocType>
    <BookingMethod code="BLANK">ANY_ALLOWED</BookingMethod>
  </ns38:AncillaryDefinition>
  <ns38:AncillaryDefinition id="ancillary_19">
    <SubCode>MRS</SubCode>
    <Airline>EY</Airline>
    <CommercialName>MEET AND GREET</CommercialName>
    <Vendor>MMGR</Vendor>
    <Group>IE</Group>
    <GroupDescription>IN-FLIGHT ENTERTAINMENT</GroupDescription>
    <ReasonForIssuance code="I">INDIVIDUAL_AIRLINE_USE</ReasonForIssuance>
    <ElectronicMiscDocType code="2">FLIGHT_COUPON_ASSOCIATED</ElectronicMiscDocType>
    <BookingMethod code="BLANK">ANY_ALLOWED</BookingMethod>
  </ns38:AncillaryDefinition>
  <ns38:AncillaryDefinition id="ancillary_25">
    <SubCode>0B4</SubCode>
    <Airline>EY</Airline>
    <CommercialName>OXYGEN</CommercialName>
    <Vendor>MMGR</Vendor>
    <Group>MD</Group>
    <GroupDescription>MEDICAL</GroupDescription>
    <SubGroup>OX</SubGroup>
    <SubGroupDescription>OXYGEN</SubGroupDescription>
    <ReasonForIssuance code="E">AIRPORT_SERVICES</ReasonForIssuance>
    <ElectronicMiscDocType code="2">FLIGHT_COUPON_ASSOCIATED</ElectronicMiscDocType>
    <BookingMethod code="BLANK">ANY_ALLOWED</BookingMethod>
  </ns38:AncillaryDefinition>
  <ns38:AncillaryDefinition id="ancillary_27">
    <SubCode>01F</SubCode>
    <Airline>EY</Airline>
    <CommercialName>JAPANESE MEAL</CommercialName>
    <Vendor>MMGR</Vendor>
    <Group>ML</Group>
    <GroupDescription>MEAL/BEVERAGE</GroupDescription>
    <ReasonForIssuance code="G">IN_FLIGHT_SERVICES</ReasonForIssuance>
    <ElectronicMiscDocType code="2">FLIGHT_COUPON_ASSOCIATED</ElectronicMiscDocType>
    <BookingMethod code="BLANK">ANY_ALLOWED</BookingMethod>
  </ns38:AncillaryDefinition>
  <ns38:AncillaryDefinition id="ancillary_28">
    <SubCode>0AM</SubCode>
    <Airline>EY</Airline>
    <CommercialName>HOT DINNER</CommercialName>
    <Vendor>MMGR</Vendor>
    <Group>ML</Group>
    <GroupDescription>MEAL/BEVERAGE</GroupDescription>
    <SubGroup>DI</SubGroup>
    <SubGroupDescription>DINNER</SubGroupDescription>
    <ReasonForIssuance code="G">IN_FLIGHT_SERVICES</ReasonForIssuance>
    <ElectronicMiscDocType code="2">FLIGHT_COUPON_ASSOCIATED</ElectronicMiscDocType>
    <BookingMethod code="BLANK">ANY_ALLOWED</BookingMethod>
  </ns38:AncillaryDefinition>
  <ns38:AncillaryDefinition id="ancillary_29">
    <SubCode>01I</SubCode>
    <Airline>EY</Airline>
    <CommercialName>KOREAN MEAL</CommercialName>
    <Vendor>MMGR</Vendor>
    <Group>ML</Group>
    <GroupDescription>MEAL/BEVERAGE</GroupDescription>
    <ReasonForIssuance code="G">IN_FLIGHT_SERVICES</ReasonForIssuance>
    <ElectronicMiscDocType code="2">FLIGHT_COUPON_ASSOCIATED</ElectronicMiscDocType>
    <BookingMethod code="BLANK">ANY_ALLOWED</BookingMethod>
  </ns38:AncillaryDefinition>
  <ns38:AncillaryDefinition id="ancillary_31">
    <SubCode>FAL</SubCode>
    <Airline>EY</Airline>
    <CommercialName>FALCON</CommercialName>
    <Vendor>MMGR</Vendor>
    <Group>PT</Group>
    <GroupDescription>PETS</GroupDescription>
    <ReasonForIssuance code="I">INDIVIDUAL_AIRLINE_USE</ReasonForIssuance>
    <ElectronicMiscDocType code="2">FLIGHT_COUPON_ASSOCIATED</ElectronicMiscDocType>
    <BookingMethod code="BLANK">ANY_ALLOWED</BookingMethod>
  </ns38:AncillaryDefinition>
  <ns38:AncillaryDefinition id="ancillary_33">
    <SubCode>0B5</SubCode>
    <Airline>EY</Airline>
    <CommercialName>PRE RESERVED SEAT ASSIGNMENT</CommercialName>
    <Vendor>ATP</Vendor>
    <Group>SA</Group>
    <GroupDescription>SEAT ASSIGNMENT</GroupDescription>
    <SpecialService>SEAT</SpecialService>
    <ReasonForIssuance code="A">AIR_TRANSPORTATION</ReasonForIssuance>
    <SpecialServiceDetails type="NOTALLOWED"/>
    <ElectronicMiscDocType code="2">FLIGHT_COUPON_ASSOCIATED</ElectronicMiscDocType>
    <BookingMethod code="01">SPECIAL_SERVICE_REQUEST</BookingMethod>
  </ns38:AncillaryDefinition>
  <ns38:AncillaryDefinition id="ancillary_50">
    <SubCode>BHS</SubCode>
    <Airline>EY</Airline>
    <CommercialName>BULKHEAD SEAT SALE</CommercialName>
    <Vendor>MMGR</Vendor>
    <Group>SA</Group>
    <GroupDescription>SEAT ASSIGNMENT</GroupDescription>
    <ReasonForIssuance code="A">AIR_TRANSPORTATION</ReasonForIssuance>
    <ElectronicMiscDocType code="2">FLIGHT_COUPON_ASSOCIATED</ElectronicMiscDocType>
    <BookingMethod code="BLANK">ANY_ALLOWED</BookingMethod>
  </ns38:AncillaryDefinition>
  <ns38:AncillaryDefinition id="ancillary_69">
    <SubCode>0BV</SubCode>
    <Airline>EY</Airline>
    <CommercialName>STANDBY</CommercialName>
    <Vendor>MMGR</Vendor>
    <Group>SB</Group>
    <GroupDescription>STANDBY</GroupDescription>
    <ReasonForIssuance code="B">GROUND_TRANSPORT_NON_AIR_SERVICES</ReasonForIssuance>
    <ElectronicMiscDocType code="2">FLIGHT_COUPON_ASSOCIATED</ElectronicMiscDocType>
    <BookingMethod code="BLANK">ANY_ALLOWED</BookingMethod>
  </ns38:AncillaryDefinition>
  <ns38:AncillaryDefinition id="ancillary_70">
    <SubCode>0CP</SubCode>
    <Airline>EY</Airline>
    <CommercialName>STANDBY CONFIRMED</CommercialName>
    <Vendor>MMGR</Vendor>
    <Group>SB</Group>
    <GroupDescription>STANDBY</GroupDescription>
    <SubGroup>CF</SubGroup>
    <SubGroupDescription>CONFIRMED</SubGroupDescription>
    <ReasonForIssuance code="B">GROUND_TRANSPORT_NON_AIR_SERVICES</ReasonForIssuance>
    <ElectronicMiscDocType code="2">FLIGHT_COUPON_ASSOCIATED</ElectronicMiscDocType>
    <BookingMethod code="BLANK">ANY_ALLOWED</BookingMethod>
  </ns38:AncillaryDefinition>
  <ns38:AncillaryDefinition id="ancillary_73">
    <SubCode>03P</SubCode>
    <Airline>EY</Airline>
    <CommercialName>PRIORITY ACCESS</CommercialName>
    <Vendor>ATP</Vendor>
    <Group>TS</Group>
    <GroupDescription>TRAVEL SERVICES</GroupDescription>
    <SubGroup>PO</SubGroup>
    <SubGroupDescription>PRIORITY CHECK IN</SubGroupDescription>
    <SpecialService>ASVC</SpecialService>
    <ReasonForIssuance code="E">AIRPORT_SERVICES</ReasonForIssuance>
    <SpecialServiceDetails type="NOTALLOWED"/>
    <ElectronicMiscDocType code="2">FLIGHT_COUPON_ASSOCIATED</ElectronicMiscDocType>
    <BookingMethod code="01">SPECIAL_SERVICE_REQUEST</BookingMethod>
  </ns38:AncillaryDefinition>
  <ns38:AncillaryDefinition id="ancillary_74">
    <SubCode>0BG</SubCode>
    <Airline>EY</Airline>
    <CommercialName>TRIP INSURANCE</CommercialName>
    <Vendor>MMGR</Vendor>
    <Group>TS</Group>
    <GroupDescription>TRAVEL SERVICES</GroupDescription>
    <SubGroup>TI</SubGroup>
    <SubGroupDescription>TRIP INSURANCE</SubGroupDescription>
    <ReasonForIssuance code="D">FINANCIAL_IMPACT</ReasonForIssuance>
    <ElectronicMiscDocType code="2">FLIGHT_COUPON_ASSOCIATED</ElectronicMiscDocType>
    <BookingMethod code="BLANK">ANY_ALLOWED</BookingMethod>
  </ns38:AncillaryDefinition>
  <ns38:AncillaryDefinition id="ancillary_77">
    <SubCode>AUP</SubCode>
    <Airline>EY</Airline>
    <CommercialName>AIRPORT UPGRADE PROMO RATE</CommercialName>
    <Vendor>MMGR</Vendor>
    <Group>UP</Group>
    <GroupDescription>UPGRADES</GroupDescription>
    <ReasonForIssuance code="A">AIR_TRANSPORTATION</ReasonForIssuance>
    <ElectronicMiscDocType code="2">FLIGHT_COUPON_ASSOCIATED</ElectronicMiscDocType>
    <BookingMethod code="BLANK">ANY_ALLOWED</BookingMethod>
  </ns38:AncillaryDefinition>
  <ns38:AncillaryDefinition id="ancillary_79">
    <SubCode>0C1</SubCode>
    <Airline>EY</Airline>
    <CommercialName>UPTO33LB 15KG BAGGAGE</CommercialName>
    <Vendor>ATP</Vendor>
    <Description1>
      <Description1Code>15</Description1Code>
      <Description1Text>UP TO 33 POUNDS/15 KILOGRAMS</Description1Text>
    </Description1>
    <Group>BG</Group>
    <GroupDescription>BAGGAGE</GroupDescription>
    <BaggageWeightLimit>
      <Weight unit="KILO">15</Weight>
      <LimitType>U</LimitType>
    </BaggageWeightLimit>
    <BaggageWeightLimit>
      <Weight unit="POUND">33</Weight>
      <LimitType>U</LimitType>
    </BaggageWeightLimit>
    <SpecialService>ASVC</SpecialService>
    <ReasonForIssuance code="C">BAGGAGE</ReasonForIssuance>
    <SpecialServiceDetails type="NOTALLOWED"/>
    <ElectronicMiscDocType code="2">FLIGHT_COUPON_ASSOCIATED</ElectronicMiscDocType>
    <BookingMethod code="01">SPECIAL_SERVICE_REQUEST</BookingMethod>
  </ns38:AncillaryDefinition>
  <ns38:AncillaryDefinition id="ancillary_81">
    <SubCode>0C2</SubCode>
    <Airline>EY</Airline>
    <CommercialName>UPTO44LB 20KG BAGGAGE</CommercialName>
    <Vendor>ATP</Vendor>
    <Description1>
      <Description1Code>20</Description1Code>
      <Description1Text>UP TO 44 POUNDS/20 KILOGRAMS</Description1Text>
    </Description1>
    <Group>BG</Group>
    <GroupDescription>BAGGAGE</GroupDescription>
    <BaggageWeightLimit>
      <Weight unit="KILO">20</Weight>
      <LimitType>U</LimitType>
    </BaggageWeightLimit>
    <BaggageWeightLimit>
      <Weight unit="POUND">44</Weight>
      <LimitType>U</LimitType>
    </BaggageWeightLimit>
    <SpecialService>ASVC</SpecialService>
    <ReasonForIssuance code="C">BAGGAGE</ReasonForIssuance>
    <SpecialServiceDetails type="NOTALLOWED"/>
    <ElectronicMiscDocType code="2">FLIGHT_COUPON_ASSOCIATED</ElectronicMiscDocType>
    <BookingMethod code="01">SPECIAL_SERVICE_REQUEST</BookingMethod>
  </ns38:AncillaryDefinition>
  <ns38:AncillaryDefinition id="ancillary_83">
    <SubCode>0C4</SubCode>
    <Airline>EY</Airline>
    <CommercialName>UPTO55LB 25KG BAGGAGE</CommercialName>
    <Vendor>ATP</Vendor>
    <Description1>
      <Description1Code>25</Description1Code>
      <Description1Text>UP TO 55 POUNDS/25 KILOGRAMS</Description1Text>
    </Description1>
    <Group>BG</Group>
    <GroupDescription>BAGGAGE</GroupDescription>
    <BaggageWeightLimit>
      <Weight unit="KILO">25</Weight>
      <LimitType>U</LimitType>
    </BaggageWeightLimit>
    <BaggageWeightLimit>
      <Weight unit="POUND">55</Weight>
      <LimitType>U</LimitType>
    </BaggageWeightLimit>
    <SpecialService>ASVC</SpecialService>
    <ReasonForIssuance code="C">BAGGAGE</ReasonForIssuance>
    <SpecialServiceDetails type="NOTALLOWED"/>
    <ElectronicMiscDocType code="2">FLIGHT_COUPON_ASSOCIATED</ElectronicMiscDocType>
    <BookingMethod code="01">SPECIAL_SERVICE_REQUEST</BookingMethod>
  </ns38:AncillaryDefinition>
  <ns38:AncillaryDefinition id="ancillary_85">
    <SubCode>0C5</SubCode>
    <Airline>EY</Airline>
    <CommercialName>UPTO66LB 30KG BAGGAGE</CommercialName>
    <Vendor>ATP</Vendor>
    <Description1>
      <Description1Code>30</Description1Code>
      <Description1Text>UP TO 66 POUNDS/30 KILOGRAMS</Description1Text>
    </Description1>
    <Group>BG</Group>
    <GroupDescription>BAGGAGE</GroupDescription>
    <BaggageWeightLimit>
      <Weight unit="KILO">30</Weight>
      <LimitType>U</LimitType>
    </BaggageWeightLimit>
    <BaggageWeightLimit>
      <Weight unit="POUND">66</Weight>
      <LimitType>U</LimitType>
    </BaggageWeightLimit>
    <SpecialService>ASVC</SpecialService>
    <ReasonForIssuance code="C">BAGGAGE</ReasonForIssuance>
    <SpecialServiceDetails type="NOTALLOWED"/>
    <ElectronicMiscDocType code="2">FLIGHT_COUPON_ASSOCIATED</ElectronicMiscDocType>
    <BookingMethod code="01">SPECIAL_SERVICE_REQUEST</BookingMethod>
  </ns38:AncillaryDefinition>
  <ns38:AncillaryDefinition id="ancillary_87">
    <SubCode>0C7</SubCode>
    <Airline>EY</Airline>
    <CommercialName>UPTO35KG BAGGAGE</CommercialName>
    <Vendor>ATP</Vendor>
    <Description1>
      <Description1Code>35</Description1Code>
      <Description1Text>UP TO 77 POUNDS/35 KILOGRAMS</Description1Text>
    </Description1>
    <Group>BG</Group>
    <GroupDescription>BAGGAGE</GroupDescription>
    <BaggageWeightLimit>
      <Weight unit="KILO">35</Weight>
      <LimitType>U</LimitType>
    </BaggageWeightLimit>
    <BaggageWeightLimit>
      <Weight unit="POUND">77</Weight>
      <LimitType>U</LimitType>
    </BaggageWeightLimit>
    <SpecialService>ASVC</SpecialService>
    <ReasonForIssuance code="C">BAGGAGE</ReasonForIssuance>
    <SpecialServiceDetails type="NOTALLOWED"/>
    <ElectronicMiscDocType code="2">FLIGHT_COUPON_ASSOCIATED</ElectronicMiscDocType>
    <BookingMethod code="01">SPECIAL_SERVICE_REQUEST</BookingMethod>
  </ns38:AncillaryDefinition>
  <ns38:AncillaryDefinition id="ancillary_89">
    <SubCode>0CW</SubCode>
    <Airline>EY</Airline>
    <CommercialName>UPTO11LB 5KG BAGGAGE</CommercialName>
    <Vendor>ATP</Vendor>
    <Description1>
      <Description1Code>05</Description1Code>
      <Description1Text>UP TO 11 POUNDS/5 KILOGRAMS</Description1Text>
    </Description1>
    <Group>BG</Group>
    <GroupDescription>BAGGAGE</GroupDescription>
    <BaggageWeightLimit>
      <Weight unit="KILO">5</Weight>
      <LimitType>U</LimitType>
    </BaggageWeightLimit>
    <BaggageWeightLimit>
      <Weight unit="POUND">11</Weight>
      <LimitType>U</LimitType>
    </BaggageWeightLimit>
    <SpecialService>ASVC</SpecialService>
    <ReasonForIssuance code="C">BAGGAGE</ReasonForIssuance>
    <SpecialServiceDetails type="NOTALLOWED"/>
    <ElectronicMiscDocType code="2">FLIGHT_COUPON_ASSOCIATED</ElectronicMiscDocType>
    <BookingMethod code="01">SPECIAL_SERVICE_REQUEST</BookingMethod>
  </ns38:AncillaryDefinition>
  <ns38:AncillaryDefinition id="ancillary_91">
    <SubCode>0CZ</SubCode>
    <Airline>EY</Airline>
    <CommercialName>UPTO22LB 10KG BAGGAGE</CommercialName>
    <Vendor>ATP</Vendor>
    <Description1>
      <Description1Code>10</Description1Code>
      <Description1Text>UP TO 22 POUNDS/10 KILOGRAMS</Description1Text>
    </Description1>
    <Group>BG</Group>
    <GroupDescription>BAGGAGE</GroupDescription>
    <BaggageWeightLimit>
      <Weight unit="KILO">10</Weight>
      <LimitType>U</LimitType>
    </BaggageWeightLimit>
    <BaggageWeightLimit>
      <Weight unit="POUND">22</Weight>
      <LimitType>U</LimitType>
    </BaggageWeightLimit>
    <SpecialService>ASVC</SpecialService>
    <ReasonForIssuance code="C">BAGGAGE</ReasonForIssuance>
    <SpecialServiceDetails type="NOTALLOWED"/>
    <ElectronicMiscDocType code="2">FLIGHT_COUPON_ASSOCIATED</ElectronicMiscDocType>
    <BookingMethod code="01">SPECIAL_SERVICE_REQUEST</BookingMethod>
  </ns38:AncillaryDefinition>
  <ns38:AncillaryDefinition id="ancillary_94">
    <SubCode>0DG</SubCode>
    <Airline>EY</Airline>
    <CommercialName>WEIGHT SYSTEM CHARGE</CommercialName>
    <Vendor>ATP</Vendor>
    <Description1>
      <Description1Code>WT</Description1Code>
      <Description1Text>WEIGHT SYSTEM CHARGE</Description1Text>
    </Description1>
    <Group>BG</Group>
    <GroupDescription>BAGGAGE</GroupDescription>
    <SubGroup>XS</SubGroup>
    <SubGroupDescription>BAGGAGE EXCESS</SubGroupDescription>
    <SpecialService>ASVC</SpecialService>
    <ReasonForIssuance code="C">BAGGAGE</ReasonForIssuance>
    <SpecialServiceDetails type="NOTALLOWED"/>
    <ElectronicMiscDocType code="2">FLIGHT_COUPON_ASSOCIATED</ElectronicMiscDocType>
    <BookingMethod code="01">SPECIAL_SERVICE_REQUEST</BookingMethod>
  </ns38:AncillaryDefinition>
  <ns38:AncillaryDefinition id="ancillary_1">
    <SubCode>BU1</SubCode>
    <Airline>EY</Airline>
    <CommercialName>Bundle Bag and Seat EY DOM</CommercialName>
    <Vendor>MMGR</Vendor>
    <Group>BD</Group>
    <GroupDescription>BUNDLED SERVICES</GroupDescription>
    <ReasonForIssuance code="E">AIRPORT_SERVICES</ReasonForIssuance>
    <ElectronicMiscDocType code="2">FLIGHT_COUPON_ASSOCIATED</ElectronicMiscDocType>
    <BookingMethod code="BLANK">ANY_ALLOWED</BookingMethod>
    <ConsumedAtIssuanceIndicator>false</ConsumedAtIssuanceIndicator>
  </ns38:AncillaryDefinition>
  <ns38:AncillaryDefinition id="ancillary_301">
    <SubCode>0B0</SubCode>
    <Airline>EY</Airline>
    <CommercialName>UNACCOMPANIED MINOR FEE INTL</CommercialName>
    <Vendor>MMGR</Vendor>
    <Group>UN</Group>
    <GroupDescription>UNACCOMPANIED TRAVEL ESCORT</GroupDescription>
    <SubGroup>MR</SubGroup>
    <SubGroupDescription>UNACCOMPANIED MINOR</SubGroupDescription>
    <ReasonForIssuance code="E">AIRPORT_SERVICES</ReasonForIssuance>
    <ElectronicMiscDocType code="2">FLIGHT_COUPON_ASSOCIATED</ElectronicMiscDocType>
    <BookingMethod code="BLANK">ANY_ALLOWED</BookingMethod>
  </ns38:AncillaryDefinition>
  <ns38:Ancillary ancillaryDefinitionRef="ancillary_5" ancillaryId="ancillary_ancillary_5">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>2000</SequenceNumber>
    <TravelDateEffective>2013-08-01</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>PAYMENT_REQUIRED</AirExtraStatus>
    <Footnote>X</Footnote>
  </ns38:Ancillary>
  <ns38:Ancillary ancillaryDefinitionRef="ancillary_6" ancillaryId="ancillary_ancillary_6">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>1000</SequenceNumber>
    <TravelDateEffective>2014-12-05</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>PAYMENT_REQUIRED</AirExtraStatus>
    <Footnote>N</Footnote>
  </ns38:Ancillary>
  <ns38:Ancillary ancillaryDefinitionRef="ancillary_9" ancillaryId="ancillary_ancillary_9">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>1000</SequenceNumber>
    <TravelDateEffective>2018-02-20</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>CONFIRMED</AirExtraStatus>
    <Footnote/>
  </ns38:Ancillary>
  <ns38:Ancillary ancillaryDefinitionRef="ancillary_10" ancillaryId="ancillary_ancillary_10">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>42000</SequenceNumber>
    <TravelDateEffective>2013-06-13</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>PAYMENT_REQUIRED</AirExtraStatus>
    <Footnote>N</Footnote>
  </ns38:Ancillary>
  <ns38:Ancillary ancillaryDefinitionRef="ancillary_11" ancillaryId="ancillary_ancillary_11">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>2000</SequenceNumber>
    <TravelDateEffective>2017-02-22</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>CONFIRMED</AirExtraStatus>
    <Footnote/>
  </ns38:Ancillary>
  <ns38:Ancillary ancillaryDefinitionRef="ancillary_12" ancillaryId="ancillary_ancillary_12">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>1000</SequenceNumber>
    <TravelDateEffective>2018-12-05</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>PAYMENT_REQUIRED</AirExtraStatus>
    <Footnote>N</Footnote>
  </ns38:Ancillary>
  <ns38:Ancillary ancillaryDefinitionRef="ancillary_13" ancillaryId="ancillary_ancillary_13">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>1000</SequenceNumber>
    <TravelDateEffective>2018-11-25</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>CONFIRMED</AirExtraStatus>
    <Footnote>N</Footnote>
  </ns38:Ancillary>
  <ns38:Ancillary ancillaryDefinitionRef="ancillary_14" ancillaryId="ancillary_ancillary_14">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>62000</SequenceNumber>
    <TravelDateEffective>2013-02-28</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>PAYMENT_REQUIRED</AirExtraStatus>
    <Footnote>N</Footnote>
  </ns38:Ancillary>
  <ns38:Ancillary ancillaryDefinitionRef="ancillary_15" ancillaryId="ancillary_ancillary_15">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>1000</SequenceNumber>
    <TravelDateEffective>2014-09-03</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>NO_AE</AirExtraStatus>
    <Footnote>*</Footnote>
  </ns38:Ancillary>
  <ns38:Ancillary ancillaryDefinitionRef="ancillary_17" ancillaryId="ancillary_ancillary_17">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>37000</SequenceNumber>
    <TravelDateEffective>2018-09-27</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>PAYMENT_REQUIRED</AirExtraStatus>
    <Footnote>N</Footnote>
  </ns38:Ancillary>
  <ns38:Ancillary ancillaryDefinitionRef="ancillary_10" ancillaryId="ancillary_ancillary_18">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>82000</SequenceNumber>
    <TravelDateEffective>2013-03-19</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>PAYMENT_REQUIRED</AirExtraStatus>
    <Footnote>N</Footnote>
  </ns38:Ancillary>
  <ns38:Ancillary ancillaryDefinitionRef="ancillary_19" ancillaryId="ancillary_ancillary_19">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>1000</SequenceNumber>
    <TravelDateEffective>2018-10-24</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>PAYMENT_REQUIRED</AirExtraStatus>
    <Footnote>/</Footnote>
  </ns38:Ancillary>
  <ns38:Ancillary ancillaryDefinitionRef="ancillary_25" ancillaryId="ancillary_ancillary_25">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>1000</SequenceNumber>
    <TravelDateEffective>2016-06-06</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>PAYMENT_REQUIRED</AirExtraStatus>
    <Footnote>X</Footnote>
  </ns38:Ancillary>
  <ns38:Ancillary ancillaryDefinitionRef="ancillary_27" ancillaryId="ancillary_ancillary_27">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>1000</SequenceNumber>
    <TravelDateEffective>2013-08-14</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>PAYMENT_REQUIRED</AirExtraStatus>
    <Footnote/>
  </ns38:Ancillary>
  <ns38:Ancillary ancillaryDefinitionRef="ancillary_28" ancillaryId="ancillary_ancillary_28">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>1000</SequenceNumber>
    <TravelDateEffective>2016-02-09</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>PAYMENT_REQUIRED</AirExtraStatus>
    <Footnote>/</Footnote>
  </ns38:Ancillary>
  <ns38:Ancillary ancillaryDefinitionRef="ancillary_29" ancillaryId="ancillary_ancillary_29">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>1000</SequenceNumber>
    <TravelDateEffective>2013-08-14</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>PAYMENT_REQUIRED</AirExtraStatus>
    <Footnote>-</Footnote>
  </ns38:Ancillary>
  <ns38:Ancillary ancillaryDefinitionRef="ancillary_31" ancillaryId="ancillary_ancillary_31">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>P</SectorPortionInd>
    <SequenceNumber>5000</SequenceNumber>
    <TravelDateEffective>2017-06-20</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>PAYMENT_REQUIRED</AirExtraStatus>
    <Footnote>X</Footnote>
  </ns38:Ancillary>
  <ns38:Ancillary ancillaryDefinitionRef="ancillary_33" ancillaryId="ancillary_ancillary_33">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>293130</SequenceNumber>
    <TravelDateEffective>1980-01-01</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>PAYMENT_REQUIRED</AirExtraStatus>
    <PADIS_SeatProcessing>
      <PADIS_CodeTableInfo>
        <Characteristic>
          <Code>CH</Code>
          <TranslatedName>CHARGEABLE</TranslatedName>
          <AbbreviatedName>PAID</AbbreviatedName>
        </Characteristic>
        <Characteristic>
          <Code>E</Code>
          <TranslatedName>EXIT</TranslatedName>
          <AbbreviatedName>EXIT</AbbreviatedName>
        </Characteristic>
      </PADIS_CodeTableInfo>
    </PADIS_SeatProcessing>
    <Footnote>@</Footnote>
  </ns38:Ancillary>
  <ns38:Ancillary ancillaryDefinitionRef="ancillary_33" ancillaryId="ancillary_ancillary_34">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>331630</SequenceNumber>
    <TravelDateEffective>1980-01-01</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>PAYMENT_REQUIRED</AirExtraStatus>
    <PADIS_SeatProcessing>
      <PADIS_CodeTableInfo>
        <Characteristic>
          <Code>CH</Code>
          <TranslatedName>CHARGEABLE</TranslatedName>
          <AbbreviatedName>PAID</AbbreviatedName>
        </Characteristic>
        <Characteristic>
          <Code>L</Code>
          <TranslatedName>LEG SPACE</TranslatedName>
          <AbbreviatedName>LEGSP</AbbreviatedName>
        </Characteristic>
      </PADIS_CodeTableInfo>
    </PADIS_SeatProcessing>
    <Footnote>@</Footnote>
  </ns38:Ancillary>
  <ns38:Ancillary ancillaryDefinitionRef="ancillary_33" ancillaryId="ancillary_ancillary_35">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>546130</SequenceNumber>
    <TravelDateEffective>1980-01-01</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>PAYMENT_REQUIRED</AirExtraStatus>
    <PADIS_SeatProcessing>
      <PADIS_CodeTableInfo>
        <Characteristic>
          <Code>CH</Code>
          <TranslatedName>CHARGEABLE</TranslatedName>
          <AbbreviatedName>PAID</AbbreviatedName>
        </Characteristic>
        <Characteristic>
          <Code>O</Code>
          <TranslatedName>PREFERRED</TranslatedName>
          <AbbreviatedName>PRFST</AbbreviatedName>
        </Characteristic>
      </PADIS_CodeTableInfo>
    </PADIS_SeatProcessing>
    <Footnote>@</Footnote>
  </ns38:Ancillary>
  <ns38:Ancillary ancillaryDefinitionRef="ancillary_33" ancillaryId="ancillary_ancillary_36">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>570630</SequenceNumber>
    <TravelDateEffective>1980-01-01</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>CONFIRMED</AirExtraStatus>
    <PADIS_SeatProcessing>
      <PADIS_CodeTableInfo>
        <Characteristic>
          <Code>CH</Code>
          <TranslatedName>CHARGEABLE</TranslatedName>
          <AbbreviatedName>PAID</AbbreviatedName>
        </Characteristic>
        <Characteristic>
          <Code>W</Code>
          <TranslatedName>WINDOW</TranslatedName>
          <AbbreviatedName>WIND</AbbreviatedName>
        </Characteristic>
      </PADIS_CodeTableInfo>
    </PADIS_SeatProcessing>
    <Footnote>@</Footnote>
  </ns38:Ancillary>
  <ns38:Ancillary ancillaryDefinitionRef="ancillary_33" ancillaryId="ancillary_ancillary_37">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>571130</SequenceNumber>
    <TravelDateEffective>1980-01-01</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>CONFIRMED</AirExtraStatus>
    <PADIS_SeatProcessing>
      <PADIS_CodeTableInfo>
        <Characteristic>
          <Code>CH</Code>
          <TranslatedName>CHARGEABLE</TranslatedName>
          <AbbreviatedName>PAID</AbbreviatedName>
        </Characteristic>
        <Characteristic>
          <Code>W</Code>
          <TranslatedName>WINDOW</TranslatedName>
          <AbbreviatedName>WIND</AbbreviatedName>
        </Characteristic>
      </PADIS_CodeTableInfo>
    </PADIS_SeatProcessing>
    <Footnote>@</Footnote>
  </ns38:Ancillary>
  <ns38:Ancillary ancillaryDefinitionRef="ancillary_33" ancillaryId="ancillary_ancillary_38">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>572630</SequenceNumber>
    <TravelDateEffective>1980-01-01</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>CONFIRMED</AirExtraStatus>
    <PADIS_SeatProcessing>
      <PADIS_CodeTableInfo>
        <Characteristic>
          <Code>A</Code>
          <TranslatedName>AISLE</TranslatedName>
          <AbbreviatedName>AISLE</AbbreviatedName>
        </Characteristic>
        <Characteristic>
          <Code>CH</Code>
          <TranslatedName>CHARGEABLE</TranslatedName>
          <AbbreviatedName>PAID</AbbreviatedName>
        </Characteristic>
      </PADIS_CodeTableInfo>
    </PADIS_SeatProcessing>
    <Footnote>@</Footnote>
  </ns38:Ancillary>
  <ns38:Ancillary ancillaryDefinitionRef="ancillary_33" ancillaryId="ancillary_ancillary_39">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>573130</SequenceNumber>
    <TravelDateEffective>1980-01-01</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>CONFIRMED</AirExtraStatus>
    <PADIS_SeatProcessing>
      <PADIS_CodeTableInfo>
        <Characteristic>
          <Code>A</Code>
          <TranslatedName>AISLE</TranslatedName>
          <AbbreviatedName>AISLE</AbbreviatedName>
        </Characteristic>
        <Characteristic>
          <Code>CH</Code>
          <TranslatedName>CHARGEABLE</TranslatedName>
          <AbbreviatedName>PAID</AbbreviatedName>
        </Characteristic>
      </PADIS_CodeTableInfo>
    </PADIS_SeatProcessing>
    <Footnote>@</Footnote>
  </ns38:Ancillary>
  <ns38:Ancillary ancillaryDefinitionRef="ancillary_33" ancillaryId="ancillary_ancillary_40">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>574630</SequenceNumber>
    <TravelDateEffective>1980-01-01</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>CONFIRMED</AirExtraStatus>
    <PADIS_SeatProcessing>
      <PADIS_CodeTableInfo>
        <Characteristic>
          <Code>CH</Code>
          <TranslatedName>CHARGEABLE</TranslatedName>
          <AbbreviatedName>PAID</AbbreviatedName>
        </Characteristic>
      </PADIS_CodeTableInfo>
    </PADIS_SeatProcessing>
    <Footnote>@</Footnote>
  </ns38:Ancillary>
  <ns38:Ancillary ancillaryDefinitionRef="ancillary_33" ancillaryId="ancillary_ancillary_41">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>575130</SequenceNumber>
    <TravelDateEffective>1980-01-01</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>CONFIRMED</AirExtraStatus>
    <PADIS_SeatProcessing>
      <PADIS_CodeTableInfo>
        <Characteristic>
          <Code>CH</Code>
          <TranslatedName>CHARGEABLE</TranslatedName>
          <AbbreviatedName>PAID</AbbreviatedName>
        </Characteristic>
      </PADIS_CodeTableInfo>
    </PADIS_SeatProcessing>
    <Footnote>@</Footnote>
  </ns38:Ancillary>
  <ns38:Ancillary ancillaryDefinitionRef="ancillary_33" ancillaryId="ancillary_ancillary_42">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>690380</SequenceNumber>
    <TravelDateEffective>1980-01-01</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>CONFIRMED</AirExtraStatus>
    <PADIS_SeatProcessing>
      <PADIS_CodeTableInfo>
        <Characteristic>
          <Code>CH</Code>
          <TranslatedName>CHARGEABLE</TranslatedName>
          <AbbreviatedName>PAID</AbbreviatedName>
        </Characteristic>
        <Characteristic>
          <Code>O</Code>
          <TranslatedName>PREFERRED</TranslatedName>
          <AbbreviatedName>PRFST</AbbreviatedName>
        </Characteristic>
      </PADIS_CodeTableInfo>
    </PADIS_SeatProcessing>
    <Footnote>@</Footnote>
  </ns38:Ancillary>
  <ns38:Ancillary ancillaryDefinitionRef="ancillary_33" ancillaryId="ancillary_ancillary_43">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>690880</SequenceNumber>
    <TravelDateEffective>1980-01-01</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>CONFIRMED</AirExtraStatus>
    <PADIS_SeatProcessing>
      <PADIS_CodeTableInfo>
        <Characteristic>
          <Code>CH</Code>
          <TranslatedName>CHARGEABLE</TranslatedName>
          <AbbreviatedName>PAID</AbbreviatedName>
        </Characteristic>
        <Characteristic>
          <Code>W</Code>
          <TranslatedName>WINDOW</TranslatedName>
          <AbbreviatedName>WIND</AbbreviatedName>
        </Characteristic>
      </PADIS_CodeTableInfo>
    </PADIS_SeatProcessing>
    <Footnote>@</Footnote>
  </ns38:Ancillary>
  <ns38:Ancillary ancillaryDefinitionRef="ancillary_33" ancillaryId="ancillary_ancillary_44">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>691380</SequenceNumber>
    <TravelDateEffective>1980-01-01</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>CONFIRMED</AirExtraStatus>
    <PADIS_SeatProcessing>
      <PADIS_CodeTableInfo>
        <Characteristic>
          <Code>A</Code>
          <TranslatedName>AISLE</TranslatedName>
          <AbbreviatedName>AISLE</AbbreviatedName>
        </Characteristic>
        <Characteristic>
          <Code>CH</Code>
          <TranslatedName>CHARGEABLE</TranslatedName>
          <AbbreviatedName>PAID</AbbreviatedName>
        </Characteristic>
      </PADIS_CodeTableInfo>
    </PADIS_SeatProcessing>
    <Footnote>@</Footnote>
  </ns38:Ancillary>
  <ns38:Ancillary ancillaryDefinitionRef="ancillary_33" ancillaryId="ancillary_ancillary_45">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>691880</SequenceNumber>
    <TravelDateEffective>1980-01-01</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>CONFIRMED</AirExtraStatus>
    <PADIS_SeatProcessing>
      <PADIS_CodeTableInfo>
        <Characteristic>
          <Code>CH</Code>
          <TranslatedName>CHARGEABLE</TranslatedName>
          <AbbreviatedName>PAID</AbbreviatedName>
        </Characteristic>
      </PADIS_CodeTableInfo>
    </PADIS_SeatProcessing>
    <Footnote>@</Footnote>
  </ns38:Ancillary>
  <ns38:Ancillary ancillaryDefinitionRef="ancillary_33" ancillaryId="ancillary_ancillary_46">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>692380</SequenceNumber>
    <TravelDateEffective>1980-01-01</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>CONFIRMED</AirExtraStatus>
    <PADIS_SeatProcessing>
      <PADIS_CodeTableInfo>
        <Characteristic>
          <Code>CH</Code>
          <TranslatedName>CHARGEABLE</TranslatedName>
          <AbbreviatedName>PAID</AbbreviatedName>
        </Characteristic>
        <Characteristic>
          <Code>O</Code>
          <TranslatedName>PREFERRED</TranslatedName>
          <AbbreviatedName>PRFST</AbbreviatedName>
        </Characteristic>
      </PADIS_CodeTableInfo>
    </PADIS_SeatProcessing>
    <Footnote>@</Footnote>
  </ns38:Ancillary>
  <ns38:Ancillary ancillaryDefinitionRef="ancillary_33" ancillaryId="ancillary_ancillary_47">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>692880</SequenceNumber>
    <TravelDateEffective>1980-01-01</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>CONFIRMED</AirExtraStatus>
    <PADIS_SeatProcessing>
      <PADIS_CodeTableInfo>
        <Characteristic>
          <Code>CH</Code>
          <TranslatedName>CHARGEABLE</TranslatedName>
          <AbbreviatedName>PAID</AbbreviatedName>
        </Characteristic>
        <Characteristic>
          <Code>W</Code>
          <TranslatedName>WINDOW</TranslatedName>
          <AbbreviatedName>WIND</AbbreviatedName>
        </Characteristic>
      </PADIS_CodeTableInfo>
    </PADIS_SeatProcessing>
    <Footnote>@</Footnote>
  </ns38:Ancillary>
  <ns38:Ancillary ancillaryDefinitionRef="ancillary_33" ancillaryId="ancillary_ancillary_48">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>693380</SequenceNumber>
    <TravelDateEffective>1980-01-01</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>CONFIRMED</AirExtraStatus>
    <PADIS_SeatProcessing>
      <PADIS_CodeTableInfo>
        <Characteristic>
          <Code>A</Code>
          <TranslatedName>AISLE</TranslatedName>
          <AbbreviatedName>AISLE</AbbreviatedName>
        </Characteristic>
        <Characteristic>
          <Code>CH</Code>
          <TranslatedName>CHARGEABLE</TranslatedName>
          <AbbreviatedName>PAID</AbbreviatedName>
        </Characteristic>
      </PADIS_CodeTableInfo>
    </PADIS_SeatProcessing>
    <Footnote>@</Footnote>
  </ns38:Ancillary>
  <ns38:Ancillary ancillaryDefinitionRef="ancillary_33" ancillaryId="ancillary_ancillary_49">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>693880</SequenceNumber>
    <TravelDateEffective>1980-01-01</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>CONFIRMED</AirExtraStatus>
    <PADIS_SeatProcessing>
      <PADIS_CodeTableInfo>
        <Characteristic>
          <Code>CH</Code>
          <TranslatedName>CHARGEABLE</TranslatedName>
          <AbbreviatedName>PAID</AbbreviatedName>
        </Characteristic>
      </PADIS_CodeTableInfo>
    </PADIS_SeatProcessing>
    <Footnote>@</Footnote>
  </ns38:Ancillary>
  <ns38:Ancillary ancillaryDefinitionRef="ancillary_50" ancillaryId="ancillary_ancillary_50">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>23000</SequenceNumber>
    <TravelDateEffective>2018-04-02</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>PAYMENT_REQUIRED</AirExtraStatus>
    <Footnote>@</Footnote>
  </ns38:Ancillary>
  <ns38:Ancillary ancillaryDefinitionRef="ancillary_33" ancillaryId="ancillary_ancillary_54">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>571630</SequenceNumber>
    <TravelDateEffective>1980-01-01</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>CONFIRMED</AirExtraStatus>
    <PADIS_SeatProcessing>
      <PADIS_CodeTableInfo>
        <Characteristic>
          <Code>CH</Code>
          <TranslatedName>CHARGEABLE</TranslatedName>
          <AbbreviatedName>PAID</AbbreviatedName>
        </Characteristic>
        <Characteristic>
          <Code>W</Code>
          <TranslatedName>WINDOW</TranslatedName>
          <AbbreviatedName>WIND</AbbreviatedName>
        </Characteristic>
      </PADIS_CodeTableInfo>
    </PADIS_SeatProcessing>
    <Footnote>@</Footnote>
  </ns38:Ancillary>
  <ns38:Ancillary ancillaryDefinitionRef="ancillary_33" ancillaryId="ancillary_ancillary_55">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>572130</SequenceNumber>
    <TravelDateEffective>1980-01-01</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>CONFIRMED</AirExtraStatus>
    <PADIS_SeatProcessing>
      <PADIS_CodeTableInfo>
        <Characteristic>
          <Code>CH</Code>
          <TranslatedName>CHARGEABLE</TranslatedName>
          <AbbreviatedName>PAID</AbbreviatedName>
        </Characteristic>
        <Characteristic>
          <Code>W</Code>
          <TranslatedName>WINDOW</TranslatedName>
          <AbbreviatedName>WIND</AbbreviatedName>
        </Characteristic>
      </PADIS_CodeTableInfo>
    </PADIS_SeatProcessing>
    <Footnote>@</Footnote>
  </ns38:Ancillary>
  <ns38:Ancillary ancillaryDefinitionRef="ancillary_33" ancillaryId="ancillary_ancillary_56">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>573630</SequenceNumber>
    <TravelDateEffective>1980-01-01</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>CONFIRMED</AirExtraStatus>
    <PADIS_SeatProcessing>
      <PADIS_CodeTableInfo>
        <Characteristic>
          <Code>A</Code>
          <TranslatedName>AISLE</TranslatedName>
          <AbbreviatedName>AISLE</AbbreviatedName>
        </Characteristic>
        <Characteristic>
          <Code>CH</Code>
          <TranslatedName>CHARGEABLE</TranslatedName>
          <AbbreviatedName>PAID</AbbreviatedName>
        </Characteristic>
      </PADIS_CodeTableInfo>
    </PADIS_SeatProcessing>
    <Footnote>@</Footnote>
  </ns38:Ancillary>
  <ns38:Ancillary ancillaryDefinitionRef="ancillary_33" ancillaryId="ancillary_ancillary_57">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>574130</SequenceNumber>
    <TravelDateEffective>1980-01-01</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>CONFIRMED</AirExtraStatus>
    <PADIS_SeatProcessing>
      <PADIS_CodeTableInfo>
        <Characteristic>
          <Code>A</Code>
          <TranslatedName>AISLE</TranslatedName>
          <AbbreviatedName>AISLE</AbbreviatedName>
        </Characteristic>
        <Characteristic>
          <Code>CH</Code>
          <TranslatedName>CHARGEABLE</TranslatedName>
          <AbbreviatedName>PAID</AbbreviatedName>
        </Characteristic>
      </PADIS_CodeTableInfo>
    </PADIS_SeatProcessing>
    <Footnote>@</Footnote>
  </ns38:Ancillary>
  <ns38:Ancillary ancillaryDefinitionRef="ancillary_33" ancillaryId="ancillary_ancillary_58">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>575630</SequenceNumber>
    <TravelDateEffective>1980-01-01</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>CONFIRMED</AirExtraStatus>
    <PADIS_SeatProcessing>
      <PADIS_CodeTableInfo>
        <Characteristic>
          <Code>CH</Code>
          <TranslatedName>CHARGEABLE</TranslatedName>
          <AbbreviatedName>PAID</AbbreviatedName>
        </Characteristic>
      </PADIS_CodeTableInfo>
    </PADIS_SeatProcessing>
    <Footnote>@</Footnote>
  </ns38:Ancillary>
  <ns38:Ancillary ancillaryDefinitionRef="ancillary_33" ancillaryId="ancillary_ancillary_59">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>576130</SequenceNumber>
    <TravelDateEffective>1980-01-01</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>CONFIRMED</AirExtraStatus>
    <PADIS_SeatProcessing>
      <PADIS_CodeTableInfo>
        <Characteristic>
          <Code>CH</Code>
          <TranslatedName>CHARGEABLE</TranslatedName>
          <AbbreviatedName>PAID</AbbreviatedName>
        </Characteristic>
      </PADIS_CodeTableInfo>
    </PADIS_SeatProcessing>
    <Footnote>@</Footnote>
  </ns38:Ancillary>
  <ns38:Ancillary ancillaryDefinitionRef="ancillary_33" ancillaryId="ancillary_ancillary_60">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>690630</SequenceNumber>
    <TravelDateEffective>1980-01-01</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>CONFIRMED</AirExtraStatus>
    <PADIS_SeatProcessing>
      <PADIS_CodeTableInfo>
        <Characteristic>
          <Code>CH</Code>
          <TranslatedName>CHARGEABLE</TranslatedName>
          <AbbreviatedName>PAID</AbbreviatedName>
        </Characteristic>
        <Characteristic>
          <Code>O</Code>
          <TranslatedName>PREFERRED</TranslatedName>
          <AbbreviatedName>PRFST</AbbreviatedName>
        </Characteristic>
      </PADIS_CodeTableInfo>
    </PADIS_SeatProcessing>
    <Footnote>@</Footnote>
  </ns38:Ancillary>
  <ns38:Ancillary ancillaryDefinitionRef="ancillary_33" ancillaryId="ancillary_ancillary_61">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>691130</SequenceNumber>
    <TravelDateEffective>1980-01-01</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>CONFIRMED</AirExtraStatus>
    <PADIS_SeatProcessing>
      <PADIS_CodeTableInfo>
        <Characteristic>
          <Code>CH</Code>
          <TranslatedName>CHARGEABLE</TranslatedName>
          <AbbreviatedName>PAID</AbbreviatedName>
        </Characteristic>
        <Characteristic>
          <Code>W</Code>
          <TranslatedName>WINDOW</TranslatedName>
          <AbbreviatedName>WIND</AbbreviatedName>
        </Characteristic>
      </PADIS_CodeTableInfo>
    </PADIS_SeatProcessing>
    <Footnote>@</Footnote>
  </ns38:Ancillary>
  <ns38:Ancillary ancillaryDefinitionRef="ancillary_33" ancillaryId="ancillary_ancillary_62">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>691630</SequenceNumber>
    <TravelDateEffective>1980-01-01</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>CONFIRMED</AirExtraStatus>
    <PADIS_SeatProcessing>
      <PADIS_CodeTableInfo>
        <Characteristic>
          <Code>A</Code>
          <TranslatedName>AISLE</TranslatedName>
          <AbbreviatedName>AISLE</AbbreviatedName>
        </Characteristic>
        <Characteristic>
          <Code>CH</Code>
          <TranslatedName>CHARGEABLE</TranslatedName>
          <AbbreviatedName>PAID</AbbreviatedName>
        </Characteristic>
      </PADIS_CodeTableInfo>
    </PADIS_SeatProcessing>
    <Footnote>@</Footnote>
  </ns38:Ancillary>
  <ns38:Ancillary ancillaryDefinitionRef="ancillary_33" ancillaryId="ancillary_ancillary_63">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>692130</SequenceNumber>
    <TravelDateEffective>1980-01-01</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>CONFIRMED</AirExtraStatus>
    <PADIS_SeatProcessing>
      <PADIS_CodeTableInfo>
        <Characteristic>
          <Code>CH</Code>
          <TranslatedName>CHARGEABLE</TranslatedName>
          <AbbreviatedName>PAID</AbbreviatedName>
        </Characteristic>
      </PADIS_CodeTableInfo>
    </PADIS_SeatProcessing>
    <Footnote>@</Footnote>
  </ns38:Ancillary>
  <ns38:Ancillary ancillaryDefinitionRef="ancillary_33" ancillaryId="ancillary_ancillary_64">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>692630</SequenceNumber>
    <TravelDateEffective>1980-01-01</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>CONFIRMED</AirExtraStatus>
    <PADIS_SeatProcessing>
      <PADIS_CodeTableInfo>
        <Characteristic>
          <Code>CH</Code>
          <TranslatedName>CHARGEABLE</TranslatedName>
          <AbbreviatedName>PAID</AbbreviatedName>
        </Characteristic>
        <Characteristic>
          <Code>O</Code>
          <TranslatedName>PREFERRED</TranslatedName>
          <AbbreviatedName>PRFST</AbbreviatedName>
        </Characteristic>
      </PADIS_CodeTableInfo>
    </PADIS_SeatProcessing>
    <Footnote>@</Footnote>
  </ns38:Ancillary>
  <ns38:Ancillary ancillaryDefinitionRef="ancillary_33" ancillaryId="ancillary_ancillary_65">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>693130</SequenceNumber>
    <TravelDateEffective>1980-01-01</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>CONFIRMED</AirExtraStatus>
    <PADIS_SeatProcessing>
      <PADIS_CodeTableInfo>
        <Characteristic>
          <Code>CH</Code>
          <TranslatedName>CHARGEABLE</TranslatedName>
          <AbbreviatedName>PAID</AbbreviatedName>
        </Characteristic>
        <Characteristic>
          <Code>W</Code>
          <TranslatedName>WINDOW</TranslatedName>
          <AbbreviatedName>WIND</AbbreviatedName>
        </Characteristic>
      </PADIS_CodeTableInfo>
    </PADIS_SeatProcessing>
    <Footnote>@</Footnote>
  </ns38:Ancillary>
  <ns38:Ancillary ancillaryDefinitionRef="ancillary_33" ancillaryId="ancillary_ancillary_66">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>693630</SequenceNumber>
    <TravelDateEffective>1980-01-01</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>CONFIRMED</AirExtraStatus>
    <PADIS_SeatProcessing>
      <PADIS_CodeTableInfo>
        <Characteristic>
          <Code>A</Code>
          <TranslatedName>AISLE</TranslatedName>
          <AbbreviatedName>AISLE</AbbreviatedName>
        </Characteristic>
        <Characteristic>
          <Code>CH</Code>
          <TranslatedName>CHARGEABLE</TranslatedName>
          <AbbreviatedName>PAID</AbbreviatedName>
        </Characteristic>
      </PADIS_CodeTableInfo>
    </PADIS_SeatProcessing>
    <Footnote>@</Footnote>
  </ns38:Ancillary>
  <ns38:Ancillary ancillaryDefinitionRef="ancillary_33" ancillaryId="ancillary_ancillary_67">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>694130</SequenceNumber>
    <TravelDateEffective>1980-01-01</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>CONFIRMED</AirExtraStatus>
    <PADIS_SeatProcessing>
      <PADIS_CodeTableInfo>
        <Characteristic>
          <Code>CH</Code>
          <TranslatedName>CHARGEABLE</TranslatedName>
          <AbbreviatedName>PAID</AbbreviatedName>
        </Characteristic>
      </PADIS_CodeTableInfo>
    </PADIS_SeatProcessing>
    <Footnote>@</Footnote>
  </ns38:Ancillary>
  <ns38:Ancillary ancillaryDefinitionRef="ancillary_69" ancillaryId="ancillary_ancillary_69">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>4000</SequenceNumber>
    <TravelDateEffective>2014-02-25</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>PAYMENT_REQUIRED</AirExtraStatus>
    <Footnote>N</Footnote>
  </ns38:Ancillary>
  <ns38:Ancillary ancillaryDefinitionRef="ancillary_70" ancillaryId="ancillary_ancillary_70">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>4000</SequenceNumber>
    <TravelDateEffective>2014-02-25</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>PAYMENT_REQUIRED</AirExtraStatus>
    <Footnote>X</Footnote>
  </ns38:Ancillary>
  <ns38:Ancillary ancillaryDefinitionRef="ancillary_73" ancillaryId="ancillary_ancillary_73">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>P</SectorPortionInd>
    <SequenceNumber>37562</SequenceNumber>
    <TravelDateEffective>1980-01-01</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>PAYMENT_REQUIRED</AirExtraStatus>
    <Footnote>N</Footnote>
  </ns38:Ancillary>
  <ns38:Ancillary ancillaryDefinitionRef="ancillary_74" ancillaryId="ancillary_ancillary_74">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>1000</SequenceNumber>
    <TravelDateEffective>2019-01-22</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>PAYMENT_REQUIRED</AirExtraStatus>
    <Footnote>X</Footnote>
  </ns38:Ancillary>
  <ns38:Ancillary ancillaryDefinitionRef="ancillary_77" ancillaryId="ancillary_ancillary_77">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>3000</SequenceNumber>
    <TravelDateEffective>2017-02-07</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>NO_AE</AirExtraStatus>
    <Footnote>*</Footnote>
  </ns38:Ancillary>
  <ns38:Ancillary ancillaryDefinitionRef="ancillary_79" ancillaryId="ancillary_ancillary_79">
    <ServiceType>C</ServiceType>
    <SectorPortionInd>P</SectorPortionInd>
    <BaggageData>
      <FirstOccurrence>-1</FirstOccurrence>
      <LastOccurrence>-1</LastOccurrence>
      <Weight unit="KILO">15</Weight>
    </BaggageData>
    <SequenceNumber>29318</SequenceNumber>
    <TravelDateEffective>1980-01-01</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>PAYMENT_REQUIRED</AirExtraStatus>
    <Footnote>N</Footnote>
  </ns38:Ancillary>
  <ns38:Ancillary ancillaryDefinitionRef="ancillary_81" ancillaryId="ancillary_ancillary_81">
    <ServiceType>C</ServiceType>
    <SectorPortionInd>P</SectorPortionInd>
    <BaggageData>
      <FirstOccurrence>-1</FirstOccurrence>
      <LastOccurrence>-1</LastOccurrence>
      <Weight unit="KILO">20</Weight>
    </BaggageData>
    <SequenceNumber>29318</SequenceNumber>
    <TravelDateEffective>1980-01-01</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>PAYMENT_REQUIRED</AirExtraStatus>
    <Footnote>N</Footnote>
  </ns38:Ancillary>
  <ns38:Ancillary ancillaryDefinitionRef="ancillary_83" ancillaryId="ancillary_ancillary_83">
    <ServiceType>C</ServiceType>
    <SectorPortionInd>P</SectorPortionInd>
    <BaggageData>
      <FirstOccurrence>-1</FirstOccurrence>
      <LastOccurrence>-1</LastOccurrence>
      <Weight unit="KILO">25</Weight>
    </BaggageData>
    <SequenceNumber>29318</SequenceNumber>
    <TravelDateEffective>1980-01-01</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>PAYMENT_REQUIRED</AirExtraStatus>
    <Footnote>N</Footnote>
  </ns38:Ancillary>
  <ns38:Ancillary ancillaryDefinitionRef="ancillary_85" ancillaryId="ancillary_ancillary_85">
    <ServiceType>C</ServiceType>
    <SectorPortionInd>P</SectorPortionInd>
    <BaggageData>
      <FirstOccurrence>-1</FirstOccurrence>
      <LastOccurrence>-1</LastOccurrence>
      <Weight unit="KILO">30</Weight>
    </BaggageData>
    <SequenceNumber>29318</SequenceNumber>
    <TravelDateEffective>1980-01-01</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>PAYMENT_REQUIRED</AirExtraStatus>
    <Footnote>N</Footnote>
  </ns38:Ancillary>
  <ns38:Ancillary ancillaryDefinitionRef="ancillary_87" ancillaryId="ancillary_ancillary_87">
    <ServiceType>C</ServiceType>
    <SectorPortionInd>P</SectorPortionInd>
    <BaggageData>
      <FirstOccurrence>-1</FirstOccurrence>
      <LastOccurrence>-1</LastOccurrence>
      <Weight unit="KILO">35</Weight>
    </BaggageData>
    <SequenceNumber>16833</SequenceNumber>
    <TravelDateEffective>1980-01-01</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>PAYMENT_REQUIRED</AirExtraStatus>
    <Footnote>N</Footnote>
  </ns38:Ancillary>
  <ns38:Ancillary ancillaryDefinitionRef="ancillary_89" ancillaryId="ancillary_ancillary_89">
    <ServiceType>C</ServiceType>
    <SectorPortionInd>P</SectorPortionInd>
    <BaggageData>
      <FirstOccurrence>-1</FirstOccurrence>
      <LastOccurrence>-1</LastOccurrence>
      <Weight unit="KILO">5</Weight>
    </BaggageData>
    <SequenceNumber>104225</SequenceNumber>
    <TravelDateEffective>1980-01-01</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>PAYMENT_REQUIRED</AirExtraStatus>
    <Footnote>N</Footnote>
  </ns38:Ancillary>
  <ns38:Ancillary ancillaryDefinitionRef="ancillary_91" ancillaryId="ancillary_ancillary_91">
    <ServiceType>C</ServiceType>
    <SectorPortionInd>P</SectorPortionInd>
    <BaggageData>
      <FirstOccurrence>-1</FirstOccurrence>
      <LastOccurrence>-1</LastOccurrence>
      <Weight unit="KILO">10</Weight>
    </BaggageData>
    <SequenceNumber>29318</SequenceNumber>
    <TravelDateEffective>1980-01-01</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>PAYMENT_REQUIRED</AirExtraStatus>
    <Footnote>N</Footnote>
  </ns38:Ancillary>
  <ns38:Ancillary ancillaryDefinitionRef="ancillary_94" ancillaryId="ancillary_ancillary_94">
    <ServiceType>C</ServiceType>
    <SectorPortionInd>P</SectorPortionInd>
    <BaggageData>
      <FirstOccurrence>-1</FirstOccurrence>
      <LastOccurrence>-1</LastOccurrence>
    </BaggageData>
    <SequenceNumber>280500</SequenceNumber>
    <TravelDateEffective>1980-01-01</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>PAYMENT_REQUIRED</AirExtraStatus>
    <Footnote>N</Footnote>
  </ns38:Ancillary>
  <ns38:Ancillary ancillaryDefinitionRef="ancillary_1" ancillaryId="ancillary_ancillary_1">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>P</SectorPortionInd>
    <SequenceNumber>1000</SequenceNumber>
    <TravelDateEffective>2019-08-04</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>PAYMENT_REQUIRED</AirExtraStatus>
    <Footnote>X</Footnote>
  </ns38:Ancillary>
  <ns38:Ancillary ancillaryDefinitionRef="ancillary_10" ancillaryId="ancillary_ancillary_234">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>3151</SequenceNumber>
    <TravelDateEffective>2015-06-21</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>PAYMENT_REQUIRED</AirExtraStatus>
    <Footnote>N</Footnote>
  </ns38:Ancillary>
  <ns38:Ancillary ancillaryDefinitionRef="ancillary_301" ancillaryId="ancillary_ancillary_301">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>1000</SequenceNumber>
    <TravelDateEffective>2013-08-01</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>PAYMENT_REQUIRED</AirExtraStatus>
    <Footnote>X</Footnote>
  </ns38:Ancillary>
  <ns38:Offers ancillaryRef="ancillary_ancillary_5" offerId="offer_ancillary_5">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">100868</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="AED" xmlns:ns2="http://services.sabre.com/merch/common/v03">6000</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">100868</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">100868</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">100868</ns2:EquivAmount>
      </TTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>Y</RefundableReissuable>
      <FormOfRefund code="1">ORIGINAL</FormOfRefund>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_1" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_6" offerId="offer_ancillary_6">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">100868</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="AED" xmlns:ns2="http://services.sabre.com/merch/common/v03">6000</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">100868</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">100868</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">100868</ns2:EquivAmount>
      </TTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_1" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_5" offerId="offer_ancillary_7">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">100868</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="AED" xmlns:ns2="http://services.sabre.com/merch/common/v03">6000</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">100868</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">100868</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">100868</ns2:EquivAmount>
      </TTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>Y</RefundableReissuable>
      <FormOfRefund code="1">ORIGINAL</FormOfRefund>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_2" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_6" offerId="offer_ancillary_8">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">100868</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="AED" xmlns:ns2="http://services.sabre.com/merch/common/v03">6000</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">100868</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">100868</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">100868</ns2:EquivAmount>
      </TTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_2" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_9" offerId="offer_ancillary_9">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:EquivAmount>
      </TTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>Y</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <FreeOfChargeRules>EMD_REQUIRED</FreeOfChargeRules>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_1" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_10" offerId="offer_ancillary_10">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">24600</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD" xmlns:ns2="http://services.sabre.com/merch/common/v03">400.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">24600</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">24600</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">24600</ns2:EquivAmount>
      </TTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>N</RefundableReissuable>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_1" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_11" offerId="offer_ancillary_11">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:EquivAmount>
      </TTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>Y</RefundableReissuable>
      <FormOfRefund code="1">ORIGINAL</FormOfRefund>
      <Commissionable>false</Commissionable>
      <FreeOfChargeRules>EMD_REQUIRED</FreeOfChargeRules>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_1" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_12" offerId="offer_ancillary_12">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">6150</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD" xmlns:ns2="http://services.sabre.com/merch/common/v03">100.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">6150</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">6150</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">6150</ns2:EquivAmount>
      </TTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>N</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FeeApplicationMethod code="3">ITEM</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_1" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_13" offerId="offer_ancillary_13">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:EquivAmount>
      </TTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>N</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <FreeOfChargeRules>EMD_REQUIRED</FreeOfChargeRules>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_1" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_14" offerId="offer_ancillary_14">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">25830</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD" xmlns:ns2="http://services.sabre.com/merch/common/v03">420.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">25830</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">25830</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">25830</ns2:EquivAmount>
      </TTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>N</RefundableReissuable>
      <FeeApplicationMethod code="3">ITEM</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_1" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_15" offerId="offer_ancillary_15">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:EquivAmount>
      </TTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>N</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_1" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_9" offerId="offer_ancillary_16">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:EquivAmount>
      </TTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>Y</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <FreeOfChargeRules>EMD_REQUIRED</FreeOfChargeRules>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_2" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_17" offerId="offer_ancillary_17">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">15375</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD" xmlns:ns2="http://services.sabre.com/merch/common/v03">250.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">15375</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">15375</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">15375</ns2:EquivAmount>
      </TTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>N</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_2" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_18" offerId="offer_ancillary_18">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">27675</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD" xmlns:ns2="http://services.sabre.com/merch/common/v03">450.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">27675</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">27675</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">27675</ns2:EquivAmount>
      </TTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>N</RefundableReissuable>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_2" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_19" offerId="offer_ancillary_19">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">4182</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD" xmlns:ns2="http://services.sabre.com/merch/common/v03">68.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">4182</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">4182</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">4182</ns2:EquivAmount>
      </TTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>Y</RefundableReissuable>
      <FormOfRefund code="1">ORIGINAL</FormOfRefund>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FeeApplicationMethod code="3">ITEM</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_2" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_11" offerId="offer_ancillary_20">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:EquivAmount>
      </TTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>Y</RefundableReissuable>
      <FormOfRefund code="1">ORIGINAL</FormOfRefund>
      <Commissionable>false</Commissionable>
      <FreeOfChargeRules>EMD_REQUIRED</FreeOfChargeRules>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_2" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_12" offerId="offer_ancillary_21">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">6150</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD" xmlns:ns2="http://services.sabre.com/merch/common/v03">100.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">6150</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">6150</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">6150</ns2:EquivAmount>
      </TTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>N</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FeeApplicationMethod code="3">ITEM</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_2" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_13" offerId="offer_ancillary_22">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:EquivAmount>
      </TTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>N</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <FreeOfChargeRules>EMD_REQUIRED</FreeOfChargeRules>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_2" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_14" offerId="offer_ancillary_23">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">25830</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD" xmlns:ns2="http://services.sabre.com/merch/common/v03">420.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">25830</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">25830</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">25830</ns2:EquivAmount>
      </TTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>N</RefundableReissuable>
      <FeeApplicationMethod code="3">ITEM</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_2" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_15" offerId="offer_ancillary_24">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:EquivAmount>
      </TTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>N</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_2" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_25" offerId="offer_ancillary_25">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">845686</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="EUR" xmlns:ns2="http://services.sabre.com/merch/common/v03">12345.78</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">845686</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">845686</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">845686</ns2:EquivAmount>
      </TTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>Y</RefundableReissuable>
      <FormOfRefund code="1">ORIGINAL</FormOfRefund>
      <Commissionable>false</Commissionable>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_1" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_25" offerId="offer_ancillary_26">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">845686</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="EUR" xmlns:ns2="http://services.sabre.com/merch/common/v03">12345.78</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">845686</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">845686</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">845686</ns2:EquivAmount>
      </TTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>Y</RefundableReissuable>
      <FormOfRefund code="1">ORIGINAL</FormOfRefund>
      <Commissionable>false</Commissionable>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_2" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_27" offerId="offer_ancillary_27">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">984</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD" xmlns:ns2="http://services.sabre.com/merch/common/v03">16.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">984</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">984</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">984</ns2:EquivAmount>
      </TTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>Y</RefundableReissuable>
      <FormOfRefund code="1">ORIGINAL</FormOfRefund>
      <Commissionable>false</Commissionable>
      <FeeApplicationMethod code="1">ONE_WAY</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_1" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_28" offerId="offer_ancillary_28">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">308</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD" xmlns:ns2="http://services.sabre.com/merch/common/v03">5.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">308</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">308</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">308</ns2:EquivAmount>
      </TTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>Y</RefundableReissuable>
      <FormOfRefund code="1">ORIGINAL</FormOfRefund>
      <Commissionable>false</Commissionable>
      <FeeApplicationMethod code="3">ITEM</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_1" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_29" offerId="offer_ancillary_29">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">800</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD" xmlns:ns2="http://services.sabre.com/merch/common/v03">13.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">800</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">800</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">800</ns2:EquivAmount>
      </TTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>Y</RefundableReissuable>
      <FormOfRefund code="1">ORIGINAL</FormOfRefund>
      <FeeApplicationMethod code="5">TICKET</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_2" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_28" offerId="offer_ancillary_30">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">308</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD" xmlns:ns2="http://services.sabre.com/merch/common/v03">5.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">308</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">308</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">308</ns2:EquivAmount>
      </TTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>Y</RefundableReissuable>
      <FormOfRefund code="1">ORIGINAL</FormOfRefund>
      <Commissionable>false</Commissionable>
      <FeeApplicationMethod code="3">ITEM</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_2" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_31" offerId="offer_ancillary_31">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">15990</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD" xmlns:ns2="http://services.sabre.com/merch/common/v03">260.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">15990</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">15990</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">15990</ns2:EquivAmount>
      </TTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>Y</RefundableReissuable>
      <FormOfRefund code="1">ORIGINAL</FormOfRefund>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FeeApplicationMethod code="4">PER_BAGGAGE_TRAVEL</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_1" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_31" offerId="offer_ancillary_32">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">15990</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD" xmlns:ns2="http://services.sabre.com/merch/common/v03">260.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">15990</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">15990</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">15990</ns2:EquivAmount>
      </TTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>Y</RefundableReissuable>
      <FormOfRefund code="1">ORIGINAL</FormOfRefund>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FeeApplicationMethod code="4">PER_BAGGAGE_TRAVEL</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_2" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_33" offerId="offer_ancillary_33">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">3998</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD" xmlns:ns2="http://services.sabre.com/merch/common/v03">65.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">3998</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">3998</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">3998</ns2:EquivAmount>
      </TTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>N</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment inventoryLevel="168" segmentId="seg_1" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_34" offerId="offer_ancillary_34">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">3998</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD" xmlns:ns2="http://services.sabre.com/merch/common/v03">65.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">3998</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">3998</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">3998</ns2:EquivAmount>
      </TTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>N</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment inventoryLevel="168" segmentId="seg_1" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_35" offerId="offer_ancillary_35">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">923</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD" xmlns:ns2="http://services.sabre.com/merch/common/v03">15.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">923</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">923</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">923</ns2:EquivAmount>
      </TTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>N</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment inventoryLevel="168" segmentId="seg_1" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:PurchaseByDate xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">2020-08-30</ns12:PurchaseByDate>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_36" offerId="offer_ancillary_36">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:EquivAmount>
      </TTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>N</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FreeOfChargeRules>BOOKING_REQUIRED</FreeOfChargeRules>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment inventoryLevel="168" segmentId="seg_1" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:PurchaseByDate xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">2020-08-30</ns12:PurchaseByDate>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_37" offerId="offer_ancillary_37">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:EquivAmount>
      </TTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>N</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FreeOfChargeRules>BOOKING_REQUIRED</FreeOfChargeRules>
      <FreeOfChargeRules>EMD_REQUIRED</FreeOfChargeRules>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment inventoryLevel="168" segmentId="seg_1" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:PurchaseByDate xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">2020-08-30</ns12:PurchaseByDate>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_38" offerId="offer_ancillary_38">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:EquivAmount>
      </TTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>N</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FreeOfChargeRules>BOOKING_REQUIRED</FreeOfChargeRules>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment inventoryLevel="168" segmentId="seg_1" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:PurchaseByDate xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">2020-08-30</ns12:PurchaseByDate>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_39" offerId="offer_ancillary_39">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:EquivAmount>
      </TTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>N</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FreeOfChargeRules>BOOKING_REQUIRED</FreeOfChargeRules>
      <FreeOfChargeRules>EMD_REQUIRED</FreeOfChargeRules>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment inventoryLevel="168" segmentId="seg_1" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:PurchaseByDate xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">2020-08-30</ns12:PurchaseByDate>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_40" offerId="offer_ancillary_40">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:EquivAmount>
      </TTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>N</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FreeOfChargeRules>BOOKING_REQUIRED</FreeOfChargeRules>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment inventoryLevel="168" segmentId="seg_1" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:PurchaseByDate xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">2020-08-30</ns12:PurchaseByDate>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_41" offerId="offer_ancillary_41">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:EquivAmount>
      </TTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>N</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FreeOfChargeRules>BOOKING_REQUIRED</FreeOfChargeRules>
      <FreeOfChargeRules>EMD_REQUIRED</FreeOfChargeRules>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment inventoryLevel="168" segmentId="seg_1" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:PurchaseByDate xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">2020-08-30</ns12:PurchaseByDate>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_42" offerId="offer_ancillary_42">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:EquivAmount>
      </TTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>N</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FreeOfChargeRules>BOOKING_REQUIRED</FreeOfChargeRules>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment inventoryLevel="168" segmentId="seg_1" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_43" offerId="offer_ancillary_43">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:EquivAmount>
      </TTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>N</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FreeOfChargeRules>BOOKING_REQUIRED</FreeOfChargeRules>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment inventoryLevel="168" segmentId="seg_1" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_44" offerId="offer_ancillary_44">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:EquivAmount>
      </TTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>N</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FreeOfChargeRules>BOOKING_REQUIRED</FreeOfChargeRules>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment inventoryLevel="168" segmentId="seg_1" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_45" offerId="offer_ancillary_45">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:EquivAmount>
      </TTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>N</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FreeOfChargeRules>BOOKING_REQUIRED</FreeOfChargeRules>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment inventoryLevel="168" segmentId="seg_1" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_46" offerId="offer_ancillary_46">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:EquivAmount>
      </TTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>N</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FreeOfChargeRules>BOOKING_REQUIRED</FreeOfChargeRules>
      <FreeOfChargeRules>EMD_REQUIRED</FreeOfChargeRules>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment inventoryLevel="168" segmentId="seg_1" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_47" offerId="offer_ancillary_47">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:EquivAmount>
      </TTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>N</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FreeOfChargeRules>BOOKING_REQUIRED</FreeOfChargeRules>
      <FreeOfChargeRules>EMD_REQUIRED</FreeOfChargeRules>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment inventoryLevel="168" segmentId="seg_1" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_48" offerId="offer_ancillary_48">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:EquivAmount>
      </TTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>N</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FreeOfChargeRules>BOOKING_REQUIRED</FreeOfChargeRules>
      <FreeOfChargeRules>EMD_REQUIRED</FreeOfChargeRules>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment inventoryLevel="168" segmentId="seg_1" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_49" offerId="offer_ancillary_49">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:EquivAmount>
      </TTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>N</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FreeOfChargeRules>BOOKING_REQUIRED</FreeOfChargeRules>
      <FreeOfChargeRules>EMD_REQUIRED</FreeOfChargeRules>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment inventoryLevel="168" segmentId="seg_1" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_50" offerId="offer_ancillary_50">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">1230</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD" xmlns:ns2="http://services.sabre.com/merch/common/v03">20.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">1230</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">1230</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">1230</ns2:EquivAmount>
      </TTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>N</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_1" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_33" offerId="offer_ancillary_51">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">3998</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD" xmlns:ns2="http://services.sabre.com/merch/common/v03">65.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">3998</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">3998</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">3998</ns2:EquivAmount>
      </TTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>N</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment inventoryLevel="168" segmentId="seg_2" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_34" offerId="offer_ancillary_52">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">3998</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD" xmlns:ns2="http://services.sabre.com/merch/common/v03">65.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">3998</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">3998</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">3998</ns2:EquivAmount>
      </TTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>N</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment inventoryLevel="168" segmentId="seg_2" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_35" offerId="offer_ancillary_53">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">923</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD" xmlns:ns2="http://services.sabre.com/merch/common/v03">15.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">923</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">923</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">923</ns2:EquivAmount>
      </TTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>N</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment inventoryLevel="168" segmentId="seg_2" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:PurchaseByDate xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">2020-09-06</ns12:PurchaseByDate>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_54" offerId="offer_ancillary_54">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:EquivAmount>
      </TTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>N</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FreeOfChargeRules>BOOKING_REQUIRED</FreeOfChargeRules>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment inventoryLevel="168" segmentId="seg_2" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:PurchaseByDate xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">2020-09-06</ns12:PurchaseByDate>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_55" offerId="offer_ancillary_55">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:EquivAmount>
      </TTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>N</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FreeOfChargeRules>BOOKING_REQUIRED</FreeOfChargeRules>
      <FreeOfChargeRules>EMD_REQUIRED</FreeOfChargeRules>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment inventoryLevel="168" segmentId="seg_2" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:PurchaseByDate xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">2020-09-06</ns12:PurchaseByDate>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_56" offerId="offer_ancillary_56">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:EquivAmount>
      </TTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>N</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FreeOfChargeRules>BOOKING_REQUIRED</FreeOfChargeRules>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment inventoryLevel="168" segmentId="seg_2" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:PurchaseByDate xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">2020-09-06</ns12:PurchaseByDate>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_57" offerId="offer_ancillary_57">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:EquivAmount>
      </TTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>N</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FreeOfChargeRules>BOOKING_REQUIRED</FreeOfChargeRules>
      <FreeOfChargeRules>EMD_REQUIRED</FreeOfChargeRules>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment inventoryLevel="168" segmentId="seg_2" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:PurchaseByDate xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">2020-09-06</ns12:PurchaseByDate>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_58" offerId="offer_ancillary_58">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:EquivAmount>
      </TTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>N</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FreeOfChargeRules>BOOKING_REQUIRED</FreeOfChargeRules>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment inventoryLevel="168" segmentId="seg_2" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:PurchaseByDate xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">2020-09-06</ns12:PurchaseByDate>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_59" offerId="offer_ancillary_59">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:EquivAmount>
      </TTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>N</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FreeOfChargeRules>BOOKING_REQUIRED</FreeOfChargeRules>
      <FreeOfChargeRules>EMD_REQUIRED</FreeOfChargeRules>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment inventoryLevel="168" segmentId="seg_2" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:PurchaseByDate xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">2020-09-06</ns12:PurchaseByDate>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_60" offerId="offer_ancillary_60">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:EquivAmount>
      </TTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>N</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FreeOfChargeRules>BOOKING_REQUIRED</FreeOfChargeRules>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment inventoryLevel="168" segmentId="seg_2" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_61" offerId="offer_ancillary_61">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:EquivAmount>
      </TTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>N</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FreeOfChargeRules>BOOKING_REQUIRED</FreeOfChargeRules>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment inventoryLevel="168" segmentId="seg_2" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_62" offerId="offer_ancillary_62">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:EquivAmount>
      </TTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>N</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FreeOfChargeRules>BOOKING_REQUIRED</FreeOfChargeRules>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment inventoryLevel="168" segmentId="seg_2" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_63" offerId="offer_ancillary_63">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:EquivAmount>
      </TTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>N</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FreeOfChargeRules>BOOKING_REQUIRED</FreeOfChargeRules>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment inventoryLevel="168" segmentId="seg_2" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_64" offerId="offer_ancillary_64">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:EquivAmount>
      </TTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>N</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FreeOfChargeRules>BOOKING_REQUIRED</FreeOfChargeRules>
      <FreeOfChargeRules>EMD_REQUIRED</FreeOfChargeRules>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment inventoryLevel="168" segmentId="seg_2" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_65" offerId="offer_ancillary_65">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:EquivAmount>
      </TTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>N</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FreeOfChargeRules>BOOKING_REQUIRED</FreeOfChargeRules>
      <FreeOfChargeRules>EMD_REQUIRED</FreeOfChargeRules>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment inventoryLevel="168" segmentId="seg_2" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_66" offerId="offer_ancillary_66">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:EquivAmount>
      </TTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>N</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FreeOfChargeRules>BOOKING_REQUIRED</FreeOfChargeRules>
      <FreeOfChargeRules>EMD_REQUIRED</FreeOfChargeRules>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment inventoryLevel="168" segmentId="seg_2" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_67" offerId="offer_ancillary_67">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">0</ns2:EquivAmount>
      </TTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>N</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FreeOfChargeRules>BOOKING_REQUIRED</FreeOfChargeRules>
      <FreeOfChargeRules>EMD_REQUIRED</FreeOfChargeRules>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment inventoryLevel="168" segmentId="seg_2" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_50" offerId="offer_ancillary_68">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">1230</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD" xmlns:ns2="http://services.sabre.com/merch/common/v03">20.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">1230</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">1230</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">1230</ns2:EquivAmount>
      </TTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>N</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_2" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_69" offerId="offer_ancillary_69">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">2829</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD" xmlns:ns2="http://services.sabre.com/merch/common/v03">46.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">2829</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">2829</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">2829</ns2:EquivAmount>
      </TTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>N</RefundableReissuable>
      <FormOfRefund code="1">ORIGINAL</FormOfRefund>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_1" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_70" offerId="offer_ancillary_70">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">3137</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD" xmlns:ns2="http://services.sabre.com/merch/common/v03">51.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">3137</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">3137</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">3137</ns2:EquivAmount>
      </TTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>Y</RefundableReissuable>
      <FormOfRefund code="1">ORIGINAL</FormOfRefund>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_1" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_69" offerId="offer_ancillary_71">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">2829</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD" xmlns:ns2="http://services.sabre.com/merch/common/v03">46.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">2829</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">2829</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">2829</ns2:EquivAmount>
      </TTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>N</RefundableReissuable>
      <FormOfRefund code="1">ORIGINAL</FormOfRefund>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_2" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_70" offerId="offer_ancillary_72">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">3137</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD" xmlns:ns2="http://services.sabre.com/merch/common/v03">51.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">3137</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">3137</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">3137</ns2:EquivAmount>
      </TTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>Y</RefundableReissuable>
      <FormOfRefund code="1">ORIGINAL</FormOfRefund>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_2" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_73" offerId="offer_ancillary_73">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">1230</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD" xmlns:ns2="http://services.sabre.com/merch/common/v03">20.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">1230</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">1230</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">1230</ns2:EquivAmount>
      </TTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>N</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_1" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:PurchaseByDate xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">2020-09-01</ns12:PurchaseByDate>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_74" offerId="offer_ancillary_74">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">6150</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD" xmlns:ns2="http://services.sabre.com/merch/common/v03">100.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">6150</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">6150</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">6150</ns2:EquivAmount>
      </TTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>Y</RefundableReissuable>
      <FormOfRefund code="1">ORIGINAL</FormOfRefund>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_1" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_73" offerId="offer_ancillary_75">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">1230</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD" xmlns:ns2="http://services.sabre.com/merch/common/v03">20.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">1230</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">1230</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">1230</ns2:EquivAmount>
      </TTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>N</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_2" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:PurchaseByDate xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">2020-09-07</ns12:PurchaseByDate>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_74" offerId="offer_ancillary_76">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">6150</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD" xmlns:ns2="http://services.sabre.com/merch/common/v03">100.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">6150</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">6150</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">6150</ns2:EquivAmount>
      </TTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>Y</RefundableReissuable>
      <FormOfRefund code="1">ORIGINAL</FormOfRefund>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_2" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_77" offerId="offer_ancillary_77">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>true</Unavailable>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Commissionable>false</Commissionable>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_1" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:PurchaseByDate xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">2020-08-31</ns12:PurchaseByDate>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_77" offerId="offer_ancillary_78">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>true</Unavailable>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Commissionable>false</Commissionable>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_2" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:PurchaseByDate xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">2020-09-06</ns12:PurchaseByDate>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_79" offerId="offer_ancillary_79">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">20790</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD" xmlns:ns2="http://services.sabre.com/merch/common/v03">338.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">20790</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">20790</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">20790</ns2:EquivAmount>
      </TTL_Price>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>true</Interlineable>
      <FeeApplicationMethod code="4">PER_BAGGAGE_TRAVEL</FeeApplicationMethod>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_1" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:PurchaseByDate xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">2020-08-30</ns12:PurchaseByDate>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_81" offerId="offer_ancillary_81">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">27675</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD" xmlns:ns2="http://services.sabre.com/merch/common/v03">450.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">27675</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">27675</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">27675</ns2:EquivAmount>
      </TTL_Price>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>true</Interlineable>
      <FeeApplicationMethod code="4">PER_BAGGAGE_TRAVEL</FeeApplicationMethod>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_1" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:PurchaseByDate xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">2020-08-30</ns12:PurchaseByDate>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_83" offerId="offer_ancillary_83">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">34625</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD" xmlns:ns2="http://services.sabre.com/merch/common/v03">563.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">34625</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">34625</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">34625</ns2:EquivAmount>
      </TTL_Price>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>true</Interlineable>
      <FeeApplicationMethod code="4">PER_BAGGAGE_TRAVEL</FeeApplicationMethod>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_1" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:PurchaseByDate xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">2020-08-30</ns12:PurchaseByDate>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_85" offerId="offer_ancillary_85">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">41515</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD" xmlns:ns2="http://services.sabre.com/merch/common/v03">675.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">41515</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">41515</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">41515</ns2:EquivAmount>
      </TTL_Price>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>true</Interlineable>
      <FeeApplicationMethod code="4">PER_BAGGAGE_TRAVEL</FeeApplicationMethod>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_1" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:PurchaseByDate xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">2020-08-30</ns12:PurchaseByDate>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_87" offerId="offer_ancillary_87">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">48465</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD" xmlns:ns2="http://services.sabre.com/merch/common/v03">788.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">48465</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">48465</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">48465</ns2:EquivAmount>
      </TTL_Price>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>true</Interlineable>
      <FeeApplicationMethod code="4">PER_BAGGAGE_TRAVEL</FeeApplicationMethod>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_1" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:PurchaseByDate xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">2020-08-30</ns12:PurchaseByDate>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_89" offerId="offer_ancillary_89">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">6950</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD" xmlns:ns2="http://services.sabre.com/merch/common/v03">113.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">6950</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">6950</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">6950</ns2:EquivAmount>
      </TTL_Price>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>true</Interlineable>
      <FeeApplicationMethod code="4">PER_BAGGAGE_TRAVEL</FeeApplicationMethod>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_1" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:PurchaseByDate xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">2020-08-30</ns12:PurchaseByDate>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_91" offerId="offer_ancillary_91">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">13840</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD" xmlns:ns2="http://services.sabre.com/merch/common/v03">225.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">13840</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">13840</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">13840</ns2:EquivAmount>
      </TTL_Price>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>true</Interlineable>
      <FeeApplicationMethod code="4">PER_BAGGAGE_TRAVEL</FeeApplicationMethod>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_1" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:PurchaseByDate xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">2020-08-30</ns12:PurchaseByDate>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_94" offerId="offer_ancillary_94">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">1540</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD" xmlns:ns2="http://services.sabre.com/merch/common/v03">25.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">1540</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">1540</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">1540</ns2:EquivAmount>
      </TTL_Price>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>true</Interlineable>
      <FeeApplicationMethod code="K">PER_1KG_OVER_FREE_BAGGAGE_ALLOWANCE</FeeApplicationMethod>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_1" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_79" offerId="offer_ancillary_96">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">20790</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD" xmlns:ns2="http://services.sabre.com/merch/common/v03">338.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">20790</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">20790</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">20790</ns2:EquivAmount>
      </TTL_Price>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>true</Interlineable>
      <FeeApplicationMethod code="4">PER_BAGGAGE_TRAVEL</FeeApplicationMethod>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_2" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:PurchaseByDate xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">2020-09-06</ns12:PurchaseByDate>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_81" offerId="offer_ancillary_98">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">27675</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD" xmlns:ns2="http://services.sabre.com/merch/common/v03">450.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">27675</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">27675</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">27675</ns2:EquivAmount>
      </TTL_Price>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>true</Interlineable>
      <FeeApplicationMethod code="4">PER_BAGGAGE_TRAVEL</FeeApplicationMethod>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_2" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:PurchaseByDate xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">2020-09-06</ns12:PurchaseByDate>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_83" offerId="offer_ancillary_100">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">34625</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD" xmlns:ns2="http://services.sabre.com/merch/common/v03">563.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">34625</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">34625</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">34625</ns2:EquivAmount>
      </TTL_Price>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>true</Interlineable>
      <FeeApplicationMethod code="4">PER_BAGGAGE_TRAVEL</FeeApplicationMethod>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_2" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:PurchaseByDate xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">2020-09-06</ns12:PurchaseByDate>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_85" offerId="offer_ancillary_102">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">41515</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD" xmlns:ns2="http://services.sabre.com/merch/common/v03">675.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">41515</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">41515</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">41515</ns2:EquivAmount>
      </TTL_Price>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>true</Interlineable>
      <FeeApplicationMethod code="4">PER_BAGGAGE_TRAVEL</FeeApplicationMethod>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_2" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:PurchaseByDate xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">2020-09-06</ns12:PurchaseByDate>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_87" offerId="offer_ancillary_104">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">48465</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD" xmlns:ns2="http://services.sabre.com/merch/common/v03">788.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">48465</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">48465</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">48465</ns2:EquivAmount>
      </TTL_Price>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>true</Interlineable>
      <FeeApplicationMethod code="4">PER_BAGGAGE_TRAVEL</FeeApplicationMethod>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_2" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:PurchaseByDate xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">2020-09-06</ns12:PurchaseByDate>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_89" offerId="offer_ancillary_106">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">6950</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD" xmlns:ns2="http://services.sabre.com/merch/common/v03">113.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">6950</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">6950</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">6950</ns2:EquivAmount>
      </TTL_Price>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>true</Interlineable>
      <FeeApplicationMethod code="4">PER_BAGGAGE_TRAVEL</FeeApplicationMethod>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_2" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:PurchaseByDate xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">2020-09-06</ns12:PurchaseByDate>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_91" offerId="offer_ancillary_108">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">13840</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD" xmlns:ns2="http://services.sabre.com/merch/common/v03">225.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">13840</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">13840</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">13840</ns2:EquivAmount>
      </TTL_Price>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>true</Interlineable>
      <FeeApplicationMethod code="4">PER_BAGGAGE_TRAVEL</FeeApplicationMethod>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_2" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:PurchaseByDate xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">2020-09-06</ns12:PurchaseByDate>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_94" offerId="offer_ancillary_111">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">1540</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD" xmlns:ns2="http://services.sabre.com/merch/common/v03">25.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">1540</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">1540</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">1540</ns2:EquivAmount>
      </TTL_Price>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>true</Interlineable>
      <FeeApplicationMethod code="K">PER_1KG_OVER_FREE_BAGGAGE_ALLOWANCE</FeeApplicationMethod>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_2" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_1" offerId="offer_ancillary_1">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">3867</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="AED" xmlns:ns2="http://services.sabre.com/merch/common/v03">230</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">3867</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">3867</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">3867</ns2:EquivAmount>
      </TTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>Y</RefundableReissuable>
      <FormOfRefund code="1">ORIGINAL</FormOfRefund>
      <Commissionable>false</Commissionable>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:LinkedAE xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">offer_ancillary_89 offer_ancillary_40</ns12:LinkedAE>
    <ns12:Segment inventoryLevel="168" segmentId="seg_1" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_1" offerId="offer_ancillary_3">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">3867</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="AED" xmlns:ns2="http://services.sabre.com/merch/common/v03">230</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">3867</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">3867</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">3867</ns2:EquivAmount>
      </TTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>Y</RefundableReissuable>
      <FormOfRefund code="1">ORIGINAL</FormOfRefund>
      <Commissionable>false</Commissionable>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:LinkedAE xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">offer_ancillary_58 offer_ancillary_106</ns12:LinkedAE>
    <ns12:Segment inventoryLevel="168" segmentId="seg_2" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_234" offerId="offer_ancillary_234">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">2460</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD" xmlns:ns2="http://services.sabre.com/merch/common/v03">40.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">2460</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">2460</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">2460</ns2:EquivAmount>
      </TTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>N</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_1" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_301" offerId="offer_ancillary_301">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">861</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD" xmlns:ns2="http://services.sabre.com/merch/common/v03">14.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">861</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">861</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">861</ns2:EquivAmount>
      </TTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>Y</RefundableReissuable>
      <FormOfRefund code="1">ORIGINAL</FormOfRefund>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_1" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:Offers ancillaryRef="ancillary_ancillary_301" offerId="offer_ancillary_302">
    <ns12:Origin xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">AUH</ns12:Origin>
    <ns12:Destination xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">DME</ns12:Destination>
    <ns12:AncillaryFee xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">861</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD" xmlns:ns2="http://services.sabre.com/merch/common/v03">14.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">861</ns2:EquivAmount>
      </Base>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">861</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB" xmlns:ns2="http://services.sabre.com/merch/common/v03">861</ns2:EquivAmount>
      </TTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">
      <RefundableReissuable>Y</RefundableReissuable>
      <FormOfRefund code="1">ORIGINAL</FormOfRefund>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_2" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:IsDisclosurePart xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">false</ns12:PaperTicketRequired>
  </ns38:Offers>
  <ns38:PassengerOffers>
    <ns12:PassengerReference nameReferenceNumber="1.1" passengerId="pax_1" passengerType="ADT" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:OfferRefs xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">offer_ancillary_5 offer_ancillary_6 offer_ancillary_7 offer_ancillary_8 offer_ancillary_9 offer_ancillary_10 offer_ancillary_11 offer_ancillary_12 offer_ancillary_13 offer_ancillary_14 offer_ancillary_15 offer_ancillary_16 offer_ancillary_17 offer_ancillary_18 offer_ancillary_19 offer_ancillary_20 offer_ancillary_21 offer_ancillary_22 offer_ancillary_23 offer_ancillary_24 offer_ancillary_25 offer_ancillary_26 offer_ancillary_27 offer_ancillary_28 offer_ancillary_29 offer_ancillary_30 offer_ancillary_31 offer_ancillary_32 offer_ancillary_33 offer_ancillary_34 offer_ancillary_35 offer_ancillary_36 offer_ancillary_37 offer_ancillary_38 offer_ancillary_39 offer_ancillary_40 offer_ancillary_41 offer_ancillary_42 offer_ancillary_43 offer_ancillary_44 offer_ancillary_45 offer_ancillary_46 offer_ancillary_47 offer_ancillary_48 offer_ancillary_49 offer_ancillary_50 offer_ancillary_51 offer_ancillary_52 offer_ancillary_53 offer_ancillary_54 offer_ancillary_55 offer_ancillary_56 offer_ancillary_57 offer_ancillary_58 offer_ancillary_59 offer_ancillary_60 offer_ancillary_61 offer_ancillary_62 offer_ancillary_63 offer_ancillary_64 offer_ancillary_65 offer_ancillary_66 offer_ancillary_67 offer_ancillary_68 offer_ancillary_69 offer_ancillary_70 offer_ancillary_71 offer_ancillary_72 offer_ancillary_73 offer_ancillary_74 offer_ancillary_75 offer_ancillary_76 offer_ancillary_77 offer_ancillary_78 offer_ancillary_79 offer_ancillary_81 offer_ancillary_83 offer_ancillary_85 offer_ancillary_87 offer_ancillary_89 offer_ancillary_91 offer_ancillary_94 offer_ancillary_96 offer_ancillary_98 offer_ancillary_100 offer_ancillary_102 offer_ancillary_104 offer_ancillary_106 offer_ancillary_108 offer_ancillary_111 offer_ancillary_1 offer_ancillary_3</ns12:OfferRefs>
  </ns38:PassengerOffers>
  <ns38:PassengerOffers>
    <ns12:PassengerReference nameReferenceNumber="2.1" passengerId="pax_2" passengerType="ADT" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:OfferRefs xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">offer_ancillary_5 offer_ancillary_6 offer_ancillary_7 offer_ancillary_8 offer_ancillary_9 offer_ancillary_10 offer_ancillary_11 offer_ancillary_12 offer_ancillary_13 offer_ancillary_14 offer_ancillary_15 offer_ancillary_16 offer_ancillary_17 offer_ancillary_18 offer_ancillary_19 offer_ancillary_20 offer_ancillary_21 offer_ancillary_22 offer_ancillary_23 offer_ancillary_24 offer_ancillary_25 offer_ancillary_26 offer_ancillary_27 offer_ancillary_28 offer_ancillary_29 offer_ancillary_30 offer_ancillary_31 offer_ancillary_32 offer_ancillary_33 offer_ancillary_34 offer_ancillary_35 offer_ancillary_36 offer_ancillary_37 offer_ancillary_38 offer_ancillary_39 offer_ancillary_40 offer_ancillary_41 offer_ancillary_42 offer_ancillary_43 offer_ancillary_44 offer_ancillary_45 offer_ancillary_46 offer_ancillary_47 offer_ancillary_48 offer_ancillary_49 offer_ancillary_50 offer_ancillary_51 offer_ancillary_52 offer_ancillary_53 offer_ancillary_54 offer_ancillary_55 offer_ancillary_56 offer_ancillary_57 offer_ancillary_58 offer_ancillary_59 offer_ancillary_60 offer_ancillary_61 offer_ancillary_62 offer_ancillary_63 offer_ancillary_64 offer_ancillary_65 offer_ancillary_66 offer_ancillary_67 offer_ancillary_68 offer_ancillary_69 offer_ancillary_70 offer_ancillary_71 offer_ancillary_72 offer_ancillary_73 offer_ancillary_74 offer_ancillary_75 offer_ancillary_76 offer_ancillary_77 offer_ancillary_78 offer_ancillary_79 offer_ancillary_81 offer_ancillary_83 offer_ancillary_85 offer_ancillary_87 offer_ancillary_89 offer_ancillary_91 offer_ancillary_94 offer_ancillary_96 offer_ancillary_98 offer_ancillary_100 offer_ancillary_102 offer_ancillary_104 offer_ancillary_106 offer_ancillary_108 offer_ancillary_111 offer_ancillary_1 offer_ancillary_3</ns12:OfferRefs>
  </ns38:PassengerOffers>
  <ns38:PassengerOffers>
    <ns12:PassengerReference nameReferenceNumber="3.1" passengerId="pax_3" passengerType="INF" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03"/>
    <ns12:OfferRefs xmlns:ns12="http://services.sabre.com/merch/ancillary/v03">offer_ancillary_5 offer_ancillary_6 offer_ancillary_7 offer_ancillary_8 offer_ancillary_9 offer_ancillary_234 offer_ancillary_11 offer_ancillary_12 offer_ancillary_13 offer_ancillary_14 offer_ancillary_15 offer_ancillary_16 offer_ancillary_17 offer_ancillary_18 offer_ancillary_19 offer_ancillary_20 offer_ancillary_21 offer_ancillary_22 offer_ancillary_23 offer_ancillary_24 offer_ancillary_25 offer_ancillary_26 offer_ancillary_27 offer_ancillary_28 offer_ancillary_29 offer_ancillary_30 offer_ancillary_31 offer_ancillary_32 offer_ancillary_33 offer_ancillary_34 offer_ancillary_35 offer_ancillary_36 offer_ancillary_37 offer_ancillary_38 offer_ancillary_39 offer_ancillary_40 offer_ancillary_41 offer_ancillary_42 offer_ancillary_43 offer_ancillary_44 offer_ancillary_45 offer_ancillary_46 offer_ancillary_47 offer_ancillary_48 offer_ancillary_49 offer_ancillary_50 offer_ancillary_51 offer_ancillary_52 offer_ancillary_53 offer_ancillary_54 offer_ancillary_55 offer_ancillary_56 offer_ancillary_57 offer_ancillary_58 offer_ancillary_59 offer_ancillary_60 offer_ancillary_61 offer_ancillary_62 offer_ancillary_63 offer_ancillary_64 offer_ancillary_65 offer_ancillary_66 offer_ancillary_67 offer_ancillary_68 offer_ancillary_69 offer_ancillary_70 offer_ancillary_71 offer_ancillary_72 offer_ancillary_73 offer_ancillary_74 offer_ancillary_75 offer_ancillary_76 offer_ancillary_301 offer_ancillary_302 offer_ancillary_77 offer_ancillary_78 offer_ancillary_79 offer_ancillary_81 offer_ancillary_83 offer_ancillary_85 offer_ancillary_87 offer_ancillary_89 offer_ancillary_91 offer_ancillary_94 offer_ancillary_96 offer_ancillary_98 offer_ancillary_100 offer_ancillary_102 offer_ancillary_104 offer_ancillary_106 offer_ancillary_108 offer_ancillary_111 offer_ancillary_1 offer_ancillary_3</ns12:OfferRefs>
  </ns38:PassengerOffers>
  <ns38:ResponseOptions>
    <ns38:EmptyGroupList>FF UU CO LG</ns38:EmptyGroupList>
    <ns38:InactiveGroupList>99 ST BF RO</ns38:InactiveGroupList>
  </ns38:ResponseOptions>
</ns38:GetAncillaryOffersRS>
{% endxmlsec %}
