---
title: История бронирований
aliases:
    - /booking-history
    - /get-booking-history
---

Для получения истории бронирования используется сервис [TravelItineraryHistoryLLSRQ](https://developer.sabre.com/docs/read/soap_apis/management/itinerary/get_itinerary_history).

В запросе необходимо указать код бронирования (Record Locator) в качестве значения атрибута ```/TravelItineraryHistoryRQ/UniqueID/@ID```. Перед открытием 

Ответ будет содержать все сохраненные изменения в бронировании.

Перед отправкой запрос открытие бронирования не требуется. После выполнения запроса бронирование будет открыто в текущей сессии.

{{< details title="Пример запроса" >}}
```XML
<TravelItineraryHistoryRQ ReturnHostCommand="true" Version="2.3.0" xmlns="http://webservices.sabre.com/sabreXML/2011/10">
  <UniqueID ID="BWFBNR"/>
</TravelItineraryHistoryRQ>
```
{{< /details >}}

{{< details title="Пример ответа" >}}
```XML
<TravelItineraryHistoryRS Version="2.3.0" xmlns="http://webservices.sabre.com/sabreXML/2011/10" xmlns:stl="http://services.sabre.com/STL/v01" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <stl:ApplicationResults status="Complete">
    <stl:Success timeStamp="2022-05-20T05:35:50-05:00">
      <stl:SystemSpecificResults>
        <stl:HostCommand LNIATA="19353B">JX HST*BWFBNR</stl:HostCommand>
      </stl:SystemSpecificResults>
    </stl:Success>
  </stl:ApplicationResults>
  <HistoricalInfo RPH="1">
    <ItineraryRef>
      <Source AAA_PseudoCityCode="9LSC" CreateDateTime="2022-05-20T05:32" CreationAgent="WT" CreationAgentDutyCode="*" CreationAgentFunctionCode="A" PseudoCityCode="9LSC" ReceivedFrom="API"/>
    </ItineraryRef>
    <RemarkInfo>
      <Remark Action="A5H">
        <Text>H-SPLIT TO/053152/20MAY22 TGIVIU 03/03 02/02 IVANOV/IVAN MR</Text>
      </Remark>
    </RemarkInfo>
  </HistoricalInfo>
  <HistoricalInfo RPH="2">
    <GeneralInfo Action="A9">
      <Text>MOW74991234567-A</Text>
    </GeneralInfo>
    <GeneralInfo Action="A9">
      <Text>MOW79851234567-M</Text>
    </GeneralInfo>
    <GeneralInfo Action="A3S">
      <Text>SSR DOCS EY HK1/P/RU/1234567890/RU/20NOV1980/M/20NOV2025/IVANOV/IVAN/IVANOVICH/H</Text>
    </GeneralInfo>
    <GeneralInfo Action="A3S">
      <Text>SSR DOCS EY HK1/P/RU/3234567890/RU/15JAN2012/M/20NOV2025/IVANOV/ANDREY/IVANOVICH</Text>
    </GeneralInfo>
    <GeneralInfo Action="A3S">
      <Text>SSR DOCS EY HK1/P/RU/1234567890/RU/20FEB2022/FI/15APR2025/IVANOVA/EKATERINA/IVANOVNA</Text>
    </GeneralInfo>
    <GeneralInfo Action="A3S">
      <Text>SSR INFT EY NN1 SYDAUH2463Y01DEC/IVANOVA/EKATERINA/20FEB22</Text>
    </GeneralInfo>
    <GeneralInfo Action="A3S">
      <Text>SSR INFT EY NN1 AUHLHR0025Y02DEC/IVANOVA/EKATERINA/20FEB22</Text>
    </GeneralInfo>
    <GeneralInfo Action="A3S">
      <Text>SSR INFT EY NN1 LHRAUH0012Y08DEC/IVANOVA/EKATERINA/20FEB22</Text>
    </GeneralInfo>
    <GeneralInfo Action="A3S">
      <Text>SSR INFT EY NN1 AUHSYD0464Y08DEC/IVANOVA/EKATERINA/20FEB22</Text>
    </GeneralInfo>
    <GeneralInfo Action="A3S">
      <Text>SSR CTCM EY HK1/79851234567/RU</Text>
    </GeneralInfo>
    <GeneralInfo Action="A3S">
      <Text>SSR CTCE EY HK1/CUSTOMER//CUSTOMER.COM/RU</Text>
    </GeneralInfo>
    <GeneralInfo Action="AN">
      <Text>1IVANOV/IVAN MR</Text>
    </GeneralInfo>
    <GeneralInfo Action="AN">
      <Text>1IVANOVA/ELENA MS</Text>
    </GeneralInfo>
    <GeneralInfo Action="AN">
      <Text>1IVANOV/ANDREY</Text>
    </GeneralInfo>
    <GeneralInfo Action="AN">
      <Text>I/1IVANOVA/EKATERINA</Text>
    </GeneralInfo>
    <GeneralInfo Action="AZ">
      <Text>NAME CHG NOT ALLOWED FOR EY-Y FARECLASS</Text>
    </GeneralInfo>
    <GeneralInfo Action="AZ">
      <Text>NAME CHG NOT ALLOWED FOR EY-Y FARECLASS</Text>
    </GeneralInfo>
    <GeneralInfo Action="AZ">
      <Text>NAME CHG NOT ALLOWED FOR EY-Y FARECLASS</Text>
    </GeneralInfo>
    <GeneralInfo Action="AZ">
      <Text>NAME CHG NOT ALLOWED FOR EY-Y FARECLASS</Text>
    </GeneralInfo>
    <GeneralInfo Action="A7">
      <Text>TAW/</Text>
    </GeneralInfo>
    <GeneralInfo Action="APE">
      <Text>EAGENCY@AGENCY.COMBC/</Text>
    </GeneralInfo>
    <GeneralInfo Action="APE">
      <Text>ECUSTOMER@CUSTOMER.COMTO/</Text>
    </GeneralInfo>
    <GeneralInfo Action="ADT">
      <Text>TADT</Text>
    </GeneralInfo>
    <GeneralInfo Action="ADT">
      <Text>TCNN</Text>
    </GeneralInfo>
    <GeneralInfo Action="ADT">
      <Text>TINF</Text>
    </GeneralInfo>
    <ItineraryInfo>
      <ReservationItems>
        <Item RPH="1">
          <FlightSegment Action="AS" ArrivalDateTime="12-02T06:40" ConnectionInd="O" DepartureDateTime="12-01T23:25" FlightNumber="2463" NumberInParty="03" ResBookDesigCode="Y" Status="SSNN" eTicket="true">
            <DestinationLocation LocationCode="AUH"/>
            <MarketingAirline Code="EY" FlightNumber="2463"/>
            <OriginLocation LocationCode="SYD"/>
            <SupplierRef ID="DCEY"/>
          </FlightSegment>
          <FlightSegment Action="AS" ArrivalDateTime="12-02T14:10" ConnectionInd="I" DepartureDateTime="12-02T10:35" FlightNumber="0025" NumberInParty="03" ResBookDesigCode="Y" Status="SSNN" eTicket="true">
            <DestinationLocation LocationCode="LHR"/>
            <MarketingAirline Code="EY" FlightNumber="0025"/>
            <OriginLocation LocationCode="AUH"/>
            <SupplierRef ID="DCEY"/>
          </FlightSegment>
          <FlightSegment Action="AS" ArrivalDateTime="12-08T19:20" ConnectionInd="O" DepartureDateTime="12-08T08:30" FlightNumber="0012" NumberInParty="03" ResBookDesigCode="Y" Status="SSNN" eTicket="true">
            <DestinationLocation LocationCode="AUH"/>
            <MarketingAirline Code="EY" FlightNumber="0012"/>
            <OriginLocation LocationCode="LHR"/>
            <SupplierRef ID="DCEY"/>
          </FlightSegment>
          <FlightSegment Action="AS" ArrivalDateTime="12-09T17:55" ConnectionInd="I" DepartureDateTime="12-08T22:10" FlightNumber="0464" NumberInParty="03" ResBookDesigCode="Y" Status="SSNN" eTicket="true">
            <DestinationLocation LocationCode="SYD"/>
            <MarketingAirline Code="EY" FlightNumber="0464"/>
            <OriginLocation LocationCode="AUH"/>
            <SupplierRef ID="DCEY"/>
          </FlightSegment>
        </Item>
      </ReservationItems>
    </ItineraryInfo>
    <ItineraryRef>
      <Source AAA_PseudoCityCode="2FRH" CreateDateTime="2022-05-20T05:31" CreationAgent="WT" CreationAgentDutyCode="*" CreationAgentFunctionCode="A" PseudoCityCode="9LSC" ReceivedFrom="API"/>
    </ItineraryRef>
  </HistoricalInfo>
</TravelItineraryHistoryRS>
```
{{< /details >}}
