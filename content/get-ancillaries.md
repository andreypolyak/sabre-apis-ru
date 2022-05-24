---
title: Получение списка дополнительных услуг
---

{{< toc >}}

## Введение

{{< hint warning >}}
Для получения списка дополнительных услуг в других PCC предварительно требуется отправить запрос к сервису [ContextChangeLLSRQ](https://developer.sabre.com/docs/read/soap_apis/management/utility/change_aaa) (см. [Переход в другие PCC](change-pcc.html)).
{{< /hint >}}

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

{{< hint warning >}}
Обратите внимание на то, что в Sabre нельзя забронировать дополнительные услуги для младенцев без места.
{{< /hint >}}

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

{{< hint warning >}}
Обратите внимание на то, что в случае запроса списка дополнительных услуг для разных категорий пассажиров (например, для взрослых и детей) необходимо указать соответствующие им тарифы.
{{< /hint >}}

- ```/gao:GetAncillaryOffersRQ/gao:QueryByItinerary/gao:FareInfo/@id``` — уникальный идентификатор тарифа
- ```/gao:GetAncillaryOffersRQ/gao:QueryByItinerary/gao:FareInfo/FareComponentID``` — номер компонента тарифа
- ```/gao:GetAncillaryOffersRQ/gao:QueryByItinerary/gao:FareInfo/GoverningCarrier``` — код перевозчика, зафайлировавшего тариф
- ```/gao:GetAncillaryOffersRQ/gao:QueryByItinerary/gao:FareInfo/FareBasisCode``` — код тарифа

### Пример

{{< details title="Пример запроса" >}}
```XML
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
          <itin:FareBreakAssociation FareInfoRef="fare_1"/>
        </gao:PassengerSegment>
        <gao:PassengerSegment segmentRef="seg_3">
          <itin:FareBreakAssociation FareInfoRef="fare_2"/>
        </gao:PassengerSegment>
        <gao:PassengerSegment segmentRef="seg_4">
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
          <itin:FareBreakAssociation FareInfoRef="fare_1"/>
        </gao:PassengerSegment>
        <gao:PassengerSegment segmentRef="seg_3">
          <itin:FareBreakAssociation FareInfoRef="fare_2"/>
        </gao:PassengerSegment>
        <gao:PassengerSegment segmentRef="seg_4">
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
          <itin:FareBreakAssociation FareInfoRef="fare_3"/>
        </gao:PassengerSegment>
        <gao:PassengerSegment segmentRef="seg_3">
          <itin:FareBreakAssociation FareInfoRef="fare_4"/>
        </gao:PassengerSegment>
        <gao:PassengerSegment segmentRef="seg_4">
          <itin:FareBreakAssociation FareInfoRef="fare_4"/>
        </gao:PassengerSegment>
      </gao:PassengerItinerary>
    </gao:QueryPassengerItinerary>
    <gao:Segment id="seg_1">
      <itin:FlightDetail id="flight_1">
        <flt:Airline>EY</flt:Airline>
        <flt:FlightNumber>2463</flt:FlightNumber>
        <flt:DepartureAirport>SYD</flt:DepartureAirport>
        <flt:DepartureDate>2022-12-01</flt:DepartureDate>
        <flt:DepartureTime>23:25:00</flt:DepartureTime>
        <flt:ArrivalAirport>AUH</flt:ArrivalAirport>
        <flt:ClassOfService>Y</flt:ClassOfService>
      </itin:FlightDetail>
    </gao:Segment>
    <gao:Segment id="seg_2">
      <itin:FlightDetail id="flight_2">
        <flt:Airline>EY</flt:Airline>
        <flt:FlightNumber>25</flt:FlightNumber>
        <flt:DepartureAirport>AUH</flt:DepartureAirport>
        <flt:DepartureDate>2022-12-02</flt:DepartureDate>
        <flt:DepartureTime>10:35:00</flt:DepartureTime>
        <flt:ArrivalAirport>LHR</flt:ArrivalAirport>
        <flt:ClassOfService>Y</flt:ClassOfService>
      </itin:FlightDetail>
    </gao:Segment>
    <gao:Segment id="seg_3">
      <itin:FlightDetail id="flight_3">
        <flt:Airline>EY</flt:Airline>
        <flt:FlightNumber>12</flt:FlightNumber>
        <flt:DepartureAirport>LHR</flt:DepartureAirport>
        <flt:DepartureDate>2022-12-08</flt:DepartureDate>
        <flt:DepartureTime>08:30:00</flt:DepartureTime>
        <flt:ArrivalAirport>AUH</flt:ArrivalAirport>
        <flt:ClassOfService>Y</flt:ClassOfService>
      </itin:FlightDetail>
    </gao:Segment>
    <gao:Segment id="seg_4">
      <itin:FlightDetail id="flight_4">
        <flt:Airline>EY</flt:Airline>
        <flt:FlightNumber>464</flt:FlightNumber>
        <flt:DepartureAirport>AUH</flt:DepartureAirport>
        <flt:DepartureDate>2022-12-08</flt:DepartureDate>
        <flt:DepartureTime>22:10:00</flt:DepartureTime>
        <flt:ArrivalAirport>SYD</flt:ArrivalAirport>
        <flt:ClassOfService>Y</flt:ClassOfService>
      </itin:FlightDetail>
    </gao:Segment>
    <gao:FareInfo id="fare_1">
      <FareComponentID>1</FareComponentID>
      <GoverningCarrier>EY</GoverningCarrier>
      <FareBasisCode>YLWF2AU</FareBasisCode>
    </gao:FareInfo>
    <gao:FareInfo id="fare_2">
      <FareComponentID>2</FareComponentID>
      <GoverningCarrier>EY</GoverningCarrier>
      <FareBasisCode>YLXF2AU</FareBasisCode>
    </gao:FareInfo>
    <gao:FareInfo id="fare_3">
      <FareComponentID>1</FareComponentID>
      <GoverningCarrier>EY</GoverningCarrier>
      <FareBasisCode>YLWF2AUCH</FareBasisCode>
    </gao:FareInfo>
    <gao:FareInfo id="fare_4">
      <FareComponentID>2</FareComponentID>
      <GoverningCarrier>EY</GoverningCarrier>
      <FareBasisCode>YLXF2AUCH</FareBasisCode>
    </gao:FareInfo>
  </gao:QueryByItinerary>
</gao:GetAncillaryOffersRQ>
```
{{< /details >}}

{{< details title="Пример ответа" >}}
```XML
<ns37:GetAncillaryOffersRS xmlns:ns10="http://services.sabre.com/merch/baggage/v02" xmlns:ns11="http://services.sabre.com/merch/seat/v02" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03" xmlns:ns13="http://services.sabre.com/merch/flight/v03" xmlns:ns14="http://services.sabre.com/merch/baggage/v03" xmlns:ns15="http://services.sabre.com/merch/ancillary/v08" xmlns:ns16="http://services.sabre.com/merch/common/v08" xmlns:ns17="http://www.OpenTravel.org/ns/OTA2/AppInfo_v01_00" xmlns:ns18="http://www.w3.org/2000/09/xmldsig#" xmlns:ns19="http://services.sabre.com/essm/core/v1" xmlns:ns2="http://services.sabre.com/merch/common/v03" xmlns:ns20="http://services.sabre.com/merch/ancillary/calculator/v022" xmlns:ns21="http://services.sabre.com/merch/request/v02" xmlns:ns22="http://services.sabre.com/merch/passenger/v02" xmlns:ns23="http://services.sabre.com/STL_Payload/v02_01" xmlns:ns24="http://services.sabre.com/merch/ancillary/calculator/v02" xmlns:ns25="http://www.sabre.com/ns/Ticketing/pqs/1.0" xmlns:ns26="http://www.sabre.com/ns/Ticketing/TTL/1.0" xmlns:ns27="http://services.sabre.com/STL/v01" xmlns:ns28="http://webservices.sabre.com/servicesplatform/mock/1.0.0" xmlns:ns29="http://services.sabre.com/STL/v02" xmlns:ns3="http://opentravel.org/common/message/v02" xmlns:ns30="http://services.sabre.com/merch/ancillary/seatprice/v02" xmlns:ns31="http://services.sabre.com/ssse/trace/v01" xmlns:ns32="http://stl.sabre.com/Merchandising/diagnostics/v2" xmlns:ns33="http://services.sabre.com/merch/passenger/v03" xmlns:ns34="http://schemas.xmlsoap.org/ws/2002/12/secext" xmlns:ns35="http://services.sabre.com/merch/itinerary/v03" xmlns:ns36="http://services.sabre.com/merch/ticket/v03" xmlns:ns37="http://services.sabre.com/merch/ancillary/offer/v03" xmlns:ns38="http://services.sabre.com/merch/request/v03" xmlns:ns39="http://services.sabre.com/merch/ancillary/offer/v02" xmlns:ns4="http://opentravel.org/common/v02" xmlns:ns40="http://services.sabre.com/merch/ancillary/offer/v01" xmlns:ns41="http://services.sabre.com/ANCS/v01" xmlns:ns42="http://services.sabre.com/STL_Payload/v02_00" xmlns:ns43="http://services.sabre.com/merch/ancillary/seatprice/v01" xmlns:ns44="http://webservices.sabre.com/servicesplatform/eiapi/1.0.0" xmlns:ns45="http://www.atse.sabre.com/AncillaryPricing/Request" xmlns:ns46="http://webservices.sabre.com/pnrbuilder/v1_19" xmlns:ns47="http://services.sabre.com/res/or/v1_14" xmlns:ns48="http://jaxb2-commons.dev.java.net/basic/inheritance" xmlns:ns49="http://www.sabre.com/eps/schemas/market_reference" xmlns:ns5="http://www.ebxml.org/namespaces/messageHeader" xmlns:ns50="http://services.sabre.com/essm/diagnostic/v1" xmlns:ns51="http://services.sabre.com/sp/sss/v1" xmlns:ns52="http://services.sabre.com/STL_Header/v02_02" xmlns:ns53="http://services.sabre.com/STL_Header/v120" xmlns:ns54="http://services.sabre.com/STL_Header/v02_01" xmlns:ns55="http://services.sabre.com/merch/ancillary/sellcancel/v01" xmlns:ns56="http://services.sabre.com/merch/ancillary/sellcancel/v02" xmlns:ns57="http://services.sabre.com/STL_Payload/v02_02" xmlns:ns58="http://services.sabre.com/sp/ssp/v1" xmlns:ns59="http://services.sabre.com/essm/session/v1" xmlns:ns6="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns60="http://services.sabre.com/merch/catalog/v01" xmlns:ns61="http://services.sabre.com/merch/ancillary/catalogquery/v01" xmlns:ns62="http://www.atse.sabre.com/AncillaryPricing/Response" xmlns:ns63="http://services.sabre.com/sp/preferences/v1" xmlns:ns64="http://www.sabre.com/eps/schemas" xmlns:ns7="http://www.w3.org/1999/xlink" xmlns:ns8="http://services.sabre.com/merch/ancillary/v02" xmlns:ns9="http://services.sabre.com/merch/common/v02">
  <ns23:ApplicationResults status="Complete">
    <ns23:Success timeStamp="2022-05-20T05:38:10.185-05:00"/>
  </ns23:ApplicationResults>
  <ns37:OfferId>ce847dccc4b6527lfl3eb6bdv0</ns37:OfferId>
  <ns37:AncillaryDefinition id="ancillary_1">
    <SubCode>0NF</SubCode>
    <Airline>EY</Airline>
    <CommercialName>MILES BONUS PURCHASE</CommercialName>
    <Vendor>MMGR</Vendor>
    <Group>FF</Group>
    <GroupDescription>FREQUENT FLIER</GroupDescription>
    <SubGroup>MG</SubGroup>
    <SubGroupDescription>MILEAGE ACCRUAL</SubGroupDescription>
    <SpecialService>GRPF</SpecialService>
    <ReasonForIssuance code="B">GROUND_TRANSPORT_NON_AIR_SERVICES</ReasonForIssuance>
    <SpecialServiceDetails type="OPTIONAL"/>
    <ElectronicMiscDocType code="2">FLIGHT_COUPON_ASSOCIATED</ElectronicMiscDocType>
    <BookingMethod code="01">SPECIAL_SERVICE_REQUEST</BookingMethod>
  </ns37:AncillaryDefinition>
  <ns37:AncillaryDefinition id="ancillary_2">
    <SubCode>0NG</SubCode>
    <Airline>EY</Airline>
    <CommercialName>MILES BONUS TRANSFER</CommercialName>
    <Vendor>MMGR</Vendor>
    <Group>FF</Group>
    <GroupDescription>FREQUENT FLIER</GroupDescription>
    <SubGroup>MG</SubGroup>
    <SubGroupDescription>MILEAGE ACCRUAL</SubGroupDescription>
    <ReasonForIssuance code="B">GROUND_TRANSPORT_NON_AIR_SERVICES</ReasonForIssuance>
    <ElectronicMiscDocType code="2">FLIGHT_COUPON_ASSOCIATED</ElectronicMiscDocType>
    <BookingMethod code="BLANK">ANY_ALLOWED</BookingMethod>
  </ns37:AncillaryDefinition>
  <ns37:AncillaryDefinition id="ancillary_5">
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
  </ns37:AncillaryDefinition>
  <ns37:AncillaryDefinition id="ancillary_6">
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
  </ns37:AncillaryDefinition>
  <ns37:AncillaryDefinition id="ancillary_13">
    <SubCode>AMB</SubCode>
    <Airline>EY</Airline>
    <CommercialName>AIRPORT MILES UG BASE</CommercialName>
    <Vendor>MMGR</Vendor>
    <Group>IE</Group>
    <GroupDescription>IN-FLIGHT ENTERTAINMENT</GroupDescription>
    <ReasonForIssuance code="G">IN_FLIGHT_SERVICES</ReasonForIssuance>
    <ElectronicMiscDocType code="2">FLIGHT_COUPON_ASSOCIATED</ElectronicMiscDocType>
    <BookingMethod code="BLANK">ANY_ALLOWED</BookingMethod>
  </ns37:AncillaryDefinition>
  <ns37:AncillaryDefinition id="ancillary_14">
    <SubCode>AMG</SubCode>
    <Airline>EY</Airline>
    <CommercialName>AIRPORT MILES UG GLD PLT KHAAS</CommercialName>
    <Vendor>MMGR</Vendor>
    <Group>IE</Group>
    <GroupDescription>IN-FLIGHT ENTERTAINMENT</GroupDescription>
    <ReasonForIssuance code="G">IN_FLIGHT_SERVICES</ReasonForIssuance>
    <ElectronicMiscDocType code="2">FLIGHT_COUPON_ASSOCIATED</ElectronicMiscDocType>
    <BookingMethod code="BLANK">ANY_ALLOWED</BookingMethod>
  </ns37:AncillaryDefinition>
  <ns37:AncillaryDefinition id="ancillary_15">
    <SubCode>AMS</SubCode>
    <Airline>EY</Airline>
    <CommercialName>AIRPORT MILES UG SILVER</CommercialName>
    <Vendor>MMGR</Vendor>
    <Group>IE</Group>
    <GroupDescription>IN-FLIGHT ENTERTAINMENT</GroupDescription>
    <ReasonForIssuance code="G">IN_FLIGHT_SERVICES</ReasonForIssuance>
    <ElectronicMiscDocType code="2">FLIGHT_COUPON_ASSOCIATED</ElectronicMiscDocType>
    <BookingMethod code="BLANK">ANY_ALLOWED</BookingMethod>
  </ns37:AncillaryDefinition>
  <ns37:AncillaryDefinition id="ancillary_16">
    <SubCode>ELS</SubCode>
    <Airline>EY</Airline>
    <CommercialName>ECONOMY SPACE</CommercialName>
    <Vendor>MMGR</Vendor>
    <Group>IE</Group>
    <GroupDescription>IN-FLIGHT ENTERTAINMENT</GroupDescription>
    <ReasonForIssuance code="G">IN_FLIGHT_SERVICES</ReasonForIssuance>
    <ElectronicMiscDocType code="2">FLIGHT_COUPON_ASSOCIATED</ElectronicMiscDocType>
    <BookingMethod code="BLANK">ANY_ALLOWED</BookingMethod>
  </ns37:AncillaryDefinition>
  <ns37:AncillaryDefinition id="ancillary_17">
    <SubCode>IUC</SubCode>
    <Airline>EY</Airline>
    <CommercialName>INSTANT AIRPORT UPGRADE Y TO C</CommercialName>
    <Vendor>MMGR</Vendor>
    <Group>IE</Group>
    <GroupDescription>IN-FLIGHT ENTERTAINMENT</GroupDescription>
    <ReasonForIssuance code="I">INDIVIDUAL_AIRLINE_USE</ReasonForIssuance>
    <ElectronicMiscDocType code="2">FLIGHT_COUPON_ASSOCIATED</ElectronicMiscDocType>
    <BookingMethod code="BLANK">ANY_ALLOWED</BookingMethod>
  </ns37:AncillaryDefinition>
  <ns37:AncillaryDefinition id="ancillary_18">
    <SubCode>IUY</SubCode>
    <Airline>EY</Airline>
    <CommercialName>INSTANT AIRPORT UPGRADE C TO F</CommercialName>
    <Vendor>MMGR</Vendor>
    <Group>IE</Group>
    <GroupDescription>IN-FLIGHT ENTERTAINMENT</GroupDescription>
    <ReasonForIssuance code="I">INDIVIDUAL_AIRLINE_USE</ReasonForIssuance>
    <ElectronicMiscDocType code="2">FLIGHT_COUPON_ASSOCIATED</ElectronicMiscDocType>
    <BookingMethod code="BLANK">ANY_ALLOWED</BookingMethod>
  </ns37:AncillaryDefinition>
  <ns37:AncillaryDefinition id="ancillary_19">
    <SubCode>NFS</SubCode>
    <Airline>EY</Airline>
    <CommercialName>NEIGHBOR FREE SEAT</CommercialName>
    <Vendor>MMGR</Vendor>
    <Group>IE</Group>
    <GroupDescription>IN-FLIGHT ENTERTAINMENT</GroupDescription>
    <ReasonForIssuance code="G">IN_FLIGHT_SERVICES</ReasonForIssuance>
    <ElectronicMiscDocType code="2">FLIGHT_COUPON_ASSOCIATED</ElectronicMiscDocType>
    <BookingMethod code="BLANK">ANY_ALLOWED</BookingMethod>
  </ns37:AncillaryDefinition>
  <ns37:AncillaryDefinition id="ancillary_20">
    <SubCode>PLS</SubCode>
    <Airline>EY</Airline>
    <CommercialName>PLUS GRADE Y TO J</CommercialName>
    <Vendor>MMGR</Vendor>
    <Group>IE</Group>
    <GroupDescription>IN-FLIGHT ENTERTAINMENT</GroupDescription>
    <ReasonForIssuance code="G">IN_FLIGHT_SERVICES</ReasonForIssuance>
    <ElectronicMiscDocType code="2">FLIGHT_COUPON_ASSOCIATED</ElectronicMiscDocType>
    <BookingMethod code="BLANK">ANY_ALLOWED</BookingMethod>
  </ns37:AncillaryDefinition>
  <ns37:AncillaryDefinition id="ancillary_21">
    <SubCode>PUC</SubCode>
    <Airline>EY</Airline>
    <CommercialName>PUSH UPGRADE Y TO C</CommercialName>
    <Vendor>MMGR</Vendor>
    <Group>IE</Group>
    <GroupDescription>IN-FLIGHT ENTERTAINMENT</GroupDescription>
    <ReasonForIssuance code="G">IN_FLIGHT_SERVICES</ReasonForIssuance>
    <ElectronicMiscDocType code="2">FLIGHT_COUPON_ASSOCIATED</ElectronicMiscDocType>
    <BookingMethod code="BLANK">ANY_ALLOWED</BookingMethod>
  </ns37:AncillaryDefinition>
  <ns37:AncillaryDefinition id="ancillary_22">
    <SubCode>PUY</SubCode>
    <Airline>EY</Airline>
    <CommercialName>PUSH UPGARDE C TO F</CommercialName>
    <Vendor>MMGR</Vendor>
    <Group>IE</Group>
    <GroupDescription>IN-FLIGHT ENTERTAINMENT</GroupDescription>
    <ReasonForIssuance code="G">IN_FLIGHT_SERVICES</ReasonForIssuance>
    <ElectronicMiscDocType code="2">FLIGHT_COUPON_ASSOCIATED</ElectronicMiscDocType>
    <BookingMethod code="BLANK">ANY_ALLOWED</BookingMethod>
  </ns37:AncillaryDefinition>
  <ns37:AncillaryDefinition id="ancillary_23">
    <SubCode>SCS</SubCode>
    <Airline>EY</Airline>
    <CommercialName>SPECIAL CATERING 1380</CommercialName>
    <Vendor>MMGR</Vendor>
    <Group>IE</Group>
    <GroupDescription>IN-FLIGHT ENTERTAINMENT</GroupDescription>
    <ReasonForIssuance code="G">IN_FLIGHT_SERVICES</ReasonForIssuance>
    <ElectronicMiscDocType code="2">FLIGHT_COUPON_ASSOCIATED</ElectronicMiscDocType>
    <BookingMethod code="BLANK">ANY_ALLOWED</BookingMethod>
  </ns37:AncillaryDefinition>
  <ns37:AncillaryDefinition id="ancillary_27">
    <SubCode>HDC</SubCode>
    <Airline>EY</Airline>
    <CommercialName>HUB DISRUPTION COST</CommercialName>
    <Vendor>MMGR</Vendor>
    <Group>IE</Group>
    <GroupDescription>IN-FLIGHT ENTERTAINMENT</GroupDescription>
    <ReasonForIssuance code="G">IN_FLIGHT_SERVICES</ReasonForIssuance>
    <ElectronicMiscDocType code="2">FLIGHT_COUPON_ASSOCIATED</ElectronicMiscDocType>
    <BookingMethod code="BLANK">ANY_ALLOWED</BookingMethod>
  </ns37:AncillaryDefinition>
  <ns37:AncillaryDefinition id="ancillary_57">
    <SubCode>0B4</SubCode>
    <Airline>EY</Airline>
    <CommercialName>OXYGEN</CommercialName>
    <Vendor>MMGR</Vendor>
    <Group>MD</Group>
    <GroupDescription>MEDICAL</GroupDescription>
    <SubGroup>OX</SubGroup>
    <SubGroupDescription>OXYGEN</SubGroupDescription>
    <SpecialService>OXYG</SpecialService>
    <ReasonForIssuance code="E">AIRPORT_SERVICES</ReasonForIssuance>
    <SpecialServiceDetails type="NOTALLOWED"/>
    <ElectronicMiscDocType code="2">FLIGHT_COUPON_ASSOCIATED</ElectronicMiscDocType>
    <BookingMethod code="01">SPECIAL_SERVICE_REQUEST</BookingMethod>
  </ns37:AncillaryDefinition>
  <ns37:AncillaryDefinition id="ancillary_61">
    <SubCode>0AT</SubCode>
    <Airline>EY</Airline>
    <CommercialName>SNACK</CommercialName>
    <Vendor>MMGR</Vendor>
    <Group>ML</Group>
    <GroupDescription>MEAL/BEVERAGE</GroupDescription>
    <SubGroup>SN</SubGroup>
    <SubGroupDescription>SNACK</SubGroupDescription>
    <ReasonForIssuance code="G">IN_FLIGHT_SERVICES</ReasonForIssuance>
    <ElectronicMiscDocType code="2">FLIGHT_COUPON_ASSOCIATED</ElectronicMiscDocType>
    <BookingMethod code="BLANK">ANY_ALLOWED</BookingMethod>
  </ns37:AncillaryDefinition>
  <ns37:AncillaryDefinition id="ancillary_62">
    <SubCode>01F</SubCode>
    <Airline>EY</Airline>
    <CommercialName>JAPANESE MEAL</CommercialName>
    <Vendor>MMGR</Vendor>
    <Group>ML</Group>
    <GroupDescription>MEAL/BEVERAGE</GroupDescription>
    <ReasonForIssuance code="G">IN_FLIGHT_SERVICES</ReasonForIssuance>
    <ElectronicMiscDocType code="2">FLIGHT_COUPON_ASSOCIATED</ElectronicMiscDocType>
    <BookingMethod code="BLANK">ANY_ALLOWED</BookingMethod>
  </ns37:AncillaryDefinition>
  <ns37:AncillaryDefinition id="ancillary_67">
    <SubCode>FAL</SubCode>
    <Airline>EY</Airline>
    <CommercialName>FALCON</CommercialName>
    <Vendor>MMGR</Vendor>
    <Group>PT</Group>
    <GroupDescription>PETS</GroupDescription>
    <ReasonForIssuance code="I">INDIVIDUAL_AIRLINE_USE</ReasonForIssuance>
    <ElectronicMiscDocType code="2">FLIGHT_COUPON_ASSOCIATED</ElectronicMiscDocType>
    <BookingMethod code="BLANK">ANY_ALLOWED</BookingMethod>
  </ns37:AncillaryDefinition>
  <ns37:AncillaryDefinition id="ancillary_69">
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
  </ns37:AncillaryDefinition>
  <ns37:AncillaryDefinition id="ancillary_137">
    <SubCode>0BV</SubCode>
    <Airline>EY</Airline>
    <CommercialName>STANDBY</CommercialName>
    <Vendor>MMGR</Vendor>
    <Group>SB</Group>
    <GroupDescription>STANDBY</GroupDescription>
    <ReasonForIssuance code="B">GROUND_TRANSPORT_NON_AIR_SERVICES</ReasonForIssuance>
    <ElectronicMiscDocType code="2">FLIGHT_COUPON_ASSOCIATED</ElectronicMiscDocType>
    <BookingMethod code="BLANK">ANY_ALLOWED</BookingMethod>
  </ns37:AncillaryDefinition>
  <ns37:AncillaryDefinition id="ancillary_138">
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
  </ns37:AncillaryDefinition>
  <ns37:AncillaryDefinition id="ancillary_145">
    <SubCode>03P</SubCode>
    <Airline>EY</Airline>
    <CommercialName>PRIORITY ACCESS</CommercialName>
    <Vendor>ATP</Vendor>
    <Group>TS</Group>
    <GroupDescription>TRAVEL SERVICES</GroupDescription>
    <SubGroup>PO</SubGroup>
    <SubGroupDescription>PRIORITY CHECK IN</SubGroupDescription>
    <SpecialService>PRIO</SpecialService>
    <ReasonForIssuance code="A">AIR_TRANSPORTATION</ReasonForIssuance>
    <SpecialServiceDetails type="NOTALLOWED"/>
    <ElectronicMiscDocType code="2">FLIGHT_COUPON_ASSOCIATED</ElectronicMiscDocType>
    <BookingMethod code="01">SPECIAL_SERVICE_REQUEST</BookingMethod>
  </ns37:AncillaryDefinition>
  <ns37:AncillaryDefinition id="ancillary_146">
    <SubCode>0L6</SubCode>
    <Airline>EY</Airline>
    <CommercialName>SPLIT GROUP</CommercialName>
    <Vendor>MMGR</Vendor>
    <Group>TS</Group>
    <GroupDescription>TRAVEL SERVICES</GroupDescription>
    <ReasonForIssuance code="B">GROUND_TRANSPORT_NON_AIR_SERVICES</ReasonForIssuance>
    <ElectronicMiscDocType code="2">FLIGHT_COUPON_ASSOCIATED</ElectronicMiscDocType>
    <BookingMethod code="BLANK">ANY_ALLOWED</BookingMethod>
  </ns37:AncillaryDefinition>
  <ns37:AncillaryDefinition id="ancillary_150">
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
  </ns37:AncillaryDefinition>
  <ns37:AncillaryDefinition id="ancillary_154">
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
  </ns37:AncillaryDefinition>
  <ns37:AncillaryDefinition id="ancillary_156">
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
  </ns37:AncillaryDefinition>
  <ns37:AncillaryDefinition id="ancillary_160">
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
  </ns37:AncillaryDefinition>
  <ns37:AncillaryDefinition id="ancillary_164">
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
  </ns37:AncillaryDefinition>
  <ns37:AncillaryDefinition id="ancillary_168">
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
  </ns37:AncillaryDefinition>
  <ns37:AncillaryDefinition id="ancillary_170">
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
  </ns37:AncillaryDefinition>
  <ns37:AncillaryDefinition id="ancillary_545">
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
  </ns37:AncillaryDefinition>
  <ns37:Ancillary ancillaryDefinitionRef="ancillary_1" ancillaryId="ancillary_ancillary_1">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>P</SectorPortionInd>
    <SequenceNumber>2000</SequenceNumber>
    <TravelDateEffective>2014-02-27</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>PAYMENT_REQUIRED</AirExtraStatus>
    <Footnote>N</Footnote>
  </ns37:Ancillary>
  <ns37:Ancillary ancillaryDefinitionRef="ancillary_2" ancillaryId="ancillary_ancillary_2">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>1000</SequenceNumber>
    <TravelDateEffective>2014-02-27</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>PAYMENT_REQUIRED</AirExtraStatus>
    <Footnote>N</Footnote>
  </ns37:Ancillary>
  <ns37:Ancillary ancillaryDefinitionRef="ancillary_5" ancillaryId="ancillary_ancillary_5">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>2000</SequenceNumber>
    <TravelDateEffective>2013-08-01</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>PAYMENT_REQUIRED</AirExtraStatus>
    <Footnote>X</Footnote>
  </ns37:Ancillary>
  <ns37:Ancillary ancillaryDefinitionRef="ancillary_6" ancillaryId="ancillary_ancillary_6">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>1000</SequenceNumber>
    <TravelDateEffective>2014-12-05</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>PAYMENT_REQUIRED</AirExtraStatus>
    <Footnote>N</Footnote>
  </ns37:Ancillary>
  <ns37:Ancillary ancillaryDefinitionRef="ancillary_5" ancillaryId="ancillary_ancillary_7">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>1000</SequenceNumber>
    <TravelDateEffective>2013-08-01</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>PAYMENT_REQUIRED</AirExtraStatus>
    <Footnote>X</Footnote>
  </ns37:Ancillary>
  <ns37:Ancillary ancillaryDefinitionRef="ancillary_13" ancillaryId="ancillary_ancillary_13">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>1000</SequenceNumber>
    <TravelDateEffective>2020-12-07</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>PAYMENT_REQUIRED</AirExtraStatus>
    <Footnote>X</Footnote>
  </ns37:Ancillary>
  <ns37:Ancillary ancillaryDefinitionRef="ancillary_14" ancillaryId="ancillary_ancillary_14">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>15000</SequenceNumber>
    <TravelDateEffective>2017-11-16</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>PAYMENT_REQUIRED</AirExtraStatus>
    <Footnote>X</Footnote>
  </ns37:Ancillary>
  <ns37:Ancillary ancillaryDefinitionRef="ancillary_15" ancillaryId="ancillary_ancillary_15">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>15000</SequenceNumber>
    <TravelDateEffective>2017-11-21</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>PAYMENT_REQUIRED</AirExtraStatus>
    <Footnote>X</Footnote>
  </ns37:Ancillary>
  <ns37:Ancillary ancillaryDefinitionRef="ancillary_16" ancillaryId="ancillary_ancillary_16">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>1000</SequenceNumber>
    <TravelDateEffective>2017-11-06</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>PAYMENT_REQUIRED</AirExtraStatus>
    <Footnote>N</Footnote>
  </ns37:Ancillary>
  <ns37:Ancillary ancillaryDefinitionRef="ancillary_17" ancillaryId="ancillary_ancillary_17">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>52000</SequenceNumber>
    <TravelDateEffective>2013-07-24</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>PAYMENT_REQUIRED</AirExtraStatus>
    <Footnote>N</Footnote>
  </ns37:Ancillary>
  <ns37:Ancillary ancillaryDefinitionRef="ancillary_18" ancillaryId="ancillary_ancillary_18">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>44000</SequenceNumber>
    <TravelDateEffective>2013-07-14</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>PAYMENT_REQUIRED</AirExtraStatus>
    <Footnote>N</Footnote>
  </ns37:Ancillary>
  <ns37:Ancillary ancillaryDefinitionRef="ancillary_19" ancillaryId="ancillary_ancillary_19">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>2000</SequenceNumber>
    <TravelDateEffective>2017-02-22</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>PAYMENT_REQUIRED</AirExtraStatus>
    <Footnote/>
  </ns37:Ancillary>
  <ns37:Ancillary ancillaryDefinitionRef="ancillary_20" ancillaryId="ancillary_ancillary_20">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>1000</SequenceNumber>
    <TravelDateEffective>2018-11-25</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>PAYMENT_REQUIRED</AirExtraStatus>
    <Footnote>N</Footnote>
  </ns37:Ancillary>
  <ns37:Ancillary ancillaryDefinitionRef="ancillary_21" ancillaryId="ancillary_ancillary_21">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>73000</SequenceNumber>
    <TravelDateEffective>2013-02-28</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>PAYMENT_REQUIRED</AirExtraStatus>
    <Footnote>N</Footnote>
  </ns37:Ancillary>
  <ns37:Ancillary ancillaryDefinitionRef="ancillary_22" ancillaryId="ancillary_ancillary_22">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>17000</SequenceNumber>
    <TravelDateEffective>2013-02-28</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>PAYMENT_REQUIRED</AirExtraStatus>
    <Footnote>N</Footnote>
  </ns37:Ancillary>
  <ns37:Ancillary ancillaryDefinitionRef="ancillary_23" ancillaryId="ancillary_ancillary_23">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>1000</SequenceNumber>
    <TravelDateEffective>2014-09-03</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>NO_AE</AirExtraStatus>
    <Footnote>*</Footnote>
  </ns37:Ancillary>
  <ns37:Ancillary ancillaryDefinitionRef="ancillary_14" ancillaryId="ancillary_ancillary_25">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>5000</SequenceNumber>
    <TravelDateEffective>2017-11-15</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>PAYMENT_REQUIRED</AirExtraStatus>
    <Footnote>X</Footnote>
  </ns37:Ancillary>
  <ns37:Ancillary ancillaryDefinitionRef="ancillary_15" ancillaryId="ancillary_ancillary_26">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>1000</SequenceNumber>
    <TravelDateEffective>2017-11-15</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>PAYMENT_REQUIRED</AirExtraStatus>
    <Footnote>X</Footnote>
  </ns37:Ancillary>
  <ns37:Ancillary ancillaryDefinitionRef="ancillary_27" ancillaryId="ancillary_ancillary_27">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>30000</SequenceNumber>
    <TravelDateEffective>2018-09-27</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>PAYMENT_REQUIRED</AirExtraStatus>
    <Footnote>N</Footnote>
  </ns37:Ancillary>
  <ns37:Ancillary ancillaryDefinitionRef="ancillary_17" ancillaryId="ancillary_ancillary_28">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>102000</SequenceNumber>
    <TravelDateEffective>2014-12-22</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>PAYMENT_REQUIRED</AirExtraStatus>
    <Footnote>N</Footnote>
  </ns37:Ancillary>
  <ns37:Ancillary ancillaryDefinitionRef="ancillary_18" ancillaryId="ancillary_ancillary_29">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>24000</SequenceNumber>
    <TravelDateEffective>2014-12-22</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>PAYMENT_REQUIRED</AirExtraStatus>
    <Footnote>N</Footnote>
  </ns37:Ancillary>
  <ns37:Ancillary ancillaryDefinitionRef="ancillary_21" ancillaryId="ancillary_ancillary_32">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>69000</SequenceNumber>
    <TravelDateEffective>2013-02-28</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>PAYMENT_REQUIRED</AirExtraStatus>
    <Footnote>N</Footnote>
  </ns37:Ancillary>
  <ns37:Ancillary ancillaryDefinitionRef="ancillary_22" ancillaryId="ancillary_ancillary_33">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>9000</SequenceNumber>
    <TravelDateEffective>2013-02-28</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>PAYMENT_REQUIRED</AirExtraStatus>
    <Footnote>N</Footnote>
  </ns37:Ancillary>
  <ns37:Ancillary ancillaryDefinitionRef="ancillary_17" ancillaryId="ancillary_ancillary_38">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>188000</SequenceNumber>
    <TravelDateEffective>2015-06-15</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>PAYMENT_REQUIRED</AirExtraStatus>
    <Footnote>N</Footnote>
  </ns37:Ancillary>
  <ns37:Ancillary ancillaryDefinitionRef="ancillary_18" ancillaryId="ancillary_ancillary_39">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>9000</SequenceNumber>
    <TravelDateEffective>2014-12-22</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>PAYMENT_REQUIRED</AirExtraStatus>
    <Footnote>N</Footnote>
  </ns37:Ancillary>
  <ns37:Ancillary ancillaryDefinitionRef="ancillary_27" ancillaryId="ancillary_ancillary_49">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>23000</SequenceNumber>
    <TravelDateEffective>2018-09-27</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>PAYMENT_REQUIRED</AirExtraStatus>
    <Footnote>N</Footnote>
  </ns37:Ancillary>
  <ns37:Ancillary ancillaryDefinitionRef="ancillary_17" ancillaryId="ancillary_ancillary_50">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>109000</SequenceNumber>
    <TravelDateEffective>2013-07-24</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>PAYMENT_REQUIRED</AirExtraStatus>
    <Footnote>N</Footnote>
  </ns37:Ancillary>
  <ns37:Ancillary ancillaryDefinitionRef="ancillary_18" ancillaryId="ancillary_ancillary_51">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>17000</SequenceNumber>
    <TravelDateEffective>2013-07-24</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>PAYMENT_REQUIRED</AirExtraStatus>
    <Footnote>N</Footnote>
  </ns37:Ancillary>
  <ns37:Ancillary ancillaryDefinitionRef="ancillary_57" ancillaryId="ancillary_ancillary_57">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>1000</SequenceNumber>
    <TravelDateEffective>2016-06-06</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>PAYMENT_REQUIRED</AirExtraStatus>
    <Footnote>X</Footnote>
  </ns37:Ancillary>
  <ns37:Ancillary ancillaryDefinitionRef="ancillary_61" ancillaryId="ancillary_ancillary_61">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>3000</SequenceNumber>
    <TravelDateEffective>2015-11-03</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>PAYMENT_REQUIRED</AirExtraStatus>
    <Footnote>/</Footnote>
  </ns37:Ancillary>
  <ns37:Ancillary ancillaryDefinitionRef="ancillary_62" ancillaryId="ancillary_ancillary_62">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>1000</SequenceNumber>
    <TravelDateEffective>2013-08-14</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>PAYMENT_REQUIRED</AirExtraStatus>
    <Footnote/>
  </ns37:Ancillary>
  <ns37:Ancillary ancillaryDefinitionRef="ancillary_67" ancillaryId="ancillary_ancillary_67">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>P</SectorPortionInd>
    <SequenceNumber>37000</SequenceNumber>
    <TravelDateEffective>2017-05-17</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>PAYMENT_REQUIRED</AirExtraStatus>
    <Footnote>N</Footnote>
  </ns37:Ancillary>
  <ns37:Ancillary ancillaryDefinitionRef="ancillary_69" ancillaryId="ancillary_ancillary_69">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>278130</SequenceNumber>
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
  </ns37:Ancillary>
  <ns37:Ancillary ancillaryDefinitionRef="ancillary_69" ancillaryId="ancillary_ancillary_70">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>316630</SequenceNumber>
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
  </ns37:Ancillary>
  <ns37:Ancillary ancillaryDefinitionRef="ancillary_69" ancillaryId="ancillary_ancillary_71">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>527130</SequenceNumber>
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
  </ns37:Ancillary>
  <ns37:Ancillary ancillaryDefinitionRef="ancillary_69" ancillaryId="ancillary_ancillary_72">
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
  </ns37:Ancillary>
  <ns37:Ancillary ancillaryDefinitionRef="ancillary_69" ancillaryId="ancillary_ancillary_73">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>571130</SequenceNumber>
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
          <Code>W</Code>
          <TranslatedName>WINDOW</TranslatedName>
          <AbbreviatedName>WIND</AbbreviatedName>
        </Characteristic>
      </PADIS_CodeTableInfo>
    </PADIS_SeatProcessing>
    <Footnote>@</Footnote>
  </ns37:Ancillary>
  <ns37:Ancillary ancillaryDefinitionRef="ancillary_69" ancillaryId="ancillary_ancillary_74">
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
  </ns37:Ancillary>
  <ns37:Ancillary ancillaryDefinitionRef="ancillary_69" ancillaryId="ancillary_ancillary_75">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>573130</SequenceNumber>
    <TravelDateEffective>1980-01-01</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>PAYMENT_REQUIRED</AirExtraStatus>
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
  </ns37:Ancillary>
  <ns37:Ancillary ancillaryDefinitionRef="ancillary_69" ancillaryId="ancillary_ancillary_76">
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
  </ns37:Ancillary>
  <ns37:Ancillary ancillaryDefinitionRef="ancillary_69" ancillaryId="ancillary_ancillary_77">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>575130</SequenceNumber>
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
      </PADIS_CodeTableInfo>
    </PADIS_SeatProcessing>
    <Footnote>@</Footnote>
  </ns37:Ancillary>
  <ns37:Ancillary ancillaryDefinitionRef="ancillary_69" ancillaryId="ancillary_ancillary_78">
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
  </ns37:Ancillary>
  <ns37:Ancillary ancillaryDefinitionRef="ancillary_69" ancillaryId="ancillary_ancillary_79">
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
  </ns37:Ancillary>
  <ns37:Ancillary ancillaryDefinitionRef="ancillary_69" ancillaryId="ancillary_ancillary_80">
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
  </ns37:Ancillary>
  <ns37:Ancillary ancillaryDefinitionRef="ancillary_69" ancillaryId="ancillary_ancillary_81">
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
  </ns37:Ancillary>
  <ns37:Ancillary ancillaryDefinitionRef="ancillary_69" ancillaryId="ancillary_ancillary_82">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>692380</SequenceNumber>
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
  </ns37:Ancillary>
  <ns37:Ancillary ancillaryDefinitionRef="ancillary_69" ancillaryId="ancillary_ancillary_83">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>692880</SequenceNumber>
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
          <Code>W</Code>
          <TranslatedName>WINDOW</TranslatedName>
          <AbbreviatedName>WIND</AbbreviatedName>
        </Characteristic>
      </PADIS_CodeTableInfo>
    </PADIS_SeatProcessing>
    <Footnote>@</Footnote>
  </ns37:Ancillary>
  <ns37:Ancillary ancillaryDefinitionRef="ancillary_69" ancillaryId="ancillary_ancillary_84">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>693380</SequenceNumber>
    <TravelDateEffective>1980-01-01</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>PAYMENT_REQUIRED</AirExtraStatus>
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
  </ns37:Ancillary>
  <ns37:Ancillary ancillaryDefinitionRef="ancillary_69" ancillaryId="ancillary_ancillary_85">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>693880</SequenceNumber>
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
      </PADIS_CodeTableInfo>
    </PADIS_SeatProcessing>
    <Footnote>@</Footnote>
  </ns37:Ancillary>
  <ns37:Ancillary ancillaryDefinitionRef="ancillary_69" ancillaryId="ancillary_ancillary_86">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>277630</SequenceNumber>
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
  </ns37:Ancillary>
  <ns37:Ancillary ancillaryDefinitionRef="ancillary_69" ancillaryId="ancillary_ancillary_87">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>316130</SequenceNumber>
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
  </ns37:Ancillary>
  <ns37:Ancillary ancillaryDefinitionRef="ancillary_69" ancillaryId="ancillary_ancillary_88">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>528130</SequenceNumber>
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
  </ns37:Ancillary>
  <ns37:Ancillary ancillaryDefinitionRef="ancillary_69" ancillaryId="ancillary_ancillary_89">
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
  </ns37:Ancillary>
  <ns37:Ancillary ancillaryDefinitionRef="ancillary_69" ancillaryId="ancillary_ancillary_90">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>572130</SequenceNumber>
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
          <Code>W</Code>
          <TranslatedName>WINDOW</TranslatedName>
          <AbbreviatedName>WIND</AbbreviatedName>
        </Characteristic>
      </PADIS_CodeTableInfo>
    </PADIS_SeatProcessing>
    <Footnote>@</Footnote>
  </ns37:Ancillary>
  <ns37:Ancillary ancillaryDefinitionRef="ancillary_69" ancillaryId="ancillary_ancillary_91">
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
  </ns37:Ancillary>
  <ns37:Ancillary ancillaryDefinitionRef="ancillary_69" ancillaryId="ancillary_ancillary_92">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>574130</SequenceNumber>
    <TravelDateEffective>1980-01-01</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>PAYMENT_REQUIRED</AirExtraStatus>
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
  </ns37:Ancillary>
  <ns37:Ancillary ancillaryDefinitionRef="ancillary_69" ancillaryId="ancillary_ancillary_93">
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
  </ns37:Ancillary>
  <ns37:Ancillary ancillaryDefinitionRef="ancillary_69" ancillaryId="ancillary_ancillary_94">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>576130</SequenceNumber>
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
      </PADIS_CodeTableInfo>
    </PADIS_SeatProcessing>
    <Footnote>@</Footnote>
  </ns37:Ancillary>
  <ns37:Ancillary ancillaryDefinitionRef="ancillary_69" ancillaryId="ancillary_ancillary_95">
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
  </ns37:Ancillary>
  <ns37:Ancillary ancillaryDefinitionRef="ancillary_69" ancillaryId="ancillary_ancillary_96">
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
  </ns37:Ancillary>
  <ns37:Ancillary ancillaryDefinitionRef="ancillary_69" ancillaryId="ancillary_ancillary_97">
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
  </ns37:Ancillary>
  <ns37:Ancillary ancillaryDefinitionRef="ancillary_69" ancillaryId="ancillary_ancillary_98">
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
  </ns37:Ancillary>
  <ns37:Ancillary ancillaryDefinitionRef="ancillary_69" ancillaryId="ancillary_ancillary_99">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>692630</SequenceNumber>
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
  </ns37:Ancillary>
  <ns37:Ancillary ancillaryDefinitionRef="ancillary_69" ancillaryId="ancillary_ancillary_100">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>693130</SequenceNumber>
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
          <Code>W</Code>
          <TranslatedName>WINDOW</TranslatedName>
          <AbbreviatedName>WIND</AbbreviatedName>
        </Characteristic>
      </PADIS_CodeTableInfo>
    </PADIS_SeatProcessing>
    <Footnote>@</Footnote>
  </ns37:Ancillary>
  <ns37:Ancillary ancillaryDefinitionRef="ancillary_69" ancillaryId="ancillary_ancillary_101">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>693630</SequenceNumber>
    <TravelDateEffective>1980-01-01</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>PAYMENT_REQUIRED</AirExtraStatus>
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
  </ns37:Ancillary>
  <ns37:Ancillary ancillaryDefinitionRef="ancillary_69" ancillaryId="ancillary_ancillary_102">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>694130</SequenceNumber>
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
      </PADIS_CodeTableInfo>
    </PADIS_SeatProcessing>
    <Footnote>@</Footnote>
  </ns37:Ancillary>
  <ns37:Ancillary ancillaryDefinitionRef="ancillary_137" ancillaryId="ancillary_ancillary_137">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>4000</SequenceNumber>
    <TravelDateEffective>2014-02-25</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>PAYMENT_REQUIRED</AirExtraStatus>
    <Footnote>N</Footnote>
  </ns37:Ancillary>
  <ns37:Ancillary ancillaryDefinitionRef="ancillary_138" ancillaryId="ancillary_ancillary_138">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>4000</SequenceNumber>
    <TravelDateEffective>2014-02-25</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>PAYMENT_REQUIRED</AirExtraStatus>
    <Footnote>X</Footnote>
  </ns37:Ancillary>
  <ns37:Ancillary ancillaryDefinitionRef="ancillary_137" ancillaryId="ancillary_ancillary_139">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>3000</SequenceNumber>
    <TravelDateEffective>2014-02-27</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>PAYMENT_REQUIRED</AirExtraStatus>
    <Footnote>N</Footnote>
  </ns37:Ancillary>
  <ns37:Ancillary ancillaryDefinitionRef="ancillary_138" ancillaryId="ancillary_ancillary_140">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>P</SectorPortionInd>
    <SequenceNumber>3000</SequenceNumber>
    <TravelDateEffective>2014-02-27</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>PAYMENT_REQUIRED</AirExtraStatus>
    <Footnote>N</Footnote>
  </ns37:Ancillary>
  <ns37:Ancillary ancillaryDefinitionRef="ancillary_145" ancillaryId="ancillary_ancillary_145">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>P</SectorPortionInd>
    <SequenceNumber>37562</SequenceNumber>
    <TravelDateEffective>1980-01-01</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>PAYMENT_REQUIRED</AirExtraStatus>
    <Footnote>N</Footnote>
  </ns37:Ancillary>
  <ns37:Ancillary ancillaryDefinitionRef="ancillary_146" ancillaryId="ancillary_ancillary_146">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>P</SectorPortionInd>
    <SequenceNumber>5000</SequenceNumber>
    <TravelDateEffective>2014-02-27</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>PAYMENT_REQUIRED</AirExtraStatus>
    <Footnote>N</Footnote>
  </ns37:Ancillary>
  <ns37:Ancillary ancillaryDefinitionRef="ancillary_150" ancillaryId="ancillary_ancillary_150">
    <ServiceType>C</ServiceType>
    <SectorPortionInd>P</SectorPortionInd>
    <BaggageData>
      <FirstOccurrence>-1</FirstOccurrence>
      <LastOccurrence>-1</LastOccurrence>
      <Weight unit="KILO">15</Weight>
    </BaggageData>
    <SequenceNumber>37691</SequenceNumber>
    <TravelDateEffective>2021-11-11</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>PAYMENT_REQUIRED</AirExtraStatus>
    <Footnote>N</Footnote>
  </ns37:Ancillary>
  <ns37:Ancillary ancillaryDefinitionRef="ancillary_154" ancillaryId="ancillary_ancillary_154">
    <ServiceType>C</ServiceType>
    <SectorPortionInd>P</SectorPortionInd>
    <BaggageData>
      <FirstOccurrence>-1</FirstOccurrence>
      <LastOccurrence>-1</LastOccurrence>
      <Weight unit="KILO">20</Weight>
    </BaggageData>
    <SequenceNumber>33411</SequenceNumber>
    <TravelDateEffective>1980-01-01</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>PAYMENT_REQUIRED</AirExtraStatus>
    <Footnote>N</Footnote>
  </ns37:Ancillary>
  <ns37:Ancillary ancillaryDefinitionRef="ancillary_156" ancillaryId="ancillary_ancillary_156">
    <ServiceType>C</ServiceType>
    <SectorPortionInd>P</SectorPortionInd>
    <BaggageData>
      <FirstOccurrence>-1</FirstOccurrence>
      <LastOccurrence>-1</LastOccurrence>
      <Weight unit="KILO">25</Weight>
    </BaggageData>
    <SequenceNumber>37941</SequenceNumber>
    <TravelDateEffective>2021-11-11</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>PAYMENT_REQUIRED</AirExtraStatus>
    <Footnote>N</Footnote>
  </ns37:Ancillary>
  <ns37:Ancillary ancillaryDefinitionRef="ancillary_160" ancillaryId="ancillary_ancillary_160">
    <ServiceType>C</ServiceType>
    <SectorPortionInd>P</SectorPortionInd>
    <BaggageData>
      <FirstOccurrence>-1</FirstOccurrence>
      <LastOccurrence>-1</LastOccurrence>
      <Weight unit="KILO">30</Weight>
    </BaggageData>
    <SequenceNumber>37941</SequenceNumber>
    <TravelDateEffective>2021-11-11</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>PAYMENT_REQUIRED</AirExtraStatus>
    <Footnote>N</Footnote>
  </ns37:Ancillary>
  <ns37:Ancillary ancillaryDefinitionRef="ancillary_164" ancillaryId="ancillary_ancillary_164">
    <ServiceType>C</ServiceType>
    <SectorPortionInd>P</SectorPortionInd>
    <BaggageData>
      <FirstOccurrence>-1</FirstOccurrence>
      <LastOccurrence>-1</LastOccurrence>
      <Weight unit="KILO">35</Weight>
    </BaggageData>
    <SequenceNumber>26833</SequenceNumber>
    <TravelDateEffective>2021-11-11</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>PAYMENT_REQUIRED</AirExtraStatus>
    <Footnote>N</Footnote>
  </ns37:Ancillary>
  <ns37:Ancillary ancillaryDefinitionRef="ancillary_168" ancillaryId="ancillary_ancillary_168">
    <ServiceType>C</ServiceType>
    <SectorPortionInd>P</SectorPortionInd>
    <BaggageData>
      <FirstOccurrence>-1</FirstOccurrence>
      <LastOccurrence>-1</LastOccurrence>
      <Weight unit="KILO">5</Weight>
    </BaggageData>
    <SequenceNumber>108318</SequenceNumber>
    <TravelDateEffective>1980-01-01</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>PAYMENT_REQUIRED</AirExtraStatus>
    <Footnote>N</Footnote>
  </ns37:Ancillary>
  <ns37:Ancillary ancillaryDefinitionRef="ancillary_170" ancillaryId="ancillary_ancillary_170">
    <ServiceType>C</ServiceType>
    <SectorPortionInd>P</SectorPortionInd>
    <BaggageData>
      <FirstOccurrence>-1</FirstOccurrence>
      <LastOccurrence>-1</LastOccurrence>
      <Weight unit="KILO">10</Weight>
    </BaggageData>
    <SequenceNumber>33411</SequenceNumber>
    <TravelDateEffective>1980-01-01</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>PAYMENT_REQUIRED</AirExtraStatus>
    <Footnote>N</Footnote>
  </ns37:Ancillary>
  <ns37:Ancillary ancillaryDefinitionRef="ancillary_545" ancillaryId="ancillary_ancillary_545">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>1000</SequenceNumber>
    <TravelDateEffective>2013-08-01</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>PAYMENT_REQUIRED</AirExtraStatus>
    <Footnote>X</Footnote>
  </ns37:Ancillary>
  <ns37:Offers ancillaryRef="ancillary_ancillary_1" offerId="offer_ancillary_1">
    <ns12:OfferItemId>offerItem_1</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>AUH</ns12:Origin>
    <ns12:Destination>LHR</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">2560</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">40.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">2560</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">2560</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">40.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">2560</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">2560</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">2560</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">2560</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">2560</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <FormOfRefund code="1">ORIGINAL</FormOfRefund>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_2"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_2" offerId="offer_ancillary_2">
    <ns12:OfferItemId>offerItem_2</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>AUH</ns12:Origin>
    <ns12:Destination>LHR</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">2880</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">45.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">2880</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">2880</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">45.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">2880</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">2880</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">2880</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">2880</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">2880</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <FormOfRefund code="1">ORIGINAL</FormOfRefund>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_2"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_1" offerId="offer_ancillary_3">
    <ns12:OfferItemId>offerItem_3</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>LHR</ns12:Origin>
    <ns12:Destination>AUH</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">2560</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">40.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">2560</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">2560</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">40.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">2560</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">2560</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">2560</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">2560</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">2560</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <FormOfRefund code="1">ORIGINAL</FormOfRefund>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_3"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_2" offerId="offer_ancillary_4">
    <ns12:OfferItemId>offerItem_4</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>LHR</ns12:Origin>
    <ns12:Destination>AUH</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">2880</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">45.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">2880</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">2880</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">45.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">2880</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">2880</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">2880</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">2880</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">2880</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <FormOfRefund code="1">ORIGINAL</FormOfRefund>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_3"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_5" offerId="offer_ancillary_5">
    <ns12:OfferItemId>offerItem_5</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>SYD</ns12:Origin>
    <ns12:Destination>AUH</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">104177</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="AED">6000</ns2:Amount>
        <ns2:EquivAmount currency="RUB">104177</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">104177</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="AED">6000</ns2:Amount>
        <ns2:EquivAmount currency="RUB">104177</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">104177</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">104177</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">104177</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">104177</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>Y</RefundableReissuable>
      <FormOfRefund code="1">ORIGINAL</FormOfRefund>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_1"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_6" offerId="offer_ancillary_6">
    <ns12:OfferItemId>offerItem_6</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>SYD</ns12:Origin>
    <ns12:Destination>AUH</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">104177</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="AED">6000</ns2:Amount>
        <ns2:EquivAmount currency="RUB">104177</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">104177</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="AED">6000</ns2:Amount>
        <ns2:EquivAmount currency="RUB">104177</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">104177</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">104177</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">104177</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">104177</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_1"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_7" offerId="offer_ancillary_7">
    <ns12:OfferItemId>offerItem_7</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>AUH</ns12:Origin>
    <ns12:Destination>LHR</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">86814</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="AED">5000</ns2:Amount>
        <ns2:EquivAmount currency="RUB">86814</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">86814</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="AED">5000</ns2:Amount>
        <ns2:EquivAmount currency="RUB">86814</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">86814</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">86814</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">86814</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">86814</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>Y</RefundableReissuable>
      <FormOfRefund code="1">ORIGINAL</FormOfRefund>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_2"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_6" offerId="offer_ancillary_8">
    <ns12:OfferItemId>offerItem_8</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>AUH</ns12:Origin>
    <ns12:Destination>LHR</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">104177</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="AED">6000</ns2:Amount>
        <ns2:EquivAmount currency="RUB">104177</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">104177</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="AED">6000</ns2:Amount>
        <ns2:EquivAmount currency="RUB">104177</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">104177</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">104177</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">104177</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">104177</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_2"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_7" offerId="offer_ancillary_9">
    <ns12:OfferItemId>offerItem_9</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>LHR</ns12:Origin>
    <ns12:Destination>AUH</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">86814</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="AED">5000</ns2:Amount>
        <ns2:EquivAmount currency="RUB">86814</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">86814</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="AED">5000</ns2:Amount>
        <ns2:EquivAmount currency="RUB">86814</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">86814</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">86814</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">86814</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">86814</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>Y</RefundableReissuable>
      <FormOfRefund code="1">ORIGINAL</FormOfRefund>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_3"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_6" offerId="offer_ancillary_10">
    <ns12:OfferItemId>offerItem_10</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>LHR</ns12:Origin>
    <ns12:Destination>AUH</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">104177</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="AED">6000</ns2:Amount>
        <ns2:EquivAmount currency="RUB">104177</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">104177</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="AED">6000</ns2:Amount>
        <ns2:EquivAmount currency="RUB">104177</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">104177</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">104177</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">104177</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">104177</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_3"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_5" offerId="offer_ancillary_11">
    <ns12:OfferItemId>offerItem_11</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>AUH</ns12:Origin>
    <ns12:Destination>SYD</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">104177</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="AED">6000</ns2:Amount>
        <ns2:EquivAmount currency="RUB">104177</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">104177</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="AED">6000</ns2:Amount>
        <ns2:EquivAmount currency="RUB">104177</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">104177</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">104177</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">104177</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">104177</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>Y</RefundableReissuable>
      <FormOfRefund code="1">ORIGINAL</FormOfRefund>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_4"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_6" offerId="offer_ancillary_12">
    <ns12:OfferItemId>offerItem_12</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>AUH</ns12:Origin>
    <ns12:Destination>SYD</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">104177</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="AED">6000</ns2:Amount>
        <ns2:EquivAmount currency="RUB">104177</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">104177</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="AED">6000</ns2:Amount>
        <ns2:EquivAmount currency="RUB">104177</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">104177</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">104177</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">104177</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">104177</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_4"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_13" offerId="offer_ancillary_13">
    <ns12:OfferItemId>offerItem_13</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>SYD</ns12:Origin>
    <ns12:Destination>AUH</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">67200</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">1050.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">67200</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">67200</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">1050.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">67200</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">67200</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">67200</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">67200</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">67200</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>Y</RefundableReissuable>
      <FormOfRefund code="1">ORIGINAL</FormOfRefund>
      <Commissionable>false</Commissionable>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_1"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_14" offerId="offer_ancillary_14">
    <ns12:OfferItemId>offerItem_14</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>SYD</ns12:Origin>
    <ns12:Destination>AUH</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">42240</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">660.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">42240</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">42240</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">660.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">42240</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">42240</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">42240</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">42240</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">42240</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>Y</RefundableReissuable>
      <FormOfRefund code="1">ORIGINAL</FormOfRefund>
      <Commissionable>false</Commissionable>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_1"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_15" offerId="offer_ancillary_15">
    <ns12:OfferItemId>offerItem_15</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>SYD</ns12:Origin>
    <ns12:Destination>AUH</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">63360</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">990.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">63360</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">63360</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">990.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">63360</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">63360</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">63360</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">63360</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">63360</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>Y</RefundableReissuable>
      <FormOfRefund code="1">ORIGINAL</FormOfRefund>
      <Commissionable>false</Commissionable>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_1"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_16" offerId="offer_ancillary_16">
    <ns12:OfferItemId>offerItem_16</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>SYD</ns12:Origin>
    <ns12:Destination>AUH</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">11200</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">175.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">11200</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">11200</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">175.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">11200</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">11200</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">11200</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">11200</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">11200</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>N</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_1"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_17" offerId="offer_ancillary_17">
    <ns12:OfferItemId>offerItem_17</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>SYD</ns12:Origin>
    <ns12:Destination>AUH</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">44800</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">700.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">44800</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">44800</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">700.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">44800</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">44800</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">44800</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">44800</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">44800</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>N</RefundableReissuable>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_1"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_18" offerId="offer_ancillary_18">
    <ns12:OfferItemId>offerItem_18</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>SYD</ns12:Origin>
    <ns12:Destination>AUH</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">25600</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">400.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">25600</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">25600</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">400.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">25600</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">25600</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">25600</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">25600</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">25600</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>N</RefundableReissuable>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_1"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_19" offerId="offer_ancillary_19">
    <ns12:OfferItemId>offerItem_19</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>SYD</ns12:Origin>
    <ns12:Destination>AUH</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>Y</RefundableReissuable>
      <FormOfRefund code="1">ORIGINAL</FormOfRefund>
      <Commissionable>false</Commissionable>
      <FreeOfChargeRules>EMD_REQUIRED</FreeOfChargeRules>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_1"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_20" offerId="offer_ancillary_20">
    <ns12:OfferItemId>offerItem_20</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>SYD</ns12:Origin>
    <ns12:Destination>AUH</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>N</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <FreeOfChargeRules>EMD_REQUIRED</FreeOfChargeRules>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_1"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_21" offerId="offer_ancillary_21">
    <ns12:OfferItemId>offerItem_21</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>SYD</ns12:Origin>
    <ns12:Destination>AUH</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">52480</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">820.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">52480</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">52480</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">820.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">52480</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">52480</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">52480</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">52480</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">52480</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>N</RefundableReissuable>
      <FeeApplicationMethod code="3">ITEM</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_1"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_22" offerId="offer_ancillary_22">
    <ns12:OfferItemId>offerItem_22</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>SYD</ns12:Origin>
    <ns12:Destination>AUH</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">54400</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">850.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">54400</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">54400</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">850.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">54400</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">54400</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">54400</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">54400</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">54400</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>N</RefundableReissuable>
      <FeeApplicationMethod code="3">ITEM</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_1"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_23" offerId="offer_ancillary_23">
    <ns12:OfferItemId>offerItem_23</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>SYD</ns12:Origin>
    <ns12:Destination>AUH</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>N</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_1"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_13" offerId="offer_ancillary_24">
    <ns12:OfferItemId>offerItem_24</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>AUH</ns12:Origin>
    <ns12:Destination>LHR</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">67200</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">1050.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">67200</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">67200</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">1050.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">67200</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">67200</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">67200</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">67200</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">67200</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>Y</RefundableReissuable>
      <FormOfRefund code="1">ORIGINAL</FormOfRefund>
      <Commissionable>false</Commissionable>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_2"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_25" offerId="offer_ancillary_25">
    <ns12:OfferItemId>offerItem_25</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>AUH</ns12:Origin>
    <ns12:Destination>LHR</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">33600</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">525.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">33600</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">33600</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">525.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">33600</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">33600</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">33600</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">33600</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">33600</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>Y</RefundableReissuable>
      <FormOfRefund code="1">ORIGINAL</FormOfRefund>
      <Commissionable>false</Commissionable>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_2"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_26" offerId="offer_ancillary_26">
    <ns12:OfferItemId>offerItem_26</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>AUH</ns12:Origin>
    <ns12:Destination>LHR</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">50432</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">788.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">50432</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">50432</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">788.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">50432</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">50432</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">50432</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">50432</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">50432</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>Y</RefundableReissuable>
      <FormOfRefund code="1">ORIGINAL</FormOfRefund>
      <Commissionable>false</Commissionable>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_2"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_27" offerId="offer_ancillary_27">
    <ns12:OfferItemId>offerItem_27</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>AUH</ns12:Origin>
    <ns12:Destination>LHR</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">16000</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">250.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">16000</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">16000</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">250.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">16000</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">16000</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">16000</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">16000</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">16000</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>N</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_2"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_28" offerId="offer_ancillary_28">
    <ns12:OfferItemId>offerItem_28</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>AUH</ns12:Origin>
    <ns12:Destination>LHR</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">44160</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">690.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">44160</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">44160</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">690.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">44160</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">44160</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">44160</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">44160</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">44160</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>N</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_2"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_29" offerId="offer_ancillary_29">
    <ns12:OfferItemId>offerItem_29</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>AUH</ns12:Origin>
    <ns12:Destination>LHR</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">63360</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">990.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">63360</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">63360</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">990.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">63360</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">63360</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">63360</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">63360</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">63360</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>N</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_2"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_19" offerId="offer_ancillary_30">
    <ns12:OfferItemId>offerItem_30</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>AUH</ns12:Origin>
    <ns12:Destination>LHR</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>Y</RefundableReissuable>
      <FormOfRefund code="1">ORIGINAL</FormOfRefund>
      <Commissionable>false</Commissionable>
      <FreeOfChargeRules>EMD_REQUIRED</FreeOfChargeRules>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_2"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_20" offerId="offer_ancillary_31">
    <ns12:OfferItemId>offerItem_31</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>AUH</ns12:Origin>
    <ns12:Destination>LHR</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>N</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <FreeOfChargeRules>EMD_REQUIRED</FreeOfChargeRules>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_2"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_32" offerId="offer_ancillary_32">
    <ns12:OfferItemId>offerItem_32</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>AUH</ns12:Origin>
    <ns12:Destination>LHR</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">45440</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">710.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">45440</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">45440</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">710.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">45440</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">45440</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">45440</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">45440</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">45440</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>N</RefundableReissuable>
      <FeeApplicationMethod code="3">ITEM</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_2"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_33" offerId="offer_ancillary_33">
    <ns12:OfferItemId>offerItem_33</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>AUH</ns12:Origin>
    <ns12:Destination>LHR</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">48000</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">750.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">48000</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">48000</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">750.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">48000</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">48000</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">48000</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">48000</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">48000</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>N</RefundableReissuable>
      <FeeApplicationMethod code="3">ITEM</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_2"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_23" offerId="offer_ancillary_34">
    <ns12:OfferItemId>offerItem_34</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>AUH</ns12:Origin>
    <ns12:Destination>LHR</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>N</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_2"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_13" offerId="offer_ancillary_35">
    <ns12:OfferItemId>offerItem_35</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>LHR</ns12:Origin>
    <ns12:Destination>AUH</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">67200</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">1050.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">67200</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">67200</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">1050.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">67200</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">67200</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">67200</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">67200</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">67200</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>Y</RefundableReissuable>
      <FormOfRefund code="1">ORIGINAL</FormOfRefund>
      <Commissionable>false</Commissionable>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_3"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_25" offerId="offer_ancillary_36">
    <ns12:OfferItemId>offerItem_36</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>LHR</ns12:Origin>
    <ns12:Destination>AUH</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">33600</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">525.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">33600</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">33600</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">525.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">33600</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">33600</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">33600</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">33600</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">33600</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>Y</RefundableReissuable>
      <FormOfRefund code="1">ORIGINAL</FormOfRefund>
      <Commissionable>false</Commissionable>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_3"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_26" offerId="offer_ancillary_37">
    <ns12:OfferItemId>offerItem_37</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>LHR</ns12:Origin>
    <ns12:Destination>AUH</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">50432</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">788.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">50432</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">50432</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">788.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">50432</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">50432</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">50432</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">50432</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">50432</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>Y</RefundableReissuable>
      <FormOfRefund code="1">ORIGINAL</FormOfRefund>
      <Commissionable>false</Commissionable>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_3"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_38" offerId="offer_ancillary_38">
    <ns12:OfferItemId>offerItem_38</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>LHR</ns12:Origin>
    <ns12:Destination>AUH</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">44800</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">700.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">44800</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">44800</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">700.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">44800</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">44800</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">44800</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">44800</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">44800</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>N</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <FeeApplicationMethod code="3">ITEM</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_3"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_39" offerId="offer_ancillary_39">
    <ns12:OfferItemId>offerItem_39</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>LHR</ns12:Origin>
    <ns12:Destination>AUH</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">63360</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">990.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">63360</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">63360</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">990.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">63360</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">63360</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">63360</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">63360</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">63360</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>N</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_3"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_19" offerId="offer_ancillary_40">
    <ns12:OfferItemId>offerItem_40</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>LHR</ns12:Origin>
    <ns12:Destination>AUH</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>Y</RefundableReissuable>
      <FormOfRefund code="1">ORIGINAL</FormOfRefund>
      <Commissionable>false</Commissionable>
      <FreeOfChargeRules>EMD_REQUIRED</FreeOfChargeRules>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_3"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_20" offerId="offer_ancillary_41">
    <ns12:OfferItemId>offerItem_41</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>LHR</ns12:Origin>
    <ns12:Destination>AUH</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>N</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <FreeOfChargeRules>EMD_REQUIRED</FreeOfChargeRules>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_3"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_32" offerId="offer_ancillary_42">
    <ns12:OfferItemId>offerItem_42</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>LHR</ns12:Origin>
    <ns12:Destination>AUH</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">45440</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">710.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">45440</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">45440</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">710.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">45440</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">45440</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">45440</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">45440</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">45440</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>N</RefundableReissuable>
      <FeeApplicationMethod code="3">ITEM</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_3"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_33" offerId="offer_ancillary_43">
    <ns12:OfferItemId>offerItem_43</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>LHR</ns12:Origin>
    <ns12:Destination>AUH</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">48000</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">750.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">48000</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">48000</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">750.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">48000</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">48000</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">48000</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">48000</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">48000</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>N</RefundableReissuable>
      <FeeApplicationMethod code="3">ITEM</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_3"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_23" offerId="offer_ancillary_44">
    <ns12:OfferItemId>offerItem_44</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>LHR</ns12:Origin>
    <ns12:Destination>AUH</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>N</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_3"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_13" offerId="offer_ancillary_45">
    <ns12:OfferItemId>offerItem_45</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>AUH</ns12:Origin>
    <ns12:Destination>SYD</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">67200</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">1050.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">67200</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">67200</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">1050.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">67200</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">67200</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">67200</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">67200</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">67200</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>Y</RefundableReissuable>
      <FormOfRefund code="1">ORIGINAL</FormOfRefund>
      <Commissionable>false</Commissionable>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_4"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_14" offerId="offer_ancillary_46">
    <ns12:OfferItemId>offerItem_46</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>AUH</ns12:Origin>
    <ns12:Destination>SYD</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">42240</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">660.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">42240</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">42240</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">660.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">42240</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">42240</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">42240</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">42240</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">42240</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>Y</RefundableReissuable>
      <FormOfRefund code="1">ORIGINAL</FormOfRefund>
      <Commissionable>false</Commissionable>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_4"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_15" offerId="offer_ancillary_47">
    <ns12:OfferItemId>offerItem_47</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>AUH</ns12:Origin>
    <ns12:Destination>SYD</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">63360</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">990.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">63360</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">63360</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">990.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">63360</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">63360</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">63360</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">63360</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">63360</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>Y</RefundableReissuable>
      <FormOfRefund code="1">ORIGINAL</FormOfRefund>
      <Commissionable>false</Commissionable>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_4"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_16" offerId="offer_ancillary_48">
    <ns12:OfferItemId>offerItem_48</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>AUH</ns12:Origin>
    <ns12:Destination>SYD</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">11200</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">175.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">11200</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">11200</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">175.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">11200</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">11200</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">11200</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">11200</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">11200</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>N</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_4"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_49" offerId="offer_ancillary_49">
    <ns12:OfferItemId>offerItem_49</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>AUH</ns12:Origin>
    <ns12:Destination>SYD</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">28800</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">450.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">28800</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">28800</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">450.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">28800</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">28800</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">28800</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">28800</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">28800</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>N</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_4"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_50" offerId="offer_ancillary_50">
    <ns12:OfferItemId>offerItem_50</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>AUH</ns12:Origin>
    <ns12:Destination>SYD</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">44800</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">700.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">44800</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">44800</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">700.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">44800</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">44800</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">44800</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">44800</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">44800</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>N</RefundableReissuable>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_4"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_51" offerId="offer_ancillary_51">
    <ns12:OfferItemId>offerItem_51</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>AUH</ns12:Origin>
    <ns12:Destination>SYD</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">28800</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">450.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">28800</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">28800</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">450.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">28800</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">28800</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">28800</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">28800</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">28800</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>N</RefundableReissuable>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_4"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_19" offerId="offer_ancillary_52">
    <ns12:OfferItemId>offerItem_52</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>AUH</ns12:Origin>
    <ns12:Destination>SYD</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>Y</RefundableReissuable>
      <FormOfRefund code="1">ORIGINAL</FormOfRefund>
      <Commissionable>false</Commissionable>
      <FreeOfChargeRules>EMD_REQUIRED</FreeOfChargeRules>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_4"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_20" offerId="offer_ancillary_53">
    <ns12:OfferItemId>offerItem_53</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>AUH</ns12:Origin>
    <ns12:Destination>SYD</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>N</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <FreeOfChargeRules>EMD_REQUIRED</FreeOfChargeRules>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_4"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_21" offerId="offer_ancillary_54">
    <ns12:OfferItemId>offerItem_54</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>AUH</ns12:Origin>
    <ns12:Destination>SYD</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">52480</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">820.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">52480</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">52480</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">820.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">52480</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">52480</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">52480</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">52480</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">52480</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>N</RefundableReissuable>
      <FeeApplicationMethod code="3">ITEM</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_4"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_22" offerId="offer_ancillary_55">
    <ns12:OfferItemId>offerItem_55</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>AUH</ns12:Origin>
    <ns12:Destination>SYD</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">54400</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">850.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">54400</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">54400</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">850.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">54400</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">54400</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">54400</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">54400</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">54400</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>N</RefundableReissuable>
      <FeeApplicationMethod code="3">ITEM</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_4"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_23" offerId="offer_ancillary_56">
    <ns12:OfferItemId>offerItem_56</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>AUH</ns12:Origin>
    <ns12:Destination>SYD</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>N</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_4"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_57" offerId="offer_ancillary_57">
    <ns12:OfferItemId>offerItem_57</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>SYD</ns12:Origin>
    <ns12:Destination>AUH</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">827168</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="EUR">12345.78</ns2:Amount>
        <ns2:EquivAmount currency="RUB">827168</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">827168</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="EUR">12345.78</ns2:Amount>
        <ns2:EquivAmount currency="RUB">827168</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">827168</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">827168</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">827168</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">827168</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>Y</RefundableReissuable>
      <FormOfRefund code="1">ORIGINAL</FormOfRefund>
      <Commissionable>false</Commissionable>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_1"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_57" offerId="offer_ancillary_58">
    <ns12:OfferItemId>offerItem_58</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>AUH</ns12:Origin>
    <ns12:Destination>LHR</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">827168</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="EUR">12345.78</ns2:Amount>
        <ns2:EquivAmount currency="RUB">827168</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">827168</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="EUR">12345.78</ns2:Amount>
        <ns2:EquivAmount currency="RUB">827168</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">827168</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">827168</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">827168</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">827168</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>Y</RefundableReissuable>
      <FormOfRefund code="1">ORIGINAL</FormOfRefund>
      <Commissionable>false</Commissionable>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_2"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_57" offerId="offer_ancillary_59">
    <ns12:OfferItemId>offerItem_59</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>LHR</ns12:Origin>
    <ns12:Destination>AUH</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">827168</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="EUR">12345.78</ns2:Amount>
        <ns2:EquivAmount currency="RUB">827168</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">827168</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="EUR">12345.78</ns2:Amount>
        <ns2:EquivAmount currency="RUB">827168</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">827168</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">827168</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">827168</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">827168</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>Y</RefundableReissuable>
      <FormOfRefund code="1">ORIGINAL</FormOfRefund>
      <Commissionable>false</Commissionable>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_3"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_57" offerId="offer_ancillary_60">
    <ns12:OfferItemId>offerItem_60</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>AUH</ns12:Origin>
    <ns12:Destination>SYD</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">827168</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="EUR">12345.78</ns2:Amount>
        <ns2:EquivAmount currency="RUB">827168</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">827168</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="EUR">12345.78</ns2:Amount>
        <ns2:EquivAmount currency="RUB">827168</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">827168</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">827168</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">827168</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">827168</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>Y</RefundableReissuable>
      <FormOfRefund code="1">ORIGINAL</FormOfRefund>
      <Commissionable>false</Commissionable>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_4"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_61" offerId="offer_ancillary_61">
    <ns12:OfferItemId>offerItem_61</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>SYD</ns12:Origin>
    <ns12:Destination>AUH</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">576</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">9.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">576</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">576</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">9.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">576</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">576</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">576</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">576</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">576</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>Y</RefundableReissuable>
      <FormOfRefund code="1">ORIGINAL</FormOfRefund>
      <Commissionable>false</Commissionable>
      <FeeApplicationMethod code="3">ITEM</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_1"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_62" offerId="offer_ancillary_62">
    <ns12:OfferItemId>offerItem_62</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>AUH</ns12:Origin>
    <ns12:Destination>LHR</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">1024</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">16.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">1024</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">1024</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">16.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">1024</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">1024</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">1024</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">1024</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">1024</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>Y</RefundableReissuable>
      <FormOfRefund code="1">ORIGINAL</FormOfRefund>
      <Commissionable>false</Commissionable>
      <FeeApplicationMethod code="1">ONE_WAY</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_2"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_61" offerId="offer_ancillary_63">
    <ns12:OfferItemId>offerItem_63</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>AUH</ns12:Origin>
    <ns12:Destination>LHR</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">576</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">9.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">576</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">576</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">9.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">576</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">576</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">576</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">576</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">576</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>Y</RefundableReissuable>
      <FormOfRefund code="1">ORIGINAL</FormOfRefund>
      <Commissionable>false</Commissionable>
      <FeeApplicationMethod code="3">ITEM</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_2"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_62" offerId="offer_ancillary_64">
    <ns12:OfferItemId>offerItem_64</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>LHR</ns12:Origin>
    <ns12:Destination>AUH</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">1024</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">16.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">1024</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">1024</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">16.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">1024</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">1024</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">1024</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">1024</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">1024</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>Y</RefundableReissuable>
      <FormOfRefund code="1">ORIGINAL</FormOfRefund>
      <Commissionable>false</Commissionable>
      <FeeApplicationMethod code="1">ONE_WAY</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_3"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_61" offerId="offer_ancillary_65">
    <ns12:OfferItemId>offerItem_65</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>LHR</ns12:Origin>
    <ns12:Destination>AUH</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">576</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">9.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">576</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">576</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">9.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">576</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">576</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">576</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">576</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">576</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>Y</RefundableReissuable>
      <FormOfRefund code="1">ORIGINAL</FormOfRefund>
      <Commissionable>false</Commissionable>
      <FeeApplicationMethod code="3">ITEM</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_3"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_61" offerId="offer_ancillary_66">
    <ns12:OfferItemId>offerItem_66</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>AUH</ns12:Origin>
    <ns12:Destination>SYD</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">576</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">9.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">576</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">576</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">9.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">576</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">576</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">576</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">576</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">576</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>Y</RefundableReissuable>
      <FormOfRefund code="1">ORIGINAL</FormOfRefund>
      <Commissionable>false</Commissionable>
      <FeeApplicationMethod code="3">ITEM</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_4"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_67" offerId="offer_ancillary_67">
    <ns12:OfferItemId>offerItem_67</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>SYD</ns12:Origin>
    <ns12:Destination>LHR</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">25600</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">400.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">25600</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">25600</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">400.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">25600</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">25600</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">25600</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">25600</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">25600</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>N</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FeeApplicationMethod code="4">PER_BAGGAGE_TRAVEL</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_1"/>
    <ns12:Segment segmentId="seg_2"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_67" offerId="offer_ancillary_68">
    <ns12:OfferItemId>offerItem_68</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>LHR</ns12:Origin>
    <ns12:Destination>SYD</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">25600</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">400.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">25600</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">25600</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">400.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">25600</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">25600</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">25600</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">25600</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">25600</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>N</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FeeApplicationMethod code="4">PER_BAGGAGE_TRAVEL</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_3"/>
    <ns12:Segment segmentId="seg_4"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_69" offerId="offer_ancillary_69">
    <ns12:OfferItemId>offerItem_69</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>SYD</ns12:Origin>
    <ns12:Destination>AUH</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">8960</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">140.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">8960</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">8960</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">140.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">8960</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">8960</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">8960</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">8960</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">8960</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_1"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_70" offerId="offer_ancillary_70">
    <ns12:OfferItemId>offerItem_70</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>SYD</ns12:Origin>
    <ns12:Destination>AUH</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">8960</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">140.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">8960</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">8960</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">140.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">8960</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">8960</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">8960</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">8960</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">8960</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_1"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_71" offerId="offer_ancillary_71">
    <ns12:OfferItemId>offerItem_71</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>SYD</ns12:Origin>
    <ns12:Destination>AUH</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">2880</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">45.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">2880</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">2880</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">45.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">2880</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">2880</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">2880</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">2880</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">2880</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_1"/>
    <ns12:PurchaseByDate>2022-11-30</ns12:PurchaseByDate>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_72" offerId="offer_ancillary_72">
    <ns12:OfferItemId>offerItem_72</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>SYD</ns12:Origin>
    <ns12:Destination>AUH</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FreeOfChargeRules>BOOKING_REQUIRED</FreeOfChargeRules>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_1"/>
    <ns12:PurchaseByDate>2022-11-30</ns12:PurchaseByDate>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_73" offerId="offer_ancillary_73">
    <ns12:OfferItemId>offerItem_73</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>SYD</ns12:Origin>
    <ns12:Destination>AUH</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FreeOfChargeRules>BOOKING_REQUIRED</FreeOfChargeRules>
      <FreeOfChargeRules>EMD_REQUIRED</FreeOfChargeRules>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_1"/>
    <ns12:PurchaseByDate>2022-11-30</ns12:PurchaseByDate>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_74" offerId="offer_ancillary_74">
    <ns12:OfferItemId>offerItem_74</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>SYD</ns12:Origin>
    <ns12:Destination>AUH</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FreeOfChargeRules>BOOKING_REQUIRED</FreeOfChargeRules>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_1"/>
    <ns12:PurchaseByDate>2022-11-30</ns12:PurchaseByDate>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_75" offerId="offer_ancillary_75">
    <ns12:OfferItemId>offerItem_75</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>SYD</ns12:Origin>
    <ns12:Destination>AUH</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FreeOfChargeRules>BOOKING_REQUIRED</FreeOfChargeRules>
      <FreeOfChargeRules>EMD_REQUIRED</FreeOfChargeRules>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_1"/>
    <ns12:PurchaseByDate>2022-11-30</ns12:PurchaseByDate>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_76" offerId="offer_ancillary_76">
    <ns12:OfferItemId>offerItem_76</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>SYD</ns12:Origin>
    <ns12:Destination>AUH</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FreeOfChargeRules>BOOKING_REQUIRED</FreeOfChargeRules>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_1"/>
    <ns12:PurchaseByDate>2022-11-30</ns12:PurchaseByDate>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_77" offerId="offer_ancillary_77">
    <ns12:OfferItemId>offerItem_77</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>SYD</ns12:Origin>
    <ns12:Destination>AUH</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FreeOfChargeRules>BOOKING_REQUIRED</FreeOfChargeRules>
      <FreeOfChargeRules>EMD_REQUIRED</FreeOfChargeRules>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_1"/>
    <ns12:PurchaseByDate>2022-11-30</ns12:PurchaseByDate>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_78" offerId="offer_ancillary_78">
    <ns12:OfferItemId>offerItem_78</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>SYD</ns12:Origin>
    <ns12:Destination>AUH</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FreeOfChargeRules>BOOKING_REQUIRED</FreeOfChargeRules>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_1"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_79" offerId="offer_ancillary_79">
    <ns12:OfferItemId>offerItem_79</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>SYD</ns12:Origin>
    <ns12:Destination>AUH</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FreeOfChargeRules>BOOKING_REQUIRED</FreeOfChargeRules>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_1"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_80" offerId="offer_ancillary_80">
    <ns12:OfferItemId>offerItem_80</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>SYD</ns12:Origin>
    <ns12:Destination>AUH</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FreeOfChargeRules>BOOKING_REQUIRED</FreeOfChargeRules>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_1"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_81" offerId="offer_ancillary_81">
    <ns12:OfferItemId>offerItem_81</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>SYD</ns12:Origin>
    <ns12:Destination>AUH</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FreeOfChargeRules>BOOKING_REQUIRED</FreeOfChargeRules>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_1"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_82" offerId="offer_ancillary_82">
    <ns12:OfferItemId>offerItem_82</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>SYD</ns12:Origin>
    <ns12:Destination>AUH</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FreeOfChargeRules>BOOKING_REQUIRED</FreeOfChargeRules>
      <FreeOfChargeRules>EMD_REQUIRED</FreeOfChargeRules>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_1"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_83" offerId="offer_ancillary_83">
    <ns12:OfferItemId>offerItem_83</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>SYD</ns12:Origin>
    <ns12:Destination>AUH</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FreeOfChargeRules>BOOKING_REQUIRED</FreeOfChargeRules>
      <FreeOfChargeRules>EMD_REQUIRED</FreeOfChargeRules>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_1"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_84" offerId="offer_ancillary_84">
    <ns12:OfferItemId>offerItem_84</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>SYD</ns12:Origin>
    <ns12:Destination>AUH</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FreeOfChargeRules>BOOKING_REQUIRED</FreeOfChargeRules>
      <FreeOfChargeRules>EMD_REQUIRED</FreeOfChargeRules>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_1"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_85" offerId="offer_ancillary_85">
    <ns12:OfferItemId>offerItem_85</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>SYD</ns12:Origin>
    <ns12:Destination>AUH</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FreeOfChargeRules>BOOKING_REQUIRED</FreeOfChargeRules>
      <FreeOfChargeRules>EMD_REQUIRED</FreeOfChargeRules>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_1"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_86" offerId="offer_ancillary_86">
    <ns12:OfferItemId>offerItem_86</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>AUH</ns12:Origin>
    <ns12:Destination>LHR</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">7680</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">120.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">7680</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">7680</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">120.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">7680</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">7680</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">7680</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">7680</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">7680</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_2"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_87" offerId="offer_ancillary_87">
    <ns12:OfferItemId>offerItem_87</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>AUH</ns12:Origin>
    <ns12:Destination>LHR</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">7680</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">120.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">7680</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">7680</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">120.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">7680</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">7680</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">7680</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">7680</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">7680</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_2"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_88" offerId="offer_ancillary_88">
    <ns12:OfferItemId>offerItem_88</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>AUH</ns12:Origin>
    <ns12:Destination>LHR</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">2240</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">35.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">2240</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">2240</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">35.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">2240</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">2240</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">2240</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">2240</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">2240</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_2"/>
    <ns12:PurchaseByDate>2022-11-30</ns12:PurchaseByDate>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_89" offerId="offer_ancillary_89">
    <ns12:OfferItemId>offerItem_89</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>AUH</ns12:Origin>
    <ns12:Destination>LHR</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FreeOfChargeRules>BOOKING_REQUIRED</FreeOfChargeRules>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_2"/>
    <ns12:PurchaseByDate>2022-11-30</ns12:PurchaseByDate>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_90" offerId="offer_ancillary_90">
    <ns12:OfferItemId>offerItem_90</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>AUH</ns12:Origin>
    <ns12:Destination>LHR</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FreeOfChargeRules>BOOKING_REQUIRED</FreeOfChargeRules>
      <FreeOfChargeRules>EMD_REQUIRED</FreeOfChargeRules>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_2"/>
    <ns12:PurchaseByDate>2022-11-30</ns12:PurchaseByDate>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_91" offerId="offer_ancillary_91">
    <ns12:OfferItemId>offerItem_91</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>AUH</ns12:Origin>
    <ns12:Destination>LHR</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FreeOfChargeRules>BOOKING_REQUIRED</FreeOfChargeRules>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_2"/>
    <ns12:PurchaseByDate>2022-11-30</ns12:PurchaseByDate>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_92" offerId="offer_ancillary_92">
    <ns12:OfferItemId>offerItem_92</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>AUH</ns12:Origin>
    <ns12:Destination>LHR</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FreeOfChargeRules>BOOKING_REQUIRED</FreeOfChargeRules>
      <FreeOfChargeRules>EMD_REQUIRED</FreeOfChargeRules>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_2"/>
    <ns12:PurchaseByDate>2022-11-30</ns12:PurchaseByDate>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_93" offerId="offer_ancillary_93">
    <ns12:OfferItemId>offerItem_93</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>AUH</ns12:Origin>
    <ns12:Destination>LHR</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FreeOfChargeRules>BOOKING_REQUIRED</FreeOfChargeRules>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_2"/>
    <ns12:PurchaseByDate>2022-11-30</ns12:PurchaseByDate>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_94" offerId="offer_ancillary_94">
    <ns12:OfferItemId>offerItem_94</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>AUH</ns12:Origin>
    <ns12:Destination>LHR</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FreeOfChargeRules>BOOKING_REQUIRED</FreeOfChargeRules>
      <FreeOfChargeRules>EMD_REQUIRED</FreeOfChargeRules>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_2"/>
    <ns12:PurchaseByDate>2022-11-30</ns12:PurchaseByDate>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_95" offerId="offer_ancillary_95">
    <ns12:OfferItemId>offerItem_95</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>AUH</ns12:Origin>
    <ns12:Destination>LHR</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FreeOfChargeRules>BOOKING_REQUIRED</FreeOfChargeRules>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_2"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_96" offerId="offer_ancillary_96">
    <ns12:OfferItemId>offerItem_96</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>AUH</ns12:Origin>
    <ns12:Destination>LHR</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FreeOfChargeRules>BOOKING_REQUIRED</FreeOfChargeRules>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_2"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_97" offerId="offer_ancillary_97">
    <ns12:OfferItemId>offerItem_97</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>AUH</ns12:Origin>
    <ns12:Destination>LHR</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FreeOfChargeRules>BOOKING_REQUIRED</FreeOfChargeRules>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_2"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_98" offerId="offer_ancillary_98">
    <ns12:OfferItemId>offerItem_98</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>AUH</ns12:Origin>
    <ns12:Destination>LHR</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FreeOfChargeRules>BOOKING_REQUIRED</FreeOfChargeRules>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_2"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_99" offerId="offer_ancillary_99">
    <ns12:OfferItemId>offerItem_99</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>AUH</ns12:Origin>
    <ns12:Destination>LHR</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FreeOfChargeRules>BOOKING_REQUIRED</FreeOfChargeRules>
      <FreeOfChargeRules>EMD_REQUIRED</FreeOfChargeRules>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_2"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_100" offerId="offer_ancillary_100">
    <ns12:OfferItemId>offerItem_100</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>AUH</ns12:Origin>
    <ns12:Destination>LHR</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FreeOfChargeRules>BOOKING_REQUIRED</FreeOfChargeRules>
      <FreeOfChargeRules>EMD_REQUIRED</FreeOfChargeRules>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_2"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_101" offerId="offer_ancillary_101">
    <ns12:OfferItemId>offerItem_101</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>AUH</ns12:Origin>
    <ns12:Destination>LHR</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FreeOfChargeRules>BOOKING_REQUIRED</FreeOfChargeRules>
      <FreeOfChargeRules>EMD_REQUIRED</FreeOfChargeRules>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_2"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_102" offerId="offer_ancillary_102">
    <ns12:OfferItemId>offerItem_102</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>AUH</ns12:Origin>
    <ns12:Destination>LHR</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FreeOfChargeRules>BOOKING_REQUIRED</FreeOfChargeRules>
      <FreeOfChargeRules>EMD_REQUIRED</FreeOfChargeRules>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_2"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_86" offerId="offer_ancillary_103">
    <ns12:OfferItemId>offerItem_103</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>LHR</ns12:Origin>
    <ns12:Destination>AUH</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">7680</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">120.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">7680</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">7680</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">120.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">7680</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">7680</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">7680</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">7680</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">7680</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_3"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_87" offerId="offer_ancillary_104">
    <ns12:OfferItemId>offerItem_104</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>LHR</ns12:Origin>
    <ns12:Destination>AUH</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">7680</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">120.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">7680</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">7680</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">120.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">7680</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">7680</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">7680</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">7680</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">7680</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_3"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_88" offerId="offer_ancillary_105">
    <ns12:OfferItemId>offerItem_105</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>LHR</ns12:Origin>
    <ns12:Destination>AUH</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">2240</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">35.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">2240</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">2240</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">35.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">2240</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">2240</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">2240</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">2240</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">2240</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_3"/>
    <ns12:PurchaseByDate>2022-12-06</ns12:PurchaseByDate>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_72" offerId="offer_ancillary_106">
    <ns12:OfferItemId>offerItem_106</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>LHR</ns12:Origin>
    <ns12:Destination>AUH</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FreeOfChargeRules>BOOKING_REQUIRED</FreeOfChargeRules>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_3"/>
    <ns12:PurchaseByDate>2022-12-06</ns12:PurchaseByDate>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_73" offerId="offer_ancillary_107">
    <ns12:OfferItemId>offerItem_107</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>LHR</ns12:Origin>
    <ns12:Destination>AUH</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FreeOfChargeRules>BOOKING_REQUIRED</FreeOfChargeRules>
      <FreeOfChargeRules>EMD_REQUIRED</FreeOfChargeRules>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_3"/>
    <ns12:PurchaseByDate>2022-12-06</ns12:PurchaseByDate>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_74" offerId="offer_ancillary_108">
    <ns12:OfferItemId>offerItem_108</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>LHR</ns12:Origin>
    <ns12:Destination>AUH</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FreeOfChargeRules>BOOKING_REQUIRED</FreeOfChargeRules>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_3"/>
    <ns12:PurchaseByDate>2022-12-06</ns12:PurchaseByDate>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_75" offerId="offer_ancillary_109">
    <ns12:OfferItemId>offerItem_109</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>LHR</ns12:Origin>
    <ns12:Destination>AUH</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FreeOfChargeRules>BOOKING_REQUIRED</FreeOfChargeRules>
      <FreeOfChargeRules>EMD_REQUIRED</FreeOfChargeRules>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_3"/>
    <ns12:PurchaseByDate>2022-12-06</ns12:PurchaseByDate>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_76" offerId="offer_ancillary_110">
    <ns12:OfferItemId>offerItem_110</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>LHR</ns12:Origin>
    <ns12:Destination>AUH</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FreeOfChargeRules>BOOKING_REQUIRED</FreeOfChargeRules>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_3"/>
    <ns12:PurchaseByDate>2022-12-06</ns12:PurchaseByDate>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_77" offerId="offer_ancillary_111">
    <ns12:OfferItemId>offerItem_111</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>LHR</ns12:Origin>
    <ns12:Destination>AUH</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FreeOfChargeRules>BOOKING_REQUIRED</FreeOfChargeRules>
      <FreeOfChargeRules>EMD_REQUIRED</FreeOfChargeRules>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_3"/>
    <ns12:PurchaseByDate>2022-12-06</ns12:PurchaseByDate>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_78" offerId="offer_ancillary_112">
    <ns12:OfferItemId>offerItem_112</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>LHR</ns12:Origin>
    <ns12:Destination>AUH</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FreeOfChargeRules>BOOKING_REQUIRED</FreeOfChargeRules>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_3"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_79" offerId="offer_ancillary_113">
    <ns12:OfferItemId>offerItem_113</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>LHR</ns12:Origin>
    <ns12:Destination>AUH</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FreeOfChargeRules>BOOKING_REQUIRED</FreeOfChargeRules>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_3"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_80" offerId="offer_ancillary_114">
    <ns12:OfferItemId>offerItem_114</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>LHR</ns12:Origin>
    <ns12:Destination>AUH</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FreeOfChargeRules>BOOKING_REQUIRED</FreeOfChargeRules>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_3"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_81" offerId="offer_ancillary_115">
    <ns12:OfferItemId>offerItem_115</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>LHR</ns12:Origin>
    <ns12:Destination>AUH</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FreeOfChargeRules>BOOKING_REQUIRED</FreeOfChargeRules>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_3"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_82" offerId="offer_ancillary_116">
    <ns12:OfferItemId>offerItem_116</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>LHR</ns12:Origin>
    <ns12:Destination>AUH</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FreeOfChargeRules>BOOKING_REQUIRED</FreeOfChargeRules>
      <FreeOfChargeRules>EMD_REQUIRED</FreeOfChargeRules>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_3"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_83" offerId="offer_ancillary_117">
    <ns12:OfferItemId>offerItem_117</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>LHR</ns12:Origin>
    <ns12:Destination>AUH</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FreeOfChargeRules>BOOKING_REQUIRED</FreeOfChargeRules>
      <FreeOfChargeRules>EMD_REQUIRED</FreeOfChargeRules>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_3"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_84" offerId="offer_ancillary_118">
    <ns12:OfferItemId>offerItem_118</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>LHR</ns12:Origin>
    <ns12:Destination>AUH</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FreeOfChargeRules>BOOKING_REQUIRED</FreeOfChargeRules>
      <FreeOfChargeRules>EMD_REQUIRED</FreeOfChargeRules>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_3"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_85" offerId="offer_ancillary_119">
    <ns12:OfferItemId>offerItem_119</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>LHR</ns12:Origin>
    <ns12:Destination>AUH</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FreeOfChargeRules>BOOKING_REQUIRED</FreeOfChargeRules>
      <FreeOfChargeRules>EMD_REQUIRED</FreeOfChargeRules>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_3"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_69" offerId="offer_ancillary_120">
    <ns12:OfferItemId>offerItem_120</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>AUH</ns12:Origin>
    <ns12:Destination>SYD</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">8960</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">140.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">8960</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">8960</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">140.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">8960</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">8960</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">8960</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">8960</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">8960</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_4"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_70" offerId="offer_ancillary_121">
    <ns12:OfferItemId>offerItem_121</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>AUH</ns12:Origin>
    <ns12:Destination>SYD</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">8960</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">140.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">8960</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">8960</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">140.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">8960</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">8960</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">8960</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">8960</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">8960</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_4"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_71" offerId="offer_ancillary_122">
    <ns12:OfferItemId>offerItem_122</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>AUH</ns12:Origin>
    <ns12:Destination>SYD</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">2880</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">45.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">2880</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">2880</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">45.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">2880</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">2880</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">2880</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">2880</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">2880</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_4"/>
    <ns12:PurchaseByDate>2022-12-07</ns12:PurchaseByDate>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_89" offerId="offer_ancillary_123">
    <ns12:OfferItemId>offerItem_123</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>AUH</ns12:Origin>
    <ns12:Destination>SYD</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FreeOfChargeRules>BOOKING_REQUIRED</FreeOfChargeRules>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_4"/>
    <ns12:PurchaseByDate>2022-12-07</ns12:PurchaseByDate>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_90" offerId="offer_ancillary_124">
    <ns12:OfferItemId>offerItem_124</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>AUH</ns12:Origin>
    <ns12:Destination>SYD</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FreeOfChargeRules>BOOKING_REQUIRED</FreeOfChargeRules>
      <FreeOfChargeRules>EMD_REQUIRED</FreeOfChargeRules>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_4"/>
    <ns12:PurchaseByDate>2022-12-07</ns12:PurchaseByDate>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_91" offerId="offer_ancillary_125">
    <ns12:OfferItemId>offerItem_125</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>AUH</ns12:Origin>
    <ns12:Destination>SYD</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FreeOfChargeRules>BOOKING_REQUIRED</FreeOfChargeRules>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_4"/>
    <ns12:PurchaseByDate>2022-12-07</ns12:PurchaseByDate>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_92" offerId="offer_ancillary_126">
    <ns12:OfferItemId>offerItem_126</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>AUH</ns12:Origin>
    <ns12:Destination>SYD</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FreeOfChargeRules>BOOKING_REQUIRED</FreeOfChargeRules>
      <FreeOfChargeRules>EMD_REQUIRED</FreeOfChargeRules>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_4"/>
    <ns12:PurchaseByDate>2022-12-07</ns12:PurchaseByDate>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_93" offerId="offer_ancillary_127">
    <ns12:OfferItemId>offerItem_127</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>AUH</ns12:Origin>
    <ns12:Destination>SYD</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FreeOfChargeRules>BOOKING_REQUIRED</FreeOfChargeRules>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_4"/>
    <ns12:PurchaseByDate>2022-12-07</ns12:PurchaseByDate>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_94" offerId="offer_ancillary_128">
    <ns12:OfferItemId>offerItem_128</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>AUH</ns12:Origin>
    <ns12:Destination>SYD</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FreeOfChargeRules>BOOKING_REQUIRED</FreeOfChargeRules>
      <FreeOfChargeRules>EMD_REQUIRED</FreeOfChargeRules>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_4"/>
    <ns12:PurchaseByDate>2022-12-07</ns12:PurchaseByDate>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_95" offerId="offer_ancillary_129">
    <ns12:OfferItemId>offerItem_129</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>AUH</ns12:Origin>
    <ns12:Destination>SYD</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FreeOfChargeRules>BOOKING_REQUIRED</FreeOfChargeRules>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_4"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_96" offerId="offer_ancillary_130">
    <ns12:OfferItemId>offerItem_130</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>AUH</ns12:Origin>
    <ns12:Destination>SYD</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FreeOfChargeRules>BOOKING_REQUIRED</FreeOfChargeRules>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_4"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_97" offerId="offer_ancillary_131">
    <ns12:OfferItemId>offerItem_131</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>AUH</ns12:Origin>
    <ns12:Destination>SYD</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FreeOfChargeRules>BOOKING_REQUIRED</FreeOfChargeRules>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_4"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_98" offerId="offer_ancillary_132">
    <ns12:OfferItemId>offerItem_132</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>AUH</ns12:Origin>
    <ns12:Destination>SYD</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FreeOfChargeRules>BOOKING_REQUIRED</FreeOfChargeRules>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_4"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_99" offerId="offer_ancillary_133">
    <ns12:OfferItemId>offerItem_133</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>AUH</ns12:Origin>
    <ns12:Destination>SYD</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FreeOfChargeRules>BOOKING_REQUIRED</FreeOfChargeRules>
      <FreeOfChargeRules>EMD_REQUIRED</FreeOfChargeRules>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_4"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_100" offerId="offer_ancillary_134">
    <ns12:OfferItemId>offerItem_134</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>AUH</ns12:Origin>
    <ns12:Destination>SYD</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FreeOfChargeRules>BOOKING_REQUIRED</FreeOfChargeRules>
      <FreeOfChargeRules>EMD_REQUIRED</FreeOfChargeRules>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_4"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_101" offerId="offer_ancillary_135">
    <ns12:OfferItemId>offerItem_135</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>AUH</ns12:Origin>
    <ns12:Destination>SYD</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FreeOfChargeRules>BOOKING_REQUIRED</FreeOfChargeRules>
      <FreeOfChargeRules>EMD_REQUIRED</FreeOfChargeRules>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_4"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_102" offerId="offer_ancillary_136">
    <ns12:OfferItemId>offerItem_136</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>AUH</ns12:Origin>
    <ns12:Destination>SYD</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FreeOfChargeRules>BOOKING_REQUIRED</FreeOfChargeRules>
      <FreeOfChargeRules>EMD_REQUIRED</FreeOfChargeRules>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_4"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_137" offerId="offer_ancillary_137">
    <ns12:OfferItemId>offerItem_137</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>SYD</ns12:Origin>
    <ns12:Destination>AUH</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">2944</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">46.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">2944</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">2944</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">46.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">2944</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">2944</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">2944</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">2944</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">2944</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>N</RefundableReissuable>
      <FormOfRefund code="1">ORIGINAL</FormOfRefund>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_1"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_138" offerId="offer_ancillary_138">
    <ns12:OfferItemId>offerItem_138</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>SYD</ns12:Origin>
    <ns12:Destination>AUH</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">3264</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">51.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">3264</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">3264</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">51.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">3264</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">3264</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">3264</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">3264</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">3264</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>Y</RefundableReissuable>
      <FormOfRefund code="1">ORIGINAL</FormOfRefund>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_1"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_139" offerId="offer_ancillary_139">
    <ns12:OfferItemId>offerItem_139</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>AUH</ns12:Origin>
    <ns12:Destination>LHR</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">2944</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">46.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">2944</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">2944</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">46.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">2944</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">2944</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">2944</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">2944</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">2944</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <FormOfRefund code="1">ORIGINAL</FormOfRefund>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_2"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_140" offerId="offer_ancillary_140">
    <ns12:OfferItemId>offerItem_140</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>AUH</ns12:Origin>
    <ns12:Destination>LHR</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">3264</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">51.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">3264</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">3264</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">51.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">3264</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">3264</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">3264</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">3264</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">3264</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <FormOfRefund code="1">ORIGINAL</FormOfRefund>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_2"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_139" offerId="offer_ancillary_141">
    <ns12:OfferItemId>offerItem_141</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>LHR</ns12:Origin>
    <ns12:Destination>AUH</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">2944</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">46.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">2944</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">2944</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">46.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">2944</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">2944</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">2944</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">2944</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">2944</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <FormOfRefund code="1">ORIGINAL</FormOfRefund>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_3"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_140" offerId="offer_ancillary_142">
    <ns12:OfferItemId>offerItem_142</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>LHR</ns12:Origin>
    <ns12:Destination>AUH</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">3264</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">51.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">3264</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">3264</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">51.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">3264</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">3264</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">3264</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">3264</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">3264</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <FormOfRefund code="1">ORIGINAL</FormOfRefund>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_3"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_137" offerId="offer_ancillary_143">
    <ns12:OfferItemId>offerItem_143</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>AUH</ns12:Origin>
    <ns12:Destination>SYD</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">2944</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">46.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">2944</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">2944</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">46.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">2944</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">2944</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">2944</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">2944</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">2944</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>N</RefundableReissuable>
      <FormOfRefund code="1">ORIGINAL</FormOfRefund>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_4"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_138" offerId="offer_ancillary_144">
    <ns12:OfferItemId>offerItem_144</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>AUH</ns12:Origin>
    <ns12:Destination>SYD</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">3264</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">51.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">3264</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">3264</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">51.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">3264</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">3264</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">3264</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">3264</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">3264</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>Y</RefundableReissuable>
      <FormOfRefund code="1">ORIGINAL</FormOfRefund>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_4"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_145" offerId="offer_ancillary_145">
    <ns12:OfferItemId>offerItem_145</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>SYD</ns12:Origin>
    <ns12:Destination>LHR</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">2560</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">40.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">2560</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">2560</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">40.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">2560</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">2560</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">2560</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">2560</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">2560</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>N</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_1"/>
    <ns12:Segment segmentId="seg_2"/>
    <ns12:PurchaseByDate>2022-12-01</ns12:PurchaseByDate>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_146" offerId="offer_ancillary_146">
    <ns12:OfferItemId>offerItem_146</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>SYD</ns12:Origin>
    <ns12:Destination>LHR</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">2624</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">41.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">2624</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">2624</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">41.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">2624</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">2624</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">2624</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">2624</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">2624</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>N</RefundableReissuable>
      <FormOfRefund code="1">ORIGINAL</FormOfRefund>
      <Commissionable>false</Commissionable>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_1"/>
    <ns12:Segment segmentId="seg_2"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_145" offerId="offer_ancillary_147">
    <ns12:OfferItemId>offerItem_147</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>LHR</ns12:Origin>
    <ns12:Destination>SYD</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">2560</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">40.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">2560</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">2560</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">40.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">2560</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">2560</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">2560</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">2560</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">2560</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>N</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_3"/>
    <ns12:Segment segmentId="seg_4"/>
    <ns12:PurchaseByDate>2022-12-08</ns12:PurchaseByDate>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_146" offerId="offer_ancillary_148">
    <ns12:OfferItemId>offerItem_148</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>LHR</ns12:Origin>
    <ns12:Destination>SYD</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">2624</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">41.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">2624</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">2624</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">41.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">2624</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">2624</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">2624</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">2624</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">2624</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>N</RefundableReissuable>
      <FormOfRefund code="1">ORIGINAL</FormOfRefund>
      <Commissionable>false</Commissionable>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_3"/>
    <ns12:Segment segmentId="seg_4"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_150" offerId="offer_ancillary_150">
    <ns12:OfferItemId>offerItem_149</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>SYD</ns12:Origin>
    <ns12:Destination>LHR</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">38340</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">599.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">38340</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">38340</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">599.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">38340</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">38340</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">38340</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">38340</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">38340</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>true</Interlineable>
      <FeeApplicationMethod code="4">PER_BAGGAGE_TRAVEL</FeeApplicationMethod>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_1"/>
    <ns12:Segment segmentId="seg_2"/>
    <ns12:PurchaseByDate>2022-12-01</ns12:PurchaseByDate>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_154" offerId="offer_ancillary_154">
    <ns12:OfferItemId>offerItem_150</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>SYD</ns12:Origin>
    <ns12:Destination>LHR</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">50690</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">792.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">50690</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">50690</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">792.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">50690</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">50690</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">50690</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">50690</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">50690</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>true</Interlineable>
      <FeeApplicationMethod code="4">PER_BAGGAGE_TRAVEL</FeeApplicationMethod>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_1"/>
    <ns12:Segment segmentId="seg_2"/>
    <ns12:PurchaseByDate>2022-12-01</ns12:PurchaseByDate>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_156" offerId="offer_ancillary_156">
    <ns12:OfferItemId>offerItem_151</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>SYD</ns12:Origin>
    <ns12:Destination>LHR</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">62915</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">983.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">62915</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">62915</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">983.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">62915</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">62915</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">62915</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">62915</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">62915</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>true</Interlineable>
      <FeeApplicationMethod code="4">PER_BAGGAGE_TRAVEL</FeeApplicationMethod>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_1"/>
    <ns12:Segment segmentId="seg_2"/>
    <ns12:PurchaseByDate>2022-12-01</ns12:PurchaseByDate>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_160" offerId="offer_ancillary_160">
    <ns12:OfferItemId>offerItem_152</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>SYD</ns12:Origin>
    <ns12:Destination>LHR</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">75330</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">1177.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">75330</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">75330</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">1177.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">75330</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">75330</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">75330</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">75330</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">75330</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>true</Interlineable>
      <FeeApplicationMethod code="4">PER_BAGGAGE_TRAVEL</FeeApplicationMethod>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_1"/>
    <ns12:Segment segmentId="seg_2"/>
    <ns12:PurchaseByDate>2022-12-01</ns12:PurchaseByDate>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_164" offerId="offer_ancillary_164">
    <ns12:OfferItemId>offerItem_153</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>SYD</ns12:Origin>
    <ns12:Destination>LHR</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">87555</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">1368.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">87555</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">87555</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">1368.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">87555</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">87555</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">87555</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">87555</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">87555</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>true</Interlineable>
      <FeeApplicationMethod code="4">PER_BAGGAGE_TRAVEL</FeeApplicationMethod>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_1"/>
    <ns12:Segment segmentId="seg_2"/>
    <ns12:PurchaseByDate>2022-12-01</ns12:PurchaseByDate>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_168" offerId="offer_ancillary_168">
    <ns12:OfferItemId>offerItem_154</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>SYD</ns12:Origin>
    <ns12:Destination>LHR</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">13700</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">214.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">13700</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">13700</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">214.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">13700</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">13700</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">13700</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">13700</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">13700</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>true</Interlineable>
      <FeeApplicationMethod code="4">PER_BAGGAGE_TRAVEL</FeeApplicationMethod>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_1"/>
    <ns12:Segment segmentId="seg_2"/>
    <ns12:PurchaseByDate>2022-12-01</ns12:PurchaseByDate>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_170" offerId="offer_ancillary_170">
    <ns12:OfferItemId>offerItem_155</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>SYD</ns12:Origin>
    <ns12:Destination>LHR</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">26050</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">407.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">26050</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">26050</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">407.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">26050</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">26050</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">26050</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">26050</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">26050</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>true</Interlineable>
      <FeeApplicationMethod code="4">PER_BAGGAGE_TRAVEL</FeeApplicationMethod>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_1"/>
    <ns12:Segment segmentId="seg_2"/>
    <ns12:PurchaseByDate>2022-12-01</ns12:PurchaseByDate>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_150" offerId="offer_ancillary_175">
    <ns12:OfferItemId>offerItem_156</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>LHR</ns12:Origin>
    <ns12:Destination>SYD</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">38340</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">599.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">38340</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">38340</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">599.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">38340</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">38340</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">38340</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">38340</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">38340</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>true</Interlineable>
      <FeeApplicationMethod code="4">PER_BAGGAGE_TRAVEL</FeeApplicationMethod>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_3"/>
    <ns12:Segment segmentId="seg_4"/>
    <ns12:PurchaseByDate>2022-12-07</ns12:PurchaseByDate>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_154" offerId="offer_ancillary_179">
    <ns12:OfferItemId>offerItem_157</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>LHR</ns12:Origin>
    <ns12:Destination>SYD</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">50690</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">792.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">50690</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">50690</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">792.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">50690</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">50690</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">50690</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">50690</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">50690</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>true</Interlineable>
      <FeeApplicationMethod code="4">PER_BAGGAGE_TRAVEL</FeeApplicationMethod>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_3"/>
    <ns12:Segment segmentId="seg_4"/>
    <ns12:PurchaseByDate>2022-12-07</ns12:PurchaseByDate>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_156" offerId="offer_ancillary_181">
    <ns12:OfferItemId>offerItem_158</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>LHR</ns12:Origin>
    <ns12:Destination>SYD</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">62915</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">983.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">62915</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">62915</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">983.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">62915</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">62915</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">62915</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">62915</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">62915</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>true</Interlineable>
      <FeeApplicationMethod code="4">PER_BAGGAGE_TRAVEL</FeeApplicationMethod>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_3"/>
    <ns12:Segment segmentId="seg_4"/>
    <ns12:PurchaseByDate>2022-12-07</ns12:PurchaseByDate>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_160" offerId="offer_ancillary_185">
    <ns12:OfferItemId>offerItem_159</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>LHR</ns12:Origin>
    <ns12:Destination>SYD</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">75330</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">1177.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">75330</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">75330</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">1177.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">75330</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">75330</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">75330</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">75330</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">75330</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>true</Interlineable>
      <FeeApplicationMethod code="4">PER_BAGGAGE_TRAVEL</FeeApplicationMethod>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_3"/>
    <ns12:Segment segmentId="seg_4"/>
    <ns12:PurchaseByDate>2022-12-07</ns12:PurchaseByDate>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_164" offerId="offer_ancillary_189">
    <ns12:OfferItemId>offerItem_160</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>LHR</ns12:Origin>
    <ns12:Destination>SYD</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">87555</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">1368.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">87555</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">87555</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">1368.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">87555</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">87555</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">87555</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">87555</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">87555</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>true</Interlineable>
      <FeeApplicationMethod code="4">PER_BAGGAGE_TRAVEL</FeeApplicationMethod>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_3"/>
    <ns12:Segment segmentId="seg_4"/>
    <ns12:PurchaseByDate>2022-12-07</ns12:PurchaseByDate>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_168" offerId="offer_ancillary_193">
    <ns12:OfferItemId>offerItem_161</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>LHR</ns12:Origin>
    <ns12:Destination>SYD</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">13700</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">214.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">13700</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">13700</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">214.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">13700</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">13700</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">13700</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">13700</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">13700</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>true</Interlineable>
      <FeeApplicationMethod code="4">PER_BAGGAGE_TRAVEL</FeeApplicationMethod>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_3"/>
    <ns12:Segment segmentId="seg_4"/>
    <ns12:PurchaseByDate>2022-12-07</ns12:PurchaseByDate>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_170" offerId="offer_ancillary_195">
    <ns12:OfferItemId>offerItem_162</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>LHR</ns12:Origin>
    <ns12:Destination>SYD</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">26050</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">407.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">26050</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">26050</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">407.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">26050</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">26050</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">26050</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">26050</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">26050</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>true</Interlineable>
      <FeeApplicationMethod code="4">PER_BAGGAGE_TRAVEL</FeeApplicationMethod>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_3"/>
    <ns12:Segment segmentId="seg_4"/>
    <ns12:PurchaseByDate>2022-12-07</ns12:PurchaseByDate>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_545" offerId="offer_ancillary_545">
    <ns12:OfferItemId>offerItem_163</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>SYD</ns12:Origin>
    <ns12:Destination>AUH</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">896</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">14.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">896</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">896</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">14.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">896</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">896</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">896</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">896</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">896</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>Y</RefundableReissuable>
      <FormOfRefund code="1">ORIGINAL</FormOfRefund>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_1"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_545" offerId="offer_ancillary_546">
    <ns12:OfferItemId>offerItem_164</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>AUH</ns12:Origin>
    <ns12:Destination>LHR</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">896</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">14.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">896</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">896</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">14.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">896</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">896</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">896</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">896</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">896</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>Y</RefundableReissuable>
      <FormOfRefund code="1">ORIGINAL</FormOfRefund>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_2"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_545" offerId="offer_ancillary_547">
    <ns12:OfferItemId>offerItem_165</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>LHR</ns12:Origin>
    <ns12:Destination>AUH</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">896</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">14.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">896</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">896</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">14.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">896</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">896</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">896</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">896</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">896</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>Y</RefundableReissuable>
      <FormOfRefund code="1">ORIGINAL</FormOfRefund>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_3"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_545" offerId="offer_ancillary_548">
    <ns12:OfferItemId>offerItem_166</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>AUH</ns12:Origin>
    <ns12:Destination>SYD</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">896</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">14.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">896</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">896</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">14.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">896</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">896</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">896</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">896</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">896</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>Y</RefundableReissuable>
      <FormOfRefund code="1">ORIGINAL</FormOfRefund>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_4"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:PassengerOffers>
    <ns12:PassengerReference passengerId="pax_1" passengerType="ADT"/>
    <ns12:OfferRefs>offer_ancillary_1 offer_ancillary_2 offer_ancillary_3 offer_ancillary_4 offer_ancillary_5 offer_ancillary_6 offer_ancillary_7 offer_ancillary_8 offer_ancillary_9 offer_ancillary_10 offer_ancillary_11 offer_ancillary_12 offer_ancillary_13 offer_ancillary_14 offer_ancillary_15 offer_ancillary_16 offer_ancillary_17 offer_ancillary_18 offer_ancillary_19 offer_ancillary_20 offer_ancillary_21 offer_ancillary_22 offer_ancillary_23 offer_ancillary_24 offer_ancillary_25 offer_ancillary_26 offer_ancillary_27 offer_ancillary_28 offer_ancillary_29 offer_ancillary_30 offer_ancillary_31 offer_ancillary_32 offer_ancillary_33 offer_ancillary_34 offer_ancillary_35 offer_ancillary_36 offer_ancillary_37 offer_ancillary_38 offer_ancillary_39 offer_ancillary_40 offer_ancillary_41 offer_ancillary_42 offer_ancillary_43 offer_ancillary_44 offer_ancillary_45 offer_ancillary_46 offer_ancillary_47 offer_ancillary_48 offer_ancillary_49 offer_ancillary_50 offer_ancillary_51 offer_ancillary_52 offer_ancillary_53 offer_ancillary_54 offer_ancillary_55 offer_ancillary_56 offer_ancillary_57 offer_ancillary_58 offer_ancillary_59 offer_ancillary_60 offer_ancillary_61 offer_ancillary_62 offer_ancillary_63 offer_ancillary_64 offer_ancillary_65 offer_ancillary_66 offer_ancillary_67 offer_ancillary_68 offer_ancillary_69 offer_ancillary_70 offer_ancillary_71 offer_ancillary_72 offer_ancillary_73 offer_ancillary_74 offer_ancillary_75 offer_ancillary_76 offer_ancillary_77 offer_ancillary_78 offer_ancillary_79 offer_ancillary_80 offer_ancillary_81 offer_ancillary_82 offer_ancillary_83 offer_ancillary_84 offer_ancillary_85 offer_ancillary_86 offer_ancillary_87 offer_ancillary_88 offer_ancillary_89 offer_ancillary_90 offer_ancillary_91 offer_ancillary_92 offer_ancillary_93 offer_ancillary_94 offer_ancillary_95 offer_ancillary_96 offer_ancillary_97 offer_ancillary_98 offer_ancillary_99 offer_ancillary_100 offer_ancillary_101 offer_ancillary_102 offer_ancillary_103 offer_ancillary_104 offer_ancillary_105 offer_ancillary_106 offer_ancillary_107 offer_ancillary_108 offer_ancillary_109 offer_ancillary_110 offer_ancillary_111 offer_ancillary_112 offer_ancillary_113 offer_ancillary_114 offer_ancillary_115 offer_ancillary_116 offer_ancillary_117 offer_ancillary_118 offer_ancillary_119 offer_ancillary_120 offer_ancillary_121 offer_ancillary_122 offer_ancillary_123 offer_ancillary_124 offer_ancillary_125 offer_ancillary_126 offer_ancillary_127 offer_ancillary_128 offer_ancillary_129 offer_ancillary_130 offer_ancillary_131 offer_ancillary_132 offer_ancillary_133 offer_ancillary_134 offer_ancillary_135 offer_ancillary_136 offer_ancillary_137 offer_ancillary_138 offer_ancillary_139 offer_ancillary_140 offer_ancillary_141 offer_ancillary_142 offer_ancillary_143 offer_ancillary_144 offer_ancillary_145 offer_ancillary_146 offer_ancillary_147 offer_ancillary_148 offer_ancillary_150 offer_ancillary_154 offer_ancillary_156 offer_ancillary_160 offer_ancillary_164 offer_ancillary_168 offer_ancillary_170 offer_ancillary_175 offer_ancillary_179 offer_ancillary_181 offer_ancillary_185 offer_ancillary_189 offer_ancillary_193 offer_ancillary_195</ns12:OfferRefs>
  </ns37:PassengerOffers>
  <ns37:PassengerOffers>
    <ns12:PassengerReference passengerId="pax_2" passengerType="ADT"/>
    <ns12:OfferRefs>offer_ancillary_1 offer_ancillary_2 offer_ancillary_3 offer_ancillary_4 offer_ancillary_5 offer_ancillary_6 offer_ancillary_7 offer_ancillary_8 offer_ancillary_9 offer_ancillary_10 offer_ancillary_11 offer_ancillary_12 offer_ancillary_13 offer_ancillary_14 offer_ancillary_15 offer_ancillary_16 offer_ancillary_17 offer_ancillary_18 offer_ancillary_19 offer_ancillary_20 offer_ancillary_21 offer_ancillary_22 offer_ancillary_23 offer_ancillary_24 offer_ancillary_25 offer_ancillary_26 offer_ancillary_27 offer_ancillary_28 offer_ancillary_29 offer_ancillary_30 offer_ancillary_31 offer_ancillary_32 offer_ancillary_33 offer_ancillary_34 offer_ancillary_35 offer_ancillary_36 offer_ancillary_37 offer_ancillary_38 offer_ancillary_39 offer_ancillary_40 offer_ancillary_41 offer_ancillary_42 offer_ancillary_43 offer_ancillary_44 offer_ancillary_45 offer_ancillary_46 offer_ancillary_47 offer_ancillary_48 offer_ancillary_49 offer_ancillary_50 offer_ancillary_51 offer_ancillary_52 offer_ancillary_53 offer_ancillary_54 offer_ancillary_55 offer_ancillary_56 offer_ancillary_57 offer_ancillary_58 offer_ancillary_59 offer_ancillary_60 offer_ancillary_61 offer_ancillary_62 offer_ancillary_63 offer_ancillary_64 offer_ancillary_65 offer_ancillary_66 offer_ancillary_67 offer_ancillary_68 offer_ancillary_69 offer_ancillary_70 offer_ancillary_71 offer_ancillary_72 offer_ancillary_73 offer_ancillary_74 offer_ancillary_75 offer_ancillary_76 offer_ancillary_77 offer_ancillary_78 offer_ancillary_79 offer_ancillary_80 offer_ancillary_81 offer_ancillary_82 offer_ancillary_83 offer_ancillary_84 offer_ancillary_85 offer_ancillary_86 offer_ancillary_87 offer_ancillary_88 offer_ancillary_89 offer_ancillary_90 offer_ancillary_91 offer_ancillary_92 offer_ancillary_93 offer_ancillary_94 offer_ancillary_95 offer_ancillary_96 offer_ancillary_97 offer_ancillary_98 offer_ancillary_99 offer_ancillary_100 offer_ancillary_101 offer_ancillary_102 offer_ancillary_103 offer_ancillary_104 offer_ancillary_105 offer_ancillary_106 offer_ancillary_107 offer_ancillary_108 offer_ancillary_109 offer_ancillary_110 offer_ancillary_111 offer_ancillary_112 offer_ancillary_113 offer_ancillary_114 offer_ancillary_115 offer_ancillary_116 offer_ancillary_117 offer_ancillary_118 offer_ancillary_119 offer_ancillary_120 offer_ancillary_121 offer_ancillary_122 offer_ancillary_123 offer_ancillary_124 offer_ancillary_125 offer_ancillary_126 offer_ancillary_127 offer_ancillary_128 offer_ancillary_129 offer_ancillary_130 offer_ancillary_131 offer_ancillary_132 offer_ancillary_133 offer_ancillary_134 offer_ancillary_135 offer_ancillary_136 offer_ancillary_137 offer_ancillary_138 offer_ancillary_139 offer_ancillary_140 offer_ancillary_141 offer_ancillary_142 offer_ancillary_143 offer_ancillary_144 offer_ancillary_145 offer_ancillary_146 offer_ancillary_147 offer_ancillary_148 offer_ancillary_150 offer_ancillary_154 offer_ancillary_156 offer_ancillary_160 offer_ancillary_164 offer_ancillary_168 offer_ancillary_170 offer_ancillary_175 offer_ancillary_179 offer_ancillary_181 offer_ancillary_185 offer_ancillary_189 offer_ancillary_193 offer_ancillary_195</ns12:OfferRefs>
  </ns37:PassengerOffers>
  <ns37:PassengerOffers>
    <ns12:PassengerReference passengerId="pax_3" passengerType="CNN"/>
    <ns12:OfferRefs>offer_ancillary_1 offer_ancillary_2 offer_ancillary_3 offer_ancillary_4 offer_ancillary_5 offer_ancillary_6 offer_ancillary_7 offer_ancillary_8 offer_ancillary_9 offer_ancillary_10 offer_ancillary_11 offer_ancillary_12 offer_ancillary_13 offer_ancillary_14 offer_ancillary_15 offer_ancillary_16 offer_ancillary_17 offer_ancillary_18 offer_ancillary_19 offer_ancillary_20 offer_ancillary_21 offer_ancillary_22 offer_ancillary_23 offer_ancillary_24 offer_ancillary_25 offer_ancillary_26 offer_ancillary_27 offer_ancillary_28 offer_ancillary_29 offer_ancillary_30 offer_ancillary_31 offer_ancillary_32 offer_ancillary_33 offer_ancillary_34 offer_ancillary_35 offer_ancillary_36 offer_ancillary_37 offer_ancillary_38 offer_ancillary_39 offer_ancillary_40 offer_ancillary_41 offer_ancillary_42 offer_ancillary_43 offer_ancillary_44 offer_ancillary_45 offer_ancillary_46 offer_ancillary_47 offer_ancillary_48 offer_ancillary_49 offer_ancillary_50 offer_ancillary_51 offer_ancillary_52 offer_ancillary_53 offer_ancillary_54 offer_ancillary_55 offer_ancillary_56 offer_ancillary_57 offer_ancillary_58 offer_ancillary_59 offer_ancillary_60 offer_ancillary_61 offer_ancillary_62 offer_ancillary_63 offer_ancillary_64 offer_ancillary_65 offer_ancillary_66 offer_ancillary_67 offer_ancillary_68 offer_ancillary_69 offer_ancillary_70 offer_ancillary_71 offer_ancillary_72 offer_ancillary_73 offer_ancillary_74 offer_ancillary_75 offer_ancillary_76 offer_ancillary_77 offer_ancillary_78 offer_ancillary_79 offer_ancillary_80 offer_ancillary_81 offer_ancillary_82 offer_ancillary_83 offer_ancillary_84 offer_ancillary_85 offer_ancillary_86 offer_ancillary_87 offer_ancillary_88 offer_ancillary_89 offer_ancillary_90 offer_ancillary_91 offer_ancillary_92 offer_ancillary_93 offer_ancillary_94 offer_ancillary_95 offer_ancillary_96 offer_ancillary_97 offer_ancillary_98 offer_ancillary_99 offer_ancillary_100 offer_ancillary_101 offer_ancillary_102 offer_ancillary_103 offer_ancillary_104 offer_ancillary_105 offer_ancillary_106 offer_ancillary_107 offer_ancillary_108 offer_ancillary_109 offer_ancillary_110 offer_ancillary_111 offer_ancillary_112 offer_ancillary_113 offer_ancillary_114 offer_ancillary_115 offer_ancillary_116 offer_ancillary_117 offer_ancillary_118 offer_ancillary_119 offer_ancillary_120 offer_ancillary_121 offer_ancillary_122 offer_ancillary_123 offer_ancillary_124 offer_ancillary_125 offer_ancillary_126 offer_ancillary_127 offer_ancillary_128 offer_ancillary_129 offer_ancillary_130 offer_ancillary_131 offer_ancillary_132 offer_ancillary_133 offer_ancillary_134 offer_ancillary_135 offer_ancillary_136 offer_ancillary_137 offer_ancillary_138 offer_ancillary_139 offer_ancillary_140 offer_ancillary_141 offer_ancillary_142 offer_ancillary_143 offer_ancillary_144 offer_ancillary_145 offer_ancillary_146 offer_ancillary_147 offer_ancillary_148 offer_ancillary_545 offer_ancillary_546 offer_ancillary_547 offer_ancillary_548 offer_ancillary_150 offer_ancillary_154 offer_ancillary_156 offer_ancillary_160 offer_ancillary_164 offer_ancillary_168 offer_ancillary_170 offer_ancillary_175 offer_ancillary_179 offer_ancillary_181 offer_ancillary_185 offer_ancillary_189 offer_ancillary_193 offer_ancillary_195</ns12:OfferRefs>
  </ns37:PassengerOffers>
  <ns37:ResponseOptions>
    <ns37:EmptyGroupList>UU BD CO LG UP</ns37:EmptyGroupList>
    <ns37:InactiveGroupList>99 ST BF RO</ns37:InactiveGroupList>
  </ns37:ResponseOptions>
</ns37:GetAncillaryOffersRS>
```
{{< /details >}}

## Параметры запроса списка дополнительных услуг после оформления билетов

### Пассажиры

{{< hint warning >}}
Обратите внимание на то, что в Sabre нельзя забронировать дополнительные услуги для младенцев без места.
{{< /hint >}}

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

{{< details title="Пример запроса" >}}
```XML
<gao:GetAncillaryOffersRQ version="3.1.0" xmlns:anc="http://services.sabre.com/merch/ancillary/v03" xmlns:flt="http://services.sabre.com/merch/flight/v03" xmlns:gao="http://services.sabre.com/merch/ancillary/offer/v03" xmlns:itin="http://services.sabre.com/merch/itinerary/v03" xmlns:pax="http://services.sabre.com/merch/passenger/v03">
  <gao:RequestType>payload</gao:RequestType>
  <gao:RequestMode>booking</gao:RequestMode>
  <gao:QueryByItinerary>
    <gao:QueryPassengerItinerary>
      <gao:Passenger id="pax_1" nameReferenceNumber="1.1"/>
      <gao:PassengerItinerary ticketReferenceNumber="6079419628276">
        <gao:PassengerSegment segmentRef="seg_1"/>
        <gao:PassengerSegment segmentRef="seg_2"/>
        <gao:PassengerSegment segmentRef="seg_3"/>
        <gao:PassengerSegment segmentRef="seg_4"/>
      </gao:PassengerItinerary>
    </gao:QueryPassengerItinerary>
    <gao:QueryPassengerItinerary>
      <gao:Passenger id="pax_2" nameReferenceNumber="2.1"/>
      <gao:PassengerItinerary ticketReferenceNumber="6079419628277">
        <gao:PassengerSegment segmentRef="seg_1"/>
        <gao:PassengerSegment segmentRef="seg_2"/>
        <gao:PassengerSegment segmentRef="seg_3"/>
        <gao:PassengerSegment segmentRef="seg_4"/>
      </gao:PassengerItinerary>
    </gao:QueryPassengerItinerary>
    <gao:QueryPassengerItinerary>
      <gao:Passenger id="pax_3" nameReferenceNumber="3.1"/>
      <gao:PassengerItinerary ticketReferenceNumber="6079419628278">
        <gao:PassengerSegment segmentRef="seg_1"/>
        <gao:PassengerSegment segmentRef="seg_2"/>
        <gao:PassengerSegment segmentRef="seg_3"/>
        <gao:PassengerSegment segmentRef="seg_4"/>
      </gao:PassengerItinerary>
    </gao:QueryPassengerItinerary>
    <gao:Segment id="seg_1">
      <itin:FlightDetail id="flight_1">
        <flt:Airline>EY</flt:Airline>
        <flt:FlightNumber>2463</flt:FlightNumber>
        <flt:DepartureAirport>SYD</flt:DepartureAirport>
        <flt:DepartureDate>2022-12-01</flt:DepartureDate>
        <flt:DepartureTime>23:25:00</flt:DepartureTime>
        <flt:ArrivalAirport>AUH</flt:ArrivalAirport>
        <flt:ClassOfService>Y</flt:ClassOfService>
      </itin:FlightDetail>
    </gao:Segment>
    <gao:Segment id="seg_2">
      <itin:FlightDetail id="flight_2">
        <flt:Airline>EY</flt:Airline>
        <flt:FlightNumber>25</flt:FlightNumber>
        <flt:DepartureAirport>AUH</flt:DepartureAirport>
        <flt:DepartureDate>2022-12-02</flt:DepartureDate>
        <flt:DepartureTime>10:35:00</flt:DepartureTime>
        <flt:ArrivalAirport>LHR</flt:ArrivalAirport>
        <flt:ClassOfService>Y</flt:ClassOfService>
      </itin:FlightDetail>
    </gao:Segment>
    <gao:Segment id="seg_3">
      <itin:FlightDetail id="flight_3">
        <flt:Airline>EY</flt:Airline>
        <flt:FlightNumber>12</flt:FlightNumber>
        <flt:DepartureAirport>LHR</flt:DepartureAirport>
        <flt:DepartureDate>2022-12-08</flt:DepartureDate>
        <flt:DepartureTime>08:30:00</flt:DepartureTime>
        <flt:ArrivalAirport>AUH</flt:ArrivalAirport>
        <flt:ClassOfService>Y</flt:ClassOfService>
      </itin:FlightDetail>
    </gao:Segment>
    <gao:Segment id="seg_4">
      <itin:FlightDetail id="flight_4">
        <flt:Airline>EY</flt:Airline>
        <flt:FlightNumber>464</flt:FlightNumber>
        <flt:DepartureAirport>AUH</flt:DepartureAirport>
        <flt:DepartureDate>2022-12-08</flt:DepartureDate>
        <flt:DepartureTime>22:10:00</flt:DepartureTime>
        <flt:ArrivalAirport>SYD</flt:ArrivalAirport>
        <flt:ClassOfService>Y</flt:ClassOfService>
      </itin:FlightDetail>
    </gao:Segment>
  </gao:QueryByItinerary>
</gao:GetAncillaryOffersRQ>
```
{{< /details >}}

{{< details title="Пример ответа" >}}
```XML
<ns37:GetAncillaryOffersRS xmlns:ns10="http://services.sabre.com/merch/baggage/v02" xmlns:ns11="http://services.sabre.com/merch/seat/v02" xmlns:ns12="http://services.sabre.com/merch/ancillary/v03" xmlns:ns13="http://services.sabre.com/merch/flight/v03" xmlns:ns14="http://services.sabre.com/merch/baggage/v03" xmlns:ns15="http://services.sabre.com/merch/ancillary/v08" xmlns:ns16="http://services.sabre.com/merch/common/v08" xmlns:ns17="http://www.OpenTravel.org/ns/OTA2/AppInfo_v01_00" xmlns:ns18="http://www.w3.org/2000/09/xmldsig#" xmlns:ns19="http://services.sabre.com/essm/core/v1" xmlns:ns2="http://services.sabre.com/merch/common/v03" xmlns:ns20="http://services.sabre.com/merch/ancillary/calculator/v022" xmlns:ns21="http://services.sabre.com/merch/request/v02" xmlns:ns22="http://services.sabre.com/merch/passenger/v02" xmlns:ns23="http://services.sabre.com/STL_Payload/v02_01" xmlns:ns24="http://services.sabre.com/merch/ancillary/calculator/v02" xmlns:ns25="http://www.sabre.com/ns/Ticketing/pqs/1.0" xmlns:ns26="http://www.sabre.com/ns/Ticketing/TTL/1.0" xmlns:ns27="http://services.sabre.com/STL/v01" xmlns:ns28="http://webservices.sabre.com/servicesplatform/mock/1.0.0" xmlns:ns29="http://services.sabre.com/STL/v02" xmlns:ns3="http://opentravel.org/common/message/v02" xmlns:ns30="http://services.sabre.com/merch/ancillary/seatprice/v02" xmlns:ns31="http://services.sabre.com/ssse/trace/v01" xmlns:ns32="http://stl.sabre.com/Merchandising/diagnostics/v2" xmlns:ns33="http://services.sabre.com/merch/passenger/v03" xmlns:ns34="http://schemas.xmlsoap.org/ws/2002/12/secext" xmlns:ns35="http://services.sabre.com/merch/itinerary/v03" xmlns:ns36="http://services.sabre.com/merch/ticket/v03" xmlns:ns37="http://services.sabre.com/merch/ancillary/offer/v03" xmlns:ns38="http://services.sabre.com/merch/request/v03" xmlns:ns39="http://services.sabre.com/merch/ancillary/offer/v02" xmlns:ns4="http://opentravel.org/common/v02" xmlns:ns40="http://services.sabre.com/merch/ancillary/offer/v01" xmlns:ns41="http://services.sabre.com/ANCS/v01" xmlns:ns42="http://services.sabre.com/STL_Payload/v02_00" xmlns:ns43="http://services.sabre.com/merch/ancillary/seatprice/v01" xmlns:ns44="http://webservices.sabre.com/servicesplatform/eiapi/1.0.0" xmlns:ns45="http://www.atse.sabre.com/AncillaryPricing/Request" xmlns:ns46="http://webservices.sabre.com/pnrbuilder/v1_19" xmlns:ns47="http://services.sabre.com/res/or/v1_14" xmlns:ns48="http://jaxb2-commons.dev.java.net/basic/inheritance" xmlns:ns49="http://www.sabre.com/eps/schemas/market_reference" xmlns:ns5="http://www.ebxml.org/namespaces/messageHeader" xmlns:ns50="http://services.sabre.com/essm/diagnostic/v1" xmlns:ns51="http://services.sabre.com/sp/sss/v1" xmlns:ns52="http://services.sabre.com/STL_Header/v02_02" xmlns:ns53="http://services.sabre.com/STL_Header/v120" xmlns:ns54="http://services.sabre.com/STL_Header/v02_01" xmlns:ns55="http://services.sabre.com/merch/ancillary/sellcancel/v01" xmlns:ns56="http://services.sabre.com/merch/ancillary/sellcancel/v02" xmlns:ns57="http://services.sabre.com/STL_Payload/v02_02" xmlns:ns58="http://services.sabre.com/sp/ssp/v1" xmlns:ns59="http://services.sabre.com/essm/session/v1" xmlns:ns6="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns60="http://services.sabre.com/merch/catalog/v01" xmlns:ns61="http://services.sabre.com/merch/ancillary/catalogquery/v01" xmlns:ns62="http://www.atse.sabre.com/AncillaryPricing/Response" xmlns:ns63="http://services.sabre.com/sp/preferences/v1" xmlns:ns64="http://www.sabre.com/eps/schemas" xmlns:ns7="http://www.w3.org/1999/xlink" xmlns:ns8="http://services.sabre.com/merch/ancillary/v02" xmlns:ns9="http://services.sabre.com/merch/common/v02">
  <ns23:ApplicationResults status="Complete">
    <ns23:Success timeStamp="2022-05-20T05:43:20.620-05:00"/>
  </ns23:ApplicationResults>
  <ns37:OfferId>ce847dccc4b6fk9nbl3ebcypx0</ns37:OfferId>
  <ns37:AncillaryDefinition id="ancillary_1">
    <SubCode>0NF</SubCode>
    <Airline>EY</Airline>
    <CommercialName>MILES BONUS PURCHASE</CommercialName>
    <Vendor>MMGR</Vendor>
    <Group>FF</Group>
    <GroupDescription>FREQUENT FLIER</GroupDescription>
    <SubGroup>MG</SubGroup>
    <SubGroupDescription>MILEAGE ACCRUAL</SubGroupDescription>
    <SpecialService>GRPF</SpecialService>
    <ReasonForIssuance code="B">GROUND_TRANSPORT_NON_AIR_SERVICES</ReasonForIssuance>
    <SpecialServiceDetails type="OPTIONAL"/>
    <ElectronicMiscDocType code="2">FLIGHT_COUPON_ASSOCIATED</ElectronicMiscDocType>
    <BookingMethod code="01">SPECIAL_SERVICE_REQUEST</BookingMethod>
  </ns37:AncillaryDefinition>
  <ns37:AncillaryDefinition id="ancillary_2">
    <SubCode>0NG</SubCode>
    <Airline>EY</Airline>
    <CommercialName>MILES BONUS TRANSFER</CommercialName>
    <Vendor>MMGR</Vendor>
    <Group>FF</Group>
    <GroupDescription>FREQUENT FLIER</GroupDescription>
    <SubGroup>MG</SubGroup>
    <SubGroupDescription>MILEAGE ACCRUAL</SubGroupDescription>
    <ReasonForIssuance code="B">GROUND_TRANSPORT_NON_AIR_SERVICES</ReasonForIssuance>
    <ElectronicMiscDocType code="2">FLIGHT_COUPON_ASSOCIATED</ElectronicMiscDocType>
    <BookingMethod code="BLANK">ANY_ALLOWED</BookingMethod>
  </ns37:AncillaryDefinition>
  <ns37:AncillaryDefinition id="ancillary_5">
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
  </ns37:AncillaryDefinition>
  <ns37:AncillaryDefinition id="ancillary_6">
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
  </ns37:AncillaryDefinition>
  <ns37:AncillaryDefinition id="ancillary_13">
    <SubCode>AMB</SubCode>
    <Airline>EY</Airline>
    <CommercialName>AIRPORT MILES UG BASE</CommercialName>
    <Vendor>MMGR</Vendor>
    <Group>IE</Group>
    <GroupDescription>IN-FLIGHT ENTERTAINMENT</GroupDescription>
    <ReasonForIssuance code="G">IN_FLIGHT_SERVICES</ReasonForIssuance>
    <ElectronicMiscDocType code="2">FLIGHT_COUPON_ASSOCIATED</ElectronicMiscDocType>
    <BookingMethod code="BLANK">ANY_ALLOWED</BookingMethod>
  </ns37:AncillaryDefinition>
  <ns37:AncillaryDefinition id="ancillary_14">
    <SubCode>AMG</SubCode>
    <Airline>EY</Airline>
    <CommercialName>AIRPORT MILES UG GLD PLT KHAAS</CommercialName>
    <Vendor>MMGR</Vendor>
    <Group>IE</Group>
    <GroupDescription>IN-FLIGHT ENTERTAINMENT</GroupDescription>
    <ReasonForIssuance code="G">IN_FLIGHT_SERVICES</ReasonForIssuance>
    <ElectronicMiscDocType code="2">FLIGHT_COUPON_ASSOCIATED</ElectronicMiscDocType>
    <BookingMethod code="BLANK">ANY_ALLOWED</BookingMethod>
  </ns37:AncillaryDefinition>
  <ns37:AncillaryDefinition id="ancillary_15">
    <SubCode>AMS</SubCode>
    <Airline>EY</Airline>
    <CommercialName>AIRPORT MILES UG SILVER</CommercialName>
    <Vendor>MMGR</Vendor>
    <Group>IE</Group>
    <GroupDescription>IN-FLIGHT ENTERTAINMENT</GroupDescription>
    <ReasonForIssuance code="G">IN_FLIGHT_SERVICES</ReasonForIssuance>
    <ElectronicMiscDocType code="2">FLIGHT_COUPON_ASSOCIATED</ElectronicMiscDocType>
    <BookingMethod code="BLANK">ANY_ALLOWED</BookingMethod>
  </ns37:AncillaryDefinition>
  <ns37:AncillaryDefinition id="ancillary_16">
    <SubCode>ELS</SubCode>
    <Airline>EY</Airline>
    <CommercialName>ECONOMY SPACE</CommercialName>
    <Vendor>MMGR</Vendor>
    <Group>IE</Group>
    <GroupDescription>IN-FLIGHT ENTERTAINMENT</GroupDescription>
    <ReasonForIssuance code="G">IN_FLIGHT_SERVICES</ReasonForIssuance>
    <ElectronicMiscDocType code="2">FLIGHT_COUPON_ASSOCIATED</ElectronicMiscDocType>
    <BookingMethod code="BLANK">ANY_ALLOWED</BookingMethod>
  </ns37:AncillaryDefinition>
  <ns37:AncillaryDefinition id="ancillary_17">
    <SubCode>IUC</SubCode>
    <Airline>EY</Airline>
    <CommercialName>INSTANT AIRPORT UPGRADE Y TO C</CommercialName>
    <Vendor>MMGR</Vendor>
    <Group>IE</Group>
    <GroupDescription>IN-FLIGHT ENTERTAINMENT</GroupDescription>
    <ReasonForIssuance code="I">INDIVIDUAL_AIRLINE_USE</ReasonForIssuance>
    <ElectronicMiscDocType code="2">FLIGHT_COUPON_ASSOCIATED</ElectronicMiscDocType>
    <BookingMethod code="BLANK">ANY_ALLOWED</BookingMethod>
  </ns37:AncillaryDefinition>
  <ns37:AncillaryDefinition id="ancillary_18">
    <SubCode>IUY</SubCode>
    <Airline>EY</Airline>
    <CommercialName>INSTANT AIRPORT UPGRADE C TO F</CommercialName>
    <Vendor>MMGR</Vendor>
    <Group>IE</Group>
    <GroupDescription>IN-FLIGHT ENTERTAINMENT</GroupDescription>
    <ReasonForIssuance code="I">INDIVIDUAL_AIRLINE_USE</ReasonForIssuance>
    <ElectronicMiscDocType code="2">FLIGHT_COUPON_ASSOCIATED</ElectronicMiscDocType>
    <BookingMethod code="BLANK">ANY_ALLOWED</BookingMethod>
  </ns37:AncillaryDefinition>
  <ns37:AncillaryDefinition id="ancillary_19">
    <SubCode>NFS</SubCode>
    <Airline>EY</Airline>
    <CommercialName>NEIGHBOR FREE SEAT</CommercialName>
    <Vendor>MMGR</Vendor>
    <Group>IE</Group>
    <GroupDescription>IN-FLIGHT ENTERTAINMENT</GroupDescription>
    <ReasonForIssuance code="G">IN_FLIGHT_SERVICES</ReasonForIssuance>
    <ElectronicMiscDocType code="2">FLIGHT_COUPON_ASSOCIATED</ElectronicMiscDocType>
    <BookingMethod code="BLANK">ANY_ALLOWED</BookingMethod>
  </ns37:AncillaryDefinition>
  <ns37:AncillaryDefinition id="ancillary_20">
    <SubCode>PLS</SubCode>
    <Airline>EY</Airline>
    <CommercialName>PLUS GRADE Y TO J</CommercialName>
    <Vendor>MMGR</Vendor>
    <Group>IE</Group>
    <GroupDescription>IN-FLIGHT ENTERTAINMENT</GroupDescription>
    <ReasonForIssuance code="G">IN_FLIGHT_SERVICES</ReasonForIssuance>
    <ElectronicMiscDocType code="2">FLIGHT_COUPON_ASSOCIATED</ElectronicMiscDocType>
    <BookingMethod code="BLANK">ANY_ALLOWED</BookingMethod>
  </ns37:AncillaryDefinition>
  <ns37:AncillaryDefinition id="ancillary_21">
    <SubCode>PUC</SubCode>
    <Airline>EY</Airline>
    <CommercialName>PUSH UPGRADE Y TO C</CommercialName>
    <Vendor>MMGR</Vendor>
    <Group>IE</Group>
    <GroupDescription>IN-FLIGHT ENTERTAINMENT</GroupDescription>
    <ReasonForIssuance code="G">IN_FLIGHT_SERVICES</ReasonForIssuance>
    <ElectronicMiscDocType code="2">FLIGHT_COUPON_ASSOCIATED</ElectronicMiscDocType>
    <BookingMethod code="BLANK">ANY_ALLOWED</BookingMethod>
  </ns37:AncillaryDefinition>
  <ns37:AncillaryDefinition id="ancillary_22">
    <SubCode>PUY</SubCode>
    <Airline>EY</Airline>
    <CommercialName>PUSH UPGARDE C TO F</CommercialName>
    <Vendor>MMGR</Vendor>
    <Group>IE</Group>
    <GroupDescription>IN-FLIGHT ENTERTAINMENT</GroupDescription>
    <ReasonForIssuance code="G">IN_FLIGHT_SERVICES</ReasonForIssuance>
    <ElectronicMiscDocType code="2">FLIGHT_COUPON_ASSOCIATED</ElectronicMiscDocType>
    <BookingMethod code="BLANK">ANY_ALLOWED</BookingMethod>
  </ns37:AncillaryDefinition>
  <ns37:AncillaryDefinition id="ancillary_23">
    <SubCode>SCS</SubCode>
    <Airline>EY</Airline>
    <CommercialName>SPECIAL CATERING 1380</CommercialName>
    <Vendor>MMGR</Vendor>
    <Group>IE</Group>
    <GroupDescription>IN-FLIGHT ENTERTAINMENT</GroupDescription>
    <ReasonForIssuance code="G">IN_FLIGHT_SERVICES</ReasonForIssuance>
    <ElectronicMiscDocType code="2">FLIGHT_COUPON_ASSOCIATED</ElectronicMiscDocType>
    <BookingMethod code="BLANK">ANY_ALLOWED</BookingMethod>
  </ns37:AncillaryDefinition>
  <ns37:AncillaryDefinition id="ancillary_27">
    <SubCode>HDC</SubCode>
    <Airline>EY</Airline>
    <CommercialName>HUB DISRUPTION COST</CommercialName>
    <Vendor>MMGR</Vendor>
    <Group>IE</Group>
    <GroupDescription>IN-FLIGHT ENTERTAINMENT</GroupDescription>
    <ReasonForIssuance code="G">IN_FLIGHT_SERVICES</ReasonForIssuance>
    <ElectronicMiscDocType code="2">FLIGHT_COUPON_ASSOCIATED</ElectronicMiscDocType>
    <BookingMethod code="BLANK">ANY_ALLOWED</BookingMethod>
  </ns37:AncillaryDefinition>
  <ns37:AncillaryDefinition id="ancillary_57">
    <SubCode>0B4</SubCode>
    <Airline>EY</Airline>
    <CommercialName>OXYGEN</CommercialName>
    <Vendor>MMGR</Vendor>
    <Group>MD</Group>
    <GroupDescription>MEDICAL</GroupDescription>
    <SubGroup>OX</SubGroup>
    <SubGroupDescription>OXYGEN</SubGroupDescription>
    <SpecialService>OXYG</SpecialService>
    <ReasonForIssuance code="E">AIRPORT_SERVICES</ReasonForIssuance>
    <SpecialServiceDetails type="NOTALLOWED"/>
    <ElectronicMiscDocType code="2">FLIGHT_COUPON_ASSOCIATED</ElectronicMiscDocType>
    <BookingMethod code="01">SPECIAL_SERVICE_REQUEST</BookingMethod>
  </ns37:AncillaryDefinition>
  <ns37:AncillaryDefinition id="ancillary_61">
    <SubCode>0AT</SubCode>
    <Airline>EY</Airline>
    <CommercialName>SNACK</CommercialName>
    <Vendor>MMGR</Vendor>
    <Group>ML</Group>
    <GroupDescription>MEAL/BEVERAGE</GroupDescription>
    <SubGroup>SN</SubGroup>
    <SubGroupDescription>SNACK</SubGroupDescription>
    <ReasonForIssuance code="G">IN_FLIGHT_SERVICES</ReasonForIssuance>
    <ElectronicMiscDocType code="2">FLIGHT_COUPON_ASSOCIATED</ElectronicMiscDocType>
    <BookingMethod code="BLANK">ANY_ALLOWED</BookingMethod>
  </ns37:AncillaryDefinition>
  <ns37:AncillaryDefinition id="ancillary_62">
    <SubCode>01F</SubCode>
    <Airline>EY</Airline>
    <CommercialName>JAPANESE MEAL</CommercialName>
    <Vendor>MMGR</Vendor>
    <Group>ML</Group>
    <GroupDescription>MEAL/BEVERAGE</GroupDescription>
    <ReasonForIssuance code="G">IN_FLIGHT_SERVICES</ReasonForIssuance>
    <ElectronicMiscDocType code="2">FLIGHT_COUPON_ASSOCIATED</ElectronicMiscDocType>
    <BookingMethod code="BLANK">ANY_ALLOWED</BookingMethod>
  </ns37:AncillaryDefinition>
  <ns37:AncillaryDefinition id="ancillary_67">
    <SubCode>FAL</SubCode>
    <Airline>EY</Airline>
    <CommercialName>FALCON</CommercialName>
    <Vendor>MMGR</Vendor>
    <Group>PT</Group>
    <GroupDescription>PETS</GroupDescription>
    <ReasonForIssuance code="I">INDIVIDUAL_AIRLINE_USE</ReasonForIssuance>
    <ElectronicMiscDocType code="2">FLIGHT_COUPON_ASSOCIATED</ElectronicMiscDocType>
    <BookingMethod code="BLANK">ANY_ALLOWED</BookingMethod>
  </ns37:AncillaryDefinition>
  <ns37:AncillaryDefinition id="ancillary_69">
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
  </ns37:AncillaryDefinition>
  <ns37:AncillaryDefinition id="ancillary_137">
    <SubCode>0BV</SubCode>
    <Airline>EY</Airline>
    <CommercialName>STANDBY</CommercialName>
    <Vendor>MMGR</Vendor>
    <Group>SB</Group>
    <GroupDescription>STANDBY</GroupDescription>
    <ReasonForIssuance code="B">GROUND_TRANSPORT_NON_AIR_SERVICES</ReasonForIssuance>
    <ElectronicMiscDocType code="2">FLIGHT_COUPON_ASSOCIATED</ElectronicMiscDocType>
    <BookingMethod code="BLANK">ANY_ALLOWED</BookingMethod>
  </ns37:AncillaryDefinition>
  <ns37:AncillaryDefinition id="ancillary_138">
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
  </ns37:AncillaryDefinition>
  <ns37:AncillaryDefinition id="ancillary_145">
    <SubCode>03P</SubCode>
    <Airline>EY</Airline>
    <CommercialName>PRIORITY ACCESS</CommercialName>
    <Vendor>ATP</Vendor>
    <Group>TS</Group>
    <GroupDescription>TRAVEL SERVICES</GroupDescription>
    <SubGroup>PO</SubGroup>
    <SubGroupDescription>PRIORITY CHECK IN</SubGroupDescription>
    <SpecialService>PRIO</SpecialService>
    <ReasonForIssuance code="A">AIR_TRANSPORTATION</ReasonForIssuance>
    <SpecialServiceDetails type="NOTALLOWED"/>
    <ElectronicMiscDocType code="2">FLIGHT_COUPON_ASSOCIATED</ElectronicMiscDocType>
    <BookingMethod code="01">SPECIAL_SERVICE_REQUEST</BookingMethod>
  </ns37:AncillaryDefinition>
  <ns37:AncillaryDefinition id="ancillary_146">
    <SubCode>0L6</SubCode>
    <Airline>EY</Airline>
    <CommercialName>SPLIT GROUP</CommercialName>
    <Vendor>MMGR</Vendor>
    <Group>TS</Group>
    <GroupDescription>TRAVEL SERVICES</GroupDescription>
    <ReasonForIssuance code="B">GROUND_TRANSPORT_NON_AIR_SERVICES</ReasonForIssuance>
    <ElectronicMiscDocType code="2">FLIGHT_COUPON_ASSOCIATED</ElectronicMiscDocType>
    <BookingMethod code="BLANK">ANY_ALLOWED</BookingMethod>
  </ns37:AncillaryDefinition>
  <ns37:AncillaryDefinition id="ancillary_150">
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
  </ns37:AncillaryDefinition>
  <ns37:AncillaryDefinition id="ancillary_154">
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
  </ns37:AncillaryDefinition>
  <ns37:AncillaryDefinition id="ancillary_156">
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
  </ns37:AncillaryDefinition>
  <ns37:AncillaryDefinition id="ancillary_160">
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
  </ns37:AncillaryDefinition>
  <ns37:AncillaryDefinition id="ancillary_164">
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
  </ns37:AncillaryDefinition>
  <ns37:AncillaryDefinition id="ancillary_168">
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
  </ns37:AncillaryDefinition>
  <ns37:AncillaryDefinition id="ancillary_170">
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
  </ns37:AncillaryDefinition>
  <ns37:AncillaryDefinition id="ancillary_545">
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
  </ns37:AncillaryDefinition>
  <ns37:Ancillary ancillaryDefinitionRef="ancillary_1" ancillaryId="ancillary_ancillary_1">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>P</SectorPortionInd>
    <SequenceNumber>2000</SequenceNumber>
    <TravelDateEffective>2014-02-27</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>PAYMENT_REQUIRED</AirExtraStatus>
    <Footnote>N</Footnote>
  </ns37:Ancillary>
  <ns37:Ancillary ancillaryDefinitionRef="ancillary_2" ancillaryId="ancillary_ancillary_2">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>1000</SequenceNumber>
    <TravelDateEffective>2014-02-27</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>PAYMENT_REQUIRED</AirExtraStatus>
    <Footnote>N</Footnote>
  </ns37:Ancillary>
  <ns37:Ancillary ancillaryDefinitionRef="ancillary_5" ancillaryId="ancillary_ancillary_5">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>2000</SequenceNumber>
    <TravelDateEffective>2013-08-01</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>PAYMENT_REQUIRED</AirExtraStatus>
    <Footnote>X</Footnote>
  </ns37:Ancillary>
  <ns37:Ancillary ancillaryDefinitionRef="ancillary_6" ancillaryId="ancillary_ancillary_6">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>1000</SequenceNumber>
    <TravelDateEffective>2014-12-05</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>PAYMENT_REQUIRED</AirExtraStatus>
    <Footnote>N</Footnote>
  </ns37:Ancillary>
  <ns37:Ancillary ancillaryDefinitionRef="ancillary_5" ancillaryId="ancillary_ancillary_7">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>1000</SequenceNumber>
    <TravelDateEffective>2013-08-01</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>PAYMENT_REQUIRED</AirExtraStatus>
    <Footnote>X</Footnote>
  </ns37:Ancillary>
  <ns37:Ancillary ancillaryDefinitionRef="ancillary_13" ancillaryId="ancillary_ancillary_13">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>1000</SequenceNumber>
    <TravelDateEffective>2020-12-07</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>PAYMENT_REQUIRED</AirExtraStatus>
    <Footnote>X</Footnote>
  </ns37:Ancillary>
  <ns37:Ancillary ancillaryDefinitionRef="ancillary_14" ancillaryId="ancillary_ancillary_14">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>15000</SequenceNumber>
    <TravelDateEffective>2017-11-16</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>PAYMENT_REQUIRED</AirExtraStatus>
    <Footnote>X</Footnote>
  </ns37:Ancillary>
  <ns37:Ancillary ancillaryDefinitionRef="ancillary_15" ancillaryId="ancillary_ancillary_15">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>15000</SequenceNumber>
    <TravelDateEffective>2017-11-21</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>PAYMENT_REQUIRED</AirExtraStatus>
    <Footnote>X</Footnote>
  </ns37:Ancillary>
  <ns37:Ancillary ancillaryDefinitionRef="ancillary_16" ancillaryId="ancillary_ancillary_16">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>1000</SequenceNumber>
    <TravelDateEffective>2017-11-06</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>PAYMENT_REQUIRED</AirExtraStatus>
    <Footnote>N</Footnote>
  </ns37:Ancillary>
  <ns37:Ancillary ancillaryDefinitionRef="ancillary_17" ancillaryId="ancillary_ancillary_17">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>52000</SequenceNumber>
    <TravelDateEffective>2013-07-24</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>PAYMENT_REQUIRED</AirExtraStatus>
    <Footnote>N</Footnote>
  </ns37:Ancillary>
  <ns37:Ancillary ancillaryDefinitionRef="ancillary_18" ancillaryId="ancillary_ancillary_18">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>44000</SequenceNumber>
    <TravelDateEffective>2013-07-14</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>PAYMENT_REQUIRED</AirExtraStatus>
    <Footnote>N</Footnote>
  </ns37:Ancillary>
  <ns37:Ancillary ancillaryDefinitionRef="ancillary_19" ancillaryId="ancillary_ancillary_19">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>2000</SequenceNumber>
    <TravelDateEffective>2017-02-22</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>PAYMENT_REQUIRED</AirExtraStatus>
    <Footnote/>
  </ns37:Ancillary>
  <ns37:Ancillary ancillaryDefinitionRef="ancillary_20" ancillaryId="ancillary_ancillary_20">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>1000</SequenceNumber>
    <TravelDateEffective>2018-11-25</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>PAYMENT_REQUIRED</AirExtraStatus>
    <Footnote>N</Footnote>
  </ns37:Ancillary>
  <ns37:Ancillary ancillaryDefinitionRef="ancillary_21" ancillaryId="ancillary_ancillary_21">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>73000</SequenceNumber>
    <TravelDateEffective>2013-02-28</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>PAYMENT_REQUIRED</AirExtraStatus>
    <Footnote>N</Footnote>
  </ns37:Ancillary>
  <ns37:Ancillary ancillaryDefinitionRef="ancillary_22" ancillaryId="ancillary_ancillary_22">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>17000</SequenceNumber>
    <TravelDateEffective>2013-02-28</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>PAYMENT_REQUIRED</AirExtraStatus>
    <Footnote>N</Footnote>
  </ns37:Ancillary>
  <ns37:Ancillary ancillaryDefinitionRef="ancillary_23" ancillaryId="ancillary_ancillary_23">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>1000</SequenceNumber>
    <TravelDateEffective>2014-09-03</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>NO_AE</AirExtraStatus>
    <Footnote>*</Footnote>
  </ns37:Ancillary>
  <ns37:Ancillary ancillaryDefinitionRef="ancillary_14" ancillaryId="ancillary_ancillary_25">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>5000</SequenceNumber>
    <TravelDateEffective>2017-11-15</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>PAYMENT_REQUIRED</AirExtraStatus>
    <Footnote>X</Footnote>
  </ns37:Ancillary>
  <ns37:Ancillary ancillaryDefinitionRef="ancillary_15" ancillaryId="ancillary_ancillary_26">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>1000</SequenceNumber>
    <TravelDateEffective>2017-11-15</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>PAYMENT_REQUIRED</AirExtraStatus>
    <Footnote>X</Footnote>
  </ns37:Ancillary>
  <ns37:Ancillary ancillaryDefinitionRef="ancillary_27" ancillaryId="ancillary_ancillary_27">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>30000</SequenceNumber>
    <TravelDateEffective>2018-09-27</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>PAYMENT_REQUIRED</AirExtraStatus>
    <Footnote>N</Footnote>
  </ns37:Ancillary>
  <ns37:Ancillary ancillaryDefinitionRef="ancillary_17" ancillaryId="ancillary_ancillary_28">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>102000</SequenceNumber>
    <TravelDateEffective>2014-12-22</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>PAYMENT_REQUIRED</AirExtraStatus>
    <Footnote>N</Footnote>
  </ns37:Ancillary>
  <ns37:Ancillary ancillaryDefinitionRef="ancillary_18" ancillaryId="ancillary_ancillary_29">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>24000</SequenceNumber>
    <TravelDateEffective>2014-12-22</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>PAYMENT_REQUIRED</AirExtraStatus>
    <Footnote>N</Footnote>
  </ns37:Ancillary>
  <ns37:Ancillary ancillaryDefinitionRef="ancillary_21" ancillaryId="ancillary_ancillary_32">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>69000</SequenceNumber>
    <TravelDateEffective>2013-02-28</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>PAYMENT_REQUIRED</AirExtraStatus>
    <Footnote>N</Footnote>
  </ns37:Ancillary>
  <ns37:Ancillary ancillaryDefinitionRef="ancillary_22" ancillaryId="ancillary_ancillary_33">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>9000</SequenceNumber>
    <TravelDateEffective>2013-02-28</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>PAYMENT_REQUIRED</AirExtraStatus>
    <Footnote>N</Footnote>
  </ns37:Ancillary>
  <ns37:Ancillary ancillaryDefinitionRef="ancillary_17" ancillaryId="ancillary_ancillary_38">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>188000</SequenceNumber>
    <TravelDateEffective>2015-06-15</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>PAYMENT_REQUIRED</AirExtraStatus>
    <Footnote>N</Footnote>
  </ns37:Ancillary>
  <ns37:Ancillary ancillaryDefinitionRef="ancillary_18" ancillaryId="ancillary_ancillary_39">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>9000</SequenceNumber>
    <TravelDateEffective>2014-12-22</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>PAYMENT_REQUIRED</AirExtraStatus>
    <Footnote>N</Footnote>
  </ns37:Ancillary>
  <ns37:Ancillary ancillaryDefinitionRef="ancillary_27" ancillaryId="ancillary_ancillary_49">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>23000</SequenceNumber>
    <TravelDateEffective>2018-09-27</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>PAYMENT_REQUIRED</AirExtraStatus>
    <Footnote>N</Footnote>
  </ns37:Ancillary>
  <ns37:Ancillary ancillaryDefinitionRef="ancillary_17" ancillaryId="ancillary_ancillary_50">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>109000</SequenceNumber>
    <TravelDateEffective>2013-07-24</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>PAYMENT_REQUIRED</AirExtraStatus>
    <Footnote>N</Footnote>
  </ns37:Ancillary>
  <ns37:Ancillary ancillaryDefinitionRef="ancillary_18" ancillaryId="ancillary_ancillary_51">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>17000</SequenceNumber>
    <TravelDateEffective>2013-07-24</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>PAYMENT_REQUIRED</AirExtraStatus>
    <Footnote>N</Footnote>
  </ns37:Ancillary>
  <ns37:Ancillary ancillaryDefinitionRef="ancillary_57" ancillaryId="ancillary_ancillary_57">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>1000</SequenceNumber>
    <TravelDateEffective>2016-06-06</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>PAYMENT_REQUIRED</AirExtraStatus>
    <Footnote>X</Footnote>
  </ns37:Ancillary>
  <ns37:Ancillary ancillaryDefinitionRef="ancillary_61" ancillaryId="ancillary_ancillary_61">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>3000</SequenceNumber>
    <TravelDateEffective>2015-11-03</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>PAYMENT_REQUIRED</AirExtraStatus>
    <Footnote>/</Footnote>
  </ns37:Ancillary>
  <ns37:Ancillary ancillaryDefinitionRef="ancillary_62" ancillaryId="ancillary_ancillary_62">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>1000</SequenceNumber>
    <TravelDateEffective>2013-08-14</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>PAYMENT_REQUIRED</AirExtraStatus>
    <Footnote/>
  </ns37:Ancillary>
  <ns37:Ancillary ancillaryDefinitionRef="ancillary_67" ancillaryId="ancillary_ancillary_67">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>P</SectorPortionInd>
    <SequenceNumber>37000</SequenceNumber>
    <TravelDateEffective>2017-05-17</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>PAYMENT_REQUIRED</AirExtraStatus>
    <Footnote>N</Footnote>
  </ns37:Ancillary>
  <ns37:Ancillary ancillaryDefinitionRef="ancillary_69" ancillaryId="ancillary_ancillary_69">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>278130</SequenceNumber>
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
  </ns37:Ancillary>
  <ns37:Ancillary ancillaryDefinitionRef="ancillary_69" ancillaryId="ancillary_ancillary_70">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>316630</SequenceNumber>
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
  </ns37:Ancillary>
  <ns37:Ancillary ancillaryDefinitionRef="ancillary_69" ancillaryId="ancillary_ancillary_71">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>527130</SequenceNumber>
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
  </ns37:Ancillary>
  <ns37:Ancillary ancillaryDefinitionRef="ancillary_69" ancillaryId="ancillary_ancillary_72">
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
  </ns37:Ancillary>
  <ns37:Ancillary ancillaryDefinitionRef="ancillary_69" ancillaryId="ancillary_ancillary_73">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>571130</SequenceNumber>
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
          <Code>W</Code>
          <TranslatedName>WINDOW</TranslatedName>
          <AbbreviatedName>WIND</AbbreviatedName>
        </Characteristic>
      </PADIS_CodeTableInfo>
    </PADIS_SeatProcessing>
    <Footnote>@</Footnote>
  </ns37:Ancillary>
  <ns37:Ancillary ancillaryDefinitionRef="ancillary_69" ancillaryId="ancillary_ancillary_74">
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
  </ns37:Ancillary>
  <ns37:Ancillary ancillaryDefinitionRef="ancillary_69" ancillaryId="ancillary_ancillary_75">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>573130</SequenceNumber>
    <TravelDateEffective>1980-01-01</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>PAYMENT_REQUIRED</AirExtraStatus>
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
  </ns37:Ancillary>
  <ns37:Ancillary ancillaryDefinitionRef="ancillary_69" ancillaryId="ancillary_ancillary_76">
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
  </ns37:Ancillary>
  <ns37:Ancillary ancillaryDefinitionRef="ancillary_69" ancillaryId="ancillary_ancillary_77">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>575130</SequenceNumber>
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
      </PADIS_CodeTableInfo>
    </PADIS_SeatProcessing>
    <Footnote>@</Footnote>
  </ns37:Ancillary>
  <ns37:Ancillary ancillaryDefinitionRef="ancillary_69" ancillaryId="ancillary_ancillary_78">
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
  </ns37:Ancillary>
  <ns37:Ancillary ancillaryDefinitionRef="ancillary_69" ancillaryId="ancillary_ancillary_79">
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
  </ns37:Ancillary>
  <ns37:Ancillary ancillaryDefinitionRef="ancillary_69" ancillaryId="ancillary_ancillary_80">
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
  </ns37:Ancillary>
  <ns37:Ancillary ancillaryDefinitionRef="ancillary_69" ancillaryId="ancillary_ancillary_81">
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
  </ns37:Ancillary>
  <ns37:Ancillary ancillaryDefinitionRef="ancillary_69" ancillaryId="ancillary_ancillary_82">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>692380</SequenceNumber>
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
  </ns37:Ancillary>
  <ns37:Ancillary ancillaryDefinitionRef="ancillary_69" ancillaryId="ancillary_ancillary_83">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>692880</SequenceNumber>
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
          <Code>W</Code>
          <TranslatedName>WINDOW</TranslatedName>
          <AbbreviatedName>WIND</AbbreviatedName>
        </Characteristic>
      </PADIS_CodeTableInfo>
    </PADIS_SeatProcessing>
    <Footnote>@</Footnote>
  </ns37:Ancillary>
  <ns37:Ancillary ancillaryDefinitionRef="ancillary_69" ancillaryId="ancillary_ancillary_84">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>693380</SequenceNumber>
    <TravelDateEffective>1980-01-01</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>PAYMENT_REQUIRED</AirExtraStatus>
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
  </ns37:Ancillary>
  <ns37:Ancillary ancillaryDefinitionRef="ancillary_69" ancillaryId="ancillary_ancillary_85">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>693880</SequenceNumber>
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
      </PADIS_CodeTableInfo>
    </PADIS_SeatProcessing>
    <Footnote>@</Footnote>
  </ns37:Ancillary>
  <ns37:Ancillary ancillaryDefinitionRef="ancillary_69" ancillaryId="ancillary_ancillary_86">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>277630</SequenceNumber>
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
  </ns37:Ancillary>
  <ns37:Ancillary ancillaryDefinitionRef="ancillary_69" ancillaryId="ancillary_ancillary_87">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>316130</SequenceNumber>
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
  </ns37:Ancillary>
  <ns37:Ancillary ancillaryDefinitionRef="ancillary_69" ancillaryId="ancillary_ancillary_88">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>528130</SequenceNumber>
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
  </ns37:Ancillary>
  <ns37:Ancillary ancillaryDefinitionRef="ancillary_69" ancillaryId="ancillary_ancillary_89">
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
  </ns37:Ancillary>
  <ns37:Ancillary ancillaryDefinitionRef="ancillary_69" ancillaryId="ancillary_ancillary_90">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>572130</SequenceNumber>
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
          <Code>W</Code>
          <TranslatedName>WINDOW</TranslatedName>
          <AbbreviatedName>WIND</AbbreviatedName>
        </Characteristic>
      </PADIS_CodeTableInfo>
    </PADIS_SeatProcessing>
    <Footnote>@</Footnote>
  </ns37:Ancillary>
  <ns37:Ancillary ancillaryDefinitionRef="ancillary_69" ancillaryId="ancillary_ancillary_91">
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
  </ns37:Ancillary>
  <ns37:Ancillary ancillaryDefinitionRef="ancillary_69" ancillaryId="ancillary_ancillary_92">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>574130</SequenceNumber>
    <TravelDateEffective>1980-01-01</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>PAYMENT_REQUIRED</AirExtraStatus>
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
  </ns37:Ancillary>
  <ns37:Ancillary ancillaryDefinitionRef="ancillary_69" ancillaryId="ancillary_ancillary_93">
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
  </ns37:Ancillary>
  <ns37:Ancillary ancillaryDefinitionRef="ancillary_69" ancillaryId="ancillary_ancillary_94">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>576130</SequenceNumber>
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
      </PADIS_CodeTableInfo>
    </PADIS_SeatProcessing>
    <Footnote>@</Footnote>
  </ns37:Ancillary>
  <ns37:Ancillary ancillaryDefinitionRef="ancillary_69" ancillaryId="ancillary_ancillary_95">
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
  </ns37:Ancillary>
  <ns37:Ancillary ancillaryDefinitionRef="ancillary_69" ancillaryId="ancillary_ancillary_96">
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
  </ns37:Ancillary>
  <ns37:Ancillary ancillaryDefinitionRef="ancillary_69" ancillaryId="ancillary_ancillary_97">
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
  </ns37:Ancillary>
  <ns37:Ancillary ancillaryDefinitionRef="ancillary_69" ancillaryId="ancillary_ancillary_98">
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
  </ns37:Ancillary>
  <ns37:Ancillary ancillaryDefinitionRef="ancillary_69" ancillaryId="ancillary_ancillary_99">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>692630</SequenceNumber>
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
  </ns37:Ancillary>
  <ns37:Ancillary ancillaryDefinitionRef="ancillary_69" ancillaryId="ancillary_ancillary_100">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>693130</SequenceNumber>
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
          <Code>W</Code>
          <TranslatedName>WINDOW</TranslatedName>
          <AbbreviatedName>WIND</AbbreviatedName>
        </Characteristic>
      </PADIS_CodeTableInfo>
    </PADIS_SeatProcessing>
    <Footnote>@</Footnote>
  </ns37:Ancillary>
  <ns37:Ancillary ancillaryDefinitionRef="ancillary_69" ancillaryId="ancillary_ancillary_101">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>693630</SequenceNumber>
    <TravelDateEffective>1980-01-01</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>PAYMENT_REQUIRED</AirExtraStatus>
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
  </ns37:Ancillary>
  <ns37:Ancillary ancillaryDefinitionRef="ancillary_69" ancillaryId="ancillary_ancillary_102">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>694130</SequenceNumber>
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
      </PADIS_CodeTableInfo>
    </PADIS_SeatProcessing>
    <Footnote>@</Footnote>
  </ns37:Ancillary>
  <ns37:Ancillary ancillaryDefinitionRef="ancillary_137" ancillaryId="ancillary_ancillary_137">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>4000</SequenceNumber>
    <TravelDateEffective>2014-02-25</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>PAYMENT_REQUIRED</AirExtraStatus>
    <Footnote>N</Footnote>
  </ns37:Ancillary>
  <ns37:Ancillary ancillaryDefinitionRef="ancillary_138" ancillaryId="ancillary_ancillary_138">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>4000</SequenceNumber>
    <TravelDateEffective>2014-02-25</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>PAYMENT_REQUIRED</AirExtraStatus>
    <Footnote>X</Footnote>
  </ns37:Ancillary>
  <ns37:Ancillary ancillaryDefinitionRef="ancillary_137" ancillaryId="ancillary_ancillary_139">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>3000</SequenceNumber>
    <TravelDateEffective>2014-02-27</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>PAYMENT_REQUIRED</AirExtraStatus>
    <Footnote>N</Footnote>
  </ns37:Ancillary>
  <ns37:Ancillary ancillaryDefinitionRef="ancillary_138" ancillaryId="ancillary_ancillary_140">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>P</SectorPortionInd>
    <SequenceNumber>3000</SequenceNumber>
    <TravelDateEffective>2014-02-27</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>PAYMENT_REQUIRED</AirExtraStatus>
    <Footnote>N</Footnote>
  </ns37:Ancillary>
  <ns37:Ancillary ancillaryDefinitionRef="ancillary_145" ancillaryId="ancillary_ancillary_145">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>P</SectorPortionInd>
    <SequenceNumber>37562</SequenceNumber>
    <TravelDateEffective>1980-01-01</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>PAYMENT_REQUIRED</AirExtraStatus>
    <Footnote>N</Footnote>
  </ns37:Ancillary>
  <ns37:Ancillary ancillaryDefinitionRef="ancillary_146" ancillaryId="ancillary_ancillary_146">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>P</SectorPortionInd>
    <SequenceNumber>5000</SequenceNumber>
    <TravelDateEffective>2014-02-27</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>PAYMENT_REQUIRED</AirExtraStatus>
    <Footnote>N</Footnote>
  </ns37:Ancillary>
  <ns37:Ancillary ancillaryDefinitionRef="ancillary_150" ancillaryId="ancillary_ancillary_150">
    <ServiceType>C</ServiceType>
    <SectorPortionInd>P</SectorPortionInd>
    <BaggageData>
      <FirstOccurrence>-1</FirstOccurrence>
      <LastOccurrence>-1</LastOccurrence>
      <Weight unit="KILO">15</Weight>
    </BaggageData>
    <SequenceNumber>37691</SequenceNumber>
    <TravelDateEffective>2021-11-11</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>PAYMENT_REQUIRED</AirExtraStatus>
    <Footnote>N</Footnote>
  </ns37:Ancillary>
  <ns37:Ancillary ancillaryDefinitionRef="ancillary_154" ancillaryId="ancillary_ancillary_154">
    <ServiceType>C</ServiceType>
    <SectorPortionInd>P</SectorPortionInd>
    <BaggageData>
      <FirstOccurrence>-1</FirstOccurrence>
      <LastOccurrence>-1</LastOccurrence>
      <Weight unit="KILO">20</Weight>
    </BaggageData>
    <SequenceNumber>33411</SequenceNumber>
    <TravelDateEffective>1980-01-01</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>PAYMENT_REQUIRED</AirExtraStatus>
    <Footnote>N</Footnote>
  </ns37:Ancillary>
  <ns37:Ancillary ancillaryDefinitionRef="ancillary_156" ancillaryId="ancillary_ancillary_156">
    <ServiceType>C</ServiceType>
    <SectorPortionInd>P</SectorPortionInd>
    <BaggageData>
      <FirstOccurrence>-1</FirstOccurrence>
      <LastOccurrence>-1</LastOccurrence>
      <Weight unit="KILO">25</Weight>
    </BaggageData>
    <SequenceNumber>37941</SequenceNumber>
    <TravelDateEffective>2021-11-11</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>PAYMENT_REQUIRED</AirExtraStatus>
    <Footnote>N</Footnote>
  </ns37:Ancillary>
  <ns37:Ancillary ancillaryDefinitionRef="ancillary_160" ancillaryId="ancillary_ancillary_160">
    <ServiceType>C</ServiceType>
    <SectorPortionInd>P</SectorPortionInd>
    <BaggageData>
      <FirstOccurrence>-1</FirstOccurrence>
      <LastOccurrence>-1</LastOccurrence>
      <Weight unit="KILO">30</Weight>
    </BaggageData>
    <SequenceNumber>37941</SequenceNumber>
    <TravelDateEffective>2021-11-11</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>PAYMENT_REQUIRED</AirExtraStatus>
    <Footnote>N</Footnote>
  </ns37:Ancillary>
  <ns37:Ancillary ancillaryDefinitionRef="ancillary_164" ancillaryId="ancillary_ancillary_164">
    <ServiceType>C</ServiceType>
    <SectorPortionInd>P</SectorPortionInd>
    <BaggageData>
      <FirstOccurrence>-1</FirstOccurrence>
      <LastOccurrence>-1</LastOccurrence>
      <Weight unit="KILO">35</Weight>
    </BaggageData>
    <SequenceNumber>26833</SequenceNumber>
    <TravelDateEffective>2021-11-11</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>PAYMENT_REQUIRED</AirExtraStatus>
    <Footnote>N</Footnote>
  </ns37:Ancillary>
  <ns37:Ancillary ancillaryDefinitionRef="ancillary_168" ancillaryId="ancillary_ancillary_168">
    <ServiceType>C</ServiceType>
    <SectorPortionInd>P</SectorPortionInd>
    <BaggageData>
      <FirstOccurrence>-1</FirstOccurrence>
      <LastOccurrence>-1</LastOccurrence>
      <Weight unit="KILO">5</Weight>
    </BaggageData>
    <SequenceNumber>108318</SequenceNumber>
    <TravelDateEffective>1980-01-01</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>PAYMENT_REQUIRED</AirExtraStatus>
    <Footnote>N</Footnote>
  </ns37:Ancillary>
  <ns37:Ancillary ancillaryDefinitionRef="ancillary_170" ancillaryId="ancillary_ancillary_170">
    <ServiceType>C</ServiceType>
    <SectorPortionInd>P</SectorPortionInd>
    <BaggageData>
      <FirstOccurrence>-1</FirstOccurrence>
      <LastOccurrence>-1</LastOccurrence>
      <Weight unit="KILO">10</Weight>
    </BaggageData>
    <SequenceNumber>33411</SequenceNumber>
    <TravelDateEffective>1980-01-01</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>PAYMENT_REQUIRED</AirExtraStatus>
    <Footnote>N</Footnote>
  </ns37:Ancillary>
  <ns37:Ancillary ancillaryDefinitionRef="ancillary_545" ancillaryId="ancillary_ancillary_545">
    <ServiceType>F</ServiceType>
    <SectorPortionInd>S</SectorPortionInd>
    <SequenceNumber>1000</SequenceNumber>
    <TravelDateEffective>2013-08-01</TravelDateEffective>
    <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
    <AirExtraStatus>PAYMENT_REQUIRED</AirExtraStatus>
    <Footnote>X</Footnote>
  </ns37:Ancillary>
  <ns37:Offers ancillaryRef="ancillary_ancillary_1" offerId="offer_ancillary_1">
    <ns12:OfferItemId>offerItem_1</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>AUH</ns12:Origin>
    <ns12:Destination>LHR</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">2560</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">40.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">2560</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">2560</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">40.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">2560</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">2560</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">2560</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">2560</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">2560</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <FormOfRefund code="1">ORIGINAL</FormOfRefund>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_2"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_2" offerId="offer_ancillary_2">
    <ns12:OfferItemId>offerItem_2</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>AUH</ns12:Origin>
    <ns12:Destination>LHR</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">2880</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">45.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">2880</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">2880</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">45.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">2880</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">2880</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">2880</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">2880</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">2880</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <FormOfRefund code="1">ORIGINAL</FormOfRefund>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_2"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_1" offerId="offer_ancillary_3">
    <ns12:OfferItemId>offerItem_3</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>LHR</ns12:Origin>
    <ns12:Destination>AUH</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">2560</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">40.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">2560</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">2560</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">40.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">2560</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">2560</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">2560</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">2560</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">2560</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <FormOfRefund code="1">ORIGINAL</FormOfRefund>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_3"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_2" offerId="offer_ancillary_4">
    <ns12:OfferItemId>offerItem_4</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>LHR</ns12:Origin>
    <ns12:Destination>AUH</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">2880</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">45.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">2880</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">2880</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">45.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">2880</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">2880</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">2880</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">2880</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">2880</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <FormOfRefund code="1">ORIGINAL</FormOfRefund>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_3"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_5" offerId="offer_ancillary_5">
    <ns12:OfferItemId>offerItem_5</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>SYD</ns12:Origin>
    <ns12:Destination>AUH</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">104177</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="AED">6000</ns2:Amount>
        <ns2:EquivAmount currency="RUB">104177</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">104177</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="AED">6000</ns2:Amount>
        <ns2:EquivAmount currency="RUB">104177</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">104177</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">104177</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">104177</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">104177</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>Y</RefundableReissuable>
      <FormOfRefund code="1">ORIGINAL</FormOfRefund>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_1"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_6" offerId="offer_ancillary_6">
    <ns12:OfferItemId>offerItem_6</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>SYD</ns12:Origin>
    <ns12:Destination>AUH</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">104177</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="AED">6000</ns2:Amount>
        <ns2:EquivAmount currency="RUB">104177</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">104177</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="AED">6000</ns2:Amount>
        <ns2:EquivAmount currency="RUB">104177</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">104177</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">104177</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">104177</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">104177</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_1"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_7" offerId="offer_ancillary_7">
    <ns12:OfferItemId>offerItem_7</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>AUH</ns12:Origin>
    <ns12:Destination>LHR</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">86814</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="AED">5000</ns2:Amount>
        <ns2:EquivAmount currency="RUB">86814</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">86814</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="AED">5000</ns2:Amount>
        <ns2:EquivAmount currency="RUB">86814</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">86814</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">86814</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">86814</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">86814</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>Y</RefundableReissuable>
      <FormOfRefund code="1">ORIGINAL</FormOfRefund>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_2"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_6" offerId="offer_ancillary_8">
    <ns12:OfferItemId>offerItem_8</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>AUH</ns12:Origin>
    <ns12:Destination>LHR</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">104177</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="AED">6000</ns2:Amount>
        <ns2:EquivAmount currency="RUB">104177</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">104177</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="AED">6000</ns2:Amount>
        <ns2:EquivAmount currency="RUB">104177</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">104177</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">104177</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">104177</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">104177</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_2"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_7" offerId="offer_ancillary_9">
    <ns12:OfferItemId>offerItem_9</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>LHR</ns12:Origin>
    <ns12:Destination>AUH</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">86814</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="AED">5000</ns2:Amount>
        <ns2:EquivAmount currency="RUB">86814</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">86814</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="AED">5000</ns2:Amount>
        <ns2:EquivAmount currency="RUB">86814</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">86814</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">86814</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">86814</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">86814</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>Y</RefundableReissuable>
      <FormOfRefund code="1">ORIGINAL</FormOfRefund>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_3"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_6" offerId="offer_ancillary_10">
    <ns12:OfferItemId>offerItem_10</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>LHR</ns12:Origin>
    <ns12:Destination>AUH</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">104177</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="AED">6000</ns2:Amount>
        <ns2:EquivAmount currency="RUB">104177</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">104177</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="AED">6000</ns2:Amount>
        <ns2:EquivAmount currency="RUB">104177</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">104177</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">104177</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">104177</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">104177</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_3"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_5" offerId="offer_ancillary_11">
    <ns12:OfferItemId>offerItem_11</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>AUH</ns12:Origin>
    <ns12:Destination>SYD</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">104177</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="AED">6000</ns2:Amount>
        <ns2:EquivAmount currency="RUB">104177</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">104177</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="AED">6000</ns2:Amount>
        <ns2:EquivAmount currency="RUB">104177</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">104177</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">104177</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">104177</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">104177</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>Y</RefundableReissuable>
      <FormOfRefund code="1">ORIGINAL</FormOfRefund>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_4"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_6" offerId="offer_ancillary_12">
    <ns12:OfferItemId>offerItem_12</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>AUH</ns12:Origin>
    <ns12:Destination>SYD</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">104177</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="AED">6000</ns2:Amount>
        <ns2:EquivAmount currency="RUB">104177</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">104177</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="AED">6000</ns2:Amount>
        <ns2:EquivAmount currency="RUB">104177</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">104177</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">104177</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">104177</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">104177</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_4"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_13" offerId="offer_ancillary_13">
    <ns12:OfferItemId>offerItem_13</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>SYD</ns12:Origin>
    <ns12:Destination>AUH</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">67200</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">1050.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">67200</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">67200</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">1050.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">67200</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">67200</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">67200</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">67200</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">67200</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>Y</RefundableReissuable>
      <FormOfRefund code="1">ORIGINAL</FormOfRefund>
      <Commissionable>false</Commissionable>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_1"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_14" offerId="offer_ancillary_14">
    <ns12:OfferItemId>offerItem_14</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>SYD</ns12:Origin>
    <ns12:Destination>AUH</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">42240</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">660.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">42240</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">42240</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">660.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">42240</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">42240</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">42240</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">42240</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">42240</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>Y</RefundableReissuable>
      <FormOfRefund code="1">ORIGINAL</FormOfRefund>
      <Commissionable>false</Commissionable>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_1"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_15" offerId="offer_ancillary_15">
    <ns12:OfferItemId>offerItem_15</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>SYD</ns12:Origin>
    <ns12:Destination>AUH</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">63360</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">990.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">63360</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">63360</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">990.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">63360</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">63360</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">63360</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">63360</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">63360</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>Y</RefundableReissuable>
      <FormOfRefund code="1">ORIGINAL</FormOfRefund>
      <Commissionable>false</Commissionable>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_1"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_16" offerId="offer_ancillary_16">
    <ns12:OfferItemId>offerItem_16</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>SYD</ns12:Origin>
    <ns12:Destination>AUH</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">11200</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">175.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">11200</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">11200</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">175.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">11200</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">11200</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">11200</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">11200</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">11200</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>N</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_1"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_17" offerId="offer_ancillary_17">
    <ns12:OfferItemId>offerItem_17</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>SYD</ns12:Origin>
    <ns12:Destination>AUH</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">44800</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">700.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">44800</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">44800</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">700.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">44800</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">44800</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">44800</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">44800</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">44800</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>N</RefundableReissuable>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_1"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_18" offerId="offer_ancillary_18">
    <ns12:OfferItemId>offerItem_18</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>SYD</ns12:Origin>
    <ns12:Destination>AUH</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">25600</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">400.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">25600</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">25600</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">400.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">25600</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">25600</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">25600</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">25600</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">25600</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>N</RefundableReissuable>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_1"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_19" offerId="offer_ancillary_19">
    <ns12:OfferItemId>offerItem_19</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>SYD</ns12:Origin>
    <ns12:Destination>AUH</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>Y</RefundableReissuable>
      <FormOfRefund code="1">ORIGINAL</FormOfRefund>
      <Commissionable>false</Commissionable>
      <FreeOfChargeRules>EMD_REQUIRED</FreeOfChargeRules>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_1"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_20" offerId="offer_ancillary_20">
    <ns12:OfferItemId>offerItem_20</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>SYD</ns12:Origin>
    <ns12:Destination>AUH</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>N</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <FreeOfChargeRules>EMD_REQUIRED</FreeOfChargeRules>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_1"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_21" offerId="offer_ancillary_21">
    <ns12:OfferItemId>offerItem_21</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>SYD</ns12:Origin>
    <ns12:Destination>AUH</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">52480</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">820.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">52480</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">52480</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">820.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">52480</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">52480</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">52480</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">52480</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">52480</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>N</RefundableReissuable>
      <FeeApplicationMethod code="3">ITEM</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_1"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_22" offerId="offer_ancillary_22">
    <ns12:OfferItemId>offerItem_22</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>SYD</ns12:Origin>
    <ns12:Destination>AUH</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">54400</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">850.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">54400</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">54400</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">850.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">54400</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">54400</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">54400</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">54400</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">54400</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>N</RefundableReissuable>
      <FeeApplicationMethod code="3">ITEM</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_1"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_23" offerId="offer_ancillary_23">
    <ns12:OfferItemId>offerItem_23</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>SYD</ns12:Origin>
    <ns12:Destination>AUH</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>N</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_1"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_13" offerId="offer_ancillary_24">
    <ns12:OfferItemId>offerItem_24</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>AUH</ns12:Origin>
    <ns12:Destination>LHR</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">67200</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">1050.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">67200</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">67200</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">1050.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">67200</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">67200</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">67200</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">67200</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">67200</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>Y</RefundableReissuable>
      <FormOfRefund code="1">ORIGINAL</FormOfRefund>
      <Commissionable>false</Commissionable>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_2"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_25" offerId="offer_ancillary_25">
    <ns12:OfferItemId>offerItem_25</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>AUH</ns12:Origin>
    <ns12:Destination>LHR</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">33600</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">525.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">33600</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">33600</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">525.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">33600</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">33600</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">33600</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">33600</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">33600</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>Y</RefundableReissuable>
      <FormOfRefund code="1">ORIGINAL</FormOfRefund>
      <Commissionable>false</Commissionable>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_2"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_26" offerId="offer_ancillary_26">
    <ns12:OfferItemId>offerItem_26</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>AUH</ns12:Origin>
    <ns12:Destination>LHR</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">50432</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">788.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">50432</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">50432</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">788.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">50432</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">50432</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">50432</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">50432</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">50432</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>Y</RefundableReissuable>
      <FormOfRefund code="1">ORIGINAL</FormOfRefund>
      <Commissionable>false</Commissionable>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_2"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_27" offerId="offer_ancillary_27">
    <ns12:OfferItemId>offerItem_27</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>AUH</ns12:Origin>
    <ns12:Destination>LHR</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">16000</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">250.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">16000</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">16000</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">250.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">16000</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">16000</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">16000</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">16000</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">16000</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>N</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_2"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_28" offerId="offer_ancillary_28">
    <ns12:OfferItemId>offerItem_28</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>AUH</ns12:Origin>
    <ns12:Destination>LHR</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">44160</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">690.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">44160</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">44160</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">690.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">44160</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">44160</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">44160</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">44160</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">44160</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>N</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_2"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_29" offerId="offer_ancillary_29">
    <ns12:OfferItemId>offerItem_29</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>AUH</ns12:Origin>
    <ns12:Destination>LHR</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">63360</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">990.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">63360</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">63360</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">990.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">63360</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">63360</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">63360</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">63360</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">63360</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>N</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_2"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_19" offerId="offer_ancillary_30">
    <ns12:OfferItemId>offerItem_30</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>AUH</ns12:Origin>
    <ns12:Destination>LHR</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>Y</RefundableReissuable>
      <FormOfRefund code="1">ORIGINAL</FormOfRefund>
      <Commissionable>false</Commissionable>
      <FreeOfChargeRules>EMD_REQUIRED</FreeOfChargeRules>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_2"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_20" offerId="offer_ancillary_31">
    <ns12:OfferItemId>offerItem_31</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>AUH</ns12:Origin>
    <ns12:Destination>LHR</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>N</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <FreeOfChargeRules>EMD_REQUIRED</FreeOfChargeRules>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_2"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_32" offerId="offer_ancillary_32">
    <ns12:OfferItemId>offerItem_32</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>AUH</ns12:Origin>
    <ns12:Destination>LHR</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">45440</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">710.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">45440</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">45440</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">710.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">45440</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">45440</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">45440</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">45440</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">45440</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>N</RefundableReissuable>
      <FeeApplicationMethod code="3">ITEM</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_2"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_33" offerId="offer_ancillary_33">
    <ns12:OfferItemId>offerItem_33</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>AUH</ns12:Origin>
    <ns12:Destination>LHR</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">48000</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">750.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">48000</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">48000</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">750.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">48000</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">48000</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">48000</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">48000</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">48000</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>N</RefundableReissuable>
      <FeeApplicationMethod code="3">ITEM</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_2"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_23" offerId="offer_ancillary_34">
    <ns12:OfferItemId>offerItem_34</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>AUH</ns12:Origin>
    <ns12:Destination>LHR</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>N</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_2"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_13" offerId="offer_ancillary_35">
    <ns12:OfferItemId>offerItem_35</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>LHR</ns12:Origin>
    <ns12:Destination>AUH</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">67200</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">1050.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">67200</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">67200</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">1050.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">67200</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">67200</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">67200</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">67200</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">67200</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>Y</RefundableReissuable>
      <FormOfRefund code="1">ORIGINAL</FormOfRefund>
      <Commissionable>false</Commissionable>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_3"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_25" offerId="offer_ancillary_36">
    <ns12:OfferItemId>offerItem_36</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>LHR</ns12:Origin>
    <ns12:Destination>AUH</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">33600</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">525.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">33600</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">33600</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">525.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">33600</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">33600</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">33600</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">33600</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">33600</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>Y</RefundableReissuable>
      <FormOfRefund code="1">ORIGINAL</FormOfRefund>
      <Commissionable>false</Commissionable>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_3"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_26" offerId="offer_ancillary_37">
    <ns12:OfferItemId>offerItem_37</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>LHR</ns12:Origin>
    <ns12:Destination>AUH</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">50432</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">788.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">50432</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">50432</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">788.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">50432</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">50432</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">50432</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">50432</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">50432</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>Y</RefundableReissuable>
      <FormOfRefund code="1">ORIGINAL</FormOfRefund>
      <Commissionable>false</Commissionable>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_3"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_38" offerId="offer_ancillary_38">
    <ns12:OfferItemId>offerItem_38</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>LHR</ns12:Origin>
    <ns12:Destination>AUH</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">44800</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">700.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">44800</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">44800</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">700.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">44800</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">44800</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">44800</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">44800</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">44800</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>N</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <FeeApplicationMethod code="3">ITEM</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_3"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_39" offerId="offer_ancillary_39">
    <ns12:OfferItemId>offerItem_39</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>LHR</ns12:Origin>
    <ns12:Destination>AUH</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">63360</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">990.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">63360</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">63360</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">990.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">63360</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">63360</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">63360</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">63360</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">63360</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>N</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_3"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_19" offerId="offer_ancillary_40">
    <ns12:OfferItemId>offerItem_40</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>LHR</ns12:Origin>
    <ns12:Destination>AUH</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>Y</RefundableReissuable>
      <FormOfRefund code="1">ORIGINAL</FormOfRefund>
      <Commissionable>false</Commissionable>
      <FreeOfChargeRules>EMD_REQUIRED</FreeOfChargeRules>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_3"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_20" offerId="offer_ancillary_41">
    <ns12:OfferItemId>offerItem_41</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>LHR</ns12:Origin>
    <ns12:Destination>AUH</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>N</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <FreeOfChargeRules>EMD_REQUIRED</FreeOfChargeRules>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_3"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_32" offerId="offer_ancillary_42">
    <ns12:OfferItemId>offerItem_42</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>LHR</ns12:Origin>
    <ns12:Destination>AUH</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">45440</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">710.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">45440</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">45440</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">710.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">45440</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">45440</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">45440</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">45440</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">45440</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>N</RefundableReissuable>
      <FeeApplicationMethod code="3">ITEM</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_3"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_33" offerId="offer_ancillary_43">
    <ns12:OfferItemId>offerItem_43</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>LHR</ns12:Origin>
    <ns12:Destination>AUH</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">48000</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">750.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">48000</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">48000</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">750.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">48000</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">48000</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">48000</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">48000</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">48000</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>N</RefundableReissuable>
      <FeeApplicationMethod code="3">ITEM</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_3"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_23" offerId="offer_ancillary_44">
    <ns12:OfferItemId>offerItem_44</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>LHR</ns12:Origin>
    <ns12:Destination>AUH</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>N</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_3"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_13" offerId="offer_ancillary_45">
    <ns12:OfferItemId>offerItem_45</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>AUH</ns12:Origin>
    <ns12:Destination>SYD</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">67200</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">1050.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">67200</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">67200</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">1050.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">67200</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">67200</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">67200</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">67200</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">67200</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>Y</RefundableReissuable>
      <FormOfRefund code="1">ORIGINAL</FormOfRefund>
      <Commissionable>false</Commissionable>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_4"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_14" offerId="offer_ancillary_46">
    <ns12:OfferItemId>offerItem_46</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>AUH</ns12:Origin>
    <ns12:Destination>SYD</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">42240</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">660.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">42240</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">42240</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">660.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">42240</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">42240</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">42240</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">42240</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">42240</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>Y</RefundableReissuable>
      <FormOfRefund code="1">ORIGINAL</FormOfRefund>
      <Commissionable>false</Commissionable>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_4"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_15" offerId="offer_ancillary_47">
    <ns12:OfferItemId>offerItem_47</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>AUH</ns12:Origin>
    <ns12:Destination>SYD</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">63360</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">990.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">63360</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">63360</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">990.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">63360</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">63360</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">63360</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">63360</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">63360</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>Y</RefundableReissuable>
      <FormOfRefund code="1">ORIGINAL</FormOfRefund>
      <Commissionable>false</Commissionable>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_4"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_16" offerId="offer_ancillary_48">
    <ns12:OfferItemId>offerItem_48</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>AUH</ns12:Origin>
    <ns12:Destination>SYD</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">11200</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">175.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">11200</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">11200</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">175.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">11200</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">11200</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">11200</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">11200</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">11200</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>N</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_4"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_49" offerId="offer_ancillary_49">
    <ns12:OfferItemId>offerItem_49</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>AUH</ns12:Origin>
    <ns12:Destination>SYD</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">28800</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">450.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">28800</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">28800</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">450.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">28800</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">28800</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">28800</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">28800</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">28800</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>N</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_4"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_50" offerId="offer_ancillary_50">
    <ns12:OfferItemId>offerItem_50</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>AUH</ns12:Origin>
    <ns12:Destination>SYD</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">44800</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">700.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">44800</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">44800</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">700.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">44800</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">44800</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">44800</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">44800</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">44800</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>N</RefundableReissuable>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_4"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_51" offerId="offer_ancillary_51">
    <ns12:OfferItemId>offerItem_51</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>AUH</ns12:Origin>
    <ns12:Destination>SYD</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">28800</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">450.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">28800</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">28800</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">450.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">28800</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">28800</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">28800</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">28800</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">28800</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>N</RefundableReissuable>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_4"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_19" offerId="offer_ancillary_52">
    <ns12:OfferItemId>offerItem_52</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>AUH</ns12:Origin>
    <ns12:Destination>SYD</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>Y</RefundableReissuable>
      <FormOfRefund code="1">ORIGINAL</FormOfRefund>
      <Commissionable>false</Commissionable>
      <FreeOfChargeRules>EMD_REQUIRED</FreeOfChargeRules>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_4"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_20" offerId="offer_ancillary_53">
    <ns12:OfferItemId>offerItem_53</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>AUH</ns12:Origin>
    <ns12:Destination>SYD</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>N</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <FreeOfChargeRules>EMD_REQUIRED</FreeOfChargeRules>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_4"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_21" offerId="offer_ancillary_54">
    <ns12:OfferItemId>offerItem_54</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>AUH</ns12:Origin>
    <ns12:Destination>SYD</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">52480</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">820.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">52480</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">52480</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">820.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">52480</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">52480</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">52480</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">52480</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">52480</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>N</RefundableReissuable>
      <FeeApplicationMethod code="3">ITEM</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_4"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_22" offerId="offer_ancillary_55">
    <ns12:OfferItemId>offerItem_55</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>AUH</ns12:Origin>
    <ns12:Destination>SYD</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">54400</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">850.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">54400</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">54400</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">850.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">54400</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">54400</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">54400</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">54400</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">54400</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>N</RefundableReissuable>
      <FeeApplicationMethod code="3">ITEM</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_4"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_23" offerId="offer_ancillary_56">
    <ns12:OfferItemId>offerItem_56</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>AUH</ns12:Origin>
    <ns12:Destination>SYD</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>N</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_4"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_57" offerId="offer_ancillary_57">
    <ns12:OfferItemId>offerItem_57</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>SYD</ns12:Origin>
    <ns12:Destination>AUH</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">827168</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="EUR">12345.78</ns2:Amount>
        <ns2:EquivAmount currency="RUB">827168</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">827168</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="EUR">12345.78</ns2:Amount>
        <ns2:EquivAmount currency="RUB">827168</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">827168</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">827168</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">827168</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">827168</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>Y</RefundableReissuable>
      <FormOfRefund code="1">ORIGINAL</FormOfRefund>
      <Commissionable>false</Commissionable>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_1"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_57" offerId="offer_ancillary_58">
    <ns12:OfferItemId>offerItem_58</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>AUH</ns12:Origin>
    <ns12:Destination>LHR</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">827168</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="EUR">12345.78</ns2:Amount>
        <ns2:EquivAmount currency="RUB">827168</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">827168</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="EUR">12345.78</ns2:Amount>
        <ns2:EquivAmount currency="RUB">827168</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">827168</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">827168</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">827168</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">827168</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>Y</RefundableReissuable>
      <FormOfRefund code="1">ORIGINAL</FormOfRefund>
      <Commissionable>false</Commissionable>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_2"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_57" offerId="offer_ancillary_59">
    <ns12:OfferItemId>offerItem_59</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>LHR</ns12:Origin>
    <ns12:Destination>AUH</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">827168</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="EUR">12345.78</ns2:Amount>
        <ns2:EquivAmount currency="RUB">827168</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">827168</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="EUR">12345.78</ns2:Amount>
        <ns2:EquivAmount currency="RUB">827168</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">827168</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">827168</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">827168</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">827168</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>Y</RefundableReissuable>
      <FormOfRefund code="1">ORIGINAL</FormOfRefund>
      <Commissionable>false</Commissionable>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_3"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_57" offerId="offer_ancillary_60">
    <ns12:OfferItemId>offerItem_60</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>AUH</ns12:Origin>
    <ns12:Destination>SYD</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">827168</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="EUR">12345.78</ns2:Amount>
        <ns2:EquivAmount currency="RUB">827168</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">827168</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="EUR">12345.78</ns2:Amount>
        <ns2:EquivAmount currency="RUB">827168</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">827168</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">827168</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">827168</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">827168</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>Y</RefundableReissuable>
      <FormOfRefund code="1">ORIGINAL</FormOfRefund>
      <Commissionable>false</Commissionable>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_4"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_61" offerId="offer_ancillary_61">
    <ns12:OfferItemId>offerItem_61</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>SYD</ns12:Origin>
    <ns12:Destination>AUH</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">576</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">9.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">576</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">576</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">9.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">576</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">576</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">576</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">576</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">576</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>Y</RefundableReissuable>
      <FormOfRefund code="1">ORIGINAL</FormOfRefund>
      <Commissionable>false</Commissionable>
      <FeeApplicationMethod code="3">ITEM</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_1"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_62" offerId="offer_ancillary_62">
    <ns12:OfferItemId>offerItem_62</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>AUH</ns12:Origin>
    <ns12:Destination>LHR</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">1024</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">16.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">1024</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">1024</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">16.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">1024</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">1024</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">1024</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">1024</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">1024</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>Y</RefundableReissuable>
      <FormOfRefund code="1">ORIGINAL</FormOfRefund>
      <Commissionable>false</Commissionable>
      <FeeApplicationMethod code="1">ONE_WAY</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_2"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_61" offerId="offer_ancillary_63">
    <ns12:OfferItemId>offerItem_63</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>AUH</ns12:Origin>
    <ns12:Destination>LHR</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">576</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">9.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">576</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">576</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">9.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">576</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">576</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">576</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">576</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">576</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>Y</RefundableReissuable>
      <FormOfRefund code="1">ORIGINAL</FormOfRefund>
      <Commissionable>false</Commissionable>
      <FeeApplicationMethod code="3">ITEM</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_2"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_62" offerId="offer_ancillary_64">
    <ns12:OfferItemId>offerItem_64</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>LHR</ns12:Origin>
    <ns12:Destination>AUH</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">1024</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">16.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">1024</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">1024</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">16.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">1024</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">1024</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">1024</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">1024</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">1024</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>Y</RefundableReissuable>
      <FormOfRefund code="1">ORIGINAL</FormOfRefund>
      <Commissionable>false</Commissionable>
      <FeeApplicationMethod code="1">ONE_WAY</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_3"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_61" offerId="offer_ancillary_65">
    <ns12:OfferItemId>offerItem_65</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>LHR</ns12:Origin>
    <ns12:Destination>AUH</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">576</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">9.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">576</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">576</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">9.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">576</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">576</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">576</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">576</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">576</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>Y</RefundableReissuable>
      <FormOfRefund code="1">ORIGINAL</FormOfRefund>
      <Commissionable>false</Commissionable>
      <FeeApplicationMethod code="3">ITEM</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_3"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_61" offerId="offer_ancillary_66">
    <ns12:OfferItemId>offerItem_66</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>AUH</ns12:Origin>
    <ns12:Destination>SYD</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">576</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">9.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">576</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">576</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">9.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">576</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">576</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">576</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">576</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">576</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>Y</RefundableReissuable>
      <FormOfRefund code="1">ORIGINAL</FormOfRefund>
      <Commissionable>false</Commissionable>
      <FeeApplicationMethod code="3">ITEM</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_4"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_67" offerId="offer_ancillary_67">
    <ns12:OfferItemId>offerItem_67</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>SYD</ns12:Origin>
    <ns12:Destination>LHR</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">25600</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">400.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">25600</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">25600</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">400.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">25600</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">25600</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">25600</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">25600</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">25600</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>N</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FeeApplicationMethod code="4">PER_BAGGAGE_TRAVEL</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_1"/>
    <ns12:Segment segmentId="seg_2"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_67" offerId="offer_ancillary_68">
    <ns12:OfferItemId>offerItem_68</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>LHR</ns12:Origin>
    <ns12:Destination>SYD</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">25600</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">400.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">25600</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">25600</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">400.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">25600</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">25600</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">25600</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">25600</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">25600</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>N</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FeeApplicationMethod code="4">PER_BAGGAGE_TRAVEL</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_3"/>
    <ns12:Segment segmentId="seg_4"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_69" offerId="offer_ancillary_69">
    <ns12:OfferItemId>offerItem_69</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>SYD</ns12:Origin>
    <ns12:Destination>AUH</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">8960</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">140.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">8960</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">8960</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">140.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">8960</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">8960</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">8960</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">8960</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">8960</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_1"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_70" offerId="offer_ancillary_70">
    <ns12:OfferItemId>offerItem_70</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>SYD</ns12:Origin>
    <ns12:Destination>AUH</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">8960</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">140.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">8960</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">8960</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">140.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">8960</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">8960</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">8960</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">8960</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">8960</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_1"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_71" offerId="offer_ancillary_71">
    <ns12:OfferItemId>offerItem_71</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>SYD</ns12:Origin>
    <ns12:Destination>AUH</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">2880</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">45.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">2880</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">2880</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">45.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">2880</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">2880</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">2880</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">2880</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">2880</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_1"/>
    <ns12:PurchaseByDate>2022-11-30</ns12:PurchaseByDate>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_72" offerId="offer_ancillary_72">
    <ns12:OfferItemId>offerItem_72</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>SYD</ns12:Origin>
    <ns12:Destination>AUH</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FreeOfChargeRules>BOOKING_REQUIRED</FreeOfChargeRules>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_1"/>
    <ns12:PurchaseByDate>2022-11-30</ns12:PurchaseByDate>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_73" offerId="offer_ancillary_73">
    <ns12:OfferItemId>offerItem_73</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>SYD</ns12:Origin>
    <ns12:Destination>AUH</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FreeOfChargeRules>BOOKING_REQUIRED</FreeOfChargeRules>
      <FreeOfChargeRules>EMD_REQUIRED</FreeOfChargeRules>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_1"/>
    <ns12:PurchaseByDate>2022-11-30</ns12:PurchaseByDate>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_74" offerId="offer_ancillary_74">
    <ns12:OfferItemId>offerItem_74</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>SYD</ns12:Origin>
    <ns12:Destination>AUH</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FreeOfChargeRules>BOOKING_REQUIRED</FreeOfChargeRules>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_1"/>
    <ns12:PurchaseByDate>2022-11-30</ns12:PurchaseByDate>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_75" offerId="offer_ancillary_75">
    <ns12:OfferItemId>offerItem_75</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>SYD</ns12:Origin>
    <ns12:Destination>AUH</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FreeOfChargeRules>BOOKING_REQUIRED</FreeOfChargeRules>
      <FreeOfChargeRules>EMD_REQUIRED</FreeOfChargeRules>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_1"/>
    <ns12:PurchaseByDate>2022-11-30</ns12:PurchaseByDate>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_76" offerId="offer_ancillary_76">
    <ns12:OfferItemId>offerItem_76</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>SYD</ns12:Origin>
    <ns12:Destination>AUH</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FreeOfChargeRules>BOOKING_REQUIRED</FreeOfChargeRules>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_1"/>
    <ns12:PurchaseByDate>2022-11-30</ns12:PurchaseByDate>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_77" offerId="offer_ancillary_77">
    <ns12:OfferItemId>offerItem_77</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>SYD</ns12:Origin>
    <ns12:Destination>AUH</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FreeOfChargeRules>BOOKING_REQUIRED</FreeOfChargeRules>
      <FreeOfChargeRules>EMD_REQUIRED</FreeOfChargeRules>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_1"/>
    <ns12:PurchaseByDate>2022-11-30</ns12:PurchaseByDate>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_78" offerId="offer_ancillary_78">
    <ns12:OfferItemId>offerItem_78</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>SYD</ns12:Origin>
    <ns12:Destination>AUH</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FreeOfChargeRules>BOOKING_REQUIRED</FreeOfChargeRules>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_1"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_79" offerId="offer_ancillary_79">
    <ns12:OfferItemId>offerItem_79</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>SYD</ns12:Origin>
    <ns12:Destination>AUH</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FreeOfChargeRules>BOOKING_REQUIRED</FreeOfChargeRules>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_1"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_80" offerId="offer_ancillary_80">
    <ns12:OfferItemId>offerItem_80</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>SYD</ns12:Origin>
    <ns12:Destination>AUH</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FreeOfChargeRules>BOOKING_REQUIRED</FreeOfChargeRules>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_1"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_81" offerId="offer_ancillary_81">
    <ns12:OfferItemId>offerItem_81</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>SYD</ns12:Origin>
    <ns12:Destination>AUH</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FreeOfChargeRules>BOOKING_REQUIRED</FreeOfChargeRules>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_1"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_82" offerId="offer_ancillary_82">
    <ns12:OfferItemId>offerItem_82</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>SYD</ns12:Origin>
    <ns12:Destination>AUH</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FreeOfChargeRules>BOOKING_REQUIRED</FreeOfChargeRules>
      <FreeOfChargeRules>EMD_REQUIRED</FreeOfChargeRules>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_1"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_83" offerId="offer_ancillary_83">
    <ns12:OfferItemId>offerItem_83</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>SYD</ns12:Origin>
    <ns12:Destination>AUH</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FreeOfChargeRules>BOOKING_REQUIRED</FreeOfChargeRules>
      <FreeOfChargeRules>EMD_REQUIRED</FreeOfChargeRules>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_1"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_84" offerId="offer_ancillary_84">
    <ns12:OfferItemId>offerItem_84</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>SYD</ns12:Origin>
    <ns12:Destination>AUH</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FreeOfChargeRules>BOOKING_REQUIRED</FreeOfChargeRules>
      <FreeOfChargeRules>EMD_REQUIRED</FreeOfChargeRules>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_1"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_85" offerId="offer_ancillary_85">
    <ns12:OfferItemId>offerItem_85</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>SYD</ns12:Origin>
    <ns12:Destination>AUH</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FreeOfChargeRules>BOOKING_REQUIRED</FreeOfChargeRules>
      <FreeOfChargeRules>EMD_REQUIRED</FreeOfChargeRules>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_1"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_86" offerId="offer_ancillary_86">
    <ns12:OfferItemId>offerItem_86</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>AUH</ns12:Origin>
    <ns12:Destination>LHR</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">7680</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">120.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">7680</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">7680</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">120.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">7680</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">7680</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">7680</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">7680</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">7680</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_2"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_87" offerId="offer_ancillary_87">
    <ns12:OfferItemId>offerItem_87</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>AUH</ns12:Origin>
    <ns12:Destination>LHR</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">7680</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">120.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">7680</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">7680</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">120.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">7680</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">7680</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">7680</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">7680</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">7680</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_2"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_88" offerId="offer_ancillary_88">
    <ns12:OfferItemId>offerItem_88</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>AUH</ns12:Origin>
    <ns12:Destination>LHR</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">2240</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">35.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">2240</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">2240</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">35.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">2240</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">2240</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">2240</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">2240</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">2240</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_2"/>
    <ns12:PurchaseByDate>2022-11-30</ns12:PurchaseByDate>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_89" offerId="offer_ancillary_89">
    <ns12:OfferItemId>offerItem_89</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>AUH</ns12:Origin>
    <ns12:Destination>LHR</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FreeOfChargeRules>BOOKING_REQUIRED</FreeOfChargeRules>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_2"/>
    <ns12:PurchaseByDate>2022-11-30</ns12:PurchaseByDate>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_90" offerId="offer_ancillary_90">
    <ns12:OfferItemId>offerItem_90</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>AUH</ns12:Origin>
    <ns12:Destination>LHR</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FreeOfChargeRules>BOOKING_REQUIRED</FreeOfChargeRules>
      <FreeOfChargeRules>EMD_REQUIRED</FreeOfChargeRules>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_2"/>
    <ns12:PurchaseByDate>2022-11-30</ns12:PurchaseByDate>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_91" offerId="offer_ancillary_91">
    <ns12:OfferItemId>offerItem_91</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>AUH</ns12:Origin>
    <ns12:Destination>LHR</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FreeOfChargeRules>BOOKING_REQUIRED</FreeOfChargeRules>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_2"/>
    <ns12:PurchaseByDate>2022-11-30</ns12:PurchaseByDate>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_92" offerId="offer_ancillary_92">
    <ns12:OfferItemId>offerItem_92</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>AUH</ns12:Origin>
    <ns12:Destination>LHR</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FreeOfChargeRules>BOOKING_REQUIRED</FreeOfChargeRules>
      <FreeOfChargeRules>EMD_REQUIRED</FreeOfChargeRules>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_2"/>
    <ns12:PurchaseByDate>2022-11-30</ns12:PurchaseByDate>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_93" offerId="offer_ancillary_93">
    <ns12:OfferItemId>offerItem_93</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>AUH</ns12:Origin>
    <ns12:Destination>LHR</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FreeOfChargeRules>BOOKING_REQUIRED</FreeOfChargeRules>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_2"/>
    <ns12:PurchaseByDate>2022-11-30</ns12:PurchaseByDate>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_94" offerId="offer_ancillary_94">
    <ns12:OfferItemId>offerItem_94</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>AUH</ns12:Origin>
    <ns12:Destination>LHR</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FreeOfChargeRules>BOOKING_REQUIRED</FreeOfChargeRules>
      <FreeOfChargeRules>EMD_REQUIRED</FreeOfChargeRules>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_2"/>
    <ns12:PurchaseByDate>2022-11-30</ns12:PurchaseByDate>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_95" offerId="offer_ancillary_95">
    <ns12:OfferItemId>offerItem_95</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>AUH</ns12:Origin>
    <ns12:Destination>LHR</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FreeOfChargeRules>BOOKING_REQUIRED</FreeOfChargeRules>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_2"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_96" offerId="offer_ancillary_96">
    <ns12:OfferItemId>offerItem_96</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>AUH</ns12:Origin>
    <ns12:Destination>LHR</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FreeOfChargeRules>BOOKING_REQUIRED</FreeOfChargeRules>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_2"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_97" offerId="offer_ancillary_97">
    <ns12:OfferItemId>offerItem_97</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>AUH</ns12:Origin>
    <ns12:Destination>LHR</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FreeOfChargeRules>BOOKING_REQUIRED</FreeOfChargeRules>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_2"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_98" offerId="offer_ancillary_98">
    <ns12:OfferItemId>offerItem_98</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>AUH</ns12:Origin>
    <ns12:Destination>LHR</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FreeOfChargeRules>BOOKING_REQUIRED</FreeOfChargeRules>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_2"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_99" offerId="offer_ancillary_99">
    <ns12:OfferItemId>offerItem_99</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>AUH</ns12:Origin>
    <ns12:Destination>LHR</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FreeOfChargeRules>BOOKING_REQUIRED</FreeOfChargeRules>
      <FreeOfChargeRules>EMD_REQUIRED</FreeOfChargeRules>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_2"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_100" offerId="offer_ancillary_100">
    <ns12:OfferItemId>offerItem_100</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>AUH</ns12:Origin>
    <ns12:Destination>LHR</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FreeOfChargeRules>BOOKING_REQUIRED</FreeOfChargeRules>
      <FreeOfChargeRules>EMD_REQUIRED</FreeOfChargeRules>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_2"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_101" offerId="offer_ancillary_101">
    <ns12:OfferItemId>offerItem_101</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>AUH</ns12:Origin>
    <ns12:Destination>LHR</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FreeOfChargeRules>BOOKING_REQUIRED</FreeOfChargeRules>
      <FreeOfChargeRules>EMD_REQUIRED</FreeOfChargeRules>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_2"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_102" offerId="offer_ancillary_102">
    <ns12:OfferItemId>offerItem_102</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>AUH</ns12:Origin>
    <ns12:Destination>LHR</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FreeOfChargeRules>BOOKING_REQUIRED</FreeOfChargeRules>
      <FreeOfChargeRules>EMD_REQUIRED</FreeOfChargeRules>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_2"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_86" offerId="offer_ancillary_103">
    <ns12:OfferItemId>offerItem_103</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>LHR</ns12:Origin>
    <ns12:Destination>AUH</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">7680</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">120.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">7680</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">7680</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">120.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">7680</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">7680</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">7680</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">7680</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">7680</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_3"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_87" offerId="offer_ancillary_104">
    <ns12:OfferItemId>offerItem_104</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>LHR</ns12:Origin>
    <ns12:Destination>AUH</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">7680</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">120.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">7680</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">7680</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">120.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">7680</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">7680</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">7680</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">7680</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">7680</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_3"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_88" offerId="offer_ancillary_105">
    <ns12:OfferItemId>offerItem_105</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>LHR</ns12:Origin>
    <ns12:Destination>AUH</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">2240</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">35.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">2240</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">2240</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">35.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">2240</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">2240</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">2240</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">2240</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">2240</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_3"/>
    <ns12:PurchaseByDate>2022-12-06</ns12:PurchaseByDate>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_72" offerId="offer_ancillary_106">
    <ns12:OfferItemId>offerItem_106</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>LHR</ns12:Origin>
    <ns12:Destination>AUH</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FreeOfChargeRules>BOOKING_REQUIRED</FreeOfChargeRules>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_3"/>
    <ns12:PurchaseByDate>2022-12-06</ns12:PurchaseByDate>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_73" offerId="offer_ancillary_107">
    <ns12:OfferItemId>offerItem_107</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>LHR</ns12:Origin>
    <ns12:Destination>AUH</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FreeOfChargeRules>BOOKING_REQUIRED</FreeOfChargeRules>
      <FreeOfChargeRules>EMD_REQUIRED</FreeOfChargeRules>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_3"/>
    <ns12:PurchaseByDate>2022-12-06</ns12:PurchaseByDate>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_74" offerId="offer_ancillary_108">
    <ns12:OfferItemId>offerItem_108</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>LHR</ns12:Origin>
    <ns12:Destination>AUH</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FreeOfChargeRules>BOOKING_REQUIRED</FreeOfChargeRules>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_3"/>
    <ns12:PurchaseByDate>2022-12-06</ns12:PurchaseByDate>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_75" offerId="offer_ancillary_109">
    <ns12:OfferItemId>offerItem_109</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>LHR</ns12:Origin>
    <ns12:Destination>AUH</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FreeOfChargeRules>BOOKING_REQUIRED</FreeOfChargeRules>
      <FreeOfChargeRules>EMD_REQUIRED</FreeOfChargeRules>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_3"/>
    <ns12:PurchaseByDate>2022-12-06</ns12:PurchaseByDate>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_76" offerId="offer_ancillary_110">
    <ns12:OfferItemId>offerItem_110</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>LHR</ns12:Origin>
    <ns12:Destination>AUH</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FreeOfChargeRules>BOOKING_REQUIRED</FreeOfChargeRules>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_3"/>
    <ns12:PurchaseByDate>2022-12-06</ns12:PurchaseByDate>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_77" offerId="offer_ancillary_111">
    <ns12:OfferItemId>offerItem_111</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>LHR</ns12:Origin>
    <ns12:Destination>AUH</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FreeOfChargeRules>BOOKING_REQUIRED</FreeOfChargeRules>
      <FreeOfChargeRules>EMD_REQUIRED</FreeOfChargeRules>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_3"/>
    <ns12:PurchaseByDate>2022-12-06</ns12:PurchaseByDate>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_78" offerId="offer_ancillary_112">
    <ns12:OfferItemId>offerItem_112</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>LHR</ns12:Origin>
    <ns12:Destination>AUH</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FreeOfChargeRules>BOOKING_REQUIRED</FreeOfChargeRules>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_3"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_79" offerId="offer_ancillary_113">
    <ns12:OfferItemId>offerItem_113</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>LHR</ns12:Origin>
    <ns12:Destination>AUH</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FreeOfChargeRules>BOOKING_REQUIRED</FreeOfChargeRules>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_3"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_80" offerId="offer_ancillary_114">
    <ns12:OfferItemId>offerItem_114</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>LHR</ns12:Origin>
    <ns12:Destination>AUH</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FreeOfChargeRules>BOOKING_REQUIRED</FreeOfChargeRules>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_3"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_81" offerId="offer_ancillary_115">
    <ns12:OfferItemId>offerItem_115</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>LHR</ns12:Origin>
    <ns12:Destination>AUH</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FreeOfChargeRules>BOOKING_REQUIRED</FreeOfChargeRules>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_3"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_82" offerId="offer_ancillary_116">
    <ns12:OfferItemId>offerItem_116</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>LHR</ns12:Origin>
    <ns12:Destination>AUH</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FreeOfChargeRules>BOOKING_REQUIRED</FreeOfChargeRules>
      <FreeOfChargeRules>EMD_REQUIRED</FreeOfChargeRules>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_3"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_83" offerId="offer_ancillary_117">
    <ns12:OfferItemId>offerItem_117</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>LHR</ns12:Origin>
    <ns12:Destination>AUH</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FreeOfChargeRules>BOOKING_REQUIRED</FreeOfChargeRules>
      <FreeOfChargeRules>EMD_REQUIRED</FreeOfChargeRules>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_3"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_84" offerId="offer_ancillary_118">
    <ns12:OfferItemId>offerItem_118</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>LHR</ns12:Origin>
    <ns12:Destination>AUH</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FreeOfChargeRules>BOOKING_REQUIRED</FreeOfChargeRules>
      <FreeOfChargeRules>EMD_REQUIRED</FreeOfChargeRules>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_3"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_85" offerId="offer_ancillary_119">
    <ns12:OfferItemId>offerItem_119</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>LHR</ns12:Origin>
    <ns12:Destination>AUH</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FreeOfChargeRules>BOOKING_REQUIRED</FreeOfChargeRules>
      <FreeOfChargeRules>EMD_REQUIRED</FreeOfChargeRules>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_3"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_69" offerId="offer_ancillary_120">
    <ns12:OfferItemId>offerItem_120</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>AUH</ns12:Origin>
    <ns12:Destination>SYD</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">8960</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">140.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">8960</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">8960</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">140.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">8960</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">8960</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">8960</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">8960</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">8960</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_4"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_70" offerId="offer_ancillary_121">
    <ns12:OfferItemId>offerItem_121</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>AUH</ns12:Origin>
    <ns12:Destination>SYD</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">8960</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">140.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">8960</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">8960</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">140.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">8960</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">8960</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">8960</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">8960</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">8960</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_4"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_71" offerId="offer_ancillary_122">
    <ns12:OfferItemId>offerItem_122</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>AUH</ns12:Origin>
    <ns12:Destination>SYD</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">2880</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">45.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">2880</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">2880</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">45.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">2880</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">2880</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">2880</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">2880</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">2880</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_4"/>
    <ns12:PurchaseByDate>2022-12-07</ns12:PurchaseByDate>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_89" offerId="offer_ancillary_123">
    <ns12:OfferItemId>offerItem_123</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>AUH</ns12:Origin>
    <ns12:Destination>SYD</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FreeOfChargeRules>BOOKING_REQUIRED</FreeOfChargeRules>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_4"/>
    <ns12:PurchaseByDate>2022-12-07</ns12:PurchaseByDate>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_90" offerId="offer_ancillary_124">
    <ns12:OfferItemId>offerItem_124</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>AUH</ns12:Origin>
    <ns12:Destination>SYD</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FreeOfChargeRules>BOOKING_REQUIRED</FreeOfChargeRules>
      <FreeOfChargeRules>EMD_REQUIRED</FreeOfChargeRules>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_4"/>
    <ns12:PurchaseByDate>2022-12-07</ns12:PurchaseByDate>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_91" offerId="offer_ancillary_125">
    <ns12:OfferItemId>offerItem_125</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>AUH</ns12:Origin>
    <ns12:Destination>SYD</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FreeOfChargeRules>BOOKING_REQUIRED</FreeOfChargeRules>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_4"/>
    <ns12:PurchaseByDate>2022-12-07</ns12:PurchaseByDate>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_92" offerId="offer_ancillary_126">
    <ns12:OfferItemId>offerItem_126</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>AUH</ns12:Origin>
    <ns12:Destination>SYD</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FreeOfChargeRules>BOOKING_REQUIRED</FreeOfChargeRules>
      <FreeOfChargeRules>EMD_REQUIRED</FreeOfChargeRules>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_4"/>
    <ns12:PurchaseByDate>2022-12-07</ns12:PurchaseByDate>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_93" offerId="offer_ancillary_127">
    <ns12:OfferItemId>offerItem_127</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>AUH</ns12:Origin>
    <ns12:Destination>SYD</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FreeOfChargeRules>BOOKING_REQUIRED</FreeOfChargeRules>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_4"/>
    <ns12:PurchaseByDate>2022-12-07</ns12:PurchaseByDate>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_94" offerId="offer_ancillary_128">
    <ns12:OfferItemId>offerItem_128</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>AUH</ns12:Origin>
    <ns12:Destination>SYD</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FreeOfChargeRules>BOOKING_REQUIRED</FreeOfChargeRules>
      <FreeOfChargeRules>EMD_REQUIRED</FreeOfChargeRules>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_4"/>
    <ns12:PurchaseByDate>2022-12-07</ns12:PurchaseByDate>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_95" offerId="offer_ancillary_129">
    <ns12:OfferItemId>offerItem_129</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>AUH</ns12:Origin>
    <ns12:Destination>SYD</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FreeOfChargeRules>BOOKING_REQUIRED</FreeOfChargeRules>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_4"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_96" offerId="offer_ancillary_130">
    <ns12:OfferItemId>offerItem_130</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>AUH</ns12:Origin>
    <ns12:Destination>SYD</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FreeOfChargeRules>BOOKING_REQUIRED</FreeOfChargeRules>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_4"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_97" offerId="offer_ancillary_131">
    <ns12:OfferItemId>offerItem_131</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>AUH</ns12:Origin>
    <ns12:Destination>SYD</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FreeOfChargeRules>BOOKING_REQUIRED</FreeOfChargeRules>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_4"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_98" offerId="offer_ancillary_132">
    <ns12:OfferItemId>offerItem_132</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>AUH</ns12:Origin>
    <ns12:Destination>SYD</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FreeOfChargeRules>BOOKING_REQUIRED</FreeOfChargeRules>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_4"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_99" offerId="offer_ancillary_133">
    <ns12:OfferItemId>offerItem_133</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>AUH</ns12:Origin>
    <ns12:Destination>SYD</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FreeOfChargeRules>BOOKING_REQUIRED</FreeOfChargeRules>
      <FreeOfChargeRules>EMD_REQUIRED</FreeOfChargeRules>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_4"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_100" offerId="offer_ancillary_134">
    <ns12:OfferItemId>offerItem_134</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>AUH</ns12:Origin>
    <ns12:Destination>SYD</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FreeOfChargeRules>BOOKING_REQUIRED</FreeOfChargeRules>
      <FreeOfChargeRules>EMD_REQUIRED</FreeOfChargeRules>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_4"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_101" offerId="offer_ancillary_135">
    <ns12:OfferItemId>offerItem_135</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>AUH</ns12:Origin>
    <ns12:Destination>SYD</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FreeOfChargeRules>BOOKING_REQUIRED</FreeOfChargeRules>
      <FreeOfChargeRules>EMD_REQUIRED</FreeOfChargeRules>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_4"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_102" offerId="offer_ancillary_136">
    <ns12:OfferItemId>offerItem_136</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>AUH</ns12:Origin>
    <ns12:Destination>SYD</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="RUB">0</ns2:Amount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">0</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">0</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>true</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FreeOfChargeRules>BOOKING_REQUIRED</FreeOfChargeRules>
      <FreeOfChargeRules>EMD_REQUIRED</FreeOfChargeRules>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_4"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_137" offerId="offer_ancillary_137">
    <ns12:OfferItemId>offerItem_137</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>SYD</ns12:Origin>
    <ns12:Destination>AUH</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">2944</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">46.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">2944</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">2944</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">46.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">2944</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">2944</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">2944</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">2944</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">2944</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>N</RefundableReissuable>
      <FormOfRefund code="1">ORIGINAL</FormOfRefund>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_1"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_138" offerId="offer_ancillary_138">
    <ns12:OfferItemId>offerItem_138</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>SYD</ns12:Origin>
    <ns12:Destination>AUH</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">3264</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">51.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">3264</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">3264</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">51.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">3264</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">3264</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">3264</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">3264</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">3264</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>Y</RefundableReissuable>
      <FormOfRefund code="1">ORIGINAL</FormOfRefund>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_1"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_139" offerId="offer_ancillary_139">
    <ns12:OfferItemId>offerItem_139</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>AUH</ns12:Origin>
    <ns12:Destination>LHR</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">2944</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">46.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">2944</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">2944</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">46.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">2944</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">2944</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">2944</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">2944</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">2944</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <FormOfRefund code="1">ORIGINAL</FormOfRefund>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_2"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_140" offerId="offer_ancillary_140">
    <ns12:OfferItemId>offerItem_140</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>AUH</ns12:Origin>
    <ns12:Destination>LHR</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">3264</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">51.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">3264</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">3264</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">51.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">3264</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">3264</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">3264</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">3264</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">3264</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <FormOfRefund code="1">ORIGINAL</FormOfRefund>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_2"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_139" offerId="offer_ancillary_141">
    <ns12:OfferItemId>offerItem_141</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>LHR</ns12:Origin>
    <ns12:Destination>AUH</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">2944</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">46.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">2944</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">2944</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">46.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">2944</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">2944</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">2944</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">2944</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">2944</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <FormOfRefund code="1">ORIGINAL</FormOfRefund>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_3"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_140" offerId="offer_ancillary_142">
    <ns12:OfferItemId>offerItem_142</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>LHR</ns12:Origin>
    <ns12:Destination>AUH</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">3264</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">51.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">3264</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">3264</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">51.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">3264</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">3264</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">3264</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">3264</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">3264</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <FormOfRefund code="1">ORIGINAL</FormOfRefund>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_3"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_137" offerId="offer_ancillary_143">
    <ns12:OfferItemId>offerItem_143</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>AUH</ns12:Origin>
    <ns12:Destination>SYD</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">2944</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">46.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">2944</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">2944</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">46.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">2944</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">2944</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">2944</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">2944</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">2944</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>N</RefundableReissuable>
      <FormOfRefund code="1">ORIGINAL</FormOfRefund>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_4"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_138" offerId="offer_ancillary_144">
    <ns12:OfferItemId>offerItem_144</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>AUH</ns12:Origin>
    <ns12:Destination>SYD</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">3264</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">51.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">3264</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">3264</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">51.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">3264</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">3264</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">3264</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">3264</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">3264</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>Y</RefundableReissuable>
      <FormOfRefund code="1">ORIGINAL</FormOfRefund>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_4"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_145" offerId="offer_ancillary_145">
    <ns12:OfferItemId>offerItem_145</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>SYD</ns12:Origin>
    <ns12:Destination>LHR</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">2560</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">40.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">2560</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">2560</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">40.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">2560</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">2560</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">2560</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">2560</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">2560</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>N</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_1"/>
    <ns12:Segment segmentId="seg_2"/>
    <ns12:PurchaseByDate>2022-12-01</ns12:PurchaseByDate>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_146" offerId="offer_ancillary_146">
    <ns12:OfferItemId>offerItem_146</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>SYD</ns12:Origin>
    <ns12:Destination>LHR</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">2624</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">41.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">2624</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">2624</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">41.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">2624</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">2624</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">2624</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">2624</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">2624</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>N</RefundableReissuable>
      <FormOfRefund code="1">ORIGINAL</FormOfRefund>
      <Commissionable>false</Commissionable>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_1"/>
    <ns12:Segment segmentId="seg_2"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_145" offerId="offer_ancillary_147">
    <ns12:OfferItemId>offerItem_147</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>LHR</ns12:Origin>
    <ns12:Destination>SYD</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">2560</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">40.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">2560</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">2560</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">40.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">2560</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">2560</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">2560</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">2560</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">2560</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>N</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>false</Interlineable>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_3"/>
    <ns12:Segment segmentId="seg_4"/>
    <ns12:PurchaseByDate>2022-12-08</ns12:PurchaseByDate>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_146" offerId="offer_ancillary_148">
    <ns12:OfferItemId>offerItem_148</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>LHR</ns12:Origin>
    <ns12:Destination>SYD</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">2624</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">41.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">2624</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">2624</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">41.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">2624</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">2624</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">2624</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">2624</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">2624</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>N</RefundableReissuable>
      <FormOfRefund code="1">ORIGINAL</FormOfRefund>
      <Commissionable>false</Commissionable>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_3"/>
    <ns12:Segment segmentId="seg_4"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_150" offerId="offer_ancillary_150">
    <ns12:OfferItemId>offerItem_149</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>SYD</ns12:Origin>
    <ns12:Destination>LHR</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">38340</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">599.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">38340</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">38340</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">599.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">38340</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">38340</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">38340</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">38340</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">38340</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>true</Interlineable>
      <FeeApplicationMethod code="4">PER_BAGGAGE_TRAVEL</FeeApplicationMethod>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_1"/>
    <ns12:Segment segmentId="seg_2"/>
    <ns12:PurchaseByDate>2022-12-01</ns12:PurchaseByDate>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_154" offerId="offer_ancillary_154">
    <ns12:OfferItemId>offerItem_150</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>SYD</ns12:Origin>
    <ns12:Destination>LHR</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">50690</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">792.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">50690</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">50690</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">792.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">50690</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">50690</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">50690</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">50690</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">50690</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>true</Interlineable>
      <FeeApplicationMethod code="4">PER_BAGGAGE_TRAVEL</FeeApplicationMethod>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_1"/>
    <ns12:Segment segmentId="seg_2"/>
    <ns12:PurchaseByDate>2022-12-01</ns12:PurchaseByDate>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_156" offerId="offer_ancillary_156">
    <ns12:OfferItemId>offerItem_151</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>SYD</ns12:Origin>
    <ns12:Destination>LHR</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">62915</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">983.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">62915</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">62915</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">983.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">62915</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">62915</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">62915</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">62915</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">62915</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>true</Interlineable>
      <FeeApplicationMethod code="4">PER_BAGGAGE_TRAVEL</FeeApplicationMethod>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_1"/>
    <ns12:Segment segmentId="seg_2"/>
    <ns12:PurchaseByDate>2022-12-01</ns12:PurchaseByDate>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_160" offerId="offer_ancillary_160">
    <ns12:OfferItemId>offerItem_152</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>SYD</ns12:Origin>
    <ns12:Destination>LHR</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">75330</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">1177.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">75330</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">75330</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">1177.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">75330</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">75330</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">75330</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">75330</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">75330</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>true</Interlineable>
      <FeeApplicationMethod code="4">PER_BAGGAGE_TRAVEL</FeeApplicationMethod>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_1"/>
    <ns12:Segment segmentId="seg_2"/>
    <ns12:PurchaseByDate>2022-12-01</ns12:PurchaseByDate>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_164" offerId="offer_ancillary_164">
    <ns12:OfferItemId>offerItem_153</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>SYD</ns12:Origin>
    <ns12:Destination>LHR</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">87555</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">1368.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">87555</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">87555</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">1368.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">87555</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">87555</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">87555</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">87555</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">87555</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>true</Interlineable>
      <FeeApplicationMethod code="4">PER_BAGGAGE_TRAVEL</FeeApplicationMethod>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_1"/>
    <ns12:Segment segmentId="seg_2"/>
    <ns12:PurchaseByDate>2022-12-01</ns12:PurchaseByDate>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_168" offerId="offer_ancillary_168">
    <ns12:OfferItemId>offerItem_154</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>SYD</ns12:Origin>
    <ns12:Destination>LHR</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">13700</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">214.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">13700</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">13700</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">214.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">13700</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">13700</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">13700</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">13700</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">13700</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>true</Interlineable>
      <FeeApplicationMethod code="4">PER_BAGGAGE_TRAVEL</FeeApplicationMethod>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_1"/>
    <ns12:Segment segmentId="seg_2"/>
    <ns12:PurchaseByDate>2022-12-01</ns12:PurchaseByDate>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_170" offerId="offer_ancillary_170">
    <ns12:OfferItemId>offerItem_155</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>SYD</ns12:Origin>
    <ns12:Destination>LHR</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">26050</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">407.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">26050</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">26050</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">407.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">26050</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">26050</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">26050</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">26050</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">26050</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>true</Interlineable>
      <FeeApplicationMethod code="4">PER_BAGGAGE_TRAVEL</FeeApplicationMethod>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_1"/>
    <ns12:Segment segmentId="seg_2"/>
    <ns12:PurchaseByDate>2022-12-01</ns12:PurchaseByDate>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_150" offerId="offer_ancillary_175">
    <ns12:OfferItemId>offerItem_156</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>LHR</ns12:Origin>
    <ns12:Destination>SYD</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">38340</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">599.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">38340</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">38340</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">599.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">38340</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">38340</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">38340</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">38340</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">38340</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>true</Interlineable>
      <FeeApplicationMethod code="4">PER_BAGGAGE_TRAVEL</FeeApplicationMethod>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_3"/>
    <ns12:Segment segmentId="seg_4"/>
    <ns12:PurchaseByDate>2022-12-07</ns12:PurchaseByDate>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_154" offerId="offer_ancillary_179">
    <ns12:OfferItemId>offerItem_157</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>LHR</ns12:Origin>
    <ns12:Destination>SYD</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">50690</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">792.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">50690</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">50690</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">792.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">50690</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">50690</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">50690</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">50690</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">50690</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>true</Interlineable>
      <FeeApplicationMethod code="4">PER_BAGGAGE_TRAVEL</FeeApplicationMethod>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_3"/>
    <ns12:Segment segmentId="seg_4"/>
    <ns12:PurchaseByDate>2022-12-07</ns12:PurchaseByDate>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_156" offerId="offer_ancillary_181">
    <ns12:OfferItemId>offerItem_158</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>LHR</ns12:Origin>
    <ns12:Destination>SYD</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">62915</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">983.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">62915</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">62915</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">983.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">62915</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">62915</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">62915</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">62915</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">62915</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>true</Interlineable>
      <FeeApplicationMethod code="4">PER_BAGGAGE_TRAVEL</FeeApplicationMethod>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_3"/>
    <ns12:Segment segmentId="seg_4"/>
    <ns12:PurchaseByDate>2022-12-07</ns12:PurchaseByDate>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_160" offerId="offer_ancillary_185">
    <ns12:OfferItemId>offerItem_159</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>LHR</ns12:Origin>
    <ns12:Destination>SYD</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">75330</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">1177.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">75330</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">75330</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">1177.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">75330</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">75330</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">75330</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">75330</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">75330</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>true</Interlineable>
      <FeeApplicationMethod code="4">PER_BAGGAGE_TRAVEL</FeeApplicationMethod>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_3"/>
    <ns12:Segment segmentId="seg_4"/>
    <ns12:PurchaseByDate>2022-12-07</ns12:PurchaseByDate>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_164" offerId="offer_ancillary_189">
    <ns12:OfferItemId>offerItem_160</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>LHR</ns12:Origin>
    <ns12:Destination>SYD</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">87555</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">1368.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">87555</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">87555</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">1368.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">87555</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">87555</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">87555</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">87555</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">87555</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>true</Interlineable>
      <FeeApplicationMethod code="4">PER_BAGGAGE_TRAVEL</FeeApplicationMethod>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_3"/>
    <ns12:Segment segmentId="seg_4"/>
    <ns12:PurchaseByDate>2022-12-07</ns12:PurchaseByDate>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_168" offerId="offer_ancillary_193">
    <ns12:OfferItemId>offerItem_161</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>LHR</ns12:Origin>
    <ns12:Destination>SYD</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">13700</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">214.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">13700</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">13700</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">214.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">13700</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">13700</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">13700</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">13700</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">13700</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>true</Interlineable>
      <FeeApplicationMethod code="4">PER_BAGGAGE_TRAVEL</FeeApplicationMethod>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_3"/>
    <ns12:Segment segmentId="seg_4"/>
    <ns12:PurchaseByDate>2022-12-07</ns12:PurchaseByDate>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_170" offerId="offer_ancillary_195">
    <ns12:OfferItemId>offerItem_162</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>LHR</ns12:Origin>
    <ns12:Destination>SYD</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">26050</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">407.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">26050</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">26050</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">407.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">26050</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">26050</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">26050</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">26050</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">26050</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>R</RefundableReissuable>
      <Commissionable>false</Commissionable>
      <Interlineable>true</Interlineable>
      <FeeApplicationMethod code="4">PER_BAGGAGE_TRAVEL</FeeApplicationMethod>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_3"/>
    <ns12:Segment segmentId="seg_4"/>
    <ns12:PurchaseByDate>2022-12-07</ns12:PurchaseByDate>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_545" offerId="offer_ancillary_545">
    <ns12:OfferItemId>offerItem_163</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>SYD</ns12:Origin>
    <ns12:Destination>AUH</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">896</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">14.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">896</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">896</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">14.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">896</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">896</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">896</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">896</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">896</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>Y</RefundableReissuable>
      <FormOfRefund code="1">ORIGINAL</FormOfRefund>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_1"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_545" offerId="offer_ancillary_546">
    <ns12:OfferItemId>offerItem_164</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>AUH</ns12:Origin>
    <ns12:Destination>LHR</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">896</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">14.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">896</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">896</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">14.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">896</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">896</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">896</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">896</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">896</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>Y</RefundableReissuable>
      <FormOfRefund code="1">ORIGINAL</FormOfRefund>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_2"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_545" offerId="offer_ancillary_547">
    <ns12:OfferItemId>offerItem_165</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>LHR</ns12:Origin>
    <ns12:Destination>AUH</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">896</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">14.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">896</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">896</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">14.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">896</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">896</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">896</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">896</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">896</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>Y</RefundableReissuable>
      <FormOfRefund code="1">ORIGINAL</FormOfRefund>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_3"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:Offers ancillaryRef="ancillary_ancillary_545" offerId="offer_ancillary_548">
    <ns12:OfferItemId>offerItem_166</ns12:OfferItemId>
    <ns12:Quantity>1</ns12:Quantity>
    <ns12:Origin>AUH</ns12:Origin>
    <ns12:Destination>SYD</ns12:Destination>
    <ns12:AncillaryFee>
      <Unavailable>false</Unavailable>
      <TaxExemptIndicator>false</TaxExemptIndicator>
      <TotalTaxes/>
      <Base>
        <ns2:TotalEquivalentAmount currency="RUB">896</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">14.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">896</ns2:EquivAmount>
      </Base>
      <TotalBaseEquiv>
        <ns2:TotalEquivalentAmount currency="RUB">896</ns2:TotalEquivalentAmount>
        <ns2:Amount currency="USD">14.00</ns2:Amount>
        <ns2:EquivAmount currency="RUB">896</ns2:EquivAmount>
      </TotalBaseEquiv>
      <TTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">896</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">896</ns2:EquivAmount>
      </TTL_Price>
      <TotalTTL_Price>
        <ns2:TotalEquivalentAmount currency="RUB">896</ns2:TotalEquivalentAmount>
        <ns2:EquivAmount currency="RUB">896</ns2:EquivAmount>
      </TotalTTL_Price>
      <DisplayOnly>false</DisplayOnly>
    </ns12:AncillaryFee>
    <ns12:AncillaryRules>
      <RefundableReissuable>Y</RefundableReissuable>
      <FormOfRefund code="1">ORIGINAL</FormOfRefund>
      <FeeApplicationMethod code="4">TRAVEL</FeeApplicationMethod>
      <FeeNotGuaranteeIndicator>true</FeeNotGuaranteeIndicator>
      <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
    </ns12:AncillaryRules>
    <ns12:Segment segmentId="seg_4"/>
    <ns12:IsDisclosurePart>false</ns12:IsDisclosurePart>
    <ns12:PaperTicketRequired>false</ns12:PaperTicketRequired>
  </ns37:Offers>
  <ns37:PassengerOffers>
    <ns12:PassengerReference nameReferenceNumber="1.1" passengerId="pax_1" passengerType="ADT"/>
    <ns12:OfferRefs/>
    <ns12:Ticket number="6079419628276">
      <ns12:CouponAssociation>
        <ns12:OfferRefs>offer_ancillary_1 offer_ancillary_2 offer_ancillary_7 offer_ancillary_8 offer_ancillary_24 offer_ancillary_25 offer_ancillary_26 offer_ancillary_27 offer_ancillary_28 offer_ancillary_29 offer_ancillary_30 offer_ancillary_31 offer_ancillary_32 offer_ancillary_33 offer_ancillary_34 offer_ancillary_58 offer_ancillary_62 offer_ancillary_63 offer_ancillary_86 offer_ancillary_87 offer_ancillary_88 offer_ancillary_89 offer_ancillary_90 offer_ancillary_91 offer_ancillary_92 offer_ancillary_93 offer_ancillary_94 offer_ancillary_95 offer_ancillary_96 offer_ancillary_97 offer_ancillary_98 offer_ancillary_99 offer_ancillary_100 offer_ancillary_101 offer_ancillary_102 offer_ancillary_139 offer_ancillary_140</ns12:OfferRefs>
        <ns12:Coupon>2</ns12:Coupon>
      </ns12:CouponAssociation>
      <ns12:CouponAssociation>
        <ns12:OfferRefs>offer_ancillary_3 offer_ancillary_4 offer_ancillary_9 offer_ancillary_10 offer_ancillary_35 offer_ancillary_36 offer_ancillary_37 offer_ancillary_38 offer_ancillary_39 offer_ancillary_40 offer_ancillary_41 offer_ancillary_42 offer_ancillary_43 offer_ancillary_44 offer_ancillary_59 offer_ancillary_64 offer_ancillary_65 offer_ancillary_103 offer_ancillary_104 offer_ancillary_105 offer_ancillary_106 offer_ancillary_107 offer_ancillary_108 offer_ancillary_109 offer_ancillary_110 offer_ancillary_111 offer_ancillary_112 offer_ancillary_113 offer_ancillary_114 offer_ancillary_115 offer_ancillary_116 offer_ancillary_117 offer_ancillary_118 offer_ancillary_119 offer_ancillary_141 offer_ancillary_142</ns12:OfferRefs>
        <ns12:Coupon>3</ns12:Coupon>
      </ns12:CouponAssociation>
      <ns12:CouponAssociation>
        <ns12:OfferRefs>offer_ancillary_5 offer_ancillary_6 offer_ancillary_13 offer_ancillary_14 offer_ancillary_15 offer_ancillary_16 offer_ancillary_17 offer_ancillary_18 offer_ancillary_19 offer_ancillary_20 offer_ancillary_21 offer_ancillary_22 offer_ancillary_23 offer_ancillary_57 offer_ancillary_61 offer_ancillary_69 offer_ancillary_70 offer_ancillary_71 offer_ancillary_72 offer_ancillary_73 offer_ancillary_74 offer_ancillary_75 offer_ancillary_76 offer_ancillary_77 offer_ancillary_78 offer_ancillary_79 offer_ancillary_80 offer_ancillary_81 offer_ancillary_82 offer_ancillary_83 offer_ancillary_84 offer_ancillary_85 offer_ancillary_137 offer_ancillary_138</ns12:OfferRefs>
        <ns12:Coupon>1</ns12:Coupon>
      </ns12:CouponAssociation>
      <ns12:CouponAssociation>
        <ns12:OfferRefs>offer_ancillary_11 offer_ancillary_12 offer_ancillary_45 offer_ancillary_46 offer_ancillary_47 offer_ancillary_48 offer_ancillary_49 offer_ancillary_50 offer_ancillary_51 offer_ancillary_52 offer_ancillary_53 offer_ancillary_54 offer_ancillary_55 offer_ancillary_56 offer_ancillary_60 offer_ancillary_66 offer_ancillary_120 offer_ancillary_121 offer_ancillary_122 offer_ancillary_123 offer_ancillary_124 offer_ancillary_125 offer_ancillary_126 offer_ancillary_127 offer_ancillary_128 offer_ancillary_129 offer_ancillary_130 offer_ancillary_131 offer_ancillary_132 offer_ancillary_133 offer_ancillary_134 offer_ancillary_135 offer_ancillary_136 offer_ancillary_143 offer_ancillary_144</ns12:OfferRefs>
        <ns12:Coupon>4</ns12:Coupon>
      </ns12:CouponAssociation>
      <ns12:CouponAssociation>
        <ns12:OfferRefs>offer_ancillary_67 offer_ancillary_145 offer_ancillary_146 offer_ancillary_150 offer_ancillary_154 offer_ancillary_156 offer_ancillary_160 offer_ancillary_164 offer_ancillary_168 offer_ancillary_170</ns12:OfferRefs>
        <ns12:Coupon>1</ns12:Coupon>
        <ns12:Coupon>2</ns12:Coupon>
      </ns12:CouponAssociation>
      <ns12:CouponAssociation>
        <ns12:OfferRefs>offer_ancillary_68 offer_ancillary_147 offer_ancillary_148 offer_ancillary_175 offer_ancillary_179 offer_ancillary_181 offer_ancillary_185 offer_ancillary_189 offer_ancillary_193 offer_ancillary_195</ns12:OfferRefs>
        <ns12:Coupon>3</ns12:Coupon>
        <ns12:Coupon>4</ns12:Coupon>
      </ns12:CouponAssociation>
    </ns12:Ticket>
  </ns37:PassengerOffers>
  <ns37:PassengerOffers>
    <ns12:PassengerReference nameReferenceNumber="2.1" passengerId="pax_2" passengerType="ADT"/>
    <ns12:OfferRefs/>
    <ns12:Ticket number="6079419628277">
      <ns12:CouponAssociation>
        <ns12:OfferRefs>offer_ancillary_1 offer_ancillary_2 offer_ancillary_7 offer_ancillary_8 offer_ancillary_24 offer_ancillary_25 offer_ancillary_26 offer_ancillary_27 offer_ancillary_28 offer_ancillary_29 offer_ancillary_30 offer_ancillary_31 offer_ancillary_32 offer_ancillary_33 offer_ancillary_34 offer_ancillary_58 offer_ancillary_62 offer_ancillary_63 offer_ancillary_86 offer_ancillary_87 offer_ancillary_88 offer_ancillary_89 offer_ancillary_90 offer_ancillary_91 offer_ancillary_92 offer_ancillary_93 offer_ancillary_94 offer_ancillary_95 offer_ancillary_96 offer_ancillary_97 offer_ancillary_98 offer_ancillary_99 offer_ancillary_100 offer_ancillary_101 offer_ancillary_102 offer_ancillary_139 offer_ancillary_140</ns12:OfferRefs>
        <ns12:Coupon>2</ns12:Coupon>
      </ns12:CouponAssociation>
      <ns12:CouponAssociation>
        <ns12:OfferRefs>offer_ancillary_3 offer_ancillary_4 offer_ancillary_9 offer_ancillary_10 offer_ancillary_35 offer_ancillary_36 offer_ancillary_37 offer_ancillary_38 offer_ancillary_39 offer_ancillary_40 offer_ancillary_41 offer_ancillary_42 offer_ancillary_43 offer_ancillary_44 offer_ancillary_59 offer_ancillary_64 offer_ancillary_65 offer_ancillary_103 offer_ancillary_104 offer_ancillary_105 offer_ancillary_106 offer_ancillary_107 offer_ancillary_108 offer_ancillary_109 offer_ancillary_110 offer_ancillary_111 offer_ancillary_112 offer_ancillary_113 offer_ancillary_114 offer_ancillary_115 offer_ancillary_116 offer_ancillary_117 offer_ancillary_118 offer_ancillary_119 offer_ancillary_141 offer_ancillary_142</ns12:OfferRefs>
        <ns12:Coupon>3</ns12:Coupon>
      </ns12:CouponAssociation>
      <ns12:CouponAssociation>
        <ns12:OfferRefs>offer_ancillary_5 offer_ancillary_6 offer_ancillary_13 offer_ancillary_14 offer_ancillary_15 offer_ancillary_16 offer_ancillary_17 offer_ancillary_18 offer_ancillary_19 offer_ancillary_20 offer_ancillary_21 offer_ancillary_22 offer_ancillary_23 offer_ancillary_57 offer_ancillary_61 offer_ancillary_69 offer_ancillary_70 offer_ancillary_71 offer_ancillary_72 offer_ancillary_73 offer_ancillary_74 offer_ancillary_75 offer_ancillary_76 offer_ancillary_77 offer_ancillary_78 offer_ancillary_79 offer_ancillary_80 offer_ancillary_81 offer_ancillary_82 offer_ancillary_83 offer_ancillary_84 offer_ancillary_85 offer_ancillary_137 offer_ancillary_138</ns12:OfferRefs>
        <ns12:Coupon>1</ns12:Coupon>
      </ns12:CouponAssociation>
      <ns12:CouponAssociation>
        <ns12:OfferRefs>offer_ancillary_11 offer_ancillary_12 offer_ancillary_45 offer_ancillary_46 offer_ancillary_47 offer_ancillary_48 offer_ancillary_49 offer_ancillary_50 offer_ancillary_51 offer_ancillary_52 offer_ancillary_53 offer_ancillary_54 offer_ancillary_55 offer_ancillary_56 offer_ancillary_60 offer_ancillary_66 offer_ancillary_120 offer_ancillary_121 offer_ancillary_122 offer_ancillary_123 offer_ancillary_124 offer_ancillary_125 offer_ancillary_126 offer_ancillary_127 offer_ancillary_128 offer_ancillary_129 offer_ancillary_130 offer_ancillary_131 offer_ancillary_132 offer_ancillary_133 offer_ancillary_134 offer_ancillary_135 offer_ancillary_136 offer_ancillary_143 offer_ancillary_144</ns12:OfferRefs>
        <ns12:Coupon>4</ns12:Coupon>
      </ns12:CouponAssociation>
      <ns12:CouponAssociation>
        <ns12:OfferRefs>offer_ancillary_67 offer_ancillary_145 offer_ancillary_146 offer_ancillary_150 offer_ancillary_154 offer_ancillary_156 offer_ancillary_160 offer_ancillary_164 offer_ancillary_168 offer_ancillary_170</ns12:OfferRefs>
        <ns12:Coupon>1</ns12:Coupon>
        <ns12:Coupon>2</ns12:Coupon>
      </ns12:CouponAssociation>
      <ns12:CouponAssociation>
        <ns12:OfferRefs>offer_ancillary_68 offer_ancillary_147 offer_ancillary_148 offer_ancillary_175 offer_ancillary_179 offer_ancillary_181 offer_ancillary_185 offer_ancillary_189 offer_ancillary_193 offer_ancillary_195</ns12:OfferRefs>
        <ns12:Coupon>3</ns12:Coupon>
        <ns12:Coupon>4</ns12:Coupon>
      </ns12:CouponAssociation>
    </ns12:Ticket>
  </ns37:PassengerOffers>
  <ns37:PassengerOffers>
    <ns12:PassengerReference nameReferenceNumber="3.1" passengerId="pax_3" passengerType="CNN"/>
    <ns12:OfferRefs/>
    <ns12:Ticket number="6079419628278">
      <ns12:CouponAssociation>
        <ns12:OfferRefs>offer_ancillary_1 offer_ancillary_2 offer_ancillary_7 offer_ancillary_8 offer_ancillary_24 offer_ancillary_25 offer_ancillary_26 offer_ancillary_27 offer_ancillary_28 offer_ancillary_29 offer_ancillary_30 offer_ancillary_31 offer_ancillary_32 offer_ancillary_33 offer_ancillary_34 offer_ancillary_58 offer_ancillary_62 offer_ancillary_63 offer_ancillary_86 offer_ancillary_87 offer_ancillary_88 offer_ancillary_89 offer_ancillary_90 offer_ancillary_91 offer_ancillary_92 offer_ancillary_93 offer_ancillary_94 offer_ancillary_95 offer_ancillary_96 offer_ancillary_97 offer_ancillary_98 offer_ancillary_99 offer_ancillary_100 offer_ancillary_101 offer_ancillary_102 offer_ancillary_139 offer_ancillary_140 offer_ancillary_546</ns12:OfferRefs>
        <ns12:Coupon>2</ns12:Coupon>
      </ns12:CouponAssociation>
      <ns12:CouponAssociation>
        <ns12:OfferRefs>offer_ancillary_3 offer_ancillary_4 offer_ancillary_9 offer_ancillary_10 offer_ancillary_35 offer_ancillary_36 offer_ancillary_37 offer_ancillary_38 offer_ancillary_39 offer_ancillary_40 offer_ancillary_41 offer_ancillary_42 offer_ancillary_43 offer_ancillary_44 offer_ancillary_59 offer_ancillary_64 offer_ancillary_65 offer_ancillary_103 offer_ancillary_104 offer_ancillary_105 offer_ancillary_106 offer_ancillary_107 offer_ancillary_108 offer_ancillary_109 offer_ancillary_110 offer_ancillary_111 offer_ancillary_112 offer_ancillary_113 offer_ancillary_114 offer_ancillary_115 offer_ancillary_116 offer_ancillary_117 offer_ancillary_118 offer_ancillary_119 offer_ancillary_141 offer_ancillary_142 offer_ancillary_547</ns12:OfferRefs>
        <ns12:Coupon>3</ns12:Coupon>
      </ns12:CouponAssociation>
      <ns12:CouponAssociation>
        <ns12:OfferRefs>offer_ancillary_5 offer_ancillary_6 offer_ancillary_13 offer_ancillary_14 offer_ancillary_15 offer_ancillary_16 offer_ancillary_17 offer_ancillary_18 offer_ancillary_19 offer_ancillary_20 offer_ancillary_21 offer_ancillary_22 offer_ancillary_23 offer_ancillary_57 offer_ancillary_61 offer_ancillary_69 offer_ancillary_70 offer_ancillary_71 offer_ancillary_72 offer_ancillary_73 offer_ancillary_74 offer_ancillary_75 offer_ancillary_76 offer_ancillary_77 offer_ancillary_78 offer_ancillary_79 offer_ancillary_80 offer_ancillary_81 offer_ancillary_82 offer_ancillary_83 offer_ancillary_84 offer_ancillary_85 offer_ancillary_137 offer_ancillary_138 offer_ancillary_545</ns12:OfferRefs>
        <ns12:Coupon>1</ns12:Coupon>
      </ns12:CouponAssociation>
      <ns12:CouponAssociation>
        <ns12:OfferRefs>offer_ancillary_11 offer_ancillary_12 offer_ancillary_45 offer_ancillary_46 offer_ancillary_47 offer_ancillary_48 offer_ancillary_49 offer_ancillary_50 offer_ancillary_51 offer_ancillary_52 offer_ancillary_53 offer_ancillary_54 offer_ancillary_55 offer_ancillary_56 offer_ancillary_60 offer_ancillary_66 offer_ancillary_120 offer_ancillary_121 offer_ancillary_122 offer_ancillary_123 offer_ancillary_124 offer_ancillary_125 offer_ancillary_126 offer_ancillary_127 offer_ancillary_128 offer_ancillary_129 offer_ancillary_130 offer_ancillary_131 offer_ancillary_132 offer_ancillary_133 offer_ancillary_134 offer_ancillary_135 offer_ancillary_136 offer_ancillary_143 offer_ancillary_144 offer_ancillary_548</ns12:OfferRefs>
        <ns12:Coupon>4</ns12:Coupon>
      </ns12:CouponAssociation>
      <ns12:CouponAssociation>
        <ns12:OfferRefs>offer_ancillary_67 offer_ancillary_145 offer_ancillary_146 offer_ancillary_150 offer_ancillary_154 offer_ancillary_156 offer_ancillary_160 offer_ancillary_164 offer_ancillary_168 offer_ancillary_170</ns12:OfferRefs>
        <ns12:Coupon>1</ns12:Coupon>
        <ns12:Coupon>2</ns12:Coupon>
      </ns12:CouponAssociation>
      <ns12:CouponAssociation>
        <ns12:OfferRefs>offer_ancillary_68 offer_ancillary_147 offer_ancillary_148 offer_ancillary_175 offer_ancillary_179 offer_ancillary_181 offer_ancillary_185 offer_ancillary_189 offer_ancillary_193 offer_ancillary_195</ns12:OfferRefs>
        <ns12:Coupon>3</ns12:Coupon>
        <ns12:Coupon>4</ns12:Coupon>
      </ns12:CouponAssociation>
    </ns12:Ticket>
  </ns37:PassengerOffers>
  <ns37:ResponseOptions>
    <ns37:EmptyGroupList>UU BD CO LG UP</ns37:EmptyGroupList>
    <ns37:InactiveGroupList>99 ST BF RO</ns37:InactiveGroupList>
  </ns37:ResponseOptions>
</ns37:GetAncillaryOffersRS>
```
{{< /details >}}
